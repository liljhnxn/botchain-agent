"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { getAccount, switchChain, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { useState } from "react";
import { wagmiConfig } from "@/app/providers";
import { AGENT_REGISTRY_ABI, botchainTestnet, explorerTxUrl, REGISTRY_ADDRESS } from "@/lib/registry";

export function PurchaseAgentButton({ agentId, priceWei }: { agentId: bigint; priceWei: bigint }) {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const [pending, setPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    if (!isConnected) {
      open();
      return;
    }

    if (!wagmiConfig || !REGISTRY_ADDRESS) {
      setError("On-chain payments are not configured.");
      return;
    }

    setPending(true);
    setError(null);

    try {
      const account = getAccount(wagmiConfig);
      if (!account.isConnected) throw new Error("Connect your wallet before purchasing.");
      if (account.chainId !== botchainTestnet.id) {
        await switchChain(wagmiConfig, { chainId: botchainTestnet.id });
      }

      const hash = await writeContract(wagmiConfig, {
        address: REGISTRY_ADDRESS,
        abi: AGENT_REGISTRY_ABI,
        functionName: "purchaseAgent",
        args: [agentId],
        value: priceWei,
        chainId: botchainTestnet.id,
      });
      await waitForTransactionReceipt(wagmiConfig, { hash });
      setTxHash(hash);
    } catch (err: unknown) {
      setError((err as { shortMessage?: string })?.shortMessage || (err as Error)?.message || "Payment failed.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handlePurchase}
        disabled={pending}
        className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Confirming payment..." : `Pay ${Number(priceWei) / 1e18} BOT`}
      </button>
      {txHash ? (
        <a href={explorerTxUrl(txHash)} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-300 hover:text-emerald-200">
          Payment confirmed
        </a>
      ) : null}
      {error ? <div className="max-w-xs text-right text-xs text-rose-300">{error}</div> : null}
    </div>
  );
}
