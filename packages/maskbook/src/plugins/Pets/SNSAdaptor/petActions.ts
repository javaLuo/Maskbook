let animateId: number
let freeTimer: NodeJS.Timeout

export enum Direction {
    left = 'left',
    right = 'right',
}

const petConfig = {
    freeActions: ['walk', 'climb', 'sit'],
}

// 停止所有动画，回到初始动画
export const clearAllAnimate = () => {
    cancelAnimationFrame(animateId)
    clearTimeout(freeTimer)
}

// 空闲状态，一定时间后执行随机动作
export const freeOnStandby = (
    delay = 3000,
    pos: { x: number; y: number },
    petW: number,
    petH: number,
    callback: (action: string) => void,
) => {
    clearTimeout(freeTimer)
    freeTimer = setTimeout(() => {
        const freeActions = [...petConfig.freeActions]
        if (pos.x <= 1 || pos.x >= window.innerWidth - petW - 21) {
            // 在边缘，就不能行走
            // const index = freeActions.findIndex((item) => item === 'walk')
            // index >= 0 && freeActions.splice(index, 1);
        } else {
            // 不在边缘，不能爬墙
            const index = freeActions.findIndex((item) => item === 'climb')
            index >= 0 && freeActions.splice(index, 1)
        }
        const r = Math.random()

        const choseAction = freeActions[Math.floor(r * freeActions.length + 1) - 1]
        console.log('选中了什么动作：', choseAction, freeActions, r)
        callback(choseAction)
    }, delay)
}

// 宠物坠落
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

/**
 * 宠物行走
 * @param {number} x 宠物当前距离屏幕左侧的距离
 * @param {number} w 宠物当前的宽度
 * @param {string} direction 往左还是右 left/right
 */
export const onPetWalkAction = (
    x: number,
    w: number,
    direction: Direction,
    callback: (newX: number, isLast?: boolean) => void,
) => {
    animateId = requestAnimationFrame(() => onPetWalkAction(x + step, w, direction, callback))
    const step = direction === Direction.left ? -1 : 1
    if ((step === -1 && x <= 0) || (step === 1 && x >= window.innerWidth - w - 20)) {
        cancelAnimationFrame(animateId)
        callback(direction === Direction.left ? 0 : window.innerWidth - w - 20, true)
        return
    }
    callback(x)
}

/**
 * 宠物爬墙 纵向
 */
export const onPetClimbAction = (y: number, callback: (y: number, isLast?: boolean) => void) => {
    animateId = requestAnimationFrame(() => onPetClimbAction(y - 1, callback))
    if (y <= 0) {
        cancelAnimationFrame(animateId)
        callback(0, true)
    }
    callback(y)
}

export default {
    Direction,
    clearAllAnimate,
    onPetFallAction,
    onPetWalkAction,
    onPetClimbAction,
}
