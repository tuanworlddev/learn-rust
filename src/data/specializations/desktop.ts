import type { SpecializationBundle } from "../specialization-types";

export const desktopBundle: SpecializationBundle = {
  "track": {
    "id": "desktop",
    "title": "Ứng dụng desktop",
    "shortTitle": "Desktop",
    "description": "Xây ứng dụng macOS, Windows và Linux với giao diện web, lõi Rust và quyền truy cập hệ thống rõ ràng.",
    "outcome": "Xây trình quản lý ghi chú bằng Tauri 2 có lưu tệp, tác vụ nền, kiểm soát quyền, kiểm thử và quy trình phát hành theo nền tảng.",
    "prerequisites": [
      "Ownership, Result, struct và enum",
      "Thread, channel, Arc và Mutex",
      "Kiểm thử bằng Cargo",
      "HTML, JavaScript hoặc TypeScript cơ bản",
      "Đường dẫn, tệp và quyền của hệ điều hành"
    ],
    "technologies": [
      "Tauri 2",
      "Serde",
      "Capabilities",
      "WebView",
      "Cargo"
    ],
    "color": "purple",
    "lessonIds": [
      "desktop-ipc",
      "desktop-state",
      "desktop-files",
      "desktop-capabilities",
      "desktop-release",
      "desktop-quality"
    ],
    "capstone": {
      "title": "Trình quản lý ghi chú và tìm kiếm tệp",
      "description": "Tạo ứng dụng desktop mở một thư mục do người dùng chọn, chỉnh sửa ghi chú và lập chỉ mục tìm kiếm trong nền. Giao diện phải phản hồi rõ khi đang chạy, bị hủy, gặp xung đột hoặc không có quyền.",
      "milestones": [
        {
          "title": "Lõi dữ liệu và hợp đồng IPC",
          "tasks": [
            "Tách crate nghiệp vụ khỏi Tauri; định nghĩa NoteId, phiên bản tài liệu và các lỗi có mã ổn định.",
            "Tạo lệnh mở, lưu và tìm kiếm; giới hạn kích thước đầu vào, kiểm tra Unicode và ánh xạ lỗi cho giao diện."
          ],
          "acceptance": "Có kiểm thử dữ liệu rỗng, quá lớn, ID không tồn tại; frontend không phụ thuộc thông báo lỗi nội bộ của Rust."
        },
        {
          "title": "Quyền và thao tác tệp",
          "tasks": [
            "Chỉ mở thư mục sau lựa chọn của người dùng; phân biệt quyền chọn đường dẫn, đọc tệp và ghi tệp.",
            "Giới hạn API frontend bằng capability; kiểm tra đường dẫn trong custom command, xét symlink và thay đổi tệp ngoài ứng dụng.",
            "Thiết kế lưu tạm, thay thế và phục hồi phù hợp từng hệ điều hành."
          ],
          "acceptance": "Thử đọc ngoài thư mục được chọn và gọi lệnh từ cửa sổ không có quyền đều bị từ chối; lưu thất bại không làm mất bản đang có."
        },
        {
          "title": "Lập chỉ mục không khóa giao diện",
          "tasks": [
            "Dùng tác vụ nền có hàng đợi giới hạn, job ID và tín hiệu hủy; không giữ Mutex qua I/O dài.",
            "Gửi tiến độ có kiểm soát; bỏ kết quả của phiên tìm kiếm cũ sau khi người dùng đổi truy vấn."
          ],
          "acceptance": "Có thể tiếp tục gõ, hủy và đóng cửa sổ khi lập chỉ mục; bộ nhớ không tăng theo vô hạn số sự kiện chờ."
        },
        {
          "title": "Trải nghiệm và kiểm thử trên hệ điều hành",
          "tasks": [
            "Hỗ trợ bàn phím, trạng thái rỗng, xác nhận mất thay đổi, giao diện sáng tối và cỡ chữ lớn.",
            "Kiểm thử giao diện bằng mock IPC và kiểm tra ít nhất một bản native; ghi rõ hệ điều hành, kiến trúc và WebView.",
            "Đo thời gian mở ứng dụng, phản hồi tìm kiếm và bộ nhớ với dữ liệu mẫu có kích thước công bố."
          ],
          "acceptance": "Kịch bản mở → sửa → lưu → tìm → hủy chạy được; kiểm thử mock không được dùng thay bằng chứng quyền native."
        },
        {
          "title": "Đóng gói và phát hành có thể phục hồi",
          "tasks": [
            "Tạo artifact đúng nền tảng, lưu Cargo.lock và lockfile frontend; kiểm tra artifact trên máy sạch.",
            "Viết kế hoạch ký mã theo hệ điều hành, ký cập nhật, quản lý khóa và di chuyển định dạng dữ liệu.",
            "Tập dượt cập nhật từ phiên bản trước và khôi phục khi migration lỗi bằng dữ liệu mẫu."
          ],
          "acceptance": "README nêu rõ artifact đã kiểm tra, bước còn yêu cầu chứng chỉ và cách bảo vệ dữ liệu khi nâng cấp; không phát hành khóa riêng trong ứng dụng."
        }
      ],
      "deliverables": [
        "Mã nguồn Tauri và crate nghiệp vụ với lockfile",
        "Capability, hợp đồng IPC và mô hình quyền",
        "Bộ test nghiệp vụ, IPC và kịch bản UX",
        "Artifact kiểm tra cho nền tảng mục tiêu",
        "Báo cáo hiệu năng và hướng dẫn nâng cấp dữ liệu"
      ],
      "reviewQuestions": [
        "Vì sao dùng Rust vẫn phải coi dữ liệu từ WebView là không đáng tin?",
        "Khi hai cửa sổ sửa cùng ghi chú, bạn phát hiện xung đột ở đâu?",
        "Capability của plugin fs có tự giới hạn std::fs trong custom command không?",
        "Bạn xử lý kết quả tìm kiếm cũ về muộn như thế nào?",
        "Ký updater và ký ứng dụng của hệ điều hành khác nhau ra sao?"
      ]
    },
    "resources": [
      {
        "label": "Tauri: kiến trúc ứng dụng",
        "url": "https://v2.tauri.app/concept/architecture/"
      },
      {
        "label": "Tauri: gọi Rust từ frontend",
        "url": "https://v2.tauri.app/develop/calling-rust/"
      },
      {
        "label": "Tauri: capabilities",
        "url": "https://v2.tauri.app/security/capabilities/"
      },
      {
        "label": "Tauri: hệ thống tệp",
        "url": "https://v2.tauri.app/plugin/file-system/"
      },
      {
        "label": "Tauri: updater",
        "url": "https://v2.tauri.app/plugin/updater/"
      },
      {
        "label": "Tauri: kiểm thử WebDriver",
        "url": "https://v2.tauri.app/develop/tests/webdriver/"
      }
    ]
  },
  "lessons": [
    {
      "id": "desktop-ipc",
      "moduleId": "track-desktop",
      "title": "Tauri: ranh giới giữa giao diện và Rust",
      "duration": 50,
      "description": "Thiết kế command có kiểu dữ liệu, lỗi và giới hạn rõ ràng; chạy một ứng dụng Tauri tối thiểu.",
      "objectives": [
        "Phân biệt WebView với lõi native",
        "Thiết kế DTO và Result cho IPC",
        "Kiểm tra dữ liệu trong Rust dù frontend đã kiểm tra",
        "Tách nghiệp vụ để kiểm thử độc lập"
      ],
      "sections": [
        {
          "title": "Hai phần ứng dụng, một hợp đồng",
          "text": "Một ứng dụng Tauri dùng công nghệ web để vẽ giao diện, còn Rust thực hiện các công việc native và giữ trạng thái đáng tin cậy. Hai phía trao đổi thông điệp qua IPC. Giao diện không giữ một tham chiếu Rust trực tiếp: dữ liệu cần được chuyển thành biểu diễn mà hai phía hiểu cùng nhau.\n\nHãy vẽ đường đi của một thao tác lưu ghi chú: nút lưu tạo lệnh, Rust kiểm tra và thực hiện, rồi giao diện nhận kết quả. Tách ba trạng thái đang xử lý, thành công và thất bại. Bấm nút lần thứ hai trong lúc chờ không được âm thầm tạo thao tác trùng; giao diện có thể khóa nút hoặc gửi cùng mã yêu cầu theo hợp đồng."
        },
        {
          "title": "Command nhỏ và dữ liệu có nghĩa",
          "text": "Tauri command nhận dữ liệu có thể deserialize và trả dữ liệu có thể serialize. Result ánh xạ nhánh thành công và lỗi sang kết quả của lời gọi phía JavaScript. Định nghĩa kiểu riêng cho đầu vào, kết quả và mã lỗi; tránh trả nguyên thông báo từ hệ thống tệp vì nó có thể lộ đường dẫn nội bộ hoặc thay đổi giữa các hệ điều hành.\n\nMột command tên save_note nên nhận nội dung và phiên bản mà người dùng đã đọc, thay vì cho frontend thực thi một lệnh shell tùy ý. Hợp đồng càng cụ thể càng dễ kiểm thử và giới hạn quyền. Các thao tác mới có thể dùng chung hàm nghiệp vụ mà không cần gọi lại command Tauri hoặc tạo WebView trong unit test.",
          "code": "// Chữ ký trong một ứng dụng Tauri đã đăng ký command.\n#[tauri::command]\nfn validate_title(title: String) -> Result<String, String> {\n    normalize_title(&title).map_err(str::to_owned)\n}\n// Frontend: await invoke('validate_title', { title: input });"
        },
        {
          "title": "Kiểm tra đúng đơn vị và thời điểm",
          "text": "Frontend kiểm tra nhanh để người dùng nhận phản hồi sớm; Rust vẫn kiểm tra lại trước tác dụng phụ. Một WebView bị lỗi, extension của môi trường phát triển hoặc mã gọi IPC trực tiếp không nhất thiết tuân thủ form. Kiểm tra rỗng, độ dài, miền giá trị và trạng thái nghiệp vụ tại lớp xử lý.\n\nTrong bài này tiêu đề được trim và giới hạn 80 Unicode scalar values bằng chars().count(). Đó không phải số byte và cũng chưa phải số ký tự hiển thị theo grapheme. Tài liệu hợp đồng cần ghi rõ đơn vị. Giới hạn tổng byte của tài liệu và số request đang chờ giải quyết rủi ro tài nguyên khác, không thể thay bằng giới hạn tiêu đề."
        },
        {
          "title": "Từ hàm thuần đến cửa sổ thật",
          "text": "Bài tập trên web kiểm chứng phép chuẩn hóa bằng thư viện chuẩn. Lab Cargo bên dưới nối hàm ấy với một cửa sổ Tauri dùng HTML và JavaScript cục bộ. Nó đăng ký đúng một command, đưa command vào manifest quyền và chỉ cấp quyền cho cửa sổ main. CSP giữ tài nguyên giao diện trong gói ứng dụng và chỉ mở kết nối IPC cần thiết.\n\nTrước khi chạy lab, cài các điều kiện nền tảng theo trang Prerequisites của Tauri: compiler và WebView khác nhau trên macOS, Windows, Linux. Giữ Cargo.lock sau lần chạy thành công. Kiểm thử cả chuỗi tiếng Việt và lỗi rỗng trong cửa sổ; cargo test chỉ chứng minh logic, chưa chứng minh render, focus hay capability hoạt động trong bản native."
        }
      ],
      "tip": "Giữ command ngắn: chuyển dữ liệu → kiểm tra nghiệp vụ → gọi dịch vụ → ánh xạ kết quả.",
      "exercise": {
        "title": "Chuẩn hóa tiêu đề ghi chú",
        "instructions": "Hoàn thiện normalize_title: bỏ khoảng trắng hai đầu và trả lỗi ổn định cho tiêu đề rỗng hoặc quá 80 Unicode scalar values.",
        "requirements": [
          "Trả Err(\"empty\") nếu sau trim không còn nội dung.",
          "Trả Err(\"too_long\") nếu chars().count() vượt 80.",
          "Giữ nguyên chữ hoa, dấu và khoảng trắng bên trong; trả String sở hữu dữ liệu."
        ]
      },
      "starterCode": "fn normalize_title(input: &str) -> Result<String, &'static str> {\n    todo!()\n}\nfn main() {\n    assert_eq!(normalize_title(\"  Ghi chú Rust  \"), Ok(\"Ghi chú Rust\".into()));\n    assert_eq!(normalize_title(\" \\n \"), Err(\"empty\"));\n    assert!(normalize_title(&\"ệ\".repeat(80)).is_ok());\n    assert_eq!(normalize_title(&\"ệ\".repeat(81)), Err(\"too_long\"));\n    assert_eq!(normalize_title(\"A  B\"), Ok(\"A  B\".into()));\n    println!(\"Tiêu đề hợp lệ: Ghi chú Rust\");\n}",
      "solutionCode": "fn normalize_title(input: &str) -> Result<String, &'static str> {\n    let title = input.trim();\n    if title.is_empty() { return Err(\"empty\"); }\n    if title.chars().count() > 80 { return Err(\"too_long\"); }\n    Ok(title.to_owned())\n}\nfn main() {\n    assert_eq!(normalize_title(\"  Ghi chú Rust  \"), Ok(\"Ghi chú Rust\".into()));\n    assert_eq!(normalize_title(\" \\n \"), Err(\"empty\"));\n    assert!(normalize_title(&\"ệ\".repeat(80)).is_ok());\n    assert_eq!(normalize_title(&\"ệ\".repeat(81)), Err(\"too_long\"));\n    assert_eq!(normalize_title(\"A  B\"), Ok(\"A  B\".into()));\n    println!(\"Tiêu đề hợp lệ: Ghi chú Rust\");\n}",
      "expectedOutput": "Tiêu đề hợp lệ: Ghi chú Rust",
      "hints": [
        "Gọi trim trước khi kiểm tra.",
        "len() trên str đo byte; dùng chars().count() theo hợp đồng của bài."
      ],
      "quiz": {
        "question": "Frontend đã kiểm tra tiêu đề. Vì sao Rust vẫn cần kiểm tra?",
        "options": [
          "Serde tự động kiểm tra mọi quy tắc nghiệp vụ.",
          "Lời gọi IPC có thể đi vòng form; lớp gây tác dụng phụ phải bảo vệ bất biến.",
          "TypeScript bảo đảm dữ liệu runtime luôn đúng.",
          "Rust chỉ cần kiểm tra khi ứng dụng kết nối Internet."
        ],
        "correct": 1,
        "explanation": "Kiểu dữ liệu và kiểm tra trên form không bảo đảm mọi lời gọi IPC tuân theo quy tắc sản phẩm. Backend native phải kiểm tra trước thay đổi trạng thái hoặc tài nguyên."
      },
      "reference": {
        "label": "Tauri: calling Rust",
        "url": "https://v2.tauri.app/develop/calling-rust/"
      },
      "localLab": {
        "title": "Cửa sổ kiểm tra tiêu đề bằng Tauri 2",
        "instructions": "Tạo các tệp trong một thư mục mới. Lab dùng Tauri 2.12.5, tauri-build 2.7.4, không cần Node hay framework frontend. Cài prerequisites của Tauri cho hệ điều hành trước khi chạy; đây là cửa sổ native, không chạy trong pane Rust trên web.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"desktop-title-lab\"\nversion = \"0.1.0\"\nedition = \"2024\"\n[build-dependencies]\ntauri-build = \"=2.7.4\"\n[dependencies]\ntauri = \"=2.12.5\"\n"
          },
          {
            "path": "build.rs",
            "content": "use std::{fs, path::Path};\n\n// Biểu tượng mẫu 32×32 RGBA, tự tạo để bản lab chỉ cần các tệp văn bản.\nconst ICON_PNG: &[u8] = &[\n    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,\n    0, 0, 0, 32, 0, 0, 0, 32, 8, 6, 0, 0, 0, 115, 122, 122,\n    244, 0, 0, 0, 61, 73, 68, 65, 84, 120, 218, 237, 214, 161, 17, 0,\n    32, 12, 0, 177, 206, 195, 40, 76, 204, 88, 104, 76, 209, 72, 20, 71,\n    47, 226, 125, 228, 199, 232, 45, 95, 22, 0, 0, 0, 95, 0, 114, 205,\n    35, 0, 0, 0, 0, 0, 128, 155, 0, 106, 0, 28, 17, 0, 64, 105,\n    192, 6, 3, 212, 104, 68, 84, 161, 107, 195, 0, 0, 0, 0, 73, 69,\n    78, 68, 174, 66, 96, 130,\n];\n\nfn main() {\n    fs::create_dir_all(\"icons\").expect(\"create icon directory\");\n    if !Path::new(\"icons/icon.png\").exists() {\n        fs::write(\"icons/icon.png\", ICON_PNG).expect(\"write PNG icon\");\n    }\n    if !Path::new(\"icons/icon.ico\").exists() {\n        // ICO một ảnh PNG, dành cho resource compiler trên Windows.\n        let mut ico = vec![0, 0, 1, 0, 1, 0, 32, 32, 0, 0, 1, 0, 32, 0];\n        ico.extend_from_slice(&(ICON_PNG.len() as u32).to_le_bytes());\n        ico.extend_from_slice(&22_u32.to_le_bytes());\n        ico.extend_from_slice(ICON_PNG);\n        fs::write(\"icons/icon.ico\", ico).expect(\"write ICO icon\");\n    }\n    tauri_build::try_build(tauri_build::Attributes::new()\n        .app_manifest(tauri_build::AppManifest::new().commands(&[\"validate_title\"])))\n        .expect(\"build Tauri manifest\");\n}\n"
          },
          {
            "path": "tauri.conf.json",
            "content": "{\n  \"$schema\": \"https://schema.tauri.app/config/2\",\n  \"productName\": \"Title Lab\",\n  \"version\": \"0.1.0\",\n  \"identifier\": \"dev.learnrust.titlelab\",\n  \"build\": { \"frontendDist\": \"ui\" },\n  \"app\": {\n    \"withGlobalTauri\": true,\n    \"windows\": [{ \"label\": \"main\", \"title\": \"Title Lab\", \"width\": 640, \"height\": 400 }],\n    \"security\": {\n      \"capabilities\": [\"main\"],\n      \"csp\": \"default-src 'self'; script-src 'self'; style-src 'self'; connect-src ipc: http://ipc.localhost\"\n    }\n  },\n  \"bundle\": { \"active\": false }\n}\n"
          },
          {
            "path": "permissions/validate.toml",
            "content": "[[permission]]\nidentifier = \"validate-name\"\ndescription = \"Validate a note title without accessing files\"\ncommands.allow = [\"validate_title\"]\n"
          },
          {
            "path": "capabilities/main.json",
            "content": "{\n  \"identifier\": \"main\",\n  \"description\": \"Title validation in the main window\",\n  \"windows\": [\"main\"],\n  \"permissions\": [\"validate-name\"]\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "fn normalize_title(input: &str) -> Result<String, &'static str> {\n    let title = input.trim();\n    if title.is_empty() { return Err(\"empty\"); }\n    if title.chars().count() > 80 { return Err(\"too_long\"); }\n    Ok(title.to_owned())\n}\n#[tauri::command]\nfn validate_title(title: String) -> Result<String, String> {\n    normalize_title(&title).map_err(str::to_owned)\n}\nfn main() {\n    tauri::Builder::default()\n        .invoke_handler(tauri::generate_handler![validate_title])\n        .run(tauri::generate_context!())\n        .expect(\"run Title Lab\");\n}\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn validation() {\n        assert_eq!(normalize_title(\" Rust \"), Ok(\"Rust\".into()));\n        assert_eq!(normalize_title(\"  \"), Err(\"empty\"));\n        assert!(normalize_title(&\"ệ\".repeat(80)).is_ok());\n        assert_eq!(normalize_title(&\"ệ\".repeat(81)), Err(\"too_long\"));\n    }\n}\n"
          },
          {
            "path": "ui/index.html",
            "content": "<!doctype html>\n<html lang=\"vi\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Title Lab</title><script src=\"app.js\" defer></script></head><body><h1>Kiểm tra tiêu đề</h1><form id=\"form\"><label for=\"title\">Tiêu đề ghi chú</label><input id=\"title\" value=\"Ghi chú Rust\"><button id=\"submit\">Kiểm tra</button></form><p id=\"result\" role=\"status\"></p></body></html>\n"
          },
          {
            "path": "ui/app.js",
            "content": "const form = document.querySelector('#form');\nconst button = document.querySelector('#submit');\nconst output = document.querySelector('#result');\nform.addEventListener('submit', async (event) => {\n  event.preventDefault();\n  button.disabled = true;\n  output.textContent = 'Đang kiểm tra…';\n  try {\n    const title = await window.__TAURI__.core.invoke('validate_title', { title: document.querySelector('#title').value });\n    output.textContent = 'Hợp lệ: ' + title;\n  } catch (error) {\n    output.textContent = error === 'empty' ? 'Hãy nhập tiêu đề.' : error === 'too_long' ? 'Tiêu đề quá dài.' : 'Chưa kiểm tra được tiêu đề.';\n  } finally { button.disabled = false; }\n});\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run"
        ],
        "checks": [
          "cargo test xác nhận quy tắc tiêu đề.",
          "Cửa sổ hiển thị kết quả tiếng Việt và báo lỗi khi nhập toàn khoảng trắng.",
          "Bỏ validate-name khỏi capability rồi biên dịch lại: command bị từ chối; khôi phục quyền trước khi tiếp tục.",
          "Không có quyền fs, shell hoặc nguồn web từ xa trong capability."
        ]
      },
      "illustration": {
        "src": "/images/lessons/desktop-shared.webp",
        "alt": "Ứng dụng ghi chú trên laptop, điện thoại và máy tính bảng cùng dùng một lõi xử lý.",
        "caption": "Giao diện thay đổi theo thiết bị; quy tắc nghiệp vụ vẫn nằm trong lõi Rust."
      }
    },
    {
      "id": "desktop-state",
      "moduleId": "track-desktop",
      "title": "Trạng thái, tác vụ nền và kết quả đến muộn",
      "duration": 55,
      "description": "Giữ giao diện phản hồi khi xử lý dữ liệu; kiểm soát đồng thời bằng revision, job ID và hàng đợi giới hạn.",
      "objectives": [
        "Đặt nguồn dữ liệu chuẩn ở lớp phù hợp",
        "Giữ thời gian khóa ngắn",
        "Phát hiện cập nhật từ phiên bản cũ",
        "Bỏ kết quả nền thuộc yêu cầu đã bị thay thế"
      ],
      "sections": [
        {
          "title": "Chọn nơi sở hữu trạng thái",
          "text": "Trạng thái giao diện như tab đang mở có thể nằm ở frontend. Dữ liệu cần nhất quán giữa cửa sổ, tác vụ nền và lưu trữ nên có một nơi quản lý trong Rust. Tauri cung cấp State cho truy cập dữ liệu đã đăng ký bằng manage; kiểu lấy ra phải khớp kiểu đã đăng ký. Việc thêm Arc vào mọi chỗ không tự giải quyết đồng thời.\n\nMột ghi chú nên có nội dung và revision. Hai cửa sổ có thể đọc cùng revision rồi sửa độc lập. Nếu command chỉ nhận nội dung mới, lần lưu sau âm thầm ghi đè lần trước. Gửi expected_revision và kiểm tra cùng lúc với cập nhật giúp phát hiện xung đột; giao diện có thể cho người dùng so sánh, tải lại hoặc chủ động ghi đè."
        },
        {
          "title": "Khóa ngắn, công việc dài ở ngoài khóa",
          "text": "Mutex bảo vệ một bất biến trong khoảng thao tác nhỏ. Khi chỉ cần lấy snapshot để tìm kiếm, khóa, sao chép dữ liệu cần thiết rồi nhả khóa trước khi chạy tác vụ dài. Giữ lock trong lúc đọc tệp, gọi mạng hoặc chờ người dùng khiến cửa sổ khác phải đợi dù chúng không liên quan đến công việc ấy.\n\nTác vụ CPU nặng không nên nằm trong một command đồng bộ chặn đường phản hồi giao diện. Chuyển nó sang worker phù hợp và giới hạn số worker; gọi async không tự chia nhỏ phép tính. Thiết kế kết quả lỗi cho Mutex bị poison thay vì unwrap xuyên suốt code sản phẩm. Nếu hồi phục, phải xác minh bất biến dữ liệu còn đúng trước khi tiếp tục.",
          "code": "// Mẫu ý tưởng trong command; dữ liệu được sao chép dưới khóa ngắn.\nlet snapshot = {\n    let guard = state.lock().map_err(|_| \"state_unavailable\")?;\n    guard.document.clone()\n};\n// Sau khối này mới thực hiện xử lý snapshot tốn thời gian."
        },
        {
          "title": "Job ID và yêu cầu hủy",
          "text": "Người dùng gõ truy vấn A rồi đổi sang B. Nếu A hoàn thành muộn hơn, giao diện không được hiển thị A thay B. Mỗi tác vụ mang job ID hoặc generation; người nhận chỉ áp dụng kết quả của yêu cầu còn hiệu lực. Tín hiệu hủy giúp tiết kiệm tài nguyên, còn kiểm tra ID bảo vệ tính đúng đắn ngay cả khi hủy đến quá muộn.\n\nHủy là một giao thức, không phải phép hoàn tác mọi thứ. Worker kiểm tra tín hiệu tại các điểm an toàn, dọn tài nguyên và báo trạng thái đã dừng. Đừng quảng cáo đã hủy nếu thao tác lưu bên ngoài đã hoàn tất. Khi đóng cửa sổ, xác định công việc nào tiếp tục trong nền và công việc nào phải dừng, thay vì để thread hoặc task tồn tại không có chủ quản."
        },
        {
          "title": "Tiến độ không được biến thành tắc nghẽn",
          "text": "Một worker quét hàng triệu dòng không nên gửi một sự kiện cho mỗi dòng. Gộp tiến độ theo khoảng công việc hoặc nhịp thời gian, chỉ gửi dữ liệu cần vẽ. Hàng đợi có giới hạn buộc bên gửi và bên nhận thống nhất cách chờ, bỏ cập nhật trung gian hoặc từ chối thêm việc. Kết quả cuối và lỗi cần được phân biệt với sự kiện tiến độ có thể bỏ.\n\nLab dưới đây chạy worker qua sync_channel với dung lượng nhỏ và xử lý kết quả theo generation; nó kiểm thử giao thức trên host trước khi ghép vào Tauri. Sau đó thử trên cửa sổ thật: gõ nhanh, đổi tab, hủy giữa chừng, đóng rồi mở lại. Đo độ trễ phản hồi UI đồng thời với thời gian xử lý, vì một phép tính nhanh vẫn có thể tạo trải nghiệm kém nếu cập nhật quá dày."
        }
      ],
      "tip": "Hủy công việc cũ và từ chối kết quả cũ là hai việc bổ sung cho nhau.",
      "exercise": {
        "title": "Lưu ghi chú với revision",
        "instructions": "Hoàn thiện save để chỉ thay nội dung khi expected khớp revision hiện tại và revision còn tăng được.",
        "requirements": [
          "Sai revision trả conflict và không sửa note.",
          "Tràn revision trả exhausted và không sửa note.",
          "Thành công thay nội dung và tăng revision đúng một lần."
        ]
      },
      "starterCode": "#[derive(Debug, PartialEq)]\nstruct Note { text: String, revision: u64 }\nfn save(note: &mut Note, expected: u64, text: String) -> Result<u64, &'static str> {\n    todo!()\n}\nfn main() {\n    let mut note = Note { text: \"A\".into(), revision: 4 };\n    assert_eq!(save(&mut note, 4, \"B\".into()), Ok(5));\n    assert_eq!(save(&mut note, 4, \"C\".into()), Err(\"conflict\"));\n    assert_eq!(note, Note { text: \"B\".into(), revision: 5 });\n    let mut last = Note { text: \"Giữ lại\".into(), revision: u64::MAX };\n    assert_eq!(save(&mut last, u64::MAX, \"Mới\".into()), Err(\"exhausted\"));\n    assert_eq!(last.text, \"Giữ lại\");\n    println!(\"Đã lưu revision 5; từ chối bản cũ\");\n}",
      "solutionCode": "#[derive(Debug, PartialEq)]\nstruct Note { text: String, revision: u64 }\nfn save(note: &mut Note, expected: u64, text: String) -> Result<u64, &'static str> {\n    if note.revision != expected { return Err(\"conflict\"); }\n    let next = note.revision.checked_add(1).ok_or(\"exhausted\")?;\n    note.text = text;\n    note.revision = next;\n    Ok(next)\n}\nfn main() {\n    let mut note = Note { text: \"A\".into(), revision: 4 };\n    assert_eq!(save(&mut note, 4, \"B\".into()), Ok(5));\n    assert_eq!(save(&mut note, 4, \"C\".into()), Err(\"conflict\"));\n    assert_eq!(note, Note { text: \"B\".into(), revision: 5 });\n    let mut last = Note { text: \"Giữ lại\".into(), revision: u64::MAX };\n    assert_eq!(save(&mut last, u64::MAX, \"Mới\".into()), Err(\"exhausted\"));\n    assert_eq!(last.text, \"Giữ lại\");\n    println!(\"Đã lưu revision 5; từ chối bản cũ\");\n}",
      "expectedOutput": "Đã lưu revision 5; từ chối bản cũ",
      "hints": [
        "Kiểm tra mọi điều kiện thất bại trước khi gán text.",
        "checked_add trả Option, có thể đổi sang Result bằng ok_or."
      ],
      "quiz": {
        "question": "Đã gửi tín hiệu hủy tìm kiếm A rồi bắt đầu B. Kết quả A vẫn về. Nên làm gì?",
        "options": [
          "Luôn hiển thị kết quả về sau cùng.",
          "Chỉ kiểm tra chữ trong truy vấn.",
          "So job ID/generation và bỏ kết quả không còn hiệu lực.",
          "Giữ một Mutex trong suốt thời gian người dùng gõ."
        ],
        "correct": 2,
        "explanation": "Hủy có thể đến sau khi worker đã hoàn thành. ID của yêu cầu bảo đảm kết quả chỉ áp dụng vào trạng thái đang chờ nó, kể cả khi nội dung truy vấn trùng nhau."
      },
      "reference": {
        "label": "Tauri: quản lý State",
        "url": "https://v2.tauri.app/develop/state-management/"
      },
      "localLab": {
        "title": "Worker có hàng đợi giới hạn và generation",
        "instructions": "Lab host chỉ dùng thư viện chuẩn, chạy trên macOS, Windows hoặc Linux. Đây là lõi có thể gọi từ Tauri, không tạo cửa sổ và không mô phỏng quyền của hệ điều hành.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"desktop-worker-lab\"\nversion = \"0.1.0\"\nedition = \"2024\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "#[derive(Debug, PartialEq)]\npub struct Reply { pub generation: u64, pub lines: usize }\npub fn accept(active: u64, reply: Reply) -> Option<usize> {\n    (active == reply.generation).then_some(reply.lines)\n}\npub fn worker(input: std::sync::mpsc::Receiver<(u64, String)>, output: std::sync::mpsc::SyncSender<Reply>) {\n    for (generation, text) in input {\n        let reply = Reply { generation, lines: text.lines().count() };\n        if output.send(reply).is_err() { break; }\n    }\n}\n#[cfg(test)]\nmod tests {\n    use super::*;\n    use std::sync::mpsc::sync_channel;\n    #[test]\n    fn only_active_result_is_applied() {\n        let (jobs, incoming) = sync_channel(2);\n        let (results, outgoing) = sync_channel(2);\n        let thread = std::thread::spawn(move || worker(incoming, results));\n        jobs.send((1, \"old\".into())).unwrap();\n        jobs.send((2, \"one\\ntwo\".into())).unwrap();\n        drop(jobs);\n        assert_eq!(accept(2, outgoing.recv().unwrap()), None);\n        assert_eq!(accept(2, outgoing.recv().unwrap()), Some(2));\n        thread.join().unwrap();\n    }\n    #[test]\n    fn empty_document_has_zero_lines() {\n        assert_eq!(accept(7, Reply { generation: 7, lines: 0 }), Some(0));\n    }\n}\n"
          }
        ],
        "commands": [
          "cargo test"
        ],
        "checks": [
          "Hai unit test đều đạt; test không phụ thuộc sleep hoặc thứ tự scheduler.",
          "Kết quả generation 1 bị bỏ khi active là 2.",
          "Đóng sender công việc giúp worker thoát sau các công việc đã nhận; đây là drain shutdown, chưa phải hủy tính toán đang chạy."
        ]
      }
    },
    {
      "id": "desktop-files",
      "moduleId": "track-desktop",
      "title": "Tệp, hộp thoại và phạm vi truy cập",
      "duration": 50,
      "description": "Thiết kế thao tác mở/lưu tệp an toàn, xử lý symlink, xung đột và lỗi I/O mà không mất dữ liệu.",
      "objectives": [
        "Phân biệt chọn tệp với thao tác đọc/ghi",
        "Không coi kiểm tra chuỗi đường dẫn là sandbox hoàn chỉnh",
        "Xử lý hủy hộp thoại như trạng thái bình thường",
        "Thiết kế lưu và phục hồi theo hành vi nền tảng"
      ],
      "sections": [
        {
          "title": "Lựa chọn của người dùng là một bước riêng",
          "text": "Hộp thoại native giúp người dùng chọn tài nguyên. Một kết quả rỗng khi họ nhấn Hủy là trạng thái bình thường, không phải lỗi cần báo đỏ. Sau khi có đường dẫn, ứng dụng vẫn có thể gặp tệp bị xóa, thiếu quyền, ổ đĩa rời bị ngắt hoặc nội dung thay đổi. Đừng cập nhật nhãn Đã lưu chỉ vì hộp thoại đã đóng.\n\nTauri có plugin dialog và file-system riêng. Quyền mở hộp thoại, quyền gọi một thao tác tệp và phạm vi đường dẫn là các lớp cần xem xét cùng nhau. Cấu hình những quyền thật sự sử dụng; kiểm tra cơ chế scope của phiên bản plugin và vòng đời quyền sau khởi động lại thay vì giả định một lần chọn cho phép mọi tệp mãi mãi."
        },
        {
          "title": "Đường dẫn là tài nguyên, không chỉ là chuỗi",
          "text": "Một phép starts_with trên chuỗi dễ nhầm thư mục /notes với /notes-old. Path::starts_with so theo thành phần đường dẫn, nhưng kiểm tra từ vựng vẫn không giải quyết mọi symlink hoặc sự thay đổi giữa lúc kiểm tra và mở tệp. canonicalize yêu cầu tài nguyên tồn tại; tạo tệp mới cần xử lý parent và có chính sách khác.\n\nVới ứng dụng lưu ghi chú, một thiết kế đơn giản là để Rust ánh xạ NoteId sang vị trí trong thư mục do ứng dụng quản lý, thay vì cho frontend gửi đường dẫn tùy ý. Tên xuất tệp chỉ là tên lá đã kiểm tra. Bài tập thực hành chính sách tên lá ASCII nhỏ, cố ý không coi nó là bộ kiểm tra đường dẫn Windows đầy đủ hay cơ chế chống symlink."
        },
        {
          "title": "Lưu tệp và phát hiện thay đổi ngoài ứng dụng",
          "text": "Ghi đè trực tiếp có thể để tệp dở dang nếu quá trình ghi thất bại. Một chiến lược thường gặp là ghi tệp tạm trong cùng thư mục, hoàn tất ghi rồi thay thế đích. Cần tìm hiểu rename, ghi đè và flush của từng nền tảng; thao tác nguyên tử ở mức tên tệp không tự bảo đảm dữ liệu đã bền vững trước mất điện.\n\nTrước khi lưu, so phiên bản hoặc fingerprint đã đọc với trạng thái hiện tại để nhận biết công cụ khác đã sửa tệp. Mtime đơn lẻ có độ phân giải và hành vi khác nhau; yêu cầu nhất quán cao có thể cần hash hoặc giao thức khóa phù hợp. Khi xung đột, giữ bản người dùng đang sửa để họ có thể so sánh, lưu bản khác hoặc thử lại có chủ đích."
        },
        {
          "title": "Chặn ở đúng nơi và kiểm thử lỗi thật",
          "text": "File-system plugin áp dụng scope cho API của plugin. Một custom command gọi std::fs không tự nhận hàng rào đó; chính command phải kiểm tra đầu vào và giới hạn tài nguyên trước khi mở tệp. Tránh command read_any_file có quyền rộng chỉ vì giao diện hiện tại gọi nó với đường dẫn tốt.\n\nViết test bằng thư mục tạm thuộc bài test, không dùng tài liệu cá nhân. Các ca cần có gồm hủy chọn, tên rỗng, tệp lớn, encoding không phải UTF-8, permission denied, đích có sẵn và tệp thay đổi giữa hai lần lưu. Với symlink hay race liên quan hệ điều hành, ghi rõ nền tảng đã kiểm tra. Khi hiển thị lỗi, cho biết người dùng có thể chọn lại hay thử lại; giữ nội dung chưa lưu ở nguyên chỗ."
        }
      ],
      "tip": "Thư mục được chọn, quyền plugin và kiểm tra trong custom command phải phù hợp với cùng một mô hình truy cập.",
      "exercise": {
        "title": "Tên xuất ghi chú theo chính sách hẹp",
        "instructions": "Tạo tên tệp từ một mã ghi chú. Chỉ nhận 1–40 byte ASCII chữ/số, dấu gạch ngang hoặc gạch dưới; thêm đuôi .txt.",
        "requirements": [
          "Từ chối chuỗi rỗng hoặc dài hơn 40 byte.",
          "Từ chối dấu chấm, dấu phân cách đường dẫn, khoảng trắng và ký tự ngoài ASCII.",
          "Không đọc hoặc ghi hệ thống tệp; kết quả chỉ là tên lá của chính sách bài tập."
        ]
      },
      "starterCode": "fn export_name(id: &str) -> Result<String, &'static str> { todo!() }\nfn main() {\n    assert_eq!(export_name(\"note_42-a\"), Ok(\"note_42-a.txt\".into()));\n    for bad in [\"\", \"../secret\", \"a/b\", \"a\\\\b\", \"note.txt\", \"ghi chú\"] {\n        assert_eq!(export_name(bad), Err(\"invalid_id\"));\n    }\n    assert!(export_name(&\"a\".repeat(40)).is_ok());\n    assert_eq!(export_name(&\"a\".repeat(41)), Err(\"invalid_id\"));\n    println!(\"Tên xuất: note_42-a.txt\");\n}",
      "solutionCode": "fn export_name(id: &str) -> Result<String, &'static str> {\n    if id.is_empty() || id.len() > 40 || !id.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_') {\n        return Err(\"invalid_id\");\n    }\n    Ok(format!(\"{id}.txt\"))\n}\nfn main() {\n    assert_eq!(export_name(\"note_42-a\"), Ok(\"note_42-a.txt\".into()));\n    for bad in [\"\", \"../secret\", \"a/b\", \"a\\\\b\", \"note.txt\", \"ghi chú\"] {\n        assert_eq!(export_name(bad), Err(\"invalid_id\"));\n    }\n    assert!(export_name(&\"a\".repeat(40)).is_ok());\n    assert_eq!(export_name(&\"a\".repeat(41)), Err(\"invalid_id\"));\n    println!(\"Tên xuất: note_42-a.txt\");\n}",
      "expectedOutput": "Tên xuất: note_42-a.txt",
      "hints": [
        "bytes().all kiểm tra whitelist ASCII rõ hơn việc chỉ cấm ../.",
        "Tên lá hợp lệ theo bài vẫn chưa giải quyết tên dành riêng, symlink hoặc quyền hệ điều hành."
      ],
      "quiz": {
        "question": "Đã cấu hình scope cho plugin fs. Custom command dùng std::fs có tự bị giới hạn tương tự không?",
        "options": [
          "Có, mọi lời gọi hệ thống tệp của Rust đều đi qua plugin.",
          "Có, miễn là command dùng PathBuf.",
          "Không; API plugin và lời gọi Rust tùy chỉnh là hai đường truy cập khác nhau.",
          "Không cần giới hạn vì Rust an toàn bộ nhớ."
        ],
        "correct": 2,
        "explanation": "Scope áp dụng cho API plugin tương ứng. Mã Rust tự mở tài nguyên phải thực hiện kiểm tra của chính nó; an toàn bộ nhớ không thay thế kiểm soát quyền truy cập."
      },
      "reference": {
        "label": "Tauri: File System và security",
        "url": "https://v2.tauri.app/plugin/file-system/"
      }
    },
    {
      "id": "desktop-capabilities",
      "moduleId": "track-desktop",
      "title": "Capability, CSP và nội dung không đáng tin",
      "duration": 55,
      "description": "Giới hạn bề mặt IPC theo cửa sổ; bảo vệ cả lệnh plugin lẫn command tự viết.",
      "objectives": [
        "Đọc và kiểm tra capability theo window label",
        "Phân biệt permission với scope dữ liệu",
        "Đưa custom commands vào manifest quyền",
        "Giới hạn nội dung và script chạy trong WebView"
      ],
      "sections": [
        {
          "title": "Mỗi cửa sổ có nhiệm vụ và quyền riêng",
          "text": "Một cửa sổ chính có thể cần mở ghi chú, trong khi cửa sổ xem trước chỉ cần hiển thị nội dung. Capability gắn các quyền với cửa sổ hoặc WebView. Nếu một cửa sổ khớp nhiều capability, phải xem tổng quyền nhận được; một cấu hình hẹp không làm mất quyền rộng từ cấu hình khác. Dùng label cụ thể để review dễ hơn wildcard.\n\nPermission quyết định command nào có thể gọi, còn scope giới hạn dữ liệu hay tài nguyên mà command được phép tác động khi API đó hỗ trợ scope. Hai lớp không thay thế nhau. Quyền gọi hàm đọc tệp với phạm vi một thư mục khác rất nhiều quyền đọc toàn bộ thư mục người dùng. Viết ma trận cửa sổ × thao tác trước khi thêm plugin giúp thấy những quyền không cần thiết."
        },
        {
          "title": "Command tự viết cần được đưa vào chính sách",
          "text": "Không nên suy từ plugin sang mọi command ứng dụng. Theo tài liệu Tauri, các command được đăng ký bằng invoke_handler có thể dùng từ các cửa sổ mặc định; AppManifest::commands cho phép đưa chúng vào cơ chế quyền. Lab đầu lộ trình đã khai báo manifest, một permission đặt tên rõ và capability chỉ cho main.\n\nKhi bổ sung command mới, review đồng thời phần đăng ký, manifest và quyền gọi. Kiểm tra từ một cửa sổ không có quyền và từ input không hợp lệ. Capability không hiểu quy tắc nghiệp vụ như tài liệu đã khóa hay người dùng chưa lưu; các điều kiện ấy vẫn nằm trong Rust. Đừng chuyển lỗi quyền thành cấp mọi quyền chỉ để bản demo chạy được."
        },
        {
          "title": "CSP bảo vệ thứ được chạy trong giao diện",
          "text": "Một tệp ghi chú hoặc trang HTML từ bên ngoài có thể chứa markup không đáng tin. Hiển thị văn bản bằng textContent hoặc cơ chế escaping của framework; nếu hỗ trợ Markdown/HTML, dùng bộ lọc phù hợp và xác định chính sách liên kết, hình ảnh, script. Không đưa chuỗi chưa kiểm tra vào innerHTML rồi dựa vào Rust để cứu phần giao diện.\n\nCSP giới hạn nguồn script, tài nguyên và kết nối của WebView; chỉ có tác dụng khi được cấu hình. Tauri bổ sung hash hoặc nonce cho tài nguyên đóng gói theo cơ chế build. Giữ policy phù hợp tài nguyên thực sự dùng và kiểm tra bản release. Tắt CSP để chữa lỗi tải font hay thêm quyền web từ xa có thể thay đổi đáng kể bề mặt tấn công của ứng dụng."
        },
        {
          "title": "Kiểm thử việc bị từ chối",
          "text": "Một bộ test quyền chỉ có ca thành công chưa chứng minh giới hạn đúng. Với mỗi thao tác nhạy cảm, thử cửa sổ được cấp, cửa sổ không được cấp, đường dẫn ngoài scope và dữ liệu vượt kích thước. Bài tập mô hình hóa chính sách allow/deny có deny ưu tiên; đây là mô hình học tập, không phải bản sao thuật toán ACL của Tauri.\n\nĐối với nội dung web từ xa, ưu tiên mở trong trình duyệt ngoài hoặc một bề mặt không có API native. Nếu sản phẩm bắt buộc cho remote origin dùng IPC, phải review origin, frame, redirect và hành vi của từng nền tảng theo tài liệu hiện hành. Lỗi XSS trong phần giao diện càng nguy hiểm khi IPC có quyền rộng; giảm quyền và xử lý dữ liệu đúng là hai lớp bảo vệ bổ sung."
        }
      ],
      "tip": "Đưa ca bị từ chối vào kiểm thử ngay khi cấp một quyền mới.",
      "exercise": {
        "title": "Ma trận quyền cho cửa sổ",
        "instructions": "Cài allowed cho một chính sách học tập: chỉ cửa sổ main hoặc preview đã khai báo mới hợp lệ; deny luôn thắng allow; các thao tác không liệt kê đều bị từ chối.",
        "requirements": [
          "main được đọc và lưu; preview chỉ được đọc.",
          "Danh sách deny của lời gọi có ưu tiên hơn quyền mặc định.",
          "Cửa sổ hoặc thao tác lạ trả false; hàm không thay đổi danh sách đầu vào."
        ]
      },
      "starterCode": "fn allowed(window: &str, action: &str, deny: &[&str]) -> bool { todo!() }\nfn main() {\n    assert!(allowed(\"main\", \"read\", &[]));\n    assert!(allowed(\"main\", \"save\", &[]));\n    assert!(allowed(\"preview\", \"read\", &[]));\n    assert!(!allowed(\"preview\", \"save\", &[]));\n    assert!(!allowed(\"main\", \"save\", &[\"save\"]));\n    assert!(!allowed(\"remote\", \"read\", &[]));\n    assert!(!allowed(\"main\", \"shell\", &[]));\n    println!(\"Quyền theo cửa sổ đã được kiểm tra\");\n}",
      "solutionCode": "fn allowed(window: &str, action: &str, deny: &[&str]) -> bool {\n    if deny.contains(&action) { return false; }\n    match window {\n        \"main\" => matches!(action, \"read\" | \"save\"),\n        \"preview\" => action == \"read\",\n        _ => false,\n    }\n}\nfn main() {\n    assert!(allowed(\"main\", \"read\", &[]));\n    assert!(allowed(\"main\", \"save\", &[]));\n    assert!(allowed(\"preview\", \"read\", &[]));\n    assert!(!allowed(\"preview\", \"save\", &[]));\n    assert!(!allowed(\"main\", \"save\", &[\"save\"]));\n    assert!(!allowed(\"remote\", \"read\", &[]));\n    assert!(!allowed(\"main\", \"shell\", &[]));\n    println!(\"Quyền theo cửa sổ đã được kiểm tra\");\n}",
      "expectedOutput": "Quyền theo cửa sổ đã được kiểm tra",
      "hints": [
        "Kiểm tra deny trước match.",
        "Nhánh _ phải từ chối mặc định."
      ],
      "quiz": {
        "question": "Một window khớp hai capability, một hẹp và một rộng. Nên review thế nào?",
        "options": [
          "Capability cuối cùng luôn ghi đè toàn bộ quyền trước.",
          "Chỉ nhìn capability có tên gần với tên window nhất.",
          "Xét tổng quyền mà các capability áp dụng cấp cho window, rồi kiểm tra deny/scope tương ứng.",
          "Đổi label window thành main là đủ an toàn."
        ],
        "correct": 2,
        "explanation": "Các capability cùng áp dụng không tự làm quyền hẹp lại. Phải kiểm tra toàn bộ quyền, phạm vi và các quy tắc từ chối; tránh vô tình cấp rộng từ một file khác."
      },
      "reference": {
        "label": "Tauri: capabilities và custom commands",
        "url": "https://v2.tauri.app/security/capabilities/"
      }
    },
    {
      "id": "desktop-release",
      "moduleId": "track-desktop",
      "title": "Đóng gói, ký ứng dụng và cập nhật",
      "duration": 50,
      "description": "Chuẩn bị artifact theo nền tảng, tách các loại chữ ký và bảo vệ dữ liệu qua phiên bản ứng dụng.",
      "objectives": [
        "Phân biệt binary phát triển với artifact phân phối",
        "Tách chữ ký hệ điều hành và chữ ký updater",
        "Lập kế hoạch migration dữ liệu",
        "Xác định điều kiện trước khi đề nghị cài cập nhật"
      ],
      "sections": [
        {
          "title": "Một bản build không đại diện mọi nền tảng",
          "text": "macOS, Windows và Linux có định dạng gói, WebView, quyền và kỳ vọng người dùng khác nhau. Build thành công trên máy phát triển chỉ là bước đầu. Ghi rõ hệ điều hành, kiến trúc CPU và phiên bản công cụ của từng artifact; kiểm tra mở ứng dụng và các thao tác native trên mục tiêu đó. Đừng đổi phần mở rộng tệp rồi coi như đã có installer cho hệ khác.\n\nKhóa dependency giúp tái hiện đầu vào build. Giữ Cargo.lock, lockfile frontend và cấu hình build trong repo. Dùng tài nguyên đóng gói thay vì tham chiếu tới thư mục máy tác giả. Kiểm tra đường dẫn chứa khoảng trắng, tài khoản không có quyền quản trị và máy thiếu môi trường phát triển để phát hiện phụ thuộc vô tình vào máy build."
        },
        {
          "title": "Hai mục đích của chữ ký",
          "text": "Ký mã theo nền tảng giúp hệ điều hành và người nhận xác minh nhà phát hành theo cơ chế của nền tảng. Notarization của macOS là một bước khác cần làm theo hướng dẫn phân phối. Chữ ký updater của Tauri xác minh artifact cập nhật bằng khóa đã cấu hình trong ứng dụng; nó không thay thế mọi yêu cầu ký mã của hệ điều hành.\n\nGiữ khóa riêng trong nơi quản lý bí mật của quy trình phát hành, tách khỏi mã nguồn và gói cài. Giao diện người dùng chỉ cần biết phiên bản mới, thay đổi chính và tác động tới dữ liệu. Nếu mất khóa hoặc đổi cơ chế phát hành, phải có kế hoạch chuyển tiếp; không giải quyết bằng tắt xác minh chữ ký hay dùng giao thức tải không an toàn."
        },
        {
          "title": "Cập nhật dữ liệu cần tương thích",
          "text": "Một ứng dụng mới có thể đọc schema mới nhưng phiên bản cũ chưa chắc đọc được. Bởi vậy rollback binary không tự bảo đảm rollback dữ liệu. Lưu version của định dạng, sao lưu phù hợp trước migration và kiểm tra việc mở dữ liệu từ bản phát hành trước. Thiết kế migration có thể chạy lại an toàn hoặc phát hiện rõ trạng thái dở dang.\n\nNếu người dùng đang chỉnh tài liệu chưa lưu, cập nhật ngay có thể gây mất việc. Quy trình nên kiểm tra trạng thái bận, đề nghị lưu hoặc hoãn, rồi mới cài theo hành vi nền tảng. Việc tải xong artifact không có nghĩa toàn bộ tiến trình ứng dụng đã dừng hay dữ liệu đã được đồng bộ; các bước phải có trạng thái và xử lý lỗi cụ thể."
        },
        {
          "title": "Thử trên artifact đã định phát hành",
          "text": "Tạo ma trận gồm cài mới, nâng cấp từ bản trước, thiếu mạng, chữ ký sai, không đủ dung lượng và migration thất bại. Kiểm tra artifact đã ký nếu có thay đổi sau bước ký; test source hoặc debug binary không đủ thay cho gói cuối. Release note nên mô tả thay đổi người dùng quan tâm và những trường hợp cần sao lưu.\n\nBài tập dùng tuple ba số để mô hình hóa phiên bản ổn định, không phải parser SemVer đầy đủ. Nó chỉ quyết định có nên đề nghị cập nhật theo target, channel và trạng thái tài liệu. Xác minh chữ ký, URL và tải artifact vẫn thuộc updater thật. Việc tách quyết định sản phẩm khỏi tác vụ cài giúp unit test rõ ràng mà không phải thực hiện cập nhật máy trong bài học."
        }
      ],
      "tip": "Đánh giá rollback ứng dụng và rollback dữ liệu thành hai kế hoạch riêng.",
      "exercise": {
        "title": "Khi nào đề nghị cập nhật?",
        "instructions": "Hoàn thiện should_offer. Chỉ đề nghị bản ổn định mới hơn, đúng target đang chạy và khi không có tài liệu chưa lưu.",
        "requirements": [
          "So phiên bản tuple (major, minor, patch) theo thứ tự số.",
          "Không đề nghị target khác hoặc channel khác stable.",
          "Không đề nghị bản bằng/cũ hơn và không đề nghị khi dirty=true."
        ]
      },
      "starterCode": "fn should_offer(current: (u32,u32,u32), next: (u32,u32,u32), target: &str, running: &str, channel: &str, dirty: bool) -> bool { todo!() }\nfn main() {\n    assert!(should_offer((1,9,0), (1,10,0), \"mac-arm64\", \"mac-arm64\", \"stable\", false));\n    assert!(!should_offer((2,0,0), (1,99,0), \"linux\", \"linux\", \"stable\", false));\n    assert!(!should_offer((1,0,0), (1,0,0), \"linux\", \"linux\", \"stable\", false));\n    assert!(!should_offer((1,0,0), (2,0,0), \"windows\", \"linux\", \"stable\", false));\n    assert!(!should_offer((1,0,0), (2,0,0), \"linux\", \"linux\", \"beta\", false));\n    assert!(!should_offer((1,0,0), (2,0,0), \"linux\", \"linux\", \"stable\", true));\n    println!(\"Đề nghị phiên bản 1.10.0 đúng nền tảng\");\n}",
      "solutionCode": "fn should_offer(current: (u32,u32,u32), next: (u32,u32,u32), target: &str, running: &str, channel: &str, dirty: bool) -> bool {\n    next > current && target == running && channel == \"stable\" && !dirty\n}\nfn main() {\n    assert!(should_offer((1,9,0), (1,10,0), \"mac-arm64\", \"mac-arm64\", \"stable\", false));\n    assert!(!should_offer((2,0,0), (1,99,0), \"linux\", \"linux\", \"stable\", false));\n    assert!(!should_offer((1,0,0), (1,0,0), \"linux\", \"linux\", \"stable\", false));\n    assert!(!should_offer((1,0,0), (2,0,0), \"windows\", \"linux\", \"stable\", false));\n    assert!(!should_offer((1,0,0), (2,0,0), \"linux\", \"linux\", \"beta\", false));\n    assert!(!should_offer((1,0,0), (2,0,0), \"linux\", \"linux\", \"stable\", true));\n    println!(\"Đề nghị phiên bản 1.10.0 đúng nền tảng\");\n}",
      "expectedOutput": "Đề nghị phiên bản 1.10.0 đúng nền tảng",
      "hints": [
        "Tuple số đã hỗ trợ Ord theo từng thành phần.",
        "Kết hợp các điều kiện bằng &&; hàm không tải hay cài artifact."
      ],
      "quiz": {
        "question": "Artifact đã có chữ ký updater. Có thể bỏ qua ký mã theo hệ điều hành không?",
        "options": [
          "Có, hai chữ ký có cùng chức năng trong mọi môi trường.",
          "Không thể suy ra như vậy; updater và cơ chế tin cậy của hệ điều hành phục vụ các bước xác minh khác nhau.",
          "Có nếu ứng dụng chỉ viết bằng Rust.",
          "Chỉ cần dùng URL HTTPS, không cần loại chữ ký nào."
        ],
        "correct": 1,
        "explanation": "Updater xác minh nguồn artifact theo khóa ứng dụng. OS code signing, notarization và yêu cầu phân phối là các lớp khác cần áp dụng theo nền tảng và kênh phát hành."
      },
      "reference": {
        "label": "Tauri: ký và cấu hình updater",
        "url": "https://v2.tauri.app/plugin/updater/"
      }
    },
    {
      "id": "desktop-quality",
      "moduleId": "track-desktop",
      "title": "Kiểm thử, hiệu năng và trải nghiệm desktop",
      "duration": 55,
      "description": "Kiểm chứng từ hàm Rust đến cửa sổ native; đo điểm nghẽn và kiểm tra hành vi bàn phím, lỗi và dữ liệu lớn.",
      "objectives": [
        "Phân chia kiểm thử logic, IPC và native",
        "Không đánh đồng mock IPC với quyền thật",
        "Giảm khối lượng dữ liệu và cập nhật UI",
        "Đo hiệu năng với kịch bản có thể tái hiện"
      ],
      "sections": [
        {
          "title": "Mỗi lớp kiểm thử trả lời một câu hỏi",
          "text": "Unit test của crate nghiệp vụ xác nhận quy tắc dữ liệu và các trạng thái biên. Test hợp đồng IPC kiểm tra tên command, trường JSON và ánh xạ lỗi. Test giao diện với mock IPC giúp kiểm tra loading, lỗi và bàn phím nhanh, nhưng chưa mở tài nguyên native hoặc áp dụng đúng toàn bộ cơ chế quyền của bản đóng gói.\n\nSau những lớp nhanh, chạy kịch bản trên ứng dụng thật để xác nhận cửa sổ, hộp thoại, capability và hệ thống tệp. Tài liệu Tauri hiện mô tả WebdriverIO với embedded driver cho cả macOS, Windows, Linux; cách dùng trực tiếp tauri-driver có giới hạn nền tảng khác. Chọn cơ chế phù hợp ma trận hỗ trợ và không đóng gói các API hỗ trợ kiểm thử có quyền rộng vào bản dành cho người dùng."
        },
        {
          "title": "Đo trước khi tối ưu",
          "text": "Nếu tìm kiếm chậm, tách thời gian đọc tệp, phân tích, xếp hạng, serialize IPC và render. Chuyển vòng lặp từ JavaScript sang Rust có thể không cải thiện đáng kể nếu phần lớn thời gian là gửi một JSON khổng lồ rồi tạo hàng chục nghìn DOM node. Thử dữ liệu có kích thước và phân bố được ghi lại; chạy nhiều lần và phân biệt khởi động lạnh với nóng.\n\nĐo độ trễ mà người dùng cảm nhận khi gõ, không chỉ thời gian tổng. Phân trang hoặc ảo hóa danh sách làm lượng UI hiện diện nhỏ hơn. Trả preview và ID trước, tải nội dung đầy đủ khi cần. Giới hạn số kết quả, kích thước thông điệp và tốc độ gửi tiến độ ở IPC để giảm cả CPU lẫn bộ nhớ đỉnh."
        },
        {
          "title": "Trạng thái UI phải phản ánh công việc thật",
          "text": "Một nút bị vô hiệu hóa không có lời giải thích khiến người học hoặc người dùng đoán nguyên nhân. Mỗi luồng quan trọng cần trạng thái rỗng, đang xử lý, lỗi có thể thử lại và hoàn tất. Tác vụ hủy nên giữ phần dữ liệu còn hữu ích; lỗi lưu không được xóa nội dung người dùng đã nhập. Khi kết quả nền cập nhật, giữ vị trí cuộn và focus nếu họ đang làm việc.\n\nKiểm tra bằng bàn phím: Tab đi theo thứ tự hợp lý, Enter kích hoạt đúng hành động, Escape đóng hộp thoại khi phù hợp và focus trở về nơi mở nó. Thử cỡ chữ lớn, tương phản ở sáng/tối và reduced motion. Trên desktop còn có phím tắt hệ điều hành, menu, nhiều cửa sổ và thao tác đóng ứng dụng; không chỉ thu nhỏ một trang web rồi coi là xong."
        },
        {
          "title": "Nghiệm thu bằng một kịch bản có bằng chứng",
          "text": "Chọn chuỗi thao tác hoàn chỉnh: mở thư mục mẫu, tìm ghi chú, sửa, lưu, đổi truy vấn nhanh, hủy lập chỉ mục và mở lại ứng dụng. Ghi phiên bản build, máy, dữ liệu, các mốc thời gian và kết quả mong đợi. Chụp trạng thái lỗi nếu cần giải thích, nhưng không ghi nội dung riêng tư vào log hiệu năng.\n\nBài tập tính khoảng phần tử cần hiển thị khi ảo hóa danh sách. Chặn giới hạn và xử lý tràn số giúp mô hình không panic với đầu vào lớn. Sau đó đưa logic tương tự vào giao diện và đo lại bằng kịch bản thật. Tiêu chí hoàn thành dự án nên gắn với hành vi và số đo có thể lặp lại, không chỉ số dòng code hoặc việc cửa sổ đã hiện lên một lần."
        }
      ],
      "tip": "Mock giúp test nhanh; artifact native mới xác nhận tích hợp với hệ điều hành.",
      "exercise": {
        "title": "Khoảng dữ liệu cho danh sách ảo hóa",
        "instructions": "Tính [start, end) cần tải từ tổng số total, vị trí first, số dòng visible và phần đệm overscan ở hai phía.",
        "requirements": [
          "Chặn first tối đa bằng total.",
          "start trừ overscan nhưng không nhỏ hơn 0.",
          "end cộng visible và overscan bằng phép cộng bão hòa rồi chặn bằng total."
        ]
      },
      "starterCode": "fn window(total: usize, first: usize, visible: usize, overscan: usize) -> (usize, usize) { todo!() }\nfn main() {\n    assert_eq!(window(100, 20, 10, 3), (17, 33));\n    assert_eq!(window(100, 1, 10, 3), (0, 14));\n    assert_eq!(window(25, 23, 10, 3), (20, 25));\n    assert_eq!(window(0, 0, 10, 3), (0, 0));\n    assert_eq!(window(10, 99, 2, 1), (9, 10));\n    assert_eq!(window(usize::MAX, usize::MAX - 1, 10, 2), (usize::MAX - 3, usize::MAX));\n    println!(\"Hiển thị khoảng 17..33\");\n}",
      "solutionCode": "fn window(total: usize, first: usize, visible: usize, overscan: usize) -> (usize, usize) {\n    let first = first.min(total);\n    let start = first.saturating_sub(overscan);\n    let end = first.saturating_add(visible).saturating_add(overscan).min(total);\n    (start, end)\n}\nfn main() {\n    assert_eq!(window(100, 20, 10, 3), (17, 33));\n    assert_eq!(window(100, 1, 10, 3), (0, 14));\n    assert_eq!(window(25, 23, 10, 3), (20, 25));\n    assert_eq!(window(0, 0, 10, 3), (0, 0));\n    assert_eq!(window(10, 99, 2, 1), (9, 10));\n    assert_eq!(window(usize::MAX, usize::MAX - 1, 10, 2), (usize::MAX - 3, usize::MAX));\n    println!(\"Hiển thị khoảng 17..33\");\n}",
      "expectedOutput": "Hiển thị khoảng 17..33",
      "hints": [
        "Chuẩn hóa first trước khi tính hai đầu.",
        "saturating_sub và saturating_add tránh underflow/overflow; min(total) chặn cuối danh sách."
      ],
      "quiz": {
        "question": "Test frontend với mock invoke đã đạt. Điều gì vẫn cần kiểm tra trên ứng dụng native?",
        "options": [
          "Không còn gì, vì giao diện dùng cùng HTML.",
          "Quyền capability, hộp thoại, hành vi hệ thống tệp và artifact theo nền tảng.",
          "Chỉ màu nền của nút.",
          "Chỉ số dòng Rust đã biên dịch."
        ],
        "correct": 1,
        "explanation": "Mock kiểm tra giao diện theo hợp đồng giả lập; nó không chứng minh IPC thật, quyền native, phụ thuộc WebView hay gói phát hành hoạt động đúng trên hệ điều hành."
      },
      "reference": {
        "label": "Tauri: kiểm thử ứng dụng với WebDriver",
        "url": "https://v2.tauri.app/develop/tests/webdriver/"
      }
    }
  ]
};
