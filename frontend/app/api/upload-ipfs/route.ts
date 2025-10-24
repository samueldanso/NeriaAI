import { type NextRequest, NextResponse } from "next/server";
import { type CapsuleIPFSData, uploadCapsuleToIPFS } from "@/lib/pinata";

export const runtime = "nodejs";

/**
 * API Route: Upload Knowledge Capsule to IPFS
 * POST /api/upload-ipfs
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      capsuleId,
      query,
      answer,
      reasoning_chain,
      reasoning_type,
      validation_proof,
      validation_status,
      confidence,
      creator_address,
    } = body;

    if (
      !capsuleId ||
      !query ||
      !answer ||
      !reasoning_chain ||
      !reasoning_type ||
      !validation_proof ||
      !validation_status ||
      confidence === undefined ||
      !creator_address
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // Prepare capsule data for IPFS
    const capsuleData: CapsuleIPFSData = {
      query,
      answer,
      reasoning_chain,
      reasoning_type,
      validation_proof,
      validation_status,
      confidence: Number(confidence),
      creator_address,
      created_at: new Date().toISOString(),
      version: "1.0.0",
    };

    // Upload to IPFS via Pinata
    const result = await uploadCapsuleToIPFS(capsuleData, capsuleId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      ipfsHash: result.ipfsHash,
      gatewayUrl: result.gatewayUrl,
      message: "Knowledge Capsule uploaded to IPFS successfully",
    });
  } catch (error) {
    console.error("❌ Upload IPFS API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload to IPFS",
      },
      { status: 500 },
    );
  }
}
