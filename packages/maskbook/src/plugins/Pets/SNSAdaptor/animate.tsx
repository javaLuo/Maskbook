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
            name: 'default',
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_bot/barbarian/Barbarian_3_00.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/barbarian/Barbarian_3_01.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/barbarian/Barbarian_3_02.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/barbarian/Barbarian_3_03.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/barbarian/Barbarian_3_04.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/barbarian/Barbarian_3_05.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/barbarian/Barbarian_3_06.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/barbarian/Barbarian_3_07.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/barbarian/Barbarian_3_08.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/barbarian/Barbarian_3_09.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/barbarian/Barbarian_3_10.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/barbarian/Barbarian_3_11.png', import.meta.url)),
            ],
            sequence: [{ s: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], t: Infinity, f: 8 }],
        },
        {
            name: 'stand',
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_00.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_01.png', import.meta.url)),
            ],
            sequence: [{ s: [0, 1], t: Infinity, f: 10 }],
        },
        {
            name: 'walk',
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_bot/fly/magic_fly_12.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/fly/magic_fly_13.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/fly/magic_fly_14.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/fly/magic_fly_15.png', import.meta.url)),
            ],
            sequence: [{ s: [0, 1, 2, 3], t: Infinity, f: 10 }],
        },
        {
            name: 'sit',
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_00.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_01.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_02.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_03.png', import.meta.url)),
            ],
            sequence: [{ s: [0, 1, 2, 3], t: Infinity, f: 10 }],
        },
        {
            name: 'try',
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_00.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_01.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_02.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_03.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_04.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_05.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_06.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_07.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_08.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_09.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_10.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_11.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_12.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_13.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_14.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_15.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_16.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_17.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_18.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/try/spine_19.png', import.meta.url)),
            ],
            sequence: [{ s: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], t: 8, f: 6 }],
        },
        {
            name: 'fall',
            pics: [getAssetAsBlobURL(new URL('../assets/pet_bot/fly/magic_fly_12.png', import.meta.url))],
            sequence: [{ s: [0], t: Infinity, f: 10 }],
        },
        {
            name: 'standup',
            pics: [getAssetAsBlobURL(new URL('../assets/pet_bot/fly/magic_fly_12.png', import.meta.url))],
            sequence: [{ s: [0], t: 1, f: 10 }],
        },
        {
            name: 'drag',
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_bot/fly/magic_fly_12.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/fly/magic_fly_13.png', import.meta.url)),
            ],
            sequence: [{ s: [0, 1], t: Infinity, f: 10 }],
        },
        {
            name: 'climb',
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_bot/fly/magic_fly_12.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/fly/magic_fly_13.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/fly/magic_fly_14.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/fly/magic_fly_15.png', import.meta.url)),
            ],
            sequence: [{ s: [0, 1, 2, 3], t: Infinity, f: 10 }],
        },
        {
            name: 'sleep',
            pics: [
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_00.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_01.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_02.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_03.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_04.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_05.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_06.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_07.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_08.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_09.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_10.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_11.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_12.png', import.meta.url)),
                getAssetAsBlobURL(new URL('../assets/pet_bot/dance/bot_1dance_13.png', import.meta.url)),
            ],
            sequence: [{ s: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], t: 12, f: 8 }],
        },
        {
            name: 'shift',
            pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame22.png', import.meta.url))],
            sequence: [{ s: [0], t: Infinity, f: 50 }],
        },
        {
            name: 'shiftend',
            pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame29.png', import.meta.url))],
            sequence: [{ s: [0], t: 1, f: 10 }],
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
