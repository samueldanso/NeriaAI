#!/usr/bin/env npx hardhat run

/**
 * Deploy NeriaAI Smart Contracts to Base Sepolia
 *
 * This script deploys the KnowledgeCapsuleNFT contract using Hardhat 3 Ignition.
 *
 * Usage:
 * npx hardhat run scripts/deploy-neria.ts --network base-sepolia
 *
 * Prerequisites:
 * 1. Set BASE_SEPOLIA_PRIVATE_KEY using: npx hardhat keystore set BASE_SEPOLIA_PRIVATE_KEY
 * 2. Make sure you have Base Sepolia ETH for gas fees
 * 3. Get Base Sepolia ETH from: https://bridge.base.org/deposit
 */

import { execSync } from 'child_process'

async function main() {
	console.log('🚀 Deploying NeriaAI Smart Contracts to Base Sepolia...\n')

	try {
		// Deploy using Hardhat 3 Ignition
		const deployCommand =
			'npx hardhat ignition deploy ignition/modules/DeployNeria.ts --network base-sepolia'

		console.log('📦 Running deployment command...')
		console.log(`Command: ${deployCommand}\n`)

		const result = execSync(deployCommand, {
			encoding: 'utf8',
			stdio: 'inherit',
		})

		console.log('\n✅ Deployment completed successfully!')
		console.log('📋 Next steps:')
		console.log('1. Copy the deployed contract address')
		console.log('2. Update frontend/.env.local with NEXT_PUBLIC_CONTRACT_ADDRESS')
		console.log('3. Test the contract on Base Sepolia explorer')
	} catch (error) {
		console.error('❌ Deployment failed:', error)
		process.exit(1)
	}
}

main().catch((error) => {
	console.error('❌ Script failed:', error)
	process.exit(1)
})
