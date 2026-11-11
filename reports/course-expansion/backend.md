# Mở rộng Backend và dịch vụ mạng

## Nội dung và cấu trúc

- Giữ nguyên 6 ID/bài cũ; thêm 12 bài, tổng 18 bài trong 6 chương, 3 bài mỗi chương.
- Bài mới có 4–5 phần lý thuyết tự chứa, Rust std trên trình duyệt, assertion, stdout, hints và quiz. Capstone tích hợp có 548 từ lý thuyết, hướng dẫn chi tiết trong localLab.
- Ba dự án: catalog Axum/SQLite, sổ đặt hàng transaction/outbox, Team Tasks nhiều workspace.
- Hai mô phỏng: timeout sau commit/idempotency và crash sau phát event/trước đánh dấu.
- Mười hai câu hỏi, hai câu/chương; sáu nhóm kỹ năng liên kết bài/dự án. Quiz và assessment mỗi nhóm có correct phân bố 4/4/4; đã đổi options cùng correct.
- Capstone sau learner review vẫn là một dự án trong tổng ba dự án, nhưng thêm member adapters hoàn chỉnh; tổng 32 file, dưới giới hạn 60.

## Kiểm chứng đã có và trạng thái bản bổ sung

12/12 lời giải std mới đã compile/run bằng rustc --edition 2024, assertion/stdout PASS, work/expansion-backend/validation.json. Root đã xác nhận ba Cargo baseline trước lần bổ sung đều PASS.

Sau bổ sung adapters, npx tsc --noEmit PASS. Root đã xác nhận toàn bộ 5 localLab Backend qua cargo test --workspace --all-targets, gồm JWT/HTTP/gRPC/WebSocket mới. Ba test PostgreSQL explicit ignored đã được chạy riêng trên container postgres:17 loopback 55432 và PASS (0,46 giây): commit-order cursor, multi-connection version/rollback/permission, RPC→WebSocket sau restart. Process tích hợp: ad1091b6-0a80-4012-a9a3-0fb3c0b49041; root lưu kết quả máy đọc được trong reports/course-expansion/backend-postgres.json. Import SinkExt không dùng trong test PostgreSQL đã bỏ sau khi root báo warning.

## Đóng khoảng trống BK-01/BK-02

Team Tasks có member team-tasks-adapters, dùng:

- Axum =0.8.9 với ws; SQLx =0.8.6 PostgreSQL và TLS rustls.
- tonic/tonic-prost/tonic-prost-build =0.14.6; prost/prost-build =0.14.1.
- protoc-bin-vendored =3.2.0 được truyền qua prost_build::Config::protoc_executable, không cần biến môi trường unsafe hoặc protoc hệ thống.
- jsonwebtoken =9.3.1; policy RS256 cố định, public key/kid/issuer/audience cấu hình. Fixture RSA tạo riêng cho khóa học và công khai, không phải secret người dùng.
- tokio-tungstenite =0.28.0 làm client test WebSocket; Docker fixture PostgreSQL17.

### JWT

src/auth.rs xác minh chữ ký, thuật toán, kid, iss, aud, exp, nbf, sub trước khi tạo principal. Không tải URL hoặc chọn algorithm từ header token. tests/auth.rs có đúng/sai audience/issuer/expiry/nbf/algorithm/kid/signature. HTTP test xác minh body giả actor bị từ chối. Server chỉ nhận public key qua env; fixture-private.pem chỉ phục vụ test/công cụ tạo token loopback. Tích hợp JWKS/key rotation của nhà cung cấp cụ thể vẫn cần nghiệm thu riêng, không gọi fixture là đăng nhập production.

### gRPC

proto/tasks.proto, build.rs và generated client/server tạo ba unary RPC. Hợp đồng domain dùng chung Store. Metadata bearer, status, deadline, message size và concurrency có hướng dẫn. tests/rpc.rs chạy listener HTTP/2 loopback thật, create/update/stale/invalid/forbidden/unauthenticated/deadline. Client mẫu gọi dịch vụ PostgreSQL qua cổng 5018.

### WebSocket

Frame đầu chứa token, không đặt bearer trong URL. Server giới hạn thời gian xác thực, frame/message, batch 32, send deadline; kiểm tra expiry và membership mỗi batch. Client HTML có backoff hữu hạn, applied cursor và loại event trùng; đổi scope reset cursor. Test reconnect khi có event mới và replay cursor cũ. RAM dedup không được coi bền qua crash; consumer lưu dedup cùng tác dụng phụ là yêu cầu capstone tiếp theo. Retention/resync, admission và tải còn cần hoàn thiện.

### PostgreSQL

Task/outbox trong transaction, version check và RETURNING; membership FOR SHARE. Workspace FOR UPDATE serialize event allocation tới commit để cursor không bỏ sót event từ transaction commit muộn: sequence không tự là commit order. Có fixture/schema, adapter nhiều connection và ba test:

1. Concurrent same version, fault rollback task/outbox, constraint, revoke membership.
2. Writer đầu giữ commit, writer sau phải chờ; đọc cursor không bỏ sót.
3. Tạo qua gRPC, đọc WebSocket, khởi động lại transport, sửa qua gRPC, nối lại từ cursor trên cùng PostgreSQL.

## Lệnh kiểm chứng

Từ Cargo.toml ngoài cùng của backend-service-project:

```sh
cargo test --workspace --all-targets
docker compose -f adapters/compose.yaml up -d --wait
DATABASE_URL=postgres://learn:learn_fixture_only@127.0.0.1:55432/learn_tasks cargo test -p team-tasks-adapters --test postgres -- --ignored --test-threads=1
```

README trong lab hướng dẫn đầy đủ env JWT, phát token fixture, HTTP curl, rpc-client, stream.html, cách giải thích lỗi và kiểm thử. Test PostgreSQL tạo schema riêng, không sử dụng dữ liệu sản phẩm.

## Ma trận năng lực → bài học → bằng chứng

| Năng lực | Bài học | Bằng chứng dự án |
| --- | --- | --- |
| Ranh giới/runtime | domain-boundaries, config-errors, runtime | Catalog DTO/validation, state và khởi tạo |
| HTTP | http, api-contracts, catalog-project | Router JSON/status/cursor/version |
| Transaction/schema/query | transactions, query-plans, migrations, service-project | Order rollback; PgStore concurrency/atomicity/commit-order; migration và plan đo trên dữ liệu đích |
| Danh tính/idempotency | authorization, idempotency, order-project, service-project | JWT negative fixtures; membership mọi transport; order replay/conflict |
| RPC/stream/retry | streaming, outbox, retries-deadlines, service-project | tonic loopback/status/deadline; WS reconnect/dedup; PG transport restart; consumer bền cần học viên hoàn thiện |
| Nghiệm thu/vận hành | production, observability, service-project | Rubric critical 6 nhóm, log host/PG riêng, migration/load/shutdown/runbook |

## Giới hạn nghiệm thu

Trắc nghiệm và checklist là tự review; không chứng nhận sẵn sàng mọi dự án. Cần source, test âm, demo sự cố và phản hồi reviewer. PostgreSQL nhiều connection, rollback, commit-order và giao tiếp gRPC/WebSocket đã được kiểm chứng trên fixture container do root chạy; phạm vi này chưa bao gồm failover hay tải production. TLS proxy, nhà cung cấp danh tính/JWKS thật, worker có tác dụng phụ bên ngoài, retention/resync, rolling migration, failover và SLO tải sản phẩm cần bằng chứng môi trường đích. Không dùng SQLite một connection hoặc memory loopback thay cho những bước đó.

## Bibliography biên tập

Nội dung học, lệnh và source đều có trong hệ thống; các URL này chỉ dành cho biên tập kiểm chứng.

- Axum State 0.8.9: https://docs.rs/axum/0.8.9/axum/extract/struct.State.html
- Axum extractors: https://docs.rs/axum/0.8.9/axum/extract/index.html
- Axum WebSocketUpgrade 0.8.9: https://docs.rs/axum/0.8.9/axum/extract/struct.WebSocketUpgrade.html
- SQLx Transaction 0.8.6: https://docs.rs/sqlx/0.8.6/sqlx/struct.Transaction.html
- SQLx migrations: https://docs.rs/sqlx/0.8.6/sqlx/migrate/index.html
- Tonic Server 0.14.6: https://docs.rs/tonic/0.14.6/tonic/transport/struct.Server.html
- tonic-prost-build 0.14.6: https://docs.rs/tonic-prost-build/0.14.6/tonic_prost_build/struct.Builder.html
- prost-build 0.14.1 Config: https://docs.rs/prost-build/0.14.1/prost_build/struct.Config.html
- protoc-bin-vendored: https://docs.rs/protoc-bin-vendored/3.2.0/protoc_bin_vendored/
- jsonwebtoken Validation 9.3.1: https://docs.rs/jsonwebtoken/9.3.1/jsonwebtoken/struct.Validation.html
- PostgreSQL17 sequence: https://www.postgresql.org/docs/17/functions-sequence.html
- PostgreSQL17 explicit locks: https://www.postgresql.org/docs/17/explicit-locking.html
- PostgreSQL EXPLAIN: https://www.postgresql.org/docs/current/using-explain.html
- PostgreSQL LIMIT/OFFSET: https://www.postgresql.org/docs/current/queries-limit.html
- Tokio graceful shutdown: https://tokio.rs/tokio/topics/shutdown
- Tokio timeout: https://docs.rs/tokio/latest/tokio/time/fn.timeout.html

## Validation cuối nội dung

npx tsc --noEmit PASS; export-course-content validator PASS, snapshot work/expansion-backend/catalog-final.json. Catalog tại thời điểm export có 314 bài / 13 hướng chuyên sâu / 33 module; các con số toàn hệ thống do root đối chiếu lại khi đóng băng. Các lời giải std, IDs, chương và đáp án đã cân bằng không bị thay đổi trong lần bổ sung adapters.
