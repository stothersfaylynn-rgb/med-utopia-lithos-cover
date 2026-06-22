import { useEffect } from 'react';
import { ProductShell } from '../components/ProductShell';
import { getCaseBySlug } from '../data/cases';

export function CaseDetailPage({ caseSlug }: { caseSlug: string }) {
  const record = getCaseBySlug(caseSlug);

  useEffect(() => {
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    if (!targetId) return;
    document.getElementById(targetId)?.scrollIntoView({ block: 'center' });
  }, [caseSlug]);

  if (!record) {
    return (
      <ProductShell currentPath={`/cases/${caseSlug}`}>
        <main className="product-route-state" id="main-content">
          <p className="product-route-eyebrow">Med-Utopia</p>
          <h1>案例未找到</h1>
          <p>该案例可能尚未开放，或链接已失效。</p>
          <a className="case-detail-back-link" href="/cases">
            返回案例列表
          </a>
        </main>
      </ProductShell>
    );
  }

  const riskClass = record.riskLevel === '高风险' ? 'risk-tag-high' : 'risk-tag-medium';

  return (
    <ProductShell currentPath={`/cases/${record.slug}`}>
      <main className="case-detail-page" id="main-content">
        <header className="case-detail-header">
          <a className="case-detail-back-link" href="/cases">
            ← 返回案例列表
          </a>
          <div className="case-detail-title-row">
            <h1>{record.title}</h1>
            <span className={`risk-tag ${riskClass}`}>{record.riskLevel}</span>
          </div>
          <ul aria-label="案例元数据" className="case-detail-meta">
            <li>{record.department}</li>
            <li>{record.riskType}</li>
            <li>{record.difficulty}</li>
            <li>预计阅读 {record.readingMinutes} 分钟</li>
            <li>{record.reviewStatus}</li>
          </ul>
          <p className="case-detail-disclaimer">
            以下为脱敏 Mock 内容，仅供医学教育与病例复盘，不构成个体诊疗建议。
          </p>
        </header>

        <div className="case-detail-layout">
          <section className="case-detail-decision" id="decision-path">
            <h2>决策节点</h2>
            <p className="case-detail-background">{record.background}</p>
            <ol className="case-decision-list">
              {record.decisions.map((decision) => (
                <li key={decision.id}>
                  <span aria-hidden="true" className="case-decision-number">
                    {decision.id}
                  </span>
                  <div>
                    <h3>{decision.title}</h3>
                    <p>{decision.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="case-detail-section" id="wrong-path">
            <h2>错误路径</h2>
            <p>{record.wrongPath}</p>
          </section>

          <section className="case-detail-section" id="corrected-review">
            <h2>修正复盘</h2>
            <p>{record.correctedReview}</p>
          </section>

          <aside aria-labelledby="expert-commentary-title" id="expert-commentary">
            <h2 id="expert-commentary-title">专家点评</h2>
            <p className="case-expert-identity">
              <strong>{record.expert.name}</strong>
              <span>{record.expert.specialty}</span>
              <span>{record.reviewStatus}</span>
            </p>
            <blockquote>“{record.expert.comment}”</blockquote>
          </aside>

          <section className="case-detail-section" id="evidence">
            <h2>证据依据</h2>
            <ul>
              {record.evidence.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="case-detail-section" id="principles">
            <h2>可复用原则</h2>
            <ul>
              {record.principles.map((principle) => (
                <li key={principle}>{principle}</li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="case-detail-cta">
          <div>
            <h2>参与案例内容共建</h2>
            <p>如果你愿意参与病例整理、证据校对或专业复核，可以登记参与意向。</p>
          </div>
          <a
            href={`/apply?source=case-detail&type=contributor&case=${record.slug}`}
          >
            申请参与内容共建
          </a>
        </footer>
      </main>
    </ProductShell>
  );
}
