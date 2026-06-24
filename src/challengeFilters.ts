import type { ChallengeRecord } from './data/challenges';

export type ChallengeFilters = {
  category: string;
};

const categories = ['临床推理', '文献解读', '病例复盘', '策展任务'] as const;

function approvedCategory(value: string | null) {
  return value && categories.includes(value as (typeof categories)[number]) ? value : '';
}

export function parseChallengeFilters(search: string): ChallengeFilters {
  const query = new URLSearchParams(search);
  return { category: approvedCategory(query.get('category')) };
}

export function filterChallenges(
  records: readonly ChallengeRecord[],
  filters: ChallengeFilters,
): ChallengeRecord[] {
  return records.filter((record) => !filters.category || record.category === filters.category);
}

export function buildChallengeSearch(filters: ChallengeFilters): string {
  const query = new URLSearchParams();
  const category = approvedCategory(filters.category);

  if (category) query.set('category', category);

  const search = query.toString();
  return search ? `?${search}` : '';
}
