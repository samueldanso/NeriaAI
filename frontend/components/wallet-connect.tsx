"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ExitIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export const WalletConnect = () => {
  const { login, logout, authenticated, user } = usePrivy();

  function handleDisconnect() {
    logout();
  }

  if (authenticated && user) {
    return (
      <span className="flex items-center gap-x-2 font-medium">
        <span className="hidden md:block">
          {user.wallet?.address
            ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
            : "Connected"}
        </span>

        <button
          onClick={handleDisconnect}
          type="button"
          className="cursor-pointer"
        >
          <ExitIcon className="size-4" />
        </button>
      </span>
    );
  }

  return <Button onClick={login}>Connect Wallet</Button>;
};
