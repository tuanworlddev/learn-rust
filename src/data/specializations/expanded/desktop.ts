import type { TrackExpansion } from "../../specialization-types";
import { desktopBundle } from "../desktop";

const noteBuild = desktopBundle.lessons.find(lesson => lesson.id === "desktop-ipc")!.localLab!.files.find(file => file.path === "build.rs")!.content.replace('commands(&["validate_title"])', 'commands(&["load_note", "save_note"])');

export const desktopExpansion: TrackExpansion = {
  "chapters": [
    {
      "id": "desktop-architecture",
      "title": "Kiến trúc ứng dụng và hợp đồng IPC",
      "description": "Tách giao diện, command và mô hình tài liệu.",
      "lessonIds": [
        "desktop-ipc",
        "desktop-command-contract",
        "desktop-document-model"
      ],
      "outcomes": [
        "Thiết kế DTO, lỗi có kiểu và kiểm tra đầu vào trước khi gọi nghiệp vụ.",
        "Quản lý tài liệu bằng ID, revision và bản nháp để xử lý xung đột."
      ]
    },
    {
      "id": "desktop-persistence",
      "title": "Lưu trữ và nhập dữ liệu",
      "description": "Giữ dữ liệu qua lỗi, revision và khởi động lại.",
      "lessonIds": [
        "desktop-files",
        "desktop-atomic-save",
        "desktop-import-workflow"
      ],
      "outcomes": [
        "Lưu qua file tạm, kiểm tra revision và giữ bản nháp khi ghi thất bại.",
        "Nhập nhiều tệp qua bước xem trước, xác nhận và báo lỗi từng mục."
      ]
    },
    {
      "id": "desktop-background",
      "title": "Tác vụ nền và tìm kiếm",
      "description": "Giới hạn công việc, hủy hợp tác và kết quả đến muộn.",
      "lessonIds": [
        "desktop-state",
        "desktop-cancel-progress",
        "desktop-search-project"
      ],
      "outcomes": [
        "Hủy tác vụ hợp tác và bỏ kết quả cũ khi người dùng đổi yêu cầu.",
        "Tìm kiếm có trần số tệp, byte và kết quả; kiểm thử symlink và lỗi đọc."
      ]
    },
    {
      "id": "desktop-trust",
      "title": "Cửa sổ và ranh giới tin cậy",
      "description": "Đồng bộ nhiều cửa sổ và xử lý nội dung không đáng tin.",
      "lessonIds": [
        "desktop-capabilities",
        "desktop-multiwindow",
        "desktop-preview"
      ],
      "outcomes": [
        "Cấp capability theo cửa sổ và kiểm tra quyền tại command.",
        "Đồng bộ cửa sổ bằng snapshot/revision, giới hạn nội dung được phép trong preview."
      ]
    },
    {
      "id": "desktop-delivery",
      "title": "Dữ liệu và phát hành ứng dụng",
      "description": "Migration, cập nhật và phục hồi có kiểm chứng.",
      "lessonIds": [
        "desktop-release",
        "desktop-schema-migration",
        "desktop-upgrade-policy"
      ],
      "outcomes": [
        "Viết migration với fixture dữ liệu cũ, kiểm tra phiên bản và kế hoạch phục hồi.",
        "Chọn artifact đúng target, xác minh nguồn phát hành và phối hợp cập nhật với dữ liệu chưa lưu."
      ]
    },
    {
      "id": "desktop-product",
      "title": "Chất lượng và dự án tổng hợp",
      "description": "Đo hiệu năng, nghiệm thu và phát hành một công cụ workspace.",
      "lessonIds": [
        "desktop-quality",
        "desktop-measurement",
        "desktop-workspace-project"
      ],
      "outcomes": [
        "Đo thời gian, byte đọc và số entry trên cùng fixture để đánh giá hiệu năng.",
        "Tạo manifest SHA-256 và báo cáo thêm, sửa, xóa; từ chối kết luận khi quét chưa hoàn chỉnh."
      ]
    }
  ],
  "lessons": [
    {
      "id": "desktop-command-contract",
      "moduleId": "track-desktop",
      "title": "Thiết kế hợp đồng command và lỗi có kiểu",
      "description": "Đặt ranh giới dữ liệu giữa WebView và Rust, quản lý phiên bản và ánh xạ lỗi thành hành động của người dùng.",
      "duration": 45,
      "objectives": [
        "Đặt ranh giới dữ liệu giữa WebView và Rust, quản lý phiên bản và ánh xạ lỗi thành hành động của người dùng.",
        "Giải thích điều kiện đúng và trường hợp thất bại trước khi đổi mã.",
        "Kiểm chứng bằng bài tập, test biên và bằng chứng trong dự án."
      ],
      "sections": [
        {
          "title": "Request là dữ liệu bên ngoài",
          "text": "Một nút Lưu trên giao diện không bảo đảm yêu cầu gửi tới Rust là hợp lệ. WebView có thể gửi lại một command, dùng phiên bản JavaScript cũ hoặc truyền giá trị không đúng ngữ nghĩa. Hãy đặt một DTO tại ranh giới: tên trường ổn định, giới hạn kích thước, đơn vị đo và quy tắc trường thiếu đều được ghi rõ. Sau khi giải mã, chuyển DTO thành kiểu nghiệp vụ bằng một hàm validate. Kiểu nghiệp vụ không cần biết tên command, cửa sổ hay JSON. Nhờ vậy cùng quy tắc có thể chạy từ giao diện, bài kiểm thử và công cụ chuyển đổi dữ liệu."
        },
        {
          "title": "Phiên bản và tính lặp lại",
          "text": "Không dùng vị trí trong một mảng làm định danh tài liệu. Một request sửa ghi chú nên có document_id, expected_revision và nội dung mới. revision giúp phát hiện giao diện đang sửa trên bản cũ; nó không tự giải quyết xung đột. Với thao tác tạo hoặc nhập nhiều tệp, thêm operation_id khi cần nhận biết một lần gửi lại. Giữ một danh sách ngắn kết quả đã xử lý hoặc đặt ràng buộc tại tầng lưu trữ. Nếu command timeout nhưng việc ghi đã xong, bấm lại phải có quy tắc rõ: trả kết quả trước, từ chối trùng hoặc tạo thao tác mới có chủ đích."
        },
        {
          "title": "Lỗi phải chỉ ra bước phục hồi",
          "text": "Phân biệt lỗi dữ liệu, xung đột phiên bản, lỗi quyền truy cập và lỗi lưu trữ. DTO lỗi nên có code ổn định, thông điệp phù hợp và thông tin người dùng cần để phục hồi. Không đưa đường dẫn riêng tư hoặc stack trace vào mọi thông báo. Ví dụ conflict cần dẫn người học đến việc tải bản mới hoặc giữ bản nháp để so sánh; disk_full cần giữ nội dung đang nhập và cho phép thử lại. Một chuỗi lỗi chung cho mọi trường hợp khiến frontend phải đoán. Ở Rust, dùng enum và một lớp ánh xạ riêng để kiểm thử toàn bộ các nhánh.",
          "code": "fn accept(version:u8, revision:u64, expected:u64, bytes:usize)->Result<(), &'static str>{ if version!=1{return Err(\"version\")}; if bytes>4096{return Err(\"size\")}; if revision!=expected{return Err(\"conflict\")}; Ok(()) }"
        },
        {
          "title": "Kiểm tra hợp đồng trước khi mở cửa sổ",
          "text": "Viết test cho request tối thiểu hợp lệ, trường thiếu, kiểu sai, số vượt giới hạn và revision cũ. Sau đó kiểm tra đường đi thật qua invoke để bắt khác biệt về cách đặt tên tham số và serialization. Nếu thêm một trường tùy chọn, test một request của frontend phiên bản trước; nếu thay đổi nghĩa trường, dùng command mới hoặc tăng phiên bản hợp đồng. Ghi riêng các command đọc và command thay đổi trạng thái trong bảng thiết kế. Việc command được cấp capability chỉ cho phép gọi nó; bản thân handler vẫn phải kiểm tra các bất biến nghiệp vụ trước khi chạm vào dữ liệu."
        }
      ],
      "tip": "Không thể quyết định ghi đè thay người dùng. Lỗi conflict cho phép tải bản mới và so sánh trước khi gửi yêu cầu khác.",
      "exercise": {
        "title": "Thiết kế hợp đồng command và lỗi có kiểu — thực hành",
        "instructions": "Hoàn thành hàm theo hợp đồng trong mã mẫu. Giữ nguyên các assertion và thêm ít nhất một trường hợp biên của riêng bạn.",
        "requirements": [
          "Đạt tất cả assertion trong main.",
          "Không bỏ dữ liệu hay dùng panic để thay lỗi nghiệp vụ.",
          "Giữ đúng kết quả mong đợi."
        ]
      },
      "starterCode": "fn accept(version:u8, revision:u64, expected:u64, bytes:usize)->Result<(), &'static str>{ todo!() }\nfn main(){assert_eq!(accept(1,4,4,4096),Ok(())); assert_eq!(accept(2,4,4,0),Err(\"version\")); assert_eq!(accept(1,4,3,10),Err(\"conflict\")); assert_eq!(accept(1,4,4,4097),Err(\"size\"));\nprintln!(\"Hợp đồng command hợp lệ\");}\n",
      "solutionCode": "fn accept(version:u8, revision:u64, expected:u64, bytes:usize)->Result<(), &'static str>{ if version!=1{return Err(\"version\")}; if bytes>4096{return Err(\"size\")}; if revision!=expected{return Err(\"conflict\")}; Ok(()) }\nfn main(){assert_eq!(accept(1,4,4,4096),Ok(())); assert_eq!(accept(2,4,4,0),Err(\"version\")); assert_eq!(accept(1,4,3,10),Err(\"conflict\")); assert_eq!(accept(1,4,4,4097),Err(\"size\"));\nprintln!(\"Hợp đồng command hợp lệ\");}\n",
      "expectedOutput": "Hợp đồng command hợp lệ",
      "hints": [
        "Xác định các trường hợp phải từ chối trước khi cập nhật trạng thái.",
        "Dùng Result, checked arithmetic và giới hạn được nêu trong bài."
      ],
      "quiz": {
        "question": "Frontend cũ gửi expected_revision=4 nhưng Rust đang giữ revision=5. Handler nên làm gì?",
        "options": ["Ghi đè vì người dùng đã nhấn Lưu.", "Trả lỗi xung đột có kiểu và giữ bản nháp ở giao diện.", "Đổi revision về 4 rồi lưu."],
        "correct": 1,
        "explanation": "Không thể quyết định ghi đè thay người dùng. Lỗi conflict cho phép tải bản mới và so sánh trước khi gửi yêu cầu khác."
      },
      "reference": {
        "label": "Nguồn biên soạn chính thức",
        "url": "https://v2.tauri.app/develop/calling-rust/"
      }
    },
    {
      "id": "desktop-document-model",
      "moduleId": "track-desktop",
      "title": "Mô hình tài liệu, bản nháp và lịch sử thay đổi",
      "description": "Tách trạng thái đã lưu khỏi bản đang sửa, xác định dirty state và xây undo mà không mất nội dung.",
      "duration": 45,
      "objectives": [
        "Tách trạng thái đã lưu khỏi bản đang sửa, xác định dirty state và xây undo mà không mất nội dung.",
        "Giải thích điều kiện đúng và trường hợp thất bại trước khi đổi mã.",
        "Kiểm chứng bằng bài tập, test biên và bằng chứng trong dự án."
      ],
      "sections": [
        {
          "title": "Một tài liệu có nhiều trạng thái",
          "text": "Trong trình biên tập, văn bản đang hiển thị không nhất thiết là văn bản đã lưu. Mô hình tối thiểu cần định danh tài liệu, revision đã đọc, nội dung bản gốc và nội dung bản nháp. dirty là quan hệ giữa bản nháp với bản đã xác nhận lưu, không phải một cờ được bật ở mọi phím gõ rồi quên tắt. Khi nhận kết quả lưu, chỉ cập nhật bản gốc của đúng request. Nếu người dùng tiếp tục gõ trong lúc ghi đĩa, kết quả cũ không được làm mất phần vừa nhập hoặc khiến giao diện báo đã lưu nhầm."
        },
        {
          "title": "Undo là một lựa chọn về dữ liệu",
          "text": "Có hai cách thường dùng: lưu snapshot của trạng thái nhỏ hoặc lưu các thao tác có thể đảo ngược. Snapshot dễ kiểm chứng nhưng chiếm bộ nhớ theo kích thước tài liệu; command history nhẹ hơn khi thao tác nhỏ nhưng phải định nghĩa phép đảo chính xác. Đặt giới hạn số bước hoặc tổng byte. Một lần paste lớn không nên tạo hàng nghìn bước undo. Với nhiều tài liệu, lịch sử phải thuộc tài liệu tương ứng và bị đánh dấu rõ khi một thay đổi từ ngoài ứng dụng được nhập vào. Không sử dụng undo như cơ chế phục hồi dữ liệu sau crash."
        },
        {
          "title": "Revision không phải thời gian đồng hồ",
          "text": "Thời gian hệ thống có thể bị chỉnh và hai lần lưu có thể có cùng độ phân giải. Dùng số revision tăng có kiểm tra tràn cho trình tự cập nhật trong một tài liệu. expected_revision từ client là điều kiện ghi; revision mới được tạo ở nơi sở hữu trạng thái. Nếu nhiều tiến trình có thể mở cùng dữ liệu, Mutex trong một tiến trình không đủ. Khi đó cần lock liên tiến trình hoặc cơ sở dữ liệu có giao dịch. Trong bài này, bài tập chỉ mô hình hóa một chủ sở hữu, giúp bạn phân biệt rõ bảo đảm của thuật toán với bảo đảm của hệ thống.",
          "code": "fn dirty(saved:&str,draft:&str)->bool{saved!=draft}\nfn next_revision(current:u64,expected:u64)->Result<u64,&'static str>{if current!=expected{return Err(\"conflict\")};current.checked_add(1).ok_or(\"overflow\")}"
        },
        {
          "title": "Đóng cửa sổ và phục hồi có chủ đích",
          "text": "Trước khi đóng một tài liệu bẩn, giao diện cần cho người dùng lưu, bỏ thay đổi hoặc tiếp tục sửa. Tùy chọn bỏ thay đổi không được xóa bản đã lưu. Với autosave, nên ghi bản phục hồi riêng, chứa phiên bản schema và revision nguồn; lần mở sau cho biết bản nào mới hơn thay vì tự ghi đè. Kiểm thử chuỗi nhập A, gửi lưu A, nhập B, nhận xác nhận A và đóng cửa sổ. Kết quả đúng là B vẫn bẩn. Chuỗi thao tác này đơn giản nhưng phát hiện nhiều lỗi trạng thái mà test từng hàm riêng không thấy."
        }
      ],
      "tip": "Xác nhận chỉ chứng minh request A đã xong. B là thay đổi mới và phải được giữ cùng trạng thái dirty.",
      "exercise": {
        "title": "Mô hình tài liệu, bản nháp và lịch sử thay đổi — thực hành",
        "instructions": "Hoàn thành hàm theo hợp đồng trong mã mẫu. Giữ nguyên các assertion và thêm ít nhất một trường hợp biên của riêng bạn.",
        "requirements": [
          "Đạt tất cả assertion trong main.",
          "Không bỏ dữ liệu hay dùng panic để thay lỗi nghiệp vụ.",
          "Giữ đúng kết quả mong đợi."
        ]
      },
      "starterCode": "fn dirty(saved:&str,draft:&str)->bool{todo!()}\nfn next_revision(current:u64,expected:u64)->Result<u64,&'static str>{todo!()}\nfn main(){assert!(dirty(\"A\",\"B\"));assert!(!dirty(\"B\",\"B\"));assert_eq!(next_revision(3,3),Ok(4));assert_eq!(next_revision(4,3),Err(\"conflict\"));assert_eq!(next_revision(u64::MAX,u64::MAX),Err(\"overflow\"));\nprintln!(\"Bản nháp được giữ đúng\");}\n",
      "solutionCode": "fn dirty(saved:&str,draft:&str)->bool{saved!=draft}\nfn next_revision(current:u64,expected:u64)->Result<u64,&'static str>{if current!=expected{return Err(\"conflict\")};current.checked_add(1).ok_or(\"overflow\")}\nfn main(){assert!(dirty(\"A\",\"B\"));assert!(!dirty(\"B\",\"B\"));assert_eq!(next_revision(3,3),Ok(4));assert_eq!(next_revision(4,3),Err(\"conflict\"));assert_eq!(next_revision(u64::MAX,u64::MAX),Err(\"overflow\"));\nprintln!(\"Bản nháp được giữ đúng\");}\n",
      "expectedOutput": "Bản nháp được giữ đúng",
      "hints": [
        "Xác định các trường hợp phải từ chối trước khi cập nhật trạng thái.",
        "Dùng Result, checked arithmetic và giới hạn được nêu trong bài."
      ],
      "quiz": {
        "question": "Trong lúc lưu bản A, người dùng sửa thành B; xác nhận lưu A vừa về. Trạng thái nào đúng?",
        "options": ["Đánh dấu toàn bộ tài liệu đã lưu.", "Xóa B vì A đã ghi thành công.", "B vẫn là bản nháp chưa được xác nhận lưu."],
        "correct": 2,
        "explanation": "Xác nhận chỉ chứng minh request A đã xong. B là thay đổi mới và phải được giữ cùng trạng thái dirty."
      },
      "reference": {
        "label": "Nguồn biên soạn chính thức",
        "url": "https://v2.tauri.app/develop/state-management/"
      }
    },
    {
      "id": "desktop-atomic-save",
      "moduleId": "track-desktop",
      "title": "Dự án 1: ứng dụng ghi chú có lưu trữ và revision",
      "description": "Xây ứng dụng Tauri thực sự với command đọc/lưu, ghi tệp có kiểm soát và kiểm thử xung đột.",
      "duration": 70,
      "objectives": [
        "Xây ứng dụng Tauri thực sự với command đọc/lưu, ghi tệp có kiểm soát và kiểm thử xung đột.",
        "Giải thích điều kiện đúng và trường hợp thất bại trước khi đổi mã.",
        "Kiểm chứng bằng bài tập, test biên và bằng chứng trong dự án."
      ],
      "sections": [
        {
          "title": "Từ nút Lưu đến dữ liệu bền vững",
          "text": "Dự án đầu tiên là một ứng dụng ghi chú một tài liệu. Giao diện gửi nội dung và revision đã đọc; Rust kiểm tra kích thước, tính revision mới và ghi snapshot JSON vào thư mục dữ liệu ứng dụng. Đường dẫn không do JavaScript chọn nên command không trở thành API ghi tệp tùy ý. Ứng dụng giữ trạng thái trong Mutex để hai command trong cùng tiến trình không ghi xen nhau. Đây là phạm vi một tiến trình; bài nghiệm thu yêu cầu bạn giải thích điều gì thay đổi nếu cho phép chạy nhiều instance cùng lúc."
        },
        {
          "title": "Ghi tệp tạm rồi công bố",
          "text": "Ghi trực tiếp vào tệp đang dùng có thể làm mất bản cũ khi thao tác dở dang. Quy trình lab tạo tệp tạm trong cùng thư mục, ghi đủ byte, gọi sync_all trên tệp rồi rename để thay snapshot. Rename không đi qua hai filesystem khác nhau. Nếu lỗi xảy ra trước rename, tệp chính giữ bản cũ; tệp tạm cần được dọn hoặc nhận diện khi khởi động lại. Khả năng bền vững sau mất điện còn phụ thuộc hệ điều hành, filesystem và đồng bộ thư mục. Vì vậy bài yêu cầu phân biệt commit logic với cam kết dữ liệu sau power loss."
        },
        {
          "title": "Command, capability và giao diện",
          "text": "Bản tải xuống có Cargo.toml, build.rs, cấu hình Tauri, capability, Rust backend và giao diện HTML/JavaScript. Hai command load_note và save_note được khai báo rõ. Frontend dùng textContent và textarea để đưa nội dung vào trang; nó không chèn văn bản ghi chú thành HTML. Nút lưu báo lỗi có thể hiểu được, giữ nguyên bản nháp khi conflict hoặc I/O thất bại. Khi chạy lab, sửa ghi chú, đóng ứng dụng và mở lại để xác nhận persistence. Cargo test kiểm tra logic lưu; phép thử cửa sổ thật vẫn phải chạy trên nền tảng desktop đích.",
          "code": "fn commit(current:u64,expected:u64,write_ok:bool)->Result<u64,&'static str>{if current!=expected{return Err(\"conflict\")};let next=current.checked_add(1).ok_or(\"overflow\")?;if !write_ok{return Err(\"io\")};Ok(next)}"
        },
        {
          "title": "Nghiệm thu bằng các trường hợp thất bại",
          "text": "Đừng dừng ở việc lưu một câu thành công. Hãy gửi revision cũ, nội dung quá giới hạn, snapshot JSON hỏng và thử một nơi không ghi được. Xác nhận lỗi không làm revision trong bộ nhớ đi trước dữ liệu trên đĩa. Sửa test để mô phỏng lỗi trước bước công bố rồi mở lại repository. Thêm một trường tùy chọn và đọc snapshot cũ để luyện tương thích. Sản phẩm bàn giao gồm mã nguồn, test, mô tả vị trí lưu dữ liệu và video ngắn cho luồng mở, sửa, lưu, conflict, khởi động lại. Chỉ đánh dấu hoàn thành khi các hành vi có bằng chứng."
        }
      ],
      "tip": "Chỉ công bố trạng thái mới sau khi bước ghi theo hợp đồng thành công. Khi lỗi, request phải còn khả năng thử lại mà không mất bản cũ.",
      "exercise": {
        "title": "Dự án 1: ứng dụng ghi chú có lưu trữ và revision — thực hành",
        "instructions": "Hoàn thành hàm theo hợp đồng trong mã mẫu. Giữ nguyên các assertion và thêm ít nhất một trường hợp biên của riêng bạn.",
        "requirements": [
          "Đạt tất cả assertion trong main.",
          "Không bỏ dữ liệu hay dùng panic để thay lỗi nghiệp vụ.",
          "Giữ đúng kết quả mong đợi."
        ]
      },
      "starterCode": "fn commit(current:u64,expected:u64,write_ok:bool)->Result<u64,&'static str>{todo!()}\nfn main(){assert_eq!(commit(2,2,true),Ok(3));assert_eq!(commit(2,1,true),Err(\"conflict\"));assert_eq!(commit(2,2,false),Err(\"io\"));assert_eq!(commit(u64::MAX,u64::MAX,true),Err(\"overflow\"));\nprintln!(\"Chỉ công bố khi ghi thành công\");}\n",
      "solutionCode": "fn commit(current:u64,expected:u64,write_ok:bool)->Result<u64,&'static str>{if current!=expected{return Err(\"conflict\")};let next=current.checked_add(1).ok_or(\"overflow\")?;if !write_ok{return Err(\"io\")};Ok(next)}\nfn main(){assert_eq!(commit(2,2,true),Ok(3));assert_eq!(commit(2,1,true),Err(\"conflict\"));assert_eq!(commit(2,2,false),Err(\"io\"));assert_eq!(commit(u64::MAX,u64::MAX,true),Err(\"overflow\"));\nprintln!(\"Chỉ công bố khi ghi thành công\");}\n",
      "expectedOutput": "Chỉ công bố khi ghi thành công",
      "hints": [
        "Xác định các trường hợp phải từ chối trước khi cập nhật trạng thái.",
        "Dùng Result, checked arithmetic và giới hạn được nêu trong bài."
      ],
      "quiz": {
        "question": "Ghi tệp tạm thất bại trước rename. Revision trong bộ nhớ nên thay đổi thế nào?",
        "options": ["Giữ nguyên revision đã xác nhận trước đó.", "Tăng ngay để tránh trùng.", "Xóa dữ liệu cũ."],
        "correct": 0,
        "explanation": "Chỉ công bố trạng thái mới sau khi bước ghi theo hợp đồng thành công. Khi lỗi, request phải còn khả năng thử lại mà không mất bản cũ."
      },
      "reference": {
        "label": "Nguồn biên soạn chính thức",
        "url": "https://doc.rust-lang.org/std/fs/fn.rename.html"
      },
      "localLab": {
        "title": "Ghi chú Tauri có repository và revision",
        "instructions": "Giải nén dự án và chạy cargo test trước. cargo run mở cửa sổ Tauri; máy cần bộ công cụ native tương ứng. Ứng dụng chỉ lưu note.json trong thư mục app-data của dev.learnrust.notesproject. Bài mẫu hỗ trợ một tiến trình; cần bổ sung khóa liên tiến trình hoặc single-instance trước khi cho nhiều instance cùng ghi. Bộ test chạy repository trên thư mục tạm, không mở cửa sổ.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"desktop_note_project\"\nversion = \"0.1.0\"\nedition = \"2024\"\n[build-dependencies]\ntauri-build = \"=2.7.4\"\n[dependencies]\ntauri = \"=2.12.5\"\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\n"
          },
          {
            "path": "build.rs",
            "content": noteBuild
          },
          {
            "path": "tauri.conf.json",
            "content": "{\n  \"$schema\": \"https://schema.tauri.app/config/2\",\n  \"productName\": \"Ghi chú Rust\",\n  \"version\": \"0.1.0\",\n  \"identifier\": \"dev.learnrust.notesproject\",\n  \"build\": {\n    \"frontendDist\": \"ui\"\n  },\n  \"app\": {\n    \"withGlobalTauri\": true,\n    \"windows\": [\n      {\n        \"label\": \"main\",\n        \"title\": \"Ghi chú Rust\",\n        \"width\": 760,\n        \"height\": 560\n      }\n    ],\n    \"security\": {\n      \"capabilities\": [\n        \"main\"\n      ],\n      \"csp\": \"default-src 'self'; script-src 'self'; style-src 'self'; connect-src ipc: http://ipc.localhost\"\n    }\n  },\n  \"bundle\": {\n    \"active\": false\n  }\n}"
          },
          {
            "path": "permissions/notes.toml",
            "content": "[[permission]]\nidentifier = \"notes-access\"\ndescription = \"Read and save the app-owned note\"\ncommands.allow = [\"load_note\", \"save_note\"]\n"
          },
          {
            "path": "capabilities/main.json",
            "content": "{\n  \"identifier\": \"main\",\n  \"description\": \"App-owned note commands in main window\",\n  \"windows\": [\n    \"main\"\n  ],\n  \"permissions\": [\n    \"notes-access\"\n  ]\n}"
          },
          {
            "path": "src/lib.rs",
            "content": "use serde::{Deserialize, Serialize};\nuse std::{fs::{self,File,OpenOptions},io::{Read,Write},path::{Path,PathBuf},sync::atomic::{AtomicU64,Ordering}};\nconst MAX_BYTES:usize=16_384;\nconst MAX_DISK:usize=MAX_BYTES*6+1024;\nstatic NEXT:AtomicU64=AtomicU64::new(0);\n#[derive(Debug,Clone,Serialize,Deserialize,PartialEq,Eq)]\n#[serde(deny_unknown_fields)]\npub struct Note { pub schema_version:u8,pub revision:u32,pub body:String }\npub struct Repository { directory:PathBuf }\nimpl Repository {\n pub fn new(directory:PathBuf)->Self{Self{directory}}\n pub fn load(&self)->Result<Note,String>{\n  let path=self.directory.join(\"note.json\");\n  let file=match File::open(path){Ok(f)=>f,Err(e) if e.kind()==std::io::ErrorKind::NotFound=>return Ok(Note{schema_version:1,revision:0,body:String::new()}),Err(_)=>return Err(\"io\".into())};\n  let mut bytes=Vec::new();file.take((MAX_DISK+1) as u64).read_to_end(&mut bytes).map_err(|_|\"io\")?;\n  if bytes.len()>MAX_DISK{return Err(\"size\".into())}\n  let note:Note=serde_json::from_slice(&bytes).map_err(|_|\"corrupt\")?;\n  if note.schema_version!=1{return Err(\"schema\".into())}\n  if note.body.len()>MAX_BYTES{return Err(\"size\".into())}\n  Ok(note)\n }\n pub fn save(&self,expected:u32,body:String)->Result<Note,String>{\n  if body.len()>MAX_BYTES{return Err(\"size\".into())}\n  let current=self.load()?;if current.revision!=expected{return Err(\"conflict\".into())}\n  let next=Note{schema_version:1,revision:current.revision.checked_add(1).ok_or(\"overflow\")?,body};\n  fs::create_dir_all(&self.directory).map_err(|_|\"io\")?;\n  let temp=self.directory.join(format!(\".note-{}-{}.tmp\",std::process::id(),NEXT.fetch_add(1,Ordering::Relaxed)));\n  let result=(||{\n   let mut file=OpenOptions::new().create_new(true).write(true).open(&temp).map_err(|_|\"io\")?;\n   let bytes=serde_json::to_vec(&next).map_err(|_|\"encode\")?;\n   file.write_all(&bytes).map_err(|_|\"io\")?;file.sync_all().map_err(|_|\"io\")?;drop(file);\n   fs::rename(&temp,self.directory.join(\"note.json\")).map_err(|_|\"io\")?;\n   Ok::<_,String>(next)\n  })();\n  if result.is_err(){let _=fs::remove_file(&temp);}result\n }\n pub fn directory(&self)->&Path{&self.directory}\n}\n#[cfg(test)]\nmod tests{\n use super::*;\n struct Temp(PathBuf);impl Temp{fn new()->Self{let p=std::env::temp_dir().join(format!(\"learn-rust-note-{}-{}\",std::process::id(),NEXT.fetch_add(1,Ordering::Relaxed)));fs::create_dir_all(&p).unwrap();Self(p)}}impl Drop for Temp{fn drop(&mut self){let _=fs::remove_dir_all(&self.0);}}\n #[test]fn persistence_and_conflict(){let t=Temp::new();let r=Repository::new(t.0.clone());assert_eq!(r.load().unwrap().revision,0);let n=r.save(0,\"Ghi chú tiếng Việt\".into()).unwrap();assert_eq!(n.revision,1);assert_eq!(r.load().unwrap(),n);assert_eq!(r.save(0,\"stale\".into()).unwrap_err(),\"conflict\");assert_eq!(r.load().unwrap().body,\"Ghi chú tiếng Việt\");}\n #[test]fn size_does_not_commit(){let t=Temp::new();let r=Repository::new(t.0.clone());assert_eq!(r.save(0,\"a\".repeat(MAX_BYTES+1)).unwrap_err(),\"size\");assert_eq!(r.load().unwrap().revision,0);}\n #[test]fn corrupt_is_not_replaced(){let t=Temp::new();fs::write(t.0.join(\"note.json\"),b\"{broken\").unwrap();let r=Repository::new(t.0.clone());assert_eq!(r.save(0,\"new\".into()).unwrap_err(),\"corrupt\");assert_eq!(fs::read(t.0.join(\"note.json\")).unwrap(),b\"{broken\");}\n #[test]fn escaped_body_roundtrips(){let t=Temp::new();let r=Repository::new(t.0.clone());let body=\"\\n\".repeat(MAX_BYTES);r.save(0,body.clone()).unwrap();assert_eq!(r.load().unwrap().body,body);}\n #[test]fn missing_parent_is_created(){let t=Temp::new();let r=Repository::new(t.0.join(\"nested\"));r.save(0,\"hello\".into()).unwrap();assert!(r.directory().join(\"note.json\").is_file());}\n}"
          },
          {
            "path": "src/main.rs",
            "content": "use desktop_note_project::{Note,Repository};\nuse std::sync::Mutex;\nuse tauri::{Manager,State};\n#[tauri::command]fn load_note(state:State<'_,Mutex<Repository>>)->Result<Note,String>{state.lock().map_err(|_|\"state\")?.load()}\n#[tauri::command]fn save_note(state:State<'_,Mutex<Repository>>,expected_revision:u32,body:String)->Result<Note,String>{state.lock().map_err(|_|\"state\")?.save(expected_revision,body)}\nfn main(){tauri::Builder::default().setup(|app|{let path=app.path().app_data_dir()?;app.manage(Mutex::new(Repository::new(path)));Ok(())}).invoke_handler(tauri::generate_handler![load_note,save_note]).run(tauri::generate_context!()).expect(\"run app\");}\n"
          },
          {
            "path": "ui/index.html",
            "content": "<!doctype html><html lang=\"vi\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Ghi chú Rust</title><link rel=\"stylesheet\" href=\"style.css\"><script src=\"app.js\" defer></script></head><body><main><h1>Ghi chú</h1><form id=\"note\"><label for=\"body\">Nội dung</label><textarea id=\"body\" rows=\"14\"></textarea><button id=\"save\">Lưu</button></form><p id=\"status\" role=\"status\"></p></main></body></html>"
          },
          {
            "path": "ui/style.css",
            "content": "body{font:16px system-ui;margin:24px;background:#fafafa;color:#242424}main{max-width:700px;margin:auto}label,textarea{display:block}textarea{box-sizing:border-box;width:100%;margin:12px 0;padding:12px;font:inherit}button{padding:8px 18px}button:focus-visible,textarea:focus-visible{outline:2px solid #b34c2f}p{min-height:24px}"
          },
          {
            "path": "ui/app.js",
            "content": "const editor=document.querySelector(\"#body\"),status=document.querySelector(\"#status\"),button=document.querySelector(\"#save\");let revision=0,saved=\"\";\nconst messages={conflict:\"Bản lưu đã thay đổi. Giữ bản nháp và mở lại để so sánh.\",size:\"Nội dung vượt giới hạn 16 KiB.\",corrupt:\"Bản lưu chưa đọc được. Nội dung gốc được giữ.\",schema:\"Bản lưu cần phiên bản ứng dụng phù hợp.\",io:\"Chưa ghi được dữ liệu. Bản nháp vẫn còn.\"};\nasync function load(){try{const note=await window.__TAURI__.core.invoke(\"load_note\");revision=note.revision;saved=note.body;editor.value=saved;status.textContent=\"Đã mở bản \"+revision;}catch(error){status.textContent=messages[error]||\"Chưa mở được ghi chú\";}}\ndocument.querySelector(\"#note\").addEventListener(\"submit\",async event=>{event.preventDefault();const body=editor.value;button.disabled=true;try{const note=await window.__TAURI__.core.invoke(\"save_note\",{expectedRevision:revision,body});revision=note.revision;saved=note.body;status.textContent=editor.value===saved?\"Đã lưu\":\"Đã lưu bản trước; còn thay đổi mới\";}catch(error){status.textContent=messages[error]||\"Chưa lưu được\";}finally{button.disabled=false;}});\nload();"
          },
          {
            "path": "README.md",
            "content": "# Ghi chú có revision\n\nChạy `cargo test` rồi `cargo run`. Rust giữ một repository, UI giữ bản nháp. Kiểm tra lưu/mở lại, gửi revision cũ, JSON hỏng và nội dung có ký tự điều khiển. Khóa Mutex chỉ bảo vệ command trong cùng tiến trình. Rename được dùng trong cùng thư mục; tính bền vững qua mất điện cần kiểm tra filesystem và fsync thư mục của nền tảng. Không xem cargo test là nghiệm thu WebView hoặc signing.\n\nBài mở rộng: thêm xác nhận đóng khi dirty; thêm single-instance; thêm backup có phiên bản; thêm test lỗi trước commit.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run"
        ],
        "checks": [
          "Lưu và mở lại giữ đúng nội dung Unicode và revision.",
          "Request dùng revision cũ bị từ chối, bản nháp vẫn còn.",
          "Snapshot hỏng hoặc schema chưa biết không bị ghi đè.",
          "Mở cửa sổ thật, sửa trong lúc lưu và kiểm tra trạng thái dirty."
        ]
      },
      "simulation": {
        "title": "Một lần lưu ghi chú",
        "description": "Theo dõi bản nháp, tệp tạm và revision được công bố.",
        "kind": "sequence",
        "nodes": [
          {
            "id": "ui",
            "label": "Bản nháp",
            "detail": "Nội dung người dùng đang sửa"
          },
          {
            "id": "check",
            "label": "Kiểm tra",
            "detail": "Revision và giới hạn"
          },
          {
            "id": "temp",
            "label": "Tệp tạm",
            "detail": "Ghi đủ dữ liệu trước commit"
          },
          {
            "id": "saved",
            "label": "Bản đã lưu",
            "detail": "Trạng thái được công bố"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Thành công",
            "steps": [
              {
                "title": "Gửi yêu cầu",
                "description": "UI gửi bản B dựa trên revision 7.",
                "activeNodeIds": [
                  "ui"
                ],
                "values": [
                  {
                    "label": "revision",
                    "value": "7"
                  }
                ]
              },
              {
                "title": "Đối chiếu",
                "description": "Backend xác nhận revision 7 còn hiện hành.",
                "activeNodeIds": [
                  "check"
                ],
                "values": [
                  {
                    "label": "expected",
                    "value": "7"
                  }
                ]
              },
              {
                "title": "Chuẩn bị",
                "description": "Ghi snapshot revision 8 vào tệp tạm.",
                "activeNodeIds": [
                  "temp"
                ],
                "values": [
                  {
                    "label": "tệp chính",
                    "value": "vẫn revision 7"
                  }
                ]
              },
              {
                "title": "Công bố",
                "description": "Rename thành công rồi trả revision 8.",
                "activeNodeIds": [
                  "saved"
                ],
                "values": [
                  {
                    "label": "revision",
                    "value": "8"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "Có lỗi",
            "steps": [
              {
                "title": "Gửi yêu cầu",
                "description": "UI gửi bản B dựa trên revision 7.",
                "activeNodeIds": [
                  "ui"
                ],
                "values": [
                  {
                    "label": "revision",
                    "value": "7"
                  }
                ]
              },
              {
                "title": "Đối chiếu",
                "description": "Dữ liệu hợp lệ.",
                "activeNodeIds": [
                  "check"
                ],
                "values": [
                  {
                    "label": "expected",
                    "value": "7"
                  }
                ]
              },
              {
                "title": "Ghi thất bại",
                "description": "Hết dung lượng trước rename; xóa tệp tạm của thao tác.",
                "activeNodeIds": [
                  "temp"
                ],
                "values": [
                  {
                    "label": "lỗi",
                    "value": "io"
                  }
                ]
              },
              {
                "title": "Giữ bản nháp",
                "description": "UI giữ B; tệp chính vẫn revision 7.",
                "activeNodeIds": [
                  "ui"
                ],
                "values": [
                  {
                    "label": "đã lưu",
                    "value": "revision 7"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "desktop-import-workflow",
      "moduleId": "track-desktop",
      "title": "Nhập dữ liệu: xem trước, kiểm tra và hủy an toàn",
      "description": "Thiết kế quy trình nhập nhiều mục có giới hạn, báo lỗi theo hàng và tránh cập nhật nửa chừng.",
      "duration": 45,
      "objectives": [
        "Thiết kế quy trình nhập nhiều mục có giới hạn, báo lỗi theo hàng và tránh cập nhật nửa chừng.",
        "Giải thích điều kiện đúng và trường hợp thất bại trước khi đổi mã.",
        "Kiểm chứng bằng bài tập, test biên và bằng chứng trong dự án."
      ],
      "sections": [
        {
          "title": "Nhập dữ liệu là một giao dịch sản phẩm",
          "text": "Kéo một tệp vào ứng dụng gồm ít nhất ba giai đoạn: đọc dữ liệu với giới hạn, phân tích thành bản xem trước và áp dụng thay đổi. Tách chúng giúp người dùng nhìn thấy số mục hợp lệ, xung đột và lỗi trước khi dữ liệu hiện có thay đổi. Không coi đuôi .json hay Content-Type là bằng chứng cấu trúc. Đặt ngân sách byte, số mục và độ dài từng trường; khi vượt giới hạn, dừng với lỗi rõ. Chỉ truyền bản tóm tắt và những hàng cần xem xuống WebView để tránh sao chép một tệp lớn nhiều lần."
        },
        {
          "title": "Định danh và quy tắc xung đột",
          "text": "Mỗi mục nhập cần một khóa ổn định hoặc một quy tắc tạo khóa. Tên hiển thị không luôn duy nhất và việc lowercase có thể làm mất ý nghĩa. Xác định trước các chế độ: bỏ qua mục đã có, tạo bản sao hoặc cập nhật khi revision khớp. Bản xem trước phải nêu chính xác thao tác sẽ diễn ra. Khi dữ liệu hiện có thay đổi sau lúc xem trước, bước áp dụng cần kiểm tra lại phiên bản nền. Nếu chỉ tin bản xem trước, thao tác nhập có thể âm thầm ghi đè thay đổi của một cửa sổ khác."
        },
        {
          "title": "Hủy có ranh giới rõ",
          "text": "Có thể hủy an toàn trong lúc đọc hoặc phân tích nếu chưa công bố thay đổi. Sau khi bắt đầu commit, cần lựa chọn hoàn tất nguyên tử hoặc trả về trạng thái đã áp dụng một phần theo thiết kế được công bố. Không hiển thị Hủy thành công nếu một phần dữ liệu đã được ghi mà người dùng không biết. Với nhiều mục, transaction của database đơn giản hóa all-or-nothing; với tệp, có thể chuẩn bị manifest mới rồi đổi con trỏ sau khi các tệp cần thiết đã sẵn sàng. Cách chọn phụ thuộc sản phẩm và phải được kiểm thử khi lỗi xảy ra ở từng bước.",
          "code": "fn plan(ids:&[&str])->Result<usize,&'static str>{let mut seen=std::collections::HashSet::new();for id in ids{if id.trim().is_empty(){return Err(\"empty\")};if !seen.insert(*id){return Err(\"duplicate\")}}Ok(seen.len())}"
        },
        {
          "title": "Bài thực hành kiểm tra kế hoạch nhập",
          "text": "Bài tập tạo một kế hoạch từ danh sách ID, từ chối ID rỗng và phát hiện trùng trước khi thay đổi tập dữ liệu đích. Sau khi làm xong, mở rộng bằng một báo cáo lỗi có số thứ tự hàng và mã lỗi ổn định. Giữ nguyên dữ liệu gốc để người dùng sửa và nhập lại. Trong ứng dụng thật, log chỉ lưu số lượng và loại lỗi, không đổ toàn bộ nội dung nhập. Nghiệm thu bằng tệp rỗng, Unicode, hai ID trùng, dữ liệu vượt giới hạn và hủy ngay trước commit. Mỗi ca cần chỉ rõ dữ liệu nào còn nguyên sau thao tác."
        }
      ],
      "tip": "Bản xem trước gắn với một snapshot. Kiểm tra revision tại commit ngăn áp dụng kế hoạch đã cũ.",
      "exercise": {
        "title": "Nhập dữ liệu: xem trước, kiểm tra và hủy an toàn — thực hành",
        "instructions": "Hoàn thành hàm theo hợp đồng trong mã mẫu. Giữ nguyên các assertion và thêm ít nhất một trường hợp biên của riêng bạn.",
        "requirements": [
          "Đạt tất cả assertion trong main.",
          "Không bỏ dữ liệu hay dùng panic để thay lỗi nghiệp vụ.",
          "Giữ đúng kết quả mong đợi."
        ]
      },
      "starterCode": "fn plan(ids:&[&str])->Result<usize,&'static str>{todo!()}\nfn main(){assert_eq!(plan(&[\"a\",\"b\"]),Ok(2));assert_eq!(plan(&[\"a\",\"a\"]),Err(\"duplicate\"));assert_eq!(plan(&[\" \"]),Err(\"empty\"));assert_eq!(plan(&[]),Ok(0));\nprintln!(\"Kế hoạch nhập đã kiểm tra\");}\n",
      "solutionCode": "fn plan(ids:&[&str])->Result<usize,&'static str>{let mut seen=std::collections::HashSet::new();for id in ids{if id.trim().is_empty(){return Err(\"empty\")};if !seen.insert(*id){return Err(\"duplicate\")}}Ok(seen.len())}\nfn main(){assert_eq!(plan(&[\"a\",\"b\"]),Ok(2));assert_eq!(plan(&[\"a\",\"a\"]),Err(\"duplicate\"));assert_eq!(plan(&[\" \"]),Err(\"empty\"));assert_eq!(plan(&[]),Ok(0));\nprintln!(\"Kế hoạch nhập đã kiểm tra\");}\n",
      "expectedOutput": "Kế hoạch nhập đã kiểm tra",
      "hints": [
        "Xác định các trường hợp phải từ chối trước khi cập nhật trạng thái.",
        "Dùng Result, checked arithmetic và giới hạn được nêu trong bài."
      ],
      "quiz": {
        "question": "Dữ liệu nền thay đổi sau lúc xem trước nhập. Bước áp dụng cần làm gì?",
        "options": ["Bỏ qua vì đã xem trước.", "Luôn ghi đè mọi mục.", "Kiểm tra lại revision nền và yêu cầu xem lại nếu xung đột."],
        "correct": 2,
        "explanation": "Bản xem trước gắn với một snapshot. Kiểm tra revision tại commit ngăn áp dụng kế hoạch đã cũ."
      },
      "reference": {
        "label": "Nguồn biên soạn chính thức",
        "url": "https://v2.tauri.app/develop/calling-rust/"
      }
    },
    {
      "id": "desktop-cancel-progress",
      "moduleId": "track-desktop",
      "title": "Hủy tác vụ và hiển thị tiến độ đúng yêu cầu",
      "description": "Tổ chức tác vụ dài, giới hạn hàng đợi sự kiện và bỏ kết quả đến muộn sau khi người dùng đổi thao tác.",
      "duration": 45,
      "objectives": [
        "Tổ chức tác vụ dài, giới hạn hàng đợi sự kiện và bỏ kết quả đến muộn sau khi người dùng đổi thao tác.",
        "Giải thích điều kiện đúng và trường hợp thất bại trước khi đổi mã.",
        "Kiểm chứng bằng bài tập, test biên và bằng chứng trong dự án."
      ],
      "sections": [
        {
          "title": "Một tác vụ cần danh tính riêng",
          "text": "Tìm kiếm, lập chỉ mục hoặc xuất tệp có thể lâu hơn thời gian người dùng ở lại một màn hình. Gắn operation_id hoặc generation cho mỗi tác vụ và mang giá trị đó trong mọi cập nhật tiến độ, kết quả và lỗi. Giao diện chỉ chấp nhận thông điệp thuộc tác vụ đang được theo dõi. Đây là bảo vệ tính đúng đắn hiển thị, không phải hủy công việc nền. Nếu chỉ bỏ kết quả cũ mà vẫn tiếp tục đọc hàng triệu tệp, CPU và I/O vẫn bị tiêu tốn. Do đó cần cả cơ chế nhận biết kết quả cũ và cơ chế hủy hợp tác."
        },
        {
          "title": "Điểm hủy nằm giữa các đơn vị công việc",
          "text": "Worker kiểm tra cờ hủy trước mỗi bước có thể lặp lại như đọc một tệp hoặc xử lý một batch. Các hàm blocking đang thực hiện không tự dừng chỉ vì cờ đổi. Chọn đơn vị đủ nhỏ để độ trễ hủy chấp nhận được, nhưng không kiểm tra cờ ở từng byte làm chi phí tăng vô ích. Với bước commit, hãy xác định ranh giới không thể đảo: sau đó tác vụ có thể phải hoàn tất rồi báo kết quả. Khi đóng cửa sổ, chủ sở hữu task cần yêu cầu hủy, chờ giải phóng tài nguyên trong thời hạn và ghi nhận lỗi phù hợp."
        },
        {
          "title": "Tiến độ cũng cần backpressure",
          "text": "Gửi một event cho mỗi dòng dữ liệu dễ làm WebView ngập thông điệp. Coalesce tiến độ: chỉ giữ giá trị mới nhất hoặc phát theo khoảng thời gian, còn sự kiện kết thúc không được bỏ. Tách số đã xử lý, tổng đã biết và giai đoạn hiện tại. Khi chưa biết tổng, hiển thị trạng thái đang quét thay vì một phần trăm bịa ra. Một hàng đợi hữu hạn phải có chính sách đầy rõ ràng; tiến độ trung gian có thể thay thế, kết quả cuối phải được nhận hoặc được truy vấn lại từ command trạng thái.",
          "code": "fn accept_event(active:u64,event:u64,cancelled:bool)->bool{active==event&&!cancelled}"
        },
        {
          "title": "Kiểm thử các lịch thực thi khó chịu",
          "text": "Mô phỏng người dùng bắt đầu A, hủy A, bắt đầu B rồi nhận kết quả A trước kết quả B. Test phải chứng minh A không thay nội dung B. Tiếp theo cho worker báo tiến độ sau khi cửa sổ đã đóng; lỗi gửi không được panic toàn ứng dụng. Đo thời gian từ lúc nhấn hủy đến khi worker ngừng nhận việc mới, không chỉ thời gian nút đổi màu. Bài tập dùng generation và trạng thái hủy để lọc thông điệp. Khi tích hợp thật, bạn phải kiểm chứng thêm vòng đời JoinHandle, channel và các handle tệp đang mở."
        }
      ],
      "tip": "Lọc generation bảo vệ UI. Dừng công việc nền là trách nhiệm riêng của vòng đời task và các điểm kiểm tra hủy.",
      "exercise": {
        "title": "Hủy tác vụ và hiển thị tiến độ đúng yêu cầu — thực hành",
        "instructions": "Hoàn thành hàm theo hợp đồng trong mã mẫu. Giữ nguyên các assertion và thêm ít nhất một trường hợp biên của riêng bạn.",
        "requirements": [
          "Đạt tất cả assertion trong main.",
          "Không bỏ dữ liệu hay dùng panic để thay lỗi nghiệp vụ.",
          "Giữ đúng kết quả mong đợi."
        ]
      },
      "starterCode": "fn accept_event(active:u64,event:u64,cancelled:bool)->bool{todo!()}\nfn main(){assert!(accept_event(9,9,false));assert!(!accept_event(9,8,false));assert!(!accept_event(9,9,true));\nprintln!(\"Không nhận kết quả đến muộn\");}\n",
      "solutionCode": "fn accept_event(active:u64,event:u64,cancelled:bool)->bool{active==event&&!cancelled}\nfn main(){assert!(accept_event(9,9,false));assert!(!accept_event(9,8,false));assert!(!accept_event(9,9,true));\nprintln!(\"Không nhận kết quả đến muộn\");}\n",
      "expectedOutput": "Không nhận kết quả đến muộn",
      "hints": [
        "Xác định các trường hợp phải từ chối trước khi cập nhật trạng thái.",
        "Dùng Result, checked arithmetic và giới hạn được nêu trong bài."
      ],
      "quiz": {
        "question": "Bỏ mọi kết quả của tác vụ cũ có bảo đảm tác vụ đó đã ngừng dùng tài nguyên không?",
        "options": ["Có, vì giao diện đã bỏ kết quả.", "Không; worker còn cần hủy hợp tác và giải phóng tài nguyên.", "Có nếu đổi operation_id thành số lớn hơn."],
        "correct": 1,
        "explanation": "Lọc generation bảo vệ UI. Dừng công việc nền là trách nhiệm riêng của vòng đời task và các điểm kiểm tra hủy."
      },
      "reference": {
        "label": "Nguồn biên soạn chính thức",
        "url": "https://v2.tauri.app/develop/calling-frontend/"
      },
      "simulation": {
        "title": "Tác vụ đến muộn",
        "description": "Generation bảo vệ kết quả hiển thị; cancellation dừng nhận việc mới.",
        "kind": "timeline",
        "nodes": [
          {
            "id": "a",
            "label": "Tác vụ A",
            "detail": "Thao tác cũ"
          },
          {
            "id": "cancel",
            "label": "Hủy",
            "detail": "Cờ hủy hợp tác"
          },
          {
            "id": "b",
            "label": "Tác vụ B",
            "detail": "Thao tác hiện hành"
          },
          {
            "id": "ui",
            "label": "Giao diện",
            "detail": "Chỉ nhận generation hiện tại"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Thành công",
            "steps": [
              {
                "title": "Bắt đầu A",
                "description": "Generation 10 được phát.",
                "activeNodeIds": [
                  "a"
                ],
                "values": [
                  {
                    "label": "active",
                    "value": "10"
                  }
                ]
              },
              {
                "title": "Đổi truy vấn",
                "description": "Hủy A và bắt đầu B.",
                "activeNodeIds": [
                  "cancel"
                ],
                "values": [
                  {
                    "label": "active",
                    "value": "11"
                  }
                ]
              },
              {
                "title": "A báo kết quả",
                "description": "Thông điệp generation 10 bị bỏ.",
                "activeNodeIds": [
                  "a"
                ],
                "values": [
                  {
                    "label": "accepted",
                    "value": "false"
                  }
                ]
              },
              {
                "title": "B hoàn thành",
                "description": "UI nhận generation 11.",
                "activeNodeIds": [
                  "ui"
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
            "label": "Có lỗi",
            "steps": [
              {
                "title": "Bắt đầu A",
                "description": "A đang đọc một tệp.",
                "activeNodeIds": [
                  "a"
                ],
                "values": [
                  {
                    "label": "active",
                    "value": "10"
                  }
                ]
              },
              {
                "title": "Nhấn hủy",
                "description": "Cờ đổi; thao tác blocking hiện hành còn phải kết thúc.",
                "activeNodeIds": [
                  "cancel"
                ],
                "values": [
                  {
                    "label": "cancelled",
                    "value": "true"
                  }
                ]
              },
              {
                "title": "Điểm hủy",
                "description": "Worker kiểm tra trước tệp kế tiếp và dừng.",
                "activeNodeIds": [
                  "a"
                ],
                "values": [
                  {
                    "label": "việc mới",
                    "value": "0"
                  }
                ]
              },
              {
                "title": "Giữ giao diện",
                "description": "Không công bố kết quả chưa hoàn chỉnh.",
                "activeNodeIds": [
                  "ui"
                ],
                "values": [
                  {
                    "label": "trạng thái",
                    "value": "đã hủy"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "desktop-search-project",
      "moduleId": "track-desktop",
      "title": "Dự án 2: bộ tìm kiếm tệp có ngân sách tài nguyên",
      "description": "Xây lõi tìm kiếm thật trên thư mục, bỏ symlink, giới hạn tệp và kết quả rồi tích hợp với giao diện.",
      "duration": 70,
      "objectives": [
        "Xây lõi tìm kiếm thật trên thư mục, bỏ symlink, giới hạn tệp và kết quả rồi tích hợp với giao diện.",
        "Giải thích điều kiện đúng và trường hợp thất bại trước khi đổi mã.",
        "Kiểm chứng bằng bài tập, test biên và bằng chứng trong dự án."
      ],
      "sections": [
        {
          "title": "Định nghĩa sản phẩm trước thuật toán",
          "text": "Công cụ tìm kiếm desktop cần trả lời ba câu hỏi: phạm vi thư mục nào được đọc, dữ liệu nào được coi là văn bản và bao nhiêu kết quả là đủ. Trong dự án này, người dùng chủ động chọn một thư mục; engine duyệt các tệp thường, không đi theo symlink và không đọc quá ngân sách cho mỗi tệp. Kết quả chứa đường dẫn tương đối, số dòng và đoạn văn bản gốc. Việc tìm không phân biệt hoa thường có thể dùng khóa chuẩn hóa riêng, nhưng không thay nội dung hiển thị bằng bản đã lowercase."
        },
        {
          "title": "Duyệt thư mục không phải thao tác miễn phí",
          "text": "Một cây có rất nhiều thư mục nhỏ cũng gây tải dù không có tệp lớn. Cần giới hạn số entry đã thăm và độ sâu, ngoài giới hạn byte đọc. read_dir có thể thành công nhưng một entry cụ thể vẫn lỗi; chọn chính sách dừng hoặc báo lỗi từng mục. Symlink_metadata giúp phân biệt link, song kiểm tra đường dẫn rồi mở tệp vẫn có khả năng race nếu một đối tượng khác sửa cây cùng lúc. Lab dành cho thư mục cục bộ người dùng sở hữu; sản phẩm chống đối tượng thù địch cần API mở theo handle và chính sách nền tảng chặt hơn."
        },
        {
          "title": "Giữ kết quả và UI có giới hạn",
          "text": "Đừng đưa toàn bộ dòng khớp vào một Vec không giới hạn rồi gửi qua IPC. Engine có max_matches, max_file_bytes và max_entries; khi đạt ngưỡng, kết quả có trạng thái truncated để người dùng hiểu vì sao danh sách ngắn hơn dự kiến. Tách việc tìm kiếm khỏi render bằng một API trả batch hoặc channel có giới hạn. Khi người dùng thay từ khóa, dùng generation và hủy hợp tác của chương này. Bài tải xuống có CLI để chạy engine không cần cửa sổ; bạn tích hợp nó vào command của ứng dụng Tauri trong mốc tiếp theo.",
          "code": "fn keep_matches(lines:&[&str],query:&str,limit:usize)->Vec<String>{lines.iter().filter(|line|line.contains(query)).take(limit).map(|line|(*line).to_owned()).collect()}"
        },
        {
          "title": "Nghiệm thu bằng dữ liệu do mình tạo",
          "text": "Bộ test tạo cây tệp tạm với Unicode, tệp rỗng, tệp quá lớn, thư mục lồng và symlink trên Unix. Test không quét thư mục cá nhân. Hãy thêm một fixture có rất nhiều dòng khớp để chứng minh giới hạn được tôn trọng. Báo cáo phải ghi số entry đã thăm, số tệp bị bỏ qua, tổng byte đọc và thời gian; đo lại với cùng dữ liệu sau khi đổi thuật toán. Sản phẩm hoàn thành có thể tìm một kho ghi chú thật nhưng vẫn phản hồi khi hủy. Một benchmark nhanh trên một tệp nhỏ chưa chứng minh trải nghiệm tốt với cây thư mục lớn."
        }
      ],
      "tip": "Ngân sách cần bao trùm số entry, độ sâu, byte đọc và số kết quả; từng giới hạn xử lý một nguồn tiêu thụ tài nguyên khác nhau.",
      "exercise": {
        "title": "Dự án 2: bộ tìm kiếm tệp có ngân sách tài nguyên — thực hành",
        "instructions": "Hoàn thành hàm theo hợp đồng trong mã mẫu. Giữ nguyên các assertion và thêm ít nhất một trường hợp biên của riêng bạn.",
        "requirements": [
          "Đạt tất cả assertion trong main.",
          "Không bỏ dữ liệu hay dùng panic để thay lỗi nghiệp vụ.",
          "Giữ đúng kết quả mong đợi."
        ]
      },
      "starterCode": "fn keep_matches(lines:&[&str],query:&str,limit:usize)->Vec<String>{todo!()}\nfn main(){assert_eq!(keep_matches(&[\"Rust hay\",\"khác\",\"Rust an toàn\"],\"Rust\",1),vec![\"Rust hay\"]);assert!(keep_matches(&[\"Rust\"],\"Rust\",0).is_empty());assert_eq!(keep_matches(&[\"Mình học Rust\"],\"Rust\",9),vec![\"Mình học Rust\"]);\nprintln!(\"Kết quả giữ nội dung gốc\");}\n",
      "solutionCode": "fn keep_matches(lines:&[&str],query:&str,limit:usize)->Vec<String>{lines.iter().filter(|line|line.contains(query)).take(limit).map(|line|(*line).to_owned()).collect()}\nfn main(){assert_eq!(keep_matches(&[\"Rust hay\",\"khác\",\"Rust an toàn\"],\"Rust\",1),vec![\"Rust hay\"]);assert!(keep_matches(&[\"Rust\"],\"Rust\",0).is_empty());assert_eq!(keep_matches(&[\"Mình học Rust\"],\"Rust\",9),vec![\"Mình học Rust\"]);\nprintln!(\"Kết quả giữ nội dung gốc\");}\n",
      "expectedOutput": "Kết quả giữ nội dung gốc",
      "hints": [
        "Xác định các trường hợp phải từ chối trước khi cập nhật trạng thái.",
        "Dùng Result, checked arithmetic và giới hạn được nêu trong bài."
      ],
      "quiz": {
        "question": "Vì sao giới hạn kích thước từng tệp chưa đủ cho một engine duyệt cây thư mục?",
        "options": ["Vì số entry và độ sâu vẫn có thể rất lớn dù mỗi tệp nhỏ.", "Vì tên tệp luôn lớn hơn nội dung.", "Vì Rust bỏ qua mọi giới hạn byte."],
        "correct": 0,
        "explanation": "Ngân sách cần bao trùm số entry, độ sâu, byte đọc và số kết quả; từng giới hạn xử lý một nguồn tiêu thụ tài nguyên khác nhau."
      },
      "reference": {
        "label": "Nguồn biên soạn chính thức",
        "url": "https://doc.rust-lang.org/std/fs/fn.read_dir.html"
      },
      "localLab": {
        "title": "Engine tìm kiếm thư mục với CLI kiểm chứng",
        "instructions": "Bộ mã gồm engine dùng PathBuf, ngân sách entry/byte/độ sâu/kết quả và CLI để chạy trên thư mục bạn chủ động chọn. Engine không đi theo symlink. Đây là lõi desktop dùng lại được trong command; mốc dự án yêu cầu bổ sung giao diện, cancellation và đo byte đọc. Test chỉ tạo fixture tạm.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname=\"desktop_search_project\"\nversion=\"0.1.0\"\nedition=\"2024\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::{fs,io::Read,path::{Path,PathBuf}};\n#[derive(Debug,Clone,PartialEq,Eq)]pub struct Hit{pub path:PathBuf,pub line:usize,pub text:String}\n#[derive(Debug)]pub struct Report{pub hits:Vec<Hit>,pub truncated:bool,pub visited:usize}\n#[derive(Debug,Clone,Copy)]pub struct Budget{pub entries:usize,pub file_bytes:usize,pub matches:usize,pub depth:usize}\npub fn search(root:&Path,query:&str,budget:Budget)->Result<Report,String>{\n if query.is_empty(){return Err(\"empty-query\".into())}if !root.is_dir(){return Err(\"not-directory\".into())}\n let mut stack=vec![(root.to_path_buf(),0usize)];let mut seen=0;let mut hits=Vec::new();let mut truncated=false;\n while let Some((directory,depth))=stack.pop(){\n  let mut entries=fs::read_dir(&directory).map_err(|_|\"read-dir\")?.collect::<Result<Vec<_>,_>>().map_err(|_|\"entry\")?;\n  entries.sort_by_key(|e|e.file_name());\n  for entry in entries{\n   seen+=1;if seen>budget.entries{return Err(\"entry-budget\".into())}\n   let path=entry.path();let meta=fs::symlink_metadata(&path).map_err(|_|\"metadata\")?;\n   if meta.file_type().is_symlink(){continue}\n   if meta.is_dir(){if depth<budget.depth{stack.push((path,depth+1));}else{truncated=true;}continue}\n   if !meta.is_file()||meta.len()>budget.file_bytes as u64{continue}\n   let file=fs::File::open(&path).map_err(|_|\"open\")?;let mut bytes=Vec::new();\n   file.take(budget.file_bytes.saturating_add(1) as u64).read_to_end(&mut bytes).map_err(|_|\"read\")?;\n   if bytes.len()>budget.file_bytes{continue}\n   let Ok(text)=String::from_utf8(bytes) else{continue};\n   for (line,text) in text.lines().enumerate(){\n    if text.contains(query){if hits.len()==budget.matches{return Ok(Report{hits,truncated:true,visited:seen})}hits.push(Hit{path:path.strip_prefix(root).map_err(|_|\"root\")?.to_path_buf(),line:line+1,text:text.into()});}\n   }\n  }\n }\n Ok(Report{hits,truncated,visited:seen})\n}\n#[cfg(test)]mod tests{\n use super::*;use std::sync::atomic::{AtomicU64,Ordering};static ID:AtomicU64=AtomicU64::new(0);\n struct Temp(PathBuf);impl Temp{fn new()->Self{let p=std::env::temp_dir().join(format!(\"rust-search-{}-{}\",std::process::id(),ID.fetch_add(1,Ordering::Relaxed)));fs::create_dir_all(&p).unwrap();Self(p)}}impl Drop for Temp{fn drop(&mut self){let _=fs::remove_dir_all(&self.0);}}\n fn budget()->Budget{Budget{entries:100,file_bytes:1024,matches:20,depth:8}}\n #[test]fn unicode_original_and_lines(){let t=Temp::new();fs::write(t.0.join(\"ghi-chu.txt\"),\"khác\\nMình học Rust\\n\").unwrap();let h=search(&t.0,\"Rust\",budget()).unwrap().hits;assert_eq!(h.len(),1);assert_eq!(h[0].line,2);assert_eq!(h[0].text,\"Mình học Rust\");}\n #[test]fn limits(){let t=Temp::new();fs::write(t.0.join(\"a\"),\"Rust\\nRust\\n\").unwrap();let mut b=budget();b.matches=1;assert_eq!(search(&t.0,\"Rust\",b).unwrap().hits.len(),1);b.entries=0;assert_eq!(search(&t.0,\"Rust\",b).unwrap_err(),\"entry-budget\");}\n #[test]fn oversized_and_empty_query(){let t=Temp::new();fs::write(t.0.join(\"large\"),\"Rust\".repeat(1000)).unwrap();assert!(search(&t.0,\"Rust\",budget()).unwrap().hits.is_empty());assert_eq!(search(&t.0,\"\",budget()).unwrap_err(),\"empty-query\");}\n #[cfg(unix)]#[test]fn no_symlink_traversal(){let t=Temp::new();let outside=Temp::new();fs::write(outside.0.join(\"secret\"),\"Rust\").unwrap();std::os::unix::fs::symlink(&outside.0,t.0.join(\"link\")).unwrap();assert!(search(&t.0,\"Rust\",budget()).unwrap().hits.is_empty());}\n}"
          },
          {
            "path": "src/main.rs",
            "content": "use desktop_search_project::{search,Budget};use std::path::Path;\nfn main(){let args:Vec<_>=std::env::args_os().collect();if args.len()!=3{eprintln!(\"Dùng: desktop_search_project THU_MUC TU_KHOA\");std::process::exit(2)}let Some(query)=args[2].to_str()else{eprintln!(\"Từ khóa cần UTF-8\");std::process::exit(2)};match search(Path::new(&args[1]),query,Budget{entries:5000,file_bytes:2*1024*1024,matches:100,depth:16}){Ok(report)=>{for hit in report.hits{println!(\"{}:{}:{}\",hit.path.display(),hit.line,hit.text)}eprintln!(\"Đã thăm {} mục; giới hạn: {}\",report.visited,report.truncated)},Err(error)=>{eprintln!(\"{error}\");std::process::exit(1)}}}\n"
          },
          {
            "path": "fixtures/notes.txt",
            "content": "Mình học Rust\nOwnership giúp quản lý dữ liệu\nRust trong ứng dụng desktop\n"
          },
          {
            "path": "README.md",
            "content": "# Tìm kiếm workspace\n\n`cargo run -- fixtures Rust` tìm nội dung mẫu. Kết quả có đường dẫn tương đối, số dòng và văn bản gốc. `Report.truncated` báo giới hạn kết quả/độ sâu; lỗi đọc cây hoặc vượt ngân sách entry dừng với lỗi, không giả vờ có kết quả đầy đủ.\n\nBài mở rộng: worker hủy hợp tác, generation, IPC batch, UI có bàn phím và thống kê tổng byte. Chỉ kiểm chứng trên cây người dùng sở hữu; kiểm tra symlink rồi mở theo path không là sandbox chống đối tượng đổi tệp đồng thời.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run -- fixtures Rust"
        ],
        "checks": [
          "Kết quả có số dòng và nguyên văn Unicode.",
          "Giới hạn entry và kích thước tệp được kiểm chứng bằng fixture.",
          "Symlink không được duyệt; kết quả bị giới hạn có trạng thái tương ứng.",
          "Tích hợp vào giao diện và chứng minh kết quả tác vụ cũ không ghi đè tác vụ mới."
        ]
      }
    },
    {
      "id": "desktop-multiwindow",
      "moduleId": "track-desktop",
      "title": "Nhiều cửa sổ và một nguồn trạng thái",
      "description": "Đồng bộ nhiều WebView bằng revision và thông báo, tránh biến event thành cơ sở dữ liệu không đáng tin.",
      "duration": 45,
      "objectives": [
        "Đồng bộ nhiều WebView bằng revision và thông báo, tránh biến event thành cơ sở dữ liệu không đáng tin.",
        "Giải thích điều kiện đúng và trường hợp thất bại trước khi đổi mã.",
        "Kiểm chứng bằng bài tập, test biên và bằng chứng trong dự án."
      ],
      "sections": [
        {
          "title": "Cửa sổ là một góc nhìn",
          "text": "Hai cửa sổ mở cùng tài liệu có thể giữ hai bản nháp khác nhau. Rust nên sở hữu trạng thái đã commit; mỗi cửa sổ giữ revision đã đọc và bản nháp của nó. Khi cửa sổ A lưu thành công, backend phát thông báo tài liệu đổi revision. Cửa sổ B không có thay đổi cục bộ có thể tải snapshot mới. Nếu B đang bẩn, nó phải giữ bản nháp và báo xung đột để người dùng quyết định. Việc nhận event không đồng nghĩa được phép ghi đè những gì người dùng đang gõ."
        },
        {
          "title": "Event thông báo, command xác nhận",
          "text": "Event thường không có ngữ nghĩa lưu trữ bền vững hoặc phát lại sau khi listener được đăng ký muộn. Do đó dùng event như tín hiệu cần kiểm tra, còn command đọc snapshot là nguồn xác nhận. Khi mở cửa sổ, đăng ký listener và đọc trạng thái theo một trình tự có kiểm tra revision; nếu nhận event trong lúc đọc, so sánh số revision rồi đọc lại khi cần. Cách này chịu được event trùng hoặc đảo thứ tự tốt hơn việc cộng trừ trực tiếp dữ liệu trên mỗi thông điệp. Tránh broadcast nội dung tài liệu nhạy cảm cho mọi cửa sổ nếu chỉ cần báo định danh thay đổi."
        },
        {
          "title": "Giới hạn quyền theo vai trò cửa sổ",
          "text": "Một cửa sổ xem trước chỉ cần đọc và một cửa sổ cài đặt có quyền khác trình biên tập chính. Gán capability theo label cửa sổ hoặc WebView đúng phạm vi. Nhiều capability áp dụng cùng lúc có thể cộng quyền; chia file không tự tạo ra một cơ chế deny toàn cục. Ngoài lớp quyền IPC, handler phải kiểm tra tài liệu được yêu cầu có thuộc phiên làm việc hiện hành không. Đừng tin một document_id chỉ vì nó đến từ cửa sổ có quyền gọi command. Thiết kế API nhỏ giúp bạn kiểm kê và kiểm thử từng quyền.",
          "code": "fn should_refresh(current:u64,incoming:u64,dirty:bool)->bool{incoming>current&&!dirty}"
        },
        {
          "title": "Thử những thời điểm dễ mất đồng bộ",
          "text": "Mở hai cửa sổ, sửa cùng revision và cho cả hai lưu. Một cửa sổ thành công, cửa sổ còn lại nhận conflict và giữ bản nháp. Đóng một cửa sổ khi request đang chạy; cập nhật backend vẫn phải có kết quả xác định, còn listener của cửa sổ đóng phải được giải phóng. Gửi event revision thấp hơn giá trị đã nhận và xác nhận UI không đi lùi. Bài tập mô hình hóa quy tắc chấp nhận revision. Khi triển khai, thêm test reload một WebView giữa chừng để chứng minh nó có thể phục hồi chỉ bằng command đọc trạng thái."
        }
      ],
      "tip": "Thông báo không cấp quyền bỏ dữ liệu chưa lưu. UI cần tách revision đã lưu với bản nháp và hỗ trợ giải quyết xung đột.",
      "exercise": {
        "title": "Nhiều cửa sổ và một nguồn trạng thái — thực hành",
        "instructions": "Hoàn thành hàm theo hợp đồng trong mã mẫu. Giữ nguyên các assertion và thêm ít nhất một trường hợp biên của riêng bạn.",
        "requirements": [
          "Đạt tất cả assertion trong main.",
          "Không bỏ dữ liệu hay dùng panic để thay lỗi nghiệp vụ.",
          "Giữ đúng kết quả mong đợi."
        ]
      },
      "starterCode": "fn should_refresh(current:u64,incoming:u64,dirty:bool)->bool{todo!()}\nfn main(){assert!(should_refresh(4,5,false));assert!(!should_refresh(4,5,true));assert!(!should_refresh(5,4,false));assert!(!should_refresh(5,5,false));\nprintln!(\"Cửa sổ không ghi đè bản nháp\");}\n",
      "solutionCode": "fn should_refresh(current:u64,incoming:u64,dirty:bool)->bool{incoming>current&&!dirty}\nfn main(){assert!(should_refresh(4,5,false));assert!(!should_refresh(4,5,true));assert!(!should_refresh(5,4,false));assert!(!should_refresh(5,5,false));\nprintln!(\"Cửa sổ không ghi đè bản nháp\");}\n",
      "expectedOutput": "Cửa sổ không ghi đè bản nháp",
      "hints": [
        "Xác định các trường hợp phải từ chối trước khi cập nhật trạng thái.",
        "Dùng Result, checked arithmetic và giới hạn được nêu trong bài."
      ],
      "quiz": {
        "question": "Event báo revision mới đến khi cửa sổ đang có bản nháp. Cách xử lý phù hợp là gì?",
        "options": ["Ghi đè bản nháp ngay.", "Bỏ luôn mọi event về tài liệu đó.", "Giữ bản nháp và cho phép so sánh với snapshot mới."],
        "correct": 2,
        "explanation": "Thông báo không cấp quyền bỏ dữ liệu chưa lưu. UI cần tách revision đã lưu với bản nháp và hỗ trợ giải quyết xung đột."
      },
      "reference": {
        "label": "Nguồn biên soạn chính thức",
        "url": "https://v2.tauri.app/learn/security/capabilities-for-windows-and-platforms/"
      }
    },
    {
      "id": "desktop-preview",
      "moduleId": "track-desktop",
      "title": "Xem trước nội dung và ranh giới tin cậy",
      "description": "Hiển thị văn bản, Markdown và dữ liệu nhập vào mà không trao quyền hệ thống cho nội dung.",
      "duration": 45,
      "objectives": [
        "Hiển thị văn bản, Markdown và dữ liệu nhập vào mà không trao quyền hệ thống cho nội dung.",
        "Giải thích điều kiện đúng và trường hợp thất bại trước khi đổi mã.",
        "Kiểm chứng bằng bài tập, test biên và bằng chứng trong dự án."
      ],
      "sections": [
        {
          "title": "Nội dung tài liệu không phải mã giao diện",
          "text": "Một ứng dụng ghi chú có thể mở tệp từ nhiều nguồn, nhưng nội dung tệp không được tự trở thành JavaScript của ứng dụng. Với văn bản thuần, dùng textContent hoặc giá trị textarea. Nếu thêm Markdown, xác định có cho phép HTML thô không, liên kết nào được mở và hình ảnh nào được tải. Một nút xem trước không nên khiến ứng dụng gửi request tùy ý ra mạng mà người dùng không biết. Tách dữ liệu người dùng khỏi template giao diện ngay từ đầu giúp giảm số nơi cần lọc sau này."
        },
        {
          "title": "CSP và capability có nhiệm vụ khác nhau",
          "text": "CSP hạn chế nguồn script, kết nối, style và tài nguyên trong WebView. Capability kiểm soát quyền gọi lệnh IPC. Hai lớp này hỗ trợ nhau nhưng không thay thế kiểm tra đầu vào. Một handler đọc tệp theo đường dẫn tùy ý vẫn có thể gây vấn đề dù CSP chặt, nếu command đó được cấp quyền và dữ liệu đầu vào không được ràng buộc. Cửa sổ preview nên có quyền nhỏ nhất và không nhận command ghi. Khi ứng dụng cần hiển thị tài nguyên cục bộ, phạm vi asset phải gắn với thư mục được phép, không mở toàn bộ hệ thống tệp."
        },
        {
          "title": "Liên kết và tên tệp cần ngữ nghĩa",
          "text": "Một chuỗi trông như đường dẫn có thể chứa dấu phân cách hoặc scheme bất ngờ. Định nghĩa danh sách scheme và hành vi mở bằng API phù hợp thay vì ghép chuỗi vào shell. Đối với tên tệp hiển thị, giữ nguyên Unicode nhưng loại ký tự điều khiển nếu nơi hiển thị không thể diễn đạt chúng rõ. HTML escaping chỉ dùng cho ngữ cảnh HTML; nó không làm một URL hay câu lệnh shell trở nên an toàn. Bài tập ở đây luyện encoding ký tự khi tạo đoạn HTML mẫu, đồng thời chỉ ra rằng dùng DOM textContent sẽ tránh phải tự ghép HTML trong trường hợp văn bản thuần.",
          "code": "fn escape_html(s:&str)->String{let mut out=String::new();for c in s.chars(){match c{'&'=>out.push_str(\"&amp;\"),'<'=>out.push_str(\"&lt;\"),'>'=>out.push_str(\"&gt;\"),'\"'=>out.push_str(\"&quot;\"),_=>out.push(c)}}out}"
        },
        {
          "title": "Kiểm thử phần xem trước như một tính năng",
          "text": "Tạo fixture có dấu nhỏ hơn, dấu ngoặc kép, ampersand, đường dẫn dài và một đoạn HTML có script dưới dạng văn bản. Xác nhận nội dung được hiển thị đúng mà không thực thi. Với Markdown, kiểm tra ảnh từ xa, liên kết không cho phép và lỗi parser; kết quả lỗi phải giữ nguyên tài liệu gốc. Dùng bàn phím để đi giữa editor và preview, kiểm tra tiêu đề và thứ tự focus. Nghiệm thu cần bao gồm cả tính đúng đắn nội dung lẫn quyền hệ thống: preview không được lưu hoặc đọc một tài liệu ngoài phiên làm việc chỉ vì nội dung có một liên kết."
        }
      ],
      "tip": "Encoding HTML chỉ phục vụ cú pháp HTML. Shell cần truyền argument riêng và thường nên tránh shell hoàn toàn cho thao tác tệp.",
      "exercise": {
        "title": "Xem trước nội dung và ranh giới tin cậy — thực hành",
        "instructions": "Hoàn thành hàm theo hợp đồng trong mã mẫu. Giữ nguyên các assertion và thêm ít nhất một trường hợp biên của riêng bạn.",
        "requirements": [
          "Đạt tất cả assertion trong main.",
          "Không bỏ dữ liệu hay dùng panic để thay lỗi nghiệp vụ.",
          "Giữ đúng kết quả mong đợi."
        ]
      },
      "starterCode": "fn escape_html(s:&str)->String{todo!()}\nfn main(){assert_eq!(escape_html(\"<b>&\"),\"&lt;b&gt;&amp;\");assert_eq!(escape_html(\"Mình học Rust\"),\"Mình học Rust\");assert_eq!(escape_html(\"\\\"\"),\"&quot;\");\nprintln!(\"Nội dung vẫn là dữ liệu\");}\n",
      "solutionCode": "fn escape_html(s:&str)->String{let mut out=String::new();for c in s.chars(){match c{'&'=>out.push_str(\"&amp;\"),'<'=>out.push_str(\"&lt;\"),'>'=>out.push_str(\"&gt;\"),'\"'=>out.push_str(\"&quot;\"),_=>out.push(c)}}out}\nfn main(){assert_eq!(escape_html(\"<b>&\"),\"&lt;b&gt;&amp;\");assert_eq!(escape_html(\"Mình học Rust\"),\"Mình học Rust\");assert_eq!(escape_html(\"\\\"\"),\"&quot;\");\nprintln!(\"Nội dung vẫn là dữ liệu\");}\n",
      "expectedOutput": "Nội dung vẫn là dữ liệu",
      "hints": [
        "Xác định các trường hợp phải từ chối trước khi cập nhật trạng thái.",
        "Dùng Result, checked arithmetic và giới hạn được nêu trong bài."
      ],
      "quiz": {
        "question": "HTML escaping có làm một đường dẫn ghép vào shell trở nên an toàn không?",
        "options": ["Không; mỗi ngữ cảnh cần cách truyền dữ liệu và kiểm tra riêng.", "Có vì mọi ký tự đặc biệt đã đổi.", "Có nếu chuỗi ngắn hơn 100 ký tự."],
        "correct": 0,
        "explanation": "Encoding HTML chỉ phục vụ cú pháp HTML. Shell cần truyền argument riêng và thường nên tránh shell hoàn toàn cho thao tác tệp."
      },
      "reference": {
        "label": "Nguồn biên soạn chính thức",
        "url": "https://v2.tauri.app/security/csp/"
      }
    },
    {
      "id": "desktop-schema-migration",
      "moduleId": "track-desktop",
      "title": "Schema lưu trữ và nâng cấp dữ liệu người dùng",
      "description": "Chuyển snapshot giữa các phiên bản, giữ bản cũ khi lỗi và kiểm thử cả đường nâng cấp lẫn giới hạn rollback.",
      "duration": 45,
      "objectives": [
        "Chuyển snapshot giữa các phiên bản, giữ bản cũ khi lỗi và kiểm thử cả đường nâng cấp lẫn giới hạn rollback.",
        "Giải thích điều kiện đúng và trường hợp thất bại trước khi đổi mã.",
        "Kiểm chứng bằng bài tập, test biên và bằng chứng trong dự án."
      ],
      "sections": [
        {
          "title": "Phiên bản ứng dụng khác phiên bản dữ liệu",
          "text": "Một phiên bản ứng dụng có thể đọc nhiều schema dữ liệu; ngược lại không phải mọi bản cũ đều hiểu dữ liệu do bản mới ghi. Đặt schema_version trong snapshot và định nghĩa mỗi bước chuyển đổi. Không đoán schema bằng cách nhìn một trường có tồn tại hay không khi hai phiên bản có ngữ nghĩa khác nhau. Khi gặp phiên bản chưa biết, dừng ghi và giữ nguyên byte nguồn để người dùng có thể mở bằng phiên bản phù hợp. Một giá trị mặc định được chèn âm thầm có thể biến dữ liệu chưa hiểu thành dữ liệu hợp lệ giả."
        },
        {
          "title": "Chuyển đổi phải có đầu vào và đầu ra rõ",
          "text": "Viết hàm từ Version1 sang Version2 với kiểu riêng. Kiểm tra bất biến của dữ liệu cũ, chuyển trường rồi kiểm tra bất biến của dữ liệu mới trước khi công bố. Ví dụ thêm revision mặc định bằng 0 chỉ hợp lý khi Version1 chưa có sửa đồng thời. Nếu tách một trường tên thành nhiều trường, phải mô tả trường hợp không thể tách chính xác và giữ dữ liệu gốc khi cần. Migration không nên gửi mạng hoặc phụ thuộc đồng hồ để kết quả có thể lặp lại trên fixture và trong báo cáo sự cố."
        },
        {
          "title": "Backup và công bố sau chuyển đổi",
          "text": "Trước khi đổi snapshot trên đĩa, giữ một bản sao có tên hoặc metadata gắn với phiên bản. Ghi bản mới vào tệp tạm, validate lại rồi công bố theo quy trình lưu của chương trước. Nếu migration thất bại, ứng dụng phải mở chế độ phục hồi hoặc báo rõ dữ liệu chưa được đổi, không tạo snapshot trắng đè lên nguồn. Chính sách dọn backup cần giới hạn dung lượng và giữ đủ thông tin để người dùng hiểu. Rollback mã ứng dụng không tự kéo dữ liệu về schema cũ; bạn cần converter ngược hoặc quy trình khôi phục backup đã kiểm chứng.",
          "code": "fn migrate(version:u8,items:u32)->Result<(u8,u32),&'static str>{match version{1=>Ok((2,items)),2=>Ok((2,items)),_=>Err(\"unsupported\")}}"
        },
        {
          "title": "Tập fixture là hợp đồng dài hạn",
          "text": "Lưu fixture nhỏ cho từng schema được hỗ trợ, bao gồm Unicode, trường tùy chọn, giá trị biên và dữ liệu sai. Test đọc fixture cũ bằng phiên bản mới rồi so sánh ý nghĩa, không chỉ chuỗi JSON. Thêm test chạy migration hai lần ở lớp điều phối để tránh chuyển đổi lặp. Bài tập mô hình hóa bước tăng schema với kiểm tra phiên bản và overflow. Khi làm dự án, phải mở lại dữ liệu sau migration bằng cùng đường đọc mà ứng dụng dùng; một test trực tiếp trên hàm chuyển đổi chưa kiểm tra được bước ghi, rename và khởi động lại."
        }
      ],
      "tip": "Không hiểu schema nghĩa là không biết bất biến dữ liệu. Giữ nguyên nguồn tránh mất thông tin do ghi lại sai.",
      "exercise": {
        "title": "Schema lưu trữ và nâng cấp dữ liệu người dùng — thực hành",
        "instructions": "Hoàn thành hàm theo hợp đồng trong mã mẫu. Giữ nguyên các assertion và thêm ít nhất một trường hợp biên của riêng bạn.",
        "requirements": [
          "Đạt tất cả assertion trong main.",
          "Không bỏ dữ liệu hay dùng panic để thay lỗi nghiệp vụ.",
          "Giữ đúng kết quả mong đợi."
        ]
      },
      "starterCode": "fn migrate(version:u8,items:u32)->Result<(u8,u32),&'static str>{todo!()}\nfn main(){assert_eq!(migrate(1,7),Ok((2,7)));assert_eq!(migrate(2,7),Ok((2,7)));assert_eq!(migrate(3,7),Err(\"unsupported\"));assert_eq!(migrate(1,0),Ok((2,0)));\nprintln!(\"Nâng cấp giữ dữ liệu gốc\");}\n",
      "solutionCode": "fn migrate(version:u8,items:u32)->Result<(u8,u32),&'static str>{match version{1=>Ok((2,items)),2=>Ok((2,items)),_=>Err(\"unsupported\")}}\nfn main(){assert_eq!(migrate(1,7),Ok((2,7)));assert_eq!(migrate(2,7),Ok((2,7)));assert_eq!(migrate(3,7),Err(\"unsupported\"));assert_eq!(migrate(1,0),Ok((2,0)));\nprintln!(\"Nâng cấp giữ dữ liệu gốc\");}\n",
      "expectedOutput": "Nâng cấp giữ dữ liệu gốc",
      "hints": [
        "Xác định các trường hợp phải từ chối trước khi cập nhật trạng thái.",
        "Dùng Result, checked arithmetic và giới hạn được nêu trong bài."
      ],
      "quiz": {
        "question": "Ứng dụng gặp schema mới hơn nó biết. Hành vi an toàn cho dữ liệu là gì?",
        "options": ["Tạo dữ liệu rỗng để ứng dụng vẫn mở.", "Dừng ghi, giữ bản nguồn và yêu cầu phiên bản hỗ trợ.", "Xóa các trường không hiểu rồi lưu lại."],
        "correct": 1,
        "explanation": "Không hiểu schema nghĩa là không biết bất biến dữ liệu. Giữ nguyên nguồn tránh mất thông tin do ghi lại sai."
      },
      "reference": {
        "label": "Nguồn biên soạn chính thức",
        "url": "https://serde.rs/enum-representations.html"
      }
    },
    {
      "id": "desktop-upgrade-policy",
      "moduleId": "track-desktop",
      "title": "Cập nhật ứng dụng, tương thích và kế hoạch phục hồi",
      "description": "Tách kiểm tra bản mới, xác minh artifact, chuyển dữ liệu và khởi động lại thành các bước có thể kiểm chứng.",
      "duration": 45,
      "objectives": [
        "Tách kiểm tra bản mới, xác minh artifact, chuyển dữ liệu và khởi động lại thành các bước có thể kiểm chứng.",
        "Giải thích điều kiện đúng và trường hợp thất bại trước khi đổi mã.",
        "Kiểm chứng bằng bài tập, test biên và bằng chứng trong dự án."
      ],
      "sections": [
        {
          "title": "Bản cập nhật có nhiều phần độc lập",
          "text": "Một bản desktop gồm executable, tài nguyên giao diện, thư viện và đôi khi schema dữ liệu. Cập nhật thành công không chỉ là tải xong một tệp. Hãy tách kiểm tra metadata, chọn artifact đúng hệ điều hành và kiến trúc, xác minh tính toàn vẹn và chữ ký, cài đặt rồi khởi động lại. Kênh stable và thử nghiệm có chính sách riêng để người dùng không nhận nhầm bản chưa nghiệm thu. So sánh phiên bản bằng quy tắc được định nghĩa; so sánh chuỗi thông thường sẽ xử lý sai những giá trị như 1.10 và 1.9."
        },
        {
          "title": "Quyền tin cậy không đến từ tên phiên bản",
          "text": "Một số version cao hơn không chứng minh artifact đến từ nhà phát hành. HTTPS bảo vệ đường truyền còn chữ ký bản cập nhật gắn artifact với khóa tin cậy của ứng dụng. Khóa ký thuộc quy trình phát hành, không đưa vào frontend hoặc lab. Phải mô tả cách đổi khóa và ứng phó khi một release có lỗi. Kiểm tra checksum giúp phát hiện thay đổi byte nhưng chỉ có giá trị tin cậy nếu chính checksum được xác thực. Trong bài, chúng ta dùng metadata mẫu để học chính sách lựa chọn; không tạo hoặc sử dụng chứng chỉ ký thật."
        },
        {
          "title": "Lưu dữ liệu trước khi khởi động lại",
          "text": "Ứng dụng cần biết có tài liệu bẩn hoặc tác vụ đang commit trước khi cài và restart. Có thể tải bản cập nhật ở nền, nhưng thời điểm áp dụng phải phối hợp với trạng thái người học. Cho phép trì hoãn và giải thích phần việc chưa lưu bằng thông báo ngắn đúng lúc. Nếu release mới đổi schema, kế hoạch phục hồi phải bao gồm dữ liệu. Đừng hứa nút quay lại phiên bản trước sẽ hoạt động nếu bản mới đã ghi một schema mà bản cũ không hiểu. Giữ fixture và backup phục vụ cả test nâng cấp lẫn diễn tập rollback.",
          "code": "fn upgrade(current:(u16,u16,u16),candidate:(u16,u16,u16),trusted:bool,same_channel:bool)->bool{trusted&&same_channel&&candidate>current}"
        },
        {
          "title": "Ma trận phát hành và kiểm thử thực tế",
          "text": "Ghi rõ artifact cho macOS arm64, macOS x86_64, Windows và Linux mà dự án thực sự hỗ trợ. Một build trên Mac không xác nhận mọi nền tảng khác. Kiểm thử bản đóng gói từ thư mục cài đặt thật, không chỉ cargo run, để bắt lỗi đường dẫn asset và quyền. Chạy các ca tải lỗi, artifact sai nền tảng, phiên bản bị chặn, thiếu dung lượng và restart khi còn bản nháp. Bàn giao manifest mẫu, hướng dẫn xác minh, release notes và quyết định rollback dữ liệu. Bài tập chỉ chấp nhận phiên bản hợp lệ trên cùng kênh, giúp làm rõ chính sách trước khi nối cơ chế cập nhật."
        }
      ],
      "tip": "Checksum và artifact có thể cùng bị thay. Nguồn checksum hoặc chữ ký phải được xác thực để thiết lập tin cậy.",
      "exercise": {
        "title": "Cập nhật ứng dụng, tương thích và kế hoạch phục hồi — thực hành",
        "instructions": "Hoàn thành hàm theo hợp đồng trong mã mẫu. Giữ nguyên các assertion và thêm ít nhất một trường hợp biên của riêng bạn.",
        "requirements": [
          "Đạt tất cả assertion trong main.",
          "Không bỏ dữ liệu hay dùng panic để thay lỗi nghiệp vụ.",
          "Giữ đúng kết quả mong đợi."
        ]
      },
      "starterCode": "fn upgrade(current:(u16,u16,u16),candidate:(u16,u16,u16),trusted:bool,same_channel:bool)->bool{todo!()}\nfn main(){assert!(upgrade((1,9,0),(1,10,0),true,true));assert!(!upgrade((1,9,0),(1,10,0),false,true));assert!(!upgrade((1,9,0),(1,10,0),true,false));assert!(!upgrade((2,0,0),(1,99,0),true,true));\nprintln!(\"Chỉ nhận cập nhật phù hợp\");}\n",
      "solutionCode": "fn upgrade(current:(u16,u16,u16),candidate:(u16,u16,u16),trusted:bool,same_channel:bool)->bool{trusted&&same_channel&&candidate>current}\nfn main(){assert!(upgrade((1,9,0),(1,10,0),true,true));assert!(!upgrade((1,9,0),(1,10,0),false,true));assert!(!upgrade((1,9,0),(1,10,0),true,false));assert!(!upgrade((2,0,0),(1,99,0),true,true));\nprintln!(\"Chỉ nhận cập nhật phù hợp\");}\n",
      "expectedOutput": "Chỉ nhận cập nhật phù hợp",
      "hints": [
        "Xác định các trường hợp phải từ chối trước khi cập nhật trạng thái.",
        "Dùng Result, checked arithmetic và giới hạn được nêu trong bài."
      ],
      "quiz": {
        "question": "Có checksum tải cùng artifact nhưng metadata chưa được xác thực. Điều đó chứng minh điều gì?",
        "options": ["Chỉ kiểm tra được byte theo checksum đã nhận, chưa xác nhận nguồn tin cậy.", "Chắc chắn artifact của nhà phát hành.", "Đủ để bỏ chữ ký cập nhật."],
        "correct": 0,
        "explanation": "Checksum và artifact có thể cùng bị thay. Nguồn checksum hoặc chữ ký phải được xác thực để thiết lập tin cậy."
      },
      "reference": {
        "label": "Nguồn biên soạn chính thức",
        "url": "https://v2.tauri.app/plugin/updater/"
      }
    },
    {
      "id": "desktop-measurement",
      "moduleId": "track-desktop",
      "title": "Đo hiệu năng, quan sát lỗi và khả năng tiếp cận",
      "description": "Đặt ngân sách phản hồi và bộ nhớ, đo đường đi IPC, kiểm tra bàn phím và tạo báo cáo lỗi hữu ích.",
      "duration": 45,
      "objectives": [
        "Đặt ngân sách phản hồi và bộ nhớ, đo đường đi IPC, kiểm tra bàn phím và tạo báo cáo lỗi hữu ích.",
        "Giải thích điều kiện đúng và trường hợp thất bại trước khi đổi mã.",
        "Kiểm chứng bằng bài tập, test biên và bằng chứng trong dự án."
      ],
      "sections": [
        {
          "title": "Chọn phép đo gắn với hành vi người dùng",
          "text": "Đo thời gian khởi động đến khi có thể nhập, từ lúc nhấn tìm đến kết quả đầu, và từ lúc hủy đến khi worker ngừng nhận việc. Đây là các khoảng thời gian khác nhau. Một command có CPU nhanh vẫn có thể khiến ứng dụng chậm nếu serialize một mảng rất lớn hoặc render quá nhiều hàng. Đặt ngân sách trước khi tối ưu và ghi cấu hình máy, bản build, kích thước dữ liệu. Dùng release build cho so sánh hiệu năng, giữ debug build cho chẩn đoán; không lấy một lần chạy nóng làm kết luận chung."
        },
        {
          "title": "Quan sát đường đi qua các lớp",
          "text": "Mang operation_id qua UI, command, worker và repository để nối log của một thao tác. Log tên giai đoạn, thời lượng và mã kết quả; hạn chế ghi nội dung tài liệu hoặc đường dẫn riêng tư. Đối với một truy vấn tìm kiếm, các số hữu ích là entry đã thăm, byte đã đọc, số kết quả, số lần queue đầy và số lỗi quyền. Khi UI bị đứng, xác định có công việc blocking chạy trên luồng giao diện hay có quá nhiều event khiến render bị dồn. Đo trước giúp tránh sửa nhầm lớp."
        },
        {
          "title": "Khả năng tiếp cận là phần của nghiệm thu",
          "text": "Một ứng dụng desktop dùng WebView vẫn cần thứ tự focus, label cho điều khiển, trạng thái lỗi có thể đọc và lối dùng bằng bàn phím. Nút chỉ có icon cần tên rõ. Khi mở hộp thoại, đưa focus vào vùng phù hợp và trả về điều khiển đã mở nó khi đóng. Đừng chỉ đổi màu để báo lỗi; kết hợp thông điệp ngắn và trạng thái. Giảm chuyển động theo tùy chọn hệ thống và giữ độ tương phản trong giao diện sáng/tối. Kiểm tra nội dung dài và mức phóng to để không biến nút quan trọng thành phần bị cắt.",
          "code": "fn p95(values:&[u64])->Option<u64>{if values.is_empty(){return None};let mut v=values.to_vec();v.sort_unstable();let rank=(95*v.len()).div_ceil(100);Some(v[rank-1])}"
        },
        {
          "title": "Tạo hồ sơ sự cố có thể tái hiện",
          "text": "Báo cáo lỗi tốt gồm phiên bản ứng dụng, nền tảng, các bước thao tác, kết quả mong đợi và thực tế, cùng log đã loại dữ liệu nhạy cảm. Tạo một fixture nhỏ tái hiện lỗi rồi thêm regression test. Với memory leak, quan sát sau nhiều vòng mở/đóng tài liệu, không chỉ một ảnh chụp bộ nhớ. Với độ trễ, xem phân bố và giá trị đuôi thay vì trung bình. Bài tập tính percentile đơn giản trên số liệu mẫu; nó giúp hiểu cách đọc kết quả, còn dự án cần dùng bộ đo có cùng điều kiện và quy tắc warm-up rõ ràng."
        }
      ],
      "tip": "Trung bình có thể che những lượt rất chậm. Phân bố theo dữ liệu và giai đoạn cho biết điểm nghẽn thực tế.",
      "exercise": {
        "title": "Đo hiệu năng, quan sát lỗi và khả năng tiếp cận — thực hành",
        "instructions": "Hoàn thành hàm theo hợp đồng trong mã mẫu. Giữ nguyên các assertion và thêm ít nhất một trường hợp biên của riêng bạn.",
        "requirements": [
          "Đạt tất cả assertion trong main.",
          "Không bỏ dữ liệu hay dùng panic để thay lỗi nghiệp vụ.",
          "Giữ đúng kết quả mong đợi."
        ]
      },
      "starterCode": "fn p95(values:&[u64])->Option<u64>{todo!()}\nfn main(){assert_eq!(p95(&[]),None);assert_eq!(p95(&[5]),Some(5));assert_eq!(p95(&[1,2,3,100]),Some(100));\nprintln!(\"Đo cả độ trễ ở đuôi\");}\n",
      "solutionCode": "fn p95(values:&[u64])->Option<u64>{if values.is_empty(){return None};let mut v=values.to_vec();v.sort_unstable();let rank=(95*v.len()).div_ceil(100);Some(v[rank-1])}\nfn main(){assert_eq!(p95(&[]),None);assert_eq!(p95(&[5]),Some(5));assert_eq!(p95(&[1,2,3,100]),Some(100));\nprintln!(\"Đo cả độ trễ ở đuôi\");}\n",
      "expectedOutput": "Đo cả độ trễ ở đuôi",
      "hints": [
        "Xác định các trường hợp phải từ chối trước khi cập nhật trạng thái.",
        "Dùng Result, checked arithmetic và giới hạn được nêu trong bài."
      ],
      "quiz": {
        "question": "Trung bình thời gian tìm kiếm thấp nhưng nhiều người dùng vẫn thấy chậm. Nên xem thêm gì?",
        "options": ["Chỉ tốc độ CPU được công bố.", "Đổi framework ngay.", "Phân bố latency, p95 và đường đi đến kết quả đầu."],
        "correct": 2,
        "explanation": "Trung bình có thể che những lượt rất chậm. Phân bố theo dữ liệu và giai đoạn cho biết điểm nghẽn thực tế."
      },
      "reference": {
        "label": "Nguồn biên soạn chính thức",
        "url": "https://v2.tauri.app/develop/debug/"
      }
    },
    {
      "id": "desktop-workspace-project",
      "moduleId": "track-desktop",
      "title": "Dự án 3: quản lý workspace và kiểm toán thay đổi tệp",
      "description": "Kết hợp quét thư mục, snapshot có phiên bản, so sánh thay đổi và xuất báo cáo bằng một công cụ có thể nghiệm thu.",
      "duration": 70,
      "objectives": [
        "Kết hợp quét thư mục, snapshot có phiên bản, so sánh thay đổi và xuất báo cáo bằng một công cụ có thể nghiệm thu.",
        "Giải thích điều kiện đúng và trường hợp thất bại trước khi đổi mã.",
        "Kiểm chứng bằng bài tập, test biên và bằng chứng trong dự án."
      ],
      "sections": [
        {
          "title": "Một sản phẩm có phạm vi kiểm chứng được",
          "text": "Dự án cuối là công cụ kiểm toán một workspace do người dùng chọn. Nó quét các tệp trong ngân sách, tạo snapshot gồm đường dẫn tương đối, kích thước và digest, rồi so với snapshot trước để báo thêm, xóa hoặc thay đổi. Công cụ không sửa tệp nguồn và không đi theo symlink. Phạm vi này đủ thực tế để luyện I/O, mô hình dữ liệu, trạng thái UI và phát hành nhưng vẫn cho phép tạo fixture và kiểm thử tự động. Sau đó bạn có thể mở rộng thành quản lý bản sao hoặc đồng bộ bằng một thiết kế riêng có quyền ghi rõ ràng."
        },
        {
          "title": "Snapshot và đường dẫn là hợp đồng dữ liệu",
          "text": "Đường dẫn trong manifest phải là đường dẫn tương đối đã chuẩn hóa theo quy tắc của ứng dụng. Không dùng tên hiển thị làm khóa nếu hai thư mục có cùng tên tệp. Ghi schema_version và loại digest để bản mới hiểu dữ liệu cũ. Không coi kích thước và thời gian sửa là bằng chứng nội dung giống nhau; chúng chỉ có thể giúp chọn ứng viên cần hash lại. Khi file thay đổi trong lúc đọc, xác định cách phát hiện hoặc đánh dấu snapshot không ổn định. Với workspace đang có writer khác, báo cáo là quan sát trong một khoảng thời gian, không phải transaction filesystem toàn cục."
        },
        {
          "title": "Ba lớp cần giữ tách biệt",
          "text": "Lõi tính diff chỉ nhận hai tập metadata và trả danh sách thay đổi xác định. Scanner làm việc với hệ thống tệp và ngân sách. Adapter trình bày kết quả qua CLI trong lab, sau đó qua command và giao diện Tauri của bạn. Cách chia này giúp test diff mà không tạo tệp, test scanner bằng thư mục fixture, và test UI bằng dữ liệu mẫu. Lưu manifest mới phải dùng cơ chế ghi có kiểm soát đã học. Khi quét lỗi một phần, đừng biến danh sách thiếu thành kết luận mọi tệp đó đã bị xóa.",
          "code": "fn diff(old:&[(&str,u64)],new:&[(&str,u64)])->Vec<String>{let a:std::collections::BTreeMap<_,_>=old.iter().copied().collect();let b:std::collections::BTreeMap<_,_>=new.iter().copied().collect();let mut out=Vec::new();for (k,v) in &b{match a.get(k){None=>out.push(format!(\"+{k}\")),Some(x)if x!=v=>out.push(format!(\"~{k}\")),_=>{}}}for k in a.keys(){if !b.contains_key(k){out.push(format!(\"-{k}\"))}}out}"
        },
        {
          "title": "Bảo vệ kết luận bằng bằng chứng",
          "text": "Bộ nghiệm thu yêu cầu tạo baseline, sửa một tệp, thêm một tệp và xóa một tệp trong fixture; báo cáo phải đúng từng loại. Tiếp theo thử Unicode, symlink, tệp lớn, thư mục không đọc được và schema tương lai. Đo thời gian, byte đọc và số entry trên cùng một bộ dữ liệu trước và sau tối ưu. Bàn giao UI có tìm/lọc, tác vụ hủy được, bộ test, manifest mẫu và README phục hồi khi bản lưu hỏng. Khi tự đánh giá, giải thích giới hạn snapshot và nền tảng đã thử; việc có đủ nút trên cửa sổ chưa chứng minh công cụ bảo toàn ý nghĩa dữ liệu."
        }
      ],
      "tip": "Không quan sát được khác với không tồn tại. Scanner phải mang trạng thái hoàn chỉnh để diff không kết luận sai.",
      "exercise": {
        "title": "Dự án 3: quản lý workspace và kiểm toán thay đổi tệp — thực hành",
        "instructions": "Hoàn thành hàm theo hợp đồng trong mã mẫu. Giữ nguyên các assertion và thêm ít nhất một trường hợp biên của riêng bạn.",
        "requirements": [
          "Đạt tất cả assertion trong main.",
          "Không bỏ dữ liệu hay dùng panic để thay lỗi nghiệp vụ.",
          "Giữ đúng kết quả mong đợi."
        ]
      },
      "starterCode": "fn diff(old:&[(&str,u64)],new:&[(&str,u64)])->Vec<String>{todo!()}\nfn main(){assert_eq!(diff(&[(\"a\",1),(\"b\",2)],&[(\"a\",9),(\"c\",3)]),vec![\"~a\",\"+c\",\"-b\"]);assert!(diff(&[(\"a\",1)],&[(\"a\",1)]).is_empty());assert_eq!(diff(&[],&[(\"x\",1)]),vec![\"+x\"]);\nprintln!(\"Phân loại thay đổi chính xác\");}\n",
      "solutionCode": "fn diff(old:&[(&str,u64)],new:&[(&str,u64)])->Vec<String>{let a:std::collections::BTreeMap<_,_>=old.iter().copied().collect();let b:std::collections::BTreeMap<_,_>=new.iter().copied().collect();let mut out=Vec::new();for (k,v) in &b{match a.get(k){None=>out.push(format!(\"+{k}\")),Some(x)if x!=v=>out.push(format!(\"~{k}\")),_=>{}}}for k in a.keys(){if !b.contains_key(k){out.push(format!(\"-{k}\"))}}out}\nfn main(){assert_eq!(diff(&[(\"a\",1),(\"b\",2)],&[(\"a\",9),(\"c\",3)]),vec![\"~a\",\"+c\",\"-b\"]);assert!(diff(&[(\"a\",1)],&[(\"a\",1)]).is_empty());assert_eq!(diff(&[],&[(\"x\",1)]),vec![\"+x\"]);\nprintln!(\"Phân loại thay đổi chính xác\");}\n",
      "expectedOutput": "Phân loại thay đổi chính xác",
      "hints": [
        "Xác định các trường hợp phải từ chối trước khi cập nhật trạng thái.",
        "Dùng Result, checked arithmetic và giới hạn được nêu trong bài."
      ],
      "quiz": {
        "question": "Một lần quét bị lỗi khi đọc thư mục con. Có nên coi mọi tệp thiếu trong kết quả là đã bị xóa?",
        "options": ["Có, vì không có trong snapshot mới.", "Không; kết quả thiếu phải đánh dấu chưa hoàn chỉnh trước khi tính kết luận xóa.", "Có nếu tệp có tên ASCII."],
        "correct": 1,
        "explanation": "Không quan sát được khác với không tồn tại. Scanner phải mang trạng thái hoàn chỉnh để diff không kết luận sai."
      },
      "reference": {
        "label": "Nguồn biên soạn chính thức",
        "url": "https://doc.rust-lang.org/std/fs/fn.symlink_metadata.html"
      },
      "localLab": {
        "title": "Workspace Audit: snapshot SHA-256 và báo cáo thay đổi",
        "instructions": "Lab cung cấp scanner thật, manifest JSON có schema, engine diff và CLI. Dùng thư mục fixtures hoặc thư mục kiểm thử riêng; lệnh scan tạo file manifest mới và từ chối ghi đè file đã tồn tại. Không sửa nội dung workspace. Snapshot mô tả dữ liệu quan sát trong một lượt đọc, không khóa writer khác.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname=\"desktop_workspace_project\"\nversion=\"0.1.0\"\nedition=\"2024\"\n[dependencies]\nserde={version=\"1\",features=[\"derive\"]}\nserde_json=\"1\"\nsha2=\"0.10\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use serde::{Serialize,Deserialize};\nuse sha2::{Digest,Sha256};\nuse std::{collections::BTreeMap,fs,io::Read,path::Path};\n#[derive(Debug,Clone,Serialize,Deserialize,PartialEq,Eq)]#[serde(deny_unknown_fields)]pub struct Entry{pub bytes:u64,pub sha256:String}\n#[derive(Debug,Clone,Serialize,Deserialize)]#[serde(deny_unknown_fields)]pub struct Snapshot{pub schema:u8,pub files:BTreeMap<String,Entry>}\npub fn scan(root:&Path)->Result<Snapshot,String>{\n if !root.is_dir(){return Err(\"not-directory\".into())}let mut stack=vec![(root.to_path_buf(),0)];let mut files=BTreeMap::new();let mut entries=0;\n while let Some((dir,depth))=stack.pop(){for entry in fs::read_dir(dir).map_err(|_|\"read-dir\")?{\n  let path=entry.map_err(|_|\"entry\")?.path();entries+=1;if entries>5000{return Err(\"entry-budget\".into())}\n  let meta=fs::symlink_metadata(&path).map_err(|_|\"metadata\")?;if meta.file_type().is_symlink(){continue}\n  if meta.is_dir(){if depth>=16{return Err(\"depth-budget\".into())}stack.push((path,depth+1));continue}if !meta.is_file(){continue}\n  if meta.len()>1024*1024{return Err(\"file-budget\".into())}\n  let mut bytes=Vec::new();fs::File::open(&path).map_err(|_|\"open\")?.take(1024*1024+1).read_to_end(&mut bytes).map_err(|_|\"read\")?;\n  if bytes.len()>1024*1024{return Err(\"file-budget\".into())}\n  let relative=path.strip_prefix(root).map_err(|_|\"root\")?;\n  let mut components=Vec::new();for part in relative.components(){let text=part.as_os_str().to_str().ok_or(\"non-unicode-path\")?;if text.contains('\\\\')||text.contains(':'){return Err(\"non-portable-path\".into())}components.push(text);}let name=components.join(\"/\");\n  let digest=Sha256::digest(&bytes).iter().map(|b|format!(\"{b:02x}\")).collect();\n  files.insert(name,Entry{bytes:bytes.len() as u64,sha256:digest});\n }}Ok(Snapshot{schema:1,files})\n}\npub fn decode(bytes:&[u8])->Result<Snapshot,String>{if bytes.len()>4*1024*1024{return Err(\"manifest-budget\".into())}let s:Snapshot=serde_json::from_slice(bytes).map_err(|_|\"invalid-manifest\")?;if s.schema!=1{return Err(\"schema\".into())}if s.files.keys().any(|p|p.is_empty()||p.starts_with('/')||p.split('/').any(|x|x==\"..\"||x==\".\")){return Err(\"path\".into())}Ok(s)}\npub fn changes(old:&Snapshot,new:&Snapshot)->Vec<String>{let mut out=Vec::new();for(k,v)in &new.files{match old.files.get(k){None=>out.push(format!(\"added {k}\")),Some(previous)if previous!=v=>out.push(format!(\"changed {k}\")),_=>{}}}for k in old.files.keys(){if !new.files.contains_key(k){out.push(format!(\"removed {k}\"))}}out}\n#[cfg(test)]mod tests{\n use super::*;use std::{path::PathBuf,sync::atomic::{AtomicU64,Ordering}};static ID:AtomicU64=AtomicU64::new(0);\n struct Temp(PathBuf);impl Temp{fn new()->Self{let p=std::env::temp_dir().join(format!(\"workspace-audit-{}-{}\",std::process::id(),ID.fetch_add(1,Ordering::Relaxed)));fs::create_dir_all(&p).unwrap();Self(p)}}impl Drop for Temp{fn drop(&mut self){let _=fs::remove_dir_all(&self.0);}}\n #[test]fn real_file_changes(){let t=Temp::new();fs::write(t.0.join(\"a\"),\"one\").unwrap();fs::write(t.0.join(\"b\"),\"old\").unwrap();let a=scan(&t.0).unwrap();fs::write(t.0.join(\"a\"),\"two\").unwrap();fs::remove_file(t.0.join(\"b\")).unwrap();fs::write(t.0.join(\"c\"),\"new\").unwrap();let b=scan(&t.0).unwrap();assert_eq!(changes(&a,&b),vec![\"changed a\",\"added c\",\"removed b\"]);}\n #[test]fn roundtrip_and_future_schema(){let s=Snapshot{schema:1,files:BTreeMap::new()};assert_eq!(decode(&serde_json::to_vec(&s).unwrap()).unwrap().schema,1);assert_eq!(decode(br#\"{\"schema\":2,\"files\":{}}\"#).unwrap_err(),\"schema\");}\n #[test]fn oversize_is_error_not_partial_snapshot(){let t=Temp::new();fs::write(t.0.join(\"large\"),vec![0u8;1024*1024+1]).unwrap();assert_eq!(scan(&t.0).unwrap_err(),\"file-budget\");}\n #[test]fn empty_directory_is_valid(){let t=Temp::new();assert!(scan(&t.0).unwrap().files.is_empty());}\n}"
          },
          {
            "path": "src/main.rs",
            "content": "use desktop_workspace_project::{scan,decode,changes};use std::{fs,io::Write,path::Path};\nfn run()->Result<(),String>{let a:Vec<_>=std::env::args_os().collect();if a.len()!=4{return Err(\"Dùng: scan THU_MUC MANIFEST | diff MANIFEST THU_MUC\".into())}match a[1].to_str(){Some(\"scan\")=>{let snapshot=scan(Path::new(&a[2]))?;let bytes=serde_json::to_vec_pretty(&snapshot).map_err(|_|\"encode\")?;let mut file=fs::OpenOptions::new().create_new(true).write(true).open(&a[3]).map_err(|_|\"manifest-exists-or-unwritable\")?;file.write_all(&bytes).map_err(|_|\"write\")?;file.sync_all().map_err(|_|\"sync\")?;println!(\"Đã ghi {} tệp\",snapshot.files.len());},Some(\"diff\")=>{let old=decode(&fs::read(&a[2]).map_err(|_|\"read-manifest\")?)?;let new=scan(Path::new(&a[3]))?;for change in changes(&old,&new){println!(\"{change}\")}},_=>return Err(\"Lệnh không hợp lệ\".into())}Ok(())}\nfn main(){if let Err(e)=run(){eprintln!(\"{e}\");std::process::exit(1)}}\n"
          },
          {
            "path": "fixtures/note.txt",
            "content": "Một workspace để kiểm chứng.\n"
          },
          {
            "path": "README.md",
            "content": "# Workspace Audit\n\nChạy `cargo run -- scan fixtures baseline.json`, sửa tệp fixture, rồi `cargo run -- diff baseline.json fixtures`. Manifest phải nằm ngoài thư mục đang quét. Công cụ báo added, changed, removed; SHA-256 so sánh nội dung, không chứng minh ai đã tạo tệp. Scanner trả lỗi nếu không có snapshot đầy đủ trong ngân sách. Tệp lớn hơn 1 MiB, hơn 5.000 entry hoặc cây sâu quá 16 bị từ chối.\n\nBài capstone: ghép scanner/diff vào Tauri; thêm tác vụ hủy được, UI xem thay đổi, snapshot bằng ghi tạm + commit, xuất báo cáo, xử lý migration và thử gói cài đặt. Bàn giao ma trận test, số đo và giới hạn snapshot khi có writer đồng thời.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run -- scan fixtures baseline.json",
          "cargo run -- diff baseline.json fixtures"
        ],
        "checks": [
          "Fixture thêm/sửa/xóa có phân loại chính xác.",
          "Schema tương lai và manifest hỏng bị từ chối.",
          "Quét không hoàn chỉnh không tạo kết luận tệp đã bị xóa.",
          "Giao diện cuối dùng scanner thật, có cancellation và chỉ công bố snapshot đầy đủ."
        ]
      }
    }
  ],
  "projects": [
    {
      "id": "desktop-project-notes",
      "title": "Ứng dụng ghi chú có lưu trữ",
      "description": "Một cửa sổ Tauri đọc và lưu ghi chú qua Rust, phát hiện xung đột revision và giữ bản nháp khi lỗi.",
      "level": "guided",
      "estimatedHours": 8,
      "labLessonId": "desktop-atomic-save",
      "requirements": [
        "Lưu ghi chú trong thư mục dữ liệu ứng dụng, không nhận đường dẫn tùy ý từ WebView.",
        "Bảo toàn bản nháp khi I/O lỗi và phát hiện revision cũ.",
        "Khởi động lại đọc đúng snapshot hoặc báo lỗi phục hồi."
      ],
      "milestones": [
        {
          "title": "Chạy ứng dụng và mô hình dữ liệu",
          "tasks": [
            "Chạy test repository, mở cửa sổ và giải thích DTO Note.",
            "Xác định đơn vị revision và giới hạn byte."
          ],
          "acceptance": "UI đọc được snapshot và không tự thực thi nội dung ghi chú."
        },
        {
          "title": "Lưu có kiểm soát",
          "tasks": [
            "Quan sát luồng tệp tạm, sync và rename.",
            "Thêm test lỗi trước commit và test đóng khi dirty."
          ],
          "acceptance": "Lỗi không ghi đè snapshot cũ; request revision cũ bị từ chối."
        },
        {
          "title": "Nghiệm thu native",
          "tasks": [
            "Thử sửa trong lúc lưu và mở lại app.",
            "Ghi rõ giới hạn một tiến trình, nền tảng đã thử và vị trí dữ liệu."
          ],
          "acceptance": "Có bằng chứng thao tác cửa sổ và bộ test chạy được từ checkout sạch."
        }
      ],
      "testCases": [
        {
          "name": "Khởi động lại",
          "setup": "Lưu ghi chú Unicode, đóng và mở lại.",
          "expected": "Nội dung và revision giữ nguyên."
        },
        {
          "name": "Xung đột",
          "setup": "Gửi hai lần save cùng expected_revision.",
          "expected": "Chỉ lần đầu thành công, dữ liệu lần đầu còn nguyên."
        },
        {
          "name": "Dữ liệu hỏng",
          "setup": "Dùng fixture JSON sai và gọi save.",
          "expected": "Báo corrupt, không thay byte nguồn."
        },
        {
          "name": "Nội dung có escape",
          "setup": "Lưu chuỗi nhiều newline trong giới hạn body.",
          "expected": "Mở lại khớp hoàn toàn, không nhầm giới hạn JSON trên đĩa."
        }
      ],
      "rubric": [
        {
          "id": "data",
          "title": "Bảo toàn dữ liệu",
          "criteria": [
            "Test persistence và conflict đạt.",
            "Lỗi ghi không thay dữ liệu đã xác nhận."
          ],
          "critical": true
        },
        {
          "id": "boundary",
          "title": "Hợp đồng command",
          "criteria": [
            "Đầu vào có giới hạn và mã lỗi ổn định.",
            "Capability chỉ cấp command cần thiết."
          ],
          "critical": true
        },
        {
          "id": "interaction",
          "title": "Trải nghiệm sửa/lưu",
          "criteria": [
            "Bản nháp mới hơn request được giữ.",
            "Có nhãn, focus và thao tác bàn phím."
          ],
          "critical": false
        },
        {
          "id": "delivery",
          "title": "Bàn giao",
          "criteria": [
            "README đủ lệnh chạy và phục hồi.",
            "Có minh chứng native, ghi rõ nền tảng."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Mã nguồn Tauri và test repository.",
        "Fixture lỗi cùng kết quả kiểm tra.",
        "Video thao tác mở, sửa, lưu, conflict và mở lại.",
        "README giới hạn và phục hồi."
      ]
    },
    {
      "id": "desktop-project-search",
      "title": "Tìm kiếm nội dung workspace",
      "description": "Engine duyệt thư mục thật có ngân sách, CLI kiểm chứng và giao diện Tauri hủy được do người học hoàn thiện.",
      "level": "independent",
      "estimatedHours": 16,
      "labLessonId": "desktop-search-project",
      "requirements": [
        "Kết quả giữ đường dẫn tương đối, số dòng và văn bản gốc.",
        "Giới hạn entry, depth, bytes và số kết quả; không duyệt symlink.",
        "UI dùng generation, cancellation và kết quả theo batch."
      ],
      "milestones": [
        {
          "title": "Engine và fixture",
          "tasks": [
            "Chạy CLI trên fixtures và thêm cây Unicode.",
            "Kiểm tra ngân sách và symlink."
          ],
          "acceptance": "Test giới hạn đạt, kết quả không bị chuẩn hóa mất bản gốc."
        },
        {
          "title": "Kết nối giao diện",
          "tasks": [
            "Gọi engine từ worker, không chặn UI.",
            "Thêm hủy hợp tác và bỏ event generation cũ."
          ],
          "acceptance": "Thay từ khóa nhanh không hiển thị kết quả của lần trước."
        },
        {
          "title": "Đo và bàn giao",
          "tasks": [
            "Đo thời gian kết quả đầu và độ trễ hủy.",
            "Thêm test cây sâu, quyền đọc lỗi và kết quả bị cắt."
          ],
          "acceptance": "Báo cáo gồm điều kiện đo và phản hồi UI trong trường hợp khó."
        }
      ],
      "testCases": [
        {
          "name": "Giới hạn kết quả",
          "setup": "Fixture có 1.000 dòng khớp, limit=100.",
          "expected": "Tối đa 100 kết quả và trạng thái giới hạn."
        },
        {
          "name": "Symlink",
          "setup": "Link tới một thư mục fixture khác.",
          "expected": "Không đọc mục tiêu qua link."
        },
        {
          "name": "Tác vụ cũ",
          "setup": "Bắt đầu A, hủy, bắt đầu B rồi nhận kết quả A.",
          "expected": "UI chỉ hiện B."
        },
        {
          "name": "Quyền đọc",
          "setup": "Tạo lỗi read_dir qua adapter kiểm thử.",
          "expected": "Lỗi rõ, không giả vờ kết quả đầy đủ."
        }
      ],
      "rubric": [
        {
          "id": "budgets",
          "title": "Ngân sách tài nguyên",
          "criteria": [
            "Test entry/bytes/depth/results đạt.",
            "Không dùng hàng đợi kết quả vô hạn."
          ],
          "critical": true
        },
        {
          "id": "lifecycle",
          "title": "Vòng đời tác vụ",
          "criteria": [
            "Có hủy hợp tác và generation.",
            "Cửa sổ đóng không gây panic."
          ],
          "critical": true
        },
        {
          "id": "search",
          "title": "Tính đúng kết quả",
          "criteria": [
            "Unicode và số dòng chính xác.",
            "Giữ văn bản gốc khi tìm kiếm."
          ],
          "critical": false
        },
        {
          "id": "measure",
          "title": "Đo và giải thích",
          "criteria": [
            "Có số đo theo bộ fixture cố định.",
            "Giải thích giới hạn TOCTOU của thao tác path."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Engine, CLI, adapter Tauri và UI.",
        "Fixture/test các ngân sách.",
        "Báo cáo latency và cancellation.",
        "Hướng dẫn dùng trên thư mục được người dùng chọn."
      ]
    },
    {
      "id": "desktop-project-workspace",
      "title": "Workspace Audit có giao diện và snapshot",
      "description": "Sản phẩm tổng hợp theo dõi thay đổi nội dung workspace bằng snapshot SHA-256, xử lý lỗi và đóng gói ứng dụng.",
      "level": "capstone",
      "estimatedHours": 28,
      "labLessonId": "desktop-workspace-project",
      "requirements": [
        "Quét workspace thật và so sánh thêm/sửa/xóa.",
        "Chỉ công bố snapshot hoàn chỉnh; manifest có schema và kiểm tra đầu vào.",
        "UI có lọc thay đổi, hủy thao tác, thông báo xung đột và xuất báo cáo.",
        "Có quy trình đóng gói, migration và diễn tập phục hồi."
      ],
      "milestones": [
        {
          "title": "Scanner và diff",
          "tasks": [
            "Chạy baseline/diff bằng CLI.",
            "Thêm fixture file thay đổi và cây không đọc được."
          ],
          "acceptance": "Không kết luận removed từ một lần quét thất bại."
        },
        {
          "title": "Sản phẩm desktop",
          "tasks": [
            "Dùng Tauri để chọn workspace và xem thay đổi.",
            "Tái dùng generation, revision và save transaction."
          ],
          "acceptance": "UI không bị khóa khi quét; dữ liệu cũ giữ khi người dùng hủy."
        },
        {
          "title": "Vận hành và nâng cấp",
          "tasks": [
            "Thêm test manifest schema cũ và tương lai.",
            "Đóng gói trên một nền tảng, kiểm tra asset từ bản cài."
          ],
          "acceptance": "Người khác chạy được sản phẩm và phục hồi baseline khi lỗi."
        }
      ],
      "testCases": [
        {
          "name": "Thêm sửa xóa",
          "setup": "Thay đổi ba tệp trong fixture giữa hai lần quét.",
          "expected": "Đúng ba loại thay đổi, không phụ thuộc mtime."
        },
        {
          "name": "Quét không hoàn chỉnh",
          "setup": "Một tệp vượt ngân sách hoặc read_dir lỗi.",
          "expected": "Trả lỗi; baseline cũ không đổi."
        },
        {
          "name": "Schema tương lai",
          "setup": "Manifest schema=2 khi reader chỉ hỗ trợ1.",
          "expected": "Từ chối và giữ file gốc."
        },
        {
          "name": "Gói cài đặt",
          "setup": "Chạy app từ thư mục cài đặt khác checkout.",
          "expected": "Asset và app-data được resolve đúng."
        }
      ],
      "rubric": [
        {
          "id": "truth",
          "title": "Tính đúng của báo cáo",
          "criteria": [
            "Diff được kiểm thử với tệp thật.",
            "Scan lỗi không biến thành kết luận xóa."
          ],
          "critical": true
        },
        {
          "id": "storage",
          "title": "Snapshot và phục hồi",
          "criteria": [
            "Schema và đường dẫn được validate.",
            "Commit snapshot và backup có test lỗi."
          ],
          "critical": true
        },
        {
          "id": "product",
          "title": "Luồng sử dụng",
          "criteria": [
            "Có cancellation, trạng thái và bàn phím.",
            "Giữ dữ liệu khi thao tác thất bại."
          ],
          "critical": false
        },
        {
          "id": "release",
          "title": "Nghiệm thu bản phát hành",
          "criteria": [
            "Có số đo và ma trận test.",
            "Có gói chạy thử cùng hướng dẫn rollback dữ liệu."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Ứng dụng Tauri, scanner/diff và bộ test.",
        "Manifest/fixture và báo cáo đo.",
        "Gói phát hành thử trên nền tảng đã chọn.",
        "Tài liệu giới hạn snapshot, migration và phục hồi."
      ]
    }
  ],
  "assessment": {
    "title": "Đánh giá năng lực xây ứng dụng desktop",
    "instructions": "Trả lời tình huống, làm lại các bài còn thiếu và tự nghiệm thu ba dự án bằng test cùng bằng chứng chạy ứng dụng. Điểm trắc nghiệm không thay cho việc kiểm tra cửa sổ thật, dữ liệu và bản đóng gói.",
    "passPercent": 80,
    "questions": [
      {
        "id": "desktop-exam-01",
        "question": "Một command tạo tài liệu timeout; người dùng bấm lại. Cơ chế nào xử lý việc commit trước timeout mà không tạo bản trùng?",
        "options": ["Luôn tạo ID mới.", "Tăng timeout vô hạn.", "Mã thao tác với kết quả đã xử lý hoặc ràng buộc tương ứng."],
        "correct": 2,
        "explanation": "Timeout không chứng minh thao tác chưa commit. Định danh thao tác và một nơi ghi nhớ kết quả giúp xác định lần gửi lại.",
        "lessonIds": [
          "desktop-command-contract"
        ]
      },
      {
        "id": "desktop-exam-02",
        "question": "Bạn lưu A, tiếp tục sửa B và nhận xác nhận A. Dữ liệu nào trở thành bản đã lưu của UI?",
        "options": ["A; B tiếp tục là bản nháp bẩn.", "B vì đang hiển thị.", "Chuỗi rỗng để tránh xung đột."],
        "correct": 0,
        "explanation": "Xác nhận thuộc yêu cầu A. Cập nhật saved=A nhưng giữ draft=B; so sánh hai bản để quyết định dirty.",
        "lessonIds": [
          "desktop-document-model"
        ]
      },
      {
        "id": "desktop-exam-03",
        "question": "Tệp chính bị ghi trực tiếp rồi hết dung lượng giữa chừng. Thiết kế nào giúp giữ bản cũ đến bước công bố?",
        "options": ["Xóa bản cũ trước.", "Ghi tệp tạm cùng filesystem, kiểm tra và công bố sau.", "Chỉ tăng buffer."],
        "correct": 1,
        "explanation": "Bản cũ không nên bị sửa trong giai đoạn chuẩn bị. Cần phân biệt rename với bảo đảm bền vững qua mất điện.",
        "lessonIds": [
          "desktop-atomic-save"
        ]
      },
      {
        "id": "desktop-exam-04",
        "question": "Kế hoạch import dựa trên revision 8; trước commit dữ liệu đã thành revision 9. Bạn nên xử lý thế nào?",
        "options": ["Tin bản xem trước vì nó hợp lệ lúc tạo.", "Kiểm tra lại revision và yêu cầu xem lại kế hoạch.", "Trộn ngẫu nhiên hai danh sách."],
        "correct": 1,
        "explanation": "Kế hoạch gắn với snapshot cũ, do đó phải kiểm tra điều kiện nền tại thời điểm áp dụng.",
        "lessonIds": [
          "desktop-import-workflow"
        ]
      },
      {
        "id": "desktop-exam-05",
        "question": "Một worker phát hàng nghìn tiến độ mỗi giây. Giải pháp nào giữ UI và kết quả cuối đúng?",
        "options": ["Dùng hàng đợi vô hạn.", "Bỏ toàn bộ lỗi gửi.", "Coalesce tiến độ trung gian và bảo đảm nhận/truy vấn trạng thái kết thúc."],
        "correct": 2,
        "explanation": "Tiến độ trung gian có thể thay thế; kết quả kết thúc cần một đường nhận có thể tin cậy và ngân sách queue.",
        "lessonIds": [
          "desktop-cancel-progress"
        ]
      },
      {
        "id": "desktop-exam-06",
        "question": "Có 10 triệu tệp rất nhỏ. max_file_bytes thấp đã bảo vệ engine khỏi mọi tải quá mức chưa?",
        "options": ["Chưa; cần giới hạn số tệp, độ sâu, số kết quả và cancellation.", "Đủ nếu tên ngắn.", "Đã đủ."],
        "correct": 0,
        "explanation": "Tổng số thao tác metadata và entry vẫn có thể rất lớn. Ngân sách phải bao trùm các nguồn tiêu thụ khác nhau.",
        "lessonIds": [
          "desktop-search-project"
        ]
      },
      {
        "id": "desktop-exam-07",
        "question": "Cửa sổ mới mở bỏ lỡ event sửa tài liệu. Cách khôi phục đúng là gì?",
        "options": ["Dùng command đọc snapshot và đối chiếu revision.", "Đợi một event khác vô hạn.", "Sao chép DOM của cửa sổ khác."],
        "correct": 0,
        "explanation": "Event là tín hiệu, còn snapshot có revision cho phép một cửa sổ tham gia muộn khôi phục trạng thái.",
        "lessonIds": [
          "desktop-multiwindow"
        ]
      },
      {
        "id": "desktop-exam-08",
        "question": "Preview chỉ hiển thị Markdown nhưng vẫn được cấp command ghi tùy ý. Lớp nào còn thiếu trong thiết kế?",
        "options": ["Chỉ cần màu nền khác.", "Chỉ cần đổi tên command.", "Giới hạn capability cùng kiểm tra phạm vi trong handler."],
        "correct": 2,
        "explanation": "Nội dung preview không cần quyền ghi. CSP và quyền command là lớp khác nhau; handler vẫn kiểm tra dữ liệu.",
        "lessonIds": [
          "desktop-preview"
        ]
      },
      {
        "id": "desktop-exam-09",
        "question": "Bản cũ được cài lại sau khi bản mới đã ghi schema 2. Điều nào phải được chuẩn bị trước?",
        "options": ["Giả định schema 2 giống schema 1.", "Converter/nguyên tắc tương thích hoặc backup để phục hồi.", "Xóa dữ liệu khi mở."],
        "correct": 1,
        "explanation": "Rollback binary không tự rollback dữ liệu. Cần kiểm chứng cách bản cũ đọc hoặc khôi phục snapshot phù hợp.",
        "lessonIds": [
          "desktop-schema-migration"
        ]
      },
      {
        "id": "desktop-exam-10",
        "question": "Artifact có phiên bản cao hơn nhưng sai kiến trúc. Quyết định đúng?",
        "options": ["Bỏ qua nền tảng nếu checksum đúng.", "Cài rồi thử chạy.", "Từ chối artifact này dù phiên bản cao."],
        "correct": 2,
        "explanation": "Metadata phải phù hợp platform/architecture/channel và được xác thực; một điều kiện không thay thế điều kiện khác.",
        "lessonIds": [
          "desktop-upgrade-policy"
        ]
      },
      {
        "id": "desktop-exam-11",
        "question": "Tìm kiếm nhanh ở core nhưng UI vẫn chậm. Phép đo tiếp theo hữu ích nhất?",
        "options": ["Đếm số dòng Rust.", "Đo serialize/IPC/render và thời gian kết quả đầu.", "Bỏ hết logging ngay."],
        "correct": 1,
        "explanation": "Độ trễ trải nghiệm gồm nhiều lớp. Đo giai đoạn giúp xác định điểm nghẽn, tránh tối ưu nhầm.",
        "lessonIds": [
          "desktop-measurement"
        ]
      },
      {
        "id": "desktop-exam-12",
        "question": "Scanner không đọc được một thư mục, nhưng diff báo các tệp trong đó bị xóa. Kết luận nào đúng?",
        "options": ["Sai; lần quét chưa hoàn chỉnh không chứng minh tệp đã xóa.", "Đúng nếu lần quét trước có chúng.", "Đúng vì không quan sát thấy."],
        "correct": 0,
        "explanation": "Phải mang trạng thái hoàn chỉnh hoặc dừng với lỗi trước khi công bố một snapshot dùng để kết luận xóa.",
        "lessonIds": [
          "desktop-workspace-project"
        ]
      }
    ],
    "skills": [
      {
        "id": "desktop-skill-architecture",
        "title": "Kiến trúc ứng dụng và hợp đồng IPC",
        "description": "Tách giao diện, command và mô hình tài liệu.",
        "lessonIds": [
          "desktop-ipc",
          "desktop-command-contract",
          "desktop-document-model"
        ],
        "projectIds": [
          "desktop-project-notes"
        ],
        "required": true
      },
      {
        "id": "desktop-skill-persistence",
        "title": "Lưu trữ và nhập dữ liệu",
        "description": "Giữ dữ liệu qua lỗi, revision và khởi động lại.",
        "lessonIds": [
          "desktop-files",
          "desktop-atomic-save",
          "desktop-import-workflow"
        ],
        "projectIds": [
          "desktop-project-notes"
        ],
        "required": true
      },
      {
        "id": "desktop-skill-background",
        "title": "Tác vụ nền và tìm kiếm",
        "description": "Giới hạn công việc, hủy hợp tác và kết quả đến muộn.",
        "lessonIds": [
          "desktop-state",
          "desktop-cancel-progress",
          "desktop-search-project"
        ],
        "projectIds": [
          "desktop-project-search"
        ],
        "required": true
      },
      {
        "id": "desktop-skill-trust",
        "title": "Cửa sổ và ranh giới tin cậy",
        "description": "Đồng bộ nhiều cửa sổ và xử lý nội dung không đáng tin.",
        "lessonIds": [
          "desktop-capabilities",
          "desktop-multiwindow",
          "desktop-preview"
        ],
        "projectIds": [
          "desktop-project-search"
        ],
        "required": true
      },
      {
        "id": "desktop-skill-delivery",
        "title": "Dữ liệu và phát hành ứng dụng",
        "description": "Migration, cập nhật và phục hồi có kiểm chứng.",
        "lessonIds": [
          "desktop-release",
          "desktop-schema-migration",
          "desktop-upgrade-policy"
        ],
        "projectIds": [
          "desktop-project-workspace"
        ],
        "required": true
      },
      {
        "id": "desktop-skill-product",
        "title": "Chất lượng và dự án tổng hợp",
        "description": "Đo hiệu năng, nghiệm thu và phát hành một công cụ workspace.",
        "lessonIds": [
          "desktop-quality",
          "desktop-measurement",
          "desktop-workspace-project"
        ],
        "projectIds": [
          "desktop-project-workspace"
        ],
        "required": true
      }
    ]
  }
};
