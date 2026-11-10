begin;

-- Version 1 stores only the core Progress schema. It does not store source code.
create function public.learning_progress_snapshot_valid(payload jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  field_name text;
  entry record;
begin
  if payload is null or pg_catalog.jsonb_typeof(payload) <> 'object' then return false; end if;
  if pg_catalog.octet_length(payload::text) > 262144 then return false; end if;
  if not (payload ?& array['completed', 'solved', 'bookmarks', 'quizzes', 'lastLesson', 'goal', 'minutes', 'notes', 'finishedProjects']) then return false; end if;
  if (select count(*) from pg_catalog.jsonb_object_keys(payload)) <> 9 then return false; end if;

  foreach field_name in array array['completed', 'solved', 'bookmarks', 'finishedProjects'] loop
    if pg_catalog.jsonb_typeof(payload -> field_name) <> 'array' then return false; end if;
    if pg_catalog.jsonb_array_length(payload -> field_name) > 1000 then return false; end if;
    if exists (
      select 1 from pg_catalog.jsonb_array_elements(payload -> field_name) as item(value)
      where pg_catalog.jsonb_typeof(item.value) <> 'string'
        or (item.value #>> '{}') !~ '^[a-z0-9][a-z0-9_-]{0,99}$'
    ) then return false; end if;
  end loop;

  if pg_catalog.jsonb_typeof(payload -> 'lastLesson') <> 'null' then
    if pg_catalog.jsonb_typeof(payload -> 'lastLesson') <> 'string'
      or (payload ->> 'lastLesson') !~ '^[a-z0-9][a-z0-9_-]{0,99}$' then return false; end if;
  end if;
  if (payload -> 'goal') not in ('15'::jsonb, '30'::jsonb, '45'::jsonb) then return false; end if;
  if pg_catalog.jsonb_typeof(payload -> 'notes') <> 'string' then return false; end if;
  if pg_catalog.char_length(payload ->> 'notes') > 120000 then return false; end if;

  foreach field_name in array array['quizzes', 'minutes'] loop
    if pg_catalog.jsonb_typeof(payload -> field_name) <> 'object' then return false; end if;
    if (select count(*) from pg_catalog.jsonb_object_keys(payload -> field_name)) >
      (case when field_name = 'minutes' then 5000 else 1000 end) then return false; end if;
    for entry in select key, value from pg_catalog.jsonb_each(payload -> field_name) loop
      if pg_catalog.jsonb_typeof(entry.value) <> 'number'
        or (entry.value #>> '{}') !~ '^(0|[1-9][0-9]{0,3})$' then return false; end if;
      if field_name = 'minutes' then
        if entry.key !~ '^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$'
          or (entry.value #>> '{}')::integer > 1440 then return false; end if;
        if pg_catalog.to_char(entry.key::date, 'YYYY-MM-DD') <> entry.key then return false; end if;
      else
        if entry.key !~ '^[a-z0-9][a-z0-9_-]{0,99}$'
          or (entry.value #>> '{}')::integer > 20 then return false; end if;
      end if;
    end loop;
  end loop;
  return true;
exception
  when invalid_datetime_format or datetime_field_overflow or invalid_text_representation then return false;
end;
$$;

revoke all on function public.learning_progress_snapshot_valid(jsonb) from public, anon;
grant execute on function public.learning_progress_snapshot_valid(jsonb) to authenticated;

create table public.learning_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  version integer not null default 1 check (version = 1),
  snapshot jsonb not null check (public.learning_progress_snapshot_valid(snapshot)),
  updated_at timestamptz not null default pg_catalog.clock_timestamp()
);

create function public.learning_progress_stamp_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    new.updated_at = greatest(pg_catalog.clock_timestamp(), old.updated_at + interval '1 microsecond');
  else
    new.updated_at = pg_catalog.clock_timestamp();
  end if;
  return new;
end;
$$;

revoke all on function public.learning_progress_stamp_updated_at() from public, anon, authenticated;

create trigger learning_progress_updated_at
before insert or update on public.learning_progress
for each row execute function public.learning_progress_stamp_updated_at();

alter table public.learning_progress enable row level security;

revoke all on table public.learning_progress from public, anon, authenticated;
grant select, insert, update on table public.learning_progress to authenticated;

create policy learning_progress_select_own
  on public.learning_progress for select to authenticated
  using ((select auth.uid()) = user_id);

create policy learning_progress_insert_own
  on public.learning_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy learning_progress_update_own
  on public.learning_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

comment on table public.learning_progress is 'One explicit progress backup per authenticated Learn Rust user; no editor drafts.';

commit;
