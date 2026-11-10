import type { SpecializationBundle } from "../specialization-types";

export const embeddedBundle: SpecializationBundle = {
  "track": {
    "id": "embedded",
    "title": "Nhúng và IoT",
    "shortTitle": "Nhúng & IoT",
    "description": "Viết firmware cho ESP32, STM32; đọc cảm biến, điều khiển thiết bị và quản lý tài nguyên với no_std, esp-hal và Embassy.",
    "outcome": "Xây một thiết bị ghi nhiệt độ có logic kiểm thử được, hàng đợi giới hạn, báo lỗi rõ ràng và quy trình nạp, đo, phục hồi firmware.",
    "prerequisites": [
      "Ownership, borrowing và trait",
      "Slice, enum, Result và kiểm thử",
      "Async/await và đồng thời cơ bản",
      "Đọc số nhị phân, bit và đơn vị điện áp",
      "Biết tra sơ đồ chân, datasheet và thông số của bo mạch"
    ],
    "technologies": [
      "no_std",
      "esp-hal",
      "Embassy",
      "embedded-hal",
      "ESP32",
      "STM32"
    ],
    "color": "green",
    "lessonIds": [
      "embedded-no-std",
      "embedded-gpio",
      "embedded-sensors",
      "embedded-async",
      "embedded-memory",
      "embedded-reliability"
    ],
    "capstone": {
      "title": "Trạm đo nhiệt độ có khả năng phục hồi",
      "description": "Chọn ESP32-C3 hoặc một bo STM32 được Embassy hỗ trợ. Thiết bị lấy mẫu cảm biến, lọc và lưu một cửa sổ dữ liệu hữu hạn, cung cấp trạng thái qua UART hoặc mạng theo phần cứng đã chọn.",
      "milestones": [
        {
          "title": "Chọn phần cứng và dựng bản build",
          "tasks": [
            "Ghi chính xác mã MCU, bo mạch, cảm biến, điện áp, chân kết nối và phương thức debug trong README.",
            "Với ESP32-C3, tạo dự án bằng esp-generate cho esp32c3; với STM32 dùng ví dụ Embassy đúng chip rồi cố định phiên bản hoặc commit.",
            "Lưu Cargo.lock, rust-toolchain.toml và các file target/linker cần thiết; xác nhận build trước khi thêm cảm biến."
          ],
          "acceptance": "Người khác tạo được cùng binary từ source; README chỉ rõ cách chọn cổng hoặc probe, phiên bản công cụ và target."
        },
        {
          "title": "Driver và mô hình dữ liệu",
          "tasks": [
            "Tách driver giao tiếp bus khỏi phép đổi đơn vị và kiểm tra miền hợp lệ.",
            "Viết fake bus kiểm tra địa chỉ, thanh ghi, thứ tự byte và lỗi truyền; mô tả chu kỳ chuyển đổi từ datasheet.",
            "Định nghĩa mẫu đo có số thứ tự, timestamp, giá trị và trạng thái lỗi, không dùng giá trị 0 để che lỗi."
          ],
          "acceptance": "Host tests bao phủ số âm, dữ liệu ngắn, lỗi bus và giá trị ngoài miền; phần cứng đọc được giá trị đối chiếu với điều kiện thử."
        },
        {
          "title": "Lập lịch và giới hạn tài nguyên",
          "tasks": [
            "Tách tác vụ lấy mẫu, xử lý và xuất kết quả; không giữ khóa qua I/O dài nếu không có lý do.",
            "Chọn kích thước queue từ tần suất lấy mẫu và thời gian consumer có thể dừng; quy định bỏ mới, bỏ cũ hay giảm tần suất.",
            "Ghi số mẫu mất và thời gian xử lý; đo thời gian đáp ứng nút bấm khi consumer chậm."
          ],
          "acceptance": "Khi đầu ra bị nghẽn, RAM vẫn hữu hạn và queue overflow có thể quan sát; nút bấm và tác vụ giám sát vẫn đáp ứng trong thời hạn đặt ra."
        },
        {
          "title": "Nguồn điện và phục hồi",
          "tasks": [
            "Thêm kiểm tra độ mới của heartbeat trước khi feed watchdog; lưu và hiển thị nguyên nhân reset nếu phần cứng hỗ trợ.",
            "Thiết kế lưu cấu hình có version, kiểm tra tính toàn vẹn và ít nhất một bản hợp lệ khi ghi gián đoạn.",
            "Đo dòng ở các chế độ lấy mẫu, truyền dữ liệu và chờ; tách ảnh hưởng LED hoặc USB debugger khỏi phép đo."
          ],
          "acceptance": "Giả lập cảm biến ngắt kết nối và bản cấu hình ghi dở vẫn có trạng thái chẩn đoán, không chấp nhận cấu hình hỏng hoặc reset vô hạn không rõ nguyên nhân."
        },
        {
          "title": "Bàn giao và kiểm thử dài hạn",
          "tasks": [
            "Chạy thử đủ dài để kiểm tra deadline, reconnect và bộ đếm; kiểm thử bằng clock giả cho tình huống rollover không thể chờ thực tế.",
            "Tạo bảng ca thử host, target build và hardware-in-the-loop; lưu log, môi trường và kết quả.",
            "Giải thích ranh giới bootloader, ứng dụng, xác minh chữ ký và rollback nếu sản phẩm cần cập nhật qua mạng."
          ],
          "acceptance": "Có hướng dẫn nạp lại, chẩn đoán, dữ liệu đo và tiêu chí đạt; báo cáo phân biệt rõ test đã chạy với test cần phần cứng khác."
        }
      ],
      "deliverables": [
        "Cargo workspace: thư viện logic và firmware theo target",
        "Sơ đồ kết nối tham chiếu datasheet, bảng chân và danh sách phần cứng",
        "Host tests, fake bus và ca kiểm thử trên thiết bị",
        "Báo cáo RAM/flash, thời gian đáp ứng và mức tiêu thụ điện có điều kiện đo",
        "README build, nạp, debug và phục hồi cấu hình"
      ],
      "reviewQuestions": [
        "Vì sao no_std không đồng nghĩa với tuyệt đối không dùng heap?",
        "Một peripheral đã chuyển vào driver có thể được task khác dùng bằng cách nào?",
        "Nếu consumer chậm 5 giây, bạn cần queue bao nhiêu phần tử và chọn chính sách mất mẫu nào?",
        "Một async task không await có thể ảnh hưởng hệ thống ra sao?",
        "CRC và chữ ký firmware bảo vệ những thuộc tính khác nhau nào?"
      ]
    },
    "resources": [
      {
        "label": "The Embedded Rust Book",
        "url": "https://docs.rust-embedded.org/book/"
      },
      {
        "label": "The Rust on ESP Book",
        "url": "https://docs.espressif.com/projects/rust/book/"
      },
      {
        "label": "esp-hal 1.1: ESP32-C3",
        "url": "https://docs.espressif.com/projects/rust/esp-hal/1.1.0/esp32c3/esp_hal/index.html"
      },
      {
        "label": "Embassy Book",
        "url": "https://embassy.dev/book/"
      },
      {
        "label": "embedded-hal 1.0",
        "url": "https://docs.rs/embedded-hal/1.0.0/embedded_hal/"
      },
      {
        "label": "heapless: hàng đợi SPSC",
        "url": "https://docs.rs/heapless/0.9.3/heapless/spsc/index.html"
      }
    ]
  },
  "lessons": [
    {
      "id": "embedded-no-std",
      "moduleId": "track-embedded",
      "title": "no_std: phần mềm bắt đầu từ bo mạch",
      "description": "Chọn target, tách logic khỏi phần cứng và xây thư viện lõi không phụ thuộc hệ điều hành.",
      "duration": 50,
      "objectives": [
        "Phân biệt firmware bare metal với ứng dụng Linux nhúng",
        "Giải thích core, alloc, startup và panic handler",
        "Chọn target theo đúng MCU thay vì tên thương mại chung",
        "Kiểm thử phép đổi đơn vị mà không cần bo mạch"
      ],
      "sections": [
        {
          "title": "Đọc phần cứng trước khi chọn crate",
          "text": "“ESP32” hay “STM32” là tên một họ thiết bị, chưa đủ để chọn target. Hãy ghi mã MCU, kiến trúc CPU, dung lượng RAM/flash, nguồn clock và đường nạp/debug. Một bo ESP32-C3 dùng RISC-V có thiết lập khác bo ESP32 dùng Xtensa; hai bo cùng chip còn có thể nối LED hoặc USB khác nhau. Datasheet của chip và sơ đồ của bo trả lời các câu hỏi khác nhau.\n\nBắt đầu bằng một bảng phần cứng nhỏ: tín hiệu cần đọc, điện áp cho phép, chân nào đã được dùng và tần suất xử lý. Đây là đầu vào của thiết kế phần mềm. Nếu ứng dụng chạy Linux trên một máy tính nhúng, std thường vẫn phù hợp. Không cần chuyển sang bare metal chỉ vì thiết bị được gọi là IoT."
        },
        {
          "title": "no_std bỏ giả định về hệ điều hành",
          "text": "Thuộc tính #![no_std] khiến crate không tự liên kết std; các kiểu cơ bản, slice, Option, Result và nhiều iterator vẫn có trong core. Những API như tệp hệ điều hành, thread của hệ điều hành hoặc println! không tự xuất hiện. alloc có thể cung cấp Vec và String khi ứng dụng cấu hình allocator phù hợp; vì thế no_std không phải một cam kết không cấp phát.\n\nFirmware còn cần mã khởi động, vector ngắt, bố trí bộ nhớ và cách xử lý panic. HAL, runtime và mẫu dự án hỗ trợ các phần này; chúng không phải trách nhiệm của thư viện tính toán cảm biến. Phân biệt lỗi biên dịch Rust, lỗi liên kết bộ nhớ và lỗi kết nối thiết bị để không chữa sai lớp vấn đề."
        },
        {
          "title": "Tách một lõi chạy được trên host",
          "text": "Một phép chuyển ADC sang millivolt chỉ cần số nguyên và hợp đồng đầu vào. Đặt nó trong crate thư viện no_std; chương trình firmware chịu trách nhiệm lấy ADC, còn test trên máy tính cung cấp các giá trị mẫu. Cùng một hàm được dùng ở hai môi trường, giúp phát hiện sai công thức trước khi phải nối thiết bị.\n\nChọn đơn vị ngay trong tên hàm và trường dữ liệu. Dùng u32 cho tích hai số u16 để không tràn trước khi chia. Phép làm tròn phải được mô tả rõ, bởi 1 mV khác biệt có thể làm một kiểm thử biên thất bại. Không mặc định điện áp tham chiếu luôn là 3,3 V: đó là tham số hoặc số đo hiệu chuẩn của phần cứng.",
          "code": "#![no_std]\n\npub fn adc_mv(raw: u16, reference_mv: u16, max_raw: u16) -> Option<u32> {\n    if max_raw == 0 || raw > max_raw { return None; }\n    let numerator = u32::from(raw) * u32::from(reference_mv);\n    Some((numerator + u32::from(max_raw) / 2) / u32::from(max_raw))\n}"
        },
        {
          "title": "Build đúng target rồi mới nạp",
          "text": "cargo test trên máy tính chứng minh một phần logic, không chứng minh firmware đã liên kết hoặc chạy được trên MCU. Thêm bước cargo check/build cho target và kiểm tra báo cáo kích thước trước khi nạp. Mã truy cập bus, thứ tự khởi tạo clock và ngắt vẫn phải kiểm chứng trên thiết bị hoặc hệ thống mô phỏng có hỗ trợ tương ứng.\n\nVới ESP32-C3, dùng quy trình esp-generate của Espressif để tạo bộ cấu hình đồng bộ; ghi phiên bản generator và giữ Cargo.lock sau lần build thành công. Với STM32, chọn ví dụ Embassy đúng MCU và bo. Đừng ghép ngẫu nhiên Cargo.toml từ bài viết cũ với main.rs từ tài liệu mới, vì cấu hình target và API HAL có thể đã thay đổi."
        }
      ],
      "illustration": {
        "src": "/images/lessons/embedded-workbench.webp",
        "alt": "Minh họa bo vi điều khiển kết nối cảm biến trên breadboard, laptop và màn hình biểu đồ.",
        "caption": "Từ tín hiệu cảm biến đến dữ liệu: firmware đọc, xử lý rồi chuyển kết quả cho giao diện hiển thị."
      },
      "tip": "Giữ logic đổi đơn vị và quyết định nghiệp vụ trong một crate no_std nhỏ, còn driver và startup nằm ở crate firmware.",
      "quiz": {
        "question": "Một crate có #![no_std] có thể dùng Vec trong mọi firmware ngay lập tức không?",
        "options": [
          "Có, Vec nằm trong core.",
          "Không; muốn dùng Vec thường cần alloc và allocator phù hợp do môi trường cung cấp.",
          "Không, Rust cấm mọi kiểu dữ liệu động trên MCU.",
          "Có, cargo tự tạo heap từ phần RAM còn trống."
        ],
        "correct": 1,
        "explanation": "no_std chỉ bỏ liên kết std tự động. alloc và một allocator có thể cung cấp cấp phát động, nhưng môi trường phải thiết lập và kiểm soát tài nguyên đó."
      },
      "reference": {
        "label": "The Embedded Rust Book: no_std",
        "url": "https://docs.rust-embedded.org/book/intro/no-std.html"
      },
      "exercise": {
        "title": "Chuyển ADC sang millivolt",
        "instructions": "Đổi raw theo điện áp tham chiếu, làm tròn đến millivolt gần nhất và từ chối miền ADC không hợp lệ.",
        "requirements": [
          "max_raw bằng 0 hoặc raw lớn hơn max_raw trả None.",
          "Thực hiện phép nhân trong u32; không nhân hai u16 trước khi ép kiểu.",
          "Làm tròn bằng cách cộng nửa mẫu số trước khi chia."
        ]
      },
      "starterCode": "fn adc_mv(raw: u16, reference_mv: u16, max_raw: u16) -> Option<u32> {\n    todo!()\n}\nfn main() {\n    assert_eq!(adc_mv(0, 3300, 4095), Some(0));\n    assert_eq!(adc_mv(4095, 3300, 4095), Some(3300));\n    assert_eq!(adc_mv(2048, 3300, 4095), Some(1650));\n    assert_eq!(adc_mv(4096, 3300, 4095), None);\n    assert_eq!(adc_mv(0, 3300, 0), None);\n    assert_eq!(adc_mv(u16::MAX, u16::MAX, u16::MAX), Some(65535));\n    println!(\"ADC giữa thang: {} mV\", adc_mv(2048, 3300, 4095).unwrap());\n}",
      "solutionCode": "fn adc_mv(raw: u16, reference_mv: u16, max_raw: u16) -> Option<u32> {\n    if max_raw == 0 || raw > max_raw { return None; }\n    let numerator = u32::from(raw) * u32::from(reference_mv);\n    Some((numerator + u32::from(max_raw) / 2) / u32::from(max_raw))\n}\nfn main() {\n    assert_eq!(adc_mv(0, 3300, 4095), Some(0));\n    assert_eq!(adc_mv(4095, 3300, 4095), Some(3300));\n    assert_eq!(adc_mv(2048, 3300, 4095), Some(1650));\n    assert_eq!(adc_mv(4096, 3300, 4095), None);\n    assert_eq!(adc_mv(0, 3300, 0), None);\n    assert_eq!(adc_mv(u16::MAX, u16::MAX, u16::MAX), Some(65535));\n    println!(\"ADC giữa thang: {} mV\", adc_mv(2048, 3300, 4095).unwrap());\n}",
      "expectedOutput": "ADC giữa thang: 1650 mV",
      "hints": [
        "Kiểm tra mẫu số trước phép chia.",
        "Chuyển từng toán hạng sang u32 trước khi nhân."
      ],
      "localLab": {
        "title": "Thư viện hiệu chuẩn no_std",
        "instructions": "Tạo hai file dưới đây trong một thư mục mới. Test chạy trên host; lệnh check thứ hai kiểm tra thư viện cho target RISC-V của ESP32-C3, chưa tạo firmware khởi động.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"sensor-core\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[lib]\npath = \"src/lib.rs\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "#![no_std]\n\npub fn adc_mv(raw: u16, reference_mv: u16, max_raw: u16) -> Option<u32> {\n    if max_raw == 0 || raw > max_raw { return None; }\n    let numerator = u32::from(raw) * u32::from(reference_mv);\n    Some((numerator + u32::from(max_raw) / 2) / u32::from(max_raw))\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn endpoints_and_invalid_range() {\n        assert_eq!(adc_mv(0, 3300, 4095), Some(0));\n        assert_eq!(adc_mv(4095, 3300, 4095), Some(3300));\n        assert_eq!(adc_mv(4096, 3300, 4095), None);\n        assert_eq!(adc_mv(0, 3300, 0), None);\n    }\n    #[test]\n    fn rounding_and_wide_product() {\n        assert_eq!(adc_mv(2048, 3300, 4095), Some(1650));\n        assert_eq!(adc_mv(65535, 65535, 65535), Some(65535));\n    }\n}\n"
          }
        ],
        "commands": [
          "cargo test",
          "rustup target add riscv32imc-unknown-none-elf",
          "cargo check --target riscv32imc-unknown-none-elf"
        ],
        "checks": [
          "Hai test host đều đạt.",
          "Target check không yêu cầu std hoặc allocator.",
          "Giải thích được vì sao thư viện chưa cần panic handler nhưng binary firmware cần một cách xử lý panic."
        ]
      }
    },
    {
      "id": "embedded-gpio",
      "moduleId": "track-embedded",
      "title": "GPIO, quyền sở hữu peripheral và chống dội nút",
      "description": "Mô hình hóa tín hiệu, cấu hình chân và xử lý nút bấm bằng state machine có thể kiểm thử.",
      "duration": 50,
      "objectives": [
        "Phân biệt PAC, HAL, driver và ứng dụng",
        "Giải thích peripheral singleton và việc chuyển ownership",
        "Hiểu active-low, pull-up và giới hạn phần mềm",
        "Viết bộ chống dội bằng trạng thái và số mẫu liên tiếp"
      ],
      "sections": [
        {
          "title": "Mỗi lớp giải quyết một loại chi tiết",
          "text": "PAC cung cấp truy cập thanh ghi theo mô tả của chip. HAL xây API quanh clock, GPIO và ngoại vi; driver cảm biến dùng các thao tác bus; ứng dụng quyết định lúc nào cần đo hoặc bật đèn. Giữ các lớp này tách biệt giúp đổi bo mạch mà không viết lại quy tắc cảnh báo nhiệt độ. Không phải driver nào cũng cần biết tên GPIO cụ thể.\n\nMột chân có thể đóng vai input, output hoặc chức năng ngoại vi. Typestate và ownership giúp API ngăn nhiều cách cấu hình sai, nhưng compiler không đọc được dây nối ngoài đời. Phải đối chiếu điện áp, chức năng multiplex và sơ đồ bo. set_high thành công thể hiện thao tác phần mềm được chấp nhận, không chứng minh đèn vật lý đã sáng."
        },
        {
          "title": "Peripheral là tài nguyên có một chủ",
          "text": "esp-hal trả các handle peripheral khi khởi tạo. Đưa một handle GPIO vào Output chuyển quyền sử dụng chân cho driver. Nếu cố tạo hai driver cùng sở hữu một handle, compiler giúp phát hiện xung đột. Với nhu cầu thay đổi driver theo giai đoạn, dùng cơ chế reborrow/lifetime của HAL thay vì tự tạo bản sao bằng unsafe.\n\nCách phân chia quyền sở hữu ảnh hưởng kiến trúc task: một task có thể sở hữu chân LED và nhận lệnh qua channel. Task khác không cần giữ cùng driver chỉ để yêu cầu nhấp nháy. Điều này làm rõ ai thay đổi trạng thái và xử lý lỗi ở đâu; một Mutex chung quanh mọi peripheral thường che giấu sự phụ thuộc hơn là giải quyết nó.",
          "code": "// Đoạn dùng trong dự án esp-hal 1.1, đã khởi tạo peripherals.\nlet status_pin = peripherals.GPIO4;\nlet mut status = esp_hal::gpio::Output::new(\n    status_pin,\n    esp_hal::gpio::Level::Low,\n    esp_hal::gpio::OutputConfig::default(),\n);\nstatus.set_high();"
        },
        {
          "title": "Đọc mức điện khác với đọc hành động",
          "text": "Một nút active-low có thể ở mức cao khi thả và thấp khi nhấn, tùy điện trở kéo và cách đấu. Chuyển mức vật lý thành một bool có nghĩa như pressed ở lớp biên. Nếu toàn ứng dụng dùng tên high để chỉ nhấn, việc đổi mạch sẽ tạo lỗi khó tìm. Giá trị input thả nổi cũng không phải nguồn ngẫu nhiên đáng tin cậy.\n\nTiếp điểm cơ học thường tạo nhiều lần chuyển mức trong một thao tác. Bộ chống dội cần một chính sách: chấp nhận sau thời gian ổn định, hay sau N mẫu liên tiếp với chu kỳ đã xác định. N mẫu không tương đương N mili giây nếu lịch lấy mẫu thay đổi. Viết lại chính sách này thành state machine giúp thử cả chuỗi dội ngắn lẫn trạng thái giữ lâu."
        },
        {
          "title": "Chỉ phát sự kiện khi trạng thái đã đổi",
          "text": "Bộ chống dội trong bài giữ stable, candidate và số mẫu liên tiếp của candidate. Mẫu giống stable hủy ứng viên chưa đủ ổn định; mẫu mới khác candidate khởi động lại bộ đếm. Chỉ khi đủ ngưỡng mới đổi stable và phát một sự kiện. Giữ nút không được phát sự kiện nhấn lặp lại ở mỗi lần lấy mẫu.\n\nSau khi host tests đạt, kiểm tra trên bo bằng log có timestamp hoặc logic analyzer. Thử nhấn nhanh, giữ, thả và rung tiếp điểm; quan sát độ trễ từ tín hiệu đến sự kiện. Nếu chuyển sang ngắt cạnh, vẫn cần chống dội và giới hạn tốc độ sự kiện. Ngắt giúp tránh thăm dò liên tục, không tự biến tín hiệu nhiễu thành một thao tác duy nhất."
        }
      ],
      "tip": "Đổi “mức chân” thành “nút đang nhấn” ở một chỗ; giữ logic chống dội độc lập với loại GPIO.",
      "quiz": {
        "question": "Bộ chống dội chờ 3 mẫu liên tiếp. Có thể kết luận độ trễ là 3 ms không?",
        "options": [
          "Có, mỗi lần đọc GPIO luôn mất 1 ms.",
          "Có, Rust bảo đảm chu kỳ lấy mẫu.",
          "Chưa thể; cần biết chu kỳ lấy mẫu và thời điểm thay đổi tín hiệu.",
          "Không, chống dội luôn phải dùng ngắt."
        ],
        "correct": 2,
        "explanation": "Số mẫu là điều kiện logic. Thời gian thực tế phụ thuộc lịch lấy mẫu, độ trễ task và vị trí cạnh tín hiệu so với lần lấy mẫu."
      },
      "reference": {
        "label": "esp-hal: peripheral singletons và GPIO",
        "url": "https://docs.espressif.com/projects/rust/esp-hal/1.1.0/esp32c3/esp_hal/index.html"
      },
      "exercise": {
        "title": "Chống dội bằng mẫu liên tiếp",
        "instructions": "Hoàn thiện sample để phát sự kiện khi tín hiệu đã khác trạng thái ổn định đủ required mẫu.",
        "requirements": [
          "Chỉ phát một Some cho mỗi lần đổi trạng thái ổn định.",
          "Mẫu quay về stable xóa chuỗi candidate đang đợi.",
          "required bằng 0 được chuẩn hóa thành 1; bộ đếm không tràn."
        ]
      },
      "starterCode": "struct Debouncer { stable: bool, candidate: bool, count: u8, required: u8 }\nimpl Debouncer {\n    fn new(required: u8) -> Self {\n        Self { stable: false, candidate: false, count: 0, required: required.max(1) }\n    }\n    fn sample(&mut self, pressed: bool) -> Option<bool> { todo!() }\n}\nfn main() {\n    let mut button = Debouncer::new(3);\n    let input = [true, false, true, true, true, true, false, true, false, false, false];\n    let events: Vec<bool> = input.into_iter().filter_map(|x| button.sample(x)).collect();\n    assert_eq!(events, vec![true, false]);\n    assert_eq!(button.sample(false), None);\n    assert_eq!(Debouncer::new(0).sample(true), Some(true));\n    println!(\"Sự kiện: nhấn, thả\");\n}",
      "solutionCode": "struct Debouncer { stable: bool, candidate: bool, count: u8, required: u8 }\nimpl Debouncer {\n    fn new(required: u8) -> Self {\n        Self { stable: false, candidate: false, count: 0, required: required.max(1) }\n    }\n    fn sample(&mut self, pressed: bool) -> Option<bool> {\n        if pressed == self.stable { self.count = 0; self.candidate = pressed; return None; }\n        if pressed != self.candidate { self.candidate = pressed; self.count = 1; }\n        else { self.count = self.count.saturating_add(1); }\n        if self.count >= self.required {\n            self.stable = pressed;\n            self.count = 0;\n            return Some(pressed);\n        }\n        None\n    }\n}\nfn main() {\n    let mut button = Debouncer::new(3);\n    let input = [true, false, true, true, true, true, false, true, false, false, false];\n    let events: Vec<bool> = input.into_iter().filter_map(|x| button.sample(x)).collect();\n    assert_eq!(events, vec![true, false]);\n    assert_eq!(button.sample(false), None);\n    assert_eq!(Debouncer::new(0).sample(true), Some(true));\n    println!(\"Sự kiện: nhấn, thả\");\n}",
      "expectedOutput": "Sự kiện: nhấn, thả",
      "hints": [
        "Xử lý nhánh pressed == stable trước.",
        "Bắt đầu count = 1 khi xuất hiện candidate mới; dùng saturating_add cho cùng candidate."
      ]
    },
    {
      "id": "embedded-sensors",
      "moduleId": "track-embedded",
      "title": "Driver cảm biến: bus, dữ liệu và lỗi",
      "description": "Đọc thanh ghi có giao thức rõ ràng, giải mã số có dấu và giữ nguyên lỗi truyền thông.",
      "duration": 60,
      "objectives": [
        "Dùng trait I2c của embedded-hal để tách driver khỏi MCU",
        "Phân biệt địa chỉ bus với địa chỉ thanh ghi",
        "Giải mã byte theo hợp đồng và kiểm tra dữ liệu thiếu",
        "Kiểm thử thao tác bus bằng thiết bị giả"
      ],
      "sections": [
        {
          "title": "Datasheet là hợp đồng của driver",
          "text": "Một cảm biến có thể cần ghi lệnh, đợi chuyển đổi rồi đọc nhiều byte. Địa chỉ I2C, thanh ghi, thứ tự byte, độ dài và công thức đổi đơn vị phải được ghi thành hợp đồng trước khi viết mã. Đừng nhầm địa chỉ 7 bit với byte địa chỉ đã chứa bit đọc/ghi mà tài liệu của một số thiết bị trình bày.\n\nTốc độ bus không phải tốc độ có mẫu mới. Đọc nhanh hơn chu kỳ chuyển đổi có thể trả lại cùng dữ liệu hoặc trạng thái chưa sẵn sàng. Với SPI còn phải xác định mode, tốc độ, cách điều khiển chip-select và thứ tự giao dịch. Một lệnh không báo lỗi điện không bảo đảm bạn vừa đọc đúng thanh ghi có nghĩa."
        },
        {
          "title": "Driver generic sở hữu quyền truy cập bus",
          "text": "Trait I2c của embedded-hal 1.0 cho driver mô tả giao dịch mà không gắn với ESP32 hoặc STM32. Driver nhận và giữ một đối tượng bus; đối tượng đó có thể là peripheral độc quyền, tham chiếu mutable hoặc adapter chia sẻ bus. Quy tắc khóa và chia sẻ nằm ở tầng cung cấp bus.\n\nwrite_read thường thể hiện việc ghi địa chỉ thanh ghi rồi đọc phản hồi trong một giao dịch. Tách thành write rồi read có thể khác về stop/repeated-start, nên kiểm tra yêu cầu thiết bị. Giữ kiểu lỗi bus trong Result để caller quyết định thử lại, báo mất cảm biến hay chuyển chế độ. Trả nhiệt độ 0 khi NACK làm người dùng hiểu lỗi giao tiếp thành phép đo hợp lệ.",
          "code": "use embedded_hal::i2c::I2c;\n\npub struct RegisterSensor<B> { bus: B, address: u8 }\nimpl<B: I2c> RegisterSensor<B> {\n    pub fn read_raw(&mut self) -> Result<i16, B::Error> {\n        let mut bytes = [0; 2];\n        self.bus.write_read(self.address, &[0x10], &mut bytes)?;\n        Ok(i16::from_be_bytes(bytes))\n    }\n}"
        },
        {
          "title": "Byte không tự mang đơn vị và ý nghĩa",
          "text": "Hai byte 0xFF, 0x9C có thể biểu diễn -100 theo số i16 big-endian; nếu đọc thành u16 bạn sẽ có một giá trị rất khác. Hàm from_be_bytes hoặc from_le_bytes thể hiện quyết định đó rõ hơn ép con trỏ sang một struct. Kiểm tra độ dài trước truy cập và kiểm tra miền vật lý sau giải mã.\n\nBài tập dùng một giao thức mẫu do khóa học định nghĩa: ID, nhiệt độ centi-degree có dấu big-endian, sequence và XOR kiểm tra bốn byte trước. Nó giúp luyện ranh giới parser; không thay thế giao thức của một cảm biến cụ thể. XOR hoặc CRC chỉ hỗ trợ phát hiện một số lỗi dữ liệu, không chứng minh nguồn gửi hợp lệ và không bảo vệ chống sửa dữ liệu có chủ đích."
        },
        {
          "title": "Kiểm thử bus và thiết bị thật bổ sung nhau",
          "text": "Fake bus có thể kiểm tra driver gửi đúng địa chỉ và đúng thứ tự write/read, trả các mẫu âm, hoặc cố ý trả lỗi. Nó chạy nhanh và ổn định trên máy tính, nhưng không mô phỏng điện trở kéo, cạnh xung, clock stretching hay chất lượng nguồn. Do đó sau test host phải có phép đo trên thiết bị thật.\n\nĐặt timeout và số lần thử lại hữu hạn theo yêu cầu ứng dụng. Ghi loại lỗi cùng số lần mất mẫu thay vì in một log ở mọi vòng lặp làm nghẽn UART. Khi cần chia sẻ bus giữa nhiều sensor, kiểm thử cả trạng thái một thiết bị lỗi: nó không nên làm tác vụ còn lại bị khóa vô hạn. Phân biệt mẫu mới, mẫu cũ còn dùng được và cảm biến không khả dụng."
        }
      ],
      "tip": "Viết phép giải mã thành hàm thuần và để driver trả nguyên lỗi bus; cả hai lớp đều cần test riêng.",
      "quiz": {
        "question": "Driver gặp NACK. Trả Ok(0) để tiếp tục vòng đo có vấn đề gì?",
        "options": [
          "Không có vấn đề vì 0 luôn là giá trị ngoài miền cảm biến.",
          "Caller không còn phân biệt lỗi bus với một phép đo bằng 0.",
          "Rust tự biến Ok(0) lại thành Err.",
          "NACK luôn có nghĩa thanh ghi trả giá trị 0."
        ],
        "correct": 1,
        "explanation": "Chuyển lỗi thành dữ liệu hợp lệ làm mất thông tin. Dùng Result và để chính sách ứng dụng quyết định retry, stale data hoặc trạng thái unavailable."
      },
      "reference": {
        "label": "embedded-hal 1.0: I2C và bus sharing",
        "url": "https://docs.rs/embedded-hal/1.0.0/embedded_hal/i2c/index.html"
      },
      "exercise": {
        "title": "Giải mã gói đo 5 byte",
        "instructions": "Kiểm tra chiều dài, checksum XOR, nhiệt độ trong miền -40 đến 125 °C rồi trả ID, centi-degree và sequence.",
        "requirements": [
          "Frame phải đúng 5 byte; lỗi length được xét trước checksum.",
          "Nhiệt độ là i16 big-endian, đơn vị 0,01 °C.",
          "Chỉ nhận nhiệt độ từ -4000 đến 12500 centi-degree, gồm hai đầu."
        ]
      },
      "starterCode": "fn decode(frame: &[u8]) -> Result<(u8, i16, u8), &'static str> {\n    todo!()\n}\nfn packet(id: u8, value: i16, sequence: u8) -> [u8; 5] {\n    let [high, low] = value.to_be_bytes();\n    [id, high, low, sequence, id ^ high ^ low ^ sequence]\n}\nfn main() {\n    assert_eq!(decode(&packet(7, 2500, 4)), Ok((7, 2500, 4)));\n    assert_eq!(decode(&packet(7, -100, 5)), Ok((7, -100, 5)));\n    assert_eq!(decode(&packet(7, -4000, 1)), Ok((7, -4000, 1)));\n    assert_eq!(decode(&packet(7, 12501, 1)), Err(\"range\"));\n    assert_eq!(decode(&[1, 2]), Err(\"length\"));\n    let mut bad = packet(7, 2500, 4); bad[4] ^= 1;\n    assert_eq!(decode(&bad), Err(\"checksum\"));\n    println!(\"Đã giải mã mẫu âm và mẫu dương\");\n}",
      "solutionCode": "fn decode(frame: &[u8]) -> Result<(u8, i16, u8), &'static str> {\n    if frame.len() != 5 { return Err(\"length\"); }\n    if frame[..4].iter().fold(0u8, |sum, byte| sum ^ byte) != frame[4] { return Err(\"checksum\"); }\n    let centi = i16::from_be_bytes([frame[1], frame[2]]);\n    if !(-4000..=12500).contains(&centi) { return Err(\"range\"); }\n    Ok((frame[0], centi, frame[3]))\n}\nfn packet(id: u8, value: i16, sequence: u8) -> [u8; 5] {\n    let [high, low] = value.to_be_bytes();\n    [id, high, low, sequence, id ^ high ^ low ^ sequence]\n}\nfn main() {\n    assert_eq!(decode(&packet(7, 2500, 4)), Ok((7, 2500, 4)));\n    assert_eq!(decode(&packet(7, -100, 5)), Ok((7, -100, 5)));\n    assert_eq!(decode(&packet(7, -4000, 1)), Ok((7, -4000, 1)));\n    assert_eq!(decode(&packet(7, 12501, 1)), Err(\"range\"));\n    assert_eq!(decode(&[1, 2]), Err(\"length\"));\n    let mut bad = packet(7, 2500, 4); bad[4] ^= 1;\n    assert_eq!(decode(&bad), Err(\"checksum\"));\n    println!(\"Đã giải mã mẫu âm và mẫu dương\");\n}",
      "expectedOutput": "Đã giải mã mẫu âm và mẫu dương",
      "hints": [
        "Dùng i16::from_be_bytes([frame[1], frame[2]]).",
        "fold với XOR trên frame[..4] để kiểm tra byte cuối."
      ],
      "localLab": {
        "title": "Driver generic với fake I2C",
        "instructions": "Driver này dùng giao thức thanh ghi mẫu: đọc hai byte big-endian từ 0x10 ở địa chỉ 0x48. Đây là lab về hợp đồng bus, không gán giao thức này cho một mẫu cảm biến thương mại. Khi nối cảm biến thật, thay địa chỉ, thanh ghi và công thức theo datasheet.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"register-sensor\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\nembedded-hal = \"=1.0.0\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "#![no_std]\nuse embedded_hal::i2c::I2c;\n\npub struct RegisterSensor<B> { bus: B, address: u8 }\nimpl<B: I2c> RegisterSensor<B> {\n    pub fn new(bus: B, address: u8) -> Self { Self { bus, address } }\n    pub fn read_raw(&mut self) -> Result<i16, B::Error> {\n        let mut bytes = [0; 2];\n        self.bus.write_read(self.address, &[0x10], &mut bytes)?;\n        Ok(i16::from_be_bytes(bytes))\n    }\n}\n#[cfg(test)]\nmod tests {\n    use super::*;\n    use embedded_hal::i2c::{Error, ErrorKind, ErrorType, Operation};\n    #[derive(Debug, Clone, Copy, PartialEq, Eq)]\n    enum Fault { Bus }\n    impl Error for Fault { fn kind(&self) -> ErrorKind { ErrorKind::Bus } }\n    struct FakeBus { reply: [u8; 2], fail: bool }\n    impl ErrorType for FakeBus { type Error = Fault; }\n    impl I2c for FakeBus {\n        fn transaction(&mut self, address: u8, ops: &mut [Operation<'_>]) -> Result<(), Fault> {\n            assert_eq!(address, 0x48);\n            assert_eq!(ops.len(), 2);\n            match &ops[0] { Operation::Write(bytes) => assert_eq!(*bytes, &[0x10]), _ => panic!(\"expected write\") }\n            if self.fail { return Err(Fault::Bus); }\n            match &mut ops[1] {\n                Operation::Read(bytes) => { assert_eq!(bytes.len(), 2); bytes.copy_from_slice(&self.reply); }\n                _ => panic!(\"expected read\"),\n            }\n            Ok(())\n        }\n    }\n    #[test]\n    fn decodes_signed_big_endian() {\n        let mut sensor = RegisterSensor::new(FakeBus { reply: (-100i16).to_be_bytes(), fail: false }, 0x48);\n        assert_eq!(sensor.read_raw(), Ok(-100));\n    }\n    #[test]\n    fn preserves_bus_failure() {\n        let mut sensor = RegisterSensor::new(FakeBus { reply: [0; 2], fail: true }, 0x48);\n        assert_eq!(sensor.read_raw(), Err(Fault::Bus));\n    }\n}\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo check --lib"
        ],
        "checks": [
          "Fake bus xác nhận một lần write_read gồm đúng hai operation theo thứ tự.",
          "Giá trị -100 được giữ đúng dấu.",
          "Lỗi bus được trả ra dưới dạng Err, không bị đổi thành phép đo 0.",
          "Thử đổi 0x10 trong driver và xác nhận test thất bại."
        ]
      }
    },
    {
      "id": "embedded-async",
      "moduleId": "track-embedded",
      "title": "Ngắt, Embassy và thời gian của thiết bị",
      "description": "Thiết kế tác vụ phối hợp, deadline và đường truyền sự kiện mà không chặn executor.",
      "duration": 60,
      "objectives": [
        "Phân biệt task hợp tác với ngắt phần cứng",
        "Nhận ra busy-loop trong async task",
        "Thiết kế ownership và đường truyền dữ liệu giữa task",
        "Xử lý deadline quanh điểm tràn bộ đếm"
      ],
      "sections": [
        {
          "title": "Async task không phải một thread riêng",
          "text": "Trong Embassy, async task được biến thành state machine và executor poll các future khi chúng có thể tiến triển. Một await chờ timer hoặc I/O có thể nhường thời gian cho tác vụ khác. Đặt một vòng tính toán dài không nhường trong async fn vẫn giữ CPU và làm chậm các task cùng executor; từ khóa async không tự chia công việc thành các lát thời gian.\n\nNgắt phần cứng có thể xảy ra giữa các đoạn mã thread-mode. Embassy cung cấp cơ chế tích hợp ngắt với driver và executor, nhưng bạn vẫn cần hiểu mức ưu tiên, vùng chia sẻ và thời gian xử lý. Bắt đầu bằng mô hình đơn giản: task sở hữu peripheral, ngắt/driver đánh thức task, dữ liệu đi qua một cấu trúc đồng bộ phù hợp."
        },
        {
          "title": "Tách trách nhiệm và chọn cách giao tiếp",
          "text": "Một thiết bị đo có thể có task lấy mẫu, task xuất dữ liệu và task xử lý nút bấm. Mỗi task cần mục đích cụ thể và thời hạn rõ. Task lấy mẫu không nên chờ UART chậm ngay trong cùng đường lấy mẫu nếu yêu cầu thời gian không cho phép. Gửi một bản ghi nhỏ sang queue giúp tách hai tốc độ, nhưng phải xử lý queue đầy.\n\nThông điệp “trạng thái hiện tại” có thể chỉ cần giữ bản mới nhất; chuỗi sự kiện như cạnh nút hoặc lệnh điều khiển cần quy tắc thứ tự khác. Chọn channel, signal hay watch theo ngữ nghĩa thay vì theo tên quen thuộc. Khi nhiều task cần bus, có thể có một task chủ bus nhận yêu cầu, hoặc adapter chia sẻ bus có hợp đồng khóa rõ ràng."
        },
        {
          "title": "Timer tương đối khác lịch lấy mẫu đều",
          "text": "Nếu mỗi vòng đo mất 20 ms rồi đợi thêm 100 ms, chu kỳ thực tế gần 120 ms. Lịch lấy mẫu dựa trên deadline tuyệt đối có thể tránh tích lũy độ trễ, nhưng cần chính sách khi bỏ lỡ nhiều chu kỳ: bỏ mẫu, lấy một mẫu ngay hoặc xử lý bù có giới hạn. Chạy dồn vô hạn để “bù” có thể làm hệ thống càng trễ.\n\nTimer phần cứng và bộ đếm hữu hạn có thể tràn. Bài tập dùng u32 với giả định mọi deadline cần so sánh cách now ít hơn nửa vòng 2^32 tick. Phép wrapping_sub cho phép xét thứ tự quanh điểm tràn trong cửa sổ đó. Đây là kỹ thuật cho bộ đếm mẫu; khi dùng Embassy hãy ưu tiên Instant/Duration và API thời gian của runtime.",
          "code": "// Logic cho bộ đếm u32 của bài tập, trong cửa sổ nửa vòng.\nfn reached(now: u32, deadline: u32) -> bool {\n    now.wrapping_sub(deadline) < (1u32 << 31)\n}\n\n// Trong một task Embassy đã cấu hình time driver:\n// embassy_time::Timer::after_millis(100).await;"
        },
        {
          "title": "Giới hạn vùng ngắt và việc chia sẻ",
          "text": "Một handler ngắt nên làm phần cần thiết, ghi nhận sự kiện và đánh thức công việc tiếp theo. In log dài, cấp phát không kiểm soát hoặc đợi một khóa đang do thread-mode giữ có thể phá thời hạn. Độ dài critical section cũng là một phần ngân sách latency, không chỉ là vấn đề đúng/sai về kiểu dữ liệu.\n\nMột MCU đơn nhân vẫn có cạnh tranh giữa ngắt và mã chính. critical-section phải có implementation phù hợp với nền tảng; chặn ngắt trên một core không tự bảo vệ dữ liệu khỏi core khác. Kiểm thử bằng timestamp, tải giả và clock giả để xác nhận tính sống: task cần chạy cuối cùng có chạy được không, và sự kiện bị bỏ có được đếm không?"
        }
      ],
      "tip": "Mỗi await, queue và critical section nên có lý do liên quan đến độ trễ hoặc quyền sở hữu dữ liệu.",
      "quiz": {
        "question": "Một task Embassy chạy while loop liên tục mà không await. Điều gì có thể xảy ra?",
        "options": [
          "Executor tự biến task thành một OS thread.",
          "Task khác trên cùng executor có thể bị trì hoãn vì không có điểm nhường.",
          "Rust tự thêm timer vào vòng lặp.",
          "Task chỉ chạy một vòng rồi bị hủy."
        ],
        "correct": 1,
        "explanation": "Cooperative scheduling cần future trả quyền điều khiển. Một lần poll bận quá lâu có thể giữ executor; async không tự ngắt vòng tính toán dài."
      },
      "reference": {
        "label": "Embassy Book: executor và chia sẻ peripheral",
        "url": "https://embassy.dev/book/"
      },
      "exercise": {
        "title": "Deadline qua điểm tràn timer",
        "instructions": "Hoàn thiện reached và ready_ids, giữ thứ tự công việc đầu vào. Giả định khoảng cách cần so sánh nhỏ hơn 2^31 tick.",
        "requirements": [
          "Deadline đúng now đã đến hạn.",
          "So sánh đúng khi now hoặc deadline ở hai phía u32::MAX.",
          "Không sắp xếp lại danh sách; chỉ lọc ID đã đến hạn."
        ]
      },
      "starterCode": "fn reached(now: u32, deadline: u32) -> bool { todo!() }\nfn ready_ids(now: u32, jobs: &[(u8, u32)]) -> Vec<u8> { todo!() }\nfn main() {\n    assert!(reached(100, 100));\n    assert!(!reached(99, 100));\n    assert!(reached(3, u32::MAX - 2));\n    assert!(!reached(u32::MAX - 2, 3));\n    assert_eq!(ready_ids(3, &[(1, u32::MAX - 2), (2, 4), (3, 3)]), vec![1, 3]);\n    assert!(ready_ids(3, &[]).is_empty());\n    println!(\"Đến hạn: [1, 3]\");\n}",
      "solutionCode": "fn reached(now: u32, deadline: u32) -> bool {\n    now.wrapping_sub(deadline) < (1u32 << 31)\n}\nfn ready_ids(now: u32, jobs: &[(u8, u32)]) -> Vec<u8> {\n    jobs.iter().filter(|(_, deadline)| reached(now, *deadline)).map(|(id, _)| *id).collect()\n}\nfn main() {\n    assert!(reached(100, 100));\n    assert!(!reached(99, 100));\n    assert!(reached(3, u32::MAX - 2));\n    assert!(!reached(u32::MAX - 2, 3));\n    assert_eq!(ready_ids(3, &[(1, u32::MAX - 2), (2, 4), (3, 3)]), vec![1, 3]);\n    assert!(ready_ids(3, &[]).is_empty());\n    println!(\"Đến hạn: [1, 3]\");\n}",
      "expectedOutput": "Đến hạn: [1, 3]",
      "hints": [
        "Dùng wrapping_sub thay phép trừ thường để có hành vi xác định qua điểm tràn.",
        "Trong cửa sổ nửa vòng, hiệu nhỏ hơn 2^31 biểu diễn deadline đã tới."
      ]
    },
    {
      "id": "embedded-memory",
      "moduleId": "track-embedded",
      "title": "RAM hữu hạn, hàng đợi và năng lượng",
      "description": "Tính ngân sách bộ nhớ, chọn chính sách mất mẫu và đo hành vi khi thiết bị phải chờ.",
      "duration": 55,
      "objectives": [
        "Phân biệt stack, static, heap và bộ nhớ task",
        "Triển khai ring buffer có dung lượng cố định",
        "Quy định hành vi khi producer nhanh hơn consumer",
        "Đo điện năng với điều kiện phần cứng rõ ràng"
      ],
      "sections": [
        {
          "title": "Bộ nhớ hữu hạn phải trở thành một ngân sách",
          "text": "Một firmware cần RAM cho dữ liệu static, stack, các future/task, buffer giao tiếp và heap nếu có. Không cấp phát heap không có nghĩa không thể hết RAM: mảng lớn trên stack, nhiều task hoặc DMA buffer vẫn chiếm chỗ. Kích thước binary trên flash cũng không bằng RAM cần lúc chạy.\n\nLập bảng trước khi chọn kích thước buffer: số bản ghi, kích thước mỗi bản ghi, số queue và vùng giữ thêm khi serialize. Tính cả phần metadata và alignment. Dùng báo cáo linker để biết static/flash, rồi phương pháp đo phù hợp cho stack và tải thực tế. Đừng suy ra hệ thống an toàn chỉ vì linker chưa báo tràn; stack sâu hoặc dữ liệu giữ qua await còn cần được xem xét."
        },
        {
          "title": "Hàng đợi hữu hạn bắt buộc có chính sách",
          "text": "Nếu lấy 10 mẫu mỗi giây và consumer có thể dừng 2 giây, cần chứa ít nhất lượng mẫu sinh ra trong khoảng đó, cộng biên độ hợp lý. Nhưng nếu consumer dừng vô hạn thì không có buffer hữu hạn nào giữ được mọi mẫu. Lựa chọn là giảm tốc producer, bỏ dữ liệu hoặc chuyển sang nơi lưu trữ khác có giới hạn rõ.\n\nBỏ mẫu mới giữ lịch sử cũ; bỏ mẫu cũ giữ trạng thái mới nhất; hai cách phù hợp những yêu cầu khác nhau. Với lệnh điều khiển, bỏ im lặng có thể không chấp nhận được. Hãy trả lại phần tử bị từ chối hoặc một lỗi có ý nghĩa, đồng thời tăng bộ đếm để người vận hành biết đã mất bao nhiêu dữ liệu."
        },
        {
          "title": "Ring buffer có hợp đồng đơn giản",
          "text": "Ring buffer dùng mảng và hai thông tin: chỉ số đọc và số phần tử đang có. Vị trí ghi là (read + len) modulo capacity; lấy ra tăng read và giảm len. Bài tập cho phép dùng đủ N ô, kể cả N bằng 0 theo nghĩa một queue luôn rỗng và luôn từ chối thêm. Kiểm tra rỗng/đầy trước phép modulo để không chia cho 0.\n\nĐây là queue đơn luồng để hiểu bất biến, chưa phải queue an toàn giữa ngắt và task. Khi dùng heapless::spsc, đọc đúng quy tắc capacity của thư viện; ví dụ Queue<T, N> trong phiên bản tham chiếu giữ tối đa N-1 mục. Chọn primitive đồng bộ đã có hợp đồng nền tảng thay vì thêm unsafe để chia sẻ phiên bản bài tập.",
          "code": "struct Ring<const N: usize> {\n    data: [u16; N],\n    read: usize,\n    len: usize,\n}\n// Bất biến: len <= N; khi N > 0, read < N.\n// Queue bài tập cần &mut self cho cả push và pop."
        },
        {
          "title": "Tiết kiệm điện cần đo cả hệ thống",
          "text": "Một CPU bận chờ bằng vòng lặp khác CPU ngủ đợi ngắt. Async I/O có thể tạo cơ hội ngủ khi không có task sẵn sàng, nhưng mức tiêu thụ cuối cùng còn phụ thuộc clock, radio, cảm biến, LED, regulator và USB debugger. Đừng lấy số dòng đo khi cắm debugger rồi coi là mức pin của sản phẩm độc lập.\n\nGhi rõ chu kỳ lấy mẫu, thời gian radio hoạt động, số byte gửi và điều kiện đo. Giảm truyền dữ liệu bằng gom mẫu có thể tiết kiệm điện nhưng tăng latency và RAM cần giữ. Phân tích trade-off bằng số đo của đúng bo, không bằng một khẩu hiệu “Rust nhanh nên ít tốn pin”. Kiểm tra cả đường lỗi: thiết bị reconnect liên tục có thể tiêu thụ nhiều hơn đường chạy bình thường."
        }
      ],
      "tip": "Một queue đầy là trạng thái cần thiết kế và kiểm thử, không phải trường hợp bất khả thi.",
      "quiz": {
        "question": "Producer sinh dữ liệu liên tục còn consumer có thể dừng vô hạn. Tăng queue lên 100 lần bảo đảm không mất mẫu không?",
        "options": [
          "Có, nếu dùng static thay heap.",
          "Có, Rust tự làm producer chậm lại.",
          "Không; cần giới hạn thời gian dừng hoặc chính sách backpressure/lưu/bỏ dữ liệu.",
          "Có, modulo làm ring buffer có dung lượng vô hạn."
        ],
        "correct": 2,
        "explanation": "Bộ nhớ hữu hạn không giữ được lượng dữ liệu sinh ra vô hạn. Kích thước buffer và chính sách quá tải phải dựa trên yêu cầu thời gian và dữ liệu."
      },
      "reference": {
        "label": "heapless 0.9.3: SPSC queue và capacity",
        "url": "https://docs.rs/heapless/0.9.3/heapless/spsc/index.html"
      },
      "exercise": {
        "title": "Ring buffer dùng đủ N ô",
        "instructions": "Hoàn thiện push/pop cho queue đơn luồng; không thêm Vec hoặc cấp phát động.",
        "requirements": [
          "FIFO giữ thứ tự sau khi chỉ số quay vòng.",
          "Queue đầy trả lại Err(value) và không ghi đè dữ liệu.",
          "N bằng 0 hoạt động an toàn, không thực hiện modulo 0."
        ]
      },
      "starterCode": "struct Ring<const N: usize> { data: [u16; N], read: usize, len: usize }\nimpl<const N: usize> Ring<N> {\n    fn new() -> Self { Self { data: [0; N], read: 0, len: 0 } }\n    fn push(&mut self, value: u16) -> Result<(), u16> { todo!() }\n    fn pop(&mut self) -> Option<u16> { todo!() }\n}\nfn main() {\n    let mut queue = Ring::<2>::new();\n    assert_eq!(queue.pop(), None);\n    assert_eq!(queue.push(10), Ok(()));\n    assert_eq!(queue.push(20), Ok(()));\n    assert_eq!(queue.push(30), Err(30));\n    assert_eq!(queue.pop(), Some(10));\n    assert_eq!(queue.push(30), Ok(()));\n    assert_eq!(queue.pop(), Some(20));\n    assert_eq!(queue.pop(), Some(30));\n    assert_eq!(queue.pop(), None);\n    let mut empty = Ring::<0>::new();\n    assert_eq!(empty.push(1), Err(1));\n    assert_eq!(empty.pop(), None);\n    println!(\"FIFO đúng, queue đầy được xử lý\");\n}",
      "solutionCode": "struct Ring<const N: usize> { data: [u16; N], read: usize, len: usize }\nimpl<const N: usize> Ring<N> {\n    fn new() -> Self { Self { data: [0; N], read: 0, len: 0 } }\n    fn push(&mut self, value: u16) -> Result<(), u16> {\n        if self.len == N { return Err(value); }\n        self.data[(self.read + self.len) % N] = value;\n        self.len += 1;\n        Ok(())\n    }\n    fn pop(&mut self) -> Option<u16> {\n        if self.len == 0 { return None; }\n        let value = self.data[self.read];\n        self.read = (self.read + 1) % N;\n        self.len -= 1;\n        Some(value)\n    }\n}\nfn main() {\n    let mut queue = Ring::<2>::new();\n    assert_eq!(queue.pop(), None);\n    assert_eq!(queue.push(10), Ok(()));\n    assert_eq!(queue.push(20), Ok(()));\n    assert_eq!(queue.push(30), Err(30));\n    assert_eq!(queue.pop(), Some(10));\n    assert_eq!(queue.push(30), Ok(()));\n    assert_eq!(queue.pop(), Some(20));\n    assert_eq!(queue.pop(), Some(30));\n    assert_eq!(queue.pop(), None);\n    let mut empty = Ring::<0>::new();\n    assert_eq!(empty.push(1), Err(1));\n    assert_eq!(empty.pop(), None);\n    println!(\"FIFO đúng, queue đầy được xử lý\");\n}",
      "expectedOutput": "FIFO đúng, queue đầy được xử lý",
      "hints": [
        "Kiểm tra len == N trước phép modulo khi push.",
        "Vị trí ghi là (read + len) % N; pop chỉ thay read và len."
      ]
    },
    {
      "id": "embedded-reliability",
      "moduleId": "track-embedded",
      "title": "Kiểm thử, nạp và phục hồi firmware",
      "description": "Xây chuỗi kiểm chứng từ host tới thiết bị, theo dõi watchdog và thiết kế cập nhật không làm mất cấu hình hợp lệ.",
      "duration": 65,
      "objectives": [
        "Phân biệt host test, target build và kiểm thử trên bo",
        "Ghi lại toolchain, lockfile và binary được nạp",
        "Thiết kế lưu cấu hình chịu được ghi gián đoạn",
        "Giải thích watchdog, checksum, chữ ký và rollback"
      ],
      "sections": [
        {
          "title": "Ba lớp kiểm chứng bổ sung nhau",
          "text": "Host test phù hợp với parser, hiệu chuẩn và state machine. Target build bắt lỗi dependency không hỗ trợ no_std, tính năng CPU và liên kết. Hardware-in-the-loop xác nhận pin, bus, timing, reset và ngoại vi đúng như mong đợi. Một lớp đạt không thay thế hai lớp còn lại; báo cáo kiểm thử nên ghi rõ môi trường và phạm vi từng lớp.\n\nTrong CI, giữ những bài test nhanh độc lập với cổng USB. Các ca cần thiết bị chạy ở bước riêng với bo được định danh, firmware có phiên bản và log đầu ra. Thử cả bản release vì tối ưu, timing và khác biệt cấu hình có thể làm hành vi trên thiết bị khác bản debug. Khi một test thất bại, lưu điều kiện và dữ liệu tái hiện thay vì chỉ lưu dòng “không hoạt động”."
        },
        {
          "title": "Nạp đúng binary và quan sát điểm khởi động",
          "text": "Chuỗi triển khai gồm biên dịch cho target, liên kết, tạo image cần thiết rồi nạp qua giao thức được bo hỗ trợ. espflash là công cụ của hệ sinh thái ESP; probe-rs thường dùng cho các luồng debug/probe tương ứng. Công cụ, cổng nối tiếp, MCU và cấu hình bootloader phải phù hợp với bo. Đừng đổi pin hoặc erase flash liên tục khi chưa xác định lỗi nằm ở build hay đường nạp.\n\nGhi phiên bản ứng dụng và nguyên nhân reset ở đầu log. Giữ Cargo.lock, phiên bản toolchain và lựa chọn generator để tái hiện binary. Với ESP32-C3, hoàn thành skeleton từ esp-generate trước, sau đó thêm từng chức năng. Mỗi thay đổi chỉ nên giải quyết một rủi ro rõ: đọc GPIO, nhận sensor, rồi mới thêm task hoặc mạng."
        },
        {
          "title": "Watchdog phải phản ánh sức khỏe có ý nghĩa",
          "text": "Feed watchdog trong một vòng lặp vẫn chạy không bảo đảm hệ thống khỏe: task cảm biến có thể kẹt trong khi vòng feed tiếp tục. Một thiết kế tốt thu heartbeat hoặc trạng thái hoàn thành từ các thành phần quan trọng, đánh giá độ mới rồi mới feed. Chọn thời hạn theo tình huống xấu hợp lệ, tránh reset thiết bị chỉ vì một thao tác bình thường chậm hơn dự đoán.\n\nKhi reset xảy ra, giữ đủ thông tin chẩn đoán nhưng không làm tăng vòng lỗi ghi flash liên tục. Kiểm tra đường khởi động sau nhiều lần thất bại: có thể cần chế độ phục hồi, cấu hình mặc định hoặc tạm ngừng chức năng gây lỗi. Watchdog hỗ trợ khôi phục tính sống; nó không chứng minh dữ liệu nghiệp vụ trước reset đã được lưu đúng."
        },
        {
          "title": "Ghi cấu hình và cập nhật có thể bị gián đoạn",
          "text": "Ghi nhiều byte xuống flash không nên được coi là một phép gán nguyên tử. Một mô hình hai slot giữ bản đã xác nhận, ghi bản mới sang slot khác, kiểm tra tính toàn vẹn rồi đánh dấu hoàn thành theo cơ chế của thiết bị. Khi khởi động, bỏ slot hỏng hoặc chưa xác nhận và chọn thế hệ hợp lệ mới nhất. Bài tập mô hình hóa quyết định này, chưa triển khai driver flash.\n\nCRC hỗ trợ phát hiện hỏng dữ liệu; chữ ký firmware xác minh tính xác thực theo khóa tin cậy. Cập nhật OTA còn cần kiểm tra phiên bản, trạng thái boot, giới hạn thử khởi động và rollback thích hợp. Không tự xây mật mã hoặc coi checksum là chữ ký. Hãy chọn bootloader và cơ chế cập nhật đã được duy trì, rồi thử tình huống mất nguồn ở từng bước theo quy trình của phần cứng."
        }
      ],
      "tip": "Lưu cả bằng chứng test và cấu hình tạo binary; một firmware thương mại cần khả năng tái hiện, chẩn đoán và phục hồi.",
      "quiz": {
        "question": "Một image firmware có CRC đúng. Có thể kết luận nó do nhà phát hành hợp lệ tạo ra không?",
        "options": [
          "Có, CRC chứng minh danh tính người gửi.",
          "Có, nếu dùng Rust thay C.",
          "Không; CRC và xác minh chữ ký bảo vệ các thuộc tính khác nhau.",
          "Có, miễn file có phần mở rộng .bin."
        ],
        "correct": 2,
        "explanation": "CRC không có khóa bí mật và không chứng minh nguồn phát hành. Chữ ký cùng chuỗi tin cậy phù hợp mới phục vụ xác thực image; còn phải thiết kế chính sách phiên bản và rollback."
      },
      "reference": {
        "label": "Embassy Book: bootloader và khôi phục",
        "url": "https://embassy.dev/book/"
      },
      "exercise": {
        "title": "Chọn cấu hình sau lần ghi gián đoạn",
        "instructions": "Chọn slot valid và confirmed có generation lớn nhất. Bài này dùng generation tăng tuyến tính, không hỗ trợ tràn bộ đếm.",
        "requirements": [
          "Bỏ qua slot hỏng hoặc chưa xác nhận dù generation mới hơn.",
          "Nếu generation bằng nhau, giữ slot xuất hiện trước.",
          "Không có bản hợp lệ trả None; không sửa dữ liệu đầu vào."
        ]
      },
      "starterCode": "#[derive(Clone, Copy)]\nstruct Slot { generation: u32, valid: bool, confirmed: bool, threshold: i16 }\nfn recover(slots: &[Slot]) -> Option<(usize, i16)> { todo!() }\nfn main() {\n    let old = Slot { generation: 10, valid: true, confirmed: true, threshold: 2500 };\n    let pending = Slot { generation: 11, valid: true, confirmed: false, threshold: 2600 };\n    assert_eq!(recover(&[old, pending]), Some((0, 2500)));\n    assert_eq!(recover(&[old, Slot { confirmed: true, ..pending }]), Some((1, 2600)));\n    assert_eq!(recover(&[old, Slot { valid: false, confirmed: true, ..pending }]), Some((0, 2500)));\n    assert_eq!(recover(&[old, Slot { threshold: 3000, ..old }]), Some((0, 2500)));\n    assert_eq!(recover(&[pending]), None);\n    assert_eq!(recover(&[]), None);\n    println!(\"Phục hồi bản đã xác nhận: 2500\");\n}",
      "solutionCode": "#[derive(Clone, Copy)]\nstruct Slot { generation: u32, valid: bool, confirmed: bool, threshold: i16 }\nfn recover(slots: &[Slot]) -> Option<(usize, i16)> {\n    let mut chosen: Option<usize> = None;\n    for (index, slot) in slots.iter().enumerate() {\n        if !slot.valid || !slot.confirmed { continue; }\n        if chosen.is_none_or(|old| slot.generation > slots[old].generation) { chosen = Some(index); }\n    }\n    chosen.map(|index| (index, slots[index].threshold))\n}\nfn main() {\n    let old = Slot { generation: 10, valid: true, confirmed: true, threshold: 2500 };\n    let pending = Slot { generation: 11, valid: true, confirmed: false, threshold: 2600 };\n    assert_eq!(recover(&[old, pending]), Some((0, 2500)));\n    assert_eq!(recover(&[old, Slot { confirmed: true, ..pending }]), Some((1, 2600)));\n    assert_eq!(recover(&[old, Slot { valid: false, confirmed: true, ..pending }]), Some((0, 2500)));\n    assert_eq!(recover(&[old, Slot { threshold: 3000, ..old }]), Some((0, 2500)));\n    assert_eq!(recover(&[pending]), None);\n    assert_eq!(recover(&[]), None);\n    println!(\"Phục hồi bản đã xác nhận: 2500\");\n}",
      "expectedOutput": "Phục hồi bản đã xác nhận: 2500",
      "hints": [
        "Duyệt enumerate để giữ vị trí slot.",
        "Chỉ thay lựa chọn khi generation lớn hơn; >= sẽ phá quy tắc bằng nhau."
      ]
    }
  ]
};
