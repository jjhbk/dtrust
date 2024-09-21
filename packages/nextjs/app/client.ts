import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { rootstockTestnet } from 'viem/chains'
import { EthereumProvider } from '@walletconnect/ethereum-provider'

const publicClient = createPublicClient({
    chain: rootstockTestnet,
    transport: http(),
})

// eg: Metamask
const walletClient = createWalletClient({
    chain: rootstockTestnet,
    transport: custom(window.ethereum!),
})
/*
// eg: WalletConnect
export const provider = await EthereumProvider.init({
    projectId: "abcd1234",
    showQrModal: true,
    chains: [1],
})

export const walletClientWC = createWalletClient({
    chain: rootstockTestnet,
    transport: custom(provider),
})*/
export { publicClient, walletClient };