import React from 'react'
import { useState } from 'react'
import { makeStyles } from '@masknet/theme'
import classNames from 'classnames'
import { getAssetAsBlobURL } from '../../../../utils'
interface Props {
    isShow: boolean
    onClosePet: () => void
}

const useStyles = makeStyles()(() => ({
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        zIndex: 999,
        transform: 'scale(.8,.8)',
        transition: 'opacity 200ms, transform 200ms',
    },

    show: {
        opacity: 1,
        pointerEvents: 'auto',
        transform: 'scale(1,1)',
    },

    close: {
        width: 25,
        height: 25,
        cursor: 'pointer',
        backgroundSize: 'contain',
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 999,
        transition: 'transform 300ms',
        transform: 'rotate(0)',
        '&:hover': {
            transform: 'rotate(180deg)',
        },
    },
}))

const Control = (props: Props) => {
    const { classes } = useStyles()
    const IconClose = getAssetAsBlobURL(new URL('../../assets/close.png', import.meta.url))

    const [isShow, setShow] = useState(false)

    return (
        <div
            className={classNames([classes.root, isShow ? classes.show : ''])}
            onMouseOver={() => setShow(true)}
            onMouseOut={() => setShow(false)}>
            <div
                className={classes.close}
                onClick={() => props.onClosePet()}
                style={{ backgroundImage: `url(${IconClose})` }}
            />
        </div>
    )
}

export default Control
