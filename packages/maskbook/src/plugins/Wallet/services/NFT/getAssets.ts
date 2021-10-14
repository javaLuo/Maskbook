import { currentChainIdSettings, currentCollectibleDataProviderSettings } from '../../settings'
import * as OpenSeaAPI from '../../apis/opensea'
import { ChainId, CollectibleProvider, ERC721TokenDetailed } from '@masknet/web3-shared'
import { unreachable } from '@dimensiondev/kit'
import { createERC721TokenAsset } from './getAsset'

async function getAssetsOpensea(from: string, chainId: ChainId) {
    const tokens: ERC721TokenDetailed[] = []
    let page = 0
    let data
    do {
        data = await OpenSeaAPI.getAssetsList(from, { chainId, page, size: 50 })
        tokens.concat(data.assets.map((asset) => createERC721TokenAsset(asset, chainId)))
        page = page + 1
    } while (data.assets.length === 50)

    return tokens
}

export async function getAssets(from: string, chainId = currentChainIdSettings.value) {
    const provider = currentCollectibleDataProviderSettings.value
    let tokens: ERC721TokenDetailed[] = []
    switch (provider) {
        case CollectibleProvider.OPENSEA:
            tokens = await getAssetsOpensea(from, chainId)
            return tokens
        default:
            unreachable(provider)
    }
}
