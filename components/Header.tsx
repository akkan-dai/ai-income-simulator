"use client";

import { useState } from "react";
import DisclosureNote from "./DisclosureNote";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="border-b border-slate-800/80 backdrop-blur-sm sticky top-0 z-30"
      style={{ background: "rgba(15,23,42,0.88)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-amber-500/20">
              B
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-100">
                AI収支シミュレーター
              </h1>
              <p className="text-[11px] text-slate-400 tracking-wide">
                BitradeXモデル対応
              </p>
              <p className="text-[10px] text-slate-500 tracking-wide">
                ※想定計算ツール
              </p>
            </div>
          </div>

          {/* Toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <span>⚠</span> 注意事項 {open ? "▲" : "▼"}
          </button>
        </div>

        {open && (
          <div className="mt-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 animate-fadeIn">
            <DisclosureNote />
          </div>
        )}
      </div>
    </header>
  );
}
