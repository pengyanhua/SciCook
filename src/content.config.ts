import { defineCollection, z } from "astro:content";

const principles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    field: z.enum(["physics", "chemistry", "biology"]),
    tags: z.array(z.string()),
    date: z.string(),
    relatedRecipes: z.array(z.string()).optional(),
  }),
});

const recipes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["快炒", "炖煮", "烘焙", "凉拌", "蒸制", "煎炸", "面食"]),
    difficulty: z.number().min(1).max(3),
    scienceTags: z.array(z.string()),
    date: z.string(),
    servings: z.number(),
    totalTimeSec: z.number(),
    peakTempCelsius: z.number(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        amountG: z.number(),
        unit: z.string().optional(),
        role: z.enum(["主料", "辅料", "调味"]),
        notes: z.string().optional(),
      })
    ),
    steps: z.array(
      z.object({
        action: z.string(),
        durationSec: z.number().optional(),
        tempCelsius: z.number().optional(),
        scienceNote: z.string().optional(),
      })
    ),
    relatedPrinciples: z.array(z.string()).optional(),
  }),
});

const debugging = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    symptom: z.string(),
    rootCause: z.string(),
    field: z.enum(["physics", "chemistry", "biology"]),
    date: z.string(),
  }),
});

export const collections = { principles, recipes, debugging };
