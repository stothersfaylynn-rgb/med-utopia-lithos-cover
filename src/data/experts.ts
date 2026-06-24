export type ExpertRecord = {
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

export const experts: readonly ExpertRecord[] = [
  {
    id: 'expert-001',
    slug: 'zhou-heng',
    name: '周衡（Mock）',
    monogram: '周',
    title: '主任医师（Mock）',
    institution: '机构占位 · 内容审核中',
    specialty: '急诊医学',
    researchDirections: ['高风险胸痛', '分诊决策'],
    bio: '关注高风险胸痛的早期信号，以及新证据如何及时修正急诊分诊路径。',
    curatedCaseSlug: 'acute-aortic-dissection-triage',
    featuredComment: '真正危险的不是缺少检查，而是把最初分类当成结论。',
    disclosure: 'Mock · 身份与内容审核中',
  },
  {
    id: 'expert-002',
    slug: 'lin-yi',
    name: '林弈（Mock）',
    monogram: '林',
    title: '主任医师（Mock）',
    institution: '机构占位 · 内容审核中',
    specialty: '感染与围术期管理',
    researchDirections: ['抗菌药管理', '证据分层'],
    bio: '关注围术期感染证据的分层判断，以及抗菌药处置强度与证据强度的对应关系。',
    curatedCaseSlug: 'postoperative-fever-antibiotics',
    featuredComment: '处置强度应跟随证据变化，而不是跟随焦虑升级。',
    disclosure: 'Mock · 身份与内容审核中',
  },
  {
    id: 'expert-003',
    slug: 'chen-xu',
    name: '陈序（Mock）',
    monogram: '陈',
    title: '副主任医师（Mock）',
    institution: '机构占位 · 内容审核中',
    specialty: '内科',
    researchDirections: ['电解质紊乱', '治疗安全'],
    bio: '关注电解质治疗的节奏、复测频率与神经风险，让终点数值和抵达过程同时可追踪。',
    curatedCaseSlug: 'hyponatremia-correction-risk',
    featuredComment: '安全不只取决于终点数值，也取决于抵达终点的速度。',
    disclosure: 'Mock · 身份与内容审核中',
  },
];

export const expertSlugs = experts.map(({ slug }) => slug);

export function getExpertBySlug(slug: string): ExpertRecord | undefined {
  return experts.find((expert) => expert.slug === slug);
}
