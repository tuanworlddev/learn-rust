begin;

create schema test_content_support;
grant usage on schema test_content_support to anon, authenticated, service_role;

create function test_content_support.assert_true(condition boolean, label text)
returns void language plpgsql as $$
begin
  if condition is distinct from true then raise exception 'FAIL: %', label; end if;
  raise notice 'PASS: %', label;
end;
$$;

create function test_content_support.assert_raises(statement text, expected_state text, label text)
returns void language plpgsql as $$
begin
  begin
    execute statement;
  exception when others then
    if sqlstate = expected_state then raise notice 'PASS: %', label; return; end if;
    raise exception 'FAIL: %, expected %, got %', label, expected_state, sqlstate;
  end;
  raise exception 'FAIL: %, statement unexpectedly succeeded', label;
end;
$$;

create table test_content_support.course_fixture(catalog jsonb, release_a uuid, release_b uuid);
insert into test_content_support.course_fixture(catalog) values ('{
  "modules":[{"id":"setup","title":"Bắt đầu","description":"Công cụ Rust","color":"orange","icon":"book","level":"Nhập môn"}],
  "lessons":[{
    "id":"hello","moduleId":"setup","title":"Xin chào Rust","description":"Chương trình đầu tiên","duration":15,
    "objectives":["Viết một hàm main"],"sections":[{"title":"Bắt đầu","text":"Dùng println! để in một dòng."}],
    "tip":"Chạy lại khi sửa mã.","exercise":{"title":"Lời chào","instructions":"In Rust","requirements":["In đúng dòng"]},
    "starterCode":"fn main() {}","solutionCode":"fn main() { println!(\"Rust\"); }","expectedOutput":"Rust","hints":["Dùng println!"],
    "quiz":{"question":"Hàm bắt đầu tên gì?","options":["main","start"],"correct":0,"explanation":"main là điểm vào chương trình."},
    "reference":{"label":"Rust Book","url":"https://doc.rust-lang.org/book/"}
  }],"specializations":[]
}'::jsonb);
grant select, update on test_content_support.course_fixture to service_role;
grant select on test_content_support.course_fixture to anon, authenticated;

select test_content_support.assert_true(public.course_catalog_valid((select catalog from test_content_support.course_fixture)), 'valid course fixture');
select test_content_support.assert_true(not public.course_catalog_valid('{}'::jsonb), 'empty catalog rejected');
select test_content_support.assert_true(not public.course_catalog_valid(pg_catalog.jsonb_set((select catalog from test_content_support.course_fixture), '{lessons,0,moduleId}', '"missing"')), 'orphan lesson rejected');
select test_content_support.assert_true(not public.course_catalog_valid(pg_catalog.jsonb_set((select catalog from test_content_support.course_fixture), '{lessons,0,quiz,correct}', '9')), 'invalid answer rejected');
select test_content_support.assert_true(not public.course_catalog_valid(pg_catalog.jsonb_set((select catalog from test_content_support.course_fixture), '{lessons,0,reference,url}', '"javascript:alert(1)"')), 'unsafe reference rejected');

set local role service_role;
update test_content_support.course_fixture set release_a = public.stage_course_release(catalog, 'A');
select test_content_support.assert_true((select release_a = public.stage_course_release(catalog, 'Repeated A') from test_content_support.course_fixture), 'staging is idempotent by content');
select test_content_support.assert_true((select count(*) = 1 from public.course_releases), 'duplicate import creates no extra release');
select test_content_support.assert_true((select release_id is null and revision = 0 from public.course_publication), 'staging does not publish');
reset role;

set local role anon;
select test_content_support.assert_true((select count(*) = 0 from public.course_releases), 'anonymous reader cannot see drafts');
select test_content_support.assert_raises('select public.stage_course_release((select catalog from test_content_support.course_fixture), ''x'')', '42501', 'anonymous reader cannot stage');
select test_content_support.assert_raises('select public.publish_course_release((select release_a from test_content_support.course_fixture), 0)', '42501', 'anonymous reader cannot publish');
select test_content_support.assert_raises('update public.course_publication set revision = 8 where id = 1', '42501', 'anonymous reader cannot change pointer');
select test_content_support.assert_raises('select * from public.course_publication_events', '42501', 'publication history is private');
reset role;

set local role authenticated;
select test_content_support.assert_true((select count(*) = 0 from public.course_releases), 'signed-in learner cannot see drafts');
select test_content_support.assert_raises('select public.publish_course_release((select release_a from test_content_support.course_fixture), 0)', '42501', 'signed-in learner cannot publish');
select test_content_support.assert_raises('delete from public.course_releases', '42501', 'signed-in learner cannot delete content');
reset role;

set local role service_role;
select test_content_support.assert_true((public.publish_course_release((select release_a from test_content_support.course_fixture), 0) ->> 'revision')::bigint = 1, 'initial publication increments revision');
select test_content_support.assert_true((public.publish_course_release((select release_a from test_content_support.course_fixture), 1) ->> 'changed')::boolean = false, 'repeat publication is a no-op');
select test_content_support.assert_true((select count(*) = 1 from public.course_publication_events), 'idempotent publish appends no duplicate event');
update test_content_support.course_fixture set release_b = public.stage_course_release(pg_catalog.jsonb_set(catalog, '{lessons,0,title}', '"Bản B"'), 'B');
reset role;

set local role anon;
select test_content_support.assert_true((select count(*) = 1 from public.course_releases), 'anonymous reader sees one active release');
select test_content_support.assert_true((select id = (select release_a from test_content_support.course_fixture) from public.course_releases), 'active A remains visible while B is staged');
select test_content_support.assert_true((select count(*) = 0 from public.course_releases where id = (select release_b from test_content_support.course_fixture)), 'direct draft ID lookup is hidden');
select test_content_support.assert_true((select count(*) = 1 from public.course_publication p join public.course_releases r on r.id = p.release_id), 'joined loader query reads one coherent release');
reset role;

set local role service_role;
select test_content_support.assert_raises('select public.publish_course_release((select release_b from test_content_support.course_fixture), 0)', '40001', 'stale publication revision rejected');
select test_content_support.assert_true((select release_id = (select release_a from test_content_support.course_fixture) and revision = 1 from public.course_publication), 'failed publish leaves pointer unchanged');
select test_content_support.assert_raises('select public.publish_course_release(''99999999-9999-4999-8999-999999999999'', 1)', '22023', 'missing release cannot be published');
select test_content_support.assert_true((select count(*) = 1 from public.course_publication_events), 'failed publish leaves history unchanged');
select test_content_support.assert_true((public.publish_course_release((select release_b from test_content_support.course_fixture), 1) ->> 'revision')::bigint = 2, 'B publication switches all content');
reset role;

set local role anon;
select test_content_support.assert_true((select count(*) = 0 from public.course_releases where id = (select release_a from test_content_support.course_fixture)), 'previous release stops being public');
select test_content_support.assert_true((select catalog #>> '{lessons,0,title}' = 'Bản B' from public.course_releases), 'new published content is returned');
reset role;

select test_content_support.assert_raises('update public.course_releases set label = ''mutated'' where id = (select release_a from test_content_support.course_fixture)', '55000', 'even owner cannot mutate an immutable release');
select test_content_support.assert_raises('delete from public.course_publication_events where revision = 1', '55000', 'history is append-only');

set local role service_role;
select test_content_support.assert_true((public.publish_course_release((select release_a from test_content_support.course_fixture), 2) ->> 'revision')::bigint = 3, 'rollback publishes previous snapshot at a new revision');
select test_content_support.assert_raises('select public.publish_course_release((select release_b from test_content_support.course_fixture), 1)', '40001', 'revision prevents ABA after rollback');
select test_content_support.assert_true((select count(*) = 3 from public.course_publication_events), 'publication and rollback events remain auditable');
select test_content_support.assert_raises('select public.stage_course_release(''{}''::jsonb, ''invalid'')', '22023', 'invalid import rejected before insertion');
select test_content_support.assert_true((select count(*) = 2 from public.course_releases), 'invalid import changes no releases');
reset role;

select test_content_support.assert_true((select bool_and(relrowsecurity) from pg_catalog.pg_class where oid in ('public.course_releases'::regclass, 'public.course_publication'::regclass, 'public.course_publication_events'::regclass)), 'RLS enabled on all content tables');
select test_content_support.assert_true(not pg_catalog.has_function_privilege('anon', 'public.publish_course_release(uuid,bigint)', 'EXECUTE'), 'anon has no RPC grant through PUBLIC');
select test_content_support.assert_true(not pg_catalog.has_function_privilege('authenticated', 'public.stage_course_release(jsonb,text)', 'EXECUTE'), 'authenticated has no staging RPC grant');

rollback;
