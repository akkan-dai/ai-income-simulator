import type { PlanId, VipLevel, Inputs, Breakdown } from "./types";
import {
  PLANS,
  DIRECT_RATE,
  INDIRECT_RATE,
  VIP_LEVELS,
} from "./constants";

// ─── 4-1. getDailyRate ───────────────────────────────────────────────────────

export function getDailyRate(plan: PlanId): number {
  const p = PLANS[plan];
  if (plan === "DAILY") {
    return (p.annualReturn ?? 0) / 365;
  }
  return (p.maturityReturn ?? 0) / p.durationDays;
}

// ─── 4-2. profitSimple ──────────────────────────────────────────────────────

export function profitSimple(
  principalUSD: number,
  dailyRate: number,
  days: number
): number {
  if (
    !Number.isFinite(principalUSD) ||
    !Number.isFinite(dailyRate) ||
    !Number.isFinite(days)
  ) {
    return 0;
  }
  if (principalUSD <= 0 || dailyRate <= 0 || days < 0) return 0;
  return principalUSD * dailyRate * days;
}

// ─── 4-3. teamProfitSimple ──────────────────────────────────────────────────

export function teamProfitSimple(
  count: number,
  avgP: number,
  plan: PlanId,
  days: number
): number {
  if (count <= 0 || avgP <= 0) return 0;
  const dailyRate = getDailyRate(plan);
  const profitPerUser = profitSimple(avgP, dailyRate, days);
  return count * profitPerUser;
}

// ─── 4-4. staticBonuses ─────────────────────────────────────────────────────

export function staticBonuses(
  teamProfitDirect: number,
  teamProfitIndirect: number
): { directBonusUSD: number; indirectBonusUSD: number } {
  return {
    directBonusUSD: teamProfitDirect * DIRECT_RATE,
    indirectBonusUSD: teamProfitIndirect * INDIRECT_RATE,
  };
}

// ─── 4-5. levelRate ─────────────────────────────────────────────────────────

export function levelRate(level: VipLevel): number {
  return VIP_LEVELS[level]?.rate ?? 0;
}

// ─── 4-6. levelDiffBonus ────────────────────────────────────────────────────

export function levelDiffBonus(
  teamProfit: number,
  myLevel: VipLevel,
  memberAvgLevel: VipLevel
): number {
  const my = levelRate(myLevel);
  const mem = levelRate(memberAvgLevel);
  const diff = Math.max(0, my - mem);
  return teamProfit * diff;
}

// ─── 4-7. calcAll ───────────────────────────────────────────────────────────

export function calcAll(inputs: Inputs): Breakdown {
  const days = Math.max(0, inputs.horizonDays || 0);

  // 本人
  const ownDailyRate = getDailyRate(inputs.plan);
  const ownProfitUSD = profitSimple(inputs.principalUSD, ownDailyRate, days);

  // チーム
  const directDailyRate = getDailyRate(inputs.directAvgPlan);
  const indirectDailyRate = getDailyRate(inputs.indirectAvgPlan);

  const directTeamProfitUSD = teamProfitSimple(
    inputs.directCount,
    inputs.directAvgPrincipalUSD,
    inputs.directAvgPlan,
    days
  );
  const indirectTeamProfitUSD = teamProfitSimple(
    inputs.indirectCount,
    inputs.indirectAvgPrincipalUSD,
    inputs.indirectAvgPlan,
    days
  );

  // 静的ボーナス
  const { directBonusUSD, indirectBonusUSD } = staticBonuses(
    directTeamProfitUSD,
    indirectTeamProfitUSD
  );
  const staticTotalUSD = ownProfitUSD + directBonusUSD + indirectBonusUSD;

  // 動的（レベル差）
  let dynamicDirectUSD = 0;
  let dynamicIndirectUSD = 0;
  let dynamicTotalUSD = 0;

  if (inputs.enableDynamic && inputs.myLevel !== "VIP0") {
    dynamicDirectUSD = levelDiffBonus(
      directTeamProfitUSD,
      inputs.myLevel,
      inputs.directAvgLevel
    );
    dynamicIndirectUSD = levelDiffBonus(
      indirectTeamProfitUSD,
      inputs.myLevel,
      inputs.indirectAvgLevel
    );
    dynamicTotalUSD = dynamicDirectUSD + dynamicIndirectUSD;
  }

  // 総合計
  const totalUSD = staticTotalUSD + dynamicTotalUSD;

  // 日次
  const dailyProfitUSD = days > 0 ? totalUSD / days : 0;

  // 回収
  let paybackDays: number | undefined;
  let paybackDateISO: string | undefined;

  const dailyForPayback =
    days > 0
      ? inputs.includeTeamInPayback
        ? totalUSD / days
        : ownProfitUSD / days
      : 0;

  if (dailyForPayback > 0 && inputs.principalUSD > 0) {
    paybackDays = inputs.principalUSD / dailyForPayback;

    if (inputs.startDateISO) {
      try {
        const d = new Date(inputs.startDateISO + "T00:00:00");
        if (!isNaN(d.getTime())) {
          d.setDate(d.getDate() + Math.ceil(paybackDays));
          paybackDateISO = d.toISOString().slice(0, 10);
        }
      } catch {
        // ignore invalid date
      }
    }
  }

  // レート情報
  const myLevelRate = levelRate(inputs.myLevel);
  const directDiffRate = Math.max(
    0,
    myLevelRate - levelRate(inputs.directAvgLevel)
  );
  const indirectDiffRate = Math.max(
    0,
    myLevelRate - levelRate(inputs.indirectAvgLevel)
  );

  return {
    ownProfitUSD,
    directTeamProfitUSD,
    indirectTeamProfitUSD,
    directBonusUSD,
    indirectBonusUSD,
    staticTotalUSD,
    dynamicDirectUSD,
    dynamicIndirectUSD,
    dynamicTotalUSD,
    totalUSD,
    ownDailyRate,
    directDailyRate,
    indirectDailyRate,
    myLevelRate,
    directDiffRate,
    indirectDiffRate,
    dailyProfitUSD,
    paybackDays,
    paybackDateISO,
  };
}
