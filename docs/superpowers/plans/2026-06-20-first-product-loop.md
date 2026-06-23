# First Product Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不改变已锁定首页与 `/work` 核心视觉/动效逻辑的前提下，交付“首页 -> 避雷案例列表 -> 避雷案例详情 -> 申请内测”的第一个可访问、可深链接、可在移动端完成的产品闭环。

**Architecture:** 保留当前 React 18 + Vite 单页应用和 History API，不新增路由依赖。增加一个纯函数路由层、一个产品级主题 Provider、一份集中式案例 Mock 数据、三个产品页面和一套独立的 `product.css`；现有首页只做真实链接、全局主题和 reduced-motion 接入，`/work` 只做导航接线与 reduced-motion 停机，不重写其空间动效。申请提交采用明确的前端 Mock 成功状态，不发送网络请求、不保存医学资料。

**Tech Stack:** React 18.3、TypeScript 5.6（strict）、Vite 5、Vitest 2 + jsdom、Tailwind 3（仅保留现有首页用法）、原生 History API、CSS Design Tokens。

## Global Constraints

- 本计划只覆盖 `/`、`/cases`、`/cases/:caseSlug`、`/apply`，以及保障这些页面可用所需的共享路由、主题、动效和导航基础；不实现学术挑战、专家策展、美学引擎内容页。
- 第一版核心叙事保持“避雷案例、专家点评、学术挑战”；本闭环只实现其中的案例阅读与申请路径，不新增登录、支付、上传、聊天、人才市场或 B2B 后台。
- 首页 `lithos-surface.webp`、`lithos-inner.webp`、全屏叠层、柔边局部揭示、标题、CTA 和整体构图保持不变；首页主 CTA 仍进入 `/work`，首页到 `/cases` 通过真实导航完成。
- `/work` 的滚动驱动、纵深、中央与相邻卡片关系、模块顺序和空间切换结果保持不变；只允许把现有假导航接到 `/cases`、`/apply`，并补齐 reduced-motion 静态状态。
- 深浅主题必须共享同一 DOM 结构、字号、间距、组件和交互位置，只通过 `assets/design-tokens.css` 的 Semantic/Component Token 切换。
- 内容页面组件不得新增 Hex、RGB、裸圆角、裸阴影或裸动效时长；只消费 Component Token，页面布局只消费 Semantic Token。
- 所有医学人物、病例和证据均显示 `Mock` 或“内容审核中”，并明确“仅供医学教育与病例复盘，不构成个体诊疗建议”。
- 发布目标为 WCAG 2.2 AA：普通文字至少 4.5:1，UI/Focus 至少 3:1，移动触控目标至少 44×44 CSS px，页面唯一 `h1`，所有核心任务可用键盘完成。
- `prefers-reduced-motion: reduce` 时停止粒子、连续指针追踪、视差、深度旋转、自动漂浮和长距离滚动映射；内容必须预先可见。
- 每张页面完成后都必须在 1280×720 和 390×844 下生成 Light/Dark 截图，与已批准预览逐项比对；截图确认不通过时不得开始下一张页面。
- 不修改 `public/assets/lithos-*.webp`、`assets/logo-*.svg`、`docs/previews/direction-*.png`、`docs/previews/dual-theme-case-detail.png`。
- 不新增依赖，不修改 `package.json`、`pnpm-lock.yaml`、Vite/Tailwind/PostCSS/TypeScript 配置。
- 不重构现有 1,724 行 `src/index.css`；新产品页样式集中到 `src/product.css`。正常模式下的首页和 `/work` 视觉回归为零。
- 每个任务按 Red -> Green -> Refactor（只清理本任务产生的重复或未使用代码）执行，并只暂存该任务列出的文件。

## Approved Visual Sources

| 页面/状态 | 唯一视觉依据 |
|---|---|
| 首页正常状态 | 当前 `/` 实现、`docs/previews/direction-a-dark-clinical-archive.png`、`docs/previews/direction-b-medical-archive.png` |
| 避雷案例列表 | 两张方向图中的“避雷案例列表｜桌面/移动”区域 |
| 避雷案例详情 | `docs/previews/dual-theme-case-detail.png`，以及两张方向图中的详情桌面/移动区域 |
| 申请内测 | Task 0 产出的 `docs/previews/first-loop-apply-desktop.png` 与 `docs/previews/first-loop-apply-mobile.png`，必须取得用户明确确认后才可进入 Task 8 |
| 首页移动菜单展开态 | Task 0 产出的 `docs/previews/first-loop-home-mobile-menu.png`，必须取得用户明确确认后才可修改菜单展开 UI |

## Command Prerequisite

所有命令从项目根目录执行：

```bash
cd /Users/eliyah/Documents/理想国
export PATH="/Users/eliyah/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/eliyah/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH"
```

## Exact File Map

### Create

- `docs/previews/first-loop-apply-desktop.png`：申请页 1280×720 编码前预览。
- `docs/previews/first-loop-apply-mobile.png`：申请页 390×844 编码前预览。
- `docs/previews/first-loop-home-mobile-menu.png`：首页移动菜单展开态编码前预览。
- `src/router.ts`：有限路由解析、query 解析和 History API 导航。
- `src/router.test.ts`：路由深链接、未知路由和 query 测试。
- `src/data/cases.ts`：三条脱敏 Mock 案例及详情内容的唯一数据源。
- `src/data/cases.test.ts`：slug 唯一性、详情完整性和延期功能禁入测试。
- `src/theme.tsx`：Light/Dark 全局主题、系统偏好、持久化和切换接口。
- `src/theme.test.tsx`：主题初始化、持久化、DOM 同步测试。
- `src/components/ProductShell.tsx`：内容页共享导航、跳过链接、移动菜单和主题按钮。
- `src/components/ProductShell.test.tsx`：导航语义、当前项、移动菜单和键盘激活测试。
- `src/caseFilters.ts`：案例 query 解析、过滤和稳定 query 序列化。
- `src/caseFilters.test.ts`：组合筛选、无结果、清除和 query 保留测试。
- `src/pages/CasesPage.tsx`：避雷案例列表。
- `src/pages/CasesPage.test.tsx`：列表内容、筛选、真实详情链接和空状态测试。
- `src/pages/CaseDetailPage.tsx`：数据驱动的案例详情模板。
- `src/pages/CaseDetailPage.test.tsx`：标题层级、所有章节、专家点评锚点、返回和申请 CTA 测试。
- `src/applyForm.ts`：申请表单值类型、校验和 query 上下文解析。
- `src/applyForm.test.ts`：必填、联系方式、同意项和上下文测试。
- `src/pages/ApplyPage.tsx`：申请表单与成功状态。
- `src/pages/ApplyPage.test.tsx`：错误关联、无文件输入、有效提交和成功状态测试。
- `src/motion.ts`：可复用的 motion preference 订阅 Hook。
- `src/motion.test.tsx`：媒体查询初值和运行时变化测试。
- `src/product.css`：共享内容页、导航、列表、详情、表单、响应式和 reduced-motion 样式。
- `docs/superpowers/evidence/2026-06-20-first-product-loop/README.md`：视觉比对、键盘、移动端和命令证据索引。
- `docs/superpowers/evidence/2026-06-20-first-product-loop/*.png`：四张页面的 Light/Dark × 桌面/移动运行时截图，文件名在各页面任务中固定。

### Modify

- `src/main.tsx:1-10`：引入 Token/Product CSS，并用 `ThemeProvider` 包裹 `App`。
- `src/App.tsx:1-36`：从二路由条件改为有限路由分发；保留 `/work`。
- `src/App.test.tsx:1-220`：保留全部首页和 `/work` 回归，增加闭环集成测试。
- `src/HomePage.tsx:13-225`：使用全局主题、真实导航和已批准移动菜单；不改双图或构图。
- `src/RevealLayer.tsx:1-60`：normal 模式保留视觉结果，reduce 模式改为稳定静态揭示并停止逐帧序列化。
- `src/ProductGallery.tsx:1-235`：真实导航接线；reduce 模式停止滚动映射与指针 RAF，展示可直接选择的稳定状态。
- `src/ParticleField.tsx:1-155`：reduce/页面隐藏/触控设备时不启动 Canvas RAF。

### Explicitly Unchanged

- `src/index.css`
- `src/galleryContent.ts`
- `src/heroConfig.ts`
- `src/heroConfig.test.ts`
- `package.json`
- `pnpm-lock.yaml`
- `public/assets/*`
- `assets/design-tokens.json`
- `assets/design-tokens.css`

---

### Task 0: Visual Approval Gate and Clean Baseline

**输入**

- `docs/previews/direction-a-dark-clinical-archive.png`
- `docs/previews/direction-b-medical-archive.png`
- `docs/previews/dual-theme-case-detail.png`
- `docs/brand-guidelines.md`
- `assets/design-tokens.css`
- `docs/component-specs.md`
- 现有 `/` 移动导航按钮

**输出**

- Create: `docs/previews/first-loop-apply-desktop.png`
- Create: `docs/previews/first-loop-apply-mobile.png`
- Create: `docs/previews/first-loop-home-mobile-menu.png`
- 用户对三张图的明确批准记录
- 页面源码零修改的 Git 证据

**依赖**

- 无；这是所有代码任务的阻断式前置条件。

**测试**

- 申请页预览必须只含身份、专科/方向、联系方式、参与模块、参与动机、隐私与联系同意、提交动作；不得出现文件上传、账号、支付或聊天。
- 首页移动菜单必须保持当前首页构图，展开后提供首页、避雷案例、学术挑战、专家策展、美学引擎、申请内测；不得移动双图、标题和主 CTA。
- 桌面申请页使用 1280×720；移动申请页和首页菜单使用 390×844。

**验证命令**

```bash
test -f docs/previews/first-loop-apply-desktop.png
test -f docs/previews/first-loop-apply-mobile.png
test -f docs/previews/first-loop-home-mobile-menu.png
git diff --exit-code -- src public index.html package.json pnpm-lock.yaml
```

**预期结果**

- 三个 `test -f` 均以状态码 0 结束。
- `git diff --exit-code` 无输出且状态码为 0。
- 用户明确回复批准后才允许开始 Task 1；未批准时只迭代预览，不修改源码。

- [ ] **Step 1:** 按批准的 Light/Dark Token 和表单组件规格生成三张预览，不创建页面代码。
- [ ] **Step 2:** 执行上述文件和源码零差异命令。
- [ ] **Step 3:** 展示三张预览并等待用户明确确认。

---

### Task 1: Finite Route Contract

**输入**

- `docs/product/ia-v1.md` 中 `/`、`/work`、`/cases`、`/cases/:caseSlug`、`/apply` 的稳定 URL。
- 当前 `src/App.tsx` 使用 `window.history.pushState` 的模式。

**输出**

- Create: `src/router.ts`
- Create: `src/router.test.ts`
- 只识别闭环和既有 `/work` 的类型安全路由；未知路径返回 `not-found`。

**依赖**

- Task 0 已批准。

**接口**

```ts
export type ApplyQuery = {
  source: string | null;
  type: string | null;
  caseSlug: string | null;
  status: 'success' | null;
};

export type AppRoute =
  | { name: 'home' }
  | { name: 'work' }
  | { name: 'cases'; search: string }
  | { name: 'case-detail'; caseSlug: string }
  | { name: 'apply'; query: ApplyQuery }
  | { name: 'not-found' };

export function parseRoute(pathname: string, search?: string): AppRoute;
export function navigate(to: string): void;
```

**测试**

- 根路径和 `/work` 保持现状。
- `/cases?department=急诊医学` 保留原 search。
- `/cases/acute-aortic-dissection-triage` 返回精确 slug。
- `/apply?source=case-detail&type=contributor&case=acute-aortic-dissection-triage` 解析为明确字段。
- 未批准路由（例如 `/challenges`、`/login`、`/upload`）返回 `not-found`，不会默认为首页。

**验证命令**

```bash
pnpm test -- src/router.test.ts
```

**预期结果**

- Red：`src/router.ts` 不存在，测试文件无法解析该模块。
- Green：路由测试文件全部通过；未知路由均为 `not-found`；`navigate` 只产生一次 `pushState` 和一次 `popstate`。

- [ ] **Step 1: Write the failing route tests**

```ts
import { describe, expect, it, vi } from 'vitest';
import { navigate, parseRoute } from './router';

describe('parseRoute', () => {
  it.each([
    ['/', '', { name: 'home' }],
    ['/work', '', { name: 'work' }],
    ['/cases', '?department=急诊医学', { name: 'cases', search: '?department=急诊医学' }],
    ['/cases/acute-aortic-dissection-triage', '', {
      name: 'case-detail', caseSlug: 'acute-aortic-dissection-triage',
    }],
  ])('parses %s', (pathname, search, expected) => {
    expect(parseRoute(pathname, search)).toEqual(expected);
  });

  it('parses approved apply context', () => {
    expect(parseRoute('/apply', '?source=case-detail&type=contributor&case=acute-aortic-dissection-triage'))
      .toEqual({
        name: 'apply',
        query: {
          source: 'case-detail',
          type: 'contributor',
          caseSlug: 'acute-aortic-dissection-triage',
          status: null,
        },
      });
  });

  it.each(['/challenges', '/login', '/upload'])('rejects out-of-scope route %s', (path) => {
    expect(parseRoute(path)).toEqual({ name: 'not-found' });
  });

  it('pushes a real URL and emits one popstate event', () => {
    const pushState = vi.spyOn(window.history, 'pushState');
    const listener = vi.fn();
    window.addEventListener('popstate', listener);
    navigate('/cases');
    expect(pushState).toHaveBeenCalledWith(null, '', '/cases');
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener('popstate', listener);
  });
});
```

- [ ] **Step 2: Run the focused test and verify Red**

```bash
pnpm test -- src/router.test.ts
```

Expected: FAIL because `src/router.ts` does not exist.

- [ ] **Step 3: Implement only the route contract**

`parseRoute` must normalize a trailing slash, decode the single case slug, parse only the four approved apply keys, and never inspect hash fragments. `navigate` must call `pushState(null, '', to)` and dispatch one `PopStateEvent('popstate')`; it must not own React state.

- [ ] **Step 4: Run the focused test and verify Green**

```bash
pnpm test -- src/router.test.ts
```

Expected: one test file passes; all route cases pass.

- [ ] **Step 5: Commit the isolated contract**

```bash
git add src/router.ts src/router.test.ts
git commit -m "test: define first loop route contract"
```

---

### Task 2: Case Data Contract

**输入**

- `docs/product/ia-v1.md` 的三条案例清单、专家 Mock 身份和详情字段。
- `docs/component-specs.md` 的案例卡、风险标签、专家面板、决策时间线结构。

**输出**

- Create: `src/data/cases.ts`
- Create: `src/data/cases.test.ts`
- 三条可列表、可深链接的脱敏 Mock 案例；每条拥有详情页所需完整字段。

**依赖**

- Task 1 的 case slug 路由。

**接口**

```ts
export type RiskLevel = '高风险' | '中风险';

export type CaseRecord = {
  id: 'case-001' | 'case-002' | 'case-003';
  slug: string;
  title: string;
  summary: string;
  department: '急诊医学' | '外科 / 感染' | '内科';
  riskType: '分诊与鉴别偏差' | '过度处置' | '治疗节奏与监测';
  riskLevel: RiskLevel;
  difficulty: '基础' | '进阶';
  readingMinutes: number;
  reviewStatus: 'Mock · 内容审核中';
  background: string;
  decisions: Array<{ id: string; title: string; detail: string }>;
  wrongPath: string;
  correctedReview: string;
  expert: { name: string; specialty: string; comment: string };
  evidence: string[];
  principles: string[];
};

export const cases: readonly CaseRecord[];
export function getCaseBySlug(slug: string): CaseRecord | undefined;
```

**测试**

- 恰好三条记录；id/slug 唯一。
- 固定标题、科室、风险类型、难度和专家姓名与 IA 一致。
- 每条包含 3–5 个决策节点、2–4 条证据、3 条原则和明确 Mock 状态。
- 所有记录不含登录、支付、上传、聊天、人才市场、AI 诊断文案。

**验证命令**

```bash
pnpm test -- src/data/cases.test.ts
```

**预期结果**

- Red：`src/data/cases.ts` 不存在，测试无法导入数据模块。
- Green：三条记录、三个唯一 slug、全部详情结构、Mock 标记及延期功能禁入断言全部通过。

- [ ] **Step 1: Write the failing data tests**

```ts
import { describe, expect, it } from 'vitest';
import { cases, getCaseBySlug } from './cases';

describe('case records', () => {
  it('contains three unique, deep-linkable mock cases', () => {
    expect(cases).toHaveLength(3);
    expect(new Set(cases.map(({ id }) => id)).size).toBe(3);
    expect(new Set(cases.map(({ slug }) => slug)).size).toBe(3);
    expect(cases.every(({ reviewStatus }) => reviewStatus === 'Mock · 内容审核中')).toBe(true);
  });

  it('keeps every detail page structurally complete', () => {
    for (const record of cases) {
      expect(record.decisions.length).toBeGreaterThanOrEqual(3);
      expect(record.decisions.length).toBeLessThanOrEqual(5);
      expect(record.evidence.length).toBeGreaterThanOrEqual(2);
      expect(record.evidence.length).toBeLessThanOrEqual(4);
      expect(record.principles).toHaveLength(3);
      expect(record.expert.name).toContain('Mock');
    }
  });

  it('returns the representative acute aortic dissection case', () => {
    expect(getCaseBySlug('acute-aortic-dissection-triage')?.title)
      .toBe('急诊胸痛中的夹层警讯为何被忽略');
  });

  it('contains no deferred feature language', () => {
    const serialized = JSON.stringify(cases);
    for (const forbidden of ['登录', '支付', '上传', '聊天', '人才市场', '一键诊断']) {
      expect(serialized).not.toContain(forbidden);
    }
  });
});
```

- [ ] **Step 2: Run the focused test and verify Red**

```bash
pnpm test -- src/data/cases.test.ts
```

Expected: FAIL because the case data module does not exist.

- [ ] **Step 3: Add the three exact records**

Use these immutable identifiers and display values:

| id | slug | title | department | riskType | riskLevel | difficulty | expert |
|---|---|---|---|---|---|---|---|
| case-001 | acute-aortic-dissection-triage | 急诊胸痛中的夹层警讯为何被忽略 | 急诊医学 | 分诊与鉴别偏差 | 高风险 | 进阶 | 周衡（Mock） |
| case-002 | postoperative-fever-antibiotics | 术后发热为何不应直接升级抗生素 | 外科 / 感染 | 过度处置 | 中风险 | 基础 | 林弈（Mock） |
| case-003 | hyponatremia-correction-risk | 低钠纠正速度被低估的神经风险 | 内科 | 治疗节奏与监测 | 高风险 | 进阶 | 陈序（Mock） |

Use the following exact content contract; every displayed evidence item is suffixed `（Mock · 待编辑审核）` unless it is the named guideline title:

**case-001**

- `summary`: `初始分诊将高风险胸痛归入常见胸痛路径，关键鉴别信号未被同步验证。`
- `readingMinutes`: `8`
- `background`: `一名突发胸痛患者进入急诊。首轮记录聚焦疼痛评分与心电图，未同时完成主动脉夹层风险信号核对。本案例为脱敏 Mock，仅用于医学教育与病例复盘。`
- decisions: `01 胸痛性质｜忽略撕裂样胸痛及向背部放射的关键特征。`；`02 双上肢血压差｜未进行双上肢血压测量，错过重要鉴别线索。`；`03 影像时机｜未优先启动主动脉 CTA，延误进一步确认。`
- `wrongPath`: `将高风险胸痛过早归入非特异性胸痛，未触发主动脉夹层风险流程。`
- `correctedReview`: `识别典型疼痛特征与血压差线索，先完成高风险分层，再按流程安排影像确认。`
- expert: `周衡（Mock）` / `急诊医学` / `真正危险的不是缺少检查，而是把最初分类当成结论。`
- evidence: `2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease`；`急诊高风险胸痛分层专家共识（Mock · 待编辑审核）`；`主动脉夹层早期识别病例复盘（Mock · 待编辑审核）`
- principles: `高风险信号优先识别。`；`分流流程优先于检查顺序。`；`初始分类必须允许被新证据修正。`

**case-002**

- `summary`: `术后发热出现后直接升级抗菌药，缺少时间窗、感染证据和非感染原因的分层。`
- `readingMinutes`: `6`
- `background`: `一名术后患者在早期恢复阶段出现发热。处置讨论直接进入抗菌药升级，未先核对时间窗、症状组合和感染证据。本案例为脱敏 Mock，仅用于医学教育与病例复盘。`
- decisions: `01 发热时间窗｜未区分术后早期炎症反应与感染证据。`；`02 感染来源｜未先完成症状、体征与基础检查的来源核对。`；`03 用药升级｜在证据不足时扩大抗菌覆盖范围。`
- `wrongPath`: `把单一体温升高直接等同于感染进展，以升级用药替代病因分层。`
- `correctedReview`: `先按术后时间窗和症状组合评估，寻找感染来源及非感染原因，再决定是否调整抗菌方案。`
- expert: `林弈（Mock）` / `感染与围术期管理` / `处置强度应跟随证据变化，而不是跟随焦虑升级。`
- evidence: `WHO Global Guidelines for the Prevention of Surgical Site Infection`；`术后发热评估路径（Mock · 待编辑审核）`；`围术期抗菌药管理病例复盘（Mock · 待编辑审核）`
- principles: `先确定时间窗。`；`先寻找感染来源。`；`用药强度必须对应证据强度。`

**case-003**

- `summary`: `低钠纠正过程中只关注目标值，未同步管理纠正速度、监测频率和神经风险。`
- `readingMinutes`: `7`
- `background`: `一名低钠患者开始纠正治疗。团队持续关注血钠目标值，但对起始风险、累计纠正速度和复测频率记录不足。本案例为脱敏 Mock，仅用于医学教育与病例复盘。`
- decisions: `01 起始风险｜未完整记录低钠持续时间和神经系统风险背景。`；`02 纠正速度｜只记录目标值，未同步追踪单位时间内变化。`；`03 监测节奏｜复测间隔不足以支持及时调整纠正策略。`
- `wrongPath`: `把达到目标值作为唯一成功标准，低估过快纠正带来的神经风险。`
- `correctedReview`: `先完成起始风险分层，设定纠正上限与复测节奏，根据累计变化及时调整。`
- expert: `陈序（Mock）` / `内科` / `安全不只取决于终点数值，也取决于抵达终点的速度。`
- evidence: `European Clinical Practice Guideline on Diagnosis and Treatment of Hyponatraemia`；`低钠纠正速度监测路径（Mock · 待编辑审核）`；`电解质治疗安全病例复盘（Mock · 待编辑审核）`
- principles: `先评估起始风险。`；`同时记录数值与速度。`；`监测频率必须支持及时纠偏。`

Do not add diagnosis, patient instruction, real identity, real institution or reviewed-publication claims beyond this contract.

- [ ] **Step 4: Run the focused test and verify Green**

```bash
pnpm test -- src/data/cases.test.ts
```

Expected: all case invariants pass.

- [ ] **Step 5: Commit the data slice**

```bash
git add src/data/cases.ts src/data/cases.test.ts
git commit -m "feat: add first loop mock case records"
```

---

### Task 3: Global Theme and Token Bootstrap

**输入**

- `assets/design-tokens.css`
- `docs/brand-guidelines.md`
- 当前 `HomePage` 局部 `useState<Theme>`。

**输出**

- Create: `src/theme.tsx`
- Create: `src/theme.test.tsx`
- Create: `src/product.css`（只含产品页全局滚动基线和 Token 消费规则）
- Modify: `src/main.tsx:1-10`
- 一个跨路由持久化、遵循系统偏好的 Light/Dark 主题来源。

**依赖**

- Task 1；页面路由尚不接入。

**接口**

```ts
export type Theme = 'light' | 'dark';
export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element;
export function useTheme(): { theme: Theme; toggleTheme: () => void };
```

**测试**

- `localStorage['med-utopia-theme']` 优先于系统偏好。
- 无持久值时读取 `(prefers-color-scheme: dark)`；无匹配时默认 light。
- 主题改变同步到 `document.documentElement.dataset.theme` 和 `colorScheme`。
- `toggleTheme` 只在 light/dark 间切换并写入持久化。

**验证命令**

```bash
pnpm test -- src/theme.test.tsx
pnpm build
```

**预期结果**

- Red：ThemeProvider 模块不存在。
- Green：主题初始化、切换、持久化和 DOM 同步测试全部通过；生产构建通过。

- [ ] **Step 1: Write failing provider tests**

```tsx
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme } from './theme';

function Probe() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme}</button>;
}

it('prefers persisted theme and synchronizes the document', () => {
  localStorage.setItem('med-utopia-theme', 'dark');
  const host = document.createElement('div');
  const root = createRoot(host);
  act(() => root.render(<ThemeProvider><Probe /></ThemeProvider>));
  expect(host.textContent).toBe('dark');
  expect(document.documentElement.dataset.theme).toBe('dark');
  act(() => host.querySelector('button')?.click());
  expect(localStorage.getItem('med-utopia-theme')).toBe('light');
  act(() => root.unmount());
});
```

- [ ] **Step 2: Run and verify Red**

```bash
pnpm test -- src/theme.test.tsx
```

Expected: FAIL because the provider does not exist.

- [ ] **Step 3: Implement provider and bootstrap imports**

`src/main.tsx` import order must be:

```tsx
import '../assets/design-tokens.css';
import './index.css';
import './product.css';
```

Wrap `<App />` with `<ThemeProvider>`. In `product.css`, add only `.product-scroll-page` overflow reset, `.product-app` background/foreground/font declarations, and global `:focus-visible`/skip-link rules using Token variables; do not style individual pages yet.

- [ ] **Step 4: Run and verify Green**

```bash
pnpm test -- src/theme.test.tsx
pnpm build
```

Expected: theme tests pass; TypeScript and production build pass.

- [ ] **Step 5: Commit**

```bash
git add src/theme.tsx src/theme.test.tsx src/product.css src/main.tsx
git commit -m "feat: add product-level theme tokens"
```

---

### Task 4: Product Shell and Real Home Navigation

**输入**

- Task 1 `navigate()`。
- Task 3 `useTheme()`。
- `docs/product/ia-v1.md` 顶部导航映射。
- Task 0 已批准首页移动菜单展开态。

**输出**

- Create: `src/components/ProductShell.tsx`
- Create: `src/components/ProductShell.test.tsx`
- Modify: `src/App.tsx:1-36`
- Modify: `src/HomePage.tsx:13-225`
- Modify: `src/App.test.tsx:1-220`
- 内容页共享壳层；首页桌面/移动导航拥有真实 URL；首页主 CTA 仍进入 `/work`。

**依赖**

- Tasks 0, 1, 3。

**接口**

```ts
export type ProductShellProps = {
  currentPath: string;
  children: React.ReactNode;
};

export function ProductShell(props: ProductShellProps): JSX.Element;
```

`ProductShell` navigation exact destinations:

```ts
const productLinks = [
  ['首页', '/'],
  ['避雷案例', '/cases'],
  ['学术挑战', '/challenges'],
  ['专家策展', '/curators'],
  ['美学引擎', '/aesthetic-engine'],
] as const;
```

Only `/` and `/cases` are active in this plan. Out-of-scope destinations remain visible because they are approved top-level navigation, but `App` renders a clear not-available state instead of fabricating those pages. The apply CTA always points to `/apply?source=global`.

**测试**

- Shared nav uses `<nav aria-label="主导航">` and real `<a href>`.
- Active path uses `aria-current="page"`.
- Mobile menu button uses Chinese label, `aria-expanded`, `aria-controls`; Escape closes it and restores focus.
- Theme control remains 44×44 and uses `useTheme`.
- Home `避雷案例` goes to `/cases`; `申请内测` goes to `/apply?source=home`; `进入理想国` stays `/work`.
- Existing home reveal and all `/work` regression assertions remain green.

**验证命令**

```bash
pnpm test -- src/components/ProductShell.test.tsx src/App.test.tsx
pnpm build
git diff --exit-code -- public/assets/lithos-surface.webp public/assets/lithos-inner.webp src/heroConfig.ts src/heroConfig.test.ts
```

**预期结果**

- Red：共享壳层不存在，首页导航仍是无行为控件。
- Green：壳层与 App 回归测试通过；构建通过；四个锁定文件无差异。

- [ ] **Step 1: Add failing shell and integration tests**

```tsx
it('exposes real product links and current page state', () => {
  renderShell('/cases');
  const nav = host.querySelector('nav[aria-label="主导航"]');
  expect(nav?.querySelector('a[href="/cases"]')?.getAttribute('aria-current')).toBe('page');
  expect(nav?.querySelector('a[href="/apply?source=global"]')).not.toBeNull();
});

it('navigates from the locked homepage to the case list without changing the hero CTA', () => {
  renderApp('/');
  expect(container.querySelector('a[href="/cases"]')?.textContent).toContain('避雷案例');
  expect(Array.from(container.querySelectorAll('button')).some((node) =>
    node.textContent?.includes('进入理想国'))).toBe(true);
});
```

- [ ] **Step 2: Run and verify Red**

```bash
pnpm test -- src/components/ProductShell.test.tsx src/App.test.tsx
```

Expected: FAIL because ProductShell does not exist and homepage nav is still non-functional buttons.

- [ ] **Step 3: Implement the shell and route dispatcher minimally**

- `App` stores the result of `parseRoute(window.location.pathname, window.location.search)` and refreshes it on `popstate`.
- `/work` still renders the same `ProductGallery` component.
- Home nav anchors call `preventDefault()` then `navigate(href)` only for same-origin internal destinations.
- Do not change hero image nodes, overlay nodes, copy, classes or reveal props.
- The mobile menu markup and styling must match Task 0 preview exactly.

- [ ] **Step 4: Run and verify Green**

```bash
pnpm test -- src/components/ProductShell.test.tsx src/App.test.tsx
pnpm build
```

Expected: shell tests pass; all existing homepage and `/work` tests still pass; build passes.

- [ ] **Step 5: Verify no locked asset changed**

```bash
git diff --exit-code -- public/assets/lithos-surface.webp public/assets/lithos-inner.webp src/heroConfig.ts src/heroConfig.test.ts
```

Expected: no output, status code 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProductShell.tsx src/components/ProductShell.test.tsx src/App.tsx src/App.test.tsx src/HomePage.tsx src/product.css
git commit -m "feat: connect real first loop navigation"
```

---

### Task 5: Stable Case Filters

**输入**

- Task 2 `CaseRecord[]`。
- IA filters：department、risk、difficulty。

**输出**

- Create: `src/caseFilters.ts`
- Create: `src/caseFilters.test.ts`
- 纯函数 query 解析、过滤和 URL 生成。

**依赖**

- Task 2。

**接口**

```ts
export type CaseFilters = {
  department: string;
  risk: string;
  difficulty: string;
};

export function parseCaseFilters(search: string): CaseFilters;
export function filterCases(records: readonly CaseRecord[], filters: CaseFilters): CaseRecord[];
export function buildCaseSearch(filters: CaseFilters): string;
```

**测试**

- 空 query 返回三个空字符串。
- 单筛选和组合筛选返回确定结果。
- 无效枚举被清除，不进入 URL。
- query 顺序固定为 department -> risk -> difficulty；清除全部返回空字符串。

**验证命令**

```bash
pnpm test -- src/caseFilters.test.ts
```

**预期结果**

- Red：过滤模块不存在。
- Green：单筛选、组合筛选、无效枚举、无结果和稳定序列化测试全部通过。

- [ ] **Step 1: Write failing pure-function tests**

```ts
it('filters by all approved dimensions and serializes deterministically', () => {
  const filters = parseCaseFilters('?difficulty=进阶&department=急诊医学&risk=分诊与鉴别偏差');
  expect(filterCases(cases, filters).map(({ id }) => id)).toEqual(['case-001']);
  expect(buildCaseSearch(filters))
    .toBe('?department=%E6%80%A5%E8%AF%8A%E5%8C%BB%E5%AD%A6&risk=%E5%88%86%E8%AF%8A%E4%B8%8E%E9%89%B4%E5%88%AB%E5%81%8F%E5%B7%AE&difficulty=%E8%BF%9B%E9%98%B6');
});
```

- [ ] **Step 2: Run and verify Red**

```bash
pnpm test -- src/caseFilters.test.ts
```

Expected: FAIL because filter functions do not exist.

- [ ] **Step 3: Implement exact enum validation and filtering**

Use only enums already present in `cases`; do not add free-text search, sorting, pagination or saved filters.

- [ ] **Step 4: Run and verify Green**

```bash
pnpm test -- src/caseFilters.test.ts
```

Expected: all filter cases pass.

- [ ] **Step 5: Commit**

```bash
git add src/caseFilters.ts src/caseFilters.test.ts
git commit -m "feat: add stable case URL filters"
```

---

### Task 6: Cases List Page

**输入**

- Task 2 case records。
- Task 5 filter functions。
- Task 4 ProductShell。
- Approved list regions in Direction A/B previews。

**输出**

- Create: `src/pages/CasesPage.tsx`
- Create: `src/pages/CasesPage.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/product.css`
- 三条可筛选、可聚焦、可深链接的案例档案行。

**依赖**

- Tasks 2, 4, 5。

**接口**

```ts
export function CasesPage({ search }: { search: string }): JSX.Element;
```

**测试**

- 唯一 `h1` 为“避雷案例”。
- 初始展示 3 条；每条含标题、科室、风险类型、难度、风险文字和“查看完整复盘”。
- 每个详情链接为 `/cases/:slug`；不存在嵌套按钮。
- 原生 select 改变后调用 `navigate('/cases?...')`；结果数有 `aria-live="polite"`。
- 无结果解释原因并提供“清除筛选”。
- 无登录、上传、支付或社交控件。

**验证命令**

```bash
pnpm test -- src/pages/CasesPage.test.tsx src/App.test.tsx
node scripts/validate-design-tokens.mjs
pnpm build
```

**预期结果**

- Red：`/cases` 没有页面实现，页面测试找不到列表、筛选器和详情链接。
- Green：页面与回归测试通过；Token 校验和构建通过；四张运行时截图获得确认。

- [ ] **Step 1: Write failing page tests**

```tsx
it('renders three real case links and an accessible result count', () => {
  renderPage('');
  expect(host.querySelectorAll('article[data-case-id]')).toHaveLength(3);
  expect(host.querySelector('h1')?.textContent).toBe('避雷案例');
  expect(host.querySelector('a[href="/cases/acute-aortic-dissection-triage"]')).not.toBeNull();
  expect(host.querySelector('[aria-live="polite"]')?.textContent).toContain('共 3 条');
});

it('renders a recoverable empty state', () => {
  renderPage('?department=急诊医学&difficulty=基础');
  expect(host.textContent).toContain('当前筛选条件下没有案例');
  expect(Array.from(host.querySelectorAll('button')).some((button) =>
    button.textContent === '清除筛选')).toBe(true);
});
```

- [ ] **Step 2: Run and verify Red**

```bash
pnpm test -- src/pages/CasesPage.test.tsx src/App.test.tsx
```

Expected: FAIL because `/cases` has no page implementation.

- [ ] **Step 3: Implement semantic page markup**

Required DOM order:

```text
ProductShell
  skip link -> #main-content
  main#main-content
    h1 避雷案例
    educational disclaimer
    filter fieldset with three labeled native selects
    result count live region
    case list
      article -> one covering anchor
    recoverable empty state
```

- [ ] **Step 4: Add page CSS using tokens only**

Use `--color-*`, `--case-card-*`, `--risk-tag-*`, `--filter-*`, `--typography-*`, `--spacing-*`, `--radius-*` variables. Desktop uses the approved archive-row table composition; at max-width 767px it becomes one-column cards without reducing body below 16px or labels below 14px.

- [ ] **Step 5: Run and verify Green**

```bash
pnpm test -- src/pages/CasesPage.test.tsx src/App.test.tsx
node scripts/validate-design-tokens.mjs
pnpm build
```

Expected: page tests pass; token validator reports all checks passed; build passes.

- [ ] **Step 6: Capture and compare runtime screenshots**

Create exactly:

```text
docs/superpowers/evidence/2026-06-20-first-product-loop/cases-desktop-light.png
docs/superpowers/evidence/2026-06-20-first-product-loop/cases-desktop-dark.png
docs/superpowers/evidence/2026-06-20-first-product-loop/cases-mobile-light.png
docs/superpowers/evidence/2026-06-20-first-product-loop/cases-mobile-dark.png
```

Run:

```bash
pnpm dev
```

Open `http://127.0.0.1:5173/cases` in the in-app browser at 1280×720 and 390×844. Compare header, typography, archive rows/cards, dividers, risk labels, spacing and responsive order against both approved direction boards. Expected: no overlap, horizontal scroll, clipped focus ring, raw color drift or unapproved visual treatment. Stop here for user confirmation before Task 7.

- [ ] **Step 7: Commit after screenshot approval**

```bash
git add src/pages/CasesPage.tsx src/pages/CasesPage.test.tsx src/App.tsx src/product.css docs/superpowers/evidence/2026-06-20-first-product-loop/cases-*.png
git commit -m "feat: add accessible case list"
```

---

### Task 7: Case Detail Page

**输入**

- Task 2 `getCaseBySlug`。
- Task 4 ProductShell。
- `docs/previews/dual-theme-case-detail.png`。

**输出**

- Create: `src/pages/CaseDetailPage.tsx`
- Create: `src/pages/CaseDetailPage.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/product.css`
- 数据驱动的三条详情路由；代表性闭环使用 `acute-aortic-dissection-triage`。

**依赖**

- Tasks 2, 4, 6；案例列表截图已确认。

**接口**

```ts
export function CaseDetailPage({ caseSlug }: { caseSlug: string }): JSX.Element;
```

**测试**

- 只有一个 `h1`，标题来自记录。
- DOM 中按顺序存在 `decision-path`、`wrong-path`、`corrected-review`、`expert-commentary`、`evidence`、`principles`。
- 决策节点为 `<ol>`；专家点评显示姓名、专科、Mock 状态。
- “返回案例列表”链接为 `/cases`。
- “申请参与内容共建”链接为 `/apply?source=case-detail&type=contributor&case=:slug`。
- 未知 slug 显示“案例未找到”和 `/cases` 恢复链接，不跳回首页。

**验证命令**

```bash
pnpm test -- src/pages/CaseDetailPage.test.tsx src/App.test.tsx
node --test scripts/validate-design-tokens.node.mjs
node scripts/validate-design-tokens.mjs
pnpm build
```

**预期结果**

- Red：详情组件不存在，详情章节、CTA 和 not-found 断言失败。
- Green：详情与回归测试通过；Token 测试 3/3；校验和构建通过；四张运行时截图获得确认。

- [ ] **Step 1: Write failing detail tests**

```tsx
it('renders the complete representative case and apply route', () => {
  renderDetail('acute-aortic-dissection-triage');
  expect(host.querySelectorAll('h1')).toHaveLength(1);
  expect(host.querySelector('h1')?.textContent).toContain('急诊胸痛中的夹层警讯为何被忽略');
  for (const id of ['decision-path', 'wrong-path', 'corrected-review', 'expert-commentary', 'evidence', 'principles']) {
    expect(host.querySelector(`#${id}`)).not.toBeNull();
  }
  expect(host.querySelector('#decision-path ol')).not.toBeNull();
  expect(host.querySelector('a[href="/apply?source=case-detail&type=contributor&case=acute-aortic-dissection-triage"]')).not.toBeNull();
});

it('renders a recoverable not-found state', () => {
  renderDetail('missing-case');
  expect(host.textContent).toContain('案例未找到');
  expect(host.querySelector('a[href="/cases"]')).not.toBeNull();
});
```

- [ ] **Step 2: Run and verify Red**

```bash
pnpm test -- src/pages/CaseDetailPage.test.tsx src/App.test.tsx
```

Expected: FAIL because the detail page does not exist.

- [ ] **Step 3: Implement the approved information hierarchy**

Desktop order and columns must match the approved dual-theme preview: header/meta -> left decision timeline -> center wrong path/corrected review/evidence/principles -> right expert panel -> bottom apply CTA. Mobile order must be title/meta -> timeline -> wrong path -> corrected review -> evidence -> principles -> expert panel -> apply CTA.

- [ ] **Step 4: Add detail CSS using only tokens**

Use article serif only for the case `h1`; body, nav, metadata and controls use body sans. Expert panel uses `--expert-panel-*`; timeline uses `--decision-timeline-*`; risk label uses `--risk-tag-*`. No sticky panel on 390px, no horizontal timeline, no content hidden behind animation.

- [ ] **Step 5: Run and verify Green**

```bash
pnpm test -- src/pages/CaseDetailPage.test.tsx src/App.test.tsx
node --test scripts/validate-design-tokens.node.mjs
node scripts/validate-design-tokens.mjs
pnpm build
```

Expected: focused and regression tests pass; 3/3 Token tests pass; validator and build pass.

- [ ] **Step 6: Capture and compare runtime screenshots**

Create exactly:

```text
docs/superpowers/evidence/2026-06-20-first-product-loop/case-detail-desktop-light.png
docs/superpowers/evidence/2026-06-20-first-product-loop/case-detail-desktop-dark.png
docs/superpowers/evidence/2026-06-20-first-product-loop/case-detail-mobile-light.png
docs/superpowers/evidence/2026-06-20-first-product-loop/case-detail-mobile-dark.png
```

Open `http://127.0.0.1:5173/cases/acute-aortic-dissection-triage` at both target viewports and compare against `dual-theme-case-detail.png`. Expected: information order, three-column desktop hierarchy, single-column mobile order, serif title, teal decision line, risk tag and expert panel match the approved source without overlap or invented decoration. Stop for user confirmation.

- [ ] **Step 7: Commit after screenshot approval**

```bash
git add src/pages/CaseDetailPage.tsx src/pages/CaseDetailPage.test.tsx src/App.tsx src/product.css docs/superpowers/evidence/2026-06-20-first-product-loop/case-detail-*.png
git commit -m "feat: add case detail reading path"
```

---

### Task 8: Apply Form Contract

**输入**

- IA section 8.5 的字段和 system query。
- Brand language and form component specification。

**输出**

- Create: `src/applyForm.ts`
- Create: `src/applyForm.test.ts`
- 无网络副作用的纯校验和上下文解析。

**依赖**

- Task 0 申请页预览已批准；Task 1 ApplyQuery。

**接口**

```ts
export type ApplyValues = {
  identity: string;
  specialty: string;
  contact: string;
  modules: string[];
  motivation: string;
  consent: boolean;
};

export type ApplyErrors = Partial<Record<keyof ApplyValues, string>>;
export function validateApply(values: ApplyValues): ApplyErrors;
export function getApplyContext(search: string): {
  source: string | null;
  type: string | null;
  caseSlug: string | null;
};
```

**测试**

- 所有字段为空时返回六个明确中文错误。
- 联系方式 trim 后少于 5 个字符返回“请输入可联系到你的邮箱、微信或手机号”。
- 至少选择一个模块；必须勾选同意。
- 合法值返回空对象。
- query 只读取 source/type/case，不读取文件或医学内容。

**验证命令**

```bash
pnpm test -- src/applyForm.test.ts
```

**预期结果**

- Red：申请校验模块不存在。
- Green：六项必填错误、联系方式、合法数据和来源 query 测试全部通过。

- [ ] **Step 1: Write failing validator tests**

```ts
it('returns exact errors for an empty application', () => {
  expect(validateApply({
    identity: '', specialty: '', contact: '', modules: [], motivation: '', consent: false,
  })).toEqual({
    identity: '请选择你的身份',
    specialty: '请输入专科或关注方向',
    contact: '请输入可联系到你的邮箱、微信或手机号',
    modules: '请至少选择一个希望参与的模块',
    motivation: '请简要说明参与动机',
    consent: '请确认同意我们就内测事宜与你联系',
  });
});

it('accepts a complete non-file application', () => {
  expect(validateApply({
    identity: '临床医生',
    specialty: '急诊医学',
    contact: 'doctor@example.com',
    modules: ['避雷案例'],
    motivation: '希望参与病例复盘内容校准。',
    consent: true,
  })).toEqual({});
});
```

- [ ] **Step 2: Run and verify Red**

```bash
pnpm test -- src/applyForm.test.ts
```

Expected: FAIL because the validator does not exist.

- [ ] **Step 3: Implement pure validation only**

Do not add API client, storage, authentication, file serialization, analytics, retry or queue abstractions.

- [ ] **Step 4: Run and verify Green**

```bash
pnpm test -- src/applyForm.test.ts
```

Expected: exact errors and valid case pass.

- [ ] **Step 5: Commit**

```bash
git add src/applyForm.ts src/applyForm.test.ts
git commit -m "feat: define lightweight application contract"
```

---

### Task 9: Apply Page and Success State

**输入**

- Task 0 approved apply previews。
- Task 4 ProductShell。
- Task 8 validator。
- Task 1 `navigate()` and apply query。

**输出**

- Create: `src/pages/ApplyPage.tsx`
- Create: `src/pages/ApplyPage.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/product.css`
- 无需账号、无文件上传的申请表单和 `/apply?status=success` 状态。

**依赖**

- Tasks 0, 4, 8；案例详情截图已确认。

**接口**

```ts
export function ApplyPage({ search }: { search: string }): JSX.Element;
```

**测试**

- 唯一 `h1`；上下文来自 case detail 时显示“来自：急诊胸痛中的夹层警讯为何被忽略”。
- 字段使用可见 label；错误使用 `aria-invalid`、`aria-describedby` 和 `role="alert"`。
- DOM 中不存在 `input[type=file]`、密码、价格、支付、聊天字段。
- 无效提交停留当前页并聚焦第一个错误字段。
- 有效提交不发 fetch，只导航到 `/apply?status=success&source=case-detail&type=contributor&case=...`。
- success 状态显示“申请已提交”、`/cases` 和 `/` 两个恢复链接。

**验证命令**

```bash
pnpm test -- src/pages/ApplyPage.test.tsx src/App.test.tsx
node scripts/validate-design-tokens.mjs
pnpm build
```

**预期结果**

- Red：申请页不存在，表单和 success 断言失败。
- Green：申请页与回归测试通过；Token 校验和构建通过；四张运行时截图获得确认。

- [ ] **Step 1: Write failing page tests**

```tsx
it('contains no deferred controls and exposes accessible validation', () => {
  renderApply('?source=case-detail&type=contributor&case=acute-aortic-dissection-triage');
  expect(host.querySelector('input[type="file"]')).toBeNull();
  expect(host.querySelector('input[type="password"]')).toBeNull();
  act(() => host.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(host.querySelector('[role="alert"]')?.textContent).toContain('请选择你的身份');
  expect(host.querySelector('[aria-invalid="true"]')).not.toBeNull();
});

it('renders a deterministic success state', () => {
  renderApply('?status=success&source=case-detail&type=contributor&case=acute-aortic-dissection-triage');
  expect(host.textContent).toContain('申请已提交');
  expect(host.querySelector('a[href="/cases"]')).not.toBeNull();
  expect(host.querySelector('a[href="/"]')).not.toBeNull();
});
```

- [ ] **Step 2: Run and verify Red**

```bash
pnpm test -- src/pages/ApplyPage.test.tsx src/App.test.tsx
```

Expected: FAIL because the apply page does not exist.

- [ ] **Step 3: Implement exact approved form**

Use native select, text input, textarea and checkboxes. Identity options: 医学学生、住院医师、临床医生、专家或资深临床工作者、其他医学相关从业者. Module options: 避雷案例、学术挑战、专家策展、美学引擎. Submit label: “提交申请”. Add the fixed notice: “当前表单不接收病例、报告或其他医学文件。”

- [ ] **Step 4: Add form CSS using tokens only**

Use `--form-*` and `--button-*`; at 390px use one column, visible labels and 48px controls. Match only the Task 0 approved previews; do not introduce hero art, illustrations, glass, gradients or oversized cards.

- [ ] **Step 5: Run and verify Green**

```bash
pnpm test -- src/pages/ApplyPage.test.tsx src/App.test.tsx
node scripts/validate-design-tokens.mjs
pnpm build
```

Expected: form tests, regression tests, token validation and build pass.

- [ ] **Step 6: Capture and compare runtime screenshots**

Create exactly:

```text
docs/superpowers/evidence/2026-06-20-first-product-loop/apply-desktop-light.png
docs/superpowers/evidence/2026-06-20-first-product-loop/apply-desktop-dark.png
docs/superpowers/evidence/2026-06-20-first-product-loop/apply-mobile-light.png
docs/superpowers/evidence/2026-06-20-first-product-loop/apply-mobile-dark.png
```

Capture `/apply?source=case-detail&type=contributor&case=acute-aortic-dissection-triage` at both target viewports and compare against the Task 0 approved previews. Expected: identical field order, hierarchy, spacing and CTA placement; no overlap, file input, hidden label or unapproved visual decoration. Stop for user confirmation.

- [ ] **Step 7: Commit after screenshot approval**

```bash
git add src/pages/ApplyPage.tsx src/pages/ApplyPage.test.tsx src/App.tsx src/product.css docs/superpowers/evidence/2026-06-20-first-product-loop/apply-*.png
git commit -m "feat: close case application path"
```

---

### Task 10: Complete Motion Preference for Locked Surfaces

**输入**

- `PRODUCT.md` reduced-motion hard constraint。
- UI audit findings for HomePage, RevealLayer, ProductGallery and ParticleField。
- 已锁定 normal-mode visuals。

**输出**

- Create: `src/motion.ts`
- Create: `src/motion.test.tsx`
- Modify: `src/HomePage.tsx`
- Modify: `src/RevealLayer.tsx`
- Modify: `src/ProductGallery.tsx`
- Modify: `src/ParticleField.tsx`
- Modify: `src/App.test.tsx`
- reduce 模式完全停止连续 JS 动画；normal 模式视觉和 `/work` 空间结果不变。

**依赖**

- Task 4 navigation wiring complete；不依赖产品页样式。

**接口**

```ts
export function useReducedMotion(): boolean;
```

**测试**

- Hook 读取并订阅 `matchMedia('(prefers-reduced-motion: reduce)')`。
- reduce 模式下 HomePage 不启动 pointer RAF；RevealLayer 使用稳定静态 mask，不调用 `canvas.toDataURL()`。
- reduce 模式下 ProductGallery 不启动 pointer RAF、不监听 scroll mapping，提供五个可聚焦直接选择按钮和当前状态。
- ParticleField 在 reduce、`document.hidden` 或 `(pointer: coarse)` 时不请求动画帧。
- normal 模式现有 `/work` 滚动、卡片位置和首页双图测试全部保持。

**验证命令**

```bash
pnpm test -- src/motion.test.tsx src/App.test.tsx src/heroConfig.test.ts
pnpm build
```

**预期结果**

- Red：当前组件在 reduce 模式仍启动 RAF，且没有静态状态。
- Green：reduce 模式停机测试、normal 模式锁定回归和构建全部通过；首页四张运行时截图获得确认。

- [ ] **Step 1: Write failing motion tests**

```tsx
it('stops continuous animation work when reduced motion is requested', () => {
  installMatchMedia({ reducedMotion: true, coarsePointer: false });
  renderApp('/');
  expect(requestAnimationFrame).not.toHaveBeenCalled();
  expect(container.querySelector('[data-reveal-mode="static"]')).not.toBeNull();
});

it('renders a directly selectable static work state in reduce mode', () => {
  installMatchMedia({ reducedMotion: true, coarsePointer: false });
  renderApp('/work');
  expect(container.querySelectorAll('[data-work-selector]')).toHaveLength(5);
  expect(requestAnimationFrame).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run and verify Red**

```bash
pnpm test -- src/motion.test.tsx src/App.test.tsx
```

Expected: FAIL because current components always start RAF and have no static states.

- [ ] **Step 3: Implement the motion policy surgically**

- The hook uses modern `addEventListener('change')` with `addListener` fallback.
- Normal-mode code paths retain current formulas, classes and gallery order.
- Reveal static mask preserves both images and uses a fixed soft region; it does not replace the dual-image relationship.
- `/work` static selector updates `activeIndex` immediately and retains the same five module order; it does not render a new grid.
- `ParticleField` listens to visibility changes and resumes only when all three conditions allow animation.

- [ ] **Step 4: Run and verify Green**

```bash
pnpm test -- src/motion.test.tsx src/App.test.tsx src/heroConfig.test.ts
pnpm build
```

Expected: motion tests and all locked-surface regressions pass; build passes.

- [ ] **Step 5: Capture locked homepage regressions**

Create exactly:

```text
docs/superpowers/evidence/2026-06-20-first-product-loop/home-desktop-light.png
docs/superpowers/evidence/2026-06-20-first-product-loop/home-desktop-dark.png
docs/superpowers/evidence/2026-06-20-first-product-loop/home-mobile-light.png
docs/superpowers/evidence/2026-06-20-first-product-loop/home-mobile-dark.png
```

Compare normal mode against current homepage and approved direction boards. Also inspect reduce mode at both viewports: both images remain represented, content is immediately visible, and no continuous animation starts. Expected: zero normal-mode composition change and a stable accessible reduce state. Stop for user confirmation.

- [ ] **Step 6: Commit**

```bash
git add src/motion.ts src/motion.test.tsx src/HomePage.tsx src/RevealLayer.tsx src/ProductGallery.tsx src/ParticleField.tsx src/App.test.tsx docs/superpowers/evidence/2026-06-20-first-product-loop/home-*.png
git commit -m "fix: honor motion preference on locked surfaces"
```

---

### Task 11: End-to-End Loop, Keyboard, Responsive and Evidence Gate

**输入**

- Tasks 1–10 completed and page screenshots individually approved。

**输出**

- Modify: `src/App.test.tsx`
- Create: `docs/superpowers/evidence/2026-06-20-first-product-loop/README.md`
- 完整闭环集成测试和可复核 QA 证据。

**依赖**

- All earlier tasks。

**测试**

- 从首页真实 `/cases` 链接进入列表。
- 从第一条案例进入 `/cases/acute-aortic-dissection-triage`。
- 从详情 CTA 进入带 source/type/case query 的申请页。
- 填写合法表单后进入 success 状态。
- Back/Forward 保持页面和筛选 query。
- Tab 顺序：skip link -> brand -> primary nav -> theme -> apply CTA -> page controls -> page primary action。
- Enter 激活链接；Space 激活 button；Escape 关闭移动菜单并恢复焦点。
- 320、390、768、1280px 无横向溢出、遮挡或小于 44×44 的交互目标。

**验证命令**

```bash
pnpm test
node --test scripts/validate-design-tokens.node.mjs
node scripts/validate-design-tokens.mjs
pnpm build
git status --short
```

**预期结果**

- Red：新增完整闭环测试先在第一个未接通的行为处失败，原有 `/work` 测试不得失败。
- Green：全部 Vitest 通过（包含原始 13 项）、Token 测试 3/3、Token 校验和构建通过；Git 状态只包含本计划列明的实现与证据文件。

- [ ] **Step 1: Write the failing full-loop test before final integration fixes**

```tsx
it('completes home to case application success without deferred features', () => {
  renderApp('/');
  clickLink('/cases');
  expect(window.location.pathname).toBe('/cases');
  clickLink('/cases/acute-aortic-dissection-triage');
  expect(window.location.pathname).toBe('/cases/acute-aortic-dissection-triage');
  clickLink('/apply?source=case-detail&type=contributor&case=acute-aortic-dissection-triage');
  fillValidApplication(container);
  submitForm(container);
  expect(window.location.pathname).toBe('/apply');
  expect(window.location.search).toContain('status=success');
  expect(container.textContent).toContain('申请已提交');
  expect(container.querySelector('input[type="file"]')).toBeNull();
});
```

- [ ] **Step 2: Run and verify Red**

```bash
pnpm test -- src/App.test.tsx
```

Expected: FAIL only at the first missing integration behavior; no unrelated `/work` regression is accepted.

- [ ] **Step 3: Make only the smallest integration corrections**

Permitted corrections are route props, focus restoration, query preservation and event handling in files already listed by prior tasks. Do not add a new page, dependency, abstraction or visual treatment.

- [ ] **Step 4: Run all automated gates**

```bash
pnpm test
node --test scripts/validate-design-tokens.node.mjs
node scripts/validate-design-tokens.mjs
pnpm build
```

Expected:

- Vitest: all files and tests pass, including the original 13 tests.
- Token tests: 3/3 pass.
- Token validator: references, component raw values and CSS synchronization all pass.
- Production build: TypeScript and Vite exit with status 0; no console error is accepted.

- [ ] **Step 5: Run real browser keyboard and responsive checks**

```bash
pnpm dev
```

At 1280×720 and 390×844, complete the loop using keyboard only, then touch emulation. At 320, 390, 768 and 1280 widths, evaluate `document.documentElement.scrollWidth <= document.documentElement.clientWidth`. Expected: true at every width; every visible interactive rectangle is at least 44×44; focus is never clipped; reduce mode has no continuous movement.

- [ ] **Step 6: Write the evidence index**

`README.md` must contain:

```markdown
# First Product Loop Verification

- Commit under test: run `git rev-parse --short HEAD` and record its returned hash
- Automated tests: run `pnpm test` and record the exact passed test count
- Production build: run `pnpm build` and record the emitted JS/CSS bundle sizes
- Token validation: record the `node --test` result as 3/3 pass
- Keyboard loop: pass for Home -> Cases -> Case Detail -> Apply -> Success
- Viewports: 320, 390, 768, 1280 pass without horizontal overflow
- Touch targets: all visible controls >= 44x44 CSS px
- WCAG AA: text >= 4.5:1; UI/focus >= 3:1
- Reduced motion: no particle, pointer RAF, parallax, depth rotation or scroll mapping
- Visual references: list every generated screenshot and its approved source image
- Deferred feature scan: no login, payment, upload, chat, talent marketplace or B2B UI
```

Record the exact command outputs before committing the evidence file.

- [ ] **Step 7: Verify scope and changed files**

```bash
git status --short
git diff --name-only HEAD~1..HEAD
git diff --exit-code -- package.json pnpm-lock.yaml src/index.css src/galleryContent.ts src/heroConfig.ts src/heroConfig.test.ts public/assets assets/design-tokens.json assets/design-tokens.css
```

Expected: only files listed in this plan appear; protected files produce no diff.

- [ ] **Step 8: Commit final evidence**

```bash
git add src/App.test.tsx docs/superpowers/evidence/2026-06-20-first-product-loop/README.md
git commit -m "test: verify first product loop"
```

## Final Acceptance Checklist

- [ ] `/`, `/cases`, `/cases/:caseSlug`, `/apply` are refreshable and shareable; `/work` still works.
- [ ] Home -> Cases -> representative Case Detail -> Apply -> Success completes with mouse, touch and keyboard.
- [ ] Three case rows exist and each stable slug resolves to the same data-driven detail template.
- [ ] No deferred feature route, control, copy or data field was added.
- [ ] Homepage dual-image composition and `/work` normal-mode motion result are unchanged.
- [ ] Light/Dark use the same DOM and Component Tokens; theme persists across navigation and refresh.
- [ ] Reduce mode stops all continuous JS/CSS motion named in the hard constraints.
- [ ] Every page has one `h1`, visible focus, semantic links/buttons, 44×44 targets and AA contrast.
- [ ] Every page has approved Light/Dark desktop/mobile screenshots in the evidence directory.
- [ ] All tests, Token checks and production build pass with exact results recorded.
- [ ] `package.json`, lockfile, configs, `src/index.css`, approved assets and unrelated modules are unchanged.

## Execution Order and Stop Gates

```text
Task 0 preview approval
-> Tasks 1–5 foundations
-> Task 6 cases list -> screenshot approval
-> Task 7 case detail -> screenshot approval
-> Tasks 8–9 apply -> screenshot approval
-> Task 10 locked surfaces motion -> homepage screenshot approval
-> Task 11 full loop verification
```

No task may cross a screenshot approval gate. A rejected screenshot returns only to the page task that produced it; it does not authorize changes to approved assets, unrelated pages or the design system.
