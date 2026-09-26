"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Bot, CheckCircle2, ShieldCheck, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAccount, switchChain, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { wagmiConfig } from "@/app/providers";
import {
  AGENT_REGISTRY_ABI,
  activeChain,
  explorerTxUrl,
  isRegistryConfigured,
  REGISTRY_ADDRESS,
} from "@/lib/registry";

export default function ListAgentPage() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const walletLabel = isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect wallet";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isConnected) {
      open();
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "Alpha Research Bot"),
      category: String(formData.get("category") || "Analytics"),
      price: String(formData.get("price") || "0.25 BOT"),
      description: String(formData.get("description") || "Cross-chain market monitoring and strategy automation for research teams."),
      usageTier: String(formData.get("usageTier") || "1.2K runs"),
      creatorAddress: address,
      status: "pending" as "pending" | "review" | "live",
    };

    setError(null);
    setPending(true);

    try {
      if (!isRegistryConfigured || !REGISTRY_ADDRESS || !wagmiConfig) {
        throw new Error("On-chain publishing is not configured. Add NEXT_PUBLIC_REGISTRY_ADDRESS and NEXT_PUBLIC_REOWN_PROJECT_ID in Vercel, then redeploy.");
      }

      const account = getAccount(wagmiConfig);
      if (!account.isConnected) {
        throw new Error("Connect your wallet before publishing.");
      }

      if (account.chainId !== activeChain.id) {
        await switchChain(wagmiConfig, { chainId: activeChain.id });
      }

      let onchainTx: string | null = null;

      const hash = await writeContract(wagmiConfig, {
        address: REGISTRY_ADDRESS,
        abi: AGENT_REGISTRY_ABI,
        functionName: "listAgent",
        args: [payload.name, payload.category, payload.price, payload.description, payload.usageTier],
        chainId: activeChain.id,
      });
      onchainTx = hash;
      setTxHash(hash);
      await waitForTransactionReceipt(wagmiConfig, { hash });
      payload.status = "live";

      // Persist display metadata off-chain too (used by the dashboard fallback).
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, txHash: onchainTx }),
      });

      if (response.ok || onchainTx) {
        setSubmitted(true);
        setTimeout(() => router.push("/dashboard"), 1200);
      } else {
        setError("Failed to save the listing. Please try again.");
      }
    } catch (err: unknown) {
      const message =
        (err as { shortMessage?: string })?.shortMessage ||
        (err as Error)?.message ||
        "Transaction failed.";
      setError(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(82,133,255,0.22),_transparent_50%),linear-gradient(180deg,#07111f_0%,#0d172a_100%)] text-white">
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500">
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/60 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition hover:border-cyan-500/50 hover:bg-slate-800/80 hover:text-white"
            >
              <span>Mainnet Explorer</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-cyan-400" />
            </a>

            <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
              Creator hub
            </div>
          </div>
        </div>

        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Launch</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white">List your agent</h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Publish an autonomous service to the Botchain marketplace, define usage tiers, and collect payouts securely from your wallet.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                  <Bot className="h-4 w-4 text-cyan-300" />
                  Agent metadata
                </div>
                <p className="text-sm text-slate-300">Name, category, pricing, capabilities, and credentialing.</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Verification
                </div>
                <p className="text-sm text-slate-300">Botchain checkers validate identity and execution metadata before publishing.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Publisher wallet</div>
                <div className="mt-1 text-sm font-medium text-white">
                  {isConnected && address ? walletLabel : "Not connected"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => open()}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-400/15"
              >
                <Wallet className="h-3.5 w-3.5" />
                {walletLabel}
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-200 md:col-span-2">
                <span className="px-1">Agent name</span>
                <input
                  name="name"
                  type="text"
                  defaultValue="Alpha Research Bot"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-base text-white outline-none ring-0 placeholder:text-slate-500 transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
                <span className="px-1">Category</span>
                <select name="category" defaultValue="analytics" className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20">
                  <option value="analytics">Analytics</option>
                  <option value="security">Security</option>
                  <option value="trading">Trading</option>
                  <option value="liquidity">Liquidity</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
                <span className="px-1">Price</span>
                <input
                  name="price"
                  type="text"
                  defaultValue="0.25 BOT"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-200 md:col-span-2">
                <span className="px-1">Description</span>
                <textarea
                  name="description"
                  defaultValue="Cross-chain market monitoring and strategy automation for research teams."
                  rows={4}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-200 md:col-span-2">
                <span className="px-1">Usage tier</span>
                <input
                  name="usageTier"
                  type="text"
                  defaultValue="1.2K runs"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </label>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={!isConnected || pending}
                className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-medium text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!isConnected
                  ? "Connect wallet to publish"
                  : pending
                    ? isRegistryConfigured
                      ? "Publishing on-chain…"
                      : "Publishing…"
                    : isRegistryConfigured
                      ? "Publish agent on-chain"
                      : "Publish agent on-chain"}
              </button>

              <a
                href={`https://scan.botchain.ai/address/${REGISTRY_ADDRESS || "0x098110E536DD50de8386a4f3BBfA4e07833766B7"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-cyan-300"
              >
                <span>Writes to AgentRegistry on {activeChain.name}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            {submitted ? (
              <div className="mt-6 space-y-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                <div>
                  <div className="mb-2 flex items-center gap-2 font-medium text-emerald-100">
                    <CheckCircle2 className="h-4 w-4" />
                    {txHash ? "Listed on Botchain" : "Submission queued"}
                  </div>
                  {txHash
                    ? `Your agent was published on-chain from ${walletLabel}.`
                    : address
                      ? `Your agent was submitted from ${walletLabel} and is pending review.`
                      : "Your agent has been submitted for review and will appear in the marketplace once verified."}
                </div>

                <div className="flex flex-wrap gap-3">
                  {txHash ? (
                    <a
                      href={explorerTxUrl(txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 font-medium text-emerald-100 ring-1 ring-emerald-400/30 transition hover:bg-emerald-500/20"
                    >
                      View transaction
                    </a>
                  ) : null}

                  <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 font-medium text-emerald-100 ring-1 ring-emerald-400/30 transition hover:bg-emerald-500/20">
                    Open creator dashboard
                  </Link>
                </div>
              </div>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
