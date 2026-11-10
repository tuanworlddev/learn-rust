import type { Lesson } from "./curriculum";

export const foundationLessons: Lesson[] = [
  {
    "id": "installation",
    "moduleId": "setup",
    "title": "Cài đặt Rust & Hiểu bộ công cụ",
    "description": "Phân biệt rustup, rustc và Cargo; chuẩn bị môi trường trên máy của bạn.",
    "duration": 25,
    "objectives": [
      "Biết nhiệm vụ của rustup, rustc và cargo",
      "Kiểm tra toolchain và PATH trên máy",
      "Phân biệt chạy mã trên web với cài Rust cục bộ"
    ],
    "sections": [
      {
        "title": "Ba công cụ, ba trách nhiệm",
        "text": "rustup quản lý các phiên bản Rust và thành phần đi kèm. rustc biên dịch mã Rust. Cargo quản lý package, dependency và các công việc như build, run, test. Cài qua hướng dẫn chính thức của rustup giúp ba công cụ dùng cùng một toolchain; stable phù hợp để bắt đầu khóa học này.",
        "code": "# Chạy trong terminal trên máy, không trong trình soạn thảo Rust:\nrustup show\nrustc --version\ncargo --version"
      },
      {
        "title": "Hoàn tất phần phụ thuộc của hệ điều hành",
        "text": "Trang cài đặt chính thức hướng dẫn riêng cho Windows, macOS và Linux. Rust cần linker của hệ thống: Windows thường dùng bộ C++ build tools được trình cài đặt gợi ý; macOS dùng Command Line Tools; Linux cần các công cụ build tương ứng bản phân phối. Sau khi cài, mở terminal mới để PATH được cập nhật rồi kiểm tra lại lệnh.",
        "code": "# macOS: cài Command Line Tools nếu máy chưa có\nxcode-select --install\n\n# Sau khi rustup đã được cài\nrustup default stable\nrustup update stable"
      },
      {
        "title": "Bài học trên web không kiểm tra máy cá nhân",
        "text": "Nút Chạy mã gửi chương trình một tệp đến môi trường Rust của website. Chạy thành công ở đây không chứng minh máy bạn đã cài rustup hoặc Cargo. Bài tập dưới dùng các giá trị bool giả định để luyện điều kiện sẵn sàng; hãy thực hiện các lệnh terminal phía trên nếu muốn xác minh cài đặt cục bộ.\n\nĐể làm bài này, bool chỉ nhận true hoặc false; a && b đúng khi cả hai cùng đúng. Khung fn tools_ready(...) -> bool đã được cung cấp. Thay todo! bằng biểu thức điều kiện và không thêm dấu chấm phẩy ở cuối để hàm trả kết quả. Chương Hàm & Luồng điều khiển sẽ giải thích đầy đủ cú pháp này.",
        "code": "fn tools_ready(has_rustc: bool, has_cargo: bool) -> bool {\n    has_rustc && has_cargo\n}"
      }
    ],
    "tip": "Nếu terminal báo command not found, kiểm tra hướng dẫn PATH của rustup và mở terminal mới trước khi cài lại.",
    "exercise": {
      "title": "Kiểm tra điều kiện sẵn sàng",
      "instructions": "Bài thực hành một tệp này mô hình hóa kết quả kiểm tra công cụ, không chạy rustup hay kiểm tra máy bạn. Hoàn thiện tools_ready: chỉ sẵn sàng khi cả rustc và Cargo đều có.",
      "requirements": [
        "Dùng toán tử &&",
        "Giữ bốn assertions để kiểm tra đủ tổ hợp",
        "Không gọi lệnh hệ thống hoặc đọc môi trường máy"
      ]
    },
    "starterCode": "fn tools_ready(has_rustc: bool, has_cargo: bool) -> bool {\n    todo!(\"Cần cả trình biên dịch và Cargo\")\n}\n\nfn main() {\n    assert!(tools_ready(true, true));\n    assert!(!tools_ready(true, false));\n    assert!(!tools_ready(false, true));\n    assert!(!tools_ready(false, false));\n    println!(\"Điều kiện sẵn sàng: {}\", tools_ready(true, true));\n}",
    "solutionCode": "fn tools_ready(has_rustc: bool, has_cargo: bool) -> bool {\n    has_rustc && has_cargo\n}\n\nfn main() {\n    assert!(tools_ready(true, true));\n    assert!(!tools_ready(true, false));\n    assert!(!tools_ready(false, true));\n    assert!(!tools_ready(false, false));\n    println!(\"Điều kiện sẵn sàng: {}\", tools_ready(true, true));\n}",
    "expectedOutput": "Điều kiện sẵn sàng: true\n",
    "hints": [
      "&& chỉ trả true khi cả hai phía đều true.",
      "Trả has_rustc && has_cargo, không thêm dấu chấm phẩy cuối biểu thức."
    ],
    "quiz": {
      "question": "Công cụ nào quản lý các toolchain Rust đã cài?",
      "options": [
        "rustup",
        "println!",
        "rustfmt chỉ làm việc này",
        "Cargo.toml"
      ],
      "correct": 0,
      "explanation": "rustup quản lý toolchain và thành phần; rustc là trình biên dịch, còn Cargo vận hành package."
    },
    "reference": {
      "label": "The Rust Book · Installation",
      "url": "https://doc.rust-lang.org/book/ch01-01-installation.html"
    }
  },
  {
    "id": "cargo-basics",
    "moduleId": "setup",
    "title": "Cargo: Tạo, kiểm tra và chạy dự án",
    "description": "Làm quen Cargo.toml, src/main.rs và vòng lặp phát triển hằng ngày.",
    "duration": 25,
    "objectives": [
      "Tạo binary package bằng cargo new",
      "Phân biệt check, build, run và test",
      "Hiểu output debug và release"
    ],
    "sections": [
      {
        "title": "Một package có manifest và mã nguồn",
        "text": "cargo new tạo cấu trúc package ban đầu. Cargo.toml chứa thông tin package và dependency; src/main.rs là crate root của chương trình thực thi mặc định. edition mô tả phiên bản quy tắc ngôn ngữ của package, không phải số phiên bản toolchain đã cài.",
        "code": "# Chạy trên terminal cục bộ\ncargo new hello_rust\ncd hello_rust\ncargo run\n\n# Cargo.toml\n# [package]\n# name = \"hello_rust\"\n# version = \"0.1.0\"\n# edition = \"2024\""
      },
      {
        "title": "Chọn lệnh theo việc cần làm",
        "text": "cargo check kiểm tra mã mà không tạo chương trình thực thi cuối cùng, nên hữu ích khi đang sửa. cargo build tạo output; cargo run build khi cần rồi chạy; cargo test chạy bộ kiểm thử. Chọn lệnh đúng giúp phân biệt lỗi biên dịch, lỗi lúc chạy và lỗi kỳ vọng trong test.",
        "code": "cargo check\ncargo build\ncargo run\ncargo test"
      },
      {
        "title": "Debug để phát triển, release để tối ưu",
        "text": "Theo cấu hình mặc định, output build phát triển nằm trong target/debug, còn cargo build --release dùng target/release và bật tối ưu. Cargo.lock ghi lại dependency đã được resolve để các lần build có cơ sở tái lập. Bài web chỉ tính đường dẫn dựa trên một cờ bool; nó không tạo package hay chạy Cargo.\n\nTrong mã mẫu, if điều_kiện { giá_trị_đúng } else { giá_trị_sai } chọn một giá trị. Hai nhánh trả chuỗi literal, như \"debug\"; những chuỗi literal này có kiểu &'static str. Bạn giữ nguyên chữ ký hàm đã cho và chỉ sửa biểu thức trả về. Tham chiếu và lifetime sẽ được học ở chương Ownership & Borrowing.",
        "code": "cargo build --release\n\n# Đường dẫn mặc định của binary trên Unix:\n# target/debug/hello_rust\n# target/release/hello_rust\n# Windows thường thêm hậu tố .exe."
      }
    ],
    "tip": "Sửa mã → cargo check → cargo test → cargo run là một vòng làm việc hữu ích; không cần build release sau mỗi dòng sửa.",
    "exercise": {
      "title": "Chọn thư mục build",
      "instructions": "Trong chương trình Rust một tệp trên web, viết target_directory để trả đường dẫn mặc định theo cờ release. Đây là bài tập về biểu thức điều kiện; không chạy Cargo và không tạo thư mục.",
      "requirements": [
        "true trả target/release",
        "false trả target/debug",
        "Giữ hai assertions"
      ]
    },
    "starterCode": "fn target_directory(release: bool) -> &'static str {\n    todo!(\"Chọn thư mục theo profile\")\n}\n\nfn main() {\n    assert_eq!(target_directory(false), \"target/debug\");\n    assert_eq!(target_directory(true), \"target/release\");\n    println!(\"Bản phát hành: {}\", target_directory(true));\n}",
    "solutionCode": "fn target_directory(release: bool) -> &'static str {\n    if release { \"target/release\" } else { \"target/debug\" }\n}\n\nfn main() {\n    assert_eq!(target_directory(false), \"target/debug\");\n    assert_eq!(target_directory(true), \"target/release\");\n    println!(\"Bản phát hành: {}\", target_directory(true));\n}",
    "expectedOutput": "Bản phát hành: target/release\n",
    "hints": [
      "if là một biểu thức và có thể trả chuỗi từ mỗi nhánh.",
      "Trả if release { \"target/release\" } else { \"target/debug\" }."
    ],
    "quiz": {
      "question": "Bạn muốn kiểm tra lỗi biên dịch nhanh mà chưa cần binary cuối cùng. Chọn lệnh nào?",
      "options": [
        "cargo new",
        "cargo check",
        "cargo run --release",
        "rustup update"
      ],
      "correct": 1,
      "explanation": "cargo check phân tích và kiểm tra mã mà không thực hiện toàn bộ công việc tạo binary cuối cùng."
    },
    "reference": {
      "label": "The Cargo Book · Creating a New Package",
      "url": "https://doc.rust-lang.org/cargo/guide/creating-a-new-project.html"
    }
  },
  {
    "id": "compiler-errors",
    "moduleId": "setup",
    "title": "Đọc lỗi trình biên dịch",
    "description": "Dùng vị trí, kiểu kỳ vọng và gợi ý của rustc để sửa đúng nguyên nhân.",
    "duration": 25,
    "objectives": [
      "Đọc file, dòng và cột trong diagnostic",
      "Hiểu expected và found",
      "Phân biệt lỗi biên dịch với panic lúc chạy"
    ],
    "sections": [
      {
        "title": "Bắt đầu từ lỗi đầu tiên",
        "text": "Diagnostic thường cho biết loại lỗi, vị trí và đoạn mã liên quan. Dòng expected diễn tả kiểu mà ngữ cảnh yêu cầu; found nói kiểu trình biên dịch thực sự thấy. Sửa một lỗi gốc có thể làm biến mất nhiều lỗi kéo theo, nên không cần sửa tất cả thông báo cùng lúc.",
        "code": "fn main() {\n    let count: i32 = \"3\";\n    // expected i32, found &str\n    println!(\"{count}\");\n}"
      },
      {
        "title": "Dấu chấm phẩy cũng có thể đổi kiểu",
        "text": "Một hàm hứa trả i32 cần kết thúc bằng giá trị i32. Nếu biểu thức cuối có dấu chấm phẩy, nó trở thành câu lệnh và khối có thể trả (), kiểu đơn vị. Đọc cả chữ ký hàm lẫn phần thân sẽ giúp hiểu thông báo kiểu không khớp thay vì chỉ thử thêm return ở mọi nơi.",
        "code": "fn double(value: i32) -> i32 {\n    value * 2 // Có giá trị i32; không đặt ; ở đây.\n}"
      },
      {
        "title": "Tra mã lỗi và kiểm tra lại",
        "text": "Với mã như E0308, lệnh rustc --explain E0308 trên máy cung cấp giải thích và ví dụ. Gợi ý help là điểm bắt đầu, không thay thế việc hiểu ý định chương trình. Lỗi biên dịch ngăn tạo chương trình; assertion thất bại xảy ra khi chương trình đã chạy. Bài web bên dưới cố tình có lỗi kiểu để bạn sửa.",
        "code": "# Lệnh terminal cục bộ, không phải mã Rust:\nrustc --explain E0308\ncargo check\n\n# Trên web: sửa mã rồi nhấn Chạy mã để đọc diagnostic mới."
      }
    ],
    "tip": "Đọc thông báo theo thứ tự: vị trí → điều chương trình đang hứa → điều biểu thức thực sự trả về.",
    "exercise": {
      "title": "Sửa hai lỗi kiểu",
      "instructions": "Bài thực hành một tệp trên web có hai lỗi: count được khai báo i32 nhưng gán chuỗi, và double không trả giá trị vì dấu chấm phẩy. Sửa chúng; lệnh rustc --explain chỉ được thực hiện trên terminal cục bộ.",
      "requirements": [
        "Giữ count là i32 với giá trị 3",
        "double phải trả value * 2",
        "Giữ cả assertions và dòng in"
      ]
    },
    "starterCode": "fn double(value: i32) -> i32 {\n    value * 2;\n}\n\nfn main() {\n    let count: i32 = \"3\";\n    assert_eq!(double(count), 6);\n    assert_eq!(double(-2), -4);\n    println!(\"Kết quả: {}\", double(count));\n}",
    "solutionCode": "fn double(value: i32) -> i32 {\n    value * 2\n}\n\nfn main() {\n    let count: i32 = 3;\n    assert_eq!(double(count), 6);\n    assert_eq!(double(-2), -4);\n    println!(\"Kết quả: {}\", double(count));\n}",
    "expectedOutput": "Kết quả: 6\n",
    "hints": [
      "3 là literal số; \"3\" là literal chuỗi.",
      "Bỏ dấu chấm phẩy sau value * 2 để biểu thức trở thành kết quả của double."
    ],
    "quiz": {
      "question": "Thông báo expected i32, found &str nói điều gì?",
      "options": [
        "Trình biên dịch muốn số nguyên nhưng gặp chuỗi được mượn",
        "Chương trình chạy hết bộ nhớ",
        "i32 không được Rust hỗ trợ",
        "Cần cài lại Cargo"
      ],
      "correct": 0,
      "explanation": "Đây là sự không khớp kiểu giữa yêu cầu của ngữ cảnh và kiểu thực tế của biểu thức."
    },
    "reference": {
      "label": "Rust Error Codes · E0308",
      "url": "https://doc.rust-lang.org/error_codes/E0308.html"
    }
  },
  {
    "id": "scalar-types",
    "moduleId": "basics",
    "title": "Kiểu scalar & Phép toán số",
    "description": "Chọn số nguyên, số thực, bool và char phù hợp với dữ liệu.",
    "duration": 30,
    "objectives": [
      "Phân biệt signed, unsigned và số thực",
      "Hiểu chia nguyên và phần dư",
      "Nhận biết bool và Unicode scalar char"
    ],
    "sections": [
      {
        "title": "Kích thước và dấu là một phần của kiểu",
        "text": "i8, i16, i32, i64 và i128 là các kiểu số nguyên có dấu; u8 đến u128 là các kiểu tương ứng không dấu. usize thường dùng cho độ dài và chỉ số vì kích thước của nó phù hợp nền tảng. Chọn kiểu theo miền giá trị, không chỉ vì biến hiện tại đang có số nhỏ.",
        "code": "let temperature: i32 = -5;\nlet seconds: u32 = 125;\nlet bytes: u8 = 255;\nlet position: usize = 0;"
      },
      {
        "title": "Phép chia phụ thuộc kiểu toán hạng",
        "text": "Chia hai số nguyên tạo thương nguyên và cắt phần lẻ về phía 0; toán tử % cho phần dư. f32 và f64 biểu diễn số thực dấu phẩy động, nên nhiều phân số thập phân không được biểu diễn chính xác. Với các phép tính có nguy cơ tràn hoặc chia cho 0, các phương thức checked_* giúp xử lý thay vì dựa vào giả định.",
        "code": "assert_eq!(125 / 60, 2);\nassert_eq!(125 % 60, 5);\nassert_eq!(-7 / 2, -3);\nassert_eq!(u8::MAX.checked_add(1), None);"
      },
      {
        "title": "Bool và char không phải số tùy ý",
        "text": "bool chỉ có true và false, dùng trực tiếp cho điều kiện. char được viết trong dấu nháy đơn và biểu diễn một Unicode scalar value; chuỗi dùng dấu nháy kép. Một chữ hiển thị có thể gồm nhiều scalar, nên char không đồng nghĩa với toàn bộ một cụm ký tự có dấu kết hợp.\n\nBài tập cần trả hai số cùng lúc nên dùng tuple. Kiểu (u32, u32) chứa hai số u32; viết (2, 5) để tạo một giá trị. let (minutes, seconds) = (2, 5); tách hai thành phần thành hai biến. Đây là kiểu ghép dữ liệu, khác với các kiểu scalar ở trên.",
        "code": "let enabled: bool = true;\nlet letter: char = 'ệ';\nlet text: &str = \"Học Rust\";\nassert!(enabled);\nassert_eq!(letter.len_utf8(), 3);"
      }
    ],
    "tip": "Nếu muốn 5 / 2 ra 2.5, cần dùng kiểu số thực. Chuyển kết quả 2 sang f64 sau khi chia không khôi phục được phần lẻ.",
    "exercise": {
      "title": "Đổi giây thành phút và giây",
      "instructions": "Viết split_seconds trả tuple (số phút nguyên, số giây còn lại). Không dùng số thực; dùng phép chia nguyên và phần dư.",
      "requirements": [
        "125 giây thành (2, 5)",
        "0 thành (0, 0)",
        "60 thành (1, 0)",
        "Phần giây luôn nhỏ hơn 60"
      ]
    },
    "starterCode": "fn split_seconds(total: u32) -> (u32, u32) {\n    todo!(\"Trả về phút và giây còn lại\")\n}\n\nfn main() {\n    assert_eq!(split_seconds(0), (0, 0));\n    assert_eq!(split_seconds(60), (1, 0));\n    assert_eq!(split_seconds(125), (2, 5));\n    let (minutes, seconds) = split_seconds(125);\n    println!(\"{minutes} phút {seconds} giây\");\n}",
    "solutionCode": "fn split_seconds(total: u32) -> (u32, u32) {\n    (total / 60, total % 60)\n}\n\nfn main() {\n    assert_eq!(split_seconds(0), (0, 0));\n    assert_eq!(split_seconds(60), (1, 0));\n    assert_eq!(split_seconds(125), (2, 5));\n    let (minutes, seconds) = split_seconds(125);\n    println!(\"{minutes} phút {seconds} giây\");\n}",
    "expectedOutput": "2 phút 5 giây\n",
    "hints": [
      "Thương total / 60 là số phút nguyên.",
      "Phần giây còn lại là total % 60; đặt hai biểu thức trong một tuple."
    ],
    "quiz": {
      "question": "Kết quả của 7 / 2 khi cả hai toán hạng là i32 là gì?",
      "options": [
        "3.5",
        "4",
        "3",
        "Lỗi biên dịch"
      ],
      "correct": 2,
      "explanation": "Chia nguyên cắt bỏ phần lẻ về phía 0, nên kết quả là 3."
    },
    "reference": {
      "label": "The Rust Book · Data Types",
      "url": "https://doc.rust-lang.org/book/ch03-02-data-types.html"
    }
  },
  {
    "id": "constants-shadowing",
    "moduleId": "basics",
    "title": "Hằng số, shadowing & Tên biến",
    "description": "Phân biệt giá trị cố định, gán lại và tạo một binding mới.",
    "duration": 20,
    "objectives": [
      "Khai báo const với kiểu tường minh",
      "Phân biệt mut và shadowing",
      "Theo dõi giá trị trong các phạm vi lồng nhau"
    ],
    "sections": [
      {
        "title": "Hằng số ghi rõ ý nghĩa của một con số",
        "text": "const cần kiểu tường minh và một giá trị tính được trong ngữ cảnh hằng. Theo quy ước, tên hằng dùng SCREAMING_SNAKE_CASE. Hằng số không thể thêm mut; hãy dùng chúng cho quy tắc hoặc đơn vị ổn định để tránh rải các con số không giải thích khắp mã.",
        "code": "const BYTES_PER_KIB: u32 = 1024;\nconst MAX_RETRIES: u8 = 3;"
      },
      {
        "title": "Shadowing tạo binding mới",
        "text": "let với một tên đã dùng tạo binding mới và che binding trước trong phạm vi tương ứng. Binding mới có thể mang kiểu khác, còn gán lại một biến mut phải giữ kiểu ban đầu. Shadowing hữu ích khi dữ liệu đi qua các giai đoạn mà tên khái niệm vẫn giữ nguyên.",
        "code": "let input = \"   Rust   \";\nlet input = input.trim();\nlet input = input.len();\nassert_eq!(input, 4);"
      },
      {
        "title": "Tên giống nhau không xóa phạm vi ngoài",
        "text": "Shadowing trong một khối không thay đổi binding bên ngoài khối đó. Khi ra khỏi khối, tên lại chỉ binding ngoài. Nếu người đọc phải đoán tên đang có nghĩa gì, tách thành tên như size_kib và size_bytes có thể rõ ràng hơn; shadowing là một công cụ, không phải yêu cầu.",
        "code": "let size = 2;\n{\n    let size = size * BYTES_PER_KIB;\n    assert_eq!(size, 2048);\n}\nassert_eq!(size, 2);"
      }
    ],
    "tip": "KiB là 1024 byte; kB theo đơn vị thập phân là 1000 byte. Đặt tên hằng đúng đơn vị giúp tránh nhầm.",
    "exercise": {
      "title": "Đổi KiB sang byte",
      "instructions": "Hoàn thiện kib_to_bytes bằng hằng BYTES_PER_KIB. Ở main, binding size được shadow sau khi đổi đơn vị. Đầu vào bài tập nhỏ và không gây tràn u32.",
      "requirements": [
        "Sử dụng hằng đã khai báo",
        "0 KiB trả 0",
        "2 KiB trả 2048",
        "Giữ phần shadowing của main"
      ]
    },
    "starterCode": "const BYTES_PER_KIB: u32 = 1024;\n\nfn kib_to_bytes(kib: u32) -> u32 {\n    todo!(\"Đổi đơn vị bằng hằng số\")\n}\n\nfn main() {\n    assert_eq!(kib_to_bytes(0), 0);\n    assert_eq!(kib_to_bytes(2), 2048);\n    let size = 2;\n    let size = kib_to_bytes(size);\n    println!(\"2 KiB = {size} byte\");\n}",
    "solutionCode": "const BYTES_PER_KIB: u32 = 1024;\n\nfn kib_to_bytes(kib: u32) -> u32 {\n    kib * BYTES_PER_KIB\n}\n\nfn main() {\n    assert_eq!(kib_to_bytes(0), 0);\n    assert_eq!(kib_to_bytes(2), 2048);\n    let size = 2;\n    let size = kib_to_bytes(size);\n    println!(\"2 KiB = {size} byte\");\n}",
    "expectedOutput": "2 KiB = 2048 byte\n",
    "hints": [
      "Nhân số KiB với số byte trong một KiB.",
      "Biểu thức trả về là kib * BYTES_PER_KIB."
    ],
    "quiz": {
      "question": "Điểm nào đúng về shadowing bằng let?",
      "options": [
        "Nó luôn cần mut",
        "Nó tạo binding mới và có thể đổi kiểu",
        "Nó thay đổi mọi biến cùng tên ở phạm vi ngoài",
        "Nó chỉ dùng được với số nguyên"
      ],
      "correct": 1,
      "explanation": "Shadowing tạo một binding mới. Việc gán lại biến mut chỉ thay đổi giá trị của binding hiện có và giữ nguyên kiểu."
    },
    "reference": {
      "label": "The Rust Book · Variables and Mutability",
      "url": "https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html"
    }
  },
  {
    "id": "conversions",
    "moduleId": "basics",
    "title": "Chuyển kiểu có kiểm soát",
    "description": "Chọn From, TryFrom hoặc parse theo loại dữ liệu và khả năng thất bại.",
    "duration": 25,
    "objectives": [
      "Dùng From cho chuyển đổi không lỗi",
      "Dùng TryFrom khi có thể vượt miền giá trị",
      "Phân biệt parse chuỗi với ép kiểu as"
    ],
    "sections": [
      {
        "title": "Rust không âm thầm trộn mọi kiểu số",
        "text": "Một phép toán cần các kiểu toán hạng phù hợp. From và Into cung cấp chuyển đổi khi kiểu có triển khai hợp đồng không thất bại tương ứng. Ví dụ, mọi u8 đều biểu diễn được trong u32. Cách viết này nói rõ ý định mở rộng miền số mà không bỏ mất dữ liệu.",
        "code": "let small: u8 = 200;\nlet wide = u32::from(small);\nassert_eq!(wide, 200_u32);"
      },
      {
        "title": "Kiểm tra thay vì làm rơi bit",
        "text": "Đổi i32 sang u8 có thể thất bại vì số âm hoặc lớn hơn 255. TryFrom trả Result để bạn xử lý trường hợp đó. Cú pháp as có các quy tắc ép kiểu riêng và có thể cắt bớt bit khi thu hẹp số nguyên; nó không hứa báo lỗi khi giá trị nằm ngoài miền bạn mong muốn.",
        "code": "let valid = u8::try_from(200_i32);\nlet too_large = u8::try_from(300_i32);\nassert_eq!(valid, Ok(200));\nassert!(too_large.is_err());\nassert_eq!(300_u16 as u8, 44);"
      },
      {
        "title": "Chuỗi cần được phân tích nội dung",
        "text": "Đổi chuỗi \"42\" thành số là parse, không phải ép kiểu as. Hãy chỉ rõ kiểu đích hoặc cung cấp ngữ cảnh đủ để suy luận. Tùy loại lỗi bạn cần báo, có thể giữ Result từ parse hoặc chuyển lỗi sang kiểu miền nghiệp vụ ở tầng cao hơn.\n\nResult<T, E> là kết quả có hai khả năng: Ok(value) chứa giá trị chuyển đổi thành công, còn Err(error) chứa lỗi. Trong bài này, u8::try_from(value) tự tạo đúng Ok hoặc Err; bạn chỉ cần trả kết quả đó. Chương Option & Result sẽ trình bày cách xử lý lỗi đầy đủ.",
        "code": "let value: Result<i32, _> = \"42\".parse();\nassert_eq!(value, Ok(42));\nassert!(\"bốn mươi hai\".parse::<i32>().is_err());"
      }
    ],
    "tip": "Chọn chuyển đổi theo câu hỏi: có thể thất bại không? Nếu có, đưa khả năng đó vào kiểu trả về.",
    "exercise": {
      "title": "Một byte hợp lệ",
      "instructions": "Viết as_byte chuyển i32 thành u8 bằng TryFrom. Giá trị ngoài 0–255 phải trả Err; không ép bằng as rồi mất thông tin.",
      "requirements": [
        "200 chuyển thành Ok(200)",
        "-1 và 256 trả Err",
        "Giữ nguyên kiểu TryFromIntError"
      ]
    },
    "starterCode": "fn as_byte(value: i32) -> Result<u8, std::num::TryFromIntError> {\n    todo!(\"Chuyển đổi và giữ khả năng lỗi\")\n}\n\nfn main() {\n    assert_eq!(as_byte(200), Ok(200));\n    assert_eq!(as_byte(0), Ok(0));\n    assert!(as_byte(-1).is_err());\n    assert!(as_byte(256).is_err());\n    println!(\"Byte hợp lệ: {}\", as_byte(200).expect(\"Dữ liệu thử hợp lệ\"));\n}",
    "solutionCode": "fn as_byte(value: i32) -> Result<u8, std::num::TryFromIntError> {\n    u8::try_from(value)\n}\n\nfn main() {\n    assert_eq!(as_byte(200), Ok(200));\n    assert_eq!(as_byte(0), Ok(0));\n    assert!(as_byte(-1).is_err());\n    assert!(as_byte(256).is_err());\n    println!(\"Byte hợp lệ: {}\", as_byte(200).expect(\"Dữ liệu thử hợp lệ\"));\n}",
    "expectedOutput": "Byte hợp lệ: 200\n",
    "hints": [
      "TryFrom đã nằm trong prelude của edition 2024.",
      "Trả trực tiếp u8::try_from(value)."
    ],
    "quiz": {
      "question": "Cách nào phát hiện i32 nằm ngoài miền u8?",
      "options": [
        "value as u8",
        "u8::try_from(value)",
        "format!(\"{value}\")",
        "value.to_string()"
      ],
      "correct": 1,
      "explanation": "TryFrom trả Err nếu không thể biểu diễn giá trị. Ép số nguyên bằng as không cung cấp Result để báo trường hợp này."
    },
    "reference": {
      "label": "Rust standard library · TryFrom",
      "url": "https://doc.rust-lang.org/std/convert/trait.TryFrom.html"
    }
  },
  {
    "id": "loops",
    "moduleId": "flow",
    "title": "loop, while, break & continue",
    "description": "Chọn dạng vòng lặp theo điều kiện dừng và dữ liệu cần xử lý.",
    "duration": 25,
    "objectives": [
      "Dùng while khi trạng thái quyết định số lượt",
      "Thoát loop với một giá trị",
      "Phân biệt break và continue"
    ],
    "sections": [
      {
        "title": "while kiểm tra trước mỗi lượt",
        "text": "while chạy khi điều kiện còn true và có thể không chạy lần nào nếu điều kiện sai ngay từ đầu. Thân vòng lặp cần tạo tiến triển hướng đến điều kiện dừng. Khi tách từng chữ số của một số nguyên, phép chia cho 10 làm giá trị nhỏ dần cho đến 0.",
        "code": "let mut number = 125;\nwhile number > 0 {\n    let digit = number % 10;\n    println!(\"{digit}\");\n    number /= 10;\n}"
      },
      {
        "title": "loop có thể tạo một kết quả",
        "text": "loop lặp vô hạn trừ khi điều khiển thoát khỏi nó. break value trả giá trị cho biểu thức loop; cách này hữu ích khi tìm một kết quả qua nhiều lần thử. Một vòng lặp quên điều kiện dừng có thể bị môi trường thực thi giới hạn thời gian, nên luôn kiểm tra tiến triển trước khi chạy.",
        "code": "let mut count = 0;\nlet result = loop {\n    count += 1;\n    if count == 3 { break count * 2; }\n};\nassert_eq!(result, 6);"
      },
      {
        "title": "Bỏ một lượt khác với thoát vòng lặp",
        "text": "continue bỏ phần còn lại của lượt hiện tại rồi chuyển sang lượt sau; break kết thúc vòng lặp được nhắm tới. Trong vòng lặp lồng nhau, label cho phép chỉ rõ vòng cần thoát. Dù có nhiều lựa chọn, for vẫn thường dễ đọc nhất khi bạn chỉ cần duyệt một tập hợp hoặc khoảng.",
        "code": "for value in 0..6 {\n    if value % 2 != 0 { continue; }\n    if value == 4 { break; }\n    println!(\"{value}\"); // In 0 rồi 2.\n}"
      }
    ],
    "tip": "Với mỗi while, hãy chỉ ra biến nào thay đổi và vì sao điều kiện cuối cùng sẽ sai.",
    "exercise": {
      "title": "Cộng các chữ số",
      "instructions": "Hoàn thiện digit_sum bằng while. Mỗi lượt lấy chữ số cuối bằng % 10 rồi bỏ nó bằng / 10. Với đầu vào 0, trả 0.",
      "requirements": [
        "2026 có tổng chữ số 10",
        "9009 có tổng 18",
        "Không chuyển số thành String",
        "Vòng lặp phải kết thúc"
      ]
    },
    "starterCode": "fn digit_sum(mut number: u32) -> u32 {\n    todo!(\"Tách từng chữ số bằng phép chia nguyên\")\n}\n\nfn main() {\n    assert_eq!(digit_sum(0), 0);\n    assert_eq!(digit_sum(2026), 10);\n    assert_eq!(digit_sum(9009), 18);\n    println!(\"Tổng chữ số: {}\", digit_sum(2026));\n}",
    "solutionCode": "fn digit_sum(mut number: u32) -> u32 {\n    let mut total = 0;\n    while number > 0 {\n        total += number % 10;\n        number /= 10;\n    }\n    total\n}\n\nfn main() {\n    assert_eq!(digit_sum(0), 0);\n    assert_eq!(digit_sum(2026), 10);\n    assert_eq!(digit_sum(9009), 18);\n    println!(\"Tổng chữ số: {}\", digit_sum(2026));\n}",
    "expectedOutput": "Tổng chữ số: 10\n",
    "hints": [
      "Tạo let mut total = 0 trước while.",
      "Trong mỗi lượt: total += number % 10; number /= 10;"
    ],
    "quiz": {
      "question": "continue làm gì trong vòng lặp?",
      "options": [
        "Thoát toàn bộ hàm",
        "Bỏ phần còn lại của lượt hiện tại",
        "Trả giá trị của loop",
        "Lặp lại đúng lượt hiện tại mãi mãi"
      ],
      "correct": 1,
      "explanation": "continue chuyển điều khiển sang lượt tiếp theo; break mới kết thúc vòng lặp."
    },
    "reference": {
      "label": "Rust By Example · loop",
      "url": "https://doc.rust-lang.org/rust-by-example/flow_control/loop.html"
    }
  },
  {
    "id": "expressions-scope",
    "moduleId": "flow",
    "title": "Biểu thức khối & Phạm vi biến",
    "description": "Tạo giá trị từ if và khối lệnh, đồng thời giới hạn biến tạm.",
    "duration": 25,
    "objectives": [
      "Dùng khối lệnh làm biểu thức",
      "Hiểu giá trị cuối và kiểu ()",
      "Giới hạn biến tạm trong phạm vi cần thiết"
    ],
    "sections": [
      {
        "title": "Khối cũng có thể có giá trị",
        "text": "Một khối { ... } chứa các câu lệnh và có thể kết thúc bằng biểu thức tạo kết quả. Biến khai báo trong khối chỉ dùng được trong phạm vi của nó và các phạm vi con phù hợp. Cách này hữu ích khi phép tính cần nhiều bước nhưng bạn không muốn giữ mọi biến tạm ở bên ngoài.",
        "code": "let total = {\n    let price = 120;\n    let quantity = 3;\n    price * quantity\n};\nassert_eq!(total, 360);"
      },
      {
        "title": "Các nhánh phải thống nhất kiểu",
        "text": "if có thể trả giá trị, nhưng các nhánh cần thống nhất kiểu trong ngữ cảnh đang dùng. Một nhánh trả số và một nhánh trả chuỗi không tạo ra một giá trị có kiểu rõ ràng. Nếu một khối không có biểu thức cuối tạo giá trị khác, kết quả của nó là (), kiểu đơn vị.",
        "code": "let member = true;\nlet fee: u32 = if member { 15_000 } else { 30_000 };\nlet nothing: () = { let temporary = 1; };\nassert_eq!(fee, 15_000);"
      },
      {
        "title": "Phạm vi giúp tránh sửa nhầm trạng thái",
        "text": "Giữ biến tạm gần chỗ dùng làm luồng dữ liệu dễ đọc. Bạn có thể tính giá trị mới bằng if thay vì tạo biến mut rồi gán ở mọi nhánh. Khi một quy tắc xuất hiện nhiều lần, tách thành hàm có tham số rõ ràng sẽ giúp kiểm thử được từng trường hợp.",
        "code": "fn delivery_fee(subtotal: u32, member: bool) -> u32 {\n    let base = if subtotal >= 500_000 { 0 } else { 30_000 };\n    if member { base / 2 } else { base }\n}"
      }
    ],
    "tip": "Hãy tự hỏi khối đang trả giá trị gì. Dấu chấm phẩy cuối khối thường là nguyên nhân khi compiler báo expected số, found ().",
    "exercise": {
      "title": "Phí giao hàng có điều kiện",
      "instructions": "Đơn từ 500000 VND miễn phí; đơn thấp hơn có phí cơ bản 30000 VND. Thành viên trả một nửa phí cơ bản. Viết bằng biểu thức if, không cần biến mut.",
      "requirements": [
        "Đơn 500000 được miễn phí",
        "Thành viên với đơn 100000 trả 15000",
        "Người thường với đơn 100000 trả 30000"
      ]
    },
    "starterCode": "fn delivery_fee(subtotal: u32, member: bool) -> u32 {\n    todo!(\"Tính phí từ hai biểu thức điều kiện\")\n}\n\nfn main() {\n    assert_eq!(delivery_fee(500_000, false), 0);\n    assert_eq!(delivery_fee(500_000, true), 0);\n    assert_eq!(delivery_fee(100_000, false), 30_000);\n    assert_eq!(delivery_fee(100_000, true), 15_000);\n    println!(\"Phí thành viên: {} VND\", delivery_fee(100_000, true));\n}",
    "solutionCode": "fn delivery_fee(subtotal: u32, member: bool) -> u32 {\n    let base = if subtotal >= 500_000 { 0 } else { 30_000 };\n    if member { base / 2 } else { base }\n}\n\nfn main() {\n    assert_eq!(delivery_fee(500_000, false), 0);\n    assert_eq!(delivery_fee(500_000, true), 0);\n    assert_eq!(delivery_fee(100_000, false), 30_000);\n    assert_eq!(delivery_fee(100_000, true), 15_000);\n    println!(\"Phí thành viên: {} VND\", delivery_fee(100_000, true));\n}",
    "expectedOutput": "Phí thành viên: 15000 VND\n",
    "hints": [
      "Tính base trước dựa vào subtotal.",
      "Biểu thức cuối là if member { base / 2 } else { base }."
    ],
    "quiz": {
      "question": "Khối { let x = 2; x * 3 } có giá trị nào?",
      "options": [
        "()",
        "2",
        "3",
        "6"
      ],
      "correct": 3,
      "explanation": "x * 3 là biểu thức cuối không có dấu chấm phẩy, nên khối trả 6."
    },
    "reference": {
      "label": "Rust Reference · Block expressions",
      "url": "https://doc.rust-lang.org/reference/expressions/block-expr.html"
    }
  },
  {
    "id": "hashsets",
    "moduleId": "collections",
    "title": "HashSet & Dữ liệu không trùng",
    "description": "Loại phần tử lặp và thực hiện các phép toán tập hợp.",
    "duration": 25,
    "objectives": [
      "Dùng insert, contains và len",
      "Hiểu yêu cầu Eq và Hash",
      "Sắp xếp khi cần đầu ra có thứ tự"
    ],
    "sections": [
      {
        "title": "Lưu sự có mặt thay vì đếm số lần",
        "text": "HashSet<T> lưu các giá trị duy nhất, phù hợp khi bạn chỉ quan tâm một phần tử đã có hay chưa. insert trả true nếu phần tử được thêm mới và false nếu nó đã tồn tại. Với kiểu tự định nghĩa, Eq và Hash phải nhất quán: hai giá trị bằng nhau phải có hash bằng nhau.",
        "code": "use std::collections::HashSet;\n\nlet mut topics = HashSet::new();\nassert!(topics.insert(\"ownership\"));\nassert!(!topics.insert(\"ownership\"));\nassert!(topics.contains(\"ownership\"));"
      },
      {
        "title": "Giao, hợp và phần khác nhau",
        "text": "intersection cho các phần tử có ở cả hai tập; union cho các phần tử có ở ít nhất một tập; difference lấy phần có ở tập bên trái nhưng không có ở bên phải. Những phép này cho iterator qua phần tử, nên bạn có thể đếm, thu kết quả hoặc dùng tiếp trong một pipeline.",
        "code": "let a = HashSet::from([1, 2, 3]);\nlet b = HashSet::from([2, 3, 4]);\nassert_eq!(a.intersection(&b).count(), 2);\nassert_eq!(a.union(&b).count(), 4);\nassert_eq!(a.difference(&b).count(), 1);"
      },
      {
        "title": "Duy nhất không có nghĩa là được sắp xếp",
        "text": "HashSet không bảo đảm thứ tự duyệt. Để tạo báo cáo hoặc bài kiểm tra có output ổn định, thu kết quả vào Vec rồi sort, hoặc chọn BTreeSet nếu cần cấu trúc tập hợp có thứ tự. Đừng ghi cứng kỳ vọng về thứ tự debug của HashSet.\n\nTrong bài tập, bạn có thể dùng for và insert để tạo tập hợp, rồi dùng một vòng for khác để đưa các giá trị vào Vec. Cách viết ngắn bằng iter/collect sẽ được học ở chương Closure & Iterator.",
        "code": "let unique = HashSet::from([3, 1, 3, 2]);\nlet mut ordered: Vec<_> = unique.into_iter().collect();\nordered.sort_unstable();\nassert_eq!(ordered, vec![1, 2, 3]);"
      }
    ],
    "tip": "Dùng HashMap nếu bạn cần số lần xuất hiện hoặc giá trị đi kèm khóa; dùng HashSet khi chỉ cần sự có mặt.",
    "exercise": {
      "title": "Danh sách duy nhất và tăng dần",
      "instructions": "Viết unique_sorted loại số trùng bằng HashSet rồi trả Vec tăng dần. Dữ liệu đầu vào không được thay đổi.",
      "requirements": [
        "Dùng HashSet để loại trùng",
        "Sắp xếp Vec kết quả",
        "Slice rỗng cho Vec rỗng",
        "[3, 1, 3, 5, 2, 1] cho [1, 2, 3, 5]"
      ]
    },
    "starterCode": "use std::collections::HashSet;\n\nfn unique_sorted(values: &[i32]) -> Vec<i32> {\n    todo!(\"Loại trùng rồi sắp xếp\")\n}\n\nfn main() {\n    assert!(unique_sorted(&[]).is_empty());\n    assert_eq!(unique_sorted(&[2, 2, 2]), vec![2]);\n    let result = unique_sorted(&[3, 1, 3, 5, 2, 1]);\n    assert_eq!(result, vec![1, 2, 3, 5]);\n    println!(\"Duy nhất: {result:?}\");\n}",
    "solutionCode": "use std::collections::HashSet;\n\nfn unique_sorted(values: &[i32]) -> Vec<i32> {\n    let mut unique = HashSet::new();\n    for &value in values {\n        unique.insert(value);\n    }\n    let mut result = Vec::new();\n    for value in unique {\n        result.push(value);\n    }\n    result.sort_unstable();\n    result\n}\n\nfn main() {\n    assert!(unique_sorted(&[]).is_empty());\n    assert_eq!(unique_sorted(&[2, 2, 2]), vec![2]);\n    let result = unique_sorted(&[3, 1, 3, 5, 2, 1]);\n    assert_eq!(result, vec![1, 2, 3, 5]);\n    println!(\"Duy nhất: {result:?}\");\n}",
    "expectedOutput": "Duy nhất: [1, 2, 3, 5]\n",
    "hints": [
      "Tạo HashSet::new(), duyệt for &value in values rồi gọi unique.insert(value).",
      "Duyệt set để push các giá trị vào Vec rồi gọi sort_unstable(); không phụ thuộc thứ tự hash."
    ],
    "quiz": {
      "question": "Vì sao cần sort trước khi in Vec lấy từ HashSet trong bài này?",
      "options": [
        "Vì HashSet không chứa được số âm",
        "Vì thứ tự duyệt HashSet không được bảo đảm",
        "Vì collect tự thêm số trùng",
        "Vì Rust chỉ in được Vec đã sắp xếp"
      ],
      "correct": 1,
      "explanation": "Việc loại trùng và việc sắp thứ tự là hai yêu cầu khác nhau. HashSet xử lý yêu cầu đầu; sort xử lý yêu cầu sau."
    },
    "reference": {
      "label": "Rust standard library · HashSet",
      "url": "https://doc.rust-lang.org/std/collections/struct.HashSet.html"
    }
  },
  {
    "id": "option",
    "moduleId": "errors",
    "title": "Option: Biến đổi giá trị có thể vắng",
    "description": "Dùng map, and_then, filter và giá trị mặc định thay vì unwrap tùy tiện.",
    "duration": 25,
    "objectives": [
      "Biến đổi Some với map",
      "Nối các phép có thể vắng bằng and_then",
      "Chọn Option hay Result theo thông tin lỗi cần giữ"
    ],
    "sections": [
      {
        "title": "Biến đổi mà vẫn giữ trạng thái vắng",
        "text": "Option<T> cho biết một giá trị có thể không tồn tại. map chỉ gọi closure khi có Some và giữ None khi vắng. Vì vậy, bạn có thể đổi kiểu dữ liệu bên trong mà không phải viết một match lặp lại ở mỗi bước.\n\nCú pháp |value| biểu_thức là một closure: hàm ngắn nhận value và trả kết quả biểu thức. Ví dụ |n| n + 1 cộng một vào n. Bài này dùng dạng ngắn này trong map; chương Closure & Iterator sẽ đi sâu hơn.",
        "code": "let length = Some(\"Rust\").map(|text| text.len());\nassert_eq!(length, Some(4));\nassert_eq!(None::<&str>.map(|text| text.len()), None);"
      },
      {
        "title": "Một bước cũng có thể trả None",
        "text": "Nếu closure đã trả Option, dùng and_then để nối kết quả mà không tạo Option<Option<T>>. filter giữ Some khi điều kiện đúng và đổi thành None khi sai. unwrap_or cung cấp giá trị mặc định; unwrap_or_else chỉ chạy closure tạo mặc định khi cần.\n\nparse::<u32>() trả Result: Ok(số) khi đọc được số, Err(lỗi) khi không đọc được. Gọi .ok() đổi Ok thành Some và Err thành None, đồng thời bỏ thông tin lỗi; chỉ dùng khi bạn thực sự không cần biết lý do thất bại.",
        "code": "let quantity = Some(\"12\")\n    .and_then(|text| text.parse::<u32>().ok())\n    .filter(|value| *value > 0);\nassert_eq!(quantity.unwrap_or(1), 12);"
      },
      {
        "title": "Đừng bỏ lý do lỗi khi ứng dụng cần nó",
        "text": "Result::ok chuyển Ok thành Some và Err thành None, đồng thời bỏ thông tin lỗi. Điều đó phù hợp nếu câu hỏi chỉ là có một giá trị hợp lệ hay không. Nếu cần báo người dùng sai định dạng, số âm hay vượt giới hạn, hãy giữ Result hoặc xây dựng kiểu lỗi rõ ràng thay vì gom mọi lỗi thành None.\n\nfilter kiểm tra bằng tham chiếu tới giá trị đang chứa; vì vậy |value| *value >= 18 dùng * để đọc số phía sau tham chiếu. Nếu điều kiện đúng, Option ban đầu được giữ; nếu sai, kết quả là None.",
        "code": "let missing_reason: Option<u32> = \"abc\".parse().ok();\nassert_eq!(missing_reason, None);\n\nlet with_reason = \"abc\".parse::<u32>();\nassert!(with_reason.is_err());"
      }
    ],
    "tip": "Dùng as_ref hoặc as_deref khi muốn xử lý Option chứa dữ liệu sở hữu mà chưa muốn lấy mất dữ liệu đó.",
    "exercise": {
      "title": "Số lượng dương nếu hợp lệ",
      "instructions": "Viết positive_quantity: bỏ khoảng trắng hai đầu, parse u32, chỉ giữ số lớn hơn 0. Bài này chủ ý trả None cho mọi trường hợp không hợp lệ vì chỉ cần kiểm tra sự có mặt.",
      "requirements": [
        "\" 12 \" trả Some(12)",
        "\"0\", \"-1\" và \"abc\" trả None",
        "Dùng filter hoặc xử lý Option tương đương"
      ]
    },
    "starterCode": "fn positive_quantity(text: &str) -> Option<u32> {\n    todo!(\"Đọc một số dương nếu có\")\n}\n\nfn main() {\n    assert_eq!(positive_quantity(\" 12 \"), Some(12));\n    assert_eq!(positive_quantity(\"0\"), None);\n    assert_eq!(positive_quantity(\"-1\"), None);\n    assert_eq!(positive_quantity(\"abc\"), None);\n    let quantity = positive_quantity(\"12\").expect(\"Dữ liệu thử hợp lệ\");\n    println!(\"Số lượng: {quantity}\");\n}",
    "solutionCode": "fn positive_quantity(text: &str) -> Option<u32> {\n    text.trim().parse::<u32>().ok().filter(|value| *value > 0)\n}\n\nfn main() {\n    assert_eq!(positive_quantity(\" 12 \"), Some(12));\n    assert_eq!(positive_quantity(\"0\"), None);\n    assert_eq!(positive_quantity(\"-1\"), None);\n    assert_eq!(positive_quantity(\"abc\"), None);\n    let quantity = positive_quantity(\"12\").expect(\"Dữ liệu thử hợp lệ\");\n    println!(\"Số lượng: {quantity}\");\n}",
    "expectedOutput": "Số lượng: 12\n",
    "hints": [
      "Dùng trim().parse::<u32>().ok() để có Option<u32>.",
      "Nối .filter(|value| *value > 0) để loại số 0."
    ],
    "quiz": {
      "question": "Khi closure trả Option<U>, phương thức nào tránh tạo Option<Option<U>>?",
      "options": [
        "map",
        "and_then",
        "unwrap",
        "is_none"
      ],
      "correct": 1,
      "explanation": "and_then nối trực tiếp kết quả Option của closure, thay vì bọc nó thêm một lớp Some như map."
    },
    "reference": {
      "label": "Rust standard library · Option",
      "url": "https://doc.rust-lang.org/std/option/enum.Option.html"
    }
  },
  {
    "id": "question-mark",
    "moduleId": "errors",
    "title": "Toán tử ? & Luồng truyền lỗi",
    "description": "Thoát sớm khi một bước thất bại và giữ phần xử lý thành công dễ đọc.",
    "duration": 25,
    "objectives": [
      "Truyền Err bằng ?",
      "Đổi lỗi với map_err",
      "Chuyển Option thành Result bằng ok_or"
    ],
    "sections": [
      {
        "title": "Một cách viết gọn cho nhánh trả sớm",
        "text": "Trong hàm trả Result, ? lấy giá trị của Ok để tiếp tục. Nếu gặp Err, nó trả lỗi về bên gọi với cơ chế chuyển kiểu lỗi phù hợp. ? không bỏ qua lỗi và không tự thử lại; nó giúp đường thành công không bị lồng nhiều match.",
        "code": "fn read_u32(text: &str) -> Result<u32, std::num::ParseIntError> {\n    let value = text.trim().parse::<u32>()?;\n    Ok(value)\n}"
      },
      {
        "title": "Bổ sung ngữ cảnh ở chỗ hiểu ý nghĩa",
        "text": "Một lỗi parse giống nhau có thể đến từ chiều rộng hoặc chiều cao. map_err đổi lỗi kỹ thuật thành thông báo có ngữ cảnh trước khi ?. Trong ứng dụng lớn, enum lỗi thường tốt hơn chuỗi; ở bài này dùng &'static str để tập trung vào luồng truyền lỗi.",
        "code": "fn width(text: &str) -> Result<u32, &'static str> {\n    text.trim().parse::<u32>().map_err(|_| \"Chiều rộng không hợp lệ\")\n}"
      },
      {
        "title": "Option và Result có mục đích khác nhau",
        "text": "checked_mul trả Option vì phép nhân có thể tràn. Để dùng trong hàm trả Result, chuyển None thành một lỗi bằng ok_or. Bạn không thể tùy ý dùng ? trên Option bên trong hàm trả Result mà không xác định cách biến sự vắng mặt thành lỗi.",
        "code": "fn multiply(a: u32, b: u32) -> Result<u32, &'static str> {\n    let area = a.checked_mul(b).ok_or(\"Diện tích vượt giới hạn\")?;\n    Ok(area)\n}"
      }
    ],
    "tip": "Mỗi dấu ? là một đường thoát sớm. Kiểm tra rằng thông tin lỗi còn đủ để bên gọi biết bước nào thất bại.",
    "exercise": {
      "title": "Đọc và tính diện tích an toàn",
      "instructions": "Viết area_from_text: parse hai u32, báo lỗi riêng cho từng chiều, và dùng checked_mul để phát hiện tràn. Kết nối các bước bằng ?.",
      "requirements": [
        "Đọc được khoảng trắng hai đầu",
        "Lỗi chiều rộng và chiều cao có thông báo riêng",
        "Tràn phép nhân trả Err",
        "6 × 7 trả Ok(42)"
      ]
    },
    "starterCode": "fn area_from_text(width: &str, height: &str) -> Result<u32, &'static str> {\n    todo!(\"Parse từng chiều rồi nhân có kiểm tra\")\n}\n\nfn main() {\n    assert_eq!(area_from_text(\" 6 \", \"7\"), Ok(42));\n    assert_eq!(area_from_text(\"x\", \"7\"), Err(\"Chiều rộng không hợp lệ\"));\n    assert_eq!(area_from_text(\"6\", \"x\"), Err(\"Chiều cao không hợp lệ\"));\n    assert_eq!(area_from_text(\"4294967295\", \"2\"), Err(\"Diện tích vượt giới hạn\"));\n    println!(\"Diện tích: {}\", area_from_text(\"6\", \"7\").unwrap());\n}",
    "solutionCode": "fn area_from_text(width: &str, height: &str) -> Result<u32, &'static str> {\n    let width = width.trim().parse::<u32>().map_err(|_| \"Chiều rộng không hợp lệ\")?;\n    let height = height.trim().parse::<u32>().map_err(|_| \"Chiều cao không hợp lệ\")?;\n    let area = width.checked_mul(height).ok_or(\"Diện tích vượt giới hạn\")?;\n    Ok(area)\n}\n\nfn main() {\n    assert_eq!(area_from_text(\" 6 \", \"7\"), Ok(42));\n    assert_eq!(area_from_text(\"x\", \"7\"), Err(\"Chiều rộng không hợp lệ\"));\n    assert_eq!(area_from_text(\"6\", \"x\"), Err(\"Chiều cao không hợp lệ\"));\n    assert_eq!(area_from_text(\"4294967295\", \"2\"), Err(\"Diện tích vượt giới hạn\"));\n    println!(\"Diện tích: {}\", area_from_text(\"6\", \"7\").unwrap());\n}",
    "expectedOutput": "Diện tích: 42\n",
    "hints": [
      "Parse với .map_err(|_| \"thông báo\")? để đổi và truyền lỗi.",
      "width.checked_mul(height).ok_or(\"Diện tích vượt giới hạn\") chuyển kết quả phép nhân thành Result."
    ],
    "quiz": {
      "question": "Trong hàm trả Result, dùng ok_or trước ? trên một Option để làm gì?",
      "options": [
        "Tăng tốc vòng lặp",
        "Quy định Err cần trả khi Option là None",
        "Bỏ qua None",
        "Biến mọi kết quả thành Ok"
      ],
      "correct": 1,
      "explanation": "ok_or chuyển Some thành Ok và None thành Err đã chỉ định, phù hợp kiểu trả về Result của hàm."
    },
    "reference": {
      "label": "The Rust Book · Propagating Errors",
      "url": "https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html#propagating-errors"
    }
  },
  {
    "id": "custom-errors",
    "moduleId": "errors",
    "title": "Thiết kế kiểu lỗi riêng",
    "description": "Phân biệt các nguyên nhân bằng enum và trình bày lỗi bằng Display.",
    "duration": 35,
    "objectives": [
      "Tạo enum mô tả nguyên nhân lỗi",
      "Triển khai Display và std::error::Error",
      "Kiểm tra loại lỗi mà không so chuỗi hiển thị"
    ],
    "sections": [
      {
        "title": "Lỗi là một phần của giao diện",
        "text": "Một enum lỗi giúp bên gọi phân biệt nguyên nhân bằng match thay vì dò nội dung chuỗi. Dữ liệu bên trong biến thể có thể giữ chi tiết như giới hạn và giá trị thực tế. Điều này cho phép thay cách viết thông báo mà vẫn giữ các nhánh xử lý đúng.",
        "code": "#[derive(Debug, PartialEq, Eq)]\nenum NameError {\n    Empty,\n    TooShort { min: usize, actual: usize },\n}"
      },
      {
        "title": "Debug cho lập trình viên, Display cho lời nhắn",
        "text": "Debug thường có thể derive; Display cần cách trình bày mà bạn chủ động viết. std::error::Error yêu cầu cả Debug và Display. Với lỗi không bọc một lỗi gốc khác, bạn có thể dùng triển khai Error rỗng; khi có nguyên nhân nguồn, phương thức source giúp giữ chuỗi nguyên nhân.",
        "code": "impl std::fmt::Display for NameError {\n    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {\n        match self {\n            Self::Empty => write!(f, \"Tên đang trống\"),\n            Self::TooShort { min, actual } => write!(f, \"Cần {min} ký tự, hiện có {actual}\"),\n        }\n    }\n}\nimpl std::error::Error for NameError {}"
      },
      {
        "title": "Kiểm thử hành vi riêng với cách hiển thị",
        "text": "So enum bằng assert_eq để xác nhận đúng nguyên nhân; kiểm tra to_string riêng nếu thông báo cũng thuộc yêu cầu. Bài này đếm Unicode scalar bằng chars, không tuyên bố đếm grapheme hiển thị. Chọn đơn vị độ dài rõ ràng sẽ làm quy tắc kiểm tra tên không mơ hồ.",
        "code": "assert_eq!(NameError::Empty.to_string(), \"Tên đang trống\");\nlet error = NameError::TooShort { min: 3, actual: 2 };\nassert!(matches!(error, NameError::TooShort { actual: 2, .. }));"
      }
    ],
    "tip": "Đừng để giao diện phải phân tích chuỗi lỗi để biết cần sửa trường nào; enum và dữ liệu có cấu trúc phù hợp hơn.",
    "exercise": {
      "title": "Kiểm tra tên bằng lỗi có cấu trúc",
      "instructions": "Hoàn thiện validate_name. Trim hai đầu; tên trống trả Empty; dưới 3 Unicode scalar trả TooShort; còn lại trả tham chiếu đến tên đã trim.",
      "requirements": [
        "Không cấp phát String mới cho tên hợp lệ",
        "Giữ thông tin min và actual trong lỗi",
        "Dùng chars().count(), không dùng len() byte",
        "Giữ các assertions về enum lỗi"
      ]
    },
    "starterCode": "#[derive(Debug, PartialEq, Eq)]\nenum NameError { Empty, TooShort { min: usize, actual: usize } }\n\nimpl std::fmt::Display for NameError {\n    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {\n        match self {\n            Self::Empty => write!(f, \"Tên đang trống\"),\n            Self::TooShort { min, actual } => write!(f, \"Cần {min} ký tự, hiện có {actual}\"),\n        }\n    }\n}\nimpl std::error::Error for NameError {}\n\nfn validate_name(input: &str) -> Result<&str, NameError> {\n    todo!(\"Trim rồi kiểm tra tên\")\n}\n\nfn main() {\n    assert_eq!(validate_name(\"   \"), Err(NameError::Empty));\n    assert_eq!(validate_name(\"An\"), Err(NameError::TooShort { min: 3, actual: 2 }));\n    assert_eq!(validate_name(\"  Minh  \"), Ok(\"Minh\"));\n    assert_eq!(NameError::Empty.to_string(), \"Tên đang trống\");\n    println!(\"Tên hợp lệ: {}\", validate_name(\" Minh \").unwrap());\n}",
    "solutionCode": "#[derive(Debug, PartialEq, Eq)]\nenum NameError { Empty, TooShort { min: usize, actual: usize } }\n\nimpl std::fmt::Display for NameError {\n    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {\n        match self {\n            Self::Empty => write!(f, \"Tên đang trống\"),\n            Self::TooShort { min, actual } => write!(f, \"Cần {min} ký tự, hiện có {actual}\"),\n        }\n    }\n}\nimpl std::error::Error for NameError {}\n\nfn validate_name(input: &str) -> Result<&str, NameError> {\n    let name = input.trim();\n    let actual = name.chars().count();\n    if actual == 0 { return Err(NameError::Empty); }\n    if actual < 3 { return Err(NameError::TooShort { min: 3, actual }); }\n    Ok(name)\n}\n\nfn main() {\n    assert_eq!(validate_name(\"   \"), Err(NameError::Empty));\n    assert_eq!(validate_name(\"An\"), Err(NameError::TooShort { min: 3, actual: 2 }));\n    assert_eq!(validate_name(\"  Minh  \"), Ok(\"Minh\"));\n    assert_eq!(NameError::Empty.to_string(), \"Tên đang trống\");\n    println!(\"Tên hợp lệ: {}\", validate_name(\" Minh \").unwrap());\n}",
    "expectedOutput": "Tên hợp lệ: Minh\n",
    "hints": [
      "Lưu input.trim() vào name và đếm name.chars().count().",
      "Trả sớm Err theo hai điều kiện; kết thúc bằng Ok(name)."
    ],
    "quiz": {
      "question": "Vì sao enum lỗi thường dễ xử lý hơn một String lỗi chung?",
      "options": [
        "Enum bỏ qua mọi lỗi",
        "Bên gọi có thể match nguyên nhân và đọc dữ liệu có cấu trúc",
        "Enum luôn nhanh hơn mọi kiểu",
        "Display không dùng được với String"
      ],
      "correct": 1,
      "explanation": "Enum làm các trường hợp lỗi trở thành một phần rõ ràng của giao diện, không phụ thuộc câu chữ thông báo."
    },
    "reference": {
      "label": "Rust standard library · Error",
      "url": "https://doc.rust-lang.org/std/error/trait.Error.html"
    }
  },
  {
    "id": "visibility",
    "moduleId": "modules",
    "title": "Visibility & Ranh giới API",
    "description": "Mở đúng phần cần dùng và giữ chi tiết triển khai ở bên trong.",
    "duration": 30,
    "objectives": [
      "Phân biệt private, pub và pub(crate)",
      "Giữ trường struct riêng tư",
      "Cung cấp phương thức thay cho sửa trường tùy ý"
    ],
    "sections": [
      {
        "title": "Public cần một đường dẫn truy cập hợp lệ",
        "text": "Các mục không khai báo visibility là private theo quy tắc phạm vi module. pub mở một mục, nhưng việc truy cập từ bên ngoài vẫn cần một đường dẫn có thể truy cập hoặc re-export phù hợp. Một hàm public nằm sâu trong module private không tự biến toàn bộ cây module thành public.",
        "code": "mod implementation {\n    pub fn greeting() -> &'static str { \"Xin chào\" }\n}\n\npub use implementation::greeting;"
      },
      {
        "title": "Struct public không tự mở mọi trường",
        "text": "Bạn có thể cho bên ngoài tạo và đọc đối tượng qua phương thức nhưng giữ trường dữ liệu private. Nhờ vậy, quy tắc cập nhật nằm ở một nơi thay vì phân tán trong mã gọi. Một hàm khởi tạo và các phương thức nhỏ thường tạo giao diện dễ kiểm thử hơn việc mở toàn bộ trường.",
        "code": "pub struct Counter { value: u32 }\n\nimpl Counter {\n    pub fn new() -> Self { Self { value: 0 } }\n    pub fn value(&self) -> u32 { self.value }\n}"
      },
      {
        "title": "Mở trong phạm vi cần thiết",
        "text": "pub(crate) cho phép dùng trong crate hiện tại; pub(super) giới hạn đến module cha; pub(in path) giới hạn theo một module tổ tiên hợp lệ. Những lựa chọn này giúp các phần bên trong hợp tác mà không biến chúng thành giao diện công khai cho người dùng thư viện.",
        "code": "mod counter {\n    pub struct Counter { value: u32 }\n    impl Counter {\n        pub fn new() -> Self { Self { value: 0 } }\n        pub(crate) fn increment(&mut self) { self.value += 1; }\n        pub fn value(&self) -> u32 { self.value }\n    }\n}"
      }
    ],
    "tip": "Bắt đầu với phạm vi nhỏ; mở rộng visibility khi có một nơi gọi cụ thể cần nó.",
    "exercise": {
      "title": "Bộ đếm có giao diện rõ ràng",
      "instructions": "Hoàn thiện increment bên trong module counter. Giữ trường value private và cập nhật nó qua phương thức pub(crate); main chỉ đọc qua value().",
      "requirements": [
        "Không thêm pub cho trường value",
        "Mỗi lần increment tăng đúng 1",
        "Giữ API new, increment và value"
      ]
    },
    "starterCode": "mod counter {\n    pub struct Counter { value: u32 }\n    impl Counter {\n        pub fn new() -> Self { Self { value: 0 } }\n        pub(crate) fn increment(&mut self) {\n            todo!(\"Cập nhật trạng thái bên trong\");\n        }\n        pub fn value(&self) -> u32 { self.value }\n    }\n}\n\nfn main() {\n    let mut counter = counter::Counter::new();\n    assert_eq!(counter.value(), 0);\n    counter.increment();\n    assert_eq!(counter.value(), 1);\n    counter.increment();\n    assert_eq!(counter.value(), 2);\n    println!(\"Bộ đếm: {}\", counter.value());\n}",
    "solutionCode": "mod counter {\n    pub struct Counter { value: u32 }\n    impl Counter {\n        pub fn new() -> Self { Self { value: 0 } }\n        pub(crate) fn increment(&mut self) { self.value += 1; }\n        pub fn value(&self) -> u32 { self.value }\n    }\n}\n\nfn main() {\n    let mut counter = counter::Counter::new();\n    assert_eq!(counter.value(), 0);\n    counter.increment();\n    assert_eq!(counter.value(), 1);\n    counter.increment();\n    assert_eq!(counter.value(), 2);\n    println!(\"Bộ đếm: {}\", counter.value());\n}",
    "expectedOutput": "Bộ đếm: 2\n",
    "hints": [
      "Phương thức nằm trong impl nên truy cập được trường private.",
      "Phần thân cần self.value += 1;."
    ],
    "quiz": {
      "question": "pub(crate) giới hạn truy cập trong phạm vi nào?",
      "options": [
        "Chỉ đúng một hàm",
        "Crate hiện tại",
        "Mọi crate trên crates.io",
        "Chỉ tệp Cargo.toml"
      ],
      "correct": 1,
      "explanation": "pub(crate) mở mục cho các phần trong crate hiện tại nhưng không tạo API public cho crate bên ngoài."
    },
    "reference": {
      "label": "Rust Reference · Visibility and privacy",
      "url": "https://doc.rust-lang.org/reference/visibility-and-privacy.html"
    }
  },
  {
    "id": "crates-dependencies",
    "moduleId": "modules",
    "title": "Crate, package & Dependency",
    "description": "Hiểu đơn vị biên dịch, khai báo thư viện và sử dụng API qua đường dẫn.",
    "duration": 30,
    "objectives": [
      "Phân biệt module, crate và package",
      "Khai báo một dependency cục bộ",
      "Giữ ranh giới giữa mã thư viện và mã gọi"
    ],
    "sections": [
      {
        "title": "Ba mức tổ chức khác nhau",
        "text": "Module là không gian tên bên trong một crate; crate là một đơn vị biên dịch; package được Cargo quản lý qua Cargo.toml và có thể chứa các target. src/lib.rs thường là root của library target, còn src/main.rs là root của binary target mặc định. Hai tệp này là hai crate, không phải hai module tự động chung một phạm vi.",
        "code": "# Tạo hai package trên máy\ncargo new learn_math --lib\ncargo new math_app --bin\n\n# learn_math/src/lib.rs\n# pub fn double(value: i32) -> i32 { value * 2 }"
      },
      {
        "title": "Khai báo trước, dùng API sau",
        "text": "Dependency phải được khai báo trong manifest của package sử dụng nó. Dependency path trỏ đến một package cục bộ; dependency registry có thể dùng version requirement. use chỉ đưa tên vào phạm vi, không tải hoặc cài thư viện. Đọc API và những feature cần bật trước khi thêm một crate mới.",
        "code": "# math_app/Cargo.toml\n[dependencies]\nlearn_math = { path = \"../learn_math\" }\n\n# math_app/src/main.rs sẽ dùng:\n# let value = learn_math::double(21);"
      },
      {
        "title": "Bài web giữ một tệp và không thêm dependency",
        "text": "Website này chạy một chương trình một tệp, không cho chỉnh manifest của môi trường biên dịch. Bài tập dùng module learn_math để luyện cách gọi API qua đường dẫn; đó không phải một dependency crate thực sự. Khi chuyển bài sang máy, bạn có thể tách module thành src/lib.rs của package thư viện và khai báo path như ví dụ.",
        "code": "mod learn_math {\n    pub fn double(value: i32) -> i32 { value * 2 }\n}\n\nuse learn_math::double;\nassert_eq!(double(21), 42);"
      }
    ],
    "tip": "Không phải mọi thư viện đều cần được thêm ngay. Hãy xác định chức năng còn thiếu và đọc phần feature của crate trước.",
    "exercise": {
      "title": "Dùng một API giới hạn giá trị",
      "instructions": "Trong bài một tệp trên web, hoàn thiện learn_math::clamp_score để giới hạn điểm vào 0–10. Module này mô phỏng ranh giới thư viện; bài không tải crate và không chạy Cargo.",
      "requirements": [
        "Điểm âm trở thành 0",
        "Điểm trên 10 trở thành 10",
        "Điểm hợp lệ giữ nguyên",
        "Giữ use learn_math::clamp_score ở mã gọi"
      ]
    },
    "starterCode": "mod learn_math {\n    pub fn clamp_score(value: i32) -> i32 {\n        todo!(\"Giới hạn value trong 0 đến 10\")\n    }\n}\n\nuse learn_math::clamp_score;\n\nfn main() {\n    assert_eq!(clamp_score(-3), 0);\n    assert_eq!(clamp_score(7), 7);\n    assert_eq!(clamp_score(15), 10);\n    println!(\"Điểm hợp lệ: {}\", clamp_score(15));\n}",
    "solutionCode": "mod learn_math {\n    pub fn clamp_score(value: i32) -> i32 { value.clamp(0, 10) }\n}\n\nuse learn_math::clamp_score;\n\nfn main() {\n    assert_eq!(clamp_score(-3), 0);\n    assert_eq!(clamp_score(7), 7);\n    assert_eq!(clamp_score(15), 10);\n    println!(\"Điểm hợp lệ: {}\", clamp_score(15));\n}",
    "expectedOutput": "Điểm hợp lệ: 10\n",
    "hints": [
      "Có thể dùng if/else hoặc phương thức clamp trên i32.",
      "value.clamp(0, 10) giữ giá trị trong khoảng đã cho."
    ],
    "quiz": {
      "question": "Câu lệnh use tự tải một crate từ crates.io không?",
      "options": [
        "Có, nếu tên đúng",
        "Không; dependency được khai báo và resolve bởi Cargo",
        "Chỉ khi dùng edition 2024",
        "Chỉ trên Linux"
      ],
      "correct": 1,
      "explanation": "use chỉ đưa một tên/đường dẫn vào phạm vi mã. Cargo quản lý dependency dựa trên manifest."
    },
    "reference": {
      "label": "The Cargo Book · Specifying Dependencies",
      "url": "https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html"
    }
  },
  {
    "id": "workspaces",
    "moduleId": "modules",
    "title": "Cargo Workspace: Nhiều package cùng làm việc",
    "description": "Tách lõi và ứng dụng trong một workspace có ranh giới rõ ràng.",
    "duration": 35,
    "objectives": [
      "Định nghĩa virtual workspace với members",
      "Chạy lệnh cho cả workspace hoặc một package",
      "Chia sẻ dependency mà không đồng nhất mọi package"
    ],
    "sections": [
      {
        "title": "Gom các package liên quan",
        "text": "Workspace quản lý nhiều package như một nhóm. Các thành viên chia sẻ Cargo.lock và thư mục output mặc định ở root, đồng thời vẫn có manifest riêng. Virtual workspace có [workspace] nhưng không có [package] ở root; ghi resolver tường minh vì không có package.edition để suy ra nó.",
        "code": "# Cargo.toml ở thư mục gốc, trước khi tạo thành viên\n[workspace]\nresolver = \"3\"\n\n# Chạy trong terminal tại thư mục gốc:\n# cargo new text_core --lib\n# cargo new text_cli --bin\n\n# Cargo thêm members vào manifest workspace khi tạo các package trên."
      },
      {
        "title": "Chọn đúng phạm vi lệnh",
        "text": "cargo check --workspace và cargo test --workspace xử lý toàn bộ các package thành viên tương ứng. Dùng -p để chọn một package, chẳng hạn chạy binary CLI. Một package phụ thuộc vào package khác vẫn phải khai báo dependency; chỉ cùng nằm trong workspace không làm API tự động xuất hiện.",
        "code": "cargo check --workspace\ncargo test --workspace\ncargo run -p text_cli\n\n# text_cli/Cargo.toml\n# [dependencies]\n# text_core = { path = \"../text_core\" }"
      },
      {
        "title": "Chia sẻ cấu hình có chủ đích",
        "text": "[workspace.dependencies] cho phép đặt khai báo dùng chung ở root; thành viên chọn kế thừa bằng workspace = true. Việc kế thừa không diễn ra chỉ vì tên dependency giống nhau. Bài web dưới đây dùng hai module trong một tệp để luyện cách tách lõi khỏi phần trình bày; nó không tạo workspace thật.",
        "code": "# Root Cargo.toml\n[workspace.dependencies]\ntext_core = { path = \"text_core\" }\n\n# Manifest của text_cli\n[dependencies]\ntext_core.workspace = true"
      }
    ],
    "tip": "Tách package khi có ranh giới tái sử dụng hoặc trách nhiệm rõ ràng; không cần biến mỗi hàm thành một crate.",
    "exercise": {
      "title": "Lõi văn bản và báo cáo",
      "instructions": "Trong chương trình một tệp, hoàn thiện text_core::count_nonempty_lines và report::summarize. Hai module mô phỏng lõi/CLI; các thao tác Cargo workspace được thực hiện riêng trên máy, không phải ở đây.",
      "requirements": [
        "Dòng chỉ có khoảng trắng không được tính",
        "Lõi trả usize, phần report tạo String",
        "Chuỗi rỗng cho 0 dòng",
        "In: 3 dòng nội dung"
      ]
    },
    "starterCode": "mod text_core {\n    pub fn count_nonempty_lines(text: &str) -> usize {\n        todo!(\"Đếm dòng có nội dung\")\n    }\n}\n\nmod report {\n    pub fn summarize(text: &str) -> String {\n        todo!(\"Gọi lõi và tạo lời báo cáo\")\n    }\n}\n\nfn main() {\n    assert_eq!(text_core::count_nonempty_lines(\"\"), 0);\n    assert_eq!(text_core::count_nonempty_lines(\"  \\n\\t\"), 0);\n    let text = \"Học Rust\\n\\n  \\nViết mã\\nThử lại\\n\";\n    assert_eq!(text_core::count_nonempty_lines(text), 3);\n    assert_eq!(report::summarize(text), \"3 dòng nội dung\");\n    println!(\"{}\", report::summarize(text));\n}",
    "solutionCode": "mod text_core {\n    pub fn count_nonempty_lines(text: &str) -> usize {\n        let mut count = 0;\n        for line in text.lines() {\n            if !line.trim().is_empty() { count += 1; }\n        }\n        count\n    }\n}\n\nmod report {\n    pub fn summarize(text: &str) -> String {\n        format!(\"{} dòng nội dung\", crate::text_core::count_nonempty_lines(text))\n    }\n}\n\nfn main() {\n    assert_eq!(text_core::count_nonempty_lines(\"\"), 0);\n    assert_eq!(text_core::count_nonempty_lines(\"  \\n\\t\"), 0);\n    let text = \"Học Rust\\n\\n  \\nViết mã\\nThử lại\\n\";\n    assert_eq!(text_core::count_nonempty_lines(text), 3);\n    assert_eq!(report::summarize(text), \"3 dòng nội dung\");\n    println!(\"{}\", report::summarize(text));\n}",
    "expectedOutput": "3 dòng nội dung\n",
    "hints": [
      "Dùng for line in text.lines(), tăng biến count khi !line.trim().is_empty().",
      "Trong report, gọi crate::text_core::count_nonempty_lines(text) rồi format! kết quả."
    ],
    "quiz": {
      "question": "Hai package cùng thuộc một workspace có tự dùng API của nhau mà không khai báo dependency không?",
      "options": [
        "Có, mọi tên đều chung phạm vi",
        "Không, vẫn cần khai báo dependency thích hợp",
        "Chỉ khi dùng cùng edition",
        "Chỉ khi tên package ngắn"
      ],
      "correct": 1,
      "explanation": "Workspace quản lý nhóm package và cấu hình; nó không xóa ranh giới crate hoặc thay thế khai báo dependency."
    },
    "reference": {
      "label": "The Cargo Book · Workspaces",
      "url": "https://doc.rust-lang.org/cargo/reference/workspaces.html"
    }
  },
  {
    "id": "trait-bounds",
    "moduleId": "generics",
    "title": "Trait bound & Mệnh đề where",
    "description": "Diễn đạt chính xác năng lực mà một thuật toán generic cần.",
    "duration": 30,
    "objectives": [
      "Kết hợp nhiều bound bằng +",
      "Đọc và viết where clause",
      "Không thêm Copy hoặc Clone khi không cần"
    ],
    "sections": [
      {
        "title": "Generic không có mọi phương thức tự động",
        "text": "Một tham số kiểu T bất kỳ chỉ có những thao tác mà chữ ký bảo đảm. Nếu hàm cần so sánh rồi hiển thị, nó phải yêu cầu cả khả năng so sánh và Display. Bound là điều kiện năng lực, không phải một tuyên bố rằng mọi kiểu đều kế thừa một lớp dữ liệu chung.",
        "code": "use std::fmt::Display;\n\nfn print_value<T: Display>(value: &T) {\n    println!(\"{value}\");\n}"
      },
      {
        "title": "where giữ chữ ký dễ đọc",
        "text": "Với nhiều bound, where tách điều kiện kiểu khỏi danh sách tham số. T: Ord + Display yêu cầu T có thứ tự toàn phần và cách định dạng hiển thị. Chọn Ord thay vì PartialOrd cũng là một quyết định: f64 không có Ord do những giá trị đặc biệt như NaN.",
        "code": "fn describe<T>(value: &T) -> String\nwhere\n    T: Ord + Display,\n{\n    format!(\"Giá trị: {value}\")\n}"
      },
      {
        "title": "Mượn để giảm ràng buộc",
        "text": "Nếu hàm chỉ đọc hai giá trị để chọn và hiển thị, nhận &T giúp không cần Copy hay Clone. Bound dư thừa loại bỏ những kiểu vốn có thể dùng được với thuật toán. Hãy đọc từng dòng phần thân và chỉ yêu cầu những năng lực thật sự xuất hiện.",
        "code": "fn larger<'a, T: Ord>(a: &'a T, b: &'a T) -> &'a T {\n    if a >= b { a } else { b }\n}"
      }
    ],
    "tip": "Nếu compiler đề nghị thêm một trait, hãy kiểm tra xem bạn có thể mượn dữ liệu hoặc đổi API để không cần bound đó hay không.",
    "exercise": {
      "title": "Hiển thị giá trị lớn nhất",
      "instructions": "Viết describe_max với T: Ord + Display. Nhận hai tham chiếu, chọn giá trị lớn hơn và tạo chuỗi 'Lớn nhất: ...'. Không thêm Clone hay Copy.",
      "requirements": [
        "Chạy với i32 và String",
        "Không lấy quyền sở hữu hai đầu vào",
        "Dùng where clause đã cho",
        "In: Lớn nhất: 42"
      ]
    },
    "starterCode": "use std::fmt::Display;\n\nfn describe_max<T>(left: &T, right: &T) -> String\nwhere\n    T: Ord + Display,\n{\n    todo!(\"Chọn rồi định dạng giá trị\")\n}\n\nfn main() {\n    assert_eq!(describe_max(&7, &42), \"Lớn nhất: 42\");\n    assert_eq!(describe_max(&5, &5), \"Lớn nhất: 5\");\n    let a = String::from(\"An\");\n    let b = String::from(\"Binh\");\n    assert_eq!(describe_max(&a, &b), \"Lớn nhất: Binh\");\n    assert_eq!(a, \"An\");\n    println!(\"{}\", describe_max(&7, &42));\n}",
    "solutionCode": "use std::fmt::Display;\n\nfn describe_max<T>(left: &T, right: &T) -> String\nwhere\n    T: Ord + Display,\n{\n    let maximum = if left >= right { left } else { right };\n    format!(\"Lớn nhất: {maximum}\")\n}\n\nfn main() {\n    assert_eq!(describe_max(&7, &42), \"Lớn nhất: 42\");\n    assert_eq!(describe_max(&5, &5), \"Lớn nhất: 5\");\n    let a = String::from(\"An\");\n    let b = String::from(\"Binh\");\n    assert_eq!(describe_max(&a, &b), \"Lớn nhất: Binh\");\n    assert_eq!(a, \"An\");\n    println!(\"{}\", describe_max(&7, &42));\n}",
    "expectedOutput": "Lớn nhất: 42\n",
    "hints": [
      "So sánh left >= right rồi giữ một trong hai tham chiếu.",
      "format!(\"Lớn nhất: {maximum}\") sử dụng bound Display."
    ],
    "quiz": {
      "question": "T: Ord + Display yêu cầu điều gì?",
      "options": [
        "T phải là số nguyên",
        "T hỗ trợ cả thứ tự toàn phần và định dạng Display",
        "T tự động được clone",
        "T có thể chọn một trong hai trait"
      ],
      "correct": 1,
      "explanation": "Dấu + nối các yêu cầu cùng phải đúng. Nó không tự thêm Copy, Clone hay giới hạn T chỉ là số."
    },
    "reference": {
      "label": "The Rust Book · Trait Bounds",
      "url": "https://doc.rust-lang.org/book/ch10-02-traits.html#trait-bound-syntax"
    }
  },
  {
    "id": "associated-types",
    "moduleId": "generics",
    "title": "Associated type: Kiểu đi cùng một trait",
    "description": "Đặt kiểu dữ liệu đầu ra trong hợp đồng mà mỗi implementation lựa chọn.",
    "duration": 35,
    "objectives": [
      "Khai báo type Item trong trait",
      "Gán kiểu cụ thể ở impl",
      "Ràng buộc C::Item trong hàm generic"
    ],
    "sections": [
      {
        "title": "Trait có thể mô tả cả tên một kiểu",
        "text": "Associated type là một kiểu được đặt tên trong trait. Mỗi implementation của trait cung cấp kiểu cụ thể tương ứng. Phương thức của trait có thể dùng Self::Item trong chữ ký mà không cần biết trước đó là i32, String hay kiểu ứng dụng khác.",
        "code": "trait Catalog {\n    type Item;\n    fn first(&self) -> Option<&Self::Item>;\n}"
      },
      {
        "title": "Implementation quyết định kiểu của hợp đồng",
        "text": "Một Scores có thể chọn Item = i32 và trả tham chiếu tới điểm đầu tiên. Với trait không có tham số kiểu như Catalog, một kiểu cụ thể chỉ có một implementation của trait đó, nên associated type đi cùng lựa chọn này. Nó khác với trait generic có thể được triển khai cho những đối số kiểu khác nhau khi các quy tắc cho phép.",
        "code": "struct Scores { values: Vec<i32> }\n\nimpl Catalog for Scores {\n    type Item = i32;\n    fn first(&self) -> Option<&Self::Item> {\n        self.values.first()\n    }\n}"
      },
      {
        "title": "Yêu cầu năng lực cho kiểu liên kết",
        "text": "Một hàm dùng Catalog chưa chắc hiển thị được Item. Bound C::Item: Display diễn tả điều kiện cho kiểu liên kết. Bạn cũng gặp dạng Iterator<Item = u32>, nơi dấu bằng yêu cầu kiểu Item chính xác là u32 thay vì chỉ có một năng lực nào đó.",
        "code": "fn describe_first<C>(catalog: &C) -> String\nwhere\n    C: Catalog,\n    C::Item: std::fmt::Display,\n{\n    match catalog.first() {\n        Some(value) => format!(\"Mục đầu: {value}\"),\n        None => String::from(\"Danh mục rỗng\"),\n    }\n}"
      }
    ],
    "tip": "Self là kiểu đang triển khai trait; Self::Item là kiểu mà implementation đó gán cho tên Item.",
    "exercise": {
      "title": "Danh mục điểm có kiểu liên kết",
      "instructions": "Trong implementation Catalog cho Scores, type Item = i32 đã được cung cấp để xác định kiểu phần tử. Hoàn thiện first để trả tham chiếu tới phần tử đầu tiên. Hàm generic describe_first đã xử lý định dạng và danh mục rỗng.",
      "requirements": [
        "Giữ type Item = i32 và giải thích được Self::Item trong chữ ký",
        "Không clone Vec hoặc phần tử",
        "Danh sách rỗng trả None",
        "In: Mục đầu: 8"
      ]
    },
    "starterCode": "trait Catalog {\n    type Item;\n    fn first(&self) -> Option<&Self::Item>;\n}\nstruct Scores { values: Vec<i32> }\n\nimpl Catalog for Scores {\n    type Item = i32;\n    fn first(&self) -> Option<&Self::Item> {\n        todo!(\"Mượn phần tử đầu\")\n    }\n}\n\nfn describe_first<C>(catalog: &C) -> String\nwhere C: Catalog, C::Item: std::fmt::Display,\n{\n    match catalog.first() {\n        Some(value) => format!(\"Mục đầu: {value}\"),\n        None => String::from(\"Danh mục rỗng\"),\n    }\n}\n\nfn main() {\n    let scores = Scores { values: vec![8, 9, 10] };\n    let empty = Scores { values: vec![] };\n    assert_eq!(scores.first(), Some(&8));\n    assert_eq!(empty.first(), None);\n    assert_eq!(describe_first(&empty), \"Danh mục rỗng\");\n    println!(\"{}\", describe_first(&scores));\n}",
    "solutionCode": "trait Catalog {\n    type Item;\n    fn first(&self) -> Option<&Self::Item>;\n}\nstruct Scores { values: Vec<i32> }\n\nimpl Catalog for Scores {\n    type Item = i32;\n    fn first(&self) -> Option<&Self::Item> { self.values.first() }\n}\n\nfn describe_first<C>(catalog: &C) -> String\nwhere C: Catalog, C::Item: std::fmt::Display,\n{\n    match catalog.first() {\n        Some(value) => format!(\"Mục đầu: {value}\"),\n        None => String::from(\"Danh mục rỗng\"),\n    }\n}\n\nfn main() {\n    let scores = Scores { values: vec![8, 9, 10] };\n    let empty = Scores { values: vec![] };\n    assert_eq!(scores.first(), Some(&8));\n    assert_eq!(empty.first(), None);\n    assert_eq!(describe_first(&empty), \"Danh mục rỗng\");\n    println!(\"{}\", describe_first(&scores));\n}",
    "expectedOutput": "Mục đầu: 8\n",
    "hints": [
      "Vec::first() đã trả Option<&i32> phù hợp chữ ký.",
      "Phần thân là self.values.first()."
    ],
    "quiz": {
      "question": "Trong impl Catalog for Scores, type Item = i32 có nghĩa gì?",
      "options": [
        "Mọi trait trong chương trình đều dùng i32",
        "Item của implementation Catalog cho Scores là i32",
        "Scores trở thành alias của i32",
        "Tất cả dữ liệu được chuyển thành i32 lúc chạy"
      ],
      "correct": 1,
      "explanation": "Associated type được xác định trong implementation cụ thể; nó không thay đổi những implementation hoặc trait khác."
    },
    "reference": {
      "label": "The Rust Book · Associated Types",
      "url": "https://doc.rust-lang.org/book/ch20-02-advanced-traits.html#defining-traits-with-associated-types"
    }
  },
  {
    "id": "iterator-ownership",
    "moduleId": "iteration",
    "title": "Ownership qua iter, iter_mut và into_iter",
    "description": "Chọn mượn, sửa hoặc tiêu thụ một tập hợp theo nhu cầu thật.",
    "duration": 30,
    "objectives": [
      "Nhận biết kiểu phần tử của ba cách lặp Vec",
      "Sửa phần tử qua iter_mut",
      "Tiêu thụ Vec để tạo tập hợp mới"
    ],
    "sections": [
      {
        "title": "iter mượn dữ liệu để đọc",
        "text": "Với Vec<T>, iter tạo các phần tử &T. Bạn có thể tính tổng, tìm kiếm hoặc kiểm tra mà Vec vẫn được giữ ở owner. Những phương thức lấy dữ liệu từ tham chiếu vẫn phải tuân theo Copy/Clone và không được tự chuyển quyền sở hữu giá trị phía sau một shared reference.",
        "code": "let names = vec![String::from(\"An\"), String::from(\"Binh\")];\nlet bytes: usize = names.iter().map(|name| name.len()).sum();\nassert_eq!(bytes, 6);\nassert_eq!(names.len(), 2);"
      },
      {
        "title": "iter_mut cho phép sửa từng phần tử",
        "text": "iter_mut trên Vec tạo &mut T cho từng phần tử và cần mượn container theo cách có thể sửa. Khi duyệt, bạn có thể gọi các phương thức chỉnh sửa dữ liệu, chẳng hạn push trên String. Không được đồng thời thay đổi cấu trúc Vec theo cách xung đột với lần mượn iterator đang hoạt động.",
        "code": "let mut names = vec![String::from(\"An\")];\nfor name in names.iter_mut() {\n    name.push('!');\n}\nassert_eq!(names[0], \"An!\");"
      },
      {
        "title": "into_iter phụ thuộc giá trị nhận phương thức",
        "text": "Gọi into_iter trên Vec<T> được sở hữu tiêu thụ Vec và đưa ra T. Nhưng gọi trên &Vec<T> sẽ lặp qua tham chiếu; đừng chỉ nhìn tên phương thức mà bỏ qua receiver. Sau khi tiêu thụ Vec được sở hữu, bạn có thể thu các giá trị mới bằng collect, còn biến Vec cũ không được dùng lại.",
        "code": "let names = vec![String::from(\"An\")];\nlet upper: Vec<String> = names.into_iter()\n    .map(|name| name.to_uppercase())\n    .collect();\nassert_eq!(upper, vec![String::from(\"AN\")]);"
      }
    ],
    "tip": "Hãy viết ra Item của iterator trong đầu: &T, &mut T hay T. Rất nhiều lỗi borrow trở nên dễ hiểu ngay ở bước này.",
    "exercise": {
      "title": "Chuẩn bị lời chào",
      "instructions": "prepare_names nhận quyền sở hữu Vec<String>. Dùng iter_mut thêm ! vào mỗi tên, rồi into_iter tạo Vec tên viết hoa. main dùng iter để kiểm tra dữ liệu trước khi chuyển quyền sở hữu.",
      "requirements": [
        "Không clone cả Vec",
        "Vec rỗng vẫn trả Vec rỗng",
        "An và Binh thành AN! và BINH!",
        "Giữ assertions của main"
      ]
    },
    "starterCode": "fn prepare_names(mut names: Vec<String>) -> Vec<String> {\n    todo!(\"Sửa từng tên rồi tiêu thụ để tạo kết quả\")\n}\n\nfn main() {\n    let names = vec![String::from(\"An\"), String::from(\"Binh\")];\n    let bytes: usize = names.iter().map(|name| name.len()).sum();\n    assert_eq!(bytes, 6);\n    assert!(prepare_names(vec![]).is_empty());\n    let result = prepare_names(names);\n    assert_eq!(result, vec![String::from(\"AN!\"), String::from(\"BINH!\")]);\n    println!(\"{}\", result.join(\", \"));\n}",
    "solutionCode": "fn prepare_names(mut names: Vec<String>) -> Vec<String> {\n    for name in names.iter_mut() { name.push('!'); }\n    names.into_iter().map(|name| name.to_uppercase()).collect()\n}\n\nfn main() {\n    let names = vec![String::from(\"An\"), String::from(\"Binh\")];\n    let bytes: usize = names.iter().map(|name| name.len()).sum();\n    assert_eq!(bytes, 6);\n    assert!(prepare_names(vec![]).is_empty());\n    let result = prepare_names(names);\n    assert_eq!(result, vec![String::from(\"AN!\"), String::from(\"BINH!\")]);\n    println!(\"{}\", result.join(\", \"));\n}",
    "expectedOutput": "AN!, BINH!\n",
    "hints": [
      "Vòng đầu: for name in names.iter_mut() { name.push('!'); }.",
      "Vòng sau có thể là names.into_iter().map(|name| name.to_uppercase()).collect()."
    ],
    "quiz": {
      "question": "names.iter_mut() trên Vec<String> đưa ra phần tử kiểu gì?",
      "options": [
        "String",
        "&String",
        "&mut String",
        "usize"
      ],
      "correct": 2,
      "explanation": "iter_mut cho tham chiếu có thể sửa đến từng phần tử mà không chuyển quyền sở hữu Vec ra khỏi owner."
    },
    "reference": {
      "label": "Rust standard library · IntoIterator",
      "url": "https://doc.rust-lang.org/std/iter/trait.IntoIterator.html"
    }
  },
  {
    "id": "custom-iterator",
    "moduleId": "iteration",
    "title": "Tự triển khai Iterator",
    "description": "Định nghĩa trạng thái, Item và next để hòa vào hệ sinh thái iterator.",
    "duration": 35,
    "objectives": [
      "Triển khai Iterator với type Item và next",
      "Cập nhật trạng thái sau mỗi lần gọi",
      "Dùng collect và sum với iterator tự viết"
    ],
    "sections": [
      {
        "title": "Iterator là một giao thức từng bước",
        "text": "Trait Iterator yêu cầu associated type Item và phương thức next(&mut self) -> Option<Self::Item>. Mỗi lần gọi next có thể tạo một phần tử hoặc báo chưa còn phần tử bằng None. Phần lớn adapter và consumer được cung cấp sẵn dựa trên giao thức này.",
        "code": "struct Countdown { current: u32 }\n\nimpl Iterator for Countdown {\n    type Item = u32;\n    fn next(&mut self) -> Option<Self::Item> {\n        if self.current == 0 { return None; }\n        let value = self.current;\n        self.current -= 1;\n        Some(value)\n    }\n}"
      },
      {
        "title": "Trạng thái phải tiến triển đúng",
        "text": "Countdown lưu số sẽ được trả tiếp theo. Nó kiểm tra 0 trước khi trừ để tránh underflow, sau đó cập nhật trạng thái và trả số cũ. Bài này thiết kế iterator dừng hẳn sau None; Iterator nói chung không tự bảo đảm mọi implementation đều luôn trả None về sau. fuse có thể cung cấp hành vi dừng hẳn cho bên dùng.",
        "code": "let mut countdown = Countdown { current: 2 };\nassert_eq!(countdown.next(), Some(2));\nassert_eq!(countdown.next(), Some(1));\nassert_eq!(countdown.next(), None);\nassert_eq!(countdown.next(), None);"
      },
      {
        "title": "Lợi ích xuất hiện ở nơi dùng",
        "text": "Sau khi có next đúng, Countdown dùng được với for, map, collect, sum và những công cụ iterator khác. Không cần viết riêng một hàm thu Vec hay một hàm tính tổng cho từng kiểu iterator. Hãy kiểm tra cả trạng thái bắt đầu bằng 0 và nhiều lần gọi sau khi đã kết thúc.",
        "code": "let values: Vec<u32> = Countdown { current: 3 }.collect();\nlet total: u32 = Countdown { current: 4 }.sum();\nassert_eq!(values, vec![3, 2, 1]);\nassert_eq!(total, 10);"
      }
    ],
    "tip": "Một next thiếu cập nhật trạng thái có thể làm collect không bao giờ kết thúc. Kiểm tra vài lần next riêng trước.",
    "exercise": {
      "title": "Iterator đếm ngược",
      "instructions": "Hoàn thiện next cho Countdown. Trả current rồi giảm 1; khi current bằng 0, trả None và giữ trạng thái kết thúc. Không đưa 0 vào dãy.",
      "requirements": [
        "Countdown 3 tạo [3, 2, 1]",
        "Countdown 0 không có phần tử",
        "Sau khi hết, các lần next tiếp theo vẫn None",
        "Không underflow khi trừ"
      ]
    },
    "starterCode": "struct Countdown { current: u32 }\n\nimpl Iterator for Countdown {\n    type Item = u32;\n    fn next(&mut self) -> Option<Self::Item> {\n        todo!(\"Trả phần tử kế tiếp và cập nhật trạng thái\")\n    }\n}\n\nfn main() {\n    let result: Vec<u32> = Countdown { current: 3 }.collect();\n    assert_eq!(result, vec![3, 2, 1]);\n    assert_eq!(Countdown { current: 4 }.sum::<u32>(), 10);\n    let mut empty = Countdown { current: 0 };\n    assert_eq!(empty.next(), None);\n    assert_eq!(empty.next(), None);\n    println!(\"Đếm ngược: {result:?}\");\n}",
    "solutionCode": "struct Countdown { current: u32 }\n\nimpl Iterator for Countdown {\n    type Item = u32;\n    fn next(&mut self) -> Option<Self::Item> {\n        if self.current == 0 { return None; }\n        let value = self.current;\n        self.current -= 1;\n        Some(value)\n    }\n}\n\nfn main() {\n    let result: Vec<u32> = Countdown { current: 3 }.collect();\n    assert_eq!(result, vec![3, 2, 1]);\n    assert_eq!(Countdown { current: 4 }.sum::<u32>(), 10);\n    let mut empty = Countdown { current: 0 };\n    assert_eq!(empty.next(), None);\n    assert_eq!(empty.next(), None);\n    println!(\"Đếm ngược: {result:?}\");\n}",
    "expectedOutput": "Đếm ngược: [3, 2, 1]\n",
    "hints": [
      "Kiểm tra current == 0 trước mọi phép trừ.",
      "Lưu current vào value, giảm current rồi trả Some(value)."
    ],
    "quiz": {
      "question": "Phương thức tối thiểu phải triển khai cho Iterator là gì?",
      "options": [
        "collect",
        "map",
        "sum",
        "next"
      ],
      "correct": 3,
      "explanation": "Iterator yêu cầu next và associated type Item; nhiều phương thức khác có triển khai mặc định dựa trên chúng."
    },
    "reference": {
      "label": "Rust standard library · Iterator",
      "url": "https://doc.rust-lang.org/std/iter/trait.Iterator.html"
    }
  },
  {
    "id": "integration-tests",
    "moduleId": "testing",
    "title": "Integration test qua API công khai",
    "description": "Kiểm thử thư viện từ góc nhìn người dùng bên ngoài và chạy bằng Cargo.",
    "duration": 35,
    "objectives": [
      "Đặt integration test trong thư mục tests",
      "Chỉ dùng API public của library crate",
      "Phân biệt cargo test với chạy main trên web"
    ],
    "sections": [
      {
        "title": "Kiểm thử từ phía người sử dụng thư viện",
        "text": "Unit test thường ở gần mã nguồn và có thể kiểm tra các mục private theo quy tắc module. Integration test được biên dịch như crate bên ngoài, nên dùng API công khai của thư viện. Nó giúp kiểm tra nhiều phần phối hợp với nhau qua đúng giao diện mà người sử dụng thực sự có.",
        "code": "// Trong dự án Cargo trên máy: src/lib.rs\npub fn add(a: i32, b: i32) -> i32 { a + b }\n\n// Trong một tệp riêng: tests/public_api.rs\n// use learn_math::add;\n// #[test]\n// fn adds_two_values() { assert_eq!(add(2, 3), 5); }"
      },
      {
        "title": "Cargo phát hiện test theo cấu trúc dự án",
        "text": "Các tệp test ở cấp phù hợp trong tests/ được Cargo nhận là integration test target. Chạy cargo test để chạy test của package hoặc cargo test --test public_api để chọn target. Thư viện cần có library target như src/lib.rs để test crate bên ngoài import API; mã chỉ ở main.rs không tự trở thành library để import.",
        "code": "# Chạy trên terminal trong package có src/lib.rs\ncargo test\ncargo test --test public_api\n\n# Cấu trúc tệp cần tạo trên máy:\n# Cargo.toml\n# src/lib.rs\n# tests/public_api.rs"
      },
      {
        "title": "Giữ ca thử độc lập và có ý nghĩa",
        "text": "Kiểm tra đầu vào thông thường, dữ liệu rỗng, lỗi parse và giới hạn số nếu API hứa xử lý chúng. Không để test phụ thuộc thứ tự chạy hay trạng thái chung. Bài web bên dưới gọi API public của một module từ main để thực hành các ca thử; đó là chương trình một tệp, không phải Cargo integration-test harness.",
        "code": "assert_eq!(invoice::total(\"10\\n20\"), Ok(30));\nassert_eq!(invoice::total(\"\"), Ok(0));\nassert_eq!(invoice::total(\"x\"), Err(\"Số tiền không hợp lệ\"));\nassert_eq!(invoice::total(\"4294967295\\n1\"), Err(\"Tổng vượt giới hạn\"));"
      }
    ],
    "tip": "Khi chuyển sang Cargo, đặt logic vào thư viện rồi giữ main thật mỏng. Integration test có thể gọi thư viện mà không cần chạy giao diện CLI.",
    "exercise": {
      "title": "Kiểm tra API tổng hóa đơn",
      "instructions": "Hoàn thiện invoice::total trong chương trình một tệp. Đọc từng dòng không trống như u32, cộng có kiểm tra tràn. main kiểm tra API public bằng assertions; môi trường web không chạy Cargo hay tạo tests/public_api.rs.",
      "requirements": [
        "Bỏ qua dòng rỗng hoặc chỉ có khoảng trắng",
        "Sai định dạng trả Số tiền không hợp lệ",
        "Tràn u32 trả Tổng vượt giới hạn",
        "Giữ bốn tình huống kiểm tra ở main"
      ]
    },
    "starterCode": "mod invoice {\n    pub fn total(input: &str) -> Result<u32, &'static str> {\n        todo!(\"Đọc các dòng và tính tổng an toàn\")\n    }\n}\n\nfn main() {\n    assert_eq!(invoice::total(\"10\\n 20 \\n\\n30\"), Ok(60));\n    assert_eq!(invoice::total(\"\"), Ok(0));\n    assert_eq!(invoice::total(\"x\"), Err(\"Số tiền không hợp lệ\"));\n    assert_eq!(invoice::total(\"4294967295\\n1\"), Err(\"Tổng vượt giới hạn\"));\n    println!(\"API công khai: 4 tình huống đạt\");\n}",
    "solutionCode": "mod invoice {\n    pub fn total(input: &str) -> Result<u32, &'static str> {\n        let mut total = 0_u32;\n        for line in input.lines() {\n            let line = line.trim();\n            if line.is_empty() { continue; }\n            let amount = line.parse::<u32>().map_err(|_| \"Số tiền không hợp lệ\")?;\n            total = total.checked_add(amount).ok_or(\"Tổng vượt giới hạn\")?;\n        }\n        Ok(total)\n    }\n}\n\nfn main() {\n    assert_eq!(invoice::total(\"10\\n 20 \\n\\n30\"), Ok(60));\n    assert_eq!(invoice::total(\"\"), Ok(0));\n    assert_eq!(invoice::total(\"x\"), Err(\"Số tiền không hợp lệ\"));\n    assert_eq!(invoice::total(\"4294967295\\n1\"), Err(\"Tổng vượt giới hạn\"));\n    println!(\"API công khai: 4 tình huống đạt\");\n}",
    "expectedOutput": "API công khai: 4 tình huống đạt\n",
    "hints": [
      "Duyệt input.lines(), trim rồi continue khi dòng rỗng.",
      "Dùng parse::<u32>().map_err(...)? và total.checked_add(amount).ok_or(...)? để giữ hai loại lỗi."
    ],
    "quiz": {
      "question": "Integration test của một library crate nên gọi phần nào của thư viện?",
      "options": [
        "Mọi hàm private bằng đường dẫn tùy ý",
        "API công khai mà crate bên ngoài có thể sử dụng",
        "Chỉ mã trong main.rs",
        "Chỉ hằng số, không được gọi hàm"
      ],
      "correct": 1,
      "explanation": "Integration test được biên dịch như crate bên ngoài và kiểm tra thư viện qua giao diện public của nó."
    },
    "reference": {
      "label": "The Rust Book · Test Organization",
      "url": "https://doc.rust-lang.org/book/ch11-03-test-organization.html"
    }
  }
];
