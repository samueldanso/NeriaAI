import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

/**
 * NeriaAI Smart Contract Deployment Module
 *
 * This module deploys the KnowledgeCapsuleNFT contract to Base Sepolia
 * for the NeriaAI decentralized knowledge platform.
 *
 * Based on Hardhat 3 Ignition modules approach:
 * @see https://hardhat.org/docs/getting-started#deploying-contracts
 */
export default buildModule('NeriaAIModule', (m) => {
	// Deploy the KnowledgeCapsuleNFT contract
	const knowledgeCapsuleNFT = m.contract('KnowledgeCapsuleNFT')

	// Optional: Set any initial configuration or call initial functions
	// For example, if we had a setBaseURI function:
	// m.call(knowledgeCapsuleNFT, "setBaseURI", ["https://neria-ai.vercel.app/api/metadata/"]);

	return {
		knowledgeCapsuleNFT,
	}
})
