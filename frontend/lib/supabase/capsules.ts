"use client";

import { createClient } from "./client";

// Knowledge Capsule interface matching database schema
export interface KnowledgeCapsule {
  id: string;
  query: string;
  answer: string;
  reasoning_chain: any;
  reasoning_type: string;
  validation_proof: any;
  validation_status: "VERIFIED" | "REJECTED" | "NEEDS_REVISION";
  confidence: number;
  ipfs_hash?: string;
  nft_token_id?: number;
  nft_contract_address?: string;
  nft_tx_hash?: string;
  creator_address: string;
  embedding?: number[];
  tags?: string[];
  category?: string;
  view_count: number;
  citation_count: number;
  created_at: string;
  updated_at: string;
}

// Create capsule input (subset of full capsule)
export interface CreateCapsuleInput {
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
}

// Vector search result
export interface CapsuleSearchResult {
  id: string;
  query: string;
  answer: string;
  reasoning_chain: any;
  validation_status: string;
  confidence: number;
  ipfs_hash: string | null;
  creator_address: string;
  similarity: number;
}

/**
 * Create a new knowledge capsule in Supabase
 */
export async function createCapsule(
  capsuleData: CreateCapsuleInput,
): Promise<
  | { success: true; capsule: KnowledgeCapsule }
  | { success: false; error: string }
> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("knowledge_capsules")
      .insert([capsuleData])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, capsule: data as KnowledgeCapsule };
  } catch (error) {
    console.error("Create capsule error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Update capsule with IPFS hash after upload
 */
export async function updateCapsuleIPFS(
  capsuleId: string,
  ipfsHash: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from("knowledge_capsules")
      .update({ ipfs_hash: ipfsHash })
      .eq("id", capsuleId);

    if (error) {
      console.error("Supabase update IPFS error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Update IPFS error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Update capsule with NFT metadata after minting
 */
export async function updateCapsuleNFT(
  capsuleId: string,
  nftData: {
    nft_token_id: number;
    nft_contract_address: string;
    nft_tx_hash: string;
  },
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from("knowledge_capsules")
      .update(nftData)
      .eq("id", capsuleId);

    if (error) {
      console.error("Supabase update NFT error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Update NFT error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get a single capsule by ID
 */
export async function getCapsuleById(
  capsuleId: string,
): Promise<
  | { success: true; capsule: KnowledgeCapsule }
  | { success: false; error: string }
> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("knowledge_capsules")
      .select("*")
      .eq("id", capsuleId)
      .single();

    if (error) {
      console.error("Supabase get capsule error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, capsule: data as KnowledgeCapsule };
  } catch (error) {
    console.error("Get capsule error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get all capsules (with pagination)
 */
export async function getCapsules(
  limit: number = 10,
  offset: number = 0,
): Promise<
  | { success: true; capsules: KnowledgeCapsule[] }
  | { success: false; error: string }
> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("knowledge_capsules")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Supabase get capsules error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, capsules: data as KnowledgeCapsule[] };
  } catch (error) {
    console.error("Get capsules error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Vector similarity search (requires embeddings)
 * Note: This will be implemented once we have embedding generation
 */
export async function searchCapsules(
  queryEmbedding: number[],
  matchThreshold: number = 0.7,
  matchCount: number = 10,
): Promise<
  | { success: true; results: CapsuleSearchResult[] }
  | { success: false; error: string }
> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.rpc("match_capsules", {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
    });

    if (error) {
      console.error("Supabase vector search error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, results: data as CapsuleSearchResult[] };
  } catch (error) {
    console.error("Search capsules error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Increment view count for a capsule
 */
export async function incrementCapsuleView(
  capsuleId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase.rpc("increment_capsule_view", {
      capsule_id: capsuleId,
    });

    if (error) {
      console.error("Supabase increment view error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Increment view error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get capsules by creator address
 */
export async function getCapsulesByCreator(
  creatorAddress: string,
  limit: number = 10,
): Promise<
  | { success: true; capsules: KnowledgeCapsule[] }
  | { success: false; error: string }
> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("knowledge_capsules")
      .select("*")
      .eq("creator_address", creatorAddress)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase get creator capsules error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, capsules: data as KnowledgeCapsule[] };
  } catch (error) {
    console.error("Get creator capsules error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
