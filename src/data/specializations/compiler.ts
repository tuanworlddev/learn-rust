import type { SpecializationBundle } from "../specialization-types";

export const compilerBundle: SpecializationBundle = {
  "track": {
    "id": "compiler",
    "title": "Compiler và công cụ phát triển",
    "shortTitle": "Compiler",
    "description": "Xây ngôn ngữ nhỏ, hiểu lexer, parser, kiểm tra kiểu, IR và nền tảng công cụ hỗ trợ lập trình.",
    "outcome": "Xây một pipeline phân tích có kiểm thử, giải thích các invariant và chẩn đoán lỗi; có nền tảng để nghiên cứu rustc và tích hợp editor.",
    "prerequisites": [
      "Enum, pattern matching, Result và cấu trúc dữ liệu đệ quy.",
      "Ownership, borrowing, Box, Vec và HashMap.",
      "Unit test, integration test và sử dụng Cargo.",
      "Khả năng đọc ngữ pháp đơn giản và theo dõi thuật toán đệ quy."
    ],
    "technologies": [
      "Lexer",
      "Pratt parser",
      "AST",
      "Type checker",
      "IR",
      "LSP",
      "rustc"
    ],
    "color": "purple",
    "lessonIds": [
      "compiler-lexer-spans",
      "compiler-parser-precedence",
      "compiler-name-resolution",
      "compiler-type-diagnostics",
      "compiler-ir-execution",
      "compiler-incremental-tools"
    ],
    "capstone": {
      "title": "MiniLang: trình thông dịch và trợ lý mã nguồn",
      "description": "Xây một ngôn ngữ biểu thức có khai báo let, block, Int, Bool và if. Dùng chung lõi phân tích cho CLI và adapter editor; mỗi bước có hợp đồng đầu vào, đầu ra và bộ kiểm thử riêng.",
      "milestones": [
        {
          "title": "Ngữ pháp, token và span",
          "tasks": [
            "Viết tài liệu ngữ pháp, quy tắc identifier, số học, shadowing và giới hạn tài nguyên.",
            "Mở rộng lexer cùng parser từ lab; giữ span nguồn trên node và lỗi.",
            "Tạo ít nhất 20 fixture gồm nguồn hợp lệ, lỗi cú pháp, tiếng Việt, emoji và CRLF."
          ],
          "acceptance": "Mỗi fixture có kết quả mong đợi; không chấp nhận tiền tố hợp lệ khi còn token dư. Mọi span được kiểm tra trên đúng nguồn và nguồn vượt giới hạn trả lỗi rõ ràng."
        },
        {
          "title": "Resolver và kiểm tra kiểu",
          "tasks": [
            "Gắn SymbolId riêng cho từng khai báo và từng lần dùng; cấm khai báo trùng cùng block theo quy tắc MiniLang.",
            "Kiểm tra Int, Bool, phép toán và if; ghi lỗi độc lập, ngăn lỗi dây chuyền.",
            "Viết ít nhất 12 test về block, initializer, tên thiếu, sai điều kiện và hai nhánh khác kiểu."
          ],
          "acceptance": "Không có node unresolved hoặc node lỗi đi vào đường thực thi. Ca có hai nguyên nhân độc lập trả đúng hai lỗi; khai báo thất bại không làm đổi môi trường tên hợp lệ."
        },
        {
          "title": "Lowering và máy thực thi",
          "tasks": [
            "Hạ biểu thức đã kiểm tra sang IR có span; bổ sung biểu diễn block và nhánh if.",
            "Viết verifier cho số toán hạng, đích nhảy và trạng thái kết thúc; giới hạn số bước thực thi.",
            "So sánh interpreter AST và VM trên ít nhất 100 biểu thức được tạo có seed cố định."
          ],
          "acceptance": "Hai bộ thực thi cho cùng giá trị hoặc cùng loại lỗi theo ngữ nghĩa công bố. Có test overflow, sai thứ tự phép trừ, stack lỗi và chương trình vượt ngân sách."
        },
        {
          "title": "Snapshot, cache và giao tiếp editor",
          "tasks": [
            "Tách lõi phân tích thuần khỏi CLI và transport; mỗi yêu cầu giữ snapshot cùng version.",
            "Thêm cache có key và dependency rõ ràng; đo số lần chạy lại trước và sau thay đổi nội dung.",
            "Tạo adapter LSP tối thiểu cho mở, sửa, đóng tài liệu và diagnostic; thương lượng encoding hoặc dùng UTF-16 đúng mặc định."
          ],
          "acceptance": "Test sửa tài liệu liên tiếp rồi hoàn tất tác vụ theo thứ tự đảo ngược không công bố lỗi cũ. Range đúng trên tiếng Việt, emoji, LF và CRLF; thay đổi dependency không tái sử dụng kết quả sai."
        },
        {
          "title": "Hồ sơ kỹ thuật và đánh giá",
          "tasks": [
            "Viết README chạy CLI, editor và toàn bộ kiểm thử từ môi trường sạch.",
            "Ghi benchmark theo từng bước với bộ dữ liệu, cấu hình máy, giới hạn và cách tái hiện.",
            "Đối chiếu pipeline MiniLang với AST, HIR, THIR, MIR và query của rustc; nêu các phần chưa triển khai."
          ],
          "acceptance": "Người khác chạy được dự án, tái hiện ít nhất một lỗi từ nguồn đến diagnostic và giải thích lý do của mỗi invariant. Báo cáo phân biệt phần đã làm với hướng nghiên cứu tiếp theo."
        }
      ],
      "deliverables": [
        "Dự án Cargo có CLI, thư viện phân tích, Cargo.lock và README.",
        "Tài liệu ngữ pháp, quy tắc kiểu, số học, shadowing và giới hạn.",
        "Fixture cùng unit/integration test cho từng bước và toàn pipeline.",
        "Adapter editor, dữ liệu diagnostic mẫu và test đồng bộ phiên bản.",
        "Báo cáo đối chiếu AST với IR, benchmark có thể lặp và các quyết định thiết kế."
      ],
      "reviewQuestions": [
        "Vì sao span lưu byte nhưng cột editor có thể cần UTF-16? Bạn kiểm thử CRLF thế nào?",
        "Cặp binding power của phép trừ quyết định kết hợp trái ra sao?",
        "Tên được intern khác SymbolId của khai báo ở điểm nào?",
        "Làm sao thu nhiều lỗi mà không biến Ty::Error thành một kiểu hợp lệ?",
        "Một phép tối ưu có thể giữ kết quả thường gặp nhưng làm thay đổi lỗi overflow như thế nào?",
        "Cache phải phụ thuộc vào những gì ngoài nội dung tệp hiện tại?",
        "Dự án của bạn khác rustc ở hệ kiểu, borrow checking, macro và code generation ra sao?"
      ]
    },
    "resources": [
      {
        "label": "Rust Compiler Development Guide · Tổng quan kiến trúc",
        "url": "https://rustc-dev-guide.rust-lang.org/overview.html"
      },
      {
        "label": "Rust Compiler Development Guide · Lexer và parser",
        "url": "https://rustc-dev-guide.rust-lang.org/the-parser.html"
      },
      {
        "label": "LLVM · Parser và AST",
        "url": "https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/LangImpl02.html"
      },
      {
        "label": "Rust Compiler Development Guide · Name resolution",
        "url": "https://rustc-dev-guide.rust-lang.org/name-resolution.html"
      },
      {
        "label": "Rust Compiler Development Guide · Type inference",
        "url": "https://rustc-dev-guide.rust-lang.org/type-inference.html"
      },
      {
        "label": "Rust Compiler Development Guide · ErrorGuaranteed",
        "url": "https://rustc-dev-guide.rust-lang.org/diagnostics/error-guaranteed.html"
      },
      {
        "label": "Rust Compiler Development Guide · MIR",
        "url": "https://rustc-dev-guide.rust-lang.org/mir/index.html"
      },
      {
        "label": "Rust Compiler Development Guide · Incremental compilation",
        "url": "https://rustc-dev-guide.rust-lang.org/queries/incremental-compilation.html"
      },
      {
        "label": "Language Server Protocol · Đặc tả 3.17",
        "url": "https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/"
      },
      {
        "label": "Microsoft · Kiểu Position và encoding LSP",
        "url": "https://github.com/microsoft/vscode-languageserver-node/blob/main/types/src/main.ts"
      },
      {
        "label": "Rust standard library · str",
        "url": "https://doc.rust-lang.org/std/primitive.str.html"
      }
    ]
  },
  "lessons": [
    {
      "id": "compiler-lexer-spans",
      "moduleId": "track-compiler",
      "title": "Lexer và vị trí trong mã UTF-8",
      "description": "Tách từ vựng, giữ khoảng byte chính xác và đưa lỗi về đúng đoạn mã nguồn.",
      "duration": 45,
      "objectives": [
        "Tách nhiệm vụ lexer khỏi parser và resolver.",
        "Biểu diễn span nửa mở bằng byte, xử lý đúng tiếng Việt.",
        "Viết lexer trả Result, kiểm thử ký tự lạ và số vượt giới hạn."
      ],
      "sections": [
        {
          "title": "Chọn một ngôn ngữ đủ nhỏ để kiểm chứng",
          "text": "Compiler nhận văn bản và tạo ra một biểu diễn có cấu trúc trước khi suy luận ý nghĩa. Trong lộ trình này, MiniLang bắt đầu bằng số nguyên, toán tử cộng, trừ, nhân và dấu ngoặc; các bài sau bổ sung tên và kiểu. Viết tập token cùng ví dụ hợp lệ trước khi viết thuật toán. Chuỗi 12 + 3 cần ba token, không phải sáu ký tự riêng lẻ. Lexer xác định ranh giới từ vựng, còn parser quyết định các token kết hợp thành biểu thức nào. Dấu trừ là một token riêng; việc nó biểu diễn phép trừ hay toán tử một ngôi thuộc ngữ pháp."
        },
        {
          "title": "Span là khoảng byte nửa mở",
          "text": "Một span lưu start..end, trong đó end nằm ngay sau đoạn được chọn. Khoảng rỗng ở cuối tệp thuận tiện để báo thiếu toán hạng. Với UTF-8, số byte khác số ký tự Unicode và khác cột hiển thị: chữ có dấu có thể chiếm nhiều byte. char_indices cung cấp vị trí byte tại ranh giới ký tự; lấy end bằng vị trí cộng len_utf8. Khi nhận span từ bên ngoài, dùng str::get để kiểm tra cả biên lẫn ranh giới UTF-8. Giữ văn bản gốc trong suốt phiên phân tích; nếu chuẩn hóa hoặc chỉnh sửa nguồn, các span cũ không còn đáng tin.",
          "code": "let source = \"biến\";\nlet spans: Vec<_> = source.char_indices()\n    .map(|(start, ch)| (start, start + ch.len_utf8()))\n    .collect();\nassert_eq!(source.get(2..5), Some(\"ế\"));\nassert!(source.get(3..4).is_none());"
        },
        {
          "title": "Đọc dài nhất và báo lỗi có dữ liệu",
          "text": "Khi gặp chữ số ASCII, tiếp tục đọc đến ký tự không thuộc cùng token. Cộng dồn bằng checked_mul rồi checked_add để phát hiện literal vượt i64, độc lập chế độ debug hay release. Ký tự ngoài ngữ pháp phải tạo lỗi chứa span, không được âm thầm bỏ qua. Bài tập web chỉ trích các tên theo quy tắc chữ cái, chữ số và dấu gạch dưới; đó chưa phải lexer Rust hoàn chỉnh. Rust có quy tắc identifier Unicode riêng, cùng comment, raw string và macro. Khi mở rộng MiniLang, hãy ghi rõ quy tắc mới rồi thêm test trước."
        },
        {
          "title": "Kiểm thử ranh giới thay vì chỉ token đẹp",
          "text": "Lab tạo một thư viện lexer độc lập, không cần parser hay runtime. Kiểm tra nguồn rỗng, khoảng trắng, nhiều chữ số, ký tự Unicode không được hỗ trợ và literal quá lớn. Mọi token phải trỏ về một lát cắt hợp lệ của đúng nguồn đã phân tích. Với lỗi ở một biểu tượng nhiều byte, phần tô sáng phải bao trọn biểu tượng. Khi tích hợp nhiều tệp, thêm FileId vào span và lưu phiên bản nguồn tương ứng. Tách nội dung lỗi khỏi cách in giúp cùng một lexer phục vụ CLI, bài kiểm thử và trình soạn thảo mà không sửa thuật toán."
        }
      ],
      "tip": "Span dùng byte; chỉ chuyển sang dòng và cột khi trình bày lỗi hoặc giao tiếp với editor.",
      "exercise": {
        "title": "Trích tên mà không cắt sai UTF-8",
        "instructions": "Hoàn thành identifiers. Một tên bắt đầu bằng chữ cái Unicode hoặc _, tiếp tục bằng chữ cái, chữ số hoặc _. Bài tập chỉ tìm các đoạn khớp quy tắc này trong văn bản; không kiểm tra toàn bộ ngữ pháp.",
        "requirements": [
          "Dùng char_indices và trả khoảng byte start..end.",
          "Giữ nguyên chữ hoa, dấu và nội dung nguồn.",
          "Vượt qua kiểm thử tên tiếng Việt, emoji phân cách và nguồn rỗng."
        ]
      },
      "starterCode": "fn identifiers(source: &str) -> Vec<(usize, usize)> {\n    let _ = source;\n    todo!(\"Tìm ranh giới byte của từng tên\")\n}\n\nfn main() {\n    let source = \"let biến_2 = x;\";\n    let spans = identifiers(source);\n    assert_eq!(spans, vec![(0, 3), (4, 12), (15, 16)]);\n    assert!(source.get(7..8).is_none());\n    assert!(identifiers(\"\").is_empty());\n    let unicode = \"🦀a café\";\n    let words: Vec<_> = identifiers(unicode).into_iter()\n        .map(|(start, end)| &unicode[start..end]).collect();\n    assert_eq!(words, vec![\"a\", \"café\"]);\n    for (start, end) in spans {\n        println!(\"{}:{}..{}\", &source[start..end], start, end);\n    }\n}\n",
      "solutionCode": "fn identifiers(source: &str) -> Vec<(usize, usize)> {\n    let mut chars = source.char_indices().peekable();\n    let mut spans = Vec::new();\n    while let Some((start, ch)) = chars.next() {\n        if ch != '_' && !ch.is_alphabetic() {\n            continue;\n        }\n        let mut end = start + ch.len_utf8();\n        while let Some(&(offset, next)) = chars.peek() {\n            if next != '_' && !next.is_alphanumeric() {\n                break;\n            }\n            chars.next();\n            end = offset + next.len_utf8();\n        }\n        spans.push((start, end));\n    }\n    spans\n}\n\nfn main() {\n    let source = \"let biến_2 = x;\";\n    let spans = identifiers(source);\n    assert_eq!(spans, vec![(0, 3), (4, 12), (15, 16)]);\n    assert!(source.get(7..8).is_none());\n    assert!(identifiers(\"\").is_empty());\n    let unicode = \"🦀a café\";\n    let words: Vec<_> = identifiers(unicode).into_iter()\n        .map(|(start, end)| &unicode[start..end]).collect();\n    assert_eq!(words, vec![\"a\", \"café\"]);\n    for (start, end) in spans {\n        println!(\"{}:{}..{}\", &source[start..end], start, end);\n    }\n}\n",
      "expectedOutput": "let:0..3\nbiến_2:4..12\nx:15..16",
      "hints": [
        "Bắt đầu token khi ch == '_' hoặc ch.is_alphabetic().",
        "Peek ký tự kế tiếp; chỉ tiêu thụ khi nó còn thuộc cùng tên.",
        "End của ký tự cuối bằng offset + ch.len_utf8()."
      ],
      "quiz": {
        "question": "Vì sao lấy source[start..start + 1] để tô sáng một ký tự có thể panic?",
        "options": [
          "Vì mọi ký tự Unicode luôn dài hai byte.",
          "Vì start + 1 có thể nằm giữa chuỗi byte UTF-8 của ký tự.",
          "Vì Rust không cho cắt chuỗi có dấu.",
          "Vì Span bắt buộc lưu số dòng thay vì byte."
        ],
        "correct": 1,
        "explanation": "Lát cắt str phải có hai đầu nằm trên ranh giới UTF-8. Một ký tự như ế dài nhiều byte; char_indices và len_utf8 giúp giữ đúng ranh giới."
      },
      "reference": {
        "label": "Rust Compiler Development Guide · Lexer và parser",
        "url": "https://rustc-dev-guide.rust-lang.org/the-parser.html"
      },
      "localLab": {
        "title": "Thư viện lexer cho MiniLang",
        "instructions": "Tạo thư mục mini-lex và lưu các tệp dưới đây. Lexer hỗ trợ literal i64 không âm, +, -, *, (, ) và khoảng trắng Unicode; dấu trừ được tách thành token. Mỗi lỗi giữ span trong nguồn gốc.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"mini-lex\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\n"
          },
          {
            "path": "src/lib.rs",
            "content": "#[derive(Debug, Clone, Copy, PartialEq, Eq)]\npub struct Span {\n    pub start: usize,\n    pub end: usize,\n}\n\n#[derive(Debug, Clone, Copy, PartialEq, Eq)]\npub enum Kind {\n    Number(i64),\n    Plus,\n    Minus,\n    Star,\n    Left,\n    Right,\n}\n\n#[derive(Debug, Clone, PartialEq, Eq)]\npub struct Token {\n    pub kind: Kind,\n    pub span: Span,\n}\n\n#[derive(Debug, Clone, PartialEq, Eq)]\npub struct LexError {\n    pub span: Span,\n    pub message: &'static str,\n}\n\npub fn lex(source: &str) -> Result<Vec<Token>, LexError> {\n    let mut chars = source.char_indices().peekable();\n    let mut tokens = Vec::new();\n    while let Some((start, ch)) = chars.next() {\n        if ch.is_whitespace() {\n            continue;\n        }\n        let mut end = start + ch.len_utf8();\n        let kind = if ch.is_ascii_digit() {\n            let mut value = i64::from(ch as u8 - b'0');\n            while let Some(&(offset, next)) = chars.peek() {\n                if !next.is_ascii_digit() {\n                    break;\n                }\n                chars.next();\n                end = offset + next.len_utf8();\n                value = value.checked_mul(10)\n                    .and_then(|n| n.checked_add(i64::from(next as u8 - b'0')))\n                    .ok_or(LexError {\n                        span: Span { start, end },\n                        message: \"number overflow\",\n                    })?;\n            }\n            Kind::Number(value)\n        } else {\n            match ch {\n                '+' => Kind::Plus,\n                '-' => Kind::Minus,\n                '*' => Kind::Star,\n                '(' => Kind::Left,\n                ')' => Kind::Right,\n                _ => return Err(LexError {\n                    span: Span { start, end },\n                    message: \"unexpected character\",\n                }),\n            }\n        };\n        tokens.push(Token { kind, span: Span { start, end } });\n    }\n    Ok(tokens)\n}\n"
          },
          {
            "path": "tests/lexer.rs",
            "content": "use mini_lex::{lex, Kind, Span};\n\n#[test]\nfn numbers_and_operators_keep_spans() {\n    let source = \"12 + (3*4)\";\n    let tokens = lex(source).unwrap();\n    assert_eq!(tokens.len(), 7);\n    assert_eq!(tokens[0].kind, Kind::Number(12));\n    assert_eq!(tokens[0].span, Span { start: 0, end: 2 });\n    assert_eq!(tokens[1].kind, Kind::Plus);\n    for token in tokens {\n        assert!(source.get(token.span.start..token.span.end).is_some());\n    }\n}\n\n#[test]\nfn empty_and_unicode_whitespace() {\n    assert!(lex(\"\").unwrap().is_empty());\n    assert_eq!(lex(\"\\u{2003}7\").unwrap()[0].span, Span { start: 3, end: 4 });\n}\n\n#[test]\nfn unicode_error_covers_the_whole_character() {\n    let source = \"1+🦀\";\n    let error = lex(source).unwrap_err();\n    assert_eq!(error.span, Span { start: 2, end: 6 });\n    assert_eq!(&source[error.span.start..error.span.end], \"🦀\");\n}\n\n#[test]\nfn integer_limit_is_checked() {\n    assert_eq!(lex(\"9223372036854775807\").unwrap()[0].kind,\n        Kind::Number(i64::MAX));\n    assert_eq!(lex(\"9223372036854775808\").unwrap_err().message,\n        \"number overflow\");\n}\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo test --release"
        ],
        "checks": [
          "Bốn test chạy được ở debug và release.",
          "Emoji tạo đúng một lỗi với span 2..6.",
          "Literal bằng i64::MAX hợp lệ; lớn hơn một đơn vị trả lỗi."
        ]
      }
    },
    {
      "id": "compiler-parser-precedence",
      "moduleId": "track-compiler",
      "title": "Pratt parser và cây biểu thức",
      "description": "Biến token thành AST, kiểm soát ưu tiên toán tử và phát hiện đầu vào còn dư.",
      "duration": 60,
      "objectives": [
        "Giải thích khác biệt giữa token stream và AST.",
        "Cài Pratt parser cho toán tử kết hợp trái và dấu ngoặc.",
        "Kiểm thử ngữ pháp sai, overflow và giới hạn độ sâu."
      ],
      "sections": [
        {
          "title": "AST giữ cấu trúc đã được quyết định",
          "text": "Cùng token 2 + 3 * 4 có thể tạo hai cây với kết quả khác nhau nếu parser bỏ qua độ ưu tiên. Ngữ pháp MiniLang quy định nhân mạnh hơn cộng và trừ; các toán tử cùng mức kết hợp trái. AST ghi quyết định đó bằng Number và Binary với hai cây con. Dấu ngoặc chỉ điều khiển cách nhóm nên có thể biến mất khỏi loại node, nhưng span vẫn bao phủ vùng tương ứng. Khi xây formatter cần giữ comment và dấu phân cách, một cây cú pháp giữ đầy đủ token sẽ phù hợp hơn AST tối giản dùng để tính toán."
        },
        {
          "title": "Binding power điều khiển đệ quy",
          "text": "Pratt parser nhận một ngưỡng minimum, đọc toán hạng đầu rồi xét toán tử kế tiếp. Nếu sức liên kết bên trái nhỏ hơn ngưỡng, nó trả quyền xử lý về lời gọi ngoài. Với toán tử kết hợp trái, cặp sức liên kết là (1, 2) cho cộng, trừ và (3, 4) cho nhân. Vế phải của cộng được đọc ở ngưỡng 2 nên vẫn nhận nhân, nhưng nhường cộng tiếp theo. Nhờ vậy 9 - 3 - 2 thành (9 - 3) - 2. Đừng đổi cặp số theo cảm giác; hãy vẽ cây và kiểm thử từng quy tắc.",
          "code": "fn binding_power(op: char) -> Option<(u8, u8)> {\n    match op {\n        '+' | '-' => Some((1, 2)),\n        '*' => Some((3, 4)),\n        _ => None,\n    }\n}\n// 2 + 3 * 4 => Add(Number(2), Multiply(Number(3), Number(4)))"
        },
        {
          "title": "Một parse thành công phải tiêu thụ toàn bộ",
          "text": "Sau khi đọc một biểu thức, hàm parse cấp cao phải xác nhận không còn token thừa. Nếu không, 1 2 có thể bị chấp nhận chỉ vì tiền tố 1 hợp lệ. Trong ngoặc, gọi parser biểu thức với ngưỡng thấp nhất rồi yêu cầu dấu đóng. Phân biệt thiếu toán hạng, thiếu ngoặc và token không mong đợi bằng span cụ thể. Lab dùng Result để dừng ở lỗi cú pháp đầu tiên; bài về diagnostic sẽ giải thích cách phục hồi nhiều lỗi. Đặt giới hạn kích thước nguồn, số token và độ sâu trước khi phục vụ văn bản từ người dùng."
        },
        {
          "title": "Tách dựng cây khỏi thực thi",
          "text": "Parser chỉ tổ chức cấu trúc, không nên vừa đọc token vừa thực hiện tác dụng phụ. Hàm evaluate riêng giúp so sánh cây, đổi backend và kiểm thử lỗi số học độc lập. Lab chứa lexer, AST có span, parser, bộ tính checked arithmetic và CLI nhận biểu thức làm đối số. Kiểm tra cả 2 + 3 * 4, (2 + 3) * 4 và phép trừ liên tiếp; ba ca này phân biệt được ưu tiên, ngoặc và kết hợp. Sau đó thử nguồn rỗng, token dư, ngoặc lồng sâu và số vượt miền để chứng minh đường lỗi cũng được thiết kế."
        }
      ],
      "tip": "Đừng chỉ so kết quả: khi hai biểu thức tình cờ cho cùng giá trị, kiểm thử hình dạng AST vẫn phát hiện được cây bị dựng sai.",
      "exercise": {
        "title": "Hoàn thành Pratt parser",
        "instructions": "Cài parse_bp cho token Number, Plus, Minus, Star, Left và Right. Hàm parse và evaluate đã tách riêng để kiểm tra tiêu thụ toàn bộ đầu vào và số học.",
        "requirements": [
          "Nhân ưu tiên hơn cộng và trừ.",
          "Cộng, trừ, nhân kết hợp trái; dấu ngoặc ghi đè cách nhóm.",
          "Thiếu toán hạng, thiếu ngoặc và token thừa phải trả Err."
        ]
      },
      "starterCode": "#[derive(Debug, Clone, Copy, PartialEq)]\nenum Token { Number(i64), Plus, Minus, Star, Left, Right }\n\n#[derive(Debug)]\nenum Expr { Number(i64), Binary(Token, Box<Expr>, Box<Expr>) }\n\nfn parse_bp(tokens: &[Token], position: &mut usize, minimum: u8)\n    -> Result<Expr, &'static str>\n{\n    let _ = (tokens, position, minimum);\n    todo!(\"Dựng AST theo binding power\")\n}\n\nfn parse(tokens: &[Token]) -> Result<Expr, &'static str> {\n    // Giới hạn fixture trong bài tập; lab có thêm giới hạn độ sâu.\n    if tokens.len() > 64 { return Err(\"too many tokens\"); }\n    let mut position = 0;\n    let tree = parse_bp(tokens, &mut position, 0)?;\n    if position != tokens.len() { return Err(\"trailing tokens\"); }\n    Ok(tree)\n}\n\nfn eval(tree: &Expr) -> Result<i64, &'static str> {\n    match tree {\n        Expr::Number(n) => Ok(*n),\n        Expr::Binary(op, left, right) => {\n            let (a, b) = (eval(left)?, eval(right)?);\n            match op {\n                Token::Plus => a.checked_add(b),\n                Token::Minus => a.checked_sub(b),\n                Token::Star => a.checked_mul(b),\n                _ => return Err(\"invalid AST operator\"),\n            }.ok_or(\"arithmetic overflow\")\n        }\n    }\n}\n\nfn main() {\n    use Token::*;\n    let first = [Number(2), Plus, Number(3), Star, Number(4)];\n    let second = [Left, Number(2), Plus, Number(3), Right, Star, Number(4)];\n    let third = [Number(9), Minus, Number(3), Minus, Number(2)];\n    assert_eq!(eval(&parse(&first).unwrap()), Ok(14));\n    assert_eq!(eval(&parse(&second).unwrap()), Ok(20));\n    assert_eq!(eval(&parse(&third).unwrap()), Ok(4));\n    assert!(parse(&[]).is_err());\n    assert!(parse(&[Number(1), Plus]).is_err());\n    assert!(parse(&[Left, Number(1)]).is_err());\n    assert!(parse(&[Number(1), Number(2)]).is_err());\n    println!(\"2 + 3 * 4 = {}\", eval(&parse(&first).unwrap()).unwrap());\n    println!(\"(2 + 3) * 4 = {}\", eval(&parse(&second).unwrap()).unwrap());\n    println!(\"9 - 3 - 2 = {}\", eval(&parse(&third).unwrap()).unwrap());\n}\n",
      "solutionCode": "#[derive(Debug, Clone, Copy, PartialEq)]\nenum Token { Number(i64), Plus, Minus, Star, Left, Right }\n\n#[derive(Debug)]\nenum Expr { Number(i64), Binary(Token, Box<Expr>, Box<Expr>) }\n\nfn parse_bp(tokens: &[Token], position: &mut usize, minimum: u8)\n    -> Result<Expr, &'static str>\n{\n    let token = tokens.get(*position).copied().ok_or(\"expected expression\")?;\n    *position += 1;\n    let mut left = match token {\n        Token::Number(n) => Expr::Number(n),\n        Token::Left => {\n            let inner = parse_bp(tokens, position, 0)?;\n            if tokens.get(*position) != Some(&Token::Right) {\n                return Err(\"expected closing parenthesis\");\n            }\n            *position += 1;\n            inner\n        }\n        _ => return Err(\"expected expression\"),\n    };\n    loop {\n        let Some(op) = tokens.get(*position).copied() else { break };\n        let (left_bp, right_bp) = match op {\n            Token::Plus | Token::Minus => (1, 2),\n            Token::Star => (3, 4),\n            _ => break,\n        };\n        if left_bp < minimum {\n            break;\n        }\n        *position += 1;\n        let right = parse_bp(tokens, position, right_bp)?;\n        left = Expr::Binary(op, Box::new(left), Box::new(right));\n    }\n    Ok(left)\n}\n\nfn parse(tokens: &[Token]) -> Result<Expr, &'static str> {\n    // Giới hạn fixture trong bài tập; lab có thêm giới hạn độ sâu.\n    if tokens.len() > 64 { return Err(\"too many tokens\"); }\n    let mut position = 0;\n    let tree = parse_bp(tokens, &mut position, 0)?;\n    if position != tokens.len() { return Err(\"trailing tokens\"); }\n    Ok(tree)\n}\n\nfn eval(tree: &Expr) -> Result<i64, &'static str> {\n    match tree {\n        Expr::Number(n) => Ok(*n),\n        Expr::Binary(op, left, right) => {\n            let (a, b) = (eval(left)?, eval(right)?);\n            match op {\n                Token::Plus => a.checked_add(b),\n                Token::Minus => a.checked_sub(b),\n                Token::Star => a.checked_mul(b),\n                _ => return Err(\"invalid AST operator\"),\n            }.ok_or(\"arithmetic overflow\")\n        }\n    }\n}\n\nfn main() {\n    use Token::*;\n    let first = [Number(2), Plus, Number(3), Star, Number(4)];\n    let second = [Left, Number(2), Plus, Number(3), Right, Star, Number(4)];\n    let third = [Number(9), Minus, Number(3), Minus, Number(2)];\n    assert_eq!(eval(&parse(&first).unwrap()), Ok(14));\n    assert_eq!(eval(&parse(&second).unwrap()), Ok(20));\n    assert_eq!(eval(&parse(&third).unwrap()), Ok(4));\n    assert!(parse(&[]).is_err());\n    assert!(parse(&[Number(1), Plus]).is_err());\n    assert!(parse(&[Left, Number(1)]).is_err());\n    assert!(parse(&[Number(1), Number(2)]).is_err());\n    println!(\"2 + 3 * 4 = {}\", eval(&parse(&first).unwrap()).unwrap());\n    println!(\"(2 + 3) * 4 = {}\", eval(&parse(&second).unwrap()).unwrap());\n    println!(\"9 - 3 - 2 = {}\", eval(&parse(&third).unwrap()).unwrap());\n}\n",
      "expectedOutput": "2 + 3 * 4 = 14\n(2 + 3) * 4 = 20\n9 - 3 - 2 = 4",
      "hints": [
        "Đọc Number hoặc một biểu thức nằm trong ngoặc trước vòng lặp toán tử.",
        "Dùng (1, 2) cho + và -, (3, 4) cho *.",
        "Nếu left_bp < minimum, giữ nguyên token để lời gọi ngoài đọc tiếp."
      ],
      "quiz": {
        "question": "Với cặp binding power (1, 2) cho -, cây của 9 - 3 - 2 là gì?",
        "options": [
          "9 - (3 - 2).",
          "(9 - 3) - 2.",
          "Hai cây đều hợp lệ vì phép trừ giao hoán.",
          "Parser phải từ chối mọi chuỗi có hai dấu trừ."
        ],
        "correct": 1,
        "explanation": "Ngưỡng 2 của vế phải không nhận dấu trừ có left_bp bằng 1. Lời gọi ngoài nhận dấu trừ sau, tạo kết hợp trái."
      },
      "reference": {
        "label": "LLVM · Parser và Abstract Syntax Tree",
        "url": "https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/LangImpl02.html"
      },
      "localLab": {
        "title": "Parser và trình thông dịch biểu thức",
        "instructions": "Tạo dự án mini-expr với các tệp dưới đây. Đây là một ngôn ngữ biểu thức nhỏ, hỗ trợ số nguyên không âm, +, -, *, ngoặc và khoảng trắng. Phép trừ có thể tạo kết quả âm; chưa có toán tử âm một ngôi.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"mini-expr\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\n"
          },
          {
            "path": "src/lexer.rs",
            "content": "#[derive(Debug, Clone, Copy, PartialEq, Eq)]\npub struct Span {\n    pub start: usize,\n    pub end: usize,\n}\n\n#[derive(Debug, Clone, Copy, PartialEq, Eq)]\npub enum Kind {\n    Number(i64),\n    Plus,\n    Minus,\n    Star,\n    Left,\n    Right,\n}\n\n#[derive(Debug, Clone, PartialEq, Eq)]\npub struct Token {\n    pub kind: Kind,\n    pub span: Span,\n}\n\n#[derive(Debug, Clone, PartialEq, Eq)]\npub struct LexError {\n    pub span: Span,\n    pub message: &'static str,\n}\n\npub fn lex(source: &str) -> Result<Vec<Token>, LexError> {\n    let mut chars = source.char_indices().peekable();\n    let mut tokens = Vec::new();\n    while let Some((start, ch)) = chars.next() {\n        if ch.is_whitespace() {\n            continue;\n        }\n        let mut end = start + ch.len_utf8();\n        let kind = if ch.is_ascii_digit() {\n            let mut value = i64::from(ch as u8 - b'0');\n            while let Some(&(offset, next)) = chars.peek() {\n                if !next.is_ascii_digit() {\n                    break;\n                }\n                chars.next();\n                end = offset + next.len_utf8();\n                value = value.checked_mul(10)\n                    .and_then(|n| n.checked_add(i64::from(next as u8 - b'0')))\n                    .ok_or(LexError {\n                        span: Span { start, end },\n                        message: \"number overflow\",\n                    })?;\n            }\n            Kind::Number(value)\n        } else {\n            match ch {\n                '+' => Kind::Plus,\n                '-' => Kind::Minus,\n                '*' => Kind::Star,\n                '(' => Kind::Left,\n                ')' => Kind::Right,\n                _ => return Err(LexError {\n                    span: Span { start, end },\n                    message: \"unexpected character\",\n                }),\n            }\n        };\n        tokens.push(Token { kind, span: Span { start, end } });\n    }\n    Ok(tokens)\n}\n"
          },
          {
            "path": "src/lib.rs",
            "content": "pub mod lexer;\nuse lexer::{lex, Kind, Span, Token};\n\n#[derive(Debug, Clone, Copy, PartialEq, Eq)]\npub enum Op { Add, Subtract, Multiply }\n\n#[derive(Debug, Clone, PartialEq, Eq)]\npub struct Expr {\n    pub kind: ExprKind,\n    pub span: Span,\n}\n\n#[derive(Debug, Clone, PartialEq, Eq)]\npub enum ExprKind {\n    Number(i64),\n    Binary { op: Op, left: Box<Expr>, right: Box<Expr> },\n}\n\n#[derive(Debug, Clone, PartialEq, Eq)]\npub struct Error {\n    pub span: Span,\n    pub message: &'static str,\n}\n\nstruct Parser {\n    tokens: Vec<Token>,\n    position: usize,\n    source_len: usize,\n}\n\nimpl Parser {\n    fn error(&self, message: &'static str) -> Error {\n        Error {\n            span: self.tokens.get(self.position).map(|t| t.span)\n                .unwrap_or(Span { start: self.source_len, end: self.source_len }),\n            message,\n        }\n    }\n\n    fn next(&mut self) -> Result<Token, Error> {\n        let token = self.tokens.get(self.position).cloned()\n            .ok_or_else(|| self.error(\"expected token\"))?;\n        self.position += 1;\n        Ok(token)\n    }\n\n    fn expression(&mut self, minimum: u8, depth: usize) -> Result<Expr, Error> {\n        if depth > 64 {\n            return Err(self.error(\"nesting limit exceeded\"));\n        }\n        let token = self.next()?;\n        let mut left = match token.kind {\n            Kind::Number(n) => Expr { kind: ExprKind::Number(n), span: token.span },\n            Kind::Left => {\n                let mut inner = self.expression(0, depth + 1)?;\n                let close = self.next()?;\n                if close.kind != Kind::Right {\n                    return Err(Error { span: close.span, message: \"expected )\" });\n                }\n                inner.span = Span { start: token.span.start, end: close.span.end };\n                inner\n            }\n            _ => return Err(Error { span: token.span, message: \"expected expression\" }),\n        };\n        loop {\n            let Some(next) = self.tokens.get(self.position) else { break };\n            let (op, left_bp, right_bp) = match next.kind {\n                Kind::Plus => (Op::Add, 1, 2),\n                Kind::Minus => (Op::Subtract, 1, 2),\n                Kind::Star => (Op::Multiply, 3, 4),\n                _ => break,\n            };\n            if left_bp < minimum {\n                break;\n            }\n            self.position += 1;\n            let right = self.expression(right_bp, depth + 1)?;\n            let span = Span { start: left.span.start, end: right.span.end };\n            left = Expr {\n                kind: ExprKind::Binary { op, left: Box::new(left), right: Box::new(right) },\n                span,\n            };\n        }\n        Ok(left)\n    }\n}\n\npub fn parse(source: &str) -> Result<Expr, Error> {\n    if source.len() > 8192 {\n        return Err(Error { span: Span { start: 0, end: 0 }, message: \"source too large\" });\n    }\n    let tokens = lex(source).map_err(|e| Error { span: e.span, message: e.message })?;\n    if tokens.len() > 256 {\n        return Err(Error { span: Span { start: 0, end: 0 }, message: \"too many tokens\" });\n    }\n    let mut parser = Parser { tokens, position: 0, source_len: source.len() };\n    let tree = parser.expression(0, 0)?;\n    if parser.position != parser.tokens.len() {\n        return Err(parser.error(\"unexpected trailing token\"));\n    }\n    Ok(tree)\n}\n\npub fn evaluate(tree: &Expr) -> Result<i64, Error> {\n    match &tree.kind {\n        ExprKind::Number(n) => Ok(*n),\n        ExprKind::Binary { op, left, right } => {\n            let (a, b) = (evaluate(left)?, evaluate(right)?);\n            let value = match op {\n                Op::Add => a.checked_add(b),\n                Op::Subtract => a.checked_sub(b),\n                Op::Multiply => a.checked_mul(b),\n            };\n            value.ok_or(Error { span: tree.span, message: \"arithmetic overflow\" })\n        }\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use mini_expr::{evaluate, parse};\n\nfn main() {\n    let source = std::env::args().nth(1).unwrap_or_else(|| \"2 + 3 * 4\".into());\n    match parse(&source).and_then(|tree| evaluate(&tree)) {\n        Ok(value) => println!(\"{value}\"),\n        Err(error) => {\n            eprintln!(\"{} at {}..{}\", error.message, error.span.start, error.span.end);\n            std::process::exit(1);\n        }\n    }\n}\n"
          },
          {
            "path": "tests/pipeline.rs",
            "content": "use mini_expr::{evaluate, parse, ExprKind, Op};\n\nfn value(source: &str) -> i64 {\n    evaluate(&parse(source).unwrap()).unwrap()\n}\n\n#[test]\nfn precedence_parentheses_and_associativity() {\n    assert_eq!(value(\"2 + 3 * 4\"), 14);\n    assert_eq!(value(\"(2 + 3) * 4\"), 20);\n    assert_eq!(value(\"9 - 3 - 2\"), 4);\n    let tree = parse(\"2 + 3 * 4\").unwrap();\n    match tree.kind {\n        ExprKind::Binary { op: Op::Add, right, .. } => {\n            assert!(matches!(right.kind, ExprKind::Binary { op: Op::Multiply, .. }));\n        }\n        _ => panic!(\"wrong AST shape\"),\n    }\n}\n\n#[test]\nfn syntax_errors_never_accept_a_prefix() {\n    for source in [\"\", \"1 +\", \"(1 + 2\", \"1 2\", \")\", \"-1\"] {\n        assert!(parse(source).is_err(), \"{source}\");\n    }\n}\n\n#[test]\nfn source_ranges_and_utf8_errors() {\n    let tree = parse(\" (2 + 3) \").unwrap();\n    assert_eq!((tree.span.start, tree.span.end), (1, 8));\n    let source = \"1 + 🦀\";\n    let error = parse(source).unwrap_err();\n    assert_eq!(source.get(error.span.start..error.span.end), Some(\"🦀\"));\n}\n\n#[test]\nfn lexical_and_runtime_overflow_are_separate() {\n    assert!(parse(\"9223372036854775808\").is_err());\n    let tree = parse(\"9223372036854775807 + 1\").unwrap();\n    assert_eq!(evaluate(&tree).unwrap_err().message, \"arithmetic overflow\");\n}\n\n#[test]\nfn resource_limits_are_deterministic() {\n    let deep = format!(\"{}1{}\", \"(\".repeat(70), \")\".repeat(70));\n    assert_eq!(parse(&deep).unwrap_err().message, \"nesting limit exceeded\");\n    assert_eq!(parse(&\" \".repeat(8193)).unwrap_err().message, \"source too large\");\n}\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo test --release",
          "cargo run -- \"2 + 3 * 4\"",
          "cargo run -- \"(2 + 3) * 4\"",
          "cargo run -- \"1 2\""
        ],
        "checks": [
          "Năm test đi qua ở debug và release.",
          "Hai biểu thức mẫu in 14 và 20.",
          "1 2 báo unexpected trailing token và thoát với mã 1.",
          "Nguồn lồng ngoặc quá sâu trả lỗi giới hạn; không tiếp tục dựng cây."
        ]
      }
    },
    {
      "id": "compiler-name-resolution",
      "moduleId": "track-compiler",
      "title": "Phân giải tên và phạm vi khai báo",
      "description": "Gắn mỗi lần dùng tên với đúng khai báo, xử lý shadowing và giữ định danh qua các bước phân tích.",
      "duration": 45,
      "objectives": [
        "Phân biệt cách viết tên với định danh của một khai báo.",
        "Cài lookup từ phạm vi trong ra ngoài và khai báo không ghi đè khi lỗi.",
        "Thiết kế quy tắc initializer, shadowing và tên chưa được khai báo."
      ],
      "sections": [
        {
          "title": "Tên giống nhau không phải cùng một biến",
          "text": "Parser biết một node là Name(\"total\"), nhưng chưa biết nó đang chỉ đến khai báo nào. Resolver gắn node đó với SymbolId của một khai báo cụ thể. Hai block có thể dùng cùng cách viết total nhưng sở hữu hai symbol khác nhau; một lần dùng phải trỏ đúng symbol còn hiệu lực. Lưu ID trong cây đã resolve giúp type checker và interpreter không phải tìm lại bằng chuỗi. Span khai báo và span sử dụng vẫn được giữ để báo lỗi, tìm định nghĩa và đổi tên. Chuỗi được intern để tiết kiệm bộ nhớ cũng chưa tự trở thành định danh của khai báo."
        },
        {
          "title": "Một ngăn xếp phạm vi với chính sách rõ ràng",
          "text": "Mô hình tối thiểu là Vec<HashMap<String, SymbolId>>. Vào block thì push một bảng rỗng; ra block thì pop. Lookup đi từ bảng cuối về bảng đầu và dừng ở kết quả đầu tiên, nhờ đó tên gần nhất che tên ngoài. MiniLang trong bài cho phép shadowing ở block con nhưng từ chối khai báo trùng trong cùng block. Đây là lựa chọn của ngôn ngữ mẫu; Rust cho phép let shadow một binding ngay trong cùng block. Khi thêm hàm lồng nhau hoặc closure, phải định nghĩa riêng quy tắc capture, không suy ra rằng mọi tên ngoài đều truy cập được.",
          "code": "use std::collections::HashMap;\ntype SymbolId = u32;\n\nfn lookup(scopes: &[HashMap<String, SymbolId>], name: &str) -> Option<SymbolId> {\n    scopes.iter().rev().find_map(|scope| scope.get(name).copied())\n}"
        },
        {
          "title": "Thứ tự khai báo cũng là ngữ nghĩa",
          "text": "Với let total = total + 1 trong block con, resolver của MiniLang đọc initializer bằng môi trường cũ rồi mới đưa binding mới vào phạm vi. Nếu không tìm thấy total ngoài, báo chưa khai báo; không cho binding chưa khởi tạo tham chiếu chính nó. Khi khai báo trùng bị từ chối, bảng tên phải giữ nguyên binding trước đó. Entry API giúp diễn đạt bước kiểm tra rồi chèn mà không ghi đè nhầm. Tạo ID mới theo bộ cấp phát của một lần phân tích; không dùng vị trí byte làm ID lâu dài vì chèn văn bản sẽ dịch vị trí."
        },
        {
          "title": "Chuẩn bị cho type checker và IDE",
          "text": "Kết quả resolver là ánh xạ từ lần sử dụng sang khai báo cùng danh sách lỗi có vị trí. Một tên không tìm thấy cần node lỗi riêng để các bước sau tránh đoán ID hoặc gán ID mặc định. Với rename, chỉ sửa các lần sử dụng trỏ về cùng symbol, không thay mọi chuỗi trùng chữ trong tệp. Các compiler lớn còn tách namespace cho kiểu, giá trị và macro; mô hình một bảng của bài chưa bao quát các quy tắc đó. Hãy kiểm thử block lồng nhau, thoát block, tên thiếu và lỗi khai báo trùng trước khi mở rộng namespace."
        }
      ],
      "tip": "Kiểm thử trạng thái sau lỗi khai báo trùng: binding cũ phải còn nguyên, không chỉ kiểm tra hàm có trả Err.",
      "exercise": {
        "title": "Resolver giữ đúng binding",
        "instructions": "Hoàn thành declare và resolve. Chỉ cho chèn tên mới trong phạm vi hiện tại; lookup ưu tiên phạm vi gần nhất. SymbolId do người gọi cấp và đại diện cho từng khai báo.",
        "requirements": [
          "Khai báo trùng trong cùng phạm vi trả Err, không ghi đè giá trị cũ.",
          "Block con có thể khai báo cùng tên với block ngoài.",
          "Lookup tên thiếu hoặc trên danh sách phạm vi rỗng trả None."
        ]
      },
      "starterCode": "use std::collections::{HashMap, hash_map::Entry};\n\nfn declare(scopes: &mut [HashMap<String, u32>], name: &str, id: u32)\n    -> Result<(), &'static str>\n{\n    let _ = (scopes, name, id);\n    todo!(\"Chèn binding mà không ghi đè khi trùng\")\n}\n\nfn resolve(scopes: &[HashMap<String, u32>], name: &str) -> Option<u32> {\n    let _ = (scopes, name);\n    todo!(\"Tìm từ phạm vi trong ra ngoài\")\n}\n\nfn main() {\n    let mut scopes = vec![HashMap::new()];\n    declare(&mut scopes, \"total\", 1).unwrap();\n    assert_eq!(resolve(&scopes, \"total\"), Some(1));\n\n    scopes.push(HashMap::new());\n    // Initializer được resolve trước khi thêm binding mới.\n    let previous = resolve(&scopes, \"total\").unwrap();\n    declare(&mut scopes, \"total\", 2).unwrap();\n    assert_eq!(previous, 1);\n    assert_eq!(resolve(&scopes, \"total\"), Some(2));\n    assert_eq!(declare(&mut scopes, \"total\", 99), Err(\"duplicate declaration\"));\n    assert_eq!(resolve(&scopes, \"total\"), Some(2));\n\n    scopes.pop();\n    assert_eq!(resolve(&scopes, \"total\"), Some(1));\n    assert_eq!(resolve(&scopes, \"missing\"), None);\n    assert_eq!(declare(&mut [], \"x\", 3), Err(\"missing scope\"));\n    assert_eq!(resolve(&[], \"x\"), None);\n    println!(\"Initializer: #{previous}\");\n    println!(\"Trong block: #2\");\n    println!(\"Sau block: #{}\", resolve(&scopes, \"total\").unwrap());\n}\n",
      "solutionCode": "use std::collections::{HashMap, hash_map::Entry};\n\nfn declare(scopes: &mut [HashMap<String, u32>], name: &str, id: u32)\n    -> Result<(), &'static str>\n{\n    let scope = scopes.last_mut().ok_or(\"missing scope\")?;\n    match scope.entry(name.to_owned()) {\n        Entry::Vacant(slot) => {\n            slot.insert(id);\n            Ok(())\n        }\n        Entry::Occupied(_) => Err(\"duplicate declaration\"),\n    }\n}\n\nfn resolve(scopes: &[HashMap<String, u32>], name: &str) -> Option<u32> {\n    scopes.iter().rev().find_map(|scope| scope.get(name).copied())\n}\n\nfn main() {\n    let mut scopes = vec![HashMap::new()];\n    declare(&mut scopes, \"total\", 1).unwrap();\n    assert_eq!(resolve(&scopes, \"total\"), Some(1));\n\n    scopes.push(HashMap::new());\n    // Initializer được resolve trước khi thêm binding mới.\n    let previous = resolve(&scopes, \"total\").unwrap();\n    declare(&mut scopes, \"total\", 2).unwrap();\n    assert_eq!(previous, 1);\n    assert_eq!(resolve(&scopes, \"total\"), Some(2));\n    assert_eq!(declare(&mut scopes, \"total\", 99), Err(\"duplicate declaration\"));\n    assert_eq!(resolve(&scopes, \"total\"), Some(2));\n\n    scopes.pop();\n    assert_eq!(resolve(&scopes, \"total\"), Some(1));\n    assert_eq!(resolve(&scopes, \"missing\"), None);\n    assert_eq!(declare(&mut [], \"x\", 3), Err(\"missing scope\"));\n    assert_eq!(resolve(&[], \"x\"), None);\n    println!(\"Initializer: #{previous}\");\n    println!(\"Trong block: #2\");\n    println!(\"Sau block: #{}\", resolve(&scopes, \"total\").unwrap());\n}\n",
      "expectedOutput": "Initializer: #1\nTrong block: #2\nSau block: #1",
      "hints": [
        "last_mut chọn đúng phạm vi nhận khai báo.",
        "Entry::Occupied phải trả Err mà không insert.",
        "iter().rev().find_map(...) dừng ở binding gần nhất."
      ],
      "quiz": {
        "question": "Sau khi khai báo trùng total trong cùng block bị từ chối, resolver nên làm gì?",
        "options": [
          "Đổi binding cũ sang ID của khai báo mới.",
          "Xóa cả hai binding để tránh nhập nhằng.",
          "Giữ binding cũ và ghi nhận lỗi ở khai báo mới.",
          "Tìm và xóa total trong mọi phạm vi ngoài."
        ],
        "correct": 2,
        "explanation": "Một thao tác thất bại không nên làm thay đổi môi trường tên hợp lệ trước đó. Giữ binding cũ giúp lỗi sau không trở thành hậu quả của việc ghi đè nhầm."
      },
      "reference": {
        "label": "Rust Compiler Development Guide · Name resolution",
        "url": "https://rustc-dev-guide.rust-lang.org/name-resolution.html"
      }
    },
    {
      "id": "compiler-type-diagnostics",
      "moduleId": "track-compiler",
      "title": "Kiểm tra kiểu và phục hồi sau lỗi",
      "description": "Viết quy tắc kiểu, giữ lỗi độc lập và ngăn một sai sót sinh ra hàng loạt thông báo phụ.",
      "duration": 55,
      "objectives": [
        "Suy ra kiểu cho literal, phép cộng và biểu thức if.",
        "Phân biệt kiểu chưa biết với trạng thái đã có lỗi.",
        "Thu nhiều lỗi độc lập và chặn thực thi khi kiểm tra kiểu thất bại."
      ],
      "sections": [
        {
          "title": "Viết quy tắc trước khi viết match",
          "text": "Resolver trả lời một tên chỉ đến đâu; type checker trả lời biểu thức tạo giá trị thuộc kiểu nào và thao tác có hợp lệ không. MiniLang dùng hai kiểu Int và Bool. Phép cộng yêu cầu hai Int và trả Int. Điều kiện if phải là Bool, hai nhánh phải cùng kiểu; kiểu của if là kiểu chung đó. Viết các quy tắc này thành bảng ví dụ hợp lệ và không hợp lệ trước khi cài hàm infer. Việc suy ra hai kiểu cụ thể từ cây là một mô hình nhỏ; nó chưa triển khai generic, trait solving, subtyping hay hệ lifetime của Rust."
        },
        {
          "title": "Kiểu lỗi không có nghĩa là kiểu tùy ý",
          "text": "Sau một lỗi đã được ghi nhận, trả Ty::Error để những node phụ thuộc biết kết quả không còn đáng tin. Nếu một toán hạng của cộng đã lỗi, đừng báo thêm rằng nó không phải Int: thông báo đó thường chỉ là hậu quả. Nhưng vẫn duyệt toán hạng còn lại để phát hiện lỗi độc lập. Ty::Error khác biến kiểu chưa suy ra; không được coi nó như chứng minh rằng chương trình hợp lệ. Trước bước lowering hoặc chạy chương trình, kiểm tra danh sách lỗi và từ chối nếu còn lỗi nghiêm trọng. Bài tập dùng Invalid để mô phỏng node cú pháp lỗi.",
          "code": "#[derive(Clone, Copy, PartialEq, Eq)]\nenum Ty { Int, Bool, Error }\n\nfn add_type(left: Ty, right: Ty) -> Result<Ty, &'static str> {\n    match (left, right) {\n        (Ty::Error, _) | (_, Ty::Error) => Ok(Ty::Error),\n        (Ty::Int, Ty::Int) => Ok(Ty::Int),\n        _ => Err(\"hai toán hạng phải có kiểu Int\"),\n    }\n}"
        },
        {
          "title": "Diagnostic là dữ liệu để người học sửa được",
          "text": "Một diagnostic hữu ích có mã lỗi, thông điệp cụ thể, span chính và có thể kèm span khai báo liên quan. Thay vì chỉ nói sai kiểu, hãy chỉ ra đang cần Int nhưng nhận Bool tại toán hạng nào. Danh sách diagnostic nên ổn định theo vị trí nguồn để test và giao diện không đổi thứ tự ngẫu nhiên. Tách cấu trúc lỗi khỏi renderer cho terminal hoặc editor. Gợi ý sửa chỉ nên tự động áp dụng khi phạm vi thay đổi và ý nghĩa đủ chắc chắn; đoán thêm phép ép kiểu có thể che lỗi logic của chương trình."
        },
        {
          "title": "Phục hồi có điểm dừng và có kiểm thử",
          "text": "Ở parser, phục hồi thường tìm dấu chấm phẩy hoặc ngoặc đóng phù hợp để bắt đầu câu tiếp theo. Mỗi lần phục hồi phải tiêu thụ token hoặc kết thúc, nếu không dễ lặp vô hạn. Ở type checker, node lỗi cho phép tiếp tục duyệt các phần độc lập mà không bịa ra giá trị. Đặt hạn mức số thông báo và độ sâu để một đầu vào lỗi không chiếm hết tài nguyên. Kiểm thử hai lỗi độc lập, một lỗi lồng nhiều tầng và nhánh sau một nhánh lỗi. Số thông báo phản ánh nguyên nhân cần sửa, không phải số node bị ảnh hưởng."
        }
      ],
      "tip": "Cây có node lỗi vẫn hữu ích cho editor, nhưng không được đưa sang đường thực thi như một chương trình đã kiểm tra thành công.",
      "exercise": {
        "title": "Thu lỗi độc lập, bỏ lỗi dây chuyền",
        "instructions": "Hoàn thành infer cho Int, Bool, Invalid, Add và If. Invalid phát E_PARSE rồi trả Ty::Error. Duyệt cả hai toán hạng và cả hai nhánh dù phần trước đã lỗi.",
        "requirements": [
          "Add chỉ nhận Int; If có điều kiện Bool và hai nhánh cùng kiểu.",
          "Không phát E_ADD hay E_BRANCHES chỉ vì node con đã mang Ty::Error.",
          "Mọi trường hợp trả Ty::Error phải có lỗi được ghi nhận ở chính node đó hoặc trong cây con."
        ]
      },
      "starterCode": "#[derive(Debug, Clone, Copy, PartialEq, Eq)]\nenum Ty { Int, Bool, Error }\n\nenum Expr {\n    Int,\n    Bool,\n    Invalid,\n    Add(Box<Expr>, Box<Expr>),\n    If(Box<Expr>, Box<Expr>, Box<Expr>),\n}\n\nfn infer(expression: &Expr, errors: &mut Vec<&'static str>) -> Ty {\n    let _ = (expression, errors);\n    todo!(\"Suy ra kiểu và ghi lỗi độc lập\")\n}\n\nfn main() {\n    use Expr::*;\n    let valid = If(Box::new(Bool), Box::new(Int),\n        Box::new(Add(Box::new(Int), Box::new(Int))));\n    let mut clean = Vec::new();\n    let valid_ty = infer(&valid, &mut clean);\n    assert_eq!(valid_ty, Ty::Int);\n    assert!(clean.is_empty());\n\n    let two_errors = Add(\n        Box::new(Add(Box::new(Bool), Box::new(Int))),\n        Box::new(Add(Box::new(Int), Box::new(Bool))),\n    );\n    let mut errors = Vec::new();\n    assert_eq!(infer(&two_errors, &mut errors), Ty::Error);\n    assert_eq!(errors, vec![\"E_ADD\", \"E_ADD\"]);\n\n    let broken_if = If(\n        Box::new(Int), Box::new(Invalid),\n        Box::new(Add(Box::new(Bool), Box::new(Bool))),\n    );\n    let mut independent = Vec::new();\n    assert_eq!(infer(&broken_if, &mut independent), Ty::Error);\n    assert_eq!(independent, vec![\"E_CONDITION\", \"E_PARSE\", \"E_ADD\"]);\n\n    let mismatch = If(Box::new(Bool), Box::new(Int), Box::new(Bool));\n    let mut branch_errors = Vec::new();\n    assert_eq!(infer(&mismatch, &mut branch_errors), Ty::Error);\n    assert_eq!(branch_errors, vec![\"E_BRANCHES\"]);\n    println!(\"Kiểu: {valid_ty:?}\");\n    println!(\"Lỗi: {}\", errors.join(\", \"));\n}\n",
      "solutionCode": "#[derive(Debug, Clone, Copy, PartialEq, Eq)]\nenum Ty { Int, Bool, Error }\n\nenum Expr {\n    Int,\n    Bool,\n    Invalid,\n    Add(Box<Expr>, Box<Expr>),\n    If(Box<Expr>, Box<Expr>, Box<Expr>),\n}\n\nfn infer(expression: &Expr, errors: &mut Vec<&'static str>) -> Ty {\n    match expression {\n        Expr::Int => Ty::Int,\n        Expr::Bool => Ty::Bool,\n        Expr::Invalid => {\n            errors.push(\"E_PARSE\");\n            Ty::Error\n        }\n        Expr::Add(left, right) => {\n            let a = infer(left, errors);\n            let b = infer(right, errors);\n            if a == Ty::Error || b == Ty::Error {\n                Ty::Error\n            } else if a == Ty::Int && b == Ty::Int {\n                Ty::Int\n            } else {\n                errors.push(\"E_ADD\");\n                Ty::Error\n            }\n        }\n        Expr::If(condition, when_true, when_false) => {\n            let condition_ty = infer(condition, errors);\n            let condition_ok = condition_ty == Ty::Bool;\n            if condition_ty != Ty::Error && !condition_ok {\n                errors.push(\"E_CONDITION\");\n            }\n            let a = infer(when_true, errors);\n            let b = infer(when_false, errors);\n            if a == Ty::Error || b == Ty::Error {\n                Ty::Error\n            } else if a != b {\n                errors.push(\"E_BRANCHES\");\n                Ty::Error\n            } else if condition_ok {\n                a\n            } else {\n                Ty::Error\n            }\n        }\n    }\n}\n\nfn main() {\n    use Expr::*;\n    let valid = If(Box::new(Bool), Box::new(Int),\n        Box::new(Add(Box::new(Int), Box::new(Int))));\n    let mut clean = Vec::new();\n    let valid_ty = infer(&valid, &mut clean);\n    assert_eq!(valid_ty, Ty::Int);\n    assert!(clean.is_empty());\n\n    let two_errors = Add(\n        Box::new(Add(Box::new(Bool), Box::new(Int))),\n        Box::new(Add(Box::new(Int), Box::new(Bool))),\n    );\n    let mut errors = Vec::new();\n    assert_eq!(infer(&two_errors, &mut errors), Ty::Error);\n    assert_eq!(errors, vec![\"E_ADD\", \"E_ADD\"]);\n\n    let broken_if = If(\n        Box::new(Int), Box::new(Invalid),\n        Box::new(Add(Box::new(Bool), Box::new(Bool))),\n    );\n    let mut independent = Vec::new();\n    assert_eq!(infer(&broken_if, &mut independent), Ty::Error);\n    assert_eq!(independent, vec![\"E_CONDITION\", \"E_PARSE\", \"E_ADD\"]);\n\n    let mismatch = If(Box::new(Bool), Box::new(Int), Box::new(Bool));\n    let mut branch_errors = Vec::new();\n    assert_eq!(infer(&mismatch, &mut branch_errors), Ty::Error);\n    assert_eq!(branch_errors, vec![\"E_BRANCHES\"]);\n    println!(\"Kiểu: {valid_ty:?}\");\n    println!(\"Lỗi: {}\", errors.join(\", \"));\n}\n",
      "expectedOutput": "Kiểu: Int\nLỗi: E_ADD, E_ADD",
      "hints": [
        "Duyệt hai node con trước, sau đó mới xét loại kiểu của chúng.",
        "Với If, kiểm tra điều kiện và hai nhánh riêng để không bỏ sót lỗi.",
        "Nếu một nhánh có Ty::Error, không so sánh nó với kiểu của nhánh còn lại."
      ],
      "quiz": {
        "question": "Ty::Error từ một node con nên được hiểu như thế nào?",
        "options": [
          "Một kiểu chấp nhận mọi thao tác và cho phép chạy chương trình.",
          "Một biến kiểu sẽ luôn được suy ra thành Int.",
          "Dấu hiệu đã có lỗi; tiếp tục tìm lỗi độc lập nhưng không chấp nhận chương trình.",
          "Một giá trị runtime thay thế cho số 0."
        ],
        "correct": 2,
        "explanation": "Trạng thái lỗi hỗ trợ phục hồi chẩn đoán. Nó không làm chương trình trở nên hợp lệ và không thay thế bước kiểm tra trước lowering hoặc thực thi."
      },
      "reference": {
        "label": "Rust Compiler Development Guide · ErrorGuaranteed",
        "url": "https://rustc-dev-guide.rust-lang.org/diagnostics/error-guaranteed.html"
      }
    },
    {
      "id": "compiler-ir-execution",
      "moduleId": "track-compiler",
      "title": "Lowering, IR và máy thực thi",
      "description": "Chuyển AST sang chỉ thị đơn giản, giữ nguyên ngữ nghĩa và kiểm tra hợp đồng của bộ thực thi.",
      "duration": 55,
      "objectives": [
        "Đặt invariant cho từng biểu diễn trước và sau lowering.",
        "Thực thi IR dạng stack với checked arithmetic và giới hạn chỉ thị.",
        "So sánh interpreter AST với VM để tìm lỗi biến đổi."
      ],
      "sections": [
        {
          "title": "Mỗi biểu diễn phục vụ một công việc",
          "text": "AST thuận tiện khi giải thích cú pháp; bước thực thi thường dễ kiểm soát hơn với các thao tác nhỏ và rõ thứ tự. Lowering biến cây đã kiểm tra thành một biểu diễn trung gian, gọi là IR. Trong MiniLang, biểu thức 2 + 3 * 4 thành Push(2), Push(3), Push(4), Multiply, Add. Với mỗi node, hạ cây trái trước, cây phải sau rồi mới phát toán tử. Giữ span nguồn bên cạnh chỉ thị giúp lỗi runtime quay về biểu thức gốc. Việc chuyển biểu diễn phải có hợp đồng: tên đã resolve, kiểu hợp lệ và không còn node lỗi."
        },
        {
          "title": "Ngăn xếp có invariant đo được",
          "text": "Push tăng chiều cao stack một đơn vị; toán tử hai ngôi cần hai phần tử rồi thay chúng bằng một kết quả. Khi lấy ra, phần tử đầu tiên là toán hạng phải; đảo thứ tự sẽ làm sai phép trừ. Một chương trình biểu thức kết thúc thành công phải còn đúng một giá trị. Thiếu toán hạng, stack dư và overflow đều là lỗi có kiểu, không dùng panic làm luồng điều khiển. Giới hạn số chỉ thị đã chạy tạo điểm dừng rõ ràng. Khi thêm nhảy hoặc vòng lặp, kiểm tra cả đích nhảy và ngân sách tại mỗi bước, không chỉ độ dài mã.",
          "code": "// AST: Subtract(Number(7), Number(2))\n// IR:  Push(7), Push(2), Subtract\nlet mut stack = vec![7_i64, 2];\nlet right = stack.pop().unwrap();\nlet left = stack.pop().unwrap();\nassert_eq!(left.checked_sub(right), Some(5));"
        },
        {
          "title": "Tối ưu phải giữ cả kết quả lẫn lỗi",
          "text": "Gộp hằng số có vẻ đơn giản: thay 2 + 3 bằng 5. Nhưng nếu phép tính dùng số nguyên hữu hạn, một biểu thức có thể overflow; tối ưu không được làm mất lỗi đã được ngôn ngữ quy định. Tương tự, đổi thứ tự đánh giá có thể đổi tác dụng phụ hoặc lỗi xuất hiện đầu tiên. Định nghĩa ngữ nghĩa số học trước, rồi dùng cùng chính sách checked arithmetic trong evaluator và optimizer. Với các biểu thức nhỏ được tạo tự động, so sánh kết quả hoặc loại lỗi giữa interpreter AST và VM sau lowering để phát hiện biến đổi sai."
        },
        {
          "title": "Từ VM nhỏ đến cách đọc MIR",
          "text": "IR dạng stack của bài phù hợp để học thứ tự đánh giá nhưng không phải MIR của Rust. MIR dùng các basic block, local và terminator để biểu diễn luồng điều khiển; kiểu được làm rõ và biểu thức được đơn giản hóa. Cách biểu diễn đó hỗ trợ phân tích dữ liệu, borrow checking và các phép biến đổi. Khi đọc một block, hãy theo dõi nơi giá trị được tạo, dùng và đường đi đến block tiếp theo. Dự án cuối yêu cầu một verifier cho IR của chính bạn; hiểu và kiểm tra invariant quan trọng hơn đặt tên các bước giống một compiler lớn."
        }
      ],
      "tip": "Phép trừ là test tốt cho lowering: cộng và nhân có thể che lỗi đảo hai toán hạng.",
      "exercise": {
        "title": "Máy stack kiểm soát đường lỗi",
        "instructions": "Hoàn thành run cho Push và ba toán tử hai ngôi. Mỗi chỉ thị tiêu tốn một đơn vị ngân sách; chỉ trả kết quả khi stack còn đúng một phần tử.",
        "requirements": [
          "Pop toán hạng phải trước, trái sau.",
          "Dùng checked_add, checked_sub và checked_mul.",
          "Trả đúng lỗi Underflow, Overflow, FinalStack hoặc Budget cho các ca kiểm thử."
        ]
      },
      "starterCode": "#[derive(Clone, Copy)]\nenum Op { Add, Subtract, Multiply }\n\n#[derive(Clone, Copy)]\nenum Instruction { Push(i64), Binary(Op) }\n\n#[derive(Debug, PartialEq, Eq)]\nenum VmError { Underflow, Overflow, FinalStack, Budget }\n\nfn run(code: &[Instruction], budget: usize) -> Result<i64, VmError> {\n    let _ = (code, budget);\n    todo!(\"Thực thi chỉ thị và kiểm tra invariant\")\n}\n\nfn main() {\n    use Instruction::{Binary, Push};\n    let expression = [Push(2), Push(3), Push(4), Binary(Op::Multiply), Binary(Op::Add)];\n    let subtract = [Push(7), Push(2), Binary(Op::Subtract)];\n    let overflow = [Push(i64::MAX), Push(1), Binary(Op::Add)];\n    assert_eq!(run(&expression, 5), Ok(14));\n    assert_eq!(run(&subtract, 3), Ok(5));\n    assert_eq!(run(&overflow, 3), Err(VmError::Overflow));\n    assert_eq!(run(&[Push(i64::MAX), Push(2), Binary(Op::Multiply)], 3),\n        Err(VmError::Overflow));\n    assert_eq!(run(&[Binary(Op::Add)], 1), Err(VmError::Underflow));\n    assert_eq!(run(&[Push(1), Push(2)], 2), Err(VmError::FinalStack));\n    assert_eq!(run(&[], 1), Err(VmError::FinalStack));\n    assert_eq!(run(&expression, 4), Err(VmError::Budget));\n    assert_eq!(run(&[Push(1)], 0), Err(VmError::Budget));\n    println!(\"Giá trị: {}\", run(&expression, 5).unwrap());\n    println!(\"Trừ đúng thứ tự: {}\", run(&subtract, 3).unwrap());\n    println!(\"Chặn overflow: {}\", run(&overflow, 3) == Err(VmError::Overflow));\n}\n",
      "solutionCode": "#[derive(Clone, Copy)]\nenum Op { Add, Subtract, Multiply }\n\n#[derive(Clone, Copy)]\nenum Instruction { Push(i64), Binary(Op) }\n\n#[derive(Debug, PartialEq, Eq)]\nenum VmError { Underflow, Overflow, FinalStack, Budget }\n\nfn run(code: &[Instruction], budget: usize) -> Result<i64, VmError> {\n    let mut stack: Vec<i64> = Vec::new();\n    for (step, instruction) in code.iter().enumerate() {\n        if step >= budget {\n            return Err(VmError::Budget);\n        }\n        match *instruction {\n            Instruction::Push(value) => stack.push(value),\n            Instruction::Binary(op) => {\n                let right = stack.pop().ok_or(VmError::Underflow)?;\n                let left = stack.pop().ok_or(VmError::Underflow)?;\n                let value = match op {\n                    Op::Add => left.checked_add(right),\n                    Op::Subtract => left.checked_sub(right),\n                    Op::Multiply => left.checked_mul(right),\n                }.ok_or(VmError::Overflow)?;\n                stack.push(value);\n            }\n        }\n    }\n    if stack.len() != 1 {\n        return Err(VmError::FinalStack);\n    }\n    stack.pop().ok_or(VmError::FinalStack)\n}\n\nfn main() {\n    use Instruction::{Binary, Push};\n    let expression = [Push(2), Push(3), Push(4), Binary(Op::Multiply), Binary(Op::Add)];\n    let subtract = [Push(7), Push(2), Binary(Op::Subtract)];\n    let overflow = [Push(i64::MAX), Push(1), Binary(Op::Add)];\n    assert_eq!(run(&expression, 5), Ok(14));\n    assert_eq!(run(&subtract, 3), Ok(5));\n    assert_eq!(run(&overflow, 3), Err(VmError::Overflow));\n    assert_eq!(run(&[Push(i64::MAX), Push(2), Binary(Op::Multiply)], 3),\n        Err(VmError::Overflow));\n    assert_eq!(run(&[Binary(Op::Add)], 1), Err(VmError::Underflow));\n    assert_eq!(run(&[Push(1), Push(2)], 2), Err(VmError::FinalStack));\n    assert_eq!(run(&[], 1), Err(VmError::FinalStack));\n    assert_eq!(run(&expression, 4), Err(VmError::Budget));\n    assert_eq!(run(&[Push(1)], 0), Err(VmError::Budget));\n    println!(\"Giá trị: {}\", run(&expression, 5).unwrap());\n    println!(\"Trừ đúng thứ tự: {}\", run(&subtract, 3).unwrap());\n    println!(\"Chặn overflow: {}\", run(&overflow, 3) == Err(VmError::Overflow));\n}\n",
      "expectedOutput": "Giá trị: 14\nTrừ đúng thứ tự: 5\nChặn overflow: true",
      "hints": [
        "Dùng enumerate để đếm số chỉ thị đã thực hiện.",
        "Không gọi unwrap trên stack của chương trình đầu vào.",
        "Kiểm tra chiều cao stack sau khi chạy xong, kể cả mã rỗng."
      ],
      "quiz": {
        "question": "VM đã tính đúng chương trình hợp lệ. Vì sao vẫn cần kiểm tra stack cuối còn đúng một giá trị?",
        "options": [
          "Để mọi chương trình luôn dùng hết bộ nhớ.",
          "Để phát hiện IR rỗng hoặc dư toán hạng dù chưa gặp underflow.",
          "Để thay thế kiểm tra kiểu cho mọi ngôn ngữ.",
          "Vì Rust không cho Vec chứa hai số nguyên."
        ],
        "correct": 1,
        "explanation": "Không gặp underflow chưa chứng minh IR biểu diễn đúng một biểu thức. Stack rỗng hoặc có nhiều kết quả vi phạm hợp đồng đầu ra của VM."
      },
      "reference": {
        "label": "Rust Compiler Development Guide · MIR",
        "url": "https://rustc-dev-guide.rust-lang.org/mir/index.html"
      }
    },
    {
      "id": "compiler-incremental-tools",
      "moduleId": "track-compiler",
      "title": "Phân tích tăng dần, LSP và kiến trúc rustc",
      "description": "Giữ kết quả đúng phiên bản tài liệu, chuyển vị trí cho editor và đọc các lớp biểu diễn của compiler Rust.",
      "duration": 60,
      "objectives": [
        "Thiết kế cache theo dependency và phiên bản đầu vào.",
        "Chuyển span UTF-8 sang vị trí UTF-16 đúng với emoji và xuống dòng.",
        "Phân biệt pipeline MiniLang, kiến trúc rustc và adapter LSP."
      ],
      "sections": [
        {
          "title": "Đọc kiến trúc rustc theo câu hỏi cần trả lời",
          "text": "Các bài trước tách lexer, parser, resolver, type checker và bộ thực thi để quan sát dễ dàng. Khi đọc rustc, hãy nhận diện thêm AST, HIR, THIR và MIR: mỗi biểu diễn làm rõ những thông tin cần cho bước phân tích tiếp theo. Nhiều công việc được tổ chức thành query gọi nhau theo nhu cầu, không chỉ một danh sách pass chạy thẳng từ đầu đến cuối. Bắt đầu từ một câu hỏi cụ thể như kiểu của biểu thức được tìm ở đâu, rồi lần theo đầu vào và đầu ra. MiniLang giúp luyện phương pháp đọc, chưa tái hiện compiler Rust."
        },
        {
          "title": "Cache phải biết nó phụ thuộc vào gì",
          "text": "Cache theo đường dẫn tệp sẽ sai ngay khi nội dung đổi. Cache theo nội dung cũng chưa đủ nếu kết quả phụ thuộc tệp được import, cấu hình hoặc phiên bản ngữ nghĩa. Ghi lại dependency của phép phân tích và vô hiệu hóa kết quả khi một đầu vào liên quan thay đổi. Sau khi tính lại, đầu vào đổi nhưng kết quả có thể vẫn giống trước; đây là cơ hội tránh tính lại các bước phụ thuộc. Bắt đầu bằng cache một tệp có key rõ ràng và test thay đổi input. Chỉ tăng độ phức tạp khi số đo cho thấy cần thiết."
        },
        {
          "title": "Phân tích một snapshot, công bố đúng phiên bản",
          "text": "Editor có thể gửi bản sửa mới trong lúc lần phân tích cũ còn chạy. Mỗi tác vụ cần giữ snapshot nội dung cùng version; trước khi công bố diagnostic, so version với tài liệu hiện tại. Nếu không khớp, bỏ kết quả cũ và dùng tác vụ mới. Hủy tác vụ giúp tiết kiệm tài nguyên nhưng không thay thế bước kiểm tra version, vì kết quả có thể hoàn tất ngay trước tín hiệu hủy. Với nhiều tệp, snapshot cần nhất quán cả tập dependency. Cây cú pháp chưa hoàn chỉnh vẫn nên hỗ trợ tô sáng hoặc điều hướng có giới hạn."
        },
        {
          "title": "Byte, ký tự và cột của LSP",
          "text": "LSP chuẩn hóa giao tiếp giữa editor và language server. Với giao thức 3.17, hai phía có thể thương lượng encoding vị trí; UTF-16 là lựa chọn tương thích mặc định. Một emoji chiếm hai code unit UTF-16 dù là một Unicode scalar, nên không thể dùng số byte hoặc chars().count() làm cột. Bài tập chuyển offset byte sang dòng và cột bắt đầu từ không, xử lý LF, CRLF và CR. Vị trí giữa CR và LF bị từ chối. Khi gửi range, chuyển cả start lẫn end trên đúng snapshot và encoding đã thỏa thuận.",
          "code": "let prefix = \"a🦀\";\nassert_eq!(prefix.len(), 5);                 // UTF-8 bytes\nassert_eq!(prefix.chars().count(), 2);       // Unicode scalars\nassert_eq!(prefix.encode_utf16().count(), 3); // UTF-16 code units"
        },
        {
          "title": "Đo độ trễ cùng tính đúng",
          "text": "Một công cụ IDE hữu ích phải xử lý được thao tác gõ liên tiếp, lỗi tạm thời và phản hồi đến sai thứ tự. Viết test mở tài liệu, sửa hai lần, hoàn tất tác vụ cũ sau tác vụ mới rồi xác nhận diagnostic cũ không xuất hiện. Đo thời gian parse, resolve và kiểm tra kiểu riêng trên cùng bộ tệp mẫu để biết khâu cần tối ưu. Thêm fixture tiếng Việt, emoji và CRLF vào bộ kiểm thử vị trí. Giữ lõi phân tích độc lập với transport; adapter LSP chỉ đồng bộ tài liệu và chuyển yêu cầu, kết quả."
        }
      ],
      "tip": "Trong editor, một span đúng trên văn bản cũ vẫn là span sai nếu đem áp dụng vào văn bản mới.",
      "exercise": {
        "title": "Đổi offset byte sang vị trí UTF-16",
        "instructions": "Hoàn thành position_utf16. Trả None nếu offset vượt nguồn, cắt giữa UTF-8 hoặc nằm giữa CR và LF. Kết quả là (dòng, cột UTF-16), bắt đầu từ 0.",
        "requirements": [
          "Emoji tính hai code unit UTF-16, chữ tiếng Việt theo encode_utf16.",
          "LF, CRLF và CR đều tạo một lần xuống dòng.",
          "Offset cuối nguồn và nguồn rỗng hợp lệ."
        ]
      },
      "starterCode": "fn position_utf16(text: &str, byte_offset: usize) -> Option<(usize, usize)> {\n    let _ = (text, byte_offset);\n    todo!(\"Đếm dòng và code unit trên các ranh giới hợp lệ\")\n}\n\nfn main() {\n    let text = \"a🦀b\\r\\nbiến\\n\";\n    let b = position_utf16(text, text.find('b').unwrap()).unwrap();\n    let accent = position_utf16(text, text.find('ế').unwrap()).unwrap();\n    assert_eq!(b, (0, 3));\n    assert_eq!(accent, (1, 2));\n    assert_eq!(position_utf16(text, 2), None);\n    assert_eq!(position_utf16(text, text.find('\\n').unwrap()), None);\n    assert_eq!(position_utf16(text, text.len()), Some((2, 0)));\n    assert_eq!(position_utf16(text, text.len() + 1), None);\n    assert_eq!(position_utf16(\"\", 0), Some((0, 0)));\n    assert_eq!(position_utf16(\"x\\ry\", 2), Some((1, 0)));\n    assert_eq!(position_utf16(\"é\", 1), None);\n    println!(\"b: dòng {}, cột {}\", b.0, b.1);\n    println!(\"ế: dòng {}, cột {}\", accent.0, accent.1);\n}\n",
      "solutionCode": "fn position_utf16(text: &str, byte_offset: usize) -> Option<(usize, usize)> {\n    text.get(..byte_offset)?;\n    let mut chars = text.char_indices().peekable();\n    let (mut line, mut column) = (0, 0);\n    while let Some((offset, ch)) = chars.next() {\n        if offset == byte_offset {\n            return Some((line, column));\n        }\n        match ch {\n            '\\r' => {\n                if let Some(&(next, '\\n')) = chars.peek() {\n                    if byte_offset == next {\n                        return None;\n                    }\n                    chars.next();\n                }\n                line += 1;\n                column = 0;\n            }\n            '\\n' => {\n                line += 1;\n                column = 0;\n            }\n            _ => column += ch.len_utf16(),\n        }\n    }\n    Some((line, column))\n}\n\nfn main() {\n    let text = \"a🦀b\\r\\nbiến\\n\";\n    let b = position_utf16(text, text.find('b').unwrap()).unwrap();\n    let accent = position_utf16(text, text.find('ế').unwrap()).unwrap();\n    assert_eq!(b, (0, 3));\n    assert_eq!(accent, (1, 2));\n    assert_eq!(position_utf16(text, 2), None);\n    assert_eq!(position_utf16(text, text.find('\\n').unwrap()), None);\n    assert_eq!(position_utf16(text, text.len()), Some((2, 0)));\n    assert_eq!(position_utf16(text, text.len() + 1), None);\n    assert_eq!(position_utf16(\"\", 0), Some((0, 0)));\n    assert_eq!(position_utf16(\"x\\ry\", 2), Some((1, 0)));\n    assert_eq!(position_utf16(\"é\", 1), None);\n    println!(\"b: dòng {}, cột {}\", b.0, b.1);\n    println!(\"ế: dòng {}, cột {}\", accent.0, accent.1);\n}\n",
      "expectedOutput": "b: dòng 0, cột 3\nế: dòng 1, cột 2",
      "hints": [
        "text.get(..byte_offset)? kiểm tra giới hạn và ranh giới UTF-8.",
        "Duyệt char_indices; gặp đúng byte_offset thì trả vị trí đang có.",
        "Với CRLF, tiêu thụ cả cặp nhưng chỉ tăng dòng một lần; cột dùng ch.len_utf16()."
      ],
      "quiz": {
        "question": "Tác vụ kiểm tra version 7 hoàn tất sau khi editor đã chuyển sang version 8. Nên công bố diagnostic thế nào?",
        "options": [
          "Công bố ngay vì tác vụ vừa kết thúc.",
          "Đổi nhãn version thành 8 rồi giữ nguyên các span.",
          "Bỏ kết quả version 7 và dùng kết quả tính từ snapshot hiện tại.",
          "Dịch tất cả span thêm một byte."
        ],
        "correct": 2,
        "explanation": "Kết quả gắn với snapshot đã phân tích. Không thể sửa version hoặc dịch span tùy ý để biến kết quả cũ thành kết quả đúng của tài liệu mới."
      },
      "reference": {
        "label": "Language Server Protocol · Đặc tả 3.17",
        "url": "https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/"
      }
    }
  ]
};
