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
  relatedChallengeSlug: string;
};

export const cases: readonly CaseRecord[] = [
  {
    id: 'case-001',
    slug: 'acute-aortic-dissection-triage',
    title: '急诊胸痛中的夹层警讯为何被忽略',
    summary: '初始分诊将高风险胸痛归入常见胸痛路径，关键鉴别信号未被同步验证。',
    department: '急诊医学',
    riskType: '分诊与鉴别偏差',
    riskLevel: '高风险',
    difficulty: '进阶',
    readingMinutes: 8,
    reviewStatus: 'Mock · 内容审核中',
    background:
      '一名突发胸痛患者进入急诊。首轮记录聚焦疼痛评分与心电图，未同时完成主动脉夹层风险信号核对。本案例为脱敏 Mock，仅用于医学教育与病例复盘。',
    decisions: [
      { id: '01', title: '胸痛性质', detail: '忽略撕裂样胸痛及向背部放射的关键特征。' },
      { id: '02', title: '双上肢血压差', detail: '未进行双上肢血压测量，错过重要鉴别线索。' },
      { id: '03', title: '影像时机', detail: '未优先启动主动脉 CTA，延误进一步确认。' },
    ],
    wrongPath: '将高风险胸痛过早归入非特异性胸痛，未触发主动脉夹层风险流程。',
    correctedReview: '识别典型疼痛特征与血压差线索，先完成高风险分层，再按流程安排影像确认。',
    expert: {
      name: '周衡（Mock）',
      specialty: '急诊医学',
      comment: '真正危险的不是缺少检查，而是把最初分类当成结论。',
    },
    evidence: [
      '2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease',
      '急诊高风险胸痛分层专家共识（Mock · 待编辑审核）',
      '主动脉夹层早期识别病例复盘（Mock · 待编辑审核）',
    ],
    principles: ['高风险信号优先识别。', '分流流程优先于检查顺序。', '初始分类必须允许被新证据修正。'],
    relatedChallengeSlug: 'triage-reasoning-aortic-dissection',
  },
  {
    id: 'case-002',
    slug: 'postoperative-fever-antibiotics',
    title: '术后发热为何不应直接升级抗生素',
    summary: '术后发热出现后直接升级抗菌药，缺少时间窗、感染证据和非感染原因的分层。',
    department: '外科 / 感染',
    riskType: '过度处置',
    riskLevel: '中风险',
    difficulty: '基础',
    readingMinutes: 6,
    reviewStatus: 'Mock · 内容审核中',
    background:
      '一名术后患者在早期恢复阶段出现发热。处置讨论直接进入抗菌药升级，未先核对时间窗、症状组合和感染证据。本案例为脱敏 Mock，仅用于医学教育与病例复盘。',
    decisions: [
      { id: '01', title: '发热时间窗', detail: '未区分术后早期炎症反应与感染证据。' },
      { id: '02', title: '感染来源', detail: '未先完成症状、体征与基础检查的来源核对。' },
      { id: '03', title: '用药升级', detail: '在证据不足时扩大抗菌覆盖范围。' },
    ],
    wrongPath: '把单一体温升高直接等同于感染进展，以升级用药替代病因分层。',
    correctedReview: '先按术后时间窗和症状组合评估，寻找感染来源及非感染原因，再决定是否调整抗菌方案。',
    expert: {
      name: '林弈（Mock）',
      specialty: '感染与围术期管理',
      comment: '处置强度应跟随证据变化，而不是跟随焦虑升级。',
    },
    evidence: [
      'WHO Global Guidelines for the Prevention of Surgical Site Infection',
      '术后发热评估路径（Mock · 待编辑审核）',
      '围术期抗菌药管理病例复盘（Mock · 待编辑审核）',
    ],
    principles: ['先确定时间窗。', '先寻找感染来源。', '用药强度必须对应证据强度。'],
    relatedChallengeSlug: 'literature-review-postoperative-fever',
  },
  {
    id: 'case-003',
    slug: 'hyponatremia-correction-risk',
    title: '低钠纠正速度被低估的神经风险',
    summary: '低钠纠正过程中只关注目标值，未同步管理纠正速度、监测频率和神经风险。',
    department: '内科',
    riskType: '治疗节奏与监测',
    riskLevel: '高风险',
    difficulty: '进阶',
    readingMinutes: 7,
    reviewStatus: 'Mock · 内容审核中',
    background:
      '一名低钠患者开始纠正治疗。团队持续关注血钠目标值，但对起始风险、累计纠正速度和复测频率记录不足。本案例为脱敏 Mock，仅用于医学教育与病例复盘。',
    decisions: [
      { id: '01', title: '起始风险', detail: '未完整记录低钠持续时间和神经系统风险背景。' },
      { id: '02', title: '纠正速度', detail: '只记录目标值，未同步追踪单位时间内变化。' },
      { id: '03', title: '监测节奏', detail: '复测间隔不足以支持及时调整纠正策略。' },
    ],
    wrongPath: '把达到目标值作为唯一成功标准，低估过快纠正带来的神经风险。',
    correctedReview: '先完成起始风险分层，设定纠正上限与复测节奏，根据累计变化及时调整。',
    expert: {
      name: '陈序（Mock）',
      specialty: '内科',
      comment: '安全不只取决于终点数值，也取决于抵达终点的速度。',
    },
    evidence: [
      'European Clinical Practice Guideline on Diagnosis and Treatment of Hyponatraemia',
      '低钠纠正速度监测路径（Mock · 待编辑审核）',
      '电解质治疗安全病例复盘（Mock · 待编辑审核）',
    ],
    principles: ['先评估起始风险。', '同时记录数值与速度。', '监测频率必须支持及时纠偏。'],
    relatedChallengeSlug: 'case-curation-hyponatremia',
  },
];

export function getCaseBySlug(slug: string): CaseRecord | undefined {
  return cases.find((record) => record.slug === slug);
}
