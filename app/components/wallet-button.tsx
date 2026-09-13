"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { LogOut, Wallet } from "lucide-react";

export function WalletButton() {
  const { connect } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const label = isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet";

  return (
    <button
      onClick={() => (isConnected ? disconnect() : connect({ connector: injected() }))}
      className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-400/15"
    >
      {isConnected ? <LogOut className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
      {label}
    </button>
  );
}
