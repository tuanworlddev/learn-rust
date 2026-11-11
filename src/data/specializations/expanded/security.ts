import type { TrackExpansion } from "../../specialization-types";

export const securityExpansion: TrackExpansion = {
  "chapters": [
    {
      "id": "security-scope",
      "title": "Ranh giới và ngân sách phân tích",
      "description": "Xác định phạm vi trước khi parser nhận dữ liệu.",
      "lessonIds": [
        "security-input-boundaries",
        "security-threat-model",
        "security-budgeted-cursor"
      ],
      "outcomes": [
        "Phân biệt parser, worker isolation và kết luận phân tích.",
        "Giữ bounds, cursor và work budget rõ ràng."
      ]
    },
    {
      "id": "security-formats",
      "title": "Định dạng và inventory artifact",
      "description": "Đọc metadata đúng ý nghĩa, không thực thi input.",
      "lessonIds": [
        "security-object-metadata",
        "security-format-semantics",
        "security-inventory-project"
      ],
      "outcomes": [
        "Phân biệt RVA/VA/file offset và raw/virtual.",
        "Tạo fixture và report có giới hạn bằng object."
      ]
    },
    {
      "id": "security-limits",
      "title": "Số học, đường dẫn và độ phức tạp",
      "description": "Bảo vệ nhiều tầng tài nguyên và output.",
      "lessonIds": [
        "security-endian-budgets",
        "security-archive-paths",
        "security-integer-invariants"
      ],
      "outcomes": [
        "Kiểm tra length/count/stride trước truy cập.",
        "Phân biệt tên hợp lệ với filesystem containment."
      ]
    },
    {
      "id": "security-fuzz",
      "title": "Property, corpus và parser có hồi quy",
      "description": "Dùng oracle và fixture để kiểm chứng sâu.",
      "lessonIds": [
        "security-property-fuzzing",
        "security-corpus-design",
        "security-parser-project"
      ],
      "outcomes": [
        "Thiết kế roundtrip và seed có cấu trúc.",
        "Giữ regression và báo đúng phạm vi fuzz đã chạy."
      ]
    },
    {
      "id": "security-triage",
      "title": "Unsafe và điều tra lỗi",
      "description": "Tái hiện nguyên nhân và chọn công cụ đúng phạm vi.",
      "lessonIds": [
        "security-debugger-invariants",
        "security-unsafe-review",
        "security-crash-minimization"
      ],
      "outcomes": [
        "Viết invariant ownership/alignment/lifetime.",
        "Thu nhỏ cùng lỗi, không chỉ một input bị reject."
      ]
    },
    {
      "id": "security-release",
      "title": "Dependency và kiểm tra trước phát hành",
      "description": "So artifact với policy và bàn giao bằng chứng.",
      "lessonIds": [
        "security-triage-delivery",
        "security-dependency-review",
        "security-audit-project"
      ],
      "outcomes": [
        "Truy nguyên lockfile/toolchain/hash.",
        "Giữ baseline có nguồn gốc, không suy diễn metadata thành an toàn."
      ]
    }
  ],
  "lessons": [
    {
      "id": "security-threat-model",
      "moduleId": "track-security",
      "title": "Mô hình rủi ro cho công cụ phân tích",
      "description": "Xác định tài sản, đầu vào và giới hạn trước khi chọn parser hoặc cơ chế cô lập.",
      "duration": 50,
      "objectives": [
        "Xác định tài sản, đầu vào và giới hạn trước khi chọn parser hoặc cơ chế cô lập.",
        "Kiểm tra phạm vi nguồn, trần 1 MiB và ngân sách trước xử lý.",
        "Không gọi việc kiểm tra policy là sandbox hoặc xác thực chữ ký."
      ],
      "sections": [
        {
          "title": "Một công cụ đọc file cũng có bề mặt lỗi",
          "text": "Không thực thi binary là một ranh giới quan trọng, nhưng parser vẫn tiêu thụ CPU, RAM và tạo output. File có nhiều cấu trúc chồng lấn hoặc length sai có thể làm công cụ tốn tài nguyên, kể cả khi code không dùng unsafe. Tài sản cần bảo vệ gồm tính toàn vẹn dữ liệu gốc, thời gian máy phân tích, thư mục kết quả và nội dung báo cáo. Vẽ đường đi từ nguồn file qua reader, parser, mô hình trung gian rồi renderer. Mỗi bước nhận loại dữ liệu nào, có quyền gì và giới hạn nào phải được ghi rõ."
        },
        {
          "title": "Phạm vi đầu vào quyết định lựa chọn thư viện",
          "text": "Khóa học dùng artifact và fixture do chính dự án tạo, cùng parser định dạng học tập được viết để nhận byte tùy ý có trần. Crate object 0.40 công bố phạm vi trusted inputs và không có bảo vệ đầy đủ trước mọi DoS phức tạp; vì vậy không biến ví dụ inventory thành dịch vụ upload công khai hay khẳng định nó là bộ phân tích malware an toàn. Nếu sản phẩm cần file không tin cậy, thiết kế worker cô lập với hạn mức OS, quyền tối thiểu, deadline và quy trình lưu mẫu riêng; parser chỉ là một thành phần."
        },
        {
          "title": "Nói rõ điều được và chưa được chứng minh",
          "text": "Một file parse thành công chỉ chứng minh parser chấp nhận các cấu trúc đã đọc. Nó không chứng minh loader hệ điều hành sẽ diễn giải giống hệt, không chứng minh file vô hại và không xác thực nhà phát hành. Magic đúng cũng không đủ kết luận định dạng hoàn chỉnh. Báo cáo nên dùng câu mô tả như 'quan sát thấy section' hoặc 'không đọc được symbol table', giữ trạng thái incomplete khi thiếu dữ liệu. Đừng biến lỗi parser thành một danh sách trống rồi hiển thị rằng không có gì đáng chú ý.",
          "code": "fn admit(owned_fixture: bool, bytes: u64, remaining_ms: u64) -> Result<(), &'static str> {\n    if !owned_fixture { return Err(\"ngoai-pham-vi\"); }\n    if bytes > 1024 * 1024 { return Err(\"qua-lon\"); }\n    if remaining_ms == 0 { return Err(\"het-ngan-sach\"); }\n    Ok(())\n}"
        },
        {
          "title": "Thực hành quyết định nhận đầu vào",
          "text": "Bài tập áp dụng policy chỉ chấp nhận fixture đã xác định nguồn, kích thước trong trần và ngân sách còn lại. Đây là một kiểm tra chính sách mẫu, không là cơ chế xác minh chữ ký hoặc sandbox. Trong Cargo, test nguồn không phù hợp, file quá lớn và lỗi đọc để đảm bảo chúng dừng trước parser. Dự án inventory cần ghi hash, build/source fixture, phiên bản công cụ và các giới hạn vào báo cáo. Khi phạm vi sản phẩm đổi, cập nhật mô hình rủi ro cùng test và kiến trúc worker, không chỉ đổi nhãn 'trusted' trong cấu hình rồi giữ nguyên mọi giả định bên dưới."
        }
      ],
      "tip": "Chấp nhận cấu trúc không chứng minh hành vi, danh tính hay mọi ngữ nghĩa của loader.",
      "exercise": {
        "title": "Mô hình rủi ro cho công cụ phân tích",
        "instructions": "Xác định tài sản, đầu vào và giới hạn trước khi chọn parser hoặc cơ chế cô lập.",
        "requirements": [
          "Kiểm tra phạm vi nguồn, trần 1 MiB và ngân sách trước xử lý.",
          "Không gọi việc kiểm tra policy là sandbox hoặc xác thực chữ ký."
        ]
      },
      "starterCode": "fn admit(owned_fixture: bool, bytes: u64, remaining_ms: u64) -> Result<(), &'static str> { todo!() }\nfn main() {\nassert_eq!(admit(true,100,50),Ok(()));\nassert_eq!(admit(false,100,50),Err(\"ngoai-pham-vi\"));\nassert_eq!(admit(true,1024*1024+1,50),Err(\"qua-lon\"));\nassert_eq!(admit(true,100,0),Err(\"het-ngan-sach\"));\nprintln!(\"Fixture nằm trong phạm vi đã chọn\");\n}",
      "solutionCode": "fn admit(owned_fixture: bool, bytes: u64, remaining_ms: u64) -> Result<(), &'static str> {\n    if !owned_fixture { return Err(\"ngoai-pham-vi\"); }\n    if bytes > 1024 * 1024 { return Err(\"qua-lon\"); }\n    if remaining_ms == 0 { return Err(\"het-ngan-sach\"); }\n    Ok(())\n}\nfn main() {\nassert_eq!(admit(true,100,50),Ok(()));\nassert_eq!(admit(false,100,50),Err(\"ngoai-pham-vi\"));\nassert_eq!(admit(true,1024*1024+1,50),Err(\"qua-lon\"));\nassert_eq!(admit(true,100,0),Err(\"het-ngan-sach\"));\nprintln!(\"Fixture nằm trong phạm vi đã chọn\");\n}",
      "expectedOutput": "Fixture nằm trong phạm vi đã chọn",
      "hints": [
        "Kiểm tra phạm vi nguồn, trần 1 MiB và ngân sách trước xử lý.",
        "Chấp nhận cấu trúc không chứng minh hành vi, danh tính hay mọi ngữ nghĩa của loader."
      ],
      "quiz": {
        "question": "object parse thành công có chứng minh binary vô hại và loader sẽ hiểu giống hệt không?",
        "options": ["Có, parser thay được loader.", "Có nếu file có magic hợp lệ.", "Không; đó là các kết luận khác ngoài hợp đồng metadata parser."],
        "correct": 2,
        "explanation": "Chấp nhận cấu trúc không chứng minh hành vi, danh tính hay mọi ngữ nghĩa của loader."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://docs.rs/crate/object/0.40.0"
      }
    },
    {
      "id": "security-budgeted-cursor",
      "moduleId": "track-security",
      "title": "Cursor có ngân sách và lỗi không đổi vị trí",
      "description": "Đọc dữ liệu có giới hạn chi phí và giữ trạng thái parser khi thao tác thất bại.",
      "duration": 50,
      "objectives": [
        "Đọc dữ liệu có giới hạn chi phí và giữ trạng thái parser khi thao tác thất bại.",
        "Bounds hoặc hết budget không đổi offset/budget theo hợp đồng bài.",
        "Chỉ commit vị trí mới sau khi slice hợp lệ."
      ],
      "sections": [
        {
          "title": "Offset là dữ liệu cần được kiểm tra",
          "text": "Một cursor thường gồm slice gốc và offset hiện hành. Khi đọc n byte, tính end bằng checked_add rồi dùng get(offset..end). Chỉ cập nhật offset sau khi có slice hợp lệ. Nếu tăng offset trước và lỗi giữa chừng, caller có thể tiếp tục từ vị trí sai hoặc không tái hiện được báo cáo. Kiểu usize phù hợp indexing nhưng dữ liệu trên wire có thể là u32/u64; chuyển đổi phải được kiểm tra trên target hỗ trợ. Không dùng as một cách mặc định khi miền nguồn lớn hơn miền đích."
        },
        {
          "title": "Ngân sách nhiều chiều chặn nhiều loại tải",
          "text": "Giới hạn file chỉ chặn một phần chi phí. Parser có thể lặp nhiều lần trên cùng byte hoặc dựng nhiều object từ cấu trúc nhỏ. Cần thêm trần số bước, số record, độ sâu lồng và output. Budget được truyền xuống các hàm con, không tạo mới ở mỗi tầng làm tổng chi phí vượt trần. Khi hết budget, trả lỗi riêng để caller biết kết quả chưa đầy đủ. Nếu phải hiển thị phần đã đọc, dùng nhãn partial và không chạy kết luận cần toàn bộ dữ liệu trên phần thiếu đó."
        },
        {
          "title": "Một lần đọc nên có điều kiện commit rõ",
          "text": "Bài tập yêu cầu còn ít nhất một đơn vị work budget, kiểm tra range rồi mới giảm budget và tăng offset. Lỗi bounds giữ cả hai giá trị, giúp thử parser nhánh khác hoặc trả lỗi có vị trí chính xác. Chính sách này là lựa chọn của API; có parser tính cả lần thử thất bại vào budget để chống backtracking vô hạn. Khi đó vẫn cần ghi rõ và test. Điều quan trọng là caller không phải đoán những trường nào đã thay đổi sau Err và thuật toán không có đường bypass ngân sách.",
          "code": "fn take<'a>(bytes: &'a [u8], offset: &mut usize, budget: &mut usize, n: usize) -> Result<&'a [u8], &'static str> {\n    if *budget == 0 { return Err(\"budget\"); }\n    let end = offset.checked_add(n).ok_or(\"bounds\")?;\n    let result = bytes.get(*offset..end).ok_or(\"bounds\")?;\n    *offset=end; *budget-=1; Ok(result)\n}"
        },
        {
          "title": "Thực hành trên mọi điểm cắt",
          "text": "Tạo Cargo test lấy header hai byte, length hai byte và payload từ fixture; cắt input tại từng vị trí rồi kiểm tra offset/budget theo hợp đồng. Thêm zero-length read, n rất lớn và ngân sách bằng 0. Parser phức tạp có thể dùng checkpoint để khôi phục cursor khi một nhánh không khớp, nhưng ngân sách work nên được thiết kế tránh khôi phục vô hạn cùng chi phí. Trong dự án TLV, mỗi field tiêu thụ số bước hữu hạn và tag trùng bị từ chối sớm. Mã báo lỗi chỉ chứa offset và loại lỗi, không tự in toàn bộ payload chưa kiểm tra lên terminal. Test phải lưu rõ trạng thái trước và sau lỗi."
        }
      ],
      "tip": "Cần ngân sách work, depth, records và output theo thuật toán, ngoài byte đầu vào.",
      "exercise": {
        "title": "Cursor có ngân sách và lỗi không đổi vị trí",
        "instructions": "Đọc dữ liệu có giới hạn chi phí và giữ trạng thái parser khi thao tác thất bại.",
        "requirements": [
          "Bounds hoặc hết budget không đổi offset/budget theo hợp đồng bài.",
          "Chỉ commit vị trí mới sau khi slice hợp lệ."
        ]
      },
      "starterCode": "fn take<'a>(bytes: &'a [u8], offset: &mut usize, budget: &mut usize, n: usize) -> Result<&'a [u8], &'static str> { todo!() }\nfn main() {\nlet mut offset=0; let mut budget=2;\nassert_eq!(take(b\"abc\",&mut offset,&mut budget,2),Ok(&b\"ab\"[..]));\nassert_eq!(take(b\"abc\",&mut offset,&mut budget,2),Err(\"bounds\"));\nassert_eq!((offset,budget),(2,1));\nassert_eq!(take(b\"abc\",&mut offset,&mut budget,1),Ok(&b\"c\"[..]));\nassert_eq!(take(b\"abc\",&mut offset,&mut budget,0),Err(\"budget\"));\nprintln!(\"Cursor cuối: {offset}\");\n}",
      "solutionCode": "fn take<'a>(bytes: &'a [u8], offset: &mut usize, budget: &mut usize, n: usize) -> Result<&'a [u8], &'static str> {\n    if *budget == 0 { return Err(\"budget\"); }\n    let end = offset.checked_add(n).ok_or(\"bounds\")?;\n    let result = bytes.get(*offset..end).ok_or(\"bounds\")?;\n    *offset=end; *budget-=1; Ok(result)\n}\nfn main() {\nlet mut offset=0; let mut budget=2;\nassert_eq!(take(b\"abc\",&mut offset,&mut budget,2),Ok(&b\"ab\"[..]));\nassert_eq!(take(b\"abc\",&mut offset,&mut budget,2),Err(\"bounds\"));\nassert_eq!((offset,budget),(2,1));\nassert_eq!(take(b\"abc\",&mut offset,&mut budget,1),Ok(&b\"c\"[..]));\nassert_eq!(take(b\"abc\",&mut offset,&mut budget,0),Err(\"budget\"));\nprintln!(\"Cursor cuối: {offset}\");\n}",
      "expectedOutput": "Cursor cuối: 3",
      "hints": [
        "Bounds hoặc hết budget không đổi offset/budget theo hợp đồng bài.",
        "Cần ngân sách work, depth, records và output theo thuật toán, ngoài byte đầu vào."
      ],
      "quiz": {
        "question": "Tại sao trần kích thước file chưa đủ để bảo vệ parser khỏi mọi chi phí lớn?",
        "options": ["Vì usize luôn nhỏ.", "Vì thuật toán có thể lặp/backtrack hoặc dựng nhiều object trên cùng input nhỏ.", "Vì Rust không có checked_add."],
        "correct": 1,
        "explanation": "Cần ngân sách work, depth, records và output theo thuật toán, ngoài byte đầu vào."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/primitive.slice.html#method.get"
      },
      "simulation": {
        "title": "Cursor chỉ commit khi đọc đủ",
        "description": "Theo dõi offset và ngân sách ở nhánh đúng/lỗi.",
        "kind": "memory",
        "nodes": [
          {
            "id": "input",
            "label": "Input",
            "detail": "Slice byte gốc"
          },
          {
            "id": "range",
            "label": "Range",
            "detail": "Checked offset + length"
          },
          {
            "id": "slice",
            "label": "Slice",
            "detail": "get xác nhận bounds"
          },
          {
            "id": "state",
            "label": "State",
            "detail": "Offset/budget được commit"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Đủ byte",
            "steps": [
              {
                "title": "Trước đọc",
                "description": "Input abc, offset 0, budget 2.",
                "activeNodeIds": [
                  "input"
                ],
                "values": [
                  {
                    "label": "state",
                    "value": "0 / 2"
                  }
                ]
              },
              {
                "title": "Tính end",
                "description": "Muốn đọc 2 byte, end=2.",
                "activeNodeIds": [
                  "range"
                ],
                "values": [
                  {
                    "label": "end",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "Lấy slice",
                "description": "get(0..2) thành công.",
                "activeNodeIds": [
                  "slice"
                ],
                "values": [
                  {
                    "label": "value",
                    "value": "ab"
                  }
                ]
              },
              {
                "title": "Commit",
                "description": "Offset tăng, budget giảm sau validation.",
                "activeNodeIds": [
                  "state"
                ],
                "values": [
                  {
                    "label": "state",
                    "value": "2 / 1"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "Thiếu byte",
            "steps": [
              {
                "title": "Trước đọc",
                "description": "Offset 2, input chỉ dài 3.",
                "activeNodeIds": [
                  "input"
                ],
                "values": [
                  {
                    "label": "state",
                    "value": "2 / 1"
                  }
                ]
              },
              {
                "title": "Tính end",
                "description": "Muốn đọc 2 byte, end=4.",
                "activeNodeIds": [
                  "range"
                ],
                "values": [
                  {
                    "label": "end",
                    "value": "4"
                  }
                ]
              },
              {
                "title": "Bounds lỗi",
                "description": "get(2..4) không hợp lệ.",
                "activeNodeIds": [
                  "slice"
                ],
                "values": [
                  {
                    "label": "result",
                    "value": "Err(bounds)"
                  }
                ]
              },
              {
                "title": "Giữ state",
                "description": "Không đổi offset hoặc budget theo hợp đồng.",
                "activeNodeIds": [
                  "state"
                ],
                "values": [
                  {
                    "label": "state",
                    "value": "2 / 1"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "security-format-semantics",
      "moduleId": "track-security",
      "title": "ELF, PE, Mach-O: đọc đúng ý nghĩa metadata",
      "description": "Phân biệt file offset, địa chỉ ảo, section và dữ liệu thực sự có trên disk.",
      "duration": 50,
      "objectives": [
        "Phân biệt file offset, địa chỉ ảo, section và dữ liệu thực sự có trên disk.",
        "Tính delta và offset bằng checked arithmetic.",
        "Chỉ ánh xạ trong raw range, điểm cuối là exclusive."
      ],
      "sections": [
        {
          "title": "Các định dạng cùng chứa code nhưng không đồng nhất",
          "text": "ELF, PE/COFF và Mach-O có cách mô tả vùng nạp, section, symbol và relocation khác nhau. API chung giúp hỏi một tập thông tin tương tự nhưng không xóa khác biệt ngữ nghĩa. Section không luôn là vùng loader ánh xạ trực tiếp; symbol table có thể bị strip hoặc chia thành nhiều loại. File relocatable dùng cho linker khác executable đã liên kết. Báo cáo phải giữ format và kind, tránh dùng cùng một nhãn 'entry point' cho giá trị không có ý nghĩa thực thi trong một object file."
        },
        {
          "title": "Địa chỉ ảo không phải vị trí byte trên disk",
          "text": "Trong PE image, RVA là địa chỉ tương đối sau khi nạp, khác file offset trong nhiều trường hợp. Một section có virtual size lớn hơn raw size có thể có phần được zero-fill khi nạp; phần đó không có byte tương ứng để đọc từ file. Cộng RVA vào đầu buffer là sai. Để ánh xạ một khoảng có dữ liệu raw, kiểm tra RVA nằm trong miền thích hợp, lấy delta rồi cộng raw offset bằng checked arithmetic. Nếu phạm vi chồng lấn hoặc format có quy tắc đặc biệt, parser đơn giản phải báo không hỗ trợ thay vì đoán."
        },
        {
          "title": "Metadata thiếu khác metadata trống",
          "text": "Không có symbol quan sát được có thể do file stripped, format không có bảng tương ứng hoặc lỗi khi đọc. Báo cáo cần phân biệt các trường hợp nếu muốn đưa ra kết luận về bản build. Tên section và symbol là byte trong file, không mặc nhiên UTF-8 hoặc văn bản terminal an toàn. Giữ raw identity dưới dạng hex/hash khi cần so sánh, còn nhãn hiển thị phải escape control characters. Không phân loại binary là độc hại chỉ vì tên lạ, entropy cao hoặc section nhiều; các tín hiệu đó cần ngữ cảnh và bằng chứng khác.",
          "code": "fn rva_offset(rva: u64, virtual_start: u64, raw_start: u64, raw_size: u64) -> Option<u64> {\n    let delta=rva.checked_sub(virtual_start)?;\n    if delta>=raw_size { return None; }\n    raw_start.checked_add(delta)\n}"
        },
        {
          "title": "Thực hành ánh xạ một vùng đơn giản",
          "text": "Bài tập nhận một section giả lập với virtual start, raw start và raw size, chỉ đổi RVA nằm trong raw range thành offset. Kiểm tra overflow, zero-fill ngoài raw và điểm biên cuối không bao gồm. Trong Cargo, tạo object fixture của chính dự án bằng writer, inspect từng trường và so dữ liệu mong đợi. Dự án inventory không nạp hay gọi code trong fixture. Khi mở rộng sang một format mới, bổ sung fixture có BSS, symbol trống và trường không hỗ trợ, rồi mô tả rõ API chung đã giữ hoặc mất thông tin gì so với định dạng gốc. Giữ fixture cùng source để tái tạo."
        }
      ],
      "tip": "Miền địa chỉ sau nạp và miền byte trong file là hai phạm vi khác nhau.",
      "exercise": {
        "title": "ELF, PE, Mach-O: đọc đúng ý nghĩa metadata",
        "instructions": "Phân biệt file offset, địa chỉ ảo, section và dữ liệu thực sự có trên disk.",
        "requirements": [
          "Tính delta và offset bằng checked arithmetic.",
          "Chỉ ánh xạ trong raw range, điểm cuối là exclusive."
        ]
      },
      "starterCode": "fn rva_offset(rva: u64, virtual_start: u64, raw_start: u64, raw_size: u64) -> Option<u64> { todo!() }\nfn main() {\nassert_eq!(rva_offset(0x1010,0x1000,0x400,0x100),Some(0x410));\nassert_eq!(rva_offset(0x1100,0x1000,0x400,0x100),None);\nassert_eq!(rva_offset(0x999,0x1000,0x400,0x100),None);\nassert_eq!(rva_offset(1,0,u64::MAX,2),None);\nprintln!(\"File offset: 0x{:x}\",rva_offset(0x1010,0x1000,0x400,0x100).unwrap());\n}",
      "solutionCode": "fn rva_offset(rva: u64, virtual_start: u64, raw_start: u64, raw_size: u64) -> Option<u64> {\n    let delta=rva.checked_sub(virtual_start)?;\n    if delta>=raw_size { return None; }\n    raw_start.checked_add(delta)\n}\nfn main() {\nassert_eq!(rva_offset(0x1010,0x1000,0x400,0x100),Some(0x410));\nassert_eq!(rva_offset(0x1100,0x1000,0x400,0x100),None);\nassert_eq!(rva_offset(0x999,0x1000,0x400,0x100),None);\nassert_eq!(rva_offset(1,0,u64::MAX,2),None);\nprintln!(\"File offset: 0x{:x}\",rva_offset(0x1010,0x1000,0x400,0x100).unwrap());\n}",
      "expectedOutput": "File offset: 0x410",
      "hints": [
        "Tính delta và offset bằng checked arithmetic.",
        "Miền địa chỉ sau nạp và miền byte trong file là hai phạm vi khác nhau."
      ],
      "quiz": {
        "question": "RVA nằm trong phần virtual zero-fill nhưng ngoài raw size có byte tương ứng trên disk không?",
        "options": ["Không nhất thiết; không được đọc buffer như thể raw byte tồn tại.", "Luôn có tại offset bằng RVA.", "Có nếu file là PE."],
        "correct": 0,
        "explanation": "Miền địa chỉ sau nạp và miền byte trong file là hai phạm vi khác nhau."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://learn.microsoft.com/en-gb/windows/win32/debug/pe-format"
      }
    },
    {
      "id": "security-inventory-project",
      "moduleId": "track-security",
      "title": "Dự án: inventory artifact tự tạo bằng object",
      "description": "Đọc metadata có giới hạn, bảo toàn danh tính byte và xuất báo cáo không thực thi input.",
      "duration": 100,
      "objectives": [
        "Đọc metadata có giới hạn, bảo toàn danh tính byte và xuất báo cáo không thực thi input.",
        "Giữ ASCII hiển thị được, escape byte điều khiển và backslash.",
        "Không giải mã byte không hợp lệ thành nhãn gây nhập nhằng."
      ],
      "sections": [
        {
          "title": "Tạo fixture trước khi viết kết luận",
          "text": "Dự án dùng object writer tạo một relocatable ELF x86_64 nhỏ với section dữ liệu và symbol đã biết. Nhờ biết source của fixture, ta kiểm tra được inventory có đọc đúng format, architecture, section size và symbol count hay không. Binary này chỉ là dữ liệu cho parser, không được chạy. Có thể tạo thêm COFF hoặc Mach-O bằng cùng API nếu cần mở rộng test, nhưng kết quả phải được kiểm tra theo format. Không lấy một file ngoài Internet rồi dùng nó làm bằng chứng duy nhất rằng công cụ hiểu đúng cấu trúc."
        },
        {
          "title": "Reader và parser đều có trần",
          "text": "CLI đọc tối đa 1 MiB cộng một byte để phát hiện quá giới hạn, không chỉ kiểm tra metadata size trước read. Sau parse, tối đa 256 section và 4096 symbol được duyệt; tên có trần byte. Công cụ không giải nén section, không disassemble và không nạp thư viện. Các giới hạn này làm phạm vi mẫu rõ hơn nhưng không thay một worker cô lập cho input thù địch; object vẫn được dùng theo phạm vi trusted input đã công bố. Khi vượt trần, trả lỗi thay vì xuất báo cáo hoàn chỉnh bị cắt âm thầm."
        },
        {
          "title": "Thông tin đầu ra cần schema và nguồn gốc",
          "text": "Report chứa version schema, format, architecture, kind, số symbol và danh sách section có raw range/virtual size. Kiểm tra raw range bằng phép cộng có kiểm tra tràn và đối chiếu file length. Nhãn tên được escape trước khi ra terminal; JSON serializer xử lý các ký tự điều khiển theo định dạng. Không gọi file 'an toàn' dựa vào danh sách section. Báo cáo inventory chỉ ghi những gì quan sát được, kèm công cụ và phạm vi đầu vào. Nếu parser trả lỗi, giữ lỗi như một kết quả phân tích riêng.",
          "code": "fn safe_label(bytes: &[u8]) -> String {\n    let mut out=String::new();\n    for &byte in bytes {\n        if (0x20..=0x7e).contains(&byte) && byte!=b'\\\\' { out.push(char::from(byte)); }\n        else { out.push_str(&format!(\"\\\\x{byte:02x}\")); }\n    } out\n}"
        },
        {
          "title": "Thực hành bằng test đối chiếu",
          "text": "Cargo project có generator, inspector CLI và test fixture hợp lệ, input rỗng/ngắn, quá trần và tên có ký tự điều khiển. Test kiểm tra sự có mặt của section/symbol theo hợp đồng, không khóa địa chỉ ngẫu nhiên từ một build hệ điều hành. Tạo report ra stdout hoặc file mới theo lệnh, giữ binary nguồn nguyên trạng. Bài mở rộng là fixture mỗi format và một bảng các trường không so trực tiếp giữa format. Khi bàn giao, cung cấp source fixture, lệnh tạo, hash và phiên bản dependency. Đó là bằng chứng tái hiện được để người khác đánh giá công cụ thay vì tin một ảnh chụp output đẹp."
        }
      ],
      "tip": "Tên trong file là input; renderer có trust boundary riêng ngoài parser.",
      "exercise": {
        "title": "Dự án: inventory artifact tự tạo bằng object",
        "instructions": "Đọc metadata có giới hạn, bảo toàn danh tính byte và xuất báo cáo không thực thi input.",
        "requirements": [
          "Giữ ASCII hiển thị được, escape byte điều khiển và backslash.",
          "Không giải mã byte không hợp lệ thành nhãn gây nhập nhằng."
        ]
      },
      "starterCode": "fn safe_label(bytes: &[u8]) -> String { todo!() }\nfn main() {\nassert_eq!(safe_label(b\".text\"),\".text\");\nassert_eq!(safe_label(&[b'A',27,b'[',b'2',b'J']),\"A\\\\x1b[2J\");\nassert_eq!(safe_label(&[0xff]),\"\\\\xff\");\nprintln!(\"Tên: {}\",safe_label(&[b'A',10,b'B']));\n}",
      "solutionCode": "fn safe_label(bytes: &[u8]) -> String {\n    let mut out=String::new();\n    for &byte in bytes {\n        if (0x20..=0x7e).contains(&byte) && byte!=b'\\\\' { out.push(char::from(byte)); }\n        else { out.push_str(&format!(\"\\\\x{byte:02x}\")); }\n    } out\n}\nfn main() {\nassert_eq!(safe_label(b\".text\"),\".text\");\nassert_eq!(safe_label(&[b'A',27,b'[',b'2',b'J']),\"A\\\\x1b[2J\");\nassert_eq!(safe_label(&[0xff]),\"\\\\xff\");\nprintln!(\"Tên: {}\",safe_label(&[b'A',10,b'B']));\n}",
      "expectedOutput": "Tên: A\\x0aB",
      "hints": [
        "Giữ ASCII hiển thị được, escape byte điều khiển và backslash.",
        "Tên trong file là input; renderer có trust boundary riêng ngoài parser."
      ],
      "quiz": {
        "question": "Tên section có byte ESC. Nên in trực tiếp lên terminal không?",
        "options": ["Có vì chỉ là tên.", "Có nếu object parse không lỗi.", "Không; escape/biểu diễn byte để output không điều khiển terminal."],
        "correct": 2,
        "explanation": "Tên trong file là input; renderer có trust boundary riêng ngoài parser."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://docs.rs/crate/object/0.40.0"
      },
      "localLab": {
        "title": "Inventory artifact do dự án sở hữu",
        "instructions": "Tạo fixture bằng object writer rồi inspect dưới dạng dữ liệu. Không thực thi fixture. Công cụ dùng object theo phạm vi trusted inputs, không là dịch vụ nhận binary tùy ý hoặc bộ quét malware.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"security_inventory\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\nobject = { version = \"=0.40.0\", default-features = false, features = [\"read\", \"write\", \"std\"] }\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use object::{Object,ObjectSection,ObjectSymbol};\nuse serde::Serialize;\nuse std::{fs::File,io::Read,path::Path};\npub mod fixture;\npub const MAX_INPUT:usize=1024*1024;\n#[derive(Debug,PartialEq)] pub enum Error { Io,TooLarge,Format,Limit,Range,Name }\n#[derive(Debug,Serialize)] pub struct Section { pub name:String,pub kind:String,pub virtual_size:u64,pub file_range:Option<(u64,u64)> }\n#[derive(Debug,Serialize)] pub struct Report { pub schema:u32,pub format:String,pub architecture:String,pub kind:String,pub symbol_count:usize,pub sections:Vec<Section> }\npub fn safe_label(bytes: &[u8]) -> String {\n    let mut out=String::new();\n    for &byte in bytes {\n        if (0x20..=0x7e).contains(&byte) && byte!=b'\\\\' { out.push(char::from(byte)); }\n        else { out.push_str(&format!(\"\\\\x{byte:02x}\")); }\n    } out\n}\npub fn read_owned(path:impl AsRef<Path>)->Result<Vec<u8>,Error> {\n    let file=File::open(path).map_err(|_|Error::Io)?; let mut bytes=Vec::new();\n    file.take(MAX_INPUT as u64+1).read_to_end(&mut bytes).map_err(|_|Error::Io)?;\n    if bytes.len()>MAX_INPUT { Err(Error::TooLarge) } else { Ok(bytes) }\n}\npub fn inspect_owned(bytes:&[u8])->Result<Report,Error> {\n    if bytes.len()>MAX_INPUT { return Err(Error::TooLarge); }\n    let file=object::File::parse(bytes).map_err(|_|Error::Format)?;\n    let mut sections=Vec::new();\n    for section in file.sections() {\n        if sections.len()>=256 { return Err(Error::Limit); }\n        let name=section.name_bytes().map_err(|_|Error::Name)?;\n        if name.len()>256 { return Err(Error::Limit); }\n        let file_range=section.file_range();\n        if let Some((offset,size))=file_range {\n            if offset.checked_add(size).is_none_or(|end|end>bytes.len() as u64) { return Err(Error::Range); }\n        }\n        sections.push(Section {name:safe_label(name),kind:format!(\"{:?}\",section.kind()),virtual_size:section.size(),file_range});\n    }\n    let mut symbol_count=0usize;\n    for symbol in file.symbols() {\n        symbol_count+=1; if symbol_count>4096 { return Err(Error::Limit); }\n        if symbol.name_bytes().map_err(|_|Error::Name)?.len()>256 { return Err(Error::Limit); }\n    }\n    Ok(Report {schema:1,format:format!(\"{:?}\",file.format()),architecture:format!(\"{:?}\",file.architecture()),kind:format!(\"{:?}\",file.kind()),symbol_count,sections})\n}\n#[cfg(test)] mod tests {\n    use super::*;\n    #[test] fn known_fixture_metadata() {\n        let bytes=fixture::artifact(b\"public_value\",&[1,2,3,4]); let r=inspect_owned(&bytes).unwrap();\n        assert_eq!(r.format,\"Elf\"); assert_eq!(r.architecture,\"X86_64\"); assert_eq!(r.kind,\"Relocatable\");\n        let data=r.sections.iter().find(|s|s.name==\".data\").unwrap(); assert_eq!(data.virtual_size,4);\n        assert!(r.symbol_count>=1); assert!(data.file_range.is_some());\n    }\n    #[test] fn input_budget_and_invalid_format() {\n        assert!(matches!(inspect_owned(&vec![0;MAX_INPUT+1]),Err(Error::TooLarge)));\n        assert!(matches!(inspect_owned(&[]),Err(Error::Format)));\n        assert!(matches!(inspect_owned(b\"ELF\"),Err(Error::Format)));\n    }\n    #[test] fn terminal_names_are_escaped() {\n        assert_eq!(safe_label(&[27,b'[',b'2',b'J']),\"\\\\x1b[2J\");\n        assert_eq!(safe_label(b\"\\\\xff\"),\"\\\\x5cxff\"); assert_eq!(safe_label(&[0xff]),\"\\\\xff\");\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use security_inventory::{fixture,inspect_owned,read_owned};\nuse std::io::Write;\nfn main()->Result<(),String> {\n    let args:Vec<_>=std::env::args_os().collect();\n    if args.len()==3 && args[1]==\"fixture\" {\n        let mut output=std::fs::OpenOptions::new().write(true).create_new(true).open(&args[2]).map_err(|e|e.to_string())?;\n        output.write_all(&fixture::artifact(b\"public_value\",&[1,2,3,4])).map_err(|e|e.to_string())?;\n        println!(\"Đã tạo fixture của dự án\"); return Ok(());\n    }\n    if args.len()!=3 || args[1]!=\"inspect-owned\" { return Err(\"Dùng: fixture FILE_MOI | inspect-owned FILE_DO_DU_AN_SO_HUU\".into()); }\n    let bytes=read_owned(&args[2]).map_err(|e|format!(\"{e:?}\"))?;\n    let report=inspect_owned(&bytes).map_err(|e|format!(\"{e:?}\"))?;\n    println!(\"{}\",serde_json::to_string_pretty(&report).map_err(|e|e.to_string())?); Ok(())\n}\n"
          },
          {
            "path": "src/fixture.rs",
            "content": "use object::{Architecture,BinaryFormat,Endianness,SectionKind,SymbolFlags,SymbolKind,SymbolScope,write::{Object,Symbol,SymbolSection}};\npub fn artifact(symbol_name:&[u8],data:&[u8])->Vec<u8> {\n    let mut object=Object::new(BinaryFormat::Elf,Architecture::X86_64,Endianness::Little);\n    let section=object.add_section(Vec::new(),b\".data\".to_vec(),SectionKind::Data);\n    object.append_section_data(section,data,1);\n    object.add_symbol(Symbol { name:symbol_name.to_vec(),value:0,size:data.len() as u64,kind:SymbolKind::Data,scope:SymbolScope::Linkage,weak:false,section:SymbolSection::Section(section),flags:SymbolFlags::None });\n    object.write().expect(\"Fixture builder with known ELF fields\")\n}\n"
          },
          {
            "path": "README.md",
            "content": "# Inventory có hợp đồng\n\nTạo relocatable ELF x86_64 do writer của dự án sinh, có .data và public_value. inspect-owned chỉ dùng cho artifact mà nhóm có nguồn gốc rõ và kiểm soát. Không chạy binary hoặc nạp thư viện; không giải nén/disassemble. object 0.40.0 nêu trusted-input scope, không xử lý đầy đủ DoS hoặc mô phỏng loader. Kích thước nhỏ và code Rust không biến parser thành sandbox.\n\nTrần: 1 MiB input thực đọc, 256 section, 4096 symbol, 256 byte mỗi tên. Range raw kiểm tra overflow và file length. Report schema=1 giữ format/architecture/kind, raw range/virtual size và symbol count. Tên hiển thị escape control/backslash/non-ASCII byte; không in raw ESC. Lỗi parse/limit là kết quả lỗi, không thay bằng report rỗng.\n\nMở rộng: thêm fixture COFF/Mach-O/BSS, kiểm tra trường không có tương đương giữa format, giữ source/hash fixture. Nếu yêu cầu sản phẩm đổi sang input không tin cậy, phải thiết kế worker cô lập có deadline/quota OS và quyền tối thiểu trước; không chỉ đổi tên command. Inventory không kết luận artifact an toàn, xác thực hoặc tương thích ABI.\n\nCác file output được create_new để không ghi đè artifact cũ. Dùng thư mục thử riêng khi chạy lại. Báo cáo bàn giao ghi toolchain, crate version, input hash, phạm vi đã đọc và giới hạn chưa kiểm chứng.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run -- fixture owned-fixture.o",
          "cargo run -- inspect-owned owned-fixture.o"
        ],
        "checks": [
          "Fixture format/architecture/kind và section .data đúng.",
          "Input rỗng/ngắn/quá trần trả lỗi.",
          "Tên có ESC/backslash/non-UTF8 byte không được in raw.",
          "Không thực thi artifact hoặc gọi dịch vụ ngoài."
        ]
      }
    },
    {
      "id": "security-archive-paths",
      "moduleId": "track-security",
      "title": "Đường dẫn trong archive và lỗi traversal",
      "description": "Phân biệt kiểm tra tên với bảo đảm containment khi viết công cụ xử lý nhiều file.",
      "duration": 50,
      "objectives": [
        "Phân biệt kiểm tra tên với bảo đảm containment khi viết công cụ xử lý nhiều file.",
        "Chỉ nhận tên tương đối theo policy slash đã công bố.",
        "Từ chối thành phần traversal, rỗng, backslash, colon và tên quá dài."
      ],
      "sections": [
        {
          "title": "Tên entry là dữ liệu của định dạng",
          "text": "Một archive có thể chứa đường dẫn tuyệt đối, thành phần '..', dấu phân cách khác nền tảng hoặc hai tên cùng trỏ tới một vị trí sau chuẩn hóa. Nếu ghép trực tiếp destination.join(name), công cụ có thể ghi ngoài thư mục dự kiến. Bài học chỉ kiểm tra tên logic và không giải nén archive. Quy tắc mẫu dùng đường dẫn tương đối dạng slash, không cho thành phần rỗng, '.' hoặc '..', không cho dấu ':' hoặc backslash. Đây là policy bảo thủ được định nghĩa cho ứng dụng, không là parser đầy đủ cho mọi tên hợp lệ trên mọi hệ điều hành."
        },
        {
          "title": "Chuẩn hóa chuỗi không chứng minh filesystem an toàn",
          "text": "Ngay cả khi tên không có '..', một thư mục con có thể là symlink dẫn ra ngoài. Kiểm tra canonicalize rồi mở sau đó có thể bị race nếu tác nhân khác thay đổi cấu trúc giữa hai bước. Viết file an toàn cần chiến lược dựa trên handle thư mục, không theo symlink ngoài ý muốn, quyền thư mục riêng và API phù hợp OS. Không đưa một helper kiểm tra string lên UI rồi nói hệ thống đã ngăn mọi traversal. Tách rõ điều helper chứng minh và điều adapter filesystem còn phải chứng minh."
        },
        {
          "title": "Ngân sách archive gồm dữ liệu sau xử lý",
          "text": "File nén nhỏ có thể tạo lượng output rất lớn. Giới hạn byte đầu vào cần đi cùng trần số entry, kích thước từng entry, tổng byte sau giải nén, depth và thời gian. Header khai báo kích thước có thể sai; kiểm tra theo byte thực sự ghi/giải nén. Xử lý duplicate path theo chính sách từ chối hoặc mapping rõ, tránh ghi đè âm thầm. Metadata về quyền, owner hoặc link cũng là input; một công cụ inventory thường chỉ cần báo chúng, không áp dụng chúng lên máy phân tích.",
          "code": "fn archive_name(name: &str) -> bool {\n    !name.is_empty() && name.len()<=256 && !name.starts_with('/') && !name.contains(['\\\\',':']) &&\n    name.split('/').all(|part|!part.is_empty() && part!=\".\" && part!=\"..\")\n}"
        },
        {
          "title": "Thực hành policy tên có fixture chéo nền tảng",
          "text": "Bài tập chấp nhận a/b.txt, từ chối ../x, /tmp/x, a//b, tên kiểu Windows và backslash. Cargo test thêm Unicode, độ dài vượt trần, tên trùng sau normalization và thành phần rất sâu. Hàm trả quyết định theo policy, không tạo file hoặc gọi shell. Nếu mở rộng thành extractor trong dự án riêng, viết test trong thư mục tạm do mình sở hữu cho symlink và race dưới mô hình đã chọn, rồi dùng adapter OS phù hợp. Trong khóa phân tích này, inventory giữ nguyên artifact và xuất báo cáo nên không cần mở thêm bề mặt ghi filesystem không cần thiết."
        }
      ],
      "tip": "String validation không tự chứng minh containment của thao tác filesystem.",
      "exercise": {
        "title": "Đường dẫn trong archive và lỗi traversal",
        "instructions": "Phân biệt kiểm tra tên với bảo đảm containment khi viết công cụ xử lý nhiều file.",
        "requirements": [
          "Chỉ nhận tên tương đối theo policy slash đã công bố.",
          "Từ chối thành phần traversal, rỗng, backslash, colon và tên quá dài."
        ]
      },
      "starterCode": "fn archive_name(name: &str) -> bool { todo!() }\nfn main() {\nassert!(archive_name(\"a/b.txt\"));\nfor bad in [\"../x\",\"/tmp/x\",\"a//b\",\"C:/x\",\"a\\\\b\",\"a/./b\"] { assert!(!archive_name(bad)); }\nprintln!(\"a/b.txt đạt policy tên\");\n}",
      "solutionCode": "fn archive_name(name: &str) -> bool {\n    !name.is_empty() && name.len()<=256 && !name.starts_with('/') && !name.contains(['\\\\',':']) &&\n    name.split('/').all(|part|!part.is_empty() && part!=\".\" && part!=\"..\")\n}\nfn main() {\nassert!(archive_name(\"a/b.txt\"));\nfor bad in [\"../x\",\"/tmp/x\",\"a//b\",\"C:/x\",\"a\\\\b\",\"a/./b\"] { assert!(!archive_name(bad)); }\nprintln!(\"a/b.txt đạt policy tên\");\n}",
      "expectedOutput": "a/b.txt đạt policy tên",
      "hints": [
        "Chỉ nhận tên tương đối theo policy slash đã công bố.",
        "String validation không tự chứng minh containment của thao tác filesystem."
      ],
      "quiz": {
        "question": "Tên không có '..' có đủ chứng minh một lần ghi luôn nằm trong thư mục đích không?",
        "options": ["Có, mọi filesystem chỉ dùng chuỗi.", "Có nếu dùng PathBuf.", "Không; symlink, race và API mở file còn cần được kiểm soát."],
        "correct": 2,
        "explanation": "String validation không tự chứng minh containment của thao tác filesystem."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/path/struct.Path.html"
      }
    },
    {
      "id": "security-integer-invariants",
      "moduleId": "track-security",
      "title": "Số học có kiểm tra và độ phức tạp parser",
      "description": "Kiểm tra tích count×stride, offset và ngân sách trước khi đọc bảng nhị phân.",
      "duration": 50,
      "objectives": [
        "Kiểm tra tích count×stride, offset và ngân sách trước khi đọc bảng nhị phân.",
        "Tính count×stride và end bằng checked arithmetic.",
        "Trần 1024 record, stride khác 0 và range nằm trong file."
      ],
      "sections": [
        {
          "title": "Không chỉ phép cộng mới có thể tràn",
          "text": "Một header chứa count và stride thường dùng để xác định kích thước bảng. Nếu count × stride tràn rồi kết quả nhỏ được đem so file length, kiểm tra bounds có thể bị vượt qua. Dùng checked_mul trước checked_add, chuyển kiểu có kiểm tra rồi mới tạo slice. Không sửa bằng saturating arithmetic nếu giá trị bão hòa làm một input không hợp lệ bị coi là hợp lệ; saturating phù hợp khi chính sách thực sự muốn chặn tại trần, không thay thế phát hiện lỗi định dạng."
        },
        {
          "title": "Giới hạn logic trước giới hạn địa chỉ",
          "text": "Một bảng nằm hoàn toàn trong file vẫn có thể quá nhiều entry cho nghiệp vụ. Đặt MAX_RECORDS trước khi lặp, cùng trần kích thước record và tổng output. Nếu record tham chiếu record khác, một vòng tham chiếu có thể gây lặp vô hạn dù mọi offset đều trong bounds. Dùng visited set có trần hoặc depth budget theo cấu trúc, và phân biệt cycle với dữ liệu thiếu. Một thuật toán O(n²) trên input vài megabyte có thể tốn đáng kể; memory safety không đồng nghĩa thời gian xử lý được giới hạn."
        },
        {
          "title": "Đếm theo byte thực và công việc thực",
          "text": "Độ dài khai báo không luôn trùng dữ liệu đã đọc hoặc giải nén. Với một decoder, tăng counter theo output thực tế, kiểm tra trước khi append và trả lỗi khi vượt trần. Với backtracking parser, số lần thử cũng tiêu thụ work budget; không reset budget khi quay lại checkpoint. Với chuỗi, số scalar và byte phục vụ các giới hạn khác nhau. Trong báo cáo, nêu giới hạn nào áp dụng cho input byte, record count, depth và output để người dùng biết vì sao công cụ từ chối một fixture lớn.",
          "code": "fn table_range(offset: u64, count: u64, stride: u64, file_len: u64) -> Option<(u64,u64)> {\n    if count>1024 || stride==0 { return None; }\n    let size=count.checked_mul(stride)?; let end=offset.checked_add(size)?;\n    (end<=file_len).then_some((offset,end))\n}"
        },
        {
          "title": "Thực hành chứng minh một vùng bảng",
          "text": "Bài tập nhận offset, count, stride và file_len kiểu u64, từ chối count vượt 1024 hoặc stride bằng 0, rồi tính range bằng checked arithmetic. Test count=0 có nghĩa bảng rỗng tại offset hợp lệ, offset ở cuối file và tích tràn. Trong Cargo parser TLV, lập bảng mỗi phép đọc tiêu thụ bao nhiêu byte/bước và test mọi trường length bị sửa. Khi tìm thấy input tốn thời gian, lưu fixture, đo bằng workload có giới hạn và sửa thuật toán thay vì chỉ tăng timeout. Các regression test cần giữ cả tính đúng lẫn trần tài nguyên mà bản sửa hướng tới. Ghi thời gian và số bước với cùng seed để người review phân biệt một tối ưu thật với khác biệt do dữ liệu thử."
        }
      ],
      "tip": "Bounds bảo vệ vùng truy cập, còn ngân sách công việc bảo vệ tài nguyên tính toán.",
      "exercise": {
        "title": "Số học có kiểm tra và độ phức tạp parser",
        "instructions": "Kiểm tra tích count×stride, offset và ngân sách trước khi đọc bảng nhị phân.",
        "requirements": [
          "Tính count×stride và end bằng checked arithmetic.",
          "Trần 1024 record, stride khác 0 và range nằm trong file."
        ]
      },
      "starterCode": "fn table_range(offset: u64, count: u64, stride: u64, file_len: u64) -> Option<(u64,u64)> { todo!() }\nfn main() {\nassert_eq!(table_range(8,3,4,20),Some((8,20)));\nassert_eq!(table_range(20,0,4,20),Some((20,20)));\nassert_eq!(table_range(0,1025,1,2000),None);\nassert_eq!(table_range(0,2,u64::MAX,u64::MAX),None);\nprintln!(\"Bảng nằm trong [8, 20)\");\n}",
      "solutionCode": "fn table_range(offset: u64, count: u64, stride: u64, file_len: u64) -> Option<(u64,u64)> {\n    if count>1024 || stride==0 { return None; }\n    let size=count.checked_mul(stride)?; let end=offset.checked_add(size)?;\n    (end<=file_len).then_some((offset,end))\n}\nfn main() {\nassert_eq!(table_range(8,3,4,20),Some((8,20)));\nassert_eq!(table_range(20,0,4,20),Some((20,20)));\nassert_eq!(table_range(0,1025,1,2000),None);\nassert_eq!(table_range(0,2,u64::MAX,u64::MAX),None);\nprintln!(\"Bảng nằm trong [8, 20)\");\n}",
      "expectedOutput": "Bảng nằm trong [8, 20)",
      "hints": [
        "Tính count×stride và end bằng checked arithmetic.",
        "Bounds bảo vệ vùng truy cập, còn ngân sách công việc bảo vệ tài nguyên tính toán."
      ],
      "quiz": {
        "question": "Bảng nằm trong file có bảo đảm thuật toán duyệt nó luôn nhanh không?",
        "options": ["Không; số record, cycle, depth và độ phức tạp vẫn cần ngân sách.", "Có, bounds là đủ.", "Có nếu parser viết Rust."],
        "correct": 0,
        "explanation": "Bounds bảo vệ vùng truy cập, còn ngân sách công việc bảo vệ tài nguyên tính toán."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://doc.rust-lang.org/std/primitive.u64.html#method.checked_mul"
      }
    },
    {
      "id": "security-corpus-design",
      "moduleId": "track-security",
      "title": "Corpus, oracle và fuzzing đi sâu vào parser",
      "description": "Thiết kế mẫu đầu vào và thuộc tính đủ mạnh để fuzz tìm được lỗi có ý nghĩa.",
      "duration": 50,
      "objectives": [
        "Thiết kế mẫu đầu vào và thuộc tính đủ mạnh để fuzz tìm được lỗi có ý nghĩa.",
        "Roundtrip giữ mọi byte, kể cả 0 và 255.",
        "So dữ liệu đã decode, không chỉ độ dài chuỗi hex."
      ],
      "sections": [
        {
          "title": "Fuzzer cần một câu hỏi có thể kiểm tra",
          "text": "Harness gọi parser rồi bỏ Result giúp tìm panic nhưng không phát hiện mọi sai lệch ngữ nghĩa. Oracle là điều kiện cần luôn đúng: output trong giới hạn, cursor không vượt input, encode(parse(x)) đọc lại được hoặc một transaction lỗi không đổi trạng thái. Chọn thuộc tính từ hợp đồng định dạng, không so hai hàm có cùng lỗi rồi coi bằng nhau là đúng. Nếu parser chấp nhận nhiều biểu diễn tương đương, roundtrip phải so mô hình dữ liệu hoặc dạng canonical đã định nghĩa, không nhất thiết trả nguyên byte ban đầu."
        },
        {
          "title": "Corpus nhỏ nhưng đại diện các cấu trúc",
          "text": "Byte ngẫu nhiên thường bị loại ở magic hoặc version nên ít chạm phần xử lý sâu. Seed gồm một message hợp lệ tối thiểu, tất cả tag, length biên, Unicode, trường tùy chọn và cấu trúc lồng nếu định dạng có. Thêm các fixture lỗi đã sửa để không mất regression khi corpus được tối giản. Corpus không cần chứa dữ liệu riêng tư hoặc binary không rõ nguồn. Trong bài, mọi mẫu được tạo từ encoder và đột biến có kiểm soát của giao thức học tập, giúp tái hiện mà không phụ thuộc tài liệu hoặc dịch vụ bên ngoài."
        },
        {
          "title": "Thu nhỏ corpus khác thu nhỏ một lỗi",
          "text": "Corpus minimization giữ tập input giúp coverage hữu ích với ít mẫu hơn. Crash minimization tìm một input nhỏ vẫn gây cùng lỗi để hiểu nguyên nhân. Hai thao tác không thay thế nhau. Trước khi minimization, lưu hash, bản gốc, toolchain, feature và lệnh tái hiện; nếu môi trường thay đổi, cùng input có thể đi vào nhánh khác. Một timeout có thể do thuật toán, máy tải cao hoặc harness chờ I/O; harness parser nên deterministic, không mạng và có trần dữ liệu để kết quả đáng tin hơn.",
          "code": "fn hex_roundtrip(bytes: &[u8]) -> bool {\n    let encoded: String=bytes.iter().map(|b|format!(\"{b:02x}\")).collect();\n    let decoded: Result<Vec<u8>,_>=encoded.as_bytes().chunks_exact(2).map(|pair|u8::from_str_radix(std::str::from_utf8(pair).unwrap(),16)).collect();\n    decoded.as_deref()==Ok(bytes)\n}"
        },
        {
          "title": "Thực hành oracle roundtrip có giới hạn",
          "text": "Bài tập lấy một tập giá trị byte, encode thành cặp hex rồi decode để kiểm tra roundtrip; lỗi độ dài hoặc ký tự không hợp lệ phải được giữ. Trong Cargo project TLV, oracle mạnh hơn kiểm tra model title/count, giới hạn số field và dạng canonical. Chạy unit test fixture trước, sau đó fuzz theo ngân sách thời gian, input length và RSS đã chọn. Kết quả không tìm thấy crash chỉ mô tả khoảng chạy và corpus đó, không chứng minh parser an toàn tuyệt đối. Báo cáo coverage, nhánh còn chưa chạm và regression được thêm để người review biết bằng chứng thực sự có đến đâu."
        }
      ],
      "tip": "Fuzzing khám phá một phần không gian thực thi; cần hợp đồng, review và test bổ sung.",
      "exercise": {
        "title": "Corpus, oracle và fuzzing đi sâu vào parser",
        "instructions": "Thiết kế mẫu đầu vào và thuộc tính đủ mạnh để fuzz tìm được lỗi có ý nghĩa.",
        "requirements": [
          "Roundtrip giữ mọi byte, kể cả 0 và 255.",
          "So dữ liệu đã decode, không chỉ độ dài chuỗi hex."
        ]
      },
      "starterCode": "fn hex_roundtrip(bytes: &[u8]) -> bool { todo!() }\nfn main() {\nassert!(hex_roundtrip(&[0,1,127,255])); assert!(hex_roundtrip(&[]));\nprintln!(\"Roundtrip giữ nguyên byte\");\n}",
      "solutionCode": "fn hex_roundtrip(bytes: &[u8]) -> bool {\n    let encoded: String=bytes.iter().map(|b|format!(\"{b:02x}\")).collect();\n    let decoded: Result<Vec<u8>,_>=encoded.as_bytes().chunks_exact(2).map(|pair|u8::from_str_radix(std::str::from_utf8(pair).unwrap(),16)).collect();\n    decoded.as_deref()==Ok(bytes)\n}\nfn main() {\nassert!(hex_roundtrip(&[0,1,127,255])); assert!(hex_roundtrip(&[]));\nprintln!(\"Roundtrip giữ nguyên byte\");\n}",
      "expectedOutput": "Roundtrip giữ nguyên byte",
      "hints": [
        "Roundtrip giữ mọi byte, kể cả 0 và 255.",
        "Fuzzing khám phá một phần không gian thực thi; cần hợp đồng, review và test bổ sung."
      ],
      "quiz": {
        "question": "Fuzz không thấy crash trong 30 giây có chứng minh parser an toàn cho mọi input không?",
        "options": ["Có, libFuzzer duyệt hết mọi byte.", "Không; đó là bằng chứng trong corpus, thời gian và cấu hình đã chạy.", "Có nếu coverage lớn hơn 50%."],
        "correct": 1,
        "explanation": "Fuzzing khám phá một phần không gian thực thi; cần hợp đồng, review và test bổ sung."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://rust-fuzz.github.io/book/cargo-fuzz/structure-aware-fuzzing.html"
      }
    },
    {
      "id": "security-parser-project",
      "moduleId": "track-security",
      "title": "Dự án: parser TLV và bộ hồi quy có fuzz target",
      "description": "Viết parser tự chứa, giới hạn chặt và kiểm chứng bằng fixture, mutation cùng roundtrip.",
      "duration": 100,
      "objectives": [
        "Viết parser tự chứa, giới hạn chặt và kiểm chứng bằng fixture, mutation cùng roundtrip.",
        "Count field phải đúng 4 byte big-endian.",
        "Chỉ nhận miền 0..10000, không bỏ byte thừa hoặc thiếu."
      ],
      "sections": [
        {
          "title": "Đặc tả đủ nhỏ để kiểm chứng đầy đủ",
          "text": "Định dạng LearnRecord bắt đầu bằng hai byte LR, version 1 và số field. Mỗi field gồm tag u8, length u16 big-endian và payload. Tag 1 là title UTF-8 không rỗng, tối đa 64 byte và không có control character; tag 2 là count u32 big-endian, tối đa 10.000. Cả hai tag phải xuất hiện đúng một lần; không chấp nhận tag lạ hoặc byte thừa cuối message. Tổng input tối đa 4096 byte và số field tối đa 16. Những quy tắc này là toàn bộ hợp đồng của phiên bản học tập."
        },
        {
          "title": "Parser không sửa mô hình trước validation",
          "text": "Cursor lấy slice có bounds, giải mã từng trường vào biến tạm và từ chối duplicate trước khi ghi đè. Chỉ tạo Message khi đủ field và đã tiêu thụ toàn bộ input. Không dùng unsafe hoặc tạo &str từ byte chưa kiểm tra UTF-8. Lỗi mang nhóm Header, Version, Length, Tag, Duplicate, Text hoặc Range để test và UI phân biệt. Encoder luôn ghi title rồi count theo dạng canonical, nên parser có thể chấp nhận thứ tự field khác mà roundtrip vẫn so được mô hình dữ liệu."
        },
        {
          "title": "Bộ test phải vượt qua ca đẹp",
          "text": "Unit test kiểm tra message hợp lệ, title Unicode, count 0/10.000, tag trùng, unknown tag, length dở và trailing bytes. Một vòng mutation thay từng byte bằng các giá trị biên; mỗi kết quả phải là Message hợp lệ hoặc Err, không panic. Các input parser chấp nhận được encode lại và parse lần nữa để kiểm tra roundtrip. Test này hữu hạn, không được gọi là fuzz đầy đủ. Fuzz target riêng dùng libFuzzer nhận byte slice và cùng oracle; harness không mở file lạ, không mạng và không thực thi nội dung payload.",
          "code": "fn count_field(bytes: &[u8]) -> Result<u32, &'static str> {\n    let array:[u8;4]=bytes.try_into().map_err(|_|\"length\")?;\n    let value=u32::from_be_bytes(array);\n    if value>10000 { Err(\"range\") } else { Ok(value) }\n}"
        },
        {
          "title": "Từ lỗi tìm thấy đến bản sửa",
          "text": "Chạy Cargo test trước, tạo corpus từ encoder và dùng lệnh fuzz có ngân sách. Khi phát hiện lỗi, lưu input nhỏ nhất còn cùng nguyên nhân, thêm regression với assertion chính xác rồi mới sửa. Không sửa bằng cách từ chối tất cả input chứa byte đã gây crash nếu byte đó hợp lệ theo đặc tả; cần sửa invariant bị vi phạm. Bàn giao bảng đặc tả, test matrix, corpus và báo cáo các lệnh đã chạy. Nếu chưa chạy fuzz vì thiếu toolchain, đánh dấu phần đó chưa xác minh thay vì suy diễn từ unit test. Dự án này là nền tảng parser riêng, không là bộ giải mã đầy đủ cho mọi executable. Mỗi lỗi cần một fixture tái hiện."
        }
      ],
      "tip": "Quy tắc duplicate thuộc đặc tả; không để implementation tự chọn hành vi mơ hồ.",
      "exercise": {
        "title": "Dự án: parser TLV và bộ hồi quy có fuzz target",
        "instructions": "Viết parser tự chứa, giới hạn chặt và kiểm chứng bằng fixture, mutation cùng roundtrip.",
        "requirements": [
          "Count field phải đúng 4 byte big-endian.",
          "Chỉ nhận miền 0..10000, không bỏ byte thừa hoặc thiếu."
        ]
      },
      "starterCode": "fn count_field(bytes: &[u8]) -> Result<u32, &'static str> { todo!() }\nfn main() {\nassert_eq!(count_field(&10000u32.to_be_bytes()),Ok(10000));\nassert_eq!(count_field(&10001u32.to_be_bytes()),Err(\"range\"));\nassert_eq!(count_field(&[0,0,1]),Err(\"length\"));\nprintln!(\"Count: {}\",count_field(&42u32.to_be_bytes()).unwrap());\n}",
      "solutionCode": "fn count_field(bytes: &[u8]) -> Result<u32, &'static str> {\n    let array:[u8;4]=bytes.try_into().map_err(|_|\"length\")?;\n    let value=u32::from_be_bytes(array);\n    if value>10000 { Err(\"range\") } else { Ok(value) }\n}\nfn main() {\nassert_eq!(count_field(&10000u32.to_be_bytes()),Ok(10000));\nassert_eq!(count_field(&10001u32.to_be_bytes()),Err(\"range\"));\nassert_eq!(count_field(&[0,0,1]),Err(\"length\"));\nprintln!(\"Count: {}\",count_field(&42u32.to_be_bytes()).unwrap());\n}",
      "expectedOutput": "Count: 42",
      "hints": [
        "Count field phải đúng 4 byte big-endian.",
        "Quy tắc duplicate thuộc đặc tả; không để implementation tự chọn hành vi mơ hồ."
      ],
      "quiz": {
        "question": "Parser gặp tag title lần thứ hai. Nên âm thầm dùng giá trị sau cùng không?",
        "options": ["Không, phiên bản này quy định mỗi tag đúng một lần nên trả Duplicate.", "Có, mọi TLV đều last-write-wins.", "Có nếu title mới ngắn hơn."],
        "correct": 0,
        "explanation": "Quy tắc duplicate thuộc đặc tả; không để implementation tự chọn hành vi mơ hồ."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://rust-fuzz.github.io/book/cargo-fuzz/tutorial.html"
      },
      "localLab": {
        "title": "LearnRecord parser, mutation tests và fuzz harness",
        "instructions": "Định dạng TLV được mô tả đầy đủ trong bài và README. Unit test chạy bằng stable; fuzz target riêng cần cargo-fuzz/toolchain phù hợp và luôn chạy theo ngân sách.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"security_tlv\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[workspace]\nmembers = [\".\"]\nexclude = [\"fuzz\"]\n"
          },
          {
            "path": "src/lib.rs",
            "content": "#[derive(Debug,Clone,PartialEq)] pub struct Message { pub title:String,pub count:u32 }\n#[derive(Debug,Clone,PartialEq)] pub enum Error { Budget,Header,Version,Length,Tag,Duplicate,Text,Range,Missing,Trailing }\nfn title_ok(title:&str)->bool { !title.is_empty() && title.len()<=64 && !title.chars().any(char::is_control) }\nfn take<'a>(bytes:&'a [u8],offset:&mut usize,n:usize)->Result<&'a [u8],Error> {\n    let end=offset.checked_add(n).ok_or(Error::Length)?; let part=bytes.get(*offset..end).ok_or(Error::Length)?; *offset=end; Ok(part)\n}\npub fn parse(bytes:&[u8])->Result<Message,Error> {\n    if bytes.len()>4096 { return Err(Error::Budget); }\n    let mut offset=0; let header=take(bytes,&mut offset,4)?;\n    if &header[..2]!=b\"LR\" { return Err(Error::Header); }\n    if header[2]!=1 { return Err(Error::Version); }\n    let fields=usize::from(header[3]); if fields>16 { return Err(Error::Budget); }\n    let mut title=None; let mut count=None;\n    for _ in 0..fields {\n        let tag=take(bytes,&mut offset,1)?[0]; let len=take(bytes,&mut offset,2)?;\n        let len=usize::from(u16::from_be_bytes([len[0],len[1]])); let value=take(bytes,&mut offset,len)?;\n        match tag {\n            1 => {\n                if title.is_some() { return Err(Error::Duplicate); }\n                let value=std::str::from_utf8(value).map_err(|_|Error::Text)?;\n                if !title_ok(value) { return Err(Error::Text); }\n                title=Some(value.to_owned());\n            }\n            2 => {\n                if count.is_some() { return Err(Error::Duplicate); }\n                let data:[u8;4]=value.try_into().map_err(|_|Error::Length)?; let value=u32::from_be_bytes(data);\n                if value>10000 { return Err(Error::Range); } count=Some(value);\n            }\n            _=>return Err(Error::Tag),\n        }\n    }\n    if offset!=bytes.len() { return Err(Error::Trailing); }\n    Ok(Message {title:title.ok_or(Error::Missing)?,count:count.ok_or(Error::Missing)?})\n}\npub fn encode(message:&Message)->Result<Vec<u8>,Error> {\n    if !title_ok(&message.title) { return Err(Error::Text); } if message.count>10000 { return Err(Error::Range); }\n    let mut bytes=b\"LR\\x01\\x02\".to_vec();\n    bytes.push(1); bytes.extend_from_slice(&(message.title.len() as u16).to_be_bytes()); bytes.extend_from_slice(message.title.as_bytes());\n    bytes.push(2); bytes.extend_from_slice(&4u16.to_be_bytes()); bytes.extend_from_slice(&message.count.to_be_bytes()); Ok(bytes)\n}\npub fn check_oracle(bytes:&[u8]) {\n    if let Ok(message)=parse(bytes) {\n        assert!(message.title.len()<=64); assert!(message.count<=10000);\n        assert_eq!(parse(&encode(&message).unwrap()),Ok(message));\n    }\n}\n#[cfg(test)] mod tests {\n    use super::*;\n    fn good()->Vec<u8> { encode(&Message {title:\"Rust\".into(),count:42}).unwrap() }\n    #[test] fn roundtrip_unicode_and_endpoints() {\n        for count in [0,1,10000] { let message=Message {title:\"Tiếng Việt\".into(),count}; assert_eq!(parse(&encode(&message).unwrap()),Ok(message)); }\n    }\n    #[test] fn truncated_and_trailing() {\n        let bytes=good(); for end in 0..bytes.len() { assert!(parse(&bytes[..end]).is_err()); }\n        let mut bytes=bytes; bytes.push(0); assert_eq!(parse(&bytes),Err(Error::Trailing));\n    }\n    #[test] fn duplicate_unknown_range_and_text() {\n        let mut duplicate=b\"LR\\x01\\x02\".to_vec();\n        for _ in 0..2 { duplicate.extend_from_slice(&[1,0,1,b'A']); }\n        assert_eq!(parse(&duplicate),Err(Error::Duplicate));\n        let mut unknown=good(); unknown[4]=9; assert_eq!(parse(&unknown),Err(Error::Tag));\n        assert_eq!(encode(&Message {title:\"a\\nb\".into(),count:1}),Err(Error::Text));\n        assert_eq!(encode(&Message {title:\"a\".into(),count:10001}),Err(Error::Range));\n    }\n    #[test] fn deterministic_mutations_preserve_oracle() {\n        let good=good();\n        for index in 0..good.len() { for value in [0,1,2,16,64,127,255] {\n            let mut mutated=good.clone(); mutated[index]=value; check_oracle(&mutated);\n        }}\n        let mut seed=7u64;\n        for len in 0..256 {\n            let mut bytes=vec![0;len];\n            for byte in &mut bytes { seed=seed.wrapping_mul(6364136223846793005).wrapping_add(1); *byte=(seed>>32) as u8; }\n            check_oracle(&bytes);\n        }\n    }\n    #[test] fn budget_and_count_width() {\n        assert_eq!(parse(&vec![0;4097]),Err(Error::Budget));\n        let mut bytes=good(); bytes[3]=17; assert_eq!(parse(&bytes),Err(Error::Budget));\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use security_tlv::{Message,encode,parse};\nfn main() { let bytes=encode(&Message {title:\"Học Rust\".into(),count:42}).unwrap(); let message=parse(&bytes).unwrap(); println!(\"{}: {}\",message.title,message.count); }\n"
          },
          {
            "path": "fuzz/Cargo.toml",
            "content": "[package]\nname = \"security-tlv-fuzz\"\nversion = \"0.0.0\"\npublish = false\nedition = \"2024\"\n\n[package.metadata]\ncargo-fuzz = true\n\n[dependencies]\nlibfuzzer-sys = \"0.4\"\nsecurity_tlv = { path = \"..\" }\n\n[[bin]]\nname = \"parse_record\"\npath = \"fuzz_targets/parse_record.rs\"\ntest = false\ndoc = false\nbench = false\n\n[workspace]\nmembers = [\".\"]\n"
          },
          {
            "path": "fuzz/fuzz_targets/parse_record.rs",
            "content": "#![no_main]\nuse libfuzzer_sys::fuzz_target;\nfuzz_target!(|data: &[u8]| { security_tlv::check_oracle(data); });\n"
          },
          {
            "path": "examples/seeds.rs",
            "content": "use security_tlv::{Message,encode};\nfn main()->std::io::Result<()> {\n    let root=std::path::Path::new(\"fuzz/corpus/parse_record\"); std::fs::create_dir_all(root)?;\n    for (name,title,count) in [(\"minimal\",\"A\",0),(\"unicode\",\"Tiếng Việt\",10000),(\"max-title\",\"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",42)] {\n        std::fs::write(root.join(name),encode(&Message {title:title.into(),count}).unwrap())?;\n    } Ok(())\n}\n"
          },
          {
            "path": "README.md",
            "content": "# LearnRecord v1\n\nHeader LR, version byte 1, field count u8 <=16. Field: tag u8, length u16 BE, payload. Tag1 title UTF-8 1..64 byte, không control; tag2 count u32 BE 0..10000. Hai tag bắt buộc đúng một lần; tag lạ, duplicate và trailing bytes bị từ chối. Input tối đa 4096 byte. Encoder canonical ghi title rồi count; parser chấp nhận thứ tự khác nếu vẫn đủ/duy nhất.\n\nUnit test có mọi prefix cắt, Unicode/biên count, duplicate/tag lạ/trailing, deterministic byte mutation và oracle roundtrip. Đây là test hữu hạn, không phải bằng chứng đã chạy fuzz.\n\nFuzz trong dự án mình sở hữu: cài tool phù hợp bằng cargo install cargo-fuzz --locked, chuẩn bị nightly theo môi trường, chạy cargo run --example seeds, rồi cargo +nightly fuzz run parse_record -- -max_total_time=30 -max_len=4096 -rss_limit_mb=512. Harness chỉ parse byte, không mạng, không file ngoài và không thực thi payload. Nếu môi trường không hỗ trợ sanitizer/toolchain, ghi rõ chưa chạy; cargo test vẫn là bước kiểm chứng độc lập.\n\nKhi có artifact lỗi: lưu hash, commit, feature, toolchain và lệnh; chạy lại cùng input; dùng cargo fuzz tmin parse_record DUONG_DAN_ARTIFACT để thu nhỏ cùng lỗi trong môi trường kiểm thử. Chuyển fixture nhỏ thành unit regression với expected Result cụ thể. Corpus minimization là thao tác khác, không được làm mất regression cần giữ. Báo cáo ngân sách, coverage và nhánh chưa chạm; không tìm thấy crash không đồng nghĩa an toàn tuyệt đối.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run",
          "cargo run --example seeds"
        ],
        "checks": [
          "Mọi prefix cắt từ message hợp lệ đều bị từ chối.",
          "Duplicate/unknown/trailing/range/text lỗi có nhóm rõ.",
          "Parser chấp nhận thì encode-parse giữ Message.",
          "Fuzz harness được cung cấp riêng; chỉ ghi PASS fuzz khi thực sự chạy theo ngân sách."
        ]
      }
    },
    {
      "id": "security-unsafe-review",
      "moduleId": "track-security",
      "title": "Review unsafe, FFI và công cụ kiểm tra bộ nhớ",
      "description": "Viết nghĩa vụ chứng minh cho abstraction trước khi dựa vào test hoặc Miri.",
      "duration": 50,
      "objectives": [
        "Viết nghĩa vụ chứng minh cho abstraction trước khi dựa vào test hoặc Miri.",
        "Dùng bounds checked và from_le_bytes thay pointer cast.",
        "Offset tràn hoặc thiếu byte trả None."
      ],
      "sections": [
        {
          "title": "Unsafe mở quyền, không bỏ nghĩa vụ",
          "text": "Một unsafe block cho phép một số thao tác mà compiler không chứng minh tự động, nhưng code vẫn phải tuân thủ quy tắc memory model. Với pointer, cần xác định vùng cấp phát, alignment, độ dài, khởi tạo, lifetime và aliasing. Với FFI, còn có ABI, quy tắc ownership, thread và cách xử lý lỗi/panic. Một comment 'pointer hợp lệ' chưa đủ để người review biết ai bảo đảm và khi nào điều kiện hết đúng. Nếu caller phải đảm bảo điều kiện không thể kiểm tra, API cần phản ánh hợp đồng unsafe tương ứng."
        },
        {
          "title": "Hàm safe phải bảo vệ mọi safe caller",
          "text": "Wrapper có thể chứa unsafe bên trong nhưng bề mặt safe không được cho caller tạo UB bằng dữ liệu hợp lệ theo kiểu. Ví dụ nhận index usize rồi dùng get_unchecked phải kiểm tra index trước mọi đường đi. Nếu state có thể thay đổi giữa kiểm tra và dùng, invariant còn phụ thuộc khóa/lifetime. Không thêm unsafe chỉ để tránh một bounds check chưa được đo. Slice::get, copy_from_slice và từ-byte tường minh thường diễn đạt parser tốt hơn, giảm số điều kiện cần chứng minh bằng tay."
        },
        {
          "title": "Công cụ cho bằng chứng theo phạm vi thực thi",
          "text": "Miri có thể phát hiện nhiều loại UB trên các test được chạy, gồm alignment, invalid value và một số vấn đề aliasing/concurrency. Nó không chứng minh abstraction sound cho mọi caller và mọi interleaving; hỗ trợ FFI/OS cũng có giới hạn. Sanitizer và debugger trả lời những câu hỏi khác như memory error ở native run hoặc trạng thái tại crash. Chọn công cụ theo giả thuyết lỗi, ghi toolchain/options/input. Không coi không có báo lỗi là giấy chứng nhận an toàn và không tắt kiểm tra chỉ để pipeline xanh.",
          "code": "fn read_u32(bytes: &[u8], offset: usize) -> Option<u32> {\n    let end=offset.checked_add(4)?;\n    Some(u32::from_le_bytes(bytes.get(offset..end)?.try_into().ok()?))\n}"
        },
        {
          "title": "Thực hành loại bỏ một nhu cầu unsafe giả",
          "text": "Bài tập đọc u32 little-endian từ offset bằng get và try_into, không cast pointer. Test offset sát cuối, overflow offset và dữ liệu không aligned trong array. Trong Cargo, giữ hàm thuần này tách khỏi file/socket để Miri hoặc test trên endian khác có thể chạy dễ hơn. Khi review adapter object/FFI, lập bảng từng unsafe operation, invariant và test tạo biên tương ứng. Nếu thư viện phụ thuộc có unsafe, ghi phiên bản và phạm vi sử dụng; điều đó không làm dự án tự động sai nhưng là phần cần đánh giá khi input và mô hình tin cậy thay đổi. Mỗi invariant phải chỉ ra owner bảo đảm nó, thời điểm kiểm tra và đường lỗi có thể làm điều kiện không còn đúng."
        }
      ],
      "tip": "Soundness là nghĩa vụ cho mọi cách dùng hợp lệ, rộng hơn một tập thực thi cụ thể.",
      "exercise": {
        "title": "Review unsafe, FFI và công cụ kiểm tra bộ nhớ",
        "instructions": "Viết nghĩa vụ chứng minh cho abstraction trước khi dựa vào test hoặc Miri.",
        "requirements": [
          "Dùng bounds checked và from_le_bytes thay pointer cast.",
          "Offset tràn hoặc thiếu byte trả None."
        ]
      },
      "starterCode": "fn read_u32(bytes: &[u8], offset: usize) -> Option<u32> { todo!() }\nfn main() {\nassert_eq!(read_u32(&[9,0x78,0x56,0x34,0x12],1),Some(0x12345678));\nassert_eq!(read_u32(&[0,1,2],0),None);\nassert_eq!(read_u32(&[0;8],usize::MAX),None);\nprintln!(\"Không cần cast pointer để đọc u32\");\n}",
      "solutionCode": "fn read_u32(bytes: &[u8], offset: usize) -> Option<u32> {\n    let end=offset.checked_add(4)?;\n    Some(u32::from_le_bytes(bytes.get(offset..end)?.try_into().ok()?))\n}\nfn main() {\nassert_eq!(read_u32(&[9,0x78,0x56,0x34,0x12],1),Some(0x12345678));\nassert_eq!(read_u32(&[0,1,2],0),None);\nassert_eq!(read_u32(&[0;8],usize::MAX),None);\nprintln!(\"Không cần cast pointer để đọc u32\");\n}",
      "expectedOutput": "Không cần cast pointer để đọc u32",
      "hints": [
        "Dùng bounds checked và from_le_bytes thay pointer cast.",
        "Soundness là nghĩa vụ cho mọi cách dùng hợp lệ, rộng hơn một tập thực thi cụ thể."
      ],
      "quiz": {
        "question": "Miri chạy test không báo lỗi có chứng minh API unsafe sound cho mọi safe caller không?",
        "options": ["Có vì Miri thay compiler.", "Có nếu test chỉ một thread.", "Không; nó kiểm tra các thực thi đã chạy và có phạm vi hỗ trợ."],
        "correct": 2,
        "explanation": "Soundness là nghĩa vụ cho mọi cách dùng hợp lệ, rộng hơn một tập thực thi cụ thể."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://github.com/rust-lang/miri/blob/master/README.md"
      }
    },
    {
      "id": "security-crash-minimization",
      "moduleId": "track-security",
      "title": "Tái hiện, thu nhỏ và phân loại một lỗi parser",
      "description": "Biến crash fixture thành báo cáo nguyên nhân và test hồi quy có thể hành động.",
      "duration": 50,
      "objectives": [
        "Biến crash fixture thành báo cáo nguyên nhân và test hồi quy có thể hành động.",
        "Chỉ bỏ byte nếu predicate tái hiện vẫn đúng.",
        "Fixture đầu vào của bài có pattern đã định nghĩa; kết quả giữ pattern tối thiểu."
      ],
      "sections": [
        {
          "title": "Giữ đủ thông tin để lỗi không biến mất",
          "text": "Trước khi sửa, lưu input gốc, hash, command, commit, toolchain, target, feature và loại thất bại. Panic, timeout, OOM, lỗi parse dự kiến và kết quả sai là các nhóm khác nhau. Không gộp mọi Err thành crash và không đánh giá mức độ chỉ từ việc chương trình dừng. Với binary tự tạo, giữ source fixture để kiểm tra thay đổi compiler/linker ảnh hưởng output ra sao. Với dữ liệu cần bảo vệ, fixture hồi quy nên được tối giản hoặc tạo lại để không đưa nội dung riêng tư vào repository."
        },
        {
          "title": "Thu nhỏ phải giữ cùng hiện tượng",
          "text": "Xóa byte làm input nhỏ đi nhưng có thể chuyển lỗi sâu thành lỗi magic sớm. Một predicate thu nhỏ cần xác nhận cùng loại lỗi hoặc cùng invariant bị vi phạm, không chỉ chương trình trả nonzero. Có thể giảm trường, cắt phần không dùng hoặc thay payload bằng giá trị đơn giản theo cấu trúc. Ghi seed và ngân sách để quá trình không phụ thuộc ngẫu nhiên vô hạn. Bài tập dùng predicate học tập rõ ràng trên byte, minh họa cách chỉ nhận một bản rút gọn nếu vẫn giữ điều kiện cần tái hiện."
        },
        {
          "title": "Phân loại bằng bằng chứng, không bằng cảm giác",
          "text": "Một panic trong parser có thể gây gián đoạn dịch vụ nếu input đến được đường công khai, nhưng trong công cụ chỉ xử lý fixture nội bộ, phạm vi tác động khác. Để nói về khả năng khai thác hoặc mức độ, cần đường vào, quyền, điều kiện và ảnh hưởng đã xác minh. Trong khóa này, báo cáo tập trung lỗi robustness của code do mình sở hữu. Không thực thi binary không rõ nguồn để 'xem có độc không' và không gửi payload thử vào hạ tầng ngoài. Mọi phép tái hiện chạy trong harness của dự án với tài nguyên hữu hạn.",
          "code": "fn minimize(mut bytes: Vec<u8>) -> Vec<u8> {\n    fn reproduces(data: &[u8]) -> bool { data.windows(2).any(|w|w==[0xde,0xad]) }\n    assert!(reproduces(&bytes));\n    let mut i=0;\n    while i<bytes.len() {\n        let mut candidate=bytes.clone(); candidate.remove(i);\n        if reproduces(&candidate) { bytes=candidate; } else { i+=1; }\n    } bytes\n}"
        },
        {
          "title": "Tạo regression mô tả invariant",
          "text": "Sau khi hiểu lỗi, viết test nhỏ chỉ ra expected Result hoặc giới hạn đầu ra. Bản sửa phải làm test mới đạt và giữ fixture hợp lệ cũ. Kiểm tra một số biến thể lân cận để tránh sửa riêng một byte pattern. Nếu thay đổi đặc tả, cập nhật version và tài liệu thay vì âm thầm đổi nghĩa input đã được hỗ trợ. Báo cáo cuối nêu nguyên nhân, phạm vi, cách tái hiện, thay đổi và bằng chứng kiểm chứng, cùng những điều chưa biết. Đây là kỹ năng bàn giao giúp người khác sửa đúng lớp vấn đề, không chỉ một stack trace dài khó sử dụng."
        }
      ],
      "tip": "Nhỏ hơn nhưng đổi nguyên nhân không giúp chứng minh hoặc sửa lỗi gốc.",
      "exercise": {
        "title": "Tái hiện, thu nhỏ và phân loại một lỗi parser",
        "instructions": "Biến crash fixture thành báo cáo nguyên nhân và test hồi quy có thể hành động.",
        "requirements": [
          "Chỉ bỏ byte nếu predicate tái hiện vẫn đúng.",
          "Fixture đầu vào của bài có pattern đã định nghĩa; kết quả giữ pattern tối thiểu."
        ]
      },
      "starterCode": "fn minimize(bytes: Vec<u8>) -> Vec<u8> { todo!() }\nfn main() {\nassert_eq!(minimize(vec![1,2,0xde,0xad,3]),vec![0xde,0xad]);\nassert_eq!(minimize(vec![0xde,0xad]),vec![0xde,0xad]);\nprintln!(\"Fixture nhỏ: dead\");\n}",
      "solutionCode": "fn minimize(mut bytes: Vec<u8>) -> Vec<u8> {\n    fn reproduces(data: &[u8]) -> bool { data.windows(2).any(|w|w==[0xde,0xad]) }\n    assert!(reproduces(&bytes));\n    let mut i=0;\n    while i<bytes.len() {\n        let mut candidate=bytes.clone(); candidate.remove(i);\n        if reproduces(&candidate) { bytes=candidate; } else { i+=1; }\n    } bytes\n}\nfn main() {\nassert_eq!(minimize(vec![1,2,0xde,0xad,3]),vec![0xde,0xad]);\nassert_eq!(minimize(vec![0xde,0xad]),vec![0xde,0xad]);\nprintln!(\"Fixture nhỏ: dead\");\n}",
      "expectedOutput": "Fixture nhỏ: dead",
      "hints": [
        "Chỉ bỏ byte nếu predicate tái hiện vẫn đúng.",
        "Nhỏ hơn nhưng đổi nguyên nhân không giúp chứng minh hoặc sửa lỗi gốc."
      ],
      "quiz": {
        "question": "Input rút gọn chỉ còn lỗi magic, còn lỗi gốc là overflow sâu. Đã thu nhỏ đúng crash chưa?",
        "options": ["Đã đúng vì chương trình vẫn trả lỗi.", "Chưa; predicate phải giữ cùng hiện tượng/invariant đang điều tra.", "Đúng nếu file nhỏ nhất."],
        "correct": 1,
        "explanation": "Nhỏ hơn nhưng đổi nguyên nhân không giúp chứng minh hoặc sửa lỗi gốc."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://rust-fuzz.github.io/book/cargo-fuzz/guide.html"
      }
    },
    {
      "id": "security-dependency-review",
      "moduleId": "track-security",
      "title": "Dependency, lockfile và nguồn gốc bản build",
      "description": "Đánh giá dependency theo phạm vi sử dụng và giữ artifact có thể truy nguyên.",
      "duration": 50,
      "objectives": [
        "Đánh giá dependency theo phạm vi sử dụng và giữ artifact có thể truy nguyên.",
        "Hash label có đúng 64 ký tự hex.",
        "Không nhầm kiểm tra định dạng hash với xác thực nguồn hoặc chữ ký."
      ],
      "sections": [
        {
          "title": "Dependency mở rộng phần mềm cần được hiểu",
          "text": "Parser, decompressor, crypto hoặc FFI wrapper đều có hợp đồng đầu vào và giới hạn riêng. Không chỉ nhìn số lượt tải hoặc dùng Rust là kết luận phù hợp. Ghi lý do chọn crate, feature đang bật, phiên bản, nguồn và phần API thực sự dùng. Một default feature giải nén có thể tăng bề mặt xử lý dù công cụ chỉ cần metadata; tắt feature không cần khi API cho phép và kiểm thử lại. Không tự nâng major version giữa khóa học mà không xác minh code/test và thay đổi hợp đồng."
        },
        {
          "title": "Lockfile và advisory trả lời câu hỏi khác nhau",
          "text": "Cargo.lock giúp cố định tập dependency cụ thể cho build ứng dụng, nhưng không tự xác nhận chúng không có vấn đề đã biết. cargo audit đối chiếu lockfile với cơ sở advisory RustSec; kết quả phụ thuộc phiên bản database và phạm vi thông tin đã công bố. Không có advisory khớp không chứng minh mọi dependency an toàn. Khi có cảnh báo, xem crate có đi vào target/feature đang phát hành, đường API có được dùng và bản sửa tương thích ra sao. Ghi quyết định và thời điểm xem lại nếu cần ngoại lệ có lý do."
        },
        {
          "title": "Build của repository cũng có thể chạy mã",
          "text": "Cargo có build script và proc macro, nên việc tải một repository không tin cậy rồi cargo test không phải một thao tác chỉ đọc. Trong khóa này chỉ build source do dự án tạo. Khi đánh giá lockfile của nguồn khác, dùng chế độ đọc lockfile từ thư mục kiểm soát theo công cụ, tránh để công cụ tự tạo lockfile bằng cách chạy Cargo trong repository lạ. Không đưa token hoặc quyền máy phát hành vào môi trường phân tích. Tách artifact metadata review khỏi việc chạy binary của artifact; hai việc có mức quyền và bằng chứng khác nhau.",
          "code": "fn hash_label(hash: &str) -> bool {\n    hash.len()==64 && hash.bytes().all(|b|b.is_ascii_hexdigit())\n}"
        },
        {
          "title": "Thực hành manifest có thể so sánh",
          "text": "Bài tập kiểm tra manifest có commit, target và hash SHA-256 dạng hex đủ độ dài; đây chỉ là validation biểu diễn, không xác minh chữ ký hoặc nguồn phát hành. Trong Cargo audit project, tự tính hash từ byte đã đọc, gắn schema version và giữ các field giúp tái hiện. Khi so hai bản build, phân biệt thay đổi hash với thay đổi ABI/metadata: timestamp hoặc debug section có thể đổi hash dù behavior không đổi. Bàn giao lockfile, lệnh build, feature và report, rồi nêu rõ phép kiểm tra đã chạy. Không dùng một nhãn 'passed' duy nhất để gom nguồn gốc, advisory và tính đúng của parser."
        }
      ],
      "tip": "Advisory audit là một nguồn bằng chứng có phạm vi và thời điểm, không là chứng minh toàn bộ.",
      "exercise": {
        "title": "Dependency, lockfile và nguồn gốc bản build",
        "instructions": "Đánh giá dependency theo phạm vi sử dụng và giữ artifact có thể truy nguyên.",
        "requirements": [
          "Hash label có đúng 64 ký tự hex.",
          "Không nhầm kiểm tra định dạng hash với xác thực nguồn hoặc chữ ký."
        ]
      },
      "starterCode": "fn hash_label(hash: &str) -> bool { todo!() }\nfn main() {\nassert!(hash_label(&\"ab\".repeat(32)));\nassert!(!hash_label(&\"a\".repeat(63))); assert!(!hash_label(&\"g\".repeat(64)));\nprintln!(\"Nhãn hash hợp lệ không tự là chữ ký\");\n}",
      "solutionCode": "fn hash_label(hash: &str) -> bool {\n    hash.len()==64 && hash.bytes().all(|b|b.is_ascii_hexdigit())\n}\nfn main() {\nassert!(hash_label(&\"ab\".repeat(32)));\nassert!(!hash_label(&\"a\".repeat(63))); assert!(!hash_label(&\"g\".repeat(64)));\nprintln!(\"Nhãn hash hợp lệ không tự là chữ ký\");\n}",
      "expectedOutput": "Nhãn hash hợp lệ không tự là chữ ký",
      "hints": [
        "Hash label có đúng 64 ký tự hex.",
        "Advisory audit là một nguồn bằng chứng có phạm vi và thời điểm, không là chứng minh toàn bộ."
      ],
      "quiz": {
        "question": "cargo audit không có advisory khớp có chứng minh dependency không có lỗi bảo mật không?",
        "options": ["Không; chỉ không thấy advisory phù hợp trong dữ liệu và cấu hình đã kiểm tra.", "Có, database biết mọi lỗi.", "Có nếu Cargo.lock tồn tại."],
        "correct": 0,
        "explanation": "Advisory audit là một nguồn bằng chứng có phạm vi và thời điểm, không là chứng minh toàn bộ."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://github.com/rustsec/rustsec/blob/main/cargo-audit/README.md"
      }
    },
    {
      "id": "security-audit-project",
      "moduleId": "track-security",
      "title": "Dự án tổng hợp: kiểm tra artifact trước phát hành",
      "description": "So sánh manifest, symbol và metadata của hai bản build do nhóm sở hữu, kèm bằng chứng hồi quy.",
      "duration": 100,
      "objectives": [
        "So sánh manifest, symbol và metadata của hai bản build do nhóm sở hữu, kèm bằng chứng hồi quy.",
        "So tập symbol, không báo trùng khi baseline chứa tên lặp.",
        "Trả danh sách thiếu có thứ tự xác định."
      ],
      "sections": [
        {
          "title": "Tách inventory và quyết định phát hành",
          "text": "Dự án đầu chỉ quan sát một artifact; capstone nhận baseline và candidate của cùng sản phẩm, tạo diff rồi áp dụng policy đã định nghĩa. Baseline không được coi là đáng tin chỉ vì nó nằm trong file JSON: nhóm phát hành phải chọn và lưu nguồn gốc của nó. Policy mẫu yêu cầu format/architecture không đổi và những symbol công khai của baseline không bị mất. Hash khác được báo như thay đổi byte, không tự coi là lỗi hoặc mã độc. Quyết định phát hành cần thêm test nghiệp vụ và tương thích ngoài những field inventory đọc được."
        },
        {
          "title": "Định danh và báo cáo phải giữ dữ liệu gốc",
          "text": "Manifest gồm schema, SHA-256 của toàn byte, format, architecture, tập symbol đã định nghĩa và thống kê section. Symbol identity được biểu diễn bằng hex của raw name để tránh nhập nhằng do UTF-8 hoặc escape hiển thị. Nhãn người đọc là phần riêng. So tập symbol có thể cho thấy thay đổi ABI cần review, nhưng không chứng minh chữ ký hàm hoặc semantics tương thích; có symbol cùng tên mà kiểu đã đổi. Không gọi file sau strip là 'không có API' chỉ vì bảng symbol thường không còn dữ liệu."
        },
        {
          "title": "Fixture đối chiếu phải có thay đổi chủ đích",
          "text": "Cargo project tạo hai relocatable ELF bằng object writer: bản đầu có symbol public_value, bản sau đổi symbol hoặc dữ liệu theo mode. Tests xác nhận hash đổi, missing symbol bị phát hiện, same artifact không có diff và baseline schema lạ bị từ chối. Công cụ chỉ đọc artifact do dự án sở hữu, không thực thi chúng và không phân tích malware tùy ý. Trần byte/section/symbol vẫn áp dụng. Chỉ báo cáo hoàn chỉnh sau khi parse hết các phần bắt buộc; lỗi phải khiến audit không thành công, không tạo manifest rỗng cho qua policy.",
          "code": "fn missing_symbols(baseline: &[&str], candidate: &[&str]) -> Vec<String> {\n    let candidate: std::collections::BTreeSet<_>=candidate.iter().copied().collect();\n    let baseline: std::collections::BTreeSet<_>=baseline.iter().copied().collect();\n    baseline.difference(&candidate).map(|s|(*s).to_owned()).collect()\n}"
        },
        {
          "title": "Nghiệm thu và bàn giao kết luận có giới hạn",
          "text": "Chạy bộ test parser/TLV, inventory và audit; lưu fixture, manifest và report JSON cùng toolchain/lockfile. Bổ sung workflow build có stage tạo artifact, stage inspect và stage review thay đổi đã được người có thẩm quyền chấp nhận. Không tự cập nhật baseline mỗi khi candidate khác vì như vậy policy mất tác dụng. Capstone yêu cầu báo cáo một thay đổi hợp lệ, một lỗi phát hiện và một điểm metadata chưa đủ kết luận. Portfolio cần cho thấy nguồn gốc, khả năng tái hiện, regression và giới hạn công cụ. Đó là năng lực thực tế của kỹ sư phân tích, thay vì một nút 'quét an toàn' không có hợp đồng rõ."
        }
      ],
      "tip": "Tên symbol không mô tả đầy đủ type/ABI/semantics; diff metadata không thay kiểm thử sản phẩm.",
      "exercise": {
        "title": "Dự án tổng hợp: kiểm tra artifact trước phát hành",
        "instructions": "So sánh manifest, symbol và metadata của hai bản build do nhóm sở hữu, kèm bằng chứng hồi quy.",
        "requirements": [
          "So tập symbol, không báo trùng khi baseline chứa tên lặp.",
          "Trả danh sách thiếu có thứ tự xác định."
        ]
      },
      "starterCode": "fn missing_symbols(baseline: &[&str], candidate: &[&str]) -> Vec<String> { todo!() }\nfn main() {\nassert_eq!(missing_symbols(&[\"a\",\"b\"],&[\"b\",\"c\"]),vec![\"a\".to_string()]);\nassert!(missing_symbols(&[\"a\"],&[\"a\"]).is_empty());\nassert_eq!(missing_symbols(&[\"a\",\"a\"],&[]),vec![\"a\".to_string()]);\nprintln!(\"Symbol thiếu: {:?}\",missing_symbols(&[\"a\",\"b\"],&[\"b\",\"c\"]));\n}",
      "solutionCode": "fn missing_symbols(baseline: &[&str], candidate: &[&str]) -> Vec<String> {\n    let candidate: std::collections::BTreeSet<_>=candidate.iter().copied().collect();\n    let baseline: std::collections::BTreeSet<_>=baseline.iter().copied().collect();\n    baseline.difference(&candidate).map(|s|(*s).to_owned()).collect()\n}\nfn main() {\nassert_eq!(missing_symbols(&[\"a\",\"b\"],&[\"b\",\"c\"]),vec![\"a\".to_string()]);\nassert!(missing_symbols(&[\"a\"],&[\"a\"]).is_empty());\nassert_eq!(missing_symbols(&[\"a\",\"a\"],&[]),vec![\"a\".to_string()]);\nprintln!(\"Symbol thiếu: {:?}\",missing_symbols(&[\"a\",\"b\"],&[\"b\",\"c\"]));\n}",
      "expectedOutput": "Symbol thiếu: [\"a\"]",
      "hints": [
        "So tập symbol, không báo trùng khi baseline chứa tên lặp.",
        "Tên symbol không mô tả đầy đủ type/ABI/semantics; diff metadata không thay kiểm thử sản phẩm."
      ],
      "quiz": {
        "question": "Hash candidate khác baseline nhưng symbol giữ nguyên. Có thể kết luận behavior tương thích không?",
        "options": ["Có vì symbol tên giống nhau.", "Không; hash/metadata chỉ là bằng chứng một phần, cần test và review ngữ nghĩa.", "Có nếu artifact nhỏ."],
        "correct": 1,
        "explanation": "Tên symbol không mô tả đầy đủ type/ABI/semantics; diff metadata không thay kiểm thử sản phẩm."
      },
      "reference": {
        "label": "Nguồn biên soạn: tài liệu chính thức",
        "url": "https://docs.rs/crate/object/0.40.0"
      },
      "localLab": {
        "title": "Kiểm tra artifact theo baseline",
        "instructions": "Tạo baseline/candidate từ fixture do dự án sinh, so SHA-256 và metadata theo policy cụ thể. Baseline không tự cập nhật; policy_passed chỉ nói điều kiện metadata, không là phê duyệt phát hành hoặc kết luận an toàn.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"security_artifact_audit\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\nobject = { version = \"=0.40.0\", default-features = false, features = [\"read\", \"write\", \"std\"] }\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\nsha2 = \"0.10\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use object::{Object,ObjectSection,ObjectSymbol};\nuse serde::{Serialize,Deserialize};\nuse sha2::{Digest,Sha256};\nuse std::{collections::BTreeSet,fs::File,io::Read,path::Path};\npub mod fixture;\nconst MAX_BYTES:usize=1024*1024;\n#[derive(Debug,PartialEq)] pub enum Error { Io,Size,Format,Limit,Metadata,Manifest }\n#[derive(Debug,Clone,PartialEq,Serialize,Deserialize)]\n#[serde(deny_unknown_fields)]\npub struct Manifest { pub schema:u32,pub sha256:String,pub format:String,pub architecture:String,pub section_count:usize,pub defined_global_symbols:BTreeSet<String> }\n#[derive(Debug,Serialize)]\npub struct Audit { pub schema:u32,pub baseline_sha256:String,pub candidate_sha256:String,pub bytes_changed:bool,pub policy_passed:bool,pub violations:Vec<String>,pub added_symbols:Vec<String>,pub removed_symbols:Vec<String> }\nfn hex(bytes:&[u8])->String { bytes.iter().map(|b|format!(\"{b:02x}\")).collect() }\npub fn read_owned(path:impl AsRef<Path>)->Result<Vec<u8>,Error> {\n    let file=File::open(path).map_err(|_|Error::Io)?; let mut bytes=Vec::new();\n    file.take(MAX_BYTES as u64+1).read_to_end(&mut bytes).map_err(|_|Error::Io)?;\n    if bytes.len()>MAX_BYTES { Err(Error::Size) } else { Ok(bytes) }\n}\npub fn inspect_owned(bytes:&[u8])->Result<Manifest,Error> {\n    if bytes.len()>MAX_BYTES { return Err(Error::Size); }\n    let file=object::File::parse(bytes).map_err(|_|Error::Format)?;\n    let mut section_count=0;\n    for section in file.sections() {\n        section_count+=1; if section_count>256 { return Err(Error::Limit); }\n        if let Some((offset,size))=section.file_range() { if offset.checked_add(size).is_none_or(|end|end>bytes.len() as u64) { return Err(Error::Metadata); } }\n    }\n    let mut defined_global_symbols=BTreeSet::new(); let mut symbol_count=0;\n    for symbol in file.symbols() {\n        symbol_count+=1; if symbol_count>4096 { return Err(Error::Limit); }\n        let name=symbol.name_bytes().map_err(|_|Error::Metadata)?; if name.len()>256 { return Err(Error::Limit); }\n        if symbol.is_definition() && symbol.is_global() && !name.is_empty() { defined_global_symbols.insert(hex(name)); }\n    }\n    Ok(Manifest {schema:1,sha256:hex(&Sha256::digest(bytes)),format:format!(\"{:?}\",file.format()),architecture:format!(\"{:?}\",file.architecture()),section_count,defined_global_symbols})\n}\nfn validate(m:&Manifest)->Result<(),Error> {\n    if m.schema!=1 || m.sha256.len()!=64 || !m.sha256.bytes().all(|b|b.is_ascii_hexdigit()) ||\n        m.format.is_empty() || m.format.len()>32 || m.architecture.is_empty() || m.architecture.len()>32 ||\n        m.section_count>256 || m.defined_global_symbols.len()>4096 ||\n        m.defined_global_symbols.iter().any(|s|s.is_empty() || s.len()>512 || s.len()%2!=0 || !s.bytes().all(|b|b.is_ascii_hexdigit())) { return Err(Error::Manifest); }\n    Ok(())\n}\npub fn decode_manifest(bytes:&[u8])->Result<Manifest,Error> {\n    if bytes.len()>MAX_BYTES { return Err(Error::Size); }\n    let m:Manifest=serde_json::from_slice(bytes).map_err(|_|Error::Manifest)?; validate(&m)?; Ok(m)\n}\npub fn compare(baseline:&Manifest,candidate:&Manifest)->Result<Audit,Error> {\n    validate(baseline)?; validate(candidate)?;\n    let added_symbols:Vec<_>=candidate.defined_global_symbols.difference(&baseline.defined_global_symbols).cloned().collect();\n    let removed_symbols:Vec<_>=baseline.defined_global_symbols.difference(&candidate.defined_global_symbols).cloned().collect();\n    let mut violations=Vec::new();\n    if baseline.format!=candidate.format { violations.push(\"format-changed\".into()); }\n    if baseline.architecture!=candidate.architecture { violations.push(\"architecture-changed\".into()); }\n    if !removed_symbols.is_empty() { violations.push(\"required-symbol-missing\".into()); }\n    Ok(Audit {schema:1,baseline_sha256:baseline.sha256.clone(),candidate_sha256:candidate.sha256.clone(),bytes_changed:baseline.sha256!=candidate.sha256,policy_passed:violations.is_empty(),violations,added_symbols,removed_symbols})\n}\n#[cfg(test)] mod tests {\n    use super::*;\n    fn baseline()->Manifest { inspect_owned(&fixture::artifact(b\"public_value\",&[1,2,3,4])).unwrap() }\n    #[test] fn identical_and_data_only_change() {\n        let a=baseline(); let same=compare(&a,&a).unwrap(); assert!(same.policy_passed); assert!(!same.bytes_changed);\n        let changed=inspect_owned(&fixture::artifact(b\"public_value\",&[9,2,3,4])).unwrap();\n        let diff=compare(&a,&changed).unwrap(); assert!(diff.bytes_changed); assert!(diff.policy_passed);\n        assert!(diff.removed_symbols.is_empty()); assert!(!a.defined_global_symbols.is_empty());\n    }\n    #[test] fn removed_symbol_and_wrong_architecture() {\n        let a=baseline(); let b=inspect_owned(&fixture::artifact(b\"other_value\",&[1,2,3,4])).unwrap();\n        let diff=compare(&a,&b).unwrap(); assert!(!diff.policy_passed); assert_eq!(diff.removed_symbols.len(),1);\n        let mut b=a.clone(); b.architecture=\"Aarch64\".into(); assert!(!compare(&a,&b).unwrap().policy_passed);\n    }\n    #[test] fn manifest_schema_hash_and_roundtrip() {\n        let a=baseline(); assert_eq!(decode_manifest(&serde_json::to_vec(&a).unwrap()),Ok(a.clone()));\n        let mut bad=a.clone(); bad.schema=2; assert_eq!(decode_manifest(&serde_json::to_vec(&bad).unwrap()),Err(Error::Manifest));\n        let mut bad=a; bad.sha256=\"not-a-hash\".into(); assert_eq!(compare(&bad,&bad).err(),Some(Error::Manifest));\n    }\n    #[test] fn size_and_format() {\n        assert!(matches!(inspect_owned(&vec![0;MAX_BYTES+1]),Err(Error::Size)));\n        assert!(matches!(inspect_owned(b\"not an object\"),Err(Error::Format)));\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use security_artifact_audit::{fixture,inspect_owned,read_owned,decode_manifest,compare};\nuse std::io::Write;\nfn write_new(path:&std::ffi::OsStr,bytes:&[u8])->Result<(),String> {\n    let mut file=std::fs::OpenOptions::new().write(true).create_new(true).open(path).map_err(|e|e.to_string())?;\n    file.write_all(bytes).map_err(|e|e.to_string())\n}\nfn main()->Result<(),String> {\n    let args:Vec<_>=std::env::args_os().collect();\n    if args.len()==4 && args[1]==\"fixture\" {\n        let (symbol,data):(&[u8],&[u8])=if args[3]==\"keep\" {(b\"public_value\",&[1,2,3,4])} else if args[3]==\"changed\" {(b\"public_value\",&[9,2,3,4])} else if args[3]==\"removed\" {(b\"other_value\",&[1,2,3,4])} else {return Err(\"mode: keep|changed|removed\".into());};\n        write_new(&args[2],&fixture::artifact(symbol,data))?; return Ok(());\n    }\n    if args.len()==4 && args[1]==\"baseline\" {\n        let bytes=read_owned(&args[2]).map_err(|e|format!(\"{e:?}\"))?;\n        let m=inspect_owned(&bytes).map_err(|e|format!(\"{e:?}\"))?;\n        return write_new(&args[3],&serde_json::to_vec_pretty(&m).map_err(|e|e.to_string())?);\n    }\n    if args.len()==4 && args[1]==\"compare\" {\n        let baseline=decode_manifest(&read_owned(&args[2]).map_err(|e|format!(\"{e:?}\"))?).map_err(|e|format!(\"{e:?}\"))?;\n        let candidate=inspect_owned(&read_owned(&args[3]).map_err(|e|format!(\"{e:?}\"))?).map_err(|e|format!(\"{e:?}\"))?;\n        let audit=compare(&baseline,&candidate).map_err(|e|format!(\"{e:?}\"))?;\n        println!(\"{}\",serde_json::to_string_pretty(&audit).map_err(|e|e.to_string())?);\n        if !audit.policy_passed { std::process::exit(2); } return Ok(());\n    }\n    Err(\"Dùng: fixture FILE_MOI keep|changed|removed; baseline ARTIFACT MANIFEST_MOI; compare MANIFEST CANDIDATE\".into())\n}\n"
          },
          {
            "path": "src/fixture.rs",
            "content": "use object::{Architecture,BinaryFormat,Endianness,SectionKind,SymbolFlags,SymbolKind,SymbolScope,write::{Object,Symbol,SymbolSection}};\npub fn artifact(symbol_name:&[u8],data:&[u8])->Vec<u8> {\n    let mut object=Object::new(BinaryFormat::Elf,Architecture::X86_64,Endianness::Little);\n    let section=object.add_section(Vec::new(),b\".data\".to_vec(),SectionKind::Data);\n    object.append_section_data(section,data,1);\n    object.add_symbol(Symbol { name:symbol_name.to_vec(),value:0,size:data.len() as u64,kind:SymbolKind::Data,scope:SymbolScope::Linkage,weak:false,section:SymbolSection::Section(section),flags:SymbolFlags::None });\n    object.write().expect(\"Fixture builder with known ELF fields\")\n}\n"
          },
          {
            "path": "README.md",
            "content": "# Artifact audit có baseline\n\ninspect_owned tạo manifest schema1, SHA-256 toàn byte, format, architecture, section_count và tập defined global symbols. Symbol identity là hex raw name, tránh nhập nhằng hiển thị Unicode/escape. Trần 1 MiB, 256 section, 4096 symbol, tên 256 byte; không giải nén hoặc thực thi. object được dùng cho artifact sở hữu, không cho upload tùy ý/malware analysis.\n\nPolicy mẫu: format và architecture giữ nguyên, mọi global symbol đã định nghĩa của baseline vẫn có trong candidate. Hash khác báo bytes_changed, không tự fail; missing symbol/format/architecture khác làm policy_passed=false và CLI exit2. Cùng symbol không chứng minh type/ABI/semantics tương thích. Hash không xác thực nhà phát hành nếu baseline chưa có nguồn gốc đáng tin.\n\nLệnh demo tạo owned-v1.o, baseline.json và owned-v2.o ở đường dẫn mới. Mode keep giữ fixture, changed đổi dữ liệu vẫn giữ symbol, removed đổi symbol để test fail. compare chỉ đọc baseline/candidate và in JSON. Không cập nhật baseline tự động khi diff; reviewer cần quyết định dựa trên yêu cầu phát hành cùng test nghiệp vụ.\n\nCapstone: ghi commit/toolchain/features/lockfile trong manifest bàn giao, thêm fixture các format đang hỗ trợ, tích hợp pipeline build→inspect→review. Báo cáo một thay đổi hợp lệ, một vi phạm policy và một điều metadata không đủ kết luận. Thêm unit regression từ parser/TLV và kiểm tra output escape. Nếu nhận artifact không tin cậy, cần kiến trúc worker cô lập/quota khác trước khi đổi phạm vi công cụ.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run -- fixture owned-v1.o keep",
          "cargo run -- baseline owned-v1.o baseline.json",
          "cargo run -- fixture owned-v2.o changed",
          "cargo run -- compare baseline.json owned-v2.o"
        ],
        "checks": [
          "Same artifact không diff; đổi data chỉ đổi hash theo policy mẫu.",
          "Mất symbol hoặc đổi architecture làm policy fail.",
          "Manifest schema/hash sai bị từ chối, không tự tạo baseline mới.",
          "Output có giới hạn và không thực thi artifact."
        ]
      },
      "simulation": {
        "title": "Baseline và candidate",
        "description": "Policy metadata phân biệt thay đổi byte và thiếu symbol.",
        "kind": "pipeline",
        "nodes": [
          {
            "id": "baseline",
            "label": "Baseline",
            "detail": "Manifest được nhóm chọn"
          },
          {
            "id": "candidate",
            "label": "Candidate",
            "detail": "Artifact mới do nhóm build"
          },
          {
            "id": "diff",
            "label": "Diff",
            "detail": "Hash và tập symbol"
          },
          {
            "id": "review",
            "label": "Review",
            "detail": "Quyết định theo phạm vi"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Đổi dữ liệu hợp lệ theo policy",
            "steps": [
              {
                "title": "Nguồn gốc",
                "description": "Baseline có public_value.",
                "activeNodeIds": [
                  "baseline"
                ],
                "values": [
                  {
                    "label": "symbol",
                    "value": "public_value"
                  }
                ]
              },
              {
                "title": "Candidate",
                "description": "Đổi data, giữ format/architecture/symbol.",
                "activeNodeIds": [
                  "candidate"
                ],
                "values": [
                  {
                    "label": "hash",
                    "value": "mới"
                  }
                ]
              },
              {
                "title": "So sánh",
                "description": "Không mất symbol, bytes_changed=true.",
                "activeNodeIds": [
                  "diff"
                ],
                "values": [
                  {
                    "label": "violations",
                    "value": "0"
                  }
                ]
              },
              {
                "title": "Kết quả",
                "description": "Policy metadata đạt; test sản phẩm vẫn cần.",
                "activeNodeIds": [
                  "review"
                ],
                "values": [
                  {
                    "label": "policy_passed",
                    "value": "true"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "Mất symbol cần giữ",
            "steps": [
              {
                "title": "Baseline",
                "description": "public_value là phần cần giữ.",
                "activeNodeIds": [
                  "baseline"
                ],
                "values": [
                  {
                    "label": "required",
                    "value": "public_value"
                  }
                ]
              },
              {
                "title": "Candidate",
                "description": "Symbol đổi thành other_value.",
                "activeNodeIds": [
                  "candidate"
                ],
                "values": [
                  {
                    "label": "symbol",
                    "value": "other_value"
                  }
                ]
              },
              {
                "title": "Diff",
                "description": "Phát hiện public_value bị thiếu.",
                "activeNodeIds": [
                  "diff"
                ],
                "values": [
                  {
                    "label": "removed",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Dừng policy",
                "description": "Không tự thay baseline để làm xanh.",
                "activeNodeIds": [
                  "review"
                ],
                "values": [
                  {
                    "label": "policy_passed",
                    "value": "false"
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  ],
  "projects": [
    {
      "id": "security-project-inventory",
      "title": "Inventory artifact có nguồn gốc",
      "description": "Tạo fixture bằng object writer, đọc metadata và xuất report có giới hạn cùng phạm vi kết luận.",
      "level": "guided",
      "estimatedHours": 10,
      "labLessonId": "security-inventory-project",
      "requirements": [
        "Chỉ xử lý artifact/fixture do dự án sở hữu, không thực thi.",
        "Giới hạn input thực đọc, section, symbol và tên.",
        "Phân biệt raw range/virtual size, format/kind.",
        "Escape output và giữ lỗi parse riêng, không trả report rỗng giả."
      ],
      "milestones": [
        {
          "title": "Fixture",
          "tasks": [
            "Tạo ELF có section/symbol đã biết.",
            "Ghi source, phiên bản và hash."
          ],
          "acceptance": "Có thể tái tạo byte và giải thích các trường mong đợi."
        },
        {
          "title": "Inspector",
          "tasks": [
            "Dùng object API read, không loader.",
            "Áp dụng byte/entry/name budgets và checked range."
          ],
          "acceptance": "Fixture hợp lệ đúng, input lỗi không panic hoặc báo đầy đủ giả."
        },
        {
          "title": "Report",
          "tasks": [
            "Schema JSON và nhãn byte an toàn.",
            "Bảng giới hạn format và trusted input."
          ],
          "acceptance": "Không kết luận an toàn hoặc tương thích chỉ từ inventory."
        }
      ],
      "testCases": [
        {
          "name": "Fixture chuẩn",
          "setup": "ELF writer có .data/public_value",
          "expected": "Format/kind/architecture và section đúng."
        },
        {
          "name": "Quá trần",
          "setup": "Input 1 MiB+1",
          "expected": "TooLarge trước parser."
        },
        {
          "name": "Input ngắn",
          "setup": "Rỗng hoặc magic dở",
          "expected": "Format error."
        },
        {
          "name": "Tên điều khiển",
          "setup": "Byte ESC/backslash/non-UTF8",
          "expected": "Hiển thị escape, không điều khiển terminal."
        }
      ],
      "rubric": [
        {
          "id": "security-inventory-rubric-1",
          "title": "Phạm vi và quyền",
          "criteria": [
            "Không chạy/nạp artifact.",
            "Không biến object trusted-input thành upload service."
          ],
          "critical": true
        },
        {
          "id": "security-inventory-rubric-2",
          "title": "Parser budget",
          "criteria": [
            "Byte/section/symbol/name có trần.",
            "Range checked trước chấp nhận."
          ],
          "critical": true
        },
        {
          "id": "security-inventory-rubric-3",
          "title": "Báo cáo",
          "criteria": [
            "Metadata giữ đúng raw/virtual và format/kind.",
            "Lỗi không được đổi thành kết quả trống."
          ],
          "critical": false
        },
        {
          "id": "security-inventory-rubric-4",
          "title": "Bằng chứng",
          "criteria": [
            "Fixture/source/hash tái hiện được.",
            "Output/schema và giới hạn có test."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Cargo inspector và fixture generator.",
        "Đặc tả schema report, error và budget.",
        "Fixture cùng test metadata/output.",
        "Báo cáo phạm vi trusted input và phần chưa hỗ trợ."
      ]
    },
    {
      "id": "security-project-parser",
      "title": "LearnRecord parser có corpus và fuzz target",
      "description": "Xây parser TLV đầy đủ theo đặc tả nhỏ, oracle roundtrip và quy trình biến lỗi thành regression.",
      "level": "independent",
      "estimatedHours": 18,
      "labLessonId": "security-parser-project",
      "requirements": [
        "Bounds checked, version/tag/duplicate/trailing rõ ràng.",
        "Input/field/title/count có trần cụ thể.",
        "Encoder canonical và oracle so model.",
        "Fuzz chỉ harness do dự án sở hữu, có ngân sách và báo kết quả thực."
      ],
      "milestones": [
        {
          "title": "Đặc tả",
          "tasks": [
            "Viết bảng byte và error.",
            "Tạo encoder/decoder không unsafe."
          ],
          "acceptance": "Mọi điều kiện hợp lệ/không hợp lệ có fixture."
        },
        {
          "title": "Kiểm chứng",
          "tasks": [
            "Cắt mọi prefix, mutation từng byte.",
            "Roundtrip mọi input được parser chấp nhận."
          ],
          "acceptance": "Không panic; Message luôn trong miền."
        },
        {
          "title": "Fuzz và hồi quy",
          "tasks": [
            "Sinh corpus có cấu trúc.",
            "Chạy fuzz theo thời gian/length/RSS, lưu artifact và minimization cùng lỗi."
          ],
          "acceptance": "Báo rõ công cụ đã chạy, coverage và test hồi quy được thêm."
        }
      ],
      "testCases": [
        {
          "name": "Cắt message",
          "setup": "Mọi prefix ngắn hơn bản hợp lệ",
          "expected": "Err, không dùng payload thiếu."
        },
        {
          "name": "Duplicate/tag lạ",
          "setup": "Hai title hoặc tag 9",
          "expected": "Duplicate/Tag theo hợp đồng."
        },
        {
          "name": "Giới hạn",
          "setup": "Input >4096, title >64, count >10000",
          "expected": "Lỗi tương ứng trước model output."
        },
        {
          "name": "Roundtrip",
          "setup": "Mọi input parse được trong corpus/mutation",
          "expected": "Encode-parse giữ Message."
        }
      ],
      "rubric": [
        {
          "id": "security-parser-rubric-1",
          "title": "Đúng đặc tả",
          "criteria": [
            "Tag bắt buộc duy nhất, không byte thừa.",
            "UTF-8/length/count checked."
          ],
          "critical": true
        },
        {
          "id": "security-parser-rubric-2",
          "title": "Giới hạn và failure",
          "criteria": [
            "Không panic/unsafe cast trong parser.",
            "Lỗi không công bố model một phần."
          ],
          "critical": true
        },
        {
          "id": "security-parser-rubric-3",
          "title": "Chất lượng oracle",
          "criteria": [
            "So semantics/canonical, không chỉ không crash.",
            "Corpus chạm cấu trúc sâu và giữ regression."
          ],
          "critical": false
        },
        {
          "id": "security-parser-rubric-4",
          "title": "Báo cáo",
          "criteria": [
            "Ngân sách/toolchain/seed/input hash đầy đủ.",
            "Không khẳng định fuzz PASS nếu chưa chạy."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Crate parser/encoder và đặc tả v1.",
        "Unit/mutation tests cùng fixture.",
        "Fuzz target, corpus generator và log khi đã chạy.",
        "Báo cáo một failure/recovery hoặc nhánh còn thiếu coverage."
      ]
    },
    {
      "id": "security-project-audit",
      "title": "Kiểm tra artifact trước phát hành",
      "description": "So baseline/candidate do nhóm sở hữu, phát hiện thay đổi policy và kết hợp bằng chứng parser/dependency/build.",
      "level": "capstone",
      "estimatedHours": 28,
      "labLessonId": "security-audit-project",
      "requirements": [
        "Manifest schema và SHA-256 từ byte thực.",
        "Symbol identity raw hex, format/architecture không mất nghĩa.",
        "Policy baseline rõ; không tự chấp nhận baseline mới.",
        "Báo metadata limits, không gắn nhãn artifact an toàn hoặc full ABI compatibility."
      ],
      "milestones": [
        {
          "title": "Manifest",
          "tasks": [
            "Tạo fixture keep/changed/removed.",
            "Validate schema/hash/symbol budget."
          ],
          "acceptance": "Baseline/candidate có nguồn gốc và parse lỗi không cho qua."
        },
        {
          "title": "Diff và policy",
          "tasks": [
            "So hash, format, architecture, symbol sets.",
            "Giữ added/removed theo thứ tự xác định."
          ],
          "acceptance": "Data-only change được báo; missing symbol fail policy."
        },
        {
          "title": "Bàn giao",
          "tasks": [
            "Ghép parser regression và dependency review.",
            "Ghi manifest build, giới hạn và review decision."
          ],
          "acceptance": "Có một thay đổi hợp lệ, một vi phạm và một kết luận metadata chưa đủ chứng minh."
        }
      ],
      "testCases": [
        {
          "name": "Không đổi",
          "setup": "Cùng artifact",
          "expected": "Không bytes_changed và policy đạt."
        },
        {
          "name": "Đổi dữ liệu",
          "setup": "Cùng symbol, byte khác",
          "expected": "Hash đổi, policy metadata mẫu vẫn đạt."
        },
        {
          "name": "Mất symbol",
          "setup": "public_value đổi thành other_value",
          "expected": "Missing symbol, policy fail."
        },
        {
          "name": "Baseline hỏng",
          "setup": "Schema tương lai/hash sai",
          "expected": "Từ chối, không tự tạo baseline mới."
        }
      ],
      "rubric": [
        {
          "id": "security-audit-rubric-1",
          "title": "Nguồn gốc",
          "criteria": [
            "Artifact chỉ đọc, không thực thi.",
            "Baseline được chọn có chủ đích và lưu nguồn gốc."
          ],
          "critical": true
        },
        {
          "id": "security-audit-rubric-2",
          "title": "Kết luận đúng phạm vi",
          "criteria": [
            "Hash/metadata không bị gọi là chứng nhận an toàn.",
            "Lỗi parser/schema không bị cho qua."
          ],
          "critical": true
        },
        {
          "id": "security-audit-rubric-3",
          "title": "Policy và regression",
          "criteria": [
            "Diff deterministic, identity không nhập nhằng.",
            "Có fixture vi phạm và test bản sửa."
          ],
          "critical": false
        },
        {
          "id": "security-audit-rubric-4",
          "title": "Phát hành",
          "criteria": [
            "Lockfile/toolchain/feature/hash có thể truy nguyên.",
            "Review không tự cập nhật baseline để làm xanh."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Cargo audit CLI, schema và policy.",
        "Baseline/candidate fixture và report JSON.",
        "Bộ regression cùng nguồn build/dependency.",
        "Báo cáo quyết định phát hành và giới hạn còn lại."
      ]
    }
  ],
  "assessment": {
    "title": "Đánh giá năng lực phân tích và kiểm chứng parser",
    "instructions": "Trả lời tình huống và tự nghiệm thu dự án bằng fixture có nguồn gốc, test âm, corpus và report. Ghi rõ fuzz/native tool nào thực sự chạy; không suy diễn inventory thành chứng nhận an toàn cho binary.",
    "passPercent": 80,
    "questions": [
      {
        "id": "security-exam-01",
        "question": "Tool dùng object đọc artifact do nhóm build. Muốn mở upload công khai, chỉ thêm size limit đã đủ chưa?",
        "options": ["Đủ vì Rust an toàn bộ nhớ.", "Đủ nếu không chạy binary.", "Chưa; phải đánh giá parser scope, DoS, worker isolation/quota và quyền."],
        "correct": 2,
        "explanation": "Không thực thi và giới hạn byte chưa xử lý mọi chi phí parser; phạm vi trusted input phải được giữ hoặc thiết kế lại.",
        "lessonIds": [
          "security-threat-model"
        ]
      },
      {
        "id": "security-exam-02",
        "question": "take gặp bounds error. Theo hợp đồng bài, offset và budget phải ra sao?",
        "options": ["Giữ nguyên cả hai đến khi lần đọc thành công.", "Offset tăng, budget giảm tùy ý.", "Reset offset về 0."],
        "correct": 0,
        "explanation": "State mutation chỉ commit sau validation giúp lỗi có vị trí và hành vi xác định.",
        "lessonIds": [
          "security-budgeted-cursor"
        ]
      },
      {
        "id": "security-exam-03",
        "question": "Một RVA nằm trong virtual zero-fill ngoài raw section. Có được đọc file[rva] không?",
        "options": ["Có nếu file đủ lớn.", "Có vì RVA luôn là offset.", "Không; cần ánh xạ format và xác định raw byte có tồn tại."],
        "correct": 2,
        "explanation": "Địa chỉ sau loader và byte trên disk không tương đương.",
        "lessonIds": [
          "security-format-semantics"
        ]
      },
      {
        "id": "security-exam-04",
        "question": "Tên symbol chứa ESC. Report terminal nên làm gì?",
        "options": ["In raw để giữ nguyên.", "Escape/biểu diễn byte, giữ raw identity riêng.", "Bỏ toàn bộ lỗi parser."],
        "correct": 1,
        "explanation": "Renderer cũng là trust boundary; nhãn hiển thị không được điều khiển terminal.",
        "lessonIds": [
          "security-inventory-project"
        ]
      },
      {
        "id": "security-exam-05",
        "question": "Path không có '..' nhưng thư mục con là symlink. Helper string đã bảo đảm containment chưa?",
        "options": ["Chưa; cần adapter mở file/quyền/symlink và race policy.", "Đã đủ với PathBuf.", "Đã đủ trên Unix."],
        "correct": 0,
        "explanation": "Kiểm tra chuỗi không tự bảo vệ thao tác filesystem thực.",
        "lessonIds": [
          "security-archive-paths"
        ]
      },
      {
        "id": "security-exam-06",
        "question": "count×stride tràn thành số nhỏ trước bounds check. Cần sửa thế nào?",
        "options": ["Chỉ dùng saturating và tiếp tục.", "checked_mul rồi checked_add cùng trần record trước truy cập.", "Tăng buffer."],
        "correct": 1,
        "explanation": "Phải phát hiện phép toán không hợp lệ trước khi range nhỏ giả được chấp nhận.",
        "lessonIds": [
          "security-integer-invariants"
        ]
      },
      {
        "id": "security-exam-07",
        "question": "Fuzzer chỉ chạm lỗi magic sớm. Cách tăng cơ hội đi sâu?",
        "options": ["Bỏ magic validation.", "Chạy không giới hạn RAM.", "Thêm seed hợp lệ/cấu trúc và oracle theo hợp đồng."],
        "correct": 2,
        "explanation": "Seed và structure-aware input giúp chạm nhánh sâu mà không bỏ điều kiện đúng.",
        "lessonIds": [
          "security-corpus-design"
        ]
      },
      {
        "id": "security-exam-08",
        "question": "TLV có title hai lần nhưng đặc tả yêu cầu duy nhất. Kết quả đúng?",
        "options": ["Luôn nối hai title.", "Luôn dùng title sau.", "Duplicate, không overwrite âm thầm."],
        "correct": 2,
        "explanation": "Duplicate handling là một phần đặc tả cần nhất quán và có test.",
        "lessonIds": [
          "security-parser-project"
        ]
      },
      {
        "id": "security-exam-09",
        "question": "Miri không thấy UB trong tests. Có thể bỏ invariant comment/unsafe review không?",
        "options": ["Không; test thực thi không chứng minh soundness toàn bộ API.", "Có nếu build release.", "Có vì công cụ chứng minh mọi input."],
        "correct": 0,
        "explanation": "Cần invariant cho mọi safe caller và hiểu giới hạn công cụ.",
        "lessonIds": [
          "security-unsafe-review"
        ]
      },
      {
        "id": "security-exam-10",
        "question": "Input rút gọn còn lỗi header, lỗi gốc là timeout trong vòng tham chiếu. Minimization đã đạt chưa?",
        "options": ["Đạt vì cùng exit nonzero.", "Chưa; phải giữ cùng hiện tượng/invariant để điều tra.", "Đạt nếu nhỏ hơn 1 KiB."],
        "correct": 1,
        "explanation": "Đổi loại lỗi làm fixture không còn chứng minh nguyên nhân gốc.",
        "lessonIds": [
          "security-crash-minimization"
        ]
      },
      {
        "id": "security-exam-11",
        "question": "Cargo.lock tồn tại và audit không có advisory. Kết luận đúng?",
        "options": ["Mọi dependency chắc chắn không có lỗi.", "Chỉ đã kiểm tra tập dependency với dữ liệu advisory tại thời điểm đó.", "Có thể chạy mọi repository lạ để kiểm tra thêm."],
        "correct": 1,
        "explanation": "Lockfile/advisory có phạm vi; build script/proc macro còn là code chạy khi dùng Cargo.",
        "lessonIds": [
          "security-dependency-review"
        ]
      },
      {
        "id": "security-exam-12",
        "question": "Baseline/candidate giữ tên symbol nhưng hash khác. Có thể kết luận ABI và behavior giữ nguyên không?",
        "options": ["Không; cần test/type/ABI/semantics ngoài metadata này.", "Có, nếu format không đổi.", "Có, tên symbol đủ."],
        "correct": 0,
        "explanation": "Metadata diff là nguồn bằng chứng, không thay toàn bộ kiểm chứng tương thích.",
        "lessonIds": [
          "security-audit-project"
        ]
      }
    ],
    "skills": [
      {
        "id": "security-skill-1",
        "title": "Ranh giới và ngân sách phân tích",
        "description": "Phân biệt parser, worker isolation và kết luận phân tích. Giữ bounds, cursor và work budget rõ ràng.",
        "lessonIds": [
          "security-input-boundaries",
          "security-threat-model",
          "security-budgeted-cursor"
        ],
        "projectIds": [
          "security-project-inventory"
        ],
        "required": true
      },
      {
        "id": "security-skill-2",
        "title": "Định dạng và inventory artifact",
        "description": "Phân biệt RVA/VA/file offset và raw/virtual. Tạo fixture và report có giới hạn bằng object.",
        "lessonIds": [
          "security-object-metadata",
          "security-format-semantics",
          "security-inventory-project"
        ],
        "projectIds": [
          "security-project-inventory"
        ],
        "required": true
      },
      {
        "id": "security-skill-3",
        "title": "Số học, đường dẫn và độ phức tạp",
        "description": "Kiểm tra length/count/stride trước truy cập. Phân biệt tên hợp lệ với filesystem containment.",
        "lessonIds": [
          "security-endian-budgets",
          "security-archive-paths",
          "security-integer-invariants"
        ],
        "projectIds": [
          "security-project-parser"
        ],
        "required": true
      },
      {
        "id": "security-skill-4",
        "title": "Property, corpus và parser có hồi quy",
        "description": "Thiết kế roundtrip và seed có cấu trúc. Giữ regression và báo đúng phạm vi fuzz đã chạy.",
        "lessonIds": [
          "security-property-fuzzing",
          "security-corpus-design",
          "security-parser-project"
        ],
        "projectIds": [
          "security-project-parser"
        ],
        "required": true
      },
      {
        "id": "security-skill-5",
        "title": "Unsafe và điều tra lỗi",
        "description": "Viết invariant ownership/alignment/lifetime. Thu nhỏ cùng lỗi, không chỉ một input bị reject.",
        "lessonIds": [
          "security-debugger-invariants",
          "security-unsafe-review",
          "security-crash-minimization"
        ],
        "projectIds": [
          "security-project-parser"
        ],
        "required": true
      },
      {
        "id": "security-skill-6",
        "title": "Dependency và kiểm tra trước phát hành",
        "description": "Truy nguyên lockfile/toolchain/hash. Giữ baseline có nguồn gốc, không suy diễn metadata thành an toàn.",
        "lessonIds": [
          "security-triage-delivery",
          "security-dependency-review",
          "security-audit-project"
        ],
        "projectIds": [
          "security-project-audit"
        ],
        "required": true
      }
    ]
  }
};
