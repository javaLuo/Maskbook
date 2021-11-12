import React from 'react'

interface StateProps {
    dragging: boolean // 是否正在抓取
    pos: {
        x: number
        y: number
    }
    start: {
        // 鼠标按下时记录值
        x: number
        y: number
    }
    move: {
        x: number
        y: number
    }
}

interface Props {
    onChoseImg: (type: string) => void
}
const contentWidth = 96 // 机器人刚体宽
const contentHeight = 150 // 机器人刚体高

let animateId: number

class Draggable extends React.PureComponent<Props> {
    ref = React.createRef<HTMLDivElement | null>()
    mouseMoveFuc = this.onMouseMove.bind(this)
    mouseUpFuc = this.onMouseUp.bind(this)
    windowResize = this.onWindowResize.bind(this)

    override state: StateProps = {
        dragging: false,
        pos: {
            // 最终机器人的位置
            x: window.innerWidth - contentWidth - 50,
            y: window.innerHeight - contentHeight - 150,
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
    }

    onWindowResize() {
        // 窗口大小改变后需要重新定位
    }

    onMouseDown(e: React.MouseEvent) {
        if (e.button !== 0) return
        if (!this.ref?.current) return
        cancelAnimationFrame(animateId)
        this.setState({
            dragging: true,
            start: {
                x: e.pageX,
                y: e.pageY,
            },
        })
        this.props.onChoseImg('default')
        e.stopPropagation()
        e.preventDefault()
    }

    onMouseMove(e: MouseEvent) {
        if (!this.state.dragging) return
        // 计算当前还能够向左移动多少距离
        const minX = -this.state.pos.x
        const maxX = window.innerWidth - this.state.pos.x - contentWidth
        const minY = -this.state.pos.y
        const maxY = window.innerHeight - this.state.pos.y - contentHeight
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
            () => {
                // 开始判断执行什么动画
                if (this.state.pos.y + contentHeight < window.innerHeight) {
                    // 需要执行坠落动画
                    // (this.props.children as children).choseImg('fall');
                    this.props.onChoseImg('fall')
                    this.toDoAction({ y: { start: this.state.pos.y, to: window.innerHeight - contentHeight } }, 100, 1)
                }
            },
        )

        e.stopPropagation()
        e.preventDefault()
    }

    // 执行补间动画
    toDoAction(params: any, step: number, stepNow: number) {
        animateId = requestAnimationFrame(() => this.toDoAction(params, step, stepNow))
        stepNow += 1
        const one: number = (params.y.to - params.y.start) / step
        this.setState({
            pos: {
                x: this.state.pos.x,
                y: this.state.pos.y + one,
            },
        })
        if (stepNow >= step) {
            console.log('停止', this.state.pos.y)
            this.props.onChoseImg('default')
            cancelAnimationFrame(animateId)
        }
    }

    override componentDidMount() {
        window.addEventListener('resize', this.windowResize)
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
                    width: contentWidth,
                    height: contentHeight,
                }}>
                {this.props.children || null}
            </div>
        )
    }
}

export default Draggable
