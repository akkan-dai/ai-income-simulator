"use client";

import { useState, useMemo, useCallback } from "react";
import type { Inputs, HorizonSelect } from "@/lib/types";
import { calcAll } from "@/lib/calc";
import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import Results from "@/components/Results";
import DisclosureNote from "@/components/DisclosureNote";

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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <DisclosureNote compact />
        </div>
      </footer>
    </div>
  );
}
