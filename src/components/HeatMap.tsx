import { useState, useEffect } from "react";

interface StepTemp {
  action: string;
  temp: number;
  duration: number;
}

interface RecipeHeat {
  title: string;
  category: string;
  href: string;
  peakTemp: number;
  totalTimeSec: number;
  steps: StepTemp[];
}

const categoryColors: Record<string, string> = {
  快炒: "#ef4444",
  炖煮: "#f97316",
  蒸制: "#3b82f6",
  煎炸: "#eab308",
  凉拌: "#06b6d4",
  烧烤: "#dc2626",
  面食: "#a855f7",
  烘焙: "#f59e0b",
};

const tempZones = [
  { min: 0, max: 50, label: "冷处理", color: "rgba(59,130,246,0.15)" },
  { min: 50, max: 100, label: "水煮/蒸", color: "rgba(34,197,94,0.15)" },
  { min: 100, max: 160, label: "低温油炸", color: "rgba(234,179,8,0.15)" },
  { min: 160, max: 220, label: "中高温", color: "rgba(249,115,22,0.15)" },
  { min: 220, max: 300, label: "极高温", color: "rgba(239,68,68,0.15)" },
];

export default function HeatMap() {
  const [data, setData] = useState<RecipeHeat[]>([]);
  const [selected, setSelected] = useState<RecipeHeat | null>(null);
  const [view, setView] = useState<"overview" | "timeline">("overview");

  useEffect(() => {
    fetch("/heatmap-data.json")
      .then((r) => r.json())
      .then((d: RecipeHeat[]) => setData(d));
  }, []);

  const maxTemp = 300;
  const chartW = 800;
  const chartH = 400;
  const padL = 55;
  const padR = 20;
  const padT = 20;
  const padB = 30;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const tempToY = (t: number) => padT + innerH - (t / maxTemp) * innerH;

  // Group by category for overview
  const categories = [...new Set(data.map((r) => r.category))];

  return (
    <div className="space-y-6">
      {/* View tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => { setView("overview"); setSelected(null); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            view === "overview"
              ? "bg-brand-500/15 text-brand-400 border border-brand-500/30"
              : "text-gray-400 border border-gray-800 hover:border-gray-700"
          }`}
        >
          温度总览
        </button>
        <button
          onClick={() => setView("timeline")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            view === "timeline"
              ? "bg-brand-500/15 text-brand-400 border border-brand-500/30"
              : "text-gray-400 border border-gray-800 hover:border-gray-700"
          }`}
        >
          步骤温度线
        </button>
      </div>

      {view === "overview" && (
        <>
          {/* Peak temperature scatter */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 overflow-x-auto">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">
              <span className="font-mono text-brand-500">#</span> 菜谱峰值温度分布
            </h3>
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full min-w-[600px]" style={{ maxHeight: 400 }}>
              {/* Temperature zone backgrounds */}
              {tempZones.map((z) => (
                <rect
                  key={z.label}
                  x={padL}
                  y={tempToY(z.max)}
                  width={innerW}
                  height={tempToY(z.min) - tempToY(z.max)}
                  fill={z.color}
                />
              ))}

              {/* Y-axis labels */}
              {[0, 50, 100, 150, 200, 250, 300].map((t) => (
                <g key={t}>
                  <line x1={padL} y1={tempToY(t)} x2={padL + innerW} y2={tempToY(t)} stroke="#1f2937" strokeWidth={1} />
                  <text x={padL - 8} y={tempToY(t) + 4} textAnchor="end" fill="#6b7280" fontSize={11} fontFamily="monospace">
                    {t}°C
                  </text>
                </g>
              ))}

              {/* Scatter dots by category */}
              {categories.map((cat, ci) => {
                const catRecipes = data.filter((r) => r.category === cat);
                const xBase = padL + (ci / categories.length) * innerW + innerW / categories.length / 2;
                return catRecipes.map((r, ri) => {
                  const jitter = (ri - catRecipes.length / 2) * 18;
                  const cx = xBase + jitter;
                  const cy = tempToY(r.peakTemp);
                  return (
                    <g key={r.title}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={8}
                        fill={categoryColors[cat] ?? "#14b8a6"}
                        opacity={0.7}
                        className="cursor-pointer hover:opacity-100 transition-opacity"
                        onClick={() => { setSelected(r); setView("timeline"); }}
                      />
                      <title>{`${r.title} (${r.peakTemp}°C)`}</title>
                    </g>
                  );
                });
              })}

              {/* Category labels */}
              {categories.map((cat, ci) => {
                const xBase = padL + (ci / categories.length) * innerW + innerW / categories.length / 2;
                return (
                  <text key={cat} x={xBase} y={chartH - 5} textAnchor="middle" fill="#9ca3af" fontSize={12}>
                    {cat}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Category temperature ranges */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">
              <span className="font-mono text-brand-500">#</span> 烹饪方法 × 温度区间
            </h3>
            <div className="space-y-3">
              {categories.map((cat) => {
                const catRecipes = data.filter((r) => r.category === cat);
                const temps = catRecipes.flatMap((r) => [r.peakTemp, ...r.steps.map((s) => s.temp)]);
                const minT = Math.min(...temps);
                const maxT = Math.max(...temps);
                const leftPct = (minT / maxTemp) * 100;
                const widthPct = ((maxT - minT) / maxTemp) * 100;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="w-12 text-sm text-gray-400 shrink-0">{cat}</span>
                    <div className="flex-1 h-6 rounded-full bg-gray-800 relative overflow-hidden">
                      <div
                        className="absolute h-full rounded-full opacity-70"
                        style={{
                          left: `${leftPct}%`,
                          width: `${Math.max(widthPct, 2)}%`,
                          background: categoryColors[cat] ?? "#14b8a6",
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-500 shrink-0 w-28 text-right">
                      {minT}–{maxT}°C
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Scale */}
            <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-600">
              <span>0°C</span>
              <span>100°C</span>
              <span>200°C</span>
              <span>300°C</span>
            </div>
          </div>
        </>
      )}

      {view === "timeline" && (
        <div className="space-y-4">
          {/* Recipe selector */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-mono">选择菜谱</label>
            <select
              value={selected?.title ?? ""}
              onChange={(e) => setSelected(data.find((r) => r.title === e.target.value) ?? null)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-gray-100 outline-none focus:border-brand-500/50"
            >
              <option value="">请选择一道菜谱...</option>
              {data.map((r) => (
                <option key={r.title} value={r.title}>
                  {r.title} ({r.category}) — 峰值 {r.peakTemp}°C
                </option>
              ))}
            </select>
          </div>

          {selected && selected.steps.length > 0 && (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300">
                  <span className="font-mono text-brand-500">#</span> {selected.title} — 步骤温度变化
                </h3>
                <a href={selected.href} className="text-xs text-brand-400 hover:underline">
                  查看菜谱 →
                </a>
              </div>
              <svg viewBox={`0 0 ${chartW} 300`} className="w-full min-w-[500px]" style={{ maxHeight: 300 }}>
                {/* Y axis */}
                {[0, 50, 100, 150, 200, 250].map((t) => {
                  const y = 20 + (230 - (t / 260) * 230);
                  return (
                    <g key={t}>
                      <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="#1f2937" strokeWidth={1} />
                      <text x={padL - 8} y={y + 4} textAnchor="end" fill="#6b7280" fontSize={10} fontFamily="monospace">
                        {t}°C
                      </text>
                    </g>
                  );
                })}

                {/* Line + dots */}
                {selected.steps.map((s, i) => {
                  const x = padL + (i / (selected.steps.length - 1 || 1)) * (chartW - padL - padR);
                  const y = 20 + (230 - (s.temp / 260) * 230);
                  const nextStep = selected.steps[i + 1];
                  const nx = nextStep ? padL + ((i + 1) / (selected.steps.length - 1 || 1)) * (chartW - padL - padR) : 0;
                  const ny = nextStep ? 20 + (230 - (nextStep.temp / 260) * 230) : 0;
                  return (
                    <g key={i}>
                      {nextStep && (
                        <line x1={x} y1={y} x2={nx} y2={ny} stroke="#14b8a6" strokeWidth={2} opacity={0.6} />
                      )}
                      <circle cx={x} cy={y} r={6} fill="#14b8a6" />
                      <text x={x} y={y - 12} textAnchor="middle" fill="#f59e0b" fontSize={11} fontFamily="monospace">
                        {s.temp}°C
                      </text>
                      <text x={x} y={280} textAnchor="middle" fill="#6b7280" fontSize={9}>
                        {s.action}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {selected && selected.steps.length === 0 && (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center text-gray-500 text-sm">
              该菜谱步骤中没有记录温度数据
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: categoryColors[cat] ?? "#14b8a6" }}
            />
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}
