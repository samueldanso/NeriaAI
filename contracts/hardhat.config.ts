import type { HardhatUserConfig } from 'hardhat/config'

import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem'
import { configVariable } from 'hardhat/config'

const config: HardhatUserConfig = {
	plugins: [hardhatToolboxViemPlugin],
	solidity: {
		profiles: {
			default: {
				version: '0.8.20',
			},
			production: {
				version: '0.8.20',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		},
	},
	networks: {
		hardhatMainnet: {
			type: 'edr-simulated',
			chainType: 'l1',
		},
		hardhatOp: {
			type: 'edr-simulated',
			chainType: 'op',
		},
		sepolia: {
			type: 'http',
			chainType: 'l1',
			url: configVariable('SEPOLIA_RPC_URL'),
			accounts: [configVariable('SEPOLIA_PRIVATE_KEY')],
		},
		'base-sepolia': {
			type: 'http',
			chainType: 'op',
			url: 'https://sepolia.base.org',
			accounts: [configVariable('BASE_SEPOLIA_PRIVATE_KEY')],
			chainId: 84532,
		},
		'base-mainnet': {
			type: 'http',
			chainType: 'op',
			url: 'https://mainnet.base.org',
			accounts: [configVariable('BASE_MAINNET_PRIVATE_KEY')],
			chainId: 8453,
		},
	},
}

export default config
