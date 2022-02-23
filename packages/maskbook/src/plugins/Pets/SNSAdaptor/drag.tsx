import React from 'react'
import {
    startAnimate,
    choseAction,
    freeOnStandby,
    onActionsEnd,
    Direction,
    stopAnimate,
    pauseAnimate,
    restore,
} from './petActionAnimate'

export type typeCoordinates = {
    x: number
    y: number
}

interface State {
    isMouseDown: number // 鼠标左键是否在宠物身上按下, -1未按下，0左键，2右键
    pos: typeCoordinates
    start: typeCoordinates // 鼠标按下时记录值
    move: typeCoordinates
    prev: typeCoordinates
    type: string
    isClick: boolean
    isPause: boolean
    picGroup: string[]
    picSequence: { s: number[]; t: number; f: number }[]
    petW: number
    petH: number
    transform: string
    isControl: boolean
    opacity: number
    mouseChoseType: number
    choseBox: { left: number; top: number; width: number; height: number; border: string; borderRadius: string }
}

interface Props {
    direction: Direction
    menuAction: string
    isMenuShow: boolean
    picInfo: { name: string; pics: string[]; sequence: { s: number[]; t: number }[] }[]
    setNewFrame: (type: string, url: string, isTurn: boolean) => void
    setDirection: (direction: Direction, position?: number) => void
    onMenuToggle: (type: boolean, pos?: { x: number; y: number }) => void
    setMenuTypeReset: () => void
}

let timer: NodeJS.Timeout
let animateTimer: number
let picIndex: number = 0

let sequenceNow = 0, // 当前该播放第几个序列
    sequenceNowTime = 0, // 达到一定值后切换到下一个序列
    sequencePicNow = 0 // 当前该播放第几个图片

let domPrev: HTMLElement | null
class Draggable extends React.PureComponent<Props> {
    ref = React.createRef<HTMLDivElement | null>()
    choseBoxRef = React.createRef<HTMLDivElement | null>()

    mouseMoveFuc = this.onMouseMove.bind(this)
    mouseUpFuc = this.onMouseUp.bind(this)
    windowResize = this.onWindowResize.bind(this)
    documentMouseDown = this.onDocumentMouseDown.bind(this)
    override state: State = {
        isMouseDown: -1,
        petW: 128,
        petH: 128, // 128
        pos: {
            // 最终机器人的位置
            x: 0,
            y: 0,
        },
        start: {
            // 鼠标按下时的位置
            x: 0,
            y: 0,
        },
        move: {
            // 本次鼠标移动距离
            x: 0,
            y: 0,
        },
        prev: {
            // 上一次的鼠标位置
            x: 0,
            y: 0,
        },
        choseBox: {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            border: '2px solid #ffcc66',
            borderRadius: '6px',
        },
        transform: '',
        opacity: 1,
        type: 'defalut', // 当前的动作
        isControl: true, // 是否能被控制，有的时候需要锁定不让操作
        isClick: false, // 是否是点击动作，用于判断右键菜单是否应该响应
        isPause: false, // 是否暂停
        mouseChoseType: 0, // 是否是鼠标选择元素动作中 0隐藏/1出现/2出现并响应鼠标事件
        picGroup: [],
        picSequence: [],
    }

    override componentDidMount() {
        window.addEventListener('resize', this.windowResize)
        document.addEventListener('mousemove', this.mouseMoveFuc, false)
        document.addEventListener('mouseup', this.mouseUpFuc, true)
        startAnimate()
        this.setState(
            {
                pos: {
                    x: window.innerWidth - this.state.petW - 50,
                    y: window.innerHeight / 2,
                },
            },
            () => this.checkStatus(),
        )
    }

    override componentDidUpdate(_props: any, state: State) {
        // if (this.state.isMouseDown && !state.isMouseDown) {
        //     document.addEventListener('mousemove', this.mouseMoveFuc, false)
        //     document.addEventListener('mouseup', this.mouseUpFuc, false)

        // } else if (!this.state.isMouseDown && state.isMouseDown) {

        //     document.removeEventListener('mousemove', this.mouseMoveFuc, false)
        //     document.removeEventListener('mouseup', this.mouseUpFuc, false)
        // }

        if (this.props.menuAction && _props.menuAction !== this.props.menuAction) {
            this.onMenuAction(this.props.menuAction)
        }
    }
    override componentWillUnmount() {
        stopAnimate()
        document.removeEventListener('mousemove', this.mouseMoveFuc, false)
        document.removeEventListener('mouseup', this.mouseUpFuc, true)
        window.removeEventListener('resize', this.windowResize)
    }

    onWindowResize() {
        this.setState({
            pos: {
                x: Math.max(Math.min(this.state.pos.x, window.innerWidth - this.state.petW), 0),
                y: Math.max(Math.min(this.state.pos.y, window.innerHeight - this.state.petH), 0),
            },
        })

        // 窗口大小改变后需要重新定位
        clearTimeout(timer)
        timer = setTimeout(() => {
            this.checkStatus()
        }, 500)
    }

    // 这个仅绑定在宠物身上
    onMouseDown(e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        if (this.state.isMouseDown !== -1) {
            return
        }
        this.setState({
            isMouseDown: e.button, // 按下左键是抓住,非左键保持原有状态（在空中按右键情况）
            start: {
                x: e.pageX,
                y: e.pageY,
            },
            isClick: true,
        })
    }

    onMouseMove(e: MouseEvent) {
        // 是鼠标选择器行为
        if (this.state.mouseChoseType) {
            this.onMouseChoseing(e)
            return
        }

        // 不是拖拽行为（可能是右键或普通移动）
        if (this.state.isMouseDown !== 0) {
            return
        }

        // 是拖拽行为
        if (this.state.type !== 'drag') {
            this.checkStatus()
        }
        if (this.state.isPause) {
            this.onResove()
            this.props.onMenuToggle(false)
        }
        // 计算当前还能够向左移动多少距离
        const minX = -this.state.pos.x
        const maxX = window.innerWidth - this.state.pos.x - this.state.petW - 20 // 20为滚动条宽度
        const minY = -this.state.pos.y
        const maxY = window.innerHeight - this.state.pos.y - this.state.petH
        // 向右移动
        if (e.pageX > this.state.prev.x && this.props.direction === Direction.right) {
            this.props.setDirection(Direction.left)
        } else if (e.pageX < this.state.prev.x && this.props.direction === Direction.left) {
            this.props.setDirection(Direction.right)
        }
        this.setState({
            move: {
                x: Math.max(Math.min(e.pageX - this.state.start.x, maxX), minX),
                y: Math.max(Math.min(e.pageY - this.state.start.y, maxY), minY),
            },
            prev: {
                x: e.pageX,
                y: 0,
            },
            isClick: false,
        })
        e.stopPropagation()
        e.preventDefault()
    }

    onMouseUp(e: MouseEvent) {
        // 鼠标选择器放开逻辑
        if (this.state.mouseChoseType) {
            if (domPrev) {
                this.setState({
                    isMouseDown: -1,
                })
                this.onResove()
                this.beginOneActionPrepare('shift')
            }
            return
        }

        if (this.state.isMouseDown === 0) {
            // 下面是drag后放开逻辑
            const isClickPrev = this.state.isClick // 这个isClick是为了判断是否应该呼出菜单 还是 只是普通的拖拽
            this.setState(
                {
                    isClick: false,
                    pos: {
                        x: this.state.pos.x + this.state.move.x,
                        y: this.state.pos.y + this.state.move.y,
                    },
                    move: {
                        x: 0,
                        y: 0,
                    },
                },
                () => {
                    if (isClickPrev) {
                        // 是宠物身上的左键点击行为，切换菜单的显示和隐藏
                        this.props.isMenuShow ? this.onResove() : this.onPause('b')
                        this.props.onMenuToggle(!this.props.isMenuShow, this.state.pos)
                    } else {
                        // 是普通的拖拽后放开，判断状态
                        this.checkStatus()
                    }
                },
            )
        } else if (this.state.isMouseDown === 2) {
            // 宠物身上右键放开
            this.props.isMenuShow ? this.onResove() : this.onPause('a')
            this.props.onMenuToggle(!this.props.isMenuShow, this.state.pos)
        } else {
            // 鼠标其他按键放开 或 空白处点击放开
            this.onResove()
            this.props.onMenuToggle(false, this.state.pos)
        }
        this.setState({
            isMouseDown: -1,
        })

        e.stopPropagation()
        e.preventDefault()
    }

    // 暂停动画和图片 - menu出现
    onPause(type?: string) {
        pauseAnimate()
        this.setState({
            isPause: true,
        })

        if (type === 'shift') {
            document.addEventListener('mousedown', this.documentMouseDown, true)
        }
    }

    // 恢复 - menu消失
    onResove() {
        restore()
        this.setState({
            isPause: false,
        })

        document.removeEventListener('mousedown', this.documentMouseDown, true)
    }

    // 获取当前该显示哪个图片组 并开始动画帧循环
    getNowPicUrl(type: string, frameTurn = 50) {
        cancelAnimationFrame(animateTimer)
        const action = this.props.picInfo.find((item) => item.name === type)
        this.setState(
            {
                type,
                picGroup: action?.pics ?? [],
                picSequence: action?.sequence,
            },
            () => {
                if (type === 'sit') {
                    this.animateChangesPicsRandom(
                        this.state.picGroup,
                        frameTurn,
                        frameTurn,
                        Date.now() + Math.random() * 5000 + 5000,
                    )
                } else {
                    sequenceNow = 0
                    sequenceNowTime = 0
                    sequencePicNow = -1
                    let nextAction = 'default'
                    if (type === 'shiftend') {
                        nextAction = 'stand'
                    }
                    this.animateChangesSquence(this.state.picGroup, frameTurn, this.state.picSequence, nextAction)
                }

                if (type === 'default') {
                    freeOnStandby(
                        3000, // 3000
                        this.state.pos,
                        this.state.petW,
                        this.state.petH,
                        this.beginOneActionPrepare.bind(this),
                    )
                }
            },
        )
    }

    // 随机图片组动画循环播放函数
    animateChangesPicsRandom(group: string[], frame: number, frameTurn: number, endTime: number) {
        animateTimer = requestAnimationFrame(() => this.animateChangesPicsRandom(group, frame + 1, frameTurn, endTime))
        if (frame > frameTurn) {
            if (Date.now() > endTime) {
                this.beginOneActionPrepare('default')
            } else {
                frame = 0
                picIndex = Math.round(Math.random() * (this.state.picGroup.length - 1))
                this.props.setNewFrame(this.state.type, this.state.picGroup[picIndex], Math.random() > 0.7)
            }
        }
    }

    /**
     * 序列图片组动画循环
     * @param {string[]} group  图片组
     * @param {number} frame 帧数
     * @param {number} frameTurn 帧数该换的值
     * @param {number[][]} sequence 动画序列 [{s: [1,2,3], t: 1}, {s: [4], t: -1}]， s存group下标， t表示这个序列需要被循环多少次
     */
    animateChangesSquence(
        group: string[],
        frame: number,
        sequence: { s: number[]; t: number; f: number }[],
        nextAction = 'default',
    ) {
        if (this.state.isPause) {
            animateTimer = requestAnimationFrame(() => this.animateChangesSquence(group, frame, sequence))
            return
        }

        let frameNext = frame
        if (frame > sequence[sequenceNow].f) {
            sequencePicNow = sequencePicNow + 1
            if (sequencePicNow >= sequence[sequenceNow].s.length) {
                sequencePicNow = 0
                sequenceNowTime = sequenceNowTime + 1
                if (sequenceNowTime >= sequence[sequenceNow].t) {
                    sequenceNowTime = 0
                    sequenceNow = sequenceNow + 1
                    if (sequenceNow >= sequence.length) {
                        // 一个动画序列结束 意味着一个动作结束，一般动画序列是无限循环的，动作结束依靠动作位移序列判定
                        // 但也有一些动作是没有位移的，依靠动画序列判定
                        this.beginOneActionPrepare(nextAction)
                        return
                    }
                }
            }

            picIndex = sequence[sequenceNow].s[sequencePicNow]
            this.props.setNewFrame(this.state.type, this.state.picGroup[picIndex], false)
            frameNext = 0
        } else {
            frameNext = frame + 1
        }
        animateTimer = requestAnimationFrame(() => this.animateChangesSquence(group, frameNext, sequence, nextAction))
    }

    // 检查当前状态，判定应该执行什么动画
    checkStatus() {
        // 如果此时宠物正处于抓住的状态，则替换抓住的图片
        if (this.state.isMouseDown === 0) {
            this.beginOneActionPrepare('drag')
            return
        }

        // 如果此时宠物没有处于屏幕底部，则需要执行坠落动画
        if (this.state.pos.y + this.state.petW < window.innerHeight) {
            this.beginOneActionPrepare('fall')
            return
        }

        // 如果没有状态命中，则开始默认动作
        this.beginOneActionPrepare('default')
    }

    // 开始执行某动作，触发指定的动作位移循环
    beginOneActionPrepare(action: string, menuActionInfo?: { x: number; y: number; next: string }) {
        onActionsEnd()
        switch (action) {
            case 'default':
                this.getNowPicUrl('default')
                break
            case 'drag':
                this.getNowPicUrl('drag')
                break
            case 'fall':
                this.getNowPicUrl('fall')
                choseAction('fall', {
                    y: this.state.pos.y,
                    petH: this.state.petH,
                    distance: 5,
                    callback: this.onPetFallActionCallback.bind(this),
                })
                break
            case 'walk':
                let direction
                if (this.state.pos.x > this.state.petW && this.state.pos.x < window.innerWidth - this.state.petW - 20) {
                    direction = Math.random() > 0.5 ? Direction.right : Direction.left
                } else {
                    direction = this.state.pos.x < window.innerWidth / 2 ? Direction.right : Direction.left
                }
                this.getNowPicUrl('walk')
                this.props.setDirection(direction)
                choseAction('walk', {
                    x: this.state.pos.x,
                    petW: this.state.petW,
                    direction,
                    endTime: Date.now() + (Math.random() * 4 + 3) * 1000,
                    callback: this.onWalkActionCallback.bind(this),
                })
                break
            case 'sit':
                this.getNowPicUrl('sit')
                break
            case 'climb':
                this.getNowPicUrl('climb')
                const isL = this.state.pos.x < window.innerWidth / 2
                const direction2 = isL ? Direction.right : Direction.left
                this.props.setDirection(direction2, 2)
                choseAction('climb', {
                    y: this.state.pos.y,
                    callback: this.onPetClimbActionCallback.bind(this),
                })
                break
            case 'sleep':
                this.setState({
                    pos: {
                        x: this.state.pos.x,
                        y: window.innerHeight - this.state.petH,
                    },
                })
                this.getNowPicUrl('sleep')
                break
            case 'standup':
                this.getNowPicUrl('standup')
                break
            case 'transfer':
                if (!menuActionInfo) {
                    return
                }
                this.getNowPicUrl('fall') // 传送时用的图片，暂时和fall一样
                this.setState({
                    isControl: false,
                    transform: 'scale(0,0)',
                    opacity: 0,
                })

                setTimeout(() => {
                    this.setState(
                        {
                            isControl: true,
                            transform: 'scale(1,1)',
                            opacity: 1,
                            pos: {
                                x: menuActionInfo.x,
                                y: menuActionInfo.y,
                            },
                        },
                        () => {
                            this.beginOneActionPrepare(menuActionInfo.next)
                        },
                    )
                }, 300)
                break
            case 'shift':
                this.setState({
                    mouseChoseType: 0,
                })
                const rect = domPrev?.getBoundingClientRect()

                if (rect) {
                    const resX = rect.left + rect.width / 2 - this.state.petW / 2
                    const resY = rect.top - this.state.petH + 25
                    const x = this.state.pos.x
                    const y = this.state.pos.y
                    this.getNowPicUrl('shift')

                    const params = {
                        x,
                        y,
                        cx: Math.abs(resX - x) / 2 + Math.min(resX, x),
                        cy: Math.min(resY, y) - 50,
                        resX,
                        resY,
                        z: 1,
                        callback: this.onPetShiftActionCallback.bind(this),
                    }

                    this.props.setDirection(params.x < params.resX ? Direction.right : Direction.left)

                    choseAction('shift', params)
                } else {
                    this.checkStatus()
                }
                break
            case 'shiftend':
                this.getNowPicUrl('shiftend')
                break
            case 'stand':
                choseAction('stand', {
                    domPrev,
                    petW: this.state.petW,
                    petH: this.state.petH,
                    callback: this.onPetStandActionCallback.bind(this),
                })
                this.getNowPicUrl('stand')
                break
        }
    }

    // 坠落动画 回调函数
    onPetFallActionCallback(options: { y: number; isLast?: boolean }) {
        this.setState({
            pos: {
                x: this.state.pos.x,
                y: options.y,
            },
        })

        if (options.isLast) {
            this.beginOneActionPrepare('standup')
        }
    }

    // 行走动画 回调函数
    onWalkActionCallback(options: { x: number; isLast?: boolean }) {
        this.setState({
            pos: {
                x: options.x,
                y: this.state.pos.y,
            },
        })

        if (options.isLast) {
            if (options.x <= 1 || options.x >= window.innerWidth - this.state.petW - 21) {
                this.beginOneActionPrepare('climb')
            } else {
                this.beginOneActionPrepare('default')
            }
        }
    }

    // 爬墙 回调函数
    onPetClimbActionCallback(options: { y: number; isLast?: boolean }) {
        this.setState({
            pos: {
                x: this.state.pos.x < window.innerWidth / 2 ? 0 : window.innerWidth - this.state.petW - 20,
                y: options.y,
            },
        })

        if (options.isLast) {
            this.checkStatus()
        }
    }

    // 跳跃 回调函数
    onPetShiftActionCallback(options: { x: number; y: number; isLast?: boolean }) {
        if (options.isLast) {
            this.beginOneActionPrepare('shiftend')
            return
        }

        this.setState({
            pos: {
                x: options.x,
                y: options.y,
            },
        })
    }

    // 站立 跟随 回调函数
    onPetStandActionCallback(options: { x: number; y: number }) {
        this.setState({
            pos: {
                x: options.x,
                y: options.y,
            },
        })
    }

    // 阻止默认右键菜单
    onShowMenu(e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        return false
    }

    // 阻止冒泡，因为全局有右键菜单
    onStopPop(e: React.MouseEvent) {
        e.nativeEvent.stopPropagation()
        e.stopPropagation()
    }

    // 菜单动作处理
    onMenuAction(type: string) {
        this.onResove()
        this.props.onMenuToggle(false)
        this.props.setMenuTypeReset()
        if (type === this.state.type) {
            return
        }
        switch (type) {
            case 'reset':
                this.beginOneActionPrepare('transfer', {
                    x: window.innerWidth - this.state.petW - 50,
                    y: window.innerHeight / 3,
                    next: 'fall',
                })
                break
            case 'climb':
                const x = this.state.pos.x < window.innerWidth / 2 ? 0 : window.innerWidth - this.state.petW
                const y = window.innerHeight - this.state.petH
                this.beginOneActionPrepare('transfer', { x, y, next: 'climb' })
                break
            case 'sleep':
                if (this.state.pos.y < window.innerHeight - this.state.petH - 2) {
                    this.beginOneActionPrepare('transfer', {
                        x: this.state.pos.x,
                        y: window.innerHeight - this.state.petH,
                        next: 'sleep',
                    })
                } else {
                    this.beginOneActionPrepare('sleep')
                }
                break
            case 'shift':
                // 动画都暂停
                this.onPause('shift')
                // 开启选择器
                this.setState({
                    mouseChoseType: 1,
                })
        }
    }

    // 开始选择鼠标所在位置元素
    onMouseChoseing(e: MouseEvent) {
        const domNow = document.elementFromPoint(
            e.pageX - document.documentElement.scrollLeft,
            e.pageY - document.documentElement.scrollTop,
        )
        // dom.style.backgroundColor = '#f00';
        if (!domNow || domNow.nodeType !== 1 || domNow === document.body) {
            domPrev = null
            return
        }
        domPrev = domNow as HTMLElement

        const rect = domNow.getBoundingClientRect()
        this.setState({
            choseBox: {
                ...this.state.choseBox,
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            },
        })
    }

    // 在鼠标选择器阶段，需要在捕获阶段，如果鼠标按下需要让box响应事件已阻止页面元素的点击行为
    onDocumentMouseDown(e: MouseEvent) {
        e.stopPropagation()
        this.setState({
            mouseChoseType: 2,
        })
    }

    override render() {
        return [
            <div
                //@ts-ignore
                ref={this.ref}
                key="drag-box"
                onMouseDown={this.onMouseDown.bind(this)}
                onContextMenu={this.onShowMenu.bind(this)}
                onClick={this.onStopPop}
                style={{
                    position: this.state.type === 'stand' ? 'absolute' : 'fixed',
                    top: this.state.pos.y + this.state.move.y,
                    left: this.state.pos.x + this.state.move.x,
                    width: this.state.petW,
                    height: this.state.petH,
                    transform: this.state.transform,
                    opacity: this.state.opacity,
                    pointerEvents: this.state.isControl ? 'auto' : 'none',
                    transition: 'opacity 100ms, transform 200ms',
                }}>
                {this.props.children || null}
            </div>,
            this.state.mouseChoseType > 0 && (
                <div
                    //@ts-ignore
                    ref={this.choseBoxRef}
                    key="chose-box"
                    style={{
                        position: 'fixed',
                        pointerEvents: this.state.mouseChoseType === 1 ? 'none' : 'auto',
                        ...this.state.choseBox,
                    }}
                />
            ),
        ]
    }
}

export default Draggable
