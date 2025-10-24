'server only'

import { PinataSDK } from 'pinata'

import { env } from '@/env'

export const pinata = new PinataSDK({
	pinataJwt: `${env.PINATA_JWT}`,
	pinataGateway: `${env.NEXT_PUBLIC_GATEWAY_URL}`,
})

export interface UploadResult {
	success: boolean
	cid?: string
	error?: string
}

/**
 * Uploads a file to IPFS using Pinata.
 * This follows the official Pinata SDK example for Next.js server-side uploads.
 * @param file The file to upload.
 * @returns An object with the upload status and IPFS hash (CID).
 */
export async function uploadFileToIPFS(file: File): Promise<UploadResult> {
	try {
		const result = await pinata.upload.public.file(file)
		return {
			success: true,
			cid: result.cid,
		}
	} catch (error) {
		console.error('Failed to upload to IPFS:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Upload failed',
		}
	}
}

// Knowledge Capsule data structure for IPFS
export interface CapsuleIPFSData {
	query: string
	answer: string
	reasoning_chain: any
	reasoning_type: string
	validation_proof: any
	validation_status: string
	confidence: number
	creator_address: string
	created_at: string
	version: string // Version of capsule format
}

/**
 * Upload Knowledge Capsule to IPFS via Pinata
 * Returns IPFS hash (CID) and gateway URL
 */
export async function uploadCapsuleToIPFS(
	capsuleData: CapsuleIPFSData,
	capsuleId: string
): Promise<
	{ success: true; ipfsHash: string; gatewayUrl: string } | { success: false; error: string }
> {
	try {
		// Add metadata for better organization
		const metadata = {
			name: `Knowledge_Capsule_${capsuleId}`,
			keyvalues: {
				capsule_id: capsuleId,
				query: capsuleData.query.substring(0, 100), // First 100 chars
				validation_status: capsuleData.validation_status,
				confidence: capsuleData.confidence.toString(),
				created_at: capsuleData.created_at,
				type: 'knowledge_capsule',
				platform: 'neria_ai',
			},
		}

		// Create a JSON file from capsule data
		const jsonBlob = new Blob([JSON.stringify(capsuleData)], {
			type: 'application/json',
		})
		const jsonFile = new File([jsonBlob], metadata.name, {
			type: 'application/json',
		})

		// Upload JSON file to Pinata
		const upload = await pinata.upload.public.file(jsonFile)

		// Get the IPFS hash (CID)
		const ipfsHash = upload.cid

		// Construct gateway URL
		const gatewayUrl = `${env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsHash}`

		console.log('✅ Uploaded to IPFS:', {
			ipfsHash,
			gatewayUrl,
			size: JSON.stringify(capsuleData).length,
		})

		return {
			success: true,
			ipfsHash,
			gatewayUrl,
		}
	} catch (error) {
		console.error('❌ IPFS upload error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to upload to IPFS',
		}
	}
}

/**
 * Retrieve capsule data from IPFS
 */
export async function getCapsuleFromIPFS(
	ipfsHash: string
): Promise<{ success: true; data: CapsuleIPFSData } | { success: false; error: string }> {
	try {
		const response = await fetch(`${env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsHash}`)

		if (!response.ok) {
			throw new Error(`Failed to fetch from IPFS: ${response.statusText}`)
		}

		const data = await response.json()

		return {
			success: true,
			data: data as CapsuleIPFSData,
		}
	} catch (error) {
		console.error('❌ IPFS retrieval error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to retrieve from IPFS',
		}
	}
}

/**
 * Pin an existing IPFS hash to Pinata (for backup/persistence)
 */
export async function pinExistingIPFSHash(
	ipfsHash: string,
	name: string
): Promise<{ success: true } | { success: false; error: string }> {
	try {
		// Pin existing IPFS hash
		const upload = await pinata.upload.public.cid(ipfsHash)

		console.log('✅ Pinned existing IPFS hash:', ipfsHash)

		return { success: true }
	} catch (error) {
		console.error('❌ Pin existing hash error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to pin IPFS hash',
		}
	}
}

/**
 * Get all pinned files from Pinata (for admin/analytics)
 */
export async function listPinnedCapsules() {
	try {
		// For now, return empty array - this function can be implemented later
		// when we have the correct API method
		return {
			success: true,
			files: [],
		}
	} catch (error) {
		console.error('❌ List pinned files error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to list files',
		}
	}
}
