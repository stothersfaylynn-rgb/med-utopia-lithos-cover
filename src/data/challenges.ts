export type ChallengeCategory = '临床推理' | '文献解读' | '策展任务';

export type ChallengeRecord = {
  id: 'challenge-001' | 'challenge-002' | 'challenge-003';
  slug: string;
  title: string;
  category: ChallengeCategory;
  difficulty: '基础' | '进阶';
  status: '开放申请' | '预告';
  effort: string;
  recruitmentWindow: '滚动招募';
  reviewStatus: 'Mock · 内容审核中';
  background: string;
  goal: string;
  questions: string[];
  submissionExpectation: string[];
  answerSample: string;
  expert: { name: string; specialty: string; note: string };
  evaluationCriteria: string[];
  relatedCaseSlug: string;
};

export const challenges: readonly ChallengeRecord[] = [
  {
    id: 'challenge-001',
    slug: 'triage-reasoning-aortic-dissection',
    title: '你会在第几个信号出现时改变分诊路径？',
    category: '临床推理',
    difficulty: '进阶',
    status: '开放申请',
    effort: '2–3 小时',
    recruitmentWindow: '滚动招募',
    reviewStatus: 'Mock · 内容审核中',
    background:
      '高风险胸痛的初始信息并不总是同时出现。挑战要求参与者在逐步增加的脱敏 Mock 信息中，说明何时应该重新分层并改变分诊路径。',
    goal:
      '识别哪个信号足以改变当前分诊路径，并用一条可复核的证据链解释判断时机。',
    questions: [
      '你会在哪个信号出现时中止常规胸痛路径？',
      '这个信号如何改变先验风险与下一步检查顺序？',
      '如果关键检查暂时不可得，你会如何降低延误风险？',
    ],
    submissionExpectation: [
      '标出改变分诊路径的关键信号，并用不超过 150 字说明理由。',
      '引用至少一条可核对的指南、共识或高质量综述。',
      '列出一条备选路径及其风险权衡。当前不接收站内答案或文件。',
    ],
    answerSample:
      '当擒裂样胸痛同时伴有背部放射时，我会立即停止低风险胸痛路径，转入主动脉急症风险分层。双上肢血压差或脉搏不对称会进一步加强该判断，但不应等到全部信号齐备才重新分流。理由是漏诊的时间代价明显高于提前启动复核的资源代价。',
    expert: {
      name: '周衡（Mock）',
      specialty: '急诊医学',
      note: '不要等待单一“完美信号”。要回答的是哪个信号组合已经足以改变风险分层，以及延后切换的代价。',
    },
    evaluationCriteria: [
      '关键高风险信号的识别准确性',
      '改变路径时机的合理性',
      '证据引用的可核对性',
      '备选路径与风险权衡的完整性',
    ],
    relatedCaseSlug: 'acute-aortic-dissection-triage',
  },
  {
    id: 'challenge-002',
    slug: 'literature-review-postoperative-fever',
    title: '如何用证据判断术后发热的抗菌药升级时点？',
    category: '文献解读',
    difficulty: '基础',
    status: '开放申请',
    effort: '3–4 小时',
    recruitmentWindow: '滚动招募',
    reviewStatus: 'Mock · 内容审核中',
    background:
      '术后早期发热常伴随信息不完整和处置压力。挑战要求参与者用证据区分可观察的炎症反应、需要补充评估的感染线索与应升级抗菌药的情形。',
    goal:
      '建立一条证据强度与处置强度相匹配的判断路径，明确升级抗菌药前必须确认的信息。',
    questions: [
      '哪些时间窗与伴随征象真正增加感染可能性？',
      '什么证据足以支持扩大抗菌覆盖，什么证据只支持继续观察？',
      '如何同时处理非感染性发热的替代解释？',
    ],
    submissionExpectation: [
      '提供一张简明的证据分层表，区分观察、补充检查与升级用药。',
      '选择 2–4 条可核对文献，说明它们分别支持哪个判断节点。',
      '当前不接收站内答案或文件；申请通过后再约定线下交付方式。',
    ],
    answerSample:
      '我会先按术后时间窗、血流动力学、局部体征与基础检查将证据分为三层。单一体温升高仅触发复评，持续恶化的局部体征或器官功能变化才提高处置强度。升级用药的理由必须对应新增证据，而不是对焦虑的反应。',
    expert: {
      name: '林弈（Mock）',
      specialty: '感染与围术期管理',
      note: '好的文献解读不是堆叠引用，而是说清每条证据如何改变某一个处置节点，以及证据不足时为什么不升级。',
    },
    evaluationCriteria: [
      '时间窗与感染证据的区分准确性',
      '文献质量与临床问题的匹配度',
      '用药升级阈值的可解释性',
      '对非感染性原因的覆盖完整性',
    ],
    relatedCaseSlug: 'postoperative-fever-antibiotics',
  },
  {
    id: 'challenge-003',
    slug: 'case-curation-hyponatremia',
    title: '为低钠纠正风险建立一份病例策展标准',
    category: '策展任务',
    difficulty: '进阶',
    status: '预告',
    effort: '4–6 小时',
    recruitmentWindow: '滚动招募',
    reviewStatus: 'Mock · 内容审核中',
    background:
      '低钠纠正的风险不只来自起始数值，也来自持续时间、纠正速度与监测密度。本预告任务将邀请参与者建立一套用于筛选高价值教学病例的策展标准。',
    goal:
      '定义哪些病例信息足以支持对低钠纠正节奏、监测和神经风险的有效复盘。',
    questions: [
      '病例纳入时必须具备哪些起始风险与时间序列信息？',
      '如何评估该病例是否真正能够展示“速度”而不只是“结果数值”？',
      '哪些审核条件能降低脱敏不足或误导性归因的风险？',
    ],
    submissionExpectation: [
      '建立一份不超过 10 项的纳入与排除标准。',
      '为每项标准说明教学价值、证据来源和潜在偏差。',
      '本任务尚未开放申请，当前不接收站内答案或文件。',
    ],
    answerSample:
      '一条可纳入的病例必须包含可连续还原的血钠时间序列、主要干预和监测节点，并能说明纠正策略如何随新数据改变。只有起始与结果数值、无法还原节奏的病例应被排除，因为它们不能支持对安全边界的可追溯判断。',
    expert: {
      name: '陈序（Mock）',
      specialty: '内科',
      note: '策展标准要优先保留能够还原判断过程的病例。如果无法看到数值、时间和干预之间的关系，它就不适合用来讲解治疗节奏。',
    },
    evaluationCriteria: [
      '纳入与排除标准的可操作性',
      '对纠正速度与监测节奏的覆盖度',
      '证据来源与偏差评估的透明度',
      '脱敏与内容审核边界的完整性',
    ],
    relatedCaseSlug: 'hyponatremia-correction-risk',
  },
];

export function getChallengeBySlug(slug: string): ChallengeRecord | undefined {
  return challenges.find((record) => record.slug === slug);
}
