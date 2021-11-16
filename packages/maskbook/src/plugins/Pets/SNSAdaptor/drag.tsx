import React from 'react'
import { startAnimate, choseAction, freeOnStandby, onActionsEnd, Direction, stopAnimate } from './petActionAnimate'
import { getAssetAsBlobURL } from '../../../utils'

export type typeCoordinates = {
    x: number
    y: number
}

interface StateProps {
    dragging: boolean // 是否正在抓取
    pos: typeCoordinates
    start: typeCoordinates // 鼠标按下时记录值
    move: typeCoordinates
    prev: typeCoordinates
    picGroup: string[]
    petW: number
    petH: number
    picInfo: { name: string; pics: string[] }[]
}

interface Props {
    direction: Direction
    setNewFrame: (url: string, isTurn: boolean) => void
    setDirection: (direction: Direction, position?: number) => void
}

let timer: NodeJS.Timeout
let animateTimer: number
let picIndex: number = 0

class Draggable extends React.PureComponent<Props> {
    ref = React.createRef<HTMLDivElement | null>()
    mouseMoveFuc = this.onMouseMove.bind(this)
    mouseUpFuc = this.onMouseUp.bind(this)
    windowResize = this.onWindowResize.bind(this)

    override state: StateProps = {
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
        picGroup: [],
        picInfo: [
            {
                name: 'default',
                pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame15.png', import.meta.url))],
            },
            {
                name: 'walk',
                pics: [
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame2.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame3.png', import.meta.url)),
                ],
            },
            {
                name: 'sit',
                pics: [
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame15.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame16.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame17.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame37.png', import.meta.url)),
                ],
            },
            {
                name: 'fall',
                pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame4.png', import.meta.url))],
            },
            {
                name: 'standup',
                pics: [
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame18.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame19.png', import.meta.url)),
                ],
            },
            {
                name: 'drag',
                pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame9.png', import.meta.url))],
            },
            {
                name: 'climb',
                pics: [
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame_climb01.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame_climb03.png', import.meta.url)),
                ],
            },
            {
                name: 'sleep',
                pics: [
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame19.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame18.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame21.png', import.meta.url)),
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

    override componentDidUpdate(_props: any, state: StateProps) {
        if (this.state.dragging && !state.dragging) {
            document.addEventListener('mousemove', this.mouseMoveFuc)
            document.addEventListener('mouseup', this.mouseUpFuc)
        } else if (!this.state.dragging && state.dragging) {
            document.removeEventListener('mousemove', this.mouseMoveFuc)
            document.removeEventListener('mouseup', this.mouseUpFuc)
        }
    }
    override componentWillUnmount() {
        stopAnimate()
        document.removeEventListener('mousemove', this.mouseMoveFuc)
        document.removeEventListener('mouseup', this.mouseUpFuc)
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

        this.setState(
            {
                dragging: true,
                start: {
                    x: e.pageX,
                    y: e.pageY,
                },
            },
            () => this.checkStatus(),
        )
    }

    onMouseMove(e: MouseEvent) {
        if (!this.state.dragging) return
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
        })
        e.stopPropagation()
        e.preventDefault()
    }

    onMouseUp(e: MouseEvent) {
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
            },
            () => this.checkStatus(),
        )

        e.stopPropagation()
        e.preventDefault()
    }

    // 获取当前该显示哪个图片组
    getNowPicUrl(type: string, isLoop = true, frameTurn = 50) {
        cancelAnimationFrame(animateTimer)
        const action = this.state.picInfo.find((item) => item.name === type)
        this.setState(
            {
                picGroup: action?.pics ?? [],
            },
            () => {
                if (['sit'].includes(type)) {
                    this.animateChangesPicsRandom(
                        this.state.picGroup,
                        100,
                        frameTurn,
                        Date.now() + Math.random() * 5000 + 5000,
                    )
                } else {
                    this.animateChangesPics(this.state.picGroup, 50, frameTurn, isLoop)
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

    // 通用图片组动画循环播放函数
    animateChangesPics(group: string[], frame: number, frameTurn: number, isLoop: boolean, sequence?: {}) {
        animateTimer = requestAnimationFrame(() => this.animateChangesPics(group, frame + 1, frameTurn, isLoop))
        if (frame > frameTurn) {
            frame = 0

            if (picIndex > this.state.picGroup.length - 1) {
                if (isLoop) {
                    picIndex = 0
                } else {
                    cancelAnimationFrame(animateTimer)
                    this.getNowPicUrl('default')
                }
            }

            this.props.setNewFrame(this.state.picGroup[picIndex], false)

            if (sequence) {
            }
            picIndex = picIndex + 1
        }
    }

    // 随机图片组动画循环播放函数
    animateChangesPicsRandom(group: string[], frame: number, frameTurn: number, endTime: number) {
        animateTimer = requestAnimationFrame(() => this.animateChangesPicsRandom(group, frame + 1, frameTurn, endTime))
        if (frame > frameTurn) {
            if (Date.now() > endTime) {
                this.getNowPicUrl('default')
            } else {
                frame = 0
                picIndex = Math.round(Math.random() * (this.state.picGroup.length - 1))
                this.props.setNewFrame(this.state.picGroup[picIndex], Math.random() > 0.6)
            }
        }
    }

    // 检查当前状态，判定应该执行什么动画
    checkStatus() {
        console.log('checkStatus开始判定')
        onActionsEnd()

        // 如果此时宠物正处于抓住的状态，则替换抓住的图片
        if (this.state.dragging) {
            this.getNowPicUrl('drag')
            console.log('checkStatus: 判定为拖拽中')
            return
        }

        // 如果此时宠物没有处于屏幕底部，则需要执行坠落动画
        if (this.state.pos.y + this.state.petW < window.innerHeight) {
            this.beginOneActionPrepare('fall')
            return
        }

        // 如果没有状态命中，则替换默认图片
        console.log('checkStatus没有状态命中，变为default')
        this.getNowPicUrl('default')
    }

    // 自动执行某动作时触发指定的动作
    beginOneActionPrepare(action: string) {
        console.log('一个动作被触发：', action)
        switch (action) {
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
                    callback: this.onWalkActionCallback.bind(this),
                })
                break
            case 'sit':
                this.getNowPicUrl('sit', true, 100)
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
                this.getNowPicUrl('sleep', true, 20)
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
            this.getNowPicUrl('standup', false, 10)
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
            this.beginOneActionPrepare('climb')
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
            console.log('爬墙结束')
            // 开始倒立
            // this.getNowPicUrl('fall')
            this.checkStatus()
        }
    }

    override render() {
        return (
            <div
                //@ts-ignore
                ref={this.ref}
                onMouseDown={this.onMouseDown.bind(this)}
                style={{
                    position: 'fixed',
                    top: this.state.pos.y + this.state.move.y,
                    left: this.state.pos.x + this.state.move.x,
                    width: this.state.petW,
                    height: this.state.petH,
                }}>
                {this.props.children || null}
            </div>
        )
    }
}

export default Draggable
