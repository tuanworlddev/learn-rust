import type { TrackExpansion } from "../../specialization-types";

export const embeddedExpansion: TrackExpansion = {
  "chapters": [
    {
      "id": "embedded-architecture",
      "title": "Nền tảng và hợp đồng phần cứng",
      "description": "Thiết kế giới hạn trước khi nạp firmware.",
      "lessonIds": [
        "embedded-no-std",
        "embedded-budget-units",
        "embedded-board-contract"
      ],
      "outcomes": [
        "Phân biệt core, firmware và adapter bo.",
        "Lập ngân sách RAM và cấu hình có đơn vị."
      ]
    },
    {
      "id": "embedded-signals",
      "title": "Tín hiệu, ngắt và quyền sở hữu",
      "description": "Xử lý tín hiệu mà không chặn hệ thống.",
      "lessonIds": [
        "embedded-gpio",
        "embedded-debounce",
        "embedded-interrupt-dma"
      ],
      "outcomes": [
        "Lọc nút bằng state machine.",
        "Giải thích thời điểm CPU được đọc buffer DMA."
      ]
    },
    {
      "id": "embedded-drivers",
      "title": "Driver và chất lượng phép đo",
      "description": "Kiểm thử hợp đồng bus và dữ liệu cảm biến.",
      "lessonIds": [
        "embedded-sensors",
        "embedded-driver-project",
        "embedded-calibration"
      ],
      "outcomes": [
        "Viết driver embedded-hal với fake bus.",
        "Phân biệt lỗi bus, miền giá trị và mẫu quá cũ."
      ]
    },
    {
      "id": "embedded-scheduling",
      "title": "Lập lịch và telemetry",
      "description": "Giữ tài nguyên hữu hạn khi đầu ra chậm.",
      "lessonIds": [
        "embedded-async",
        "embedded-scheduling",
        "embedded-telemetry-project"
      ],
      "outcomes": [
        "Chọn chính sách deadline và queue đầy.",
        "Đóng khung, kiểm tra CRC và xử lý ACK."
      ]
    },
    {
      "id": "embedded-persistence",
      "title": "Bộ nhớ, cấu hình và năng lượng",
      "description": "Sống qua lỗi nguồn và đo chi phí vận hành.",
      "lessonIds": [
        "embedded-memory",
        "embedded-config-journal",
        "embedded-power-budget"
      ],
      "outcomes": [
        "Khôi phục slot cấu hình đã commit.",
        "Đối chiếu ngân sách năng lượng với phép đo."
      ]
    },
    {
      "id": "embedded-delivery",
      "title": "Độ tin cậy và dự án tổng hợp",
      "description": "Kiểm chứng điều kiện chạy và phục hồi firmware.",
      "lessonIds": [
        "embedded-reliability",
        "embedded-firmware-update",
        "embedded-station-project"
      ],
      "outcomes": [
        "Thiết kế boot thử và health có ý nghĩa.",
        "Bàn giao báo cáo host, target và hardware test."
      ]
    }
  ],
  "lessons": [
    {
      "id": "embedded-budget-units",
      "moduleId": "track-embedded",
      "title": "Ngân sách RAM, thời gian và đơn vị đo",
      "description": "Tính giới hạn dữ liệu từ chu kỳ lấy mẫu và thời gian đầu ra bị nghẽn.",
      "duration": 45,
      "objectives": [
        "Tính giới hạn dữ liệu từ chu kỳ lấy mẫu và thời gian đầu ra bị nghẽn.",
        "Làm tròn lên số mẫu theo mili giây, cộng hai vị trí dự phòng.",
        "Trả None khi tràn số hoặc vượt 256 mẫu."
      ],
      "sections": [
        {
          "title": "Bắt đầu từ con số có đơn vị",
          "text": "Một trạm đo không cần giữ mọi mẫu trong RAM. Nếu lấy 20 mẫu mỗi giây và đầu ra có thể dừng ba giây, chỉ riêng thời gian chờ đã cần 60 vị trí. Cần cộng thêm mẫu đang xử lý và khoảng dự phòng được giải thích rõ. Dung lượng này khác số byte: mỗi mẫu còn chứa timestamp, trạng thái và padding. Hãy viết bảng gồm tần suất, kích thước mẫu, thời gian nghẽn tối đa, dung lượng queue và chính sách khi đầy. Một giới hạn không có đơn vị rất dễ bị dùng sai khi đổi chu kỳ."
        },
        {
          "title": "Tính trên miền đủ rộng",
          "text": "Phép nhân hai u16 được thực hiện trong u16 nếu chưa chuyển kiểu. Chuyển kết quả đã tràn sang u32 không thể khôi phục dữ liệu. Với phép tính ngân sách từ cấu hình, dùng checked_mul và checked_add, sau đó kiểm tra trần sản phẩm trước khi chuyển sang usize. Đổi mili giây thành số mẫu phải làm tròn lên: thiếu một phần chu kỳ vẫn có thể tạo thêm một mẫu. Tách hàm tính khỏi driver để test các giá trị 0, sát giới hạn và số rất lớn ngay trên host."
        },
        {
          "title": "RAM còn nhiều thành phần khác",
          "text": "Queue chỉ là một phần RAM. Stack của tác vụ, buffer DMA, bảng trạng thái, executor và vùng dữ liệu tĩnh đều chiếm chỗ. size_of cho biết kích thước kiểu theo target đang biên dịch, không thay thế báo cáo linker của MCU. Đặt mức dự phòng stack có căn cứ và đo khi chạy đường xử lý dài nhất. Async không tự giảm mọi bộ nhớ: biến còn sống qua await có thể nằm trong trạng thái future. Một mảng lớn trong mỗi task có thể nhân tổng dung lượng lên dù không dùng heap.",
          "code": "fn capacity(rate_hz: u32, stall_ms: u32) -> Option<u32> {\n    let samples = rate_hz.checked_mul(stall_ms)?.checked_add(999)? / 1000;\n    let needed = samples.checked_add(2)?;\n    (needed <= 256).then_some(needed)\n}"
        },
        {
          "title": "Thực hành thiết kế giới hạn",
          "text": "Bài tập tính số vị trí cần dùng cho thời gian nghẽn, thêm hai vị trí đang bay và từ chối cấu hình vượt 256 mẫu. Trong dự án Cargo, đặt hàm vào thư viện no_std, tạo test cho chu kỳ không chia hết và phép nhân tràn. Sau đó ghi ngân sách RAM theo kích thước Sample thật, đối chiếu binary target và chọn hành vi khi không đủ chỗ. Không tự tăng queue đến khi hết lỗi: nếu đầu ra chậm vô hạn, mọi queue hữu hạn đều đầy. Khi đó cần bỏ mẫu có đếm, giảm tần suất hoặc lưu sang bộ nhớ phù hợp. Ghi lại số mẫu mất trong báo cáo."
        }
      ],
      "tip": "Queue hữu hạn chỉ hấp thụ một lượng chênh lệch hữu hạn giữa producer và consumer.",
      "exercise": {
        "title": "Ngân sách RAM, thời gian và đơn vị đo",
        "instructions": "Tính giới hạn dữ liệu từ chu kỳ lấy mẫu và thời gian đầu ra bị nghẽn.",
        "requirements": [
          "Làm tròn lên số mẫu theo mili giây, cộng hai vị trí dự phòng.",
          "Trả None khi tràn số hoặc vượt 256 mẫu."
        ]
      },
      "starterCode": "fn capacity(rate_hz: u32, stall_ms: u32) -> Option<u32> { todo!() }\nfn main() {\nassert_eq!(capacity(20, 3000), Some(62));\nassert_eq!(capacity(3, 1), Some(3));\nassert_eq!(capacity(300, 1000), None);\nassert_eq!(capacity(u32::MAX, 2), None);\nprintln!(\"Dung lượng: {} mẫu\", capacity(20, 3000).unwrap());\n}",
      "solutionCode": "fn capacity(rate_hz: u32, stall_ms: u32) -> Option<u32> {\n    let samples = rate_hz.checked_mul(stall_ms)?.checked_add(999)? / 1000;\n    let needed = samples.checked_add(2)?;\n    (needed <= 256).then_some(needed)\n}\nfn main() {\nassert_eq!(capacity(20, 3000), Some(62));\nassert_eq!(capacity(3, 1), Some(3));\nassert_eq!(capacity(300, 1000), None);\nassert_eq!(capacity(u32::MAX, 2), None);\nprintln!(\"Dung lượng: {} mẫu\", capacity(20, 3000).unwrap());\n}",
      "expectedOutput": "Dung lượng: 62 mẫu",
      "hints": [
        "Làm tròn lên số mẫu theo mili giây, cộng hai vị trí dự phòng.",
        "Queue hữu hạn chỉ hấp thụ một lượng chênh lệch hữu hạn giữa producer và consumer."
      ],
      "quiz": {
        "question": "Một queue 256 mẫu có bảo đảm không mất dữ liệu nếu đầu ra ngừng vô hạn không?",
        "options": ["Có, vì không dùng heap.", "Không; phải có chính sách khi đầy hoặc giới hạn thời gian nghẽn.", "Có, nếu tăng tốc CPU."],
        "correct": 1,
        "explanation": "Queue hữu hạn chỉ hấp thụ một lượng chênh lệch hữu hạn giữa producer và consumer."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/stable/embedded-book/design-patterns/hal/index.html"
      }
    },
    {
      "id": "embedded-board-contract",
      "moduleId": "track-embedded",
      "title": "Hợp đồng bo mạch và khởi động an toàn",
      "description": "Kiểm tra cấu hình chân, điện áp và thứ tự khởi tạo trước khi truy cập ngoại vi.",
      "duration": 45,
      "objectives": [
        "Kiểm tra cấu hình chân, điện áp và thứ tự khởi tạo trước khi truy cập ngoại vi.",
        "Phân biệt lỗi trùng chân, chân không hợp lệ và điện áp ngoài giới hạn.",
        "Chỉ chấp nhận danh sách chân của bo học tập được khai báo."
      ],
      "sections": [
        {
          "title": "Một mã chip chưa mô tả cả sản phẩm",
          "text": "Hai bo dùng cùng MCU có thể gắn LED khác chân, dùng bộ ổn áp khác và dành một số chân cho flash. Bảng phần cứng phải ghi phiên bản bo, điện áp logic, nguồn cảm biến, chân bus, pull-up và đường debug. Rust không biết dây đã cắm nhầm hoặc tín hiệu vượt điện áp cho phép. Một kiểu OutputPin hợp lệ chỉ chứng minh quyền dùng một API trong chương trình. Nó không chứng minh tín hiệu điện phù hợp với thiết bị bên ngoài. Tách rõ điều kiện biên dịch và điều kiện vật lý trong hồ sơ dự án."
        },
        {
          "title": "Khởi tạo theo trạng thái có thể kiểm tra",
          "text": "Một trình tự hữu ích là đặt đầu ra về mức an toàn, cấu hình clock, tạo bus, xác minh thiết bị rồi mới bật điều khiển. Không bật động cơ hoặc relay trước khi cảm biến và giới hạn được xác nhận. Với bus, tần số phải phù hợp cả MCU lẫn thiết bị; chân có pull-up nội bộ không mặc nhiên thay được điện trở của thiết kế. Ghi trạng thái Boot, SelfTest, Ready và Fault bằng enum. Mỗi chuyển trạng thái có điều kiện, nhờ vậy lỗi khởi tạo không bị che thành vòng lặp chính có dữ liệu giả."
        },
        {
          "title": "Kiểm tra cấu hình bằng dữ liệu thuần",
          "text": "Bài tập dùng một hồ sơ bo học tập, trong đó hai chân bus phải khác nhau, nằm trong danh sách cho phép và điện áp cảm biến không vượt mức đã quy định. Đây là chính sách của bo giả lập được nêu rõ, không phải pinout dùng được cho mọi ESP32 hoặc STM32. Hàm trả lỗi cụ thể giúp UI cấu hình báo đúng nguyên nhân. Trong firmware thật, chuyển hồ sơ đã xác minh thành kiểu HAL tương ứng; chỉ một nơi sở hữu peripheral để tránh hai driver cùng lập trình một khối phần cứng.",
          "code": "fn board(sda: u8, scl: u8, sensor_mv: u16) -> Result<(), &'static str> {\n    if sda == scl { return Err(\"trung-chan\"); }\n    if ![2, 3, 4, 5].contains(&sda) || ![2, 3, 4, 5].contains(&scl) { return Err(\"chan\"); }\n    if sensor_mv == 0 || sensor_mv > 3300 { return Err(\"dien-ap\"); }\n    Ok(())\n}"
        },
        {
          "title": "Từ host test đến bản build đích",
          "text": "Tạo Cargo library chứa kiểm tra cấu hình và state machine, chạy test khi thiếu nguồn, trùng chân hoặc thiết bị không phản hồi. Crate firmware riêng chọn target, memory.x nếu nền tảng cần, startup và panic handler theo bo. Trước khi nạp, kiểm tra kích thước flash/RAM và đường debug còn hoạt động. Sau khi nạp, đo mức chân khởi động và quan sát log SelfTest, kể cả trường hợp rút cảm biến. Biên bản phải chỉ rõ phép thử trên host, build cho target và phép đo trên thiết bị; không dùng một dấu xanh thay thế cả ba lớp này."
        }
      ],
      "tip": "Kiểu và test không đo được điện áp, dây nối hay phiên bản mạch.",
      "exercise": {
        "title": "Hợp đồng bo mạch và khởi động an toàn",
        "instructions": "Kiểm tra cấu hình chân, điện áp và thứ tự khởi tạo trước khi truy cập ngoại vi.",
        "requirements": [
          "Phân biệt lỗi trùng chân, chân không hợp lệ và điện áp ngoài giới hạn.",
          "Chỉ chấp nhận danh sách chân của bo học tập được khai báo."
        ]
      },
      "starterCode": "fn board(sda: u8, scl: u8, sensor_mv: u16) -> Result<(), &'static str> { todo!() }\nfn main() {\nassert_eq!(board(2, 3, 3300), Ok(()));\nassert_eq!(board(2, 2, 3300), Err(\"trung-chan\"));\nassert_eq!(board(9, 3, 3300), Err(\"chan\"));\nassert_eq!(board(2, 3, 5000), Err(\"dien-ap\"));\nprintln!(\"Cấu hình hợp lệ: {}\", board(2, 3, 3300).is_ok());\n}",
      "solutionCode": "fn board(sda: u8, scl: u8, sensor_mv: u16) -> Result<(), &'static str> {\n    if sda == scl { return Err(\"trung-chan\"); }\n    if ![2, 3, 4, 5].contains(&sda) || ![2, 3, 4, 5].contains(&scl) { return Err(\"chan\"); }\n    if sensor_mv == 0 || sensor_mv > 3300 { return Err(\"dien-ap\"); }\n    Ok(())\n}\nfn main() {\nassert_eq!(board(2, 3, 3300), Ok(()));\nassert_eq!(board(2, 2, 3300), Err(\"trung-chan\"));\nassert_eq!(board(9, 3, 3300), Err(\"chan\"));\nassert_eq!(board(2, 3, 5000), Err(\"dien-ap\"));\nprintln!(\"Cấu hình hợp lệ: {}\", board(2, 3, 3300).is_ok());\n}",
      "expectedOutput": "Cấu hình hợp lệ: true",
      "hints": [
        "Phân biệt lỗi trùng chân, chân không hợp lệ và điện áp ngoài giới hạn.",
        "Kiểu và test không đo được điện áp, dây nối hay phiên bản mạch."
      ],
      "quiz": {
        "question": "Host test xác nhận chân SDA và SCL khác nhau chứng minh điều gì?",
        "options": ["Chính sách cấu hình phần mềm được đáp ứng; vẫn cần kiểm tra bo thật.", "Nguồn cảm biến an toàn.", "Dây nối trên bo chắc chắn đúng."],
        "correct": 0,
        "explanation": "Kiểu và test không đo được điện áp, dây nối hay phiên bản mạch."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/stable/embedded-book/start/hardware.html"
      }
    },
    {
      "id": "embedded-debounce",
      "moduleId": "track-embedded",
      "title": "Nút bấm, nhiễu và state machine theo thời gian",
      "description": "Lọc dội nút không chặn tác vụ khác và xử lý bộ đếm thời gian quay vòng.",
      "duration": 45,
      "objectives": [
        "Lọc dội nút không chặn tác vụ khác và xử lý bộ đếm thời gian quay vòng.",
        "Phát một sự kiện sau 20 ms ổn định, không phát lại khi giữ nút.",
        "Tính khoảng thời gian theo modulo trong miền đã nêu."
      ],
      "sections": [
        {
          "title": "Một lần nhấn có thể tạo nhiều cạnh",
          "text": "Tiếp điểm cơ khí có thể thay đổi mức nhiều lần trước khi ổn định. Nếu mỗi cạnh đều tăng bộ đếm, người dùng nhấn một lần nhưng thiết bị nhận nhiều lệnh. Chờ một khoảng bằng vòng lặp bận có vẻ giải quyết được tình huống đơn giản nhưng làm chậm lấy mẫu và phản hồi lỗi. Mô hình tốt hơn ghi mức ứng viên và thời điểm nó bắt đầu ổn định. Chỉ công bố trạng thái khi cùng mức được giữ đủ lâu. Khoảng ổn định là tham số cần đo theo nút và điều kiện sản phẩm."
        },
        {
          "title": "Tách tín hiệu thô và trạng thái công bố",
          "text": "State machine cần stable, candidate và since. Khi raw đổi khác candidate, cập nhật ứng viên và bắt đầu đếm lại. Khi raw không đổi và thời gian đã đủ, đổi stable rồi phát đúng một sự kiện. Sau đó giữ mức không phát lại sự kiện. Một nút active-low chỉ đảo ý nghĩa mức điện ở adapter, còn lõi nhận pressed dạng bool. Cách tách này cho phép dùng cùng bộ lọc cho nút thật, chuỗi fixture và kiểm thử UI mà không trộn ngữ nghĩa điện với hành vi người dùng."
        },
        {
          "title": "Thời gian có giới hạn miền",
          "text": "Bộ đếm u32 mili giây cuối cùng sẽ quay vòng. Dùng now.wrapping_sub(since) để tính khoảng ngắn, cùng giả định khoảng quan sát nhỏ hơn nửa miền và không bỏ qua cả một vòng. Đừng so now >= since + delay bằng phép cộng có thể tràn. Với clock ảo, tạo ca since gần u32::MAX rồi đưa now sang vài đơn vị sau mốc 0. Thuật toán này không sửa đồng hồ chạy lùi tùy ý; hợp đồng phải nói clock đơn điệu theo modulo. Trong Embassy, dùng kiểu thời gian của thư viện thay vì tự ép tick khi không cần.",
          "code": "#[derive(Debug)] struct Button { stable: bool, candidate: bool, since: u32 }\nimpl Button {\n    fn update(&mut self, raw: bool, now: u32) -> Option<bool> {\n        if raw != self.candidate { self.candidate = raw; self.since = now; }\n        if self.stable != self.candidate && now.wrapping_sub(self.since) >= 20 {\n            self.stable = self.candidate; return Some(self.stable);\n        }\n        None\n    }\n}"
        },
        {
          "title": "Kiểm thử bằng chuỗi sự kiện",
          "text": "Bài tập giữ trạng thái ban đầu false, chấp nhận mức true sau 20 ms ổn định và không phát lại khi giữ nút. Trong Cargo, thêm bảng thời gian mô tả nhiễu liên tục, nhả nhanh, giữ dài và quay vòng. Hàm update không ngủ, không đọc GPIO nên test chạy tức thì. Firmware gọi update sau mỗi lần lấy mẫu hoặc khi có tín hiệu ngắt, nhưng phải bảo đảm có lần kiểm tra sau thời hạn ổn định. Đo độ trễ thực tế từ nhấn đến hành động; một bộ lọc đúng logic vẫn phản hồi chậm nếu task gọi nó bị bỏ đói."
        }
      ],
      "tip": "State machine lưu tiến độ thay vì chiếm CPU hoặc chặn executor trong lúc đợi.",
      "exercise": {
        "title": "Nút bấm, nhiễu và state machine theo thời gian",
        "instructions": "Lọc dội nút không chặn tác vụ khác và xử lý bộ đếm thời gian quay vòng.",
        "requirements": [
          "Phát một sự kiện sau 20 ms ổn định, không phát lại khi giữ nút.",
          "Tính khoảng thời gian theo modulo trong miền đã nêu."
        ]
      },
      "starterCode": "#[derive(Debug)] struct Button { stable: bool, candidate: bool, since: u32 }\nimpl Button { fn update(&mut self, raw: bool, now: u32) -> Option<bool> { todo!() } }\nfn main() {\nlet mut b = Button { stable: false, candidate: false, since: 0 };\nassert_eq!(b.update(true, u32::MAX - 9), None);\nassert_eq!(b.update(true, 5), None);\nassert_eq!(b.update(true, 10), Some(true));\nassert_eq!(b.update(true, 100), None);\nprintln!(\"Nút đã nhấn: {}\", b.stable);\n}",
      "solutionCode": "#[derive(Debug)] struct Button { stable: bool, candidate: bool, since: u32 }\nimpl Button {\n    fn update(&mut self, raw: bool, now: u32) -> Option<bool> {\n        if raw != self.candidate { self.candidate = raw; self.since = now; }\n        if self.stable != self.candidate && now.wrapping_sub(self.since) >= 20 {\n            self.stable = self.candidate; return Some(self.stable);\n        }\n        None\n    }\n}\nfn main() {\nlet mut b = Button { stable: false, candidate: false, since: 0 };\nassert_eq!(b.update(true, u32::MAX - 9), None);\nassert_eq!(b.update(true, 5), None);\nassert_eq!(b.update(true, 10), Some(true));\nassert_eq!(b.update(true, 100), None);\nprintln!(\"Nút đã nhấn: {}\", b.stable);\n}",
      "expectedOutput": "Nút đã nhấn: true",
      "hints": [
        "Phát một sự kiện sau 20 ms ổn định, không phát lại khi giữ nút.",
        "State machine lưu tiến độ thay vì chiếm CPU hoặc chặn executor trong lúc đợi."
      ],
      "quiz": {
        "question": "Vì sao update không tự sleep để chờ hết 20 ms?",
        "options": ["Vì nút chỉ cần đọc một lần.", "Vì Rust không có timer.", "Để caller tiếp tục phục vụ tác vụ khác và test bằng clock ảo."],
        "correct": 2,
        "explanation": "State machine lưu tiến độ thay vì chiếm CPU hoặc chặn executor trong lúc đợi."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://docs.embassy.dev/embassy-time/0.4.0/default/struct.Ticker.html"
      }
    },
    {
      "id": "embedded-interrupt-dma",
      "moduleId": "track-embedded",
      "title": "Ngắt, DMA và quyền sở hữu buffer",
      "description": "Thiết kế đường dữ liệu từ ngoại vi đến task mà không tái sử dụng buffer quá sớm.",
      "duration": 45,
      "objectives": [
        "Thiết kế đường dữ liệu từ ngoại vi đến task mà không tái sử dụng buffer quá sớm.",
        "Chỉ cho phép bốn chuyển trạng thái của chu trình buffer.",
        "Mọi chuyển khác trả lỗi trước khi đọc hoặc cấp lại vùng nhớ."
      ],
      "sections": [
        {
          "title": "Ngắt chỉ báo một sự kiện cần xử lý",
          "text": "Interrupt handler nên làm phần việc có giới hạn: đọc hoặc xóa cờ đúng quy tắc ngoại vi, ghi nhận dữ liệu tối thiểu và đánh thức task. Parse bản tin dài, cấp phát hoặc chờ mutex trong handler dễ tăng độ trễ của ngắt khác. Không phải mọi cờ đều xóa bằng ghi 0; có thiết bị xóa khi đọc hoặc ghi 1. PAC/HAL giúp biểu diễn thanh ghi nhưng không thay thế quy tắc của peripheral. Với nhiều mức ưu tiên, cần biết dữ liệu nào được truy cập từ ngữ cảnh nào và ở thời điểm nào."
        },
        {
          "title": "DMA tạo một chủ thể truy cập khác",
          "text": "Khi DMA đang ghi vào RAM, CPU không được tùy ý đọc hoặc sửa cùng buffer như dữ liệu đã hoàn thành. Hãy mô hình hóa Free, Filling, Ready và Reading. Bắt đầu DMA chuyển quyền sử dụng từ Free sang Filling; ngắt hoàn tất tạo Ready; consumer lấy dữ liệu thành Reading và trả lại Free khi xong. Một cờ bool done thường không diễn đạt đủ việc buffer đã được tái cấp phát hay còn consumer giữ tham chiếu. Hai buffer có thể tăng thông lượng nhưng vẫn cần quy tắc chuyển quyền riêng cho từng buffer."
        },
        {
          "title": "Volatile không giải quyết toàn bộ đồng thời",
          "text": "Volatile bảo đảm truy cập không bị tối ưu mất theo quy tắc của nó, không tự tạo khóa hoặc thứ tự đồng bộ giữa các tác nhân. Atomic, critical section và cache maintenance xử lý các vấn đề khác nhau. Trên MCU có data cache, dữ liệu DMA có thể cần invalidate hoặc clean theo hướng truyền và vùng nhớ; yêu cầu này phụ thuộc chip. Một critical section tắt ngắt trên một core cũng không tự khóa core khác. Dùng abstraction của HAL đã giải quyết target cụ thể thay vì ghép raw pointer từ ví dụ không cùng kiến trúc.",
          "code": "#[derive(Clone, Copy, Debug, PartialEq)] enum Buffer { Free, Filling, Ready, Reading }\nfn advance(current: Buffer, next: Buffer) -> Result<Buffer, &'static str> {\n    match (current, next) {\n        (Buffer::Free, Buffer::Filling) | (Buffer::Filling, Buffer::Ready) |\n        (Buffer::Ready, Buffer::Reading) | (Buffer::Reading, Buffer::Free) => Ok(next),\n        _ => Err(\"chuyen-trai-phep\")\n    }\n}"
        },
        {
          "title": "Chứng minh chuyển trạng thái trước phần cứng",
          "text": "Bài tập từ chối mọi chuyển trạng thái ngoài chu trình sở hữu. Tạo Cargo test cho hai completion liên tiếp, đọc trước khi hoàn tất và cấp lại buffer còn đang đọc. Các test này kiểm tra giao thức logic, chưa kiểm tra cache, alignment hay tuổi thọ địa chỉ DMA. Trong firmware, đặt buffer ở vùng RAM phù hợp và giữ sống đủ lâu bằng API an toàn của driver. Chạy thử với tốc độ đầu vào cao hơn consumer, ghi số lần thiếu buffer và chọn dừng nhận hoặc bỏ mẫu có báo cáo. Không âm thầm ghi đè vùng nhớ còn được xử lý."
        }
      ],
      "tip": "Volatile không tự loại bỏ data race, không tự xử lý cache và không chứng minh thời điểm DMA hoàn tất.",
      "exercise": {
        "title": "Ngắt, DMA và quyền sở hữu buffer",
        "instructions": "Thiết kế đường dữ liệu từ ngoại vi đến task mà không tái sử dụng buffer quá sớm.",
        "requirements": [
          "Chỉ cho phép bốn chuyển trạng thái của chu trình buffer.",
          "Mọi chuyển khác trả lỗi trước khi đọc hoặc cấp lại vùng nhớ."
        ]
      },
      "starterCode": "#[derive(Clone, Copy, Debug, PartialEq)] enum Buffer { Free, Filling, Ready, Reading }\nfn advance(current: Buffer, next: Buffer) -> Result<Buffer, &'static str> { todo!() }\nfn main() {\nassert_eq!(advance(Buffer::Free, Buffer::Filling), Ok(Buffer::Filling));\nassert_eq!(advance(Buffer::Filling, Buffer::Reading), Err(\"chuyen-trai-phep\"));\nassert_eq!(advance(Buffer::Ready, Buffer::Reading), Ok(Buffer::Reading));\nassert_eq!(advance(Buffer::Reading, Buffer::Free), Ok(Buffer::Free));\nprintln!(\"Buffer chỉ đọc sau khi Ready\");\n}",
      "solutionCode": "#[derive(Clone, Copy, Debug, PartialEq)] enum Buffer { Free, Filling, Ready, Reading }\nfn advance(current: Buffer, next: Buffer) -> Result<Buffer, &'static str> {\n    match (current, next) {\n        (Buffer::Free, Buffer::Filling) | (Buffer::Filling, Buffer::Ready) |\n        (Buffer::Ready, Buffer::Reading) | (Buffer::Reading, Buffer::Free) => Ok(next),\n        _ => Err(\"chuyen-trai-phep\")\n    }\n}\nfn main() {\nassert_eq!(advance(Buffer::Free, Buffer::Filling), Ok(Buffer::Filling));\nassert_eq!(advance(Buffer::Filling, Buffer::Reading), Err(\"chuyen-trai-phep\"));\nassert_eq!(advance(Buffer::Ready, Buffer::Reading), Ok(Buffer::Reading));\nassert_eq!(advance(Buffer::Reading, Buffer::Free), Ok(Buffer::Free));\nprintln!(\"Buffer chỉ đọc sau khi Ready\");\n}",
      "expectedOutput": "Buffer chỉ đọc sau khi Ready",
      "hints": [
        "Chỉ cho phép bốn chuyển trạng thái của chu trình buffer.",
        "Volatile không tự loại bỏ data race, không tự xử lý cache và không chứng minh thời điểm DMA hoàn tất."
      ],
      "quiz": {
        "question": "Gắn volatile cho buffer có đủ bảo vệ CPU khỏi đọc khi DMA đang ghi không?",
        "options": ["Có, volatile là mutex phần cứng.", "Không; vẫn cần giao thức sở hữu và cơ chế đồng bộ phù hợp target.", "Có, nếu dùng u8."],
        "correct": 1,
        "explanation": "Volatile không tự loại bỏ data race, không tự xử lý cache và không chứng minh thời điểm DMA hoàn tất."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/stable/embedded-book/concurrency/index.html"
      }
    },
    {
      "id": "embedded-driver-project",
      "moduleId": "track-embedded",
      "title": "Dự án: driver I²C có hợp đồng và fake bus",
      "description": "Xây driver no_std bằng embedded-hal, kiểm thử giao dịch và lỗi thiết bị.",
      "duration": 90,
      "objectives": [
        "Xây driver no_std bằng embedded-hal, kiểm thử giao dịch và lỗi thiết bị.",
        "Giải mã big-endian signed và kiểm tra miền −4000 đến 12500.",
        "Giữ đúng số âm, không che lỗi thành giá trị 0."
      ],
      "sections": [
        {
          "title": "Định nghĩa thiết bị học tập chính xác",
          "text": "Dự án dùng cảm biến giả lập LearnTemp, không gán thanh ghi này cho một linh kiện có thật. Địa chỉ 7 bit là 0x48; thanh ghi 0x01 trả một byte trạng thái; bit 0 bằng 1 nghĩa là mẫu sẵn sàng. Thanh ghi 0x02 trả hai byte signed big-endian, đơn vị phần trăm độ C. Miền chấp nhận từ −4000 đến 12500. Hợp đồng này đủ để viết driver và fake bus; khi nối cảm biến thật, thay bảng thanh ghi, timing và phép đổi theo linh kiện, rồi kiểm tra lại từng giả định."
        },
        {
          "title": "Driver sở hữu bus và trả lỗi có nghĩa",
          "text": "Kiểu Sensor<I2C> giữ bus thỏa embedded_hal::i2c::I2c. Hàm read trước hết đọc trạng thái, nếu chưa sẵn sàng trả NotReady và không đọc thanh ghi nhiệt độ. Bus error giữ nguyên kiểu lỗi bên dưới để caller quyết định thử lại hay chuyển Fault. OutOfRange khác lỗi truyền: dữ liệu đã tới nhưng không đáp ứng hợp đồng. Không đổi mọi lỗi thành nhiệt độ 0, bởi 0 °C có thể là giá trị thật. Hàm release trả lại bus khi ứng dụng cần đổi chủ sở hữu hoặc phục hồi ngoại vi."
        },
        {
          "title": "Fake bus là phép kiểm tra giao thức",
          "text": "Một fake tốt kiểm tra địa chỉ, số thao tác, byte thanh ghi và chiều đọc trước khi trả dữ liệu. Nếu fake chỉ luôn trả 2500, test vẫn xanh khi driver gửi nhầm thanh ghi. Dự án cung cấp các kịch bản sẵn sàng, chưa sẵn sàng, nhiệt độ âm, giá trị ngoài miền và lỗi bus. Mỗi giao dịch write_read được biểu diễn bằng Write rồi Read trong cùng transaction. Việc kết hợp này quan trọng đối với thiết bị yêu cầu repeated start; hai lệnh riêng rẽ có thể tạo điều kiện khác trên bus.",
          "code": "fn temperature(bytes: [u8; 2]) -> Result<i16, &'static str> {\n    let value = i16::from_be_bytes(bytes);\n    if (-4000..=12500).contains(&value) { Ok(value) } else { Err(\"ngoai-mien\") }\n}"
        },
        {
          "title": "Tích hợp phần cứng có kiểm soát",
          "text": "Tải dự án Cargo, chạy test host, rồi kiểm tra thư viện cho target no_std đã chọn. Trong crate firmware, tạo HAL I2C đúng chân, tần số và lifetime, chuyển nó vào Sensor::new và chuyển kết quả thành Sample có timestamp. Không giữ vòng retry vô hạn bên trong driver; scheduler quyết định thời hạn và số lần thử. Trước khi đo thật, xác nhận pull-up, điện áp và địa chỉ bằng thiết kế bo. Lưu trace logic analyzer nếu có, so thứ tự byte với fixture và ghi rõ phép thử nào đã chạy. Fake bus chứng minh hợp đồng phần mềm, không chứng minh tín hiệu điện. Mỗi lỗi cần có cách tái hiện."
        }
      ],
      "tip": "Test phải xác nhận cả yêu cầu được gửi, không chỉ dữ liệu đầu ra.",
      "exercise": {
        "title": "Dự án: driver I²C có hợp đồng và fake bus",
        "instructions": "Xây driver no_std bằng embedded-hal, kiểm thử giao dịch và lỗi thiết bị.",
        "requirements": [
          "Giải mã big-endian signed và kiểm tra miền −4000 đến 12500.",
          "Giữ đúng số âm, không che lỗi thành giá trị 0."
        ]
      },
      "starterCode": "fn temperature(bytes: [u8; 2]) -> Result<i16, &'static str> { todo!() }\nfn main() {\nassert_eq!(temperature([0x09, 0xc4]), Ok(2500));\nassert_eq!(temperature((-125i16).to_be_bytes()), Ok(-125));\nassert_eq!(temperature(12501i16.to_be_bytes()), Err(\"ngoai-mien\"));\nprintln!(\"Nhiệt độ: {} centi°C\", temperature([0x09, 0xc4]).unwrap());\n}",
      "solutionCode": "fn temperature(bytes: [u8; 2]) -> Result<i16, &'static str> {\n    let value = i16::from_be_bytes(bytes);\n    if (-4000..=12500).contains(&value) { Ok(value) } else { Err(\"ngoai-mien\") }\n}\nfn main() {\nassert_eq!(temperature([0x09, 0xc4]), Ok(2500));\nassert_eq!(temperature((-125i16).to_be_bytes()), Ok(-125));\nassert_eq!(temperature(12501i16.to_be_bytes()), Err(\"ngoai-mien\"));\nprintln!(\"Nhiệt độ: {} centi°C\", temperature([0x09, 0xc4]).unwrap());\n}",
      "expectedOutput": "Nhiệt độ: 2500 centi°C",
      "hints": [
        "Giải mã big-endian signed và kiểm tra miền −4000 đến 12500.",
        "Test phải xác nhận cả yêu cầu được gửi, không chỉ dữ liệu đầu ra."
      ],
      "quiz": {
        "question": "Fake bus luôn trả 2500 dù driver gửi thanh ghi nào có thiếu sót gì?",
        "options": ["Không kiểm tra được địa chỉ và giao dịch của driver.", "Chạy quá chậm.", "Không thể dùng trong Rust."],
        "correct": 0,
        "explanation": "Test phải xác nhận cả yêu cầu được gửi, không chỉ dữ liệu đầu ra."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://docs.rs/embedded-hal/1.0.0/embedded_hal/i2c/trait.I2c.html"
      },
      "localLab": {
        "title": "Driver LearnTemp bằng embedded-hal",
        "instructions": "Tạo dự án từ các tệp dưới đây. Thiết bị LearnTemp là giao thức mô phỏng được định nghĩa trong bài; driver dùng embedded-hal 1.0 và có thể nhận bus HAL thật khi thay hợp đồng thanh ghi theo cảm biến của sản phẩm.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"learn-temp-driver\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\nembedded-hal = \"=1.0.0\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "#![no_std]\nuse embedded_hal::i2c::I2c;\n\n#[derive(Debug, PartialEq)]\npub enum Error<E> { Bus(E), NotReady, OutOfRange }\n\npub struct Sensor<B> { bus: B, address: u8 }\nimpl<B: I2c> Sensor<B> {\n    pub fn new(bus: B) -> Self { Self { bus, address: 0x48 } }\n    pub fn read_centi_c(&mut self) -> Result<i16, Error<B::Error>> {\n        let mut status = [0u8];\n        self.bus.write_read(self.address, &[0x01], &mut status).map_err(Error::Bus)?;\n        if status[0] & 1 == 0 { return Err(Error::NotReady); }\n        let mut data = [0u8; 2];\n        self.bus.write_read(self.address, &[0x02], &mut data).map_err(Error::Bus)?;\n        let value = i16::from_be_bytes(data);\n        if !(-4000..=12500).contains(&value) { return Err(Error::OutOfRange); }\n        Ok(value)\n    }\n    pub fn release(self) -> B { self.bus }\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n    use embedded_hal::i2c::{ErrorKind, ErrorType, Operation};\n    struct Fake { ready: bool, value: i16, fail: bool, calls: u8 }\n    impl ErrorType for Fake { type Error = ErrorKind; }\n    impl I2c for Fake {\n        fn transaction(&mut self, address: u8, operations: &mut [Operation<'_>]) -> Result<(), Self::Error> {\n            assert_eq!(address, 0x48);\n            self.calls += 1;\n            if self.fail { return Err(ErrorKind::Bus); }\n            match operations {\n                [Operation::Write(w), Operation::Read(r)] if *w == [1] && r.len() == 1 => {\n                    assert_eq!(self.calls, 1); r[0] = u8::from(self.ready);\n                }\n                [Operation::Write(w), Operation::Read(r)] if *w == [2] && r.len() == 2 => {\n                    assert_eq!(self.calls, 2); r.copy_from_slice(&self.value.to_be_bytes());\n                }\n                _ => panic!(\"Giao dịch không đúng hợp đồng LearnTemp\"),\n            }\n            Ok(())\n        }\n    }\n    fn fake(ready: bool, value: i16, fail: bool) -> Fake { Fake { ready, value, fail, calls: 0 } }\n    #[test] fn reads_signed_temperature_and_releases_bus() {\n        let mut s = Sensor::new(fake(true, -125, false));\n        assert_eq!(s.read_centi_c(), Ok(-125)); assert_eq!(s.release().calls, 2);\n    }\n    #[test] fn not_ready_does_not_read_payload() {\n        let mut s = Sensor::new(fake(false, 2500, false));\n        assert_eq!(s.read_centi_c(), Err(Error::NotReady)); assert_eq!(s.release().calls, 1);\n    }\n    #[test] fn preserves_bus_error() {\n        let mut s = Sensor::new(fake(true, 2500, true));\n        assert_eq!(s.read_centi_c(), Err(Error::Bus(ErrorKind::Bus)));\n    }\n    #[test] fn rejects_out_of_range() {\n        assert_eq!(Sensor::new(fake(true, 12501, false)).read_centi_c(), Err(Error::OutOfRange));\n        assert_eq!(Sensor::new(fake(true, -4001, false)).read_centi_c(), Err(Error::OutOfRange));\n    }\n    #[test] fn accepts_endpoints() {\n        assert_eq!(Sensor::new(fake(true, -4000, false)).read_centi_c(), Ok(-4000));\n        assert_eq!(Sensor::new(fake(true, 12500, false)).read_centi_c(), Ok(12500));\n    }\n}\n"
          },
          {
            "path": "examples/host.rs",
            "content": "use embedded_hal::i2c::{ErrorKind, ErrorType, I2c, Operation};\nuse learn_temp_driver::Sensor;\nstruct DemoBus;\nimpl ErrorType for DemoBus { type Error = ErrorKind; }\nimpl I2c for DemoBus {\n    fn transaction(&mut self, address: u8, operations: &mut [Operation<'_>]) -> Result<(), ErrorKind> {\n        if address != 0x48 { return Err(ErrorKind::Bus); }\n        match operations {\n            [Operation::Write(w), Operation::Read(r)] if *w == [1] && r.len() == 1 => r[0] = 1,\n            [Operation::Write(w), Operation::Read(r)] if *w == [2] && r.len() == 2 => r.copy_from_slice(&2500i16.to_be_bytes()),\n            _ => return Err(ErrorKind::Bus),\n        }\n        Ok(())\n    }\n}\nfn main() {\n    let mut sensor = Sensor::new(DemoBus);\n    println!(\"Nhiệt độ giả lập: {} centi°C\", sensor.read_centi_c().unwrap());\n}\n"
          },
          {
            "path": "README.md",
            "content": "# Driver LearnTemp\n\nHợp đồng: I²C 7 bit 0x48; thanh ghi 0x01 trả trạng thái ready ở bit 0; 0x02 trả i16 big-endian centi°C trong [-4000,12500]. Đây là thiết bị giả lập để kiểm thử, không phải pinout hoặc datasheet của cảm biến thương mại.\n\nMỗi read gồm write_read thanh ghi trạng thái; chỉ khi ready mới write_read payload. NotReady không tiêu thụ payload. Bus error giữ kiểu lỗi gốc; OutOfRange không được đổi thành 0. HAL bus được chuyển quyền vào Sensor, release trả lại bus.\n\nChạy cargo run --example host để xem adapter mô phỏng. Thay DemoBus bằng HAL I2C đáp ứng trait, giữ nguyên interface Sensor. Nếu thiết bị thật yêu cầu delay giữa lệnh bắt đầu đo và đọc, đưa thời gian chờ vào state machine ngoài driver và kiểm thử timeout; không sao chép thanh ghi giả này sang thiết bị thật.\n\n# Tích hợp từ host sang thiết bị\n\n1. Chạy cargo test --all-targets trên máy tính. Đây là kiểm thử logic và fake, không điều khiển chân thật.\n2. Giữ crate lõi no_std và tạo crate firmware riêng cho một mã MCU/bo cụ thể. Ghi mã chip, nguồn, điện áp logic, chân bus, tốc độ bus và đường debug trong bảng cấu hình dự án.\n3. Cố định toolchain, Cargo.lock và phiên bản HAL. Kiểm tra thư viện lõi với target tương ứng; việc này chưa tạo vector khởi động hoặc linker script cho firmware.\n4. Trong startup, đưa đầu ra về mức an toàn, khởi tạo clock và bus. Chuyển bus HAL vào driver; không tạo thêm owner cho cùng peripheral. Task lấy mẫu chuyển Result thành Sample có thời điểm và trạng thái.\n5. Scheduler gọi lõi với thời gian đơn điệu, đặt deadline cho bus và chính sách queue đầy. Không retry vô hạn trong interrupt. Với DMA, chỉ chuyển buffer sang consumer khi HAL báo hoàn tất và yêu cầu cache của target được đáp ứng.\n6. Đo trên thiết bị: rút cảm biến, nghẽn đường truyền, reset và mất nguồn trong lúc lưu cấu hình. Lưu log, điều kiện nguồn và phiên bản firmware. Không kết luận host test đã chứng minh timing hay điện áp.\n\nKhông có một main.rs chung chính xác cho mọi ESP32/STM32. Phần adapter bo cần tạo từ cấu hình target của sản phẩm, còn toàn bộ hợp đồng driver, giao thức, state machine và tiêu chí thử nằm trong dự án này.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run --example host"
        ],
        "checks": [
          "Fake xác nhận địa chỉ, thứ tự Write/Read và thanh ghi.",
          "Mẫu âm và hai đầu miền đúng; NotReady chỉ gọi một giao dịch.",
          "Lỗi bus và giá trị ngoài miền giữ lỗi riêng; không dùng giá trị mặc định."
        ]
      },
      "simulation": {
        "title": "Một lần đọc I²C",
        "description": "Theo dõi hợp đồng trước khi công bố mẫu.",
        "kind": "sequence",
        "nodes": [
          {
            "id": "request",
            "label": "Yêu cầu",
            "detail": "Driver bắt đầu đọc"
          },
          {
            "id": "status",
            "label": "Trạng thái",
            "detail": "Ready trước payload"
          },
          {
            "id": "payload",
            "label": "Payload",
            "detail": "Signed big-endian"
          },
          {
            "id": "sample",
            "label": "Mẫu",
            "detail": "Giá trị đã kiểm tra"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Có mẫu mới",
            "steps": [
              {
                "title": "Bắt đầu",
                "description": "Gửi write_read tới thanh ghi trạng thái.",
                "activeNodeIds": [
                  "request"
                ],
                "values": [
                  {
                    "label": "address",
                    "value": "0x48"
                  }
                ]
              },
              {
                "title": "Sẵn sàng",
                "description": "Bit ready bằng 1.",
                "activeNodeIds": [
                  "status"
                ],
                "values": [
                  {
                    "label": "ready",
                    "value": "true"
                  }
                ]
              },
              {
                "title": "Đọc payload",
                "description": "Nhận 0xff83, giải mã thành −125.",
                "activeNodeIds": [
                  "payload"
                ],
                "values": [
                  {
                    "label": "raw",
                    "value": "ff 83"
                  }
                ]
              },
              {
                "title": "Công bố",
                "description": "Giá trị trong miền, trả kết quả.",
                "activeNodeIds": [
                  "sample"
                ],
                "values": [
                  {
                    "label": "centi°C",
                    "value": "-125"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "Chưa sẵn sàng",
            "steps": [
              {
                "title": "Bắt đầu",
                "description": "Gửi cùng yêu cầu đọc trạng thái.",
                "activeNodeIds": [
                  "request"
                ],
                "values": [
                  {
                    "label": "address",
                    "value": "0x48"
                  }
                ]
              },
              {
                "title": "Kiểm tra",
                "description": "Bit ready bằng 0.",
                "activeNodeIds": [
                  "status"
                ],
                "values": [
                  {
                    "label": "ready",
                    "value": "false"
                  }
                ]
              },
              {
                "title": "Dừng giao dịch",
                "description": "Không đọc thanh ghi payload.",
                "activeNodeIds": [
                  "payload"
                ],
                "values": [
                  {
                    "label": "payload reads",
                    "value": "0"
                  }
                ]
              },
              {
                "title": "Trả trạng thái",
                "description": "Scheduler quyết định lần thử sau theo deadline.",
                "activeNodeIds": [
                  "sample"
                ],
                "values": [
                  {
                    "label": "result",
                    "value": "NotReady"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "embedded-calibration",
      "moduleId": "track-embedded",
      "title": "Hiệu chuẩn, lọc và chất lượng mẫu đo",
      "description": "Tách giá trị vật lý, độ mới và trạng thái lỗi để xử lý dữ liệu cảm biến đúng.",
      "duration": 45,
      "objectives": [
        "Tách giá trị vật lý, độ mới và trạng thái lỗi để xử lý dữ liệu cảm biến đúng.",
        "Trả giá trị giữa của ba mẫu, không tính trung bình.",
        "Xử lý đúng số âm và giá trị trùng nhau."
      ],
      "sections": [
        {
          "title": "Giá trị hợp lệ chưa chắc đủ chất lượng",
          "text": "Một cảm biến trả 25 °C không có nghĩa mọi nơi cần dùng ngay con số đó. Mẫu có thể quá cũ, đang trong thời gian ổn định sau bật nguồn hoặc được đọc khi nguồn cấp dao động. Sample cần chứa giá trị, thời điểm quan sát và chất lượng. Không dùng số 0 làm lỗi vì nó thuộc miền nhiệt độ thật. Kết quả read thất bại cũng không nên làm mất mẫu tốt gần nhất; lưu riêng last_good và trạng thái hiện tại, để UI hoặc bộ điều khiển biết độ cũ của dữ liệu đang hiển thị."
        },
        {
          "title": "Hiệu chuẩn là một phép biến đổi có nguồn gốc",
          "text": "Mô hình tuyến tính đơn giản dùng gain và offset: calibrated = raw × gain / scale + offset. Lưu hệ số cùng đơn vị, version và ngày đo để có thể tái hiện. Thực hiện phép nhân trong kiểu rộng, kiểm tra tràn và làm tròn theo quy tắc đã công bố. Hai điểm hiệu chuẩn chỉ phù hợp khi giả định tuyến tính chấp nhận được trong miền sử dụng. Không mở rộng kết luận từ một khoảng hẹp ra toàn miền cảm biến. Trong sản phẩm, sai số tham chiếu và điều kiện nhiệt độ cũng phải được đưa vào báo cáo."
        },
        {
          "title": "Lọc có đánh đổi về độ trễ",
          "text": "Trung bình nhiều mẫu giảm một số nhiễu nhưng có thể làm chậm phản ứng với thay đổi thật. Median nhỏ giúp loại một giá trị đột biến, nhưng không sửa cảm biến bị lệch toàn bộ. Bài tập lấy median của ba mẫu đã qua kiểm tra miền; sắp xếp một mảng cố định và trả phần tử giữa. Nếu một lần đọc lỗi, không tự đưa số 0 vào cửa sổ để đủ ba phần tử. Có thể giữ cửa sổ cũ nhưng phải đánh dấu độ mới hoặc chờ đủ mẫu hợp lệ tùy yêu cầu điều khiển.",
          "code": "fn median3(mut values: [i16; 3]) -> i16 { values.sort(); values[1] }"
        },
        {
          "title": "Kiểm thử bằng dữ liệu có chủ đích",
          "text": "Trong Cargo, tạo fixture gồm giá trị ổn định, một xung nhiễu, một bước thay đổi và nhiều lần mất kết nối. Đo cả sai số lẫn số chu kỳ cần để đầu ra bắt kịp bước thay đổi. Bài tập trình duyệt kiểm tra thứ tự đầu vào khác nhau và số âm để tránh thuật toán chỉ đúng với nhiệt độ dương. Khi tích hợp dự án driver, giữ giá trị raw trong log chẩn đoán có giới hạn để phân biệt lỗi bus, lỗi đổi đơn vị và hiệu chuẩn sai. Thử ở điều kiện thực tế đã ghi nhận, không chỉ với một giá trị mẫu đẹp."
        }
      ],
      "tip": "Giá trị và chất lượng/thời điểm là các phần khác nhau của hợp đồng dữ liệu.",
      "exercise": {
        "title": "Hiệu chuẩn, lọc và chất lượng mẫu đo",
        "instructions": "Tách giá trị vật lý, độ mới và trạng thái lỗi để xử lý dữ liệu cảm biến đúng.",
        "requirements": [
          "Trả giá trị giữa của ba mẫu, không tính trung bình.",
          "Xử lý đúng số âm và giá trị trùng nhau."
        ]
      },
      "starterCode": "fn median3(values: [i16; 3]) -> i16 { todo!() }\nfn main() {\nassert_eq!(median3([2500, 9000, 2501]), 2501);\nassert_eq!(median3([-300, -100, -200]), -200);\nassert_eq!(median3([5, 5, 1]), 5);\nprintln!(\"Mẫu lọc: {}\", median3([2500, 9000, 2501]));\n}",
      "solutionCode": "fn median3(mut values: [i16; 3]) -> i16 { values.sort(); values[1] }\nfn main() {\nassert_eq!(median3([2500, 9000, 2501]), 2501);\nassert_eq!(median3([-300, -100, -200]), -200);\nassert_eq!(median3([5, 5, 1]), 5);\nprintln!(\"Mẫu lọc: {}\", median3([2500, 9000, 2501]));\n}",
      "expectedOutput": "Mẫu lọc: 2501",
      "hints": [
        "Trả giá trị giữa của ba mẫu, không tính trung bình.",
        "Giá trị và chất lượng/thời điểm là các phần khác nhau của hợp đồng dữ liệu."
      ],
      "quiz": {
        "question": "Sau nhiều lần đọc lỗi, last_good vẫn là 25 °C. UI nên làm gì?",
        "options": ["Hiển thị 25 °C như mẫu vừa đọc.", "Hiển thị cùng trạng thái lỗi hoặc độ cũ, theo yêu cầu sản phẩm.", "Đổi thành 0 °C."],
        "correct": 1,
        "explanation": "Giá trị và chất lượng/thời điểm là các phần khác nhau của hợp đồng dữ liệu."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://docs.rs/embedded-hal/1.0.0/embedded_hal/i2c/index.html"
      }
    },
    {
      "id": "embedded-scheduling",
      "moduleId": "track-embedded",
      "title": "Deadline, backpressure và tác vụ không bỏ đói nhau",
      "description": "Lập lịch lấy mẫu theo thời gian đơn điệu và giới hạn công việc trong mỗi lượt.",
      "duration": 45,
      "objectives": [
        "Lập lịch lấy mẫu theo thời gian đơn điệu và giới hạn công việc trong mỗi lượt.",
        "Bỏ các mốc đã lỡ và chọn mốc đầu tiên lớn hơn now.",
        "Từ chối period bằng 0 và mọi phép tính tràn."
      ],
      "sections": [
        {
          "title": "Chu kỳ không chỉ là một lần sleep",
          "text": "Nếu đọc cảm biến mất 15 ms rồi sleep 100 ms, khoảng cách hai lần bắt đầu là 115 ms. Sai lệch tích lũy khiến tần suất thực khác cấu hình. Scheduler nên dựa trên mốc kế tiếp hoặc dùng ticker tương ứng của runtime. Khi trễ, chọn rõ bỏ chu kỳ đã lỡ hay chạy bù có giới hạn. Chạy bù mọi lần có thể tạo một cơn tải khiến hệ thống không bao giờ bắt kịp. Deadline mô tả thời điểm kết quả còn hữu ích, không chỉ khi nào hàm được gọi."
        },
        {
          "title": "Async vẫn có phần chạy đồng bộ",
          "text": "Một task chỉ nhường quyền tại điểm có cơ hội chờ. Vòng lặp xử lý hàng nghìn mẫu mà không await có thể giữ executor quá lâu. Chia công việc thành batch nhỏ, giới hạn thời gian mỗi lượt và đo độ trễ task quan trọng. Không giữ mutex qua một thao tác bus hoặc mạng dài nếu các task khác cũng cần dữ liệu được khóa. Nếu buộc giữ tài nguyên trong suốt giao dịch, hãy khóa đúng tài nguyên và mô tả thời hạn. Tên hàm async không chứng minh thao tác bên trong không chặn CPU."
        },
        {
          "title": "Backpressure cần một chính sách sản phẩm",
          "text": "Khi queue đầy, producer có thể chờ, bỏ mới, bỏ cũ hoặc giảm tốc. Chờ phù hợp nếu nguồn cho phép dừng; một bộ ADC hoặc ngắt liên tục có thể không chờ được. Bỏ cũ giữ thông tin mới nhất nhưng làm mất lịch sử. Bỏ mới giữ chuỗi đã nhận nhưng tăng độ cũ. Ghi counter cho hành vi đã chọn và đưa vào health report. Tính thời gian chờ từ deadline tổng: retry không được bắt đầu một ngân sách hoàn toàn mới ở mỗi lớp, khiến thời gian thực vượt hợp đồng ban đầu.",
          "code": "fn next_tick(now: u64, next: u64, period: u64) -> Option<(bool, u64)> {\n    if period == 0 { return None; }\n    if now < next { return Some((false, next)); }\n    let skipped = (now - next) / period;\n    let jump = skipped.checked_add(1)?.checked_mul(period)?;\n    Some((true, next.checked_add(jump)?))\n}"
        },
        {
          "title": "Thực hành quyết định có thể tái hiện",
          "text": "Bài tập nhận now, next và period theo mili giây, quyết định có chạy hay không, rồi tính mốc tiếp theo lớn hơn now. Nó bỏ những chu kỳ đã lỡ thay vì tạo vòng chạy bù. Dùng số u64 và checked arithmetic để báo lỗi cấu hình hoặc tràn. Trong Cargo, dùng clock giả và consumer chậm để đo queue, số mẫu bỏ và deadline lỡ mà không sleep thật. Khi chuyển sang Embassy, giữ cùng chính sách trong lõi còn adapter dùng Timer hoặc Ticker. Sau đó kiểm tra trên bo với tác vụ truyền dữ liệu đồng thời, vì host không mô phỏng toàn bộ ngắt và bus."
        }
      ],
      "tip": "Bắt kịp vô hạn có thể làm mất tính đáp ứng; ghi nhận chu kỳ bỏ và giới hạn công việc mỗi lượt.",
      "exercise": {
        "title": "Deadline, backpressure và tác vụ không bỏ đói nhau",
        "instructions": "Lập lịch lấy mẫu theo thời gian đơn điệu và giới hạn công việc trong mỗi lượt.",
        "requirements": [
          "Bỏ các mốc đã lỡ và chọn mốc đầu tiên lớn hơn now.",
          "Từ chối period bằng 0 và mọi phép tính tràn."
        ]
      },
      "starterCode": "fn next_tick(now: u64, next: u64, period: u64) -> Option<(bool, u64)> { todo!() }\nfn main() {\nassert_eq!(next_tick(90, 100, 20), Some((false, 100)));\nassert_eq!(next_tick(145, 100, 20), Some((true, 160)));\nassert_eq!(next_tick(100, 100, 0), None);\nassert_eq!(next_tick(u64::MAX, u64::MAX, 1), None);\nprintln!(\"Mốc kế tiếp: {} ms\", next_tick(145, 100, 20).unwrap().1);\n}",
      "solutionCode": "fn next_tick(now: u64, next: u64, period: u64) -> Option<(bool, u64)> {\n    if period == 0 { return None; }\n    if now < next { return Some((false, next)); }\n    let skipped = (now - next) / period;\n    let jump = skipped.checked_add(1)?.checked_mul(period)?;\n    Some((true, next.checked_add(jump)?))\n}\nfn main() {\nassert_eq!(next_tick(90, 100, 20), Some((false, 100)));\nassert_eq!(next_tick(145, 100, 20), Some((true, 160)));\nassert_eq!(next_tick(100, 100, 0), None);\nassert_eq!(next_tick(u64::MAX, u64::MAX, 1), None);\nprintln!(\"Mốc kế tiếp: {} ms\", next_tick(145, 100, 20).unwrap().1);\n}",
      "expectedOutput": "Mốc kế tiếp: 160 ms",
      "hints": [
        "Bỏ các mốc đã lỡ và chọn mốc đầu tiên lớn hơn now.",
        "Bắt kịp vô hạn có thể làm mất tính đáp ứng; ghi nhận chu kỳ bỏ và giới hạn công việc mỗi lượt."
      ],
      "quiz": {
        "question": "Task lấy mẫu trễ mười chu kỳ. Vì sao không luôn chạy bù cả mười ngay lập tức?",
        "options": ["Vì Rust cấm vòng lặp trong async.", "Vì timer không hỗ trợ số nguyên.", "Tải chạy bù có thể gây trễ thêm; cần chính sách phù hợp dữ liệu."],
        "correct": 2,
        "explanation": "Bắt kịp vô hạn có thể làm mất tính đáp ứng; ghi nhận chu kỳ bỏ và giới hạn công việc mỗi lượt."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://embassy.dev/book/"
      }
    },
    {
      "id": "embedded-telemetry-project",
      "moduleId": "track-embedded",
      "title": "Dự án: đường truyền telemetry hữu hạn",
      "description": "Đóng khung dữ liệu, kiểm tra CRC, xác nhận mẫu và phục hồi khi đường truyền gián đoạn.",
      "duration": 90,
      "objectives": [
        "Đóng khung dữ liệu, kiểm tra CRC, xác nhận mẫu và phục hồi khi đường truyền gián đoạn.",
        "Tính CRC16 với polynomial 0x1021 và init 0xffff.",
        "Đúng test vector 123456789 và dữ liệu rỗng."
      ],
      "sections": [
        {
          "title": "Đường byte không có ranh giới bản tin sẵn",
          "text": "UART và TCP cung cấp chuỗi byte; một lần read có thể trả nửa bản tin hoặc nhiều bản tin nối nhau. Dự án dùng khung cố định 12 byte: hai byte magic, một version, một cờ, sequence u32, nhiệt độ i16 và CRC16. Tất cả số nhiều byte dùng big-endian. Parser nhận slice có độ dài chính xác, kiểm tra magic và version trước khi giải mã. Adapter luồng phải gom khung có giới hạn; không cấp phát theo một length chưa kiểm tra. Giới hạn bộ đệm là một phần của hợp đồng giao thức."
        },
        {
          "title": "CRC phát hiện hỏng dữ liệu, không xác thực nguồn",
          "text": "CRC16 trong bài có đa thức 0x1021, giá trị đầu 0xffff, xử lý bit cao trước và không xor cuối. Một test vector cố định giúp hai phía triển khai cùng biến thể. CRC bị sai làm khung bị loại, nhưng người sửa dữ liệu có chủ đích có thể tính lại CRC. Nếu sản phẩm cần xác thực thiết bị hoặc chống sửa có chủ đích, cần giao thức bảo mật và quản lý khóa phù hợp. Không gọi một CRC đúng là bằng chứng dữ liệu đến từ thiết bị đã được tin cậy."
        },
        {
          "title": "Xác nhận gắn với sequence",
          "text": "Queue giữ tối đa bốn mẫu, gửi lại mẫu đầu cho đến khi nhận ACK có sequence tương ứng. ACK cũ hoặc khác mẫu đầu không được làm mất dữ liệu. Khi đầy, phiên bản học tập từ chối mẫu mới và tăng counter; điều này được quan sát trong test. Sequence không tái sử dụng trong một phiên boot; trước khi tràn phải kết thúc hoặc đổi định danh phiên. Trong mạng thật, thêm device ID và boot/session ID để server phân biệt lần khởi động lại. ACK chỉ có nghĩa đã nhận theo hợp đồng server, không tự chứng minh dữ liệu được lưu bền vững.",
          "code": "fn crc16(bytes: &[u8]) -> u16 {\n    let mut crc = 0xffffu16;\n    for &byte in bytes {\n        crc ^= u16::from(byte) << 8;\n        for _ in 0..8 { crc = if crc & 0x8000 != 0 { (crc << 1) ^ 0x1021 } else { crc << 1 }; }\n    }\n    crc\n}"
        },
        {
          "title": "Triển khai và kiểm thử đứt quãng",
          "text": "Cargo project cung cấp encoder, decoder và outbox no_std cùng các test CRC lỗi, ACK đến muộn, đầy queue và sequence cạn. Chạy demo host để thấy mẫu được giữ qua nhiều lần gửi, nhưng RAM sẽ mất khi reset; muốn bảo toàn qua mất nguồn phải bổ sung journal có kiểm tra tính toàn vẹn. Nối adapter UART hoặc mạng ở crate firmware, đặt timeout rồi retry có giới hạn và khoảng nghỉ. Test bằng cách ngắt đường truyền, làm chậm bên nhận và khởi động lại từng phía. Báo cáo số mẫu nhận, trùng và mất theo sequence thay vì chỉ nhìn đèn truyền nhấp nháy."
        }
      ],
      "tip": "CRC hỗ trợ phát hiện lỗi truyền; xác thực nguồn là yêu cầu khác.",
      "exercise": {
        "title": "Dự án: đường truyền telemetry hữu hạn",
        "instructions": "Đóng khung dữ liệu, kiểm tra CRC, xác nhận mẫu và phục hồi khi đường truyền gián đoạn.",
        "requirements": [
          "Tính CRC16 với polynomial 0x1021 và init 0xffff.",
          "Đúng test vector 123456789 và dữ liệu rỗng."
        ]
      },
      "starterCode": "fn crc16(bytes: &[u8]) -> u16 { todo!() }\nfn main() {\nassert_eq!(crc16(b\"123456789\"), 0x29b1);\nassert_eq!(crc16(b\"\"), 0xffff);\nassert_ne!(crc16(b\"abc\"), crc16(b\"abd\"));\nprintln!(\"CRC: {:04x}\", crc16(b\"123456789\"));\n}",
      "solutionCode": "fn crc16(bytes: &[u8]) -> u16 {\n    let mut crc = 0xffffu16;\n    for &byte in bytes {\n        crc ^= u16::from(byte) << 8;\n        for _ in 0..8 { crc = if crc & 0x8000 != 0 { (crc << 1) ^ 0x1021 } else { crc << 1 }; }\n    }\n    crc\n}\nfn main() {\nassert_eq!(crc16(b\"123456789\"), 0x29b1);\nassert_eq!(crc16(b\"\"), 0xffff);\nassert_ne!(crc16(b\"abc\"), crc16(b\"abd\"));\nprintln!(\"CRC: {:04x}\", crc16(b\"123456789\"));\n}",
      "expectedOutput": "CRC: 29b1",
      "hints": [
        "Tính CRC16 với polynomial 0x1021 và init 0xffff.",
        "CRC hỗ trợ phát hiện lỗi truyền; xác thực nguồn là yêu cầu khác."
      ],
      "quiz": {
        "question": "Khung có CRC đúng có chứng minh thiết bị gửi đã được xác thực không?",
        "options": ["Có, mọi CRC đều là chữ ký.", "Không, CRC không dùng bí mật và có thể được tính lại.", "Có, nếu khung chỉ 12 byte."],
        "correct": 1,
        "explanation": "CRC hỗ trợ phát hiện lỗi truyền; xác thực nguồn là yêu cầu khác."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/core/primitive.u16.html"
      },
      "localLab": {
        "title": "Telemetry và outbox no_std",
        "instructions": "Chạy demo host trước, sau đó nối encoder/outbox với adapter UART hoặc mạng của firmware. Mẫu được giữ đến ACK nhưng chưa bền vững qua reset; bài journal cung cấp phần thiết kế lưu bền cần bổ sung.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"telemetry-outbox\"\nversion = \"0.1.0\"\nedition = \"2024\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "#![no_std]\n#[derive(Clone, Copy, Debug, PartialEq)]\npub struct Sample { pub sequence: u32, pub centi_c: i16 }\n#[derive(Debug, PartialEq)]\npub enum Error { Length, Header, Crc, Range, Full, Exhausted }\npub fn crc16(bytes: &[u8]) -> u16 {\n    let mut crc = 0xffffu16;\n    for &byte in bytes {\n        crc ^= u16::from(byte) << 8;\n        for _ in 0..8 { crc = if crc & 0x8000 != 0 { (crc << 1) ^ 0x1021 } else { crc << 1 }; }\n    }\n    crc\n}\npub fn encode(sample: Sample) -> Result<[u8; 12], Error> {\n    if !(-4000..=12500).contains(&sample.centi_c) { return Err(Error::Range); }\n    let mut frame = [0u8; 12]; frame[..4].copy_from_slice(&[b'L', b'T', 1, 0]);\n    frame[4..8].copy_from_slice(&sample.sequence.to_be_bytes());\n    frame[8..10].copy_from_slice(&sample.centi_c.to_be_bytes());\n    let crc = crc16(&frame[..10]); frame[10..].copy_from_slice(&crc.to_be_bytes());\n    Ok(frame)\n}\npub fn decode(bytes: &[u8]) -> Result<Sample, Error> {\n    if bytes.len() != 12 { return Err(Error::Length); }\n    if bytes[..4] != [b'L', b'T', 1, 0] { return Err(Error::Header); }\n    if crc16(&bytes[..10]) != u16::from_be_bytes([bytes[10], bytes[11]]) { return Err(Error::Crc); }\n    let centi_c = i16::from_be_bytes([bytes[8], bytes[9]]);\n    if !(-4000..=12500).contains(&centi_c) { return Err(Error::Range); }\n    Ok(Sample { sequence: u32::from_be_bytes([bytes[4], bytes[5], bytes[6], bytes[7]]), centi_c })\n}\npub struct Outbox { slots: [Option<Sample>; 4], head: usize, len: usize, next: Option<u32>, dropped: u32 }\nimpl Outbox {\n    pub fn new(start: u32) -> Self { Self { slots: [None; 4], head: 0, len: 0, next: Some(start), dropped: 0 } }\n    pub fn push(&mut self, centi_c: i16) -> Result<u32, Error> {\n        if !(-4000..=12500).contains(&centi_c) { return Err(Error::Range); }\n        if self.len == 4 { self.dropped = self.dropped.saturating_add(1); return Err(Error::Full); }\n        let sequence = self.next.ok_or(Error::Exhausted)?;\n        self.slots[(self.head + self.len) % 4] = Some(Sample { sequence, centi_c });\n        self.len += 1; self.next = sequence.checked_add(1); Ok(sequence)\n    }\n    pub fn front(&self) -> Option<Sample> { self.slots[self.head] }\n    pub fn ack(&mut self, sequence: u32) -> bool {\n        if self.front().map(|x| x.sequence) != Some(sequence) { return false; }\n        self.slots[self.head] = None; self.head = (self.head + 1) % 4; self.len -= 1; true\n    }\n    pub fn len(&self) -> usize { self.len }\n    pub fn dropped(&self) -> u32 { self.dropped }\n}\n#[cfg(test)] mod tests {\n    use super::*;\n    #[test] fn reference_crc_and_roundtrip() {\n        assert_eq!(crc16(b\"123456789\"), 0x29b1);\n        for value in [-4000, -125, 0, 2500, 12500] {\n            let s = Sample { sequence: 42, centi_c: value };\n            assert_eq!(decode(&encode(s).unwrap()), Ok(s));\n        }\n    }\n    #[test] fn damaged_short_and_future_frames() {\n        let mut bytes = encode(Sample { sequence: 1, centi_c: 2500 }).unwrap();\n        bytes[8] ^= 1; assert_eq!(decode(&bytes), Err(Error::Crc));\n        assert_eq!(decode(&bytes[..5]), Err(Error::Length));\n        bytes[2] = 2; assert_eq!(decode(&bytes), Err(Error::Header));\n    }\n    #[test] fn full_queue_and_late_ack() {\n        let mut q = Outbox::new(10);\n        for _ in 0..4 { q.push(2500).unwrap(); }\n        assert_eq!(q.push(2501), Err(Error::Full)); assert_eq!(q.dropped(), 1);\n        assert!(!q.ack(9)); assert_eq!(q.len(), 4); assert!(q.ack(10)); assert!(!q.ack(10));\n        assert_eq!(q.push(2600), Ok(14)); assert_eq!(q.front().unwrap().sequence, 11);\n    }\n    #[test] fn retry_keeps_same_sample_until_ack() {\n        let mut q = Outbox::new(1); q.push(-100).unwrap();\n        let first = encode(q.front().unwrap()).unwrap();\n        assert_eq!(encode(q.front().unwrap()).unwrap(), first);\n        assert!(q.ack(1)); assert_eq!(q.front(), None);\n    }\n    #[test] fn sequence_does_not_wrap() {\n        let mut q = Outbox::new(u32::MAX); assert_eq!(q.push(0), Ok(u32::MAX));\n        assert!(q.ack(u32::MAX)); assert_eq!(q.push(0), Err(Error::Exhausted));\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use telemetry_outbox::{decode, encode, Outbox};\nfn main() {\n    let mut outbox = Outbox::new(1); outbox.push(2500).unwrap(); outbox.push(-125).unwrap();\n    while let Some(sample) = outbox.front() {\n        let wire = encode(sample).unwrap(); let received = decode(&wire).unwrap();\n        println!(\"ACK {}: {} centi°C\", received.sequence, received.centi_c);\n        assert!(outbox.ack(received.sequence));\n    }\n}\n"
          },
          {
            "path": "README.md",
            "content": "# Telemetry hữu hạn\n\nKhung cố định 12 byte: [0..2] LT, [2] version 1, [3] flags 0, [4..8] sequence u32 BE, [8..10] nhiệt độ i16 BE, [10..12] CRC16 BE. CRC chạy trên 10 byte đầu; polynomial 0x1021, init 0xffff, không phản chiếu/xor cuối. Parser chỉ nhận khung hoàn chỉnh; adapter phải gom byte vào mảng 12 phần tử và có timeout cho khung dở.\n\nOutbox 4 phần tử bỏ mới khi đầy và tăng dropped. Retry lấy front lại, không tự tạo sequence khác. ACK chỉ xóa đúng front. Sequence không quay vòng; khi cạn, đổi phiên truyền theo thiết kế. Production protocol cần device ID và boot/session ID để phân biệt reset và chống ACK của phiên trước. Dùng CRC để phát hiện lỗi truyền, không dùng làm chữ ký.\n\nBài mở rộng: adapter chunked stream phải thử mọi vị trí cắt 1..11; server giả làm mất ACK lần đầu để thấy resend; lưu journal trước khi chấp nhận mẫu nếu yêu cầu sống qua reset. Đo giới hạn RAM và lượng mất mẫu, không để Vec lớn lên vô hạn.\n\n# Tích hợp từ host sang thiết bị\n\n1. Chạy cargo test --all-targets trên máy tính. Đây là kiểm thử logic và fake, không điều khiển chân thật.\n2. Giữ crate lõi no_std và tạo crate firmware riêng cho một mã MCU/bo cụ thể. Ghi mã chip, nguồn, điện áp logic, chân bus, tốc độ bus và đường debug trong bảng cấu hình dự án.\n3. Cố định toolchain, Cargo.lock và phiên bản HAL. Kiểm tra thư viện lõi với target tương ứng; việc này chưa tạo vector khởi động hoặc linker script cho firmware.\n4. Trong startup, đưa đầu ra về mức an toàn, khởi tạo clock và bus. Chuyển bus HAL vào driver; không tạo thêm owner cho cùng peripheral. Task lấy mẫu chuyển Result thành Sample có thời điểm và trạng thái.\n5. Scheduler gọi lõi với thời gian đơn điệu, đặt deadline cho bus và chính sách queue đầy. Không retry vô hạn trong interrupt. Với DMA, chỉ chuyển buffer sang consumer khi HAL báo hoàn tất và yêu cầu cache của target được đáp ứng.\n6. Đo trên thiết bị: rút cảm biến, nghẽn đường truyền, reset và mất nguồn trong lúc lưu cấu hình. Lưu log, điều kiện nguồn và phiên bản firmware. Không kết luận host test đã chứng minh timing hay điện áp.\n\nKhông có một main.rs chung chính xác cho mọi ESP32/STM32. Phần adapter bo cần tạo từ cấu hình target của sản phẩm, còn toàn bộ hợp đồng driver, giao thức, state machine và tiêu chí thử nằm trong dự án này.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run"
        ],
        "checks": [
          "Khung lỗi, ngắn và version chưa hỗ trợ bị từ chối.",
          "ACK cũ không xóa mẫu; queue đầy không tăng bộ nhớ.",
          "Retry giữ sequence và giá trị; sequence cạn trả lỗi rõ ràng."
        ]
      }
    },
    {
      "id": "embedded-config-journal",
      "moduleId": "track-embedded",
      "title": "Cấu hình bền vững khi mất nguồn",
      "description": "Dùng hai slot, version và commit marker để không chấp nhận cấu hình ghi dở.",
      "duration": 45,
      "objectives": [
        "Dùng hai slot, version và commit marker để không chấp nhận cấu hình ghi dở.",
        "Chỉ xét slot vừa commit vừa có checksum hợp lệ.",
        "Trả generation lớn nhất hoặc None nếu không có bản tốt."
      ],
      "sections": [
        {
          "title": "Một lần ghi flash không phải giao dịch",
          "text": "Flash có đơn vị xóa và lập trình riêng; ghi đè vài byte có thể cần xóa cả trang. Mất điện giữa xóa và ghi làm cấu hình không đầy đủ. Nếu thiết bị chỉ có một bản, lần boot sau không biết chọn dữ liệu nào. Mô hình hai slot giữ bản đã commit trong khi chuẩn bị bản mới ở slot còn lại. Slot chứa magic, schema, generation, payload và kiểm tra tính toàn vẹn. Commit marker chỉ được ghi khi mọi dữ liệu cần thiết đã hoàn thành theo giao thức của phần cứng."
        },
        {
          "title": "Khôi phục bằng cách xác minh từng bản",
          "text": "Khi boot, đọc cả hai slot, xác minh độ dài, schema hỗ trợ, checksum và commit marker. Trong những slot hợp lệ, chọn generation mới nhất theo quy tắc đã thiết kế. Nếu không có bản hợp lệ, dùng chế độ cấu hình ban đầu an toàn và báo nguyên nhân; không tự tạo giá trị điều khiển nguy hiểm. Bài tập không cho generation quay vòng: khi tới trần, trả lỗi và yêu cầu quy trình bảo trì. Nhờ vậy so sánh số nguyên thông thường có nghĩa rõ ràng. Sản phẩm chạy rất lâu cần một chính sách rollover hoặc định danh thế hệ rộng hơn."
        },
        {
          "title": "Đừng nhầm checksum với sự thật của dữ liệu",
          "text": "Checksum đúng chỉ cho biết chuỗi byte phù hợp thuật toán kiểm tra, không đảm bảo khoảng lấy mẫu hoặc ngưỡng điều khiển hợp lệ. Sau khi decode, chạy validate cho từng trường và các ràng buộc giữa trường. Ví dụ ngưỡng bật phải thấp hơn ngưỡng tắt trong bộ sưởi có hysteresis. Khi đổi schema, converter phải được test với dữ liệu cũ và không ghi đè bản cũ trước khi bản mới được xác nhận. Nếu dữ liệu đến từ nguồn không đáng tin, còn cần xác thực và phân quyền riêng.",
          "code": "#[derive(Clone, Copy)] struct Slot { generation: u32, committed: bool, checksum_ok: bool }\nfn recover(slots: &[Slot]) -> Option<u32> {\n    slots.iter().filter(|s| s.committed && s.checksum_ok).map(|s| s.generation).max()\n}"
        },
        {
          "title": "Thử lỗi tại từng điểm ghi",
          "text": "Trong Cargo, mô phỏng thao tác erase, write header, write payload và commit bằng bộ nhớ; ngắt sau từng bước rồi chạy lại recovery. Mọi trạng thái phải chọn bản cũ hợp lệ hoặc bản mới đầy đủ, tuyệt đối không chọn payload nửa chừng. Test logic chưa chứng minh thứ tự ghi, độ bền hay số chu kỳ xóa của chip. Adapter flash cần tôn trọng alignment, page size, trạng thái busy và nguồn điện tối thiểu. Đếm số lần ghi, tránh lưu sau mỗi mẫu cảm biến và chỉ ghi khi cấu hình thay đổi. Kiểm thử mất nguồn thật cần thiết bị và quy trình đo được ghi lại rõ ràng."
        }
      ],
      "tip": "Checksum và commit là hai điều kiện riêng; giao thức phải xác nhận hoàn tất trước khi công bố.",
      "exercise": {
        "title": "Cấu hình bền vững khi mất nguồn",
        "instructions": "Dùng hai slot, version và commit marker để không chấp nhận cấu hình ghi dở.",
        "requirements": [
          "Chỉ xét slot vừa commit vừa có checksum hợp lệ.",
          "Trả generation lớn nhất hoặc None nếu không có bản tốt."
        ]
      },
      "starterCode": "#[derive(Clone, Copy)] struct Slot { generation: u32, committed: bool, checksum_ok: bool }\nfn recover(slots: &[Slot]) -> Option<u32> { todo!() }\nfn main() {\nlet slots = [Slot { generation: 4, committed: true, checksum_ok: true }, Slot { generation: 5, committed: false, checksum_ok: true }];\nassert_eq!(recover(&slots), Some(4));\nassert_eq!(recover(&[Slot { generation: 6, committed: true, checksum_ok: false }]), None);\nassert_eq!(recover(&[]), None);\nprintln!(\"Khôi phục generation: {}\", recover(&slots).unwrap());\n}",
      "solutionCode": "#[derive(Clone, Copy)] struct Slot { generation: u32, committed: bool, checksum_ok: bool }\nfn recover(slots: &[Slot]) -> Option<u32> {\n    slots.iter().filter(|s| s.committed && s.checksum_ok).map(|s| s.generation).max()\n}\nfn main() {\nlet slots = [Slot { generation: 4, committed: true, checksum_ok: true }, Slot { generation: 5, committed: false, checksum_ok: true }];\nassert_eq!(recover(&slots), Some(4));\nassert_eq!(recover(&[Slot { generation: 6, committed: true, checksum_ok: false }]), None);\nassert_eq!(recover(&[]), None);\nprintln!(\"Khôi phục generation: {}\", recover(&slots).unwrap());\n}",
      "expectedOutput": "Khôi phục generation: 4",
      "hints": [
        "Chỉ xét slot vừa commit vừa có checksum hợp lệ.",
        "Checksum và commit là hai điều kiện riêng; giao thức phải xác nhận hoàn tất trước khi công bố."
      ],
      "quiz": {
        "question": "Bản mới có checksum đúng nhưng chưa có commit marker. Recovery nên làm gì?",
        "options": ["Bỏ bản chưa commit và chọn bản hợp lệ còn lại.", "Sửa marker rồi tin bản mới.", "Chọn ngay vì generation cao hơn."],
        "correct": 0,
        "explanation": "Checksum và commit là hai điều kiện riêng; giao thức phải xác nhận hoàn tất trước khi công bố."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/stable/embedded-book/design-patterns/hal/index.html"
      },
      "simulation": {
        "title": "Journal qua mất nguồn",
        "description": "Chỉ công bố cấu hình sau khi slot mới hoàn tất.",
        "kind": "timeline",
        "nodes": [
          {
            "id": "old",
            "label": "Slot A",
            "detail": "Bản đang dùng"
          },
          {
            "id": "new",
            "label": "Slot B",
            "detail": "Chuẩn bị bản mới"
          },
          {
            "id": "commit",
            "label": "Commit",
            "detail": "Marker ghi cuối"
          },
          {
            "id": "boot",
            "label": "Recovery",
            "detail": "Xác minh khi boot"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Ghi hoàn tất",
            "steps": [
              {
                "title": "Bản cũ",
                "description": "A hợp lệ generation 7.",
                "activeNodeIds": [
                  "old"
                ],
                "values": [
                  {
                    "label": "generation",
                    "value": "7"
                  }
                ]
              },
              {
                "title": "Chuẩn bị",
                "description": "Ghi B với checksum và marker chưa commit.",
                "activeNodeIds": [
                  "new"
                ],
                "values": [
                  {
                    "label": "generation",
                    "value": "8"
                  }
                ]
              },
              {
                "title": "Commit",
                "description": "Ghi marker sau khi dữ liệu đủ.",
                "activeNodeIds": [
                  "commit"
                ],
                "values": [
                  {
                    "label": "marker",
                    "value": "0xa5"
                  }
                ]
              },
              {
                "title": "Khởi động lại",
                "description": "Chọn B vì đầy đủ và mới hơn.",
                "activeNodeIds": [
                  "boot"
                ],
                "values": [
                  {
                    "label": "selected",
                    "value": "8"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "Mất nguồn trước commit",
            "steps": [
              {
                "title": "Bản cũ",
                "description": "A vẫn là cấu hình hợp lệ.",
                "activeNodeIds": [
                  "old"
                ],
                "values": [
                  {
                    "label": "generation",
                    "value": "7"
                  }
                ]
              },
              {
                "title": "Ghi dở",
                "description": "B đã có payload nhưng chưa commit.",
                "activeNodeIds": [
                  "new"
                ],
                "values": [
                  {
                    "label": "marker",
                    "value": "0xff"
                  }
                ]
              },
              {
                "title": "Nguồn tắt",
                "description": "Không được suy diễn rằng checksum là commit.",
                "activeNodeIds": [
                  "commit"
                ],
                "values": [
                  {
                    "label": "committed",
                    "value": "false"
                  }
                ]
              },
              {
                "title": "Khôi phục",
                "description": "B bị loại, A được chọn.",
                "activeNodeIds": [
                  "boot"
                ],
                "values": [
                  {
                    "label": "selected",
                    "value": "7"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "embedded-power-budget",
      "moduleId": "track-embedded",
      "title": "Năng lượng, sleep và tuổi thọ pin",
      "description": "Tính năng lượng theo từng pha và kiểm chứng thiết kế tiết kiệm điện bằng phép đo.",
      "duration": 45,
      "objectives": [
        "Tính năng lượng theo từng pha và kiểm chứng thiết kế tiết kiệm điện bằng phép đo.",
        "Tính tổng điện lượng và tổng thời gian bằng checked arithmetic.",
        "Làm tròn lên dòng trung bình, từ chối thời gian tổng bằng 0."
      ],
      "sections": [
        {
          "title": "Công suất đỉnh và năng lượng không giống nhau",
          "text": "Một module phát radio chỉ hoạt động ngắn nhưng dùng dòng cao; trạng thái ngủ dòng thấp kéo dài có thể vẫn đóng góp đáng kể. Tính điện lượng mỗi chu kỳ bằng dòng nhân thời gian từng pha, rồi chia cho tổng thời gian để có dòng trung bình. Đơn vị phải nhất quán: microampere nhân mili giây khác milliampere nhân giây. Dùng kiểu rộng và kiểm tra tràn khi tính từ cấu hình. Pin còn chịu hiệu suất ổn áp, nhiệt độ, tự xả và khả năng cấp dòng đỉnh, nên phép chia dung lượng cho dòng chỉ là ước lượng ban đầu."
        },
        {
          "title": "Sleep phụ thuộc hệ thống hoàn chỉnh",
          "text": "CPU ngủ nhưng cảm biến, LED, cầu USB hoặc radio vẫn chạy thì dòng toàn bo có thể còn cao. Để đo phần firmware, xác định điểm cấp nguồn và thiết bị nào nằm trong đường đo. Deep sleep có thể làm mất RAM và cấu hình peripheral; wake-up có chi phí thời gian và năng lượng. Nếu khởi động radio tốn nhiều hơn tiết kiệm được trong khoảng ngủ ngắn, ngủ sâu liên tục không có lợi. Chọn chế độ theo chu kỳ thực tế, yêu cầu đáp ứng nút bấm và nguồn đánh thức mà chip hỗ trợ."
        },
        {
          "title": "Quyết định truyền gộp có hệ quả dữ liệu",
          "text": "Gộp nhiều mẫu vào một lần truyền có thể giảm số lần khởi động radio, nhưng tăng độ trễ và dung lượng lưu đệm. Nếu mẫu cần cảnh báo ngay, hãy có đường ưu tiên riêng thay vì chờ đủ batch. Khi pin yếu, giảm tần suất cần được thể hiện trong metadata để server không kết luận thiết bị mất kết nối. Không để một retry loop vô hạn giữ radio thức đến cạn pin. Gắn retry với ngân sách năng lượng hoặc số lần thử, lưu trạng thái chờ và tiếp tục ở chu kỳ tiếp theo theo yêu cầu sản phẩm.",
          "code": "fn average_ua(phases: &[(u64, u64)]) -> Option<u64> {\n    let mut charge = 0u64; let mut time = 0u64;\n    for &(ua, ms) in phases { charge = charge.checked_add(ua.checked_mul(ms)?)?; time = time.checked_add(ms)?; }\n    if time == 0 { return None; }\n    Some(charge / time + u64::from(charge % time != 0))\n}"
        },
        {
          "title": "Thực hành ước lượng rồi đối chiếu",
          "text": "Bài tập tính dòng trung bình nguyên, làm tròn lên để tránh báo thấp hơn phép tính. Test chu kỳ rỗng, thời gian bằng 0 và trường hợp nhân có thể tràn. Trong Cargo, lưu kịch bản các pha đo, truyền và ngủ dưới dạng dữ liệu, xuất tổng điện lượng cùng chu kỳ. Trên bo thật, đo đủ độ phân giải để thấy xung dòng ngắn; ghi nguồn cấp, tần số lấy mẫu của máy đo và trạng thái debugger. So sánh ước lượng với phép đo, tìm phần năng lượng chưa được mô hình hóa. Không đưa con số tuổi thọ pin vào cam kết sản phẩm khi chưa đo điều kiện sử dụng."
        }
      ],
      "tip": "Năng lượng phải đo tại ranh giới toàn hệ thống được cấp nguồn, không chỉ trạng thái CPU.",
      "exercise": {
        "title": "Năng lượng, sleep và tuổi thọ pin",
        "instructions": "Tính năng lượng theo từng pha và kiểm chứng thiết kế tiết kiệm điện bằng phép đo.",
        "requirements": [
          "Tính tổng điện lượng và tổng thời gian bằng checked arithmetic.",
          "Làm tròn lên dòng trung bình, từ chối thời gian tổng bằng 0."
        ]
      },
      "starterCode": "fn average_ua(phases: &[(u64, u64)]) -> Option<u64> { todo!() }\nfn main() {\nassert_eq!(average_ua(&[(10000, 10), (10, 990)]), Some(110));\nassert_eq!(average_ua(&[]), None);\nassert_eq!(average_ua(&[(u64::MAX, 2)]), None);\nprintln!(\"Dòng trung bình: {} µA\", average_ua(&[(10000, 10), (10, 990)]).unwrap());\n}",
      "solutionCode": "fn average_ua(phases: &[(u64, u64)]) -> Option<u64> {\n    let mut charge = 0u64; let mut time = 0u64;\n    for &(ua, ms) in phases { charge = charge.checked_add(ua.checked_mul(ms)?)?; time = time.checked_add(ms)?; }\n    if time == 0 { return None; }\n    Some(charge / time + u64::from(charge % time != 0))\n}\nfn main() {\nassert_eq!(average_ua(&[(10000, 10), (10, 990)]), Some(110));\nassert_eq!(average_ua(&[]), None);\nassert_eq!(average_ua(&[(u64::MAX, 2)]), None);\nprintln!(\"Dòng trung bình: {} µA\", average_ua(&[(10000, 10), (10, 990)]).unwrap());\n}",
      "expectedOutput": "Dòng trung bình: 110 µA",
      "hints": [
        "Tính tổng điện lượng và tổng thời gian bằng checked arithmetic.",
        "Năng lượng phải đo tại ranh giới toàn hệ thống được cấp nguồn, không chỉ trạng thái CPU."
      ],
      "quiz": {
        "question": "CPU vào deep sleep đã chứng minh toàn bộ bo tiêu thụ ít điện chưa?",
        "options": ["Đã đủ vì CPU là thành phần duy nhất.", "Đã đủ nếu không dùng alloc.", "Chưa; cảm biến, radio, LED và bộ nguồn vẫn có thể tiêu thụ."],
        "correct": 2,
        "explanation": "Năng lượng phải đo tại ranh giới toàn hệ thống được cấp nguồn, không chỉ trạng thái CPU."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://docs.espressif.com/projects/rust/book/"
      }
    },
    {
      "id": "embedded-firmware-update",
      "moduleId": "track-embedded",
      "title": "Cập nhật firmware và chống vòng lặp khởi động lỗi",
      "description": "Phân biệt kiểm tra toàn vẹn, xác thực, boot thử và xác nhận firmware mới.",
      "duration": 45,
      "objectives": [
        "Phân biệt kiểm tra toàn vẹn, xác thực, boot thử và xác nhận firmware mới.",
        "Chỉ xác nhận khi self-test, cấu hình và heartbeat đều đạt.",
        "Giới hạn tuổi heartbeat là 500 ms, bao gồm điểm biên."
      ],
      "sections": [
        {
          "title": "Tải được ảnh chưa có nghĩa được chạy",
          "text": "Quy trình cập nhật cần kiểm tra kích thước, model phần cứng, phiên bản giao thức, nguồn phát hành và chữ ký theo thiết kế bootloader. Hash phát hiện byte khác với giá trị dự kiến; nếu giá trị hash cũng do nguồn không tin cậy cung cấp thì nó không xác thực nhà phát hành. Không tự viết thuật toán chữ ký để dùng trong sản phẩm. Bài học mô hình hóa quyết định cập nhật, còn xác minh mật mã và chuỗi tin cậy thuộc bootloader, thư viện và khóa được quản lý phù hợp trên nền tảng đã chọn."
        },
        {
          "title": "Giữ một đường quay lại đã biết tốt",
          "text": "Thiết kế hai phân vùng thường tải ảnh mới vào vùng không chạy, kiểm tra rồi đánh dấu pending. Bootloader cho phép boot thử nhưng chưa coi ảnh đó là tốt vĩnh viễn. Ứng dụng phải hoàn thành kiểm tra cần thiết, ví dụ đọc cấu hình và khởi tạo tác vụ quan trọng, trước khi confirm. Nếu chỉ gọi confirm ngay ở dòng đầu main, lỗi sau đó không được phát hiện qua cơ chế rollback. Số lần thử, điều kiện xác nhận và cách giữ cấu hình tương thích phải được quyết định cùng với quy trình phát hành."
        },
        {
          "title": "Watchdog không phải bằng chứng mọi thứ hoạt động",
          "text": "Một task chuyên feed watchdog liên tục vẫn có thể chạy khi task lấy mẫu đã chết. Supervisor nên kiểm tra heartbeat hoặc tiến độ của các thành phần bắt buộc trong một cửa sổ thời gian trước khi feed. Health có thể bao gồm deadline, lỗi lưu cấu hình và khả năng phục vụ điều khiển. Đừng buộc mọi lỗi mạng phải reset: mất mạng dài là điều kiện có thể xảy ra bình thường. Sau reset, lưu hoặc báo nguyên nhân nếu nền tảng hỗ trợ, đồng thời hạn chế vòng boot-reset làm mất khả năng chẩn đoán.",
          "code": "fn confirm(self_test: bool, config_ok: bool, heartbeat_age_ms: u32) -> bool {\n    self_test && config_ok && heartbeat_age_ms <= 500\n}"
        },
        {
          "title": "Kiểm thử cả đường thất bại",
          "text": "Bài tập chỉ cho confirm khi self-test, cấu hình và heartbeat đều tốt. Cargo project cần test các tổ hợp thiếu một điều kiện, tải ảnh dở, model sai, chữ ký không hợp lệ và mất nguồn trước đổi boot flag. Host state machine không thực hiện bootloader thật; bước target phải dùng cơ chế cập nhật đã hỗ trợ và kiểm tra phân vùng. Bàn giao một bản đã biết tốt cùng hướng dẫn phục hồi qua cổng nạp. Thực hiện thử trên thiết bị dành cho kiểm thử và ghi phiên bản firmware trước/sau; không coi một lần cập nhật thành công là đủ kiểm chứng khả năng rollback."
        }
      ],
      "tip": "Watchdog chỉ hữu ích khi điều kiện feed phản ánh sức khỏe cần bảo vệ.",
      "exercise": {
        "title": "Cập nhật firmware và chống vòng lặp khởi động lỗi",
        "instructions": "Phân biệt kiểm tra toàn vẹn, xác thực, boot thử và xác nhận firmware mới.",
        "requirements": [
          "Chỉ xác nhận khi self-test, cấu hình và heartbeat đều đạt.",
          "Giới hạn tuổi heartbeat là 500 ms, bao gồm điểm biên."
        ]
      },
      "starterCode": "fn confirm(self_test: bool, config_ok: bool, heartbeat_age_ms: u32) -> bool { todo!() }\nfn main() {\nassert!(confirm(true, true, 500));\nassert!(!confirm(false, true, 0));\nassert!(!confirm(true, false, 0));\nassert!(!confirm(true, true, 501));\nprintln!(\"Xác nhận firmware: {}\", confirm(true, true, 120));\n}",
      "solutionCode": "fn confirm(self_test: bool, config_ok: bool, heartbeat_age_ms: u32) -> bool {\n    self_test && config_ok && heartbeat_age_ms <= 500\n}\nfn main() {\nassert!(confirm(true, true, 500));\nassert!(!confirm(false, true, 0));\nassert!(!confirm(true, false, 0));\nassert!(!confirm(true, true, 501));\nprintln!(\"Xác nhận firmware: {}\", confirm(true, true, 120));\n}",
      "expectedOutput": "Xác nhận firmware: true",
      "hints": [
        "Chỉ xác nhận khi self-test, cấu hình và heartbeat đều đạt.",
        "Watchdog chỉ hữu ích khi điều kiện feed phản ánh sức khỏe cần bảo vệ."
      ],
      "quiz": {
        "question": "Task feed watchdog riêng vẫn sống nhưng task lấy mẫu đã treo. Cần thay đổi gì?",
        "options": ["Feed nhanh hơn.", "Bỏ watchdog.", "Chỉ feed sau khi các heartbeat bắt buộc còn mới."],
        "correct": 2,
        "explanation": "Watchdog chỉ hữu ích khi điều kiện feed phản ánh sức khỏe cần bảo vệ."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://embassy.dev/book/"
      }
    },
    {
      "id": "embedded-station-project",
      "moduleId": "track-embedded",
      "title": "Dự án tổng hợp: trạm đo phục hồi được",
      "description": "Kết hợp lấy mẫu, hysteresis, journal và health thành sản phẩm có bằng chứng kiểm thử.",
      "duration": 90,
      "objectives": [
        "Kết hợp lấy mẫu, hysteresis, journal và health thành sản phẩm có bằng chứng kiểm thử.",
        "Bật khi đạt high, tắt khi xuống low, giữ trạng thái ở giữa.",
        "Từ chối cấu hình low lớn hơn hoặc bằng high."
      ],
      "sections": [
        {
          "title": "Chốt yêu cầu trước khi ghép crate",
          "text": "Trạm đo của dự án lấy nhiệt độ theo chu kỳ, bật cảnh báo trên ngưỡng và chỉ tắt khi xuống dưới ngưỡng thấp hơn. Đầu ra gồm sequence, giá trị, trạng thái cảm biến, số mẫu mất và health. Ngưỡng và chu kỳ thuộc cấu hình có version; lỗi cấu hình không được tự đổi thành giá trị dễ gây điều khiển sai. Phiên bản mẫu là controller core chạy trên host với clock và cảm biến giả. Nó tạo nền tảng để gắn HAL, không giả vờ là firmware đã nạp được lên mọi bo."
        },
        {
          "title": "Hysteresis chống dao động quanh ngưỡng",
          "text": "Nếu bật và tắt cùng một ngưỡng, tín hiệu nhiễu quanh mốc làm đầu ra đổi liên tục. Dùng high để bật, low để tắt và giữ trạng thái khi nằm giữa. Validate low < high ngay khi nhận cấu hình. Khi cảm biến lỗi hoặc quá cũ, chính sách trong bài chuyển cảnh báo sang trạng thái lỗi riêng và không dùng giá trị cũ để quyết định mới. Thiết bị điều khiển cơ cấu thật cần định nghĩa đầu ra an toàn theo phân tích của sản phẩm; không có một mức GPIO an toàn chung cho mọi mạch."
        },
        {
          "title": "Ghép các cơ chế bằng ranh giới rõ ràng",
          "text": "Core nhận sự kiện Tick, Sample và SensorError, trả quyết định cần gửi hoặc đổi trạng thái. Adapter lấy mẫu xử lý bus, adapter lưu trữ ghi journal và adapter đầu ra truyền khung. Không để driver trực tiếp sửa cấu hình hoặc feed watchdog. Health chỉ tốt khi các nhiệm vụ bắt buộc có tiến độ trong hạn. Hai slot cấu hình trong lab được mô phỏng byte để kiểm tra mất nguồn ở từng bước; flash thật vẫn cần adapter đúng page size, alignment và thứ tự ghi. Các bộ đếm phải có hành vi đã định nghĩa khi đạt giới hạn.",
          "code": "fn alarm(previous: bool, value: i16, low: i16, high: i16) -> Option<bool> {\n    if low >= high { return None; }\n    Some(if value >= high { true } else if value <= low { false } else { previous })\n}"
        },
        {
          "title": "Nghiệm thu như một dự án bàn giao",
          "text": "Cargo project có no_std core, demo host và test cho mẫu lỗi, hysteresis, cấu hình ghi dở, checksum hỏng và heartbeat quá hạn. Tạo báo cáo bao gồm chuỗi sự kiện đầu vào, đầu ra mong đợi và kết quả thật. Sau đó chọn một bo cụ thể, thêm crate firmware, bảng chân và quy trình build/nạp bên trong README dự án. Đo RAM, flash, jitter, mức tiêu thụ và khôi phục nguồn trên thiết bị; đánh dấu phép thử chưa chạy. Dự án đạt khi người khác tái hiện được lỗi và phục hồi, không chỉ khi một ảnh chụp cho thấy nhiệt độ đang tăng trên màn hình."
        }
      ],
      "tip": "Tính mới của dữ liệu là điều kiện đầu vào của quyết định, không chỉ giá trị nhiệt độ.",
      "exercise": {
        "title": "Dự án tổng hợp: trạm đo phục hồi được",
        "instructions": "Kết hợp lấy mẫu, hysteresis, journal và health thành sản phẩm có bằng chứng kiểm thử.",
        "requirements": [
          "Bật khi đạt high, tắt khi xuống low, giữ trạng thái ở giữa.",
          "Từ chối cấu hình low lớn hơn hoặc bằng high."
        ]
      },
      "starterCode": "fn alarm(previous: bool, value: i16, low: i16, high: i16) -> Option<bool> { todo!() }\nfn main() {\nassert_eq!(alarm(false, 3000, 2700, 3000), Some(true));\nassert_eq!(alarm(true, 2800, 2700, 3000), Some(true));\nassert_eq!(alarm(true, 2700, 2700, 3000), Some(false));\nassert_eq!(alarm(false, 100, 100, 100), None);\nprintln!(\"Cảnh báo: {}\", alarm(false, 3000, 2700, 3000).unwrap());\n}",
      "solutionCode": "fn alarm(previous: bool, value: i16, low: i16, high: i16) -> Option<bool> {\n    if low >= high { return None; }\n    Some(if value >= high { true } else if value <= low { false } else { previous })\n}\nfn main() {\nassert_eq!(alarm(false, 3000, 2700, 3000), Some(true));\nassert_eq!(alarm(true, 2800, 2700, 3000), Some(true));\nassert_eq!(alarm(true, 2700, 2700, 3000), Some(false));\nassert_eq!(alarm(false, 100, 100, 100), None);\nprintln!(\"Cảnh báo: {}\", alarm(false, 3000, 2700, 3000).unwrap());\n}",
      "expectedOutput": "Cảnh báo: true",
      "hints": [
        "Bật khi đạt high, tắt khi xuống low, giữ trạng thái ở giữa.",
        "Tính mới của dữ liệu là điều kiện đầu vào của quyết định, không chỉ giá trị nhiệt độ."
      ],
      "quiz": {
        "question": "Mẫu bị lỗi nhưng còn last_good mới cách đây một giờ. Controller nên xử lý thế nào?",
        "options": ["Áp dụng chính sách dữ liệu lỗi/quá cũ đã định nghĩa và báo trạng thái.", "Dùng như mẫu vừa nhận.", "Đổi last_good thành 0 rồi tiếp tục."],
        "correct": 0,
        "explanation": "Tính mới của dữ liệu là điều kiện đầu vào của quyết định, không chỉ giá trị nhiệt độ."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/stable/embedded-book/design-patterns/hal/index.html"
      },
      "localLab": {
        "title": "Controller trạm đo và journal hai slot",
        "instructions": "Dự án cung cấp core no_std và mô hình byte của hai slot cấu hình, cùng demo host. Dùng bộ test này làm chuẩn khi thêm adapter flash/HAL của bo; ghi rõ giới hạn vật lý chưa được mô phỏng.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"station-controller\"\nversion = \"0.1.0\"\nedition = \"2024\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "#![no_std]\n#[derive(Clone, Copy, Debug, PartialEq)]\npub struct Config { pub period_ms: u16, pub low: i16, pub high: i16 }\n#[derive(Clone, Copy, Debug, PartialEq)]\npub enum Error { Config, Header, Crc, Uncommitted, Generation, Sensor, Clock }\nimpl Config {\n    pub fn validate(self) -> Result<Self, Error> {\n        if !(10..=60000).contains(&self.period_ms) || self.low >= self.high || self.low < -4000 || self.high > 12500 { Err(Error::Config) } else { Ok(self) }\n    }\n}\nfn crc(bytes: &[u8]) -> u16 {\n    let mut value = 0xffffu16;\n    for (index, &byte) in bytes.iter().enumerate() {\n        value ^= u16::from(if index == 3 { 0xff } else { byte }) << 8;\n        for _ in 0..8 { value = if value & 0x8000 != 0 { (value << 1) ^ 0x1021 } else { value << 1 }; }\n    } value\n}\npub fn prepare(config: Config, generation: u32) -> Result<[u8; 16], Error> {\n    config.validate()?;\n    let mut out = [0xff; 16]; out[..3].copy_from_slice(&[b'L', b'C', 1]);\n    out[4..8].copy_from_slice(&generation.to_be_bytes());\n    out[8..10].copy_from_slice(&config.period_ms.to_be_bytes());\n    out[10..12].copy_from_slice(&config.low.to_be_bytes());\n    out[12..14].copy_from_slice(&config.high.to_be_bytes());\n    let checksum = crc(&out[..14]); out[14..].copy_from_slice(&checksum.to_be_bytes()); Ok(out)\n}\npub fn decode(slot: &[u8; 16]) -> Result<(u32, Config), Error> {\n    if slot[..3] != [b'L', b'C', 1] { return Err(Error::Header); }\n    if slot[3] != 0xa5 { return Err(Error::Uncommitted); }\n    if crc(&slot[..14]) != u16::from_be_bytes([slot[14], slot[15]]) { return Err(Error::Crc); }\n    let config = Config { period_ms: u16::from_be_bytes([slot[8], slot[9]]), low: i16::from_be_bytes([slot[10], slot[11]]), high: i16::from_be_bytes([slot[12], slot[13]]) }.validate()?;\n    Ok((u32::from_be_bytes([slot[4], slot[5], slot[6], slot[7]]), config))\n}\npub fn recover(slots: &[[u8; 16]; 2]) -> Option<(usize, u32, Config)> {\n    slots.iter().enumerate().filter_map(|(i, bytes)| decode(bytes).ok().map(|(g, c)| (i, g, c))).max_by_key(|x| x.1)\n}\npub fn next_generation(generation: u32) -> Result<u32, Error> { generation.checked_add(1).ok_or(Error::Generation) }\n#[derive(Debug, PartialEq)]\npub struct Reading { pub alarm: Option<bool>, pub healthy: bool }\npub struct Station { config: Config, alarm: bool, last_good: Option<u64>, fault: bool }\nimpl Station {\n    pub fn new(config: Config) -> Result<Self, Error> { Ok(Self { config: config.validate()?, alarm: false, last_good: None, fault: true }) }\n    pub fn sample(&mut self, now_ms: u64, value: Result<i16, Error>) -> Reading {\n        match value {\n            Ok(value) if (-4000..=12500).contains(&value) && self.last_good.is_none_or(|t| now_ms >= t) => {\n                if value >= self.config.high { self.alarm = true; }\n                else if value <= self.config.low { self.alarm = false; }\n                self.last_good = Some(now_ms); self.fault = false; Reading { alarm: Some(self.alarm), healthy: true }\n            }\n            _ => { self.fault = true; Reading { alarm: None, healthy: false } }\n        }\n    }\n    pub fn healthy(&self, now_ms: u64) -> bool {\n        !self.fault && self.last_good.and_then(|t| now_ms.checked_sub(t)).is_some_and(|age| age <= u64::from(self.config.period_ms) * 3)\n    }\n}\n#[cfg(test)] mod tests {\n    use super::*;\n    fn config() -> Config { Config { period_ms: 100, low: 2700, high: 3000 } }\n    fn committed(c: Config, g: u32) -> [u8; 16] { let mut b = prepare(c, g).unwrap(); b[3] = 0xa5; b }\n    #[test] fn every_interrupted_prefix_preserves_previous() {\n        let old = committed(config(), 7); let pending = prepare(Config { period_ms: 200, ..config() }, 8).unwrap();\n        for cut in 0..=16 {\n            let mut next = [0xff; 16]; next[..cut].copy_from_slice(&pending[..cut]);\n            assert_eq!(recover(&[old, next]).unwrap().1, 7);\n        }\n        let mut next = pending; next[3] = 0xa5; assert_eq!(recover(&[old, next]).unwrap().1, 8);\n    }\n    #[test] fn corruption_and_schema_are_rejected() {\n        let mut b = committed(config(), 1); b[9] ^= 1; assert_eq!(decode(&b), Err(Error::Crc));\n        b[2] = 2; assert_eq!(decode(&b), Err(Error::Header));\n        assert_eq!(recover(&[[0xff; 16]; 2]), None);\n    }\n    #[test] fn rejects_invalid_config_and_rollover() {\n        assert_eq!(prepare(Config { low: 3000, high: 3000, ..config() }, 1), Err(Error::Config));\n        assert_eq!(next_generation(u32::MAX), Err(Error::Generation));\n    }\n    #[test] fn hysteresis_fault_and_health_deadline() {\n        let mut s = Station::new(config()).unwrap();\n        assert_eq!(s.sample(0, Ok(3000)), Reading { alarm: Some(true), healthy: true });\n        assert_eq!(s.sample(100, Ok(2800)).alarm, Some(true));\n        assert_eq!(s.sample(200, Ok(2700)).alarm, Some(false));\n        assert!(s.healthy(500)); assert!(!s.healthy(501)); assert!(!s.healthy(1));\n        assert_eq!(s.sample(210, Err(Error::Sensor)), Reading { alarm: None, healthy: false });\n        assert!(!s.healthy(211)); assert!(s.sample(400, Ok(2500)).healthy);\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use station_controller::{Config, Error, Station, prepare, recover};\nfn main() {\n    let config = Config { period_ms: 100, low: 2700, high: 3000 };\n    let mut slots = [[0xff; 16]; 2]; slots[0] = prepare(config, 1).unwrap(); slots[0][3] = 0xa5;\n    let (_, generation, saved) = recover(&slots).unwrap();\n    let mut station = Station::new(saved).unwrap();\n    println!(\"Cấu hình generation: {generation}\");\n    println!(\"{:?}\", station.sample(0, Ok(3100)));\n    println!(\"{:?}\", station.sample(100, Err(Error::Sensor)));\n    println!(\"{:?}\", station.sample(200, Ok(2600)));\n}\n"
          },
          {
            "path": "README.md",
            "content": "# Trạm đo có phục hồi\n\nConfig: period_ms 10..60000, low < high, miền -4000..12500 centi°C. Hysteresis bật ở high, tắt ở low, giữ giữa hai ngưỡng. Lỗi cảm biến tạo alarm=None và health=false; cần mẫu tốt mới phục hồi. healthy dùng tuổi last_good tối đa ba chu kỳ, không chấp nhận clock lùi.\n\nSlot 16 byte: LC, schema 1, commit marker, generation u32 BE, period u16 BE, low/high i16 BE và CRC16. Khi tính CRC, marker được chuẩn hóa về 0xff. prepare tạo marker 0xff; ghi đủ payload/checksum rồi mới đổi thành 0xa5. recover chỉ chọn bản schema/checksum/marker/config hợp lệ. Generation tăng checked, không quay vòng.\n\nTest cắt ghi ở mọi prefix chứng minh giao thức trong RAM. Nó chưa mô phỏng lỗi bit, erase page, write granularity, cache, wear hoặc nguồn điện của chip. Adapter flash phải xóa slot không hoạt động, ghi theo alignment cho phép, chờ hoàn tất, đọc lại kiểm tra, sau đó commit theo phần cứng. Nếu chip không cho ghi marker riêng, thiết kế journal phải đổi theo đơn vị ghi thực, không ép ví dụ byte lên flash.\n\nMở rộng capstone: nối driver LearnTemp hoặc cảm biến thật theo hợp đồng đúng; gắn outbox telemetry; thêm supervisor kiểm tra heartbeat của lấy mẫu/lưu/truyền theo yêu cầu. Health mạng không nên tự buộc reset khi offline là trạng thái chấp nhận được. Lưu raw/reset reason vào log hữu hạn, tạo kịch bản phục hồi và báo cáo tài nguyên.\n\n# Tích hợp từ host sang thiết bị\n\n1. Chạy cargo test --all-targets trên máy tính. Đây là kiểm thử logic và fake, không điều khiển chân thật.\n2. Giữ crate lõi no_std và tạo crate firmware riêng cho một mã MCU/bo cụ thể. Ghi mã chip, nguồn, điện áp logic, chân bus, tốc độ bus và đường debug trong bảng cấu hình dự án.\n3. Cố định toolchain, Cargo.lock và phiên bản HAL. Kiểm tra thư viện lõi với target tương ứng; việc này chưa tạo vector khởi động hoặc linker script cho firmware.\n4. Trong startup, đưa đầu ra về mức an toàn, khởi tạo clock và bus. Chuyển bus HAL vào driver; không tạo thêm owner cho cùng peripheral. Task lấy mẫu chuyển Result thành Sample có thời điểm và trạng thái.\n5. Scheduler gọi lõi với thời gian đơn điệu, đặt deadline cho bus và chính sách queue đầy. Không retry vô hạn trong interrupt. Với DMA, chỉ chuyển buffer sang consumer khi HAL báo hoàn tất và yêu cầu cache của target được đáp ứng.\n6. Đo trên thiết bị: rút cảm biến, nghẽn đường truyền, reset và mất nguồn trong lúc lưu cấu hình. Lưu log, điều kiện nguồn và phiên bản firmware. Không kết luận host test đã chứng minh timing hay điện áp.\n\nKhông có một main.rs chung chính xác cho mọi ESP32/STM32. Phần adapter bo cần tạo từ cấu hình target của sản phẩm, còn toàn bộ hợp đồng driver, giao thức, state machine và tiêu chí thử nằm trong dự án này.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run"
        ],
        "checks": [
          "Mọi prefix ghi dở giữ cấu hình cũ, commit hoàn chỉnh chọn bản mới.",
          "Checksum hỏng, schema tương lai và ngưỡng sai bị từ chối.",
          "Lỗi cảm biến và heartbeat quá hạn báo không khỏe; mẫu tốt phục hồi.",
          "Hysteresis đúng tại hai ngưỡng và khoảng giữa."
        ]
      }
    }
  ],
  "projects": [
    {
      "id": "embedded-project-driver",
      "title": "Driver cảm biến có hợp đồng",
      "description": "Xây một driver no_std thật qua embedded-hal, xác minh mọi giao dịch bằng fake và chuẩn bị adapter bo.",
      "level": "guided",
      "estimatedHours": 8,
      "labLessonId": "embedded-driver-project",
      "requirements": [
        "Driver sở hữu bus, không tạo alias của peripheral.",
        "Tách NotReady, lỗi bus và giá trị ngoài miền.",
        "Fake kiểm tra địa chỉ, thanh ghi và thứ tự thao tác.",
        "Thay hợp đồng LearnTemp khi dùng cảm biến thật; không gán nhầm thanh ghi giả."
      ],
      "milestones": [
        {
          "title": "Hợp đồng",
          "tasks": [
            "Vẽ bảng thanh ghi và đơn vị.",
            "Xác định điểm đọc trạng thái trước payload."
          ],
          "acceptance": "Mọi byte và điều kiện lỗi đều có test tương ứng."
        },
        {
          "title": "Driver",
          "tasks": [
            "Giữ bus trong Sensor và cung cấp release.",
            "Thêm fake cho nhiệt độ âm và lỗi truyền."
          ],
          "acceptance": "cargo test chạy đủ nhánh, fake phát hiện thanh ghi sai."
        },
        {
          "title": "Adapter",
          "tasks": [
            "Kiểm tra no_std theo target.",
            "Ghi bảng chân và cách tích hợp HAL bus."
          ],
          "acceptance": "Phân biệt rõ test host, build target và phép đo chưa thực hiện."
        }
      ],
      "testCases": [
        {
          "name": "Chưa sẵn sàng",
          "setup": "status=0",
          "expected": "NotReady; không đọc payload."
        },
        {
          "name": "Mẫu âm",
          "setup": "payload=-125 big-endian",
          "expected": "Giữ -125 centi°C."
        },
        {
          "name": "Bus lỗi",
          "setup": "Giao dịch đầu trả ErrorKind::Bus",
          "expected": "Lỗi gốc đi qua Error::Bus."
        },
        {
          "name": "Ngoài miền",
          "setup": "payload=12501",
          "expected": "OutOfRange, không trả 0."
        }
      ],
      "rubric": [
        {
          "id": "embedded-driver-rubric-1",
          "title": "Hợp đồng bus",
          "criteria": [
            "Địa chỉ, Write/Read và thanh ghi có assertion.",
            "Chỉ đọc payload sau ready."
          ],
          "critical": true
        },
        {
          "id": "embedded-driver-rubric-2",
          "title": "Dữ liệu và lỗi",
          "criteria": [
            "Signed endian đúng.",
            "Không che lỗi bằng mẫu giả."
          ],
          "critical": true
        },
        {
          "id": "embedded-driver-rubric-3",
          "title": "Thiết kế crate",
          "criteria": [
            "Core no_std, bus có owner rõ.",
            "HAL adapter không lẫn logic chuyển đổi."
          ],
          "critical": false
        },
        {
          "id": "embedded-driver-rubric-4",
          "title": "Bàn giao",
          "criteria": [
            "Lệnh test tái hiện được.",
            "Có bảng host/target/hardware cùng giới hạn."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Cargo project và phiên bản dependency cố định.",
        "Bảng hợp đồng giao thức và bộ fake.",
        "Báo cáo test âm/dương.",
        "Hướng dẫn adapter bo với tiêu chí đo tín hiệu."
      ]
    },
    {
      "id": "embedded-project-telemetry",
      "title": "Thiết bị gửi telemetry khi mạng gián đoạn",
      "description": "Xây encoder/parser và hàng đợi có ACK, sau đó thêm adapter luồng byte và mô phỏng mất gói.",
      "level": "independent",
      "estimatedHours": 16,
      "labLessonId": "embedded-telemetry-project",
      "requirements": [
        "Khung có version, sequence, đơn vị và CRC được mô tả đầy đủ.",
        "Outbox có trần RAM và counter khi bỏ mẫu.",
        "Resend không đổi sequence, ACK cũ không xóa mẫu.",
        "Bổ sung adapter gom byte theo chunk và timeout cho khung dở."
      ],
      "milestones": [
        {
          "title": "Giao thức",
          "tasks": [
            "Kiểm tra test vector CRC.",
            "Test mọi vị trí cắt của khung ở adapter."
          ],
          "acceptance": "Chunk khác nhau tái tạo cùng bản tin; dữ liệu quá giới hạn bị chặn."
        },
        {
          "title": "Outbox",
          "tasks": [
            "Làm mất ACK lần đầu trong server giả.",
            "Đo queue khi consumer chậm."
          ],
          "acceptance": "Mẫu còn nguyên tới ACK; queue không vượt trần."
        },
        {
          "title": "Tích hợp",
          "tasks": [
            "Thêm session ID theo yêu cầu qua reset.",
            "Nối transport và log các lần gửi/trùng/mất."
          ],
          "acceptance": "Có báo cáo về giới hạn lưu RAM và phương án journal nếu cần."
        }
      ],
      "testCases": [
        {
          "name": "CRC sai",
          "setup": "Lật một bit payload",
          "expected": "Reject; không gửi ACK chấp nhận dữ liệu."
        },
        {
          "name": "ACK cũ",
          "setup": "ACK sequence trước front",
          "expected": "Queue giữ nguyên."
        },
        {
          "name": "Queue đầy",
          "setup": "Nạp mẫu thứ năm",
          "expected": "Full và dropped tăng, không cấp phát thêm."
        },
        {
          "name": "Sequence cạn",
          "setup": "Bắt đầu ở u32::MAX",
          "expected": "Dùng lần cuối rồi Exhausted, không quay vòng."
        }
      ],
      "rubric": [
        {
          "id": "embedded-telemetry-rubric-1",
          "title": "Giao thức",
          "criteria": [
            "Parser không panic với khung ngắn/hỏng.",
            "Version và CRC được kiểm tra trước chấp nhận."
          ],
          "critical": true
        },
        {
          "id": "embedded-telemetry-rubric-2",
          "title": "Trạng thái giao nhận",
          "criteria": [
            "ACK gắn đúng mẫu/phiên.",
            "Không mất mẫu do ACK cũ."
          ],
          "critical": true
        },
        {
          "id": "embedded-telemetry-rubric-3",
          "title": "Giới hạn tài nguyên",
          "criteria": [
            "RAM có trần và đầy queue quan sát được.",
            "Retry có deadline và khoảng nghỉ."
          ],
          "critical": false
        },
        {
          "id": "embedded-telemetry-rubric-4",
          "title": "Khả năng vận hành",
          "criteria": [
            "Fixture mất ACK và chunk dở.",
            "Báo cáo số nhận, trùng và mất."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Crate giao thức, outbox và adapter luồng.",
        "Server giả cùng kịch bản mất ACK.",
        "Bảng byte và quy tắc tương thích version.",
        "Báo cáo queue, retry và giới hạn mất nguồn."
      ]
    },
    {
      "id": "embedded-project-station",
      "title": "Trạm đo có cấu hình và phục hồi",
      "description": "Ghép driver, state machine, journal và health; hoàn thiện firmware cho một bo cụ thể và nghiệm thu có bằng chứng.",
      "level": "capstone",
      "estimatedHours": 30,
      "labLessonId": "embedded-station-project",
      "requirements": [
        "Cấu hình có validation, version và generation không quay vòng.",
        "Hysteresis và chính sách dữ liệu lỗi/quá cũ rõ ràng.",
        "Khôi phục cấu hình qua mọi điểm ghi dở trong mô hình.",
        "Thêm adapter target và báo cáo RAM, deadline, điện năng, nguồn lỗi."
      ],
      "milestones": [
        {
          "title": "Core sản phẩm",
          "tasks": [
            "Ghép lấy mẫu, alarm và health bằng sự kiện.",
            "Test ngưỡng và clock lùi."
          ],
          "acceptance": "Không dùng mẫu lỗi làm quyết định mới; mọi chuyển trạng thái được mô tả."
        },
        {
          "title": "Lưu và phục hồi",
          "tasks": [
            "Ngắt sau mọi bước prepare/write/commit.",
            "Gắn flash adapter đúng page/alignment."
          ],
          "acceptance": "Recovery chỉ chọn bản đầy đủ; báo cáo phân biệt RAM model và flash thật."
        },
        {
          "title": "Bàn giao",
          "tasks": [
            "Chạy mất cảm biến, nghẽn truyền và reset.",
            "Chuẩn bị bản firmware đã biết tốt và cách nạp lại."
          ],
          "acceptance": "Người khác tái hiện được lỗi và biết bước phục hồi tiếp theo."
        }
      ],
      "testCases": [
        {
          "name": "Ghi dở",
          "setup": "Cắt từng prefix trước commit",
          "expected": "Chọn generation cũ hợp lệ."
        },
        {
          "name": "Cấu hình sai",
          "setup": "low >= high hoặc period ngoài miền",
          "expected": "Từ chối trước sử dụng."
        },
        {
          "name": "Mẫu lỗi",
          "setup": "Error::Sensor sau mẫu tốt",
          "expected": "Alarm=None và health=false đến mẫu tốt tiếp."
        },
        {
          "name": "Deadline",
          "setup": "Không có mẫu mới quá ba chu kỳ",
          "expected": "Health không cho phép feed theo hợp đồng."
        }
      ],
      "rubric": [
        {
          "id": "embedded-station-rubric-1",
          "title": "An toàn dữ liệu",
          "criteria": [
            "Slot hỏng/chưa commit không được chọn.",
            "Cấu hình tương lai không ghi đè âm thầm."
          ],
          "critical": true
        },
        {
          "id": "embedded-station-rubric-2",
          "title": "Hành vi thiết bị",
          "criteria": [
            "Lỗi/quá cũ có trạng thái rõ.",
            "Watchdog chỉ feed khi health yêu cầu đạt."
          ],
          "critical": true
        },
        {
          "id": "embedded-station-rubric-3",
          "title": "Bằng chứng tích hợp",
          "criteria": [
            "Có phép đo timing/RAM hoặc đánh dấu chưa chạy.",
            "Giải thích ranh giới HAL, DMA và flash."
          ],
          "critical": false
        },
        {
          "id": "embedded-station-rubric-4",
          "title": "Bàn giao",
          "criteria": [
            "Fixture tái hiện lỗi và kết quả mong đợi.",
            "Quy trình build/nạp/phục hồi cho đúng bo."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Workspace core và firmware adapter của bo chọn.",
        "Bảng chân, nguồn và BOM theo thiết kế.",
        "Bộ test host, target build và ca hardware-in-the-loop.",
        "Báo cáo tài nguyên, nguồn lỗi, cập nhật và phục hồi."
      ]
    }
  ],
  "assessment": {
    "title": "Đánh giá năng lực firmware",
    "instructions": "Trả lời tình huống, hoàn thành ba dự án và đối chiếu bằng chứng host/target/phần cứng. Ghi rõ phép đo chưa thực hiện; điểm lý thuyết không thay thế thử trên thiết bị.",
    "passPercent": 80,
    "questions": [
      {
        "id": "embedded-exam-01",
        "question": "Thiết bị lấy 50 mẫu/s, đầu ra nghẽn 2 s. Queue 50 vị trí có đủ nếu không được bỏ mẫu không?",
        "options": ["Có, vì 50 bằng tần suất.", "Có nếu dùng u16.", "Không; riêng backlog đã 100 mẫu, chưa tính mẫu đang xử lý."],
        "correct": 2,
        "explanation": "Tính backlog theo tích tần suất và thời gian, sau đó thêm giới hạn RAM và chính sách đầy.",
        "lessonIds": [
          "embedded-budget-units"
        ]
      },
      {
        "id": "embedded-exam-02",
        "question": "Firmware compile đúng target nhưng cảm biến cấp 5 V vào chân chỉ hỗ trợ mức thấp hơn. Test Rust đã bảo vệ được điều gì?",
        "options": ["Tự giảm điện áp đầu vào.", "Mọi phần cứng đều được compiler kiểm tra.", "Chỉ các thuộc tính phần mềm đã kiểm tra; cần xác minh điện và sơ đồ."],
        "correct": 2,
        "explanation": "Pinout, điện áp và mạch bảo vệ là điều kiện vật lý ngoài chứng minh của kiểu.",
        "lessonIds": [
          "embedded-board-contract"
        ]
      },
      {
        "id": "embedded-exam-03",
        "question": "Một nút đổi mức 5 lần trong 8 ms; task còn phải đọc cảm biến. Thiết kế phù hợp?",
        "options": ["Ghi candidate/since rồi công bố sau thời gian ổn định.", "Tăng counter sau mọi cạnh.", "Sleep bận trong ISR 50 ms."],
        "correct": 0,
        "explanation": "State machine không chặn và chỉ phát sự kiện ổn định.",
        "lessonIds": [
          "embedded-debounce"
        ]
      },
      {
        "id": "embedded-exam-04",
        "question": "CPU giữ slice đang đọc, DMA bắt đầu ghi lại cùng vùng. Cần sửa lớp nào?",
        "options": ["Chỉ thêm volatile.", "Giao thức quyền sở hữu buffer và đồng bộ theo target.", "Chỉ đổi u8 thành u16."],
        "correct": 1,
        "explanation": "CPU và DMA phải thống nhất thời điểm chuyển quyền; volatile không giải quyết xung đột này.",
        "lessonIds": [
          "embedded-interrupt-dma"
        ]
      },
      {
        "id": "embedded-exam-05",
        "question": "Sensor báo chưa ready. Driver vẫn đọc payload và trả giá trị lần trước. Hợp đồng nào bị vi phạm?",
        "options": ["Chỉ lỗi định dạng log.", "Không phân biệt mẫu mới với trạng thái chưa có mẫu.", "Chỉ lỗi hiệu năng."],
        "correct": 1,
        "explanation": "NotReady cần được giữ, không biến dữ liệu cũ thành kết quả đo vừa hoàn tất.",
        "lessonIds": [
          "embedded-driver-project"
        ]
      },
      {
        "id": "embedded-exam-06",
        "question": "Median loại một xung nhưng cảnh báo phản ứng chậm hơn sau bước tăng thật. Điều gì cần đánh giá?",
        "options": ["Độ trễ của bộ lọc cùng sai số, theo yêu cầu điều khiển.", "Chỉ số dòng code.", "Bỏ timestamp để giảm RAM."],
        "correct": 0,
        "explanation": "Lọc có đánh đổi giữa chống nhiễu và đáp ứng; cần đo cả hai.",
        "lessonIds": [
          "embedded-calibration"
        ]
      },
      {
        "id": "embedded-exam-07",
        "question": "Task đọc mất 15 ms, rồi delay 100 ms sau mỗi lần. Tần suất có đúng 10 Hz không?",
        "options": ["Có luôn.", "Có nếu async.", "Không; chu kỳ bắt đầu khoảng 115 ms, cần lịch dựa trên mốc."],
        "correct": 2,
        "explanation": "Delay sau xử lý cộng dồn thời gian xử lý; ticker/mốc deadline giải quyết chính sách chu kỳ.",
        "lessonIds": [
          "embedded-scheduling"
        ]
      },
      {
        "id": "embedded-exam-08",
        "question": "Mẫu 10 đã được ACK, front hiện tại là 11; ACK 10 đến lại. Outbox nên làm gì?",
        "options": ["Bỏ ACK cũ và giữ 11.", "Reset sequence về 10.", "Xóa 11 vì đã có ACK."],
        "correct": 0,
        "explanation": "ACK phải gắn với bản tin hiện hành và phiên truyền, không phải tín hiệu xóa chung.",
        "lessonIds": [
          "embedded-telemetry-project"
        ]
      },
      {
        "id": "embedded-exam-09",
        "question": "Slot mới có generation cao hơn nhưng commit marker chưa ghi. Recovery chọn bản nào?",
        "options": ["Trộn header cũ và payload mới.", "Bản mới vì mới hơn.", "Bản cũ đã xác minh hợp lệ."],
        "correct": 2,
        "explanation": "Chỉ slot vượt đủ kiểm tra mới được xét generation.",
        "lessonIds": [
          "embedded-config-journal"
        ]
      },
      {
        "id": "embedded-exam-10",
        "question": "Dòng sleep CPU thấp nhưng pin vẫn hết nhanh. Bước tiếp theo hợp lý?",
        "options": ["Tăng tốc clock CPU.", "Đo toàn bo, gồm radio/LED/nguồn và xung truyền.", "Chỉ đổi allocator."],
        "correct": 1,
        "explanation": "Năng lượng là tổng mọi thành phần và pha hoạt động trong đường cấp nguồn.",
        "lessonIds": [
          "embedded-power-budget"
        ]
      },
      {
        "id": "embedded-exam-11",
        "question": "Ứng dụng confirm firmware ngay khi vào main rồi treo lúc đọc cấu hình. Cơ chế boot thử còn chứng minh đủ chưa?",
        "options": ["Chưa; confirm phải sau các kiểm tra sức khỏe bắt buộc.", "Đủ nếu có hash.", "Đủ vì main đã chạy."],
        "correct": 0,
        "explanation": "Xác nhận quá sớm làm mất cơ hội rollback khi hệ thống chưa sẵn sàng.",
        "lessonIds": [
          "embedded-firmware-update"
        ]
      },
      {
        "id": "embedded-exam-12",
        "question": "Host test journal qua mọi prefix đã xanh. Trước khi phát hành bo thật còn cần gì?",
        "options": ["Không cần thêm bằng chứng.", "Xác minh write granularity, erase, nguồn và phục hồi trên target.", "Chỉ chụp màn hình test."],
        "correct": 1,
        "explanation": "RAM model không mô phỏng vật lý flash, nên cần adapter và phép thử phù hợp thiết bị.",
        "lessonIds": [
          "embedded-station-project"
        ]
      }
    ],
    "skills": [
      {
        "id": "embedded-skill-1",
        "title": "Nền tảng và hợp đồng phần cứng",
        "description": "Phân biệt core, firmware và adapter bo. Lập ngân sách RAM và cấu hình có đơn vị.",
        "lessonIds": [
          "embedded-no-std",
          "embedded-budget-units",
          "embedded-board-contract"
        ],
        "projectIds": [
          "embedded-project-driver"
        ],
        "required": true
      },
      {
        "id": "embedded-skill-2",
        "title": "Tín hiệu, ngắt và quyền sở hữu",
        "description": "Lọc nút bằng state machine. Giải thích thời điểm CPU được đọc buffer DMA.",
        "lessonIds": [
          "embedded-gpio",
          "embedded-debounce",
          "embedded-interrupt-dma"
        ],
        "projectIds": [
          "embedded-project-driver"
        ],
        "required": true
      },
      {
        "id": "embedded-skill-3",
        "title": "Driver và chất lượng phép đo",
        "description": "Viết driver embedded-hal với fake bus. Phân biệt lỗi bus, miền giá trị và mẫu quá cũ.",
        "lessonIds": [
          "embedded-sensors",
          "embedded-driver-project",
          "embedded-calibration"
        ],
        "projectIds": [
          "embedded-project-telemetry"
        ],
        "required": true
      },
      {
        "id": "embedded-skill-4",
        "title": "Lập lịch và telemetry",
        "description": "Chọn chính sách deadline và queue đầy. Đóng khung, kiểm tra CRC và xử lý ACK.",
        "lessonIds": [
          "embedded-async",
          "embedded-scheduling",
          "embedded-telemetry-project"
        ],
        "projectIds": [
          "embedded-project-telemetry"
        ],
        "required": true
      },
      {
        "id": "embedded-skill-5",
        "title": "Bộ nhớ, cấu hình và năng lượng",
        "description": "Khôi phục slot cấu hình đã commit. Đối chiếu ngân sách năng lượng với phép đo.",
        "lessonIds": [
          "embedded-memory",
          "embedded-config-journal",
          "embedded-power-budget"
        ],
        "projectIds": [
          "embedded-project-station"
        ],
        "required": true
      },
      {
        "id": "embedded-skill-6",
        "title": "Độ tin cậy và dự án tổng hợp",
        "description": "Thiết kế boot thử và health có ý nghĩa. Bàn giao báo cáo host, target và hardware test.",
        "lessonIds": [
          "embedded-reliability",
          "embedded-firmware-update",
          "embedded-station-project"
        ],
        "projectIds": [
          "embedded-project-station"
        ],
        "required": true
      }
    ]
  }
};
