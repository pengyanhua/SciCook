---
name: review-content
description: 审查内容质量——检查 schema 合规性、科学准确性、交叉引用完整性
allowed-tools: Read, Glob, Grep
argument-hint: <文件路径或食材标签，如"src/content/recipes/white-boiled-shrimp.mdx"或"虾">
---

# 审查内容质量

审查 `$ARGUMENTS` 指定的内容文件或某个食材标签下的所有文件。

## 检查清单

### 1. Schema 合规性

- [ ] frontmatter 所有必填字段都存在且类型正确
- [ ] `category` 是 8 个允许值之一
- [ ] `difficulty` 是 1/2/3
- [ ] `ingredients[].role` 是 主料/辅料/调味
- [ ] `field` 是 physics/chemistry/biology
- [ ] `date` 格式为 YYYY-MM-DD
- [ ] `amountG` 是数字（不是字符串）

### 2. 内容结构

- [ ] 菜谱正文包含 `## 科学解析` 和 `## 调试指南`
- [ ] 调试文章包含 `## 现象描述`、`## 根因分析（RCA）`、`## 修复清单`
- [ ] 正文无未转义的 `<` `>`（应为 `&lt;` `&gt;`）

### 3. 科学准确性

- [ ] scienceNote 包含具体的温度/时间/化学物质名称，不是空泛描述
- [ ] 温度数据合理（如美拉德 >140°C、胶原蛋白水解 75-85°C）
- [ ] 不同步骤的 durationSec 加总 ≈ totalTimeSec

### 4. 交叉引用完整性

- [ ] 同一专题的所有文件 `ingredientTags` 值一致
- [ ] recipe 的 `relatedPrinciples` 引用的 slug 确实存在于 `src/content/principles/`
- [ ] principle 的 `relatedRecipes` 引用的 slug 确实存在于 `src/content/recipes/`
- [ ] 首页 `featuredTopics` 中的 href 指向实际存在的页面

### 5. 输出格式

以表格汇总所有发现的问题：

| 文件 | 问题类型 | 具体问题 | 建议修复 |
|------|---------|---------|---------|
| ... | schema/内容/科学/引用 | ... | ... |

如果一切正常，输出"✓ 所有检查通过"。
