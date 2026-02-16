import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const [principles, recipes, debugging] = await Promise.all([
    getCollection("principles"),
    getCollection("recipes"),
    getCollection("debugging"),
  ]);

  const index = [
    ...principles.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      type: "principle" as const,
      field: e.data.field,
      tags: [...e.data.tags, ...(e.data.ingredientTags ?? [])],
      href: `/kernel/${e.id.replace(/\.mdx?$/, "")}`,
    })),
    ...recipes.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      type: "recipe" as const,
      category: e.data.category,
      tags: [...e.data.scienceTags, ...(e.data.ingredientTags ?? [])],
      href: `/recipes/${e.id.replace(/\.mdx?$/, "")}`,
    })),
    ...debugging.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      type: "debug" as const,
      field: e.data.field,
      tags: e.data.ingredientTags ?? [],
      href: `/debug/${e.id.replace(/\.mdx?$/, "")}`,
    })),
  ];

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
};
