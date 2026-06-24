# 专家策展闭环设计规格

- 日期：2026-06-24
- 状态：视觉方向已由用户确认
- 批准预览：`docs/previews/expert-curation-loop/direction-a-desktop-mobile-board.png`
- 路由：`/curators`
- 方向：A · 策展索引册

## 1. 目标

专家策展页负责建立可追溯的权威内容层：用户先看到专家的研究方向，再进入其策展病例或病例中的完整点评，也可以登记参与策展。页面不把专家身份当作脱离内容的背书。

闭环为：

```text
/curators
-> /cases?curator=:expertSlug
-> /cases/:caseSlug#expert-commentary
-> /apply?type=curation&expert=:expertSlug
-> /apply?status=success&type=curation&expert=:expertSlug
-> /curators
```

## 2. 范围与排除

范围：

- 三位 Mock 专家及其研究方向、简介、策展病例、精选点评和审核披露。
- 单页 `/curators` 索引，不增加专家详情路由。
- `curator` 案例筛选 query 与 `expert` 申请 query。
- `/work` 既有“专家策展”卡接入真实路由。

排除：

- 真实专家身份、认证、背书、咨询、聊天、关注、评分或排行榜。
- 独立专家详情页或独立点评门户。
- 登录、支付、上传、站内投稿、人才市场和 B2B 后台。
- 首页构图变化、`/work` 动效或排版变化、新依赖。

## 3. 内容模型

```ts
type ExpertRecord = {
  id: 'expert-001' | 'expert-002' | 'expert-003';
  slug: 'zhou-heng' | 'lin-yi' | 'chen-xu';
  name: string;
  monogram: string;
  title: string;
  institution: string;
  specialty: string;
  researchDirections: readonly [string, string];
  bio: string;
  curatedCaseSlug: string;
  featuredComment: string;
  disclosure: 'Mock · 身份与内容审核中';
};
```

三条记录固定映射到现有案例：

| 专家 | 专科 | 研究方向 | 策展案例 |
|---|---|---|---|
| 周衡（Mock） | 急诊医学 | 高风险胸痛、分诊决策 | `acute-aortic-dissection-triage` |
| 林弈（Mock） | 感染与围术期管理 | 抗菌药管理、证据分层 | `postoperative-fever-antibiotics` |
| 陈序（Mock） | 内科 | 电解质紊乱、治疗安全 | `hyponatremia-correction-risk` |

每条 `CaseRecord` 增加对应 `curatorSlug`。测试必须证明专家、案例和点评文本互相解析。

## 4. 页面结构

页面只有一个 `h1`：`专家策展`。

页头：

- 引导语：`以研究方向、策展病例与完整点评建立可追溯的判断索引。`
- 固定说明：`以下均为 Mock 身份与脱敏内容，仅供医学教育与学术讨论，不构成个体诊疗建议。`
- 结果信息：`共 3 位策展人`。

每位专家是一条编辑档案：

1. 身份：`CURATOR 001`、文字印章、姓名、专科、职称与机构占位。
2. 研究：两个方向标签、简短介绍、策展病例标题。
3. 判断：一条与病例一致的精选点评、审核披露。
4. 行动：`查看策展案例`、`阅读完整点评`、`申请参与策展`。

链接分别固定为：

- `/cases?curator=:expertSlug`
- `/cases/:caseSlug#expert-commentary`
- `/apply?source=curators&type=curation&expert=:expertSlug`

## 5. 视觉与响应式

继续使用现有暗色默认、亮色可切换的产品系统，不新增主题原色。

- 标题和病例标题使用现有文章衬线字体；导航、正文和元数据使用现有无衬线字体。
- 页面使用墨黑/炭青表面、医学青信号、细边框和近乎无阴影的平面结构。
- 唯一标志性元素是左侧“策展脊线”：它串联三条档案，表达专家到内容的可追溯关系。
- 不使用人物照片、库存医疗图、渐变、玻璃拟态、评分徽章或营销卡片抬升。
- 桌面端每条档案为三栏编辑记录；移动端按身份、研究、病例、点评、行动顺序单列展开。
- 主要操作移动端最小高度 44px；所有链接保留可见键盘焦点。
- reduced-motion 下不依赖动画呈现信息。本页不新增必要动效。

实现优先复用现有 `--expert-panel-*`、`--case-card-*`、`--button-*`、语义色、间距、字体和边框 token；只有确实缺失且同时更新 JSON/CSS/验证时才能新增 token。

## 6. 数据流与恢复

- `getExpertBySlug` 为策展页、案例筛选和申请页提供同一专家来源。
- 合法 `curator` query 只显示该专家的策展案例；非法值被清除并恢复全部案例。
- 合法 `expert` query 在申请页显示来源专家并只预选“专家策展”。
- 本地确定性提交保留 `source`、`type`、`expert`，不发送网络请求。
- `type=curation` 成功态提供 `继续浏览策展` 到 `/curators`。

## 7. 测试与验收

- 数据：三位专家、唯一 slug、现有案例关系、点评文本一致。
- 路由：`/curators` 有限解析；嵌套路由拒绝；申请 query 只读取批准键。
- 页面：一个 h1、三条档案、三类真实链接、无延期功能。
- 案例：已批准 curator 过滤、未知值恢复、原筛选回归。
- 申请：专家来源、模块预选、提交保留 query、成功返回策展。
- 画面：桌面 1280×720、移动 390×844，Light/Dark；无横向溢出、控制台错误或低于 44px 的主要操作。
- 收尾：全量测试、token 测试、token 同步、TypeScript、生产构建和 `git diff --check`；再从 `git archive HEAD` 等价快照复跑。

## 8. 规格自检

- 无 TBD/TODO 或待定接口。
- 没有新增专家详情页、点评门户或延期业务系统。
- 内容关系、query 名称、CTA 和成功返回路径一致。
- 所有新增可见布局均属于已批准的“策展索引册”方向。
