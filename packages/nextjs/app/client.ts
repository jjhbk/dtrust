import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { arbitrumSepolia, rootstockTestnet, sepolia } from 'viem/chains'
import { EthereumProvider } from '@walletconnect/ethereum-provider'

const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(),
})

// eg: Metamask
const walletClient = createWalletClient({
    chain: arbitrumSepolia,
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
    chain: arbitrumSepolia,
    transport: custom(provider),
})*/
export { publicClient, walletClient };