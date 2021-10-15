import { currentChainIdSettings, currentCollectibleDataProviderSettings } from '../../settings'
import * as OpenSeaAPI from '../../apis/opensea'
import { CollectibleProvider } from '@masknet/web3-shared'
import { unreachable } from '@dimensiondev/kit'

export async function getAssets(from: string, chainId = currentChainIdSettings.value) {
    const provider = currentCollectibleDataProviderSettings.value
    switch (provider) {
        case CollectibleProvider.OPENSEA:
            const tokens = await OpenSeaAPI.getAssets(from, chainId)
            return tokens
        default:
            unreachable(provider)
    }
}
