/**
 * USD表示（小数2桁、桁区切り）
 */
export function fmtUSD(v: number | undefined | null): string {
  if (v == null || !Number.isFinite(v)) return "$0.00";
  return (
    "$" +
    v.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/**
 * JPY表示（整数、桁区切り）
 */
export function fmtJPY(v: number | undefined | null): string {
  if (v == null || !Number.isFinite(v)) return "¥0";
  return "¥" + Math.round(v).toLocaleString("ja-JP");
}

/**
 * パーセント表示（小数2桁）
 */
export function fmtPct(v: number | undefined | null): string {
  if (v == null || !Number.isFinite(v)) return "0.00%";
  return (v * 100).toFixed(2) + "%";
}

/**
 * 日数表示
 */
export function fmtDays(v: number | undefined | null): string {
  if (v == null || !Number.isFinite(v)) return "—";
  return Math.ceil(v).toLocaleString() + "日";
}
