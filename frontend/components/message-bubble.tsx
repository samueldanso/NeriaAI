"use client";

import { useState } from "react";
import { NFTMintingModal } from "@/components/nft-minting-modal";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: {
    role: string;
    content: string;
    reasoning?: string;
    capsuleId?: string;
  };
  isUser: boolean;
  onExpandReasoning?: () => void;
}

export function MessageBubble({
  message,
  isUser,
  onExpandReasoning,
}: MessageBubbleProps) {
  const [showMintModal, setShowMintModal] = useState(false);

  return (
    <>
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-md p-4 rounded-lg ${
            isUser
              ? "bg-primary text-background"
              : "bg-surface border border-border text-foreground"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>

          {!isUser && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {message.reasoning && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onExpandReasoning}
                  className="text-xs h-7 bg-surface-hover border-border hover:bg-surface-hover"
                >
                  Show Reasoning
                </Button>
              )}
              {message.capsuleId && (
                <Button
                  size="sm"
                  className="text-xs h-7 bg-accent text-background hover:bg-accent/80"
                >
                  View Capsule #{message.capsuleId}
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => setShowMintModal(true)}
                className="text-xs h-7 bg-success text-background hover:bg-success/80"
              >
                Mint NFT
              </Button>
            </div>
          )}
        </div>
      </div>

      <NFTMintingModal
        isOpen={showMintModal}
        onClose={() => setShowMintModal(false)}
        capsuleTitle={message.content.slice(0, 50) + "..."}
        capsuleId={message.capsuleId || "pending"}
      />
    </>
  );
}
