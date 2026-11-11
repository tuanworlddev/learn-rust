import type { TrackExpansion } from "../../specialization-types";

export const compilerExpansion: TrackExpansion = {
  "chapters": [
    {
      "id": "compiler-ch1",
      "title": "Ngôn ngữ, token và vị trí nguồn",
      "description": "Đặc tả grammar/semantics và giữ source spans chính xác.",
      "lessonIds": [
        "compiler-language-spec",
        "compiler-lexer-spans",
        "compiler-source-map"
      ],
      "outcomes": [
        "Viết đặc tả DSL cùng fixture âm.",
        "Chuyển byte span sang vị trí Unicode đúng consumer."
      ]
    },
    {
      "id": "compiler-ch2",
      "title": "Parser và frontend hoàn chỉnh",
      "description": "Từ precedence đến diagnostic và công thức nghiệp vụ.",
      "lessonIds": [
        "compiler-parser-precedence",
        "compiler-error-recovery",
        "compiler-expression-project"
      ],
      "outcomes": [
        "Xây AST đúng associativity, budget và recovery.",
        "Bàn giao compiler biểu thức với CLI/test thật."
      ]
    },
    {
      "id": "compiler-ch3",
      "title": "Tên và hệ kiểu",
      "description": "Liên kết định nghĩa, thêm constraints và hạn chế lỗi dây chuyền.",
      "lessonIds": [
        "compiler-name-resolution",
        "compiler-type-diagnostics",
        "compiler-type-inference"
      ],
      "outcomes": [
        "Giải tên theo scope và giữ symbol identity.",
        "Kiểm tra/infer kiểu với lỗi có nguồn gốc."
      ]
    },
    {
      "id": "compiler-ch4",
      "title": "IR và phân tích chương trình",
      "description": "Hạ xuống control flow và tính thuộc tính trên nhiều đường đi.",
      "lessonIds": [
        "compiler-ir-execution",
        "compiler-control-flow",
        "compiler-dataflow"
      ],
      "outcomes": [
        "Xây/validate CFG và phân biệt termination.",
        "Dùng must/may analysis với phép gộp đúng."
      ]
    },
    {
      "id": "compiler-ch5",
      "title": "Bytecode, tối ưu và runtime",
      "description": "Artifact có version, verifier riêng và máy ảo có budget.",
      "lessonIds": [
        "compiler-bytecode-format",
        "compiler-optimizer-correctness",
        "compiler-vm-project"
      ],
      "outcomes": [
        "Giải mã phòng thủ và kiểm tra typed stack.",
        "Bảo toàn semantics của optimization, giới hạn runtime."
      ]
    },
    {
      "id": "compiler-ch6",
      "title": "Công cụ editor và nghiệm thu",
      "description": "Tích hợp snapshot, test compiler và LSP transport.",
      "lessonIds": [
        "compiler-incremental-tools",
        "compiler-testing-fuzzing",
        "compiler-tooling-project"
      ],
      "outcomes": [
        "Gắn diagnostic với snapshot/version đúng.",
        "Bàn giao language tool có protocol và regression tests."
      ]
    }
  ],
  "lessons": [
    {
      "id": "compiler-language-spec",
      "title": "Đặc tả một ngôn ngữ trước khi viết compiler",
      "description": "Xác định cú pháp, ý nghĩa, lỗi và phạm vi thực thi của một DSL có thể kiểm thử.",
      "objectives": [
        "Tách grammar khỏi semantics.",
        "Viết quy tắc số học và tên biến rõ ràng.",
        "Biến đặc tả thành fixture hợp lệ và không hợp lệ."
      ],
      "sections": [
        {
          "title": "Compiler phục vụ một ngôn ngữ cụ thể",
          "text": "Trước khi viết lexer, hãy xác định người dùng ngôn ngữ và công việc họ cần làm. Một DSL tính phí vận chuyển cần biểu thức số, biến đầu vào và quy tắc lỗi; nó không cần toàn bộ cú pháp Rust. Ghi ví dụ subtotal + shipping * 2, kết quả mong đợi và nguồn giá trị của từng biến. Sau đó viết các trường hợp không hợp lệ như tên chưa khai báo hoặc dấu ngoặc thiếu. Phạm vi nhỏ nhưng chính xác giúp dự án có thể hoàn thành và kiểm chứng. Gọi một DSL nhỏ là compiler Rust đầy đủ sẽ che những phần ngôn ngữ chưa được triển khai."
        },
        {
          "title": "Grammar chỉ mô tả hình dạng",
          "text": "Grammar quyết định chuỗi token nào tạo thành chương trình, như expression gồm term và các toán tử cộng trừ. Semantics quyết định ý nghĩa: số nguyên có miền nào, phép chia làm tròn ra sao, overflow trả lỗi hay wrap, thứ tự đánh giá các toán hạng thế nào. Hai ngôn ngữ có thể dùng cùng cú pháp nhưng semantics khác nhau. Với DSL của khóa, dùng i64 và checked arithmetic để lỗi overflow được biểu diễn rõ. Nếu thêm short-circuit boolean, phải quy định vế phải có được đánh giá khi vế trái đã quyết định kết quả hay không, vì điều đó ảnh hưởng cả lỗi và side effect."
        },
        {
          "title": "Pipeline là các hợp đồng trung gian",
          "text": "Lexer chuyển source thành token có span; parser tạo AST; name resolution liên kết tên với định nghĩa; type checker loại chương trình sai kiểu; lowering tạo biểu diễn phù hợp thực thi. Một dự án nhỏ có thể gộp vài bước, nhưng cần hiểu dữ liệu và invariant đi qua mỗi ranh giới. Chẳng hạn parser chưa có nhiệm vụ quyết định biến x tồn tại trong scope nào. Giữ các lỗi dưới dạng dữ liệu với code, message và span cho phép CLI và editor dùng cùng kết quả. Không in lỗi rải rác ở mọi giai đoạn rồi buộc công cụ khác parse lại văn bản terminal."
        },
        {
          "title": "Đặc tả sống cùng bộ kiểm thử",
          "text": "Tạo bảng gồm chương trình, AST hoặc output mong đợi và lỗi mong đợi. Bao phủ precedence, associativity, ngoặc, số biên, tên lạ và input kết thúc bất ngờ. Khi thêm cú pháp, sửa đặc tả và fixture trước hoặc cùng lúc với parser. Đừng dùng compiler hiện có làm oracle cho một semantics bạn đã định nghĩa khác. Bài tập kiểm tra phép chia của DSL, gồm zero và trường hợp i64 nhỏ nhất chia âm một. Quy tắc được viết thành Result để native test và máy ảo sau này dùng cùng nghĩa. Đây là nền tảng để tối ưu mà vẫn biết chính xác hành vi nào phải được giữ."
        }
      ],
      "tip": "Cú pháp, semantics và thông báo lỗi đều là giao diện của ngôn ngữ; hãy version chúng có chủ đích.",
      "exercise": {
        "title": "Phép chia theo semantics DSL",
        "instructions": "Chia i64 theo checked_div; phân biệt zero và overflow, trả kết quả nguyên như Rust cho các trường hợp hợp lệ.",
        "requirements": [
          "MIN/-1 trả overflow.",
          "Chia 0 trả zero trước.",
          "Số âm theo chia làm tròn về 0."
        ]
      },
      "expectedOutput": "Semantics số học được kiểm tra rõ",
      "hints": [
        "Tách right==0 khỏi checked_div.",
        "Không dùng / trực tiếp với MIN/-1."
      ],
      "quiz": {
        "question": "Grammar cho phép a/b có đủ để biết chia cho 0 sẽ làm gì không?",
        "options": [
          "Không; đó là quy tắc semantics cần đặc tả.",
          "Có, mọi ngôn ngữ giống nhau.",
          "Có nếu parser dùng enum."
        ],
        "correct": 0,
        "explanation": "Grammar quyết định cấu trúc hợp lệ; semantics quyết định hành vi và lỗi khi thực thi."
      },
      "reference": {
        "label": "Rust compiler overview",
        "url": "https://rustc-dev-guide.rust-lang.org/overview.html"
      },
      "moduleId": "track-compiler",
      "duration": 35,
      "starterCode": "\nfn divide(left: i64, right: i64) -> Result<i64, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(divide(7,2),Ok(3));\n    assert_eq!(divide(-7,2),Ok(-3));\n    assert_eq!(divide(2,0),Err(\"zero\"));\n    assert_eq!(divide(i64::MIN,-1),Err(\"overflow\"));\n    println!(\"Semantics số học được kiểm tra rõ\");\n}",
      "solutionCode": "\nfn divide(left: i64, right: i64) -> Result<i64, &'static str> {\n    if right == 0 { return Err(\"zero\"); }\n    left.checked_div(right).ok_or(\"overflow\")\n}\nfn main() {\n    assert_eq!(divide(7,2),Ok(3));\n    assert_eq!(divide(-7,2),Ok(-3));\n    assert_eq!(divide(2,0),Err(\"zero\"));\n    assert_eq!(divide(i64::MIN,-1),Err(\"overflow\"));\n    println!(\"Semantics số học được kiểm tra rõ\");\n}"
    },
    {
      "id": "compiler-source-map",
      "title": "Source map, span và vị trí Unicode",
      "description": "Giữ vị trí nguồn chính xác qua token, AST và giao thức editor.",
      "objectives": [
        "Biểu diễn span dạng khoảng byte nửa mở.",
        "Chuyển vị trí sang dòng/cột UTF-16 khi cần.",
        "Gắn chẩn đoán với đúng phiên bản source."
      ],
      "sections": [
        {
          "title": "Span là một tham chiếu vào source",
          "text": "Một span thường gồm file ID, vị trí bắt đầu và kết thúc theo khoảng nửa mở: start bao gồm, end không bao gồm. Với String Rust, dùng byte offset phù hợp slicing và char_indices, nhưng các offset phải nằm ở ranh giới UTF-8 hợp lệ. Không lấy chỉ số ký tự rồi dùng trực tiếp làm index byte. Lexer nên giữ source gốc cùng tokens có span thay vì clone mọi lexeme. AST giữ span của cấu trúc và các phần quan trọng như toán tử để lỗi overflow hay sai kiểu có thể chỉ đúng nơi. EOF cũng có span rỗng hợp lệ ở cuối source."
        },
        {
          "title": "Dòng và cột có nhiều đơn vị",
          "text": "Terminal có thể dùng cột hiển thị, compiler dùng byte offset, còn giao thức editor có thể dùng UTF-16 code units theo vị trí đã thương lượng. Một emoji thường chiếm hai UTF-16 units và nhiều bytes UTF-8; ký tự có dấu còn có nhiều cách biểu diễn Unicode. Không giả định một char bằng một cột hiển thị hoặc một UTF-16 unit. Source map cần chuyển đổi theo hợp đồng của consumer. Với LSP, chọn encoding được hỗ trợ và công bố trong initialize; nếu dùng UTF-16, tính bằng encode_utf16 trên đoạn source trong dòng thay vì đếm bytes."
        },
        {
          "title": "Dữ liệu nguồn cần cùng phiên bản",
          "text": "Một diagnostic đúng cho source version 7 có thể trỏ sai hoàn toàn sau khi người dùng chèn dòng ở version 8. Gắn kết quả phân tích với snapshot bất biến của source và chỉ publish nếu nó còn phù hợp trạng thái document. Nếu xử lý async, giữ document URI cùng version trong công việc và kiểm tra trước khi trả kết quả. ID node tăng dần theo thứ tự parse tiện cho một lần compile nhưng không tự ổn định giữa các lần sửa. Tính incremental cần cách nhận diện và dependency riêng, không thể suy ra chỉ từ việc AST có trường id."
        },
        {
          "title": "Kiểm thử vị trí trước khi trang trí lỗi",
          "text": "Dùng fixture gồm ASCII, tiếng Việt, emoji, CRLF, dòng rỗng và EOF. Kiểm tra rằng slice của span đúng lexeme, rồi kiểm tra chuyển sang vị trí editor. Với byte offset nằm giữa một ký tự UTF-8, hàm chuyển đổi phải trả lỗi thay vì panic hoặc tự đoán. Bài tập chuyển offset sang dòng và cột UTF-16 từ đầu source. Cách đơn giản quét prefix phù hợp lab; sản phẩm lớn nên có bảng line starts để tìm dòng nhanh, cache theo snapshot và đo chi phí. Độ chính xác của source map cần được đảm bảo trước khi thêm màu sắc hoặc gợi ý sửa lỗi đẹp mắt."
        }
      ],
      "tip": "Luôn ghi đơn vị của cột: byte, Unicode scalar, UTF-16 hay cột hiển thị là các khái niệm khác nhau.",
      "exercise": {
        "title": "Byte offset sang vị trí UTF-16",
        "instructions": "Trả (line,column) bắt đầu từ 0 cho byte offset hợp lệ; lỗi nếu ngoài source hoặc giữa ký tự.",
        "requirements": [
          "Emoji tính hai UTF-16 units.",
          "Sau newline cột bắt đầu lại 0.",
          "Offset EOF hợp lệ."
        ]
      },
      "expectedOutput": "Vị trí editor giữ đúng Unicode",
      "hints": [
        "str::get kiểm tra biên UTF-8 an toàn.",
        "encode_utf16().count() khác chars().count()."
      ],
      "quiz": {
        "question": "Offset byte của emoji có dùng nguyên làm cột UTF-16 trong LSP không?",
        "options": [
          "Có vì đều dùng Unicode.",
          "Không; cần chuyển theo encoding của protocol.",
          "Có nếu offset là usize."
        ],
        "correct": 1,
        "explanation": "UTF-8 bytes và UTF-16 code units khác nhau. Source map cần chuyển đúng đơn vị và snapshot."
      },
      "reference": {
        "label": "LSP specification",
        "url": "https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/"
      },
      "moduleId": "track-compiler",
      "duration": 35,
      "starterCode": "\nfn position(source: &str, offset: usize) -> Result<(usize, usize), &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(position(\"a😃b\",5),Ok((0,3)));\n    assert_eq!(position(\"a😃b\",2),Err(\"offset\"));\n    assert_eq!(position(\"a\\nb\",3),Ok((1,1)));\n    assert_eq!(position(\"\",0),Ok((0,0)));\n    assert_eq!(position(\"x\",2),Err(\"offset\"));\n    println!(\"Vị trí editor giữ đúng Unicode\");\n}",
      "solutionCode": "\nfn position(source: &str, offset: usize) -> Result<(usize, usize), &'static str> {\n    let prefix = source.get(..offset).ok_or(\"offset\")?;\n    let line = prefix.bytes().filter(|&b| b == b'\\n').count();\n    let tail = prefix.rsplit('\\n').next().unwrap_or(\"\");\n    Ok((line, tail.encode_utf16().count()))\n}\nfn main() {\n    assert_eq!(position(\"a😃b\",5),Ok((0,3)));\n    assert_eq!(position(\"a😃b\",2),Err(\"offset\"));\n    assert_eq!(position(\"a\\nb\",3),Ok((1,1)));\n    assert_eq!(position(\"\",0),Ok((0,0)));\n    assert_eq!(position(\"x\",2),Err(\"offset\"));\n    println!(\"Vị trí editor giữ đúng Unicode\");\n}"
    },
    {
      "id": "compiler-error-recovery",
      "title": "Parser phục hồi lỗi và bảo đảm tiến triển",
      "description": "Tiếp tục phân tích có kiểm soát để báo nhiều lỗi mà không tạo vòng lặp hoặc chẩn đoán dây chuyền.",
      "objectives": [
        "Chọn điểm đồng bộ phù hợp grammar.",
        "Giữ token lỗi và missing node có ý nghĩa.",
        "Bảo đảm mỗi bước tiến con trỏ hoặc kết thúc."
      ],
      "sections": [
        {
          "title": "Báo lỗi đầu tiên và phục hồi là hai mức",
          "text": "Một parser batch nhỏ có thể trả lỗi đầu tiên, phù hợp công cụ tính biểu thức đơn giản. Editor lại thường cần cây cú pháp ngay khi người dùng đang gõ dở và muốn thấy nhiều lỗi hữu ích. Error recovery cho phép parser bỏ qua hoặc chèn cấu trúc còn thiếu theo quy tắc, rồi tiếp tục. Nhưng phục hồi không có nghĩa coi source sai là hợp lệ. Diagnostic phải được giữ cùng cây, và giai đoạn thực thi không được chạy một chương trình có lỗi nghiêm trọng chỉ vì parser đã tạo được node. Hợp đồng giữa parser và bước sau cần phân biệt cây đầy đủ với cây có vùng lỗi."
        },
        {
          "title": "Điểm đồng bộ xuất phát từ grammar",
          "text": "Với ngôn ngữ câu lệnh kết thúc bằng dấu chấm phẩy, parser có thể bỏ token đến dấu chấm phẩy hoặc dấu đóng block khi gặp lỗi trong một statement. Trong danh sách tham số, dấu phẩy và ngoặc đóng có thể phù hợp hơn. Dùng một tập đồng bộ duy nhất cho mọi context dễ nuốt mất cấu trúc lồng nhau hoặc tạo thêm hàng loạt lỗi giả. Khi bỏ qua token, cân nhắc độ sâu ngoặc để không dừng ở dấu phân cách bên trong biểu thức con. Ghi span của vùng bị bỏ để editor vẫn có thể tô màu hoặc giữ vị trí của source lỗi."
        },
        {
          "title": "Bất biến tiến triển ngăn vòng lặp",
          "text": "Nếu một nhánh gặp token lạ, tạo diagnostic rồi gọi lại chính parser ở cùng vị trí, chương trình có thể lặp vô hạn. Mỗi vòng parse phải tiêu thụ ít nhất một token, trả node kết thúc hoặc trả lỗi cho caller xử lý. Missing token có thể được biểu diễn bằng span rỗng, nhưng cần giới hạn số lần chèn tại một vị trí. Đặt budget độ sâu và số diagnostic để input đối kháng không gây stack overflow hoặc hàng triệu thông báo. Đây là yêu cầu vận hành của parser, không chỉ là chuyện thông báo lỗi đẹp hơn."
        },
        {
          "title": "Kiểm thử bằng input chưa hoàn thành",
          "text": "Fixture nên có thiếu ngoặc, toán tử cuối dòng, hai delimiter liên tiếp, token lạ và EOF ở từng vị trí. Kiểm tra không panic, parser kết thúc trong budget và diagnostic chính vẫn trỏ lỗi gốc. Sau phục hồi, thêm một statement hợp lệ để xác nhận parser tìm lại đúng ranh giới. Bài tập tìm điểm đồng bộ tiếp theo ở dấu chấm phẩy với con trỏ luôn tiến; phiên bản đơn giản không xử lý ngoặc lồng và phải ghi rõ phạm vi. Dự án editor cuối khóa bắt đầu bằng diagnostic lỗi đầu tiên, rồi yêu cầu mở rộng recovery có bộ fixture riêng thay vì giả định công cụ đã đạt chất lượng IDE chỉ vì có LSP transport."
        }
      ],
      "tip": "Mỗi vòng parse cần tiêu thụ token hoặc kết thúc; diagnostic không thay thế tiến triển con trỏ.",
      "exercise": {
        "title": "Đồng bộ sau statement lỗi",
        "instructions": "Từ start hợp lệ, tiến đến sau dấu ; đầu tiên hoặc EOF. Nếu start ngoài len trả lỗi; nếu start==len trả len.",
        "requirements": [
          "Khi còn token, kết quả luôn lớn hơn start.",
          "Không lặp ở token gây lỗi.",
          "Không vượt len."
        ]
      },
      "expectedOutput": "Phục hồi luôn tiến về ranh giới tiếp theo",
      "hints": [
        "Tăng cursor trước khi xét dừng ở ;.",
        "EOF là điểm dừng hợp lệ."
      ],
      "quiz": {
        "question": "Parser gặp token lạ, ghi lỗi rồi lặp lại tại đúng vị trí cũ có nguy cơ gì?",
        "options": [
          "Vòng lặp vô hạn; cần invariant tiến triển.",
          "Không có vì Rust không data race.",
          "Chỉ tốn thêm một token."
        ],
        "correct": 0,
        "explanation": "An toàn bộ nhớ không đảm bảo thuật toán kết thúc. Nhánh recovery cần tiêu thụ token hoặc trả quyền điều khiển."
      },
      "reference": {
        "label": "rustc lexing and parsing",
        "url": "https://rustc-dev-guide.rust-lang.org/the-parser.html"
      },
      "moduleId": "track-compiler",
      "duration": 35,
      "starterCode": "\nfn recover(tokens: &[char], start: usize) -> Result<usize, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(recover(&['x','?',';','y'],0),Ok(3));\n    assert_eq!(recover(&[';','y'],0),Ok(1));\n    assert_eq!(recover(&['x','y'],0),Ok(2));\n    assert_eq!(recover(&[],0),Ok(0));\n    assert_eq!(recover(&['x'],2),Err(\"start\"));\n    println!(\"Phục hồi luôn tiến về ranh giới tiếp theo\");\n}",
      "solutionCode": "\nfn recover(tokens: &[char], start: usize) -> Result<usize, &'static str> {\n    if start > tokens.len() { return Err(\"start\"); }\n    let mut cursor = start;\n    while cursor < tokens.len() {\n        let token = tokens[cursor];\n        cursor += 1;\n        if token == ';' { break; }\n    }\n    Ok(cursor)\n}\nfn main() {\n    assert_eq!(recover(&['x','?',';','y'],0),Ok(3));\n    assert_eq!(recover(&[';','y'],0),Ok(1));\n    assert_eq!(recover(&['x','y'],0),Ok(2));\n    assert_eq!(recover(&[],0),Ok(0));\n    assert_eq!(recover(&['x'],2),Err(\"start\"));\n    println!(\"Phục hồi luôn tiến về ranh giới tiếp theo\");\n}"
    },
    {
      "id": "compiler-type-inference",
      "title": "Ràng buộc kiểu, suy luận và lỗi dây chuyền",
      "description": "Dùng các ràng buộc để suy ra kiểu và giữ nguồn gốc của sự không tương thích.",
      "objectives": [
        "Phân biệt checking với inference.",
        "Gắn constraint với vị trí nguồn.",
        "Dùng kiểu lỗi để hạn chế diagnostic thứ cấp."
      ],
      "sections": [
        {
          "title": "Kiểu được suy từ các quan hệ",
          "text": "Type checking so một biểu thức với quy tắc kiểu, còn inference tìm thông tin kiểu chưa được ghi tường minh. Trong ngôn ngữ nhỏ, literal nguyên có kiểu Int, literal boolean có kiểu Bool, toán tử cộng yêu cầu hai toán hạng Int và trả Int. Nếu biến chưa có annotation, có thể gắn type variable rồi thêm constraints từ nơi nó được dùng. Một constraint không chỉ là hai kiểu phải bằng nhau; nó còn có span và lý do như toán hạng trái của phép cộng. Thông tin nguồn gốc này giúp diagnostic giải thích được mâu thuẫn thay vì chỉ báo hai mã kiểu không khớp."
        },
        {
          "title": "Unification và phạm vi của mô hình",
          "text": "Với các kiểu cơ bản, unify hai kiểu bằng nhau là đơn giản; nếu một bên là biến chưa giải, nó có thể được liên kết với bên còn lại. Khi có cấu trúc như hàm hoặc list, unify cần đi đệ quy từng thành phần. Occurs check ngăn một biến bị giải thành kiểu chứa chính nó trong các hệ không cho phép kiểu vô hạn. Đây là mô hình học tập, chưa bao gồm trait solving, subtyping hoặc lifetime inference phức tạp của Rust. Giữ phạm vi rõ giúp người học có nền để đọc compiler lớn mà không tưởng một hàm unify vài dòng đã thay thế toàn bộ hệ kiểu."
        },
        {
          "title": "Không để một lỗi tạo hàng chục lỗi phụ",
          "text": "Nếu tên x chưa được khai báo, biểu thức x + 1 đã có lỗi chính ở x. Tiếp tục báo x không phải Int, phép cộng không có kiểu rồi return sai kiểu có thể làm người dùng khó thấy nguyên nhân gốc. Một kiểu Error hoặc Unknown có chính sách lan truyền giúp compiler vẫn phân tích phần còn lại mà hạn chế lỗi dây chuyền. Tuy nhiên không được xem Error là bằng chứng chương trình hợp lệ để sinh mã. Kết quả phân tích cần giữ tập diagnostic và cờ lỗi; pipeline chỉ hạ xuống bước thực thi khi các điều kiện cần thiết đã đạt."
        },
        {
          "title": "Kiểm thử hệ kiểu bằng chương trình nhỏ",
          "text": "Viết fixture cho cùng kiểu, khác kiểu, annotation xung đột, tên chưa biết, branch có hai kiểu khác nhau và nested expression. Assertion cần kiểm tra lỗi chính và span, không chỉ số lượng lỗi tổng vì recovery có thể thay đổi. Bài tập suy kiểu toán tử cộng trong mô hình Int, Bool, Error: hai Int trả Int, có Error thì lan Error mà không tạo lỗi phụ, còn hai kiểu thật không phù hợp trả diagnostic. Khi mở rộng conditional, xác định cả điều kiện Bool và kiểu hai nhánh. Bằng cách thêm quy tắc một lần, bạn có thể đo thay đổi và phát hiện regression mà không phải viết compiler hoàn chỉnh ngay từ đầu."
        }
      ],
      "tip": "Constraint cần giữ lý do và span; thông tin này quyết định chất lượng diagnostic sau khi suy luận.",
      "exercise": {
        "title": "Suy kiểu cộng và lan truyền lỗi",
        "instructions": "Int+Int trả Int; nếu một bên Error trả Error; các trường hợp còn lại trả lỗi operands.",
        "requirements": [
          "Không phát sinh lỗi mới khi đã có Error.",
          "Bool không được tự ép sang Int.",
          "Giữ enum kiểu rõ ràng."
        ]
      },
      "expectedOutput": "Lỗi kiểu chính không tạo lỗi dây chuyền",
      "hints": [
        "Xét Error trước các quy tắc kiểu thật.",
        "Không dùng wildcard trả Int."
      ],
      "quiz": {
        "question": "Vì sao constraint nên giữ span và lý do tạo ra nó?",
        "options": [
          "Chỉ để chiếm thêm RAM.",
          "Để diagnostic chỉ ra nơi hai yêu cầu kiểu mâu thuẫn.",
          "Để bỏ qua checking."
        ],
        "correct": 1,
        "explanation": "Kết quả không tương thích cần liên hệ về source và quy tắc gây yêu cầu, giúp người dùng sửa đúng chỗ."
      },
      "reference": {
        "label": "rustc type inference",
        "url": "https://rustc-dev-guide.rust-lang.org/type-inference.html"
      },
      "moduleId": "track-compiler",
      "duration": 35,
      "starterCode": "#[derive(Debug, Clone, Copy, PartialEq, Eq)]\nenum Ty { Int, Bool, Error }\nfn add_type(left: Ty, right: Ty) -> Result<Ty, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(add_type(Ty::Int,Ty::Int),Ok(Ty::Int));\n    assert_eq!(add_type(Ty::Bool,Ty::Int),Err(\"operands\"));\n    assert_eq!(add_type(Ty::Bool,Ty::Bool),Err(\"operands\"));\n    assert_eq!(add_type(Ty::Error,Ty::Bool),Ok(Ty::Error));\n    println!(\"Lỗi kiểu chính không tạo lỗi dây chuyền\");\n}",
      "solutionCode": "#[derive(Debug, Clone, Copy, PartialEq, Eq)]\nenum Ty { Int, Bool, Error }\nfn add_type(left: Ty, right: Ty) -> Result<Ty, &'static str> {\n    match (left,right) {\n        (Ty::Error,_) | (_,Ty::Error) => Ok(Ty::Error),\n        (Ty::Int,Ty::Int) => Ok(Ty::Int),\n        _ => Err(\"operands\"),\n    }\n}\nfn main() {\n    assert_eq!(add_type(Ty::Int,Ty::Int),Ok(Ty::Int));\n    assert_eq!(add_type(Ty::Bool,Ty::Int),Err(\"operands\"));\n    assert_eq!(add_type(Ty::Bool,Ty::Bool),Err(\"operands\"));\n    assert_eq!(add_type(Ty::Error,Ty::Bool),Ok(Ty::Error));\n    println!(\"Lỗi kiểu chính không tạo lỗi dây chuyền\");\n}"
    },
    {
      "id": "compiler-control-flow",
      "title": "Basic block, nhánh và đồ thị luồng điều khiển",
      "description": "Biểu diễn đường thực thi tường minh để kiểm chứng và tối ưu không làm sai thứ tự.",
      "objectives": [
        "Tách lệnh thường khỏi terminator.",
        "Xây successor và predecessor của block.",
        "Phân biệt reachable với việc chắc chắn kết thúc."
      ],
      "sections": [
        {
          "title": "Từ cây biểu thức đến đường thực thi",
          "text": "AST mô tả cấu trúc source nhưng không luôn thuận tiện để nhìn mọi đường chạy. Control-flow graph chia chương trình thành basic block: một dãy lệnh thực hiện tuần tự với điểm vào rõ và kết thúc bằng terminator. Terminator có thể là jump, conditional branch hoặc return. Việc gọi hàm có thể tạo cạnh lỗi hoặc unwind trong ngôn ngữ phức tạp; DSL của khóa có thể chọn mô hình lỗi đơn giản hơn. Khi hạ if, tạo block điều kiện, hai nhánh và block nối, đồng thời giữ semantics chỉ chạy một nhánh. Không đánh giá trước cả hai nhánh nếu điều đó có thể gây lỗi hoặc side effect."
        },
        {
          "title": "Cạnh và invariant của IR",
          "text": "Mỗi target của jump phải tồn tại; block không được vừa return vừa có lệnh tiếp theo trong cùng dãy thực thi. Một IR validator kiểm tra cấu trúc này trước optimization hoặc VM. Với stack machine, đường đi tới một điểm nối cần có trạng thái stack tương thích. Với register hoặc SSA IR, cần quy tắc định nghĩa và sử dụng riêng. Không trộn giả định của hai mô hình chỉ vì cả hai đều được gọi là IR. Lưu source span cho lệnh quan trọng giúp runtime hoặc pass báo lỗi liên hệ lại biểu thức ban đầu, thay vì chỉ có instruction index không có ý nghĩa với người viết DSL."
        },
        {
          "title": "Reachability không chứng minh termination",
          "text": "Duyệt từ entry qua các successor cho biết block nào có thể được tới theo cấu trúc đồ thị. Block không reachable có thể được bỏ nếu không phải entry đặc biệt và ngôn ngữ không có cơ chế nhảy động làm thay đổi giả định. Nhưng một đồ thị reachable có thể chứa vòng lặp vô hạn. Validation CFG và runtime fuel giải quyết hai câu hỏi khác nhau: cấu trúc có hợp lệ và một lần thực thi có vượt ngân sách không. Với branch phụ thuộc input, phân tích cấu trúc thường phải xem cả hai cạnh có thể đi, trừ khi có bằng chứng điều kiện hằng hoặc phân tích sâu hơn."
        },
        {
          "title": "Kiểm thử CFG độc lập với frontend",
          "text": "Tạo IR bằng tay cho đường thẳng, diamond, vòng lặp, target ngoài miền và block không reachable. Điều này giúp test validator mà không phụ thuộc parser sinh được mọi dạng lỗi. Bài tập dùng worklist để tìm reachable blocks, kiểm tra cạnh trước khi dùng làm index và xử lý chu kỳ bằng tập visited. Khi tích hợp compiler, dump IR trước và sau pass để so sánh, nhưng không dùng dump thay cho test semantics. Dự án VM sẽ cần validator riêng và fuel tại runtime; một chương trình vượt validator vẫn có thể chia cho zero hoặc hết budget tùy dữ liệu đầu vào."
        }
      ],
      "tip": "IR hợp lệ về cấu trúc vẫn có thể chạy vô hạn; fuel hoặc giới hạn runtime cần được thiết kế riêng.",
      "exercise": {
        "title": "Các block reachable từ entry",
        "instructions": "Duyệt graph từ entry, trả chỉ số reachable tăng dần; trả lỗi nếu entry hoặc cạnh tới node không tồn tại.",
        "requirements": [
          "Chu kỳ không làm lặp vô hạn.",
          "Node không reachable không xuất hiện.",
          "Kiểm tra cả cạnh của node được thăm."
        ]
      },
      "expectedOutput": "Đồ thị được duyệt có giới hạn và kiểm tra cạnh",
      "hints": [
        "Đánh dấu visited trước khi thêm successors.",
        "BTreeSet giữ thứ tự output."
      ],
      "quiz": {
        "question": "CFG validator chấp nhận vòng lặp có target đúng. Có chứng minh chương trình sẽ kết thúc?",
        "options": [
          "Có nếu không unsafe.",
          "Không; cần phân tích termination hoặc budget runtime riêng.",
          "Có nếu graph hữu hạn."
        ],
        "correct": 1,
        "explanation": "Một đồ thị hữu hạn có chu kỳ vẫn có thể chạy vô hạn. Tính hợp lệ cấu trúc khác tính kết thúc."
      },
      "reference": {
        "label": "rustc MIR",
        "url": "https://rustc-dev-guide.rust-lang.org/mir/index.html"
      },
      "moduleId": "track-compiler",
      "duration": 35,
      "starterCode": "use std::collections::BTreeSet;\nfn reachable(graph: &[Vec<usize>], entry: usize) -> Result<Vec<usize>, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(reachable(&[vec![1,2],vec![3],vec![3],vec![],vec![]],0),Ok(vec![0,1,2,3]));\n    assert_eq!(reachable(&[vec![1],vec![0]],0),Ok(vec![0,1]));\n    assert_eq!(reachable(&[vec![2]],0),Err(\"edge\"));\n    assert_eq!(reachable(&[],0),Err(\"entry\"));\n    println!(\"Đồ thị được duyệt có giới hạn và kiểm tra cạnh\");\n}",
      "solutionCode": "use std::collections::BTreeSet;\nfn reachable(graph: &[Vec<usize>], entry: usize) -> Result<Vec<usize>, &'static str> {\n    if entry >= graph.len() { return Err(\"entry\"); }\n    let mut seen = BTreeSet::new();\n    let mut work = vec![entry];\n    while let Some(node) = work.pop() {\n        if !seen.insert(node) { continue; }\n        for &next in &graph[node] {\n            if next >= graph.len() { return Err(\"edge\"); }\n            work.push(next);\n        }\n    }\n    Ok(seen.into_iter().collect())\n}\nfn main() {\n    assert_eq!(reachable(&[vec![1,2],vec![3],vec![3],vec![],vec![]],0),Ok(vec![0,1,2,3]));\n    assert_eq!(reachable(&[vec![1],vec![0]],0),Ok(vec![0,1]));\n    assert_eq!(reachable(&[vec![2]],0),Err(\"edge\"));\n    assert_eq!(reachable(&[],0),Err(\"entry\"));\n    println!(\"Đồ thị được duyệt có giới hạn và kiểm tra cạnh\");\n}"
    },
    {
      "id": "compiler-dataflow",
      "title": "Dataflow và biến chắc chắn đã được gán",
      "description": "Lan truyền thông tin qua CFG đến điểm cố định để phát hiện đường sử dụng dữ liệu chưa sẵn sàng.",
      "objectives": [
        "Chọn lattice và phép hợp phù hợp câu hỏi phân tích.",
        "Phân biệt may analysis với must analysis.",
        "Dùng worklist và trạng thái entry có ý nghĩa."
      ],
      "sections": [
        {
          "title": "Mỗi analysis trả lời một câu hỏi",
          "text": "Dataflow analysis tính thông tin tại các điểm chương trình bằng cách truyền qua lệnh và gộp ở điểm nối. Với câu hỏi biến nào chắc chắn đã được gán trước khi đọc, thông tin là một tập tên hoặc symbol ID. Lệnh gán thêm biến vào tập sau khi đã kiểm tra các biến dùng trong biểu thức bên phải. Ở điểm nối của hai nhánh, một biến chỉ chắc chắn được gán nếu nó có mặt trên mọi đường đi vào. Vì vậy phép gộp ở đây là giao, khác với analysis hỏi biến nào có thể đã được gán, thường dùng hợp. Chọn sai phép gộp có thể khiến compiler chấp nhận chương trình lỗi."
        },
        {
          "title": "Miền giá trị và trạng thái ban đầu",
          "text": "Một lattice mô tả các trạng thái thông tin và quan hệ thứ tự, giúp giải thích vì sao việc lặp sẽ tiến đến điểm cố định trong miền hữu hạn phù hợp. Với must analysis, trạng thái khởi tạo cho block chưa xử lý cần được chọn cẩn thận, không đơn giản gán tập rỗng cho mọi nơi rồi nghĩ cùng một thuật toán áp dụng được mọi bài toán. Entry biết các tham số đã có giá trị. Block không reachable cũng cần phân biệt với block reachable nhưng chưa có biến nào được gán. Nếu trộn hai trạng thái, điểm nối có thể bị một predecessor không thể tới làm mất thông tin đúng."
        },
        {
          "title": "Worklist chỉ tính lại khi thông tin đổi",
          "text": "Thay vì quét toàn bộ CFG vô hạn, dùng worklist chứa block có đầu vào hoặc đầu ra vừa thay đổi. Khi một block có state mới, thêm successors để chúng tính lại phép gộp và transfer. So sánh state để tránh đẩy lại khi không có thay đổi. Miền hữu hạn và transfer đơn điệu giúp phân tích kiểu này hội tụ, nhưng triển khai vẫn nên có giới hạn hoặc assertion phát triển để phát hiện lỗi logic. Với chương trình lớn, bitset và symbol ID thường hiệu quả hơn chuỗi tên, còn thuật toán đơn giản bằng BTreeSet phù hợp để kiểm chứng semantics ban đầu."
        },
        {
          "title": "Kiểm thử điều kiện trên mọi đường đi",
          "text": "Fixture quan trọng gồm biến chỉ gán ở một nhánh, gán ở cả hai nhánh, vòng lặp có thể chạy zero lần và nhánh không reachable. Đừng kiểm tra chỉ một execution path rồi coi đó là bằng chứng cho must analysis. Bài tập tính giao các tập đầu vào của predecessor reachable. Không có predecessor được xử lý theo hợp đồng riêng của hàm và không đại diện tự động cho mọi entry CFG. Sau khi tích hợp, diagnostic cần chỉ chỗ đọc biến và có thể giải thích đường chưa gán. Đây là bước tiến từ kiểm tra cú pháp sang phân tích một thuộc tính chương trình có ý nghĩa thực tế."
        }
      ],
      "tip": "Câu hỏi 'có thể' và 'chắc chắn' thường cần phép gộp khác nhau; đặt tên analysis theo điều nó chứng minh.",
      "exercise": {
        "title": "Biến được gán trên mọi nhánh",
        "instructions": "Trả giao các tập predecessor; danh sách rỗng trả tập rỗng theo hợp đồng bài tập.",
        "requirements": [
          "Biến chỉ có ở một nhánh bị loại.",
          "Không sửa input.",
          "Giữ tập kết quả ổn định."
        ]
      },
      "expectedOutput": "Chỉ biến được gán trên mọi nhánh được chấp nhận",
      "hints": [
        "Bắt đầu từ first rồi lọc tên có trong mọi set.",
        "contains nhận &str, không cần clone các set."
      ],
      "quiz": {
        "question": "x được gán ở nhánh then nhưng không ở else. Tại điểm nối, must analysis dùng phép nào?",
        "options": [
          "Cộng số lần x xuất hiện.",
          "Hợp để luôn giữ x.",
          "Giao để không coi x chắc chắn đã gán."
        ],
        "correct": 2,
        "explanation": "Phải đúng trên mọi predecessor reachable; union chỉ cho biết x có thể được gán."
      },
      "reference": {
        "label": "rustc MIR dataflow",
        "url": "https://rustc-dev-guide.rust-lang.org/mir/dataflow.html"
      },
      "moduleId": "track-compiler",
      "duration": 35,
      "starterCode": "use std::collections::BTreeSet;\nfn definite(preds: &[BTreeSet<&str>]) -> BTreeSet<String> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    let a=BTreeSet::from([\"x\",\"y\"]);let b=BTreeSet::from([\"x\",\"z\"]);\n    assert_eq!(definite(&[a,b]),BTreeSet::from([\"x\".to_owned()]));\n    assert!(definite(&[BTreeSet::from([\"x\"]),BTreeSet::new()]).is_empty());\n    assert!(definite(&[]).is_empty());\n    println!(\"Chỉ biến được gán trên mọi nhánh được chấp nhận\");\n}",
      "solutionCode": "use std::collections::BTreeSet;\nfn definite(preds: &[BTreeSet<&str>]) -> BTreeSet<String> {\n    let Some(first) = preds.first() else { return BTreeSet::new(); };\n    first.iter().filter(|name| preds.iter().all(|set|set.contains(**name)))\n        .map(|name|(*name).to_owned()).collect()\n}\nfn main() {\n    let a=BTreeSet::from([\"x\",\"y\"]);let b=BTreeSet::from([\"x\",\"z\"]);\n    assert_eq!(definite(&[a,b]),BTreeSet::from([\"x\".to_owned()]));\n    assert!(definite(&[BTreeSet::from([\"x\"]),BTreeSet::new()]).is_empty());\n    assert!(definite(&[]).is_empty());\n    println!(\"Chỉ biến được gán trên mọi nhánh được chấp nhận\");\n}",
      "simulation": {
        "title": "Biến chắc chắn được gán tại điểm nối",
        "description": "Theo dõi thông tin từ hai predecessor; must analysis lấy giao trên mọi đường reachable.",
        "kind": "pipeline",
        "nodes": [
          {
            "id": "entry",
            "label": "Entry",
            "detail": "Các tham số đã có giá trị"
          },
          {
            "id": "then",
            "label": "Nhánh then",
            "detail": "Transfer của nhánh đầu"
          },
          {
            "id": "else",
            "label": "Nhánh else",
            "detail": "Transfer của nhánh sau"
          },
          {
            "id": "join",
            "label": "Điểm nối",
            "detail": "Giao các tập đã gán"
          }
        ],
        "scenarios": [
          {
            "id": "compiler-definite-ok",
            "label": "Cả hai nhánh gán x",
            "steps": [
              {
                "title": "Vào điều kiện",
                "description": "Chỉ tham số p chắc chắn có giá trị.",
                "activeNodeIds": [
                  "entry"
                ],
                "values": [
                  {
                    "label": "assigned",
                    "value": "{p}"
                  }
                ]
              },
              {
                "title": "Nhánh then",
                "description": "Gán x trước khi tới điểm nối.",
                "activeNodeIds": [
                  "then"
                ],
                "values": [
                  {
                    "label": "out",
                    "value": "{p, x}"
                  }
                ]
              },
              {
                "title": "Nhánh else",
                "description": "Nhánh này cũng gán x.",
                "activeNodeIds": [
                  "else"
                ],
                "values": [
                  {
                    "label": "out",
                    "value": "{p, x}"
                  }
                ]
              },
              {
                "title": "Gộp must",
                "description": "x nằm trong giao, được đọc sau if.",
                "activeNodeIds": [
                  "join"
                ],
                "values": [
                  {
                    "label": "intersection",
                    "value": "{p, x}"
                  },
                  {
                    "label": "read_x",
                    "value": "hợp lệ"
                  }
                ]
              }
            ]
          },
          {
            "id": "compiler-definite-bad",
            "label": "Chỉ một nhánh gán x",
            "steps": [
              {
                "title": "Vào điều kiện",
                "description": "Không có x ở entry.",
                "activeNodeIds": [
                  "entry"
                ],
                "values": [
                  {
                    "label": "assigned",
                    "value": "{p}"
                  }
                ]
              },
              {
                "title": "Nhánh then",
                "description": "Gán x trên một đường đi.",
                "activeNodeIds": [
                  "then"
                ],
                "values": [
                  {
                    "label": "out",
                    "value": "{p, x}"
                  }
                ]
              },
              {
                "title": "Nhánh else",
                "description": "Không gán x.",
                "activeNodeIds": [
                  "else"
                ],
                "values": [
                  {
                    "label": "out",
                    "value": "{p}"
                  }
                ]
              },
              {
                "title": "Gộp must",
                "description": "Giao không có x; đọc x chưa được chứng minh.",
                "activeNodeIds": [
                  "join"
                ],
                "values": [
                  {
                    "label": "intersection",
                    "value": "{p}"
                  },
                  {
                    "label": "read_x",
                    "value": "diagnostic"
                  },
                  {
                    "label": "wrong_union",
                    "value": "{p, x}"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "compiler-bytecode-format",
      "title": "Bytecode có phiên bản và bộ giải mã phòng thủ",
      "description": "Biến IR thành artifact có hợp đồng và kiểm tra dữ liệu trước khi máy ảo thực thi.",
      "objectives": [
        "Thiết kế magic/version/length rõ ràng.",
        "Giải mã không vượt buffer hoặc cấp phát theo dữ liệu tùy ý.",
        "Tách decode hợp lệ khỏi verifier ngữ nghĩa."
      ],
      "sections": [
        {
          "title": "Artifact là một giao diện lâu dài",
          "text": "Khi compiler ghi bytecode ra tệp, định dạng đó trở thành hợp đồng với runtime và công cụ phân tích. Chọn magic để nhận diện họ định dạng, version để xác định schema, thứ tự byte cho số nguyên và giới hạn kích thước. Không ghi trực tiếp memory layout của enum Rust bằng cách ép bytes, vì padding, discriminant và layout không phải định dạng portable được đảm bảo cho mục đích này. Dùng encoding tường minh cho opcode và toán hạng. Nếu thay semantics một instruction, cân nhắc version ngay cả khi số byte của encoding không đổi, vì runtime cũ có thể đọc được nhưng hiểu sai."
        },
        {
          "title": "Đọc length không có nghĩa tin length",
          "text": "Một file có thể khai số instruction rất lớn nhưng thực tế thiếu bytes. Decoder cần kiểm tra arithmetic, phần còn lại của buffer và giới hạn trước cấp phát. Hàm đọc u16 hoặc i64 nên trả Result khi thiếu dữ liệu, không slice rồi unwrap trên input bên ngoài. Quyết định có cho trailing bytes hay không; baseline khóa học từ chối chúng để tránh một artifact được diễn giải khác nhau giữa các tool. Opcode lạ và version tương lai cần lỗi riêng, giúp người dùng phân biệt file hỏng với runtime quá cũ. Mọi lỗi decode phải xảy ra trước khi thực thi instruction đầu tiên."
        },
        {
          "title": "Verifier kiểm tra điều bytes không nói",
          "text": "Decode chỉ tạo được dãy instruction có cấu trúc. Verifier tiếp tục kiểm tra jump target, slot biến, stack underflow, loại giá trị và trạng thái tại điểm nối. Hai lớp này không nên bị gộp thành một vòng execute thử, vì thực thi có thể đã tạo side effect trước khi phát hiện lỗi ở đoạn sau. Với bytecode không tin cậy, runtime vẫn cần kiểm tra budget và các điều kiện phụ thuộc input như chia cho zero. Một verifier hợp lệ không chứng minh chương trình không chạy lâu hoặc mọi phép tính đều có kết quả, mà chỉ chứng minh tập invariant đã được định nghĩa."
        },
        {
          "title": "Tương thích và bộ fixture âm",
          "text": "Lưu artifact mẫu cho version hiện tại cùng file bị cắt ở từng vị trí, count sai, opcode lạ, target ngoài miền và dữ liệu dư. Round-trip encode rồi decode là cần thiết nhưng chưa đủ: hai hàm có thể cùng một lỗi và vẫn khớp nhau. Thêm golden bytes nhỏ được giải thích bằng tay và decoder tests độc lập. Bài tập kiểm tra header và payload có độ dài được khai báo, không chạy payload. Dự án VM sẽ mở rộng thành encoding thật cho stack instructions, rồi gọi verifier trước execute. Khi phát hành runtime mới, chạy lại fixture version cũ theo phạm vi hỗ trợ đã công bố."
        }
      ],
      "tip": "Không serialize enum bằng memory layout Rust; format cần opcode và thứ tự byte được định nghĩa tường minh.",
      "exercise": {
        "title": "Giải mã header có kiểm tra độ dài",
        "instructions": "Định dạng RUL1 + count u16 little-endian + count byte payload; count tối đa 1024, không trailing bytes.",
        "requirements": [
          "Header thiếu hoặc magic sai trả header.",
          "Count quá giới hạn trả budget.",
          "Payload thiếu/thừa trả length."
        ]
      },
      "expectedOutput": "Bytecode được kiểm tra trước khi dùng",
      "hints": [
        "Kiểm tra len>=6 trước indexing.",
        "u16::from_le_bytes xác định endianness."
      ],
      "quiz": {
        "question": "Decode thành công có đủ bỏ verifier và chạy bytecode không tin cậy?",
        "options": [
          "Có vì magic đúng.",
          "Có nếu file nhỏ.",
          "Không; jump/stack/type còn cần kiểm tra."
        ],
        "correct": 2,
        "explanation": "Cấu trúc encoding hợp lệ chưa đảm bảo invariant của instruction và control flow."
      },
      "reference": {
        "label": "WebAssembly validation model",
        "url": "https://webassembly.github.io/spec/core/valid/index.html"
      },
      "moduleId": "track-compiler",
      "duration": 35,
      "starterCode": "\nfn decode(bytes: &[u8]) -> Result<&[u8], &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(decode(b\"RUL1\\x02\\x00ab\"),Ok(&b\"ab\"[..]));\n    assert_eq!(decode(b\"RUL1\\x00\\x00\"),Ok(&b\"\"[..]));\n    assert_eq!(decode(b\"RUL1\\x01\\x00ab\"),Err(\"length\"));\n    assert_eq!(decode(b\"RUL1\"),Err(\"header\"));\n    assert_eq!(decode(b\"RUL1\\xff\\xff\"),Err(\"budget\"));\n    println!(\"Bytecode được kiểm tra trước khi dùng\");\n}",
      "solutionCode": "\nfn decode(bytes: &[u8]) -> Result<&[u8], &'static str> {\n    if bytes.len() < 6 || &bytes[..4] != b\"RUL1\" { return Err(\"header\"); }\n    let count = usize::from(u16::from_le_bytes([bytes[4],bytes[5]]));\n    if count > 1024 { return Err(\"budget\"); }\n    if bytes.len() != 6 + count { return Err(\"length\"); }\n    Ok(&bytes[6..])\n}\nfn main() {\n    assert_eq!(decode(b\"RUL1\\x02\\x00ab\"),Ok(&b\"ab\"[..]));\n    assert_eq!(decode(b\"RUL1\\x00\\x00\"),Ok(&b\"\"[..]));\n    assert_eq!(decode(b\"RUL1\\x01\\x00ab\"),Err(\"length\"));\n    assert_eq!(decode(b\"RUL1\"),Err(\"header\"));\n    assert_eq!(decode(b\"RUL1\\xff\\xff\"),Err(\"budget\"));\n    println!(\"Bytecode được kiểm tra trước khi dùng\");\n}",
      "simulation": {
        "title": "Artifact đi qua decoder, verifier và runtime",
        "description": "Tách lỗi định dạng khỏi lỗi stack/control flow và điều kiện runtime.",
        "kind": "pipeline",
        "nodes": [
          {
            "id": "file",
            "label": "Artifact",
            "detail": "Header và payload bytes"
          },
          {
            "id": "decode",
            "label": "Decoder",
            "detail": "Version, length và opcode"
          },
          {
            "id": "verify",
            "label": "Verifier",
            "detail": "Jump, stack và type"
          },
          {
            "id": "vm",
            "label": "Runtime",
            "detail": "Fuel và checked arithmetic"
          }
        ],
        "scenarios": [
          {
            "id": "compiler-bytecode-ok",
            "label": "Chương trình hợp lệ",
            "steps": [
              {
                "title": "Đọc artifact",
                "description": "Version 1 chứa Push 7, Ret.",
                "activeNodeIds": [
                  "file"
                ],
                "values": [
                  {
                    "label": "magic",
                    "value": "PLCY"
                  },
                  {
                    "label": "version",
                    "value": "1"
                  },
                  {
                    "label": "count",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "Giải mã",
                "description": "Mọi operand đủ bytes, không dư.",
                "activeNodeIds": [
                  "decode"
                ],
                "values": [
                  {
                    "label": "instructions",
                    "value": "Push(7), Ret"
                  },
                  {
                    "label": "cursor",
                    "value": "EOF"
                  }
                ]
              },
              {
                "title": "Kiểm tra stack",
                "description": "Push tạo Int, Ret nhận đúng một Int.",
                "activeNodeIds": [
                  "verify"
                ],
                "values": [
                  {
                    "label": "before_ret",
                    "value": "[Int]"
                  },
                  {
                    "label": "valid",
                    "value": "true"
                  }
                ]
              },
              {
                "title": "Thực thi",
                "description": "Chạy trong budget và trả 7.",
                "activeNodeIds": [
                  "vm"
                ],
                "values": [
                  {
                    "label": "result",
                    "value": "7"
                  },
                  {
                    "label": "fuel_used",
                    "value": "2"
                  }
                ]
              }
            ]
          },
          {
            "id": "compiler-bytecode-bad",
            "label": "Định dạng đúng nhưng stack sai",
            "steps": [
              {
                "title": "Đọc artifact",
                "description": "Bytes biểu diễn Add, Ret đúng encoding.",
                "activeNodeIds": [
                  "file"
                ],
                "values": [
                  {
                    "label": "version",
                    "value": "1"
                  },
                  {
                    "label": "count",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "Giải mã thành công",
                "description": "Decoder chỉ xác nhận opcode/operand.",
                "activeNodeIds": [
                  "decode"
                ],
                "values": [
                  {
                    "label": "instructions",
                    "value": "Add, Ret"
                  },
                  {
                    "label": "decoded",
                    "value": "true"
                  }
                ]
              },
              {
                "title": "Verifier từ chối",
                "description": "Add cần hai Int nhưng stack đầu rỗng.",
                "activeNodeIds": [
                  "verify"
                ],
                "values": [
                  {
                    "label": "stack",
                    "value": "[]"
                  },
                  {
                    "label": "error",
                    "value": "underflow"
                  }
                ]
              },
              {
                "title": "Không thực thi",
                "description": "Runtime không chạy instruction nào.",
                "activeNodeIds": [
                  "vm"
                ],
                "values": [
                  {
                    "label": "executed",
                    "value": "0"
                  },
                  {
                    "label": "result",
                    "value": "không có"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "compiler-optimizer-correctness",
      "title": "Tối ưu có điều kiện và giữ nguyên hành vi",
      "description": "Chứng minh giả định của một phép biến đổi trước khi dùng số đo để đánh giá lợi ích.",
      "objectives": [
        "Giữ lỗi, thứ tự và side effect trong semantics.",
        "Phân biệt fold literal với rewrite tổng quát.",
        "Kiểm tra pass bằng differential tests."
      ],
      "sections": [
        {
          "title": "Tối ưu phải giữ điều quan sát được",
          "text": "Một chương trình không chỉ có giá trị cuối; nó còn có thể báo lỗi, ghi dữ liệu hoặc gọi hàm theo thứ tự xác định. Biến đổi x nhân 0 thành 0 có vẻ đúng về đại số, nhưng nếu x là biểu thức chia cho zero hoặc gọi hàm có side effect, bỏ đánh giá x làm thay đổi hành vi. Ngay cả với số học thuần, overflow, NaN và signed zero có thể khiến một quy tắc quen thuộc không áp dụng như mong đợi. Vì vậy mỗi pass cần ghi precondition và semantics mà nó bảo toàn, không chỉ một danh sách công thức rút gọn nhìn có vẻ hợp lý."
        },
        {
          "title": "Constant folding là một bước nhỏ kiểm chứng được",
          "text": "Khi cả hai toán hạng là literal và toán tử có semantics đã định nghĩa, compiler có thể tính trước kết quả. Nếu phép tính hợp lệ, thay node bằng literal mới và giữ span phù hợp. Nếu DSL quy định overflow là lỗi runtime, pass không được wrap rồi tạo literal sai. Có thể giữ nguyên biểu thức để runtime báo lỗi, hoặc chuyển thành diagnostic compile-time nếu đặc tả cho phép và giao diện đã công bố. Lựa chọn cần thống nhất giữa interpreter, optimizer và VM. Tạo một hàm số học dùng chung giúp tránh mỗi tầng vô tình dùng một chính sách overflow khác nhau."
        },
        {
          "title": "IR validator và pass boundaries",
          "text": "Sau mỗi pass trong cấu hình phát triển, chạy validator để bắt target mất, stack không tương thích hoặc use chưa có definition. Validator cấu trúc không thay thế kiểm chứng semantics, nhưng giúp khoanh vùng pass gây lỗi. Lưu dump trước/sau cho fixture nhỏ để reviewer hiểu phép biến đổi. Khi pass không đổi IR, nó nên trả trạng thái đó hoặc giữ dữ liệu ổn định để pipeline không lặp vô ích. Nếu nhiều pass chạy đến fixed point, cần bảo đảm không có hai pass đổi qua đổi lại hai dạng tương đương mãi. Một bộ tối ưu có thể đúng từng bước nhưng vẫn không kết thúc do lịch chạy pass sai."
        },
        {
          "title": "Đo lợi ích sau khi kiểm tra tính đúng",
          "text": "Dùng interpreter tham chiếu đơn giản và chạy chương trình trước/sau pass trên tập input có giới hạn. So cả Ok lẫn loại lỗi theo semantics, không chỉ các case cho số đẹp. Bổ sung fixture overflow, zero, nhánh không chạy và biểu thức có effect nếu ngôn ngữ hỗ trợ. Bài tập chỉ fold phép cộng hoặc nhân của hai literal khi checked operation thành công, còn lại trả None để giữ node. Sau đó đo số instruction và thời gian trên workload đại diện; giảm node không luôn giảm latency nếu pass làm tăng thời gian compile hoặc phá cache. Báo cả chi phí compile và runtime khi mục tiêu sản phẩm quan tâm cả hai."
        }
      ],
      "tip": "Một rewrite đúng về đại số chưa chắc đúng với semantics có lỗi, overflow hoặc side effect.",
      "exercise": {
        "title": "Fold literal mà không wrap",
        "instructions": "Cộng hoặc nhân hai literal bằng checked arithmetic; toán tử không hỗ trợ hay overflow trả None.",
        "requirements": [
          "Không fold thành giá trị wrap.",
          "Phép hợp lệ trả Some.",
          "None có nghĩa giữ node hiện tại."
        ]
      },
      "expectedOutput": "Constant folding giữ chính sách overflow",
      "hints": [
        "checked_add/checked_mul đã trả Option.",
        "Không dùng wrapping arithmetic."
      ],
      "quiz": {
        "question": "Vì sao không luôn thay (1/0)*0 thành 0 trong DSL có lỗi chia zero?",
        "options": [
          "Vì rewrite loại bỏ lỗi quan sát được của biểu thức gốc.",
          "Vì nhân luôn chậm.",
          "Vì parser không biết số 0."
        ],
        "correct": 0,
        "explanation": "Semantics gồm lỗi đánh giá. Quy tắc đại số cần precondition hoặc phân tích effect để bảo toàn hành vi."
      },
      "reference": {
        "label": "LLVM language reference",
        "url": "https://llvm.org/docs/LangRef.html"
      },
      "moduleId": "track-compiler",
      "duration": 35,
      "starterCode": "\nfn fold(op: char, left: i64, right: i64) -> Option<i64> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(fold('+',2,3),Some(5));\n    assert_eq!(fold('*',-2,3),Some(-6));\n    assert_eq!(fold('+',i64::MAX,1),None);\n    assert_eq!(fold('*',i64::MAX,2),None);\n    assert_eq!(fold('/',4,2),None);\n    println!(\"Constant folding giữ chính sách overflow\");\n}",
      "solutionCode": "\nfn fold(op: char, left: i64, right: i64) -> Option<i64> {\n    match op { '+' => left.checked_add(right), '*' => left.checked_mul(right), _ => None }\n}\nfn main() {\n    assert_eq!(fold('+',2,3),Some(5));\n    assert_eq!(fold('*',-2,3),Some(-6));\n    assert_eq!(fold('+',i64::MAX,1),None);\n    assert_eq!(fold('*',i64::MAX,2),None);\n    assert_eq!(fold('/',4,2),None);\n    println!(\"Constant folding giữ chính sách overflow\");\n}"
    },
    {
      "id": "compiler-testing-fuzzing",
      "title": "Golden test, differential test và fuzzing compiler",
      "description": "Xây bằng chứng tính đúng cho input hợp lệ, input hỏng và các phép biến đổi.",
      "objectives": [
        "Chọn oracle và thuộc tính phù hợp.",
        "Giới hạn tài nguyên của compiler trên input bất kỳ.",
        "Biến lỗi tìm được thành regression test nhỏ."
      ],
      "sections": [
        {
          "title": "Một compiler có nhiều đầu ra cần kiểm tra",
          "text": "Lexer có token/span, parser có AST, type checker có diagnostic, backend có IR hoặc bytecode và runtime có kết quả. Golden tests lưu các đầu ra quan trọng cho fixture nhỏ, giúp nhận ra thay đổi giao diện. Nhưng snapshot quá lớn có thể được cập nhật máy móc mà không ai hiểu lỗi. Chọn fixture có mục đích, kiểm tra invariant riêng và giải thích vì sao output đúng. Với diagnostic, kiểm tra code và span quan trọng trước khi khóa mọi khoảng trắng của bản render. Khi wording thay đổi, không nên làm mất khả năng phát hiện một span trỏ sai chỉ vì reviewer đã chấp nhận snapshot mới."
        },
        {
          "title": "Oracle cần độc lập đủ mức",
          "text": "Round-trip encode/decode chứng minh hai hàm nhất quán với nhau, không chắc định dạng khớp đặc tả nếu cả hai cùng sai. Differential test so interpreter đơn giản với VM hoặc bản trước/sau optimizer trên cùng chương trình và input. Hai đường thực thi nên độc lập ở phần đang muốn kiểm chứng; nếu chúng dùng chung chính hàm sai, so sánh sẽ bỏ sót lỗi đó. Có thể dùng golden bytes giải bằng tay, evaluator tham chiếu và tập case biên để bổ sung. Định nghĩa equality của kết quả gồm lỗi có ý nghĩa, không chỉ giá trị thành công, vì optimizer dễ làm mất lỗi hoặc đổi thứ tự quan sát."
        },
        {
          "title": "Fuzzing cần budget và thuộc tính",
          "text": "Fuzzer đưa nhiều input lạ để tìm panic, crash, timeout hoặc vi phạm invariant. Với parser, thuộc tính cơ bản là không panic trên bytes được xử lý theo chính sách encoding, kết thúc trong budget và mọi span nằm trong source. Với decoder, không được cấp phát vô hạn theo length giả. Có thể fuzz chuỗi bytes hoặc sinh AST hợp lệ rồi pretty-print để khám phá sâu hơn frontend. Giới hạn độ sâu, số node, số diagnostic và fuel runtime giúp một input không chặn cả chiến dịch. Fuzzing không chứng minh không còn lỗi; nó là cách tìm phản ví dụ hiệu quả cho các giả định cụ thể."
        },
        {
          "title": "Từ crash đến bài học bền vững",
          "text": "Khi tìm lỗi, giảm input về trường hợp nhỏ nhất vẫn tái hiện, ghi seed hoặc bytes, xác định invariant bị phá và thêm regression test trước sửa. Đừng chỉ tăng timeout để bỏ qua một parser không tiến triển. Bài tập kiểm tra thuộc tính spans: start≤end, end trong source và cả hai là ranh giới UTF-8 hợp lệ. Project cuối cần bộ malformed inputs, bytecode cắt tại mọi vị trí và test protocol bị chia chunk. Báo cáo nghiệm thu ghi thời gian fuzz, corpus và cấu hình budget, không chỉ viết đã fuzz. Người review cần tái hiện một số case âm để đánh giá độ tin cậy của công cụ trước khi dùng trong pipeline hoặc editor."
        }
      ],
      "tip": "Lỗi tìm được cần trở thành fixture nhỏ có assertion về invariant, không chỉ một file crash được cất lại.",
      "exercise": {
        "title": "Kiểm tra invariant của spans",
        "instructions": "Mọi span phải start<=end, nằm trong source và có hai đầu ở biên UTF-8; tập rỗng hợp lệ.",
        "requirements": [
          "Span EOF rỗng hợp lệ.",
          "Span cắt giữa emoji bị từ chối.",
          "Không slice trực tiếp trước kiểm tra."
        ]
      },
      "expectedOutput": "Span luôn nằm trên biên source hợp lệ",
      "hints": [
        "Kiểm tra thứ tự và end trước.",
        "is_char_boundary không panic khi offset ngoài miền."
      ],
      "quiz": {
        "question": "Encode và decode round-trip đạt có đủ chứng minh format đúng đặc tả không?",
        "options": [
          "Có trong mọi trường hợp.",
          "Không; hai hàm có thể cùng sai, cần golden/negative tests độc lập.",
          "Có nếu input dài."
        ],
        "correct": 1,
        "explanation": "Nhất quán nội bộ khác tương thích đặc tả. Golden bytes và malformed inputs bổ sung oracle độc lập."
      },
      "reference": {
        "label": "Rust fuzz book",
        "url": "https://rust-fuzz.github.io/book/cargo-fuzz.html"
      },
      "moduleId": "track-compiler",
      "duration": 35,
      "starterCode": "\nfn spans_valid(source: &str, spans: &[(usize, usize)]) -> bool {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert!(spans_valid(\"a😃b\",&[(0,1),(1,5),(6,6)]));\n    assert!(!spans_valid(\"a😃b\",&[(1,2)]));\n    assert!(!spans_valid(\"abc\",&[(3,2)]));\n    assert!(!spans_valid(\"abc\",&[(0,4)]));\n    assert!(spans_valid(\"\",&[]));\n    println!(\"Span luôn nằm trên biên source hợp lệ\");\n}",
      "solutionCode": "\nfn spans_valid(source: &str, spans: &[(usize, usize)]) -> bool {\n    spans.iter().all(|&(start,end)| start <= end\n        && end <= source.len()\n        && source.is_char_boundary(start)\n        && source.is_char_boundary(end))\n}\nfn main() {\n    assert!(spans_valid(\"a😃b\",&[(0,1),(1,5),(6,6)]));\n    assert!(!spans_valid(\"a😃b\",&[(1,2)]));\n    assert!(!spans_valid(\"abc\",&[(3,2)]));\n    assert!(!spans_valid(\"abc\",&[(0,4)]));\n    assert!(spans_valid(\"\",&[]));\n    println!(\"Span luôn nằm trên biên source hợp lệ\");\n}"
    },
    {
      "id": "compiler-expression-project",
      "title": "Dự án: Rulecheck biên dịch biểu thức nghiệp vụ",
      "description": "Xây lexer, Pratt parser, AST và evaluator cho quy tắc giá có biến, lỗi và span.",
      "duration": 100,
      "objectives": [
        "Nối frontend hoàn chỉnh cho một DSL giới hạn.",
        "Giữ precedence, associativity và checked arithmetic.",
        "Bàn giao diagnostic và binary có fixture thật."
      ],
      "sections": [
        {
          "title": "Nhu cầu nghiệp vụ và đặc tả nhỏ",
          "text": "Một nhóm muốn viết công thức tổng giá từ subtotal, shipping và discount mà không sửa source ứng dụng mỗi lần. Rulecheck nhận file biểu thức cùng các biến name=value, tính kết quả bằng i64 checked và trả lỗi rõ khi dữ liệu sai. Ngôn ngữ hỗ trợ literal nguyên, tên ASCII, unary minus, bốn phép tính và ngoặc. Nó không cho chạy hàm hệ điều hành hoặc mã Rust tùy ý. Phạm vi này đủ để triển khai pipeline compiler nhỏ có ích, đồng thời buộc người học giữ grammar, semantics và giao diện lỗi nhất quán trước khi thêm điều kiện hoặc kiểu dữ liệu mới."
        },
        {
          "title": "Đi theo pipeline source đến giá trị",
          "text": "Lexer dùng char_indices để giữ byte span đúng dù gặp Unicode không được grammar chấp nhận. Parser Pratt gắn binding power cho phép cộng/trừ và nhân/chia, dùng cặp trái/phải để tạo tính kết hợp trái. Unary minus có mức ưu tiên riêng. AST biểu diễn Number, Name, Neg và Binary, giữ span toàn node cùng span toán tử. Evaluator tìm biến trong map rồi dùng checked arithmetic, báo unknown_name ở tên và overflow hoặc division_zero ở toán tử. CLI chỉ đọc file có giới hạn, parse biến và render diagnostic; nó không chứa lại một bản thuật toán khác với thư viện."
        },
        {
          "title": "Giới hạn độ sâu và test âm",
          "text": "Độ sâu lời gọi parser do ngoặc lồng chưa bao phủ mọi cây sâu. Một chuỗi dài phép cộng tạo AST lệch trái dù recursion của Pratt có thể không sâu tương ứng. Baseline lưu depth của AST và từ chối vượt 64, đồng thời giới hạn source và token. Điều này bảo vệ evaluator và bước duyệt tên dùng recursion. Test cần có ngoặc sâu lẫn chuỗi toán tử dài, số literal vượt miền, trailing token và ký tự lạ nhiều byte. Không dùng panic làm phản hồi input xấu; mỗi lỗi có code, message và span để lớp CLI hoặc editor dùng theo mục đích riêng."
        },
        {
          "title": "Bài thực hành và mở rộng",
          "text": "Chạy fixture shipping.rule với các biến đã cho và kiểm tra giá trị 1700, rồi bỏ một biến để thấy lỗi unknown_name. Bài tập trình duyệt chỉ thực hiện lookup tên, củng cố việc resolution và evaluation cần lỗi riêng thay vì gán mặc định zero. Nhiệm vụ mở rộng là thêm Bool và conditional với type checker, rồi viết interpreter tham chiếu cho differential tests. Khi thêm cú pháp, cập nhật README và fixture cùng lúc. Bàn giao cần source, grammar, semantics, test precedence và lỗi, lệnh binary thật cùng output. Không coi một evaluator số học đạt test là đã làm chủ toàn bộ compiler Rust; đây là bằng chứng cho frontend DSL trong phạm vi được định nghĩa."
        }
      ],
      "tip": "Kiểm tra cả độ sâu cú pháp lẫn độ sâu AST lệch từ chuỗi toán tử dài.",
      "exercise": {
        "title": "Tra cứu biến không dùng giá trị mặc định giả",
        "instructions": "Trả giá trị tên từ environment; tên không có trả unknown_name, kể cả khi một biến khác có giá trị 0.",
        "requirements": [
          "Giữ giá trị âm và 0 hợp lệ.",
          "Không chèn biến mới khi tra cứu.",
          "Lỗi rõ khi chưa có định nghĩa."
        ]
      },
      "expectedOutput": "Tên chưa khai báo không bị biến thành số 0",
      "hints": [
        "get trả Option<&i64>.",
        "copied chuyển thành Option<i64>."
      ],
      "quiz": {
        "question": "Chỉ giới hạn ngoặc lồng có chặn mọi AST quá sâu không?",
        "options": [
          "Không; chuỗi toán tử kết hợp trái cũng có thể tạo cây sâu.",
          "Có vì AST giống số ngoặc.",
          "Có nếu source là UTF-8."
        ],
        "correct": 0,
        "explanation": "Độ sâu recursion của parser và hình dạng AST không luôn giống nhau. Cần budget AST hoặc traversal không đệ quy."
      },
      "reference": {
        "label": "LLVM parser and AST tutorial",
        "url": "https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/LangImpl02.html"
      },
      "localLab": {
        "title": "Rulecheck: compiler biểu thức cho quy tắc giá",
        "instructions": "Tạo project, chạy test rồi dùng file .rule cùng các biến name=value. Pipeline thực gồm lexer có span, Pratt parser, AST, kiểm tra tên và evaluator checked i64. Đây là DSL biểu thức, không phải trình biên dịch Rust đầy đủ.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"rulecheck\"\nversion = \"0.1.0\"\nedition = \"2024\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::collections::{BTreeMap,BTreeSet};\n#[derive(Debug,Clone,Copy,PartialEq,Eq)]\npub struct Span {pub start:usize,pub end:usize}\n#[derive(Debug,Clone,PartialEq,Eq)]\npub struct Diagnostic {pub code:&'static str,pub span:Span,pub message:String}\nfn error(code:&'static str,span:Span,message:impl Into<String>)->Diagnostic{Diagnostic{code,span,message:message.into()}}\n#[derive(Debug,Clone,PartialEq,Eq)]\npub enum TokenKind{Number(i64),Name(String),Symbol(char),Eof}\n#[derive(Debug,Clone)]\npub struct Token{pub kind:TokenKind,pub span:Span}\npub fn lex(source:&str)->Result<Vec<Token>,Diagnostic>{\n    if source.len()>65536{return Err(error(\"budget\",Span{start:0,end:0},\"source exceeds 64 KiB\"));}\n    let mut chars=source.char_indices().peekable();let mut tokens=Vec::new();\n    while let Some((start,c))=chars.next(){\n        if c.is_whitespace(){continue;}\n        let mut end=start+c.len_utf8();\n        let kind=if c.is_ascii_digit(){\n            while let Some(&(position,next))=chars.peek(){if !next.is_ascii_digit(){break;}chars.next();end=position+1;}\n            TokenKind::Number(source[start..end].parse().map_err(|_|error(\"number\",Span{start,end},\"integer literal outside i64\"))?)\n        }else if c.is_ascii_alphabetic()||c=='_'{\n            while let Some(&(position,next))=chars.peek(){if !(next.is_ascii_alphanumeric()||next=='_'){break;}chars.next();end=position+1;}\n            TokenKind::Name(source[start..end].to_owned())\n        }else if \"+-*/()\".contains(c){TokenKind::Symbol(c)}\n        else{return Err(error(\"character\",Span{start,end},\"unexpected character\"))};\n        tokens.push(Token{kind,span:Span{start,end}});\n        if tokens.len()>8192{return Err(error(\"budget\",Span{start,end},\"too many tokens\"));}\n    }\n    tokens.push(Token{kind:TokenKind::Eof,span:Span{start:source.len(),end:source.len()}});\n    Ok(tokens)\n}\n#[derive(Debug,Clone)]\npub struct Expr{pub kind:ExprKind,pub span:Span,pub depth:usize}\n#[derive(Debug,Clone)]\npub enum ExprKind{Number(i64),Name(String),Neg{operator:Span,value:Box<Expr>},Binary{op:char,operator:Span,left:Box<Expr>,right:Box<Expr>}}\nstruct Parser{tokens:Vec<Token>,cursor:usize}\nimpl Parser{\n    fn peek(&self)->&Token{&self.tokens[self.cursor]}\n    fn take(&mut self)->Token{let token=self.peek().clone();if !matches!(token.kind,TokenKind::Eof){self.cursor+=1;}token}\n    fn expression(&mut self,min:u8,depth:usize)->Result<Expr,Diagnostic>{\n        if depth>64{return Err(error(\"depth\",self.peek().span,\"expression nesting exceeds 64\"));}\n        let first=self.take();\n        let mut left=match first.kind{\n            TokenKind::Number(value)=>Expr{kind:ExprKind::Number(value),span:first.span,depth:1},\n            TokenKind::Name(name)=>Expr{kind:ExprKind::Name(name),span:first.span,depth:1},\n            TokenKind::Symbol('-')=>{\n                let value=self.expression(5,depth+1)?;let span=Span{start:first.span.start,end:value.span.end};\n                let depth=value.depth+1;if depth>64{return Err(error(\"depth\",span,\"AST depth exceeds 64\"));}\n                Expr{kind:ExprKind::Neg{operator:first.span,value:Box::new(value)},span,depth}\n            },\n            TokenKind::Symbol('(')=>{\n                let mut value=self.expression(0,depth+1)?;let close=self.take();\n                if close.kind!=TokenKind::Symbol(')'){return Err(error(\"expected_close\",close.span,\"expected ')'\"));}\n                value.span=Span{start:first.span.start,end:close.span.end};value\n            },\n            _=>return Err(error(\"expected_expression\",first.span,\"expected number, name or '('\")),\n        };\n        loop{\n            let (op,lbp,rbp)=match self.peek().kind{\n                TokenKind::Symbol('+')=>('+',1,2),TokenKind::Symbol('-')=>('-',1,2),\n                TokenKind::Symbol('*')=>('*',3,4),TokenKind::Symbol('/')=>('/',3,4),_=>break,\n            };\n            if lbp<min{break;}\n            let operator=self.take().span;let right=self.expression(rbp,depth+1)?;\n            let span=Span{start:left.span.start,end:right.span.end};\n            let depth=left.depth.max(right.depth)+1;if depth>64{return Err(error(\"depth\",span,\"AST depth exceeds 64\"));}\n            left=Expr{kind:ExprKind::Binary{op,operator,left:Box::new(left),right:Box::new(right)},span,depth};\n        }\n        Ok(left)\n    }\n}\npub fn parse(source:&str)->Result<Expr,Diagnostic>{\n    let mut parser=Parser{tokens:lex(source)?,cursor:0};let expression=parser.expression(0,0)?;\n    if parser.peek().kind!=TokenKind::Eof{return Err(error(\"trailing\",parser.peek().span,\"unexpected token after expression\"));}\n    Ok(expression)\n}\npub fn evaluate(expr:&Expr,variables:&BTreeMap<String,i64>)->Result<i64,Diagnostic>{\n    match &expr.kind{\n        ExprKind::Number(value)=>Ok(*value),\n        ExprKind::Name(name)=>variables.get(name).copied().ok_or_else(||error(\"unknown_name\",expr.span,format!(\"unknown variable '{name}'\"))),\n        ExprKind::Neg{operator,value}=>evaluate(value,variables)?.checked_neg().ok_or_else(||error(\"overflow\",*operator,\"negation overflow\")),\n        ExprKind::Binary{op,operator,left,right}=>{\n            let a=evaluate(left,variables)?;let b=evaluate(right,variables)?;\n            if *op=='/'&&b==0{return Err(error(\"division_zero\",*operator,\"division by zero\"));}\n            let value=match op{'+' =>a.checked_add(b),'-'=>a.checked_sub(b),'*'=>a.checked_mul(b),'/'=>a.checked_div(b),_=>None};\n            value.ok_or_else(||error(\"overflow\",*operator,\"integer overflow\"))\n        }\n    }\n}\npub fn check_names(expr:&Expr,allowed:&BTreeSet<&str>)->Vec<Diagnostic>{\n    fn visit(expr:&Expr,allowed:&BTreeSet<&str>,out:&mut Vec<Diagnostic>){\n        match &expr.kind{\n            ExprKind::Name(name) if !allowed.contains(name.as_str())=>out.push(error(\"unknown_name\",expr.span,format!(\"unknown variable '{name}'\"))),\n            ExprKind::Neg{value,..}=>visit(value,allowed,out),\n            ExprKind::Binary{left,right,..}=>{visit(left,allowed,out);visit(right,allowed,out);},\n            _=>{}\n        }\n    }\n    let mut out=Vec::new();visit(expr,allowed,&mut out);out\n}\n#[cfg(test)]\nmod tests{\n    use super::*;\n    fn run(source:&str)->Result<i64,Diagnostic>{evaluate(&parse(source)?,&BTreeMap::from([(\"subtotal\".into(),100)]))}\n    #[test]\n    fn precedence_associativity_and_variables(){\n        assert_eq!(run(\"2+3*4\").unwrap(),14);assert_eq!(run(\"(2+3)*4\").unwrap(),20);\n        assert_eq!(run(\"10-3-2\").unwrap(),5);assert_eq!(run(\"-2*3\").unwrap(),-6);assert_eq!(run(\"subtotal/4\").unwrap(),25);\n    }\n    #[test]\n    fn failures_have_spans(){\n        assert_eq!(run(\"1/0\").unwrap_err().code,\"division_zero\");\n        assert_eq!(run(\"9223372036854775807+1\").unwrap_err().code,\"overflow\");\n        let unknown=run(\"other+1\").unwrap_err();assert_eq!(unknown.span,Span{start:0,end:5});\n        assert!(parse(\"1+\").is_err());assert!(parse(\"1 2\").is_err());assert!(parse(\"(1\").is_err());\n        let unicode=lex(\"a😃\").unwrap_err();assert_eq!(unicode.span,Span{start:1,end:5});\n    }\n    #[test]\n    fn limits_and_names(){\n        assert!(parse(&(\"(\".repeat(70)+\"1\"+&\")\".repeat(70))).is_err());\n        assert!(parse(&vec![\"1\";100].join(\"+\")).is_err());\n        let tree=parse(\"subtotal+missing\").unwrap();\n        assert_eq!(check_names(&tree,&BTreeSet::from([\"subtotal\"])).len(),1);\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use std::{collections::BTreeMap,fs::File,io::Read,path::PathBuf,process::ExitCode};\nfn execute()->Result<i64,String>{\n    let mut args=std::env::args_os().skip(1);\n    let path=PathBuf::from(args.next().ok_or(\"usage: rulecheck FILE [name=value ...]\")?);\n    let mut variables=BTreeMap::new();\n    for arg in args{\n        let arg=arg.into_string().map_err(|_|\"variable must be UTF-8\")?;\n        let (name,value)=arg.split_once('=').ok_or(\"expected name=value\")?;\n        if name.is_empty()||!name.chars().enumerate().all(|(i,c)|c=='_'||c.is_ascii_alphabetic()||(i>0&&c.is_ascii_digit())){return Err(\"invalid variable name\".into());}\n        let value=value.parse::<i64>().map_err(|_|\"invalid variable value\")?;\n        if variables.insert(name.to_owned(),value).is_some(){return Err(\"duplicate variable\".into());}\n    }\n    let mut source=String::new();File::open(&path).map_err(|e|e.to_string())?.take(65537).read_to_string(&mut source).map_err(|e|e.to_string())?;\n    let tree=rulecheck::parse(&source).map_err(|e|format!(\"{} {}..{}: {}\",e.code,e.span.start,e.span.end,e.message))?;\n    rulecheck::evaluate(&tree,&variables).map_err(|e|format!(\"{} {}..{}: {}\",e.code,e.span.start,e.span.end,e.message))\n}\nfn main()->ExitCode{\n    match execute(){Ok(value)=>{println!(\"{value}\");ExitCode::SUCCESS},Err(error)=>{eprintln!(\"rulecheck: {error}\");ExitCode::from(2)}}\n}\n"
          },
          {
            "path": "tests/cli.rs",
            "content": "use std::process::Command;\n#[test]\nfn fixture_runs_and_missing_name_fails(){\n    let file=concat!(env!(\"CARGO_MANIFEST_DIR\"),\"/fixtures/shipping.rule\");\n    let good=Command::new(env!(\"CARGO_BIN_EXE_rulecheck\")).args([file,\"subtotal=1200\",\"shipping=300\",\"discount=100\"]).output().unwrap();\n    assert!(good.status.success());assert_eq!(String::from_utf8(good.stdout).unwrap().trim(),\"1700\");assert!(good.stderr.is_empty());\n    let bad=Command::new(env!(\"CARGO_BIN_EXE_rulecheck\")).arg(file).output().unwrap();\n    assert_eq!(bad.status.code(),Some(2));assert!(String::from_utf8_lossy(&bad.stderr).contains(\"unknown_name\"));\n}\n"
          },
          {
            "path": "fixtures/shipping.rule",
            "content": "subtotal + shipping * 2 - discount\n"
          },
          {
            "path": "README.md",
            "content": "# Rulecheck\ncargo test\ncargo run -- fixtures/shipping.rule subtotal=1200 shipping=300 discount=100\nKết quả: 1700.\n\nGrammar: expression với literal nguyên không dấu trong miền i64, tên ASCII [_A-Za-z][_A-Za-z0-9]*, unary -, + - * / và ngoặc. Unary - mạnh hơn * /, * / mạnh hơn + -, binary left-associative. Whitespace Unicode được bỏ; comment/let/bool chưa hỗ trợ. Số âm biểu diễn bằng unary minus; literal độ lớn vượt i64 bị từ chối.\nSemantics: i64 checked, chia làm tròn về 0; zero và overflow là lỗi. Biến đến từ name=value, tên trùng bị từ chối. Source 64 KiB, 8192 token, nesting 64.\nSpans là byte UTF-8 nửa mở. CLI exit 0 kết quả, 2 lỗi. Diagnostic code/span/message thuộc thư viện, CLI chỉ render.\nMở rộng: thêm conditional/bool với type checker, report nhiều lỗi bằng recovery, build evaluator/VM độc lập để differential test. Giữ grammar và semantics cùng fixture thay đổi.\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run -- fixtures/shipping.rule subtotal=1200 shipping=300 discount=100"
        ],
        "checks": [
          "Precedence, associativity, unary và biến có test.",
          "Overflow/division-zero/unknown-name có code và span.",
          "Source Unicode lạ trả lỗi có span đúng, không panic.",
          "Binary thật đọc fixture và dùng exit code theo hợp đồng."
        ]
      },
      "moduleId": "track-compiler",
      "starterCode": "use std::collections::BTreeMap;\nfn lookup(env: &BTreeMap<&str, i64>, name: &str) -> Result<i64, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    let env=BTreeMap::from([(\"subtotal\",1200),(\"discount\",-100),(\"shipping\",0)]);\n    assert_eq!(lookup(&env,\"subtotal\"),Ok(1200));\n    assert_eq!(lookup(&env,\"discount\"),Ok(-100));\n    assert_eq!(lookup(&env,\"shipping\"),Ok(0));\n    assert_eq!(lookup(&env,\"missing\"),Err(\"unknown_name\"));\n    assert_eq!(env.len(),3);\n    println!(\"Tên chưa khai báo không bị biến thành số 0\");\n}",
      "solutionCode": "use std::collections::BTreeMap;\nfn lookup(env: &BTreeMap<&str, i64>, name: &str) -> Result<i64, &'static str> {\n    env.get(name).copied().ok_or(\"unknown_name\")\n}\nfn main() {\n    let env=BTreeMap::from([(\"subtotal\",1200),(\"discount\",-100),(\"shipping\",0)]);\n    assert_eq!(lookup(&env,\"subtotal\"),Ok(1200));\n    assert_eq!(lookup(&env,\"discount\"),Ok(-100));\n    assert_eq!(lookup(&env,\"shipping\"),Ok(0));\n    assert_eq!(lookup(&env,\"missing\"),Err(\"unknown_name\"));\n    assert_eq!(env.len(),3);\n    println!(\"Tên chưa khai báo không bị biến thành số 0\");\n}"
    },
    {
      "id": "compiler-vm-project",
      "title": "Dự án: Policy-VM với bytecode, verifier và fuel",
      "description": "Biên dịch quy tắc phí có nhánh thành artifact, kiểm chứng typed stack rồi thực thi có ngân sách.",
      "duration": 140,
      "objectives": [
        "Giải labels và encode artifact có phiên bản.",
        "Kiểm tra stack/types tại merge của control flow.",
        "Phân biệt validation cấu trúc với lỗi runtime."
      ],
      "sections": [
        {
          "title": "Sản phẩm và mô hình thực thi",
          "text": "Policy-VM cho phép đóng gói quy tắc phí vận chuyển thành artifact mà runtime đọc và thực thi. Source là assembly DSL có push, load, số học, so sánh, jump và return; hai input subtotal và items là số nguyên không âm. Fixture trả phí 500 cent khi subtotal dưới 10000, ngược lại trả zero. Đây là compiler và máy ảo thực cho một instruction set nhỏ, không phải cách chạy mã máy tùy ý. Việc không cung cấp instruction I/O làm phạm vi side effect hẹp, nhưng vẫn cần giới hạn tài nguyên và kiểm tra mọi bytecode đầu vào trước execute."
        },
        {
          "title": "Compiler hai lượt và định dạng artifact",
          "text": "Lượt đầu ghi vị trí labels và danh sách instruction; lượt sau parse operands rồi thay label bằng target index. Label trùng, không tồn tại hoặc arity sai đều bị từ chối. Encoder tạo magic PLCY, version 1, count little-endian cùng opcode và operands tường minh. Decoder có budget, kiểm tra từng đoạn bytes và từ chối dữ liệu dư. Nó không dựa trên layout enum Rust. CLI compile dùng create_new để không ghi đè artifact hiện có; CLI run đọc artifact có giới hạn và gọi decoder. Golden bytes nhỏ cùng test cắt ở mọi vị trí giúp kiểm tra format độc lập với round-trip."
        },
        {
          "title": "Typed-stack verifier và runtime",
          "text": "Verifier dùng worklist, lưu trạng thái stack tại mỗi instruction reachable. Add yêu cầu hai Int, Lt tạo Bool, Jz lấy Bool và đưa cùng stack còn lại tới hai successor. Nếu hai đường đi đến cùng điểm với stack khác nhau, bytecode bị từ chối. Return cần đúng một Int. Jump target và input slot được kiểm tra trước; stack và số instruction có budget. Runtime vẫn dùng checked arithmetic và fuel, vì chương trình có thể hợp cấu trúc nhưng chia zero theo input hoặc lặp vô hạn. Verifier không phải bằng chứng termination, còn fuel không thay thế type/stack validation."
        },
        {
          "title": "Nghiệm thu và hướng phát triển",
          "text": "Chạy compile fixture rồi run ở hai phía ngưỡng miễn phí. Thử artifact bị cắt, opcode lạ, stack underflow, điều kiện Int thay Bool và vòng lặp không return. Bài tập web tính hiệu ứng stack đơn giản trước khi VM thật bổ sung loại và control flow. Nhiệm vụ độc lập là nối frontend biểu thức hoặc conditional xuống bytecode, giữ source map cho lỗi runtime và thêm optimizer có differential tests với evaluator tham chiếu. Bàn giao cần đặc tả opcode, fixture bytes, test âm và demo budget. Đừng gọi VM là sandbox tổng quát chỉ vì dùng Rust; phạm vi an toàn cần gắn với instruction set, host capabilities và các giới hạn đã kiểm chứng."
        }
      ],
      "tip": "Chạy verifier trước execute, rồi vẫn giữ fuel và checked arithmetic cho điều kiện phụ thuộc runtime.",
      "exercise": {
        "title": "Hiệu ứng stack của chương trình thẳng",
        "instructions": "Mỗi instruction là (pop,push); bắt đầu 0, từ chối underflow hoặc depth vượt limit, trả depth cuối.",
        "requirements": [
          "Không cho pop nhiều hơn đang có.",
          "Dùng checked arithmetic cho depth mới.",
          "Không suy ra type safety từ depth một mình."
        ]
      },
      "expectedOutput": "Stack có invariant trước khi thực thi",
      "hints": [
        "Kiểm tra pop trước phép trừ.",
        "Mỗi instruction cần kiểm tra budget sau cập nhật."
      ],
      "quiz": {
        "question": "Một chương trình jmp về chính nó vượt verifier có nên chạy mãi không?",
        "options": [
          "Có vì verifier đã chấp nhận.",
          "Compiler Rust sẽ tự xóa vòng lặp.",
          "Không; runtime fuel chặn khi hết ngân sách."
        ],
        "correct": 2,
        "explanation": "Cấu trúc jump hợp lệ không chứng minh termination. Fuel là lớp giới hạn thực thi riêng."
      },
      "reference": {
        "label": "WebAssembly validation",
        "url": "https://webassembly.github.io/spec/core/valid/index.html"
      },
      "localLab": {
        "title": "Policy-VM: compiler và máy ảo cho quy tắc phí",
        "instructions": "Biên dịch assembly DSL thành bytecode PLCY version 1 rồi thực thi bằng VM có typed-stack verifier và fuel. Hai input subtotal, items là số nguyên không âm. Source có labels, nhánh, số học checked và return; không có filesystem/network trong instruction set.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"policy-vm\"\nversion = \"0.1.0\"\nedition = \"2024\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::collections::BTreeMap;\n#[derive(Debug,Clone,Copy,PartialEq,Eq)]\npub enum Ins{Push(i64),Load(u8),Add,Sub,Mul,Div,Eq,Lt,Jmp(usize),Jz(usize),Ret}\n#[derive(Debug,Clone,Copy,PartialEq,Eq)]\nenum Ty{Int,Bool}\nfn pop_type(stack:&mut Vec<Ty>,expected:Ty)->Result<(),String>{\n    if stack.pop()==Some(expected){Ok(())}else{Err(\"stack type or underflow\".into())}\n}\npub fn verify(code:&[Ins])->Result<(),String>{\n    if code.is_empty()||code.len()>256{return Err(\"instruction budget\".into());}\n    for instruction in code{\n        match instruction{Ins::Load(slot) if *slot>1=>return Err(\"input slot\".into()),\n            Ins::Jmp(target)|Ins::Jz(target) if *target>=code.len()=>return Err(\"jump target\".into()),_=>{}}\n    }\n    let mut states:Vec<Option<Vec<Ty>>>=vec![None;code.len()];\n    let mut work=vec![(0usize,Vec::new())];\n    while let Some((pc,mut stack))=work.pop(){\n        if pc>=code.len(){return Err(\"fallthrough past code\".into());}\n        if let Some(previous)=&states[pc]{if previous!=&stack{return Err(\"incompatible stack at merge\".into());}continue;}\n        states[pc]=Some(stack.clone());\n        let mut successors=Vec::new();\n        match code[pc]{\n            Ins::Push(_)|Ins::Load(_)=>{stack.push(Ty::Int);successors.push(pc+1);},\n            Ins::Add|Ins::Sub|Ins::Mul|Ins::Div=>{pop_type(&mut stack,Ty::Int)?;pop_type(&mut stack,Ty::Int)?;stack.push(Ty::Int);successors.push(pc+1);},\n            Ins::Eq|Ins::Lt=>{pop_type(&mut stack,Ty::Int)?;pop_type(&mut stack,Ty::Int)?;stack.push(Ty::Bool);successors.push(pc+1);},\n            Ins::Jmp(target)=>successors.push(target),\n            Ins::Jz(target)=>{pop_type(&mut stack,Ty::Bool)?;successors.extend([pc+1,target]);},\n            Ins::Ret=>{if stack!=vec![Ty::Int]{return Err(\"return needs exactly one integer\".into());}},\n        }\n        if stack.len()>128{return Err(\"stack budget\".into());}\n        for target in successors{work.push((target,stack.clone()));}\n    }\n    Ok(())\n}\npub fn compile(source:&str)->Result<Vec<Ins>,String>{\n    if source.len()>65536{return Err(\"source budget\".into());}\n    let mut labels=BTreeMap::new();let mut rows=Vec::new();\n    for (number,line) in source.lines().enumerate(){\n        let text=line.split('#').next().unwrap_or(\"\").trim();if text.is_empty(){continue;}\n        if let Some(label)=text.strip_suffix(':'){\n            if label.is_empty()||!label.chars().all(|c|c.is_ascii_alphanumeric()||c=='_'){return Err(format!(\"line {} invalid label\",number+1));}\n            if labels.insert(label.to_owned(),rows.len()).is_some(){return Err(\"duplicate label\".into());}\n            if labels.len()>256{return Err(\"label budget\".into());}\n        }else{rows.push((number+1,text));if rows.len()>256{return Err(\"instruction budget\".into());}}\n    }\n    let mut code=Vec::new();\n    for (line,text) in rows{\n        let words:Vec<_>=text.split_whitespace().collect();\n        let instruction=match words.as_slice(){\n            [\"push\",number]=>Ins::Push(number.parse().map_err(|_|format!(\"line {line} integer\"))?),\n            [\"load\",\"subtotal\"]=>Ins::Load(0),[\"load\",\"items\"]=>Ins::Load(1),\n            [\"add\"]=>Ins::Add,[\"sub\"]=>Ins::Sub,[\"mul\"]=>Ins::Mul,[\"div\"]=>Ins::Div,[\"eq\"]=>Ins::Eq,[\"lt\"]=>Ins::Lt,\n            [\"jmp\",label]=>Ins::Jmp(*labels.get(*label).ok_or_else(||format!(\"line {line} unknown label\"))?),\n            [\"jz\",label]=>Ins::Jz(*labels.get(*label).ok_or_else(||format!(\"line {line} unknown label\"))?),\n            [\"ret\"]=>Ins::Ret,_=>return Err(format!(\"line {line} unknown instruction or arity\")),\n        };code.push(instruction);\n    }\n    verify(&code)?;Ok(code)\n}\n#[derive(Debug,Clone,Copy)]\nenum Value{Int(i64),Bool(bool)}\nfn integer(stack:&mut Vec<Value>)->Result<i64,String>{match stack.pop(){Some(Value::Int(v))=>Ok(v),_=>Err(\"runtime stack\".into())}}\npub fn run(code:&[Ins],inputs:[i64;2],fuel:usize)->Result<i64,String>{\n    verify(code)?;\n    if inputs.iter().any(|v|*v<0){return Err(\"inputs must be nonnegative\".into());}\n    let mut stack=Vec::new();let mut pc=0usize;\n    for _ in 0..fuel{\n        let instruction=*code.get(pc).ok_or(\"runtime pc\")?;pc+=1;\n        match instruction{\n            Ins::Push(v)=>stack.push(Value::Int(v)),Ins::Load(slot)=>stack.push(Value::Int(inputs[slot as usize])),\n            Ins::Add|Ins::Sub|Ins::Mul|Ins::Div|Ins::Eq|Ins::Lt=>{\n                let b=integer(&mut stack)?;let a=integer(&mut stack)?;\n                if instruction==Ins::Eq{stack.push(Value::Bool(a==b));}\n                else if instruction==Ins::Lt{stack.push(Value::Bool(a<b));}\n                else{\n                    if instruction==Ins::Div&&b==0{return Err(\"division by zero\".into());}\n                    let value=match instruction{Ins::Add=>a.checked_add(b),Ins::Sub=>a.checked_sub(b),Ins::Mul=>a.checked_mul(b),Ins::Div=>a.checked_div(b),_=>None}.ok_or(\"overflow\")?;\n                    stack.push(Value::Int(value));\n                }\n            },\n            Ins::Jmp(target)=>pc=target,\n            Ins::Jz(target)=>{match stack.pop(){Some(Value::Bool(false))=>pc=target,Some(Value::Bool(true))=>{},_=>return Err(\"runtime condition\".into())}},\n            Ins::Ret=>return integer(&mut stack),\n        }\n    }\n    Err(\"fuel exhausted\".into())\n}\npub fn encode(code:&[Ins])->Result<Vec<u8>,String>{\n    verify(code)?;let mut bytes=b\"PLCY\".to_vec();bytes.push(1);bytes.extend((code.len() as u16).to_le_bytes());\n    for instruction in code{\n        match instruction{\n            Ins::Push(value)=>{bytes.push(0);bytes.extend(value.to_le_bytes());},\n            Ins::Load(slot)=>{bytes.extend([1,*slot]);},\n            Ins::Add=>bytes.push(2),Ins::Sub=>bytes.push(3),Ins::Mul=>bytes.push(4),Ins::Div=>bytes.push(5),\n            Ins::Eq=>bytes.push(6),Ins::Lt=>bytes.push(7),\n            Ins::Jmp(target)=>{bytes.push(8);bytes.extend((*target as u16).to_le_bytes());},\n            Ins::Jz(target)=>{bytes.push(9);bytes.extend((*target as u16).to_le_bytes());},Ins::Ret=>bytes.push(10),\n        }\n    }\n    Ok(bytes)\n}\nfn take<const N:usize>(bytes:&[u8],cursor:&mut usize)->Result<[u8;N],String>{\n    let end=cursor.checked_add(N).ok_or(\"offset overflow\")?;\n    let part=bytes.get(*cursor..end).ok_or(\"truncated bytecode\")?;\n    let result=part.try_into().map_err(|_|\"decode width\")?;*cursor=end;Ok(result)\n}\npub fn decode(bytes:&[u8])->Result<Vec<Ins>,String>{\n    if bytes.len()>65536{return Err(\"bytecode budget\".into());}\n    let mut cursor=0;\n    if take::<4>(bytes,&mut cursor)?!=*b\"PLCY\"{return Err(\"magic\".into());}\n    if take::<1>(bytes,&mut cursor)?[0]!=1{return Err(\"version\".into());}\n    let count=u16::from_le_bytes(take(bytes,&mut cursor)?) as usize;\n    if count==0||count>256{return Err(\"instruction budget\".into());}\n    let mut code=Vec::with_capacity(count);\n    for _ in 0..count{\n        let instruction=match take::<1>(bytes,&mut cursor)?[0]{\n            0=>Ins::Push(i64::from_le_bytes(take(bytes,&mut cursor)?)),1=>Ins::Load(take::<1>(bytes,&mut cursor)?[0]),\n            2=>Ins::Add,3=>Ins::Sub,4=>Ins::Mul,5=>Ins::Div,6=>Ins::Eq,7=>Ins::Lt,\n            8=>Ins::Jmp(u16::from_le_bytes(take(bytes,&mut cursor)?) as usize),\n            9=>Ins::Jz(u16::from_le_bytes(take(bytes,&mut cursor)?) as usize),10=>Ins::Ret,_=>return Err(\"opcode\".into()),\n        };code.push(instruction);\n    }\n    if cursor!=bytes.len(){return Err(\"trailing bytes\".into());}\n    verify(&code)?;Ok(code)\n}\n#[cfg(test)]\nmod tests{\n    use super::*;\n    const POLICY:&str=\"load subtotal\\npush 10000\\nlt\\njz free\\npush 500\\nret\\nfree:\\npush 0\\nret\\n\";\n    #[test]\n    fn business_rule_and_roundtrip(){\n        let code=compile(POLICY).unwrap();assert_eq!(run(&code,[9999,1],100).unwrap(),500);assert_eq!(run(&code,[10000,1],100).unwrap(),0);\n        assert_eq!(decode(&encode(&code).unwrap()).unwrap(),code);\n        assert!(run(&code,[-1,1],100).is_err());\n    }\n    #[test]\n    fn verify_negative_and_fuel(){\n        assert!(verify(&[Ins::Add,Ins::Ret]).is_err());assert!(verify(&[Ins::Jmp(9)]).is_err());\n        assert!(verify(&[Ins::Push(1),Ins::Jz(2),Ins::Ret]).is_err());\n        assert!(verify(&[Ins::Push(1),Ins::Push(2),Ins::Ret]).is_err());\n        assert_eq!(run(&compile(\"again:\\njmp again\").unwrap(),[1,1],10),Err(\"fuel exhausted\".into()));\n        assert!(run(&compile(\"push 1\\npush 0\\ndiv\\nret\").unwrap(),[1,1],10).is_err());\n        assert_eq!(run(&compile(\"push 9223372036854775807\\npush 1\\nadd\\nret\").unwrap(),[1,1],10),Err(\"overflow\".into()));\n        assert_eq!(run(&compile(\"push -9223372036854775808\\npush -1\\ndiv\\nret\").unwrap(),[1,1],10),Err(\"overflow\".into()));\n    }\n    #[test]\n    fn decoder_rejects_every_truncation_and_unknown_version(){\n        let bytes=encode(&compile(POLICY).unwrap()).unwrap();\n        for end in 0..bytes.len(){assert!(decode(&bytes[..end]).is_err());}\n        let mut changed=bytes.clone();changed[4]=2;assert!(decode(&changed).is_err());\n        let mut extra=bytes;extra.push(0);assert!(decode(&extra).is_err());\n    }\n    #[test]\n    fn golden_bytes_and_branch_merge(){\n        let code=vec![Ins::Push(7),Ins::Ret];\n        assert_eq!(encode(&code).unwrap(),vec![80,76,67,89,1,2,0,0,7,0,0,0,0,0,0,0,10]);\n        assert!(compile(\"push 1\\npush 0\\neq\\njz branch\\npush 1\\njmp join\\nbranch:\\npush 1\\npush 2\\njoin:\\nret\").is_err());\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use std::{fs::{File,OpenOptions},io::{Read,Write},path::Path,process::ExitCode};\nfn read(path:&Path)->Result<Vec<u8>,String>{let mut bytes=Vec::new();File::open(path).map_err(|e|e.to_string())?.take(65537).read_to_end(&mut bytes).map_err(|e|e.to_string())?;if bytes.len()>65536{return Err(\"file budget\".into());}Ok(bytes)}\nfn execute()->Result<(),String>{\n    let args:Vec<_>=std::env::args_os().skip(1).collect();\n    if args.len()==3&&args[0]==\"compile\"{\n        let source=String::from_utf8(read(Path::new(&args[1]))?).map_err(|e|e.to_string())?;\n        let bytes=policy_vm::encode(&policy_vm::compile(&source)?)?;\n        let path=Path::new(&args[2]);let mut file=OpenOptions::new().write(true).create_new(true).open(path).map_err(|e|e.to_string())?;\n        if let Err(e)=file.write_all(&bytes).and_then(|_|file.sync_all()){drop(file);let _=std::fs::remove_file(path);return Err(e.to_string());}\n        Ok(())\n    }else if args.len()==4&&args[0]==\"run\"{\n        let code=policy_vm::decode(&read(Path::new(&args[1]))?)?;\n        let subtotal=args[2].to_str().ok_or(\"subtotal encoding\")?.parse().map_err(|_|\"subtotal integer\")?;\n        let items=args[3].to_str().ok_or(\"items encoding\")?.parse().map_err(|_|\"items integer\")?;\n        println!(\"{}\",policy_vm::run(&code,[subtotal,items],10000)?);Ok(())\n    }else{Err(\"usage: policy-vm compile SOURCE OUTPUT | run BYTECODE SUBTOTAL ITEMS\".into())}\n}\nfn main()->ExitCode{match execute(){Ok(())=>ExitCode::SUCCESS,Err(e)=>{eprintln!(\"policy-vm: {e}\");ExitCode::from(2)}}}\n"
          },
          {
            "path": "tests/process.rs",
            "content": "use std::{fs,process::Command};\n#[test]\nfn compile_and_execute_artifact(){\n    let dir=std::env::temp_dir().join(format!(\"policy-vm-{}\",std::process::id()));fs::create_dir(&dir).unwrap();\n    let out=dir.join(\"rule.pbc\");\n    let result=Command::new(env!(\"CARGO_BIN_EXE_policy-vm\")).arg(\"compile\").arg(concat!(env!(\"CARGO_MANIFEST_DIR\"),\"/fixtures/shipping.policy\")).arg(&out).output().unwrap();\n    assert!(result.status.success());\n    let run=Command::new(env!(\"CARGO_BIN_EXE_policy-vm\")).arg(\"run\").arg(&out).args([\"9000\",\"1\"]).output().unwrap();\n    assert!(run.status.success());assert_eq!(String::from_utf8(run.stdout).unwrap().trim(),\"500\");\n    let again=Command::new(env!(\"CARGO_BIN_EXE_policy-vm\")).arg(\"compile\").arg(concat!(env!(\"CARGO_MANIFEST_DIR\"),\"/fixtures/shipping.policy\")).arg(&out).output().unwrap();\n    assert_eq!(again.status.code(),Some(2));fs::remove_dir_all(dir).unwrap();\n}\n"
          },
          {
            "path": "fixtures/shipping.policy",
            "content": "# Miễn phí khi subtotal >= 10000 cent\nload subtotal\npush 10000\nlt\njz free\npush 500\nret\nfree:\npush 0\nret\n"
          },
          {
            "path": "README.md",
            "content": "# Policy-VM\ncargo test\ncargo run -- compile fixtures/shipping.policy shipping.pbc\ncargo run -- run shipping.pbc 9000 1\nKết quả 500. Với subtotal=10000, kết quả 0. compile không ghi đè output có sẵn.\n\nInstructions: push i64, load subtotal|items, add/sub/mul/div, eq/lt (Int Int -> Bool), jmp label, jz label (pop Bool; jump nếu false), ret (đúng một Int). Comment bắt đầu #; label nằm riêng dòng.\nCompiler hai lượt giải labels. Verifier worklist kiểm tra mọi jump/slot, stack/type trên đường reachable và trạng thái merge. Vòng lặp hợp lệ vẫn có thể không dừng; VM giới hạn 10000 instruction khi chạy CLI.\nPLCY + version 1 + count u16 little-endian; opcode 0 Push i64,1 Load u8,2 Add,3 Sub,4 Mul,5 Div,6 Eq,7 Lt,8 Jmp u16,9 Jz u16,10 Ret. Không trailing bytes. Source/bytecode 64 KiB, tối đa 256 instructions, stack 128.\nTest có golden bytes, mọi vị trí truncate, merge sai, underflow, jump sai, fuel, overflow/zero và binary thật.\nMở rộng: frontend biểu thức/conditional lowering xuống bytecode, source map runtime, optimizer có differential oracle và artifact compatibility tests. VM arithmetic không phải sandbox thực thi mã máy tùy ý; instruction set không cấp I/O.\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run -- compile fixtures/shipping.policy shipping.pbc",
          "cargo run -- run shipping.pbc 9000 1"
        ],
        "checks": [
          "Compiler giải labels và từ chối target/stack/type sai.",
          "Decode cắt ở mọi vị trí đều lỗi, golden bytes khớp.",
          "Vòng lặp bị fuel chặn; arithmetic dùng checked operations.",
          "Artifact tạo bằng CLI được runtime đọc, không ghi đè file cũ."
        ]
      },
      "moduleId": "track-compiler",
      "starterCode": "\nfn stack_depth(code: &[(usize, usize)], limit: usize) -> Result<usize, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(stack_depth(&[(0,1),(0,1),(2,1)],8),Ok(1));\n    assert_eq!(stack_depth(&[(1,0)],8),Err(\"underflow\"));\n    assert_eq!(stack_depth(&[(0,9)],8),Err(\"budget\"));\n    assert_eq!(stack_depth(&[],0),Ok(0));\n    assert_eq!(stack_depth(&[(0,usize::MAX),(0,1)],usize::MAX),Err(\"overflow\"));\n    println!(\"Stack có invariant trước khi thực thi\");\n}",
      "solutionCode": "\nfn stack_depth(code: &[(usize, usize)], limit: usize) -> Result<usize, &'static str> {\n    let mut depth = 0usize;\n    for &(pop,push) in code {\n        if pop > depth { return Err(\"underflow\"); }\n        depth = (depth-pop).checked_add(push).ok_or(\"overflow\")?;\n        if depth > limit { return Err(\"budget\"); }\n    }\n    Ok(depth)\n}\nfn main() {\n    assert_eq!(stack_depth(&[(0,1),(0,1),(2,1)],8),Ok(1));\n    assert_eq!(stack_depth(&[(1,0)],8),Err(\"underflow\"));\n    assert_eq!(stack_depth(&[(0,9)],8),Err(\"budget\"));\n    assert_eq!(stack_depth(&[],0),Ok(0));\n    assert_eq!(stack_depth(&[(0,usize::MAX),(0,1)],usize::MAX),Err(\"overflow\"));\n    println!(\"Stack có invariant trước khi thực thi\");\n}"
    },
    {
      "id": "compiler-tooling-project",
      "title": "Dự án cuối khóa: Rule-LSP cho trình biên tập",
      "description": "Đưa frontend DSL vào server stdio có framing, document version và diagnostic UTF-16.",
      "duration": 150,
      "objectives": [
        "Nối analysis với transport JSON-RPC/LSP thật.",
        "Giữ vị trí và phiên bản document chính xác.",
        "Bàn giao công cụ editor với test protocol và kế hoạch mở rộng."
      ],
      "sections": [
        {
          "title": "Người dùng cần phản hồi khi đang viết",
          "text": "Thay vì chạy CLI sau mỗi lần sửa công thức, người viết quy tắc muốn lỗi xuất hiện ngay trong editor. Rule-LSP nhận document qua giao thức chuẩn, chạy lexer/parser/name checker và publish diagnostics. Baseline hỗ trợ full document sync, tên subtotal, shipping, discount và syntax expression của Rulecheck. Nó không quảng cáo completion, rename hay incremental edits khi chưa có triển khai. Chính capability trả từ initialize cho client biết phạm vi được hỗ trợ. Một công cụ editor chuyên nghiệp cần phản hồi nhất quán trên source chưa hoàn thành, nhiều lần sửa nhanh và vòng đời mở/đóng document."
        },
        {
          "title": "Transport không phải đọc từng dòng JSON",
          "text": "LSP qua stdio dùng header Content-Length và body JSON-RPC. Length tính theo bytes UTF-8, không phải số ký tự; dữ liệu tiếng Việt hay emoji làm khác biệt này dễ thấy. Reader phải xử lý header và body có thể tới qua nhiều lần đọc, giới hạn kích thước trước cấp phát và phát hiện EOF giữa message. stdout chỉ chứa protocol, còn log phát triển đi stderr. Source đi qua lexer có byte span, sau đó adapter chuyển sang range UTF-16 đã công bố. Test dùng buffer đọc một byte mỗi lần để chứng minh parser transport không phụ thuộc ranh giới read trùng ranh giới message."
        },
        {
          "title": "Document version và vòng đời server",
          "text": "Server lưu text cùng version theo URI. didChange chỉ được áp dụng khi version mới hơn và có full text như capability đã cam kết; thay đổi cũ bị bỏ. didClose xóa state và publish danh sách diagnostic rỗng. shutdown trả response rồi exit kết thúc với mã phù hợp. Baseline phân tích đồng bộ, nên chưa có race giữa worker analysis; khi thêm async, mỗi công việc phải giữ snapshot/version và kiểm tra trước publish. Đừng đánh giá expression với các giá trị giả để tạo diagnostic runtime: chia cho zero có thể phụ thuộc input thật. Server hiện kiểm tra cú pháp và tên, còn semantics runtime thuộc evaluator."
        },
        {
          "title": "Bằng chứng cho capstone và phần phải làm tiếp",
          "text": "Chạy test process để gửi initialize, open source sai, change thành đúng, shutdown và exit qua binary thật. Client Python đi kèm giúp nhìn framing và diagnostics mà không cần editor extension. Bài tập web lọc version cũ để củng cố invariant document. Nghiệm thu capstone yêu cầu nối client editor thật, thêm Bool/conditional cùng type checking, phục hồi nhiều lỗi và cache có test invalidation nếu triển khai incremental. Lưu recording sửa nhanh, Unicode, nhiều document và lỗi transport. Một handshake stdio đạt chỉ chứng minh protocol cơ bản; reviewer cần đối chiếu trải nghiệm editor, source map và khả năng phục hồi trước khi coi công cụ phù hợp sử dụng trong dự án."
        }
      ],
      "tip": "Không ghi println debug vào stdout của language server; nó làm hỏng framing của client.",
      "exercise": {
        "title": "Áp dụng document version tăng",
        "instructions": "Chỉ thay text khi incoming_version > current_version. Trả true khi áp dụng và false khi bỏ qua.",
        "requirements": [
          "Version bằng nhau không ghi đè.",
          "Giữ text/version cũ khi message lỗi thời.",
          "Không tự tăng version ngoài incoming."
        ]
      },
      "expectedOutput": "Document cũ không ghi đè phiên mới",
      "hints": [
        "So version trước mutation.",
        "Gán tuple khi hợp lệ để text và version đổi cùng nhau."
      ],
      "quiz": {
        "question": "Content-Length của JSON chứa tiếng Việt cần tính bằng gì?",
        "options": [
          "Số dòng JSON.",
          "Số Unicode scalar values.",
          "Số bytes của body UTF-8."
        ],
        "correct": 2,
        "explanation": "Transport đọc đúng số bytes. Đếm ký tự sẽ làm cắt body hoặc ăn vào message tiếp theo."
      },
      "reference": {
        "label": "LSP base protocol",
        "url": "https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#baseProtocol"
      },
      "localLab": {
        "title": "Rule-LSP: chẩn đoán DSL qua giao thức editor",
        "instructions": "Server stdio dùng Content-Length theo byte, JSON-RPC và LSP full document sync. Nó chạy lexer/parser/name checker của DSL thật và xuất diagnostics có UTF-16 range. cargo test có process handshake và document edits; ví dụ client Python gọi binary giúp kiểm tra framing mà không cần cài editor extension.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"rule-lsp\"\nversion = \"0.1.0\"\nedition = \"2024\"\n[dependencies]\nserde_json = \"1\"\n"
          },
          {
            "path": "src/engine.rs",
            "content": "use std::collections::{BTreeMap,BTreeSet};\n#[derive(Debug,Clone,Copy,PartialEq,Eq)]\npub struct Span {pub start:usize,pub end:usize}\n#[derive(Debug,Clone,PartialEq,Eq)]\npub struct Diagnostic {pub code:&'static str,pub span:Span,pub message:String}\nfn error(code:&'static str,span:Span,message:impl Into<String>)->Diagnostic{Diagnostic{code,span,message:message.into()}}\n#[derive(Debug,Clone,PartialEq,Eq)]\npub enum TokenKind{Number(i64),Name(String),Symbol(char),Eof}\n#[derive(Debug,Clone)]\npub struct Token{pub kind:TokenKind,pub span:Span}\npub fn lex(source:&str)->Result<Vec<Token>,Diagnostic>{\n    if source.len()>65536{return Err(error(\"budget\",Span{start:0,end:0},\"source exceeds 64 KiB\"));}\n    let mut chars=source.char_indices().peekable();let mut tokens=Vec::new();\n    while let Some((start,c))=chars.next(){\n        if c.is_whitespace(){continue;}\n        let mut end=start+c.len_utf8();\n        let kind=if c.is_ascii_digit(){\n            while let Some(&(position,next))=chars.peek(){if !next.is_ascii_digit(){break;}chars.next();end=position+1;}\n            TokenKind::Number(source[start..end].parse().map_err(|_|error(\"number\",Span{start,end},\"integer literal outside i64\"))?)\n        }else if c.is_ascii_alphabetic()||c=='_'{\n            while let Some(&(position,next))=chars.peek(){if !(next.is_ascii_alphanumeric()||next=='_'){break;}chars.next();end=position+1;}\n            TokenKind::Name(source[start..end].to_owned())\n        }else if \"+-*/()\".contains(c){TokenKind::Symbol(c)}\n        else{return Err(error(\"character\",Span{start,end},\"unexpected character\"))};\n        tokens.push(Token{kind,span:Span{start,end}});\n        if tokens.len()>8192{return Err(error(\"budget\",Span{start,end},\"too many tokens\"));}\n    }\n    tokens.push(Token{kind:TokenKind::Eof,span:Span{start:source.len(),end:source.len()}});\n    Ok(tokens)\n}\n#[derive(Debug,Clone)]\npub struct Expr{pub kind:ExprKind,pub span:Span,pub depth:usize}\n#[derive(Debug,Clone)]\npub enum ExprKind{Number(i64),Name(String),Neg{operator:Span,value:Box<Expr>},Binary{op:char,operator:Span,left:Box<Expr>,right:Box<Expr>}}\nstruct Parser{tokens:Vec<Token>,cursor:usize}\nimpl Parser{\n    fn peek(&self)->&Token{&self.tokens[self.cursor]}\n    fn take(&mut self)->Token{let token=self.peek().clone();if !matches!(token.kind,TokenKind::Eof){self.cursor+=1;}token}\n    fn expression(&mut self,min:u8,depth:usize)->Result<Expr,Diagnostic>{\n        if depth>64{return Err(error(\"depth\",self.peek().span,\"expression nesting exceeds 64\"));}\n        let first=self.take();\n        let mut left=match first.kind{\n            TokenKind::Number(value)=>Expr{kind:ExprKind::Number(value),span:first.span,depth:1},\n            TokenKind::Name(name)=>Expr{kind:ExprKind::Name(name),span:first.span,depth:1},\n            TokenKind::Symbol('-')=>{\n                let value=self.expression(5,depth+1)?;let span=Span{start:first.span.start,end:value.span.end};\n                let depth=value.depth+1;if depth>64{return Err(error(\"depth\",span,\"AST depth exceeds 64\"));}\n                Expr{kind:ExprKind::Neg{operator:first.span,value:Box::new(value)},span,depth}\n            },\n            TokenKind::Symbol('(')=>{\n                let mut value=self.expression(0,depth+1)?;let close=self.take();\n                if close.kind!=TokenKind::Symbol(')'){return Err(error(\"expected_close\",close.span,\"expected ')'\"));}\n                value.span=Span{start:first.span.start,end:close.span.end};value\n            },\n            _=>return Err(error(\"expected_expression\",first.span,\"expected number, name or '('\")),\n        };\n        loop{\n            let (op,lbp,rbp)=match self.peek().kind{\n                TokenKind::Symbol('+')=>('+',1,2),TokenKind::Symbol('-')=>('-',1,2),\n                TokenKind::Symbol('*')=>('*',3,4),TokenKind::Symbol('/')=>('/',3,4),_=>break,\n            };\n            if lbp<min{break;}\n            let operator=self.take().span;let right=self.expression(rbp,depth+1)?;\n            let span=Span{start:left.span.start,end:right.span.end};\n            let depth=left.depth.max(right.depth)+1;if depth>64{return Err(error(\"depth\",span,\"AST depth exceeds 64\"));}\n            left=Expr{kind:ExprKind::Binary{op,operator,left:Box::new(left),right:Box::new(right)},span,depth};\n        }\n        Ok(left)\n    }\n}\npub fn parse(source:&str)->Result<Expr,Diagnostic>{\n    let mut parser=Parser{tokens:lex(source)?,cursor:0};let expression=parser.expression(0,0)?;\n    if parser.peek().kind!=TokenKind::Eof{return Err(error(\"trailing\",parser.peek().span,\"unexpected token after expression\"));}\n    Ok(expression)\n}\npub fn evaluate(expr:&Expr,variables:&BTreeMap<String,i64>)->Result<i64,Diagnostic>{\n    match &expr.kind{\n        ExprKind::Number(value)=>Ok(*value),\n        ExprKind::Name(name)=>variables.get(name).copied().ok_or_else(||error(\"unknown_name\",expr.span,format!(\"unknown variable '{name}'\"))),\n        ExprKind::Neg{operator,value}=>evaluate(value,variables)?.checked_neg().ok_or_else(||error(\"overflow\",*operator,\"negation overflow\")),\n        ExprKind::Binary{op,operator,left,right}=>{\n            let a=evaluate(left,variables)?;let b=evaluate(right,variables)?;\n            if *op=='/'&&b==0{return Err(error(\"division_zero\",*operator,\"division by zero\"));}\n            let value=match op{'+' =>a.checked_add(b),'-'=>a.checked_sub(b),'*'=>a.checked_mul(b),'/'=>a.checked_div(b),_=>None};\n            value.ok_or_else(||error(\"overflow\",*operator,\"integer overflow\"))\n        }\n    }\n}\npub fn check_names(expr:&Expr,allowed:&BTreeSet<&str>)->Vec<Diagnostic>{\n    fn visit(expr:&Expr,allowed:&BTreeSet<&str>,out:&mut Vec<Diagnostic>){\n        match &expr.kind{\n            ExprKind::Name(name) if !allowed.contains(name.as_str())=>out.push(error(\"unknown_name\",expr.span,format!(\"unknown variable '{name}'\"))),\n            ExprKind::Neg{value,..}=>visit(value,allowed,out),\n            ExprKind::Binary{left,right,..}=>{visit(left,allowed,out);visit(right,allowed,out);},\n            _=>{}\n        }\n    }\n    let mut out=Vec::new();visit(expr,allowed,&mut out);out\n}\n#[cfg(test)]\nmod tests{\n    use super::*;\n    fn run(source:&str)->Result<i64,Diagnostic>{evaluate(&parse(source)?,&BTreeMap::from([(\"subtotal\".into(),100)]))}\n    #[test]\n    fn precedence_associativity_and_variables(){\n        assert_eq!(run(\"2+3*4\").unwrap(),14);assert_eq!(run(\"(2+3)*4\").unwrap(),20);\n        assert_eq!(run(\"10-3-2\").unwrap(),5);assert_eq!(run(\"-2*3\").unwrap(),-6);assert_eq!(run(\"subtotal/4\").unwrap(),25);\n    }\n    #[test]\n    fn failures_have_spans(){\n        assert_eq!(run(\"1/0\").unwrap_err().code,\"division_zero\");\n        assert_eq!(run(\"9223372036854775807+1\").unwrap_err().code,\"overflow\");\n        let unknown=run(\"other+1\").unwrap_err();assert_eq!(unknown.span,Span{start:0,end:5});\n        assert!(parse(\"1+\").is_err());assert!(parse(\"1 2\").is_err());assert!(parse(\"(1\").is_err());\n        let unicode=lex(\"a😃\").unwrap_err();assert_eq!(unicode.span,Span{start:1,end:5});\n    }\n    #[test]\n    fn limits_and_names(){\n        assert!(parse(&(\"(\".repeat(70)+\"1\"+&\")\".repeat(70))).is_err());\n        assert!(parse(&vec![\"1\";100].join(\"+\")).is_err());\n        let tree=parse(\"subtotal+missing\").unwrap();\n        assert_eq!(check_names(&tree,&BTreeSet::from([\"subtotal\"])).len(),1);\n    }\n}\n"
          },
          {
            "path": "src/lib.rs",
            "content": "pub mod engine;\nuse std::{collections::{BTreeMap,BTreeSet},io::{self,BufRead,Read,Write}};\nuse serde_json::{json,Value};\nfn invalid(message:impl Into<String>)->io::Error{io::Error::new(io::ErrorKind::InvalidData,message.into())}\npub fn read_message<R:BufRead>(reader:&mut R)->io::Result<Option<Value>>{\n    let mut header=Vec::new();\n    loop{\n        let mut byte=[0u8;1];\n        match reader.read_exact(&mut byte){\n            Ok(())=>header.push(byte[0]),\n            Err(e) if e.kind()==io::ErrorKind::UnexpectedEof&&header.is_empty()=>return Ok(None),\n            Err(e)=>return Err(e),\n        }\n        if header.len()>8192{return Err(invalid(\"header budget\"));}\n        if header.ends_with(b\"\\r\\n\\r\\n\"){break;}\n    }\n    if !header.is_ascii(){return Err(invalid(\"header must be ASCII\"));}\n    let header=std::str::from_utf8(&header).map_err(io::Error::other)?;\n    let mut length=None;\n    for line in header.split(\"\\r\\n\").filter(|line|!line.is_empty()){\n        let (name,value)=line.split_once(':').ok_or_else(||invalid(\"header field\"))?;\n        if name.eq_ignore_ascii_case(\"Content-Length\"){\n            if length.is_some(){return Err(invalid(\"duplicate length\"));}\n            length=Some(value.trim().parse::<usize>().map_err(|_|invalid(\"length integer\"))?);\n        }\n    }\n    let length=length.ok_or_else(||invalid(\"missing length\"))?;\n    if length>1024*1024{return Err(invalid(\"message budget\"));}\n    let mut body=vec![0;length];reader.read_exact(&mut body)?;\n    Ok(Some(serde_json::from_slice(&body).map_err(|e|invalid(e.to_string()))?))\n}\npub fn write_message<W:Write>(out:&mut W,value:&Value)->io::Result<()>{\n    let bytes=serde_json::to_vec(value).map_err(io::Error::other)?;\n    write!(out,\"Content-Length: {}\\r\\n\\r\\n\",bytes.len())?;out.write_all(&bytes)?;out.flush()\n}\npub fn utf16_position(source:&str,offset:usize)->Option<(usize,usize)>{\n    let prefix=source.get(..offset)?;let line=prefix.bytes().filter(|&b|b==b'\\n').count();\n    let character=prefix.rsplit('\\n').next()?.encode_utf16().count();Some((line,character))\n}\nfn publish(uri:&str,text:&str,version:i64)->Value{\n    let diagnostics=match engine::parse(text){\n        Ok(tree)=>engine::check_names(&tree,&BTreeSet::from([\"subtotal\",\"shipping\",\"discount\"])),\n        Err(error)=>vec![error],\n    };\n    let diagnostics:Vec<_>=diagnostics.into_iter().map(|d|{\n        let (sl,sc)=utf16_position(text,d.span.start).unwrap_or((0,0));\n        let (el,ec)=utf16_position(text,d.span.end).unwrap_or((sl,sc));\n        json!({\"range\":{\"start\":{\"line\":sl,\"character\":sc},\"end\":{\"line\":el,\"character\":ec}},\"severity\":1,\"code\":d.code,\"source\":\"rule-lsp\",\"message\":d.message})\n    }).collect();\n    json!({\"jsonrpc\":\"2.0\",\"method\":\"textDocument/publishDiagnostics\",\"params\":{\"uri\":uri,\"version\":version,\"diagnostics\":diagnostics}})\n}\nstruct Document{version:i64,text:String}\n#[derive(Default)]\npub struct Server{documents:BTreeMap<String,Document>,initialized:bool,shutdown:bool,exit:Option<u8>}\nimpl Server{\n    pub fn exit_code(&self)->Option<u8>{self.exit}\n    pub fn is_shutdown(&self)->bool{self.shutdown}\n    fn error(id:Option<Value>,code:i32,message:&str)->Vec<Value>{\n        id.map(|id|vec![json!({\"jsonrpc\":\"2.0\",\"id\":id,\"error\":{\"code\":code,\"message\":message}})]).unwrap_or_default()\n    }\n    pub fn handle(&mut self,message:Value)->Vec<Value>{\n        let id=message.get(\"id\").cloned();\n        if message.get(\"jsonrpc\").and_then(Value::as_str)!=Some(\"2.0\"){return Self::error(id,-32600,\"invalid JSON-RPC version\");}\n        let method=message.get(\"method\").and_then(Value::as_str).unwrap_or(\"\");\n        if method==\"exit\"{self.exit=Some(if self.shutdown{0}else{1});return vec![];}\n        if self.shutdown{return Self::error(id,-32600,\"server shut down\");}\n        if method==\"initialize\"{\n            if self.initialized{return Self::error(id,-32600,\"already initialized\");}\n            self.initialized=true;\n            return id.map(|id|vec![json!({\"jsonrpc\":\"2.0\",\"id\":id,\"result\":{\"capabilities\":{\"positionEncoding\":\"utf-16\",\"textDocumentSync\":1},\"serverInfo\":{\"name\":\"rule-lsp\",\"version\":\"0.1.0\"}}})]).unwrap_or_default();\n        }\n        if !self.initialized{return Self::error(id,-32002,\"server not initialized\");}\n        let params=&message[\"params\"];\n        match method{\n            \"initialized\"=>vec![],\n            \"shutdown\"=>{self.shutdown=true;id.map(|id|vec![json!({\"jsonrpc\":\"2.0\",\"id\":id,\"result\":null})]).unwrap_or_default()},\n            \"textDocument/didOpen\"=>{\n                let doc=&params[\"textDocument\"];\n                let (Some(uri),Some(text),Some(version))=(doc[\"uri\"].as_str(),doc[\"text\"].as_str(),doc[\"version\"].as_i64())else{return vec![];};\n                if text.len()>65536{self.documents.insert(uri.to_owned(),Document{version,text:String::new()});return vec![publish(uri,&\"x\".repeat(65537),version)];}\n                self.documents.insert(uri.to_owned(),Document{version,text:text.to_owned()});\n                vec![publish(uri,text,version)]\n            },\n            \"textDocument/didChange\"=>{\n                let (Some(uri),Some(version))=(params[\"textDocument\"][\"uri\"].as_str(),params[\"textDocument\"][\"version\"].as_i64())else{return vec![];};\n                let Some(changes)=params[\"contentChanges\"].as_array()else{return vec![];};\n                if changes.len()!=1||changes[0].get(\"range\").is_some(){return vec![];}\n                let Some(text)=changes[0][\"text\"].as_str()else{return vec![];};\n                let Some(doc)=self.documents.get_mut(uri)else{return vec![];};\n                if version<=doc.version{return vec![];}\n                if text.len()>65536{doc.version=version;doc.text=String::new();return vec![publish(uri,&\"x\".repeat(65537),version)];}\n                doc.version=version;doc.text=text.to_owned();\n                vec![publish(uri,&doc.text,doc.version)]\n            },\n            \"textDocument/didClose\"=>{\n                let Some(uri)=params[\"textDocument\"][\"uri\"].as_str()else{return vec![];};self.documents.remove(uri);\n                vec![json!({\"jsonrpc\":\"2.0\",\"method\":\"textDocument/publishDiagnostics\",\"params\":{\"uri\":uri,\"diagnostics\":[]}})]\n            },\n            _=>Self::error(id,-32601,\"method not supported\"),\n        }\n    }\n}\n#[cfg(test)]\nmod tests{\n    use super::*;\n    #[test]\n    fn framing_utf8_and_small_reads(){\n        let message=json!({\"text\":\"Tiếng Việt 😃\"});let mut bytes=Vec::new();write_message(&mut bytes,&message).unwrap();\n        let mut reader=io::BufReader::with_capacity(1,io::Cursor::new(bytes));assert_eq!(read_message(&mut reader).unwrap(),Some(message));assert!(read_message(&mut reader).unwrap().is_none());\n        assert!(read_message(&mut io::Cursor::new(b\"Content-Length: 10000000\\r\\n\\r\\n\")).is_err());\n        assert!(read_message(&mut io::Cursor::new(b\"Content-Length: 3\\r\\n\\r\\n{}\")).is_err());\n    }\n    #[test]\n    fn unicode_positions(){\n        assert_eq!(utf16_position(\"a😃b\",5),Some((0,3)));assert_eq!(utf16_position(\"a😃b\",2),None);\n    }\n    #[test]\n    fn diagnostics_and_stale_versions(){\n        let mut server=Server::default();\n        server.handle(json!({\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{}}));\n        let open=server.handle(json!({\"jsonrpc\":\"2.0\",\"method\":\"textDocument/didOpen\",\"params\":{\"textDocument\":{\"uri\":\"file:///rule\",\"version\":1,\"text\":\"subtotal+missing\"}}}));\n        assert_eq!(open[0][\"params\"][\"diagnostics\"][0][\"code\"],\"unknown_name\");\n        let change=server.handle(json!({\"jsonrpc\":\"2.0\",\"method\":\"textDocument/didChange\",\"params\":{\"textDocument\":{\"uri\":\"file:///rule\",\"version\":2},\"contentChanges\":[{\"text\":\"subtotal+1\"}]}}));\n        assert_eq!(change[0][\"params\"][\"diagnostics\"].as_array().unwrap().len(),0);\n        let stale=server.handle(json!({\"jsonrpc\":\"2.0\",\"method\":\"textDocument/didChange\",\"params\":{\"textDocument\":{\"uri\":\"file:///rule\",\"version\":1},\"contentChanges\":[{\"text\":\"bad\"}]}}));\n        assert!(stale.is_empty());\n        let close=server.handle(json!({\"jsonrpc\":\"2.0\",\"method\":\"textDocument/didClose\",\"params\":{\"textDocument\":{\"uri\":\"file:///rule\"}}}));\n        assert!(close[0][\"params\"][\"diagnostics\"].as_array().unwrap().is_empty());\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use std::{io,process::ExitCode};\nfn run()->io::Result<u8>{\n    let mut server=rule_lsp::Server::default();let input=io::stdin();let output=io::stdout();let mut reader=input.lock();let mut writer=output.lock();\n    while let Some(message)=rule_lsp::read_message(&mut reader)?{\n        for response in server.handle(message){rule_lsp::write_message(&mut writer,&response)?;}\n        if let Some(code)=server.exit_code(){return Ok(code);}\n    }\n    Ok(if server.is_shutdown(){0}else{1})\n}\nfn main()->ExitCode{match run(){Ok(code)=>ExitCode::from(code),Err(error)=>{eprintln!(\"rule-lsp: {error}\");ExitCode::from(2)}}}\n"
          },
          {
            "path": "tests/session.rs",
            "content": "use std::{io::{self,Write},process::{Command,Stdio}};\nuse serde_json::json;\n#[test]\nfn real_stdio_session(){\n    let mut input=Vec::new();\n    let messages=[\n        json!({\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{}}),\n        json!({\"jsonrpc\":\"2.0\",\"method\":\"initialized\",\"params\":{}}),\n        json!({\"jsonrpc\":\"2.0\",\"method\":\"textDocument/didOpen\",\"params\":{\"textDocument\":{\"uri\":\"file:///fee.rule\",\"languageId\":\"rule\",\"version\":1,\"text\":\"subtotal + unknown\"}}}),\n        json!({\"jsonrpc\":\"2.0\",\"method\":\"textDocument/didChange\",\"params\":{\"textDocument\":{\"uri\":\"file:///fee.rule\",\"version\":2},\"contentChanges\":[{\"text\":\"subtotal + shipping\"}]}}),\n        json!({\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"shutdown\",\"params\":null}),\n        json!({\"jsonrpc\":\"2.0\",\"method\":\"exit\",\"params\":null}),\n    ];\n    for message in messages{rule_lsp::write_message(&mut input,&message).unwrap();}\n    let mut child=Command::new(env!(\"CARGO_BIN_EXE_rule-lsp\")).stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped()).spawn().unwrap();\n    child.stdin.take().unwrap().write_all(&input).unwrap();\n    let output=child.wait_with_output().unwrap();assert!(output.status.success());assert!(output.stderr.is_empty());\n    let mut reader=io::Cursor::new(output.stdout);let mut replies=Vec::new();\n    while let Some(message)=rule_lsp::read_message(&mut reader).unwrap(){replies.push(message);}\n    assert_eq!(replies.len(),4);assert_eq!(replies[0][\"result\"][\"capabilities\"][\"positionEncoding\"],\"utf-16\");\n    assert_eq!(replies[1][\"params\"][\"diagnostics\"][0][\"code\"],\"unknown_name\");\n    assert_eq!(replies[2][\"params\"][\"diagnostics\"].as_array().unwrap().len(),0);\n    assert_eq!(replies[3][\"id\"],2);\n}\n"
          },
          {
            "path": "client_demo.py",
            "content": "import json, subprocess\n\ndef frame(message):\n    body = json.dumps(message, ensure_ascii=False).encode(\"utf-8\")\n    return (\"Content-Length: \" + str(len(body)) + \"\\r\\n\\r\\n\").encode(\"ascii\") + body\n\nmessages = [\n    {\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{}},\n    {\"jsonrpc\":\"2.0\",\"method\":\"initialized\",\"params\":{}},\n    {\"jsonrpc\":\"2.0\",\"method\":\"textDocument/didOpen\",\"params\":{\"textDocument\":{\"uri\":\"file:///demo.rule\",\"languageId\":\"rule\",\"version\":1,\"text\":\"subtotal + missing\"}}},\n    {\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"shutdown\",\"params\":None},\n    {\"jsonrpc\":\"2.0\",\"method\":\"exit\",\"params\":None},\n]\nresult = subprocess.run([\"target/debug/rule-lsp\"], input=b\"\".join(map(frame,messages)), capture_output=True, check=True)\nprint(result.stdout.decode(\"utf-8\"))\n"
          },
          {
            "path": "README.md",
            "content": "# Rule-LSP\ncargo test\ncargo build\npython3 client_demo.py\n\nTransport stdio: Content-Length theo bytes UTF-8, header ASCII CRLF, header tối đa 8 KiB, message tối đa 1 MiB. stdout chỉ protocol; log lỗi đi stderr. Framing/JSON hỏng kết thúc session có lỗi.\nInitialize công bố positionEncoding utf-16 và textDocumentSync=1 (full). Hỗ trợ initialize/initialized/didOpen/didChange/didClose/shutdown/exit. Không hỗ trợ incremental range edits, completion, hover, rename hoặc semantic tokens. Client phải gửi full document change theo capability.\nSource DSL cùng Rulecheck: expression i64, biến subtotal/shipping/discount, checked runtime semantics ở evaluator; diagnostic server chỉ parse và kiểm tra tên, không chạy biểu thức với dữ liệu giả. First syntax error + unknown names; recovery nhiều syntax error là nhiệm vụ mở rộng.\nDocument source 64 KiB, token 8192, AST/nesting 64. Diagnostic gắn version; thay đổi version cũ bị bỏ; close xóa diagnostic. Vị trí byte được chuyển UTF-16. Baseline đồng bộ; xử lý async cần snapshot/version/cancellation trước publish.\nCapstone: nối editor client thật, thêm bool/conditional/type checking, recovery, incremental cache và test invalidation, recording sửa nhanh nhiều document, protocol fuzz budgets. Không coi stdio handshake là bằng chứng đầy đủ cho UX editor.\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo build",
          "python3 client_demo.py"
        ],
        "checks": [
          "Process session initialize/open/change/shutdown/exit đi qua binary thật.",
          "Diagnostics có UTF-16 range và version; edit cũ bị bỏ, close xóa lỗi.",
          "Frame Unicode, message bị cắt và length quá lớn có test.",
          "Không ghi log vào stdout; source/AST budget được kiểm tra."
        ]
      },
      "moduleId": "track-compiler",
      "starterCode": "\nfn update(current: &mut (i64, String), version: i64, text: &str) -> bool {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    let mut doc=(1,\"bad\".to_owned());\n    assert!(update(&mut doc,2,\"good\"));\n    assert!(!update(&mut doc,1,\"old\"));\n    assert!(!update(&mut doc,2,\"duplicate\"));\n    assert_eq!(doc,(2,\"good\".to_owned()));\n    assert!(update(&mut doc,5,\"new\"));\n    assert_eq!(doc.0,5);\n    println!(\"Document cũ không ghi đè phiên mới\");\n}",
      "solutionCode": "\nfn update(current: &mut (i64, String), version: i64, text: &str) -> bool {\n    if version <= current.0 { return false; }\n    *current = (version, text.to_owned());\n    true\n}\nfn main() {\n    let mut doc=(1,\"bad\".to_owned());\n    assert!(update(&mut doc,2,\"good\"));\n    assert!(!update(&mut doc,1,\"old\"));\n    assert!(!update(&mut doc,2,\"duplicate\"));\n    assert_eq!(doc,(2,\"good\".to_owned()));\n    assert!(update(&mut doc,5,\"new\"));\n    assert_eq!(doc.0,5);\n    println!(\"Document cũ không ghi đè phiên mới\");\n}"
    }
  ],
  "projects": [
    {
      "id": "compiler-project-rulecheck",
      "title": "Rulecheck: DSL cho công thức nghiệp vụ",
      "description": "Lexer/Pratt parser/AST/evaluator checked i64, biến từ input và diagnostic có span, chạy qua CLI thật.",
      "level": "guided",
      "estimatedHours": 12,
      "labLessonId": "compiler-expression-project",
      "requirements": [
        "Grammar và semantics được viết cùng fixture, không giả định là full Rust.",
        "Token/AST có span đúng UTF-8; precedence và associativity đúng.",
        "Unknown name, overflow, zero và source/AST budgets có lỗi rõ.",
        "CLI không lặp logic thư viện, process test kiểm tra output/status."
      ],
      "milestones": [
        {
          "title": "Đặc tả và lexer",
          "tasks": [
            "Ghi grammar và checked arithmetic semantics.",
            "Test spans, literal biên và ký tự lạ."
          ],
          "acceptance": "Mọi token/span đúng source hoặc diagnostic rõ."
        },
        {
          "title": "Parser và AST",
          "tasks": [
            "Test unary/precedence/associativity/ngoặc.",
            "Giới hạn nesting và cây lệch dài."
          ],
          "acceptance": "Không panic hoặc đệ quy không giới hạn với fixture âm."
        },
        {
          "title": "Tên và evaluate",
          "tasks": [
            "Tách environment khỏi parser.",
            "Kiểm tra lỗi arithmetic và unknown name tại đúng span."
          ],
          "acceptance": "Kết quả và loại lỗi khớp đặc tả."
        },
        {
          "title": "Bàn giao frontend",
          "tasks": [
            "Chạy binary fixture cùng variables.",
            "Thêm Bool/conditional như bước mở rộng có type rules."
          ],
          "acceptance": "Có source, grammar, tests và demo lỗi tái hiện."
        }
      ],
      "testCases": [
        {
          "name": "Precedence và associativity",
          "setup": "2+3*4, (2+3)*4, 10-3-2.",
          "expected": "14,20,5 theo grammar."
        },
        {
          "name": "Tên thiếu",
          "setup": "subtotal+missing với environment chỉ có subtotal.",
          "expected": "unknown_name ở span của missing."
        },
        {
          "name": "Arithmetic lỗi",
          "setup": "1/0 và MAX+1.",
          "expected": "division_zero/overflow, không wrap."
        },
        {
          "name": "AST budget",
          "setup": "Ngoặc sâu và chuỗi 100 toán hạng.",
          "expected": "Từ chối depth có kiểm soát, không stack overflow."
        }
      ],
      "rubric": [
        {
          "id": "compiler-rule-spec",
          "title": "Đặc tả",
          "criteria": [
            "Grammar và semantics đủ để dự đoán fixture.",
            "Mọi tính năng chưa hỗ trợ được nêu rõ."
          ],
          "critical": true
        },
        {
          "id": "compiler-rule-front",
          "title": "Frontend",
          "criteria": [
            "Lexer/AST/span đúng, precedence đúng.",
            "Budget nesting/AST/token có test."
          ],
          "critical": true
        },
        {
          "id": "compiler-rule-errors",
          "title": "Lỗi",
          "criteria": [
            "Unknown-name/overflow/zero có code/span.",
            "Input sai không panic."
          ],
          "critical": true
        },
        {
          "id": "compiler-rule-proof",
          "title": "Bằng chứng",
          "criteria": [
            "Unit và process test thật.",
            "Lệnh demo từ checkout sạch."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Source và grammar/semantics.",
        "Fixture đúng/sai cùng expected result.",
        "Unit/process test output.",
        "Ghi phạm vi DSL và hướng mở rộng type checking."
      ]
    },
    {
      "id": "compiler-project-policy-vm",
      "title": "Policy-VM: artifact quy tắc và máy ảo",
      "description": "Compiler labels→bytecode, encoding versioned, typed-stack verifier, runtime có fuel và checked arithmetic.",
      "level": "independent",
      "estimatedHours": 20,
      "labLessonId": "compiler-vm-project",
      "requirements": [
        "Compiler giải labels và kiểm tra instruction arity.",
        "PLCY format explicit, decoder giới hạn và không trailing bytes.",
        "Verifier đảm bảo stack/type/merge/jump; runtime vẫn có fuel và lỗi dữ liệu.",
        "Frontend lowering hoặc optimizer mở rộng có differential tests với oracle."
      ],
      "milestones": [
        {
          "title": "Instruction set và compiler",
          "tasks": [
            "Ghi stack effect và input slots.",
            "Compile labels, test duplicate/unknown."
          ],
          "acceptance": "Source hợp lệ thành code; lỗi có vị trí dòng."
        },
        {
          "title": "Artifact",
          "tasks": [
            "Encode/decode với version và budget.",
            "Test golden bytes, truncation từng vị trí và opcode lạ."
          ],
          "acceptance": "Decoder không panic/cấp phát theo length vô hạn."
        },
        {
          "title": "Verifier/runtime",
          "tasks": [
            "Kiểm tra branches và merge states.",
            "Test fuel, zero, overflow và input domain."
          ],
          "acceptance": "Bytecode sai bị chặn trước execute; chương trình lặp bị budget chặn."
        },
        {
          "title": "Nối frontend và tối ưu",
          "tasks": [
            "Lower expression/conditional xuống VM.",
            "So evaluator trước/sau tối ưu trên fixture và generated cases."
          ],
          "acceptance": "Cả kết quả và loại lỗi được giữ theo semantics."
        }
      ],
      "testCases": [
        {
          "name": "Ngưỡng phí",
          "setup": "subtotal 9999 và 10000.",
          "expected": "500 và 0 cent."
        },
        {
          "name": "Merge sai",
          "setup": "Hai nhánh tới join với độ sâu khác.",
          "expected": "Verifier từ chối."
        },
        {
          "name": "Bytecode cắt",
          "setup": "Cắt artifact ở từng offset.",
          "expected": "Mọi bản thiếu đều decode lỗi."
        },
        {
          "name": "Vòng lặp",
          "setup": "jmp về cùng label.",
          "expected": "Verifier cấu trúc chấp nhận, runtime hết fuel."
        },
        {
          "name": "Không ghi đè",
          "setup": "Compile tới output tồn tại.",
          "expected": "CLI trả lỗi, file cũ giữ nguyên."
        }
      ],
      "rubric": [
        {
          "id": "compiler-vm-format",
          "title": "Artifact",
          "criteria": [
            "Encoding/version/endian tường minh.",
            "Golden/negative tests độc lập round-trip."
          ],
          "critical": true
        },
        {
          "id": "compiler-vm-verify",
          "title": "Verifier",
          "criteria": [
            "Target, slot, stack/type và merge được kiểm tra.",
            "IR không hợp lệ không execute."
          ],
          "critical": true
        },
        {
          "id": "compiler-vm-runtime",
          "title": "Runtime",
          "criteria": [
            "Fuel, checked arithmetic và input domain.",
            "Không tuyên bố sandbox ngoài instruction set."
          ],
          "critical": true
        },
        {
          "id": "compiler-vm-semantics",
          "title": "Frontend/optimization",
          "criteria": [
            "Lowering hoặc pass mở rộng có oracle.",
            "So cả lỗi lẫn giá trị."
          ],
          "critical": true
        },
        {
          "id": "compiler-vm-handover",
          "title": "Bàn giao",
          "criteria": [
            "Spec opcode, fixture artifact và CLI demo.",
            "Báo cáo fuzz/budget và phần chưa kiểm chứng."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Compiler/VM và bytecode spec.",
        "Golden artifacts và malformed corpus.",
        "Verifier/runtime/differential tests.",
        "Demo business rule và báo cáo budget."
      ]
    },
    {
      "id": "compiler-project-rule-lsp",
      "title": "Rule-LSP: công cụ hỗ trợ viết quy tắc",
      "description": "Language server stdio dùng frontend thật, full sync, diagnostic UTF-16/version, mở rộng type checking và editor integration.",
      "level": "capstone",
      "estimatedHours": 30,
      "labLessonId": "compiler-tooling-project",
      "requirements": [
        "Content-Length theo byte và framing có giới hạn; stdout chỉ protocol.",
        "Initialize capabilities khớp những method thực hiện.",
        "Document version/snapshot và Unicode range đúng, close xóa diagnostic.",
        "Hoàn thiện type checking/recovery và editor client thực; nếu incremental thì có invalidation tests."
      ],
      "milestones": [
        {
          "title": "Protocol và lifecycle",
          "tasks": [
            "Chạy client demo và process handshake.",
            "Test fragmented frames, EOF, length giả, shutdown/exit."
          ],
          "acceptance": "Session đúng giao thức, lỗi không làm stdout chứa log."
        },
        {
          "title": "Document analysis",
          "tasks": [
            "Giữ URI/version/text và chuyển UTF-16.",
            "Test open/change/close, stale version, nhiều document."
          ],
          "acceptance": "Diagnostic thuộc source hiện tại và xóa khi đóng."
        },
        {
          "title": "Ngôn ngữ sâu hơn",
          "tasks": [
            "Thêm Bool/conditional, type checking và recovery.",
            "Thêm cache hoặc async chỉ khi có snapshot/invalidation tests."
          ],
          "acceptance": "Source sai không chạy code; lỗi chính không bị diagnostic dây chuyền che."
        },
        {
          "title": "Editor và nghiệm thu",
          "tasks": [
            "Nối editor client thật, ghi lại thao tác sửa nhanh.",
            "Chạy malformed corpus/fuzz có budget và thu regression."
          ],
          "acceptance": "Reviewer tái hiện UI diagnostic, lỗi transport và recovery."
        }
      ],
      "testCases": [
        {
          "name": "Frame Unicode chia nhỏ",
          "setup": "Body tiếng Việt/emoji đọc từng byte.",
          "expected": "Length/range đúng, message không bị cắt."
        },
        {
          "name": "Edit lỗi thời",
          "setup": "Version2 hợp lệ rồi version1 sai.",
          "expected": "Không publish lỗi từ version1."
        },
        {
          "name": "Close",
          "setup": "Đóng document đang có diagnostic.",
          "expected": "Publish danh sách rỗng và xóa state."
        },
        {
          "name": "Source lớn",
          "setup": "Vượt 64 KiB hoặc AST depth64.",
          "expected": "Diagnostic budget, server còn kiểm soát session."
        },
        {
          "name": "Editor thật",
          "setup": "Sửa nhanh nhiều URI, thiếu ngoặc, thêm tên lạ rồi sửa đúng.",
          "expected": "Diagnostic đúng vị trí/phiên, không kẹt hoặc lẫn document."
        }
      ],
      "rubric": [
        {
          "id": "compiler-lsp-protocol",
          "title": "Protocol",
          "criteria": [
            "Framing bytes, budgets và lifecycle có test.",
            "Capabilities không hứa method chưa có."
          ],
          "critical": true
        },
        {
          "id": "compiler-lsp-source",
          "title": "Source và snapshot",
          "criteria": [
            "UTF-16 và version đúng với Unicode/stale edits.",
            "Close và nhiều URI không lẫn trạng thái."
          ],
          "critical": true
        },
        {
          "id": "compiler-lsp-analysis",
          "title": "Analysis",
          "criteria": [
            "Type checking/recovery mở rộng có fixture.",
            "Không evaluate với dữ liệu giả để tạo lỗi compile."
          ],
          "critical": true
        },
        {
          "id": "compiler-lsp-regression",
          "title": "Độ tin cậy",
          "criteria": [
            "Malformed/fuzz corpus có budget và regression.",
            "Cache/async có invalidation/cancellation tests nếu dùng."
          ],
          "critical": true
        },
        {
          "id": "compiler-lsp-evidence",
          "title": "Nghiệm thu editor",
          "criteria": [
            "Client thật và recording thao tác.",
            "Source, test output, phạm vi và giới hạn rõ."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Server source, client setup và language spec.",
        "Protocol/native/process tests và malformed corpus.",
        "Recording editor với lỗi/sửa/Unicode/stale edits.",
        "Báo cáo latency/fuzz, cache invalidation nếu có và giới hạn hỗ trợ."
      ]
    }
  ],
  "assessment": {
    "title": "Tự đánh giá năng lực compiler và công cụ phát triển",
    "instructions": "Đối chiếu tình huống với đặc tả, source, test âm, oracle và demo editor/VM. Checklist là tự review; năng lực dự án cần bằng chứng và phản hồi reviewer, không được suy từ số bài hoặc điểm quiz.",
    "passPercent": 80,
    "questions": [
      {
        "id": "compiler-exam-01",
        "question": "Grammar nhận a/b có đủ xác định cách xử lý chia zero không?",
        "options": [
          "Không; semantics phải quy định lỗi và thứ tự đánh giá.",
          "Có với mọi compiler.",
          "Có nếu lexer dùng UTF-8."
        ],
        "correct": 0,
        "explanation": "Grammar mô tả hình dạng; semantics mô tả hành vi quan sát.",
        "lessonIds": [
          "compiler-language-spec"
        ]
      },
      {
        "id": "compiler-exam-02",
        "question": "Editor dùng UTF-16 nhưng compiler giữ span byte. Cần gì?",
        "options": [
          "Dùng byte làm cột trực tiếp.",
          "Source map chuyển đơn vị theo đúng snapshot.",
          "Đổi mọi offset thành u64 là đủ."
        ],
        "correct": 1,
        "explanation": "Kiểu số không đổi đơn vị; Unicode cần chuyển UTF-8 bytes sang UTF-16 units.",
        "lessonIds": [
          "compiler-lexer-spans",
          "compiler-source-map"
        ]
      },
      {
        "id": "compiler-exam-03",
        "question": "Parser thêm diagnostic nhưng không tiêu thụ token hoặc kết thúc có rủi ro gì?",
        "options": [
          "Không có.",
          "Chỉ mất màu syntax.",
          "Lặp vô hạn trên input lỗi."
        ],
        "correct": 2,
        "explanation": "Recovery cần invariant tiến triển và budget.",
        "lessonIds": [
          "compiler-error-recovery"
        ]
      },
      {
        "id": "compiler-exam-04",
        "question": "10-3-2 trong grammar left-associative của Rulecheck được hiểu thế nào?",
        "options": [
          "10-(3-2), kết quả9.",
          "(10-3)-2, kết quả5.",
          "Parser tùy ý chọn."
        ],
        "correct": 1,
        "explanation": "Binding powers phải giữ associativity đã đặc tả.",
        "lessonIds": [
          "compiler-parser-precedence",
          "compiler-expression-project"
        ]
      },
      {
        "id": "compiler-exam-05",
        "question": "Tên chưa khai báo đã gây lỗi. Vì sao có thể lan kiểu Error?",
        "options": [
          "Để chạy chương trình bất chấp lỗi.",
          "Để biến tên thành0.",
          "Để hạn chế diagnostic thứ cấp trong khi vẫn giữ trạng thái thất bại."
        ],
        "correct": 2,
        "explanation": "Error type hỗ trợ phục hồi phân tích, không chứng minh source hợp lệ.",
        "lessonIds": [
          "compiler-type-diagnostics",
          "compiler-type-inference"
        ]
      },
      {
        "id": "compiler-exam-06",
        "question": "Một biến cùng tên ở scope trong có nên tự dùng cùng symbol ID với biến ngoài?",
        "options": [
          "Không; resolution phải phản ánh định nghĩa và quy tắc scope.",
          "Có nếu cùng type.",
          "Luôn có vì spelling giống."
        ],
        "correct": 0,
        "explanation": "Tên văn bản khác identity của định nghĩa; shadowing cần liên kết đúng.",
        "lessonIds": [
          "compiler-name-resolution"
        ]
      },
      {
        "id": "compiler-exam-07",
        "question": "CFG hợp lệ có vòng lặp tự nhảy có chứng minh termination?",
        "options": [
          "Có vì graph hữu hạn.",
          "Không; budget hoặc phân tích termination là câu hỏi riêng.",
          "Có vì mọi target hợp lệ."
        ],
        "correct": 1,
        "explanation": "Chu kỳ hữu hạn trong graph vẫn có thể chạy vô hạn.",
        "lessonIds": [
          "compiler-control-flow",
          "compiler-ir-execution"
        ]
      },
      {
        "id": "compiler-exam-08",
        "question": "x chỉ được gán ở một predecessor reachable. Must analysis ở join dùng gì?",
        "options": [
          "Union giữ x.",
          "Đếm số dòng source.",
          "Intersection loại x khỏi chắc chắn đã gán."
        ],
        "correct": 2,
        "explanation": "Must cần đúng trên mọi đường đi vào.",
        "lessonIds": [
          "compiler-dataflow"
        ]
      },
      {
        "id": "compiler-exam-09",
        "question": "Decoder thành công cho Add,Ret nhưng stack ban đầu rỗng. Làm gì?",
        "options": [
          "Chạy thử rồi sửa lỗi.",
          "Verifier từ chối trước thực thi.",
          "Bỏ Add tự động."
        ],
        "correct": 1,
        "explanation": "Format hợp lệ khác stack/type semantics hợp lệ.",
        "lessonIds": [
          "compiler-bytecode-format",
          "compiler-vm-project"
        ]
      },
      {
        "id": "compiler-exam-10",
        "question": "Thay (1/0)*0 bằng0 có giữ semantics checked của DSL không?",
        "options": [
          "Có nếu compile release.",
          "Có theo đại số nên luôn đúng.",
          "Không; làm mất lỗi chia zero."
        ],
        "correct": 2,
        "explanation": "Optimization phải bảo toàn lỗi và effect quan sát được.",
        "lessonIds": [
          "compiler-optimizer-correctness"
        ]
      },
      {
        "id": "compiler-exam-11",
        "question": "Round-trip encode/decode đều đạt có đủ chứng minh format đúng?",
        "options": [
          "Không; thêm golden bytes và malformed tests với oracle độc lập.",
          "Có tuyệt đối.",
          "Chỉ cần tăng kích thước random."
        ],
        "correct": 0,
        "explanation": "Hai hàm có thể cùng một lỗi, cần bằng chứng độc lập.",
        "lessonIds": [
          "compiler-testing-fuzzing"
        ]
      },
      {
        "id": "compiler-exam-12",
        "question": "Analysis version7 hoàn thành sau document đã thành version8. Cần làm gì?",
        "options": [
          "Bỏ hoặc tính lại theo snapshot hiện tại trước publish.",
          "Đổi số version kết quả thành8.",
          "Publish để người dùng tự đoán."
        ],
        "correct": 0,
        "explanation": "Diagnostic phải tương ứng source nó phân tích; đổi nhãn không đổi sự thật.",
        "lessonIds": [
          "compiler-incremental-tools",
          "compiler-tooling-project"
        ]
      }
    ],
    "skills": [
      {
        "id": "compiler-skill-1",
        "title": "Ngôn ngữ, token và vị trí nguồn",
        "description": "Viết đặc tả DSL cùng fixture âm. Chuyển byte span sang vị trí Unicode đúng consumer. Đưa fixture và lệnh tái hiện chứng minh invariant.",
        "lessonIds": [
          "compiler-language-spec",
          "compiler-lexer-spans",
          "compiler-source-map"
        ],
        "projectIds": [
          "compiler-project-rulecheck"
        ],
        "required": true
      },
      {
        "id": "compiler-skill-2",
        "title": "Parser và frontend hoàn chỉnh",
        "description": "Xây AST đúng associativity, budget và recovery. Bàn giao compiler biểu thức với CLI/test thật. Đưa fixture và lệnh tái hiện chứng minh invariant.",
        "lessonIds": [
          "compiler-parser-precedence",
          "compiler-error-recovery",
          "compiler-expression-project"
        ],
        "projectIds": [
          "compiler-project-rulecheck"
        ],
        "required": true
      },
      {
        "id": "compiler-skill-3",
        "title": "Tên và hệ kiểu",
        "description": "Giải tên theo scope và giữ symbol identity. Kiểm tra/infer kiểu với lỗi có nguồn gốc. Đưa fixture và lệnh tái hiện chứng minh invariant.",
        "lessonIds": [
          "compiler-name-resolution",
          "compiler-type-diagnostics",
          "compiler-type-inference"
        ],
        "projectIds": [
          "compiler-project-rulecheck",
          "compiler-project-rule-lsp"
        ],
        "required": true
      },
      {
        "id": "compiler-skill-4",
        "title": "IR và phân tích chương trình",
        "description": "Xây/validate CFG và phân biệt termination. Dùng must/may analysis với phép gộp đúng. Đưa fixture và lệnh tái hiện chứng minh invariant.",
        "lessonIds": [
          "compiler-ir-execution",
          "compiler-control-flow",
          "compiler-dataflow"
        ],
        "projectIds": [
          "compiler-project-policy-vm"
        ],
        "required": true
      },
      {
        "id": "compiler-skill-5",
        "title": "Bytecode, tối ưu và runtime",
        "description": "Giải mã phòng thủ và kiểm tra typed stack. Bảo toàn semantics của optimization, giới hạn runtime. Đưa fixture và lệnh tái hiện chứng minh invariant.",
        "lessonIds": [
          "compiler-bytecode-format",
          "compiler-optimizer-correctness",
          "compiler-vm-project"
        ],
        "projectIds": [
          "compiler-project-policy-vm"
        ],
        "required": true
      },
      {
        "id": "compiler-skill-6",
        "title": "Công cụ editor và nghiệm thu",
        "description": "Gắn diagnostic với snapshot/version đúng. Bàn giao language tool có protocol và regression tests. Đưa fixture và lệnh tái hiện chứng minh invariant.",
        "lessonIds": [
          "compiler-incremental-tools",
          "compiler-testing-fuzzing",
          "compiler-tooling-project"
        ],
        "projectIds": [
          "compiler-project-rule-lsp"
        ],
        "required": true
      }
    ]
  }
};
