use axum::{
    Json,
    extract::rejection::JsonRejection,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::Serialize;

pub enum AppError {
    BadRequest(&'static str),
    NotFound,
    MethodNotAllowed,
    Json(JsonRejection),
    Database(sqlx::Error),
    Timeout,
}

#[derive(Serialize)]
struct ErrorBody {
    error: ErrorDetail,
}

#[derive(Serialize)]
struct ErrorDetail {
    code: &'static str,
    message: &'static str,
}

impl From<sqlx::Error> for AppError {
    fn from(error: sqlx::Error) -> Self {
        Self::Database(error)
    }
}

impl From<JsonRejection> for AppError {
    fn from(error: JsonRejection) -> Self {
        Self::Json(error)
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, code, message) = match self {
            Self::BadRequest(message) => (StatusCode::BAD_REQUEST, "invalid_input", message),
            Self::NotFound => (
                StatusCode::NOT_FOUND,
                "not_found",
                "Không tìm thấy tài nguyên.",
            ),
            Self::MethodNotAllowed => (
                StatusCode::METHOD_NOT_ALLOWED,
                "method_not_allowed",
                "Phương thức HTTP không được hỗ trợ trên tài nguyên này.",
            ),
            Self::Json(rejection) => match rejection.status() {
                StatusCode::PAYLOAD_TOO_LARGE => (
                    StatusCode::PAYLOAD_TOO_LARGE,
                    "body_too_large",
                    "JSON vượt quá giới hạn 16 KiB.",
                ),
                StatusCode::UNSUPPORTED_MEDIA_TYPE => (
                    StatusCode::UNSUPPORTED_MEDIA_TYPE,
                    "unsupported_media_type",
                    "Dùng Content-Type: application/json.",
                ),
                _ => (
                    StatusCode::BAD_REQUEST,
                    "invalid_json",
                    "JSON không hợp lệ hoặc không đúng các trường được yêu cầu.",
                ),
            },
            Self::Database(error) => {
                // Detailed diagnostics stay in local logs, never in the API response.
                tracing::error!(error = %error, "database operation failed");
                if matches!(error, sqlx::Error::PoolTimedOut | sqlx::Error::PoolClosed) {
                    (
                        StatusCode::SERVICE_UNAVAILABLE,
                        "database_unavailable",
                        "Dịch vụ dữ liệu tạm thời chưa sẵn sàng.",
                    )
                } else {
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        "internal_error",
                        "Không thể xử lý yêu cầu lúc này.",
                    )
                }
            }
            Self::Timeout => (
                StatusCode::SERVICE_UNAVAILABLE,
                "request_timeout",
                "Yêu cầu vượt quá thời gian chờ.",
            ),
        };
        (
            status,
            Json(ErrorBody {
                error: ErrorDetail { code, message },
            }),
        )
            .into_response()
    }
}
