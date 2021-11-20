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
import { getAssetAsBlobURL } from '../../../utils'

export type typeCoordinates = {
    x: number
    y: number
}

interface State {
    dragging: boolean // 鼠标左键是否按下
    pos: typeCoordinates
    start: typeCoordinates // 鼠标按下时记录值
    move: typeCoordinates
    prev: typeCoordinates
    type: string
    isClick: boolean
    isPause: boolean
    picGroup: string[]
    picSequence: { s: number[]; t: number }[]
    petW: number
    petH: number
    picInfo: { name: string; pics: string[]; sequence: { s: number[]; t: number }[] }[]
    transform: string
    isControl: boolean
    opacity: number
}

interface Props {
    direction: Direction
    menuAction: string
    setNewFrame: (type: string, url: string, isTurn: boolean) => void
    setDirection: (direction: Direction, position?: number) => void
    onMenuToggle: (type: boolean, pos?: { x: number; y: number }) => void
    setMenuTypeReset: () => void
}

let timer: NodeJS.Timeout
let animateTimer: number
let picIndex: number = 0

let sequenceNow = 0,
    sequenceNowTime = 0,
    sequencePicNow = 0
class Draggable extends React.PureComponent<Props> {
    ref = React.createRef<HTMLDivElement | null>()
    mouseMoveFuc = this.onMouseMove.bind(this)
    mouseUpFuc = this.onMouseUp.bind(this)
    windowResize = this.onWindowResize.bind(this)
    documentClick = this.onDocmentClick.bind(this)
    override state: State = {
        dragging: false,
        petW: 128,
        petH: 128,
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
        transform: '',
        opacity: 1,
        type: 'defalut',
        isControl: true, // 是否能被控制，有的时候需要锁定不让操作
        isClick: false,
        isPause: false, // 是否暂停
        picGroup: [],
        picSequence: [],
        picInfo: [
            {
                name: 'default',
                pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame15.png', import.meta.url))],
                sequence: [{ s: [0], t: Infinity }],
            },
            {
                name: 'walk',
                pics: [
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame2.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame3.png', import.meta.url)),
                ],
                sequence: [{ s: [0, 1], t: Infinity }],
            },
            {
                name: 'sit',
                pics: [
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame15.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame16.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame17.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame37.png', import.meta.url)),
                ],
                sequence: [{ s: [0, 1, 2, 3], t: Infinity }],
            },
            {
                name: 'fall',
                pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame4.png', import.meta.url))],
                sequence: [{ s: [0], t: Infinity }],
            },
            {
                name: 'standup',
                pics: [
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame18.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame19.png', import.meta.url)),
                ],
                sequence: [{ s: [0, 1], t: 1 }],
            },
            {
                name: 'drag',
                pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame9.png', import.meta.url))],
                sequence: [{ s: [0], t: Infinity }],
            },
            {
                name: 'climb',
                pics: [
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame_climb01.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame_climb03.png', import.meta.url)),
                ],
                sequence: [{ s: [0, 1], t: Infinity }],
            },
            {
                name: 'sleep',
                pics: [
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame19.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame18.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame21.png', import.meta.url)),
                ],
                sequence: [
                    { s: [0, 1, 1], t: 3 },
                    { s: [2], t: 50 },
                    { s: [1, 0], t: 3 },
                ],
            },
        ],
    }

    override componentDidMount() {
        window.addEventListener('resize', this.windowResize)
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
        if (this.state.dragging && !state.dragging) {
            document.addEventListener('mousemove', this.mouseMoveFuc, false)
            document.addEventListener('mouseup', this.mouseUpFuc, false)
            console.log('绑定事件')
        } else if (!this.state.dragging && state.dragging) {
            console.log('取消事件')
            document.removeEventListener('mousemove', this.mouseMoveFuc, false)
            document.removeEventListener('mouseup', this.mouseUpFuc, false)
        }

        if (this.props.menuAction && _props.menuAction !== this.props.menuAction) {
            console.log('触发菜单动作')
            this.onMenuAction(this.props.menuAction)
        }
    }
    override componentWillUnmount() {
        stopAnimate()
        document.removeEventListener('mousemove', this.mouseMoveFuc, false)
        document.removeEventListener('mouseup', this.mouseUpFuc, false)
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

    onMouseDown(e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()

        if (e.button !== 0) return
        if (!this.ref?.current) return

        this.setState({
            dragging: true,
            start: {
                x: e.pageX,
                y: e.pageY,
            },
            isClick: true,
        })
    }

    onMouseMove(e: MouseEvent) {
        if (!this.state.dragging) return
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

    // 暂停动画和图片 - menu出现
    onPause() {
        pauseAnimate()
        this.setState({
            isPause: true,
        })
        document.addEventListener('mouseup', this.documentClick, false)
    }

    // 恢复 - menu消失
    onResove() {
        restore()
        this.setState({
            isPause: false,
        })
        document.removeEventListener('mouseup', this.documentClick, false)
    }

    onMouseUp(e: MouseEvent) {
        if (this.state.isClick) {
            this.onPause()
            this.props.onMenuToggle(true, this.state.pos)
        }
        this.setState(
            {
                dragging: false,
                pos: {
                    x: this.state.pos.x + this.state.move.x,
                    y: this.state.pos.y + this.state.move.y,
                },
                move: {
                    x: 0,
                    y: 0,
                },
                isClick: false,
            },
            () => this.checkStatus(),
        )

        e.stopPropagation()
        e.preventDefault()
    }

    // 用户点击文档中空白区域，收起菜单
    onDocmentClick() {
        this.onResove()
        this.props.onMenuToggle(false)
    }

    // 获取当前该显示哪个图片组 并开始动画帧循环
    getNowPicUrl(type: string, isLoop = true, frameTurn = 50) {
        cancelAnimationFrame(animateTimer)
        const action = this.state.picInfo.find((item) => item.name === type)
        console.log('但是应该换成了climb')
        this.setState(
            {
                type,
                picGroup: action?.pics ?? [],
                picSequence: action?.sequence,
            },
            () => {
                if (['sit'].includes(type)) {
                    this.animateChangesPicsRandom(
                        this.state.picGroup,
                        frameTurn,
                        frameTurn,
                        Date.now() + Math.random() * 5000 + 5000,
                    )
                } else {
                    sequenceNow = 0
                    sequenceNowTime = 0
                    sequencePicNow = 0
                    this.animateChangesSquence(this.state.picGroup, frameTurn, frameTurn, this.state.picSequence)
                }

                if (type === 'default') {
                    console.log('type等于default了')
                    freeOnStandby(
                        3000,
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
     * @param {number} sequenceNow 播放到第几个序列了
     * @param {number} sequenceNowTime 当前序列播放第几次了
     * @param {number} sequencePicNow 当前指向当前序列的第几个元素
     */
    animateChangesSquence(group: string[], frame: number, frameTurn: number, sequence: { s: number[]; t: number }[]) {
        if (this.state.isPause) {
            animateTimer = requestAnimationFrame(() => this.animateChangesSquence(group, frame, frameTurn, sequence))
            return
        }

        let frameNext = frame
        if (frame > frameTurn) {
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
                        this.beginOneActionPrepare('default')
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
        animateTimer = requestAnimationFrame(() => this.animateChangesSquence(group, frameNext, frameTurn, sequence))
    }

    // 检查当前状态，判定应该执行什么动画
    checkStatus() {
        console.log('checkStatus开始判定')

        // 如果此时宠物正处于抓住的状态，则替换抓住的图片
        if (this.state.dragging) {
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
        console.log('一个动作被触发：', action)
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
                this.getNowPicUrl('walk', true, 20)
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
                this.getNowPicUrl('sit', true, 80)
                break
            case 'climb':
                this.getNowPicUrl('climb', true, 30)
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
                this.getNowPicUrl('sleep', true, 30)
                break
            case 'standup':
                this.getNowPicUrl('standup', false, 10)
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

    onShowMenu(e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        this.onPause()
        this.props.onMenuToggle(true, this.state.pos)
        return false
    }

    // 阻止冒泡，因为全局有右键菜单
    onDivClick(e: React.MouseEvent) {
        e.nativeEvent.stopPropagation()
    }

    // 菜单动作处理
    onMenuAction(type: string) {
        console.log('大哥你不一样？', type, this.state.type)
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
        }
    }

    override render() {
        return (
            <div
                //@ts-ignore
                ref={this.ref}
                onMouseDown={this.onMouseDown.bind(this)}
                onContextMenu={this.onShowMenu.bind(this)}
                onClick={this.onDivClick.bind(this)}
                style={{
                    position: 'fixed',
                    top: this.state.pos.y + this.state.move.y,
                    left: this.state.pos.x + this.state.move.x,
                    width: this.state.petW,
                    height: this.state.petH,
                    transform: this.state.transform,
                    opacity: this.state.opacity,
                    pointerEvents: this.state.isControl ? 'auto' : 'none',
                    transition: 'opacity 200ms, transform 300ms',
                }}>
                {this.props.children || null}
            </div>
        )
    }
}

export default Draggable
