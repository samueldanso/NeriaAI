"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ExitIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export const WalletConnect = () => {
  const { login, logout, authenticated, user } = usePrivy();
  const router = useRouter();

  // Redirect to /chat after authentication
  useEffect(() => {
    if (authenticated) {
      router.push("/chat");
    }
  }, [authenticated, router]);

  function handleDisconnect() {
    logout();
  }

  if (authenticated && user) {
    return (
      <span className="flex items-center gap-x-2 font-medium">
        <span className="hidden md:block text-sm">
          {user.wallet?.address
            ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
            : "Connected"}
        </span>

        <button
          onClick={handleDisconnect}
          type="button"
          className="cursor-pointer p-1 hover:bg-muted rounded transition-colors"
        >
          <ExitIcon className="size-4 text-muted-foreground" />
        </button>
      </span>
    );
  }

  return (
    <Button onClick={login} className="font-medium px-4 py-2">
      Sign in
    </Button>
  );
};
