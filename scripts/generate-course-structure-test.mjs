#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readCourseSource } from "./lib/read-course-source.mjs";
const catalog = readCourseSource();
const track = catalog.specializations.find(item => item.chapters && item.assessment);
if (!track) throw new Error("Expanded course fixture is missing");
const fixture = {
  modules: catalog.modules.filter(item => item.id === "track-" + track.id),
  lessons: catalog.lessons.filter(item => track.lessonIds.includes(item.id)),
  specializations: [track],
};
const json = JSON.stringify(fixture);
const tag = "$catalog_" + createHash("sha256").update(json).digest("hex").slice(0,16) + "$";
const simulationIndex = fixture.lessons.findIndex(lesson => lesson.simulation);
if (simulationIndex < 0) throw new Error("Simulation fixture is missing");
console.log(`begin;
create temporary table structure_fixture(catalog jsonb);
insert into structure_fixture values (${tag}${json}${tag}::jsonb);
grant select on structure_fixture to service_role;
do $test$
declare c jsonb := (select catalog from structure_fixture); bad jsonb; release uuid;
begin
  if not public.course_catalog_valid(c) then raise exception 'FAIL: expanded catalog must pass database validation'; end if;
  bad := pg_catalog.jsonb_set(c,'{specializations,0,chapters,0,lessonIds}','["missing-lesson"]');
  if public.course_catalog_valid(bad) then raise exception 'FAIL: orphan chapter lesson'; end if;
  bad := pg_catalog.jsonb_set(c,'{specializations,0,projects,0,labLessonId}','"missing-lesson"');
  if public.course_catalog_valid(bad) then raise exception 'FAIL: unknown lab'; end if;
  bad := pg_catalog.jsonb_set(c,'{specializations,0,assessment,questions,0,correct}','99');
  if public.course_catalog_valid(bad) then raise exception 'FAIL: invalid assessment answer'; end if;
  bad := pg_catalog.jsonb_set(c,'{specializations,0,assessment,questions,0,lessonIds}','["other-course-lesson"]');
  if public.course_catalog_valid(bad) then raise exception 'FAIL: cross-course remediation'; end if;
  bad := pg_catalog.jsonb_set(c,'{specializations,0,assessment,skills,0,projectIds}','["missing-project"]');
  if public.course_catalog_valid(bad) then raise exception 'FAIL: missing skill evidence'; end if;
  bad := pg_catalog.jsonb_set(c,'{lessons,${simulationIndex},simulation,scenarios,0,steps,0,activeNodeIds}','["unknown-node"]');
  if public.course_catalog_valid(bad) then raise exception 'FAIL: invalid simulation trace'; end if;
  if pg_catalog.has_function_privilege('anon','public.course_track_structure_valid(jsonb,jsonb)','EXECUTE')
    or pg_catalog.has_function_privilege('authenticated','public.course_catalog_base_valid(jsonb)','EXECUTE')
    then raise exception 'FAIL: validation helper exposed to learner role'; end if;
  raise notice 'PASS: real expanded course, chapter/project/exam cross references, simulation trace and helper privileges';
end;
$test$;
set local role service_role;
do $test$
declare release uuid;
begin
  release := public.stage_course_release((select catalog from structure_fixture),'Expanded course test');
  if (select schema_version from public.course_releases where id=release) <> 2 then raise exception 'FAIL: structured release must use schema 2'; end if;
  raise notice 'PASS: operator stages schema 2 through unchanged RPC signature';
end;
$test$;
reset role;
rollback;`);
