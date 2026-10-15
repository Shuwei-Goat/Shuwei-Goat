# 角色面板组件

当前选定羊羊角色面板，使用鼠尾草绿 → 浅奶黄色渐变。所有章节的装饰口号、灰色小字及脚注已删除。

| 项目 | 主页部分 | 状态 |
|---|---|---|
| awesome-github-profile-readme | 角色面板布局参考 | 已使用 |
| shields | 工具标签 | 已接入 |
| simple-icons | GitHub 入口图标 | 已使用 |
| github-profile-readme-generator | 基础 Markdown | 已实际运行 |
| markdown-badges | 工具文字徽章 | 已使用 |
| skill-icons | 本站搭建工具图标 | 已使用 |
| readme-typing-svg | 动态用户名 | 已接入 |

根据用户要求，连续贡献、奖杯、近期活动三个模块及其工作流已移除，不再请求它们的服务或要求 METRICS_TOKEN。历史核查素材仅作留档，不包含在当前发布包。

最新检查结果见 evidence/service-status.json 和 evidence/visual-check.json。原统计项目的维护状态说明见此前保存的官方文档；发布配置采用其文档推荐的静态生成 Action。

此前已移除旧版统计卡、语言卡、贪吃蛇和访问计数及其任务；此次仅按新要求追加下列效果区。账号已开启活动隐藏，README 仍然公开。

## 2026-10-15 新增效果展区

原主页完整保留，新增内容只追加在 BUILD KIT 之后。用户本次重新授权添加 Summary Cards 数据展示。GitHub 账号继续开启活动隐藏，本次没有修改账号隐私。

| 项目 | 本次实际接入 | 主页展示方式 |
|---|---|---|
| [Summary Cards](https://github.com/vn7n24fzkq/github-profile-summary-cards) | Profile details、Stats、Repos per language、Most commit language、Productive time，深浅两套；rise / fade / draw / load / stagger 动画 | SUMMARY CARDS：1 张全宽卡与 2 组可换行卡片 |
| [Capsule Render](https://github.com/kyechan99/capsule-render) | waving + twinkling、rounded + fadeIn、blur + scaleIn；统一 #669379 → #DCD9A9 渐变 | CAPSULE RENDER：3 款完整展开的 SVG 封面 |
| [React Bits](https://github.com/DavidHDev/react-bits) | 官方 ProfileCard、GlassSurface、CircularGallery 源码；定制为彩虹羊品牌，未使用示例人物或虚构作品 | REACT BITS：3 段实际组件的 GIF 录屏；减弱动态时显示 PNG；另有 GitHub Pages 交互演示 |

### 数据、隐私与运行

- Summary Cards 使用公开托管 API，参数均为真实账号 `Shuwei-Goat`，没有向服务提供本机 GitHub 凭证。
- 账号隐藏活动时，公开 API 的贡献、提交等字段可能返回 0；这不代表账户真实贡献总数。保留服务的原始结果，不编造数据。语言图只汇总该公开接口可见的仓库。
- Summary Cards 与 Capsule Render 已成功获取 SVG 快照。每日北京时间 10:23 随现有 Refresh profile artwork 工作流刷新；请求失败会保留上次成功素材，同时让工作流报告失败。
- GitHub README 无法运行 React、鼠标悬停、WebGL 或拖拽。README 使用本次实际运行画面的循环 GIF，交互在 Pages 演示中运行。
- React Bits 的 3 个官方组件文件仅补充默认 React 导入，以适配此 Vite 构建；品牌参数、布局与内容在 `effects/src/main.jsx` 和 `style.css`。许可证副本在 `effects/LICENSE.react-bits.md`，发布目录内也保留。
- 画廊的四幅素材是同一只羊的鼠尾草绿、奶黄、淡紫、彩虹配色设计，没有把它们写成个人作品。
- 新增图片以 picture 包裹，不设置图片跳转。交互演示使用单独文字入口。
- 技术核查记录保存在 `evidence/design-effects/`，不在主页加入灰色说明文字。
