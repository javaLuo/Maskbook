import { ChainId, CollectibleProvider, ERC721TokenDetailed } from '@masknet/web3-shared'
import { currentCollectibleDataProviderSettings } from '../../settings'
import * as OpenSeaAPI from '../../apis/opensea'
import { createERC721TokenAsset } from './getAsset'
import { unreachable } from '@dimensiondev/kit'

export async function getAssetsPage(from: string, chainId: ChainId, page?: number, size?: number) {
    const provider = currentCollectibleDataProviderSettings.value
    const tokens: ERC721TokenDetailed[] = []
    switch (provider) {
        case CollectibleProvider.OPENSEA:
            const asset = await OpenSeaAPI.getAssetsList(from, { chainId, page, size })
            tokens.concat(asset.assets.map((asset) => createERC721TokenAsset(asset, chainId)))
            return tokens
        default:
            unreachable(provider)
    }
}
