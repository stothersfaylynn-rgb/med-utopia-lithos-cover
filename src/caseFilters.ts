import type { CaseRecord } from './data/cases';
import { expertSlugs } from './data/experts';

export type CaseFilters = {
  department: string;
  risk: string;
  difficulty: string;
  curator: string;
};

const departments = ['急诊医学', '外科 / 感染', '内科'] as const;
const riskTypes = ['分诊与鉴别偏差', '过度处置', '治疗节奏与监测'] as const;
const difficulties = ['基础', '进阶'] as const;

function approvedValue(value: string | null, approved: readonly string[]) {
  return value && approved.includes(value) ? value : '';
}

export function parseCaseFilters(search: string): CaseFilters {
  const query = new URLSearchParams(search);
  return {
    department: approvedValue(query.get('department'), departments),
    risk: approvedValue(query.get('risk'), riskTypes),
    difficulty: approvedValue(query.get('difficulty'), difficulties),
    curator: approvedValue(query.get('curator'), expertSlugs),
  };
}

export function filterCases(
  records: readonly CaseRecord[],
  filters: CaseFilters,
): CaseRecord[] {
  return records.filter(
    (record) =>
      (!filters.department || record.department === filters.department) &&
      (!filters.risk || record.riskType === filters.risk) &&
      (!filters.difficulty || record.difficulty === filters.difficulty) &&
      (!filters.curator || record.curatorSlug === filters.curator),
  );
}

export function buildCaseSearch(filters: CaseFilters): string {
  const query = new URLSearchParams();
  const department = approvedValue(filters.department, departments);
  const risk = approvedValue(filters.risk, riskTypes);
  const difficulty = approvedValue(filters.difficulty, difficulties);
  const curator = approvedValue(filters.curator, expertSlugs);

  if (department) query.set('department', department);
  if (risk) query.set('risk', risk);
  if (difficulty) query.set('difficulty', difficulty);
  if (curator) query.set('curator', curator);

  const search = query.toString();
  return search ? `?${search}` : '';
}
