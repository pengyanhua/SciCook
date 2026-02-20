---
description: 提交代码、推送到 GitHub、本地构建并用 wrangler 手动发布到 Cloudflare Pages
---

# 部署工作流

完整的发布流程，按顺序执行以下步骤：

## 步骤 1: 检查变更

运行 `git status` 和 `git diff`，了解所有改动。
如果没有任何变更，直接告知用户"没有需要提交的变更"，**停止流程**。

## 步骤 2: 提交代码

- 分析所有变更内容，生成 commit message
- commit message 风格：`feat:` / `fix:` / `style:` / `ci:` / `docs:` 前缀 + 中文描述
- 如果改动涉及多个方面，正文用列表补充说明
- 使用 HEREDOC 格式传递 commit message
- 末尾附加 `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
- 不要用 `git add -A`，按文件名逐个添加
- 不要提交 `.env`、`credentials` 等敏感文件
- 不要提交 `node_modules/`、`dist/`、`.astro/` 等构建产物

## 步骤 3: 推送到远程

```bash
git push origin main
```

## 步骤 4: 本地构建

运行 `npm run build`，确认无报错。如果构建失败，**停止流程**，报告错误并协助修复。

## 步骤 5: 发布到 Cloudflare Pages

使用 wrangler 手动部署：

```bash
npx wrangler pages deploy dist --project-name=scicook
```

项目配置在 `wrangler.toml`：
- `name = "scicook"`
- `pages_build_output_dir = "./dist"`

部署完成后，向用户报告 wrangler 输出的部署 URL。

## 错误处理

如果任何步骤失败：
1. 记录错误信息
2. 停止执行后续步骤
3. 向用户报告具体错误和修复建议
