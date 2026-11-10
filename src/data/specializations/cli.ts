import type { SpecializationBundle } from "../specialization-types";

export const cliBundle: SpecializationBundle = {
  "track": {
    "id": "cli",
    "title": "CLI và công cụ tự động hóa",
    "shortTitle": "CLI và tự động hóa",
    "description": "Xây công cụ dòng lệnh xử lý tệp và log, kết hợp với shell, có kiểm thử và quy trình phát hành.",
    "outcome": "Bàn giao CLI có giao diện rõ ràng, xử lý dữ liệu lớn, giữ hợp đồng đầu ra và chạy ổn định trong script hoặc CI.",
    "prerequisites": [
      "Ownership, borrowing và iterator",
      "Result và thiết kế kiểu lỗi",
      "File, BufRead, Write và PathBuf",
      "Kiểm thử, thread và channel cơ bản"
    ],
    "technologies": [
      "clap",
      "Cargo",
      "BufRead / Write",
      "Pipes",
      "clap_complete"
    ],
    "color": "rust",
    "lessonIds": [
      "cli-arguments",
      "cli-streaming",
      "cli-filesystem",
      "cli-pipes",
      "cli-parallelism",
      "cli-shipping"
    ],
    "capstone": {
      "title": "Logscan: tìm kiếm và xuất báo cáo log",
      "description": "Xây CLI lọc log từ tệp hoặc stdin, có định dạng cho người và máy, xử lý nhiều tệp có giới hạn và bản phát hành cho ít nhất hai nền tảng.",
      "milestones": [
        {
          "title": "Hợp đồng lệnh và định dạng",
          "tasks": [
            "Thiết kế search và report: flags, mặc định, mã thoát, hành vi không khớp.",
            "Viết parser clap với test xung đột, jobs và đường dẫn có khoảng trắng; định nghĩa đầu ra máy có phiên bản."
          ],
          "acceptance": "Help mô tả trường hợp chính; parser và golden test chạy độc lập với filesystem."
        },
        {
          "title": "Lõi streaming và lỗi",
          "tasks": [
            "Tách hàm BufRead/Write; giữ số dòng gốc, phân biệt lỗi đọc và ghi.",
            "Định nghĩa chính sách UTF-8, dòng quá dài, CRLF và kết quả dở dang."
          ],
          "acceptance": "Có test Unicode, EOF thiếu newline, input hỏng, writer thất bại; không giữ toàn bộ tệp lớn trong RAM."
        },
        {
          "title": "Tệp và xuất bản",
          "tasks": [
            "Không ghi đè theo mặc định; thay tệp cần tùy chọn tường minh.",
            "Xác định tệp tạm, phạm vi cleanup và bảo đảm atomic/durable theo nền tảng."
          ],
          "acceptance": "Test giữ tệp cũ khi chưa được phép thay; lỗi giữa quy trình không để báo cáo dở dang mang nhãn hoàn tất."
        },
        {
          "title": "Song song và hủy",
          "tasks": [
            "Giới hạn worker, queue và cửa sổ kết quả; chọn thứ tự ổn định hoặc công bố chế độ không thứ tự.",
            "Thêm dừng có trật tự, xử lý pipe đóng và progress trên stderr."
          ],
          "acceptance": "Kết quả khớp bản tuần tự; không deadlock khi worker lỗi hoặc consumer dừng; báo cáo có ngân sách bộ nhớ và số đo."
        },
        {
          "title": "Binary và phát hành",
          "tasks": [
            "Integration test stdin/stdout/stderr và mã thoát; chạy trên ít nhất hai nền tảng.",
            "Bổ sung lockfile, README, completion, changelog và artifact theo target với checksum."
          ],
          "acceptance": "Người khác làm theo README chạy được; nguồn gốc artifact rõ ràng và định dạng máy giữ tương thích đã công bố."
        }
      ],
      "deliverables": [
        "Mã nguồn Cargo, Cargo.lock và hợp đồng CLI",
        "Parser test, unit test, integration test và golden fixtures",
        "Báo cáo hiệu năng: đầu vào, target, worker, RAM",
        "Artifact theo nền tảng, checksum, completion và README"
      ],
      "reviewQuestions": [
        "Caller biết kết quả dở dang thế nào nếu lỗi đến sau 100 dòng đã xuất?",
        "create_new, rename, flush và sync_all có bảo đảm gì khác nhau?",
        "Worker chậm nhất có thể làm bộ đệm sắp thứ tự tăng đến đâu?",
        "Vì sao BrokenPipe đầu ra không cho phép bỏ mọi io::Error?",
        "Bạn đổi schema mà không làm script cũ hiểu sai dữ liệu bằng cách nào?"
      ]
    },
    "resources": [
      {
        "label": "Rust: command-line applications",
        "url": "https://rust-lang.org/what/cli/"
      },
      {
        "label": "clap: derive tutorial",
        "url": "https://docs.rs/clap/4.6.7/clap/_derive/_tutorial/index.html"
      },
      {
        "label": "Rust CLI Book",
        "url": "https://rust-cli.github.io/book/"
      },
      {
        "label": "Rust std: BufRead",
        "url": "https://doc.rust-lang.org/std/io/trait.BufRead.html"
      },
      {
        "label": "Cargo: binary và integration tests",
        "url": "https://doc.rust-lang.org/cargo/reference/cargo-targets.html"
      },
      {
        "label": "clap_complete: shell completion",
        "url": "https://docs.rs/clap_complete/4.6.11/clap_complete/aot/fn.generate.html"
      }
    ]
  },
  "lessons": [
    {
      "id": "cli-arguments",
      "moduleId": "track-cli",
      "title": "clap: thiết kế giao diện dòng lệnh",
      "description": "Biến đối số thành kiểu dữ liệu, mô tả xung đột và kiểm thử hợp đồng trước khi chạy công việc.",
      "duration": 45,
      "objectives": [
        "Thiết kế subcommand và mặc định rõ ràng",
        "Dùng Parser, Subcommand và try_parse_from",
        "Tách cú pháp khỏi xác nhận nghiệp vụ",
        "Giữ đối số và đường dẫn đúng kiểu"
      ],
      "sections": [
        {
          "title": "Lệnh cũng là một API",
          "text": "Một CLI được gõ trực tiếp nhưng cũng được gọi từ script, cron và CI. Trước khi viết mã, xác định thao tác chính, dữ liệu vào, kết quả và cách báo lỗi. Ví dụ logscan search PATTERN PATH rõ hơn một nhóm cờ khiến người dùng phải đoán thao tác nào sẽ chạy. Mặc định phân biệt hoa thường, đọc stdin bằng dấu gạch ngang và việc từ chối ghi đè đều thuộc hợp đồng.\n\nTùy chọn mới không nên âm thầm đổi ý nghĩa lệnh cũ. Ghi ví dụ ngắn trong help và giữ tên cờ nhất quán. Chế độ dành cho máy cần giá trị rõ ràng, thay vì suy luận từ màu hay câu chữ hiển thị."
        },
        {
          "title": "Khai báo cấu trúc bằng clap",
          "text": "Parser chuyển đối số thành struct; Subcommand chuyển động từ thành enum. Trường u16 diễn tả số hữu hạn, PathBuf giữ đường dẫn theo hệ điều hành, còn bool thường là cờ. ValueEnum phù hợp với tập lựa chọn đóng. Range cho jobs từ chối giá trị ngoài 1 đến 64 trước khi tạo worker.\n\nDùng conflicts_with cho hai định dạng đầu ra loại trừ nhau. Global option cần được khai báo có chủ đích để xuất hiện cùng subcommand. Clap sinh usage từ định nghĩa parser, nhưng không hiểu quy tắc như hai đường dẫn có cùng trỏ vào một tài nguyên hay không. Kiểm tra ấy thuộc lớp xử lý sau parse.",
          "code": "// Trong dự án có clap với feature derive.\n#[derive(clap::Parser)]\nstruct Args {\n    #[arg(long, default_value_t = 1,\n          value_parser = clap::value_parser!(u16).range(1..=64))]\n    jobs: u16,\n    path: std::path::PathBuf,\n}"
        },
        {
          "title": "Đối số không phải chuỗi shell",
          "text": "Shell đã tách token trước khi chương trình bắt đầu. Nếu gọi công cụ con bằng Command, truyền từng giá trị qua arg hoặc args. Ghép dữ liệu người dùng vào sh -c tạo thêm một ngôn ngữ diễn giải, làm sai khoảng trắng và ký tự đặc biệt. Shell script và batch trên Windows còn có quy tắc riêng cần đánh giá theo nền tảng.\n\nĐường dẫn không nhất thiết là UTF-8. Giữ OsString hoặc PathBuf tới ranh giới hiển thị; display tạo thông báo, không phải biểu diễn bảo toàn mọi byte. Một pattern văn bản có thể yêu cầu UTF-8, nhưng yêu cầu đó không nên vô tình áp lên tên tệp."
        },
        {
          "title": "Kiểm thử mà không thoát tiến trình",
          "text": "Cli::parse tiện cho main vì tự xử lý help và lỗi đầu vào. Trong test, try_parse_from trả Result để kiểm tra lỗi mà không kết thúc test runner. Phần tử đầu tiên là tên executable. Kiểm thử thiếu subcommand, cờ xung đột, khoảng số, đường dẫn có dấu cách và help. CommandFactory::command().debug_assert() phát hiện cấu hình clap không nhất quán.\n\nSau parser, chuyển DTO sang cấu hình nghiệp vụ đã xác nhận. Bài tập web mô hình hóa bước chuyển đó; lab Cargo kiểm tra parser thật. Nhờ tách hai tầng, thay tên cờ không khiến thuật toán phải viết lại, và test nghiệp vụ không cần dựng tiến trình mỗi lần."
        }
      ],
      "tip": "Giữ định nghĩa parser ở một nơi để help, completion và kiểm thử cùng dựa trên một hợp đồng.",
      "exercise": {
        "title": "Xác nhận cấu hình chạy",
        "instructions": "Hoàn thiện configure để chỉ tạo cấu hình khi số worker hợp lệ và hai chế độ xuất không xung đột.",
        "requirements": [
          "jobs nằm trong 1..=64.",
          "json và human không được cùng bật.",
          "Không chọn định dạng thì dùng human; xác nhận khoảng trước khi ép kiểu."
        ]
      },
      "starterCode": "#[derive(Debug, PartialEq)]\nstruct Config { jobs: u16, json: bool }\nfn configure(jobs: u32, json: bool, human: bool) -> Result<Config, &'static str> {\n    todo!()\n}\nfn main() {\n    assert_eq!(configure(4, true, false), Ok(Config { jobs: 4, json: true }));\n    assert_eq!(configure(1, false, false), Ok(Config { jobs: 1, json: false }));\n    assert!(configure(64, false, true).is_ok());\n    assert_eq!(configure(0, false, false), Err(\"jobs\"));\n    assert_eq!(configure(u32::MAX, false, false), Err(\"jobs\"));\n    assert_eq!(configure(2, true, true), Err(\"format\"));\n    println!(\"jobs=4, format=json\");\n}",
      "solutionCode": "#[derive(Debug, PartialEq)]\nstruct Config { jobs: u16, json: bool }\nfn configure(jobs: u32, json: bool, human: bool) -> Result<Config, &'static str> {\n    if !(1..=64).contains(&jobs) { return Err(\"jobs\"); }\n    if json && human { return Err(\"format\"); }\n    Ok(Config { jobs: jobs as u16, json })\n}\nfn main() {\n    assert_eq!(configure(4, true, false), Ok(Config { jobs: 4, json: true }));\n    assert_eq!(configure(1, false, false), Ok(Config { jobs: 1, json: false }));\n    assert!(configure(64, false, true).is_ok());\n    assert_eq!(configure(0, false, false), Err(\"jobs\"));\n    assert_eq!(configure(u32::MAX, false, false), Err(\"jobs\"));\n    assert_eq!(configure(2, true, true), Err(\"format\"));\n    println!(\"jobs=4, format=json\");\n}",
      "expectedOutput": "jobs=4, format=json",
      "hints": [
        "Xác nhận khoảng trên u32 trước khi chuyển sang u16.",
        "Cờ human dùng để kiểm tra xung đột với json."
      ],
      "quiz": {
        "question": "Vì sao nên dùng try_parse_from trong unit test?",
        "options": [
          "Nó bỏ qua mọi lỗi cú pháp.",
          "Nó trả Result để kiểm tra lỗi và help mà không tự thoát tiến trình.",
          "Nó tự mở mọi PathBuf để xác minh quyền.",
          "Nó chỉ hỗ trợ CLI không có subcommand."
        ],
        "correct": 1,
        "explanation": "try_parse_from giữ kết quả phân tích trong tiến trình test. Mở tệp và kiểm tra nghiệp vụ vẫn là bước riêng."
      },
      "reference": {
        "label": "clap: derive tutorial",
        "url": "https://docs.rs/clap/4.6.7/clap/_derive/_tutorial/index.html"
      },
      "localLab": {
        "title": "Parser clap có kiểm thử hợp đồng",
        "instructions": "Tạo các tệp trong một thư mục Cargo mới. Lab cố định clap 4.6.7, chạy trên Linux, macOS và Windows. Các test chỉ phân tích đối số; không mở hay ghi tệp được truyền vào.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"cli-contract\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\nclap = { version = \"=4.6.7\", features = [\"derive\"] }\n"
          },
          {
            "path": "src/main.rs",
            "content": "use clap::{Parser, Subcommand};\nuse std::path::PathBuf;\n#[derive(Debug, Parser)]\n#[command(version, about = \"Lọc log theo một hợp đồng rõ ràng\")]\nstruct Cli {\n    #[arg(long, global = true, default_value_t = 1,\n          value_parser = clap::value_parser!(u16).range(1..=64))]\n    jobs: u16,\n    #[command(subcommand)]\n    command: Action,\n}\n#[derive(Debug, Subcommand)]\nenum Action {\n    Search {\n        pattern: String,\n        path: PathBuf,\n        #[arg(long, conflicts_with = \"human\")]\n        json: bool,\n        #[arg(long)]\n        human: bool,\n    },\n}\nfn main() { println!(\"{:?}\", Cli::parse()); }\n#[cfg(test)]\nmod tests {\n    use super::*;\n    use clap::{CommandFactory, error::ErrorKind};\n    #[test]\n    fn definition_is_consistent() { Cli::command().debug_assert(); }\n    #[test]\n    fn typed_values_and_literal_path() {\n        let cli = Cli::try_parse_from([\"cli-contract\", \"search\", \"Rust\", \"mẫu log.txt\", \"--jobs\", \"4\", \"--json\"]).unwrap();\n        assert_eq!(cli.jobs, 4);\n        let Action::Search { pattern, path, json, human } = cli.command;\n        assert_eq!(pattern, \"Rust\");\n        assert_eq!(path, PathBuf::from(\"mẫu log.txt\"));\n        assert!(json && !human);\n    }\n    #[test]\n    fn conflicts_and_worker_range() {\n        let e = Cli::try_parse_from([\"cli-contract\", \"search\", \"x\", \"a\", \"--json\", \"--human\"]).unwrap_err();\n        assert_eq!(e.kind(), ErrorKind::ArgumentConflict);\n        for jobs in [\"0\", \"65\", \"oops\"] {\n            assert!(Cli::try_parse_from([\"cli-contract\", \"--jobs\", jobs, \"search\", \"x\", \"a\"]).is_err());\n        }\n    }\n    #[test]\n    fn help_succeeds() {\n        let e = Cli::try_parse_from([\"cli-contract\", \"--help\"]).unwrap_err();\n        assert_eq!(e.kind(), ErrorKind::DisplayHelp);\n        assert_eq!(e.exit_code(), 0);\n    }\n}"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run -- --help",
          "cargo run -- search Rust \"mẫu log.txt\" --jobs 4 --json"
        ],
        "checks": [
          "Bốn test đạt, gồm xung đột cờ và jobs ngoài khoảng.",
          "Đường dẫn có dấu cách vẫn là một PathBuf; chương trình chưa đọc tệp này.",
          "Help hiển thị subcommand và jobs; thiếu đối số báo usage."
        ]
      }
    },
    {
      "id": "cli-streaming",
      "moduleId": "track-cli",
      "title": "Xử lý dòng dữ liệu lớn và Unicode",
      "description": "Đọc theo dòng, giữ số dòng gốc và truyền lỗi I/O thay vì nạp mọi nội dung vào bộ nhớ.",
      "duration": 50,
      "objectives": [
        "Tách thuật toán khỏi stdin và File bằng BufRead/Write",
        "Phân biệt byte, Unicode và kết thúc dòng",
        "Không bỏ qua lỗi đọc giữa luồng dữ liệu",
        "Kiểm thử bằng bộ đệm trong bộ nhớ"
      ],
      "sections": [
        {
          "title": "Đọc theo nhu cầu",
          "text": "read_to_string tiện cho tệp nhỏ, nhưng log nhiều gigabyte không nên trở thành một String khổng lồ. BufReader gom các lần đọc hệ thống, còn BufRead cung cấp thao tác theo dòng. Hàm nhận impl BufRead giúp cùng thuật toán chạy với File, stdin.lock() hoặc lát byte trong test.\n\nStreaming giới hạn dữ liệu đang giữ nhưng không tự tạo trần bộ nhớ tuyệt đối. Một dòng riêng lẻ vẫn có thể rất dài; lines cũng cấp phát String cho mỗi dòng. Nếu đầu vào không tin cậy, định nghĩa kích thước bản ghi tối đa và đọc theo khối có giới hạn, thay vì kiểm tra sau khi đã cấp phát toàn bộ dòng."
        },
        {
          "title": "Chọn đơn vị xử lý",
          "text": "lines bỏ ký tự xuống dòng cuối bản ghi, gồm cặp CRLF thông thường, và vẫn trả dòng cuối không có newline. enumerate phải chạy trước khi lọc nếu kết quả cần số dòng gốc. Đừng gọi trim lên toàn bộ nội dung chỉ để bỏ newline: khoảng trắng có thể mang ý nghĩa trong log.\n\nString yêu cầu UTF-8; dữ liệu không hợp lệ tạo lỗi khi đọc thành chuỗi. Nếu cần giữ byte nhị phân, dùng read_until hoặc fill_buf và định nghĩa tìm kiếm theo byte. chars đếm Unicode scalar values, không phải ký tự hiển thị. So sánh không phân biệt hoa thường và chuẩn hóa Unicode là yêu cầu riêng, không suy ra từ contains.",
          "code": "use std::io::{self, BufRead};\nfn inspect(reader: impl BufRead) -> io::Result<()> {\n    for (index, line) in reader.lines().enumerate() {\n        let line = line?;\n        eprintln!(\"dòng {}, {} byte\", index + 1, line.len());\n    }\n    Ok(())\n}"
        },
        {
          "title": "Dữ liệu dở dang vẫn phải báo lỗi",
          "text": "Một luồng có thể đọc thành công một số dòng rồi gặp lỗi. filter_map(Result::ok) làm dòng lỗi biến mất và khiến công cụ báo kết quả thiếu như thể đã xử lý trọn vẹn. Chọn chính sách rõ: dừng ở lỗi đầu tiên, hoặc tiếp tục nhưng báo số lỗi và mã thoát không thành công.\n\nĐầu ra đã gửi vào pipe không thể thu hồi khi lỗi đến sau. Nếu cần báo cáo tất cả hoặc không có gì, ghi streaming vào tệp tạm rồi xuất bản khi hoàn tất. Nếu từng dòng có giá trị độc lập, công bố chế độ best-effort và để máy gọi phát hiện kết quả chưa hoàn chỉnh qua trạng thái kết thúc."
        },
        {
          "title": "Kiểm thử nguồn và đích",
          "text": "Test cấp UTF-8 có dấu, CRLF, dòng trống và dòng cuối thiếu newline vào hàm lọc. Vec<u8> đóng vai Write để kiểm tra chính xác byte trả ra. Thêm nguồn UTF-8 hỏng và đích ghi thất bại để xác minh lỗi không bị nuốt. Dữ liệu cố định giúp test không phụ thuộc tệp cá nhân hay locale.\n\nLab phân biệt PickError::Input với PickError::Output. Điều này quan trọng khi áp dụng chính sách cho pipe đóng sớm ở bài sau. Hàm lõi không tự mở stdin nên unit test chạy nhanh; integration test xác nhận binary ghép đúng tham số, hai luồng đầu ra và mã thoát."
        }
      ],
      "tip": "Đọc từng dòng giải quyết kích thước toàn tệp; giới hạn kích thước từng bản ghi là một yêu cầu khác.",
      "exercise": {
        "title": "Lọc dòng và giữ vị trí gốc",
        "instructions": "Hoàn thiện select_lines. Chỉ ghi dòng chứa needle, theo mẫu số dòng: nội dung.",
        "requirements": [
          "Needle rỗng trả InvalidInput.",
          "Giữ Unicode và số dòng gốc; hỗ trợ CRLF và dòng cuối thiếu newline.",
          "Truyền lỗi đọc, ghi và flush cho caller."
        ]
      },
      "starterCode": "use std::io::{self, BufRead, Write};\nfn select_lines(reader: impl BufRead, needle: &str, mut output: impl Write) -> io::Result<usize> {\n    todo!()\n}\nfn main() {\n    let input = \"Rust\\r\\nGo\\nRust an toàn\";\n    let mut output = Vec::new();\n    assert_eq!(select_lines(input.as_bytes(), \"Rust\", &mut output).unwrap(), 2);\n    assert_eq!(output, \"1: Rust\\n3: Rust an toàn\\n\".as_bytes());\n    assert_eq!(select_lines(\"\".as_bytes(), \"x\", Vec::new()).unwrap(), 0);\n    assert_eq!(select_lines(\"mưa\\n\".as_bytes(), \"ưa\", Vec::new()).unwrap(), 1);\n    assert_eq!(select_lines(\"x\".as_bytes(), \"\", Vec::new()).unwrap_err().kind(), io::ErrorKind::InvalidInput);\n    assert_eq!(select_lines(&[0xffu8][..], \"x\", Vec::new()).unwrap_err().kind(), io::ErrorKind::InvalidData);\n    print!(\"{}\", String::from_utf8(output).unwrap());\n}",
      "solutionCode": "use std::io::{self, BufRead, Write};\nfn select_lines(reader: impl BufRead, needle: &str, mut output: impl Write) -> io::Result<usize> {\n    if needle.is_empty() { return Err(io::ErrorKind::InvalidInput.into()); }\n    let mut count = 0;\n    for (index, line) in reader.lines().enumerate() {\n        let line = line?;\n        if line.contains(needle) {\n            writeln!(output, \"{}: {line}\", index + 1)?;\n            count += 1;\n        }\n    }\n    output.flush()?;\n    Ok(count)\n}\nfn main() {\n    let input = \"Rust\\r\\nGo\\nRust an toàn\";\n    let mut output = Vec::new();\n    assert_eq!(select_lines(input.as_bytes(), \"Rust\", &mut output).unwrap(), 2);\n    assert_eq!(output, \"1: Rust\\n3: Rust an toàn\\n\".as_bytes());\n    assert_eq!(select_lines(\"\".as_bytes(), \"x\", Vec::new()).unwrap(), 0);\n    assert_eq!(select_lines(\"mưa\\n\".as_bytes(), \"ưa\", Vec::new()).unwrap(), 1);\n    assert_eq!(select_lines(\"x\".as_bytes(), \"\", Vec::new()).unwrap_err().kind(), io::ErrorKind::InvalidInput);\n    assert_eq!(select_lines(&[0xffu8][..], \"x\", Vec::new()).unwrap_err().kind(), io::ErrorKind::InvalidData);\n    print!(\"{}\", String::from_utf8(output).unwrap());\n}",
      "expectedOutput": "1: Rust\n3: Rust an toàn",
      "hints": [
        "Đặt enumerate trước contains.",
        "Dùng line? và writeln!(output, ...)? để giữ lỗi."
      ],
      "quiz": {
        "question": "Vì sao lines().filter_map(Result::ok) có thể làm CLI báo sai?",
        "options": [
          "lines tự đảo thứ tự.",
          "filter_map luôn nạp toàn bộ tệp.",
          "Lỗi đọc bị bỏ đi nên kết quả thiếu vẫn có thể báo thành công.",
          "Result chỉ dùng được với mạng."
        ],
        "correct": 2,
        "explanation": "Err cho biết một phần đầu vào chưa xử lý được. Loại bỏ nó mà không cập nhật trạng thái khiến caller không nhận ra kết quả thiếu."
      },
      "reference": {
        "label": "Rust std: BufRead",
        "url": "https://doc.rust-lang.org/std/io/trait.BufRead.html"
      },
      "localLab": {
        "title": "CLI streaming với kiểm thử tiến trình",
        "instructions": "Tạo package mới từ bốn tệp dưới đây. Hàm thư viện nhận BufRead/Write; binary ghép stdin/stdout và mã thoát. Test chỉ truyền dữ liệu mẫu qua pipe, không đọc tệp cá nhân.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"linepick\"\nversion = \"0.1.0\"\nedition = \"2024\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::io::{self, BufRead, Write};\n#[derive(Debug)]\npub enum PickError { EmptyPattern, Input(io::Error), Output(io::Error) }\nimpl std::fmt::Display for PickError {\n    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {\n        match self {\n            Self::EmptyPattern => write!(f, \"pattern must not be empty\"),\n            Self::Input(e) => write!(f, \"read input: {e}\"),\n            Self::Output(e) => write!(f, \"write output: {e}\"),\n        }\n    }\n}\nimpl std::error::Error for PickError {}\npub fn select_lines(reader: impl BufRead, needle: &str, mut output: impl Write) -> Result<usize, PickError> {\n    if needle.is_empty() { return Err(PickError::EmptyPattern); }\n    let mut count = 0;\n    for (index, line) in reader.lines().enumerate() {\n        let line = line.map_err(PickError::Input)?;\n        if line.contains(needle) {\n            writeln!(output, \"{}: {line}\", index + 1).map_err(PickError::Output)?;\n            count += 1;\n        }\n    }\n    output.flush().map_err(PickError::Output)?;\n    Ok(count)\n}\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn original_unicode_and_line_numbers() {\n        let mut out = Vec::new();\n        assert_eq!(select_lines(\"Rust\\r\\nGo\\nRust an toàn\".as_bytes(), \"Rust\", &mut out).unwrap(), 2);\n        assert_eq!(out, \"1: Rust\\n3: Rust an toàn\\n\".as_bytes());\n    }\n    #[test]\n    fn bad_utf8_is_input_error() {\n        assert!(matches!(select_lines(&[0xffu8][..], \"x\", Vec::new()), Err(PickError::Input(e)) if e.kind() == io::ErrorKind::InvalidData));\n    }\n    struct ClosedPipe;\n    impl Write for ClosedPipe {\n        fn write(&mut self, _: &[u8]) -> io::Result<usize> { Err(io::ErrorKind::BrokenPipe.into()) }\n        fn flush(&mut self) -> io::Result<()> { Ok(()) }\n    }\n    #[test]\n    fn output_error_keeps_context() {\n        assert!(matches!(select_lines(\"Rust\\n\".as_bytes(), \"Rust\", ClosedPipe), Err(PickError::Output(e)) if e.kind() == io::ErrorKind::BrokenPipe));\n    }\n}"
          },
          {
            "path": "src/main.rs",
            "content": "use std::{io, process::ExitCode};\nuse linepick::{select_lines, PickError};\nfn main() -> ExitCode {\n    let mut args = std::env::args_os().skip(1);\n    let pattern = match (args.next(), args.next()) {\n        (Some(value), None) => match value.into_string() {\n            Ok(value) => value,\n            Err(_) => { eprintln!(\"pattern must be UTF-8\"); return ExitCode::from(2); }\n        },\n        _ => { eprintln!(\"usage: linepick PATTERN < input\"); return ExitCode::from(2); }\n    };\n    match select_lines(io::stdin().lock(), &pattern, io::stdout().lock()) {\n        Ok(0) => ExitCode::from(1),\n        Ok(_) => ExitCode::SUCCESS,\n        Err(PickError::Output(e)) if e.kind() == io::ErrorKind::BrokenPipe => ExitCode::SUCCESS,\n        Err(e) => { eprintln!(\"linepick: {e}\"); ExitCode::from(2) }\n    }\n}"
          },
          {
            "path": "tests/cli.rs",
            "content": "use std::{io::Write, process::{Command, Stdio}};\n#[test]\nfn stdin_stdout_contract() {\n    let mut child = Command::new(env!(\"CARGO_BIN_EXE_linepick\"))\n        .arg(\"Rust\").stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped()).spawn().unwrap();\n    let mut stdin = child.stdin.take().unwrap();\n    stdin.write_all(\"Rust\\nGo\\n\".as_bytes()).unwrap();\n    drop(stdin);\n    let result = child.wait_with_output().unwrap();\n    assert!(result.status.success());\n    assert_eq!(result.stdout, b\"1: Rust\\n\");\n    assert!(result.stderr.is_empty());\n}\n#[test]\nfn missing_pattern_has_usage_and_failure_status() {\n    let result = Command::new(env!(\"CARGO_BIN_EXE_linepick\")).output().unwrap();\n    assert_eq!(result.status.code(), Some(2));\n    assert!(result.stdout.is_empty());\n    assert!(String::from_utf8(result.stderr).unwrap().contains(\"usage:\"));\n}"
          }
        ],
        "commands": [
          "cargo test",
          "cargo build --release",
          "printf 'Rust\\nGo\\n' | cargo run --quiet -- Rust"
        ],
        "checks": [
          "Ba unit test và hai integration test đạt.",
          "stdout chỉ có dòng khớp; thiếu pattern đưa usage vào stderr và trả mã 2.",
          "BrokenPipe được giữ trong lỗi đầu ra, khác với lỗi đọc.",
          "Lệnh pipe dùng shell Unix; trên PowerShell dùng \"Rust\", \"Go\" | cargo run --quiet -- Rust."
        ]
      }
    },
    {
      "id": "cli-filesystem",
      "moduleId": "track-cli",
      "title": "Tệp, đường dẫn và xuất bản kết quả",
      "description": "Bảo vệ tệp đã có, phân biệt tính nguyên tử với độ bền và giữ đường dẫn theo đúng nền tảng.",
      "duration": 55,
      "objectives": [
        "Chọn create_new hoặc replace theo hợp đồng",
        "Phân biệt flush, sync_all và rename",
        "Nhận biết race khi kiểm tra rồi mở đường dẫn",
        "Kiểm thử tệp trong thư mục riêng"
      ],
      "sections": [
        {
          "title": "Tên tệp cần được giữ đúng kiểu",
          "text": "Path và PathBuf diễn tả đường dẫn theo nền tảng, không chỉ là String có dấu gạch chéo. Dùng join để nối thành phần và file_name để lấy tên; đừng chẻ chuỗi theo một dấu phân cách rồi cho rằng mã chạy giống nhau trên Windows và Unix. Tên tệp có thể không phải UTF-8, nên chuyển sang chuỗi ở nơi cần hiển thị.\n\nCLI cần công bố chính sách symbolic link, thư mục bị từ chối quyền và tên đầu ra trùng. Kiểm tra tên theo cú pháp không chứng minh tài nguyên nằm trong một thư mục an toàn. Symlink có thể bị thay giữa lúc kiểm tra và sử dụng đường dẫn."
        },
        {
          "title": "Không ghi đè là một thao tác riêng",
          "text": "Kiểm tra exists rồi gọi File::create có khoảng thời gian đua: tiến trình khác có thể tạo tệp giữa hai lời gọi. create_new(true) yêu cầu hệ điều hành tạo một tên chưa tồn tại và báo AlreadyExists nếu tên đã có. Quy tắc này khác với create(true) và chế độ append. Giữ lỗi gốc để người dùng hiểu vì sao không mở được đầu ra.\n\ncreate_new bảo vệ tệp cũ nhưng không bảo đảm tệp mới đầy đủ: lỗi ghi hoặc hết dung lượng có thể để lại dữ liệu dở dang. Lab kiểm chứng hai đặc tính riêng: không ghi đè tệp cũ, và chỉ rename sau khi đã ghi xong tệp tạm.",
          "code": "use std::fs::OpenOptions;\n// Không dùng exists() rồi mới tạo.\nlet file = OpenOptions::new()\n    .write(true)\n    .create_new(true)\n    .open(output_path)?;"
        },
        {
          "title": "Nguyên tử không đồng nghĩa bền sau mất điện",
          "text": "Quy trình thay tệp thường tạo tệp tạm trong cùng filesystem, ghi đầy đủ, kiểm tra flush hoặc sync, đóng handle khi cần rồi rename. Cách này tránh để người đọc thấy từng đoạn nội dung mới qua tên cuối cùng, trong phạm vi bảo đảm của hệ điều hành và filesystem. Rename sang filesystem khác có thể thất bại; thay tệp tồn tại cũng có chi tiết theo nền tảng.\n\nBufWriter::flush đẩy bộ đệm ra writer bên dưới; File::sync_all yêu cầu đồng bộ dữ liệu và metadata của tệp. Độ bền của đổi tên còn liên quan thư mục. Nếu không được thay tên đã tồn tại, đừng coi rename thông thường là no-clobber; chọn primitive đúng hợp đồng."
        },
        {
          "title": "Kiểm thử tài nguyên do test sở hữu",
          "text": "Mỗi test tạo thư mục riêng bằng create_dir và chỉ dọn thư mục vừa tạo thành công. Tên chung trong dự án khiến các test chạy song song giẫm lên nhau. Dữ liệu thử gồm tệp đã có nội dung, tên có khoảng trắng và các lỗi tạo được ổn định trên nền tảng kiểm thử.\n\nBài tập xác nhận chính sách tên báo cáo ASCII gọn, tránh dấu phân cách, thành phần cha, dấu chấm cuối và tên thiết bị DOS phổ biến. Đây là quy tắc sản phẩm hẹp, không thay kiểm tra quyền hoặc bảo vệ trước symlink. Sau khi nhận tên hợp lệ, lớp filesystem vẫn cần thao tác mở đúng hợp đồng."
        }
      ],
      "tip": "Chỉ dọn tệp tạm do thao tác hiện tại tạo ra; tên trông giống tệp tạm không chứng minh bạn sở hữu nó.",
      "exercise": {
        "title": "Xác nhận tên báo cáo",
        "instructions": "Hoàn thiện report_name cho một chính sách tên đầu ra hẹp, dùng chung giữa các nền tảng.",
        "requirements": [
          "Tên dài 1 đến 80 byte, chỉ ASCII chữ, số, chấm, gạch ngang, gạch dưới.",
          "Bắt đầu bằng chữ hoặc số; không kết thúc bằng dấu chấm.",
          "Từ chối stem CON, PRN, AUX, NUL, COM1..9, LPT1..9, không phân biệt hoa thường."
        ]
      },
      "starterCode": "fn report_name(name: &str) -> Result<String, &'static str> {\n    todo!()\n}\nfn main() {\n    assert_eq!(report_name(\"run-01.tsv\"), Ok(String::from(\"run-01.tsv\")));\n    for name in [\"\", \"../report\", \"a/b\", \"a\\\\b\", \".hidden\", \"report.\", \"có-dấu\", \"a b\"] { assert!(report_name(name).is_err(), \"{name}\"); }\n    for name in [\"CON.txt\", \"nul\", \"COM1.tsv\", \"lpt9.log\"] { assert_eq!(report_name(name), Err(\"reserved\")); }\n    assert!(report_name(\"COM10.tsv\").is_ok());\n    assert!(report_name(&\"a\".repeat(81)).is_err());\n    println!(\"Tên hợp lệ: run-01.tsv\");\n}",
      "solutionCode": "fn report_name(name: &str) -> Result<String, &'static str> {\n    if name.is_empty() || name.len() > 80 { return Err(\"name\"); }\n    let bytes = name.as_bytes();\n    if !bytes[0].is_ascii_alphanumeric() || !bytes.iter().all(|b| b.is_ascii_alphanumeric() || b\"._-\".contains(b)) {\n        return Err(\"name\");\n    }\n    if name.ends_with('.') { return Err(\"name\"); }\n    let stem = name.split('.').next().unwrap().to_ascii_uppercase();\n    let device = matches!(stem.as_str(), \"CON\" | \"PRN\" | \"AUX\" | \"NUL\")\n        || ((stem.starts_with(\"COM\") || stem.starts_with(\"LPT\")) && stem.len() == 4 && (b'1'..=b'9').contains(&stem.as_bytes()[3]));\n    if device { return Err(\"reserved\"); }\n    Ok(name.to_owned())\n}\nfn main() {\n    assert_eq!(report_name(\"run-01.tsv\"), Ok(String::from(\"run-01.tsv\")));\n    for name in [\"\", \"../report\", \"a/b\", \"a\\\\b\", \".hidden\", \"report.\", \"có-dấu\", \"a b\"] { assert!(report_name(name).is_err(), \"{name}\"); }\n    for name in [\"CON.txt\", \"nul\", \"COM1.tsv\", \"lpt9.log\"] { assert_eq!(report_name(name), Err(\"reserved\")); }\n    assert!(report_name(\"COM10.tsv\").is_ok());\n    assert!(report_name(&\"a\".repeat(81)).is_err());\n    println!(\"Tên hợp lệ: run-01.tsv\");\n}",
      "expectedOutput": "Tên hợp lệ: run-01.tsv",
      "hints": [
        "Xác nhận toàn bộ byte trước khi so sánh tên thiết bị.",
        "So sánh stem trước dấu chấm; COM10 không thuộc dải COM1..9."
      ],
      "quiz": {
        "question": "Vì sao exists() rồi File::create() không bảo đảm không ghi đè?",
        "options": [
          "File::create chỉ đọc tệp.",
          "Tiến trình khác có thể tạo tệp sau kiểm tra và trước lần mở.",
          "PathBuf chỉ hỗ trợ Linux.",
          "flush tự xóa tệp cũ."
        ],
        "correct": 1,
        "explanation": "Kiểm tra và tạo là hai thao tác. create_new yêu cầu kiểm tra sự tồn tại và tạo tên trong một thao tác của hệ điều hành."
      },
      "reference": {
        "label": "Rust std: OpenOptions::create_new",
        "url": "https://doc.rust-lang.org/std/fs/struct.OpenOptions.html#method.create_new"
      },
      "localLab": {
        "title": "Tạo tệp mới và xuất bản trong thư mục riêng",
        "instructions": "Lab chỉ thao tác trong thư mục tạm tự tạo. write_new bảo vệ tệp đã có nhưng có thể để lại tệp mới dở dang nếu write thất bại. Test rename dùng thư mục riêng không có bên cạnh tranh; không tuyên bố độ bền sau mất điện.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"cli-file-output\"\nversion = \"0.1.0\"\nedition = \"2024\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::{fs::OpenOptions, io::{self, Write}, path::Path};\npub fn write_new(path: &Path, contents: &[u8]) -> io::Result<()> {\n    let mut file = OpenOptions::new().write(true).create_new(true).open(path)?;\n    file.write_all(contents)?;\n    file.sync_all()\n}\n#[cfg(test)]\nmod tests {\n    use super::*;\n    use std::{fs, path::PathBuf, time::{SystemTime, UNIX_EPOCH}};\n    struct Scratch(PathBuf);\n    impl Scratch {\n        fn new() -> Self {\n            let nonce = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos();\n            for attempt in 0..100 {\n                let path = std::env::temp_dir().join(format!(\"learn-rust-cli-{}-{nonce}-{attempt}\", std::process::id()));\n                match fs::create_dir(&path) {\n                    Ok(()) => return Self(path),\n                    Err(e) if e.kind() == io::ErrorKind::AlreadyExists => continue,\n                    Err(e) => panic!(\"create test directory: {e}\"),\n                }\n            }\n            panic!(\"cannot allocate test directory\")\n        }\n    }\n    impl Drop for Scratch { fn drop(&mut self) { let _ = fs::remove_dir_all(&self.0); } }\n    #[test]\n    fn existing_file_is_preserved() {\n        let dir = Scratch::new();\n        let path = dir.0.join(\"report.txt\");\n        write_new(&path, b\"first\").unwrap();\n        let error = write_new(&path, b\"replacement\").unwrap_err();\n        assert_eq!(error.kind(), io::ErrorKind::AlreadyExists);\n        assert_eq!(fs::read(path).unwrap(), b\"first\");\n    }\n    #[test]\n    fn private_staged_file_is_renamed_after_sync() {\n        let dir = Scratch::new();\n        let staged = dir.0.join(\"staged.tmp\");\n        let published = dir.0.join(\"published.txt\");\n        write_new(&staged, b\"complete report\").unwrap();\n        fs::rename(&staged, &published).unwrap();\n        assert!(!staged.exists());\n        assert_eq!(fs::read(published).unwrap(), b\"complete report\");\n    }\n}"
          }
        ],
        "commands": [
          "cargo test"
        ],
        "checks": [
          "Ghi lần hai trả AlreadyExists và giữ nguyên nội dung lần một.",
          "Tệp staged chỉ được đổi tên sau write_all và sync_all thành công.",
          "Test tạo và thu hồi thư mục riêng, không đụng tệp của người dùng."
        ]
      }
    },
    {
      "id": "cli-pipes",
      "moduleId": "track-cli",
      "title": "Pipes, mã thoát và dừng có trật tự",
      "description": "Kết hợp CLI với công cụ khác, báo lỗi đúng kênh và xử lý việc người nhận ngừng đọc.",
      "duration": 45,
      "objectives": [
        "Giữ stdout là dữ liệu, stderr là chẩn đoán",
        "Thiết kế mã thoát ổn định cho script",
        "Xử lý BrokenPipe đúng ngữ cảnh",
        "Tách yêu cầu hủy khỏi công việc dọn dẹp"
      ],
      "sections": [
        {
          "title": "Hai luồng phục vụ hai người nhận",
          "text": "stdout thường nối tới tệp hoặc chương trình khác. Chèn “Đang xử lý…” vào giữa JSON hoặc TSV khiến script nhận dữ liệu hỏng dù terminal có vẻ thân thiện. Dùng stderr cho chẩn đoán và tiến độ; stdout dành cho hợp đồng dữ liệu. Dạng hiển thị cho người và dạng cho máy nên được chọn rõ bằng cờ.\n\nKhi bật màu hoặc progress bar, kiểm tra terminal và tôn trọng tùy chọn tắt màu. Màu không nên là tín hiệu duy nhất về thành công. Hai luồng độc lập: ghi lỗi vào stderr không tự đổi mã thoát, còn mã 0 không chứng minh mọi dòng trước đó đúng định dạng."
        },
        {
          "title": "Mã thoát diễn tả kết quả của lệnh",
          "text": "Chọn bảng mã nhỏ và ghi trong help. Với công cụ tìm kiếm này, 0 nghĩa có kết quả, 1 nghĩa xử lý hợp lệ nhưng không khớp, 2 nghĩa lỗi sử dụng hoặc I/O. Đây là hợp đồng ứng dụng, không phải quy tắc mọi CLI. Tiến trình con bị kết thúc bởi tín hiệu có thể không có status.code() thông thường.\n\nTrả ExitCode từ main để đường thoát bình thường dọn các biến trong phạm vi. process::exit kết thúc ngay và không chạy destructor như khi rời hàm. Xử lý lỗi ở ranh giới main; thư viện nên trả lỗi thay vì tự thoát khiến test hay ứng dụng nhúng không thể quyết định.",
          "code": "fn main() -> std::process::ExitCode {\n    match run() {\n        Ok(true) => std::process::ExitCode::SUCCESS,\n        Ok(false) => std::process::ExitCode::from(1),\n        Err(error) => {\n            eprintln!(\"logscan: {error}\");\n            std::process::ExitCode::from(2)\n        }\n    }\n} // run là hàm nghiệp vụ của ứng dụng."
        },
        {
          "title": "Pipe đóng sớm có thể là chủ đích",
          "text": "Khi nối logscan vào head, head có thể đã nhận đủ và đóng đầu đọc. Lần ghi tiếp theo có thể trả BrokenPipe. println không trả io::Result cho caller; dùng Write và writeln trên stdout.lock() để áp dụng chính sách. Với lệnh xuất các kết quả độc lập, có thể coi người nhận ngừng đọc là kết thúc bình thường và tránh stack trace gây nhiễu.\n\nGiới hạn chính sách đúng ngữ cảnh đầu ra. Đừng biến mọi lỗi I/O thành thành công hoặc bỏ qua lỗi đọc vì cùng ErrorKind. Nếu lệnh cập nhật trạng thái bên ngoài, người nhận ngừng đọc không bảo đảm thao tác đã hoàn tất; việc dừng phải theo hợp đồng của thao tác."
        },
        {
          "title": "Hủy cần một luồng điều khiển rõ ràng",
          "text": "Ctrl+C thường là yêu cầu dừng; API tín hiệu và sự kiện console khác nhau theo hệ điều hành. Dùng thư viện phù hợp để chuyển sự kiện thành cờ hủy hoặc thông điệp. Tránh I/O tùy ý và mutex trong signal handler mức thấp; vòng lặp thông thường kiểm tra cờ ở điểm an toàn rồi dọn tài nguyên.\n\nDừng có trật tự cần ngừng nhận việc, đóng nguồn gửi, giải quyết kết quả còn lại và join worker. Cờ atomic không đánh thức thread đang mắc ở thao tác blocking: cần timeout, đóng kênh hoặc cơ chế đánh thức. Bài tập kiểm tra bảng kết quả; tín hiệu thật cần kiểm thử trong dự án theo nền tảng."
        }
      ],
      "tip": "Giữ nguồn lỗi trong kiểu dữ liệu trước khi chọn mã thoát; không nuốt toàn bộ io::Error chỉ để tránh BrokenPipe.",
      "exercise": {
        "title": "Ánh xạ kết quả CLI",
        "instructions": "Hoàn thiện exit_policy, trả mã thoát và việc có cần in lỗi ra stderr.",
        "requirements": [
          "Có kết quả: (0, false); không khớp: (1, false).",
          "BrokenPipe đầu ra: (0, false) theo hợp đồng lệnh này.",
          "Lỗi đọc, lỗi ghi khác và lỗi tham số: (2, true)."
        ]
      },
      "starterCode": "#[derive(Clone, Copy)]\nenum Fault { BrokenOutputPipe, ReadFailure, WriteFailure, Usage }\nfn exit_policy(result: Result<usize, Fault>) -> (u8, bool) {\n    todo!()\n}\nfn main() {\n    assert_eq!(exit_policy(Ok(3)), (0, false));\n    assert_eq!(exit_policy(Ok(0)), (1, false));\n    assert_eq!(exit_policy(Err(Fault::BrokenOutputPipe)), (0, false));\n    for error in [Fault::ReadFailure, Fault::WriteFailure, Fault::Usage] { assert_eq!(exit_policy(Err(error)), (2, true)); }\n    println!(\"Khớp: 0; không khớp: 1; lỗi: 2\");\n}",
      "solutionCode": "#[derive(Clone, Copy)]\nenum Fault { BrokenOutputPipe, ReadFailure, WriteFailure, Usage }\nfn exit_policy(result: Result<usize, Fault>) -> (u8, bool) {\n    match result {\n        Ok(0) => (1, false),\n        Ok(_) | Err(Fault::BrokenOutputPipe) => (0, false),\n        Err(_) => (2, true),\n    }\n}\nfn main() {\n    assert_eq!(exit_policy(Ok(3)), (0, false));\n    assert_eq!(exit_policy(Ok(0)), (1, false));\n    assert_eq!(exit_policy(Err(Fault::BrokenOutputPipe)), (0, false));\n    for error in [Fault::ReadFailure, Fault::WriteFailure, Fault::Usage] { assert_eq!(exit_policy(Err(error)), (2, true)); }\n    println!(\"Khớp: 0; không khớp: 1; lỗi: 2\");\n}",
      "expectedOutput": "Khớp: 0; không khớp: 1; lỗi: 2",
      "hints": [
        "Xử lý Ok(0) trước Ok(_) tổng quát.",
        "Chỉ BrokenOutputPipe được coi là thành công trong nhóm lỗi."
      ],
      "quiz": {
        "question": "Công cụ nhận stdout đóng pipe khi đã đọc đủ. Cách xử lý đúng là gì?",
        "options": [
          "Bỏ qua mọi lỗi đọc và ghi.",
          "Luôn panic để hiển thị stack trace.",
          "Giữ ngữ cảnh và áp dụng chính sách BrokenPipe của lệnh khi lỗi đến từ đầu ra.",
          "Gửi mọi kết quả còn lại sang stderr."
        ],
        "correct": 2,
        "explanation": "Người nhận dừng đọc có thể bình thường với lệnh xuất dữ liệu, nhưng không khiến các lỗi khác thành công. Chính sách phải khớp hợp đồng CLI."
      },
      "reference": {
        "label": "Rust CLI Book: output",
        "url": "https://rust-cli.github.io/book/tutorial/output.html"
      }
    },
    {
      "id": "cli-parallelism",
      "moduleId": "track-cli",
      "title": "Song song có giới hạn và kết quả ổn định",
      "description": "Tăng thông lượng mà vẫn kiểm soát bộ nhớ, thứ tự đầu ra và đường dừng khi worker thất bại.",
      "duration": 55,
      "objectives": [
        "Phân biệt giới hạn worker và hàng đợi",
        "Giữ thứ tự khi worker hoàn tất khác thứ tự",
        "Thiết kế cancellation và truyền lỗi",
        "Đo hiệu năng trước khi tối ưu"
      ],
      "sections": [
        {
          "title": "Tìm nút thắt trước khi thêm thread",
          "text": "Công cụ lọc log có thể bị giới hạn bởi đĩa, CPU giải mã hoặc writer. Tạo thread cho từng dòng có thể tốn bộ nhớ và thời gian lập lịch mà không tăng tốc. Đo bản release với đầu vào đại diện; ghi kích thước dữ liệu, thiết bị, số worker và cách đo. So sánh cùng kết quả để không đánh đổi tính đúng lấy tốc độ.\n\nChia việc theo tệp hoặc lô đủ lớn giúp giảm chi phí phối hợp. Tệp nhỏ, cache nóng và ổ lưu trữ chậm là những tình huống khác nhau. available_parallelism là gợi ý về mức song song, không hứa mở đúng số thread đó luôn tối ưu."
        },
        {
          "title": "Hai giới hạn tồn tại độc lập",
          "text": "Bốn worker giới hạn việc đang chạy nhưng không giới hạn hàng triệu job đợi trong Vec. Bounded channel hoặc hàng đợi có capacity tạo backpressure: producer chờ hoặc nhận lỗi khi đầy. Cần giới hạn cả kích thước job; capacity theo số phần tử không tự thành ngân sách byte.\n\nstd::sync::mpsc có nhiều sender nhưng một receiver. Không clone receiver như channel MPMC. Có thể dùng dispatcher cấp lô, chia slice cho scoped threads hoặc chọn thư viện phù hợp. Nếu worker chờ gửi kết quả trong khi thread chính chỉ chờ join và chưa đọc kênh, chương trình có thể deadlock. Thiết kế cả hướng cấp việc và hướng nhận kết quả.",
          "code": "use std::sync::mpsc;\nlet (sender, receiver) = mpsc::sync_channel::<String>(8);\n// Khi queue đầy, send chờ consumer.\n// Giới hạn số worker là một quyết định riêng."
        },
        {
          "title": "Thứ tự hoàn thành khác thứ tự dữ liệu",
          "text": "Worker xử lý tệp nhỏ có thể hoàn tất trước worker đọc tệp lớn. Nếu stdout có hợp đồng thứ tự, gắn chỉ số khi tạo job và để một writer sắp xếp kết quả. Điều này cũng tránh dòng từ nhiều worker trộn lẫn. Dữ liệu không cần thứ tự có thể xuất ngay, nhưng người dùng phải chọn hoặc biết chế độ đó.\n\nBộ sắp xếp lại kết quả cũng có thể tăng bộ nhớ vô hạn nếu job đầu tiên rất chậm. Với luồng dài, giới hạn cửa sổ job đang bay và bộ đệm kết quả. Bài tập dùng lô hữu hạn: mỗi chỉ số phải có đúng một lần, không thiếu, trùng hoặc vượt phạm vi."
        },
        {
          "title": "Kết thúc phải thu được cả lỗi và worker",
          "text": "Khi producer lỗi hoặc người dùng hủy, ngừng cấp việc và xác định cách xử lý job đang chạy. Drop tất cả sender báo kết thúc cho receiver; một clone bị giữ quên khiến recv còn đợi. Scoped threads được join trước khi scope trả về, nhưng lỗi logic và panic vẫn cần chính sách quan sát.\n\nĐừng viết test dựa vào việc thread chắc chắn chạy trước sau một sleep ngắn. Dùng channel hoặc barrier dựng thứ tự cần kiểm tra, rồi xác nhận kết quả không phụ thuộc thứ tự hoàn thành. Progress trên stderr nên cập nhật theo nhịp hợp lý: ghi cho từng byte có thể thành nút thắt lớn hơn thuật toán."
        }
      ],
      "tip": "Worker, job đang chờ, kích thước job và bộ đệm sắp thứ tự là bốn ngân sách khác nhau.",
      "exercise": {
        "title": "Ghép kết quả từ worker",
        "instructions": "Hoàn thiện ordered_results để trả kết quả đúng thứ tự chỉ số cho một lô hữu hạn.",
        "requirements": [
          "Nhận đúng total kết quả cho các chỉ số 0..total.",
          "Trùng, thiếu hoặc ngoài khoảng đều trả Err.",
          "Không phụ thuộc thứ tự đến; lô rỗng trả Vec rỗng."
        ]
      },
      "starterCode": "fn ordered_results(total: usize, completed: Vec<(usize, String)>) -> Result<Vec<String>, &'static str> {\n    todo!()\n}\nfn main() {\n    let ordered = ordered_results(3, vec![(2, \"C\".into()), (0, \"A\".into()), (1, \"B\".into())]).unwrap();\n    assert_eq!(ordered, vec![\"A\", \"B\", \"C\"]);\n    assert_eq!(ordered_results(1, vec![]), Err(\"missing\"));\n    assert_eq!(ordered_results(1, vec![(1, \"X\".into())]), Err(\"range\"));\n    assert_eq!(ordered_results(2, vec![(0, \"A\".into()), (0, \"B\".into())]), Err(\"duplicate\"));\n    assert_eq!(ordered_results(0, vec![]), Ok(vec![]));\n    assert_eq!(ordered_results(1, vec![(0, String::new())]), Ok(vec![String::new()]));\n    println!(\"{}\", ordered.join(\" -> \"));\n}",
      "solutionCode": "fn ordered_results(total: usize, completed: Vec<(usize, String)>) -> Result<Vec<String>, &'static str> {\n    let mut slots = vec![None; total];\n    for (index, result) in completed {\n        let slot = slots.get_mut(index).ok_or(\"range\")?;\n        if slot.is_some() { return Err(\"duplicate\"); }\n        *slot = Some(result);\n    }\n    slots.into_iter().map(|item| item.ok_or(\"missing\")).collect()\n}\nfn main() {\n    let ordered = ordered_results(3, vec![(2, \"C\".into()), (0, \"A\".into()), (1, \"B\".into())]).unwrap();\n    assert_eq!(ordered, vec![\"A\", \"B\", \"C\"]);\n    assert_eq!(ordered_results(1, vec![]), Err(\"missing\"));\n    assert_eq!(ordered_results(1, vec![(1, \"X\".into())]), Err(\"range\"));\n    assert_eq!(ordered_results(2, vec![(0, \"A\".into()), (0, \"B\".into())]), Err(\"duplicate\"));\n    assert_eq!(ordered_results(0, vec![]), Ok(vec![]));\n    assert_eq!(ordered_results(1, vec![(0, String::new())]), Ok(vec![String::new()]));\n    println!(\"{}\", ordered.join(\" -> \"));\n}",
      "expectedOutput": "A -> B -> C",
      "hints": [
        "Option<String> phân biệt chưa có kết quả với chuỗi rỗng.",
        "Dùng get_mut xác nhận phạm vi trước khi truy cập slot."
      ],
      "quiz": {
        "question": "Vì sao giới hạn bốn worker chưa đủ giới hạn bộ nhớ?",
        "options": [
          "Rust luôn cấp phát một gigabyte mỗi thread.",
          "Job chờ, kích thước job và kết quả chưa xuất vẫn có thể tăng vô hạn.",
          "Bounded channel không giữ dữ liệu.",
          "Send tự clone mọi giá trị."
        ],
        "correct": 1,
        "explanation": "Worker chỉ giới hạn việc đang chạy. Producer và bước sắp kết quả vẫn có thể giữ nhiều dữ liệu nếu thiếu giới hạn riêng."
      },
      "reference": {
        "label": "Rust std: bounded sync_channel",
        "url": "https://doc.rust-lang.org/std/sync/mpsc/fn.sync_channel.html"
      }
    },
    {
      "id": "cli-shipping",
      "moduleId": "track-cli",
      "title": "Kiểm thử, đóng gói và phát hành CLI",
      "description": "Chứng minh hợp đồng binary, giữ định dạng đầu ra ổn định và chuẩn bị bản phát hành có thể tái hiện.",
      "duration": 50,
      "objectives": [
        "Kiểm thử binary được Cargo build",
        "Quản lý lockfile và artifact theo target",
        "Sinh help và completion từ một định nghĩa",
        "Giữ tương thích định dạng máy"
      ],
      "sections": [
        {
          "title": "Kiểm thử ranh giới tiến trình",
          "text": "Unit test xác nhận thuật toán nhưng không biết main có ghi lỗi vào stdout hoặc trả sai mã thoát. Integration test chạy executable thật, cấp stdin, thu riêng stdout/stderr và kiểm tra status. Cargo cung cấp CARGO_BIN_EXE_<tên binary> cho test tích hợp khi binary được build. Cách này tránh phụ thuộc executable cũ trong PATH.\n\nBộ test cần lệnh hợp lệ, thiếu đối số, đầu vào rỗng, không khớp, UTF-8 sai theo hợp đồng và đường dẫn có khoảng trắng. Đóng đầu ghi stdin để tiến trình con thấy EOF; giữ handle có thể khiến test đợi mãi. Test tệp dùng thư mục riêng và không suy luận thứ tự chạy."
        },
        {
          "title": "Định dạng cho máy cần phiên bản",
          "text": "Bảng đẹp cho người có thể đổi khoảng trắng, nhưng JSON Lines hoặc TSV cho script cần hợp đồng ổn định. Quy định encoding, delimiter, escape newline, thứ tự record, kiểu số và trường thiếu. Phiên bản schema giúp consumer nhận biết định dạng nhưng không tự sửa parser cũ khi bạn đổi ý nghĩa trường.\n\nBài tập định nghĩa TSV với schema_version, id và message. Backslash, tab, LF và CR trong message được escape để mỗi record vẫn nằm trên một dòng. Đây là định dạng riêng có tài liệu, không phải mọi biến thể TSV. Golden test so sánh byte giúp phát hiện thay đổi vô tình trước khi phát hành.",
          "code": "// Trong tests/cli.rs của package có binary tương ứng.\nlet result = std::process::Command::new(env!(\"CARGO_BIN_EXE_linepick\"))\n    .output()?;\n// Kiểm tra status, stdout và stderr theo hợp đồng binary."
        },
        {
          "title": "Bản phát hành gắn với target và dependency",
          "text": "cargo build --release tối ưu binary nhưng không tạo artifact cho mọi hệ điều hành. Chọn target triple, kiểm thử trên nền tảng tương ứng và mô tả dependency hệ thống. Executable Rust vẫn có thể liên kết thư viện động hoặc phụ thuộc libc; đừng hứa mọi binary chạy độc lập trên mọi máy cùng kiến trúc.\n\nVới ứng dụng, commit Cargo.lock và dùng --locked trong CI sau khi tạo lockfile. cargo install mặc định có thể giải lại dependency; --locked dùng lockfile đóng gói nếu có. Lưu phiên bản compiler, target, checksum artifact và lệnh build. Hồ sơ ấy giúp tái hiện lỗi, thay vì chỉ giữ một file nén không rõ nguồn."
        },
        {
          "title": "Tài liệu cũng là tính năng",
          "text": "Sinh help và completion từ cùng định nghĩa clap để cờ mới không bị thiếu trong tài liệu. clap_complete sinh script theo shell; CLI có thể xuất script để người dùng cài vào vị trí họ chọn. Test help không cần đóng băng mọi khoảng trắng, nhưng phải xác nhận cờ quan trọng và ví dụ còn đúng.\n\nTrước phát hành, chạy fmt, Clippy, test và package/dry-run thích hợp; xem danh sách tệp trong package để tránh dữ liệu thử không cần thiết. Changelog nêu thay đổi hợp đồng đầu ra, mã thoát và mặc định. Đăng registry là bước riêng có chủ đích; lab chuẩn bị artifact và test trên máy, không tự đăng package."
        }
      ],
      "tip": "Kiểm thử byte của định dạng máy; kiểm thử ý nghĩa và khả năng đọc của help dành cho người.",
      "exercise": {
        "title": "Xuất báo cáo TSV có hợp đồng",
        "instructions": "Hoàn thiện render_report. Giữ thứ tự đầu vào, thêm header và escape các ký tự phá cấu trúc dòng.",
        "requirements": [
          "Header schema_version, id, message phân cách bằng tab.",
          "Mỗi record có phiên bản 1 và kết thúc bằng LF.",
          "Escape backslash, tab, LF, CR trong message; giữ Unicode còn lại."
        ]
      },
      "starterCode": "fn render_report(items: &[(u64, &str)]) -> String {\n    todo!()\n}\nfn main() {\n    assert_eq!(render_report(&[]), \"schema_version\\tid\\tmessage\\n\");\n    assert_eq!(render_report(&[(7, \"a\\tb\\nc\\r\\\\\")]), \"schema_version\\tid\\tmessage\\n1\\t7\\ta\\\\tb\\\\nc\\\\r\\\\\\\\\\n\");\n    assert_eq!(render_report(&[(0, \"\")]), \"schema_version\\tid\\tmessage\\n1\\t0\\t\\n\");\n    let report = render_report(&[(2, \"Rust an toàn\"), (1, \"CLI\")]);\n    assert_eq!(report, \"schema_version\\tid\\tmessage\\n1\\t2\\tRust an toàn\\n1\\t1\\tCLI\\n\");\n    print!(\"{report}\");\n}",
      "solutionCode": "fn render_report(items: &[(u64, &str)]) -> String {\n    let mut report = String::from(\"schema_version\\tid\\tmessage\\n\");\n    for &(id, message) in items {\n        report.push_str(&format!(\"1\\t{id}\\t\"));\n        for ch in message.chars() {\n            match ch {\n                '\\\\' => report.push_str(\"\\\\\\\\\"),\n                '\\t' => report.push_str(\"\\\\t\"),\n                '\\n' => report.push_str(\"\\\\n\"),\n                '\\r' => report.push_str(\"\\\\r\"),\n                _ => report.push(ch),\n            }\n        }\n        report.push('\\n');\n    }\n    report\n}\nfn main() {\n    assert_eq!(render_report(&[]), \"schema_version\\tid\\tmessage\\n\");\n    assert_eq!(render_report(&[(7, \"a\\tb\\nc\\r\\\\\")]), \"schema_version\\tid\\tmessage\\n1\\t7\\ta\\\\tb\\\\nc\\\\r\\\\\\\\\\n\");\n    assert_eq!(render_report(&[(0, \"\")]), \"schema_version\\tid\\tmessage\\n1\\t0\\t\\n\");\n    let report = render_report(&[(2, \"Rust an toàn\"), (1, \"CLI\")]);\n    assert_eq!(report, \"schema_version\\tid\\tmessage\\n1\\t2\\tRust an toàn\\n1\\t1\\tCLI\\n\");\n    print!(\"{report}\");\n}",
      "expectedOutput": "schema_version\tid\tmessage\n1\t2\tRust an toàn\n1\t1\tCLI",
      "hints": [
        "Duyệt chars thay vì replace nhiều lần để không escape lại ký tự vừa thêm.",
        "Dùng LF thực cho ranh giới record; newline trong message thành backslash và n."
      ],
      "quiz": {
        "question": "cargo install --locked giúp gì khi package có Cargo.lock?",
        "options": [
          "Tự biến binary thành static cho mọi OS.",
          "Giữ dependency trong lockfile đóng gói thay vì mặc định giải lại phiên bản.",
          "Bảo đảm mọi test đã chạy trên máy người dùng.",
          "Mã hóa mã nguồn trước khi cài."
        ],
        "correct": 1,
        "explanation": "--locked giữ resolution trong lockfile. Target, toolchain, cấu hình build và dependency hệ thống vẫn cần quản lý riêng."
      },
      "reference": {
        "label": "Cargo Book: install và lockfile",
        "url": "https://doc.rust-lang.org/cargo/commands/cargo-install.html"
      }
    }
  ]
};
