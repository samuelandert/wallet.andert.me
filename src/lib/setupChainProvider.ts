import { configureChains, createConfig } from '@wagmi/core';
import { gnosis } from '@wagmi/core/chains';
import { publicProvider } from '@wagmi/core/providers/public';
import { InjectedConnector } from '@wagmi/core/connectors/injected';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';

// const chronicleChain = {
// 	id: 175177,
// 	name: 'Chronicle',
// 	network: 'chronicle',

// 	nativeCurrency: {
// 		decimals: 18,
// 		name: 'Chronicle - Lit Protocol Testnet',
// 		symbol: 'LIT'
// 	},
// 	rpcUrls: {
// 		default: {
// 			http: ['https://chain-rpc.litprotocol.com/http']
// 		},
// 		public: {
// 			http: ['https://chain-rpc.litprotocol.com/http']
// 		}
// 	},
// 	blockExplorers: {
// 		default: {
// 			name: 'Chronicle - Lit Protocol Testnet',
// 			url: 'https://chain.litprotocol.com'
// 		}
// 	},
// 	testnet: true
// };

export function initChainProvider() {
	const { chains, publicClient } = configureChains(
		[gnosis],
		[
			jsonRpcProvider({
				rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] })
			}),
			jsonRpcProvider({
				rpc: () => ({
					http: `https://rpc.ankr.com/gnosis`,
					wss: `wss://rpc.gnosischain.com/wss`
				})
			}),
			publicProvider()
		]
	);
	createConfig({
		autoConnect: true,
		connectors: [
			new InjectedConnector({ chains }),
		],
		publicClient
	});
}

