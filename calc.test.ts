/**
 * 簡易テスト — Node.js で直接実行可能
 *
 *   npx ts-node --esm src/lib/__tests__/calc.test.ts
 *   or: npx tsx src/lib/__tests__/calc.test.ts
 *
 * Phase1 では Jest 不要。手動確認用。
 */

import {
  getDailyRate,
  profitSimple,
  teamProfitSimple,
  staticBonuses,
  levelRate,
  levelDiffBonus,
  calcAll,
} from "../calc";
import type { Inputs } from "../types";

// ─── helpers ─────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(label: string, actual: number, expected: number, tol = 1e-6) {
  const ok = Math.abs(actual - expected) < tol;
  if (ok) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.error(`  ❌ ${label} — got ${actual}, expected ${expected}`);
  }
}

// ─── getDailyRate ────────────────────────────────────────────────────────────

console.log("\n📐 getDailyRate");
assert("D30 daily rate", getDailyRate("D30"), 0.09 / 30);
assert("D90 daily rate", getDailyRate("D90"), 0.315 / 90);
assert("D180 daily rate", getDailyRate("D180"), 0.72 / 180);
assert("D360 daily rate", getDailyRate("D360"), 1.8 / 360);
assert("DAILY daily rate", getDailyRate("DAILY"), 0.9125 / 365);

// ─── profitSimple ────────────────────────────────────────────────────────────

console.log("\n💰 profitSimple");
const d30Rate = getDailyRate("D30");
assert("1000 USD D30 30d", profitSimple(1000, d30Rate, 30), 1000 * 0.09);
assert("0 principal", profitSimple(0, d30Rate, 30), 0);
assert("0 days", profitSimple(1000, d30Rate, 0), 0);

// ─── teamProfitSimple ────────────────────────────────────────────────────────

console.log("\n👥 teamProfitSimple");
assert(
  "5 users × $500 D90 90d",
  teamProfitSimple(5, 500, "D90", 90),
  5 * 500 * 0.315
);
assert("0 users", teamProfitSimple(0, 500, "D90", 90), 0);

// ─── staticBonuses ───────────────────────────────────────────────────────────

console.log("\n🎁 staticBonuses");
const { directBonusUSD, indirectBonusUSD } = staticBonuses(1000, 2000);
assert("direct 10%", directBonusUSD, 100);
assert("indirect 5%", indirectBonusUSD, 100);

// ─── levelRate / levelDiffBonus ──────────────────────────────────────────────

console.log("\n🏅 levelRate & levelDiffBonus");
assert("VIP0 rate", levelRate("VIP0"), 0);
assert("VIP3 rate", levelRate("VIP3"), 0.3);
assert("VIP6 rate", levelRate("VIP6"), 0.6);

assert("diff VIP3 vs VIP1", levelDiffBonus(1000, "VIP3", "VIP1"), 1000 * 0.2);
assert("diff VIP1 vs VIP3 (capped 0)", levelDiffBonus(1000, "VIP1", "VIP3"), 0);
assert("diff same level", levelDiffBonus(1000, "VIP2", "VIP2"), 0);

// ─── calcAll integration ─────────────────────────────────────────────────────

console.log("\n🧮 calcAll (integration)");
const input: Inputs = {
  principalUSD: 1000,
  plan: "D90",
  horizonDays: 90,
  startDateISO: "2025-01-01",
  myLevel: "VIP3",
  directCount: 5,
  directAvgPrincipalUSD: 500,
  directAvgPlan: "D90",
  indirectCount: 10,
  indirectAvgPrincipalUSD: 300,
  indirectAvgPlan: "D90",
  enableDynamic: true,
  directAvgLevel: "VIP1",
  indirectAvgLevel: "VIP0",
  enableJPY: true,
  fxJPY: 150,
  includeTeamInPayback: true,
};

const r = calcAll(input);

assert("own profit", r.ownProfitUSD, 1000 * 0.315);
assert("direct team profit", r.directTeamProfitUSD, 5 * 500 * 0.315);
assert("indirect team profit", r.indirectTeamProfitUSD, 10 * 300 * 0.315);
assert("direct bonus", r.directBonusUSD, r.directTeamProfitUSD * 0.1);
assert("indirect bonus", r.indirectBonusUSD, r.indirectTeamProfitUSD * 0.05);
assert(
  "dynamic direct (VIP3-VIP1=20%)",
  r.dynamicDirectUSD,
  r.directTeamProfitUSD * 0.2
);
assert(
  "dynamic indirect (VIP3-VIP0=30%)",
  r.dynamicIndirectUSD,
  r.indirectTeamProfitUSD * 0.3
);
assert(
  "total = static + dynamic",
  r.totalUSD,
  r.staticTotalUSD + r.dynamicTotalUSD
);

// payback
if (r.paybackDays != null) {
  const dailyTotal = r.totalUSD / 90;
  assert("payback days", r.paybackDays, 1000 / dailyTotal);
}

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n━━━ Results: ${passed} passed, ${failed} failed ━━━\n`);
if (failed > 0) process.exit(1);
