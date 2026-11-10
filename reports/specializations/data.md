# Hướng Dữ liệu và engine phân tích

Ngày nghiên cứu và rà soát: 2026-11-10 (UTC).

## Phạm vi triển khai

Đã tạo `src/data/specializations/data.ts`, export `dataBundle`, track `data`, module `track-data`. Nội dung hướng tới xây pipeline phân tích có thể kiểm thử và vận hành, sau khi người học đã nắm Rust cơ bản, SQL và async.

| Thứ tự | Bài | Số từ phần lý thuyết | Bài tập chạy trên web |
| --- | --- | ---: | --- |
| 1 | data-columnar | 501 | Tổng cột nullable, validity mask, kiểm tra độ dài và tràn |
| 2 | data-polars | 494 | Aggregate có lọc, thứ tự ổn định, làm oracle cho Polars |
| 3 | data-joins | 498 | Left hash join giữ mọi khóa trùng và xử lý null đúng hợp đồng |
| 4 | data-datafusion | 491 | Gộp sum/count/rows qua partition và kiểm tra tràn |
| 5 | data-streaming | 510 | Chia batch theo byte, giữ thứ tự và tránh tràn usize |
| 6 | data-production | 509 | Manifest idempotent, phát hiện xung đột và không đổi trạng thái khi lỗi |

Mỗi bài có bốn phần giải thích, mục tiêu, ví dụ, bài tập có yêu cầu rõ, starter, solution, assertion cho trường hợp biên, stdout xác định, gợi ý, quiz có giải thích và nguồn chính thức. Bài tập không giả vờ chạy query engine trong browser: chúng kiểm tra lõi ngữ nghĩa và thuật toán; Cargo lab dùng thư viện thực.

Capstone “Pipeline phân tích đơn hàng có phiên bản” có năm mốc: hợp đồng dữ liệu, biến đổi Polars, truy vấn DataFusion, tài nguyên/hiệu năng và công bố/phục hồi. Mỗi mốc có công việc và điều kiện nghiệm thu. Có năm nhóm sản phẩm bàn giao, bảy câu hỏi review. Hoàn thành bài đọc không được mô tả như bảo đảm năng lực tuyển dụng; sản phẩm, test và giải thích tradeoff mới là bằng chứng thực hành.

## Cargo labs

### Polars report

- Dependency ghim `polars = "=0.55.2"`, `default-features = false`, chỉ bật `lazy`.
- Bốn tệp: Cargo.toml, src/lib.rs, src/main.rs, tests/report.rs.
- Chạy expressions thật: filter, group_by, sum, alias, sort_by_exprs, collect.
- Bốn test: null và thứ tự, ngưỡng lọc, input rỗng có schema và cột bị thiếu.
- CLI in `bac: 200`, sau đó `nam: 40`.
- Dữ liệu nhỏ đã nằm trong bộ nhớ; lab này **không** được dùng làm bằng chứng projection/predicate pushdown giảm I/O. Bài mở rộng yêu cầu scan Parquet và đo bytes đọc.

### DataFusion report

- Dependency ghim `datafusion = "=55.2.0"`, tắt default features, bật `sql`; `tokio = "=1.54.1"` với macros và rt-multi-thread.
- DataFusion 55.2.0 khai báo MSRV 1.94.0; Cargo project đặt rust-version 1.94, edition 2024.
- Dùng Arrow qua `datafusion::arrow` để tránh ghép kiểu từ hai hệ dependency Arrow khác nhau.
- Bốn tệp: Cargo.toml, src/lib.rs, src/main.rs, tests/query.rs.
- MemTable có schema cố định và partition tường minh. SQL thật dùng SUM, COUNT, GROUP BY, ORDER BY.
- Năm test: một/hai partition cho cùng kết quả, nhóm toàn null, bảng rỗng, EXPLAIN và cột sai, độ dài mảng không khớp.
- Input và SQL đều do lab định nghĩa. Cấu hình feature tối thiểu này không phải cấu hình sẵn sàng nhận SQL tùy ý của người dùng.
- Hai lab tắt debug info ở profile.dev/profile.test để giảm footprint build. Build lần đầu vẫn có nhiều dependency, không nên coi timeout ngắn là lỗi nội dung. Lưu Cargo.lock sau lần giải dependency để khóa cả transitive dependencies.

## Quyết định kiến thức

- Phân biệt null, NaN và 0; tách số hàng khỏi số giá trị hợp lệ.
- Hàm nullable_sum có hợp đồng riêng Some(0)/None; văn bản yêu cầu kiểm tra hành vi aggregate của engine thay vì mặc định mọi engine giống nhau.
- Layout cột phục vụ phép quét phân tích; không khẳng định luôn nhanh hơn layout hàng.
- Lazy trên DataFrame đã đọc không hoàn tác I/O. Scan mới đưa nguồn tệp vào kế hoạch để có cơ hội pushdown.
- Không cam kết group-by/join có thứ tự ổn định. Các ví dụ cần kết quả xác định đều sort/ORDER BY.
- HashMap khóa → một dòng không tương đương join nhiều-nhiều. Bài tập dùng khóa → Vec<chỉ số>.
- Phân biệt điều kiện ON và WHERE sau left join; mô tả SQL equality null và tùy chọn riêng của Polars.
- AVG qua partition dùng sum/count, không lấy trung bình các trung bình không có trọng số.
- Arrow RecordBatch, partition thực thi và partition trên đĩa là ba khái niệm khác nhau.
- collect giữ toàn bộ đầu ra; stream không loại bỏ trạng thái sort/join/group-by. Memory pool không đồng nghĩa giới hạn mọi bộ nhớ của tiến trình.
- Giới hạn batch theo byte, row quá lớn có chính sách riêng, không cộng usize dễ tràn.
- Benchmark yêu cầu build release, dữ liệu/phiên bản/cache/cấu hình được ghi lại, nhiều lần đo và kiểm tra kết quả trước.
- Manifest trong browser chỉ là mô hình trong bộ nhớ. Không gọi đó là transaction bền vững, exactly-once hoặc commit xuyên tiến trình.
- Công bố dữ liệu thật yêu cầu atomic primitive/conditional write phù hợp backend, kiểm tra cạnh tranh, lịch sử và kiểm thử crash. Không giả định rename trên object storage giống filesystem.

## Nguồn chính thức đã đối chiếu

Các URL dưới đây phục vụ kiểm chứng và đọc tiếp. Không sao chép văn bản dài hoặc hình ảnh từ tài liệu.

1. [Apache Arrow columnar format](https://arrow.apache.org/docs/format/Columnar.html) — buffer, validity bitmap, kiểu dữ liệu và layout.
2. [Polars data types and structures](https://docs.pola.rs/user-guide/concepts/data-types-and-structures/) — schema, Series, DataFrame.
3. [Polars missing data](https://docs.pola.rs/user-guide/expressions/missing-data/) — null khác NaN, metadata giá trị thiếu.
4. [Polars Rust API 0.55.2](https://docs.rs/polars/0.55.2/polars/) — API eager/lazy và feature flags.
5. [Polars LazyFrame 0.55.2](https://docs.rs/polars/0.55.2/polars/prelude/struct.LazyFrame.html) — group_by, sort_by_exprs, collect, explain.
6. [Polars lazy optimizations](https://docs.pola.rs/user-guide/lazy/optimizations/) — projection/predicate pushdown và các điều kiện tối ưu.
7. [Polars joins](https://docs.pola.rs/user-guide/transformations/joins/) — loại join và cardinality.
8. [Polars Parquet](https://docs.pola.rs/user-guide/io/parquet/) — read/scan và định dạng cột.
9. [DataFusion Rust API 55.2.0](https://docs.rs/datafusion/55.2.0/datafusion/) — SessionContext, plan và thực thi.
10. [DataFusion MemTable 55.2.0](https://docs.rs/datafusion/55.2.0/datafusion/datasource/struct.MemTable.html) — schema, partition và cách biểu diễn bảng rỗng.
11. [DataFusion DataFrame 55.2.0](https://docs.rs/datafusion/55.2.0/datafusion/dataframe/struct.DataFrame.html) — collect, execute_stream, schema và explain.
12. [DataFusion reading explain plans](https://datafusion.apache.org/user-guide/explain-usage.html) — cách đọc plan.
13. [DataFusion configuration](https://datafusion.apache.org/user-guide/configs.html) — memory, partition và spill. Trang main có thể đi trước bản phát hành; bài chỉ dùng khái niệm ổn định, không chép tên setting mới vào lab 55.2.0.
14. [Securing DataFusion](https://datafusion.apache.org/library-user-guide/securing-datafusion.html) — trách nhiệm ứng dụng, quyền truy vấn, truy cập file và giới hạn tài nguyên.
15. [DataFusion profiling cookbook](https://datafusion.apache.org/library-user-guide/profiling.html) — CPU profiling và flamegraph.
16. [Rust f64](https://doc.rust-lang.org/std/primitive.f64.html) — miền số thực, NaN và tính chất biểu diễn.
17. [Criterion benchmarking with inputs](https://bheisler.github.io/criterion.rs/book/user_guide/benchmarking_with_inputs.html) — benchmark theo kích thước đầu vào và throughput.
18. [Cargo.toml và Cargo.lock](https://doc.rust-lang.org/cargo/guide/cargo-toml-vs-cargo-lock.html) — khóa dependency để tái hiện.
19. [Apache Iceberg reliability](https://iceberg.apache.org/docs/latest/reliability/) — nền tảng thiết kế snapshot, commit nguyên tử, retry và rollback; không cài đặt Iceberg trong lab.
20. Registry chính thức: [Polars API](https://crates.io/api/v1/crates/polars), [DataFusion API](https://crates.io/api/v1/crates/datafusion), [Tokio API](https://crates.io/api/v1/crates/tokio). Truy vấn trực tiếp ngày rà soát xác nhận newest_version tương ứng 0.55.2, 55.2.0 và 1.54.1; DataFusion rust_version=1.94.0. Không nhầm phiên bản Python Polars 2.x với crate Rust Polars 0.55.x.

## Kiểm tra ở lượt tác giả

- TypeScript strict/noEmit, target ES2022, moduleResolution Bundler: **0 lỗi**.
- validateCatalog trên module chuyên sâu độc lập: **PASS**.
- Sáu lesson IDs khớp track và module; localLab paths hợp lệ.
- Tất cả bài nằm trong khoảng 491–510 từ ở phần lý thuyết, không tính code hoặc bài tập.
- Rust/Cargo do root chạy tập trung: **chưa chạy trong lượt tác giả**; không tuyên bố test Cargo, benchmark, Parquet I/O hoặc spill đã qua.
- Root có thể tích hợp bằng import `dataBundle` vào index hiện tại.
- Không sửa index, cấu hình ứng dụng, git hay file ngoài hai file được giao.

SHA-256 data.ts tại thời điểm bàn giao:
`bf640e10dbdd9fb0566f1f97d5b147a6d2cfa38783e5d698b1ec77370bee5564`.
