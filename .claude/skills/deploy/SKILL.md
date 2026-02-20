---
name: deploy
description: 提交代码、推送到 GitHub、触发自动构建部署到 Cloudflare Pages，并跟踪部署状态
allowed-tools: Bash, Glob, Grep, Read
---

# 提交 → 推送 → 部署

完整的发布流程，按顺序执行以下步骤：

## 1. 本地构建验证

先运行 `npm run build`，确认无报错。如果构建失败，**停止流程**，报告错误并协助修复。

## 2. 检查变更

运行 `git status`（不带 -uall）和 `git diff`，了解所有改动。

## 3. 提交

- 分析所有变更内容，生成 commit message
- commit message 风格：`feat:` / `fix:` / `style:` / `ci:` / `docs:` 前缀 + 中文描述
- 如果改动涉及多个方面，正文用列表补充说明
- 使用 HEREDOC 格式传递 commit message
- 末尾附加 `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
- 不要用 `git add -A`，按文件名逐个添加

## 4. 推送

`git push origin main`

## 5. 跟踪部署状态

推送后，GitHub Actions 会自动触发部署（`.github/workflows/deploy.yml`）。

执行 `gh run list --limit 1` 查看最新 workflow run 状态，向用户报告：
- run ID 和状态（queued / in_progress / completed）
- 如果已完成，报告成功或失败
- 提供 run URL 方便用户查看详情

## 注意事项

- 不要提交 `.env`、`credentials` 等敏感文件
- 不要提交 `node_modules/`、`dist/`、`.astro/` 等构建产物
- 如果没有任何变更，不要创建空提交，直接告知用户"没有需要提交的变更"
