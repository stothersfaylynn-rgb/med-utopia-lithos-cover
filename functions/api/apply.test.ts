import { describe, expect, it, vi } from 'vitest';
import { onRequestPost } from './apply';

function jsonRequest(body: unknown) {
  return new Request('https://med-utopia.pages.dev/api/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/apply', () => {
  it('writes a valid application into D1', async () => {
    const bind = vi.fn(() => ({ run: vi.fn(() => Promise.resolve({ success: true })) }));
    const prepare = vi.fn(() => ({ bind }));
    const env = { DB: { prepare } };

    const response = await onRequestPost({
      request: jsonRequest({
        identity: '临床医生',
        school: '理想医学院',
        specialty: '急诊医学',
        phone: '13800000000',
        modules: ['避雷案例'],
        consent: true,
        context: {
          source: 'case-detail',
          type: 'contributor',
          caseSlug: 'acute-aortic-dissection-triage',
          challengeSlug: null,
          expertSlug: null,
          module: null,
        },
      }),
      env,
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(prepare).toHaveBeenCalledWith(expect.stringContaining('insert into apply_submissions'));
    expect(bind).toHaveBeenCalledWith(
      expect.any(String),
      '临床医生',
      '理想医学院',
      '急诊医学',
      '13800000000',
      JSON.stringify(['避雷案例']),
      'case-detail',
      'contributor',
      'acute-aortic-dissection-triage',
      null,
      null,
      null,
      1,
      expect.any(String),
    );
  });

  it('rejects invalid payloads before writing to D1', async () => {
    const prepare = vi.fn();
    const env = { DB: { prepare } };

    const response = await onRequestPost({
      request: jsonRequest({
        identity: '',
        school: '',
        specialty: '',
        phone: '123',
        modules: [],
      }),
      env,
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid_request' });
    expect(prepare).not.toHaveBeenCalled();
  });
});
