---
name: new-topic
description: 创建一个新的食材专题（原理 + 多道菜谱 + 调试 + 首页更新）
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, TodoWrite
argument-hint: <食材名称，如"鸡肉"、"豆腐">
---

# 创建新食材专题

用户指定一个食材主题（如 `$ARGUMENTS`），你需要创建完整的专题内容包。

## 工作流程

### 1. 规划阶段

先确认要创建的内容清单：
- **1 篇原理文章**：该食材的核心科学（蛋白质结构、温度曲线、关键化学反应）
- **4-6 道菜谱**：覆盖不同烹饪方法（快炒/炖煮/蒸制/煎炸/凉拌/烧烤），覆盖该食材的不同品种或部位
- **1 篇调试文章**：该食材最常见的烹饪失败，分场景 RCA 排查
- **首页更新**：在 `featuredTopics` 数组中追加新专题卡片

用 TodoWrite 创建任务列表，逐项推进。

### 2. 内容创作规范

#### 原理文章 (`src/content/principles/{slug}.mdx`)

参考 `beef-tenderness-science.mdx` 或 `shrimp-texture-science.mdx` 的结构：
- 微观结构表格（对比其他食材）
- 热变性/温度曲线表格（温度 → 变化 → 口感）
- 不同品种/部位的烹饪策略对比
- 关键技术原理（如上浆、去腥、乳化等）

#### 菜谱 (`src/content/recipes/{slug}.mdx`)

严格遵循 schema：
- `ingredients[]`：每项必须有 `name`、`amountG`（数字）、`role`（主料/辅料/调味）
- `steps[]`：每步必须有 `action`，尽量带 `scienceNote` 解释原理
- `durationSec` 和 `tempCelsius` 尽量填写
- MDX 正文必须包含 `## 科学解析` 和 `## 调试指南`（表格）

**注意**：正文中 `<` `>` 必须转义为 `&lt;` `&gt;`

#### 调试文章 (`src/content/debugging/{slug}.mdx`)

参考 `why-beef-is-tough.mdx` 或 `why-shrimp-is-rubbery.mdx`：
- `## 现象描述`：分类列举常见症状
- `## 根因分析（RCA）`：分层级（温度/时间/操作/选材），每层用表格
- `## 修复清单`：分场景的 checklist

#### 首页 (`src/pages/index.astro`)

在 `featuredTopics` 数组末尾（`];` 之前）追加：
```javascript
{
  name: "XX专题",
  emoji: "🔤",
  description: "一句话科学描述",
  count: N,  // 本次新增的文章总数
  tag: "食材标签",  // 必须与 ingredientTags 一致
  links: [
    { label: "原理文章标题", href: "/kernel/{slug}" },
    { label: "代表菜谱1", href: "/recipes/{slug}" },
    { label: "代表菜谱2", href: "/recipes/{slug}" },
  ],
},
```

### 3. 质量要求

- 所有文件的 `ingredientTags` 使用统一的标签值
- 原理文章的 `relatedRecipes` 引用所有新建菜谱的 slug
- 菜谱的 `relatedPrinciples` 引用原理文章的 slug
- scienceNote 必须有实质性科学解释（温度、化学反应、物理原理），不能是空话
- 每道菜的 `category` 必须是 schema 允许的 8 个值之一

### 4. 验证

所有文件创建完成后运行 `npm run build` 确认无报错。
