"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { defineChain } from "viem";
import { WagmiProvider } from "wagmi";
import { type ReactNode } from "react";

export const botchainTestnet = defineChain({
  id: 968,
  name: "Botchain Testnet",
  network: "botchain-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "BOT",
    symbol: "BOT",
  },
  rpcUrls: {
    default: { http: ["https://rpc.bohr.life"] },
    public: { http: ["https://rpc.bohr.life"] },
  },
  blockExplorers: {
    default: {
      name: "Botchain Scan",
      url: "https://scan.botchain.ai",
    },
  },
  testnet: true,
});

const rawProjectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID?.trim();
const projectId = rawProjectId && rawProjectId !== "demo-project-id" ? rawProjectId : undefined;

const metadata = {
  name: "Botchain Agent Marketplace",
  description: "Decentralized marketplace for AI agents on Botchain",
  url: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
  icons: ["/botchain-logo.svg"],
};

const wagmiAdapter = projectId ? new WagmiAdapter({
  projectId,
  networks: [botchainTestnet],
}) : null;

if (projectId && wagmiAdapter) {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [botchainTestnet],
    defaultNetwork: botchainTestnet,
    metadata,
    features: {
      analytics: false,
      email: false,
      socials: false,
      onramp: false,
    },
    themeMode: "dark",
  });
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {projectId && wagmiAdapter ? <WagmiProvider config={wagmiAdapter.wagmiConfig}>{children}</WagmiProvider> : children}
    </QueryClientProvider>
  );
}
