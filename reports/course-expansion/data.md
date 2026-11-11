# Mở rộng khóa Dữ liệu và engine phân tích

Ngày biên soạn: 11/11/2026.

## Cấu trúc và phạm vi
Giữ nguyên sáu bài cũ và đường dẫn của chúng. Khóa có sáu chương, mỗi chương ba bài: hợp đồng dữ liệu; phép biến đổi và schema; thời gian và tổng hợp; engine truy vấn; phân vùng và cập nhật; công bố và vận hành. Mười hai bài mới có 462–508 từ phần lý thuyết, năm mục mỗi bài, ví dụ lỗi, bài thực hành Rust độc lập, kiểm tra bằng assert, gợi ý và câu hỏi giải thích đáp án. Kiến thức cần thiết được viết trực tiếp trong bài; các nguồn dưới đây chỉ phục vụ biên tập.

Có hai mô phỏng tương tác, mỗi mô phỏng hai tình huống và bốn bước: đẩy phép chiếu trong kế hoạch truy vấn và công bố snapshot khi nhiều writer tranh chấp. Các con số trong mô phỏng là dữ liệu minh họa, không phải số đo benchmark.

## Ba dự án và bằng chứng đầu ra
1. **Cổng chất lượng CSV** (có hướng dẫn, 8 giờ): thư viện kiểm tra schema, chuẩn hóa, bản ghi bị loại, khử trùng lặp sau kiểm tra hợp lệ, số nguyên có kiểm tra tràn và CLI. Mã mẫu đầy đủ có sáu test; người học bổ sung tệp reject, ngưỡng chất lượng và báo cáo.
2. **Engine báo cáo DataFusion** (tự thực hiện, 14 giờ): DataFusion 55.2.0, bảng Arrow có null và nhiều partition, truy vấn tổng hợp, EXPLAIN, kiểm tra kết quả độc lập. Mã mẫu có tám test, bao gồm join cardinality và event-time/late-event thực thi bằng DataFusion. Người học bổ sung nguồn tệp, giới hạn tài nguyên và benchmark.
3. **Pipeline công bố dataset** (capstone, 24 giờ): Polars 0.55.2 thực hiện tổng hợp thật; gate chất lượng, SHA-256, tệp báo cáo bất biến, manifest phiên bản, khóa writer và so sánh revision. Năm test kiểm tra thành công, retry, writer cũ, lỗi chất lượng và quay lại nội dung A sau A → B → A. Người học thêm failpoint, kiểm thử recovery và đối chiếu engine.

Mỗi dự án có yêu cầu, mốc nghiệm thu, năm đến bảy tình huống lỗi hoặc vận hành, bốn mục rubric (bao gồm tiêu chí bắt buộc) và danh sách bằng chứng cần nộp. Ba dự án trỏ đến ba bài localLab khác nhau.

## Đánh giá
Bài đánh giá có 12 câu hỏi tình huống, hai câu cho mỗi chương; mỗi đáp án có lời giải và đường dẫn bài cần ôn. Ngưỡng 80% chỉ thể hiện mức hoàn thành phần câu hỏi. Sáu năng lực quan sát được gắn với các bài và dự án; phải cung cấp test, báo cáo dữ liệu và giải thích quyết định mới hoàn thành tự đánh giá. Đây không phải chứng nhận bảo đảm năng lực tuyển dụng.

## Kiểm chứng
Đã biên dịch và chạy cả 12 lời giải bằng rustc --edition=2024 trên Mac. 12/12 assertion và stdout khớp. Các tệp kiểm tra nằm trong work/expansion-data. Root đã re-extract bản mới và chạy Cargo PASS toàn bộ 5 lab của khóa (2 cũ, 3 mới), ghi trong mobile-data-regression.json. Engine có 8 test và release có 5 test gồm các regression mới; đây là kết quả chạy host do root cung cấp.

## Giới hạn cần kiểm tra trong dự án thực tế
Phần công bố hỗ trợ writer hợp tác trên một filesystem cục bộ macOS/Linux. Nó không phải transaction coordinator phân tán, không triển khai Iceberg và không chứng minh tính bền vững khi mất điện ở mọi filesystem. Khóa tồn tại sau crash cần quy trình xác minh tiến trình trước khi xử lý. Các lab dùng dữ liệu nhỏ; khả năng vận hành với dataset lớn cần đo peak memory, spill, phân vùng lệch, I/O và recovery trong môi trường đích. Các mục này đã thành yêu cầu mở rộng và rubric thay vì tuyên bố đã được chứng minh.

## Nguồn chính thức đã đối chiếu
- Apache Arrow Columnar Format: https://arrow.apache.org/docs/format/Columnar.html — kiểu, validity bitmap và layout cột.
- Polars lazy optimizations: https://docs.pola.rs/user-guide/lazy/optimizations/ — predicate/projection pushdown và tối ưu kế hoạch.
- Polars expressions: https://docs.pola.rs/user-guide/expressions/ — biểu thức theo cột và xử lý null.
- DataFusion EXPLAIN: https://datafusion.apache.org/user-guide/sql/explain.html — EXPLAIN và EXPLAIN ANALYZE.
- DataFusion configuration: https://datafusion.apache.org/user-guide/configs.html — partition, bộ nhớ và lựa chọn thực thi.
- csv crate 1.4.0: https://docs.rs/csv/latest/csv/ — parser CSV và Reader.
- Apache Iceberg reliability: https://iceberg.apache.org/docs/latest/reliability/ — nguồn tham khảo kiến trúc snapshot bất biến và commit metadata; lab không nhận là triển khai Iceberg.

## Ma trận năng lực và bằng chứng
| Năng lực | Bài học | Bằng chứng dự án |
| --- | --- | --- |
| Hợp đồng và chất lượng | data-ingestion, data-quality-project | Parser có giới hạn, reject, valid-first dedup trong data-project-quality |
| Schema và biểu thức | data-expressions, data-schema-evolution | Fixture null/schema, test cổng chất lượng và golden vector |
| Ngữ nghĩa thời gian, join, tổng hợp | data-joins, data-event-time, data-window-aggregates | Negative fixtures join trùng/thiếu dimension; cửa sổ 999/1000, late-event/watermark và BTreeMap tham chiếu của data-project-engine |
| Kế hoạch truy vấn | data-query-plans, data-query-project | EXPLAIN và benchmark có điều kiện; kết quả Arrow đối chiếu độc lập |
| Phân vùng và cập nhật | data-partition-design, data-incremental | Test skew/CDC/tombstone mở rộng trong data-project-release |
| Công bố và recovery | data-reproducibility, data-release-project | Manifest CAS, retry, writer conflict, failpoint và runbook |

GPU, browser runtime và hệ thống lưu trữ phân tán không nằm trong các ca chạy của lab. Các bằng chứng host nhỏ không thay thế kiểm thử workload, hệ điều hành và filesystem đích.

## Sửa sau rà soát chéo: nội dung và revision công bố

Phát hiện ca A(expected 0) → B(expected 1) → A(expected 2) bị immutable_release_conflict vì metadata bất biến chứa revision commit. Đã tách ReleaseMetadata không có revision ra metadata.json trong release; root manifest.json giữ revision. Ca quay lại nội dung cũ tạo commit mới nhưng giữ nguyên byte metadata/report. Thêm regression test xác nhận revision 1/2/3, chỉ hai release, report đúng, stale expected bị từ chối và retry giữ revision 3. Root đã chạy lại Cargo: 5/5 test publication PASS, gồm regression A → B → A.

## Sửa sau rà soát chéo: join và thời gian

DataFusion lab bổ sung register_dimension/joined_report và event-time replay. Bốn test mới thực thi SQL: join trùng khóa làm SUM tăng sai (raw negative fixture) rồi API từ chối; missing dimension không mất fact im lặng; cửa sổ có biên 999/1000 và sự kiện đến muộn đối chiếu BTreeMap; hợp đồng thời gian/lateness âm bị từ chối. Milestone, test cases và rubric critical của data-project-engine yêu cầu các bằng chứng này. Đây là fixture finite replay, không tuyên bố stream checkpoint hoặc exactly-once. Root đã chạy lại Cargo: 8/8 test engine PASS.
