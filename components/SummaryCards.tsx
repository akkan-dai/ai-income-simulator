"use client";

import { fmtUSD, fmtJPY } from "@/lib/format";

// ─── Accent color map ────────────────────────────────────────────────────────

type Accent = "amber" | "emerald" | "sky" | "violet" | "rose";

const BG: Record<Accent, string> = {
  amber: "from-amber-500/15 to-amber-600/5 border-amber-500/25",
  emerald: "from-emerald-500/15 to-emerald-600/5 border-emerald-500/25",
  sky: "from-sky-500/15 to-sky-600/5 border-sky-500/25",
  violet: "from-violet-500/15 to-violet-600/5 border-violet-500/25",
  rose: "from-rose-500/15 to-rose-600/5 border-rose-500/25",
};

const TEXT: Record<Accent, string> = {
  amber: "text-amber-400",
  emerald: "text-emerald-400",
  sky: "text-sky-400",
  violet: "text-violet-400",
  rose: "text-rose-400",
};

function Card({
  label,
  usd,
  jpy,
  enableJPY,
  accent,
}: {
  label: string;
  usd: number;
  jpy?: number;
  enableJPY: boolean;
  accent: Accent;
}) {
  return (
    <div
      className={`rounded-xl p-4 border bg-gradient-to-br ${BG[accent]}`}
    >
      <div className="text-[11px] text-slate-400 mb-1 tracking-wide uppercase">
        {label}
      </div>
      <div className={`text-xl font-bold ${TEXT[accent]} tracking-tight`}>
        {fmtUSD(usd)}
      </div>
      {enableJPY && jpy != null && (
        <div className="text-sm text-slate-400 mt-0.5">{fmtJPY(jpy)}</div>
      )}
    </div>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  dailyProfitUSD: number;
  totalUSD: number;
  horizonDays: number;
  enableJPY: boolean;
  fx: number;
}

export default function SummaryCards({
  dailyProfitUSD,
  totalUSD,
  horizonDays,
  enableJPY,
  fx,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Card
        label="1日あたり"
        usd={dailyProfitUSD}
        jpy={dailyProfitUSD * fx}
        enableJPY={enableJPY}
        accent="amber"
      />
      <Card
        label="30日あたり"
        usd={dailyProfitUSD * 30}
        jpy={dailyProfitUSD * 30 * fx}
        enableJPY={enableJPY}
        accent="emerald"
      />
      <Card
        label={`${horizonDays}日 累積`}
        usd={totalUSD}
        jpy={totalUSD * fx}
        enableJPY={enableJPY}
        accent="sky"
      />
      <Card
        label="年間想定"
        usd={dailyProfitUSD * 365}
        jpy={dailyProfitUSD * 365 * fx}
        enableJPY={enableJPY}
        accent="violet"
      />
    </div>
  );
}
