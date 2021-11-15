import { useEffect, useState } from 'react'
import { makeStyles } from '@masknet/theme'
import { useStylesExtends } from '@masknet/shared'
import Drag from './drag'
import Message from './components/animatedMsg'
import { useCurrentVisitingIdentity } from '../../../components/DataSource/useActivatedUI'
import classNames from 'classnames'
import Control from './components/control'
import { Direction } from './petActions'
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

    const [show, setShow] = useState(true)

    const identity = useCurrentVisitingIdentity()
    useEffect(() => {
        const userId = identity.identifier.userId
        const maskId = 'realMaskNetwork'
        setShow(userId === maskId)
    }, [identity])

    // 动画相关
    const [picShow, setPicShow] = useState<string>('')
    const [picDirection, setPicDirection] = useState<Direction>(Direction.left)
    const [picPosition, setPicPosition] = useState(0)

    // 控制器操作相关
    const [isControlShow, setControlShow] = useState(false)

    // 关闭宠物
    const onClosePet = () => {
        setShow(false)
    }

    // 新的一帧
    const setNewFrame = (pic: string, isTurn: boolean) => {
        setPicShow(pic)
        isTurn && setPicDirection(picDirection === Direction.left ? Direction.right : Direction.left)
    }

    // 设置各个方位
    const setDirection = (direction: Direction, position: number = 0) => {
        setPicDirection(direction)
        setPicPosition(position)
    }

    return (
        <div className={classes.root}>
            {show ? (
                <Drag
                    direction={picDirection}
                    setNewFrame={(pic, isTurn) => setNewFrame(pic, isTurn)}
                    setDirection={(direction, position) => setDirection(direction, position)}>
                    <div
                        className={classNames(
                            classes.img,
                            classes.show,
                            picDirection === Direction.right && classes.turn,
                            picPosition === 2 && classes.imgR,
                        )}
                        style={{ backgroundImage: `url(${picShow})` }}
                    />
                    <Message />
                    {/* <Tip /> */}
                    <Control isShow={isControlShow} onClosePet={() => onClosePet()} />
                </Drag>
            ) : null}
        </div>
    )
}

export default PetsDom
