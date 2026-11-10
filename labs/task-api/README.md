# Lab: Task API với Rust, Axum và SQLite

Một dịch vụ HTTP nhiều tệp để chuyển từ các bài Rust một tệp sang công việc backend: nhận JSON, kiểm tra đầu vào, truy vấn có tham số, transaction, migration, integration test, log và dừng dịch vụ.

**Phạm vi:** bản tham chiếu phục vụ học và chạy trên loopback `127.0.0.1`. Chưa có đăng nhập, quyền sở hữu dữ liệu, rate limit hay quy trình triển khai production. Không triển khai công khai nguyên bản này.

Đây là mã tham chiếu đã có implementation, không phải một bài có các TODO được chấm tự động trên web. Để tự luyện, tạo nhánh riêng, đọc hợp đồng API và test trước, tự xây các handler rồi đối chiếu bản tham chiếu. Bằng chứng học là thay đổi có test và giải thích được tradeoff, không chỉ chạy thành công bản có sẵn.

## Chuẩn bị và chạy

Yêu cầu Rust stable hỗ trợ edition 2024, Cargo và công cụ build C của hệ điều hành để build SQLite. `rustup update stable` dùng để cập nhật bộ công cụ nếu cần. Dependency dùng Axum `0.8.6`, SQLx `0.8.6`, Tokio `1`; `Cargo.lock` ghi lại phiên bản đã resolve.

Từ thư mục gốc repo:

```bash
cd labs/task-api
cargo test --locked
cargo run --locked
```

Mặc định:

- API: `http://127.0.0.1:3031`.
- Database: `tasks.db` trong thư mục chạy lệnh; migration chạy khi khởi động.
- `TASK_API_PORT`: đổi cổng, vẫn chỉ bind loopback.
- `TASK_API_DB`: đường dẫn database học tập khác, không tự tạo thư mục cha.
- `RUST_LOG`: bộ lọc log của `tracing`, ví dụ `learn_rust_task_api=debug,tower_http=debug`.

```bash
TASK_API_PORT=3032 TASK_API_DB=practice.db cargo run --locked
```

Không dùng database cá nhân trong lab. Dừng bằng Ctrl+C; trên macOS/Linux dịch vụ cũng tiếp nhận SIGTERM, chờ các request đang xử lý rồi đóng pool. Chỉ dừng tiến trình của lab, không dùng lệnh dừng theo tên `cargo`/`rust` chung.

## Thử luồng thực tế

Mở terminal thứ hai trong khi server đang chạy:

```bash
curl -i http://127.0.0.1:3031/health

curl -i -X POST http://127.0.0.1:3031/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Viết integration test"}'

curl -i 'http://127.0.0.1:3031/tasks?limit=10&after=0'

# Thay 1 bằng id trả về từ POST nếu database đã có dữ liệu.
curl -i -X PATCH http://127.0.0.1:3031/tasks/1 \
  -H 'Content-Type: application/json' \
  -d '{"done":true}'

curl -i http://127.0.0.1:3031/tasks/1
curl -i -X DELETE http://127.0.0.1:3031/tasks/1
```

## Hợp đồng API

| Request | Thành công | Đầu vào và ý nghĩa |
| --- | --- | --- |
| `GET /health` | `200 {"status":"ok"}` | Kiểm tra kết nối DB bằng `SELECT 1`; không phải chỉ chứng minh process đang chạy. |
| `POST /tasks` | `201` + task | JSON `{ "title": "..." }`. |
| `GET /tasks?limit=20&after=0` | `200` + page | `limit` trong 1–100; `after` là id không âm. Mặc định 20 và 0. |
| `GET /tasks/{id}` | `200` + task | id là số nguyên dương trong phạm vi `i64`. |
| `PATCH /tasks/{id}` | `200` + task | Một hoặc cả hai trường `title`, `done`. Ít nhất một giá trị không null. Trường bỏ qua hoặc null được giữ nguyên. |
| `DELETE /tasks/{id}` | `204`, body rỗng | Xóa task, vẫn lưu event `deleted`. Xóa lại trả `404`. |

Task gồm `id`, `title`, `done`, `created_at`, `updated_at`; timestamp dùng UTC với hậu tố `Z`. `title` được trim, dài 1–200 **Unicode scalar values** (`chars().count()`), không chứa NUL. Một ký tự người nhìn thấy có thể gồm nhiều scalar; lab không đếm grapheme cluster. `done` phải là JSON boolean. Các field lạ bị từ chối để phát hiện lỗi tên trường.

Trang danh sách trả:

```json
{
  "items": [{"id": 4, "title": "Đọc log", "done": false, "created_at": "2026-11-11T00:00:00.000Z", "updated_at": "2026-11-11T00:00:00.000Z"}],
  "next_after": 4
}
```

Đây chỉ là ví dụ hình dạng, không phải dữ liệu cài sẵn. Dùng `next_after` cho trang tiếp; `null` nghĩa là truy vấn hiện tại không còn trang. Sắp xếp theo id tăng dần và dùng `id > after` tránh lỗi bỏ sót do xóa hàng trước cursor như offset pagination. Đây **không phải snapshot**: hàng mới tạo giữa hai lần đọc có thể xuất hiện ở trang sau. UI vẫn phải chấp nhận dữ liệu thay đổi.

Lỗi có dạng `{"error":{"code":"invalid_input","message":"..."}}`:

| HTTP | Ví dụ |
| --- | --- |
| `400` | JSON lỗi, kiểu sai, title rỗng, PATCH rỗng, id/query không hợp lệ. |
| `404` | Task không tồn tại hoặc đường dẫn không có. |
| `405` | Method không được hỗ trợ. |
| `413` | JSON vượt quá 16 KiB. |
| `415` | Thiếu/sai `Content-Type: application/json` khi gửi body JSON. |
| `500` | Lỗi DB nội bộ khác, client nhận thông báo chung. |
| `503` | Pool đóng/hết thời gian lấy connection hoặc deadline 10 giây của handler. |

Thông báo DB chi tiết chỉ đi vào log cục bộ; không trả SQL, tên bảng hay lỗi driver cho client. Giới hạn 16 KiB được áp dụng cho các JSON extractor, không phải tuyên bố giới hạn mọi loại request ở network layer. Deadline handler không thay thế timeout tại reverse proxy.

**Timeout không chứng minh rằng thao tác ghi chưa commit.** Client không được retry POST một cách mù quáng nếu không biết kết quả. Idempotency key, lưu kết quả và quy tắc retry là bài nâng cấp cần thiết trước khi đưa vào luồng có giao dịch nghiệp vụ.

## Cấu trúc và quyết định thiết kế

| Tệp | Trách nhiệm |
| --- | --- |
| `src/main.rs` | Đọc cấu hình, mở DB, chạy migration, bind loopback, log và shutdown. |
| `src/lib.rs` | Ghép router, shared state, body limit, deadline và HTTP tracing. |
| `src/tasks.rs` | Hợp đồng JSON, validation, truy vấn và transaction cho task. |
| `src/database.rs` | Cấu hình SQLite/WAL, pool, thời gian chờ và migration. |
| `src/error.rs` | Ánh xạ lỗi typed sang status và JSON public. |
| `migrations/0001_tasks.sql` | Schema và ràng buộc ở tầng dữ liệu. |
| `tests/api.rs` | Hợp đồng HTTP qua router, transaction khi lỗi, lỗi DB và persistence. |

Handler dùng `.bind(...)`; title có dấu nháy hoặc giống SQL vẫn là dữ liệu. Pool là handle chia sẻ, clone không tạo một pool mới. SQLite pool giới hạn 5 connection; chờ lấy connection và chờ lock DB đều tối đa 3 giây. Nhiều connection không biến SQLite thành database ghi song song không giới hạn.

Mỗi POST/PATCH/DELETE ghi thay đổi task và một `task_events` trong **cùng transaction**. Nếu ghi event thất bại, task cũng rollback. Event không có khóa ngoại xóa dây chuyền để giữ lịch sử khi task bị xóa. Đây là ví dụ audit đơn giản, không phải log bất biến hay hệ thống tuân thủ. Việc dùng SQL runtime giúp build không cần DB đang mở, nhưng lỗi truy vấn cần được phát hiện bởi integration test; không có tuyên bố SQL được kiểm tra kiểu ở compile time.

## Bốn mốc tự luyện

### 1. Đầu vào và hợp đồng HTTP

Đọc `tests/api.rs` trước khi xem handler. Tự giải thích vì sao API phân biệt `400`, `404`, `413`, `415` và `503`; vì sao `String::len()` không đúng yêu cầu title. Chạy request với whitespace, 200/201 ký tự Unicode, boolean sai kiểu và field lạ. Bổ sung ít nhất một test không có sẵn, chẳng hạn chuỗi gồm dấu kết hợp Unicode.

**Bằng chứng:** test mới, request/response đã ghi lại và giải thích hợp đồng PATCH khi field vắng mặt/null. Không thay đổi validation chỉ để trả một status “cho test xanh”.

### 2. Database và tính nguyên tử

Đọc migration, tìm lý do có CHECK constraint và `AUTOINCREMENT`; giải thích bound parameter khác nối chuỗi SQL. Viết thêm migration mới để hỗ trợ ưu tiên task. Không sửa migration đã được áp dụng vào database dùng chung; migration tiếp theo phải nâng schema từ trạng thái cũ.

**Bằng chứng:** migration thứ hai, test khởi tạo DB mới và nâng DB cũ, cùng kiểm tra task/event vẫn nhất quán khi một truy vấn lỗi.

### 3. Kiểm thử qua ranh giới hệ thống

Router test dùng `oneshot` và database riêng cho từng test; không cần một cổng cố định. Một test dùng file tạm để chứng minh dữ liệu tồn tại sau khi pool được mở lại. Đọc test fault injection: trigger trong DB test làm event thất bại, kiểm tra task không bị cập nhật một nửa.

**Bằng chứng:** thêm test concurrent request hoặc optimistic locking; viết rõ điều kiện race được kiểm tra, không chỉ assert một hàm trả về chính giá trị nó vừa nhận. Chạy bộ kiểm tra nhiều lần; không phụ thuộc thứ tự test.

### 4. Vận hành và giải thích trước reviewer

Chạy trên cổng lab, xem log status/latency, kiểm tra dữ liệu sau restart. Dừng bằng Ctrl+C và xác nhận pool đóng. Thử dùng đường dẫn DB trong thư mục không tồn tại: lỗi phải được phát hiện lúc khởi động. Phân biệt health phụ thuộc DB với liveness của process; đề xuất readiness/liveness riêng nếu triển khai qua orchestrator.

**Bằng chứng:** README tái lập, log mẫu đã bỏ dữ liệu riêng, một PR giải thích thay đổi, và câu trả lời cho các câu hỏi bên dưới.

## Thí nghiệm lỗi có kiểm soát

Chạy test có sẵn:

```bash
cargo test --locked audit_failure_rolls_back -- --nocapture
```

Test tạo trigger lỗi **chỉ trong DB in-memory riêng của test**, rồi gửi PATCH. Kết quả mong đợi: HTTP 500 dạng chung, task chưa đổi, chỉ event `created` còn tồn tại. Trong nhánh học riêng, thử tách UPDATE và INSERT event thành hai giao dịch, chạy lại và quan sát test phát hiện trạng thái cập nhật một nửa. Sau đó sửa lại transaction và giải thích vì sao nó khôi phục tính nguyên tử. Không thực hiện thí nghiệm này trên DB đang có dữ liệu cần giữ.

## Bộ kiểm tra và CI

```bash
cargo fmt --all -- --check
cargo check --locked --all-targets
cargo test --locked --all-targets
cargo clippy --locked --all-targets -- -D warnings
```

Workflow `../../.github/workflows/rust-lab.yml` chạy các lệnh này trên Ubuntu cho thay đổi của lab. `Cargo.lock` phải được commit. CI xanh là một cổng chất lượng, không chứng minh không có lỗi hoặc đủ điều kiện production.

Integration test bao phủ: CRUD và event, Unicode/whitespace/NUL, malformed JSON, kiểu và field sai, missing id, phân trang khi xóa/chèn, query không hợp lệ, body limit, media type, SQL-looking input, rollback do lỗi audit, persistence qua mở lại pool, pool đóng và PATCH rỗng. Chạy lệnh trên môi trường của bạn để lấy kết quả hiện tại; báo cáo web đi kèm repo ghi lại lần kiểm tra của người tích hợp.

## Câu hỏi bảo vệ dự án

1. Vì sao clone `SqlitePool` không giống mở thêm 5 connection cho mỗi request?
2. `Arc` có cần bọc pool thêm không? Dữ liệu nào thật sự cần đồng bộ?
3. Request timeout đúng lúc commit: client có thể kết luận gì? Thiết kế idempotency ra sao?
4. Tại sao task và event phải cùng transaction? Lỗi thứ hai được kiểm chứng bằng cách nào?
5. Cursor id có điểm yếu gì khi cần sắp xếp theo `updated_at` hoặc cần snapshot?
6. SQLite/WAL có giúp hai writer cập nhật tùy ý đồng thời không? Khi nào chuyển PostgreSQL?
7. Nếu đổi sang nhiều user, phải sửa query và test nào để tránh đọc/sửa task của người khác?
8. `unwrap()` ở test và ở request handler gây hậu quả khác nhau thế nào?
9. Log phải chứa gì để debug mà không ghi body nhạy cảm? Response nên giấu gì?
10. Cancellation/drop của future khác với rollback nghiệp vụ hoặc việc đảo ngược một side effect đã commit thế nào?
11. Integration test này chưa đo được điều gì về HTTP thật, proxy, TLS, throughput và shutdown?
12. Chọn một tradeoff trong code, mô tả phương án khác và điều kiện khiến bạn đổi quyết định.

## Bài nâng cấp trước khi gọi đây là dự án vận hành thực tế

- Auth bằng thư viện và cơ chế đã được review; phân quyền theo chủ sở hữu, test truy cập chéo user. Không tự thiết kế cryptography.
- PostgreSQL, transaction/isolation phù hợp, optimistic locking hoặc chiến lược giải quyết cập nhật đồng thời.
- Idempotency key cho thao tác ghi và quy tắc retry có backoff; xử lý side effect ngoài DB.
- Rate limit và giới hạn tài nguyên ở cả API/proxy; cấu hình timeout, request ID, metrics, tracing và redaction.
- Migration trong pipeline triển khai, backup/restore, secret management, dependency audit và rollback release.
- Tài liệu API, test qua HTTP thật, load test với mục tiêu latency/throughput rõ ràng và code review độc lập.

Hoàn thành các bài mở rộng phải được ghi nhận bằng mã, test và lập luận. Không tự đánh dấu “production-ready” chỉ vì phần CRUD hoạt động.

## Tài liệu chính thức

- [Axum 0.8.6](https://docs.rs/axum/0.8.6/axum/): router, state, extractor và response.
- [SQLx 0.8.6 Transaction](https://docs.rs/sqlx/0.8.6/sqlx/struct.Transaction.html): commit, rollback và drop.
- [SQLx SQLite options](https://docs.rs/sqlx/0.8.6/sqlx/sqlite/struct.SqliteConnectOptions.html): journal mode và timeout.
- [Tokio: Graceful shutdown](https://tokio.rs/tokio/topics/shutdown): nhận tín hiệu và chờ công việc kết thúc.
- [SQLite WAL](https://sqlite.org/wal.html): cơ chế WAL và giới hạn concurrency.
- [Cargo Book — Cargo.lock](https://doc.rust-lang.org/cargo/guide/cargo-toml-vs-cargo-lock.html): dependency resolution tái lập.
