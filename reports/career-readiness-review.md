# Review lộ trình phỏng vấn và dự án thực tế

Ngày rà soát: 11/11/2026. Phạm vi: cấu trúc 20 chương/80 bài, ba bài dự án chạy trên web, và khoảng cách đến một dự án Rust backend nhiều tệp. Đây là đánh giá nội dung và thiết kế học tập, không phải chứng nhận năng lực của người học hay khảo sát nhu cầu tuyển dụng.

## Kết luận

Giáo trình hiện có tạo nền tảng ngôn ngữ tương đối rộng: ownership, borrowing, kiểu dữ liệu, lỗi, generic/trait, iterator, smart pointer, lifetime, kiểm thử, I/O, concurrency, async, macro, unsafe và một số quyết định thiết kế. Nhưng việc chạy chương trình một tệp với dữ liệu trong bộ nhớ chưa kiểm chứng được khả năng bàn giao một ứng dụng Cargo, làm HTTP/DB hoặc vận hành dịch vụ. Ba dự án trong `src/data/projects.ts` vẫn là bài luyện logic; chúng không nên được trình bày như portfolio backend hoàn chỉnh.

Không có số bài hay phần trăm checklist nào bảo đảm người học đậu phỏng vấn. Tiêu chí phù hợp hơn là tự giải bài mới, giải thích được lựa chọn, có repository chạy lại được và phản hồi review bên ngoài.

## Phát hiện và xử lý

| Mức | Phát hiện trước review | Thay đổi đã triển khai | Phần còn cần thực hành |
| --- | --- | --- | --- |
| P1 | Chưa có cầu nối rõ từ bài web sang Cargo nhiều tệp và hệ sinh thái | Thêm lộ trình ba giai đoạn, điều kiện chuyển bước và tài liệu chính thức | Người học phải thực hiện trên máy cá nhân |
| P1 | Câu hỏi trắc nghiệm không đo được cách giải thích, đánh đổi và phản biện thiết kế | Thêm 30 câu hỏi mở, gợi ý đáp án, câu hỏi tiếp, điểm dễ nhầm và rubric 0–3 | Phỏng vấn thử cần người khác đánh giá |
| P1 | Ba dự án web chưa chạm HTTP, DB, migration, lỗi dịch vụ và CI | Thêm ba đặc tả dự án nhiều tệp có acceptance criteria, test cases, code review; liên kết lab Task API | CLI/library là đề bài, không được gắn nhãn ứng dụng đã hoàn thành; các mốc API mở rộng vẫn cần người học tự làm |
| P1 | Hoàn tất bài có thể bị hiểu nhầm là đã đủ kỹ năng đi làm | Tách tám tiêu chí tự đánh giá có bằng chứng, ghi rõ chưa được xác minh | Cần kiểm tra repository, test và trao đổi trực tiếp với người học |
| P1 | Chưa làm rõ backend khác các nhánh Rust chuyên sâu | Ghi phạm vi backend cấp đầu vào và nêu embedded, mobile/FFI, compiler cần nhánh riêng | Bổ sung chương trình chuyên ngành khi có mục tiêu công việc cụ thể |
| P2 | Bằng chứng tiến bộ có thể chỉ tồn tại trong trình duyệt | Lưu riêng key, kiểm tra dữ liệu đọc vào, thông báo lỗi lưu, tải bản sao JSON | Chưa có đồng bộ tài khoản hoặc xác minh server |

Không phát hiện P0 thuộc phạm vi review nghề nghiệp. Audit tính đúng của từng ví dụ Rust và UX tổng thể nằm ở các báo cáo riêng; báo cáo này không thay thế chúng.

## Bản đồ kỹ năng và bằng chứng

| Nhóm năng lực | Phần đã có trong khóa học | Bằng chứng mới được yêu cầu |
| --- | --- | --- |
| Ownership và mô hình kiểu | Chương 4–5, 9, 11–12, 19 | Ví dụ move/borrow/lifetime tự sửa; giải thích chữ ký API và invariant |
| Lỗi và dữ liệu ngoài | Chương 6–7, 14 | Lỗi có kiểu, Unicode, overflow, lỗi I/O; chính sách bỏ qua/dừng có chủ đích |
| Cargo và chất lượng | Chương 8, 13, 17 | Repository nhiều tệp, test tích hợp, doc-test và CI từ clone sạch |
| Đồng thời và async | Chương 15–16 | Send/'static, lock scope, bounded queue, timeout, cancellation, shutdown |
| Backend | Cần học tiếp hệ sinh thái | DTO/validation, HTTP status, query bind, migration, transaction, phân quyền |
| Vận hành | Chưa được kiểm chứng bởi bài web | Log không lộ bí mật, giới hạn tải, sự cố DB, backup/restore và rollback |
| Cộng tác | Ngoài trình chạy một tệp | Commit/PR, review đã phản hồi và ghi chú quyết định kỹ thuật |

## Nội dung mới

- `src/data/career.ts`: ba giai đoạn học, 30 câu hỏi mở chia sáu nhóm, ba đề dự án và tám tiêu chí bằng chứng.
- `components/career-hub.tsx`: bốn tab Lộ trình, Phỏng vấn, Dự án thực tế, Tự đánh giá; lọc câu hỏi theo nhóm/từ khóa; gợi ý ẩn bằng disclosure native.
- `components/career-hub.css`: bố cục phẳng, tương thích theme hiện có, responsive và reduced-motion.
- Root tích hợp vào route `#di-lam`. Không thay đổi completion của 80 bài hoặc nhập các mục tự đánh giá vào số bài hoàn thành.

## Ranh giới của lab API

Lab `labs/task-api` dùng Axum, Tokio và SQLx/SQLite; cấu trúc tham chiếu gồm `main.rs`, `lib.rs`, `tasks.rs`, `database.rs`, `error.rs`, migration và test. Phần hướng dẫn phân biệt CRUD/pagination/validation/transaction event trong base với bài mở rộng deadline/filter, optimistic concurrency hoặc idempotency.

Xác thực/phân quyền, rate limiting và vận hành công khai là các mốc mở rộng, không phải năng lực đã có sẵn chỉ vì lab chạy được. Không gắn nhãn lab là production-ready. Liên kết lab dùng repository của dự án; root chịu trách nhiệm kiểm tra source/test/build và đẩy cùng phiên bản có liên kết.

## Lưu dữ liệu và khả năng truy cập

- Key bằng chứng: `learn-rust-career-evidence-v1`, tách khỏi tiến độ bài học.
- Chỉ đọc các ID tiêu chí hợp lệ; giới hạn nội dung ghi chú và không tin trường `confirmed` nếu thiếu bằng chứng đủ dài. Dữ liệu là tự báo cáo, không được coi là xác minh năng lực.
- Không tự ghi đè dữ liệu ngay sau lần đọc lỗi. Chỉ ghi sau thay đổi do người dùng; lỗi quota/quyền truy cập hiện thành thông báo thật.
- Sửa bằng chứng làm mất dấu xác nhận cũ; cần xác nhận lại. Bản tải JSON chứa cả tiêu chí, ghi chú và trạng thái tự xác nhận.
- Tabs có role/aria-controls, roving tabindex, ArrowLeft/Right/Home/End. Disclosure dùng `details/summary`. Form có label, live status và focus khi thiếu bằng chứng.
- Việc ghi tối thiểu 40 ký tự chỉ là điều kiện đủ nội dung để tự xác nhận, không kiểm tra sự thật. Giao diện nhấn mạnh phải có việc đã làm, kết quả và nơi kiểm tra.

## Kiểm tra thực hiện trong nhánh agent

- TypeScript toàn bộ workspace: `node node_modules/typescript/bin/tsc --noEmit --pretty false` đạt, ngày 11/11/2026.
- Cấu trúc dữ liệu được kiểm tra riêng: đạt 3 giai đoạn, 30 câu hỏi/6 nhóm, 3 đề dự án, 8 tiêu chí; ID không trùng, liên kết HTTPS, đủ các phần nội dung.
- Agent này không điều khiển browser hay Mac để tránh xung đột với root. Kiểm tra trực quan, bàn phím, mobile, storage và lab runtime do root xác nhận riêng trước bàn giao.

## Nguồn chính thức được đối chiếu

Các câu hỏi và dự án có link nguồn ngay trên giao diện. Những điểm dễ nhầm đã đối chiếu trực tiếp gồm:

- [Tokio spawning: Send và 'static](https://tokio.rs/tokio/tutorial/spawning)
- [Tokio shared state: Mutex và await](https://tokio.rs/tokio/tutorial/shared-state)
- [Tokio select: cancellation safety](https://docs.rs/tokio/latest/tokio/macro.select.html)
- [Tokio graceful shutdown](https://tokio.rs/tokio/topics/shutdown)
- [Thư viện chuẩn: Pin](https://doc.rust-lang.org/std/pin/)
- [Rustonomicon: Send và Sync](https://doc.rust-lang.org/nomicon/send-and-sync.html)
- [Rustonomicon: phạm vi chứng minh unsafe](https://doc.rust-lang.org/nomicon/working-with-unsafe.html)
- [Rust Book: trait object](https://doc.rust-lang.org/book/ch18-02-trait-objects.html)
- [Axum extractors và giới hạn body](https://docs.rs/axum/latest/axum/extract/index.html)
- [SQLx query/bind](https://docs.rs/sqlx/latest/sqlx/fn.query.html)
- [SQLx transaction](https://docs.rs/sqlx/latest/sqlx/struct.Transaction.html)
- [Cargo SemVer](https://doc.rust-lang.org/cargo/reference/semver.html)
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)

Tài liệu `/latest/` có thể thay đổi; khi làm lab, cần dùng tài liệu theo dependency thực tế trong `Cargo.lock`. Đề bài không khẳng định tất cả API hoặc thư viện kể trên là lựa chọn duy nhất.
