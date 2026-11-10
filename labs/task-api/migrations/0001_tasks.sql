CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
    done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Deliberately no foreign key: an event remains after its task is deleted.
-- This is a small audit example, not an immutable compliance log.
CREATE TABLE task_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('created', 'updated', 'deleted')),
    done INTEGER NOT NULL CHECK (done IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX task_events_task_id ON task_events(task_id);
