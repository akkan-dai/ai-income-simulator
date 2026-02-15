import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI収支シミュレーター — BitradeXモデル対応",
  description:
    "BitradeXモデル対応の想定計算ツール。プラン別利回りを使った単利ベースの収支シミュレーション。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans text-slate-100 antialiased">{children}</body>
    </html>
  );
}
