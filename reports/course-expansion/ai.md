# Mở rộng khóa AI và Machine Learning

Ngày biên soạn: 11/11/2026.

## Cấu trúc
Khóa giữ nguyên sáu bài cũ và thêm 12 bài mới, chia thành sáu chương, mỗi chương ba bài. Mỗi bài mới có năm mục lý thuyết (441–520 từ), tình huống sai, bài Rust std-only, assertion, stdout xác định và câu hỏi có giải thích. Nội dung dạy trực tiếp đại số, shape, số học ổn định, rò rỉ, hợp đồng đặc trưng, SGD, checkpoint, artifact, batching, truy hồi, metric và vận hành. Người học không cần rời hệ thống để đọc phần kiến thức cốt lõi.

Ba dự án có ba localLab độc lập: feature-gate dùng Rust/Serde; burn-regression dùng Burn 0.22.1 Flex CPU và autodiff; model-service dùng Candle 0.11.1 CPU, SafeTensors, SHA-256 và scheduler. Mỗi dự án có ba mốc, năm đến sáu ca kiểm thử, bốn mục rubric và đầu ra phải nộp. Mã mẫu đầy đủ chạy được; các phần mở rộng được ghi rõ là nhiệm vụ của người học.

Hai mô phỏng có hai kịch bản và bốn bước mỗi kịch bản: gradient hợp lệ/NaN; phục vụ đúng version/reload khi job đang chờ. Bộ đánh giá có 12 câu, hai câu mỗi chương, giải thích và bài cần ôn.

## Ma trận năng lực và bằng chứng
| Năng lực đầu ra | Bài học | Bằng chứng dự án |
| --- | --- | --- |
| Đọc shape, gradient và số học ổn định | ai-linear-algebra, ai-numerics | Test công thức tay, sai phân và gradient của ai-project-training; shape/số hữu hạn của ai-project-serving, softmax ở bài numerics |
| Giữ hợp đồng train/serve, chống rò rỉ | ai-feature-contract, ai-data-project | Golden fixture, split không giao, artifact roundtrip của ai-project-features |
| Huấn luyện có đánh giá và checkpoint | ai-optimization, ai-training-project | Minibatch có trọng số mẫu, resume SGD, validation và baseline của ai-project-training |
| Nạp artifact và giới hạn request | ai-artifacts, ai-batching | Digest, shape, queue capacity, deadline và version trong ai-project-serving |
| Đánh giá theo mục tiêu, truy hồi có tham chiếu | ai-retrieval, ai-error-analysis | Báo cáo confusion matrix, exact search và lỗi theo nhóm bổ sung trong ai-project-serving |
| Vận hành và bàn giao có phạm vi | ai-observability, ai-deployment-project | HTTP, microbatch parity, benchmark, model card và runbook rollback của ai-project-serving |

## Kiểm chứng
Đã biên dịch và chạy 12/12 lời giải std-only bằng rustc --edition=2024 trên Mac; assertion và stdout đều khớp. Tệp kiểm tra nằm trong work/expansion-ai. Cargo được chuyển cho root chạy tập trung: feature-gate có sáu test; burn-regression có năm test; model-service có tám test. Báo cáo này không giả định Cargo đã thành công trước khi root có kết quả.

## Phạm vi sẵn sàng và khoảng trống
Dự án chứng minh nền tảng mô hình nhỏ và core phục vụ CPU. Tự đánh giá yêu cầu bằng chứng cả ba dự án; đạt điểm câu hỏi không phải chứng nhận tuyển dụng hoặc khả năng triển khai mọi loại AI. GPU, Metal/CUDA, browser WebGPU, distributed training, LLM/tokenizer thực, mạng HTTP mở rộng và tải production chưa được kiểm thử trong mã mẫu. Từng bước thiết lập, kiểm tra parity, giới hạn token và đo thiết bị được giải thích trong bài hoặc tiêu chí dự án; không chuyển phần dạy chính thành yêu cầu đọc tài liệu ngoài. Dataset tổng hợp không chứng minh chất lượng trên dữ liệu thực.

## Nguồn chính thức đối chiếu
- Burn 0.22 migration: https://burn.dev/books/burn/migrating-to-0.22.html — Device, Tensor theo chiều, autodiff và chế độ train/valid.
- Burn Device: https://burn.dev/docs/burn/tensor/struct.Device.html — lựa chọn backend rõ ràng, không giả định CPU fallback.
- Burn custom loop: https://burn.dev/books/burn/custom-training-loop.html — vòng huấn luyện và validation.
- Burn dataset: https://burn.dev/books/burn/building-blocks/dataset.html — pipeline dữ liệu.
- Burn record: https://burn.dev/books/burn/building-blocks/record.html — lưu trạng thái và kiểm tra tensor.
- Candle 0.11.1: https://docs.rs/candle-core/latest/candle_core/ — Tensor, Device CPU và matmul.
- Candle SafeTensors: https://docs.rs/candle-core/latest/candle_core/safetensors/index.html — load buffer/save và định dạng artifact.
- Candle repository: https://github.com/huggingface/candle — API tensor và phạm vi inference.
- Google ML pipelines: https://developers.google.com/machine-learning/managing-ml-projects/pipelines — phân tách train/validation và so mô hình trước phát hành.

## Sửa sau rà soát chéo: ma trận năng lực

Năng lực ai-skill-1 (tensor, số học, gradient/softmax) đã chuyển projectIds từ feature gate sang ai-project-training và ai-project-serving. Bằng chứng gradient thuộc dự án Burn, kiểm shape/số hữu hạn thuộc dự án Candle; softmax có bài numerics/assertion riêng. Bổ sung liên kết bài training/deployment để người học đi thẳng tới bằng chứng phù hợp. Không thay mã Cargo lab.
