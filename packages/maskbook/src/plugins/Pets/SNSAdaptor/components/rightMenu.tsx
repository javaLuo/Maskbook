import { useState, useEffect } from 'react'
import { makeStyles } from '@masknet/theme'
import classNames from 'classnames'
import { getAssetAsBlobURL } from '../../../../utils'

type Props = {
    isShow: boolean
    pos: { x: number; y: number }
    onClickMenu: (type: string) => void
}

const useStyles = makeStyles()(() => ({
    menu: {
        position: 'absolute',
        bottom: '5px',
        right: '5px',
        left: 'auto',
        top: 'auto',
        minWidth: '200px',
        padding: 0,
        backgroundColor: '#fff',
        opacity: 0,
        zIndex: 999,
        transition: 'opacity 100ms',
        animation: 'menu-show 0.5s both',
        borderRadius: '12px',
        margin: 0,
        pointerEvents: 'none',
        boxShadow: '0 0 8px rgba(0,0,0,.1)',
        transform: 'translate(100%, 0)',

        '&>div': {
            position: 'relative',
            display: 'block',
            padding: '20px',
            fontSize: '14px',
            transition: 'backgroundColor 100ms',
            cursor: 'pointer',

            '&>span': {
                pointerEvents: 'none',
            },
            '&:hover': {
                backgroundColor: '#f1f1f1',
            },
            '&:first-child': {
                borderRadius: '12px 12px 0 0',
            },
            '&:last-child': {
                borderRadius: '0 0 12px 12px',
            },
        },
    },
    isLeft: {
        left: '5px',
        right: 'auto',
        transform: 'translate(-100%, 0)',
    },
    isBottom: {
        top: '5px',
        bottom: 'auto',
    },
    show: {
        opacity: 1,
        pointerEvents: 'auto',
    },
    menuItem: {
        borderTop: '1px solid #f1f1f1',
    },
    icon: {
        position: 'absolute',
        top: '50%',
        right: '20px',
        transform: 'translateY(-50%)',
        height: '16px',
        width: 'auto',
    },
    isBoxLeft: {
        left: '5px',
        right: 'auto',
        transform: 'translate(-100%, -50%)',
        '&>ul': {
            right: '8px !important',
            left: 'auto !important',
        },
    },
    itemBox: {
        padding: '8px !important',
        backgroundColor: 'transparent !important',
        boxShadow: 'none !important',
        '&>ul': {
            display: 'block',
            margin: 0,
            padding: '20px',
            fontSize: '12px',
            color: '#444',
            boxSizing: 'border-box',
            boxShadow: '0 0 8px rgba(0,0,0,.1)',
            fontWeight: 500,
            backgroundColor: '#fff',
            borderRadius: '12px',
            position: 'absolute',
            bottom: 0,
            left: '8px',
            '&>li': {
                listStyle: 'none',
                padding: '4px 0',
            },
        },
    },
    link: {
        color: '#ccc',
        transition: 'color 200ms',
        '&:hover': {
            color: '#444',
        },
    },
    normal: {
        fontWeight: 'normal',
        color: '#777',
    },
}))

function RightMenu(props: Props) {
    const { classes } = useStyles()
    const IconRight = getAssetAsBlobURL(new URL('../../assets/arrow-right.png', import.meta.url))

    const [isLeft, setIsLeft] = useState(false)
    const [isBottom, setIsBottom] = useState(false)

    const [isBoxLeft, setIsBoxLeft] = useState(false)
    const [isBoxShow, setIsBoxShow] = useState(false)
    useEffect(() => {
        if (props.isShow) {
            setIsLeft(props.pos.x > window.innerWidth - 200 - 150) // 200menu宽度， 150宠物宽度
            setIsBottom(props.pos.y < 200)
        }
    }, [props.isShow, props.pos])

    useEffect(() => {
        if (isBoxShow) {
            setIsBoxLeft(props.pos.x > window.innerWidth - 200 - 150 - 250)
        }
    }, [isBoxShow])

    function onClickMenu(type: string) {
        props.onClickMenu(type)
    }

    function stopPop(e: React.MouseEvent) {
        e.stopPropagation()
        e.nativeEvent.stopPropagation()
    }
    return (
        <div
            onMouseDown={stopPop}
            onMouseUp={stopPop}
            className={classNames(
                classes.menu,
                props.isShow && classes.show,
                isLeft && classes.isLeft,
                isBottom && classes.isBottom,
            )}>
            <div onClick={() => onClickMenu('reset')}>
                <span>Reset</span>
            </div>
            <div onClick={() => onClickMenu('climb')}>
                <span>Climb</span>
            </div>
            <div onClick={() => onClickMenu('sleep')}>
                <span>Sleep</span>
            </div>
            <div onClick={() => onClickMenu('shift')}>
                <span>Shift</span>
            </div>
            <div
                className={classes.menuItem}
                onMouseOver={() => setIsBoxShow(true)}
                onMouseOut={() => setIsBoxShow(false)}>
                <img className={classes.icon} src={IconRight} />
                <span>About me</span>
                <div
                    className={classNames(
                        classes.menu,
                        isBoxShow && classes.show,
                        classes.itemBox,
                        isBoxLeft && classes.isBoxLeft,
                    )}>
                    <ul>
                        <li>Loot Properties:</li>
                        <li>Falchion</li>
                        <li>Chain Mail</li>
                        <li>Hood</li>
                        <li>Leather Belt</li>
                        <li>Chain Boots</li>
                        <li>Chain Gloves</li>
                        <li>Amulet of the Twins</li>
                        <li>Gold Ring</li>
                        <li className="normal">Get your NFTshow and News:</li>
                        <li className="normal">
                            <a
                                className={classes.link}
                                href="https://twitter.com/MintTeamNFT"
                                rel="nofollow"
                                target="_break">
                                https://twitter.com/MintTeamNFT
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div onClick={() => onClickMenu('closure')}>
                <span>Closure</span>
            </div>
        </div>
    )
}

export default RightMenu
