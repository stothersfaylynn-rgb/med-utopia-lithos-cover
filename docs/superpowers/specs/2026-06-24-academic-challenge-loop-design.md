# 学术挑战闭环设计规格

## 1. 目标与范围

本阶段把学术挑战从导航占位变成可独立提供价值的完整路径：

```text
/challenges
-> /challenges/:challengeSlug
-> /cases/:caseSlug 或 /apply?type=challenge&challenge=:challengeSlug
-> /apply?status=success&type=challenge&challenge=:challengeSlug
-> /challenges
```

用户可以浏览、筛选和理解挑战，不强制申请。第一版不提供站内答案提交、文件上传、账号、付费、聊天、排行或人才档案。

## 2. 信息架构

### 2.1 挑战列表

页面的唯一主要任务是选择一项值得打开的挑战。顺序固定为：

1. 页标题与 Mock/教育边界。
2. 单一类别筛选器，query 键为 `category`，可选“临床推理 / 文献解读 / 病例复盘 / 策展任务”。当前无“病例复盘” Mock 记录，该选项用于明确空状态，不伪造第四条挑战。
3. `aria-live` 结果数。
4. 三条任务卷宗，桌面端为平面档案行，移动端转为单列信息块。
5. 空状态解释当前筛选无结果，并提供“清除筛选”。

每条记录只呈现比较所需信息：编号、标题、类型、难度、状态、预计投入、招募时间和“查看挑战详情”。

### 2.2 挑战详情

页面的唯一主要任务是让用户判断任务要求和自己的参与意愿。阅读顺序固定为：

1. 返回挑战列表。
2. 编号、类型、难度、状态、预计投入和招募时间。
3. 挑战标题与 Mock/教育边界。
4. 任务目标。
5. 需要回答的问题。
6. 提交预期，明确“当前不接收站内答案或文件”。
7. 强回答样例。
8. 专家提示，必须标注 Mock 专家身份。
9. 评价维度。
10. 关联案例。
11. 可选“申请参与”。状态为“预告”时 CTA 不可用，并用文字说明尚未开放。

桌面端使用左侧任务栏、中间阅读栏与右侧关联案例的结构；移动端严格转为上述单列顺序，不缩小桌面布局。

## 3. 内容模型

`ChallengeRecord` 使用显式字段，不建立通用 CMS 抽象：

```ts
type ChallengeRecord = {
  id: 'challenge-001' | 'challenge-002' | 'challenge-003';
  slug: string;
  title: string;
  category: '临床推理' | '文献解读' | '策展任务';
  difficulty: '基础' | '进阶';
  status: '开放申请' | '预告';
  effort: string;
  recruitmentWindow: '滚动招募';
  background: string;
  goal: string;
  questions: string[];
  submissionExpectation: string[];
  answerSample: string;
  expert: { name: string; specialty: string; note: string };
  evaluationCriteria: string[];
  relatedCaseSlug: string;
};
```

三条记录与 `docs/product/ia-v1.md` 的 slug、类型、状态和关联案例一致。无真实截止时间，统一显示“滚动招募”，不生成倒计时。

## 4. 路由与数据流

- `parseRoute('/challenges', search)` 返回 `{ name: 'challenges', search }`。
- `parseRoute('/challenges/:challengeSlug')` 返回 `{ name: 'challenge-detail', challengeSlug }`。
- 分类 query 仅接受“临床推理 / 文献解读 / 病例复盘 / 策展任务”；其他未知值降级为空筛选，不产生错误页。
- 页面跳转继续使用当前 `navigate()` 和真实 `<a href>`，不增加路由依赖。
- 挑战申请 URL 为 `/apply?source=challenge-detail&type=challenge&challenge=:slug`。
- 申请页识别 `challenge`，显示挑战标题，预选“学术挑战”，并在成功状态保留 `type` 和 `challenge`。

## 5. 视觉与交互

批准方向为 **A · 任务卷宗**：

- 桌面列表与案例档案的平面行一致，不使用浮空卡片。
- 挑战状态使用文字与边界共同表达，不仅依赖颜色。
- 标题使用现有 Article 字体；控件、正文和数据使用现有 Body/Meta 字体。
- 仅使用现有 Semantic/Component Token，不写 Hex/RGB，不为挑战页创建第二套主题。
- 动效只用于 hover/focus/active 状态，120–180ms，不设页面入场编排。
- 视口 `320 / 390 / 768 / 1280px` 不溢出；移动控件至少 44×44 CSS px。
- 浅色与深色使用同一 DOM 层级。

批准预览：

- `docs/previews/academic-challenge-loop/direction-a-desktop-list-detail.png`
- `docs/previews/academic-challenge-loop/direction-a-mobile-list-detail.png`

## 6. 异常、空状态与边界

- 未知挑战 slug 显示“挑战未找到”和“返回挑战列表”。
- 未知类别 query 不隐藏全部内容；当作无筛选。
- “预告”挑战不提供可点击申请链接，但所有阅读内容保持可用。
- 申请页对未知 challenge slug 不伪造标题，但仍可作为普通内测申请页使用。
- 所有人物、机构、证据与内容必须保留 Mock/待审核边界，不构成个体诊疗建议。

## 7. 验收

- 路由、筛选、列表、详情、关联案例、申请与成功返回链路都有自动化测试。
- 所有新行为都先有正确 Red 再实现 Green。
- 挑战详情能独立解释任务目标、回答问题、提交预期、样例、专家提示和评价维度。
- 所有页面支持键盘、清晰 focus、正确标题层级、`aria-live` 结果数和文字化状态。
- 桌面/移动、浅色/深色无横向溢出、遮挡、控制台错误或与批准预览的实质偏离。
- 全量测试、Token 测试、Token 同步和生产构建通过。
- 仅精确暂存本阶段允许文件，在当前分支提交并推送，不合并默认分支。
