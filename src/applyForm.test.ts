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
      phone: '请输入有效的中国大陆11位手机号码',
      modules: '请至少选择一个希望参与的模块',
      consent: '请确认同意我们就内测事宜与你联系',
    });
  });

  it.each([
    ['10 digits', '1380013800'],
    ['12 digits', '138001380000'],
    ['non-digits', '1380013800a'],
    ['wrong first digit', '23800138000'],
    ['wrong second digit', '12800138000'],
    ['country prefix', '+8613800138000'],
  ])('rejects %s', (_scenario, phone) => {
    expect(
      validateApply({
        identity: '临床医生',
        school: '理想医学院',
        specialty: '急诊医学',
        phone,
        modules: ['避雷案例'],
        consent: true,
      }),
    ).toEqual({ phone: '请输入有效的中国大陆11位手机号码' });
  });

  it('accepts a complete non-file application after trimming the phone number', () => {
    expect(
      validateApply({
        identity: '临床医生',
        school: '理想医学院',
        specialty: '急诊医学',
        phone: ' 13800138000 ',
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
      challengeSlug: null,
      expertSlug: null,
    });
  });

  it('reads stable academic challenge application context', () => {
    expect(
      getApplyContext(
        '?source=challenge-detail&type=challenge&challenge=triage-reasoning-aortic-dissection&answer=private',
      ),
    ).toEqual({
      source: 'challenge-detail',
      type: 'challenge',
      caseSlug: null,
      challengeSlug: 'triage-reasoning-aortic-dissection',
      expertSlug: null,
    });
  });

  it('reads stable expert curation application context', () => {
    expect(
      getApplyContext('?source=curators&type=curation&expert=zhou-heng&profile=private'),
    ).toEqual({
      source: 'curators',
      type: 'curation',
      caseSlug: null,
      challengeSlug: null,
      expertSlug: 'zhou-heng',
    });
  });
});
