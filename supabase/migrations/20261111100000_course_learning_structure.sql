begin;

create function public.course_catalog_base_valid(catalog jsonb)
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

-- Schema 2 adds chapters, project evidence, assessments and interactive lesson traces.
create function public.course_content_array(value jsonb, minimum integer, maximum integer)
returns boolean language plpgsql immutable set search_path = '' as $$
begin
  if value is null or pg_catalog.jsonb_typeof(value) <> 'array' then return false; end if;
  return pg_catalog.jsonb_array_length(value) between minimum and maximum;
end;
$$;

create function public.course_content_object(value jsonb, required_fields text[], optional_fields text[] default array[]::text[])
returns boolean language plpgsql immutable set search_path = '' as $$
begin
  if value is null or pg_catalog.jsonb_typeof(value) <> 'object' then return false; end if;
  return value ?& required_fields and not exists (
    select 1 from pg_catalog.jsonb_object_keys(value) as k(name) where not (name = any(required_fields || optional_fields))
  );
end;
$$;

create function public.course_content_ids(value jsonb, allowed text[], minimum integer, maximum integer)
returns boolean language plpgsql immutable set search_path = '' as $$
declare entry jsonb; seen text[] := array[]::text[]; current_id text;
begin
  if not public.course_content_array(value, minimum, maximum) then return false; end if;
  for entry in select v from pg_catalog.jsonb_array_elements(value) as j(v) loop
    if not public.course_content_text(entry, 100) then return false; end if;
    current_id := entry #>> '{}';
    if current_id !~ '^[a-z0-9][a-z0-9_-]{0,99}$' or current_id = any(seen) then return false; end if;
    if allowed is not null and not (current_id = any(allowed)) then return false; end if;
    seen := pg_catalog.array_append(seen, current_id);
  end loop;
  return true;
end;
$$;

create function public.course_simulation_valid(value jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare node jsonb; scenario jsonb; step jsonb; entry jsonb; node_ids text[];
begin
  if not public.course_content_object(value, array['title','description','kind','nodes','scenarios'])
    or not public.course_content_text(value->'title', 500)
    or not public.course_content_text(value->'description', 5000)
    or not public.course_content_text(value->'kind', 30)
    or (value->>'kind') not in ('sequence','pipeline','memory','timeline')
    or not public.course_content_array(value->'nodes', 2, 8)
    or not public.course_content_array(value->'scenarios', 1, 6) then return false; end if;
  if not public.course_content_ids((select pg_catalog.jsonb_agg(v->'id') from pg_catalog.jsonb_array_elements(value->'nodes') as n(v)), null, 2, 8)
    or not public.course_content_ids((select pg_catalog.jsonb_agg(v->'id') from pg_catalog.jsonb_array_elements(value->'scenarios') as s(v)), null, 1, 6) then return false; end if;
  select pg_catalog.array_agg(v->>'id') into node_ids from pg_catalog.jsonb_array_elements(value->'nodes') as n(v);
  for node in select v from pg_catalog.jsonb_array_elements(value->'nodes') as n(v) loop
    if not public.course_content_object(node,array['id','label','detail']) or not public.course_content_text(node->'label',300)
      or not public.course_content_text(node->'detail',3000) then return false; end if;
  end loop;
  for scenario in select v from pg_catalog.jsonb_array_elements(value->'scenarios') as s(v) loop
    if not public.course_content_object(scenario,array['id','label','steps']) or not public.course_content_text(scenario->'label',500)
      or not public.course_content_array(scenario->'steps',2,20) then return false; end if;
    for step in select v from pg_catalog.jsonb_array_elements(scenario->'steps') as s(v) loop
      if not public.course_content_object(step,array['title','description','activeNodeIds','values'])
        or not public.course_content_text(step->'title',500) or not public.course_content_text(step->'description',6000)
        or not public.course_content_ids(step->'activeNodeIds',node_ids,0,8)
        or not public.course_content_array(step->'values',0,16) then return false; end if;
      for entry in select v from pg_catalog.jsonb_array_elements(step->'values') as e(v) loop
        if not public.course_content_object(entry,array['label','value']) or not public.course_content_text(entry->'label',300)
          or not public.course_content_text(entry->'value',3000,true) then return false; end if;
      end loop;
    end loop;
  end loop;
  return true;
end;
$$;

create function public.course_track_structure_valid(track jsonb, lessons jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare chapter jsonb; project jsonb; item jsonb; criterion jsonb; assessment jsonb; question jsonb; skill jsonb;
  own_ids text[]; project_ids text[]; chapter_order jsonb; covered_ids text[]; critical boolean;
begin
  if not track ?| array['chapters','projects','assessment'] then return true; end if;
  if not track ?& array['chapters','projects','assessment'] then return false; end if;
  if not public.course_content_array(track->'chapters',1,30) or not public.course_content_array(track->'projects',1,12) then return false; end if;
  select pg_catalog.array_agg(v) into own_ids from pg_catalog.jsonb_array_elements_text(track->'lessonIds') as l(v);
  if not public.course_content_ids((select pg_catalog.jsonb_agg(v->'id') from pg_catalog.jsonb_array_elements(track->'chapters') as c(v)),null,1,30) then return false; end if;
  chapter_order := '[]'::jsonb;
  for chapter in select v from pg_catalog.jsonb_array_elements(track->'chapters') as c(v) loop
    if not public.course_content_object(chapter,array['id','title','description','lessonIds','outcomes'])
      or not public.course_content_text(chapter->'title',500) or not public.course_content_text(chapter->'description',10000)
      or not public.course_content_texts(chapter->'outcomes',1,20)
      or not public.course_content_ids(chapter->'lessonIds',own_ids,1,100) then return false; end if;
    chapter_order := chapter_order || (chapter->'lessonIds');
  end loop;
  if chapter_order <> track->'lessonIds' then return false; end if;
  if not public.course_content_ids((select pg_catalog.jsonb_agg(v->'id') from pg_catalog.jsonb_array_elements(track->'projects') as p(v)),null,1,12)
    or not public.course_content_ids((select pg_catalog.jsonb_agg(v->'labLessonId') from pg_catalog.jsonb_array_elements(track->'projects') as p(v)),own_ids,1,12) then return false; end if;
  select pg_catalog.array_agg(v->>'id') into project_ids from pg_catalog.jsonb_array_elements(track->'projects') as p(v);
  for project in select v from pg_catalog.jsonb_array_elements(track->'projects') as p(v) loop
    if not public.course_content_object(project,array['id','title','description','level','estimatedHours','labLessonId','requirements','milestones','testCases','rubric','deliverables'])
      or not public.course_content_text(project->'title',500) or not public.course_content_text(project->'description',20000)
      or not public.course_content_text(project->'level',30) or (project->>'level') not in ('guided','independent','capstone')
      or pg_catalog.jsonb_typeof(project->'estimatedHours') is distinct from 'number'
      or (project->>'estimatedHours')::numeric not between 1 and 1000
      or pg_catalog.left(project->>'id',pg_catalog.length(track->>'id')+9) <> (track->>'id') || '-project-'
      or exists(select 1 from pg_catalog.jsonb_array_elements(lessons) as l(v) where v->>'id'=project->>'id')
      or not exists(select 1 from pg_catalog.jsonb_array_elements(lessons) as l(v) where v->>'id'=project->>'labLessonId' and v ? 'localLab')
      or not public.course_content_texts(project->'requirements',1,40) or not public.course_content_texts(project->'deliverables',1,30)
      or not public.course_content_array(project->'milestones',1,20) or not public.course_content_array(project->'testCases',3,30)
      or not public.course_content_array(project->'rubric',3,8) then return false; end if;
    for item in select v from pg_catalog.jsonb_array_elements(project->'milestones') as m(v) loop
      if not public.course_content_object(item,array['title','tasks','acceptance']) or not public.course_content_text(item->'title',500)
        or not public.course_content_texts(item->'tasks',1,30) or not public.course_content_text(item->'acceptance',20000) then return false; end if;
    end loop;
    for item in select v from pg_catalog.jsonb_array_elements(project->'testCases') as t(v) loop
      if not public.course_content_object(item,array['name','setup','expected']) or not public.course_content_text(item->'name',12000)
        or not public.course_content_text(item->'setup',12000) or not public.course_content_text(item->'expected',12000) then return false; end if;
    end loop;
    if not public.course_content_ids((select pg_catalog.jsonb_agg(v->'id') from pg_catalog.jsonb_array_elements(project->'rubric') as r(v)),null,3,8) then return false; end if;
    critical := false;
    for criterion in select v from pg_catalog.jsonb_array_elements(project->'rubric') as r(v) loop
      if not public.course_content_object(criterion,array['id','title','criteria','critical'])
        or not public.course_content_text(criterion->'title',500) or not public.course_content_texts(criterion->'criteria',1,20)
        or pg_catalog.jsonb_typeof(criterion->'critical') is distinct from 'boolean' then return false; end if;
      critical := critical or (criterion->>'critical')::boolean;
    end loop;
    if not critical then return false; end if;
  end loop;
  assessment := track->'assessment';
  if not public.course_content_object(assessment,array['title','instructions','passPercent','questions','skills'])
    or not public.course_content_text(assessment->'title',500) or not public.course_content_text(assessment->'instructions',20000)
    or pg_catalog.jsonb_typeof(assessment->'passPercent') is distinct from 'number'
    or (assessment->>'passPercent') !~ '^[0-9]{2,3}$' or (assessment->>'passPercent')::integer not between 60 and 100
    or not public.course_content_array(assessment->'questions',6,40) or not public.course_content_array(assessment->'skills',3,30) then return false; end if;
  if not public.course_content_ids((select pg_catalog.jsonb_agg(v->'id') from pg_catalog.jsonb_array_elements(assessment->'questions') as q(v)),null,6,40)
    or not public.course_content_ids((select pg_catalog.jsonb_agg(v->'id') from pg_catalog.jsonb_array_elements(assessment->'skills') as s(v)),null,3,30) then return false; end if;
  covered_ids := array[]::text[];
  for question in select v from pg_catalog.jsonb_array_elements(assessment->'questions') as q(v) loop
    if not public.course_content_object(question,array['id','question','options','correct','explanation','lessonIds'])
      or not public.course_content_text(question->'question',10000) or not public.course_content_text(question->'explanation',20000)
      or not public.course_content_texts(question->'options',2,8) or not public.course_content_ids(question->'lessonIds',own_ids,1,100)
      or pg_catalog.jsonb_typeof(question->'correct') is distinct from 'number' or (question->>'correct') !~ '^[0-7]$'
      or (question->>'correct')::integer >= pg_catalog.jsonb_array_length(question->'options')
      or exists(select 1 from pg_catalog.jsonb_array_elements(lessons) as l(v) where v->>'id'=question->>'id') then return false; end if;
    covered_ids := covered_ids || array(select v from pg_catalog.jsonb_array_elements_text(question->'lessonIds') as l(v));
  end loop;
  for chapter in select v from pg_catalog.jsonb_array_elements(track->'chapters') as c(v) loop
    if not exists(select 1 from pg_catalog.jsonb_array_elements_text(chapter->'lessonIds') as l(v) where v=any(covered_ids)) then return false; end if;
  end loop;
  for skill in select v from pg_catalog.jsonb_array_elements(assessment->'skills') as s(v) loop
    if not public.course_content_object(skill,array['id','title','description','lessonIds','projectIds','required'])
      or not public.course_content_text(skill->'title',500) or not public.course_content_text(skill->'description',12000)
      or not public.course_content_ids(skill->'lessonIds',own_ids,1,100) or not public.course_content_ids(skill->'projectIds',project_ids,1,12)
      or pg_catalog.jsonb_typeof(skill->'required') is distinct from 'boolean' then return false; end if;
  end loop;
  return true;
exception when invalid_text_representation or numeric_value_out_of_range then return false;
end;
$$;

create or replace function public.course_catalog_valid(catalog jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare lesson jsonb; track jsonb; ids jsonb;
begin
  if not public.course_catalog_base_valid(catalog) then return false; end if;
  for lesson in select v from pg_catalog.jsonb_array_elements(catalog->'lessons') as l(v) loop
    if lesson ? 'simulation' and not public.course_simulation_valid(lesson->'simulation') then return false; end if;
  end loop;
  for track in select v from pg_catalog.jsonb_array_elements(catalog->'specializations') as t(v) loop
    if not public.course_track_structure_valid(track,catalog->'lessons') then return false; end if;
  end loop;
  select coalesce(pg_catalog.jsonb_agg(p.v->'id'),'[]'::jsonb) into ids
    from pg_catalog.jsonb_array_elements(catalog->'specializations') as t(v),
    lateral pg_catalog.jsonb_array_elements(coalesce(t.v->'projects','[]'::jsonb)) as p(v);
  if not public.course_content_ids(ids,null,0,1200) then return false; end if;
  select coalesce(pg_catalog.jsonb_agg(q.v->'id'),'[]'::jsonb) into ids
    from pg_catalog.jsonb_array_elements(catalog->'specializations') as t(v),
    lateral pg_catalog.jsonb_array_elements(coalesce(t.v->'assessment'->'questions','[]'::jsonb)) as q(v);
  return public.course_content_ids(ids,null,0,4000);
end;
$$;

alter table public.course_releases drop constraint course_releases_schema_version_check;
alter table public.course_releases add constraint course_releases_schema_version_check check (schema_version in (1,2));
alter table public.course_releases alter column schema_version set default 2;

create or replace function public.stage_course_release(p_catalog jsonb, p_label text)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare result_id uuid; desired_hash text; version integer := 1;
begin
  if not public.course_catalog_valid(p_catalog) then raise exception 'Invalid course catalog.' using errcode = '22023'; end if;
  if p_label is null or pg_catalog.char_length(pg_catalog.btrim(p_label)) not between 1 and 200 then raise exception 'Invalid release label.' using errcode = '22023'; end if;
  if exists(select 1 from pg_catalog.jsonb_array_elements(p_catalog->'specializations') as t(v) where v ? 'chapters')
    or exists(select 1 from pg_catalog.jsonb_array_elements(p_catalog->'lessons') as l(v) where v ? 'simulation') then version := 2; end if;
  desired_hash := pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_catalog::text,'UTF8')),'hex');
  insert into public.course_releases(catalog,label,content_hash,schema_version) values(p_catalog,p_label,desired_hash,version)
    on conflict(content_hash) do nothing returning id into result_id;
  if result_id is null then select id into result_id from public.course_releases where content_hash=desired_hash; end if;
  return result_id;
end;
$$;

revoke all on function public.course_catalog_base_valid(jsonb), public.course_content_array(jsonb,integer,integer),
  public.course_content_object(jsonb,text[],text[]), public.course_content_ids(jsonb,text[],integer,integer),
  public.course_simulation_valid(jsonb), public.course_track_structure_valid(jsonb,jsonb), public.course_catalog_valid(jsonb),
  public.stage_course_release(jsonb,text) from public, anon, authenticated;
grant execute on function public.course_catalog_base_valid(jsonb), public.course_content_array(jsonb,integer,integer),
  public.course_content_object(jsonb,text[],text[]), public.course_content_ids(jsonb,text[],integer,integer),
  public.course_simulation_valid(jsonb), public.course_track_structure_valid(jsonb,jsonb), public.course_catalog_valid(jsonb),
  public.stage_course_release(jsonb,text) to service_role;
comment on column public.course_releases.schema_version is '1: original catalog; 2: chapters, project evidence, assessments and simulations. Immutable releases allow rollback.';
commit;
