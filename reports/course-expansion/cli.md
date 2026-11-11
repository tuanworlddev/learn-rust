# Mở rộng CLI và công cụ tự động hóa

Giữ nguyên 6 bài cũ; thêm 12 bài, tổng 18 bài/6 chương. Bài mới có 413–464 từ lý thuyết, bài tập std Rust, assertion, gợi ý và quiz. Ba dự án Cargo: Logcheck, Asset-audit, Batch-audit. Có 12 câu hỏi tình huống (2/chương), 6 kỹ năng, rubric 4–5 mục/dự án và 2 mô phỏng với nhánh hợp lệ/lỗi.

## Ma trận năng lực → bài học → bằng chứng
| Năng lực | Bài học | Bằng chứng dự án |
| --- | --- | --- |
| Thiết kế CLI và cấu hình | interface-design, arguments, config-layers | Logcheck: help, lỗi đối số, bảng exit code; mở rộng config có nguồn |
| Xử lý stream có giới hạn | streaming, record-validation, log-project | Logcheck: read_record giới hạn trước cấp phát, test UTF-8/CRLF/EOF/writer lỗi |
| Filesystem và phát hiện khác biệt | filesystem, plan-apply, manifest-project | Asset-audit: tệp thật, sửa cùng độ dài, added/removed, symlink, schema |
| Pipe, child và output máy | pipes, child-processes, machine-output | Logcheck: stdout JSONL; Asset-audit: output ổn định; bổ sung test helper child |
| Batch và recovery | parallelism, cancellation, batch-project | Batch-audit: stop/resume, input đổi, fault trước checkpoint, state hỏng; worker/hủy là nhiệm vụ nghiệm thu |
| Kiểm thử/phát hành | process-tests, shipping, release-contracts | Binary integration tests; artifact, smoke test target và upgrade cần người học hoàn thiện |

## Kiểm chứng đã thực hiện
Đã rustc --edition 2024 và chạy 12/12 lời giải mới trên Mac; tất cả assertion và stdout khớp. Chi tiết work/expansion-cli/validation.json. Root chạy Cargo tập trung; báo cáo này chưa ghi nhận kết quả Cargo khi bàn giao.

## Phạm vi cần môi trường thật
- Baseline Batch-audit chạy tuần tự, đầy đủ source và recovery tests. Worker pool, tín hiệu hủy, compact ledger và schema migration là tiêu chí capstone phải triển khai và trình diễn; không giả định có sẵn.
- Hash FNV trong fixture tin cậy không dùng như bằng chứng bảo mật. Manifest không phải snapshot nguyên tử; symlink_metadata rồi open không loại trừ TOCTOU.
- Cần đo RAM/throughput, test Windows và Linux thực tế, signal/process-tree behavior, mất điện và filesystem semantics theo môi trường triển khai.
- Trắc nghiệm là tự rà soát; đạt 18 bài không tự chứng minh đủ năng lực dự án.

## Tài liệu chính thức đã đối chiếu
- https://docs.rs/clap/latest/clap/_derive/ — Parser, Args, Subcommand, ValueEnum, Option và mặc định.
- https://docs.rs/clap/latest/clap/_derive/_tutorial/ — derive interface và validation.
- https://doc.rust-lang.org/std/io/trait.BufRead.html — fill_buf/consume, read_line, giới hạn khi chưa gặp delimiter.
- https://doc.rust-lang.org/std/process/index.html — child I/O và nguy cơ deadlock.
- https://doc.rust-lang.org/std/process/struct.Child.html — wait_with_output và vòng đời pipe.
- https://doc.rust-lang.org/std/fs/struct.OpenOptions.html#method.create_new — tạo mới nguyên tử.
- https://doc.rust-lang.org/std/fs/fn.rename.html — khác mount point, thay thế đích, khác biệt nền tảng.
- https://doc.rust-lang.org/std/fs/ — TOCTOU và giữ handle.
- https://doc.rust-lang.org/cargo/reference/cargo-targets.html#integration-tests — executable cho integration test.
- https://doc.rust-lang.org/cargo/commands/cargo-build.html#manifest-options — ý nghĩa --locked.

Nguồn phục vụ biên tập; bài học và hướng dẫn dự án giải thích trực tiếp trong hệ thống, không yêu cầu mở liên kết xem thêm.

## Phân bố đáp án đã rà soát
Mỗi nhóm 12 quiz bài mới và 12 câu hỏi đánh giá có phân bố correct 4/4/4 ở ba vị trí. Đã hoán đổi options cùng correct, giữ nguyên kiến thức, giải thích, code và ID.

Root đã xác nhận Cargo test cả ba dự án mới đạt. Sau sửa duration thành số, TypeScript và export catalog validator đã đạt.
