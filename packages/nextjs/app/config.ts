import { http, createConfig } from 'wagmi'
import { rootstockTestnet, sepolia } from 'wagmi/chains'

export const config = createConfig({
    chains: [rootstockTestnet, sepolia],
    transports: {
        [rootstockTestnet.id]: http(),
        [sepolia.id]: http(),
    },
})