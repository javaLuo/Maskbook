import { useEffect, useState, useMemo } from 'react'
import { makeStyles } from '@masknet/theme'
import { useStylesExtends } from '@masknet/shared'
import { useCurrentVisitingIdentity } from '../../../components/DataSource/useActivatedUI'
import { getAssetAsBlobURL } from '../../../utils'
import classNames from 'classnames'

import Drag from './drag'
import Message from './components/animatedMsg'
import RightMenu from './components/rightMenu'
import PreUpload from './components/preUpload'
import { Direction } from './petActionAnimate'

const useStyles = makeStyles()(() => ({
    root: {
        position: 'fixed',
        top: 0,
        left: 0,
    },
    img: {
        position: 'relative',
        zIndex: 999,
        width: '100%',
        height: '100%',
        opacity: 1,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },
    imgR: {
        backgroundPosition: 'center right',
    },
    imgL: {
        backgroundPosition: 'center left',
        backgroundColor: '#f00',
    },
    show: {
        animation: `show-animation 1s forwards`,
        '@keyframes show-animation': {
            '0%': {
                opacity: 0,
            },
            '100%': {
                opacity: 1,
            },
        },
    },

    turn: {
        transform: 'scale(-1, 1)',
    },
}))

const PetsDom = () => {
    const classes = useStylesExtends(useStyles(), {})

    const [picInfo, setPicInfo] = useState([
        {
            name: 'default', // 默认 站立
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/1.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/2.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/3.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/4.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/5.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/6.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/7.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/8.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/9.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/10.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/11.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/12.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/13.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/14.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/15.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/16.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/17.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/18.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/19.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/20.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/21.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/22.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/23.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/24.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/25.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportStandBy/Sample4/26.png', import.meta.url)),
            ],
            sequence: [
                {
                    s: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
                    t: Infinity,
                    f: 6, // 帧切换速度 每50帧切换下一张图
                },
            ],
        },
        {
            name: 'stand', // 坐在某个元素上保持不动
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportDropWhitoutEmpty/Sample4/8.png', import.meta.url)),
            ],
            sequence: [{ s: [0], t: Infinity, f: 50 }],
        },
        {
            name: 'walk',
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportWalkSide/Sample4/1.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportWalkSide/Sample4/2.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportWalkSide/Sample4/3.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportWalkSide/Sample4/4.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportWalkSide/Sample4/5.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportWalkSide/Sample4/6.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportWalkSide/Sample4/7.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportWalkSide/Sample4/8.png', import.meta.url)),
            ],
            sequence: [{ s: [0, 1, 2, 3, 4, 5, 6, 7], t: Infinity, f: 4 }],
        },
        {
            name: 'sit', // 普通 坐在地面
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportDropWhitoutEmpty/Sample4/8.png', import.meta.url)),
            ],
            sequence: [{ s: [0], t: Infinity, f: 80 }],
        },
        {
            name: 'fall', // 坠落
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportDropWhitoutEmpty/Sample4/2.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportDropWhitoutEmpty/Sample4/3.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportDropWhitoutEmpty/Sample4/4.png', import.meta.url)),
            ],
            sequence: [
                { s: [0, 1], t: 1, f: 2 },
                { s: [2], t: Infinity, f: 50 },
            ],
        },
        {
            name: 'standup', // 从坐到站立的过渡(用于坠落后站起来)
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportDropWhitoutEmpty/Sample4/5.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportDropWhitoutEmpty/Sample4/6.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportDropWhitoutEmpty/Sample4/7.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportDropWhitoutEmpty/Sample4/8.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportDropWhitoutEmpty/Sample4/9.png', import.meta.url)),
            ],
            sequence: [{ s: [0, 1, 2, 3, 4], t: 1, f: 4 }],
        },
        {
            name: 'drag', // 拖拽时
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportNeediePricking/Sample4/1.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportNeediePricking/Sample4/2.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportNeediePricking/Sample4/3.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportNeediePricking/Sample4/4.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportNeediePricking/Sample4/5.png', import.meta.url)),
            ],
            sequence: [{ s: [0, 1, 2, 3, 4], t: Infinity, f: 8 }],
        },
        {
            name: 'climb', // 爬墙 xian
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_fox/frame_climb01.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_fox/frame_climb03.png', import.meta.url)),
            ],
            sequence: [{ s: [0, 1], t: Infinity, f: 30 }],
        },
        {
            name: 'sleep', // 睡觉
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/1.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/2.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/3.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/4.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/5.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/6.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/7.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/8.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/9.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/10.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/11.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/12.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/13.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/14.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/15.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportRest/Sample4/16.png', import.meta.url)),

                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportSleepAndWakeUp/Sample4/1.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportSleepAndWakeUp/Sample4/3.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportSleepAndWakeUp/Sample4/5.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportSleepAndWakeUp/Sample4/7.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportSleepAndWakeUp/Sample4/9.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportSleepAndWakeUp/Sample4/11.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportSleepAndWakeUp/Sample4/13.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_girl/ExportSleepAndWakeUp/Sample4/15.png', import.meta.url)),
            ],
            sequence: [
                // { s: [0, 1, 1], t: 3, f: 30 },
                // { s: [2], t: 50, f: 30 },
                // { s: [1, 0], t: 3, f: 30 },
                { s: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], t: 24, f: 6 }, // sleeping
                { s: [16, 17, 18, 19, 20, 21, 22, 23], t: 1, f: 8 }, // wakeup
            ],
        },
        {
            name: 'shift', // 跳跃中
            pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame22.png', import.meta.url))],
            sequence: [{ s: [0], t: Infinity, f: 50 }],
        },
        {
            name: 'shiftend', // 跳跃结束时的过渡
            pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame29.png', import.meta.url))],
            sequence: [{ s: [0], t: 1, f: 15 }],
        },
    ])

    const [show, setShow] = useState(true)
    const [actionType, setActionType] = useState('')
    const identity = useCurrentVisitingIdentity()
    useEffect(() => {
        const userId = identity.identifier.userId
        const maskId = 'realMaskNetwork'
        setShow(userId === maskId)
    }, [identity])

    const [picShow, setPicShow] = useState<string>('')
    const [picDirection, setPicDirection] = useState<Direction>(Direction.left)
    const [picPosition, setPicPosition] = useState(0)

    const onClosePet = () => {
        setShow(false)
    }

    // 新的一帧 设置图片 和 图片的朝向
    const setNewFrame = (type: string, pic: string, isTurn: boolean) => {
        setActionType(type)
        setPicShow(pic)
        isTurn && setPicDirection(picDirection === Direction.left ? Direction.right : Direction.left)
    }

    // 设置图片的朝向 和 图片相对刚体的位置
    const setDirection = (direction: Direction, position: number = 0) => {
        setPicDirection(direction)
        setPicPosition(position)
    }

    // 是否应该停止消息显示
    const isStopMsg = useMemo(() => {
        return ['drag', 'climb'].includes(actionType)
    }, [actionType])

    const [isMenuShow, setMenuShow] = useState(false)
    const [pos, setPos] = useState({ x: 0, y: 0 })

    const onMenuToggle = (type: boolean, pos?: { x: number; y: number }) => {
        setMenuShow(type)
        if (pos) {
            setPos(pos)
        }
    }

    const [menuAction, setMenuAction] = useState('default')

    const onClickMenu = (type: string) => {
        if (type === 'closure') {
            onClosePet()
        } else {
            setMenuAction(type)
        }
    }

    return (
        <div className={classes.root}>
            {show ? (
                <Drag
                    picInfo={picInfo}
                    direction={picDirection}
                    menuAction={menuAction}
                    isMenuShow={isMenuShow}
                    setNewFrame={(type, pic, isTurn) => setNewFrame(type, pic, isTurn)}
                    setDirection={(direction, position) => setDirection(direction, position)}
                    onMenuToggle={(type, pos) => onMenuToggle(type, pos)}
                    setMenuTypeReset={() => setMenuAction('')}>
                    <div
                        className={classNames({
                            [classes.img]: true,
                            [classes.show]: true,
                            [classes.turn]: picDirection === Direction.right,
                            [classes.imgR]: picPosition === 2,
                        })}
                        style={{ backgroundImage: `url(${picShow})` }}
                    />
                    <Message isStop={isStopMsg} />
                    <RightMenu isShow={isMenuShow} pos={pos} onClickMenu={(type) => onClickMenu(type)} />
                </Drag>
            ) : null}
            <PreUpload picInfo={picInfo} />
        </div>
    )
}

export default PetsDom
