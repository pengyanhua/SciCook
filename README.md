# 理科生下厨房 | SciCook

> 拒绝玄学，烹饪是一门精确的科学。

用物理、化学、生物学原理，**解构**、**量化**、**重构**每一道菜。像写代码一样做菜 (Cooking as Coding)。

**线上地址：** [scicook.com](https://scicook.com)

<p align="center">
  <img src="docs/scicook-qrcode.png" alt="扫码访问 SciCook" width="280" />
</p>

---

## 这是什么？

传统菜谱教你"怎么做 (How)"，我们解释"为什么 (Why)"。

SciCook 是一个**美食底层逻辑库**，将烹饪知识按操作系统的方式分层组织：

| 模块 | 名称 | 说明 |
|------|------|------|
| `MOD_01` | **原理层 (Kernel)** | 美拉德反应、乳化、渗透压等核心科学概念 |
| `MOD_02` | **食材筛选 (Variables)** | 按食材标签浏览所有相关原理、菜谱和调试指南 |
| `MOD_03` | **烹饪方法 (Methods)** | 快炒、炖煮、蒸制、煎炸等 8 大类方法及背后的科学 |
| `MOD_04` | **菜谱库 (Algorithms)** | 精确到克、秒、°C 的标准作业程序 (SOP) |
| `MOD_05` | **调试区 (Debugging)** | 烹饪失败的 Root Cause Analysis |
| `MOD_06` | **工具箱 (Tools)** | 单位换算器、温度热力图谱、食材数据库 |

---

## 内容概览

### 原理层 · 17 篇

| 分类 | 文章 |
|------|------|
| 基础烹饪科学 | 渗透压与脆嫩芹菜、肉类上浆的水合反应、叶绿素保卫战、奶白鱼汤乳化 |
| 调料科学 | 酱油、醋、糖、花椒、姜、蒜、葱、料酒 — 8 篇调料的化学原理 |
| 面食科学 | 面筋蛋白网络、水温对面团的影响、发酵科学 |
| 鱼类科学 | 鱼类蛋白质变性特性、13 种常见鱼选购与烹饪指南 |

### 菜谱库 · 21 道 SOP

| 烹饪方法 | 菜谱 |
|----------|------|
| 快炒 | 蒜蓉芹菜、蒜蓉西兰花、醋溜白菜、酸辣土豆丝、麻婆豆腐、姜葱鸡 |
| 炖煮 | 红烧肉、红烧鲤鱼、奶白鱼汤、水煮鱼、酸菜鱼、西湖醋鱼 |
| 蒸制 | 清蒸鲈鱼、剁椒鱼头 |
| 煎炸 | 糖醋鲤鱼、干煎带鱼、松鼠鳜鱼 |
| 面食 | 手擀面、饺子、葱油饼、凉皮、馒头 |
| 烧烤 | 烤鱼 |

### 调试区 · 3 篇

肉炒老了怎么办、鱼为什么炖碎了、鱼为什么粘锅

---

## 功能特性

- **食材筛选** — 按食材标签（芹菜、鱼、豆腐、猪肉…）跨集合筛选所有相关内容
- **烹饪方法分类** — 8 大烹饪方法页面，含温度对照图，按方法浏览菜谱
- **全站搜索** — Fuse.js 模糊搜索，`Ctrl+K` 快捷键，覆盖原理/菜谱/调试
- **结构化菜谱** — 每道菜精确到克、秒、°C，每步附科学注释
- **工具箱** — 单位换算器 (重量/体积/温度)、温度热力图谱 (SVG)、食材数据库
- **SEO 优化** — Open Graph / Twitter Card 社交预览、Recipe JSON-LD 结构化数据、canonical URL、sitemap
- **PWA 支持** — Web App Manifest、主屏图标 (192/512)、Apple Touch Icon
- **数据统计** — Google Analytics (GA4) 全站集成
- **响应式设计** — 深色主题，移动端友好

---

## 技术栈

```
框架        Astro 5 + React 19 (Islands Architecture)
样式        Tailwind CSS 4
内容        MDX + Astro Content Collections + Zod Schema
搜索        Fuse.js (构建时生成索引，客户端模糊搜索)
SEO         Open Graph · Twitter Card · JSON-LD · Sitemap
统计        Google Analytics (GA4)
部署        Cloudflare Pages
```

### 为什么选 Astro？

- **内容优先**：天生为内容型网站设计，Content Collections 完美匹配结构化菜谱
- **性能极致**：默认零 JS，仅在需要交互的组件（搜索弹窗）加载 React
- **CF 原生支持**：`@astrojs/cloudflare` 官方适配器，部署零配置

---

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 本地预览构建产物
npm run preview
```

---

## 项目结构

```
src/
├── content.config.ts           # 内容集合 Schema (principles / recipes / debugging)
├── content/
│   ├── principles/             # 原理层文章 (17 篇 MDX)
│   ├── recipes/                # 结构化菜谱 (21 篇 MDX + YAML frontmatter)
│   └── debugging/              # 调试区文章 (3 篇 MDX)
├── components/
│   ├── Header.astro            # 顶部导航 + 搜索入口
│   ├── Footer.astro            # 底部导航 + GitHub 链接
│   ├── Card.astro              # 文章卡片
│   ├── SearchModal.tsx         # React 搜索弹窗 (Fuse.js)
│   ├── UnitConverter.tsx       # 单位换算器 (重量/体积/温度)
│   ├── HeatMap.tsx             # 温度热力图谱 (React SVG)
│   └── IngredientDB.tsx        # 食材数据库 (搜索/筛选/统计)
├── layouts/
│   ├── BaseLayout.astro        # 基础布局
│   └── ArticleLayout.astro     # 文章详情布局
├── pages/
│   ├── index.astro             # 首页
│   ├── tags/                   # 食材筛选 (按标签过滤)
│   ├── methods/                # 烹饪方法分类
│   ├── recipes/                # 菜谱库路由
│   ├── kernel/                 # 原理层路由
│   ├── debug/                  # 调试区路由
│   ├── tools/                  # 工具箱 (换算器/热力图/食材库)
│   ├── search-index.json.ts    # 搜索索引 (构建时生成)
│   ├── heatmap-data.json.ts    # 热力图数据 (构建时生成)
│   └── ingredient-data.json.ts # 食材数据 (构建时生成)
└── styles/
    └── global.css              # 全局样式 + 主题变量
```

---

## 内容编写指南

### 添加一篇原理文章

在 `src/content/principles/` 下新建 `.mdx` 文件：

```yaml
---
title: "文章标题"
description: "一句话描述"
field: "physics"          # physics | chemistry | biology
tags: ["关键词1", "关键词2"]
date: "2026-02-15"
relatedRecipes: []        # 关联菜谱的文件名（不含扩展名）
ingredientTags: ["芹菜"]  # 食材标签，用于食材筛选页面
---

正文内容，支持 Markdown + JSX 组件。
```

### 添加一个结构化菜谱

在 `src/content/recipes/` 下新建 `.mdx` 文件：

```yaml
---
title: "菜名"
description: "一句话描述"
category: "快炒"            # 快炒 | 炖煮 | 烘焙 | 凉拌 | 蒸制 | 煎炸 | 面食 | 烧烤
difficulty: 1               # 1-3
scienceTags: ["渗透压"]
date: "2026-02-15"
servings: 2
totalTimeSec: 900
peakTempCelsius: 220
ingredients:
  - { name: "芹菜", amountG: 300, role: "主料" }
  - { name: "食盐", amountG: 3, unit: "g", role: "调味", notes: "腌制用" }
steps:
  - action: "切斜段，长度3cm"
    durationSec: 60
    tempCelsius: 200
    scienceNote: "斜切增大受热面积"
relatedPrinciples: []
ingredientTags: ["芹菜", "蔬菜"]
---

额外说明、调试指南等 MDX 内容。
```

### 添加一篇调试文章

在 `src/content/debugging/` 下新建 `.mdx` 文件：

```yaml
---
title: "问题标题"
description: "一句话描述"
symptom: "症状描述"
rootCause: "根本原因"
field: "chemistry"          # physics | chemistry | biology
date: "2026-02-15"
ingredientTags: ["鱼"]
---

详细分析和解决方案。
```

---

## 部署

项目使用 **Cloudflare Pages** 部署。

### GitHub 连接部署

1. 将代码推送到 GitHub
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages → 创建项目
3. 连接 GitHub 仓库
4. 配置：
   - **构建命令：** `npm run build`
   - **输出目录：** `dist`
5. 绑定自定义域名 `scicook.com`

### 手动部署

```bash
npm run build
npx wrangler pages deploy dist --project-name=scicook
```

---

## 路线图

- [x] Phase 1 — MVP：项目脚手架、首页、4 篇原理文章、2 个结构化菜谱
- [x] Phase 2 — 内容扩充：调料科学 (8 篇)、面食专题 (3+5)、鱼类专题 (2+10+2)
- [x] Phase 3 — 导航增强：食材筛选、烹饪方法分类、全站搜索
- [x] Phase 4 — 交互增强：单位换算器、温度热力图谱、食材数据库
- [ ] Phase 5 — AI 集成：LLM 菜谱重构、智能问答
- [x] Phase 6 — 增长：SEO (OG/Twitter/JSON-LD/Sitemap)、PWA、Google Analytics

---

## 许可

MIT

---

<p align="center">
  <sub>像写代码一样做菜 · Cooking as Coding</sub>
</p>
