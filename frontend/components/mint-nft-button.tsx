"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getMintingConfig, type MintingMode } from "@/lib/minting-options";
import { MintingModal } from "./minting-modal";

interface MintNFTButtonProps {
  capsuleId: string;
  capsuleTitle: string;
  ipfsHash: string;
  confidence: number;
  mode?: MintingMode;
  onMintSuccess?: (tokenId: string, txHash: string) => void;
  onMintError?: (error: string) => void;
}

export function MintNFTButton({
  capsuleId,
  capsuleTitle,
  ipfsHash,
  confidence,
  mode = "hybrid",
  onMintSuccess,
  onMintError,
}: MintNFTButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const config = getMintingConfig(mode);

  const handleMintClick = () => {
    setShowModal(true);
  };

  const handleMintConfirm = async () => {
    setIsMinting(true);
    try {
      // Import the minting service dynamically to avoid SSR issues
      const { mintKnowledgeCapsuleNFT } = await import("@/lib/nft-minting");

      const result = await mintKnowledgeCapsuleNFT(ipfsHash);

      if (result.success && result.tokenId && result.transactionHash) {
        onMintSuccess?.(result.tokenId, result.transactionHash);
        setShowModal(false);
      } else {
        throw new Error(result.error || "Minting failed");
      }
    } catch (error) {
      console.error("Minting error:", error);
      onMintError?.(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleMintClick}
        disabled={isMinting}
        className="bg-success text-background hover:bg-success/80 text-xs h-7"
        size="sm"
      >
        {isMinting ? "Minting..." : "Mint NFT"}
      </Button>

      <MintingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleMintConfirm}
        capsuleId={capsuleId}
        capsuleTitle={capsuleTitle}
        ipfsHash={ipfsHash}
        confidence={confidence}
        config={config}
        isMinting={isMinting}
      />
    </>
  );
}
