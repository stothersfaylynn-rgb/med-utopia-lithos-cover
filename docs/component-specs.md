# 医学理想国组件规格 v1.0

- Token 来源：`assets/design-tokens.json`
- CSS 来源：`assets/design-tokens.css`
- 主题：Light 默认；`[data-theme="dark"]` 覆盖 Semantic Token
- 原则：组件层只使用 `--<component>-*` Token，不直接使用 Primitive 或原始色值

## 1. 全局状态模型

### 状态优先级

```text
Disabled > Active > Focus > Hover > Default
```

### Focus 规范

- 仅 `:focus-visible` 显示键盘焦点。
- 外环宽度：组件 `focus-width` Token。
- 外环颜色：组件 `focus-ring` Token。
- offset 颜色：组件 `focus-offset` Token。
- Focus 不取消原有 Active 状态；当前项仍保留语义背景或边框。
- 不使用 `outline: 0` 除非立即提供等价或更清楚的外环。

### 交互目标

- 触控目标最小使用 `--primitive-size-control`。
- 纯图标按钮视觉图标可以较小，但点击外框不得小于最小触控目标。
- Disabled 仍需满足 3:1 的必要识别对比度，并使用原生 `disabled` 或 `aria-disabled="true"`。

### 动效

- 颜色、边框和背景变化使用组件 `duration` Token 与 `--motion-easing-standard`。
- 不使用弹跳、弹性缩放或改变布局尺寸的动效。
- reduced-motion 下组件持续时间和位移归零；状态仍必须即时可见。

## 2. 顶部导航

### 目的

提供首页、避雷案例、学术挑战、专家策展、美学引擎和申请内测的真实入口，并显示当前页面。

### Anatomy

```text
Navigation
├─ Brand link
├─ Primary links
├─ Theme toggle
└─ Apply CTA
```

### 结构与尺寸

- 高度：`--navigation-height`
- 横向页边距：`--navigation-padding-x`
- 导航项最小高度：`--navigation-item-min-height`
- 导航项间距：`--navigation-gap`
- 导航项内边距：`--navigation-item-padding-x`
- 形状：`--navigation-radius`
- 层级：固定导航使用 `--layer-sticky`
- 移动端允许折叠为菜单，但 Brand link、主题按钮和菜单按钮必须始终可见。

### 状态

| 状态 | 背景 | 文字/边界 | 行为 |
|---|---|---|---|
| Default | `--navigation-item-background` | `--navigation-foreground` | 可点击真实链接 |
| Hover | `--navigation-item-background-hover` | `--navigation-foreground` | 只改变颜色，不移动位置 |
| Focus | 保留当前背景 | `--navigation-focus-ring` + `--navigation-focus-offset` | `focus-visible` 外环，Enter 激活 |
| Active | `--navigation-item-background-active` | `--navigation-item-foreground-active` | 使用 `aria-current="page"` |
| Disabled | `--navigation-item-background-disabled` | `--navigation-item-foreground-disabled` | 仅用于确实不可用项；不允许假按钮 |

### 无障碍

- 使用 `<nav aria-label="主导航">`。
- 链接使用 `<a>` 或路由链接，不用无行为 `<button>`。
- 移动菜单按钮维护 `aria-expanded` 和 `aria-controls`。

## 3. 主按钮与次按钮

### 目的

- 主按钮：每个页面唯一主要动作，例如“查看完整复盘”“申请参与”。
- 次按钮：返回、查看关联内容或不改变主要任务的辅助动作。

### 结构与尺寸

- 默认高度：`--button-height`
- 大按钮高度：`--button-height-large`
- 横向内边距：`--button-padding-x` / `--button-padding-x-large`
- 图标与文字间距：`--button-gap`
- 内容页圆角：`--button-radius`
- 首页现有 CTA 圆角：`--button-home-radius`，只用于锁定首页资产
- 字号与字重：`--button-font-size`、`--button-font-weight`

### 主按钮状态

| 状态 | 背景 | 文字 | 其他 |
|---|---|---|---|
| Default | `--button-primary-background` | `--button-primary-foreground` | 无宽阴影 |
| Hover | `--button-primary-background-hover` | `--button-primary-foreground` | 颜色过渡 |
| Focus | 保留当前状态 | 保留当前状态 | `--button-focus-ring` + `--button-focus-offset` + `--button-focus-width` |
| Active | `--button-primary-background-active` | `--button-primary-foreground` | 不缩小，不位移 |
| Disabled | `--button-disabled-background` | `--button-disabled-foreground` | 原生 disabled；无 hover |

### 次按钮状态

| 状态 | 背景 | 文字/边界 | 其他 |
|---|---|---|---|
| Default | `--button-secondary-background` | `--button-secondary-foreground` / `--button-secondary-border` | 平面描边 |
| Hover | `--button-secondary-background-hover` | 保持 | 不增加阴影 |
| Focus | 保留当前状态 | `--button-focus-ring` + `--button-focus-offset` | 外环清楚可见 |
| Active | `--button-secondary-background-active` | 保持 | 即时反馈 |
| Disabled | `--button-disabled-background` | `--button-disabled-foreground` | 边界降级但仍可识别 |

## 4. 案例卡

### 目的

在案例列表中帮助用户快速比较并进入一个完整复盘。批准预览中的案例卡是档案行，不是浮空营销卡片。

### Anatomy

```text
Case row
├─ Case number
├─ Title
├─ Department / risk type / difficulty
├─ Risk tag
└─ “查看完整复盘” action
```

### 结构与尺寸

- 背景与文字：`--case-card-background`、`--case-card-foreground`
- 次级文字：`--case-card-metadata`
- 内边距：`--case-card-padding`
- 内容间距：`--case-card-gap`
- 最小高度：`--case-card-min-height`
- 圆角：`--case-card-radius`
- 边界：`--case-card-border` + `--case-card-border-width`
- 阴影：`--case-card-shadow`，默认无阴影
- 整行可点击时使用单一链接覆盖，不在卡片内嵌套第二个交互目标。

### 状态

| 状态 | 背景 | 文字/动作 | 行为 |
|---|---|---|---|
| Default | `--case-card-background` | `--case-card-foreground` / `--case-card-action-foreground` | 显示完整目的地动作 |
| Hover | `--case-card-background-hover` | 动作保持医学青 | 不抬升、不放大 |
| Focus | 保留当前背景 | `--case-card-focus-ring` + `--case-card-focus-offset` | 使用 `--case-card-focus-width` 外环 |
| Active | `--case-card-background-active` | 保持 | 按下反馈，不移动内容 |
| Disabled | `--case-card-disabled-background` | `--case-card-disabled-foreground` | 仅用于内容不可用并解释原因 |

### 内容规则

- 标题必须描述具体临床判断问题。
- 风险标签必须包含文字。
- 列表最多显示必要 metadata；详细推理只在详情页出现。

## 5. 风险标签

### 目的

稳定表达高风险、中风险等医学内容状态。颜色不是唯一信号。

### Variants

| 变体 | 背景 | 文字/边界 | 固定文案 |
|---|---|---|---|
| High | `--risk-tag-high-background` | `--risk-tag-high-foreground` / `--risk-tag-high-border` | 高风险 |
| Medium | `--risk-tag-medium-background` | `--risk-tag-medium-foreground` / `--risk-tag-medium-border` | 中风险 |

### 尺寸

- 内边距：`--risk-tag-padding-x`、`--risk-tag-padding-y`
- 圆角：`--risk-tag-radius`
- 字号/字重：`--risk-tag-font-size`、`--risk-tag-font-weight`
- 边界：`--risk-tag-border-width`

### 状态

静态风险标签默认不可点击；只有作为筛选条件时才启用交互状态。

| 状态 | 视觉 | 行为 |
|---|---|---|
| Default | 使用 High 或 Medium 变体 Token | 静态文本或筛选项 |
| Hover | `--risk-tag-background-hover` | 仅交互变体启用 |
| Focus | `--risk-tag-focus-ring` + `--risk-tag-focus-offset` + `--risk-tag-focus-width` | 仅交互变体启用 |
| Active | `--risk-tag-background-active` | 通过 `aria-pressed="true"` 表示已选 |
| Disabled | `--risk-tag-disabled-background` / `--risk-tag-disabled-foreground` | 不响应点击 |

## 6. 专家点评面板

### 目的

把专家判断绑定到具体病例、决策节点和证据，不作为脱离语境的身份背书。

### Anatomy

```text
Expert annotation
├─ “专家点评” heading
├─ Expert name + specialty + Mock/review status
├─ Comment body
├─ Related evidence
└─ Optional complete-comment link
```

### 结构

- 背景：`--expert-panel-background`
- 文字：`--expert-panel-foreground`
- Metadata：`--expert-panel-metadata`
- 关联线/强调：`--expert-panel-accent`
- 边界：`--expert-panel-border` + `--expert-panel-border-width`
- 内边距/间距：`--expert-panel-padding`、`--expert-panel-gap`
- 圆角：`--expert-panel-radius`
- 阴影：`--expert-panel-shadow`，默认无阴影
- 桌面端可置于阅读栏旁侧；移动端进入正文流，不使用悬浮遮挡。

### 状态

| 状态 | 背景 | 边界/文字 | 行为 |
|---|---|---|---|
| Default | `--expert-panel-background` | 标准文字和关联线 | 静态阅读 |
| Hover | `--expert-panel-background-hover` | 保持 | 仅当整个面板是链接时启用 |
| Focus | 保持 | `--expert-panel-focus-ring` + `--expert-panel-focus-offset` + `--expert-panel-focus-width` | 焦点落在真实链接或面板链接 |
| Active | `--expert-panel-background-active` | 保持 | 仅交互变体启用 |
| Disabled | `--expert-panel-disabled-background` | `--expert-panel-disabled-foreground` | 显示“点评待审核”等原因 |

### 内容与无障碍

- 标题层级低于案例标题。
- 专家头像是补充信息，不可替代姓名与专科文字。
- 点评与相关决策节点使用文本引用或 `aria-describedby` 建立关系。

## 7. 临床决策时间线

### 目的

按发生顺序展示决策节点，使错误路径、遗漏信息和修正时机可追踪。

### Anatomy

```text
Timeline
├─ Connecting line
└─ Repeated decision item
   ├─ Numbered node
   ├─ Decision title
   └─ Short consequence / evidence
```

### 结构

- 连接线：`--decision-timeline-line`
- 节点：`--decision-timeline-node-*`
- 节点触控尺寸：`--decision-timeline-node-size`
- 节点间距：`--decision-timeline-gap`
- 节点内部间距：`--decision-timeline-item-gap`
- 边界：`--decision-timeline-border-width`
- 移动端保持单列垂直顺序，不压缩为 8–9px 标签。

### 状态

| 状态 | 节点背景 | 边界/文字 | 行为 |
|---|---|---|---|
| Default | `--decision-timeline-node-background` | `--decision-timeline-node-border` / `--decision-timeline-node-foreground` | 可阅读 |
| Hover | `--decision-timeline-node-background-hover` | 保持 | 只用于可选择节点 |
| Focus | 保持 | `--decision-timeline-focus-ring` + `--decision-timeline-focus-offset` + `--decision-timeline-focus-width` | Enter/Space 选择节点 |
| Active | `--decision-timeline-node-background-active` | `--decision-timeline-node-border-active` / `--decision-timeline-node-foreground-active` | `aria-current="step"` |
| Disabled | `--decision-timeline-node-background-disabled` | `--decision-timeline-node-foreground-disabled` | 不可进入并说明原因 |

### 无障碍

- 使用有序列表表达顺序。
- 当前节点同时使用数字、标题和 `aria-current`，不只改变颜色。
- 状态变化需要克制的 live region 文本，不逐帧播报滚动位置。

## 8. 筛选器

### 目的

按科室、风险类型、难度或挑战类型缩小列表，并把选择同步到 URL query。

### 类型

- 单选下拉：科室、难度。
- 多选 popover：风险类型、挑战类型。
- 清除操作：恢复全部结果。

### 结构与尺寸

- 高度：`--filter-height`
- 内边距/间距：`--filter-padding-x`、`--filter-gap`
- 圆角：`--filter-radius`
- 字号：`--filter-font-size`
- 边界：`--filter-border` + `--filter-border-width`
- 下拉层使用 `--layer-dropdown`，不得被列表容器裁切。

### 状态

| 状态 | 背景 | 边界/文字 | 行为 |
|---|---|---|---|
| Default | `--filter-background` | `--filter-border` / `--filter-foreground` | 显示字段名或当前值 |
| Hover | `--filter-background-hover` | `--filter-border-hover` | 不自动展开 |
| Focus | 保持 | `--filter-focus-ring` + `--filter-focus-offset` + `--filter-focus-width` | 键盘可打开和选择 |
| Active | `--filter-background-active` | `--filter-foreground-active` | 表示有筛选值或 popover 已打开 |
| Disabled | `--filter-disabled-background` | `--filter-disabled-foreground` | 保留标签并说明不可用原因 |

### 无障碍

- 原生 `<select>` 优先；复杂多选使用按钮 + popover/listbox 语义。
- 显示结果数量变化的状态公告。
- “清除筛选”必须是明确按钮，不用仅有关闭图标。

## 9. 表单

### 目的

用于无需登录的申请内测/参与表单。第一版不接收文件。

### 支持控件

- Text input、textarea、select、radio、checkbox。
- 不包含 file input、支付字段、聊天输入框。

### Anatomy

```text
Field group
├─ Label + required indicator
├─ Control
├─ Helper text
└─ Error text / success confirmation
```

### 结构与尺寸

- 控件高度：`--form-height`
- 横纵内边距：`--form-padding-x`、`--form-padding-y`
- Label/控件间距：`--form-field-gap`
- 字段组间距：`--form-group-gap`
- 圆角：`--form-radius`
- 字号：`--form-font-size`
- 边界：`--form-border` + `--form-border-width`
- 错误：`--form-error`，同时提供文字与图标。

### 状态

| 状态 | 背景 | 边界/文字 | 行为 |
|---|---|---|---|
| Default | `--form-background` | `--form-border` / `--form-foreground` | Placeholder 使用 `--form-placeholder` |
| Hover | 保持 | `--form-border-hover` | 不改变控件尺寸 |
| Focus | 保持 | `--form-focus-ring` + `--form-focus-offset` + `--form-focus-width` | Label 保持可见，不依赖 placeholder |
| Active | `--form-background-active` | 保持 Focus 边界 | 表示正在输入或已展开 |
| Disabled | `--form-disabled-background` | `--form-disabled-foreground` | 使用原生 disabled；值仍可读 |

### 错误与成功

- `aria-invalid="true"`，错误说明通过 `aria-describedby` 关联。
- 错误信息使用 `role="alert"`，不只改变边框颜色。
- 提交中使用 `aria-busy="true"` 并保留按钮宽度。
- 成功后显示“申请已提交”，并提供“继续浏览案例”和“返回首页”。

## 10. 主题与 reduced-motion 验收

每个组件必须完成以下矩阵：

| 检查 | Light | Dark | Reduced motion |
|---|---:|---:|---:|
| Default / Hover / Focus / Active / Disabled | 必须 | 必须 | 必须 |
| 普通文字 4.5:1 | 必须 | 必须 | 不变 |
| UI 与 Focus 3:1 | 必须 | 必须 | 不变 |
| 44×44 移动目标 | 必须 | 必须 | 不变 |
| 位移与持续动画 | 标准 Token | 标准 Token | 即时切换、位移为 0 |
