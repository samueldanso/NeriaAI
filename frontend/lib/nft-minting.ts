"use client";

import {
  type Address,
  createPublicClient,
  createWalletClient,
  type Hash,
  http,
} from "viem";
import { baseSepolia } from "viem/chains";
import { CONTRACT_ADDRESSES, KNOWLEDGE_CAPSULE_NFT_ABI } from "./abis";

/**
 * NFT Minting Service for Knowledge Capsules
 *
 * This service handles the minting of Knowledge Capsule NFTs
 * after a capsule has been stored in Supabase and IPFS.
 * Uses viem for modern, lightweight blockchain interactions.
 */

export interface MintingResult {
  success: boolean;
  tokenId?: string;
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  error?: string;
}

export class NFTMintingService {
  private publicClient: any;
  private walletClient: any;
  private isInitialized = false;

  constructor() {
    this.initializeContract();
  }

  private async initializeContract() {
    try {
      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        console.warn("NFTMintingService: Not in browser environment");
        return;
      }

      // Check if wallet is connected
      if (!window.ethereum) {
        console.warn("NFTMintingService: No wallet detected");
        return;
      }

      // Create viem clients
      this.publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(),
      });

      this.walletClient = createWalletClient({
        chain: baseSepolia,
        transport: http(),
      });

      this.isInitialized = true;
      console.log("✅ NFT Minting Service initialized with viem");
    } catch (error) {
      console.error("❌ Failed to initialize NFT Minting Service:", error);
    }
  }

  /**
   * Mint a Knowledge Capsule NFT
   * @param ipfsHash The IPFS hash of the stored capsule
   * @returns Minting result with token ID and transaction hash
   */
  async mintKnowledgeCapsule(ipfsHash: string): Promise<MintingResult> {
    try {
      if (!this.isInitialized || !this.publicClient || !this.walletClient) {
        throw new Error("Viem clients not initialized");
      }

      console.log("🎨 Minting Knowledge Capsule NFT...");
      console.log("📦 IPFS Hash:", ipfsHash);

      // Get the user's account
      const [account] = await this.walletClient.getAddresses();
      if (!account) {
        throw new Error("No wallet account found");
      }

      // Mint the NFT using viem
      const hash = await this.walletClient.writeContract({
        address: CONTRACT_ADDRESSES.KNOWLEDGE_CAPSULE_NFT as Address,
        abi: KNOWLEDGE_CAPSULE_NFT_ABI,
        functionName: "mintCapsule",
        args: [ipfsHash],
        account,
      });

      console.log("⏳ Transaction submitted:", hash);

      // Wait for transaction confirmation
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
      });
      console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

      // Extract token ID from events
      const transferEvent = receipt.logs.find(
        (log: any) =>
          log.topics[0] ===
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      );

      let tokenId: string | undefined;
      if (transferEvent) {
        tokenId = BigInt(transferEvent.topics[3]).toString();
        console.log("🆔 Token ID:", tokenId);
      }

      console.log("✅ NFT Minted Successfully!");

      return {
        success: true,
        tokenId,
        transactionHash: hash,
        blockNumber: Number(receipt.blockNumber),
        gasUsed: receipt.gasUsed?.toString(),
      };
    } catch (error) {
      console.error("❌ NFT Minting failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
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
        throw new Error("Viem clients not initialized");
      }

      const data = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES.KNOWLEDGE_CAPSULE_NFT as Address,
        abi: KNOWLEDGE_CAPSULE_NFT_ABI,
        functionName: "getCapsuleData",
        args: [BigInt(tokenId)],
      });

      return data;
    } catch (error) {
      console.error("❌ Failed to get capsule data:", error);
      return null;
    }
  }

  /**
   * Get total supply of minted capsules
   */
  async getTotalSupply(): Promise<number> {
    try {
      if (!this.isInitialized || !this.publicClient) {
        throw new Error("Viem clients not initialized");
      }

      const supply = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES.KNOWLEDGE_CAPSULE_NFT as Address,
        abi: KNOWLEDGE_CAPSULE_NFT_ABI,
        functionName: "totalSupply",
      });

      return Number(supply);
    } catch (error) {
      console.error("❌ Failed to get total supply:", error);
      return 0;
    }
  }

  /**
   * Check if the service is ready
   */
  isReady(): boolean {
    return this.isInitialized && !!this.publicClient && !!this.walletClient;
  }
}

// Create a singleton instance
export const nftMintingService = new NFTMintingService();

// Helper function for easy usage
export async function mintKnowledgeCapsuleNFT(
  ipfsHash: string,
): Promise<MintingResult> {
  return await nftMintingService.mintKnowledgeCapsule(ipfsHash);
}
