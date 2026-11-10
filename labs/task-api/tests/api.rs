use axum::{
    Router,
    body::Body,
    http::{Request, StatusCode},
};
use http_body_util::BodyExt;
use learn_rust_task_api::{MAX_BODY_BYTES, app, database};
use serde_json::{Value, json};
use sqlx::{SqlitePool, sqlite::SqlitePoolOptions};
use tower::ServiceExt;

async fn setup() -> (Router, SqlitePool) {
    // Each test owns a separate in-memory DB. One connection avoids SQLite's
    // per-connection in-memory database distinction.
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("open isolated test database");
    database::migrate(&pool).await.expect("apply migrations");
    (app(pool.clone()), pool)
}

async fn raw(
    router: &Router,
    method: &str,
    uri: &str,
    body: String,
    content_type: Option<&str>,
) -> (StatusCode, Value) {
    let mut builder = Request::builder().method(method).uri(uri);
    if let Some(content_type) = content_type {
        builder = builder.header("content-type", content_type);
    }
    let response = router
        .clone()
        .oneshot(builder.body(Body::from(body)).unwrap())
        .await
        .unwrap();
    let status = response.status();
    let bytes = response.into_body().collect().await.unwrap().to_bytes();
    let value = if bytes.is_empty() {
        Value::Null
    } else {
        serde_json::from_slice(&bytes).expect("JSON error or data response")
    };
    (status, value)
}

async fn request(
    router: &Router,
    method: &str,
    uri: &str,
    body: Option<Value>,
) -> (StatusCode, Value) {
    raw(
        router,
        method,
        uri,
        body.map(|value| value.to_string()).unwrap_or_default(),
        Some("application/json"),
    )
    .await
}

async fn create(router: &Router, title: &str) -> i64 {
    let (status, task) = request(router, "POST", "/tasks", Some(json!({"title": title}))).await;
    assert_eq!(status, StatusCode::CREATED, "{task}");
    task["id"].as_i64().unwrap()
}

#[tokio::test]
async fn crud_round_trip_writes_an_event_for_each_mutation() {
    let (router, pool) = setup().await;
    assert_eq!(
        request(&router, "GET", "/health", None).await,
        (StatusCode::OK, json!({"status":"ok"}))
    );
    let id = create(&router, "  Học Rust 🦀  ").await;
    let uri = format!("/tasks/{id}");
    let (status, task) = request(&router, "GET", &uri, None).await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(task["title"], "Học Rust 🦀");
    assert_eq!(task["done"], false);
    assert!(task["created_at"].as_str().unwrap().ends_with('Z'));

    let (status, task) = request(&router, "PATCH", &uri, Some(json!({"done": true}))).await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(task["done"], true);
    assert_eq!(task["title"], "Học Rust 🦀");
    let (status, body) = request(&router, "DELETE", &uri, None).await;
    assert_eq!(status, StatusCode::NO_CONTENT);
    assert_eq!(body, Value::Null);
    assert_eq!(
        request(&router, "GET", &uri, None).await.0,
        StatusCode::NOT_FOUND
    );

    let events: Vec<String> =
        sqlx::query_scalar("SELECT kind FROM task_events WHERE task_id = ? ORDER BY id")
            .bind(id)
            .fetch_all(&pool)
            .await
            .unwrap();
    assert_eq!(events, ["created", "updated", "deleted"]);
}

#[tokio::test]
async fn title_limits_count_unicode_scalars_after_trimming() {
    let (router, _) = setup().await;
    for title in [
        "".to_owned(),
        " \n\t ".to_owned(),
        "文".repeat(201),
        "a\0b".to_owned(),
    ] {
        let (status, _) = request(&router, "POST", "/tasks", Some(json!({"title": title}))).await;
        assert_eq!(status, StatusCode::BAD_REQUEST);
    }
    // 200 three-byte characters are 600 UTF-8 bytes but valid for this contract.
    let title = "文".repeat(200);
    let id = create(&router, &format!("  {title}  ")).await;
    let (_, task) = request(&router, "GET", &format!("/tasks/{id}"), None).await;
    assert_eq!(task["title"], title);
}

#[tokio::test]
async fn invalid_json_wrong_types_and_unknown_fields_are_rejected() {
    let (router, _) = setup().await;
    for body in [
        "{",
        r#"{"title":12}"#,
        r#"{"title":"valid","admin":true}"#,
        r#"{"title":"valid"} trailing"#,
    ] {
        let (status, value) = raw(
            &router,
            "POST",
            "/tasks",
            body.into(),
            Some("application/json"),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST);
        assert_eq!(value["error"]["code"], "invalid_json");
    }
    let id = create(&router, "Test").await;
    assert_eq!(
        request(
            &router,
            "PATCH",
            &format!("/tasks/{id}"),
            Some(json!({"done":"yes"}))
        )
        .await
        .0,
        StatusCode::BAD_REQUEST
    );
}

#[tokio::test]
async fn missing_records_and_invalid_identifiers_are_distinct() {
    let (router, _) = setup().await;
    for method in ["GET", "PATCH", "DELETE"] {
        let body = (method == "PATCH").then(|| json!({"done":true}));
        assert_eq!(
            request(&router, method, "/tasks/999", body).await.0,
            StatusCode::NOT_FOUND
        );
    }
    for uri in [
        "/tasks/0",
        "/tasks/-1",
        "/tasks/not-a-number",
        "/tasks/99999999999999999999999999",
    ] {
        assert_eq!(
            request(&router, "GET", uri, None).await.0,
            StatusCode::BAD_REQUEST
        );
    }
}

#[tokio::test]
async fn cursor_pages_do_not_skip_remaining_rows_when_earlier_rows_are_deleted() {
    let (router, _) = setup().await;
    let mut ids = Vec::new();
    for title in ["A", "B", "C", "D"] {
        ids.push(create(&router, title).await);
    }
    let (_, first) = request(&router, "GET", "/tasks?limit=2", None).await;
    assert_eq!(first["items"].as_array().unwrap().len(), 2);
    assert_eq!(first["items"][0]["id"], ids[0]);
    assert_eq!(first["next_after"], ids[1]);
    request(&router, "DELETE", &format!("/tasks/{}", ids[0]), None).await;
    let inserted = create(&router, "E").await;
    let (_, second) = request(
        &router,
        "GET",
        &format!("/tasks?limit=2&after={}", ids[1]),
        None,
    )
    .await;
    assert_eq!(second["items"][0]["id"], ids[2]);
    assert_eq!(second["items"][1]["id"], ids[3]);
    assert_eq!(second["next_after"], ids[3]);
    let (_, last) = request(
        &router,
        "GET",
        &format!("/tasks?limit=2&after={}", ids[3]),
        None,
    )
    .await;
    assert_eq!(last["items"][0]["id"], inserted);
    assert_eq!(last["next_after"], Value::Null);
}

#[tokio::test]
async fn invalid_pagination_is_rejected_instead_of_unbounded_fetch() {
    let (router, _) = setup().await;
    for query in [
        "limit=0",
        "limit=101",
        "limit=-1",
        "after=-1",
        "limit=abc",
        "page=2",
        "after=9223372036854775808",
    ] {
        assert_eq!(
            request(&router, "GET", &format!("/tasks?{query}"), None)
                .await
                .0,
            StatusCode::BAD_REQUEST,
            "{query}"
        );
    }
}

#[tokio::test]
async fn json_body_limit_and_content_type_have_useful_http_statuses() {
    let (router, _) = setup().await;
    let (status, value) = request(
        &router,
        "POST",
        "/tasks",
        Some(json!({"title":"x".repeat(MAX_BODY_BYTES)})),
    )
    .await;
    assert_eq!(status, StatusCode::PAYLOAD_TOO_LARGE);
    assert_eq!(value["error"]["code"], "body_too_large");
    assert_eq!(
        raw(&router, "POST", "/tasks", r#"{"title":"A"}"#.into(), None)
            .await
            .0,
        StatusCode::UNSUPPORTED_MEDIA_TYPE
    );
}

#[tokio::test]
async fn sql_looking_input_is_stored_as_data() {
    let (router, _) = setup().await;
    let title = "x'); DROP TABLE tasks; --";
    let id = create(&router, title).await;
    let (_, task) = request(&router, "GET", &format!("/tasks/{id}"), None).await;
    assert_eq!(task["title"], title);
    assert_eq!(
        request(&router, "GET", "/tasks", None).await.0,
        StatusCode::OK
    );
}

#[tokio::test]
async fn audit_failure_rolls_back_the_task_change_and_hides_database_detail() {
    let (router, pool) = setup().await;
    let id = create(&router, "Atomic update").await;
    // Inject failure only into this isolated test DB, after task UPDATE and
    // before its event INSERT. Both writes must roll back together.
    sqlx::query("CREATE TRIGGER reject_update_event BEFORE INSERT ON task_events WHEN NEW.kind = 'updated' BEGIN SELECT RAISE(ABORT, 'test-only audit failure'); END")
        .execute(&pool).await.unwrap();
    let (status, body) = request(
        &router,
        "PATCH",
        &format!("/tasks/{id}"),
        Some(json!({"done":true})),
    )
    .await;
    assert_eq!(status, StatusCode::INTERNAL_SERVER_ERROR);
    assert_eq!(body["error"]["code"], "internal_error");
    assert!(!body.to_string().contains("test-only"));
    assert!(!body.to_string().contains("task_events"));
    let (_, task) = request(&router, "GET", &format!("/tasks/{id}"), None).await;
    assert_eq!(task["done"], false);
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM task_events WHERE task_id = ?")
        .bind(id)
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(count, 1);
}

#[tokio::test]
async fn file_database_survives_pool_reopen_and_migrations_are_repeatable() {
    let directory = tempfile::tempdir().unwrap();
    let path = directory.path().join("test.db");
    let pool = database::open_database(&path).await.unwrap();
    database::migrate(&pool).await.unwrap();
    let router = app(pool.clone());
    let id = create(&router, "Persisted task").await;
    drop(router);
    pool.close().await;

    let reopened = database::open_database(&path).await.unwrap();
    database::migrate(&reopened).await.unwrap();
    let (_, task) = request(&app(reopened.clone()), "GET", &format!("/tasks/{id}"), None).await;
    assert_eq!(task["title"], "Persisted task");
    reopened.close().await;
}

#[tokio::test]
async fn closed_pool_returns_unavailable_without_internal_details() {
    let (router, pool) = setup().await;
    pool.close().await;
    for uri in ["/health", "/tasks"] {
        let (status, body) = request(&router, "GET", uri, None).await;
        assert_eq!(status, StatusCode::SERVICE_UNAVAILABLE);
        assert_eq!(body["error"]["code"], "database_unavailable");
        assert!(!body.to_string().contains("PoolClosed"));
    }
}

#[tokio::test]
async fn empty_patch_unknown_routes_and_wrong_methods_are_explicit() {
    let (router, _) = setup().await;
    let id = create(&router, "Before").await;
    let uri = format!("/tasks/{id}");
    for body in [json!({}), json!({"title":null,"done":null})] {
        assert_eq!(
            request(&router, "PATCH", &uri, Some(body)).await.0,
            StatusCode::BAD_REQUEST
        );
    }
    let (status, task) = request(&router, "PATCH", &uri, Some(json!({"title":" After "}))).await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(task["title"], "After");
    assert_eq!(task["done"], false);
    assert_eq!(
        request(&router, "GET", "/missing", None).await.0,
        StatusCode::NOT_FOUND
    );
    let (status, body) = request(&router, "PUT", "/tasks", None).await;
    assert_eq!(status, StatusCode::METHOD_NOT_ALLOWED);
    assert_eq!(body["error"]["code"], "method_not_allowed");
}
