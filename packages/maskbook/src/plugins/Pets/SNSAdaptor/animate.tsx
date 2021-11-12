import { useEffect, useState } from 'react'
import { makeStyles } from '@masknet/theme'
import { useStylesExtends } from '@masknet/shared'
import { getAssetAsBlobURL } from '../../../utils'
import Drag from './drag'
import AnimatedMessage from './animatedMsg'
import Tip from './tooltip'
import { useCurrentVisitingIdentity } from '../../../components/DataSource/useActivatedUI'
import { scale } from '@balancer-labs/sor/dist/bmath'
import classNames from 'classnames'

const useStyles = makeStyles()(() => ({
    
    root: {
        position: 'fixed',
        top: 0,
        left: 0,
    },
    img: {
        zIndex: 999,
        width: '100%',
        height: '100%',
        backgroundSize: 'contain',
        // opacity: 0,
        // transform: 'scale(.5,.5)',

    },
    '@keyframes showAnimation': {
        '0%': {
            opacity: 0,
            transform: 'scale(.5,.5)',
        },
        '100%': {
            opacity: 1,
            transform: 'scale(1,1)',
        },
    },
    close: {
        width: 25,
        height: 25,
        cursor: 'pointer',
        backgroundSize: 'contain',
        position: 'absolute',
        top: 10,
        right: 0,
    },
    show:{
        animation: 'showAnimation 1s forwards',
    }
}))

const AnimatePic = () => {
    const classes = useStylesExtends(useStyles(), {})

    const Close = getAssetAsBlobURL(new URL('../assets/close.png', import.meta.url))

    const [show, setShow] = useState(true);

    const identity = useCurrentVisitingIdentity()
    useEffect(() => {
        const userId = identity.identifier.userId
        const maskId = 'realMaskNetwork'
        setShow(userId === maskId)
    }, [identity])

    const handleClose = () => setShow(false)

    // 动画相关
    
    const DefaultAnimate = getAssetAsBlobURL(new URL('../assets/loot.gif', import.meta.url));
    const FallAnimate = getAssetAsBlobURL(new URL('../assets/actions/fall.gif', import.meta.url));
    const [gif, setGif] = useState(DefaultAnimate);
    const choseImg = (type: string) => {
        switch(type){
            case 'fall':
                setGif(FallAnimate);break;
            default:
                setGif(DefaultAnimate);
        }
    }

    return (
        <div className={classes.root}>
            {show ? (
                <Drag onChoseImg={(type) => choseImg(type)}>
                    <AnimatedMessage />
                    <div className={classNames(classes.img, classes.show)} style={{ backgroundImage: `url(${gif})` }} />
                    <Tip />
                    <div className={classes.close} onClick={handleClose} style={{ backgroundImage: `url(${Close})` }} />
                </Drag>
            ) : null}
        </div>
    )
}

export default AnimatePic
