create table if not exists apply_submissions (
  id text primary key,
  identity text not null,
  school text not null,
  specialty text not null,
  phone text not null,
  modules_json text not null,
  source text,
  type text,
  case_slug text,
  challenge_slug text,
  expert_slug text,
  module text,
  consent_accepted integer not null default 1,
  created_at text not null
);

create index if not exists apply_submissions_created_at_idx
  on apply_submissions (created_at desc);
