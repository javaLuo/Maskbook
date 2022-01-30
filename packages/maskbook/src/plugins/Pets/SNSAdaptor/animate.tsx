import { useEffect, useState, useMemo } from 'react'
import { makeStyles } from '@masknet/theme'
import { useStylesExtends } from '@masknet/shared'
import { useCurrentVisitingIdentity } from '../../../components/DataSource/useActivatedUI'
import { getAssetAsBlobURL } from '../../../utils'
import classNames from 'classnames'

import Drag from './drag'
import Message from './components/animatedMsg'
import RightMenu from './components/rightMenu'
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
            pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame15.png', import.meta.url))],
            sequence: [{ s: [0], t: Infinity }],
        },
        {
            name: 'stand',
            pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame15.png', import.meta.url))],
            sequence: [{ s: [0], t: Infinity }],
        },
        {
            name: 'walk',
            pics: [
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveleft/Assassin1_Moveleft000.png', import.meta.url),
                ),
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveleft/Assassin1_Moveleft001.png', import.meta.url),
                ),
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveleft/Assassin1_Moveleft002.png', import.meta.url),
                ),
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveleft/Assassin1_Moveleft003.png', import.meta.url),
                ),
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveleft/Assassin1_Moveleft004.png', import.meta.url),
                ),
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveleft/Assassin1_Moveleft005.png', import.meta.url),
                ),
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveleft/Assassin1_Moveleft006.png', import.meta.url),
                ),
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveleft/Assassin1_Moveleft007.png', import.meta.url),
                ),
            ],
            sequence: [{ s: [0, 1, 2, 3, 4, 5, 6, 7], t: Infinity }],
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
            pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame18.png', import.meta.url))],
            sequence: [{ s: [0], t: 1 }],
        },
        {
            name: 'drag',
            pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame9.png', import.meta.url))],
            sequence: [{ s: [0], t: Infinity }],
        },
        {
            name: 'climb',
            pics: [
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveup/Assassin1_Moveup000.png', import.meta.url),
                ),
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveup/Assassin1_Moveup001.png', import.meta.url),
                ),
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveup/Assassin1_Moveup002.png', import.meta.url),
                ),
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveup/Assassin1_Moveup003.png', import.meta.url),
                ),
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveup/Assassin1_Moveup004.png', import.meta.url),
                ),
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveup/Assassin1_Moveup005.png', import.meta.url),
                ),
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveup/Assassin1_Moveup006.png', import.meta.url),
                ),
                getAssetAsBlobURL(
                    new URL('../assets/pet_boy/Assassin1_Moveup/Assassin1_Moveup007.png', import.meta.url),
                ),
            ],
            sequence: [{ s: [0, 1, 2, 3, 4, 5, 6, 7], t: Infinity }],
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
        {
            name: 'shift',
            pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame22.png', import.meta.url))],
            sequence: [{ s: [0], t: Infinity }],
        },
        {
            name: 'shiftend',
            pics: [getAssetAsBlobURL(new URL('../assets/pet_fox/frame29.png', import.meta.url))],
            sequence: [{ s: [0], t: 1 }],
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
        </div>
    )
}

export default PetsDom
