# Lập trình hệ thống — mở rộng khóa học

Thêm 12 bài mới (400–419 từ lý thuyết/bài), giữ sáu ID cũ, chia đúng sáu chương/18 bài. Ba Cargo project dùng API OS/file/socket thật, 12 bài tập browser std-only, 12 câu đánh giá tình huống, sáu kỹ năng và hai mô phỏng hai nhánh/bốn bước.

## Ma trận đầu ra → bài học → bằng chứng

| Đầu ra | Bài học | Bằng chứng dự án |
| --- | --- | --- |
| Trạng thái sau lỗi và cleanup | systems-error-boundaries, systems-shutdown-contract | Supervisor Outcome, kill/wait, sơ đồ owner pipe/channel |
| I/O từng phần và process | systems-partial-io, systems-supervisor-project | Test ok/fail/spam/slow của chính executable; bounded capture/drain |
| Format disk và recovery | systems-layout-alignment, systems-file-journal-project | Explicit endian/length/checksum, every-cut tail, corrupt/reopen/repair |
| Backpressure và publication | systems-worker-fairness, systems-memory-publication | Pool/queue plan, OnceLock example, capstone scheduler rubric |
| Biên OS và IPC | systems-ipc-framing, systems-daemon-project | UnixStream pair, UnixListener demo, deadline wrapper, CAS conflict |
| Review kernel và hiệu năng | systems-kernel-lifetimes, systems-performance-diagnostics | Teardown state machine, workload/latency/durability report yêu cầu |

Dự án guided là supervisor direct child; independent là journal; capstone là dịch vụ Unix IPC cần được người học hoàn thiện pool/journal/shutdown. Mỗi dự án có bốn rubric (hai critical), ba mốc, bốn ca lỗi/nghiệm thu và bốn deliverable. Không đổi tên ví dụ một client thành daemon production đã hoàn chỉnh.

## Khoảng trống được bổ sung

Result với partial effect, retry/Interrupted/WouldBlock, shutdown ordering, sender clone, short read/write, deadline tổng, pipe deadlock, Child không có Drop kill/wait, repr(C)/padding/alignment, unsafe invariants, append poisoning, tail repair có lựa chọn, worker fairness, publication/lifetime, local IPC trust boundary, CAS, teardown kernel và đo workload giữ đúng durability. Nội dung mô tả đầy đủ giao thức/test/cách tiếp tục trong bài và README, không phụ thuộc liên kết đọc thêm.

## Nguồn chính thức đã đối chiếu

- https://doc.rust-lang.org/std/process/struct.Child.html — Drop, kill, wait, try_wait và lifecycle direct child.
- https://doc.rust-lang.org/std/process/struct.Stdio.html — pipe buffer và deadlock.
- https://doc.rust-lang.org/std/io/trait.Read.html — short read, EOF và read_exact.
- https://doc.rust-lang.org/std/io/trait.Write.html — short write, write_all và lỗi một phần.
- https://doc.rust-lang.org/std/sync/mpsc/index.html — channel ownership/disconnect.
- https://doc.rust-lang.org/nomicon/other-reprs.html — repr(C), repr(packed), alignment.
- https://doc.rust-lang.org/std/sync/atomic/enum.Ordering.html — publication/ordering.
- https://doc.rust-lang.org/std/os/unix/net/struct.UnixStream.html — socket timeout/shutdown và phạm vi Unix.
- https://docs.kernel.org/rust/general-information.html — no_std, kernel build và abstraction so với binding.
- https://doc.rust-lang.org/cargo/reference/profiles.html — điều kiện build/profile khi đo.

## Kiểm chứng

2026-11-11: 12/12 solutionCode biên dịch rustc 1.99.1 edition 2024, assertion/stdout đúng; chapter partition đủ 18 ID. Strict TypeScript/noEmit đạt. Kết quả chi tiết work/expansion-systems/validation.json. Root kiểm tra Cargo tập trung, không có khẳng định trước kết quả đó.

## Giới hạn OS, native và kernel

Supervisor chạy fixture do dự án sở hữu; không thực thi binary không tin cậy. Capture có trần và direct child được kill/wait, nhưng descendant giữ pipe có thể kéo dài drain; không có process-group/job-object hay giới hạn CPU/RAM của child. Đây không là sandbox.

Journal một writer, checksum FNV học tập không xác thực dữ liệu và không chống sửa chủ đích. sync_all không thay mọi quy tắc metadata/directory của filesystem. Explicit repair chỉ dành cho tail thiếu byte theo mô hình lỗi đã nêu; corrupt phải giữ để điều tra.

IPC demo dùng Unix API trên macOS/Linux; Windows chỉ có core/framing, cần adapter quyền/endpoint khác và test riêng. Demo hữu hạn một client, state RAM; pool/bounded admission/persistence là phần capstone phải hoàn thiện. Chưa tải kernel module, chưa chạy driver, chưa kiểm tra IRQ/DMA/teardown thật. Bài kernel chuẩn bị mô hình review và ranh giới, không tuyên bố năng lực driver hoàn chỉnh chỉ từ host tests.

Rubric là tự nghiệm thu bằng chứng dự án, không đảm bảo đủ cho mọi vị trí hệ thống hoặc môi trường kernel.

## Kết quả kiểm thử tập trung đã xác nhận

2026-11-11: Root xác nhận toàn bộ 7 Cargo localLab (gốc và mở rộng) PASS. Host test gồm child process tự tạo, Unix socket và journal; chưa kiểm chứng kernel, Windows IPC hoặc giới hạn process tree của mọi hệ điều hành.

Rà đáp án 2026-11-11: 12 quiz mới và 12 câu đánh giá mỗi nhóm đều có bốn đáp án đúng ở mỗi vị trí 0/1/2; thứ tự đã xáo, không lặp vòng 0-1-2. Đổi options cùng correct, giữ nguyên ý trả lời và giải thích. Strict TypeScript của cả năm expansion tiếp tục PASS sau lượt rà.
