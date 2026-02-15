import type { PlanId, VipLevel } from "./types";

// ─── Plan Definitions ────────────────────────────────────────────────────────

export interface PlanDef {
  label: string;
  /** 満期収益率（単利）。DAILY は null（年率で計算） */
  maturityReturn: number | null;
  /** DAILY 用年率 */
  annualReturn: number | null;
  /** プラン期間日数 */
  durationDays: number;
  /** ロック表示文言 */
  lock: string;
}

export const PLANS: Record<PlanId, PlanDef> = {
  DAILY: {
    label: "DAILY",
    maturityReturn: null,
    annualReturn: 0.9125,
    durationDays: 365,
    lock: "なし（即時出金想定）",
  },
  D30: {
    label: "D30 (30日)",
    maturityReturn: 0.09,
    annualReturn: null,
    durationDays: 30,
    lock: "30日ロック",
  },
  D90: {
    label: "D90 (90日)",
    maturityReturn: 0.315,
    annualReturn: null,
    durationDays: 90,
    lock: "90日ロック",
  },
  D180: {
    label: "D180 (180日)",
    maturityReturn: 0.72,
    annualReturn: null,
    durationDays: 180,
    lock: "180日ロック",
  },
  D360: {
    label: "D360 (360日)",
    maturityReturn: 1.80,
    annualReturn: null,
    durationDays: 360,
    lock: "360日ロック",
  },
};

export const PLAN_IDS: PlanId[] = ["DAILY", "D30", "D90", "D180", "D360"];

// ─── Referral Rates ──────────────────────────────────────────────────────────

export const DIRECT_RATE = 0.1;
export const INDIRECT_RATE = 0.05;

// ─── VIP Level Rates ─────────────────────────────────────────────────────────

export interface VipDef {
  label: string;
  rate: number;
}

export const VIP_LEVELS: Record<VipLevel, VipDef> = {
  VIP0: { label: "未設定", rate: 0 },
  VIP1: { label: "VIP1", rate: 0.1 },
  VIP2: { label: "VIP2", rate: 0.2 },
  VIP3: { label: "VIP3", rate: 0.3 },
  VIP4: { label: "VIP4", rate: 0.4 },
  VIP5: { label: "VIP5", rate: 0.5 },
  VIP6: { label: "VIP6", rate: 0.6 },
};

export const VIP_LEVEL_IDS: VipLevel[] = [
  "VIP0",
  "VIP1",
  "VIP2",
  "VIP3",
  "VIP4",
  "VIP5",
  "VIP6",
];
