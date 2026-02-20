---
name: new-recipe
description: 创建单道菜谱（含完整 SOP、科学注解和调试指南）
allowed-tools: Read, Write, Glob, Grep, Bash
argument-hint: <菜名，如"宫保鸡丁"、"麻婆豆腐">
---

# 创建新菜谱

为 `$ARGUMENTS` 创建一道完整的菜谱文件。

## 步骤

### 1. 确定元数据

- **category**：从 `快炒|炖煮|烘焙|凉拌|蒸制|煎炸|面食|烧烤` 中选择
- **difficulty**：1（简单）/ 2（中等）/ 3（困难）
- **ingredientTags**：查看已有标签（`grep -r "ingredientTags" src/content/`），尽量复用
- **slug**：英文小写连字符命名

### 2. 创建文件

文件路径：`src/content/recipes/{slug}.mdx`

严格遵循 frontmatter schema（参考 CLAUDE.md）：
- `ingredients[]`：精确到克（amountG 为数字），每项有 role
- `steps[]`：每步有 action + scienceNote
- `scienceTags`：提取本菜涉及的科学概念
- `totalTimeSec`：总时长（秒），包括准备和烹饪
- `peakTempCelsius`：最高温度

### 3. 正文内容

frontmatter `---` 之后必须包含：

```markdown
## 科学解析

### 核心原理标题
解释这道菜最关键的 1-2 个科学原理...

---

## 调试指南

| 问题 | 原因 | 修复 |
|------|------|------|
| ... | ... | ... |
```

### 4. 关联

- 检查是否有对应的原理文章，如有则在 `relatedPrinciples` 中引用
- 正文中的 `<` `>` 必须转义为 `&lt;` `&gt;`

### 5. 验证

运行 `npm run build` 确认无报错。
