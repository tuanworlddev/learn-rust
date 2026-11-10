# Review Learn Rust: giao diện, kiến thức và năng lực thực hành

Ngày: 11/11/2026. Định hướng của phần bổ sung: Rust backend cấp đầu vào/junior.

## Kết luận

Khóa học hiện có nền tảng ngôn ngữ rộng, nhưng không thể suy năng lực đi làm chỉ từ việc hoàn thành 80 bài một tệp. Bản review bổ sung chiều sâu cho các khái niệm dễ nhầm, cải thiện luồng thực hành và thêm lộ trình có sản phẩm để kiểm chứng. Cần tự giải bài mới, xây dự án nhiều tệp, kiểm thử lỗi, giải thích thiết kế và nhận phản biện trước khi coi một kỹ năng đã đạt.

Ba agent thực hiện review UX/UI, kiến thức Rust và mức độ chuẩn bị đi làm. Agent kiến thức đọc cả 80 bài, ba bài tập tổng hợp và review chéo 30 câu phỏng vấn; agent UX review mã nguồn toàn bộ luồng học và phần CareerHub. Người tích hợp kiểm tra trên trình duyệt và chạy build/test trên máy Mac.

## Đã sửa và bổ sung

| Hạng mục | Kết quả |
| --- | --- |
| Sidebar | Chữ chính gần đen `#17191d` ở giao diện sáng, chữ sáng `#f0f1f4` ở giao diện tối; tên chương/bài 13,5 px. Chữ chính đo trên nền trắng có tương phản 17,6:1; số chương và nhãn phụ 9,47:1. Đây là phép đo các màu được kiểm tra, không phải chứng nhận accessibility toàn trang. |
| Điều hướng | Tab bài học/sổ tay/Đi làm có role và quan hệ panel, phím mũi tên/Home/End. Chuyển trang đặt focus vào main và cập nhật document title. |
| Mobile | Chuyển Nội dung / Viết mã mà không unmount editor; bản nháp vẫn được giữ. Drawer giữ/khôi phục focus, editor có cách thoát bằng Esc rồi Tab. |
| Phản hồi học tập | Phân biệt kết quả mẫu, lịch sử đã giải và bản nháp hiện tại. Thông báo lỗi lưu tiến độ/ghi chú/bằng chứng có đường tải bản sao. |
| Kiến thức | Cập nhật 32/80 bài, bổ sung 21 mục giải thích. Giữ IDs, thứ tự 20 chương và dữ liệu tiến độ hiện hữu. |
| Số học và Unicode | Thêm kiểm tra tràn số cho chia/sổ chi tiêu/tổng chi phí/ID; phân biệt byte, scalar và grapheme; nêu giới hạn chuẩn hóa Unicode. |
| Phỏng vấn | 30 câu mở trong sáu nhóm, có cách lập luận, câu hỏi tiếp, điểm dễ nhầm và nguồn chính thức. |
| Dự án | Ba đặc tả dự án nhiều tệp: CLI, HTTP API và thư viện domain; mỗi đề có mốc làm, nghiệm thu, test và câu hỏi review. |
| Tự đánh giá | Tám tiêu chí yêu cầu ghi bằng chứng trước khi tự xác nhận; sửa nội dung cần xác nhận lại. Trạng thái này không được hệ thống xác minh độc lập. |
| Lab chạy được | Task API gồm Axum/Tokio/SQLx/SQLite, CRUD, migration, phân trang, validation, transaction task/event, JSON lỗi, timeout, log và shutdown; kèm 12 integration tests, Cargo.lock và CI. |

## Kiểm chứng kỹ thuật

| Kiểm tra | Kết quả và phạm vi |
| --- | --- |
| Toàn bộ lời giải | 83/83: biên dịch từng chương trình với Rust edition 2024, chạy assertion và so stdout. Xem `curriculum-validation.json` với hash nguồn. |
| Build website | `npm run build:local` thành công, bao gồm TypeScript và tạo các route Next.js. |
| Lab API | `cargo check --all-targets`, 12/12 integration tests và Clippy `-D warnings` thành công; mã được định dạng với rustfmt. Xem `task-api-validation.json`. |
| HTTP thật | Chạy binary trên cổng loopback do hệ điều hành cấp; health, tạo, đọc, phân trang, sửa, validation, xóa; dừng bằng SIGTERM, mở lại cùng DB và xác nhận dữ liệu tồn tại. Chỉ dùng DB tạm và tiến trình thuộc bài test. Xem `task-api-http-validation.json`. |
| UI desktop | Kiểm tra màu sidebar sáng/tối; route title/focus; tab bàn phím; chuyển trang học, playground, sổ tay và CareerHub. |
| UI mobile | 390 × 844: không tràn ngang ở bài học/editor và phần dự án thực tế; chuyển vùng giữ bản nháp; drawer Escape trả focus; editor Esc rồi Tab rời được vùng nhập. |
| Phỏng vấn và bằng chứng | Lọc tiếng Việt không dấu, lọc nhóm; chặn xác nhận thiếu nội dung, lưu xác nhận qua reload, sửa nội dung hủy xác nhận; dữ liệu QA đã được xóa qua giao diện. |
| Chạy Rust qua web | Thử mã hợp lệ, kiểm tra kết quả mẫu và lỗi kiểu E0308 qua Rust Playground; đổi mẫu playground rồi quay lại vẫn giữ đúng bản nháp. Các lời giải khác được kiểm tra bằng rustc, không phải 83 lượt chấm qua trình duyệt. |

Các báo cáo kiểm tra là ảnh chụp trạng thái của phiên bản mã tương ứng; không chứng minh chương trình không còn mọi lỗi. Nhánh lỗi storage được kiểm tra bằng review mã, chưa mô phỏng trình duyệt chặn storage. Không thử VoiceOver/NVDA, tải lớn, TLS/proxy hay graceful shutdown trong lúc có request đang chạy; bài HTTP kiểm tra dừng sạch khi không còn request đang chờ.

## Điều kiện đánh giá người học

1. Tự sửa và giải thích lỗi ownership/borrow/lifetime; chọn kiểu dữ liệu và API có lý do.
2. Viết chương trình Cargo nhiều tệp từ yêu cầu mới, có test đầu vào sai và trường hợp biên.
3. Xây luồng HTTP → validation → DB → response, có migration và kiểm tra rollback/persistence.
4. Giải thích Send/Sync, dữ liệu qua await, timeout/cancellation, backpressure và giới hạn concurrency.
5. Người khác clone được repo, chạy theo README và đọc được lịch sử thay đổi/CI.
6. Bảo vệ một quyết định thiết kế và xử lý một yêu cầu thay đổi sau code review.

Nên làm một buổi phỏng vấn thử có người phản biện, một bài mới chưa xem lời giải và một thay đổi thực tế trên dự án. 30 câu hỏi là bộ luyện tập, không phải danh sách mọi câu tuyển dụng hoặc cam kết đậu.

## Phạm vi cần học tiếp

- Base Task API chưa có đăng nhập/phân quyền, idempotency, rate limit, backup/restore hoặc pipeline triển khai cho người dùng thật. Đây là các mốc nâng cấp được ghi trong README lab và tiêu chí dự án, không phải tính năng đã hoàn thành.
- Editor web chạy một tệp qua Rust Playground và cần Internet; lab nhiều tệp chạy bằng Cargo trên máy.
- Embedded, mobile/FFI, game engine, compiler và hệ thống phân tán cần nhánh chuyên sâu phù hợp vị trí.
- Tiến độ và bằng chứng hiện lưu trong trình duyệt, chưa đồng bộ tài khoản nhiều thiết bị.

## Báo cáo chi tiết và nguồn

- [UX/UI](ux-review.md)
- [Kiến thức Rust](rust-knowledge-review.md)
- [Phỏng vấn và dự án](career-readiness-review.md)
- [Hướng dẫn Task API](../labs/task-api/README.md)
- [W3C: tương phản chữ](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [The Rust Book](https://doc.rust-lang.org/book/), [Tokio](https://tokio.rs/tokio/tutorial), [Axum 0.8.6](https://docs.rs/axum/0.8.6/axum/), [SQLx 0.8.6](https://docs.rs/sqlx/0.8.6/sqlx/)
