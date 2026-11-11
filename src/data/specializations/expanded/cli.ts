import type { TrackExpansion } from "../../specialization-types";

export const cliExpansion: TrackExpansion = {
  "chapters": [
    {
      "id": "cli-ch1",
      "title": "Giao diện và cấu hình",
      "description": "Thiết kế lệnh từ tác vụ trước khi nối với hệ điều hành.",
      "lessonIds": [
        "cli-interface-design",
        "cli-arguments",
        "cli-config-layers"
      ],
      "outcomes": [
        "Giải thích cờ, subcommand và mã thoát.",
        "Resolve cấu hình kèm nguồn."
      ]
    },
    {
      "id": "cli-ch2",
      "title": "Dữ liệu streaming và lọc log",
      "description": "Đọc dữ liệu có giới hạn, parse và đưa kết quả vào pipeline.",
      "lessonIds": [
        "cli-streaming",
        "cli-record-validation",
        "cli-log-project"
      ],
      "outcomes": [
        "Bảo vệ tài nguyên khi record hỏng.",
        "Xây CLI lọc log có test tiến trình."
      ]
    },
    {
      "id": "cli-ch3",
      "title": "Filesystem và kiểm kê",
      "description": "Quản lý path, kế hoạch và khác biệt dữ liệu trên đĩa.",
      "lessonIds": [
        "cli-filesystem",
        "cli-plan-apply",
        "cli-manifest-project"
      ],
      "outcomes": [
        "Nhận diện giới hạn TOCTOU và snapshot.",
        "Bàn giao công cụ kiểm kê có schema."
      ]
    },
    {
      "id": "cli-ch4",
      "title": "Ghép công cụ và định dạng máy",
      "description": "Giữ hợp đồng khi gọi child process hoặc xuất dữ liệu cho consumer.",
      "lessonIds": [
        "cli-pipes",
        "cli-child-processes",
        "cli-machine-output"
      ],
      "outcomes": [
        "Phân biệt lỗi spawn, status và I/O.",
        "Giữ output có phiên bản và thứ tự."
      ]
    },
    {
      "id": "cli-ch5",
      "title": "Xử lý batch và khôi phục",
      "description": "Giới hạn concurrency và chứng minh hành vi khi gián đoạn.",
      "lessonIds": [
        "cli-parallelism",
        "cli-cancellation",
        "cli-batch-project"
      ],
      "outcomes": [
        "Thiết kế checkpoint phụ thuộc input và thuật toán.",
        "Chạy lại không bỏ sót công việc."
      ]
    },
    {
      "id": "cli-ch6",
      "title": "Kiểm thử và phát hành",
      "description": "Nghiệm thu executable và phạm vi nền tảng bằng bằng chứng.",
      "lessonIds": [
        "cli-process-tests",
        "cli-shipping",
        "cli-release-contracts"
      ],
      "outcomes": [
        "Kiểm tra status, stdout, stderr độc lập.",
        "Bàn giao artifact và hướng dẫn nâng cấp."
      ]
    }
  ],
  "lessons": [
    {
      "id": "cli-interface-design",
      "title": "Thiết kế giao diện dòng lệnh theo tác vụ",
      "description": "Chuyển nhu cầu vận hành thành lệnh dễ đoán, có hợp đồng rõ cho người dùng và script.",
      "objectives": [
        "Chọn subcommand theo tác vụ thực tế.",
        "Định nghĩa mã thoát và hành vi mặc định.",
        "Phân biệt validation cú pháp và nghiệp vụ."
      ],
      "sections": [
        {
          "title": "Bắt đầu bằng một phiên sử dụng",
          "text": "Trước khi viết parser, hãy mô tả một thao tác người dùng cần hoàn thành: đọc log hôm qua, chỉ lấy lỗi và đưa kết quả vào báo cáo. Viết lệnh mẫu logscan search app.log --level error rồi xác định dữ liệu nào đi vào, dữ liệu nào đi ra và điều kiện thành công. Một cờ nên thay đổi một khía cạnh dễ hiểu. Khi hai tác vụ có dữ liệu và kết quả khác nhau, subcommand như search và summarize thường rõ hơn nhiều cờ phụ thuộc nhau. Help phải cho biết giá trị mặc định và một ví dụ có thể chạy với fixture đi kèm."
        },
        {
          "title": "Kiểu dữ liệu là một phần giao diện",
          "text": "Trong clap, Parser chuyển đối số thành struct; Subcommand biểu diễn các tác vụ; ValueEnum giới hạn tập giá trị hợp lệ. PathBuf phù hợp cho đường dẫn, còn String dành cho văn bản mà ứng dụng thật sự yêu cầu UTF-8. Không chuyển mọi đường dẫn thành String bằng unwrap. Cặp --quiet và --verbose cần quy tắc xung đột rõ, thay vì để nhánh if cuối cùng quyết định. Parser kiểm tra số jobs có đúng dạng số và nằm trong miền cho phép; lớp nghiệp vụ kiểm tra tệp có phù hợp mục đích xử lý. Hai loại lỗi này cần thông điệp khác nhau."
        },
        {
          "title": "Mã thoát là kết quả dành cho chương trình",
          "text": "Một công cụ tìm kiếm có thể quy ước 0 là có kết quả, 1 là không khớp và 2 là thao tác thất bại. Đây là hợp đồng của chính công cụ, không phải quy tắc bắt buộc cho mọi CLI. Công cụ thống kê thường coi báo cáo rỗng là thành công. Không dùng cùng một mã cho không có dữ liệu và không đọc được dữ liệu nếu script cần phân biệt. Khi có nhiều tệp, hãy định nghĩa lỗi một tệp có làm cả lệnh thất bại hay không. Dữ liệu đã xuất trước lỗi vẫn tồn tại; mã thoát phải thể hiện tính không đầy đủ của kết quả."
        },
        {
          "title": "Thử giao diện trước khi có thuật toán",
          "text": "Viết bảng trường hợp gồm help, thiếu input, giá trị sai, không khớp và lỗi đọc. Với clap, try_parse_from cho phép kiểm tra đối số mà không kết thúc tiến trình test. Chạy thêm binary thật để kiểm tra stdout, stderr và status, vì test parser chưa chứng minh luồng chương trình. Bài tập tách phép quyết định mã thoát khỏi I/O: lỗi xử lý ưu tiên cao hơn số kết quả, chế độ count chấp nhận kết quả rỗng. Nếu thay tên cờ hoặc mã thoát về sau, xem đó là thay đổi giao diện cần migration và kiểm tra script của người dùng."
        }
      ],
      "tip": "Viết ba lệnh ví dụ và đầu ra mong đợi trước khi thêm cờ mới.",
      "exercise": {
        "title": "Mã thoát theo hợp đồng",
        "instructions": "Cài đặt exit_code: lỗi luôn là 2; chế độ count thành công là 0; chế độ search trả 0 khi có kết quả, ngược lại 1.",
        "requirements": [
          "Lỗi ưu tiên cả khi đã có kết quả.",
          "Không có kết quả không phải lỗi của chế độ count.",
          "Giữ hàm thuần để kiểm thử độc lập."
        ]
      },
      "expectedOutput": "Ba trạng thái đầu ra được phân biệt",
      "hints": [
        "Xử lý failed trước.",
        "Chế độ count không yêu cầu matches > 0."
      ],
      "quiz": {
        "question": "CLI đã xuất 8 dòng rồi gặp lỗi đọc tệp thứ hai. Nên làm gì?",
        "options": [
          "Thoát 0 vì đã có dữ liệu.",
          "Xóa stdout đã gửi khỏi pipe.",
          "Báo lỗi qua stderr và mã thất bại theo hợp đồng."
        ],
        "correct": 2,
        "explanation": "Không thể thu hồi bytes đã đi qua pipe. Mã thoát và stderr phải cho biết kết quả chưa đầy đủ."
      },
      "reference": {
        "label": "clap derive reference",
        "url": "https://docs.rs/clap/latest/clap/_derive/"
      },
      "moduleId": "track-cli",
      "duration": 35,
      "starterCode": "\nfn exit_code(matches: usize, failed: bool, count_mode: bool) -> u8 {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(exit_code(3, false, false), 0);\n    assert_eq!(exit_code(0, false, false), 1);\n    assert_eq!(exit_code(0, false, true), 0);\n    assert_eq!(exit_code(3, true, true), 2);\n    println!(\"Ba trạng thái đầu ra được phân biệt\");\n}",
      "solutionCode": "\nfn exit_code(matches: usize, failed: bool, count_mode: bool) -> u8 {\n    if failed { 2 } else if count_mode || matches > 0 { 0 } else { 1 }\n}\nfn main() {\n    assert_eq!(exit_code(3, false, false), 0);\n    assert_eq!(exit_code(0, false, false), 1);\n    assert_eq!(exit_code(0, false, true), 0);\n    assert_eq!(exit_code(3, true, true), 2);\n    println!(\"Ba trạng thái đầu ra được phân biệt\");\n}"
    },
    {
      "id": "cli-config-layers",
      "title": "Cấu hình nhiều lớp và nguồn gốc giá trị",
      "description": "Kết hợp mặc định, tệp, môi trường và cờ mà không làm mất ý định của người sử dụng.",
      "objectives": [
        "Phân biệt giá trị thiếu với giá trị được đặt rõ.",
        "Hợp nhất cấu hình theo quy tắc công bố.",
        "Báo nguồn cấu hình khi chẩn đoán lỗi."
      ],
      "sections": [
        {
          "title": "Giá trị và nguồn của nó",
          "text": "Một CLI chạy tay và chạy trong CI thường cần cùng kiểu cấu hình nhưng khác nguồn. Hãy công bố thứ tự ưu tiên, chẳng hạn cờ lệnh, biến môi trường, tệp cấu hình rồi mặc định. Quy tắc này thuộc thiết kế sản phẩm, không tự xuất hiện từ clap. Mỗi lớp nên giữ Option cho trường chưa được đặt. Nếu gán default vào struct parser ngay từ đầu, bạn có thể không phân biệt được người dùng thực sự chọn giá trị đó với việc bỏ trống cờ, dẫn đến mặc định của parser vô tình che cấu hình từ tệp."
        },
        {
          "title": "Hợp nhất rồi mới kiểm tra quan hệ",
          "text": "Giả sử jobs mặc định là 4, tệp đặt 8, môi trường đặt 2 và cờ không có: kết quả phải là 2. Nếu cờ đặt 0, không được bỏ qua 0 để lấy giá trị cũ; cần báo jobs ngoài miền cho phép. Sau khi chọn từng trường, kiểm tra quan hệ như timeout tổng phải lớn hơn khoảng chờ giữa hai lần thử. Đối với danh sách include, cần quyết định rõ lớp cao hơn thay toàn bộ hay nối thêm. Hai cách đều có thể hợp lý, nhưng sự im lặng về quy tắc hợp nhất làm cấu hình khó dự đoán."
        },
        {
          "title": "Chẩn đoán mà không làm lộ dữ liệu",
          "text": "Lệnh config show có thể trình bày giá trị đã resolve cùng nhãn source: flag, env, file hoặc default. Đối với trường bí mật, hiển thị trạng thái đã cấu hình và tên nguồn; không in giá trị ra log chỉ để thuận tiện debug. Lỗi đọc tệp cần đường dẫn và thao tác gây lỗi, còn lỗi parse cần vị trí và tên trường. Tệp cấu hình được chỉ định tường minh nhưng không tồn tại nên thất bại thay vì âm thầm dùng mặc định. Chính sách đối với tệp cấu hình tùy chọn tự tìm phải được ghi riêng."
        },
        {
          "title": "Kiểm thử không phụ thuộc môi trường máy",
          "text": "Đừng viết test bằng cách thay biến môi trường toàn cục trong nhiều thread. Tách bước đọc môi trường ra adapter; đưa một map hay struct vào hàm resolve thuần. Tương tự, parser tệp nhận chuỗi hoặc reader do test cung cấp. Bảng test cần các tổ hợp không nguồn, chỉ một nguồn, nhiều nguồn và giá trị cao nhất không hợp lệ. Bài tập lưu cả nhãn nguồn để khi assertion thất bại có thể xác định lớp nào thắng. Khi tích hợp clap, dùng Option<usize> cho jobs rồi gọi hàm resolve trước khi mở input hoặc bắt đầu tạo side effect."
        }
      ],
      "tip": "Giá trị sai ở lớp ưu tiên cao cần được báo lỗi, không được âm thầm rơi xuống lớp thấp hơn.",
      "exercise": {
        "title": "Resolve jobs cùng nguồn cấu hình",
        "instructions": "Chọn flag > env > file > mặc định 4. Chấp nhận 1..=64; trả cả giá trị và tên nguồn.",
        "requirements": [
          "Giữ giá trị 0 để validation phát hiện lỗi.",
          "Nguồn mặc định có tên default.",
          "Không đọc environment thật trong bài tập."
        ]
      },
      "expectedOutput": "Cấu hình có thứ tự và nguồn rõ ràng",
      "hints": [
        "Chọn Option đầu tiên có giá trị.",
        "Validation chạy sau khi chọn nguồn."
      ],
      "quiz": {
        "question": "--jobs 0 được truyền, còn tệp cấu hình có jobs=8. Kết quả hợp lý theo bài là gì?",
        "options": [
          "Báo lỗi jobs từ nguồn flag.",
          "Dùng mặc định 4.",
          "Dùng 8."
        ],
        "correct": 0,
        "explanation": "Người dùng đã đưa giá trị tường minh. Bỏ qua nó sẽ che một lỗi cấu hình và tạo hành vi khác với ý định."
      },
      "reference": {
        "label": "clap ArgMatches value_source",
        "url": "https://docs.rs/clap/latest/clap/struct.ArgMatches.html#method.value_source"
      },
      "moduleId": "track-cli",
      "duration": 35,
      "starterCode": "\nfn jobs(flag: Option<usize>, env: Option<usize>, file: Option<usize>) -> Result<(usize, &'static str), &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(jobs(None, None, None), Ok((4, \"default\")));\n    assert_eq!(jobs(None, Some(2), Some(8)), Ok((2, \"env\")));\n    assert_eq!(jobs(Some(6), Some(2), Some(8)), Ok((6, \"flag\")));\n    assert_eq!(jobs(Some(0), Some(2), None), Err(\"jobs\"));\n    assert_eq!(jobs(None, None, Some(65)), Err(\"jobs\"));\n    println!(\"Cấu hình có thứ tự và nguồn rõ ràng\");\n}",
      "solutionCode": "\nfn jobs(flag: Option<usize>, env: Option<usize>, file: Option<usize>) -> Result<(usize, &'static str), &'static str> {\n    let (value, source) = if let Some(v) = flag { (v, \"flag\") }\n        else if let Some(v) = env { (v, \"env\") }\n        else if let Some(v) = file { (v, \"file\") }\n        else { (4, \"default\") };\n    if !(1..=64).contains(&value) { return Err(\"jobs\"); }\n    Ok((value, source))\n}\nfn main() {\n    assert_eq!(jobs(None, None, None), Ok((4, \"default\")));\n    assert_eq!(jobs(None, Some(2), Some(8)), Ok((2, \"env\")));\n    assert_eq!(jobs(Some(6), Some(2), Some(8)), Ok((6, \"flag\")));\n    assert_eq!(jobs(Some(0), Some(2), None), Err(\"jobs\"));\n    assert_eq!(jobs(None, None, Some(65)), Err(\"jobs\"));\n    println!(\"Cấu hình có thứ tự và nguồn rõ ràng\");\n}",
      "simulation": {
        "title": "Một giá trị cấu hình đi qua các lớp",
        "description": "Theo dõi nguồn thắng và thời điểm validation trước khi mở tệp.",
        "kind": "pipeline",
        "nodes": [
          {
            "id": "file",
            "label": "Tệp cấu hình",
            "detail": "Giá trị người dùng lưu lại"
          },
          {
            "id": "env",
            "label": "Môi trường",
            "detail": "Ghi đè giá trị từ tệp"
          },
          {
            "id": "flag",
            "label": "Cờ lệnh",
            "detail": "Ý định trong phiên chạy"
          },
          {
            "id": "check",
            "label": "Validation",
            "detail": "Chỉ cấu hình hợp lệ mới được thực thi"
          }
        ],
        "scenarios": [
          {
            "id": "cli-config-ok",
            "label": "Cờ hợp lệ",
            "steps": [
              {
                "title": "Đọc tệp",
                "description": "jobs trong tệp là 8.",
                "activeNodeIds": [
                  "file"
                ],
                "values": [
                  {
                    "label": "jobs",
                    "value": "8"
                  },
                  {
                    "label": "source",
                    "value": "file"
                  }
                ]
              },
              {
                "title": "Áp dụng môi trường",
                "description": "Môi trường của CI chọn 2 worker.",
                "activeNodeIds": [
                  "env"
                ],
                "values": [
                  {
                    "label": "jobs",
                    "value": "2"
                  },
                  {
                    "label": "source",
                    "value": "env"
                  }
                ]
              },
              {
                "title": "Áp dụng cờ",
                "description": "Người dùng chọn 6 cho lần chạy này.",
                "activeNodeIds": [
                  "flag"
                ],
                "values": [
                  {
                    "label": "jobs",
                    "value": "6"
                  },
                  {
                    "label": "source",
                    "value": "flag"
                  }
                ]
              },
              {
                "title": "Xác nhận miền",
                "description": "6 nằm trong 1..64; chương trình mới được mở input.",
                "activeNodeIds": [
                  "check"
                ],
                "values": [
                  {
                    "label": "jobs",
                    "value": "6"
                  },
                  {
                    "label": "valid",
                    "value": "true"
                  },
                  {
                    "label": "side_effects",
                    "value": "được phép"
                  }
                ]
              }
            ]
          },
          {
            "id": "cli-config-invalid",
            "label": "Cờ bằng 0",
            "steps": [
              {
                "title": "Đọc tệp",
                "description": "Tệp có giá trị hợp lệ nhưng chưa phải kết quả cuối.",
                "activeNodeIds": [
                  "file"
                ],
                "values": [
                  {
                    "label": "jobs",
                    "value": "8"
                  },
                  {
                    "label": "source",
                    "value": "file"
                  }
                ]
              },
              {
                "title": "Áp dụng môi trường",
                "description": "Giá trị 2 thay tệp.",
                "activeNodeIds": [
                  "env"
                ],
                "values": [
                  {
                    "label": "jobs",
                    "value": "2"
                  },
                  {
                    "label": "source",
                    "value": "env"
                  }
                ]
              },
              {
                "title": "Giữ cờ tường minh",
                "description": "0 không bị coi là thiếu.",
                "activeNodeIds": [
                  "flag"
                ],
                "values": [
                  {
                    "label": "jobs",
                    "value": "0"
                  },
                  {
                    "label": "source",
                    "value": "flag"
                  }
                ]
              },
              {
                "title": "Dừng trước side effect",
                "description": "Báo lỗi jobs từ flag; không rơi về 2 hoặc 8.",
                "activeNodeIds": [
                  "check"
                ],
                "values": [
                  {
                    "label": "valid",
                    "value": "false"
                  },
                  {
                    "label": "opened_files",
                    "value": "0"
                  },
                  {
                    "label": "error",
                    "value": "jobs ngoài miền"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "cli-record-validation",
      "title": "Định dạng bản ghi, giới hạn và lỗi dữ liệu",
      "description": "Xử lý stream theo hợp đồng định dạng và ngăn một bản ghi hỏng chiếm tài nguyên vô hạn.",
      "objectives": [
        "Đặt giới hạn trước khi cấp phát quá lớn.",
        "Giữ số dòng và phân biệt lỗi dữ liệu với I/O.",
        "Thiết kế strict và tolerant rõ ràng."
      ],
      "sections": [
        {
          "title": "Dòng không đồng nghĩa với bản ghi",
          "text": "Đọc từng dòng chỉ đúng khi định dạng quy định mỗi bản ghi nằm trên một dòng. CSV đầy đủ có thể chứa newline trong trường được quote; split dấu phẩy không phải parser CSV. JSON Lines quy định mỗi dòng là một giá trị JSON, vì thế phù hợp pipeline từng bản ghi. Với định dạng log riêng của khóa học, hãy ghi rõ ba trường tách bởi tab và cấm tab trong message, hoặc chọn JSON Lines để có escaping. Định dạng đơn giản vẫn có ích nếu phạm vi được công bố và parser từ chối dữ liệu ngoài phạm vi."
        },
        {
          "title": "Giới hạn phải có trước cấp phát",
          "text": "BufRead::read_line thuận tiện nhưng có thể tích lũy một dòng rất dài nếu nguồn chưa gửi newline. Kiểm tra line.len sau khi đọc xong chỉ giới hạn dữ liệu được chấp nhận, chưa giới hạn RAM đã cấp phát. Có thể đọc qua Take với giới hạn cộng một, hoặc dùng fill_buf và consume để chỉ sao chép phần còn nằm trong ngân sách. Khi vượt giới hạn, chế độ strict dừng; chế độ tolerant cần bỏ phần còn lại của bản ghi trước khi đọc tiếp. Nếu không đồng bộ lại tại delimiter, phần đuôi dòng hỏng sẽ bị hiểu thành bản ghi mới."
        },
        {
          "title": "Lỗi có vị trí và chính sách",
          "text": "Một lỗi nên mang số dòng, loại lỗi và mô tả ngắn như duration không phải số nguyên. Giữ dòng gốc hoặc đoạn trích có giới hạn giúp người dùng sửa dữ liệu; không nhất thiết ghi toàn bộ payload. Trong strict mode, lỗi đầu tiên làm lệnh thất bại. Trong tolerant mode, cần đếm skipped và quyết định mã thoát khi có bản ghi bị bỏ. Không được nuốt lỗi đọc bằng filter_map(Result::ok), vì cách đó biến một báo cáo thiếu thành báo cáo có vẻ hoàn chỉnh. Lỗi decode UTF-8 cũng cần chính sách riêng thay vì tự thay ký tự mà không báo."
        },
        {
          "title": "Tách parser và vòng đọc",
          "text": "Parser nhận một record đã bỏ newline, trả kiểu dữ liệu hoặc lỗi miền. Vòng đọc chịu trách nhiệm giới hạn bytes, số dòng và tiếp tục hay dừng. Kiểm thử parser bằng chuỗi rỗng, trường thiếu, trường thừa, số âm, overflow và Unicode hợp lệ. Kiểm thử vòng đọc bằng reader trả lỗi giữa chừng và input kết thúc không có newline. Bài tập dùng định dạng level tab duration: chỉ nhận INFO, WARN, ERROR và duration tối đa 60000. Khi bổ sung message, hãy thay hợp đồng một cách có phiên bản thay vì khiến parser cũ đoán nhiều dạng đầu vào."
        }
      ],
      "tip": "Giới hạn sau read_line bảo vệ nghiệp vụ, nhưng không tự bảo vệ bộ nhớ khi đang đọc.",
      "exercise": {
        "title": "Parse một bản ghi log có giới hạn",
        "instructions": "Nhận đúng hai trường level và duration ngăn bằng tab; level nằm trong INFO/WARN/ERROR, duration 0..=60000, không chấp nhận trường thừa.",
        "requirements": [
          "Phân biệt format, level và duration.",
          "Không panic với số quá lớn.",
          "Giữ level theo chuỗi mượn."
        ]
      },
      "expectedOutput": "Bản ghi hợp lệ mới đi vào thống kê",
      "hints": [
        "split cho phép phát hiện trường thừa.",
        "parse::<u32> trả Result khi số âm hoặc overflow."
      ],
      "quiz": {
        "question": "Kiểm tra len sau read_line có đủ để giữ RAM dưới giới hạn một dòng không?",
        "options": [
          "Có, BufRead tự chặn mọi dòng dài.",
          "Không, dữ liệu có thể đã được cấp phát trước kiểm tra.",
          "Có nếu dùng String thay Vec."
        ],
        "correct": 1,
        "explanation": "BufRead tối ưu đọc theo buffer nhưng read_line vẫn nối đến newline hoặc EOF. Muốn chặn cấp phát cần giới hạn ngay trong quá trình đọc."
      },
      "reference": {
        "label": "Rust BufRead",
        "url": "https://doc.rust-lang.org/std/io/trait.BufRead.html"
      },
      "moduleId": "track-cli",
      "duration": 35,
      "starterCode": "\nfn record(line: &str) -> Result<(&str, u32), &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(record(\"INFO\\t12\"), Ok((\"INFO\", 12)));\n    assert_eq!(record(\"ERROR\\t0\"), Ok((\"ERROR\", 0)));\n    assert_eq!(record(\"DEBUG\\t1\"), Err(\"level\"));\n    assert_eq!(record(\"INFO\\t1\\tx\"), Err(\"format\"));\n    assert_eq!(record(\"INFO\\t-1\"), Err(\"duration\"));\n    assert_eq!(record(\"INFO\\t60001\"), Err(\"duration\"));\n    println!(\"Bản ghi hợp lệ mới đi vào thống kê\");\n}",
      "solutionCode": "\nfn record(line: &str) -> Result<(&str, u32), &'static str> {\n    let mut fields = line.split('\\t');\n    let level = fields.next().ok_or(\"format\")?;\n    let duration = fields.next().ok_or(\"format\")?;\n    if fields.next().is_some() { return Err(\"format\"); }\n    if ![\"INFO\", \"WARN\", \"ERROR\"].contains(&level) { return Err(\"level\"); }\n    let value = duration.parse::<u32>().map_err(|_| \"duration\")?;\n    if value > 60_000 { return Err(\"duration\"); }\n    Ok((level, value))\n}\nfn main() {\n    assert_eq!(record(\"INFO\\t12\"), Ok((\"INFO\", 12)));\n    assert_eq!(record(\"ERROR\\t0\"), Ok((\"ERROR\", 0)));\n    assert_eq!(record(\"DEBUG\\t1\"), Err(\"level\"));\n    assert_eq!(record(\"INFO\\t1\\tx\"), Err(\"format\"));\n    assert_eq!(record(\"INFO\\t-1\"), Err(\"duration\"));\n    assert_eq!(record(\"INFO\\t60001\"), Err(\"duration\"));\n    println!(\"Bản ghi hợp lệ mới đi vào thống kê\");\n}"
    },
    {
      "id": "cli-plan-apply",
      "title": "Plan, dry-run và ghi tệp không phá dữ liệu",
      "description": "Tách quyết định khỏi thực thi, kiểm tra trạng thái cũ và chọn cơ chế ghi phù hợp.",
      "objectives": [
        "Biểu diễn kế hoạch thay đổi trước khi thực thi.",
        "Nhận diện TOCTOU và giới hạn của dry-run.",
        "Thiết kế xuất bản tệp cùng cleanup rõ ràng."
      ],
      "sections": [
        {
          "title": "Kế hoạch là dữ liệu có thể xem xét",
          "text": "Một lệnh đổi tên hoặc sao chép hàng nghìn tệp cần trả lời được nó sẽ làm gì trước khi gây thay đổi. Hãy tạo danh sách thao tác gồm nguồn, đích, điều kiện tiên quyết và kết quả dự kiến. Dry-run chỉ hiển thị kế hoạch, không gọi hàm ghi. Dùng cùng một kiểu kế hoạch cho dry-run và apply để giảm khác biệt giữa phần trình bày và phần thực thi. Sắp xếp kế hoạch ổn định giúp review và test dễ hơn. Nếu nhiều nguồn trỏ tới cùng một đích, phát hiện xung đột trước thao tác đầu tiên thay vì ghi được một nửa rồi mới nhận ra."
        },
        {
          "title": "Điều kiện có thể thay đổi sau kiểm tra",
          "text": "Từ lúc lập kế hoạch đến lúc apply, người khác có thể sửa hoặc thay tệp. Đây là vấn đề time of check to time of use. Việc exists trả false không bảo đảm File::create tiếp theo không ghi đè dữ liệu vừa xuất hiện. create_new là thao tác tạo mới có kiểm tra tồn tại tại thời điểm mở, phù hợp mặc định không ghi đè. Đối với nguồn, giữ handle đang mở giúp đọc cùng đối tượng trong nhiều bước, nhưng chưa tự ngăn một tiến trình khác sửa nội dung của đối tượng ấy. Snapshot nội dung và điều kiện kiểm tra cần gắn với yêu cầu thực tế."
        },
        {
          "title": "Xuất bản và độ bền là hai câu hỏi",
          "text": "Mẫu ghi tệp tạm trong cùng thư mục, flush hoặc sync theo yêu cầu rồi rename giúp tránh người đọc nhìn thấy nội dung đang viết dở trong nhiều môi trường. Tuy vậy rename có thể thay thế đích hiện có, khác với chính sách không ghi đè; nó cũng không làm việc xuyên mount point. Hành vi nền tảng và filesystem cần được kiểm tra. Đồng bộ file và thư mục liên quan tới khả năng tồn tại sau mất điện, không đồng nghĩa với nguyên tử của cả một batch. Khi thao tác thứ tư thất bại, ba thao tác trước có thể đã thành công; báo cáo phải mô tả đúng trạng thái đó."
        },
        {
          "title": "Thực hành với precondition tường minh",
          "text": "Bài tập nhận kế hoạch gồm số byte dự kiến và số byte hiện tại của từng nguồn. Đây chỉ là tín hiệu phát hiện thay đổi đơn giản; hai nội dung khác nhau vẫn có thể cùng độ dài. Trong sản phẩm, có thể cần hash nội dung, version hoặc snapshot riêng. Hàm kiểm tra phải từ chối trùng đích và nguồn đã đổi trước khi trả kế hoạch được chấp nhận. Test cần chứng minh đầu vào không bị thay đổi khi validation thất bại. Dự án tiếp theo ưu tiên công cụ kiểm kê chỉ đọc để xây nền tảng phát hiện khác biệt trước khi bổ sung thao tác sửa dữ liệu."
        }
      ],
      "tip": "Dry-run chứng minh kế hoạch tại một thời điểm; apply vẫn cần kiểm tra và xử lý lỗi của từng thao tác.",
      "exercise": {
        "title": "Kiểm tra precondition của kế hoạch",
        "instructions": "Từ chối nếu đích bị lặp hoặc độ dài nguồn không bằng giá trị dự kiến; kế hoạch rỗng hợp lệ.",
        "requirements": [
          "Không sửa danh sách input.",
          "Dùng tập để phát hiện trùng đích.",
          "Nêu đúng lỗi changed hoặc duplicate."
        ]
      },
      "expectedOutput": "Kế hoạch được kiểm tra trước khi ghi",
      "hints": [
        "BTreeSet::insert trả false khi giá trị đã tồn tại.",
        "Không gọi filesystem trong hàm thuần."
      ],
      "quiz": {
        "question": "exists(path) trả false rồi File::create(path) có bảo đảm không ghi đè không?",
        "options": [
          "Có vì hai hàm chạy liên tiếp.",
          "Có nếu đường dẫn là tuyệt đối.",
          "Không; dùng create_new cho yêu cầu tạo mới không ghi đè."
        ],
        "correct": 2,
        "explanation": "Giữa kiểm tra và mở có thể có tiến trình khác tạo tệp. create_new đặt kiểm tra tồn tại trong chính thao tác tạo."
      },
      "reference": {
        "label": "Rust OpenOptions create_new",
        "url": "https://doc.rust-lang.org/std/fs/struct.OpenOptions.html#method.create_new"
      },
      "moduleId": "track-cli",
      "duration": 35,
      "starterCode": "use std::collections::BTreeSet;\nfn validate_plan(items: &[(&str, u64, u64)]) -> Result<(), &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(validate_plan(&[]), Ok(()));\n    assert_eq!(validate_plan(&[(\"a\", 2, 2), (\"b\", 3, 3)]), Ok(()));\n    assert_eq!(validate_plan(&[(\"a\", 2, 3)]), Err(\"changed\"));\n    assert_eq!(validate_plan(&[(\"a\", 2, 2), (\"a\", 3, 3)]), Err(\"duplicate\"));\n    println!(\"Kế hoạch được kiểm tra trước khi ghi\");\n}",
      "solutionCode": "use std::collections::BTreeSet;\nfn validate_plan(items: &[(&str, u64, u64)]) -> Result<(), &'static str> {\n    let mut targets = BTreeSet::new();\n    for &(target, expected, current) in items {\n        if !targets.insert(target) { return Err(\"duplicate\"); }\n        if expected != current { return Err(\"changed\"); }\n    }\n    Ok(())\n}\nfn main() {\n    assert_eq!(validate_plan(&[]), Ok(()));\n    assert_eq!(validate_plan(&[(\"a\", 2, 2), (\"b\", 3, 3)]), Ok(()));\n    assert_eq!(validate_plan(&[(\"a\", 2, 3)]), Err(\"changed\"));\n    assert_eq!(validate_plan(&[(\"a\", 2, 2), (\"a\", 3, 3)]), Err(\"duplicate\"));\n    println!(\"Kế hoạch được kiểm tra trước khi ghi\");\n}"
    },
    {
      "id": "cli-child-processes",
      "title": "Tiến trình con, đối số và vòng đời I/O",
      "description": "Gọi công cụ khác bằng Command, quản lý pipe và phân biệt lỗi spawn với mã thoát.",
      "objectives": [
        "Truyền đối số không ghép shell.",
        "Thu stdout/stderr mà không tự tạo deadlock.",
        "Thiết kế timeout và cleanup của child."
      ],
      "sections": [
        {
          "title": "Đối số không phải một câu shell",
          "text": "Command::new nhận chương trình cần chạy, còn arg và args nhận từng đối số. Chuỗi đường dẫn có khoảng trắng vẫn là một đối số nếu truyền đúng API; không cần tự thêm dấu quote vào giá trị. Ghép dữ liệu người dùng vào sh -c tạo thêm một lớp ngữ pháp với phép mở rộng và ký tự điều khiển. Khi yêu cầu chỉ là gọi một chương trình, tránh lớp shell đó. Trên Windows, quy tắc diễn giải đối số của từng chương trình và batch script có khác biệt; hãy giới hạn chương trình được hỗ trợ và kiểm thử trên nền tảng đích thay vì giả định mọi child giống nhau."
        },
        {
          "title": "Spawn thành công chưa phải tác vụ thành công",
          "text": "Lỗi tạo tiến trình như chương trình không tồn tại được trả qua Result của spawn hoặc output. Một chương trình đã chạy rồi trả mã thất bại là tình huống khác, nằm trong ExitStatus. Không dùng một thông báo chung cho cả hai vì cách khắc phục khác nhau. stdout là dữ liệu kết quả; stderr có thể chứa cảnh báo ngay cả khi status thành công. Có công cụ không in gì khi thất bại, nên trạng thái phải là nguồn quyết định theo hợp đồng. Giới hạn nội dung được đính kèm thông báo lỗi để một child ồn ào không làm log của tiến trình cha phình lên."
        },
        {
          "title": "Hai pipe có thể chặn lẫn nhau",
          "text": "Nếu cha ghi toàn bộ stdin trước khi đọc stdout, child có thể lấp đầy pipe stdout rồi chờ cha đọc, trong khi cha chờ child đọc stdin. Hai bên cùng chờ tạo deadlock. Dùng thread hoặc runtime để đọc và ghi đồng thời, hoặc tận dụng output cho trường hợp input và dung lượng phù hợp. output thu dữ liệu vào bộ nhớ; nó không phải giải pháp streaming không giới hạn. Khi spawn với nhiều pipe, phải quản lý cả stdout và stderr. Đóng stdin sau khi gửi xong để child nhận EOF, nếu không child có thể chờ thêm dữ liệu mãi."
        },
        {
          "title": "Timeout bao gồm dọn dẹp",
          "text": "Timeout của tác vụ cha không tự kết thúc mọi child đã tạo. Cần chính sách dừng child, đợi nó kết thúc để thu hồi tài nguyên và quyết định xử lý các tiến trình cháu. Cách quản lý nhóm tiến trình phụ thuộc hệ điều hành; một timeout quanh vòng chờ đơn giản chưa giải quyết toàn bộ cây tiến trình. Bài tập chỉ phân loại ba kết quả thuần: không spawn được, child thất bại và thành công. Khi đưa vào ứng dụng, hãy test một helper executable do chính dự án kiểm soát, cho nó in stderr, ngủ hoặc nhận đối số có khoảng trắng để tái hiện hành vi một cách ổn định."
        }
      ],
      "tip": "Đối số chứa khoảng trắng được truyền như một phần tử args; không thêm dấu quote vào chính chuỗi đó.",
      "exercise": {
        "title": "Phân loại kết quả tiến trình",
        "instructions": "Classify nhận kết quả spawn giả lập: Err là spawn; Ok((false,_)) là exit; Ok((true, bytes)) trả số bytes stdout.",
        "requirements": [
          "Không dùng stderr để đoán status.",
          "Giữ lỗi spawn khác exit.",
          "Thành công với stdout rỗng vẫn hợp lệ."
        ]
      },
      "expectedOutput": "Spawn, status và dữ liệu được tách riêng",
      "hints": [
        "Match lớp Result ngoài trước.",
        "Vec rỗng không biểu thị lỗi."
      ],
      "quiz": {
        "question": "Cha ghi input lớn vào child rồi mới đọc stdout có nguy cơ gì?",
        "options": [
          "Hai pipe đầy có thể khiến cả cha và child cùng chờ.",
          "Chỉ có nguy cơ sai UTF-8.",
          "Rust tự sắp xếp mọi pipe nên luôn an toàn."
        ],
        "correct": 0,
        "explanation": "Child chờ cha đọc stdout nên ngừng đọc stdin; cha lại đang chờ ghi stdin. Cần đọc/ghi đồng thời và quản lý EOF."
      },
      "reference": {
        "label": "Rust process I/O",
        "url": "https://doc.rust-lang.org/std/process/index.html"
      },
      "moduleId": "track-cli",
      "duration": 35,
      "starterCode": "\nfn classify(result: Result<(bool, Vec<u8>), ()>) -> Result<usize, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(classify(Err(())), Err(\"spawn\"));\n    assert_eq!(classify(Ok((false, b\"partial\".to_vec()))), Err(\"exit\"));\n    assert_eq!(classify(Ok((true, vec![]))), Ok(0));\n    assert_eq!(classify(Ok((true, b\"ok\".to_vec()))), Ok(2));\n    println!(\"Spawn, status và dữ liệu được tách riêng\");\n}",
      "solutionCode": "\nfn classify(result: Result<(bool, Vec<u8>), ()>) -> Result<usize, &'static str> {\n    match result {\n        Err(()) => Err(\"spawn\"),\n        Ok((false, _)) => Err(\"exit\"),\n        Ok((true, bytes)) => Ok(bytes.len()),\n    }\n}\nfn main() {\n    assert_eq!(classify(Err(())), Err(\"spawn\"));\n    assert_eq!(classify(Ok((false, b\"partial\".to_vec()))), Err(\"exit\"));\n    assert_eq!(classify(Ok((true, vec![]))), Ok(0));\n    assert_eq!(classify(Ok((true, b\"ok\".to_vec()))), Ok(2));\n    println!(\"Spawn, status và dữ liệu được tách riêng\");\n}"
    },
    {
      "id": "cli-machine-output",
      "title": "Đầu ra cho máy và khả năng tương thích",
      "description": "Thiết kế JSON Lines, phiên bản schema và lỗi từng phần cho pipeline tự động.",
      "objectives": [
        "Tách trình bày cho người khỏi dữ liệu cho máy.",
        "Giữ thứ tự và schema ổn định.",
        "Diễn tả bản ghi bị bỏ hoặc đầu ra chưa hoàn chỉnh."
      ],
      "sections": [
        {
          "title": "Một đầu ra phục vụ một hợp đồng",
          "text": "Bảng căn lề phù hợp terminal nhưng khó parse khi tên có khoảng trắng hoặc cột thay đổi. Định dạng máy nên có trường có tên, kiểu dữ liệu rõ và quy tắc escaping, chẳng hạn JSON Lines cho stream nhiều bản ghi. Mỗi dòng cần là một JSON hoàn chỉnh; không chen thanh tiến trình hay dòng chào mừng vào stdout. stderr dành cho thông tin vận hành. Khi người dùng chọn --format jsonl, không tự đổi sang bảng vì phát hiện terminal. Tính quyết định của cờ phải mạnh hơn các tiện ích trình bày tự động để script luôn nhận đúng định dạng đã yêu cầu."
        },
        {
          "title": "Schema có tuổi đời dài hơn một phiên chạy",
          "text": "Trường duration_ms nên luôn là số với cùng đơn vị, không lúc là chuỗi 12ms và lúc là số 12. ID có thể vượt giới hạn số nguyên chính xác của một consumer; chọn chuỗi hay số từ đầu theo hệ sinh thái cần hỗ trợ. Thêm schema_version cho phép bên nhận kiểm tra khả năng tương thích. Đổi tên, đổi kiểu hoặc đổi ý nghĩa trường là thay đổi phá hợp đồng dù JSON vẫn parse được. Thêm trường tùy chọn thường dễ tương thích hơn, nhưng chỉ khi consumer thực sự được thiết kế bỏ qua trường lạ. Golden test giúp nhận ra thay đổi ngoài ý muốn."
        },
        {
          "title": "Thứ tự và hoàn tất cần được định nghĩa",
          "text": "Khi nhiều worker xử lý các tệp khác nhau, thứ tự hoàn thành có thể thay đổi giữa các lần chạy. Nếu hợp đồng yêu cầu thứ tự input, gắn số thứ tự cho công việc rồi gom kết quả theo khóa đó. Tuy vậy một công việc đầu tiên rất chậm có thể làm bộ đệm reorder tăng; cần giới hạn số công việc đang bay. Với stream, người nhận có thể đã đọc nhiều kết quả trước khi thấy lỗi. Có thể dùng một bản ghi summary cuối cùng với complete và số lỗi, đồng thời trả status phù hợp. Không coi thiếu summary là thành công khi tiến trình có thể bị dừng giữa chừng."
        },
        {
          "title": "Kiểm thử như một consumer thật",
          "text": "Đừng chỉ so chuỗi đầu ra có chứa một từ khóa. Parse từng dòng bằng parser của định dạng, kiểm tra schema_version, kiểu trường, số bản ghi và quy tắc thứ tự. Test tên chứa quote, newline, Unicode và ký tự điều khiển. Đầu ra stderr phải được kiểm tra độc lập để bảo đảm thông báo tiến độ không lẫn vào dữ liệu. Bài tập dùng phép tổng hợp các kết quả có index, phát hiện trùng index và sắp lại theo thứ tự. Trong dự án dùng serializer để escape JSON; tự nối chuỗi bằng format chỉ thích hợp khi mọi trường được giới hạn chặt và đã chứng minh tính đúng."
        }
      ],
      "tip": "Một dòng tiến độ vô tình đi vào stdout có thể phá toàn bộ pipeline JSON Lines.",
      "exercise": {
        "title": "Khôi phục thứ tự kết quả",
        "instructions": "Nhận các cặp index và dữ liệu; từ chối index lặp, trả dữ liệu theo index tăng dần.",
        "requirements": [
          "Không phụ thuộc thứ tự worker hoàn thành.",
          "Danh sách rỗng trả rỗng.",
          "Phát hiện bản ghi trùng thay vì âm thầm ghi đè."
        ]
      },
      "expectedOutput": "Kết quả máy đọc giữ thứ tự ổn định",
      "hints": [
        "BTreeMap duyệt khóa theo thứ tự.",
        "insert trả giá trị cũ khi khóa trùng."
      ],
      "quiz": {
        "question": "Worker hoàn thành khác thứ tự input, nhưng CLI hứa giữ thứ tự input. Cần bổ sung gì?",
        "options": [
          "Index công việc và bộ đệm reorder có giới hạn.",
          "Đợi mọi worker rồi bỏ index.",
          "Dùng stdout làm khóa sắp xếp."
        ],
        "correct": 0,
        "explanation": "Index gắn kết quả với input. Giới hạn số công việc đang xử lý tránh bộ đệm tăng vô hạn khi một công việc đầu chậm."
      },
      "reference": {
        "label": "Command Line Applications — machine communication",
        "url": "https://rust-cli.github.io/book/in-depth/machine-communication.html"
      },
      "moduleId": "track-cli",
      "duration": 35,
      "starterCode": "use std::collections::BTreeMap;\nfn ordered(items: &[(usize, &str)]) -> Result<Vec<String>, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(ordered(&[(2, \"c\"), (0, \"a\"), (1, \"b\")]), Ok(vec![\"a\".into(), \"b\".into(), \"c\".into()]));\n    assert_eq!(ordered(&[(1, \"a\"), (1, \"b\")]), Err(\"duplicate\"));\n    assert_eq!(ordered(&[]), Ok(Vec::<String>::new()));\n    println!(\"Kết quả máy đọc giữ thứ tự ổn định\");\n}",
      "solutionCode": "use std::collections::BTreeMap;\nfn ordered(items: &[(usize, &str)]) -> Result<Vec<String>, &'static str> {\n    let mut map = BTreeMap::new();\n    for &(index, value) in items {\n        if map.insert(index, value.to_owned()).is_some() { return Err(\"duplicate\"); }\n    }\n    Ok(map.into_values().collect())\n}\nfn main() {\n    assert_eq!(ordered(&[(2, \"c\"), (0, \"a\"), (1, \"b\")]), Ok(vec![\"a\".into(), \"b\".into(), \"c\".into()]));\n    assert_eq!(ordered(&[(1, \"a\"), (1, \"b\")]), Err(\"duplicate\"));\n    assert_eq!(ordered(&[]), Ok(Vec::<String>::new()));\n    println!(\"Kết quả máy đọc giữ thứ tự ổn định\");\n}"
    },
    {
      "id": "cli-cancellation",
      "title": "Dừng có kiểm soát, checkpoint và chạy lại",
      "description": "Quản lý công việc đang chạy khi hủy tác vụ và phân biệt hoàn thành với đã lưu tiến độ.",
      "objectives": [
        "Xác định điểm hủy an toàn.",
        "Ghi checkpoint sau kết quả bền vững.",
        "Thiết kế tác vụ chạy lại được."
      ],
      "sections": [
        {
          "title": "Hủy là một trạng thái của hệ thống",
          "text": "Khi người dùng dừng lệnh xử lý nhiều tệp, ứng dụng cần ngừng nhận thêm việc, xử lý các công việc đang bay theo chính sách và kết thúc trong thời gian hữu hạn. Một biến cờ cancel không tự ngắt một lời gọi I/O đang bị chặn. Worker chỉ quan sát cờ tại các điểm kiểm tra; vì thế phải chia công việc đủ nhỏ và giới hạn thời gian hoặc kích thước phù hợp. Đừng hủy giữa một cập nhật cần tính nguyên tử nếu chưa có cơ chế khôi phục. Với thao tác chỉ đọc, bỏ kết quả dang dở thường đơn giản hơn thao tác đã tạo hoặc sửa tệp."
        },
        {
          "title": "Hoàn thành và checkpoint phải cùng nghĩa",
          "text": "Giả sử công cụ kiểm tra tệp rồi ghi kết quả vào một thư mục report. Checkpoint chỉ nên đánh dấu hoàn thành sau khi kết quả tương ứng đã được ghi theo mức độ bền vững đã công bố. Nếu đánh dấu trước, crash có thể khiến lần chạy lại bỏ qua công việc chưa có kết quả. Nếu ghi kết quả trước rồi crash trước checkpoint, lần chạy lại có thể làm công việc đó thêm lần nữa. Chọn thao tác idempotent hoặc chấp nhận xử lý ít nhất một lần với cơ chế nhận diện kết quả. Một cờ done trong RAM chưa phải bằng chứng phục hồi sau khi tiến trình mất."
        },
        {
          "title": "Khóa nhận diện phải gắn với dữ liệu",
          "text": "Đường dẫn không đủ để nhận diện một công việc đã hoàn thành nếu nội dung tại đường dẫn có thể thay đổi. Khóa checkpoint nên chứa hoặc liên kết với fingerprint input, phiên bản thuật toán và cấu hình ảnh hưởng kết quả. Độ dài hoặc thời gian sửa tệp hữu ích để phát hiện nhanh nhưng không chứng minh nội dung giống nhau. Hash phù hợp làm cache key cần được chọn theo nguy cơ va chạm và mục tiêu, không gọi mọi checksum là bảo mật. Khi đổi schema checkpoint, phải từ chối phiên bản không hỗ trợ hoặc có bước chuyển đổi, tránh đọc nhầm dữ liệu cũ như trạng thái mới."
        },
        {
          "title": "Quan sát tiến độ và kiểm thử crash",
          "text": "Một bài test quan trọng dừng chương trình ngay sau khi xuất kết quả nhưng trước checkpoint, sau đó chạy tiếp và đối chiếu trạng thái cuối. Test khác sửa input giữa hai lần chạy để kiểm tra cache có bị dùng sai không. Số processed, skipped, failed và pending cần khớp danh sách công việc, không chỉ là phần trăm đẹp trên terminal. Bài tập mô phỏng chọn việc còn lại từ danh sách fingerprint và checkpoint; chỉ bỏ qua khi cả ID lẫn fingerprint khớp. Trong capstone, dùng fixture trên đĩa và nút dừng theo số công việc để tái hiện điểm gián đoạn một cách xác định trước khi thêm xử lý tín hiệu thật."
        }
      ],
      "tip": "Checkpoint không nên đi trước dữ liệu mà nó tuyên bố đã hoàn thành.",
      "exercise": {
        "title": "Chọn công việc cần chạy lại",
        "instructions": "Trả ID công việc chưa có checkpoint khớp fingerprint. Giữ thứ tự danh sách jobs.",
        "requirements": [
          "ID trùng nhưng fingerprint khác vẫn chạy lại.",
          "Không sửa checkpoint.",
          "Danh sách rỗng trả rỗng."
        ]
      },
      "expectedOutput": "Chỉ bỏ qua công việc có input khớp",
      "hints": [
        "So sánh Option<&u64> từ map với Some(&hash).",
        "filter_map giữ thứ tự duyệt gốc."
      ],
      "quiz": {
        "question": "Crash xảy ra sau khi lưu kết quả nhưng trước checkpoint. Thiết kế nên xử lý thế nào?",
        "options": [
          "Giả định công việc chưa từng chạy.",
          "Cho phép chạy lại an toàn và nhận diện kết quả đã có.",
          "Đánh dấu mọi việc còn lại là xong."
        ],
        "correct": 1,
        "explanation": "Khoảng trống giữa kết quả và checkpoint có thể gây chạy lại. Cần tính idempotent hoặc cơ chế đối chiếu, không giả định exactly-once."
      },
      "reference": {
        "label": "Rust atomic operations",
        "url": "https://doc.rust-lang.org/std/sync/atomic/index.html"
      },
      "moduleId": "track-cli",
      "duration": 35,
      "starterCode": "use std::collections::BTreeMap;\nfn pending(jobs: &[(u64, u64)], done: &BTreeMap<u64, u64>) -> Vec<u64> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    let done = BTreeMap::from([(1, 100), (2, 200)]);\n    assert_eq!(pending(&[(1, 100), (2, 201), (3, 300)], &done), vec![2, 3]);\n    assert_eq!(pending(&[], &done), Vec::<u64>::new());\n    assert_eq!(pending(&[(1, 100)], &done), Vec::<u64>::new());\n    println!(\"Chỉ bỏ qua công việc có input khớp\");\n}",
      "solutionCode": "use std::collections::BTreeMap;\nfn pending(jobs: &[(u64, u64)], done: &BTreeMap<u64, u64>) -> Vec<u64> {\n    jobs.iter().filter_map(|&(id, hash)| {\n        if done.get(&id) == Some(&hash) { None } else { Some(id) }\n    }).collect()\n}\nfn main() {\n    let done = BTreeMap::from([(1, 100), (2, 200)]);\n    assert_eq!(pending(&[(1, 100), (2, 201), (3, 300)], &done), vec![2, 3]);\n    assert_eq!(pending(&[], &done), Vec::<u64>::new());\n    assert_eq!(pending(&[(1, 100)], &done), Vec::<u64>::new());\n    println!(\"Chỉ bỏ qua công việc có input khớp\");\n}",
      "simulation": {
        "title": "Kết quả và checkpoint qua một lần gián đoạn",
        "description": "Tách dữ liệu đã tính khỏi trạng thái đủ bền vững để bỏ qua ở lần chạy tiếp.",
        "kind": "timeline",
        "nodes": [
          {
            "id": "input",
            "label": "Input",
            "detail": "Tệp và fingerprint"
          },
          {
            "id": "compute",
            "label": "Xử lý",
            "detail": "Kiểm tra và tính kết quả"
          },
          {
            "id": "state",
            "label": "Checkpoint",
            "detail": "Ghi kết quả đã hoàn thành"
          },
          {
            "id": "resume",
            "label": "Chạy tiếp",
            "detail": "So input hiện tại với checkpoint"
          }
        ],
        "scenarios": [
          {
            "id": "cli-checkpoint-ok",
            "label": "Hoàn tất bình thường",
            "steps": [
              {
                "title": "Nhận input",
                "description": "Tệp A có fingerprint h1.",
                "activeNodeIds": [
                  "input"
                ],
                "values": [
                  {
                    "label": "file",
                    "value": "A"
                  },
                  {
                    "label": "hash",
                    "value": "h1"
                  },
                  {
                    "label": "checkpoint",
                    "value": "chưa có"
                  }
                ]
              },
              {
                "title": "Validation đạt",
                "description": "Tính được 20 record hợp lệ.",
                "activeNodeIds": [
                  "compute"
                ],
                "values": [
                  {
                    "label": "rows",
                    "value": "20"
                  },
                  {
                    "label": "durable",
                    "value": "false"
                  }
                ]
              },
              {
                "title": "Ghi tiến độ",
                "description": "Ghi và sync checkpoint sau xử lý.",
                "activeNodeIds": [
                  "state"
                ],
                "values": [
                  {
                    "label": "rows",
                    "value": "20"
                  },
                  {
                    "label": "checkpoint",
                    "value": "A:h1"
                  },
                  {
                    "label": "durable",
                    "value": "true"
                  }
                ]
              },
              {
                "title": "Chạy lại",
                "description": "Hash khớp nên A được bỏ qua.",
                "activeNodeIds": [
                  "resume"
                ],
                "values": [
                  {
                    "label": "processed",
                    "value": "0"
                  },
                  {
                    "label": "skipped",
                    "value": "1"
                  }
                ]
              }
            ]
          },
          {
            "id": "cli-checkpoint-crash",
            "label": "Dừng trước checkpoint",
            "steps": [
              {
                "title": "Nhận input",
                "description": "Tệp A chưa có trạng thái hoàn thành.",
                "activeNodeIds": [
                  "input"
                ],
                "values": [
                  {
                    "label": "file",
                    "value": "A"
                  },
                  {
                    "label": "hash",
                    "value": "h1"
                  }
                ]
              },
              {
                "title": "Tính xong rồi bị dừng",
                "description": "RAM có kết quả nhưng chưa có checkpoint.",
                "activeNodeIds": [
                  "compute"
                ],
                "values": [
                  {
                    "label": "rows",
                    "value": "20"
                  },
                  {
                    "label": "checkpoint",
                    "value": "chưa có"
                  }
                ]
              },
              {
                "title": "Khởi động lại",
                "description": "Đọc state không tìm thấy A:h1.",
                "activeNodeIds": [
                  "resume"
                ],
                "values": [
                  {
                    "label": "skipped",
                    "value": "0"
                  },
                  {
                    "label": "decision",
                    "value": "chạy lại"
                  }
                ]
              },
              {
                "title": "Xử lý lại an toàn",
                "description": "Baseline chỉ đọc input nên không tạo tác dụng phụ trùng.",
                "activeNodeIds": [
                  "compute"
                ],
                "values": [
                  {
                    "label": "processed",
                    "value": "1"
                  },
                  {
                    "label": "rows",
                    "value": "20"
                  }
                ]
              },
              {
                "title": "Lưu checkpoint",
                "description": "Chỉ từ thời điểm này mới được bỏ qua lần sau.",
                "activeNodeIds": [
                  "state"
                ],
                "values": [
                  {
                    "label": "checkpoint",
                    "value": "A:h1"
                  },
                  {
                    "label": "durable",
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
      "id": "cli-process-tests",
      "title": "Kiểm thử CLI ở ranh giới tiến trình",
      "description": "Dùng binary thật để kiểm tra argv, mã thoát, stdout, stderr và lỗi I/O.",
      "objectives": [
        "Phân biệt unit test với process integration test.",
        "Tạo fixture độc lập và dọn dẹp có kiểm soát.",
        "Kiểm thử trường hợp lỗi thay vì chỉ đường thành công."
      ],
      "sections": [
        {
          "title": "Thư viện đúng chưa đủ cho binary đúng",
          "text": "Hàm lọc log có thể vượt mọi unit test nhưng main vẫn mở nhầm tệp, gửi lỗi vào stdout hoặc luôn trả 0. Integration test chạy executable thật sẽ kiểm tra lớp lắp ghép này. Cargo cung cấp đường dẫn binary của package qua biến CARGO_BIN_EXE_<tên> cho integration test. Dùng Command truyền từng đối số như người dùng, thu Output rồi kiểm tra cả status, stdout và stderr. Các lớp kiểm thử bổ sung nhau: unit test tập trung nhiều tình huống thuật toán, process test tập trung hợp đồng và kết nối với môi trường thực thi."
        },
        {
          "title": "Fixture cần cô lập và có chủ đích",
          "text": "Mỗi test tạo thư mục tạm riêng thay vì dùng một tên chung trong /tmp. Có thể dùng crate chuyên dụng hoặc kết hợp process ID với bộ đếm và create_dir để phát hiện trùng. Chỉ dọn thư mục do test vừa tạo, không nhận đường dẫn dọn từ input không kiểm soát. Fixture nên có tên chứa khoảng trắng và Unicode, nội dung CRLF, tệp rỗng và EOF không newline. Đối với symlink hoặc quyền truy cập, gắn điều kiện nền tảng và giải thích điều gì chưa được kiểm tra trên hệ điều hành khác. Thất bại của test quyền khi chạy đặc quyền không tự chứng minh sản phẩm sai."
        },
        {
          "title": "Lỗi đọc, ghi và pipe là ba đường khác nhau",
          "text": "Đầu vào không tồn tại kiểm tra nhánh mở tệp, nhưng chưa kiểm tra lỗi xảy ra sau một phần dữ liệu. Với lõi generic BufRead và Write, tạo reader hoặc writer giả trả lỗi sau một số byte để chứng minh lỗi không bị nuốt. BrokenPipe có thể là kết thúc bình thường của pipeline tìm kiếm khi consumer đã đủ dữ liệu; chính sách cụ thể phải khớp loại CLI. Không gọi println rải rác trong thư viện nếu cần kiểm soát lỗi ghi. Một writer được truyền vào giúp test kiểm tra cả dữ liệu và cách xử lý lỗi mà không thay stdout toàn cục."
        },
        {
          "title": "Assertion phải diễn đạt hợp đồng",
          "text": "Snapshot toàn bộ help có thể nhạy với phiên bản parser và chiều rộng terminal. Nên kiểm tra các thành phần bắt buộc như usage, cờ chính và ví dụ, rồi snapshot có chọn lọc cho định dạng bạn quản lý. Với JSON, parse cấu trúc thay vì phụ thuộc khoảng trắng. Với đầu ra văn bản cam kết ổn định, so byte là phù hợp. Bài tập viết một hàm emit nhận Write; writer cố tình hết dung lượng phải làm hàm trả lỗi thay vì báo thành công. Trong dự án, bổ sung process test cho lỗi đối số, input hỏng và chạy lại sau gián đoạn, vì đây là các đường ảnh hưởng trực tiếp đến script vận hành."
        }
      ],
      "tip": "Một test CLI hoàn chỉnh kiểm tra status, stdout và stderr như ba đầu ra riêng biệt.",
      "exercise": {
        "title": "Không nuốt lỗi writer",
        "instructions": "Viết emit dùng write_all cho mỗi dòng và newline. Trả lỗi ngay khi writer từ chối ghi.",
        "requirements": [
          "Writer rỗng vẫn được truyền bằng mutable reference.",
          "Bảo toàn lỗi I/O.",
          "Không dùng println trong hàm thư viện."
        ]
      },
      "expectedOutput": "Lỗi ghi được trả về người gọi",
      "hints": [
        "write_all xử lý trường hợp write chỉ ghi được một phần.",
        "Dùng ? cho cả nội dung và newline."
      ],
      "quiz": {
        "question": "Unit test parser và thuật toán đều đạt nhưng main luôn exit 0. Test nào phát hiện trực tiếp?",
        "options": [
          "Test kích thước struct.",
          "Test binary thật với input lỗi và kiểm tra status.",
          "Chỉ đo benchmark thuật toán."
        ],
        "correct": 1,
        "explanation": "Mã thoát là hành vi ở ranh giới tiến trình; cần chạy binary hoặc tách main thành hàm có kết quả test được."
      },
      "reference": {
        "label": "Cargo integration tests",
        "url": "https://doc.rust-lang.org/cargo/reference/cargo-targets.html#integration-tests"
      },
      "moduleId": "track-cli",
      "duration": 35,
      "starterCode": "use std::io::{self, Write};\nfn emit<W: Write>(out: &mut W, lines: &[&str]) -> io::Result<()> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nstruct Fail;\nimpl Write for Fail {\n    fn write(&mut self, _: &[u8]) -> io::Result<usize> { Err(io::Error::other(\"disk full\")) }\n    fn flush(&mut self) -> io::Result<()> { Ok(()) }\n}\nfn main() {\n    let mut bytes = Vec::new();\n    emit(&mut bytes, &[\"một\", \"hai\"]).unwrap();\n    assert_eq!(bytes, \"một\\nhai\\n\".as_bytes());\n    assert!(emit(&mut Fail, &[\"x\"]).is_err());\n    assert!(emit(&mut Fail, &[]).is_ok());\n    println!(\"Lỗi ghi được trả về người gọi\");\n}",
      "solutionCode": "use std::io::{self, Write};\nfn emit<W: Write>(out: &mut W, lines: &[&str]) -> io::Result<()> {\n    for line in lines {\n        out.write_all(line.as_bytes())?;\n        out.write_all(b\"\\n\")?;\n    }\n    Ok(())\n}\nstruct Fail;\nimpl Write for Fail {\n    fn write(&mut self, _: &[u8]) -> io::Result<usize> { Err(io::Error::other(\"disk full\")) }\n    fn flush(&mut self) -> io::Result<()> { Ok(()) }\n}\nfn main() {\n    let mut bytes = Vec::new();\n    emit(&mut bytes, &[\"một\", \"hai\"]).unwrap();\n    assert_eq!(bytes, \"một\\nhai\\n\".as_bytes());\n    assert!(emit(&mut Fail, &[\"x\"]).is_err());\n    assert!(emit(&mut Fail, &[]).is_ok());\n    println!(\"Lỗi ghi được trả về người gọi\");\n}"
    },
    {
      "id": "cli-release-contracts",
      "title": "Bản phát hành, hỗ trợ nền tảng và nâng cấp",
      "description": "Bàn giao một công cụ có thể cài, kiểm chứng và nâng cấp mà không phá pipeline.",
      "objectives": [
        "Xác định ma trận nền tảng có bằng chứng.",
        "Phân biệt build reproducibility với tính đúng.",
        "Lập hợp đồng nâng cấp cho CLI và schema."
      ],
      "sections": [
        {
          "title": "Artifact phải phù hợp môi trường chạy",
          "text": "Một binary biên dịch trên máy phát triển chưa chắc chạy được trên máy người dùng. Target triple mô tả kiến trúc và môi trường ABI, nhưng các thư viện động, phiên bản hệ điều hành tối thiểu và CPU features cũng ảnh hưởng. Hãy công bố các nền tảng đã chạy smoke test thật, khác với các target chỉ biên dịch thành công. Tệp phát hành cần tên có phiên bản và target để tránh cài nhầm. Khi hỗ trợ Windows, kiểm tra đường dẫn, newline, mã hóa terminal và hành vi rename; khi hỗ trợ Unix, kiểm tra quyền thực thi và tín hiệu dừng."
        },
        {
          "title": "Khóa dependency không thay thế kiểm thử",
          "text": "Cargo.lock ghi lựa chọn dependency cụ thể cho lần resolve, giúp ứng dụng tái sử dụng bộ phiên bản đó. cargo build --locked yêu cầu lockfile phù hợp, nhưng không chứng minh output byte giống nhau trên mọi máy hay không có lỗi. Toolchain, native linker, biến môi trường và build script có thể ảnh hưởng kết quả. Lưu thông tin toolchain và câu lệnh build trong quy trình phát hành để điều tra. Với gói nguồn, kiểm tra cargo package và nội dung được đóng gói; một fixture bị bỏ sót có thể khiến test chỉ đạt trong checkout đầy đủ mà thất bại ở bản phân phối."
        },
        {
          "title": "Nâng cấp cả giao diện và dữ liệu",
          "text": "Đổi mặc định từ case-sensitive sang case-insensitive có thể làm pipeline trả nhiều kết quả dù không đổi tên cờ. Đổi mã thoát của tình huống không khớp cũng có thể phá script. Vì thế release note nên mô tả hành vi quan sát được, đường chuyển đổi và thời điểm loại bỏ cờ cũ. Schema output và checkpoint cần version riêng nếu nhịp thay đổi khác binary. Khi đọc state từ bản mới hơn, từ chối với lỗi rõ thay vì đoán. Không tự ghi đè checkpoint của bản khác nếu chưa có migration đã kiểm tra và khả năng quay lại khi thao tác chuyển đổi thất bại."
        },
        {
          "title": "Nghiệm thu bằng một máy sạch",
          "text": "Bài bàn giao gồm archive, hướng dẫn cài ngắn, ví dụ có fixture, checksum artifact và kết quả smoke test. Checksum giúp phát hiện bytes khác nhau khi tải; nó không tự xác minh danh tính bên phát hành nếu được tải từ cùng nguồn bị sửa. Chạy lệnh help, một phiên xử lý hợp lệ và một trường hợp lỗi trên môi trường sạch. Kiểm tra exit code và không đòi đường dẫn tuyệt đối của máy tác giả. Bài tập mô hình hóa khả năng đọc schema theo một khoảng hỗ trợ; capstone cần kết hợp điều kiện này với lockfile, kiểm tra nâng cấp và tài liệu giới hạn được viết từ bằng chứng thực tế."
        }
      ],
      "tip": "Ghi rõ target đã chạy test; build thành công không phải bằng chứng chạy thành công trên hệ điều hành đó.",
      "exercise": {
        "title": "Kiểm tra phiên bản dữ liệu được hỗ trợ",
        "instructions": "Chấp nhận schema trong min..=max, trả lỗi cấu hình khi min > max; không tự nâng hoặc hạ schema.",
        "requirements": [
          "Hai đầu khoảng đều được chấp nhận.",
          "Schema tương lai bị từ chối.",
          "Khoảng sai là lỗi khác với schema không hỗ trợ."
        ]
      },
      "expectedOutput": "Chỉ đọc schema nằm trong phạm vi hỗ trợ",
      "hints": [
        "Kiểm tra range trước.",
        "contains bao gồm cả hai đầu của RangeInclusive."
      ],
      "quiz": {
        "question": "cargo build --locked thành công chứng minh điều gì?",
        "options": [
          "Ứng dụng đã chạy trên mọi target.",
          "Không cần test tích hợp nữa.",
          "Build dùng lockfile phù hợp mà không cập nhật resolve ngoài yêu cầu."
        ],
        "correct": 2,
        "explanation": "--locked kiểm soát việc thay lockfile. Nó không chứng minh tính đúng, tính tương thích runtime hay reproducibility byte tuyệt đối."
      },
      "reference": {
        "label": "Cargo build locked",
        "url": "https://doc.rust-lang.org/cargo/commands/cargo-build.html#manifest-options"
      },
      "moduleId": "track-cli",
      "duration": 35,
      "starterCode": "\nfn readable(schema: u32, min: u32, max: u32) -> Result<bool, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(readable(2, 1, 2), Ok(true));\n    assert_eq!(readable(1, 1, 2), Ok(true));\n    assert_eq!(readable(3, 1, 2), Ok(false));\n    assert_eq!(readable(0, 1, 2), Ok(false));\n    assert_eq!(readable(2, 3, 1), Err(\"range\"));\n    println!(\"Chỉ đọc schema nằm trong phạm vi hỗ trợ\");\n}",
      "solutionCode": "\nfn readable(schema: u32, min: u32, max: u32) -> Result<bool, &'static str> {\n    if min > max { return Err(\"range\"); }\n    Ok((min..=max).contains(&schema))\n}\nfn main() {\n    assert_eq!(readable(2, 1, 2), Ok(true));\n    assert_eq!(readable(1, 1, 2), Ok(true));\n    assert_eq!(readable(3, 1, 2), Ok(false));\n    assert_eq!(readable(0, 1, 2), Ok(false));\n    assert_eq!(readable(2, 3, 1), Err(\"range\"));\n    println!(\"Chỉ đọc schema nằm trong phạm vi hỗ trợ\");\n}"
    },
    {
      "id": "cli-log-project",
      "title": "Dự án: Logcheck cho pipeline vận hành",
      "description": "Xây công cụ lọc log bằng clap, đọc streaming và xuất JSON Lines kiểm thử được.",
      "duration": 90,
      "objectives": [
        "Ghép parser clap với lõi BufRead/Write.",
        "Kiểm tra hợp đồng stdout, stderr và mã thoát.",
        "Giữ giới hạn từng record và xử lý lỗi giữa stream."
      ],
      "sections": [
        {
          "title": "Bài toán và tiêu chí giao hàng",
          "text": "Nhóm vận hành có log dạng level, duration_ms và message, ngăn cách bằng tab. Họ cần lọc ERROR từ tệp hoặc stdin và gửi JSON Lines cho bước xử lý tiếp theo. Sản phẩm đầu tiên chỉ chấp nhận ba level INFO, WARN, ERROR; duration từ 0 đến 60000; message không chứa tab. Đây là quyết định về định dạng, không phải khả năng của mọi log ngoài thực tế. Thành công cần giữ số dòng gốc, thông điệp Unicode và không chèn thông báo tiến độ vào stdout. Trường hợp không khớp khác với trường hợp không đọc được dữ liệu."
        },
        {
          "title": "Đi qua cấu trúc mã nguồn",
          "text": "Cargo.toml bật derive của clap. Struct Cli dùng Option<PathBuf> để việc không đưa input có nghĩa đọc stdin, và giới hạn tập giá trị --level ngay tại parser. Hàm run nhận BufRead và Write, nên File, stdin và Cursor dùng chung logic. read_record đọc từ fill_buf rồi consume từng phần, kiểm tra ngân sách trước khi nối vào Vec. Parser trả Record chứa chuỗi mượn từ buffer; serializer phải dùng record trước vòng đọc kế tiếp khi buffer được tái sử dụng. Luồng sở hữu này tránh sao chép message mà vẫn giữ lifetime rõ ràng."
        },
        {
          "title": "Hợp đồng lỗi và dữ liệu dở dang",
          "text": "Mỗi record được serialize ngay khi hợp lệ, vì vậy RAM không tăng theo số dòng. Nếu dòng thứ ba hỏng, hai dòng JSON trước có thể đã đi ra stdout; chương trình trả lỗi và không tuyên bố báo cáo hoàn chỉnh. ErrorKind của lỗi writer cần được giữ để main xử lý BrokenPipe theo chính sách công cụ lọc. Chuyển mọi lỗi serializer thành Other sẽ làm mất thông tin đó. Với input UTF-8 sai hoặc dòng quá giới hạn, dự án dừng ngay. Muốn thêm tolerant mode, bạn phải thiết kế cách bỏ hết record hỏng và báo tổng số bỏ qua, không chỉ thêm continue tùy tiện."
        },
        {
          "title": "Thực hiện và mở rộng có bằng chứng",
          "text": "Chạy cargo test để kiểm tra thư viện và binary, rồi lọc fixture bằng lệnh có sẵn. Sửa một dòng thành duration âm, xác nhận stderr có vị trí và status là 2. Thử level không khớp, xác nhận stdout rỗng và status là 1. Bài tập trình duyệt tính tổng duration cho một level bằng checked_add, chuẩn bị cho subcommand summarize. Sau khi baseline đạt, bổ sung thống kê có schema riêng, bộ test writer thất bại và benchmark tệp nhiều dòng. Bàn giao cần lưu lệnh tái hiện cùng kết quả thực đo; không nhận hoàn thành chỉ dựa trên việc chạy một fixture đẹp."
        }
      ],
      "tip": "Bài tập trên web rèn lõi thống kê; Cargo lab kiểm tra clap, file, stdin và tiến trình thật.",
      "exercise": {
        "title": "Tổng duration không tràn số",
        "instructions": "Tính tổng duration của level được chọn, bỏ qua level khác, trả overflow nếu phép cộng vượt u64.",
        "requirements": [
          "Danh sách rỗng trả 0.",
          "Chỉ cộng record đúng level.",
          "Không dùng phép cộng có thể panic hoặc wrap."
        ]
      },
      "expectedOutput": "Thống kê theo level không tràn số",
      "hints": [
        "filter trước khi try_fold.",
        "checked_add trả None khi overflow."
      ],
      "quiz": {
        "question": "Record mượn message từ buffer được tái sử dụng. Khi nào serialize record?",
        "options": [
          "Sau khi đọc hết tệp.",
          "Trước khi buffer bị thay đổi ở vòng tiếp theo.",
          "Lưu reference vào vector rồi xóa buffer."
        ],
        "correct": 1,
        "explanation": "Record phụ thuộc dữ liệu buffer hiện tại. Serialize ngay trước khi clear và đọc tiếp giữ lifetime hợp lệ, không cần giữ cả tệp."
      },
      "reference": {
        "label": "clap derive tutorial",
        "url": "https://docs.rs/clap/latest/clap/_derive/_tutorial/"
      },
      "localLab": {
        "title": "Logcheck: lọc log có hợp đồng dòng lệnh",
        "instructions": "Tạo các tệp bên dưới. Công cụ đọc TSV với ba trường level, duration_ms, message; mỗi dòng tối đa 4096 byte tính cả newline. Dùng file hoặc stdin, xuất JSON Lines và báo lỗi có số dòng. Chạy test trước, sau đó chạy fixture và thử một dòng sai. Đây là định dạng TSV giới hạn do dự án định nghĩa, không phải parser CSV tổng quát.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"logcheck\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\nclap = { version = \"=4.6.7\", features = [\"derive\"] }\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::io::{self, BufRead, Write};\nuse serde::Serialize;\n\nconst MAX_RECORD: usize = 4096;\n#[derive(Debug, Serialize)]\npub struct Record<'a> {\n    pub schema_version: u8,\n    pub line: usize,\n    pub level: &'a str,\n    pub duration_ms: u32,\n    pub message: &'a str,\n}\nfn invalid(message: impl Into<String>) -> io::Error {\n    io::Error::new(io::ErrorKind::InvalidData, message.into())\n}\npub fn read_record<R: BufRead>(input: &mut R, line: &mut Vec<u8>) -> io::Result<bool> {\n    line.clear();\n    loop {\n        let buffer = input.fill_buf()?;\n        if buffer.is_empty() { return Ok(!line.is_empty()); }\n        let count = buffer.iter().position(|&b| b == b'\\n').map_or(buffer.len(), |i| i + 1);\n        let ended = buffer[count - 1] == b'\\n';\n        if count > MAX_RECORD.saturating_sub(line.len()) {\n            return Err(invalid(\"record exceeds 4096 bytes\"));\n        }\n        line.extend_from_slice(&buffer[..count]);\n        input.consume(count);\n        if ended { return Ok(true); }\n    }\n}\npub fn parse(line: &str, number: usize) -> io::Result<Record<'_>> {\n    let parts: Vec<_> = line.split('\\t').collect();\n    if parts.len() != 3 { return Err(invalid(\"expected level, duration_ms, message\")); }\n    if ![\"INFO\", \"WARN\", \"ERROR\"].contains(&parts[0]) { return Err(invalid(\"invalid level\")); }\n    let duration_ms: u32 = parts[1].parse().map_err(|_| invalid(\"invalid duration\"))?;\n    if duration_ms > 60_000 { return Err(invalid(\"duration exceeds 60000\")); }\n    Ok(Record { schema_version: 1, line: number, level: parts[0], duration_ms, message: parts[2] })\n}\npub fn run<R: BufRead, W: Write>(mut input: R, mut out: W, level: Option<&str>) -> io::Result<usize> {\n    let mut bytes = Vec::with_capacity(MAX_RECORD);\n    let mut line = 0;\n    let mut matched = 0;\n    while read_record(&mut input, &mut bytes)? {\n        line += 1;\n        if bytes.last() == Some(&b'\\n') { bytes.pop(); }\n        if bytes.last() == Some(&b'\\r') { bytes.pop(); }\n        let text = std::str::from_utf8(&bytes).map_err(|e| invalid(format!(\"line {line}: {e}\")))?;\n        let record = parse(text, line).map_err(|e| invalid(format!(\"line {line}: {e}\")))?;\n        if level.is_none_or(|value| value == record.level) {\n            serde_json::to_writer(&mut out, &record).map_err(|error| io::Error::new(error.io_error_kind().unwrap_or(io::ErrorKind::Other), error))?;\n            out.write_all(b\"\\n\")?;\n            matched += 1;\n        }\n    }\n    out.flush()?;\n    Ok(matched)\n}\n#[cfg(test)]\nmod tests {\n    use super::*;\n    use std::io::Cursor;\n    #[test]\n    fn filters_preserves_line_and_unicode() {\n        let mut out = Vec::new();\n        assert_eq!(run(Cursor::new(\"INFO\\t3\\tok\\r\\nERROR\\t7\\tlỗi\"), &mut out, Some(\"ERROR\")).unwrap(), 1);\n        let value: serde_json::Value = serde_json::from_slice(&out).unwrap();\n        assert_eq!(value[\"line\"], 2);\n        assert_eq!(value[\"message\"], \"lỗi\");\n    }\n    #[test]\n    fn invalid_record_is_error_after_partial_output() {\n        let mut out = Vec::new();\n        let error = run(Cursor::new(\"INFO\\t1\\tok\\nBAD\\t3\\tx\\n\"), &mut out, None).unwrap_err();\n        assert!(error.to_string().contains(\"line 2\"));\n        assert_eq!(out.iter().filter(|&&b| b == b'\\n').count(), 1);\n    }\n    #[test]\n    fn bounds_and_invalid_utf8() {\n        assert!(run(Cursor::new(vec![b'x'; 4097]), Vec::new(), None).is_err());\n        assert!(run(Cursor::new(vec![255]), Vec::new(), None).is_err());\n        assert_eq!(run(Cursor::new(\"\"), Vec::new(), None).unwrap(), 0);\n        assert!(parse(\"INFO\\t60001\\tx\", 1).is_err());\n        assert!(parse(\"INFO\\t1\\tx\\ty\", 1).is_err());\n    }\n    struct Fail;\n    impl Write for Fail {\n        fn write(&mut self, _: &[u8]) -> io::Result<usize> { Err(io::Error::new(io::ErrorKind::BrokenPipe, \"closed\")) }\n        fn flush(&mut self) -> io::Result<()> { Ok(()) }\n    }\n    #[test]\n    fn writer_failure_reaches_caller() {\n        assert!(run(Cursor::new(\"INFO\\t1\\tx\"), Fail, None).is_err());\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use clap::Parser;\nuse std::{fs::File, io::{self, BufRead, BufReader}, path::PathBuf, process::ExitCode};\n#[derive(Parser)]\n#[command(version, about = \"Lọc log TSV và xuất JSON Lines\")]\nstruct Cli {\n    /// Bỏ trống để đọc stdin\n    input: Option<PathBuf>,\n    #[arg(long, value_parser = [\"INFO\", \"WARN\", \"ERROR\"])]\n    level: Option<String>,\n}\nfn execute(cli: Cli) -> io::Result<usize> {\n    let input: Box<dyn BufRead> = match cli.input {\n        Some(path) => Box::new(BufReader::new(File::open(path)?)),\n        None => Box::new(BufReader::new(io::stdin())),\n    };\n    logcheck::run(input, io::stdout().lock(), cli.level.as_deref())\n}\nfn main() -> ExitCode {\n    match execute(Cli::parse()) {\n        Ok(0) => ExitCode::from(1),\n        Ok(_) => ExitCode::SUCCESS,\n        Err(error) if error.kind() == io::ErrorKind::BrokenPipe => ExitCode::SUCCESS,\n        Err(error) => { eprintln!(\"logcheck: {error}\"); ExitCode::from(2) }\n    }\n}\n"
          },
          {
            "path": "tests/process.rs",
            "content": "use std::process::{Command, Stdio};\nuse std::io::Write;\nfn invoke(input: &str, args: &[&str]) -> std::process::Output {\n    let mut child = Command::new(env!(\"CARGO_BIN_EXE_logcheck\")).args(args)\n        .stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped()).spawn().unwrap();\n    child.stdin.take().unwrap().write_all(input.as_bytes()).unwrap();\n    child.wait_with_output().unwrap()\n}\n#[test]\nfn binary_contract() {\n    let result = invoke(\"ERROR\\t4\\tlỗi\\n\", &[\"--level\", \"ERROR\"]);\n    assert!(result.status.success());\n    assert!(result.stderr.is_empty());\n    let record: serde_json::Value = serde_json::from_slice(&result.stdout).unwrap();\n    assert_eq!(record[\"schema_version\"], 1);\n    let empty = invoke(\"INFO\\t1\\tx\", &[\"--level\", \"ERROR\"]);\n    assert_eq!(empty.status.code(), Some(1));\n    let bad = invoke(\"bad\", &[]);\n    assert_eq!(bad.status.code(), Some(2));\n    assert!(bad.stdout.is_empty());\n    assert!(!bad.stderr.is_empty());\n}\n#[test]\nfn help_and_argument_error() {\n    let help = Command::new(env!(\"CARGO_BIN_EXE_logcheck\")).arg(\"--help\").output().unwrap();\n    assert!(help.status.success());\n    assert!(String::from_utf8_lossy(&help.stdout).contains(\"--level\"));\n    let bad = Command::new(env!(\"CARGO_BIN_EXE_logcheck\")).args([\"--level\", \"DEBUG\"]).output().unwrap();\n    assert_eq!(bad.status.code(), Some(2));\n}\n"
          },
          {
            "path": "fixtures/app.tsv",
            "content": "INFO\t12\tKhởi động\nWARN\t80\tTruy vấn chậm\nERROR\t4\tThiếu cấu hình\n"
          },
          {
            "path": "README.md",
            "content": "# Logcheck\ncargo test\ncargo run -- fixtures/app.tsv --level ERROR\ncargo run -- --help\n\nInput là ba trường phân cách tab, không cho tab trong message. Giới hạn 4096 byte gồm newline; UTF-8 bắt buộc. Đầu ra JSON Lines giữ số dòng gốc; stdout chỉ chứa dữ liệu. Exit 0 có kết quả; 1 không khớp; 2 sai đối số, dữ liệu hoặc I/O. Pipeline bị consumer đóng sớm được coi thành công cho công cụ lọc.\n\nMở rộng phải giữ hợp đồng: thêm summary hoặc tolerant mode bằng định dạng có phiên bản; kiểm tra cả kết quả dở dang khi lỗi. Không coi TSV hạn chế này là parser CSV hỗ trợ quoted newline.\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run -- fixtures/app.tsv --level ERROR",
          "cargo run -- --help"
        ],
        "checks": [
          "JSON Lines có schema_version, line và message giữ nguyên Unicode.",
          "Dòng hỏng trả mã 2; không khớp trả mã 1.",
          "Input trên 4096 byte bị từ chối trong lúc đọc.",
          "Unit test writer lỗi và process test thật đều đạt."
        ]
      },
      "moduleId": "track-cli",
      "starterCode": "\nfn total(records: &[(&str, u64)], level: &str) -> Result<u64, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(total(&[(\"INFO\", 2), (\"ERROR\", 4), (\"ERROR\", 7)], \"ERROR\"), Ok(11));\n    assert_eq!(total(&[], \"ERROR\"), Ok(0));\n    assert_eq!(total(&[(\"INFO\", u64::MAX)], \"ERROR\"), Ok(0));\n    assert_eq!(total(&[(\"ERROR\", u64::MAX), (\"ERROR\", 1)], \"ERROR\"), Err(\"overflow\"));\n    println!(\"Thống kê theo level không tràn số\");\n}",
      "solutionCode": "\nfn total(records: &[(&str, u64)], level: &str) -> Result<u64, &'static str> {\n    records.iter().filter(|(name,_)| *name == level)\n        .try_fold(0u64, |sum,(_,value)| sum.checked_add(*value).ok_or(\"overflow\"))\n}\nfn main() {\n    assert_eq!(total(&[(\"INFO\", 2), (\"ERROR\", 4), (\"ERROR\", 7)], \"ERROR\"), Ok(11));\n    assert_eq!(total(&[], \"ERROR\"), Ok(0));\n    assert_eq!(total(&[(\"INFO\", u64::MAX)], \"ERROR\"), Ok(0));\n    assert_eq!(total(&[(\"ERROR\", u64::MAX), (\"ERROR\", 1)], \"ERROR\"), Err(\"overflow\"));\n    println!(\"Thống kê theo level không tràn số\");\n}"
    },
    {
      "id": "cli-manifest-project",
      "title": "Dự án: kiểm kê tài sản và phát hiện thay đổi",
      "description": "Đọc cây thư mục, xuất manifest có phiên bản và so sánh nội dung giữa hai lần kiểm kê.",
      "duration": 120,
      "objectives": [
        "Thiết kế manifest ổn định theo path tương đối.",
        "Kiểm tra giới hạn, symlink và kiểu tệp.",
        "Phân biệt phát hiện thay đổi với xác minh bảo mật."
      ],
      "sections": [
        {
          "title": "Từ nhu cầu kiểm kê đến định dạng",
          "text": "Một nhóm muốn biết thư mục tài liệu đã thêm, xóa hoặc thay đổi tệp nào trước khi đóng gói. Asset-audit có hai lệnh: scan tạo manifest, diff so sánh hai manifest. Mỗi entry chứa đường dẫn tương đối, số byte và checksum; manifest có schema_version. Không lưu đường dẫn tuyệt đối của máy tác giả vì bản kiểm kê cần chuyển giữa môi trường. Chuẩn hóa dấu phân cách trong định dạng thành dấu gạch chéo và giữ thứ tự ổn định. Đường dẫn không biểu diễn được bằng UTF-8 bị từ chối tường minh trong baseline, thay vì thay ký tự và làm hai tên khác nhau trở thành giống nhau."
        },
        {
          "title": "Đọc mã nguồn như một người bảo trì",
          "text": "Hàm scan kiểm tra root, walk duyệt các thư mục và fingerprint đọc mỗi tệp theo buffer cố định. Dự án giới hạn độ sâu, số tệp và dung lượng một tệp để có phạm vi vận hành cụ thể. Symlink và đối tượng đặc biệt bị từ chối. Đây là chính sách đơn giản cho thư mục tin cậy; metadata rồi open vẫn có cửa sổ TOCTOU nếu người khác thay đường dẫn. Không trình bày chính sách này như một sandbox an toàn trước kẻ có quyền sửa cây thư mục. Muốn đảm bảo mạnh hơn cần API theo handle hoặc snapshot do hệ điều hành hỗ trợ."
        },
        {
          "title": "Checksum và tính nhất quán",
          "text": "FNV-1a trong lab là thuật toán xác định, nhỏ và đủ để quan sát thay đổi ở fixture tin cậy. Nó không có khả năng chống va chạm đối kháng như hash mật mã. Cùng độ dài nhưng khác checksum được đánh dấu modified; chỉ so số byte sẽ bỏ sót trường hợp này. Ngược lại, quét từng tệp không tạo snapshot nguyên tử cho cả thư mục. Nếu nội dung đổi giữa quá trình quét, manifest có thể kết hợp các thời điểm khác nhau. Bản bàn giao phải ghi rõ yêu cầu input ổn định hoặc bổ sung chiến lược snapshot và kiểm tra nhất quán phù hợp môi trường sử dụng."
        },
        {
          "title": "Kiểm thử và nhiệm vụ độc lập",
          "text": "Chạy scan fixture, lưu output ngoài thư mục đang quét, sửa nội dung rồi tạo manifest thứ hai. diff trả danh sách thay đổi và mã 1 khi có khác biệt; lỗi parse hoặc schema không hỗ trợ trả mã 2. Integration test tạo thư mục riêng, kiểm tra tên Unicode, sửa cùng độ dài, thêm, xóa và symlink trên Unix. Bài tập trên web thực hiện phép so sánh map để củng cố ý nghĩa added, removed và modified. Nhiệm vụ độc lập là bổ sung ignore có quy tắc rõ, giới hạn tổng entries khi duyệt, hash phù hợp mục tiêu và kiểm thử trên hai nền tảng được chọn, kèm báo cáo điều chưa chứng minh."
        }
      ],
      "tip": "Lưu before.json và after.json ngoài cây đang scan để manifest không tự trở thành input của lần sau.",
      "exercise": {
        "title": "So sánh hai bản kiểm kê",
        "instructions": "Nhận map path → fingerprint; trả (path, kind) cho các path thay đổi, theo thứ tự path tăng dần.",
        "requirements": [
          "Có added, removed và modified.",
          "Path không đổi không xuất hiện.",
          "Không phụ thuộc thứ tự chèn map."
        ]
      },
      "expectedOutput": "Ba loại thay đổi được phân biệt",
      "hints": [
        "Hợp các khóa của hai map bằng BTreeSet.",
        "Chỉ một trong hai map có khóa tương ứng added hoặc removed."
      ],
      "quiz": {
        "question": "Hai tệp cùng độ dài nhưng nội dung khác nhau cần được phát hiện bằng cách nào trong lab?",
        "options": [
          "Chỉ so tên đường dẫn.",
          "Coi chúng luôn giống nhau.",
          "So fingerprint nội dung, đồng thời hiểu giới hạn va chạm của thuật toán."
        ],
        "correct": 2,
        "explanation": "Độ dài không đủ nhận diện nội dung. Fingerprint bổ sung bằng chứng, nhưng FNV trong lab không chống va chạm chủ ý."
      },
      "reference": {
        "label": "Rust filesystem and TOCTOU",
        "url": "https://doc.rust-lang.org/std/fs/"
      },
      "localLab": {
        "title": "Asset-audit: kiểm kê và so sánh thư mục",
        "instructions": "Dự án đọc cây thư mục tin cậy và tạo manifest JSON có phiên bản. Nó không sửa input. Checksum FNV-1a chỉ dùng nhận biết thay đổi trong bài lab, không xác minh an toàn trước nội dung đối kháng. Hãy lưu manifest ngoài thư mục đang quét. Chạy scan trước và sau khi sửa fixture, sau đó diff hai manifest.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"asset-audit\"\nversion = \"0.1.0\"\nedition = \"2024\"\n[dependencies]\nclap = { version = \"=4.6.7\", features = [\"derive\"] }\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::{collections::BTreeMap, fs, io::{self, Read}, path::Path};\nuse serde::{Deserialize, Serialize};\n#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]\n#[serde(deny_unknown_fields)]\npub struct Entry { pub path: String, pub bytes: u64, pub checksum: String }\n#[derive(Debug, Serialize, Deserialize)]\n#[serde(deny_unknown_fields)]\npub struct Manifest { pub schema_version: u8, pub entries: Vec<Entry> }\n#[derive(Debug, Serialize, PartialEq, Eq)]\npub struct Change { pub path: String, pub kind: &'static str }\nfn invalid(message: impl Into<String>) -> io::Error { io::Error::new(io::ErrorKind::InvalidData, message.into()) }\npub fn fingerprint<R: Read>(mut reader: R) -> io::Result<(u64, String)> {\n    let mut hash = 0xcbf29ce484222325u64;\n    let mut bytes = 0u64;\n    let mut buffer = [0u8; 8192];\n    loop {\n        let n = reader.read(&mut buffer)?;\n        if n == 0 { break; }\n        bytes += n as u64;\n        if bytes > 16 * 1024 * 1024 { return Err(invalid(\"file exceeds 16 MiB\")); }\n        for &b in &buffer[..n] { hash = (hash ^ u64::from(b)).wrapping_mul(0x100000001b3); }\n    }\n    Ok((bytes, format!(\"{hash:016x}\")))\n}\nfn walk(root: &Path, dir: &Path, depth: usize, entries: &mut Vec<Entry>) -> io::Result<()> {\n    if depth > 32 { return Err(invalid(\"directory depth exceeds 32\")); }\n    let mut paths = fs::read_dir(dir)?.map(|e| e.map(|v| v.path())).collect::<io::Result<Vec<_>>>()?;\n    paths.sort();\n    for path in paths {\n        let metadata = fs::symlink_metadata(&path)?;\n        if metadata.file_type().is_symlink() { return Err(invalid(\"symlink is outside this lab policy\")); }\n        if metadata.is_dir() { walk(root, &path, depth + 1, entries)?; }\n        else if metadata.is_file() {\n            if entries.len() >= 10_000 { return Err(invalid(\"file count exceeds 10000\")); }\n            let relative = path.strip_prefix(root).map_err(io::Error::other)?;\n            let normalized = relative.components().map(|c| c.as_os_str().to_str().ok_or_else(|| invalid(\"path is not UTF-8\")))\n                .collect::<io::Result<Vec<_>>>()?.join(\"/\");\n            let (bytes, checksum) = fingerprint(fs::File::open(&path)?)?;\n            entries.push(Entry { path: normalized, bytes, checksum });\n        } else { return Err(invalid(\"only directories and regular files are supported\")); }\n    }\n    Ok(())\n}\npub fn scan(root: &Path) -> io::Result<Manifest> {\n    let meta = fs::symlink_metadata(root)?;\n    if meta.file_type().is_symlink() || !meta.is_dir() { return Err(invalid(\"root must be a real directory\")); }\n    let mut entries = Vec::new();\n    walk(root, root, 0, &mut entries)?;\n    entries.sort_by(|a,b| a.path.cmp(&b.path));\n    Ok(Manifest { schema_version: 1, entries })\n}\nfn index(manifest: &Manifest) -> io::Result<BTreeMap<&str, &Entry>> {\n    if manifest.schema_version != 1 { return Err(invalid(\"unsupported schema\")); }\n    let mut map = BTreeMap::new();\n    for entry in &manifest.entries {\n        if entry.path.is_empty() || entry.path.starts_with('/') || entry.path.split('/').any(|p| p.is_empty() || p == \".\" || p == \"..\") {\n            return Err(invalid(\"invalid manifest path\"));\n        }\n        if map.insert(entry.path.as_str(), entry).is_some() { return Err(invalid(\"duplicate manifest path\")); }\n    }\n    Ok(map)\n}\npub fn diff(before: &Manifest, after: &Manifest) -> io::Result<Vec<Change>> {\n    let a = index(before)?;\n    let b = index(after)?;\n    let mut changes = Vec::new();\n    for (path, old) in &a {\n        match b.get(path) {\n            None => changes.push(Change { path: (*path).into(), kind: \"removed\" }),\n            Some(new) if old != new => changes.push(Change { path: (*path).into(), kind: \"modified\" }),\n            _ => {}\n        }\n    }\n    for path in b.keys() {\n        if !a.contains_key(path) { changes.push(Change { path: (*path).into(), kind: \"added\" }); }\n    }\n    changes.sort_by(|a,b| a.path.cmp(&b.path));\n    Ok(changes)\n}\npub fn load(path: &Path) -> io::Result<Manifest> {\n    let mut bytes = Vec::new();\n    fs::File::open(path)?.take(2 * 1024 * 1024 + 1).read_to_end(&mut bytes)?;\n    if bytes.len() > 2 * 1024 * 1024 { return Err(invalid(\"manifest exceeds 2 MiB\")); }\n    let value = serde_json::from_slice(&bytes).map_err(io::Error::other)?;\n    index(&value)?;\n    Ok(value)\n}\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn deterministic_fingerprint_and_diff() {\n        assert_eq!(fingerprint(&b\"hello\"[..]).unwrap(), (5, \"a430d84680aabd0b\".into()));\n        let a = Manifest { schema_version: 1, entries: vec![Entry { path: \"a\".into(), bytes: 1, checksum: \"x\".into() }] };\n        let b = Manifest { schema_version: 1, entries: vec![Entry { path: \"a\".into(), bytes: 1, checksum: \"y\".into() }, Entry { path: \"b\".into(), bytes: 0, checksum: \"z\".into() }] };\n        assert_eq!(diff(&a,&b).unwrap().iter().map(|x| x.kind).collect::<Vec<_>>(), vec![\"modified\",\"added\"]);\n        assert!(diff(&a,&a).unwrap().is_empty());\n    }\n    #[test]\n    fn schema_and_duplicates_rejected() {\n        let a = Manifest { schema_version: 2, entries: vec![] };\n        assert!(diff(&a,&a).is_err());\n        let e = Entry { path: \"a\".into(), bytes: 1, checksum: \"x\".into() };\n        let b = Manifest { schema_version: 1, entries: vec![e.clone(),e] };\n        assert!(diff(&b,&b).is_err());\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use clap::{Parser, Subcommand};\nuse std::{io::{self, Write}, path::PathBuf, process::ExitCode};\n#[derive(Parser)]\n#[command(version, about = \"Kiểm kê và so sánh thư mục tin cậy\")]\nstruct Cli { #[command(subcommand)] command: Action }\n#[derive(Subcommand)]\nenum Action { Scan { root: PathBuf }, Diff { before: PathBuf, after: PathBuf } }\nfn execute(cli: Cli) -> Result<bool, Box<dyn std::error::Error>> {\n    let mut out = io::stdout().lock();\n    match cli.command {\n        Action::Scan { root } => {\n            serde_json::to_writer_pretty(&mut out, &asset_audit::scan(&root)?)?;\n            writeln!(out)?;\n            Ok(false)\n        },\n        Action::Diff { before, after } => {\n            let changes = asset_audit::diff(&asset_audit::load(&before)?, &asset_audit::load(&after)?)?;\n            serde_json::to_writer_pretty(&mut out, &changes)?;\n            writeln!(out)?;\n            Ok(!changes.is_empty())\n        }\n    }\n}\nfn main() -> ExitCode {\n    match execute(Cli::parse()) {\n        Ok(false) => ExitCode::SUCCESS,\n        Ok(true) => ExitCode::from(1),\n        Err(error) => { eprintln!(\"asset-audit: {error}\"); ExitCode::from(2) }\n    }\n}\n"
          },
          {
            "path": "tests/files.rs",
            "content": "use std::{fs, path::PathBuf, process::Command, sync::atomic::{AtomicU64, Ordering}};\nstatic NEXT: AtomicU64 = AtomicU64::new(0);\nstruct Temp(PathBuf);\nimpl Temp { fn new() -> Self { let p=std::env::temp_dir().join(format!(\"asset-audit-{}-{}\",std::process::id(),NEXT.fetch_add(1,Ordering::Relaxed))); fs::create_dir(&p).unwrap(); Self(p) } }\nimpl Drop for Temp { fn drop(&mut self) { let _=fs::remove_dir_all(&self.0); } }\n#[test]\nfn real_files_changed_added_removed() {\n    let tmp=Temp::new(); fs::create_dir(tmp.0.join(\"dữ liệu\")).unwrap();\n    fs::write(tmp.0.join(\"dữ liệu/a.txt\"),\"old\").unwrap(); fs::write(tmp.0.join(\"gone\"),\"x\").unwrap();\n    let a=asset_audit::scan(&tmp.0).unwrap();\n    fs::write(tmp.0.join(\"dữ liệu/a.txt\"),\"new\").unwrap(); fs::remove_file(tmp.0.join(\"gone\")).unwrap(); fs::write(tmp.0.join(\"new\"),\"x\").unwrap();\n    let b=asset_audit::scan(&tmp.0).unwrap();\n    let changes=asset_audit::diff(&a,&b).unwrap();\n    assert_eq!(changes.len(),3);\n    assert_eq!(changes[0].kind,\"modified\");\n    let result=Command::new(env!(\"CARGO_BIN_EXE_asset-audit\")).arg(\"scan\").arg(&tmp.0).output().unwrap();\n    assert!(result.status.success()); assert!(result.stderr.is_empty());\n    let manifest:asset_audit::Manifest=serde_json::from_slice(&result.stdout).unwrap();\n    assert_eq!(manifest.entries.len(),2);\n}\n#[test]\nfn missing_input_has_failure_status() {\n    let tmp=Temp::new();\n    let result=Command::new(env!(\"CARGO_BIN_EXE_asset-audit\")).arg(\"scan\").arg(tmp.0.join(\"missing\")).output().unwrap();\n    assert_eq!(result.status.code(),Some(2)); assert!(result.stdout.is_empty());\n}\n#[cfg(unix)]\n#[test]\nfn symlink_is_rejected() {\n    let tmp=Temp::new(); fs::write(tmp.0.join(\"real\"),\"x\").unwrap();\n    std::os::unix::fs::symlink(tmp.0.join(\"real\"),tmp.0.join(\"link\")).unwrap();\n    assert!(asset_audit::scan(&tmp.0).is_err());\n}\n"
          },
          {
            "path": "fixtures/assets/readme.txt",
            "content": "Một tệp mẫu cho kiểm kê.\n"
          },
          {
            "path": "README.md",
            "content": "# Asset-audit\ncargo test\ncargo run -- scan fixtures/assets > before.json\n# Sửa fixtures/assets/readme.txt, sau đó:\ncargo run -- scan fixtures/assets > after.json\ncargo run -- diff before.json after.json\n\nScan: exit 0 thành công, 2 lỗi. Diff: 0 giống nhau, 1 có khác biệt, 2 lỗi.\nManifest schema 1, đường dẫn UTF-8 tương đối với dấu /, thứ tự cố định. Giới hạn 10000 tệp, độ sâu 32, mỗi tệp 16 MiB. File phải là regular file, không theo symlink.\nFNV-1a không chống va chạm chủ ý; muốn phát hiện nội dung đối kháng hãy thay bằng hash mật mã và kiểm tra lại schema.\n\nChỉ quét thư mục tin cậy không bị tiến trình khác sửa trong lúc quét. Kiểm tra symlink_metadata rồi open không loại trừ mọi TOCTOU; đây không phải sandbox chống kẻ tấn công có quyền sửa cây thư mục. Snapshot nhiều tệp cũng không nguyên tử. Mở rộng: adapter theo handle của OS, snapshot filesystem hoặc retry khi metadata thay đổi; đo lại trên nền tảng thật.\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run -- scan fixtures/assets",
          "cargo run -- --help"
        ],
        "checks": [
          "Phát hiện sửa nội dung cùng độ dài, thêm và xóa tệp.",
          "Output ổn định theo đường dẫn.",
          "Schema lạ, path lặp, symlink bị từ chối.",
          "Công bố đúng giới hạn snapshot và checksum."
        ]
      },
      "moduleId": "track-cli",
      "starterCode": "use std::collections::{BTreeMap, BTreeSet};\nfn changes(before: &BTreeMap<&str, u64>, after: &BTreeMap<&str, u64>) -> Vec<(String, &'static str)> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    let before = BTreeMap::from([(\"a\", 1), (\"b\", 2), (\"same\", 9)]);\n    let after = BTreeMap::from([(\"a\", 3), (\"c\", 4), (\"same\", 9)]);\n    assert_eq!(changes(&before, &after), vec![(\"a\".into(),\"modified\"),(\"b\".into(),\"removed\"),(\"c\".into(),\"added\")]);\n    assert!(changes(&before, &before).is_empty());\n    assert!(changes(&BTreeMap::new(), &BTreeMap::new()).is_empty());\n    println!(\"Ba loại thay đổi được phân biệt\");\n}",
      "solutionCode": "use std::collections::{BTreeMap, BTreeSet};\nfn changes(before: &BTreeMap<&str, u64>, after: &BTreeMap<&str, u64>) -> Vec<(String, &'static str)> {\n    let paths: BTreeSet<_> = before.keys().chain(after.keys()).copied().collect();\n    paths.into_iter().filter_map(|path| {\n        let kind = match (before.get(path), after.get(path)) {\n            (None, Some(_)) => \"added\",\n            (Some(_), None) => \"removed\",\n            (Some(a), Some(b)) if a != b => \"modified\",\n            _ => return None,\n        };\n        Some((path.to_owned(), kind))\n    }).collect()\n}\nfn main() {\n    let before = BTreeMap::from([(\"a\", 1), (\"b\", 2), (\"same\", 9)]);\n    let after = BTreeMap::from([(\"a\", 3), (\"c\", 4), (\"same\", 9)]);\n    assert_eq!(changes(&before, &after), vec![(\"a\".into(),\"modified\"),(\"b\".into(),\"removed\"),(\"c\".into(),\"added\")]);\n    assert!(changes(&before, &before).is_empty());\n    assert!(changes(&BTreeMap::new(), &BTreeMap::new()).is_empty());\n    println!(\"Ba loại thay đổi được phân biệt\");\n}"
    },
    {
      "id": "cli-batch-project",
      "title": "Dự án cuối khóa: xử lý batch có khả năng tiếp tục",
      "description": "Tích hợp kiểm tra dữ liệu, checkpoint, khóa tiến trình và kiểm chứng gián đoạn trên tệp thật.",
      "duration": 150,
      "objectives": [
        "Liên kết input, kết quả và checkpoint.",
        "Tái hiện dừng giữa chừng rồi tiếp tục.",
        "Bàn giao bằng chứng về giới hạn và phục hồi."
      ],
      "sections": [
        {
          "title": "Hợp đồng của một công cụ vận hành",
          "text": "Batch-audit nhận nhiều tệp TSV đơn giản chứa id và quantity, kiểm tra từng tệp rồi lưu checkpoint. Người vận hành có thể dừng sau một số công việc và chạy lại mà không kiểm tra lại input giống hệt đã hoàn thành. Kết quả JSON gồm processed, skipped và complete; mã 3 biểu thị điểm dừng chủ động khi còn việc. Input sai làm lệnh trả 2, các checkpoint thành công trước đó vẫn còn. Công cụ chỉ đọc input nên chạy lại không gây side effect nghiệp vụ bên ngoài. Chính sự giới hạn này làm mô hình phục hồi đủ rõ để kiểm chứng trước khi mở rộng."
        },
        {
          "title": "Thứ tự xử lý trong baseline",
          "text": "CLI dùng clap nhận state, stop-after và danh sách PathBuf. Thư viện lấy khóa bằng create_new, đọc checkpoint có giới hạn, kiểm tra schema rồi chuẩn hóa danh sách input. Mỗi tệp được đọc tối đa hai MiB, tính fingerprint, so checkpoint và chỉ parse khi cần. Sau validation, một record JSON Lines được ghi và sync_data trước khi tăng processed. Test có hook gây lỗi sau tính toán nhưng trước ghi để chứng minh lần chạy lại không bỏ qua việc chưa được checkpoint. Khóa theo đường dẫn chỉ ngăn các instance dùng cùng tên state, không giải quyết mọi alias hoặc hardlink."
        },
        {
          "title": "Xử lý hỏng trạng thái có chủ đích",
          "text": "Nếu tiến trình bị kill giữa lúc ghi, tail checkpoint có thể thiếu newline hoặc JSON bị cắt. Baseline từ chối trạng thái này và yêu cầu kiểm tra trước sửa; nó không âm thầm bỏ dòng cuối rồi báo thành công. Một lock còn sót sau kill cũng cần quy trình xác minh tiến trình đã dừng trước khi gỡ. Những quyết định này nên được thử trong thư mục fixture, ghi lại trạng thái trước và sau phục hồi. Fingerprint FNV chỉ dùng cho input tin cậy; khi thay thuật toán hoặc quy tắc validation, cache key phải đổi để kết quả cũ không được tái sử dụng sai."
        },
        {
          "title": "Phần cần tự hoàn thiện để nghiệm thu",
          "text": "Baseline tuần tự có source và test chạy được, nhưng capstone yêu cầu phát triển thêm worker pool có giới hạn, hủy có kiểm soát, compact checkpoint và chính sách schema migration. Đo bộ nhớ với nhiều tệp, kiểm tra thứ tự output nếu có xuất từng kết quả, và tái hiện lỗi writer. Không gắn nhãn sẵn sàng vận hành chỉ vì bài tập trình duyệt đạt. Bài tập ở đây kiểm tra uniqueness và quantity trước khi nhận một batch; sản phẩm thực cần bằng chứng từ process test, input lớn, crash và hệ điều hành đích. Bàn giao cả giới hạn chưa kiểm thử để reviewer xác định phạm vi có thể sử dụng."
        }
      ],
      "tip": "Baseline chạy được là điểm xuất phát của capstone; tiêu chí worker, hủy và phục hồi cần được thực hiện và trình diễn riêng.",
      "exercise": {
        "title": "Kiểm tra batch trước khi chấp nhận",
        "instructions": "Batch hợp lệ khi ID không rỗng, không trùng, quantity 1..=10000. Trả tổng quantity bằng checked_add.",
        "requirements": [
          "Không âm thầm gộp ID trùng.",
          "Báo id, duplicate hoặc quantity.",
          "Batch rỗng có tổng 0."
        ]
      },
      "expectedOutput": "Batch hợp lệ mới được checkpoint",
      "hints": [
        "Dùng BTreeSet để kiểm tra ID.",
        "Validation quantity chạy trước checked_add."
      ],
      "quiz": {
        "question": "Đổi thuật toán validation nhưng giữ checkpoint cũ theo cùng input hash có rủi ro gì?",
        "options": [
          "Bỏ qua input chưa được kiểm tra bằng quy tắc mới.",
          "Chỉ làm output đẹp hơn.",
          "Không có vì nội dung input không đổi."
        ],
        "correct": 0,
        "explanation": "Kết quả cache phụ thuộc cả input và thuật toán/cấu hình. Cần đổi version hoặc cache key khi ý nghĩa xử lý thay đổi."
      },
      "reference": {
        "label": "Rust OpenOptions",
        "url": "https://doc.rust-lang.org/std/fs/struct.OpenOptions.html"
      },
      "localLab": {
        "title": "Batch-audit: kiểm tra nhiều tệp và tiếp tục sau gián đoạn",
        "instructions": "CLI kiểm tra các tệp TSV id và quantity, ghi checkpoint JSON Lines và tiếp tục những input chưa hoàn thành hoặc đã đổi nội dung. Baseline xử lý tuần tự với RAM giới hạn theo một tệp; bài cuối yêu cầu thêm worker có giới hạn sau khi giữ đúng hợp đồng phục hồi. --stop-after tạo điểm dừng có thể lặp lại để kiểm tra recovery.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"batch-audit\"\nversion = \"0.1.0\"\nedition = \"2024\"\n[dependencies]\nclap = { version = \"=4.6.7\", features = [\"derive\"] }\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::{collections::{BTreeMap,BTreeSet}, fs::{self,File,OpenOptions}, io::{self,Read,Write}, path::{Path,PathBuf}};\nuse serde::{Serialize,Deserialize};\n#[derive(Debug, Clone, Serialize, Deserialize)]\n#[serde(deny_unknown_fields)]\npub struct Checkpoint { pub schema_version:u8, pub path:String, pub checksum:String, pub rows:usize }\n#[derive(Debug, Serialize)]\npub struct Summary { pub schema_version:u8, pub processed:usize, pub skipped:usize, pub complete:bool }\nfn invalid(message:impl Into<String>)->io::Error { io::Error::new(io::ErrorKind::InvalidData,message.into()) }\nstruct Lock(PathBuf);\nimpl Lock {\n    fn acquire(path:&Path)->io::Result<Self> {\n        let mut name=path.as_os_str().to_os_string(); name.push(\".lock\"); let lock=PathBuf::from(name);\n        OpenOptions::new().write(true).create_new(true).open(&lock)?;\n        Ok(Self(lock))\n    }\n}\nimpl Drop for Lock { fn drop(&mut self) { let _=fs::remove_file(&self.0); } }\npub fn checksum(bytes:&[u8])->String {\n    let hash=bytes.iter().fold(0xcbf29ce484222325u64,|h,&b|(h^u64::from(b)).wrapping_mul(0x100000001b3));\n    format!(\"{hash:016x}\")\n}\npub fn validate(bytes:&[u8])->io::Result<usize> {\n    let text=std::str::from_utf8(bytes).map_err(io::Error::other)?;\n    let mut ids=BTreeSet::new(); let mut rows=0;\n    for (index,line) in text.lines().enumerate() {\n        if line.len()>4096 { return Err(invalid(format!(\"line {} too long\",index+1))); }\n        let fields:Vec<_>=line.split('\\t').collect();\n        if fields.len()!=2 || fields[0].is_empty() { return Err(invalid(format!(\"line {} format\",index+1))); }\n        let quantity:u32=fields[1].parse().map_err(|_|invalid(format!(\"line {} quantity\",index+1)))?;\n        if quantity==0 || quantity>10000 { return Err(invalid(format!(\"line {} quantity range\",index+1))); }\n        if !ids.insert(fields[0]) { return Err(invalid(format!(\"line {} duplicate id\",index+1))); }\n        rows+=1;\n    }\n    Ok(rows)\n}\nfn read_limited(path:&Path,limit:u64)->io::Result<Vec<u8>> {\n    let mut bytes=Vec::new(); File::open(path)?.take(limit+1).read_to_end(&mut bytes)?;\n    if bytes.len() as u64>limit { return Err(invalid(\"file exceeds limit\")); }\n    Ok(bytes)\n}\nfn load(path:&Path)->io::Result<BTreeMap<String,Checkpoint>> {\n    let bytes=match read_limited(path,8*1024*1024) { Ok(v)=>v,Err(e) if e.kind()==io::ErrorKind::NotFound=>return Ok(BTreeMap::new()),Err(e)=>return Err(e) };\n    let text=std::str::from_utf8(&bytes).map_err(io::Error::other)?;\n    if !text.is_empty() && !text.ends_with('\\n') { return Err(invalid(\"incomplete checkpoint tail; inspect before repair\")); }\n    let mut map=BTreeMap::new();\n    for line in text.lines() {\n        let record:Checkpoint=serde_json::from_str(line).map_err(io::Error::other)?;\n        if record.schema_version!=1 { return Err(invalid(\"unsupported checkpoint schema\")); }\n        map.insert(record.path.clone(),record);\n    }\n    Ok(map)\n}\npub fn run(paths:&[PathBuf],state:&Path,stop_after:Option<usize>)->io::Result<Summary> {\n    run_with_hook(paths,state,stop_after,|_|Ok(()))\n}\npub fn run_with_hook<F:FnMut(&Path)->io::Result<()>>(paths:&[PathBuf],state:&Path,stop_after:Option<usize>,mut after_compute:F)->io::Result<Summary> {\n    if paths.len()>10000 || stop_after==Some(0) { return Err(invalid(\"invalid job limit\")); }\n    let _lock=Lock::acquire(state)?;\n    let mut done=load(state)?;\n    let mut names=BTreeSet::new();\n    let canonical=paths.iter().map(|p|{\n        if !fs::symlink_metadata(p)?.is_file() { return Err(invalid(\"input must be regular file, no symlink\")); }\n        let p=fs::canonicalize(p)?;\n        let key=p.to_str().ok_or_else(||invalid(\"input path must be UTF-8\"))?.to_owned();\n        if !names.insert(key.clone()) { return Err(invalid(\"duplicate input\")); }\n        Ok((p,key))\n    }).collect::<io::Result<Vec<_>>>()?;\n    let state_absolute=if state.exists() { fs::canonicalize(state)? } else {\n        let parent=state.parent().filter(|p|!p.as_os_str().is_empty()).unwrap_or(Path::new(\".\"));\n        fs::canonicalize(parent)?.join(state.file_name().ok_or_else(||invalid(\"state filename\"))?)\n    };\n    if canonical.iter().any(|(p,_)|*p==state_absolute) { return Err(invalid(\"checkpoint cannot be input\")); }\n    let mut file=OpenOptions::new().create(true).append(true).open(state)?;\n    let mut summary=Summary {schema_version:1,processed:0,skipped:0,complete:true};\n    for (path,key) in canonical {\n        let bytes=read_limited(&path,2*1024*1024)?;\n        let digest=checksum(&bytes);\n        if done.get(&key).is_some_and(|c|c.checksum==digest) { summary.skipped+=1; continue; }\n        if stop_after.is_some_and(|n|summary.processed>=n) { summary.complete=false; break; }\n        let rows=validate(&bytes).map_err(|e|invalid(format!(\"{}: {e}\",path.display())))?;\n        after_compute(&path)?;\n        let record=Checkpoint {schema_version:1,path:key.clone(),checksum:digest,rows};\n        let mut line=serde_json::to_vec(&record).map_err(io::Error::other)?; line.push(b'\\n');\n        file.write_all(&line)?; file.sync_data()?;\n        done.insert(key,record); summary.processed+=1;\n    }\n    Ok(summary)\n}\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn validation_contract() {\n        assert_eq!(validate(\"a\\t1\\nb\\t2\".as_bytes()).unwrap(),2);\n        assert_eq!(validate(b\"\").unwrap(),0);\n        assert!(validate(b\"a\\t0\").is_err());\n        assert!(validate(b\"a\\t1\\na\\t2\").is_err());\n        assert!(validate(&[255]).is_err());\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use clap::Parser;\nuse std::{io::{self,Write},path::PathBuf,process::ExitCode};\n#[derive(Parser)]\n#[command(version,about=\"Kiểm tra TSV và lưu tiến độ theo nội dung input\")]\nstruct Cli {\n    #[arg(long)] state:PathBuf,\n    /// Dừng sau N công việc mới để kiểm tra recovery\n    #[arg(long,value_parser=clap::value_parser!(u32).range(1..))] stop_after:Option<u32>,\n    #[arg(required=true)] inputs:Vec<PathBuf>,\n}\nfn main()->ExitCode {\n    let cli=Cli::parse();\n    match batch_audit::run(&cli.inputs,&cli.state,cli.stop_after.map(|n|n as usize)) {\n        Ok(summary)=>{\n            let mut out=io::stdout().lock();\n            if let Err(e)=serde_json::to_writer(&mut out,&summary).map_err(io::Error::other).and_then(|_|writeln!(out)) {\n                eprintln!(\"batch-audit output: {e}\");return ExitCode::from(2);\n            }\n            if summary.complete {ExitCode::SUCCESS} else {ExitCode::from(3)}\n        }\n        Err(e)=>{eprintln!(\"batch-audit: {e}\");ExitCode::from(2)}\n    }\n}\n"
          },
          {
            "path": "tests/recovery.rs",
            "content": "use std::{fs,io,path::PathBuf,sync::atomic::{AtomicU64,Ordering},process::Command};\nstatic NEXT:AtomicU64=AtomicU64::new(0);\nstruct Temp(PathBuf);\nimpl Temp {fn new()->Self {let p=std::env::temp_dir().join(format!(\"batch-audit-{}-{}\",std::process::id(),NEXT.fetch_add(1,Ordering::Relaxed)));fs::create_dir(&p).unwrap();Self(p)}}\nimpl Drop for Temp {fn drop(&mut self){let _=fs::remove_dir_all(&self.0);}}\n#[test]\nfn stop_resume_and_changed_input() {\n    let t=Temp::new();let a=t.0.join(\"a.tsv\");let b=t.0.join(\"b.tsv\");let state=t.0.join(\"state.jsonl\");\n    fs::write(&a,\"a\\t1\").unwrap();fs::write(&b,\"b\\t2\").unwrap();let paths=vec![a.clone(),b];\n    let first=batch_audit::run(&paths,&state,Some(1)).unwrap();assert!(!first.complete);assert_eq!(first.processed,1);\n    let second=batch_audit::run(&paths,&state,None).unwrap();assert!(second.complete);assert_eq!((second.processed,second.skipped),(1,1));\n    fs::write(&a,\"a\\t3\").unwrap();\n    let third=batch_audit::run(&paths,&state,None).unwrap();assert_eq!((third.processed,third.skipped),(1,1));\n}\n#[test]\nfn crash_before_checkpoint_does_not_skip_work() {\n    let t=Temp::new();let a=t.0.join(\"a\");let state=t.0.join(\"state\");fs::write(&a,\"a\\t1\").unwrap();\n    assert!(batch_audit::run_with_hook(&[a.clone()],&state,None,|_|Err(io::Error::other(\"injected crash\"))).is_err());\n    let result=batch_audit::run(&[a],&state,None).unwrap();assert_eq!(result.processed,1);assert_eq!(result.skipped,0);\n}\n#[test]\nfn corrupt_state_duplicate_input_and_existing_lock_fail() {\n    let t=Temp::new();let a=t.0.join(\"a\");let state=t.0.join(\"state\");fs::write(&a,\"a\\t1\").unwrap();\n    assert!(batch_audit::run(&[a.clone(),a.clone()],&state,None).is_err());\n    fs::write(&state,\"{broken\").unwrap();assert!(batch_audit::run(&[a.clone()],&state,None).is_err());\n    fs::remove_file(&state).unwrap();fs::write(t.0.join(\"state.lock\"),\"\").unwrap();\n    assert!(batch_audit::run(&[a],&state,None).is_err());\n}\n#[test]\nfn binary_exit_and_json_contract() {\n    let t=Temp::new();let a=t.0.join(\"a b.tsv\");let state=t.0.join(\"state\");fs::write(&a,\"x\\t2\").unwrap();\n    let out=Command::new(env!(\"CARGO_BIN_EXE_batch-audit\")).arg(\"--state\").arg(&state).arg(&a).output().unwrap();\n    assert!(out.status.success());assert!(out.stderr.is_empty());\n    let value:serde_json::Value=serde_json::from_slice(&out.stdout).unwrap();assert_eq!(value[\"processed\"],1);\n    fs::write(&a,\"x\\t0\").unwrap();\n    let bad=Command::new(env!(\"CARGO_BIN_EXE_batch-audit\")).arg(\"--state\").arg(&state).arg(&a).output().unwrap();\n    assert_eq!(bad.status.code(),Some(2));\n}\n"
          },
          {
            "path": "fixtures/a.tsv",
            "content": "RUST-BOOK\t2\nCOURSE\t1\n"
          },
          {
            "path": "fixtures/b.tsv",
            "content": "DESK\t3\n"
          },
          {
            "path": "README.md",
            "content": "# Batch-audit\ncargo test\ncargo run -- --state progress.jsonl --stop-after 1 fixtures/a.tsv fixtures/b.tsv\n# Lần đầu có thể trả 3: chủ động dừng còn việc.\ncargo run -- --state progress.jsonl fixtures/a.tsv fixtures/b.tsv\n# Lần tiếp theo không đổi input: processed=0, skipped=2.\n\nMỗi tệp tối đa 2 MiB. TSV có đúng id và quantity (1..10000), ID không trùng trong một tệp. Công cụ chỉ đọc input. Checkpoint schema 1 ghi sau validation, sync_data trước đánh dấu processed. Đây là baseline tuần tự; mở rộng worker pool phải giữ giới hạn RAM và recovery.\n\nFNV-1a dùng làm fingerprint của fixture tin cậy, không chống nội dung đối kháng. Thay thuật toán phải đổi schema/cache key. Lock create_new ngăn hai instance dùng cùng đường dẫn checkpoint; không phải khóa chống alias/hardlink. Sau kill cứng có thể còn lock: xác minh không còn tiến trình rồi mới xóa file lock trong thư mục lab. Tail checkpoint bị ghi dở bị từ chối, không âm thầm bỏ qua. Sao lưu và kiểm tra tail trước sửa.\n\nMôi trường tin cậy, input ổn định trong lúc đọc. Không chứng minh snapshot nguyên tử, độ bền mất điện mọi filesystem hoặc exactly-once. Baseline có điểm dừng xác định và fault hook để test. Capstone cần bổ sung giới hạn worker, hủy tín hiệu, hash phù hợp, migration state, compact ledger và đo trên nền tảng thật.\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run -- --state progress.jsonl --stop-after 1 fixtures/a.tsv fixtures/b.tsv",
          "cargo run -- --state progress.jsonl fixtures/a.tsv fixtures/b.tsv"
        ],
        "checks": [
          "Dừng rồi chạy tiếp không bỏ sót input.",
          "Input đổi cùng độ dài được xử lý lại.",
          "Lỗi trước checkpoint khiến công việc chạy lại.",
          "Tail hỏng, schema lạ, khóa đang tồn tại không được âm thầm bỏ qua."
        ]
      },
      "moduleId": "track-cli",
      "starterCode": "use std::collections::BTreeSet;\nfn validate_batch(rows: &[(&str, u64)]) -> Result<u64, &'static str> {\n    todo!(\"Hoàn thành yêu cầu trong bài\")\n}\nfn main() {\n    assert_eq!(validate_batch(&[(\"a\",2),(\"b\",3)]), Ok(5));\n    assert_eq!(validate_batch(&[(\"a\",2),(\"a\",3)]), Err(\"duplicate\"));\n    assert_eq!(validate_batch(&[(\"\",2)]), Err(\"id\"));\n    assert_eq!(validate_batch(&[(\"a\",0)]), Err(\"quantity\"));\n    assert_eq!(validate_batch(&[]), Ok(0));\n    println!(\"Batch hợp lệ mới được checkpoint\");\n}",
      "solutionCode": "use std::collections::BTreeSet;\nfn validate_batch(rows: &[(&str, u64)]) -> Result<u64, &'static str> {\n    let mut ids = BTreeSet::new();\n    let mut total = 0u64;\n    for &(id, quantity) in rows {\n        if id.is_empty() { return Err(\"id\"); }\n        if !ids.insert(id) { return Err(\"duplicate\"); }\n        if !(1..=10_000).contains(&quantity) { return Err(\"quantity\"); }\n        total = total.checked_add(quantity).ok_or(\"overflow\")?;\n    }\n    Ok(total)\n}\nfn main() {\n    assert_eq!(validate_batch(&[(\"a\",2),(\"b\",3)]), Ok(5));\n    assert_eq!(validate_batch(&[(\"a\",2),(\"a\",3)]), Err(\"duplicate\"));\n    assert_eq!(validate_batch(&[(\"\",2)]), Err(\"id\"));\n    assert_eq!(validate_batch(&[(\"a\",0)]), Err(\"quantity\"));\n    assert_eq!(validate_batch(&[]), Ok(0));\n    println!(\"Batch hợp lệ mới được checkpoint\");\n}"
    }
  ],
  "projects": [
    {
      "id": "cli-project-logcheck",
      "title": "Logcheck: lọc log trong pipeline",
      "description": "Công cụ clap đọc file hoặc stdin, giới hạn record và xuất JSON Lines giữ số dòng.",
      "level": "guided",
      "estimatedHours": 8,
      "labLessonId": "cli-log-project",
      "requirements": [
        "TSV ba trường, validation level/duration và giới hạn 4096 byte khi đọc.",
        "Filter level với stdout JSON Lines có schema và Unicode nguyên vẹn.",
        "Mã 0/1/2 phân biệt có kết quả, không khớp và lỗi.",
        "Generic BufRead/Write cùng integration test binary thật."
      ],
      "milestones": [
        {
          "title": "Hợp đồng CLI",
          "tasks": [
            "Chạy --help và thêm ví dụ fixture.",
            "Viết bảng exit code và giới hạn định dạng."
          ],
          "acceptance": "Parser từ chối level sai; help và ví dụ chạy được."
        },
        {
          "title": "Lõi streaming",
          "tasks": [
            "Đọc buffer theo ngân sách.",
            "Giữ vị trí lỗi và output dở dang đúng hợp đồng."
          ],
          "acceptance": "Dòng dài và UTF-8 hỏng bị từ chối, không giữ cả tệp."
        },
        {
          "title": "Kiểm thử pipeline",
          "tasks": [
            "Test writer lỗi và input thiếu newline.",
            "Chạy binary qua stdin và kiểm tra ba đầu ra."
          ],
          "acceptance": "Unit và process tests đạt; trường hợp lỗi không trả 0."
        },
        {
          "title": "Bổ sung thống kê",
          "tasks": [
            "Thêm summarize với schema riêng.",
            "Đo memory trên fixture lớn có thể tái tạo."
          ],
          "acceptance": "Tổng duration không tràn; báo cáo có câu lệnh và dữ liệu đo."
        }
      ],
      "testCases": [
        {
          "name": "Filter giữ vị trí",
          "setup": "INFO ở dòng 1, ERROR Unicode ở dòng 2.",
          "expected": "Chỉ ERROR xuất ra và line=2."
        },
        {
          "name": "Lỗi giữa stream",
          "setup": "Hai record hợp lệ trước record sai.",
          "expected": "Dữ liệu trước có thể đã xuất, nhưng status=2 và stderr có vị trí."
        },
        {
          "name": "Dòng quá dài",
          "setup": "Record không newline lớn hơn 4096 byte.",
          "expected": "Dừng khi vượt ngân sách đọc."
        },
        {
          "name": "Writer đóng",
          "setup": "Writer trả BrokenPipe.",
          "expected": "Lỗi giữ loại để main áp dụng chính sách pipeline."
        }
      ],
      "rubric": [
        {
          "id": "cli-log-contract",
          "title": "Hợp đồng quan sát được",
          "criteria": [
            "Help, flags và mã thoát khớp tài liệu.",
            "stdout chỉ chứa dữ liệu máy."
          ],
          "critical": true
        },
        {
          "id": "cli-log-stream",
          "title": "Giới hạn và dữ liệu",
          "criteria": [
            "Giới hạn được áp dụng lúc đọc.",
            "Unicode, CRLF, EOF và lỗi đều có test."
          ],
          "critical": true
        },
        {
          "id": "cli-log-tests",
          "title": "Kiểm thử lỗi",
          "criteria": [
            "Có test binary thật và writer thất bại.",
            "Không nuốt lỗi đọc bằng filter_map."
          ],
          "critical": true
        },
        {
          "id": "cli-log-handover",
          "title": "Bàn giao",
          "criteria": [
            "Fixture và lệnh chạy có thể tái hiện.",
            "Phạm vi TSV hạn chế được ghi rõ."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Source cùng Cargo.lock và fixture.",
        "Bảng exit code và schema JSON Lines.",
        "Kết quả unit/process tests.",
        "Đo bộ nhớ và ghi rõ giới hạn input."
      ]
    },
    {
      "id": "cli-project-assets",
      "title": "Asset-audit: kiểm kê và so sánh tài sản",
      "description": "Công cụ chỉ đọc tạo manifest ổn định, phát hiện thêm/xóa/sửa và công bố chính sách filesystem.",
      "level": "independent",
      "estimatedHours": 14,
      "labLessonId": "cli-manifest-project",
      "requirements": [
        "Manifest có schema_version, relative path và fingerprint.",
        "Diff phân biệt added, removed, modified theo thứ tự ổn định.",
        "Từ chối schema lạ, path trùng và đối tượng ngoài chính sách.",
        "Công bố hash, snapshot, symlink, Unicode và giới hạn tài nguyên."
      ],
      "milestones": [
        {
          "title": "Manifest có hợp đồng",
          "tasks": [
            "Mô tả schema và mã thoát.",
            "Kiểm tra malformed, duplicate và version lạ."
          ],
          "acceptance": "Manifest hỏng không được so như dữ liệu hợp lệ."
        },
        {
          "title": "Duyệt filesystem",
          "tasks": [
            "Giữ root và đường dẫn tương đối.",
            "Bổ sung giới hạn tổng entry và ignore có test."
          ],
          "acceptance": "Input ngoài giới hạn bị chặn; thứ tự ổn định."
        },
        {
          "title": "So sánh nội dung",
          "tasks": [
            "Test sửa cùng độ dài, thêm và xóa.",
            "Chọn hash theo mức tin cậy input và ghi lý do."
          ],
          "acceptance": "Các loại thay đổi đúng; không quảng cáo checksum như bảo mật."
        },
        {
          "title": "Nghiệm thu nền tảng",
          "tasks": [
            "Chạy test trên nền tảng được chọn.",
            "Ghi nhận snapshot khi input đổi giữa scan."
          ],
          "acceptance": "Báo cáo nêu điều đã đo và điều chưa đảm bảo."
        }
      ],
      "testCases": [
        {
          "name": "Cùng độ dài khác nội dung",
          "setup": "old đổi thành new.",
          "expected": "modified, không dựa riêng vào size."
        },
        {
          "name": "Thêm và xóa",
          "setup": "Xóa a, thêm b.",
          "expected": "Hai change đúng loại theo path."
        },
        {
          "name": "Schema và trùng path",
          "setup": "Manifest version 2 hoặc duplicate.",
          "expected": "Status lỗi, không trả diff giả."
        },
        {
          "name": "Symlink",
          "setup": "Cây fixture có symlink.",
          "expected": "Từ chối theo chính sách baseline."
        }
      ],
      "rubric": [
        {
          "id": "cli-assets-data",
          "title": "Tính đúng dữ liệu",
          "criteria": [
            "Diff đủ ba loại thay đổi.",
            "Manifest có version và validation."
          ],
          "critical": true
        },
        {
          "id": "cli-assets-fs",
          "title": "Filesystem",
          "criteria": [
            "Path, symlink và giới hạn được kiểm tra.",
            "Không viết vào input khi scan."
          ],
          "critical": true
        },
        {
          "id": "cli-assets-proof",
          "title": "Bằng chứng test",
          "criteria": [
            "Test tệp thật, tên Unicode, sửa cùng độ dài.",
            "Báo cáo nền tảng chạy thực tế."
          ],
          "critical": true
        },
        {
          "id": "cli-assets-limit",
          "title": "Giới hạn kỹ thuật",
          "criteria": [
            "Giải thích TOCTOU và snapshot không nguyên tử.",
            "Nêu khả năng và giới hạn hash."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "CLI scan/diff và Cargo.lock.",
        "Manifest trước/sau cùng fixture.",
        "Tests và lệnh tái hiện.",
        "Tài liệu chính sách path, hash và snapshot."
      ]
    },
    {
      "id": "cli-project-batch",
      "title": "Batch-audit: công cụ kiểm tra dữ liệu có recovery",
      "description": "Phát triển baseline tuần tự thành công cụ batch có worker giới hạn, checkpoint và kiểm thử gián đoạn.",
      "level": "capstone",
      "estimatedHours": 26,
      "labLessonId": "cli-batch-project",
      "requirements": [
        "Checkpoint chỉ ghi sau xử lý thành công, gắn fingerprint và phiên bản thuật toán.",
        "Thêm worker pool có giới hạn số việc đang bay và RAM; mô tả thứ tự output.",
        "Thêm hủy có kiểm soát, xử lý lock còn sót và checkpoint tail hỏng.",
        "Giữ hợp đồng exit code/JSON, kiểm thử restart, sửa input, lỗi I/O và upgrade."
      ],
      "milestones": [
        {
          "title": "Baseline và trạng thái",
          "tasks": [
            "Chạy stop-after rồi resume với fixture.",
            "Chứng minh input đổi được xử lý lại."
          ],
          "acceptance": "processed/skipped đúng và không bỏ sót."
        },
        {
          "title": "Đồng thời có giới hạn",
          "tasks": [
            "Thêm worker pool và queue bounded.",
            "Đo peak memory, queue và kết quả so với tuần tự."
          ],
          "acceptance": "Kết quả tương đương; số việc đang bay nằm trong cấu hình."
        },
        {
          "title": "Gián đoạn và phục hồi",
          "tasks": [
            "Thêm hủy theo tín hiệu phù hợp OS.",
            "Test trước/sau checkpoint, lock còn sót, tail cắt và compact."
          ],
          "acceptance": "Tái hiện được lỗi và phục hồi theo runbook mà không mất việc."
        },
        {
          "title": "Phát hành và review",
          "tasks": [
            "Chạy process tests trên target hỗ trợ.",
            "Viết schema migration và giới hạn tin cậy input."
          ],
          "acceptance": "Reviewer chạy từ checkout sạch và đối chiếu rubric."
        }
      ],
      "testCases": [
        {
          "name": "Stop và resume",
          "setup": "Dừng sau một trong hai tệp.",
          "expected": "Lần sau bỏ qua một, xử lý một, complete=true."
        },
        {
          "name": "Input thay đổi",
          "setup": "Đổi quantity cùng độ dài.",
          "expected": "Tệp đổi không dùng checkpoint cũ."
        },
        {
          "name": "Crash trước state",
          "setup": "Fault hook sau compute.",
          "expected": "Lần sau vẫn chạy việc đó."
        },
        {
          "name": "State hỏng",
          "setup": "JSONL tail bị cắt hoặc schema lạ.",
          "expected": "Báo lỗi rõ, không âm thầm bỏ qua."
        },
        {
          "name": "Concurrency và hủy",
          "setup": "Nhiều file, worker chậm, hủy giữa chừng.",
          "expected": "Queue nằm trong giới hạn, checkpoint chỉ gồm việc hoàn thành."
        }
      ],
      "rubric": [
        {
          "id": "cli-batch-recovery",
          "title": "Phục hồi",
          "criteria": [
            "Không bỏ sót sau crash ở các điểm đã chọn.",
            "Checkpoint gắn input và thuật toán."
          ],
          "critical": true
        },
        {
          "id": "cli-batch-bounds",
          "title": "Tài nguyên và hủy",
          "criteria": [
            "Worker/queue/RAM có giới hạn đo được.",
            "Hủy dừng nhận việc và xử lý việc đang bay."
          ],
          "critical": true
        },
        {
          "id": "cli-batch-state",
          "title": "Toàn vẹn trạng thái",
          "criteria": [
            "Tail hỏng, schema lạ và lock có chính sách.",
            "Compact không phá checkpoint đang dùng."
          ],
          "critical": true
        },
        {
          "id": "cli-batch-contract",
          "title": "Hợp đồng CLI",
          "criteria": [
            "Status, stdout, stderr được test bằng binary.",
            "Định dạng máy giữ phiên bản."
          ],
          "critical": true
        },
        {
          "id": "cli-batch-evidence",
          "title": "Bằng chứng bàn giao",
          "criteria": [
            "Source, test âm, báo cáo đo và runbook tái hiện.",
            "Nêu môi trường chưa kiểm tra và giới hạn còn lại."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Source hoàn chỉnh với worker/hủy và Cargo.lock.",
        "Integration tests cho recovery và schema.",
        "Báo cáo memory/throughput theo jobs.",
        "Runbook lock/tail hỏng và bản phát hành có smoke test."
      ]
    }
  ],
  "assessment": {
    "title": "Tự đánh giá năng lực CLI",
    "instructions": "Trả lời tình huống và đối chiếu từng kỹ năng với bằng chứng dự án. Điểm trắc nghiệm là tự kiểm tra; không thay cho review source, test lỗi và chạy trên môi trường đích.",
    "passPercent": 80,
    "questions": [
      {
        "id": "cli-exam-01",
        "question": "CLI search không khớp và lỗi đọc tệp có nên dùng chung mã thoát?",
        "options": [
          "Không theo hợp đồng khóa học: 1 không khớp, 2 lỗi.",
          "Có, cả hai đều không có kết quả.",
          "Luôn trả 0 cho shell."
        ],
        "correct": 0,
        "explanation": "Script cần phân biệt báo cáo rỗng với xử lý thất bại.",
        "lessonIds": [
          "cli-interface-design",
          "cli-arguments"
        ]
      },
      {
        "id": "cli-exam-02",
        "question": "Cờ jobs=0 có ưu tiên cao hơn môi trường jobs=4. Làm gì?",
        "options": [
          "Báo lỗi từ cờ.",
          "Bỏ 0 và dùng 4.",
          "Tự sửa thành 1 mà không báo."
        ],
        "correct": 0,
        "explanation": "Giá trị tường minh sai phải bị validation phát hiện sau resolve.",
        "lessonIds": [
          "cli-config-layers"
        ]
      },
      {
        "id": "cli-exam-03",
        "question": "read_line rồi kiểm tra len có giữ RAM dưới giới hạn record không?",
        "options": [
          "Có trong mọi trường hợp.",
          "Không; cần giới hạn ngay lúc đọc.",
          "Chỉ khi thêm unwrap."
        ],
        "correct": 1,
        "explanation": "read_line có thể cấp phát đến newline trước bước kiểm tra.",
        "lessonIds": [
          "cli-streaming",
          "cli-record-validation"
        ]
      },
      {
        "id": "cli-exam-04",
        "question": "Logcheck xuất hai record rồi gặp dòng sai. Hành vi đúng?",
        "options": [
          "Trả 0 vì có output.",
          "Báo lỗi/status 2; output trước có thể đã tới consumer.",
          "Thu hồi bytes từ pipe."
        ],
        "correct": 1,
        "explanation": "Streaming có dữ liệu từng phần; status và stderr phản ánh sự không hoàn chỉnh.",
        "lessonIds": [
          "cli-log-project"
        ]
      },
      {
        "id": "cli-exam-05",
        "question": "exists false rồi create có đảm bảo không ghi đè?",
        "options": [
          "Có nếu đường dẫn tuyệt đối.",
          "Không; create_new phù hợp tạo mới nguyên tử.",
          "Có nếu chạy release."
        ],
        "correct": 1,
        "explanation": "TOCTOU tồn tại giữa kiểm tra và mở.",
        "lessonIds": [
          "cli-filesystem",
          "cli-plan-apply"
        ]
      },
      {
        "id": "cli-exam-06",
        "question": "Manifest nhiều tệp có checksum chứng minh điều gì?",
        "options": [
          "Có thông tin đối chiếu nội dung theo thuật toán, cần hiểu giới hạn snapshot/hash.",
          "Mọi checksum chống va chạm đối kháng.",
          "Snapshot toàn thư mục nguyên tử."
        ],
        "correct": 0,
        "explanation": "Quét tuần tự và FNV trong lab không cung cấp snapshot nguyên tử hay xác minh bảo mật.",
        "lessonIds": [
          "cli-manifest-project"
        ]
      },
      {
        "id": "cli-exam-07",
        "question": "Child đầy stdout trong lúc cha chỉ ghi stdin có thể dẫn đến gì?",
        "options": [
          "Hai bên chờ lẫn nhau; cần đọc/ghi đồng thời.",
          "Tự động tăng pipe vô hạn.",
          "Rust compiler ngăn toàn bộ tình huống."
        ],
        "correct": 0,
        "explanation": "Deadlock có thể xảy ra dù các kiểu Rust đúng.",
        "lessonIds": [
          "cli-child-processes",
          "cli-pipes"
        ]
      },
      {
        "id": "cli-exam-08",
        "question": "JSON Lines bị thêm dòng 'đang xử lý...' vào stdout có ảnh hưởng gì?",
        "options": [
          "Không ảnh hưởng consumer JSON.",
          "Chỉ thay đổi tốc độ.",
          "Phá hợp đồng; tiến độ cần stderr."
        ],
        "correct": 2,
        "explanation": "Mỗi dòng stdout phải đúng schema máy đã công bố.",
        "lessonIds": [
          "cli-machine-output"
        ]
      },
      {
        "id": "cli-exam-09",
        "question": "Sau crash trước checkpoint, baseline đã compute nhưng chưa lưu. Chạy tiếp thế nào?",
        "options": [
          "Coi mọi input đã xong.",
          "Xóa input để tránh trùng.",
          "Chạy lại công việc đó an toàn."
        ],
        "correct": 2,
        "explanation": "Checkpoint mới là bằng chứng được dùng để bỏ qua; cần thao tác chạy lại được.",
        "lessonIds": [
          "cli-cancellation",
          "cli-batch-project"
        ]
      },
      {
        "id": "cli-exam-10",
        "question": "Worker nhanh hơn consumer; queue không giới hạn có vấn đề gì?",
        "options": [
          "Không có vì Rust an toàn bộ nhớ.",
          "RAM có thể tăng theo backlog; cần backpressure.",
          "Luôn tăng throughput vô hạn."
        ],
        "correct": 1,
        "explanation": "An toàn kiểu không đặt giới hạn tài nguyên; bounded queue đưa áp lực ngược.",
        "lessonIds": [
          "cli-parallelism",
          "cli-batch-project"
        ]
      },
      {
        "id": "cli-exam-11",
        "question": "Thuật toán đạt unit test nhưng lỗi main luôn exit 0. Cần bằng chứng gì?",
        "options": [
          "Chụp help.",
          "Đếm số dòng source.",
          "Process test với input lỗi kiểm tra status/stdout/stderr."
        ],
        "correct": 2,
        "explanation": "Binary integration test kiểm tra lớp adapter mà unit test thuật toán bỏ qua.",
        "lessonIds": [
          "cli-process-tests"
        ]
      },
      {
        "id": "cli-exam-12",
        "question": "Build --locked trên Mac thành công có đủ công bố chạy trên Windows?",
        "options": [
          "Có vì cùng ngôn ngữ Rust.",
          "Có nếu đổi tên archive.",
          "Không; cần artifact target và smoke test môi trường đích."
        ],
        "correct": 2,
        "explanation": "Lockfile không chứng minh ABI/runtime/path behavior của hệ điều hành khác.",
        "lessonIds": [
          "cli-release-contracts",
          "cli-shipping"
        ]
      }
    ],
    "skills": [
      {
        "id": "cli-skill-1",
        "title": "Giao diện và cấu hình",
        "description": "Giải thích cờ, subcommand và mã thoát. Resolve cấu hình kèm nguồn. Đưa lệnh tái hiện và kết quả test cho reviewer.",
        "lessonIds": [
          "cli-interface-design",
          "cli-arguments",
          "cli-config-layers"
        ],
        "projectIds": [
          "cli-project-logcheck"
        ],
        "required": true
      },
      {
        "id": "cli-skill-2",
        "title": "Dữ liệu streaming và lọc log",
        "description": "Bảo vệ tài nguyên khi record hỏng. Xây CLI lọc log có test tiến trình. Đưa lệnh tái hiện và kết quả test cho reviewer.",
        "lessonIds": [
          "cli-streaming",
          "cli-record-validation",
          "cli-log-project"
        ],
        "projectIds": [
          "cli-project-logcheck"
        ],
        "required": true
      },
      {
        "id": "cli-skill-3",
        "title": "Filesystem và kiểm kê",
        "description": "Nhận diện giới hạn TOCTOU và snapshot. Bàn giao công cụ kiểm kê có schema. Đưa lệnh tái hiện và kết quả test cho reviewer.",
        "lessonIds": [
          "cli-filesystem",
          "cli-plan-apply",
          "cli-manifest-project"
        ],
        "projectIds": [
          "cli-project-assets"
        ],
        "required": true
      },
      {
        "id": "cli-skill-4",
        "title": "Ghép công cụ và định dạng máy",
        "description": "Phân biệt lỗi spawn, status và I/O. Giữ output có phiên bản và thứ tự. Đưa lệnh tái hiện và kết quả test cho reviewer.",
        "lessonIds": [
          "cli-pipes",
          "cli-child-processes",
          "cli-machine-output"
        ],
        "projectIds": [
          "cli-project-assets"
        ],
        "required": true
      },
      {
        "id": "cli-skill-5",
        "title": "Xử lý batch và khôi phục",
        "description": "Thiết kế checkpoint phụ thuộc input và thuật toán. Chạy lại không bỏ sót công việc. Đưa lệnh tái hiện và kết quả test cho reviewer.",
        "lessonIds": [
          "cli-parallelism",
          "cli-cancellation",
          "cli-batch-project"
        ],
        "projectIds": [
          "cli-project-batch"
        ],
        "required": true
      },
      {
        "id": "cli-skill-6",
        "title": "Kiểm thử và phát hành",
        "description": "Kiểm tra status, stdout, stderr độc lập. Bàn giao artifact và hướng dẫn nâng cấp. Đưa lệnh tái hiện và kết quả test cho reviewer.",
        "lessonIds": [
          "cli-process-tests",
          "cli-shipping",
          "cli-release-contracts"
        ],
        "projectIds": [
          "cli-project-batch"
        ],
        "required": true
      }
    ]
  }
};
