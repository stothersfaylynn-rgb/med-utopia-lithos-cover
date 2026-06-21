import { describe, expect, it } from 'vitest';
import { cases, getCaseBySlug } from './cases';

describe('case records', () => {
  it('contains three unique, deep-linkable mock cases', () => {
    expect(cases).toHaveLength(3);
    expect(new Set(cases.map(({ id }) => id)).size).toBe(3);
    expect(new Set(cases.map(({ slug }) => slug)).size).toBe(3);
    expect(cases.every(({ reviewStatus }) => reviewStatus === 'Mock · 内容审核中')).toBe(true);
  });

  it('keeps the approved identifiers and display values', () => {
    expect(
      cases.map(
        ({ id, slug, title, department, riskType, riskLevel, difficulty, expert }) => ({
          id,
          slug,
          title,
          department,
          riskType,
          riskLevel,
          difficulty,
          expert: expert.name,
        }),
      ),
    ).toEqual([
      {
        id: 'case-001',
        slug: 'acute-aortic-dissection-triage',
        title: '急诊胸痛中的夹层警讯为何被忽略',
        department: '急诊医学',
        riskType: '分诊与鉴别偏差',
        riskLevel: '高风险',
        difficulty: '进阶',
        expert: '周衡（Mock）',
      },
      {
        id: 'case-002',
        slug: 'postoperative-fever-antibiotics',
        title: '术后发热为何不应直接升级抗生素',
        department: '外科 / 感染',
        riskType: '过度处置',
        riskLevel: '中风险',
        difficulty: '基础',
        expert: '林弈（Mock）',
      },
      {
        id: 'case-003',
        slug: 'hyponatremia-correction-risk',
        title: '低钠纠正速度被低估的神经风险',
        department: '内科',
        riskType: '治疗节奏与监测',
        riskLevel: '高风险',
        difficulty: '进阶',
        expert: '陈序（Mock）',
      },
    ]);
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

  it('returns a case only for an approved slug', () => {
    expect(getCaseBySlug('acute-aortic-dissection-triage')?.title).toBe(
      '急诊胸痛中的夹层警讯为何被忽略',
    );
    expect(getCaseBySlug('unknown-case')).toBeUndefined();
  });

  it('contains no deferred feature language', () => {
    const serialized = JSON.stringify(cases);
    for (const forbidden of ['登录', '支付', '上传', '聊天', '人才市场', '一键诊断']) {
      expect(serialized).not.toContain(forbidden);
    }
  });
});
