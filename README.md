# 理科生下厨房 | SciCook

> 拒绝玄学，烹饪是一门精确的科学。

用物理、化学、生物学原理，**解构**、**量化**、**重构**每一道菜。像写代码一样做菜 (Cooking as Coding)。

**线上地址：** [scicook.com](https://scicook.com)

---

## 这是什么？

传统菜谱教你"怎么做 (How)"，我们解释"为什么 (Why)"。

SciCook 是一个**美食底层逻辑库**，将烹饪知识按操作系统的方式分层组织：

| 模块 | 名称 | 说明 |
|------|------|------|
| `MOD_01` | **原理层 (Kernel)** | 美拉德反应、乳化、渗透压等核心科学概念 |
| `MOD_02` | **参数层 (Variables)** | 食材理化数据库：烟点、含水量、纤维密度 |
| `MOD_03` | **菜谱库 (Algorithms)** | 精确到克、秒、°C 的标准作业程序 (SOP) |
| `MOD_04` | **调试区 (Debugging)** | 烹饪失败的 Root Cause Analysis |

---

## 技术栈

```
框架        Astro 5 + React 19 (Islands Architecture)
样式        Tailwind CSS 4
内容        MDX + Astro Content Collections
部署        Cloudflare Pages
```

### 为什么选 Astro？

- **内容优先**：天生为内容型网站设计，Content Collections 完美匹配结构化菜谱
- **性能极致**：默认零 JS，仅在需要交互的组件（计算器、图表）加载 React
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
│   ├── principles/             # 原理层文章 (MDX)
│   │   ├── osmotic-pressure-celery.mdx
│   │   ├── meat-velveting.mdx
│   │   ├── chlorophyll-protection.mdx
│   │   └── fish-soup-emulsion.mdx
│   ├── recipes/                # 结构化菜谱 (MDX + YAML frontmatter)
│   │   ├── garlic-celery.mdx
│   │   └── milky-fish-soup.mdx
│   └── debugging/              # 调试区文章 (MDX)
│       └── why-meat-gets-tough.mdx
├── components/
│   ├── Header.astro            # 顶部导航
│   ├── Footer.astro            # 底部
│   └── Card.astro              # 文章卡片
├── layouts/
│   ├── BaseLayout.astro        # 基础布局
│   └── ArticleLayout.astro     # 文章详情布局
├── pages/
│   ├── index.astro             # 首页
│   ├── kernel/                 # 原理层路由
│   ├── recipes/                # 菜谱库路由
│   └── debug/                  # 调试区路由
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
---

正文内容，支持 Markdown + JSX 组件。
```

### 添加一个结构化菜谱

在 `src/content/recipes/` 下新建 `.mdx` 文件：

```yaml
---
title: "菜名"
description: "一句话描述"
category: "快炒"            # 快炒 | 炖煮 | 烘焙 | 凉拌 | 蒸制 | 煎炸
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
---

额外说明、调试指南等 MDX 内容。
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
npx wrangler pages deploy dist
```

---

## 路线图

- [x] Phase 1 - MVP：项目脚手架、首页、4 篇原理文章、2 个结构化菜谱
- [ ] Phase 2 - 交互增强：单位换算器、热力图谱、食材数据库、站内搜索
- [ ] Phase 3 - AI 集成：LLM 菜谱重构、智能问答
- [ ] Phase 4 - 增长：SEO 优化、社交分享、PWA、用户互动

---

## 许可

MIT

---

<p align="center">
  <sub>像写代码一样做菜 · Cooking as Coding</sub>
</p>
