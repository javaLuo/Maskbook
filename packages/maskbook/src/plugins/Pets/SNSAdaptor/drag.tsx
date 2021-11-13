import React from 'react'
import { clearAllAnimate, onPetFallAction } from './petActions'
// import { getAssetAsBlobURL } from '../../../utils'

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
}

let timer: NodeJS.Timeout
let animateTimer: number
const picIndex: number = 0

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
            // {
            //     "name":"default",
            //     "pics": ['123123.png'],
            //     "w": 128,
            //     "h": 128
            // },
            // {
            //     "name":"walk",
            //     "pics": [getAssetAsBlobURL(new URL('../assets/pet_fox/frame2.png', import.meta.url)), getAssetAsBlobURL(new URL('../assets/pet_fox/frame3.png', import.meta.url))],
            //     "w": 128,
            //     "h": 128
            // },
            // {
            //     "name":"fall",
            //     "pics": [getAssetAsBlobURL(new URL('../assets/pet_fox/frame4.png', import.meta.url))],
            //     "w": 128,
            //     "h": 128
            // },
            // {
            //     "name":"fallend",
            //     "pics": [getAssetAsBlobURL(new URL('../assets/pet_fox/frame8.png', import.meta.url)), getAssetAsBlobURL(new URL('../assets/pet_fox/frame9.png', import.meta.url))],
            //     "w": 128,
            //     "h": 128
            // },
            // {
            //     "name":"drag",
            //     "pics": [getAssetAsBlobURL(new URL('../assets/pet_fox/frame5.png', import.meta.url)), getAssetAsBlobURL(new URL('../assets/pet_fox/frame6.png', import.meta.url)), getAssetAsBlobURL(new URL('../assets/pet_fox/frame7.png', import.meta.url)), getAssetAsBlobURL(new URL('../assets/pet_fox/frame8.png', import.meta.url))],
            //     "w": 128,
            //     "h": 128
            // }
        ],
    }

    override componentDidMount() {
        window.addEventListener('resize', this.windowResize)
        this.setState({
            pos: {
                x: window.innerWidth - this.state.petW - 50,
                y: window.innerHeight - this.state.petH - 150,
            },
        })
        // this.getNowPicUrl('default');
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

        this.setState({
            dragging: true,
            start: {
                x: e.pageX,
                y: e.pageY,
            },
        })
        // this.getNowPicUrl('default');
        e.stopPropagation()
        e.preventDefault()
    }

    onMouseMove(e: MouseEvent) {
        if (!this.state.dragging) return
        // 计算当前还能够向左移动多少距离
        const minX = -this.state.pos.x
        const maxX = window.innerWidth - this.state.pos.x - this.state.petW
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
    getNowPicUrl(type: string) {
        cancelAnimationFrame(animateTimer)
        const action = this.state.picInfo.find((item) => item.name === type)
        this.setState(
            {
                picGroup: action?.pics ?? [],
            },
            () => this.animateChangesPics(this.state.picGroup, 0),
        )
    }

    animateChangesPics(group: string[], frame: number) {
        // animateTimer = requestAnimationFrame(() => this.animateChangesPics(group, frame + 1));
        // if(frame > 100){
        //     frame = 0;
        //     let picIndexNext = picIndex + 1;
        //     if(picIndexNext > this.state.picGroup.length - 1){
        //         picIndexNext = 0;
        //     }
        //    this.props.setPicShow(this.state.picGroup[picIndexNext]);
        // }
    }

    // 检查当前状态，判定应该执行什么动画
    checkStatus() {
        // 执行新的动画前停止当前所有动画
        clearAllAnimate()

        if (this.state.pos.y + this.state.petW < window.innerHeight) {
            // 需要执行坠落动画
            this.getNowPicUrl('fall')
            onPetFallAction(this.state.pos.y, this.state.petH, 2, (newY: number, isLast?: boolean) => {
                this.setState({
                    pos: {
                        x: this.state.pos.x,
                        y: newY,
                    },
                })

                if (isLast) {
                    this.getNowPicUrl('default')
                }
            })
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
