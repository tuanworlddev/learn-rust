# Rà soát nội dung Nhúng và IoT

Ngày rà soát: 2026-11-11 (Asia/Saigon).

## Phạm vi bàn giao

- `src/data/specializations/embedded.ts` xuất `embeddedBundle`.
- Track `embedded`, module `track-embedded`.
- Sáu bài hoàn chỉnh, mỗi bài có bốn phần lý thuyết, bài tập, lời giải, câu hỏi, giải thích và nguồn chính thức.
- Tổng cộng 38 assertion trong sáu lời giải trên web; không dependency ngoài thư viện chuẩn.
- Hai lab Cargo: thư viện hiệu chuẩn `no_std` không dependency và driver generic dùng `embedded-hal = "=1.0.0"` với fake I2C.
- Dự án cuối lộ trình gồm năm mốc nghiệm thu, mã nguồn, cấu hình phần cứng, kiểm thử, đo tài nguyên và quy trình phục hồi.
- Bài đầu tham chiếu hình `/images/lessons/embedded-workbench.webp`; root quản lý asset. Alt/caption mô tả chuỗi cảm biến → firmware → hiển thị, không diễn giải hình thành sơ đồ đấu dây.

| Bài | Nội dung chính | Số từ phần lý thuyết theo khoảng trắng |
| --- | --- | ---: |
| `embedded-no-std` | Target, core/alloc, startup, đơn vị và test host | 528 |
| `embedded-gpio` | PAC/HAL/driver, peripheral ownership, active-low và debounce | 536 |
| `embedded-sensors` | I2C/SPI, giao dịch, byte có dấu, lỗi bus và fake driver | 531 |
| `embedded-async` | Embassy, ngắt, task hợp tác, deadline và rollover | 541 |
| `embedded-memory` | RAM, ring buffer, quá tải, điện năng và cách đo | 532 |
| `embedded-reliability` | Test theo tầng, nạp firmware, watchdog, lưu cấu hình và rollback | 578 |

## Nguồn kỹ thuật đã kiểm tra

Các đoạn giải thích và ví dụ được viết mới; không chép nguyên bài từ tài liệu.

1. [The Embedded Rust Book: no_std](https://docs.rust-embedded.org/book/intro/no-std.html): ranh giới `core`, `std`, `alloc` và môi trường bare metal.
2. [The Embedded Rust Book: concurrency](https://docs.rust-embedded.org/book/concurrency/index.html): đồng thời do interrupt, chia sẻ dữ liệu và yêu cầu bảo vệ theo nền tảng.
3. [The Rust on ESP Book](https://docs.espressif.com/projects/rust/book/): quy trình công cụ, tính ổn định API và cấu trúc hệ sinh thái.
4. [esp-generate](https://docs.espressif.com/projects/rust/book/getting-started/tooling/esp-generate.html): generator tạo phối hợp crate/features; mỗi phiên bản generator nhắm một bộ phiên bản hệ sinh thái.
5. [espflash](https://docs.espressif.com/projects/rust/book/getting-started/tooling/espflash.html): công cụ nạp serial trong hệ sinh thái Espressif.
6. [esp-hal 1.1.0 cho ESP32-C3](https://docs.espressif.com/projects/rust/esp-hal/1.1.0/esp32c3/esp_hal/index.html): peripheral singletons, `reborrow`, cấu hình GPIO và `Output::new`. Snippet GPIO khóa vào API 1.1.
7. [esp-hal nhánh main cho ESP32-C3](https://docs.espressif.com/projects/rust/esp-hal/main/esp32c3/esp_hal/index.html): tài liệu hiện hiển thị 1.2.0. Không suy ra mọi dự án phải nâng theo nhánh main.
8. [embedded-hal 1.0 I2C](https://docs.rs/embedded-hal/1.0.0/embedded_hal/i2c/index.html): địa chỉ, transaction, sở hữu bus và adapter chia sẻ.
9. [embedded-hal 1.0 OutputPin](https://docs.rs/embedded-hal/1.0.0/embedded_hal/digital/trait.OutputPin.html): lệnh mức output không chứng minh mức điện vật lý ngoài chân.
10. [Embassy Book](https://embassy.dev/book/): executor, time driver, chia sẻ peripheral, cấu trúc dự án và bootloader.
11. [Embassy executor](https://docs.embassy.dev/embassy-executor/git/cortex-m/index.html): task được cấp phát static, poll theo wake, cooperative execution; trang tham chiếu hiện hiển thị 0.10.0.
12. [Embassy STM32](https://docs.embassy.dev/embassy-stm32/0.5.0/stm32f401re/index.html): tài liệu theo đúng MCU và phiên bản; trang có liên kết latest 0.6.0. Nội dung không đưa cấu hình generic dùng cho mọi STM32.
13. [heapless 0.9.3 SPSC](https://docs.rs/heapless/0.9.3/heapless/spsc/index.html): queue hữu hạn; `Queue<T,N>` giữ N-1 mục ở API tham chiếu. Bài tập ring buffer tự viết giữ đủ N và ghi rõ khác biệt.

Trang [no_std-training của Espressif](https://docs.espressif.com/projects/rust/no_std-training/) hiện tự ghi tài liệu đang lỗi thời và đang viết lại. Không dùng code từ trang này làm mẫu firmware hiện hành.

## Những ranh giới được giữ rõ trong bài học

- Firmware ESP32-C3 và firmware STM32 cần target, toolchain, startup, linker và lựa chọn bo phù hợp; không gọi một chương trình `std` trên trình duyệt là firmware.
- Lab `sensor-core` có `cargo check --target riscv32imc-unknown-none-elf`, nhưng chỉ là thư viện. Chưa có binary startup, panic handler hay liên kết firmware để nạp.
- Lab `register-sensor` dùng thanh ghi 0x10, địa chỉ 0x48 và dữ liệu i16 big-endian do khóa học định nghĩa. Không khẳng định đó là giao thức một cảm biến thương mại.
- Packet checksum XOR trong bài tập chỉ minh họa parser; không dùng làm xác thực nguồn hoặc bảo vệ firmware.
- Ring buffer bài tập là cấu trúc đơn luồng cần `&mut self`; không ngầm tuyên bố an toàn chia sẻ giữa interrupt và task.
- So sánh timer u32 chỉ có hợp đồng trong cửa sổ nhỏ hơn nửa vòng; không quảng cáo so sánh được mọi timestamp tùy ý.
- Cấu hình hai slot trong bài cuối là mô hình lựa chọn sau khi ghi gián đoạn. Driver flash, thứ tự commit có tính nguyên tử theo thiết bị và bootloader phải được kiểm chứng riêng.
- Lưu cấu hình dùng generation tăng tuyến tính; bài tập ghi rõ chưa hỗ trợ generation rollover.

## Kiểm tra đã thực hiện

- TypeScript `transpileModule`: **0 lỗi cú pháp**.
- TypeScript strict diagnostics cho file mới: **0 lỗi**.
- Chạy `validateCatalog` trên track/module/sáu bài: **đạt**.
- Kiểm tra dữ liệu: sáu ID duy nhất, thứ tự bài đúng track, reference HTTPS, hai lab có manifest và source.
- Rà soát thủ công test biên: ADC mẫu số 0/range/u16 lớn nhất; debounce dội/giữ/thả/ngưỡng 0; packet âm/ngoài miền/ngắn/checksum; timer trước/sau rollover; FIFO đầy/rỗng/quay vòng/N=0; recovery slot pending/hỏng/bằng generation/không hợp lệ.

## Kiểm tra cần root chạy trên Mac

Chưa tuyên bố Rust hoặc phần cứng đã chạy: môi trường staging không có `rustc` hay bo nhúng kết nối.

1. Biên dịch/chạy sáu `solutionCode` theo edition 2024 và so sánh stdout.
2. Trích hai lab ra thư mục riêng, chạy `cargo test` cho từng lab. Mỗi lab có hai test.
3. Nếu đã có target RISC-V, chạy `cargo check --target riscv32imc-unknown-none-elf` cho `sensor-core`.
4. Hardware test cần ESP32-C3 hoặc một bo STM32 được chỉ định, cảm biến có datasheet, kết nối và công cụ nạp thích hợp. Không ghi hardware test là đã đạt nếu chưa có thiết bị.

## Khôi phục bản bàn giao

Hai tệp được khôi phục trực tiếp vào dự án Mac từ nội dung đã viết trong lịch sử tác vụ sau khi staging không còn truy cập được. Bản khôi phục giữ đủ sáu bài, hai lab, 38 assertion, nguồn và capstone. Kiểm tra TypeScript/catalog và mã băm của bản trên Mac được thực hiện lại trước khi bàn giao cho root; kiểm thử Rust tập trung do root tiếp tục điều phối.
