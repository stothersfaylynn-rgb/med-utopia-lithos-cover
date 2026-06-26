import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  getApplyContext,
  validateApply,
  type ApplyErrors,
  type ApplyValues,
} from '../applyForm';
import { ProductShell } from '../components/ProductShell';
import { getCaseBySlug } from '../data/cases';
import { getChallengeBySlug } from '../data/challenges';
import { getExpertBySlug } from '../data/experts';
import { navigate } from '../router';

const identityOptions = [
  '医学学生',
  '住院医师',
  '临床医生',
  '专家或资深临床工作者',
  '其他医学相关从业者',
];

const moduleOptions = ['避雷案例', '学术挑战', '专家策展', '美学引擎'];

const initialValues: ApplyValues = {
  identity: '',
  school: '',
  specialty: '',
  phone: '',
  modules: ['避雷案例'],
  consent: false,
};

type TextField = 'identity' | 'school' | 'specialty' | 'phone';

function RequiredMark() {
  return (
    <span aria-hidden="true" className="apply-required-mark">
      *
    </span>
  );
}

export function ApplyPage({ search }: { search: string }) {
  const context = getApplyContext(search);
  const sourceCase = context.caseSlug ? getCaseBySlug(context.caseSlug) : undefined;
  const sourceChallenge = context.challengeSlug
    ? getChallengeBySlug(context.challengeSlug)
    : undefined;
  const sourceExpert = context.expertSlug ? getExpertBySlug(context.expertSlug) : undefined;
  const sourceModule = context.module === 'aesthetic-engine' ? '美学引擎' : null;
  const success = new URLSearchParams(search).get('status') === 'success';
  const [values, setValues] = useState<ApplyValues>(() => ({
    ...initialValues,
    modules:
      sourceModule
        ? [sourceModule]
        : context.type === 'challenge'
        ? ['学术挑战']
        : context.type === 'curation' && sourceExpert
          ? ['专家策展']
          : initialValues.modules,
  }));
  const [errors, setErrors] = useState<ApplyErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const field = event.currentTarget.name as TextField;
    const value = event.currentTarget.value;
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleModuleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value: module } = event.currentTarget;
    setValues((current) => ({
      ...current,
      modules: checked
        ? [...current.modules, module]
        : current.modules.filter((item) => item !== module),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateApply(values);
    setErrors(nextErrors);
    setSubmitError('');

    const firstError = Object.keys(nextErrors)[0] as keyof ApplyValues | undefined;
    if (firstError) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return;
    }

    const query = new URLSearchParams();
    query.set('status', 'success');
    if (context.source) query.set('source', context.source);
    if (context.type) query.set('type', context.type);
    if (context.caseSlug) query.set('case', context.caseSlug);
    if (context.challengeSlug) query.set('challenge', context.challengeSlug);
    if (context.expertSlug) query.set('expert', context.expertSlug);
    if (context.module) query.set('module', context.module);

    setSubmitting(true);
    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity: values.identity.trim(),
          school: values.school.trim(),
          specialty: values.specialty.trim(),
          phone: values.phone.trim(),
          modules: values.modules,
          consent: values.consent,
          context,
        }),
      });

      if (!response.ok) throw new Error('apply submission failed');
      navigate(`/apply?${query.toString()}`);
    } catch {
      setSubmitError('提交暂时失败，请稍后重试。');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <ProductShell currentPath="/apply">
        <main className="apply-success" id="main-content">
          <p className="product-route-eyebrow">INTERNAL TEST · 申请登记</p>
          <h1>申请已提交</h1>
          <p>我们已记录你的参与意向，后续仅就内测与内容共建事宜联系你。</p>
          <div className="apply-success-actions">
            {context.module === 'aesthetic-engine' ? (
              <a href="/aesthetic-engine">返回美学引擎</a>
            ) : context.type === 'curation' ? (
              <a href="/curators">继续浏览策展</a>
            ) : context.type === 'challenge' ? (
              <a href="/challenges">继续浏览挑战</a>
            ) : (
              <a href="/cases">继续浏览案例</a>
            )}
            <a href="/">返回首页</a>
          </div>
        </main>
      </ProductShell>
    );
  }

  return (
    <ProductShell currentPath="/apply">
      <main className="apply-page" id="main-content">
        <section className="apply-intro" aria-labelledby="apply-title">
          <p className="product-route-eyebrow">INTERNAL TEST · 申请登记</p>
          <h1 id="apply-title">申请内测</h1>
          <p className="apply-intro-copy">
            留下你的身份、专业方向与参与意向。无需注册账号，我们只会就内测事宜与你联系。
          </p>
          {sourceCase ? <p className="apply-context">来自：{sourceCase.title}</p> : null}
          {sourceChallenge ? (
            <p className="apply-context">来自挑战：{sourceChallenge.title}</p>
          ) : null}
          {sourceExpert ? <p className="apply-context">来自策展：{sourceExpert.name}</p> : null}
          {sourceModule ? <p className="apply-context">来自模块：{sourceModule}</p> : null}
          <p className="apply-file-notice">当前表单不接收病例、报告或其他医学文件。</p>
        </section>

        <form className="apply-form" noValidate onSubmit={handleSubmit}>
          <header className="apply-form-header">
            <h2>参与信息</h2>
            <p>
              <RequiredMark /> 为必填项
            </p>
          </header>

          <div className="apply-field-grid">
            <div className="apply-field">
              <label htmlFor="apply-identity">
                身份 <RequiredMark />
              </label>
              <select
                aria-describedby={errors.identity ? 'apply-identity-error' : undefined}
                aria-invalid={Boolean(errors.identity)}
                id="apply-identity"
                name="identity"
                onChange={handleTextChange}
                value={values.identity}
              >
                <option value="">请选择你的身份</option>
                {identityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.identity ? (
                <p id="apply-identity-error" role="alert">
                  {errors.identity}
                </p>
              ) : null}
            </div>

            <div className="apply-field">
              <label htmlFor="apply-school">
                毕业或在读院校 <RequiredMark />
              </label>
              <input
                aria-describedby={errors.school ? 'apply-school-error' : undefined}
                aria-invalid={Boolean(errors.school)}
                autoComplete="organization"
                id="apply-school"
                name="school"
                onChange={handleTextChange}
                placeholder="请输入院校全称"
                type="text"
                value={values.school}
              />
              {errors.school ? (
                <p id="apply-school-error" role="alert">
                  {errors.school}
                </p>
              ) : null}
            </div>

            <div className="apply-field">
              <label htmlFor="apply-specialty">
                专科或关注方向 <RequiredMark />
              </label>
              <input
                aria-describedby={errors.specialty ? 'apply-specialty-error' : undefined}
                aria-invalid={Boolean(errors.specialty)}
                id="apply-specialty"
                name="specialty"
                onChange={handleTextChange}
                placeholder="例如：急诊医学"
                type="text"
                value={values.specialty}
              />
              {errors.specialty ? (
                <p id="apply-specialty-error" role="alert">
                  {errors.specialty}
                </p>
              ) : null}
            </div>

            <div className="apply-field">
              <label htmlFor="apply-phone">
                联系电话 <RequiredMark />
              </label>
              <input
                aria-describedby={errors.phone ? 'apply-phone-error' : undefined}
                aria-invalid={Boolean(errors.phone)}
                autoComplete="tel"
                id="apply-phone"
                inputMode="tel"
                name="phone"
                onChange={handleTextChange}
                placeholder="请输入常用联系电话"
                type="tel"
                value={values.phone}
              />
              {errors.phone ? (
                <p id="apply-phone-error" role="alert">
                  {errors.phone}
                </p>
              ) : null}
            </div>
          </div>

          <fieldset
            aria-describedby={errors.modules ? 'apply-modules-error' : undefined}
            aria-invalid={Boolean(errors.modules)}
            className="apply-module-fieldset"
            name="modules"
          >
            <legend>
              希望参与的模块 <RequiredMark />
            </legend>
            <div className="apply-module-grid">
              {moduleOptions.map((module) => (
                <label key={module}>
                  <input
                    checked={values.modules.includes(module)}
                    name="modules"
                    onChange={handleModuleChange}
                    type="checkbox"
                    value={module}
                  />
                  <span>{module}</span>
                </label>
              ))}
            </div>
            {errors.modules ? (
              <p id="apply-modules-error" role="alert">
                {errors.modules}
              </p>
            ) : null}
          </fieldset>

          <div className="apply-consent-field">
            <label>
              <input
                aria-describedby={errors.consent ? 'apply-consent-error' : undefined}
                aria-invalid={Boolean(errors.consent)}
                checked={values.consent}
                name="consent"
                onChange={(event) => {
                  const consent = event.currentTarget.checked;
                  setValues((current) => ({ ...current, consent }));
                }}
                type="checkbox"
              />
              <span>
                我同意医学理想国内测与参与事宜通过上述联系电话与我联系。 <RequiredMark />
              </span>
            </label>
            {errors.consent ? (
              <p id="apply-consent-error" role="alert">
                {errors.consent}
              </p>
            ) : null}
          </div>

          <footer className="apply-form-actions">
            {submitError ? <p role="alert">{submitError}</p> : null}
            <p>提交不会创建账号，也不会上传或保存医学资料。</p>
            <button disabled={submitting} type="submit">
              {submitting ? '提交中...' : '提交申请'}
            </button>
          </footer>
        </form>
      </main>
    </ProductShell>
  );
}
