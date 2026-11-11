# Mở rộng Compiler và công cụ phát triển

Giữ nguyên 6 bài cũ, thêm 12 bài (424–459 từ phần lý thuyết), tổng 18 bài/6 chương. Có 3 dự án source đầy đủ: Rulecheck, Policy-VM, Rule-LSP; 12 câu hỏi tình huống, 6 kỹ năng, rubric 4–5 mục/dự án và 2 mô phỏng hai nhánh.

## Ma trận năng lực → bài học → bằng chứng
| Năng lực | Bài học | Bằng chứng dự án |
| --- | --- | --- |
| Đặc tả/token/source map | language-spec, lexer-spans, source-map | Rulecheck: lexer char_indices/span; Rule-LSP: UTF-16 conversion |
| Frontend/parser | parser-precedence, error-recovery, expression-project | Rulecheck: Pratt AST, precedence/associativity, depth budgets, CLI |
| Tên/hệ kiểu | name-resolution, type-diagnostics, type-inference | Name checking baseline; Bool/conditional/type inference là phần mở rộng capstone có test cần nghiệm thu |
| CFG/dataflow | ir-execution, control-flow, dataflow | Policy-VM: branches, worklist typed stack và merge validation; must analysis trong bài web |
| Artifact/runtime/optimization | bytecode-format, optimizer-correctness, vm-project | PLCY encoder/decoder, golden/truncation tests, verifier/fuel; lowering/optimizer cần differential evidence |
| Tooling/độ tin cậy | incremental-tools, testing-fuzzing, tooling-project | Rule-LSP stdio/full sync/version; protocol process tests; editor thật/fuzz/invalidation là tiêu chí nghiệm thu |

## Kiểm chứng thực hiện
12/12 lời giải std Rust mới đã được rustc --edition 2024 rồi chạy assertion và so stdout trên Mac. Kết quả work/expansion-compiler/validation.json. npx tsc --noEmit toàn repo đạt tại thời điểm bàn giao. Root đang chạy Cargo tập trung; chưa tự nhận kết quả Cargo khi viết báo cáo này.

Rulecheck có lexer, Pratt parser, AST depth budget ngoài parser nesting, name checking và evaluator checked i64. Policy-VM có compiler hai lượt labels, encoding PLCY v1, decoder phòng thủ, typed-stack verifier worklist và runtime fuel. Rule-LSP dùng Content-Length/JSON-RPC thật, full-sync document, UTF-16 range và version; không đánh giá với input giả để sinh diagnostic compile-time.

## Phần cần triển khai và kiểm chứng ở môi trường thực
- Ba project là DSL và tooling có phạm vi rõ, không phải compiler Rust đầy đủ.
- Rule-LSP baseline hỗ trợ syntax/name diagnostics và full sync. Completion/rename, incremental edits, async analysis, cache invalidation, nhiều lỗi recovery, Bool/conditional/type checking và editor client thật là yêu cầu mở rộng có bằng chứng riêng.
- Policy-VM instruction set không cấp filesystem/network; không quảng cáo là sandbox chạy mọi mã máy. Verifier không chứng minh termination; fuel không thay thế verifier.
- Fuzzing dài hạn, corpus đa dạng, latency editor, LSP client compatibility và portability cần môi trường/campaign thật. Các bài lý thuyết và test nhỏ không tự chứng minh năng lực sản phẩm.
- Nghiệm thu dựa source, negative cases, oracle, demo và review; điểm quiz chỉ là tự rà soát.

## Nguồn chính thức đã đối chiếu
- https://rustc-dev-guide.rust-lang.org/overview.html — các giai đoạn compiler và IR.
- https://rustc-dev-guide.rust-lang.org/the-parser.html — lexer/parser/AST/span và NodeId.
- https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/LangImpl02.html — parsing precedence và AST.
- https://rustc-dev-guide.rust-lang.org/type-inference.html — inference variables, equality constraints, nguồn gốc constraint.
- https://rustc-dev-guide.rust-lang.org/mir/dataflow.html — domain, transfer, join và fixpoint.
- https://rustc-dev-guide.rust-lang.org/mir/index.html — MIR/basic blocks.
- https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/ — framing, lifecycle, document sync và positions.
- https://webassembly.github.io/spec/core/valid/index.html — phân biệt validation cấu trúc/type với execution.
- https://llvm.org/docs/LangRef.html — semantics IR và precondition của phép biến đổi.
- https://rust-fuzz.github.io/book/cargo-fuzz.html — fuzzing Rust và corpus.
Nguồn là bibliography biên tập; lý thuyết và hướng dẫn đều ở trong hệ thống.

## Phân bố đáp án
12 quiz bài mới và 12 câu hỏi đánh giá mỗi nhóm có đúng 4 đáp án ở vị trí 0, 4 ở vị trí 1, 4 ở vị trí 2. Options được hoán đổi cùng correct; giải thích và nội dung đúng không thay.
