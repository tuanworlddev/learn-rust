import type { SpecializationBundle } from "../specialization-types";

export const securityBundle: SpecializationBundle = {
  "track": {
    "id": "security",
    "title": "Bảo mật và phân tích nhị phân",
    "shortTitle": "Bảo mật",
    "description": "Xây parser có giới hạn, đọc metadata của ELF/PE/Mach-O và điều tra lỗi bằng property test, fuzzing, debugger và Miri.",
    "outcome": "Xây công cụ kiểm tra nhị phân có phạm vi tin cậy rõ ràng, giữ được bằng chứng tái hiện lỗi và giải thích các bất biến khi phỏng vấn hoặc review mã.",
    "prerequisites": [
      "Ownership, borrowing, lifetime và slice.",
      "Result, Option, enum, trait và chuyển kiểu bằng TryFrom.",
      "Cargo, unit test, CLI và đọc tệp.",
      "Biểu diễn số nguyên, bit/byte và kiến thức cơ bản về tiến trình."
    ],
    "technologies": [
      "object",
      "cargo-fuzz",
      "libFuzzer",
      "Miri",
      "LLDB / GDB",
      "ELF / PE / Mach-O"
    ],
    "color": "purple",
    "lessonIds": [
      "security-input-boundaries",
      "security-object-metadata",
      "security-endian-budgets",
      "security-property-fuzzing",
      "security-debugger-invariants",
      "security-triage-delivery"
    ],
    "capstone": {
      "title": "Binary Inspector: công cụ phân tích có giới hạn",
      "description": "Kết hợp bộ đọc metadata cho binary tự biên dịch với parser frame tổng hợp dành cho dữ liệu thử nghiệm. Mọi kết quả phải phân biệt điều đã xác nhận, giới hạn tài nguyên và phạm vi chưa kiểm tra.",
      "milestones": [
        {
          "title": "1. Chốt hợp đồng và tập fixture",
          "tasks": [
            "Viết mô hình đầu vào: binary tự biên dịch cho object; byte tổng hợp cho parser frame. Liệt kê quyền đọc/ghi và thông tin sẽ xuất.",
            "Chốt ngân sách 32 MiB cho binary, 256 byte cho payload frame, 256 dòng section và 80 byte cho preview tên.",
            "Tạo ít nhất 12 fixture tổng hợp bao gồm rỗng, sai magic, phiên bản lạ, cắt header, sát cap, vượt cap và byte thừa."
          ],
          "acceptance": "Có bảng ghi kỳ vọng của từng fixture; mô tả rõ has_pe_signature không xác nhận toàn bộ định dạng và object không nhận tệp tùy ý."
        },
        {
          "title": "2. Xây parser với bất biến kiểm thử được",
          "tasks": [
            "Triển khai decode/encode và Cursor với checked arithmetic, kiểm tra tổng độ dài và không cấp phát theo độ dài chưa xác nhận.",
            "Viết test cho mọi độ dài payload 0–256, từng prefix bị cắt của một frame mẫu và cursor không đổi khi đọc thất bại.",
            "Chạy test ở debug và release; thêm test độc lập có byte đáp án được viết tay."
          ],
          "acceptance": "Toàn bộ fixture có kết quả đúng ở cả hai chế độ; không dùng unsafe trong parser; round-trip không thay thế các test đáp án độc lập."
        },
        {
          "title": "3. Đọc metadata mà không thực thi input",
          "tasks": [
            "Dùng object cố định phiên bản để in format, architecture và thông tin section của binary vừa build.",
            "Đọc có giới hạn, escape tên section và phân biệt file offset, file size với memory size.",
            "Đối chiếu ít nhất một binary bằng công cụ nền tảng sẵn có, chẳng hạn llvm-readobj hoặc công cụ tương đương; ghi lệnh và phần chênh lệch có lý do."
          ],
          "acceptance": "Có báo cáo của một binary tự biên dịch, tên file và nguồn build rõ ràng; không dùng metadata để khẳng định tệp an toàn khi thực thi."
        },
        {
          "title": "4. Fuzz và lập hồ sơ điều tra",
          "tasks": [
            "Thêm harness cho parser tự viết, seed hợp lệ/sai và oracle về ngân sách cùng round-trip.",
            "Chạy smoke fuzz tối thiểu 30 giây với max_len và giới hạn bộ nhớ; ghi phiên bản, platform, seed, thời gian và thống kê.",
            "Thực hiện cmin; nếu có crash thì sao lưu, tái hiện, dùng tmin và thêm regression test. Nếu không có crash, dùng một lỗi cố ý trong nhánh thực hành riêng để diễn tập quy trình rồi bỏ lỗi trước bàn giao."
          ],
          "acceptance": "Có log chứng minh harness chạy, corpus sau cmin và một báo cáo điều tra bằng dữ liệu tổng hợp; không khẳng định smoke run chứng minh không còn lỗi."
        },
        {
          "title": "5. Đóng gói và review",
          "tasks": [
            "Lưu Cargo.lock, lệnh build/test, fixture và bảng giới hạn hỗ trợ; tách job host test khỏi fuzz nightly.",
            "Kiểm tra đầu ra với ký tự điều khiển và input vượt cap; thông báo phân biệt I/O, unsupported và malformed khi API hỗ trợ.",
            "Review nghĩa vụ của mọi unsafe nếu có bổ sung; ghi rõ Miri/sanitizer đã chạy hay chưa và khả năng nền tảng còn thiếu."
          ],
          "acceptance": "Người khác tạo lại binary và chạy bộ kiểm tra từ README được; bản giao không tự nhận là sandbox, malware scanner hoặc dịch vụ nhận tệp công khai."
        }
      ],
      "deliverables": [
        "Mã Cargo của inspector, thư viện parser, fuzz target và Cargo.lock của cả host lẫn fuzz.",
        "Bảng hợp đồng/fixture và test hồi quy cho các biên đã xác định.",
        "Báo cáo metadata của binary tự build và kết quả đối chiếu với công cụ độc lập.",
        "Log fuzz, corpus đã giảm và báo cáo tái hiện một lỗi tổng hợp.",
        "README hướng dẫn tái lập, phạm vi tin cậy, giới hạn tài nguyên và trạng thái kiểm thử từng công cụ."
      ],
      "reviewQuestions": [
        "Tại sao slice an toàn chưa đủ để ngăn từ chối dịch vụ? Giới hạn nào bảo vệ CPU và đầu ra?",
        "MZ, chữ ký PE và một PE được loader chấp nhận là ba mức kết luận khác nhau thế nào?",
        "Khi nào usize::try_from thất bại, khi nào checked_add thất bại và khi nào phép tính hợp lệ nhưng phạm vi vẫn sai?",
        "Vì sao parser không được unwrap trên dữ liệu fuzz? Oracle round-trip có thể bỏ sót lỗi nào?",
        "cmin khác tmin ra sao? Bạn giữ dữ liệu nào để người khác tái hiện cùng phát hiện?",
        "from_raw_parts cần những bất biến gì ngoài độ dài? Miri qua test có chứng minh API sound không?",
        "Bạn sẽ thay đổi kiến trúc thế nào trước khi cho phép người ngoài tải tệp lên công cụ dùng object?"
      ]
    },
    "resources": [
      {
        "label": "object: hợp đồng sử dụng và giới hạn",
        "url": "https://docs.rs/crate/object/0.40.0"
      },
      {
        "label": "Microsoft: cấu trúc PE/COFF",
        "url": "https://learn.microsoft.com/en-us/windows/win32/debug/pe-format"
      },
      {
        "label": "Rust Fuzz Book: setup",
        "url": "https://rust-fuzz.github.io/book/cargo-fuzz/setup.html"
      },
      {
        "label": "LLVM: LibFuzzer",
        "url": "https://llvm.org/docs/LibFuzzer.html"
      },
      {
        "label": "Miri: hướng dẫn và giới hạn",
        "url": "https://github.com/rust-lang/miri"
      },
      {
        "label": "Rust: from_raw_parts",
        "url": "https://doc.rust-lang.org/std/slice/fn.from_raw_parts.html"
      },
      {
        "label": "LLVM: llvm-readobj",
        "url": "https://llvm.org/docs/CommandGuide/llvm-readobj.html"
      },
      {
        "label": "Rust: escape_default",
        "url": "https://doc.rust-lang.org/std/ascii/fn.escape_default.html"
      }
    ]
  },
  "lessons": [
    {
      "id": "security-input-boundaries",
      "moduleId": "track-security",
      "title": "Mô hình đầu vào và ranh giới parser",
      "description": "Biến mô tả định dạng thành các điều kiện kiểm tra được, giới hạn tài nguyên và lỗi có ý nghĩa.",
      "duration": 50,
      "objectives": [
        "Xác định tài sản, nguồn đầu vào và điều kiện tin cậy trước khi chọn thư viện.",
        "Viết parser trả slice mượn, không panic trên dữ liệu sai và không cấp phát theo độ dài chưa kiểm tra.",
        "Phân biệt lỗi định dạng, lỗi lập trình và cạn tài nguyên."
      ],
      "sections": [
        {
          "title": "Bắt đầu bằng hợp đồng dữ liệu",
          "text": "Một công cụ đọc nhị phân cần hợp đồng trước khi cần thuật toán. Đầu vào đến từ bản build của nhóm, gói tải từ mạng hay tệp khách hàng gửi? Ai có thể thay đổi byte? Công cụ được phép đọc, ghi và sử dụng bao nhiêu tài nguyên? Với bài này, ta tự định nghĩa frame LR: hai byte magic, một byte phiên bản, hai byte độ dài little-endian và payload tối đa 256 byte. Tệp phải chứa đúng một frame. Những quyết định này cho phép phân biệt dữ liệu bị cắt, phiên bản chưa hỗ trợ và byte thừa. Nếu không chốt hợp đồng, một parser chấp nhận dữ liệu còn parser khác từ chối sẽ tạo lỗi tích hợp khó tìm."
        },
        {
          "title": "Kiểm tra trước khi tạo lát cắt",
          "text": "Không dùng dữ liệu chưa kiểm tra làm chỉ số trực tiếp. Lấy đủ năm byte header bằng get, kiểm tra magic và phiên bản, giải mã độ dài rồi so với ngân sách. Chỉ sau đó mới tính điểm cuối và lấy payload. Hàm trả Result<&[u8], ParseError> để người gọi xử lý dữ liệu không hợp lệ mà không sao chép payload. Slice trả về mượn vùng nhớ đầu vào; Rust kiểm tra nó không sống lâu hơn vùng nhớ đó. Ownership không tự xác nhận magic hay ý nghĩa độ dài. Đây là trách nhiệm của parser, được thể hiện bằng những nhánh kiểm tra rõ ràng.",
          "code": "let header = data.get(..5).ok_or(ParseError::ShortHeader)?;\nlet len = usize::from(u16::from_le_bytes([header[3], header[4]]));\nif len > MAX_PAYLOAD {\n    return Err(ParseError::Limit);\n}"
        },
        {
          "title": "Giới hạn tài nguyên là một phần của API",
          "text": "An toàn bộ nhớ không đồng nghĩa tác vụ luôn kết thúc nhanh. Một tệp nhỏ có thể khai báo nhiều phần tử, gây vòng lặp dài hoặc yêu cầu giải nén lớn. Thiết kế ngân sách cho byte đầu vào, số bản ghi, độ sâu lồng nhau và tổng byte đầu ra. Trong frame LR, độ dài 257 bị từ chối trước khi tạo Vec hay đọc payload. Với tệp trên đĩa, kiểm tra metadata chưa đủ vì tệp có thể thay đổi; giới hạn số byte thật sự đọc. Những giới hạn này phải được mô tả để người học biết trường hợp bị từ chối là chủ ý, không phải lỗi ngẫu nhiên."
        },
        {
          "title": "Từ mô hình đe dọa đến bảng kiểm thử",
          "text": "Mỗi điều kiện trong hợp đồng nên có một ví dụ hợp lệ và một ví dụ vi phạm. Thử frame rỗng, payload sát giới hạn, thiếu header, phiên bản lạ, độ dài lớn và byte thừa. Không dùng catch_unwind để biến mọi panic thành lỗi định dạng rồi bỏ qua nguyên nhân. Panic trong parser thường báo hiệu chỉ số hoặc giả định cần sửa; ParseError là đường xử lý dữ liệu sai đã dự kiến. Một bài kiểm thử không cần tạo tệp nguy hiểm: vài mảng byte tổng hợp đã đủ tái hiện đường biên. Khi sửa lỗi, giữ lại mẫu nhỏ nhất để ngăn nó quay trở lại."
        }
      ],
      "tip": "Độ dài ghi trong header là lời khai của đầu vào; chỉ dùng sau khi kiểm tra với hợp đồng và ngân sách.",
      "exercise": {
        "title": "Đọc frame LR",
        "instructions": "Hoàn thiện decode. Header gồm LR, phiên bản 1, độ dài u16 little-endian; payload tối đa 256 byte và không có byte thừa. Giữ nguyên main để kiểm tra các đường biên.",
        "requirements": [
          "Không dùng unsafe, unwrap hay cấp phát trong decode.",
          "Trả đúng ParseError theo thứ tự header, magic, phiên bản, giới hạn, tổng độ dài.",
          "Payload là slice mượn từ data, bao gồm payload rỗng."
        ]
      },
      "starterCode": "const MAX_PAYLOAD: usize = 256;\n#[derive(Debug, PartialEq, Eq)]\nenum ParseError { ShortHeader, Magic, Version, Limit, Length }\n\nfn decode(data: &[u8]) -> Result<&[u8], ParseError> {\n    todo!(\"kiểm tra header, ngân sách và tổng độ dài\")\n}\n\nfn main() {\n    assert_eq!(decode(b\"LR\\x01\\x00\\x00\"), Ok(&b\"\"[..]));\n    assert_eq!(decode(b\"LR\\x01\\x03\\x00abc\"), Ok(&b\"abc\"[..]));\n    assert_eq!(decode(b\"LR\"), Err(ParseError::ShortHeader));\n    assert_eq!(decode(b\"LR\\x02\\x00\\x00\"), Err(ParseError::Version));\n    assert_eq!(decode(b\"LR\\x01\\x01\\x01\"), Err(ParseError::Limit));\n    assert_eq!(decode(b\"LR\\x01\\x00\\x00x\"), Err(ParseError::Length));\n    assert_eq!(decode(b\"XX\\x01\\x00\\x00\"), Err(ParseError::Magic));\n    println!(\"Parser: 7 kiểm tra đạt\");\n}",
      "solutionCode": "pub const MAX_PAYLOAD: usize = 256;\n\n#[derive(Debug, PartialEq, Eq)]\npub enum ParseError {\n    ShortHeader,\n    Magic,\n    Version,\n    Limit,\n    Length,\n}\n\npub fn decode(data: &[u8]) -> Result<&[u8], ParseError> {\n    let header = data.get(..5).ok_or(ParseError::ShortHeader)?;\n    if &header[..2] != b\"LR\" {\n        return Err(ParseError::Magic);\n    }\n    if header[2] != 1 {\n        return Err(ParseError::Version);\n    }\n    let len = usize::from(u16::from_le_bytes([header[3], header[4]]));\n    if len > MAX_PAYLOAD {\n        return Err(ParseError::Limit);\n    }\n    let end = 5usize.checked_add(len).ok_or(ParseError::Length)?;\n    if end != data.len() {\n        return Err(ParseError::Length);\n    }\n    data.get(5..end).ok_or(ParseError::Length)\n}\n\nfn main() {\n    assert_eq!(decode(b\"LR\\x01\\x00\\x00\"), Ok(&b\"\"[..]));\n    assert_eq!(decode(b\"LR\\x01\\x03\\x00abc\"), Ok(&b\"abc\"[..]));\n    assert_eq!(decode(b\"LR\"), Err(ParseError::ShortHeader));\n    assert_eq!(decode(b\"LR\\x02\\x00\\x00\"), Err(ParseError::Version));\n    assert_eq!(decode(b\"LR\\x01\\x01\\x01\"), Err(ParseError::Limit));\n    assert_eq!(decode(b\"LR\\x01\\x00\\x00x\"), Err(ParseError::Length));\n    assert_eq!(decode(b\"XX\\x01\\x00\\x00\"), Err(ParseError::Magic));\n    println!(\"Parser: 7 kiểm tra đạt\");\n}",
      "expectedOutput": "Parser: 7 kiểm tra đạt",
      "hints": [
        "data.get(..5) phân biệt thiếu header trước khi đọc các trường.",
        "u16::from_le_bytes nhận mảng hai byte; usize::from không cắt mất bit của u16.",
        "So sánh điểm cuối với data.len() để từ chối cả thiếu và thừa payload."
      ],
      "quiz": {
        "question": "Một parser chỉ dùng safe Rust đã đủ để xử lý tệp bất kỳ trong dịch vụ công khai chưa?",
        "options": [
          "Đủ, borrow checker giới hạn cả CPU và bộ nhớ cấp phát.",
          "Chưa; vẫn cần kiểm tra ngữ nghĩa, giới hạn tài nguyên và thiết kế cách ly phù hợp.",
          "Đủ nếu bọc toàn bộ hàm bằng catch_unwind.",
          "Chỉ cần tăng bộ nhớ của máy chủ."
        ],
        "correct": 1,
        "explanation": "Safe Rust giúp ngăn nhiều lỗi bộ nhớ, nhưng không tự giới hạn vòng lặp, cấp phát, giải nén hay độ phức tạp của thuật toán."
      },
      "reference": {
        "label": "Rust std: slice::get",
        "url": "https://doc.rust-lang.org/std/primitive.slice.html#method.get"
      }
    },
    {
      "id": "security-object-metadata",
      "moduleId": "track-security",
      "title": "Đọc ELF, PE và Mach-O bằng object",
      "description": "Nhận diện cấu trúc định dạng và xây công cụ đọc metadata có phạm vi đầu vào rõ ràng.",
      "duration": 70,
      "objectives": [
        "Phân biệt file offset, địa chỉ ảo, section và segment.",
        "Dùng Object và ObjectSection để đọc binary tự biên dịch trên nhiều nền tảng.",
        "Hiểu giới hạn của việc nhận diện magic và hợp đồng tin cậy của thư viện object."
      ],
      "sections": [
        {
          "title": "Một định dạng, nhiều lớp thông tin",
          "text": "ELF, PE và Mach-O lưu thông tin mà linker, loader và công cụ phát triển sử dụng. Header mô tả kiến trúc và tổ chức của tệp; các bảng liên kết đến vùng dữ liệu, ký hiệu hoặc relocation. Section thường nhóm mã và dữ liệu theo mục đích, trong khi cách ánh xạ vào bộ nhớ phụ thuộc định dạng. Không suy từ tên section rằng nó luôn tồn tại hoặc luôn có nội dung trên đĩa. Binary đã strip có thể thiếu nhiều symbol. Khi đọc kết quả, hãy trả lời câu hỏi cụ thể: đây là kiến trúc nào, vùng nào chiếm byte trong tệp và thông tin nào cần debugger bổ sung?"
        },
        {
          "title": "Magic là dấu hiệu, chưa phải chứng nhận",
          "text": "Bốn byte ELF hoặc magic Mach-O giúp chọn bộ đọc phù hợp, nhưng không xác nhận toàn bộ bảng và phạm vi phía sau. Với PE, tiền tố MZ thuộc DOS header; cần đọc e_lfanew tại offset 0x3c rồi kiểm tra chữ ký PE tại vị trí đó. Bài tập chỉ kiểm tra chuỗi dấu hiệu này. Nó không xác nhận COFF header, optional header hay quy tắc loader của Windows. Đặt tên has_pe_signature để thể hiện đúng phạm vi. Trong báo cáo, tránh gọi một tệp là PE hợp lệ chỉ vì kiểm tra tiền tố thành công; sự khác biệt này ảnh hưởng cách các bước tiếp theo tin vào dữ liệu.",
          "code": "let field = bytes.get(0x3c..0x40)?;\nlet raw: [u8; 4] = field.try_into().ok()?;\nlet offset = usize::try_from(u32::from_le_bytes(raw)).ok()?;\nlet end = offset.checked_add(4)?;\nlet signature = bytes.get(offset..end)?;"
        },
        {
          "title": "Dùng API chung và giữ đúng ý nghĩa",
          "text": "object cung cấp File, Object và ObjectSection để đọc nhiều định dạng qua giao diện thống nhất. Ta có thể lấy format, architecture, endian và danh sách section mà không tự viết mọi cấu trúc header. File offset không phải địa chỉ chạy trong bộ nhớ. Với PE, RVA cũng không phải vị trí byte trên đĩa. Một section có thể có kích thước bộ nhớ nhưng không có byte tương ứng trong tệp. Lab in riêng file_offset, file_size và memory_size để người đọc không nhầm. Tên section là byte từ đầu vào: hãy escape ký tự điều khiển trước khi ghi terminal hoặc log.",
          "code": "use object::{Object, ObjectSection};\n\nlet file = object::File::parse(bytes.as_slice())?;\nfor section in file.sections() {\n    let range = section.file_range();\n    let memory_size = section.size();\n    // Hiển thị tên đã escape cùng hai loại kích thước.\n}"
        },
        {
          "title": "Chọn thư viện theo hợp đồng đầu vào",
          "text": "Tài liệu object nêu phạm vi sử dụng với đầu vào tin cậy và không cam kết phòng tránh mọi dạng từ chối dịch vụ. Vì thế lab chỉ mở binary do bạn tự biên dịch hoặc đã xác minh nguồn gốc. Không triển khai nó thành endpoint nhận tệp tùy ý rồi kết luận đã an toàn nhờ Rust. Ngân sách byte và dòng in giảm một số chi phí nhưng không giới hạn mọi thuật toán bên trong parser. Nếu sản phẩm cần dữ liệu bên ngoài, phải đánh giá thư viện, quy trình worker, giới hạn CPU và bộ nhớ ở hệ điều hành. Parser cũng không thay thế việc nghiên cứu loader khi phân tích khác biệt hành vi."
        }
      ],
      "tip": "Giữ tên cột file offset và địa chỉ ảo tách biệt; cùng một số không có nghĩa là cùng một vị trí.",
      "exercise": {
        "title": "Kiểm tra chữ ký PE an toàn",
        "instructions": "Viết has_pe_signature: yêu cầu MZ, đọc offset u32 little-endian ở 0x3c, kiểm tra bốn byte PE\\0\\0 tại offset đó. Hàm chỉ nhận diện chữ ký, không xác nhận toàn bộ PE.",
        "requirements": [
          "Tệp rỗng, header ngắn và offset vượt biên đều trả false.",
          "Dùng checked_add và get thay cho truy cập chưa kiểm tra.",
          "Không ép kiểu con trỏ hoặc thực thi byte đầu vào."
        ]
      },
      "starterCode": "fn has_pe_signature(bytes: &[u8]) -> bool {\n    todo!(\"kiểm tra MZ, e_lfanew và chữ ký PE\")\n}\n\nfn main() {\n    let mut bytes = vec![0u8; 80];\n    bytes[..2].copy_from_slice(b\"MZ\");\n    bytes[0x3c..0x40].copy_from_slice(&64u32.to_le_bytes());\n    bytes[64..68].copy_from_slice(b\"PE\\0\\0\");\n    assert!(has_pe_signature(&bytes));\n    assert!(!has_pe_signature(b\"MZ\"));\n    assert!(!has_pe_signature(b\"\"));\n    bytes[0x3c..0x40].copy_from_slice(&u32::MAX.to_le_bytes());\n    assert!(!has_pe_signature(&bytes));\n    bytes[0x3c..0x40].copy_from_slice(&64u32.to_le_bytes());\n    bytes[67] = 1;\n    assert!(!has_pe_signature(&bytes));\n    println!(\"PE signature: 5 kiểm tra đạt\");\n}",
      "solutionCode": "fn pe_signature(bytes: &[u8]) -> Option<&[u8]> {\n    if !bytes.starts_with(b\"MZ\") {\n        return None;\n    }\n    let raw: [u8; 4] = bytes.get(0x3c..0x40)?.try_into().ok()?;\n    let offset = usize::try_from(u32::from_le_bytes(raw)).ok()?;\n    let end = offset.checked_add(4)?;\n    bytes.get(offset..end)\n}\n\nfn has_pe_signature(bytes: &[u8]) -> bool {\n    pe_signature(bytes) == Some(&b\"PE\\0\\0\"[..])\n}\n\nfn main() {\n    let mut bytes = vec![0u8; 80];\n    bytes[..2].copy_from_slice(b\"MZ\");\n    bytes[0x3c..0x40].copy_from_slice(&64u32.to_le_bytes());\n    bytes[64..68].copy_from_slice(b\"PE\\0\\0\");\n    assert!(has_pe_signature(&bytes));\n    assert!(!has_pe_signature(b\"MZ\"));\n    assert!(!has_pe_signature(b\"\"));\n    bytes[0x3c..0x40].copy_from_slice(&u32::MAX.to_le_bytes());\n    assert!(!has_pe_signature(&bytes));\n    bytes[0x3c..0x40].copy_from_slice(&64u32.to_le_bytes());\n    bytes[67] = 1;\n    assert!(!has_pe_signature(&bytes));\n    println!(\"PE signature: 5 kiểm tra đạt\");\n}",
      "expectedOutput": "PE signature: 5 kiểm tra đạt",
      "hints": [
        "starts_with chấp nhận cả đầu vào ngắn và trả false.",
        "get(0x3c..0x40) phải thành công trước khi chuyển thành [u8; 4].",
        "Tách helper trả Option giúp dùng toán tử ? cho mọi trường hợp vượt biên."
      ],
      "quiz": {
        "question": "Công cụ dùng object đọc được header của một tệp. Có thể kết luận gì?",
        "options": [
          "Tệp chắc chắn an toàn để thực thi.",
          "Loader của mọi hệ điều hành sẽ diễn giải tệp giống object.",
          "Có thể đọc các thông tin mà API đã phân tích; vẫn phải xét hợp đồng đầu vào và giới hạn của thư viện.",
          "Không cần kiểm tra tài nguyên nếu tệp nhỏ hơn 32 MiB."
        ],
        "correct": 2,
        "explanation": "Đọc metadata không chứng nhận hành vi khi chạy. object không cam kết chống mọi DoS và không mô phỏng đầy đủ các loader."
      },
      "reference": {
        "label": "object 0.40: API đọc object file",
        "url": "https://docs.rs/object/0.40.0/object/"
      },
      "localLab": {
        "title": "Đọc metadata của binary tự biên dịch",
        "instructions": "Tạo dự án mới từ các tệp dưới đây. Cần Rust stable hỗ trợ edition 2024 và Cargo; thư viện object được cố định ở 0.40.0. Công cụ chỉ đọc binary do bạn tự biên dịch hoặc đã xác minh nguồn gốc, không thực thi tệp đầu vào. Giới hạn đọc 32 MiB và giới hạn số dòng chỉ là ngân sách của công cụ, không biến object thành sandbox cho dữ liệu tùy ý. Các lệnh dành cho macOS/Linux; trên Windows thêm đuôi .exe cho binary.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"binary-inspector\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\nobject = \"=0.40.0\"\n"
          },
          {
            "path": "src/main.rs",
            "content": "use object::{Object, ObjectSection};\nuse std::{error::Error, fs::File, io::{self, Read}, path::Path};\n\nconst MAX_BYTES: u64 = 32 * 1024 * 1024;\nconst MAX_SECTIONS: usize = 256;\n\nfn read_bounded(path: &Path) -> io::Result<Vec<u8>> {\n    let file = File::open(path)?;\n    if !file.metadata()?.is_file() {\n        return Err(io::Error::new(io::ErrorKind::InvalidInput, \"expected regular file\"));\n    }\n    let mut bytes = Vec::new();\n    file.take(MAX_BYTES + 1).read_to_end(&mut bytes)?;\n    if bytes.len() as u64 > MAX_BYTES {\n        return Err(io::Error::new(io::ErrorKind::InvalidData, \"file exceeds 32 MiB\"));\n    }\n    Ok(bytes)\n}\n\nfn display_name(bytes: &[u8]) -> String {\n    let mut out = String::new();\n    for &byte in bytes.iter().take(80) {\n        for escaped in std::ascii::escape_default(byte) {\n            out.push(char::from(escaped));\n        }\n    }\n    if bytes.len() > 80 {\n        out.push_str(\"...\");\n    }\n    out\n}\n\nfn inspect(bytes: &[u8]) -> Result<(), Box<dyn Error>> {\n    let file = object::File::parse(bytes)?;\n    println!(\"format={:?} arch={:?} little_endian={}\",\n        file.format(), file.architecture(), file.is_little_endian());\n    for (index, section) in file.sections().enumerate() {\n        if index == MAX_SECTIONS {\n            println!(\"sections: output truncated after {MAX_SECTIONS}\");\n            break;\n        }\n        let name = display_name(section.name_bytes()?);\n        match section.file_range() {\n            Some((offset, size)) => {\n                let end = offset.checked_add(size)\n                    .ok_or(\"section range overflow\")?;\n                if end > bytes.len() as u64 {\n                    return Err(\"section range outside file\".into());\n                }\n                println!(\"{index}: {name} file_offset={offset} file_size={size} memory_size={}\",\n                    section.size());\n            }\n            None => println!(\"{index}: {name} no_file_bytes memory_size={}\", section.size()),\n        }\n    }\n    Ok(())\n}\n\nfn main() -> Result<(), Box<dyn Error>> {\n    let mut args = std::env::args_os().skip(1);\n    let path = args.next().ok_or(\"usage: binary-inspector PATH\")?;\n    if args.next().is_some() {\n        return Err(\"expected exactly one input path\".into());\n    }\n    inspect(&read_bounded(Path::new(&path))?)\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn output_escapes_control_bytes() {\n        assert_eq!(display_name(b\"ok\\n\\x1b\"), \"ok\\\\n\\\\x1b\");\n        assert_eq!(display_name(&[b'a'; 81]).len(), 83);\n    }\n\n    #[test]\n    fn invalid_header_is_an_error() {\n        assert!(object::File::parse(&b\"not-an-object\"[..]).is_err());\n    }\n}\n"
          }
        ],
        "commands": [
          "cargo generate-lockfile",
          "cargo test --locked",
          "cargo build --locked",
          "cargo run --locked -- target/debug/binary-inspector"
        ],
        "checks": [
          "cargo test chạy hai kiểm tra; input sai định dạng trả lỗi, ký tự điều khiển trong tên không được in nguyên trạng.",
          "Binary của chính dự án được đọc thành công; format và architecture phù hợp máy biên dịch. Số section và địa chỉ thay đổi theo hệ điều hành và toolchain.",
          "Đối chiếu file offset với memory size: không giả định section chiếm cùng số byte trong tệp và trong bộ nhớ.",
          "Lưu Cargo.lock cùng mã nguồn. Không đưa binary không rõ nguồn gốc vào lab này; bài chưa triển khai worker sandbox hay bộ nạp PE/ELF/Mach-O."
        ]
      }
    },
    {
      "id": "security-endian-budgets",
      "moduleId": "track-security",
      "title": "Endian, offset và ngân sách tài nguyên",
      "description": "Kiểm tra phép toán, khoảng dữ liệu và tổng chi phí trước khi đọc hoặc cấp phát.",
      "duration": 55,
      "objectives": [
        "Giải mã số đúng endian và chuyển kiểu số không làm mất dữ liệu.",
        "Dùng checked_add, checked_mul và TryFrom cho offset từ tệp.",
        "Đặt ngân sách riêng cho kích thước đầu vào, số phần tử và dữ liệu sau giải mã."
      ],
      "sections": [
        {
          "title": "Byte order thuộc định dạng",
          "text": "Một dãy bốn byte không có giá trị số duy nhất nếu chưa biết endian. Với little-endian, byte đầu mang phần thấp; big-endian đặt phần cao trước. Dùng from_le_bytes hoặc from_be_bytes theo đặc tả, không dùng from_ne_bytes chỉ vì máy đang chạy là little-endian. Định dạng còn quyết định trường dài bao nhiêu byte và có dấu hay không. Chuyển u64 từ tệp sang usize bằng as có thể mất bit trên nền tảng hẹp hơn. TryFrom buộc chương trình xử lý trường hợp không biểu diễn được. Đây là tính đúng đắn của parser, dù tập dữ liệu trên máy phát triển chưa từng chạm giới hạn."
        },
        {
          "title": "Kiểm tra cả phép toán lẫn phạm vi",
          "text": "Để đọc vùng offset, length, cần chứng minh ba điều: hai số biểu diễn được, phép cộng không tràn và điểm cuối không vượt bộ đệm. Kiểm tra offset < file_len rồi cộng trực tiếp vẫn sai nếu length quá lớn. checked_add trả None khi tràn, phù hợp với nhánh lỗi định dạng. Với bảng gồm count phần tử kích thước stride, dùng checked_mul trước checked_add. Quy tắc vùng rỗng cũng cần nhất quán: offset bằng file_len với length bằng không là slice rỗng hợp lệ; offset vượt file_len vẫn không hợp lệ. Đừng dựa vào việc debug build panic để kiểm tra tràn.",
          "code": "let start = usize::try_from(offset).ok()?;\nlet len = usize::try_from(length).ok()?;\nlet end = start.checked_add(len)?;\nif end > file_len {\n    return None;\n}\nSome(start..end)"
        },
        {
          "title": "Ngân sách nhiều tầng",
          "text": "Giới hạn kích thước tệp không giới hạn tổng đầu ra. Một mã nén ngắn có thể mở rộng thành hàng triệu byte; một bảng nhỏ có thể trỏ lặp lại vào cùng vùng và khiến công việc bị nhân lên. Vì thế hãy đặt cap cho mỗi bản ghi, tổng số bản ghi, tổng byte giải mã và số bước xử lý. Kiểm tra trước reserve, resize hoặc vòng lặp. Nếu quy tắc cấm vùng chồng lấn, sắp xếp khoảng rồi so cặp liền kề; nếu cho phép dùng chung dữ liệu, tránh tự áp quy tắc cấm. Chính đặc tả, không phải sự tiện tay của code, quyết định điều kiện hợp lệ."
        },
        {
          "title": "Thiết kế lỗi và kiểm thử độc lập máy",
          "text": "Bài tập trả Option vì chỉ cần phân biệt vùng hợp lệ; sản phẩm thực tế nên dùng enum để tách Overflow, OutOfBounds và BudgetExceeded. Người vận hành sẽ biết cần sửa đầu vào hay tăng giới hạn đã được xem xét. Kiểm thử offset cực lớn nên xác nhận bị từ chối, không phụ thuộc lỗi chuyển kiểu hay lỗi cộng xảy ra trước trên máy 32 hoặc 64 bit. Bổ sung trường hợp sát cuối, rỗng tại cuối và vượt ngân sách dù vẫn nằm trong tệp. Khi kiểm tra hiệu năng, đo cả input bị từ chối; đường lỗi cũng có thể trở thành nơi tiêu tốn CPU hoặc tạo log quá lớn."
        }
      ],
      "tip": "Giới hạn byte đầu vào, byte đầu ra và số thao tác trả lời ba câu hỏi khác nhau; cần kiểm soát riêng.",
      "exercise": {
        "title": "Xác nhận khoảng dữ liệu",
        "instructions": "Hoàn thiện checked_region. Hàm trả khoảng usize nếu length không vượt max_len, phép chuyển kiểu và cộng hợp lệ, đồng thời khoảng nằm trong file_len.",
        "requirements": [
          "Không dùng as để chuyển offset hoặc length sang usize.",
          "Cho phép khoảng rỗng ở đúng cuối tệp.",
          "Từ chối tràn số trước mọi thao tác lấy slice."
        ]
      },
      "starterCode": "use std::ops::Range;\n\nfn checked_region(offset: u64, length: u64, file_len: usize, max_len: usize) -> Option<Range<usize>> {\n    todo!(\"chuyển kiểu có kiểm tra, xét ngân sách và điểm cuối\")\n}\n\nfn main() {\n    assert_eq!(checked_region(60, 4, 64, 8), Some(60..64));\n    assert_eq!(checked_region(60, 5, 64, 8), None);\n    assert_eq!(checked_region(u64::MAX, 2, 64, 8), None);\n    assert_eq!(checked_region(0, 9, 64, 8), None);\n    assert_eq!(checked_region(64, 0, 64, 8), Some(64..64));\n    assert_eq!(checked_region(65, 0, 64, 8), None);\n    println!(\"Phạm vi: 6 kiểm tra đạt\");\n}",
      "solutionCode": "use std::ops::Range;\n\nfn checked_region(offset: u64, length: u64, file_len: usize, max_len: usize) -> Option<Range<usize>> {\n    let start = usize::try_from(offset).ok()?;\n    let len = usize::try_from(length).ok()?;\n    if len > max_len {\n        return None;\n    }\n    let end = start.checked_add(len)?;\n    if end > file_len {\n        return None;\n    }\n    Some(start..end)\n}\n\nfn main() {\n    assert_eq!(checked_region(60, 4, 64, 8), Some(60..64));\n    assert_eq!(checked_region(60, 5, 64, 8), None);\n    assert_eq!(checked_region(u64::MAX, 2, 64, 8), None);\n    assert_eq!(checked_region(0, 9, 64, 8), None);\n    assert_eq!(checked_region(64, 0, 64, 8), Some(64..64));\n    assert_eq!(checked_region(65, 0, 64, 8), None);\n    println!(\"Phạm vi: 6 kiểm tra đạt\");\n}",
      "expectedOutput": "Phạm vi: 6 kiểm tra đạt",
      "hints": [
        "Chuyển cả offset và length bằng usize::try_from(...).ok()?.",
        "Nếu start lớn hơn file_len thì end cũng lớn hơn, kể cả length bằng không.",
        "Kiểm tra len > max_len trước khi trả khoảng, dù khoảng nằm trong file."
      ],
      "quiz": {
        "question": "Vì sao kiểm tra kích thước tệp dưới 1 MiB chưa đủ cho decoder?",
        "options": [
          "Vì usize luôn có 32 bit.",
          "Vì đầu vào nhỏ vẫn có thể tạo đầu ra lớn hoặc công việc lặp lại nhiều lần.",
          "Vì Rust không kiểm tra chỉ số slice.",
          "Vì checked_add chỉ dùng được trong debug build."
        ],
        "correct": 1,
        "explanation": "Tỷ lệ mở rộng, độ sâu và số lần tham chiếu có thể làm chi phí vượt xa kích thước đầu vào. Cần giới hạn tổng công việc và đầu ra."
      },
      "reference": {
        "label": "Rust std: usize::checked_add",
        "url": "https://doc.rust-lang.org/std/primitive.usize.html#method.checked_add"
      }
    },
    {
      "id": "security-property-fuzzing",
      "moduleId": "track-security",
      "title": "Property test và fuzzing có mục tiêu",
      "description": "Xây oracle, seed corpus và harness để tìm lỗi parser bằng dữ liệu tổng hợp.",
      "duration": 90,
      "objectives": [
        "Biến bất biến của định dạng thành property test và fuzz oracle.",
        "Phân biệt dữ liệu bị từ chối hợp lệ với panic hoặc sanitizer finding.",
        "Chạy host test riêng với fuzz nightly, thu nhỏ corpus và trường hợp gây lỗi đúng cách."
      ],
      "sections": [
        {
          "title": "Từ ví dụ đến thuộc tính",
          "text": "Kiểm thử ví dụ trả lời một trường hợp cụ thể. Property test kiểm tra quan hệ phải đúng với nhiều đầu vào: decode(encode(x)) trả x, parser không vượt ngân sách, hoặc số byte đã tiêu thụ không lớn hơn bộ đệm. Round-trip chỉ có ý nghĩa khi encoder và decoder không cùng che giấu một lỗi. Bổ sung fixture có đáp án độc lập và trường hợp từ đặc tả. Trong bài tập RLE, mỗi cặp count, value mở rộng thành count byte; count bằng không và tổng vượt cap bị từ chối. Vòng lặp kiểm tra nhiều tổ hợp là cách bắt đầu hữu ích trước khi dùng thư viện sinh dữ liệu."
        },
        {
          "title": "Harness nhỏ và oracle rõ",
          "text": "libFuzzer dùng coverage để tìm đầu vào dẫn chương trình qua những nhánh mới. Harness nhận &[u8], gọi một đường xử lý hẹp và kiểm tra bất biến. Với parser, Err thường là kết quả bình thường; đừng unwrap kết quả parse vì sẽ báo mọi dữ liệu sai thành crash. Nếu parse thành công, có thể assert độ dài trong cap và mã hóa lại đúng frame đã chấp nhận. Tránh mạng, log dài hoặc trạng thái toàn cục làm kết quả phụ thuộc thứ tự chạy. Một input nên tái hiện cùng hành vi khi được chạy lại trong môi trường đã ghi nhận.",
          "code": "fuzz_target!(|data: &[u8]| {\n    if let Ok(payload) = bounded_packet::decode(data) {\n        assert!(payload.len() <= bounded_packet::MAX_PAYLOAD);\n        let encoded = bounded_packet::encode(payload).unwrap();\n        assert_eq!(encoded.as_slice(), data);\n    }\n});"
        },
        {
          "title": "Corpus và hai kiểu thu nhỏ",
          "text": "Corpus nên có mẫu nhỏ hợp lệ, rỗng, sát biên và vài biến thể sai. Seed hợp lệ giúp fuzzer đi qua magic hoặc header để khám phá sâu hơn. cmin giảm tập corpus nhưng cố giữ coverage; tmin giảm một input vẫn tái hiện lỗi. Chúng giải quyết hai mục tiêu khác nhau. Trước khi thu nhỏ crash, lưu bản gốc cùng phiên bản mã, compiler, lệnh và platform. Sau đó biến mẫu nhỏ thành regression test có kỳ vọng chính xác. Không đưa mọi input sinh ra vào Git; giữ seed có ích và trường hợp hồi quy để việc review và chạy CI vẫn thuận tiện."
        },
        {
          "title": "Chạy theo ngân sách và diễn giải kết quả",
          "text": "Host test của lab dùng stable; fuzz cần nightly, cargo-fuzz và công cụ C++ theo nền tảng được hỗ trợ. Dùng cargo +nightly để tránh đổi mặc định của dự án. Một smoke run có giới hạn thời gian, độ dài input và bộ nhớ giúp kiểm tra harness hoạt động. Không thấy crash sau ba mươi giây chỉ chứng minh lần chạy đó không tìm thấy lỗi. Coverage mới cũng không bảo đảm kiểm tra đúng ngữ nghĩa nếu oracle yếu. Với sản phẩm, lập lịch fuzz dài hơn, lưu cấu hình và xem lại nhánh chưa tới, nhưng giữ host test nhanh để mọi thay đổi đều được kiểm tra."
        }
      ],
      "tip": "Một oracle sai có thể báo lỗi giả hoặc bỏ qua lỗi thật. Viết ví dụ độc lập để kiểm tra chính oracle.",
      "exercise": {
        "title": "Decoder RLE có thuộc tính giới hạn",
        "instructions": "Viết expand cho các cặp count, value. count phải lớn hơn 0; số byte đầu vào phải chẵn; tổng byte mở rộng không vượt limit. main kiểm tra nhiều tổ hợp và các biên.",
        "requirements": [
          "Kiểm tra tổng độ dài bằng checked_add trước resize.",
          "Không tạo phần đầu ra vượt cap rồi mới từ chối.",
          "Đầu vào rỗng trả Some(Vec::new())."
        ]
      },
      "starterCode": "fn expand(input: &[u8], limit: usize) -> Option<Vec<u8>> {\n    todo!(\"đọc từng cặp và kiểm soát tổng đầu ra\")\n}\n\nfn main() {\n    let mut cases = 0;\n    for count in 1u8..=8 {\n        for value in [0u8, 127, 255] {\n            assert_eq!(expand(&[count, value], 32), Some(vec![value; usize::from(count)]));\n            cases += 1;\n        }\n    }\n    assert_eq!(expand(&[0, 7], 32), None);\n    assert_eq!(expand(&[1], 32), None);\n    assert_eq!(expand(&[33, 9], 32), None);\n    assert_eq!(expand(&[20, 1, 20, 2], 32), None);\n    println!(\"RLE: {cases} thuộc tính và 4 biên đạt\");\n}",
      "solutionCode": "fn expand(input: &[u8], limit: usize) -> Option<Vec<u8>> {\n    if input.len() % 2 != 0 {\n        return None;\n    }\n    let mut output = Vec::new();\n    for pair in input.chunks_exact(2) {\n        let count = usize::from(pair[0]);\n        if count == 0 {\n            return None;\n        }\n        let end = output.len().checked_add(count)?;\n        if end > limit {\n            return None;\n        }\n        output.resize(end, pair[1]);\n    }\n    Some(output)\n}\n\nfn main() {\n    let mut cases = 0;\n    for count in 1u8..=8 {\n        for value in [0u8, 127, 255] {\n            assert_eq!(expand(&[count, value], 32), Some(vec![value; usize::from(count)]));\n            cases += 1;\n        }\n    }\n    assert_eq!(expand(&[0, 7], 32), None);\n    assert_eq!(expand(&[1], 32), None);\n    assert_eq!(expand(&[33, 9], 32), None);\n    assert_eq!(expand(&[20, 1, 20, 2], 32), None);\n    println!(\"RLE: {cases} thuộc tính và 4 biên đạt\");\n}",
      "expectedOutput": "RLE: 24 thuộc tính và 4 biên đạt",
      "hints": [
        "chunks_exact(2) thuận tiện nhưng cần từ chối byte dư trước khi lặp.",
        "Tính end rồi so với limit trước output.resize.",
        "Count bằng 0 là lỗi của hợp đồng bài tập, không phải lỗi truy cập bộ nhớ."
      ],
      "quiz": {
        "question": "Khác biệt đúng giữa cmin và tmin là gì?",
        "options": [
          "cmin sửa lỗi biên dịch; tmin chạy unit test.",
          "cmin giảm corpus theo coverage; tmin giảm một input vẫn tái hiện lỗi.",
          "Hai lệnh đều chứng minh parser không còn lỗi.",
          "tmin luôn thay thế được regression test."
        ],
        "correct": 1,
        "explanation": "Corpus minimization và testcase minimization có mục tiêu khác nhau. Sau khi giảm input gây lỗi, vẫn cần giữ regression test và điều tra nguyên nhân."
      },
      "reference": {
        "label": "Rust Fuzz Book: cargo-fuzz",
        "url": "https://rust-fuzz.github.io/book/cargo-fuzz/tutorial.html"
      },
      "localLab": {
        "title": "Parser có giới hạn và fuzz target",
        "instructions": "Tạo thư mục bounded-packet mới. Phần cargo test dùng Rust stable và không cần thư viện bên ngoài. Phần fuzz cần nightly, cargo-fuzz, C++ compiler và nền tảng được cargo-fuzz hỗ trợ; đây là bước riêng, không chạy trong trình biên dịch trên web. Các fixture đều được sinh từ mã của dự án. Cài nightly/cargo-fuzz một lần nếu chưa có. Không đổi toolchain mặc định của máy. Corpus minimization dùng cmin; chỉ dùng tmin với artifact thực sự tái hiện lỗi, không coi hai thao tác này là tương đương.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"bounded-packet\"\nversion = \"0.1.0\"\nedition = \"2024\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "pub const MAX_PAYLOAD: usize = 256;\n\n#[derive(Debug, PartialEq, Eq)]\npub enum ParseError {\n    ShortHeader,\n    Magic,\n    Version,\n    Limit,\n    Length,\n}\n\npub fn decode(data: &[u8]) -> Result<&[u8], ParseError> {\n    let header = data.get(..5).ok_or(ParseError::ShortHeader)?;\n    if &header[..2] != b\"LR\" {\n        return Err(ParseError::Magic);\n    }\n    if header[2] != 1 {\n        return Err(ParseError::Version);\n    }\n    let len = usize::from(u16::from_le_bytes([header[3], header[4]]));\n    if len > MAX_PAYLOAD {\n        return Err(ParseError::Limit);\n    }\n    let end = 5usize.checked_add(len).ok_or(ParseError::Length)?;\n    if end != data.len() {\n        return Err(ParseError::Length);\n    }\n    data.get(5..end).ok_or(ParseError::Length)\n}\n\npub fn encode(payload: &[u8]) -> Result<Vec<u8>, ParseError> {\n    if payload.len() > MAX_PAYLOAD {\n        return Err(ParseError::Limit);\n    }\n    let len = u16::try_from(payload.len()).map_err(|_| ParseError::Limit)?;\n    let mut frame = Vec::with_capacity(5 + payload.len());\n    frame.extend_from_slice(b\"LR\");\n    frame.push(1);\n    frame.extend_from_slice(&len.to_le_bytes());\n    frame.extend_from_slice(payload);\n    Ok(frame)\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn round_trip_all_supported_lengths() {\n        for len in 0..=MAX_PAYLOAD {\n            let payload: Vec<u8> = (0..len).map(|i| (i % 251) as u8).collect();\n            let frame = encode(&payload).unwrap();\n            assert_eq!(decode(&frame).unwrap(), payload.as_slice());\n        }\n    }\n\n    #[test]\n    fn every_truncation_and_trailing_bytes_are_rejected() {\n        let frame = encode(b\"abc\").unwrap();\n        for end in 0..frame.len() {\n            assert!(decode(&frame[..end]).is_err());\n        }\n        let mut trailing = frame;\n        trailing.push(0);\n        assert_eq!(decode(&trailing), Err(ParseError::Length));\n    }\n\n    #[test]\n    fn rejects_limits_and_unknown_version() {\n        assert_eq!(encode(&[0; 257]), Err(ParseError::Limit));\n        assert_eq!(decode(b\"LR\\x01\\x01\\x01\"), Err(ParseError::Limit));\n        assert_eq!(decode(b\"LR\\x02\\x00\\x00\"), Err(ParseError::Version));\n        assert_eq!(decode(b\"XX\\x01\\x00\\x00\"), Err(ParseError::Magic));\n        assert_eq!(decode(b\"LR\\x01\\x00\\x00\"), Ok(&b\"\"[..]));\n    }\n}\n"
          },
          {
            "path": "examples/seed_corpus.rs",
            "content": "use bounded_packet::encode;\n\nfn main() -> std::io::Result<()> {\n    let dir = std::path::Path::new(\"fuzz/corpus/parse_frame\");\n    std::fs::create_dir_all(dir)?;\n    std::fs::write(dir.join(\"empty\"), encode(b\"\").unwrap())?;\n    std::fs::write(dir.join(\"message\"), encode(b\"hello\").unwrap())?;\n    std::fs::write(dir.join(\"bad-version\"), b\"LR\\x02\\x00\\x00\")?;\n    Ok(())\n}\n"
          },
          {
            "path": "fuzz/Cargo.toml",
            "content": "[package]\nname = \"bounded-packet-fuzz\"\nversion = \"0.0.0\"\npublish = false\nedition = \"2024\"\n\n[package.metadata]\ncargo-fuzz = true\n\n[dependencies]\nlibfuzzer-sys = \"0.4\"\nbounded-packet = { path = \"..\" }\n\n[[bin]]\nname = \"parse_frame\"\npath = \"fuzz_targets/parse_frame.rs\"\ntest = false\ndoc = false\nbench = false\n\n[workspace]\nmembers = [\".\"]\n"
          },
          {
            "path": "fuzz/fuzz_targets/parse_frame.rs",
            "content": "#![no_main]\n\nuse libfuzzer_sys::fuzz_target;\n\nfuzz_target!(|data: &[u8]| {\n    if let Ok(payload) = bounded_packet::decode(data) {\n        assert!(payload.len() <= bounded_packet::MAX_PAYLOAD);\n        let encoded = bounded_packet::encode(payload).expect(\"accepted payload fits limit\");\n        assert_eq!(encoded.as_slice(), data);\n    }\n});\n"
          }
        ],
        "commands": [
          "cargo generate-lockfile",
          "cargo test --locked",
          "cargo run --locked --example seed_corpus",
          "rustup toolchain install nightly --profile minimal",
          "cargo install cargo-fuzz --locked",
          "cargo +nightly fuzz run parse_frame -- -max_total_time=30 -max_len=4096 -rss_limit_mb=512",
          "cargo +nightly fuzz cmin parse_frame"
        ],
        "checks": [
          "Ba host test qua: round-trip tất cả độ dài 0–256, mọi prefix bị cắt của frame mẫu và các trường hợp giới hạn/phiên bản.",
          "Harness coi ParseError là kết quả hợp lệ; chỉ assertion, panic hoặc sanitizer finding mới cần điều tra.",
          "Fuzz 30 giây là smoke run, không phải chứng minh parser không lỗi. Ghi toolchain, cargo-fuzz --version, seed, số lần chạy và nền tảng vào báo cáo.",
          "cmin giữ tập đầu vào hữu ích cho coverage; nếu có crash, sao lưu artifact rồi dùng cargo +nightly fuzz tmin parse_frame ĐƯỜNG_DẪN_ARTIFACT để thu nhỏ trường hợp gây lỗi.",
          "Commit mã, seed hữu ích, Cargo.lock và fuzz/Cargo.lock được sinh; dữ liệu fuzz trong lab không lấy từ tệp của người khác."
        ]
      }
    },
    {
      "id": "security-debugger-invariants",
      "moduleId": "track-security",
      "title": "Debugger, sanitizer và bất biến unsafe",
      "description": "Đi từ triệu chứng đến nguyên nhân bằng trạng thái chương trình và các công cụ phát hiện lỗi bổ sung nhau.",
      "duration": 65,
      "objectives": [
        "Đọc backtrace và xác định phép toán đầu tiên làm vi phạm bất biến.",
        "Phân biệt phạm vi của debugger, AddressSanitizer và Miri.",
        "Thiết kế API safe giữ trạng thái nhất quán ngay cả khi đọc thất bại."
      ],
      "sections": [
        {
          "title": "Tái hiện trước khi sửa",
          "text": "Khi một input làm chương trình lỗi, giữ nguyên mẫu và lệnh chạy, ghi compiler, target, feature và chế độ build. Bật backtrace để xác định chuỗi gọi; dùng debugger đặt breakpoint trước nhánh đọc gây lỗi và xem offset, length, trạng thái cursor. Vị trí crash không luôn là nơi tạo lỗi: cursor có thể đã bị tăng ở lần đọc thất bại trước đó. So sánh trạng thái với bất biến dự kiến, chẳng hạn position không vượt data.len(). Tạo kiểm thử nhỏ chỉ gọi API liên quan sẽ giúp phân biệt lỗi parser với lỗi tích hợp, đồng thời giảm thời gian mỗi lần điều tra."
        },
        {
          "title": "Mỗi công cụ trả lời một phần",
          "text": "Debugger cho phép quan sát đường thực thi và giá trị tại thời điểm dừng. AddressSanitizer phát hiện một nhóm lỗi bộ nhớ trong các đường đã chạy; nó không xác nhận đúng định dạng hoặc mọi quy tắc aliasing của Rust. Miri diễn giải mã Rust để kiểm tra nhiều dạng undefined behavior, hữu ích khi kiểm tra unsafe và API bao bọc nó. Miri có giới hạn với FFI và API hệ thống; một lần chạy thành công không chứng minh toàn bộ thư viện sound. Với lab thuần Rust, chạy host test trước, rồi dùng cargo +nightly miri test sau khi cài component phù hợp. Ghi rõ công cụ nào đã thật sự chạy.",
          "code": "rustup +nightly component add miri\ncargo +nightly miri test"
        },
        {
          "title": "Hợp đồng của unsafe phải đủ mạnh",
          "text": "Chuyển con trỏ thành slice bằng from_raw_parts đòi hỏi nhiều hơn một độ dài hợp lệ. Con trỏ phải không null, căn chỉnh đúng, trỏ tới giá trị đã khởi tạo trong một allocation còn sống; tổng kích thước và quy tắc truy cập cũng phải thỏa mãn. Điều kiện không null và alignment vẫn áp dụng cho slice rỗng. Kiểm tra địa chỉ dạng số nằm trong một khoảng không tự chứng minh provenance hoặc lifetime. Đừng tạo hàm safe nhận địa chỉ tùy ý rồi gọi unsafe bên trong. Khi có &[u8], get và chuyển mảng byte thường đã giải quyết việc đọc mà không cần mở thêm nghĩa vụ chứng minh."
        },
        {
          "title": "Trạng thái chỉ đổi sau khi thành công",
          "text": "Bài tập cursor dùng nguyên tắc giao dịch nhỏ: tính điểm cuối, xác nhận slice, rồi mới cập nhật position. Nếu checked_add hoặc get thất bại, vị trí giữ nguyên. Người gọi có thể thử cách đọc khác mà không phải đoán có bao nhiêu byte đã bị tiêu thụ. Slice trả về có lifetime của dữ liệu gốc, vì cursor không sở hữu hay sửa dữ liệu đó. Kiểm thử nên vừa xem giá trị trả về vừa xem trạng thái sau lỗi. Quy tắc này cũng áp dụng cho parser nhiều bước: nếu cần rollback toàn bộ cấu trúc, hãy lưu checkpoint hoặc parse trên cursor tạm trước khi commit."
        }
      ],
      "tip": "Một chú thích SAFETY cần giải thích từng tiền điều kiện tại chỗ gọi; câu 'đã kiểm tra độ dài' thường chưa đủ.",
      "exercise": {
        "title": "Cursor không đổi trạng thái khi lỗi",
        "instructions": "Hoàn thiện Cursor::take. Thành công trả slice và tăng position; mọi thất bại giữ nguyên vị trí. Đọc 0 byte ở cuối là hợp lệ.",
        "requirements": [
          "Chỉ dùng safe Rust và không sao chép dữ liệu.",
          "checked_add trước get; cập nhật position sau khi có slice.",
          "Lifetime slice trả về gắn với data, không phải thời gian mượn &mut self."
        ]
      },
      "starterCode": "struct Cursor<'a> {\n    data: &'a [u8],\n    position: usize,\n}\n\nimpl<'a> Cursor<'a> {\n    fn take(&mut self, len: usize) -> Option<&'a [u8]> {\n        todo!(\"xác nhận phạm vi rồi mới tăng position\")\n    }\n}\n\nfn main() {\n    let bytes = [10u8, 20, 30];\n    let mut cursor = Cursor { data: &bytes, position: 0 };\n    assert_eq!(cursor.take(2), Some(&bytes[..2]));\n    assert_eq!(cursor.position, 2);\n    assert_eq!(cursor.take(usize::MAX), None);\n    assert_eq!(cursor.position, 2);\n    assert_eq!(cursor.take(1), Some(&bytes[2..]));\n    assert_eq!(cursor.take(0), Some(&bytes[3..]));\n    assert_eq!(cursor.take(1), None);\n    assert_eq!(cursor.position, 3);\n    println!(\"Cursor giữ đúng bất biến\");\n}",
      "solutionCode": "struct Cursor<'a> {\n    data: &'a [u8],\n    position: usize,\n}\n\nimpl<'a> Cursor<'a> {\n    fn take(&mut self, len: usize) -> Option<&'a [u8]> {\n        let end = self.position.checked_add(len)?;\n        let bytes = self.data.get(self.position..end)?;\n        self.position = end;\n        Some(bytes)\n    }\n}\n\nfn main() {\n    let bytes = [10u8, 20, 30];\n    let mut cursor = Cursor { data: &bytes, position: 0 };\n    assert_eq!(cursor.take(2), Some(&bytes[..2]));\n    assert_eq!(cursor.position, 2);\n    assert_eq!(cursor.take(usize::MAX), None);\n    assert_eq!(cursor.position, 2);\n    assert_eq!(cursor.take(1), Some(&bytes[2..]));\n    assert_eq!(cursor.take(0), Some(&bytes[3..]));\n    assert_eq!(cursor.take(1), None);\n    assert_eq!(cursor.position, 3);\n    println!(\"Cursor giữ đúng bất biến\");\n}",
      "expectedOutput": "Cursor giữ đúng bất biến",
      "hints": [
        "Dùng biến end tạm, không tăng self.position ngay ở dòng đầu.",
        "Dấu ? thoát trước phép gán khi phép cộng hoặc get thất bại.",
        "data có kiểu &'a [u8], nên slice con cũng có thể mang lifetime 'a."
      ],
      "quiz": {
        "question": "Một unit test có unsafe chạy qua Miri. Kết luận nào phù hợp?",
        "options": [
          "Mọi lời gọi API trong tương lai đều sound.",
          "Không có undefined behavior được phát hiện trên lần chạy đó; vẫn cần xem hợp đồng và các đường chưa chạy.",
          "API có thể nhận con trỏ tùy ý nếu thêm catch_unwind.",
          "Không cần kiểm tra trên nền tảng khác."
        ],
        "correct": 1,
        "explanation": "Miri kiểm tra các lần thực thi cụ thể và có giới hạn. Chứng minh API safe vẫn đòi hỏi phân tích tiền điều kiện, lifetime, aliasing và mọi cách gọi hợp lệ."
      },
      "reference": {
        "label": "Rust std: tiền điều kiện của from_raw_parts",
        "url": "https://doc.rust-lang.org/std/slice/fn.from_raw_parts.html"
      }
    },
    {
      "id": "security-triage-delivery",
      "moduleId": "track-security",
      "title": "Triage, hồi quy và phát hành công cụ",
      "description": "Biến kết quả kiểm tra thành lỗi tái hiện được, bản sửa có bằng chứng và công cụ vận hành có giới hạn rõ ràng.",
      "duration": 65,
      "objectives": [
        "Phân loại lỗi dữ liệu, crash, vượt ngân sách và undefined behavior bằng bằng chứng.",
        "Viết báo cáo tái hiện tối thiểu và regression test hữu ích.",
        "Đóng gói công cụ đọc nhị phân với đầu vào, đầu ra và cấu hình tái lập được."
      ],
      "sections": [
        {
          "title": "Phân loại bằng bằng chứng",
          "text": "Đầu vào bị từ chối theo hợp đồng là kết quả bình thường. Panic do chỉ số vượt biên, timeout, bộ nhớ vượt cap và báo cáo sanitizer cần cách điều tra khác nhau. Đừng gán mức nghiêm trọng chỉ vì thấy từ crash: hãy xét ai kiểm soát đầu vào, tiến trình có quyền gì, tài sản nào bị ảnh hưởng và có tái hiện được không. Timeout có thể xuất phát từ máy bận hoặc thuật toán; chạy lại trong điều kiện ghi nhận được trước khi kết luận. Nhóm các phát hiện theo nguyên nhân và vị trí lỗi hữu ích hơn nhóm chỉ theo chuỗi thông báo giống nhau."
        },
        {
          "title": "Bản sửa cần trường hợp hồi quy",
          "text": "Một báo cáo tốt chứa phiên bản hoặc commit, target, feature, toolchain, lệnh chạy, input tối thiểu, kết quả mong đợi và kết quả thực tế. Giữ backtrace liên quan và cách tạo mẫu; tránh đính kèm dữ liệu riêng của khách hàng khi có thể dùng dữ liệu tổng hợp. Trước khi sửa, kiểm thử hồi quy nên thất bại đúng nguyên nhân. Sau khi sửa, nó phải xác nhận hành vi mới, không chỉ xác nhận chương trình không crash. Ví dụ lỗi độ dài cần được chuyển thành ParseError::Length và cursor giữ vị trí. Nếu lỗi nằm ở dependency, dùng kênh bảo mật mà dự án công bố và phối hợp trước khi công khai chi tiết."
        },
        {
          "title": "Đầu ra cũng có ranh giới tin cậy",
          "text": "Tên section hoặc byte lỗi có thể chứa ký tự điều khiển, xuống dòng và chuỗi làm terminal hiển thị sai. Báo cáo không nên in raw byte vào terminal. Escape dữ liệu, đặt giới hạn preview và ghi rõ khi đã cắt. Nếu xuất JSON, dùng serializer thay vì ghép chuỗi thủ công; nếu đưa vào HTML, để framework escape văn bản. Phân biệt tên do chương trình tạo với dữ liệu từ tệp để không vô tình biến dữ liệu thành đường dẫn ghi. Bài tập tạo preview ASCII có giới hạn theo byte đầu vào; kết quả dễ so sánh trong regression test và không phụ thuộc UTF-8.",
          "code": "for &byte in input.iter().take(max_bytes) {\n    for escaped in std::ascii::escape_default(byte) {\n        output.push(char::from(escaped));\n    }\n}"
        },
        {
          "title": "Phát hành với phạm vi có thể kiểm chứng",
          "text": "Lưu Cargo.lock của ứng dụng, toolchain đã thử, lệnh build và bộ fixture để người khác tái hiện. CI nên chạy test, kiểm tra định dạng mã và lint; fuzz có lịch riêng với ngân sách rõ ràng. Phân biệt unsupported format với malformed input và lỗi I/O trong thông báo người dùng. Đối với object, duy trì phạm vi binary tin cậy của lab; bản CLI hiện tại chưa phải dịch vụ nhận tệp công khai. Nếu thêm worker cách ly, phải kiểm thử thật việc timeout dừng tiến trình và giới hạn bộ nhớ có hiệu lực. Hồ sơ sản phẩm cần nêu chính xác điều đã triển khai, không lấy danh sách công cụ thay cho bằng chứng."
        }
      ],
      "tip": "Báo cáo nên giúp một người khác tái hiện và kiểm chứng bản sửa, kể cả khi họ chưa biết code của bạn.",
      "exercise": {
        "title": "Preview byte cho báo cáo",
        "instructions": "Hoàn thiện preview bằng std::ascii::escape_default. Chỉ đọc tối đa max_bytes byte để hiển thị; nối ... nếu input còn dài hơn giới hạn.",
        "requirements": [
          "Escape cả byte điều khiển và byte không phải ASCII.",
          "Giới hạn tính theo byte đầu vào, không theo số ký tự sau escape.",
          "Không biến dữ liệu đầu vào thành lệnh, HTML hoặc đường dẫn ghi."
        ]
      },
      "starterCode": "fn preview(input: &[u8], max_bytes: usize) -> String {\n    todo!(\"escape từng byte trong giới hạn và đánh dấu phần bị cắt\")\n}\n\nfn main() {\n    assert_eq!(preview(b\"abc\", 8), \"abc\");\n    assert_eq!(preview(b\"a\\n\\x1b\", 8), \"a\\\\n\\\\x1b\");\n    assert_eq!(preview(&[0xff], 8), \"\\\\xff\");\n    assert_eq!(preview(b\"abcdef\", 3), \"abc...\");\n    assert_eq!(preview(b\"abc\", 0), \"...\");\n    println!(\"Báo cáo byte an toàn: 5 kiểm tra đạt\");\n}",
      "solutionCode": "fn preview(input: &[u8], max_bytes: usize) -> String {\n    let mut output = String::new();\n    for &byte in input.iter().take(max_bytes) {\n        for escaped in std::ascii::escape_default(byte) {\n            output.push(char::from(escaped));\n        }\n    }\n    if input.len() > max_bytes {\n        output.push_str(\"...\");\n    }\n    output\n}\n\nfn main() {\n    assert_eq!(preview(b\"abc\", 8), \"abc\");\n    assert_eq!(preview(b\"a\\n\\x1b\", 8), \"a\\\\n\\\\x1b\");\n    assert_eq!(preview(&[0xff], 8), \"\\\\xff\");\n    assert_eq!(preview(b\"abcdef\", 3), \"abc...\");\n    assert_eq!(preview(b\"abc\", 0), \"...\");\n    println!(\"Báo cáo byte an toàn: 5 kiểm tra đạt\");\n}",
      "expectedOutput": "Báo cáo byte an toàn: 5 kiểm tra đạt",
      "hints": [
        "escape_default trả iterator u8; chuyển từng byte ASCII bằng char::from.",
        "input.len() > max_bytes quyết định dấu ... kể cả max_bytes bằng 0.",
        "Không dùng from_utf8_lossy vì bài yêu cầu giữ cách nhận diện từng byte."
      ],
      "quiz": {
        "question": "Sau khi sửa một lỗi parser do fuzz tìm thấy, bước nào tạo bằng chứng hồi quy tốt nhất?",
        "options": [
          "Xóa corpus để lần sau không thấy lại lỗi.",
          "Giữ input tối thiểu và test kiểm tra đúng kết quả lỗi hoặc dữ liệu mong đợi.",
          "Chỉ tăng timeout của CI.",
          "Đổi mọi panic thành thông báo chung và bỏ backtrace."
        ],
        "correct": 1,
        "explanation": "Regression test phải kiểm tra hành vi đúng cho input từng gây lỗi. Không crash thôi chưa đủ nếu parser âm thầm trả dữ liệu sai."
      },
      "reference": {
        "label": "Rust Fuzz Book: fuzzing trong CI",
        "url": "https://rust-fuzz.github.io/book/cargo-fuzz/ci.html"
      }
    }
  ]
};
