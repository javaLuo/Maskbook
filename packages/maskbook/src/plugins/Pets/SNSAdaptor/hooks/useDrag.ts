import { useEffect, useState } from 'react'

type Props = {
    petSize: [number, number]
}

function useDrag(props: Props) {
    const [pos, setPos] = useState({ x: 0, y: 0 }) // 最终的位置
    const [start, setStart] = useState({ x: 0, y: 0 }) // 鼠标按下的位置
    const [move, setMove] = useState({ x: 0, y: 0 }) // 鼠标按下后本次移动的距离
    const [isMouseDown, setMouseDown] = useState(false) // 鼠标左键是否按下
    const windowResize = () => {
        setPos({
            x: Math.max(Math.min(pos.x, window.innerWidth - props.petSize[0]), 0),
            y: Math.max(Math.min(pos.y, window.innerHeight - props.petSize[1]), 0),
        })
    }

    const onMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        setMouseDown(true)
        setStart({ x: e.pageX, y: e.pageY })
    }

    const onMouseUp = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        setMouseDown(false)
        setPos({ x: pos.x + move.x, y: pos.y + move.y })
        setMove({ x: 0, y: 0 })
    }

    const onMouseMove = (d: Window, e: React.MouseEvent) => {}
    useEffect(() => {
        window.addEventListener('resize', windowResize)
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
        return () => {
            window.removeEventListener('resize', windowResize)
        }
    }, [])

    return [pos, onMouseDown, onMouseUp, onMouseMove]
}

export default useDrag
