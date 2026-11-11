import type { TrackExpansion } from "../../specialization-types";

export const mobileExpansion: TrackExpansion = {
  "chapters": [
    {
      "id": "mobile-domain",
      "title": "Miền nghiệp vụ dùng chung",
      "description": "Một hợp đồng dữ liệu cho cả hai nền tảng.",
      "lessonIds": [
        "mobile-core-boundary",
        "mobile-domain-values",
        "mobile-boundary-design"
      ],
      "outcomes": [
        "Quy định đơn vị, định danh và lỗi có kiểu.",
        "Thiết kế snapshot/batch có revision và giới hạn."
      ]
    },
    {
      "id": "mobile-bridge",
      "title": "Object và bridge UniFFI",
      "description": "Chuyển API nghiệp vụ thành binding có vòng đời rõ ràng.",
      "lessonIds": [
        "mobile-uniffi-contract",
        "mobile-object-lifetime",
        "mobile-expense-project"
      ],
      "outcomes": [
        "Quản lý owner/lock và cleanup.",
        "Xuất Object, Record, Error từ một crate thực tế."
      ]
    },
    {
      "id": "mobile-artifacts",
      "title": "Target và kiểm thử xuyên ngôn ngữ",
      "description": "Kiểm tra từng bước từ host đến thiết bị.",
      "lessonIds": [
        "mobile-targets-bindings",
        "mobile-artifact-matrix",
        "mobile-contract-tests"
      ],
      "outcomes": [
        "Tách device/simulator/ABI và nguồn gốc artifact.",
        "Chạy fixture qua Rust, Swift và Kotlin."
      ]
    },
    {
      "id": "mobile-lifecycle",
      "title": "Vòng đời và công việc nền",
      "description": "Dừng đúng việc và giữ tiến độ qua restart.",
      "lessonIds": [
        "mobile-lifecycle-async",
        "mobile-cancellation-protocol",
        "mobile-background-sync"
      ],
      "outcomes": [
        "Kết hợp cancellation với generation.",
        "Checkpoint batch theo thời hạn nền tảng."
      ]
    },
    {
      "id": "mobile-offline",
      "title": "Ngoại tuyến và xung đột",
      "description": "Lưu thay đổi cùng outbox, giải quyết nhiều lịch sử.",
      "lessonIds": [
        "mobile-storage-adapters",
        "mobile-outbox-project",
        "mobile-conflict-resolution"
      ],
      "outcomes": [
        "Không mất pending khi crash hoặc ACK mất.",
        "Dùng revision/tombstone thay cho ghi đè âm thầm."
      ]
    },
    {
      "id": "mobile-product",
      "title": "Hiệu năng và sản phẩm dùng chung",
      "description": "Bàn giao ứng dụng với bằng chứng native và dữ liệu.",
      "lessonIds": [
        "mobile-release-performance",
        "mobile-observability",
        "mobile-catalog-project"
      ],
      "outcomes": [
        "Đo hành trình FFI và bộ nhớ.",
        "Hoàn thiện catalog có conflict, persistence và adapter."
      ]
    }
  ],
  "lessons": [
    {
      "id": "mobile-domain-values",
      "moduleId": "track-mobile",
      "title": "Kiểu miền dùng chung: tiền, thời gian và định danh",
      "description": "Thiết kế giá trị có đơn vị và quy tắc giống nhau trên iOS, Android và Rust.",
      "duration": 45,
      "objectives": [
        "Thiết kế giá trị có đơn vị và quy tắc giống nhau trên iOS, Android và Rust.",
        "Chỉ nhận 1–20 chữ số ASCII biểu diễn số dương.",
        "Từ chối định dạng không hợp lệ và tràn u64 bằng lỗi riêng."
      ],
      "sections": [
        {
          "title": "Đừng bắt đầu từ kiểu của giao diện",
          "text": "Màn hình có thể nhập số tiền bằng chuỗi theo locale, nhưng lõi nghiệp vụ nên nhận giá trị đã được phân tích theo hợp đồng. Dùng số nguyên cho đơn vị nhỏ nhất đã chọn và ghi rõ currency/scale; không truyền một float rồi để mỗi nền tảng tự làm tròn. Thời gian cũng cần ý nghĩa: thời điểm tuyệt đối, thời lượng và ngày lịch là các khái niệm khác nhau. Một ngày người dùng chọn không nên tự đổi thành nửa đêm UTC nếu nghiệp vụ thực sự dựa trên lịch địa phương."
        },
        {
          "title": "Hợp đồng phải quyết định các trường hợp biên",
          "text": "Định danh do client tạo cho thao tác phải ổn định qua retry và restart. Đừng dùng vị trí trong danh sách làm ID vì xóa một mục sẽ đổi vị trí các mục sau. Với tiêu đề, phân biệt số byte UTF-8, Unicode scalar và ký tự người nhìn thấy. chars().count đếm scalar, không luôn là số grapheme. Nếu quy tắc sản phẩm tính scalar thì ghi rõ, giữ cùng logic trong Rust và để UI hiển thị giới hạn phù hợp. Nếu cần grapheme, chọn thuật toán tương ứng thay vì khẳng định chars là đủ cho mọi ngôn ngữ."
        },
        {
          "title": "Tính toán phải thất bại trước khi sửa trạng thái",
          "text": "Khi cộng chi tiêu, checked_add phát hiện tràn; trạng thái chỉ được cập nhật sau khi phép tính và mọi validation thành công. Việc chèn record rồi mới tính tổng có thể để lại mục mới trong khi total cũ. Bài tập phân tích một chuỗi số nguyên dương ASCII, không nhận dấu phẩy, dấu chấm hoặc khoảng trắng ở giữa. UI chịu trách nhiệm chuyển định dạng địa phương thành biểu diễn này; core kiểm tra lại để bảo vệ mọi caller. Giới hạn số chữ số được kiểm tra trước khi parse để chi phí có trần.",
          "code": "fn amount(input: &str) -> Result<u64, &'static str> {\n    if input.is_empty() || input.len() > 20 || !input.bytes().all(|b| b.is_ascii_digit()) { return Err(\"dinh-dang\"); }\n    let value = input.parse::<u64>().map_err(|_| \"tran-so\")?;\n    if value == 0 { return Err(\"khong-duong\"); }\n    Ok(value)\n}"
        },
        {
          "title": "Kiểm thử chung cho hai ứng dụng",
          "text": "Tạo Cargo fixture gồm giá trị hợp lệ, số âm, ký tự Unicode giống chữ số, chuỗi rỗng và số vượt u64. Hai ứng dụng dùng cùng bộ fixture qua binding rồi so kết quả với Rust. Đừng viết lại parser trong Swift và Kotlin trừ khi đó là lớp nhập liệu theo locale; nếu có, cần test mapping tới hợp đồng core. Trong dự án chi tiêu, lưu ID, đơn vị, revision và lỗi có kiểu. Báo lỗi vào đúng trường nhập thay vì thay mọi lỗi bằng thông báo kết nối, vì người dùng cần biết thao tác nào có thể sửa ngay."
        }
      ],
      "tip": "Quy tắc độ dài phải nêu rõ byte, scalar hay grapheme và dùng nhất quán giữa các nền tảng.",
      "exercise": {
        "title": "Kiểu miền dùng chung: tiền, thời gian và định danh",
        "instructions": "Thiết kế giá trị có đơn vị và quy tắc giống nhau trên iOS, Android và Rust.",
        "requirements": [
          "Chỉ nhận 1–20 chữ số ASCII biểu diễn số dương.",
          "Từ chối định dạng không hợp lệ và tràn u64 bằng lỗi riêng."
        ]
      },
      "starterCode": "fn amount(input: &str) -> Result<u64, &'static str> { todo!() }\nfn main() {\nassert_eq!(amount(\"25000\"), Ok(25000));\nassert_eq!(amount(\"0\"), Err(\"khong-duong\"));\nassert_eq!(amount(\"25,000\"), Err(\"dinh-dang\"));\nassert_eq!(amount(\"１２\"), Err(\"dinh-dang\"));\nassert_eq!(amount(\"18446744073709551616\"), Err(\"tran-so\"));\nprintln!(\"Số tiền đơn vị nhỏ: {}\", amount(\"25000\").unwrap());\n}",
      "solutionCode": "fn amount(input: &str) -> Result<u64, &'static str> {\n    if input.is_empty() || input.len() > 20 || !input.bytes().all(|b| b.is_ascii_digit()) { return Err(\"dinh-dang\"); }\n    let value = input.parse::<u64>().map_err(|_| \"tran-so\")?;\n    if value == 0 { return Err(\"khong-duong\"); }\n    Ok(value)\n}\nfn main() {\nassert_eq!(amount(\"25000\"), Ok(25000));\nassert_eq!(amount(\"0\"), Err(\"khong-duong\"));\nassert_eq!(amount(\"25,000\"), Err(\"dinh-dang\"));\nassert_eq!(amount(\"１２\"), Err(\"dinh-dang\"));\nassert_eq!(amount(\"18446744073709551616\"), Err(\"tran-so\"));\nprintln!(\"Số tiền đơn vị nhỏ: {}\", amount(\"25000\").unwrap());\n}",
      "expectedOutput": "Số tiền đơn vị nhỏ: 25000",
      "hints": [
        "Chỉ nhận 1–20 chữ số ASCII biểu diễn số dương.",
        "Quy tắc độ dài phải nêu rõ byte, scalar hay grapheme và dùng nhất quán giữa các nền tảng."
      ],
      "quiz": {
        "question": "chars().count có luôn bằng số ký tự người dùng nhìn thấy không?",
        "options": [
          "Không; nó đếm Unicode scalar, khác grapheme trong một số chuỗi.",
          "Có với mọi Unicode.",
          "Chỉ khác trên Android."
        ],
        "correct": 0,
        "explanation": "Quy tắc độ dài phải nêu rõ byte, scalar hay grapheme và dùng nhất quán giữa các nền tảng."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/primitive.str.html#method.chars"
      }
    },
    {
      "id": "mobile-boundary-design",
      "moduleId": "track-mobile",
      "title": "API qua FFI theo thao tác nghiệp vụ",
      "description": "Giảm lời gọi qua biên và giữ dữ liệu nhất quán bằng snapshot, batch và revision.",
      "duration": 45,
      "objectives": [
        "Giảm lời gọi qua biên và giữ dữ liệu nhất quán bằng snapshot, batch và revision.",
        "Trả các khoảng [start,end) không chồng lấn, phủ hết dữ liệu.",
        "Chỉ chấp nhận page size 1..64 và xử lý danh sách rỗng."
      ],
      "sections": [
        {
          "title": "Một API tốt diễn đạt việc người dùng làm",
          "text": "Nếu thêm một mục cần gọi set_title, set_amount, append rồi recalculate, lỗi hoặc lifecycle chen giữa các lời gọi có thể để dữ liệu nửa chừng. API add_expense nhận toàn bộ dữ liệu cần thiết, kiểm tra và commit một lần. Giao diện không cần biết map, mutex hay cách core tính tổng. Điều này giúp hai nền tảng giữ cùng quy tắc và giảm số lần serialize. Không gom mọi thứ thành một hàm JSON khổng lồ: kiểu request và lỗi rõ ràng vẫn giúp compiler và test phát hiện thay đổi hợp đồng."
        },
        {
          "title": "Snapshot có revision là một đơn vị quan sát",
          "text": "UI thường cần total và danh sách cùng một thời điểm. Hai lời gọi độc lập có thể thấy hai trạng thái khác nhau khi có cập nhật đồng thời. Trả Snapshot gồm revision, total và items giúp caller hiểu các trường thuộc cùng lần quan sát. Với danh sách lớn, phân trang phải gắn vào snapshot hoặc có quy tắc thay đổi dữ liệu được công bố. Cursor chỉ là offset không đủ nếu mục mới được chèn ở đầu giữa hai lần tải. Không hứa không trùng/không bỏ sót khi implementation chưa bảo đảm điều đó."
        },
        {
          "title": "Giới hạn chi phí ở cả hai phía",
          "text": "Một Vec được trả qua FFI có thể được sao chép hoặc chuyển đổi thành các object phía ngôn ngữ đích. Mười nghìn bản ghi nhỏ vẫn có thể gây khựng UI. Chọn page size tối đa, không chỉ tin size do caller gửi. Batch giảm overhead nhưng batch quá lớn làm tăng bộ nhớ đỉnh và thời gian giữ lock. Bài tập chia số phần tử thành các đoạn tối đa 64, từ chối size bằng 0 hoặc vượt trần và không dùng phép cộng có thể tràn. Đo chi phí thực tế trước khi chọn một ngưỡng sản phẩm. Bản luyện tập giới hạn cả tổng dữ liệu ở 10.000 phần tử.",
          "code": "fn pages(total: usize, size: usize) -> Result<Vec<(usize, usize)>, &'static str> {\n    if total > 10_000 { return Err(\"so-luong\"); }\n    if size == 0 || size > 64 { return Err(\"kich-thuoc\"); }\n    let mut out = Vec::new(); let mut start = 0;\n    while start < total { let end = start.saturating_add(size).min(total); out.push((start, end)); start = end; }\n    Ok(out)\n}"
        },
        {
          "title": "Thử hợp đồng ở điểm có cạnh tranh",
          "text": "Trong Cargo, tạo test hai writer cùng expected_revision; chỉ một thao tác được chấp nhận, thao tác còn lại nhận Conflict và trạng thái không bị sửa. Giữ lock trong phần kiểm tra và commit, nhưng không gọi network hoặc callback ngoại ngữ khi đang giữ lock. Trả dữ liệu sở hữu độc lập để UI không giữ borrow vào cấu trúc nội bộ. Trong Swift/Kotlin, kiểm tra màn hình sau khi refresh trễ và sau khi bấm lưu hai lần. Bài toán ở đây là một ranh giới nghiệp vụ có thể sử dụng được, không chỉ làm cho generator sinh mã thành công."
        }
      ],
      "tip": "Một đơn vị quan sát nhất quán giúp UI không ghép dữ liệu từ hai thời điểm.",
      "exercise": {
        "title": "API qua FFI theo thao tác nghiệp vụ",
        "instructions": "Giảm lời gọi qua biên và giữ dữ liệu nhất quán bằng snapshot, batch và revision.",
        "requirements": [
          "Trả các khoảng [start,end) không chồng lấn, phủ hết dữ liệu.",
          "Chỉ chấp nhận page size 1..64 và xử lý danh sách rỗng."
        ]
      },
      "starterCode": "fn pages(total: usize, size: usize) -> Result<Vec<(usize, usize)>, &'static str> { todo!() }\nfn main() {\nassert_eq!(pages(130, 64), Ok(vec![(0,64),(64,128),(128,130)]));\nassert_eq!(pages(0, 64), Ok(vec![]));\nassert_eq!(pages(1, 0), Err(\"kich-thuoc\"));\nassert_eq!(pages(1, 65), Err(\"kich-thuoc\"));\nassert_eq!(pages(10_001, 64), Err(\"so-luong\"));\nprintln!(\"Số trang: {}\", pages(130, 64).unwrap().len());\n}",
      "solutionCode": "fn pages(total: usize, size: usize) -> Result<Vec<(usize, usize)>, &'static str> {\n    if total > 10_000 { return Err(\"so-luong\"); }\n    if size == 0 || size > 64 { return Err(\"kich-thuoc\"); }\n    let mut out = Vec::new(); let mut start = 0;\n    while start < total { let end = start.saturating_add(size).min(total); out.push((start, end)); start = end; }\n    Ok(out)\n}\nfn main() {\nassert_eq!(pages(130, 64), Ok(vec![(0,64),(64,128),(128,130)]));\nassert_eq!(pages(0, 64), Ok(vec![]));\nassert_eq!(pages(1, 0), Err(\"kich-thuoc\"));\nassert_eq!(pages(1, 65), Err(\"kich-thuoc\"));\nassert_eq!(pages(10_001, 64), Err(\"so-luong\"));\nprintln!(\"Số trang: {}\", pages(130, 64).unwrap().len());\n}",
      "expectedOutput": "Số trang: 3",
      "hints": [
        "Trả các khoảng [start,end) không chồng lấn, phủ hết dữ liệu.",
        "Một đơn vị quan sát nhất quán giúp UI không ghép dữ liệu từ hai thời điểm."
      ],
      "quiz": {
        "question": "Vì sao total và items nên trả trong cùng Snapshot?",
        "options": [
          "Để tránh mọi allocation.",
          "Vì Swift không gọi được hai hàm.",
          "Để chúng thuộc cùng trạng thái có revision, tránh hai lần đọc lệch nhau."
        ],
        "correct": 2,
        "explanation": "Một đơn vị quan sát nhất quán giúp UI không ghép dữ liệu từ hai thời điểm."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://mozilla.github.io/uniffi-rs/latest/types/records.html"
      }
    },
    {
      "id": "mobile-object-lifetime",
      "moduleId": "track-mobile",
      "title": "Vòng đời object, khóa và lời gọi ngược",
      "description": "Quản lý tài nguyên Rust khi nhiều màn hình và thread cùng dùng một UniFFI object.",
      "duration": 45,
      "objectives": [
        "Quản lý tài nguyên Rust khi nhiều màn hình và thread cùng dùng một UniFFI object.",
        "Dùng hai strong owner và một Weak để quan sát lifetime.",
        "Chỉ kết luận object đã mất sau khi strong owner cuối cùng bị drop."
      ],
      "sections": [
        {
          "title": "Object qua FFI không trở thành giá trị thuần",
          "text": "Record thường biểu diễn dữ liệu trả về, còn UniFFI Object giữ một đối tượng Rust được chia sẻ bằng tham chiếu. Một wrapper của màn hình biến mất không chứng minh mọi owner Rust đã được giải phóng. Callback, job đang chạy hoặc object khác có thể còn giữ tham chiếu. Hãy lập sơ đồ owner: application session sở hữu repository, màn hình nhận service và job sở hữu token riêng. Khi màn hình đóng, hủy việc của màn hình và bỏ liên kết UI; dữ liệu dùng chung có thể vẫn cần sống cho màn hình khác."
        },
        {
          "title": "Đồng thời cần quy tắc ngoài Arc",
          "text": "Arc chỉ quản lý số tham chiếu, không tự cho phép sửa dữ liệu an toàn. Object xuất ra phải phù hợp yêu cầu Send/Sync và dùng Mutex, RwLock hoặc mô hình actor nếu cần trạng thái thay đổi. Lock nên bảo vệ invariant ngắn và có thứ tự nhất quán. Không gọi callback Swift/Kotlin trong lúc giữ lock: callback có thể gọi ngược một method cần cùng lock, tạo deadlock. Sao chép kết quả hoặc lấy danh sách thông báo trong vùng khóa, thả guard rồi mới gọi phía ngoài."
        },
        {
          "title": "Cleanup phải gắn với owner cụ thể",
          "text": "Kotlin wrapper hỗ trợ close/use theo phiên bản binding; danh sách chứa nhiều object có thể cần đóng từng phần tử. Không giả định garbage collector giải phóng tài nguyên native đúng thời điểm màn hình rời đi. Swift dùng ARC nhưng chu trình tham chiếu qua closure vẫn cần thiết kế. Cleanup cũng khác cancellation: đóng một wrapper không tự hoàn tất một lời gọi khác đang chạy. API cancel phải diễn tả việc ngừng nhận công việc và bỏ kết quả, còn release là giảm quyền sở hữu tài nguyên. Tách hai hành vi trong test để tránh nhầm rằng không còn màn hình nghĩa là không còn task.",
          "code": "fn owner_trace() -> (usize, bool, bool) {\n    let a = std::sync::Arc::new(String::from(\"session\"));\n    let weak = std::sync::Arc::downgrade(&a);\n    let b = a.clone(); let count = std::sync::Arc::strong_count(&a);\n    drop(a); let alive = weak.upgrade().is_some();\n    drop(b); let gone = weak.upgrade().is_none();\n    (count, alive, gone)\n}"
        },
        {
          "title": "Thực hành đếm owner và điểm kết thúc",
          "text": "Bài tập dùng Arc và Weak để quan sát một object chỉ biến mất khi owner cuối cùng bị drop. Nó không truy cập UI và không giả lập bộ gom rác của nền tảng. Trong Cargo project, thêm test nhiều thread gọi snapshot/add và test callback được thực hiện sau khi lock đã thả. Trên thiết bị, mở đóng màn hình nhiều lần, quan sát số job, wrapper và bộ nhớ native sau khi nghỉ. Một đồ thị RAM chưa quay về ngay không tự chứng minh leak, nhưng xu hướng tăng không giới hạn cần truy ra owner còn giữ tài nguyên."
        }
      ],
      "tip": "Lấy dữ liệu cần thông báo trong vùng khóa rồi thả guard trước khi gọi mã bên ngoài.",
      "exercise": {
        "title": "Vòng đời object, khóa và lời gọi ngược",
        "instructions": "Quản lý tài nguyên Rust khi nhiều màn hình và thread cùng dùng một UniFFI object.",
        "requirements": [
          "Dùng hai strong owner và một Weak để quan sát lifetime.",
          "Chỉ kết luận object đã mất sau khi strong owner cuối cùng bị drop."
        ]
      },
      "starterCode": "fn owner_trace() -> (usize, bool, bool) { todo!() }\nfn main() {\nassert_eq!(owner_trace(), (2, true, true));\nprintln!(\"Object được giải phóng sau owner cuối\");\n}",
      "solutionCode": "fn owner_trace() -> (usize, bool, bool) {\n    let a = std::sync::Arc::new(String::from(\"session\"));\n    let weak = std::sync::Arc::downgrade(&a);\n    let b = a.clone(); let count = std::sync::Arc::strong_count(&a);\n    drop(a); let alive = weak.upgrade().is_some();\n    drop(b); let gone = weak.upgrade().is_none();\n    (count, alive, gone)\n}\nfn main() {\nassert_eq!(owner_trace(), (2, true, true));\nprintln!(\"Object được giải phóng sau owner cuối\");\n}",
      "expectedOutput": "Object được giải phóng sau owner cuối",
      "hints": [
        "Dùng hai strong owner và một Weak để quan sát lifetime.",
        "Lấy dữ liệu cần thông báo trong vùng khóa rồi thả guard trước khi gọi mã bên ngoài."
      ],
      "quiz": {
        "question": "Có Arc<Mutex<State>>. Nên gọi callback UI trong lúc giữ mutex không?",
        "options": [
          "Có, Arc tự ngăn deadlock.",
          "Không; callback có thể gọi ngược API và chờ cùng mutex.",
          "Có nếu callback viết bằng Swift."
        ],
        "correct": 1,
        "explanation": "Lấy dữ liệu cần thông báo trong vùng khóa rồi thả guard trước khi gọi mã bên ngoài."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://mozilla.github.io/uniffi-rs/latest/types/interfaces.html"
      }
    },
    {
      "id": "mobile-expense-project",
      "moduleId": "track-mobile",
      "title": "Dự án: lõi chi tiêu với UniFFI Object",
      "description": "Xây API trạng thái có revision, lỗi có kiểu và binding Swift/Kotlin từ một crate.",
      "duration": 100,
      "objectives": [
        "Xây API trạng thái có revision, lỗi có kiểu và binding Swift/Kotlin từ một crate.",
        "Đối chiếu revision trước khi tính cập nhật.",
        "Chỉ trả tổng/revision mới khi mọi phép tính hợp lệ."
      ],
      "sections": [
        {
          "title": "Phạm vi của lõi dùng chung",
          "text": "Dự án quản lý các khoản chi trong một đơn vị tiền đã chọn, không tự làm chuyển đổi ngoại tệ hoặc định dạng theo locale. Mỗi Expense có ID ổn định, nhãn và amount_minor là số nguyên dương. Snapshot trả revision, total và danh sách theo thứ tự ID. Giới hạn một nghìn mục và nhãn 128 scalar giữ chi phí có trần. UI nhập liệu, màu sắc và định dạng thuộc ứng dụng native; quy tắc ID, tổng tiền, xung đột và giới hạn nằm trong Rust để hai nền tảng dùng cùng hành vi."
        },
        {
          "title": "Cập nhật có điều kiện và không sửa một phần",
          "text": "ExpenseBook là UniFFI Object giữ Mutex<State>. add và remove nhận expected_revision; mismatch trả Conflict trước khi sửa. add kiểm tra ID, nhãn, số tiền, trùng ID, tổng mới và revision mới, rồi mới commit. Nếu overflow, không có mục mới và total không đổi. snapshot lấy dữ liệu trong cùng vùng khóa để các trường nhất quán. Lỗi dự kiến như InvalidInput, Duplicate hay Conflict là enum xuất qua UniFFI. Không dùng panic để báo người dùng nhập sai, bởi hành vi panic qua FFI không phải một giao thức nghiệp vụ ổn định."
        },
        {
          "title": "Sinh và dùng binding đúng bộ artifact",
          "text": "Cargo project cố định UniFFI 0.32.2, tạo cdylib, staticlib và rlib; binary bindgen chỉ bật khi có feature tương ứng. Sau cargo build, sinh Swift/Kotlin từ thư viện host để kiểm tra metadata. Native app cần library được build đúng target và binding cùng phiên bản, không dùng dylib macOS cho iOS. README đi kèm mô tả ánh xạ constructor, method, lỗi và snapshot, cùng các lệnh tạo binding. Việc sinh thành công chứng minh một bước trong pipeline, chưa chứng minh linker, package hoặc UI trên điện thoại hoạt động. Lab kèm consumer Swift và Kotlin/JVM cùng script biên dịch, chạy và kiểm tra lỗi có kiểu. Gradle khai báo JNA cụ thể; hướng dẫn native đi kèm có modulemap, XCFramework và ABI Android để người học thực hiện toàn bộ bước tích hợp trong dự án.",
          "code": "fn add_total(current: u64, amount: u64, revision: u64, expected: u64) -> Result<(u64,u64), &'static str> {\n    if revision != expected { return Err(\"conflict\"); }\n    if amount == 0 { return Err(\"amount\"); }\n    let total = current.checked_add(amount).ok_or(\"overflow\")?;\n    let next = revision.checked_add(1).ok_or(\"revision\")?;\n    Ok((total,next))\n}"
        },
        {
          "title": "Nghiệm thu từ lõi tới ứng dụng",
          "text": "Chạy cargo test cho duplicate, overflow, revision conflict, remove không tồn tại và hai thread cùng ghi. Sau đó thực hiện chuỗi thêm, đọc, xóa qua Swift và Kotlin bằng dữ liệu giống fixture. Lưu lỗi theo kiểu để UI chỉ hiện thông báo phù hợp trường hoặc yêu cầu refresh khi Conflict. Không gọi thao tác lớn trên main thread chỉ vì method nhìn giống hàm native. Bản mẫu giữ dữ liệu trong RAM; dự án outbox kế tiếp bổ sung lưu bền và đồng bộ. Báo cáo phải ghi rõ đóng app sẽ mất dữ liệu ở bản này, tránh nhầm một API demo với sổ chi tiêu đã sẵn sàng phát hành. Người dùng cần thấy trạng thái lưu rõ ràng."
        }
      ],
      "tip": "Tính mọi giá trị mới trước commit để lỗi không tạo trạng thái một phần.",
      "exercise": {
        "title": "Dự án: lõi chi tiêu với UniFFI Object",
        "instructions": "Xây API trạng thái có revision, lỗi có kiểu và binding Swift/Kotlin từ một crate.",
        "requirements": [
          "Đối chiếu revision trước khi tính cập nhật.",
          "Chỉ trả tổng/revision mới khi mọi phép tính hợp lệ."
        ]
      },
      "starterCode": "fn add_total(current: u64, amount: u64, revision: u64, expected: u64) -> Result<(u64,u64), &'static str> { todo!() }\nfn main() {\nassert_eq!(add_total(100, 50, 7, 7), Ok((150,8)));\nassert_eq!(add_total(100, 50, 7, 6), Err(\"conflict\"));\nassert_eq!(add_total(u64::MAX, 1, 7, 7), Err(\"overflow\"));\nassert_eq!(add_total(100, 0, 7, 7), Err(\"amount\"));\nprintln!(\"Tổng mới: {}\", add_total(100, 50, 7, 7).unwrap().0);\n}",
      "solutionCode": "fn add_total(current: u64, amount: u64, revision: u64, expected: u64) -> Result<(u64,u64), &'static str> {\n    if revision != expected { return Err(\"conflict\"); }\n    if amount == 0 { return Err(\"amount\"); }\n    let total = current.checked_add(amount).ok_or(\"overflow\")?;\n    let next = revision.checked_add(1).ok_or(\"revision\")?;\n    Ok((total,next))\n}\nfn main() {\nassert_eq!(add_total(100, 50, 7, 7), Ok((150,8)));\nassert_eq!(add_total(100, 50, 7, 6), Err(\"conflict\"));\nassert_eq!(add_total(u64::MAX, 1, 7, 7), Err(\"overflow\"));\nassert_eq!(add_total(100, 0, 7, 7), Err(\"amount\"));\nprintln!(\"Tổng mới: {}\", add_total(100, 50, 7, 7).unwrap().0);\n}",
      "expectedOutput": "Tổng mới: 150",
      "hints": [
        "Đối chiếu revision trước khi tính cập nhật.",
        "Tính mọi giá trị mới trước commit để lỗi không tạo trạng thái một phần."
      ],
      "quiz": {
        "question": "add gặp overflow sau khi validation. Trạng thái đúng là gì?",
        "options": [
          "Có mục mới nhưng total giữ nguyên.",
          "Reset total về 0.",
          "Không thay đổi mục, total hoặc revision."
        ],
        "correct": 2,
        "explanation": "Tính mọi giá trị mới trước commit để lỗi không tạo trạng thái một phần."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://mozilla.github.io/uniffi-rs/latest/proc_macro/interfaces.html"
      },
      "localLab": {
        "title": "ExpenseBook dùng chung qua UniFFI",
        "instructions": "Dự án xuất Object, Record và Error thật qua UniFFI. Chạy test host, sinh binding, rồi dùng hướng dẫn kèm theo để tích hợp đúng target. Trạng thái mẫu nằm trong RAM; chưa có lưu file hay server. Hai consumer Swift/Kotlin và script build/run đã có trong files; consumers/NATIVE.md hướng dẫn ghép iOS/Android, JNA và kiểm thử đúng ABI.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"mobile_expense\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[lib]\ncrate-type = [\"cdylib\", \"staticlib\", \"rlib\"]\n\n[features]\nbindgen = [\"uniffi/cli\"]\n\n[dependencies]\nuniffi = \"=0.32.2\"\n\n[[bin]]\nname = \"uniffi-bindgen\"\npath = \"src/bin/uniffi-bindgen.rs\"\nrequired-features = [\"bindgen\"]\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::{collections::BTreeMap, sync::{Arc, Mutex}};\nuniffi::setup_scaffolding!();\n#[derive(Clone, Debug, PartialEq, uniffi::Record)]\npub struct Expense { pub id: String, pub label: String, pub amount_minor: u64 }\n#[derive(Debug, uniffi::Record)]\npub struct Snapshot { pub revision: u64, pub total_minor: u64, pub entries: Vec<Expense> }\n#[derive(Debug, PartialEq, uniffi::Error)]\npub enum BookError { InvalidInput, Duplicate, Missing, Conflict, Overflow, Capacity, Internal }\nimpl std::fmt::Display for BookError { fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result { write!(f, \"{self:?}\") } }\nimpl std::error::Error for BookError {}\n#[derive(Default)] struct State { revision: u64, total: u64, entries: BTreeMap<String, Expense> }\n#[derive(uniffi::Object)] pub struct ExpenseBook { state: Mutex<State> }\nfn valid_id(id: &str) -> bool { !id.is_empty() && id.len() <= 64 && id.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_') }\n#[uniffi::export]\nimpl ExpenseBook {\n    #[uniffi::constructor]\n    pub fn new() -> Arc<Self> { Arc::new(Self { state: Mutex::new(State::default()) }) }\n    pub fn add(&self, expected_revision: u64, id: String, label: String, amount_minor: u64) -> Result<u64, BookError> {\n        let label = label.trim().to_owned();\n        if !valid_id(&id) || label.is_empty() || label.len() > 512 || label.chars().count() > 128 || amount_minor == 0 { return Err(BookError::InvalidInput); }\n        let mut state = self.state.lock().map_err(|_| BookError::Internal)?;\n        if state.revision != expected_revision { return Err(BookError::Conflict); }\n        if state.entries.contains_key(&id) { return Err(BookError::Duplicate); }\n        if state.entries.len() >= 1000 { return Err(BookError::Capacity); }\n        let total = state.total.checked_add(amount_minor).ok_or(BookError::Overflow)?;\n        let revision = state.revision.checked_add(1).ok_or(BookError::Overflow)?;\n        state.entries.insert(id.clone(), Expense { id, label, amount_minor });\n        state.total = total; state.revision = revision; Ok(revision)\n    }\n    pub fn remove(&self, expected_revision: u64, id: String) -> Result<u64, BookError> {\n        let mut state = self.state.lock().map_err(|_| BookError::Internal)?;\n        if state.revision != expected_revision { return Err(BookError::Conflict); }\n        let amount = state.entries.get(&id).ok_or(BookError::Missing)?.amount_minor;\n        let revision = state.revision.checked_add(1).ok_or(BookError::Overflow)?;\n        let total = state.total.checked_sub(amount).ok_or(BookError::Internal)?;\n        state.entries.remove(&id); state.total = total; state.revision = revision; Ok(revision)\n    }\n    pub fn snapshot(&self) -> Result<Snapshot, BookError> {\n        let state = self.state.lock().map_err(|_| BookError::Internal)?;\n        Ok(Snapshot { revision: state.revision, total_minor: state.total, entries: state.entries.values().cloned().collect() })\n    }\n}\n#[cfg(test)] mod tests {\n    use super::*;\n    #[test] fn add_remove_and_trim() {\n        let book = ExpenseBook::new();\n        assert_eq!(book.add(0,\"a\".into(),\"  Cà phê  \".into(),25000), Ok(1));\n        let s = book.snapshot().unwrap(); assert_eq!(s.total_minor,25000); assert_eq!(s.entries[0].label,\"Cà phê\");\n        assert_eq!(book.remove(1,\"a\".into()),Ok(2)); assert_eq!(book.snapshot().unwrap().total_minor,0);\n    }\n    #[test] fn duplicate_conflict_and_overflow_change_nothing() {\n        let book = ExpenseBook::new(); book.add(0,\"a\".into(),\"A\".into(),u64::MAX).unwrap();\n        assert_eq!(book.add(1,\"a\".into(),\"A\".into(),1),Err(BookError::Duplicate));\n        assert_eq!(book.add(0,\"b\".into(),\"B\".into(),1),Err(BookError::Conflict));\n        assert_eq!(book.add(1,\"b\".into(),\"B\".into(),1),Err(BookError::Overflow));\n        let s = book.snapshot().unwrap(); assert_eq!(s.entries.len(),1); assert_eq!(s.revision,1); assert_eq!(s.total_minor,u64::MAX);\n    }\n    #[test] fn invalid_input_and_missing() {\n        let book = ExpenseBook::new();\n        assert_eq!(book.add(0,\"../a\".into(),\"A\".into(),1),Err(BookError::InvalidInput));\n        assert_eq!(book.add(0,\"a\".into(),\"a\".repeat(129),1),Err(BookError::InvalidInput));\n        assert_eq!(book.add(0,\"a\".into(),\"A\".into(),0),Err(BookError::InvalidInput));\n        assert_eq!(book.remove(0,\"missing\".into()),Err(BookError::Missing));\n    }\n    #[test] fn two_writers_share_one_revision() {\n        let book = ExpenseBook::new(); let barrier = Arc::new(std::sync::Barrier::new(2));\n        let mut workers = Vec::new();\n        for id in [\"a\",\"b\"] {\n            let book = book.clone(); let barrier = barrier.clone();\n            workers.push(std::thread::spawn(move || { barrier.wait(); book.add(0,id.into(),\"Mục\".into(),10) }));\n        }\n        let results: Vec<_> = workers.into_iter().map(|w| w.join().unwrap()).collect();\n        assert_eq!(results.iter().filter(|x| x.is_ok()).count(),1);\n        assert_eq!(results.iter().filter(|x| **x == Err(BookError::Conflict)).count(),1);\n        assert_eq!(book.snapshot().unwrap().total_minor,10);\n    }\n}\n"
          },
          {
            "path": "src/bin/uniffi-bindgen.rs",
            "content": "fn main() { uniffi::uniffi_bindgen_main(); }\n"
          },
          {
            "path": "examples/host.rs",
            "content": "use mobile_expense::ExpenseBook;\nfn main() { let book = ExpenseBook::new(); book.add(0,\"coffee\".into(),\"Cà phê\".into(),25000).unwrap(); let s = book.snapshot().unwrap(); println!(\"Revision {}: tổng {}\",s.revision,s.total_minor); }\n"
          },
          {
            "path": "README.md",
            "content": "# ExpenseBook\n\nĐơn vị amount_minor do ứng dụng chọn một lần cho cuốn sổ; không trộn currency/scale. ID 1..64 ký tự ASCII alphanumeric, '-' hoặc '_'. Nhãn không rỗng sau trim, tối đa 128 Unicode scalar; tối đa 1000 mục. add/remove nhận expected_revision, kiểm tra toàn bộ trước khi commit. snapshot trả revision/total/entries cùng trạng thái. Dữ liệu chỉ nằm trong RAM.\n\nSwift sau khi import module đã sinh: tạo ExpenseBook(), gọi try book.add(expectedRevision: 0, id: \"coffee\", label: \"Cà phê\", amountMinor: 25000), rồi try book.snapshot(). Kotlin tương ứng: ExpenseBook().use { book -> book.add(0uL, \"coffee\", \"Cà phê\", 25000uL); book.snapshot() }. Kiểm tra tên/kiểu trong source do đúng generator sinh trước khi ghép vào app; exception phải được ánh xạ theo BookError, không theo text dịch.\n\nTest hai writer xác nhận một writer nhận Conflict; snapshot không có total lệch danh sách. Không gọi callback trong vùng khóa. UI giữ bản nháp khi Conflict và lấy snapshot mới để người dùng quyết định.\n\n## Chạy Rust và consumer Swift/Kotlin\n\nChạy cargo test --all-targets và cargo run --example host để kiểm tra core. Tiếp theo chạy bash scripts/smoke-swift.sh và bash scripts/smoke-kotlin.sh: mỗi script build thư viện, sinh binding đúng phiên bản, compile rồi thực thi consumer thật. Fixture kiểm tra constructor, mutation, snapshot/page và lỗi Conflict đi qua FFI; catalog còn có retry và StaleSnapshot.\n\nconsumers/NATIVE.md đi kèm đầy đủ yêu cầu công cụ, modulemap/rpath Swift, Gradle/JNA, lệnh đóng XCFramework iOS, lệnh build/copy ABI Android và cấu hình JNA dạng AAR. Hai consumer host chứng minh khả năng gọi native library trên máy đang chạy; nghiệm thu simulator/device, lifecycle và packaging thực hiện theo phần native trong cùng tài liệu.\n\nKhi Conflict, giữ bản nháp và tải snapshot mới. Việc nặng chạy ngoài luồng UI; Kotlin owner đóng wrapper bằng close/use. Công việc cần sống qua process death phải lưu bền và được adapter điều phối theo thời hạn của hệ điều hành. Manifest bàn giao ghi commit, toolchain, UniFFI, target, feature, hash binary và kết quả kiểm thử từng nền tảng.\n"
          },
          {
            "path": "consumers/swift/main.swift",
            "content": "import Foundation\n\nfunc verifyExpenseBridge() throws {\n    let book = ExpenseBook()\n    let revision = try book.add(expectedRevision: 0, id: \"coffee\", label: \"Cà phê\", amountMinor: 25_000)\n    precondition(revision == 1)\n    let before = try book.snapshot()\n    precondition(before.revision == 1 && before.totalMinor == 25_000 && before.entries.count == 1)\n    precondition(before.entries[0].label == \"Cà phê\")\n    do {\n        _ = try book.add(expectedRevision: 0, id: \"tea\", label: \"Trà\", amountMinor: 10_000)\n        fatalError(\"Writer có revision cũ phải nhận Conflict\")\n    } catch BookError.Conflict {\n        // Lỗi có kiểu được truyền qua FFI; không so khớp chuỗi thông báo.\n    }\n    let unchanged = try book.snapshot()\n    precondition(unchanged == before)\n    let removedRevision = try book.remove(expectedRevision: 1, id: \"coffee\")\n    let after = try book.snapshot()\n    precondition(removedRevision == 2 && after.revision == 2 && after.totalMinor == 0 && after.entries.isEmpty)\n    print(\"Swift ExpenseBook: constructor, mutation, snapshot, Conflict PASS\")\n}\n\ndo {\n    try verifyExpenseBridge()\n} catch {\n    fatalError(\"Bridge thất bại: \\(error)\")\n}\n"
          },
          {
            "path": "consumers/kotlin/src/main/kotlin/Smoke.kt",
            "content": "import uniffi.mobile_expense.BookException\nimport uniffi.mobile_expense.ExpenseBook\n\nfun verifyExpenseBridge() {\n    ExpenseBook().use { book ->\n        check(book.add(0uL, \"coffee\", \"Cà phê\", 25_000uL) == 1uL)\n        val before = book.snapshot()\n        check(before.revision == 1uL && before.totalMinor == 25_000uL && before.entries.size == 1)\n        check(before.entries.single().label == \"Cà phê\")\n        try {\n            book.add(0uL, \"tea\", \"Trà\", 10_000uL)\n            error(\"Writer có revision cũ phải nhận Conflict\")\n        } catch (_: BookException.Conflict) {\n            // use đóng native handle cả khi assertion hoặc lời gọi FFI thất bại.\n        }\n        check(book.snapshot() == before)\n        check(book.remove(1uL, \"coffee\") == 2uL)\n        val after = book.snapshot()\n        check(after.revision == 2uL && after.totalMinor == 0uL && after.entries.isEmpty())\n    }\n    println(\"Kotlin ExpenseBook: constructor, mutation, snapshot, Conflict PASS\")\n}\n\nfun main() = verifyExpenseBridge()\n"
          },
          {
            "path": "consumers/kotlin/settings.gradle.kts",
            "content": "rootProject.name = \"mobile_expense-consumer\"\n"
          },
          {
            "path": "consumers/kotlin/build.gradle.kts",
            "content": "import org.jetbrains.kotlin.gradle.dsl.JvmTarget\n\nplugins {\n    kotlin(\"jvm\") version \"2.4.21\"\n    application\n}\n\nrepositories { mavenCentral() }\n\ndependencies {\n    implementation(\"net.java.dev.jna:jna:5.19.1\")\n}\n\nkotlin {\n    compilerOptions { jvmTarget.set(JvmTarget.JVM_17) }\n    sourceSets.main { kotlin.srcDir(\"../../generated/kotlin\") }\n}\n\njava {\n    sourceCompatibility = JavaVersion.VERSION_17\n    targetCompatibility = JavaVersion.VERSION_17\n}\n\napplication { mainClass.set(\"SmokeKt\") }\n\ntasks.named<JavaExec>(\"run\") {\n    systemProperty(\"jna.library.path\", providers.gradleProperty(\"nativeLibDir\").get())\n    if (JavaVersion.current().isCompatibleWith(JavaVersion.VERSION_24)) {\n        jvmArgs(\"--enable-native-access=ALL-UNNAMED\")\n    }\n}\n"
          },
          {
            "path": "scripts/host-env.sh",
            "content": "#!/usr/bin/env bash\nset -euo pipefail\nLAB_ROOT=\"$(cd \"$(dirname \"${BASH_SOURCE[0]}\")/..\" && pwd)\"\ncd \"$LAB_ROOT\"\nCRATE_NAME=\"mobile_expense\"\ncase \"$(uname -s)\" in\n  Darwin) LIB_EXT=dylib ;;\n  Linux) LIB_EXT=so ;;\n  *) echo \"Script host hỗ trợ macOS/Linux; Windows cần lệnh linker tương ứng.\" >&2; exit 2 ;;\nesac\nTARGET_ROOT=\"${CARGO_TARGET_DIR:-$LAB_ROOT/target}\"\ncase \"$TARGET_ROOT\" in\n  /*) ;;\n  *) TARGET_ROOT=\"$LAB_ROOT/$TARGET_ROOT\" ;;\nesac\nexport CARGO_TARGET_DIR=\"$TARGET_ROOT\"\nLIB_DIR=\"$TARGET_ROOT/debug\"\nLIBRARY=\"$LIB_DIR/lib$CRATE_NAME.$LIB_EXT\"\nbuild_binding() {\n  cargo build --lib\n  if [ ! -f \"$LIBRARY\" ]; then\n    echo \"Không có thư viện host: $LIBRARY. Kiểm tra CARGO_BUILD_TARGET hoặc cấu hình target của Cargo.\" >&2\n    exit 2\n  fi\n  cargo run --features bindgen --bin uniffi-bindgen -- generate \\\n    --library \"$LIBRARY\" --language \"$1\" --out-dir \"$LAB_ROOT/generated/$1\" --no-format\n}\n"
          },
          {
            "path": "scripts/smoke-swift.sh",
            "content": "#!/usr/bin/env bash\nset -euo pipefail\nsource \"$(dirname \"${BASH_SOURCE[0]}\")/host-env.sh\"\nbuild_binding swift\nmkdir -p \"$TARGET_ROOT/consumer-smoke\"\nOUTPUT=\"$TARGET_ROOT/consumer-smoke/$CRATE_NAME-swift\"\nswiftc -module-name \"MobileExpenseSmoke\" \\\n  -I \"$LAB_ROOT/generated/swift\" \\\n  -Xcc \"-fmodule-map-file=$LAB_ROOT/generated/swift/${CRATE_NAME}FFI.modulemap\" \\\n  \"$LAB_ROOT/generated/swift/$CRATE_NAME.swift\" \"$LAB_ROOT/consumers/swift/main.swift\" \\\n  -L \"$LIB_DIR\" \"-l$CRATE_NAME\" \\\n  -Xlinker -rpath -Xlinker \"$LIB_DIR\" -o \"$OUTPUT\"\n\"$OUTPUT\"\n"
          },
          {
            "path": "scripts/smoke-kotlin.sh",
            "content": "#!/usr/bin/env bash\nset -euo pipefail\nsource \"$(dirname \"${BASH_SOURCE[0]}\")/host-env.sh\"\nbuild_binding kotlin\ngradle --no-daemon --console=plain -p \"$LAB_ROOT/consumers/kotlin\" \\\n  \"-PnativeLibDir=$LIB_DIR\" run\n"
          },
          {
            "path": "consumers/NATIVE.md",
            "content": "# Chạy consumer và ghép vào ứng dụng\n\n## Consumer host có thể chạy ngay\n\nCác script chạy từ bất kỳ thư mục nào, tự quay về Cargo project và tôn trọng CARGO_TARGET_DIR. Không đặt CARGO_BUILD_TARGET về iOS/Android khi chạy smoke host. Cần Rust, Swift compiler cho Swift; JDK 17 trở lên và Gradle tương thích cho Kotlin. Kotlin plugin khóa 2.4.21, JNA khóa 5.19.1. Với Gradle 9.6.1 dùng JDK 17–26 theo cấu hình Gradle đã cài; bản kiểm tra của khoá học dùng JDK 26. Bytecode của consumer đặt target 17 cho cả Java/Kotlin, không tự tải JDK khác.\n\n```sh\nbash scripts/smoke-swift.sh\nbash scripts/smoke-kotlin.sh\n```\n\nMỗi script build Rust cdylib, sinh lại binding từ đúng binary rồi compile và chạy consumer thật. Swift nhận header/modulemap qua compiler flag và rpath tới native library. Gradle lấy thư mục binding làm source set, tải JNA dạng JAR và truyền jna.library.path. Không chỉ kiểm tra generator. Kết quả kết thúc bằng PASS, process lỗi trả mã khác 0. Fixture có constructor, mutation, snapshot/page, Unicode và Conflict; catalog còn kiểm tra retry cùng operation ID và StaleSnapshot. Kotlin dùng use để đóng native handle. Các record chỉ chứa giá trị nên không có nested native object phải đóng riêng.\n\nNếu macOS có JDK qua Homebrew nhưng java hệ thống chưa tìm được runtime, đặt JAVA_HOME về thư mục Contents/Home của JDK đã cài, thêm JAVA_HOME/bin vào PATH rồi chạy lại. Không sửa generated binding để che lỗi library load: kiểm tra tên thư viện, kiến trúc CPU, đường dẫn, cùng phiên bản UniFFI và checksum hợp đồng. Host smoke chưa kiểm chứng ABI hay vòng đời hệ điều hành của điện thoại.\n\n## iOS: ARM64 device và ARM64 simulator\n\nCần Xcode và SDK iOS đầy đủ. Từ gốc lab, chạy các lệnh sau sau khi Swift host smoke đã đạt. TARGET_ROOT là thư mục artifact của bài tập.\n\n```sh\nrustup target add aarch64-apple-ios aarch64-apple-ios-sim\nexport IPHONEOS_DEPLOYMENT_TARGET=15.0\ncargo build --release --lib --target aarch64-apple-ios\ncargo build --release --lib --target aarch64-apple-ios-sim\nTARGET_ROOT=\"${CARGO_TARGET_DIR:-target}\"\nmkdir -p generated/ios/headers\ncp generated/swift/mobile_expenseFFI.h generated/ios/headers/\ncp generated/swift/mobile_expenseFFI.modulemap generated/ios/headers/module.modulemap\nxcodebuild -create-xcframework \\\n  -library \"$TARGET_ROOT/aarch64-apple-ios/release/libmobile_expense.a\" -headers generated/ios/headers \\\n  -library \"$TARGET_ROOT/aarch64-apple-ios-sim/release/libmobile_expense.a\" -headers generated/ios/headers \\\n  -output generated/ios/MobileExpense.xcframework\n```\n\nOutput xcframework phải chưa tồn tại; dùng thư mục phiên bản mới khi build lại. Simulator Intel cần slice x86_64-apple-ios riêng, không dùng slice ARM64 thay thế. Trong Xcode: thêm XCFramework vào Link Binary With Libraries, chọn Do Not Embed vì là static library, thêm generated/swift/mobile_expense.swift vào target ứng dụng. Header và module.modulemap trong XCFramework cho Swift import module C. Đặt deployment target khớp 15.0 hoặc một mức hỗ trợ đã thống nhất. Giữ source Swift và binary cùng commit/generator.\n\nĐưa hàm verifyExpenseBridge từ consumers/swift/main.swift vào target XCTest, bỏ lời gọi top-level ở cuối. Gọi hàm bằng try trong test; chạy test trên simulator rồi device. Sau đó ghép service giữ object với ViewModel, chạy tác vụ tốn thời gian ngoài main actor và trả state về main actor. Khi Conflict, giữ bản nháp, tải snapshot mới và hỏi người dùng chọn phiên bản; không tự ghi đè. Kiểm tra app chuyển nền, huỷ view, đóng service, process chết và phục hồi dữ liệu ngoài RAM.\n\n## Android: thư viện theo ABI và runtime JNA\n\nCần Android SDK/NDK. Ví dụ dưới đây dành cho NDK trên macOS và ABI arm64-v8a, Android API 24. ANDROID_NDK_HOME trỏ tới NDK đã cài; thư mục prebuilt của NDK macOS có tên darwin-x86_64, Linux dùng linux-x86_64. Chọn minSdk và ABI theo thiết bị sản phẩm.\n\n```sh\nrustup target add aarch64-linux-android\nexport CARGO_TARGET_AARCH64_LINUX_ANDROID_LINKER=\"$ANDROID_NDK_HOME/toolchains/llvm/prebuilt/darwin-x86_64/bin/aarch64-linux-android24-clang\"\ncargo build --release --lib --target aarch64-linux-android\nTARGET_ROOT=\"${CARGO_TARGET_DIR:-target}\"\nmkdir -p android/app/src/main/jniLibs/arm64-v8a android/app/src/main/kotlin\ncp \"$TARGET_ROOT/aarch64-linux-android/release/libmobile_expense.so\" android/app/src/main/jniLibs/arm64-v8a/\ncp -R generated/kotlin/uniffi android/app/src/main/kotlin/\n```\n\nandroid/app là module ứng dụng Android hiện có. Thêm vào build.gradle.kts của module, giữ phiên bản Android/Kotlin plugin của ứng dụng tương thích:\n\n```kotlin\nandroid {\n    defaultConfig {\n        minSdk = 24\n        ndk { abiFilters += \"arm64-v8a\" }\n    }\n    sourceSets.getByName(\"main\") {\n        java.srcDir(\"src/main/kotlin\")\n        jniLibs.srcDir(\"src/main/jniLibs\")\n    }\n}\ndependencies {\n    implementation(\"net.java.dev.jna:jna:5.19.1@aar\")\n}\n```\n\nJVM host dùng JAR; Android dùng AAR để đóng gói native dispatch của JNA. Runtime cần JNA từ 5.12.0 trở lên; dự án khóa bản 5.19.1, không dùng '+' hay version động. Kotlin hiện tại hỗ trợ UInt/ULong bình thường. API của lab đồng bộ nên không cần thêm coroutine chỉ để gọi binding. Khi thêm async API, bổ sung runtime coroutine và kiểm tra cancellation theo hợp đồng.\n\nThiết bị/emulator x86_64 cần build x86_64-linux-android bằng x86_64-linux-android24-clang, copy .so sang jniLibs/x86_64 và thêm ABI đó. Dylib macOS không chạy được trên Android. Thêm hàm verifyExpenseBridge từ Smoke.kt vào instrumented test, bỏ main, gọi hàm trên emulator và device. Không dùng unit test JVM trên desktop để tuyên bố đã kiểm chứng APK. Giữ object trong owner của ứng dụng, close khi owner hết vòng đời; không lưu native handle vào saved state. Việc cần qua process death phải có storage/outbox và WorkManager/BackgroundTasks ở adapter.\n\n## Bằng chứng bàn giao\n\nLưu toolchain, UniFFI, Kotlin/JNA, commit, target/ABI, hash binary, log hai host consumer và log simulator/device theo từng nền tảng. Với mỗi bản phát hành, test lại typed error, dữ liệu Unicode, stale revision, giải phóng handle và nâng cấp dữ liệu. RAM engine của lab cần thêm persistence/transport/auth theo nhu cầu ứng dụng; host smoke không thay kiểm thử lifecycle, packaging, hiệu năng hoặc power-loss trên thiết bị.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run --example host",
          "bash scripts/smoke-swift.sh",
          "bash scripts/smoke-kotlin.sh"
        ],
        "checks": [
          "Duplicate, overflow và Conflict không sửa trạng thái.",
          "Snapshot total khớp danh sách; remove cập nhật revision.",
          "Hai writer cùng base chỉ một thành công.",
          "Swift và Kotlin consumer thực thi add/snapshot/remove, bắt BookError/BookException.Conflict và xác nhận state không đổi; tiếp tục chạy fixture trên simulator/device."
        ]
      }
    },
    {
      "id": "mobile-artifact-matrix",
      "moduleId": "track-mobile",
      "title": "Ma trận artifact: host, simulator, thiết bị và ABI",
      "description": "Xây bộ phát hành truy nguyên được theo đúng môi trường chạy thay vì chỉ cùng kiến trúc CPU.",
      "duration": 45,
      "objectives": [
        "Xây bộ phát hành truy nguyên được theo đúng môi trường chạy thay vì chỉ cùng kiến trúc CPU.",
        "So sánh đủ platform, environment và arch.",
        "Không chấp nhận device thay cho simulator dù cùng ARM64."
      ],
      "sections": [
        {
          "title": "ARM64 không xác định đầy đủ môi trường",
          "text": "iPhone và iOS Simulator trên Apple Silicon đều có thể dùng ARM64 nhưng khác môi trường liên kết. Rust target cho thiết bị là aarch64-apple-ios, còn simulator ARM64 dùng aarch64-apple-ios-sim. macOS lại là target khác. Android có ABI như arm64-v8a và x86_64, gắn với target và toolchain NDK phù hợp. Một file được biên dịch thành công trên Mac chỉ chạy được trong môi trường đã build. Không đặt tên artifact bằng mỗi cpu vì dễ lấy nhầm khi ghép ứng dụng hoặc tạo cache CI."
        },
        {
          "title": "Binding và binary phải đi cùng phiên bản",
          "text": "Mã Swift/Kotlin được sinh theo giao diện và metadata của thư viện. Nếu cập nhật binary mà giữ binding cũ, lỗi có thể xuất hiện khi load hoặc gọi hàm. Gói phát hành cần manifest chứa commit, phiên bản crate, UniFFI, toolchain, target, cấu hình feature và hash artifact. Không dùng tên latest làm cách duy nhất nhận diện build. Mỗi job CI nên tạo thư mục đầu ra riêng để hai target không ghi đè nhau. Kiểm tra artifact tồn tại và đúng kích thước không thay thế thử một lời gọi FFI trên môi trường đích."
        },
        {
          "title": "Pipeline chia thành các cửa kiểm tra",
          "text": "Đầu tiên chạy domain test trên host; tiếp theo build target; sau đó sinh binding và compile ứng dụng native; cuối cùng chạy smoke test trên simulator hoặc thiết bị. Mỗi cửa tìm một loại lỗi khác. Cross compile có thể cần SDK, linker và cấu hình deployment target ngoài rustup target add. Android cần NDK và packaging .so vào đúng ABI; iOS thường cần đóng gói thư viện cùng header/modulemap trong cấu trúc ứng dụng phù hợp. README nên ghi những đầu vào này, không để CI dựa vào cấu hình máy cá nhân vô hình.",
          "code": "#[derive(PartialEq)] struct Target<'a> { platform: &'a str, environment: &'a str, arch: &'a str }\nfn compatible(a: &Target<'_>, b: &Target<'_>) -> bool { a == b }"
        },
        {
          "title": "Thực hành kiểm tra ma trận phát hành",
          "text": "Bài tập chỉ chấp nhận artifact khi cả platform, environment và arch khớp. Dữ liệu đơn giản làm rõ sai lầm chọn theo ARM64 đơn lẻ. Trong Cargo, xuất manifest có version và kiểm tra duplicate target trước khi đóng gói. Thêm smoke test gọi hàm trả protocol_version, một phép tính hợp lệ và một lỗi có kiểu qua binding. Lưu log của từng target, kể cả target chưa có máy thử. Khi một nền tảng chưa chạy, ghi trạng thái build-only rõ ràng; không gộp kết quả host xanh thành tuyên bố rằng cả iOS và Android đều đã được xác minh. Khi lưu artifact vào cache, dùng toàn bộ target và cấu hình feature trong khóa cache để tránh lấy nhầm bản build."
        }
      ],
      "tip": "CPU là một phần của target; môi trường chạy và SDK/linker cũng phải phù hợp.",
      "exercise": {
        "title": "Ma trận artifact: host, simulator, thiết bị và ABI",
        "instructions": "Xây bộ phát hành truy nguyên được theo đúng môi trường chạy thay vì chỉ cùng kiến trúc CPU.",
        "requirements": [
          "So sánh đủ platform, environment và arch.",
          "Không chấp nhận device thay cho simulator dù cùng ARM64."
        ]
      },
      "starterCode": "#[derive(PartialEq)] struct Target<'a> { platform: &'a str, environment: &'a str, arch: &'a str }\nfn compatible(a: &Target<'_>, b: &Target<'_>) -> bool { todo!() }\nfn main() {\nlet device = Target { platform: \"ios\", environment: \"device\", arch: \"arm64\" };\nlet simulator = Target { platform: \"ios\", environment: \"simulator\", arch: \"arm64\" };\nassert!(!compatible(&device, &simulator)); assert!(compatible(&device, &device));\nprintln!(\"Device và simulator khác artifact\");\n}",
      "solutionCode": "#[derive(PartialEq)] struct Target<'a> { platform: &'a str, environment: &'a str, arch: &'a str }\nfn compatible(a: &Target<'_>, b: &Target<'_>) -> bool { a == b }\nfn main() {\nlet device = Target { platform: \"ios\", environment: \"device\", arch: \"arm64\" };\nlet simulator = Target { platform: \"ios\", environment: \"simulator\", arch: \"arm64\" };\nassert!(!compatible(&device, &simulator)); assert!(compatible(&device, &device));\nprintln!(\"Device và simulator khác artifact\");\n}",
      "expectedOutput": "Device và simulator khác artifact",
      "hints": [
        "So sánh đủ platform, environment và arch.",
        "CPU là một phần của target; môi trường chạy và SDK/linker cũng phải phù hợp."
      ],
      "quiz": {
        "question": "Hai artifact đều ARM64, một cho iOS device và một cho simulator. Có thể thay thế tùy ý không?",
        "options": [
          "Không; environment/target và liên kết khác nhau.",
          "Chỉ cần đổi tên file.",
          "Có, cùng tập lệnh là đủ."
        ],
        "correct": 0,
        "explanation": "CPU là một phần của target; môi trường chạy và SDK/linker cũng phải phù hợp."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/rustc/platform-support/apple-ios.html"
      }
    },
    {
      "id": "mobile-contract-tests",
      "moduleId": "track-mobile",
      "title": "Kiểm thử hợp đồng xuyên Rust, Swift và Kotlin",
      "description": "Dùng fixture và kiểm thử âm để phát hiện sai lệch giữa logic lõi và binding được đóng gói.",
      "duration": 45,
      "objectives": [
        "Dùng fixture và kiểm thử âm để phát hiện sai lệch giữa logic lõi và binding được đóng gói.",
        "Revision không được lùi so với lần quan sát trước.",
        "Tổng amount phải khớp total và phép tính test không được tràn."
      ],
      "sections": [
        {
          "title": "Test Rust không chạy mã binding",
          "text": "Domain test có thể đúng trong khi Kotlin load sai tên thư viện hoặc Swift dùng header không cùng bản. Cần một tập fixture nhỏ được chạy qua API đã export trên từng nền tảng. Mỗi fixture ghi input, output hoặc error code và version hợp đồng. Chọn trường hợp có ý nghĩa: Unicode, biên số nguyên, danh sách rỗng, lỗi có dữ liệu và object dùng lại sau nhiều lần gọi. Không chỉ kiểm tra một phép cộng 1+1 vì nó không chạm vào các lớp dễ khác nhau."
        },
        {
          "title": "Golden test cần giữ ý nghĩa chứ không khóa ngẫu nhiên",
          "text": "So sánh JSON từng byte dễ thất bại vì thứ tự map hoặc định dạng không thuộc hợp đồng. Hãy so kiểu dữ liệu đã parse, thứ tự danh sách nếu được cam kết và mã lỗi. Nếu thứ tự hiển thị là một phần API, sắp xếp rõ theo ID hoặc trường định nghĩa trước khi trả. Thông báo dịch cho người dùng không nên là error code được dùng trong logic. Fixture phải nói null khác rỗng ở đâu và số nguyên được biểu diễn ra sao. Một test mơ hồ có thể khóa chặt chi tiết implementation không cần thiết."
        },
        {
          "title": "Kiểm tra thay đổi hợp đồng theo phiên bản",
          "text": "Thêm một field bắt buộc hoặc đổi ý nghĩa enum có thể khiến caller cũ không xử lý được. So sánh API và fixture của bản trước với bản mới, chạy migration dữ liệu độc lập với binding test. Native wrapper và Rust binary nên được phát hành cùng bộ, còn file người dùng tồn tại lâu hơn một phiên app. Bài tập kiểm tra snapshot có revision không giảm và total bằng tổng các amount, dùng checked_add để tránh test tự tràn rồi cho kết luận sai. Các invariant này hữu ích dù API được gọi từ ngôn ngữ nào.",
          "code": "fn valid_snapshot(revision: u64, previous: u64, amounts: &[u64], total: u64) -> bool {\n    revision >= previous && amounts.iter().try_fold(0u64, |sum, &v| sum.checked_add(v)) == Some(total)\n}"
        },
        {
          "title": "Tạo lỗi ở đúng ranh giới",
          "text": "Trong Cargo, viết test cho serializer, core và file hỏng; trong Swift/Kotlin, gọi lỗi đã biết để kiểm tra cách exception hoặc throws được bắt. Thử package thiếu một ABI, binding cũ và object được đóng đúng lifecycle trong môi trường kiểm thử. Không đưa những lỗi đóng gói này vào cùng nhóm lỗi nhập liệu. Ghi log đã khử dữ liệu nhạy cảm gồm build ID, target và loại lỗi để tìm nhanh lớp hỏng. Báo cáo CI cần hiển thị test nào chạy native thực, test nào chỉ sinh source, vì hai dấu xanh này có giá trị chứng minh khác nhau. Giữ fixture cùng phiên bản source."
        }
      ],
      "tip": "Contract test kiểm tra cam kết với caller, tránh khóa chi tiết biểu diễn không có ý nghĩa.",
      "exercise": {
        "title": "Kiểm thử hợp đồng xuyên Rust, Swift và Kotlin",
        "instructions": "Dùng fixture và kiểm thử âm để phát hiện sai lệch giữa logic lõi và binding được đóng gói.",
        "requirements": [
          "Revision không được lùi so với lần quan sát trước.",
          "Tổng amount phải khớp total và phép tính test không được tràn."
        ]
      },
      "starterCode": "fn valid_snapshot(revision: u64, previous: u64, amounts: &[u64], total: u64) -> bool { todo!() }\nfn main() {\nassert!(valid_snapshot(3, 2, &[100, 50], 150));\nassert!(!valid_snapshot(1, 2, &[100], 100));\nassert!(!valid_snapshot(3, 2, &[u64::MAX, 1], 0));\nassert!(valid_snapshot(0, 0, &[], 0));\nprintln!(\"Snapshot khớp hợp đồng\");\n}",
      "solutionCode": "fn valid_snapshot(revision: u64, previous: u64, amounts: &[u64], total: u64) -> bool {\n    revision >= previous && amounts.iter().try_fold(0u64, |sum, &v| sum.checked_add(v)) == Some(total)\n}\nfn main() {\nassert!(valid_snapshot(3, 2, &[100, 50], 150));\nassert!(!valid_snapshot(1, 2, &[100], 100));\nassert!(!valid_snapshot(3, 2, &[u64::MAX, 1], 0));\nassert!(valid_snapshot(0, 0, &[], 0));\nprintln!(\"Snapshot khớp hợp đồng\");\n}",
      "expectedOutput": "Snapshot khớp hợp đồng",
      "hints": [
        "Revision không được lùi so với lần quan sát trước.",
        "Contract test kiểm tra cam kết với caller, tránh khóa chi tiết biểu diễn không có ý nghĩa."
      ],
      "quiz": {
        "question": "So sánh nguyên chuỗi JSON có luôn là contract test phù hợp không?",
        "options": [
          "Có vì mọi thứ tự key đều thuộc API.",
          "Không cần test binding nếu Rust xanh.",
          "Không; nên so ngữ nghĩa và chỉ khóa thứ tự/định dạng đã cam kết."
        ],
        "correct": 2,
        "explanation": "Contract test kiểm tra cam kết với caller, tránh khóa chi tiết biểu diễn không có ý nghĩa."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://mozilla.github.io/uniffi-rs/latest/tutorial/foreign_language_bindings.html"
      }
    },
    {
      "id": "mobile-cancellation-protocol",
      "moduleId": "track-mobile",
      "title": "Hủy tác vụ và chống kết quả đến muộn",
      "description": "Thiết kế token, generation và trạng thái hoàn tất cho tác vụ chạy qua FFI.",
      "duration": 45,
      "objectives": [
        "Thiết kế token, generation và trạng thái hoàn tất cho tác vụ chạy qua FFI.",
        "Chỉ chấp nhận generation hiện hành khi màn hình còn sống.",
        "Terminal state chỉ được thiết lập một lần và không bị kết quả cũ làm thay đổi."
      ],
      "sections": [
        {
          "title": "Hủy UI không tự dừng mọi việc trong Rust",
          "text": "Người dùng rời màn hình có thể khiến coroutine hoặc Task phía native bị hủy, nhưng phần xử lý Rust vẫn có thể đang chạy hoặc chờ I/O. UniFFI không tự tạo một giao thức cancellation hoàn chỉnh cho thư viện của bạn. Cần API hoặc token riêng mà công việc kiểm tra định kỳ. Chọn rõ kết quả của hủy: không bắt đầu batch mới, giữ dữ liệu đã commit và trả Cancelled khi chưa hoàn tất. Hủy không có nghĩa quay ngược mọi tác động đã xảy ra trên mạng hoặc trong file."
        },
        {
          "title": "Generation xác định kết quả thuộc màn hình nào",
          "text": "Một ô tìm kiếm phát yêu cầu A rồi B; A hoàn thành sau B. Nếu UI nhận mọi kết quả, danh sách quay về truy vấn cũ. Gắn generation tăng theo mỗi thao tác, chỉ hiển thị kết quả có generation hiện hành và màn hình còn hoạt động. Token hủy giảm công việc thừa, còn generation bảo vệ tính đúng của hiển thị; cần cả hai vì hủy có thể đến sau khi kết quả đã gửi. Không dùng chuỗi truy vấn làm định danh duy nhất vì người dùng có thể quay lại cùng một từ khóa ở phiên khác."
        },
        {
          "title": "Điểm commit quyết định phản hồi",
          "text": "Một job có các trạng thái Pending, Running và một terminal state như Completed, Failed hoặc Cancelled. Chỉ chuyển sang terminal một lần. Nếu cancellation đến trước commit, dừng và báo Cancelled. Nếu commit đã hoàn tất, trả kết quả đã commit hoặc cho phép caller truy vấn bằng operation ID; không giả vờ dữ liệu chưa thay đổi. Lưu luật này trong hợp đồng để nút thử lại không tạo bản trùng. Với thao tác dài, chèn điểm kiểm tra hủy giữa các batch và đặt deadline cho I/O; một cờ atomic không ngắt được lệnh blocking bất kỳ.",
          "code": "fn accept(active: u64, incoming: u64, screen_alive: bool, terminal: &mut bool) -> bool {\n    if !screen_alive || incoming != active || *terminal { return false; }\n    *terminal = true; true\n}"
        },
        {
          "title": "Kiểm thử thứ tự khó thấy bằng tay",
          "text": "Bài tập dùng generation và cờ terminal để chấp nhận đúng một kết quả hiện hành. Cargo test tạo các lịch A→B→A hoàn tất, hủy trước khi chạy, hủy sau commit và hai callback kết thúc liên tiếp. Clock và scheduler giả giúp tái hiện mà không phụ thuộc tốc độ máy. Trong Swift/Kotlin, mở đóng màn hình nhanh và đổi truy vấn liên tục, kiểm tra UI không cập nhật sau dispose. Đếm job còn sống và thời gian phản hồi hủy để phát hiện tác vụ bị bỏ quên. Các số đo này thuộc hợp đồng trải nghiệm, không chỉ là chi tiết của executor."
        }
      ],
      "tip": "Cancellation và kiểm tra kết quả đến muộn bảo vệ hai tình huống khác nhau.",
      "exercise": {
        "title": "Hủy tác vụ và chống kết quả đến muộn",
        "instructions": "Thiết kế token, generation và trạng thái hoàn tất cho tác vụ chạy qua FFI.",
        "requirements": [
          "Chỉ chấp nhận generation hiện hành khi màn hình còn sống.",
          "Terminal state chỉ được thiết lập một lần và không bị kết quả cũ làm thay đổi."
        ]
      },
      "starterCode": "fn accept(active: u64, incoming: u64, screen_alive: bool, terminal: &mut bool) -> bool { todo!() }\nfn main() {\nlet mut done = false;\nassert!(!accept(2, 1, true, &mut done)); assert!(!done);\nassert!(accept(2, 2, true, &mut done)); assert!(!accept(2, 2, true, &mut done));\nlet mut other = false; assert!(!accept(3, 3, false, &mut other));\nprintln!(\"Chỉ nhận kết quả hiện hành một lần\");\n}",
      "solutionCode": "fn accept(active: u64, incoming: u64, screen_alive: bool, terminal: &mut bool) -> bool {\n    if !screen_alive || incoming != active || *terminal { return false; }\n    *terminal = true; true\n}\nfn main() {\nlet mut done = false;\nassert!(!accept(2, 1, true, &mut done)); assert!(!done);\nassert!(accept(2, 2, true, &mut done)); assert!(!accept(2, 2, true, &mut done));\nlet mut other = false; assert!(!accept(3, 3, false, &mut other));\nprintln!(\"Chỉ nhận kết quả hiện hành một lần\");\n}",
      "expectedOutput": "Chỉ nhận kết quả hiện hành một lần",
      "hints": [
        "Chỉ chấp nhận generation hiện hành khi màn hình còn sống.",
        "Cancellation và kiểm tra kết quả đến muộn bảo vệ hai tình huống khác nhau."
      ],
      "quiz": {
        "question": "Token hủy đã được bật có đủ bảo đảm UI không nhận kết quả cũ không?",
        "options": [
          "Đủ vì mọi I/O dừng ngay.",
          "Chưa; vẫn cần generation/lifecycle gate do kết quả có thể đã được gửi.",
          "Đủ nếu dùng Arc."
        ],
        "correct": 1,
        "explanation": "Cancellation và kiểm tra kết quả đến muộn bảo vệ hai tình huống khác nhau."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://mozilla.github.io/uniffi-rs/latest/futures.html"
      },
      "simulation": {
        "title": "Kết quả tìm kiếm về muộn",
        "description": "Generation giữ UI đúng khi thao tác cũ chưa dừng kịp.",
        "kind": "timeline",
        "nodes": [
          {
            "id": "screen",
            "label": "Màn hình",
            "detail": "Owner và generation hiện hành"
          },
          {
            "id": "old",
            "label": "Tác vụ A",
            "detail": "Yêu cầu trước"
          },
          {
            "id": "new",
            "label": "Tác vụ B",
            "detail": "Yêu cầu mới"
          },
          {
            "id": "gate",
            "label": "Điểm nhận",
            "detail": "Kiểm tra lifecycle và terminal"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Kết quả mới",
            "steps": [
              {
                "title": "Gửi A",
                "description": "Màn hình tạo generation 1.",
                "activeNodeIds": [
                  "old"
                ],
                "values": [
                  {
                    "label": "active",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Gửi B",
                "description": "Tăng generation và yêu cầu hủy A.",
                "activeNodeIds": [
                  "new"
                ],
                "values": [
                  {
                    "label": "active",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "B hoàn tất",
                "description": "Kết quả mang generation 2.",
                "activeNodeIds": [
                  "new"
                ],
                "values": [
                  {
                    "label": "incoming",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "Hiển thị",
                "description": "Gate chấp nhận và đánh dấu terminal.",
                "activeNodeIds": [
                  "gate"
                ],
                "values": [
                  {
                    "label": "accepted",
                    "value": "true"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "Kết quả cũ",
            "steps": [
              {
                "title": "Gửi A",
                "description": "A bắt đầu công việc.",
                "activeNodeIds": [
                  "old"
                ],
                "values": [
                  {
                    "label": "generation",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Rời/đổi màn hình",
                "description": "B hoặc màn hình mới trở thành owner.",
                "activeNodeIds": [
                  "screen"
                ],
                "values": [
                  {
                    "label": "active",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "A trả muộn",
                "description": "Cancellation đến sau lúc A gửi kết quả.",
                "activeNodeIds": [
                  "old"
                ],
                "values": [
                  {
                    "label": "incoming",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Bỏ kết quả",
                "description": "Không cập nhật UI hoặc terminal của B.",
                "activeNodeIds": [
                  "gate"
                ],
                "values": [
                  {
                    "label": "accepted",
                    "value": "false"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "mobile-background-sync",
      "moduleId": "track-mobile",
      "title": "Đồng bộ nền theo vòng đời hệ điều hành",
      "description": "Tách công việc bền vững khỏi lifetime màn hình và xử lý thời hạn chạy nền.",
      "duration": 45,
      "objectives": [
        "Tách công việc bền vững khỏi lifetime màn hình và xử lý thời hạn chạy nền.",
        "Giới hạn batch ở 20 và không vượt pending.",
        "Không lập việc khi chi phí ước lượng bằng 0 hoặc thời gian không đủ."
      ],
      "sections": [
        {
          "title": "Thread Rust không cấp quyền chạy nền",
          "text": "Một vòng lặp trong core không làm ứng dụng được hệ điều hành cho chạy mãi khi ra nền. Android và iOS có cơ chế scheduling, điều kiện pin/mạng và giới hạn lifetime riêng. Core nên nhận một phần công việc hữu hạn từ adapter nền tảng, thực hiện rồi trả trạng thái để hệ điều hành biết kết quả. Công việc cần sống qua process death phải được lưu bền; chỉ giữ Future hoặc Arc trong RAM không đủ. Màn hình mở lại có thể chỉ quan sát trạng thái đã lưu, không sở hữu công việc cần tiếp tục độc lập."
        },
        {
          "title": "Adapter điều phối, core quyết định nghiệp vụ",
          "text": "Android có thể dùng WorkManager cho công việc bền vững thích hợp; iOS đăng ký và lên lịch tác vụ qua cơ chế BackgroundTasks phù hợp. Hai nền tảng không có cam kết thời điểm chạy giống nhau. Adapter chuyển deadline còn lại, trạng thái kết nối và tín hiệu hết thời gian vào core. Core xử lý tối đa một batch, checkpoint sau kết quả đã xác nhận và trả MoreWork hoặc Complete. Không đặt logic nghiệp vụ khác nhau vào hai adapter; chúng chỉ dịch vòng đời và cơ chế nền tảng sang một hợp đồng chung."
        },
        {
          "title": "Retry phải giữ giới hạn và tính lặp an toàn",
          "text": "Lỗi timeout có thể xảy ra sau khi server đã commit. Giữ operation ID qua retry, phân biệt lỗi tạm thời với validation hoặc quyền truy cập cần người dùng xử lý. Dùng backoff có trần và có thể thêm jitter khi nhiều thiết bị cùng reconnect; không thử liên tục mỗi vòng event loop. Tôn trọng thông tin thời gian chờ từ server nếu giao thức định nghĩa. Deadline tổng phải được kiểm tra trước khi bắt đầu batch mới. Khi bị dừng, trạng thái còn lại nằm trong outbox để lần chạy sau tiếp tục mà không dựng lại từ UI.",
          "code": "fn batch_size(remaining_ms: u64, estimated_ms: u64, pending: usize) -> usize {\n    if estimated_ms == 0 { return 0; }\n    let budget = remaining_ms / estimated_ms;\n    pending.min(20).min(usize::try_from(budget).unwrap_or(usize::MAX))\n}"
        },
        {
          "title": "Thực hành kế hoạch một lượt chạy",
          "text": "Bài tập chọn số thao tác tối đa từ thời gian còn lại, chi phí ước lượng mỗi thao tác và trần batch. Nó là kế hoạch bảo thủ, không bảo đảm thời gian I/O thực tế; adapter vẫn cần timeout/cancel. Cargo test dùng clock giả, server giả mất ACK và process restart giữa hai batch. Trên thiết bị, thử đưa app ra nền, kết thúc process và khởi động lại khi còn pending. Ghi độ trễ đồng bộ cùng trạng thái mạng/pin, không hứa một timer đúng từng giây. Người dùng cần thấy dữ liệu đã lưu cục bộ và đang chờ đồng bộ, thay vì tưởng một nút lưu đang treo."
        }
      ],
      "tip": "Process death làm mất trạng thái RAM; persistence và scheduling là hai phần cần phối hợp.",
      "exercise": {
        "title": "Đồng bộ nền theo vòng đời hệ điều hành",
        "instructions": "Tách công việc bền vững khỏi lifetime màn hình và xử lý thời hạn chạy nền.",
        "requirements": [
          "Giới hạn batch ở 20 và không vượt pending.",
          "Không lập việc khi chi phí ước lượng bằng 0 hoặc thời gian không đủ."
        ]
      },
      "starterCode": "fn batch_size(remaining_ms: u64, estimated_ms: u64, pending: usize) -> usize { todo!() }\nfn main() {\nassert_eq!(batch_size(1000, 200, 100), 5);\nassert_eq!(batch_size(100000, 1, 100), 20);\nassert_eq!(batch_size(50, 100, 10), 0);\nassert_eq!(batch_size(1000, 0, 10), 0);\nprintln!(\"Batch tối đa: {}\", batch_size(1000, 200, 100));\n}",
      "solutionCode": "fn batch_size(remaining_ms: u64, estimated_ms: u64, pending: usize) -> usize {\n    if estimated_ms == 0 { return 0; }\n    let budget = remaining_ms / estimated_ms;\n    pending.min(20).min(usize::try_from(budget).unwrap_or(usize::MAX))\n}\nfn main() {\nassert_eq!(batch_size(1000, 200, 100), 5);\nassert_eq!(batch_size(100000, 1, 100), 20);\nassert_eq!(batch_size(50, 100, 10), 0);\nassert_eq!(batch_size(1000, 0, 10), 0);\nprintln!(\"Batch tối đa: {}\", batch_size(1000, 200, 100));\n}",
      "expectedOutput": "Batch tối đa: 5",
      "hints": [
        "Giới hạn batch ở 20 và không vượt pending.",
        "Process death làm mất trạng thái RAM; persistence và scheduling là hai phần cần phối hợp."
      ],
      "quiz": {
        "question": "App bị hệ điều hành kết thúc trong lúc có việc chờ. Cơ chế nào giúp lần chạy sau tiếp tục?",
        "options": [
          "Lưu outbox/checkpoint bền vững và để adapter nền tảng lên lịch lại.",
          "Tăng số thread.",
          "Giữ thêm một Arc trong RAM."
        ],
        "correct": 0,
        "explanation": "Process death làm mất trạng thái RAM; persistence và scheduling là hai phần cần phối hợp."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://developer.android.com/develop/background-work/background-tasks/persistent"
      }
    },
    {
      "id": "mobile-outbox-project",
      "moduleId": "track-mobile",
      "title": "Dự án: ghi chú ngoại tuyến và outbox bền vững",
      "description": "Lưu thay đổi cục bộ cùng thao tác đồng bộ trong một snapshot có thể khôi phục.",
      "duration": 100,
      "objectives": [
        "Lưu thay đổi cục bộ cùng thao tác đồng bộ trong một snapshot có thể khôi phục.",
        "Chỉ xác nhận xóa khi ACK trùng operation đầu hàng đợi.",
        "ACK sai không được sửa hàng đợi; hàng đợi rỗng là no-op."
      ],
      "sections": [
        {
          "title": "Lưu cục bộ và đồng bộ là hai trạng thái",
          "text": "Người dùng tạo ghi chú khi mất mạng vẫn cần nhìn thấy dữ liệu vừa nhập. Core lưu Note và một Operation có ID ổn định trong cùng giao dịch logic. Nếu chỉ lưu Note trước rồi append outbox sau, crash ở giữa làm dữ liệu tồn tại cục bộ nhưng không bao giờ được gửi. Dự án dùng một snapshot JSON nhỏ chứa cả notes và pending, giới hạn kích thước và số mục. Đây là lựa chọn để học cơ chế; khi dữ liệu lớn hoặc nhiều writer, chuyển sang database có transaction và migration phù hợp."
        },
        {
          "title": "Công bố bản mới sau khi ghi đủ",
          "text": "Store nạp snapshot đã xác minh, clone trạng thái, áp dụng thay đổi và serialize bản kế tiếp. Ghi vào tệp tạm cùng thư mục bằng create_new, write_all, sync_all rồi rename để công bố. Chỉ cập nhật trạng thái RAM sau khi bước lưu thành công. Lỗi giữa chừng giữ bản trước để app báo chưa lưu thay vì hiện thành công giả. Quy trình này bảo vệ một process có một owner; không tự khóa nhiều process hoặc bảo đảm mọi filesystem sống qua mất điện theo cùng cách. Adapter mobile chọn app data directory thay vì đường dẫn tùy ý từ người dùng."
        },
        {
          "title": "ACK không được suy diễn từ việc gửi",
          "text": "Server giả ghi nhận operation ID và kết quả; khi nhận lại cùng ID/nội dung, trả cùng kết quả mà không tạo bản trùng. Nếu mạng mất sau server commit nhưng trước ACK, outbox vẫn giữ operation và gửi lại đúng ID. Chỉ xóa pending sau ACK hợp lệ rồi lưu snapshot mới. Lỗi ghi file lúc xử lý ACK có thể làm gửi lại ở phiên sau, vì vậy idempotency phía server vẫn cần thiết. Không đổi operation ID sau mỗi lần thử và không xóa pending chỉ vì socket đã gửi hết byte.",
          "code": "fn acknowledge(front: Option<u64>, ack: u64) -> Result<bool, &'static str> {\n    match front { Some(id) if id == ack => Ok(true), Some(_) => Err(\"ack-khong-khop\"), None => Ok(false) }\n}"
        },
        {
          "title": "Thực hành restart và lỗi lưu",
          "text": "Cargo project cung cấp Store, demo server giả và test restart, duplicate, ACK sai, dữ liệu hỏng và giới hạn. Tạo thư mục thử riêng, thêm ghi chú, đóng Store, mở lại rồi tiếp tục gửi; trạng thái phải giống trước khi đóng. Test không ghi đè file hỏng bằng snapshot rỗng. Mở rộng độc lập gồm sửa/xóa ghi chú, trạng thái lỗi vĩnh viễn và adapter thư mục native. Khi UI hiện Saved local/Pending sync, người dùng biết dữ liệu đang ở đâu. Bàn giao phải có kịch bản phục hồi và mô tả phạm vi idempotency, không chỉ một video thử trong mạng ổn định."
        }
      ],
      "tip": "Không biết kết quả từ timeout; ID ổn định cho phép server nhận diện lần gửi lại.",
      "exercise": {
        "title": "Dự án: ghi chú ngoại tuyến và outbox bền vững",
        "instructions": "Lưu thay đổi cục bộ cùng thao tác đồng bộ trong một snapshot có thể khôi phục.",
        "requirements": [
          "Chỉ xác nhận xóa khi ACK trùng operation đầu hàng đợi.",
          "ACK sai không được sửa hàng đợi; hàng đợi rỗng là no-op."
        ]
      },
      "starterCode": "fn acknowledge(front: Option<u64>, ack: u64) -> Result<bool, &'static str> { todo!() }\nfn main() {\nassert_eq!(acknowledge(Some(7), 7), Ok(true));\nassert_eq!(acknowledge(Some(7), 6), Err(\"ack-khong-khop\"));\nassert_eq!(acknowledge(None, 7), Ok(false));\nprintln!(\"ACK đúng mới xóa pending\");\n}",
      "solutionCode": "fn acknowledge(front: Option<u64>, ack: u64) -> Result<bool, &'static str> {\n    match front { Some(id) if id == ack => Ok(true), Some(_) => Err(\"ack-khong-khop\"), None => Ok(false) }\n}\nfn main() {\nassert_eq!(acknowledge(Some(7), 7), Ok(true));\nassert_eq!(acknowledge(Some(7), 6), Err(\"ack-khong-khop\"));\nassert_eq!(acknowledge(None, 7), Ok(false));\nprintln!(\"ACK đúng mới xóa pending\");\n}",
      "expectedOutput": "ACK đúng mới xóa pending",
      "hints": [
        "Chỉ xác nhận xóa khi ACK trùng operation đầu hàng đợi.",
        "Không biết kết quả từ timeout; ID ổn định cho phép server nhận diện lần gửi lại."
      ],
      "quiz": {
        "question": "Server đã commit nhưng ACK bị mất. Client nên làm gì?",
        "options": [
          "Gửi lại cùng operation ID theo hợp đồng idempotency.",
          "Tạo ID mới để chắc chắn.",
          "Xóa pending vì đã gọi send."
        ],
        "correct": 0,
        "explanation": "Không biết kết quả từ timeout; ID ổn định cho phép server nhận diện lần gửi lại."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/fs/fn.rename.html"
      },
      "localLab": {
        "title": "Outbox ghi chú có lưu file",
        "instructions": "Lõi có persistence dùng serde_json, fake server idempotent và test restart. Một Store là owner duy nhất của thư mục; đặt nó trong service có serialization khi nối mobile, không mở nhiều Store ghi cùng lúc.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"mobile_outbox\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use serde::{Deserialize, Serialize};\nuse std::{collections::{BTreeMap, BTreeSet, VecDeque}, fs::{self, File, OpenOptions}, io::{Read, Write}, path::{Path, PathBuf}, sync::atomic::{AtomicU64, Ordering}};\nconst MAX_BYTES: u64 = 8 * 1024 * 1024;\nstatic NEXT: AtomicU64 = AtomicU64::new(0);\n#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]\n#[serde(deny_unknown_fields)]\npub struct Note { pub id: String, pub text: String }\n#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]\n#[serde(deny_unknown_fields)]\npub struct Operation { pub id: String, pub note_id: String, pub text: String }\n#[derive(Clone, Debug, Serialize, Deserialize)]\n#[serde(deny_unknown_fields)]\nstruct State { version: u32, notes: BTreeMap<String, Note>, pending: VecDeque<Operation>, used_ids: BTreeSet<String> }\nimpl Default for State { fn default() -> Self { Self { version: 1, notes: BTreeMap::new(), pending: VecDeque::new(), used_ids: BTreeSet::new() } } }\n#[derive(Debug, PartialEq)] pub enum Error { Io, Data, Input, Duplicate, Capacity, Ack }\nfn id_ok(id: &str) -> bool { !id.is_empty() && id.len() <= 64 && id.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_') }\nfn text_ok(text: &str) -> bool { !text.trim().is_empty() && text.len() <= 1024 }\nfn validate(state: &State) -> Result<(), Error> {\n    if state.version != 1 || state.notes.len() > 1000 || state.pending.len() > 1000 || state.used_ids.len() != state.notes.len() || state.used_ids.iter().any(|id| !id_ok(id)) { return Err(Error::Data); }\n    for (id, note) in &state.notes { if *id != note.id || !id_ok(id) || !text_ok(&note.text) { return Err(Error::Data); } }\n    let mut ids = BTreeSet::new(); let mut note_ids = BTreeSet::new();\n    for op in &state.pending {\n        if !id_ok(&op.id) || !state.used_ids.contains(&op.id) || !ids.insert(&op.id) || !note_ids.insert(&op.note_id) || state.notes.get(&op.note_id).is_none_or(|n| n.text != op.text) { return Err(Error::Data); }\n    }\n    Ok(())\n}\npub struct Store { directory: PathBuf, state: State }\nimpl Store {\n    pub fn open(directory: impl AsRef<Path>) -> Result<Self, Error> {\n        let directory = directory.as_ref().to_path_buf(); fs::create_dir_all(&directory).map_err(|_| Error::Io)?;\n        let state = match File::open(directory.join(\"state.json\")) {\n            Ok(file) => {\n                let mut bytes = Vec::new(); file.take(MAX_BYTES + 1).read_to_end(&mut bytes).map_err(|_| Error::Io)?;\n                if bytes.len() as u64 > MAX_BYTES { return Err(Error::Data); }\n                serde_json::from_slice::<State>(&bytes).map_err(|_| Error::Data)?\n            }\n            Err(e) if e.kind() == std::io::ErrorKind::NotFound => State::default(),\n            Err(_) => return Err(Error::Io),\n        };\n        validate(&state)?; Ok(Self { directory, state })\n    }\n    fn commit(&mut self, next: State) -> Result<(), Error> {\n        validate(&next)?;\n        let bytes = serde_json::to_vec(&next).map_err(|_| Error::Data)?;\n        if bytes.len() as u64 > MAX_BYTES { return Err(Error::Capacity); }\n        let temp = self.directory.join(format!(\".pending-{}-{}.tmp\",std::process::id(),NEXT.fetch_add(1,Ordering::Relaxed)));\n        let mut file = OpenOptions::new().write(true).create_new(true).open(&temp).map_err(|_| Error::Io)?;\n        let result = (|| {\n            file.write_all(&bytes).map_err(|_| Error::Io)?; file.sync_all().map_err(|_| Error::Io)?;\n            drop(file); fs::rename(&temp,self.directory.join(\"state.json\")).map_err(|_| Error::Io)?;\n            Ok(())\n        })();\n        if result.is_err() { let _ = fs::remove_file(&temp); }\n        result?; self.state = next; Ok(())\n    }\n    pub fn create(&mut self, operation_id: &str, note_id: &str, text: &str) -> Result<(), Error> {\n        if !id_ok(operation_id) || !id_ok(note_id) || !text_ok(text) { return Err(Error::Input); }\n        if self.state.notes.contains_key(note_id) || self.state.used_ids.contains(operation_id) { return Err(Error::Duplicate); }\n        if self.state.notes.len() >= 1000 || self.state.pending.len() >= 1000 { return Err(Error::Capacity); }\n        let mut next = self.state.clone();\n        next.used_ids.insert(operation_id.into());\n        next.notes.insert(note_id.into(),Note { id:note_id.into(),text:text.into() });\n        next.pending.push_back(Operation { id:operation_id.into(),note_id:note_id.into(),text:text.into() }); self.commit(next)\n    }\n    pub fn front(&self) -> Option<Operation> { self.state.pending.front().cloned() }\n    pub fn pending_len(&self) -> usize { self.state.pending.len() }\n    pub fn notes(&self) -> Vec<Note> { self.state.notes.values().cloned().collect() }\n    pub fn ack(&mut self, operation_id: &str) -> Result<(), Error> {\n        if self.state.pending.front().is_none_or(|op| op.id != operation_id) { return Err(Error::Ack); }\n        let mut next = self.state.clone(); next.pending.pop_front(); self.commit(next)\n    }\n}\n#[derive(Default)] pub struct FakeServer { applied: BTreeMap<String, Operation>, notes: BTreeMap<String,String> }\nimpl FakeServer {\n    pub fn send(&mut self, operation: Operation) -> Result<String, Error> {\n        if let Some(old) = self.applied.get(&operation.id) { return if old == &operation { Ok(old.id.clone()) } else { Err(Error::Duplicate) }; }\n        if self.notes.contains_key(&operation.note_id) { return Err(Error::Duplicate); }\n        let id = operation.id.clone(); self.notes.insert(operation.note_id.clone(),operation.text.clone()); self.applied.insert(id.clone(),operation); Ok(id)\n    }\n    pub fn count(&self) -> usize { self.notes.len() }\n}\n#[cfg(test)] mod tests {\n    use super::*;\n    fn directory() -> PathBuf {\n        let p = std::env::temp_dir().join(format!(\"learn-mobile-outbox-{}-{}\",std::process::id(),NEXT.fetch_add(1,Ordering::Relaxed)));\n        fs::create_dir(&p).unwrap(); p\n    }\n    #[test] fn restart_and_lost_ack() {\n        let dir = directory(); let mut store = Store::open(&dir).unwrap();\n        store.create(\"op1\",\"note1\",\"Học Rust\").unwrap(); let first = store.front().unwrap();\n        let mut server = FakeServer::default(); server.send(first.clone()).unwrap();\n        drop(store); let mut store = Store::open(&dir).unwrap();\n        assert_eq!(store.front(),Some(first)); let ack = server.send(store.front().unwrap()).unwrap();\n        assert_eq!(server.count(),1); store.ack(&ack).unwrap(); drop(store);\n        let store = Store::open(&dir).unwrap(); assert_eq!(store.pending_len(),0); assert_eq!(store.notes().len(),1);\n        fs::remove_dir_all(dir).unwrap();\n    }\n    #[test] fn invalid_ack_and_duplicate_preserve_state() {\n        let dir = directory(); let mut store = Store::open(&dir).unwrap(); store.create(\"op1\",\"n1\",\"A\").unwrap();\n        assert_eq!(store.ack(\"wrong\"),Err(Error::Ack)); assert_eq!(store.create(\"op2\",\"n1\",\"B\"),Err(Error::Duplicate));\n        assert_eq!(store.pending_len(),1); assert_eq!(store.notes()[0].text,\"A\"); fs::remove_dir_all(dir).unwrap();\n    }\n    #[test] fn corrupted_file_is_not_replaced() {\n        let dir = directory(); fs::write(dir.join(\"state.json\"),b\"broken\").unwrap();\n        assert!(matches!(Store::open(&dir),Err(Error::Data))); assert_eq!(fs::read(dir.join(\"state.json\")).unwrap(),b\"broken\");\n        fs::remove_dir_all(dir).unwrap();\n    }\n    #[test] fn rejects_large_text_and_reused_operation() {\n        let dir = directory(); let mut store = Store::open(&dir).unwrap();\n        assert_eq!(store.create(\"op1\",\"n1\",&\"a\".repeat(1025)),Err(Error::Input));\n        let mut server = FakeServer::default(); let op = Operation { id:\"x\".into(),note_id:\"n1\".into(),text:\"A\".into() };\n        server.send(op.clone()).unwrap(); assert_eq!(server.send(Operation { text:\"B\".into(),..op }),Err(Error::Duplicate));\n        fs::remove_dir_all(dir).unwrap();\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use mobile_outbox::{FakeServer,Store};\nfn main() {\n    let path = std::env::args_os().nth(1).expect(\"Dùng: mobile_outbox THU_MUC_MOI\");\n    let mut store = Store::open(path).expect(\"Mở kho\");\n    if store.notes().is_empty() { store.create(\"create-note-1\",\"note-1\",\"Học Rust ngoại tuyến\").unwrap(); }\n    let mut server = FakeServer::default();\n    while let Some(operation) = store.front() {\n        let ack = server.send(operation).unwrap(); store.ack(&ack).unwrap(); println!(\"Đã ACK {ack}\");\n    }\n    println!(\"Ghi chú cục bộ: {}\",store.notes().len());\n}\n"
          },
          {
            "path": "README.md",
            "content": "# Outbox bền vững\n\nstate.json chứa version=1, notes, pending và used_ids trong cùng snapshot. create thêm note/operation/used ID cùng lần commit. ID không tái sử dụng kể cả đã ACK. ack chỉ xóa front có ID khớp; notes và lịch sử ID vẫn còn. Giới hạn 1000 mục, text 1024 byte, file 8 MiB. Kiểm tra cấu trúc và invariant sau deserialize; file hỏng bị giữ nguyên và trả Data.\n\nMột Store sở hữu thư mục. Mỗi commit tạo tệp tạm riêng cùng thư mục, write_all, sync_all, rename rồi mới đổi RAM. Đây không phải khóa liên process hay giao dịch nhiều file. Chưa fsync thư mục, nên không khẳng định mọi trường hợp mất điện giữ rename. Nếu sản phẩm cần nhiều writer/dữ liệu lớn, dùng database transaction cho notes/outbox/used IDs và giữ các test invariant.\n\nFakeServer giữ ID→request/kết quả trong RAM, chỉ dùng cho demo. Test lost ACK gửi lại cùng ID/nội dung và xác nhận server chỉ có một note. Server thật phải lưu idempotency cùng thay đổi nghiệp vụ trong transaction và có retention policy khớp thời hạn retry. Demo không có HTTP, authentication hoặc tài khoản.\n\nTích hợp mobile: adapter chọn thư mục ứng dụng được hệ điều hành cấp, service sở hữu một Store và serialize mọi write. UI hiển thị lưu cục bộ/pending theo snapshot. Khi app restart, mở lại kho rồi schedule batch còn chờ; không tái tạo operation ID. Lỗi file không được sửa bằng cách xóa dữ liệu âm thầm. Thêm export/restore với version và kiểm tra schema trước khi phục hồi.\n\nBài mở rộng: hỗ trợ edit/delete theo revision, trạng thái lỗi vĩnh viễn, giao thức conflict và retention; tạo fixture crash trước/ sau ACK, ổ đĩa đầy và payload hỏng. Native app cần smoke test thư mục/permission/lifecycle trên thiết bị, không chỉ test temp directory trên host.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run -- demo-data"
        ],
        "checks": [
          "Restart giữ notes và pending.",
          "ACK mất làm retry cùng ID; fake server không tạo bản trùng.",
          "ACK sai/duplicate/oversize không thay đổi trạng thái.",
          "File hỏng trả lỗi và giữ nguyên byte để phục hồi."
        ]
      },
      "simulation": {
        "title": "Outbox khi mất ACK",
        "description": "Dữ liệu và pending được lưu trước khi gửi; retry giữ ID.",
        "kind": "sequence",
        "nodes": [
          {
            "id": "disk",
            "label": "Kho cục bộ",
            "detail": "Note và operation cùng commit"
          },
          {
            "id": "send",
            "label": "Transport",
            "detail": "Có thể mất phản hồi"
          },
          {
            "id": "server",
            "label": "Server",
            "detail": "ID gắn request/kết quả"
          },
          {
            "id": "ack",
            "label": "ACK",
            "detail": "Xóa pending sau xác nhận"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Gửi thành công",
            "steps": [
              {
                "title": "Lưu cục bộ",
                "description": "Note và op-7 xuất hiện cùng snapshot.",
                "activeNodeIds": [
                  "disk"
                ],
                "values": [
                  {
                    "label": "pending",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Gửi",
                "description": "Transport gửi op-7.",
                "activeNodeIds": [
                  "send"
                ],
                "values": [
                  {
                    "label": "operation",
                    "value": "op-7"
                  }
                ]
              },
              {
                "title": "Commit",
                "description": "Server lưu tác động và kết quả.",
                "activeNodeIds": [
                  "server"
                ],
                "values": [
                  {
                    "label": "applied",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "ACK",
                "description": "Client xóa pending rồi lưu snapshot mới.",
                "activeNodeIds": [
                  "ack"
                ],
                "values": [
                  {
                    "label": "pending",
                    "value": "0"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "ACK bị mất",
            "steps": [
              {
                "title": "Lưu",
                "description": "Operation đã bền trước khi gửi.",
                "activeNodeIds": [
                  "disk"
                ],
                "values": [
                  {
                    "label": "pending",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Server commit",
                "description": "Tác động op-7 đã xảy ra.",
                "activeNodeIds": [
                  "server"
                ],
                "values": [
                  {
                    "label": "applied",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Mất phản hồi",
                "description": "Client giữ pending qua restart.",
                "activeNodeIds": [
                  "send"
                ],
                "values": [
                  {
                    "label": "pending",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Gửi lại",
                "description": "Server trả kết quả cũ cho cùng ID/request.",
                "activeNodeIds": [
                  "ack"
                ],
                "values": [
                  {
                    "label": "applied",
                    "value": "vẫn 1"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "mobile-conflict-resolution",
      "moduleId": "track-mobile",
      "title": "Xung đột nhiều thiết bị và đồng bộ có phiên bản",
      "description": "Chọn chiến lược conflict rõ ràng, tránh mất dữ liệu khi hai máy sửa ngoại tuyến.",
      "duration": 45,
      "objectives": [
        "Chọn chiến lược conflict rõ ràng, tránh mất dữ liệu khi hai máy sửa ngoại tuyến.",
        "Chỉ tăng revision khi base trùng current.",
        "Không quay vòng revision và không bỏ conflict."
      ],
      "sections": [
        {
          "title": "Offline tạo nhiều lịch sử hợp lệ",
          "text": "Hai thiết bị đọc revision 5 rồi mỗi máy sửa tiêu đề khác nhau. Khi reconnect, cả hai thay đổi đều dựa trên cùng trạng thái cũ; không thể tự coi thay đổi gửi sau là đúng hơn về ý định người dùng. Một chiến lược đơn giản gửi base_revision cùng nội dung. Server chỉ áp dụng nếu base khớp revision hiện hành, còn lại trả Conflict kèm bản mới để UI cho người dùng so sánh. Đây là optimistic concurrency, không phải thuật toán merge tự động cho mọi loại dữ liệu."
        },
        {
          "title": "Timestamp không tự giải quyết ý định",
          "text": "Đồng hồ thiết bị có thể lệch, người dùng có thể sửa offline lâu và mạng làm thay đổi thứ tự đến. Last-write-wins theo thời gian client có thể mất một chỉnh sửa hợp lệ mà không báo. Nếu dùng chiến lược này, phải chấp nhận và giải thích hành vi đó trong yêu cầu sản phẩm. Dữ liệu có thể tách theo trường hoặc dùng phép toán giao hoán trong một số miền, nhưng không nên gọi mọi list merge là CRDT. Bài học chọn conflict rõ ràng để người dùng quyết định thay vì âm thầm thắng thua."
        },
        {
          "title": "Xóa cũng là một thay đổi cần đồng bộ",
          "text": "Nếu xóa hẳn record khỏi database rồi không giữ dấu vết, một thiết bị offline có thể gửi bản cũ và làm mục xuất hiện lại. Tombstone lưu ID và revision xóa để phía khác biết trạng thái cuối. Việc dọn tombstone cần biết các replica hoặc retention policy đã đủ để không nhận lại phiên quá cũ. Đừng xóa tombstone chỉ vì UI không hiển thị nữa. Snapshot/cursor cũng cần quy tắc invalidation khi lịch sử đã bị dọn; client cũ có thể phải tải lại đầy đủ thay vì tiếp tục incremental sync sai.",
          "code": "fn apply_revision(current: u64, base: u64) -> Result<u64, &'static str> {\n    if current != base { return Err(\"conflict\"); }\n    current.checked_add(1).ok_or(\"revision-can\")\n}"
        },
        {
          "title": "Thực hành quyết định trước merge",
          "text": "Bài tập chấp nhận update khi base_revision bằng current và tăng revision bằng checked_add. Conflict không sửa nội dung hoặc làm pending biến mất. Trong Cargo, tạo hai replica với cùng base, gửi A rồi B, xác nhận B còn dữ liệu nháp và nhận conflict. Thêm test delete rồi update cũ, clock lệch và retry cùng operation ID. UI cần ba hành động rõ: giữ bản của tôi, dùng bản mới hoặc chỉnh lại sau khi xem cả hai. Mỗi quyết định tạo thao tác mới dựa trên revision hiện hành; không âm thầm đổi base rồi gửi lại nội dung cũ như thể đã được người dùng duyệt. Giữ lại bản nháp để đối chiếu."
        }
      ],
      "tip": "Thiết bị offline cần biết việc xóa đã xảy ra để không hồi sinh bản cũ.",
      "exercise": {
        "title": "Xung đột nhiều thiết bị và đồng bộ có phiên bản",
        "instructions": "Chọn chiến lược conflict rõ ràng, tránh mất dữ liệu khi hai máy sửa ngoại tuyến.",
        "requirements": [
          "Chỉ tăng revision khi base trùng current.",
          "Không quay vòng revision và không bỏ conflict."
        ]
      },
      "starterCode": "fn apply_revision(current: u64, base: u64) -> Result<u64, &'static str> { todo!() }\nfn main() {\nassert_eq!(apply_revision(5, 5), Ok(6));\nassert_eq!(apply_revision(6, 5), Err(\"conflict\"));\nassert_eq!(apply_revision(u64::MAX, u64::MAX), Err(\"revision-can\"));\nprintln!(\"Revision mới: {}\", apply_revision(5, 5).unwrap());\n}",
      "solutionCode": "fn apply_revision(current: u64, base: u64) -> Result<u64, &'static str> {\n    if current != base { return Err(\"conflict\"); }\n    current.checked_add(1).ok_or(\"revision-can\")\n}\nfn main() {\nassert_eq!(apply_revision(5, 5), Ok(6));\nassert_eq!(apply_revision(6, 5), Err(\"conflict\"));\nassert_eq!(apply_revision(u64::MAX, u64::MAX), Err(\"revision-can\"));\nprintln!(\"Revision mới: {}\", apply_revision(5, 5).unwrap());\n}",
      "expectedOutput": "Revision mới: 6",
      "hints": [
        "Chỉ tăng revision khi base trùng current.",
        "Thiết bị offline cần biết việc xóa đã xảy ra để không hồi sinh bản cũ."
      ],
      "quiz": {
        "question": "Xóa record khỏi UI có đủ để đồng bộ xóa tới thiết bị offline không?",
        "options": [
          "Đủ vì UI là nguồn sự thật.",
          "Chưa; cần tombstone hoặc lịch sử thay đổi có chính sách giữ phù hợp.",
          "Đủ nếu timestamp lớn."
        ],
        "correct": 1,
        "explanation": "Thiết bị offline cần biết việc xóa đã xảy ra để không hồi sinh bản cũ."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/collections/struct.BTreeMap.html"
      }
    },
    {
      "id": "mobile-observability",
      "moduleId": "track-mobile",
      "title": "Đo độ trễ FFI, bộ nhớ và lỗi có thể chẩn đoán",
      "description": "Quan sát hành trình người dùng qua native và Rust mà không ghi dữ liệu cá nhân vào log.",
      "duration": 45,
      "objectives": [
        "Quan sát hành trình người dùng qua native và Rust mà không ghi dữ liệu cá nhân vào log.",
        "Dùng nearest-rank và không truy cập chỉ số khi danh sách rỗng.",
        "Từ chối p ngoài 1..100 và dùng checked arithmetic cho rank."
      ],
      "sections": [
        {
          "title": "Đo hành trình thay vì một hàm riêng lẻ",
          "text": "Người dùng thấy thời gian từ nhấn nút đến khi UI hiển thị kết quả. Khoảng đó gồm dispatch, chuyển đổi dữ liệu, chờ lock, xử lý Rust, chuyển kết quả và render. Benchmark một hàm core rất nhanh không chứng minh giao diện mượt. Gắn operation ID cho cả hành trình và đo các mốc bằng clock đơn điệu phù hợp từng process. Không trừ trực tiếp timestamp từ hai clock khác gốc. Trên mobile, cần quan sát cả frame bị trễ và bộ nhớ native khi danh sách lớn được chuyển qua FFI."
        },
        {
          "title": "Phân phối quan trọng hơn một con số trung bình",
          "text": "Một trăm thao tác rất nhanh và vài thao tác đứng lâu có thể cho trung bình nhìn đẹp nhưng trải nghiệm khó chịu. Lưu histogram hoặc mẫu có trần để tính p50, p95 và giá trị lớn nhất trong cùng điều kiện đo. Định nghĩa cách tính percentile để các báo cáo so được với nhau. Bài tập dùng nearest-rank trên danh sách độ trễ đã sắp xếp, làm tròn chỉ số lên và từ chối percentile ngoài 1..100. Không dùng bộ dữ liệu quá nhỏ để khẳng định SLA; nó chỉ minh họa thuật toán."
        },
        {
          "title": "Chẩn đoán đủ ngữ cảnh mà không lộ nội dung",
          "text": "Log nên chứa loại thao tác, build ID, target, mã lỗi, số mục và thời gian. Không mặc định ghi toàn bộ tiêu đề ghi chú, token hoặc payload chỉ vì debug tiện hơn. Định danh có thể cần thay bằng giá trị tương quan có phạm vi phiên theo yêu cầu sản phẩm. Mã lỗi nội bộ và thông báo cho người dùng có mục đích khác nhau: người dùng cần hành động tiếp theo, người vận hành cần lớp lỗi. Panic hoặc symbolicated crash phải được giữ với phiên bản binary tương ứng để truy được stack đúng.",
          "code": "fn percentile(values: &[u64], p: usize) -> Option<u64> {\n    if values.is_empty() || !(1..=100).contains(&p) { return None; }\n    let mut sorted = values.to_vec(); sorted.sort_unstable();\n    let rank = sorted.len().checked_mul(p)?.checked_add(99)? / 100;\n    Some(sorted[rank - 1])\n}"
        },
        {
          "title": "Thực hành đo và giới hạn log",
          "text": "Trong Cargo, đo add/snapshot với kích thước 1, 100 và 1000 mục; ghi số byte trả về để hiểu chi phí copy. So page nhỏ và snapshot lớn trên thiết bị thật, giữ nguyên dữ liệu và chế độ build. Bài tập percentile cần test danh sách rỗng, một phần tử và giá trị trùng. Thêm test logger không ghi trường nội dung và có giới hạn số sự kiện trong RAM. Khi báo cáo cải thiện, nêu thiết bị, bản OS, release/debug và điều kiện nóng/lạnh. Một kết quả nhanh trên laptop không đại diện mọi điện thoại, đặc biệt khi có giới hạn nhiệt và pin."
        }
      ],
      "tip": "Độ trễ người dùng gồm nhiều lớp; cần xác định lớp chiếm thời gian trước khi tối ưu.",
      "exercise": {
        "title": "Đo độ trễ FFI, bộ nhớ và lỗi có thể chẩn đoán",
        "instructions": "Quan sát hành trình người dùng qua native và Rust mà không ghi dữ liệu cá nhân vào log.",
        "requirements": [
          "Dùng nearest-rank và không truy cập chỉ số khi danh sách rỗng.",
          "Từ chối p ngoài 1..100 và dùng checked arithmetic cho rank."
        ]
      },
      "starterCode": "fn percentile(values: &[u64], p: usize) -> Option<u64> { todo!() }\nfn main() {\nassert_eq!(percentile(&[1,2,3,4,100], 95), Some(100));\nassert_eq!(percentile(&[7], 50), Some(7));\nassert_eq!(percentile(&[], 95), None);\nassert_eq!(percentile(&[1], 0), None);\nprintln!(\"p95: {} ms\", percentile(&[1,2,3,4,100], 95).unwrap());\n}",
      "solutionCode": "fn percentile(values: &[u64], p: usize) -> Option<u64> {\n    if values.is_empty() || !(1..=100).contains(&p) { return None; }\n    let mut sorted = values.to_vec(); sorted.sort_unstable();\n    let rank = sorted.len().checked_mul(p)?.checked_add(99)? / 100;\n    Some(sorted[rank - 1])\n}\nfn main() {\nassert_eq!(percentile(&[1,2,3,4,100], 95), Some(100));\nassert_eq!(percentile(&[7], 50), Some(7));\nassert_eq!(percentile(&[], 95), None);\nassert_eq!(percentile(&[1], 0), None);\nprintln!(\"p95: {} ms\", percentile(&[1,2,3,4,100], 95).unwrap());\n}",
      "expectedOutput": "p95: 100 ms",
      "hints": [
        "Dùng nearest-rank và không truy cập chỉ số khi danh sách rỗng.",
        "Độ trễ người dùng gồm nhiều lớp; cần xác định lớp chiếm thời gian trước khi tối ưu."
      ],
      "quiz": {
        "question": "Core chỉ mất 2 ms nhưng UI hiện kết quả sau 300 ms. Nên đo gì tiếp?",
        "options": [
          "Chỉ đếm thêm số dòng Rust.",
          "Bỏ toàn bộ test.",
          "Dispatch, lock, serialize/FFI và render trong cùng hành trình."
        ],
        "correct": 2,
        "explanation": "Độ trễ người dùng gồm nhiều lớp; cần xác định lớp chiếm thời gian trước khi tối ưu."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://mozilla.github.io/uniffi-rs/latest/internals/lifting_and_lowering.html"
      }
    },
    {
      "id": "mobile-catalog-project",
      "moduleId": "track-mobile",
      "title": "Dự án tổng hợp: danh mục dùng chung có conflict",
      "description": "Xây engine cập nhật danh mục, tombstone và snapshot phân trang qua UniFFI.",
      "duration": 100,
      "objectives": [
        "Xây engine cập nhật danh mục, tombstone và snapshot phân trang qua UniFFI.",
        "ID mới là thao tác khác; ID/nội dung trùng là retry.",
        "ID trùng nhưng nội dung khác phải là lỗi rõ ràng."
      ],
      "sections": [
        {
          "title": "Một sản phẩm có nhiều phía tham gia",
          "text": "Dự án quản lý danh mục công việc hoặc hàng mẫu cho hai ứng dụng native, có chỉnh sửa ngoại tuyến và API core chung. Mỗi mục có ID, tiêu đề, revision và trạng thái deleted. Thao tác gửi operation ID, base_revision và nội dung mới. Engine mẫu đóng vai trò phía có thẩm quyền trong host test để kiểm tra merge policy; ứng dụng thật cần adapter lưu bền và server triển khai cùng hợp đồng. Không coi việc hai object trong một process chia sẻ map là đã có đồng bộ mạng hoàn chỉnh."
        },
        {
          "title": "Idempotency phải kiểm tra cả nội dung",
          "text": "Khi nhận operation ID đã xử lý, engine chỉ trả lại kết quả nếu request giống request trước. Dùng cùng ID với nội dung khác là lỗi ReusedOperation, vì nếu chỉ trả success có thể khiến caller tưởng nội dung mới đã được áp dụng. Khi request mới, kiểm tra base revision, tính revision kế tiếp và commit cùng kết quả idempotency. Một bảng đã xử lý cần trần và retention policy; xóa tùy tiện có thể làm retry cũ tạo tác động lần nữa. Bản mẫu từ chối khi đầy để hành vi rõ ràng, còn sản phẩm thiết kế lưu bền và thời hạn retry."
        },
        {
          "title": "Snapshot và tombstone giữ lịch sử có nghĩa",
          "text": "Read page nhận catalog_revision của snapshot quan sát; nếu engine đã thay đổi, trả StaleSnapshot để caller tải lại thay vì trộn trang. Bản mẫu dùng phân trang theo ID và giữ tombstone trong dữ liệu engine, đồng thời cho UI lựa chọn chỉ hiện mục còn sống. Delete là một mutation có revision, không chỉ remove khỏi map. Thiết bị giữ base cũ sẽ nhận Conflict thay vì hồi sinh record. Trả record sở hữu dữ liệu để UI không giữ lock hoặc borrow vào trạng thái Rust trong thời gian render.",
          "code": "fn same_operation(old_id: &str, old_body: &str, new_id: &str, new_body: &str) -> Result<bool, &'static str> {\n    if old_id != new_id { return Ok(false); }\n    if old_body != new_body { return Err(\"id-tai-su-dung\"); }\n    Ok(true)\n}"
        },
        {
          "title": "Hoàn thiện thành sản phẩm có bằng chứng",
          "text": "Cargo project xuất UniFFI Object, có demo host và test hai writer, retry, operation ID đổi nội dung, tombstone, stale page và giới hạn. Sinh binding rồi chạy cùng fixture trên Swift/Kotlin; thêm adapter lưu snapshot/outbox từ dự án trước và transport có deadline. UI cần màn hình conflict, trạng thái pending và lựa chọn giải quyết rõ ràng. Đóng gói đúng ABI, đo latency/bộ nhớ và thử restart khi có việc chờ. Rubric yêu cầu chỉ ra phần host đã chứng minh, phần native đã chạy và phần server còn phải triển khai. Một portfolio tốt cho thấy quyết định và lỗi tái hiện được, không chỉ có danh sách chức năng. Hai consumer thật trong lab gọi engine qua Swift/Kotlin, kiểm tra trang dữ liệu, lỗi có kiểu và retry trước khi ghép UI. Script build/run và cấu hình Gradle/JNA đi kèm; hướng dẫn iOS/Android chỉ rõ artifact, ABI và các bước kiểm thử trên thiết bị."
        }
      ],
      "tip": "Idempotency cần gắn ID với request và kết quả, không chỉ ghi một tập ID đã thấy.",
      "exercise": {
        "title": "Dự án tổng hợp: danh mục dùng chung có conflict",
        "instructions": "Xây engine cập nhật danh mục, tombstone và snapshot phân trang qua UniFFI.",
        "requirements": [
          "ID mới là thao tác khác; ID/nội dung trùng là retry.",
          "ID trùng nhưng nội dung khác phải là lỗi rõ ràng."
        ]
      },
      "starterCode": "fn same_operation(old_id: &str, old_body: &str, new_id: &str, new_body: &str) -> Result<bool, &'static str> { todo!() }\nfn main() {\nassert_eq!(same_operation(\"op1\",\"A\",\"op1\",\"A\"), Ok(true));\nassert_eq!(same_operation(\"op1\",\"A\",\"op2\",\"A\"), Ok(false));\nassert_eq!(same_operation(\"op1\",\"A\",\"op1\",\"B\"), Err(\"id-tai-su-dung\"));\nprintln!(\"Retry phải giữ cả ID và nội dung\");\n}",
      "solutionCode": "fn same_operation(old_id: &str, old_body: &str, new_id: &str, new_body: &str) -> Result<bool, &'static str> {\n    if old_id != new_id { return Ok(false); }\n    if old_body != new_body { return Err(\"id-tai-su-dung\"); }\n    Ok(true)\n}\nfn main() {\nassert_eq!(same_operation(\"op1\",\"A\",\"op1\",\"A\"), Ok(true));\nassert_eq!(same_operation(\"op1\",\"A\",\"op2\",\"A\"), Ok(false));\nassert_eq!(same_operation(\"op1\",\"A\",\"op1\",\"B\"), Err(\"id-tai-su-dung\"));\nprintln!(\"Retry phải giữ cả ID và nội dung\");\n}",
      "expectedOutput": "Retry phải giữ cả ID và nội dung",
      "hints": [
        "ID mới là thao tác khác; ID/nội dung trùng là retry.",
        "Idempotency cần gắn ID với request và kết quả, không chỉ ghi một tập ID đã thấy."
      ],
      "quiz": {
        "question": "Operation ID trùng nhưng payload khác request đã commit. Engine nên làm gì?",
        "options": [
          "Trả kết quả cũ như success của payload mới.",
          "Từ chối việc tái sử dụng ID với nội dung khác.",
          "Áp dụng lại không kiểm tra."
        ],
        "correct": 1,
        "explanation": "Idempotency cần gắn ID với request và kết quả, không chỉ ghi một tập ID đã thấy."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://mozilla.github.io/uniffi-rs/latest/types/interfaces.html"
      },
      "localLab": {
        "title": "Catalog engine có conflict và tombstone",
        "instructions": "Dự án cung cấp engine có thẩm quyền trong host test và UniFFI bridge. Hoàn thiện capstone bằng persistence, transport và hai UI native theo các mốc dự án; mẫu này không tự là server đồng bộ hoặc app đã đóng gói. Hai consumer Swift/Kotlin và script build/run đã có trong files; consumers/NATIVE.md hướng dẫn ghép iOS/Android, JNA và kiểm thử đúng ABI.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"mobile_catalog\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[lib]\ncrate-type = [\"cdylib\", \"staticlib\", \"rlib\"]\n\n[features]\nbindgen = [\"uniffi/cli\"]\n\n[dependencies]\nuniffi = \"=0.32.2\"\n\n[[bin]]\nname = \"uniffi-bindgen\"\npath = \"src/bin/uniffi-bindgen.rs\"\nrequired-features = [\"bindgen\"]\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::{collections::BTreeMap, sync::{Arc, Mutex}};\nuniffi::setup_scaffolding!();\n#[derive(Clone, Debug, PartialEq, uniffi::Record)]\npub struct Mutation { pub operation_id: String, pub id: String, pub base_revision: u64, pub title: String, pub deleted: bool }\n#[derive(Clone, Debug, PartialEq, uniffi::Record)]\npub struct Item { pub id: String, pub revision: u64, pub title: String, pub deleted: bool }\n#[derive(Debug, uniffi::Record)]\npub struct Page { pub catalog_revision: u64, pub items: Vec<Item>, pub next_after: Option<String> }\n#[derive(Debug, PartialEq, uniffi::Error)]\npub enum CatalogError { Input, Conflict, ReusedOperation, Missing, StaleSnapshot, Capacity, Overflow, Internal }\nimpl std::fmt::Display for CatalogError { fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result { write!(f,\"{self:?}\") } }\nimpl std::error::Error for CatalogError {}\n#[derive(Default)] struct State {\n    revision: u64, items: BTreeMap<String, Item>, applied: BTreeMap<String,(Mutation,Item)>\n}\n#[derive(uniffi::Object)] pub struct Catalog { state: Mutex<State> }\nfn id_ok(id: &str) -> bool { !id.is_empty() && id.len() <= 64 && id.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_') }\n#[uniffi::export] impl Catalog {\n    #[uniffi::constructor]\n    pub fn new() -> Arc<Self> { Arc::new(Self { state: Mutex::new(State::default()) }) }\n    pub fn revision(&self) -> Result<u64,CatalogError> { Ok(self.state.lock().map_err(|_| CatalogError::Internal)?.revision) }\n    pub fn apply(&self, request: Mutation) -> Result<Item,CatalogError> {\n        if !id_ok(&request.operation_id) || !id_ok(&request.id) || request.title.len() > 512 ||\n            (!request.deleted && (request.title.trim().is_empty() || request.title.chars().count() > 128)) ||\n            (request.deleted && !request.title.is_empty()) { return Err(CatalogError::Input); }\n        let mut state = self.state.lock().map_err(|_| CatalogError::Internal)?;\n        if let Some((old,result)) = state.applied.get(&request.operation_id) {\n            return if old == &request { Ok(result.clone()) } else { Err(CatalogError::ReusedOperation) };\n        }\n        if state.applied.len() >= 2000 { return Err(CatalogError::Capacity); }\n        let previous = state.items.get(&request.id);\n        if request.deleted && previous.is_none() { return Err(CatalogError::Missing); }\n        let current = previous.map_or(0,|item| item.revision);\n        if current != request.base_revision { return Err(CatalogError::Conflict); }\n        if previous.is_none() && state.items.len() >= 1000 { return Err(CatalogError::Capacity); }\n        let item_revision = current.checked_add(1).ok_or(CatalogError::Overflow)?;\n        let global_revision = state.revision.checked_add(1).ok_or(CatalogError::Overflow)?;\n        let item = Item { id: request.id.clone(), revision: item_revision, title: request.title.clone(), deleted: request.deleted };\n        state.items.insert(item.id.clone(),item.clone());\n        state.applied.insert(request.operation_id.clone(),(request,item.clone())); state.revision = global_revision; Ok(item)\n    }\n    pub fn page(&self, expected_revision: u64, after_id: Option<String>, limit: u32, include_deleted: bool) -> Result<Page,CatalogError> {\n        if !(1..=50).contains(&limit) || after_id.as_ref().is_some_and(|id| !id_ok(id)) { return Err(CatalogError::Input); }\n        let state = self.state.lock().map_err(|_| CatalogError::Internal)?;\n        if state.revision != expected_revision { return Err(CatalogError::StaleSnapshot); }\n        let mut items: Vec<_> = state.items.values()\n            .filter(|item| after_id.as_ref().is_none_or(|after| item.id.as_str() > after.as_str()))\n            .filter(|item| include_deleted || !item.deleted).take(limit as usize + 1).cloned().collect();\n        let more = items.len() > limit as usize; if more { items.pop(); }\n        let next_after = if more { items.last().map(|item| item.id.clone()) } else { None };\n        Ok(Page { catalog_revision:state.revision,items,next_after })\n    }\n}\n#[cfg(test)] mod tests {\n    use super::*;\n    fn change(op: &str, id: &str, base: u64, title: &str) -> Mutation { Mutation { operation_id:op.into(),id:id.into(),base_revision:base,title:title.into(),deleted:false } }\n    #[test] fn retry_and_reuse_are_distinct() {\n        let c = Catalog::new(); let req = change(\"op1\",\"a\",0,\"A\");\n        let result = c.apply(req.clone()).unwrap(); assert_eq!(c.apply(req),Ok(result)); assert_eq!(c.revision(),Ok(1));\n        assert_eq!(c.apply(change(\"op1\",\"a\",0,\"B\")),Err(CatalogError::ReusedOperation));\n    }\n    #[test] fn offline_writer_conflicts_and_keeps_authoritative_state() {\n        let c = Catalog::new(); c.apply(change(\"create\",\"a\",0,\"A\")).unwrap();\n        c.apply(change(\"device1\",\"a\",1,\"B\")).unwrap();\n        assert_eq!(c.apply(change(\"device2\",\"a\",1,\"C\")),Err(CatalogError::Conflict));\n        assert_eq!(c.page(2,None,10,false).unwrap().items[0].title,\"B\");\n    }\n    #[test] fn tombstone_blocks_stale_update() {\n        let c = Catalog::new(); c.apply(change(\"create\",\"a\",0,\"A\")).unwrap();\n        c.apply(Mutation { deleted:true,..change(\"delete\",\"a\",1,\"\") }).unwrap();\n        assert_eq!(c.apply(change(\"old\",\"a\",1,\"Resurrect\")),Err(CatalogError::Conflict));\n        assert!(c.page(2,None,10,false).unwrap().items.is_empty());\n        assert!(c.page(2,None,10,true).unwrap().items[0].deleted);\n    }\n    #[test] fn page_snapshot_and_bounds() {\n        let c = Catalog::new();\n        c.apply(change(\"op-a\",\"a\",0,\"A\")).unwrap(); c.apply(change(\"op-b\",\"b\",0,\"B\")).unwrap();\n        let first = c.page(2,None,1,false).unwrap(); assert_eq!(first.next_after.as_deref(),Some(\"a\"));\n        let second = c.page(2,first.next_after,1,false).unwrap(); assert_eq!(second.items[0].id,\"b\"); assert_eq!(second.next_after,None);\n        c.apply(change(\"op-c\",\"c\",0,\"C\")).unwrap();\n        assert!(matches!(c.page(2,None,1,false),Err(CatalogError::StaleSnapshot)));\n        assert!(matches!(c.page(3,None,51,false),Err(CatalogError::Input)));\n    }\n    #[test] fn input_and_missing_delete() {\n        let c = Catalog::new();\n        assert_eq!(c.apply(change(\"bad/id\",\"a\",0,\"A\")),Err(CatalogError::Input));\n        assert_eq!(c.apply(Mutation { deleted:true,..change(\"op\",\"a\",0,\"\") }),Err(CatalogError::Missing));\n    }\n}\n"
          },
          {
            "path": "src/bin/uniffi-bindgen.rs",
            "content": "fn main() { uniffi::uniffi_bindgen_main(); }\n"
          },
          {
            "path": "examples/host.rs",
            "content": "use mobile_catalog::{Catalog,Mutation};\nfn main() {\n    let c = Catalog::new();\n    let created = c.apply(Mutation { operation_id:\"op1\".into(),id:\"a\".into(),base_revision:0,title:\"Học Rust\".into(),deleted:false }).unwrap();\n    println!(\"Mục {} revision {}\",created.id,created.revision);\n    let page = c.page(c.revision().unwrap(),None,10,false).unwrap();\n    println!(\"Số mục: {}\",page.items.len());\n}\n"
          },
          {
            "path": "README.md",
            "content": "# Catalog có phiên bản\n\nMutation chứa operation_id, id, base_revision, title và deleted. Tạo mới dùng base=0. Sửa/xóa phải khớp revision của item; xóa yêu cầu title rỗng và tạo tombstone. Cùng ID/nội dung trả lại kết quả cũ; dùng lại ID với payload khác trả ReusedOperation. Tối đa 1000 item/tombstone và 2000 operation đã xử lý; đầy thì từ chối thay vì âm thầm xóa lịch sử idempotency.\n\nMỗi mutation tăng item revision và catalog revision. page yêu cầu catalog_revision hiện hành, after_id, limit 1..50 và include_deleted. Khi có write giữa hai trang, StaleSnapshot yêu cầu tải lại. API không hứa snapshot lịch sử vẫn được giữ. Không dùng item revision làm catalog revision vì hai counter có ý nghĩa khác nhau.\n\nCore hiện giữ RAM, không có network. Để thành app offline: lưu notes/outbox/operation IDs theo transaction từ dự án trước; native UI gửi pending qua transport có auth/deadline; phía server thực hiện cùng điều kiện base và idempotency trong transaction. Conflict giữ bản nháp, hiển thị local/remote và chỉ tạo request mới sau lựa chọn người dùng. Nếu cần tìm kiếm, thêm index có version nhưng vẫn giữ quyền sở hữu và trần dữ liệu.\n\nChạy cùng fixture qua Swift/Kotlin: create A, hai writer base 1, delete, update cũ, retry, reuse-ID và stale page. Đo startup, page latency, byte qua FFI và native heap. Khi triển khai server, test network mất sau commit trước ACK; khi restart app, pending phải tiếp tục cùng ID.\n\n## Chạy Rust và consumer Swift/Kotlin\n\nChạy cargo test --all-targets và cargo run --example host để kiểm tra core. Tiếp theo chạy bash scripts/smoke-swift.sh và bash scripts/smoke-kotlin.sh: mỗi script build thư viện, sinh binding đúng phiên bản, compile rồi thực thi consumer thật. Fixture kiểm tra constructor, mutation, snapshot/page và lỗi Conflict đi qua FFI; catalog còn có retry và StaleSnapshot.\n\nconsumers/NATIVE.md đi kèm đầy đủ yêu cầu công cụ, modulemap/rpath Swift, Gradle/JNA, lệnh đóng XCFramework iOS, lệnh build/copy ABI Android và cấu hình JNA dạng AAR. Hai consumer host chứng minh khả năng gọi native library trên máy đang chạy; nghiệm thu simulator/device, lifecycle và packaging thực hiện theo phần native trong cùng tài liệu.\n\nKhi Conflict, giữ bản nháp và tải snapshot mới. Việc nặng chạy ngoài luồng UI; Kotlin owner đóng wrapper bằng close/use. Công việc cần sống qua process death phải lưu bền và được adapter điều phối theo thời hạn của hệ điều hành. Manifest bàn giao ghi commit, toolchain, UniFFI, target, feature, hash binary và kết quả kiểm thử từng nền tảng.\n"
          },
          {
            "path": "consumers/swift/main.swift",
            "content": "import Foundation\n\nfunc verifyCatalogBridge() throws {\n    let catalog = Catalog()\n    let request = Mutation(operationId: \"create-1\", id: \"rust\", baseRevision: 0, title: \"Học Rust\", deleted: false)\n    let created = try catalog.apply(request: request)\n    precondition(created.revision == 1 && created.title == \"Học Rust\")\n    let before = try catalog.page(expectedRevision: 1, afterId: nil, limit: 10, includeDeleted: false)\n    precondition(before.catalogRevision == 1 && before.items.count == 1 && before.nextAfter == nil)\n    do {\n        _ = try catalog.apply(request: Mutation(operationId: \"stale-2\", id: \"rust\", baseRevision: 0, title: \"Bản nháp\", deleted: false))\n        fatalError(\"Writer có baseRevision cũ phải nhận Conflict\")\n    } catch CatalogError.Conflict {\n    }\n    let unchanged = try catalog.page(expectedRevision: 1, afterId: nil, limit: 10, includeDeleted: false)\n    precondition(unchanged == before)\n    let retried = try catalog.apply(request: request)\n    let revision = try catalog.revision()\n    precondition(retried == created && revision == 1)\n    let updated = try catalog.apply(request: Mutation(operationId: \"edit-3\", id: \"rust\", baseRevision: 1, title: \"Rust nâng cao\", deleted: false))\n    precondition(updated.revision == 2)\n    do {\n        _ = try catalog.page(expectedRevision: 1, afterId: nil, limit: 10, includeDeleted: false)\n        fatalError(\"Page cũ phải nhận StaleSnapshot\")\n    } catch CatalogError.StaleSnapshot {\n    }\n    let after = try catalog.page(expectedRevision: 2, afterId: nil, limit: 10, includeDeleted: false)\n    precondition(after.items[0].title == \"Rust nâng cao\")\n    print(\"Swift Catalog: constructor, mutation, page, Conflict, retry, StaleSnapshot PASS\")\n}\n\ndo {\n    try verifyCatalogBridge()\n} catch {\n    fatalError(\"Bridge thất bại: \\(error)\")\n}\n"
          },
          {
            "path": "consumers/kotlin/src/main/kotlin/Smoke.kt",
            "content": "import uniffi.mobile_catalog.Catalog\nimport uniffi.mobile_catalog.CatalogException\nimport uniffi.mobile_catalog.Mutation\n\nfun verifyCatalogBridge() {\n    Catalog().use { catalog ->\n        val request = Mutation(\"create-1\", \"rust\", 0uL, \"Học Rust\", false)\n        val created = catalog.apply(request)\n        check(created.revision == 1uL && created.title == \"Học Rust\")\n        val before = catalog.page(1uL, null, 10u, false)\n        check(before.catalogRevision == 1uL && before.items.size == 1 && before.nextAfter == null)\n        try {\n            catalog.apply(Mutation(\"stale-2\", \"rust\", 0uL, \"Bản nháp\", false))\n            error(\"Writer có baseRevision cũ phải nhận Conflict\")\n        } catch (_: CatalogException.Conflict) {\n        }\n        check(catalog.page(1uL, null, 10u, false) == before)\n        check(catalog.apply(request) == created)\n        check(catalog.revision() == 1uL)\n        check(catalog.apply(Mutation(\"edit-3\", \"rust\", 1uL, \"Rust nâng cao\", false)).revision == 2uL)\n        try {\n            catalog.page(1uL, null, 10u, false)\n            error(\"Page cũ phải nhận StaleSnapshot\")\n        } catch (_: CatalogException.StaleSnapshot) {\n        }\n        check(catalog.page(2uL, null, 10u, false).items.single().title == \"Rust nâng cao\")\n    }\n    println(\"Kotlin Catalog: constructor, mutation, page, Conflict, retry, StaleSnapshot PASS\")\n}\n\nfun main() = verifyCatalogBridge()\n"
          },
          {
            "path": "consumers/kotlin/settings.gradle.kts",
            "content": "rootProject.name = \"mobile_catalog-consumer\"\n"
          },
          {
            "path": "consumers/kotlin/build.gradle.kts",
            "content": "import org.jetbrains.kotlin.gradle.dsl.JvmTarget\n\nplugins {\n    kotlin(\"jvm\") version \"2.4.21\"\n    application\n}\n\nrepositories { mavenCentral() }\n\ndependencies {\n    implementation(\"net.java.dev.jna:jna:5.19.1\")\n}\n\nkotlin {\n    compilerOptions { jvmTarget.set(JvmTarget.JVM_17) }\n    sourceSets.main { kotlin.srcDir(\"../../generated/kotlin\") }\n}\n\njava {\n    sourceCompatibility = JavaVersion.VERSION_17\n    targetCompatibility = JavaVersion.VERSION_17\n}\n\napplication { mainClass.set(\"SmokeKt\") }\n\ntasks.named<JavaExec>(\"run\") {\n    systemProperty(\"jna.library.path\", providers.gradleProperty(\"nativeLibDir\").get())\n    if (JavaVersion.current().isCompatibleWith(JavaVersion.VERSION_24)) {\n        jvmArgs(\"--enable-native-access=ALL-UNNAMED\")\n    }\n}\n"
          },
          {
            "path": "scripts/host-env.sh",
            "content": "#!/usr/bin/env bash\nset -euo pipefail\nLAB_ROOT=\"$(cd \"$(dirname \"${BASH_SOURCE[0]}\")/..\" && pwd)\"\ncd \"$LAB_ROOT\"\nCRATE_NAME=\"mobile_catalog\"\ncase \"$(uname -s)\" in\n  Darwin) LIB_EXT=dylib ;;\n  Linux) LIB_EXT=so ;;\n  *) echo \"Script host hỗ trợ macOS/Linux; Windows cần lệnh linker tương ứng.\" >&2; exit 2 ;;\nesac\nTARGET_ROOT=\"${CARGO_TARGET_DIR:-$LAB_ROOT/target}\"\ncase \"$TARGET_ROOT\" in\n  /*) ;;\n  *) TARGET_ROOT=\"$LAB_ROOT/$TARGET_ROOT\" ;;\nesac\nexport CARGO_TARGET_DIR=\"$TARGET_ROOT\"\nLIB_DIR=\"$TARGET_ROOT/debug\"\nLIBRARY=\"$LIB_DIR/lib$CRATE_NAME.$LIB_EXT\"\nbuild_binding() {\n  cargo build --lib\n  if [ ! -f \"$LIBRARY\" ]; then\n    echo \"Không có thư viện host: $LIBRARY. Kiểm tra CARGO_BUILD_TARGET hoặc cấu hình target của Cargo.\" >&2\n    exit 2\n  fi\n  cargo run --features bindgen --bin uniffi-bindgen -- generate \\\n    --library \"$LIBRARY\" --language \"$1\" --out-dir \"$LAB_ROOT/generated/$1\" --no-format\n}\n"
          },
          {
            "path": "scripts/smoke-swift.sh",
            "content": "#!/usr/bin/env bash\nset -euo pipefail\nsource \"$(dirname \"${BASH_SOURCE[0]}\")/host-env.sh\"\nbuild_binding swift\nmkdir -p \"$TARGET_ROOT/consumer-smoke\"\nOUTPUT=\"$TARGET_ROOT/consumer-smoke/$CRATE_NAME-swift\"\nswiftc -module-name \"MobileCatalogSmoke\" \\\n  -I \"$LAB_ROOT/generated/swift\" \\\n  -Xcc \"-fmodule-map-file=$LAB_ROOT/generated/swift/${CRATE_NAME}FFI.modulemap\" \\\n  \"$LAB_ROOT/generated/swift/$CRATE_NAME.swift\" \"$LAB_ROOT/consumers/swift/main.swift\" \\\n  -L \"$LIB_DIR\" \"-l$CRATE_NAME\" \\\n  -Xlinker -rpath -Xlinker \"$LIB_DIR\" -o \"$OUTPUT\"\n\"$OUTPUT\"\n"
          },
          {
            "path": "scripts/smoke-kotlin.sh",
            "content": "#!/usr/bin/env bash\nset -euo pipefail\nsource \"$(dirname \"${BASH_SOURCE[0]}\")/host-env.sh\"\nbuild_binding kotlin\ngradle --no-daemon --console=plain -p \"$LAB_ROOT/consumers/kotlin\" \\\n  \"-PnativeLibDir=$LIB_DIR\" run\n"
          },
          {
            "path": "consumers/NATIVE.md",
            "content": "# Chạy consumer và ghép vào ứng dụng\n\n## Consumer host có thể chạy ngay\n\nCác script chạy từ bất kỳ thư mục nào, tự quay về Cargo project và tôn trọng CARGO_TARGET_DIR. Không đặt CARGO_BUILD_TARGET về iOS/Android khi chạy smoke host. Cần Rust, Swift compiler cho Swift; JDK 17 trở lên và Gradle tương thích cho Kotlin. Kotlin plugin khóa 2.4.21, JNA khóa 5.19.1. Với Gradle 9.6.1 dùng JDK 17–26 theo cấu hình Gradle đã cài; bản kiểm tra của khoá học dùng JDK 26. Bytecode của consumer đặt target 17 cho cả Java/Kotlin, không tự tải JDK khác.\n\n```sh\nbash scripts/smoke-swift.sh\nbash scripts/smoke-kotlin.sh\n```\n\nMỗi script build Rust cdylib, sinh lại binding từ đúng binary rồi compile và chạy consumer thật. Swift nhận header/modulemap qua compiler flag và rpath tới native library. Gradle lấy thư mục binding làm source set, tải JNA dạng JAR và truyền jna.library.path. Không chỉ kiểm tra generator. Kết quả kết thúc bằng PASS, process lỗi trả mã khác 0. Fixture có constructor, mutation, snapshot/page, Unicode và Conflict; catalog còn kiểm tra retry cùng operation ID và StaleSnapshot. Kotlin dùng use để đóng native handle. Các record chỉ chứa giá trị nên không có nested native object phải đóng riêng.\n\nNếu macOS có JDK qua Homebrew nhưng java hệ thống chưa tìm được runtime, đặt JAVA_HOME về thư mục Contents/Home của JDK đã cài, thêm JAVA_HOME/bin vào PATH rồi chạy lại. Không sửa generated binding để che lỗi library load: kiểm tra tên thư viện, kiến trúc CPU, đường dẫn, cùng phiên bản UniFFI và checksum hợp đồng. Host smoke chưa kiểm chứng ABI hay vòng đời hệ điều hành của điện thoại.\n\n## iOS: ARM64 device và ARM64 simulator\n\nCần Xcode và SDK iOS đầy đủ. Từ gốc lab, chạy các lệnh sau sau khi Swift host smoke đã đạt. TARGET_ROOT là thư mục artifact của bài tập.\n\n```sh\nrustup target add aarch64-apple-ios aarch64-apple-ios-sim\nexport IPHONEOS_DEPLOYMENT_TARGET=15.0\ncargo build --release --lib --target aarch64-apple-ios\ncargo build --release --lib --target aarch64-apple-ios-sim\nTARGET_ROOT=\"${CARGO_TARGET_DIR:-target}\"\nmkdir -p generated/ios/headers\ncp generated/swift/mobile_catalogFFI.h generated/ios/headers/\ncp generated/swift/mobile_catalogFFI.modulemap generated/ios/headers/module.modulemap\nxcodebuild -create-xcframework \\\n  -library \"$TARGET_ROOT/aarch64-apple-ios/release/libmobile_catalog.a\" -headers generated/ios/headers \\\n  -library \"$TARGET_ROOT/aarch64-apple-ios-sim/release/libmobile_catalog.a\" -headers generated/ios/headers \\\n  -output generated/ios/MobileCatalog.xcframework\n```\n\nOutput xcframework phải chưa tồn tại; dùng thư mục phiên bản mới khi build lại. Simulator Intel cần slice x86_64-apple-ios riêng, không dùng slice ARM64 thay thế. Trong Xcode: thêm XCFramework vào Link Binary With Libraries, chọn Do Not Embed vì là static library, thêm generated/swift/mobile_catalog.swift vào target ứng dụng. Header và module.modulemap trong XCFramework cho Swift import module C. Đặt deployment target khớp 15.0 hoặc một mức hỗ trợ đã thống nhất. Giữ source Swift và binary cùng commit/generator.\n\nĐưa hàm verifyCatalogBridge từ consumers/swift/main.swift vào target XCTest, bỏ lời gọi top-level ở cuối. Gọi hàm bằng try trong test; chạy test trên simulator rồi device. Sau đó ghép service giữ object với ViewModel, chạy tác vụ tốn thời gian ngoài main actor và trả state về main actor. Khi Conflict, giữ bản nháp, tải snapshot mới và hỏi người dùng chọn phiên bản; không tự ghi đè. Kiểm tra app chuyển nền, huỷ view, đóng service, process chết và phục hồi dữ liệu ngoài RAM.\n\n## Android: thư viện theo ABI và runtime JNA\n\nCần Android SDK/NDK. Ví dụ dưới đây dành cho NDK trên macOS và ABI arm64-v8a, Android API 24. ANDROID_NDK_HOME trỏ tới NDK đã cài; thư mục prebuilt của NDK macOS có tên darwin-x86_64, Linux dùng linux-x86_64. Chọn minSdk và ABI theo thiết bị sản phẩm.\n\n```sh\nrustup target add aarch64-linux-android\nexport CARGO_TARGET_AARCH64_LINUX_ANDROID_LINKER=\"$ANDROID_NDK_HOME/toolchains/llvm/prebuilt/darwin-x86_64/bin/aarch64-linux-android24-clang\"\ncargo build --release --lib --target aarch64-linux-android\nTARGET_ROOT=\"${CARGO_TARGET_DIR:-target}\"\nmkdir -p android/app/src/main/jniLibs/arm64-v8a android/app/src/main/kotlin\ncp \"$TARGET_ROOT/aarch64-linux-android/release/libmobile_catalog.so\" android/app/src/main/jniLibs/arm64-v8a/\ncp -R generated/kotlin/uniffi android/app/src/main/kotlin/\n```\n\nandroid/app là module ứng dụng Android hiện có. Thêm vào build.gradle.kts của module, giữ phiên bản Android/Kotlin plugin của ứng dụng tương thích:\n\n```kotlin\nandroid {\n    defaultConfig {\n        minSdk = 24\n        ndk { abiFilters += \"arm64-v8a\" }\n    }\n    sourceSets.getByName(\"main\") {\n        java.srcDir(\"src/main/kotlin\")\n        jniLibs.srcDir(\"src/main/jniLibs\")\n    }\n}\ndependencies {\n    implementation(\"net.java.dev.jna:jna:5.19.1@aar\")\n}\n```\n\nJVM host dùng JAR; Android dùng AAR để đóng gói native dispatch của JNA. Runtime cần JNA từ 5.12.0 trở lên; dự án khóa bản 5.19.1, không dùng '+' hay version động. Kotlin hiện tại hỗ trợ UInt/ULong bình thường. API của lab đồng bộ nên không cần thêm coroutine chỉ để gọi binding. Khi thêm async API, bổ sung runtime coroutine và kiểm tra cancellation theo hợp đồng.\n\nThiết bị/emulator x86_64 cần build x86_64-linux-android bằng x86_64-linux-android24-clang, copy .so sang jniLibs/x86_64 và thêm ABI đó. Dylib macOS không chạy được trên Android. Thêm hàm verifyCatalogBridge từ Smoke.kt vào instrumented test, bỏ main, gọi hàm trên emulator và device. Không dùng unit test JVM trên desktop để tuyên bố đã kiểm chứng APK. Giữ object trong owner của ứng dụng, close khi owner hết vòng đời; không lưu native handle vào saved state. Việc cần qua process death phải có storage/outbox và WorkManager/BackgroundTasks ở adapter.\n\n## Bằng chứng bàn giao\n\nLưu toolchain, UniFFI, Kotlin/JNA, commit, target/ABI, hash binary, log hai host consumer và log simulator/device theo từng nền tảng. Với mỗi bản phát hành, test lại typed error, dữ liệu Unicode, stale revision, giải phóng handle và nâng cấp dữ liệu. RAM engine của lab cần thêm persistence/transport/auth theo nhu cầu ứng dụng; host smoke không thay kiểm thử lifecycle, packaging, hiệu năng hoặc power-loss trên thiết bị.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run --example host",
          "bash scripts/smoke-swift.sh",
          "bash scripts/smoke-kotlin.sh"
        ],
        "checks": [
          "Hai writer cùng base không âm thầm ghi đè.",
          "Tombstone ngăn update cũ hồi sinh record.",
          "Retry không tăng revision; reuse ID khác payload bị từ chối.",
          "Page cũ trả StaleSnapshot; limit có trần.",
          "Cả Swift và Kotlin consumer thực thi mutation/page, bắt Conflict/StaleSnapshot và xác nhận retry không tăng revision."
        ]
      }
    }
  ],
  "projects": [
    {
      "id": "mobile-project-expenses",
      "title": "Lõi chi tiêu cho hai giao diện",
      "description": "Xây bridge có state, revision và test concurrency; tích hợp cùng fixture vào Swift/Kotlin.",
      "level": "guided",
      "estimatedHours": 10,
      "labLessonId": "mobile-expense-project",
      "requirements": [
        "Số tiền dùng số nguyên và đơn vị được ghi rõ.",
        "Mutation kiểm tra revision, duplicate và overflow trước commit.",
        "Snapshot có total/danh sách cùng revision.",
        "Sinh binding cùng binary, chạy smoke test native trước khi công bố hỗ trợ target."
      ],
      "milestones": [
        {
          "title": "Miền",
          "tasks": [
            "Ghi hợp đồng ID, nhãn và đơn vị.",
            "Test lỗi không sửa trạng thái."
          ],
          "acceptance": "Total luôn bằng tổng các mục, revision chỉ tăng khi commit."
        },
        {
          "title": "Bridge",
          "tasks": [
            "Export Object/Record/Error.",
            "Sinh Swift và Kotlin từ cùng binary.",
            "Compile và chạy hai consumer host bằng script kèm theo, bắt Conflict rồi xác nhận snapshot không đổi."
          ],
          "acceptance": "Caller nhận lỗi có kiểu, không cần parse thông báo."
        },
        {
          "title": "Native",
          "tasks": [
            "Chạy fixture add/remove/conflict trên hai nền tảng.",
            "Kiểm tra cleanup wrapper và thread UI."
          ],
          "acceptance": "Báo cáo target nào đã chạy, target nào mới build."
        }
      ],
      "testCases": [
        {
          "name": "Overflow",
          "setup": "Tổng u64::MAX rồi thêm 1",
          "expected": "Không thêm mục hoặc tăng revision."
        },
        {
          "name": "Concurrent writer",
          "setup": "Hai add cùng expected=0",
          "expected": "Một thành công, một Conflict."
        },
        {
          "name": "Invalid label",
          "setup": "129 scalar hoặc chỉ khoảng trắng",
          "expected": "InvalidInput."
        },
        {
          "name": "Remove missing",
          "setup": "Xóa ID không tồn tại",
          "expected": "Missing; total không đổi."
        }
      ],
      "rubric": [
        {
          "id": "mobile-expenses-rubric-1",
          "title": "Invariant nghiệp vụ",
          "criteria": [
            "Không overflow hoặc cập nhật một phần.",
            "Đơn vị và ID được kiểm tra."
          ],
          "critical": true
        },
        {
          "id": "mobile-expenses-rubric-2",
          "title": "Hợp đồng FFI",
          "criteria": [
            "Object có owner/lock rõ.",
            "Binding và binary cùng phiên bản.",
            "Hai consumer Swift/Kotlin chạy được constructor, mutation, snapshot và typed error."
          ],
          "critical": true
        },
        {
          "id": "mobile-expenses-rubric-3",
          "title": "Trải nghiệm tích hợp",
          "criteria": [
            "Conflict giữ bản nháp và hướng xử lý.",
            "Việc nặng không chặn main thread."
          ],
          "critical": false
        },
        {
          "id": "mobile-expenses-rubric-4",
          "title": "Bằng chứng",
          "criteria": [
            "Host test và native smoke test được tách.",
            "Manifest artifact có target/version/hash."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Cargo crate và source binding được sinh.",
        "Fixture chung và kết quả trên từng nền tảng.",
        "Màn hình thêm/xóa/xem tổng với lỗi có nghĩa.",
        "Báo cáo lifecycle và phạm vi RAM-only."
      ]
    },
    {
      "id": "mobile-project-outbox",
      "title": "Ghi chú lưu trước, đồng bộ sau",
      "description": "Xây kho cục bộ cùng outbox bền, mô phỏng mất ACK và restart; thêm adapter thư mục native.",
      "level": "independent",
      "estimatedHours": 18,
      "labLessonId": "mobile-outbox-project",
      "requirements": [
        "Note và operation được lưu trong cùng snapshot/giao dịch.",
        "Operation ID ổn định, không tái sử dụng sau ACK.",
        "Không xóa pending trước ACK và commit trạng thái xóa.",
        "Dữ liệu hỏng giữ nguyên; có quy trình phục hồi và giới hạn file."
      ],
      "milestones": [
        {
          "title": "Persistence",
          "tasks": [
            "Validation sau deserialize.",
            "Ghi tệp tạm trước công bố."
          ],
          "acceptance": "Lỗi lưu không làm UI nhận success và không cập nhật RAM trước disk."
        },
        {
          "title": "Retry",
          "tasks": [
            "Fake server lưu ID→request/kết quả.",
            "Làm mất ACK rồi restart client."
          ],
          "acceptance": "Một tác động trên server và outbox tiếp tục cùng ID."
        },
        {
          "title": "Adapter",
          "tasks": [
            "Dùng app data directory và một owner Store.",
            "Hiện saved-local/pending/error."
          ],
          "acceptance": "Khởi động lại còn pending và có thể đồng bộ tiếp."
        }
      ],
      "testCases": [
        {
          "name": "ACK mất",
          "setup": "Server commit, client chưa ack",
          "expected": "Retry cùng ID không tạo note thứ hai."
        },
        {
          "name": "File hỏng",
          "setup": "state.json chứa byte không hợp lệ",
          "expected": "Data, giữ nguyên file."
        },
        {
          "name": "ACK sai",
          "setup": "ACK khác front",
          "expected": "Không thay đổi pending."
        },
        {
          "name": "Dữ liệu quá lớn",
          "setup": "Text vượt 1024 byte",
          "expected": "Từ chối trước commit."
        }
      ],
      "rubric": [
        {
          "id": "mobile-outbox-rubric-1",
          "title": "Tính nguyên tử",
          "criteria": [
            "Note/outbox cùng commit.",
            "Trạng thái RAM chỉ đổi sau lưu thành công."
          ],
          "critical": true
        },
        {
          "id": "mobile-outbox-rubric-2",
          "title": "Idempotency",
          "criteria": [
            "ID gắn request và kết quả.",
            "ACK sai hoặc mất không gây mất/trùng dữ liệu."
          ],
          "critical": true
        },
        {
          "id": "mobile-outbox-rubric-3",
          "title": "Khôi phục",
          "criteria": [
            "Restart và corrupt fixture tái hiện được.",
            "Giới hạn và quyền thư mục được kiểm chứng."
          ],
          "critical": false
        },
        {
          "id": "mobile-outbox-rubric-4",
          "title": "Sản phẩm",
          "criteria": [
            "UI phân biệt lưu cục bộ/đồng bộ.",
            "Có kế hoạch database khi vượt phạm vi một writer."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Kho cục bộ, fake server và bộ test lỗi.",
        "Adapter mobile cho thư mục/serialization.",
        "Kịch bản restart và lost ACK.",
        "Tài liệu định dạng, migration và phục hồi."
      ]
    },
    {
      "id": "mobile-project-catalog",
      "title": "Ứng dụng danh mục có nhiều thiết bị",
      "description": "Ghép engine UniFFI, outbox, persistence, transport và hai UI có xử lý conflict; đo và bàn giao từng target.",
      "level": "capstone",
      "estimatedHours": 32,
      "labLessonId": "mobile-catalog-project",
      "requirements": [
        "Mutation có operation ID, base revision và lỗi conflict.",
        "Tombstone giữ việc xóa; stale page không trộn snapshot.",
        "Idempotency từ chối cùng ID khác nội dung.",
        "Hoàn thiện persistence/server/transport và native UI từ core được cung cấp, ghi rõ phần đã triển khai."
      ],
      "milestones": [
        {
          "title": "Engine",
          "tasks": [
            "Test retry, reuse-ID, hai writer và tombstone.",
            "Phân trang gắn catalog revision."
          ],
          "acceptance": "Không âm thầm mất thay đổi hoặc hồi sinh bản cũ."
        },
        {
          "title": "Ứng dụng",
          "tasks": [
            "Ghép outbox và adapter lưu bền.",
            "Tạo UI so local/remote rồi sinh thao tác mới."
          ],
          "acceptance": "Draft còn sau conflict/restart; người dùng quyết định rõ."
        },
        {
          "title": "Nghiệm thu",
          "tasks": [
            "Chạy consumer Swift/Kotlin host với Conflict, retry và StaleSnapshot trước khi ghép mobile UI.",
            "Chạy fixture qua Swift/Kotlin đúng ABI.",
            "Đo startup, page latency, heap và background expiration."
          ],
          "acceptance": "Có manifest, log khử nội dung và bảng giới hạn chưa kiểm chứng."
        }
      ],
      "testCases": [
        {
          "name": "Hai bản offline",
          "setup": "A/B cùng base 1",
          "expected": "B nhận Conflict sau A commit."
        },
        {
          "name": "Retry",
          "setup": "ID và payload trùng",
          "expected": "Trả kết quả cũ, không tăng revision."
        },
        {
          "name": "Tombstone",
          "setup": "Delete rồi update base cũ",
          "expected": "Conflict, mục không hồi sinh."
        },
        {
          "name": "Page đến muộn",
          "setup": "Write giữa hai page",
          "expected": "StaleSnapshot, caller tải lại."
        }
      ],
      "rubric": [
        {
          "id": "mobile-catalog-rubric-1",
          "title": "Đúng dữ liệu",
          "criteria": [
            "Revision/tombstone/idempotency được lưu cùng transaction khi tích hợp.",
            "Conflict không tự bỏ bản nháp."
          ],
          "critical": true
        },
        {
          "id": "mobile-catalog-rubric-2",
          "title": "Đúng lifecycle",
          "criteria": [
            "Pending sống qua process death.",
            "Generation/cancel không cập nhật màn hình đã đóng."
          ],
          "critical": true
        },
        {
          "id": "mobile-catalog-rubric-3",
          "title": "Hiệu năng",
          "criteria": [
            "Có trần dữ liệu và page.",
            "Đo cả native/FFI/core/render theo thiết bị."
          ],
          "critical": false
        },
        {
          "id": "mobile-catalog-rubric-4",
          "title": "Bàn giao",
          "criteria": [
            "Target/ABI/binding cùng bộ có hash.",
            "Test host/native/server và phần còn thiếu được ghi riêng.",
            "Log consumer có kết quả bridge thật, không chỉ log sinh source."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Workspace core, bridge, persistence và transport.",
        "Hai UI native cùng fixture nghiệp vụ.",
        "Báo cáo concurrency/offline/lifecycle và số đo.",
        "Bộ artifact, migration và hướng dẫn phục hồi."
      ]
    }
  ],
  "assessment": {
    "title": "Đánh giá năng lực Rust dùng chung cho mobile",
    "instructions": "Trả lời tình huống, hoàn thiện các dự án và ghi bằng chứng host/native/server riêng. Tự nghiệm thu cả dữ liệu, lifecycle và đóng gói; điểm trắc nghiệm không thay thế chạy ứng dụng trên target.",
    "passPercent": 80,
    "questions": [
      {
        "id": "mobile-exam-01",
        "question": "Một khoản tiền được nhập '25,000' theo locale. Core chỉ nhận chữ số ASCII. Thiết kế đúng là gì?",
        "options": [
          "Cho mỗi nền tảng làm tròn float tùy ý.",
          "UI parse theo locale rồi gửi biểu diễn có đơn vị; core kiểm tra lại.",
          "Core tự đoán mọi dấu phân cách."
        ],
        "correct": 1,
        "explanation": "Lớp nhập liệu và hợp đồng nghiệp vụ khác nhau; đơn vị và quy tắc phải rõ.",
        "lessonIds": [
          "mobile-domain-values"
        ]
      },
      {
        "id": "mobile-exam-02",
        "question": "UI đọc total rồi items bằng hai lời gọi khi writer đang chạy. Cách tránh ghép hai trạng thái?",
        "options": [
          "Bỏ mutex.",
          "Gọi nhanh hơn.",
          "Trả Snapshot có revision trong một vùng quan sát."
        ],
        "correct": 2,
        "explanation": "Các trường cần cùng thời điểm quan sát để giữ invariant.",
        "lessonIds": [
          "mobile-boundary-design"
        ]
      },
      {
        "id": "mobile-exam-03",
        "question": "Callback native gọi ngược snapshot trong khi Rust đang giữ mutex và gọi callback. Nguy cơ chính?",
        "options": [
          "Chỉ tốn một bản copy.",
          "Không có vì Arc an toàn.",
          "Deadlock do lời gọi ngược cần cùng lock."
        ],
        "correct": 2,
        "explanation": "Thả guard trước khi gọi mã bên ngoài, không dựa vào ngôn ngữ callback để tránh khóa vòng.",
        "lessonIds": [
          "mobile-object-lifetime"
        ]
      },
      {
        "id": "mobile-exam-04",
        "question": "Hai màn hình gửi add với cùng expected_revision. Kết quả nào phù hợp optimistic concurrency?",
        "options": [
          "Cả hai thành công dù trùng base.",
          "Một commit, lời gọi còn lại Conflict và không sửa dữ liệu.",
          "Xóa cả hai request."
        ],
        "correct": 1,
        "explanation": "Kiểm tra và commit phải ở cùng vùng khóa để chỉ một writer thắng base đó.",
        "lessonIds": [
          "mobile-expense-project"
        ]
      },
      {
        "id": "mobile-exam-05",
        "question": "Có dylib macOS ARM64 và ứng dụng iOS ARM64. Có thể dùng trực tiếp cùng binary?",
        "options": [
          "Không; cần artifact iOS đúng target/SDK.",
          "Có nếu đổi extension.",
          "Có, cùng CPU."
        ],
        "correct": 0,
        "explanation": "Môi trường và liên kết là một phần target, không chỉ architecture.",
        "lessonIds": [
          "mobile-artifact-matrix"
        ]
      },
      {
        "id": "mobile-exam-06",
        "question": "Rust test xanh nhưng app Android báo không load được native library. Nên kiểm tra gì?",
        "options": [
          "Chỉ parser nghiệp vụ.",
          "ABI, tên .so và packaging/binding trong app.",
          "Chỉ thêm assert vào tổng tiền."
        ],
        "correct": 1,
        "explanation": "Đây là lỗi tích hợp artifact, không được chứng minh bởi unit test core.",
        "lessonIds": [
          "mobile-contract-tests"
        ]
      },
      {
        "id": "mobile-exam-07",
        "question": "Người dùng gõ A rồi B; A trả sau B dù đã yêu cầu hủy. UI nên dùng gì để loại A?",
        "options": [
          "Generation hiện hành cùng lifecycle gate.",
          "So thời gian trên đồng hồ hệ thống.",
          "Chỉ xem kết quả nào dài hơn."
        ],
        "correct": 0,
        "explanation": "Kết quả đã gửi có thể vượt qua cancellation; generation xác định thao tác hiện hành.",
        "lessonIds": [
          "mobile-cancellation-protocol"
        ]
      },
      {
        "id": "mobile-exam-08",
        "question": "Ứng dụng có một thread Rust chờ sync. Khi process bị OS kết thúc, việc chờ còn không?",
        "options": [
          "Còn vì Rust native.",
          "Còn nếu thread dùng Arc.",
          "Không; cần outbox bền và scheduler nền tảng."
        ],
        "correct": 2,
        "explanation": "Lifetime process khác lifetime dữ liệu; scheduling không thay persistence.",
        "lessonIds": [
          "mobile-background-sync"
        ]
      },
      {
        "id": "mobile-exam-09",
        "question": "Server commit rồi mất ACK. Sau restart client nên tái tạo operation ID mới không?",
        "options": [
          "Có để tránh trùng.",
          "Không; giữ ID/request cũ để retry idempotent.",
          "Không cần gửi lại hoặc kiểm tra."
        ],
        "correct": 1,
        "explanation": "Timeout không chứng minh server chưa commit; ID ổn định cho phép tìm kết quả đã xử lý.",
        "lessonIds": [
          "mobile-outbox-project"
        ]
      },
      {
        "id": "mobile-exam-10",
        "question": "Một thiết bị offline gửi bản cũ sau khi thiết bị khác xóa mục. Cần cơ chế nào?",
        "options": [
          "Chỉ xóa hàng khỏi UI.",
          "Dùng timestamp client lớn nhất luôn thắng.",
          "Tombstone/revision và chính sách giữ lịch sử."
        ],
        "correct": 2,
        "explanation": "Dấu vết xóa giúp ngăn dữ liệu cũ hồi sinh ngoài ý muốn.",
        "lessonIds": [
          "mobile-conflict-resolution"
        ]
      },
      {
        "id": "mobile-exam-11",
        "question": "P50 tốt nhưng người dùng vẫn gặp vài lần đứng lâu. Báo cáo nên bổ sung gì?",
        "options": [
          "P95/max và giai đoạn dispatch/FFI/render trong cùng điều kiện.",
          "Số dòng Rust.",
          "Chỉ số trung bình."
        ],
        "correct": 0,
        "explanation": "Phân phối và mốc hành trình cho biết độ trễ đuôi, không bị trung bình che mất.",
        "lessonIds": [
          "mobile-observability"
        ]
      },
      {
        "id": "mobile-exam-12",
        "question": "Cùng operation ID nhưng payload đổi từ A sang B. Có thể trả success của A như kết quả B không?",
        "options": [
          "Không; trả lỗi tái sử dụng ID khác nội dung.",
          "Có vì ID đã tồn tại.",
          "Có nếu revision mới hơn."
        ],
        "correct": 0,
        "explanation": "Idempotency phải gắn request với kết quả; trả nhầm success làm caller hiểu sai dữ liệu.",
        "lessonIds": [
          "mobile-catalog-project"
        ]
      }
    ],
    "skills": [
      {
        "id": "mobile-skill-1",
        "title": "Miền nghiệp vụ dùng chung",
        "description": "Quy định đơn vị, định danh và lỗi có kiểu. Thiết kế snapshot/batch có revision và giới hạn.",
        "lessonIds": [
          "mobile-core-boundary",
          "mobile-domain-values",
          "mobile-boundary-design"
        ],
        "projectIds": [
          "mobile-project-expenses"
        ],
        "required": true
      },
      {
        "id": "mobile-skill-2",
        "title": "Object và bridge UniFFI",
        "description": "Quản lý owner/lock và cleanup. Xuất Object, Record, Error từ một crate thực tế.",
        "lessonIds": [
          "mobile-uniffi-contract",
          "mobile-object-lifetime",
          "mobile-expense-project"
        ],
        "projectIds": [
          "mobile-project-expenses"
        ],
        "required": true
      },
      {
        "id": "mobile-skill-3",
        "title": "Target và kiểm thử xuyên ngôn ngữ",
        "description": "Tách device/simulator/ABI và nguồn gốc artifact. Chạy fixture qua Rust, Swift và Kotlin.",
        "lessonIds": [
          "mobile-targets-bindings",
          "mobile-artifact-matrix",
          "mobile-contract-tests"
        ],
        "projectIds": [
          "mobile-project-expenses"
        ],
        "required": true
      },
      {
        "id": "mobile-skill-4",
        "title": "Vòng đời và công việc nền",
        "description": "Kết hợp cancellation với generation. Checkpoint batch theo thời hạn nền tảng.",
        "lessonIds": [
          "mobile-lifecycle-async",
          "mobile-cancellation-protocol",
          "mobile-background-sync"
        ],
        "projectIds": [
          "mobile-project-outbox"
        ],
        "required": true
      },
      {
        "id": "mobile-skill-5",
        "title": "Ngoại tuyến và xung đột",
        "description": "Không mất pending khi crash hoặc ACK mất. Dùng revision/tombstone thay cho ghi đè âm thầm.",
        "lessonIds": [
          "mobile-storage-adapters",
          "mobile-outbox-project",
          "mobile-conflict-resolution"
        ],
        "projectIds": [
          "mobile-project-outbox"
        ],
        "required": true
      },
      {
        "id": "mobile-skill-6",
        "title": "Hiệu năng và sản phẩm dùng chung",
        "description": "Đo hành trình FFI và bộ nhớ. Hoàn thiện catalog có conflict, persistence và adapter.",
        "lessonIds": [
          "mobile-release-performance",
          "mobile-observability",
          "mobile-catalog-project"
        ],
        "projectIds": [
          "mobile-project-catalog"
        ],
        "required": true
      }
    ]
  }
};
