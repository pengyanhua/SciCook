import { useState } from "react";

type Category = "weight" | "volume" | "temperature";

interface Unit {
  key: string;
  label: string;
  toBase: (v: number) => number; // convert to base unit (g / ml / °C)
  fromBase: (v: number) => number;
}

const units: Record<Category, { label: string; units: Unit[] }> = {
  weight: {
    label: "重量",
    units: [
      { key: "g", label: "克 (g)", toBase: (v) => v, fromBase: (v) => v },
      { key: "kg", label: "千克 (kg)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { key: "jin", label: "斤", toBase: (v) => v * 500, fromBase: (v) => v / 500 },
      { key: "liang", label: "两", toBase: (v) => v * 50, fromBase: (v) => v / 50 },
      { key: "oz", label: "盎司 (oz)", toBase: (v) => v * 28.3495, fromBase: (v) => v / 28.3495 },
      { key: "lb", label: "磅 (lb)", toBase: (v) => v * 453.592, fromBase: (v) => v / 453.592 },
    ],
  },
  volume: {
    label: "体积",
    units: [
      { key: "ml", label: "毫升 (ml)", toBase: (v) => v, fromBase: (v) => v },
      { key: "l", label: "升 (L)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { key: "tbsp", label: "汤匙 (15ml)", toBase: (v) => v * 15, fromBase: (v) => v / 15 },
      { key: "tsp", label: "茶匙 (5ml)", toBase: (v) => v * 5, fromBase: (v) => v / 5 },
      { key: "cup", label: "杯 (240ml)", toBase: (v) => v * 240, fromBase: (v) => v / 240 },
      { key: "floz", label: "液体盎司 (fl oz)", toBase: (v) => v * 29.5735, fromBase: (v) => v / 29.5735 },
    ],
  },
  temperature: {
    label: "温度",
    units: [
      { key: "c", label: "摄氏度 (°C)", toBase: (v) => v, fromBase: (v) => v },
      { key: "f", label: "华氏度 (°F)", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    ],
  },
};

const categories: Category[] = ["weight", "volume", "temperature"];

function fmt(n: number): string {
  if (Math.abs(n) < 0.01) return "0";
  if (Math.abs(n) >= 1000) return n.toFixed(1);
  if (Math.abs(n) >= 1) return n.toFixed(2);
  return n.toFixed(4);
}

export default function UnitConverter() {
  const [cat, setCat] = useState<Category>("weight");
  const [value, setValue] = useState("100");
  const [fromUnit, setFromUnit] = useState("g");

  const catData = units[cat];
  const numVal = parseFloat(value) || 0;
  const from = catData.units.find((u) => u.key === fromUnit) ?? catData.units[0];
  const baseVal = from.toBase(numVal);

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCat(c);
              setFromUnit(units[c].units[0].key);
              setValue("100");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              cat === c
                ? "bg-brand-500/15 text-brand-400 border border-brand-500/30"
                : "text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-gray-200"
            }`}
          >
            {units[c].label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1.5 font-mono">输入数值</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-lg font-mono text-gray-100 outline-none focus:border-brand-500/50 transition-colors"
          />
        </div>
        <div className="w-48">
          <label className="block text-xs text-gray-500 mb-1.5 font-mono">单位</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-3 text-sm text-gray-100 outline-none focus:border-brand-500/50 transition-colors"
          >
            {catData.units.map((u) => (
              <option key={u.key} value={u.key}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-3 sm:grid-cols-2">
        {catData.units
          .filter((u) => u.key !== fromUnit)
          .map((u) => {
            const result = u.fromBase(baseVal);
            return (
              <div
                key={u.key}
                className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/50 px-5 py-4"
              >
                <span className="text-sm text-gray-400">{u.label}</span>
                <span className="text-lg font-mono text-gray-100">{fmt(result)}</span>
              </div>
            );
          })}
      </div>

      {/* Quick reference */}
      {cat === "temperature" && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
            <span className="font-mono text-brand-500">#</span> 烹饪温度速查
          </h4>
          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            {[
              ["水沸点", "100°C / 212°F"],
              ["油温五成热", "150°C / 302°F"],
              ["油温七成热", "200°C / 392°F"],
              ["烤箱中温", "180°C / 356°F"],
              ["美拉德反应起始", "140°C / 284°F"],
              ["焦糖化温度", "170°C / 338°F"],
            ].map(([name, temp]) => (
              <div key={name} className="flex justify-between text-gray-500">
                <span>{name}</span>
                <span className="font-mono text-amber-400">{temp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {cat === "weight" && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
            <span className="font-mono text-brand-500">#</span> 常见食材参考重量
          </h4>
          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            {[
              ["1 个鸡蛋 (带壳)", "≈ 60g"],
              ["1 瓣蒜", "≈ 5g"],
              ["1 片姜", "≈ 3g"],
              ["1 根葱", "≈ 15g"],
              ["1 块豆腐", "≈ 300g"],
              ["1 碗米饭", "≈ 200g"],
            ].map(([name, weight]) => (
              <div key={name} className="flex justify-between text-gray-500">
                <span>{name}</span>
                <span className="font-mono text-brand-400">{weight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {cat === "volume" && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
            <span className="font-mono text-brand-500">#</span> 常见调料参考体积
          </h4>
          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            {[
              ["1 汤匙酱油", "≈ 15ml"],
              ["1 茶匙盐", "≈ 6g"],
              ["1 汤匙料酒", "≈ 15ml"],
              ["1 汤匙醋", "≈ 15ml"],
              ["1 汤匙油", "≈ 14g"],
              ["1 杯水", "≈ 240ml"],
            ].map(([name, vol]) => (
              <div key={name} className="flex justify-between text-gray-500">
                <span>{name}</span>
                <span className="font-mono text-blue-400">{vol}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
