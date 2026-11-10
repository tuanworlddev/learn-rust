-- Run only through scripts/test-supabase-rls.sh in its disposable database.
-- The script installs isolated auth.users/auth.uid() test doubles, then the
-- real application migration. Roles below are not table owners/superusers.
\set ON_ERROR_STOP on

create schema test_support;
grant usage on schema test_support to anon, authenticated;

create function test_support.assert_true(value boolean, description text)
returns void language plpgsql as $$
begin
  if value is distinct from true then
    raise exception 'FAIL: %', description;
  end if;
  raise notice 'PASS: %', description;
end;
$$;

create function test_support.expect_state(command text, expected text, description text)
returns void language plpgsql as $$
declare observed text;
begin
  begin
    execute command;
  exception when others then
    get stacked diagnostics observed = returned_sqlstate;
  end;
  if observed is distinct from expected then
    raise exception 'FAIL: % (expected SQLSTATE %, got %)', description, expected, coalesce(observed, 'success');
  end if;
  raise notice 'PASS: %', description;
end;
$$;

create function test_support.snapshot()
returns jsonb language sql immutable as $$
  select '{"completed":["hello-rust"],"solved":[],"bookmarks":[],"quizzes":{},"lastLesson":"hello-rust","goal":30,"minutes":{"2024-02-29":5},"notes":"Fixture notes","finishedProjects":[]}'::jsonb;
$$;

grant execute on all functions in schema test_support to anon, authenticated;

insert into auth.users(id) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');

select test_support.assert_true(
  (select relrowsecurity from pg_catalog.pg_class where oid = 'public.learning_progress'::regclass),
  'row-level security is enabled'
);
select test_support.assert_true(
  not pg_catalog.has_table_privilege('anon', 'public.learning_progress', 'SELECT')
  and not pg_catalog.has_table_privilege('anon', 'public.learning_progress', 'INSERT')
  and not pg_catalog.has_table_privilege('anon', 'public.learning_progress', 'UPDATE')
  and not pg_catalog.has_table_privilege('anon', 'public.learning_progress', 'DELETE'),
  'anonymous role has no table privileges'
);
select test_support.assert_true(
  pg_catalog.has_table_privilege('authenticated', 'public.learning_progress', 'SELECT')
  and pg_catalog.has_table_privilege('authenticated', 'public.learning_progress', 'INSERT')
  and pg_catalog.has_table_privilege('authenticated', 'public.learning_progress', 'UPDATE')
  and not pg_catalog.has_table_privilege('authenticated', 'public.learning_progress', 'DELETE')
  and not pg_catalog.has_table_privilege('authenticated', 'public.learning_progress', 'TRUNCATE'),
  'authenticated role has only the required table operations'
);

set role anon;
select test_support.expect_state('select * from public.learning_progress', '42501', 'anonymous SELECT is denied');
select test_support.expect_state(
  $q$insert into public.learning_progress(user_id, snapshot) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', test_support.snapshot())$q$,
  '42501', 'anonymous INSERT is denied'
);
select test_support.expect_state('update public.learning_progress set version = 1', '42501', 'anonymous UPDATE is denied');
select test_support.expect_state('delete from public.learning_progress', '42501', 'anonymous DELETE is denied');

reset role;
set role authenticated;
select pg_catalog.set_config('request.jwt.claim.sub', '', false) as ignored \gset
select test_support.assert_true((select count(*) = 0 from public.learning_progress), 'authenticated role without a subject sees no rows');
select test_support.expect_state(
  $q$insert into public.learning_progress(user_id, snapshot) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', test_support.snapshot())$q$,
  '42501', 'authenticated role without a subject cannot insert'
);

select pg_catalog.set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', false) as ignored \gset
select test_support.assert_true(
  current_user = 'authenticated'
  and not (select rolsuper or rolbypassrls from pg_catalog.pg_roles where rolname = current_user),
  'owner-access tests run as a role subject to RLS'
);
insert into public.learning_progress(user_id, snapshot, updated_at)
values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', test_support.snapshot(), '2000-01-01T00:00:00Z');
select test_support.assert_true(
  (select count(*) = 1 from public.learning_progress where user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  'A can insert and read the A row'
);
select test_support.assert_true(
  (select updated_at > '2000-01-01T00:00:00Z'::timestamptz from public.learning_progress),
  'insert trigger rejects a client-chosen timestamp'
);
select updated_at::text as a_original_stamp from public.learning_progress \gset

select test_support.expect_state(
  $q$insert into public.learning_progress(user_id, snapshot) values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', test_support.snapshot())$q$,
  '42501', 'A cannot insert a row owned by B'
);
select test_support.expect_state(
  $q$update public.learning_progress set user_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' where user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'$q$,
  '42501', 'A cannot reassign the A row to B'
);
select test_support.expect_state(
  $q$delete from public.learning_progress where user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'$q$,
  '42501', 'A cannot delete even its own row'
);
select test_support.expect_state('truncate public.learning_progress', '42501', 'authenticated TRUNCATE is denied');

select pg_catalog.set_config('request.jwt.claim.sub', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', false) as ignored \gset
select test_support.assert_true((select count(*) = 0 from public.learning_progress), 'B cannot read the A row');
with changed as (
  update public.learning_progress set snapshot = test_support.snapshot()
  where user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  returning user_id
)
select test_support.assert_true((select count(*) = 0 from changed), 'B cannot update the A row');
select test_support.expect_state(
  $q$insert into public.learning_progress(user_id, snapshot) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', test_support.snapshot()) on conflict(user_id) do update set snapshot = excluded.snapshot$q$,
  '42501', 'B cannot upsert over the A row'
);
insert into public.learning_progress(user_id, snapshot)
values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', test_support.snapshot());
select test_support.assert_true(
  (select count(*) = 1 and bool_and(user_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid) from public.learning_progress),
  'B can insert and read only the B row'
);

select pg_catalog.set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', false) as ignored \gset
update public.learning_progress
set snapshot = pg_catalog.jsonb_set(snapshot, '{notes}', '"Updated by A"'::jsonb), updated_at = '2000-01-01T00:00:00Z'
where user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
select test_support.assert_true(
  (select snapshot ->> 'notes' = 'Updated by A' and updated_at > :'a_original_stamp'::timestamptz from public.learning_progress),
  'A can update its row and updated_at advances on a new statement'
);

begin;
select updated_at::text as a_transaction_before from public.learning_progress \gset
update public.learning_progress set snapshot = pg_catalog.jsonb_set(snapshot, '{notes}', '"Same transaction"'::jsonb);
select updated_at::text as a_transaction_middle from public.learning_progress \gset
update public.learning_progress set snapshot = pg_catalog.jsonb_set(snapshot, '{notes}', '"Updated by A"'::jsonb);
select test_support.assert_true(
  (select updated_at > :'a_transaction_middle'::timestamptz from public.learning_progress)
  and :'a_transaction_middle'::timestamptz > :'a_transaction_before'::timestamptz,
  'timestamp token advances on every write within the same transaction'
);
commit;

select updated_at::text as a_current_stamp from public.learning_progress \gset

with changed as (
  update public.learning_progress set snapshot = test_support.snapshot()
  where user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' and updated_at = :'a_original_stamp'::timestamptz
  returning user_id
)
select test_support.assert_true((select count(*) = 0 from changed), 'stale optimistic update changes no rows');
with changed as (
  update public.learning_progress set snapshot = pg_catalog.jsonb_set(snapshot, '{notes}', '"CAS update"'::jsonb)
  where user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' and updated_at = :'a_current_stamp'::timestamptz
  returning user_id
)
select test_support.assert_true((select count(*) = 1 from changed), 'current optimistic update changes one owned row');
select test_support.expect_state(
  $q$insert into public.learning_progress(user_id, snapshot) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', test_support.snapshot())$q$,
  '23505', 'racing initial INSERT reports a duplicate instead of replacing the backup'
);

select test_support.expect_state('update public.learning_progress set version = 2', '23514', 'unsupported snapshot version is rejected');
select test_support.expect_state('update public.learning_progress set snapshot = null', '23502', 'SQL NULL snapshot is rejected');
select test_support.expect_state(
  $q$update public.learning_progress set snapshot = 'null'::jsonb$q$,
  '23514', 'JSON null snapshot is rejected'
);
select test_support.expect_state(
  $q$update public.learning_progress set snapshot = test_support.snapshot() - 'notes'$q$,
  '23514', 'missing core field is rejected'
);
select test_support.expect_state(
  $q$update public.learning_progress set snapshot = test_support.snapshot() || '{"drafts":"not allowed"}'::jsonb$q$,
  '23514', 'extra snapshot fields are rejected'
);
select test_support.expect_state(
  $q$update public.learning_progress set snapshot = pg_catalog.jsonb_set(test_support.snapshot(), '{goal}', '99'::jsonb)$q$,
  '23514', 'unsupported daily goal is rejected'
);
select test_support.expect_state(
  $q$update public.learning_progress set snapshot = pg_catalog.jsonb_set(test_support.snapshot(), '{minutes}', '{"2025-02-29":5}'::jsonb)$q$,
  '23514', 'invalid calendar date is rejected'
);
select test_support.expect_state(
  $q$update public.learning_progress set snapshot = pg_catalog.jsonb_set(test_support.snapshot(), '{minutes}', '{"2024-02-29":1441}'::jsonb)$q$,
  '23514', 'more than 1440 daily minutes is rejected'
);
select test_support.expect_state(
  $q$update public.learning_progress set snapshot = pg_catalog.jsonb_set(test_support.snapshot(), '{quizzes}', '{"hello-rust":-1}'::jsonb)$q$,
  '23514', 'negative quiz values are rejected'
);
select test_support.expect_state(
  $q$update public.learning_progress set snapshot = pg_catalog.jsonb_set(test_support.snapshot(), '{completed}', '["__proto__"]'::jsonb)$q$,
  '23514', 'invalid lesson identifiers are rejected'
);
select test_support.expect_state(
  $q$update public.learning_progress set snapshot = pg_catalog.jsonb_set(test_support.snapshot(), '{notes}', pg_catalog.to_jsonb(pg_catalog.repeat('a', 120001)))$q$,
  '23514', 'notes character limit is enforced'
);
select test_support.expect_state(
  $q$update public.learning_progress set snapshot = pg_catalog.jsonb_set(test_support.snapshot(), '{notes}', pg_catalog.to_jsonb(pg_catalog.repeat('🦀', 70000)))$q$,
  '23514', 'UTF-8 payload byte limit is enforced independently of character count'
);
select test_support.expect_state(
  $q$update public.learning_progress set snapshot = pg_catalog.jsonb_set(test_support.snapshot(), '{completed}', (select pg_catalog.jsonb_agg('lesson-' || value::text) from pg_catalog.generate_series(1,1001) as value))$q$,
  '23514', 'array length limit is enforced'
);
select test_support.assert_true(
  (select snapshot ->> 'notes' = 'CAS update' and version = 1 from public.learning_progress),
  'rejected writes leave the last successful backup intact'
);

reset role;
select test_support.assert_true((select count(*) = 2 from public.learning_progress), 'both accounts retain separate rows');
select test_support.assert_true(
  (select snapshot ->> 'notes' = 'Fixture notes' from public.learning_progress where user_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
  'A operations and failures do not change B data'
);
