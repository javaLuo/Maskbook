let animateId: number

// 停止所有动画，回到初始动画
export const clearAllAnimate = () => {
    cancelAnimationFrame(animateId)
}

// 开始补间动画
export const startTweenAnimation = () => {}

// 动物坠落
export const onPetFallAction = (
    y: number,
    h: number,
    distance: number,
    callback: (newY: number, isLast?: boolean) => void,
) => {
    animateId = requestAnimationFrame(() => onPetFallAction(y + step, h, distance + 0.5, callback))
    // 本次该移动多少距离，每次都移动得越来越大，但不能超过当前距离底部的距离
    const howFar = window.innerHeight - (y + h)
    const step = Math.min(howFar, distance)

    if (step >= howFar) {
        cancelAnimationFrame(animateId)
        callback(window.innerHeight - h, true)
        return
    }
    callback(y)
}

export default {
    clearAllAnimate,
    startTweenAnimation,
    onPetFallAction,
}
