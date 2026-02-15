# BitradeX 収益シミュレーター（Phase 1）

BitradeXのプラン別想定利回り（固定値）を使った**単利ベース**の収益シミュレーター。

## 機能（Phase 1）

- **本人運用収益** — DAILY / D30 / D90 / D180 / D360 プラン対応
- **紹介報酬（静的収益）** — 直接紹介 10% / 間接紹介 5%
- **動的収益（レベル差報酬）** — VIP0〜VIP6 のレベル差ベース（トグルON時のみ）
- **回収シミュレーション** — 元本回収日数 & 予定日表示
- **円換算** — USD/JPY レート入力で日本円併記

## 技術スタック

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** でスタイリング
- チャートは Phase 2 で追加予定（Phase 1 は表ベース）

## プロジェクト構造

```
src/
├── app/
│   ├── globals.css       # Tailwind + カスタムスタイル
│   ├── layout.tsx        # ルートレイアウト
│   └── page.tsx          # メインページ（状態管理）
├── components/
│   ├── DisclosureNote.tsx # 免責事項コンポーネント
│   ├── Header.tsx        # ヘッダー + 注意事項折りたたみ
│   ├── InputForm.tsx     # 入力フォーム（A〜D セクション）
│   ├── Results.tsx       # 結果表示（詳細セクション）
│   └── SummaryCards.tsx  # サマリーカード群
└── lib/
    ├── calc.ts           # 計算関数（getDailyRate, profitSimple, calcAll 等）
    ├── constants.ts      # 固定利回り・VIPレート定数
    ├── format.ts         # 数値フォーマット（USD, JPY, %, 日数）
    ├── types.ts          # 型定義（Inputs, Breakdown, PlanId, VipLevel）
    └── __tests__/
        └── calc.test.ts  # 計算関数ユニットテスト
```

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000 でアクセス

## テスト

```bash
npx tsx src/lib/__tests__/calc.test.ts
```

## 注意事項

- 本シミュレーション結果は想定値であり、将来の収益を保証するものではありません
- 元本および収益の保証はありません
- 手数料・価格変動・運用停止・規約変更等は計算に含まれていません
- 投資判断はご自身の責任において行ってください
