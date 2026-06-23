# 医学理想国前端 UI Audit v1

- 审计日期：2026-06-20
- 审计范围：`src`
- 项目 register：`product`
- 审计性质：只读诊断，不修复问题
- 运行时检查：桌面端 1280×720、移动端 390×844

> **一句话结论：当前页面最需要解决的不是更多视觉打磨，而是让用户能够通过键盘、触控和清晰入口完成真实产品任务。**

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|---|---:|---|
| 1 | Accessibility | 1/4 | 产品卡片不可聚焦或进入，存在失效按钮、错误标题层级、低对比度小字和缺失状态公告。 |
| 2 | Performance | 1/4 | `/work` 同时运行 React 指针 RAF 与 150 粒子 Canvas RAF；首页每帧 `toDataURL` 并更新 React state。 |
| 3 | Responsive Design | 1/4 | 390px 下无横向溢出，但导航仅 27px 高、正文低至 8–9px、返回入口隐藏。 |
| 4 | Theming | 1/4 | 首页主题仅为组件本地状态，刷新复位；`/work` 固定深色，代码中有 121 个独立颜色字面量。 |
| 5 | Anti-Patterns | 0/4 | 玻璃、宽辉光、大圆角、扫描纹、粒子、嵌套描边和随模块换色同时出现。 |
| **Total** |  | **4/20** | **Critical：存在基础任务、无障碍和持续运行开销问题。** |

评分不是对视觉完成度的评价，而是对当前实现是否能作为可发布产品界面的技术判断。

## Anti-Patterns Verdict

**Fail：当前 `/work` 具有明显的 AI 视觉概念稿痕迹。**

主要信号集中在 `src/index.css:982-1080`、`1059-1197`：黑色虚空、逐模块霓虹换色、粒子、玻璃模糊、1px 描边叠加 44–76px 宽阴影、20–30px 大圆角、嵌套框、扫描纹和 3D 滚动同时使用。这些效果没有表达风险等级、证据强度或任务状态，属于装饰而不是医学产品语义。

自动检测器对 `src` 返回 29 项 advisory：

- 15 项颜色不在 `DESIGN.md` 调色板中；
- 14 项圆角不在 `DESIGN.md` 圆角尺度中；
- 全部集中在 `src/index.css`。

这 29 项只是设计系统漂移信号，不包括键盘、性能、低对比度和交互失效问题。

## Executive Summary

- Audit Health Score：**4/20（Critical）**
- 问题总数：**18**
  - P0：1
  - P1：9
  - P2：6
  - P3：2
- 测试：**13/13 通过**
- 生产构建：**通过**
- 构建产物：JS 162.02 kB / 52.81 kB gzip；CSS 50.05 kB / 10.58 kB gzip
- 首页 WebP：约 209 kB；包体不是当前首要性能问题
- `src`：审计过程中未修改

### 当前最重要的三个事实

1. 用户看见了按钮和卡片，但无法进入真实内容。
2. reduced-motion 只停止少量 CSS animation，没有停止 RAF、粒子或滚动映射。
3. 移动端没有横向溢出，但通过缩小文字和控件换取了“能塞下”，不等于可用。

## Positive Findings

以下实践应保留：

- `ProductGallery.tsx:127-170` 使用了 `main`、`nav`、`section` 等语义化地标。
- `ProductGallery.tsx:135-145` 的粒子、丝带、雕塑等装饰层多数使用 `aria-hidden` 或无交互指针事件。
- `ProductGallery.tsx:91-99,120-122` 和 `ParticleField.tsx:140-147` 对事件监听和 RAF 做了卸载清理。
- 滚动监听使用 `{ passive: true }`（`ProductGallery.tsx:120`）。
- 首页主题按钮有明确中文 `aria-label`（`HomePage.tsx:110-121,136-147`）。
- 首页主要触控按钮达到 44×44px（`HomePage.tsx:110-159`）。
- 两张首页图片采用 WebP，文件体积可控。
- 390px 运行时没有横向溢出：`scrollWidth == clientWidth == 390`。
- 测试和生产构建均通过，控制台主题切换检查没有错误或警告。
- 首页现有双图叠层揭示是已确认的品牌资产；需要保留概念，但优化其运行方式。

## Detailed Findings by Severity

### P0 — Blocking

#### [P0] 产品入口包含失效按钮和不可进入卡片

- **Location:** `src/HomePage.tsx:90-106,149-159`；`src/ProductGallery.tsx:157-166,169-200`
- **Category:** Accessibility / Keyboard / Product interaction
- **Impact:** 首页五个导航按钮和移动菜单没有行为；`/work` 三个导航按钮没有行为；五张主卡是不可聚焦的 `article`，只有鼠标悬停处理。用户无法打开案例、专家点评或学术挑战，核心任务被阻断。
- **WCAG/Standard:** WCAG 2.1.1 Keyboard；WCAG 2.4.3 Focus Order；标准控件可预期行为。
- **Recommendation:** 将真实入口实现为链接或按钮；三大核心模块必须支持鼠标、触控、键盘和深链接进入。不可用项应使用真实 disabled 状态并解释原因，不能保留假按钮。
- **Suggested command:** `$impeccable shape src as a task-completable product entrance`

### P1 — Major

#### [P1] 键盘用户无法进入产品内容，焦点样式不足

- **Location:** `src/ProductGallery.tsx:179-200`；`src/index.css:231-236`
- **Category:** Accessibility / Keyboard
- **Impact:** 卡片 `tabIndex=-1`，没有键盘激活方式；导航 `:focus-visible` 明确设为 `outline: 0`，只依赖低对比背景变化。键盘用户只能经过几个无行为按钮，不能进入实际内容。
- **WCAG/Standard:** WCAG 2.1.1 Keyboard；2.4.7 Focus Visible；2.4.11 Focus Not Obscured。
- **Recommendation:** 为所有真实入口提供语义链接/按钮和高对比焦点环；建立从导航到当前模块、相关内容和返回入口的完整焦点顺序。
- **Suggested command:** `$impeccable audit src after keyboard interaction is implemented`

#### [P1] reduced-motion 没有覆盖 JS 动画和滚动映射

- **Location:** `src/index.css:1717-1724`；`src/HomePage.tsx:29-50`；`src/ProductGallery.tsx:79-123`；`src/ParticleField.tsx:50-148`
- **Category:** Accessibility / Performance / Motion
- **Impact:** `prefers-reduced-motion` 只关闭 `.hero-anim`、`.hero-zoom`、`.work-slab` 的 CSS animation。指针 RAF、粒子 RAF、滚动映射和场景位移继续运行，易引发眩晕并持续耗电。
- **WCAG/Standard:** WCAG 2.3.3 Animation from Interactions；用户系统动态偏好。
- **Recommendation:** 在 JS 层读取并监听 `prefers-reduced-motion`；停止粒子和指针 RAF；将滚动深度转换成即时状态；保留首页双图叠层概念，但使用静态揭示区或无连续动画触发。
- **Suggested command:** `$impeccable animate src with complete reduced-motion behavior`

#### [P1] `/work` 同时运行 React `requestAnimationFrame`（RAF）和高 DPR 粒子 Canvas

- **Location:** `src/ProductGallery.tsx:42-100`；`src/ParticleField.tsx:22-30,50-148`
- **Category:** Performance
- **Impact:** `ProductGallery` 每帧调用 `setCursorPos`，导致 React 树持续重新渲染；`ParticleField` 同时绘制 150 粒子和 9 条 Bezier 曲线。桌面实测 Canvas backing size 为 2560×1440，即每帧处理约 369 万像素。移动端即使没有鼠标也持续运行。
- **WCAG/Standard:** Web performance long-task / rendering budget；移动端能耗。
- **Recommendation:** 指针数据保留在 ref/CSS 变量中，不要每帧更新 React state；粒子默认停用或按设备能力降级；页面隐藏、失焦、触控设备和 reduced-motion 时必须停止循环。
- **Suggested command:** `$impeccable optimize src/ProductGallery.tsx and src/ParticleField.tsx`

#### [P1] 首页揭示效果每帧序列化 Canvas 并二次触发 React 更新

- **Location:** `src/HomePage.tsx:29-50,176`；`src/RevealLayer.tsx:29-40`
- **Category:** Performance
- **Impact:** 首页 RAF 每帧更新 `cursorPos`；`RevealLayer` 在每次渲染后重绘全屏 Canvas、执行 `canvas.toDataURL()`，再通过 `setMaskImage` 触发额外渲染。品牌效果被保留，但当前实现存在明显主线程和内存分配压力。
- **WCAG/Standard:** Web performance rendering budget。
- **Recommendation:** 保留两张图与前后揭示设计，改用 CSS mask-position、单一 Canvas 合成或直接 DOM/CSS 变量更新；禁止每帧 `toDataURL` 和 React state 往返。
- **Suggested command:** `$impeccable optimize src/RevealLayer.tsx`

#### [P1] 移动端触控目标和正文尺寸不达标

- **Location:** `src/index.css:1587-1596,1663-1691`；`src/ProductGallery.tsx:147-166`
- **Category:** Responsive / Accessibility
- **Impact:** 390px 实测导航按钮仅 27px 高；桌面为 25px。移动 dossier 标签 8px、列表 9px，正文无法舒适阅读。触控误点风险高，低视力用户难以使用。
- **WCAG/Standard:** WCAG 2.5.8 Target Size (Minimum)；1.4.4 Resize Text；项目基线 44×44px。
- **Recommendation:** 所有触控入口至少 44×44px；产品正文最低 15–16px，次级标签不低于 12–14px；移动端重新组织为单列阅读结构，而不是缩小桌面展廊。
- **Suggested command:** `$impeccable adapt src for mobile`

#### [P1] 低透明度叠加导致正文对比度不足

- **Location:** `src/index.css:1164-1184,1225-1233`；`src/ProductGallery.tsx:229`
- **Category:** Accessibility / Theming
- **Impact:** dossier 使用父层 `opacity: .72`，内部列表又是白色 `.58`，按黑底估算有效对比约 3.88:1；`SCROLL SPACE` 白色 `.45` 约 4.43:1。两者均低于普通文字 4.5:1，且背景还包含动态辉光。
- **WCAG/Standard:** WCAG 1.4.3 Contrast (Minimum)。
- **Recommendation:** 不要在含文字的父容器使用整体 opacity；为文字使用不透明语义色；在真实动态背景上逐状态测量对比度。
- **Suggested command:** `$impeccable colorize src with verified semantic contrast`

#### [P1] 标题层级和当前模块状态对读屏器不清楚

- **Location:** `src/ProductGallery.tsx:46-47,127-132,179-220`
- **Category:** Accessibility
- **Impact:** 同一页面同时暴露五个 `h1`；模块变化没有 `aria-current`、状态文本或 `aria-live`。视觉用户看到当前卡变化，读屏器用户无法获知当前位置。
- **WCAG/Standard:** WCAG 1.3.1 Info and Relationships；4.1.2 Name, Role, Value；4.1.3 Status Messages。
- **Recommendation:** 页面只保留一个 `h1`，模块使用 `h2`；导航与当前模块建立程序化关系；状态切换使用克制的 live region 或可访问状态文本。
- **Suggested command:** `$impeccable harden src/ProductGallery.tsx`

#### [P1] 移动端隐藏返回入口并强制长距离滚动

- **Location:** `src/ProductGallery.tsx:147-155`；`src/index.css:135-145,1587-1708`
- **Category:** Responsive / Keyboard / Navigation
- **Impact:** `hidden sm:flex` 使移动端品牌/返回按钮消失；用户需要滚动约 5.6 个视口才能经过五个模块，且没有直接模块入口或进度文本。
- **WCAG/Standard:** WCAG 2.4.5 Multiple Ways；2.4.8 Location。
- **Recommendation:** 移动端保留明确返回入口；三大模块可直接选择；提供当前项/总数和跳过能力，避免把滚动距离当成交互本身。
- **Suggested command:** `$impeccable clarify src/ProductGallery.tsx navigation`

#### [P1] 视觉反模式压过医学产品语义

- **Location:** `src/index.css:982-1080,1059-1197`；`src/ProductGallery.tsx:134-145`
- **Category:** Anti-Pattern / Performance
- **Impact:** 粒子、雾、丝带、雕塑、噪点、玻璃、宽阴影、大圆角和嵌套框同时存在。用户首先记住“赛博展廊”，而不是病例、专家判断和学术挑战；多层 blur/filter 也增加合成开销。
- **WCAG/Standard:** Impeccable product register；项目 Anti-references。
- **Recommendation:** 删除大多数环境装饰，只保留一个能表达“进入判断内层”的品牌线索；将视觉面积和对比度交给真实病例、专家证据和任务入口。
- **Suggested command:** `$impeccable quieter src/ProductGallery.tsx`

### P2 — Minor

#### [P2] 主题系统是页面局部状态，不是产品级主题

- **Location:** `src/index.css:5-10`；`src/HomePage.tsx:24-27,53-60`；`src/ProductGallery.tsx:127-132`
- **Category:** Theming
- **Impact:** 首页可切换深浅主题，但刷新后从 light 回到 dark；没有系统偏好或持久化；`/work` 始终固定 dark。用户设置在页面切换后失效。
- **WCAG/Standard:** User preference consistency；WCAG 1.4.8 的可读性原则。
- **Recommendation:** 建立产品级 theme provider/token 层，支持系统偏好、持久化和跨路由一致性；如果 `/work` 必须固定主题，应在设计基线中明确并验证对比度。
- **Suggested command:** `$impeccable colorize src with a product-level theme system`

#### [P2] 颜色硬编码和设计系统漂移严重

- **Location:** `src/HomePage.tsx:54-59,84-126,178-214`；`src/galleryContent.ts:23-103`；`src/index.css:156-1295`
- **Category:** Theming / Maintainability
- **Impact:** 统计到 51 个 hex、150 个 rgb/rgba、121 个独立颜色字面量。检测器发现 15 个未登记颜色。主题、对比度和语义状态无法集中维护。
- **WCAG/Standard:** Design token consistency；可维护主题系统。
- **Recommendation:** 将背景、表面、文字、边框、状态和模块强调色映射到语义 token；禁止组件继续新增裸色值。
- **Suggested command:** `$impeccable extract src design tokens`

#### [P2] 圆角、阴影和 z-index 没有统一尺度

- **Location:** `src/index.css:203-339,932-1249,1331-1675`；`src/HomePage.tsx:62,84-126`；`src/ProductGallery.tsx:145-229`
- **Category:** Theming / Anti-Pattern / Maintainability
- **Impact:** 26 个 CSS 圆角声明、17 个 CSS 阴影声明、27 个 CSS z-index，加上 8/59/15 个对应 Tailwind utility。检测器发现 14 个圆角越过设计尺度；z-index 使用 70、90、100、110、120 等页面局部数字，没有语义层级。
- **WCAG/Standard:** Design-system consistency。
- **Recommendation:** 建立有限圆角尺度、阴影角色和语义 z-index（base/sticky/dropdown/modal/toast）；删除“描边 + 宽阴影 + 玻璃”的 ghost-card 组合。
- **Suggested command:** `$impeccable extract src visual tokens`

#### [P2] 自动化测试没有覆盖无障碍、响应式和动态偏好

- **Location:** `src/App.test.tsx:18,104,110,192`；`src/heroConfig.test.ts:11-24`
- **Category:** Accessibility / Performance / Responsive
- **Impact:** 当前测试验证文案、路由与样式变量，但没有 axe、键盘路径、焦点、主题持久化、触控尺寸、reduced-motion 或 RAF 停止条件。高风险问题无法被回归测试拦截。
- **WCAG/Standard:** Automated quality gate。
- **Recommendation:** 增加键盘与语义测试、axe 扫描、reduced-motion/mockMedia 测试、移动视口断言和动画暂停测试。
- **Suggested command:** `$impeccable harden src test coverage`

#### [P2] 首页双图品牌叙事没有可访问文本等价物

- **Location:** `src/HomePage.tsx:169-176`；`src/RevealLayer.tsx:42-58`
- **Category:** Accessibility
- **Impact:** 现代医学图与古代医者图通过 CSS background 呈现，读屏器无法获得“现代与传统、表层与内里”的品牌叙事。如果图片仅为装饰则无问题，但项目已经明确其为品牌含义载体。
- **WCAG/Standard:** WCAG 1.1.1 Non-text Content。
- **Recommendation:** 保留视觉设计，同时提供简短、非重复的文本说明或可访问描述；不要把所有含义只放在蒙版图像中。
- **Suggested command:** `$impeccable clarify src/HomePage.tsx accessible brand narrative`

#### [P2] 样式表存在大量叠加变体和 `!important`

- **Location:** `src/index.css:127-929,1299-1715`，特别是 `1567,1571,1576,1641,1646,1655`
- **Category:** Responsive / Maintainability
- **Impact:** `index.css` 共 1,724 行，保留 horizontal/vertical/long/spiral 多套展廊规则，移动端依靠 6 个 `!important` 覆盖。调整一个断点时容易产生级联回归。
- **WCAG/Standard:** Maintainable responsive system。
- **Recommendation:** 删除未使用展廊变体，按页面/组件拆分样式，使用明确层级替代 `!important`。
- **Suggested command:** `$impeccable distill src/index.css`

### P3 — Polish

#### [P3] 移动菜单无行为且无障碍名称使用英文

- **Location:** `src/HomePage.tsx:149-159`
- **Category:** Accessibility / i18n
- **Impact:** 中文产品中读屏名称为 `Open menu`，且按钮没有展开状态或行为，增加不一致感。
- **Recommendation:** 实现菜单后使用中文名称，并维护 `aria-expanded`、`aria-controls`。
- **Suggested command:** `$impeccable clarify src/HomePage.tsx mobile navigation`

#### [P3] `SCROLL SPACE` 是内部化提示且对比度不足

- **Location:** `src/ProductGallery.tsx:229-231`；`src/index.css:1286-1287`
- **Category:** Accessibility / UX copy
- **Impact:** 10px 英文提示不能解释如何操作，有效对比约 4.43:1，接近但未达到普通文字 AA。
- **Recommendation:** 删除该内部标签，或改成清楚的中文状态/操作说明并满足 4.5:1。
- **Suggested command:** `$impeccable clarify src/ProductGallery.tsx mobile guidance`

## Patterns & Systemic Issues

1. **视觉状态没有产品状态。** 颜色、辉光和位移表达气氛，却没有表达当前位置、可点击性、加载、不可用或完成状态。
2. **动画绕过了 React 与用户偏好边界。** RAF、Canvas 和 scroll mapping 分散在多个组件，没有统一 motion policy。
3. **响应式目标是“塞进屏幕”，不是重排任务。** 窄屏通过缩小文字、隐藏返回入口和压缩卡片保留桌面构图。
4. **设计 token 文档与代码没有连接。** `DESIGN.md` 已存在，但源码仍有 121 个独立颜色值和多套圆角、阴影、z-index。
5. **测试验证“页面存在”，没有验证“用户能完成”。** 当前 13 个测试全部通过，但 P0 任务阻断仍然存在。

## 保留什么

- 首页两张现有图片及前后叠层、柔边局部揭示的品牌概念。
- 中文优先和“决策节点—错误路径—专家修正—可复用原则”的内容语言。
- `main/nav/section/aside` 等语义化地标。
- 装饰 Canvas 使用 `aria-hidden` 的做法。
- 事件监听与 RAF 的卸载清理。
- WebP 资产和当前可接受的基础包体积。
- 390px 下无横向溢出的响应式底线。

## 修改什么

- 将导航和主卡改成真实可操作、可聚焦、可深链接的产品入口。
- 建立完整键盘焦点、当前状态、读屏公告和返回路径。
- 用 JS motion policy 完整响应 reduced-motion、页面可见性和触控设备。
- 重写首页 RevealLayer 的运行方式，保留视觉概念但移除每帧 `toDataURL`。
- 移动端改为产品阅读结构，而不是缩小桌面展廊。
- 建立语义颜色、圆角、阴影、motion 和 z-index token。
- 统一首页与 `/work` 的主题策略。

## 删除什么

- 无行为的假按钮和假可点击卡片。
- `/work` 默认持续运行的粒子场，或至少从核心产品路径移除。
- 多数与医学语义无关的雾、丝带、雕塑环、扫描纹和嵌套框。
- ghost-card 组合：1px 描边 + 宽阴影 + 玻璃模糊。
- 未使用的展廊样式变体和用于覆盖级联的 `!important`。
- `SCROLL SPACE` 等内部占位文案。

## 缺少什么

- 三大核心模块的真实链接、路由和代表性内容预览。
- 页面唯一 `h1`、`aria-current`、状态文本和 live region 策略。
- 完整键盘旅程和移动端返回入口。
- reduced-motion、页面隐藏和低性能设备的统一停机策略。
- 颜色、圆角、阴影、motion、breakpoint 和 z-index 语义 token。
- 主题持久化与系统偏好支持。
- axe、键盘、响应式、主题和动画生命周期测试。
- 明确的运行时性能预算和验证流程。

## 前三优先级

### 1. P0 — 先让产品任务可完成

实现三大核心模块的真实入口、键盘激活、深链接、当前状态和返回路径。没有这一层，其他视觉优化不会提高产品可用性。

建议命令：`$impeccable shape src as a task-completable product entrance`

### 2. P1 — 停止不受控的连续动画开销

统一处理 reduced-motion、页面可见性和触控设备；停止无必要 RAF 与粒子；保留首页双图概念，但移除每帧 React state 与 `toDataURL`。

建议命令：`$impeccable optimize src motion and canvas runtime`

### 3. P1 — 重建移动端与可访问层级

44×44px 控件、15–16px 正文、明确焦点、单一 `h1`、模块状态公告、移动返回入口和内容优先的单列结构。

建议命令：`$impeccable adapt src for mobile and keyboard access`

完成以上三项后再执行：`$impeccable extract src design tokens`，最终运行 `$impeccable polish src`。

## 通过标准

### Accessibility / Keyboard

- 页面只有一个 `h1`，模块使用正确层级标题。
- 所有真实入口均可通过 Tab 到达、Enter/Space 激活，并具有清晰 `:focus-visible`。
- 不存在有按钮外观却无行为的控件。
- 当前模块可由程序化状态识别；模块变化能被读屏器理解但不产生冗余播报。
- 所有普通文字在每种动态背景状态下达到至少 4.5:1。
- 首页双图品牌叙事有可访问文本等价物。

### reduced-motion / Performance

- `prefers-reduced-motion: reduce` 下不运行粒子、指针追踪、深度旋转、长距离滚动映射和页面入场编排。
- 页面隐藏、失焦或处于触控设备时，不存在无必要的持续 RAF。
- React 不再每帧更新整页 cursor state。
- 首页揭示不再每帧调用 `canvas.toDataURL()`。
- `/work` 空闲状态 CPU 能回落，不持续绘制全屏 Canvas。
- 生产构建继续通过，关键交互无控制台错误。

### Responsive / Touch

- 在 320、390、768、1280px 宽度下无横向溢出和内容遮挡。
- 所有触控目标至少 44×44 CSS px。
- 产品正文最低 15–16px；次级标签不以 8–9px 承载必要信息。
- 移动端具有明确返回入口、模块索引和直接进入方式。

### Theming / Design System

- 首页和 `/work` 使用统一主题来源；用户选择可持久化或明确遵循系统偏好。
- 颜色、圆角、阴影、motion、breakpoint 和 z-index 使用语义 token。
- `detect.mjs --json src` 不再出现未解释的颜色和圆角漂移；确有必要的例外必须进入 `DESIGN.md`。
- z-index 使用有限语义尺度，不再依赖 70/90/100/110/120 等页面局部数字。

### Quality Gates

- 增加 axe、键盘路径、reduced-motion、主题持久化、移动触控尺寸和动画停止测试。
- 全部测试与生产构建通过。
- 重新运行 `$impeccable audit src` 后：P0 为 0，P1 为 0，Audit Health Score 至少达到 14/20。

## Recommended Actions

1. **[P0] `$impeccable shape`**：建立可完成任务的三模块产品入口。
2. **[P1] `$impeccable optimize`**：处理 RAF、粒子、RevealLayer 和生命周期停机策略。
3. **[P1] `$impeccable adapt`**：重建移动端、触控目标和键盘层级。
4. **[P2] `$impeccable extract`**：提取颜色、圆角、阴影、motion 和 z-index token。
5. **[P2] `$impeccable harden`**：补齐无障碍和动态偏好回归测试。
6. **[Final] `$impeccable polish`**：完成修复后的发布前一致性检查。

可以按以上顺序逐项执行，也可以只先处理前三项。修复后重新运行 `$impeccable audit src` 比较评分。
