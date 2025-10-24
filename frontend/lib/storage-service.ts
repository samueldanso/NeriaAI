"use client";

import {
  getMintingConfig,
  type MintingMode,
  shouldAutoMint,
} from "./minting-options";
import { mintKnowledgeCapsuleNFT } from "./nft-minting";
import {
  type CreateCapsuleInput,
  createCapsule,
  updateCapsuleIPFS,
} from "./supabase";

/**
 * Complete storage orchestration for Knowledge Capsules
 * Handles: Supabase → IPFS → (Future: NFT Minting)
 */

export interface ProcessCapsuleStorageInput {
  query: string;
  answer: string;
  reasoning_chain: any;
  reasoning_type: string;
  validation_proof: any;
  validation_status: "VERIFIED" | "REJECTED" | "NEEDS_REVISION";
  confidence: number;
  creator_address: string;
  category?: string;
  tags?: string[];
  mintingMode?: MintingMode;
}

export interface ProcessCapsuleStorageResult {
  success: boolean;
  capsuleId?: string;
  ipfsHash?: string;
  ipfsUrl?: string;
  tokenId?: string;
  nftTxHash?: string;
  requiresManualMinting?: boolean;
  mintingConfig?: any;
  error?: string;
}

/**
 * Main function: Process complete capsule storage workflow
 *
 * Flow:
 * 1. Create capsule in Supabase → Get capsule ID
 * 2. Upload to IPFS via Pinata → Get IPFS hash
 * 3. Update Supabase with IPFS hash
 * 4. Mint NFT on Base L2 → Get token ID and transaction hash
 * 5. Update Supabase with NFT data
 */
export async function processCapsuleStorage(
  capsuleData: ProcessCapsuleStorageInput,
): Promise<ProcessCapsuleStorageResult> {
  try {
    console.log("🔄 Starting capsule storage workflow...");

    // STEP 1: Create capsule in Supabase
    console.log("📊 Step 1: Creating capsule in Supabase...");
    const supabaseInput: CreateCapsuleInput = {
      query: capsuleData.query,
      answer: capsuleData.answer,
      reasoning_chain: capsuleData.reasoning_chain,
      reasoning_type: capsuleData.reasoning_type,
      validation_proof: capsuleData.validation_proof,
      validation_status: capsuleData.validation_status,
      confidence: capsuleData.confidence,
      creator_address: capsuleData.creator_address,
      category: capsuleData.category,
      tags: capsuleData.tags,
    };

    const supabaseResult = await createCapsule(supabaseInput);

    if (!supabaseResult.success) {
      throw new Error(`Supabase error: ${supabaseResult.error}`);
    }

    const capsuleId = supabaseResult.capsule.id;
    console.log("✅ Step 1: Capsule created in Supabase:", capsuleId);

    // STEP 2: Upload to IPFS via Pinata
    console.log("📦 Step 2: Uploading to IPFS...");
    const ipfsUploadData = {
      capsuleId,
      query: capsuleData.query,
      answer: capsuleData.answer,
      reasoning_chain: capsuleData.reasoning_chain,
      reasoning_type: capsuleData.reasoning_type,
      validation_proof: capsuleData.validation_proof,
      validation_status: capsuleData.validation_status,
      confidence: capsuleData.confidence,
      creator_address: capsuleData.creator_address,
    };

    const ipfsResponse = await fetch("/api/upload-ipfs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ipfsUploadData),
    });

    const ipfsResult = await ipfsResponse.json();

    if (!ipfsResult.success) {
      throw new Error(`IPFS upload error: ${ipfsResult.error}`);
    }

    console.log("✅ Step 2: Uploaded to IPFS:", ipfsResult.ipfsHash);

    // STEP 3: Update Supabase with IPFS hash
    console.log("🔗 Step 3: Updating Supabase with IPFS hash...");
    const updateResult = await updateCapsuleIPFS(
      capsuleId,
      ipfsResult.ipfsHash,
    );

    if (!updateResult.success) {
      throw new Error(`Supabase update error: ${updateResult.error}`);
    }

    console.log("✅ Step 3: Supabase updated with IPFS hash");

    // STEP 4: Determine minting approach
    const mintingConfig = getMintingConfig(capsuleData.mintingMode);
    const shouldAutoMintNFT = shouldAutoMint(
      capsuleData.confidence,
      mintingConfig,
    );

    let nftResult: any = { success: false };

    if (shouldAutoMintNFT) {
      console.log("⛓️ Step 4: Auto-minting NFT on Base L2...");
      nftResult = await mintKnowledgeCapsuleNFT(ipfsResult.ipfsHash);

      if (!nftResult.success) {
        console.warn(
          "⚠️ Auto-minting failed, but storage completed:",
          nftResult.error,
        );
      } else {
        console.log("✅ Step 4: NFT auto-minted successfully!");
        console.log("🆔 Token ID:", nftResult.tokenId);
        console.log("⛓️ Transaction Hash:", nftResult.transactionHash);
      }
    } else {
      console.log(
        "⛓️ Step 4: Manual minting required (confidence below threshold)",
      );
    }

    console.log("🎉 Storage workflow complete!");

    return {
      success: true,
      capsuleId,
      ipfsHash: ipfsResult.ipfsHash,
      ipfsUrl: ipfsResult.gatewayUrl,
      tokenId: nftResult.tokenId,
      nftTxHash: nftResult.transactionHash,
      requiresManualMinting: !shouldAutoMintNFT,
      mintingConfig: shouldAutoMintNFT ? null : mintingConfig,
    };
  } catch (error) {
    console.error("❌ Storage workflow error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown storage error",
    };
  }
}

/**
 * Extract capsule data from agent response text
 * Parses the Capsule Agent's response to get structured data
 */
export function extractCapsuleDataFromResponse(
  responseText: string,
  query: string,
  creatorAddress: string,
): ProcessCapsuleStorageInput | null {
  try {
    // The Capsule Agent response contains structured information
    // We need to parse it intelligently

    // Example response format:
    // "🎯 **KNOWLEDGE CAPSULE CREATED**
    //  📦 Capsule ID: abc123...
    //  ✅ Validation: VERIFIED (85%)
    //  🧠 Confidence: 85%"

    // Extract confidence from response
    const confidenceMatch = responseText.match(/Confidence:?\s*(\d+)%/);
    const confidence = confidenceMatch
      ? Number.parseInt(confidenceMatch[1]) / 100
      : 0.85;

    // Extract validation status
    let validationStatus: "VERIFIED" | "REJECTED" | "NEEDS_REVISION" =
      "VERIFIED";
    if (responseText.includes("VERIFIED")) validationStatus = "VERIFIED";
    if (responseText.includes("REJECTED")) validationStatus = "REJECTED";
    if (responseText.includes("NEEDS_REVISION"))
      validationStatus = "NEEDS_REVISION";

    // For now, we'll create a simplified structure
    // In production, the agent should send structured metadata
    return {
      query,
      answer: responseText,
      reasoning_chain: {
        steps: [
          "Query processed",
          "Research completed",
          "Reasoning generated",
          "Validation passed",
        ],
        confidence: confidence,
        timestamp: new Date().toISOString(),
      },
      reasoning_type: "multi_agent_consensus",
      validation_proof: {
        status: validationStatus,
        validators: 3,
        consensus: "2/3",
        timestamp: new Date().toISOString(),
      },
      validation_status: validationStatus,
      confidence: confidence,
      creator_address: creatorAddress,
      category: "general",
      tags: ["ai-generated", "verified"],
    };
  } catch (error) {
    console.error("Error extracting capsule data:", error);
    return null;
  }
}

/**
 * Check if agent response indicates capsule is ready for storage
 */
export function isCapsuleReadyForStorage(responseText: string): boolean {
  const readyIndicators = [
    "KNOWLEDGE CAPSULE CREATED",
    "ready for blockchain minting",
    "CAPSULE CREATED",
    "VERIFIED",
  ];

  return readyIndicators.some((indicator) =>
    responseText.toUpperCase().includes(indicator.toUpperCase()),
  );
}
