import { ProductShell } from '../components/ProductShell';
import { getCaseBySlug } from '../data/cases';
import { experts } from '../data/experts';

export function CuratorsPage() {
  return (
    <ProductShell currentPath="/curators">
      <main className="curators-page" id="main-content">
        <header className="curators-page-header">
          <h1>专家策展</h1>
          <p className="curators-page-intro">
            以研究方向、策展病例与完整点评建立可追溯的判断索引。
          </p>
          <p className="curators-page-disclaimer">
            以下均为 Mock 身份与脱敏内容，仅供医学教育与学术讨论，不构成个体诊疗建议。
          </p>
        </header>

        <p className="curator-result-count">共 {experts.length} 位策展人</p>

        <section aria-label="专家策展索引" className="curator-list">
          {experts.map((expert, index) => {
            const curatedCase = getCaseBySlug(expert.curatedCaseSlug);

            return (
              <article
                className="curator-record"
                data-expert-slug={expert.slug}
                key={expert.id}
              >
                <section className="curator-identity" aria-labelledby={`${expert.id}-name`}>
                  <p className="curator-reference">
                    CURATOR {String(index + 1).padStart(3, '0')}
                  </p>
                  <span aria-hidden="true" className="curator-monogram">
                    {expert.monogram}
                  </span>
                  <h2 id={`${expert.id}-name`}>{expert.name}</h2>
                  <p>{expert.specialty}</p>
                  <p>{expert.title}</p>
                  <p>{expert.institution}</p>
                </section>

                <section className="curator-research" aria-labelledby={`${expert.id}-research`}>
                  <h3 id={`${expert.id}-research`}>研究方向</h3>
                  <ul aria-label={`${expert.name}研究方向`} className="curator-tags">
                    {expert.researchDirections.map((direction) => (
                      <li key={direction}>{direction}</li>
                    ))}
                  </ul>
                  <p className="curator-bio">{expert.bio}</p>
                  <div className="curator-case">
                    <p>策展病例</p>
                    <h3>{curatedCase?.title}</h3>
                  </div>
                </section>

                <section
                  className="curator-commentary"
                  aria-labelledby={`${expert.id}-commentary`}
                >
                  <h3 id={`${expert.id}-commentary`}>策展点评（节选）</h3>
                  <blockquote>“{expert.featuredComment}”</blockquote>
                  <p className="curator-disclosure">
                    <strong>审阅声明</strong>
                    <span>{expert.disclosure}</span>
                  </p>
                  <div className="curator-actions">
                    <a href={`/cases?curator=${expert.slug}`}>查看策展案例</a>
                    <a href={`/cases/${expert.curatedCaseSlug}#expert-commentary`}>
                      阅读完整点评
                    </a>
                    <a
                      href={`/apply?source=curators&type=curation&expert=${expert.slug}`}
                    >
                      申请参与策展
                    </a>
                  </div>
                </section>
              </article>
            );
          })}
        </section>
      </main>
    </ProductShell>
  );
}
