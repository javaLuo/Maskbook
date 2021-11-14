import React from 'react'
import { clearAllAnimate, onPetFallAction, onPetWalkAction, Direction, freeOnStandby } from './petActions'
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
    picGroup: string[]
    petW: number
    petH: number
    picInfo: { name: string; pics: string[]; w: number; h: number }[]
}

interface Props {
    setPicShow: (url: string) => void
    setPicDirection: (direction: Direction) => void
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
        picGroup: [],
        picInfo: [
            {
                name: 'default',
                pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame1.png', import.meta.url))],
                w: 128,
                h: 128,
            },
            {
                name: 'walk',
                pics: [
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame2.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame3.png', import.meta.url)),
                ],
                w: 128,
                h: 128,
            },
            {
                name: 'fall',
                pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame4.png', import.meta.url))],
                w: 128,
                h: 128,
            },
            {
                name: 'standup',
                pics: [
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame18.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame19.png', import.meta.url)),
                ],
                w: 128,
                h: 128,
            },
            {
                name: 'drag',
                pics: [
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame5.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame6.png', import.meta.url)),
                    getAssetAsBlobURL(new URL('../assets/pet_fox/frame7.png', import.meta.url)),
                ],
                w: 128,
                h: 128,
            },
        ],
    }

    override componentDidMount() {
        window.addEventListener('resize', this.windowResize)
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
        e.stopPropagation()
        e.preventDefault()
    }

    onMouseMove(e: MouseEvent) {
        if (!this.state.dragging) return
        // 计算当前还能够向左移动多少距离
        const minX = -this.state.pos.x
        const maxX = window.innerWidth - this.state.pos.x - this.state.petW - 20 // 20为滚动条宽度
        const minY = -this.state.pos.y
        const maxY = window.innerHeight - this.state.pos.y - this.state.petH
        this.setState({
            move: {
                x: Math.max(Math.min(e.pageX - this.state.start.x, maxX), minX),
                y: Math.max(Math.min(e.pageY - this.state.start.y, maxY), minY),
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
                petW: action?.w ?? 128,
                petH: action?.h ?? 128,
            },
            () => {
                this.animateChangesPics(this.state.picGroup, 51, frameTurn, isLoop)
                if (type === 'default') {
                    console.log('type等于default了')
                    freeOnStandby(
                        3000,
                        this.state.pos,
                        this.state.petW,
                        this.state.petH,
                        this.freeOnStandbyCallback.bind(this),
                    )
                }
            },
        )
    }

    // 通用图片组动画循环播放函数
    animateChangesPics(group: string[], frame: number, frameTurn: number, isLoop: boolean) {
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

            this.props.setPicShow(this.state.picGroup[picIndex])
            picIndex = picIndex + 1
        }
    }

    // 检查当前状态，判定应该执行什么动画
    checkStatus() {
        clearAllAnimate()

        // 如果此时宠物正处于抓住的状态，则替换抓住的图片
        if (this.state.dragging) {
            this.getNowPicUrl('drag')
            return
        }

        // 如果此时宠物没有处于屏幕底部，则需要执行坠落动画
        if (this.state.pos.y + this.state.petW < window.innerHeight) {
            this.freeOnStandbyCallback('fall')
            return
        }

        // 如果没有状态命中，则替换默认图片
        this.getNowPicUrl('default')
    }

    // 自动执行某动作时触发指定的动作
    freeOnStandbyCallback(action: string) {
        console.log('一个动作被触发：', action)
        switch (action) {
            case 'fall':
                this.getNowPicUrl('fall')
                onPetFallAction(this.state.pos.y, this.state.petH, 2, this.onPetFallActionCallback.bind(this))
                break
            case 'walk':
                const direction = this.state.pos.x < window.innerWidth / 2 ? Direction.left : Direction.right
                this.getNowPicUrl('walk', true, 20)
                this.props.setPicDirection(direction)
                onPetWalkAction(this.state.pos.x, this.state.petW, direction, this.onWalkActionCallback.bind(this))
                break
        }
    }

    // 坠落动画 回调函数
    onPetFallActionCallback(newY: number, isLast?: boolean) {
        this.setState({
            pos: {
                x: this.state.pos.x,
                y: newY,
            },
        })

        if (isLast) {
            this.getNowPicUrl('standup', false, 10)
        }
    }

    // 行走动画 回调函数
    onWalkActionCallback(newX: number, isLast?: boolean) {
        this.setState({
            pos: {
                x: newX,
                y: this.state.pos.y,
            },
        })

        if (isLast) {
            this.getNowPicUrl('default')
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
