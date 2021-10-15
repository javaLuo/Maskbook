import { unreachable } from '@dimensiondev/kit'
import { CollectibleProvider } from '@masknet/web3-shared'
import * as OpenSeaAPI from '../../apis/opensea'
import { currentChainIdSettings, currentCollectibleDataProviderSettings } from '../../settings'

export async function getContract(contractAddress: string, chainId = currentChainIdSettings.value) {
    const provider = currentCollectibleDataProviderSettings.value
    switch (provider) {
        case CollectibleProvider.OPENSEA:
            const assetContract = await OpenSeaAPI.getContract(contractAddress, chainId)
            return assetContract
        default:
            unreachable(provider)
    }
}
