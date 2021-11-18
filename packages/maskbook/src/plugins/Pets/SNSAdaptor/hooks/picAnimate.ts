import { useState, useMemo } from 'react'
import { getAssetAsBlobURL } from '../../../../utils'

type Props = {
    freeOnStandby: () => void
}
type Sequence = { s: number[]; t: number }[]
type PicInfo = { name: string; pics: string[]; sequence: Sequence }[]

enum Direction {
    left = 'left',
    right = 'right',
}
let animateTimer: number
let picGroup: string[] // 当前图片组
let frame: number // 当前循环帧
let frameTurn: number // 循环帧 一环的帧数
let picIndex: number // 当前选择第几张图下标
let picSequence: Sequence

let sequenceNow = 0 // 目前播放到第几序列了
let sequenceNowTime = 0 // 当前序列播放到第几遍了
let sequencePicNow = 0 // 该播放当前序列下的第几张图片下标了

let endTime: number // 用于随机图片组一定时间后结束
function PicAnimate(props: Props) {
    // 所有图片数据
    const picInfo: PicInfo = useMemo(() => {
        return [
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
        ]
    }, [])

    const [picType, setPicType] = useState<string>('default') // 当前正在执行什么动画组
    const [picNowUrl, setPicNow] = useState<string>() // 当前帧是那一张图片
    const [picDirection, setPicDirection] = useState<Direction>() // 当前图片的方向

    // 获取当前该显示哪个图片组
    function getNowPicUrl(type: string, frameTurnN = 50) {
        cancelAnimationFrame(animateTimer)
        const action = picInfo.find((item) => item.name === type)
        setPicType(type)
        picGroup = action?.pics ?? []
        picSequence = action?.sequence || []
        frameTurn = frameTurnN
        if (['sit'].includes(type)) {
            endTime = Date.now() + Math.random() * 5000 + 5000
            animateChangesPicsRandom()
        } else {
            sequenceNow = 0
            sequenceNowTime = 0
            sequencePicNow = 0
            frame = frameTurn
            animateChangesSquence()
        }

        if (type === 'default') {
            console.log('type等于default了')
            props.freeOnStandby()
        }
    }

    // 随机图片组动画循环播放函数
    function animateChangesPicsRandom() {
        if (frame > frameTurn) {
            if (Date.now() > endTime) {
                getNowPicUrl('default')
                return
            } else {
                frame = 0
                picIndex = Math.round(Math.random() * (picGroup.length - 1))
                setPicNow(picGroup[picIndex])
                Math.random() > 0.7 &&
                    setPicDirection(picDirection === Direction.left ? Direction.right : Direction.left)
            }
        }
        animateTimer = requestAnimationFrame(animateChangesPicsRandom)
    }

    // 序列图片组动画循环
    function animateChangesSquence() {
        if (frame > frameTurn) {
            sequencePicNow = sequencePicNow + 1
            if (sequencePicNow >= picSequence[sequenceNow].s.length) {
                sequencePicNow = 0
                sequenceNowTime = sequenceNowTime + 1
                if (sequenceNowTime >= picSequence[sequenceNow].t) {
                    sequenceNowTime = 0
                    sequenceNow = sequenceNow + 1
                    if (sequenceNow >= picSequence.length) {
                        console.log('一个动画序列结束')
                        getNowPicUrl('default')
                        return
                    }
                }
            }

            picIndex = picSequence[sequenceNow].s[sequencePicNow]
            setPicNow(picGroup[picIndex])
            frame = 0
        } else {
            frame = frame + 1
        }

        animateTimer = requestAnimationFrame(animateChangesSquence)
    }

    return {
        picNowUrl,
        getNowPicUrl,
    }
}

export default PicAnimate
