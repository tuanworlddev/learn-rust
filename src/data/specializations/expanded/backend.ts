import type { TrackExpansion } from '../../specialization-types';

export const backendExpansion: TrackExpansion = {
  "chapters": [
    {
      "id": "backend-ch1",
      "title": "Thiết kế dịch vụ và runtime",
      "description": "Đi từ bất biến sản phẩm đến cấu hình, tài nguyên và vòng đời async.",
      "lessonIds": [
        "backend-domain-boundaries",
        "backend-config-errors",
        "backend-runtime"
      ],
      "outcomes": [
        "Viết command và bất biến nghiệp vụ độc lập HTTP.",
        "Khởi tạo tài nguyên có kiểm tra và giới hạn tải."
      ]
    },
    {
      "id": "backend-ch2",
      "title": "Hợp đồng HTTP và API đầu tiên",
      "description": "Thiết kế request/response, cursor và API có lưu trữ.",
      "lessonIds": [
        "backend-http",
        "backend-api-contracts",
        "backend-catalog-project"
      ],
      "outcomes": [
        "Xây Router có validation, lỗi và phân trang rõ ràng.",
        "Kiểm thử HTTP cùng database và cập nhật có version."
      ]
    },
    {
      "id": "backend-ch3",
      "title": "Dữ liệu và thay đổi schema",
      "description": "Bảo vệ dữ liệu dưới cạnh tranh, đọc kế hoạch query và migration.",
      "lessonIds": [
        "backend-transactions",
        "backend-query-plans",
        "backend-migrations"
      ],
      "outcomes": [
        "Đặt constraint và transaction đúng chỗ.",
        "Đo truy vấn và đưa schema mới vào dịch vụ đang chạy."
      ]
    },
    {
      "id": "backend-ch4",
      "title": "Danh tính và thao tác được gửi lại",
      "description": "Cách ly tài nguyên và bảo vệ đơn hàng khỏi lặp tác dụng phụ.",
      "lessonIds": [
        "backend-authorization",
        "backend-idempotency",
        "backend-order-project"
      ],
      "outcomes": [
        "Kiểm tra quyền trên mọi đường truy cập dữ liệu.",
        "Chứng minh replay, conflict và rollback bằng trạng thái database."
      ]
    },
    {
      "id": "backend-ch5",
      "title": "Giao tiếp và công việc nền",
      "description": "Thiết kế sự kiện, outbox, worker và thời hạn của yêu cầu.",
      "lessonIds": [
        "backend-streaming",
        "backend-outbox",
        "backend-retries-deadlines"
      ],
      "outcomes": [
        "Phục hồi sự kiện khi có crash và phát lại.",
        "Giới hạn retry, queue, deadline và client chậm."
      ]
    },
    {
      "id": "backend-ch6",
      "title": "Nghiệm thu và vận hành",
      "description": "Quan sát sản phẩm, đo tải và bàn giao dịch vụ nhiều workspace.",
      "lessonIds": [
        "backend-production",
        "backend-observability",
        "backend-service-project"
      ],
      "outcomes": [
        "Điều tra bằng trace/metric và giả thuyết có thể kiểm chứng.",
        "Bàn giao dự án có kiểm thử quyền, cạnh tranh và phục hồi."
      ]
    }
  ],
  "lessons": [
    {
      "id": "backend-domain-boundaries",
      "moduleId": "track-backend",
      "title": "Từ yêu cầu sản phẩm đến ranh giới nghiệp vụ",
      "description": "Thiết kế mô hình nghiệp vụ và phân biệt DTO, trạng thái lưu trữ, quy tắc cùng tác dụng phụ.",
      "duration": 55,
      "objectives": [
        "Viết bất biến trước khi chọn framework.",
        "Tách validation cú pháp khỏi quyết định nghiệp vụ.",
        "Giữ lõi Rust kiểm thử được khi adapter HTTP thay đổi."
      ],
      "sections": [
        {
          "title": "Bắt đầu từ một hành vi quan sát được",
          "text": "Một API quản lý công việc không bắt đầu từ bảng tasks. Trước hết, mô tả hành vi: thành viên tạo công việc trong nhóm của mình, người được giao chuyển nó sang đang làm, người có quyền đóng công việc khi đã đủ thông tin. Mỗi câu có chủ thể, điều kiện và thay đổi trạng thái. Viết thêm điều không được xảy ra: công việc đã hủy không được hoàn thành; một thành viên của nhóm khác không đọc được tiêu đề. Những bất biến này trở thành test và quyết định mô hình. Nếu chỉ liệt kê endpoint CRUD, ta rất dễ xây API lưu được mọi trạng thái nhưng không bảo vệ được quy tắc sản phẩm."
        },
        {
          "title": "Ba kiểu dữ liệu có ba trách nhiệm",
          "text": "DTO mô tả dữ liệu qua HTTP; bản ghi repository mô tả cách lưu; kiểu miền mô tả giá trị hợp lệ. CreateTaskInput có thể chứa String chưa kiểm tra. TaskTitle chỉ được tạo qua hàm kiểm tra. TaskRow có thêm cột version và timestamp phục vụ lưu trữ. Không cần nhân ba mọi struct ngay từ đầu: hãy tách tại nơi có rủi ro lẫn trách nhiệm, chẳng hạn client không được nhập owner_id hoặc trạng thái nội bộ. Khi thêm một cột database, response công khai phải giữ nguyên trừ khi hợp đồng API được thay đổi có chủ ý. Mỗi phép chuyển đổi có thể thất bại nên trả Result thay vì mặc định sửa dữ liệu."
        },
        {
          "title": "Lõi quyết định, adapter thực hiện",
          "text": "Hàm transition nhận trạng thái hiện tại, hành động và quyền đã xác minh; nó trả trạng thái mới hoặc lỗi nghiệp vụ. Hàm này không biết Axum, SQLx hay HeaderMap. Handler đọc request, chuyển sang command, gọi service và ánh xạ lỗi sang HTTP. Service điều phối transaction cùng repository. Cách phân chia này giúp test hàng chục quy tắc mà không cần mở socket. Tuy nhiên, kiểm tra thuần không thay thế ràng buộc database: hai request có thể cùng vượt qua kiểm tra tồn kho rồi cập nhật đồng thời. Vì thế kiểm tra trạng thái mới phải gắn với version trong UPDATE hoặc được thực hiện bên trong transaction có chiến lược cạnh tranh rõ."
        },
        {
          "title": "Thiết kế qua một thay đổi thật",
          "text": "Giả sử sản phẩm thêm hành động mở lại công việc đã hoàn thành. Hãy thay đổi enum hành động, bổ sung bảng chuyển trạng thái và test trước khi thêm route. Đừng để handler tự gán chuỗi status, vì mỗi endpoint sẽ tạo một bộ quy tắc khác nhau. Khi review, tìm mọi nơi có quyền đổi trạng thái và kiểm tra chúng đều đi qua cùng hàm miền. Bài tập dùng ba trạng thái và một luật đơn giản để rèn cách viết này. Sau khi làm xong, hãy giải thích lỗi nào thuộc input, lỗi nào thuộc xung đột nghiệp vụ và trường hợp nào cần đọc lại version từ database; đó là câu trả lời có ích hơn số lượng trait trong kiến trúc."
        }
      ],
      "tip": "Một ranh giới tốt được chứng minh bằng việc đổi adapter mà các test nghiệp vụ vẫn giữ nguyên.",
      "exercise": {
        "title": "Bảng chuyển trạng thái có kiểm soát",
        "instructions": "Hoàn thành hàm trong trình soạn thảo. Dữ liệu mẫu và các trường hợp biên đã có trong main; giữ nguyên các assertion khi chạy kiểm tra.",
        "requirements": [
          "Chỉ chấp nhận ba cặp trạng thái/hành động đã chỉ định.",
          "Trả lỗi cho trạng thái không biết và thao tác lặp không hợp lệ.",
          "Không sửa đầu vào hoặc dùng panic để biểu diễn lỗi nghiệp vụ."
        ]
      },
      "starterCode": "\nfn transition(current: &str, action: &str) -> Result<&'static str, &'static str> {\n    todo!(\"Hoàn thành yêu cầu bài tập\")\n}\nfn main() {\n    assert_eq!(transition(\"open\", \"start\"), Ok(\"doing\"));\n    assert_eq!(transition(\"doing\", \"finish\"), Ok(\"done\"));\n    assert_eq!(transition(\"done\", \"finish\"), Err(\"invalid_transition\"));\n    assert_eq!(transition(\"unknown\", \"start\"), Err(\"invalid_transition\"));\n    assert_eq!(transition(\"done\", \"reopen\"), Ok(\"open\"));\n    println!(\"Ba chuyển trạng thái hợp lệ\");\n}",
      "solutionCode": "\nfn transition(current: &str, action: &str) -> Result<&'static str, &'static str> {\n    match (current, action) {\n        (\"open\", \"start\") => Ok(\"doing\"),\n        (\"doing\", \"finish\") => Ok(\"done\"),\n        (\"done\", \"reopen\") => Ok(\"open\"),\n        _ => Err(\"invalid_transition\"),\n    }\n}\nfn main() {\n    assert_eq!(transition(\"open\", \"start\"), Ok(\"doing\"));\n    assert_eq!(transition(\"doing\", \"finish\"), Ok(\"done\"));\n    assert_eq!(transition(\"done\", \"finish\"), Err(\"invalid_transition\"));\n    assert_eq!(transition(\"unknown\", \"start\"), Err(\"invalid_transition\"));\n    assert_eq!(transition(\"done\", \"reopen\"), Ok(\"open\"));\n    println!(\"Ba chuyển trạng thái hợp lệ\");\n}",
      "expectedOutput": "Ba chuyển trạng thái hợp lệ",
      "hints": [
        "match trên tuple giúp nhìn toàn bộ luật.",
        "Nhánh mặc định trả Err."
      ],
      "quiz": {
        "question": "Thêm cột internal_note vào database thì response HTTP nên thay đổi thế nào?",
        "options": [
          "Tự động serialize toàn bộ row để tránh mã lặp.",
          "Luôn đưa trường vào request DTO.",
          "Chỉ thay đổi khi hợp đồng response chủ động bổ sung trường đó."
        ],
        "correct": 2,
        "explanation": "DTO và mô hình lưu trữ có vòng đời khác nhau; response được chọn rõ giúp thay đổi database không vô tình lộ dữ liệu."
      },
      "reference": {
        "label": "Rust Book — newtype và ranh giới kiểu",
        "url": "https://doc.rust-lang.org/book/ch20-03-advanced-types.html"
      }
    },
    {
      "id": "backend-config-errors",
      "moduleId": "track-backend",
      "title": "Cấu hình, dependency và lỗi khi khởi động",
      "description": "Đọc cấu hình có kiểu, kiểm tra sớm và tách lỗi startup khỏi lỗi của từng request.",
      "duration": 55,
      "objectives": [
        "Chuẩn hóa config một lần trước khi mở listener.",
        "Phân biệt cấu hình thiếu với giá trị hợp lệ bằng 0.",
        "Chẩn đoán lỗi mà không đưa thông tin kết nối vào response."
      ],
      "sections": [
        {
          "title": "Cấu hình là đầu vào của chương trình",
          "text": "PORT, DATABASE_URL, pool_size và thời gian chờ đều là input ngoài kiểm soát của Rust. Một biến môi trường tồn tại không có nghĩa nó hợp lệ. Đọc toàn bộ cấu hình vào struct AppConfig tại startup; parse số, giới hạn phạm vi và kiểm tra quan hệ giữa các giá trị. Ví dụ concurrency bằng 0 khiến hệ thống không nhận việc; thời gian shutdown nhỏ hơn timeout truy vấn khiến nhiều request bị cắt. Đặt default cho lựa chọn có ý nghĩa rõ ràng như địa chỉ loopback khi phát triển, nhưng đừng tự sinh database URL hoặc khóa xác thực để che cấu hình thiếu ở production."
        },
        {
          "title": "Khởi tạo tài nguyên theo thứ tự",
          "text": "Sau khi config hợp lệ, mở pool, kiểm tra schema tương thích, tạo client phụ thuộc rồi mới nhận traffic. Một startup lỗi phải kết thúc với mã thoát khác 0 và lý do ngắn để hệ thống vận hành phát hiện. Migration là thao tác thay đổi dữ liệu, không nên vô tình chạy đồng thời trong mọi replica nếu chưa có cơ chế điều phối. Khi pool đã tạo, clone handle của pool vào State thường chia sẻ cùng tài nguyên thay vì mở thêm pool. Hãy ghi rõ nguồn sở hữu tài nguyên để shutdown biết cần chờ worker nào, đóng channel nào và đảm bảo request mới không tiếp tục vào trong lúc dọn dẹp."
        },
        {
          "title": "Lỗi có ngữ cảnh nhưng không có bí mật",
          "text": "Một lỗi parse nên nói trường nào sai và phạm vi chấp nhận, chẳng hạn REQUEST_TIMEOUT_MS phải từ 100 đến 30000. Không cần đưa nguyên chuỗi kết nối hoặc token vào log. Ở ranh giới HTTP, lỗi nghiệp vụ như tiêu đề trống có code ổn định; lỗi hạ tầng nên trả thông điệp phù hợp cùng request ID, còn nguyên nhân chi tiết ở log server đã được giới hạn. Đừng chuyển mọi Err thành 500: lỗi không tìm thấy và xung đột version là những kết quả dự kiến. Ngược lại, đừng biến lỗi database thành danh sách rỗng vì client sẽ hiểu nhầm rằng dữ liệu đã biến mất."
        },
        {
          "title": "Kiểm tra mà không phụ thuộc môi trường máy",
          "text": "Tách hàm parse_config nhận map hoặc các chuỗi tham số khỏi hàm đọc environment. Test cung cấp dữ liệu giả và chạy song song không cần set_var trên tiến trình dùng chung. Hãy kiểm tra thiếu biến, khoảng trắng, số âm, quá lớn, ký tự sai và giá trị biên. Bài tập xử lý timeout để làm rõ việc default chỉ áp dụng khi thiếu, không áp dụng khi người vận hành đã cung cấp giá trị sai. Trong dự án, thêm lệnh kiểm tra cấu hình không mở listener, mô tả những kiểm tra chỉ xác minh định dạng và những kiểm tra thực sự kết nối dịch vụ. Cách này giúp phân biệt lỗi triển khai với lỗi mạng ngay từ đầu."
        }
      ],
      "tip": "Default giúp bắt đầu nhanh; lỗi cấu hình cần hiện rõ trước khi website nhận request.",
      "exercise": {
        "title": "Parse timeout với default có chủ đích",
        "instructions": "Hoàn thành hàm trong trình soạn thảo. Dữ liệu mẫu và các trường hợp biên đã có trong main; giữ nguyên các assertion khi chạy kiểm tra.",
        "requirements": [
          "Thiếu giá trị dùng 5000 ms.",
          "Chỉ nhận số nguyên từ 100 đến 30000.",
          "Giá trị được cung cấp nhưng sai phải trả lỗi."
        ]
      },
      "starterCode": "\nfn timeout_ms(raw: Option<&str>) -> Result<u64, &'static str> {\n    todo!(\"Hoàn thành yêu cầu bài tập\")\n}\nfn main() {\n    assert_eq!(timeout_ms(None), Ok(5_000));\n    assert_eq!(timeout_ms(Some(\" 100 \")), Ok(100));\n    assert_eq!(timeout_ms(Some(\"30000\")), Ok(30_000));\n    assert_eq!(timeout_ms(Some(\"0\")), Err(\"out_of_range\"));\n    assert_eq!(timeout_ms(Some(\"-1\")), Err(\"not_integer\"));\n    assert_eq!(timeout_ms(Some(\"\")), Err(\"not_integer\"));\n    println!(\"Cấu hình hợp lệ trước khi mở cổng\");\n}",
      "solutionCode": "\nfn timeout_ms(raw: Option<&str>) -> Result<u64, &'static str> {\n    let Some(raw) = raw else { return Ok(5_000); };\n    let value = raw.trim().parse::<u64>().map_err(|_| \"not_integer\")?;\n    if !(100..=30_000).contains(&value) { return Err(\"out_of_range\"); }\n    Ok(value)\n}\nfn main() {\n    assert_eq!(timeout_ms(None), Ok(5_000));\n    assert_eq!(timeout_ms(Some(\" 100 \")), Ok(100));\n    assert_eq!(timeout_ms(Some(\"30000\")), Ok(30_000));\n    assert_eq!(timeout_ms(Some(\"0\")), Err(\"out_of_range\"));\n    assert_eq!(timeout_ms(Some(\"-1\")), Err(\"not_integer\"));\n    assert_eq!(timeout_ms(Some(\"\")), Err(\"not_integer\"));\n    println!(\"Cấu hình hợp lệ trước khi mở cổng\");\n}",
      "expectedOutput": "Cấu hình hợp lệ trước khi mở cổng",
      "hints": [
        "Option::None khác chuỗi rỗng.",
        "Parse trước, kiểm tra phạm vi sau."
      ],
      "quiz": {
        "question": "DATABASE_URL đã cung cấp nhưng sai. Server production nên làm gì?",
        "options": [
          "Bỏ qua và mở database mẫu.",
          "Dừng startup với lỗi được che thông tin nhạy cảm.",
          "Báo thành công rồi chờ request đầu tiên."
        ],
        "correct": 1,
        "explanation": "Cấu hình sai là lỗi vận hành; tự đổi nguồn dữ liệu có thể làm ứng dụng chạy trên database không mong muốn."
      },
      "reference": {
        "label": "Rust std — xử lý Result",
        "url": "https://doc.rust-lang.org/std/result/index.html"
      }
    },
    {
      "id": "backend-api-contracts",
      "moduleId": "track-backend",
      "title": "Phân trang, lỗi và tương thích của hợp đồng API",
      "description": "Thiết kế cursor ổn định, quy tắc cập nhật và lỗi có cấu trúc trước khi triển khai handler.",
      "duration": 55,
      "objectives": [
        "Chọn thứ tự toàn phần cho phân trang.",
        "Phân biệt PATCH thiếu trường với giá trị null.",
        "Giữ tương thích bằng test hợp đồng."
      ],
      "sections": [
        {
          "title": "Một danh sách phải có thứ tự xác định",
          "text": "Truy vấn SELECT không có ORDER BY không hứa một thứ tự ổn định. Ngay cả ORDER BY created_at cũng có thể trùng thời điểm. Dùng cặp created_at và id làm khóa sắp xếp, rồi cursor chứa cả hai giá trị. Với thứ tự tăng dần, trang tiếp theo lấy những hàng có khóa lớn hơn cursor. Offset thuận tiện cho dữ liệu nhỏ nhưng việc chèn hoặc xóa trước vị trí đang đọc có thể làm lặp hoặc bỏ hàng. Cursor không tự tạo snapshot bất biến: nếu bản ghi thay đổi khóa sắp xếp giữa hai request, cần chọn trường ổn định hoặc mô tả rõ tính nhất quán mà API cung cấp."
        },
        {
          "title": "Giới hạn cũng là hợp đồng",
          "text": "Quy định limit mặc định, limit tối đa và cách trả lỗi khi cursor hỏng. Client không nên điều khiển trực tiếp tên cột ORDER BY; ánh xạ một enum sort sang biểu thức SQL cho phép. Cursor được mã hóa không đồng nghĩa được phân quyền. Mỗi truy vấn vẫn phải ràng buộc workspace hoặc owner, kể cả khi cursor được lấy từ một response hợp lệ của tài khoản khác. Kiểm thử trang rỗng, trang đúng limit, nhiều hàng cùng timestamp và cursor ở cuối. Nếu cần tổng số hàng, giải thích chi phí và tính nhất quán thay vì luôn COUNT mọi request."
        },
        {
          "title": "Sự vắng mặt mang ý nghĩa",
          "text": "Trong PATCH, trường không có thường nghĩa là giữ nguyên, còn null có thể nghĩa là xóa giá trị. Option<T> đơn giản có thể không phân biệt được hai trường hợp khi giải mã theo cách thông thường. Dùng kiểu patch biểu diễn Unchanged, Clear và Set; sau đó chuyển thành command. Với PUT, xác định rõ bạn thay thế toàn tài nguyên hay chỉ phần được phép chỉnh sửa. Thêm một trường bắt buộc vào request cũ thường là thay đổi phá vỡ client. Thêm trường response cũng có thể ảnh hưởng client giải mã quá chặt, nên phải có chiến lược phiên bản và kiểm tra hợp đồng với phiên bản client đang được hỗ trợ."
        },
        {
          "title": "Lỗi để máy xử lý và người chẩn đoán",
          "text": "Response lỗi nên có code ổn định như version_conflict, thông điệp dành cho người dùng và request_id. Không để client phân nhánh dựa vào câu tiếng Việt có thể thay đổi. Mã trạng thái HTTP phản ánh nhóm kết quả; code ứng dụng cung cấp chi tiết nghiệp vụ. Trong bài tập, cursor là số ID tăng dần để tập trung vào quy tắc so sánh và giới hạn. Khi chuyển sang cặp timestamp/id, hãy giữ cùng những bất biến: thứ tự xác định, không trả hàng tại cursor, kiểm tra quyền độc lập và không xây SQL bằng nối chuỗi từ input. Ghi những điều đó thành test trước khi thêm endpoint mới."
        }
      ],
      "tip": "Cursor là vị trí đọc, không phải bằng chứng người dùng có quyền đọc dữ liệu.",
      "exercise": {
        "title": "Phân trang theo khóa ổn định",
        "instructions": "Hoàn thành hàm trong trình soạn thảo. Dữ liệu mẫu và các trường hợp biên đã có trong main; giữ nguyên các assertion khi chạy kiểm tra.",
        "requirements": [
          "Sắp xếp ID tăng dần và loại trùng.",
          "Chỉ lấy ID lớn hơn cursor.",
          "Giới hạn 1–100 và trả tối đa limit mục."
        ]
      },
      "starterCode": "\nfn page(ids: &[u64], after: u64, limit: usize) -> Result<Vec<u64>, &'static str> {\n    todo!(\"Hoàn thành yêu cầu bài tập\")\n}\nfn main() {\n    assert_eq!(page(&[8, 3, 5, 5, 9], 3, 2), Ok(vec![5, 8]));\n    assert_eq!(page(&[3, 5], 5, 10), Ok(vec![]));\n    assert_eq!(page(&[], 0, 1), Ok(vec![]));\n    assert_eq!(page(&[1], 0, 0), Err(\"invalid_limit\"));\n    assert_eq!(page(&[1], 0, 101), Err(\"invalid_limit\"));\n    println!(\"Trang sau cursor: 5, 8\");\n}",
      "solutionCode": "\nfn page(ids: &[u64], after: u64, limit: usize) -> Result<Vec<u64>, &'static str> {\n    if !(1..=100).contains(&limit) { return Err(\"invalid_limit\"); }\n    let mut sorted = ids.to_vec();\n    sorted.sort_unstable();\n    sorted.dedup();\n    Ok(sorted.into_iter().filter(|id| *id > after).take(limit).collect())\n}\nfn main() {\n    assert_eq!(page(&[8, 3, 5, 5, 9], 3, 2), Ok(vec![5, 8]));\n    assert_eq!(page(&[3, 5], 5, 10), Ok(vec![]));\n    assert_eq!(page(&[], 0, 1), Ok(vec![]));\n    assert_eq!(page(&[1], 0, 0), Err(\"invalid_limit\"));\n    assert_eq!(page(&[1], 0, 101), Err(\"invalid_limit\"));\n    println!(\"Trang sau cursor: 5, 8\");\n}",
      "expectedOutput": "Trang sau cursor: 5, 8",
      "hints": [
        "Chuẩn hóa thứ tự trước khi take.",
        "Không dùng >= cho cursor độc quyền."
      ],
      "quiz": {
        "question": "Hai bản ghi cùng created_at. Cursor chỉ chứa created_at có rủi ro gì?",
        "options": [
          "Không có rủi ro vì timestamp luôn duy nhất.",
          "Có thể bỏ qua hoặc lặp hàng; cần khóa phụ ổn định như id.",
          "Chỉ làm JSON dài hơn."
        ],
        "correct": 1,
        "explanation": "Khóa sắp xếp phải xác định duy nhất vị trí. Dùng cặp timestamp/id và cùng quy tắc so sánh trong cursor lẫn ORDER BY."
      },
      "reference": {
        "label": "PostgreSQL — ORDER BY và LIMIT",
        "url": "https://www.postgresql.org/docs/current/queries-limit.html"
      }
    },
    {
      "id": "backend-query-plans",
      "moduleId": "track-backend",
      "title": "Thiết kế truy vấn và đọc kế hoạch thực thi",
      "description": "Tìm N+1, chọn chỉ mục từ truy vấn thực tế và đo chi phí thay vì tối ưu theo cảm giác.",
      "duration": 55,
      "objectives": [
        "Tách số query, số hàng và thời gian chờ pool.",
        "Thiết kế composite index phù hợp filter/order.",
        "Đọc estimate và actual mà không xem index là luôn tốt."
      ],
      "sections": [
        {
          "title": "Đếm công việc database thực hiện",
          "text": "Một endpoint trả 20 công việc có thể chạy một query lấy danh sách rồi 20 query lấy người được giao. Đây là N+1: latency tăng theo số mục và tải pool tăng dù mỗi query riêng lẻ nhanh. Ghi số query của một request cùng số hàng đọc/trả về. Có thể dùng JOIN, truy vấn theo tập ID hoặc batch loader tùy quan hệ; chọn cách giữ rõ semantics khi quan hệ một-nhiều. JOIN nhiều bảng một-nhiều có thể nhân số hàng, khiến phân trang và tổng tiền sai. Trước khi tối ưu, viết dataset nhỏ có hai người được giao và ba bình luận để phát hiện sự nhân bản này."
        },
        {
          "title": "Chỉ mục bắt đầu từ WHERE và ORDER BY",
          "text": "Giả sử query lọc workspace_id rồi lấy công việc theo created_at,id. Một chỉ mục bắt đầu bằng workspace_id và tiếp theo các khóa sắp xếp có thể giúp truy cập tập dữ liệu đúng thứ tự. Thứ tự cột, độ chọn lọc, điều kiện range và biểu thức đều ảnh hưởng việc sử dụng index; không có quy tắc đơn giản rằng cứ thêm tất cả cột là nhanh. Chỉ mục tốn dung lượng và chi phí ghi. Với bảng nhỏ hoặc query đọc phần lớn bảng, sequential scan có thể hợp lý. Đừng ép planner dùng index trước khi hiểu chi phí thật của dữ liệu đại diện."
        },
        {
          "title": "Estimate khác actual",
          "text": "EXPLAIN mô tả kế hoạch dự kiến; EXPLAIN ANALYZE thực thi câu lệnh để thu số đo. Vì có thực thi, cần đặc biệt thận trọng với câu lệnh ghi và chỉ chạy trên dữ liệu thử có kiểm soát. So sánh số hàng ước lượng với số hàng thực, số vòng lặp, kiểu join và khối dữ liệu đọc. Estimate lệch lớn có thể liên quan thống kê hoặc tương quan dữ liệu. Một query chậm chưa chắc do SQL: phần thời gian request có thể nằm ở chờ kết nối pool, khóa row hoặc dịch vụ bên ngoài. Gắn mốc đo đúng vị trí để không chữa sai nút thắt."
        },
        {
          "title": "Tạo một thí nghiệm có thể lặp lại",
          "text": "Tạo dữ liệu mẫu với phân bố gần sản phẩm, bao gồm workspace lớn và nhỏ. Chạy cùng query trước/sau thay đổi, giữ cấu hình máy và ghi trạng thái cache nếu biết. Đừng lấy một lần chạy ấm để so với một lần chạy lạnh rồi khẳng định tăng tốc. Bài tập không giả lập planner; nó đo số lượt gọi database trong hai cách tổ chức endpoint. Mục đích là nhận ra chi phí thiết kế có thể quan sát trước khi dùng công cụ đo sâu. Trong dự án, tiêu chí đạt gồm query count không tăng theo số dòng, response đúng khi quan hệ trùng và bằng chứng kế hoạch thực thi cho query quan trọng."
        }
      ],
      "tip": "Giảm N+1 chỉ có giá trị khi response vẫn đúng với quan hệ một-nhiều và phân trang.",
      "exercise": {
        "title": "Đếm query của endpoint danh sách",
        "instructions": "Hoàn thành hàm trong trình soạn thảo. Dữ liệu mẫu và các trường hợp biên đã có trong main; giữ nguyên các assertion khi chạy kiểm tra.",
        "requirements": [
          "Không có dòng vẫn cần một query danh sách.",
          "Batch có dữ liệu dùng hai query.",
          "Cách N+1 phải kiểm tra tràn số."
        ]
      },
      "starterCode": "\nfn query_budget(rows: usize, batched: bool) -> Result<usize, &'static str> {\n    todo!(\"Hoàn thành yêu cầu bài tập\")\n}\nfn main() {\n    assert_eq!(query_budget(20, false), Ok(21));\n    assert_eq!(query_budget(20, true), Ok(2));\n    assert_eq!(query_budget(0, true), Ok(1));\n    assert_eq!(query_budget(usize::MAX, false), Err(\"overflow\"));\n    println!(\"20 mục: 21 query hoặc 2 query theo lô\");\n}",
      "solutionCode": "\nfn query_budget(rows: usize, batched: bool) -> Result<usize, &'static str> {\n    if rows == 0 { return Ok(1); }\n    if batched { Ok(2) } else { rows.checked_add(1).ok_or(\"overflow\") }\n}\nfn main() {\n    assert_eq!(query_budget(20, false), Ok(21));\n    assert_eq!(query_budget(20, true), Ok(2));\n    assert_eq!(query_budget(0, true), Ok(1));\n    assert_eq!(query_budget(usize::MAX, false), Err(\"overflow\"));\n    println!(\"20 mục: 21 query hoặc 2 query theo lô\");\n}",
      "expectedOutput": "20 mục: 21 query hoặc 2 query theo lô",
      "hints": [
        "checked_add mô tả overflow bằng Option.",
        "Không giả định rows luôn nhỏ chỉ vì dataset mẫu nhỏ."
      ],
      "quiz": {
        "question": "EXPLAIN ANALYZE của một UPDATE trên database thật có thực hiện UPDATE không?",
        "options": [
          "Không, chỉ dự đoán.",
          "Có, vì ANALYZE thu số đo thực thi.",
          "Chỉ khi có index."
        ],
        "correct": 1,
        "explanation": "Nó thực thi statement. Dùng môi trường thử phù hợp và hiểu transaction/side effects trước khi đo câu lệnh ghi."
      },
      "reference": {
        "label": "PostgreSQL — sử dụng EXPLAIN",
        "url": "https://www.postgresql.org/docs/current/using-explain.html"
      }
    },
    {
      "id": "backend-migrations",
      "moduleId": "track-backend",
      "title": "Migration tương thích và thay đổi dữ liệu đang phục vụ",
      "description": "Thay đổi schema theo nhiều bước, kiểm tra phiên bản ứng dụng và chuẩn bị phương án khôi phục.",
      "duration": 60,
      "objectives": [
        "Lập kế hoạch expand–migrate–contract.",
        "Phân biệt rollback ứng dụng với khôi phục dữ liệu.",
        "Kiểm thử migration trên dữ liệu có từ phiên bản trước."
      ],
      "sections": [
        {
          "title": "Hai phiên bản có thể cùng chạy",
          "text": "Trong rolling deployment, instance cũ và mới có thể đọc cùng database. Nếu bản mới đổi tên cột rồi instance cũ tiếp tục query tên cũ, hệ thống sẽ lỗi giữa lần phát hành. Một cách tổ chức là mở rộng schema trước, cho ứng dụng chuyển dần sang biểu diễn mới, rồi thu hẹp khi không còn consumer cũ. Ví dụ tách full_name thành display_name và legal_name: thêm cột mới có quy tắc null rõ, backfill theo lô, triển khai code đọc tương thích, sau đó mới bỏ cột cũ. Không phải mọi thay đổi đều cần ba release, nhưng phải xác định rõ thời điểm mất tương thích."
        },
        {
          "title": "Backfill là một công việc có trạng thái",
          "text": "Bảng lớn không nên được cập nhật toàn bộ bằng vòng lặp trong handler. Chia theo khóa ổn định, lưu checkpoint và thiết kế để chạy lại không làm hỏng những hàng đã chuyển. Quy tắc dữ liệu phải có phiên bản: một chuỗi rỗng ở hệ thống cũ có nghĩa gì trong schema mới? Đừng tự đoán dữ liệu nghiệp vụ không có thông tin. Đếm số hàng đã chuyển, chưa chuyển và bị loại để có thể đối chiếu tổng. Khi database vẫn nhận ghi, cần xử lý hàng xuất hiện hoặc thay đổi trong lúc backfill, chẳng hạn dual-write có kiểm soát hoặc một lượt đối soát sau cùng."
        },
        {
          "title": "Khóa, transaction và khả năng phục hồi",
          "text": "Một migration đúng logic vẫn có thể khóa bảng lâu và làm request timeout. Trước phát hành, đo với kích thước dữ liệu đại diện, đặt giới hạn thời gian phù hợp và hiểu hành vi DDL của database sử dụng. SQLite và PostgreSQL không có toàn bộ semantics giống nhau; test SQLite không chứng minh thao tác DDL hoặc cạnh tranh trên PostgreSQL. Không sửa file migration đã áp dụng rồi mong checksum vẫn hợp lệ. Tạo migration mới để giữ lịch sử có thể giải thích. Backup phải được kiểm tra restore, vì một file backup tồn tại chưa chứng minh có thể khôi phục được dịch vụ."
        },
        {
          "title": "Rollback không làm dữ liệu tự quay về",
          "text": "Nếu code mới đã ghi giá trị mà code cũ không hiểu, chỉ thay image cũ có thể khiến lỗi nặng hơn. Viết ma trận tương thích giữa phiên bản ứng dụng và schema; xác định bước nào còn rollback được bằng code, bước nào cần sửa tiến hoặc restore dữ liệu. Bài tập kiểm tra khoảng schema mà một ứng dụng chấp nhận. Trong dự án, thêm fixture database phiên bản trước, chạy migration, đọc bằng API hiện tại và kiểm tra tính toàn vẹn. Một người khác phải có thể đọc README để biết lệnh nào thay đổi schema và điều kiện dừng phát hành. Đây là kỹ năng vận hành, không chỉ là viết câu ALTER TABLE thành công trên máy cá nhân."
        }
      ],
      "tip": "Một kế hoạch khôi phục cần nói rõ dữ liệu mới sẽ được xử lý ra sao, không chỉ nêu tên image cũ.",
      "exercise": {
        "title": "Kiểm tra tương thích khi khởi động",
        "instructions": "Hoàn thành hàm đã cho và chạy toàn bộ assertion trong main. Mỗi trường hợp lỗi phải giữ đúng trạng thái được mô tả.",
        "requirements": [
          "Bao gồm hai giá trị biên của khoảng schema.",
          "Trả false cho schema quá mới hoặc quá cũ.",
          "Báo lỗi khi khoảng cấu hình đảo ngược."
        ]
      },
      "starterCode": "\nfn compatible(schema: u32, minimum: u32, maximum: u32) -> Result<bool, &'static str> {\n    todo!(\"Hoàn thành yêu cầu bài tập\")\n}\nfn main() {\n    assert_eq!(compatible(3, 2, 4), Ok(true));\n    assert_eq!(compatible(2, 2, 4), Ok(true));\n    assert_eq!(compatible(5, 2, 4), Ok(false));\n    assert_eq!(compatible(1, 2, 4), Ok(false));\n    assert_eq!(compatible(3, 4, 2), Err(\"invalid_range\"));\n    println!(\"Chỉ nhận schema trong khoảng tương thích\");\n}",
      "solutionCode": "\nfn compatible(schema: u32, minimum: u32, maximum: u32) -> Result<bool, &'static str> {\n    if minimum > maximum { return Err(\"invalid_range\"); }\n    Ok((minimum..=maximum).contains(&schema))\n}\nfn main() {\n    assert_eq!(compatible(3, 2, 4), Ok(true));\n    assert_eq!(compatible(2, 2, 4), Ok(true));\n    assert_eq!(compatible(5, 2, 4), Ok(false));\n    assert_eq!(compatible(1, 2, 4), Ok(false));\n    assert_eq!(compatible(3, 4, 2), Err(\"invalid_range\"));\n    println!(\"Chỉ nhận schema trong khoảng tương thích\");\n}",
      "expectedOutput": "Chỉ nhận schema trong khoảng tương thích",
      "hints": [
        "RangeInclusive thể hiện hai đầu cùng được chấp nhận.",
        "Kiểm tra cấu hình trước khi trả kết quả tương thích."
      ],
      "quiz": {
        "question": "Bản mới ghi một trạng thái mà bản cũ không hiểu. Rollback image cũ có luôn an toàn không?",
        "options": [
          "Có, schema không đổi thì luôn an toàn.",
          "Có nếu đổi port.",
          "Không; cần kiểm tra tương thích dữ liệu và kế hoạch sửa tiến/khôi phục."
        ],
        "correct": 2,
        "explanation": "Tương thích gồm cả nghĩa của dữ liệu. Schema vật lý giống nhau không bảo đảm phiên bản cũ xử lý được trạng thái mới."
      },
      "reference": {
        "label": "SQLx — migration có phiên bản",
        "url": "https://docs.rs/sqlx/0.8.6/sqlx/migrate/index.html"
      }
    },
    {
      "id": "backend-idempotency",
      "moduleId": "track-backend",
      "title": "Idempotency và yêu cầu được gửi lại",
      "description": "Lưu khóa chống lặp gắn với chủ thể và nội dung, xử lý timeout sau commit và xung đột payload.",
      "duration": 60,
      "objectives": [
        "Phân biệt lặp an toàn với chỉ kiểm tra trùng ID.",
        "Thiết kế khóa theo scope và fingerprint nội dung.",
        "Kiểm thử cùng khóa/cùng dữ liệu và cùng khóa/khác dữ liệu."
      ],
      "sections": [
        {
          "title": "Client không biết server đã commit chưa",
          "text": "Một khách hàng đặt hàng, server trừ tồn kho và commit, nhưng kết nối bị ngắt trước khi response đến nơi. Client chỉ thấy timeout. Nếu gửi lại cùng POST mà server tạo đơn mới, tồn kho bị trừ hai lần. Idempotency key giúp client nhận lại kết quả của cùng một ý định. Nó không phải thuật toán làm mạng trở nên exactly-once; nó là quy tắc nhận diện và ghi nhớ thao tác tại một ranh giới cụ thể. Chỉ retry tự động những thao tác có hợp đồng phù hợp và nằm trong thời hạn của yêu cầu gốc."
        },
        {
          "title": "Khóa phải gắn với scope và nội dung",
          "text": "Dùng tổ hợp user hoặc workspace, loại thao tác và key làm khóa duy nhất. Nếu key chỉ duy nhất toàn hệ thống, người khác có thể xung đột với yêu cầu của bạn. Ghi fingerprint của command sau validation cùng kết quả hoặc ID tài nguyên. Khi cùng key nhưng payload khác, trả xung đột; không trả kết quả cũ như thể input mới đã được xử lý. Fingerprint cần biểu diễn ổn định những trường có ý nghĩa, không hash nguyên JSON khi thứ tự thuộc tính hay khoảng trắng không thuộc ngữ nghĩa. Với dữ liệu nhạy cảm, chọn cách lưu và thời gian giữ phù hợp thay vì log toàn bộ request."
        },
        {
          "title": "Tính nguyên tử là phần khó",
          "text": "Nếu ghi đơn hàng trước rồi ghi key sau ở transaction khác, crash giữa hai bước sẽ làm mất bảo vệ. Ghi nghiệp vụ và bản ghi idempotency trong cùng transaction. Hai request đồng thời cùng key phải được phân xử bằng unique constraint hoặc cơ chế database tương đương; kiểm tra SELECT rồi INSERT không đủ nếu không có ràng buộc. Xác định trạng thái đang xử lý và hoàn thành nếu công việc dài. Quy định thời gian giữ key rõ: xóa quá sớm làm request cũ có thể được coi là mới. Không giữ lock transaction trong lúc gọi dịch vụ ngoài trong nhiều giây chỉ để chờ một response không kiểm soát được."
        },
        {
          "title": "Kiểm thử trạng thái sau lỗi",
          "text": "Test không chỉ kiểm tra status 200. Sau hai lần gửi cùng key, đếm số đơn hàng, tồn kho, số sự kiện và response trả về. Gửi lại cùng key với số lượng khác phải không tạo đơn thứ hai. Thử key giống nhau ở hai workspace để xác nhận scope đúng. Bài tập dùng map trong bộ nhớ để diễn đạt quyết định replay, conflict hoặc create; lab đơn hàng chuyển quy tắc sang SQLite transaction thật. Sau khi làm xong, hãy giải thích tình huống server commit nhưng client timeout và chỉ ra dữ liệu nào giúp retry trả kết quả ổn định. Câu trả lời phải dựa trên transaction và constraint, không dựa vào một cờ boolean trong handler."
        }
      ],
      "tip": "Chống lặp phải bảo vệ cả dữ liệu nghiệp vụ và dấu vết nhận diện yêu cầu trong cùng transaction.",
      "exercise": {
        "title": "Quyết định tạo mới, phát lại hay xung đột",
        "instructions": "Hoàn thành hàm đã cho và chạy toàn bộ assertion trong main. Mỗi trường hợp lỗi phải giữ đúng trạng thái được mô tả.",
        "requirements": [
          "Không ghi thêm khi cùng key và fingerprint.",
          "Từ chối cùng key nhưng nội dung khác.",
          "Không nhận key rỗng và không thay bản ghi cũ khi lỗi."
        ]
      },
      "starterCode": "use std::collections::BTreeMap;\nfn reserve(records: &mut BTreeMap<String, (String, u64)>, key: &str, fingerprint: &str, new_id: u64) -> Result<(u64, bool), &'static str> {\n    todo!(\"Hoàn thành yêu cầu bài tập\")\n}\nfn main() {\n    let mut records = BTreeMap::new();\n    assert_eq!(reserve(&mut records, \"team7:key1\", \"skuA:2\", 10), Ok((10,true)));\n    assert_eq!(reserve(&mut records, \"team7:key1\", \"skuA:2\", 11), Ok((10,false)));\n    assert_eq!(reserve(&mut records, \"team7:key1\", \"skuA:3\", 12), Err(\"payload_conflict\"));\n    assert_eq!(records.len(), 1);\n    assert_eq!(reserve(&mut records, \"\", \"x\", 13), Err(\"empty_key\"));\n    println!(\"Một ý định tạo đúng một đơn\");\n}",
      "solutionCode": "use std::collections::BTreeMap;\nfn reserve(records: &mut BTreeMap<String, (String, u64)>, key: &str, fingerprint: &str, new_id: u64) -> Result<(u64, bool), &'static str> {\n    if key.is_empty() { return Err(\"empty_key\"); }\n    if let Some((saved, id)) = records.get(key) {\n        return if saved == fingerprint { Ok((*id, false)) } else { Err(\"payload_conflict\") };\n    }\n    records.insert(key.to_owned(), (fingerprint.to_owned(), new_id));\n    Ok((new_id, true))\n}\nfn main() {\n    let mut records = BTreeMap::new();\n    assert_eq!(reserve(&mut records, \"team7:key1\", \"skuA:2\", 10), Ok((10,true)));\n    assert_eq!(reserve(&mut records, \"team7:key1\", \"skuA:2\", 11), Ok((10,false)));\n    assert_eq!(reserve(&mut records, \"team7:key1\", \"skuA:3\", 12), Err(\"payload_conflict\"));\n    assert_eq!(records.len(), 1);\n    assert_eq!(reserve(&mut records, \"\", \"x\", 13), Err(\"empty_key\"));\n    println!(\"Một ý định tạo đúng một đơn\");\n}",
      "expectedOutput": "Một ý định tạo đúng một đơn",
      "hints": [
        "Kiểm tra bản ghi đã có trước khi insert.",
        "Bool trong kết quả cho biết có tạo mới không."
      ],
      "quiz": {
        "question": "Hai request cùng key chạy đồng thời. Điều gì bảo vệ dữ liệu ngoài kiểm tra trong Rust?",
        "options": [
          "Unique constraint và transaction bao gồm cả nghiệp vụ lẫn key.",
          "Một SELECT trước INSERT là đủ.",
          "Tăng timeout."
        ],
        "correct": 0,
        "explanation": "Hai request có thể cùng không thấy key. Database phải phân xử cạnh tranh, và tác dụng phụ phải cùng transaction với bản ghi chống lặp."
      },
      "reference": {
        "label": "PostgreSQL — ràng buộc duy nhất",
        "url": "https://www.postgresql.org/docs/current/ddl-constraints.html"
      },
      "simulation": {
        "title": "Theo dấu một lần đặt hàng và lần gửi lại",
        "description": "Quan sát database sau mỗi mốc; timeout ở client không quay ngược transaction đã commit.",
        "kind": "sequence",
        "nodes": [
          {
            "id": "client",
            "label": "Client",
            "detail": "Gửi key cùng command."
          },
          {
            "id": "api",
            "label": "API",
            "detail": "Kiểm tra scope và fingerprint."
          },
          {
            "id": "db",
            "label": "Transaction",
            "detail": "Ghi kho, đơn và key cùng nhau."
          },
          {
            "id": "reply",
            "label": "Response",
            "detail": "Trả mã đơn ổn định."
          }
        ],
        "scenarios": [
          {
            "id": "new",
            "label": "Yêu cầu mới",
            "steps": [
              {
                "title": "Nhận ý định",
                "description": "Client gửi key A, mua 2 sản phẩm.",
                "activeNodeIds": [
                  "client"
                ],
                "values": [
                  {
                    "label": "Kho",
                    "value": "5"
                  },
                  {
                    "label": "Đơn",
                    "value": "0"
                  }
                ]
              },
              {
                "title": "Kiểm tra key",
                "description": "Chưa có key trong scope khách hàng.",
                "activeNodeIds": [
                  "api",
                  "db"
                ],
                "values": [
                  {
                    "label": "Key A",
                    "value": "Chưa có"
                  }
                ]
              },
              {
                "title": "Commit",
                "description": "Trừ 2 và tạo đơn10 trong một transaction.",
                "activeNodeIds": [
                  "db"
                ],
                "values": [
                  {
                    "label": "Kho",
                    "value": "3"
                  },
                  {
                    "label": "Đơn",
                    "value": "1"
                  },
                  {
                    "label": "Key A",
                    "value": "Đơn10"
                  }
                ]
              },
              {
                "title": "Trả kết quả",
                "description": "Client nhận đơn10.",
                "activeNodeIds": [
                  "reply"
                ],
                "values": [
                  {
                    "label": "replayed",
                    "value": "false"
                  }
                ]
              }
            ]
          },
          {
            "id": "timeout",
            "label": "Timeout sau commit",
            "steps": [
              {
                "title": "Commit đã xong",
                "description": "Đơn10 và key A đã bền trong database.",
                "activeNodeIds": [
                  "db"
                ],
                "values": [
                  {
                    "label": "Kho",
                    "value": "3"
                  },
                  {
                    "label": "Đơn",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Client timeout",
                "description": "Response chưa đến; client không biết kết quả.",
                "activeNodeIds": [
                  "client",
                  "reply"
                ],
                "values": [
                  {
                    "label": "Trạng thái client",
                    "value": "Chưa biết"
                  }
                ]
              },
              {
                "title": "Gửi lại key A",
                "description": "Cùng scope và fingerprint được nhận diện.",
                "activeNodeIds": [
                  "api",
                  "db"
                ],
                "values": [
                  {
                    "label": "Key A",
                    "value": "Đơn10"
                  },
                  {
                    "label": "Payload",
                    "value": "Giống"
                  }
                ]
              },
              {
                "title": "Replay",
                "description": "Trả đơn10, không trừ kho lần hai.",
                "activeNodeIds": [
                  "reply"
                ],
                "values": [
                  {
                    "label": "Kho",
                    "value": "3"
                  },
                  {
                    "label": "Đơn",
                    "value": "1"
                  },
                  {
                    "label": "replayed",
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
      "id": "backend-outbox",
      "moduleId": "track-backend",
      "title": "Outbox, worker và xử lý sự kiện ít nhất một lần",
      "description": "Giữ thay đổi nghiệp vụ cùng sự kiện, thiết kế consumer chống lặp và phục hồi sau crash.",
      "duration": 60,
      "objectives": [
        "Giải thích khoảng trống giữa commit database và gửi sự kiện.",
        "Thiết kế outbox cùng transaction.",
        "Phân biệt event ID, ordering và deduplication ở consumer."
      ],
      "sections": [
        {
          "title": "Hai hệ thống không cùng một transaction",
          "text": "Sau khi tạo công việc, dịch vụ cần gửi thông báo. Nếu gửi trước commit, người dùng có thể nhận thông báo cho dữ liệu cuối cùng bị rollback. Nếu commit trước rồi gửi, crash giữa hai bước khiến thông báo mất. Outbox lưu ý định phát sự kiện trong cùng database transaction với thay đổi nghiệp vụ. Worker đọc những ý định chưa xử lý và gửi chúng sau đó. Vì hai hàng cùng commit hoặc cùng rollback, một trạng thái đã được chấp nhận sẽ có dấu vết để xử lý tiếp. Điều này chưa làm dịch vụ gửi thông báo và database thành một transaction phân tán."
        },
        {
          "title": "Gửi thành công rồi crash vẫn có thể lặp",
          "text": "Worker gửi sự kiện thành công nhưng chết trước khi đánh dấu delivered. Lần chạy sau sẽ gửi lại. Vì thế consumer cần nhận event ID ổn định và có quy tắc chống lặp phù hợp. Nếu consumer lưu dữ liệu, ghi event ID đã xử lý và thay đổi nghiệp vụ của consumer trong cùng transaction. Đừng dùng timestamp hiện tại làm event ID mỗi lần retry vì nó biến cùng sự kiện thành nhiều sự kiện khác nhau. Đánh dấu delivered trước khi gửi đổi lỗi lặp thành lỗi mất dữ liệu; đó không phải cách khắc phục chung."
        },
        {
          "title": "Thứ tự và quyền sở hữu công việc",
          "text": "Nếu việc mở rồi đóng một công việc được phát song song, consumer có thể nhận đóng trước mở. Gắn aggregate ID và version khi cần kiểm tra thứ tự theo một tài nguyên. Không nhất thiết yêu cầu thứ tự toàn cục vì nó giới hạn song song. Với nhiều worker, cần claim có lease hoặc khóa phù hợp để hạn chế xử lý trùng; lease hết không tự chứng minh worker cũ đã dừng. Những tác dụng phụ cần chịu được xử lý lặp. Giới hạn batch, số lần retry và vùng lưu sự kiện lỗi để một poison message không chặn toàn bộ hệ thống."
        },
        {
          "title": "Từ ví dụ đến kiểm thử phục hồi",
          "text": "Bắt đầu bằng một bảng outbox có event_id, aggregate_id, version, payload và thời điểm xử lý. Lab capstone ghi task và outbox trong transaction, sau đó người học mở rộng thành worker gửi đến sink thử. Test phải chủ động dừng sau bước gửi nhưng trước bước đánh dấu, chạy lại và chứng minh consumer chỉ áp dụng tác dụng phụ một lần. Bài tập thu nhỏ phần consumer thành tập ID đã xử lý, có kiểm tra tràn bộ đếm trước khi cập nhật cả hai cấu trúc. Sau đó hãy nêu rõ những bảo đảm chỉ đúng trong bộ nhớ và điều cần thay bằng transaction khi tiến trình có thể bị khởi động lại."
        }
      ],
      "tip": "Outbox thường chấp nhận giao lại sự kiện; consumer đúng phải xử lý được việc đó.",
      "exercise": {
        "title": "Consumer áp dụng tác dụng phụ một lần theo event ID",
        "instructions": "Hoàn thành hàm đã cho và chạy toàn bộ assertion trong main. Mỗi trường hợp lỗi phải giữ đúng trạng thái được mô tả.",
        "requirements": [
          "Bỏ qua event ID đã xử lý.",
          "Kiểm tra overflow trước khi đổi total hoặc seen.",
          "Giữ nguyên trạng thái khi lỗi."
        ]
      },
      "starterCode": "use std::collections::BTreeSet;\nfn apply_event(seen: &mut BTreeSet<u64>, total: &mut u64, event_id: u64, amount: u64) -> Result<bool, &'static str> {\n    todo!(\"Hoàn thành yêu cầu bài tập\")\n}\nfn main() {\n    let mut seen=BTreeSet::new(); let mut total=0;\n    assert_eq!(apply_event(&mut seen,&mut total,7,5),Ok(true));\n    assert_eq!(apply_event(&mut seen,&mut total,7,5),Ok(false));\n    assert_eq!(total,5);\n    assert_eq!(apply_event(&mut seen,&mut total,8,u64::MAX),Err(\"overflow\"));\n    assert!(!seen.contains(&8)); assert_eq!(total,5);\n    println!(\"Phát lại sự kiện không cộng hai lần\");\n}",
      "solutionCode": "use std::collections::BTreeSet;\nfn apply_event(seen: &mut BTreeSet<u64>, total: &mut u64, event_id: u64, amount: u64) -> Result<bool, &'static str> {\n    if seen.contains(&event_id) { return Ok(false); }\n    let next = total.checked_add(amount).ok_or(\"overflow\")?;\n    seen.insert(event_id);\n    *total = next;\n    Ok(true)\n}\nfn main() {\n    let mut seen=BTreeSet::new(); let mut total=0;\n    assert_eq!(apply_event(&mut seen,&mut total,7,5),Ok(true));\n    assert_eq!(apply_event(&mut seen,&mut total,7,5),Ok(false));\n    assert_eq!(total,5);\n    assert_eq!(apply_event(&mut seen,&mut total,8,u64::MAX),Err(\"overflow\"));\n    assert!(!seen.contains(&8)); assert_eq!(total,5);\n    println!(\"Phát lại sự kiện không cộng hai lần\");\n}",
      "expectedOutput": "Phát lại sự kiện không cộng hai lần",
      "hints": [
        "Tính next trước khi commit thay đổi trong bộ nhớ.",
        "Seen phải được ghi cùng thời điểm với total."
      ],
      "quiz": {
        "question": "Worker gửi thành công nhưng chết trước khi đánh dấu delivered. Consumer cần gì?",
        "options": [
          "Event ID ổn định và cập nhật chống lặp cùng tác dụng phụ.",
          "Không cần gì, mạng luôn gửi đúng một lần.",
          "Đánh dấu mọi sự kiện hoàn thành từ trước."
        ],
        "correct": 0,
        "explanation": "Retry có thể gửi lại. Consumer cần quy tắc deduplication; đánh dấu trước khi gửi có thể mất sự kiện."
      },
      "reference": {
        "label": "SQLx — transaction cho thay đổi nguyên tử",
        "url": "https://docs.rs/sqlx/0.8.6/sqlx/struct.Transaction.html"
      },
      "simulation": {
        "title": "Worker crash ở ranh giới gửi và đánh dấu",
        "description": "Theo dõi một event ID qua producer, outbox và consumer có chống lặp.",
        "kind": "pipeline",
        "nodes": [
          {
            "id": "producer",
            "label": "Nghiệp vụ",
            "detail": "Đổi task và tạo event."
          },
          {
            "id": "outbox",
            "label": "Outbox",
            "detail": "Lưu event chưa phát."
          },
          {
            "id": "worker",
            "label": "Worker",
            "detail": "Gửi rồi đánh dấu."
          },
          {
            "id": "consumer",
            "label": "Consumer",
            "detail": "Ghi event ID và tác dụng phụ."
          }
        ],
        "scenarios": [
          {
            "id": "normal",
            "label": "Xử lý bình thường",
            "steps": [
              {
                "title": "Commit nghiệp vụ",
                "description": "Task version2 cùng event7 được ghi.",
                "activeNodeIds": [
                  "producer",
                  "outbox"
                ],
                "values": [
                  {
                    "label": "Task",
                    "value": "v2"
                  },
                  {
                    "label": "Event7",
                    "value": "Chờ"
                  }
                ]
              },
              {
                "title": "Đọc event",
                "description": "Worker lấy một batch hữu hạn.",
                "activeNodeIds": [
                  "outbox",
                  "worker"
                ],
                "values": [
                  {
                    "label": "Batch",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Áp dụng",
                "description": "Consumer ghi event7 và thông báo cùng transaction.",
                "activeNodeIds": [
                  "consumer"
                ],
                "values": [
                  {
                    "label": "Thông báo",
                    "value": "1"
                  },
                  {
                    "label": "Seen7",
                    "value": "Có"
                  }
                ]
              },
              {
                "title": "Hoàn tất",
                "description": "Worker nhận ACK và đánh dấu đã giao.",
                "activeNodeIds": [
                  "worker",
                  "outbox"
                ],
                "values": [
                  {
                    "label": "Event7",
                    "value": "Đã giao"
                  }
                ]
              }
            ]
          },
          {
            "id": "crash",
            "label": "Crash sau khi gửi",
            "steps": [
              {
                "title": "Consumer nhận",
                "description": "Event7 đã tạo một thông báo.",
                "activeNodeIds": [
                  "consumer"
                ],
                "values": [
                  {
                    "label": "Thông báo",
                    "value": "1"
                  },
                  {
                    "label": "Seen7",
                    "value": "Có"
                  }
                ]
              },
              {
                "title": "Worker chết",
                "description": "Chưa ghi delivered vào outbox.",
                "activeNodeIds": [
                  "worker",
                  "outbox"
                ],
                "values": [
                  {
                    "label": "Event7",
                    "value": "Chờ"
                  }
                ]
              },
              {
                "title": "Phát lại",
                "description": "Worker mới gửi lại cùng event ID7.",
                "activeNodeIds": [
                  "worker",
                  "consumer"
                ],
                "values": [
                  {
                    "label": "ID phát lại",
                    "value": "7"
                  }
                ]
              },
              {
                "title": "Bỏ trùng",
                "description": "Consumer thấy Seen7 nên giữ nguyên tác dụng phụ.",
                "activeNodeIds": [
                  "consumer"
                ],
                "values": [
                  {
                    "label": "Thông báo",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Đánh dấu",
                "description": "ACK mới cho phép hoàn tất outbox.",
                "activeNodeIds": [
                  "outbox"
                ],
                "values": [
                  {
                    "label": "Event7",
                    "value": "Đã giao"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "backend-retries-deadlines",
      "moduleId": "track-backend",
      "title": "Deadline, retry budget và giới hạn tài nguyên",
      "description": "Thiết kế retry hữu hạn, phân bổ thời gian chờ và tránh khuếch đại tải khi phụ thuộc lỗi.",
      "duration": 60,
      "objectives": [
        "Truyền phần thời gian còn lại qua các bước.",
        "Chỉ retry lỗi và thao tác phù hợp.",
        "Giới hạn tổng lần thử và thời gian chờ."
      ],
      "sections": [
        {
          "title": "Một timeout riêng không phải deadline toàn request",
          "text": "Một request có ba bước, mỗi bước timeout hai giây, có thể tốn gần sáu giây dù người dùng chỉ chấp nhận ba giây. Deadline biểu diễn thời điểm cuối của cả thao tác; mỗi bước dùng phần thời gian còn lại và chừa ngân sách cho trả response. Tách connect timeout, chờ pool và thực thi query vì chúng cho biết lỗi ở những tài nguyên khác nhau. Đồng hồ đo khoảng thời gian nên có tính đơn điệu; không lấy giờ lịch có thể bị điều chỉnh để trừ thời lượng trong tiến trình. Trong Rust, Instant phù hợp cho những deadline nội bộ như vậy."
        },
        {
          "title": "Retry là một request mới tiêu thụ tài nguyên",
          "text": "Khi một phụ thuộc đã quá tải, retry không giới hạn làm hàng đợi dài hơn. Đặt số lần thử, backoff có giới hạn, jitter và ngân sách thời gian tổng. Chỉ retry loại lỗi được hợp đồng cho phép; lỗi validation hoặc thiếu quyền không trở nên đúng sau khi ngủ. Nếu thao tác có tác dụng phụ, phải biết retry có an toàn không hoặc có idempotency key. Đừng thêm retry ở mọi tầng: client thử ba lần, API thử ba lần và repository thử ba lần có thể khuếch đại thành nhiều lượt gọi cho một ý định."
        },
        {
          "title": "Hủy future có giới hạn của nó",
          "text": "Bọc một future bằng timeout có thể ngừng chờ khi thời hạn hết, nhưng không bảo đảm tác dụng phụ chưa xảy ra. Một câu lệnh đã commit hoặc tác vụ blocking đã chạy có thể tiếp tục ngoài phạm vi chờ của bạn. Vì thế sau timeout cần phân loại trạng thái không biết và đường đối soát thay vì tự động trả rằng thao tác chắc chắn thất bại. Với worker, cancellation cần phối hợp ở ranh giới an toàn giữa các đơn vị công việc. Giữ permits hoặc lock quá lâu trong lúc backoff cũng làm mất năng lực xử lý dù không có công việc hữu ích đang chạy."
        },
        {
          "title": "Đo retry có tạo giá trị không",
          "text": "Ghi số lần thử, nguyên nhân, tổng thời gian và tỷ lệ thành công sau retry. Metric này giúp phân biệt retry cứu lỗi tạm thời với retry chỉ kéo dài thất bại. Test bằng đồng hồ hoặc dữ liệu thời gian được truyền vào, không làm test ngủ nhiều giây. Bài tập tính số lần thử có thể nằm trong deadline cho các khoảng chờ đã cho, bao gồm thời gian xử lý của từng lần. Trong dự án, chạy phụ thuộc giả trả lỗi tạm thời rồi hồi phục, phụ thuộc luôn lỗi và request đã hết ngân sách. Mỗi trường hợp phải có số lần gọi tối đa quan sát được; một cấu hình backoff đẹp trên giấy chưa chứng minh điều đó."
        }
      ],
      "tip": "Đặt retry tại tầng biết cả ý nghĩa nghiệp vụ và ngân sách thời gian, tránh nhân số lần thử giữa các tầng.",
      "exercise": {
        "title": "Tính số lần thử trong ngân sách",
        "instructions": "Hoàn thành hàm đã cho và chạy toàn bộ assertion trong main. Mỗi trường hợp lỗi phải giữ đúng trạng thái được mô tả.",
        "requirements": [
          "Mỗi lần thử tiêu tốn work.",
          "Các lần tiếp theo thêm thời gian wait tương ứng.",
          "Không vượt budget hoặc tràn u64."
        ]
      },
      "starterCode": "\nfn attempts(budget: u64, work: u64, waits: &[u64]) -> usize {\n    todo!(\"Hoàn thành yêu cầu bài tập\")\n}\nfn main() {\n    assert_eq!(attempts(100,20,&[10,20,40]),3);\n    assert_eq!(attempts(19,20,&[1]),0);\n    assert_eq!(attempts(20,20,&[0]),1);\n    assert_eq!(attempts(u64::MAX,u64::MAX,&[1]),1);\n    assert_eq!(attempts(100,0,&[1]),0);\n    println!(\"Ngân sách 100 ms cho tối đa 3 lần thử\");\n}",
      "solutionCode": "\nfn attempts(budget: u64, work: u64, waits: &[u64]) -> usize {\n    if work == 0 || work > budget { return 0; }\n    let mut used=work; let mut count=1;\n    for wait in waits {\n        let Some(next)=used.checked_add(*wait).and_then(|v|v.checked_add(work)) else { break; };\n        if next > budget { break; }\n        used=next; count+=1;\n    }\n    count\n}\nfn main() {\n    assert_eq!(attempts(100,20,&[10,20,40]),3);\n    assert_eq!(attempts(19,20,&[1]),0);\n    assert_eq!(attempts(20,20,&[0]),1);\n    assert_eq!(attempts(u64::MAX,u64::MAX,&[1]),1);\n    assert_eq!(attempts(100,0,&[1]),0);\n    println!(\"Ngân sách 100 ms cho tối đa 3 lần thử\");\n}",
      "expectedOutput": "Ngân sách 100 ms cho tối đa 3 lần thử",
      "hints": [
        "Lần đầu không có backoff.",
        "checked_add giúp xử lý giá trị biên mà không panic."
      ],
      "quiz": {
        "question": "API timeout sau khi database có thể đã commit. Client nên hiểu gì?",
        "options": [
          "Kết quả chưa biết; cần retry có idempotency hoặc tra cứu trạng thái.",
          "Chắc chắn chưa có thay đổi.",
          "Chắc chắn đã thành công."
        ],
        "correct": 0,
        "explanation": "Timeout mô tả việc không nhận kết quả đúng hạn, không chứng minh trạng thái của tác dụng phụ."
      },
      "reference": {
        "label": "Tokio — timeout",
        "url": "https://docs.rs/tokio/latest/tokio/time/fn.timeout.html"
      }
    },
    {
      "id": "backend-observability",
      "moduleId": "track-backend",
      "title": "Quan sát dịch vụ qua SLI, trace và giả thuyết",
      "description": "Chọn tín hiệu theo hành vi người dùng, đọc percentile và điều tra sự cố bằng bằng chứng.",
      "duration": 60,
      "objectives": [
        "Phân biệt throughput, error rate và latency percentile.",
        "Tránh cardinality không giới hạn trong metric.",
        "Viết một giả thuyết có phép đo để bác bỏ."
      ],
      "sections": [
        {
          "title": "Tín hiệu phải gắn với kết quả của người dùng",
          "text": "CPU thấp không chứng minh dịch vụ tốt: server có thể đang chờ database hoặc bị nghẽn pool. Bắt đầu từ tỷ lệ request thành công, thời gian phản hồi và lượng công việc hoàn thành trong một cửa sổ. Định nghĩa thành công theo hợp đồng; một lỗi validation dự kiến có thể được thống kê riêng với lỗi hạ tầng. Nếu có worker, thêm tuổi của công việc lâu nhất chưa xử lý để thấy độ trễ mà HTTP 202 không phản ánh. Mục tiêu độ tin cậy cần có cửa sổ thời gian và mẫu số rõ; nói hệ thống nhanh chỉ vì một request trả 200 không có giá trị đánh giá."
        },
        {
          "title": "Percentile và dữ liệu bị che khuất",
          "text": "Trung bình tốt vẫn có thể che nhiều request rất chậm. p95 mô tả một điểm trong phân bố đã đo, không phải bảo đảm cho từng người dùng. Không lấy trung bình các p95 của từng instance để suy ra p95 toàn hệ thống; cần dữ liệu histogram hoặc phân bố có thể tổng hợp đúng. Ghi số mẫu, thời gian đo, tải đưa vào và loại request. Hãy phân biệt thời gian ở server với thời gian người dùng thấy, vì queue trước server và truyền mạng có thể bị bỏ qua. Trong bài tập, nearest-rank được định nghĩa rõ cho một tập mẫu hữu hạn để tránh mơ hồ về phép tính."
        },
        {
          "title": "Log, metric và trace có vai trò khác nhau",
          "text": "Metric giúp nhận ra xu hướng, log chứa sự kiện có ngữ cảnh, trace nối các bước của một request. Dùng route template làm nhãn metric thay vì URL có ID, nếu không số series có thể tăng theo người dùng. Request ID hữu ích trong log nhưng thường không nên trở thành label metric. Trace nên cho thấy chờ pool, query và gọi phụ thuộc riêng; một span bao cả handler chỉ nói tổng thời gian. Chỉ ghi thông tin cần điều tra, không ghi nguyên body hoặc credential. Chi phí quan sát cũng là tài nguyên cần được kiểm soát bằng sampling và retention phù hợp."
        },
        {
          "title": "Điều tra bằng vòng lặp giả thuyết",
          "text": "Ví dụ p95 tăng nhưng throughput giảm và CPU thấp. Giả thuyết đầu tiên có thể là thời gian chờ pool tăng. Đo pool wait và số kết nối đang dùng; nếu không tăng, bác bỏ rồi kiểm tra hàng đợi hoặc phụ thuộc. Đừng thay cùng lúc pool_size, số replica và query vì không thể biết nguyên nhân cải thiện. Trong dự án, tạo một lỗi có kiểm soát như sink worker phản hồi chậm, quan sát backlog, khôi phục và xác nhận backlog giảm. Bản bàn giao gồm dữ liệu đo và lệnh tái hiện, không chỉ ảnh dashboard. Người học đạt mục tiêu khi có thể giải thích một sự cố từ tín hiệu, chọn can thiệp nhỏ và kiểm chứng tác động của nó."
        }
      ],
      "tip": "Một số đo đáng tin cần đi kèm cách lấy mẫu, cửa sổ thời gian và đơn vị.",
      "exercise": {
        "title": "Tính percentile theo nearest-rank",
        "instructions": "Hoàn thành hàm đã cho và chạy toàn bộ assertion trong main. Mỗi trường hợp lỗi phải giữ đúng trạng thái được mô tả.",
        "requirements": [
          "Tập rỗng trả None.",
          "Sắp xếp bản sao, không sửa input.",
          "Dùng rank ceil(0.95*n), đánh số từ 1."
        ]
      },
      "starterCode": "\nfn p95(samples: &[u64]) -> Option<u64> {\n    todo!(\"Hoàn thành yêu cầu bài tập\")\n}\nfn main() {\n    assert_eq!(p95(&[]),None);\n    assert_eq!(p95(&[7]),Some(7));\n    assert_eq!(p95(&(1..=20).collect::<Vec<_>>()),Some(19));\n    assert_eq!(p95(&[100,3,1,2]),Some(100));\n    println!(\"p95 của 20 mẫu từ 1 đến 20 là 19\");\n}",
      "solutionCode": "\nfn p95(samples: &[u64]) -> Option<u64> {\n    if samples.is_empty() { return None; }\n    let mut values=samples.to_vec(); values.sort_unstable();\n    let rank=values.len()-values.len()/20;\n    Some(values[rank-1])\n}\nfn main() {\n    assert_eq!(p95(&[]),None);\n    assert_eq!(p95(&[7]),Some(7));\n    assert_eq!(p95(&(1..=20).collect::<Vec<_>>()),Some(19));\n    assert_eq!(p95(&[100,3,1,2]),Some(100));\n    println!(\"p95 của 20 mẫu từ 1 đến 20 là 19\");\n}",
      "expectedOutput": "p95 của 20 mẫu từ 1 đến 20 là 19",
      "hints": [
        "Chỉ số Vec bắt đầu từ 0.",
        "Với một mẫu, percentile vẫn là mẫu đó."
      ],
      "quiz": {
        "question": "Muốn p95 toàn hệ thống từ nhiều replica, có thể lấy trung bình p95 từng replica không?",
        "options": [
          "Có, luôn chính xác.",
          "Chỉ cần chọn replica nhanh nhất.",
          "Không; cần tổng hợp phân bố hoặc histogram phù hợp."
        ],
        "correct": 2,
        "explanation": "Percentile không tuyến tính. Trung bình các percentile không tái tạo phân bố của toàn bộ request."
      },
      "reference": {
        "label": "Prometheus — histogram và quantile",
        "url": "https://prometheus.io/docs/practices/histograms/"
      }
    },
    {
      "id": "backend-catalog-project",
      "moduleId": "track-backend",
      "title": "Dự án: catalog sản phẩm có API và lưu trữ thật",
      "description": "Ghép Axum, SQLx và SQLite thành API sản phẩm có phân trang, validation và optimistic version.",
      "duration": 100,
      "objectives": [
        "Chạy API thật với dữ liệu bền qua lần khởi động.",
        "Kiểm thử Router và database cùng nhau.",
        "Chứng minh cập nhật cũ không ghi đè dữ liệu mới."
      ],
      "sections": [
        {
          "title": "Hợp đồng của phiên bản đầu",
          "text": "Sản phẩm có tên, giá theo đơn vị nhỏ nhất và version. API tạo sản phẩm, đọc một sản phẩm, liệt kê theo cursor và thay giá khi client gửi đúng version. Tên được trim, giới hạn độ dài rõ và không được rỗng. Giá dùng số nguyên không âm; không nhận float tiền rồi âm thầm làm tròn. Bản đầu phục vụ nội bộ trên loopback, chưa có tài khoản. Việc ghi rõ phạm vi này giúp tập trung nghiệm thu hợp đồng dữ liệu, đồng thời tránh hiểu nhầm rằng một API đã chạy được có nghĩa là đã sẵn sàng công khai."
        },
        {
          "title": "Đi từ tệp đến request",
          "text": "Cargo.toml khai báo Axum, Tokio, SQLx và Serde. schema.sql tạo bảng có constraint bảo vệ giá, tên và version. src/lib.rs chứa Router, handler và các hàm chuyển row thành response; src/main.rs chỉ mở database, khởi tạo schema và listener. Khi chạy cargo run, SQLite tạo catalog.db trong thư mục hiện tại. POST đi qua giải mã JSON, validation, INSERT rồi tạo response 201. GET danh sách lọc id lớn hơn cursor và ORDER BY id trước LIMIT. Cấu trúc này cho phép integration test gọi Router trực tiếp, dùng database thử riêng mà không cần chiếm một cổng mạng."
        },
        {
          "title": "Cập nhật có điều kiện là phần bắt buộc",
          "text": "Hai màn hình có thể cùng đọc version 1. Người thứ nhất đổi giá thành 13000, version trở thành 2. Request thứ hai vẫn mang version 1 phải nhận xung đột và không thay giá. Điều kiện version nằm trong UPDATE, không chỉ kiểm tra bằng SELECT trước đó. Response sau ghi cần gắn với bản cập nhật đã được chấp nhận; dùng RETURNING giúp lấy hàng từ chính statement đó. Người học cần quan sát cả status lẫn dữ liệu cuối cùng. Một test chỉ khẳng định request thứ hai báo lỗi nhưng không đọc lại giá có thể bỏ sót implementation đã sửa dữ liệu rồi mới trả lỗi."
        },
        {
          "title": "Nghiệm thu và mở rộng có kiểm soát",
          "text": "Bắt đầu bằng cargo test, sau đó tạo hai sản phẩm bằng lệnh curl trong README và kiểm tra phân trang. Gửi tên trắng, giá âm, limit bằng 0 và ID không tồn tại. Tắt server, mở lại và xác nhận sản phẩm vẫn có. Sau khi bản đầu đúng, thêm tìm kiếm, migration có fixture từ phiên bản cũ và response lỗi thống nhất cho JSON không hợp lệ. Đừng thêm auth giả bằng cách chấp nhận owner_id từ request; phần danh tính sẽ được áp dụng ở dự án Team Tasks. Bài tập trình duyệt chuyển tiền dạng chuỗi sang đơn vị nhỏ nhất để luyện validation chính xác, tránh sai số float trước khi dữ liệu vào API."
        }
      ],
      "tip": "Chạy dự án tải xuống, giữ lại test lỗi và bổ sung bằng chứng theo rubric trước khi tự nghiệm thu.",
      "exercise": {
        "title": "catalog sản phẩm có API và lưu trữ thật",
        "instructions": "Bài tập trên web luyện bất biến cốt lõi. Dự án Cargo bên dưới triển khai phần HTTP hoặc dữ liệu thật; hoàn thành cả hai để đối chiếu quyết định nghiệp vụ với adapter.",
        "requirements": [
          "Chỉ nhận phần nguyên hoặc phần thập phân đúng hai chữ số.",
          "Không dùng float hoặc âm thầm làm tròn.",
          "Từ chối số âm, ký tự lạ và phép nhân tràn."
        ]
      },
      "starterCode": "\nfn cents(input: &str) -> Result<i64, &'static str> {\n    todo!(\"Hoàn thành quy tắc nghiệp vụ\")\n}\nfn main(){\n assert_eq!(cents(\"12.50\"),Ok(1250)); assert_eq!(cents(\"0\"),Ok(0));\n assert_eq!(cents(\"-1\"),Err(\"format\")); assert_eq!(cents(\"1.234\"),Err(\"format\"));\n assert_eq!(cents(\"1.2\"),Err(\"format\")); assert_eq!(cents(\"\"),Err(\"format\"));\n assert_eq!(cents(\"9223372036854775807\"),Err(\"overflow\"));\n println!(\"12.50 được lưu thành 1250\");\n}",
      "solutionCode": "\nfn cents(input: &str) -> Result<i64, &'static str> {\n    let parts=input.split('.').collect::<Vec<_>>();\n    if parts.is_empty() || parts.len()>2 || parts[0].is_empty() || !parts[0].bytes().all(|b|b.is_ascii_digit()) {return Err(\"format\");}\n    let whole=parts[0].parse::<i64>().map_err(|_|\"overflow\")?;\n    let fraction=if parts.len()==1 {0} else {\n        let f=parts[1];if f.len()!=2 || !f.bytes().all(|b|b.is_ascii_digit()){return Err(\"format\");}\n        f.parse::<i64>().map_err(|_|\"format\")?\n    };\n    whole.checked_mul(100).and_then(|v|v.checked_add(fraction)).ok_or(\"overflow\")\n}\nfn main(){\n assert_eq!(cents(\"12.50\"),Ok(1250)); assert_eq!(cents(\"0\"),Ok(0));\n assert_eq!(cents(\"-1\"),Err(\"format\")); assert_eq!(cents(\"1.234\"),Err(\"format\"));\n assert_eq!(cents(\"1.2\"),Err(\"format\")); assert_eq!(cents(\"\"),Err(\"format\"));\n assert_eq!(cents(\"9223372036854775807\"),Err(\"overflow\"));\n println!(\"12.50 được lưu thành 1250\");\n}",
      "expectedOutput": "12.50 được lưu thành 1250",
      "hints": [
        "Viết các điều kiện từ chối trước khi thay đổi trạng thái.",
        "Kiểm tra tình huống biên và giữ nguyên dữ liệu khi thất bại."
      ],
      "quiz": {
        "question": "Vì sao điều kiện version phải nằm trong UPDATE?",
        "options": [
          "Để JSON ngắn hơn.",
          "Để database phân xử nguyên tử hai cập nhật cạnh tranh.",
          "Để bỏ kiểm thử."
        ],
        "correct": 1,
        "explanation": "SELECT kiểm tra trước rồi UPDATE không có version vẫn có khoảng đua. Điều kiện trong statement ghi bảo vệ lần thay đổi thực sự."
      },
      "reference": {
        "label": "Axum — chia sẻ state",
        "url": "https://docs.rs/axum/0.8.9/axum/extract/struct.State.html"
      },
      "localLab": {
        "title": "Catalog sản phẩm: API Axum với SQLite và cập nhật có version",
        "instructions": "Giải nén và chạy trong thư mục có Cargo.toml. Đây là API nội bộ phục vụ trên loopback, chưa có đăng nhập. Tạo sản phẩm, phân trang và sửa giá qua HTTP; dữ liệu chạy server được lưu trong catalog.db. Bài kiểm thử dùng SQLite riêng trong bộ nhớ. Mở rộng theo các mốc của dự án trước khi đưa API ra Internet.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"catalog-api\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\naxum = \"=0.8.9\"\ntokio = { version = \"1\", features = [\"macros\", \"rt-multi-thread\", \"net\", \"signal\"] }\nsqlx = { version = \"=0.8.6\", default-features = false, features = [\"runtime-tokio\", \"sqlite\"] }\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\n\n[dev-dependencies]\ntower = { version = \"0.5\", features = [\"util\"] }\n"
          },
          {
            "path": "schema.sql",
            "content": "CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL CHECK(length(trim(name))>0),price_cents INTEGER NOT NULL CHECK(price_cents>=0),version INTEGER NOT NULL CHECK(version>0));\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use axum::{extract::{DefaultBodyLimit, Path, Query, State}, http::StatusCode, response::{IntoResponse, Response}, routing::get, Json, Router};\nuse serde::{Deserialize, Serialize};\nuse sqlx::SqlitePool;\n\n#[derive(Debug)]\npub enum ApiError { Invalid, Missing, Conflict, Database }\nimpl IntoResponse for ApiError {\n    fn into_response(self) -> Response {\n        let (status, code)=match self {\n            Self::Invalid=>(StatusCode::UNPROCESSABLE_ENTITY,\"invalid_input\"),\n            Self::Missing=>(StatusCode::NOT_FOUND,\"not_found\"),\n            Self::Conflict=>(StatusCode::CONFLICT,\"version_conflict\"),\n            Self::Database=>(StatusCode::INTERNAL_SERVER_ERROR,\"database_error\"),\n        };\n        (status,Json(serde_json::json!({\"code\":code}))).into_response()\n    }\n}\n#[derive(Debug, Serialize, Deserialize)]\npub struct Product { pub id:i64, pub name:String, pub price_cents:i64, pub version:i64 }\ntype Row=(i64,String,i64,i64);\nfn product((id,name,price_cents,version):Row)->Product { Product{id,name,price_cents,version} }\n#[derive(Deserialize)]\n#[serde(deny_unknown_fields)]\nstruct Create { name:String, price_cents:i64 }\n#[derive(Deserialize)]\n#[serde(deny_unknown_fields)]\nstruct Update { price_cents:i64, version:i64 }\n#[derive(Deserialize)]\nstruct Page { after:Option<i64>, limit:Option<i64> }\n\npub async fn initialize(pool:&SqlitePool)->Result<(),sqlx::Error> {\n    sqlx::raw_sql(include_str!(\"../schema.sql\")).execute(pool).await?;\n    Ok(())\n}\npub fn app(pool:SqlitePool)->Router {\n    Router::new().route(\"/products\",get(list).post(create))\n        .route(\"/products/{id}\",get(find).patch(update))\n        .layer(DefaultBodyLimit::max(16*1024)).with_state(pool)\n}\nasync fn list(State(pool):State<SqlitePool>,Query(page):Query<Page>)->Result<Json<Vec<Product>>,ApiError> {\n    let after=page.after.unwrap_or(0); let limit=page.limit.unwrap_or(20);\n    if after<0 || !(1..=100).contains(&limit) { return Err(ApiError::Invalid); }\n    let rows=sqlx::query_as::<_,Row>(\"SELECT id,name,price_cents,version FROM products WHERE id>? ORDER BY id LIMIT ?\")\n        .bind(after).bind(limit).fetch_all(&pool).await.map_err(|_|ApiError::Database)?;\n    Ok(Json(rows.into_iter().map(product).collect()))\n}\nasync fn find(State(pool):State<SqlitePool>,Path(id):Path<i64>)->Result<Json<Product>,ApiError> {\n    let row=sqlx::query_as::<_,Row>(\"SELECT id,name,price_cents,version FROM products WHERE id=?\")\n        .bind(id).fetch_optional(&pool).await.map_err(|_|ApiError::Database)?.ok_or(ApiError::Missing)?;\n    Ok(Json(product(row)))\n}\nasync fn create(State(pool):State<SqlitePool>,Json(input):Json<Create>)->Result<(StatusCode,Json<Product>),ApiError> {\n    let name=input.name.trim();\n    if name.is_empty() || name.chars().count()>80 || input.price_cents<0 { return Err(ApiError::Invalid); }\n    let id=sqlx::query(\"INSERT INTO products(name,price_cents,version) VALUES(?,?,1)\")\n        .bind(name).bind(input.price_cents).execute(&pool).await.map_err(|_|ApiError::Database)?.last_insert_rowid();\n    Ok((StatusCode::CREATED,Json(Product{id,name:name.to_owned(),price_cents:input.price_cents,version:1})))\n}\nasync fn update(State(pool):State<SqlitePool>,Path(id):Path<i64>,Json(input):Json<Update>)->Result<Json<Product>,ApiError> {\n    if input.price_cents<0 || input.version<1 || input.version==i64::MAX { return Err(ApiError::Invalid); }\n    let changed=sqlx::query_as::<_,Row>(\"UPDATE products SET price_cents=?,version=version+1 WHERE id=? AND version=? RETURNING id,name,price_cents,version\")\n        .bind(input.price_cents).bind(id).bind(input.version).fetch_optional(&pool).await.map_err(|_|ApiError::Database)?;\n    if changed.is_none() {\n        let exists=sqlx::query_scalar::<_,i64>(\"SELECT COUNT(*) FROM products WHERE id=?\").bind(id)\n            .fetch_one(&pool).await.map_err(|_|ApiError::Database)?;\n        return Err(if exists==0 { ApiError::Missing } else { ApiError::Conflict });\n    }\n    Ok(Json(product(changed.ok_or(ApiError::Missing)?)))\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use catalog_api::{app,initialize};\nuse sqlx::sqlite::{SqliteConnectOptions,SqlitePoolOptions};\n#[tokio::main]\nasync fn main()->Result<(),Box<dyn std::error::Error>> {\n let options=SqliteConnectOptions::new().filename(\"catalog.db\").create_if_missing(true);\n let pool=SqlitePoolOptions::new().max_connections(5).connect_with(options).await?;\n initialize(&pool).await?;\n let listener=tokio::net::TcpListener::bind(\"127.0.0.1:3015\").await?;\n println!(\"Catalog API: http://127.0.0.1:3015\");\n axum::serve(listener,app(pool)).with_graceful_shutdown(async {let _=tokio::signal::ctrl_c().await;}).await?;\n Ok(())\n}\n"
          },
          {
            "path": "tests/http.rs",
            "content": "use axum::{body::{to_bytes,Body},http::{Request,StatusCode}};\nuse catalog_api::{app,initialize};\nuse sqlx::sqlite::SqlitePoolOptions;\nuse tower::ServiceExt;\nasync fn fresh()->axum::Router {\n    let pool=SqlitePoolOptions::new().max_connections(1).connect(\"sqlite::memory:\").await.unwrap();\n    initialize(&pool).await.unwrap(); app(pool)\n}\nfn request(method:&str,url:&str,body:&str)->Request<Body> {\n    Request::builder().method(method).uri(url).header(\"content-type\",\"application/json\").body(Body::from(body.to_owned())).unwrap()\n}\n#[tokio::test]\nasync fn creates_reads_and_paginates_real_database() {\n    let api=fresh().await;\n    for name in [\"Sách Rust\",\"Bàn phím\"] {\n        let r=api.clone().oneshot(request(\"POST\",\"/products\",&serde_json::json!({\"name\":name,\"price_cents\":12500}).to_string())).await.unwrap();\n        assert_eq!(r.status(),StatusCode::CREATED);\n    }\n    let r=api.clone().oneshot(request(\"GET\",\"/products?after=1&limit=1\",\"\")).await.unwrap();\n    let rows:serde_json::Value=serde_json::from_slice(&to_bytes(r.into_body(),65536).await.unwrap()).unwrap();\n    assert_eq!(rows.as_array().unwrap().len(),1); assert_eq!(rows[0][\"id\"],2);\n}\n#[tokio::test]\nasync fn rejects_invalid_input_without_writing() {\n    let api=fresh().await;\n    assert_eq!(api.clone().oneshot(request(\"POST\",\"/products\",r#\"{\"name\":\" \",\"price_cents\":1}\"#)).await.unwrap().status(),StatusCode::UNPROCESSABLE_ENTITY);\n    assert_eq!(api.clone().oneshot(request(\"POST\",\"/products\",r#\"{\"name\":\"A\",\"price_cents\":-1}\"#)).await.unwrap().status(),StatusCode::UNPROCESSABLE_ENTITY);\n    let r=api.clone().oneshot(request(\"GET\",\"/products\",\"\")).await.unwrap();\n    assert_eq!(&to_bytes(r.into_body(),65536).await.unwrap()[..],b\"[]\");\n    assert_eq!(api.oneshot(request(\"GET\",\"/products?limit=0\",\"\")).await.unwrap().status(),StatusCode::UNPROCESSABLE_ENTITY);\n}\n#[tokio::test]\nasync fn optimistic_update_detects_stale_version() {\n    let api=fresh().await;\n    api.clone().oneshot(request(\"POST\",\"/products\",r#\"{\"name\":\"A\",\"price_cents\":100}\"#)).await.unwrap();\n    assert_eq!(api.clone().oneshot(request(\"PATCH\",\"/products/1\",r#\"{\"price_cents\":120,\"version\":1}\"#)).await.unwrap().status(),StatusCode::OK);\n    assert_eq!(api.clone().oneshot(request(\"PATCH\",\"/products/1\",r#\"{\"price_cents\":900,\"version\":1}\"#)).await.unwrap().status(),StatusCode::CONFLICT);\n    let r=api.clone().oneshot(request(\"GET\",\"/products/1\",\"\")).await.unwrap();\n    let item:serde_json::Value=serde_json::from_slice(&to_bytes(r.into_body(),65536).await.unwrap()).unwrap();\n    assert_eq!(item[\"price_cents\"],120);assert_eq!(item[\"version\"],2);\n    assert_eq!(api.oneshot(request(\"GET\",\"/products/999\",\"\")).await.unwrap().status(),StatusCode::NOT_FOUND);\n}\n"
          },
          {
            "path": "README.md",
            "content": "# Catalog API\n\n`cargo test --all-targets` kiểm tra SQLite thật và Router thật, không mở cổng.\n\n`cargo run` mở 127.0.0.1:3015, tạo catalog.db trong thư mục hiện tại.\n\n```sh\ncurl -i -H 'Content-Type: application/json' -d '{\"name\":\"Sách Rust\",\"price_cents\":12500}' http://127.0.0.1:3015/products\ncurl 'http://127.0.0.1:3015/products?after=0&limit=10'\ncurl -i -X PATCH -H 'Content-Type: application/json' -d '{\"price_cents\":13000,\"version\":1}' http://127.0.0.1:3015/products/1\n```\n\nGửi lại PATCH version 1 phải nhận 409. Tắt và chạy lại server: sản phẩm vẫn còn. Các test không dùng catalog.db của server.\n\nBài tiếp theo: thêm search có chỉ mục, migration đổi schema có fixture cũ và hợp đồng lỗi JSON cho extractor. Đây là API nội bộ mẫu; thêm danh tính, phân quyền, giới hạn tải và TLS tại hạ tầng trước khi công khai.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run"
        ],
        "checks": [
          "Tạo và đọc lại sản phẩm qua Router thật và SQLite thật.",
          "Giá âm hoặc tên trắng không tạo hàng.",
          "Hai PATCH cùng version chỉ lần đầu thay đổi giá.",
          "Phân trang after/limit trả đúng thứ tự, limit sai trả lỗi.",
          "Dữ liệu server còn sau khi khởi động lại."
        ]
      }
    },
    {
      "id": "backend-order-project",
      "moduleId": "track-backend",
      "title": "Dự án: đặt hàng nguyên tử và khôi phục sau lỗi",
      "description": "Xây sổ đơn hàng có tồn kho, idempotency và outbox; chủ động gây lỗi để chứng minh rollback.",
      "duration": 100,
      "objectives": [
        "Viết transaction bao trùm ba thay đổi liên quan.",
        "Đối chiếu replay với payload conflict.",
        "Gây lỗi trước commit và kiểm tra toàn bộ dữ liệu."
      ],
      "sections": [
        {
          "title": "Sản phẩm của dự án",
          "text": "Một cửa hàng có mã sản phẩm và số lượng tồn kho. Khách đặt số lượng hợp lệ cùng khóa yêu cầu. Một đơn được chấp nhận phải trừ kho, có bản ghi đơn và có sự kiện order.created; ba thay đổi này cùng thành công hoặc cùng không xảy ra. Gửi lại đúng ý định trả cùng mã đơn. Gửi cùng key nhưng số lượng khác phải báo xung đột. Chọn bất biến như vậy giúp người học đánh giá dự án qua trạng thái dữ liệu, thay vì nhìn một dòng thành công trong terminal rồi kết luận giao dịch đã đúng."
        },
        {
          "title": "Đọc luồng transaction trong mã",
          "text": "Thư viện mở transaction, tìm đơn theo request_key, rồi quyết định replay hay xử lý mới. Với xử lý mới, UPDATE stock có điều kiện units lớn hơn hoặc bằng lượng mua. rows_affected bằng 0 nghĩa không thể đáp ứng đơn theo quy tắc hiện tại. Sau đó INSERT orders và outbox trước commit. Unique constraint trên request_key bảo vệ định danh, còn foreign key liên kết sản phẩm và đơn. Phiên bản CLI nhận scope mẫu trong key; khi đưa lên HTTP, scope phải được tạo từ danh tính đã xác minh ở server. Không để khách hàng tự chọn khách hàng khác bằng một tiền tố trong chuỗi."
        },
        {
          "title": "Làm hỏng đúng chỗ để thấy bảo đảm",
          "text": "Hàm place_with_fault phục vụ kiểm thử cục bộ cho phép trả lỗi sau khi đã sửa stock, tạo order và event nhưng trước commit. Test phải xác nhận stock trở về giá trị ban đầu, orders rỗng và outbox rỗng. Sau đó gửi lại cùng key bình thường phải tạo được đơn, chứng minh lỗi không để lại khóa chống lặp giả. Một test khác cho hai người mua mỗi người bốn đơn vị trong kho năm; chỉ một người được chấp nhận. Lab dùng SQLite với một kết nối để test ổn định; chuyển sang PostgreSQL phải kiểm tra lock, isolation và retry với nhiều kết nối thật."
        },
        {
          "title": "Từ một mặt hàng đến đơn nhiều dòng",
          "text": "Mở rộng đơn nhiều sản phẩm bằng cách gom lượng mua theo SKU, kiểm tra overflow rồi thực hiện toàn bộ trong một transaction. Nếu hai dòng cùng SKU, không kiểm tra từng dòng độc lập rồi vượt tổng tồn kho. Chọn thứ tự cập nhật SKU ổn định để giảm rủi ro khóa chéo khi dùng database có row lock. Bài tập web luyện chuẩn bị kế hoạch trừ kho trong bộ nhớ: mọi lỗi phải xảy ra trước khi thay đổi stock. Sau khi hoàn thành, viết báo cáo gồm bảng trạng thái trước/sau cho replay, conflict, thiếu kho và crash. Đây là bằng chứng để người khác review quyết định transaction và mở rộng dự án một cách có trách nhiệm."
        }
      ],
      "tip": "Chạy dự án tải xuống, giữ lại test lỗi và bổ sung bằng chứng theo rubric trước khi tự nghiệm thu.",
      "exercise": {
        "title": "đặt hàng nguyên tử và khôi phục sau lỗi",
        "instructions": "Bài tập trên web luyện bất biến cốt lõi. Dự án Cargo bên dưới triển khai phần HTTP hoặc dữ liệu thật; hoàn thành cả hai để đối chiếu quyết định nghiệp vụ với adapter.",
        "requirements": [
          "Gom các dòng cùng SKU trước khi kiểm tra tồn.",
          "Không thay stock nếu bất kỳ dòng nào lỗi.",
          "Kiểm tra SKU, số lượng 0 và overflow."
        ]
      },
      "starterCode": "use std::collections::BTreeMap;\nfn reserve_stock(stock: &mut [u32], lines: &[(usize,u32)]) -> Result<(), &'static str> {\n    todo!(\"Hoàn thành quy tắc nghiệp vụ\")\n}\nfn main(){\n let mut stock=[5,3]; assert_eq!(reserve_stock(&mut stock,&[(0,2),(0,1),(1,2)]),Ok(())); assert_eq!(stock,[2,1]);\n let before=stock;assert_eq!(reserve_stock(&mut stock,&[(0,1),(1,2)]),Err(\"no_stock\"));assert_eq!(stock,before);\n assert_eq!(reserve_stock(&mut stock,&[(2,1)]),Err(\"invalid_line\"));\n assert_eq!(reserve_stock(&mut stock,&[(0,0)]),Err(\"invalid_line\"));\n assert_eq!(reserve_stock(&mut stock,&[(0,u32::MAX),(0,1)]),Err(\"overflow\"));assert_eq!(stock,before);\n println!(\"Đơn nhiều dòng được trừ kho cùng nhau\");\n}",
      "solutionCode": "use std::collections::BTreeMap;\nfn reserve_stock(stock: &mut [u32], lines: &[(usize,u32)]) -> Result<(), &'static str> {\n    let mut totals=BTreeMap::<usize,u32>::new();\n    for &(sku,qty) in lines {\n        if qty==0 || sku>=stock.len(){return Err(\"invalid_line\");}\n        let old=totals.get(&sku).copied().unwrap_or(0);\n        totals.insert(sku,old.checked_add(qty).ok_or(\"overflow\")?);\n    }\n    if totals.iter().any(|(&sku,&qty)|stock[sku]<qty){return Err(\"no_stock\");}\n    for (sku,qty) in totals {stock[sku]-=qty;}\n    Ok(())\n}\nfn main(){\n let mut stock=[5,3]; assert_eq!(reserve_stock(&mut stock,&[(0,2),(0,1),(1,2)]),Ok(())); assert_eq!(stock,[2,1]);\n let before=stock;assert_eq!(reserve_stock(&mut stock,&[(0,1),(1,2)]),Err(\"no_stock\"));assert_eq!(stock,before);\n assert_eq!(reserve_stock(&mut stock,&[(2,1)]),Err(\"invalid_line\"));\n assert_eq!(reserve_stock(&mut stock,&[(0,0)]),Err(\"invalid_line\"));\n assert_eq!(reserve_stock(&mut stock,&[(0,u32::MAX),(0,1)]),Err(\"overflow\"));assert_eq!(stock,before);\n println!(\"Đơn nhiều dòng được trừ kho cùng nhau\");\n}",
      "expectedOutput": "Đơn nhiều dòng được trừ kho cùng nhau",
      "hints": [
        "Viết các điều kiện từ chối trước khi thay đổi trạng thái.",
        "Kiểm tra tình huống biên và giữ nguyên dữ liệu khi thất bại."
      ],
      "quiz": {
        "question": "Đơn có hai dòng cùng SKU, mỗi dòng mua 3 nhưng tồn kho là 5. Cần làm gì?",
        "options": [
          "Gom lượng mua theo SKU và từ chối tổng 6.",
          "Chấp nhận vì từng dòng đều nhỏ hơn 5.",
          "Chỉ giữ dòng cuối."
        ],
        "correct": 0,
        "explanation": "Bất biến áp dụng lên tổng thay đổi của transaction. Kiểm tra từng dòng độc lập bỏ sót lượng mua cộng dồn."
      },
      "reference": {
        "label": "SQLx — giao dịch",
        "url": "https://docs.rs/sqlx/0.8.6/sqlx/struct.Transaction.html"
      },
      "localLab": {
        "title": "Sổ đơn hàng: transaction, tồn kho và idempotency",
        "instructions": "Dự án lưu đơn hàng và tồn kho bằng SQLx/SQLite. Chạy cargo test trước, rồi tạo đơn bằng CLI. Khóa mẫu gồm scope khách hàng và ID yêu cầu; khi đưa lên HTTP phải tạo scope từ principal đã xác minh. Test cạnh tranh dùng pool một kết nối để xác minh quyết định của transaction trên SQLite; cần thêm test nhiều kết nối và database đích khi triển khai PostgreSQL.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"order-ledger\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\ntokio = { version = \"1\", features = [\"macros\", \"rt-multi-thread\"] }\nsqlx = { version = \"=0.8.6\", default-features = false, features = [\"runtime-tokio\", \"sqlite\"] }\n"
          },
          {
            "path": "schema.sql",
            "content": "CREATE TABLE IF NOT EXISTS stock(sku TEXT PRIMARY KEY,units INTEGER NOT NULL CHECK(units>=0));\nCREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY AUTOINCREMENT,request_key TEXT NOT NULL UNIQUE,sku TEXT NOT NULL REFERENCES stock(sku),quantity INTEGER NOT NULL CHECK(quantity>0));\nCREATE TABLE IF NOT EXISTS outbox(id INTEGER PRIMARY KEY AUTOINCREMENT,order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id),kind TEXT NOT NULL,delivered INTEGER NOT NULL DEFAULT 0 CHECK(delivered IN (0,1)));\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use sqlx::SqlitePool;\n#[derive(Debug,PartialEq,Eq)]\npub enum OrderError { Invalid, Conflict, NoStock, Injected, Database }\n#[derive(Debug,PartialEq,Eq)]\npub struct Receipt { pub id:i64, pub replayed:bool }\npub async fn initialize(pool:&SqlitePool)->Result<(),sqlx::Error> {\n    sqlx::raw_sql(include_str!(\"../schema.sql\")).execute(pool).await?;\n    sqlx::query(\"INSERT OR IGNORE INTO stock(sku,units) VALUES('RUST-BOOK',5)\").execute(pool).await?;\n    Ok(())\n}\npub async fn place(pool:&SqlitePool,key:&str,sku:&str,quantity:i64)->Result<Receipt,OrderError> {\n    place_with_fault(pool,key,sku,quantity,false).await\n}\n/// Fault injection belongs to the local lab; never expose it as an HTTP parameter.\npub async fn place_with_fault(pool:&SqlitePool,key:&str,sku:&str,quantity:i64,fail_before_commit:bool)->Result<Receipt,OrderError> {\n    if key.trim().is_empty() || key.len()>128 || sku.is_empty() || !(1..=100).contains(&quantity) { return Err(OrderError::Invalid); }\n    let mut tx=pool.begin().await.map_err(|_|OrderError::Database)?;\n    let old=sqlx::query_as::<_,(i64,String,i64)>(\"SELECT id,sku,quantity FROM orders WHERE request_key=?\")\n        .bind(key).fetch_optional(&mut *tx).await.map_err(|_|OrderError::Database)?;\n    if let Some((id,old_sku,old_quantity))=old {\n        tx.rollback().await.map_err(|_|OrderError::Database)?;\n        return if old_sku==sku && old_quantity==quantity { Ok(Receipt{id,replayed:true}) } else { Err(OrderError::Conflict) };\n    }\n    let changed=sqlx::query(\"UPDATE stock SET units=units-? WHERE sku=? AND units>=?\")\n        .bind(quantity).bind(sku).bind(quantity).execute(&mut *tx).await.map_err(|_|OrderError::Database)?.rows_affected();\n    if changed!=1 { tx.rollback().await.map_err(|_|OrderError::Database)?; return Err(OrderError::NoStock); }\n    let id=sqlx::query(\"INSERT INTO orders(request_key,sku,quantity) VALUES(?,?,?)\")\n        .bind(key).bind(sku).bind(quantity).execute(&mut *tx).await.map_err(|_|OrderError::Database)?.last_insert_rowid();\n    sqlx::query(\"INSERT INTO outbox(order_id,kind) VALUES(?,'order.created')\")\n        .bind(id).execute(&mut *tx).await.map_err(|_|OrderError::Database)?;\n    if fail_before_commit { tx.rollback().await.map_err(|_|OrderError::Database)?; return Err(OrderError::Injected); }\n    tx.commit().await.map_err(|_|OrderError::Database)?;\n    Ok(Receipt{id,replayed:false})\n}\npub async fn remaining(pool:&SqlitePool)->Result<i64,sqlx::Error> {\n    sqlx::query_scalar(\"SELECT units FROM stock WHERE sku='RUST-BOOK'\").fetch_one(pool).await\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use order_ledger::{initialize,place,remaining};\nuse sqlx::sqlite::{SqliteConnectOptions,SqlitePoolOptions};\n#[tokio::main]\nasync fn main()->Result<(),Box<dyn std::error::Error>> {\n let args=std::env::args().skip(1).collect::<Vec<_>>();\n if args.len()!=2 {eprintln!(\"Cách dùng: cargo run -- customer7:key1 2\");std::process::exit(2);}\n let quantity=args[1].parse::<i64>()?;\n let p=SqlitePoolOptions::new().max_connections(1).connect_with(SqliteConnectOptions::new().filename(\"orders.db\").create_if_missing(true).foreign_keys(true)).await?;\n initialize(&p).await?;\n match place(&p,&args[0],\"RUST-BOOK\",quantity).await {\n  Ok(r)=>println!(\"order={} replayed={} remaining={}\",r.id,r.replayed,remaining(&p).await?),\n  Err(e)=>{eprintln!(\"Không tạo đơn: {e:?}\");std::process::exit(1);}\n }\n p.close().await;Ok(())\n}\n"
          },
          {
            "path": "tests/transactions.rs",
            "content": "use order_ledger::{initialize,place,place_with_fault,remaining,OrderError};\nuse sqlx::{SqlitePool,sqlite::SqlitePoolOptions};\nasync fn fresh()->SqlitePool {\n let p=SqlitePoolOptions::new().max_connections(1).connect(\"sqlite::memory:\").await.unwrap();\n initialize(&p).await.unwrap();p\n}\n#[tokio::test]\nasync fn replay_does_not_duplicate_stock_order_or_event() {\n let p=fresh().await;let a=place(&p,\"customer7:key1\",\"RUST-BOOK\",2).await.unwrap();\n let b=place(&p,\"customer7:key1\",\"RUST-BOOK\",2).await.unwrap();\n assert_eq!(a.id,b.id);assert!(!a.replayed);assert!(b.replayed);assert_eq!(remaining(&p).await.unwrap(),3);\n assert_eq!(sqlx::query_scalar::<_,i64>(\"SELECT count(*) FROM outbox\").fetch_one(&p).await.unwrap(),1);\n}\n#[tokio::test]\nasync fn different_payload_same_key_is_conflict() {\n let p=fresh().await;place(&p,\"customer7:key1\",\"RUST-BOOK\",1).await.unwrap();\n assert_eq!(place(&p,\"customer7:key1\",\"RUST-BOOK\",2).await,Err(OrderError::Conflict));\n assert_eq!(remaining(&p).await.unwrap(),4);\n}\n#[tokio::test]\nasync fn failure_before_commit_rolls_back_every_table() {\n let p=fresh().await;\n assert_eq!(place_with_fault(&p,\"customer7:fault\",\"RUST-BOOK\",3,true).await,Err(OrderError::Injected));\n assert_eq!(remaining(&p).await.unwrap(),5);\n for table in [\"orders\",\"outbox\"] {\n  let query=format!(\"SELECT count(*) FROM {table}\");\n  assert_eq!(sqlx::query_scalar::<_,i64>(&query).fetch_one(&p).await.unwrap(),0);\n }\n let r=place(&p,\"customer7:fault\",\"RUST-BOOK\",3).await.unwrap();assert!(!r.replayed);\n}\n#[tokio::test]\nasync fn two_buyers_cannot_oversell() {\n let p=fresh().await;\n let (a,b)=tokio::join!(place(&p,\"buyerA:1\",\"RUST-BOOK\",4),place(&p,\"buyerB:1\",\"RUST-BOOK\",4));\n assert_eq!([a.is_ok(),b.is_ok()].into_iter().filter(|v|*v).count(),1);\n assert_eq!(remaining(&p).await.unwrap(),1);\n}\n#[tokio::test]\nasync fn invalid_and_unknown_products_do_not_write() {\n let p=fresh().await;\n assert_eq!(place(&p,\"\",\"RUST-BOOK\",1).await,Err(OrderError::Invalid));\n assert_eq!(place(&p,\"x\",\"RUST-BOOK\",0).await,Err(OrderError::Invalid));\n assert_eq!(place(&p,\"y\",\"UNKNOWN\",1).await,Err(OrderError::NoStock));\n assert_eq!(remaining(&p).await.unwrap(),5);\n}\n"
          },
          {
            "path": "README.md",
            "content": "# Order ledger\n\n```sh\ncargo test --all-targets\ncargo run -- customer7:key1 2\ncargo run -- customer7:key1 2\ncargo run -- customer7:key1 3\n```\n\nLần hai trả cùng order và replayed=true. Lần ba báo Conflict và không đổi tồn kho. Database orders.db được tạo trong thư mục đang chạy; không xóa database khi muốn kiểm tra replay.\n\nMỗi transaction ghi đồng thời stock, orders và outbox. Test fault injection rollback sau khi cả ba bảng đã được thay đổi, trước commit. Test không dùng file orders.db của người học.\n\nBài mở rộng: nhiều dòng sản phẩm trong một đơn, scope từ principal đã xác minh, lưu response đầy đủ, chính sách hết hạn key và worker outbox có lease. Không coi test pool một kết nối là bằng chứng semantics cạnh tranh của PostgreSQL; viết integration test trên database đích trước khi phát hành.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run -- customer7:key1 2",
          "cargo run -- customer7:key1 2"
        ],
        "checks": [
          "Gửi lại cùng key trả đúng order mà không trừ kho thêm.",
          "Payload khác với cùng key bị từ chối.",
          "Lỗi trước commit giữ nguyên cả ba bảng.",
          "Hai người mua vượt số tồn kho chỉ một người được chấp nhận.",
          "Bản ghi outbox xuất hiện cùng đơn hàng."
        ]
      }
    },
    {
      "id": "backend-service-project",
      "moduleId": "track-backend",
      "title": "Dự án cuối khóa: dịch vụ công việc nhiều workspace",
      "description": "Tích hợp HTTP, gRPC, WebSocket, JWT và PostgreSQL trong một dịch vụ nhiều workspace, rồi chứng minh quyền, cạnh tranh và phục hồi.",
      "duration": 120,
      "objectives": [
        "Bảo vệ dữ liệu tại mọi endpoint theo workspace.",
        "Ghép optimistic update và outbox trong transaction.",
        "Bàn giao mã, test lỗi, số đo và hướng dẫn phục hồi."
      ],
      "sections": [
        {
          "title": "Cùng nghiệp vụ qua ba giao thức",
          "text": "Team Tasks quản lý công việc và sự kiện trong từng workspace. Package đầu dùng Axum/SQLite để theo dõi transaction; member adapters đưa cùng hợp đồng lên PostgreSQL, HTTP, tonic gRPC và WebSocket. Chúng gọi chung Store, không viết lại quy tắc quyền theo từng transport. Proto, build script, compiler protoc vendored, dữ liệu mẫu và client đều có trong dự án. Chạy test workspace trước, rồi chạy ba test PostgreSQL riêng. Một test được đánh dấu ignored chưa phải bằng chứng đã đạt."
        },
        {
          "title": "Danh tính được xác minh rồi mới xét quyền",
          "text": "Adapter RS256 nhận public key, kid, issuer và audience từ cấu hình server. Nó kiểm tra chữ ký, thuật toán được phép, hạn exp, thời điểm nbf và sub trước khi tạo principal. Header JWT chỉ được so với cấu hình tin cậy; không được dùng URL hay thuật toán do client tự chọn. Token hợp lệ vẫn phải qua membership trong database. Bộ fixture có token hết hạn, sai audience/issuer, sai thuật toán/kid và chữ ký bị sửa. Cặp khóa công khai của bài chỉ mô phỏng danh tính; README chỉ rõ cách thay bằng khóa của môi trường, không biến fixture thành cơ chế đăng nhập của sản phẩm."
        },
        {
          "title": "RPC có hợp đồng lỗi và thời hạn",
          "text": "File tasks.proto khai báo CreateTask, SetDone và ListEvents. Số field là hợp đồng trên wire; trường bị bỏ cần reserved để client cũ không hiểu nhầm bytes mới. Stub tạo request/response nhưng không thay validation miền nghiệp vụ. Bearer token đi qua metadata, version conflict trả ABORTED, thiếu quyền trả PERMISSION_DENIED và input sai trả INVALID_ARGUMENT. Test mở HTTP/2 loopback thật, gọi client sinh tự động và kiểm tra trạng thái database/model sau request. Client có timeout; server giới hạn operation, kích thước message và concurrency. Timeout không chứng minh một commit từ xa chưa xảy ra, nên command có tác dụng phụ cần chính sách idempotency hoặc đối chiếu version."
        },
        {
          "title": "WebSocket khôi phục từ sự kiện đã áp dụng",
          "text": "Trang stream.html gửi token ở frame đầu thay vì URL, vì browser WebSocket không đặt Authorization tùy ý. Server xác minh trước khi đọc outbox, kiểm tra lại membership theo batch và đóng phiên khi token hết hạn. Mỗi batch tối đa 32 event; send có deadline nên client chậm không kéo theo queue vô hạn. Client giữ cursor cuối đã áp dụng, reconnect có backoff hữu hạn và loại event trùng. Test gây ngắt kết nối, thêm thay đổi, kết nối lại và phát lại cursor cũ. Dedup bằng RAM chỉ minh họa: consumer sản phẩm phải lưu event ID cùng tác dụng phụ trong một transaction. Khi lịch sử bị dọn, cần resync rõ ràng."
        },
        {
          "title": "PostgreSQL và bằng chứng vận hành",
          "text": "UPDATE lọc workspace, ID và expected version; RETURNING trả hàng vừa ghi; outbox cùng transaction. Khóa membership FOR SHARE phối hợp với thu hồi quyền. Khóa workspace FOR UPDATE giữ tới commit để thứ tự cấp event ID trong workspace khớp thứ tự commit: sequence tự nó không bảo đảm điều này. Nếu giao dịch lấy ID thấp commit sau ID cao, cursor đơn giản có thể bỏ sót sự kiện. Test nhiều connection giữ writer đầu chờ để kiểm tra đúng tình huống ấy, cùng stale update, rollback sau INSERT event và gRPC→WebSocket qua restart transport. Bàn giao thêm consumer bền, migration, metrics và tải có cấu hình; ghi rõ TLS, nhà cung cấp danh tính và failover nào đã thực sự nghiệm thu."
        }
      ],
      "tip": "Chạy dự án tải xuống, giữ lại test lỗi và bổ sung bằng chứng theo rubric trước khi tự nghiệm thu.",
      "exercise": {
        "title": "Dự án cuối khóa: dịch vụ công việc nhiều workspace",
        "instructions": "Bài tập trên web luyện bất biến cốt lõi. Dự án Cargo bên dưới triển khai phần HTTP hoặc dữ liệu thật; hoàn thành cả hai để đối chiếu quyết định nghiệp vụ với adapter.",
        "requirements": [
          "Kiểm tra workspace và expected version trước khi sửa.",
          "Chỉ tăng version khi thay đổi được chấp nhận.",
          "Không thay trạng thái khi overflow hoặc thiếu quyền."
        ]
      },
      "starterCode": "#[derive(Debug,PartialEq,Eq,Clone)]\nstruct Task { workspace:u64, version:u64, done:bool }\nfn change(task: &mut Task, actor_workspace: u64, expected: u64, done: bool) -> Result<(), &'static str> {\n    todo!(\"Hoàn thành quy tắc nghiệp vụ\")\n}\nfn main(){\n let mut t=Task{workspace:7,version:1,done:false};let before=t.clone();\n assert_eq!(change(&mut t,8,1,true),Err(\"forbidden\"));assert_eq!(t,before);\n assert_eq!(change(&mut t,7,0,true),Err(\"conflict\"));assert_eq!(t,before);\n assert_eq!(change(&mut t,7,1,true),Ok(()));assert_eq!(t.version,2);assert!(t.done);\n let mut full=Task{workspace:7,version:u64::MAX,done:false};let old=full.clone();\n assert_eq!(change(&mut full,7,u64::MAX,true),Err(\"overflow\"));assert_eq!(full,old);\n println!(\"Scope và version bảo vệ thay đổi công việc\");\n}",
      "solutionCode": "#[derive(Debug,PartialEq,Eq,Clone)]\nstruct Task { workspace:u64, version:u64, done:bool }\nfn change(task: &mut Task, actor_workspace: u64, expected: u64, done: bool) -> Result<(), &'static str> {\n    if actor_workspace!=task.workspace{return Err(\"forbidden\");}\n    if expected!=task.version{return Err(\"conflict\");}\n    let next=task.version.checked_add(1).ok_or(\"overflow\")?;\n    task.done=done; task.version=next;Ok(())\n}\nfn main(){\n let mut t=Task{workspace:7,version:1,done:false};let before=t.clone();\n assert_eq!(change(&mut t,8,1,true),Err(\"forbidden\"));assert_eq!(t,before);\n assert_eq!(change(&mut t,7,0,true),Err(\"conflict\"));assert_eq!(t,before);\n assert_eq!(change(&mut t,7,1,true),Ok(()));assert_eq!(t.version,2);assert!(t.done);\n let mut full=Task{workspace:7,version:u64::MAX,done:false};let old=full.clone();\n assert_eq!(change(&mut full,7,u64::MAX,true),Err(\"overflow\"));assert_eq!(full,old);\n println!(\"Scope và version bảo vệ thay đổi công việc\");\n}",
      "expectedOutput": "Scope và version bảo vệ thay đổi công việc",
      "hints": [
        "Viết các điều kiện từ chối trước khi thay đổi trạng thái.",
        "Kiểm tra tình huống biên và giữ nguyên dữ liệu khi thất bại."
      ],
      "quiz": {
        "question": "Một endpoint đã kiểm tra membership. Query tài nguyên có cần workspace_id không?",
        "options": [
          "Không, task ID đã đủ.",
          "Chỉ cần ở giao diện.",
          "Có, ràng buộc scope tại truy vấn giúp bảo vệ mọi đường đọc/ghi."
        ],
        "correct": 2,
        "explanation": "Kiểm tra membership không chứng minh task ID thuộc workspace đó. Query cần ràng buộc cả danh tính tài nguyên và scope."
      },
      "reference": {
        "label": "OWASP — phân quyền theo từng request",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
      },
      "localLab": {
        "title": "Team Tasks: API nhiều workspace với version và outbox",
        "instructions": "Dự án gồm baseline SQLite và member adapters dùng PostgreSQL, JWT RS256, HTTP, gRPC tonic và WebSocket. Chạy cargo test --workspace --all-targets để kiểm tra host/loopback; ba test PostgreSQL được đánh dấu ignored và chạy riêng theo lệnh trong README. Proto, build script, compiler protoc vendored, key fixture công khai và cấu hình database thử đều nằm trong lab. Phần adapters/README.md hướng dẫn đầy đủ hợp đồng, lỗi, kết nối lại và tích hợp nhà cung cấp danh tính.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"team-tasks\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\naxum = \"=0.8.9\"\ntokio = { version = \"1\", features = [\"macros\", \"rt-multi-thread\", \"net\", \"signal\"] }\nsqlx = { version = \"=0.8.6\", default-features = false, features = [\"runtime-tokio\", \"sqlite\"] }\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\n\n[dev-dependencies]\ntower = { version = \"0.5\", features = [\"util\"] }\n\n[workspace]\nmembers = [\"adapters\"]\ndefault-members = [\".\", \"adapters\"]\nresolver = \"3\"\n"
          },
          {
            "path": "schema.sql",
            "content": "CREATE TABLE IF NOT EXISTS memberships(workspace_id INTEGER NOT NULL,actor TEXT NOT NULL,PRIMARY KEY(workspace_id,actor));\nCREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY AUTOINCREMENT,workspace_id INTEGER NOT NULL,title TEXT NOT NULL CHECK(length(trim(title))>0),done INTEGER NOT NULL CHECK(done IN(0,1)),version INTEGER NOT NULL CHECK(version>0));\nCREATE INDEX IF NOT EXISTS tasks_workspace_id ON tasks(workspace_id,id);\nCREATE TABLE IF NOT EXISTS outbox(id INTEGER PRIMARY KEY AUTOINCREMENT,workspace_id INTEGER NOT NULL,task_id INTEGER NOT NULL REFERENCES tasks(id),version INTEGER NOT NULL,kind TEXT NOT NULL,payload TEXT NOT NULL,UNIQUE(task_id,version));\nCREATE INDEX IF NOT EXISTS events_workspace_id ON outbox(workspace_id,id);\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use axum::{extract::{DefaultBodyLimit,Path,Query,State},http::{HeaderMap,StatusCode},response::{IntoResponse,Response},routing::get,Json,Router};\nuse serde::{Deserialize,Serialize};\nuse sqlx::SqlitePool;\n#[derive(Debug)]\npub enum Error { Unauthorized,Forbidden,Invalid,Missing,Conflict,Database }\nimpl IntoResponse for Error {\n fn into_response(self)->Response {\n  let (status,code)=match self {\n   Self::Unauthorized=>(StatusCode::UNAUTHORIZED,\"unauthorized\"),\n   Self::Forbidden=>(StatusCode::FORBIDDEN,\"forbidden\"),\n   Self::Invalid=>(StatusCode::UNPROCESSABLE_ENTITY,\"invalid_input\"),\n   Self::Missing=>(StatusCode::NOT_FOUND,\"not_found\"),\n   Self::Conflict=>(StatusCode::CONFLICT,\"version_conflict\"),\n   Self::Database=>(StatusCode::INTERNAL_SERVER_ERROR,\"database_error\"),\n  };(status,Json(serde_json::json!({\"code\":code}))).into_response()\n }\n}\nfn actor(headers:&HeaderMap)->Result<&'static str,Error> {\n match headers.get(\"authorization\").and_then(|v|v.to_str().ok()) {\n  Some(\"Bearer demo-alice\")=>Ok(\"alice\"),\n  Some(\"Bearer demo-bob\")=>Ok(\"bob\"),\n  _=>Err(Error::Unauthorized),\n }\n}\nasync fn authorize(pool:&SqlitePool,actor:&str,workspace:i64)->Result<(),Error> {\n let count=sqlx::query_scalar::<_,i64>(\"SELECT COUNT(*) FROM memberships WHERE workspace_id=? AND actor=?\")\n  .bind(workspace).bind(actor).fetch_one(pool).await.map_err(|_|Error::Database)?;\n if count==1 {Ok(())} else {Err(Error::Forbidden)}\n}\n#[derive(Serialize,Deserialize,Debug)]\npub struct Task {pub id:i64,pub workspace_id:i64,pub title:String,pub done:bool,pub version:i64}\ntype TaskRow=(i64,i64,String,bool,i64);\nfn task((id,workspace_id,title,done,version):TaskRow)->Task {Task{id,workspace_id,title,done,version}}\n#[derive(Deserialize)]\n#[serde(deny_unknown_fields)]\nstruct Create {title:String}\n#[derive(Deserialize)]\n#[serde(deny_unknown_fields)]\nstruct Update {done:bool,version:i64}\n#[derive(Deserialize)]\nstruct Cursor {after:Option<i64>}\npub async fn initialize(pool:&SqlitePool)->Result<(),sqlx::Error> {\n sqlx::raw_sql(include_str!(\"../schema.sql\")).execute(pool).await?;\n sqlx::query(\"INSERT OR IGNORE INTO memberships(workspace_id,actor) VALUES(1,'alice'),(2,'bob')\").execute(pool).await?;\n Ok(())\n}\npub fn app(pool:SqlitePool)->Router {\n Router::new().route(\"/health\",get(||async{\"ok\"}))\n  .route(\"/workspaces/{workspace}/tasks\",get(list).post(create))\n  .route(\"/workspaces/{workspace}/tasks/{id}\",axum::routing::patch(update))\n  .route(\"/workspaces/{workspace}/events\",get(events))\n  .layer(DefaultBodyLimit::max(16*1024)).with_state(pool)\n}\nasync fn list(State(pool):State<SqlitePool>,Path(workspace):Path<i64>,headers:HeaderMap,Query(cursor):Query<Cursor>)->Result<Json<Vec<Task>>,Error>{\n let who=actor(&headers)?;authorize(&pool,who,workspace).await?;\n let after=cursor.after.unwrap_or(0);if after<0{return Err(Error::Invalid);}\n let rows=sqlx::query_as::<_,TaskRow>(\"SELECT id,workspace_id,title,done,version FROM tasks WHERE workspace_id=? AND id>? ORDER BY id LIMIT 100\")\n  .bind(workspace).bind(after).fetch_all(&pool).await.map_err(|_|Error::Database)?;\n Ok(Json(rows.into_iter().map(task).collect()))\n}\nasync fn create(State(pool):State<SqlitePool>,Path(workspace):Path<i64>,headers:HeaderMap,Json(input):Json<Create>)->Result<(StatusCode,Json<Task>),Error>{\n let who=actor(&headers)?;authorize(&pool,who,workspace).await?;\n let title=input.title.trim();if title.is_empty()||title.chars().count()>120{return Err(Error::Invalid);}\n let mut tx=pool.begin().await.map_err(|_|Error::Database)?;\n let id=sqlx::query(\"INSERT INTO tasks(workspace_id,title,done,version) VALUES(?,?,0,1)\")\n  .bind(workspace).bind(title).execute(&mut *tx).await.map_err(|_|Error::Database)?.last_insert_rowid();\n let payload=serde_json::json!({\"task_id\":id,\"version\":1,\"actor\":who}).to_string();\n sqlx::query(\"INSERT INTO outbox(workspace_id,task_id,version,kind,payload) VALUES(?,?,1,'task.created',?)\")\n  .bind(workspace).bind(id).bind(payload).execute(&mut *tx).await.map_err(|_|Error::Database)?;\n tx.commit().await.map_err(|_|Error::Database)?;\n Ok((StatusCode::CREATED,Json(Task{id,workspace_id:workspace,title:title.to_owned(),done:false,version:1})))\n}\nasync fn update(State(pool):State<SqlitePool>,Path((workspace,id)):Path<(i64,i64)>,headers:HeaderMap,Json(input):Json<Update>)->Result<Json<Task>,Error>{\n let who=actor(&headers)?;authorize(&pool,who,workspace).await?;\n if input.version<1||input.version==i64::MAX{return Err(Error::Invalid);}\n let mut tx=pool.begin().await.map_err(|_|Error::Database)?;\n let row=sqlx::query_as::<_,TaskRow>(\"UPDATE tasks SET done=?,version=version+1 WHERE workspace_id=? AND id=? AND version=? RETURNING id,workspace_id,title,done,version\")\n  .bind(input.done).bind(workspace).bind(id).bind(input.version).fetch_optional(&mut *tx).await.map_err(|_|Error::Database)?;\n let Some(row)=row else {\n  let exists=sqlx::query_scalar::<_,i64>(\"SELECT COUNT(*) FROM tasks WHERE workspace_id=? AND id=?\")\n   .bind(workspace).bind(id).fetch_one(&mut *tx).await.map_err(|_|Error::Database)?;\n  tx.rollback().await.map_err(|_|Error::Database)?;\n  return Err(if exists==0{Error::Missing}else{Error::Conflict});\n };\n let updated=task(row);\n let payload=serde_json::json!({\"task_id\":id,\"version\":updated.version,\"actor\":who,\"done\":updated.done}).to_string();\n sqlx::query(\"INSERT INTO outbox(workspace_id,task_id,version,kind,payload) VALUES(?,?,?,'task.changed',?)\")\n  .bind(workspace).bind(id).bind(updated.version).bind(payload).execute(&mut *tx).await.map_err(|_|Error::Database)?;\n tx.commit().await.map_err(|_|Error::Database)?;\n Ok(Json(updated))\n}\nasync fn events(State(pool):State<SqlitePool>,Path(workspace):Path<i64>,headers:HeaderMap,Query(cursor):Query<Cursor>)->Result<Json<Vec<serde_json::Value>>,Error>{\n let who=actor(&headers)?;authorize(&pool,who,workspace).await?;\n let after=cursor.after.unwrap_or(0);if after<0{return Err(Error::Invalid);}\n let rows=sqlx::query_as::<_,(i64,String,String)>(\"SELECT id,kind,payload FROM outbox WHERE workspace_id=? AND id>? ORDER BY id LIMIT 100\")\n  .bind(workspace).bind(after).fetch_all(&pool).await.map_err(|_|Error::Database)?;\n Ok(Json(rows.into_iter().map(|(id,kind,payload)|serde_json::json!({\"id\":id,\"kind\":kind,\"payload\":payload})).collect()))\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use team_tasks::{app,initialize};\nuse sqlx::sqlite::{SqliteConnectOptions,SqlitePoolOptions};\n#[tokio::main]\nasync fn main()->Result<(),Box<dyn std::error::Error>> {\n let options=SqliteConnectOptions::new().filename(\"team-tasks.db\").create_if_missing(true).foreign_keys(true);\n let pool=SqlitePoolOptions::new().max_connections(1).connect_with(options).await?;\n initialize(&pool).await?;\n let listener=tokio::net::TcpListener::bind(\"127.0.0.1:3017\").await?;\n println!(\"Team Tasks: http://127.0.0.1:3017 — dữ liệu demo\");\n axum::serve(listener,app(pool)).with_graceful_shutdown(async{let _=tokio::signal::ctrl_c().await;}).await?;\n Ok(())\n}\n"
          },
          {
            "path": "tests/http.rs",
            "content": "use axum::{body::{to_bytes,Body},http::{Request,StatusCode}};\nuse team_tasks::{app,initialize};\nuse sqlx::sqlite::SqlitePoolOptions;\nuse tower::ServiceExt;\nasync fn fresh()->axum::Router {\n let pool=SqlitePoolOptions::new().max_connections(1).connect(\"sqlite::memory:\").await.unwrap();\n initialize(&pool).await.unwrap();app(pool)\n}\nfn req(method:&str,url:&str,actor:&str,body:&str)->Request<Body>{\n Request::builder().method(method).uri(url).header(\"authorization\",actor).header(\"content-type\",\"application/json\").body(Body::from(body.to_owned())).unwrap()\n}\nasync fn json(r:axum::response::Response)->serde_json::Value{\n serde_json::from_slice(&to_bytes(r.into_body(),65536).await.unwrap()).unwrap()\n}\n#[tokio::test]\nasync fn rejects_anonymous_and_other_workspace(){\n let api=fresh().await;\n assert_eq!(api.clone().oneshot(req(\"GET\",\"/workspaces/1/tasks\",\"\",\"\")).await.unwrap().status(),StatusCode::UNAUTHORIZED);\n assert_eq!(api.clone().oneshot(req(\"GET\",\"/workspaces/1/tasks\",\"Bearer demo-bob\",\"\")).await.unwrap().status(),StatusCode::FORBIDDEN);\n assert_eq!(api.oneshot(req(\"POST\",\"/workspaces/2/tasks\",\"Bearer demo-alice\",r#\"{\"title\":\"Leak\"}\"#)).await.unwrap().status(),StatusCode::FORBIDDEN);\n}\n#[tokio::test]\nasync fn task_change_and_event_are_committed_together(){\n let api=fresh().await;\n let r=api.clone().oneshot(req(\"POST\",\"/workspaces/1/tasks\",\"Bearer demo-alice\",r#\"{\"title\":\" Kiểm thử API \"}\"#)).await.unwrap();\n assert_eq!(r.status(),StatusCode::CREATED);assert_eq!(json(r).await[\"title\"],\"Kiểm thử API\");\n let r=api.clone().oneshot(req(\"PATCH\",\"/workspaces/1/tasks/1\",\"Bearer demo-alice\",r#\"{\"done\":true,\"version\":1}\"#)).await.unwrap();\n assert_eq!(r.status(),StatusCode::OK);assert_eq!(json(r).await[\"version\"],2);\n let r=api.clone().oneshot(req(\"GET\",\"/workspaces/1/events\",\"Bearer demo-alice\",\"\")).await.unwrap();\n let events=json(r).await;assert_eq!(events.as_array().unwrap().len(),2);assert_eq!(events[1][\"kind\"],\"task.changed\");\n let r=api.oneshot(req(\"GET\",\"/workspaces/1/tasks\",\"Bearer demo-alice\",\"\")).await.unwrap();\n assert_eq!(json(r).await[0][\"done\"],true);\n}\n#[tokio::test]\nasync fn stale_update_does_not_create_event(){\n let api=fresh().await;\n api.clone().oneshot(req(\"POST\",\"/workspaces/1/tasks\",\"Bearer demo-alice\",r#\"{\"title\":\"A\"}\"#)).await.unwrap();\n api.clone().oneshot(req(\"PATCH\",\"/workspaces/1/tasks/1\",\"Bearer demo-alice\",r#\"{\"done\":true,\"version\":1}\"#)).await.unwrap();\n let r=api.clone().oneshot(req(\"PATCH\",\"/workspaces/1/tasks/1\",\"Bearer demo-alice\",r#\"{\"done\":false,\"version\":1}\"#)).await.unwrap();\n assert_eq!(r.status(),StatusCode::CONFLICT);\n let events=json(api.oneshot(req(\"GET\",\"/workspaces/1/events?after=1\",\"Bearer demo-alice\",\"\")).await.unwrap()).await;\n assert_eq!(events.as_array().unwrap().len(),1);\n}\n#[tokio::test]\nasync fn invalid_input_and_forged_owner_cannot_write(){\n let api=fresh().await;\n assert_eq!(api.clone().oneshot(req(\"POST\",\"/workspaces/1/tasks\",\"Bearer demo-alice\",r#\"{\"title\":\" \"}\"#)).await.unwrap().status(),StatusCode::UNPROCESSABLE_ENTITY);\n assert_eq!(api.clone().oneshot(req(\"POST\",\"/workspaces/1/tasks\",\"Bearer demo-alice\",r#\"{\"title\":\"A\",\"owner\":\"bob\"}\"#)).await.unwrap().status(),StatusCode::UNPROCESSABLE_ENTITY);\n let r=api.oneshot(req(\"GET\",\"/workspaces/1/events\",\"Bearer demo-alice\",\"\")).await.unwrap();\n assert_eq!(json(r).await,serde_json::json!([]));\n}\n"
          },
          {
            "path": "README.md",
            "content": "# Team Tasks\n\nDự án có hai bước thực hành trên cùng miền nghiệp vụ.\n\n- Package team-tasks là baseline Axum/SQLite: `cargo run -p team-tasks`, cổng 3017, token demo-alice/demo-bob. Dùng để theo dõi transaction và quyền từng bước.\n- Member team-tasks-adapters là phiên bản JWT RS256 + PostgreSQL + tonic gRPC + WebSocket. Hướng dẫn đầy đủ nằm trong adapters/README.md, kèm proto, build.rs, fixtures và tests.\n\n```sh\ncargo test --workspace --all-targets\ndocker compose -f adapters/compose.yaml up -d --wait\nDATABASE_URL=postgres://learn:learn_fixture_only@127.0.0.1:55432/learn_tasks cargo test -p team-tasks-adapters --test postgres -- --ignored --test-threads=1\n```\n\nCác test PostgreSQL bị ignored trong lệnh đầu vì cần database riêng; chạy lệnh thứ ba mới là bằng chứng trên database đích. RSA key trong fixtures được tạo cho bài và công khai; chỉ dùng với listener loopback. Server adapter nhận public key cấu hình, không nhận private key. Khi triển khai, dùng identity provider/key thật của môi trường và giữ các ca sai issuer/audience/expiry/algorithm/signature.\n\nBaseline SQLite:\n```sh\ncargo run -p team-tasks\ncurl -i -H 'Authorization: Bearer demo-alice' -H 'Content-Type: application/json' -d '{\"title\":\"Kiểm thử API\"}' http://127.0.0.1:3017/workspaces/1/tasks\ncurl -H 'Authorization: Bearer demo-alice' http://127.0.0.1:3017/workspaces/1/events\n```\n\nAlice thuộc workspace 1, Bob thuộc workspace 2. Actor không lấy từ body. Task và event cùng transaction, version cũ bị từ chối. Bản PostgreSQL thêm nhiều connection và khóa thứ tự commit theo workspace để reconnect không bỏ sót event. Các bước capstone còn lại: consumer dedup bền, retention/resync, migration, metrics/tải, shutdown và bàn giao; xem rubric của dự án và mục 7 trong adapters/README.md.\n"
          },
          {
            "path": "adapters/Cargo.toml",
            "content": "[package]\nname = \"team-tasks-adapters\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\naxum = { version = \"=0.8.9\", features = [\"ws\"] }\ntokio = { version = \"1\", features = [\"macros\", \"rt-multi-thread\", \"net\", \"signal\", \"sync\", \"time\"] }\ntokio-stream = { version = \"0.1\", features = [\"net\"] }\ntonic = \"=0.14.6\"\ntonic-prost = \"=0.14.6\"\nprost = \"=0.14.1\"\nasync-trait = \"0.1\"\nsqlx = { version = \"=0.8.6\", default-features = false, features = [\"runtime-tokio\", \"tls-rustls-ring\", \"postgres\"] }\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\njsonwebtoken = \"=9.3.1\"\nfutures-util = \"0.3\"\n\n[build-dependencies]\ntonic-prost-build = \"=0.14.6\"\nprost-build = \"=0.14.1\"\nprotoc-bin-vendored = \"=3.2.0\"\n\n[dev-dependencies]\ntokio-tungstenite = \"=0.28.0\"\ntower = { version = \"0.5\", features = [\"util\"] }\n"
          },
          {
            "path": "adapters/build.rs",
            "content": "fn main() -> Result<(), Box<dyn std::error::Error>> {\n    let mut config = prost_build::Config::new();\n    config.protoc_executable(protoc_bin_vendored::protoc_bin_path()?);\n    tonic_prost_build::configure().compile_with_config(config, &[\"proto/tasks.proto\"], &[\"proto\"])?;\n    println!(\"cargo:rerun-if-changed=proto/tasks.proto\");\n    Ok(())\n}\n"
          },
          {
            "path": "adapters/proto/tasks.proto",
            "content": "syntax = \"proto3\";\npackage learn.tasks.v1;\n\n// Field numbers are the wire contract. Never reuse a removed field number.\nservice Tasks {\n  rpc CreateTask(CreateTaskRequest) returns (Task);\n  rpc SetDone(SetDoneRequest) returns (Task);\n  rpc ListEvents(ListEventsRequest) returns (EventPage);\n}\nmessage CreateTaskRequest { int64 workspace_id = 1; string title = 2; }\nmessage SetDoneRequest {\n  int64 workspace_id = 1; int64 task_id = 2;\n  int64 expected_version = 3; bool done = 4;\n}\nmessage ListEventsRequest { int64 workspace_id = 1; int64 after = 2; }\nmessage Task {\n  int64 id = 1; int64 workspace_id = 2; string title = 3;\n  bool done = 4; int64 version = 5;\n}\nmessage Event {\n  int64 id = 1; int64 workspace_id = 2; int64 task_id = 3;\n  int64 version = 4; string kind = 5;\n}\nmessage EventPage { repeated Event events = 1; }\n"
          },
          {
            "path": "adapters/src/lib.rs",
            "content": "pub mod auth;\npub mod core;\npub mod memory;\npub mod postgres;\npub mod rpc;\npub mod web;\npub mod pb { tonic::include_proto!(\"learn.tasks.v1\"); }\n"
          },
          {
            "path": "adapters/src/auth.rs",
            "content": "use jsonwebtoken::{decode, decode_header, Algorithm, DecodingKey, Validation};\nuse serde::{Deserialize, Serialize};\nuse std::time::{SystemTime, UNIX_EPOCH};\n\n#[derive(Clone, Debug, Serialize, Deserialize)]\npub struct Claims {\n    pub sub: String,\n    pub iss: String,\n    pub aud: String,\n    pub exp: u64,\n    pub nbf: u64,\n}\n#[derive(Clone)]\npub struct Verifier { key: DecodingKey, policy: Validation, kid: String }\n#[derive(Debug, PartialEq, Eq)]\npub struct AuthError;\npub fn now() -> u64 { SystemTime::now().duration_since(UNIX_EPOCH).expect(\"UTC clock\").as_secs() }\nimpl Verifier {\n    pub fn rs256(pem: &[u8], issuer: &str, audience: &str, kid: &str) -> Result<Self, AuthError> {\n        if issuer.is_empty() || audience.is_empty() || kid.is_empty() { return Err(AuthError); }\n        let key = DecodingKey::from_rsa_pem(pem).map_err(|_| AuthError)?;\n        let mut policy = Validation::new(Algorithm::RS256);\n        policy.set_issuer(&[issuer]);\n        policy.set_audience(&[audience]);\n        policy.set_required_spec_claims(&[\"sub\", \"iss\", \"aud\", \"exp\", \"nbf\"]);\n        policy.validate_nbf = true;\n        policy.leeway = 0;\n        Ok(Self { key, policy, kid: kid.to_owned() })\n    }\n    pub fn verify(&self, token: &str) -> Result<Claims, AuthError> {\n        if token.len() > 4096 { return Err(AuthError); }\n        // Header is untrusted: compare only to configured values, never fetch a URL from it.\n        let header = decode_header(token).map_err(|_| AuthError)?;\n        if header.alg != Algorithm::RS256 || header.kid.as_deref() != Some(&self.kid) {\n            return Err(AuthError);\n        }\n        let claims = decode::<Claims>(token, &self.key, &self.policy).map_err(|_| AuthError)?.claims;\n        if claims.sub.is_empty() || claims.sub.len() > 128 || claims.exp <= now() {\n            return Err(AuthError);\n        }\n        Ok(claims)\n    }\n    pub fn bearer(&self, value: Option<&str>) -> Result<Claims, AuthError> {\n        let token = value.and_then(|v| v.strip_prefix(\"Bearer \")).ok_or(AuthError)?;\n        self.verify(token)\n    }\n}\n"
          },
          {
            "path": "adapters/src/core.rs",
            "content": "use async_trait::async_trait;\nuse serde::{Deserialize, Serialize};\n\n#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]\npub struct Task { pub id: i64, pub workspace_id: i64, pub title: String, pub done: bool, pub version: i64 }\n#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]\npub struct Event { pub id: i64, pub workspace_id: i64, pub task_id: i64, pub version: i64, pub kind: String }\n#[derive(Debug, PartialEq, Eq)]\npub enum Error { Invalid, Forbidden, Missing, Conflict, Database, Injected }\npub fn title(value: &str) -> Result<String, Error> {\n    let value = value.trim();\n    if value.is_empty() || value.chars().count() > 120 { Err(Error::Invalid) }\n    else { Ok(value.to_owned()) }\n}\n#[async_trait]\npub trait Store: Send + Sync {\n    async fn create(&self, actor: &str, workspace: i64, title: &str) -> Result<Task, Error>;\n    async fn update(&self, actor: &str, workspace: i64, id: i64, expected: i64, done: bool) -> Result<Task, Error>;\n    async fn events(&self, actor: &str, workspace: i64, after: i64) -> Result<Vec<Event>, Error>;\n}\n"
          },
          {
            "path": "adapters/src/memory.rs",
            "content": "use crate::core::{self, Error, Event, Store, Task};\nuse async_trait::async_trait;\nuse std::{collections::BTreeMap, time::Duration};\nuse tokio::sync::Mutex;\n\n#[derive(Default)]\nstruct Data { tasks: BTreeMap<i64, Task>, events: Vec<Event> }\npub struct MemoryStore { data: Mutex<Data>, delay: Duration }\nimpl Default for MemoryStore {\n    fn default() -> Self { Self { data: Mutex::new(Data::default()), delay: Duration::ZERO } }\n}\nimpl MemoryStore {\n    pub fn with_delay(delay: Duration) -> Self { Self { delay, ..Self::default() } }\n    fn allow(actor: &str, workspace: i64) -> Result<(), Error> {\n        if matches!((actor, workspace), (\"alice\", 1) | (\"bob\", 2)) { Ok(()) } else { Err(Error::Forbidden) }\n    }\n    async fn wait(&self) { if !self.delay.is_zero() { tokio::time::sleep(self.delay).await; } }\n}\n#[async_trait]\nimpl Store for MemoryStore {\n    async fn create(&self, actor: &str, workspace: i64, value: &str) -> Result<Task, Error> {\n        Self::allow(actor, workspace)?;\n        let title = core::title(value)?;\n        self.wait().await;\n        let mut data = self.data.lock().await;\n        let task = Task { id: data.tasks.len() as i64 + 1, workspace_id: workspace, title, done: false, version: 1 };\n        data.tasks.insert(task.id, task.clone());\n        let id = data.events.len() as i64 + 1;\n        data.events.push(Event { id, workspace_id: workspace, task_id: task.id, version: 1, kind: \"task.created\".into() });\n        Ok(task)\n    }\n    async fn update(&self, actor: &str, workspace: i64, id: i64, expected: i64, done: bool) -> Result<Task, Error> {\n        Self::allow(actor, workspace)?;\n        if expected < 1 || expected == i64::MAX { return Err(Error::Invalid); }\n        self.wait().await;\n        let mut data = self.data.lock().await;\n        let old = data.tasks.get_mut(&id).filter(|x| x.workspace_id == workspace).ok_or(Error::Missing)?;\n        if old.version != expected { return Err(Error::Conflict); }\n        old.done = done; old.version += 1;\n        let task = old.clone();\n        let event_id = data.events.len() as i64 + 1;\n        data.events.push(Event { id: event_id, workspace_id: workspace, task_id: id, version: task.version, kind: \"task.changed\".into() });\n        Ok(task)\n    }\n    async fn events(&self, actor: &str, workspace: i64, after: i64) -> Result<Vec<Event>, Error> {\n        Self::allow(actor, workspace)?;\n        if after < 0 { return Err(Error::Invalid); }\n        self.wait().await;\n        Ok(self.data.lock().await.events.iter().filter(|e| e.workspace_id == workspace && e.id > after).take(32).cloned().collect())\n    }\n}\n"
          },
          {
            "path": "adapters/schema.sql",
            "content": "CREATE TABLE IF NOT EXISTS workspaces (\n  id BIGINT PRIMARY KEY\n);\nCREATE TABLE IF NOT EXISTS memberships (\n  workspace_id BIGINT NOT NULL REFERENCES workspaces(id),\n  actor TEXT NOT NULL CHECK (length(actor) BETWEEN 1 AND 128),\n  PRIMARY KEY (workspace_id, actor)\n);\nCREATE TABLE IF NOT EXISTS tasks (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  workspace_id BIGINT NOT NULL REFERENCES workspaces(id),\n  title TEXT NOT NULL CHECK (length(btrim(title)) BETWEEN 1 AND 120),\n  done BOOLEAN NOT NULL DEFAULT FALSE,\n  version BIGINT NOT NULL CHECK (version > 0)\n);\nCREATE INDEX IF NOT EXISTS tasks_workspace_cursor ON tasks(workspace_id, id);\nCREATE TABLE IF NOT EXISTS outbox (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  workspace_id BIGINT NOT NULL REFERENCES workspaces(id),\n  task_id BIGINT NOT NULL REFERENCES tasks(id),\n  version BIGINT NOT NULL CHECK (version > 0),\n  kind TEXT NOT NULL CHECK (kind IN ('task.created', 'task.changed')),\n  UNIQUE (task_id, version)\n);\nCREATE INDEX IF NOT EXISTS outbox_workspace_cursor ON outbox(workspace_id, id);\nINSERT INTO workspaces(id) VALUES(1),(2) ON CONFLICT DO NOTHING;\nINSERT INTO memberships(workspace_id,actor) VALUES(1,'alice'),(2,'bob') ON CONFLICT DO NOTHING;\n"
          },
          {
            "path": "adapters/src/postgres.rs",
            "content": "use crate::core::{self, Error, Event, Store, Task};\nuse async_trait::async_trait;\nuse sqlx::{PgPool, Postgres, Transaction};\n#[derive(Clone)]\npub struct PgStore { pub pool: PgPool }\ntype TaskRow = (i64, i64, String, bool, i64);\nfn task((id, workspace_id, title, done, version): TaskRow) -> Task { Task { id, workspace_id, title, done, version } }\nimpl PgStore {\n    pub async fn initialize(&self) -> Result<(), sqlx::Error> {\n        sqlx::raw_sql(include_str!(\"../schema.sql\")).execute(&self.pool).await?;\n        Ok(())\n    }\n    async fn authorize(tx: &mut Transaction<'_, Postgres>, actor: &str, workspace: i64) -> Result<(), Error> {\n        // This lock serializes a concurrent membership DELETE with this write transaction.\n        let member = sqlx::query_scalar::<_, String>(\"SELECT actor FROM memberships WHERE workspace_id=$1 AND actor=$2 FOR SHARE\")\n            .bind(workspace).bind(actor).fetch_optional(&mut **tx).await.map_err(|_| Error::Database)?;\n        if member.is_none() { Err(Error::Forbidden) } else { Ok(()) }\n    }\n    async fn lock_workspace(tx: &mut Transaction<'_, Postgres>, workspace: i64) -> Result<(), Error> {\n        // Serialize event allocation AND commit per workspace. Sequence values alone do not\n        // establish commit order: without this lock reconnect(after=id) could skip a late commit.\n        sqlx::query_scalar::<_, i64>(\"SELECT id FROM workspaces WHERE id=$1 FOR UPDATE\")\n            .bind(workspace).fetch_one(&mut **tx).await.map_err(|_| Error::Database)?;\n        Ok(())\n    }\n    pub async fn update_with_fault(&self, actor: &str, workspace: i64, id: i64, expected: i64, done: bool, fault: bool) -> Result<Task, Error> {\n        if expected < 1 || expected == i64::MAX { return Err(Error::Invalid); }\n        let mut tx = self.pool.begin().await.map_err(|_| Error::Database)?;\n        Self::authorize(&mut tx, actor, workspace).await?;\n        Self::lock_workspace(&mut tx, workspace).await?;\n        let updated = sqlx::query_as::<_, TaskRow>(\"UPDATE tasks SET done=$1,version=version+1 WHERE workspace_id=$2 AND id=$3 AND version=$4 RETURNING id,workspace_id,title,done,version\")\n            .bind(done).bind(workspace).bind(id).bind(expected).fetch_optional(&mut *tx).await.map_err(|_| Error::Database)?;\n        let Some(row) = updated else {\n            let found = sqlx::query_scalar::<_, bool>(\"SELECT EXISTS(SELECT 1 FROM tasks WHERE workspace_id=$1 AND id=$2)\")\n                .bind(workspace).bind(id).fetch_one(&mut *tx).await.map_err(|_| Error::Database)?;\n            tx.rollback().await.map_err(|_| Error::Database)?;\n            return Err(if found { Error::Conflict } else { Error::Missing });\n        };\n        let updated = task(row);\n        sqlx::query(\"INSERT INTO outbox(workspace_id,task_id,version,kind) VALUES($1,$2,$3,'task.changed')\")\n            .bind(workspace).bind(id).bind(updated.version).execute(&mut *tx).await.map_err(|_| Error::Database)?;\n        if fault { tx.rollback().await.map_err(|_| Error::Database)?; return Err(Error::Injected); }\n        tx.commit().await.map_err(|_| Error::Database)?;\n        Ok(updated)\n    }\n}\n#[async_trait]\nimpl Store for PgStore {\n    async fn create(&self, actor: &str, workspace: i64, value: &str) -> Result<Task, Error> {\n        let title = core::title(value)?;\n        let mut tx = self.pool.begin().await.map_err(|_| Error::Database)?;\n        Self::authorize(&mut tx, actor, workspace).await?;\n        Self::lock_workspace(&mut tx, workspace).await?;\n        let row = sqlx::query_as::<_, TaskRow>(\"INSERT INTO tasks(workspace_id,title,done,version) VALUES($1,$2,FALSE,1) RETURNING id,workspace_id,title,done,version\")\n            .bind(workspace).bind(title).fetch_one(&mut *tx).await.map_err(|_| Error::Database)?;\n        let task = task(row);\n        sqlx::query(\"INSERT INTO outbox(workspace_id,task_id,version,kind) VALUES($1,$2,1,'task.created')\")\n            .bind(workspace).bind(task.id).execute(&mut *tx).await.map_err(|_| Error::Database)?;\n        tx.commit().await.map_err(|_| Error::Database)?;\n        Ok(task)\n    }\n    async fn update(&self, actor: &str, workspace: i64, id: i64, expected: i64, done: bool) -> Result<Task, Error> {\n        self.update_with_fault(actor, workspace, id, expected, done, false).await\n    }\n    async fn events(&self, actor: &str, workspace: i64, after: i64) -> Result<Vec<Event>, Error> {\n        if after < 0 { return Err(Error::Invalid); }\n        let mut tx = self.pool.begin().await.map_err(|_| Error::Database)?;\n        Self::authorize(&mut tx, actor, workspace).await?;\n        let rows = sqlx::query_as::<_, (i64,i64,i64,i64,String)>(\"SELECT id,workspace_id,task_id,version,kind FROM outbox WHERE workspace_id=$1 AND id>$2 ORDER BY id LIMIT 32\")\n            .bind(workspace).bind(after).fetch_all(&mut *tx).await.map_err(|_| Error::Database)?;\n        tx.commit().await.map_err(|_| Error::Database)?;\n        Ok(rows.into_iter().map(|(id,workspace_id,task_id,version,kind)| Event { id,workspace_id,task_id,version,kind }).collect())\n    }\n}\n"
          },
          {
            "path": "adapters/src/rpc.rs",
            "content": "use crate::{auth::Verifier, core::{Error, Store}, pb::{self, tasks_server::{Tasks, TasksServer}}};\nuse std::{sync::Arc, time::Duration};\nuse tonic::{Request, Response, Status};\n\n#[derive(Clone)]\npub struct Rpc { pub store: Arc<dyn Store>, pub verifier: Verifier, pub budget: Duration }\nimpl Rpc {\n    fn actor<T>(&self, request: &Request<T>) -> Result<String, Status> {\n        self.verifier.bearer(request.metadata().get(\"authorization\").and_then(|x| x.to_str().ok()))\n            .map(|claims| claims.sub).map_err(|_| Status::unauthenticated(\"invalid_token\"))\n    }\n    pub fn service(self) -> TasksServer<Self> {\n        TasksServer::new(self).max_decoding_message_size(64 * 1024).max_encoding_message_size(64 * 1024)\n    }\n}\nfn status(error: Error) -> Status {\n    match error {\n        Error::Invalid => Status::invalid_argument(\"invalid_input\"),\n        Error::Forbidden => Status::permission_denied(\"forbidden\"),\n        Error::Missing => Status::not_found(\"not_found\"),\n        Error::Conflict => Status::aborted(\"version_conflict\"),\n        Error::Database | Error::Injected => Status::unavailable(\"storage_unavailable\"),\n    }\n}\nfn task(t: crate::core::Task) -> pb::Task {\n    pb::Task { id: t.id, workspace_id: t.workspace_id, title: t.title, done: t.done, version: t.version }\n}\n#[tonic::async_trait]\nimpl Tasks for Rpc {\n    async fn create_task(&self, request: Request<pb::CreateTaskRequest>) -> Result<Response<pb::Task>, Status> {\n        let actor = self.actor(&request)?;\n        let input = request.into_inner();\n        let result = tokio::time::timeout(self.budget, self.store.create(&actor, input.workspace_id, &input.title))\n            .await.map_err(|_| Status::deadline_exceeded(\"operation_deadline\"))?.map_err(status)?;\n        Ok(Response::new(task(result)))\n    }\n    async fn set_done(&self, request: Request<pb::SetDoneRequest>) -> Result<Response<pb::Task>, Status> {\n        let actor = self.actor(&request)?;\n        let input = request.into_inner();\n        let result = tokio::time::timeout(self.budget, self.store.update(&actor, input.workspace_id, input.task_id, input.expected_version, input.done))\n            .await.map_err(|_| Status::deadline_exceeded(\"operation_deadline\"))?.map_err(status)?;\n        Ok(Response::new(task(result)))\n    }\n    async fn list_events(&self, request: Request<pb::ListEventsRequest>) -> Result<Response<pb::EventPage>, Status> {\n        let actor = self.actor(&request)?;\n        let input = request.into_inner();\n        let result = tokio::time::timeout(self.budget, self.store.events(&actor, input.workspace_id, input.after))\n            .await.map_err(|_| Status::deadline_exceeded(\"operation_deadline\"))?.map_err(status)?;\n        Ok(Response::new(pb::EventPage { events: result.into_iter().map(|e| pb::Event {\n            id:e.id, workspace_id:e.workspace_id, task_id:e.task_id, version:e.version, kind:e.kind,\n        }).collect() }))\n    }\n}\n"
          },
          {
            "path": "adapters/src/web.rs",
            "content": "use crate::{auth::{self, Claims, Verifier}, core::{Error, Store, Task}};\nuse axum::{\n    extract::{ws::{CloseFrame, Message, WebSocket}, DefaultBodyLimit, Path, Query, State, WebSocketUpgrade},\n    http::{HeaderMap, StatusCode}, response::{IntoResponse, Response}, routing::{get, post}, Json, Router,\n};\nuse serde::Deserialize;\nuse std::{sync::Arc, time::Duration};\n\n#[derive(Clone)]\npub struct Web { pub store: Arc<dyn Store>, pub verifier: Verifier }\nstruct HttpError(StatusCode, &'static str);\nimpl IntoResponse for HttpError {\n    fn into_response(self) -> Response { (self.0, Json(serde_json::json!({\"code\":self.1}))).into_response() }\n}\nimpl From<Error> for HttpError {\n    fn from(value: Error) -> Self {\n        match value {\n            Error::Invalid => Self(StatusCode::UNPROCESSABLE_ENTITY,\"invalid_input\"),\n            Error::Forbidden => Self(StatusCode::FORBIDDEN,\"forbidden\"),\n            Error::Missing => Self(StatusCode::NOT_FOUND,\"not_found\"),\n            Error::Conflict => Self(StatusCode::CONFLICT,\"version_conflict\"),\n            _ => Self(StatusCode::SERVICE_UNAVAILABLE,\"storage_unavailable\"),\n        }\n    }\n}\nfn principal(state: &Web, headers: &HeaderMap) -> Result<Claims, HttpError> {\n    state.verifier.bearer(headers.get(\"authorization\").and_then(|v| v.to_str().ok()))\n        .map_err(|_| HttpError(StatusCode::UNAUTHORIZED,\"invalid_token\"))\n}\n#[derive(Deserialize)]\n#[serde(deny_unknown_fields)]\nstruct Create { title: String }\n#[derive(Deserialize)]\n#[serde(deny_unknown_fields)]\nstruct Update { done: bool, version: i64 }\n#[derive(Deserialize)]\nstruct Cursor { #[serde(default)] after: i64 }\npub fn app(state: Web) -> Router {\n    Router::new()\n        .route(\"/workspaces/{workspace}/tasks\",post(create))\n        .route(\"/workspaces/{workspace}/tasks/{id}\",axum::routing::patch(update))\n        .route(\"/workspaces/{workspace}/events\",get(events))\n        .route(\"/workspaces/{workspace}/stream\",get(upgrade))\n        .layer(DefaultBodyLimit::max(16*1024)).with_state(state)\n}\nasync fn create(State(s): State<Web>, Path(w): Path<i64>, headers: HeaderMap, Json(input): Json<Create>) -> Result<(StatusCode, Json<Task>), HttpError> {\n    let actor = principal(&s, &headers)?.sub;\n    let task = tokio::time::timeout(Duration::from_secs(2),s.store.create(&actor,w,&input.title))\n        .await.map_err(|_|HttpError(StatusCode::GATEWAY_TIMEOUT,\"operation_deadline\"))??;\n    Ok((StatusCode::CREATED,Json(task)))\n}\nasync fn update(State(s): State<Web>, Path((w,id)): Path<(i64,i64)>, headers: HeaderMap, Json(input): Json<Update>) -> Result<Json<Task>, HttpError> {\n    let actor = principal(&s, &headers)?.sub;\n    let task = tokio::time::timeout(Duration::from_secs(2),s.store.update(&actor,w,id,input.version,input.done))\n        .await.map_err(|_|HttpError(StatusCode::GATEWAY_TIMEOUT,\"operation_deadline\"))??;\n    Ok(Json(task))\n}\nasync fn events(State(s): State<Web>, Path(w): Path<i64>, headers: HeaderMap, Query(c): Query<Cursor>) -> Result<Json<Vec<crate::core::Event>>, HttpError> {\n    let actor = principal(&s, &headers)?.sub;\n    let events = tokio::time::timeout(Duration::from_secs(2),s.store.events(&actor,w,c.after))\n        .await.map_err(|_|HttpError(StatusCode::GATEWAY_TIMEOUT,\"operation_deadline\"))??;\n    Ok(Json(events))\n}\nasync fn upgrade(State(s): State<Web>, Path(w): Path<i64>, Query(c): Query<Cursor>, ws: WebSocketUpgrade) -> Result<Response, HttpError> {\n    if c.after < 0 { return Err(HttpError(StatusCode::UNPROCESSABLE_ENTITY,\"invalid_cursor\")); }\n    // Browser WebSocket cannot set Authorization. Authenticate with the first frame:\n    // never put bearer credentials in a URL/query string.\n    Ok(ws.max_message_size(4096).max_frame_size(4096).write_buffer_size(0).max_write_buffer_size(16384)\n        .on_upgrade(move |socket| session(socket,s,w,c.after)))\n}\nasync fn close(socket: &mut WebSocket, code: u16, reason: &'static str) {\n    let _ = tokio::time::timeout(Duration::from_millis(400),socket.send(Message::Close(Some(CloseFrame { code,reason:reason.into() })))).await;\n}\nasync fn session(mut socket: WebSocket, state: Web, workspace: i64, mut after: i64) {\n    #[derive(Deserialize)] #[serde(deny_unknown_fields)] struct Login { token: String }\n    let login = match tokio::time::timeout(Duration::from_secs(3),socket.recv()).await {\n        Ok(Some(Ok(Message::Text(text)))) => serde_json::from_str::<Login>(&text).ok(),\n        _ => None,\n    };\n    let claims = login.and_then(|input| state.verifier.verify(&input.token).ok());\n    let Some(claims) = claims else { close(&mut socket,1008,\"invalid_token\").await; return; };\n    let mut tick = tokio::time::interval(Duration::from_millis(50));\n    tick.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Skip);\n    loop {\n        tokio::select! {\n            message = socket.recv() => match message {\n                Some(Ok(Message::Close(_))) | None | Some(Err(_)) => return,\n                Some(Ok(Message::Ping(bytes))) => {\n                    if !matches!(tokio::time::timeout(Duration::from_millis(400),socket.send(Message::Pong(bytes))).await,Ok(Ok(()))) { return; }\n                }\n                Some(Ok(Message::Pong(_))) => {}\n                _ => { close(&mut socket,1008,\"unexpected_message\").await; return; }\n            },\n            _ = tick.tick() => {\n                if claims.exp <= auth::now() { close(&mut socket,1008,\"token_expired\").await; return; }\n                // Recheck membership for every batch; revocation also stops existing sessions.\n                let result = tokio::time::timeout(Duration::from_secs(2),state.store.events(&claims.sub,workspace,after)).await;\n                let events = match result {\n                    Ok(Ok(events)) => events,\n                    Ok(Err(Error::Forbidden)) => { close(&mut socket,1008,\"forbidden\").await; return; }\n                    _ => { close(&mut socket,1013,\"retry_later\").await; return; }\n                };\n                for event in events {\n                    let id = event.id;\n                    let text = serde_json::json!({\"type\":\"event\",\"event\":event}).to_string();\n                    if !matches!(tokio::time::timeout(Duration::from_millis(400),socket.send(Message::Text(text.into()))).await,Ok(Ok(()))) {\n                        // No unbounded channel: close this session; client resumes its APPLIED cursor.\n                        return;\n                    }\n                    after = id;\n                }\n            }\n        }\n    }\n}\n"
          },
          {
            "path": "adapters/src/bin/server.rs",
            "content": "use std::{sync::Arc,time::Duration};\nuse sqlx::postgres::PgPoolOptions;\nuse team_tasks_adapters::{auth::Verifier,core::Store,postgres::PgStore,rpc::Rpc,web::{self,Web}};\nuse tokio_stream::wrappers::TcpListenerStream;\n#[tokio::main]\nasync fn main() -> Result<(),Box<dyn std::error::Error>> {\n    let database = std::env::var(\"DATABASE_URL\")?;\n    let public_key = std::fs::read(std::env::var(\"JWT_PUBLIC_KEY_PATH\")?)?;\n    let verifier = Verifier::rs256(&public_key,&std::env::var(\"JWT_ISSUER\")?,&std::env::var(\"JWT_AUDIENCE\")?,&std::env::var(\"JWT_KEY_ID\")?)\n        .map_err(|_|std::io::Error::other(\"JWT configuration invalid\"))?;\n    let pool = PgPoolOptions::new().max_connections(8).acquire_timeout(Duration::from_secs(2)).connect(&database).await?;\n    let pg = PgStore { pool:pool.clone() };\n    pg.initialize().await?;\n    let store:Arc<dyn Store> = Arc::new(pg);\n    let http = tokio::net::TcpListener::bind(\"127.0.0.1:3018\").await?;\n    let grpc = tokio::net::TcpListener::bind(\"127.0.0.1:5018\").await?;\n    let (stop,_) = tokio::sync::watch::channel(false);\n    let mut http_stop = stop.subscribe(); let mut grpc_stop = stop.subscribe();\n    let http_job = tokio::spawn(async move {\n        axum::serve(http,web::app(Web { store:store.clone(),verifier:verifier.clone() }))\n            .with_graceful_shutdown(async move { let _ = http_stop.changed().await; }).await\n    });\n    // Build a second adapter over the SAME pool and identity policy.\n    let verifier = Verifier::rs256(&public_key,&std::env::var(\"JWT_ISSUER\")?,&std::env::var(\"JWT_AUDIENCE\")?,&std::env::var(\"JWT_KEY_ID\")?)\n        .map_err(|_|std::io::Error::other(\"JWT configuration invalid\"))?;\n    let rpc = Rpc { store:Arc::new(PgStore { pool:pool.clone() }),verifier,budget:Duration::from_secs(2) };\n    let grpc_job = tokio::spawn(async move {\n        tonic::transport::Server::builder().concurrency_limit_per_connection(32).max_concurrent_streams(32)\n            .add_service(rpc.service()).serve_with_incoming_shutdown(TcpListenerStream::new(grpc),async move { let _ = grpc_stop.changed().await; }).await\n    });\n    println!(\"HTTP/WS 127.0.0.1:3018; gRPC 127.0.0.1:5018\");\n    tokio::signal::ctrl_c().await?;\n    let _ = stop.send(true);\n    // Abort lingering sockets after the drain budget; durable outbox supports resume.\n    let mut http_job = http_job; let mut grpc_job = grpc_job;\n    if tokio::time::timeout(Duration::from_secs(3),&mut http_job).await.is_err() { http_job.abort(); }\n    if tokio::time::timeout(Duration::from_secs(3),&mut grpc_job).await.is_err() { grpc_job.abort(); }\n    pool.close().await;\n    Ok(())\n}\n"
          },
          {
            "path": "adapters/src/bin/issue-fixture-token.rs",
            "content": "use jsonwebtoken::{encode,Algorithm,EncodingKey,Header};\nuse team_tasks_adapters::auth::{now,Claims};\nfn main() -> Result<(),Box<dyn std::error::Error>> {\n    let sub=std::env::args().nth(1).unwrap_or_else(||\"alice\".into());\n    if !matches!(sub.as_str(),\"alice\"|\"bob\") { return Err(\"fixture actor must be alice or bob\".into()); }\n    let mut header=Header::new(Algorithm::RS256);header.kid=Some(\"learn-fixture-1\".into());\n    let claims=Claims { sub,iss:\"learn-rust-fixture\".into(),aud:\"team-tasks\".into(),exp:now()+120,nbf:now().saturating_sub(1) };\n    let key=EncodingKey::from_rsa_pem(include_bytes!(\"../../fixtures/fixture-private.pem\"))?;\n    println!(\"{}\",encode(&header,&claims,&key)?);\n    Ok(())\n}\n"
          },
          {
            "path": "adapters/src/bin/rpc-client.rs",
            "content": "use team_tasks_adapters::pb::{tasks_client::TasksClient,CreateTaskRequest,SetDoneRequest};\n#[tokio::main]\nasync fn main() -> Result<(),Box<dyn std::error::Error>> {\n    let token=std::env::var(\"ACCESS_TOKEN\")?;\n    let mut client=TasksClient::connect(\"http://127.0.0.1:5018\").await?;\n    let mut create=tonic::Request::new(CreateTaskRequest { workspace_id:1,title:\"Giao việc qua gRPC\".into() });\n    create.metadata_mut().insert(\"authorization\",format!(\"Bearer {token}\").parse()?);\n    create.set_timeout(std::time::Duration::from_secs(1));\n    let task=client.create_task(create).await?.into_inner();\n    println!(\"created task={} version={}\",task.id,task.version);\n    let mut update=tonic::Request::new(SetDoneRequest { workspace_id:1,task_id:task.id,expected_version:task.version,done:true });\n    update.metadata_mut().insert(\"authorization\",format!(\"Bearer {token}\").parse()?);\n    update.set_timeout(std::time::Duration::from_secs(1));\n    let task=client.set_done(update).await?.into_inner();\n    println!(\"updated task={} version={} done={}\",task.id,task.version,task.done);\n    Ok(())\n}\n"
          },
          {
            "path": "adapters/compose.yaml",
            "content": "services:\n  postgres:\n    image: postgres:17\n    environment:\n      POSTGRES_USER: learn\n      POSTGRES_PASSWORD: learn_fixture_only\n      POSTGRES_DB: learn_tasks\n    ports:\n      - \"127.0.0.1:55432:5432\"\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U learn -d learn_tasks\"]\n      interval: 2s\n      timeout: 2s\n      retries: 20\n"
          },
          {
            "path": "adapters/tests/common/mod.rs",
            "content": "#![allow(dead_code)]\nuse std::{net::SocketAddr,sync::Arc,time::Duration};\nuse jsonwebtoken::{encode,Algorithm,EncodingKey,Header};\nuse team_tasks_adapters::{auth::{now,Claims,Verifier},core::Store,rpc::Rpc,web::{self,Web}};\nuse tokio_stream::wrappers::TcpListenerStream;\npub fn verifier() -> Verifier {\n    Verifier::rs256(include_bytes!(\"../../fixtures/fixture-public.pem\"),\"learn-rust-fixture\",\"team-tasks\",\"learn-fixture-1\").unwrap()\n}\npub fn claims(actor: &str) -> Claims {\n    Claims { sub:actor.into(),iss:\"learn-rust-fixture\".into(),aud:\"team-tasks\".into(),exp:now()+120,nbf:now().saturating_sub(1) }\n}\npub fn sign(claims: Claims, algorithm: Algorithm, kid: &str) -> String {\n    let mut header=Header::new(algorithm);header.kid=Some(kid.into());\n    encode(&header,&claims,&EncodingKey::from_rsa_pem(include_bytes!(\"../../fixtures/fixture-private.pem\")).unwrap()).unwrap()\n}\npub fn token(actor: &str) -> String { sign(claims(actor),Algorithm::RS256,\"learn-fixture-1\") }\npub fn request<T>(value: T, actor: &str) -> tonic::Request<T> {\n    let mut request=tonic::Request::new(value);\n    request.metadata_mut().insert(\"authorization\",format!(\"Bearer {}\",token(actor)).parse().unwrap());\n    request.set_timeout(Duration::from_secs(2));\n    request\n}\npub struct Running { pub address:SocketAddr, job:tokio::task::JoinHandle<()> }\nimpl Drop for Running { fn drop(&mut self) { self.job.abort(); } }\npub async fn rpc(store:Arc<dyn Store>,budget:Duration) -> Running {\n    let listener=tokio::net::TcpListener::bind(\"127.0.0.1:0\").await.unwrap();\n    let address=listener.local_addr().unwrap();\n    let service=Rpc { store,verifier:verifier(),budget }.service();\n    let job=tokio::spawn(async move {\n        tonic::transport::Server::builder().concurrency_limit_per_connection(8)\n            .add_service(service).serve_with_incoming(TcpListenerStream::new(listener)).await.unwrap();\n    });\n    Running { address,job }\n}\npub async fn web(store:Arc<dyn Store>) -> Running {\n    let listener=tokio::net::TcpListener::bind(\"127.0.0.1:0\").await.unwrap();\n    let address=listener.local_addr().unwrap();\n    let job=tokio::spawn(async move {\n        axum::serve(listener,web::app(Web { store,verifier:verifier() })).await.unwrap();\n    });\n    Running { address,job }\n}\npub type Socket=tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;\npub async fn socket(server:&Running,workspace:i64,after:i64,access_token:&str) -> Socket {\n    use futures_util::SinkExt;\n    let (mut socket,_)=tokio_tungstenite::connect_async(format!(\"ws://{}/workspaces/{workspace}/stream?after={after}\",server.address)).await.unwrap();\n    socket.send(tokio_tungstenite::tungstenite::Message::Text(serde_json::json!({\"token\":access_token}).to_string().into())).await.unwrap();\n    socket\n}\npub async fn next_event(socket:&mut Socket) -> team_tasks_adapters::core::Event {\n    use futures_util::StreamExt;\n    tokio::time::timeout(Duration::from_secs(3),async {\n        loop {\n            let frame=socket.next().await.expect(\"open socket\").expect(\"valid frame\");\n            if let tokio_tungstenite::tungstenite::Message::Text(text)=frame {\n                let json:serde_json::Value=serde_json::from_str(&text).unwrap();\n                if json[\"type\"]==\"event\" { return serde_json::from_value(json[\"event\"].clone()).unwrap(); }\n            }\n        }\n    }).await.expect(\"event deadline\")\n}\n"
          },
          {
            "path": "adapters/tests/auth.rs",
            "content": "mod common;\nuse jsonwebtoken::Algorithm;\nuse team_tasks_adapters::auth::now;\n#[test]\nfn rs256_valid_claims_are_verified() {\n    assert_eq!(common::verifier().verify(&common::token(\"alice\")).unwrap().sub,\"alice\");\n}\n#[test]\nfn expired_wrong_issuer_audience_and_future_nbf_are_rejected() {\n    let mut cases=Vec::new();\n    let mut c=common::claims(\"alice\");c.exp=now().saturating_sub(60);cases.push(c);\n    let mut c=common::claims(\"alice\");c.iss=\"other-issuer\".into();cases.push(c);\n    let mut c=common::claims(\"alice\");c.aud=\"other-api\".into();cases.push(c);\n    let mut c=common::claims(\"alice\");c.nbf=now()+60;cases.push(c);\n    let mut c=common::claims(\"\");c.sub.clear();cases.push(c);\n    for c in cases { assert!(common::verifier().verify(&common::sign(c,Algorithm::RS256,\"learn-fixture-1\")).is_err()); }\n}\n#[test]\nfn algorithm_kid_and_signature_are_not_selected_by_client() {\n    let v=common::verifier();\n    assert!(v.verify(&common::sign(common::claims(\"alice\"),Algorithm::RS384,\"learn-fixture-1\")).is_err());\n    assert!(v.verify(&common::sign(common::claims(\"alice\"),Algorithm::RS256,\"unknown-key\")).is_err());\n    let token=common::token(\"alice\");let (prefix,signature)=token.rsplit_once('.').unwrap();\n    let replacement=if signature.starts_with('A') { \"B\" } else { \"A\" };\n    let tampered=format!(\"{prefix}.{replacement}{}\",&signature[1..]);\n    assert!(v.verify(&tampered).is_err());\n    assert!(v.bearer(Some(\"alice\")).is_err());\n    assert!(v.bearer(None).is_err());\n}\n"
          },
          {
            "path": "adapters/tests/rpc.rs",
            "content": "mod common;\nuse std::{sync::Arc,time::Duration};\nuse team_tasks_adapters::{core::Store,memory::MemoryStore,pb::{tasks_client::TasksClient,CreateTaskRequest,ListEventsRequest,SetDoneRequest}};\n#[tokio::test]\nasync fn actual_http2_rpc_validates_auth_workspace_version_and_input() {\n    let store=Arc::new(MemoryStore::default());\n    let server=common::rpc(store,Duration::from_secs(1)).await;\n    let mut client=TasksClient::connect(format!(\"http://{}\",server.address)).await.unwrap();\n    let task=client.create_task(common::request(CreateTaskRequest { workspace_id:1,title:\"RPC task\".into() },\"alice\")).await.unwrap().into_inner();\n    assert_eq!(task.version,1);\n    let update=SetDoneRequest { workspace_id:1,task_id:task.id,expected_version:1,done:true };\n    let done=client.set_done(common::request(update.clone(),\"alice\")).await.unwrap().into_inner();\n    assert!(done.done);assert_eq!(done.version,2);\n    assert_eq!(client.set_done(common::request(update,\"alice\")).await.unwrap_err().code(),tonic::Code::Aborted);\n    assert_eq!(client.create_task(common::request(CreateTaskRequest { workspace_id:1,title:\" \".into() },\"alice\")).await.unwrap_err().code(),tonic::Code::InvalidArgument);\n    assert_eq!(client.list_events(common::request(ListEventsRequest { workspace_id:1,after:0 },\"bob\")).await.unwrap_err().code(),tonic::Code::PermissionDenied);\n    assert_eq!(client.list_events(ListEventsRequest { workspace_id:1,after:0 }).await.unwrap_err().code(),tonic::Code::Unauthenticated);\n    let events=client.list_events(common::request(ListEventsRequest { workspace_id:1,after:0 },\"alice\")).await.unwrap().into_inner().events;\n    assert_eq!(events.len(),2);assert_eq!(events[1].version,2);\n}\n#[tokio::test]\nasync fn bounded_operation_deadline_cancels_before_memory_mutation() {\n    let store=Arc::new(MemoryStore::with_delay(Duration::from_millis(100)));\n    let server=common::rpc(store.clone(),Duration::from_millis(5)).await;\n    let mut client=TasksClient::connect(format!(\"http://{}\",server.address)).await.unwrap();\n    assert_eq!(client.create_task(common::request(CreateTaskRequest { workspace_id:1,title:\"late\".into() },\"alice\")).await.unwrap_err().code(),tonic::Code::DeadlineExceeded);\n    assert!(store.events(\"alice\",1,0).await.unwrap().is_empty());\n    // A remote database commit may still be ambiguous after a network timeout;\n    // this test proves only cancellation before THIS in-memory side effect.\n}\n"
          },
          {
            "path": "adapters/tests/websocket.rs",
            "content": "mod common;\nuse std::{collections::BTreeSet,sync::Arc,time::Duration};\nuse futures_util::{SinkExt,StreamExt};\nuse team_tasks_adapters::{core::Store,memory::MemoryStore};\n#[tokio::test]\nasync fn reconnect_uses_applied_cursor_and_replayed_events_can_be_deduplicated() {\n    let store=Arc::new(MemoryStore::default());\n    let task=store.create(\"alice\",1,\"Reconnect task\").await.unwrap();\n    let server=common::web(store.clone()).await;\n    let token=common::token(\"alice\");\n    let mut socket=common::socket(&server,1,0,&token).await;\n    let first=common::next_event(&mut socket).await;\n    assert_eq!(first.version,1);\n    socket.close(None).await.unwrap();drop(socket);\n    store.update(\"alice\",1,task.id,1,true).await.unwrap();\n    let mut resumed=common::socket(&server,1,first.id,&token).await;\n    let second=common::next_event(&mut resumed).await;\n    assert!(second.id>first.id);assert_eq!(second.version,2);\n    resumed.close(None).await.unwrap();\n    // Simulate a consumer that applied both events, but crashed before saving its cursor.\n    let mut applied=BTreeSet::from([first.id,second.id]);\n    let mut replay=common::socket(&server,1,0,&token).await;\n    let mut duplicate_effects=0;\n    for _ in 0..2 { if applied.insert(common::next_event(&mut replay).await.id) { duplicate_effects+=1; } }\n    assert_eq!(duplicate_effects,0);assert_eq!(applied.len(),2);\n    replay.close(None).await.unwrap();\n}\n#[tokio::test]\nasync fn unauthorized_and_cross_workspace_sessions_close_without_events() {\n    for (token,workspace) in [(String::from(\"bad-token\"),1),(common::token(\"bob\"),1)] {\n        let server=common::web(Arc::new(MemoryStore::default())).await;\n        let mut socket=common::socket(&server,workspace,0,&token).await;\n        let frame=tokio::time::timeout(Duration::from_secs(2),socket.next()).await.unwrap().unwrap().unwrap();\n        assert!(matches!(frame,tokio_tungstenite::tungstenite::Message::Close(Some(c)) if u16::from(c.code)==1008));\n    }\n}\n"
          },
          {
            "path": "adapters/tests/http_jwt.rs",
            "content": "mod common;\nuse axum::{body::Body,http::{Request,StatusCode}};\nuse std::sync::Arc;\nuse team_tasks_adapters::{memory::MemoryStore,web::{app,Web}};\nuse tower::ServiceExt;\n#[tokio::test]\nasync fn http_uses_verified_subject_and_rejects_actor_in_body() {\n    let app=app(Web { store:Arc::new(MemoryStore::default()),verifier:common::verifier() });\n    for (token,body,status) in [\n        (common::token(\"alice\"),r#\"{\"title\":\"HTTP JWT\"}\"#,StatusCode::CREATED),\n        (\"bad-token\".into(),r#\"{\"title\":\"bad\"}\"#,StatusCode::UNAUTHORIZED),\n        (common::token(\"bob\"),r#\"{\"title\":\"cross\"}\"#,StatusCode::FORBIDDEN),\n        (common::token(\"alice\"),r#\"{\"title\":\"spoof\",\"actor\":\"bob\"}\"#,StatusCode::UNPROCESSABLE_ENTITY),\n    ] {\n        let response=app.clone().oneshot(Request::builder().method(\"POST\").uri(\"/workspaces/1/tasks\")\n            .header(\"authorization\",format!(\"Bearer {token}\")).header(\"content-type\",\"application/json\")\n            .body(Body::from(body)).unwrap()).await.unwrap();\n        assert_eq!(response.status(),status);\n    }\n}\n"
          },
          {
            "path": "adapters/tests/postgres.rs",
            "content": "mod common;\nuse std::{sync::Arc,time::{Duration,SystemTime,UNIX_EPOCH}};\nuse sqlx::{PgPool,postgres::PgPoolOptions};\nuse team_tasks_adapters::{core::{Error,Store},postgres::PgStore,pb::{tasks_client::TasksClient,CreateTaskRequest,SetDoneRequest}};\nstruct Database { admin:PgPool, store:Arc<PgStore>, schema:String }\nimpl Database {\n    async fn new() -> Self {\n        let url=std::env::var(\"DATABASE_URL\").expect(\"Set DATABASE_URL to the isolated lab PostgreSQL before running ignored tests\");\n        let admin=PgPoolOptions::new().max_connections(2).connect(&url).await.unwrap();\n        let schema=format!(\"lr_{}_{}\",std::process::id(),SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos());\n        // Identifier is generated solely from digits and a fixed prefix, never from user input.\n        sqlx::query(&format!(\"CREATE SCHEMA {schema}\")).execute(&admin).await.unwrap();\n        let path=schema.clone();\n        let pool=PgPoolOptions::new().max_connections(8).acquire_timeout(Duration::from_secs(2))\n            .after_connect(move |conn,_| { let sql=format!(\"SET search_path TO {path}\");Box::pin(async move { sqlx::query(&sql).execute(conn).await?;Ok(()) }) })\n            .connect(&url).await.unwrap();\n        let store=Arc::new(PgStore { pool });store.initialize().await.unwrap();\n        Self { admin,store,schema }\n    }\n    async fn finish(self) {\n        self.store.pool.close().await;\n        sqlx::query(&format!(\"DROP SCHEMA {} CASCADE\",self.schema)).execute(&self.admin).await.unwrap();\n        self.admin.close().await;\n    }\n}\n#[tokio::test]\n#[ignore = \"requires dedicated PostgreSQL; see README\"]\nasync fn postgres_multi_connection_version_rollback_and_permission() {\n    let db=Database::new().await;\n    let task=db.store.create(\"alice\",1,\"PG task\").await.unwrap();\n    let (a,b)=tokio::join!(db.store.update(\"alice\",1,task.id,1,true),db.store.update(\"alice\",1,task.id,1,false));\n    assert_eq!(usize::from(a.is_ok())+usize::from(b.is_ok()),1);\n    assert!(matches!(a,Err(Error::Conflict))||matches!(b,Err(Error::Conflict)));\n    assert_eq!(db.store.events(\"alice\",1,0).await.unwrap().len(),2);\n    assert_eq!(db.store.update_with_fault(\"alice\",1,task.id,2,false,true).await,Err(Error::Injected));\n    let version:i64=sqlx::query_scalar(\"SELECT version FROM tasks WHERE id=$1\").bind(task.id).fetch_one(&db.store.pool).await.unwrap();\n    assert_eq!(version,2);assert_eq!(db.store.events(\"alice\",1,0).await.unwrap().len(),2);\n    assert_eq!(db.store.create(\"bob\",1,\"cross\").await,Err(Error::Forbidden));\n    assert!(sqlx::query(\"INSERT INTO tasks(workspace_id,title,done,version) VALUES(1,' ',FALSE,1)\").execute(&db.store.pool).await.is_err());\n    sqlx::query(\"DELETE FROM memberships WHERE workspace_id=1 AND actor='alice'\").execute(&db.store.pool).await.unwrap();\n    assert_eq!(db.store.events(\"alice\",1,0).await,Err(Error::Forbidden));\n    db.finish().await;\n}\n#[tokio::test]\n#[ignore = \"requires dedicated PostgreSQL; see README\"]\nasync fn postgres_cursor_does_not_skip_an_earlier_uncommitted_event() {\n    let db=Database::new().await;\n    let mut tx=db.store.pool.begin().await.unwrap();\n    sqlx::query(\"SELECT id FROM workspaces WHERE id=1 FOR UPDATE\").execute(&mut *tx).await.unwrap();\n    let store=db.store.clone();\n    let mut later=tokio::spawn(async move { store.create(\"alice\",1,\"second commit\").await });\n    assert!(tokio::time::timeout(Duration::from_millis(80),&mut later).await.is_err(),\"second writer must wait for the workspace commit lock\");\n    let task_id:i64=sqlx::query_scalar(\"INSERT INTO tasks(workspace_id,title,done,version) VALUES(1,'first commit',FALSE,1) RETURNING id\").fetch_one(&mut *tx).await.unwrap();\n    let first:i64=sqlx::query_scalar(\"INSERT INTO outbox(workspace_id,task_id,version,kind) VALUES(1,$1,1,'task.created') RETURNING id\").bind(task_id).fetch_one(&mut *tx).await.unwrap();\n    tx.commit().await.unwrap();\n    later.await.unwrap().unwrap();\n    let events=db.store.events(\"alice\",1,0).await.unwrap();\n    assert_eq!(events.len(),2);assert_eq!(events[0].id,first);assert!(events[1].id>first);\n    let resumed=db.store.events(\"alice\",1,first).await.unwrap();\n    assert_eq!(resumed,vec![events[1].clone()]);\n    db.finish().await;\n}\n#[tokio::test]\n#[ignore = \"requires dedicated PostgreSQL; see README\"]\nasync fn postgres_rpc_to_websocket_survives_transport_restart() {\n    let db=Database::new().await;\n    let rpc=common::rpc(db.store.clone(),Duration::from_secs(2)).await;\n    let mut client=TasksClient::connect(format!(\"http://{}\",rpc.address)).await.unwrap();\n    let task=client.create_task(common::request(CreateTaskRequest { workspace_id:1,title:\"same PG over two protocols\".into() },\"alice\")).await.unwrap().into_inner();\n    let web=common::web(db.store.clone()).await;\n    let mut socket=common::socket(&web,1,0,&common::token(\"alice\")).await;\n    let first=common::next_event(&mut socket).await;assert_eq!(first.task_id,task.id);\n    socket.close(None).await.unwrap();drop(socket);drop(web);\n    client.set_done(common::request(SetDoneRequest { workspace_id:1,task_id:task.id,expected_version:1,done:true },\"alice\")).await.unwrap();\n    let restarted=common::web(db.store.clone()).await;\n    let mut socket=common::socket(&restarted,1,first.id,&common::token(\"alice\")).await;\n    let second=common::next_event(&mut socket).await;\n    assert_eq!(second.version,2);assert!(second.id>first.id);\n    socket.close(None).await.unwrap();drop(socket);drop(restarted);drop(client);drop(rpc);\n    db.finish().await;\n}\n"
          },
          {
            "path": "adapters/fixtures/fixture-private.pem",
            "content": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC5y7PxHWH2X56A\n94/czj1Z3BVeuw0vicnjIFBwzLAyPVihe/s/KBLWbUJCB5COMmGRRsVkp7Y7Afrz\nmeD7C0WjxWr1KxgRnU1ZRJEYVdNUFx6UnI17TvBl1zE41mC1mh/4IlCmxd4g9mXb\nfovpgPy6JZSLt/yAMdOB/JN8VnT0s2W+KPcTZgtn1D77oR2IdOJwl8Zyqdz6M0aj\nSjT5zQFj21iKBOq2yTOvgys9J+s3oTN7tZwN4yuKfV62J+4yaqQx12b1C29cU2fX\natDksb2XjNXzQgwppCQ2r9oUngyqQBv7Hgl7xGWbfgPg66GJcXVfO7oVeIU8HDK4\nAhiyPdAPAgMBAAECggEAHxGIKoaeTgOZTrmXDfZS3gbmb+vZfZyN7PQHX4Vq5UvK\n2V4RGnOKCt9EWCRJsO2N0SxDb9x3pZBkNX4C2Bf/ci5d/1dQdAmY2JeVp7saVpJz\nI6i2I+uEWZNNgNKgY129gNHEKM8noN1zFOwpW0ede0czetWuXIV4d+ETjJQshIp+\nMHPb/DWV6Kbdox49UZ2zfx0u682U/O4CEuDLFXGKdmWKn4S8DZx4r7w+O1ephiOU\n6bgnIQhmqsIvRuDGCCL3PHyx4lXFjsS7HhFwsAmq+6ZDWqqEXZ3QruqHsx31a2Bt\nmdKfcd6IrxQFnCcZA7Rg+OL6X5+X9nQ3yRdK4df98QKBgQDkupexw3Y6r1pY09Pf\nc6gH3+qvGfeetj9+b0Wn/UzDCyJZl6aNh/dH8i0W6caHd4uEnbAg1WLS7Q28BmaG\nk+/ejiP/6cycRmPaSwXVsRY3sgnmDa9ObBMDbDvBl8ZoIuLAU4JcLCACdvxwodoH\nouAVCh5CXoo6vZ3wFpmkoeo7pwKBgQDP8q1cw43vXPUvb37uJbxP+c19i7/ABGPu\nre+HHhPnK1Wfc1RmPQirVPFmQhi+ahJLcOIGUu6oenhNGEQa3GISb5YxsIAqFptA\nBZ5nxEovCZLAaHATEhoOY7xJUWC0l6xifkeHXQEi15bXAlEW1V2qTodf94t3IjHG\nU2hoQ461WQKBgAJAR9/rAY3gTe5T32DynXO+Y2vnwIUiXAudgrz9hDTjNipVkMER\n1oAxxPnVwStyJMBgYOxhzUAwLxNrqLSoXhL9qSMKpQXgt3jdhigtPv+7U9ecyN3n\nuGQvO4NTQBOkTEECUWUg1gvQKfndzeyHUNdEKzoR/iBH33cOceKp6Uk/AoGAINS0\nsD+jqhXoE/wrcxf8GjhbTCYDOSK4UFefyJpkFAxQcWM5AQdD1iEMF9P5qh5/EvAY\nj10Klwj2810Qa5k91qFNejzej0aQblQ0xTdFaxW82Knkf+5MtNbkREMX3ItRyR8c\n1e9GHaUiCIIyIUPAjQHm96zSlRWN/Dzw7/0yi8kCgYAvKkasII97aUhFZX8VmtGe\nQZ/6xBDCp7FOtXjjXgua8fanm07nzgvkUoypbFkSwKfynG4u4KXBue2KtdER3Q4W\n0evU0mZpbq+E4yAGzQ4RDxFPqJ/romr9OyA+3+4vXjUH8IYnvVTRSd+cU0a2P3oo\ngFd/bfa17UQIpYOMq9/5EA==\n-----END PRIVATE KEY-----\n"
          },
          {
            "path": "adapters/fixtures/fixture-public.pem",
            "content": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAucuz8R1h9l+egPeP3M49\nWdwVXrsNL4nJ4yBQcMywMj1YoXv7PygS1m1CQgeQjjJhkUbFZKe2OwH685ng+wtF\no8Vq9SsYEZ1NWUSRGFXTVBcelJyNe07wZdcxONZgtZof+CJQpsXeIPZl236L6YD8\nuiWUi7f8gDHTgfyTfFZ09LNlvij3E2YLZ9Q++6EdiHTicJfGcqnc+jNGo0o0+c0B\nY9tYigTqtskzr4MrPSfrN6Eze7WcDeMrin1etifuMmqkMddm9QtvXFNn12rQ5LG9\nl4zV80IMKaQkNq/aFJ4MqkAb+x4Je8Rlm34D4OuhiXF1Xzu6FXiFPBwyuAIYsj3Q\nDwIDAQAB\n-----END PUBLIC KEY-----\n"
          },
          {
            "path": "adapters/fixtures/README.md",
            "content": "# Khóa mẫu công khai cho kiểm thử\n\nCặp RSA này được tạo riêng cho khóa học, phát hành công khai cùng mã nguồn và không đại diện cho người dùng hay nhà cung cấp danh tính thật. Mọi người đều có thể ký token bằng fixture-private.pem; vì vậy ứng dụng công khai tuyệt đối không được tin fixture-public.pem.\n\nServer chỉ nhận public key cấu hình từ JWT_PUBLIC_KEY_PATH. Private key được dùng bởi tests và công cụ issue-fixture-token để tạo Alice/Bob cho listener loopback. Khi tích hợp nhà cung cấp danh tính, cấu hình public key, kid, issuer và audience do nhà cung cấp cấp qua kênh đáng tin cậy; không chép private key của nhà cung cấp vào ứng dụng xác minh.\n\nPolicy của bài: RS256 duy nhất, kid chính xác, sub không rỗng, iss/aud đúng cấu hình, exp chưa hết hạn, nbf đã tới. Phiên WebSocket bị đóng khi token hết hạn; client cần lấy token mới trước khi kết nối lại. Key rotation là cấu hình server có chủ đích; không tải URL hay chọn thuật toán theo header của token.\n"
          },
          {
            "path": "adapters/README.md",
            "content": "# Team Tasks: JWT, tonic, WebSocket và PostgreSQL\n\nMember này là phiên bản tích hợp của cùng sản phẩm quản lý công việc. HTTP và gRPC gọi chung Store; PostgreSQL giữ task và outbox trong một transaction; WebSocket đọc lại sự kiện đã commit. MemoryStore chỉ giúp test giao thức nhanh mà không cần Docker. Test PostgreSQL riêng xác minh database thật và luồng gRPC → outbox → WebSocket qua khởi động lại transport.\n\n## 1. Chạy test giao thức\n\nTừ thư mục Cargo.toml ngoài cùng:\n\n```sh\ncargo test --workspace --all-targets\n```\n\nCargo sinh protobuf từ adapters/proto/tasks.proto bằng build.rs. protoc-bin-vendored cung cấp compiler theo hệ điều hành, nên không cần cài protoc thủ công. Những test auth, rpc, http_jwt và websocket chạy bằng Rust thật. RPC mở listener HTTP/2 loopback cổng ngẫu nhiên; WebSocket cũng đi qua TCP thật. Ba test trong postgres.rs được ghi ignored vì cần database: ignored không có nghĩa là đã đạt.\n\n## 2. Database thử và test PostgreSQL\n\nCần Docker Engine/Compose đang hoạt động. Cấu hình dưới đây tạo dịch vụ riêng ở loopback 55432; user/password chỉ là fixture của lab.\n\n```sh\ndocker compose -f adapters/compose.yaml up -d --wait\nexport DATABASE_URL=postgres://learn:learn_fixture_only@127.0.0.1:55432/learn_tasks\ncargo test -p team-tasks-adapters --test postgres -- --ignored --test-threads=1\n```\n\nMỗi test tạo schema lr_<process>_<timestamp>, mở pool tối đa 8 kết nối và xóa schema sau khi thành công. Không chạy test này trên database sản phẩm. Nếu test panic, tên schema có thể còn lại để điều tra. File Compose không gắn thư mục dữ liệu máy chủ; dừng bằng docker compose -f adapters/compose.yaml down khi kết thúc thực hành.\n\nBa nhóm bằng chứng:\n- Hai update cùng expected_version: chính xác một thành công; update còn lại conflict; outbox chỉ thêm một event. Lỗi được tiêm sau UPDATE và INSERT event phải rollback cả hai. Xóa membership làm quyền đọc sự kiện bị từ chối.\n- Giữ transaction writer đầu chưa commit: writer thứ hai cùng workspace phải chờ; cursor không bỏ qua event của giao dịch đầu.\n- Tạo bằng gRPC, đọc bằng WebSocket, đóng transport, sửa bằng gRPC, mở WebSocket mới với cursor cũ: chỉ nhận thay đổi tiếp theo từ cùng PostgreSQL.\n\n## 3. Chạy server xác minh JWT\n\nCặp RSA trong fixtures được tạo riêng cho bài và công khai. Nó mô phỏng nhà cung cấp danh tính; không có giá trị xác thực ngoài lab. Server không nhận private key.\n\n```sh\nexport JWT_PUBLIC_KEY_PATH=adapters/fixtures/fixture-public.pem\nexport JWT_ISSUER=learn-rust-fixture\nexport JWT_AUDIENCE=team-tasks\nexport JWT_KEY_ID=learn-fixture-1\ncargo run -p team-tasks-adapters --bin server\n```\n\nGiữ DATABASE_URL ở terminal này. Server mở HTTP/WebSocket ở 127.0.0.1:3018 và gRPC ở 127.0.0.1:5018. Trong terminal khác, tạo token Alice có hạn hai phút:\n\n```sh\nexport ACCESS_TOKEN=\"$(cargo run -q -p team-tasks-adapters --bin issue-fixture-token -- alice)\"\ncurl -i -H \"Authorization: Bearer $ACCESS_TOKEN\" -H 'Content-Type: application/json' -d '{\"title\":\"Kiểm tra adapter thật\"}' http://127.0.0.1:3018/workspaces/1/tasks\ncargo run -p team-tasks-adapters --bin rpc-client\n```\n\nAlice thuộc workspace 1, Bob thuộc workspace 2. Tạo token bob rồi đọc workspace 1 phải bị từ chối. Gửi lại version cũ là 409 ở HTTP hoặc ABORTED ở gRPC; request không tạo event mới.\n\nKhi nối nhà cung cấp danh tính thật, lấy public key và kid qua cấu hình tin cậy, thay issuer/audience đúng dịch vụ, và giữ toàn bộ test âm. Verifier của bài chỉ chấp nhận RS256 với kid cấu hình; không chọn thuật toán theo dữ liệu client và không tải URL trong header JWT. Signature hợp lệ chưa đủ: iss, aud, exp, nbf, sub vẫn phải đạt policy. Mỗi request lấy actor từ sub đã xác minh, rồi kiểm tra membership trong database. Token không chứa quyền workspace mà server tin vô điều kiện. Key rotation/JWKS cache của một nhà cung cấp cụ thể là phần tích hợp tiếp theo; phải có allowlist issuer, timeout, TTL, refresh có giới hạn và fixture khóa cũ/mới. Không đưa fixture key của bài vào môi trường công khai.\n\n## 4. Hiểu gRPC trước khi sửa proto\n\ntasks.proto định nghĩa package learn.tasks.v1 và ba RPC unary. Mỗi request có một response; server sinh trait, client sinh stub. Số field là định danh trên wire: không tái sử dụng số đã xóa; khi bỏ field hãy reserved số/tên và kiểm tra client cũ. Giá trị mặc định proto3 không chứng minh input có nghĩa: workspace/expected_version/title vẫn cần domain validation.\n\nBearer token đi qua metadata authorization. UNAUTHENTICATED nghĩa token không hợp lệ; PERMISSION_DENIED nghĩa danh tính đã biết nhưng thiếu quyền; INVALID_ARGUMENT là input sai; NOT_FOUND là tài nguyên vắng; ABORTED biểu thị version conflict của hợp đồng này. Không đổi mọi lỗi thành INTERNAL vì client cần biết có thể sửa request hay phải tải version mới.\n\nClient đặt timeout một giây. Server giới hạn thời gian operation hai giây, kích thước message 64 KiB, số stream và concurrency. Test deadline dùng store chậm để chứng minh không mutation trước điểm chờ. Trong database từ xa, timeout không khẳng định transaction chưa commit: nếu response mất sau commit, client phải đọc lại version hoặc dùng idempotency key cho command cần retry. Không tự retry CreateTask vô hạn vì có thể tạo hai task.\n\n## 5. WebSocket có kết nối lại\n\nMở adapters/web/stream.html bằng trình duyệt. Nhập token Alice mới, workspace 1 và cursor 0. Bấm Kết nối, rồi dùng HTTP hoặc rpc-client tạo/sửa task. Trang nhận JSON chứa event id, workspace_id, task_id, version và kind. Nút Ngắt giữ cursor đã áp dụng trên trang; kết nối lại chỉ yêu cầu các event lớn hơn cursor đó. Làm mới trang đưa trạng thái demo về rỗng.\n\nBrowser WebSocket không cho đặt Authorization tùy ý như fetch, nên frame đầu tiên là {\"token\":\"...\"}. Token không ở URL. Server yêu cầu frame này trong ba giây, giới hạn frame/message 4 KiB, kiểm tra chữ ký/claims trước khi đọc event. Token hết hạn hoặc mất membership đóng phiên bằng code 1008. Khi đó client cần cập nhật danh tính; không dùng reconnect vô hạn để né policy.\n\nServer polling outbox đã commit, mỗi batch tối đa 32 event. Gửi được một frame chưa có nghĩa consumer đã lưu hiệu ứng. Cursor reconnect phải là event cuối đã áp dụng thành công, không phải event cuối socket thấy. Test mô phỏng cursor bị mất sau khi áp dụng: event được phát lại nhưng tập event ID của consumer loại trùng. Trong sản phẩm, ghi event ID và tác dụng phụ trong cùng transaction; tập BTreeSet trên RAM của test chỉ là minh họa hợp đồng, không bền qua crash máy.\n\nKhông có hàng đợi fan-out vô hạn: query có limit và mỗi send có deadline 400 ms. Client quá chậm bị ngắt và phục hồi từ cursor của mình. Trang mẫu retry tối đa năm lần với backoff có trần; code 1008 dừng để người dùng lấy token mới. Khi dọn outbox cũ, bổ sung retention floor và response resync_required: tuyệt đối không im lặng trả tập rỗng cho một cursor đã mất lịch sử.\n\n## 6. PostgreSQL: transaction và thứ tự commit\n\nSQL dùng bind $1/$2, CHECK/UNIQUE và RETURNING. Membership được khóa FOR SHARE trong transaction; việc thu hồi membership chờ write đang được cho phép hoàn tất. UPDATE lọc workspace, ID, expected_version. Event được INSERT trong cùng transaction; chỉ commit khi cả task và event thành công.\n\nSequence PostgreSQL không đồng nghĩa thứ tự commit. Nếu T1 lấy ID 10 rồi chờ, T2 lấy 11 và commit trước, một reader lấy cursor 11 sẽ bỏ sót T1 khi T1 commit sau. Bản lab khóa hàng workspaces FOR UPDATE trước khi cấp event ID và giữ tới commit, nên các write cùng workspace có cùng thứ tự cấp ID/commit. Đổi lại mỗi workspace có một writer hoạt động tại một thời điểm; hãy đo trước khi lựa chọn throughput. Event ID vẫn có khoảng trống do rollback hoặc workspace khác, nên không yêu cầu id kế tiếp phải bằng id trước cộng một.\n\nPool thực hành có nhiều connection. Khác với SQLite baseline, PostgreSQL dùng row locks và MVCC; không suy diễn concurrency từ test SQLite một connection. Khi tối ưu bỏ serialization này, phải thiết kế lại cursor theo log/commit order và giữ regression commit muộn.\n\n## 7. Bàn giao và phần học viên phải hoàn thiện\n\nNộp log test loopback và PostgreSQL tách riêng, Cargo.lock, proto và contract lỗi, ma trận quyền cho HTTP/gRPC/WebSocket, cùng bằng chứng crash/reconnect. Đo p95/error/pool-wait/backlog bằng workload ghi rõ; server dùng listener loopback để thực hành, hạ tầng triển khai cần TLS và admission limit theo kết quả đo.\n\nHoàn thiện consumer có dedup bền, retention/resync, migration từ schema cũ, metrics, shutdown trong tải và rollback release. Dừng server bằng Ctrl+C: listener ngừng nhận, drain có thời hạn, outbox bền cho reconnect. Test hiện tại chưa chứng minh TLS proxy, JWKS nhà cung cấp thật, SLO dưới tải hay hành vi PostgreSQL failover. Ghi các mục đó chưa nghiệm thu cho tới khi có bằng chứng, không thay bằng nhãn “đã sẵn sàng production”.\n"
          },
          {
            "path": "adapters/web/stream.html",
            "content": "<!doctype html>\n<html lang=\"vi\">\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>Team Tasks · Sự kiện</title>\n<style>\n:root { color-scheme:light dark; font:16px/1.5 system-ui,sans-serif; } body { max-width:720px;margin:32px auto;padding:0 16px; }\nlabel { display:block;margin:12px 0 4px; } input { width:100%;box-sizing:border-box;padding:8px; } button { padding:8px 14px;margin:12px 8px 8px 0;cursor:pointer; }\nli { padding:6px 0; } output { display:block;margin:8px 0; } code { overflow-wrap:anywhere; }\n</style>\n<h1>Sự kiện công việc</h1>\n<label for=\"token\">Token thực hành</label><input id=\"token\" type=\"password\" autocomplete=\"off\">\n<label for=\"workspace\">Workspace</label><input id=\"workspace\" type=\"number\" min=\"1\" value=\"1\">\n<label for=\"cursor\">Event cuối đã áp dụng</label><input id=\"cursor\" type=\"number\" min=\"0\" value=\"0\">\n<button id=\"connect\">Kết nối</button><button id=\"stop\">Ngắt</button>\n<output id=\"status\" aria-live=\"polite\">Chưa kết nối</output>\n<ol id=\"events\"></ol>\n<script>\nconst token=document.querySelector('#token'),workspace=document.querySelector('#workspace'),cursor=document.querySelector('#cursor');\nconst status=document.querySelector('#status'),list=document.querySelector('#events');\nlet socket=null,timer=null,stopped=true,attempt=0;\nconst applied=new Set();\nfunction openSocket() {\n  if (stopped) return;\n  const ws=new WebSocket('ws://127.0.0.1:3018/workspaces/'+Number(workspace.value)+'/stream?after='+Number(cursor.value));\n  socket=ws; status.textContent='Đang kết nối…';\n  ws.onopen=()=> { if (socket!==ws) return; ws.send(JSON.stringify({token:token.value}));status.textContent='Đã kết nối'; };\n  ws.onmessage=message=> {\n    if (socket!==ws) return;\n    try {\n      const item=JSON.parse(message.data);\n      if(item.type!=='event') return;\n      const e=item.event;\n      if(!Number.isSafeInteger(e.id)||e.id<1) throw Error('event id');\n      const key=e.workspace_id+':'+e.id;\n      if(!applied.has(key)) {\n        const row=document.createElement('li');\n        row.textContent='#'+e.id+' · task '+e.task_id+' · v'+e.version+' · '+e.kind;\n        list.append(row);applied.add(key);\n      }\n      cursor.value=Math.max(Number(cursor.value),e.id);\n      attempt=0;\n    } catch { status.textContent='Dữ liệu không đúng hợp đồng';stopped=true;ws.close(); }\n  };\n  ws.onclose=event=> {\n    if(socket!==ws) return;\n    if(stopped) { status.textContent='Đã ngắt';return; }\n    if(event.code===1008) { stopped=true;status.textContent='Token hết hạn hoặc không đủ quyền. Nhập token mới.';return; }\n    if(attempt>=5) { stopped=true;status.textContent='Chưa kết nối lại được. Kiểm tra server rồi thử lại.';return; }\n    const delay=Math.min(5000,250*2**attempt++)+Math.floor(Math.random()*100);\n    status.textContent='Đang chờ kết nối lại…';\n    timer=setTimeout(openSocket,delay);\n  };\n}\ndocument.querySelector('#connect').onclick=()=>{\n  clearTimeout(timer);stopped=true;if(socket)socket.close();\n  socket=null;stopped=false;attempt=0;openSocket();\n};\nfunction resetScope() {\n  stopped=true;clearTimeout(timer);if(socket)socket.close();socket=null;\n  cursor.value=0;applied.clear();list.replaceChildren();status.textContent='Đã đổi phạm vi, kết nối lại từ đầu';\n}\nworkspace.addEventListener('change',resetScope);\ntoken.addEventListener('change',resetScope);\ndocument.querySelector('#stop').onclick=()=>{stopped=true;clearTimeout(timer);if(socket)socket.close();};\nwindow.addEventListener('beforeunload',()=>{stopped=true;clearTimeout(timer);if(socket)socket.close();});\n</script>\n</html>\n"
          }
        ],
        "commands": [
          "cargo test --workspace --all-targets",
          "cargo run -p team-tasks",
          "docker compose -f adapters/compose.yaml up -d --wait",
          "DATABASE_URL=postgres://learn:learn_fixture_only@127.0.0.1:55432/learn_tasks cargo test -p team-tasks-adapters --test postgres -- --ignored --test-threads=1"
        ],
        "checks": [
          "JWT hợp lệ được nhận; issuer/audience/expiry/nbf/algorithm/kid/signature sai bị từ chối.",
          "HTTP/2 gRPC loopback xử lý create/update, version conflict, quyền và deadline.",
          "WebSocket khôi phục từ cursor đã áp dụng và consumer loại event phát lại.",
          "PostgreSQL nhiều connection chỉ nhận một update cùng version; lỗi rollback cả task/event.",
          "Cursor không bỏ sót event có transaction commit muộn trong cùng workspace.",
          "Tạo qua gRPC, khởi động lại transport rồi đọc tiếp WebSocket từ cùng PostgreSQL.",
          "Phân biệt log host/loopback với ba test PostgreSQL chạy riêng và nghiệm thu môi trường đích."
        ]
      }
    }
  ],
  "projects": [
    {
      "id": "backend-project-catalog",
      "title": "Catalog sản phẩm có API và lưu trữ",
      "description": "Xây API nội bộ quản lý sản phẩm, giá nguyên và phiên bản cập nhật; hoàn thiện hợp đồng rồi bổ sung tìm kiếm và migration.",
      "level": "guided",
      "estimatedHours": 10,
      "labLessonId": "backend-catalog-project",
      "requirements": [
        "Tạo/đọc/liệt kê/sửa giá qua Axum với dữ liệu SQLite bền.",
        "Cursor có thứ tự ổn định và limit hữu hạn.",
        "Lỗi input, missing và stale version có response rõ.",
        "Test không sử dụng database của server đang học."
      ],
      "milestones": [
        {
          "title": "Hợp đồng và data model",
          "tasks": [
            "Viết ví dụ request/response của bốn thao tác.",
            "Giải thích đơn vị giá, nghĩa version và giới hạn tên."
          ],
          "acceptance": "Mọi input không hợp lệ có test và không tạo dữ liệu."
        },
        {
          "title": "Tích hợp HTTP với database",
          "tasks": [
            "Chạy Router cùng SQLite thật.",
            "Thêm test phân trang và đọc lại sau ghi."
          ],
          "acceptance": "Test xác nhận cả status lẫn nội dung response."
        },
        {
          "title": "Cập nhật và tương thích",
          "tasks": [
            "Gửi hai PATCH cùng version.",
            "Thêm migration với fixture schema cũ."
          ],
          "acceptance": "Chỉ một thay đổi được nhận; dữ liệu cũ đọc được sau migration."
        },
        {
          "title": "Bàn giao",
          "tasks": [
            "Ghi lệnh chạy trên máy mới.",
            "Tắt/mở server và đối chiếu dữ liệu."
          ],
          "acceptance": "Người khác chạy được theo README và dữ liệu không mất khi restart."
        }
      ],
      "testCases": [
        {
          "name": "Tên trắng",
          "setup": "POST name chỉ có khoảng trắng.",
          "expected": "422 và số sản phẩm không tăng."
        },
        {
          "name": "Giá âm",
          "setup": "POST price_cents=-1.",
          "expected": "422, không ghi hàng."
        },
        {
          "name": "Version cũ",
          "setup": "Hai PATCH lần lượt gửi version=1.",
          "expected": "Lần đầu 200, lần sau 409; giá giữ từ lần đầu."
        },
        {
          "name": "Cursor cuối",
          "setup": "GET sau ID lớn nhất.",
          "expected": "200 với danh sách rỗng, không lặp mục."
        }
      ],
      "rubric": [
        {
          "id": "backend-catalog-contract",
          "title": "Hợp đồng dữ liệu",
          "criteria": [
            "Giá dùng đơn vị nguyên và có giới hạn.",
            "PATCH chỉ sửa trường được phép."
          ],
          "critical": true
        },
        {
          "id": "backend-catalog-atomic",
          "title": "Cập nhật cạnh tranh",
          "criteria": [
            "WHERE chứa expected version.",
            "Response gắn với row được cập nhật."
          ],
          "critical": true
        },
        {
          "id": "backend-catalog-tests",
          "title": "Bộ test hành vi",
          "criteria": [
            "Test có dữ liệu lỗi, Unicode và cursor.",
            "Kiểm tra dữ liệu cuối, không chỉ status."
          ],
          "critical": true
        },
        {
          "id": "backend-catalog-handover",
          "title": "Khả năng bàn giao",
          "criteria": [
            "README có lệnh tái hiện.",
            "Fixture database riêng và migration có đường kiểm tra."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Source và Cargo.lock sau khi resolve.",
        "Hợp đồng API kèm ví dụ lỗi.",
        "Test HTTP/database, fixture migration.",
        "README khởi động và kết quả thử restart."
      ]
    },
    {
      "id": "backend-project-orders",
      "title": "Sổ đơn hàng và tồn kho",
      "description": "Bảo vệ một đơn hàng qua replay, thiếu kho và crash; mở rộng từ một SKU sang đơn nhiều dòng.",
      "level": "independent",
      "estimatedHours": 16,
      "labLessonId": "backend-order-project",
      "requirements": [
        "Stock, order và outbox cùng transaction.",
        "Idempotency key có scope và fingerprint nghiệp vụ.",
        "Từ chối payload khác với cùng key.",
        "Mở rộng nhiều dòng sản phẩm với xử lý SKU trùng."
      ],
      "milestones": [
        {
          "title": "Bất biến và transaction",
          "tasks": [
            "Vẽ trạng thái ba bảng trước/sau.",
            "Chỉ ra điểm commit và constraint cần có."
          ],
          "acceptance": "Không thể có order thiếu event hoặc stock bị trừ mà không có order."
        },
        {
          "title": "Retry và xung đột",
          "tasks": [
            "Gửi lại cùng key cùng command.",
            "Gửi cùng key command khác và key ở scope khác."
          ],
          "acceptance": "Replay không đổi dữ liệu; conflict không tạo đơn mới."
        },
        {
          "title": "Gây lỗi có kiểm soát",
          "tasks": [
            "Tiêm lỗi trước commit.",
            "Chạy hai người mua vượt tồn kho và mở rộng đơn nhiều dòng."
          ],
          "acceptance": "Rollback mọi bảng; không âm kho; SKU trùng được cộng trước kiểm tra."
        },
        {
          "title": "Đối chiếu database đích",
          "tasks": [
            "Lập test nhiều kết nối trên database dự kiến triển khai.",
            "Ghi khác biệt isolation/lock và giới hạn của test SQLite."
          ],
          "acceptance": "Báo cáo không đánh đồng host test một kết nối với toàn bộ behavior production."
        }
      ],
      "testCases": [
        {
          "name": "Replay",
          "setup": "Gửi hai lần customer7:key1 với SKU/số lượng giống nhau.",
          "expected": "Một order, một event và một lần trừ kho."
        },
        {
          "name": "Conflict",
          "setup": "Gửi lại key với số lượng khác.",
          "expected": "Lỗi conflict và stock không đổi."
        },
        {
          "name": "Fault trước commit",
          "setup": "Đã INSERT order/outbox rồi tiêm lỗi.",
          "expected": "Cả ba bảng về trạng thái trước transaction."
        },
        {
          "name": "Đơn nhiều dòng thiếu một SKU",
          "setup": "Một SKU đủ, SKU còn lại thiếu.",
          "expected": "Không trừ bất kỳ SKU nào."
        }
      ],
      "rubric": [
        {
          "id": "backend-orders-transaction",
          "title": "Nguyên tử",
          "criteria": [
            "Ba thay đổi cùng transaction.",
            "Failure injection có kiểm tra mọi bảng."
          ],
          "critical": true
        },
        {
          "id": "backend-orders-replay",
          "title": "Chống lặp",
          "criteria": [
            "Key có scope và fingerprint.",
            "Replay trả đúng kết quả cũ; conflict rõ."
          ],
          "critical": true
        },
        {
          "id": "backend-orders-stock",
          "title": "Bất biến tồn kho",
          "criteria": [
            "Không âm kho trong cạnh tranh.",
            "Gom SKU trùng và kiểm tra overflow."
          ],
          "critical": true
        },
        {
          "id": "backend-orders-evidence",
          "title": "Bằng chứng vận hành",
          "criteria": [
            "Có bảng trạng thái trước/sau cho lỗi.",
            "Ghi database, pool và isolation đã thử."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Source, migration và dữ liệu mẫu.",
        "Test replay/conflict/rollback/multi-line.",
        "Báo cáo cạnh tranh trên database đích.",
        "README chính sách giữ idempotency key và phục hồi."
      ]
    },
    {
      "id": "backend-project-team-service",
      "title": "Team Tasks: dịch vụ nhiều workspace",
      "description": "Tích hợp JWT, HTTP/gRPC, WebSocket khôi phục và PostgreSQL; hoàn thiện consumer bền, phát hành và bằng chứng vận hành.",
      "level": "capstone",
      "estimatedHours": 48,
      "labLessonId": "backend-service-project",
      "requirements": [
        "Mọi query task/event ràng buộc workspace và principal đã xác minh.",
        "Chạy adapter JWT RS256; kiểm tra issuer/audience/expiry/algorithm và cấu hình khóa theo môi trường.",
        "HTTP và tonic gRPC tuân cùng hợp đồng miền nghiệp vụ, status và deadline.",
        "WebSocket nối lại từ cursor đã áp dụng, batch hữu hạn và xử lý token hết hạn.",
        "PostgreSQL nhiều connection giữ version, outbox và thứ tự commit; rollback không để dữ liệu nửa vời.",
        "Hoàn thiện consumer chống lặp bền, migration, retention/resync, shutdown và báo cáo tải."
      ],
      "milestones": [
        {
          "title": "Danh tính và hợp đồng giao thức",
          "tasks": [
            "Chạy JWT fixture hợp lệ và các ca sai claims/algorithm/signature.",
            "Gọi HTTP và gRPC qua listener thật; ghi mapping lỗi."
          ],
          "acceptance": "Cùng principal có cùng quyền ở HTTP/gRPC/WebSocket; token sai không đọc được dữ liệu."
        },
        {
          "title": "PostgreSQL và cạnh tranh",
          "tasks": [
            "Chạy ba test PostgreSQL bằng nhiều connection.",
            "Giữ writer đầu chưa commit và giải thích cơ chế không bỏ sót cursor."
          ],
          "acceptance": "Một update cùng version thành công; fault rollback task/event; cursor phục hồi đúng sau restart transport."
        },
        {
          "title": "Sự kiện và phục hồi",
          "tasks": [
            "Dùng stream.html và test WebSocket để ngắt/reconnect/phát lại.",
            "Bổ sung consumer lưu dedup cùng tác dụng phụ, retention floor và resync."
          ],
          "acceptance": "Replay không tạo tác dụng phụ thứ hai; cursor cũ mất lịch sử nhận hướng phục hồi rõ."
        },
        {
          "title": "Vận hành và bàn giao",
          "tasks": [
            "Đo p95/error/backlog theo tải ghi lại.",
            "Thử shutdown và migration dữ liệu cũ; viết runbook."
          ],
          "acceptance": "Một người khác tái hiện được kiểm thử, phát hành và khôi phục theo tài liệu."
        }
      ],
      "testCases": [
        {
          "name": "Truy cập chéo",
          "setup": "Bob gọi mọi route workspace1 của Alice.",
          "expected": "Không đọc hoặc sửa task/event của Alice."
        },
        {
          "name": "Stale update",
          "setup": "PATCH cùng version hai lần.",
          "expected": "Một event ứng với thay đổi được chấp nhận."
        },
        {
          "name": "Sink chậm",
          "setup": "Giới hạn worker rồi làm sink chậm.",
          "expected": "Bộ nhớ/hàng đợi có giới hạn, backlog được quan sát."
        },
        {
          "name": "Crash sau gửi",
          "setup": "Worker chết khi consumer đã nhận nhưng chưa đánh dấu.",
          "expected": "Replay không tạo thông báo thứ hai."
        },
        {
          "name": "Shutdown có việc",
          "setup": "Dừng server/worker khi có công việc đang chạy.",
          "expected": "Kết thúc hoặc chuyển việc sang trạng thái có thể phục hồi trong thời hạn."
        },
        {
          "name": "JWT sai hợp đồng",
          "setup": "Đổi issuer/audience, hết hạn, nbf tương lai, RS384/kid lạ hoặc chữ ký bị sửa.",
          "expected": "Token bị từ chối trước khi tạo principal và đọc dữ liệu."
        },
        {
          "name": "gRPC loopback",
          "setup": "Client generated gửi CreateTask/SetDone với bearer metadata và version cũ.",
          "expected": "Response đúng hợp đồng; stale trả ABORTED, thiếu quyền PERMISSION_DENIED; không tạo event giả."
        },
        {
          "name": "Commit muộn",
          "setup": "Giữ khóa workspace của writer đầu, bắt đầu writer thứ hai trên connection khác.",
          "expected": "Writer hai chờ; ID/cursor không bỏ sót event của giao dịch đầu."
        },
        {
          "name": "WebSocket qua restart",
          "setup": "Đọc event, ngắt transport, tạo thay đổi qua gRPC, mở socket với cursor đã áp dụng.",
          "expected": "Đọc tiếp từ PostgreSQL; phát lại cursor cũ được consumer loại trùng."
        }
      ],
      "rubric": [
        {
          "id": "backend-team-auth",
          "title": "Danh tính và cách ly",
          "criteria": [
            "Chữ ký và issuer/audience/expiry/nbf/algorithm/kid có test âm.",
            "Cấu hình public key tin cậy; không dùng key fixture khi công khai.",
            "Ma trận quyền giữ đúng ở cả ba giao thức."
          ],
          "critical": true
        },
        {
          "id": "backend-team-consistency",
          "title": "Tính nhất quán dữ liệu",
          "criteria": [
            "Version và outbox nguyên tử trên PostgreSQL nhiều connection.",
            "Có test rollback và commit-order cursor; không chỉ suy ra từ SQLite."
          ],
          "critical": true
        },
        {
          "id": "backend-team-recovery",
          "title": "Phục hồi công việc nền",
          "criteria": [
            "Consumer chống lặp có test crash.",
            "Retry và queue có giới hạn."
          ],
          "critical": true
        },
        {
          "id": "backend-team-observe",
          "title": "Quan sát và tải",
          "criteria": [
            "Có số đo p95/error/backlog và cấu hình tải.",
            "Phân biệt pool wait với thời gian query."
          ],
          "critical": false
        },
        {
          "id": "backend-team-release",
          "title": "Phát hành có kiểm chứng",
          "criteria": [
            "Migration/restore/shutdown được thử.",
            "Runbook nêu giới hạn còn lại."
          ],
          "critical": true
        },
        {
          "id": "backend-team-protocols",
          "title": "Giao thức và kết nối lại",
          "criteria": [
            "Tonic loopback có status/deadline và client generated.",
            "WebSocket dùng applied cursor, token expiry, backoff và dedup có bằng chứng."
          ],
          "critical": true
        }
      ],
      "deliverables": [
        "Repository chạy được cùng lockfile và migration.",
        "Bộ test quyền, concurrency, crash và adapter danh tính.",
        "Báo cáo tải và ảnh/số liệu quan sát.",
        "Runbook triển khai/khôi phục, quyết định kiến trúc và giới hạn.",
        "Proto/build script, JWT policy/key config và log gRPC/WebSocket loopback.",
        "Log ba test PostgreSQL, regression commit-order và sơ đồ transaction."
      ]
    }
  ],
  "assessment": {
    "title": "Đánh giá năng lực xây dựng dịch vụ Backend",
    "instructions": "Làm bài tình huống trước khi xem giải thích. Sau đó hoàn thiện ba dự án và đối chiếu rubric bằng mã, kết quả test, số đo cùng runbook. Điểm lý thuyết không thay thế nghiệm thu thực hành.",
    "passPercent": 80,
    "questions": [
      {
        "id": "backend-exam-01",
        "question": "Chuyển một handler sang worker. Phần nào nên giữ nguyên để bảo vệ quy tắc chuyển trạng thái?",
        "options": [
          "Chuỗi SQL ghép ngay trong controller.",
          "HeaderMap của Axum.",
          "Hàm miền nhận command và trả Result."
        ],
        "correct": 2,
        "explanation": "Quy tắc nghiệp vụ nên độc lập adapter. Worker và HTTP cùng gọi hàm miền, còn quyền và transaction vẫn được bảo vệ ở ranh giới tương ứng.",
        "lessonIds": [
          "backend-domain-boundaries"
        ]
      },
      {
        "id": "backend-exam-02",
        "question": "REQUEST_TIMEOUT_MS tồn tại nhưng là 'abc'. Server nên xử lý thế nào?",
        "options": [
          "Dừng startup với lỗi trường cấu hình đã được che dữ liệu nhạy cảm.",
          "Dùng default và bỏ qua.",
          "Mở listener rồi ghi log cho mỗi request."
        ],
        "correct": 0,
        "explanation": "Default áp dụng khi cấu hình được phép vắng. Giá trị sai được cung cấp cần hiện rõ trước khi nhận traffic.",
        "lessonIds": [
          "backend-config-errors"
        ]
      },
      {
        "id": "backend-exam-03",
        "question": "Một danh sách ORDER BY created_at có nhiều hàng cùng timestamp. Cursor phù hợp là gì?",
        "options": [
          "Cặp created_at/id cùng thứ tự so sánh trong truy vấn.",
          "Offset lớn hơn sau mỗi trang luôn tránh thay đổi.",
          "Chỉ timestamp và dùng >=."
        ],
        "correct": 0,
        "explanation": "Cursor phải xác định vị trí duy nhất; query vẫn cần điều kiện scope. Nó không tự tạo snapshot bất biến nếu khóa sắp xếp bị sửa.",
        "lessonIds": [
          "backend-api-contracts"
        ]
      },
      {
        "id": "backend-exam-04",
        "question": "Hai người đọc version1 rồi cập nhật giá. Cách bảo vệ đúng là gì?",
        "options": [
          "SELECT version rồi UPDATE chỉ theo id.",
          "UPDATE có điều kiện id và version, kiểm tra rows/RETURNING.",
          "Cho client tự tăng version tùy ý."
        ],
        "correct": 1,
        "explanation": "Điều kiện của lần ghi cần được database đánh giá nguyên tử. Version cũ không được đổi giá hoặc tạo response thành công.",
        "lessonIds": [
          "backend-catalog-project"
        ]
      },
      {
        "id": "backend-exam-05",
        "question": "p95 cao, CPU thấp. Đo nào giúp phân biệt chờ pool với query chậm?",
        "options": [
          "Chỉ CPU toàn máy.",
          "Khoảng thời gian lấy kết nối riêng với thời gian thực thi query.",
          "Số dòng source SQL."
        ],
        "correct": 1,
        "explanation": "Thời gian chờ tài nguyên và thời gian thực thi là các nút thắt khác nhau; tăng index không chữa được mọi vấn đề pool.",
        "lessonIds": [
          "backend-query-plans",
          "backend-observability"
        ]
      },
      {
        "id": "backend-exam-06",
        "question": "Trong rolling deployment, xóa cột code cũ vẫn đọc có hậu quả gì?",
        "options": [
          "Không ảnh hưởng vì image mới đã build.",
          "Instance cũ có thể lỗi; cần kế hoạch tương thích và thu hẹp sau.",
          "Chỉ ảnh hưởng cache trình duyệt."
        ],
        "correct": 1,
        "explanation": "Hai phiên bản có thể cùng chạy trên một schema. Expand/migrate/contract và kiểm thử dữ liệu cũ giúp quản lý thời điểm mất tương thích.",
        "lessonIds": [
          "backend-migrations"
        ]
      },
      {
        "id": "backend-exam-07",
        "question": "Cùng idempotency key nhưng số lượng mua khác nên trả gì?",
        "options": [
          "Kết quả cũ như thể số lượng mới đã được chấp nhận.",
          "Tạo đơn mới.",
          "Xung đột payload và không đổi dữ liệu."
        ],
        "correct": 2,
        "explanation": "Key nhận diện một ý định đã được chuẩn hóa. Dữ liệu khác với cùng key không phải replay hợp lệ.",
        "lessonIds": [
          "backend-idempotency"
        ]
      },
      {
        "id": "backend-exam-08",
        "question": "Test lỗi trước commit cần kiểm tra gì?",
        "options": [
          "Chỉ tiến trình chưa crash.",
          "Chỉ message lỗi trả về.",
          "Stock, orders và outbox đều không giữ thay đổi dở dang."
        ],
        "correct": 2,
        "explanation": "Bảo đảm transaction là về trạng thái dữ liệu. Một response lỗi không chứng minh rollback đúng nếu không đọc lại mọi thay đổi liên quan.",
        "lessonIds": [
          "backend-order-project"
        ]
      },
      {
        "id": "backend-exam-09",
        "question": "Consumer đã áp dụng event nhưng worker mất ACK. Điều gì giúp retry đúng?",
        "options": [
          "Event ID ổn định, ghi dedup cùng tác dụng phụ consumer.",
          "Event ID mới cho mỗi lần gửi.",
          "Đánh dấu delivered trước khi gửi."
        ],
        "correct": 0,
        "explanation": "Giao lại có thể xảy ra. Đánh dấu trước gửi có nguy cơ mất event; consumer phải chịu được phát lại cùng ID.",
        "lessonIds": [
          "backend-outbox"
        ]
      },
      {
        "id": "backend-exam-10",
        "question": "Một request còn 40ms nhưng retry gồm chờ50ms rồi xử lý20ms. Nên làm gì?",
        "options": [
          "Vẫn retry vì cấu hình cho ba lần.",
          "Bỏ deadline khi có lỗi tạm thời.",
          "Không bắt đầu lần thử không còn ngân sách."
        ],
        "correct": 2,
        "explanation": "Giới hạn số lần là chưa đủ. Ngân sách toàn request cần bao gồm backoff, xử lý và phần thời gian trả kết quả.",
        "lessonIds": [
          "backend-retries-deadlines"
        ]
      },
      {
        "id": "backend-exam-11",
        "question": "Có thể lấy trung bình p95 của hai replica để báo p95 toàn hệ thống không?",
        "options": [
          "Không, phải tổng hợp phân bố/histogram thích hợp.",
          "Có nếu replica cùng CPU.",
          "Có nếu request dùng JSON."
        ],
        "correct": 0,
        "explanation": "Percentile không phải đại lượng cộng/trung bình tuyến tính; số mẫu và cách tổng hợp ảnh hưởng kết luận.",
        "lessonIds": [
          "backend-observability"
        ]
      },
      {
        "id": "backend-exam-12",
        "question": "Đã chạy hết bài và được 90% trắc nghiệm. Bằng chứng còn thiếu để nghiệm thu capstone là gì?",
        "options": [
          "Chỉ một ảnh trang chủ.",
          "Test quyền/cạnh tranh/phục hồi, sản phẩm chạy được và giải thích thiết kế.",
          "Không cần thêm vì điểm trắc nghiệm đã đủ."
        ],
        "correct": 1,
        "explanation": "Trắc nghiệm chỉ đo một phần kiến thức. Năng lực triển khai cần sản phẩm và bằng chứng hành vi trong các tình huống lỗi thực tế.",
        "lessonIds": [
          "backend-service-project"
        ]
      }
    ],
    "skills": [
      {
        "id": "backend-skill-1",
        "title": "Thiết kế dịch vụ và runtime",
        "description": "Viết command và bất biến nghiệp vụ độc lập HTTP. Khởi tạo tài nguyên có kiểm tra và giới hạn tải.",
        "lessonIds": [
          "backend-domain-boundaries",
          "backend-config-errors",
          "backend-runtime"
        ],
        "projectIds": [
          "backend-project-catalog"
        ],
        "required": true
      },
      {
        "id": "backend-skill-2",
        "title": "Hợp đồng HTTP và API đầu tiên",
        "description": "Xây Router có validation, lỗi và phân trang rõ ràng. Kiểm thử HTTP cùng database và cập nhật có version.",
        "lessonIds": [
          "backend-http",
          "backend-api-contracts",
          "backend-catalog-project"
        ],
        "projectIds": [
          "backend-project-catalog"
        ],
        "required": true
      },
      {
        "id": "backend-skill-3",
        "title": "Dữ liệu và thay đổi schema",
        "description": "Đặt constraint và transaction đúng chỗ. Đo truy vấn và đưa schema mới vào dịch vụ đang chạy.",
        "lessonIds": [
          "backend-transactions",
          "backend-query-plans",
          "backend-migrations"
        ],
        "projectIds": [
          "backend-project-orders",
          "backend-project-team-service"
        ],
        "required": true
      },
      {
        "id": "backend-skill-4",
        "title": "Danh tính và thao tác được gửi lại",
        "description": "Xác minh JWT và kiểm tra membership ở HTTP/gRPC/WebSocket. Chứng minh replay, conflict và rollback bằng trạng thái database.",
        "lessonIds": [
          "backend-authorization",
          "backend-idempotency",
          "backend-order-project",
          "backend-service-project"
        ],
        "projectIds": [
          "backend-project-orders",
          "backend-project-team-service"
        ],
        "required": true
      },
      {
        "id": "backend-skill-5",
        "title": "Giao tiếp và công việc nền",
        "description": "Thiết kế tonic RPC với status/deadline; WebSocket nối lại bằng applied cursor. Phục hồi sự kiện, dedup, giới hạn batch/queue và client chậm.",
        "lessonIds": [
          "backend-streaming",
          "backend-outbox",
          "backend-retries-deadlines",
          "backend-service-project"
        ],
        "projectIds": [
          "backend-project-team-service"
        ],
        "required": true
      },
      {
        "id": "backend-skill-6",
        "title": "Nghiệm thu và vận hành",
        "description": "Điều tra bằng trace/metric và giả thuyết có thể kiểm chứng. Bàn giao dự án có kiểm thử quyền, cạnh tranh và phục hồi.",
        "lessonIds": [
          "backend-production",
          "backend-observability",
          "backend-service-project"
        ],
        "projectIds": [
          "backend-project-team-service"
        ],
        "required": true
      }
    ]
  }
};
