import { currentChainIdSettings, currentCollectibleDataProviderSettings } from '../../settings'
import * as OpenSeaApi from '../../apis/opensea'
import { CollectibleProvider } from '@masknet/web3-shared'
import { unreachable } from '@dimensiondev/kit'

export async function getAsset(address: string, tokenId: string, chainId = currentChainIdSettings.value) {
    const provider = currentCollectibleDataProviderSettings.value

    switch (provider) {
        case CollectibleProvider.OPENSEA:
            const token = await OpenSeaApi.getAsset(address, tokenId, chainId)
            return token

        default:
            unreachable(provider)
    }
}
