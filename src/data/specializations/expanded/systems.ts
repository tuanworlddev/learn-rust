import type { TrackExpansion } from "../../specialization-types";

export const systemsExpansion: TrackExpansion = {
  "chapters": [
    {
      "id": "systems-ownership",
      "title": "Tài nguyên, lỗi và shutdown",
      "description": "Giữ hợp đồng khi thao tác thành công hoặc thất bại.",
      "lessonIds": [
        "systems-resource-ownership",
        "systems-error-boundaries",
        "systems-shutdown-contract"
      ],
      "outcomes": [
        "Mô tả trạng thái sau lỗi và cleanup.",
        "Ngừng nhận việc trước drain/reap."
      ]
    },
    {
      "id": "systems-processes",
      "title": "Process và I/O có giới hạn",
      "description": "Quản lý pipe, framing và deadline thực.",
      "lessonIds": [
        "systems-processes-io",
        "systems-partial-io",
        "systems-supervisor-project"
      ],
      "outcomes": [
        "Xử lý read/write từng phần.",
        "Thu hồi direct child và log có trần."
      ]
    },
    {
      "id": "systems-memory",
      "title": "Layout và dữ liệu trên disk",
      "description": "Tách representation khỏi định dạng bền vững.",
      "lessonIds": [
        "systems-memory-layout",
        "systems-layout-alignment",
        "systems-file-journal-project"
      ],
      "outcomes": [
        "Chứng minh alignment và invariant unsafe.",
        "Phân biệt torn tail với record corrupt."
      ]
    },
    {
      "id": "systems-concurrency",
      "title": "Đồng thời và phân phối công việc",
      "description": "Dùng primitive theo invariant và giới hạn tải.",
      "lessonIds": [
        "systems-concurrency-ordering",
        "systems-worker-fairness",
        "systems-memory-publication"
      ],
      "outcomes": [
        "Giới hạn worker lẫn backlog.",
        "Giải thích publication, ownership và ordering."
      ]
    },
    {
      "id": "systems-platform",
      "title": "Biên OS và dịch vụ cục bộ",
      "description": "Viết adapter có quyền, protocol và deadline rõ.",
      "lessonIds": [
        "systems-os-boundaries",
        "systems-ipc-framing",
        "systems-daemon-project"
      ],
      "outcomes": [
        "Kiểm tra frame/request/trust boundary.",
        "Xây Unix socket service và kế hoạch adapter khác."
      ]
    },
    {
      "id": "systems-review",
      "title": "Kernel, chẩn đoán và bàn giao",
      "description": "Đánh giá vòng đời và bằng chứng hiệu năng.",
      "lessonIds": [
        "systems-kernel-path",
        "systems-kernel-lifetimes",
        "systems-performance-diagnostics"
      ],
      "outcomes": [
        "Review teardown/context trước kernel adapter.",
        "Đo workload mà giữ đúng durability/giới hạn."
      ]
    }
  ],
  "lessons": [
    {
      "id": "systems-error-boundaries",
      "moduleId": "track-systems",
      "title": "Lỗi hệ thống và trạng thái sau thất bại",
      "description": "Thiết kế Result giữ được nguyên nhân, tác động đã xảy ra và khả năng thử lại.",
      "duration": 50,
      "objectives": [
        "Thiết kế Result giữ được nguyên nhân, tác động đã xảy ra và khả năng thử lại.",
        "Phân biệt Interrupted và WouldBlock.",
        "Khi hết ngân sách, mọi lỗi đều dừng retry."
      ],
      "sections": [
        {
          "title": "Lỗi có ý nghĩa tại từng ranh giới",
          "text": "Một thao tác ghi có thể thất bại vì đường dẫn không tồn tại, thiếu quyền, hết dung lượng hoặc thiết bị I/O lỗi. Gom mọi trường hợp thành false làm caller không biết hành động tiếp theo. Ở adapter hệ điều hành, giữ io::Error hoặc mã gốc cùng ngữ cảnh thao tác. Ở API nghiệp vụ, chuyển sang lỗi có kiểu như InvalidConfig, Conflict hoặc StorageUnavailable khi đó là hợp đồng cần ổn định. Thông báo hiển thị không nên là dữ liệu mà chương trình phải parse để quyết định retry."
        },
        {
          "title": "Thất bại không chứng minh chưa có tác động",
          "text": "write_all có thể ghi một phần rồi trả lỗi; gửi request có thể timeout sau khi phía nhận đã xử lý. Vì vậy mỗi API cần nói trạng thái sau lỗi: không thay đổi, có thể thay đổi một phần hoặc chưa xác định. Nếu muốn đảm bảo không thay đổi, chuẩn bị dữ liệu ở vùng tạm rồi commit tại điểm rõ ràng. Nếu không thể rollback, trả đủ ngữ cảnh để recovery kiểm tra trạng thái thật. Không tự chạy lại một thao tác không idempotent chỉ vì ErrorKind nhìn có vẻ tạm thời."
        },
        {
          "title": "Phân loại retry cùng giới hạn thời gian",
          "text": "Interrupted thường là tín hiệu thử lại thao tác I/O theo hợp đồng của API. WouldBlock trong chế độ nonblocking nghĩa là chưa sẵn sàng, cần chờ readiness thay vì quay vòng bận. PermissionDenied thường cần thay đổi cấu hình/quyền, không được sửa bằng hàng nghìn lần gọi lại. Backoff và deadline tổng phải đi cùng phân loại lỗi. Đếm số lần thử và giới hạn tài nguyên; không tạo task mới cho mỗi retry trong khi task trước chưa kết thúc. Giữ error source để chẩn đoán nhưng không đưa đường dẫn nhạy cảm vào mọi thông báo người dùng.",
          "code": "fn policy(kind: std::io::ErrorKind, attempts_left: u8) -> &'static str {\n    if attempts_left == 0 { return \"stop\"; }\n    match kind { std::io::ErrorKind::Interrupted => \"retry\", std::io::ErrorKind::WouldBlock => \"wait\", _ => \"stop\" }\n}"
        },
        {
          "title": "Thực hành trạng thái có thể kiểm chứng",
          "text": "Bài tập phân loại một tập lỗi thành RetryNow, WaitReady hoặc Stop, đồng thời từ chối retry khi ngân sách đã hết. Trong Cargo, dùng writer giả để tạo short write, Interrupted rồi thành công và lỗi sau một số byte. Test phải kiểm tra cả dữ liệu đã ghi, không chỉ Result. Với file, log hoặc process, thêm ca lỗi cleanup và xác định lỗi nào được trả nếu cả việc chính lẫn cleanup đều lỗi. Tài liệu hợp đồng cần nói caller được làm gì tiếp theo. Đây là nền tảng để xây supervisor và journal mà không che trạng thái hỏng dưới một thông báo chung. Giữ nguyên bằng chứng về tác động đã xảy ra."
        }
      ],
      "tip": "write_all cố ghi đủ bằng nhiều lần write; lỗi không rollback các byte đã được ghi.",
      "exercise": {
        "title": "Lỗi hệ thống và trạng thái sau thất bại",
        "instructions": "Thiết kế Result giữ được nguyên nhân, tác động đã xảy ra và khả năng thử lại.",
        "requirements": [
          "Phân biệt Interrupted và WouldBlock.",
          "Khi hết ngân sách, mọi lỗi đều dừng retry."
        ]
      },
      "starterCode": "fn policy(kind: std::io::ErrorKind, attempts_left: u8) -> &'static str { todo!() }\nfn main() {\nuse std::io::ErrorKind::*;\nassert_eq!(policy(Interrupted, 1), \"retry\");\nassert_eq!(policy(WouldBlock, 1), \"wait\");\nassert_eq!(policy(PermissionDenied, 5), \"stop\");\nassert_eq!(policy(Interrupted, 0), \"stop\");\nprintln!(\"WouldBlock: {}\", policy(WouldBlock, 1));\n}",
      "solutionCode": "fn policy(kind: std::io::ErrorKind, attempts_left: u8) -> &'static str {\n    if attempts_left == 0 { return \"stop\"; }\n    match kind { std::io::ErrorKind::Interrupted => \"retry\", std::io::ErrorKind::WouldBlock => \"wait\", _ => \"stop\" }\n}\nfn main() {\nuse std::io::ErrorKind::*;\nassert_eq!(policy(Interrupted, 1), \"retry\");\nassert_eq!(policy(WouldBlock, 1), \"wait\");\nassert_eq!(policy(PermissionDenied, 5), \"stop\");\nassert_eq!(policy(Interrupted, 0), \"stop\");\nprintln!(\"WouldBlock: {}\", policy(WouldBlock, 1));\n}",
      "expectedOutput": "WouldBlock: wait",
      "hints": [
        "Phân biệt Interrupted và WouldBlock.",
        "write_all cố ghi đủ bằng nhiều lần write; lỗi không rollback các byte đã được ghi."
      ],
      "quiz": {
        "question": "write_all trả lỗi có bảo đảm chưa byte nào được ghi không?",
        "options": ["Có, all có nghĩa giao dịch nguyên tử.", "Có nếu buffer là slice.", "Không; có thể đã ghi một phần trước lỗi."],
        "correct": 2,
        "explanation": "write_all cố ghi đủ bằng nhiều lần write; lỗi không rollback các byte đã được ghi."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/io/trait.Write.html"
      }
    },
    {
      "id": "systems-shutdown-contract",
      "moduleId": "track-systems",
      "title": "Shutdown có thứ tự và tài nguyên được thu hồi",
      "description": "Định nghĩa ngừng nhận việc, xử lý phần đang chạy và kết thúc worker trước khi thoát.",
      "duration": 50,
      "objectives": [
        "Định nghĩa ngừng nhận việc, xử lý phần đang chạy và kết thúc worker trước khi thoát.",
        "Chỉ Running chấp nhận việc mới.",
        "Chỉ Draining không còn việc mới chuyển Stopped."
      ],
      "sections": [
        {
          "title": "Thoát process không phải kế hoạch cleanup",
          "text": "Một service cần biết những việc nào được chấp nhận trước khi dừng và kết quả của chúng sẽ ra sao. Shutdown thường có các pha Running, Draining và Stopped. Khi chuyển Draining, ngừng nhận việc mới, đóng producer hoặc đánh dấu queue rồi cho worker hoàn tất phần đã nhận trong thời hạn. Hết hạn thì chuyển sang hủy theo chính sách được công bố. Nếu chỉ đặt một cờ stop rồi thoát main, thread hoặc process con có thể vẫn giữ dữ liệu chưa flush và caller không biết công việc đã được lưu hay chưa."
        },
        {
          "title": "Đóng đúng đầu tài nguyên để tránh chờ nhau",
          "text": "Consumer chờ recv đến khi tất cả sender biến mất; một sender clone bị giữ quên khiến join không kết thúc. Process con chờ EOF stdin trong khi parent chờ exit tạo vòng chờ nếu parent chưa đóng pipe. Socket có thể cần shutdown một chiều để báo gửi xong nhưng vẫn đọc phản hồi. Lập sơ đồ ai giữ đầu đọc/ghi, khi nào drop và ai join. RAII giúp đóng tài nguyên khi owner mất, nhưng không tự chọn đúng thứ tự nghiệp vụ hay trả kết quả cleanup có thể thất bại."
        },
        {
          "title": "Cleanup có hai đường: tường minh và dự phòng",
          "text": "Phương thức close hoặc finish trả Result để caller biết flush, sync hoặc wait thành công. Drop làm dự phòng tốt nhất có thể nhưng không nên panic hoặc giấu một lỗi quan trọng mà caller tưởng đã được kiểm tra. Với Child, std không tự kill/wait khi handle bị drop; guard riêng có thể dừng và reap direct child theo phạm vi đã định nghĩa. Với thread, Rust không có lệnh an toàn giết tùy ý một thread đang giữ lock. Thiết kế cancellation hợp tác và giới hạn I/O từ đầu giúp shutdown có thời hạn thực tế.",
          "code": "#[derive(Debug, PartialEq)] enum Phase { Running, Draining, Stopped }\nfn can_submit(phase: &Phase) -> bool { *phase == Phase::Running }\nfn finish(phase: Phase, in_flight: usize) -> Result<Phase, &'static str> {\n    if phase == Phase::Draining && in_flight == 0 { Ok(Phase::Stopped) } else { Err(\"con-viec\") }\n}"
        },
        {
          "title": "Thực hành state machine và thử race",
          "text": "Bài tập từ chối submit khi không còn Running, chỉ chuyển Stopped khi đang Draining và số việc còn lại bằng 0. Cargo test nên tạo cạnh tranh giữa submit và stop dưới cùng mutex hoặc primitive phù hợp, bảo đảm mỗi việc được chấp nhận đúng một lần hoặc bị từ chối rõ. Thêm ca queue rỗng, queue đầy, worker lỗi và deadline hết. Báo cáo số accepted, completed, cancelled phải đối chiếu được, không bỏ một trạng thái giữa chừng. Đo thời gian shutdown trên tải lớn và đầu ra chậm; một đường thoát nhanh khi không có việc chưa chứng minh đường dừng trong điều kiện thực."
        }
      ],
      "tip": "Channel chỉ báo hết producer khi tất cả sender liên quan đã được drop.",
      "exercise": {
        "title": "Shutdown có thứ tự và tài nguyên được thu hồi",
        "instructions": "Định nghĩa ngừng nhận việc, xử lý phần đang chạy và kết thúc worker trước khi thoát.",
        "requirements": [
          "Chỉ Running chấp nhận việc mới.",
          "Chỉ Draining không còn việc mới chuyển Stopped."
        ]
      },
      "starterCode": "#[derive(Debug, PartialEq)] enum Phase { Running, Draining, Stopped }\nfn can_submit(phase: &Phase) -> bool { todo!() }\nfn finish(phase: Phase, in_flight: usize) -> Result<Phase, &'static str> { todo!() }\nfn main() {\nassert!(can_submit(&Phase::Running)); assert!(!can_submit(&Phase::Draining));\nassert_eq!(finish(Phase::Draining, 0), Ok(Phase::Stopped));\nassert_eq!(finish(Phase::Draining, 1), Err(\"con-viec\"));\nprintln!(\"Ngừng nhận trước khi drain\");\n}",
      "solutionCode": "#[derive(Debug, PartialEq)] enum Phase { Running, Draining, Stopped }\nfn can_submit(phase: &Phase) -> bool { *phase == Phase::Running }\nfn finish(phase: Phase, in_flight: usize) -> Result<Phase, &'static str> {\n    if phase == Phase::Draining && in_flight == 0 { Ok(Phase::Stopped) } else { Err(\"con-viec\") }\n}\nfn main() {\nassert!(can_submit(&Phase::Running)); assert!(!can_submit(&Phase::Draining));\nassert_eq!(finish(Phase::Draining, 0), Ok(Phase::Stopped));\nassert_eq!(finish(Phase::Draining, 1), Err(\"con-viec\"));\nprintln!(\"Ngừng nhận trước khi drain\");\n}",
      "expectedOutput": "Ngừng nhận trước khi drain",
      "hints": [
        "Chỉ Running chấp nhận việc mới.",
        "Channel chỉ báo hết producer khi tất cả sender liên quan đã được drop."
      ],
      "quiz": {
        "question": "Consumer chờ channel đóng mãi dù producer chính đã dừng. Nên kiểm tra gì?",
        "options": ["Còn sender clone nào được giữ bởi owner khác không.", "Tăng sleep trong consumer.", "Đổi tên channel."],
        "correct": 0,
        "explanation": "Channel chỉ báo hết producer khi tất cả sender liên quan đã được drop."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/sync/mpsc/index.html"
      }
    },
    {
      "id": "systems-partial-io",
      "moduleId": "track-systems",
      "title": "I/O từng phần, framing và deadline",
      "description": "Đọc ghi đúng khi dữ liệu được chia thành nhiều đoạn, có ngắt hoặc kết thúc giữa chừng.",
      "duration": 50,
      "objectives": [
        "Đọc ghi đúng khi dữ liệu được chia thành nhiều đoạn, có ngắt hoặc kết thúc giữa chừng.",
        "Kiểm tra header, trần 4096 byte và độ dài chính xác.",
        "Không đọc ngoài slice hoặc chấp nhận payload thiếu/thừa."
      ],
      "sections": [
        {
          "title": "Một lần read không tương ứng một bản tin",
          "text": "File, pipe và stream có thể trả ít byte hơn buffer yêu cầu mà không phải lỗi. Network có thể gộp nhiều message hoặc chia một message thành nhiều lần đọc. Trước hết xác định định dạng: khung cố định, length prefix hay delimiter có escaping. Bài học chọn header u32 big-endian chứa độ dài payload, giới hạn 4096 byte. Đọc đủ header rồi kiểm tra trần trước khi cấp phát payload. Không dùng một read duy nhất và giả định buffer còn lại đã được điền; dữ liệu khởi tạo bằng 0 không biến phần thiếu thành byte hợp lệ."
        },
        {
          "title": "EOF ở đầu và EOF giữa khung khác nhau",
          "text": "EOF khi chưa đọc byte header nào có thể là kết thúc kết nối bình thường. EOF sau một phần header hoặc payload là khung bị cắt, cần lỗi UnexpectedEof. read_exact hỗ trợ gom đủ byte và xử lý Interrupted theo hợp đồng, nhưng không tự biết giới hạn kích thước hoặc deadline của giao thức. Khi trả lỗi, không sử dụng payload như dữ liệu hoàn chỉnh. Ở phía ghi, write có thể ngắn; write_all gom các lần ghi nhưng không rollback nếu lỗi. Caller phải biết một khung dở có thể đã được đưa lên đường truyền."
        },
        {
          "title": "Timeout mỗi read chưa phải deadline tổng",
          "text": "Nếu đặt timeout một giây cho từng read, đối tác gửi một byte mỗi nửa giây có thể giữ kết nối lâu hơn ngân sách tổng rất nhiều. Tính deadline bằng Instant và trước mỗi thao tác lấy thời gian còn lại. Khi còn 0, dừng trước khi đọc tiếp. Nonblocking I/O cần readiness và xử lý WouldBlock, không busy loop. Bộ đệm, số connection và số frame mỗi connection cũng phải có trần. Một giới hạn payload nhỏ không bảo vệ service khỏi vô số kết nối đang giữ header dở.",
          "code": "fn frame(bytes: &[u8]) -> Result<&[u8], &'static str> {\n    let header: [u8;4] = bytes.get(..4).ok_or(\"thieu-header\")?.try_into().unwrap();\n    let len = u32::from_be_bytes(header) as usize;\n    if len > 4096 { return Err(\"qua-lon\"); }\n    let end = 4usize.checked_add(len).ok_or(\"tran-so\")?;\n    if bytes.len() != end { return Err(\"do-dai\"); }\n    Ok(&bytes[4..end])\n}"
        },
        {
          "title": "Thực hành với reader cố tình chia nhỏ",
          "text": "Bài tập giải mã một khung đã có trong slice, dùng checked_add và kiểm tra đúng độ dài, không chấp nhận byte thừa. Trong Cargo, thêm ChunkedReader trả một đến ba byte mỗi lần và reader chèn Interrupted để kiểm thử hàm đọc luồng. Test mọi điểm cắt header/payload, payload rỗng, length quá lớn và nhiều khung nối nhau. Với socket thật, dùng deadline wrapper và client giả chậm. Báo lỗi giao thức khác lỗi I/O để caller biết nên đóng connection hay báo retry. Không log toàn bộ payload khi nó là dữ liệu người dùng; giữ kích thước, loại lỗi và request ID là đủ cho phần lớn ca chẩn đoán."
        }
      ],
      "tip": "Các read ngắn có thể kéo dài tổng thời gian nếu mỗi lần được cấp lại ngân sách.",
      "exercise": {
        "title": "I/O từng phần, framing và deadline",
        "instructions": "Đọc ghi đúng khi dữ liệu được chia thành nhiều đoạn, có ngắt hoặc kết thúc giữa chừng.",
        "requirements": [
          "Kiểm tra header, trần 4096 byte và độ dài chính xác.",
          "Không đọc ngoài slice hoặc chấp nhận payload thiếu/thừa."
        ]
      },
      "starterCode": "fn frame(bytes: &[u8]) -> Result<&[u8], &'static str> { todo!() }\nfn main() {\nassert_eq!(frame(&[0,0,0,2,b'o',b'k']), Ok(&b\"ok\"[..]));\nassert_eq!(frame(&[0,0,0]), Err(\"thieu-header\"));\nassert_eq!(frame(&[0,0,0,2,b'o']), Err(\"do-dai\"));\nassert_eq!(frame(&[0,0,16,1]), Err(\"qua-lon\"));\nprintln!(\"Khung hợp lệ: ok\");\n}",
      "solutionCode": "fn frame(bytes: &[u8]) -> Result<&[u8], &'static str> {\n    let header: [u8;4] = bytes.get(..4).ok_or(\"thieu-header\")?.try_into().unwrap();\n    let len = u32::from_be_bytes(header) as usize;\n    if len > 4096 { return Err(\"qua-lon\"); }\n    let end = 4usize.checked_add(len).ok_or(\"tran-so\")?;\n    if bytes.len() != end { return Err(\"do-dai\"); }\n    Ok(&bytes[4..end])\n}\nfn main() {\nassert_eq!(frame(&[0,0,0,2,b'o',b'k']), Ok(&b\"ok\"[..]));\nassert_eq!(frame(&[0,0,0]), Err(\"thieu-header\"));\nassert_eq!(frame(&[0,0,0,2,b'o']), Err(\"do-dai\"));\nassert_eq!(frame(&[0,0,16,1]), Err(\"qua-lon\"));\nprintln!(\"Khung hợp lệ: ok\");\n}",
      "expectedOutput": "Khung hợp lệ: ok",
      "hints": [
        "Kiểm tra header, trần 4096 byte và độ dài chính xác.",
        "Các read ngắn có thể kéo dài tổng thời gian nếu mỗi lần được cấp lại ngân sách."
      ],
      "quiz": {
        "question": "Timeout 1 giây cho mỗi read có bảo đảm đọc cả khung trong 1 giây không?",
        "options": ["Có, socket tự cộng thời gian.", "Không; cần deadline tổng và tính lại thời gian còn lại.", "Có nếu payload UTF-8."],
        "correct": 1,
        "explanation": "Các read ngắn có thể kéo dài tổng thời gian nếu mỗi lần được cấp lại ngân sách."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/io/trait.Read.html"
      }
    },
    {
      "id": "systems-supervisor-project",
      "moduleId": "track-systems",
      "title": "Dự án: giám sát tiến trình có timeout",
      "description": "Chạy worker do dự án sở hữu, drain hai pipe, giới hạn output và thu hồi child đúng cách.",
      "duration": 100,
      "objectives": [
        "Chạy worker do dự án sở hữu, drain hai pipe, giới hạn output và thu hồi child đúng cách.",
        "Giữ tối đa limit byte và báo truncated nếu còn dữ liệu.",
        "Mô hình xử lý mọi chunk, kể cả limit bằng 0."
      ],
      "sections": [
        {
          "title": "Hợp đồng worker đi trước Command",
          "text": "Supervisor trong bài chỉ chạy worker fixture của chính executable: thành công, lỗi, xuất nhiều dữ liệu hoặc chậm. Không dùng shell để ghép chuỗi lệnh; mỗi đối số là một phần tử của Command. Cấu hình gồm thời hạn và giới hạn byte giữ lại cho stdout/stderr. Kết quả phải phân biệt exit code thất bại, timeout, output bị cắt và lỗi khởi chạy. Một tiến trình trả exit code 0 chưa chứng minh nội dung output hợp lệ theo nghiệp vụ, vì vậy lớp gọi có thể cần parser riêng sau khi supervisor hoàn thành."
        },
        {
          "title": "Drain stdout và stderr đồng thời",
          "text": "Pipe có dung lượng hữu hạn. Nếu parent chỉ đọc stdout trong khi child ghi đầy stderr, child có thể dừng trước khi kết thúc stdout. Dự án tạo hai reader thread, mỗi thread giữ tối đa số byte quy định nhưng tiếp tục drain phần dư cho đến EOF. Chỉ ngừng lưu khác với ngừng đọc: dừng đọc khi đủ buffer có thể làm child kẹt. Counter tổng byte và cờ truncated cho phép caller biết log chỉ là phần đầu, tránh hiểu log bị cắt là toàn bộ kết quả."
        },
        {
          "title": "Timeout phải đi cùng kill và reap",
          "text": "Parent kiểm tra try_wait theo vòng có sleep ngắn và deadline dựa trên Instant. Khi hết thời hạn, kill direct child rồi wait để thu trạng thái và giải phóng tài nguyên hệ điều hành. Child không có Drop tự làm hai việc này; guard trong thư viện chỉ là dự phòng cho đường lỗi. Đóng stdin ngay từ cấu hình vì worker fixture không nhận input. Sau child kết thúc, join reader để biết đã thu output. Nếu worker có thể tạo descendant giữ pipe, direct-child timeout chưa đủ: cần adapter process group/job object hoặc chính sách khác để dừng cả cây.",
          "code": "fn capture(chunks: &[&[u8]], limit: usize) -> (Vec<u8>, bool) {\n    let mut kept = Vec::new(); let mut truncated = false;\n    for chunk in chunks {\n        let room = limit.saturating_sub(kept.len());\n        kept.extend_from_slice(&chunk[..chunk.len().min(room)]);\n        truncated |= chunk.len() > room;\n    }\n    (kept,truncated)\n}"
        },
        {
          "title": "Kiểm thử bằng executable của chính dự án",
          "text": "Cargo integration test dùng đường dẫn binary do Cargo cung cấp, không gọi lệnh ngẫu nhiên từ môi trường. Ca spam ghi cả hai pipe nhiều hơn trần để kiểm tra không deadlock và RAM giữ hữu hạn. Ca slow xác nhận timed_out, ca fail giữ exit code và stderr, ca success kiểm tra stdout. Bản mẫu không phải sandbox chạy mã không tin cậy và không giới hạn CPU/RAM của child bằng OS. Khi phát triển thành service, bổ sung hạn mức đồng thời, quyền chạy, môi trường tối thiểu và quản lý descendant. Ghi những giới hạn đó trong bàn giao cùng các kết quả đã đo."
        }
      ],
      "tip": "Giới hạn lưu và tiếp tục drain là hai hành vi cần phân biệt để không tạo deadlock.",
      "exercise": {
        "title": "Dự án: giám sát tiến trình có timeout",
        "instructions": "Chạy worker do dự án sở hữu, drain hai pipe, giới hạn output và thu hồi child đúng cách.",
        "requirements": [
          "Giữ tối đa limit byte và báo truncated nếu còn dữ liệu.",
          "Mô hình xử lý mọi chunk, kể cả limit bằng 0."
        ]
      },
      "starterCode": "fn capture(chunks: &[&[u8]], limit: usize) -> (Vec<u8>, bool) { todo!() }\nfn main() {\nassert_eq!(capture(&[b\"ab\",b\"cdef\"],4),(b\"abcd\".to_vec(),true));\nassert_eq!(capture(&[b\"ok\"],4),(b\"ok\".to_vec(),false));\nassert_eq!(capture(&[b\"x\"],0),(vec![],true));\nprintln!(\"Giữ 4 byte: abcd\");\n}",
      "solutionCode": "fn capture(chunks: &[&[u8]], limit: usize) -> (Vec<u8>, bool) {\n    let mut kept = Vec::new(); let mut truncated = false;\n    for chunk in chunks {\n        let room = limit.saturating_sub(kept.len());\n        kept.extend_from_slice(&chunk[..chunk.len().min(room)]);\n        truncated |= chunk.len() > room;\n    }\n    (kept,truncated)\n}\nfn main() {\nassert_eq!(capture(&[b\"ab\",b\"cdef\"],4),(b\"abcd\".to_vec(),true));\nassert_eq!(capture(&[b\"ok\"],4),(b\"ok\".to_vec(),false));\nassert_eq!(capture(&[b\"x\"],0),(vec![],true));\nprintln!(\"Giữ 4 byte: abcd\");\n}",
      "expectedOutput": "Giữ 4 byte: abcd",
      "hints": [
        "Giữ tối đa limit byte và báo truncated nếu còn dữ liệu.",
        "Giới hạn lưu và tiếp tục drain là hai hành vi cần phân biệt để không tạo deadlock."
      ],
      "quiz": {
        "question": "Đủ giới hạn log rồi dừng đọc pipe có vấn đề gì?",
        "options": ["Child có thể kẹt khi pipe đầy; vẫn cần drain hoặc dừng child theo chính sách.", "Không có, pipe vô hạn.", "Child tự biết bỏ output."],
        "correct": 0,
        "explanation": "Giới hạn lưu và tiếp tục drain là hai hành vi cần phân biệt để không tạo deadlock."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/process/struct.Child.html"
      },
      "localLab": {
        "title": "Supervisor cho worker fixture",
        "instructions": "Chạy executable của chính dự án trong bốn chế độ có kiểm soát. Library dùng API process/pipe thật; giới hạn đang bảo vệ output giữ trong parent và direct child, chưa phải sandbox hay bộ quản lý toàn cây process.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"systems_supervisor\"\nversion = \"0.1.0\"\nedition = \"2024\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::{io::{self, Read}, path::Path, process::{Child, Command, ExitStatus, Stdio}, thread, time::{Duration, Instant}};\n#[derive(Debug)] pub struct Captured { pub kept: Vec<u8>, pub total_bytes: u64, pub truncated: bool }\n#[derive(Debug)] pub struct Outcome { pub status: ExitStatus, pub timed_out: bool, pub stdout: Captured, pub stderr: Captured }\nstruct Guard { child: Child, reaped: bool }\nimpl Drop for Guard { fn drop(&mut self) { if !self.reaped { let _ = self.child.kill(); let _ = self.child.wait(); } } }\nfn drain(mut reader: impl Read, limit: usize) -> io::Result<Captured> {\n    let mut captured = Captured { kept:Vec::new(),total_bytes:0,truncated:false }; let mut buffer = [0u8;4096];\n    loop {\n        let n = match reader.read(&mut buffer) { Ok(0) => break, Ok(n) => n, Err(e) if e.kind()==io::ErrorKind::Interrupted => continue, Err(e) => return Err(e) };\n        captured.total_bytes = captured.total_bytes.saturating_add(n as u64);\n        let room = limit.saturating_sub(captured.kept.len()); captured.kept.extend_from_slice(&buffer[..n.min(room)]);\n        captured.truncated |= n > room;\n    } Ok(captured)\n}\npub fn run(program: &Path, args: &[&str], timeout: Duration, limit: usize) -> io::Result<Outcome> {\n    if timeout.is_zero() || timeout > Duration::from_secs(60) || limit > 1024*1024 {\n        return Err(io::Error::new(io::ErrorKind::InvalidInput,\"timeout/limit\"));\n    }\n    let deadline = Instant::now().checked_add(timeout).ok_or_else(|| io::Error::new(io::ErrorKind::InvalidInput,\"deadline\"))?;\n    let child = Command::new(program).args(args).stdin(Stdio::null()).stdout(Stdio::piped()).stderr(Stdio::piped()).spawn()?;\n    let mut guard = Guard { child,reaped:false };\n    let stdout = guard.child.stdout.take().ok_or_else(|| io::Error::other(\"stdout missing\"))?;\n    let stderr = guard.child.stderr.take().ok_or_else(|| io::Error::other(\"stderr missing\"))?;\n    let out_reader = thread::spawn(move || drain(stdout,limit));\n    let err_reader = thread::spawn(move || drain(stderr,limit));\n    let outcome = (|| -> io::Result<(ExitStatus,bool)> {\n        loop {\n            if let Some(status) = guard.child.try_wait()? { guard.reaped=true; return Ok((status,false)); }\n            if Instant::now() >= deadline {\n                // Direct-child fixture only: no descendants may inherit these pipes.\n                guard.child.kill()?;\n                let status = guard.child.wait()?; guard.reaped=true; return Ok((status,true));\n            }\n            thread::sleep(Duration::from_millis(5));\n        }\n    })();\n    if !guard.reaped { let _ = guard.child.kill(); if guard.child.wait().is_ok() { guard.reaped=true; } }\n    let stdout = out_reader.join().map_err(|_| io::Error::other(\"stdout reader panicked\"))??;\n    let stderr = err_reader.join().map_err(|_| io::Error::other(\"stderr reader panicked\"))??;\n    let (status,timed_out) = outcome?; Ok(Outcome { status,timed_out,stdout,stderr })\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use std::{io::{self,Write},time::Duration};\nfn fixture(mode: &str) -> i32 {\n    match mode {\n        \"ok\" => { println!(\"worker-ok\"); 0 },\n        \"fail\" => { eprintln!(\"worker-failed\"); 7 },\n        \"slow\" => { std::thread::sleep(Duration::from_secs(5)); 0 },\n        \"spam\" => {\n            let data = [b'x';1024]; let mut out=io::stdout().lock(); let mut err=io::stderr().lock();\n            for _ in 0..256 { out.write_all(&data).unwrap(); err.write_all(&data).unwrap(); } 0\n        },\n        _ => 2\n    }\n}\nfn main() {\n    let args:Vec<_>=std::env::args().collect();\n    if args.get(1).map(String::as_str)==Some(\"--fixture\") {\n        std::process::exit(fixture(args.get(2).map(String::as_str).unwrap_or(\"\")));\n    }\n    let exe=std::env::current_exe().unwrap();\n    let result=systems_supervisor::run(&exe,&[\"--fixture\",\"ok\"],Duration::from_secs(2),1024).unwrap();\n    println!(\"success={} timeout={} stdout={}\",result.status.success(),result.timed_out,String::from_utf8_lossy(&result.stdout.kept).trim());\n}\n"
          },
          {
            "path": "tests/supervisor.rs",
            "content": "use systems_supervisor::run;\nuse std::{path::Path,time::Duration};\nfn exe()-> &'static Path { Path::new(env!(\"CARGO_BIN_EXE_systems_supervisor\")) }\n#[test] fn success_and_failure() {\n    let ok=run(exe(),&[\"--fixture\",\"ok\"],Duration::from_secs(3),1024).unwrap();\n    assert!(ok.status.success()); assert!(!ok.timed_out); assert_eq!(ok.stdout.kept,b\"worker-ok\\n\");\n    let fail=run(exe(),&[\"--fixture\",\"fail\"],Duration::from_secs(3),1024).unwrap();\n    assert_eq!(fail.status.code(),Some(7)); assert_eq!(fail.stderr.kept,b\"worker-failed\\n\");\n}\n#[test] fn drains_both_pipes_with_bounded_capture() {\n    let result=run(exe(),&[\"--fixture\",\"spam\"],Duration::from_secs(5),32).unwrap();\n    assert!(result.status.success()); assert_eq!(result.stdout.kept.len(),32); assert_eq!(result.stderr.kept.len(),32);\n    assert_eq!(result.stdout.total_bytes,256*1024); assert_eq!(result.stderr.total_bytes,256*1024);\n    assert!(result.stdout.truncated && result.stderr.truncated);\n}\n#[test] fn timeout_reaps_direct_child() {\n    let result=run(exe(),&[\"--fixture\",\"slow\"],Duration::from_millis(50),64).unwrap();\n    assert!(result.timed_out); assert!(!result.status.success());\n}\n#[test] fn configuration_is_bounded() {\n    assert_eq!(run(exe(),&[],Duration::ZERO,1).unwrap_err().kind(),std::io::ErrorKind::InvalidInput);\n}\n"
          },
          {
            "path": "README.md",
            "content": "# Giám sát direct child\n\nrun nhận Path và danh sách args riêng, timeout >0 đến 60 giây, capture limit tối đa 1 MiB mỗi pipe. stdin là null. Hai reader drain đồng thời, giữ prefix có trần và counter tổng byte. Parent dùng try_wait; timeout kill rồi wait, sau đó join reader. Guard là cleanup dự phòng, không thay việc kiểm tra Result ở đường tường minh.\n\nIntegration test dùng CARGO_BIN_EXE_systems_supervisor và --fixture ok/fail/spam/slow. Không chạy mã người dùng hoặc binary ngoài. Spam phát 256 KiB trên mỗi pipe để kiểm tra drain vượt trần giữ log. Slow chỉ sleep rồi bị dừng.\n\nGiới hạn: thư viện không tạo process group/job object, không dừng descendant và không kiểm soát CPU/RAM của child. Nếu child tạo descendant giữ pipe, join reader có thể chờ EOF lâu hơn direct-child deadline. Hợp đồng lab chỉ cho fixture không tạo descendant. Production supervisor cần adapter OS dừng cả nhóm, deadline cho drain, admission control và quyền chạy; không đổi mô tả thành sandbox khi chưa có các cơ chế đó.\n\nMở rộng: thêm job ID, bounded queue, cancellation trước chạy, shutdown drain, giới hạn environment và structured result. accepted = completed + failed + timed_out + pending/running theo thời điểm báo cáo. Test mọi nhánh bằng worker do dự án sở hữu, không dùng dịch vụ hoặc process của người khác.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run"
        ],
        "checks": [
          "ok/fail giữ exit status và stream tương ứng.",
          "spam không deadlock, buffer giữ đúng trần và truncated=true.",
          "slow timed_out và direct child đã wait.",
          "Cấu hình quá giới hạn bị từ chối trước spawn."
        ]
      },
      "simulation": {
        "title": "Vòng đời direct child",
        "description": "Timeout cần đi cùng drain và reap.",
        "kind": "sequence",
        "nodes": [
          {
            "id": "spawn",
            "label": "Spawn",
            "detail": "Đối số và pipe đã cấu hình"
          },
          {
            "id": "drain",
            "label": "Drain",
            "detail": "Hai stream được đọc"
          },
          {
            "id": "stop",
            "label": "Dừng",
            "detail": "Exit hoặc deadline"
          },
          {
            "id": "reap",
            "label": "Reap",
            "detail": "Thu status và join reader"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Worker hoàn tất",
            "steps": [
              {
                "title": "Khởi chạy",
                "description": "Fixture ok bắt đầu.",
                "activeNodeIds": [
                  "spawn"
                ],
                "values": [
                  {
                    "label": "stdin",
                    "value": "null"
                  }
                ]
              },
              {
                "title": "Đọc hai pipe",
                "description": "Giữ byte trong trần capture.",
                "activeNodeIds": [
                  "drain"
                ],
                "values": [
                  {
                    "label": "kept",
                    "value": "10 byte"
                  }
                ]
              },
              {
                "title": "Exit",
                "description": "try_wait thấy child kết thúc.",
                "activeNodeIds": [
                  "stop"
                ],
                "values": [
                  {
                    "label": "success",
                    "value": "true"
                  }
                ]
              },
              {
                "title": "Thu hồi",
                "description": "Status đã thu, reader tới EOF.",
                "activeNodeIds": [
                  "reap"
                ],
                "values": [
                  {
                    "label": "reaped",
                    "value": "true"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "Worker quá thời hạn",
            "steps": [
              {
                "title": "Khởi chạy",
                "description": "Fixture slow không hoàn tất kịp.",
                "activeNodeIds": [
                  "spawn"
                ],
                "values": [
                  {
                    "label": "deadline",
                    "value": "50 ms"
                  }
                ]
              },
              {
                "title": "Chờ có giới hạn",
                "description": "Reader vẫn phục vụ pipe.",
                "activeNodeIds": [
                  "drain"
                ],
                "values": [
                  {
                    "label": "pending",
                    "value": "true"
                  }
                ]
              },
              {
                "title": "Dừng direct child",
                "description": "Deadline hết; gọi kill.",
                "activeNodeIds": [
                  "stop"
                ],
                "values": [
                  {
                    "label": "timed_out",
                    "value": "true"
                  }
                ]
              },
              {
                "title": "Wait",
                "description": "Thu trạng thái và kết thúc reader.",
                "activeNodeIds": [
                  "reap"
                ],
                "values": [
                  {
                    "label": "reaped",
                    "value": "true"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "systems-layout-alignment",
      "moduleId": "track-systems",
      "title": "Alignment, offset và ranh giới unsafe",
      "description": "Phân tích layout mà không dùng cast tùy tiện để đọc định dạng nhị phân.",
      "duration": 50,
      "objectives": [
        "Phân tích layout mà không dùng cast tùy tiện để đọc định dạng nhị phân.",
        "Alignment phải là lũy thừa hai và khác 0.",
        "Round up bằng phép cộng có kiểm tra tràn."
      ],
      "sections": [
        {
          "title": "Bố cục trong RAM phục vụ target hiện tại",
          "text": "Rust có thể thay đổi layout mặc định của struct theo các quy tắc được cho phép. repr(C) chọn bố cục tương thích quy tắc C trên target, nhưng không cố định endianness, kích thước pointer hay mọi kiểu con giữa các kiến trúc. Vì vậy ghi nguyên bytes của struct ra file không tự thành định dạng ổn định. Padding có thể không chứa dữ liệu được khởi tạo để serialize. Định dạng trên disk/wire nên ghi từng trường với độ rộng và byte order cụ thể, rồi decode qua slice có kiểm tra."
        },
        {
          "title": "Alignment là điều kiện để tham chiếu hợp lệ",
          "text": "Một địa chỉ có đủ byte chưa chắc được phép tạo &u32 nếu không thỏa alignment. repr(packed) giảm padding nhưng có thể khiến trường bị lệch; lấy reference đến trường đó không hợp lệ chỉ vì CPU nào đó chịu được unaligned load. API read_unaligned có hợp đồng riêng, vẫn cần con trỏ hợp lệ và dữ liệu được khởi tạo. Trong nhiều parser, sao chép bốn byte vào array rồi from_le_bytes rõ ràng hơn và tránh unsafe hoàn toàn. Tối ưu bỏ bản copy bốn byte chỉ có ý nghĩa khi phép đo chứng minh đó là điểm nghẽn."
        },
        {
          "title": "Unsafe phải đi kèm invariant có owner",
          "text": "Nếu viết một wrapper thấp tầng, mô tả ai cấp phát, ai giải phóng, kích thước, alignment, lifetime và aliasing. Một hàm safe bên ngoài phải ngăn caller vi phạm mọi điều kiện mà phần unsafe dựa vào. Không nhận một pointer và length tùy ý rồi nói caller tự chịu trách nhiệm trong tài liệu của hàm safe. Với memory mapping, file có thể bị thay đổi hoặc truncate bởi tác nhân khác; lifetime của map chưa tự chứng minh mọi trang luôn truy cập được. Chọn abstraction thư viện đã xử lý nền tảng và ghi phạm vi an toàn của API.",
          "code": "fn align_up(offset: usize, alignment: usize) -> Option<usize> {\n    if !alignment.is_power_of_two() { return None; }\n    offset.checked_add(alignment - 1).map(|value| value & !(alignment - 1))\n}"
        },
        {
          "title": "Thực hành tính offset có kiểm tra",
          "text": "Bài tập round_up một offset lên alignment là lũy thừa hai, từ chối alignment 0, giá trị không hợp lệ và overflow. Nó minh họa phép toán layout, không tạo con trỏ hoặc chứng minh một allocation thật. Trong Cargo, test các offset đã thẳng hàng, sát biên và usize::MAX. Khi review code FFI, lập bảng kiểu Rust/C, kích thước và ownership trên từng target cần hỗ trợ. Chạy công cụ kiểm tra phù hợp cho code unsafe trong môi trường kiểm thử, nhưng không coi một lượt test không lỗi là chứng minh mọi tổ hợp pointer đều an toàn."
        }
      ],
      "tip": "Layout ABI và định dạng lưu trữ là hai hợp đồng khác nhau.",
      "exercise": {
        "title": "Alignment, offset và ranh giới unsafe",
        "instructions": "Phân tích layout mà không dùng cast tùy tiện để đọc định dạng nhị phân.",
        "requirements": [
          "Alignment phải là lũy thừa hai và khác 0.",
          "Round up bằng phép cộng có kiểm tra tràn."
        ]
      },
      "starterCode": "fn align_up(offset: usize, alignment: usize) -> Option<usize> { todo!() }\nfn main() {\nassert_eq!(align_up(5,4),Some(8)); assert_eq!(align_up(8,4),Some(8));\nassert_eq!(align_up(5,0),None); assert_eq!(align_up(5,3),None);\nassert_eq!(align_up(usize::MAX,8),None);\nprintln!(\"Offset đã căn: {}\",align_up(5,4).unwrap());\n}",
      "solutionCode": "fn align_up(offset: usize, alignment: usize) -> Option<usize> {\n    if !alignment.is_power_of_two() { return None; }\n    offset.checked_add(alignment - 1).map(|value| value & !(alignment - 1))\n}\nfn main() {\nassert_eq!(align_up(5,4),Some(8)); assert_eq!(align_up(8,4),Some(8));\nassert_eq!(align_up(5,0),None); assert_eq!(align_up(5,3),None);\nassert_eq!(align_up(usize::MAX,8),None);\nprintln!(\"Offset đã căn: {}\",align_up(5,4).unwrap());\n}",
      "expectedOutput": "Offset đã căn: 8",
      "hints": [
        "Alignment phải là lũy thừa hai và khác 0.",
        "Layout ABI và định dạng lưu trữ là hai hợp đồng khác nhau."
      ],
      "quiz": {
        "question": "repr(C) có làm struct thành định dạng file dùng chung mọi máy không?",
        "options": ["Có, C cố định mọi kích thước.", "Có nếu derive Copy.", "Không; vẫn có target, endian, padding và kiểu trường cần xử lý."],
        "correct": 2,
        "explanation": "Layout ABI và định dạng lưu trữ là hai hợp đồng khác nhau."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/nomicon/other-reprs.html"
      }
    },
    {
      "id": "systems-file-journal-project",
      "moduleId": "track-systems",
      "title": "Dự án: journal append-only và phục hồi tail",
      "description": "Xây định dạng log có sequence, checksum và chính sách rõ khi lần ghi cuối bị cắt.",
      "duration": 100,
      "objectives": [
        "Xây định dạng log có sequence, checksum và chính sách rõ khi lần ghi cuối bị cắt.",
        "Tính kích thước header+payload+checksum có kiểm tra tràn.",
        "Phân biệt trần payload và tail chưa đủ byte."
      ],
      "sections": [
        {
          "title": "Append-only vẫn cần một định dạng có giới hạn",
          "text": "Một journal ghi nhiều record nối nhau; mỗi record trong bài gồm length u32, sequence u64, payload tối đa 1024 byte và checksum u32. Số nguyên dùng big-endian để host khác đọc cùng dữ liệu. Sequence bắt đầu từ 1 và tăng liên tục, giúp phát hiện thiếu hoặc đảo record trong phạm vi file. Checksum học tập dùng FNV-1a để phát hiện thay đổi ngẫu nhiên; nó không xác thực nguồn hoặc chống người chủ động sửa file. Parser kiểm tra trần trước khi tạo payload và giữ tổng file dưới ngân sách đã định nghĩa."
        },
        {
          "title": "Tail bị cắt khác record hoàn chỉnh bị hỏng",
          "text": "Crash giữa một append có thể để lại prefix cuối chưa đủ header hoặc payload/checksum. Recovery báo valid_bytes và torn_tail, không coi prefix đó là record. Một record đủ byte nhưng checksum sai hoặc sequence không đúng là Corrupt và không được bỏ qua để đọc tiếp như không có gì xảy ra. Cách phân biệt này dựa trên mô hình lỗi đã nêu; nó không chứng minh một file tùy ý không bị sửa có chủ đích. Khi chưa biết nguồn dữ liệu, giữ bản gốc và báo lỗi thay vì tự chữa theo một giả định thuận tiện."
        },
        {
          "title": "Ghi tiếp sau lỗi cần bước phục hồi",
          "text": "Nếu append trả lỗi sau khi ghi một phần, file có thể đã đổi dù trạng thái RAM chưa tăng sequence. Đặt journal vào trạng thái lỗi, từ chối append tiếp cho đến khi mở lại và xử lý tail rõ ràng. Chế độ repair_tail trong lab cắt file về valid_bytes chỉ khi parser xác nhận tail chưa hoàn chỉnh và người gọi đã chọn chế độ đó. Không tự sửa record checksum sai. write_all rồi sync_all trước khi trả commit giúp caller biết mức xác nhận, nhưng cần mô tả thêm yêu cầu directory/metadata và filesystem nếu sản phẩm cần đảm bảo mất điện rộng hơn.",
          "code": "fn record_end(start: usize, payload: u32, file_len: usize) -> Result<usize, &'static str> {\n    if payload > 1024 { return Err(\"qua-lon\"); }\n    let end = start.checked_add(16).and_then(|x| x.checked_add(payload as usize)).ok_or(\"tran-so\")?;\n    if end > file_len { Err(\"tail-do\") } else { Ok(end) }\n}"
        },
        {
          "title": "Thực hành với mọi điểm cắt",
          "text": "Cargo project cung cấp encoder, parser, Journal trên file thật và demo tạo log trong thư mục mới. Test cắt record thứ hai ở mọi vị trí để xác nhận record đầu còn nguyên, test lật payload để nhận Corrupt và test reopen/repair rồi append tiếp đúng sequence. Thêm writer giả cho lỗi giữa chừng nếu mở rộng adapter. Dự án chỉ có một owner ghi; nhiều process cần khóa hoặc cơ chế serialization riêng. Khi bàn giao, cung cấp công cụ inspect không sửa file, bản sao trước repair và báo cáo giới hạn. Khả năng giải thích lúc nào được cắt tail quan trọng hơn việc log luôn mở được bằng mọi giá."
        }
      ],
      "tip": "Tail thiếu byte và record hoàn chỉnh bị hỏng là hai trường hợp với giả định phục hồi khác nhau.",
      "exercise": {
        "title": "Dự án: journal append-only và phục hồi tail",
        "instructions": "Xây định dạng log có sequence, checksum và chính sách rõ khi lần ghi cuối bị cắt.",
        "requirements": [
          "Tính kích thước header+payload+checksum có kiểm tra tràn.",
          "Phân biệt trần payload và tail chưa đủ byte."
        ]
      },
      "starterCode": "fn record_end(start: usize, payload: u32, file_len: usize) -> Result<usize, &'static str> { todo!() }\nfn main() {\nassert_eq!(record_end(0,2,18),Ok(18));\nassert_eq!(record_end(18,2,35),Err(\"tail-do\"));\nassert_eq!(record_end(0,1025,5000),Err(\"qua-lon\"));\nassert_eq!(record_end(usize::MAX,0,usize::MAX),Err(\"tran-so\"));\nprintln!(\"Record kết thúc tại byte 18\");\n}",
      "solutionCode": "fn record_end(start: usize, payload: u32, file_len: usize) -> Result<usize, &'static str> {\n    if payload > 1024 { return Err(\"qua-lon\"); }\n    let end = start.checked_add(16).and_then(|x| x.checked_add(payload as usize)).ok_or(\"tran-so\")?;\n    if end > file_len { Err(\"tail-do\") } else { Ok(end) }\n}\nfn main() {\nassert_eq!(record_end(0,2,18),Ok(18));\nassert_eq!(record_end(18,2,35),Err(\"tail-do\"));\nassert_eq!(record_end(0,1025,5000),Err(\"qua-lon\"));\nassert_eq!(record_end(usize::MAX,0,usize::MAX),Err(\"tran-so\"));\nprintln!(\"Record kết thúc tại byte 18\");\n}",
      "expectedOutput": "Record kết thúc tại byte 18",
      "hints": [
        "Tính kích thước header+payload+checksum có kiểm tra tràn.",
        "Tail thiếu byte và record hoàn chỉnh bị hỏng là hai trường hợp với giả định phục hồi khác nhau."
      ],
      "quiz": {
        "question": "Record đủ byte nhưng checksum sai có nên tự cắt bỏ như torn tail không?",
        "options": ["Có, mọi lỗi đều là crash cuối file.", "Không; cần báo Corrupt và giữ dữ liệu để điều tra theo chính sách.", "Có nếu sequence lớn."],
        "correct": 1,
        "explanation": "Tail thiếu byte và record hoàn chỉnh bị hỏng là hai trường hợp với giả định phục hồi khác nhau."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/fs/struct.File.html"
      },
      "localLab": {
        "title": "Journal nhị phân có recovery",
        "instructions": "Tạo log trong đường dẫn thử riêng. inspect/recover không tự sửa; mở với repair_tail=true chỉ dành cho tail chưa đầy đủ đã được người gọi lựa chọn. Giữ bản sao dữ liệu trước thao tác repair trong sản phẩm.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"systems_journal\"\nversion = \"0.1.0\"\nedition = \"2024\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::{fs::{File,OpenOptions},io::{Read,Write,Seek,SeekFrom},path::Path};\nconst MAX_FILE:usize=16*1024*1024;\n#[derive(Clone,Debug,PartialEq)] pub struct Record { pub sequence:u64,pub payload:Vec<u8> }\n#[derive(Debug)] pub struct Recovery { pub records:Vec<Record>,pub valid_bytes:usize,pub torn_tail:bool }\n#[derive(Debug,PartialEq)] pub enum Error { Io,TooLarge,Corrupt,TornTail,Poisoned,Sequence }\nfn checksum(bytes:&[u8])->u32 { bytes.iter().fold(0x811c9dc5u32,|h,&b|(h^u32::from(b)).wrapping_mul(0x01000193)) }\npub fn encode(sequence:u64,payload:&[u8])->Result<Vec<u8>,Error> {\n    if payload.len()>1024 { return Err(Error::TooLarge); }\n    let mut bytes=Vec::with_capacity(16+payload.len()); bytes.extend_from_slice(&(payload.len() as u32).to_be_bytes());\n    bytes.extend_from_slice(&sequence.to_be_bytes()); bytes.extend_from_slice(payload);\n    let sum=checksum(&bytes); bytes.extend_from_slice(&sum.to_be_bytes()); Ok(bytes)\n}\npub fn recover(bytes:&[u8])->Result<Recovery,Error> {\n    if bytes.len()>MAX_FILE { return Err(Error::TooLarge); }\n    let mut records=Vec::new(); let mut offset=0; let mut next=1u64;\n    while offset<bytes.len() {\n        let remaining=&bytes[offset..];\n        if remaining.len()<12 { return Ok(Recovery {records,valid_bytes:offset,torn_tail:true}); }\n        let len=u32::from_be_bytes(remaining[..4].try_into().unwrap()) as usize;\n        if len>1024 { return Err(Error::TooLarge); }\n        let size=16+len;\n        if remaining.len()<size { return Ok(Recovery {records,valid_bytes:offset,torn_tail:true}); }\n        let sequence=u64::from_be_bytes(remaining[4..12].try_into().unwrap());\n        let expected=u32::from_be_bytes(remaining[12+len..size].try_into().unwrap());\n        if checksum(&remaining[..12+len])!=expected || sequence!=next { return Err(Error::Corrupt); }\n        if records.len()>=10000 { return Err(Error::TooLarge); }\n        records.push(Record {sequence,payload:remaining[12..12+len].to_vec()});\n        next=next.checked_add(1).ok_or(Error::Sequence)?; offset+=size;\n    }\n    Ok(Recovery {records,valid_bytes:offset,torn_tail:false})\n}\npub struct Journal { file:File,next:u64,records:usize,bytes:usize,poisoned:bool }\nimpl Journal {\n    pub fn open(path:impl AsRef<Path>,repair_tail:bool)->Result<Self,Error> {\n        let mut file=OpenOptions::new().read(true).write(true).create(true).truncate(false).open(path).map_err(|_|Error::Io)?;\n        let mut bytes=Vec::new(); (&mut file).take(MAX_FILE as u64+1).read_to_end(&mut bytes).map_err(|_|Error::Io)?;\n        let result=recover(&bytes)?;\n        if result.torn_tail {\n            if !repair_tail { return Err(Error::TornTail); }\n            file.set_len(result.valid_bytes as u64).map_err(|_|Error::Io)?; file.sync_all().map_err(|_|Error::Io)?;\n        }\n        file.seek(SeekFrom::End(0)).map_err(|_|Error::Io)?;\n        let next=result.records.last().map_or(Ok(1),|r|r.sequence.checked_add(1).ok_or(Error::Sequence))?;\n        Ok(Self {file,next,records:result.records.len(),bytes:result.valid_bytes,poisoned:false})\n    }\n    pub fn append(&mut self,payload:&[u8])->Result<u64,Error> {\n        if self.poisoned { return Err(Error::Poisoned); }\n        let bytes=encode(self.next,payload)?;\n        if self.records>=10000 || self.bytes.checked_add(bytes.len()).is_none_or(|n|n>MAX_FILE) { return Err(Error::TooLarge); }\n        let next=self.next.checked_add(1).ok_or(Error::Sequence)?;\n        self.poisoned=true;\n        self.file.write_all(&bytes).map_err(|_|Error::Io)?; self.file.sync_all().map_err(|_|Error::Io)?;\n        let sequence=self.next; self.next=next; self.records+=1; self.bytes+=bytes.len(); self.poisoned=false; Ok(sequence)\n    }\n}\n#[cfg(test)] mod tests {\n    use super::*; use std::sync::atomic::{AtomicU64,Ordering};\n    static NEXT:AtomicU64=AtomicU64::new(0);\n    fn path()->std::path::PathBuf { std::env::temp_dir().join(format!(\"learn-journal-{}-{}.bin\",std::process::id(),NEXT.fetch_add(1,Ordering::Relaxed))) }\n    #[test] fn every_cut_of_last_record() {\n        let first=encode(1,b\"A\").unwrap(); let second=encode(2,b\"second\").unwrap();\n        for cut in 1..second.len() {\n            let mut data=first.clone(); data.extend_from_slice(&second[..cut]); let r=recover(&data).unwrap();\n            assert!(r.torn_tail); assert_eq!(r.valid_bytes,first.len()); assert_eq!(r.records.len(),1);\n        }\n    }\n    #[test] fn corruption_sequence_and_size() {\n        let mut bytes=encode(1,b\"A\").unwrap(); bytes[12]^=1; assert!(matches!(recover(&bytes),Err(Error::Corrupt)));\n        assert!(matches!(recover(&encode(2,b\"A\").unwrap()),Err(Error::Corrupt)));\n        assert_eq!(encode(1,&vec![0;1025]),Err(Error::TooLarge));\n    }\n    #[test] fn reopen_repair_and_continue() {\n        let path=path(); let mut j=Journal::open(&path,false).unwrap(); assert_eq!(j.append(b\"A\"),Ok(1)); drop(j);\n        OpenOptions::new().append(true).open(&path).unwrap().write_all(&[0,0]).unwrap();\n        assert!(matches!(Journal::open(&path,false),Err(Error::TornTail)));\n        let mut j=Journal::open(&path,true).unwrap(); assert_eq!(j.append(b\"B\"),Ok(2)); drop(j);\n        let r=recover(&std::fs::read(&path).unwrap()).unwrap(); assert_eq!(r.records.len(),2); assert!(!r.torn_tail);\n        std::fs::remove_file(path).unwrap();\n    }\n    #[test] fn zero_payload_and_empty_file() {\n        assert!(recover(&[]).unwrap().records.is_empty()); assert_eq!(recover(&encode(1,b\"\").unwrap()).unwrap().records[0].payload,b\"\");\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use systems_journal::{Journal,recover};\nfn main() {\n    let path=std::env::args_os().nth(1).expect(\"Dùng: systems_journal DUONG_DAN_THU\");\n    let mut journal=Journal::open(&path,false).expect(\"Mở log không tự repair\");\n    let sequence=journal.append(b\"sample-event\").expect(\"Append\");\n    drop(journal); let result=recover(&std::fs::read(&path).unwrap()).unwrap();\n    println!(\"Commit sequence {sequence}; {} record hợp lệ\",result.records.len());\n}\n"
          },
          {
            "path": "README.md",
            "content": "# Append-only journal\n\nRecord: length u32 BE (payload tối đa 1024), sequence u64 BE, payload, FNV-1a u32 BE trên header+payload. Sequence bắt đầu 1 và tăng liên tục. FNV là checksum học tập, không là authentication. Tổng file tối đa 16 MiB, 10.000 record.\n\nrecover trả record hợp lệ, valid_bytes và torn_tail. Header/payload cuối thiếu byte tạo torn_tail. Record đủ byte nhưng checksum/sequence sai trả Corrupt; không bỏ qua. Journal::open(path,false) từ chối torn tail. repair_tail=true cắt về valid_bytes và sync; không sửa Corrupt. Hãy inspect và sao lưu trước khi chọn repair trên dữ liệu sản phẩm.\n\nappend chuẩn bị toàn bộ record, đánh dấu poisoned trước write_all/sync_all, chỉ cập nhật counter khi thành công. Nếu I/O lỗi, instance không cho append tiếp; mở lại và xử lý recovery. Một owner ghi file, chưa có khóa liên process. sync_all trên file không đại diện mọi cam kết metadata/directory qua mất điện trên mọi filesystem.\n\nDự án mở rộng: công cụ inspect read-only, snapshot/checkpoint để giới hạn thời gian replay, test disk-full qua adapter writer, khóa một writer và quy trình backup/restore. Đo throughput cùng tần suất sync để không đổi độ bền âm thầm. Định dạng wire/file không dựa vào repr(C) hay bytes của struct.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run -- demo-journal.bin"
        ],
        "checks": [
          "Mọi prefix cắt record cuối giữ record trước.",
          "Checksum/sequence sai không bị coi là tail có thể sửa.",
          "Reopen explicit repair rồi append tiếp đúng sequence.",
          "Trần record/file và payload rỗng có hành vi xác định."
        ]
      },
      "simulation": {
        "title": "Journal khi lần ghi cuối bị cắt",
        "description": "Torn tail được báo riêng; corrupt không được tự sửa.",
        "kind": "timeline",
        "nodes": [
          {
            "id": "old",
            "label": "Prefix",
            "detail": "Record trước đã xác minh"
          },
          {
            "id": "write",
            "label": "Append",
            "detail": "Record mới đang ghi"
          },
          {
            "id": "check",
            "label": "Xác minh",
            "detail": "Length/sequence/checksum"
          },
          {
            "id": "recover",
            "label": "Recovery",
            "detail": "Quyết định công bố hoặc repair"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Record đầy đủ",
            "steps": [
              {
                "title": "Prefix",
                "description": "Sequence 1 đã hợp lệ.",
                "activeNodeIds": [
                  "old"
                ],
                "values": [
                  {
                    "label": "records",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Append",
                "description": "Ghi sequence 2 và checksum.",
                "activeNodeIds": [
                  "write"
                ],
                "values": [
                  {
                    "label": "bytes",
                    "value": "đầy đủ"
                  }
                ]
              },
              {
                "title": "Xác minh",
                "description": "Đủ byte, sequence và checksum đúng.",
                "activeNodeIds": [
                  "check"
                ],
                "values": [
                  {
                    "label": "valid",
                    "value": "true"
                  }
                ]
              },
              {
                "title": "Replay",
                "description": "Công bố hai record.",
                "activeNodeIds": [
                  "recover"
                ],
                "values": [
                  {
                    "label": "records",
                    "value": "2"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "Tail bị cắt",
            "steps": [
              {
                "title": "Prefix",
                "description": "Sequence 1 vẫn nguyên.",
                "activeNodeIds": [
                  "old"
                ],
                "values": [
                  {
                    "label": "records",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Lỗi ghi",
                "description": "Record 2 chỉ có một prefix.",
                "activeNodeIds": [
                  "write"
                ],
                "values": [
                  {
                    "label": "complete",
                    "value": "false"
                  }
                ]
              },
              {
                "title": "Phân loại",
                "description": "Không đủ byte nên torn_tail=true.",
                "activeNodeIds": [
                  "check"
                ],
                "values": [
                  {
                    "label": "valid_bytes",
                    "value": "cuối record 1"
                  }
                ]
              },
              {
                "title": "Phục hồi có lựa chọn",
                "description": "Open thường từ chối; explicit repair mới cắt tail.",
                "activeNodeIds": [
                  "recover"
                ],
                "values": [
                  {
                    "label": "records",
                    "value": "1"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "systems-worker-fairness",
      "moduleId": "track-systems",
      "title": "Worker pool, hàng đợi và công bằng",
      "description": "Giới hạn tải đầu vào và giữ tác vụ nhỏ có cơ hội chạy khi một nguồn gửi quá nhiều việc.",
      "duration": 50,
      "objectives": [
        "Giới hạn tải đầu vào và giữ tác vụ nhỏ có cơ hội chạy khi một nguồn gửi quá nhiều việc.",
        "Lấy luân phiên theo nguồn, giữ thứ tự trong mỗi nguồn.",
        "Nguồn rỗng không làm mất các phần tử còn lại."
      ],
      "sections": [
        {
          "title": "Nhiều thread không tự tạo thêm tài nguyên",
          "text": "Mỗi thread có stack, lịch CPU và chi phí đồng bộ. Tạo một thread cho mỗi request có thể dùng hết bộ nhớ trước khi CPU bận hoàn toàn. Worker pool giới hạn số tác vụ đang chạy, còn bounded queue giới hạn phần đang chờ. Hai giới hạn này khác nhau: pool nhỏ với queue vô hạn vẫn có thể tích backlog đến cạn RAM. Khi queue đầy, API phải trả Busy, chờ trong deadline hoặc áp dụng chính sách ưu tiên rõ. Caller không nên nhìn thấy một request được nhận rồi biến mất không có trạng thái."
        },
        {
          "title": "Công bằng là quyết định của scheduler",
          "text": "FIFO toàn cục đơn giản nhưng một khách gửi nhiều việc có thể chiếm hết hàng chờ. Chia queue theo nguồn và round-robin tạo cơ hội cho nguồn khác, nhưng không tự bảo đảm công bằng theo thời gian nếu độ dài tác vụ khác nhau. Có thể thêm quota, trọng số hoặc phân loại công việc theo chi phí. Không hứa thời gian đáp ứng cứng khi worker gọi I/O không có deadline. Chọn chính sách từ yêu cầu sản phẩm và đo độ trễ đuôi của nguồn ít việc khi nguồn khác đang bão hòa."
        },
        {
          "title": "Phối hợp queue với cancellation và shutdown",
          "text": "Một việc đã bị hủy trong queue không nên chạy đầy đủ khi đến lượt. Worker kiểm tra token trước bắt đầu và giữa các batch, đồng thời ghi terminal state đúng một lần. Shutdown ngừng enqueue rồi drain hoặc hủy phần còn lại theo chính sách. Tránh giữ mutex queue trong lúc thực hiện tác vụ; lấy một item, thả lock rồi xử lý. Queue length, active count, completed và rejected là các chỉ số có ích. Nếu số accepted không đối chiếu được với terminal và pending, có thể một đường lỗi đang bỏ quên trạng thái.",
          "code": "fn fair(a: &[u32], b: &[u32]) -> Vec<u32> {\n    let mut out = Vec::new();\n    for index in 0..a.len().max(b.len()) {\n        if let Some(&value) = a.get(index) { out.push(value); }\n        if let Some(&value) = b.get(index) { out.push(value); }\n    }\n    out\n}"
        },
        {
          "title": "Thực hành lịch round-robin có trần",
          "text": "Bài tập nhận hai queue fixture, lấy luân phiên một phần tử từ mỗi queue cho đến hết. Nó không tạo thread mà làm rõ thứ tự scheduler mong muốn. Trong Cargo, thay fixture bằng bounded queue, worker thật và Barrier để tái hiện cạnh tranh mà không dựa vào sleep ngẫu nhiên. Test một nguồn trống, một nguồn dài, queue đầy và stop trong lúc submit. Dự án daemon cần nâng cấp pool nếu phục vụ nhiều client; server mẫu giới hạn nhỏ chỉ chứng minh protocol và deadline. Khi bàn giao, nêu số worker, dung lượng queue và cách chọn chúng từ phép đo tải."
        }
      ],
      "tip": "Số tác vụ chạy và số tác vụ chờ cần giới hạn riêng.",
      "exercise": {
        "title": "Worker pool, hàng đợi và công bằng",
        "instructions": "Giới hạn tải đầu vào và giữ tác vụ nhỏ có cơ hội chạy khi một nguồn gửi quá nhiều việc.",
        "requirements": [
          "Lấy luân phiên theo nguồn, giữ thứ tự trong mỗi nguồn.",
          "Nguồn rỗng không làm mất các phần tử còn lại."
        ]
      },
      "starterCode": "fn fair(a: &[u32], b: &[u32]) -> Vec<u32> { todo!() }\nfn main() {\nassert_eq!(fair(&[1,2,3],&[10]),vec![1,10,2,3]);\nassert_eq!(fair(&[],&[10,11]),vec![10,11]);\nassert!(fair(&[],&[]).is_empty());\nprintln!(\"Lịch: {:?}\",fair(&[1,2,3],&[10]));\n}",
      "solutionCode": "fn fair(a: &[u32], b: &[u32]) -> Vec<u32> {\n    let mut out = Vec::new();\n    for index in 0..a.len().max(b.len()) {\n        if let Some(&value) = a.get(index) { out.push(value); }\n        if let Some(&value) = b.get(index) { out.push(value); }\n    }\n    out\n}\nfn main() {\nassert_eq!(fair(&[1,2,3],&[10]),vec![1,10,2,3]);\nassert_eq!(fair(&[],&[10,11]),vec![10,11]);\nassert!(fair(&[],&[]).is_empty());\nprintln!(\"Lịch: {:?}\",fair(&[1,2,3],&[10]));\n}",
      "expectedOutput": "Lịch: [1, 10, 2, 3]",
      "hints": [
        "Lấy luân phiên theo nguồn, giữ thứ tự trong mỗi nguồn.",
        "Số tác vụ chạy và số tác vụ chờ cần giới hạn riêng."
      ],
      "quiz": {
        "question": "Pool có 4 worker nhưng queue không có trần. Đã bảo vệ RAM trước tải lớn chưa?",
        "options": ["Đã đủ vì chỉ 4 thread.", "Chưa; backlog chờ vẫn có thể tăng vô hạn.", "Đủ nếu dùng Mutex."],
        "correct": 1,
        "explanation": "Số tác vụ chạy và số tác vụ chờ cần giới hạn riêng."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/sync/mpsc/fn.sync_channel.html"
      }
    },
    {
      "id": "systems-memory-publication",
      "moduleId": "track-systems",
      "title": "Công bố dữ liệu và lựa chọn primitive đồng bộ",
      "description": "Phân biệt atomic counter, publication và invariant nhiều trường trước khi tối ưu lock.",
      "duration": 50,
      "objectives": [
        "Phân biệt atomic counter, publication và invariant nhiều trường trước khi tối ưu lock.",
        "Công bố giá trị qua OnceLock và chờ worker kết thúc.",
        "Lần set tiếp theo không được thay thế cấu hình đã công bố."
      ],
      "sections": [
        {
          "title": "Một biến nguyên tử chỉ bảo vệ thao tác trên nó",
          "text": "AtomicUsize::fetch_add tránh lost update cho một bộ đếm, nhưng không tự làm một Vec ở bên cạnh có thể bị sửa đồng thời. Relaxed phù hợp với một số counter không dùng để công bố dữ liệu khác, khi invariant chỉ cần giá trị nguyên tử. Nếu flag báo một cấu trúc đã sẵn sàng, phải có quan hệ đồng bộ giữa ghi dữ liệu và đọc dữ liệu, đồng thời lifetime và aliasing vẫn hợp lệ. Thấy một bool true không tự chứng minh mọi thứ bên cạnh đã có thể đọc an toàn."
        },
        {
          "title": "Release/Acquire không phải phép màu toàn cục",
          "text": "Release store và Acquire load có thể thiết lập quan hệ khi load quan sát đúng giá trị được công bố theo quy tắc memory model. Điều đó không khiến mọi thao tác trong chương trình có một thứ tự tổng chung, cũng không sửa việc hai writer sửa cùng vùng nhớ không có quyền. Trước khi chọn ordering, viết invariant và mũi tên dữ liệu cần đi từ producer tới consumer. Nếu chưa chứng minh được, dùng Mutex, channel hoặc OnceLock có abstraction phù hợp. Thay lock bằng vài atomic rời rạc có thể làm invariant nhiều trường bị quan sát giữa chừng."
        },
        {
          "title": "Tài nguyên một lần nên có kiểu biểu diễn một lần",
          "text": "Dữ liệu cấu hình đọc nhiều và chỉ khởi tạo một lần có thể dùng OnceLock thay cho tự viết flag cùng MaybeUninit. Cấu hình thay đổi cần snapshot bất biến có owner hoặc lock quanh cập nhật. Không giữ tham chiếu vào dữ liệu có thể bị thay thế mà lifetime chưa được bảo đảm. Với lock-free structure, còn có vấn đề thu hồi bộ nhớ và ABA; một pointer có cùng giá trị không chứng minh nó trỏ tới cùng đối tượng sống như trước. Những bài toán này cần chứng minh và công cụ phù hợp, không chỉ test stress vài giây.",
          "code": "fn publish() -> (u32, bool) {\n    let shared = std::sync::Arc::new(std::sync::OnceLock::<u32>::new());\n    let worker = shared.clone();\n    std::thread::spawn(move || worker.set(42).unwrap()).join().unwrap();\n    (*shared.get().unwrap(), shared.set(99).is_err())\n}"
        },
        {
          "title": "Thực hành chọn abstraction đủ mạnh",
          "text": "Bài tập khởi tạo OnceLock bằng một worker, join rồi đọc giá trị và xác nhận lần set thứ hai bị từ chối. Nó sử dụng primitive đã quản lý publication và lifetime thay vì tạo một ví dụ unsafe khó chứng minh. Trong Cargo, thêm test nhiều reader cùng chờ dữ liệu và trường hợp initialization thất bại theo chính sách của API. Với supervisor, counter byte có thể dùng cơ chế đơn giản còn trạng thái job nhiều trường cần mutex hoặc message. Đo contention trước khi tối ưu. Ghi lý do ordering và invariant vào review để người sau hiểu điều gì phải giữ khi sửa code."
        }
      ],
      "tip": "Atomicity của flag không thay thế quy tắc truy cập dữ liệu khác.",
      "exercise": {
        "title": "Công bố dữ liệu và lựa chọn primitive đồng bộ",
        "instructions": "Phân biệt atomic counter, publication và invariant nhiều trường trước khi tối ưu lock.",
        "requirements": [
          "Công bố giá trị qua OnceLock và chờ worker kết thúc.",
          "Lần set tiếp theo không được thay thế cấu hình đã công bố."
        ]
      },
      "starterCode": "fn publish() -> (u32, bool) { todo!() }\nfn main() {\nassert_eq!(publish(),(42,true));\nprintln!(\"Cấu hình công bố: {}\",publish().0);\n}",
      "solutionCode": "fn publish() -> (u32, bool) {\n    let shared = std::sync::Arc::new(std::sync::OnceLock::<u32>::new());\n    let worker = shared.clone();\n    std::thread::spawn(move || worker.set(42).unwrap()).join().unwrap();\n    (*shared.get().unwrap(), shared.set(99).is_err())\n}\nfn main() {\nassert_eq!(publish(),(42,true));\nprintln!(\"Cấu hình công bố: {}\",publish().0);\n}",
      "expectedOutput": "Cấu hình công bố: 42",
      "hints": [
        "Công bố giá trị qua OnceLock và chờ worker kết thúc.",
        "Atomicity của flag không thay thế quy tắc truy cập dữ liệu khác."
      ],
      "quiz": {
        "question": "Atomic flag Relaxed báo ready có tự cho phép đọc một Vec đang được thread khác sửa không?",
        "options": ["Có, atomic bảo vệ toàn struct.", "Có nếu chỉ có hai thread.", "Không; cần đồng bộ và ownership cho dữ liệu cùng invariant."],
        "correct": 2,
        "explanation": "Atomicity của flag không thay thế quy tắc truy cập dữ liệu khác."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/sync/atomic/enum.Ordering.html"
      }
    },
    {
      "id": "systems-ipc-framing",
      "moduleId": "track-systems",
      "title": "IPC cục bộ: giao thức, quyền và phiên kết nối",
      "description": "Thiết kế Unix socket có frame hữu hạn, lỗi rõ và ranh giới tin cậy được xác định.",
      "duration": 50,
      "objectives": [
        "Thiết kế Unix socket có frame hữu hạn, lỗi rõ và ranh giới tin cậy được xác định.",
        "Chỉ nhận key ASCII alphanumeric, '_' hoặc '-'.",
        "Giữ trần 32 byte và từ chối chuỗi rỗng/path-like."
      ],
      "sections": [
        {
          "title": "Cục bộ không đồng nghĩa được tin cậy",
          "text": "Một Unix domain socket cho các process trên cùng máy giao tiếp, nhưng mọi process cùng người dùng hoặc có quyền phù hợp có thể có khả năng kết nối tùy vị trí và quyền socket. Đặt socket trong thư mục riêng có quyền hạn chế, xác định ai được gọi lệnh và không giả định đường dẫn khó đoán là authentication. TCP loopback cũng không tự biết process nào ở phía kia. Nếu cần danh tính peer, dùng API và abstraction phù hợp nền tảng; không gọi một API nightly như thể đã có trên mọi bản stable."
        },
        {
          "title": "Frame và request có hai lớp validation",
          "text": "Lớp transport đọc length prefix, chặn kích thước và deadline. Lớp protocol kiểm tra opcode, số đối số, ID và miền giá trị. Dự án dùng PING, GET và PUT có expected_revision; một request hợp lệ về UTF-8 vẫn có thể sai ngữ nghĩa. Trả lỗi ngắn có mã thay vì dump cấu trúc nội bộ. Không để request truyền một đường dẫn tùy ý tới chức năng file nếu sản phẩm chỉ cần key/value. Quyền thực hiện hành động và tính hợp lệ của dữ liệu phải được kiểm tra tại handler có thẩm quyền."
        },
        {
          "title": "Phiên có ngân sách và thứ tự kết thúc",
          "text": "Mỗi connection cần trần số request, giới hạn payload và thời hạn tổng. Sau lỗi frame, đóng phiên vì không chắc byte tiếp theo bắt đầu ở đâu; sau lỗi request đã đọc trọn, có thể trả error rồi tiếp tục theo hợp đồng. Đọc và ghi đều có thể bị chặn, nên deadline wrapper cập nhật thời gian còn lại trước từng thao tác. Shutdown một phía cho phép báo gửi xong nhưng vẫn nhận phản hồi nếu protocol cần. Không giữ mutex state trong khi chờ byte từ client; chỉ khóa khi xử lý request đã đủ và có giới hạn.",
          "code": "fn valid_key(key: &str) -> bool {\n    !key.is_empty() && key.len() <= 32 && key.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'_' || b == b'-')\n}"
        },
        {
          "title": "Thực hành parser không làm quá quyền",
          "text": "Bài tập kiểm tra key ASCII tối đa 32 ký tự và parse revision trước khi cho phép PUT. Value có thể là Unicode nhưng bị giới hạn byte ở frame. Trong Cargo, dùng UnixStream::pair để test transport không phụ thuộc đường dẫn, rồi chạy demo UnixListener trong thư mục riêng của bài. Thêm ca frame ngắn, opcode lạ, key chứa khoảng trắng, revision sai và client gửi dở rồi đóng. Bản Windows cần adapter riêng với cơ chế quyền phù hợp; không đổi Unix socket thành một cổng mạng công khai cho tiện. Tài liệu bàn giao phải ghi rõ endpoint, trust boundary và hành vi khi phiên bị cắt."
        }
      ],
      "tip": "Vị trí local và tên endpoint không tự tạo authentication hay authorization.",
      "exercise": {
        "title": "IPC cục bộ: giao thức, quyền và phiên kết nối",
        "instructions": "Thiết kế Unix socket có frame hữu hạn, lỗi rõ và ranh giới tin cậy được xác định.",
        "requirements": [
          "Chỉ nhận key ASCII alphanumeric, '_' hoặc '-'.",
          "Giữ trần 32 byte và từ chối chuỗi rỗng/path-like."
        ]
      },
      "starterCode": "fn valid_key(key: &str) -> bool { todo!() }\nfn main() {\nassert!(valid_key(\"task_1\")); assert!(!valid_key(\"../task\"));\nassert!(!valid_key(\"\")); assert!(!valid_key(&\"a\".repeat(33))); assert!(!valid_key(\"hai tu\"));\nprintln!(\"Key task_1 hợp lệ\");\n}",
      "solutionCode": "fn valid_key(key: &str) -> bool {\n    !key.is_empty() && key.len() <= 32 && key.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'_' || b == b'-')\n}\nfn main() {\nassert!(valid_key(\"task_1\")); assert!(!valid_key(\"../task\"));\nassert!(!valid_key(\"\")); assert!(!valid_key(&\"a\".repeat(33))); assert!(!valid_key(\"hai tu\"));\nprintln!(\"Key task_1 hợp lệ\");\n}",
      "expectedOutput": "Key task_1 hợp lệ",
      "hints": [
        "Chỉ nhận key ASCII alphanumeric, '_' hoặc '-'.",
        "Vị trí local và tên endpoint không tự tạo authentication hay authorization."
      ],
      "quiz": {
        "question": "Unix socket trong /tmp có tên khó đoán đã đủ kiểm soát client chưa?",
        "options": ["Chưa; cần quyền thư mục/socket và chính sách danh tính/quyền phù hợp.", "Đủ vì chỉ process local.", "Đủ nếu payload có UTF-8."],
        "correct": 0,
        "explanation": "Vị trí local và tên endpoint không tự tạo authentication hay authorization."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/os/unix/net/struct.UnixStream.html"
      }
    },
    {
      "id": "systems-daemon-project",
      "moduleId": "track-systems",
      "title": "Dự án tổng hợp: dịch vụ IPC có trạng thái",
      "description": "Xây service cục bộ với UnixListener, framing, compare-and-set và deadline phiên.",
      "duration": 100,
      "objectives": [
        "Xây service cục bộ với UnixListener, framing, compare-and-set và deadline phiên.",
        "Tạo mới dùng revision 0, update cần expected khớp.",
        "Giới hạn value và tăng revision bằng checked_add."
      ],
      "sections": [
        {
          "title": "Chốt một dịch vụ nhỏ nhưng có hợp đồng thật",
          "text": "Dịch vụ quản lý tối đa 128 key/value trong RAM, hỗ trợ PING, GET và PUT có revision. Transport dùng Unix socket thật, header độ dài và UTF-8 payload. PUT key expected value chỉ commit khi expected khớp revision hiện tại; tạo mới dùng 0. GET trả revision và value, còn Missing/Conflict/Input là lỗi giao thức. Đây là phần lõi của một daemon cục bộ, chưa phải một hệ thống quản trị từ xa hoặc sandbox. Dữ liệu mẫu và socket chỉ nằm trong thư mục thử của dự án."
        },
        {
          "title": "Giới hạn phải bao quanh toàn đường đi",
          "text": "Mỗi frame tối đa 4096 byte, value tối đa 1024 byte, phiên tối đa mười request và deadline tổng hai giây trong bản demo. Handler giữ mutex ngắn để kiểm tra rồi commit; socket I/O diễn ra ngoài lock. Server mẫu phục vụ số connection hữu hạn để test kết thúc xác định. Khi mở rộng thành service lâu dài, thêm pool giới hạn, queue chờ, admission control và trạng thái shutdown. Không chỉ tăng số thread vô hạn rồi coi timeout riêng từng phiên đã bảo vệ mọi tài nguyên."
        },
        {
          "title": "Khôi phục và quyền thuộc adapter hệ điều hành",
          "text": "Demo tạo thư mục riêng với quyền hạn chế, bind socket rồi cleanup đúng tài nguyên do chính nó tạo. Không xóa một đường dẫn socket có sẵn của process khác chỉ để bind thành công. Sản phẩm cần quy trình xác định instance cũ, quyền owner và cơ chế singleton theo nền tảng. Dữ liệu RAM mất khi restart; ghép journal từ dự án trước nếu yêu cầu bền vững, và commit journal trước khi trả thành công. Cần quyết định behavior khi journal lỗi: từ chối mutation hoặc chuyển read-only, không âm thầm tiếp tục như đã lưu.",
          "code": "fn put(current: Option<(u64,String)>, expected: u64, value: &str) -> Result<(u64,String), &'static str> {\n    if value.len() > 1024 { return Err(\"qua-lon\"); }\n    let revision = current.as_ref().map_or(0, |x| x.0);\n    if revision != expected { return Err(\"conflict\"); }\n    Ok((revision.checked_add(1).ok_or(\"tran-so\")?, value.to_owned()))\n}"
        },
        {
          "title": "Nghiệm thu qua client thật và fixture",
          "text": "Cargo project cung cấp parser, state, framing, deadline wrapper và demo client/server dùng socket thật. Test partial read, frame quá lớn, CAS conflict, EOF giữa khung và response roundtrip. Capstone hoàn thiện bounded pool, shutdown/drain, persistence và log có giới hạn. Dùng client do dự án sở hữu, không kiểm thử trên dịch vụ lạ. Bàn giao protocol, bảng trạng thái lỗi, số đo concurrency và hướng dẫn restart/repair. Trên Windows, core/parser vẫn test được nhưng Unix adapter không biên dịch; cần triển khai và thử adapter tương ứng trước khi công bố hỗ trợ. Một API khả chuyển không làm mọi chính sách OS trở thành giống nhau. Mỗi nền tảng cần một bảng thử và một mô tả quyền riêng."
        }
      ],
      "tip": "Thành công phải phản ánh mức commit đã cam kết với caller, không chỉ một thay đổi tạm trong RAM.",
      "exercise": {
        "title": "Dự án tổng hợp: dịch vụ IPC có trạng thái",
        "instructions": "Xây service cục bộ với UnixListener, framing, compare-and-set và deadline phiên.",
        "requirements": [
          "Tạo mới dùng revision 0, update cần expected khớp.",
          "Giới hạn value và tăng revision bằng checked_add."
        ]
      },
      "starterCode": "fn put(current: Option<(u64,String)>, expected: u64, value: &str) -> Result<(u64,String), &'static str> { todo!() }\nfn main() {\nassert_eq!(put(None,0,\"A\"),Ok((1,\"A\".into())));\nassert_eq!(put(Some((1,\"A\".into())),0,\"B\"),Err(\"conflict\"));\nassert_eq!(put(None,0,&\"a\".repeat(1025)),Err(\"qua-lon\"));\nprintln!(\"PUT mới có revision 1\");\n}",
      "solutionCode": "fn put(current: Option<(u64,String)>, expected: u64, value: &str) -> Result<(u64,String), &'static str> {\n    if value.len() > 1024 { return Err(\"qua-lon\"); }\n    let revision = current.as_ref().map_or(0, |x| x.0);\n    if revision != expected { return Err(\"conflict\"); }\n    Ok((revision.checked_add(1).ok_or(\"tran-so\")?, value.to_owned()))\n}\nfn main() {\nassert_eq!(put(None,0,\"A\"),Ok((1,\"A\".into())));\nassert_eq!(put(Some((1,\"A\".into())),0,\"B\"),Err(\"conflict\"));\nassert_eq!(put(None,0,&\"a\".repeat(1025)),Err(\"qua-lon\"));\nprintln!(\"PUT mới có revision 1\");\n}",
      "expectedOutput": "PUT mới có revision 1",
      "hints": [
        "Tạo mới dùng revision 0, update cần expected khớp.",
        "Thành công phải phản ánh mức commit đã cam kết với caller, không chỉ một thay đổi tạm trong RAM."
      ],
      "quiz": {
        "question": "Service yêu cầu lưu bền. Khi journal lỗi, có nên trả PUT thành công sau khi chỉ đổi RAM không?",
        "options": ["Có, RAM nhanh hơn.", "Có nếu socket local.", "Không; phải theo hợp đồng lỗi/read-only và không báo đã lưu sai."],
        "correct": 2,
        "explanation": "Thành công phải phản ánh mức commit đã cam kết với caller, không chỉ một thay đổi tạm trong RAM."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/os/unix/net/struct.UnixListener.html"
      },
      "localLab": {
        "title": "Daemon IPC và client trên Unix",
        "instructions": "Core/framing kiểm thử trên host; Unix adapter dùng socket thật trên macOS/Linux. Demo tạo thư mục socket riêng, phục vụ một client do dự án sở hữu rồi đóng; capstone mở rộng thành service có bounded pool, journal và shutdown.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"systems_daemon\"\nversion = \"0.1.0\"\nedition = \"2024\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::{collections::BTreeMap,io::{self,Read,Write}};\npub const MAX_FRAME:usize=4096;\npub fn read_frame(reader:&mut impl Read)->io::Result<Option<Vec<u8>>> {\n    let mut header=[0u8;4];\n    loop {\n        match reader.read(&mut header[..1]) {\n            Ok(0)=>return Ok(None),Ok(_)=>break,\n            Err(e) if e.kind()==io::ErrorKind::Interrupted=>continue,\n            Err(e)=>return Err(e),\n        }\n    }\n    reader.read_exact(&mut header[1..])?;\n    let len=u32::from_be_bytes(header) as usize;\n    if len>MAX_FRAME { return Err(io::Error::new(io::ErrorKind::InvalidData,\"frame too large\")); }\n    let mut payload=vec![0;len]; reader.read_exact(&mut payload)?; Ok(Some(payload))\n}\npub fn write_frame(writer:&mut impl Write,payload:&[u8])->io::Result<()> {\n    if payload.len()>MAX_FRAME { return Err(io::Error::new(io::ErrorKind::InvalidInput,\"frame too large\")); }\n    writer.write_all(&(payload.len() as u32).to_be_bytes())?; writer.write_all(payload)\n}\n#[derive(Default)] pub struct Store { entries:BTreeMap<String,(u64,String)> }\nfn key_ok(key:&str)->bool { !key.is_empty() && key.len()<=32 && key.bytes().all(|b|b.is_ascii_alphanumeric()||b==b'_'||b==b'-') }\nimpl Store {\n    pub fn handle(&mut self,payload:&[u8])->Vec<u8> {\n        if payload.len()>MAX_FRAME { return b\"ERR INPUT\".to_vec(); }\n        let text=match std::str::from_utf8(payload) { Ok(s)=>s,Err(_)=>return b\"ERR UTF8\".to_vec() };\n        if text==\"PING\" { return b\"OK PONG\".to_vec(); }\n        if let Some(key)=text.strip_prefix(\"GET \") {\n            if !key_ok(key) { return b\"ERR INPUT\".to_vec(); }\n            return match self.entries.get(key) { Some((r,v))=>format!(\"OK {r} {v}\").into_bytes(),None=>b\"ERR MISSING\".to_vec() };\n        }\n        let parts:Vec<_>=text.splitn(4,' ').collect();\n        if parts.len()!=4 || parts[0]!=\"PUT\" || !key_ok(parts[1]) || parts[3].len()>1024 { return b\"ERR INPUT\".to_vec(); }\n        let expected=match parts[2].parse::<u64>() { Ok(n)=>n,Err(_)=>return b\"ERR INPUT\".to_vec() };\n        let current=self.entries.get(parts[1]).map_or(0,|x|x.0);\n        if expected!=current { return b\"ERR CONFLICT\".to_vec(); }\n        if !self.entries.contains_key(parts[1]) && self.entries.len()>=128 { return b\"ERR CAPACITY\".to_vec(); }\n        let next=match current.checked_add(1) { Some(n)=>n,None=>return b\"ERR OVERFLOW\".to_vec() };\n        self.entries.insert(parts[1].into(),(next,parts[3].into())); format!(\"OK {next}\").into_bytes()\n    }\n}\n#[cfg(unix)] pub mod unix {\n    use super::*; use std::{os::unix::net::UnixStream,sync::Mutex,time::{Duration,Instant}};\n    struct Deadline { stream:UnixStream,end:Instant }\n    impl Deadline {\n        fn remaining(&self)->io::Result<Duration> {\n            self.end.checked_duration_since(Instant::now()).filter(|d|!d.is_zero()).ok_or_else(||io::Error::new(io::ErrorKind::TimedOut,\"session deadline\"))\n        }\n    }\n    impl Read for Deadline {\n        fn read(&mut self,buffer:&mut [u8])->io::Result<usize> { self.stream.set_read_timeout(Some(self.remaining()?))?; self.stream.read(buffer) }\n    }\n    impl Write for Deadline {\n        fn write(&mut self,buffer:&[u8])->io::Result<usize> { self.stream.set_write_timeout(Some(self.remaining()?))?; self.stream.write(buffer) }\n        fn flush(&mut self)->io::Result<()> { self.stream.flush() }\n    }\n    pub fn serve_one(stream:UnixStream,state:&Mutex<Store>)->io::Result<()> {\n        let mut io=Deadline {stream,end:Instant::now()+Duration::from_secs(2)};\n        for _ in 0..10 {\n            let Some(request)=read_frame(&mut io)? else { return Ok(()); };\n            let response={state.lock().map_err(|_|io::Error::other(\"state poisoned\"))?.handle(&request)};\n            write_frame(&mut io,&response)?;\n        } Ok(())\n    }\n}\n#[cfg(test)] mod tests {\n    use super::*;\n    struct Chunks<'a> { bytes:&'a [u8] }\n    impl Read for Chunks<'_> {\n        fn read(&mut self,out:&mut [u8])->io::Result<usize> { let n=out.len().min(2).min(self.bytes.len()); out[..n].copy_from_slice(&self.bytes[..n]); self.bytes=&self.bytes[n..]; Ok(n) }\n    }\n    #[test] fn chunked_frame_and_eof() {\n        let mut wire=Vec::new(); write_frame(&mut wire,b\"PING\").unwrap(); let mut input=Chunks {bytes:&wire};\n        assert_eq!(read_frame(&mut input).unwrap(),Some(b\"PING\".to_vec())); assert_eq!(read_frame(&mut input).unwrap(),None);\n        for cut in 1..wire.len() { assert_eq!(read_frame(&mut &wire[..cut]).unwrap_err().kind(),io::ErrorKind::UnexpectedEof); }\n    }\n    #[test] fn oversized_and_invalid_protocol() {\n        assert_eq!(read_frame(&mut &[0,0,16,1][..]).unwrap_err().kind(),io::ErrorKind::InvalidData);\n        let mut s=Store::default(); assert_eq!(s.handle(b\"PUT ../a 0 x\"),b\"ERR INPUT\");\n        assert_eq!(s.handle(&[0xff]),b\"ERR UTF8\"); assert_eq!(s.handle(b\"GET absent\"),b\"ERR MISSING\");\n    }\n    #[test] fn compare_and_set_keeps_previous() {\n        let mut s=Store::default(); assert_eq!(s.handle(b\"PUT a 0 first\"),b\"OK 1\");\n        assert_eq!(s.handle(b\"PUT a 0 second\"),b\"ERR CONFLICT\"); assert_eq!(s.handle(b\"GET a\"),b\"OK 1 first\");\n    }\n    #[cfg(unix)] #[test] fn real_socket_roundtrip() {\n        use std::{os::unix::net::UnixStream,sync::Mutex,net::Shutdown,time::Duration};\n        let (mut client,server)=UnixStream::pair().unwrap(); client.set_read_timeout(Some(Duration::from_secs(3))).unwrap();\n        let worker=std::thread::spawn(move || unix::serve_one(server,&Mutex::new(Store::default())));\n        write_frame(&mut client,b\"PUT a 0 Rust\").unwrap(); assert_eq!(read_frame(&mut client).unwrap(),Some(b\"OK 1\".to_vec()));\n        write_frame(&mut client,b\"GET a\").unwrap(); assert_eq!(read_frame(&mut client).unwrap(),Some(b\"OK 1 Rust\".to_vec()));\n        client.shutdown(Shutdown::Write).unwrap(); worker.join().unwrap().unwrap();\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "#[cfg(unix)]\nfn main()->std::io::Result<()> {\n    use systems_daemon::{read_frame,write_frame,unix::serve_one,Store};\n    use std::{fs,os::unix::{fs::{DirBuilderExt,PermissionsExt},net::{UnixListener,UnixStream}},sync::Mutex,net::Shutdown,time::Duration};\n    let suffix=std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos();\n    // Short path also works on macOS, where Unix socket pathname length is limited.\n    let directory=std::path::PathBuf::from(\"/tmp\").join(format!(\"lr-{}-{suffix:x}\",std::process::id()));\n    fs::DirBuilder::new().mode(0o700).create(&directory)?;\n    struct Cleanup(std::path::PathBuf);\n    impl Drop for Cleanup { fn drop(&mut self) { let _=std::fs::remove_file(self.0.join(\"s\")); let _=std::fs::remove_dir(&self.0); } }\n    let _cleanup=Cleanup(directory.clone()); let endpoint=directory.join(\"s\");\n    let listener=UnixListener::bind(&endpoint)?; fs::set_permissions(&endpoint,fs::Permissions::from_mode(0o600))?;\n    let worker=std::thread::spawn(move || -> std::io::Result<()> {\n        let (stream,_)=listener.accept()?; serve_one(stream,&Mutex::new(Store::default()))\n    });\n    let mut client=UnixStream::connect(&endpoint)?; client.set_read_timeout(Some(Duration::from_secs(3)))?;\n    for request in [b\"PUT greeting 0 Xin chao\".as_slice(),b\"GET greeting\".as_slice()] {\n        write_frame(&mut client,request)?;\n        let response=read_frame(&mut client)?.ok_or_else(||std::io::Error::other(\"missing response\"))?;\n        println!(\"{}\",String::from_utf8_lossy(&response));\n    }\n    client.shutdown(Shutdown::Write)?; worker.join().map_err(|_|std::io::Error::other(\"server panicked\"))??; Ok(())\n}\n#[cfg(not(unix))]\nfn main() { eprintln!(\"Demo Unix socket cần macOS/Linux; core và framing vẫn kiểm thử được trên host này.\"); }\n"
          },
          {
            "path": "README.md",
            "content": "# Dịch vụ key/value cục bộ\n\nProtocol: header u32 BE chỉ độ dài, tối đa 4096 byte; payload UTF-8. PING → OK PONG. GET key → OK revision value hoặc ERR MISSING. PUT key expected value → OK revision hoặc ERR CONFLICT. Key 1..32 ASCII alphanumeric/'_'/'-'; value tối đa 1024 byte. Tạo mới expected=0, update đúng revision; tối đa 128 key. State hiện trong RAM.\n\nread_frame phân biệt EOF sạch trước header và UnexpectedEof giữa khung. Frame lỗi đóng phiên. Request sai sau khi đọc đủ trả ERR. Unix adapter dùng deadline tổng 2 giây cho cả đọc/ghi và tối đa 10 request mỗi connection; trước mỗi I/O tính lại thời gian còn lại. Mutex chỉ giữ khi handler xử lý đủ request, không giữ khi chờ socket.\n\nDemo bind UnixListener trong thư mục /tmp riêng tạo bằng create, mode 0700; socket mode 0600. Không xóa endpoint có sẵn của process khác. Cleanup chỉ xóa socket/thư mục do demo tạo. Một client gửi PUT rồi GET và shutdown phần ghi, server kết thúc xác định. Core không cần Unix, adapter được cfg(unix); Windows cần named-pipe hoặc adapter phù hợp quyền, chưa được triển khai ở đây.\n\nCapstone: thêm bounded worker pool/queue, admission Busy, job ID và shutdown ngừng accept rồi drain; gắn journal trước phản hồi thành công nếu cần durability. Test client chậm, frame dở, nhiều kết nối, lỗi lưu và restart. Nếu nhiều process cùng user không được phép truy cập, cần cơ chế danh tính/quyền mạnh hơn filesystem mode; peer credential là API đặc thù nền tảng và phải dùng thư viện/phiên bản được kiểm tra, không giả định std stable hỗ trợ trên mọi OS.\n\nKhông mở cổng công khai hoặc chạy test trên daemon khác. Bảng nghiệm thu phải ghi rõ host OS, số client, queue, deadline, p95, bộ nhớ và trạng thái các phần chưa hoàn thành.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run"
        ],
        "checks": [
          "Partial read và mọi vị trí EOF giữa khung trả đúng lỗi.",
          "Frame quá trần bị chặn trước allocation payload.",
          "CAS conflict giữ value cũ; key sai bị từ chối.",
          "UnixStream pair và UnixListener demo trao đổi thực; không gọi hạ tầng ngoài."
        ]
      }
    },
    {
      "id": "systems-kernel-lifetimes",
      "moduleId": "track-systems",
      "title": "Vòng đời thiết bị và giới hạn khi đi vào kernel",
      "description": "Phân tích teardown, callback và ngữ cảnh thực thi trước khi viết adapter kernel.",
      "duration": 50,
      "objectives": [
        "Phân tích teardown, callback và ngữ cảnh thực thi trước khi viết adapter kernel.",
        "Dying từ chối acquire mới nhưng cho release việc cũ.",
        "Chỉ remove khi Dying và không còn in-flight; tránh underflow."
      ],
      "sections": [
        {
          "title": "Kernel có hợp đồng môi trường riêng",
          "text": "Một crate no_std không tự là module kernel hợp lệ. Kernel có allocator, synchronization, lỗi, log, build system và quy tắc context riêng. Mã chạy trong interrupt, workqueue hay đường syscall có quyền chờ và điều kiện khóa khác nhau. Không mang thẳng std::thread, filesystem hoặc panic policy từ ứng dụng user space vào driver. Bài này tập trung vào mô hình lifetime và review; source kernel cần được build trong cây nguồn cùng cấu hình hỗ trợ, theo đúng API của phiên bản kernel đang dùng."
        },
        {
          "title": "Remove thiết bị là một cuộc đua với công việc đang bay",
          "text": "Thiết bị có thể bị tháo hoặc driver bị dừng khi callback, timer hay request còn chạy. Teardown cần ngừng nhận việc mới, hủy hoặc drain công việc đã xếp, vô hiệu nguồn callback và chỉ giải phóng tài nguyên khi không còn người dùng. Reference count giữ object sống nhưng không tự bảo đảm phần cứng còn hoạt động. State Dying giúp lời gọi mới bị từ chối ngay cả khi còn một reference hợp lệ. Tách lifetime bộ nhớ khỏi lifetime khả năng sử dụng thiết bị là điểm quan trọng trong thiết kế này."
        },
        {
          "title": "Lock và context phải được mô tả cùng nhau",
          "text": "Một khóa ngủ không được dùng tùy ý trong ngữ cảnh không cho phép ngủ; giữ spinlock rồi làm thao tác có thể chờ là lỗi thiết kế. Thứ tự khóa cũng phải nhất quán giữa đường bình thường và teardown. Khi callback lấy reference đến object, cần biết nó trả reference lúc nào và teardown chờ bằng cơ chế nào. Rust giúp biểu diễn ownership nhưng abstraction unsafe ở ranh giới kernel vẫn phải chứng minh các điều kiện của API C và phần cứng. Không thay bằng một raw pointer 'sống đủ lâu' nếu chưa có giao thức chứng minh điều đó.",
          "code": "#[derive(Debug)] struct Device { dying: bool, in_flight: usize }\nimpl Device {\n    fn acquire(&mut self) -> bool { if self.dying { false } else if let Some(n) = self.in_flight.checked_add(1) { self.in_flight=n; true } else { false } }\n    fn release(&mut self) -> bool { if self.in_flight==0 { false } else { self.in_flight-=1; true } }\n    fn can_remove(&self) -> bool { self.dying && self.in_flight==0 }\n}"
        },
        {
          "title": "Thực hành mô hình hóa trước adapter",
          "text": "Bài tập cho phép acquire chỉ khi Active, release giảm in_flight và finish_remove chỉ khi Dying cùng in_flight bằng 0. Cargo test pure Rust chạy race logic theo nhiều thứ tự sự kiện, không tải module hoặc truy cập thiết bị thật. Bước tiếp theo của capstone là viết hồ sơ state/owner/context và đối chiếu với abstraction kernel cụ thể trước khi triển khai. Nếu chưa có môi trường kernel thử riêng, ghi rõ phần này là chuẩn bị kiến thức, không đánh dấu driver đã hoạt động. Việc review được các đường remove, lỗi khởi tạo từng phần và callback trễ là bằng chứng sâu hơn một ví dụ chỉ có probe thành công."
        }
      ],
      "tip": "Cần state và giao thức teardown để từ chối việc mới trước khi giải phóng tài nguyên.",
      "exercise": {
        "title": "Vòng đời thiết bị và giới hạn khi đi vào kernel",
        "instructions": "Phân tích teardown, callback và ngữ cảnh thực thi trước khi viết adapter kernel.",
        "requirements": [
          "Dying từ chối acquire mới nhưng cho release việc cũ.",
          "Chỉ remove khi Dying và không còn in-flight; tránh underflow."
        ]
      },
      "starterCode": "#[derive(Debug)] struct Device { dying: bool, in_flight: usize }\nimpl Device {\nfn acquire(&mut self) -> bool { todo!() }\nfn release(&mut self) -> bool { todo!() }\nfn can_remove(&self) -> bool { todo!() }\n}\nfn main() {\nlet mut d=Device {dying:false,in_flight:0};\nassert!(d.acquire()); d.dying=true; assert!(!d.acquire()); assert!(!d.can_remove());\nassert!(d.release()); assert!(d.can_remove()); assert!(!d.release());\nprintln!(\"Remove chỉ sau khi hết việc đang bay\");\n}",
      "solutionCode": "#[derive(Debug)] struct Device { dying: bool, in_flight: usize }\nimpl Device {\n    fn acquire(&mut self) -> bool { if self.dying { false } else if let Some(n) = self.in_flight.checked_add(1) { self.in_flight=n; true } else { false } }\n    fn release(&mut self) -> bool { if self.in_flight==0 { false } else { self.in_flight-=1; true } }\n    fn can_remove(&self) -> bool { self.dying && self.in_flight==0 }\n}\nfn main() {\nlet mut d=Device {dying:false,in_flight:0};\nassert!(d.acquire()); d.dying=true; assert!(!d.acquire()); assert!(!d.can_remove());\nassert!(d.release()); assert!(d.can_remove()); assert!(!d.release());\nprintln!(\"Remove chỉ sau khi hết việc đang bay\");\n}",
      "expectedOutput": "Remove chỉ sau khi hết việc đang bay",
      "hints": [
        "Dying từ chối acquire mới nhưng cho release việc cũ.",
        "Cần state và giao thức teardown để từ chối việc mới trước khi giải phóng tài nguyên."
      ],
      "quiz": {
        "question": "Reference count còn lớn hơn 0 có chứng minh thiết bị vẫn cho phép thao tác mới không?",
        "options": ["Có, bộ nhớ sống là phần cứng còn hoạt động.", "Không; lifetime bộ nhớ khác trạng thái Active/Dying của thiết bị.", "Có nếu object là Pin."],
        "correct": 1,
        "explanation": "Cần state và giao thức teardown để từ chối việc mới trước khi giải phóng tài nguyên."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://docs.kernel.org/rust/general-information.html"
      }
    },
    {
      "id": "systems-performance-diagnostics",
      "moduleId": "track-systems",
      "title": "Chẩn đoán hiệu năng và hồ sơ bàn giao hệ thống",
      "description": "Phân biệt CPU, syscall, I/O và contention bằng số đo có điều kiện tái hiện.",
      "duration": 50,
      "objectives": [
        "Phân biệt CPU, syscall, I/O và contention bằng số đo có điều kiện tái hiện.",
        "Tính byte/giây từ microsecond bằng phép nhân checked.",
        "Từ chối thời gian 0 và tràn số."
      ],
      "sections": [
        {
          "title": "Tối ưu bắt đầu từ workload và mục tiêu",
          "text": "Một daemon xử lý request nhỏ khác công cụ quét file lớn hoặc worker nén dữ liệu. Đặt mục tiêu cụ thể như throughput, p95 latency, RSS hoặc thời gian shutdown dưới tải đã mô tả. Đo release build với cấu hình feature cố định, ghi CPU, OS, filesystem và kích thước dữ liệu. Debug build có mục đích phát triển nên không dùng để kết luận cuối về chi phí tối ưu. Giữ input fixture hoặc seed để lần sau tái hiện; thay dữ liệu và compiler cùng lúc khiến khó biết cải thiện đến từ đâu."
        },
        {
          "title": "Phân biệt thời gian chạy và thời gian chờ",
          "text": "CPU thấp nhưng latency cao có thể do I/O, lock contention, queue hoặc timeout, không có nghĩa thuật toán đủ nhanh. CPU cao có thể do parse, copy, allocation hoặc busy loop trên WouldBlock. Bắt đầu từ counter request/byte, queue depth và thời gian mỗi giai đoạn. Profiler và syscall tracing trên hệ điều hành thử giúp xác định giả thuyết, nhưng cần biết overhead và quyền sử dụng. Không đổi memory ordering chỉ để thấy benchmark nhỏ nhanh hơn khi invariant chưa được chứng minh; lỗi đồng thời hiếm có thể đắt hơn phần tiết kiệm đó."
        },
        {
          "title": "Tối ưu phải giữ đúng hành vi lỗi",
          "text": "Gom nhiều record thành batch giảm syscall nhưng thay đổi độ trễ commit và lượng dữ liệu có thể mất khi crash. Buffer lớn giảm số lần read nhưng tăng RAM mỗi connection. Nén log giảm I/O nhưng dùng CPU và có thể làm shutdown lâu hơn. Mỗi tối ưu cần nêu đánh đổi rồi chạy lại test về giới hạn, checksum, deadline và recovery liên quan. Không bỏ sync_all chỉ để tăng throughput mà vẫn giữ lời hứa durable commit cũ. Số đo chỉ có ý nghĩa khi hợp đồng mà người dùng nhận vẫn được ghi rõ.",
          "code": "fn bytes_per_second(bytes: u64, elapsed_us: u64) -> Option<u64> {\n    if elapsed_us == 0 { return None; }\n    bytes.checked_mul(1_000_000).map(|n| n / elapsed_us)\n}"
        },
        {
          "title": "Thực hành báo cáo có thể kiểm tra lại",
          "text": "Bài tập tính throughput nguyên từ byte và thời gian microsecond, kiểm tra thời gian bằng 0 và phép nhân tràn. Trong Cargo, tạo harness với warm-up, nhiều lần chạy và tổng byte được xác nhận để tránh đo việc không thực sự làm. Báo cáo ít nhất kích thước tải, số client/worker, trần queue, p50/p95/max và lỗi. Với capstone, thêm kịch bản client chậm, worker spam, journal tail dở và shutdown khi đang tải. Bàn giao source, lệnh chạy, fixture, manifest build cùng kết quả, để người khác xác định được giới hạn sản phẩm thay vì chỉ nhận một con số nhanh nhất."
        }
      ],
      "tip": "Tối ưu I/O không được âm thầm thay mức bảo đảm dữ liệu mà caller dựa vào.",
      "exercise": {
        "title": "Chẩn đoán hiệu năng và hồ sơ bàn giao hệ thống",
        "instructions": "Phân biệt CPU, syscall, I/O và contention bằng số đo có điều kiện tái hiện.",
        "requirements": [
          "Tính byte/giây từ microsecond bằng phép nhân checked.",
          "Từ chối thời gian 0 và tràn số."
        ]
      },
      "starterCode": "fn bytes_per_second(bytes: u64, elapsed_us: u64) -> Option<u64> { todo!() }\nfn main() {\nassert_eq!(bytes_per_second(1000,500000),Some(2000));\nassert_eq!(bytes_per_second(1,0),None);\nassert_eq!(bytes_per_second(u64::MAX,1),None);\nprintln!(\"Thông lượng: {} byte/s\",bytes_per_second(1000,500000).unwrap());\n}",
      "solutionCode": "fn bytes_per_second(bytes: u64, elapsed_us: u64) -> Option<u64> {\n    if elapsed_us == 0 { return None; }\n    bytes.checked_mul(1_000_000).map(|n| n / elapsed_us)\n}\nfn main() {\nassert_eq!(bytes_per_second(1000,500000),Some(2000));\nassert_eq!(bytes_per_second(1,0),None);\nassert_eq!(bytes_per_second(u64::MAX,1),None);\nprintln!(\"Thông lượng: {} byte/s\",bytes_per_second(1000,500000).unwrap());\n}",
      "expectedOutput": "Thông lượng: 2000 byte/s",
      "hints": [
        "Tính byte/giây từ microsecond bằng phép nhân checked.",
        "Tối ưu I/O không được âm thầm thay mức bảo đảm dữ liệu mà caller dựa vào."
      ],
      "quiz": {
        "question": "Bỏ sync_all làm journal nhanh hơn. Có thể giữ nguyên tuyên bố durable commit không?",
        "options": ["Không; hợp đồng durability đã đổi và cần công bố/kiểm chứng lại.", "Có vì write_all đã đủ cho mọi hệ thống.", "Có nếu file nhỏ."],
        "correct": 0,
        "explanation": "Tối ưu I/O không được âm thầm thay mức bảo đảm dữ liệu mà caller dựa vào."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/cargo/reference/profiles.html"
      }
    }
  ],
  "projects": [
    {
      "id": "systems-project-supervisor",
      "title": "Supervisor cho worker có hợp đồng",
      "description": "Chạy fixture process thật, giới hạn output và thời hạn, giữ trạng thái lỗi/timeout riêng.",
      "level": "guided",
      "estimatedHours": 10,
      "labLessonId": "systems-supervisor-project",
      "requirements": [
        "Dùng Command với args riêng và stdin rõ ràng.",
        "Drain đồng thời stdout/stderr, giữ prefix có trần.",
        "Timeout kill/wait direct child và thu kết quả reader.",
        "Nêu rõ giới hạn descendant và không gọi đây là sandbox."
      ],
      "milestones": [
        {
          "title": "Giao kèo",
          "tasks": [
            "Định nghĩa worker modes và Outcome.",
            "Validate timeout/capture limit."
          ],
          "acceptance": "Cấu hình sai bị chặn trước spawn."
        },
        {
          "title": "Vòng đời",
          "tasks": [
            "Thêm reader cho hai pipe.",
            "try_wait, timeout kill/wait và cleanup guard."
          ],
          "acceptance": "Spam vượt pipe buffer không deadlock; child được reap."
        },
        {
          "title": "Báo cáo",
          "tasks": [
            "Test ok/fail/spam/slow.",
            "Đo thời gian dừng và RAM giữ log."
          ],
          "acceptance": "Mọi kết quả có trạng thái và giới hạn được ghi rõ."
        }
      ],
      "testCases": [
        {
          "name": "Thành công",
          "setup": "Fixture ok",
          "expected": "Exit success, stdout đúng."
        },
        {
          "name": "Lỗi worker",
          "setup": "Fixture fail",
          "expected": "Exit 7, stderr đúng."
        },
        {
          "name": "Output lớn",
          "setup": "Spam hai pipe",
          "expected": "Capture đúng trần, truncated, vẫn drain."
        },
        {
          "name": "Quá thời hạn",
          "setup": "Fixture slow",
          "expected": "timed_out và direct child đã wait."
        }
      ],
      "rubric": [
        {
          "id": "systems-supervisor-rubric-1",
          "title": "Vòng đời OS",
          "criteria": [
            "Không bỏ Child mà chưa wait.",
            "Đường timeout dừng và reap."
          ],
          "critical": true
        },
        {
          "id": "systems-supervisor-rubric-2",
          "title": "Không deadlock",
          "criteria": [
            "Hai pipe được drain đồng thời.",
            "Đủ trần lưu không dừng đọc."
          ],
          "critical": true
        },
        {
          "id": "systems-supervisor-rubric-3",
          "title": "Hợp đồng kết quả",
          "criteria": [
            "Phân biệt spawn/exit/timeout/truncated.",
            "Args không bị ghép vào shell."
          ],
          "critical": false
        },
        {
          "id": "systems-supervisor-rubric-4",
          "title": "Phạm vi và bằng chứng",
          "criteria": [
            "Chỉ worker do dự án sở hữu.",
            "Ghi rõ descendant/CPU/RAM chưa được sandbox."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Cargo project với integration tests dùng binary chính.",
        "Bảng Outcome và lỗi.",
        "Báo cáo output/time/resource.",
        "Kế hoạch bounded pool và adapter process group/job object."
      ]
    },
    {
      "id": "systems-project-journal",
      "title": "Journal có kiểm tra và phục hồi",
      "description": "Thiết kế format nhị phân, replay và repair tail có lựa chọn; chứng minh hành vi qua lỗi từng byte.",
      "level": "independent",
      "estimatedHours": 18,
      "labLessonId": "systems-file-journal-project",
      "requirements": [
        "Format byte có endian, sequence, checksum và trần.",
        "Không dùng layout struct làm format file.",
        "Tail chưa đủ khác record hoàn chỉnh corrupt.",
        "Append lỗi khóa instance đến recovery; chỉ một owner ghi."
      ],
      "milestones": [
        {
          "title": "Format",
          "tasks": [
            "Viết encoder/parser và fixture.",
            "Test biên payload, số record và checksum."
          ],
          "acceptance": "Không panic hoặc allocation theo length chưa kiểm tra."
        },
        {
          "title": "Recovery",
          "tasks": [
            "Cắt mọi prefix record cuối.",
            "Thêm inspect không sửa và explicit repair."
          ],
          "acceptance": "Chỉ valid prefix được giữ; corrupt không âm thầm bỏ qua."
        },
        {
          "title": "Persistence",
          "tasks": [
            "Append, sync, reopen và tiếp tục sequence.",
            "Mô tả một writer và giới hạn filesystem."
          ],
          "acceptance": "Caller biết mức commit và cách xử lý I/O lỗi."
        }
      ],
      "testCases": [
        {
          "name": "Tail dở",
          "setup": "Cắt record hai tại mọi vị trí",
          "expected": "Record một còn nguyên, torn_tail đúng."
        },
        {
          "name": "Corrupt",
          "setup": "Lật byte payload đủ record",
          "expected": "Corrupt, không tự sửa."
        },
        {
          "name": "Repair rõ ràng",
          "setup": "Open false rồi true",
          "expected": "False từ chối; true cắt prefix và append tiếp."
        },
        {
          "name": "Giới hạn",
          "setup": "Payload 1025 byte",
          "expected": "TooLarge trước ghi."
        }
      ],
      "rubric": [
        {
          "id": "systems-journal-rubric-1",
          "title": "Đúng parser",
          "criteria": [
            "Checked bounds, endian và checksum.",
            "Không sử dụng data thiếu."
          ],
          "critical": true
        },
        {
          "id": "systems-journal-rubric-2",
          "title": "Đúng phục hồi",
          "criteria": [
            "Không nhập nhằng corrupt/torn.",
            "Không append tiếp sau write lỗi trên instance poisoned."
          ],
          "critical": true
        },
        {
          "id": "systems-journal-rubric-3",
          "title": "Dữ liệu bền",
          "criteria": [
            "Mức sync/commit được mô tả.",
            "Có giới hạn file và một writer."
          ],
          "critical": false
        },
        {
          "id": "systems-journal-rubric-4",
          "title": "Bàn giao",
          "criteria": [
            "Inspect read-only và backup trước repair.",
            "Fixture và lệnh replay tái hiện được."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Crate journal, demo và inspect mở rộng.",
        "Đặc tả byte/version và checksum.",
        "Bộ test cắt/corrupt/reopen.",
        "Quy trình backup/repair và báo cáo throughput/durability."
      ]
    },
    {
      "id": "systems-project-daemon",
      "title": "Dịch vụ IPC có trạng thái và vận hành",
      "description": "Hoàn thiện Unix daemon với framing, CAS, quyền filesystem, bounded pool, journal và shutdown.",
      "level": "capstone",
      "estimatedHours": 32,
      "labLessonId": "systems-daemon-project",
      "requirements": [
        "Unix socket thật, frame và request được kiểm tra riêng.",
        "Deadline tổng áp dụng đọc/ghi, state lock không giữ qua I/O.",
        "CAS không mất cập nhật; persistence trước success nếu đã cam kết.",
        "Hoàn thiện pool/drain/log/adapter theo hệ điều hành, không giả định mẫu một client là service production."
      ],
      "milestones": [
        {
          "title": "Protocol",
          "tasks": [
            "Viết client fixture và table lỗi.",
            "Test partial read/EOF/size/CAS."
          ],
          "acceptance": "Request sai không làm state đổi hoặc parser mất đồng bộ tùy tiện."
        },
        {
          "title": "Vận hành",
          "tasks": [
            "Thêm bounded queue/worker và Busy.",
            "Shutdown stop accept rồi drain theo deadline."
          ],
          "acceptance": "Accepted đối chiếu terminal/pending, RAM có trần."
        },
        {
          "title": "Dữ liệu và bàn giao",
          "tasks": [
            "Gắn journal/recovery và xử lý lỗi lưu.",
            "Đo client chậm, tải đồng thời và restart."
          ],
          "acceptance": "Có protocol, quyền, manifest OS và báo cáo giới hạn."
        }
      ],
      "testCases": [
        {
          "name": "Frame dở",
          "setup": "Client đóng giữa payload",
          "expected": "UnexpectedEof, phiên bị đóng."
        },
        {
          "name": "Update cũ",
          "setup": "PUT với revision không khớp",
          "expected": "Conflict và value cũ giữ nguyên."
        },
        {
          "name": "Client chậm",
          "setup": "Header/payload kéo dài",
          "expected": "Deadline tổng kết thúc phiên."
        },
        {
          "name": "Lỗi journal",
          "setup": "Mutation không thể commit bền",
          "expected": "Không báo success giả, theo chính sách read-only/error."
        }
      ],
      "rubric": [
        {
          "id": "systems-daemon-rubric-1",
          "title": "Giao thức và quyền",
          "criteria": [
            "Trần frame/request/connection được áp dụng.",
            "Endpoint có owner/quyền rõ, không xóa endpoint lạ."
          ],
          "critical": true
        },
        {
          "id": "systems-daemon-rubric-2",
          "title": "Nhất quán",
          "criteria": [
            "CAS và persistence theo hợp đồng.",
            "Shutdown không bỏ việc đã nhận không trạng thái."
          ],
          "critical": true
        },
        {
          "id": "systems-daemon-rubric-3",
          "title": "Tài nguyên",
          "criteria": [
            "Pool/queue/timeout có giới hạn.",
            "Lock không giữ qua socket I/O."
          ],
          "critical": false
        },
        {
          "id": "systems-daemon-rubric-4",
          "title": "Bằng chứng nền tảng",
          "criteria": [
            "Unix test thực và target khác được đánh dấu.",
            "Workload, p95/RSS và recovery tái hiện được."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Core, Unix adapter, client và bounded scheduler.",
        "Protocol/error/state specification.",
        "Journal integration và shutdown tests.",
        "Báo cáo hiệu năng, quyền endpoint, restart và platform limits."
      ]
    }
  ],
  "assessment": {
    "title": "Đánh giá năng lực lập trình hệ thống",
    "instructions": "Trả lời tình huống và tự nghiệm thu ba dự án bằng test lỗi, giới hạn tài nguyên và quy trình recovery. Phân biệt host user space, Unix adapter và kernel chưa được triển khai; điểm lý thuyết không thay bằng chứng vận hành.",
    "passPercent": 80,
    "questions": [
      {
        "id": "systems-exam-01",
        "question": "write_all lỗi sau khi file tăng kích thước. Caller có thể kết luận thao tác chưa có tác động không?",
        "options": ["Không; cần hợp đồng partial effect/recovery.", "Có vì Result là Err.", "Có nếu slice immutable."],
        "correct": 0,
        "explanation": "Lỗi I/O không rollback byte đã ghi; recovery phải kiểm tra trạng thái thật.",
        "lessonIds": [
          "systems-error-boundaries"
        ]
      },
      {
        "id": "systems-exam-02",
        "question": "Shutdown đã drop sender chính nhưng recv vẫn chờ. Nên tìm gì?",
        "options": ["Tên thread sai.", "Thêm thread mới.", "Sender clone còn được giữ và thứ tự drop/join."],
        "correct": 2,
        "explanation": "Channel chưa đóng nếu còn producer owner; sơ đồ tài nguyên giúp tìm vòng chờ.",
        "lessonIds": [
          "systems-shutdown-contract"
        ]
      },
      {
        "id": "systems-exam-03",
        "question": "Một read trả 2 byte của header 4 byte, không lỗi. Parser nên làm gì?",
        "options": ["Dùng hai byte còn lại bằng 0.", "Tiếp tục đọc đủ theo frame/deadline.", "Coi đó là cả message."],
        "correct": 1,
        "explanation": "Short read hợp lệ; phải tích lũy byte và phân biệt EOF giữa khung.",
        "lessonIds": [
          "systems-partial-io"
        ]
      },
      {
        "id": "systems-exam-04",
        "question": "Supervisor đạt trần capture stderr rồi bỏ đọc stderr. Worker tiếp tục ghi. Rủi ro?",
        "options": ["Stderr tự xóa byte cũ.", "Không có vì stdout vẫn đọc.", "Pipe đầy làm worker kẹt; cần drain hoặc dừng có chính sách."],
        "correct": 2,
        "explanation": "Giới hạn lưu không được vô tình biến thành ngừng drain pipe.",
        "lessonIds": [
          "systems-supervisor-project"
        ]
      },
      {
        "id": "systems-exam-05",
        "question": "Struct repr(C) được dump thẳng ra disk để dùng trên mọi target. Điều gì còn thiếu?",
        "options": ["Chỉ thêm derive Clone.", "Format endian/width/padding và validation riêng.", "Không thiếu gì."],
        "correct": 1,
        "explanation": "ABI layout không đồng nghĩa format bền vững đa nền tảng.",
        "lessonIds": [
          "systems-layout-alignment"
        ]
      },
      {
        "id": "systems-exam-06",
        "question": "Record đủ byte nhưng checksum sai; tail repair có nên cắt nó và báo thành công không?",
        "options": ["Không; Corrupt khác torn tail theo mô hình recovery.", "Nên nếu length nhỏ.", "Luôn nên vì record cuối."],
        "correct": 0,
        "explanation": "Bỏ dữ liệu lỗi âm thầm có thể che hỏng file và vi phạm hợp đồng phục hồi.",
        "lessonIds": [
          "systems-file-journal-project"
        ]
      },
      {
        "id": "systems-exam-07",
        "question": "Pool 4 worker có queue vô hạn và producer nhanh gấp mười. Giới hạn nào còn thiếu?",
        "options": ["Đổi String thành &str.", "Thêm tên worker.", "Backlog/queue và chính sách khi đầy."],
        "correct": 2,
        "explanation": "Pool chỉ giới hạn phần đang chạy, backlog vẫn có thể cạn RAM.",
        "lessonIds": [
          "systems-worker-fairness"
        ]
      },
      {
        "id": "systems-exam-08",
        "question": "Atomic bool Relaxed đổi thành true sau khi writer sửa Vec. Reader có thể đọc Vec không khóa ngay không?",
        "options": ["Không; phải chứng minh publication và quyền truy cập dữ liệu.", "Có vì flag atomic.", "Có nếu Vec ngắn."],
        "correct": 0,
        "explanation": "Atomicity trên flag không tự bảo vệ aliasing/lifetime hay đồng bộ dữ liệu khác.",
        "lessonIds": [
          "systems-memory-publication"
        ]
      },
      {
        "id": "systems-exam-09",
        "question": "Client local gửi length 2 GiB. Service nên cấp Vec rồi chờ payload không?",
        "options": ["Có vì local được tin.", "Không; kiểm tra trần trước allocation và deadline.", "Có nếu máy RAM nhiều."],
        "correct": 1,
        "explanation": "Local endpoint vẫn cần input budget và trust boundary.",
        "lessonIds": [
          "systems-ipc-framing"
        ]
      },
      {
        "id": "systems-exam-10",
        "question": "Daemon cam kết dữ liệu bền nhưng journal lỗi; RAM đã đổi. Response nào đúng?",
        "options": ["OK vì client có thể retry.", "Không báo success theo cam kết cũ; áp dụng lỗi/recovery được thiết kế.", "OK nếu process chưa chết."],
        "correct": 1,
        "explanation": "Mức success phải khớp durability; tránh trạng thái RAM và hợp đồng lệch nhau.",
        "lessonIds": [
          "systems-daemon-project"
        ]
      },
      {
        "id": "systems-exam-11",
        "question": "Device còn reference nhưng đã Dying. Có nhận request mới chỉ vì bộ nhớ chưa drop không?",
        "options": ["Có, reference chứng minh hardware hoạt động.", "Có nếu callback nhanh.", "Không; state thiết bị và lifetime bộ nhớ khác nhau."],
        "correct": 2,
        "explanation": "Teardown phải ngừng việc mới trước khi drain và giải phóng tài nguyên.",
        "lessonIds": [
          "systems-kernel-lifetimes"
        ]
      },
      {
        "id": "systems-exam-12",
        "question": "Tối ưu journal bỏ sync làm throughput tăng. Báo cáo phải nói gì?",
        "options": ["Nêu thay đổi durability và điều kiện đo; kiểm chứng hợp đồng mới.", "Nói mọi cam kết giữ nguyên.", "Chỉ nêu con số nhanh nhất."],
        "correct": 0,
        "explanation": "Hiệu năng phải được so cùng mức bảo đảm hoặc công bố rõ đánh đổi.",
        "lessonIds": [
          "systems-performance-diagnostics"
        ]
      }
    ],
    "skills": [
      {
        "id": "systems-skill-1",
        "title": "Tài nguyên, lỗi và shutdown",
        "description": "Mô tả trạng thái sau lỗi và cleanup. Ngừng nhận việc trước drain/reap.",
        "lessonIds": [
          "systems-resource-ownership",
          "systems-error-boundaries",
          "systems-shutdown-contract"
        ],
        "projectIds": [
          "systems-project-supervisor"
        ],
        "required": true
      },
      {
        "id": "systems-skill-2",
        "title": "Process và I/O có giới hạn",
        "description": "Xử lý read/write từng phần. Thu hồi direct child và log có trần.",
        "lessonIds": [
          "systems-processes-io",
          "systems-partial-io",
          "systems-supervisor-project"
        ],
        "projectIds": [
          "systems-project-supervisor"
        ],
        "required": true
      },
      {
        "id": "systems-skill-3",
        "title": "Layout và dữ liệu trên disk",
        "description": "Chứng minh alignment và invariant unsafe. Phân biệt torn tail với record corrupt.",
        "lessonIds": [
          "systems-memory-layout",
          "systems-layout-alignment",
          "systems-file-journal-project"
        ],
        "projectIds": [
          "systems-project-journal"
        ],
        "required": true
      },
      {
        "id": "systems-skill-4",
        "title": "Đồng thời và phân phối công việc",
        "description": "Giới hạn worker lẫn backlog. Giải thích publication, ownership và ordering.",
        "lessonIds": [
          "systems-concurrency-ordering",
          "systems-worker-fairness",
          "systems-memory-publication"
        ],
        "projectIds": [
          "systems-project-daemon"
        ],
        "required": true
      },
      {
        "id": "systems-skill-5",
        "title": "Biên OS và dịch vụ cục bộ",
        "description": "Kiểm tra frame/request/trust boundary. Xây Unix socket service và kế hoạch adapter khác.",
        "lessonIds": [
          "systems-os-boundaries",
          "systems-ipc-framing",
          "systems-daemon-project"
        ],
        "projectIds": [
          "systems-project-daemon"
        ],
        "required": true
      },
      {
        "id": "systems-skill-6",
        "title": "Kernel, chẩn đoán và bàn giao",
        "description": "Review teardown/context trước kernel adapter. Đo workload mà giữ đúng durability/giới hạn.",
        "lessonIds": [
          "systems-kernel-path",
          "systems-kernel-lifetimes",
          "systems-performance-diagnostics"
        ],
        "projectIds": [
          "systems-project-daemon"
        ],
        "required": true
      }
    ]
  }
};
