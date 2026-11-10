use axum::{
    Json,
    extract::{
        Path, Query, State,
        rejection::{JsonRejection, PathRejection, QueryRejection},
    },
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

use crate::{AppState, error::AppError};

#[derive(Debug, Serialize, FromRow)]
pub struct Task {
    id: i64,
    title: String,
    done: bool,
    created_at: String,
    updated_at: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CreateTask {
    title: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct UpdateTask {
    title: Option<String>,
    done: Option<bool>,
}

#[derive(Default, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ListQuery {
    limit: Option<i64>,
    after: Option<i64>,
}

#[derive(Serialize)]
pub struct TaskPage {
    items: Vec<Task>,
    next_after: Option<i64>,
}

fn validate_title(value: String) -> Result<String, AppError> {
    let title = value.trim();
    // Count Unicode scalar values, not UTF-8 bytes or displayed grapheme clusters.
    if !(1..=200).contains(&title.chars().count()) || title.contains('\0') {
        return Err(AppError::BadRequest(
            "title cần 1–200 ký tự Unicode sau trim và không chứa NUL.",
        ));
    }
    Ok(title.to_owned())
}

fn task_id(path: Result<Path<i64>, PathRejection>) -> Result<i64, AppError> {
    let Path(id) = path.map_err(|_| AppError::BadRequest("id cần là số nguyên dương."))?;
    if id <= 0 {
        return Err(AppError::BadRequest("id cần là số nguyên dương."));
    }
    Ok(id)
}

pub async fn list(
    State(state): State<AppState>,
    query: Result<Query<ListQuery>, QueryRejection>,
) -> Result<Json<TaskPage>, AppError> {
    let Query(query) =
        query.map_err(|_| AppError::BadRequest("Query chỉ nhận limit và after dạng số nguyên."))?;
    let limit = query.limit.unwrap_or(20);
    let after = query.after.unwrap_or(0);
    if !(1..=100).contains(&limit) || after < 0 {
        return Err(AppError::BadRequest(
            "limit cần trong 1–100; after cần >= 0.",
        ));
    }
    // One extra row tells us whether a subsequent page exists.
    let mut items = sqlx::query_as::<_, Task>(
        "SELECT id, title, done, created_at, updated_at FROM tasks WHERE id > ? ORDER BY id ASC LIMIT ?",
    )
    .bind(after)
    .bind(limit + 1)
    .fetch_all(&state.pool)
    .await?;
    let next_after = if items.len() > limit as usize {
        items.truncate(limit as usize);
        items.last().map(|task| task.id)
    } else {
        None
    };
    Ok(Json(TaskPage { items, next_after }))
}

pub async fn get_one(
    State(state): State<AppState>,
    path: Result<Path<i64>, PathRejection>,
) -> Result<Json<Task>, AppError> {
    let id = task_id(path)?;
    let task = sqlx::query_as::<_, Task>(
        "SELECT id, title, done, created_at, updated_at FROM tasks WHERE id = ?",
    )
    .bind(id)
    .fetch_optional(&state.pool)
    .await?
    .ok_or(AppError::NotFound)?;
    Ok(Json(task))
}

pub async fn create(
    State(state): State<AppState>,
    payload: Result<Json<CreateTask>, JsonRejection>,
) -> Result<(StatusCode, Json<Task>), AppError> {
    let Json(payload) = payload?;
    let title = validate_title(payload.title)?;
    let mut tx = state.pool.begin().await?;
    let task = sqlx::query_as::<_, Task>(
        "INSERT INTO tasks(title) VALUES (?) RETURNING id, title, done, created_at, updated_at",
    )
    .bind(title)
    .fetch_one(&mut *tx)
    .await?;
    sqlx::query("INSERT INTO task_events(task_id, kind, done) VALUES (?, 'created', ?)")
        .bind(task.id)
        .bind(task.done)
        .execute(&mut *tx)
        .await?;
    tx.commit().await?;
    Ok((StatusCode::CREATED, Json(task)))
}

pub async fn update(
    State(state): State<AppState>,
    path: Result<Path<i64>, PathRejection>,
    payload: Result<Json<UpdateTask>, JsonRejection>,
) -> Result<Json<Task>, AppError> {
    let id = task_id(path)?;
    let Json(payload) = payload?;
    if payload.title.is_none() && payload.done.is_none() {
        return Err(AppError::BadRequest(
            "PATCH cần title hoặc done với giá trị không null.",
        ));
    }
    let title = payload.title.map(validate_title).transpose()?;
    let mut tx = state.pool.begin().await?;
    let task = sqlx::query_as::<_, Task>(
        "UPDATE tasks SET title = COALESCE(?, title), done = COALESCE(?, done), updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ? RETURNING id, title, done, created_at, updated_at",
    )
    .bind(title)
    .bind(payload.done)
    .bind(id)
    .fetch_optional(&mut *tx)
    .await?
    .ok_or(AppError::NotFound)?;
    sqlx::query("INSERT INTO task_events(task_id, kind, done) VALUES (?, 'updated', ?)")
        .bind(id)
        .bind(task.done)
        .execute(&mut *tx)
        .await?;
    tx.commit().await?;
    Ok(Json(task))
}

pub async fn delete(
    State(state): State<AppState>,
    path: Result<Path<i64>, PathRejection>,
) -> Result<StatusCode, AppError> {
    let id = task_id(path)?;
    let mut tx = state.pool.begin().await?;
    let done = sqlx::query_scalar::<_, bool>("DELETE FROM tasks WHERE id = ? RETURNING done")
        .bind(id)
        .fetch_optional(&mut *tx)
        .await?
        .ok_or(AppError::NotFound)?;
    sqlx::query("INSERT INTO task_events(task_id, kind, done) VALUES (?, 'deleted', ?)")
        .bind(id)
        .bind(done)
        .execute(&mut *tx)
        .await?;
    tx.commit().await?;
    Ok(StatusCode::NO_CONTENT)
}
