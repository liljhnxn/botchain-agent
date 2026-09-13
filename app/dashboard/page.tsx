"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Bot, CreditCard, ShieldCheck, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { PurchaseAgentButton } from "@/app/components/purchase-agent-button";
import { fetchAgentRevenue, fetchOnchainAgents, isRegistryConfigured } from "@/lib/registry";

type DashboardListing = {
  id?: bigint;
  priceWei?: bigint;
  name: string;
  status: string;
  price: string;
  usage: string;
  revenue: string;
  accent: string;
};

const initialListings: DashboardListing[] = [
  {
    name: "Alpha Research Bot",
    status: "Live",
    price: "0.25 BOT",
    usage: "1.2K runs",
    revenue: "$4,820",
    accent: "from-cyan-500 via-sky-500 to-blue-600",
  },
  {
    name: "Market Pulse AI",
    status: "Live",
    price: "0.32 BOT",
    usage: "2.7K runs",
    revenue: "$8,160",
    accent: "from-violet-500 via-fuchsia-500 to-purple-600",
  },
];

export default function DashboardPage() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const [listings, setListings] = useState(initialListings);
  const [totalRevenue, setTotalRevenue] = useState(BigInt(0));
  const walletLabel = isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected";
  const metrics = [
    { label: "Total revenue", value: `${formatEther(totalRevenue)} BOT`, icon: CreditCard },
    { label: "Active listings", value: String(listings.length).padStart(2, "0"), icon: Bot },
    { label: "Conversion rate", value: "On-chain", icon: TrendingUp },
    { label: "Uptime", value: "99.9%", icon: ShieldCheck },
  ];

  useEffect(() => {
    const loadListings = async () => {
      try {
        // Prefer on-chain listings when the registry contract is deployed.
        if (isRegistryConfigured) {
          const onchain = await fetchOnchainAgents();
          if (onchain.length > 0) {
            const onchainListings = await Promise.all(
              onchain.map(async (agent) => ({
                id: agent.id,
                priceWei: agent.priceWei,
                name: agent.name,
                status: "On-chain",
                price: agent.price,
                usage: agent.usageTier || "Starter plan",
                revenue: `${formatEther(await fetchAgentRevenue(agent.id))} BOT`,
                accent: "from-cyan-500 via-sky-500 to-blue-600",
              }))
            );
            setListings(onchainListings);
            setTotalRevenue(
              await Promise.all(onchain.map((agent) => fetchAgentRevenue(agent.id))).then((revenues) =>
                revenues.reduce((sum, revenue) => sum + revenue, BigInt(0))
              )
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
              name: agent.name,
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
            {listings.map((agent) => (
              <div key={agent.name} className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-4 md:flex-row md:items-center md:justify-between">
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

                {agent.id !== undefined && agent.priceWei !== undefined ? (
                  <PurchaseAgentButton agentId={agent.id} priceWei={agent.priceWei} />
                ) : (
                  <button className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200">
                    Manage
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
