'use client'

import { type Address, createPublicClient, createWalletClient, type Hash, http, custom } from 'viem'
import { baseSepolia } from 'viem/chains'
import { CONTRACT_ADDRESSES, KNOWLEDGE_CAPSULE_NFT_ABI } from './abis'

/**
 * NFT Minting Service for Knowledge Capsules (Privy-Integrated)
 *
 * This service handles the minting of Knowledge Capsule NFTs
 * after a capsule has been stored in Supabase and IPFS.
 * Uses viem + Privy for wallet integration.
 */

export interface MintingResult {
	success: boolean
	tokenId?: string
	transactionHash?: string
	blockNumber?: number
	gasUsed?: string
	error?: string
}

export class NFTMintingService {
	private publicClient: any
	private isInitialized = false

	constructor() {
		this.initializePublicClient()
	}

	private async initializePublicClient() {
		try {
			// Create public client for reading from blockchain
			this.publicClient = createPublicClient({
				chain: baseSepolia,
				transport: http(),
			})

			this.isInitialized = true
			console.log('✅ NFT Minting Service initialized (public client only)')
		} catch (error) {
			console.error('❌ Failed to initialize NFT Minting Service:', error)
		}
	}

	/**
	 * Mint a Knowledge Capsule NFT (Privy-Integrated)
	 * @param ipfsHash The IPFS hash of the stored capsule
	 * @param walletProvider The wallet provider from Privy (window.ethereum or embedded wallet)
	 * @param userAddress The user's wallet address
	 * @returns Minting result with token ID and transaction hash
	 */
	async mintKnowledgeCapsule(
		ipfsHash: string,
		walletProvider?: any,
		userAddress?: string
	): Promise<MintingResult> {
		try {
			if (!this.isInitialized || !this.publicClient) {
				throw new Error('Public client not initialized')
			}

			// Check if wallet provider is available
			if (!walletProvider) {
				console.warn('⚠️ No wallet provider - checking window.ethereum')
				if (typeof window !== 'undefined' && (window as any).ethereum) {
					walletProvider = (window as any).ethereum
				} else {
					throw new Error('No wallet provider available. Please connect your wallet.')
				}
			}

			console.log('🎨 Minting Knowledge Capsule NFT...')
			console.log('📦 IPFS Hash:', ipfsHash)
			console.log('👤 User Address:', userAddress)

			// Create wallet client with Privy provider
			const walletClient = createWalletClient({
				chain: baseSepolia,
				transport: custom(walletProvider),
			})

			// Get account address
			let account: Address
			if (userAddress) {
				account = userAddress as Address
			} else {
				const accounts = await walletClient.getAddresses()
				if (!accounts || accounts.length === 0) {
					throw new Error('No wallet account found. Please connect your wallet.')
				}
				account = accounts[0]
			}

			console.log('🔑 Minting from account:', account)

			// Mint the NFT using viem
			const hash = await walletClient.writeContract({
				address: CONTRACT_ADDRESSES.KNOWLEDGE_CAPSULE_NFT as Address,
				abi: KNOWLEDGE_CAPSULE_NFT_ABI,
				functionName: 'mintCapsule',
				args: [ipfsHash],
				account,
			})

			console.log('⏳ Transaction submitted:', hash)
			console.log('🔗 View on Explorer: https://sepolia.basescan.org/tx/' + hash)

			// Wait for transaction confirmation
			const receipt = await this.publicClient.waitForTransactionReceipt({
				hash,
			})
			console.log('✅ Transaction confirmed in block:', receipt.blockNumber)

			// Extract token ID from events
			const transferEvent = receipt.logs.find(
				(log: any) =>
					log.topics[0] ===
					'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
			)

			let tokenId: string | undefined
			if (transferEvent) {
				tokenId = BigInt(transferEvent.topics[3]).toString()
				console.log('🆔 Token ID:', tokenId)
			}

			console.log('✅ NFT Minted Successfully!')

			return {
				success: true,
				tokenId,
				transactionHash: hash,
				blockNumber: Number(receipt.blockNumber),
				gasUsed: receipt.gasUsed?.toString(),
			}
		} catch (error) {
			console.error('❌ NFT Minting failed:', error)

			// Provide helpful error messages
			let errorMessage = 'Unknown error occurred'
			if (error instanceof Error) {
				errorMessage = error.message

				// Check for common errors
				if (
					errorMessage.includes('User rejected') ||
					errorMessage.includes('User denied')
				) {
					errorMessage = 'Transaction rejected by user'
				} else if (errorMessage.includes('insufficient funds')) {
					errorMessage = 'Insufficient funds for gas fees'
				} else if (errorMessage.includes('network')) {
					errorMessage = 'Network error - please check your connection'
				}
			}

			return {
				success: false,
				error: errorMessage,
			}
		}
	}

	/**
	 * Get capsule data from the blockchain
	 * @param tokenId The token ID to query
	 * @returns Capsule data or null if not found
	 */
	async getCapsuleData(tokenId: string) {
		try {
			if (!this.isInitialized || !this.publicClient) {
				throw new Error('Viem clients not initialized')
			}

			const data = await this.publicClient.readContract({
				address: CONTRACT_ADDRESSES.KNOWLEDGE_CAPSULE_NFT as Address,
				abi: KNOWLEDGE_CAPSULE_NFT_ABI,
				functionName: 'getCapsuleData',
				args: [BigInt(tokenId)],
			})

			return data
		} catch (error) {
			console.error('❌ Failed to get capsule data:', error)
			return null
		}
	}

	/**
	 * Get total supply of minted capsules
	 */
	async getTotalSupply(): Promise<number> {
		try {
			if (!this.isInitialized || !this.publicClient) {
				throw new Error('Viem clients not initialized')
			}

			const supply = await this.publicClient.readContract({
				address: CONTRACT_ADDRESSES.KNOWLEDGE_CAPSULE_NFT as Address,
				abi: KNOWLEDGE_CAPSULE_NFT_ABI,
				functionName: 'totalSupply',
			})

			return Number(supply)
		} catch (error) {
			console.error('❌ Failed to get total supply:', error)
			return 0
		}
	}

	/**
	 * Check if the service is ready
	 */
	isReady(): boolean {
		return this.isInitialized && !!this.publicClient
	}
}

// Create a singleton instance
export const nftMintingService = new NFTMintingService()

// Helper function for easy usage (Privy-compatible)
export async function mintKnowledgeCapsuleNFT(
	ipfsHash: string,
	walletProvider?: any,
	userAddress?: string
): Promise<MintingResult> {
	return await nftMintingService.mintKnowledgeCapsule(ipfsHash, walletProvider, userAddress)
}
