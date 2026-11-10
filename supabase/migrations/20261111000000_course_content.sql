begin;

-- Whole releases keep the catalog, lessons and specialization links consistent.
-- A release is immutable; publication only changes the singleton pointer.
create function public.course_content_text(value jsonb, maximum integer, allow_empty boolean default false)
returns boolean language sql immutable set search_path = '' as $$
  select value is not null and pg_catalog.jsonb_typeof(value) = 'string'
    and pg_catalog.char_length(value #>> '{}') <= maximum
    and (allow_empty or pg_catalog.length(pg_catalog.btrim(value #>> '{}')) > 0);
$$;

create function public.course_content_texts(value jsonb, minimum integer, maximum integer)
returns boolean language plpgsql immutable set search_path = '' as $$
begin
  if value is null or pg_catalog.jsonb_typeof(value) <> 'array' then return false; end if;
  if pg_catalog.jsonb_array_length(value) < minimum or pg_catalog.jsonb_array_length(value) > maximum then return false; end if;
  return not exists (select 1 from pg_catalog.jsonb_array_elements(value) as x(v) where not public.course_content_text(x.v, 40000));
end;
$$;

create function public.course_catalog_valid(catalog jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare
  item jsonb;
  section jsonb;
  entry jsonb;
  milestone jsonb;
  field text;
  module_ids text[];
  lesson_ids text[];
  track_ids text[];
  assigned text[] := array[]::text[];
  item_id text;
  quiz_answer integer;
begin
  if catalog is null or pg_catalog.jsonb_typeof(catalog) <> 'object' then return false; end if;
  if pg_catalog.octet_length(catalog::text) > 20971520 then return false; end if;
  if not catalog ?& array['modules', 'lessons', 'specializations'] then return false; end if;
  if (select count(*) from pg_catalog.jsonb_object_keys(catalog)) <> 3 then return false; end if;
  foreach field in array array['modules', 'lessons', 'specializations'] loop
    if pg_catalog.jsonb_typeof(catalog -> field) is distinct from 'array' then return false; end if;
  end loop;
  if pg_catalog.jsonb_array_length(catalog -> 'modules') not between 1 and 200
    or pg_catalog.jsonb_array_length(catalog -> 'lessons') not between 1 and 1000
    or pg_catalog.jsonb_array_length(catalog -> 'specializations') > 100 then return false; end if;

  select pg_catalog.array_agg(v ->> 'id') into module_ids from pg_catalog.jsonb_array_elements(catalog -> 'modules') as m(v);
  select pg_catalog.array_agg(v ->> 'id') into lesson_ids from pg_catalog.jsonb_array_elements(catalog -> 'lessons') as m(v);
  select pg_catalog.array_agg(v ->> 'id') into track_ids from pg_catalog.jsonb_array_elements(catalog -> 'specializations') as m(v);
  if pg_catalog.cardinality(module_ids) <> (select count(distinct x) from pg_catalog.unnest(module_ids) x)
    or pg_catalog.cardinality(lesson_ids) <> (select count(distinct x) from pg_catalog.unnest(lesson_ids) x)
    or pg_catalog.cardinality(track_ids) <> (select count(distinct x) from pg_catalog.unnest(track_ids) x) then return false; end if;

  for item in select value from pg_catalog.jsonb_array_elements(catalog -> 'modules') loop
    if pg_catalog.jsonb_typeof(item) <> 'object' or not item ?& array['id', 'title', 'description', 'color', 'icon', 'level'] then return false; end if;
    if not public.course_content_text(item -> 'id', 100) or (item ->> 'id') !~ '^[a-z0-9][a-z0-9_-]{0,99}$' then return false; end if;
    foreach field in array array['title', 'description', 'color', 'icon', 'level'] loop
      if not public.course_content_text(item -> field, 5000) then return false; end if;
    end loop;
    if not exists (select 1 from pg_catalog.jsonb_array_elements(catalog -> 'lessons') as l(v) where v ->> 'moduleId' = item ->> 'id') then return false; end if;
  end loop;

  for item in select value from pg_catalog.jsonb_array_elements(catalog -> 'lessons') loop
    if pg_catalog.jsonb_typeof(item) <> 'object' or not item ?& array['id', 'moduleId', 'title', 'description', 'duration', 'objectives', 'sections', 'tip', 'exercise', 'starterCode', 'solutionCode', 'expectedOutput', 'hints', 'quiz', 'reference'] then return false; end if;
    if not public.course_content_text(item -> 'id', 100) or (item ->> 'id') !~ '^[a-z0-9][a-z0-9_-]{0,99}$'
      or not public.course_content_text(item -> 'moduleId', 100) or not (item ->> 'moduleId' = any(module_ids)) then return false; end if;
    foreach field in array array['title', 'description', 'starterCode', 'solutionCode'] loop
      if not public.course_content_text(item -> field, 150000) then return false; end if;
    end loop;
    if not public.course_content_text(item -> 'tip', 20000, true) or not public.course_content_text(item -> 'expectedOutput', 150000, true) then return false; end if;
    if pg_catalog.jsonb_typeof(item -> 'duration') is distinct from 'number' or (item ->> 'duration') !~ '^[1-9][0-9]{0,4}$' or (item ->> 'duration')::integer > 10080 then return false; end if;
    if not public.course_content_texts(item -> 'objectives', 1, 30) or not public.course_content_texts(item -> 'hints', 0, 30) then return false; end if;
    if pg_catalog.jsonb_typeof(item -> 'sections') is distinct from 'array' then return false; end if;
    if pg_catalog.jsonb_array_length(item -> 'sections') not between 1 and 40 then return false; end if;
    for section in select value from pg_catalog.jsonb_array_elements(item -> 'sections') loop
      if pg_catalog.jsonb_typeof(section) <> 'object' or not public.course_content_text(section -> 'title', 500) or not public.course_content_text(section -> 'text', 150000) then return false; end if;
      if section ? 'code' and not public.course_content_text(section -> 'code', 150000, true) then return false; end if;
    end loop;
    entry := item -> 'exercise';
    if pg_catalog.jsonb_typeof(entry) is distinct from 'object' or not public.course_content_text(entry -> 'title', 500) or not public.course_content_text(entry -> 'instructions', 40000) or not public.course_content_texts(entry -> 'requirements', 1, 50) then return false; end if;
    entry := item -> 'quiz';
    if pg_catalog.jsonb_typeof(entry) is distinct from 'object' or not public.course_content_text(entry -> 'question', 10000) or not public.course_content_text(entry -> 'explanation', 20000) or not public.course_content_texts(entry -> 'options', 2, 20) then return false; end if;
    if pg_catalog.jsonb_typeof(entry -> 'correct') is distinct from 'number' or (entry ->> 'correct') !~ '^(0|[1-9][0-9]?)$' then return false; end if;
    quiz_answer := (entry ->> 'correct')::integer;
    if quiz_answer >= pg_catalog.jsonb_array_length(entry -> 'options') then return false; end if;
    entry := item -> 'reference';
    if pg_catalog.jsonb_typeof(entry) is distinct from 'object' or not public.course_content_text(entry -> 'label', 300) or not public.course_content_text(entry -> 'url', 2048) or (entry ->> 'url') !~ '^https://[^[:space:]@]+$' then return false; end if;
    if item ? 'illustration' then
      entry := item -> 'illustration';
      if pg_catalog.jsonb_typeof(entry) is distinct from 'object' or not public.course_content_text(entry -> 'src', 2048) or not public.course_content_text(entry -> 'alt', 2000) or not public.course_content_text(entry -> 'caption', 5000) then return false; end if;
      if (entry ->> 'src') !~ '^(https://[^[:space:]@]+|/[a-zA-Z0-9_./-]+)$' or (entry ->> 'src') ~ '(^|/)\.\.(/|$)' or (entry ->> 'src') like '//%' then return false; end if;
    end if;
    if item ? 'localLab' then
      entry := item -> 'localLab';
      if pg_catalog.jsonb_typeof(entry) is distinct from 'object' or not public.course_content_text(entry -> 'title', 300) or not public.course_content_text(entry -> 'instructions', 40000) or not public.course_content_texts(entry -> 'commands', 1, 50) or not public.course_content_texts(entry -> 'checks', 1, 50) or pg_catalog.jsonb_typeof(entry -> 'files') is distinct from 'array' then return false; end if;
      if pg_catalog.jsonb_array_length(entry -> 'files') not between 1 and 60 then return false; end if;
      if (select count(*) from pg_catalog.jsonb_array_elements(entry -> 'files')) <> (select count(distinct v ->> 'path') from pg_catalog.jsonb_array_elements(entry -> 'files') as f(v)) then return false; end if;
      for section in select value from pg_catalog.jsonb_array_elements(entry -> 'files') loop
        if pg_catalog.jsonb_typeof(section) <> 'object' or not public.course_content_text(section -> 'path', 200) or not public.course_content_text(section -> 'content', 150000, true) then return false; end if;
        if (section ->> 'path') !~ '^[a-zA-Z0-9_.-]+(/[a-zA-Z0-9_.-]+)*$' or (section ->> 'path') ~ '(^|/)\.\.?(/|$)' then return false; end if;
      end loop;
    end if;
  end loop;

  for item in select value from pg_catalog.jsonb_array_elements(catalog -> 'specializations') loop
    if pg_catalog.jsonb_typeof(item) <> 'object' or not item ?& array['id', 'title', 'shortTitle', 'description', 'outcome', 'prerequisites', 'technologies', 'color', 'lessonIds', 'capstone', 'resources'] then return false; end if;
    if not public.course_content_text(item -> 'id', 100) or (item ->> 'id') !~ '^[a-z0-9][a-z0-9_-]{0,99}$' then return false; end if;
    foreach field in array array['title', 'shortTitle', 'description', 'outcome'] loop
      if not public.course_content_text(item -> field, 10000) then return false; end if;
    end loop;
    if not public.course_content_text(item -> 'color', 20) or (item ->> 'color') not in ('rust', 'blue', 'green', 'purple') or not public.course_content_texts(item -> 'prerequisites', 1, 30) or not public.course_content_texts(item -> 'technologies', 1, 30) or not public.course_content_texts(item -> 'lessonIds', 1, 100) then return false; end if;
    for item_id in select value from pg_catalog.jsonb_array_elements_text(item -> 'lessonIds') loop
      if not (item_id = any(lesson_ids)) or item_id = any(assigned) then return false; end if;
      if not exists (select 1 from pg_catalog.jsonb_array_elements(catalog -> 'lessons') as l(v) where v ->> 'id' = item_id and v ->> 'moduleId' = 'track-' || (item ->> 'id')) then return false; end if;
      assigned := pg_catalog.array_append(assigned, item_id);
    end loop;
    entry := item -> 'capstone';
    if pg_catalog.jsonb_typeof(entry) is distinct from 'object' or not public.course_content_text(entry -> 'title', 500) or not public.course_content_text(entry -> 'description', 20000) or not public.course_content_texts(entry -> 'deliverables', 1, 30) or not public.course_content_texts(entry -> 'reviewQuestions', 1, 30) or pg_catalog.jsonb_typeof(entry -> 'milestones') is distinct from 'array' then return false; end if;
    if pg_catalog.jsonb_array_length(entry -> 'milestones') not between 1 and 30 then return false; end if;
    for milestone in select value from pg_catalog.jsonb_array_elements(entry -> 'milestones') loop
      if pg_catalog.jsonb_typeof(milestone) <> 'object' or not public.course_content_text(milestone -> 'title', 500) or not public.course_content_text(milestone -> 'acceptance', 20000) or not public.course_content_texts(milestone -> 'tasks', 1, 30) then return false; end if;
    end loop;
    if pg_catalog.jsonb_typeof(item -> 'resources') is distinct from 'array' then return false; end if;
    if pg_catalog.jsonb_array_length(item -> 'resources') not between 1 and 50 then return false; end if;
    for entry in select value from pg_catalog.jsonb_array_elements(item -> 'resources') loop
      if pg_catalog.jsonb_typeof(entry) <> 'object' or not public.course_content_text(entry -> 'label', 300) or not public.course_content_text(entry -> 'url', 2048) or (entry ->> 'url') !~ '^https://[^[:space:]@]+$' then return false; end if;
    end loop;
  end loop;
  if exists (select 1 from pg_catalog.jsonb_array_elements(catalog -> 'lessons') as l(v) where v ->> 'moduleId' like 'track-%' and not (v ->> 'id' = any(assigned))) then return false; end if;
  return true;
exception when invalid_text_representation or numeric_value_out_of_range then return false;
end;
$$;

create table public.course_releases (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  schema_version integer not null default 1 check (schema_version = 1),
  label text not null check (pg_catalog.char_length(label) between 1 and 200),
  catalog jsonb not null check (public.course_catalog_valid(catalog)),
  content_hash text not null unique check (content_hash = pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(catalog::text, 'UTF8')), 'hex')),
  created_at timestamptz not null default pg_catalog.clock_timestamp()
);

create table public.course_publication (
  id smallint primary key default 1 check (id = 1),
  release_id uuid references public.course_releases(id) on delete restrict,
  revision bigint not null default 0 check (revision >= 0),
  updated_at timestamptz not null default pg_catalog.clock_timestamp()
);
insert into public.course_publication(id) values (1);

create table public.course_publication_events (
  revision bigint primary key check (revision > 0),
  previous_release_id uuid references public.course_releases(id) on delete restrict,
  release_id uuid not null references public.course_releases(id) on delete restrict,
  published_at timestamptz not null default pg_catalog.clock_timestamp()
);

alter table public.course_releases enable row level security;
alter table public.course_publication enable row level security;
alter table public.course_publication_events enable row level security;
revoke all on table public.course_releases, public.course_publication, public.course_publication_events from public, anon, authenticated, service_role;
grant select on table public.course_releases, public.course_publication to anon, authenticated;
grant select, insert on table public.course_releases, public.course_publication_events to service_role;
grant select, update on table public.course_publication to service_role;

create policy "Read published course pointer" on public.course_publication for select to anon, authenticated using (id = 1);
create policy "Read active course release" on public.course_releases for select to anon, authenticated using (
  id = (select release_id from public.course_publication where course_publication.id = 1)
);
-- Supabase's service_role bypasses RLS. Explicit policies also keep local
-- least-privilege role tests meaningful without relying on BYPASSRLS.
create policy "Content operator reads releases" on public.course_releases for select to service_role using (true);
create policy "Content operator stages releases" on public.course_releases for insert to service_role with check (true);
create policy "Content operator reads publication" on public.course_publication for select to service_role using (true);
create policy "Content operator publishes" on public.course_publication for update to service_role using (id = 1) with check (id = 1);
create policy "Content operator reads events" on public.course_publication_events for select to service_role using (true);
create policy "Content operator appends events" on public.course_publication_events for insert to service_role with check (true);

create function public.course_release_immutable()
returns trigger language plpgsql set search_path = '' as $$
begin
  raise exception 'Course releases and publication events are immutable.' using errcode = '55000';
end;
$$;
create trigger course_release_no_changes before update or delete on public.course_releases for each row execute function public.course_release_immutable();
create trigger course_event_no_changes before update or delete on public.course_publication_events for each row execute function public.course_release_immutable();

create function public.stage_course_release(p_catalog jsonb, p_label text)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare result_id uuid; desired_hash text;
begin
  if not public.course_catalog_valid(p_catalog) then raise exception 'Invalid course catalog.' using errcode = '22023'; end if;
  if p_label is null or pg_catalog.char_length(pg_catalog.btrim(p_label)) not between 1 and 200 then raise exception 'Invalid release label.' using errcode = '22023'; end if;
  desired_hash := pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_catalog::text, 'UTF8')), 'hex');
  insert into public.course_releases(catalog, label, content_hash) values (p_catalog, p_label, desired_hash) on conflict (content_hash) do nothing returning id into result_id;
  if result_id is null then select id into result_id from public.course_releases where content_hash = desired_hash; end if;
  return result_id;
end;
$$;

create function public.publish_course_release(p_release_id uuid, p_expected_revision bigint)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare current_row public.course_publication%rowtype;
begin
  select * into strict current_row from public.course_publication where id = 1 for update;
  if p_expected_revision is null or p_expected_revision <> current_row.revision then
    raise exception 'Publication changed. Read the current revision and review again.' using errcode = '40001';
  end if;
  if not exists (select 1 from public.course_releases where id = p_release_id) then raise exception 'Unknown course release.' using errcode = '22023'; end if;
  if current_row.release_id is not distinct from p_release_id then
    return pg_catalog.jsonb_build_object('release_id', p_release_id, 'revision', current_row.revision, 'changed', false);
  end if;
  update public.course_publication set release_id = p_release_id, revision = current_row.revision + 1, updated_at = pg_catalog.clock_timestamp() where id = 1;
  insert into public.course_publication_events(revision, previous_release_id, release_id) values (current_row.revision + 1, current_row.release_id, p_release_id);
  return pg_catalog.jsonb_build_object('release_id', p_release_id, 'revision', current_row.revision + 1, 'changed', true);
end;
$$;

revoke all on function public.course_content_text(jsonb, integer, boolean), public.course_content_texts(jsonb, integer, integer), public.course_catalog_valid(jsonb), public.course_release_immutable(), public.stage_course_release(jsonb, text), public.publish_course_release(uuid, bigint) from public, anon, authenticated;
grant execute on function public.course_content_text(jsonb, integer, boolean), public.course_content_texts(jsonb, integer, integer), public.course_catalog_valid(jsonb), public.stage_course_release(jsonb, text), public.publish_course_release(uuid, bigint) to service_role;

comment on table public.course_releases is 'Immutable complete course snapshots. Learners can read only the active release; all other snapshots stay private.';
comment on table public.course_publication is 'One pointer switches the complete course atomically. revision protects concurrent publication and rollback.';
comment on table public.course_publication_events is 'Append-only publication history for operators. No learner access.';
commit;
