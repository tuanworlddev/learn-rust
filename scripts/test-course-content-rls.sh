#!/usr/bin/env bash
set -euo pipefail

# Isolated PostgreSQL contract test. No live Supabase credentials or database.
CONTENT_REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
CONTENT_CONTAINER_ID=""
cleanup() {
  if [[ -n "$CONTENT_CONTAINER_ID" ]]; then docker rm --force --volumes "$CONTENT_CONTAINER_ID" >/dev/null 2>&1 || true; fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
if ! command -v docker >/dev/null 2>&1 || ! docker info --format '{{.ServerVersion}}' >/dev/null 2>&1; then
  echo "Docker is required for the isolated PostgreSQL content test." >&2
  exit 1
fi
CONTENT_CONTAINER_ID="$(docker run --detach --rm --label learn-rust.test=course-content --network none --tmpfs /var/lib/postgresql/data:rw,size=256m --env POSTGRES_HOST_AUTH_METHOD=trust postgres:17-bookworm)"
CONTENT_READY=false
for CONTENT_ATTEMPT in {1..45}; do
  if docker exec "$CONTENT_CONTAINER_ID" sh -c 'test "$(cat /proc/1/comm)" = postgres && pg_isready -U postgres -d postgres -q' >/dev/null 2>&1; then CONTENT_READY=true; break; fi
  sleep 1
done
if [[ "$CONTENT_READY" != true ]]; then echo "PostgreSQL was not ready within 45 seconds." >&2; exit 1; fi
content_psql() {
  docker exec --interactive "$CONTENT_CONTAINER_ID" psql --no-psqlrc --username postgres --dbname postgres --set ON_ERROR_STOP=1 --quiet --tuples-only --no-align
}
content_psql <<'SQL'
create role anon nologin;
create role authenticated nologin;
-- Deliberately no BYPASSRLS: exercise the explicit operator policies as well.
create role service_role nologin;
SQL
content_psql < "$CONTENT_REPO_ROOT/supabase/migrations/20261111000000_course_content.sql"
content_psql < "$CONTENT_REPO_ROOT/supabase/tests/course_content_rls.sql"
echo "PASS: immutable content releases, RLS, atomic publication, conflict handling and rollback."
echo "This does not verify a live Supabase API gateway, credentials or deployment."
