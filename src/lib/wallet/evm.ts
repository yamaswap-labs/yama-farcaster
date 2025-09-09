import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from 'wagmi/chains';

const local_evm_net = {
  id: 31337,
  name: 'Localhost',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
    },
  },
};

export const config = getDefaultConfig({
  appName: 'Yama RainbowKit App',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    local_evm_net,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});

//   connect: async (wallet: Wallet) => {
//     if (wallet.chain === ChainType.SOLANA) {
//       try {
//         const res = await solanaWalletConnect(wallet);
//         if (!!res?.ok) {
//           set({
//             address: res.data.address,
//             isConnected: true,
//             isModalOpen: false,
//             walletType: wallet.type,
//           });
//         }
//       } catch (err) {
//         console.error('Solana Wallet Connect Error: ', err);
//         throw err;
//       }
//     }

//     // if (wallet.chain === ChainType.EVM) {
//     //   try {
//     //     const provider = wallet.provider;
//     //     const accounts = await provider.request({ method: 'eth_requestAccounts' });
//     //     const connectedAddress = accounts[0];
//     //     set({ address: connectedAddress, isConnected: true, wallet });
//     //   } catch (err) {
//     //     console.error('EVM Wallet Connect Error: ', err);
//     //     throw err;
//     //   }
//     // }
//   },

//   detectEvmWallets: () => {
//     const walletProviders: EIP6963ProviderDetail[] = [];
//     window.addEventListener('eip6963:announceProvider', (event) => {
//       walletProviders.push(event.detail);
//     });
//     window.dispatchEvent(new Event('eip6963:requestProvider'));

//     return set((state) => {
//       const supportedWallets = state.supportedWallets.map((w) => {
//         const walletProvider = walletProviders.find(
//           (p) => p.info.name.toLocaleUpperCase() === w.name.toLocaleUpperCase(),
//         );

//         return { ...w, installed: !!walletProvider, provider: walletProvider?.provider };
//       });
//       console.log('supportedWallets: ', supportedWallets);

//       return { supportedWallets };
//     });
//   },
