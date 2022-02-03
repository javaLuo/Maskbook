import { useMemo } from 'react'
import { makeStyles } from '@masknet/theme'

const useStyles = makeStyles()(() => ({
    root: {
        overflow: 'hidden',
        width: 0,
        height: 0,
        position: 'absolute',
        top: 0,
        left: '-1px',
        opacity: 0,
        pointerEvents: 'none',
    },
}))

interface PicInfo {
    name: string
    pics: string[]
    sequence: { s: number[]; t: number; f: number }[]
}

interface Props {
    picInfo: PicInfo[]
}

export default function PreUpload(props: Props) {
    const { classes } = useStyles()

    const picArray = useMemo(() => {
        return props.picInfo.reduce((res: string[], item: PicInfo) => {
            return [...res, ...item.pics]
        }, [])
    }, [props.picInfo])

    return (
        <div className={classes.root}>
            {picArray.map((item: string, index: number) => (
                <img src={item} key={index} />
            ))}
        </div>
    )
}
