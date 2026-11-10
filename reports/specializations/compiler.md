# Hướng chuyên sâu Compiler và công cụ phát triển

Ngày rà soát nguồn: 2026-11-10.

## Nội dung đã bàn giao

- Tệp dữ liệu: `src/data/specializations/compiler.ts`.
- Export: `compilerBundle`; track: `compiler`; module: `track-compiler`.
- Sáu bài hoàn chỉnh, 25 phần giảng, sáu bài tập web dùng thư viện chuẩn, sáu câu hỏi có giải thích.
- Hai lab Cargo độc lập, tổng cộng tám tệp dự án và chín integration test.
- Capstone năm mốc với tiêu chí nghiệm thu, sản phẩm cần nộp và bảy câu hỏi đánh giá.
- Không sửa index, không commit Git, không thêm dependency cho ứng dụng.

| Bài | Phần giảng | Số từ | Thực hành web | Lab |
| --- | ---: | ---: | --- | --- |
| compiler-lexer-spans | 4 | 425 | Quét tên và giữ khoảng byte UTF-8 | mini-lex: lexer, span, overflow |
| compiler-parser-precedence | 4 | 422 | Pratt parser, ngoặc, ưu tiên, kết hợp trái | mini-expr: lexer, parser, AST, interpreter, CLI |
| compiler-name-resolution | 4 | 423 | Ngăn xếp scope, Entry, shadowing, lỗi không ghi đè | — |
| compiler-type-diagnostics | 4 | 430 | Int/Bool/If/Add, phục hồi lỗi, loại lỗi dây chuyền | — |
| compiler-ir-execution | 4 | 430 | Stack VM, số học checked, ngân sách, invariant | — |
| compiler-incremental-tools | 5 | 521 | Byte sang UTF-16, emoji, CRLF, CR, EOF | — |

Số từ được đếm bằng khoảng trắng trong `sections[].text`, không tính mã nguồn hoặc phần bài tập. Tổng: 2.651 từ theo cách đếm này. Mỗi bài nằm trong khoảng 400–550 từ và có 3–5 phần giảng.

## Chuỗi kiến thức

Người học bắt đầu từ một ngôn ngữ biểu thức nhỏ để nhìn thấy dữ liệu đi qua từng bước. Lexer giữ token và span; parser quyết định cấu trúc; resolver nối lần dùng với khai báo; type checker xác nhận quy tắc kiểu; lowering và VM giữ ngữ nghĩa; công cụ editor quản lý snapshot, cache và vị trí.

Các ví dụ không đánh đồng MiniLang với Rust. Những ranh giới được giải thích ngay trong phần giảng:

- Bộ quét tên dùng is_alphabetic/is_alphanumeric của bài tập không phải toàn bộ quy tắc identifier Rust.
- MiniLang cấm khai báo trùng trong cùng block; Rust cho phép let shadow ngay trong một block.
- Type checker Int/Bool chưa có generic, trait solving, subtyping hoặc lifetime.
- IR stack của bài không phải MIR. MIR được giới thiệu để đọc kiến trúc compiler.
- AST, HIR, THIR, MIR và query của rustc được đối chiếu ở mức kiến trúc; không hứa đã xây lại rustc.
- Bài thực hành vị trí dùng UTF-16 tương thích LSP 3.17. Nội dung nói rõ khả năng thương lượng encoding, không gọi 3.17 là phiên bản mới nhất.
- Hai lab hiện thực lexer và parser/interpreter biểu thức. Khai báo, kiểu, IR và adapter LSP hoàn chỉnh là phần mở rộng có tiêu chí đo được trong capstone.

## Thiết kế bài tập và kiểm tra biên

### Lexer

Span dạng start..end, lấy từ char_indices và len_utf8. Bài web có tên tiếng Việt, emoji làm dấu phân cách, nguồn rỗng và lát cắt giữa một ký tự UTF-8. Lab từ chối ký tự ngoài ngữ pháp bằng span bao trọn ký tự; literal dùng checked_mul/checked_add. Có test i64::MAX và lớn hơn giới hạn một đơn vị.

### Parser

Pratt binding power (1, 2) cho cộng/trừ, (3, 4) cho nhân. Wrapper kiểm tra token dư. Bài web kiểm tra ưu tiên, ngoặc, kết hợp trái, nguồn rỗng, thiếu toán hạng, thiếu ngoặc và token thừa. Lab kiểm tra cả hình dạng AST, giới hạn nguồn 8.192 byte, 256 token và độ sâu parser 64; evaluator dùng số học checked. Hai loại overflow tại lexer và runtime có test riêng.

### Resolver

Lookup từ scope trong ra ngoài. Entry giữ nguyên binding trước khi khai báo trùng bị từ chối. Initializer dùng môi trường trước khi chèn binding mới. Có test thoát block, tên thiếu, scope rỗng và kết quả sau lỗi.

### Kiểu và diagnostic

Ty::Error hỗ trợ phục hồi sau lỗi đã ghi nhận; không được xem là kiểu hợp lệ. Hàm vẫn thăm toán hạng và nhánh độc lập. Các test xác nhận hai nguyên nhân chỉ tạo hai E_ADD, nhánh sau vẫn được kiểm tra, điều kiện if sai và hai nhánh khác kiểu.

### IR và VM

Kiểm tra thứ tự pop cho phép trừ, overflow cộng/nhân, underflow, stack cuối rỗng/dư và ngân sách bằng không hoặc thiếu một bước. Capstone yêu cầu so sánh interpreter AST với VM trên ít nhất 100 biểu thức có seed cố định.

### Editor

Bài web kiểm tra emoji cần hai code unit UTF-16, chữ có dấu, vị trí giữa UTF-8, giữa CRLF, ngoài nguồn, cuối tệp và nguồn rỗng. Bài giảng và capstone yêu cầu snapshot/version, bỏ kết quả cũ và test hoàn tất tác vụ theo thứ tự đảo ngược. Cache phải theo dependency, không chỉ theo tên tệp.

## Nguồn chính thức

Nguồn được dùng để kiểm tra thuật ngữ và quy tắc; các đoạn giải thích, ngôn ngữ mẫu và mã thực hành được biên soạn riêng.

1. [Rust Compiler Development Guide — Overview](https://rustc-dev-guide.rust-lang.org/overview.html): AST/HIR/THIR/MIR, query và kiến trúc tổng thể.
2. [Rust Compiler Development Guide — Lexer and parser](https://rustc-dev-guide.rust-lang.org/the-parser.html): lexer, parser, span và định danh node.
3. [Rust standard library — str](https://doc.rust-lang.org/std/primitive.str.html): char_indices, get, len_utf8 qua char và encode_utf16.
4. [LLVM — Implementing a Parser and AST](https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/LangImpl02.html): AST và tách parsing biểu thức theo ưu tiên. Mã Pratt trong bài là bản Rust độc lập, không sao chép mã C++ của tutorial.
5. [Rust Compiler Development Guide — Name resolution](https://rustc-dev-guide.rust-lang.org/name-resolution.html): scope, namespace và liên kết tên tới khai báo.
6. [Rust Compiler Development Guide — Type inference](https://rustc-dev-guide.rust-lang.org/type-inference.html): phân biệt suy luận kiểu đầy đủ của Rust với mô hình Int/Bool.
7. [Rust Compiler Development Guide — ErrorGuaranteed](https://rustc-dev-guide.rust-lang.org/diagnostics/error-guaranteed.html): dấu hiệu một lỗi đã được phát, không phải lỗi sẽ có thể xuất hiện.
8. [Rust Compiler Development Guide — Errors and lints](https://rustc-dev-guide.rust-lang.org/diagnostics.html): diagnostic có cấu trúc và ngữ cảnh nguồn.
9. [Rust Compiler Development Guide — MIR](https://rustc-dev-guide.rust-lang.org/mir/index.html): basic block, terminator, kiểu tường minh và phân tích luồng.
10. [Rust Compiler Development Guide — Incremental compilation](https://rustc-dev-guide.rust-lang.org/queries/incremental-compilation.html): dependency và đầu vào đổi nhưng kết quả không đổi.
11. [Microsoft — LSP specification 3.17](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/): giao thức và cấu trúc tài liệu.
12. [Microsoft — vscode-languageserver-node types](https://github.com/microsoft/vscode-languageserver-node/blob/main/types/src/main.ts): kiểm tra trực tiếp chú thích Position, UTF-16, encoding thương lượng, CRLF và VersionedTextDocumentIdentifier. Trang đặc tả được công cụ đọc trả về chủ yếu mục lục nên đã đối chiếu mã nguồn chính thức này.

## Kiểm tra đã thực hiện trên Mac

- TypeScript strict bằng createProgram cho compiler.ts và các type được import: PASS, không diagnostic.
- Nạp export đã transpile và gọi validateCatalog trên một module track-compiler cùng bundle: PASS.
- Kiểm tra sáu ID, thứ tự lessonIds, các trường bắt buộc và localLab qua schema hiện hữu: PASS.
- Đếm phần giảng và số từ theo điều kiện 3–5 phần, 400–550 từ: PASS.
- Dữ liệu được lưu trực tiếp vào bản repo trên Mac, không dùng bản sao cloud.

Biên dịch và chạy Rust được giao cho agent tổng hợp để dùng cùng quy trình kiểm tra với các hướng khác. Báo cáo này không tuyên bố đã chạy rustc hoặc cargo test. Tất cả lời giải và toàn bộ tệp Cargo của hai lab đã có trong bundle để agent tổng hợp trích xuất và chạy.

## SHA-256

`src/data/specializations/compiler.ts`

`cc4eb1ec8cf78af83103edc6c8f404bce78a51cdca02aa9212fe642ce6d6f0dd`

Kích thước UTF-8: 78.982 byte.
