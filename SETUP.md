# 角色面板使用说明

打开 `index.html` 或 `preview/game.html` 查看当前角色版。杂志版仅为历史草稿。预览模拟 GitHub Markdown，实际效果以 GitHub 渲染为准。

## 发布

使用 `release/shuwei-goat-game.zip` 或 `release/game/`。该目录的 README.md 已是角色版。确认同名仓库状态后，将发布包内容放入公开仓库 `Shuwei-Goat/Shuwei-Goat`，包含隐藏目录 `.github/`。不要上传整个 Studio。

在 Actions 手动运行 **Refresh profile artwork**。自动更新为北京时间每天 10:23。仅保留动态用户名更新，工作流需要 contents:write 权限。主页已发布。统计、语言、贪吃蛇和访问计数已移除。

已移除连续贡献、奖杯、近期活动及全部统计展示。更新失败保留上次成功图片，服务状态记在 evidence/，不在主页添加技术脚注。

## 添加内容

`projects.json` 每项需要 `name`、`description`、`experience_url`、`video_url`；可选 `cover_url`、`product_url`、`repository_url`。只填写实际内容和完整 HTTP(S) 网址。缺少的可选入口不展示。

`skills.json` 每项需要 `name`、`description`、`repository_url`。个人网站准备好后，将 README.game.md 中“个人网站 · 筹备中”替换为实际链接。

在 Studio 目录运行：

```bash
python3 scripts/update_content.py
python3 scripts/test_profile.py
node scripts/preview.mjs
python3 scripts/package.py
```

发布包中的内容脚本修改 README.game.md 后，复制为 README.md 再提交。预览和打包脚本在 Studio 内使用，不属于远端运行依赖。预览使用本机 Codex bundled marked/Playwright，可通过 PROFILE_NODE_MODULES 指定其它环境的依赖目录。

`build.py` 会重新生成初始框架，手动编辑页面后不要直接重跑。羊 Logo 使用此前确认的透明 PNG，未重新修改。原始 Logo 未覆盖。

## 文案约束

后续页面不再增加中英文装饰口号、解释脚注或灰色小字。维护说明仅写入本文件。当前配色 #669379 → #DCD9A9。

当前仅清理 README。GitHub 自带仓库列表、贡献日历和活动区不属于 README，按用户选择保留账号设置。
