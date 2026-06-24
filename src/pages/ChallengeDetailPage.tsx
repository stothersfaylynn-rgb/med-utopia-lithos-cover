import { useEffect } from 'react';
import { ProductShell } from '../components/ProductShell';
import { getCaseBySlug } from '../data/cases';
import { getChallengeBySlug } from '../data/challenges';

export function ChallengeDetailPage({ challengeSlug }: { challengeSlug: string }) {
  const record = getChallengeBySlug(challengeSlug);

  useEffect(() => {
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    if (!targetId) return;
    document.getElementById(targetId)?.scrollIntoView({ block: 'center' });
  }, [challengeSlug]);

  if (!record) {
    return (
      <ProductShell currentPath={`/challenges/${challengeSlug}`}>
        <main className="product-route-state" id="main-content">
          <p className="product-route-eyebrow">Med-Utopia</p>
          <h1>挑战未找到</h1>
          <p>该学术挑战可能尚未开放，或链接已失效。</p>
          <a className="challenge-detail-back-link" href="/challenges">
            返回挑战列表
          </a>
        </main>
      </ProductShell>
    );
  }

  const relatedCase = getCaseBySlug(record.relatedCaseSlug);
  const applicationHref = `/apply?source=challenge-detail&type=challenge&challenge=${record.slug}`;

  return (
    <ProductShell currentPath={`/challenges/${record.slug}`}>
      <main className="challenge-detail-page" id="main-content">
        <header className="challenge-detail-header">
          <a className="challenge-detail-back-link" href="/challenges">
            ← 返回挑战列表
          </a>
          <ul aria-label="挑战元数据" className="challenge-detail-meta">
            <li>CHALLENGE {record.id.slice(-3)}</li>
            <li>{record.category}</li>
            <li>{record.difficulty}</li>
            <li>{record.status}</li>
            <li>预计投入 {record.effort}</li>
            <li>{record.recruitmentWindow}</li>
          </ul>
          <h1>{record.title}</h1>
          <p className="challenge-detail-disclaimer">
            {record.reviewStatus}，仅供医学教育与学术讨论，不构成个体诊疗建议。
          </p>
        </header>

        <div className="challenge-detail-layout">
          <section className="challenge-task-section" id="challenge-goal">
            <h2>任务目标</h2>
            <p>{record.goal}</p>
          </section>

          <section className="challenge-task-section" id="challenge-questions">
            <h2>需要回答</h2>
            <ul>
              {record.questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </section>

          <section className="challenge-task-section" id="challenge-submission">
            <h2>提交预期</h2>
            <ul>
              {record.submissionExpectation.map((expectation) => (
                <li key={expectation}>{expectation}</li>
              ))}
            </ul>
          </section>

          <section className="challenge-reading-section" id="answer-sample">
            <h2>强回答样例</h2>
            <p>{record.answerSample}</p>
          </section>

          <section className="challenge-reading-section" id="expert-note">
            <h2>专家提示</h2>
            <p className="challenge-expert-identity">
              <strong>{record.expert.name}</strong>
              <span>{record.expert.specialty}</span>
              <span>{record.reviewStatus}</span>
            </p>
            <blockquote>“{record.expert.note}”</blockquote>
          </section>

          <section className="challenge-reading-section" id="evaluation-criteria">
            <h2>评价维度</h2>
            <ul>
              {record.evaluationCriteria.map((criterion) => (
                <li key={criterion}>{criterion}</li>
              ))}
            </ul>
          </section>

          <aside aria-labelledby="related-case-title" id="related-case">
            <h2 id="related-case-title">关联案例</h2>
            {relatedCase ? (
              <>
                <h3>{relatedCase.title}</h3>
                <dl>
                  <div>
                    <dt>科室</dt>
                    <dd>{relatedCase.department}</dd>
                  </div>
                  <div>
                    <dt>风险</dt>
                    <dd>{relatedCase.riskLevel}</dd>
                  </div>
                  <div>
                    <dt>难度</dt>
                    <dd>{relatedCase.difficulty}</dd>
                  </div>
                </dl>
                <a href={`/cases/${relatedCase.slug}`}>查看案例详情 →</a>
              </>
            ) : (
              <p>关联案例尚未开放。</p>
            )}
          </aside>
        </div>

        <footer className="challenge-detail-cta">
          <div>
            <h2>{record.status === '开放申请' ? '申请参与挑战' : '参与申请尚未开放'}</h2>
            <p>
              {record.status === '开放申请'
                ? '留下参与意向即可，无需注册账号，当前不接收站内答案或文件。'
                : '任务内容可以完整阅读；开放时间将在状态更新后显示。'}
            </p>
          </div>
          {record.status === '开放申请' ? <a href={applicationHref}>申请参与</a> : null}
        </footer>
      </main>
    </ProductShell>
  );
}
