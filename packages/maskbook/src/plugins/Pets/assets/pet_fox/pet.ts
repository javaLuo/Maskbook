import { getAssetAsBlobURL } from '../../../../utils'

export const picsInfo = [
    {
        name: 'default',
        pics: [getAssetAsBlobURL(new URL('./frame1.png', import.meta.url))],
        w: 128,
        h: 128,
    },
    {
        name: 'walk',
        pics: [
            getAssetAsBlobURL(new URL('./frame2.png', import.meta.url)),
            getAssetAsBlobURL(new URL('./frame3.png', import.meta.url)),
        ],
        w: 128,
        h: 128,
    },
    {
        name: 'fall',
        pics: [getAssetAsBlobURL(new URL('./frame4.png', import.meta.url))],
        w: 128,
        h: 128,
    },
    {
        name: 'fallend',
        pics: [
            getAssetAsBlobURL(new URL('./frame8.png', import.meta.url)),
            getAssetAsBlobURL(new URL('./frame9.png', import.meta.url)),
        ],
        w: 128,
        h: 128,
    },
    {
        name: 'drag',
        pics: [
            getAssetAsBlobURL(new URL('./frame5.png', import.meta.url)),
            getAssetAsBlobURL(new URL('./frame6.png', import.meta.url)),
            getAssetAsBlobURL(new URL('./frame7.png', import.meta.url)),
            getAssetAsBlobURL(new URL('./frame8.png', import.meta.url)),
        ],
        w: 128,
        h: 128,
    },
]
