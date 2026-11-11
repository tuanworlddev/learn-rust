# Nhúng và IoT — mở rộng nội dung và ma trận năng lực

Thêm 12 bài mới (402–425 từ lý thuyết/bài), giữ sáu ID cũ, chia đúng sáu chương/18 bài. Mỗi bài có bài tập std-only chạy trong trình duyệt, assertion/stdout cố định, gợi ý, câu hỏi và nguồn biên soạn ẩn khỏi luồng học. Ba localLab Cargo hoàn chỉnh: driver embedded-hal 1.0.0; telemetry CRC16/outbox; controller trạm đo no_std với journal hai slot. Hai mô phỏng, mỗi mô phỏng hai nhánh/bốn bước, mô tả đọc I²C và phục hồi sau mất nguồn. 12 câu đánh giá tình huống phân bố đều sáu chương, sáu kỹ năng gắn bài và dự án.

## Ma trận đầu ra → bài học → bằng chứng

| Đầu ra | Bài học | Bằng chứng dự án |
| --- | --- | --- |
| Ngân sách RAM/thời gian và hợp đồng bo | embedded-budget-units, embedded-board-contract | Bảng cấu hình/target trong embedded-project-driver; kiểm thử overflow và deadline |
| GPIO, debounce, ngắt và DMA | embedded-gpio, embedded-debounce, embedded-interrupt-dma | Chuỗi thời gian và giao thức sở hữu buffer; adapter bo trong dự án station |
| Driver và chất lượng dữ liệu | embedded-driver-project, embedded-calibration | Fake xác minh địa chỉ/thanh ghi/thứ tự, test mẫu âm/NotReady/bus error |
| Lập lịch, khung và ACK | embedded-scheduling, embedded-telemetry-project | CRC test vector, khung hỏng/ngắn, queue đầy, ACK cũ, sequence cạn |
| Dữ liệu bền và năng lượng | embedded-config-journal, embedded-power-budget | Cắt mọi prefix ghi trước commit; bảng điện lượng theo pha và phép đo cần hoàn thiện |
| Firmware phục hồi được | embedded-firmware-update, embedded-station-project | Hysteresis, mẫu lỗi, health deadline, rollback plan và báo cáo target/hardware |

## Kiến thức được bổ sung

Các bài cũ giới thiệu no_std/GPIO/bus/async/RAM/độ tin cậy. Bản mở rộng đi sâu vào giới hạn số học, mẫu có chất lượng và độ mới, tick rollover, DMA ownership, critical section đa core, ngân sách queue, deadline/catch-up, framing, CRC so với xác thực, ACK/session, flash commit, wear, năng lượng toàn bo, boot thử và heartbeat có ý nghĩa. Mỗi phần có failure analysis và yêu cầu nghiệm thu cụ thể, không kết bài bằng việc bắt người học đọc một liên kết ngoài.

## Nguồn chính thức đã đối chiếu

- https://docs.rs/embedded-hal/1.0.0/embedded_hal/i2c/trait.I2c.html — transaction và các phương thức read/write/write_read mặc định.
- https://docs.rs/embedded-hal/1.0.0/embedded_hal/i2c/index.html — ownership bus, địa chỉ và hợp đồng hoàn tất giao dịch.
- https://doc.rust-lang.org/stable/embedded-book/start/hardware.html — phần cứng, memory map và target.
- https://doc.rust-lang.org/stable/embedded-book/concurrency/index.html — atomic, critical section và giả định một core.
- https://doc.rust-lang.org/stable/embedded-book/c-tips/index.html — volatile và bộ nhớ ánh xạ, không đồng nhất với đồng bộ.
- https://embassy.dev/book/ — executor, timer và tổ chức task.
- https://docs.embassy.dev/embassy-time/0.4.0/default/struct.Ticker.html — lịch theo chu kỳ.
- https://docs.espressif.com/projects/rust/book/ — phạm vi toolchain/target và adapter ESP.

## Kiểm chứng và giới hạn

2026-11-11: 12/12 solutionCode đạt rustc 1.99.1 edition 2024, mọi assertion và stdout mong đợi đúng; bộ kiểm tra xác nhận chapter partition đủ 18 ID. Strict TypeScript/noEmit đạt. Dữ liệu ở work/expansion-embedded/validation.json. Root phụ trách Cargo test tập trung; chưa khẳng định kết quả trước khi root xác nhận.

LearnTemp là giao thức cảm biến giả lập được định nghĩa đầy đủ, không phải datasheet của linh kiện thương mại. Driver thực sự dùng embedded-hal và no_std; fake không chứng minh điện áp hay timing. Telemetry outbox nằm trong RAM và mất qua reset nếu chưa bổ sung lưu bền. Journal là mô hình byte trong RAM, chưa mô phỏng erase/write granularity, cache, wear hoặc nguồn điện. Chưa nạp ESP32/STM32, chưa đo dòng, DMA/cache hoặc cập nhật bootloader thật. Những bước này có hướng dẫn và tiêu chí ở bài/README, được đánh dấu thành bằng chứng cần hoàn thiện cho bo đã chọn.

Rubric là tự nghiệm thu năng lực bằng dự án; không khẳng định học xong một bản mô phỏng đã đủ cho mọi firmware hoặc sản phẩm điều khiển vật lý.

## Kết quả kiểm thử tập trung đã xác nhận

2026-11-11: Root xác nhận toàn bộ 5 Cargo localLab (gốc và mở rộng) PASS; log tập trung: reports/course-expansion/embedded-labs.json. Phạm vi là host; chưa flash hoặc đo phần cứng.

Rà đáp án 2026-11-11: 12 quiz mới và 12 câu đánh giá mỗi nhóm đều có bốn đáp án đúng ở mỗi vị trí 0/1/2; thứ tự đã xáo, không lặp vòng 0-1-2. Đổi options cùng correct, giữ nguyên ý trả lời và giải thích. Strict TypeScript của cả năm expansion tiếp tục PASS sau lượt rà.
