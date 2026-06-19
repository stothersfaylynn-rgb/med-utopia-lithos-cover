export type GalleryWork = {
  category: string;
  title: string;
  kicker: string;
  meta: string;
  signal: string;
  accent: string;
  shadow: string;
};

export const topNavItems = ['案例库', '学术挑战', '申请内测'];

export const assistantCategories = [
  '避雷案例',
  '专家点评',
  '学术挑战',
  '专家策展',
  '美学引擎',
];

export const galleryWorks: GalleryWork[] = [
  {
    category: '避雷案例',
    title: '避雷案例档案',
    kicker: 'CASE 01 / 专家复盘现场',
    meta: '急诊分诊 · 决策节点 · 风险纠偏',
    signal: 'FAILURE CASES',
    accent: '#62f6e8',
    shadow: 'rgba(98,246,232,0.38)',
  },
  {
    category: '专家点评',
    title: '专家点评现场',
    kicker: 'CASE 02 / 主任医师批注',
    meta: '鉴别诊断 · 处置取舍 · 经验校准',
    signal: 'EXPERT NOTES',
    accent: '#d9ff91',
    shadow: 'rgba(217,255,145,0.32)',
  },
  {
    category: '学术挑战',
    title: '学术挑战场',
    kicker: 'CASE 03 / 推理任务',
    meta: '文献解读 · 病例推演 · 参与申请',
    signal: 'ACADEMIC CHALLENGE',
    accent: '#a8adff',
    shadow: 'rgba(168,173,255,0.36)',
  },
  {
    category: '专家策展',
    title: '专家策展室',
    kicker: 'CASE 04 / 高信号样本',
    meta: '方向索引 · 案例精选 · 评论沉淀',
    signal: 'CURATED INTELLIGENCE',
    accent: '#ff9fd2',
    shadow: 'rgba(255,159,210,0.32)',
  },
  {
    category: '美学引擎',
    title: '美学引擎预告',
    kicker: 'CASE 05 / COMING SOON',
    meta: '报告重构 · PPT 重排 · 暂不开放上传',
    signal: 'AESTHETIC ENGINE',
    accent: '#ffcf6a',
    shadow: 'rgba(255,207,106,0.3)',
  },
];
