# Chuyên sâu Backend và dịch vụ mạng

Ngày đối chiếu nguồn: 11/11/2026 (Asia/Ho_Chi_Minh).

## Nội dung đã viết

Tệp `src/data/specializations/backend.ts` xuất `backendBundle`, có sáu bài học đầy đủ, sáu bài tập Rust chỉ dùng thư viện chuẩn, sáu câu hỏi kèm giải thích, hai lab Cargo và dự án cuối lộ trình. Mỗi bài có bốn phần lý thuyết, khoảng 491–544 từ theo cách tách khoảng trắng, chưa tính mã, yêu cầu và hướng dẫn lab.

| Bài | Nội dung thực hành | Kiến thức cần chứng minh |
| --- | --- | --- |
| `backend-runtime` | Hàng đợi nhận việc có giới hạn | Phân biệt task, tài nguyên đang giữ, backpressure và tác dụng phụ khi hủy |
| `backend-http` | Validation Unicode và endpoint Axum | Hợp đồng HTTP, extractor, DTO, body limit, kiểm thử Router |
| `backend-transactions` | Chuyển số dư nguyên tử; SQLx tồn kho | Không để lại trạng thái dở dang, UPDATE có điều kiện, rollback và idempotency |
| `backend-authorization` | Ma trận owner/admin/workspace | Phân biệt danh tính và quyền, mặc định từ chối, chống truy cập xuyên nhóm |
| `backend-streaming` | Cursor sự kiện với phát hiện khoảng trống | Hợp đồng reconnect, bounded queue, deadline và thay đổi protobuf |
| `backend-production` | Retry theo ngân sách | Quan sát request, readiness/liveness, shutdown, tải và bản phát hành |

Các bài tập trong trình duyệt luyện những quy tắc nghiệp vụ xác định được. HTTP server, socket và database nằm ở lab Cargo; nội dung không giả định môi trường chạy Rust trên web có thể lưu trữ dịch vụ mạng cho học viên.

## Nguồn chính thức đã đối chiếu

- [Tokio tutorial](https://tokio.rs/tokio/tutorial): vai trò runtime và I/O.
- [Tokio spawning](https://tokio.rs/tokio/tutorial/spawning): quyền sở hữu, `Send`, `'static` của task.
- [Tokio select](https://tokio.rs/tokio/tutorial/select): drop future và cancellation.
- [Tokio channels](https://tokio.rs/tokio/tutorial/channels): message passing và giới hạn bộ đệm.
- [Tokio spawn_blocking](https://docs.rs/tokio/latest/tokio/task/fn.spawn_blocking.html): tác vụ blocking đã bắt đầu không thể abort theo cách của future thông thường.
- [Axum](https://docs.rs/axum/latest/axum/): Router, handler, State và phục vụ listener.
- [Axum extractors](https://docs.rs/axum/latest/axum/extract/index.html): thứ tự extractor, body chỉ đọc một lần, giới hạn body.
- [Axum WebSocket](https://docs.rs/axum/latest/axum/extract/ws/index.html): feature `ws`, upgrade, đọc/ghi socket.
- [SQLx Transaction 0.8.6](https://docs.rs/sqlx/0.8.6/sqlx/struct.Transaction.html): begin, commit, rollback và sử dụng `&mut *tx`.
- [SQLx hiện hành](https://docs.rs/sqlx/latest/sqlx/): xác nhận bản tài liệu mới đã là 0.9.0; lab chủ động cố định 0.8.6, không gọi nó là bản mới nhất.
- [tonic](https://docs.rs/tonic/latest/tonic/): giao thức gRPC và HTTP/2.
- [tonic Request](https://docs.rs/tonic/latest/tonic/struct.Request.html): `set_timeout` và metadata.
- [gRPC deadlines](https://grpc.io/docs/guides/deadlines/): ngân sách thời gian, truyền thời gian còn lại và trách nhiệm dừng công việc phía ứng dụng.
- [Protocol Buffers proto3](https://protobuf.dev/programming-guides/proto3/): field number, xóa trường và thay đổi hợp đồng.
- [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html): mặc định từ chối, kiểm tra mỗi request và kiểm thử chính sách.
- [OWASP REST Security](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html): JWT, validation, CORS và xử lý lỗi.
- [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html): truy vấn tham số hóa.
- [tower-http TraceLayer](https://docs.rs/tower-http/latest/tower_http/trace/index.html): span và callback quan sát HTTP.
- [Tokio graceful shutdown](https://tokio.rs/tokio/topics/shutdown): xác định lúc dừng, thông báo và chờ hoàn tất.

Ví dụ, bài tập và dự án do tác giả nội dung thiết kế cho lộ trình này; không sao chép một tutorial thành khóa học. Quy tắc cursor liên tiếp, ba khoảng retry và chính sách admin trong cùng workspace là hợp đồng của bài tập, được nói rõ trong bài.

## Phiên bản và phạm vi lab

Lab HTTP dùng Axum `=0.8.9`, Tokio 1, Serde 1 và Tower 0.5. Lab giao dịch dùng SQLx `=0.8.6` với `runtime-tokio` và `sqlite`, không cần database ngoài. Cả hai dự án dùng Rust edition 2024. Sau khi tạo dự án thực, học viên cần lưu Cargo.lock để cố định cả dependency gián tiếp.

Lab SQLite chỉ dùng một kết nối trong bộ nhớ và chứng minh rollback/cập nhật có điều kiện. Nó không phải phép đo cạnh tranh hoặc phép kiểm chứng isolation của PostgreSQL. Capstone yêu cầu integration test trên PostgreSQL với migration, xung đột version và giới hạn pool rõ ràng.

Phần tonic giải thích hợp đồng, timeout và xử lý luồng; ví dụ gọi RPC chỉ là đoạn minh họa cần kiểu sinh từ protobuf. Không gắn nhãn đoạn đó là chương trình độc lập chạy ngay. Capstone yêu cầu triển khai RPC thực và kiểm tra tương thích client.

## Kiểm tra tại thời điểm bàn giao

- TypeScript `transpileModule`: không có lỗi cú pháp; xuất đúng sáu lesson ID duy nhất.
- Từng lời giải có `main`, kiểm tra nhiều nhánh bằng `assert` và một đầu ra xác định.
- Đã rà soát rỗng, Unicode, giới hạn bằng 0, số nguyên cực đại, lỗi không thay đổi dữ liệu, admin khác workspace và retry quá ngân sách.
- Cloud không có `rustc`; chưa khẳng định đã biên dịch/chạy sáu lời giải hoặc hai lab. Root cần chạy phần xác minh Rust trên Mac và ghi kết quả tổng hợp khi tích hợp.

Lộ trình này cung cấp nền tảng có thực hành và capstone đánh giá được. Sáu bài không được mô tả là bảo đảm sẵn sàng mọi vai trò backend hoặc bảo đảm vượt phỏng vấn.
