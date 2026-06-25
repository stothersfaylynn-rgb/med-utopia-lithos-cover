# Med-Utopia / 医学理想国交接文档

> 更新时间：2026-06-25（Asia/Shanghai）
>
> 当前分支：`codex/work-gallery-final`
>
> 当前阶段：美学引擎闭环已完成；本文件随阶段提交发布，最终 SHA 以 `git rev-parse HEAD` 为准

## 1. 下一窗口先做什么

按顺序完整阅读：

1. 本文件 `docs/HANDOFF.md`
2. `.planning/med-utopia-loop/aesthetic-engine-loop-20260625/task_plan.md`
3. `.planning/med-utopia-loop/aesthetic-engine-loop-20260625/progress.md`
4. `docs/superpowers/evidence/2026-06-25-aesthetic-engine-loop/qa-summary.md`
5. `PRODUCT.md`、`docs/product/ia-v1.md`、`assets/design-tokens.json`、`docs/component-specs.md`
6. 检查当前 Git 分支、HEAD、远端和工作区状态

若记录冲突，优先级为：用户最新决定 > 本文件 > 当前 Git 历史与代码 > 旧计划。

## 2. 不可丢失的边界

- 产品定位：中文优先、高信号、克制、学术医疗气质的医学知识与判断平台。
- 第一版主线：`避雷案例 + 专家点评 + 学术挑战`。
- 第一版排除：登录/注册、支付、文件上传、聊天/咨询、人才市场/个人档案、B2B 后台。
- “美学引擎”只能是 Coming Soon，不提供上传。
- 美学引擎视觉必须同时适配 Light/Dark 主题；拖尾图片必须固定 2:3 容器，不能按原图尺寸随机渲染。
- 首页双图、标题、CTA 和整体构图锁定；`/work` 正常模式空间逻辑锁定。
- 任何审美变化必须先生成预览图并获得用户确认，再写代码。
- 只能精确暂存当前阶段允许文件；禁止批量暂存、`git clean`、`git reset --hard` 或覆盖未跟踪资产。

## 3. 美学引擎闭环完成状态

新增并接通：

- `/aesthetic-engine`：独立 Coming Soon 页面，中间主文案为“敬请期待”。
- 参考 CodePen 的鼠标图片拖尾机制，但使用项目内医学主题资产，不复制参考页图片或品牌内容。
- 拖尾图片采用固定 2:3 竖向卡片系统，桌面约 `166×250` 布局尺寸，移动约 `121×181`；旋转只影响视觉外接框，不改变布局尺寸。
- Light/Dark 双主题适配：浅色为临床白档案，深色为暗色临床判断档案；页面背景、文字、边界、按钮和焦点状态跟随现有 token。
- 6 张项目内主题资产：报告重构、PPT 重构、科研海报、证据矩阵、临床决策路径、医学档案封面。
- `/apply?module=aesthetic-engine`：显示“来自模块：美学引擎”、预选“美学引擎”，提交成功后保留 `module=aesthetic-engine` 并返回 `/aesthetic-engine`。
- `/work`：现有五层结构、内容和滚动逻辑不变，只启用“美学引擎”卡片到 `/aesthetic-engine` 的真实目的地。

仍然不提供：

- 文件上传、生成按钮、报告/PPT/海报真实交付、价格/支付、登录、聊天、AI 诊断或患者数据处理。

预览确认记录：

- `docs/previews/aesthetic-engine-loop/direction-a-desktop.png`
- `docs/previews/aesthetic-engine-loop/direction-a-mobile.png`
- `docs/previews/aesthetic-engine-loop/direction-a-dual-theme-board.png`
- `docs/previews/aesthetic-engine-loop/direction-b-fixed-card-system.png`

## 4. 专家策展闭环完成状态

新增并接通：

- `/curators`：三位 Mock 专家的研究方向、策展病例、精选点评、审核披露和三类真实行动。
- `/cases?curator=:expertSlug`：合法专家 query 只显示对应策展病例；未知值安全恢复全部案例。
- `/apply?type=curation&expert=:expertSlug`：显示来源专家、只预选“专家策展”、本地确定性提交并保留 expert 上下文。
- 策展申请成功态：返回 `/curators`，不创建账号或网络工作流。
- `/work`：现有五层结构、内容、样式和动效不变，只启用专家策展卡的 `/curators` 目的地。

数据层包含 3 条 typed Mock 专家记录，并与 3 条现有案例及其点评互相校验。批准方向为“策展索引册”；桌面/移动预览在编码前由用户确认。

## 5. 验证基线

美学引擎闭环提交前的最终工作区验证：

- Vitest：19 个测试文件，140/140 通过。
- 设计令牌测试：3/3 通过。
- 设计令牌引用解析、组件层 token 化和 CSS 同步：通过。
- TypeScript 检查与生产构建：通过。
- `git diff --check`：通过。
- 浏览器运行时：`/aesthetic-engine` 在桌面 `1280×720`、移动 `390×844`、Light/Dark 均验证；reduced-motion dark 单独验证。
- 页面只有一个 `h1`，无横向溢出，无控制台 warning/error，申请入口 44px，无上传/生成/表单控件。
- 快速鼠标移动后拖尾项仍使用固定 2:3 布局容器；reduced-motion 下不生成连续拖尾项。
- 运行时证据：`docs/superpowers/evidence/2026-06-25-aesthetic-engine-loop/`。

提交后还必须从 `git archive HEAD` 等价干净快照复跑同一验证集；通过后才可推送。

## 6. 关键实现入口

- 美学引擎页：`src/pages/AestheticEnginePage.tsx`
- 美学引擎资产：`public/aesthetic-engine/`
- 数据：`src/data/experts.ts`、`src/data/cases.ts`
- 路由：`src/router.ts`
- 专家页：`src/pages/CuratorsPage.tsx`
- 策展案例筛选：`src/caseFilters.ts`、`src/pages/CasesPage.tsx`
- 申请闭环：`src/pages/ApplyPage.tsx`、`src/applyForm.ts`
- 产品总览入口：`src/ProductGallery.tsx`
- 产品样式：`src/product.css`

## 7. 工作区保护

本仓库仍存在本阶段之外的未跟踪目录和文件，包括 `.agents/`、`.impeccable/`、`.planning/`、`backups/`、根目录计划记录及 `tmp/`。它们不属于美学引擎闭环提交，必须原样保留。

下一阶段开始前先用 `$med-utopia-loop 查看当前状态` 读取持久状态；若只是从上下文丢失后接续，再使用 `$handoff-loop` 核对 `.codex/handoff/checkpoint.md`，但以本文件和实时 Git 为准。
