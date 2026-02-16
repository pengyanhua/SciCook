import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const recipes = await getCollection("recipes");

  // Aggregate ingredients across all recipes
  const map = new Map<
    string,
    {
      name: string;
      count: number;
      roles: Set<string>;
      categories: Set<string>;
      usages: { recipe: string; href: string; amountG: number; unit: string; role: string }[];
    }
  >();

  for (const r of recipes) {
    const href = `/recipes/${r.id.replace(/\.mdx?$/, "")}`;
    for (const ing of r.data.ingredients) {
      let entry = map.get(ing.name);
      if (!entry) {
        entry = { name: ing.name, count: 0, roles: new Set(), categories: new Set(), usages: [] };
        map.set(ing.name, entry);
      }
      entry.count++;
      entry.roles.add(ing.role);
      entry.categories.add(r.data.category);
      entry.usages.push({
        recipe: r.data.title,
        href,
        amountG: ing.amountG,
        unit: ing.unit ?? "g",
        role: ing.role,
      });
    }
  }

  const result = [...map.values()]
    .sort((a, b) => b.count - a.count)
    .map((e) => ({
      name: e.name,
      count: e.count,
      roles: [...e.roles],
      categories: [...e.categories],
      usages: e.usages,
    }));

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
};
