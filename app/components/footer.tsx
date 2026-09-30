import Link from "next/link";
import { ArrowUpRight, Bot, Globe, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800/80 py-8 text-sm text-slate-400">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-slate-300">
          <Bot className="h-4 w-4 text-cyan-400" />
          <span>
            Botchain Agent Marketplace — Built on{" "}
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cyan-300 underline decoration-cyan-500/50 underline-offset-2 transition hover:text-cyan-100 hover:decoration-cyan-300"
            >
              BOT Chain (botchain.ai)
            </a>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <a
            href="https://botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-300 transition hover:text-cyan-100 hover:underline"
          >
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span>https://botchain.ai</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://scan.botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 transition hover:text-slate-100 hover:underline"
          >
            <span>Mainnet Explorer</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://scan.botchain.ai/address/0x098110E536DD50de8386a4f3BBfA4e07833766B7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 transition hover:text-emerald-300 hover:underline"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Verified Contract</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
