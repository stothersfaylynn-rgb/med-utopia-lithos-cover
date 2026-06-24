import { describe, expect, it } from 'vitest';
import { cases } from './cases';
import { experts, getExpertBySlug } from './experts';

describe('expert records', () => {
  it('defines the three approved Mock curators with unique stable identifiers', () => {
    expect(
      experts.map(({ id, slug, name, specialty, researchDirections }) => ({
        id,
        slug,
        name,
        specialty,
        researchDirections,
      })),
    ).toEqual([
      {
        id: 'expert-001',
        slug: 'zhou-heng',
        name: '周衡（Mock）',
        specialty: '急诊医学',
        researchDirections: ['高风险胸痛', '分诊决策'],
      },
      {
        id: 'expert-002',
        slug: 'lin-yi',
        name: '林弈（Mock）',
        specialty: '感染与围术期管理',
        researchDirections: ['抗菌药管理', '证据分层'],
      },
      {
        id: 'expert-003',
        slug: 'chen-xu',
        name: '陈序（Mock）',
        specialty: '内科',
        researchDirections: ['电解质紊乱', '治疗安全'],
      },
    ]);
    expect(new Set(experts.map(({ id }) => id)).size).toBe(3);
    expect(new Set(experts.map(({ slug }) => slug)).size).toBe(3);
  });

  it('keeps every curator traceable to one existing case and its commentary', () => {
    for (const expert of experts) {
      const curatedCase = cases.find(({ slug }) => slug === expert.curatedCaseSlug);

      expect(curatedCase).toBeDefined();
      expect(curatedCase?.curatorSlug).toBe(expert.slug);
      expect(curatedCase?.expert.name).toBe(expert.name);
      expect(curatedCase?.expert.specialty).toBe(expert.specialty);
      expect(curatedCase?.expert.comment).toBe(expert.featuredComment);
      expect(expert.bio.length).toBeGreaterThan(20);
      expect(expert.disclosure).toBe('Mock · 身份与内容审核中');
    }
  });

  it('looks up only approved expert slugs', () => {
    expect(getExpertBySlug('zhou-heng')?.id).toBe('expert-001');
    expect(getExpertBySlug('unknown-expert')).toBeUndefined();
  });
});
