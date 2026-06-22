export type ApplyValues = {
  identity: string;
  school: string;
  specialty: string;
  phone: string;
  modules: string[];
  consent: boolean;
};

export type ApplyErrors = Partial<Record<keyof ApplyValues, string>>;

export function validateApply(values: ApplyValues): ApplyErrors {
  const errors: ApplyErrors = {};

  if (!values.identity.trim()) errors.identity = '请选择你的身份';
  if (!values.school.trim()) errors.school = '请输入毕业或在读院校';
  if (!values.specialty.trim()) errors.specialty = '请输入专科或关注方向';
  if (!/^1[3-9]\d{9}$/.test(values.phone.trim())) {
    errors.phone = '请输入有效的中国大陆11位手机号码';
  }
  if (values.modules.length === 0) errors.modules = '请至少选择一个希望参与的模块';
  if (!values.consent) errors.consent = '请确认同意我们就内测事宜与你联系';

  return errors;
}

export function getApplyContext(search: string): {
  source: string | null;
  type: string | null;
  caseSlug: string | null;
} {
  const query = new URLSearchParams(search);

  return {
    source: query.get('source'),
    type: query.get('type'),
    caseSlug: query.get('case'),
  };
}
