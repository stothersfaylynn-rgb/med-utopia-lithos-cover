import { describe, expect, it } from 'vitest';
import { getApplyContext, validateApply } from './applyForm';

describe('apply form contract', () => {
  it('returns exact errors for an empty application', () => {
    expect(
      validateApply({
        identity: '',
        school: '',
        specialty: '',
        phone: '',
        modules: [],
        consent: false,
      }),
    ).toEqual({
      identity: '请选择你的身份',
      school: '请输入毕业或在读院校',
      specialty: '请输入专科或关注方向',
      phone: '请输入联系电话',
      modules: '请至少选择一个希望参与的模块',
      consent: '请确认同意我们就内测事宜与你联系',
    });
  });

  it('rejects a phone number shorter than five characters after trimming', () => {
    expect(
      validateApply({
        identity: '临床医生',
        school: '理想医学院',
        specialty: '急诊医学',
        phone: ' 1234 ',
        modules: ['避雷案例'],
        consent: true,
      }),
    ).toEqual({ phone: '请输入联系电话' });
  });

  it('accepts a complete non-file application', () => {
    expect(
      validateApply({
        identity: '临床医生',
        school: '理想医学院',
        specialty: '急诊医学',
        phone: '13800000000',
        modules: ['避雷案例'],
        consent: true,
      }),
    ).toEqual({});
  });

  it('reads only stable application context from the query', () => {
    expect(
      getApplyContext(
        '?source=case-detail&type=contributor&case=acute-aortic-dissection-triage&file=record.pdf&medical=private',
      ),
    ).toEqual({
      source: 'case-detail',
      type: 'contributor',
      caseSlug: 'acute-aortic-dissection-triage',
    });
  });
});
