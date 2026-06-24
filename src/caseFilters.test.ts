import { describe, expect, it } from 'vitest';
import { buildCaseSearch, filterCases, parseCaseFilters } from './caseFilters';
import { cases } from './data/cases';

describe('case filters', () => {
  it('returns empty filters and search for an empty query', () => {
    const filters = parseCaseFilters('');

    expect(filters).toEqual({ department: '', risk: '', difficulty: '', curator: '' });
    expect(buildCaseSearch(filters)).toBe('');
  });

  it('filters by one approved dimension', () => {
    const filters = parseCaseFilters('?department=%E5%A4%96%E7%A7%91+%2F+%E6%84%9F%E6%9F%93');

    expect(filterCases(cases, filters).map(({ id }) => id)).toEqual(['case-002']);
    expect(buildCaseSearch(filters)).toBe(
      '?department=%E5%A4%96%E7%A7%91+%2F+%E6%84%9F%E6%9F%93',
    );
  });

  it('filters by all approved dimensions and serializes deterministically', () => {
    const filters = parseCaseFilters(
      '?difficulty=进阶&department=急诊医学&risk=分诊与鉴别偏差',
    );

    expect(filterCases(cases, filters).map(({ id }) => id)).toEqual(['case-001']);
    expect(buildCaseSearch(filters)).toBe(
      '?department=%E6%80%A5%E8%AF%8A%E5%8C%BB%E5%AD%A6&risk=%E5%88%86%E8%AF%8A%E4%B8%8E%E9%89%B4%E5%88%AB%E5%81%8F%E5%B7%AE&difficulty=%E8%BF%9B%E9%98%B6',
    );
  });

  it('clears invalid enum values before filtering or serialization', () => {
    const filters = parseCaseFilters('?department=未知&risk=过度处置&difficulty=高级');

    expect(filters).toEqual({ department: '', risk: '过度处置', difficulty: '', curator: '' });
    expect(filterCases(cases, filters).map(({ id }) => id)).toEqual(['case-002']);
    expect(buildCaseSearch(filters)).toBe(
      '?risk=%E8%BF%87%E5%BA%A6%E5%A4%84%E7%BD%AE',
    );
    expect(
      buildCaseSearch({ department: '未知', risk: '', difficulty: '高级', curator: '' }),
    ).toBe('');
  });

  it('returns no records for a valid combination with no match', () => {
    const filters = parseCaseFilters('?department=急诊医学&difficulty=基础');

    expect(filterCases(cases, filters)).toEqual([]);
  });

  it('filters by an approved curator and preserves it in stable search', () => {
    const filters = parseCaseFilters('?curator=zhou-heng');

    expect(filters).toEqual({
      department: '',
      risk: '',
      difficulty: '',
      curator: 'zhou-heng',
    });
    expect(filterCases(cases, filters).map(({ id }) => id)).toEqual(['case-001']);
    expect(buildCaseSearch(filters)).toBe('?curator=zhou-heng');
  });

  it('clears an unknown curator before filtering or serialization', () => {
    const filters = parseCaseFilters('?curator=unknown-expert');

    expect(filters.curator).toBe('');
    expect(filterCases(cases, filters)).toHaveLength(3);
    expect(buildCaseSearch(filters)).toBe('');
  });
});
