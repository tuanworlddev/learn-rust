# Hướng chuyên sâu: Bảo mật và phân tích nhị phân

Ngày rà soát nguồn: **2026-11-10**.

## Phạm vi bàn giao

- `securityBundle`, track `security`, module `track-security`.
- 6 bài theo thứ tự: mô hình đầu vào; metadata ELF/PE/Mach-O; endian/offset/ngân sách; property test/fuzz; debugger/sanitizer/unsafe; triage và đóng gói.
- Mỗi bài có 4 phần lý thuyết, 442–465 từ tiếng Việt tính bằng khoảng trắng, mục tiêu, ví dụ, bài tập std-only, lời giải, assert biên, đầu ra xác định, gợi ý, quiz và tài liệu chính thức.
- 2 local lab với 7 tệp Cargo/Rust đầy đủ, lệnh và tiêu chí kiểm tra.
- Capstone có 5 mốc nghiệm thu, 5 nhóm sản phẩm bàn giao và 7 câu hỏi review.
- Nội dung dùng byte tổng hợp hoặc binary người học tự biên dịch. Không thực thi input, không triển khai khai thác hay phân tích malware không tin cậy.

## Quyết định kỹ thuật quan trọng

### Hợp đồng của object

Tài liệu crate nêu phạm vi đầu vào tin cậy, không bảo đảm chống các hình thức từ chối dịch vụ và không cam kết diễn giải giống mọi loader. Lab do đó chỉ đọc binary tự build hoặc đã xác minh nguồn gốc. Đọc tối đa 32 MiB, giới hạn dòng section và escape tên giúp kiểm soát một số chi phí nhưng không được mô tả là sandbox.

Lab cố định `object = "=0.40.0"`, có API tài liệu được kiểm tra trực tiếp. Chỉ mục crate tại thời điểm nghiên cứu có 0.41.0 phát hành ngày 2026-11-10; không tự chuyển ví dụ sang bản mới trong ngày khi tài liệu API bản đó chưa truy xuất ổn định. Không dùng giải nén section trong lab. `file_range` và `size` được trình bày tách biệt để tránh nhầm vị trí tệp với không gian bộ nhớ.

### Parser và fuzz

Parser LR do khóa học tự định nghĩa: magic LR, phiên bản 1, độ dài u16 little-endian, payload tối đa 256 byte, đúng một frame và không chấp nhận byte thừa. Mọi input fuzz là dữ liệu tổng hợp. Harness cho rằng ParseError là kết quả bình thường; khi parse thành công, nó kiểm tra cap và encode ngược về cùng frame.

Host project không có dependency. Fuzz project riêng dùng `libfuzzer-sys = "0.4"`; phiên bản patch được chốt bởi `fuzz/Cargo.lock` sau khi giải quyết dependency. Cần lưu cả lockfile host và fuzz. `cargo install cargo-fuzz --locked` phục vụ thiết lập ban đầu; hồ sơ tái lập phải ghi `cargo-fuzz --version` và toolchain nightly thực tế. Không gán một số phiên bản CLI chưa chạy.

Lệnh host chạy bằng stable, fuzz bằng `cargo +nightly`; không thay đổi toolchain mặc định. Nightly, C++ compiler, nền tảng hỗ trợ và điều kiện riêng của Miri được nêu rõ. Smoke fuzz 30 giây không được xem là bằng chứng không còn lỗi. cmin giảm corpus theo coverage, tmin giảm input gây lỗi. Tệp artifact trong hướng dẫn tmin là đường dẫn người học thay bằng phát hiện thực tế.

### Mức kết luận và giới hạn

- Bài has_pe_signature chỉ xác nhận MZ, e_lfanew và chữ ký PE; không xác nhận PE đầy đủ hoặc việc loader chấp nhận.
- Không cung cấp wrapper safe nhận con trỏ tùy ý. Bài unsafe giải thích alignment, allocation, initialization, lifetime và aliasing; bài thực hành dùng Cursor safe.
- Miri và sanitizer chỉ hỗ trợ các lần thực thi đã kiểm tra; không chứng minh soundness toàn bộ API.
- Preview dùng escape_default theo byte, có cap, không in raw control bytes.
- Chưa triển khai worker OS sandbox, endpoint upload, parser ELF/PE/Mach-O đầy đủ hay cơ chế xác minh chữ ký executable. Capstone yêu cầu mô tả đúng phạm vi này.

## Nguồn chính thức đã tham khảo

1. object 0.40 API: https://docs.rs/object/0.40.0/object/
2. object crate và security considerations: https://docs.rs/crate/object/0.40.0
3. Chỉ mục object 0.41.0 được tra cứu: https://docs.rs/crate/object/0.41.0
4. Microsoft PE/COFF, e_lfanew và RVA: https://learn.microsoft.com/en-us/windows/win32/debug/pe-format
5. Rust Fuzz Book setup: https://rust-fuzz.github.io/book/cargo-fuzz/setup.html
6. Rust Fuzz Book tutorial: https://rust-fuzz.github.io/book/cargo-fuzz/tutorial.html
7. Rust Fuzz Book guide: https://rust-fuzz.github.io/book/cargo-fuzz/guide.html
8. Rust Fuzz Book CI: https://rust-fuzz.github.io/book/cargo-fuzz/ci.html
9. LLVM LibFuzzer: https://llvm.org/docs/LibFuzzer.html
10. LLVM llvm-readobj: https://llvm.org/docs/CommandGuide/llvm-readobj.html
11. Rust Miri: https://github.com/rust-lang/miri
12. Rust slice::from_raw_parts: https://doc.rust-lang.org/std/slice/fn.from_raw_parts.html
13. Rust slice::get: https://doc.rust-lang.org/std/primitive.slice.html#method.get
14. Rust usize::checked_add: https://doc.rust-lang.org/std/primitive.usize.html#method.checked_add
15. Rust ascii::escape_default: https://doc.rust-lang.org/std/ascii/fn.escape_default.html

Tài liệu std được truy xuất hiển thị Rust 1.99.1. Ví dụ dùng edition 2024 và API stable; không suy diễn mọi dependency cùng có MSRV như edition. Dự án thực tế cần xác nhận compiler và lockfile đã dùng.

## Kiểm tra đã thực hiện trên Mac

- File mới được tạo trực tiếp trong repo được giao, không ghi đè file có sẵn.
- TypeScript `createProgram` strict/noEmit: **0 lỗi**.
- `validateCatalog` với module chuyên sâu độc lập: **qua**.
- Sáu lesson ID duy nhất, cùng module `track-security`, liên kết track đúng thứ tự.
- Mỗi bài 4 section; số từ lần lượt **463, 458, 443, 442, 452, 465**.
- localLab có đường dẫn tệp tương đối hợp lệ và lệnh/checks đầy đủ.
- SHA-256 nguồn tại bàn giao: `cf8194e64e5302c2503e60e4a29a525f5e0e28ba696fa014d24b452ffcf306fc`.

## Phần kiểm tra tích hợp còn lại

Agent gốc phụ trách biên dịch/chạy sáu solution Rust và Cargo host lab trên Mac cùng các hướng khác. Agent nội dung này **chưa chạy** rustc, cargo test, cargo-fuzz, Miri, sanitizer hay debugger; không ghi nhận những bước đó là đã qua. Cần cập nhật báo cáo tích hợp bằng kết quả thực tế, nền tảng và các công cụ chưa có. Không cần chạy fuzz nightly để giả vờ xác nhận host test; hai hạng mục có điều kiện riêng.
