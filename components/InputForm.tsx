"use client";

import type { PlanId, VipLevel, HorizonSelect, Inputs } from "@/lib/types";
import { PLANS, PLAN_IDS, VIP_LEVELS, VIP_LEVEL_IDS } from "@/lib/constants";
import { getDailyRate } from "@/lib/calc";
import { fmtPct } from "@/lib/format";

// ─── Shared Styles ───────────────────────────────────────────────────────────

const inputBase =
  "w-full px-3 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 text-sm";
const inputCls = `${inputBase} bg-slate-800/60 border-slate-600/50 text-slate-100 placeholder-slate-500 focus:ring-amber-500/40 focus:border-amber-500/60`;
const selectCls = `${inputCls} appearance-none`;
const labelCls =
  "block text-[11px] font-medium text-slate-400 mb-1.5 tracking-wide uppercase";
const sectionTitle = "text-sm font-semibold tracking-widest uppercase";
const cardCls = "rounded-xl p-5 border bg-slate-800/40 border-slate-700/50";

// ─── Tiny Sub-components ─────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-amber-500" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
      <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">
        {label}
      </span>
    </label>
  );
}

function SectionBadge({
  letter,
  color,
}: {
  letter: string;
  color: string;
}) {
  return (
    <div
      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${color}`}
    >
      {letter}
    </div>
  );
}

function PlanSelect({
  value,
  onChange,
}: {
  value: PlanId;
  onChange: (v: PlanId) => void;
}) {
  return (
    <select
      className={selectCls}
      value={value}
      onChange={(e) => onChange(e.target.value as PlanId)}
    >
      {PLAN_IDS.map((id) => (
        <option key={id} value={id}>
          {PLANS[id].label}
        </option>
      ))}
    </select>
  );
}

function VipSelect({
  value,
  onChange,
}: {
  value: VipLevel;
  onChange: (v: VipLevel) => void;
}) {
  return (
    <select
      className={selectCls}
      value={value}
      onChange={(e) => onChange(e.target.value as VipLevel)}
    >
      {VIP_LEVEL_IDS.map((id) => (
        <option key={id} value={id}>
          {id}
          {VIP_LEVELS[id].label !== id
            ? ` (${VIP_LEVELS[id].label})`
            : ""}
        </option>
      ))}
    </select>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  inputs: Inputs;
  horizonSelect: HorizonSelect;
  customHorizon: number;
  onChange: <K extends keyof Inputs>(key: K, value: Inputs[K]) => void;
  onHorizonSelectChange: (v: HorizonSelect) => void;
  onCustomHorizonChange: (v: number) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function InputForm({
  inputs,
  horizonSelect,
  customHorizon,
  onChange,
  onHorizonSelectChange,
  onCustomHorizonChange,
}: Props) {
  const numChange = (key: keyof Inputs, raw: string) => {
    const v = parseFloat(raw);
    (onChange as (k: keyof Inputs, v: number) => void)(
      key,
      isNaN(v) ? 0 : Math.max(0, v)
    );
  };

  return (
    <div className="space-y-5">
      {/* ── A. 本人投資 ── */}
      <div className={cardCls}>
        <div className="flex items-center gap-2 mb-4">
          <SectionBadge letter="A" color="bg-amber-500/20 text-amber-400" />
          <h2 className={`${sectionTitle} text-slate-200`}>本人投資</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="投資額 (USD)">
            <input
              type="number"
              className={inputCls}
              value={inputs.principalUSD || ""}
              placeholder="1000"
              onChange={(e) => numChange("principalUSD", e.target.value)}
              min={0}
            />
          </Field>

          <Field label="運用プラン">
            <PlanSelect
              value={inputs.plan}
              onChange={(v) => onChange("plan", v)}
            />
          </Field>

          <Field label="計算期間">
            <select
              className={selectCls}
              value={horizonSelect}
              onChange={(e) =>
                onHorizonSelectChange(e.target.value as HorizonSelect)
              }
            >
              <option value="30">30日</option>
              <option value="90">90日</option>
              <option value="180">180日</option>
              <option value="360">360日</option>
              <option value="custom">カスタム</option>
            </select>
          </Field>

          {horizonSelect === "custom" && (
            <Field label="カスタム日数">
              <input
                type="number"
                className={inputCls}
                value={customHorizon}
                onChange={(e) =>
                  onCustomHorizonChange(
                    Math.max(1, parseInt(e.target.value) || 1)
                  )
                }
                min={1}
              />
            </Field>
          )}

          <Field label="開始日">
            <input
              type="date"
              className={inputCls}
              value={inputs.startDateISO || ""}
              onChange={(e) => onChange("startDateISO", e.target.value)}
            />
          </Field>

          <Field label="あなたのレベル">
            <VipSelect
              value={inputs.myLevel}
              onChange={(v) => onChange("myLevel", v)}
            />
          </Field>
        </div>

        <div className="mt-3 px-3 py-2 rounded-md bg-slate-900/50 text-xs text-slate-500">
          📌 {PLANS[inputs.plan].label} — 日次想定利率:{" "}
          {fmtPct(getDailyRate(inputs.plan))} · {PLANS[inputs.plan].lock}
        </div>
      </div>

      {/* ── B. チーム ── */}
      <div className={cardCls}>
        <div className="flex items-center gap-2 mb-4">
          <SectionBadge
            letter="B"
            color="bg-emerald-500/20 text-emerald-400"
          />
          <h2 className={`${sectionTitle} text-slate-200`}>
            チーム（紹介）
          </h2>
        </div>

        {/* 直接 */}
        <p className="text-xs text-slate-500 mb-3">直接紹介</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Field label="人数">
            <input
              type="number"
              className={inputCls}
              value={inputs.directCount || ""}
              placeholder="0"
              onChange={(e) => numChange("directCount", e.target.value)}
              min={0}
            />
          </Field>
          <Field label="平均投資額">
            <input
              type="number"
              className={inputCls}
              value={inputs.directAvgPrincipalUSD || ""}
              placeholder="0"
              onChange={(e) =>
                numChange("directAvgPrincipalUSD", e.target.value)
              }
              min={0}
            />
          </Field>
          <Field label="平均プラン">
            <PlanSelect
              value={inputs.directAvgPlan}
              onChange={(v) => onChange("directAvgPlan", v)}
            />
          </Field>
        </div>

        {/* 間接 */}
        <p className="text-xs text-slate-500 mb-3">間接紹介</p>
        <div className="grid grid-cols-3 gap-3">
          <Field label="人数">
            <input
              type="number"
              className={inputCls}
              value={inputs.indirectCount || ""}
              placeholder="0"
              onChange={(e) => numChange("indirectCount", e.target.value)}
              min={0}
            />
          </Field>
          <Field label="平均投資額">
            <input
              type="number"
              className={inputCls}
              value={inputs.indirectAvgPrincipalUSD || ""}
              placeholder="0"
              onChange={(e) =>
                numChange("indirectAvgPrincipalUSD", e.target.value)
              }
              min={0}
            />
          </Field>
          <Field label="平均プラン">
            <PlanSelect
              value={inputs.indirectAvgPlan}
              onChange={(v) => onChange("indirectAvgPlan", v)}
            />
          </Field>
        </div>
      </div>

      {/* ── C. 動的収益 ── */}
      <div className={cardCls}>
        <div className="flex items-center gap-2 mb-4">
          <SectionBadge
            letter="C"
            color="bg-violet-500/20 text-violet-400"
          />
          <h2 className={`${sectionTitle} text-slate-200`}>
            動的収益（レベル差）
          </h2>
        </div>

        <Toggle
          label="動的収益を計算する"
          checked={inputs.enableDynamic}
          onChange={(v) => onChange("enableDynamic", v)}
        />

        {inputs.enableDynamic && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Field label="直接紹介 平均レベル">
              <VipSelect
                value={inputs.directAvgLevel}
                onChange={(v) => onChange("directAvgLevel", v)}
              />
            </Field>
            <Field label="間接紹介 平均レベル">
              <VipSelect
                value={inputs.indirectAvgLevel}
                onChange={(v) => onChange("indirectAvgLevel", v)}
              />
            </Field>
          </div>
        )}

        {inputs.enableDynamic && inputs.myLevel === "VIP0" && (
          <div className="mt-3 text-xs text-amber-400/80 bg-amber-500/10 rounded-md px-3 py-2">
            ⚠ あなたのレベルが「VIP0（未設定）」のため、動的収益は 0
            になります。
          </div>
        )}
      </div>

      {/* ── D. 表示設定 ── */}
      <div className={cardCls}>
        <div className="flex items-center gap-2 mb-4">
          <SectionBadge letter="D" color="bg-sky-500/20 text-sky-400" />
          <h2 className={`${sectionTitle} text-slate-200`}>表示設定</h2>
        </div>

        <div className="space-y-3">
          <Toggle
            label="日本円を併記"
            checked={inputs.enableJPY}
            onChange={(v) => onChange("enableJPY", v)}
          />

          {inputs.enableJPY && (
            <Field label="為替レート (USD/JPY)">
              <input
                type="number"
                className={inputCls}
                value={inputs.fxJPY || ""}
                placeholder="150"
                onChange={(e) => numChange("fxJPY", e.target.value)}
                min={1}
              />
            </Field>
          )}

          <Toggle
            label="回収日数にチーム報酬を含める"
            checked={inputs.includeTeamInPayback}
            onChange={(v) => onChange("includeTeamInPayback", v)}
          />
        </div>
      </div>
    </div>
  );
}
