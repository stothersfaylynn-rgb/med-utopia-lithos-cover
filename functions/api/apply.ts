type D1Database = {
  prepare: (query: string) => {
    bind: (...values: unknown[]) => {
      run: () => Promise<unknown>;
    };
  };
};

type PagesFunctionContext = {
  request: Request;
  env: {
    DB?: D1Database;
  };
};

type ApplyContext = {
  source: string | null;
  type: string | null;
  caseSlug: string | null;
  challengeSlug: string | null;
  expertSlug: string | null;
  module: string | null;
};

type ApplyPayload = {
  identity: string;
  school: string;
  specialty: string;
  phone: string;
  modules: string[];
  consent: boolean;
  context: ApplyContext;
};

const MAX_TEXT_LENGTH = 160;
const MODULES = new Set(['避雷案例', '学术挑战', '专家策展', '美学引擎']);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function cleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanNullableString(value: unknown) {
  const text = cleanString(value);
  return text ? text.slice(0, MAX_TEXT_LENGTH) : null;
}

function parsePayload(input: unknown): ApplyPayload | null {
  if (!input || typeof input !== 'object') return null;
  const record = input as Record<string, unknown>;
  const contextRecord =
    record.context && typeof record.context === 'object'
      ? (record.context as Record<string, unknown>)
      : {};
  const identity = cleanString(record.identity);
  const school = cleanString(record.school);
  const specialty = cleanString(record.specialty);
  const phone = cleanString(record.phone);
  const modules = Array.isArray(record.modules)
    ? record.modules.map(cleanString).filter((module) => MODULES.has(module))
    : [];

  if (
    !identity ||
    !school ||
    !specialty ||
    !/^1[3-9]\d{9}$/.test(phone) ||
    modules.length === 0 ||
    record.consent !== true
  ) {
    return null;
  }

  return {
    identity: identity.slice(0, MAX_TEXT_LENGTH),
    school: school.slice(0, MAX_TEXT_LENGTH),
    specialty: specialty.slice(0, MAX_TEXT_LENGTH),
    phone,
    modules,
    consent: true,
    context: {
      source: cleanNullableString(contextRecord.source),
      type: cleanNullableString(contextRecord.type),
      caseSlug: cleanNullableString(contextRecord.caseSlug),
      challengeSlug: cleanNullableString(contextRecord.challengeSlug),
      expertSlug: cleanNullableString(contextRecord.expertSlug),
      module: cleanNullableString(contextRecord.module),
    },
  };
}

export async function onRequestPost({ request, env }: PagesFunctionContext) {
  if (!env.DB) {
    return jsonResponse({ error: 'database_not_configured' }, 500);
  }

  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    return jsonResponse({ error: 'invalid_request' }, 400);
  }

  const payload = parsePayload(rawPayload);
  if (!payload) {
    return jsonResponse({ error: 'invalid_request' }, 400);
  }

  const createdAt = new Date().toISOString();
  const id = crypto.randomUUID();

  try {
    await env.DB.prepare(
      `insert into apply_submissions (
        id,
        identity,
        school,
        specialty,
        phone,
        modules_json,
        source,
        type,
        case_slug,
        challenge_slug,
        expert_slug,
        module,
        consent_accepted,
        created_at
      ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        payload.identity,
        payload.school,
        payload.specialty,
        payload.phone,
        JSON.stringify(payload.modules),
        payload.context.source,
        payload.context.type,
        payload.context.caseSlug,
        payload.context.challengeSlug,
        payload.context.expertSlug,
        payload.context.module,
        payload.consent ? 1 : 0,
        createdAt,
      )
      .run();
  } catch {
    return jsonResponse({ error: 'database_write_failed' }, 500);
  }

  return jsonResponse({ ok: true });
}
