import { useEffect, useState } from 'react'
import { makeStyles } from '@masknet/theme'
import { useStylesExtends } from '@masknet/shared'
import { getAssetAsBlobURL } from '../../../utils'
import Drag from './drag'
import Message from './animatedMsg'
import Tip from './tooltip'
import { useCurrentVisitingIdentity } from '../../../components/DataSource/useActivatedUI'
import classNames from 'classnames'

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
    close: {
        width: 25,
        height: 25,
        cursor: 'pointer',
        backgroundSize: 'contain',
        position: 'absolute',
        top: 10,
        right: 0,
        zIndex: 999,
        transition: 'transform 300ms',
        transform: 'rotate(0)',
        '&:hover': {
            transform: 'rotate(180deg)',
        },
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

let frame: number
let timer: number
const PetsDom = () => {
    const classes = useStylesExtends(useStyles(), {})

    const Close = getAssetAsBlobURL(new URL('../assets/close.png', import.meta.url))

    const [show, setShow] = useState(true)

    const identity = useCurrentVisitingIdentity()
    useEffect(() => {
        const userId = identity.identifier.userId
        const maskId = 'realMaskNetwork'
        setShow(userId === maskId)
    }, [identity])

    const handleClose = () => setShow(false)

    // 动画相关
    const [picShow, setPicShow] = useState<string>('')

    return (
        <div className={classes.root}>
            {show ? (
                <Drag setPicShow={(picUrl) => {}}>
                    <div
                        className={classNames(classes.img, classes.show)}
                        style={{ backgroundImage: `url(${Close})` }}
                    />
                    <Message />
                    <Tip />
                    <div className={classes.close} onClick={handleClose} style={{ backgroundImage: `url(${Close})` }} />
                </Drag>
            ) : null}
        </div>
    )
}

export default PetsDom
