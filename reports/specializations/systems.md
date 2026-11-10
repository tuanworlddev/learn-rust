# Chuyên sâu lập trình hệ thống

Ngày rà soát: 2026-11-11. Nội dung được biên soạn cho Learn Rust bằng tiếng Việt.

## Phạm vi đã viết

Sáu bài hoàn chỉnh trong `src/data/specializations/systems.ts`, mỗi bài có 421–451 từ theo phép tách khoảng trắng ở phần lý thuyết, bốn mục giải thích, ví dụ, bài tập chạy bằng thư viện chuẩn, lời giải có assertions, câu hỏi và nguồn đọc tiếp.

| Bài | Kỹ năng | Thực hành bổ sung |
| --- | --- | --- |
| `systems-resource-ownership` | RAII, move/borrow, cleanup so với hoàn tất I/O | Bộ cấp Permit một luồng có hạn mức |
| `systems-processes-io` | Command/Child, đối số, exit status, pipe hữu hạn | Cargo: tiến trình cha chạy chế độ con của chính executable |
| `systems-memory-layout` | Layout, endian, checked arithmetic, hợp đồng unsafe | Parser header có kiểm tra hoàn toàn bằng safe Rust |
| `systems-concurrency-ordering` | Invariant, atomic có điều kiện, Acquire/Release, shutdown | Cargo: producer/consumer với bounded channel |
| `systems-os-boundaries` | cfg, adapter nền tảng, descriptor/handle, dữ liệu không Unicode | Cargo: OwnedFd/BorrowedFd/try_clone trên Linux/macOS |
| `systems-kernel-path` | no_std/core, Kbuild, ngữ cảnh kernel, máy trạng thái | Cargo: thư viện no_std được unit test trên host |

Bốn dự án Cargo được nhúng trực tiếp trong `localLab`. Chúng có manifest, tệp nguồn, lệnh chạy và tiêu chí quan sát. Dự án cuối hướng gồm năm mốc xây một supervisor user space, tiêu chí nghiệm thu, tài liệu bàn giao và câu hỏi review.

## Quyết định kỹ thuật

- Các bài web dùng `std`, không thêm dependency, không thực sự spawn tiến trình, không đọc tệp người học, không truy cập thiết bị và không cần đặc quyền. Các bài tập xử lý vòng đời, cấu hình Command, parser, atomic và máy trạng thái là phần lõi có thể chạy trong môi trường thực hành.
- Local lab Command thực sự tạo tiến trình con nhưng chỉ chạy chính executable với cờ `--child`; output cố định và nhỏ. Nội dung nêu giới hạn của việc gom toàn bộ stdout/stderr vào bộ nhớ.
- Local lab descriptor chỉ đọc `Cargo.toml` của chính dự án. Nó cho thấy bản sao descriptor chia sẻ vị trí đọc; không dùng `from_raw_fd` hoặc thao tác đóng thô.
- Bộ cấp vé dùng `fetch_update(Relaxed, Relaxed)` vì chỉ bảo vệ giá trị counter. Không dùng counter làm tín hiệu công bố bộ nhớ khác. Bài giải thích điều kiện một Acquire load quan sát Release store, thay vì khẳng định mọi cặp Acquire/Release đều đồng bộ.
- Phân biệt rõ `Drop` của File, Child và JoinHandle. Child không tự kill/wait; drop JoinHandle detach thread. Các dự án phải có chính sách thu kết quả và shutdown riêng.
- Không dùng `repr(C)` hay `transmute` để biến byte tùy ý thành struct. Parser kiểm tra phiên bản, flags, endian và độ dài.
- Kernel lesson là bước chuẩn bị và đọc hợp đồng. Crate `no_std` host-tested không được gọi là kernel module. Không có lệnh cài kernel, nạp module, thay đổi quyền hệ thống hoặc chạy đặc quyền.

## Phiên bản và tính tái lập

Tài liệu Rust std được truy cập ở bản **1.99.1**. Code bài học chỉ dùng API stable và các manifest Cargo ghi `edition = "2024"`, `rust-version = "1.85"`; không yêu cầu tính năng nightly. Không có dependency thư viện ngoài cần khóa version. API/kernel build phụ thuộc tag cây nguồn Linux; bài yêu cầu kiểm tra tài liệu đúng phiên bản và chạy target `rustavailable`, không giả định một bộ toolchain áp dụng cho mọi kernel.

## Nguồn chính thức đã đối chiếu

1. [Rust std — Drop](https://doc.rust-lang.org/std/ops/trait.Drop.html): destructor, drop glue, vòng đời tài nguyên.
2. [Rust std — File](https://doc.rust-lang.org/std/fs/struct.File.html): đóng tệp, lỗi bị bỏ qua trong Drop, sync và sao chép handle.
3. [Rust std — OwnedFd](https://doc.rust-lang.org/std/os/fd/struct.OwnedFd.html): quyền sở hữu descriptor, BorrowedFd và open-file description dùng chung.
4. [Rust std — Command](https://doc.rust-lang.org/std/process/struct.Command.html): đối số, cấu hình stdio, spawn/output.
5. [Rust std — Child](https://doc.rust-lang.org/std/process/struct.Child.html): không có destructor tự kết thúc tiến trình; wait và exit status.
6. [Rust Reference — Type layout](https://doc.rust-lang.org/reference/type-layout.html): alignment, size, representation và giới hạn bảo đảm layout.
7. [Rust std — slice::from_raw_parts](https://doc.rust-lang.org/std/slice/fn.from_raw_parts.html): điều kiện con trỏ, allocation, alignment, lifetime và khởi tạo.
8. [Rustonomicon — FFI](https://doc.rust-lang.org/nomicon/ffi.html): khai báo ABI và wrapper có hợp đồng an toàn.
9. [Rust std — atomic::Ordering](https://doc.rust-lang.org/std/sync/atomic/enum.Ordering.html): Relaxed, Acquire, Release và SeqCst.
10. [Rustonomicon — Atomics](https://doc.rust-lang.org/nomicon/atomics.html): reordering và lập luận đồng bộ.
11. [Rust std — JoinHandle](https://doc.rust-lang.org/std/thread/struct.JoinHandle.html): detach khi drop và thu công việc bằng join.
12. [Rust Reference — Conditional compilation](https://doc.rust-lang.org/reference/conditional-compilation.html): cfg attributes và cfg!.
13. [Linux Kernel — Rust Quick Start](https://docs.kernel.org/rust/quick-start.html): yêu cầu toolchain và `make LLVM=1 rustavailable`.
14. [Linux Kernel — Rust General Information](https://docs.kernel.org/rust/general-information.html): no_std/core, tài liệu theo tag và quy trình rustdoc qua make.

## Kiểm tra

- Đã kiểm tra cấu trúc bundle: sáu ID bài duy nhất, module `track-systems`, lessonIds đúng thứ tự, bốn localLab.
- TypeScript transpilation và kiểm tra kiểu của tệp không có diagnostics.
- Targeted ESLint cho `systems.ts` thành công.
- Mã lời giải được rà thủ công: assertions bao gồm cả đường thành công và biên; đầu ra chỉ in kết quả ổn định, không phụ thuộc lịch chạy thread.
- Bản khôi phục trực tiếp trên Mac đã được kiểm tra lại cấu trúc, số bài, số localLab, số từ từng bài, TypeScript và ESLint; tất cả kết quả trên đều giữ nguyên.
- Agent nội dung chưa chạy Rust runtime hoặc Cargo lab. Root cần chạy kiểm tra Rust trên Mac trước khi ghi nhận pass cuối cùng.
