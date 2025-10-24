"use client";

import {
  type Address,
  createPublicClient,
  createWalletClient,
  http,
} from "viem";
import { baseSepolia } from "viem/chains";
import { CONTRACT_ADDRESSES, KNOWLEDGE_CAPSULE_NFT_ABI } from "./abis";

// Contract configuration
export const CONTRACT_CONFIG = {
  address: CONTRACT_ADDRESSES.KNOWLEDGE_CAPSULE_NFT,
  abi: KNOWLEDGE_CAPSULE_NFT_ABI,
  chainId: baseSepolia.id,
} as const;

// Types for contract interactions
export interface CapsuleData {
  ipfsHash: string;
  creator: string;
  timestamp: bigint;
  verified: boolean;
  validators: string[];
}

export interface MintCapsuleParams {
  ipfsHash: string;
}

export interface VerifyCapsuleParams {
  tokenId: bigint;
  validatorAddresses: string[];
}

// Viem-based contract service
export class KnowledgeCapsuleNFTService {
  private publicClient: any;
  private walletClient: any;

  constructor(publicClient: any, walletClient: any) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
  }

  /**
   * Mint a new Knowledge Capsule NFT using viem
   */
  async mintCapsule(ipfsHash: string): Promise<bigint> {
    try {
      const [account] = await this.walletClient.getAddresses();
      if (!account) {
        throw new Error("No wallet account found");
      }

      const hash = await this.walletClient.writeContract({
        address: CONTRACT_ADDRESSES.KNOWLEDGE_CAPSULE_NFT as Address,
        abi: KNOWLEDGE_CAPSULE_NFT_ABI,
        functionName: "mintCapsule",
        args: [ipfsHash],
        account,
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
      });

      // Extract token ID from events
      const transferEvent = receipt.logs.find(
        (log: any) =>
          log.topics[0] ===
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", // Transfer event
      );

      if (transferEvent) {
        // Token ID is in topics[3] for Transfer event
        const tokenId = BigInt(transferEvent.topics[3]);
        return tokenId;
      }

      throw new Error("Could not extract token ID from transaction");
    } catch (error) {
      console.error("Error minting capsule:", error);
      throw error;
    }
  }

  /**
   * Get capsule data by token ID using viem
   */
  async getCapsuleData(tokenId: bigint): Promise<CapsuleData> {
    try {
      const data = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES.KNOWLEDGE_CAPSULE_NFT as Address,
        abi: KNOWLEDGE_CAPSULE_NFT_ABI,
        functionName: "getCapsuleData",
        args: [tokenId],
      });

      return {
        ipfsHash: data.ipfsHash,
        creator: data.creator,
        timestamp: data.timestamp,
        verified: data.verified,
        validators: data.validators,
      };
    } catch (error) {
      console.error("Error getting capsule data:", error);
      throw error;
    }
  }

  /**
   * Get total supply of capsules using viem
   */
  async getTotalSupply(): Promise<bigint> {
    try {
      return await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES.KNOWLEDGE_CAPSULE_NFT as Address,
        abi: KNOWLEDGE_CAPSULE_NFT_ABI,
        functionName: "totalSupply",
      });
    } catch (error) {
      console.error("Error getting total supply:", error);
      throw error;
    }
  }

  /**
   * Get owner of a token using viem
   */
  async getOwnerOf(tokenId: bigint): Promise<string> {
    try {
      return await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES.KNOWLEDGE_CAPSULE_NFT as Address,
        abi: KNOWLEDGE_CAPSULE_NFT_ABI,
        functionName: "ownerOf",
        args: [tokenId],
      });
    } catch (error) {
      console.error("Error getting owner:", error);
      throw error;
    }
  }
}

// Helper function to create contract service with viem
export function createContractService(
  publicClient: any,
  walletClient: any,
): KnowledgeCapsuleNFTService {
  return new KnowledgeCapsuleNFTService(publicClient, walletClient);
}
