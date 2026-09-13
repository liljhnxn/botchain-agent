"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useState } from "react";

export function DeployAgentButton({ agentName }: { agentName: string }) {
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  const [isQueued, setIsQueued] = useState(false);

  const handleClick = () => {
    if (!isConnected) {
      open();
      return;
    }

    setIsQueued(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleClick}
        className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
      >
        {isConnected ? "Deploy on Botchain" : "Connect wallet to deploy"}
      </button>

      {isConnected && isQueued ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          Deployment queued for {agentName}. Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      ) : null}
    </div>
  );
}
