export default function Hero() {
    return (
      <section className="relative overflow-hidden py-10">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/15 blur-3xl" />
          <div className="absolute -bottom-24 right-[-40px] h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
        </div>
  
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                AI × 暗号資産ビジネス
              </div>
  
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                初期投資 約45万円から始める
                <span className="block bg-gradient-to-r from-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  次世代ビジネスの設計図
                </span>
              </h1>
  
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200/90 sm:text-lg">
                これは投資の勧誘ではなく、AIと暗号資産を使った次世代の<strong>“事業設計”</strong>です。
                数字で理解し、あなたの行動（集客・紹介）で回収スピードを上げる導線を用意します。
              </p>
  
              {/* Key points */}
              <ul className="mt-6 grid gap-3 text-sm text-slate-200/90 sm:grid-cols-2">
                <li className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="font-medium text-white">D360で設計</div>
                  <div className="mt-1 text-slate-200/80">長期運用前提で“回収→拡大”を可視化</div>
                </li>
                <li className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="font-medium text-white">3000ドルが起点</div>
                  <div className="mt-1 text-slate-200/80">初期投資の基準を明確にする</div>
                </li>
                <li className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="font-medium text-white">バーチャルカード</div>
                  <div className="mt-1 text-slate-200/80">リターンを生活で使う体験へ</div>
                </li>
                <li className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="font-medium text-white">紹介で加速</div>
                  <div className="mt-1 text-slate-200/80">“集客×チーム”で回収速度を上げる</div>
                </li>
              </ul>
  
              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#simulator"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-white/90"
                >
                  まずはシミュレーションしてみる
                </a>
                <a
                  href="#guide"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  事業の全体像を見る
                </a>
              </div>
  
              <p className="mt-4 text-xs text-slate-200/60">
                ※本ページは収益を保証するものではありません。数値は入力条件により変動します。
              </p>
            </div>
  
            {/* Visual card */}
            <div className="relative">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">D360 事業設計フロー</div>
                  <div className="text-xs text-slate-200/70">ver. LP</div>
                </div>
  
                <div className="mt-4 space-y-3">
                  {[
                    { k: "Step 1", v: "3000ドルで設計開始（初期投資）" },
                    { k: "Step 2", v: "月次リターンを可視化（生活利用まで）" },
                    { k: "Step 3", v: "紹介×チームで回収速度を上げる" },
                    { k: "Step 4", v: "再投資で“事業拡大”へ" },
                  ].map((row) => (
                    <div
                      key={row.k}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-slate-900/40 p-3"
                    >
                      <div className="mt-0.5 rounded-lg bg-white/10 px-2 py-1 text-xs text-slate-100">
                        {row.k}
                      </div>
                      <div className="text-sm text-slate-100/90">{row.v}</div>
                    </div>
                  ))}
                </div>
  
                <div className="mt-5 rounded-xl border border-white/10 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 p-4">
                  <div className="text-xs text-slate-200/70">次のアクション</div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    「5人紹介 × 3000ドル」で回収がどう変わるか試してみる
                  </div>
                </div>
              </div>
  
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }
