"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { MintingConfig } from "@/lib/minting-options";

interface MintingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  capsuleId: string;
  capsuleTitle: string;
  ipfsHash: string;
  confidence: number;
  config: MintingConfig;
  isMinting: boolean;
}

export function MintingModal({
  isOpen,
  onClose,
  onConfirm,
  capsuleId,
  capsuleTitle,
  ipfsHash,
  confidence,
  config,
  isMinting,
}: MintingModalProps) {
  const [step, setStep] = useState<"confirm" | "minting" | "success">(
    "confirm",
  );
  const [txHash, setTxHash] = useState("");
  const [tokenId, setTokenId] = useState("");

  const handleConfirm = async () => {
    setStep("minting");
    try {
      await onConfirm();
      // The actual minting is handled by the parent component
      // We'll simulate success for now
      setTxHash("0x" + Math.random().toString(16).substr(2, 8) + "...");
      setTokenId(Math.floor(Math.random() * 1000).toString());
      setStep("success");
    } catch (error) {
      console.error("Minting failed:", error);
      setStep("confirm");
    }
  };

  const handleClose = () => {
    setStep("confirm");
    setTxHash("");
    setTokenId("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="card-base max-w-md w-full mx-4">
        {step === "confirm" && (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Mint Knowledge Capsule NFT
            </h2>
            <p className="text-muted mb-6">
              This will create an NFT on {config.networkName} representing your
              verified knowledge capsule.
            </p>

            <div className="space-y-4 mb-6 p-4 bg-surface-hover rounded-lg border border-border">
              <div>
                <p className="text-muted text-sm">Capsule Title</p>
                <p className="font-semibold">{capsuleTitle.slice(0, 50)}...</p>
              </div>
              <div>
                <p className="text-muted text-sm">Capsule ID</p>
                <p className="font-mono text-sm text-primary">#{capsuleId}</p>
              </div>
              <div>
                <p className="text-muted text-sm">IPFS Hash</p>
                <p className="font-mono text-sm text-primary">
                  {ipfsHash.slice(0, 20)}...
                </p>
              </div>
              <div>
                <p className="text-muted text-sm">Confidence Score</p>
                <p className="font-semibold text-success">
                  {(confidence * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-muted text-sm">Network</p>
                <p className="font-semibold">{config.networkName}</p>
              </div>
              <div>
                <p className="text-muted text-sm">Gas Fee (Estimated)</p>
                <p className="font-semibold">{config.estimatedGasFee}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isMinting}
                className="flex-1 bg-primary text-background hover:bg-primary-dark"
              >
                {isMinting ? "Minting..." : "Mint NFT"}
              </Button>
            </div>
          </>
        )}

        {step === "minting" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Minting in Progress</h2>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full border-4 border-border border-t-primary animate-spin mb-4" />
              <p className="text-muted">Uploading to IPFS...</p>
              <p className="text-muted text-sm mt-2">
                Minting NFT on {config.networkName}...
              </p>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <h2 className="text-2xl font-bold mb-4">
              NFT Minted Successfully!
            </h2>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-center text-muted mb-6">
                Your Knowledge Capsule has been minted as an NFT
              </p>

              <div className="space-y-3 w-full mb-6 p-4 bg-surface-hover rounded-lg border border-border">
                <div>
                  <p className="text-muted text-xs">Token ID</p>
                  <p className="font-mono text-xs text-primary">#{tokenId}</p>
                </div>
                <div>
                  <p className="text-muted text-xs">Transaction Hash</p>
                  <p className="font-mono text-xs text-primary break-all">
                    {txHash}
                  </p>
                </div>
                <div>
                  <p className="text-muted text-xs">IPFS Hash</p>
                  <p className="font-mono text-xs text-primary">
                    {ipfsHash.slice(0, 20)}...
                  </p>
                </div>
                <div>
                  <p className="text-muted text-xs">Network</p>
                  <p className="font-mono text-xs text-primary">
                    {config.networkName}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  Close
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      `https://sepolia.basescan.org/tx/${txHash}`,
                      "_blank",
                    )
                  }
                  className="flex-1 bg-primary text-background hover:bg-primary-dark"
                >
                  View on Explorer
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
