import type { TrackExpansion } from "../../specialization-types";

export const wasmExpansion: TrackExpansion = {
  "chapters": [
    {
      "id": "wasm-ch1",
      "title": "Kiến trúc và chuỗi build",
      "description": "Chọn ranh giới module và hiểu artifact cần tải.",
      "lessonIds": [
        "wasm-runtime",
        "wasm-architecture",
        "wasm-build-pipeline"
      ],
      "outcomes": [
        "Phân biệt khả năng module và host.",
        "Build/init artifact nhất quán."
      ]
    },
    {
      "id": "wasm-ch2",
      "title": "Binding và hợp đồng API",
      "description": "Thiết kế kiểu dữ liệu, lỗi và ownership qua JavaScript.",
      "lessonIds": [
        "wasm-bindings",
        "wasm-abi-contracts",
        "wasm-errors-panics"
      ],
      "outcomes": [
        "Giữ đơn vị, miền giá trị và phiên bản API.",
        "Xử lý Err và trạng thái sau lỗi."
      ]
    },
    {
      "id": "wasm-ch3",
      "title": "Linear memory và dữ liệu nhị phân",
      "description": "Quản lý buffer và thực hiện dự án ảnh.",
      "lessonIds": [
        "wasm-memory",
        "wasm-buffer-validation",
        "wasm-image-project"
      ],
      "outcomes": [
        "Kiểm tra layout, kích thước và ngân sách.",
        "Bàn giao export ảnh có test bytes/alpha."
      ]
    },
    {
      "id": "wasm-ch4",
      "title": "Worker và ứng dụng tương tác",
      "description": "Tách công việc nền và giữ UI theo phiên hiện tại.",
      "lessonIds": [
        "wasm-workers",
        "wasm-worker-protocol",
        "wasm-search-project"
      ],
      "outcomes": [
        "Thiết kế message ID/generation.",
        "Phân biệt hủy với bỏ kết quả cũ."
      ]
    },
    {
      "id": "wasm-ch5",
      "title": "Hiệu năng và tài nguyên",
      "description": "Đo cả đường đi, dùng chunk cùng backpressure.",
      "lessonIds": [
        "wasm-performance",
        "wasm-benchmarking",
        "wasm-resource-budgets"
      ],
      "outcomes": [
        "Đo cold/warm, copy và latency toàn luồng.",
        "Giới hạn input, pending và công việc đang bay."
      ]
    },
    {
      "id": "wasm-ch6",
      "title": "Kiểm thử, phát hành và dự án cuối",
      "description": "Nghiệm thu cả core, binding và browser.",
      "lessonIds": [
        "wasm-release",
        "wasm-browser-testing",
        "wasm-report-project"
      ],
      "outcomes": [
        "Phát hành JS/Wasm cùng version.",
        "Bàn giao ứng dụng streaming có recovery UI."
      ]
    }
  ],
  "lessons": [
    {
      "id": "wasm-architecture",
      "title": "Chọn ranh giới Rust, JavaScript và runtime",
      "description": "Đặt Wasm vào đúng phần của ứng dụng, dựa trên dữ liệu, khả năng host và chi phí tích hợp.",
      "objectives": [
        "Phân biệt module Wasm với ứng dụng web hoàn chỉnh.",
        "Chọn lõi tính toán có ranh giới dữ liệu rõ.",
        "Nhận diện khác biệt target và khả năng host."
      ],
      "sections": [
        {
          "title": "Wasm nằm ở đâu trong ứng dụng",
          "text": "Một ứng dụng web vẫn cần giao diện, sự kiện, tải tài nguyên và quản lý vòng đời. Module Wasm cung cấp mã thực thi trong môi trường host, không tự có DOM hay quyền truy cập mọi API của trình duyệt. Với Rust biên dịch cho wasm32-unknown-unknown, JavaScript thường là lớp kết nối gọi hàm Rust và đưa kết quả lên giao diện. Hãy bắt đầu bằng một thao tác cụ thể như biến đổi ảnh hoặc lập báo cáo từ dữ liệu người dùng chọn. Tách đầu vào, đầu ra và lỗi của thao tác đó trước khi nghĩ đến việc chuyển toàn bộ ứng dụng sang Rust."
        },
        {
          "title": "Chọn phần có lợi ích đo được",
          "text": "Wasm có thể phù hợp một thuật toán đang có thư viện Rust tốt, yêu cầu dùng chung giữa nhiều nền tảng hoặc cần xử lý lượng dữ liệu đáng kể. Tuy nhiên một hàm cộng vài số gọi hàng nghìn lần qua biên giới có thể tốn thời gian chuyển dữ liệu nhiều hơn phần tính toán. Gom công việc thành batch và đo cả thời gian chuẩn bị input, copy, thực thi và hiển thị. Không kết luận nhanh hơn chỉ vì ngôn ngữ nguồn là Rust. Tính đúng, giới hạn bộ nhớ và khả năng bảo trì của ranh giới cũng là tiêu chí thiết kế, không chỉ số mili giây."
        },
        {
          "title": "Target quyết định giả định nền tảng",
          "text": "wasm32-unknown-unknown không tương đương một tiến trình Linux có filesystem và socket tùy ý. Những API std biên dịch được có thể có hành vi hạn chế hoặc không hỗ trợ theo target. Các môi trường WASI là hướng tích hợp khác với browser và cần host tương ứng; không đổi target rồi giả định JavaScript glue vẫn dùng nguyên vẹn. Dự án trong khóa dùng browser cùng wasm-bindgen. Phần lõi chỉ phụ thuộc dữ liệu và thư viện phù hợp target, còn thao tác chọn file, network và DOM đặt ở adapter JavaScript. Cách chia này cũng cho phép chạy phần lớn unit test lõi trên máy phát triển."
        },
        {
          "title": "Một bảng quyết định có thể kiểm tra",
          "text": "Viết bảng gồm dữ liệu vào, kích thước tối đa, kiểu trả về, tác dụng phụ và nơi thực thi. Ví dụ bộ lọc ảnh nhận RGBA, trả RGBA cùng kích thước; UI giữ file và canvas, worker giữ công việc nặng, Rust chỉ biến đổi pixels. Nếu thuật toán cần đọc cấu hình, truyền cấu hình đã được validation thay vì để lõi truy cập window. Bài tập tính ngân sách truyền dữ liệu cho nhiều batch bằng checked arithmetic. Khi ngân sách vượt ngưỡng, thiết kế phải chia nhỏ hoặc từ chối trước cấp phát. Sau đó dùng đo lường thực tế để xác nhận ranh giới đã chọn có ích cho trải nghiệm người sử dụng."
        }
      ],
      "tip": "Lõi Rust thuần dữ liệu dễ kiểm thử; adapter chịu trách nhiệm quyền và vòng đời của trình duyệt.",
      "exercise": {
        "title": "Ngân sách dữ liệu qua biên giới",
        "instructions": "Tính bytes = items × bytes_per_item × copies; trả overflow khi tràn và budget khi vượt limit.",
        "requirements": [
          "Số lượng 0 trả 0.",
          "Dùng checked_mul cho từng bước.",
          "Giới hạn bằng đúng ngân sách được chấp nhận."
        ]
      },
      "expectedOutput": "Ranh giới dữ liệu có ngân sách rõ",
      "hints": [
        "Nhân qua checked_mul trước khi so limit.",
        "Phân biệt overflow với số hợp lệ vượt budget."
      ],
      "quiz": {
        "question": "Một module Wasm cho browser có tự truy cập DOM như mã JavaScript trong trang không?",
        "options": [
          "Không; cần API host/bindings và adapter phù hợp.",
          "Có, mọi std API ánh xạ trực tiếp sang DOM.",
          "Có nếu biên dịch release."
        ],
        "correct": 0,
        "explanation": "Wasm thực thi trong host. DOM và quyền browser được cung cấp qua lớp kết nối, không tự có trong module."
      },
      "reference": {
        "label": "Rust wasm32-unknown-unknown target",
        "url": "https://doc.rust-lang.org/rustc/platform-support/wasm32-unknown-unknown.html"
      },
      "moduleId": "track-wasm",
      "duration": 35,
      "starterCode": "\nfn transfer_bytes(items: usize, bytes_per_item: usize, copies: usize, limit: usize) -> Result<usize, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(transfer_bytes(100, 4, 2, 800), Ok(800));\n    assert_eq!(transfer_bytes(100, 4, 2, 799), Err(\"budget\"));\n    assert_eq!(transfer_bytes(0, 4, 2, 0), Ok(0));\n    assert_eq!(transfer_bytes(usize::MAX, 2, 1, usize::MAX), Err(\"overflow\"));\n    println!(\"Ranh giới dữ liệu có ngân sách rõ\");\n}",
      "solutionCode": "\nfn transfer_bytes(items: usize, bytes_per_item: usize, copies: usize, limit: usize) -> Result<usize, &'static str> {\n    let bytes = items.checked_mul(bytes_per_item).and_then(|n| n.checked_mul(copies)).ok_or(\"overflow\")?;\n    if bytes > limit { return Err(\"budget\"); }\n    Ok(bytes)\n}\nfn main() {\n    assert_eq!(transfer_bytes(100, 4, 2, 800), Ok(800));\n    assert_eq!(transfer_bytes(100, 4, 2, 799), Err(\"budget\"));\n    assert_eq!(transfer_bytes(0, 4, 2, 0), Ok(0));\n    assert_eq!(transfer_bytes(usize::MAX, 2, 1, usize::MAX), Err(\"overflow\"));\n    println!(\"Ranh giới dữ liệu có ngân sách rõ\");\n}"
    },
    {
      "id": "wasm-build-pipeline",
      "title": "Từ Cargo đến gói JavaScript và tệp Wasm",
      "description": "Hiểu từng sản phẩm build, phiên bản công cụ và cách tải module có thể chẩn đoán.",
      "objectives": [
        "Phân biệt rlib, cdylib, glue JavaScript và binary Wasm.",
        "Giữ phiên bản bindgen phù hợp.",
        "Chẩn đoán lỗi build, tải và khởi tạo riêng biệt."
      ],
      "sections": [
        {
          "title": "Build tạo nhiều sản phẩm liên quan nhau",
          "text": "Cargo biên dịch Rust cho target Wasm và tạo binary, nhưng giao diện thuận tiện cho JavaScript thường cần bước wasm-bindgen sinh glue cùng khai báo kiểu. crate-type cdylib phục vụ artifact tích hợp, còn rlib giúp dùng crate như thư viện trong test và các crate Rust khác. wasm-pack ghép các bước thông dụng thành lệnh build và tạo thư mục package. Không đổi tên một tệp wasm độc lập rồi bỏ quên JavaScript tương ứng, vì glue được sinh theo các export và quy ước của binary cụ thể. Hai phần cần được phát hành và cache như một tập nhất quán."
        },
        {
          "title": "Phiên bản công cụ là một đầu vào build",
          "text": "Crate wasm-bindgen và công cụ xử lý binary phải tương thích; cài CLI tùy ý khác phiên bản có thể gây lỗi schema hoặc binding. Dự án mẫu khóa phiên bản đã chọn và giữ Cargo.lock sau khi resolve. Khi nâng cấp, nâng bộ công cụ có chủ đích rồi chạy lại test native, Wasm và browser. Build thành công chỉ chứng minh bước biên dịch, không chứng minh import URL đúng hay host có tính năng cần dùng. Ghi rõ phiên bản Rust, wasm-pack và target trong báo cáo để người khác tái hiện lỗi thay vì chỉ gửi ảnh chụp màn hình thông báo cuối."
        },
        {
          "title": "Tải module qua đúng môi trường",
          "text": "Với target web, trang import JavaScript module và await hàm init trước khi gọi các export cần Wasm. Phục vụ thư mục bằng HTTP local thay vì mở file HTML trực tiếp, vì URL, module loading và chính sách nguồn có thể khác. Server cần trả đúng tài nguyên và MIME phù hợp, đặc biệt khi dùng streaming compilation. Nếu init thất bại, UI cần hiển thị trạng thái tải lỗi và cho phép thử lại có kiểm soát. Không để người dùng nhấn nút xử lý khi instance chưa sẵn sàng, rồi dùng một lỗi undefined để giải thích mọi nguyên nhân."
        },
        {
          "title": "Chẩn đoán theo giai đoạn",
          "text": "Lỗi Cargo thường có vị trí Rust hoặc dependency; lỗi bindgen liên quan export và phiên bản; lỗi network cần URL, status và kiểu nội dung; lỗi runtime có thể do trap hoặc dữ liệu. Tách các giai đoạn này trong log phát triển để tránh sửa thuật toán khi thực ra server đang trả trang 404 thay binary. Bài tập mô hình hóa trạng thái loading, ready và failed, chỉ cho chạy khi ready. Trong ứng dụng thật, dùng một promise init được chia sẻ cho các yêu cầu đồng thời để tránh tạo nhiều instance không cần thiết. Khi retry sau lỗi, tạo lại trạng thái có chủ đích thay vì giữ promise bị reject mãi."
        }
      ],
      "tip": "JavaScript glue, khai báo kiểu và binary Wasm thuộc cùng một bản build; phát hành chúng cùng nhau.",
      "exercise": {
        "title": "Cổng sẵn sàng của module",
        "instructions": "Chuyển trạng thái idle→loading bằng load, loading→ready bằng ok, loading→failed bằng error, failed→loading bằng retry. Mọi cặp khác là invalid.",
        "requirements": [
          "Không cho ready nhận ok lần nữa.",
          "Retry chỉ từ failed.",
          "Không tự cho chạy ở loading."
        ]
      },
      "expectedOutput": "Chỉ xử lý khi module đã sẵn sàng",
      "hints": [
        "Match trên tuple state,event.",
        "Hai chuyển trạng thái cùng kết quả có thể dùng |."
      ],
      "quiz": {
        "question": "Trang đang nhận HTML 404 ở URL .wasm. Nên kiểm tra bước nào trước?",
        "options": [
          "Tăng heap ngay.",
          "Thuật toán sắp xếp Rust.",
          "Network/server và URL artifact."
        ],
        "correct": 2,
        "explanation": "Sai tài nguyên tải thuộc giai đoạn phân phối/khởi tạo. Sửa thuật toán không giải quyết server trả HTML."
      },
      "reference": {
        "label": "wasm-bindgen deployment",
        "url": "https://wasm-bindgen.github.io/wasm-bindgen/reference/deployment.html"
      },
      "moduleId": "track-wasm",
      "duration": 35,
      "starterCode": "\nfn next(state: &str, event: &str) -> Result<&'static str, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(next(\"idle\", \"load\"), Ok(\"loading\"));\n    assert_eq!(next(\"loading\", \"ok\"), Ok(\"ready\"));\n    assert_eq!(next(\"loading\", \"error\"), Ok(\"failed\"));\n    assert_eq!(next(\"failed\", \"retry\"), Ok(\"loading\"));\n    assert_eq!(next(\"ready\", \"ok\"), Err(\"invalid\"));\n    println!(\"Chỉ xử lý khi module đã sẵn sàng\");\n}",
      "solutionCode": "\nfn next(state: &str, event: &str) -> Result<&'static str, &'static str> {\n    match (state, event) {\n        (\"idle\", \"load\") | (\"failed\", \"retry\") => Ok(\"loading\"),\n        (\"loading\", \"ok\") => Ok(\"ready\"),\n        (\"loading\", \"error\") => Ok(\"failed\"),\n        _ => Err(\"invalid\"),\n    }\n}\nfn main() {\n    assert_eq!(next(\"idle\", \"load\"), Ok(\"loading\"));\n    assert_eq!(next(\"loading\", \"ok\"), Ok(\"ready\"));\n    assert_eq!(next(\"loading\", \"error\"), Ok(\"failed\"));\n    assert_eq!(next(\"failed\", \"retry\"), Ok(\"loading\"));\n    assert_eq!(next(\"ready\", \"ok\"), Err(\"invalid\"));\n    println!(\"Chỉ xử lý khi module đã sẵn sàng\");\n}"
    },
    {
      "id": "wasm-abi-contracts",
      "title": "Thiết kế API xuyên biên giới kiểu dữ liệu",
      "description": "Định nghĩa số, chuỗi, bytes và phiên bản hợp đồng để JS và Rust hiểu cùng một ý nghĩa.",
      "objectives": [
        "Chọn kiểu biểu diễn phù hợp consumer.",
        "Giữ đơn vị và miền giá trị nhất quán.",
        "Kiểm tra input trước chuyển kiểu hoặc cấp phát."
      ],
      "sections": [
        {
          "title": "Kiểu tương ứng chưa đủ về ý nghĩa",
          "text": "Một u32 ở Rust và một number ở JavaScript chỉ là một phần của hợp đồng. Trường width có đơn vị pixel, không phải byte; duration có thể là milliseconds; limit có miền hợp lệ và giá trị mặc định. Ghi những điều này ngay trong API và kiểm thử cả hai phía. Nếu JS truyền số âm hoặc số lẻ cho tham số nguyên, không dựa vào hành vi chuyển đổi để thay thế validation nghiệp vụ. Adapter cần kiểm tra Number.isInteger cùng miền cho phép khi nhận dữ liệu trực tiếp từ form, còn Rust vẫn kiểm tra invariants quan trọng vì API có thể được gọi từ nguồn khác."
        },
        {
          "title": "Số lớn và dữ liệu nhị phân",
          "text": "JavaScript number không biểu diễn chính xác mọi số nguyên lớn, trong khi Rust có u64 và i64. Các binding hiện hành có hỗ trợ biểu diễn bằng BigInt cho những kiểu phù hợp, nhưng JSON không serialize BigInt trực tiếp. Nếu ID phải đi qua JSON hoặc consumer cũ, chuỗi thập phân có thể là lựa chọn rõ hơn. Đối với ảnh hoặc dữ liệu nhị phân, TypedArray mô tả bytes tốt hơn chuỗi. Chuỗi JavaScript dùng mô hình UTF-16, còn String Rust là UTF-8; byte offset của Rust không tự trở thành index ký tự trong JavaScript. Định dạng vị trí lỗi cần nêu rõ đơn vị."
        },
        {
          "title": "Batch API và quyền sở hữu",
          "text": "API nhận một mảng dữ liệu và trả kết quả gộp thường giảm số lần gọi xuyên biên giới. Tuy nhiên batch quá lớn tăng RAM và độ trễ trước kết quả đầu. Chọn kích thước dựa trên ngân sách và đo thực tế. Binding chuyển Vec hoặc slice có thể copy dữ liệu theo quy ước của loại binding; không gọi mọi TypedArray là zero-copy. Nếu chủ động cung cấp view vào linear memory, bạn phải quản lý lifetime, tái cấp phát và memory.grow. Baseline của khóa ưu tiên cách copy rõ ràng cho đến khi có số đo chứng minh cần phương án phức tạp hơn."
        },
        {
          "title": "Version hóa điều consumer quan sát",
          "text": "Đổi thứ tự phần tử, đơn vị hoặc ý nghĩa lỗi có thể phá ứng dụng dù tên hàm không đổi. Với dữ liệu cấu trúc serialize, thêm schema_version và bộ fixture kiểm tra giữa JS và Rust. Với API typed, giữ declaration file đi cùng artifact và test các giá trị biên từ JavaScript thật. Bài tập parse ID thập phân nghiêm ngặt thành u64: không nhận dấu, khoảng trắng hay ký tự lạ, nhưng chấp nhận số 0. Khi xuất lại, dùng to_string để giữ độ chính xác. Đây là một lựa chọn giao tiếp có thể kiểm tra, không phải quy tắc mọi ứng dụng đều phải dùng chuỗi."
        }
      ],
      "tip": "Hợp đồng cần ghi kiểu, đơn vị, miền hợp lệ, ownership và cách báo lỗi; tên hàm không đủ.",
      "exercise": {
        "title": "ID thập phân không mất độ chính xác",
        "instructions": "Chỉ chấp nhận chuỗi không rỗng gồm chữ số ASCII; parse u64 và trả format hoặc overflow.",
        "requirements": [
          "Không nhận dấu cộng, dấu âm, khoảng trắng.",
          "u64::MAX hợp lệ.",
          "Số lớn hơn u64::MAX trả lỗi."
        ]
      },
      "expectedOutput": "ID giữ đúng giá trị qua chuỗi thập phân",
      "hints": [
        "Kiểm tra bytes ASCII trước parse.",
        "parse::<u64> phát hiện overflow."
      ],
      "quiz": {
        "question": "Rust trả byte offset UTF-8 của lỗi trong chuỗi tiếng Việt. JS có dùng nó trực tiếp làm index UTF-16 không?",
        "options": [
          "Có vì cùng là số nguyên.",
          "Không; cần chuyển đổi hoặc thống nhất đơn vị vị trí.",
          "Có nếu dùng u64."
        ],
        "correct": 1,
        "explanation": "UTF-8 byte offset và UTF-16 code unit index khác nhau với nhiều ký tự. Hợp đồng phải nêu đơn vị và adapter chuyển đổi."
      },
      "reference": {
        "label": "wasm-bindgen supported types",
        "url": "https://wasm-bindgen.github.io/wasm-bindgen/reference/types.html"
      },
      "moduleId": "track-wasm",
      "duration": 35,
      "starterCode": "\nfn parse_id(input: &str) -> Result<u64, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(parse_id(\"0\"), Ok(0));\n    assert_eq!(parse_id(\"18446744073709551615\"), Ok(u64::MAX));\n    assert_eq!(parse_id(\"18446744073709551616\"), Err(\"overflow\"));\n    assert_eq!(parse_id(\"+1\"), Err(\"format\"));\n    assert_eq!(parse_id(\" 1\"), Err(\"format\"));\n    assert_eq!(parse_id(\"\"), Err(\"format\"));\n    println!(\"ID giữ đúng giá trị qua chuỗi thập phân\");\n}",
      "solutionCode": "\nfn parse_id(input: &str) -> Result<u64, &'static str> {\n    if input.is_empty() || !input.bytes().all(|b| b.is_ascii_digit()) { return Err(\"format\"); }\n    input.parse().map_err(|_| \"overflow\")\n}\nfn main() {\n    assert_eq!(parse_id(\"0\"), Ok(0));\n    assert_eq!(parse_id(\"18446744073709551615\"), Ok(u64::MAX));\n    assert_eq!(parse_id(\"18446744073709551616\"), Err(\"overflow\"));\n    assert_eq!(parse_id(\"+1\"), Err(\"format\"));\n    assert_eq!(parse_id(\" 1\"), Err(\"format\"));\n    assert_eq!(parse_id(\"\"), Err(\"format\"));\n    println!(\"ID giữ đúng giá trị qua chuỗi thập phân\");\n}"
    },
    {
      "id": "wasm-errors-panics",
      "title": "Lỗi miền, ngoại lệ JavaScript và trap",
      "description": "Báo lỗi có thể xử lý qua API thay vì dùng panic cho input không hợp lệ.",
      "objectives": [
        "Phân biệt lỗi dữ liệu với lỗi lập trình.",
        "Ánh xạ Result qua wasm-bindgen.",
        "Quản lý trạng thái khi một thao tác thất bại."
      ],
      "sections": [
        {
          "title": "Input sai là một kết quả dự kiến",
          "text": "Ảnh có kích thước không khớp buffer hoặc CSV có dòng sai là tình huống ứng dụng phải xử lý. Lõi Rust nên trả Result với lỗi mô tả điều kiện vi phạm. Không dùng unwrap hoặc assert cho dữ liệu do người dùng cung cấp chỉ vì happy path đã chạy được. Assert phù hợp cho invariant nội bộ đã được thiết lập và cần phát hiện lỗi lập trình. Thiết kế lỗi từ sớm giúp UI hiển thị đúng thao tác khắc phục, chẳng hạn giảm kích thước ảnh hoặc sửa dòng dữ liệu, thay vì chỉ thông báo module bị lỗi không rõ nguyên nhân."
        },
        {
          "title": "Result đi qua binding như thế nào",
          "text": "Một hàm export bằng wasm-bindgen có thể trả Result<T, E> khi T và E đáp ứng quy tắc chuyển đổi. Nhánh Ok trở thành giá trị JavaScript, còn Err chuyển thành exception phía JavaScript. Vì vậy adapter JS cần try/catch quanh lời gọi đồng bộ; với promise thì xử lý reject tương ứng. Trong lõi, giữ enum lỗi hoặc kiểu thuần Rust để test native không phụ thuộc JsValue. Chỉ ở wrapper Wasm mới đổi lỗi thành JsValue. Nếu Rust gọi hàm JavaScript có thể ném exception, import cần cách bắt phù hợp, chẳng hạn thuộc tính catch, thay vì giả định exception tự trở thành Result."
        },
        {
          "title": "Trạng thái sau thất bại phải được công bố",
          "text": "Với hàm thuần nhận input rồi trả output, lỗi thường không thay đổi trạng thái bên ngoài. Với đối tượng xử lý nhiều chunk, một chunk sai có thể đến sau các chunk đã được cộng vào tổng. Có ba lựa chọn chính: rollback thao tác, giữ trạng thái cũ bằng validation trước mutation, hoặc đánh dấu đối tượng failed và buộc tạo lại. Chọn rõ một cách rồi test. Nếu panic gây trap, đừng mặc nhiên coi instance và mọi cấu trúc đang giữ là có thể tiếp tục dùng an toàn theo hợp đồng ứng dụng. Hướng xử lý bảo thủ là loại bỏ công việc lỗi và tạo lại đối tượng cần thiết."
        },
        {
          "title": "Chẩn đoán và trải nghiệm lỗi",
          "text": "UI nên phân biệt không tải được module, input không hợp lệ, hủy bởi người dùng và lỗi nội bộ. Giữ mã lỗi ổn định để logic UI không phụ thuộc nguyên văn thông báo tiếng Việt. Chi tiết kỹ thuật phục vụ phát triển có thể đi vào console, còn người học cần thấy vị trí và cách sửa dữ liệu. Bài tập kiểm tra kích thước trước khi thay state; khi lỗi, state không được thay. Trong dự án streaming, dùng trạng thái poisoned sau lỗi để ngăn xuất báo cáo một phần như báo cáo hoàn chỉnh. Test cần gọi thêm một thao tác sau lỗi để chứng minh chính sách được thực hiện, không chỉ kiểm tra Err đầu tiên."
        }
      ],
      "tip": "Tách lỗi thuần Rust khỏi JsValue giúp unit test native nhanh và giữ wrapper Wasm nhỏ.",
      "exercise": {
        "title": "Lỗi không làm thay trạng thái hợp lệ",
        "instructions": "Đặt kích thước mới chỉ khi width, height > 0 và tích <= 1_000_000. Khi lỗi, giữ nguyên state.",
        "requirements": [
          "Kiểm tra overflow.",
          "Không mutation trước validation.",
          "Chấp nhận đúng ngưỡng."
        ]
      },
      "expectedOutput": "Lỗi không phá trạng thái trước đó",
      "hints": [
        "Tính pixels trước khi gán state.",
        "checked_mul bắt overflow."
      ],
      "quiz": {
        "question": "Export Result trả Err qua wasm-bindgen được JavaScript quan sát thế nào?",
        "options": [
          "Một exception được ném ở lời gọi export.",
          "Luôn nhận null.",
          "Browser tự tải lại trang."
        ],
        "correct": 0,
        "explanation": "Err được chuyển thành JavaScript exception theo quy tắc binding. Adapter cần bắt lỗi và giữ trạng thái UI phù hợp."
      },
      "reference": {
        "label": "wasm-bindgen Result",
        "url": "https://wasm-bindgen.github.io/wasm-bindgen/reference/types/result.html"
      },
      "moduleId": "track-wasm",
      "duration": 35,
      "starterCode": "\nfn resize(state: &mut (usize, usize), width: usize, height: usize) -> Result<(), &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    let mut size = (10, 10);\n    assert_eq!(resize(&mut size, 1000, 1000), Ok(()));\n    assert_eq!(size, (1000, 1000));\n    assert_eq!(resize(&mut size, 0, 2), Err(\"empty\"));\n    assert_eq!(size, (1000, 1000));\n    assert_eq!(resize(&mut size, usize::MAX, 2), Err(\"overflow\"));\n    assert_eq!(resize(&mut size, 1001, 1000), Err(\"budget\"));\n    println!(\"Lỗi không phá trạng thái trước đó\");\n}",
      "solutionCode": "\nfn resize(state: &mut (usize, usize), width: usize, height: usize) -> Result<(), &'static str> {\n    if width == 0 || height == 0 { return Err(\"empty\"); }\n    let pixels = width.checked_mul(height).ok_or(\"overflow\")?;\n    if pixels > 1_000_000 { return Err(\"budget\"); }\n    *state = (width, height);\n    Ok(())\n}\nfn main() {\n    let mut size = (10, 10);\n    assert_eq!(resize(&mut size, 1000, 1000), Ok(()));\n    assert_eq!(size, (1000, 1000));\n    assert_eq!(resize(&mut size, 0, 2), Err(\"empty\"));\n    assert_eq!(size, (1000, 1000));\n    assert_eq!(resize(&mut size, usize::MAX, 2), Err(\"overflow\"));\n    assert_eq!(resize(&mut size, 1001, 1000), Err(\"budget\"));\n    println!(\"Lỗi không phá trạng thái trước đó\");\n}"
    },
    {
      "id": "wasm-buffer-validation",
      "title": "Buffer ảnh, stride và phép tính kích thước",
      "description": "Xác thực cấu trúc dữ liệu nhị phân trước khi truy cập pixels hoặc cấp phát output.",
      "objectives": [
        "Tính độ dài buffer bằng checked arithmetic.",
        "Phân biệt RGBA liên tục với dữ liệu có stride.",
        "Giữ đúng alpha và định nghĩa màu của thuật toán."
      ],
      "sections": [
        {
          "title": "Một mảng byte chưa tự mô tả ảnh",
          "text": "Buffer RGBA liên tục thường có bốn byte cho mỗi pixel, theo thứ tự đỏ, xanh lá, xanh dương và alpha. width và height xác định số pixel, còn độ dài phải bằng width nhân height nhân bốn trong hợp đồng đơn giản của dự án. Nhưng không phải mọi nguồn ảnh đều có bố cục này: có định dạng RGB ba kênh, thứ tự BGRA hoặc hàng có padding. Vì vậy hãy ghi rõ layout và từ chối input không khớp. Chọn kiểu số đủ miền không thay thế checked arithmetic, đặc biệt khi cùng code chạy ở target có usize 32 bit và host có usize 64 bit."
        },
        {
          "title": "Stride và miền truy cập",
          "text": "Stride là số byte từ đầu hàng này đến đầu hàng kế tiếp. Nó có thể lớn hơn width nhân số kênh khi có padding. Vị trí pixel khi đó là y nhân stride cộng x nhân channels, nhưng từng phép tính vẫn cần kiểm tra overflow và giới hạn. Nếu chỉ hỗ trợ contiguous RGBA, yêu cầu stride bằng width nhân bốn giúp hợp đồng nhỏ và test rõ. Đừng bỏ qua bytes cuối một cách âm thầm vì đó có thể là tín hiệu layout sai. Với crop, kiểm tra rectangle nằm trong ảnh trước khi tạo output, tránh dùng indexing để phát hiện lỗi bằng panic."
        },
        {
          "title": "Alpha và ý nghĩa phép biến đổi",
          "text": "Một grayscale đơn giản có thể tính độ sáng gần đúng từ các kênh bằng trọng số nguyên rồi giữ alpha. Đây là phép xử lý sRGB bytes thực dụng trong lab, không phải mô hình màu chính xác tuyến tính cho mọi công việc ảnh. Nếu dùng premultiplied alpha hoặc cần color management, phải chuyển đổi theo hợp đồng riêng. Test nên bao gồm pixel trong suốt, đen, trắng và ba màu cơ bản để nhận ra tráo kênh. Khi hiển thị bằng ImageData, bảo đảm chiều dài output và kích thước canvas vẫn khớp; lỗi ở adapter có thể tạo hình sai dù vòng lặp Rust đúng."
        },
        {
          "title": "Chi phí bộ nhớ quanh thuật toán",
          "text": "Một ảnh có thể đồng thời tồn tại dưới dạng Blob, bitmap decode, canvas, Uint8Array đầu vào, bản copy trong Wasm và output. Chỉ tính Vec output sẽ đánh giá thấp peak memory. Đặt giới hạn pixel trước decode nếu biết kích thước, rồi kiểm tra lại ở Rust trước cấp phát. Giải phóng bitmap, object URL và đối tượng Wasm khi không còn dùng. Bài tập xác nhận số bytes RGBA hợp lệ và budget. Bước tiếp theo là dùng nó ở wrapper biến đổi ảnh, kiểm thử kích thước zero, buffer thiếu, buffer thừa và overflow mà không cần mở canvas cho mọi unit test."
        }
      ],
      "tip": "Kiểm tra kích thước trước indexing và cấp phát; lỗi layout cần Result rõ ràng thay vì panic.",
      "exercise": {
        "title": "Xác nhận RGBA liên tục",
        "instructions": "Tính width × height × 4, từ chối zero, overflow, vượt max_pixels hoặc len không khớp.",
        "requirements": [
          "Thiếu hay thừa một byte đều sai.",
          "Zero dimension trả empty.",
          "Giới hạn tính theo pixels trước output."
        ]
      },
      "expectedOutput": "Buffer RGBA đúng kích thước và ngân sách",
      "hints": [
        "Kiểm tra zero rồi checked_mul.",
        "So chính xác len, không dùng >=."
      ],
      "quiz": {
        "question": "Buffer 2×3 RGBA liên tục có 25 byte nên xử lý ra sao?",
        "options": [
          "Từ chối vì hợp đồng yêu cầu đúng 24 byte.",
          "Coi là ảnh 3×3.",
          "Bỏ byte cuối."
        ],
        "correct": 0,
        "explanation": "Dữ liệu thừa có thể chỉ ra layout sai. Hợp đồng chặt giúp không âm thầm diễn giải dữ liệu khác."
      },
      "reference": {
        "label": "MDN ImageData",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/ImageData"
      },
      "moduleId": "track-wasm",
      "duration": 35,
      "starterCode": "\nfn rgba_len(width: usize, height: usize, len: usize, max_pixels: usize) -> Result<usize, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(rgba_len(2, 3, 24, 6), Ok(24));\n    assert_eq!(rgba_len(2, 3, 23, 6), Err(\"length\"));\n    assert_eq!(rgba_len(2, 3, 25, 6), Err(\"length\"));\n    assert_eq!(rgba_len(0, 3, 0, 6), Err(\"empty\"));\n    assert_eq!(rgba_len(usize::MAX, 2, 0, usize::MAX), Err(\"overflow\"));\n    assert_eq!(rgba_len(2, 3, 24, 5), Err(\"budget\"));\n    println!(\"Buffer RGBA đúng kích thước và ngân sách\");\n}",
      "solutionCode": "\nfn rgba_len(width: usize, height: usize, len: usize, max_pixels: usize) -> Result<usize, &'static str> {\n    if width == 0 || height == 0 { return Err(\"empty\"); }\n    let pixels = width.checked_mul(height).ok_or(\"overflow\")?;\n    if pixels > max_pixels { return Err(\"budget\"); }\n    let expected = pixels.checked_mul(4).ok_or(\"overflow\")?;\n    if expected != len { return Err(\"length\"); }\n    Ok(expected)\n}\nfn main() {\n    assert_eq!(rgba_len(2, 3, 24, 6), Ok(24));\n    assert_eq!(rgba_len(2, 3, 23, 6), Err(\"length\"));\n    assert_eq!(rgba_len(2, 3, 25, 6), Err(\"length\"));\n    assert_eq!(rgba_len(0, 3, 0, 6), Err(\"empty\"));\n    assert_eq!(rgba_len(usize::MAX, 2, 0, usize::MAX), Err(\"overflow\"));\n    assert_eq!(rgba_len(2, 3, 24, 5), Err(\"budget\"));\n    println!(\"Buffer RGBA đúng kích thước và ngân sách\");\n}",
      "simulation": {
        "title": "Từ kích thước ảnh đến output hợp lệ",
        "description": "Theo dõi budget và layout trước khi Rust truy cập pixels.",
        "kind": "memory",
        "nodes": [
          {
            "id": "input",
            "label": "RGBA đầu vào",
            "detail": "Width, height và số byte"
          },
          {
            "id": "size",
            "label": "Kiểm tra kích thước",
            "detail": "Nhân có kiểm tra tràn và giới hạn pixel"
          },
          {
            "id": "pixels",
            "label": "Biến đổi pixels",
            "detail": "Đổi RGB, giữ alpha"
          },
          {
            "id": "output",
            "label": "Kết quả",
            "detail": "Chỉ buffer hợp lệ được xuất"
          }
        ],
        "scenarios": [
          {
            "id": "wasm-rgba-ok",
            "label": "Ảnh hợp lệ",
            "steps": [
              {
                "title": "Nhận dữ liệu",
                "description": "Ảnh 2×2 RGBA liên tục.",
                "activeNodeIds": [
                  "input"
                ],
                "values": [
                  {
                    "label": "width",
                    "value": "2"
                  },
                  {
                    "label": "height",
                    "value": "2"
                  },
                  {
                    "label": "len",
                    "value": "16"
                  }
                ]
              },
              {
                "title": "Kiểm tra budget",
                "description": "4 pixel nằm trong giới hạn, cần đúng 16 byte.",
                "activeNodeIds": [
                  "size"
                ],
                "values": [
                  {
                    "label": "pixels",
                    "value": "4"
                  },
                  {
                    "label": "expected",
                    "value": "16"
                  },
                  {
                    "label": "valid",
                    "value": "true"
                  }
                ]
              },
              {
                "title": "Chạy biến đổi",
                "description": "Mỗi chunk có 4 byte; alpha được giữ.",
                "activeNodeIds": [
                  "pixels"
                ],
                "values": [
                  {
                    "label": "processed",
                    "value": "4"
                  },
                  {
                    "label": "alpha",
                    "value": "giữ nguyên"
                  }
                ]
              },
              {
                "title": "Trả output",
                "description": "Canvas nhận đúng kích thước ban đầu.",
                "activeNodeIds": [
                  "output"
                ],
                "values": [
                  {
                    "label": "bytes",
                    "value": "16"
                  },
                  {
                    "label": "status",
                    "value": "thành công"
                  }
                ]
              }
            ]
          },
          {
            "id": "wasm-rgba-bad",
            "label": "Buffer thiếu",
            "steps": [
              {
                "title": "Nhận dữ liệu",
                "description": "Kích thước khai báo 2×2 nhưng thiếu một byte.",
                "activeNodeIds": [
                  "input"
                ],
                "values": [
                  {
                    "label": "width",
                    "value": "2"
                  },
                  {
                    "label": "height",
                    "value": "2"
                  },
                  {
                    "label": "len",
                    "value": "15"
                  }
                ]
              },
              {
                "title": "Tính độ dài",
                "description": "Hợp đồng vẫn yêu cầu 16 byte.",
                "activeNodeIds": [
                  "size"
                ],
                "values": [
                  {
                    "label": "expected",
                    "value": "16"
                  },
                  {
                    "label": "actual",
                    "value": "15"
                  }
                ]
              },
              {
                "title": "Từ chối trước vòng lặp",
                "description": "Không đọc pixel cuối bằng indexing.",
                "activeNodeIds": [
                  "pixels"
                ],
                "values": [
                  {
                    "label": "processed",
                    "value": "0"
                  },
                  {
                    "label": "error",
                    "value": "buffer_length"
                  }
                ]
              },
              {
                "title": "Báo lỗi qua binding",
                "description": "JS bắt exception và không vẽ output giả.",
                "activeNodeIds": [
                  "output"
                ],
                "values": [
                  {
                    "label": "allocated_output",
                    "value": "0"
                  },
                  {
                    "label": "status",
                    "value": "input không hợp lệ"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "wasm-worker-protocol",
      "title": "Giao thức worker và kết quả đã lỗi thời",
      "description": "Thiết kế request ID, generation và trạng thái UI để công việc cũ không ghi đè lựa chọn mới.",
      "objectives": [
        "Định nghĩa message có loại và ID.",
        "Phân biệt bỏ kết quả cũ với hủy tính toán.",
        "Quản lý vòng đời worker và dữ liệu chuyển giao."
      ],
      "sections": [
        {
          "title": "Message là API giữa hai ngữ cảnh",
          "text": "Main thread và worker không chia sẻ cùng DOM hay stack gọi hàm. Chúng giao tiếp bằng message, vì thế cần hợp đồng tương tự một API: loại thông điệp, phiên bản, request ID, payload và lỗi. Một worker tìm kiếm có thể nhận load để tạo index, query để tìm và trả ready, result hoặc error. Nếu thay dataset, thêm generation để phân biệt kết quả thuộc index cũ với index mới. Chỉ so request ID mà quên dataset có thể hiển thị kết quả đúng truy vấn nhưng sai dữ liệu. Kiểm tra message ở phía nhận để lỗi protocol không biến thành trạng thái UI không nhất quán."
        },
        {
          "title": "Kết quả đến muộn là tình huống bình thường",
          "text": "Người dùng gõ rust rồi nhanh chóng gõ rust async. Truy vấn đầu có thể hoàn thành sau truy vấn thứ hai nếu xử lý có các bước async hoặc nhiều worker. UI chỉ nhận kết quả khi cả request ID và generation khớp phiên hiện tại. Bỏ kết quả cũ bảo vệ giao diện, nhưng không lấy lại CPU đã dùng cho việc cũ. Debounce giảm số yêu cầu, còn cancellation cần cơ chế riêng. Với một lời gọi Wasm đồng bộ dài trong worker, worker không xử lý message cancel cho đến khi lời gọi nhường quyền; chia thành chunk hoặc terminate worker là hai cách có phạm vi tác động khác nhau."
        },
        {
          "title": "Copy, transfer và quyền sử dụng buffer",
          "text": "postMessage thông thường dùng structured clone cho dữ liệu hỗ trợ. Transfer list cho phép chuyển quyền sở hữu một ArrayBuffer phù hợp, làm buffer phía gửi không còn dùng như trước. Chỉ gửi buffer bạn sẵn sàng nhường; view của một vùng trong buffer lớn có thể kéo theo toàn bộ backing buffer. Transfer sang worker không tự loại bỏ bản copy khi binding tiếp tục đưa bytes vào linear memory của Wasm. Hãy vẽ từng bước sở hữu để đo số bản sao thật. Shared memory là một thiết kế khác với yêu cầu đồng bộ và môi trường riêng, không phải thay thế miễn phí cho transfer."
        },
        {
          "title": "Vòng đời và kiểm thử giao thức",
          "text": "Khi component bị hủy hoặc người dùng chọn tài liệu mới, terminate worker cũ, tăng generation và xóa kết quả không còn phù hợp. Error event ở worker phải chuyển UI về trạng thái có thể thử lại, không để spinner chạy mãi. Trong test, chủ động trả kết quả theo thứ tự đảo ngược và thay dataset giữa hai message. Bài tập quyết định một kết quả có được nhận hay không dựa trên ID, generation và trạng thái canceled. Dự án worker tiếp theo có mã thật để thực hành; bước nghiệm thu cần thử cả loading chậm, lỗi init và nhấn tìm liên tục, vì unit test thuật toán chưa chứng minh protocol đúng."
        }
      ],
      "tip": "Bỏ kết quả lỗi thời và hủy công việc là hai trách nhiệm khác nhau; cần thiết kế cả hai khi công việc tốn tài nguyên.",
      "exercise": {
        "title": "Chỉ nhận kết quả của phiên hiện tại",
        "instructions": "Accept khi request và generation đều khớp và phiên chưa bị hủy.",
        "requirements": [
          "ID đúng nhưng generation cũ bị từ chối.",
          "Generation đúng nhưng request cũ bị từ chối.",
          "Hủy từ chối mọi kết quả."
        ]
      },
      "expectedOutput": "Kết quả cũ không ghi đè phiên mới",
      "hints": [
        "Tuple equality kiểm tra cả hai thành phần.",
        "canceled cần được kiểm tra riêng."
      ],
      "quiz": {
        "question": "Main thread bỏ kết quả query cũ có tự dừng tính toán Wasm đang chạy không?",
        "options": [
          "Có, GC tự dừng ngay.",
          "Không; chỉ ngăn cập nhật UI, cần cơ chế hủy riêng.",
          "Có nếu request ID tăng."
        ],
        "correct": 1,
        "explanation": "Lọc kết quả không gửi tín hiệu dừng và không ngắt lời gọi đồng bộ. Có thể chia chunk hoặc terminate worker theo thiết kế."
      },
      "reference": {
        "label": "MDN Using Web Workers",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers"
      },
      "moduleId": "track-wasm",
      "duration": 35,
      "starterCode": "\nfn accept(current: (u64, u64), incoming: (u64, u64), canceled: bool) -> bool {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert!(accept((8,2),(8,2),false));\n    assert!(!accept((8,2),(7,2),false));\n    assert!(!accept((8,2),(8,1),false));\n    assert!(!accept((8,2),(8,2),true));\n    println!(\"Kết quả cũ không ghi đè phiên mới\");\n}",
      "solutionCode": "\nfn accept(current: (u64, u64), incoming: (u64, u64), canceled: bool) -> bool {\n    !canceled && current == incoming\n}\nfn main() {\n    assert!(accept((8,2),(8,2),false));\n    assert!(!accept((8,2),(7,2),false));\n    assert!(!accept((8,2),(8,1),false));\n    assert!(!accept((8,2),(8,2),true));\n    println!(\"Kết quả cũ không ghi đè phiên mới\");\n}",
      "simulation": {
        "title": "Query cũ và phiên tìm kiếm mới",
        "description": "ID yêu cầu cùng generation bảo vệ dữ liệu đang hiển thị.",
        "kind": "sequence",
        "nodes": [
          {
            "id": "ui",
            "label": "Input",
            "detail": "Người dùng thay truy vấn"
          },
          {
            "id": "queue",
            "label": "Giao thức",
            "detail": "Request và generation"
          },
          {
            "id": "worker",
            "label": "Worker + Wasm",
            "detail": "Tìm trong index"
          },
          {
            "id": "render",
            "label": "Kết quả",
            "detail": "Chỉ nhận phiên hiện tại"
          }
        ],
        "scenarios": [
          {
            "id": "wasm-query-ok",
            "label": "Một truy vấn",
            "steps": [
              {
                "title": "Nhập truy vấn",
                "description": "Dataset đang ở generation 2.",
                "activeNodeIds": [
                  "ui"
                ],
                "values": [
                  {
                    "label": "query",
                    "value": "rust"
                  },
                  {
                    "label": "request",
                    "value": "7"
                  },
                  {
                    "label": "generation",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "Gửi message",
                "description": "Query mang đủ ID và generation.",
                "activeNodeIds": [
                  "queue"
                ],
                "values": [
                  {
                    "label": "type",
                    "value": "query"
                  },
                  {
                    "label": "request",
                    "value": "7"
                  },
                  {
                    "label": "generation",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "Worker hoàn thành",
                "description": "Trả ID tài liệu trong index 2.",
                "activeNodeIds": [
                  "worker"
                ],
                "values": [
                  {
                    "label": "request",
                    "value": "7"
                  },
                  {
                    "label": "generation",
                    "value": "2"
                  },
                  {
                    "label": "ids",
                    "value": "1, 3"
                  }
                ]
              },
              {
                "title": "Nhận kết quả",
                "description": "Hai khóa khớp nên UI cập nhật.",
                "activeNodeIds": [
                  "render"
                ],
                "values": [
                  {
                    "label": "accepted",
                    "value": "true"
                  },
                  {
                    "label": "current",
                    "value": "7"
                  },
                  {
                    "label": "results",
                    "value": "2"
                  }
                ]
              }
            ]
          },
          {
            "id": "wasm-query-stale",
            "label": "Kết quả về muộn",
            "steps": [
              {
                "title": "Gửi query đầu",
                "description": "Query 7 bắt đầu xử lý.",
                "activeNodeIds": [
                  "ui"
                ],
                "values": [
                  {
                    "label": "query",
                    "value": "rust"
                  },
                  {
                    "label": "request",
                    "value": "7"
                  },
                  {
                    "label": "generation",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "Người dùng sửa input",
                "description": "Tăng ID ngay trước debounce query 8.",
                "activeNodeIds": [
                  "queue"
                ],
                "values": [
                  {
                    "label": "query",
                    "value": "rust async"
                  },
                  {
                    "label": "current",
                    "value": "8"
                  },
                  {
                    "label": "generation",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "Query 7 trả về",
                "description": "Kết quả đúng nhưng thuộc ý định cũ.",
                "activeNodeIds": [
                  "worker"
                ],
                "values": [
                  {
                    "label": "incoming",
                    "value": "7"
                  },
                  {
                    "label": "current",
                    "value": "8"
                  },
                  {
                    "label": "ids",
                    "value": "1, 3"
                  }
                ]
              },
              {
                "title": "Bỏ kết quả cũ",
                "description": "Không cập nhật DOM bằng query 7.",
                "activeNodeIds": [
                  "render"
                ],
                "values": [
                  {
                    "label": "accepted",
                    "value": "false"
                  },
                  {
                    "label": "reason",
                    "value": "request khác"
                  }
                ]
              },
              {
                "title": "Query 8 trả về",
                "description": "Đúng phiên hiện tại nên được hiển thị.",
                "activeNodeIds": [
                  "render"
                ],
                "values": [
                  {
                    "label": "incoming",
                    "value": "8"
                  },
                  {
                    "label": "current",
                    "value": "8"
                  },
                  {
                    "label": "accepted",
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
      "id": "wasm-benchmarking",
      "title": "Đo hiệu năng từ thao tác đến kết quả",
      "description": "Thiết kế phép đo công bằng gồm khởi tạo, copy, xử lý và phản hồi giao diện.",
      "objectives": [
        "Phân biệt cold start và steady state.",
        "Đo đường đi người dùng quan sát.",
        "Giữ benchmark có dữ liệu và điều kiện tái hiện."
      ],
      "sections": [
        {
          "title": "Câu hỏi đo phải cụ thể",
          "text": "Một benchmark hữu ích bắt đầu bằng câu hỏi như người dùng chờ bao lâu từ lúc chọn ảnh đến lúc thấy preview, hoặc giao diện có còn phản hồi trong khi phân tích tệp không. Thời gian vòng lặp Rust chỉ trả lời một phần. Toàn bộ đường đi còn có tải Wasm, compile, init, decode, copy, truyền message và render. Ghi mốc cho từng giai đoạn bằng clock phù hợp và liên kết chúng với cùng request ID. Đừng cộng các đoạn chạy chồng nhau như thể chúng tuần tự; biểu đồ timeline giúp phát hiện đo đếm trùng hoặc bỏ sót thời gian chờ."
        },
        {
          "title": "Cold start khác lần chạy tiếp",
          "text": "Lần đầu thường bao gồm tải tài nguyên và khởi tạo, còn lần sau có cache hoặc instance đã sẵn sàng. Báo riêng hai nhóm thay vì trộn thành một số trung bình khó giải thích. Warm-up có thể làm runtime và cache ổn định hơn, nhưng phải nêu rõ số lần và điều gì bị loại khỏi phép đo. Khi so JavaScript với Rust/Wasm, dùng cùng thuật toán, cùng input và cùng yêu cầu output. Nếu một bên bỏ validation hoặc tính ít hơn, số đo không chứng minh khác biệt của nền tảng. Kiểm tra kết quả đúng trước khi bàn đến tốc độ."
        },
        {
          "title": "Phân bố quan trọng hơn một lần tốt nhất",
          "text": "Trình duyệt có scheduling, tác vụ nền và thay đổi nhiệt độ thiết bị, nên một lần chạy không đủ. Thu nhiều mẫu, báo median và percentile cùng kích thước input, thiết bị và phiên bản browser. Giá trị nhỏ nhất chỉ phản ánh điều kiện thuận lợi nhất. performance.now có clock phù hợp đo khoảng thời gian, nhưng độ phân giải thực tế chịu chính sách môi trường. Tránh benchmark quá ngắn rồi diễn giải chênh lệch nhiễu như cải thiện lớn. Có thể lặp batch để tăng tín hiệu, đồng thời bảo đảm compiler hoặc chương trình không bỏ kết quả chưa được sử dụng."
        },
        {
          "title": "Tối ưu từ giả thuyết rồi đo lại",
          "text": "Nếu copy chiếm phần lớn thời gian, tối ưu vòng lặp nhân số có thể không cải thiện trải nghiệm. Thử gom batch, tái dùng buffer hoặc giảm dữ liệu qua biên giới, rồi đo lại toàn bộ đường đi và peak memory. Nếu main thread bị khóa, chuyển công việc sang worker có thể cải thiện độ phản hồi dù tổng latency tăng một ít. Bài tập tính median theo quy tắc middle-low để có một thống kê xác định. Trong dự án, ghi rõ thuật ngữ và cách tính percentile, lưu raw samples và so trước/sau cùng điều kiện. Đừng công bố một tỷ lệ nhanh hơn mà không gắn nó với workload đã kiểm tra."
        }
      ],
      "tip": "Tối ưu cần trả lời một giả thuyết có số đo, chẳng hạn chi phí copy hay main-thread blocking.",
      "exercise": {
        "title": "Median xác định của mẫu latency",
        "instructions": "Sắp xếp mẫu và trả phần tử giữa thấp hơn khi số mẫu chẵn; danh sách rỗng trả None.",
        "requirements": [
          "Không sửa input.",
          "Một mẫu trả chính nó.",
          "Mẫu lẻ và chẵn dùng quy tắc được mô tả."
        ]
      },
      "expectedOutput": "Median được tính theo quy tắc công bố",
      "hints": [
        "Clone mẫu trước khi sort.",
        "Index (len-1)/2 cho middle-low."
      ],
      "quiz": {
        "question": "Rust loop nhanh hơn nhưng thao tác chọn ảnh đến preview vẫn chậm như cũ. Bước nào hợp lý?",
        "options": [
          "Bỏ mọi validation.",
          "Khẳng định browser bị lỗi.",
          "Đo decode/copy/message/render và xác định bottleneck."
        ],
        "correct": 2,
        "explanation": "Tổng latency gồm nhiều giai đoạn. Cần đo phần chiếm thời gian thay vì chỉ tối ưu vòng lặp đã nhanh."
      },
      "reference": {
        "label": "MDN performance.now",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Performance/now"
      },
      "moduleId": "track-wasm",
      "duration": 35,
      "starterCode": "\nfn median_low(samples: &[u64]) -> Option<u64> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(median_low(&[9,1,3]), Some(3));\n    assert_eq!(median_low(&[9,1,3,7]), Some(3));\n    assert_eq!(median_low(&[12]), Some(12));\n    assert_eq!(median_low(&[]), None);\n    println!(\"Median được tính theo quy tắc công bố\");\n}",
      "solutionCode": "\nfn median_low(samples: &[u64]) -> Option<u64> {\n    if samples.is_empty() { return None; }\n    let mut sorted = samples.to_vec();\n    sorted.sort_unstable();\n    Some(sorted[(sorted.len() - 1) / 2])\n}\nfn main() {\n    assert_eq!(median_low(&[9,1,3]), Some(3));\n    assert_eq!(median_low(&[9,1,3,7]), Some(3));\n    assert_eq!(median_low(&[12]), Some(12));\n    assert_eq!(median_low(&[]), None);\n    println!(\"Median được tính theo quy tắc công bố\");\n}"
    },
    {
      "id": "wasm-resource-budgets",
      "title": "Ngân sách bộ nhớ và xử lý theo chunk",
      "description": "Giới hạn tổng dữ liệu đang sống và đưa công việc dài thành các bước có thể kiểm soát.",
      "objectives": [
        "Tính peak memory gồm nhiều bản sao.",
        "Đặt giới hạn trước xử lý và cấp phát.",
        "Thiết kế chunk với trạng thái qua ranh giới."
      ],
      "sections": [
        {
          "title": "Bộ nhớ không chỉ nằm trong Rust",
          "text": "Một tệp được đọc thành ArrayBuffer, chuyển vào worker rồi copy vào Wasm có thể tạo nhiều vùng nhớ cùng tồn tại. Output cũng có thể được copy sang JavaScript trước khi vùng Rust được giải phóng. Vì vậy input 20 MiB không đồng nghĩa ứng dụng chỉ cần 20 MiB. Ghi sơ đồ các vùng đang sống theo thời điểm và đặt ngân sách tổng có phần dự phòng. Browser và thiết bị có giới hạn khác nhau; không dùng một kết quả trên máy desktop nhiều RAM để hứa hỗ trợ mọi điện thoại. Khi vượt ngân sách, từ chối sớm với thông báo cụ thể tốt hơn đợi cấp phát thất bại."
        },
        {
          "title": "Chunk phải giữ đúng ý nghĩa dữ liệu",
          "text": "Chia một tệp thành từng khối byte không bảo đảm ranh giới khối trùng ranh giới ký tự hoặc bản ghi. UTF-8 có thể bị cắt giữa nhiều byte; một dòng CSV có thể nối qua hai chunk. Dùng decoder streaming giữ trạng thái ký tự và parser giữ phần record chưa hoàn chỉnh. Nếu định dạng có quote và newline bên trong trường, parser cần trạng thái tương ứng; split dòng đơn giản chỉ đúng cho định dạng hạn chế đã công bố. Giới hạn phần pending để dữ liệu không có delimiter không làm bộ nhớ tăng vô hạn qua nhiều chunk nhỏ."
        },
        {
          "title": "Backpressure và hủy ở mức giao thức",
          "text": "Nếu main thread gửi hàng trăm chunk mà không chờ worker, queue có thể giữ nhiều dữ liệu dù mỗi chunk nhỏ. Thiết kế tối đa một hoặc vài chunk đang bay, có acknowledgement trước khi gửi tiếp, hoặc để worker tự đọc stream của File. Trong worker, một vòng tính toán đồng bộ kéo dài vẫn chặn event loop của chính worker. Muốn nhận tín hiệu hủy giữa các phần, cần nhường quyền ở ranh giới phù hợp hoặc dùng cơ chế đồng bộ riêng. Hủy bằng terminate có tác động mạnh: instance và dữ liệu trong worker mất, vì vậy ứng dụng phải biết khởi tạo lại và không hiển thị output dở dang."
        },
        {
          "title": "Kiểm thử giới hạn và trạng thái cuối",
          "text": "Dùng input đúng ngưỡng, vượt một byte, record kéo dài qua nhiều chunk và UTF-8 bị chia ở mọi vị trí để kiểm tra. So kết quả xử lý toàn bộ với kết quả chia chunk theo nhiều kích thước; đây là một thuộc tính mạnh hơn vài fixture cố định. Bài tập tích lũy pending line với giới hạn trước khi nối; newline hoàn tất record và reset phần dư. Dự án báo cáo sẽ mở rộng ý tưởng này để cộng dữ liệu theo category và chỉ công bố báo cáo khi finish thành công. Đo peak memory trên browser thật và ghi lại giới hạn, vì unit test Rust không quan sát mọi bản sao phía host."
        }
      ],
      "tip": "Chunk nhỏ không tự làm RAM có giới hạn nếu queue hoặc pending record vẫn tăng không kiểm soát.",
      "exercise": {
        "title": "Tách dòng qua các chunk",
        "instructions": "Ghép các chunk, thu dòng hoàn chỉnh khi gặp newline; pending tối đa limit byte. Từ chối trước khi đẩy byte vượt giới hạn; giữ phần cuối không newline.",
        "requirements": [
          "Ranh giới chunk không tạo dòng giả.",
          "Dòng rỗng được giữ.",
          "Không dùng UTF-8 trong lõi bytes này."
        ]
      },
      "expectedOutput": "Ranh giới chunk không làm sai bản ghi",
      "hints": [
        "Giữ pending qua tất cả chunk.",
        "mem::take chuyển dòng hoàn tất ra mà không clone."
      ],
      "quiz": {
        "question": "Mỗi chunk chỉ 64 KiB nhưng producer gửi vô hạn không chờ worker. Điều gì còn thiếu?",
        "options": [
          "Chỉ thêm Vec capacity.",
          "Thay mọi u32 bằng u64.",
          "Giới hạn số chunk đang bay và backpressure."
        ],
        "correct": 2,
        "explanation": "Queue giữ nhiều chunk vẫn có thể dùng RAM rất lớn. Cần giới hạn tổng dữ liệu đang chờ, không chỉ kích thước từng chunk."
      },
      "reference": {
        "label": "MDN Streams API",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Streams_API"
      },
      "moduleId": "track-wasm",
      "duration": 35,
      "starterCode": "\nfn split_chunks(chunks: &[&[u8]], limit: usize) -> Result<(Vec<Vec<u8>>, Vec<u8>), &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(split_chunks(&[b\"a\", b\"b\\nc\", b\"\\nlast\"], 4), Ok((vec![b\"ab\".to_vec(),b\"c\".to_vec()],b\"last\".to_vec())));\n    assert_eq!(split_chunks(&[b\"\\n\"], 0), Ok((vec![vec![]],vec![])));\n    assert_eq!(split_chunks(&[b\"abc\",b\"d\"], 3), Err(\"record\"));\n    assert_eq!(split_chunks(&[], 3), Ok((vec![],vec![])));\n    println!(\"Ranh giới chunk không làm sai bản ghi\");\n}",
      "solutionCode": "\nfn split_chunks(chunks: &[&[u8]], limit: usize) -> Result<(Vec<Vec<u8>>, Vec<u8>), &'static str> {\n    let mut lines = Vec::new();\n    let mut pending = Vec::new();\n    for chunk in chunks {\n        for &byte in *chunk {\n            if byte == b'\\n' { lines.push(std::mem::take(&mut pending)); }\n            else {\n                if pending.len() >= limit { return Err(\"record\"); }\n                pending.push(byte);\n            }\n        }\n    }\n    Ok((lines, pending))\n}\nfn main() {\n    assert_eq!(split_chunks(&[b\"a\", b\"b\\nc\", b\"\\nlast\"], 4), Ok((vec![b\"ab\".to_vec(),b\"c\".to_vec()],b\"last\".to_vec())));\n    assert_eq!(split_chunks(&[b\"\\n\"], 0), Ok((vec![vec![]],vec![])));\n    assert_eq!(split_chunks(&[b\"abc\",b\"d\"], 3), Err(\"record\"));\n    assert_eq!(split_chunks(&[], 3), Ok((vec![],vec![])));\n    println!(\"Ranh giới chunk không làm sai bản ghi\");\n}"
    },
    {
      "id": "wasm-browser-testing",
      "title": "Kiểm thử native, Wasm và hành vi trình duyệt",
      "description": "Chọn từng lớp kiểm thử theo rủi ro: thuật toán, binding, worker và tương tác thực tế.",
      "objectives": [
        "Phân biệt bằng chứng của ba môi trường test.",
        "Kiểm tra dữ liệu qua binding thật.",
        "Nghiệm thu loading, hủy, lỗi và accessibility của ứng dụng."
      ],
      "sections": [
        {
          "title": "Mỗi lớp trả lời một câu hỏi khác nhau",
          "text": "Unit test native nhanh, thích hợp kiểm tra thuật toán, parser và invariant trên nhiều input. Nhưng nó không chạy JavaScript glue, memory model của Wasm hay DOM. Test bằng wasm-bindgen-test thực thi binary Wasm trong host được cấu hình, giúp phát hiện lỗi export và chuyển đổi giá trị. Browser integration test thêm tải tài nguyên, worker, sự kiện UI và rendering. Một dấu xanh của cargo test trên Mac không thay thế hai lớp còn lại. Viết bảng rủi ro và gắn mỗi rủi ro với lớp test phù hợp để không chạy nhiều test giống nhau mà vẫn bỏ sót lỗi đường dẫn worker."
        },
        {
          "title": "Kiểm tra biên giới bằng dữ liệu thật",
          "text": "Binding test nên gọi wrapper export với input hợp lệ và không hợp lệ, kiểm tra output bytes hoặc lỗi như JavaScript quan sát. Kiểm tra số lớn, Unicode, buffer rỗng và giới hạn kích thước khi API có hỗ trợ. Với wasm-bindgen-test, chọn Node cho logic không cần DOM hoặc browser cho API phụ thuộc môi trường đó. Phiên bản runner cần khớp toolchain bindgen của dự án. Đừng đánh dấu test Wasm đã đạt khi lệnh chỉ biên dịch target mà chưa thực thi runner. Lưu câu lệnh và số test chạy để bằng chứng không bị nhầm giữa build và test."
        },
        {
          "title": "UI cần tình huống cạnh tranh và thất bại",
          "text": "Kiểm tra trạng thái trước init, init bị lỗi, người dùng bấm nhiều lần, đổi input giữa công việc và hủy. Cố tình trả kết quả cũ sau kết quả mới để xem UI có lọc request ID hay không. Khi báo lỗi, nút cần trở lại trạng thái có thể dùng; focus và nội dung trạng thái phải giúp người dùng hiểu chuyện gì xảy ra. Một worker thất bại không nên để màn hình kẹt ở loading. Các thông báo tiến độ thường cần aria-live ở mức phù hợp, còn nút hủy phải có nhãn rõ và vẫn hoạt động khi tác vụ nền đang chạy."
        },
        {
          "title": "Bằng chứng hoàn thành và phần chưa đo",
          "text": "Bản bàn giao nên gồm output unit test, test Wasm đã thực thi, kịch bản browser và ảnh hoặc recording của các trạng thái chính. Với hiệu năng, lưu raw samples cùng browser và thiết bị; với memory, ghi cách đo và giới hạn công cụ. Bài tập xác định một trường hợp có đủ các lớp kiểm chứng bắt buộc hay không. Đây là mô hình của checklist bằng chứng, không phải chứng chỉ năng lực. Một dự án có thể phù hợp demo nhưng chưa phù hợp dữ liệu lớn hoặc môi trường nhiều browser; hãy ghi rõ những mục còn thiếu để reviewer quyết định bước thử tiếp theo thay vì suy đoán từ số lượng bài học."
        }
      ],
      "tip": "Build target Wasm thành công và test Wasm đã chạy là hai bằng chứng khác nhau.",
      "exercise": {
        "title": "Đủ bằng chứng cho ranh giới cần kiểm thử",
        "instructions": "Nhận tập test đã chạy; yêu cầu core và binding luôn có, browser cần thêm khi dùng worker hoặc DOM.",
        "requirements": [
          "Không dùng số lượng test thay cho tên lớp.",
          "Bản thuần logic không bắt buộc browser theo mô hình này.",
          "Worker luôn cần browser."
        ]
      },
      "expectedOutput": "Bằng chứng khớp ranh giới của ứng dụng",
      "hints": [
        "contains theo tên lớp kiểm thử.",
        "browser_features làm phát sinh điều kiện thứ ba."
      ],
      "quiz": {
        "question": "cargo test native đạt có chứng minh đường dẫn worker và tải .wasm trên web đúng không?",
        "options": [
          "Có vì Rust đã kiểm tra types.",
          "Không; cần kiểm tra binding/runtime và browser tương ứng.",
          "Có nếu test nhiều hơn 100."
        ],
        "correct": 1,
        "explanation": "Native tests không tải JavaScript, worker hay network artifact của browser. Số test không thay đổi phạm vi thực thi đó."
      },
      "reference": {
        "label": "wasm-bindgen-test usage",
        "url": "https://wasm-bindgen.github.io/wasm-bindgen/wasm-bindgen-test/usage.html"
      },
      "moduleId": "track-wasm",
      "duration": 35,
      "starterCode": "use std::collections::BTreeSet;\nfn evidence(tests: &BTreeSet<&str>, browser_features: bool) -> bool {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    let basic = BTreeSet::from([\"core\",\"binding\"]);\n    assert!(evidence(&basic,false));\n    assert!(!evidence(&basic,true));\n    assert!(evidence(&BTreeSet::from([\"core\",\"binding\",\"browser\"]),true));\n    assert!(!evidence(&BTreeSet::from([\"browser\"]),true));\n    println!(\"Bằng chứng khớp ranh giới của ứng dụng\");\n}",
      "solutionCode": "use std::collections::BTreeSet;\nfn evidence(tests: &BTreeSet<&str>, browser_features: bool) -> bool {\n    tests.contains(\"core\") && tests.contains(\"binding\")\n        && (!browser_features || tests.contains(\"browser\"))\n}\nfn main() {\n    let basic = BTreeSet::from([\"core\",\"binding\"]);\n    assert!(evidence(&basic,false));\n    assert!(!evidence(&basic,true));\n    assert!(evidence(&BTreeSet::from([\"core\",\"binding\",\"browser\"]),true));\n    assert!(!evidence(&BTreeSet::from([\"browser\"]),true));\n    println!(\"Bằng chứng khớp ranh giới của ứng dụng\");\n}"
    },
    {
      "id": "wasm-image-project",
      "title": "Dự án: Pixelkit xử lý ảnh ngay trong trình duyệt",
      "description": "Ghép lõi RGBA Rust, wasm-bindgen và canvas thành một công cụ có giới hạn rõ.",
      "duration": 100,
      "objectives": [
        "Viết export bytes/Result có test native và Wasm.",
        "Giữ alpha, layout và ngân sách pixels.",
        "Quản lý decode ảnh và kết quả cũ ở UI."
      ],
      "sections": [
        {
          "title": "Sản phẩm nhỏ với hợp đồng đầy đủ",
          "text": "Pixelkit cho phép chọn ảnh hoặc tạo mẫu, chuyển sang grayscale và hiển thị trên canvas. Hợp đồng Rust nhận RGBA liên tục, width và height; trả buffer mới cùng kích thước, giữ alpha. Giới hạn hai triệu pixel và tệp đầu vào tám MiB tạo phạm vi demo có thể kiểm tra. Thuật toán dùng trọng số nguyên trên sRGB bytes, phù hợp mục tiêu học binding và buffer; nó không thay thế pipeline màu chuyên nghiệp. Tách điều đã hỗ trợ khỏi điều cần mở rộng giúp người học biết mình đang nghiệm thu thành phần nào của một sản phẩm xử lý ảnh thực tế."
        },
        {
          "title": "Đọc luồng dữ liệu từ UI vào Rust",
          "text": "JavaScript await init, sau đó bật input. createImageBitmap decode tệp, canvas cung cấp ImageData và adapter tạo Uint8Array từ dữ liệu RGBA. Export grayscale gọi grayscale_core, đổi lỗi thành JsValue và trả Vec bytes qua binding. Lõi kiểm tra zero, checked multiplication, budget và chiều dài trước khi clone buffer. Vòng chunks_exact_mut xử lý từng pixel và không thay alpha. Ở chiều trả về, JavaScript tạo Uint8ClampedArray cho ImageData rồi vẽ kết quả. Mỗi bước có kiểu dữ liệu và lifetime riêng; hãy vẽ lại các vùng nhớ thay vì gọi toàn bộ đường đi là zero-copy."
        },
        {
          "title": "Lỗi và tài nguyên trong thao tác thật",
          "text": "Chọn file mới trong lúc file cũ đang decode có thể khiến kết quả cũ hoàn thành muộn. Generation ở adapter giúp bỏ decode không còn phù hợp, còn finally đóng ImageBitmap dù thành công hay lỗi. Nút mẫu cũng tăng generation để nó không bị một file đang đọc ghi đè. Kiểm tra dung lượng tệp trước decode và pixel sau decode; lưu ý bước decode vẫn có thể cấp phát trước khi biết kích thước. Baseline chưa chuyển vòng xử lý sang worker, nên nghiệm thu cần đo phản hồi main thread trong phạm vi ảnh đã công bố và dùng bài worker khi tăng workload."
        },
        {
          "title": "Tự triển khai phần mở rộng",
          "text": "Chạy cargo test và wasm-pack test để kiểm tra màu cơ bản, alpha và lỗi buffer, rồi build package web và mở trang qua HTTP. Thử ảnh trong suốt, file không phải ảnh, chọn hai file liên tiếp và URL module lỗi. Bài tập trên web tính grayscale cho một pixel để đối chiếu trọng số và alpha. Sau baseline, thêm threshold hoặc crop bằng API rõ ràng, test trường hợp biên trước khi nối UI. Bàn giao cần có source, package build, ảnh fixture và kịch bản browser có kết quả; một ảnh chụp demo đẹp không chứng minh các đường lỗi hoặc giới hạn bộ nhớ đã được xử lý."
        }
      ],
      "tip": "Kiểm thử trọng số trên vài pixel xác định trước khi đánh giá bằng mắt một ảnh lớn.",
      "exercise": {
        "title": "Grayscale giữ alpha",
        "instructions": "Tính y=(77R+150G+29B)>>8, trả [y,y,y,A]. Dùng u32 cho phép tính trung gian.",
        "requirements": [
          "Không tràn u8 khi nhân.",
          "Giữ alpha nguyên vẹn.",
          "Trắng vẫn là 255."
        ]
      },
      "expectedOutput": "Grayscale đổi màu và giữ alpha",
      "hints": [
        "Chuyển kênh sang u32 trước nhân.",
        "Tổng trọng số bằng 256."
      ],
      "quiz": {
        "question": "Vì sao vẫn cần kiểm tra pixel ở Rust dù UI đã giới hạn file 8 MiB?",
        "options": [
          "Dung lượng nén không quyết định kích thước RGBA và export có thể được gọi từ nơi khác.",
          "Không cần vì browser kiểm tra hộ.",
          "Chỉ để tăng thời gian chạy."
        ],
        "correct": 0,
        "explanation": "File nhỏ có thể decode thành ảnh lớn. Validation tại ranh giới Rust bảo vệ invariant buffer và ngân sách của API."
      },
      "reference": {
        "label": "wasm-bindgen boxed slices",
        "url": "https://wasm-bindgen.github.io/wasm-bindgen/reference/types/boxed-slices.html"
      },
      "localLab": {
        "title": "Pixelkit: ảnh grayscale từ Rust chạy trong browser",
        "instructions": "Tạo tệp, chạy test native và Wasm, build target web rồi phục vụ thư mục bằng HTTP. Mở /web/ để chọn ảnh nhỏ; UI dùng canvas tạo RGBA và gọi export Rust. Giới hạn 2 triệu pixel, giữ alpha. Đây là grayscale theo trọng số trên sRGB bytes cho bài lab, không phải pipeline color management đầy đủ.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"pixelkit\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[lib]\ncrate-type = [\"cdylib\", \"rlib\"]\n\n[target.'cfg(target_arch = \"wasm32\")'.dependencies]\nwasm-bindgen = \"=0.2.129\"\n\n[target.'cfg(target_arch = \"wasm32\")'.dev-dependencies]\nwasm-bindgen-test = \"=0.3.79\"\n\n[package.metadata.wasm-pack.profile.release]\nwasm-opt = false\n"
          },
          {
            "path": "src/lib.rs",
            "content": "pub const MAX_PIXELS: usize = 2_000_000;\npub fn grayscale_core(input: &[u8], width: u32, height: u32) -> Result<Vec<u8>, &'static str> {\n    if width == 0 || height == 0 { return Err(\"empty_dimensions\"); }\n    let pixels = (width as usize).checked_mul(height as usize).ok_or(\"size_overflow\")?;\n    if pixels > MAX_PIXELS { return Err(\"pixel_budget\"); }\n    let expected = pixels.checked_mul(4).ok_or(\"size_overflow\")?;\n    if input.len() != expected { return Err(\"buffer_length\"); }\n    let mut output = input.to_vec();\n    for pixel in output.chunks_exact_mut(4) {\n        let y = ((u32::from(pixel[0]) * 77 + u32::from(pixel[1]) * 150 + u32::from(pixel[2]) * 29) >> 8) as u8;\n        pixel[0] = y; pixel[1] = y; pixel[2] = y;\n    }\n    Ok(output)\n}\n#[cfg(target_arch = \"wasm32\")]\nuse wasm_bindgen::prelude::*;\n#[cfg(target_arch = \"wasm32\")]\n#[wasm_bindgen]\npub fn grayscale(input: &[u8], width: u32, height: u32) -> Result<Vec<u8>, JsValue> {\n    grayscale_core(input,width,height).map_err(JsValue::from_str)\n}\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn colors_and_alpha() {\n        let input=[255,0,0,12,0,255,0,0,0,0,255,255,255,255,255,128];\n        assert_eq!(grayscale_core(&input,4,1).unwrap(),vec![76,76,76,12,149,149,149,0,28,28,28,255,255,255,255,128]);\n        assert_eq!(input[0],255);\n    }\n    #[test]\n    fn boundaries() {\n        assert_eq!(grayscale_core(&[],0,1),Err(\"empty_dimensions\"));\n        assert_eq!(grayscale_core(&[1,2,3],1,1),Err(\"buffer_length\"));\n        assert_eq!(grayscale_core(&[1,2,3,4,5],1,1),Err(\"buffer_length\"));\n        assert_eq!(grayscale_core(&[],2_000_001,1),Err(\"pixel_budget\"));\n    }\n}\n"
          },
          {
            "path": "tests/wasm.rs",
            "content": "#![cfg(target_arch = \"wasm32\")]\nuse wasm_bindgen_test::*;\n#[wasm_bindgen_test]\nfn export_converts_bytes_and_errors() {\n    assert_eq!(pixelkit::grayscale(&[255,255,255,7],1,1).unwrap(),vec![255,255,255,7]);\n    assert!(pixelkit::grayscale(&[1],1,1).is_err());\n}\n"
          },
          {
            "path": "web/index.html",
            "content": "<!doctype html><html lang=\"vi\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width\"><title>Pixelkit</title>\n<style>body{font:16px/1.5 system-ui;margin:24px;max-width:800px;color:#171717}button,input{font:inherit;margin:8px 0}canvas{max-width:100%;border:1px solid #ddd}button{padding:8px 14px}#status{min-height:24px}</style>\n<h1>Ảnh grayscale</h1><label>Ảnh tối đa 2 triệu pixel <input id=\"file\" type=\"file\" accept=\"image/*\" disabled></label>\n<button id=\"sample\" disabled>Dùng ảnh mẫu</button><p id=\"status\" role=\"status\" aria-live=\"polite\">Đang tải bộ xử lý…</p><canvas id=\"canvas\" aria-label=\"Ảnh sau xử lý\"></canvas>\n<script type=\"module\" src=\"./main.js\"></script></html>\n"
          },
          {
            "path": "web/main.js",
            "content": "import init, { grayscale } from \"./pkg/pixelkit.js\";\nconst file = document.querySelector(\"#file\");\nconst sample = document.querySelector(\"#sample\");\nconst status = document.querySelector(\"#status\");\nconst canvas = document.querySelector(\"#canvas\");\nconst context = canvas.getContext(\"2d\");\nlet generation = 0;\nfunction show(input, width, height) {\n  const output = grayscale(input, width, height);\n  canvas.width = width; canvas.height = height;\n  context.putImageData(new ImageData(new Uint8ClampedArray(output), width, height), 0, 0);\n  status.textContent = \"Đã xử lý \" + width + \" × \" + height + \" pixel.\";\n}\ntry { await init(); file.disabled = false; sample.disabled = false; status.textContent = \"Chọn ảnh hoặc dùng ảnh mẫu.\"; }\ncatch (error) { status.textContent = \"Không tải được bộ xử lý: \" + String(error); }\nsample.onclick = () => {\n  generation++;\n  try {\n    const width=160, height=80, bytes=new Uint8Array(width*height*4);\n    for(let i=0;i<bytes.length;i+=4){bytes[i]=i/4%width;bytes[i+1]=180;bytes[i+2]=80;bytes[i+3]=255;}\n    show(bytes,width,height);\n  } catch(error){status.textContent=String(error);}\n};\nfile.onchange = async () => {\n  const selected=file.files[0]; if(!selected)return;\n  const id=++generation; let bitmap;\n  status.textContent=\"Đang đọc ảnh…\";\n  try {\n    if(selected.size>8*1024*1024)throw new Error(\"Tệp vượt 8 MiB.\");\n    bitmap=await createImageBitmap(selected);\n    if(id!==generation)return;\n    if(bitmap.width*bitmap.height>2_000_000)throw new Error(\"Ảnh vượt 2 triệu pixel.\");\n    canvas.width=bitmap.width;canvas.height=bitmap.height;\n    context.drawImage(bitmap,0,0);\n    const input=context.getImageData(0,0,bitmap.width,bitmap.height);\n    show(new Uint8Array(input.data.buffer),bitmap.width,bitmap.height);\n  } catch(error){if(id===generation)status.textContent=\"Không xử lý được ảnh: \"+String(error);}\n  finally { bitmap?.close(); }\n};\n"
          },
          {
            "path": "README.md",
            "content": "# Pixelkit\nrustup target add wasm32-unknown-unknown\ncargo test\nwasm-pack test --node\nwasm-pack build --target web --out-dir web/pkg\npython3 -m http.server 8080\nMở http://localhost:8080/web/\n\nDùng ảnh mẫu, sau đó ảnh có alpha và tệp không phải ảnh. Test Rust kiểm tra alpha, màu cơ bản, buffer thiếu/thừa và budget. Test Wasm thực thi export bytes/Err. Browser cần kiểm tra init lỗi, chọn nhanh hai file, kích thước hiển thị và giải phóng bitmap.\n\nGiới hạn file 8 MiB, pixel 2 triệu. Decode ảnh vẫn có thể cấp phát trước khi biết kích thước; ứng dụng sản phẩm cần cân nhắc bộ giải mã/giới hạn phù hợp. Baseline chạy Rust đồng bộ trên main thread cho ảnh nhỏ; bài worker hướng dẫn chuyển tác vụ lớn ra nền. Không kết luận hiệu năng hoặc độ bền browser chỉ từ cargo test.\n"
          }
        ],
        "commands": [
          "cargo test",
          "wasm-pack test --node",
          "wasm-pack build --target web --out-dir web/pkg",
          "python3 -m http.server 8080"
        ],
        "checks": [
          "Native và Wasm test giữ alpha và từ chối buffer sai.",
          "Browser ảnh mẫu và ảnh có alpha hiển thị đúng.",
          "Input quá giới hạn có thông báo, UI không kẹt loading.",
          "Không nhận kết quả decode của file cũ sau file mới."
        ]
      },
      "moduleId": "track-wasm",
      "starterCode": "\nfn gray(pixel: [u8; 4]) -> [u8; 4] {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(gray([255,0,0,12]), [76,76,76,12]);\n    assert_eq!(gray([0,255,0,0]), [149,149,149,0]);\n    assert_eq!(gray([255,255,255,255]), [255,255,255,255]);\n    assert_eq!(gray([0,0,0,3]), [0,0,0,3]);\n    println!(\"Grayscale đổi màu và giữ alpha\");\n}",
      "solutionCode": "\nfn gray(pixel: [u8; 4]) -> [u8; 4] {\n    let y = ((u32::from(pixel[0]) * 77 + u32::from(pixel[1]) * 150 + u32::from(pixel[2]) * 29) >> 8) as u8;\n    [y, y, y, pixel[3]]\n}\nfn main() {\n    assert_eq!(gray([255,0,0,12]), [76,76,76,12]);\n    assert_eq!(gray([0,255,0,0]), [149,149,149,0]);\n    assert_eq!(gray([255,255,255,255]), [255,255,255,255]);\n    assert_eq!(gray([0,0,0,3]), [0,0,0,3]);\n    println!(\"Grayscale đổi màu và giữ alpha\");\n}"
    },
    {
      "id": "wasm-search-project",
      "title": "Dự án: tìm kiếm tài liệu bằng index Rust trong worker",
      "description": "Xây ứng dụng tìm kiếm có dataset, request ID, vòng đời index và kết quả không bị lỗi thời.",
      "duration": 120,
      "objectives": [
        "Tạo đối tượng Rust qua wasm-bindgen và quản lý free.",
        "Chạy module worker thật với giao thức message.",
        "Kiểm tra query, dataset và trạng thái lỗi của UI."
      ],
      "sections": [
        {
          "title": "Nhu cầu và phạm vi tìm kiếm",
          "text": "Một trang tài liệu nội bộ cần tìm nhanh trong tập văn bản đã có ở phía người dùng. Search-index nhận mỗi dòng gồm ID và nội dung, tạo index trong worker rồi trả danh sách ID phù hợp truy vấn. Baseline tìm mọi term dưới dạng substring sau lowercase, không có stemming, chuẩn hóa Unicode hay xếp hạng ngôn ngữ. Mô tả đúng giới hạn này giúp tránh nhầm một phép contains với hệ tìm kiếm hoàn chỉnh. Dữ liệu tối đa một MiB, mười nghìn tài liệu và bốn KiB mỗi dòng; query giới hạn 256 byte và tối đa 20 kết quả."
        },
        {
          "title": "Lõi và wrapper đối tượng",
          "text": "IndexCore giữ các tài liệu đã lowercase, kiểm tra ID duy nhất rồi sắp theo ID để kết quả ổn định. Query tách từ theo whitespace, yêu cầu mọi term xuất hiện và lấy tối đa limit. Wrapper SearchIndex export constructor và phương thức query bằng wasm-bindgen. Nó sở hữu IndexCore trong linear memory; JavaScript phải free đối tượng khi thay index trong cùng instance, hoặc kết thúc worker khi bỏ toàn bộ instance. Test native tập trung semantics truy vấn và lỗi dữ liệu; test Wasm tạo đối tượng export, gọi query rồi kiểm tra lỗi limit. Đây là hai lớp kiểm chứng khác nhau."
        },
        {
          "title": "Giao thức giữ UI nhất quán",
          "text": "Worker nhận load và query, trả ready, result hoặc error kèm request ID và version dataset. UI tăng request ngay khi input thay đổi, trước cả debounce, để kết quả cũ không được chấp nhận trong khoảng chờ gửi query mới. Khi tạo lại index, UI terminate worker cũ, tăng version và xóa kết quả trước đó. Nội dung được hiển thị bằng textContent để dữ liệu tài liệu không trở thành markup thực thi. Worker không được sửa DOM; nó chỉ gửi IDs. Main thread dùng map của dataset hiện tại để render, và chỉ nhận message đúng version cùng request mới nhất."
        },
        {
          "title": "Nhiệm vụ độc lập và đo lường",
          "text": "Chạy source mẫu, gõ nhanh nhiều truy vấn rồi thay dataset. Thử ID trùng, dòng hỏng, query rỗng và URL worker lỗi; mọi trường hợp phải cho UI một trạng thái có thể hiểu và thử lại. Bài tập trình duyệt lọc danh sách tài liệu với all-terms để kiểm chứng semantics trước khi tối ưu. Nhiệm vụ tiếp theo là xây inverted index, chọn ranking có giải thích và so kết quả với baseline. Đo latency theo kích thước dataset, tách thời gian tạo index khỏi query. Nếu hỗ trợ hủy tính toán thật, chứng minh tác vụ cũ ngừng dùng CPU; bỏ result cũ chỉ bảo vệ UI và chưa phải cancellation."
        }
      ],
      "tip": "Tăng request ID ngay khi truy vấn thay đổi, không đợi hết debounce mới làm kết quả cũ lỗi thời.",
      "exercise": {
        "title": "Tìm mọi term trong tài liệu",
        "instructions": "Lowercase Unicode đơn giản; query rỗng trả rỗng; trả ID tài liệu có đủ mọi term theo ID tăng dần.",
        "requirements": [
          "Không thay nội dung tài liệu gốc.",
          "Không phân biệt hoa thường theo to_lowercase.",
          "Giữ semantics substring được công bố."
        ]
      },
      "expectedOutput": "Truy vấn giữ semantics và thứ tự ổn định",
      "hints": [
        "Tạo terms sau khi lowercase query.",
        "all yêu cầu mọi term, còn any chỉ cần một term."
      ],
      "quiz": {
        "question": "Debounce chờ 120 ms mới gửi query mới. Khi nào nên làm result query cũ mất hiệu lực?",
        "options": [
          "Chỉ sau khi query mới hoàn thành.",
          "Không cần nếu dùng worker.",
          "Ngay khi input thay đổi."
        ],
        "correct": 2,
        "explanation": "Trong khoảng debounce, kết quả cũ vẫn có thể về. Tăng request ID ngay giúp nó không ghi đè trạng thái hiện tại."
      },
      "reference": {
        "label": "wasm-bindgen exported Rust types",
        "url": "https://wasm-bindgen.github.io/wasm-bindgen/reference/types/exported-rust-types.html"
      },
      "localLab": {
        "title": "Search-index: tìm kiếm tài liệu trong Web Worker",
        "instructions": "Dự án tạo index Rust từ các dòng id<TAB>nội dung, chạy query trong module worker và lọc kết quả theo request/generation ở UI. Build package web, phục vụ HTTP và mở /web/. Thử đổi dataset khi đang tìm để kiểm tra kết quả cũ không ghi đè phiên mới.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"search-index\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[lib]\ncrate-type = [\"cdylib\", \"rlib\"]\n\n[target.'cfg(target_arch = \"wasm32\")'.dependencies]\nwasm-bindgen = \"=0.2.129\"\n\n[target.'cfg(target_arch = \"wasm32\")'.dev-dependencies]\nwasm-bindgen-test = \"=0.3.79\"\n\n[package.metadata.wasm-pack.profile.release]\nwasm-opt = false\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::collections::BTreeSet;\npub struct IndexCore { docs: Vec<(u32,String)> }\nimpl IndexCore {\n    pub fn new(input:&str)->Result<Self,&'static str> {\n        if input.len()>1024*1024 { return Err(\"dataset_budget\"); }\n        let mut ids=BTreeSet::new();let mut docs=Vec::new();\n        for line in input.lines() {\n            if line.len()>4096 {return Err(\"record_budget\");}\n            let (id,text)=line.split_once('\\t').ok_or(\"record_format\")?;\n            let id:u32=id.parse().map_err(|_|\"id\")?;\n            if !ids.insert(id) {return Err(\"duplicate_id\");}\n            if text.trim().is_empty() {return Err(\"empty_text\");}\n            docs.push((id,text.to_lowercase()));\n            if docs.len()>10000 {return Err(\"document_budget\");}\n        }\n        docs.sort_by_key(|(id,_)|*id);\n        Ok(Self { docs })\n    }\n    pub fn query(&self,query:&str,limit:u32)->Result<Vec<u32>,&'static str> {\n        if !(1..=20).contains(&limit) {return Err(\"limit\");}\n        if query.len()>256 {return Err(\"query_budget\");}\n        let lowered=query.to_lowercase();\n        let terms:Vec<_>=lowered.split_whitespace().collect();\n        if terms.is_empty() {return Ok(Vec::new());}\n        Ok(self.docs.iter().filter(|(_,text)|terms.iter().all(|term|text.contains(term)))\n            .take(limit as usize).map(|(id,_)|*id).collect())\n    }\n}\n#[cfg(target_arch=\"wasm32\")]\nmod bindings {\n    use super::IndexCore;\n    use wasm_bindgen::prelude::*;\n    #[wasm_bindgen]\n    pub struct SearchIndex { inner:IndexCore }\n    #[wasm_bindgen]\n    impl SearchIndex {\n        #[wasm_bindgen(constructor)]\n        pub fn new(input:&str)->Result<SearchIndex,JsValue> {\n            Ok(Self {inner:IndexCore::new(input).map_err(JsValue::from_str)?})\n        }\n        pub fn query(&self,text:&str,limit:u32)->Result<Vec<u32>,JsValue> {\n            self.inner.query(text,limit).map_err(JsValue::from_str)\n        }\n    }\n}\n#[cfg(target_arch=\"wasm32\")]\npub use bindings::SearchIndex;\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn all_terms_unicode_and_order() {\n        let index=IndexCore::new(\"3\\tRust dữ liệu\\n1\\tRUST async\\n2\\tJavaScript\").unwrap();\n        assert_eq!(index.query(\"rust\",20).unwrap(),vec![1,3]);\n        assert_eq!(index.query(\"RUST dữ\",20).unwrap(),vec![3]);\n        assert_eq!(index.query(\"\",20).unwrap(),Vec::<u32>::new());\n        assert_eq!(index.query(\"rust\",1).unwrap(),vec![1]);\n        assert!(index.query(\"rust\",0).is_err());\n    }\n    #[test]\n    fn malformed_dataset() {\n        assert!(IndexCore::new(\"1\\ta\\n1\\tb\").is_err());\n        assert!(IndexCore::new(\"bad\").is_err());\n        assert!(IndexCore::new(\"1\\t \").is_err());\n    }\n}\n"
          },
          {
            "path": "tests/wasm.rs",
            "content": "#![cfg(target_arch=\"wasm32\")]\nuse wasm_bindgen_test::*;\n#[wasm_bindgen_test]\nfn exported_object() {\n    let index=search_index::SearchIndex::new(\"1\\tRust web\\n2\\tRust async\").unwrap();\n    assert_eq!(index.query(\"async\",5).unwrap(),vec![2]);\n    assert!(index.query(\"rust\",0).is_err());\n    assert!(search_index::SearchIndex::new(\"broken\").is_err());\n}\n"
          },
          {
            "path": "web/index.html",
            "content": "<!doctype html><html lang=\"vi\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width\"><title>Search index</title>\n<style>body{font:16px/1.5 system-ui;margin:24px;max-width:800px;color:#171717}textarea{width:100%;height:140px}input,button,textarea{font:inherit;padding:8px;box-sizing:border-box}button{margin:8px 0}#status{min-height:24px}</style>\n<h1>Tìm tài liệu</h1><label>Dữ liệu: ID, tab, nội dung<textarea id=\"data\">1\tRust ownership và borrowing\n2\tRust async với Tokio\n3\tWebAssembly và dữ liệu trình duyệt</textarea></label><button id=\"build\">Tạo index</button>\n<label>Truy vấn <input id=\"query\" disabled placeholder=\"rust async\"></label>\n<p id=\"status\" role=\"status\" aria-live=\"polite\"></p><ol id=\"results\"></ol><script type=\"module\" src=\"./main.js\"></script></html>\n"
          },
          {
            "path": "web/worker.js",
            "content": "import init,{SearchIndex} from \"./pkg/search_index.js\";\nconst ready=init();\nlet index=null,generation=0;\nself.onmessage=async ({data})=>{\n  const {type,id,version}=data;\n  try {\n    await ready;\n    if(type===\"load\"){\n      const next=new SearchIndex(data.text);\n      index?.free();index=next;generation=version;\n      self.postMessage({type:\"ready\",id,version});\n    }else if(type===\"query\"){\n      if(!index||version!==generation)throw new Error(\"index_not_ready\");\n      const ids=Array.from(index.query(data.text,20));\n      self.postMessage({type:\"result\",id,version,ids});\n    }else {throw new Error(\"unknown_message\");}\n  }catch(error){self.postMessage({type:\"error\",id,version,message:String(error)});}\n};\n"
          },
          {
            "path": "web/main.js",
            "content": "const data=document.querySelector(\"#data\"),build=document.querySelector(\"#build\"),query=document.querySelector(\"#query\");\nconst status=document.querySelector(\"#status\"),results=document.querySelector(\"#results\");\nlet worker=null,version=0,request=0,timer=null,documents=new Map();\nfunction clear(){results.replaceChildren();}\nfunction sendQuery(){\n  if(query.disabled||!worker)return;\n  const id=++request;status.textContent=\"Đang tìm…\";\n  worker.postMessage({type:\"query\",id,version,text:query.value});\n}\nfunction load(){\n  clearTimeout(timer);worker?.terminate();version++;request++;query.disabled=true;clear();\n  const text=data.value;const current=version;\n  documents=new Map(text.split(/\\r?\\n/).map(line=>{const i=line.indexOf(\"\\t\");return [Number(line.slice(0,i)),line.slice(i+1)];}));\n  worker=new Worker(new URL(\"./worker.js\",import.meta.url),{type:\"module\"});\n  status.textContent=\"Đang tạo index…\";\n  worker.onmessage=({data:message})=>{\n    if(message.version!==version||current!==version)return;\n    if(message.type===\"ready\"){query.disabled=false;status.textContent=\"Index sẵn sàng.\";sendQuery();}\n    else if(message.id===request&&message.type===\"result\"){\n      clear();for(const id of message.ids){const li=document.createElement(\"li\");li.textContent=documents.get(id)??String(id);results.append(li);}\n      status.textContent=message.ids.length+\" kết quả.\";\n    }else if(message.id===request&&message.type===\"error\"){status.textContent=\"Không xử lý được: \"+message.message;}\n  };\n  worker.onerror=()=>{if(current===version){query.disabled=true;status.textContent=\"Worker lỗi. Nhấn Tạo index để thử lại.\";}};\n  worker.postMessage({type:\"load\",id:request,version,text});\n}\nbuild.onclick=load;\nquery.oninput=()=>{request++;clearTimeout(timer);timer=setTimeout(sendQuery,120);};\nwindow.addEventListener(\"pagehide\",()=>worker?.terminate());\nload();\n"
          },
          {
            "path": "README.md",
            "content": "# Search-index\nrustup target add wasm32-unknown-unknown\ncargo test\nwasm-pack test --node\nwasm-pack build --target web --out-dir web/pkg\npython3 -m http.server 8080\nMở http://localhost:8080/web/\n\nĐịnh dạng: mỗi dòng id u32, tab, nội dung UTF-8. ID duy nhất; tối đa 1 MiB/10000 tài liệu/4096 byte mỗi dòng. Query tối đa 256 byte, limit 1..20. Tìm tất cả term dạng substring, lowercase Unicode đơn giản; không có chuẩn hóa Unicode, stemming hoặc xếp hạng ngôn ngữ.\n\nMỗi lần tạo index thay worker và generation. Query tăng request ID ngay khi input đổi; kết quả cũ bị bỏ. Worker giữ SearchIndex và free trước thay; pagehide terminate. Đây là worker thực, không mô phỏng thread trong Rust.\nTest browser: gõ nhanh, đổi dataset, đưa ID trùng, làm URL Wasm sai và tạo lại. Ghi rõ browser/version và kết quả. Mở rộng: ranking, index đảo, benchmark, hủy tính toán theo chunk. Bỏ kết quả cũ không tự hủy CPU của query đã chạy.\n"
          }
        ],
        "commands": [
          "cargo test",
          "wasm-pack test --node",
          "wasm-pack build --target web --out-dir web/pkg",
          "python3 -m http.server 8080"
        ],
        "checks": [
          "Export object tạo/query/lỗi hoạt động trong Wasm.",
          "Query nhiều term giữ ID ổn định, Unicode và limit đúng.",
          "Gõ nhanh hoặc đổi dataset không bị kết quả cũ ghi đè.",
          "Worker/init lỗi có trạng thái thử lại, không spinner vô hạn."
        ]
      },
      "moduleId": "track-wasm",
      "starterCode": "\nfn search(docs: &[(u32, &str)], query: &str) -> Vec<u32> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    let docs=[(3,\"Rust dữ liệu\"),(1,\"RUST async\"),(2,\"JavaScript\")];\n    assert_eq!(search(&docs,\"rust\"),vec![1,3]);\n    assert_eq!(search(&docs,\"rust async\"),vec![1]);\n    assert_eq!(search(&docs,\"dữ\"),vec![3]);\n    assert!(search(&docs,\" \").is_empty());\n    assert!(search(&docs,\"missing\").is_empty());\n    println!(\"Truy vấn giữ semantics và thứ tự ổn định\");\n}",
      "solutionCode": "\nfn search(docs: &[(u32, &str)], query: &str) -> Vec<u32> {\n    let query = query.to_lowercase();\n    let terms: Vec<_> = query.split_whitespace().collect();\n    if terms.is_empty() { return Vec::new(); }\n    let mut ids: Vec<_> = docs.iter().filter_map(|&(id,text)| {\n        let lowered = text.to_lowercase();\n        terms.iter().all(|term|lowered.contains(term)).then_some(id)\n    }).collect();\n    ids.sort_unstable();\n    ids\n}\nfn main() {\n    let docs=[(3,\"Rust dữ liệu\"),(1,\"RUST async\"),(2,\"JavaScript\")];\n    assert_eq!(search(&docs,\"rust\"),vec![1,3]);\n    assert_eq!(search(&docs,\"rust async\"),vec![1]);\n    assert_eq!(search(&docs,\"dữ\"),vec![3]);\n    assert!(search(&docs,\" \").is_empty());\n    assert!(search(&docs,\"missing\").is_empty());\n    println!(\"Truy vấn giữ semantics và thứ tự ổn định\");\n}"
    },
    {
      "id": "wasm-report-project",
      "title": "Dự án cuối khóa: báo cáo tệp theo chunk trong trình duyệt",
      "description": "Kết hợp streaming UTF-8, worker, Rust stateful, hủy và tải kết quả có phiên bản.",
      "duration": 150,
      "objectives": [
        "Giữ parser qua chunk mà không giữ cả tệp.",
        "Ngăn báo cáo một phần được coi là hoàn chỉnh.",
        "Nghiệm thu binding, UI, memory và artifact cùng nhau."
      ],
      "sections": [
        {
          "title": "Một luồng sản phẩm từ file đến báo cáo",
          "text": "Offline-report nhận bảng category và amount_cents, cộng số tiền theo danh mục rồi tạo báo cáo JSON có thể tải xuống. Dữ liệu dùng cent nguyên để tránh lỗi làm tròn float trong bài toán này. Baseline hỗ trợ CSV hạn chế với đúng hai trường, không quoting hay dấu phẩy trong tên category. Tệp tối đa tám MiB, một trăm nghìn dòng và 32 danh mục. Các giới hạn này làm miền kiểm thử rõ ràng; nếu sản phẩm cần CSV tổng quát, người học phải thay parser và bổ sung fixture quote, newline cùng quy tắc lỗi tương ứng."
        },
        {
          "title": "Bộ nhớ và trạng thái qua từng chunk",
          "text": "Main thread gửi File cho worker, worker đọc stream của file và dùng TextDecoder ở chế độ streaming để giữ ký tự UTF-8 bị chia giữa các khối. Mỗi phần văn bản được đưa vào Report Rust. Report giữ pending record chưa có newline, tổng theo category và trạng thái active, failed hoặc finished. Giới hạn chunk và pending được kiểm tra trước khi nhận thêm dữ liệu. Các tổng dùng checked_add và có budget dòng. Chỉ finish thành công mới serialize Summary; UI không có nút tải cho báo cáo dở dang. Phần lớn logic được kiểm thử native bằng cách chia input ở mọi ranh giới ký tự hợp lệ."
        },
        {
          "title": "Hủy và lỗi không để lại kết quả giả",
          "text": "Khi người dùng hủy hoặc chọn file khác, adapter terminate worker cũ, tăng ID phiên và xóa báo cáo đang hiển thị. Worker mới khởi tạo instance mới, tránh tái sử dụng một Report đã failed. Lỗi parse giữa stream làm đối tượng poisoned; gọi push hoặc finish tiếp đều bị từ chối. Worker giải phóng object Wasm trong finally khi nó kết thúc bình thường hoặc có exception; terminate giải phóng cả ngữ cảnh worker theo vòng đời host. Download tạo Blob URL từ báo cáo hoàn chỉnh và thu hồi URL sau khi dùng. Test cần kiểm tra cả đường hủy và tải lại sau lỗi, không chỉ tổng đúng của mẫu."
        },
        {
          "title": "Điều kiện nghiệm thu cuối khóa",
          "text": "Chạy ba lớp kiểm thử: core native, export trong Wasm và tương tác browser. Bài tập trên web cộng các khoản có thể âm thành tổng theo category, phát hiện overflow mà không để lộ kết quả một phần. Trong dự án, dùng tệp lớn để đo peak memory và độ phản hồi UI, so cold start với các lần sau, thử UTF-8 hỏng và record vượt nhiều chunk. Bản bàn giao cần source, artifact cùng phiên bản, raw benchmark, kịch bản hủy và phạm vi browser hỗ trợ. Rubric là công cụ tự review và đối thoại với reviewer; đạt bài tập không tự chứng minh sẵn sàng xử lý mọi dữ liệu hoặc mọi thiết bị thực tế."
        }
      ],
      "tip": "Không cho tải báo cáo trước finish; lỗi giữa stream phải làm rõ rằng tổng hiện tại chưa hoàn chỉnh.",
      "exercise": {
        "title": "Tổng cent theo danh mục",
        "instructions": "Tạo map tổng i64 theo category; từ chối category rỗng và overflow, cho phép khoản âm.",
        "requirements": [
          "Số tiền nguyên, không float.",
          "Input rỗng trả map rỗng.",
          "Result lỗi không trả map tính dở."
        ]
      },
      "expectedOutput": "Báo cáo cent chỉ trả khi toàn bộ dữ liệu hợp lệ",
      "hints": [
        "Giữ map bên trong hàm, chỉ trả khi vòng lặp hoàn tất.",
        "checked_add hoạt động cả số âm."
      ],
      "quiz": {
        "question": "Parser đã cộng 20 dòng rồi dòng 21 sai. Baseline Report nên cho finish trả tổng 20 dòng không?",
        "options": [
          "Có, cứ gọi đó là báo cáo cuối.",
          "Không; Report failed và không xuất báo cáo hoàn chỉnh.",
          "Tự bỏ dòng 21 mà không báo."
        ],
        "correct": 1,
        "explanation": "Hợp đồng strict cần tránh báo cáo thiếu có vẻ hợp lệ. Poisons state sau lỗi và yêu cầu công việc mới."
      },
      "reference": {
        "label": "MDN TextDecoder streaming",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/decode"
      },
      "localLab": {
        "title": "Offline-report: báo cáo dữ liệu theo chunk trong worker",
        "instructions": "Ứng dụng đọc File.stream trong worker, decode UTF-8 theo chunk, đưa từng phần vào bộ tổng hợp Rust rồi chỉ xuất báo cáo khi finish thành công. Input là CSV hạn chế gồm category,amount_cents; không hỗ trợ quote hoặc dấu phẩy trong category. Có mẫu tải ngay trong trang để tái hiện. Kiểm thử native, Wasm và browser là ba bước riêng.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"offline-report\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[lib]\ncrate-type = [\"cdylib\", \"rlib\"]\n\n[target.'cfg(target_arch = \"wasm32\")'.dependencies]\nwasm-bindgen = \"=0.2.129\"\n\n[target.'cfg(target_arch = \"wasm32\")'.dev-dependencies]\nwasm-bindgen-test = \"=0.3.79\"\n\n[package.metadata.wasm-pack.profile.release]\nwasm-opt = false\n\n[dependencies]\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::collections::BTreeMap;\nuse serde::Serialize;\n#[derive(Debug,Clone,Serialize,PartialEq,Eq)]\npub struct Summary {pub schema_version:u8,pub rows:u64,pub totals_cents:BTreeMap<String,i64>}\npub struct ReportCore {\n    pending:String,totals:BTreeMap<String,i64>,rows:u64,line:u64,header:bool,failed:bool,finished:bool,\n}\nimpl Default for ReportCore {fn default()->Self{Self::new()}}\nimpl ReportCore {\n    pub fn new()->Self{Self{pending:String::new(),totals:BTreeMap::new(),rows:0,line:0,header:false,failed:false,finished:false}}\n    fn record(&mut self,line:&str)->Result<(),String>{\n        self.line+=1;\n        let line=line.strip_suffix('\\r').unwrap_or(line);\n        if line.len()>4096{return Err(format!(\"line {} exceeds record budget\",self.line));}\n        if !self.header {\n            if line!=\"category,amount_cents\"{return Err(\"expected category,amount_cents header\".into());}\n            self.header=true;return Ok(());\n        }\n        let fields:Vec<_>=line.split(',').collect();\n        if fields.len()!=2{return Err(format!(\"line {} needs two fields\",self.line));}\n        let category=fields[0].trim();\n        if category.is_empty()||category.chars().count()>40{return Err(format!(\"line {} category\",self.line));}\n        let amount:i64=fields[1].parse().map_err(|_|format!(\"line {} amount\",self.line))?;\n        if !(-1_000_000_000..=1_000_000_000).contains(&amount){return Err(format!(\"line {} amount range\",self.line));}\n        if self.rows>=100000{return Err(\"row budget\".into());}\n        if !self.totals.contains_key(category)&&self.totals.len()>=32{return Err(\"category budget\".into());}\n        let total=self.totals.get(category).copied().unwrap_or(0).checked_add(amount).ok_or(\"total overflow\")?;\n        self.totals.insert(category.to_owned(),total);self.rows+=1;Ok(())\n    }\n    fn push_inner(&mut self,text:&str)->Result<(),String>{\n        if text.len()>65536{return Err(\"chunk budget\".into());}\n        self.pending.push_str(text);\n        while let Some(position)=self.pending.find('\\n'){\n            let rest=self.pending.split_off(position+1);\n            let mut line=std::mem::replace(&mut self.pending,rest);\n            line.truncate(position);self.record(&line)?;\n        }\n        if self.pending.len()>4096{return Err(\"pending record budget\".into());}\n        Ok(())\n    }\n    pub fn push(&mut self,text:&str)->Result<(),String>{\n        if self.failed||self.finished{return Err(\"report is not active\".into());}\n        let result=self.push_inner(text);if result.is_err(){self.failed=true;}result\n    }\n    pub fn finish(&mut self)->Result<Summary,String>{\n        if self.failed||self.finished{return Err(\"report is not active\".into());}\n        self.finished=true;\n        if !self.pending.is_empty(){\n            let last=std::mem::take(&mut self.pending);\n            if let Err(e)=self.record(&last){self.failed=true;return Err(e);}\n        }\n        if !self.header{return Err(\"missing header\".into());}\n        Ok(Summary{schema_version:1,rows:self.rows,totals_cents:self.totals.clone()})\n    }\n}\n#[cfg(target_arch=\"wasm32\")]\nmod bindings {\n    use super::ReportCore;use wasm_bindgen::prelude::*;\n    #[wasm_bindgen]\n    pub struct Report {inner:ReportCore}\n    #[wasm_bindgen]\n    impl Report {\n        #[wasm_bindgen(constructor)]\n        pub fn new()->Report{Self{inner:ReportCore::new()}}\n        pub fn push(&mut self,text:&str)->Result<(),JsValue>{self.inner.push(text).map_err(|e|JsValue::from_str(&e))}\n        pub fn finish_json(&mut self)->Result<String,JsValue>{\n            let summary=self.inner.finish().map_err(|e|JsValue::from_str(&e))?;\n            serde_json::to_string(&summary).map_err(|e|JsValue::from_str(&e.to_string()))\n        }\n    }\n}\n#[cfg(target_arch=\"wasm32\")]\npub use bindings::Report;\n#[cfg(test)]\nmod tests {\n    use super::*;\n    const DATA:&str=\"category,amount_cents\\nSách,1200\\nĂn uống,800\\nSách,-200\";\n    #[test]\n    fn chunks_match_whole_at_every_character_boundary(){\n        let mut whole=ReportCore::new();whole.push(DATA).unwrap();let expected=whole.finish().unwrap();\n        assert_eq!(expected.rows,3);assert_eq!(expected.totals_cents[\"Sách\"],1000);\n        for split in 0..=DATA.len(){if DATA.is_char_boundary(split){\n            let mut report=ReportCore::new();report.push(&DATA[..split]).unwrap();report.push(&DATA[split..]).unwrap();\n            assert_eq!(report.finish().unwrap(),expected);\n        }}\n    }\n    #[test]\n    fn error_poison_and_finish_once(){\n        let mut report=ReportCore::new();assert!(report.push(\"category,amount_cents\\na,1\\nb,no\\n\").is_err());\n        assert!(report.push(\"b,2\\n\").is_err());assert!(report.finish().is_err());\n        let mut empty=ReportCore::new();empty.push(\"category,amount_cents\\n\").unwrap();\n        assert_eq!(empty.finish().unwrap().rows,0);assert!(empty.finish().is_err());\n    }\n    #[test]\n    fn budgets_and_format(){\n        let mut report=ReportCore::new();assert!(report.push(&\"x\".repeat(65537)).is_err());\n        let mut report=ReportCore::new();report.push(\"category,amount_cents\\n\").unwrap();assert!(report.push(&\"x\".repeat(4097)).is_err());\n        let mut report=ReportCore::new();assert!(report.push(\"category,amount_cents\\na,1,extra\\n\").is_err());\n        let mut report=ReportCore::new();assert!(report.finish().is_err());\n    }\n}\n"
          },
          {
            "path": "tests/wasm.rs",
            "content": "#![cfg(target_arch=\"wasm32\")]\nuse wasm_bindgen_test::*;\n#[wasm_bindgen_test]\nfn object_streaming_and_error(){\n    let mut report=offline_report::Report::new();\n    report.push(\"category,amount_cents\\nSách,\").unwrap();report.push(\"200\\n\").unwrap();\n    let value:serde_json::Value=serde_json::from_str(&report.finish_json().unwrap()).unwrap();\n    assert_eq!(value[\"totals_cents\"][\"Sách\"],200);assert!(report.finish_json().is_err());\n    let mut invalid=offline_report::Report::new();assert!(invalid.push(\"bad\\n\").is_err());\n}\n"
          },
          {
            "path": "web/index.html",
            "content": "<!doctype html><html lang=\"vi\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width\"><title>Offline report</title>\n<style>body{font:16px/1.5 system-ui;max-width:900px;margin:24px;color:#171717}button,input{font:inherit;padding:8px;margin:4px}pre{white-space:pre-wrap;background:#f4f4f4;padding:16px}progress{width:100%}</style>\n<h1>Báo cáo theo danh mục</h1><p>CSV gồm category,amount_cents. Tối đa 8 MiB.</p>\n<label>Chọn CSV <input id=\"file\" type=\"file\" accept=\".csv,text/csv\"></label><button id=\"sample\">Chạy dữ liệu mẫu</button><button id=\"cancel\" disabled>Hủy</button><button id=\"download\" disabled>Tải báo cáo</button>\n<progress id=\"progress\" max=\"100\" value=\"0\" aria-label=\"Tiến độ đọc tệp\"></progress><p id=\"status\" role=\"status\" aria-live=\"polite\">Chọn tệp hoặc chạy mẫu.</p><pre id=\"result\"></pre>\n<script type=\"module\" src=\"./main.js\"></script></html>\n"
          },
          {
            "path": "web/worker.js",
            "content": "import init,{Report} from \"./pkg/offline_report.js\";\nconst ready=init();\nself.onmessage=async ({data})=>{\n  const {id,file}=data;let report=null,reader=null;\n  try{\n    await ready;\n    if(!(file instanceof Blob)||file.size>8*1024*1024)throw new Error(\"file_budget\");\n    report=new Report();reader=file.stream().getReader();\n    const decoder=new TextDecoder(\"utf-8\",{fatal:true});let read=0,last=-1;\n    for(;;){\n      const item=await reader.read();if(item.done)break;\n      read+=item.value.byteLength;\n      for(let offset=0;offset<item.value.length;offset+=16384){\n        const text=decoder.decode(item.value.subarray(offset,offset+16384),{stream:true});\n        report.push(text);\n      }\n      const percent=file.size===0?100:Math.floor(read/file.size*100);\n      if(percent!==last){last=percent;self.postMessage({type:\"progress\",id,percent});}\n    }\n    report.push(decoder.decode());\n    const result=JSON.parse(report.finish_json());\n    self.postMessage({type:\"done\",id,result});\n  }catch(error){self.postMessage({type:\"error\",id,message:String(error)});}\n  finally{if(reader){try{await reader.cancel();}catch{}reader.releaseLock();}report?.free();}\n};\n"
          },
          {
            "path": "web/main.js",
            "content": "const file=document.querySelector(\"#file\"),sample=document.querySelector(\"#sample\"),cancel=document.querySelector(\"#cancel\"),download=document.querySelector(\"#download\");\nconst status=document.querySelector(\"#status\"),progress=document.querySelector(\"#progress\"),result=document.querySelector(\"#result\");\nlet worker=null,id=0,report=null;\nfunction stop(message){\n  id++;worker?.terminate();worker=null;cancel.disabled=true;status.textContent=message;\n}\nfunction run(selected){\n  stop(\"Đang tải bộ xử lý…\");const current=id;report=null;download.disabled=true;progress.value=0;result.textContent=\"\";\n  if(selected.size>8*1024*1024){status.textContent=\"Tệp vượt 8 MiB.\";return;}\n  worker=new Worker(new URL(\"./worker.js\",import.meta.url),{type:\"module\"});cancel.disabled=false;\n  worker.onmessage=({data})=>{\n    if(data.id!==id)return;\n    if(data.type===\"progress\"){progress.value=data.percent;status.textContent=\"Đã đọc \"+data.percent+\"%\";}\n    if(data.type===\"done\"){report=data.result;result.textContent=JSON.stringify(report,null,2);download.disabled=false;progress.value=100;stop(\"Đã hoàn thành \"+report.rows+\" dòng.\");}\n    if(data.type===\"error\"){report=null;stop(\"Không tạo được báo cáo: \"+data.message);}\n  };\n  worker.onerror=()=>{if(current===id)stop(\"Worker lỗi. Chọn tệp để thử lại.\");};\n  worker.postMessage({id:current,file:selected});\n}\nfile.onchange=()=>{if(file.files[0])run(file.files[0]);};\nsample.onclick=()=>run(new File([\"category,amount_cents\\nSách,1200\\nĂn uống,800\\nSách,-200\\n\"],\"sample.csv\",{type:\"text/csv\"}));\ncancel.onclick=()=>{report=null;download.disabled=true;result.textContent=\"\";stop(\"Đã hủy. Có thể chọn tệp khác.\");};\ndownload.onclick=()=>{\n  if(!report)return;\n  const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:\"application/json\"}));\n  const link=document.createElement(\"a\");link.href=url;link.download=\"report.json\";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);\n};\nwindow.addEventListener(\"pagehide\",()=>worker?.terminate());\n"
          },
          {
            "path": "README.md",
            "content": "# Offline-report\nrustup target add wasm32-unknown-unknown\ncargo test\nwasm-pack test --node\nwasm-pack build --target web --out-dir web/pkg\npython3 -m http.server 8080\nMở http://localhost:8080/web/\n\nCSV hạn chế: header category,amount_cents; đúng hai trường, không quoting/dấu phẩy/newline trong category. Category trim, 1..40 ký tự; amount i64 trong ±1 tỉ cent; tối đa 32 category, 100000 record, 4096 byte/record. Số tiền dùng cent nguyên, không float. Tổng tối đa theo giới hạn nằm trong miền số nguyên chính xác của JS.\n\nWorker tự đọc File.stream; TextDecoder streaming bảo toàn UTF-8 qua chunk. Rust giữ pending record và tổng theo category, không giữ cả file. Lỗi làm Report poisoned, chỉ finish thành công mới có JSON. Hủy terminate worker; chọn input mới tạo worker mới. Input/output không gửi network trong source mẫu.\nTest browser: mẫu hợp lệ, sai header/amount/UTF-8, record dài, hủy file lớn, chọn file mới, tải JSON rồi đối chiếu tổng. Memory và browser compatibility phải đo trên thiết bị thật; test native/Node không chứng minh UI hoặc decode performance.\n\nCapstone: thêm định dạng CSV tổng quát bằng parser có kiểm thử nếu sản phẩm cần quote; schema migration, benchmark cold/warm, test worker tự động, khả năng tải lại sau lỗi và báo cáo phạm vi hỗ trợ. Không quảng cáo baseline như hỗ trợ mọi file CSV.\n"
          }
        ],
        "commands": [
          "cargo test",
          "wasm-pack test --node",
          "wasm-pack build --target web --out-dir web/pkg",
          "python3 -m http.server 8080"
        ],
        "checks": [
          "Kết quả chia chunk giống xử lý toàn bộ ở mọi ranh giới ký tự của fixture.",
          "Lỗi giữa stream ngăn finish báo cáo một phần.",
          "Worker hủy và chọn lại input không cập nhật UI bằng kết quả cũ.",
          "Output JSON có schema, cent nguyên và tổng đúng; download chỉ mở sau thành công."
        ]
      },
      "moduleId": "track-wasm",
      "starterCode": "use std::collections::BTreeMap;\nfn summarize(rows: &[(&str, i64)]) -> Result<BTreeMap<String, i64>, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    let totals=summarize(&[(\"Sách\",1200),(\"Ăn\",800),(\"Sách\",-200)]).unwrap();\n    assert_eq!(totals[\"Sách\"],1000);\n    assert_eq!(totals[\"Ăn\"],800);\n    assert_eq!(summarize(&[(\" \",2)]),Err(\"category\"));\n    assert_eq!(summarize(&[(\"a\",i64::MAX),(\"a\",1)]),Err(\"overflow\"));\n    assert!(summarize(&[]).unwrap().is_empty());\n    println!(\"Báo cáo cent chỉ trả khi toàn bộ dữ liệu hợp lệ\");\n}",
      "solutionCode": "use std::collections::BTreeMap;\nfn summarize(rows: &[(&str, i64)]) -> Result<BTreeMap<String, i64>, &'static str> {\n    let mut totals = BTreeMap::new();\n    for &(category, amount) in rows {\n        if category.trim().is_empty() { return Err(\"category\"); }\n        let key = category.trim().to_owned();\n        let current: i64 = totals.get(&key).copied().unwrap_or(0);\n        totals.insert(key, current.checked_add(amount).ok_or(\"overflow\")?);\n    }\n    Ok(totals)\n}\nfn main() {\n    let totals=summarize(&[(\"Sách\",1200),(\"Ăn\",800),(\"Sách\",-200)]).unwrap();\n    assert_eq!(totals[\"Sách\"],1000);\n    assert_eq!(totals[\"Ăn\"],800);\n    assert_eq!(summarize(&[(\" \",2)]),Err(\"category\"));\n    assert_eq!(summarize(&[(\"a\",i64::MAX),(\"a\",1)]),Err(\"overflow\"));\n    assert!(summarize(&[]).unwrap().is_empty());\n    println!(\"Báo cáo cent chỉ trả khi toàn bộ dữ liệu hợp lệ\");\n}"
    }
  ],
  "projects": [
    {
      "id": "wasm-project-pixelkit",
      "title": "Pixelkit: bộ lọc ảnh trong browser",
      "description": "Export RGBA Rust thật, tích hợp canvas, test bytes và lỗi, có giới hạn pixel.",
      "level": "guided",
      "estimatedHours": 9,
      "labLessonId": "wasm-image-project",
      "requirements": [
        "Grayscale đúng layout RGBA và giữ alpha.",
        "Validation zero/overflow/budget/length trước output.",
        "UI await init, xử lý decode lỗi và kết quả file cũ.",
        "Native test, Wasm test và browser scenario được ghi riêng."
      ],
      "milestones": [
        {
          "title": "Lõi và hợp đồng",
          "tasks": [
            "Đối chiếu trọng số và alpha bằng pixel mẫu.",
            "Kiểm tra mọi kích thước biên."
          ],
          "acceptance": "Core tests bao phủ màu, alpha, thiếu/thừa bytes."
        },
        {
          "title": "Export và build",
          "tasks": [
            "Chạy Wasm test export.",
            "Build glue cùng binary target web."
          ],
          "acceptance": "Export bytes và Err được thực thi trong host Wasm."
        },
        {
          "title": "Canvas và vòng đời",
          "tasks": [
            "Tải ảnh, giải phóng bitmap.",
            "Tăng generation khi chọn file/mẫu mới."
          ],
          "acceptance": "File cũ không ghi đè preview, lỗi không khóa UI."
        },
        {
          "title": "Mở rộng có đo",
          "tasks": [
            "Thêm threshold hoặc crop cùng test.",
            "Đo latency/peak memory ảnh đúng giới hạn."
          ],
          "acceptance": "Có kịch bản và số đo tái hiện, nêu giới hạn decode."
        }
      ],
      "testCases": [
        {
          "name": "Alpha và màu cơ bản",
          "setup": "Pixels đỏ/xanh/trắng/trong suốt.",
          "expected": "Gray đúng trọng số, alpha nguyên vẹn."
        },
        {
          "name": "Layout sai",
          "setup": "Khai báo 2×2, input 15 hoặc 17 bytes.",
          "expected": "Err trước vòng truy cập/output."
        },
        {
          "name": "Chọn file liên tục",
          "setup": "Ảnh đầu decode chậm, ảnh thứ hai nhanh.",
          "expected": "Preview thuộc lựa chọn mới."
        },
        {
          "name": "Tải module lỗi",
          "setup": "URL Wasm không hợp lệ.",
          "expected": "Thông báo tải lỗi, không gọi export chưa init."
        }
      ],
      "rubric": [
        {
          "id": "wasm-pixel-correct",
          "title": "Tính đúng ảnh",
          "criteria": [
            "Layout và alpha đúng với fixture.",
            "Phân biệt grayscale lab với color management đầy đủ."
          ],
          "critical": true
        },
        {
          "id": "wasm-pixel-boundary",
          "title": "Biên giới và tài nguyên",
          "criteria": [
            "Validation trước cấp phát.",
            "Giới hạn file/pixel và cleanup bitmap."
          ],
          "critical": true
        },
        {
          "id": "wasm-pixel-tests",
          "title": "Bằng chứng kiểm thử",
          "criteria": [
            "Core và Wasm tests thực thi.",
            "Browser kiểm tra lỗi và lựa chọn nhanh."
          ],
          "critical": true
        },
        {
          "id": "wasm-pixel-handover",
          "title": "Bàn giao",
          "criteria": [
            "Source, artifact và lệnh phục vụ HTTP.",
            "Ghi số đo và điều chưa kiểm chứng."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Source, Cargo.lock và web adapter.",
        "Artifact JS/Wasm cùng bản build.",
        "Kết quả native/Wasm tests.",
        "Kịch bản browser và báo cáo memory/latency."
      ]
    },
    {
      "id": "wasm-project-search",
      "title": "Search-index: tìm kiếm nền theo phiên",
      "description": "Index Rust trong Web Worker, API message có ID và dataset generation, UI giữ kết quả mới.",
      "level": "independent",
      "estimatedHours": 15,
      "labLessonId": "wasm-search-project",
      "requirements": [
        "Dataset có ID duy nhất và giới hạn tài nguyên.",
        "Semantics query được mô tả, kết quả ổn định.",
        "Worker thật, request/generation được kiểm tra trước render.",
        "Quản lý object Wasm, terminate và thử lại khi lỗi."
      ],
      "milestones": [
        {
          "title": "Index và semantics",
          "tasks": [
            "Chạy baseline all-terms substring.",
            "Bổ sung inverted index/ranking với fixture đối chiếu."
          ],
          "acceptance": "Kết quả đúng theo hợp đồng đã công bố."
        },
        {
          "title": "Protocol",
          "tasks": [
            "Định nghĩa message và lỗi.",
            "Test đảo thứ tự result và thay dataset."
          ],
          "acceptance": "Không có kết quả thuộc query/dataset cũ được render."
        },
        {
          "title": "Vòng đời",
          "tasks": [
            "Free index khi thay, terminate khi bỏ worker.",
            "Kiểm tra init/worker error và retry."
          ],
          "acceptance": "UI có trạng thái rõ, không spinner vô hạn."
        },
        {
          "title": "Đo hiệu năng",
          "tasks": [
            "Tách thời gian build index/query.",
            "So baseline và bản tối ưu với cùng input."
          ],
          "acceptance": "Có raw samples, thiết bị và giới hạn."
        }
      ],
      "testCases": [
        {
          "name": "Mọi term và Unicode",
          "setup": "Query nhiều term, dataset tiếng Việt.",
          "expected": "ID đúng semantics và thứ tự."
        },
        {
          "name": "ID trùng",
          "setup": "Hai dòng dùng cùng ID.",
          "expected": "Index bị từ chối trước ready."
        },
        {
          "name": "Result cũ",
          "setup": "Query 7 về sau input đã thành 8.",
          "expected": "Query 7 không cập nhật DOM."
        },
        {
          "name": "Dataset thay",
          "setup": "Index generation 2 thay 1.",
          "expected": "Mọi message generation 1 bị bỏ."
        }
      ],
      "rubric": [
        {
          "id": "wasm-search-core",
          "title": "Semantics",
          "criteria": [
            "Query/limit/dataset validation có test.",
            "Ranking hoặc substring được giải thích đúng."
          ],
          "critical": true
        },
        {
          "id": "wasm-search-protocol",
          "title": "Giao thức",
          "criteria": [
            "Request và generation bảo vệ UI.",
            "Unknown/error message có chính sách."
          ],
          "critical": true
        },
        {
          "id": "wasm-search-life",
          "title": "Vòng đời",
          "criteria": [
            "Object/worker cleanup rõ.",
            "Lỗi init có thử lại và trạng thái UI đúng."
          ],
          "critical": true
        },
        {
          "id": "wasm-search-proof",
          "title": "Bằng chứng",
          "criteria": [
            "Core/Wasm/browser tests cùng kịch bản race.",
            "Latency báo theo workload cụ thể."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Source index và worker/UI.",
        "Tài liệu message schema.",
        "Tests race/stale và invalid dataset.",
        "Benchmark build/query cùng giới hạn tìm kiếm."
      ]
    },
    {
      "id": "wasm-project-offline-report",
      "title": "Offline-report: phân tích tệp và tải báo cáo",
      "description": "File stream → UTF-8 decoder → Rust aggregate → JSON, có budget, hủy và báo cáo chỉ khi hoàn tất.",
      "level": "capstone",
      "estimatedHours": 28,
      "labLessonId": "wasm-report-project",
      "requirements": [
        "Giữ UTF-8 và record qua chunk, không giữ cả file trong Rust.",
        "Validation CSV theo phạm vi công bố, cent nguyên và checked sums.",
        "Lỗi poison Report, chỉ finish thành công mở download.",
        "Worker hủy/đổi input an toàn, artifact nhất quán và test ba lớp."
      ],
      "milestones": [
        {
          "title": "Parser và aggregation",
          "tasks": [
            "Chạy mọi ranh giới ký tự của fixture.",
            "Nếu hỗ trợ CSV tổng quát, thay parser và thêm quoted fields/newlines."
          ],
          "acceptance": "Whole/chunk cùng kết quả; dữ liệu ngoài hợp đồng bị từ chối."
        },
        {
          "title": "Worker streaming",
          "tasks": [
            "Đọc File.stream trong worker, giới hạn chunk/pending.",
            "Đo số dữ liệu đang sống và không queue vô hạn."
          ],
          "acceptance": "Input lớn không làm RAM tăng theo toàn bộ file ngoài phạm vi host đã đo."
        },
        {
          "title": "Lỗi và hủy",
          "tasks": [
            "Test UTF-8 sai, lỗi giữa stream, cancel và chọn lại.",
            "Download chỉ cho output hoàn chỉnh."
          ],
          "acceptance": "Không xuất tổng dở dang hoặc result phiên cũ."
        },
        {
          "title": "Phát hành và nghiệm thu",
          "tasks": [
            "Test native/Wasm/browser trên target chọn.",
            "Ghi cold/warm, memory, artifact version và phạm vi hỗ trợ."
          ],
          "acceptance": "Reviewer tái hiện từ source và đối chiếu bằng chứng."
        }
      ],
      "testCases": [
        {
          "name": "Chunk boundaries",
          "setup": "Chia input ở mọi ranh giới ký tự; decoder chia bytes UTF-8.",
          "expected": "Tổng giống xử lý nguyên khối."
        },
        {
          "name": "Poison sau lỗi",
          "setup": "Dòng 21 sai sau 20 dòng hợp lệ.",
          "expected": "push/finish tiếp bị từ chối, không download."
        },
        {
          "name": "Budget",
          "setup": "Record 4097 bytes, 33 categories hoặc file quá lớn.",
          "expected": "Lỗi đúng phạm vi, không cấp phát vô hạn."
        },
        {
          "name": "Cancel rồi chạy lại",
          "setup": "Hủy file lớn rồi chọn mẫu mới.",
          "expected": "Phiên cũ không cập nhật; mẫu mới chạy được."
        },
        {
          "name": "Artifact không khớp",
          "setup": "Kiểm tra cache phiên JS/Wasm cũ mới.",
          "expected": "Cơ chế phát hành giữ tập nhất quán hoặc lỗi tải rõ."
        }
      ],
      "rubric": [
        {
          "id": "wasm-report-correct",
          "title": "Tính đúng dữ liệu",
          "criteria": [
            "Chunk/whole tương đương và cent nguyên.",
            "CSV phạm vi rõ, lỗi có vị trí."
          ],
          "critical": true
        },
        {
          "id": "wasm-report-bounds",
          "title": "Tài nguyên",
          "criteria": [
            "Giới hạn file/chunk/pending/rows/categories.",
            "Báo cáo peak memory và điều kiện đo."
          ],
          "critical": true
        },
        {
          "id": "wasm-report-state",
          "title": "Vòng đời và lỗi",
          "criteria": [
            "Failed/finished không bị dùng tiếp.",
            "Hủy/đổi input không xuất kết quả cũ."
          ],
          "critical": true
        },
        {
          "id": "wasm-report-tests",
          "title": "Ba lớp kiểm thử",
          "criteria": [
            "Core và Wasm test đã thực thi.",
            "Browser scenario gồm failure/cancel/download."
          ],
          "critical": true
        },
        {
          "id": "wasm-report-release",
          "title": "Bàn giao",
          "criteria": [
            "Artifact cùng version, runbook build/serve.",
            "Giới hạn browser/device và phần chưa đo được nêu rõ."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Source core/bindings/worker/UI và Cargo.lock.",
        "JS/Wasm artifact cùng version.",
        "Test output và recording các trạng thái chính.",
        "Raw benchmark, memory report và phạm vi hỗ trợ."
      ]
    }
  ],
  "assessment": {
    "title": "Tự đánh giá năng lực WebAssembly",
    "instructions": "Đối chiếu câu trả lời và kỹ năng với source, test native/Wasm đã chạy, kịch bản browser và số đo. Tự rà soát không thay thế review dự án hoặc kiểm thử thiết bị đích.",
    "passPercent": 80,
    "questions": [
      {
        "id": "wasm-exam-01",
        "question": "Chuyển một hàm rất nhỏ sang Wasm nhưng gọi từng phần tử có thể chậm vì sao?",
        "options": [
          "Chi phí gọi/copy có thể lớn hơn tính toán; cần đo và thử batch.",
          "Rust luôn chậm hơn JS.",
          "Browser không cho vòng lặp."
        ],
        "correct": 0,
        "explanation": "Ranh giới và workload quyết định; ngôn ngữ nguồn không tự chứng minh lợi ích.",
        "lessonIds": [
          "wasm-architecture",
          "wasm-runtime"
        ]
      },
      {
        "id": "wasm-exam-02",
        "question": "Có thể phát hành glue JavaScript cũ cùng .wasm mới tùy ý không?",
        "options": [
          "Không; chúng gắn với export và quy ước của cùng build.",
          "Có nếu tên file giống nhau.",
          "Có nếu dùng release."
        ],
        "correct": 0,
        "explanation": "Tập artifact cần nhất quán để binding đúng.",
        "lessonIds": [
          "wasm-build-pipeline",
          "wasm-release"
        ]
      },
      {
        "id": "wasm-exam-03",
        "question": "Rust u64 cần đi qua JSON mà không mất ID. Thiết kế nào có thể phù hợp?",
        "options": [
          "Đổi mọi ID thành float32.",
          "Chuỗi thập phân được validation hoặc một hợp đồng số lớn phù hợp consumer.",
          "Cắt còn 32 bit."
        ],
        "correct": 1,
        "explanation": "JSON/JS number không biểu diễn chính xác mọi u64; lựa chọn cần công bố và test.",
        "lessonIds": [
          "wasm-bindings",
          "wasm-abi-contracts"
        ]
      },
      {
        "id": "wasm-exam-04",
        "question": "Một stream đã mutate rồi gặp dữ liệu sai. Có thể cứ finish báo cáo đầy đủ không?",
        "options": [
          "Có nếu phần lớn dòng đúng.",
          "Chỉ cần đổi màu thông báo.",
          "Không; cần rollback hoặc trạng thái failed theo hợp đồng."
        ],
        "correct": 2,
        "explanation": "Trạng thái sau lỗi phải được định nghĩa, tránh output dở dang có vẻ hoàn chỉnh.",
        "lessonIds": [
          "wasm-errors-panics",
          "wasm-report-project"
        ]
      },
      {
        "id": "wasm-exam-05",
        "question": "Memory không shared grow làm view JS cũ có còn dùng nguyên như trước không?",
        "options": [
          "Không; buffer cũ có thể bị detach, cần lấy view mới theo vòng đời.",
          "Luôn giữ pointer cũ vô hạn.",
          "Chỉ phụ thuộc tên biến."
        ],
        "correct": 0,
        "explanation": "Vòng đời view phụ thuộc linear memory và tăng trưởng; không giữ alias tùy ý.",
        "lessonIds": [
          "wasm-memory"
        ]
      },
      {
        "id": "wasm-exam-06",
        "question": "Ảnh khai báo width×height×4 nhưng thiếu một byte nên xử lý thế nào?",
        "options": [
          "Bỏ pixel cuối.",
          "Đọc tiếp ngoài vùng.",
          "Trả lỗi length trước indexing."
        ],
        "correct": 2,
        "explanation": "Layout mismatch cần được validation, không dùng panic hoặc đọc sai để phát hiện.",
        "lessonIds": [
          "wasm-buffer-validation",
          "wasm-image-project"
        ]
      },
      {
        "id": "wasm-exam-07",
        "question": "ID query khớp nhưng generation dataset cũ. Có nhận result?",
        "options": [
          "Không, cần cả ID và generation khớp.",
          "Có vì query đúng.",
          "Có nếu result ít."
        ],
        "correct": 0,
        "explanation": "Dataset cũng thuộc ý định hiện tại; kết quả đúng cho dữ liệu cũ vẫn sai UI.",
        "lessonIds": [
          "wasm-worker-protocol",
          "wasm-search-project"
        ]
      },
      {
        "id": "wasm-exam-08",
        "question": "Bỏ stale result có dừng CPU của lời gọi Wasm đang chạy không?",
        "options": [
          "Luôn có.",
          "Chỉ cần debounce là đủ.",
          "Không; cancellation cần chia chunk, terminate hoặc cơ chế riêng."
        ],
        "correct": 2,
        "explanation": "Lọc result chỉ kiểm soát render.",
        "lessonIds": [
          "wasm-workers",
          "wasm-worker-protocol"
        ]
      },
      {
        "id": "wasm-exam-09",
        "question": "Muốn công bố cải thiện thao tác chọn file→kết quả, nên đo gì?",
        "options": [
          "Chỉ vòng lặp nhanh nhất.",
          "Toàn luồng, cold/warm, phân bố và cùng input/semantics.",
          "Chỉ kích thước bundle."
        ],
        "correct": 1,
        "explanation": "Decode/copy/init/render ảnh hưởng trải nghiệm ngoài lõi Rust.",
        "lessonIds": [
          "wasm-performance",
          "wasm-benchmarking"
        ]
      },
      {
        "id": "wasm-exam-10",
        "question": "Mỗi chunk nhỏ nhưng pending không có newline tăng mãi. Cần gì?",
        "options": [
          "Tăng chunk count vô hạn.",
          "Giới hạn pending record và chính sách lỗi.",
          "Chỉ đổi sang Vec."
        ],
        "correct": 1,
        "explanation": "Chunk size không giới hạn dữ liệu giữ qua chunk.",
        "lessonIds": [
          "wasm-resource-budgets"
        ]
      },
      {
        "id": "wasm-exam-11",
        "question": "Native cargo test đạt có chứng minh worker và binding chạy trên browser?",
        "options": [
          "Có.",
          "Không; cần test Wasm đã thực thi và browser integration.",
          "Có nếu edition mới nhất."
        ],
        "correct": 1,
        "explanation": "Phạm vi native không gồm JS glue, worker, network và DOM.",
        "lessonIds": [
          "wasm-browser-testing"
        ]
      },
      {
        "id": "wasm-exam-12",
        "question": "Report gặp lỗi giữa stream rồi UI vẫn mở download có vấn đề gì?",
        "options": [
          "Không nếu JSON parse được.",
          "Chỉ thiếu CSS.",
          "Người dùng có thể nhận báo cáo thiếu được trình bày như hoàn chỉnh."
        ],
        "correct": 2,
        "explanation": "Download phải gắn với finish thành công và đúng phiên công việc.",
        "lessonIds": [
          "wasm-report-project",
          "wasm-release"
        ]
      }
    ],
    "skills": [
      {
        "id": "wasm-skill-1",
        "title": "Kiến trúc và chuỗi build",
        "description": "Phân biệt khả năng module và host. Build/init artifact nhất quán. Cung cấp bằng chứng có thể tái hiện.",
        "lessonIds": [
          "wasm-runtime",
          "wasm-architecture",
          "wasm-build-pipeline"
        ],
        "projectIds": [
          "wasm-project-pixelkit"
        ],
        "required": true
      },
      {
        "id": "wasm-skill-2",
        "title": "Binding và hợp đồng API",
        "description": "Giữ đơn vị, miền giá trị và phiên bản API. Xử lý Err và trạng thái sau lỗi. Cung cấp bằng chứng có thể tái hiện.",
        "lessonIds": [
          "wasm-bindings",
          "wasm-abi-contracts",
          "wasm-errors-panics"
        ],
        "projectIds": [
          "wasm-project-pixelkit"
        ],
        "required": true
      },
      {
        "id": "wasm-skill-3",
        "title": "Linear memory và dữ liệu nhị phân",
        "description": "Kiểm tra layout, kích thước và ngân sách. Bàn giao export ảnh có test bytes/alpha. Cung cấp bằng chứng có thể tái hiện.",
        "lessonIds": [
          "wasm-memory",
          "wasm-buffer-validation",
          "wasm-image-project"
        ],
        "projectIds": [
          "wasm-project-pixelkit"
        ],
        "required": true
      },
      {
        "id": "wasm-skill-4",
        "title": "Worker và ứng dụng tương tác",
        "description": "Thiết kế message ID/generation. Phân biệt hủy với bỏ kết quả cũ. Cung cấp bằng chứng có thể tái hiện.",
        "lessonIds": [
          "wasm-workers",
          "wasm-worker-protocol",
          "wasm-search-project"
        ],
        "projectIds": [
          "wasm-project-search"
        ],
        "required": true
      },
      {
        "id": "wasm-skill-5",
        "title": "Hiệu năng và tài nguyên",
        "description": "Đo cold/warm, copy và latency toàn luồng. Giới hạn input, pending và công việc đang bay. Cung cấp bằng chứng có thể tái hiện.",
        "lessonIds": [
          "wasm-performance",
          "wasm-benchmarking",
          "wasm-resource-budgets"
        ],
        "projectIds": [
          "wasm-project-offline-report"
        ],
        "required": true
      },
      {
        "id": "wasm-skill-6",
        "title": "Kiểm thử, phát hành và dự án cuối",
        "description": "Phát hành JS/Wasm cùng version. Bàn giao ứng dụng streaming có recovery UI. Cung cấp bằng chứng có thể tái hiện.",
        "lessonIds": [
          "wasm-release",
          "wasm-browser-testing",
          "wasm-report-project"
        ],
        "projectIds": [
          "wasm-project-offline-report"
        ],
        "required": true
      }
    ]
  }
};
