"use client";

const ITEMS = [
  "本シミュレーション結果は想定値であり、将来の収益を保証するものではありません。",
  "元本および収益の保証はありません。",
  "ロック期間・出金制約が適用される場合があります（DAILYプランは即時出金想定）。",
  "手数料・価格変動・運用停止・規約変更等は計算に含まれていません。",
  "投資判断はご自身の責任において行ってください。",
];

interface Props {
  compact?: boolean;
}

export default function DisclosureNote({ compact }: Props) {
  if (compact) {
    return (
      <div className="text-xs text-slate-500 leading-relaxed space-y-0.5">
        <p>本シミュレーションは参考値であり、</p>
        <p>将来の収益・元本を保証するものではありません。</p>
        <p>暗号資産には価格変動リスクがあります。</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {ITEMS.map((text, i) => (
        <div
          key={i}
          className="flex gap-2 text-xs text-slate-500 leading-relaxed"
        >
          <span className="text-slate-600 mt-0.5 shrink-0">•</span>
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}
