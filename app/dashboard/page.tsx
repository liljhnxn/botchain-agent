"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Bot, CreditCard, ShieldCheck, Sparkles, TrendingUp, Wallet, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getAccount, switchChain, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { isAddress, parseEther } from "viem";
import { wagmiConfig } from "@/app/providers";
import { AGENT_REGISTRY_ABI, botchainTestnet, fetchOnchainAgents, isRegistryConfigured, REGISTRY_ADDRESS } from "@/lib/registry";

type DashboardListing = {
  id?: bigint;
  name: string;
  category: string;
  description: string;
  status: string;
  price: string;
  usage: string;
  revenue: string;
  accent: string;
};

const initialListings: DashboardListing[] = [
  {
    name: "Alpha Research Bot",
    category: "Analytics",
    description: "Cross-chain market monitoring and strategy automation for research teams.",
    status: "Live",
    price: "0.25 BOT",
    usage: "1.2K runs",
    revenue: "$4,820",
    accent: "from-cyan-500 via-sky-500 to-blue-600",
  },
  {
    name: "Market Pulse AI",
    category: "Trading",
    description: "Market sentiment routing and execution alerting for treasury teams.",
    status: "Live",
    price: "0.32 BOT",
    usage: "2.7K runs",
    revenue: "$8,160",
    accent: "from-violet-500 via-fuchsia-500 to-purple-600",
  },
];

const metrics = [
  { label: "Monthly revenue", value: "$24.8K", icon: CreditCard },
  { label: "Active listings", value: "08", icon: Bot },
  { label: "Conversion rate", value: "18.4%", icon: TrendingUp },
  { label: "Uptime", value: "99.9%", icon: ShieldCheck },
];

function payoutInterval(schedule: string) {
  if (schedule === "Weekly") return BigInt(7 * 24 * 60 * 60);
  if (schedule === "Quarterly") return BigInt(90 * 24 * 60 * 60);
  return BigInt(30 * 24 * 60 * 60);
}

export default function DashboardPage() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const [listings, setListings] = useState(initialListings);
  const [selectedListing, setSelectedListing] = useState<DashboardListing | null>(null);
  const [draft, setDraft] = useState({ name: "", price: "", usage: "" });
  const [payoutSettings, setPayoutSettings] = useState({ wallet: "", schedule: "Monthly", automatic: true });
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const walletLabel = isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected";

  const handleManage = (agent: DashboardListing) => {
    setSelectedListing(agent);
    setDraft({ name: agent.name, price: agent.price, usage: agent.usage });
    setPayoutSettings({
      wallet: address || localStorage.getItem(`agent-payout-wallet:${agent.name}`) || "",
      schedule: localStorage.getItem(`agent-payout-schedule:${agent.name}`) || "Monthly",
      automatic: localStorage.getItem(`agent-payout-automatic:${agent.name}`) !== "false",
    });
    setWithdrawAmount("");
    setError(null);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!selectedListing || !draft.name.trim() || !draft.price.trim()) return;
    if (!isAddress(payoutSettings.wallet)) {
      setError("Enter a valid payout wallet address.");
      return;
    }

    setError(null);
    setPending(true);

    try {
      if (selectedListing.id !== undefined) {
        if (!isConnected || !REGISTRY_ADDRESS || !wagmiConfig) {
          throw new Error("Connect the listing creator wallet before saving on-chain changes.");
        }

        const account = getAccount(wagmiConfig);
        if (!account.isConnected) throw new Error("Connect your wallet before saving.");
        if (account.chainId !== botchainTestnet.id) {
          await switchChain(wagmiConfig, { chainId: botchainTestnet.id });
        }

        const updateHash = await writeContract(wagmiConfig, {
          address: REGISTRY_ADDRESS,
          abi: AGENT_REGISTRY_ABI,
          functionName: "updateAgent",
          args: [selectedListing.id, draft.name.trim(), selectedListing.category, draft.price.trim(), selectedListing.description, draft.usage.trim() || "Starter plan"],
          chainId: botchainTestnet.id,
        });
        await waitForTransactionReceipt(wagmiConfig, { hash: updateHash });

        const payoutHash = await writeContract(wagmiConfig, {
          address: REGISTRY_ADDRESS,
          abi: AGENT_REGISTRY_ABI,
          functionName: "setPayoutSettings",
          args: [selectedListing.id, payoutSettings.wallet as `0x${string}`, payoutInterval(payoutSettings.schedule), payoutSettings.automatic],
          chainId: botchainTestnet.id,
        });
        await waitForTransactionReceipt(wagmiConfig, { hash: payoutHash });
      }

      const updatedListing = {
        ...selectedListing,
        name: draft.name.trim(),
        price: draft.price.trim(),
        usage: draft.usage.trim() || "Starter plan",
      };

      setListings((current) => current.map((listing) => (listing === selectedListing ? updatedListing : listing)));
      setSelectedListing(updatedListing);
      localStorage.setItem(`agent-payout-wallet:${updatedListing.name}`, payoutSettings.wallet.trim());
      localStorage.setItem(`agent-payout-schedule:${updatedListing.name}`, payoutSettings.schedule);
      localStorage.setItem(`agent-payout-automatic:${updatedListing.name}`, String(payoutSettings.automatic));
      setSaved(true);
    } catch (err: unknown) {
      setError((err as { shortMessage?: string })?.shortMessage || (err as Error)?.message || "Transaction failed.");
    } finally {
      setPending(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedListing || selectedListing.id === undefined || !withdrawAmount.trim()) return;
    if (!isConnected || !REGISTRY_ADDRESS || !wagmiConfig) {
      setError("Connect the listing creator wallet before withdrawing.");
      return;
    }
    if (!isAddress(payoutSettings.wallet)) {
      setError("Enter a valid payout wallet address before withdrawing.");
      return;
    }

    setError(null);
    setPending(true);
    try {
      const account = getAccount(wagmiConfig);
      if (!account.isConnected) throw new Error("Connect your wallet before withdrawing.");
      if (account.chainId !== botchainTestnet.id) {
        await switchChain(wagmiConfig, { chainId: botchainTestnet.id });
      }

      // Ensure the contract has a payout wallet even when the user skips Save changes.
      const settingsHash = await writeContract(wagmiConfig, {
        address: REGISTRY_ADDRESS,
        abi: AGENT_REGISTRY_ABI,
        functionName: "setPayoutSettings",
        args: [selectedListing.id, payoutSettings.wallet as `0x${string}`, payoutInterval(payoutSettings.schedule), payoutSettings.automatic],
        chainId: botchainTestnet.id,
      });
      await waitForTransactionReceipt(wagmiConfig, { hash: settingsHash });

      const hash = await writeContract(wagmiConfig, {
        address: REGISTRY_ADDRESS,
        abi: AGENT_REGISTRY_ABI,
        functionName: "withdrawPayout",
        args: [selectedListing.id, parseEther(withdrawAmount.trim())],
        chainId: botchainTestnet.id,
      });
      await waitForTransactionReceipt(wagmiConfig, { hash });
      setWithdrawAmount("");
      setSaved(true);
    } catch (err: unknown) {
      setError((err as { shortMessage?: string })?.shortMessage || (err as Error)?.message || "Payout transaction failed.");
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    const loadListings = async () => {
      try {
        // Prefer on-chain listings when the registry contract is deployed.
        if (isRegistryConfigured) {
          const onchain = await fetchOnchainAgents();
          if (onchain.length > 0) {
            setListings(
              onchain.map((agent) => ({
                id: agent.id,
                name: agent.name,
                category: agent.category,
                description: agent.description,
                status: "On-chain",
                price: agent.price,
                usage: agent.usageTier || "Starter plan",
                revenue: "—",
                accent: "from-cyan-500 via-sky-500 to-blue-600",
              }))
            );
            return;
          }
        }

        const response = await fetch("/api/agents");
        if (!response.ok) return;

        const agents = await response.json();
        if (Array.isArray(agents) && agents.length > 0) {
          setListings(
            agents.map((agent: any) => ({
                id: undefined,
              name: agent.name,
                category: agent.category || "General",
                description: agent.description || "",
              status: "Live",
              price: agent.price,
              usage: agent.usageTier || "Starter plan",
              revenue: "$1,240",
              accent: "from-cyan-500 via-sky-500 to-blue-600",
            }))
          );
        }
      } catch {
        // Keep the initial listings on any failure.
      }
    };

    loadListings();
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(82,133,255,0.22),_transparent_50%),linear-gradient(180deg,#07111f_0%,#0d172a_100%)] text-white">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
            Creator dashboard
          </div>
        </div>

        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Overview</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white">{isConnected ? `Welcome back, ${walletLabel}` : "Your marketplace performance"}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => open()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-500"
            >
              <Wallet className="h-4 w-4 text-cyan-300" />
              {walletLabel}
            </button>

            <Link href="/list-agent" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-medium text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110">
              New listing
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-2.5">
                  <Icon className="h-4 w-4 text-cyan-300" />
                </div>
                <Sparkles className="h-4 w-4 text-violet-300" />
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="mt-1 text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </section>

        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Listings</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Your agents</h2>
            </div>
            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-emerald-300">
              Auto synced
            </div>
          </div>

          <div className="space-y-4">
            {listings.map((agent, index) => (
              <div key={`${agent.name}-${index}`} className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${agent.accent} text-lg font-bold text-white`}>
                    {agent.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">{agent.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                      <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-slate-300">{agent.status}</span>
                      <span>{agent.price}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2 md:min-w-[260px]">
                  <div>
                    <div className="text-slate-400">Usage</div>
                    <div className="font-medium text-white">{agent.usage}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Revenue</div>
                    <div className="font-medium text-white">{agent.revenue}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleManage(agent)}
                  className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        </section>

        {selectedListing ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-sm" role="presentation" onClick={() => setSelectedListing(null)}>
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="manage-listing-title"
              className="w-full max-w-lg rounded-[28px] border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-slate-950/50"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Manage listing</p>
                  <h2 id="manage-listing-title" className="mt-2 text-2xl font-bold text-white">
                    {selectedListing.name}
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="Close management panel"
                  onClick={() => setSelectedListing(null)}
                  className="rounded-full border border-slate-700 p-2 text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                className="mt-6 space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSave();
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-slate-300 sm:col-span-2">
                    Agent name
                    <input
                      value={draft.name}
                      onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-white outline-none transition focus:border-cyan-400"
                      required
                    />
                  </label>
                  <label className="text-sm text-slate-300">
                    Price
                    <input
                      value={draft.price}
                      onChange={(event) => setDraft((current) => ({ ...current, price: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-white outline-none transition focus:border-cyan-400"
                      required
                    />
                  </label>
                  <label className="text-sm text-slate-300">
                    Usage tier
                    <input
                      value={draft.usage}
                      onChange={(event) => setDraft((current) => ({ ...current, usage: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-white outline-none transition focus:border-cyan-400"
                    />
                  </label>
                </div>

                <div className="border-t border-slate-800 pt-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Payout settings</p>
                  <div className="mt-4 space-y-4">
                    <label className="block text-sm text-slate-300">
                      Payout wallet
                      <input
                        value={payoutSettings.wallet}
                        onChange={(event) => setPayoutSettings((current) => ({ ...current, wallet: event.target.value }))}
                        placeholder="0x..."
                        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-white outline-none transition focus:border-cyan-400"
                      />
                    </label>
                    <label className="block text-sm text-slate-300">
                      Payout frequency
                      <select
                        value={payoutSettings.schedule}
                        onChange={(event) => setPayoutSettings((current) => ({ ...current, schedule: event.target.value }))}
                        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-white outline-none transition focus:border-cyan-400"
                      >
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Quarterly</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-3 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={payoutSettings.automatic}
                        onChange={(event) => setPayoutSettings((current) => ({ ...current, automatic: event.target.checked }))}
                        className="h-4 w-4 accent-cyan-400"
                      />
                      Enable automatic payouts
                    </label>
                  </div>
                </div>

                {selectedListing.id !== undefined ? (
                  <div className="border-t border-slate-800 pt-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Withdraw payout</p>
                    <div className="mt-3 flex gap-3">
                      <input
                        value={withdrawAmount}
                        onChange={(event) => setWithdrawAmount(event.target.value)}
                        inputMode="decimal"
                        placeholder="Amount in BOT"
                        className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-white outline-none transition focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => void handleWithdraw()}
                        disabled={pending || !withdrawAmount.trim()}
                        className="rounded-xl border border-emerald-400/40 px-4 py-2.5 text-sm font-medium text-emerald-200 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Withdraw
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">The registry must hold native BOT before a payout can be withdrawn.</p>
                  </div>
                ) : (
                  <p className="text-xs leading-5 text-slate-400">This fallback listing is not on-chain yet. Save changes here to update this browser only.</p>
                )}

                {error ? <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}

                <div className="flex items-center gap-3">
                  <button type="submit" disabled={pending} className="flex-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
                    {pending ? "Confirm in wallet..." : "Save changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedListing(null)}
                    className="rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500"
                  >
                    Done
                  </button>
                </div>
                {saved ? <p className="text-center text-sm text-emerald-300">Changes saved to this dashboard.</p> : null}
              </form>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
