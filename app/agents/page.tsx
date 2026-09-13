"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, ShieldCheck, Star, Zap } from "lucide-react";

const baseAgents = [
  {
    slug: "de-fi-copilot",
    name: "DeFi Copilot",
    category: "Trading",
    price: "0.25 BOT",
    rating: 4.9,
    status: "Live",
    logo: "D",
    accent: "from-cyan-500 via-sky-500 to-blue-600",
    description: "Automated treasury routing and market monitoring for onchain yield strategies.",
  },
  {
    slug: "risk-monitor",
    name: "Risk Monitor",
    category: "Security",
    price: "0.15 BOT",
    rating: 4.8,
    status: "Live",
    logo: "R",
    accent: "from-violet-500 via-fuchsia-500 to-purple-600",
    description: "Real-time anomaly detection, wallet alerts, and smart-contract health checks.",
  },
  {
    slug: "research-agent",
    name: "Research Agent",
    category: "Analytics",
    price: "0.35 BOT",
    rating: 4.9,
    status: "Live",
    logo: "A",
    accent: "from-emerald-500 via-teal-500 to-cyan-600",
    description: "Cross-chain signal aggregation and insight generation for strategy teams.",
  },
  {
    slug: "arbitrage-scout",
    name: "Arbitrage Scout",
    category: "Liquidity",
    price: "0.22 BOT",
    rating: 4.7,
    status: "Live",
    logo: "S",
    accent: "from-amber-500 via-orange-500 to-rose-500",
    description: "Detects cross-market dislocations and routes execution opportunities in real time.",
  },
  {
    slug: "yield-optimizer",
    name: "Yield Optimizer",
    category: "DeFi",
    price: "0.18 BOT",
    rating: 4.8,
    status: "Live",
    logo: "Y",
    accent: "from-lime-500 via-emerald-500 to-teal-600",
    description: "Balances vault exposure across protocols to maximize risk-adjusted returns.",
  },
  {
    slug: "wallet-guardian",
    name: "Wallet Guardian",
    category: "Security",
    price: "0.20 BOT",
    rating: 4.9,
    status: "Live",
    logo: "W",
    accent: "from-rose-500 via-pink-500 to-violet-600",
    description: "Flags suspicious transaction patterns and monitors custody risk in real time.",
  },
  {
    slug: "signal-ops",
    name: "Signal Ops",
    category: "Operations",
    price: "0.27 BOT",
    rating: 4.6,
    status: "Live",
    logo: "O",
    accent: "from-sky-500 via-cyan-500 to-indigo-600",
    description: "Automates smart routing, execution alerts, and operator handoff workflows.",
  },
  {
    slug: "market-mapper",
    name: "Market Mapper",
    category: "Analytics",
    price: "0.16 BOT",
    rating: 4.7,
    status: "Live",
    logo: "M",
    accent: "from-indigo-500 via-violet-500 to-purple-600",
    description: "Visualizes liquidity and flow patterns so teams can spot emerging opportunities earlier.",
  },
  {
    slug: "audit-ally",
    name: "Audit Ally",
    category: "Compliance",
    price: "0.19 BOT",
    rating: 4.8,
    status: "Live",
    logo: "A",
    accent: "from-amber-500 via-orange-500 to-red-500",
    description: "Performs policy checks and compliance scoring for onchain operational workflows.",
  },
];

export default function AgentsPage() {
  const [visibleAgents, setVisibleAgents] = useState(baseAgents.slice(0, 6));

  const loadMore = () => {
    setVisibleAgents((current) => {
      const nextCount = current.length + 3;
      return baseAgents.slice(0, nextCount);
    });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(82,133,255,0.22),_transparent_50%),linear-gradient(180deg,#07111f_0%,#0d172a_100%)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
            Marketplace
          </div>
        </div>

        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Discovery</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">Browse agents</h1>
        </header>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
              <Zap className="h-4 w-4 text-cyan-300" />
              Active agents
            </div>
            <div className="text-2xl font-bold text-white">1,240</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Verified
            </div>
            <div className="text-2xl font-bold text-white">94%</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
              <Star className="h-4 w-4 text-violet-300" />
              Top rating
            </div>
            <div className="text-2xl font-bold text-white">4.9</div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleAgents.map((agent) => (
            <article key={agent.name} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${agent.accent} text-lg font-bold text-white`}>
                    {agent.logo}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{agent.category}</p>
                    <h2 className="text-xl font-semibold text-white">{agent.name}</h2>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-emerald-300">
                  {agent.status}
                </span>
              </div>

              <p className="mb-4 text-sm leading-6 text-slate-300">{agent.description}</p>

              <div className="mb-5 flex items-center justify-between text-sm text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  {agent.rating}
                </span>
                <span className="text-cyan-300">{agent.price}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <Link href={`/agents/${agent.slug}`} className="rounded-full border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-500 hover:text-cyan-200">
                  View details
                </Link>
                <Link href={`/agents/${agent.slug}`} className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-cyan-500/20">
                  Deploy
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center">
          {visibleAgents.length < baseAgents.length ? (
            <button onClick={loadMore} className="rounded-full border border-slate-700 bg-slate-900/60 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/80">
              Load more agents
            </button>
          ) : (
            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200">
              You’ve reached the marketplace catalog
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
