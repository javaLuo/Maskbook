type Options = {
    callback: (params: any) => void
    [key: string]: any
}

const optionsDefault: Options = { callback: () => {} }
let animateId: number
let options: Options
let type: string

// 动作循环器
export const startAnimate = () => {
    animateId = requestAnimationFrame(startAnimate)

    if (!isPause) {
        switch (type) {
            case 'fall':
                onPetFallAction()
                break
            case 'walk':
                onPetWalkAction()
                break
            case 'climb':
                onPetClimbAction()
                break
            case 'shift':
                onPetShiftAction()
                break
            case 'stand':
                onPetsStandFollowAction()
                break
        }
    }
}

// 停止
export const stopAnimate = () => {
    cancelAnimationFrame(animateId)
    clearTimeout(freeTimer)
    type = 'default'
    options = optionsDefault
}

// 暂停
let isPause: boolean
export const pauseAnimate = () => {
    isPause = true
}

// 恢复
export const restore = () => {
    isPause = false
}

// 选择执行一个动作
export const choseAction = (t: string, o: Options) => {
    setTimeout(() => {
        type = t
        options = o
    })
}

// 一个动作结束
export const onActionsEnd = () => {
    type = 'default'
    options = optionsDefault
    clearTimeout(freeTimer)
}

// 每过一段时间随机选择一个动作
let freeTimer: NodeJS.Timeout
const petConfig = {
    freeActions: ['walk', 'climb', 'sit', 'sleep'],
}

export const freeOnStandby = (
    delay: number = 3000,
    pos: { x: number; y: number },
    petW: number,
    petH: number,
    callback: (action: string) => void,
) => {
    clearTimeout(freeTimer)
    freeTimer = setTimeout(() => {
        const freeActions: string[] = [...petConfig.freeActions]
        if (pos.x <= 1 || pos.x >= window.innerWidth - petW - 21) {
            // 在边缘，就不能行走
            // const index = freeActions.findIndex((item) => item === 'walk')
            // index >= 0 && freeActions.splice(index, 1);
        } else {
            // 不在边缘，不能爬墙
            const index: number = freeActions.findIndex((item) => item === 'climb')
            index >= 0 && freeActions.splice(index, 1)
        }
        const r: number = Math.random()

        const choseAction: string = freeActions[Math.floor(r * freeActions.length + 1) - 1]

        callback(choseAction)
    }, delay)
}

// 方向 - 左 / 右 主要用于宠物图片的朝向
export enum Direction {
    left = 'left',
    right = 'right',
}

/**
 * 宠物坠落
 * @param {number} y 宠物当前位置y
 * @param {number} petH 宠物本身的高度
 * @param {number} distance 本次位移距离，模拟重力
 * */
export const onPetFallAction = () => {
    // 本次该移动多少距离，每次都移动得越来越大，但不能超过当前距离底部的距离
    const howFar: number = window.innerHeight - (options.y + options.petH)
    const step: number = Math.min(howFar, options.distance)
    if (step >= howFar) {
        options.callback({ y: window.innerHeight - options.petH, isLast: true })
        onActionsEnd()
        return
    }
    options.callback({ y: options.y })

    options.distance += 0.5
    options.y += options.distance
}

/**
 * 宠物行走
 * @param {number} x 宠物当前距离屏幕左侧的距离
 * @param {number} petW 宠物当前的宽度
 * @param {number} endTime 走路超过此时长直接结束
 * @param {string} direction 往左还是右 left/right
 */
const onPetWalkAction = () => {
    const step = options.direction === Direction.left ? -1 : 1
    if ((step === -1 && options.x <= 0) || (step === 1 && options.x >= window.innerWidth - options.petW - 20)) {
        options.callback({
            x: options.direction === Direction.left ? 0 : window.innerWidth - options.petW - 20,
            isLast: true,
        })
        onActionsEnd()
        return
    }

    if (Date.now() > options.endTime) {
        options.callback({
            x: options.x,
            isLast: true,
        })
        onActionsEnd()
        return
    }

    options.callback({ x: options.x })

    options.x += step
}

/**
 * 宠物爬墙 纵向
 * @param {number} y 宠物当前位置y
 */
const onPetClimbAction = () => {
    if (options.y <= 0) {
        options.callback({ y: 0, isLast: true })
        onActionsEnd()
        return
    }
    options.callback({ y: options.y })

    options.y -= 1
}

/**
 * 宠物跳跃
 * @params {number} 起始x
 * @params {number} 起始y
 * @params {number} 控制点x
 * @params {number} 控制点y
 * @params {number} 目标X
 * @params {number} 目标y
 * @params {number} 当前帧z
 */
const onPetShiftAction = () => {
    if (options.z >= 60) {
        options.callback({
            x: options.resX,
            y: options.resY,
            isLast: true,
        })
        return
    }
    const t = options.z / 60
    const x = Math.pow(1 - t, 2) * options.x + 2 * t * (1 - t) * options.cx + Math.pow(t, 2) * options.resX
    const y = Math.pow(1 - t, 2) * options.y + 2 * t * (1 - t) * options.cy + Math.pow(t, 2) * options.resY

    options.callback({ x, y })
    options.z += 1
}

// 宠物stand 跟随
const onPetsStandFollowAction = () => {
    const rect = options.domPrev.getBoundingClientRect()
    options.callback({
        x: rect.left + rect.width / 2 - options.petW / 2,
        y: rect.top - options.petH + 8,
    })
}

export default {
    Direction,
    startAnimate,
    stopAnimate,
    choseAction,
    freeOnStandby,
    onActionsEnd,
    pauseAnimate,
    restore,
}