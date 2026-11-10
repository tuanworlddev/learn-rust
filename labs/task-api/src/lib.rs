use std::time::Duration;

use axum::{
    Json, Router,
    extract::{DefaultBodyLimit, Request, State},
    middleware::{self, Next},
    response::{IntoResponse, Response},
    routing::get,
};
use serde_json::{Value, json};
use sqlx::SqlitePool;
use tower_http::trace::TraceLayer;

pub mod database;
mod error;
mod tasks;

use error::AppError;

pub const MAX_BODY_BYTES: usize = 16 * 1024;

#[derive(Clone)]
pub(crate) struct AppState {
    // Cloning a pool clones its shared handle, not a new set of DB connections.
    pool: SqlitePool,
}

pub fn app(pool: SqlitePool) -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/tasks", get(tasks::list).post(tasks::create))
        .route(
            "/tasks/{id}",
            get(tasks::get_one)
                .patch(tasks::update)
                .delete(tasks::delete),
        )
        .fallback(|| async { AppError::NotFound })
        .method_not_allowed_fallback(|| async { AppError::MethodNotAllowed })
        .layer(DefaultBodyLimit::max(MAX_BODY_BYTES))
        .layer(middleware::from_fn(request_timeout))
        .layer(TraceLayer::new_for_http())
        .with_state(AppState { pool })
}

async fn health(State(state): State<AppState>) -> Result<Json<Value>, AppError> {
    sqlx::query_scalar::<_, i64>("SELECT 1")
        .fetch_one(&state.pool)
        .await?;
    Ok(Json(json!({"status": "ok"})))
}

async fn request_timeout(request: Request, next: Next) -> Response {
    match tokio::time::timeout(Duration::from_secs(10), next.run(request)).await {
        Ok(response) => response,
        Err(_) => AppError::Timeout.into_response(),
    }
}
