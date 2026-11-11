# Bảo mật và phân tích nhị phân — khóa chuyên sâu

Giữ sáu bài cũ, thêm 12 bài mới (401–419 từ lý thuyết/bài), chia sáu chương/18 bài. Có ba Cargo project độc lập, 12 bài tập browser std-only/assert/stdout, 12 câu đánh giá tình huống, sáu kỹ năng và hai mô phỏng hai nhánh/bốn bước. Câu trả lời đúng đã được phân bố cân bằng và xáo thứ tự, không dùng chu kỳ 0/1/2 xuyên bài.

## Ma trận đầu ra → bài học → bằng chứng

| Đầu ra | Bài học | Bằng chứng dự án |
| --- | --- | --- |
| Scope và ngân sách | security-threat-model, security-budgeted-cursor | Inventory chỉ artifact sở hữu; byte/section/symbol/name budget |
| Metadata đúng ngữ nghĩa | security-format-semantics, security-inventory-project | object writer fixture ELF, raw/virtual range, format/kind/architecture tests |
| Bounds và độ phức tạp | security-archive-paths, security-integer-invariants | Checked range/count/stride; policy đường dẫn không bị gọi nhầm là containment |
| Parser và fuzz oracle | security-corpus-design, security-parser-project | TLV v1, every-prefix, duplicate/tag/range, mutation, roundtrip, corpus generator |
| Unsafe/triage | security-unsafe-review, security-crash-minimization | Safe slice decoder, invariant review, predicate thu nhỏ cùng lỗi và regression |
| Build và policy | security-dependency-review, security-audit-project | SHA-256 manifest, raw symbol identity, baseline/candidate diff, schema/policy tests |

Guided project: security_inventory (object 0.40.0 read/write, compression feature không bật). Independent: security_tlv với parser tự viết, deterministic mutations và fuzz target tách workspace. Capstone: security_artifact_audit dùng object/SHA-256/JSON so baseline và candidate. Mỗi dự án có bốn rubric (hai critical), ba mốc, bốn ca nghiệm thu và bốn deliverable.

## Điểm kiến thức và phạm vi quan trọng

object 0.40.0 README chính thức nêu trusted-input scope và giới hạn DoS/loader semantics. Các lab vì vậy chỉ đọc artifact do dự án tạo/sở hữu, không thực thi binary, không nhận upload tùy ý và không gắn nhãn malware/safe. Size/entry budgets là giới hạn của công cụ mẫu, không thay worker isolation. Phiên bản 0.40.0 giữ cùng phiên bản đã có; không nâng sang bản mới vừa phát hành khi chưa cần.

Bổ sung RVA/VA/file offset, zero-fill, raw name identity và terminal escaping, archive traversal so với symlink/race containment, checked multiplication, work/depth/output budget, corpus/oracle/minimization, soundness so với test/Miri, dependency/build script/proc macro, advisory scope, baseline provenance và metadata policy không đồng nghĩa ABI/behavior compatibility. Nội dung và README chứa đầy đủ hợp đồng/lệnh/test, không bắt người học mở liên kết ngoài để hoàn thành bài.

## Nguồn chính thức đã đối chiếu

- https://docs.rs/crate/object/0.40.0 — API read/write, trusted inputs, DoS và loader limits; đối chiếu thêm source crate 0.40.0 đã cài cho signature Object::new/add_section/add_symbol/write, name_bytes/file_range/is_definition/is_global.
- https://learn.microsoft.com/en-gb/windows/win32/debug/pe-format — RVA/VA/file offset, virtual/raw size và zero-fill.
- https://rust-fuzz.github.io/book/cargo-fuzz/tutorial.html — byte harness và fuzz target.
- https://rust-fuzz.github.io/book/cargo-fuzz/structure-aware-fuzzing.html — corpus có cấu trúc và oracle sâu.
- https://rust-fuzz.github.io/book/cargo-fuzz/guide.html — workflow và minimization.
- https://github.com/rust-lang/miri/blob/master/README.md — UB detection và giới hạn không chứng minh soundness toàn bộ.
- https://github.com/rustsec/rustsec/blob/main/cargo-audit/README.md — advisory audit và lưu ý Cargo trên repository không tin cậy.
- https://rustsec.org/ — phạm vi advisory database.
- https://doc.rust-lang.org/std/primitive.slice.html — bounds checked slice.
- https://doc.rust-lang.org/std/primitive.u64.html — checked arithmetic.

## Kiểm chứng

2026-11-11: 12/12 solutionCode đạt rustc 1.99.1 edition 2024, assertion và stdout đúng. Bộ kiểm tra chapter partition đủ 18 ID; strict TypeScript/noEmit đạt cho cả năm field của lane này. Kết quả work/expansion-security/validation.json. Root kiểm tra Cargo tập trung; báo cáo không ghi PASS Cargo trước khi có xác nhận.

Fuzz target/corpus/lệnh có ngân sách đã được cung cấp; agent không cài cargo-fuzz/nightly hoặc khẳng định đã chạy fuzz. Deterministic mutation/unit tests không được gọi là fuzz đầy đủ. Không chạy binary input, không tải/kiểm thử mẫu malware, không tác động hạ tầng ngoài.

## Giới hạn và chuẩn đầu ra

Inventory/audit chưa là dịch vụ xử lý file thù địch, chưa là loader emulator và chưa chứng minh ABI đầy đủ. Policy chỉ so format/architecture/tập symbol yêu cầu; tên symbol giống nhau vẫn có thể đổi type/semantics. Hash xác định byte, không tự xác thực nhà phát hành. Đường dẫn helper chỉ validate tên, chưa thực hiện extraction an toàn theo handle/OS. Parser TLV chỉ hỗ trợ đặc tả LearnRecord v1, không phải ELF/PE parser tự viết.

Chuẩn đầu ra yêu cầu source fixture, report, lỗi tái hiện, regression và giới hạn kết luận. Đây là tự nghiệm thu năng lực, không chứng nhận binary an toàn hoặc đủ cho mọi vai trò phân tích bảo mật.

## Kết quả kiểm thử tập trung đã xác nhận

2026-11-11: Root xác nhận toàn bộ 5 Cargo localLab (gốc và mở rộng) PASS. Corpus gồm fixture tự tạo; chưa chạy phiên fuzz, Miri hoặc phân tích mẫu từ nguồn ngoài.

Rà đáp án 2026-11-11: 12 quiz mới và 12 câu đánh giá mỗi nhóm đều có bốn đáp án đúng ở mỗi vị trí 0/1/2; thứ tự đã xáo, không lặp vòng 0-1-2. Đổi options cùng correct, giữ nguyên ý trả lời và giải thích. Strict TypeScript của cả năm expansion tiếp tục PASS sau lượt rà.
