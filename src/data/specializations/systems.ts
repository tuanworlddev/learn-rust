import type { SpecializationBundle } from "../specialization-types";

export const systemsBundle: SpecializationBundle = {
  "track": {
    "id": "systems",
    "title": "Lập trình hệ thống với Rust",
    "shortTitle": "Hệ thống",
    "description": "Quản lý tài nguyên, tiến trình, bộ nhớ, đồng thời và ranh giới hệ điều hành; chuẩn bị để nghiên cứu Rust for Linux.",
    "outcome": "Xây công cụ hệ thống có giới hạn tài nguyên, đường lỗi rõ ràng và kiểm thử vòng đời; đọc được hợp đồng của một abstraction Rust thấp tầng.",
    "prerequisites": [
      "Ownership, borrowing và Drop",
      "Result, trait và lifetime",
      "Thread, Arc, Mutex và kiểm thử",
      "Kiến thức cơ bản về tiến trình, bộ nhớ và hệ điều hành"
    ],
    "technologies": [
      "std::os",
      "OwnedFd",
      "Atomic",
      "Kbuild",
      "Rust for Linux"
    ],
    "color": "blue",
    "lessonIds": [
      "systems-resource-ownership",
      "systems-processes-io",
      "systems-memory-layout",
      "systems-concurrency-ordering",
      "systems-os-boundaries",
      "systems-kernel-path"
    ],
    "capstone": {
      "title": "Trình giám sát tác vụ có giới hạn tài nguyên",
      "description": "Xây một chương trình user space nhận danh sách tác vụ mẫu, khởi chạy worker có giới hạn, thu kết quả và dừng có kiểm soát. Tách parser và máy trạng thái để có thể kiểm thử độc lập với hệ điều hành.",
      "milestones": [
        {
          "title": "Định nghĩa hợp đồng tác vụ",
          "tasks": [
            "Mô tả input, output, kích thước tối đa và mã lỗi của worker.",
            "Viết parser Result và test dữ liệu rỗng, cắt ngắn, trùng trường, vượt giới hạn."
          ],
          "acceptance": "Đầu vào sai không panic và không khởi chạy worker; bộ test thể hiện đủ các ranh giới đã công bố."
        },
        {
          "title": "Quản lý vòng đời một worker",
          "tasks": [
            "Truyền đối số riêng bằng Command; không ghép shell.",
            "Phân biệt lỗi spawn với exit status; thu stdout/stderr theo giới hạn.",
            "Định nghĩa và kiểm thử chính sách thời hạn, dừng và wait trên mọi đường lỗi."
          ],
          "acceptance": "Một worker thành công, một worker lỗi và một worker vượt thời hạn đều được thu trạng thái; không để con chạy ngoài ý muốn."
        },
        {
          "title": "Giới hạn đồng thời và bộ nhớ",
          "tasks": [
            "Dùng hàng đợi hữu hạn và cấu hình số worker tối đa.",
            "Chọn Mutex/channel cho invariant nhiều trường; chỉ dùng atomic cho chỉ số độc lập.",
            "Khi kết thúc, ngừng nhận việc mới, xử lý hoặc hủy việc còn lại theo chính sách và join toàn bộ thread."
          ],
          "acceptance": "Stress test xác nhận số worker không vượt hạn mức và số tác vụ hoàn tất cộng thất bại bằng số tác vụ đã nhận."
        },
        {
          "title": "Adapter theo nền tảng",
          "tasks": [
            "Giữ mô hình Metrics chung và parser tách khỏi lời gọi hệ điều hành.",
            "Dùng cfg cho các module phụ thuộc Unix/Windows; báo rõ khả năng không hỗ trợ.",
            "Không dùng chuỗi lossy làm khóa đường dẫn hoặc ID chính xác."
          ],
          "acceptance": "Build và chạy kiểm thử trên các nền tảng công bố hỗ trợ; nền tảng chưa hỗ trợ trả lỗi có kiểu thay vì panic."
        },
        {
          "title": "Hồ sơ kỹ thuật và hướng kernel",
          "tasks": [
            "Viết sơ đồ quyền sở hữu, thứ tự shutdown và danh sách invariant.",
            "Đo throughput, peak memory, số descriptor và thời gian shutdown bằng workload có thể lặp.",
            "Tách một máy trạng thái no_std và giải thích các bước còn thiếu nếu đưa vào môi trường kernel."
          ],
          "acceptance": "Người khác chạy được dự án từ README, tái hiện bài đo và phân biệt rõ phần user space đã làm với phần nghiên cứu kernel."
        }
      ],
      "deliverables": [
        "Mã nguồn Cargo, Cargo.lock và README chạy dự án",
        "Unit/integration test cho parser, worker và shutdown",
        "Sơ đồ quyền sở hữu tài nguyên và mô tả giao thức đồng bộ",
        "Báo cáo đo có workload, cấu hình và giới hạn",
        "Thư viện logic no_std cùng ghi chú đối chiếu sample kernel"
      ],
      "reviewQuestions": [
        "Vì sao Drop của File, Child và JoinHandle có các hậu quả khác nhau?",
        "Tại sao bộ đếm vé dùng Relaxed được nhưng cờ công bố buffer cần lập luận khác?",
        "Nếu worker ghi stderr vô hạn, supervisor xử lý thế nào để không deadlock hoặc hết RAM?",
        "repr(C) có giải quyết endian và dữ liệu bị cắt ngắn không?",
        "Phần nào của dự án có thể tái sử dụng trong no_std và phần nào phụ thuộc hệ điều hành?"
      ]
    },
    "resources": [
      {
        "label": "Rust std · OwnedFd",
        "url": "https://doc.rust-lang.org/std/os/fd/struct.OwnedFd.html"
      },
      {
        "label": "Rust std · Child",
        "url": "https://doc.rust-lang.org/std/process/struct.Child.html"
      },
      {
        "label": "Rustonomicon · Atomics",
        "url": "https://doc.rust-lang.org/nomicon/atomics.html"
      },
      {
        "label": "Rustonomicon · FFI",
        "url": "https://doc.rust-lang.org/nomicon/ffi.html"
      },
      {
        "label": "Linux Kernel · Rust Quick Start",
        "url": "https://docs.kernel.org/rust/quick-start.html"
      },
      {
        "label": "Linux Kernel · Rust General Information",
        "url": "https://docs.kernel.org/rust/general-information.html"
      }
    ]
  },
  "lessons": [
    {
      "id": "systems-resource-ownership",
      "moduleId": "track-systems",
      "title": "RAII và vòng đời tài nguyên hệ thống",
      "description": "Gắn tài nguyên với một chủ sở hữu, giải phóng đúng lúc và phân biệt cleanup với hoàn tất I/O.",
      "duration": 45,
      "objectives": [
        "Thiết kế guard có đúng một chủ sở hữu tài nguyên.",
        "Phân biệt Drop, flush, sync và thao tác đóng có thể báo lỗi.",
        "Nhận biết trường hợp destructor không được chạy."
      ],
      "sections": [
        {
          "title": "Tài nguyên là một quyền sử dụng có thời hạn",
          "text": "Một dịch vụ hệ thống giữ nhiều thứ hơn bộ nhớ: tệp đang mở, socket, khóa, tiến trình con và chỗ trống trong hàng đợi. Với mỗi thứ, hãy trả lời ai chịu trách nhiệm kết thúc quyền sử dụng, ai chỉ được mượn, và thao tác nào có thể thất bại. RAII gắn quyền đó vào một giá trị; constructor chỉ trả về giá trị khi đã nhận được tài nguyên, còn destructor dọn phần tài nguyên thuộc về nó. Nếu khởi tạo gồm nhiều bước, các giá trị đã tạo thành công sẽ tự dọn khi một bước sau trả lỗi. Thiết kế này làm đường lỗi dễ kiểm tra hơn việc rải nhiều lời gọi close."
        },
        {
          "title": "Move giữ một chủ sở hữu, borrow giữ ranh giới",
          "text": "Di chuyển một guard sang biến khác không có nghĩa là giải phóng rồi mở lại tài nguyên. Nó chuyển trách nhiệm cuối cùng sang nơi nhận. Một hàm chỉ đọc tệp nên nhận tham chiếu hoặc kiểu mượn descriptor thay vì lấy quyền sở hữu. Với Unix, OwnedFd sở hữu descriptor còn BorrowedFd mang lifetime của lần mượn. Không tạo hai OwnedFd từ cùng một số nguyên: cả hai sẽ nghĩ mình phải đóng descriptor đó. Khi hệ điều hành tái sử dụng số descriptor, lần đóng sai thậm chí có thể ảnh hưởng tài nguyên khác. Muốn có handle mới, dùng thao tác sao chép handle có kiểm tra lỗi.",
          "code": "fn inspect(file: &std::fs::File) -> std::io::Result<u64> {\n    Ok(file.metadata()?.len())\n}"
        },
        {
          "title": "Dọn tài nguyên không đồng nghĩa dữ liệu đã bền vững",
          "text": "Drop không trả Result cho bên gọi. Vì vậy một API ghi dữ liệu quan trọng cần có bước hoàn tất rõ ràng để người gọi xử lý lỗi trước khi guard hết phạm vi. flush chuyển dữ liệu qua lớp đệm phần mềm theo hợp đồng của writer; nó không tự hứa rằng dữ liệu đã nằm bền vững trên thiết bị. File::sync_all yêu cầu đồng bộ cả dữ liệu và metadata theo khả năng hệ điều hành. Lỗi của thao tác đóng trong destructor File bị bỏ qua. Tách các bước ghi, hoàn tất và dọn tài nguyên giúp bài kiểm thử xác định chính xác lỗi nào được báo ra ngoài."
        },
        {
          "title": "Thiết kế guard để đường lỗi cũng đúng",
          "text": "Bài tập dùng một bộ đếm chỗ tài nguyên trên một luồng. acquire từ chối khi hết chỗ; Permit tăng bộ đếm đúng một lần và giảm đúng một lần khi bị hủy. Rc<Cell<_>> ở đây cố ý chỉ dùng trên một luồng, không phải semaphore cho nhiều thread. Hãy kiểm thử cả move, scope lồng nhau và giới hạn bằng không. Đừng để Drop panic trong khi một panic khác đang unwind. Cũng không xây tính đúng đắn quan trọng dựa trên giả định destructor luôn chạy: mem::forget, process::exit, abort hoặc việc tiến trình bị dừng đột ngột có thể bỏ qua cleanup thông thường."
        }
      ],
      "tip": "Ưu tiên dùng các kiểu sở hữu sẵn có như File, OwnedFd và MutexGuard trước khi viết wrapper unsafe.",
      "exercise": {
        "title": "Giới hạn tài nguyên bằng Permit",
        "instructions": "Hoàn thiện acquire và Drop để không vượt hạn mức và trả lại chỗ khi chủ sở hữu bị hủy.",
        "requirements": [
          "Không triển khai Clone hoặc Copy cho Permit.",
          "acquire trả None nếu active >= limit.",
          "Di chuyển Permit không làm thay đổi số chỗ đang giữ.",
          "Sau khi mọi Permit được hủy, bộ đếm bằng 0."
        ]
      },
      "starterCode": "use std::cell::Cell;\nuse std::rc::Rc;\n\nstruct Permit { active: Rc<Cell<usize>> }\nimpl Drop for Permit { fn drop(&mut self) { todo!(\"Trả lại một chỗ\"); } }\nfn acquire(active: &Rc<Cell<usize>>, limit: usize) -> Option<Permit> {\n    todo!(\"Kiểm tra hạn mức rồi tạo Permit\")\n}\n\nfn main() {\n    let active = Rc::new(Cell::new(0));\n    let first = acquire(&active, 2).unwrap();\n    {\n        let second = acquire(&active, 2).unwrap();\n        assert!(acquire(&active, 2).is_none());\n        let moved = second;\n        assert_eq!(active.get(), 2);\n        drop(moved);\n        assert_eq!(active.get(), 1);\n    }\n    drop(first);\n    assert_eq!(active.get(), 0);\n    assert!(acquire(&active, 0).is_none());\n    println!(\"Số tài nguyên còn giữ: {}\", active.get());\n}\n",
      "solutionCode": "use std::cell::Cell;\nuse std::rc::Rc;\n\nstruct Permit { active: Rc<Cell<usize>> }\n\nimpl Drop for Permit {\n    fn drop(&mut self) { self.active.set(self.active.get() - 1); }\n}\nfn acquire(active: &Rc<Cell<usize>>, limit: usize) -> Option<Permit> {\n    if active.get() >= limit { return None; }\n    active.set(active.get() + 1);\n    Some(Permit { active: Rc::clone(active) })\n}\n\nfn main() {\n    let active = Rc::new(Cell::new(0));\n    let first = acquire(&active, 2).unwrap();\n    {\n        let second = acquire(&active, 2).unwrap();\n        assert!(acquire(&active, 2).is_none());\n        let moved = second;\n        assert_eq!(active.get(), 2);\n        drop(moved);\n        assert_eq!(active.get(), 1);\n    }\n    drop(first);\n    assert_eq!(active.get(), 0);\n    assert!(acquire(&active, 0).is_none());\n    println!(\"Số tài nguyên còn giữ: {}\", active.get());\n}\n",
      "expectedOutput": "Số tài nguyên còn giữ: 0",
      "hints": [
        "Rc::clone chỉ chia sẻ bộ đếm; Permit vẫn chỉ có một chủ sở hữu.",
        "Kiểm tra hạn mức trước khi tăng bộ đếm; Drop giảm đúng một đơn vị."
      ],
      "quiz": {
        "question": "Một writer đã được drop. Có thể khẳng định dữ liệu đã được đồng bộ bền vững ra thiết bị không?",
        "options": [
          "Có, mọi Drop đều tự gọi fsync.",
          "Không; cần phân biệt cleanup với flush/sync và xử lý lỗi hoàn tất.",
          "Có, nếu chương trình dùng ownership.",
          "Không, nên luôn dùng mem::forget."
        ],
        "correct": 1,
        "explanation": "Ownership quản lý vòng đời; độ bền dữ liệu là hợp đồng I/O riêng. Bước sync có thể thất bại và cần được kiểm tra trước khi chỉ còn cleanup."
      },
      "reference": {
        "label": "Rust std · Drop và quản lý tài nguyên",
        "url": "https://doc.rust-lang.org/std/ops/trait.Drop.html"
      }
    },
    {
      "id": "systems-processes-io",
      "moduleId": "track-systems",
      "title": "Tiến trình con, descriptor và luồng I/O",
      "description": "Khởi chạy chương trình với đối số rõ ràng, thu kết quả và quản lý vòng đời tiến trình con.",
      "duration": 50,
      "objectives": [
        "Tách lỗi không khởi chạy được khỏi exit status không thành công.",
        "Truyền đối số mà không tự ghép lệnh shell.",
        "Tránh deadlock khi sử dụng stdout/stderr có bộ đệm hữu hạn."
      ],
      "sections": [
        {
          "title": "Command xây cấu hình, Child đại diện cho tiến trình",
          "text": "Command là cấu hình để khởi chạy: chương trình, đối số, thư mục làm việc, môi trường và các luồng chuẩn. spawn thành công chỉ cho biết đã tạo được tiến trình; nghiệp vụ bên trong vẫn có thể thất bại. Vì vậy có hai tầng lỗi: io::Error khi khởi chạy và ExitStatus sau khi tiến trình kết thúc. Đừng trộn chúng thành một thông báo chung. Hãy trả về ngữ cảnh đủ để người vận hành biết không tìm thấy executable, thiếu quyền, hay chương trình con đã chạy rồi báo thất bại. Một exit status cũng không luôn có mã số thông thường trên mọi hệ điều hành."
        },
        {
          "title": "Đối số là dữ liệu, không phải một chuỗi lệnh",
          "text": "Command::arg truyền một đối số riêng. Tên tệp có khoảng trắng không cần tự thêm dấu nháy; việc thêm dấu nháy có thể làm chính dấu đó trở thành dữ liệu. Đừng chuyển sang sh -c chỉ để nối chuỗi cho tiện. Khi ứng dụng thật cần shell, đó là một giao diện và ngữ pháp khác cần thiết kế riêng. Bài tập chỉ tạo Command và kiểm tra get_args nên không khởi chạy tiến trình từ web. Ở dự án Cargo, chương trình chạy một chế độ con của chính executable để bài thực hành không phụ thuộc lệnh tiện ích ngoài.",
          "code": "let mut command = std::process::Command::new(\"worker\");\ncommand.arg(\"--input\").arg(\"báo cáo quý 1.txt\");"
        },
        {
          "title": "Ống có dung lượng hữu hạn",
          "text": "Nếu stdout hoặc stderr là pipe, tiến trình con có thể bị chặn khi bộ đệm đầy. Tiến trình cha vừa chờ con kết thúc vừa không đọc pipe có thể gây deadlock. output thu các luồng để trả về khi xong, phù hợp ví dụ nhỏ có đầu ra giới hạn; nhưng giữ toàn bộ đầu ra trong bộ nhớ không phù hợp log vô hạn. Với worker dài hạn, đọc các luồng liên tục, giới hạn số byte lưu và quy định hành vi khi đầu ra quá lớn. Nếu con chờ stdin kết thúc, cha cần đóng đầu ghi khi đã gửi xong dữ liệu."
        },
        {
          "title": "Drop của Child không dừng worker",
          "text": "Child không có destructor tự kill hoặc wait. Bỏ handle không làm tiến trình con tự kết thúc; trên Unix, không thu exit status có thể để lại zombie. Một supervisor cần chính sách thời hạn, dừng có kiểm soát và bước wait cuối cùng. Đóng descriptor cũng khác hủy tiến trình. Dự án mẫu dùng output cho tác vụ hữu hạn và kiểm tra UTF-8 cùng kiểu số của đầu ra. Khi nâng cấp thành dịch vụ, bổ sung giới hạn thời gian, kích thước đầu ra và cơ chế thu dọn trên từng đường lỗi; không dùng sleep cố định để đoán rằng worker đã hoàn thành."
        }
      ],
      "tip": "Một handle RAII không nhất thiết dừng công việc nền: luôn đọc hợp đồng vòng đời của chính kiểu đó.",
      "exercise": {
        "title": "Giữ nguyên ranh giới đối số",
        "instructions": "Tạo cấu hình chạy worker với hai đối số --input và đường dẫn. Không thực sự spawn trong bài này.",
        "requirements": [
          "Chương trình là worker.",
          "Đường dẫn chứa khoảng trắng vẫn là một đối số.",
          "Không dùng shell hoặc tách chuỗi bằng whitespace.",
          "Đóng stdin bằng Stdio::null."
        ]
      },
      "starterCode": "use std::process::{Command, Stdio};\nfn worker_command(path: &str) -> Command { todo!(\"Tạo Command bằng các đối số riêng\") }\n\nfn main() {\n    let command = worker_command(\"báo cáo quý 1.txt\");\n    let args: Vec<_> = command.get_args().map(|s| s.to_string_lossy().into_owned()).collect();\n    assert_eq!(command.get_program(), std::ffi::OsStr::new(\"worker\"));\n    assert_eq!(args, [\"--input\", \"báo cáo quý 1.txt\"]);\n    let special = worker_command(\"data; echo unwanted\");\n    assert_eq!(special.get_args().count(), 2);\n    println!(\"Số đối số: {}\", args.len());\n    println!(\"Đường dẫn: {}\", args[1]);\n}\n",
      "solutionCode": "use std::process::{Command, Stdio};\nfn worker_command(path: &str) -> Command {\n    let mut command = Command::new(\"worker\");\n    command.arg(\"--input\").arg(path).stdin(Stdio::null());\n    command\n}\n\nfn main() {\n    let command = worker_command(\"báo cáo quý 1.txt\");\n    let args: Vec<_> = command.get_args().map(|s| s.to_string_lossy().into_owned()).collect();\n    assert_eq!(command.get_program(), std::ffi::OsStr::new(\"worker\"));\n    assert_eq!(args, [\"--input\", \"báo cáo quý 1.txt\"]);\n    let special = worker_command(\"data; echo unwanted\");\n    assert_eq!(special.get_args().count(), 2);\n    println!(\"Số đối số: {}\", args.len());\n    println!(\"Đường dẫn: {}\", args[1]);\n}\n",
      "expectedOutput": "Số đối số: 2\nĐường dẫn: báo cáo quý 1.txt",
      "hints": [
        "Tạo Command mutable rồi gọi arg hai lần.",
        "get_args cho phép kiểm tra cấu hình mà chưa chạy chương trình."
      ],
      "quiz": {
        "question": "Sau khi Command::spawn trả Ok(child), nhận định nào đúng?",
        "options": [
          "Tiến trình đã hoàn thành thành công.",
          "Drop child sẽ tự kill và wait.",
          "Đã khởi chạy được; vẫn phải thu và kiểm tra trạng thái kết thúc.",
          "stdout chắc chắn là UTF-8."
        ],
        "correct": 2,
        "explanation": "spawn trả handle của tiến trình. Kết quả nghiệp vụ và trạng thái kết thúc chỉ được biết qua các bước chờ/thu kết quả; đầu ra là byte."
      },
      "reference": {
        "label": "Rust std · Command",
        "url": "https://doc.rust-lang.org/std/process/struct.Command.html"
      },
      "localLab": {
        "title": "Chạy worker của chính executable",
        "instructions": "Tạo dự án Cargo trên Linux, macOS hoặc Windows. Hai chế độ cha/con chỉ trao đổi một số nhỏ qua stdout; không đọc hay sửa tệp của người dùng.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"systems-process-lab\"\nversion = \"0.1.0\"\nedition = \"2024\"\nrust-version = \"1.85\"\n"
          },
          {
            "path": "src/main.rs",
            "content": "use std::{env, io, process::Command};\n\nfn parse_total(bytes: &[u8]) -> Result<u64, Box<dyn std::error::Error>> {\n    Ok(std::str::from_utf8(bytes)?.trim().parse()?)\n}\nfn main() -> Result<(), Box<dyn std::error::Error>> {\n    if env::args().nth(1).as_deref() == Some(\"--child\") {\n        println!(\"{}\", (1_u64..=10).sum::<u64>());\n        return Ok(());\n    }\n    let output = Command::new(env::current_exe()?).arg(\"--child\").output()?;\n    if !output.status.success() {\n        return Err(io::Error::other(format!(\"worker failed: {}\", output.status)).into());\n    }\n    let total = parse_total(&output.stdout)?;\n    assert_eq!(total, 55);\n    println!(\"Tổng từ tiến trình con: {total}\");\n    Ok(())\n}\n#[cfg(test)]\nmod tests {\n    use super::parse_total;\n    #[test] fn parses_line() { assert_eq!(parse_total(b\"55\\n\").unwrap(), 55); }\n    #[test] fn rejects_invalid_output() { assert!(parse_total(b\"not-a-number\").is_err()); }\n}\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run --quiet"
        ],
        "checks": [
          "Hai unit test phân tích đầu ra thành công.",
          "Chương trình in “Tổng từ tiến trình con: 55”.",
          "Thử đổi đầu ra chế độ --child thành chữ và quan sát lỗi parse được trả về."
        ]
      }
    },
    {
      "id": "systems-memory-layout",
      "moduleId": "track-systems",
      "title": "Bố cục bộ nhớ và hợp đồng unsafe",
      "description": "Đọc dữ liệu nhị phân bằng ranh giới rõ ràng; chỉ dùng unsafe khi chứng minh được bất biến.",
      "duration": 55,
      "objectives": [
        "Phân biệt layout trong bộ nhớ và định dạng lưu trên đĩa.",
        "Kiểm tra độ dài, endian, alignment và giá trị hợp lệ.",
        "Viết hợp đồng safety cho một wrapper thấp tầng."
      ],
      "sections": [
        {
          "title": "Một struct không tự trở thành định dạng tệp",
          "text": "Bố cục của kiểu bao gồm kích thước, alignment và offset của trường. Với repr(Rust), không nên dựa vào thứ tự vật lý của các trường. repr(C) dùng các quy tắc layout tương thích C theo target, nhưng vẫn có thể có padding và khác biệt ABI. Nó không tự quy định endian hay biến mọi tổ hợp byte thành giá trị Rust hợp lệ. Vì thế ghi toàn bộ vùng nhớ của một struct ra tệp thường là một giao thức kém rõ ràng. Hãy mô tả từng trường theo số byte và thứ tự byte để dữ liệu có thể được đọc trên kiến trúc khác."
        },
        {
          "title": "Bắt đầu bằng slice và chuyển đổi tường minh",
          "text": "Bài này có header tám byte: hai byte magic, một byte version, một byte flags và bốn byte độ dài little-endian. Kiểm tra header đủ dài trước khi tạo khoảng 4..8. Sau đó dùng u32::from_le_bytes thay vì ép một con trỏ byte thành con trỏ struct. Kiểm tra phép cộng offset với chiều dài bằng checked_add và quy định rõ có cho byte thừa hay không. Cách tiếp cận này tách lỗi dữ liệu khỏi lỗi truy cập bộ nhớ. Một parser tốt từ chối đầu vào không hợp lệ bằng Result, thay vì phụ thuộc vào panic do chỉ số ngoài phạm vi.",
          "code": "let length = u32::from_le_bytes([3, 0, 0, 0]);\nlet end = 8_usize.checked_add(length as usize);\nassert_eq!(end, Some(11));"
        },
        {
          "title": "Unsafe là nghĩa vụ chứng minh, không phải bỏ kiểm tra",
          "text": "Khi phải nhận con trỏ từ C, một lời gọi from_raw_parts cần nhiều điều kiện cùng đúng: vùng nhớ thuộc một allocation, đủ dài, alignment đúng, giá trị đã khởi tạo và tồn tại suốt lifetime của slice. Con trỏ của slice rỗng cũng phải khác null và thỏa alignment. Kiểm tra ptr != null không chứng minh được khả năng đọc hoặc quyền sở hữu. Wrapper an toàn phải gắn lifetime với nguồn sở hữu thực tế, che raw pointer khỏi caller khi có thể và giải thích ai có quyền thay đổi vùng nhớ. Thêm unsafe chỉ vì một benchmark trông chậm là chưa đủ lý do."
        },
        {
          "title": "Đánh giá một abstraction thấp tầng",
          "text": "Review nên bắt đầu từ hợp đồng công khai: caller được truyền gì và wrapper bảo đảm điều gì sau khi trả về. Tiếp theo liệt kê cách từng field được khởi tạo, di chuyển và dọn, kể cả đường lỗi. Test các vùng trống, giá trị biên, phiên bản lạ và dữ liệu bị cắt ở từng vị trí. Với unsafe thực sự, công cụ kiểm tra động và Miri có thể tìm một số vi phạm, nhưng một lần chạy qua không thay cho chứng minh. Trong bài tập này ta chọn lời giải safe hoàn toàn vì slice đã diễn tả đúng quyền truy cập cần thiết; đó là một quyết định thiết kế có chủ đích."
        }
      ],
      "tip": "repr(C) mô tả layout theo ABI; giao thức nhị phân vẫn cần endian, version và quy tắc độ dài riêng.",
      "exercise": {
        "title": "Giải mã header có kiểm tra",
        "instructions": "Trả slice payload của bản tin RS phiên bản 1; flags phải bằng 0, độ dài phải khớp toàn bộ phần còn lại.",
        "requirements": [
          "Từ chối header ngắn hơn 8 byte.",
          "Kiểm tra magic, version và flags.",
          "Đọc chiều dài u32 little-endian và kiểm tra phép cộng.",
          "Không cấp phát và không dùng unsafe."
        ]
      },
      "starterCode": "fn payload(bytes: &[u8]) -> Result<&[u8], &'static str> { todo!(\"Kiểm tra header rồi mượn payload\") }\n\nfn main() {\n    let valid = [b'R', b'S', 1, 0, 3, 0, 0, 0, 10, 20, 30];\n    assert_eq!(payload(&valid), Ok(&[10, 20, 30][..]));\n    assert!(payload(&valid[..7]).is_err());\n    assert!(payload(&valid[..10]).is_err());\n    let empty = [b'R', b'S', 1, 0, 0, 0, 0, 0];\n    assert_eq!(payload(&empty), Ok(&[][..]));\n    let mut bad = valid; bad[3] = 1;\n    assert!(payload(&bad).is_err());\n    println!(\"Payload: {:?}\", payload(&valid).unwrap());\n}\n",
      "solutionCode": "fn payload(bytes: &[u8]) -> Result<&[u8], &'static str> {\n    if bytes.len() < 8 { return Err(\"header thiếu\"); }\n    if &bytes[..2] != b\"RS\" || bytes[2] != 1 || bytes[3] != 0 {\n        return Err(\"header không hợp lệ\");\n    }\n    let len = u32::from_le_bytes(bytes[4..8].try_into().unwrap());\n    let len = usize::try_from(len).map_err(|_| \"độ dài quá lớn\")?;\n    let end = 8_usize.checked_add(len).ok_or(\"tràn độ dài\")?;\n    if end != bytes.len() { return Err(\"độ dài không khớp\"); }\n    Ok(&bytes[8..end])\n}\n\nfn main() {\n    let valid = [b'R', b'S', 1, 0, 3, 0, 0, 0, 10, 20, 30];\n    assert_eq!(payload(&valid), Ok(&[10, 20, 30][..]));\n    assert!(payload(&valid[..7]).is_err());\n    assert!(payload(&valid[..10]).is_err());\n    let empty = [b'R', b'S', 1, 0, 0, 0, 0, 0];\n    assert_eq!(payload(&empty), Ok(&[][..]));\n    let mut bad = valid; bad[3] = 1;\n    assert!(payload(&bad).is_err());\n    println!(\"Payload: {:?}\", payload(&valid).unwrap());\n}\n",
      "expectedOutput": "Payload: [10, 20, 30]",
      "hints": [
        "Kiểm tra bytes.len() trước mọi khoảng chỉ số.",
        "Dùng from_le_bytes, try_from, checked_add; trả &bytes[8..end] khi end == bytes.len()."
      ],
      "quiz": {
        "question": "Vì sao không thể đọc tùy ý một &[u8] thành &Header chỉ bằng repr(C)?",
        "options": [
          "repr(C) tự cấp phát vùng nhớ mới.",
          "Vẫn phải thỏa alignment, độ dài, tính hợp lệ giá trị và quy tắc giao thức.",
          "repr(C) luôn loại bỏ padding.",
          "Rust không có số nguyên little-endian."
        ],
        "correct": 1,
        "explanation": "repr(C) không kiểm tra con trỏ, không bảo đảm mọi bit pattern hợp lệ và không định nghĩa wire format. Đọc từng trường thường rõ và an toàn hơn."
      },
      "reference": {
        "label": "Rust Reference · Type layout",
        "url": "https://doc.rust-lang.org/reference/type-layout.html"
      }
    },
    {
      "id": "systems-concurrency-ordering",
      "moduleId": "track-systems",
      "title": "Đồng thời, backpressure và memory ordering",
      "description": "Chọn Mutex, channel hoặc atomic theo bất biến cần bảo vệ; thiết kế kết thúc công việc nền.",
      "duration": 60,
      "objectives": [
        "Giải thích vì sao nhiều atomic không tự tạo một giao dịch.",
        "Dùng Relaxed cho bộ đếm độc lập và hiểu điều kiện Acquire/Release.",
        "Thiết kế hàng đợi hữu hạn và thu tất cả worker trước khi kết thúc."
      ],
      "sections": [
        {
          "title": "Chọn primitive theo bất biến",
          "text": "Trước khi chọn mutex hay atomic, viết điều phải luôn đúng. Nếu số dư và nhật ký phải thay đổi cùng nhau, hai AtomicUsize không tự bảo vệ được quan hệ đó. Mutex có thể bảo vệ một struct chứa cả hai trường, miễn mọi đường truy cập tuân theo cùng giao thức. Channel hữu ích khi muốn một worker sở hữu trạng thái và nhận yêu cầu qua thông điệp. Atomic hợp với một giá trị có chuyển trạng thái độc lập, hoặc một giao thức đồng bộ đã được chứng minh. Tránh thay khóa bằng nhiều cờ chỉ để bỏ chữ lock khỏi mã."
        },
        {
          "title": "Relaxed vẫn nguyên tử nhưng không công bố dữ liệu khác",
          "text": "fetch_add với Relaxed không làm mất phép tăng cùng một atomic, nhưng không hứa công bố những vùng nhớ khác. Bài tập cấp số vé duy nhất, chỉ quan tâm giá trị của bộ đếm nên dùng Relaxed là đủ. Tuy nhiên load rồi kiểm tra rồi fetch_add là hai bước riêng: nhiều thread có thể cùng thấy còn chỗ và vượt hạn mức. fetch_update thực hiện vòng compare-and-exchange để chỉ nhận chuyển trạng thái hợp lệ. Closure có thể chạy nhiều lần nên không ghi log nghiệp vụ hoặc thực hiện side effect không thể lặp ở trong đó."
        },
        {
          "title": "Acquire và Release tạo quan hệ khi đọc đúng lần công bố",
          "text": "Giả sử producer ghi dữ liệu rồi store một cờ bằng Release. Consumer load cờ bằng Acquire và quan sát giá trị đến từ lần store đó có quan hệ đồng bộ cần thiết để thấy các ghi trước nó. Chỉ đặt hai từ Acquire và Release ở hai chỗ bất kỳ là chưa đủ; phải chứng minh lần đọc liên quan đến lần ghi nào, kể cả trường hợp tái sử dụng bộ đệm. SeqCst bổ sung thứ tự toàn cục cho các thao tác thuộc nhóm đó, nhưng không sửa một invariant nghiệp vụ bị chia thành nhiều bước. Với dữ liệu phức tạp, ưu tiên Mutex hoặc channel trước khi tự thiết kế cấu trúc lock-free.",
          "code": "use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};\nlet data = AtomicUsize::new(0);\nlet ready = AtomicBool::new(false);\ndata.store(42, Ordering::Relaxed);\nready.store(true, Ordering::Release);\nif ready.load(Ordering::Acquire) {\n    assert_eq!(data.load(Ordering::Relaxed), 42);\n}"
        },
        {
          "title": "Hàng đợi và shutdown là một phần thuật toán",
          "text": "Một producer nhanh hơn consumer sẽ tích lũy bộ nhớ nếu hàng đợi không giới hạn. sync_channel có dung lượng hữu hạn buộc producer chờ khi đầy; đó là backpressure, không phải lỗi cần bỏ bằng cách tăng vô hạn. Khi producer kết thúc và mọi sender được drop, receiver có thể đọc nốt rồi kết thúc vòng lặp. Sau đó phải join các thread để thu lỗi và kết quả. Drop JoinHandle chỉ detach thread, không chờ nó. Dự án Cargo dùng channel hai phần tử, xử lý mười tác vụ và kiểm tra tổng sau khi cả hai thread được join; kết quả không dựa vào thời gian sleep hay thứ tự lịch chạy."
        }
      ],
      "tip": "Bài kiểm thử đồng thời nên kiểm tra bất biến và kết quả sau join, không so sánh thứ tự log phụ thuộc scheduler.",
      "exercise": {
        "title": "Cấp vé duy nhất trong hạn mức",
        "instructions": "Hoàn thiện reserve để nhiều thread chỉ cấp các vé 0..limit-1, mỗi vé đúng một lần.",
        "requirements": [
          "Trả giá trị cũ làm số vé khi cập nhật thành công.",
          "Khi hết vé, không thay đổi counter.",
          "Không dùng load rồi tăng như hai bước tách rời.",
          "Không cần SeqCst vì không dùng vé để công bố dữ liệu khác."
        ]
      },
      "starterCode": "use std::sync::atomic::{AtomicUsize, Ordering};\nfn reserve(counter: &AtomicUsize, limit: usize) -> Option<usize> { todo!(\"Cập nhật nguyên tử có điều kiện\") }\n\nfn main() {\n    let counter = AtomicUsize::new(0);\n    let mut tickets = std::thread::scope(|scope| {\n        let mut handles = Vec::new();\n        for _ in 0..4 {\n            let counter = &counter;\n            handles.push(scope.spawn(move || {\n                (0..3).filter_map(|_| reserve(counter, 7)).collect::<Vec<_>>()\n            }));\n        }\n        handles.into_iter().flat_map(|handle| handle.join().unwrap()).collect::<Vec<_>>()\n    });\n    tickets.sort_unstable();\n    assert_eq!(tickets, (0..7).collect::<Vec<_>>());\n    assert_eq!(counter.load(Ordering::Relaxed), 7);\n    assert_eq!(reserve(&counter, 7), None);\n    assert_eq!(reserve(&AtomicUsize::new(0), 0), None);\n    println!(\"Vé đã cấp: {:?}\", tickets);\n}\n",
      "solutionCode": "use std::sync::atomic::{AtomicUsize, Ordering};\nfn reserve(counter: &AtomicUsize, limit: usize) -> Option<usize> {\n    counter.fetch_update(Ordering::Relaxed, Ordering::Relaxed, |current| {\n        if current < limit { Some(current + 1) } else { None }\n    }).ok()\n}\n\nfn main() {\n    let counter = AtomicUsize::new(0);\n    let mut tickets = std::thread::scope(|scope| {\n        let mut handles = Vec::new();\n        for _ in 0..4 {\n            let counter = &counter;\n            handles.push(scope.spawn(move || {\n                (0..3).filter_map(|_| reserve(counter, 7)).collect::<Vec<_>>()\n            }));\n        }\n        handles.into_iter().flat_map(|handle| handle.join().unwrap()).collect::<Vec<_>>()\n    });\n    tickets.sort_unstable();\n    assert_eq!(tickets, (0..7).collect::<Vec<_>>());\n    assert_eq!(counter.load(Ordering::Relaxed), 7);\n    assert_eq!(reserve(&counter, 7), None);\n    assert_eq!(reserve(&AtomicUsize::new(0), 0), None);\n    println!(\"Vé đã cấp: {:?}\", tickets);\n}\n",
      "expectedOutput": "Vé đã cấp: [0, 1, 2, 3, 4, 5, 6]",
      "hints": [
        "fetch_update trả Ok(giá trị cũ) khi closure chọn Some(giá trị mới).",
        "Nếu current >= limit, closure trả None. current + 1 không tràn khi current < limit."
      ],
      "quiz": {
        "question": "Một atomic counter dùng Relaxed tăng đủ số lần. Điều đó tự bảo đảm điều gì?",
        "options": [
          "Mọi ghi vào struct khác đều đã được công bố.",
          "Các phép cập nhật trên chính atomic có tính nguyên tử; quan hệ với bộ nhớ khác cần giao thức riêng.",
          "Nhiều atomic luôn thay đổi như một transaction.",
          "Thread sẽ tự join khi handle bị drop."
        ],
        "correct": 1,
        "explanation": "Relaxed bảo đảm nguyên tử cho thao tác nhưng không tạo quan hệ Acquire/Release cho dữ liệu khác. Join hoặc primitive đồng bộ phải được xét riêng."
      },
      "reference": {
        "label": "Rust std · Atomic memory ordering",
        "url": "https://doc.rust-lang.org/std/sync/atomic/enum.Ordering.html"
      },
      "localLab": {
        "title": "Pipeline có hàng đợi hữu hạn",
        "instructions": "Tạo Cargo project chạy trên Linux, macOS hoặc Windows. Producer và consumer làm việc với dữ liệu mẫu; channel dung lượng 2 thể hiện backpressure.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"systems-queue-lab\"\nversion = \"0.1.0\"\nedition = \"2024\"\nrust-version = \"1.85\"\n"
          },
          {
            "path": "src/main.rs",
            "content": "use std::sync::{atomic::{AtomicUsize, Ordering}, mpsc::sync_channel};\n\nfn main() {\n    let count = AtomicUsize::new(0);\n    let total = std::thread::scope(|scope| {\n        let (sender, receiver) = sync_channel::<u64>(2);\n        let producer = scope.spawn(move || {\n            for n in 0..10 { sender.send(n).expect(\"consumer alive\"); }\n        });\n        let count_ref = &count;\n        let consumer = scope.spawn(move || {\n            let mut total = 0;\n            for n in receiver {\n                total += n;\n                count_ref.fetch_add(1, Ordering::Relaxed);\n            }\n            total\n        });\n        producer.join().unwrap();\n        consumer.join().unwrap()\n    });\n    assert_eq!(count.load(Ordering::Relaxed), 10);\n    assert_eq!(total, 45);\n    println!(\"Đã xử lý 10 tác vụ; tổng = {total}\");\n}\n"
          }
        ],
        "commands": [
          "cargo run --quiet",
          "cargo clippy --all-targets -- -D warnings"
        ],
        "checks": [
          "Kết quả là 10 tác vụ và tổng 45.",
          "Thay dung lượng channel thành 0; chương trình vẫn hoàn thành nhờ rendezvous giữa hai thread.",
          "Giải thích vì sao receiver kết thúc sau khi producer rời scope và sender cuối cùng bị hủy."
        ]
      }
    },
    {
      "id": "systems-os-boundaries",
      "moduleId": "track-systems",
      "title": "API hệ điều hành và tính khả chuyển",
      "description": "Tách lõi xử lý khỏi adapter nền tảng; giữ khác biệt Unix, Windows và FFI ở ranh giới nhỏ.",
      "duration": 50,
      "objectives": [
        "Dùng cfg để chọn code theo target mà không làm hỏng nền tảng khác.",
        "Phân biệt descriptor Unix với handle Windows.",
        "Giữ dữ liệu ngoài hệ thống ở dạng byte/OsString khi chưa bảo đảm Unicode."
      ],
      "sections": [
        {
          "title": "Lõi dùng mô hình chung, adapter hiểu nền tảng",
          "text": "Một công cụ giám sát có thể cần số thread, bộ nhớ và trạng thái tiến trình. Nguồn dữ liệu trên Linux, macOS và Windows khác nhau; đường dẫn /proc không phải giao diện chung cho mọi hệ điều hành. Hãy đặt một kiểu Metrics ổn định ở lõi và viết adapter chuyển dữ liệu của từng nền tảng sang kiểu đó. Các lỗi như quyền bị từ chối, tiến trình đã kết thúc hoặc tính năng không hỗ trợ nên có ý nghĩa riêng. Lõi có thể được kiểm thử bằng dữ liệu mẫu mà không phụ thuộc máy đang chạy test."
        },
        {
          "title": "cfg chọn mã được biên dịch",
          "text": "#[cfg(unix)] loại hẳn một item khỏi bản build khi target không thỏa điều kiện. Ngược lại cfg!(unix) tạo giá trị bool; mã trong hai nhánh if vẫn phải hợp lệ để type-check. Vì vậy không đặt use std::os::unix trong một nhánh if cfg! rồi mong build Windows tự bỏ lỗi. Có thể đặt module backend riêng dưới cfg và công khai cùng một hàm qua API ổn định. Phân biệt host đang build với target sẽ chạy, đặc biệt khi cross compile. Kiểm thử ít nhất trên từng nhóm nền tảng được công bố hỗ trợ.",
          "code": "#[cfg(unix)]\nfn platform_family() -> &'static str { \"unix\" }\n#[cfg(windows)]\nfn platform_family() -> &'static str { \"windows\" }\n#[cfg(not(any(unix, windows)))]\nfn platform_family() -> &'static str { \"other\" }"
        },
        {
          "title": "Descriptor, handle và quyền sở hữu",
          "text": "Trên Unix, descriptor là một số nguyên trong bảng của tiến trình; kiểu OwnedFd diễn tả quyền đóng nó, còn BorrowedFd diễn tả lần mượn. Sao chép descriptor bằng try_clone tạo handle mới nhưng vẫn có thể chia sẻ open-file description và vị trí đọc. Đừng giả định hai File tương ứng sẽ đọc ở hai offset độc lập. Trên Windows, mô hình handle có các quy tắc khác và Rust cung cấp các kiểu riêng. Raw handle chỉ phù hợp ở ranh giới API cần nó. Khi phải gọi C, kiểm tra chữ ký, ABI, cách trả lỗi và yêu cầu thread safety thay vì chỉ chép tên hàm."
        },
        {
          "title": "Không biến lỗi biểu diễn thành mất dữ liệu",
          "text": "Tên tệp và đối số hệ điều hành không luôn là UTF-8. Dùng Path, PathBuf, OsStr hoặc OsString qua các ranh giới tương ứng; to_string_lossy phù hợp hiển thị có chấp nhận thay thế ký tự, không phù hợp làm khóa định danh chính xác. Bài tập dùng định dạng metrics văn bản đã định nghĩa là UTF-8 để tập trung vào hợp đồng adapter: khóa bắt buộc, không trùng, số không âm và thread lớn hơn không. Khi viết adapter thật, parser dữ liệu cần tách khỏi thao tác đọc hệ điều hành; như vậy dữ liệu bị thiếu hoặc bị cắt có thể được kiểm thử bằng unit test nhỏ."
        }
      ],
      "tip": "Đưa khác biệt nền tảng vào module adapter; giữ nghiệp vụ và parser độc lập để kiểm thử được trên nhiều máy.",
      "exercise": {
        "title": "Chuẩn hóa dữ liệu adapter",
        "instructions": "Đọc định dạng mẫu gồm rss_bytes và threads, mỗi khóa một lần. Trả tuple đã kiểm tra thay vì mặc định lỗi về số 0.",
        "requirements": [
          "Bắt buộc đủ hai khóa.",
          "rss_bytes là u64, threads là u32 lớn hơn 0.",
          "Từ chối khóa lạ, khóa trùng hoặc dòng không có dấu =.",
          "Không phụ thuộc /proc hay API nền tảng để chạy bài web."
        ]
      },
      "starterCode": "fn parse_metrics(text: &str) -> Result<(u64, u32), &'static str> { todo!(\"Phân tích và kiểm tra hai khóa\") }\n\nfn main() {\n    let input = \"rss_bytes=4096\\nthreads=3\\n\";\n    assert_eq!(parse_metrics(input), Ok((4096, 3)));\n    assert!(parse_metrics(\"rss_bytes=-1\\nthreads=3\").is_err());\n    assert!(parse_metrics(\"rss_bytes=1\\nthreads=3\\nthreads=4\").is_err());\n    assert!(parse_metrics(\"rss_bytes=1\").is_err());\n    assert!(parse_metrics(\"rss_bytes=1\\nthreads=0\").is_err());\n    println!(\"RSS: {} byte; thread: {}\", parse_metrics(input).unwrap().0, parse_metrics(input).unwrap().1);\n}\n",
      "solutionCode": "fn parse_metrics(text: &str) -> Result<(u64, u32), &'static str> {\n    let (mut rss, mut threads) = (None, None);\n    for line in text.lines() {\n        let (key, value) = line.split_once('=').ok_or(\"sai cú pháp\")?;\n        match key {\n            \"rss_bytes\" if rss.is_none() => rss = Some(value.parse::<u64>().map_err(|_| \"rss sai\")?),\n            \"threads\" if threads.is_none() => threads = Some(value.parse::<u32>().map_err(|_| \"threads sai\")?),\n            _ => return Err(\"khóa lạ hoặc trùng\"),\n        }\n    }\n    let threads = threads.filter(|n| *n > 0).ok_or(\"thiếu threads hợp lệ\")?;\n    Ok((rss.ok_or(\"thiếu rss\")?, threads))\n}\n\nfn main() {\n    let input = \"rss_bytes=4096\\nthreads=3\\n\";\n    assert_eq!(parse_metrics(input), Ok((4096, 3)));\n    assert!(parse_metrics(\"rss_bytes=-1\\nthreads=3\").is_err());\n    assert!(parse_metrics(\"rss_bytes=1\\nthreads=3\\nthreads=4\").is_err());\n    assert!(parse_metrics(\"rss_bytes=1\").is_err());\n    assert!(parse_metrics(\"rss_bytes=1\\nthreads=0\").is_err());\n    println!(\"RSS: {} byte; thread: {}\", parse_metrics(input).unwrap().0, parse_metrics(input).unwrap().1);\n}\n",
      "expectedOutput": "RSS: 4096 byte; thread: 3",
      "hints": [
        "Dùng Option cho từng trường để phân biệt vắng mặt và giá trị 0.",
        "Match khóa kèm điều kiện field.is_none() để phát hiện trùng."
      ],
      "quiz": {
        "question": "Để bỏ hẳn đoạn mã chỉ có std::os::unix khỏi build Windows, nên dùng gì?",
        "options": [
          "if cfg!(unix) quanh mọi lời gọi.",
          "#[cfg(unix)] trên item hoặc module tương ứng.",
          "Đổi lỗi thành unwrap.",
          "Chuyển mọi đường dẫn thành String."
        ],
        "correct": 1,
        "explanation": "Thuộc tính cfg điều khiển việc item có được biên dịch hay không. cfg! chỉ tạo bool; nó không tự loại các lỗi kiểu trong nhánh còn lại."
      },
      "reference": {
        "label": "Rust Reference · Conditional compilation",
        "url": "https://doc.rust-lang.org/reference/conditional-compilation.html"
      },
      "localLab": {
        "title": "Mượn và sao chép descriptor Unix",
        "instructions": "Chạy trên Linux hoặc macOS. Chương trình chỉ đọc Cargo.toml trong chính dự án và minh họa vị trí đọc được chia sẻ giữa hai descriptor. Nhánh khác nền tảng chỉ thông báo phạm vi bài thực hành.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"systems-fd-lab\"\nversion = \"0.1.0\"\nedition = \"2024\"\nrust-version = \"1.85\"\n"
          },
          {
            "path": "src/main.rs",
            "content": "#[cfg(unix)]\nfn main() -> std::io::Result<()> {\n    use std::{fs::File, io::{Read, Seek}, os::fd::{AsFd, AsRawFd, OwnedFd}};\n    let owned: OwnedFd = File::open(\"Cargo.toml\")?.into();\n    let borrowed = owned.as_fd();\n    assert!(borrowed.as_raw_fd() >= 0);\n    let duplicate = owned.try_clone()?;\n    let mut reader = File::from(duplicate);\n    let mut text = String::new();\n    reader.read_to_string(&mut text)?;\n    assert!(text.contains(\"[package]\"));\n    let mut original = File::from(owned);\n    assert_eq!(original.stream_position()?, text.len() as u64);\n    println!(\"Hai descriptor cùng chia sẻ vị trí đọc.\");\n    Ok(())\n}\n#[cfg(not(unix))]\nfn main() { println!(\"Bài thực hành descriptor này dành cho Linux/macOS.\"); }\n"
          }
        ],
        "commands": [
          "cargo run --quiet",
          "cargo clippy --all-targets -- -D warnings"
        ],
        "checks": [
          "Linux/macOS in “Hai descriptor cùng chia sẻ vị trí đọc.”",
          "Không có from_raw_fd hoặc close thủ công.",
          "Giải thích vì sao BorrowedFd không được sống lâu hơn OwnedFd nguồn."
        ]
      }
    },
    {
      "id": "systems-kernel-path",
      "moduleId": "track-systems",
      "title": "Từ no_std đến Rust for Linux",
      "description": "Hiểu ranh giới user space, kernel space và quy trình Kbuild trước khi nghiên cứu driver.",
      "duration": 60,
      "objectives": [
        "Phân biệt no_std library với kernel module thực sự.",
        "Đọc yêu cầu toolchain theo đúng phiên bản cây nguồn Linux.",
        "Tách logic trạng thái có thể kiểm thử khỏi callback và tài nguyên kernel."
      ],
      "sections": [
        {
          "title": "Rust trong kernel có môi trường thực thi khác",
          "text": "Một chương trình user space dùng std để nhờ hệ điều hành cấp tài nguyên. Mã trong kernel hoạt động bên trong hệ điều hành nên không thể dùng std theo cách đó. Rust for Linux sử dụng core cùng các abstraction của cây nguồn kernel; chọn thư viện và API phải theo môi trường đó. no_std tắt liên kết std, nhưng tự nó không tạo driver, không cho quyền truy cập thiết bị và không giải quyết ngắt hoặc đồng bộ. Một thư viện no_std chạy unit test trên host vẫn chỉ là thư viện được kiểm thử bằng harness của host."
        },
        {
          "title": "Dùng quy trình của cây nguồn, không thay bằng cargo run",
          "text": "Bản kernel cụ thể có yêu cầu về rustc, LLVM, bindgen và cấu hình hỗ trợ. Bắt đầu từ Quick Start của đúng phiên bản cây nguồn và chạy make LLVM=1 rustavailable để xem yêu cầu còn thiếu. Quy trình biên dịch kernel do Kbuild điều phối; không lấy Cargo.toml của ứng dụng rồi đổi tên thành module. Tài liệu API kernel cũng nên được đọc theo tag hoặc sinh từ cùng cây nguồn và cấu hình. Bài học không cố định một bộ lệnh cài kernel chung cho mọi máy vì kiến trúc, phiên bản và môi trường build khác nhau."
        },
        {
          "title": "Thiết kế logic để review được trước khi đụng phần cứng",
          "text": "Một driver phải xử lý probe, hoạt động, lỗi khởi tạo từng phần, dừng và giải phóng tài nguyên. Tách máy trạng thái hoặc bộ giải mã thuần khỏi callback giúp kiểm thử các chuyển trạng thái không hợp lệ mà chưa cần thiết bị. Trong bài tập, không cho shutdown lúc Busy; đây là chính sách mẫu buộc hoàn tất tác vụ trước khi dừng, không phải quy tắc chung cho mọi driver. Dự án thật có thể chọn hủy tác vụ với một giao thức khác. Điều cần giữ là chuyển trạng thái, quyền sở hữu tài nguyên và hành vi trên lỗi phải nhất quán.",
          "code": "#![no_std]\n\npub fn valid_block_length(length: usize, capacity: usize) -> bool {\n    length > 0 && length <= capacity\n}"
        },
        {
          "title": "Các câu hỏi cần trả lời khi đọc mã kernel",
          "text": "Callback có thể ngủ hay chạy trong ngữ cảnh không được ngủ? Khóa nào bảo vệ trạng thái và thứ tự lấy khóa là gì? Ai giữ thiết bị sống khi công việc bất đồng bộ còn tham chiếu đến nó? Khi khởi tạo thất bại ở giữa, phần đã đăng ký được gỡ theo thứ tự nào? Không suy luận các câu trả lời từ API std có tên tương tự. Sau khi xây lõi có test, chọn một sample của đúng cây nguồn, đọc cùng abstraction nó sử dụng rồi ghi lại hợp đồng. Thực hành kernel nên bắt đầu trong môi trường thử nghiệm riêng; dự án Cargo dưới đây chỉ hoàn thành bước logic no_std trên host."
        }
      ],
      "tip": "Biên dịch được no_std là một bước chuẩn bị; một driver còn phải tuân theo vòng đời, ngữ cảnh thực thi và abstraction của kernel.",
      "exercise": {
        "title": "Máy trạng thái cho một tác vụ thiết bị",
        "instructions": "Chỉ cho Offline → Ready → Busy → Ready → Stopped theo các event tương ứng; từ chối mọi chuyển khác.",
        "requirements": [
          "Start chỉ hợp lệ từ Offline.",
          "Submit chỉ hợp lệ từ Ready; Finish chỉ từ Busy.",
          "Shutdown chỉ từ Ready, không tự hủy tác vụ đang chạy.",
          "Stopped là trạng thái kết thúc của ví dụ."
        ]
      },
      "starterCode": "#[derive(Debug, Clone, Copy, PartialEq, Eq)]\nenum State { Offline, Ready, Busy, Stopped }\n#[derive(Clone, Copy)]\nenum Event { Start, Submit, Finish, Shutdown }\nfn transition(state: State, event: Event) -> Result<State, &'static str> {\n    todo!(\"Match cặp trạng thái và sự kiện\")\n}\n\nfn main() {\n    use Event::*;\n    use State::*;\n    let mut state = Offline;\n    for event in [Start, Submit, Finish, Shutdown] {\n        state = transition(state, event).unwrap();\n    }\n    assert_eq!(state, Stopped);\n    assert_eq!(transition(Offline, Submit), Err(\"chuyển trạng thái không hợp lệ\"));\n    assert_eq!(transition(Busy, Shutdown), Err(\"chuyển trạng thái không hợp lệ\"));\n    assert_eq!(transition(Stopped, Start), Err(\"chuyển trạng thái không hợp lệ\"));\n    println!(\"Trạng thái cuối: {:?}\", state);\n}\n",
      "solutionCode": "#[derive(Debug, Clone, Copy, PartialEq, Eq)]\nenum State { Offline, Ready, Busy, Stopped }\n#[derive(Clone, Copy)]\nenum Event { Start, Submit, Finish, Shutdown }\nfn transition(state: State, event: Event) -> Result<State, &'static str> {\n    use Event::*;\n    use State::*;\n    match (state, event) {\n        (Offline, Start) => Ok(Ready),\n        (Ready, Submit) => Ok(Busy),\n        (Busy, Finish) => Ok(Ready),\n        (Ready, Shutdown) => Ok(Stopped),\n        _ => Err(\"chuyển trạng thái không hợp lệ\"),\n    }\n}\n\nfn main() {\n    use Event::*;\n    use State::*;\n    let mut state = Offline;\n    for event in [Start, Submit, Finish, Shutdown] {\n        state = transition(state, event).unwrap();\n    }\n    assert_eq!(state, Stopped);\n    assert_eq!(transition(Offline, Submit), Err(\"chuyển trạng thái không hợp lệ\"));\n    assert_eq!(transition(Busy, Shutdown), Err(\"chuyển trạng thái không hợp lệ\"));\n    assert_eq!(transition(Stopped, Start), Err(\"chuyển trạng thái không hợp lệ\"));\n    println!(\"Trạng thái cuối: {:?}\", state);\n}\n",
      "expectedOutput": "Trạng thái cuối: Stopped",
      "hints": [
        "Match trên (state, event), không chỉ trên event.",
        "Các nhánh không được liệt kê đều trả cùng một lỗi."
      ],
      "quiz": {
        "question": "Một crate có #![no_std] và cargo test thành công đã là Linux kernel module chưa?",
        "options": [
          "Rồi, no_std tự tạo module.",
          "Chưa; còn quy trình Kbuild, API kernel, cấu hình và hợp đồng vòng đời của kernel.",
          "Rồi, nếu không có dependency.",
          "Chưa, chỉ cần thêm std là đủ."
        ],
        "correct": 1,
        "explanation": "no_std chỉ thay đổi môi trường thư viện. Kernel module phải được tích hợp và xây theo cây nguồn/kernel API thích hợp; host unit test chỉ kiểm tra phần logic."
      },
      "reference": {
        "label": "Linux Kernel · Rust Quick Start",
        "url": "https://docs.kernel.org/rust/quick-start.html"
      },
      "localLab": {
        "title": "Tách lõi máy trạng thái no_std",
        "instructions": "Tạo thư viện Cargo trên host để kiểm thử logic không cấp phát. Đây là lõi tái sử dụng, chưa phải kernel module hay driver.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"systems-device-core\"\nversion = \"0.1.0\"\nedition = \"2024\"\nrust-version = \"1.85\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "#![no_std]\n\n#[derive(Debug, Clone, Copy, PartialEq, Eq)]\npub enum State { Offline, Ready, Busy, Stopped }\n#[derive(Clone, Copy)]\npub enum Event { Start, Submit, Finish, Shutdown }\n\npub fn transition(state: State, event: Event) -> Option<State> {\n    use Event::*;\n    use State::*;\n    match (state, event) {\n        (Offline, Start) => Some(Ready),\n        (Ready, Submit) => Some(Busy),\n        (Busy, Finish) => Some(Ready),\n        (Ready, Shutdown) => Some(Stopped),\n        _ => None,\n    }\n}\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test] fn completes_one_job() {\n        let ready = transition(State::Offline, Event::Start).unwrap();\n        let busy = transition(ready, Event::Submit).unwrap();\n        assert_eq!(transition(busy, Event::Finish), Some(State::Ready));\n    }\n    #[test] fn rejects_shutdown_while_busy() {\n        assert_eq!(transition(State::Busy, Event::Shutdown), None);\n    }\n}\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo check --lib",
          "cargo clippy --all-targets -- -D warnings"
        ],
        "checks": [
          "Hai unit test đi qua chu trình hợp lệ và từ chối shutdown khi Busy.",
          "Thư viện không dùng std, allocator hoặc I/O hệ điều hành.",
          "Ghi lại cách ánh xạ event của lõi sang vòng đời một sample kernel trước khi tích hợp."
        ]
      }
    }
  ]
};
