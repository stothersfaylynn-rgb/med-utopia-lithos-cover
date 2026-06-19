export type GalleryWork = {
  category: string;
  title: string;
  kicker: string;
  meta: string;
  signal: string;
  accent: string;
  shadow: string;
  leftDossier: DossierBlock;
  rightDossier: DossierBlock;
};

export const topNavItems = ['案例库', '学术挑战', '申请内测'];

type DossierBlock = {
  label: string;
  title: string;
  items: string[];
};

export const galleryWorks: GalleryWork[] = [
  {
    category: '避雷案例',
    title: '避雷案例档案',
    kicker: 'CASE 01 / 专家复盘现场',
    meta: '急诊分诊 · 决策节点 · 风险纠偏',
    signal: 'FAILURE CASES',
    accent: '#62f6e8',
    shadow: 'rgba(98,246,232,0.38)',
    leftDossier: {
      label: 'RISK TRACE',
      title: '误判现场',
      items: ['急诊分诊偏差', '关键节点回放', '风险信号标注'],
    },
    rightDossier: {
      label: 'REVIEW PATH',
      title: '专家复盘',
      items: ['错因拆解', '修正路径', '临床原则沉淀'],
    },
  },
  {
    category: '专家点评',
    title: '专家点评现场',
    kicker: 'CASE 02 / 主任医师批注',
    meta: '鉴别诊断 · 处置取舍 · 经验校准',
    signal: 'EXPERT NOTES',
    accent: '#d9ff91',
    shadow: 'rgba(217,255,145,0.32)',
    leftDossier: {
      label: 'AUTHORITY LAYER',
      title: '主任批注',
      items: ['鉴别诊断取舍', '处置边界', '经验校准'],
    },
    rightDossier: {
      label: 'NOTE INDEX',
      title: '点评线索',
      items: ['关键句摘录', '风险提醒', '可复用判断'],
    },
  },
  {
    category: '学术挑战',
    title: '学术挑战场',
    kicker: 'CASE 03 / 推理任务',
    meta: '文献解读 · 病例推演 · 参与申请',
    signal: 'ACADEMIC CHALLENGE',
    accent: '#a8adff',
    shadow: 'rgba(168,173,255,0.36)',
    leftDossier: {
      label: 'TASK FIELD',
      title: '挑战类型',
      items: ['文献解读', '病例推演', '策展任务'],
    },
    rightDossier: {
      label: 'ENTRY SIGNAL',
      title: '参与申请',
      items: ['提交推理', '专家样例', '能力记录'],
    },
  },
  {
    category: '专家策展',
    title: '专家策展室',
    kicker: 'CASE 04 / 高信号样本',
    meta: '方向索引 · 案例精选 · 评论沉淀',
    signal: 'CURATED INTELLIGENCE',
    accent: '#ff9fd2',
    shadow: 'rgba(255,159,210,0.32)',
    leftDossier: {
      label: 'CURATION MAP',
      title: '专家方向索引',
      items: ['高信号样本', '研究方向', '评论沉淀'],
    },
    rightDossier: {
      label: 'ACCESS LAYER',
      title: '可进入内容',
      items: ['病例精选', '评论线索', '申请参与'],
    },
  },
  {
    category: '美学引擎',
    title: '美学引擎预告',
    kicker: 'CASE 05 / COMING SOON',
    meta: '报告重构 · PPT 重排 · 暂不开放上传',
    signal: 'AESTHETIC ENGINE',
    accent: '#ffcf6a',
    shadow: 'rgba(255,207,106,0.3)',
    leftDossier: {
      label: 'RECONSTRUCT',
      title: '医学表达重构',
      items: ['报告结构', 'PPT 重排', '科研海报'],
    },
    rightDossier: {
      label: 'PRIVATE BETA',
      title: '当前内测中',
      items: ['样式系统校准', '结构建议', '不开放上传'],
    },
  },
];
