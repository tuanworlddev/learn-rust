# Mở rộng WebAssembly

Giữ 6 bài cũ, thêm 12 bài (425–456 từ phần lý thuyết), tổng 18 bài/6 chương. Bổ sung 3 dự án có Rust, wasm-bindgen, JavaScript, HTML và test: Pixelkit, Search-index, Offline-report. Có 12 câu hỏi tình huống, 6 kỹ năng, rubric 4–5 mục/dự án và 2 mô phỏng hai nhánh.

## Ma trận năng lực → bài học → bằng chứng
| Năng lực | Bài học | Bằng chứng dự án |
| --- | --- | --- |
| Kiến trúc/target/build | runtime, architecture, build-pipeline | Pixelkit: Cargo cdylib/rlib, build target web, init và artifact |
| Binding/API/lỗi | bindings, abi-contracts, errors-panics | Export bytes/Result, SearchIndex object, Report state; test Wasm riêng |
| Buffer/memory | memory, buffer-validation, image-project | Pixelkit: alpha/layout/budget, native test và canvas adapter |
| Worker/protocol | workers, worker-protocol, search-project | Worker thật, ID/generation, terminate/free, stale result |
| Đo/tài nguyên | performance, benchmarking, resource-budgets | Offline-report: File.stream/TextDecoder/pending; yêu cầu raw benchmark/memory |
| Kiểm thử/phát hành | release, browser-testing, report-project | Native/Wasm/browser evidence, artifact cùng version và failure/cancel/download |

## Kiểm chứng
12/12 lời giải mới đã biên dịch rustc --edition 2024 và chạy assertions/stdout trên Mac, kết quả tại work/expansion-wasm/validation.json. npx tsc --noEmit toàn repo đạt tại thời điểm bàn giao. Root chạy Cargo/Wasm tập trung; child chưa tự nhận những lệnh đó đã chạy.

## Phạm vi và điều cần kiểm tra thực tế
- Cả ba lab có binding wasm-bindgen thật, không chỉ thuật toán giả lập. Pixelkit có canvas; Search-index có module worker; Offline-report có worker đọc stream và UI tải JSON.
- Browser tests, UI race/cancel, cold/warm latency, peak memory, MIME/cache/CDN và thiết bị đích cần được thực thi, lưu bằng chứng riêng. Cargo native không chứng minh các thuộc tính đó.
- Pixelkit dùng grayscale trọng số trên sRGB bytes, không phải color management đầy đủ; decode ảnh có thể cấp phát trước kiểm tra pixel.
- Search baseline all-terms substring với lowercase Unicode đơn giản, không stemming/normalization/ranking.
- Report hỗ trợ CSV hạn chế không quote; lỗi poison state, không cho báo cáo một phần. Hỗ trợ CSV tổng quát là nhiệm vụ capstone có test, không giả định có sẵn.
- Số bài/quiz không cấp chứng nhận sẵn sàng dự án; kỹ năng cần source, test âm, demo và review.

## Nguồn chính thức đối chiếu
- https://doc.rust-lang.org/rustc/platform-support/wasm32-unknown-unknown.html — target và khả năng host.
- https://wasm-bindgen.github.io/wasm-bindgen/reference/types/result.html — Result/exception và import catch.
- https://wasm-bindgen.github.io/wasm-bindgen/reference/types.html — kiểu qua biên giới.
- https://wasm-bindgen.github.io/wasm-bindgen/reference/deployment.html — phát hành JS/Wasm.
- https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/Memory/grow — detach với memory không shared, view mới.
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers — worker context/message/transfer.
- https://wasm-bindgen.github.io/wasm-bindgen/wasm-bindgen-test/usage.html — runner, native khác Wasm/browser tests.
- https://developer.mozilla.org/en-US/docs/Web/API/Performance/now — clock đo duration.
- https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/decode — streaming decode.
Nguồn chỉ phục vụ biên tập; giải thích và source cần thiết nằm trực tiếp trong hệ thống.

## Phân bố đáp án đã rà soát
Mỗi nhóm 12 quiz bài mới và 12 câu hỏi đánh giá có phân bố correct 4/4/4 ở ba vị trí. Đã hoán đổi options cùng correct, giữ nguyên kiến thức, giải thích, code và ID.

Root đã xác nhận cả ba dự án mới chạy wasm-pack test --node và build --target web --out-dir web/pkg đạt (6 bước), cùng 5 host Cargo lab Wasm đạt. Bằng chứng ở reports/course-expansion/wasm-targets.json. Root đang kiểm tra thao tác browser riêng; chưa gộp kết quả chưa có vào báo cáo.
