import { useState, useEffect, useMemo } from "react";

interface Usage {
  recipe: string;
  href: string;
  amountG: number;
  unit: string;
  role: string;
}

interface Ingredient {
  name: string;
  count: number;
  roles: string[];
  categories: string[];
  usages: Usage[];
}

const roleColors: Record<string, string> = {
  主料: "text-brand-400 bg-brand-500/15 border-brand-500/30",
  辅料: "text-blue-400 bg-blue-500/15 border-blue-500/30",
  调味: "text-amber-400 bg-amber-500/15 border-amber-500/30",
};

export default function IngredientDB() {
  const [data, setData] = useState<Ingredient[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/ingredient-data.json")
      .then((r) => r.json())
      .then((d: Ingredient[]) => setData(d));
  }, []);

  const roles = ["all", "主料", "辅料", "调味"];

  const filtered = useMemo(() => {
    return data.filter((ing) => {
      if (query && !ing.name.includes(query)) return false;
      if (roleFilter !== "all" && !ing.roles.includes(roleFilter)) return false;
      return true;
    });
  }, [data, query, roleFilter]);

  const stats = useMemo(() => {
    return {
      total: data.length,
      主料: data.filter((i) => i.roles.includes("主料")).length,
      辅料: data.filter((i) => i.roles.includes("辅料")).length,
      调味: data.filter((i) => i.roles.includes("调味")).length,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "食材总数", value: stats.total, color: "text-gray-100" },
          { label: "主料", value: stats.主料, color: "text-brand-400" },
          { label: "辅料", value: stats.辅料, color: "text-blue-400" },
          { label: "调味料", value: stats.调味, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
            <div className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索食材名称..."
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-brand-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                roleFilter === r
                  ? "bg-brand-500/15 text-brand-400 border border-brand-500/30"
                  : "text-gray-400 border border-gray-800 hover:border-gray-700"
              }`}
            >
              {r === "all" ? "全部" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-500">
        显示 <span className="font-mono text-brand-400">{filtered.length}</span> 种食材
      </div>

      {/* Ingredient list */}
      <div className="space-y-2">
        {filtered.map((ing) => (
          <div key={ing.name} className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === ing.name ? null : ing.name)}
              className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-900/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-100">{ing.name}</span>
                <div className="flex gap-1.5">
                  {ing.roles.map((r) => (
                    <span
                      key={r}
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-mono ${roleColors[r] ?? ""}`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-gray-500">
                  出现 <span className="text-brand-400">{ing.count}</span> 次
                </span>
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform ${expanded === ing.name ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expanded === ing.name && (
              <div className="border-t border-gray-800 px-5 py-4">
                <div className="text-xs text-gray-500 mb-3">
                  出现在 {ing.categories.join("、")} 类菜谱中
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b border-gray-800">
                      <th className="text-left py-2 font-mono font-normal">菜谱</th>
                      <th className="text-right py-2 font-mono font-normal">用量</th>
                      <th className="text-right py-2 font-mono font-normal">角色</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ing.usages.map((u, i) => (
                      <tr key={i} className="border-b border-gray-800/50 last:border-0">
                        <td className="py-2">
                          <a href={u.href} className="text-gray-300 hover:text-brand-400 transition-colors">
                            {u.recipe}
                          </a>
                        </td>
                        <td className="py-2 text-right font-mono text-gray-400">
                          {u.amountG}{u.unit}
                        </td>
                        <td className="py-2 text-right">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono ${roleColors[u.role] ?? ""}`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
