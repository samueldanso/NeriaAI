import { createConfig } from "@privy-io/wagmi";
import { mainnet, sepolia } from "viem/chains";
import { http } from "wagmi";
import { env } from "@/env";

// Dynamic chain selection based on environment
export const getDefaultChain = () => {
  return env.NEXT_PUBLIC_CHAIN_ID === "1" ? mainnet : sepolia;
};

// Chain configuration
export const chains = [mainnet, sepolia];
export const supportedChains = [mainnet, sepolia];

// Wagmi configuration
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
