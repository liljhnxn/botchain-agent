import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bot, CheckCircle2, ShieldCheck, Star, Zap } from "lucide-react";
import { DeployAgentButton } from "../../components/deploy-agent-button";

const agents = {
  "de-fi-copilot": {
    name: "DeFi Copilot",
    category: "Trading",
    price: "0.25 BOT",
    rating: 4.9,
    status: "Live",
    logo: "D",
    accent: "from-cyan-500 via-sky-500 to-blue-600",
    description: "Automated treasury routing and market monitoring for onchain yield strategies.",
    longDescription:
      "DeFi Copilot continuously monitors treasury allocations, yield opportunities, and liquidity conditions across Botchain and connected chains. It can suggest or automate safe rebalancing and treasury routing based on live market conditions.",
    features: ["Treasury optimization", "Risk scoring", "Yield routing"],
  },
  "risk-monitor": {
    name: "Risk Monitor",
    category: "Security",
    price: "0.15 BOT",
    rating: 4.8,
    status: "Monitoring",
    logo: "R",
    accent: "from-violet-500 via-fuchsia-500 to-purple-600",
    description: "Real-time anomaly detection, wallet alerts, and smart-contract health checks.",
    longDescription:
      "Risk Monitor watches wallet behavior, governance signals, and contract health in real time. It detects anomalous transactions and highlights suspicious protocol changes before they become expensive issues.",
    features: ["Wallet anomaly detection", "Contract checks", "Alerting"],
  },
  "research-agent": {
    name: "Research Agent",
    category: "Analytics",
    price: "0.35 BOT",
    rating: 4.9,
    status: "Active",
    logo: "A",
    accent: "from-emerald-500 via-teal-500 to-cyan-600",
    description: "Cross-chain signal aggregation and insight generation for strategy teams.",
    longDescription:
      "Research Agent aggregates signals from market data, protocol updates, and wallet activity, creating explainable summaries and strategic recommendations for operators and research teams.",
    features: ["Cross-chain insights", "Signal replay", "Strategy summaries"],
  },
  "arbitrage-scout": {
    name: "Arbitrage Scout",
    category: "Liquidity",
    price: "0.22 BOT",
    rating: 4.7,
    status: "Live",
    logo: "S",
    accent: "from-amber-500 via-orange-500 to-rose-500",
    description: "Detects cross-market dislocations and routes execution opportunities in real time.",
    longDescription:
      "Arbitrage Scout watches liquidity and price spreads across markets to find execution opportunities before they disappear. It highlights the most efficient route for capital deployment and rebalancing.",
    features: ["Price spread analysis", "Routing alerts", "Execution timing"],
  },
};

export function generateStaticParams() {
  return Object.keys(agents).map((slug) => ({ slug }));
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = agents[slug as keyof typeof agents];

  if (!agent) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(82,133,255,0.22),_transparent_50%),linear-gradient(180deg,#07111f_0%,#0d172a_100%)] text-white">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/agents" className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500">
            <ArrowLeft className="h-4 w-4" />
            Back to agents
          </Link>

          <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
            {agent.category}
          </div>
        </div>

        <section className="grid gap-8 rounded-[32px] border border-slate-800 bg-slate-900/60 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${agent.accent} text-2xl font-bold text-white shadow-lg shadow-cyan-950/20`}>
                {agent.logo}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Featured agent</p>
                <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">{agent.name}</h1>
              </div>
            </div>

            <p className="max-w-xl text-base leading-7 text-slate-300">{agent.longDescription}</p>

            <div className="mt-6 flex items-center gap-6 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                {agent.rating} rating
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Verified deployment
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {agent.features.map((feature) => (
                <span key={feature} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current price</p>
                <div className="mt-2 text-3xl font-black text-white">{agent.price}</div>
              </div>
              <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
                {agent.status}
              </div>
            </div>

            <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <Bot className="h-4 w-4 text-cyan-300" />
                Execution layer
              </div>
              <div className="text-lg font-semibold text-white">Botchain Testnet</div>
            </div>

            <DeployAgentButton agentName={agent.name} />

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <div className="mb-2 flex items-center gap-2 font-medium text-white">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Included
              </div>
              <ul className="space-y-2">
                <li>• On-chain deployment metadata</li>
                <li>• Wallet-based access controls</li>
                <li>• Usage reporting and payouts</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
