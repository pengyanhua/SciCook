# SciCook — 理科生下厨房

## 项目定位

用物理、化学、生物学原理解构烹饪的知识库。每道菜都有精确到克/秒/°C 的 SOP，每个步骤都有 scienceNote 解释底层原理。

## 技术栈

- **框架**：Astro 5 + MDX + React 19 (Islands)
- **样式**：Tailwind CSS 4，暗色主题，品牌色 `#14b8a6`（teal）
- **部署**：GitHub Actions → Cloudflare Pages
- **搜索**：Fuse.js 客户端模糊搜索（build 时生成 search-index.json）

## 内容架构

三个 Astro Content Collection，schema 定义在 `src/content.config.ts`：

### principles（原理层）→ `/kernel/{slug}`

```yaml
title: string
description: string
field: "physics" | "chemistry" | "biology"
tags: string[]
date: "YYYY-MM-DD"
relatedRecipes?: string[]      # slug 引用
ingredientTags?: string[]      # 食材标签，用于 /tags/ 聚合
```

文件：`src/content/principles/{slug}.mdx`

### recipes（菜谱库）→ `/recipes/{slug}`

```yaml
title: string
description: string
category: "快炒" | "炖煮" | "烘焙" | "凉拌" | "蒸制" | "煎炸" | "面食" | "烧烤"
difficulty: 1 | 2 | 3
scienceTags: string[]
date: "YYYY-MM-DD"
servings: number
totalTimeSec: number           # 秒
peakTempCelsius: number
ingredients:
  - { name, amountG, unit?, role: "主料"|"辅料"|"调味", notes? }
steps:
  - { action, durationSec?, tempCelsius?, scienceNote? }
relatedPrinciples?: string[]
ingredientTags?: string[]
```

文件：`src/content/recipes/{slug}.mdx`

**MDX 正文必须包含**：`## 科学解析` + `## 调试指南`（表格形式：问题/原因/修复）

### debugging（调试区）→ `/debug/{slug}`

```yaml
title: string
description: string
symptom: string
rootCause: string
field: "physics" | "chemistry" | "biology"
date: "YYYY-MM-DD"
ingredientTags?: string[]
```

文件：`src/content/debugging/{slug}.mdx`

**MDX 正文结构**：`## 现象描述` → `## 根因分析（RCA）`（分层级排查）→ `## 修复清单`（checklist 格式）

## 首页配置

`src/pages/index.astro` 中有两个手动维护的数组：

- `principles[]` — 底层原理精选（4 篇）
- `featuredTopics[]` — 精选主题卡片，结构：`{ name, emoji, description, count, tag, links: [{ label, href }] }`

新增专题时需要在 `featuredTopics` 数组末尾追加条目。

## 关键约定

- **MDX 转义**：正文中的 `<` `>` 必须写为 `&lt;` `&gt;`（否则 Astro 构建报错）
- **slug 命名**：英文小写 + 连字符，如 `braised-beef-brisket`
- **日期**：所有 date 字段使用 `YYYY-MM-DD` 格式
- **ingredientTags**：同一专题的所有文件必须使用统一的食材标签值（如 `["虾"]`），确保 `/tags/{tag}` 页面能正确聚合
- **交叉引用**：recipe 的 `relatedPrinciples` 和 principle 的 `relatedRecipes` 使用 slug 互相引用
- **构建验证**：每次新增/修改内容后运行 `npm run build` 确认无报错
- **提交风格**：`feat:` / `fix:` / `style:` / `ci:` 前缀 + 中文描述

## 目录结构速查

```
src/
├── content/
│   ├── principles/     # 原理文章 (.mdx)
│   ├── recipes/        # 菜谱 SOP (.mdx)
│   └── debugging/      # 调试指南 (.mdx)
├── content.config.ts   # Zod schema 定义
├── pages/
│   ├── index.astro     # 首页（精选主题在此配置）
│   ├── kernel/         # 原理页路由
│   ├── recipes/        # 菜谱页路由
│   ├── debug/          # 调试页路由
│   ├── tags/           # 食材标签聚合页
│   └── methods/        # 烹饪方法聚合页
├── components/         # Astro/React 组件
└── layouts/            # 页面布局
```
