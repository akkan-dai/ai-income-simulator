"use client";

import type { Inputs, Breakdown } from "@/lib/types";
import { PLANS, DIRECT_RATE, INDIRECT_RATE } from "@/lib/constants";
import { fmtUSD, fmtJPY, fmtPct, fmtDays } from "@/lib/format";
import SummaryCards from "./SummaryCards";

// ─── Reusable detail row ─────────────────────────────────────────────────────

function DetailRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex justify-between items-baseline py-2.5 border-b border-slate-700/40 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="text-right">
        <span className="text-sm font-medium text-slate-200">{value}</span>
        {sub && <div className="text-xs text-slate-500">{sub}</div>}
      </div>
    </div>
  );
}

// ─── Section card wrapper ────────────────────────────────────────────────────

type DotColor = "amber" | "emerald" | "sky" | "violet" | "rose";

const DOT: Record<DotColor, string> = {
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  rose: "bg-rose-500",
};

function SectionCard({
  title,
  color,
  children,
}: {
  title: string;
  color: DotColor;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-5 border bg-slate-800/40 border-slate-700/50">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${DOT[color]}`} />
        <h3 className="text-sm font-semibold tracking-widest uppercase text-slate-200">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  inputs: Inputs;
  result: Breakdown;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Results({ inputs, result }: Props) {
  const fx = inputs.fxJPY || 150;
  const jpySub = (usd: number) =>
    inputs.enableJPY ? fmtJPY(usd * fx) : undefined;

  return (
    <div className="space-y-5">
      {/* 1) Summary Cards */}
      <SummaryCards
        dailyProfitUSD={result.dailyProfitUSD}
        totalUSD={result.totalUSD}
        horizonDays={inputs.horizonDays}
        enableJPY={inputs.enableJPY}
        fx={fx}
      />

      {/* Payback + Breakdown row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 回収見込み */}
        <div className="rounded-xl p-4 border bg-gradient-to-br from-rose-500/15 to-rose-600/5 border-rose-500/25">
          <div className="text-[11px] text-slate-400 mb-1 tracking-wide uppercase">
            回収見込み
          </div>
          <div className="text-xl font-bold text-rose-400 tracking-tight">
            {result.paybackDays != null ? fmtDays(result.paybackDays) : "—"}
          </div>
          {result.paybackDateISO && (
            <div className="text-sm text-slate-400 mt-0.5">
              予定日: {result.paybackDateISO}
            </div>
          )}
          <div className="text-xs text-slate-600 mt-1">
            {inputs.includeTeamInPayback
              ? "チーム報酬込み"
              : "本人運用のみ"}
          </div>
        </div>

        {/* 内訳 */}
        <div className="sm:col-span-2 rounded-xl p-4 border bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <div className="text-[11px] text-slate-400 mb-2 tracking-wide uppercase">
            内訳（{inputs.horizonDays}日間）
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <span className="text-sm">
              <span className="text-slate-500">本人:</span>{" "}
              <span className="text-amber-300 font-medium">
                {fmtUSD(result.ownProfitUSD)}
              </span>
            </span>
            <span className="text-sm">
              <span className="text-slate-500">直接:</span>{" "}
              <span className="text-emerald-300 font-medium">
                {fmtUSD(result.directBonusUSD)}
              </span>
            </span>
            <span className="text-sm">
              <span className="text-slate-500">間接:</span>{" "}
              <span className="text-sky-300 font-medium">
                {fmtUSD(result.indirectBonusUSD)}
              </span>
            </span>
            {inputs.enableDynamic && result.dynamicTotalUSD > 0 && (
              <span className="text-sm">
                <span className="text-slate-500">動的:</span>{" "}
                <span className="text-violet-300 font-medium">
                  {fmtUSD(result.dynamicTotalUSD)}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2) 本人運用 詳細 */}
      <SectionCard title="本人運用 詳細" color="amber">
        <DetailRow
          label="日次想定利率（単利）"
          value={fmtPct(result.ownDailyRate)}
        />
        <DetailRow
          label={`${inputs.horizonDays}日間 累積利益（想定）`}
          value={fmtUSD(result.ownProfitUSD)}
          sub={jpySub(result.ownProfitUSD)}
        />
        <DetailRow
          label="プラン"
          value={PLANS[inputs.plan].label}
          sub={PLANS[inputs.plan].lock}
        />
      </SectionCard>

      {/* 3) 紹介報酬（静的収益） */}
      <SectionCard title="紹介報酬（静的収益）" color="emerald">
        <DetailRow
          label="直接チーム運用利益（合計）"
          value={fmtUSD(result.directTeamProfitUSD)}
        />
        <DetailRow
          label={`→ 直接紹介報酬 (${(DIRECT_RATE * 100).toFixed(0)}%)`}
          value={fmtUSD(result.directBonusUSD)}
          sub={jpySub(result.directBonusUSD)}
        />
        <DetailRow
          label="間接チーム運用利益（合計）"
          value={fmtUSD(result.indirectTeamProfitUSD)}
        />
        <DetailRow
          label={`→ 間接紹介報酬 (${(INDIRECT_RATE * 100).toFixed(0)}%)`}
          value={fmtUSD(result.indirectBonusUSD)}
          sub={jpySub(result.indirectBonusUSD)}
        />
        <DetailRow
          label="静的収益 合計"
          value={fmtUSD(result.staticTotalUSD)}
          sub={jpySub(result.staticTotalUSD)}
        />
      </SectionCard>

      {/* 4) 動的収益 */}
      {inputs.enableDynamic && (
        <SectionCard title="動的収益（レベル差報酬）" color="violet">
          <DetailRow
            label="あなたのレベル率"
            value={fmtPct(result.myLevelRate)}
          />
          <DetailRow
            label="直接紹介との差分率"
            value={fmtPct(result.directDiffRate)}
          />
          <DetailRow
            label="→ 直接 レベル差報酬"
            value={fmtUSD(result.dynamicDirectUSD)}
            sub={jpySub(result.dynamicDirectUSD)}
          />
          <DetailRow
            label="間接紹介との差分率"
            value={fmtPct(result.indirectDiffRate)}
          />
          <DetailRow
            label="→ 間接 レベル差報酬"
            value={fmtUSD(result.dynamicIndirectUSD)}
            sub={jpySub(result.dynamicIndirectUSD)}
          />
          <DetailRow
            label="動的収益 合計"
            value={fmtUSD(result.dynamicTotalUSD)}
            sub={jpySub(result.dynamicTotalUSD)}
          />
        </SectionCard>
      )}

      {/* 5) 総収益 */}
      <div className="rounded-xl p-5 border bg-gradient-to-br from-amber-500/10 via-slate-800/40 to-slate-800/40 border-amber-500/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <h3 className="text-sm font-semibold tracking-widest uppercase text-amber-300">
            総収益（想定）
          </h3>
        </div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl font-bold text-amber-400 font-mono">
            {fmtUSD(result.totalUSD)}
          </span>
          {inputs.enableJPY && (
            <span className="text-lg text-amber-300/60">
              {fmtJPY(result.totalUSD * fx)}
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {inputs.horizonDays}日間 ·{" "}
          {inputs.includeTeamInPayback
            ? "チーム報酬込み"
            : "本人運用のみ"}
        </div>
      </div>
    </div>
  );
}
