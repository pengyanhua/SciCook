---
name: seo-optimization
description: SEO 优化工作流——检查元数据、结构化数据、内部链接、图片 SEO 并生成报告
allowed-tools: Read, Glob, Grep, Edit, Bash, WebFetch
argument-hint: <可选：指定检查范围，如"meta"/"structured-data"/"links"/"images"/"all"，默认 all>
---

# SEO 优化工作流

系统性检查和优化 SciCook 网站的 SEO 表现。检查范围：`$ARGUMENTS`（默认 all）。

## 步骤 1: 元数据检查

检查所有页面的元数据完整性：

- [ ] 在 `src/layouts/` 和 `src/pages/` 中查找 `<title>`、`<meta name="description">` 的设置
- [ ] 验证每个页面模板都输出了 title 和 description
- [ ] 检查 Open Graph 标签（`og:title`、`og:description`、`og:image`、`og:url`）是否完整
- [ ] 检查 Twitter Card 标签（`twitter:card`、`twitter:title`、`twitter:description`）是否设置
- [ ] 确认 content collection 的 frontmatter `title` / `description` 字段无缺失

## 步骤 2: 结构化数据验证

检查 JSON-LD 结构化数据：

- [ ] **菜谱页面**：是否输出 `@type: Recipe` 的 JSON-LD（含 name、image、recipeIngredient、recipeInstructions、totalTime、recipeYield）
- [ ] **原理页面**：是否输出 `@type: Article` 的 JSON-LD（含 headline、datePublished、author）
- [ ] **首页**：是否输出 `@type: WebSite` 的 JSON-LD（含 name、url、potentialAction/SearchAction）
- [ ] JSON-LD 格式语法正确（可通过 `npm run build` 间接验证）

## 步骤 3: 内部链接优化

分析内部链接结构：

- [ ] 搜索所有 `.astro` / `.mdx` 文件中的 `href="/..."` 内部链接
- [ ] 验证链接目标路由确实存在对应的页面文件
- [ ] 检查是否存在指向已删除或重命名页面的死链
- [ ] 检查锚文本是否具有描述性（不应只是"点击这里"）

## 步骤 4: 图片 SEO 检查

检查所有图片的 SEO 优化：

- [ ] 搜索 `<img` 和 Astro `<Image` 组件，验证 `alt` 属性是否完整且有描述性
- [ ] 检查 `public/` 目录下图片文件名是否为语义化英文小写+连字符
- [ ] 检查是否有超大图片文件（> 500KB），建议压缩

## 步骤 5: 性能与可访问性快检

- [ ] 检查是否有 `<link rel="canonical">` 标签
- [ ] 检查 `robots.txt` 和 `sitemap.xml`（或 Astro sitemap 集成）是否配置
- [ ] 检查 `<html lang="...">` 是否设置正确（应为 `zh-CN`）
- [ ] 检查页面是否使用了合理的标题层级（h1 → h2 → h3，不跳级）

## 步骤 6: 生成 SEO 报告

以如下格式输出报告：

```markdown
# SEO 优化报告

## 发现的问题

### 高优先级
- [ ] ...

### 中优先级
- [ ] ...

### 低优先级
- [ ] ...

## 自动修复结果
✓ ...

## 手动修复建议
1. ...
```

## 自动修复

对于可以自动修复的问题，直接用 Edit 工具修复：

1. 补充缺失的 meta description（从 frontmatter description 生成）
2. 修正不完整的 Open Graph 标签
3. 为缺少 alt 的图片添加描述性 alt 文本
4. 修复明显的死链（路径拼写错误等）

修复后运行 `npm run build` 验证构建无报错。
