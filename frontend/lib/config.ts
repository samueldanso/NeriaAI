import { createConfig } from "@privy-io/wagmi";
import { base, baseSepolia } from "viem/chains";
import { http } from "wagmi";
import { env } from "@/env";

// Dynamic chain selection based on environment
export const getDefaultChain = () => {
  return env.NEXT_PUBLIC_CHAIN_ID === "84532" ? baseSepolia : base;
};

// Chain configuration
export const chains = [base, baseSepolia];
export const supportedChains = [base, baseSepolia];

// Wagmi configuration
export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
