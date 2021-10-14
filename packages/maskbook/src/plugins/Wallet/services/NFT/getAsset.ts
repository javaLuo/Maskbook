import { currentChainIdSettings, currentCollectibleDataProviderSettings } from '../../settings'
import * as OpenSeaApi from '../../apis/opensea'
import { ChainId, CollectibleProvider, createERC721ContractDetailed, createERC721Token } from '@masknet/web3-shared'
import { unreachable } from '@dimensiondev/kit'

export function createERC721TokenAsset(asset: OpenSeaApi.Asset, chainId: ChainId) {
    return createERC721Token(
        createERC721ContractDetailed(
            chainId,
            asset.asset_contract.address,
            asset.asset_contract.name,
            asset.asset_contract.symbol,
        ),
        {
            name: asset.name || asset.asset_contract.name,
            description: asset.description || asset.asset_contract.symbol,
            image: asset.image_url || asset.image_preview_url || asset.asset_contract.image_url || '',
            owner: asset.owner.address ?? '',
        },
        asset.token_id,
    )
}

export async function getAsset(address: string, tokenId: string, chainId = currentChainIdSettings.value) {
    const provider = currentCollectibleDataProviderSettings.value

    switch (provider) {
        case CollectibleProvider.OPENSEA:
            const asset = await OpenSeaApi.getAsset(address, tokenId, chainId)

            if (!asset) return
            return createERC721TokenAsset(asset, chainId)
        default:
            unreachable(provider)
    }
}
