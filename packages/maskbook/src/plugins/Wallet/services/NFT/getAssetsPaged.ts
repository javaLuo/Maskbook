import { ChainId, CollectibleProvider } from '@masknet/web3-shared'
import { currentCollectibleDataProviderSettings } from '../../settings'
import * as OpenSeaAPI from '../../apis/opensea'
import { unreachable } from '@dimensiondev/kit'

export async function getAssetsPaged(from: string, chainId: ChainId, page?: number, size?: number) {
    const provider = currentCollectibleDataProviderSettings.value

    switch (provider) {
        case CollectibleProvider.OPENSEA:
            const assets = await OpenSeaAPI.getAssetsPaged(from, { chainId, page, size })
            return assets.tokens
        default:
            unreachable(provider)
    }
}
