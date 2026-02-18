"use client";

import { useState, useMemo, useCallback } from "react";
import type { Inputs, HorizonSelect } from "@/lib/types";
import { calcAll } from "@/lib/calc";
import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import Results from "@/components/Results";
import DisclosureNote from "@/components/DisclosureNote";
import Hero from "@/components/Hero";
// ─── Default state ───────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10);

const DEFAULT_INPUTS: Inputs = {
  principalUSD: 1000,
  plan: "D90",
  horizonDays: 90,
  startDateISO: today,
  myLevel: "VIP0",

  directCount: 0,
  directAvgPrincipalUSD: 0,
  directAvgPlan: "D90",
  indirectCount: 0,
  indirectAvgPrincipalUSD: 0,
  indirectAvgPlan: "D90",

  enableDynamic: false,
  directAvgLevel: "VIP0",
  indirectAvgLevel: "VIP0",

  enableJPY: true,
  fxJPY: 150,

  includeTeamInPayback: true,
};

// ─── Page Component ──────────────────────────────────────────────────────────

export default function HomePage() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [horizonSelect, setHorizonSelect] = useState<HorizonSelect>("90");
  const [customHorizon, setCustomHorizon] = useState(90);

  // Generic field setter
  const handleChange = useCallback(
    <K extends keyof Inputs>(key: K, value: Inputs[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Horizon select handler
  const handleHorizonSelect = useCallback(
    (v: HorizonSelect) => {
      setHorizonSelect(v);
      if (v === "custom") {
        setInputs((prev) => ({ ...prev, horizonDays: customHorizon }));
      } else {
        setInputs((prev) => ({ ...prev, horizonDays: parseInt(v) }));
      }
    },
    [customHorizon]
  );

  // Custom horizon handler
  const handleCustomHorizon = useCallback((v: number) => {
    const clamped = Math.max(1, v);
    setCustomHorizon(clamped);
    setInputs((prev) => ({ ...prev, horizonDays: clamped }));
  }, []);

  // Calculate
  const result = useMemo(() => calcAll(inputs), [inputs]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
  
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <Hero />
  
        {/* ✅ スクロールの着地点（空div） */}
        <div id="simulator" className="scroll-mt-40" />
  
        <section className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Panel */}
            <div className="lg:col-span-5">
              <InputForm
                inputs={inputs}
                horizonSelect={horizonSelect}
                customHorizon={customHorizon}
                onChange={handleChange}
                onHorizonSelectChange={handleHorizonSelect}
                onCustomHorizonChange={handleCustomHorizon}
              />
            </div>
  
            {/* Results Panel */}
            <div className="lg:col-span-7">
              <Results inputs={inputs} result={result} />
            </div>
          </div>
  
          {/* ✅ LINE CTA（ページ下） */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">この数字を実現したい方へ</h3>
            <p className="mt-2 text-sm text-slate-200/80">
              無料で、ビジネスとしての取り組み方・集客方法までお伝えします。
            </p>
  
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://lin.ee/tU2tSZz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition"
              >
                無料で相談する →
              </a>
  
            
            </div>
  
            <div className="mt-3 text-xs text-slate-200/60">
              ※これは投資の勧誘ではなく、事業設計の検証用シミュレーションです。
            </div>
          </div>
        </section>
        {/* ✅ ページ最下部 LINE CTA */}
<div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
  <h3 className="text-lg font-semibold text-white">無料で相談したい方はこちら</h3>
  <p className="mt-2 text-sm text-slate-200/80">
    あなたの状況に合わせて、取り組み方・集客の考え方を整理してお伝えします。
  </p>

  <div className="mt-4">
    <a
      href="https://lin.ee/tU2tSZz"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition"
    >
      LINEで無料相談する →
    </a>
  </div>

  <div className="mt-3 text-xs text-slate-200/60">
    ※これは投資の勧誘ではなく、事業設計の検討用シミュレーションです。
  </div>
</div>
      </main>
    </div>
  );
}
