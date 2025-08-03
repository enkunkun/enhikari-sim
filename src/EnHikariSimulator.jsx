import { useState } from "react";

const BASE_FEE = 390; // 円
const UNIT_PRICE = 25.3; // 円/kWh
const SURCHARGE = 3.98; // 円/kWh

export default function EnHikariSimulator() {
  const [kwh, setKwh] = useState(300);
  const [discountKey, setDiscountKey] = useState("none");

  const numericKwh = Number.isFinite(kwh) && kwh >= 0 ? kwh : 0; // 整数のみ
  const discountPerKwh =
    discountKey === "aug" ? 2.0 : discountKey === "sep" ? 2.4 : 0;

  const energyCost = UNIT_PRICE * numericKwh; // 電力量料金
  const renewableCost = SURCHARGE * numericKwh; // 再エネ賦課金
  const discountAmount = discountPerKwh * numericKwh; // 値引額
  const total = Math.round(
    BASE_FEE + energyCost + renewableCost - discountAmount
  );

  const options = [
    { key: "none", label: "なし" },
    { key: "aug", label: "2025年8月検針分 ― 2円/kWh 値引" },
    { key: "sep", label: "2025年9月検針分 ― 2.4円/kWh 値引" },
  ];

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-center">
        enひかり 電気料金シミュレーター
      </h1>

      {/* カード代わりのセクション */}
      <section className="bg-white border rounded-lg p-6 sm:p-8 space-y-6 sm:space-y-8">
        {/* kWh 入力欄 */}
        <div className="space-y-1">
          <label htmlFor="kwh" className="font-medium">
            月間使用量
          </label>
          <div className="relative">
            <input
              id="kwh"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={kwh}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setKwh(Number.isNaN(val) ? 0 : val);
              }}
              onFocus={(e) => e.target.select()}
              className="w-full pr-12 sm:pr-14 text-base sm:text-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-0 rounded-md"
            />
            <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-gray-500 select-none">
              kWh
            </span>
          </div>
        </div>

        {/* 割引選択 */}
        <div className="space-y-2">
          <span className="font-medium">割引</span>
          <div role="radiogroup" className="space-y-2">
            {options.map(({ key, label }) => (
              <label key={key} className="flex items-start sm:items-center space-x-3 cursor-pointer select-none">
                <input
                  type="radio"
                  name="discount"
                  id={`discount-${key}`}
                  value={key}
                  checked={discountKey === key}
                  onChange={(e) => setDiscountKey(e.target.value)}
                  className="h-4 w-4 mt-1 sm:mt-0 text-blue-600 border-gray-400 focus:ring-blue-500 flex-shrink-0"
                />
                <span className="text-sm sm:text-base leading-snug">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 料金表示 */}
        <div className="text-lg sm:text-xl font-medium text-center">
          推定料金:{" "}
          <span className="text-2xl sm:text-3xl font-bold">
            {total.toLocaleString()} 円
          </span>
        </div>

        {/* 内訳 */}
        <div className="text-xs sm:text-sm text-gray-600 space-y-1">
          <p className="font-medium">内訳</p>
          <ul className="pl-4 list-disc space-y-0.5">
            <li>基本料金: {BASE_FEE.toLocaleString()} 円</li>
            <li>
              電力量料金: {UNIT_PRICE} 円 × {numericKwh} kWh = {Math.round(energyCost).toLocaleString()} 円
            </li>
            <li>
              再エネ賦課金: {SURCHARGE} 円 × {numericKwh} kWh = {Math.round(renewableCost).toLocaleString()} 円
            </li>
            {discountAmount > 0 && (
              <li>
                値引: ▲{discountPerKwh} 円 × {numericKwh} kWh = -{Math.round(discountAmount).toLocaleString()} 円
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* フッター注意書き */}
      <div className="text-[10px] sm:text-xs text-gray-500 space-y-1 text-center px-2 sm:px-0">
        <p>※ 本シミュレーターは非公式であり、計算結果の正確性は保証しません。</p>
        <p>※ 東京電力管内の料金単価をもとに試算しています。</p>
        <p>
          詳細は enひかり公式サイトをご確認ください：
          <a
            href="https://enhikari.jp/denki.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            https://enhikari.jp/denki.html
          </a>
        </p>
      </div>
    </div>
  );
}
