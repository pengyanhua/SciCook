import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const recipes = await getCollection("recipes");

  const data = recipes.map((r) => ({
    title: r.data.title,
    category: r.data.category,
    href: `/recipes/${r.id.replace(/\.mdx?$/, "")}`,
    peakTemp: r.data.peakTempCelsius,
    totalTimeSec: r.data.totalTimeSec,
    steps: r.data.steps
      .filter((s) => s.tempCelsius != null)
      .map((s) => ({
        action: s.action.slice(0, 20),
        temp: s.tempCelsius!,
        duration: s.durationSec ?? 0,
      })),
  }));

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
