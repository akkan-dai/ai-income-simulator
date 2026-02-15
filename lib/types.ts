// ─── Plan & VIP Types ────────────────────────────────────────────────────────

export type PlanId = "DAILY" | "D30" | "D90" | "D180" | "D360";

export type VipLevel =
  | "VIP0"
  | "VIP1"
  | "VIP2"
  | "VIP3"
  | "VIP4"
  | "VIP5"
  | "VIP6";

// ─── Input Model ─────────────────────────────────────────────────────────────

export interface Inputs {
  // A. 本人
  principalUSD: number;
  plan: PlanId;
  horizonDays: number;
  startDateISO?: string; // 'YYYY-MM-DD'
  myLevel: VipLevel;

  // B. チーム
  directCount: number;
  directAvgPrincipalUSD: number;
  directAvgPlan: PlanId;
  indirectCount: number;
  indirectAvgPrincipalUSD: number;
  indirectAvgPlan: PlanId;

  // C. 動的収益
  enableDynamic: boolean;
  directAvgLevel: VipLevel;
  indirectAvgLevel: VipLevel;

  // D. 表示
  enableJPY: boolean;
  fxJPY: number;

  // 回収
  includeTeamInPayback: boolean;
}

// ─── Output Model ────────────────────────────────────────────────────────────

export interface Breakdown {
  // 本人
  ownProfitUSD: number;

  // チーム運用利益（紹介者全員の合計利益）
  directTeamProfitUSD: number;
  indirectTeamProfitUSD: number;

  // 静的ボーナス
  directBonusUSD: number;
  indirectBonusUSD: number;
  staticTotalUSD: number;

  // 動的（レベル差）
  dynamicDirectUSD: number;
  dynamicIndirectUSD: number;
  dynamicTotalUSD: number;

  // 総合計
  totalUSD: number;

  // 表示用レート
  ownDailyRate: number;
  directDailyRate: number;
  indirectDailyRate: number;
  myLevelRate: number;
  directDiffRate: number;
  indirectDiffRate: number;

  // 日次総利益
  dailyProfitUSD: number;

  // 回収
  paybackDays?: number;
  paybackDateISO?: string;
}

// ─── UI helper ───────────────────────────────────────────────────────────────

/** horizonDays select で使う値 + custom */
export type HorizonSelect = "30" | "90" | "180" | "360" | "custom";
