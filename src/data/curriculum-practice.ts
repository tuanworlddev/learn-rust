import type { Lesson } from "./curriculum";

export const practiceLessons: Lesson[] = [
  {
    "id": "doc-tests",
    "moduleId": "testing",
    "title": "Tài liệu có thể kiểm thử",
    "description": "Viết ví dụ sử dụng API và kiểm tra để tài liệu không lệch khỏi mã.",
    "duration": 25,
    "objectives": [
      "Viết doc comment có ví dụ và trường hợp biên",
      "Phân biệt doctest với chương trình chạy bình thường",
      "Diễn đạt hợp đồng API qua kiểu trả về và assertion"
    ],
    "sections": [
      {
        "title": "Tài liệu là một phần của API",
        "text": "Doc comment bắt đầu bằng /// mô tả mục ngay sau nó và hỗ trợ Markdown. Hãy giải thích đầu vào, đầu ra và trường hợp đặc biệt trước khi liệt kê cú pháp. Ví dụ ở bài này quy định nhãn chỉ có khoảng trắng phải trả None; người dùng API không cần đoán rằng chuỗi rỗng có hợp lệ hay không."
      },
      {
        "title": "Biến ví dụ thành một phép kiểm tra",
        "text": "rustdoc có thể lấy khối mã Rust trong tài liệu để biên dịch và chạy. Trong thư viện Cargo tên learning_core, ví dụ gọi API bằng use learning_core::normalize_tag. Assertion khiến ví dụ kiểm tra giá trị thực sự. Chạy cargo test --doc trong dự án thư viện để thực thi các ví dụ này; cargo doc --open tạo trang tài liệu.",
        "code": "# Trong dự án thư viện learning_core\ncargo test --doc\ncargo doc --open\n"
      },
      {
        "title": "Phạm vi của bài thực hành trên web",
        "text": "Runner đang biên dịch một chương trình main, không chạy rustdoc và không tạo crate thư viện tên learning_core. Vì vậy ví dụ trong doc comment được giữ làm tài liệu, còn những assertion tương ứng được thực thi trực tiếp trong main. Khi đưa hàm vào src/lib.rs của thư viện, hãy chạy thêm doctest thật để kiểm tra cả đường dẫn import."
      }
    ],
    "tip": "Một ví dụ tốt vừa thể hiện cách gọi thông thường, vừa ghi rõ một trường hợp biên của API.",
    "exercise": {
      "title": "Chuẩn hóa nhãn",
      "instructions": "Hoàn thiện normalize_tag theo hợp đồng trong doc comment. Bài web kiểm tra logic bằng main; doctest được chạy riêng trong dự án Cargo.",
      "requirements": [
        "Bỏ khoảng trắng ở hai đầu bằng trim",
        "Trả None nếu chuỗi sau trim rỗng",
        "Trả Some chứa chữ thường cho nhãn hợp lệ; giữ các assertion"
      ]
    },
    "starterCode": "/// Chuẩn hóa nhãn; trả None nếu chỉ có khoảng trắng.\n///\n/// # Examples\n///\n/// ```\n/// use learning_core::normalize_tag;\n/// assert_eq!(normalize_tag(\" Rust \"), Some(\"rust\".to_owned()));\n/// assert_eq!(normalize_tag(\"  \"), None);\n/// ```\npub fn normalize_tag(input: &str) -> Option<String> {\n    todo!(\"Chuẩn hóa nhãn theo tài liệu\")\n}\nfn main() {\n    assert_eq!(normalize_tag(\" Rust \"), Some(\"rust\".to_owned()));\n    assert_eq!(normalize_tag(\" VIỆT \"), Some(\"việt\".to_owned()));\n    assert_eq!(normalize_tag(\"   \"), None);\n    assert_eq!(normalize_tag(\"\"), None);\n    println!(\"Nhãn: {}\", normalize_tag(\" Rust \").unwrap());\n}\n",
    "solutionCode": "/// Chuẩn hóa nhãn; trả None nếu chỉ có khoảng trắng.\n///\n/// # Examples\n///\n/// ```\n/// use learning_core::normalize_tag;\n/// assert_eq!(normalize_tag(\" Rust \"), Some(\"rust\".to_owned()));\n/// assert_eq!(normalize_tag(\"  \"), None);\n/// ```\npub fn normalize_tag(input: &str) -> Option<String> {\n    let tag = input.trim();\n    if tag.is_empty() { None } else { Some(tag.to_lowercase()) }\n}\nfn main() {\n    assert_eq!(normalize_tag(\" Rust \"), Some(\"rust\".to_owned()));\n    assert_eq!(normalize_tag(\" VIỆT \"), Some(\"việt\".to_owned()));\n    assert_eq!(normalize_tag(\"   \"), None);\n    assert_eq!(normalize_tag(\"\"), None);\n    println!(\"Nhãn: {}\", normalize_tag(\" Rust \").unwrap());\n}\n",
    "expectedOutput": "Nhãn: rust\n",
    "hints": [
      "Tách bước trim trước khi kiểm tra is_empty.",
      "to_lowercase trả một String mới; bọc nó trong Some."
    ],
    "quiz": {
      "question": "Điều gì thực thi ví dụ Rust trong doc comment của thư viện?",
      "options": [
        "Chỉ mở tệp trong editor",
        "Chạy cargo test --doc",
        "Chạy chương trình main bất kỳ",
        "Viết /// là đủ để ví dụ chạy mỗi lần"
      ],
      "correct": 1,
      "explanation": "cargo test --doc yêu cầu rustdoc kiểm tra tài liệu của thư viện. Chạy main thông thường không tự chạy doctest."
    },
    "reference": {
      "label": "The rustdoc book · Documentation tests",
      "url": "https://doc.rust-lang.org/rustdoc/write-documentation/documentation-tests.html"
    }
  },
  {
    "id": "clippy-format",
    "moduleId": "testing",
    "title": "Định dạng mã và kiểm tra với Clippy",
    "description": "Tách kiểm tra phong cách, cảnh báo và hành vi thành các bước rõ ràng.",
    "duration": 25,
    "objectives": [
      "Dùng rustfmt để thống nhất định dạng",
      "Hiểu lint không thay thế kiểm thử",
      "Viết một thao tác iterator rõ ràng và giữ nguyên hành vi"
    ],
    "sections": [
      {
        "title": "Thống nhất định dạng bằng công cụ",
        "text": "rustfmt xử lý các chi tiết như thụt lề và xuống dòng theo quy tắc chung. cargo fmt sửa định dạng; chế độ --check chỉ kiểm tra, phù hợp khi muốn CI báo mã chưa được định dạng. Định dạng tự động giúp việc review tập trung vào ý nghĩa của thay đổi thay vì tranh luận vị trí dấu ngoặc.",
        "code": "cargo fmt\ncargo fmt --all -- --check\n"
      },
      {
        "title": "Đọc cảnh báo như một lời gợi ý có ngữ cảnh",
        "text": "Clippy phân tích mã để tìm các mẫu đáng nghi và những cách viết có thể rõ ràng hơn. Không phải mọi gợi ý đều phù hợp với mọi thiết kế. Hãy hiểu lý do trước khi sửa; nếu cần cho phép một lint, giới hạn phạm vi và giải thích quyết định. Trong CI, thêm -- -D warnings vào lệnh cargo clippy có thể biến cảnh báo thành lỗi. Hai dấu gạch ngang chuyển tùy chọn tiếp theo cho trình phân tích.",
        "code": "cargo clippy --all-targets\n# Một cách cấu hình lệnh thường dùng:\ncargo clippy --all-targets -- -D warnings\n"
      },
      {
        "title": "Giữ kiểm thử khi làm gọn mã",
        "text": "Một thay đổi từ vòng lặp sang iterator vẫn có thể vô tình đổi thứ tự hoặc xử lý chuỗi trắng sai. Bài tập dùng map để chuẩn hóa từng phần tử rồi find để lấy phần tử đầu tiên hợp lệ. Các assertion kiểm tra đầu vào rỗng, khoảng trắng và thứ tự. Runner này kiểm tra hành vi Rust; nó không tự chạy cargo fmt hay Clippy.",
        "code": "let values = [\" \", \" Rust \", \"Go\"];\nlet first = values.iter()\n    .map(|value| value.trim())\n    .find(|value| !value.is_empty());\n"
      }
    ],
    "tip": "Kiểm tra định dạng, lint và test bổ sung cho nhau: không bước nào chứng minh rằng mọi hành vi của chương trình đều đúng.",
    "exercise": {
      "title": "Tìm chuỗi đầu tiên có nội dung",
      "instructions": "Viết first_nonempty trả về tham chiếu tới chuỗi đầu tiên còn nội dung sau trim. Không cấp phát String mới.",
      "requirements": [
        "Giữ đúng thứ tự của slice đầu vào",
        "Bỏ khoảng trắng hai đầu trước khi kiểm tra",
        "Trả None với danh sách rỗng hoặc toàn chuỗi trắng"
      ]
    },
    "starterCode": "fn first_nonempty<'a>(values: &[&'a str]) -> Option<&'a str> {\n    todo!(\"Tìm phần tử đầu tiên sau khi trim\")\n}\nfn main() {\n    assert_eq!(first_nonempty(&[]), None);\n    assert_eq!(first_nonempty(&[\" \", \"\\t\"]), None);\n    assert_eq!(first_nonempty(&[\"\", \" Rust \", \"Go\"]), Some(\"Rust\"));\n    assert_eq!(first_nonempty(&[\"Việt\", \"Rust\"]), Some(\"Việt\"));\n    println!(\"Đầu tiên: {}\", first_nonempty(&[\" \", \" Rust \"]).unwrap());\n}\n",
    "solutionCode": "fn first_nonempty<'a>(values: &[&'a str]) -> Option<&'a str> {\n    values.iter().map(|value| value.trim()).find(|value| !value.is_empty())\n}\nfn main() {\n    assert_eq!(first_nonempty(&[]), None);\n    assert_eq!(first_nonempty(&[\" \", \"\\t\"]), None);\n    assert_eq!(first_nonempty(&[\"\", \" Rust \", \"Go\"]), Some(\"Rust\"));\n    assert_eq!(first_nonempty(&[\"Việt\", \"Rust\"]), Some(\"Việt\"));\n    println!(\"Đầu tiên: {}\", first_nonempty(&[\" \", \" Rust \"]).unwrap());\n}\n",
    "expectedOutput": "Đầu tiên: Rust\n",
    "hints": [
      "iter() giữ thứ tự; map có thể gọi trim cho từng chuỗi.",
      "find trả Option của phần tử đầu tiên thỏa điều kiện, không cần collect."
    ],
    "quiz": {
      "question": "Sau khi Clippy không còn cảnh báo, điều nào vẫn cần làm?",
      "options": [
        "Bỏ mọi test vì lint đã đủ",
        "Chạy test cho hành vi mong muốn",
        "Đổi mọi vòng lặp thành iterator",
        "Thêm allow cho toàn bộ chương trình"
      ],
      "correct": 1,
      "explanation": "Clippy kiểm tra các mẫu mã; test kiểm tra những yêu cầu về hành vi với dữ liệu cụ thể. Hai việc có mục đích khác nhau."
    },
    "reference": {
      "label": "Clippy Documentation · Usage",
      "url": "https://doc.rust-lang.org/clippy/usage.html"
    }
  },
  {
    "id": "io-files",
    "moduleId": "io",
    "title": "Đọc, ghi và xử lý lỗi I/O",
    "description": "Viết logic đọc ghi có thể dùng với tệp thật và kiểm tra trong bộ nhớ.",
    "duration": 30,
    "objectives": [
      "Nhận biết File, Read, Write và io::Result",
      "Dùng write_all thay vì giả định write ghi hết dữ liệu",
      "Thử logic đọc ghi bằng Cursor mà không đụng tệp cá nhân"
    ],
    "sections": [
      {
        "title": "Một tệp cũng là nguồn hoặc đích của byte",
        "text": "std::fs cung cấp các thao tác tiện dụng như read_to_string và write. Tệp có thể không tồn tại, không đủ quyền hoặc không chứa UTF-8 hợp lệ, nên các thao tác trả Result. Trong ứng dụng thật, nên gắn đường dẫn vào thông báo lỗi để người dùng biết thao tác nào thất bại.",
        "code": "fn load_file(path: &std::path::Path) -> std::io::Result<String> {\n    std::fs::read_to_string(path)\n}\n"
      },
      {
        "title": "Lập trình theo khả năng đọc và ghi",
        "text": "Trait Read mô tả nguồn byte; Write mô tả đích nhận byte. Một hàm generic trên các trait này có thể làm việc với File hoặc vùng nhớ. write có thể chỉ ghi được một phần; write_all tiếp tục cho đến khi đủ dữ liệu hoặc gặp lỗi. read_to_string thêm nội dung vào String và báo lỗi nếu dữ liệu đọc không phải UTF-8 hợp lệ.",
        "code": "fn save<W: std::io::Write>(mut writer: W, text: &str) -> std::io::Result<()> {\n    writer.write_all(text.as_bytes())\n}\n"
      },
      {
        "title": "Kiểm tra I/O bằng Cursor",
        "text": "Cursor bọc một bộ đệm trong RAM và giữ vị trí đọc ghi hiện tại. Sau khi ghi xong, cần đặt lại vị trí về 0 trước khi đọc từ đầu. Bài thực hành dùng Cursor<Vec<u8>>: đây là tệp giả trong bộ nhớ của lần chạy trên máy chủ, không phải tệp trên máy của bạn và không được lưu bền giữa các lần chạy."
      },
      {
        "title": "Giới hạn bộ nhớ và lỗi ghi",
        "text": "Đọc cả nguồn bằng read_to_string có thể cấp phát rất nhiều bộ nhớ. Với tệp lớn hoặc dữ liệu ngoài hệ thống, đặt giới hạn kích thước và chọn xử lý theo dòng hoặc theo chunk. Khi dùng BufWriter, xử lý flush hoặc into_inner nếu cần quan sát lỗi ghi; việc drop không trả Result để bạn báo lỗi. write_all hoàn thành ghi vào writer không tự có nghĩa dữ liệu đã bền vững trên đĩa. Hợp đồng lưu tệp cần nói rõ mức bảo đảm mong muốn."
      }
    ],
    "tip": "Không dùng read_to_string cho dữ liệu nhị phân tùy ý; khi đó hãy đọc vào Vec<u8> và xử lý định dạng rõ ràng.",
    "exercise": {
      "title": "Ghi rồi đọc một ghi chú",
      "instructions": "Hoàn thiện save_note và load_note với trait I/O. main cung cấp Cursor để kiểm thử mà không cần hệ thống tệp.",
      "requirements": [
        "Ghi toàn bộ byte UTF-8 bằng write_all",
        "Đọc vào String mới và truyền lỗi bằng ?",
        "Giữ kiểm tra nội dung rỗng và dữ liệu UTF-8 không hợp lệ"
      ]
    },
    "starterCode": "use std::io::{self, Cursor, Read, Write};\nfn save_note<W: Write>(mut writer: W, note: &str) -> io::Result<()> {\n    todo!(\"Ghi toàn bộ ghi chú\")\n}\nfn load_note<R: Read>(mut reader: R) -> io::Result<String> {\n    todo!(\"Đọc nội dung UTF-8\")\n}\nfn main() -> io::Result<()> {\n    let mut memory = Cursor::new(Vec::new());\n    save_note(&mut memory, \"Học Rust\")?;\n    memory.set_position(0);\n    let note = load_note(&mut memory)?;\n    assert_eq!(note, \"Học Rust\");\n    assert_eq!(load_note(Cursor::new(Vec::<u8>::new()))?, \"\");\n    assert!(load_note(Cursor::new(vec![0xff])).is_err());\n    println!(\"Nội dung: {note}\");\n    Ok(())\n}\n",
    "solutionCode": "use std::io::{self, Cursor, Read, Write};\nfn save_note<W: Write>(mut writer: W, note: &str) -> io::Result<()> {\n    writer.write_all(note.as_bytes())\n}\nfn load_note<R: Read>(mut reader: R) -> io::Result<String> {\n    let mut note = String::new();\n    reader.read_to_string(&mut note)?;\n    Ok(note)\n}\nfn main() -> io::Result<()> {\n    let mut memory = Cursor::new(Vec::new());\n    save_note(&mut memory, \"Học Rust\")?;\n    memory.set_position(0);\n    let note = load_note(&mut memory)?;\n    assert_eq!(note, \"Học Rust\");\n    assert_eq!(load_note(Cursor::new(Vec::<u8>::new()))?, \"\");\n    assert!(load_note(Cursor::new(vec![0xff])).is_err());\n    println!(\"Nội dung: {note}\");\n    Ok(())\n}\n",
    "expectedOutput": "Nội dung: Học Rust\n",
    "hints": [
      "String::as_bytes cho slice byte UTF-8 để ghi.",
      "read_to_string cần &mut String; dùng ? rồi trả Ok(note)."
    ],
    "quiz": {
      "question": "Vì sao main gọi memory.set_position(0) sau khi ghi?",
      "options": [
        "Để xóa toàn bộ dữ liệu",
        "Để đọc lại từ đầu bộ đệm",
        "Để chuyển dữ liệu sang UTF-16",
        "Để đóng Cursor"
      ],
      "correct": 1,
      "explanation": "Cursor giữ vị trí hiện tại. Sau thao tác ghi, vị trí ở cuối phần vừa ghi; đặt về 0 để lần đọc tiếp theo bắt đầu từ đầu."
    },
    "reference": {
      "label": "std::io · Cursor",
      "url": "https://doc.rust-lang.org/std/io/struct.Cursor.html"
    }
  },
  {
    "id": "buffered-io",
    "moduleId": "io",
    "title": "Đọc dữ liệu theo dòng với BufRead",
    "description": "Xử lý từng dòng, truyền lỗi và tránh bỏ qua dữ liệu không hợp lệ.",
    "duration": 30,
    "objectives": [
      "Phân biệt Read và BufRead",
      "Duyệt Result của từng dòng và xử lý lỗi rõ ràng",
      "Kiểm tra số không hợp lệ và tổng bị tràn"
    ],
    "sections": [
      {
        "title": "Buffer giảm số lần đọc nhỏ",
        "text": "BufReader gom dữ liệu đọc vào một bộ đệm, hữu ích khi nguồn là tệp và chương trình đọc từng phần nhỏ. File triển khai Read; bọc nó bằng BufReader sẽ có các tiện ích của BufRead. Cursor vốn đã là nguồn trong bộ nhớ và cũng hỗ trợ BufRead, nên có thể dùng trực tiếp trong bài tập.",
        "code": "let file = std::fs::File::open(\"numbers.txt\")?;\nlet reader = std::io::BufReader::new(file);\n// Truyền reader vào hàm nhận impl BufRead.\n"
      },
      {
        "title": "Mỗi dòng vẫn có thể thất bại",
        "text": "lines() trả iterator có phần tử io::Result<String>. Nó bỏ ký tự kết thúc dòng, bao gồm cặp CRLF khi có. Dùng ? cho từng phần tử để không biến lỗi đọc thành dữ liệu bị mất. Nếu dùng read_line với cùng một String, hãy nhớ clear bộ đệm mỗi vòng khi không muốn nối nội dung các dòng vào nhau.",
        "code": "for line in reader.lines() {\n    let line = line?;\n    let text = line.trim();\n    // Xử lý nội dung dòng.\n}\n"
      },
      {
        "title": "Tách quy tắc định dạng khỏi phép cộng",
        "text": "Định dạng của bài này cho phép dòng trắng và dòng chú thích bắt đầu bằng #. Mọi dòng còn lại phải là u32. Lỗi phân tích hoặc phép cộng vượt u32::MAX được chuyển thành InvalidData. Quy tắc này tốt hơn bỏ qua mọi dòng không đọc được, vì một tệp bị hỏng sẽ không âm thầm cho ra tổng thiếu."
      }
    ],
    "tip": "Không dùng filter_map(Result::ok) khi yêu cầu phải phát hiện dữ liệu hỏng: cách đó loại bỏ lỗi mà không thông báo.",
    "exercise": {
      "title": "Cộng các số trong luồng văn bản",
      "instructions": "Viết sum_lines nhận một BufRead. Bỏ dòng trắng và chú thích, cộng các số u32 hợp lệ.",
      "requirements": [
        "Dùng ? để truyền lỗi đọc dòng",
        "Chuyển lỗi parse thành io::ErrorKind::InvalidData",
        "Dùng checked_add để báo lỗi tràn số"
      ]
    },
    "starterCode": "use std::io::{self, BufRead, Cursor};\nfn sum_lines<R: BufRead>(reader: R) -> io::Result<u32> {\n    todo!(\"Đọc, phân tích và cộng từng dòng\")\n}\nfn main() -> io::Result<()> {\n    let sample = Cursor::new(\"10\\r\\n\\n# ghi chú\\n20\\n\");\n    assert_eq!(sum_lines(sample)?, 30);\n    assert_eq!(sum_lines(Cursor::new(\"\"))?, 0);\n    assert_eq!(sum_lines(Cursor::new(\"abc\")).unwrap_err().kind(), io::ErrorKind::InvalidData);\n    assert!(sum_lines(Cursor::new(\"4294967295\\n1\")).is_err());\n    println!(\"Tổng: {}\", sum_lines(Cursor::new(\"10\\n20\"))?);\n    Ok(())\n}\n",
    "solutionCode": "use std::io::{self, BufRead, Cursor};\nfn sum_lines<R: BufRead>(reader: R) -> io::Result<u32> {\n    let mut total = 0u32;\n    for line in reader.lines() {\n        let line = line?;\n        let text = line.trim();\n        if text.is_empty() || text.starts_with('#') { continue; }\n        let number = text.parse::<u32>().map_err(|_| {\n            io::Error::new(io::ErrorKind::InvalidData, \"Số không hợp lệ\")\n        })?;\n        total = total.checked_add(number).ok_or_else(|| {\n            io::Error::new(io::ErrorKind::InvalidData, \"Tổng vượt giới hạn\")\n        })?;\n    }\n    Ok(total)\n}\nfn main() -> io::Result<()> {\n    let sample = Cursor::new(\"10\\r\\n\\n# ghi chú\\n20\\n\");\n    assert_eq!(sum_lines(sample)?, 30);\n    assert_eq!(sum_lines(Cursor::new(\"\"))?, 0);\n    assert_eq!(sum_lines(Cursor::new(\"abc\")).unwrap_err().kind(), io::ErrorKind::InvalidData);\n    assert!(sum_lines(Cursor::new(\"4294967295\\n1\")).is_err());\n    println!(\"Tổng: {}\", sum_lines(Cursor::new(\"10\\n20\"))?);\n    Ok(())\n}\n",
    "expectedOutput": "Tổng: 30\n",
    "hints": [
      "Đọc line? trước khi trim; kiểm tra is_empty và starts_with.",
      "checked_add trả Option; dùng ok_or_else để chuyển None thành lỗi I/O."
    ],
    "quiz": {
      "question": "Kiểu phần tử của reader.lines() là gì?",
      "options": [
        "String luôn hợp lệ",
        "Option<String>",
        "io::Result<String>",
        "Một ký tự char"
      ],
      "correct": 2,
      "explanation": "Mỗi lần đọc dòng có thể thất bại, nên iterator trả Result<String, io::Error> cho từng phần tử."
    },
    "reference": {
      "label": "std::io · BufRead",
      "url": "https://doc.rust-lang.org/std/io/trait.BufRead.html"
    }
  },
  {
    "id": "cli-args",
    "moduleId": "io",
    "title": "Nhận và phân tích tham số dòng lệnh",
    "description": "Tách dữ liệu môi trường khỏi logic phân tích để kiểm thử dễ dàng.",
    "duration": 30,
    "objectives": [
      "Hiểu vai trò của std::env::args và args_os",
      "Phân tích một giao diện dòng lệnh nhỏ bằng slice pattern",
      "Kiểm tra thiếu tham số và cờ không hỗ trợ"
    ],
    "sections": [
      {
        "title": "Tham số đến từ môi trường chạy",
        "text": "Trong một CLI thật, std::env::args tạo iterator các String; phần tử đầu thường là tên hoặc đường dẫn chương trình. Dùng skip(1) khi bộ phân tích chỉ nhận tham số của người dùng. args giả định Unicode hợp lệ; với đường dẫn hệ điều hành có thể không phải Unicode, args_os và OsString là lựa chọn cần cân nhắc.",
        "code": "let user_args: Vec<String> = std::env::args().skip(1).collect();\nlet slices: Vec<&str> = user_args.iter().map(String::as_str).collect();\n"
      },
      {
        "title": "Mô tả các dạng hợp lệ trước khi phân tích",
        "text": "CLI nhỏ của bài này có hai dạng: tim <tu_khoa> hoặc tim -i <tu_khoa>. Slice pattern giúp phân biệt số lượng và vị trí tham số. Một cờ không biết hoặc một từ khóa bắt đầu bằng dấu gạch ngang sẽ bị từ chối theo hợp đồng đơn giản này. Chương trình lớn hơn cần quy tắc rõ cho dấu --, cờ kết hợp và thông báo trợ giúp.",
        "code": "match args {\n    [query] => { /* tìm có phân biệt hoa thường */ }\n    [\"-i\", query] => { /* tìm không phân biệt hoa thường */ }\n    _ => { /* báo cách dùng */ }\n}\n"
      },
      {
        "title": "Tiêm dữ liệu mẫu thay vì phụ thuộc terminal",
        "text": "Runner trên web không cung cấp ô nhập tham số cho tiến trình Rust. Vì vậy bài tập truyền slice cố định vào parse_args, chính là hàm mà CLI thực tế có thể gọi sau khi đọc môi trường. Thiết kế này cho phép kiểm tra hàng loạt tình huống mà không cần mở nhiều tiến trình hoặc thay đổi trạng thái toàn cục."
      }
    ],
    "tip": "Đừng để hàm parse_args tự đọc std::env::args nếu bạn muốn kiểm thử nó bằng nhiều bộ dữ liệu trong cùng một lần chạy.",
    "exercise": {
      "title": "Bộ phân tích cho lệnh tìm kiếm",
      "instructions": "Viết parse_args chấp nhận một từ khóa hoặc -i cùng từ khóa. Đầu vào đã loại tên chương trình.",
      "requirements": [
        "Từ khóa sau trim phải có nội dung và không bắt đầu bằng -",
        "Chỉ -i là cờ hợp lệ, và phải đứng trước từ khóa",
        "Mọi dạng khác trả Err thay vì panic"
      ]
    },
    "starterCode": "#[derive(Debug, PartialEq, Eq)]\nstruct Config { query: String, case_insensitive: bool }\nfn parse_args(args: &[&str]) -> Result<Config, &'static str> {\n    todo!(\"Phân tích từ khóa và cờ -i\")\n}\nfn main() {\n    let config = parse_args(&[\"-i\", \"rust\"]).unwrap();\n    assert_eq!(config, Config { query: \"rust\".into(), case_insensitive: true });\n    assert_eq!(parse_args(&[\"Rust\"]).unwrap().case_insensitive, false);\n    assert!(parse_args(&[]).is_err());\n    assert!(parse_args(&[\"-i\"]).is_err());\n    assert!(parse_args(&[\"--unknown\", \"rust\"]).is_err());\n    assert!(parse_args(&[\" \"]).is_err());\n    println!(\"Từ khóa: {}\", config.query);\n    println!(\"Không phân biệt hoa thường: {}\", config.case_insensitive);\n}\n",
    "solutionCode": "#[derive(Debug, PartialEq, Eq)]\nstruct Config { query: String, case_insensitive: bool }\nfn parse_args(args: &[&str]) -> Result<Config, &'static str> {\n    let (query, case_insensitive) = match args {\n        [query] => (*query, false),\n        [\"-i\", query] => (*query, true),\n        _ => return Err(\"Cách dùng: tim [-i] <tu_khoa>\"),\n    };\n    let query = query.trim();\n    if query.is_empty() || query.starts_with('-') {\n        return Err(\"Từ khóa không hợp lệ\");\n    }\n    Ok(Config { query: query.to_owned(), case_insensitive })\n}\nfn main() {\n    let config = parse_args(&[\"-i\", \"rust\"]).unwrap();\n    assert_eq!(config, Config { query: \"rust\".into(), case_insensitive: true });\n    assert_eq!(parse_args(&[\"Rust\"]).unwrap().case_insensitive, false);\n    assert!(parse_args(&[]).is_err());\n    assert!(parse_args(&[\"-i\"]).is_err());\n    assert!(parse_args(&[\"--unknown\", \"rust\"]).is_err());\n    assert!(parse_args(&[\" \"]).is_err());\n    println!(\"Từ khóa: {}\", config.query);\n    println!(\"Không phân biệt hoa thường: {}\", config.case_insensitive);\n}\n",
    "expectedOutput": "Từ khóa: rust\nKhông phân biệt hoa thường: true\n",
    "hints": [
      "Match các slice [query] và [\"-i\", query] trước khi kiểm tra chuỗi.",
      "Tách (query, case_insensitive), rồi trim và tạo Config ở cuối hàm."
    ],
    "quiz": {
      "question": "Vì sao truyền tham số vào parse_args thay vì đọc môi trường ngay trong hàm?",
      "options": [
        "Để không cần xử lý lỗi",
        "Để kiểm thử nhiều đầu vào mà không phụ thuộc môi trường",
        "Vì Rust không cho phép đọc tham số",
        "Để mọi tham số tự chuyển thành số"
      ],
      "correct": 1,
      "explanation": "Hàm nhận dữ liệu tường minh dễ kiểm thử, tái sử dụng và giữ logic phân tích độc lập với cách chương trình được khởi chạy."
    },
    "reference": {
      "label": "The Rust Book · Accepting Command Line Arguments",
      "url": "https://doc.rust-lang.org/book/ch12-01-accepting-command-line-arguments.html"
    }
  },
  {
    "id": "cli-errors",
    "moduleId": "io",
    "title": "Thông báo lỗi và mã thoát của CLI",
    "description": "Trả lỗi có ý nghĩa, phân biệt đầu ra dữ liệu với chẩn đoán.",
    "duration": 30,
    "objectives": [
      "Thiết kế enum lỗi thay cho panic khi người dùng nhập sai",
      "Hiển thị lỗi qua Display",
      "Hiểu stdout, stderr và mã thoát trong chương trình CLI"
    ],
    "sections": [
      {
        "title": "Một lỗi nhập liệu không phải lỗi lập trình",
        "text": "Thiếu đối số, chuỗi không phải số và số 0 có thể cần thông báo khác nhau. Enum giúp gọi tên các trường hợp này, còn Result buộc nơi gọi quyết định cách xử lý. Tránh unwrap dữ liệu từ người dùng trong mã thực tế; panic thường không cung cấp cách sửa lỗi phù hợp cho họ.",
        "code": "#[derive(Debug)]\nenum InputError {\n    MissingValue,\n    InvalidNumber,\n}\n"
      },
      {
        "title": "Tách biểu diễn lỗi khỏi thông báo",
        "text": "Debug phù hợp khi phát triển; Display tạo thông điệp hướng tới người dùng. Một enum có thể triển khai std::error::Error để tham gia các API xử lý lỗi chung. Trong bài này, parse::<u16> tự từ chối ký tự không hợp lệ và giá trị vượt 65535; kiểm tra riêng số 0 theo quy tắc của ứng dụng."
      },
      {
        "title": "Đầu ra dữ liệu và trạng thái tiến trình",
        "text": "CLI thường ghi kết quả vào stdout, chẩn đoán vào stderr bằng eprintln!, và trả mã thoát khác 0 khi thất bại. Có thể dùng std::process::ExitCode làm kiểu trả về của main. Bài web kiểm tra hàm parse_port và in một báo cáo cố định; nó không mô phỏng shell hay tự thay đổi mã thoát dựa trên từng assertion.",
        "code": "use std::process::ExitCode;\nfn main() -> ExitCode {\n    eprintln!(\"Thiếu đường dẫn đầu vào\");\n    ExitCode::FAILURE\n}\n"
      }
    ],
    "tip": "Giữ thông báo Display ổn định nếu người dùng cần đọc nó; nếu chương trình khác cần phân tích lỗi, cung cấp một định dạng dữ liệu riêng.",
    "exercise": {
      "title": "Kiểm tra cổng của ứng dụng",
      "instructions": "Hoàn thiện parse_port: nhận Option<&str>, trả cổng u16 từ 1 đến 65535 hoặc một biến thể AppError.",
      "requirements": [
        "None trả MissingValue",
        "Chuỗi không parse được thành u16 trả InvalidNumber",
        "Số 0 trả ZeroPort; giá trị hợp lệ trả Ok"
      ]
    },
    "starterCode": "use std::fmt;\n#[derive(Debug, PartialEq, Eq)]\nenum AppError { MissingValue, InvalidNumber, ZeroPort }\nimpl fmt::Display for AppError {\n    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {\n        let message = match self {\n            Self::MissingValue => \"Thiếu cổng\",\n            Self::InvalidNumber => \"Cổng phải là số từ 1 đến 65535\",\n            Self::ZeroPort => \"Cổng không được bằng 0\",\n        };\n        write!(f, \"{message}\")\n    }\n}\nimpl std::error::Error for AppError {}\nfn parse_port(raw: Option<&str>) -> Result<u16, AppError> {\n    todo!(\"Kiểm tra tham số cổng\")\n}\nfn main() {\n    assert_eq!(parse_port(None), Err(AppError::MissingValue));\n    assert_eq!(parse_port(Some(\"abc\")), Err(AppError::InvalidNumber));\n    assert_eq!(parse_port(Some(\"65536\")), Err(AppError::InvalidNumber));\n    assert_eq!(parse_port(Some(\"0\")), Err(AppError::ZeroPort));\n    assert_eq!(parse_port(Some(\"8080\")), Ok(8080));\n    println!(\"Lỗi: {}\", parse_port(None).unwrap_err());\n    println!(\"Cổng hợp lệ: {}\", parse_port(Some(\"8080\")).unwrap());\n}\n",
    "solutionCode": "use std::fmt;\n#[derive(Debug, PartialEq, Eq)]\nenum AppError { MissingValue, InvalidNumber, ZeroPort }\nimpl fmt::Display for AppError {\n    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {\n        let message = match self {\n            Self::MissingValue => \"Thiếu cổng\",\n            Self::InvalidNumber => \"Cổng phải là số từ 1 đến 65535\",\n            Self::ZeroPort => \"Cổng không được bằng 0\",\n        };\n        write!(f, \"{message}\")\n    }\n}\nimpl std::error::Error for AppError {}\nfn parse_port(raw: Option<&str>) -> Result<u16, AppError> {\n    let raw = raw.ok_or(AppError::MissingValue)?;\n    let port = raw.parse::<u16>().map_err(|_| AppError::InvalidNumber)?;\n    if port == 0 { Err(AppError::ZeroPort) } else { Ok(port) }\n}\nfn main() {\n    assert_eq!(parse_port(None), Err(AppError::MissingValue));\n    assert_eq!(parse_port(Some(\"abc\")), Err(AppError::InvalidNumber));\n    assert_eq!(parse_port(Some(\"65536\")), Err(AppError::InvalidNumber));\n    assert_eq!(parse_port(Some(\"0\")), Err(AppError::ZeroPort));\n    assert_eq!(parse_port(Some(\"8080\")), Ok(8080));\n    println!(\"Lỗi: {}\", parse_port(None).unwrap_err());\n    println!(\"Cổng hợp lệ: {}\", parse_port(Some(\"8080\")).unwrap());\n}\n",
    "expectedOutput": "Lỗi: Thiếu cổng\nCổng hợp lệ: 8080\n",
    "hints": [
      "ok_or chuyển Option thành Result trước khi dùng ?.",
      "Dùng map_err sau parse::<u16> rồi xử lý port == 0."
    ],
    "quiz": {
      "question": "Chẩn đoán lỗi của một CLI nên được ghi ở đâu theo thông lệ?",
      "options": [
        "stderr, để stdout còn dùng cho dữ liệu kết quả",
        "Luôn ghi vào tên tệp thực thi",
        "Không được hiển thị",
        "Chỉ được truyền qua panic"
      ],
      "correct": 0,
      "explanation": "stderr dành cho chẩn đoán; stdout có thể được nối vào pipeline hoặc lưu thành dữ liệu. Mã thoát giúp shell nhận biết thành công hay thất bại."
    },
    "reference": {
      "label": "The Rust Book · Writing Error Messages to Standard Error",
      "url": "https://doc.rust-lang.org/book/ch12-06-writing-to-stderr-instead-of-stdout.html"
    }
  },
  {
    "id": "macro-rules",
    "moduleId": "macros",
    "title": "Viết macro với macro_rules!",
    "description": "Nhận một biểu thức và sinh mã mà không đánh giá đối số lặp lại.",
    "duration": 30,
    "objectives": [
      "Đọc matcher và phần mở rộng của macro",
      "Dùng fragment expr và block biểu thức",
      "Kiểm tra tác dụng phụ khi macro dùng đối số"
    ],
    "sections": [
      {
        "title": "Macro làm việc với cú pháp",
        "text": "Hàm nhận các giá trị sau khi đối số được tính; macro khai báo nhận một mẫu cú pháp rồi sinh mã Rust. Trong macro_rules!, mỗi nhánh có matcher ở bên trái => và phần mở rộng ở bên phải. Ký hiệu $value:expr nhận một biểu thức, còn ident phù hợp với tên biến hoặc tên hàm.",
        "code": "macro_rules! as_text {\n    ($value:expr) => { format!(\"{}\", $value) };\n}\n"
      },
      {
        "title": "Một block cũng tạo ra giá trị",
        "text": "Macro dùng trong vị trí biểu thức có thể mở rộng thành một block. Viết hai lớp ngoặc nhọn trong phần định nghĩa là cách tiện để phần mở rộng vẫn chứa một block riêng: bên trong có biến tạm, biểu thức cuối là kết quả. Việc tạo phạm vi cục bộ cũng giúp đoạn mã sinh ra không để các khai báo phụ tràn ra nơi gọi.",
        "code": "macro_rules! add_one {\n    ($value:expr) => {{\n        let value = $value;\n        value + 1\n    }};\n}\n"
      },
      {
        "title": "Đừng vô tình chạy đối số hai lần",
        "text": "Nếu viết $value + $value, một lời gọi hàm hoặc phép tăng biến trong đối số sẽ được thực hiện hai lần. Gán đối số vào biến tạm trước rồi dùng giá trị đó. Bài tập chỉ xử lý số nguyên có Copy và phép cộng phù hợp; macro này không hứa hoạt động với mọi kiểu dữ liệu. Với logic thông thường, ưu tiên hàm khi macro không mang lại lợi ích rõ ràng."
      }
    ],
    "tip": "Khi review macro, thử truyền một block có tác dụng phụ để xem mỗi đối số được đánh giá bao nhiêu lần.",
    "exercise": {
      "title": "Nhân đôi một biểu thức",
      "instructions": "Hoàn thiện macro twice! nhận một biểu thức số nguyên, trả giá trị gấp đôi và chỉ tính đối số một lần.",
      "requirements": [
        "Matcher dùng $value:expr",
        "Lưu giá trị đầu vào trong một biến cục bộ",
        "Giữ assertion calls == 1 để phát hiện việc tính lặp"
      ]
    },
    "starterCode": "macro_rules! twice {\n    ($value:expr) => {{\n        todo!(\"Tính đối số một lần rồi nhân đôi\")\n    }};\n}\nfn main() {\n    assert_eq!(twice!(5), 10);\n    assert_eq!(twice!(0), 0);\n    let mut calls = 0;\n    let answer = twice!({ calls += 1; 7 });\n    assert_eq!(calls, 1);\n    assert_eq!(answer, 14);\n    println!(\"Kết quả: {answer}\");\n}\n",
    "solutionCode": "macro_rules! twice {\n    ($value:expr) => {{\n        let value = $value;\n        value + value\n    }};\n}\nfn main() {\n    assert_eq!(twice!(5), 10);\n    assert_eq!(twice!(0), 0);\n    let mut calls = 0;\n    let answer = twice!({ calls += 1; 7 });\n    assert_eq!(calls, 1);\n    assert_eq!(answer, 14);\n    println!(\"Kết quả: {answer}\");\n}\n",
    "expectedOutput": "Kết quả: 14\n",
    "hints": [
      "Block mở rộng có thể khai báo let trước biểu thức kết quả.",
      "Đặt let value = $value; rồi trả value + value."
    ],
    "quiz": {
      "question": "Vấn đề của phần mở rộng $value + $value là gì?",
      "options": [
        "Mọi phép cộng đều không hợp lệ trong macro",
        "Biểu thức đối số có thể chạy hai lần",
        "Macro bắt buộc phải trả String",
        "Dấu $ tạo biến toàn cục"
      ],
      "correct": 1,
      "explanation": "Macro chèn cú pháp vào chỗ dùng. Nếu đối số có tác dụng phụ, lặp lại $value có thể lặp lại cả tác dụng phụ đó."
    },
    "reference": {
      "label": "Rust by Example · Macro designators",
      "url": "https://doc.rust-lang.org/rust-by-example/macros/designators.html"
    }
  },
  {
    "id": "macro-repetition",
    "moduleId": "macros",
    "title": "Macro nhận nhiều đối số",
    "description": "Dùng repetition để tạo một danh sách String từ số lượng đối số linh hoạt.",
    "duration": 30,
    "objectives": [
      "Phân biệt các toán tử lặp *, + và ?",
      "Ánh xạ mỗi biểu thức đầu vào thành một phần tử",
      "Chấp nhận dấu phẩy cuối mà không lặp đánh giá"
    ],
    "sections": [
      {
        "title": "Mô tả một danh sách bằng mẫu lặp",
        "text": "Cú pháp $(...),* khớp không hoặc nhiều lần, phân cách bằng dấu phẩy. Dấu + yêu cầu ít nhất một lần; dấu ? cho phép có hoặc không một phần. Đây là lặp ở mức sinh mã, không phải vòng lặp chạy với dữ liệu runtime. Số đối số được biết từ chính lời gọi macro.",
        "code": "macro_rules! count_inputs {\n    ($($value:expr),*) => {\n        <[()]>::len(&[$({ let _ = &$value; () }),*])\n    };\n}\n"
      },
      {
        "title": "Mở rộng tương ứng từng phần tử",
        "text": "Biến được bắt trong matcher lặp phải được dùng ở mức lặp tương ứng khi mở rộng. Bài này nhận nhiều biểu thức có ToString rồi tạo vec! chứa các String. Các đối số ban đầu có thể khác kiểu, nhưng sau chuyển đổi mọi phần tử của vector đều cùng kiểu String.",
        "code": "// Mẫu ý tưởng:\n// ($($value:expr),*) => { vec![$(($value).to_string()),*] }\n"
      },
      {
        "title": "Dấu phẩy cuối và trường hợp rỗng",
        "text": "Thêm $(,)? ở cuối matcher để hỗ trợ dấu phẩy cuối tùy chọn. Một lời gọi rỗng tạo vec![] nên nơi gọi cần cung cấp kiểu khi trình biên dịch chưa suy ra được. Ngoài danh sách một phần tử và nhiều phần tử, hãy kiểm tra mỗi biểu thức chỉ chạy một lần; một macro tiện dụng không nên làm thay đổi bất ngờ thứ tự hay số lần tác dụng phụ."
      }
    ],
    "tip": "Dùng ngoặc quanh $value trước khi gọi phương thức để biểu thức phức tạp được nhóm đúng như dự định.",
    "exercise": {
      "title": "Tạo vector chuỗi",
      "instructions": "Hoàn thiện string_vec! để chuyển mỗi đối số thành String. Hỗ trợ cả lời gọi rỗng và dấu phẩy cuối.",
      "requirements": [
        "Matcher dùng lặp biểu thức phân cách bởi dấu phẩy",
        "Chuyển mỗi biểu thức bằng to_string đúng một lần",
        "Kết quả là Vec<String> theo thứ tự đối số"
      ]
    },
    "starterCode": "macro_rules! string_vec {\n    ($($value:expr),* $(,)?) => {{\n        todo!(\"Tạo Vec<String> từ các biểu thức\")\n    }};\n}\nfn main() {\n    let empty: Vec<String> = string_vec![];\n    assert!(empty.is_empty());\n    assert_eq!(string_vec![\"Rust\"], vec![\"Rust\"]);\n    let words = string_vec![\"Rust\", 42, true,];\n    assert_eq!(words, vec![\"Rust\", \"42\", \"true\"]);\n    let mut calls = 0;\n    let numbers = string_vec![{ calls += 1; 1 }, { calls += 1; 2 }];\n    assert_eq!(calls, 2);\n    assert_eq!(numbers, vec![\"1\", \"2\"]);\n    println!(\"{}\", words.join(\" | \"));\n}\n",
    "solutionCode": "macro_rules! string_vec {\n    ($($value:expr),* $(,)?) => {{\n        vec![$(($value).to_string()),*]\n    }};\n}\nfn main() {\n    let empty: Vec<String> = string_vec![];\n    assert!(empty.is_empty());\n    assert_eq!(string_vec![\"Rust\"], vec![\"Rust\"]);\n    let words = string_vec![\"Rust\", 42, true,];\n    assert_eq!(words, vec![\"Rust\", \"42\", \"true\"]);\n    let mut calls = 0;\n    let numbers = string_vec![{ calls += 1; 1 }, { calls += 1; 2 }];\n    assert_eq!(calls, 2);\n    assert_eq!(numbers, vec![\"1\", \"2\"]);\n    println!(\"{}\", words.join(\" | \"));\n}\n",
    "expectedOutput": "Rust | 42 | true\n",
    "hints": [
      "Dùng vec![...] để tạo vector sau khi mở rộng.",
      "Trong vec!, lặp $(($value).to_string()),* cho từng phần tử."
    ],
    "quiz": {
      "question": "Toán tử nào cho phép một nhóm lặp xuất hiện không hoặc nhiều lần?",
      "options": [
        "+",
        "*",
        "?",
        "@"
      ],
      "correct": 1,
      "explanation": "* cho phép 0 hoặc nhiều lần; + cần ít nhất 1 lần; ? cho phép 0 hoặc 1 lần."
    },
    "reference": {
      "label": "Rust by Example · Repetition",
      "url": "https://doc.rust-lang.org/rust-by-example/macros/repeat.html"
    }
  },
  {
    "id": "derive-traits",
    "moduleId": "macros",
    "title": "Sinh trait với #[derive]",
    "description": "Tạo khả năng so sánh, sao chép và sắp xếp theo cấu trúc dữ liệu.",
    "duration": 30,
    "objectives": [
      "Chọn các trait có thể derive cho struct",
      "Hiểu thứ tự trường ảnh hưởng tới Ord",
      "Phân biệt Clone, Copy, Debug và Display"
    ],
    "sections": [
      {
        "title": "Derive sinh phần triển khai trait",
        "text": "#[derive(...)] yêu cầu trình biên dịch hoặc macro derive tạo mã triển khai trait cho kiểu của bạn. Debug cho phép in chẩn đoán; PartialEq giúp so sánh bằng; Clone tạo bản sao theo hành vi của từng trường. Các trường phải đáp ứng những ràng buộc tương ứng. Struct chứa String có thể Clone nhưng không thể Copy.",
        "code": "#[derive(Debug, Clone, PartialEq, Eq)]\nstruct Label { text: String }\n"
      },
      {
        "title": "Thứ tự mặc định đi theo khai báo",
        "text": "Khi derive Ord cho struct, Rust so sánh lần lượt các trường theo thứ tự khai báo. Trong Student, score đứng trước name nên điểm được so sánh trước, rồi tên phá hòa. Nếu thay thứ tự trường, bạn cũng thay ý nghĩa của thứ tự mặc định. Với quy tắc nghiệp vụ khác, hãy dùng sort_by hoặc triển khai so sánh phù hợp."
      },
      {
        "title": "Không phải cách hiển thị nào cũng nên tự sinh",
        "text": "Debug có mục tiêu chẩn đoán và không phải một định dạng giao tiếp ổn định. std không cung cấp derive Display mặc định vì trình biên dịch không biết nội dung nào có ý nghĩa với người dùng. Bài tập in từng trường bằng println! và dùng derive cho việc clone, so sánh, sắp xếp; các assertion kiểm tra cả tiêu chí phụ khi bằng điểm.",
        "code": "#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]\nstruct Student {\n    score: u8,\n    name: String,\n}\n"
      }
    ],
    "tip": "Chỉ derive một trait khi ngữ nghĩa mặc định phù hợp với kiểu dữ liệu, không chỉ để làm một lỗi biên dịch biến mất.",
    "exercise": {
      "title": "Sắp xếp học viên",
      "instructions": "Thêm các derive cần thiết và hoàn thiện sort_students. Sắp xếp tăng dần theo score, rồi theo name.",
      "requirements": [
        "Giữ score trước name trong định nghĩa Student",
        "Thêm Clone, PartialEq, Eq, PartialOrd, Ord bên cạnh Debug",
        "Dùng sort và trả vector đã sắp xếp"
      ]
    },
    "starterCode": "#[derive(Debug)]\nstruct Student { score: u8, name: String }\nfn sort_students(mut students: Vec<Student>) -> Vec<Student> {\n    todo!(\"Sắp xếp theo thứ tự được derive\")\n}\nfn main() {\n    let students = vec![\n        Student { score: 9, name: \"Chi\".into() },\n        Student { score: 8, name: \"Binh\".into() },\n        Student { score: 8, name: \"An\".into() },\n    ];\n    let sorted = sort_students(students.clone());\n    assert_eq!(students[0].name, \"Chi\");\n    assert_eq!(sorted[0], Student { score: 8, name: \"An\".into() });\n    assert_eq!(sorted[1].name, \"Binh\");\n    assert_eq!(sorted[2].score, 9);\n    assert!(sort_students(vec![]).is_empty());\n    for student in sorted { println!(\"{}: {}\", student.name, student.score); }\n}\n",
    "solutionCode": "#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]\nstruct Student { score: u8, name: String }\nfn sort_students(mut students: Vec<Student>) -> Vec<Student> {\n    students.sort();\n    students\n}\nfn main() {\n    let students = vec![\n        Student { score: 9, name: \"Chi\".into() },\n        Student { score: 8, name: \"Binh\".into() },\n        Student { score: 8, name: \"An\".into() },\n    ];\n    let sorted = sort_students(students.clone());\n    assert_eq!(students[0].name, \"Chi\");\n    assert_eq!(sorted[0], Student { score: 8, name: \"An\".into() });\n    assert_eq!(sorted[1].name, \"Binh\");\n    assert_eq!(sorted[2].score, 9);\n    assert!(sort_students(vec![]).is_empty());\n    for student in sorted { println!(\"{}: {}\", student.name, student.score); }\n}\n",
    "expectedOutput": "An: 8\nBinh: 8\nChi: 9\n",
    "hints": [
      "Ord cần các trait liên quan như Eq và PartialOrd.",
      "Sau khi derive đúng, gọi students.sort(); rồi trả students."
    ],
    "quiz": {
      "question": "Ord được derive cho Student { score, name } so sánh như thế nào?",
      "options": [
        "Luôn chỉ so name",
        "So score trước; khi bằng nhau mới so name",
        "Chọn ngẫu nhiên một trường",
        "So độ dài dữ liệu trong bộ nhớ"
      ],
      "correct": 1,
      "explanation": "Thứ tự các trường trong định nghĩa struct xác định thứ tự so sánh của phần triển khai được derive."
    },
    "reference": {
      "label": "The Rust Book · Derivable Traits",
      "url": "https://doc.rust-lang.org/book/appendix-03-derivable-traits.html"
    }
  },
  {
    "id": "cfg-attributes",
    "moduleId": "macros",
    "title": "Attribute và biên dịch có điều kiện",
    "description": "Chọn mã phù hợp với nền tảng bằng cfg và hiểu khác biệt với cfg!.",
    "duration": 30,
    "objectives": [
      "Đọc attribute gắn vào item",
      "Phân biệt loại bỏ mã bằng cfg với giá trị bool của cfg!",
      "Giữ bài thực hành có đầu ra ổn định giữa các nền tảng"
    ],
    "sections": [
      {
        "title": "Attribute gắn thông tin vào mã",
        "text": "Attribute dạng #[...] áp dụng cho mục ngay sau nó; #![...] thường áp dụng cho mục chứa nó, ví dụ crate. Bạn đã dùng derive và test; cfg cũng là attribute. cfg chọn xem một mục có được đưa vào quá trình biên dịch theo cấu hình hay không, hữu ích với API đặc thù hệ điều hành.",
        "code": "#[cfg(windows)]\nfn platform_name() -> &'static str { \"Windows\" }\n#[cfg(not(windows))]\nfn platform_name() -> &'static str { \"Nền tảng khác\" }\n"
      },
      {
        "title": "cfg! không xóa nhánh của if",
        "text": "cfg!(...) mở rộng thành một giá trị bool. Khi đặt nó trong if, cả hai nhánh vẫn phải là mã hợp lệ về kiểu và tên, kể cả nhánh không chạy. Vì vậy nếu một API không tồn tại trên nền tảng hiện tại, nên dùng #[cfg(...)] để loại mục chứa API đó. cfg_attr có thể gắn thêm attribute khi điều kiện đúng.",
        "code": "#[cfg_attr(debug_assertions, derive(Debug))]\nstruct Settings { enabled: bool }\n// cfg!(debug_assertions) là một biểu thức bool.\n"
      },
      {
        "title": "Thử tính di động mà không phụ thuộc máy chủ",
        "text": "Bài tập cung cấp hai phiên bản separator có cùng tên nhưng điều kiện loại trừ nhau. basename xử lý dữ liệu mẫu được tạo bằng separator của nền tảng, nên kết quả in luôn là rust.txt. Đây là minh họa cú pháp; xử lý đường dẫn thực tế nên dùng Path thay vì tự cắt chuỗi, đặc biệt khi cần hỗ trợ đường dẫn không phải Unicode."
      }
    ],
    "tip": "Biên dịch có điều kiện khác kiểm tra điều kiện lúc chạy: hãy chọn cơ chế theo việc mã có hợp lệ trên nền tảng đó hay không.",
    "exercise": {
      "title": "Lấy tên cuối của đường dẫn mẫu",
      "instructions": "Giữ hai hàm separator được bảo vệ bằng cfg. Hoàn thiện basename bằng rsplit với separator().",
      "requirements": [
        "Không xóa các cfg đã cho",
        "Trả phần cuối sau dấu phân cách, hoặc chuỗi rỗng nếu đầu vào rỗng",
        "Không in tên hệ điều hành để giữ đầu ra ổn định"
      ]
    },
    "starterCode": "#[cfg(windows)]\nfn separator() -> char { '\\\\' }\n#[cfg(not(windows))]\nfn separator() -> char { '/' }\nfn basename(path: &str) -> &str {\n    todo!(\"Lấy phần cuối của đường dẫn mẫu\")\n}\nfn main() {\n    let path = format!(\"notes{}rust.txt\", separator());\n    assert_eq!(basename(&path), \"rust.txt\");\n    assert_eq!(basename(\"rust.txt\"), \"rust.txt\");\n    assert_eq!(basename(\"\"), \"\");\n    assert_eq!(separator(), std::path::MAIN_SEPARATOR);\n    println!(\"Tệp: {}\", basename(&path));\n}\n",
    "solutionCode": "#[cfg(windows)]\nfn separator() -> char { '\\\\' }\n#[cfg(not(windows))]\nfn separator() -> char { '/' }\nfn basename(path: &str) -> &str {\n    path.rsplit(separator()).next().unwrap_or(\"\")\n}\nfn main() {\n    let path = format!(\"notes{}rust.txt\", separator());\n    assert_eq!(basename(&path), \"rust.txt\");\n    assert_eq!(basename(\"rust.txt\"), \"rust.txt\");\n    assert_eq!(basename(\"\"), \"\");\n    assert_eq!(separator(), std::path::MAIN_SEPARATOR);\n    println!(\"Tệp: {}\", basename(&path));\n}\n",
    "expectedOutput": "Tệp: rust.txt\n",
    "hints": [
      "rsplit bắt đầu từ cuối chuỗi và chấp nhận char làm dấu phân cách.",
      "Phần tử đầu của rsplit là phần cuối cần tìm."
    ],
    "quiz": {
      "question": "Khẳng định nào đúng về if cfg!(windows) { ... } else { ... }?",
      "options": [
        "Nhánh false bị loại trước mọi kiểm tra kiểu",
        "Cả hai nhánh vẫn cần mã hợp lệ",
        "Nó luôn chạy nhánh Windows",
        "Nó chỉ dùng được trong macro_rules"
      ],
      "correct": 1,
      "explanation": "cfg! tạo bool; if thông thường vẫn yêu cầu các nhánh hợp lệ. #[cfg] mới là cơ chế loại mục khỏi mã được biên dịch."
    },
    "reference": {
      "label": "The Rust Reference · Conditional compilation",
      "url": "https://doc.rust-lang.org/reference/conditional-compilation.html"
    }
  },
  {
    "id": "advanced-patterns",
    "moduleId": "advanced",
    "title": "Pattern nâng cao: guard, range và @",
    "description": "Gộp điều kiện và tách dữ liệu trong một match có thứ tự rõ ràng.",
    "duration": 35,
    "objectives": [
      "Kết hợp or-pattern và range pattern",
      "Dùng match guard cho điều kiện giữa các trường",
      "Dùng @ để vừa kiểm tra pattern vừa giữ giá trị"
    ],
    "sections": [
      {
        "title": "Tách hình dạng dữ liệu ngay tại nhánh",
        "text": "Pattern có thể đi vào enum, tuple và struct để đặt tên cho phần cần dùng. Dấu | gộp các hình dạng có cùng cách xử lý; .. bỏ qua các trường còn lại. Đặt trường hợp cụ thể trước trường hợp rộng: trong bài tập, phím q phải được nhận là thoát trước nhánh bắt mọi chữ thường.",
        "code": "match event {\n    Event::Key('q' | 'Q') | Event::Quit => \"Thoát\".to_owned(),\n    _ => \"Tiếp tục\".to_owned(),\n}\n"
      },
      {
        "title": "Guard kiểm tra mối quan hệ sau khi khớp",
        "text": "Một điều kiện if sau pattern được gọi là match guard. Nó hữu ích khi cần so sánh hai trường hoặc kiểm tra nội dung chuỗi, điều mà một literal pattern không diễn đạt đủ. Guard có thể thất bại, nên vẫn cần những nhánh bao phủ phần còn lại; đừng coi một nhánh có guard là đủ để chứng minh match đã đầy đủ.",
        "code": "Event::Click { x, y } if x == y => \"Đường chéo\".to_owned(),\nEvent::Click { .. } => \"Vị trí khác\".to_owned(),\n"
      },
      {
        "title": "Giữ lại giá trị bằng @",
        "text": "Pattern id @ 1..=3 vừa yêu cầu id nằm trong khoảng, vừa gắn giá trị vào một tên để dùng ở phần thân nhánh. Khi match trên &Event, các trường thường được mượn theo cơ chế match ergonomics; không cần clone cả String chỉ để đọc nó. Bài tập kết hợp range, @ và guard để chọn thông báo có ID phù hợp và nội dung không rỗng.",
        "code": "Event::Message { id: id @ 1..=3, text } if !text.is_empty() => {\n    format!(\"[{id}] {text}\")\n}\n"
      }
    ],
    "tip": "Đọc match từ trên xuống. Một nhánh rộng đặt quá sớm có thể làm quy tắc đặc biệt bên dưới không bao giờ được dùng.",
    "exercise": {
      "title": "Phân loại sự kiện",
      "instructions": "Hoàn thiện classify. q, Q và Quit trả Thoát; chữ a–z còn lại trả Phím: <ký tự>; Click có x == y trả Đường chéo; Message có ID 1–3 và text không rỗng trả [id] text.",
      "requirements": [
        "Key khác trả Phím khác; Click khác trả Vị trí khác",
        "Message không đạt điều kiện trả Bỏ qua",
        "Dùng guard và @, chỉ mượn Event qua tham chiếu"
      ]
    },
    "starterCode": "enum Event {\n    Key(char),\n    Click { x: i32, y: i32 },\n    Message { id: u32, text: String },\n    Quit,\n}\nfn classify(event: &Event) -> String {\n    todo!(\"Phân loại bằng pattern và guard\")\n}\nfn main() {\n    assert_eq!(classify(&Event::Key('q')), \"Thoát\");\n    assert_eq!(classify(&Event::Key('Q')), \"Thoát\");\n    assert_eq!(classify(&Event::Key('7')), \"Phím khác\");\n    assert_eq!(classify(&Event::Click { x: 2, y: 2 }), \"Đường chéo\");\n    assert_eq!(classify(&Event::Click { x: 2, y: 3 }), \"Vị trí khác\");\n    assert_eq!(classify(&Event::Message { id: 9, text: \"Rust\".into() }), \"Bỏ qua\");\n    assert_eq!(classify(&Event::Message { id: 1, text: \"\".into() }), \"Bỏ qua\");\n    assert_eq!(classify(&Event::Quit), \"Thoát\");\n    println!(\"{}\", classify(&Event::Key('k')));\n    println!(\"{}\", classify(&Event::Message { id: 2, text: \"Rust\".into() }));\n}\n",
    "solutionCode": "enum Event {\n    Key(char),\n    Click { x: i32, y: i32 },\n    Message { id: u32, text: String },\n    Quit,\n}\nfn classify(event: &Event) -> String {\n    match event {\n        Event::Key('q' | 'Q') | Event::Quit => \"Thoát\".to_owned(),\n        Event::Key(c @ 'a'..='z') => format!(\"Phím: {c}\"),\n        Event::Key(_) => \"Phím khác\".to_owned(),\n        Event::Click { x, y } if x == y => \"Đường chéo\".to_owned(),\n        Event::Click { .. } => \"Vị trí khác\".to_owned(),\n        Event::Message { id: id @ 1..=3, text } if !text.is_empty() => format!(\"[{id}] {text}\"),\n        Event::Message { .. } => \"Bỏ qua\".to_owned(),\n    }\n}\nfn main() {\n    assert_eq!(classify(&Event::Key('q')), \"Thoát\");\n    assert_eq!(classify(&Event::Key('Q')), \"Thoát\");\n    assert_eq!(classify(&Event::Key('7')), \"Phím khác\");\n    assert_eq!(classify(&Event::Click { x: 2, y: 2 }), \"Đường chéo\");\n    assert_eq!(classify(&Event::Click { x: 2, y: 3 }), \"Vị trí khác\");\n    assert_eq!(classify(&Event::Message { id: 9, text: \"Rust\".into() }), \"Bỏ qua\");\n    assert_eq!(classify(&Event::Message { id: 1, text: \"\".into() }), \"Bỏ qua\");\n    assert_eq!(classify(&Event::Quit), \"Thoát\");\n    println!(\"{}\", classify(&Event::Key('k')));\n    println!(\"{}\", classify(&Event::Message { id: 2, text: \"Rust\".into() }));\n}\n",
    "expectedOutput": "Phím: k\n[2] Rust\n",
    "hints": [
      "Đặt nhánh q | Q trước range a..=z.",
      "Dùng nhánh Message tổng quát sau nhánh có guard để bao phủ các trường hợp còn lại."
    ],
    "quiz": {
      "question": "Pattern id @ 1..=3 làm gì?",
      "options": [
        "Gán số 3 vào id",
        "Khớp khoảng 1 đến 3 và giữ giá trị trong id",
        "Lặp chương trình ba lần",
        "Tạo tham chiếu mutable tới id"
      ],
      "correct": 1,
      "explanation": "@ kết hợp việc đặt tên với một pattern khác. id nhận chính giá trị đã khớp với khoảng."
    },
    "reference": {
      "label": "The Rust Book · Pattern Syntax",
      "url": "https://doc.rust-lang.org/book/ch19-03-pattern-syntax.html"
    }
  },
  {
    "id": "newtype",
    "moduleId": "design",
    "title": "Newtype: đặt ý nghĩa vào kiểu dữ liệu",
    "description": "Ngăn nhầm đơn vị và tập trung quy tắc chuyển đổi trong một kiểu mới.",
    "duration": 30,
    "objectives": [
      "Phân biệt newtype với type alias",
      "Tạo API chuyển đơn vị có kiểm tra tràn",
      "Hiển thị kiểu riêng bằng Display"
    ],
    "sections": [
      {
        "title": "Cùng u32 nhưng không cùng ý nghĩa",
        "text": "Một khoảng cách tính bằng mét và một khoảng cách tính bằng kilomet đều có thể chứa số nguyên, nhưng không nên hoán đổi tùy ý. Tuple struct Meters(u32) và Kilometers(u32) tạo hai kiểu khác nhau. Nếu chỉ viết type Meters = u32, đó là tên khác cho cùng kiểu và không ngăn việc truyền nhầm đơn vị.",
        "code": "struct Meters(u32);\nstruct Kilometers(u32);\n// Meters(3) và Kilometers(3) là hai giá trị khác kiểu.\n"
      },
      {
        "title": "Đặt chuyển đổi tại ranh giới",
        "text": "TryFrom phù hợp khi chuyển đổi có thể thất bại. Nhân kilomet với 1000 có thể vượt giới hạn u32, nên dùng checked_mul rồi trả lỗi. Người gọi nhìn thấy Result ngay trong API. Với thư viện thật, các trường có thể để private trong module và chỉ mở constructor hoặc phương thức mà bạn muốn hỗ trợ."
      },
      {
        "title": "Một nơi để định nghĩa hành vi riêng",
        "text": "Vì Meters là kiểu do bạn định nghĩa, bạn có thể triển khai Display cho nó để luôn gắn đơn vị khi hiển thị. Newtype cũng hữu ích khi muốn triển khai trait ngoài cho một lớp bọc cục bộ, trong phạm vi quy tắc coherence của Rust. Chỉ chuyển tiếp những thao tác phù hợp; không cần làm mọi phép toán của u32 trở thành API công khai.",
        "code": "impl std::fmt::Display for Meters {\n    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {\n        write!(f, \"{} m\", self.0)\n    }\n}\n"
      }
    ],
    "tip": "Tên kiểu tốt giúp trình biên dịch bắt lỗi truyền nhầm mà một tên biến hoặc chú thích không thể ngăn được.",
    "exercise": {
      "title": "Chuyển kilomet sang mét",
      "instructions": "Hoàn thiện TryFrom<Kilometers> cho Meters. Phép chuyển trả lỗi nếu phép nhân 1000 vượt u32.",
      "requirements": [
        "Dùng checked_mul thay vì phép nhân có thể tràn",
        "Bọc kết quả trong Meters",
        "Giữ Display để đầu ra luôn kèm đơn vị"
      ]
    },
    "starterCode": "use std::fmt;\n#[derive(Debug, PartialEq, Eq)]\nstruct Meters(u32);\n#[derive(Debug, Clone, Copy)]\nstruct Kilometers(u32);\nimpl fmt::Display for Meters {\n    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {\n        write!(f, \"{} m\", self.0)\n    }\n}\nimpl TryFrom<Kilometers> for Meters {\n    type Error = &'static str;\n    fn try_from(value: Kilometers) -> Result<Self, Self::Error> {\n        todo!(\"Chuyển đơn vị có kiểm tra\")\n    }\n}\nfn main() {\n    assert_eq!(Meters::try_from(Kilometers(0)), Ok(Meters(0)));\n    assert_eq!(Meters::try_from(Kilometers(3)), Ok(Meters(3000)));\n    assert!(Meters::try_from(Kilometers(u32::MAX)).is_err());\n    let distance = Meters::try_from(Kilometers(3)).unwrap();\n    assert_eq!(distance.to_string(), \"3000 m\");\n    println!(\"Quãng đường: {distance}\");\n}\n",
    "solutionCode": "use std::fmt;\n#[derive(Debug, PartialEq, Eq)]\nstruct Meters(u32);\n#[derive(Debug, Clone, Copy)]\nstruct Kilometers(u32);\nimpl fmt::Display for Meters {\n    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {\n        write!(f, \"{} m\", self.0)\n    }\n}\nimpl TryFrom<Kilometers> for Meters {\n    type Error = &'static str;\n    fn try_from(value: Kilometers) -> Result<Self, Self::Error> {\n        value.0.checked_mul(1000).map(Meters).ok_or(\"Khoảng cách vượt giới hạn\")\n    }\n}\nfn main() {\n    assert_eq!(Meters::try_from(Kilometers(0)), Ok(Meters(0)));\n    assert_eq!(Meters::try_from(Kilometers(3)), Ok(Meters(3000)));\n    assert!(Meters::try_from(Kilometers(u32::MAX)).is_err());\n    let distance = Meters::try_from(Kilometers(3)).unwrap();\n    assert_eq!(distance.to_string(), \"3000 m\");\n    println!(\"Quãng đường: {distance}\");\n}\n",
    "expectedOutput": "Quãng đường: 3000 m\n",
    "hints": [
      "checked_mul trả Option<u32>.",
      "map(Meters) bọc kết quả; ok_or biến trường hợp tràn thành Err."
    ],
    "quiz": {
      "question": "Vì sao type Meters = u32 không ngăn truyền nhầm đơn vị?",
      "options": [
        "Vì alias chỉ đổi tên, không tạo kiểu mới",
        "Vì u32 không lưu được khoảng cách",
        "Vì mọi alias đều private",
        "Vì Rust luôn bỏ qua kiểu số"
      ],
      "correct": 0,
      "explanation": "Type alias vẫn là cùng kiểu u32. Tuple struct tạo một kiểu danh nghĩa mới, nên trình biên dịch phân biệt được Meters và Kilometers."
    },
    "reference": {
      "label": "The Rust Book · Advanced Traits / Newtype Pattern",
      "url": "https://doc.rust-lang.org/book/ch20-02-advanced-traits.html"
    }
  },
  {
    "id": "typestate",
    "moduleId": "design",
    "title": "Typestate: trạng thái nằm trong kiểu",
    "description": "Thiết kế API chỉ cho phép thao tác khi dữ liệu đã qua bước cần thiết.",
    "duration": 40,
    "objectives": [
      "Dùng tham số kiểu để biểu diễn trạng thái",
      "Chuyển trạng thái bằng phương thức tiêu thụ self",
      "Dùng PhantomData cho marker không cần dữ liệu runtime"
    ],
    "sections": [
      {
        "title": "Làm cho thứ tự thao tác xuất hiện trong API",
        "text": "Một bưu kiện cần có địa chỉ trước khi tạo nhãn gửi. Nếu dùng một struct với bool has_address, mọi nơi gọi label đều phải kiểm tra bool lúc chạy. Typestate tạo các kiểu như Parcel<Unaddressed> và Parcel<Addressed>; phương thức label chỉ tồn tại trên kiểu đã có địa chỉ. Người dùng API không thể gọi nhầm trên trạng thái chưa sẵn sàng mà vẫn biên dịch được."
      },
      {
        "title": "Chuyển trạng thái bằng quyền sở hữu",
        "text": "address_to nhận self, kiểm tra địa chỉ rồi trả Parcel<Addressed>. Vì self bị tiêu thụ, giá trị cũ không còn được dùng sau lời gọi, kể cả khi kết quả là Err. Thiết kế này không cho thử lại trên cùng Parcel; nếu cần giữ giá trị khi lỗi, API phải trả lại Parcel trong nhánh lỗi hoặc chọn cách nhận tham số khác. Phần kiểm tra dữ liệu người dùng vẫn cần Result lúc chạy: kiểu hệ thống không tự biết một chuỗi từ người dùng có rỗng hay không. Sau khi kiểm tra thành công, kiểu mới ghi lại điều kiện đã đạt.",
        "code": "impl Parcel<Unaddressed> {\n    fn address_to(self, address: &str) -> Result<Parcel<Addressed>, &'static str> {\n        // Kiểm tra dữ liệu, rồi tạo kiểu trạng thái mới.\n        todo!()\n    }\n}\n"
      },
      {
        "title": "Marker trạng thái và giới hạn thiết kế",
        "text": "PhantomData<State> là trường marker không chứa một giá trị State thực tế, nhưng có ý nghĩa với kiểm tra kiểu, sở hữu và auto trait. Trong ví dụ này nó gắn trạng thái generic vào Parcel mà không thêm cờ runtime. Typestate hữu ích khi số trạng thái và chuyển đổi tương đối rõ; nếu phải lưu nhiều trạng thái khác nhau trong cùng collection, enum có thể đơn giản hơn.",
        "code": "let parcel = Parcel::new(250);\n// parcel.label(); // Không biên dịch: chưa có phương thức label ở trạng thái này.\nlet addressed = parcel.address_to(\"Hà Nội\")?;\nlet label = addressed.label();\n"
      }
    ],
    "tip": "Typestate ngăn một lớp lỗi gọi API; nó không thay thế kiểm tra địa chỉ, quyền hạn hoặc dữ liệu nhận từ bên ngoài.",
    "exercise": {
      "title": "Bưu kiện có địa chỉ",
      "instructions": "Hoàn thiện address_to: trim địa chỉ, từ chối chuỗi rỗng, rồi chuyển Parcel<Unaddressed> thành Parcel<Addressed>.",
      "requirements": [
        "Trả Err khi địa chỉ không có nội dung",
        "Giữ nguyên trọng lượng khi tạo trạng thái mới",
        "Dùng PhantomData cho trường state, không clone toàn bộ Parcel"
      ]
    },
    "starterCode": "use std::marker::PhantomData;\nstruct Unaddressed;\nstruct Addressed;\nstruct Parcel<State> {\n    weight: u32,\n    address: String,\n    state: PhantomData<State>,\n}\nimpl Parcel<Unaddressed> {\n    fn new(weight: u32) -> Self {\n        Self { weight, address: String::new(), state: PhantomData }\n    }\n    fn address_to(self, address: &str) -> Result<Parcel<Addressed>, &'static str> {\n        todo!(\"Kiểm tra địa chỉ và chuyển trạng thái\")\n    }\n}\nimpl Parcel<Addressed> {\n    fn label(&self) -> String { format!(\"{} g -> {}\", self.weight, self.address) }\n}\nfn main() {\n    assert!(Parcel::new(250).address_to(\"\").is_err());\n    assert!(Parcel::new(250).address_to(\"   \").is_err());\n    let parcel = Parcel::new(250).address_to(\"  Hà Nội  \").unwrap();\n    assert_eq!(parcel.label(), \"250 g -> Hà Nội\");\n    let other = Parcel::new(500).address_to(\"Huế\").unwrap();\n    assert_eq!(other.label(), \"500 g -> Huế\");\n    println!(\"{}\", parcel.label());\n}\n",
    "solutionCode": "use std::marker::PhantomData;\nstruct Unaddressed;\nstruct Addressed;\nstruct Parcel<State> {\n    weight: u32,\n    address: String,\n    state: PhantomData<State>,\n}\nimpl Parcel<Unaddressed> {\n    fn new(weight: u32) -> Self {\n        Self { weight, address: String::new(), state: PhantomData }\n    }\n    fn address_to(self, address: &str) -> Result<Parcel<Addressed>, &'static str> {\n        let address = address.trim();\n        if address.is_empty() { return Err(\"Thiếu địa chỉ\"); }\n        Ok(Parcel { weight: self.weight, address: address.to_owned(), state: PhantomData })\n    }\n}\nimpl Parcel<Addressed> {\n    fn label(&self) -> String { format!(\"{} g -> {}\", self.weight, self.address) }\n}\nfn main() {\n    assert!(Parcel::new(250).address_to(\"\").is_err());\n    assert!(Parcel::new(250).address_to(\"   \").is_err());\n    let parcel = Parcel::new(250).address_to(\"  Hà Nội  \").unwrap();\n    assert_eq!(parcel.label(), \"250 g -> Hà Nội\");\n    let other = Parcel::new(500).address_to(\"Huế\").unwrap();\n    assert_eq!(other.label(), \"500 g -> Huế\");\n    println!(\"{}\", parcel.label());\n}\n",
    "expectedOutput": "250 g -> Hà Nội\n",
    "hints": [
      "Kiểm tra address.trim() trước khi tạo giá trị mới.",
      "Kiểu trả về đã xác định State = Addressed; PhantomData được suy luận theo kiểu đó."
    ],
    "quiz": {
      "question": "Lợi ích của việc label chỉ được định nghĩa cho Parcel<Addressed> là gì?",
      "options": [
        "Mọi địa chỉ đều tự động có thật",
        "Gọi label trên Parcel<Unaddressed> bị chặn khi biên dịch",
        "Bưu kiện tự được gửi qua mạng",
        "Không còn cần Result ở bất kỳ đâu"
      ],
      "correct": 1,
      "explanation": "Trạng thái nằm trong kiểu giúp giới hạn những phương thức có thể gọi. Tính hợp lệ thực tế của địa chỉ vẫn phải được kiểm tra."
    },
    "reference": {
      "label": "std::marker · PhantomData",
      "url": "https://doc.rust-lang.org/std/marker/struct.PhantomData.html"
    }
  },
  {
    "id": "allocation",
    "moduleId": "design",
    "title": "Cấp phát bộ nhớ có chủ đích",
    "description": "Ước lượng dung lượng, mượn dữ liệu và tránh sao chép không cần thiết.",
    "duration": 35,
    "objectives": [
      "Phân biệt length với capacity",
      "Tính dung lượng String theo byte UTF-8",
      "Tạo kết quả sở hữu mới từ các tham chiếu đầu vào"
    ],
    "sections": [
      {
        "title": "Length là dữ liệu, capacity là chỗ chứa",
        "text": "Vec và String quản lý vùng đệm có thể tăng kích thước. len cho biết lượng dữ liệu đang có; capacity cho biết vùng đã được cấp phát có thể chứa bao nhiêu trước khi cần tăng thêm. Dung lượng không phải một phần của nội dung logic. Không nên khẳng định capacity luôn bằng chính xác số bạn yêu cầu, vì API chỉ bảo đảm mức tối thiểu phù hợp.",
        "code": "let mut values = Vec::with_capacity(8);\nassert_eq!(values.len(), 0);\nassert!(values.capacity() >= 8);\nvalues.push(10);\n"
      },
      {
        "title": "Dung lượng của String được tính bằng byte",
        "text": "Tiếng Việt khiến số byte và số ký tự thường khác nhau. Khi nối nhiều &str với một dấu cách giữa mỗi cặp, lượng byte cần là tổng len của các chuỗi cộng số dấu cách. Với đầu vào rỗng, số dấu cách bằng 0; saturating_sub(1) tránh phép trừ usize bị tràn xuống dưới.",
        "code": "let words = [\"Học\", \"Rust\"];\nlet bytes: usize = words.iter().map(|word| word.len()).sum();\nlet capacity = bytes + words.len().saturating_sub(1);\nlet output = String::with_capacity(capacity);\n"
      },
      {
        "title": "Tối ưu phần có căn cứ",
        "text": "Nhận &[&str] cho phép mượn các chuỗi đầu vào; chỉ kết quả mới cần sở hữu bộ đệm. Cấp trước đủ dung lượng rồi push_str từng phần có thể tránh việc phải tăng bộ đệm trong quá trình nối. Đây là kỹ thuật để hiểu cấp phát; trong sản phẩm, words.join(\" \") thường diễn đạt ý định gọn hơn. Chỉ chọn cách tự viết khi cần kiểm soát hoặc đã đo được lợi ích."
      },
      {
        "title": "Tránh kết luận từ một bộ dữ liệu",
        "text": "reserve hay with_capacity giảm số lần tăng bộ đệm khi bạn ước lượng đúng; chúng không giảm tổng lượng dữ liệu cần lưu. Với đầu vào lớn, phép tính dung lượng cũng cần checked_add và giới hạn của ứng dụng; có thể dùng try_reserve để xử lý lỗi cấp phát mà API cho phép. Cân nhắc mượn, tái sử dụng buffer và xử lý từng phần trước khi thêm clone. Bài này dùng các chuỗi nhỏ để tập trung vào đơn vị byte và cấu trúc nối."
      }
    ],
    "tip": "Đừng in hoặc kiểm tra một con số capacity chính xác nếu API chỉ cam kết dung lượng ít nhất bằng mức yêu cầu.",
    "exercise": {
      "title": "Nối chuỗi với dung lượng dự kiến",
      "instructions": "Viết join_words bằng String::with_capacity, push và push_str. Chèn đúng một dấu cách giữa các phần tử, kể cả phần tử rỗng.",
      "requirements": [
        "Dùng số byte len của từng &str để ước lượng",
        "Danh sách rỗng trả String rỗng",
        "Không thêm dấu cách trước phần tử đầu hoặc sau phần tử cuối"
      ]
    },
    "starterCode": "fn join_words(words: &[&str]) -> String {\n    todo!(\"Cấp trước vùng đệm và nối các từ\")\n}\nfn main() {\n    assert_eq!(join_words(&[]), \"\");\n    assert_eq!(join_words(&[\"Rust\"]), \"Rust\");\n    assert_eq!(join_words(&[\"\", \"a\"]), \" a\");\n    assert_eq!(join_words(&[\"Học\", \"Rust\", \"mỗi\", \"ngày\"]), \"Học Rust mỗi ngày\");\n    let result = join_words(&[\"Học\", \"Rust\", \"mỗi\", \"ngày\"]);\n    assert!(result.capacity() >= result.len());\n    println!(\"{result}\");\n}\n",
    "solutionCode": "fn join_words(words: &[&str]) -> String {\n    let bytes: usize = words.iter().map(|word| word.len()).sum();\n    let capacity = bytes + words.len().saturating_sub(1);\n    let mut output = String::with_capacity(capacity);\n    for (index, word) in words.iter().enumerate() {\n        if index > 0 { output.push(' '); }\n        output.push_str(word);\n    }\n    output\n}\nfn main() {\n    assert_eq!(join_words(&[]), \"\");\n    assert_eq!(join_words(&[\"Rust\"]), \"Rust\");\n    assert_eq!(join_words(&[\"\", \"a\"]), \" a\");\n    assert_eq!(join_words(&[\"Học\", \"Rust\", \"mỗi\", \"ngày\"]), \"Học Rust mỗi ngày\");\n    let result = join_words(&[\"Học\", \"Rust\", \"mỗi\", \"ngày\"]);\n    assert!(result.capacity() >= result.len());\n    println!(\"{result}\");\n}\n",
    "expectedOutput": "Học Rust mỗi ngày\n",
    "hints": [
      "Tính số dấu cách bằng words.len().saturating_sub(1).",
      "enumerate giúp chỉ push dấu cách khi index > 0."
    ],
    "quiz": {
      "question": "Khi cấp dung lượng cho String tiếng Việt, nên tính theo gì?",
      "options": [
        "Số từ",
        "Số byte UTF-8",
        "Số dòng màn hình",
        "Số chữ cái không có dấu"
      ],
      "correct": 1,
      "explanation": "String lưu UTF-8; len và capacity của String được tính theo byte, không phải số ký tự hiển thị."
    },
    "reference": {
      "label": "std::string · String / with_capacity",
      "url": "https://doc.rust-lang.org/std/string/struct.String.html#method.with_capacity"
    }
  },
  {
    "id": "benchmarking",
    "moduleId": "design",
    "title": "Đo hiệu năng mà không tự đánh lừa mình",
    "description": "Kiểm tra tính đúng trước, tách thời gian chạy khỏi biên dịch và mạng.",
    "duration": 35,
    "objectives": [
      "Thiết lập phép so sánh có cùng đầu vào và đầu ra",
      "Biết vai trò và giới hạn của Instant và black_box",
      "Không suy luận hiệu năng từ độ trễ runner web"
    ],
    "sections": [
      {
        "title": "So sánh những công việc tương đương",
        "text": "Một phương án nhanh hơn nhưng bỏ sót dữ liệu không phải tối ưu đúng. Trước khi đo, kiểm tra hai cách triển khai cho cùng kết quả ở cả đầu vào rỗng và trường hợp thường. Chọn kích thước dữ liệu gần với thực tế, chạy nhiều lần và kiểm soát việc chuẩn bị dữ liệu có nằm trong phần đo hay không."
      },
      {
        "title": "Chọn công cụ đo và cấu hình phù hợp",
        "text": "Instant đo khoảng thời gian giữa các mốc; nó không phải giờ lịch. Khi so hiệu năng runtime, thường cần bản build tối ưu như cargo run --release, đồng thời tách thời gian biên dịch. std::hint::black_box trả lại giá trị và cố gắng hạn chế một số tối ưu hóa làm mất công việc muốn đo. Đây là cơ chế best-effort, không phải bảo đảm chương trình luôn thực hiện mọi thao tác theo đúng suy nghĩ của bạn.",
        "code": "let start = std::time::Instant::now();\nlet result = std::hint::black_box(work(std::hint::black_box(input)));\nlet elapsed = start.elapsed();\n// Kiểm tra và phân tích kết quả trong môi trường đo đã kiểm soát.\n"
      },
      {
        "title": "Bài web chỉ luyện cấu trúc phép đo",
        "text": "Thời gian hiện trên runner còn chịu ảnh hưởng của mạng, hàng chờ và biên dịch; không dùng nó để kết luận vòng lặp hay iterator nhanh hơn. Bài này hoàn thiện cách tính bằng iterator, đo một vòng chạy minh họa nhưng không in số thời gian. Đầu ra chỉ là checksum xác định để kiểm tra đúng sai, không phải kết quả benchmark của hai phương án."
      },
      {
        "title": "Bằng chứng cần có khi đề xuất tối ưu",
        "text": "Hãy lưu input, lệnh build, cấu hình máy, số lần lặp và phân bố kết quả cùng thay đổi mã. Đo đúng phần ảnh hưởng người dùng: độ trễ, thông lượng hoặc lượng bộ nhớ, rồi kiểm tra lại tính đúng. Với dịch vụ, cải thiện microbenchmark chưa chứng minh request nhanh hơn nếu nút thắt ở I/O. Trong phỏng vấn, giải thích giả thuyết, cách loại công việc ngoài phạm vi đo và trade-off của phương án đã chọn đáng tin hơn một con số chạy duy nhất."
      }
    ],
    "tip": "Không đặt assertion rằng một phiên bản luôn nhanh hơn phiên bản khác: nhiễu hệ thống có thể làm kiểm thử hiệu năng thiếu ổn định.",
    "exercise": {
      "title": "Kiểm tra trước khi đo",
      "instructions": "Hoàn thiện sum_squares_iter để tính tổng bình phương giống phiên bản vòng lặp. main kiểm tra rồi chạy minh họa với black_box. Dữ liệu của bài này được giới hạn để các phép tính số nguyên không tràn; khi nhận dữ liệu tùy ý, cần thiết kế kiểm tra giới hạn hoặc dùng checked_*.",
      "requirements": [
        "Dùng iter, map và sum; dữ liệu mẫu đủ nhỏ để không tràn u64",
        "Giữ mọi assertion so sánh kết quả",
        "Không in elapsed hoặc dùng thời gian làm điều kiện đạt bài"
      ]
    },
    "starterCode": "use std::hint::black_box;\nuse std::time::Instant;\nfn sum_squares_loop(values: &[u64]) -> u64 {\n    let mut total = 0;\n    for &value in values { total += value * value; }\n    total\n}\nfn sum_squares_iter(values: &[u64]) -> u64 {\n    todo!(\"Tính tổng bình phương bằng iterator\")\n}\nfn main() {\n    let values: Vec<u64> = (1..=10).collect();\n    assert_eq!(sum_squares_iter(&[]), 0);\n    assert_eq!(sum_squares_iter(&[2, 3]), 13);\n    assert_eq!(sum_squares_iter(&values), sum_squares_loop(&values));\n    assert_eq!(sum_squares_iter(&values), 385);\n    let started = Instant::now();\n    let mut checksum = 0;\n    for _ in 0..100 {\n        checksum += black_box(sum_squares_iter(black_box(&values)));\n    }\n    let _elapsed = started.elapsed();\n    assert_eq!(checksum, 38_500);\n    println!(\"Kết quả kiểm tra: {checksum}\");\n}\n",
    "solutionCode": "use std::hint::black_box;\nuse std::time::Instant;\nfn sum_squares_loop(values: &[u64]) -> u64 {\n    let mut total = 0;\n    for &value in values { total += value * value; }\n    total\n}\nfn sum_squares_iter(values: &[u64]) -> u64 {\n    values.iter().map(|&value| value * value).sum()\n}\nfn main() {\n    let values: Vec<u64> = (1..=10).collect();\n    assert_eq!(sum_squares_iter(&[]), 0);\n    assert_eq!(sum_squares_iter(&[2, 3]), 13);\n    assert_eq!(sum_squares_iter(&values), sum_squares_loop(&values));\n    assert_eq!(sum_squares_iter(&values), 385);\n    let started = Instant::now();\n    let mut checksum = 0;\n    for _ in 0..100 {\n        checksum += black_box(sum_squares_iter(black_box(&values)));\n    }\n    let _elapsed = started.elapsed();\n    assert_eq!(checksum, 38_500);\n    println!(\"Kết quả kiểm tra: {checksum}\");\n}\n",
    "expectedOutput": "Kết quả kiểm tra: 38500\n",
    "hints": [
      "map biến mỗi số thành bình phương; sum cộng các kết quả.",
      "Mẫu |&value| lấy u64 từ tham chiếu mà không thay đổi slice."
    ],
    "quiz": {
      "question": "Con số thời gian của runner web có đủ để kết luận một thuật toán nhanh hơn không?",
      "options": [
        "Có, chỉ cần một lần chạy",
        "Không, còn lẫn mạng, hàng chờ và biên dịch",
        "Có, vì mọi máy chủ luôn giống nhau",
        "Có, nếu output giống nhau"
      ],
      "correct": 1,
      "explanation": "Benchmark cần kiểm soát phạm vi đo, cấu hình và biến động môi trường. Độ trễ hoàn thành yêu cầu web không chỉ phản ánh thời gian chạy thuật toán."
    },
    "reference": {
      "label": "std::hint · black_box",
      "url": "https://doc.rust-lang.org/std/hint/fn.black_box.html"
    }
  },
  {
    "id": "cli-search",
    "moduleId": "practice",
    "title": "Dự án: công cụ tìm kiếm văn bản",
    "description": "Kết hợp iterator, lifetime và kiểm thử để xây lõi một CLI nhỏ.",
    "duration": 45,
    "objectives": [
      "Trả kết quả mượn từ văn bản gốc",
      "Giữ số dòng và thứ tự khi lọc dữ liệu",
      "Tách tìm kiếm khỏi việc đọc tệp và tham số"
    ],
    "sections": [
      {
        "title": "Chia một CLI thành các ranh giới",
        "text": "Một công cụ tìm kiếm thường có ba phần: đọc tham số, đọc nội dung và tìm kết quả. Giữ hàm search không đọc môi trường hay hệ thống tệp để kiểm thử dễ dàng. Ở máy thật, main có thể đọc tệp rồi gọi hàm này; trên web, main truyền văn bản mẫu. Bạn vẫn xây đúng phần lõi có thể tái sử dụng sau đó."
      },
      {
        "title": "Mượn dòng gốc, cấp phát khi cần so sánh",
        "text": "Kết quả Vec<(usize, &str)> chứa số dòng và tham chiếu tới từng dòng trong text. Lifetime của các &str vì thế gắn với text, không phải query. Chế độ không phân biệt hoa thường có thể tạo chuỗi tạm để so sánh, nhưng kết quả vẫn giữ nguyên chữ hoa, dấu và nội dung từ bản gốc.",
        "code": "fn search<'a>(query: &str, text: &'a str, ignore_case: bool) -> Vec<(usize, &'a str)> {\n    // Kết quả mượn dữ liệu từ text.\n    todo!()\n}\n"
      },
      {
        "title": "Quy định trường hợp biên trước khi viết",
        "text": "Bài này coi query rỗng là không có kết quả, dù contains(\"\") của String có hành vi khác. lines rồi enumerate giữ số dòng gốc; cộng 1 để số dòng bắt đầu từ 1. So sánh qua to_lowercase phù hợp với ví dụ, nhưng chưa phải tìm kiếm Unicode đầy đủ có chuẩn hóa hoặc quy tắc ngôn ngữ. Một sản phẩm thật cần xác định các yêu cầu đó riêng."
      }
    ],
    "tip": "Đừng lowercase văn bản kết quả chỉ vì đã lowercase để tìm: người dùng thường cần nhìn thấy dòng gốc.",
    "exercise": {
      "title": "Tìm dòng và giữ số thứ tự",
      "instructions": "Hoàn thiện search. Trả các dòng chứa query theo thứ tự ban đầu, có hoặc không phân biệt hoa thường theo cờ.",
      "requirements": [
        "Số dòng bắt đầu từ 1 và không bị đánh lại sau lọc",
        "Query rỗng trả vector rỗng",
        "Kết quả giữ nguyên nội dung gốc và chỉ mượn text"
      ]
    },
    "starterCode": "fn search<'a>(query: &str, text: &'a str, ignore_case: bool) -> Vec<(usize, &'a str)> {\n    todo!(\"Lọc các dòng và giữ số thứ tự gốc\")\n}\nfn main() {\n    let text = \"Rust an toàn\\nMình học rust\\nXin chào\\n\";\n    assert_eq!(search(\"rust\", text, false), vec![(2, \"Mình học rust\")]);\n    assert_eq!(search(\"rust\", text, true), vec![(1, \"Rust an toàn\"), (2, \"Mình học rust\")]);\n    assert!(search(\"\", text, true).is_empty());\n    assert!(search(\"Go\", text, true).is_empty());\n    assert!(search(\"Rust\", \"\", false).is_empty());\n    assert_eq!(search(\"hỌc\", text, true), vec![(2, \"Mình học rust\")]);\n    for (line, content) in search(\"rust\", text, true) {\n        println!(\"{line}: {content}\");\n    }\n}\n",
    "solutionCode": "fn search<'a>(query: &str, text: &'a str, ignore_case: bool) -> Vec<(usize, &'a str)> {\n    if query.is_empty() { return Vec::new(); }\n    let needle = if ignore_case { query.to_lowercase() } else { query.to_owned() };\n    text.lines().enumerate()\n        .filter(|(_, line)| {\n            if ignore_case { line.to_lowercase().contains(&needle) }\n            else { line.contains(&needle) }\n        })\n        .map(|(index, line)| (index + 1, line))\n        .collect()\n}\nfn main() {\n    let text = \"Rust an toàn\\nMình học rust\\nXin chào\\n\";\n    assert_eq!(search(\"rust\", text, false), vec![(2, \"Mình học rust\")]);\n    assert_eq!(search(\"rust\", text, true), vec![(1, \"Rust an toàn\"), (2, \"Mình học rust\")]);\n    assert!(search(\"\", text, true).is_empty());\n    assert!(search(\"Go\", text, true).is_empty());\n    assert!(search(\"Rust\", \"\", false).is_empty());\n    assert_eq!(search(\"hỌc\", text, true), vec![(2, \"Mình học rust\")]);\n    for (line, content) in search(\"rust\", text, true) {\n        println!(\"{line}: {content}\");\n    }\n}\n",
    "expectedOutput": "1: Rust an toàn\n2: Mình học rust\n",
    "hints": [
      "Gọi enumerate trước filter để giữ vị trí dòng gốc.",
      "Chỉ lowercase trong bước so sánh; map trả lại line ban đầu."
    ],
    "quiz": {
      "question": "Vì sao lifetime của &str trong kết quả phải gắn với text?",
      "options": [
        "Vì kết quả trỏ vào các đoạn của text",
        "Vì query luôn sống lâu hơn chương trình",
        "Vì usize có lifetime",
        "Vì Vec không thể chứa String"
      ],
      "correct": 0,
      "explanation": "Các slice trong kết quả mượn nội dung của text. Chúng không được sống lâu hơn vùng dữ liệu mà chúng tham chiếu."
    },
    "reference": {
      "label": "The Rust Book · Testing the Search Function",
      "url": "https://doc.rust-lang.org/book/ch12-04-testing-the-librarys-functionality.html"
    }
  },
  {
    "id": "parser-project",
    "moduleId": "practice",
    "title": "Dự án: bộ đọc cấu hình đơn giản",
    "description": "Chuyển văn bản key=value thành dữ liệu có kiểm tra và lỗi kèm số dòng.",
    "duration": 50,
    "objectives": [
      "Định nghĩa một định dạng nhỏ trước khi phân tích",
      "Dùng Result để báo lỗi có vị trí",
      "Xử lý khóa lặp và giữ giá trị chứa dấu bằng"
    ],
    "sections": [
      {
        "title": "Viết đặc tả nhỏ nhưng rõ",
        "text": "Định dạng của bài này có một cặp key=value trên mỗi dòng. Dòng trắng và dòng bắt đầu bằng # sau trim được bỏ qua; khóa và giá trị đều phải có nội dung. Chỉ tách tại dấu bằng đầu tiên, nên token=a=b có giá trị a=b. Đây là định dạng bài tập riêng, không phải trình đọc TOML, INI hay dotenv đầy đủ."
      },
      {
        "title": "Lỗi cần chỉ ra nơi có thể sửa",
        "text": "ParseError lưu số dòng bắt đầu từ 1 và một thông báo ngắn. Dùng enumerate trên toàn bộ lines trước khi bỏ qua chú thích để số dòng vẫn khớp văn bản gốc. Khi gặp lỗi, hàm trả Err ngay; không trả một cấu hình đã đọc một phần như thể mọi dữ liệu đều hợp lệ.",
        "code": "let (key, value) = text.split_once('=')\n    .ok_or(ParseError { line: line_number, message: \"Thiếu dấu =\" })?;\nlet (key, value) = (key.trim(), value.trim());\n"
      },
      {
        "title": "Định nghĩa chính sách cho khóa bị lặp",
        "text": "Nếu chỉ insert vào map, giá trị sau sẽ ghi đè giá trị trước. Bài này coi khóa lặp là lỗi để tránh cấu hình thay đổi âm thầm. BTreeMap được chọn để lúc in luôn có thứ tự khóa rõ ràng. Khi mở rộng, hãy bổ sung test cho dấu nháy, escape hoặc kiểu số trước khi thêm các tính năng tương ứng."
      }
    ],
    "tip": "Đừng thêm quy tắc ngầm như tự bỏ dấu # trong giá trị: nếu đặc tả chỉ cho chú thích cả dòng thì giá trị phải được giữ nguyên.",
    "exercise": {
      "title": "Phân tích key=value",
      "instructions": "Hoàn thiện parse_config. Trả BTreeMap sở hữu các String, hoặc ParseError với đúng dòng và thông báo như main yêu cầu.",
      "requirements": [
        "Bỏ dòng trắng và chú thích cả dòng",
        "Tách đúng dấu = đầu tiên; trim hai phía",
        "Từ chối khóa/giá trị rỗng và khóa lặp; giữ số dòng gốc"
      ]
    },
    "starterCode": "use std::collections::BTreeMap;\n#[derive(Debug, PartialEq, Eq)]\nstruct ParseError { line: usize, message: &'static str }\nfn parse_config(input: &str) -> Result<BTreeMap<String, String>, ParseError> {\n    todo!(\"Phân tích từng dòng và kiểm tra dữ liệu\")\n}\nfn main() {\n    let config = parse_config(\"# ứng dụng\\nhost = localhost\\nport=8080\\nmode = dev\\n\").unwrap();\n    assert_eq!(config.get(\"port\").map(String::as_str), Some(\"8080\"));\n    assert!(parse_config(\" \\n# ghi chú\").unwrap().is_empty());\n    assert_eq!(parse_config(\"ok=1\\nbad\").unwrap_err(), ParseError { line: 2, message: \"Thiếu dấu =\" });\n    assert_eq!(parse_config(\" = x\").unwrap_err().message, \"Khóa hoặc giá trị rỗng\");\n    assert_eq!(parse_config(\"x= \").unwrap_err().message, \"Khóa hoặc giá trị rỗng\");\n    assert_eq!(parse_config(\"x=1\\nx=2\").unwrap_err(), ParseError { line: 2, message: \"Khóa bị lặp\" });\n    assert_eq!(parse_config(\"token=a=b\").unwrap().get(\"token\").unwrap(), \"a=b\");\n    for (key, value) in config { println!(\"{key}={value}\"); }\n}\n",
    "solutionCode": "use std::collections::BTreeMap;\n#[derive(Debug, PartialEq, Eq)]\nstruct ParseError { line: usize, message: &'static str }\nfn parse_config(input: &str) -> Result<BTreeMap<String, String>, ParseError> {\n    let mut result = BTreeMap::new();\n    for (index, raw) in input.lines().enumerate() {\n        let text = raw.trim();\n        if text.is_empty() || text.starts_with('#') { continue; }\n        let line = index + 1;\n        let (key, value) = text.split_once('=').ok_or(ParseError { line, message: \"Thiếu dấu =\" })?;\n        let (key, value) = (key.trim(), value.trim());\n        if key.is_empty() || value.is_empty() {\n            return Err(ParseError { line, message: \"Khóa hoặc giá trị rỗng\" });\n        }\n        if result.insert(key.to_owned(), value.to_owned()).is_some() {\n            return Err(ParseError { line, message: \"Khóa bị lặp\" });\n        }\n    }\n    Ok(result)\n}\nfn main() {\n    let config = parse_config(\"# ứng dụng\\nhost = localhost\\nport=8080\\nmode = dev\\n\").unwrap();\n    assert_eq!(config.get(\"port\").map(String::as_str), Some(\"8080\"));\n    assert!(parse_config(\" \\n# ghi chú\").unwrap().is_empty());\n    assert_eq!(parse_config(\"ok=1\\nbad\").unwrap_err(), ParseError { line: 2, message: \"Thiếu dấu =\" });\n    assert_eq!(parse_config(\" = x\").unwrap_err().message, \"Khóa hoặc giá trị rỗng\");\n    assert_eq!(parse_config(\"x= \").unwrap_err().message, \"Khóa hoặc giá trị rỗng\");\n    assert_eq!(parse_config(\"x=1\\nx=2\").unwrap_err(), ParseError { line: 2, message: \"Khóa bị lặp\" });\n    assert_eq!(parse_config(\"token=a=b\").unwrap().get(\"token\").unwrap(), \"a=b\");\n    for (key, value) in config { println!(\"{key}={value}\"); }\n}\n",
    "expectedOutput": "host=localhost\nmode=dev\nport=8080\n",
    "hints": [
      "split_once trả Option<(&str, &str)> và không tách các dấu = còn lại.",
      "insert trả Some(giá trị cũ) nếu khóa đã tồn tại; dùng điều này để phát hiện trùng."
    ],
    "quiz": {
      "question": "Vì sao dùng split_once thay vì split rồi giả định có đúng hai phần?",
      "options": [
        "Để bỏ mọi khoảng trắng trong dữ liệu",
        "Để giữ nguyên phần giá trị khi nó còn chứa dấu =",
        "Để các khóa tự được sắp xếp",
        "Để không cần xử lý lỗi"
      ],
      "correct": 1,
      "explanation": "split_once chỉ tách tại lần xuất hiện đầu tiên. Với token=a=b, phần còn lại a=b vẫn là một giá trị duy nhất."
    },
    "reference": {
      "label": "std::str · split_once",
      "url": "https://doc.rust-lang.org/std/primitive.str.html#method.split_once"
    }
  },
  {
    "id": "concurrent-project",
    "moduleId": "practice",
    "title": "Dự án: tổng hợp dữ liệu song song",
    "description": "Chia công việc cho scoped threads rồi thu kết quả theo cách xác định.",
    "duration": 50,
    "objectives": [
      "Mượn các phần của slice trong thread::scope",
      "Tạo tất cả công việc trước khi join",
      "Xử lý lỗi trong từng phần và lúc cộng kết quả"
    ],
    "sections": [
      {
        "title": "Chia dữ liệu trước khi thêm đồng thời",
        "text": "Một tổng có thể được tách thành các tổng con rồi cộng lại. chunks tạo các slice không sở hữu riêng dữ liệu; với đọc bất biến, nhiều luồng có thể cùng mượn vùng đầu vào an toàn. Dùng len.div_ceil(workers) để tính kích thước nhóm, và từ chối workers bằng 0 trước phép chia. Dữ liệu quá nhỏ có thể khiến chi phí tạo luồng lớn hơn lợi ích."
      },
      {
        "title": "Scope giới hạn vòng đời công việc",
        "text": "thread::scope cho phép các luồng mượn dữ liệu không cần sống suốt chương trình, vì scope chờ các luồng kết thúc trước khi trả về. Thu các handle khi spawn xong rồi mới join để các công việc có cơ hội chạy đồng thời. join trả Result cho trường hợp luồng panic; bản thân kết quả công việc cũng có thể là Result nếu phát hiện tràn số.",
        "code": "thread::scope(|scope| {\n    let left = scope.spawn(|| left_part.iter().sum::<u64>());\n    let right = scope.spawn(|| right_part.iter().sum::<u64>());\n    left.join().unwrap() + right.join().unwrap()\n})\n"
      },
      {
        "title": "Tính xác định đến từ thiết kế đầu ra",
        "text": "Thứ tự các luồng được lập lịch không được bảo đảm. Nếu mỗi luồng tự println!, đầu ra có thể đổi thứ tự giữa các lần chạy. Bài này để luồng chỉ trả kết quả; main in một tổng cuối cùng. checked_add được dùng cả trong nhóm và lúc tổng hợp để tránh tràn số. Đây là bài về cấu trúc xử lý song song, không khẳng định luôn nhanh hơn cách tuần tự."
      }
    ],
    "tip": "Giữ phần xử lý dữ liệu độc lập với in kết quả sẽ giúp chương trình đồng thời dễ kiểm thử và ít phụ thuộc lịch chạy.",
    "exercise": {
      "title": "Tổng song song có kiểm tra",
      "instructions": "Hoàn thiện parallel_sum: chia slice, spawn các scoped thread, thu từng tổng con và trả tổng cuối.",
      "requirements": [
        "workers bằng 0 trả Err; dữ liệu rỗng với workers hợp lệ trả Ok(0)",
        "Dùng checked_add ở cả hai cấp để phát hiện tràn u64",
        "Không in trong luồng; xử lý kết quả join trước khi cộng"
      ]
    },
    "starterCode": "use std::thread;\nfn parallel_sum(values: &[u64], workers: usize) -> Result<u64, &'static str> {\n    todo!(\"Chia nhóm, chạy scoped threads và cộng kết quả\")\n}\nfn main() {\n    assert_eq!(parallel_sum(&[], 1), Ok(0));\n    assert!(parallel_sum(&[1, 2], 0).is_err());\n    assert_eq!(parallel_sum(&[1, 2, 3, 4, 5], 3), Ok(15));\n    assert_eq!(parallel_sum(&[8, 9], 10), Ok(17));\n    assert!(parallel_sum(&[u64::MAX, 1], 1).is_err());\n    assert!(parallel_sum(&[u64::MAX, 1], 2).is_err());\n    let values: Vec<u64> = (1..=100).collect();\n    let total = parallel_sum(&values, 4).unwrap();\n    assert_eq!(total, 5050);\n    println!(\"Tổng song song: {total}\");\n}\n",
    "solutionCode": "use std::thread;\nfn parallel_sum(values: &[u64], workers: usize) -> Result<u64, &'static str> {\n    if workers == 0 { return Err(\"Số luồng phải lớn hơn 0\"); }\n    if values.is_empty() { return Ok(0); }\n    let chunk_size = values.len().div_ceil(workers);\n    thread::scope(|scope| {\n        let handles: Vec<_> = values.chunks(chunk_size).map(|chunk| {\n            scope.spawn(move || {\n                chunk.iter().try_fold(0u64, |total, &value| {\n                    total.checked_add(value).ok_or(\"Tổng vượt giới hạn\")\n                })\n            })\n        }).collect();\n        let mut total = 0u64;\n        for handle in handles {\n            let partial = handle.join().map_err(|_| \"Luồng xử lý bị lỗi\")??;\n            total = total.checked_add(partial).ok_or(\"Tổng vượt giới hạn\")?;\n        }\n        Ok(total)\n    })\n}\nfn main() {\n    assert_eq!(parallel_sum(&[], 1), Ok(0));\n    assert!(parallel_sum(&[1, 2], 0).is_err());\n    assert_eq!(parallel_sum(&[1, 2, 3, 4, 5], 3), Ok(15));\n    assert_eq!(parallel_sum(&[8, 9], 10), Ok(17));\n    assert!(parallel_sum(&[u64::MAX, 1], 1).is_err());\n    assert!(parallel_sum(&[u64::MAX, 1], 2).is_err());\n    let values: Vec<u64> = (1..=100).collect();\n    let total = parallel_sum(&values, 4).unwrap();\n    assert_eq!(total, 5050);\n    println!(\"Tổng song song: {total}\");\n}\n",
    "expectedOutput": "Tổng song song: 5050\n",
    "hints": [
      "Tạo Vec handle bằng map rồi collect; sau đó mới duyệt để join.",
      "join trả Result của kết quả luồng; nếu luồng cũng trả Result thì có hai lớp lỗi cần xử lý."
    ],
    "quiz": {
      "question": "Vì sao kết quả của bài vẫn ổn định dù lịch chạy luồng có thể thay đổi?",
      "options": [
        "Rust luôn chạy các luồng đúng thứ tự tạo",
        "Các luồng không in; main chỉ in tổng sau khi thu kết quả",
        "Scoped thread thực ra không chạy được",
        "join tự sắp xếp toàn bộ stdout"
      ],
      "correct": 1,
      "explanation": "Thiết kế gom dữ liệu trước rồi in một kết quả cuối tránh phụ thuộc vào thứ tự println! từ các luồng khác nhau."
    },
    "reference": {
      "label": "std::thread · scope",
      "url": "https://doc.rust-lang.org/std/thread/fn.scope.html"
    }
  }
];
