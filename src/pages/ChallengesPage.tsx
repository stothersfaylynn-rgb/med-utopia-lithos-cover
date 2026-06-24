import type { ChangeEvent } from 'react';
import {
  buildChallengeSearch,
  filterChallenges,
  parseChallengeFilters,
} from '../challengeFilters';
import { ProductShell } from '../components/ProductShell';
import { challenges } from '../data/challenges';
import { navigate } from '../router';

const categoryOptions = ['临床推理', '文献解读', '病例复盘', '策展任务'];

export function ChallengesPage({ search }: { search: string }) {
  const filters = parseChallengeFilters(search);
  const visibleChallenges = filterChallenges(challenges, filters);

  const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    navigate(
      `/challenges${buildChallengeSearch({ category: event.currentTarget.value })}`,
    );
  };

  return (
    <ProductShell currentPath="/challenges">
      <main className="challenges-page" id="main-content">
        <header className="challenges-page-header">
          <h1>学术挑战</h1>
          <p className="challenges-page-disclaimer">
            以下均为脱敏 Mock 内容，仅供医学教育与学术讨论，不构成个体诊疗建议。
          </p>
        </header>

        <fieldset className="challenge-filters">
          <legend>筛选挑战</legend>
          <label>
            <span>类别筛选</span>
            <select name="category" onChange={handleFilterChange} value={filters.category}>
              <option value="">全部</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <p aria-live="polite" className="challenge-result-count">
          共 {visibleChallenges.length} 项挑战
        </p>

        {visibleChallenges.length > 0 ? (
          <section aria-label="挑战列表" className="challenge-archive">
            <div aria-hidden="true" className="challenge-archive-heading">
              <span>编号</span>
              <span>学术任务</span>
              <span>类型</span>
              <span>状态</span>
              <span>预计投入</span>
              <span>操作</span>
            </div>
            <div className="challenge-list">
              {visibleChallenges.map((record) => (
                <article
                  className="challenge-card"
                  data-challenge-id={record.id}
                  key={record.id}
                >
                  <a className="challenge-card-link" href={`/challenges/${record.slug}`}>
                    <span className="challenge-card-reference">
                      <span>CHALLENGE {record.id.slice(-3)}</span>
                      <span className="challenge-card-review">{record.reviewStatus}</span>
                    </span>
                    <span className="challenge-card-summary">
                      <h2>{record.title}</h2>
                    </span>
                    <span className="challenge-card-cell challenge-card-category">
                      <span className="challenge-card-mobile-label">类型</span>
                      <span>{record.category}</span>
                      <span>{record.difficulty}</span>
                    </span>
                    <span className="challenge-card-cell challenge-card-state">
                      <span className="challenge-card-mobile-label">状态</span>
                      <span
                        className={`challenge-status ${
                          record.status === '开放申请'
                            ? 'challenge-status-open'
                            : 'challenge-status-preview'
                        }`}
                      >
                        {record.status}
                      </span>
                      <span className="challenge-card-recruitment">{record.recruitmentWindow}</span>
                    </span>
                    <span className="challenge-card-cell challenge-card-effort">
                      <span className="challenge-card-mobile-label">预计投入</span>
                      <span>{record.effort}</span>
                    </span>
                    <span className="challenge-card-action">查看挑战详情</span>
                  </a>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="challenge-empty-state">
            <h2>当前筛选条件下没有挑战</h2>
            <p>当前尚无该类型的 Mock 挑战，可以清除筛选查看全部任务。</p>
            <button onClick={() => navigate('/challenges')} type="button">
              清除筛选
            </button>
          </section>
        )}
      </main>
    </ProductShell>
  );
}
