# Hướng AI và Machine Learning

Ngày đối chiếu: **2026-11-10 (UTC)**.
Phạm vi: **6 bài, 24 phần giảng, 6 bài tập web, 6 quiz, 2 lab Cargo, 1 capstone 5 mốc**.

## Tích hợp

- File nội dung: `src/data/specializations/ai.ts`.
- Export: `aiBundle: SpecializationBundle`.
- Track ID: `ai`; module ID: `track-ai`.
- Không thay đổi index, UI, dependency của website hoặc cấu hình Git.
- Các lab nằm trong dữ liệu bài học; dependency học máy không được thêm vào ứng dụng Next.js.

## Lộ trình

| Bài | Trọng tâm | Thực hành |
| --- | --- | --- |
| `ai-tensors` | Rank/shape/dtype/device, thứ tự trục, broadcasting, ngân sách tính toán và bộ nhớ | Nhân ma trận row-major có kiểm tra shape, overflow, ngân sách và số không hữu hạn |
| `ai-data-pipeline` | Chia train/validation/test, nhóm/thời gian, fit/transform, schema và tái lập | Scaler Welford, phương sai tổng thể, cột hằng, không fit lại trên test |
| `ai-burn-training` | MSE/SGD, gradient, Burn 0.22 runtime autodiff, vòng đời graph, train/valid | Một bước SGD std-only và lab Burn CPU thật |
| `ai-candle-inference` | Logit/softmax, shape/nhãn, SafeTensors, kiểm tra artifact, fixture vàng | Softmax ổn định và lab Candle CPU thật |
| `ai-evaluation` | Confusion matrix, precision/recall, metric chưa xác định, chọn ngưỡng, baseline | Đánh giá nhị phân với `Option<f64>` cho mẫu số 0 |
| `ai-serving` | Giới hạn tải, batching/padding, latency/throughput, precision, phát hành/rollback | Chia batch giữ thứ tự theo ngân sách padded tokens |

Phần giảng sau chỉnh văn bản: **497, 493, 485, 489, 491, 515 từ** theo cách đếm phân tách khoảng trắng. Mỗi bài có bốn phần; không tính mã, đề bài hoặc capstone vào số từ này.

## Phiên bản và quyết định API

### Burn

Ghim **`burn = "=0.22.1"`**, `default-features=false`, chỉ bật **`std`, `flex`, `autodiff`**. MSRV của crate được crates.io báo là **1.95**; Cargo manifest của lab ghi rõ.

Burn 0.22 thay đổi API so với nhiều bài viết cũ: `Tensor<D>`, backend chọn bằng `Device`, và `Device::flex().autodiff()`. Nội dung không dùng ví dụ cũ `Tensor<B,D>` hoặc `Autodiff<NdArray>`. Flex được chọn rõ để tránh phụ thuộc GPU và tránh dùng backend NdArray đã deprecated.

Lab gọi backward trên forward mới ở mỗi bước. Gradient được đọc về CPU để minh họa hai tham số; đây là lựa chọn giảng dạy cho mô hình rất nhỏ, không phải hướng tối ưu production. Bài giải thích module/optimizer là hướng thích hợp khi có nhiều tham số.

### Candle

Ghim **`candle-core = "=0.11.1"`**, `default-features=false`, dùng **`Device::Cpu`**. Không bật CUDA, Metal, MKL hoặc Accelerate. Không tải weights hay dataset từ internet trong chương trình lab.

Tài liệu trang con `latest` của docs.rs có lúc còn hiển thị 0.11.0 trong cache tìm kiếm. Vì vậy ngoài docs, đã kiểm tra trực tiếp crates.io API 0.11.1 và source archive chính thức `candle-core-0.11.1.crate`: các hàm `safetensors::save`, `load_buffer` và cấu trúc feature phù hợp bản đã ghim.

## Hai lab Cargo

### 1. Burn: gradient thật và hồi quy CPU

Bài `ai-burn-training`, package `burn-line-lab`.

Bốn tệp:

- `Cargo.toml`
- `src/lib.rs`
- `src/main.rs`
- `tests/training.rs`

Dữ liệu cố định `x=[-2,-1,0,1,2]`, `y=2x+1`. Huấn luyện 150 bước full-batch SGD, learning rate 0.05; hai điểm −3 và 3 chỉ được dùng trong test sau huấn luyện. API kiểm tra shape, input hữu hạn, cấu hình, loss/gradient/parameter hữu hạn.

Năm integration test:

1. Gradient khớp phép tính tay `loss=17, dw=-13, db=-8`.
2. Gradient theo w khớp sai phân hữu hạn trong dung sai.
3. Hội tụ gần `w=2,b=1` và sai số nhỏ ở hai điểm giữ lại.
4. Từ chối dữ liệu rỗng, lệch shape, NaN và overflow.
5. Từ chối cấu hình bước học không hợp lệ.

Không gọi đây là bằng chứng tổng quát hóa trên dữ liệu thực: dữ liệu tổng hợp được tạo đúng từ mô hình tuyến tính.

### 2. Candle: inference và SafeTensors

Bài `ai-candle-inference`, package `candle-inference-lab`.

Bốn tệp:

- `Cargo.toml`
- `src/lib.rs`
- `src/main.rs`
- `tests/inference.rs`

Bộ phân loại tuyến tính hai đặc trưng, hai lớp; trọng số mẫu được đặt rõ, không giả vờ đã huấn luyện. Thực hiện matmul, bias broadcasting và softmax theo hàng. Trước nạp kiểm tra giới hạn 1 MiB bằng bounded read; sau nạp kiểm tra đúng tên/shape/dtype, đủ hai tensor và trọng số hữu hạn. Batch giới hạn 64 mẫu.

Sáu integration test:

1. Xác suất khớp công thức độc lập và tổng bằng 1 trong dung sai.
2. Lưu–nạp giữ dự đoán.
3. Từ chối shape/dtype/trọng số không hợp lệ.
4. Từ chối batch rỗng, quá lớn, NaN/Infinity và kết quả không hữu hạn.
5. Từ chối artifact hỏng hoặc thiếu tensor.
6. Từ chối artifact lớn hơn giới hạn trước parsing.

Test I/O tạo thư mục tạm duy nhất rồi dọn thư mục do chính test sở hữu. Lab dùng safe load buffer, không dùng mmap unsafe. Nó chỉ nạp artifact tự tạo; định dạng SafeTensors không được trình bày như bằng chứng về chất lượng, nguồn gốc hoặc tính phù hợp giấy phép của mô hình.

## Capstone và tiêu chí đánh giá

**Dịch vụ phân loại cửa sổ cảm biến mẫu** gồm năm mốc:

1. Schema, bộ sinh dữ liệu, chia tập theo nhóm/thời gian, không giao nhau.
2. Baseline, mô hình Burn nhỏ, ghi cấu hình và theo dõi lỗi số học.
3. Khóa ngưỡng bằng validation, đánh giá test và từng lớp.
4. Artifact, phép chuẩn hóa, fixture đối chiếu khi chuyển sang Candle.
5. API có giới hạn tải, benchmark release, kích hoạt và rollback.

Có sáu sản phẩm bàn giao và bảy câu hỏi review. Tiêu chí dùng kiểm thử/fixture/số đo, không hứa đạt mức chính xác trên dữ liệu thực hoặc bảo đảm năng lực tuyển dụng chỉ sau khi đọc bài.

Chuyển trọng số Burn→Candle là việc ánh xạ có kiểm chứng tên/chiều/shape/dtype. Nội dung không khẳng định hai framework tự tương thích mọi kiến trúc hoặc mọi định dạng checkpoint.

## Nguồn chính thức đã đối chiếu

- [Burn 0.22.1 API](https://docs.rs/burn/0.22.1/burn/) — phiên bản, backend và feature.
- [Burn: chuyển sang 0.22](https://burn.dev/books/burn/migrating-to-0.22.html) — runtime backend, Tensor<D>, MSRV và thay đổi checkpoint.
- [Burn: autodiff](https://burn.dev/books/burn/building-blocks/autodiff.html) — context, gradient retention và vòng đời backward.
- [Burn: module](https://burn.dev/books/burn/building-blocks/module.html) — hợp đồng shape và chế độ train/valid.
- [Burn: lưu/nạp mô hình](https://burn.dev/books/burn/saving-and-loading.html) — artifact và ánh xạ trọng số.
- [crates.io Burn 0.22.1](https://crates.io/api/v1/crates/burn/0.22.1) — metadata phiên bản/feature đã đọc trực tiếp.
- [Candle 0.11.1 API](https://docs.rs/candle-core/0.11.1/candle_core/) — tensor và CPU device.
- [Candle mã nguồn chính thức](https://github.com/huggingface/candle) — API và ví dụ.
- [crates.io Candle 0.11.1](https://crates.io/api/v1/crates/candle-core/0.11.1) — metadata phiên bản/feature đã đọc trực tiếp.
- [Candle 0.11.1 source archive](https://static.crates.io/crates/candle-core/candle-core-0.11.1.crate) — kiểm tra chữ ký serialization của đúng phiên bản.
- [Candle SafeTensors](https://docs.rs/candle-core/latest/candle_core/safetensors/index.html) — load buffer và save.
- [Hugging Face SafeTensors](https://huggingface.co/docs/safetensors/index) — phạm vi định dạng.
- [scikit-learn: common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html) — preprocessing và data leakage; nguyên tắc áp dụng độc lập ngôn ngữ.
- [scikit-learn: model evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html) — metric và phân loại.
- [scikit-learn: threshold](https://scikit-learn.org/stable/modules/classification_threshold.html) — tách score khỏi quyết định và chọn ngưỡng trên dữ liệu riêng.
- [Tokio spawn_blocking](https://docs.rs/tokio/latest/tokio/task/fn.spawn_blocking.html) — giới hạn CPU concurrency và tác vụ đã chạy không tự bị hủy khi timeout.

Các ví dụ, bộ dữ liệu, mã bài tập và lab là nội dung tự biên soạn; không sao chép bài hướng dẫn dài.

## Kiểm tra của agent biên soạn

Đã chạy trên Mac:

- TypeScript `strict/noEmit`: **PASS, 0 diagnostic**.
- `validateCatalog` với module/track độc lập: **PASS**.
- Sáu ID, liên kết bài/module/track, localLab paths: **PASS**.
- Mỗi bài 4 phần, 400–550 từ phần giảng: **PASS**.
- Có starter/solution/assertions/output/hints/quiz/reference cho cả sáu bài.

**Chưa chạy Rust/Cargo trong agent này** vì root điều phối biên dịch tập trung để tránh cạnh tranh cache/target. Cần đối chiếu báo cáo kiểm thử tổng hợp của root trước khi ghi nhận các solution/lab đã chạy thành công.

## Giới hạn phạm vi

- Đây là lộ trình xây pipeline học máy nhỏ đến serving có thể kiểm chứng. Không tuyên bố bao trùm toàn bộ AI.
- Không huấn luyện LLM lớn, không đánh giá GPU/CUDA/Metal, distributed training, lượng tử hóa kernel hoặc mức sử dụng VRAM.
- Batching bài web chỉ giới hạn phần padding đầu vào; không mô hình hóa toàn bộ memory/computation của attention hoặc KV cache.
- Dữ liệu tổng hợp không thay thế đánh giá đại diện miền sử dụng thật.
- API và dependency đã ghim để bài có thể tái lập; nâng phiên bản cần chạy lại fixture, numerical tests và benchmark.
