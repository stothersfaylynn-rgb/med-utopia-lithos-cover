import { describe, expect, it } from 'vitest';
import { buildChallengeSearch, filterChallenges, parseChallengeFilters } from './challengeFilters';
import { challenges } from './data/challenges';

describe('challenge filters', () => {
  it('returns an empty category and search for an empty query', () => {
    const filters = parseChallengeFilters('');

    expect(filters).toEqual({ category: '' });
    expect(buildChallengeSearch(filters)).toBe('');
  });

  it.each([
    ['临床推理', ['challenge-001']],
    ['文献解读', ['challenge-002']],
    ['策展任务', ['challenge-003']],
  ])('filters the approved category %s', (category, expectedIds) => {
    const filters = parseChallengeFilters(`?category=${category}`);

    expect(filterChallenges(challenges, filters).map(({ id }) => id)).toEqual(expectedIds);
    expect(buildChallengeSearch(filters)).toBe(
      `?category=${encodeURIComponent(category).replace(/%20/g, '+')}`,
    );
  });

  it('keeps the approved empty 病例复盘 category', () => {
    const filters = parseChallengeFilters('?category=病例复盘');

    expect(filters).toEqual({ category: '病例复盘' });
    expect(filterChallenges(challenges, filters)).toEqual([]);
    expect(buildChallengeSearch(filters)).toBe(
      '?category=%E7%97%85%E4%BE%8B%E5%A4%8D%E7%9B%98',
    );
  });

  it('clears unknown category values before filtering or serialization', () => {
    const filters = parseChallengeFilters('?category=其他');

    expect(filters).toEqual({ category: '' });
    expect(filterChallenges(challenges, filters)).toEqual(challenges);
    expect(buildChallengeSearch({ category: '其他' })).toBe('');
  });
});
