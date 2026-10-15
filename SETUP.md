# 角色面板使用说明

打开 `index.html` 或 `preview/game.html` 查看当前角色版。杂志版仅为历史草稿。预览模拟 GitHub Markdown，实际效果以 GitHub 渲染为准。

## 发布

使用 `release/shuwei-goat-game.zip` 或 `release/game/`。该目录的 README.md 已是角色版。确认同名仓库状态后，将发布包内容放入公开仓库 `Shuwei-Goat/Shuwei-Goat`，包含隐藏目录 `.github/`。不要上传整个 Studio。

在 Actions 手动运行 **Refresh profile artwork**。自动更新为北京时间每天 10:23，包括动态用户名和本次新加的 Summary Cards、Capsule Render。工作流需要 contents:write 权限。旧版统计、贪吃蛇和访问计数没有恢复。

连续贡献、奖杯、metrics 模块保持移除。更新失败保留上次成功图片，服务状态记在 evidence/，不在主页添加技术脚注。

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

GitHub 自带仓库列表、贡献日历和活动区不属于 README。账号已按用户后续要求开启活动隐藏，README 继续公开。

## 新增效果区维护（2026-10-15）

当前线上账号已经按用户后续要求开启活动隐藏。README 仍公开；此效果展区不会改动账号设置。

现有主页后追加了 Summary Cards 五件套、Capsule Render 三种封面和 React Bits 三个品牌演示。静态 SVG 的官方来源均在 `sources.json`，不需要新增 Secrets。每日更新由现有工作流承担；SVG 的动画在浏览器加载时播放，GitHub 图片缓存可能延迟更新。

React Bits 源码位于 `effects/`，构建文件在 `docs/`，GitHub Pages 使用 main 分支的 /docs。演示地址为 https://shuwei-goat.github.io/Shuwei-Goat/ 。README 不能运行 JavaScript，使用录制的 GIF；实际交互以 Pages 页面为准。

重新构建：

```bash
cd effects
npm ci --ignore-scripts
npm run build
```

品牌素材已提交在 `effects/public/media/`。若修改品牌素材，可在仓库根目录运行 `node effects/scripts/artwork.mjs`（沿用 Studio 配置的 sharp 运行时），再重新构建。

更新动画和核验（需本机 Playwright 与 ffmpeg）：

```bash
python3 -m http.server 8766 --bind 127.0.0.1
# 另一终端，在仓库根目录运行
node scripts/check_effects.mjs
python3 scripts/test_profile.py
```

仅检查而不重录：`node scripts/check_effects.mjs --check-only`。不要把 node_modules、原始录屏帧或私密文件提交到仓库。
