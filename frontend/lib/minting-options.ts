"use client";

/**
 * NFT Minting Options Configuration
 *
 * This file defines the different minting approaches available
 * and their configurations for the NeriaAI platform.
 */

export type MintingMode = "automatic" | "manual" | "hybrid";

export interface MintingConfig {
  mode: MintingMode;
  autoMintThreshold: number; // Confidence threshold for auto-minting
  showMintingButton: boolean;
  requireUserConfirmation: boolean;
  estimatedGasFee: string;
  networkName: string;
}

export const MINTING_CONFIGS: Record<MintingMode, MintingConfig> = {
  automatic: {
    mode: "automatic",
    autoMintThreshold: 0.7, // Auto-mint if confidence > 70%
    showMintingButton: false,
    requireUserConfirmation: false,
    estimatedGasFee: "~0.001 ETH",
    networkName: "Base Sepolia",
  },
  manual: {
    mode: "manual",
    autoMintThreshold: 1.0, // Never auto-mint
    showMintingButton: true,
    requireUserConfirmation: true,
    estimatedGasFee: "~0.001 ETH",
    networkName: "Base Sepolia",
  },
  hybrid: {
    mode: "hybrid",
    autoMintThreshold: 0.8, // Auto-mint if confidence > 80%
    showMintingButton: true,
    requireUserConfirmation: false,
    estimatedGasFee: "~0.001 ETH",
    networkName: "Base Sepolia",
  },
};

/**
 * Get the appropriate minting configuration based on user preferences
 * or system settings
 */
export function getMintingConfig(userPreference?: MintingMode): MintingConfig {
  // For now, we'll use hybrid mode as default
  // In the future, this could be based on user settings or system configuration
  return MINTING_CONFIGS[userPreference || "hybrid"];
}

/**
 * Determine if a capsule should be automatically minted based on confidence
 */
export function shouldAutoMint(
  confidence: number,
  config: MintingConfig,
): boolean {
  return confidence >= config.autoMintThreshold;
}

/**
 * Get the minting status message for the UI
 */
export function getMintingStatusMessage(
  status: "idle" | "processing" | "ready" | "minting" | "completed" | "failed",
  config: MintingConfig,
): string {
  const messages = {
    idle: "Ready to process",
    processing: "Processing with AI agents...",
    ready:
      config.mode === "automatic"
        ? "Ready for automatic minting"
        : "Ready for manual minting",
    minting: "Minting NFT on Base L2...",
    completed: "NFT minted successfully!",
    failed: "Minting failed - please try again",
  };

  return messages[status];
}
