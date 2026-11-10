# Hướng chuyên sâu WebAssembly

Ngày đối chiếu tài liệu: **2026-11-10 (UTC)**. Phạm vi sở hữu: `src/data/specializations/wasm.ts` và báo cáo này.

## Nội dung đã bổ sung

Export `wasmBundle: SpecializationBundle`; track `wasm`, module `track-wasm`. Sáu bài theo thứ tự từ nền tảng đến phát hành:

| Bài | Trọng tâm | Số từ lý thuyết* | Assertion bài tập |
| --- | --- | ---: | ---: |
| wasm-runtime | Host, target, linear memory, kiểm tra khoảng byte | 537 | 7 |
| wasm-bindings | Hợp đồng JS/TS, số, Result, validation và Serde | 519 | 8 |
| wasm-memory | Slice, TypedArray, copy, memory.grow và allocation | 517 | 5 |
| wasm-workers | Promise, fetch, Worker, transfer, hủy và reply cũ | 525 | 8 |
| wasm-performance | Đo pipeline, batching và lõi xử lý tăng dần | 519 | 6 |
| wasm-release | Artifact, cache, kiểm thử browser và accessibility | 523 | 6 |

*Đếm từ bằng khoảng trắng trên trường `sections[].text`, không bao gồm code.

Tổng cộng: **24 phần lý thuyết, 6 bài tập, 40 assertion, 6 câu hỏi kiểm tra, 2 local lab, 5 mốc capstone**. Mỗi bài có mục tiêu, yêu cầu thực hành, starter, lời giải, output xác định, gợi ý và nguồn đọc tiếp. Tổng thời lượng gợi ý 330 phút; capstone cần thời gian riêng.

Bài tập trong trình chạy web dùng `std` và rèn hợp đồng lõi: phép tính khoảng, validation số, vòng đời view, trạng thái job, phân lô và chọn release. Không mô tả trình chạy Rust hiện tại như trình duyệt thực thi Wasm.

## Hai lab có đủ tệp để dựng lại

### 1. Module chuẩn hóa nhãn

Năm tệp: Cargo.toml, src/lib.rs, tests/browser.rs, index.html và app.js. Có export `normalizeLabel` / `parseLimit`, xử lý exception trong JavaScript, chờ khởi tạo trước khi bật nút, semantic form và thông báo trạng thái.

Công cụ cần: Rust, target wasm32-unknown-unknown, wasm-pack, Chrome để chạy kiểm thử browser, Python 3 cho HTTP server mẫu. Cargo edition 2024. Các lệnh được cung cấp cho cài target, cài wasm-pack, host test, browser test, build `--target web` và phục vụ trang mẫu.

Hai unit test kiểm tra lõi trên host; một wasm-bindgen-test kiểm tra hành vi các hàm export trong môi trường browser. Trang JS là phần tích hợp binding và thao tác người dùng; browser test Rust không được coi là kiểm thử DOM hoàn chỉnh.

### 2. Histogram xử lý tăng dần

Hai tệp: Cargo.toml và src/lib.rs. Không có dependency. `Histogram::advance` nhận ngân sách byte, xử lý tiếp từ cursor và trả trạng thái hoàn thành.

Ba test kiểm tra tương đương giữa các kích thước lô, đầu vào rỗng, budget bằng 0 không thay đổi trạng thái và gọi sau khi hoàn tất không đếm lại. Có lệnh debug/release test và Clippy. Đây là lõi host, cần adapter Worker riêng khi đưa vào sản phẩm; gọi advance trong vòng lặp đồng bộ không tự nhường event loop.

## Phiên bản và quyết định kỹ thuật

Lab cố định **wasm-bindgen = 0.2.129** cùng **wasm-bindgen-test = 0.3.79**. Manifest của wasm-bindgen-test 0.3.79 phụ thuộc chính xác wasm-bindgen 0.2.129 và js-sys 0.3.106. Đã thấy wasm-bindgen 0.2.130 trong tài liệu hiện hành, nhưng không ghép phiên bản này với một test runner chưa xác nhận tương thích. Không gọi cặp được ghim là “mới nhất”.

wasm-pack CLI được cài qua `cargo install wasm-pack --locked`. Nội dung yêu cầu ghi lại phiên bản công cụ khi chạy và giữ Cargo.lock của ứng dụng. Tài liệu wasm-pack có banner tài liệu chưa phát hành; lab chỉ dùng các lệnh build/test cơ bản, không dùng tùy chọn thử nghiệm.

Các điểm đã rà soát:

- Target rustc và target sinh binding là hai lựa chọn khác nhau; wasm32-unknown-unknown không cung cấp hành vi hệ điều hành đầy đủ cho std.
- Number chuyển thành u32 có thể làm mất thông tin trước validation. API cần từ chối dữ liệu thập phân nhận f64 rồi kiểm tra trước khi cast; u64 trong binding dùng BigInt.
- Export đồng bộ Result báo lỗi bằng exception; export async dùng Promise rejection. Deserialize không thay thế quy tắc nghiệp vụ.
- Numeric slice qua binding có thể sao chép. Transfer ArrayBuffer sang Worker không chứng minh đường đi vào linear memory là zero-copy.
- Với memory không shared, memory.grow làm buffer cũ detached; với shared memory, buffer cũ không tự có chiều dài mới. Vec có thể di chuyển allocation độc lập với identity của memory.buffer.
- Async không tự chuyển việc CPU sang Worker. Worker không tự làm thuật toán song song; cần thiết kế phân công, hàng đợi và ranh giới chia sẻ dữ liệu.
- Loại bỏ reply cũ khác với ngừng CPU của job. Job dài cần chia lô, xử lý hủy phù hợp hoặc kết thúc Worker.
- Module tải xuống không bảo vệ bí mật. Kiểm tra offset không chứng minh provenance/alignment; kiểm tra metadata release không chứng minh chữ ký hay hash.
- Đo hiệu năng gồm tải, khởi tạo, copy, binding, thuật toán và render. Test duration không được dùng làm bằng chứng benchmark UI.
- Artifact wrapper/binary phải cùng phiên bản; cache, đường dẫn, MIME, CSP/CORS và service worker cần kiểm tra ở môi trường triển khai.

## Capstone

Bộ phân tích tệp trong trình duyệt có năm mốc: hợp đồng và lõi; binding và bộ nhớ; Worker, tiến độ và hủy; đo hiệu năng; phát hành và trải nghiệm.

Mỗi mốc có tác vụ và điều kiện nghiệm thu. Bàn giao gồm source, Cargo.lock, hợp đồng TypeScript, host/browser/UI tests, sơ đồ sở hữu bộ nhớ, báo cáo đo có cấu hình thiết bị và hướng dẫn build/deploy/rollback. Năm câu hỏi review kiểm tra hiểu biết về copy/transfer, view hết hiệu lực, hủy, đo pipeline và tab đang mở khi có release mới.

## Nguồn sơ cấp đã đối chiếu

- [rustc: wasm32-unknown-unknown](https://doc.rust-lang.org/rustc/platform-support/wasm32-unknown-unknown.html) — giới hạn std và nền tảng.
- [wasm-bindgen guide](https://wasm-bindgen.github.io/wasm-bindgen/) — mô hình binding.
- [Number types](https://wasm-bindgen.github.io/wasm-bindgen/reference/types/numbers.html), [numeric slices](https://wasm-bindgen.github.io/wasm-bindgen/reference/types/number-slices.html), [Result](https://wasm-bindgen.github.io/wasm-bindgen/reference/types/result.html) — chuyển kiểu, copy và lỗi.
- [Promises và Rust futures](https://wasm-bindgen.github.io/wasm-bindgen/reference/js-promises-and-rust-futures.html), [Serde](https://wasm-bindgen.github.io/wasm-bindgen/reference/arbitrary-data-with-serde.html) — async và DTO.
- [Ví dụ không dùng bundler](https://wasm-bindgen.github.io/wasm-bindgen/examples/without-a-bundler.html), [deployment](https://wasm-bindgen.github.io/wasm-bindgen/reference/deployment.html) — package và khởi tạo.
- [wasm-pack build](https://wasm-bindgen.github.io/wasm-pack/book/commands/build.html), [wasm-pack test](https://wasm-bindgen.github.io/wasm-pack/book/commands/test.html), [browser tests](https://wasm-bindgen.github.io/wasm-bindgen/wasm-bindgen-test/browsers.html) — lệnh lab.
- [Manifest wasm-bindgen-test 0.3.79](https://docs.rs/crate/wasm-bindgen-test/0.3.79), [wasm-bindgen 0.2.129](https://docs.rs/wasm-bindgen/0.2.129/wasm_bindgen/) — đối chiếu cặp phiên bản.
- [MDN Memory.grow](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/Memory/grow) — buffer detachment và shared memory.
- [MDN Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers), [transferable objects](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects), [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) — môi trường, copy/transfer và isolation.
- [MDN performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now), [HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching), [instantiateStreaming](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/instantiateStreaming_static) — đo, cache và MIME.

## Kiểm tra đã thực hiện

- TypeScript transpile: không có diagnostic.
- TypeScript program với cấu hình dự án, noEmit và incremental tắt cho lần kiểm tra đơn lẻ: không có diagnostic trong wasm.ts.
- ESLint riêng wasm.ts: exit 0.
- `validateCatalog` với module, sáu lesson và track: đạt.
- Cú pháp ES module của app.js trong lab, kiểm tra bằng Node: đạt.
- Kiểm tra cấu trúc: 6 ID theo thứ tự, 4 section mỗi bài, word count, assertion count, hai lab và năm mốc capstone.

**Chưa thực thi trong phiên kiểm tra của agent này:** Rust compiler, cargo test, wasm-pack build/test hoặc trình duyệt. Agent điều phối phụ trách biên dịch các lời giải Rust; lab browser cần toolchain/browser và được báo cáo riêng sau khi chạy. Không suy ra các kiểm tra chưa chạy là đã đạt.
