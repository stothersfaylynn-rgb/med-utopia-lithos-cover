---
name: "医学理想国 / Med-Utopia"
status: "Approved design system v1.0"
register: "product"
source:
  - "PRODUCT.md"
  - "docs/product/ia-v1.md"
  - "docs/brand-guidelines.md"
  - "docs/component-specs.md"
tokens:
  json: "assets/design-tokens.json"
  css: "assets/design-tokens.css"
themes:
  default: "light"
  alternate: "dark"
lockedAssets:
  homepage: "Current design and dual-image reveal"
  workMotion: "Current scroll, depth, spatial switching and card choreography"
---

# 医学理想国设计系统

## 1. 设计结论

医学理想国是克制、学术、精确的医学知识与判断平台。设计服务于病例理解、专家推理和学术参与，不把特效、AI 氛围或营销叙事放在医学内容之前。

### 已批准且不可改变

- 首页保持现有设计。
- `lithos-surface.webp` 和 `lithos-inner.webp` 保持同画幅前后全屏叠层，通过柔边局部区域揭示后层。
- `/work` 的滚动驱动、空间切换、中央主卡与相邻卡片运动逻辑保持不变。
- reduced-motion 是锁定动效的无障碍例外：停止连续运动，但保留首页双图关系和 `/work` 的可理解静态状态。

### 可系统化的部分

- `/work` 的静态表面与后续产品页使用统一 Token。
- 内容页采用同一布局的深浅双主题，不维护两套结构。
- 浅色主题是临床白医学档案馆；深色主题是暗色临床判断档案。
- 组件只消费 Component Token，不直接写 Primitive 色值。

## 2. 品牌基础

### 品牌人格

```text
克制：内容先于效果
学术：观点可追溯到病例与证据
精确：状态、对象、动作和目的地明确
```

完整语言、Logo、颜色和影像规则见 `docs/brand-guidelines.md`。

### Logo

- 正式横版：`assets/logo-lockup.svg`
- 独立标志：`assets/logo-mark.svg`
- 不创建未经批准的反白、单色或动画版本。
- 横版最小 140px；mark 最小 24px，可交互外框至少 44×44px。
- 安全区为 mark 宽度的 1/4。

## 3. Token 架构

```text
Primitive：原始颜色、尺寸、字阶、圆角、阴影、动效值
    ↓
Semantic：背景、文字、动作、风险、Focus、节奏和主题含义
    ↓
Component：导航、按钮、案例卡、风险标签等组件专属引用
```

### 约束

1. 原始值只能出现在 Primitive。
2. Semantic 必须引用 Primitive。
3. Component 必须引用 Semantic 或非颜色 Primitive。
4. 深色主题只覆盖 Semantic，不复制 Component。
5. reduced-motion 只覆盖 Semantic motion，不重写组件。
6. JSON 是数据源，CSS 由 `scripts/validate-design-tokens.mjs --write` 同步。

## 4. 颜色系统

### 品牌原色

| Token | 值 | 用途 |
|---|---|---|
| `--primitive-color-ink-800` | #1F2524 | Logo 深墨 |
| `--primitive-color-teal-600` | #0F8A82 | Logo 医学青、浅色 Focus |
| `--primitive-color-red-600` | #B84A3A | Logo/浅色高风险 |
| `--primitive-color-amber-500` | #C78A2C | Logo 警示节点 |
| `--primitive-color-ink-50` | #F6F8F7 | 浅色页面基底 |
| `--primitive-color-ink-975` | #07110F | 深色页面基底 |

### 语义颜色

| 语义 | Light | Dark |
|---|---|---|
| `--color-background` | Clinical canvas | Dark canvas |
| `--color-surface` | White archive surface | Dark dossier surface |
| `--color-foreground` | Deep ink | Clinical white |
| `--color-foreground-secondary` | Secondary ink | Light ink |
| `--color-primary` | Dark interaction teal | Light interaction teal |
| `--color-focus` | Brand medical teal | Light interaction teal |
| `--color-risk-high` | Risk vermilion | Light risk red |
| `--color-risk-medium` | Dark amber | Light amber |

### 使用规则

- 医学青只用于动作、当前状态、修正路径和 Focus。
- 风险色必须与文字、图标或标签共同使用。
- 不使用普通医院绿色、霓虹彩虹、紫粉分类色或奶油纸张色。
- 普通文字满足 4.5:1；大文字、边界和 Focus 满足 3:1。

## 5. 字体与字阶

### 字体角色

| 角色 | Token | 用途 |
|---|---|---|
| Display | `--typography-font-display` | 锁定首页标题 |
| Article | `--typography-font-article` | 案例详情主标题 |
| Body | `--typography-font-body` | 导航、正文、控件 |
| Meta | `--typography-font-meta` | 病例编号、日期、时间 |

### Primitive 字号尺度

```text
12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 64 / 96px
```

- 正文最低 16px。
- 必要标签最低 14px。
- 12px 只用于非关键 caption。
- 内容页标题默认 36px；移动端使用 30px 或 24px 语义降级，不压缩正文。
- 正文行高 1.625；长文行高 1.75；行长 65–75ch。
- 显示字距下限 -0.02em。

## 6. 尺度

### 间距

Primitive 基于 4px 网格，并补充 2px 与 6px：

```text
0 / 2 / 4 / 6 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96px
```

### 圆角

```text
0 / 4 / 6 / 8 / 10 / 12px / full
```

- 内容表面通常使用 4–8px。
- 10–12px 只用于较大独立表面。
- Full 只用于标签、小型胶囊控件和锁定首页 CTA。
- 内容卡片不得使用 24px 以上圆角。

### 边框

```text
0 / 1px hairline / 2px focus
```

### 阴影

```text
none / xs / sm
```

- 默认内容表面使用 `none`。
- `xs` 仅用于 dropdown 或轻浮层。
- `sm` 仅用于 overlay；禁止宽辉光和 ghost-card 组合。

## 7. 动效

### Token

| 角色 | 值 | 用途 |
|---|---:|---|
| Instant | 0ms | reduced-motion |
| Fast | 120ms | Hover/Focus/Active 色彩 |
| Normal | 180ms | 控件状态切换 |
| Slow | 240ms | 小范围内容展开 |
| Work | 900ms | 锁定 `/work` 空间切换 |

### 原则

- 产品组件只使用 Fast/Normal/Slow。
- `/work` 正常模式沿用现有空间运动和 emphasized easing。
- 不用弹跳或弹性；不动画布局尺寸。
- 内容默认可见，动效不能成为内容显示的前提。

## 8. Reduced Motion

当 `prefers-reduced-motion: reduce` 时：

1. `--motion-duration-*` 全部映射到 instant。
2. `--motion-distance-*` 全部映射到 0。
3. 停止粒子、指针追踪、视差、深度旋转、自动漂浮和长距离滚动映射。
4. `/work` 使用可直接选择的稳定静态状态，保留模块顺序、当前项和直接入口。
5. 首页仍保留双图前后关系；使用稳定静态揭示区，或由 Focus/轻触触发的即时状态。
6. 状态改变使用即时切换；如必须保留过渡，只允许不超过一次短淡入且内容预先可见。
7. 页面隐藏、失焦或触控设备上停止无必要的持续 RAF。

## 9. 组件系统

完整规格和五种状态见 `docs/component-specs.md`。

| 组件 | 稳定语义 |
|---|---|
| 顶部导航 | 全局真实路由、当前页面和主题切换 |
| 主/次按钮 | 页面主要动作与辅助动作 |
| 案例卡 | 可比较、可进入的临床判断档案行 |
| 风险标签 | 高/中风险的文字化医学状态 |
| 专家点评面板 | 绑定病例、节点与证据的权威说明 |
| 临床决策时间线 | 决策顺序、遗漏与修正时机 |
| 筛选器 | 科室、风险、难度与挑战类型 |
| 表单 | 无需登录的申请内测/参与意向 |

### 状态要求

每个可交互组件必须定义：

```text
Default / Hover / Focus / Active / Disabled
```

Focus 必须使用组件 `focus-ring`、`focus-offset` 和 `focus-width` Token；不允许只改变背景。

## 10. 响应式与可访问性

- 320、390、768、1280px 无横向溢出或遮挡。
- 移动端采用单列阅读结构，不缩小桌面展廊。
- 所有触控目标至少 44×44 CSS px。
- 页面唯一 `h1`；内容章节从 `h2` 开始。
- 当前状态使用 `aria-current`、文字或图标，不只使用颜色。
- 表单错误、筛选结果和异步状态提供状态公告。
- 首页双图叙事提供文本等价物。

## 11. 禁止项

- 组件内原始 Hex/RGB。
- 默认玻璃、宽辉光、连续粒子、扫描纹和巨大圆角。
- 把 `/work` 改成普通卡片网格或取消其锁定动效逻辑。
- 把首页双图改成单图、轮播、并排或整屏切换。
- 医院官网、医疗论坛、低端绿色健康应用或炫技 AI 网站语言。
- 第一版暗示登录、支付、上传、聊天、人才市场或 B2B 后台。

## 12. 校验

```bash
node --test scripts/validate-design-tokens.node.mjs
node scripts/validate-design-tokens.mjs
```

校验内容：

- 三层结构完整。
- Token 引用存在且无断链。
- Component Token 不包含原始值。
- 深色主题只覆盖 Semantic。
- reduced-motion 覆盖存在。
- CSS 与 JSON 完全同步。
