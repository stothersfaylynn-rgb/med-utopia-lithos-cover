import { describe, expect, it } from 'vitest';
import { cases } from './cases';
import { challenges, getChallengeBySlug } from './challenges';

describe('challenge records', () => {
  it('defines the three approved academic challenges', () => {
    expect(challenges.map(({ id, slug, category, status }) => ({ id, slug, category, status })))
      .toEqual([
        {
          id: 'challenge-001',
          slug: 'triage-reasoning-aortic-dissection',
          category: '临床推理',
          status: '开放申请',
        },
        {
          id: 'challenge-002',
          slug: 'literature-review-postoperative-fever',
          category: '文献解读',
          status: '开放申请',
        },
        {
          id: 'challenge-003',
          slug: 'case-curation-hyponatremia',
          category: '策展任务',
          status: '预告',
        },
      ]);
  });

  it('keeps every challenge complete, explicitly Mock, and free of fabricated deadlines', () => {
    for (const record of challenges) {
      expect(record.recruitmentWindow).toBe('滚动招募');
      expect(record.reviewStatus).toBe('Mock · 内容审核中');
      expect(record.background.length).toBeGreaterThan(20);
      expect(record.goal.length).toBeGreaterThan(20);
      expect(record.questions.length).toBeGreaterThanOrEqual(2);
      expect(record.submissionExpectation.length).toBeGreaterThanOrEqual(2);
      expect(record.answerSample.length).toBeGreaterThan(40);
      expect(record.expert.name).toContain('Mock');
      expect(record.expert.note.length).toBeGreaterThan(20);
      expect(record.evaluationCriteria.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('links every challenge to an existing approved case', () => {
    const caseSlugs = new Set(cases.map((record) => record.slug));

    for (const record of challenges) {
      expect(caseSlugs.has(record.relatedCaseSlug)).toBe(true);
    }
  });

  it('looks up known challenge slugs and returns undefined for unknown slugs', () => {
    expect(getChallengeBySlug('triage-reasoning-aortic-dissection')?.id).toBe('challenge-001');
    expect(getChallengeBySlug('unknown-challenge')).toBeUndefined();
  });
});
