import type { SpecializationBundle } from "../specialization-types";

export const wasmBundle: SpecializationBundle = {
  "track": {
    "id": "wasm",
    "title": "WebAssembly cho ứng dụng web",
    "shortTitle": "WebAssembly",
    "description": "Đưa lõi xử lý Rust vào web với wasm-bindgen, quản lý dữ liệu qua JavaScript và giữ giao diện phản hồi bằng Worker.",
    "outcome": "Xây công cụ phân tích tệp ngay trong trình duyệt, có API Rust–JavaScript rõ ràng, xử lý theo lô, kiểm thử và quy trình phát hành module nhất quán.",
    "prerequisites": [
      "Ownership, slice và lifetime",
      "Result, enum, trait và kiểm thử Rust",
      "JavaScript/TypeScript, ES module và Promise",
      "DOM, HTTP và khái niệm event loop"
    ],
    "technologies": [
      "WebAssembly",
      "wasm-bindgen",
      "wasm-pack",
      "Web Workers",
      "JavaScript/TypeScript"
    ],
    "color": "purple",
    "lessonIds": [
      "wasm-runtime",
      "wasm-bindings",
      "wasm-memory",
      "wasm-workers",
      "wasm-performance",
      "wasm-release"
    ],
    "capstone": {
      "title": "Bộ phân tích tệp chạy trong trình duyệt",
      "description": "Người dùng chọn tệp mẫu, xem thống kê byte và phân bố giá trị mà giao diện vẫn phản hồi. Rust giữ lõi tính toán, Worker quản lý công việc và giao diện quản lý nhập liệu, hủy, lỗi và kết quả.",
      "milestones": [
        {
          "title": "Hợp đồng và lõi xử lý",
          "tasks": [
            "Định nghĩa kích thước tệp tối đa, dữ liệu rỗng và ý nghĩa từng trường kết quả.",
            "Tách lõi histogram cùng thống kê tổng byte khỏi API trình duyệt; viết test cho các dữ liệu biên."
          ],
          "acceptance": "Kết quả khớp một bản tham chiếu độc lập, tổng các bin bằng số byte và mọi lỗi đầu vào có mã xác định."
        },
        {
          "title": "Binding và bộ nhớ",
          "tasks": [
            "Tạo package --target web hoặc target bundler đã chọn; công bố kiểu TypeScript cho API.",
            "Vẽ đường đi dữ liệu và đánh dấu từng lần copy, transfer hoặc mượn; xác định ai giải phóng từng buffer."
          ],
          "acceptance": "Test browser kiểm tra binding với dữ liệu rỗng và lớn; không giữ view sau thao tác làm mất hiệu lực; không đưa bí mật vào module."
        },
        {
          "title": "Worker, tiến độ và hủy",
          "tasks": [
            "Khởi tạo Wasm trong Worker, dùng request ID và giới hạn công việc chờ.",
            "Chia xử lý thành lô, gửi tiến độ có giới hạn nhịp; thiết kế cả hủy thực thi và từ chối kết quả lỗi thời."
          ],
          "acceptance": "Giao diện vẫn nhận thao tác trong khi xử lý; job bị hủy hoặc cũ không ghi đè kết quả mới; hàng đợi và bộ nhớ không tăng vô hạn."
        },
        {
          "title": "Đo và tối ưu có bằng chứng",
          "tasks": [
            "Đo riêng lần tải đầu, các lần xử lý đã khởi tạo, chuyển dữ liệu và render trên hai kích thước tệp.",
            "So sánh với thuật toán JavaScript tương đương; thử nhiều kích thước lô và ghi cấu hình trình duyệt/thiết bị."
          ],
          "acceptance": "Báo cáo có số đo, kiểm tra kết quả và giải thích tradeoff; không kết luận hiệu năng chỉ từ thời gian vòng lặp Rust."
        },
        {
          "title": "Phát hành và trải nghiệm",
          "tasks": [
            "Đóng gói artifact có phiên bản/hash, cấu hình MIME và cache, kiểm thử nâng phiên bản cùng rollback.",
            "Thêm label, điều hướng bàn phím, tiến độ, thông báo lỗi và bảng kết quả bên cạnh biểu đồ.",
            "Kiểm thử mất mạng khi nạp, module lỗi, Worker lỗi và người dùng đổi tệp giữa chừng."
          ],
          "acceptance": "Người khác chạy được theo README; lỗi không xóa đầu vào hoặc tạo trạng thái kẹt; release cũ và mới không bị trộn artifact."
        }
      ],
      "deliverables": [
        "Cargo crate lõi, adapter Wasm, Cargo.lock và mã Worker",
        "Kiểu TypeScript cùng hợp đồng đầu vào, đầu ra và lỗi",
        "Unit test host, wasm-bindgen-test và kịch bản kiểm thử giao diện",
        "Sơ đồ sở hữu bộ nhớ và báo cáo hiệu năng có điều kiện đo",
        "Artifact phiên bản hóa cùng README build, deploy và rollback"
      ],
      "reviewQuestions": [
        "Vì sao chuyển ArrayBuffer sang Worker chưa chứng minh đầu vào Wasm là zero-copy?",
        "Khi nào view hết hiệu lực dù memory.buffer không đổi?",
        "Bỏ kết quả cũ khác gì việc ngừng tiêu thụ CPU của job?",
        "Bạn sẽ đo phần nào nếu thuật toán nhanh nhưng thao tác giao diện chậm?",
        "Làm sao một tab đang mở tiếp tục dùng release cũ sau khi hệ thống xuất bản release mới?"
      ]
    },
    "resources": [
      {
        "label": "wasm-bindgen: hướng dẫn",
        "url": "https://wasm-bindgen.github.io/wasm-bindgen/"
      },
      {
        "label": "wasm-pack: build",
        "url": "https://wasm-bindgen.github.io/wasm-pack/book/commands/build.html"
      },
      {
        "label": "wasm-bindgen: các kiểu dữ liệu",
        "url": "https://wasm-bindgen.github.io/wasm-bindgen/reference/types.html"
      },
      {
        "label": "wasm-bindgen-test: browser",
        "url": "https://wasm-bindgen.github.io/wasm-bindgen/wasm-bindgen-test/browsers.html"
      },
      {
        "label": "MDN: Web Workers",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers"
      },
      {
        "label": "MDN: chuyển quyền sở hữu buffer",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects"
      },
      {
        "label": "MDN: bộ nhớ shared và isolation",
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer"
      }
    ]
  },
  "lessons": [
    {
      "id": "wasm-runtime",
      "moduleId": "track-wasm",
      "title": "WebAssembly: module, bộ nhớ và môi trường chạy",
      "description": "Chọn đúng phần việc cho Wasm và hiểu ranh giới giữa mã Rust, module nhị phân và JavaScript.",
      "duration": 45,
      "objectives": [
        "Phân biệt target của rustc với target của wasm-bindgen",
        "Giải thích linear memory, offset và host imports",
        "Tách lõi tính toán khỏi DOM, mạng và hệ thống tệp",
        "Kiểm tra phạm vi byte mà không làm tràn số"
      ],
      "sections": [
        {
          "title": "Wasm là phần xử lý trong một ứng dụng",
          "text": "Một ứng dụng web có giao diện, quản lý trạng thái, truy cập dữ liệu và phần tính toán. Rust biên dịch thành WebAssembly phù hợp khi bạn muốn tái sử dụng một lõi xử lý, kiểm soát cấp phát hoặc chạy thuật toán trên dữ liệu lớn. Đừng bắt đầu bằng việc thay mọi dòng JavaScript: hãy chọn một ranh giới có đầu vào và đầu ra rõ ràng, chẳng hạn thống kê byte của tệp.\n\nModule .wasm chứa mã và mô tả imports, exports, bộ nhớ cùng các thành phần khác. Môi trường chạy kiểm tra module rồi tạo instance. Module không tự có quyền thao tác DOM; những khả năng cần môi trường phải đi qua hàm được cung cấp. Dữ liệu tải xuống trình duyệt vẫn có thể bị người dùng kiểm tra, nên Wasm không phải chỗ giấu khóa bí mật."
        },
        {
          "title": "Hai loại target trả lời hai câu hỏi",
          "text": "wasm32-unknown-unknown là target biên dịch của Rust, mô tả nền tảng đầu ra. Nó hỗ trợ core và alloc, nhưng nhiều chức năng std cần hệ điều hành không hoạt động như trên máy tính. Không mang nguyên đoạn std::fs hoặc std::thread::spawn vào trình duyệt rồi mong nó đọc tệp hay tạo thread. Chọn API web hoặc truyền dữ liệu từ JavaScript vào lõi Rust.\n\nTrong khi đó, --target web của wasm-pack hoặc wasm-bindgen chọn kiểu mã kết nối JavaScript được sinh. Nó không đổi Wasm thành một kiến trúc CPU khác. Đầu ra bundler, web và nodejs có cách nạp khác nhau. Với lab không dùng bundler, chọn web và chờ hàm init hoàn tất trước khi gọi export.",
          "code": "rustup target add wasm32-unknown-unknown\n# Chạy trong crate có wasm-bindgen và crate-type cdylib.\nwasm-pack build --target web --dev"
        },
        {
          "title": "Bộ nhớ là dãy byte có ranh giới",
          "text": "Ở mô hình wasm32 của bài học, một offset là vị trí trong linear memory, không phải địa chỉ tùy ý của hệ điều hành. Một vùng dữ liệu thường được mô tả bằng offset và độ dài. Bước đầu tiên khi đọc vùng này là kiểm tra điểm cuối không vượt kích thước bộ nhớ; phép cộng cũng phải được tính bằng kiểu đủ rộng hoặc dùng checked_add.\n\nKiểm tra phạm vi số chỉ chứng minh các byte nằm trong memory. Nó chưa chứng minh vùng ấy còn thuộc một allocation hợp lệ, có đúng alignment hoặc có thể tạo tham chiếu Rust. Vì vậy bài tập chỉ tính khoảng số, không dereference con trỏ. Khi thiết kế API đầu tiên, chọn slice hoặc giá trị do binding quản lý thay vì tự tạo giao thức con trỏ."
        },
        {
          "title": "Thiết kế lõi có thể kiểm thử ở hai nơi",
          "text": "Đặt thuật toán vào hàm nhận slice, trả Result và không chạm DOM. Cùng hàm đó chạy được trong test native để tìm lỗi nhanh; một lớp mỏng mới chuyển kiểu và lỗi qua biên Wasm. Sau đó kiểm thử thêm trên browser để phát hiện lỗi nạp module, chuyển kiểu hoặc môi trường mà test host không thấy.\n\nHãy viết trước giới hạn đầu vào, cách xử lý dữ liệu rỗng và kiểu biểu diễn kết quả. Với tệp lớn, cân nhắc làm theo lô để giảm bộ nhớ và giữ giao diện phản hồi. Những quyết định này vẫn cần thiết dù thuật toán chạy bằng Rust hay JavaScript. Bài tập bên dưới rèn một hợp đồng nhỏ nhưng xuất hiện thường xuyên ở mọi giao tiếp qua bộ nhớ."
        }
      ],
      "tip": "Một offset nằm trong linear memory chưa đủ để chứng minh một tham chiếu Rust hợp lệ.",
      "exercise": {
        "title": "Kiểm tra khoảng byte trong memory32",
        "instructions": "Hoàn thiện byte_range. Hàm chỉ kiểm tra số học cho mô hình memory32 và trả khoảng nửa mở [start, end).",
        "requirements": [
          "Tính điểm cuối bằng u64 để không tràn u32.",
          "Từ chối nếu memory_len lớn hơn 2^32 hoặc điểm cuối vượt memory_len.",
          "Cho phép khoảng rỗng tại vị trí hợp lệ; không đọc hay tạo tham chiếu từ con trỏ."
        ]
      },
      "starterCode": "fn byte_range(ptr: u32, len: u32, memory_len: u64) -> Option<(u64, u64)> {\n    todo!()\n}\nfn main() {\n    assert_eq!(byte_range(4, 3, 10), Some((4, 7)));\n    assert_eq!(byte_range(9, 2, 10), None);\n    assert_eq!(byte_range(10, 0, 10), Some((10, 10)));\n    assert_eq!(byte_range(11, 0, 10), None);\n    assert_eq!(byte_range(u32::MAX, 1, 1_u64 << 32), Some((u32::MAX as u64, 1_u64 << 32)));\n    assert_eq!(byte_range(u32::MAX, 2, 1_u64 << 32), None);\n    assert_eq!(byte_range(0, 1, (1_u64 << 32) + 1), None);\n    println!(\"Khoảng hợp lệ: {:?}\", byte_range(4, 3, 10).unwrap());\n}",
      "solutionCode": "fn byte_range(ptr: u32, len: u32, memory_len: u64) -> Option<(u64, u64)> {\n    if memory_len > (1_u64 << 32) { return None; }\n    let start = u64::from(ptr);\n    let end = start + u64::from(len);\n    (end <= memory_len).then_some((start, end))\n}\nfn main() {\n    assert_eq!(byte_range(4, 3, 10), Some((4, 7)));\n    assert_eq!(byte_range(9, 2, 10), None);\n    assert_eq!(byte_range(10, 0, 10), Some((10, 10)));\n    assert_eq!(byte_range(11, 0, 10), None);\n    assert_eq!(byte_range(u32::MAX, 1, 1_u64 << 32), Some((u32::MAX as u64, 1_u64 << 32)));\n    assert_eq!(byte_range(u32::MAX, 2, 1_u64 << 32), None);\n    assert_eq!(byte_range(0, 1, (1_u64 << 32) + 1), None);\n    println!(\"Khoảng hợp lệ: {:?}\", byte_range(4, 3, 10).unwrap());\n}",
      "expectedOutput": "Khoảng hợp lệ: (4, 7)",
      "hints": [
        "Chuyển cả ptr và len sang u64 trước khi cộng.",
        "Khoảng rỗng vẫn cần start không lớn hơn memory_len."
      ],
      "quiz": {
        "question": "wasm32-unknown-unknown và --target web trong wasm-pack khác nhau thế nào?",
        "options": [
          "Cả hai đều chọn trình duyệt Chrome.",
          "Target đầu chọn nền tảng biên dịch Rust; target sau chọn dạng binding JavaScript.",
          "--target web bật std::fs trong trình duyệt.",
          "wasm32-unknown-unknown tự cung cấp DOM cho Rust."
        ],
        "correct": 1,
        "explanation": "Một lựa chọn thuộc rustc và nền tảng Wasm; lựa chọn còn lại thuộc công cụ sinh glue code và cách nạp module. Các API của môi trường vẫn cần adapter riêng."
      },
      "reference": {
        "label": "rustc: wasm32-unknown-unknown",
        "url": "https://doc.rust-lang.org/rustc/platform-support/wasm32-unknown-unknown.html"
      }
    },
    {
      "id": "wasm-bindings",
      "moduleId": "track-wasm",
      "title": "Hợp đồng Rust–JavaScript với wasm-bindgen",
      "description": "Chuyển kiểu, xác thực đầu vào và báo lỗi qua JavaScript bằng một API nhỏ có kiểm thử.",
      "duration": 60,
      "objectives": [
        "Thiết kế export với kiểu và lỗi rõ ràng",
        "Nhận ra chuyển kiểu số không thay thế validation",
        "Phân biệt Result ở Rust với exception hoặc Promise rejection ở JavaScript",
        "Tạo package web và kiểm thử bằng wasm-bindgen-test"
      ],
      "sections": [
        {
          "title": "Binding là một phần của hợp đồng",
          "text": "wasm-bindgen sinh mã kết nối để JavaScript sử dụng chuỗi, slice và nhiều kiểu ở mức cao hơn ABI Wasm thô. Thuộc tính #[wasm_bindgen] đánh dấu các hàm cần xuất hoặc nhập. Tệp JavaScript và khai báo TypeScript được sinh đi kèm module; giữ chúng cùng một bản build vì chúng cùng mô tả cách truyền dữ liệu.\n\nĐừng xem khai báo TypeScript như validation khi chạy. Người dùng có thể gọi hàm từ JavaScript không có kiểm tra kiểu, từ console hoặc từ dữ liệu JSON. Với đầu vào có quy tắc nghiệp vụ, giữ một hàm kiểm tra rõ ràng ở phía Rust. Tên tham số, đơn vị đo và giới hạn nên được mô tả trong tài liệu API để frontend không phải đoán."
        },
        {
          "title": "Giữ thông tin trước khi chuyển số",
          "text": "Một số JavaScript Number là giá trị dấu phẩy động. Nếu export nhận u32 trực tiếp, binding có thể chuyển đổi đầu vào theo quy tắc số nguyên trước khi mã Rust của bạn kiểm tra. Khi ấy phần thập phân hoặc thông tin ngoài miền có thể đã mất. Với API yêu cầu số nguyên chính xác trong miền u32, nhận f64, kiểm tra is_finite, phần thập phân và khoảng giá trị trước khi ép kiểu.\n\nCác kiểu số nguyên lớn như u64 đi qua binding bằng BigInt trong API thông thường; chúng không tự tương đương JSON number. Nếu DTO dùng chuỗi để biểu diễn ID lớn, phải phân tích và kiểm tra chuỗi đó. Hợp đồng nên thống nhất một biểu diễn thay vì để mỗi lớp tự chuyển theo cách thuận tiện.",
          "code": "fn validate_limit(value: f64) -> Result<u32, &'static str> {\n    if !value.is_finite() { return Err(\"not_finite\"); }\n    if value.fract() != 0.0 { return Err(\"fraction\"); }\n    if !(0.0..=u32::MAX as f64).contains(&value) { return Err(\"range\"); }\n    Ok(value as u32)\n}"
        },
        {
          "title": "Lỗi nghiệp vụ không phải panic",
          "text": "Một export đồng bộ trả Result<T, JsValue> chuyển Ok thành giá trị và Err thành exception phía JavaScript. Giao diện cần try/catch và phản hồi dễ hiểu. Export async trả Promise; lỗi được chuyển thành rejection nên client cần await hoặc catch. Panic biểu thị lỗi chương trình và có hành vi khác với một yêu cầu bị từ chối hợp lệ.\n\nVới DTO có cấu trúc, serde-wasm-bindgen hỗ trợ chuyển JsValue vào kiểu có Deserialize rồi chuyển kết quả trở lại. Deserialize kiểm tra biểu diễn kiểu, còn quy tắc như độ dài tên hay giá trị dương vẫn thuộc validation. Đừng unwrap dữ liệu đến từ JavaScript. Bạn cũng cần quyết định cách biểu diễn Option, map và số lớn để hai bên hiểu cùng một schema."
        },
        {
          "title": "Kiểm thử cả adapter và phần lõi",
          "text": "Lab chuẩn hóa nhãn tách trim_label và validate_limit khỏi phần chuyển lỗi sang JsValue. cargo test chạy các hàm lõi trên host; wasm-bindgen-test kiểm tra export khi có môi trường JavaScript thật. Bộ kiểm thử đó không thay thế kiểm thử giao diện, nhưng giúp phát hiện khác biệt ở binding trước khi người học gặp lỗi trên trang.\n\nLab cố định wasm-bindgen 0.2.129 cùng wasm-bindgen-test 0.3.79, là cặp dependency tương thích đã đối chiếu. Khi nâng phiên bản, nâng và kiểm tra cả bộ công cụ liên quan; lưu Cargo.lock của dự án ứng dụng. Build --target web tạo package để trang mẫu nạp trực tiếp qua HTTP. Bài tập trên web tập trung vào hàm validation, còn lab Cargo thực hiện cầu nối thực tế."
        }
      ],
      "tip": "Nếu cần từ chối số thập phân hoặc ngoài miền, hãy kiểm tra trước khi chuyển đầu vào thành số nguyên.",
      "exercise": {
        "title": "Xác thực số từ JavaScript",
        "instructions": "Viết validate_limit với thứ tự kiểm tra xác định. -0.0 được coi là 0; các số nguyên từ 0 đến u32::MAX được chấp nhận.",
        "requirements": [
          "NaN hoặc vô cực trả not_finite.",
          "Số có phần thập phân trả fraction.",
          "Số nguyên ngoài miền u32 trả range; chỉ ép kiểu sau khi kiểm tra."
        ]
      },
      "starterCode": "fn validate_limit(value: f64) -> Result<u32, &'static str> {\n    todo!()\n}\nfn main() {\n    assert_eq!(validate_limit(42.0), Ok(42));\n    assert_eq!(validate_limit(-0.0), Ok(0));\n    assert_eq!(validate_limit(2.5), Err(\"fraction\"));\n    assert_eq!(validate_limit(-1.0), Err(\"range\"));\n    assert_eq!(validate_limit(f64::NAN), Err(\"not_finite\"));\n    assert_eq!(validate_limit(f64::INFINITY), Err(\"not_finite\"));\n    assert_eq!(validate_limit(u32::MAX as f64), Ok(u32::MAX));\n    assert_eq!(validate_limit(u32::MAX as f64 + 1.0), Err(\"range\"));\n    println!(\"Giới hạn: {}\", validate_limit(42.0).unwrap());\n}",
      "solutionCode": "fn validate_limit(value: f64) -> Result<u32, &'static str> {\n    if !value.is_finite() { return Err(\"not_finite\"); }\n    if value.fract() != 0.0 { return Err(\"fraction\"); }\n    if !(0.0..=u32::MAX as f64).contains(&value) { return Err(\"range\"); }\n    Ok(value as u32)\n}\nfn main() {\n    assert_eq!(validate_limit(42.0), Ok(42));\n    assert_eq!(validate_limit(-0.0), Ok(0));\n    assert_eq!(validate_limit(2.5), Err(\"fraction\"));\n    assert_eq!(validate_limit(-1.0), Err(\"range\"));\n    assert_eq!(validate_limit(f64::NAN), Err(\"not_finite\"));\n    assert_eq!(validate_limit(f64::INFINITY), Err(\"not_finite\"));\n    assert_eq!(validate_limit(u32::MAX as f64), Ok(u32::MAX));\n    assert_eq!(validate_limit(u32::MAX as f64 + 1.0), Err(\"range\"));\n    println!(\"Giới hạn: {}\", validate_limit(42.0).unwrap());\n}",
      "expectedOutput": "Giới hạn: 42",
      "hints": [
        "NaN không tuân theo các so sánh thứ tự thông thường, nên kiểm tra is_finite trước.",
        "Mọi giá trị u32 đều biểu diễn chính xác bằng f64."
      ],
      "quiz": {
        "question": "Một export đồng bộ trả Err(JsValue). JavaScript nhận được gì theo binding Result?",
        "options": [
          "Một đối tượng Rust Result có trường Err.",
          "Luôn là undefined.",
          "Một exception mà caller cần xử lý bằng try/catch.",
          "Một tiến trình Rust mới."
        ],
        "correct": 2,
        "explanation": "wasm-bindgen chuyển Ok thành giá trị thông thường và Err thành exception ở export đồng bộ. Đối với export async, lỗi đi qua Promise rejection."
      },
      "reference": {
        "label": "wasm-bindgen: Result qua biên JavaScript",
        "url": "https://wasm-bindgen.github.io/wasm-bindgen/reference/types/result.html"
      },
      "localLab": {
        "title": "Module chuẩn hóa nhãn dùng trực tiếp trên web",
        "instructions": "Tạo một thư mục mới chứa các tệp dưới đây. Cần Rust, target wasm32-unknown-unknown, wasm-pack và Chrome cho kiểm thử browser; server mẫu dùng Python 3. Cặp crate được cố định để giữ binding và test runner tương thích. Trang mẫu chạy qua HTTP trên máy của bạn.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"wasm-labels\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[lib]\ncrate-type = [\"cdylib\", \"rlib\"]\n\n[dependencies]\nwasm-bindgen = \"=0.2.129\"\n\n[target.'cfg(target_arch = \"wasm32\")'.dev-dependencies]\nwasm-bindgen-test = \"=0.3.79\"\n\n[package.metadata.wasm-pack.profile.release]\nwasm-opt = false\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use wasm_bindgen::prelude::*;\n\nfn trim_label(input: &str) -> Result<&str, &'static str> {\n    let label = input.trim();\n    if label.is_empty() { return Err(\"empty\"); }\n    if label.chars().count() > 40 { return Err(\"too_long\"); }\n    Ok(label)\n}\n\nfn validate_limit(value: f64) -> Result<u32, &'static str> {\n    if !value.is_finite() { return Err(\"not_finite\"); }\n    if value.fract() != 0.0 { return Err(\"fraction\"); }\n    if !(0.0..=u32::MAX as f64).contains(&value) { return Err(\"range\"); }\n    Ok(value as u32)\n}\n\n#[wasm_bindgen(js_name = normalizeLabel)]\npub fn normalize_label(input: &str) -> Result<String, JsValue> {\n    trim_label(input).map(str::to_owned).map_err(JsValue::from_str)\n}\n\n#[wasm_bindgen(js_name = parseLimit)]\npub fn parse_limit(value: f64) -> Result<u32, JsValue> {\n    validate_limit(value).map_err(JsValue::from_str)\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn labels_preserve_unicode() {\n        assert_eq!(trim_label(\"  Học Rust  \"), Ok(\"Học Rust\"));\n        assert_eq!(trim_label(\" \\t \"), Err(\"empty\"));\n        assert!(trim_label(&\"á\".repeat(40)).is_ok());\n        assert_eq!(trim_label(&\"á\".repeat(41)), Err(\"too_long\"));\n    }\n    #[test]\n    fn limits_reject_lossy_inputs() {\n        assert_eq!(validate_limit(3.0), Ok(3));\n        assert_eq!(validate_limit(1.5), Err(\"fraction\"));\n        assert_eq!(validate_limit(-1.0), Err(\"range\"));\n        assert_eq!(validate_limit(f64::NAN), Err(\"not_finite\"));\n    }\n}\n"
          },
          {
            "path": "tests/browser.rs",
            "content": "#![cfg(target_arch = \"wasm32\")]\nuse wasm_bindgen_test::*;\nuse wasm_labels::{normalize_label, parse_limit};\n\nwasm_bindgen_test_configure!(run_in_browser);\n\n#[wasm_bindgen_test]\nfn exported_contract() {\n    assert_eq!(normalize_label(\"  Học Rust  \").unwrap(), \"Học Rust\");\n    assert!(normalize_label(\"   \").is_err());\n    assert_eq!(parse_limit(8.0).unwrap(), 8);\n    assert!(parse_limit(1.5).is_err());\n}\n"
          },
          {
            "path": "index.html",
            "content": "<!doctype html>\n<html lang=\"vi\">\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>Nhãn từ Rust</title>\n<form id=\"form\">\n  <label for=\"label\">Tên nhãn</label>\n  <input id=\"label\" value=\"  Học Rust  \" autocomplete=\"off\">\n  <button id=\"submit\" disabled>Chuẩn hóa</button>\n</form>\n<p id=\"status\" role=\"status\">Đang tải module…</p>\n<script type=\"module\" src=\"./app.js\"></script>\n</html>\n"
          },
          {
            "path": "app.js",
            "content": "import init, { normalizeLabel, parseLimit } from \"./pkg/wasm_labels.js\";\nconst form = document.querySelector(\"#form\");\nconst button = document.querySelector(\"#submit\");\nconst input = document.querySelector(\"#label\");\nconst status = document.querySelector(\"#status\");\n\ntry {\n  await init();\n  if (parseLimit(3) !== 3) throw new Error(\"contract\");\n  button.disabled = false;\n  status.textContent = \"Sẵn sàng.\";\n} catch {\n  status.textContent = \"Chưa tải được module. Kiểm tra server và tệp build.\";\n}\n\nform.addEventListener(\"submit\", event => {\n  event.preventDefault();\n  if (button.disabled) return;\n  try {\n    status.textContent = normalizeLabel(input.value);\n  } catch (error) {\n    status.textContent = error === \"empty\"\n      ? \"Hãy nhập tên nhãn.\"\n      : error === \"too_long\" ? \"Tên nhãn tối đa 40 ký tự Unicode scalar.\"\n      : \"Chưa xử lý được nhãn.\";\n  }\n});\n"
          }
        ],
        "commands": [
          "rustup target add wasm32-unknown-unknown",
          "cargo install wasm-pack --locked",
          "cargo test",
          "wasm-pack test --headless --chrome",
          "wasm-pack build --target web --dev",
          "python3 -m http.server 8080 --bind 127.0.0.1"
        ],
        "checks": [
          "Mở http://127.0.0.1:8080; nút chỉ bật sau khi init thành công.",
          "Nhãn có khoảng trắng đầu/cuối được trim, tiếng Việt giữ nguyên.",
          "Nhãn trắng hoặc hơn 40 Unicode scalar values hiện lỗi thay vì làm trang ngừng hoạt động.",
          "cargo test kiểm tra lõi; wasm-pack test kiểm tra export trong Chrome.",
          "Lưu Cargo.lock và ghi lại phiên bản wasm-pack sau lần build được kiểm chứng."
        ]
      }
    },
    {
      "id": "wasm-memory",
      "moduleId": "track-wasm",
      "title": "TypedArray, sao chép và vòng đời bộ nhớ",
      "description": "Thiết kế giao tiếp dữ liệu lớn mà không giữ view cũ hoặc nhầm một offset với quyền sở hữu.",
      "duration": 55,
      "objectives": [
        "Phân biệt dữ liệu được copy với view vào Wasm memory",
        "Nhận ra hai nguyên nhân khác nhau làm view hết hiệu lực",
        "Thiết kế API buffer có chủ sở hữu và vòng đời rõ",
        "Kiểm tra generation và giới hạn trong mô hình view"
      ],
      "sections": [
        {
          "title": "TypedArray không tự có nghĩa là zero-copy",
          "text": "Một Uint8Array chỉ mô tả cách nhìn vào một ArrayBuffer. Khi gọi export nhận &[u8], binding thông thường sao chép đầu vào sang Wasm memory để tạo slice trong thời gian gọi. Đường đi của &mut [u8] còn cần đưa kết quả sửa lại cho phía JavaScript. Vì vậy chỉ đổi Array thành TypedArray không chứng minh rằng toàn bộ pipeline đã hết copy.\n\nVẽ từng bước của dữ liệu: tệp thành ArrayBuffer, gửi đến Worker, nhập vào Wasm, tạo kết quả và hiển thị. Với mỗi bước, ghi kích thước và chủ sở hữu. Một bản copy có kiểm soát đôi khi là lựa chọn tốt: nó tạo snapshot ổn định, giúp giao diện không giữ tham chiếu tới vùng đang bị sửa."
        },
        {
          "title": "Memory growth và allocation growth khác nhau",
          "text": "Khi linear memory không shared tăng, ArrayBuffer cũ bị detached; phải lấy memory.buffer mới để tạo view mới. Với shared memory, buffer cũ không bị detached theo cùng cách nhưng view cũ vẫn không tự bao phủ phần vừa tăng. Đừng lưu một Uint8Array xuyên nhiều lời gọi có thể cấp phát mà không kiểm tra lại buffer và phạm vi.\n\nCòn một rủi ro độc lập: Vec trong Rust có thể chuyển allocation khi tăng capacity. Dù memory.buffer vẫn là cùng đối tượng, offset và độ dài trước đó có thể không còn mô tả dữ liệu của Vec. Kiểm tra buffer identity chỉ giải quyết một phần vấn đề. Hợp đồng phải nói thao tác nào được phép làm mất hiệu lực của view.",
          "code": "// Mã JavaScript minh họa một memory độc lập, không phải Vec của Rust.\nconst memory = new WebAssembly.Memory({ initial: 1 });\nlet bytes = new Uint8Array(memory.buffer);\nmemory.grow(1);\nbytes = new Uint8Array(memory.buffer); // lấy lại view của buffer hiện tại"
        },
        {
          "title": "Nếu xuất buffer, phải xuất cả quy tắc sử dụng",
          "text": "Một thiết kế nâng cao có thể để Rust sở hữu buffer và cung cấp phương thức đọc offset, length sau khi xử lý xong. JavaScript chỉ đọc trong khoảng được cam kết; không giữ view qua resize hoặc free. Kiểu wrapper có hàm giải phóng cần được gọi đúng vòng đời. Không đánh đồng garbage collection của wrapper JavaScript với thời điểm tài nguyên Rust được dọn theo mong muốn.\n\nMột lựa chọn đơn giản hơn là trả dữ liệu được sở hữu hoặc bản sao cho caller. Đo chi phí trước khi chọn API dùng con trỏ. Nếu cần generation để phát hiện kết quả cũ, generation là quy ước của ứng dụng; WebAssembly không tự thêm bộ đếm này cho bạn. Bộ đếm cũng không biến con trỏ không hợp lệ thành an toàn."
        },
        {
          "title": "Kiểm thử vòng đời cùng với nội dung",
          "text": "Bài tập mô hình hóa view bằng generation, start và len. Nó từ chối generation cũ và phép cộng tràn trước khi kiểm tra phạm vi. Đây là kiểm tra hợp đồng ở mức số, không phải chứng minh đầy đủ cho unsafe Rust. Khi làm API thực, phải xác định allocation còn sống, quyền đọc/sửa và thời điểm mọi bên ngừng dùng view.\n\nThêm test cho buffer rỗng, resize, gọi xử lý hai lần và giải phóng wrapper. Trong browser, tạo một trường hợp buộc tăng bộ nhớ rồi kiểm tra rằng UI lấy lại dữ liệu đúng. Đừng chỉ nhìn một lần chạy với mảng nhỏ: lỗi lifetime ở biên JavaScript thường chỉ xuất hiện khi dữ liệu đủ lớn hoặc khi có nhiều thao tác liên tiếp."
        }
      ],
      "tip": "Buffer vẫn là cùng một đối tượng không bảo đảm allocation của Vec còn ở offset cũ.",
      "exercise": {
        "title": "Từ chối view cũ và phạm vi tràn",
        "instructions": "Hoàn thiện valid_view cho một mô hình view của ứng dụng. Generation phải đúng, start + len không tràn và không vượt memory_len.",
        "requirements": [
          "Không sửa dữ liệu; chỉ trả true hoặc false.",
          "Generation khác nhau luôn trả false, kể cả khi khoảng byte vẫn nằm trong bộ nhớ.",
          "Khoảng rỗng ở cuối bộ nhớ hợp lệ; checked_add phải xử lý usize::MAX."
        ]
      },
      "starterCode": "struct View { generation: u64, start: usize, len: usize }\nfn valid_view(view: &View, generation: u64, memory_len: usize) -> bool {\n    todo!()\n}\nfn main() {\n    assert!(valid_view(&View { generation: 3, start: 2, len: 4 }, 3, 10));\n    assert!(!valid_view(&View { generation: 2, start: 2, len: 4 }, 3, 10));\n    assert!(!valid_view(&View { generation: 3, start: 9, len: 2 }, 3, 10));\n    assert!(valid_view(&View { generation: 3, start: 10, len: 0 }, 3, 10));\n    assert!(!valid_view(&View { generation: 3, start: usize::MAX, len: 1 }, 3, usize::MAX));\n    println!(\"View mới hợp lệ; view cũ bị từ chối\");\n}",
      "solutionCode": "struct View { generation: u64, start: usize, len: usize }\nfn valid_view(view: &View, generation: u64, memory_len: usize) -> bool {\n    view.generation == generation\n        && view.start.checked_add(view.len).is_some_and(|end| end <= memory_len)\n}\nfn main() {\n    assert!(valid_view(&View { generation: 3, start: 2, len: 4 }, 3, 10));\n    assert!(!valid_view(&View { generation: 2, start: 2, len: 4 }, 3, 10));\n    assert!(!valid_view(&View { generation: 3, start: 9, len: 2 }, 3, 10));\n    assert!(valid_view(&View { generation: 3, start: 10, len: 0 }, 3, 10));\n    assert!(!valid_view(&View { generation: 3, start: usize::MAX, len: 1 }, 3, usize::MAX));\n    println!(\"View mới hợp lệ; view cũ bị từ chối\");\n}",
      "expectedOutput": "View mới hợp lệ; view cũ bị từ chối",
      "hints": [
        "Dùng checked_add để biến tràn số thành None.",
        "is_some_and chỉ kiểm tra giới hạn khi phép cộng thành công."
      ],
      "quiz": {
        "question": "Một Vec đổi allocation nhưng WebAssembly.Memory không grow. Điều nào có thể xảy ra?",
        "options": [
          "Offset cũ vẫn luôn hợp lệ vì memory.buffer không đổi.",
          "View JavaScript cũ có thể không còn trỏ đến dữ liệu hiện tại của Vec.",
          "JavaScript tự cập nhật mọi offset của Vec.",
          "Rust tự tìm và xóa mọi TypedArray phía JavaScript."
        ],
        "correct": 1,
        "explanation": "Vòng đời allocation Rust và vòng đời ArrayBuffer là hai lớp khác nhau. Hợp đồng phải làm mất hiệu lực và cấp lại offset/length khi buffer sở hữu thay đổi."
      },
      "reference": {
        "label": "MDN: memory.grow và hiệu lực của buffer",
        "url": "https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/Memory/grow"
      }
    },
    {
      "id": "wasm-workers",
      "moduleId": "track-wasm",
      "title": "Async, Worker và kết quả đến muộn",
      "description": "Giữ giao diện phản hồi khi tính toán lớn, tải dữ liệu bất đồng bộ và hủy công việc theo hợp đồng.",
      "duration": 55,
      "objectives": [
        "Phân biệt chờ I/O với công việc chiếm CPU",
        "Thiết kế thông điệp Worker có request ID",
        "Phân biệt clone, transfer và shared memory",
        "Không áp dụng kết quả cũ sau thao tác hủy hoặc yêu cầu mới"
      ],
      "sections": [
        {
          "title": "Async không rời khỏi thread hiện tại",
          "text": "Một export async có thể chờ Promise rồi trả kết quả cho JavaScript. Trong thời gian chờ mạng, trình duyệt có cơ hội xử lý sự kiện khác. Nhưng vòng lặp tính toán đồng bộ bên trong async vẫn chiếm thread đang thực thi nó. Thêm async trước một hàm xử lý hàng triệu phần tử không tự tạo Worker hay làm giao diện hết khựng.\n\nĐặt API web ở adapter: JavaScript có thể fetch, kiểm tra HTTP status rồi chuyển bytes vào Rust; hoặc Rust gọi API qua web-sys. Lỗi HTTP, lỗi mạng và lỗi phân tích dữ liệu là ba loại khác nhau. Nếu dùng hủy fetch, truyền AbortSignal đến yêu cầu thật. Chỉ ngừng await một Promise không mặc nhiên hủy tác dụng bên ngoài."
        },
        {
          "title": "Worker trao đổi thông điệp, không điều khiển DOM",
          "text": "Một dedicated Worker có môi trường riêng và không truy cập DOM như thread giao diện. Khởi tạo module Wasm trong Worker, nhận công việc bằng message rồi gửi kết quả về. UI chịu trách nhiệm hiển thị loading, lỗi và kết quả. Một Worker chạy công việc dài giúp UI phản hồi, nhưng không tự chia thuật toán thành nhiều phần song song.\n\nMỗi message nên có request ID, loại thao tác và dữ liệu được kiểm tra. Giới hạn kích thước đầu vào và số công việc đang chờ; đừng gửi một job cho mỗi phím gõ rồi giữ tất cả trong hàng đợi. Với thao tác tìm kiếm, giữ yêu cầu mới nhất hoặc debounce thường phù hợp hơn xử lý toàn bộ lịch sử.",
          "code": "// JavaScript phía giao diện; worker.js phải tự nạp module và xử lý message.\nconst worker = new Worker(new URL(\"./worker.js\", import.meta.url), { type: \"module\" });\nconst jobId = 7;\nconst buffer = new Uint8Array([10, 20, 30]).buffer;\nworker.postMessage({ jobId, buffer }, [buffer]);\n// buffer đã chuyển quyền sử dụng; không dùng lại dữ liệu cũ ở thread này."
        },
        {
          "title": "Transfer không phải shared memory",
          "text": "Structured clone tạo bản sao các dữ liệu được hỗ trợ. Với ArrayBuffer trong transfer list, tài nguyên được chuyển sang phía nhận và buffer phía gửi bị detached. Hãy gửi buffer trong payload nữa: transfer list chỉ chỉ định cách chuyển tài nguyên. Chuyển buffer sang Worker không đồng nghĩa bước đưa nó vào Wasm cũng hết copy; đó là một biên riêng.\n\nSharedArrayBuffer cho phép nhiều bên nhìn vào cùng vùng dữ liệu và cần giao thức đồng bộ. Trên web, việc chia sẻ này có yêu cầu secure context và cross-origin isolation. Đừng thêm shared memory chỉ vì muốn tối ưu một lần copy: nó làm tăng trách nhiệm về atomic, khả năng triển khai header và tương thích. Bắt đầu bằng message với quyền sở hữu rõ."
        },
        {
          "title": "Hủy và bỏ kết quả cũ là hai việc khác nhau",
          "text": "Một job tính toán đồng bộ có thể khiến Worker chưa xử lý được message hủy cho tới khi hàm đó trả về. Muốn hủy hợp tác, chia việc thành lô và nhường cơ hội xử lý sự kiện; hoặc kết thúc Worker khi chính sách ứng dụng cho phép. Chỉ đánh dấu kết quả là lỗi thời giúp bảo vệ UI nhưng không tiết kiệm CPU của phần đang chạy.\n\nBài tập giữ một pending ID. Chỉ reply có ID trùng mới cập nhật kết quả; sau khi chấp nhận, bỏ pending để reply trùng không chạy lần nữa. Hủy được biểu diễn bằng None. Khi thiết kế thực tế, kết hợp cơ chế này với giới hạn hàng đợi, cleanup Worker và kiểm thử người dùng gửi hai yêu cầu liên tiếp rồi đổi màn hình."
        }
      ],
      "tip": "Bỏ kết quả lỗi thời bảo vệ trạng thái giao diện; dừng công việc đang chạy cần một cơ chế riêng.",
      "exercise": {
        "title": "Chỉ nhận phản hồi của công việc đang chờ",
        "instructions": "Hoàn thiện apply_reply. Chỉ phản hồi trùng pending ID được chấp nhận; sau đó xóa pending và cập nhật output.",
        "requirements": [
          "Reply cũ, reply trùng hoặc trạng thái đã hủy không đổi output.",
          "Sau một reply hợp lệ, pending trở thành None.",
          "Không clone value nếu có thể chuyển quyền sở hữu trực tiếp vào output."
        ]
      },
      "starterCode": "fn apply_reply(pending: &mut Option<u64>, reply_id: u64, value: String, output: &mut Option<String>) -> bool {\n    todo!()\n}\nfn main() {\n    let mut pending = Some(2);\n    let mut output = Some(String::from(\"trước\"));\n    assert!(!apply_reply(&mut pending, 1, \"cũ\".into(), &mut output));\n    assert_eq!(output.as_deref(), Some(\"trước\"));\n    assert_eq!(pending, Some(2));\n    assert!(apply_reply(&mut pending, 2, \"mới\".into(), &mut output));\n    assert_eq!(pending, None);\n    assert!(!apply_reply(&mut pending, 2, \"lặp\".into(), &mut output));\n    assert_eq!(output.as_deref(), Some(\"mới\"));\n    pending = None; // người dùng đã hủy\n    assert!(!apply_reply(&mut pending, 3, \"đã hủy\".into(), &mut output));\n    println!(\"Kết quả: {}\", output.unwrap());\n}",
      "solutionCode": "fn apply_reply(pending: &mut Option<u64>, reply_id: u64, value: String, output: &mut Option<String>) -> bool {\n    if *pending != Some(reply_id) { return false; }\n    *pending = None;\n    *output = Some(value);\n    true\n}\nfn main() {\n    let mut pending = Some(2);\n    let mut output = Some(String::from(\"trước\"));\n    assert!(!apply_reply(&mut pending, 1, \"cũ\".into(), &mut output));\n    assert_eq!(output.as_deref(), Some(\"trước\"));\n    assert_eq!(pending, Some(2));\n    assert!(apply_reply(&mut pending, 2, \"mới\".into(), &mut output));\n    assert_eq!(pending, None);\n    assert!(!apply_reply(&mut pending, 2, \"lặp\".into(), &mut output));\n    assert_eq!(output.as_deref(), Some(\"mới\"));\n    pending = None; // người dùng đã hủy\n    assert!(!apply_reply(&mut pending, 3, \"đã hủy\".into(), &mut output));\n    println!(\"Kết quả: {}\", output.unwrap());\n}",
      "expectedOutput": "Kết quả: mới",
      "hints": [
        "So sánh Option với Some(reply_id) trước mọi thay đổi.",
        "Nhận kết quả và kết thúc trạng thái chờ trong cùng một nhánh."
      ],
      "quiz": {
        "question": "Một vòng lặp CPU dài nằm trong async fn được gọi trên main thread. Điều gì đúng?",
        "options": [
          "Async luôn chuyển vòng lặp sang Worker.",
          "Nó có thể vẫn chặn giao diện; cần thiết kế Worker hoặc chia việc và nhường lịch.",
          "Mọi await đều tạo thread mới.",
          "Chỉ cần thêm Promise.resolve là toàn bộ phép tính sẽ song song."
        ],
        "correct": 1,
        "explanation": "Async mô tả việc có thể tạm dừng ở điểm chờ; nó không làm một đoạn tính toán đồng bộ tự rời thread hiện tại hoặc tự nhường lịch."
      },
      "reference": {
        "label": "MDN: sử dụng Web Workers",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers"
      }
    },
    {
      "id": "wasm-performance",
      "moduleId": "track-wasm",
      "title": "Đo hiệu năng từ giao diện đến Wasm",
      "description": "Đo tải module, chi phí chuyển dữ liệu và xử lý theo lô trước khi chọn cách tối ưu.",
      "duration": 60,
      "objectives": [
        "Tách thời gian khởi tạo khỏi thời gian xử lý lặp lại",
        "Đo toàn bộ pipeline và ghi điều kiện thử nghiệm",
        "Chọn kích thước lô theo responsiveness và chi phí giao tiếp",
        "Viết lõi xử lý tăng dần có thể kiểm thử độc lập"
      ],
      "sections": [
        {
          "title": "Chọn số đo đúng với trải nghiệm",
          "text": "Người dùng chờ từ lúc bấm nút đến khi thấy kết quả, trong khi một benchmark nhỏ có thể chỉ đo vòng lặp Rust. Hãy tách thời gian tải mạng, biên dịch hoặc khởi tạo Wasm, chuyển dữ liệu, tính toán và render. Báo cáo lần chạy đầu và những lần đã khởi tạo riêng; trộn chúng thành một số trung bình làm khó xác định chỗ cần sửa.\n\nDùng bản build release khi đánh giá hiệu năng triển khai, nhưng giữ cấu hình profiling khi cần tìm vị trí tốn thời gian. Ghi trình duyệt, thiết bị, kích thước dữ liệu và số lần lặp. Đo cả latency cùng bộ nhớ đỉnh; một tối ưu nhanh hơn ít nhưng làm tăng mạnh bộ nhớ có thể không phù hợp với điện thoại."
        },
        {
          "title": "Đừng chuyển biên cho từng phần tử",
          "text": "Nếu gọi một export cho mỗi byte, chi phí qua binding có thể lớn hơn phép tính bên trong. Thử gửi một slice hoặc một nhóm công việc và trả kết quả gộp. Tương tự, cập nhật DOM cho từng bước xử lý thường gây nhiều việc hơn cần thiết; gửi progress theo nhịp có giới hạn và chỉ render phần đang nhìn thấy.\n\nKích thước lô là một đánh đổi: lô nhỏ phản hồi hủy nhanh nhưng tăng overhead; lô lớn giảm số lần gọi nhưng giữ CPU lâu hơn. Không có hằng số tối ưu cho mọi thiết bị. Bài tập chỉ xây kế hoạch lô đúng; sau đó cần đo thời gian thực tế và chọn ngân sách phù hợp với sản phẩm."
        },
        {
          "title": "Tối ưu thuật toán trước microbenchmark",
          "text": "Viết một bản JavaScript có thuật toán và dữ liệu tương đương để so sánh công bằng. Nếu bản Rust đổi từ tìm kiếm tuyến tính sang index nhưng bản JavaScript vẫn quét toàn bộ, bạn đang đo cả khác biệt thuật toán. Dùng đầu vào đại diện, kể cả dữ liệu rỗng, lớn và không thuận lợi; luôn kiểm tra kết quả để tránh benchmark một đường chạy sai.\n\nVới performance.now, đo một nhóm thao tác đủ dài rồi chia theo số lần khi cần, vì độ phân giải timer có thể bị giới hạn. Tránh kết luận từ một lần chạy ngắn. Kiểm tra profiler để biết thời gian ở copy, parse hay render trước khi loại bỏ allocation hoặc đưa unsafe vào API bộ nhớ.",
          "code": "// JavaScript minh họa: init và samples đã được chuẩn bị trước phép đo.\nconst started = performance.now();\nconst summary = summarize(samples);\nconst elapsed = performance.now() - started;\nconsole.log({ elapsed, summary });\n// Đo lần khởi tạo và toàn bộ thao tác giao diện ở các phép đo riêng."
        },
        {
          "title": "Lõi tăng dần giúp kiểm tra và hủy",
          "text": "Lab Histogram giữ input mượn, con trỏ tiến độ và 256 bộ đếm. advance xử lý tối đa một ngân sách byte rồi trả trạng thái đã xong. Dữ liệu đầu vào bất biến trong vòng đời scanner nên từng byte được xử lý một lần; tổng kết quả không phụ thuộc cách chia lô. Budget bằng 0 là lỗi và không làm tiến độ thay đổi.\n\nĐây là lõi host có thể ghép vào một adapter Worker; bản thân hàm advance không nhường event loop. Adapter phải quyết định lúc nào chạy lô tiếp và lúc nào nhận message mới. Test so sánh nhiều kích thước lô, dữ liệu rỗng và gọi sau hoàn tất. Khi đưa lên web, đo thêm chi phí giữ buffer và chuyển kết quả qua binding."
        }
      ],
      "tip": "Một benchmark thuật toán nhanh không chứng minh thao tác trên giao diện nhanh; hãy đo cả dữ liệu đi vào và kết quả đi ra.",
      "exercise": {
        "title": "Lập kế hoạch xử lý theo lô",
        "instructions": "Trả các khoảng nửa mở liên tiếp phủ đúng 0..total, mỗi khoảng dài tối đa batch. batch bằng 0 là lỗi.",
        "requirements": [
          "total bằng 0 trả danh sách rỗng khi batch hợp lệ.",
          "Không có khoảng rỗng, khoảng trùng hoặc byte bị bỏ sót.",
          "Phép tính điểm cuối không tràn kể cả khi batch bằng usize::MAX."
        ]
      },
      "starterCode": "fn batches(total: usize, batch: usize) -> Result<Vec<(usize, usize)>, &'static str> {\n    todo!()\n}\nfn main() {\n    assert_eq!(batches(8, 3), Ok(vec![(0, 3), (3, 6), (6, 8)]));\n    assert_eq!(batches(0, 3), Ok(vec![]));\n    assert_eq!(batches(3, 0), Err(\"zero_batch\"));\n    assert_eq!(batches(0, 0), Err(\"zero_batch\"));\n    assert_eq!(batches(5, usize::MAX), Ok(vec![(0, 5)]));\n    assert_eq!(batches(2, 1), Ok(vec![(0, 1), (1, 2)]));\n    println!(\"Các lô: {:?}\", batches(8, 3).unwrap());\n}",
      "solutionCode": "fn batches(total: usize, batch: usize) -> Result<Vec<(usize, usize)>, &'static str> {\n    if batch == 0 { return Err(\"zero_batch\"); }\n    let mut result = Vec::new();\n    let mut start = 0;\n    while start < total {\n        let end = start.saturating_add(batch).min(total);\n        result.push((start, end));\n        start = end;\n    }\n    Ok(result)\n}\nfn main() {\n    assert_eq!(batches(8, 3), Ok(vec![(0, 3), (3, 6), (6, 8)]));\n    assert_eq!(batches(0, 3), Ok(vec![]));\n    assert_eq!(batches(3, 0), Err(\"zero_batch\"));\n    assert_eq!(batches(0, 0), Err(\"zero_batch\"));\n    assert_eq!(batches(5, usize::MAX), Ok(vec![(0, 5)]));\n    assert_eq!(batches(2, 1), Ok(vec![(0, 1), (1, 2)]));\n    println!(\"Các lô: {:?}\", batches(8, 3).unwrap());\n}",
      "expectedOutput": "Các lô: [(0, 3), (3, 6), (6, 8)]",
      "hints": [
        "Từ chối batch bằng 0 trước vòng lặp để bảo đảm có tiến triển.",
        "Dùng saturating_add rồi min(total), không dùng start + batch trực tiếp."
      ],
      "quiz": {
        "question": "Wasm xử lý 5 ms nhưng thao tác giao diện mất 200 ms. Bước tiếp theo hợp lý nhất là gì?",
        "options": [
          "Mặc định viết lại toàn bộ bằng unsafe.",
          "Đo riêng tải/khởi tạo, copy, binding và render trước khi chọn tối ưu.",
          "Kết luận timer sai vì Rust luôn nhanh hơn JavaScript.",
          "Tăng số Worker vô hạn."
        ],
        "correct": 1,
        "explanation": "Thời gian lõi chỉ là một phần của trải nghiệm. Cần tìm phần chiếm thời gian trong toàn bộ pipeline và kiểm tra giới hạn tài nguyên."
      },
      "reference": {
        "label": "MDN: performance.now và đồng hồ đo",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Performance/now"
      },
      "localLab": {
        "title": "Histogram xử lý tăng dần",
        "instructions": "Đây là crate lõi chạy trên host, chưa có adapter JavaScript. Nó giúp kiểm tra tính tương đương giữa các kích thước lô trước khi nối với Worker và đo chi phí browser.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"wasm-histogram-core\"\nversion = \"0.1.0\"\nedition = \"2024\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "pub struct Histogram<'a> {\n    input: &'a [u8],\n    cursor: usize,\n    bins: [usize; 256],\n}\n\nimpl<'a> Histogram<'a> {\n    pub fn new(input: &'a [u8]) -> Self {\n        Self { input, cursor: 0, bins: [0; 256] }\n    }\n\n    pub fn advance(&mut self, budget: usize) -> Result<bool, &'static str> {\n        if budget == 0 { return Err(\"zero_budget\"); }\n        let end = self.cursor.saturating_add(budget).min(self.input.len());\n        for &byte in &self.input[self.cursor..end] {\n            self.bins[usize::from(byte)] += 1;\n        }\n        self.cursor = end;\n        Ok(self.cursor == self.input.len())\n    }\n\n    pub fn processed(&self) -> usize { self.cursor }\n    pub fn bins(&self) -> &[usize; 256] { &self.bins }\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    fn scan(input: &[u8], budget: usize) -> [usize; 256] {\n        let mut scanner = Histogram::new(input);\n        while !scanner.advance(budget).unwrap() {}\n        *scanner.bins()\n    }\n\n    #[test]\n    fn batching_does_not_change_result() {\n        let input = [0, 255, 0, 2, 2, 2, 7];\n        let expected = scan(&input, usize::MAX);\n        assert_eq!(scan(&input, 1), expected);\n        assert_eq!(scan(&input, 3), expected);\n        assert_eq!(expected[0], 2);\n        assert_eq!(expected[2], 3);\n        assert_eq!(expected[255], 1);\n        assert_eq!(expected.iter().sum::<usize>(), input.len());\n    }\n\n    #[test]\n    fn invalid_budget_preserves_state() {\n        let mut scanner = Histogram::new(&[4, 4]);\n        assert_eq!(scanner.advance(0), Err(\"zero_budget\"));\n        assert_eq!(scanner.processed(), 0);\n        assert_eq!(scanner.bins()[4], 0);\n        assert_eq!(scanner.advance(1), Ok(false));\n        assert_eq!(scanner.advance(1), Ok(true));\n        assert_eq!(scanner.advance(100), Ok(true));\n        assert_eq!(scanner.bins()[4], 2);\n    }\n\n    #[test]\n    fn empty_input_is_complete() {\n        let mut scanner = Histogram::new(&[]);\n        assert_eq!(scanner.advance(1), Ok(true));\n        assert_eq!(scanner.bins().iter().sum::<usize>(), 0);\n    }\n}\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo test --release",
          "cargo clippy --all-targets -- -D warnings"
        ],
        "checks": [
          "Ba test đều đạt ở debug và release.",
          "Tổng các bin bằng độ dài input; chia lô không thay đổi kết quả.",
          "Budget 0 không làm mất dữ liệu hoặc thay đổi cursor.",
          "Gọi advance sau khi xong không đếm lại dữ liệu.",
          "Khi ghép Worker, thêm phép đo browser; thời gian cargo test không phải benchmark UI."
        ]
      }
    },
    {
      "id": "wasm-release",
      "moduleId": "track-wasm",
      "title": "Đóng gói, kiểm thử và phát hành module Wasm",
      "description": "Triển khai đúng cặp JavaScript–Wasm, kiểm soát cache và giữ trải nghiệm có thể phục hồi khi tải lỗi.",
      "duration": 55,
      "objectives": [
        "Phát hành wrapper và binary như một phiên bản thống nhất",
        "Thiết kế cache cho artifact có hash và manifest thay đổi",
        "Kiểm tra trong browser cùng lỗi mạng và Worker",
        "Giữ semantic HTML, thông báo lỗi và bàn phím hoạt động"
      ],
      "sections": [
        {
          "title": "Một bản phát hành có nhiều tệp liên quan",
          "text": "Package Wasm không chỉ có tệp .wasm. Wrapper JavaScript, khai báo TypeScript, dữ liệu hoặc tài nguyên đi kèm phải khớp cùng bản build. Giữ một release ID hoặc manifest để chọn bộ artifact nhất quán; không cập nhật wrapper mới trong khi CDN vẫn trả binary cũ dưới cùng URL. Lưu được bản cũ giúp rollback mà không biên dịch lại vội vàng.\n\nChọn target đầu ra theo nơi tiêu thụ: trang ES module trực tiếp khác ứng dụng có bundler hoặc Node. Kiểm tra đường dẫn artifact khi ứng dụng nằm dưới một prefix, khi có base URL và khi build minify. Đừng chỉ kiểm thử máy phát triển ở đường dẫn gốc; lỗi đường dẫn thường xuất hiện đúng lúc deploy."
        },
        {
          "title": "Cache phải giữ tính nhất quán",
          "text": "Tệp có tên chứa hash nội dung có thể dùng thời gian cache dài vì nội dung tại URL đó không đổi. HTML hoặc manifest trỏ tới release hiện tại cần chính sách cập nhật phù hợp, chẳng hạn revalidation. Khi xuất bản, tải toàn bộ artifact mới trước rồi đổi tham chiếu tới release. Giữ artifact cũ đủ lâu cho tab đang mở và các lần rollback.\n\nPhục vụ .wasm với MIME application/wasm để hỗ trợ cơ chế khởi tạo streaming. Kiểm tra CORS, CSP và header liên quan tại môi trường thực; không tắt chính sách toàn trang để xử lý một lỗi đường dẫn. Nếu có service worker, kiểm thử quy trình nâng phiên bản riêng vì nó tạo thêm một tầng cache có vòng đời độc lập.",
          "code": "// Dữ liệu manifest minh họa; các URL phải trỏ tới artifact đã tải đủ.\nconst manifest = {\n  release: \"r2026-11-01\",\n  apiMajor: 1,\n  wrapper: \"/assets/labels.82a4.js\",\n  wasm: \"/assets/labels.19bf.wasm\"\n};\n// Chỉ đổi manifest đang hoạt động sau khi kiểm tra toàn bộ release."
        },
        {
          "title": "Ba lớp test phát hiện ba loại lỗi",
          "text": "Test host kiểm tra thuật toán; wasm-bindgen-test kiểm tra hành vi ở môi trường Wasm/JavaScript; test giao diện kiểm tra khởi tạo, nhập liệu, trạng thái chờ và tương tác thật. Chạy ít nhất trình duyệt bạn công bố hỗ trợ, cùng các ca dữ liệu rỗng, lớn và không hợp lệ. Với Worker, gửi reply cũ hoặc lỗi có chủ đích để xác nhận UI không hiển thị nhầm.\n\nThêm ca mất mạng lúc tải module, tải thành công nhưng gọi thất bại, cache khác phiên bản và người dùng điều hướng khi job chưa xong. Những ca này không nên xóa đầu vào đã nhập. Ghi thông tin đủ chẩn đoán như release ID và loại lỗi; không mặc định ghi toàn bộ tệp người dùng đang phân tích."
        },
        {
          "title": "Giao diện vẫn thuộc trách nhiệm ứng dụng",
          "text": "Wasm có thể tính kết quả nhưng không thay thế semantic HTML hay thiết kế trải nghiệm. Input cần label; tiến độ và lỗi cần thông báo phù hợp; một phép tính dài cần trạng thái có thể hiểu và cách hủy rõ ràng. Khi kết quả là biểu đồ, cung cấp bảng hoặc tóm tắt văn bản để người dùng không phải dựa hoàn toàn vào hình ảnh.\n\nBài tập kiểm tra một kế hoạch kích hoạt release: wrapper, binary và API phải khớp, các artifact phải sẵn sàng. Đây chỉ là quy tắc điều phối dựa trên metadata đã được pipeline xác minh; so sánh chuỗi release ID không tự xác thực chữ ký hay tính toàn vẹn. Capstone yêu cầu chứng minh quy trình cập nhật và phục hồi bằng kiểm thử cụ thể."
        }
      ],
      "tip": "Đổi tham chiếu release sau khi tải đủ artifact; giữ bản cũ để tab đang mở và rollback còn hoạt động.",
      "exercise": {
        "title": "Chỉ kích hoạt một release nhất quán",
        "instructions": "Hoàn thiện ready_release. Các bước kiểm tra theo thứ tự: release ID rỗng, ID không khớp, API major không khớp, artifact chưa sẵn sàng.",
        "requirements": [
          "Trả mã lỗi missing_release, mixed_release, api hoặc not_ready theo đúng thứ tự.",
          "Chỉ trả release ID khi cả hai artifact cùng API major mà ứng dụng yêu cầu.",
          "Hàm nhận metadata đã được xác minh; không coi kiểm tra này là xác minh chữ ký hay hash."
        ]
      },
      "starterCode": "#[derive(Clone, Copy)]\nstruct Artifact<'a> { release: &'a str, api: u32, ready: bool }\nfn ready_release<'a>(wrapper: &Artifact<'a>, wasm: &Artifact<'a>, app_api: u32) -> Result<&'a str, &'static str> {\n    todo!()\n}\nfn main() {\n    let wrapper = Artifact { release: \"r7\", api: 1, ready: true };\n    let wasm = Artifact { release: \"r7\", api: 1, ready: true };\n    assert_eq!(ready_release(&wrapper, &wasm, 1), Ok(\"r7\"));\n    assert_eq!(ready_release(&wrapper, &Artifact { release: \"r6\", ..wasm }, 1), Err(\"mixed_release\"));\n    assert_eq!(ready_release(&wrapper, &Artifact { api: 2, ..wasm }, 1), Err(\"api\"));\n    assert_eq!(ready_release(&wrapper, &Artifact { ready: false, ..wasm }, 1), Err(\"not_ready\"));\n    assert_eq!(ready_release(&wrapper, &Artifact { release: \"\", ..wasm }, 1), Err(\"missing_release\"));\n    assert_eq!(ready_release(&wrapper, &wasm, 2), Err(\"api\"));\n    println!(\"Sẵn sàng: {}\", ready_release(&wrapper, &wasm, 1).unwrap());\n}",
      "solutionCode": "#[derive(Clone, Copy)]\nstruct Artifact<'a> { release: &'a str, api: u32, ready: bool }\nfn ready_release<'a>(wrapper: &Artifact<'a>, wasm: &Artifact<'a>, app_api: u32) -> Result<&'a str, &'static str> {\n    if wrapper.release.is_empty() || wasm.release.is_empty() { return Err(\"missing_release\"); }\n    if wrapper.release != wasm.release { return Err(\"mixed_release\"); }\n    if wrapper.api != app_api || wasm.api != app_api { return Err(\"api\"); }\n    if !wrapper.ready || !wasm.ready { return Err(\"not_ready\"); }\n    Ok(wrapper.release)\n}\nfn main() {\n    let wrapper = Artifact { release: \"r7\", api: 1, ready: true };\n    let wasm = Artifact { release: \"r7\", api: 1, ready: true };\n    assert_eq!(ready_release(&wrapper, &wasm, 1), Ok(\"r7\"));\n    assert_eq!(ready_release(&wrapper, &Artifact { release: \"r6\", ..wasm }, 1), Err(\"mixed_release\"));\n    assert_eq!(ready_release(&wrapper, &Artifact { api: 2, ..wasm }, 1), Err(\"api\"));\n    assert_eq!(ready_release(&wrapper, &Artifact { ready: false, ..wasm }, 1), Err(\"not_ready\"));\n    assert_eq!(ready_release(&wrapper, &Artifact { release: \"\", ..wasm }, 1), Err(\"missing_release\"));\n    assert_eq!(ready_release(&wrapper, &wasm, 2), Err(\"api\"));\n    println!(\"Sẵn sàng: {}\", ready_release(&wrapper, &wasm, 1).unwrap());\n}",
      "expectedOutput": "Sẵn sàng: r7",
      "hints": [
        "Kiểm tra cả wrapper.api và wasm.api so với app_api.",
        "Kiểu trả về mượn chuỗi release từ metadata; không cần tạo String."
      ],
      "quiz": {
        "question": "Cách phát hành nào giảm nguy cơ wrapper mới nạp binary cũ?",
        "options": [
          "Ghi đè mọi tệp cùng tên, để mỗi cache tự cập nhật.",
          "Tắt toàn bộ cache cho mọi tài nguyên mãi mãi.",
          "Tải đủ artifact có phiên bản/hash rồi đổi manifest hoặc trang tham chiếu; giữ release trước.",
          "Chỉ thay phần khai báo TypeScript."
        ],
        "correct": 2,
        "explanation": "Một điểm chuyển phiên bản thống nhất cùng URL artifact bất biến giúp giữ cặp wrapper/binary nhất quán và cho phép rollback có kiểm soát."
      },
      "reference": {
        "label": "wasm-bindgen: các cách triển khai",
        "url": "https://wasm-bindgen.github.io/wasm-bindgen/reference/deployment.html"
      }
    }
  ]
};
