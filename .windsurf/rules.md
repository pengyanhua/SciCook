---
name: scicook-rules
description: SciCook 项目的开发规则和最佳实践
---

# SciCook 项目开发规则

## 内容创作规范

### 1. 菜谱编写规则
- 所有食材重量必须精确到克（`amountG` 为数字类型）
- 每个烹饪步骤必须包含 `scienceNote` 解释科学原理
- 温度数据必须合理：美拉德反应 >140°C，胶原蛋白水解 75-85°C
- `totalTimeSec` 必须等于各步骤 `durationSec` 之和

### 2. 原理文章规则
- 必须包含微观结构分析表格
- 温度曲线必须标注关键变化点
- 化学反应方程式必须准确
- 引用文献必须标注来源

### 3. 文件命名规范
- 菜谱文件：`kebab-case.mdx`（如 `mapo-tofu.mdx`）
- 原理文件：`kebab-case.mdx`（如 `maillard-reaction.mdx`）
- 调试文件：`why-{problem}.mdx`（如 `why-beef-is-tough.mdx`）

## 代码规范

### 1. Astro 组件
- 使用 PascalCase 命名组件文件
- Props 接口必须定义类型
- 样式使用 Tailwind CSS 类名

### 2. TypeScript
- 严格模式，禁止使用 `any`
- 导入路径使用 `@/` 别名
- 接口定义以 `I` 开头

## Git 工作流

### 1. 提交信息格式
```
<type>(<scope>): <description>

[optional body]

Co-Authored-By: AI Assistant <noreply@anthropic.com>
```

Types:
- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 格式
- `ci`: CI/CD

### 2. 分支策略
- `main`: 生产环境
- `develop`: 开发环境
- `feature/*`: 功能分支

## SEO 优化规则

### 1. 元数据
- 每页必须有 `title` 和 `description`
- 图片必须包含 `alt` 属性
- Open Graph 标签必须完整

### 2. 结构化数据
- 菜谱必须包含 Recipe JSON-LD
- 文章必须包含 Article JSON-LD
- 面包屑导航必须包含 BreadcrumbList JSON-LD

## 质量检查清单

### 发布前检查
- [ ] `npm run build` 无错误
- [ ] 所有链接可访问
- [ ] 图片加载正常
- [ ] SEO 标签完整
- [ ] 移动端适配正常

### 内容审查
- [ ] 科学原理准确
- [ ] 数据合理
- [ ] 交叉引用正确
- [ ] 无错别字
- [ ] 格式统一

## 安全规则

### 1. 敏感信息
- 禁止提交 API 密钥
- 禁止提交个人邮箱
- 禁止提交内部配置

### 2. 依赖管理
- 定期更新依赖
- 检查安全漏洞
- 使用固定版本号
