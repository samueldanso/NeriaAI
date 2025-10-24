import { type NextRequest, NextResponse } from 'next/server'
import { uploadToIPFS } from '@/lib/pinata'

export async function POST(request: NextRequest) {
	try {
		const { reasoning, metadata } = await request.json()

		const result = await uploadToIPFS(
			{
				reasoning,
				metadata,
				timestamp: new Date().toISOString(),
			},
			`capsule-${Date.now()}`
		)

		if (result.success) {
			return NextResponse.json({
				success: true,
				ipfsHash: result.ipfsHash,
				url: result.url,
				message: 'Content uploaded to IPFS',
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
				error: 'IPFS upload failed',
			},
			{ status: 500 }
		)
	}
}
