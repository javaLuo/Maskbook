import { useState, useEffect, useRef } from 'react'
import { makeStyles } from '@masknet/theme'
import { useI18N } from '../../../../utils'
import classNames from 'classnames'

const useStyles = makeStyles()(() => ({
    msgBox: {
        position: 'absolute',
        top: 0,
        left: '50%',
        marginBottom: '-100%',
        zIndex: 999,
        maxWidth: '300px',
        minWidth: '160px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 0 8px #ddd',
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 200ms, margin-left 100ms',
        padding: '12px',
        fontSize: '13px',
        color: '#222',
        transform: 'translate(-50%, -100%)',
        textAlign: 'center',
        '&:before': {
            content: '""',
            width: '10px',
            height: '10px',
            backgroundColor: '#fff',
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            boxShadow: '5px 5px 8px #ccc',
            transform: 'translateX(-50%) rotate(45deg)',
        },
    },
    wordShow: {
        opacity: 1,
    },
}))

type Props = {
    isStop: boolean
}

let timer: NodeJS.Timeout
const AnimatedMessage = (props: Props) => {
    const { t } = useI18N()
    const { classes } = useStyles()

    const txts = [
        t('plugin_pets_loot_des_0'),
        t('plugin_pets_loot_des_1'),
        t('plugin_pets_loot_des_2'),
        t('plugin_pets_loot_des_3'),
        t('plugin_pets_loot_des_4'),
        t('plugin_pets_loot_des_5'),
        t('plugin_pets_loot_des_6'),
        t('plugin_pets_loot_des_7'),
        t('plugin_pets_loot_des_8'),
        t('plugin_pets_loot_des_9'),
        t('plugin_pets_loot_des_10'),
        t('plugin_pets_loot_des_11'),
        t('plugin_pets_loot_des_12'),
        t('plugin_pets_loot_des_13'),
        t('plugin_pets_loot_des_14'),
    ]

    const [show, setShow] = useState(false)
    const [txt, setTxt] = useState(txts[0])
    const boxRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        console.log('一进来就触发？')
        clearTimeout(timer)
        if (props.isStop) {
            setShow(false)
        } else {
            randomTxtTimer()
        }
        return () => {
            clearTimeout(timer)
        }
    }, [props.isStop])

    const [left, setLeft] = useState(0)
    function randomTxtTimer() {
        timer = setTimeout(() => {
            setTxt(txts[Math.floor(Math.random() * (txts.length - 1) + 1) - 1])

            setShow(true)

            setTimeout(() => {
                if (boxRef?.current) {
                    const rect = boxRef.current.getBoundingClientRect()
                    if (rect.left < 0) {
                        setLeft(-rect.left)
                    } else if (rect.left > window.innerWidth) {
                        setLeft(-(rect.left - window.innerWidth))
                    } else {
                        setLeft(0)
                    }
                }
            })

            clearTimeout(timer)
            timer = setTimeout(() => {
                setShow(false)
                randomTxtTimer()
            }, 5000)
            console.log('文字显示', txt)
        }, (Math.random() * 10 + 2) * 1000)
    }

    return (
        <div
            ref={boxRef}
            style={{ marginLeft: `${left}px` }}
            className={classNames(classes.msgBox, show && classes.wordShow)}>
            {txt}
        </div>
    )
}

export default AnimatedMessage
