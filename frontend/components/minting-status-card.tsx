"use client";

interface MintingStatusCardProps {
  status: "idle" | "uploading" | "validating" | "minting" | "completed";
  progress: number;
}

export function MintingStatusCard({
  status,
  progress,
}: MintingStatusCardProps) {
  const statusMessages = {
    idle: "Ready to mint",
    uploading: "Uploading to IPFS...",
    validating: "Validating with agents...",
    minting: "Minting NFT on Base L2...",
    completed: "NFT minted successfully!",
  };

  const statusColors = {
    idle: "bg-border",
    uploading: "bg-primary",
    validating: "bg-secondary",
    minting: "bg-accent",
    completed: "bg-success",
  };

  return (
    <div className="card-base">
      <h3 className="font-semibold mb-4">Minting Status</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">{statusMessages[status]}</span>
          <span className="text-xs font-semibold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full ${statusColors[status]} transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
