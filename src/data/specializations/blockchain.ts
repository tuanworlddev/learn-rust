import type { SpecializationBundle } from "../specialization-types";

export const blockchainBundle: SpecializationBundle = {
  "track": {
    "id": "blockchain",
    "title": "Blockchain với Solana và Anchor",
    "shortTitle": "Blockchain",
    "description": "Viết chương trình Solana bằng Rust: account, PDA, phân quyền, giao tiếp giữa chương trình và kiểm thử trạng thái.",
    "outcome": "Xây chương trình quản lý hạn mức có phân quyền, chống thực hiện lặp, client theo dõi xác nhận và hồ sơ kiểm thử trước khi phát hành.",
    "prerequisites": [
      "Ownership, borrowing, Result và trait",
      "Đọc và ghi định dạng nhị phân, số học checked",
      "Cargo, kiểm thử đơn vị và integration test",
      "Khái niệm chữ ký số, khóa công khai và hàm băm",
      "HTTP/RPC và trạng thái bất đồng bộ"
    ],
    "technologies": [
      "Solana",
      "Anchor 1.2",
      "PDA",
      "CPI",
      "LiteSVM",
      "Rust"
    ],
    "color": "purple",
    "lessonIds": [
      "blockchain-accounts",
      "blockchain-pda",
      "blockchain-anchor-state",
      "blockchain-cpi",
      "blockchain-transactions",
      "blockchain-testing-release"
    ],
    "capstone": {
      "title": "Sổ hạn mức có xác thực và nhật ký yêu cầu",
      "description": "Xây chương trình cho phép mỗi tài khoản tạo hạn mức sử dụng dịch vụ, tiêu thụ theo revision và kiểm tra lịch sử yêu cầu. Dùng dữ liệu giả lập trong môi trường local; mục tiêu là chứng minh tính đúng của quyền và trạng thái.",
      "milestones": [
        {
          "title": "Hợp đồng account và trạng thái",
          "tasks": [
            "Vẽ quan hệ giữa authority, quota PDA, request receipt và program ID; mô tả owner, signer, writable cho từng instruction.",
            "Định nghĩa schema có version, đơn vị số nguyên, giới hạn kích thước và chính sách đóng/mở lại account."
          ],
          "acceptance": "Có bảng bất biến và bộ fixture byte; mọi instruction nêu rõ ai được gọi, thay đổi trường nào và điều kiện thất bại."
        },
        {
          "title": "Chương trình Anchor và ràng buộc",
          "tasks": [
            "Viết initialize, consume và read bằng Anchor; xác minh PDA, owner, discriminator, authority và chữ ký.",
            "Dùng checked arithmetic, revision và receipt theo request ID; cập nhật trạng thái sau khi toàn bộ điều kiện đã được kiểm tra."
          ],
          "acceptance": "Chủ thể sai, thiếu signer, account chỉ đọc, PDA sai, revision cũ và vượt hạn mức đều thất bại; trạng thái nghiệp vụ không đổi sau lỗi."
        },
        {
          "title": "CPI và mô phỏng giao dịch",
          "tasks": [
            "Thêm một chương trình ghi nhận độc lập hoặc System Program CPI trong môi trường local; cố định program đích và account được chuyển quyền.",
            "Chạy binary SBF trong LiteSVM hoặc local validator; kiểm tra quyền PDA signer và đọc lại account sau CPI khi cần."
          ],
          "acceptance": "Có test thay program ID, thiếu account, yêu cầu quyền quá mức và CPI thất bại; kiểm tra toàn bộ trạng thái trước/sau transaction."
        },
        {
          "title": "Client và phục hồi kết nối",
          "tasks": [
            "Tạo client từ IDL đúng phiên bản; dùng kiểu số nguyên phù hợp cho u64, hiển thị trạng thái gửi, xác nhận và hết hạn.",
            "Lưu request ID và signature; khi mất phản hồi, đối chiếu receipt trước khi dựng transaction mới với cùng danh tính nghiệp vụ."
          ],
          "acceptance": "Mô phỏng phản hồi RPC bị mất và blockhash hết hạn không làm trừ hạn mức hai lần; giao diện không báo thành công chỉ vì đã có signature."
        },
        {
          "title": "Kiểm thử và hồ sơ phát hành",
          "tasks": [
            "Lưu Cargo.lock, phiên bản Anchor/Solana/platform-tools, IDL và lệnh tái tạo build; đo compute units trên ca bình thường và ca biên.",
            "Viết migration từ schema v1 sang v2, kiểm thử dữ liệu cũ, phân quyền nâng cấp và quy trình so sánh binary đã phát hành với source."
          ],
          "acceptance": "Người review chạy lại test từ checkout sạch, kiểm chứng migration lặp an toàn và xem được ma trận test âm; host test, SBF test và kiểm tra RPC được báo cáo riêng."
        }
      ],
      "deliverables": [
        "Cargo workspace, Cargo.lock và IDL cùng phiên bản",
        "Chương trình Anchor, client và dữ liệu mẫu",
        "Bộ test quyền, replay, arithmetic, CPI và migration",
        "Báo cáo compute units kèm toolchain và cấu hình VM",
        "README tái tạo build, xác minh release và quản lý upgrade authority"
      ],
      "reviewQuestions": [
        "Vì sao signer hợp lệ vẫn có thể không phải authority của account?",
        "PDA được dẫn xuất bởi program A có bắt buộc có owner là A không?",
        "has_one, seeds và Account<T> kiểm tra những điều kiện khác nhau nào?",
        "Blockhash mới có ngăn thao tác nghiệp vụ bị thực hiện hai lần không?",
        "Một CPI được phép nâng quyền signer trong trường hợp nào?",
        "Host test nào chưa đủ để chứng minh hành vi của transaction trên SVM?",
        "Nâng cấp code có tự chuyển layout của account cũ không?"
      ]
    },
    "resources": [
      {
        "label": "Solana: accounts và quy tắc sửa đổi",
        "url": "https://solana.com/docs/core/accounts"
      },
      {
        "label": "Solana: Program Derived Address",
        "url": "https://solana.com/docs/core/pda"
      },
      {
        "label": "Solana: Cross-Program Invocation",
        "url": "https://solana.com/docs/core/cpi"
      },
      {
        "label": "Anchor 1.2.2: release notes",
        "url": "https://www.anchor-lang.com/docs/updates/release-notes/1-2-2"
      },
      {
        "label": "Anchor: account constraints",
        "url": "https://www.anchor-lang.com/docs/references/account-constraints"
      },
      {
        "label": "Anchor: LiteSVM",
        "url": "https://www.anchor-lang.com/docs/testing/litesvm"
      },
      {
        "label": "Anchor: verifiable builds",
        "url": "https://www.anchor-lang.com/docs/references/verifiable-builds"
      },
      {
        "label": "Solana: confirmation và expiration",
        "url": "https://solana.com/developers/cookbook/transactions/confirmation"
      }
    ]
  },
  "lessons": [
    {
      "id": "blockchain-accounts",
      "moduleId": "track-blockchain",
      "title": "Account, instruction và quyền thay đổi trạng thái",
      "duration": 50,
      "description": "Phân biệt địa chỉ, owner program, authority nghiệp vụ và chữ ký trước khi viết instruction.",
      "objectives": [
        "Mô tả account và instruction trong Solana",
        "Phân biệt owner, authority, signer và writable",
        "Thiết kế kiểm tra account theo từng vai trò",
        "Tách phần kiểm tra thuần khỏi runtime của blockchain"
      ],
      "sections": [
        {
          "title": "Trạng thái nằm trong account",
          "text": "Một chương trình Solana nhận các account và dữ liệu instruction để thực hiện một bước chuyển trạng thái. Account chứa địa chỉ, lamports, vùng dữ liệu, owner program và cờ executable. Program account xác định chương trình thực thi; nơi lưu binary còn phụ thuộc loader. Dữ liệu nghiệp vụ thường nằm trong account riêng. Biến cục bộ Rust biến mất khi lời gọi kết thúc, nên không thể dùng biến static để thay thế nơi lưu trạng thái.\n\nHãy bắt đầu bằng một ứng dụng hạn mức: authority xác định người được sử dụng, remaining là số đơn vị còn lại, revision tăng sau mỗi lần thay đổi. Danh sách account và layout dữ liệu là một phần hợp đồng công khai. Client có thể tự tạo instruction mà không đi qua giao diện bạn viết."
        },
        {
          "title": "Bốn khái niệm quyền độc lập",
          "text": "Owner program là trường do runtime quản lý, quyết định chương trình nào được sửa dữ liệu account. Authority là khóa được ứng dụng lưu trong dữ liệu để biểu diễn quyền nghiệp vụ. Signer cho biết quyền ký có mặt trong lời gọi; writable cho biết account được phép thay đổi. Bốn điều này không thay thế nhau.\n\nMột chữ ký hợp lệ từ Bob không cho Bob sửa hạn mức của Alice. Account thuộc đúng program nhưng chứa authority khác cũng phải bị từ chối. Ngược lại, dữ liệu ghi đúng authority vẫn chưa đủ nếu account đó thuộc một program khác. Kiểm tra địa chỉ, owner, kiểu dữ liệu và quan hệ authority trước khi dùng giá trị để quyết định quyền."
        },
        {
          "title": "Làm rõ hợp đồng của từng instruction",
          "text": "Với consume, account quota phải writable và thuộc program hiện tại; authority phải signer và khớp trường đã lưu. Không đánh dấu mọi account writable cho tiện: các tài khoản ghi chung gây tranh chấp khi xử lý giao dịch. Chỉ truyền account thực sự cần thiết, rồi chỉ rõ account nào có thể bị CPI sửa tiếp.\n\nBài tập dùng số nhỏ thay cho khóa 32 byte để tập trung vào điều kiện. Hàm kiểm tra không xác minh chữ ký mật mã hay owner của runtime; các cờ là dữ liệu quan sát đã được môi trường thực thi cung cấp. Khi đưa vào chương trình thật, lấy chúng từ AccountInfo hoặc kiểu Anchor, tuyệt đối không lấy từ payload do client tự khai.",
          "code": "// Mô hình điều kiện, chưa phải trình xác minh chữ ký.\nlet authorized = account_owner == program_id\n    && supplied_authority == stored_authority\n    && is_signer\n    && is_writable;"
        },
        {
          "title": "Rust an toàn bộ nhớ và logic ứng dụng",
          "text": "Borrow checker giúp tránh nhiều lỗi quản lý bộ nhớ nhưng không biết ai được tiêu thụ hạn mức. Một hàm Rust biên dịch thành công vẫn có thể cho nhầm người quyền sửa account. Vì vậy hãy viết bảng ca kiểm tra: đúng toàn bộ, sai owner, sai authority, thiếu chữ ký và account chỉ đọc.\n\nĐặt kiểm tra trước thay đổi dữ liệu; trả lỗi có ý nghĩa để client phân biệt yêu cầu không hợp lệ với sự cố mạng. Ngoài test hàm thuần, cần test instruction trong SVM để xác nhận runtime và các ràng buộc account. Các bài sau sẽ ghép hàm này với PDA, Anchor và kiểm thử giao dịch nguyên tử."
        }
      ],
      "tip": "Khi review một account, trả lời riêng: địa chỉ nào, owner nào, ai có quyền nghiệp vụ, ai ký và có được ghi không.",
      "exercise": {
        "title": "Kiểm tra quyền dùng hạn mức",
        "instructions": "Hoàn thiện authorize theo đúng thứ tự kiểm tra owner, writable, chữ ký và authority. Mỗi lỗi phải có mã riêng, không thay đổi dữ liệu đầu vào.",
        "requirements": [
          "Từ chối owner khác program trước các kiểm tra khác.",
          "Từ chối quota chỉ đọc hoặc authority không ký.",
          "Chỉ chấp nhận khi khóa authority cung cấp khớp khóa đã lưu."
        ]
      },
      "starterCode": "#[derive(Debug, PartialEq, Eq)]\nenum Denied { Owner, ReadOnly, Signature, Authority }\n#[derive(Clone, Copy)]\nstruct Access { owner: u8, writable: bool, signer: bool, authority: u8 }\nfn authorize(a: Access, program: u8, expected_authority: u8) -> Result<(), Denied> {\n    todo!()\n}\nfn main() {\n    let good = Access { owner: 7, writable: true, signer: true, authority: 9 };\n    assert_eq!(authorize(good, 7, 9), Ok(()));\n    assert_eq!(authorize(Access { owner: 8, signer: false, ..good }, 7, 9), Err(Denied::Owner));\n    assert_eq!(authorize(Access { writable: false, ..good }, 7, 9), Err(Denied::ReadOnly));\n    assert_eq!(authorize(Access { signer: false, ..good }, 7, 9), Err(Denied::Signature));\n    assert_eq!(authorize(Access { authority: 10, ..good }, 7, 9), Err(Denied::Authority));\n    println!(\"Quyền: 1 hợp lệ, 4 bị từ chối\");\n}",
      "solutionCode": "#[derive(Debug, PartialEq, Eq)]\nenum Denied { Owner, ReadOnly, Signature, Authority }\n#[derive(Clone, Copy)]\nstruct Access { owner: u8, writable: bool, signer: bool, authority: u8 }\nfn authorize(a: Access, program: u8, expected_authority: u8) -> Result<(), Denied> {\n    if a.owner != program { return Err(Denied::Owner); }\n    if !a.writable { return Err(Denied::ReadOnly); }\n    if !a.signer { return Err(Denied::Signature); }\n    if a.authority != expected_authority { return Err(Denied::Authority); }\n    Ok(())\n}\nfn main() {\n    let good = Access { owner: 7, writable: true, signer: true, authority: 9 };\n    assert_eq!(authorize(good, 7, 9), Ok(()));\n    assert_eq!(authorize(Access { owner: 8, signer: false, ..good }, 7, 9), Err(Denied::Owner));\n    assert_eq!(authorize(Access { writable: false, ..good }, 7, 9), Err(Denied::ReadOnly));\n    assert_eq!(authorize(Access { signer: false, ..good }, 7, 9), Err(Denied::Signature));\n    assert_eq!(authorize(Access { authority: 10, ..good }, 7, 9), Err(Denied::Authority));\n    println!(\"Quyền: 1 hợp lệ, 4 bị từ chối\");\n}",
      "expectedOutput": "Quyền: 1 hợp lệ, 4 bị từ chối",
      "hints": [
        "Dùng các nhánh return Err(...) trước Ok(()).",
        "Signer phải gắn với đúng khóa authority, không chỉ một người ký bất kỳ."
      ],
      "quiz": {
        "question": "Quota thuộc đúng program và Bob đã ký, nhưng quota lưu authority là Alice. Chương trình nên làm gì?",
        "options": [
          "Cho phép vì mọi signer đều được sửa account của program.",
          "Từ chối vì chữ ký Bob không chứng minh quyền của Alice.",
          "Đổi authority thành Bob trước khi kiểm tra.",
          "Chỉ cần kiểm tra quota còn đủ đơn vị."
        ],
        "correct": 1,
        "explanation": "Owner bảo vệ ranh giới program; kiểm tra authority bảo vệ quyền nghiệp vụ. Một signer hợp lệ không tự động có quyền trên mọi account."
      },
      "reference": {
        "label": "Solana: account model",
        "url": "https://solana.com/docs/core/accounts"
      }
    },
    {
      "id": "blockchain-pda",
      "moduleId": "track-blockchain",
      "title": "PDA, seed và danh tính ổn định của dữ liệu",
      "duration": 55,
      "description": "Dẫn xuất địa chỉ theo chủ thể, dùng canonical bump và tách quyền ký PDA khỏi owner của account.",
      "objectives": [
        "Dẫn xuất PDA bằng SDK thực",
        "Thiết kế seed cố định, có domain và thứ tự rõ ràng",
        "Phân biệt dẫn xuất địa chỉ, tạo account và gán owner",
        "Kiểm tra canonical bump và quan hệ với authority"
      ],
      "sections": [
        {
          "title": "Địa chỉ có thể tính lại",
          "text": "PDA là địa chỉ được dẫn xuất từ program ID và các seed, nằm ngoài đường cong Ed25519 nên không có khóa riêng tương ứng. Client và program dùng cùng đầu vào sẽ tính được cùng địa chỉ. Điều này phù hợp để xác định account hạn mức của một authority mà không cần lưu một khóa ngẫu nhiên trong cơ sở dữ liệu khác.\n\nDẫn xuất PDA chỉ tính địa chỉ, chưa tạo account và chưa cấp chỗ lưu dữ liệu. Tạo account vẫn là một thao tác riêng. Khi CPI cần PDA ký, runtime kiểm chứng seed theo program đang gọi. Không có file secret key của PDA để gửi cho ví hoặc đưa vào cấu hình server."
        },
        {
          "title": "Seed là hợp đồng dữ liệu",
          "text": "Chọn seed có tiền tố phân biệt loại tài nguyên, khóa authority và mã định danh số với cách mã hóa cố định. Ví dụ b\"quota\", authority.as_ref() và id.to_le_bytes(). Đổi thứ tự, cách viết hoa hoặc endian sẽ tạo danh tính khác. Không dùng chuỗi hiển thị có thể được đổi tên làm định danh lâu dài nếu chưa có kế hoạch chuyển dữ liệu.\n\nSeed có giới hạn độ dài theo byte. Một ký tự tiếng Việt có thể chiếm nhiều byte UTF-8. Các đoạn seed được băm nối tiếp nên cần tránh phân chia mơ hồ như [b\"ab\", b\"c\"] và [b\"a\", b\"bc\"]. Dùng thành phần có độ dài cố định hoặc framing được thống nhất cho dữ liệu có độ dài biến đổi."
        },
        {
          "title": "Canonical bump và owner",
          "text": "Bump là một byte được thêm để tìm địa chỉ nằm ngoài đường cong. Dùng try_find_program_address để lấy cặp địa chỉ và canonical bump; xử lý trường hợp không tìm được thay vì tự viết hàm băm hoặc giả định một bump bất kỳ hợp lệ. Khi khởi tạo account, lưu bump đã xác minh nếu cần tái sử dụng.\n\nProgram dẫn xuất PDA và owner của account là hai khái niệm riêng. Một PDA có thể là authority của token account do Token Program sở hữu. Với quota của chính mình, kiểm tra cả địa chỉ được dẫn xuất lẫn owner đúng program. Chỉ so khớp PDA không thay cho kiểm tra kiểu dữ liệu và quyền authority.",
          "code": "// Trong lab Cargo với solana-pubkey và feature curve25519.\nlet id_bytes = 42_u64.to_le_bytes();\nlet (address, bump) = Pubkey::try_find_program_address(\n    &[b\"quota\", authority.as_ref(), &id_bytes],\n    &program_id,\n).ok_or(AddressError::NoBump)?;"
        },
        {
          "title": "Kiểm thử danh tính thay vì đoán địa chỉ",
          "text": "Lab dùng SDK thật để kiểm tra cùng đầu vào cho cùng PDA, đổi authority hoặc id cho địa chỉ khác và create_program_address tái tạo địa chỉ từ bump đã tìm. Test cũng từ chối owner, địa chỉ hoặc bump không khớp. Kết quả không phụ thuộc RPC hay account đã tồn tại trên mạng.\n\nBài tập web chỉ chuẩn hóa đầu vào seed, không mô phỏng mật mã. Giữ mã hóa chuỗi và số rõ ràng, kiểm tra độ dài trước khi gọi SDK. Khi thiết kế client, dùng cùng fixture byte với program để phát hiện lỗi endian và Unicode sớm. Một địa chỉ hiển thị hợp lệ không chứng minh nó thuộc tài nguyên mà người dùng đang muốn thao tác."
        }
      ],
      "tip": "Lưu test vector cho seed và PDA trong repository; thay định dạng seed phải được xem như thay hợp đồng địa chỉ.",
      "exercise": {
        "title": "Chuẩn bị seed có giới hạn byte",
        "instructions": "Viết label_seed trả về các byte UTF-8 nguyên gốc của nhãn dài từ 1 đến 32 byte. Không trim hoặc lowercase vì các phép đổi đó làm thay danh tính; lớp giao diện có thể kiểm tra riêng trước khi tạo tài nguyên.",
        "requirements": [
          "Nhãn rỗng trả Err(\"empty\").",
          "Nhãn dài hơn 32 byte trả Err(\"too long\"), kể cả khi ít hơn 32 ký tự.",
          "Nhãn hợp lệ được sao chép nguyên byte, giữ cả khoảng trắng và chữ hoa."
        ]
      },
      "starterCode": "\nfn label_seed(label: &str) -> Result<Vec<u8>, &'static str> {\n    todo!()\n}\nfn main() {\n    assert_eq!(label_seed(\"\"), Err(\"empty\"));\n    assert_eq!(label_seed(\"A b\"), Ok(vec![65, 32, 98]));\n    assert_eq!(label_seed(\"nhật-ký\"), Ok(\"nhật-ký\".as_bytes().to_vec()));\n    assert_eq!(label_seed(&\"x\".repeat(32)).unwrap().len(), 32);\n    assert_eq!(label_seed(&\"x\".repeat(33)), Err(\"too long\"));\n    assert_eq!(label_seed(&\"ế\".repeat(11)), Err(\"too long\"));\n    assert_ne!(label_seed(\"Rust\"), label_seed(\"rust\"));\n    println!(\"Seed: giữ nguyên UTF-8, tối đa 32 byte\");\n}",
      "solutionCode": "\nfn label_seed(label: &str) -> Result<Vec<u8>, &'static str> {\n    if label.is_empty() { return Err(\"empty\"); }\n    if label.len() > 32 { return Err(\"too long\"); }\n    Ok(label.as_bytes().to_vec())\n}\nfn main() {\n    assert_eq!(label_seed(\"\"), Err(\"empty\"));\n    assert_eq!(label_seed(\"A b\"), Ok(vec![65, 32, 98]));\n    assert_eq!(label_seed(\"nhật-ký\"), Ok(\"nhật-ký\".as_bytes().to_vec()));\n    assert_eq!(label_seed(&\"x\".repeat(32)).unwrap().len(), 32);\n    assert_eq!(label_seed(&\"x\".repeat(33)), Err(\"too long\"));\n    assert_eq!(label_seed(&\"ế\".repeat(11)), Err(\"too long\"));\n    assert_ne!(label_seed(\"Rust\"), label_seed(\"rust\"));\n    println!(\"Seed: giữ nguyên UTF-8, tối đa 32 byte\");\n}",
      "expectedOutput": "Seed: giữ nguyên UTF-8, tối đa 32 byte",
      "hints": [
        "str::len() đếm byte; chars().count() không phải giới hạn seed.",
        "Trả label.as_bytes().to_vec() sau hai kiểm tra biên."
      ],
      "quiz": {
        "question": "Sau khi tính được PDA bằng find_program_address, điều gì đã xảy ra?",
        "options": [
          "Account đã được tạo và được cấp đủ lamports.",
          "Đã có một private key mới cho PDA.",
          "Chỉ xác định được địa chỉ và bump; tạo account là thao tác riêng.",
          "Owner của mọi account ở địa chỉ đó tự động là program dẫn xuất."
        ],
        "correct": 2,
        "explanation": "Dẫn xuất địa chỉ không ghi trạng thái blockchain. Tạo account, cấp bộ nhớ và gán owner phải diễn ra trong thao tác phù hợp; PDA signer cũng không đồng nghĩa owner."
      },
      "reference": {
        "label": "Solana: PDA derivation",
        "url": "https://solana.com/docs/core/pda"
      },
      "localLab": {
        "title": "PDA registry bằng Solana SDK",
        "instructions": "Tạo các tệp bên dưới trong một thư mục mới. Lab dùng solana-pubkey 4.4.0 với phép dẫn xuất PDA thật trên máy, không kết nối RPC. QuotaKey mô tả account mà ứng dụng mong đợi; validation kiểm tra cả address, owner và canonical bump.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"pda_registry\"\nversion = \"0.1.0\"\nedition = \"2021\"\npublish = false\n\n[dependencies]\nsolana-pubkey = { version = \"=4.4.0\", features = [\"curve25519\", \"sha2\"] }\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use solana_pubkey::Pubkey;\n\n#[derive(Debug, Clone, Copy, PartialEq, Eq)]\npub enum AddressError {\n    NoBump,\n    Address,\n    Owner,\n    Bump,\n}\n\n#[derive(Debug, Clone, Copy, PartialEq, Eq)]\npub struct QuotaKey {\n    pub address: Pubkey,\n    pub owner: Pubkey,\n    pub bump: u8,\n}\n\npub fn derive_quota(\n    program: &Pubkey,\n    authority: &Pubkey,\n    quota_id: u64,\n) -> Result<(Pubkey, u8), AddressError> {\n    let id_bytes = quota_id.to_le_bytes();\n    Pubkey::try_find_program_address(\n        &[b\"quota\", authority.as_ref(), &id_bytes],\n        program,\n    )\n    .ok_or(AddressError::NoBump)\n}\n\n/// Chỉ xác minh danh tính từ metadata đã đọc; không tạo account hay kiểm tra chữ ký.\npub fn validate_quota(\n    key: QuotaKey,\n    program: &Pubkey,\n    authority: &Pubkey,\n    quota_id: u64,\n) -> Result<(), AddressError> {\n    let (expected, canonical_bump) = derive_quota(program, authority, quota_id)?;\n    if key.address != expected {\n        return Err(AddressError::Address);\n    }\n    if key.owner != *program {\n        return Err(AddressError::Owner);\n    }\n    if key.bump != canonical_bump {\n        return Err(AddressError::Bump);\n    }\n    Ok(())\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use pda_registry::{derive_quota, validate_quota, QuotaKey};\nuse solana_pubkey::Pubkey;\n\nfn main() {\n    let program = Pubkey::new_from_array([7; 32]);\n    let authority = Pubkey::new_from_array([9; 32]);\n    let (address, bump) = derive_quota(&program, &authority, 42).expect(\"derive PDA\");\n    let key = QuotaKey { address, owner: program, bump };\n    validate_quota(key, &program, &authority, 42).expect(\"valid identity\");\n    println!(\"PDA: {address}\");\n    println!(\"Bump: {bump}\");\n    println!(\"Identity verified locally\");\n}\n"
          },
          {
            "path": "tests/address.rs",
            "content": "use pda_registry::{derive_quota, validate_quota, AddressError, QuotaKey};\nuse solana_pubkey::Pubkey;\n\nfn fixture() -> (Pubkey, Pubkey, QuotaKey) {\n    let program = Pubkey::new_from_array([7; 32]);\n    let authority = Pubkey::new_from_array([9; 32]);\n    let (address, bump) = derive_quota(&program, &authority, 42).unwrap();\n    (program, authority, QuotaKey { address, owner: program, bump })\n}\n\n#[test]\nfn stable_off_curve_and_reconstructable() {\n    let (program, authority, key) = fixture();\n    assert_eq!(derive_quota(&program, &authority, 42), Ok((key.address, key.bump)));\n    assert!(!key.address.is_on_curve());\n    let id_bytes = 42_u64.to_le_bytes();\n    let bump_bytes = [key.bump];\n    let recreated = Pubkey::create_program_address(\n        &[b\"quota\", authority.as_ref(), &id_bytes, &bump_bytes],\n        &program,\n    ).unwrap();\n    assert_eq!(recreated, key.address);\n    assert_eq!(validate_quota(key, &program, &authority, 42), Ok(()));\n}\n\n#[test]\nfn authority_id_and_program_are_part_of_identity() {\n    let (program, authority, key) = fixture();\n    let other_authority = Pubkey::new_from_array([10; 32]);\n    let other_program = Pubkey::new_from_array([8; 32]);\n    assert_ne!(derive_quota(&program, &other_authority, 42).unwrap().0, key.address);\n    assert_ne!(derive_quota(&program, &authority, 43).unwrap().0, key.address);\n    assert_ne!(derive_quota(&other_program, &authority, 42).unwrap().0, key.address);\n}\n\n#[test]\nfn address_owner_and_bump_are_checked_independently() {\n    let (program, authority, key) = fixture();\n    assert_eq!(\n        validate_quota(QuotaKey { address: Pubkey::new_from_array([1; 32]), ..key }, &program, &authority, 42),\n        Err(AddressError::Address),\n    );\n    assert_eq!(\n        validate_quota(QuotaKey { owner: Pubkey::new_from_array([2; 32]), ..key }, &program, &authority, 42),\n        Err(AddressError::Owner),\n    );\n    assert_eq!(\n        validate_quota(QuotaKey { bump: key.bump.wrapping_add(1), ..key }, &program, &authority, 42),\n        Err(AddressError::Bump),\n    );\n}\n\n#[test]\nfn integer_seed_has_fixed_little_endian_encoding() {\n    let (program, authority, _) = fixture();\n    for id in [0, 1, 255, 256, u64::MAX] {\n        let (address, bump) = derive_quota(&program, &authority, id).unwrap();\n        let id_bytes = id.to_le_bytes();\n        assert_eq!(id_bytes.len(), 8);\n        let bump_bytes = [bump];\n        let explicit = Pubkey::create_program_address(\n            &[b\"quota\", authority.as_ref(), &id_bytes, &bump_bytes],\n            &program,\n        ).unwrap();\n        assert_eq!(address, explicit);\n    }\n}\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run"
        ],
        "checks": [
          "Bốn integration test chạy qua; PDA không nằm trên đường cong và tái tạo được từ canonical bump.",
          "Đổi authority, quota_id hoặc program tạo danh tính khác trong các test vector.",
          "Sai address, owner và bump trả ba lỗi riêng; không có request RPC hoặc giao dịch mạng.",
          "Lưu Cargo.lock sau lần giải quyết dependency đầu tiên để chạy lại cùng bộ phiên bản."
        ]
      }
    },
    {
      "id": "blockchain-anchor-state",
      "moduleId": "track-blockchain",
      "title": "Anchor: ràng buộc account và cập nhật trạng thái",
      "duration": 65,
      "description": "Ghép kiểu account, PDA, authority và logic hạn mức trong một chương trình Anchor có thể kiểm thử.",
      "objectives": [
        "Đọc cấu trúc #[program], Context và Accounts",
        "Phân biệt validation của Account<T>, has_one, seeds và Signer",
        "Tính kích thước serialized thay vì kích thước struct trong bộ nhớ",
        "Cập nhật nhiều trường chỉ sau khi các phép checked thành công"
      ],
      "sections": [
        {
          "title": "Đọc chương trình qua ranh giới instruction",
          "text": "Anchor dùng #[program] cho các handler instruction, #[derive(Accounts)] để mô tả account đầu vào và #[account] cho dữ liệu được lưu. Context mang account đã được xử lý theo hợp đồng, program ID và các bump. Viết handler ngắn: lấy dữ liệu cần thiết, gọi logic nghiệp vụ rồi ghi kết quả.\n\nLab ghim Anchor 1.2.2 để source, macro và hướng dẫn có cùng phiên bản. initialize tạo quota riêng cho authority; consume kiểm tra revision và trừ đơn vị. Chúng dùng cùng một struct trạng thái nhưng có hợp đồng account khác nhau. initialize cần payer và System Program để tạo account, còn consume không cần những quyền đó."
        },
        {
          "title": "Mỗi ràng buộc bảo vệ một điều kiện",
          "text": "Account<Quota> kiểm tra owner và giải mã account theo kiểu Quota; Signer yêu cầu quyền ký. has_one = authority so sánh trường authority đã lưu với khóa account được truyền vào. seeds và bump xác minh địa chỉ PDA; mut cho phép lưu thay đổi. Cần ghép các điều kiện vì một điều kiện đúng không suy ra những điều kiện còn lại.\n\nKhông đổi Account<T> thành UncheckedAccount chỉ để compiler hết báo lỗi. Nếu dữ liệu phải được kiểm tra thủ công, viết rõ owner, layout và quan hệ nào được xác minh. Với account khởi tạo mới, init giúp tách tạo mới khỏi cập nhật; init_if_needed cần phân tích thêm tình huống tái khởi tạo và trạng thái đã tồn tại.",
          "code": "#[derive(Accounts)]\npub struct Consume<'info> {\n    #[account(mut, has_one = authority,\n        seeds = [b\"quota\", authority.key().as_ref()],\n        bump = quota.bump)]\n    pub quota: Account<'info, Quota>,\n    pub authority: Signer<'info>,\n}"
        },
        {
          "title": "Layout được lưu là hợp đồng",
          "text": "Quota chứa Pubkey 32 byte, hai u64 và một u8 nên phần payload cố định là 49 byte. Account thông thường của Anchor còn có discriminator; dùng Quota::DISCRIMINATOR.len() + Quota::INIT_SPACE để diễn đạt đúng kích thước trong lab. Không dùng size_of::<Quota>() vì alignment trong bộ nhớ không phải cách serialization lưu dữ liệu.\n\nVới String hoặc Vec, tính cả tiền tố độ dài và giới hạn nội dung. Thuộc tính max_len dùng cho tính dung lượng không tự thay thế validation của giá trị người dùng. Khi thay cấu trúc đã phát hành, account cũ vẫn giữ byte cũ: cần version và migration được kiểm thử. Roundtrip serialization chỉ là một lớp kiểm chứng, chưa xác nhận quyền của instruction."
        },
        {
          "title": "Tính kết quả trước khi ghi",
          "text": "consume nhận expected_revision và units. Từ chối zero, revision cũ, thiếu hạn mức hoặc revision tràn số. Tính remaining mới bằng checked_sub và revision mới bằng checked_add vào biến tạm; chỉ gán cả hai sau khi mọi phép tính thành công. Cách viết này giúp hàm thuần giữ bất biến ngay cả ngoài môi trường transaction.\n\nRuntime hoàn tác thay đổi trạng thái khi transaction thất bại, nhưng đó không phải lý do bỏ kiểm tra. Test host phải chứng minh helper không để state dở dang; test SVM phải chứng minh ràng buộc account và rollback thực tế. Hai lớp này bổ sung nhau. Trong phỏng vấn, hãy chỉ ra lỗi cụ thể mà mỗi test bắt được thay vì chỉ nêu phần trăm coverage."
        }
      ],
      "tip": "Dùng hàm nghiệp vụ nhỏ để kiểm tra trạng thái thất bại không đổi; để Anchor và SVM kiểm tra ranh giới account thực.",
      "exercise": {
        "title": "Tiêu thụ hạn mức theo revision",
        "instructions": "Hoàn thiện consume cho mô hình quota đã qua bước xác thực. Các lỗi không được thay đổi quota; lời gọi thành công trừ units và tăng revision đúng một lần.",
        "requirements": [
          "Kiểm tra revision trước, sau đó units phải lớn hơn 0.",
          "Trả lỗi khi thiếu đơn vị hoặc revision không tăng được bằng checked_add.",
          "Chỉ gán các trường sau khi có cả hai giá trị mới; thử lại revision cũ phải bị từ chối."
        ]
      },
      "starterCode": "#[derive(Debug, Clone, PartialEq, Eq)]\nstruct Quota { remaining: u64, revision: u64 }\n#[derive(Debug, PartialEq, Eq)]\nenum Failure { Stale, Zero, Insufficient, Overflow }\nfn consume(q: &mut Quota, expected: u64, units: u64) -> Result<(), Failure> {\n    todo!()\n}\nfn main() {\n    let mut q = Quota { remaining: 10, revision: 0 };\n    assert_eq!(consume(&mut q, 0, 3), Ok(()));\n    assert_eq!(q, Quota { remaining: 7, revision: 1 });\n    let saved = q.clone();\n    assert_eq!(consume(&mut q, 0, 3), Err(Failure::Stale));\n    assert_eq!(consume(&mut q, 1, 0), Err(Failure::Zero));\n    assert_eq!(consume(&mut q, 1, 8), Err(Failure::Insufficient));\n    assert_eq!(q, saved);\n    let mut edge = Quota { remaining: 10, revision: u64::MAX };\n    let old = edge.clone();\n    assert_eq!(consume(&mut edge, u64::MAX, 1), Err(Failure::Overflow));\n    assert_eq!(edge, old);\n    println!(\"Còn 7 đơn vị, revision 1\");\n}",
      "solutionCode": "#[derive(Debug, Clone, PartialEq, Eq)]\nstruct Quota { remaining: u64, revision: u64 }\n#[derive(Debug, PartialEq, Eq)]\nenum Failure { Stale, Zero, Insufficient, Overflow }\nfn consume(q: &mut Quota, expected: u64, units: u64) -> Result<(), Failure> {\n    if q.revision != expected { return Err(Failure::Stale); }\n    if units == 0 { return Err(Failure::Zero); }\n    let next_remaining = q.remaining.checked_sub(units).ok_or(Failure::Insufficient)?;\n    let next_revision = q.revision.checked_add(1).ok_or(Failure::Overflow)?;\n    q.remaining = next_remaining;\n    q.revision = next_revision;\n    Ok(())\n}\nfn main() {\n    let mut q = Quota { remaining: 10, revision: 0 };\n    assert_eq!(consume(&mut q, 0, 3), Ok(()));\n    assert_eq!(q, Quota { remaining: 7, revision: 1 });\n    let saved = q.clone();\n    assert_eq!(consume(&mut q, 0, 3), Err(Failure::Stale));\n    assert_eq!(consume(&mut q, 1, 0), Err(Failure::Zero));\n    assert_eq!(consume(&mut q, 1, 8), Err(Failure::Insufficient));\n    assert_eq!(q, saved);\n    let mut edge = Quota { remaining: 10, revision: u64::MAX };\n    let old = edge.clone();\n    assert_eq!(consume(&mut edge, u64::MAX, 1), Err(Failure::Overflow));\n    assert_eq!(edge, old);\n    println!(\"Còn 7 đơn vị, revision 1\");\n}",
      "expectedOutput": "Còn 7 đơn vị, revision 1",
      "hints": [
        "Nếu trừ remaining trước khi checked_add revision, lỗi overflow có thể để helper ở trạng thái dở dang.",
        "Dùng biến next_remaining và next_revision rồi mới gán."
      ],
      "quiz": {
        "question": "Account<Quota> và has_one = authority đã có. Tại sao authority vẫn phải là Signer?",
        "options": [
          "has_one chỉ kiểm tra quan hệ khóa; chưa chứng minh chủ thể có quyền ký trong lời gọi.",
          "Signer giúp tự động cấp thêm bộ nhớ cho quota.",
          "Signer thay đổi owner của quota thành authority.",
          "Vì mọi account trong Anchor đều phải ký."
        ],
        "correct": 0,
        "explanation": "has_one xác minh khóa được truyền khớp trường đã lưu. Signer kiểm tra quyền ký; thiếu điều kiện này, người khác có thể truyền đúng khóa công khai của authority."
      },
      "reference": {
        "label": "Anchor: account constraints",
        "url": "https://www.anchor-lang.com/docs/references/account-constraints"
      },
      "localLab": {
        "title": "Anchor quota: chương trình, layout và host tests",
        "instructions": "Tạo dự án từ các tệp sau rồi chạy cargo test. Lab biên dịch chương trình Anchor 1.2.2 và kiểm tra logic, serialization, instruction data cùng account metas trên host. Program ID là fixture cố định; lab không gửi transaction, không tạo ví và chưa thực thi binary SBF.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"quota_program\"\nversion = \"0.1.0\"\nedition = \"2021\"\npublish = false\n\n[lib]\ncrate-type = [\"cdylib\", \"lib\"]\nname = \"quota_program\"\n\n[features]\ndefault = []\ncpi = [\"no-entrypoint\"]\nno-entrypoint = []\nno-idl = []\nno-log-ix-name = []\nidl-build = [\"anchor-lang/idl-build\"]\nanchor-debug = []\ncustom-heap = []\ncustom-panic = []\n\n[dependencies]\nanchor-lang = \"=1.2.2\"\n\n[lints.rust]\nunexpected_cfgs = { level = \"warn\", check-cfg = ['cfg(target_os, values(\"solana\"))'] }\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use anchor_lang::prelude::*;\nuse anchor_lang::{Discriminator, Space};\n\n// Fixture cho host tests; không phải địa chỉ chương trình đã deploy.\ndeclare_id!(\"US517G5965aydkZ46HS38QLi7UQiSojurfbQfKCELFx\");\n\n#[program]\npub mod quota_program {\n    use super::*;\n\n    pub fn initialize(ctx: Context<Initialize>, remaining: u64) -> Result<()> {\n        require!(remaining > 0, QuotaError::Zero);\n        ctx.accounts.quota.set_inner(Quota {\n            authority: ctx.accounts.authority.key(),\n            remaining,\n            revision: 0,\n            bump: ctx.bumps.quota,\n        });\n        Ok(())\n    }\n\n    pub fn consume(ctx: Context<Consume>, expected_revision: u64, units: u64) -> Result<()> {\n        consume_budget(&mut ctx.accounts.quota, expected_revision, units)\n    }\n}\n\n#[derive(Accounts)]\npub struct Initialize<'info> {\n    #[account(\n        init,\n        payer = authority,\n        space = Quota::DISCRIMINATOR.len() + Quota::INIT_SPACE,\n        seeds = [b\"quota\", authority.key().as_ref()],\n        bump,\n    )]\n    pub quota: Account<'info, Quota>,\n    #[account(mut)]\n    pub authority: Signer<'info>,\n    pub system_program: Program<'info, System>,\n}\n\n#[derive(Accounts)]\npub struct Consume<'info> {\n    #[account(\n        mut,\n        has_one = authority,\n        seeds = [b\"quota\", authority.key().as_ref()],\n        bump = quota.bump,\n    )]\n    pub quota: Account<'info, Quota>,\n    pub authority: Signer<'info>,\n}\n\n#[account]\n#[derive(InitSpace, Debug, PartialEq, Eq)]\npub struct Quota {\n    pub authority: Pubkey,\n    pub remaining: u64,\n    pub revision: u64,\n    pub bump: u8,\n}\n\n/// Helper giả định account đã qua validation; nó không xác minh signer.\npub fn consume_budget(quota: &mut Quota, expected_revision: u64, units: u64) -> Result<()> {\n    require!(quota.revision == expected_revision, QuotaError::Stale);\n    require!(units > 0, QuotaError::Zero);\n    let next_remaining = quota.remaining.checked_sub(units)\n        .ok_or_else(|| error!(QuotaError::Insufficient))?;\n    let next_revision = quota.revision.checked_add(1)\n        .ok_or_else(|| error!(QuotaError::Overflow))?;\n    quota.remaining = next_remaining;\n    quota.revision = next_revision;\n    Ok(())\n}\n\n#[error_code]\npub enum QuotaError {\n    #[msg(\"Revision da thay doi\")]\n    Stale,\n    #[msg(\"So don vi phai lon hon 0\")]\n    Zero,\n    #[msg(\"Khong du han muc\")]\n    Insufficient,\n    #[msg(\"Revision vuot gioi han\")]\n    Overflow,\n}\n"
          },
          {
            "path": "tests/host.rs",
            "content": "use anchor_lang::prelude::Pubkey;\nuse anchor_lang::{\n    AccountDeserialize, AccountSerialize, Discriminator, InstructionData, Owner,\n    Space, ToAccountMetas,\n};\nuse quota_program::{consume_budget, Quota, ID};\n\nfn quota() -> Quota {\n    Quota {\n        authority: Pubkey::new_from_array([9; 32]),\n        remaining: 10,\n        revision: 0,\n        bump: 254,\n    }\n}\n\n#[test]\nfn consumes_once_and_rejects_stale_revision() {\n    let mut q = quota();\n    consume_budget(&mut q, 0, 3).unwrap();\n    assert_eq!((q.remaining, q.revision), (7, 1));\n    let before = q.clone();\n    assert!(consume_budget(&mut q, 0, 3).is_err());\n    assert_eq!(q, before);\n}\n\n#[test]\nfn zero_and_overdraw_keep_state() {\n    let mut q = quota();\n    let before = q.clone();\n    assert!(consume_budget(&mut q, 0, 0).is_err());\n    assert_eq!(q, before);\n    assert!(consume_budget(&mut q, 0, 11).is_err());\n    assert_eq!(q, before);\n}\n\n#[test]\nfn revision_overflow_does_not_partially_deduct() {\n    let mut q = quota();\n    q.revision = u64::MAX;\n    let before = q.clone();\n    assert!(consume_budget(&mut q, u64::MAX, 1).is_err());\n    assert_eq!(q, before);\n}\n\n#[test]\nfn account_roundtrip_and_space_match() {\n    let q = quota();\n    let mut bytes = Vec::new();\n    q.try_serialize(&mut bytes).unwrap();\n    assert_eq!(Quota::INIT_SPACE, 49);\n    assert_eq!(bytes.len(), Quota::DISCRIMINATOR.len() + Quota::INIT_SPACE);\n    assert_eq!(&bytes[..Quota::DISCRIMINATOR.len()], Quota::DISCRIMINATOR);\n    let restored = Quota::try_deserialize(&mut bytes.as_slice()).unwrap();\n    assert_eq!(restored, q);\n    assert_eq!(Quota::owner(), ID);\n}\n\n#[test]\nfn decoder_rejects_wrong_discriminator_and_truncation() {\n    let mut bytes = Vec::new();\n    quota().try_serialize(&mut bytes).unwrap();\n    let mut wrong = bytes.clone();\n    wrong[0] ^= 0xff;\n    assert!(Quota::try_deserialize(&mut wrong.as_slice()).is_err());\n    assert!(Quota::try_deserialize(&mut bytes[..bytes.len() - 1].as_ref()).is_err());\n}\n\n#[test]\nfn generated_metas_request_only_needed_privileges() {\n    let quota_key = Pubkey::new_from_array([3; 32]);\n    let authority = Pubkey::new_from_array([9; 32]);\n    let metas = quota_program::accounts::Consume {\n        quota: quota_key,\n        authority,\n    }.to_account_metas(None);\n    assert_eq!(metas.len(), 2);\n    assert_eq!(metas[0].pubkey, quota_key);\n    assert!(metas[0].is_writable);\n    assert!(!metas[0].is_signer);\n    assert_eq!(metas[1].pubkey, authority);\n    assert!(metas[1].is_signer);\n    assert!(!metas[1].is_writable);\n}\n\n#[test]\nfn generated_instruction_encodes_u64_without_float_rounding() {\n    let instruction = quota_program::instruction::Consume {\n        expected_revision: u64::MAX - 1,\n        units: 7,\n    };\n    let bytes = instruction.data();\n    let offset = quota_program::instruction::Consume::DISCRIMINATOR.len();\n    assert_eq!(bytes.len(), offset + 16);\n    assert_eq!(&bytes[offset..offset + 8], &(u64::MAX - 1).to_le_bytes());\n    assert_eq!(&bytes[offset + 8..], &7_u64.to_le_bytes());\n}\n"
          },
          {
            "path": "README.md",
            "content": "# Anchor quota host lab\n\n## Chạy\n\n```sh\ncargo test --all-targets\n```\n\nAnchor được ghim ở 1.2.2. Giữ Cargo.lock sau lần giải quyết dependency đầu tiên.\nKhông cần ví, RPC, Solana CLI hoặc số dư để chạy các host test này.\n\n## Bằng chứng có được\n\n- Helper không trừ hạn mức dở dang khi revision tràn.\n- Lời gọi lặp với revision cũ bị từ chối.\n- Serialization, discriminator và INIT_SPACE khớp layout.\n- Mã sinh instruction giữ nguyên u64 và yêu cầu đúng account metas.\n- #[program] và #[derive(Accounts)] được biên dịch bằng Anchor thật.\n\n## Chưa được host test chứng minh\n\nCác test chưa gọi entrypoint trong SVM. Chúng không xác nhận runtime thực thi\nhas_one, seeds, signer, init, CPI hay rollback của transaction. Bước capstone\nphải nạp binary SBF vào LiteSVM/local validator và thêm các test âm cho những\nđiều kiện đó.\n\nProgram ID trong source là fixture cố định. Khi tạo workspace để triển khai,\nđồng bộ program ID, IDL, cấu hình cluster và keypair của môi trường đó theo\nquy trình Anchor; không coi fixture là một chương trình đã có trên mạng.\n\nNguồn:\n- https://www.anchor-lang.com/docs/basics/program-structure\n- https://www.anchor-lang.com/docs/references/account-constraints\n- https://www.anchor-lang.com/docs/testing/litesvm\n- https://www.anchor-lang.com/docs/updates/release-notes/1-2-2\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo test --test host -- --nocapture"
        ],
        "checks": [
          "Bảy host integration test chạy qua; Anchor cũng sinh test kiểm tra program ID.",
          "Payload Quota dài 49 byte ngoài discriminator; roundtrip giữ đủ authority, remaining, revision và bump.",
          "Stale revision, zero, thiếu hạn mức và overflow không đổi state trong helper.",
          "Instruction data giữ chính xác số u64 lớn; account metas chỉ yêu cầu quyền ghi cho quota và quyền ký cho authority.",
          "Bổ sung SBF/SVM test trong capstone trước khi đánh giá quyền runtime hoặc phát hành."
        ]
      }
    },
    {
      "id": "blockchain-cpi",
      "moduleId": "track-blockchain",
      "title": "CPI: truyền đúng account và giới hạn quyền",
      "duration": 55,
      "description": "Thiết kế lời gọi giữa các chương trình mà không trao nhầm quyền signer, writable hoặc program đích.",
      "objectives": [
        "Phân biệt invoke và invoke_signed",
        "Giải thích quyền account được truyền qua CPI",
        "Xác minh program ID và quan hệ giữa account",
        "Nhận diện dữ liệu cần reload sau CPI"
      ],
      "sections": [
        {
          "title": "Một instruction gọi instruction khác",
          "text": "CPI cho phép chương trình hiện tại gọi một instruction của chương trình khác trong cùng quá trình thực thi. Ví dụ initialize của Anchor gọi System Program để tạo account. Chương trình đích dùng compute budget trong phạm vi giao dịch; việc tách thành CPI không làm chi phí tính toán biến mất.\n\nThiết kế CPI bắt đầu từ hợp đồng: program đích nào, account theo thứ tự nào, account nào ký hoặc ghi và bytes instruction có ý nghĩa gì. Khi có client CPI được tạo từ IDL tương thích, ưu tiên dùng nó để giảm lỗi đóng gói. Dù vậy, bạn vẫn phải kiểm tra các quan hệ nghiệp vụ trước khi trao quyền."
        },
        {
          "title": "Quyền không tự tăng khi gọi xuống",
          "text": "Callee không thể tự lấy writable hoặc signer mà caller không có. Ngoại lệ được runtime kiểm chứng là caller có thể bổ sung quyền ký cho PDA được dẫn xuất bằng chính program ID của nó qua invoke_signed. Seed phải khớp, account vẫn phải được cung cấp, và quyền ký PDA không tự tạo quyền ghi.\n\nMột lỗi thường gặp là nhận program ID tùy ý từ client rồi gọi nó với những account nhạy cảm. Xác minh program đích bằng kiểu Program<T> hoặc điều kiện address/owner phù hợp với thiết kế. Cờ executable chỉ cho biết account là chương trình, không chứng minh đó là chương trình bạn định gọi. Khóa authority và owner của token account cũng cần được phân biệt."
        },
        {
          "title": "Dữ liệu trước và sau lời gọi",
          "text": "Khi một CPI sửa account, bản Rust đã deserialize trước đó có thể chưa phản ánh dữ liệu mới. Với Account<T> cần đọc lại thay đổi sau CPI, gọi reload theo API Anchor và kiểm tra kết quả. Đừng dùng số dư hoặc trạng thái đã cache trước lời gọi để ra quyết định sau khi chương trình khác đã cập nhật dữ liệu.\n\nTránh giữ borrow RefCell qua CPI nếu runtime cần mượn lại account đó. Thu hẹp phạm vi borrow và chuẩn bị input trước lời gọi. Nếu hai vai trò nghiệp vụ bắt buộc khác nhau, kiểm tra địa chỉ khác nhau một cách rõ ràng; không dựa vào tên field. Quy tắc duplicate account còn phụ thuộc kiểu wrapper và phiên bản framework.",
          "code": "// Sau một CPI đã sửa dữ liệu account:\nctx.accounts.shared_state.reload()?;\nlet new_revision = ctx.accounts.shared_state.revision;"
        },
        {
          "title": "Kiểm tra quyền bằng mô hình nhỏ",
          "text": "Bài tập biểu diễn account bằng số và hai cờ quyền. Hàm chỉ cho yêu cầu quyền con nằm trong quyền đã cấp; danh sách PDA signer là kết quả đã được lớp dẫn xuất tin cậy xác minh, không phải payload client. Mô hình này giúp nhìn ra writable escalation nhưng không thay thế runtime, chữ ký hoặc kiểm tra seed thực.\n\nTrong dự án, thêm test SVM cho program đích sai, account thiếu, signer thiếu, CPI trả lỗi và cập nhật trạng thái sau CPI. Quan sát cả lỗi và account trước/sau giao dịch. Một test helper thành công không cho biết binary SBF truyền đúng account hay có đủ compute budget. Viết tên test thể hiện ranh giới nó thực sự kiểm tra."
        }
      ],
      "tip": "Trước mỗi CPI, liệt kê quyền được chuyển đi và dữ liệu nào cần đọc lại khi lời gọi trở về.",
      "exercise": {
        "title": "Kiểm tra tập quyền con",
        "instructions": "Hoàn thiện allow_cpi cho mô hình quyền đơn giản. Program đích phải khớp allowlist; mỗi account được yêu cầu phải có trong outer. Signer được chấp nhận nếu outer đã ký hoặc account thuộc trusted_pda_signers.",
        "requirements": [
          "Từ chối program đích sai trước khi xét account.",
          "Không cho yêu cầu writable nếu outer chỉ đọc.",
          "Không cho signer tùy ý; PDA signer không tự nâng writable.",
          "Không thay đổi các danh sách đầu vào."
        ]
      },
      "starterCode": "#[derive(Clone, Copy)]\nstruct Access { key: u8, writable: bool, signer: bool }\n#[derive(Debug, PartialEq, Eq)]\nenum CpiError { Program, Missing, Writable, Signer }\nfn allow_cpi(target: u8, allowed: u8, requested: &[Access], outer: &[Access], trusted_pda_signers: &[u8]) -> Result<(), CpiError> {\n    todo!()\n}\nfn main() {\n    let outer = [Access { key: 1, writable: true, signer: false }, Access { key: 2, writable: false, signer: true }];\n    let pda = Access { key: 1, writable: true, signer: true };\n    assert_eq!(allow_cpi(7, 7, &[pda], &outer, &[1]), Ok(()));\n    assert_eq!(allow_cpi(8, 7, &[], &outer, &[]), Err(CpiError::Program));\n    assert_eq!(allow_cpi(7, 7, &[pda], &outer, &[]), Err(CpiError::Signer));\n    let readonly = Access { key: 2, writable: true, signer: true };\n    assert_eq!(allow_cpi(7, 7, &[readonly], &outer, &[2]), Err(CpiError::Writable));\n    let missing = Access { key: 3, writable: false, signer: false };\n    assert_eq!(allow_cpi(7, 7, &[missing], &outer, &[3]), Err(CpiError::Missing));\n    assert_eq!(allow_cpi(7, 7, &[Access { key: 2, writable: false, signer: true }], &outer, &[]), Ok(()));\n    println!(\"CPI: quyền được giới hạn\");\n}",
      "solutionCode": "#[derive(Clone, Copy)]\nstruct Access { key: u8, writable: bool, signer: bool }\n#[derive(Debug, PartialEq, Eq)]\nenum CpiError { Program, Missing, Writable, Signer }\nfn allow_cpi(target: u8, allowed: u8, requested: &[Access], outer: &[Access], trusted_pda_signers: &[u8]) -> Result<(), CpiError> {\n    if target != allowed { return Err(CpiError::Program); }\n    for want in requested {\n        let have = outer.iter().find(|a| a.key == want.key).ok_or(CpiError::Missing)?;\n        if want.writable && !have.writable { return Err(CpiError::Writable); }\n        if want.signer && !have.signer && !trusted_pda_signers.contains(&want.key) {\n            return Err(CpiError::Signer);\n        }\n    }\n    Ok(())\n}\nfn main() {\n    let outer = [Access { key: 1, writable: true, signer: false }, Access { key: 2, writable: false, signer: true }];\n    let pda = Access { key: 1, writable: true, signer: true };\n    assert_eq!(allow_cpi(7, 7, &[pda], &outer, &[1]), Ok(()));\n    assert_eq!(allow_cpi(8, 7, &[], &outer, &[]), Err(CpiError::Program));\n    assert_eq!(allow_cpi(7, 7, &[pda], &outer, &[]), Err(CpiError::Signer));\n    let readonly = Access { key: 2, writable: true, signer: true };\n    assert_eq!(allow_cpi(7, 7, &[readonly], &outer, &[2]), Err(CpiError::Writable));\n    let missing = Access { key: 3, writable: false, signer: false };\n    assert_eq!(allow_cpi(7, 7, &[missing], &outer, &[3]), Err(CpiError::Missing));\n    assert_eq!(allow_cpi(7, 7, &[Access { key: 2, writable: false, signer: true }], &outer, &[]), Ok(()));\n    println!(\"CPI: quyền được giới hạn\");\n}",
      "expectedOutput": "CPI: quyền được giới hạn",
      "hints": [
        "Tìm account theo key trước khi đọc các cờ.",
        "Kiểm tra writable độc lập với trường hợp PDA được ký.",
        "Mô hình giả định outer đã được chuẩn hóa thành một mục cho mỗi key."
      ],
      "quiz": {
        "question": "invoke_signed xác minh thành công PDA signer. Điều nào vẫn cần đúng nếu CPI muốn sửa account?",
        "options": [
          "Không cần kiểm tra thêm vì PDA có toàn quyền.",
          "Account phải có quyền writable và đáp ứng các kiểm tra của program đích.",
          "Owner sẽ tự đổi thành caller.",
          "Chỉ cần thêm bump vào dữ liệu instruction."
        ],
        "correct": 1,
        "explanation": "Quyền signer PDA không cấp quyền writable hoặc bỏ qua validation của callee. Runtime vẫn kiểm tra quyền account được truyền vào lời gọi."
      },
      "reference": {
        "label": "Solana: CPI execution và privileges",
        "url": "https://solana.com/docs/core/cpi"
      }
    },
    {
      "id": "blockchain-transactions",
      "moduleId": "track-blockchain",
      "title": "Client, xác nhận giao dịch và xử lý yêu cầu lặp",
      "duration": 55,
      "description": "Thiết kế client biết phân biệt gửi, xác nhận, thất bại và kết quả chưa rõ khi RPC mất phản hồi.",
      "objectives": [
        "Dùng IDL và kiểu số phù hợp khi tạo instruction",
        "Phân biệt signature, simulation và confirmation",
        "Theo dõi lastValidBlockHeight thay vì timeout tùy ý",
        "Kết hợp request ID, receipt và revision để xử lý thử lại"
      ],
      "sections": [
        {
          "title": "Client cũng phải giữ hợp đồng",
          "text": "Client cần đúng program ID, account metas, serialization của instruction và phiên bản IDL. Một interface đẹp không sửa được bytes sai trên đường truyền. Ghi rõ mạng đích và chương trình đang được gọi; giữ cấu hình môi trường tách biệt để người phát triển không nhầm local với môi trường đã phát hành.\n\nu64 có thể vượt giới hạn số nguyên chính xác của JavaScript Number. Dùng kiểu số lớn mà phiên bản SDK yêu cầu, chuyển đổi qua chuỗi thập phân khi cần hiển thị hoặc lưu JSON. Đừng đi qua parseFloat rồi chuyển lại số nguyên. Test vector giữa Rust và client phải chứa cả số nhỏ, biên lớn và dữ liệu Unicode."
        },
        {
          "title": "Có signature chưa phải đã thành công",
          "text": "Gửi transaction đến RPC chỉ bắt đầu một quy trình. Simulation kiểm tra tình huống trên trạng thái mô phỏng; trạng thái thật có thể đổi trước khi giao dịch được xử lý. Signature dùng để truy vấn tiến độ, không phải bằng chứng thao tác nghiệp vụ đã hoàn tất. Client cần phân biệt đang gửi, đang chờ, đã xác nhận và thất bại.\n\nKhi lấy blockhash, lưu lastValidBlockHeight đi kèm và dùng cùng chính sách commitment trong quy trình xác nhận. Block height không phải slot và cũng không phải số giây cố định. Với luồng dùng recent blockhash, quá hạn mới là một điều kiện để xem xét dựng transaction khác; durable nonce là cơ chế khác, không áp dụng cùng máy móc."
        },
        {
          "title": "Thử lại ở cấp nghiệp vụ",
          "text": "Nếu RPC mất phản hồi, giao dịch trước có thể đã được đưa vào chain. Tạo transaction mới với blockhash mới sẽ tạo một danh tính transaction khác; điều đó không tự ngăn trừ hạn mức lần nữa. Dùng request ID ổn định và receipt hoặc revision được chương trình kiểm tra để phát hiện cùng thao tác nghiệp vụ.\n\nRevision ngăn cập nhật từ trạng thái cũ nhưng chưa tự cho client biết yêu cầu nào đã thành công. Receipt gắn request ID với kết quả giúp đối chiếu chính xác hơn. Thiết kế phạm vi duy nhất theo authority và giới hạn cách lưu lịch sử. Khi retry, giữ cùng request ID; không tạo ID mới chỉ vì người dùng nhấn nút thêm lần nữa."
        },
        {
          "title": "Phục hồi theo bằng chứng quan sát",
          "text": "Bài tập xây quyết định từ trạng thái signature, kết quả đối chiếu nghiệp vụ và block height. Nếu có bằng chứng thao tác đã áp dụng thì kết thúc; lỗi transaction đã xác nhận thì báo lỗi. Khi signature chưa rõ và blockhash còn hạn, tiếp tục chờ. Sau khi hết hạn, nếu chưa biết trạng thái nghiệp vụ thì phải đối chiếu trước khi dựng lại.\n\nKết quả NotApplied cần đến từ truy vấn có chính sách commitment phù hợp, không chỉ bộ nhớ cache của giao diện. Dù đã quyết định dựng lại, instruction vẫn phải giữ idempotency key hoặc điều kiện revision. Kiểm thử tình huống phản hồi bị mất, xác nhận đến chậm và người dùng tải lại trang; thành công của client được đo bằng trạng thái đúng, không bằng số lần gửi RPC."
        }
      ],
      "tip": "Lưu request ID trước khi gửi và giữ nó qua retry; signature và request ID giải quyết hai loại danh tính khác nhau.",
      "exercise": {
        "title": "Chọn bước tiếp theo khi chưa rõ kết quả",
        "instructions": "Viết decide cho luồng recent blockhash. Effect::Applied là bằng chứng đã đối chiếu theo request ID. Khi phải Rebuild, client vẫn dùng cùng request ID và điều kiện chống lặp của program.",
        "requirements": [
          "Applied luôn trả Done vì mục tiêu nghiệp vụ đã đạt.",
          "ConfirmedOk trả Done; ConfirmedError trả Failed khi chưa có Applied.",
          "Unseen còn trong hạn trả Wait, kể cả current_height bằng last_valid_height.",
          "Unseen đã quá hạn trả Rebuild nếu NotApplied, ngược lại Reconcile."
        ]
      },
      "starterCode": "#[derive(Clone, Copy)]\nenum SignatureState { Unseen, ConfirmedOk, ConfirmedError }\n#[derive(Clone, Copy)]\nenum Effect { Applied, NotApplied, Unknown }\n#[derive(Debug, PartialEq, Eq)]\nenum Next { Done, Failed, Wait, Reconcile, Rebuild }\nfn decide(signature: SignatureState, effect: Effect, current_height: u64, last_valid_height: u64) -> Next {\n    todo!()\n}\nfn main() {\n    use SignatureState::*;\n    assert_eq!(decide(Unseen, Effect::Unknown, 100, 100), Next::Wait);\n    assert_eq!(decide(Unseen, Effect::Unknown, 101, 100), Next::Reconcile);\n    assert_eq!(decide(Unseen, Effect::NotApplied, 101, 100), Next::Rebuild);\n    assert_eq!(decide(Unseen, Effect::Applied, 101, 100), Next::Done);\n    assert_eq!(decide(ConfirmedOk, Effect::Unknown, 90, 100), Next::Done);\n    assert_eq!(decide(ConfirmedError, Effect::Unknown, 90, 100), Next::Failed);\n    assert_eq!(decide(ConfirmedError, Effect::Applied, 90, 100), Next::Done);\n    assert_eq!(decide(Unseen, Effect::NotApplied, u64::MAX, u64::MAX), Next::Wait);\n    println!(\"Retry: đối chiếu trạng thái trước khi dựng lại\");\n}",
      "solutionCode": "#[derive(Clone, Copy)]\nenum SignatureState { Unseen, ConfirmedOk, ConfirmedError }\n#[derive(Clone, Copy)]\nenum Effect { Applied, NotApplied, Unknown }\n#[derive(Debug, PartialEq, Eq)]\nenum Next { Done, Failed, Wait, Reconcile, Rebuild }\nfn decide(signature: SignatureState, effect: Effect, current_height: u64, last_valid_height: u64) -> Next {\n    if matches!(effect, Effect::Applied) { return Next::Done; }\n    match signature {\n        SignatureState::ConfirmedOk => Next::Done,\n        SignatureState::ConfirmedError => Next::Failed,\n        SignatureState::Unseen if current_height <= last_valid_height => Next::Wait,\n        SignatureState::Unseen => match effect {\n            Effect::NotApplied => Next::Rebuild,\n            _ => Next::Reconcile,\n        },\n    }\n}\nfn main() {\n    use SignatureState::*;\n    assert_eq!(decide(Unseen, Effect::Unknown, 100, 100), Next::Wait);\n    assert_eq!(decide(Unseen, Effect::Unknown, 101, 100), Next::Reconcile);\n    assert_eq!(decide(Unseen, Effect::NotApplied, 101, 100), Next::Rebuild);\n    assert_eq!(decide(Unseen, Effect::Applied, 101, 100), Next::Done);\n    assert_eq!(decide(ConfirmedOk, Effect::Unknown, 90, 100), Next::Done);\n    assert_eq!(decide(ConfirmedError, Effect::Unknown, 90, 100), Next::Failed);\n    assert_eq!(decide(ConfirmedError, Effect::Applied, 90, 100), Next::Done);\n    assert_eq!(decide(Unseen, Effect::NotApplied, u64::MAX, u64::MAX), Next::Wait);\n    println!(\"Retry: đối chiếu trạng thái trước khi dựng lại\");\n}",
      "expectedOutput": "Retry: đối chiếu trạng thái trước khi dựng lại",
      "hints": [
        "Xử lý bằng chứng Applied trước match trạng thái signature.",
        "So sánh current_height > last_valid_height; không cộng thêm vào u64 để kiểm tra hạn.",
        "Đây là quyết định client, không phải cơ chế chống lặp của program."
      ],
      "quiz": {
        "question": "RPC timeout, client đổi blockhash và gửi lại consume. Điều gì bảo vệ khỏi trừ hạn mức hai lần?",
        "options": [
          "Blockhash mới luôn loại bỏ giao dịch cũ.",
          "Chờ đúng 30 giây rồi gửi lại.",
          "Program kiểm tra request ID/receipt hoặc điều kiện revision; client đối chiếu trạng thái trước retry.",
          "Xóa signature cũ khỏi local storage."
        ],
        "correct": 2,
        "explanation": "Blockhash bảo vệ vòng đời transaction, không định nghĩa tính duy nhất của thao tác nghiệp vụ. Quy tắc chống lặp phải được thực thi trong trạng thái của chương trình."
      },
      "reference": {
        "label": "Solana: confirmation và expiration",
        "url": "https://solana.com/developers/cookbook/transactions/confirmation"
      }
    },
    {
      "id": "blockchain-testing-release",
      "moduleId": "track-blockchain",
      "title": "Kiểm thử SVM, migration và phát hành có thể kiểm chứng",
      "duration": 65,
      "description": "Lập ma trận kiểm thử, quản lý schema cũ và tạo bằng chứng để người khác đánh giá một bản phát hành.",
      "objectives": [
        "Phân chia test thuần, host, SVM và RPC theo rủi ro",
        "Thiết kế ca kiểm tra âm cho account và CPI",
        "Viết migration lặp an toàn, giữ dữ liệu khi lỗi",
        "Ghim toolchain và kiểm chứng binary, IDL, quyền nâng cấp"
      ],
      "sections": [
        {
          "title": "Bốn lớp bằng chứng khác nhau",
          "text": "Hàm thuần kiểm tra số học và chuyển trạng thái nhanh, dễ tạo ca biên. Host test dùng thư viện thật để kiểm tra serialization, PDA và mã sinh từ macro. Test trong LiteSVM hoặc local validator thực thi chương trình để kiểm tra account, CPI và tính nguyên tử của transaction. Kiểm tra RPC/client lại quan sát xác nhận và phục hồi mạng.\n\nĐừng gọi cargo test host là đã thử nghiệm onchain. Lab của lộ trình cung cấp hai lớp đầu; capstone yêu cầu bổ sung chạy binary SBF. Với LiteSVM, nạp artifact được build đúng toolchain và lưu phiên bản môi trường cùng kết quả. Một phép đo compute units chỉ có nghĩa khi biết dữ liệu đầu vào và cấu hình VM."
        },
        {
          "title": "Test âm theo từng ranh giới quyền",
          "text": "Viết ma trận cho owner sai, authority sai, thiếu signer, account chỉ đọc, PDA sai, discriminator sai và dữ liệu bị cắt ngắn. Thêm cùng account ở hai vai trò vốn phải khác nhau, CPI sang program không được phép, replay request và số nguyên sát biên. Với mỗi lỗi, lưu snapshot trạng thái trước/sau để chứng minh không có thay đổi nghiệp vụ ngoài ý muốn.\n\nCác test không cần cố tình gây tải lên mạng công khai. Dùng account và dữ liệu tổng hợp trong môi trường local; tạo lỗi có kiểm soát để tìm đúng ranh giới bị vi phạm. Khi sửa một bug, giữ fixture tối thiểu làm regression test. Chỉ tăng số lượng test nếu thêm một bất biến hoặc tình huống chưa được chứng minh."
        },
        {
          "title": "Code mới không tự đổi byte cũ",
          "text": "Nâng cấp chương trình không biến account v1 thành layout v2. Thiết kế discriminator và version rõ ràng, kiểm tra độ dài trước khi decode, chuyển trường với quy tắc xác định rồi mới lưu. Migration cần có chính sách quyền gọi, dung lượng mới, lamports cần bổ sung và xử lý khi gặp account đã được chuyển.\n\nBài tập dùng payload nhỏ: v1 có version và used, v2 thêm limit. Đây là định dạng minh họa riêng, không phải serialization tự động của Anchor. V1 vượt limit phải bị từ chối; v2 hợp lệ giữ nguyên để chạy migration lặp không thay dữ liệu. Với account thật, kiểm tra cả owner, authority và discriminator trước khi đưa payload vào logic chuyển đổi."
        },
        {
          "title": "Một release phải tái tạo và đối chiếu được",
          "text": "Lưu Cargo.lock, phiên bản Anchor, Solana CLI, platform-tools và lệnh build. Khi tạo artifact phát hành, dùng quy trình verifiable build rồi đối chiếu binary và IDL với chương trình đích. Ghi program ID, cluster và quyền nâng cấp trong hồ sơ riêng để reviewer không phải đoán môi trường từ mã nguồn.\n\nUpgrade authority quyết định ai có thể thay code; việc vô hiệu hóa quyền đó ảnh hưởng khả năng sửa lỗi về sau. Cần quy trình đánh giá cụ thể trước thao tác không thể đảo ngược, không đưa thành một lệnh mặc định trong hướng dẫn bắt đầu. Sản phẩm cuối của lộ trình là repository có thể review: hợp đồng, test, số đo và quyết định vận hành đều liên kết được với cùng một release."
        }
      ],
      "tip": "Trong README, ghi rõ test nào đã chạy trên host, test nào chạy SBF và phần nào còn cần kiểm tra với RPC thật.",
      "exercise": {
        "title": "Chuyển payload v1 sang v2",
        "instructions": "Viết migrate cho định dạng riêng của bài: v1=[1, used:u64 LE] dài 9 byte; v2=[2, used:u64 LE, limit:u64 LE] dài 17 byte. Với v2, giữ limit đã lưu và chỉ xác minh used không vượt limit.",
        "requirements": [
          "Từ chối version không biết hoặc độ dài không đúng, không đọc vượt slice.",
          "V1 chỉ chuyển khi used <= requested_limit; xuất đúng 17 byte.",
          "V2 hợp lệ giữ nguyên dù requested_limit khác; v2 sai bất biến phải bị từ chối.",
          "Không sửa input, không dùng unsafe hoặc cast con trỏ."
        ]
      },
      "starterCode": "\nfn migrate(input: &[u8], requested_limit: u64) -> Result<Vec<u8>, &'static str> {\n    todo!()\n}\nfn main() {\n    let mut v1 = vec![1];\n    v1.extend_from_slice(&7_u64.to_le_bytes());\n    let v2 = migrate(&v1, 10).unwrap();\n    assert_eq!(v2.len(), 17);\n    assert_eq!(v2[0], 2);\n    assert_eq!(&v2[1..9], &7_u64.to_le_bytes());\n    assert_eq!(&v2[9..17], &10_u64.to_le_bytes());\n    assert_eq!(migrate(&v2, 1), Ok(v2.clone()));\n    assert_eq!(migrate(&v1, 6), Err(\"limit\"));\n    assert_eq!(migrate(&[], 10), Err(\"length\"));\n    assert_eq!(migrate(&v1[..8], 10), Err(\"length\"));\n    assert_eq!(migrate(&[3], 10), Err(\"version\"));\n    let mut invalid_v2 = v2.clone();\n    invalid_v2[9..17].copy_from_slice(&6_u64.to_le_bytes());\n    assert_eq!(migrate(&invalid_v2, 100), Err(\"limit\"));\n    assert_eq!(v1.len(), 9);\n    println!(\"Migration: v1 → v2, chạy lại giữ nguyên\");\n}",
      "solutionCode": "\nfn migrate(input: &[u8], requested_limit: u64) -> Result<Vec<u8>, &'static str> {\n    let version = *input.first().ok_or(\"length\")?;\n    let expected = match version { 1 => 9, 2 => 17, _ => return Err(\"version\") };\n    if input.len() != expected { return Err(\"length\"); }\n    let used = u64::from_le_bytes(input[1..9].try_into().map_err(|_| \"length\")?);\n    let limit = if version == 1 { requested_limit } else {\n        u64::from_le_bytes(input[9..17].try_into().map_err(|_| \"length\")?)\n    };\n    if used > limit { return Err(\"limit\"); }\n    if version == 2 { return Ok(input.to_vec()); }\n    let mut output = Vec::with_capacity(17);\n    output.push(2);\n    output.extend_from_slice(&used.to_le_bytes());\n    output.extend_from_slice(&limit.to_le_bytes());\n    Ok(output)\n}\nfn main() {\n    let mut v1 = vec![1];\n    v1.extend_from_slice(&7_u64.to_le_bytes());\n    let v2 = migrate(&v1, 10).unwrap();\n    assert_eq!(v2.len(), 17);\n    assert_eq!(v2[0], 2);\n    assert_eq!(&v2[1..9], &7_u64.to_le_bytes());\n    assert_eq!(&v2[9..17], &10_u64.to_le_bytes());\n    assert_eq!(migrate(&v2, 1), Ok(v2.clone()));\n    assert_eq!(migrate(&v1, 6), Err(\"limit\"));\n    assert_eq!(migrate(&[], 10), Err(\"length\"));\n    assert_eq!(migrate(&v1[..8], 10), Err(\"length\"));\n    assert_eq!(migrate(&[3], 10), Err(\"version\"));\n    let mut invalid_v2 = v2.clone();\n    invalid_v2[9..17].copy_from_slice(&6_u64.to_le_bytes());\n    assert_eq!(migrate(&invalid_v2, 100), Err(\"limit\"));\n    assert_eq!(v1.len(), 9);\n    println!(\"Migration: v1 → v2, chạy lại giữ nguyên\");\n}",
      "expectedOutput": "Migration: v1 → v2, chạy lại giữ nguyên",
      "hints": [
        "Kiểm tra version và độ dài toàn bộ trước khi cắt các vùng 1..9 và 9..17.",
        "Đọc integer bằng from_le_bytes, không dùng size_of hoặc layout của struct Rust.",
        "V2 dùng limit đã lưu; requested_limit chỉ dùng khi chuyển v1."
      ],
      "quiz": {
        "question": "Bộ host test serialization và helper đều qua. Điều nào còn cần test SVM?",
        "options": [
          "Chỉ cần kiểm tra tên biến Rust.",
          "Không còn gì vì cargo test đã chứng minh runtime blockchain.",
          "Quyền account, CPI, rollback transaction và compute của binary SBF.",
          "Chỉ kiểm tra file README."
        ],
        "correct": 2,
        "explanation": "Host tests không thực thi đầy đủ cơ chế SVM. Ràng buộc runtime và tương tác giữa instructions phải được kiểm tra với binary và môi trường thực thi tương ứng."
      },
      "reference": {
        "label": "Anchor: LiteSVM",
        "url": "https://www.anchor-lang.com/docs/testing/litesvm"
      }
    }
  ]
};
