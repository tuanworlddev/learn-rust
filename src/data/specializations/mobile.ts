import type { SpecializationBundle } from "../specialization-types";

export const mobileBundle: SpecializationBundle = {
  "track": {
    "id": "mobile",
    "title": "Mobile và thư viện dùng chung",
    "shortTitle": "Mobile",
    "description": "Dùng Rust cho lõi nghiệp vụ trên iOS và Android, kết nối Swift/Kotlin bằng UniFFI và phát hành thư viện có thể kiểm chứng.",
    "outcome": "Xây thư viện Rust dùng chung cho hai ứng dụng mobile, với hợp đồng có kiểu, quản lý vòng đời, migration dữ liệu và quy trình build theo target.",
    "prerequisites": [
      "Ownership, borrowing, trait và Result",
      "Cargo library/workspace và unit test",
      "Arc, Mutex, Send/Sync và async cơ bản",
      "Swift hoặc Kotlin cơ bản; hiểu vòng đời màn hình",
      "Biết phân biệt biên dịch, liên kết và đóng gói"
    ],
    "technologies": [
      "UniFFI",
      "Swift",
      "Kotlin",
      "Xcode",
      "Android NDK"
    ],
    "color": "purple",
    "lessonIds": [
      "mobile-core-boundary",
      "mobile-uniffi-contract",
      "mobile-targets-bindings",
      "mobile-lifecycle-async",
      "mobile-storage-adapters",
      "mobile-release-performance"
    ],
    "capstone": {
      "title": "Lõi ghi chép ngoại tuyến cho iOS và Android",
      "description": "Xây thư viện quản lý ghi chú dùng chung, hai giao diện native nhỏ và bộ kiểm thử chứng minh hành vi nhất quán khi sửa, đồng bộ, hủy và nâng cấp dữ liệu.",
      "milestones": [
        {
          "title": "Mô hình và hợp đồng nghiệp vụ",
          "tasks": [
            "Định nghĩa NoteId, tiêu đề, nội dung, revision và trạng thái đồng bộ; phân biệt DTO công khai với dữ liệu lưu trữ.",
            "Viết test cho tiêu đề Unicode, ID trùng, cập nhật với revision cũ và thao tác thất bại không thay đổi trạng thái."
          ],
          "acceptance": "cargo test kiểm tra được toàn bộ quy tắc mà không khởi động simulator hoặc dùng mạng; có fixture đầu vào/đầu ra dùng chung."
        },
        {
          "title": "Xuất API và nối hai giao diện",
          "tasks": [
            "Dùng UniFFI tạo record, enum lỗi và các hàm tạo/đọc/sửa ghi chú; giữ giao diện FFI nhỏ.",
            "Sinh Swift/Kotlin bằng đúng phiên bản đã build thư viện, viết màn hình danh sách và chi tiết trên mỗi nền tảng."
          ],
          "acceptance": "Cùng fixture cho kết quả giống nhau trong Rust, Swift và Kotlin; UI phân biệt lỗi dự kiến mà không so sánh chuỗi thông điệp."
        },
        {
          "title": "Vòng đời và tác vụ nền",
          "tasks": [
            "Thiết kế request ID, hủy hợp tác và quy tắc bỏ kết quả về muộn; chỉ cập nhật UI ở ngữ cảnh phù hợp nền tảng.",
            "Định nghĩa chủ sở hữu object Rust, cách đóng phiên và thu hồi callback; không giữ lock khi gọi ngược lên UI."
          ],
          "acceptance": "Mở/đóng màn hình liên tục hoặc hủy giữa xử lý không áp dụng kết quả cũ, không giữ phiên sống ngoài ý muốn và không làm UI mất phản hồi."
        },
        {
          "title": "Lưu trữ và nâng cấp",
          "tasks": [
            "Thiết kế định dạng persistence có version và giới hạn kích thước; viết migration từ fixture phiên bản trước.",
            "Đặt adapter tệp và bí mật ở ranh giới phù hợp; không đưa khóa vào binary hoặc ghi token trong log."
          ],
          "acceptance": "Dữ liệu cũ mở được, dữ liệu hỏng trả lỗi có thể xử lý; kiểm thử gián đoạn ghi không phá bản dữ liệu cuối đã hợp lệ."
        },
        {
          "title": "Đóng gói và đo trên thiết bị",
          "tasks": [
            "Build artifact cho iOS device/simulator và các ABI Android đã chọn; lưu manifest, Cargo.lock và binding cùng commit.",
            "Đo tổng thời gian đọc một trang ghi chú, số lần qua FFI, số byte chuyển và bộ nhớ; so sánh từng-item với trả theo trang.",
            "Viết README tái tạo build, smoke test từng nền tảng và kế hoạch quay lại bản tương thích dữ liệu."
          ],
          "acceptance": "Người khác tạo được gói từ checkout sạch; có số đo trên thiết bị hoặc simulator được nêu rõ, không gắn nhãn kiểm thử thiết bị cho kết quả chỉ chạy trên host."
        }
      ],
      "deliverables": [
        "Cargo workspace, Cargo.lock và API công khai có tài liệu",
        "Hai ứng dụng mẫu Swift/Kotlin với fixture chung",
        "Script sinh binding và manifest artifact theo target",
        "Bộ test vòng đời, lỗi, migration và tương thích dữ liệu",
        "Báo cáo hiệu năng có thiết bị, cấu hình và lệnh tái tạo"
      ],
      "reviewQuestions": [
        "Vì sao record và object có chi phí, vòng đời khác nhau?",
        "Nếu người dùng đóng màn hình mà Rust đã lưu dữ liệu, hủy có hoàn tác không?",
        "Cùng ARM64 nhưng tại sao iOS device và simulator cần artifact riêng?",
        "Làm sao biết binding và binary thuộc cùng một bản phát hành?",
        "Bạn đo phần nào trước khi kết luận Rust làm ứng dụng nhanh hơn?"
      ]
    },
    "resources": [
      {
        "label": "UniFFI: user guide",
        "url": "https://mozilla.github.io/uniffi-rs/latest/"
      },
      {
        "label": "UniFFI 0.32.2",
        "url": "https://docs.rs/uniffi/0.32.2/uniffi/"
      },
      {
        "label": "Rust: iOS targets",
        "url": "https://doc.rust-lang.org/rustc/platform-support/apple-ios.html"
      },
      {
        "label": "Rust: Android targets",
        "url": "https://doc.rust-lang.org/rustc/platform-support/android.html"
      },
      {
        "label": "UniFFI: Kotlin lifetimes",
        "url": "https://mozilla.github.io/uniffi-rs/latest/kotlin/lifetimes.html"
      },
      {
        "label": "UniFFI: async và hủy",
        "url": "https://mozilla.github.io/uniffi-rs/latest/futures.html"
      }
    ]
  },
  "lessons": [
    {
      "id": "mobile-core-boundary",
      "moduleId": "track-mobile",
      "title": "Tách lõi Rust khỏi giao diện iOS và Android",
      "duration": 45,
      "description": "Đặt quy tắc nghiệp vụ vào thư viện có thể kiểm thử, giữ giao diện và dịch vụ hệ điều hành ở lớp nền tảng.",
      "objectives": [
        "Phân định phần nên dùng chung và phần thuộc Swift/Kotlin",
        "Thiết kế API bằng kiểu dữ liệu có ý nghĩa",
        "Kiểm thử quy tắc nghiệp vụ không cần simulator",
        "Giải thích chi phí và giới hạn của một ranh giới FFI"
      ],
      "sections": [
        {
          "title": "Chọn phần dùng chung theo quy tắc nghiệp vụ",
          "text": "Một ứng dụng chi tiêu trên iOS và Android có thể dùng chung cách tính tổng, kiểm tra hạn mức và hợp nhất giao dịch. Nút bấm, điều hướng, quyền truy cập ảnh và vòng đời màn hình vẫn thuộc nền tảng. Chia theo ranh giới này giúp một quy tắc chỉ được sửa một lần mà không ép hai giao diện phải giống nhau.\n\nHãy bắt đầu bằng vài hàm nhận dữ liệu và trả kết quả. Nếu muốn kiểm tra số tiền mà phải khởi động simulator, tạo tài khoản và nhấn năm màn hình, lõi đang phụ thuộc quá nhiều vào môi trường. Một thư viện nhỏ có hợp đồng rõ thường dễ tích hợp hơn một khối Rust chứa cả mạng, cơ sở dữ liệu và điều khiển giao diện ngay từ đầu."
        },
        {
          "title": "Mô hình dữ liệu đi trước binding",
          "text": "Đặt ý nghĩa vào tên và kiểu: amount_minor biểu thị số tiền bằng đơn vị nhỏ nhất đã thống nhất, không phải một f64 chưa rõ cách làm tròn. Trong một phép cộng nhiều khoản, phải quy định tiền tệ, số âm, tràn số và trường hợp danh sách rỗng. Bài này chỉ cộng các khoản không âm cùng đơn vị; đổi tiền và hoàn tiền là quy tắc khác.\n\nHàm lõi có thể mượn slice để tránh sao chép nội bộ. Lớp công khai qua FFI thường nhận dữ liệu sở hữu, chuyển sang kiểu miền và gọi lõi. Điều đó giữ các lifetime hoặc chi tiết lưu trữ trong Rust, không bắt Swift/Kotlin hiểu cách một tham chiếu vào Vec còn hiệu lực bao lâu.",
          "code": "fn total_minor(amounts: &[i64]) -> Result<i64, AmountError> {\n    amounts.iter().try_fold(0_i64, |sum, &amount| {\n        if amount < 0 { return Err(AmountError::Negative); }\n        sum.checked_add(amount).ok_or(AmountError::Overflow)\n    })\n}"
        },
        {
          "title": "Đảo chiều các phụ thuộc thay đổi theo thiết bị",
          "text": "Thời gian hiện tại, đọc tệp, truy cập khóa và gọi mạng khiến cùng một hàm có kết quả khác nhau giữa hai lần chạy. Hãy truyền dữ liệu cần thiết vào lõi, hoặc định nghĩa một giao diện hẹp cho dịch vụ đó. Ví dụ kiểm tra hạn dùng nhận now và expires_at thay vì tự đọc đồng hồ trong mỗi nhánh. Kiểm thử sẽ điều khiển được các trường hợp đúng hạn, quá hạn và lệch đồng hồ.\n\nKhông cần bọc mọi dòng mã bằng trait. Bắt đầu với hàm thuần; chỉ thêm adapter khi có một phụ thuộc thực sự cần thay thế. API nền tảng trả lỗi có loại rõ, còn lõi quyết định cách lỗi đó ảnh hưởng đến nghiệp vụ."
        },
        {
          "title": "Chứng minh lõi trước khi tích hợp hai ứng dụng",
          "text": "Bộ test của Rust phải kiểm tra đầu vào thường gặp lẫn trường hợp biên. Với thao tác thay đổi trạng thái, kiểm tra cả giá trị trả về và dữ liệu sau lỗi: thêm giao dịch trùng ID không được làm tổng tăng. Những fixture này sau đó trở thành hợp đồng kiểm thử cho Swift và Kotlin.\n\nUniFFI giúp sinh lớp kết nối, nhưng không quyết định kiến trúc thay bạn và không làm chi phí chuyển dữ liệu biến mất. Đo một thao tác người dùng hoàn chỉnh sau khi tích hợp: thời gian chuyển dữ liệu, thực thi lõi và cập nhật giao diện. Chỉ chuyển phần có giá trị dùng chung hoặc lợi ích đã đo, thay vì chuyển toàn bộ ứng dụng vì có thể làm được."
        }
      ],
      "tip": "Viết fixture và test cho quy tắc dùng chung trước khi nối Swift/Kotlin. Lỗi nghiệp vụ nên tái hiện được mà không mở simulator.",
      "exercise": {
        "title": "Cộng số tiền trong lõi dùng chung",
        "instructions": "Hoàn thiện total_minor để hai giao diện dùng cùng một quy tắc tính tổng. Các giá trị đều thuộc một loại tiền và cùng đơn vị nhỏ nhất.",
        "requirements": [
          "Danh sách rỗng trả Ok(0).",
          "Gặp số âm trả AmountError::Negative.",
          "Dùng checked_add; không để tràn số phụ thuộc chế độ debug/release."
        ]
      },
      "starterCode": "#[derive(Debug, PartialEq)]\nenum AmountError { Negative, Overflow }\nfn total_minor(amounts: &[i64]) -> Result<i64, AmountError> {\n    todo!()\n}\nfn main() {\n    assert_eq!(total_minor(&[1200, 800, 0]), Ok(2000));\n    assert_eq!(total_minor(&[]), Ok(0));\n    assert_eq!(total_minor(&[10, -1]), Err(AmountError::Negative));\n    assert_eq!(total_minor(&[i64::MAX, 1]), Err(AmountError::Overflow));\n    println!(\"Tổng: {} đơn vị nhỏ nhất\", total_minor(&[1200, 800]).unwrap());\n}",
      "solutionCode": "#[derive(Debug, PartialEq)]\nenum AmountError { Negative, Overflow }\nfn total_minor(amounts: &[i64]) -> Result<i64, AmountError> {\n    amounts.iter().try_fold(0_i64, |sum, &amount| {\n        if amount < 0 { return Err(AmountError::Negative); }\n        sum.checked_add(amount).ok_or(AmountError::Overflow)\n    })\n}\nfn main() {\n    assert_eq!(total_minor(&[1200, 800, 0]), Ok(2000));\n    assert_eq!(total_minor(&[]), Ok(0));\n    assert_eq!(total_minor(&[10, -1]), Err(AmountError::Negative));\n    assert_eq!(total_minor(&[i64::MAX, 1]), Err(AmountError::Overflow));\n    println!(\"Tổng: {} đơn vị nhỏ nhất\", total_minor(&[1200, 800]).unwrap());\n}",
      "expectedOutput": "Tổng: 2000 đơn vị nhỏ nhất",
      "hints": [
        "try_fold cho phép dừng ở Result::Err đầu tiên.",
        "Kiểm tra số âm trước checked_add; trả lỗi thay vì unwrap phép cộng."
      ],
      "quiz": {
        "question": "Đâu là ranh giới dùng chung phù hợp cho ứng dụng ghi chép trên iOS và Android?",
        "options": [
          "Rust trực tiếp giữ tham chiếu tới mọi View và Activity.",
          "Rust kiểm tra nội dung và quy tắc lưu; Swift/Kotlin quản lý UI và adapter nền tảng.",
          "Mỗi nền tảng tự viết lại quy tắc kiểm tra để tránh FFI.",
          "Đưa toàn bộ thao tác UI vào một hàm unsafe duy nhất."
        ],
        "correct": 1,
        "explanation": "Lõi nghiệp vụ có đầu vào/đầu ra rõ ràng có thể dùng chung và kiểm thử độc lập. UI và các yêu cầu hệ điều hành vẫn được triển khai trong môi trường phù hợp."
      },
      "reference": {
        "label": "UniFFI: mục tiêu và mô hình thư viện dùng chung",
        "url": "https://mozilla.github.io/uniffi-rs/latest/"
      },
      "localLab": {
        "title": "Thư viện sổ chi tiêu không phụ thuộc nền tảng",
        "instructions": "Tạo thư mục mới với hai tệp dưới đây. Lab chạy trên máy có Rust/Cargo; chưa cần Xcode, Android SDK hoặc UniFFI. Nó kiểm tra bất biến trước khi thêm lớp binding.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"mobile_domain_core\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::collections::BTreeMap;\n\n#[derive(Debug, PartialEq)]\npub enum LedgerError { DuplicateId, Overflow }\n\n#[derive(Default)]\npub struct Ledger {\n    entries: BTreeMap<u64, u64>,\n    total: u64,\n}\n\nimpl Ledger {\n    pub fn add(&mut self, id: u64, amount_minor: u64) -> Result<(), LedgerError> {\n        if self.entries.contains_key(&id) { return Err(LedgerError::DuplicateId); }\n        let next = self.total.checked_add(amount_minor).ok_or(LedgerError::Overflow)?;\n        self.entries.insert(id, amount_minor);\n        self.total = next;\n        Ok(())\n    }\n    pub fn total_minor(&self) -> u64 { self.total }\n    pub fn entry_count(&self) -> usize { self.entries.len() }\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn duplicate_changes_nothing() {\n        let mut ledger = Ledger::default();\n        assert_eq!(ledger.add(1, 2500), Ok(()));\n        assert_eq!(ledger.add(1, 99), Err(LedgerError::DuplicateId));\n        assert_eq!(ledger.total_minor(), 2500);\n        assert_eq!(ledger.entry_count(), 1);\n    }\n    #[test]\n    fn overflow_changes_nothing() {\n        let mut ledger = Ledger::default();\n        ledger.add(1, u64::MAX).unwrap();\n        assert_eq!(ledger.add(2, 1), Err(LedgerError::Overflow));\n        assert_eq!(ledger.entry_count(), 1);\n        assert_eq!(ledger.total_minor(), u64::MAX);\n    }\n    #[test]\n    fn zero_and_empty_are_defined() {\n        let mut ledger = Ledger::default();\n        assert_eq!(ledger.total_minor(), 0);\n        ledger.add(1, 0).unwrap();\n        assert_eq!(ledger.entry_count(), 1);\n    }\n}\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo clippy --all-targets -- -D warnings"
        ],
        "checks": [
          "Ba test đều thành công.",
          "ID trùng không tăng tổng hoặc số bản ghi.",
          "Tràn số không chèn bản ghi dở dang; thử thêm assertion cho chuỗi thao tác của riêng bạn."
        ]
      }
    },
    {
      "id": "mobile-uniffi-contract",
      "moduleId": "track-mobile",
      "title": "UniFFI: record, enum và lỗi có kiểu",
      "duration": 55,
      "description": "Thiết kế hợp đồng Swift/Kotlin từ Rust và sinh binding bằng proc-macro của UniFFI 0.32.2.",
      "objectives": [
        "Chọn record cho giá trị và object cho trạng thái có vòng đời",
        "Xuất hàm Result với lỗi có thể xử lý ở Swift/Kotlin",
        "Khởi tạo scaffolding đúng với proc-macro",
        "Sinh binding cùng phiên bản với thư viện Rust"
      ],
      "sections": [
        {
          "title": "Giá trị và đối tượng có hai cách sống khác nhau",
          "text": "Record diễn tả dữ liệu như tiêu đề, ID và số lượng; bên nhận có một giá trị phù hợp với ngôn ngữ của mình. Object đại diện cho đối tượng Rust có method và trạng thái sống qua nhiều lời gọi. Đừng chọn object chỉ để tránh viết một struct dữ liệu: nó kéo theo trách nhiệm giữ và giải phóng tài nguyên.\n\nVới một màn hình danh sách, trả về các NoteSummary nhỏ thường dễ sử dụng hơn trả object cho từng ô. Khi cần một phiên xử lý dài, object có thể hợp lý. Hãy ghi rõ ai tạo nó, những thao tác nào được gọi đồng thời, khi nào ngừng nhận yêu cầu và cách giải phóng sau khi màn hình đóng."
        },
        {
          "title": "Khai báo giao diện ngay trong Rust",
          "text": "Proc-macro cho phép đánh dấu record, enum, error và hàm được xuất ngay tại mã nguồn. Một crate chỉ dùng proc-macro gọi uniffi::setup_scaffolding!(); không thêm include_scaffolding của luồng UDL vào cùng crate. Giữ số lượng kiểu công khai vừa đủ để mỗi thay đổi còn có thể review được.\n\nChọn kiểu số có độ rộng rõ cho hợp đồng; usize là kích thước phụ thuộc kiến trúc nên không phù hợp làm định dạng trao đổi ổn định. Đừng đưa tham chiếu mượn với lifetime của cấu trúc nội bộ vào API cho mobile. Một wrapper mỏng nhận String, kiểm tra rồi trả record sở hữu dữ liệu thường dễ hiểu hơn cố làm ranh giới này hoàn toàn không sao chép.",
          "code": "// Trong crate Cargo đã có uniffi và setup_scaffolding.\n#[derive(uniffi::Record)]\npub struct NoteSummary {\n    pub title: String,\n    pub scalar_count: u32,\n}\n\n#[uniffi::export]\npub fn title_length(title: String) -> u64 {\n    title.chars().count() as u64\n}"
        },
        {
          "title": "Lỗi dự kiến phải là một phần của hợp đồng",
          "text": "Tiêu đề rỗng hoặc quá dài là kết quả kiểm tra có thể xảy ra bình thường. Xuất Result với enum lỗi để Swift xử lý qua throws và Kotlin xử lý lỗi được binding ánh xạ. Error có thể cung cấp mã hoặc thông tin có cấu trúc; UI tự quyết định thông điệp và cách dịch. Một chuỗi lỗi SQL hoặc toàn bộ dữ liệu người dùng không phải hợp đồng lỗi tốt.\n\nPanic thể hiện vấn đề khác. Không dùng unwrap trên dữ liệu đầu vào để biến một trường hợp dự kiến thành panic và mong binding cứu hộ. Dù lớp kết nối có cơ chế xử lý một số lỗi bất ngờ, ứng dụng vẫn cần chính sách báo lỗi, tài nguyên và hành vi rõ khi không thể tiếp tục."
        },
        {
          "title": "Kiểm chứng cả ngữ nghĩa lẫn mã được sinh",
          "text": "Lab cố định UniFFI 0.32.2 cho thư viện và trình sinh binding nằm trong cùng crate. Chạy test Rust trước, build cdylib trên host rồi dùng chế độ library để sinh mã Swift/Kotlin. Các tệp được sinh là sản phẩm build; thay đổi hợp đồng phải làm chúng được sinh lại, không sửa tay để che lỗi khác phiên bản.\n\nĐộ dài chuỗi cũng cần hợp đồng chính xác: chars().count() đếm Unicode scalar value, không phải số ký tự người dùng nhìn thấy. Hai cách biểu diễn chữ có dấu có thể có số scalar khác nhau. Bài tập cố ý kiểm tra khác biệt này. Nếu sản phẩm cần giới hạn theo grapheme hoặc chuẩn hóa Unicode, bổ sung thư viện và test chung cho cả hai nền tảng."
        }
      ],
      "tip": "Tên trường, loại lỗi và đơn vị dữ liệu là API. Hãy kiểm thử chúng ở cả Rust và ngôn ngữ gọi, không chỉ kiểm tra file binding được tạo.",
      "exercise": {
        "title": "Chuẩn hóa hợp đồng tiêu đề",
        "instructions": "Trim khoảng trắng hai đầu, từ chối tiêu đề rỗng và kiểm tra giới hạn Unicode scalar value. Không tự chuẩn hóa Unicode hay đếm byte.",
        "requirements": [
          "Trả String sở hữu cùng số scalar khi hợp lệ.",
          "Lỗi Empty được ưu tiên cho chuỗi sau trim bị rỗng.",
          "Số scalar lớn hơn limit trả TooLong, kể cả khi chữ trông giống nhau."
        ]
      },
      "starterCode": "#[derive(Debug, PartialEq)]\nenum TitleError { Empty, TooLong }\nfn validate_title(input: &str, limit: usize) -> Result<(String, usize), TitleError> {\n    todo!()\n}\nfn main() {\n    assert_eq!(validate_title(\"   \", 64), Err(TitleError::Empty));\n    assert_eq!(validate_title(\"Rust\", 3), Err(TitleError::TooLong));\n    assert_eq!(validate_title(\"é\", 1), Ok((String::from(\"é\"), 1)));\n    assert_eq!(validate_title(\"e\\u{301}\", 1), Err(TitleError::TooLong));\n    let (title, count) = validate_title(\"  Ghi chú Rust  \", 64).unwrap();\n    assert_eq!(count, 12);\n    println!(\"{title} | {count}\");\n}",
      "solutionCode": "#[derive(Debug, PartialEq)]\nenum TitleError { Empty, TooLong }\nfn validate_title(input: &str, limit: usize) -> Result<(String, usize), TitleError> {\n    let title = input.trim();\n    if title.is_empty() { return Err(TitleError::Empty); }\n    let count = title.chars().count();\n    if count > limit { return Err(TitleError::TooLong); }\n    Ok((title.to_owned(), count))\n}\nfn main() {\n    assert_eq!(validate_title(\"   \", 64), Err(TitleError::Empty));\n    assert_eq!(validate_title(\"Rust\", 3), Err(TitleError::TooLong));\n    assert_eq!(validate_title(\"é\", 1), Ok((String::from(\"é\"), 1)));\n    assert_eq!(validate_title(\"e\\u{301}\", 1), Err(TitleError::TooLong));\n    let (title, count) = validate_title(\"  Ghi chú Rust  \", 64).unwrap();\n    assert_eq!(count, 12);\n    println!(\"{title} | {count}\");\n}",
      "expectedOutput": "Ghi chú Rust | 12",
      "hints": [
        "trim trả &str; chỉ tạo String sau khi kiểm tra.",
        "chars().count() khác len(); chuỗi e kèm dấu kết hợp có hai scalar."
      ],
      "quiz": {
        "question": "Hàm kiểm tra tiêu đề nhận nội dung rỗng từ Kotlin. Hành vi nào phù hợp với hợp đồng thư viện?",
        "options": [
          "Gọi panic! để binding tự quyết định thông báo.",
          "Trả Result::Err với biến thể Empty đã xuất qua UniFFI.",
          "Trả một con trỏ null không có tài liệu.",
          "Trả String chứa toàn bộ lỗi và yêu cầu UI so sánh từng chữ."
        ],
        "correct": 1,
        "explanation": "Lỗi đầu vào dự kiến cần được mô hình hóa. Enum lỗi giúp mã gọi xử lý từng trường hợp mà không phụ thuộc thông điệp hiển thị hoặc chi tiết nội bộ."
      },
      "reference": {
        "label": "UniFFI: proc-macro và scaffolding",
        "url": "https://mozilla.github.io/uniffi-rs/latest/proc_macro/index.html"
      },
      "localLab": {
        "title": "Sinh Swift và Kotlin từ một thư viện UniFFI",
        "instructions": "Lab dùng Rust/Cargo trên macOS, UniFFI =0.32.2 và chế độ proc-macro. Các lệnh sinh mã đọc cdylib của host; chưa build ứng dụng iOS/Android. Trên Linux đổi phần mở rộng .dylib thành .so; trên Windows dùng tên DLL do Cargo tạo.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"mobile_bridge\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[lib]\ncrate-type = [\"cdylib\", \"staticlib\", \"rlib\"]\n\n[features]\nbindgen = [\"uniffi/cli\"]\n\n[dependencies]\nuniffi = \"=0.32.2\"\n\n[[bin]]\nname = \"uniffi-bindgen\"\npath = \"src/bin/uniffi-bindgen.rs\"\nrequired-features = [\"bindgen\"]\n"
          },
          {
            "path": "src/lib.rs",
            "content": "uniffi::setup_scaffolding!();\n\n#[derive(Debug, PartialEq, uniffi::Record)]\npub struct NoteSummary {\n    pub title: String,\n    pub scalar_count: u32,\n}\n\n#[derive(Debug, PartialEq, uniffi::Error)]\npub enum TitleError { Empty, TooLong }\n\nimpl std::fmt::Display for TitleError {\n    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {\n        f.write_str(match self {\n            Self::Empty => \"Title is empty\",\n            Self::TooLong => \"Title exceeds 64 Unicode scalar values\",\n        })\n    }\n}\nimpl std::error::Error for TitleError {}\n\n#[uniffi::export]\npub fn validate_title(input: String) -> Result<NoteSummary, TitleError> {\n    let title = input.trim();\n    if title.is_empty() { return Err(TitleError::Empty); }\n    let count = title.chars().count();\n    if count > 64 { return Err(TitleError::TooLong); }\n    Ok(NoteSummary { title: title.to_owned(), scalar_count: count as u32 })\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn trims_and_counts_scalars() {\n        assert_eq!(validate_title(\"  Ghi chú Rust  \".into()).unwrap(),\n            NoteSummary { title: \"Ghi chú Rust\".into(), scalar_count: 12 });\n    }\n    #[test]\n    fn expected_failures_are_results() {\n        assert_eq!(validate_title(\"  \".into()), Err(TitleError::Empty));\n        assert_eq!(validate_title(\"a\".repeat(65)), Err(TitleError::TooLong));\n    }\n}\n"
          },
          {
            "path": "src/bin/uniffi-bindgen.rs",
            "content": "fn main() {\n    uniffi::uniffi_bindgen_main();\n}\n"
          }
        ],
        "commands": [
          "cargo test --lib",
          "cargo build --release --lib",
          "cargo run --features bindgen --bin uniffi-bindgen -- generate --library target/release/libmobile_bridge.dylib --language swift --out-dir generated/swift",
          "cargo run --features bindgen --bin uniffi-bindgen -- generate --library target/release/libmobile_bridge.dylib --language kotlin --out-dir generated/kotlin"
        ],
        "checks": [
          "Hai test Rust thành công.",
          "Thư mục generated/swift có mã Swift cùng phần khai báo FFI; generated/kotlin có mã Kotlin.",
          "Kiểm tra binding có hàm validateTitle và kiểu lỗi tương ứng; tiếp theo viết smoke test Swift/Kotlin gọi dữ liệu hợp lệ và lỗi Empty.",
          "Lưu Cargo.lock; không thay một tệp binding của bản build khác vào thư viện hiện tại."
        ]
      }
    },
    {
      "id": "mobile-targets-bindings",
      "moduleId": "track-mobile",
      "title": "Từ binding đến thư viện đúng cho từng thiết bị",
      "duration": 55,
      "description": "Phân biệt sinh mã, biên dịch Rust, liên kết native và đóng gói ứng dụng; xây ma trận target có thể tái tạo.",
      "objectives": [
        "Phân biệt iOS device với simulator dù cùng ARM64",
        "Lập ma trận Rust target và Android ABI",
        "Đóng gói binding và native binary cùng một phiên bản",
        "Đọc lỗi theo giai đoạn build thay vì sửa ngẫu nhiên"
      ],
      "sections": [
        {
          "title": "Sinh mã không đồng nghĩa đã có ứng dụng chạy được",
          "text": "Trình sinh UniFFI tạo mã để Swift/Kotlin gọi thư viện Rust. Nó không tự cài SDK, liên kết mọi dependency native hoặc đóng gói một ứng dụng hoàn chỉnh. Chia pipeline thành các đầu ra: thư viện Rust, source binding, module/framework phía Swift hoặc Kotlin, rồi ứng dụng. Khi lỗi xuất hiện, xác định bước nào chưa tạo được đầu ra đúng.\n\nMột lab chạy trên macOS có thể sinh cả Swift và Kotlin từ cdylib host. Điều đó hữu ích để rà hợp đồng, nhưng không làm cdylib macOS chạy trên điện thoại. Build dành cho target cuối vẫn phải có toolchain, SDK, kiến trúc và feature đúng. Ghi các lựa chọn này vào script hoặc manifest thay vì giữ trong trí nhớ của người đóng gói."
        },
        {
          "title": "ARM64 không đủ để xác định target iOS",
          "text": "Rust phân biệt aarch64-apple-ios cho thiết bị và aarch64-apple-ios-sim cho simulator ARM64. Simulator x86_64 dùng x86_64-apple-ios. Hai binary cùng tập lệnh vẫn có thể nhắm môi trường khác nhau, nên không được đổi tên hoặc ghép tùy tiện để đánh lừa linker. Xcode cung cấp SDK tương ứng; rustup target add chỉ thêm phần hỗ trợ Rust cho target đó.\n\nKhi đóng gói cho nhiều môi trường, tổ chức các biến thể thành sản phẩm phù hợp như XCFramework, cùng header/module map và Swift binding tương ứng. Kiểm tra deployment target của ứng dụng, Rust và các dependency native. Một bản chạy trên simulator chưa chứng minh chạy được trên thiết bị thật.",
          "code": "// Hai môi trường Apple ARM64 khác nhau.\nfn build_target(simulator: bool) -> &'static str {\n    if simulator { \"aarch64-apple-ios-sim\" }\n    else { \"aarch64-apple-ios\" }\n}"
        },
        {
          "title": "Android cần đúng ABI và chuỗi liên kết NDK",
          "text": "Android dùng các target Rust như aarch64-linux-android và x86_64-linux-android; trình biên dịch native/linker đến từ Android NDK. Chọn các ABI ứng dụng thực sự hỗ trợ và đặt thư viện .so vào phần đóng gói tương ứng. Không dùng thư viện Linux desktop thay cho Android chỉ vì cả hai đều có hậu tố .so.\n\nBản build cần thống nhất mức API Android tối thiểu với dependency native. Kiểm tra thư viện trong gói cuối, không chỉ thư mục target của Cargo: thiếu một ABI hoặc sai tên thư viện có thể chỉ lộ ra khi ứng dụng nạp thư viện trên thiết bị. CI nên có smoke test khởi tạo binding và gọi một hàm nhỏ trên từng nhóm thiết bị được công bố hỗ trợ."
        },
        {
          "title": "Giữ nguồn gốc của từng artifact",
          "text": "Mỗi gói phát hành nên ghi commit nguồn, Rust toolchain, UniFFI, target, feature và hash artifact. Nếu dùng cfg để xuất API khác nhau theo nền tảng, binding sinh từ host có thể không diễn tả thư viện cuối; tốt hơn giữ API chung ổn định hoặc sinh và kiểm tra theo đúng cấu hình target.\n\nPhân loại lỗi giúp giảm thời gian điều tra: không tìm thấy crate là vấn đề Cargo; undefined symbol thường thuộc liên kết; không nạp được thư viện thuộc đóng gói hoặc nền tảng; lỗi checksum/hợp đồng cần kiểm tra cặp binding–binary. Bài tập xây bộ chọn target có chủ đích để một trường hợp không hỗ trợ trả lỗi rõ, không tự rơi về một binary gần giống."
        }
      ],
      "tip": "Ghi rõ cả môi trường, kiến trúc, toolchain và feature cho từng artifact. Cùng ARM64 không có nghĩa là cùng target.",
      "exercise": {
        "title": "Chọn Rust target từ môi trường mobile",
        "instructions": "Viết bộ chọn target cho ARM64 và x86_64 theo ma trận bài học. Đây là quy tắc chuẩn bị build; không thực hiện cross-compile trong trình duyệt.",
        "requirements": [
          "iOS device ARM64 khác iOS simulator ARM64.",
          "Android có hai target tương ứng ARM64/x86_64.",
          "iOS device x86_64 trả Unsupported, không chọn simulator thay thế."
        ]
      },
      "starterCode": "#[derive(Clone, Copy)]\nenum Platform { IosDevice, IosSimulator, Android }\n#[derive(Clone, Copy)]\nenum Arch { Arm64, X86_64 }\n#[derive(Debug, PartialEq)]\nenum TargetError { Unsupported }\nfn target(platform: Platform, arch: Arch) -> Result<&'static str, TargetError> {\n    todo!()\n}\nfn main() {\n    use Arch::*;\n    use Platform::*;\n    assert_eq!(target(IosDevice, Arm64), Ok(\"aarch64-apple-ios\"));\n    assert_eq!(target(IosSimulator, Arm64), Ok(\"aarch64-apple-ios-sim\"));\n    assert_eq!(target(IosSimulator, X86_64), Ok(\"x86_64-apple-ios\"));\n    assert_eq!(target(Android, Arm64), Ok(\"aarch64-linux-android\"));\n    assert_eq!(target(Android, X86_64), Ok(\"x86_64-linux-android\"));\n    assert_eq!(target(IosDevice, X86_64), Err(TargetError::Unsupported));\n    println!(\"Thiết bị: {}\", target(IosDevice, Arm64).unwrap());\n    println!(\"Simulator: {}\", target(IosSimulator, Arm64).unwrap());\n}",
      "solutionCode": "#[derive(Clone, Copy)]\nenum Platform { IosDevice, IosSimulator, Android }\n#[derive(Clone, Copy)]\nenum Arch { Arm64, X86_64 }\n#[derive(Debug, PartialEq)]\nenum TargetError { Unsupported }\nfn target(platform: Platform, arch: Arch) -> Result<&'static str, TargetError> {\n    match (platform, arch) {\n        (Platform::IosDevice, Arch::Arm64) => Ok(\"aarch64-apple-ios\"),\n        (Platform::IosSimulator, Arch::Arm64) => Ok(\"aarch64-apple-ios-sim\"),\n        (Platform::IosSimulator, Arch::X86_64) => Ok(\"x86_64-apple-ios\"),\n        (Platform::Android, Arch::Arm64) => Ok(\"aarch64-linux-android\"),\n        (Platform::Android, Arch::X86_64) => Ok(\"x86_64-linux-android\"),\n        _ => Err(TargetError::Unsupported),\n    }\n}\nfn main() {\n    use Arch::*;\n    use Platform::*;\n    assert_eq!(target(IosDevice, Arm64), Ok(\"aarch64-apple-ios\"));\n    assert_eq!(target(IosSimulator, Arm64), Ok(\"aarch64-apple-ios-sim\"));\n    assert_eq!(target(IosSimulator, X86_64), Ok(\"x86_64-apple-ios\"));\n    assert_eq!(target(Android, Arm64), Ok(\"aarch64-linux-android\"));\n    assert_eq!(target(Android, X86_64), Ok(\"x86_64-linux-android\"));\n    assert_eq!(target(IosDevice, X86_64), Err(TargetError::Unsupported));\n    println!(\"Thiết bị: {}\", target(IosDevice, Arm64).unwrap());\n    println!(\"Simulator: {}\", target(IosSimulator, Arm64).unwrap());\n}",
      "expectedOutput": "Thiết bị: aarch64-apple-ios\nSimulator: aarch64-apple-ios-sim",
      "hints": [
        "match một tuple (platform, arch) để thể hiện từng cặp rõ ràng.",
        "Nhánh không hỗ trợ phải trả Err thay vì một target mặc định."
      ],
      "quiz": {
        "question": "Có lib Rust build cho macOS ARM64 và binding Swift. Có thể đưa nguyên thư viện đó vào ứng dụng iPhone không?",
        "options": [
          "Có, mọi môi trường ARM64 có ABI giống nhau.",
          "Có nếu đổi hậu tố thư viện thành .a.",
          "Không; phải build/link artifact cho iOS với SDK và target phù hợp.",
          "Chỉ cần tắt kiểm tra checksum của binding."
        ],
        "correct": 2,
        "explanation": "Kiến trúc CPU chỉ là một phần của target. Hệ điều hành, ABI, SDK và môi trường simulator/device quyết định cách binary được liên kết và nạp."
      },
      "reference": {
        "label": "Rust: target iOS và yêu cầu SDK",
        "url": "https://doc.rust-lang.org/rustc/platform-support/apple-ios.html"
      }
    },
    {
      "id": "mobile-lifecycle-async",
      "moduleId": "track-mobile",
      "title": "Vòng đời, tác vụ nền và hủy qua FFI",
      "duration": 60,
      "description": "Giữ giao diện phản hồi, quản lý object Rust và ngăn tác vụ cũ cập nhật màn hình mới.",
      "objectives": [
        "Phân biệt giải phóng wrapper với hủy công việc",
        "Thiết kế quyền sở hữu object và callback rõ ràng",
        "Xây cơ chế hủy hợp tác và chặn kết quả về muộn",
        "Không giữ lock trong khi gọi ngược qua FFI"
      ],
      "sections": [
        {
          "title": "Một object Rust có thể sống lâu hơn màn hình",
          "text": "Một màn hình tạo phiên đồng bộ, sau đó người dùng quay lại trang trước. Phiên Rust có thể còn được giữ bởi wrapper, callback hoặc task nền. Việc màn hình biến mất không tự chứng minh toàn bộ tài nguyên đã được giải phóng. Hãy vẽ các nơi giữ tham chiếu và xác định điểm đóng phiên, ngừng nhận yêu cầu, bỏ đăng ký callback và giải phóng wrapper.\n\nTài liệu Kotlin hiện hành mô tả wrapper object với AutoCloseable và close(); use phù hợp khi phạm vi tài nguyên thật sự chỉ kéo dài trong khối đó. Đối tượng dùng xuyên nhiều màn hình cần một chủ sở hữu cấp cao hơn. Nếu một danh sách chứa nhiều wrapper, đừng giả định giải phóng danh sách tự đóng từng tài nguyên Rust."
        },
        {
          "title": "Async không tự chọn nơi chạy CPU hoặc cập nhật UI",
          "text": "UniFFI có thể ánh xạ hàm async sang cơ chế async của ngôn ngữ gọi. Tuy vậy, tính toán CPU dài trước một điểm await vẫn có thể giữ luồng đang poll. Các API phụ thuộc runtime như timer hoặc socket của Tokio cũng cần môi trường mà thư viện đó yêu cầu. Quyết định executor, worker và giới hạn song song phải được ghi trong thiết kế.\n\nKết quả hoặc callback từ Rust không nên tự ý sửa UI. Lớp Swift/Kotlin chuyển thông điệp về ngữ cảnh UI phù hợp. Với trạng thái dùng chung, lấy snapshot hoặc cập nhật dưới lock ngắn rồi thả lock trước khi gọi callback; callback có thể gọi ngược vào Rust và gây deadlock nếu vẫn giữ khóa."
        },
        {
          "title": "Hủy là một hợp đồng có thể kiểm thử",
          "text": "Không suy ra rằng hủy một Swift Task hoặc coroutine luôn hủy mọi hoạt động bên Rust. API của thư viện nên nêu rõ phương thức cancel, điểm kiểm tra, thời gian phản hồi và kết quả sau hủy. Một cờ atomic có thể đủ cho tín hiệu dừng độc lập; nó không đồng thời là cách công bố dữ liệu không có đồng bộ. Công việc blocking hoặc tác dụng phụ đã hoàn tất cần được xét riêng.\n\nHủy không hoàn tác một bản ghi đã commit hay yêu cầu mạng đã gửi. Phân biệt ngừng chờ, ngừng làm việc và phục hồi tác dụng phụ. Khi người dùng mở lại màn hình, có thể cần đọc trạng thái thật thay vì hiển thị giả định rằng tác vụ cũ chưa từng xảy ra.",
          "code": "// Tín hiệu hủy độc lập; không dùng cờ này để công bố dữ liệu khác.\nuse std::sync::atomic::{AtomicBool, Ordering};\nstruct CancelToken { cancelled: AtomicBool }\nimpl CancelToken {\n    fn cancel(&self) { self.cancelled.store(true, Ordering::Relaxed); }\n    fn is_cancelled(&self) -> bool { self.cancelled.load(Ordering::Relaxed) }\n}"
        },
        {
          "title": "Kết quả về muộn phải có cách nhận diện",
          "text": "Tác vụ tìm kiếm A khởi chạy, rồi người dùng nhập câu mới tạo tác vụ B. A có thể trả kết quả sau B. Gắn generation hoặc request ID vào mỗi thông điệp để UI chỉ áp dụng kết quả thuộc yêu cầu còn hiệu lực. Kết hợp trạng thái running, cancelled và finished giúp sự kiện trùng không hoàn tất tác vụ hai lần.\n\nBài tập kiểm tra chính sách này bằng máy trạng thái thuần, không giả lập một runtime mobile. Sau đó cần kiểm thử tích hợp: đóng màn hình trong lúc chạy, hủy lặp lại, callback gọi ngược và kết quả sai thứ tự. Đặt giới hạn hàng đợi thông báo tiến độ; UI thường chỉ cần giá trị mới nhất, không cần giữ mọi cập nhật của một công việc dài."
        }
      ],
      "tip": "Xem hủy công việc, bỏ kết quả cũ, đóng wrapper và rollback là các thao tác riêng; thiết kế và kiểm thử từng thao tác.",
      "exercise": {
        "title": "Bỏ kết quả cũ và hoàn tất đúng một lần",
        "instructions": "Hoàn thiện apply_event. Hàm trả true khi sự kiện được tiếp nhận, false khi bị bỏ qua; không thay đổi Job khi bỏ qua.",
        "requirements": [
          "Bỏ sự kiện khác generation hoặc Job đã cancelled/finished.",
          "Progress được giới hạn ở 100 và không giảm so với tiến độ đã nhận.",
          "Done đặt progress=100, finished=true; Done lặp lại bị bỏ qua."
        ]
      },
      "starterCode": "#[derive(Debug, PartialEq)]\nstruct Job { generation: u64, cancelled: bool, finished: bool, progress: u8 }\nenum Event {\n    Progress { generation: u64, percent: u8 },\n    Done { generation: u64 },\n}\nfn apply_event(job: &mut Job, event: Event) -> bool {\n    todo!()\n}\nfn main() {\n    let mut job = Job { generation: 2, cancelled: false, finished: false, progress: 0 };\n    assert!(!apply_event(&mut job, Event::Done { generation: 1 }));\n    assert_eq!(job.progress, 0);\n    assert!(apply_event(&mut job, Event::Progress { generation: 2, percent: 80 }));\n    assert!(apply_event(&mut job, Event::Progress { generation: 2, percent: 40 }));\n    assert_eq!(job.progress, 80);\n    assert!(apply_event(&mut job, Event::Progress { generation: 2, percent: 250 }));\n    assert_eq!(job.progress, 100);\n    assert!(apply_event(&mut job, Event::Done { generation: 2 }));\n    assert!(!apply_event(&mut job, Event::Done { generation: 2 }));\n    let mut cancelled = Job { generation: 3, cancelled: true, finished: false, progress: 20 };\n    assert!(!apply_event(&mut cancelled, Event::Done { generation: 3 }));\n    assert_eq!(cancelled.progress, 20);\n    assert!(!cancelled.finished);\n    println!(\"Tiến độ {}%, kết quả đã chốt\", job.progress);\n}",
      "solutionCode": "#[derive(Debug, PartialEq)]\nstruct Job { generation: u64, cancelled: bool, finished: bool, progress: u8 }\nenum Event {\n    Progress { generation: u64, percent: u8 },\n    Done { generation: u64 },\n}\nfn apply_event(job: &mut Job, event: Event) -> bool {\n    let generation = match &event {\n        Event::Progress { generation, .. } | Event::Done { generation } => *generation,\n    };\n    if generation != job.generation || job.cancelled || job.finished { return false; }\n    match event {\n        Event::Progress { percent, .. } => job.progress = job.progress.max(percent.min(100)),\n        Event::Done { .. } => { job.progress = 100; job.finished = true; }\n    }\n    true\n}\nfn main() {\n    let mut job = Job { generation: 2, cancelled: false, finished: false, progress: 0 };\n    assert!(!apply_event(&mut job, Event::Done { generation: 1 }));\n    assert_eq!(job.progress, 0);\n    assert!(apply_event(&mut job, Event::Progress { generation: 2, percent: 80 }));\n    assert!(apply_event(&mut job, Event::Progress { generation: 2, percent: 40 }));\n    assert_eq!(job.progress, 80);\n    assert!(apply_event(&mut job, Event::Progress { generation: 2, percent: 250 }));\n    assert_eq!(job.progress, 100);\n    assert!(apply_event(&mut job, Event::Done { generation: 2 }));\n    assert!(!apply_event(&mut job, Event::Done { generation: 2 }));\n    let mut cancelled = Job { generation: 3, cancelled: true, finished: false, progress: 20 };\n    assert!(!apply_event(&mut cancelled, Event::Done { generation: 3 }));\n    assert_eq!(cancelled.progress, 20);\n    assert!(!cancelled.finished);\n    println!(\"Tiến độ {}%, kết quả đã chốt\", job.progress);\n}",
      "expectedOutput": "Tiến độ 100%, kết quả đã chốt",
      "hints": [
        "Đọc generation từ &event để chưa tiêu thụ event.",
        "Kiểm tra điều kiện bỏ qua trước bất kỳ phép gán nào.",
        "Kết hợp max với min để tiến độ không giảm và không vượt 100."
      ],
      "quiz": {
        "question": "Người dùng đóng màn hình ngay sau khi Rust đã lưu thành công dữ liệu. API cancel nên được hiểu thế nào?",
        "options": [
          "Luôn tự xóa dữ liệu đã lưu.",
          "Chỉ làm wrapper biến mất; mọi tài nguyên chắc chắn đã đóng.",
          "Theo hợp đồng của thư viện: dừng phần việc còn lại nếu có thể, không mặc nhiên hoàn tác dữ liệu đã lưu.",
          "Cho phép bỏ mọi kiểm tra request ID vì màn hình đã đóng."
        ],
        "correct": 2,
        "explanation": "Hủy, giải phóng tham chiếu và rollback là các hành vi riêng. API phải nói rõ chúng; dữ liệu đã commit cần được quan sát hoặc phục hồi bằng thao tác nghiệp vụ phù hợp."
      },
      "reference": {
        "label": "UniFFI: async và thiết kế hủy",
        "url": "https://mozilla.github.io/uniffi-rs/latest/futures.html"
      }
    },
    {
      "id": "mobile-storage-adapters",
      "moduleId": "track-mobile",
      "title": "Lưu trữ có phiên bản và adapter nền tảng",
      "duration": 60,
      "description": "Tách dữ liệu lưu lâu dài khỏi wire format của FFI; kiểm tra migration, dữ liệu hỏng và quyền truy cập tài nguyên.",
      "objectives": [
        "Thiết kế schema lưu trữ có version và giới hạn kích thước",
        "Chuyển dữ liệu cũ sang mô hình hiện hành bằng hàm thuần",
        "Đặt ranh giới cho tệp và dịch vụ bảo vệ bí mật của nền tảng",
        "Kiểm thử lỗi đọc/ghi mà không mất bản dữ liệu hợp lệ"
      ],
      "sections": [
        {
          "title": "Định dạng FFI không phải định dạng lưu lâu dài",
          "text": "Một record đi qua UniFFI được chuyển qua lớp FFI bằng cơ chế do công cụ quản lý. Không lấy buffer nội bộ ấy làm định dạng tệp của sản phẩm: phiên bản công cụ và cách biểu diễn bên trong không phải cam kết schema dữ liệu của ứng dụng. Thiết kế persistence riêng bằng một định dạng đã chọn, có version và giới hạn rõ ràng.\n\nMỗi trường cần ý nghĩa ổn định: timestamp theo đơn vị nào, chuỗi có chuẩn hóa không, giá trị thiếu khác giá trị rỗng thế nào. Ghi cả dữ liệu cũ mẫu vào repository để phiên bản mới đọc được trong test. Kiểm thử hợp đồng storage có thể chạy độc lập với UI và độc lập với việc sinh lại binding."
        },
        {
          "title": "Migration phải kiểm tra trước khi tạo trạng thái mới",
          "text": "Tách đọc cấu trúc, kiểm tra giới hạn, chuyển sang mô hình hiện hành và ghi kết quả thành các bước. Một schema v1 chưa có archived có thể được nâng lên với mặc định false; schema không nhận diện phải trả lỗi thay vì đoán. Giới hạn kích thước trước khi cấp phát theo độ dài trong tệp, và kiểm tra UTF-8 trước khi tạo String.\n\nBài tập dùng định dạng nhỏ để nhìn rõ từng byte: v1 có version, độ dài u16 little-endian rồi tiêu đề; v2 thêm cờ archived trước độ dài. Nó không phải định dạng được khuyên dùng cho mọi sản phẩm. Giá trị của bài tập là kiểm tra phiên bản, dữ liệu thiếu, dữ liệu thừa và nhánh lỗi mà không dùng unsafe.",
          "code": "// Kiểm tra slice trước khi đọc độ dài; không transmute struct.\nfn read_length(bytes: &[u8]) -> Option<usize> {\n    let pair = bytes.get(..2)?;\n    Some(u16::from_le_bytes([pair[0], pair[1]]) as usize)\n}"
        },
        {
          "title": "Adapter đặt tài nguyên vào đúng nơi được phép",
          "text": "Lõi nên yêu cầu lưu một ghi chú theo ID, không nhận đường dẫn tùy ý rồi tự ghi bất kỳ nơi nào. Adapter chọn thư mục ứng dụng, thực hiện I/O và ánh xạ lỗi. Với thao tác thay thế tệp, thiết kế bước ghi bản mới, hoàn tất và thay thế theo khả năng hệ điều hành; không coi một lần write thành công là bằng chứng dữ liệu đã bền vững qua mất điện.\n\nBí mật cần chính sách riêng. Apple Keychain hỗ trợ lưu các dữ liệu bí mật nhỏ; Android Keystore quản lý khóa mật mã với các hạn chế sử dụng, không phải kho String tùy ý tương đương Keychain. Adapter nền tảng có thể thực hiện thao tác mật mã hoặc trả thông tin cần thiết cho lõi mà không xuất khóa ra dưới dạng byte."
        },
        {
          "title": "Thử các sự cố người dùng thực sự gặp",
          "text": "Hãy test tệp trống, version mới hơn, UTF-8 sai, độ dài khai báo lớn, hết chỗ ghi và ứng dụng bị dừng giữa migration. Nếu không đọc được bản mới, giữ nguyên dữ liệu gốc để người dùng còn đường phục hồi; không tự lưu một cấu trúc rỗng lên trên bản lỗi. Định nghĩa hành vi khi nâng cấp ứng dụng rồi quay về phiên bản cũ.\n\nBộ test Rust dùng adapter giả để điều khiển lỗi; test thiết bị xác minh quyền, thư mục và dịch vụ bảo vệ khóa thật. Log nên chứa mã lỗi, bước thực hiện và ID không nhạy cảm đủ để điều tra. Tránh ghi toàn bộ ghi chú hoặc token vào log chỉ vì chúng đang có sẵn trong một record lỗi."
        }
      ],
      "tip": "Giữ fixture của mọi schema đã phát hành. Migration thành công phải chứng minh dữ liệu được bảo toàn, không chỉ tạo ra một tệp mới.",
      "exercise": {
        "title": "Đọc dữ liệu hai phiên bản một cách có giới hạn",
        "instructions": "Hoàn thiện decode_note. v1: [1, len_lo, len_hi, UTF-8...]. v2: [2, archived, len_lo, len_hi, UTF-8...], archived chỉ nhận 0 hoặc 1. Nâng v1 thành archived=false.",
        "requirements": [
          "Chỉ nhận v1/v2 và tiêu đề không rỗng, tối đa 256 byte.",
          "Độ dài payload phải khớp chính xác: từ chối cả dữ liệu thiếu và thừa.",
          "Kiểm tra UTF-8; không dùng unsafe và không cấp phát theo độ dài chưa kiểm tra."
        ]
      },
      "starterCode": "#[derive(Debug, PartialEq)]\nstruct Note { title: String, archived: bool }\n#[derive(Debug, PartialEq)]\nenum DecodeError { Unsupported, Truncated, InvalidFlag, TooLarge, LengthMismatch, InvalidUtf8, Empty }\nfn decode_note(bytes: &[u8]) -> Result<Note, DecodeError> {\n    todo!()\n}\nfn main() {\n    assert_eq!(decode_note(&[1, 2, 0, b'H', b'i']), Ok(Note { title: \"Hi\".into(), archived: false }));\n    assert_eq!(decode_note(&[2, 1, 2, 0, b'H', b'i']), Ok(Note { title: \"Hi\".into(), archived: true }));\n    assert_eq!(decode_note(&[]), Err(DecodeError::Truncated));\n    assert_eq!(decode_note(&[2]), Err(DecodeError::Truncated));\n    assert_eq!(decode_note(&[3]), Err(DecodeError::Unsupported));\n    assert_eq!(decode_note(&[2, 2, 0, 0]), Err(DecodeError::InvalidFlag));\n    assert_eq!(decode_note(&[1, 1, 1]), Err(DecodeError::TooLarge));\n    assert_eq!(decode_note(&[1, 2, 0, b'H']), Err(DecodeError::LengthMismatch));\n    assert_eq!(decode_note(&[1, 1, 0, b'H', b'i']), Err(DecodeError::LengthMismatch));\n    assert_eq!(decode_note(&[1, 1, 0, 255]), Err(DecodeError::InvalidUtf8));\n    assert_eq!(decode_note(&[1, 0, 0]), Err(DecodeError::Empty));\n    println!(\"Đọc v1 và v2, từ chối dữ liệu sai\");\n}",
      "solutionCode": "#[derive(Debug, PartialEq)]\nstruct Note { title: String, archived: bool }\n#[derive(Debug, PartialEq)]\nenum DecodeError { Unsupported, Truncated, InvalidFlag, TooLarge, LengthMismatch, InvalidUtf8, Empty }\nfn decode_note(bytes: &[u8]) -> Result<Note, DecodeError> {\n    let version = *bytes.first().ok_or(DecodeError::Truncated)?;\n    let (archived, length_at, start) = match version {\n        1 => (false, 1, 3),\n        2 => {\n            let flag = *bytes.get(1).ok_or(DecodeError::Truncated)?;\n            if flag > 1 { return Err(DecodeError::InvalidFlag); }\n            (flag == 1, 2, 4)\n        }\n        _ => return Err(DecodeError::Unsupported),\n    };\n    let raw_length = bytes.get(length_at..start).ok_or(DecodeError::Truncated)?;\n    let length = u16::from_le_bytes([raw_length[0], raw_length[1]]) as usize;\n    if length > 256 { return Err(DecodeError::TooLarge); }\n    if bytes.len() != start + length { return Err(DecodeError::LengthMismatch); }\n    let title = std::str::from_utf8(&bytes[start..]).map_err(|_| DecodeError::InvalidUtf8)?;\n    if title.is_empty() { return Err(DecodeError::Empty); }\n    Ok(Note { title: title.to_owned(), archived })\n}\nfn main() {\n    assert_eq!(decode_note(&[1, 2, 0, b'H', b'i']), Ok(Note { title: \"Hi\".into(), archived: false }));\n    assert_eq!(decode_note(&[2, 1, 2, 0, b'H', b'i']), Ok(Note { title: \"Hi\".into(), archived: true }));\n    assert_eq!(decode_note(&[]), Err(DecodeError::Truncated));\n    assert_eq!(decode_note(&[2]), Err(DecodeError::Truncated));\n    assert_eq!(decode_note(&[3]), Err(DecodeError::Unsupported));\n    assert_eq!(decode_note(&[2, 2, 0, 0]), Err(DecodeError::InvalidFlag));\n    assert_eq!(decode_note(&[1, 1, 1]), Err(DecodeError::TooLarge));\n    assert_eq!(decode_note(&[1, 2, 0, b'H']), Err(DecodeError::LengthMismatch));\n    assert_eq!(decode_note(&[1, 1, 0, b'H', b'i']), Err(DecodeError::LengthMismatch));\n    assert_eq!(decode_note(&[1, 1, 0, 255]), Err(DecodeError::InvalidUtf8));\n    assert_eq!(decode_note(&[1, 0, 0]), Err(DecodeError::Empty));\n    println!(\"Đọc v1 và v2, từ chối dữ liệu sai\");\n}",
      "expectedOutput": "Đọc v1 và v2, từ chối dữ liệu sai",
      "hints": [
        "get và first giúp phát hiện header thiếu trước khi index.",
        "Chọn vị trí độ dài và vị trí payload theo version.",
        "Đọc u16 bằng from_le_bytes; kiểm tra giới hạn rồi mới kiểm tra UTF-8 và to_owned."
      ],
      "quiz": {
        "question": "Có thể lưu nguyên RustBuffer nội bộ của UniFFI làm tệp dữ liệu lâu dài của ứng dụng không?",
        "options": [
          "Nên làm vì nó tự bảo đảm tương thích mọi phiên bản.",
          "Chỉ cần thêm repr(C) vào record.",
          "Nên thiết kế schema persistence riêng có version và migration; buffer nội bộ phục vụ FFI.",
          "Chỉ iOS cần version, Android không cần."
        ],
        "correct": 2,
        "explanation": "Lớp chuyển dữ liệu qua FFI và định dạng storage có trách nhiệm khác nhau. Schema riêng giúp kiểm soát dữ liệu cũ, lỗi đầu vào và nâng cấp mà không phụ thuộc chi tiết nội bộ của generator."
      },
      "reference": {
        "label": "UniFFI: lifting, lowering và serialization",
        "url": "https://mozilla.github.io/uniffi-rs/latest/internals/lifting_and_lowering.html"
      }
    },
    {
      "id": "mobile-release-performance",
      "moduleId": "track-mobile",
      "title": "Tương thích, phát hành và đo chi phí qua FFI",
      "duration": 55,
      "description": "Phát hành binding và native binary như một đơn vị, kiểm thử qua ba ngôn ngữ và tối ưu theo số đo trên thiết bị.",
      "objectives": [
        "Phân biệt tương thích API, ABI và dữ liệu lưu trữ",
        "Xây bộ fixture dùng chung cho Rust, Swift và Kotlin",
        "Đo chi phí chuyển dữ liệu cùng thời gian thực thi",
        "Thiết kế API theo lô hoặc theo trang có giới hạn"
      ],
      "sections": [
        {
          "title": "Ba loại tương thích cần được xem riêng",
          "text": "Thay tên một hàm có thể làm mã Swift/Kotlin không biên dịch; đổi kiểu hoặc metadata FFI có thể làm cặp binding–binary không khớp; đổi schema lưu trữ có thể khiến bản mới không đọc được dữ liệu cũ. Một nhãn version duy nhất không tự chứng minh cả ba khía cạnh đều tương thích. Review thay đổi bằng ví dụ của mã gọi và fixture dữ liệu đã phát hành.\n\nQuy tắc SemVer của Cargo hữu ích cho API Rust, nhưng không thay thế kiểm thử API được sinh cho ngôn ngữ khác. Thêm một trường bắt buộc vào record hoặc biến thể enum có thể ảnh hưởng nơi khởi tạo, match hoặc xử lý lỗi của client. Giữ ghi chú thay đổi và quy trình chuyển đổi trước khi xóa API cũ."
        },
        {
          "title": "Phát hành một bộ artifact có thể truy nguyên",
          "text": "Gói native binary, binding, cấu hình sinh mã và manifest từ cùng commit, cùng phiên bản UniFFI và tập feature đã kiểm chứng. Không ghép source binding mới với thư viện cũ để tiết kiệm một bước build. Nếu generator báo không tương thích, tìm nguyên nhân của cặp artifact thay vì vô hiệu hóa kiểm tra.\n\nCI nên build từ checkout sạch với lockfile, chạy test Rust, sinh binding rồi biên dịch smoke test cho Swift/Kotlin. Tách kết quả host, simulator và thiết bị thật trong báo cáo. Một bản sinh mã thành công mới chứng minh bước sinh mã; một hàm chạy qua FFI mới kiểm tra thêm lớp kết nối; UI test còn phải chứng minh trải nghiệm của ứng dụng."
        },
        {
          "title": "Đo hành trình dữ liệu qua ranh giới",
          "text": "Một phép tính Rust rất nhanh vẫn có thể nằm trong một thao tác chậm vì chuyển hàng nghìn record, tạo nhiều wrapper hoặc cập nhật UI quá thường xuyên. Đo tổng thời gian ở phía gọi và phân tách những phần có thể quan sát: chuẩn bị dữ liệu, gọi FFI, tính toán, chuyển kết quả và render. Đo kích thước payload cùng số lần gọi để giải thích vì sao một thay đổi có tác dụng.\n\nSo sánh lấy từng mục với lấy một trang nhỏ hoặc một bản tóm tắt. Không đổi sang trả toàn bộ dữ liệu chỉ để giảm số lời gọi: bộ nhớ và độ trễ của lần phản hồi đầu cũng quan trọng. Benchmark phải dùng dữ liệu đại diện, bản release và thiết bị được ghi rõ; tránh suy từ một lần chạy trên laptop sang trải nghiệm mobile.",
          "code": "// API nội bộ để giới hạn kích thước phản hồi.\nstruct Page {\n    ids: Vec<u32>,\n    next_offset: Option<usize>,\n}\n// Khi xuất FFI, dùng kiểu số cố định và kiểm tra chuyển đổi, không xuất usize."
        },
        {
          "title": "Định nghĩa tiêu chí để biết tối ưu vẫn đúng",
          "text": "Giảm số lời gọi không được làm mất thứ tự, bỏ sót mục hoặc trả trùng dữ liệu. Bài tập chia một snapshot thành các trang có giới hạn để kiểm tra những bất biến đó. Offset chỉ phù hợp khi dữ liệu giữ nguyên trong thời gian đọc; với nguồn thay đổi liên tục, cần snapshot ID hoặc cursor có hợp đồng riêng để không lặp hoặc mất bản ghi.\n\nKhi bàn giao dự án, trình bày một quyết định kèm số đo và tradeoff: chọn kích thước trang nào, dữ liệu nào được copy, tài nguyên nào được giữ và phản hồi khi hủy. Tài liệu tốt giúp người khác tái hiện test, cập nhật dependency và chẩn đoán một bản build sai target mà không cần tác giả ngồi cạnh."
        }
      ],
      "tip": "Đo thời gian từ phía Swift/Kotlin và kiểm tra đúng đắn trên cùng dữ liệu; benchmark riêng hàm Rust chưa phản ánh toàn bộ trải nghiệm.",
      "exercise": {
        "title": "Trả dữ liệu theo trang có giới hạn",
        "instructions": "Viết page cho một snapshot không thay đổi. Giới hạn mỗi trang từ 1 đến 3 mục; next_offset chỉ xuất hiện nếu còn dữ liệu.",
        "requirements": [
          "Giữ nguyên thứ tự và không vượt số mục được yêu cầu.",
          "Offset bằng độ dài trả trang rỗng cuối; lớn hơn độ dài trả InvalidOffset.",
          "Limit ngoài 1..=3 trả InvalidLimit; tránh phép cộng offset gây tràn."
        ]
      },
      "starterCode": "#[derive(Debug, PartialEq)]\nstruct Page { ids: Vec<u32>, next_offset: Option<usize> }\n#[derive(Debug, PartialEq)]\nenum PageError { InvalidLimit, InvalidOffset }\nfn page(ids: &[u32], offset: usize, limit: usize) -> Result<Page, PageError> {\n    todo!()\n}\nfn main() {\n    let ids = [10, 20, 30, 40, 50];\n    assert_eq!(page(&ids, 0, 3), Ok(Page { ids: vec![10, 20, 30], next_offset: Some(3) }));\n    assert_eq!(page(&ids, 3, 3), Ok(Page { ids: vec![40, 50], next_offset: None }));\n    assert_eq!(page(&ids, 5, 2), Ok(Page { ids: vec![], next_offset: None }));\n    assert_eq!(page(&[], 0, 1), Ok(Page { ids: vec![], next_offset: None }));\n    assert_eq!(page(&ids, 0, 0), Err(PageError::InvalidLimit));\n    assert_eq!(page(&ids, 0, 4), Err(PageError::InvalidLimit));\n    assert_eq!(page(&ids, usize::MAX, 3), Err(PageError::InvalidOffset));\n    let first = page(&ids, 0, 3).unwrap();\n    let second = page(&ids, first.next_offset.unwrap(), 3).unwrap();\n    assert_eq!([first.ids, second.ids].concat(), ids);\n    println!(\"5 mục qua 2 trang, giữ nguyên thứ tự\");\n}",
      "solutionCode": "#[derive(Debug, PartialEq)]\nstruct Page { ids: Vec<u32>, next_offset: Option<usize> }\n#[derive(Debug, PartialEq)]\nenum PageError { InvalidLimit, InvalidOffset }\nfn page(ids: &[u32], offset: usize, limit: usize) -> Result<Page, PageError> {\n    if !(1..=3).contains(&limit) { return Err(PageError::InvalidLimit); }\n    if offset > ids.len() { return Err(PageError::InvalidOffset); }\n    let end = offset.saturating_add(limit).min(ids.len());\n    Ok(Page { ids: ids[offset..end].to_vec(), next_offset: (end < ids.len()).then_some(end) })\n}\nfn main() {\n    let ids = [10, 20, 30, 40, 50];\n    assert_eq!(page(&ids, 0, 3), Ok(Page { ids: vec![10, 20, 30], next_offset: Some(3) }));\n    assert_eq!(page(&ids, 3, 3), Ok(Page { ids: vec![40, 50], next_offset: None }));\n    assert_eq!(page(&ids, 5, 2), Ok(Page { ids: vec![], next_offset: None }));\n    assert_eq!(page(&[], 0, 1), Ok(Page { ids: vec![], next_offset: None }));\n    assert_eq!(page(&ids, 0, 0), Err(PageError::InvalidLimit));\n    assert_eq!(page(&ids, 0, 4), Err(PageError::InvalidLimit));\n    assert_eq!(page(&ids, usize::MAX, 3), Err(PageError::InvalidOffset));\n    let first = page(&ids, 0, 3).unwrap();\n    let second = page(&ids, first.next_offset.unwrap(), 3).unwrap();\n    assert_eq!([first.ids, second.ids].concat(), ids);\n    println!(\"5 mục qua 2 trang, giữ nguyên thứ tự\");\n}",
      "expectedOutput": "5 mục qua 2 trang, giữ nguyên thứ tự",
      "hints": [
        "Kiểm tra limit và offset trước khi cắt slice.",
        "Lấy end nhỏ hơn giữa độ dài dữ liệu và offset cộng limit có kiểm soát.",
        "Chỉ trả Some(end) khi end còn nhỏ hơn tổng độ dài."
      ],
      "quiz": {
        "question": "Lõi Rust tính xong trong 1 ms, nhưng màn hình mất 150 ms để hiển thị. Bước đánh giá tiếp theo hợp lý là gì?",
        "options": [
          "Kết luận Rust chậm và viết lại bằng unsafe.",
          "Đo chuyển đổi dữ liệu, số lần gọi FFI, cấp phát và render ở phía ứng dụng.",
          "Chỉ chạy benchmark hàm Rust thêm nhiều lần trên laptop.",
          "Trả toàn bộ dữ liệu không giới hạn để chắc chắn ít lời gọi."
        ],
        "correct": 1,
        "explanation": "Trải nghiệm phụ thuộc cả hành trình dữ liệu và UI. Cần đo phần chưa biết trước khi thay đổi kiến trúc; ít lời gọi hơn không luôn tốt nếu payload hoặc bộ nhớ tăng quá mức."
      },
      "reference": {
        "label": "Cargo: phạm vi tương thích SemVer",
        "url": "https://doc.rust-lang.org/cargo/reference/semver.html"
      }
    }
  ]
};
