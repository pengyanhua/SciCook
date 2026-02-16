import { useState, useEffect, useRef, useCallback } from "react";
import Fuse from "fuse.js";

interface SearchItem {
  title: string;
  description: string;
  type: "principle" | "recipe" | "debug";
  tags: string[];
  href: string;
  field?: string;
  category?: string;
}

const typeLabels: Record<string, { label: string; color: string }> = {
  principle: { label: "原理", color: "text-blue-400 bg-blue-500/15 border-blue-500/30" },
  recipe: { label: "菜谱", color: "text-brand-400 bg-brand-500/15 border-brand-500/30" },
  debug: { label: "调试", color: "text-red-400 bg-red-500/15 border-red-500/30" },
};

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const fuseRef = useRef<Fuse<SearchItem> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load search index
  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data: SearchItem[]) => {
        setItems(data);
        fuseRef.current = new Fuse(data, {
          keys: [
            { name: "title", weight: 3 },
            { name: "description", weight: 1 },
            { name: "tags", weight: 2 },
            { name: "category", weight: 1 },
          ],
          threshold: 0.4,
          includeScore: true,
        });
      });
  }, []);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setActiveIdx(0);
    }
  }, [open]);

  // Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIdx(0);
      return;
    }
    if (fuseRef.current) {
      const r = fuseRef.current.search(query, { limit: 12 });
      setResults(r.map((x) => x.item));
      setActiveIdx(0);
    }
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      window.location.href = href;
    },
    [],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIdx]) {
      navigate(results[activeIdx].href);
    }
  };

  // Expose open function for external trigger
  useEffect(() => {
    (window as any).__openSearch = () => setOpen(true);
    return () => delete (window as any).__openSearch;
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-gray-800 px-4 py-3">
          <svg
            className="h-5 w-5 shrink-0 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="搜索菜谱、原理、食材..."
            className="w-full bg-transparent text-sm text-gray-100 placeholder-gray-500 outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-gray-700 bg-gray-800 px-1.5 py-0.5 font-mono text-[10px] text-gray-500 sm:inline">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
          {query && results.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              没有找到相关内容
            </div>
          )}
          {!query && (
            <div className="py-8 text-center text-sm text-gray-500">
              输入关键词开始搜索
            </div>
          )}
          {results.map((item, idx) => {
            const t = typeLabels[item.type];
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  idx === activeIdx
                    ? "bg-brand-500/10 text-gray-100"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                }}
              >
                <span
                  className={`mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-mono ${t.color}`}
                >
                  {t.label}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">
                    {item.title}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500 truncate">
                    {item.description}
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="border-t border-gray-800 px-4 py-2 text-[10px] text-gray-600 flex items-center gap-3">
          <span>
            <kbd className="rounded border border-gray-700 bg-gray-800 px-1 py-0.5 font-mono">↑↓</kbd> 导航
          </span>
          <span>
            <kbd className="rounded border border-gray-700 bg-gray-800 px-1 py-0.5 font-mono">↵</kbd> 跳转
          </span>
          <span>
            <kbd className="rounded border border-gray-700 bg-gray-800 px-1 py-0.5 font-mono">ESC</kbd> 关闭
          </span>
        </div>
      </div>
    </div>
  );
}
