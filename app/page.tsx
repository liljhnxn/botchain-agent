import { ArrowRight, Bot, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { WalletButton } from "./components/wallet-button";

const featuredAgents = [
  {
    name: "DeFi Copilot",
    category: "Trading",
    price: "0.25 BOT",
    description: "Automated treasury routing and market monitoring for onchain yield strategies.",
  },
  {
    name: "Risk Monitor",
    category: "Security",
    price: "0.15 BOT",
    description: "Real-time anomaly detection, wallet alerts, and smart-contract health checks.",
  },
  {
    name: "Research Agent",
    category: "Analytics",
    price: "0.35 BOT",
    description: "Cross-chain signal aggregation and insight generation for strategy teams.",
  },
];

const stats = [
  { label: "Agents listed", value: "1.2K+" },
  { label: "Volume traded", value: "$4.8M" },
  { label: "Avg. ROI", value: "18.4%" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(82,133,255,0.22),_transparent_50%),linear-gradient(180deg,#07111f_0%,#0d172a_100%)]">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Botchain</p>
              <h1 className="text-lg font-semibold text-white">Agent Marketplace</h1>
            </div>
          </div>

          <WalletButton />
        </header>

        <section className="grid gap-10 pb-10 pt-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              Decentralized AI Economy
            </div>

            <h2 className="max-w-xl text-5xl font-black leading-tight tracking-tight text-white md:text-6xl">
              Discover, deploy, and monetize AI agents on Botchain.
            </h2>

            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Access verified autonomous agents, tokenized services, and on-chain workflows in a secure marketplace built for the Botchain testnet.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-medium text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:brightness-110">
                Explore Agents
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="rounded-full border border-slate-700 bg-slate-900/60 px-6 py-3 font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800/80">
                List an Agent
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Network</p>
                <h3 className="mt-1 text-xl font-semibold text-white">Botchain Testnet</h3>
              </div>
              <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                Active
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                  <Zap className="h-4 w-4 text-cyan-300" />
                  Chain ID
                </div>
                <div className="font-mono text-lg text-white">968 / 0x3c8</div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  RPC
                </div>
                <div className="truncate font-mono text-sm text-white">https://rpc.bohr.life</div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                  <Bot className="h-4 w-4 text-violet-300" />
                  Explorer
                </div>
                <div className="truncate font-mono text-sm text-white">https://scan.botchain.ai</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Featured</p>
              <h3 className="mt-2 text-3xl font-bold text-white">Top performing agents</h3>
            </div>
            <button className="text-sm font-medium text-cyan-300 hover:text-cyan-200">View all</button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {featuredAgents.map((agent) => (
              <article key={agent.name} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-cyan-500/40 hover:bg-slate-900/80">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs uppercase tracking-[0.15em] text-slate-300">
                    {agent.category}
                  </span>
                  <span className="text-sm font-semibold text-cyan-300">{agent.price}</span>
                </div>

                <h4 className="mb-2 text-xl font-semibold text-white">{agent.name}</h4>
                <p className="text-sm leading-6 text-slate-300">{agent.description}</p>

                <button className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-cyan-300">
                  View details
                  <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="pb-16 pt-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "On-chain discovery",
                description: "Search, compare, and verify agent metadata with transparent reputation signals.",
              },
              {
                title: "Trusted execution",
                description: "Deploy tasks with escrow-backed workflows and auditable transaction trails.",
              },
              {
                title: "Creator monetization",
                description: "List agents, define usage tiers, and receive payouts directly to your wallet.",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
                <div className="mb-3 h-10 w-10 rounded-2xl bg-cyan-500/10" />
                <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
