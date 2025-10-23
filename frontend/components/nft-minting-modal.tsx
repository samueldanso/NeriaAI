"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface NFTMintingModalProps {
  isOpen: boolean
  onClose: () => void
  capsuleTitle: string
  capsuleId: string
}

export function NFTMintingModal({ isOpen, onClose, capsuleTitle, capsuleId }: NFTMintingModalProps) {
  const [step, setStep] = useState<"confirm" | "minting" | "success">("confirm")
  const [txHash, setTxHash] = useState("")

  const handleMint = () => {
    setStep("minting")
    // Simulate minting process
    setTimeout(() => {
      setTxHash("0x7a3c...89Af")
      setStep("success")
    }, 3000)
  }

  const handleClose = () => {
    setStep("confirm")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="card-base max-w-md w-full mx-4">
        {step === "confirm" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Mint Knowledge Capsule NFT</h2>
            <p className="text-muted mb-6">
              This will create an NFT on Base L2 representing your verified knowledge capsule.
            </p>

            <div className="space-y-4 mb-6 p-4 bg-surface-hover rounded-lg border border-border">
              <div>
                <p className="text-muted text-sm">Capsule Title</p>
                <p className="font-semibold">{capsuleTitle}</p>
              </div>
              <div>
                <p className="text-muted text-sm">Capsule ID</p>
                <p className="font-mono text-sm text-primary">#{capsuleId}</p>
              </div>
              <div>
                <p className="text-muted text-sm">Network</p>
                <p className="font-semibold">Base L2 (Sepolia Testnet)</p>
              </div>
              <div>
                <p className="text-muted text-sm">Gas Fee (Estimated)</p>
                <p className="font-semibold">~0.001 ETH</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleClose} variant="outline" className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleMint} className="flex-1 bg-primary text-background hover:bg-primary-dark">
                Mint NFT
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
              <p className="text-muted text-sm mt-2">Minting NFT on Base L2...</p>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <h2 className="text-2xl font-bold mb-4">NFT Minted Successfully!</h2>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-center text-muted mb-6">Your Knowledge Capsule has been minted as an NFT</p>

              <div className="space-y-3 w-full mb-6 p-4 bg-surface-hover rounded-lg border border-border">
                <div>
                  <p className="text-muted text-xs">Transaction Hash</p>
                  <p className="font-mono text-xs text-primary break-all">{txHash}</p>
                </div>
                <div>
                  <p className="text-muted text-xs">IPFS Hash</p>
                  <p className="font-mono text-xs text-primary">QmX4z...</p>
                </div>
                <div>
                  <p className="text-muted text-xs">NFT Address</p>
                  <p className="font-mono text-xs text-primary">0x7a3c...89Af</p>
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <Button onClick={handleClose} variant="outline" className="flex-1 bg-transparent">
                  Close
                </Button>
                <Button className="flex-1 bg-primary text-background hover:bg-primary-dark">View on OpenSea</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
