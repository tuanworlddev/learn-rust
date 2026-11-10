#!/usr/bin/env bash
set -euo pipefail

# This creates a disposable PostgreSQL instance, not a live Supabase project.
# No host ports, bind mounts, persistent volumes or credentials are used.
RLS_REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
RLS_CONTAINER_ID=""

cleanup() {
  if [[ -n "$RLS_CONTAINER_ID" ]]; then
    docker rm --force --volumes "$RLS_CONTAINER_ID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. This test does not connect to an external database." >&2
  exit 1
fi
if ! docker info --format '{{.ServerVersion}}' >/dev/null 2>&1; then
  echo "Docker daemon is not available. Start Docker and run this script again." >&2
  exit 1
fi

echo "Starting isolated PostgreSQL 17 for the learning_progress RLS contract."
RLS_CONTAINER_ID="$(docker run --detach --rm \
  --label learn-rust.test=rls \
  --network none \
  --tmpfs /var/lib/postgresql/data:rw,size=256m \
  --env POSTGRES_HOST_AUTH_METHOD=trust \
  postgres:17-bookworm)"

RLS_READY=false
for RLS_ATTEMPT in {1..45}; do
  # initdb starts a temporary socket-only server. Wait for the final server
  # (PID 1 = postgres) so migration does not race the initialization restart.
  if docker exec "$RLS_CONTAINER_ID" sh -c \
    'test "$(cat /proc/1/comm)" = postgres && pg_isready -U postgres -d postgres -q' \
    >/dev/null 2>&1; then
    RLS_READY=true
    break
  fi
  sleep 1
done
if [[ "$RLS_READY" != true ]]; then
  echo "PostgreSQL did not become ready within 45 seconds." >&2
  docker logs --tail 80 "$RLS_CONTAINER_ID" >&2 || true
  exit 1
fi

rls_psql() {
  docker exec --interactive "$RLS_CONTAINER_ID" \
    psql --no-psqlrc --username postgres --dbname postgres \
    --set ON_ERROR_STOP=1 --quiet --tuples-only --no-align
}

# Minimal test doubles for Supabase's authenticated roles and auth.uid().
# Claims below are synthetic session values, never a signed JWT/Auth test.
rls_psql <<'SQL'
create role anon nologin;
create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid()
returns uuid
language sql stable
set search_path = ''
as $$
  select nullif(pg_catalog.current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
SQL

rls_psql < "$RLS_REPO_ROOT/supabase/migrations/20261110000000_learning_progress.sql"
rls_psql < "$RLS_REPO_ROOT/supabase/tests/learning_progress_rls.sql"

echo "PASS: PostgreSQL RLS, constraints, timestamps and optimistic-write contract."
echo "This does not verify live Supabase Auth, email delivery, API gateway or JWT validation."
