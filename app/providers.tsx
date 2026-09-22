"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { defineChain } from "viem";
import { WagmiProvider } from "wagmi";
import { type ReactNode } from "react";

import { botchainMainnet, botchainTestnet, activeChain } from "@/lib/registry";
export { botchainMainnet, botchainTestnet, activeChain };

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
  networks: [botchainMainnet, botchainTestnet],
}) : null;

// Exposed so non-hook code (e.g. the list-agent submit handler) can call
// @wagmi/core actions like writeContract. Null until a project id is configured.
export const wagmiConfig = wagmiAdapter ? wagmiAdapter.wagmiConfig : null;

if (projectId && wagmiAdapter) {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [botchainMainnet, botchainTestnet],
    defaultNetwork: activeChain,
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
