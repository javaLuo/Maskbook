import { useEffect, useState } from 'react'
import { makeStyles } from '@masknet/theme'
import { useStylesExtends } from '@masknet/shared'
import Drag from './drag'
import Message from './animatedMsg'
import { useCurrentVisitingIdentity } from '../../../components/DataSource/useActivatedUI'
import classNames from 'classnames'
import Control from './components/control'

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
        transform: 'scale(.5,.5)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },

    show: {
        animation: `show-animation 1s forwards`,
        '@keyframes show-animation': {
            '0%': {
                opacity: 0,
                transform: 'scale(.5,.5)',
            },
            '100%': {
                opacity: 1,
                transform: 'scale(1,1)',
            },
        },
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

    // 控制器操作相关
    const [isControlShow, setControlShow] = useState(false)

    // 关闭宠物
    const onClosePet = () => {
        setShow(false)
    }
    return (
        <div className={classes.root}>
            {show ? (
                <Drag setPicShow={(picUrl) => setPicShow(picUrl)}>
                    <div
                        className={classNames(classes.img, classes.show)}
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
