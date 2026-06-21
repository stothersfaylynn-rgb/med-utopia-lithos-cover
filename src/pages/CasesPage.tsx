import type { ChangeEvent } from 'react';
import { buildCaseSearch, filterCases, parseCaseFilters, type CaseFilters } from '../caseFilters';
import { ProductShell } from '../components/ProductShell';
import { cases } from '../data/cases';
import { navigate } from '../router';

const departmentOptions = ['急诊医学', '外科 / 感染', '内科'];
const riskOptions = ['分诊与鉴别偏差', '过度处置', '治疗节奏与监测'];
const difficultyOptions = ['基础', '进阶'];

export function CasesPage({ search }: { search: string }) {
  const filters = parseCaseFilters(search);
  const visibleCases = filterCases(cases, filters);

  const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const name = event.currentTarget.name as keyof CaseFilters;
    const nextFilters = { ...filters, [name]: event.currentTarget.value };
    navigate(`/cases${buildCaseSearch(nextFilters)}`);
  };

  return (
    <ProductShell currentPath="/cases">
      <main className="cases-page" id="main-content">
        <header className="cases-page-header">
          <h1>避雷案例</h1>
          <p className="cases-page-disclaimer">
            以下均为脱敏 Mock 内容，仅供医学教育与病例复盘，不构成个体诊疗建议。
          </p>
        </header>

        <fieldset className="case-filters">
          <legend>筛选案例</legend>
          <div className="case-filter-grid">
            <label>
              <span>科室</span>
              <select
                name="department"
                onChange={handleFilterChange}
                value={filters.department}
              >
                <option value="">全部</option>
                {departmentOptions.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>风险类型</span>
              <select name="risk" onChange={handleFilterChange} value={filters.risk}>
                <option value="">全部</option>
                {riskOptions.map((risk) => (
                  <option key={risk} value={risk}>
                    {risk}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>难度</span>
              <select
                name="difficulty"
                onChange={handleFilterChange}
                value={filters.difficulty}
              >
                <option value="">全部</option>
                {difficultyOptions.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>

        <p aria-live="polite" className="case-result-count">
          共 {visibleCases.length} 条案例
        </p>

        {visibleCases.length > 0 ? (
          <section aria-label="案例列表" className="case-archive">
            <div aria-hidden="true" className="case-archive-heading">
              <span>档案</span>
              <span>临床判断问题</span>
              <span>科室</span>
              <span>风险</span>
              <span>难度</span>
              <span>操作</span>
            </div>
            <div className="case-list">
              {visibleCases.map((record) => (
                <article className="case-card" data-case-id={record.id} key={record.id}>
                  <a className="case-card-link" href={`/cases/${record.slug}`}>
                    <span className="case-card-reference">
                      <span className="case-card-mobile-label">档案</span>
                      <span>CASE {record.id.slice(-3)}</span>
                      <span className="case-card-status">{record.reviewStatus}</span>
                    </span>
                    <span className="case-card-summary">
                      <h2>{record.title}</h2>
                    </span>
                    <span className="case-card-cell case-card-department">
                      <span className="case-card-mobile-label">科室</span>
                      <span>{record.department}</span>
                    </span>
                    <span className="case-card-cell case-card-risk">
                      <span className="case-card-mobile-label">风险</span>
                      <span
                        className={`risk-tag ${
                          record.riskLevel === '高风险' ? 'risk-tag-high' : 'risk-tag-medium'
                        }`}
                      >
                        {record.riskLevel}
                      </span>
                      <span className="case-card-risk-type">{record.riskType}</span>
                    </span>
                    <span className="case-card-cell case-card-difficulty">
                      <span className="case-card-mobile-label">难度</span>
                      <span>{record.difficulty}</span>
                    </span>
                    <span className="case-card-action">查看完整复盘</span>
                  </a>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="case-empty-state">
            <h2>当前筛选条件下没有案例</h2>
            <p>可以清除筛选，重新查看全部脱敏 Mock 案例。</p>
            <button onClick={() => navigate('/cases')} type="button">
              清除筛选
            </button>
          </section>
        )}
      </main>
    </ProductShell>
  );
}
