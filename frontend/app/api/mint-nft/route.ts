import { type NextRequest, NextResponse } from 'next/server'
import { mintCapsuleNFT } from '@/lib/contract'

export async function POST(request: NextRequest) {
	try {
		const { ipfsHash, creator } = await request.json()

		const result = await mintCapsuleNFT(ipfsHash, creator)

		if (result.success) {
			return NextResponse.json({
				success: true,
				txHash: result.txHash,
				message: result.message,
			})
		} else {
			return NextResponse.json(
				{
					success: false,
					error: result.error,
				},
				{ status: 500 }
			)
		}
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to mint NFT',
			},
			{ status: 500 }
		)
	}
}
