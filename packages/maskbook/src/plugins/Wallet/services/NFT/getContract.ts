import { createERC721ContractDetailed } from '@masknet/web3-shared'
import * as OpenSeaAPI from '../../apis/opensea'
import { currentChainIdSettings, currentCollectibleDataProviderSettings } from '../../settings'

export async function getContract(contractAddress: string, chainId = currentChainIdSettings.value) {
    const provider = currentCollectibleDataProviderSettings.value
    switch (provider) {
        case CollectibleProvider.OPENSEA:
            const assetContract = await OpenSeaAPI.getContract(contractAddress, chainId)
            if (!assetContract) return
            return createERC721ContractDetailed(
                chainId,
                assetContract.address,
                assetContract.name,
                assetContract.symbol,
            )
        default:
            unreachable(provider)
    }
}
