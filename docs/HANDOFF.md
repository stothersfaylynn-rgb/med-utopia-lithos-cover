# Med-Utopia / 医学理想国交接文档

> 更新时间：2026-06-24（Asia/Shanghai）
>
> 当前分支：`codex/work-gallery-final`
>
> 当前阶段：学术挑战闭环已完成；本文件随阶段提交发布，最终 SHA 以 `git rev-parse HEAD` 为准

## 1. 下一窗口先做什么

按顺序完整阅读：

1. 本文件 `docs/HANDOFF.md`
2. `docs/superpowers/specs/2026-06-24-academic-challenge-loop-design.md`
3. `docs/superpowers/plans/2026-06-24-academic-challenge-loop.md`
4. `PRODUCT.md`、`docs/product/ia-v1.md`、`assets/design-tokens.json`、`docs/component-specs.md`
5. 检查当前 Git 分支、HEAD、远端和工作区状态

若记录冲突，优先级为：用户最新决定 > 本文件 > 当前 Git 历史与代码 > 旧计划。

## 2. 不可丢失的边界

- 产品定位：中文优先、高信号、克制、学术医疗气质的医学知识与判断平台。
- 第一版主线：`避雷案例 + 专家点评 + 学术挑战`。
- 第一版排除：登录/注册、支付、文件上传、聊天/咨询、人才市场/个人档案、B2B 后台。
- “美学引擎”只能是 Coming Soon，不提供上传。
- 首页双图、标题、CTA 和整体构图锁定；`/work` 正常模式空间逻辑锁定。
- 任何审美变化必须先生成预览图并获得用户确认，再写代码。
- 只能精确暂存当前阶段允许文件；禁止批量暂存、`git clean`、`git reset --hard` 或覆盖未跟踪资产。

## 3. 学术挑战闭环完成状态

新增并接通：

- `/challenges`：任务卷宗列表、稳定分类筛选、结果计数、空状态和重置。
- `/challenges/:slug`：任务说明、招募状态、专家提示、评价标准、关联案例和申请入口。
- `/apply?challenge=:slug`：显示来源挑战、预选“学术挑战”、本地确定性提交，并在成功态保留来源。
- 案例详情：可返回关联挑战。
- `/work`：现有五层结构不变，学术挑战模块和顶部导航指向真实页面。

数据层包含 3 条 typed Mock 学术挑战记录。列表批准方向为“任务卷宗”；桌面/移动预览均在编码前由用户确认。

## 4. 验证基线

本阶段提交前的最终工作区验证：

- Vitest：16 个测试文件，111/111 通过。
- 设计令牌测试：3/3 通过。
- 设计令牌引用解析、组件层 token 化和 CSS 同步：通过。
- TypeScript 检查与生产构建：通过。
- 浏览器运行时：桌面 `1280×720`、移动 `390×844`，Light/Dark 均验证。
- 列表与详情均只有一个 `h1`、无横向溢出、主要操作区不低于 44px，控制台无错误。
- 运行时证据：`docs/superpowers/evidence/2026-06-24-academic-challenge-loop/`。

提交后还必须从 `git archive HEAD` 等价干净快照复跑同一验证集；通过后才可推送。

## 5. 关键实现入口

- 数据：`src/data/challenges.ts`
- 路由：`src/router.ts`
- 列表筛选：`src/challengeFilters.ts`
- 列表页：`src/pages/ChallengesPage.tsx`
- 详情页：`src/pages/ChallengeDetailPage.tsx`
- 申请闭环：`src/pages/ApplyPage.tsx`、`src/applyForm.ts`
- 案例互链：`src/data/cases.ts`、`src/pages/CaseDetailPage.tsx`
- 产品总览入口：`src/ProductGallery.tsx`

## 6. 工作区保护

本仓库仍存在本阶段之外的未跟踪目录和文件，包括 `.agents/`、`.impeccable/`、`.planning/`、`backups/`、根目录计划记录及 `tmp/`。它们不属于学术挑战提交，必须原样保留。

下一阶段开始前先用 `$med-utopia-loop 查看当前状态` 读取持久状态；若只是从上下文丢失后接续，再使用 `$handoff-loop` 核对 `.codex/handoff/checkpoint.md`，但以本文件和实时 Git 为准。
