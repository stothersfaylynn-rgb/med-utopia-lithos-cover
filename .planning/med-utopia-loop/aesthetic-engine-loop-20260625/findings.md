# 美学引擎闭环 · Findings

## Project State

- 分支：`codex/work-gallery-final`
- HEAD：`cc8e405 chore: add cloudflare pages redirects`
- 上游：`origin/codex/work-gallery-final`
- 工作区：存在既有未跟踪目录和文件，包括 `.agents/`、`.impeccable/`、`.planning/`、`backups/`、`findings.md`、`progress.md`、`skills-lock.json`、`task_plan.md`、`tmp/`；本阶段必须精确暂存，不能批量清理。

## Product and Design Constraints

- `/aesthetic-engine` 是 Coming Soon 页面；不能提供上传、生成、价格、支付、登录、聊天或真实交付流程。
- 固定说明来自 IA：`医学美学重构引擎正在内测中。报告美化、PPT 重构、科研海报生成等功能将作为独立工具开放，当前页面不提供文件上传。`
- 当前美学改变必须先预览确认；这次已生成桌面和移动预览，正在等待确认。
- 用户补充要求：颜色必须根据整套页面的 Light/Dark 两套体系适配；实现时不得只硬编码暗色特效页。
- 视觉必须克制、学术、精确；参考动效只能服务预告感，不能抢过病例、点评、挑战这条第一版主轴。
- reduced-motion 必须停用连续指针追踪和拖尾动画，保留可理解静态状态。

## Reference Behavior

- 用户参考：`https://codepen.io/thingbynemanja/pen/ogjaaNE`
- 观察到的核心模式：隐藏图片集 + 鼠标移动阈值 + 克隆图片卡 + 旋转/缩放/淡出 + 自动清理。
- 尺寸口径：参考效果的稳定性来自统一图片容器，而不是原图自由尺寸；实现应固定 2:3 竖向卡片，桌面接近 `200×300`，内部 `object-fit: cover`。
- 动态约束：需要限制触发距离、生成间隔、最大同时存在数量、生命周期和 z-index；快速鼠标移动时不能让卡片尺寸随机或遮住中心文案。
- 本项目实现应借鉴交互模式，不复制参考页图片、文案或品牌内容；不因一个效果引入上传或真实生成承诺。

## Current Route Gap

- `src/router.ts` 目前没有 `/aesthetic-engine` 路由。
- `src/App.tsx` 对未知路由显示“该页面暂未开放”占位。
- `src/components/ProductShell.tsx` 顶部导航已有“美学引擎”链接，但当前态匹配尚未覆盖 `/aesthetic-engine`。
- `src/ProductGallery.tsx` 的 `workDestinations` 目前没有“美学引擎”，既有测试曾要求 `/work` 不链接该页；本阶段用户已要求做相应页面和效果，因此后续测试需按新范围更新。

## Theme Adaptation Requirement

- Light：临床白医学档案馆，使用现有浅色背景、白色内容表面、深墨文字、医学青动作信号、少量琥珀/风险色。
- Dark：暗色临床判断档案，使用现有深色背景、暗色 dossier surface、临床白文字、医学青/琥珀信号。
- 交互拖尾图片可以有自身图像色彩，但页面底色、文字、按钮、边界和焦点状态必须跟随现有 theme class/token。
- 预览基准新增：`docs/previews/aesthetic-engine-loop/direction-a-dual-theme-board.png`。

## Trail Card Sizing Requirement

- 桌面：统一 2:3 竖向卡片，参考尺寸约 `200px × 300px`，允许通过 CSS clamp 在窄屏轻微缩放。
- 移动：统一同比缩小，不按图片天然宽高渲染。
- 图片：所有主题资产进入固定容器，使用 `object-fit: cover` 和稳定圆角/边框。
- 动画：只改变 `transform`、`opacity` 和少量 z-index，不改变卡片自身布局尺寸。
- 预览基准新增：`docs/previews/aesthetic-engine-loop/direction-b-fixed-card-system.png`。
