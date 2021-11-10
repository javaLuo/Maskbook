import { useRegisteredPlugin } from './useRegisteredPlugin'

export function useRegisteredPluginNetwork(pluginID: string, networkID: string) {
    return useRegisteredPlugin(pluginID)?.networks?.find((x) => x.ID === networkID)
}
