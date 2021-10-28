import { createPluginRPC } from '@masknet/plugin-infra'
import { PLUGIN_IDENTIFIER, WalletMessages } from '@masknet/plugin-wallet'
import type { _AsyncVersionOf } from '../../../node_modules/async-call-rpc/out/full'

export { WalletMessages } from '@masknet/plugin-wallet'
export type { SelectTokenDialogEvent, SelectNftContractDialogEvent } from '@masknet/plugin-wallet'
export const WalletRPC = createPluginRPC(
    PLUGIN_IDENTIFIER,
    () => import('./services') as any as Promise<_AsyncVersionOf<typeof import('./services')>>,
    WalletMessages.events.rpc,
)
