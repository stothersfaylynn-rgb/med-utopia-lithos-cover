# Cloudflare D1 Apply Collection

The internal-test application form posts to `/api/apply`.

Production requires one Cloudflare Pages binding:

- Binding name: `DB`
- Resource type: D1 database
- Suggested database name: `med_utopia_applications`
- Current database ID: `3bf4f0fb-40c9-4d92-89b6-d1d38042e31c`

This binding is stored in the repository `wrangler.toml`, which is the source of
truth for Pages Functions configuration once deployed.

Create the table by running the SQL in:

```text
cloudflare/d1/apply_submissions.sql
```

The first version intentionally has no public admin page. Read submissions from
the Cloudflare dashboard D1 console or with a private SQL query:

```sql
select created_at, identity, school, specialty, phone, modules_json, source, type, case_slug, challenge_slug, expert_slug, module
from apply_submissions
order by created_at desc;
```
