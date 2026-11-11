import type { TrackExpansion } from "../../specialization-types";

export const blockchainExpansion: TrackExpansion = {
  "chapters": [
    {
      "id": "blockchain-chapter-trust",
      "title": "Account và ranh giới tin cậy",
      "lessonIds": [
        "blockchain-accounts",
        "blockchain-trust-boundaries",
        "blockchain-serialization"
      ],
      "description": "Phân biệt metadata, quyền và schema của dữ liệu.",
      "outcomes": [
        "Kiểm tra owner, signer và authority riêng.",
        "Mã hóa u64 không mất chính xác.",
        "Phân biệt host với runtime enforcement."
      ]
    },
    {
      "id": "blockchain-chapter-identity",
      "title": "PDA và phân quyền",
      "lessonIds": [
        "blockchain-pda",
        "blockchain-authority",
        "blockchain-registry-project"
      ],
      "description": "Thiết kế namespace và cập nhật có revision.",
      "outcomes": [
        "Derive PDA bằng SDK.",
        "Kiểm tra canonical bump và owner.",
        "Thiết kế chuyển authority không phá identity."
      ]
    },
    {
      "id": "blockchain-chapter-program",
      "title": "Chương trình Anchor và state machine",
      "lessonIds": [
        "blockchain-anchor-state",
        "blockchain-state-machines",
        "blockchain-anchor-project"
      ],
      "description": "Biến luật nghiệp vụ thành handler và account constraints.",
      "outcomes": [
        "Viết bảng transition và vai trò.",
        "Kiểm thử lỗi không mutate helper.",
        "Kiểm tra layout và code sinh Anchor."
      ]
    },
    {
      "id": "blockchain-chapter-runtime",
      "title": "CPI và ngân sách thực thi",
      "lessonIds": [
        "blockchain-cpi",
        "blockchain-capabilities",
        "blockchain-compute-budget"
      ],
      "description": "Thu hẹp quyền và giới hạn công việc.",
      "outcomes": [
        "Allowlist program/account theo vai trò.",
        "Kiểm tra privilege và dữ liệu sau CPI.",
        "Đo ngân sách trong môi trường SVM."
      ]
    },
    {
      "id": "blockchain-chapter-application",
      "title": "Client, indexer và nâng cấp",
      "lessonIds": [
        "blockchain-transactions",
        "blockchain-indexing",
        "blockchain-upgrades"
      ],
      "description": "Theo dõi kết quả và tiến hóa schema có kiểm soát.",
      "outcomes": [
        "Dedup, conflict và reconcile.",
        "Tách tentative khỏi trạng thái công bố.",
        "Lập ma trận binary/schema/client."
      ]
    },
    {
      "id": "blockchain-chapter-readiness",
      "title": "Review, kiểm thử và bàn giao",
      "lessonIds": [
        "blockchain-testing-release",
        "blockchain-threat-model",
        "blockchain-release-project"
      ],
      "description": "Chuẩn bị gói phát hành với bằng chứng từng tầng.",
      "outcomes": [
        "Mỗi constraint có ca âm riêng.",
        "Liên kết source/IDL/binary và kết quả.",
        "Chạy SVM trước khi tự đánh giá runtime đạt."
      ]
    }
  ],
  "lessons": [
    {
      "id": "blockchain-trust-boundaries",
      "moduleId": "track-blockchain",
      "title": "Ranh giới tin cậy của chương trình",
      "description": "Kiểm tra account, quyền ký và dữ liệu theo vai trò của từng instruction.",
      "duration": 60,
      "objectives": [
        "Viết authorize(owner,expected_owner,authority,actor,signer,writable) chỉ thành công khi mọi điều kiện đúng.",
        "Thử riêng owner sai, actor sai, thiếu signer và thiếu writable.",
        "In authorization checked."
      ],
      "sections": [
        {
          "title": "Caller chọn account đưa vào instruction",
          "text": "Một chương trình không được mặc định account đầu tiên là bản ghi của người đang gọi chỉ vì client thông thường luôn gửi như vậy. Người gọi có thể tự tạo instruction với danh sách account và bytes khác. Xác định cho từng account: địa chỉ mong đợi, owner, writable, signer, loại dữ liệu và quan hệ với các account khác. Những điều kiện này tạo ranh giới tin cậy trước khi handler thực hiện nghiệp vụ. Client validation giúp trải nghiệm nhưng không thay thế kiểm tra trong chương trình."
        },
        {
          "title": "Owner và authority là hai khái niệm khác",
          "text": "Owner của account là program có quyền thay đổi dữ liệu theo quy tắc runtime. Authority thường là một trường pubkey trong dữ liệu nghiệp vụ, biểu diễn người hoặc vai trò được phép yêu cầu hành động. Một account có owner đúng nhưng authority sai vẫn không được chấp nhận. Ngược lại, một người ký hợp lệ không có quyền sửa mọi account của chương trình. Kiểm tra cả quan hệ authority với signer và danh tính account bằng địa chỉ hoặc PDA theo hợp đồng."
        },
        {
          "title": "Chữ ký không tự chứng minh mục đích",
          "text": "Signer cho biết một account có quyền ký trong ngữ cảnh thực thi, nhưng handler vẫn phải kiểm tra hành động người đó được phép làm. Reviewer ký không được tự nhận là author nếu hai vai trò khác nhau. Với PDA, quyền ký trong CPI được runtime xác nhận từ seeds của program gọi, không phải chữ ký từ private key của PDA. Không đánh đồng cờ is_signer trong một struct mô phỏng host với việc runtime đã kiểm chứng chữ ký giao dịch thật."
        },
        {
          "title": "Kiểm tra dữ liệu trước khi dùng số",
          "text": "Bytes cần đủ độ dài, đúng discriminator và schema trước khi đọc trường. Số u64 không được chuyển qua số thực để so revision hoặc số lượng; giá trị lớn có thể mất chính xác ở client. Dùng checked_add và checked_sub cho phép tính có thể tràn. Xác định lỗi trước khi sửa trạng thái nếu viết helper host để test; trong môi trường thực, rollback transaction là một cơ chế khác cần kiểm chứng bằng runtime. Hai lớp kiểm tra bổ sung cho nhau, không thay thế nhau."
        },
        {
          "title": "Lập bảng tin cậy cho một thao tác",
          "text": "Bài thực hành mô hình hóa một bản ghi và actor bằng số nguyên, rồi kiểm tra program owner, authority, signer và writable trước khi tăng revision. Các số này chỉ là dữ liệu mô phỏng, không phải địa chỉ mạng. Mỗi ca âm thay đúng một điều kiện để biết kiểm tra nào bắt lỗi. Khi chuyển sang Anchor, ánh xạ từng hàng của bảng sang Account<T>, Signer, seeds, bump và ràng buộc quan hệ. Mã dự án tiếp theo sẽ dùng SDK thật cho PDA và macro Anchor thật cho account."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Ranh giới tin cậy của chương trình",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Viết authorize(owner,expected_owner,authority,actor,signer,writable) chỉ thành công khi mọi điều kiện đúng.",
          "Thử riêng owner sai, actor sai, thiếu signer và thiếu writable.",
          "In authorization checked."
        ]
      },
      "starterCode": "fn main() {\n    // Viết authorize(owner,expected_owner,authority,actor,signer,writable) chỉ thành công khi mọi điều kiện đúng.\n    // Thử riêng owner sai, actor sai, thiếu signer và thiếu writable.\n    // In authorization checked.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn authorize(owner:u64,program:u64,authority:u64,actor:u64,signer:bool,writable:bool)->Result<(),&'static str>{\n if owner!=program{return Err(\"owner\");}if authority!=actor{return Err(\"authority\");}\n if !signer{return Err(\"signer\");}if !writable{return Err(\"writable\");}Ok(())\n}\nfn main(){\n assert_eq!(authorize(7,7,9,9,true,true),Ok(()));\n assert_eq!(authorize(8,7,9,9,true,true),Err(\"owner\"));\n assert_eq!(authorize(7,7,9,10,true,true),Err(\"authority\"));\n assert!(authorize(7,7,9,9,false,true).is_err());assert!(authorize(7,7,9,9,true,false).is_err());\n println!(\"authorization checked\");\n}",
      "expectedOutput": "authorization checked",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Account owner đúng và actor đã ký. Có thể bỏ kiểm tra authority lưu trong account không?",
        "options": [
          "Có vì owner đúng là đủ.",
          "Có nếu client của mình tạo instruction.",
          "Không; chữ ký và quyền nghiệp vụ là hai điều kiện khác nhau."
        ],
        "correct": 2,
        "explanation": "Một signer hợp lệ không được phép tác động mọi bản ghi cùng owner; cần quan hệ authority."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://solana.com/docs/core/accounts/account-structure"
      }
    },
    {
      "id": "blockchain-serialization",
      "moduleId": "track-blockchain",
      "title": "Layout account và mã hóa instruction",
      "description": "Đọc ghi bytes theo schema, phiên bản và giới hạn xác định.",
      "duration": 60,
      "objectives": [
        "Encode version 1 và revision u64 little endian thành đúng 9 byte.",
        "Decode từ chối version khác hoặc độ dài không đúng; thử 256 và u64::MAX.",
        "In layout=9 bytes."
      ],
      "sections": [
        {
          "title": "Bytes không tự mang ý nghĩa kiểu",
          "text": "Dữ liệu account là một dãy byte; chương trình cần hợp đồng để biết trường nào bắt đầu ở đâu, kiểu gì và thứ tự byte ra sao. Struct Rust trong bộ nhớ có thể chứa padding và layout không phù hợp làm định dạng mạng. Dùng serializer đã định hoặc tự mã hóa từng trường với endianness rõ. Không lấy size_of của struct có String để suy ra dung lượng serialized string. Độ dài dữ liệu biến đổi phải gồm phần độ dài và giới hạn nội dung."
        },
        {
          "title": "Discriminator phân biệt loại account",
          "text": "Anchor gắn discriminator cho loại account và instruction theo cơ chế của phiên bản đang dùng. Trong lab khóa phiên bản, dùng hằng Discriminator do framework sinh để tính offset, không hardcode mọi nơi là một con số cố định. Discriminator đúng chỉ cho biết bytes mang tag mong đợi; vẫn cần owner, schema và điều kiện nghiệp vụ. Một attacker có thể tạo bytes giống tag trong account do program khác sở hữu. Đọc deserialize thuần trên host không tự thực hiện kiểm tra owner của runtime."
        },
        {
          "title": "Số nguyên lớn cần đi nguyên vẹn qua client",
          "text": "Revision và document ID dùng u64 nên mã hóa bằng tám byte little endian trong hợp đồng bài tập. JavaScript Number không biểu diễn chính xác mọi u64; client cần kiểu và thư viện giữ số nguyên lớn đúng, hoặc truyền chuỗi thập phân rồi parse có kiểm tra. Không dùng float cho ID. Test các giá trị quanh ranh giới byte như 255, 256 và gần u64::MAX để bắt lỗi endianness hoặc làm tròn. Những lỗi này thường không xuất hiện khi chỉ thử ID bằng một."
        },
        {
          "title": "Migration là thay đổi hợp đồng",
          "text": "Thêm trường vào account không tự tạo thêm vùng lưu trữ hay định nghĩa cách đọc dữ liệu cũ. Cần version, layout cũ, layout mới, điều kiện chuyển và chiến lược tương thích client. Khi có String hoặc Vec, chặn số phần tử trước khi cấp phát hoặc iterate. Không cho phép dữ liệu thừa không giải thích nếu định dạng yêu cầu độ dài chính xác. Trong dự án review, account dùng trường kích thước cố định để bài kiểm thử layout đơn giản, rồi người học thiết kế migration có fixture."
        },
        {
          "title": "Kiểm tra roundtrip và dữ liệu hỏng",
          "text": "Bài thực hành mã hóa version một byte cộng revision tám byte, yêu cầu tổng chín byte. Decode từ chối thiếu, thừa hoặc version lạ, rồi roundtrip giá trị lớn nhất. Một roundtrip cùng encoder/decoder có thể cùng sai nên thêm fixture byte tính tay cho 256. Trong localLab Anchor, kiểm tra thêm INIT_SPACE, discriminator, instruction data và account metas do framework sinh. Đó là bằng chứng host về layout; việc runtime kiểm tra account và rollback cần test SVM riêng."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Layout account và mã hóa instruction",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Encode version 1 và revision u64 little endian thành đúng 9 byte.",
          "Decode từ chối version khác hoặc độ dài không đúng; thử 256 và u64::MAX.",
          "In layout=9 bytes."
        ]
      },
      "starterCode": "fn main() {\n    // Encode version 1 và revision u64 little endian thành đúng 9 byte.\n    // Decode từ chối version khác hoặc độ dài không đúng; thử 256 và u64::MAX.\n    // In layout=9 bytes.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn encode(revision:u64)->Vec<u8>{let mut out=vec![1];out.extend(revision.to_le_bytes());out}\nfn decode(bytes:&[u8])->Result<u64,&'static str>{\n if bytes.len()!=9||bytes[0]!=1{return Err(\"layout\");}\n Ok(u64::from_le_bytes(bytes[1..].try_into().map_err(|_|\"length\")?))\n}\nfn main(){\n assert_eq!(encode(256),vec![1,0,1,0,0,0,0,0,0]);\n assert_eq!(decode(&encode(u64::MAX)),Ok(u64::MAX));\n assert!(decode(&[1,0]).is_err());let mut bad=encode(0);bad[0]=2;assert!(decode(&bad).is_err());\n println!(\"layout=9 bytes\");\n}",
      "expectedOutput": "layout=9 bytes",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Discriminator đúng có đủ để tin account do chương trình mình quản lý không?",
        "options": [
          "Có vì bytes không thể sao chép.",
          "Không; phải kiểm tra owner và các ràng buộc khác.",
          "Có nếu dữ liệu dài đúng."
        ],
        "correct": 1,
        "explanation": "Tag có thể được sao chép; owner và danh tính account là kiểm tra độc lập."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://www.anchor-lang.com/docs/basics/program-structure"
      }
    },
    {
      "id": "blockchain-authority",
      "moduleId": "track-blockchain",
      "title": "Phân quyền, seed và thay đổi vai trò",
      "description": "Thiết kế danh tính bền vững và chuyển quyền có kiểm soát.",
      "duration": 60,
      "objectives": [
        "Authority hiện tại 1 đề xuất 2; chỉ 2 được accept; mỗi bước tăng revision có kiểm tra.",
        "Actor sai hoặc không có pending không đổi state.",
        "In authority=2 revision=2."
      ],
      "sections": [
        {
          "title": "PDA cần seed có ngữ nghĩa rõ",
          "text": "Một registry có thể dùng prefix, authority và document ID để tạo địa chỉ. Prefix tách namespace giữa loại dữ liệu, pubkey có độ dài cố định, ID dùng bytes cố định theo endianness đã ghi. Ghép chuỗi tùy ý không có ranh giới có thể tạo cách diễn giải mơ hồ. Nếu seed là tên người dùng, cần chuẩn hóa Unicode, phân biệt hoa thường và giới hạn byte theo hợp đồng; không để client này trim còn client kia giữ nguyên. Bài này chọn ID số để tránh giấu quyết định chuẩn hóa."
        },
        {
          "title": "Canonical bump là một phần của validation",
          "text": "Derive PDA tạo địa chỉ và bump theo thuật toán SDK; việc tìm địa chỉ không tự tạo account. Khi đọc bản ghi, kiểm tra địa chỉ, program owner và bump mong đợi. Nếu dùng bump lưu trong account để tái tạo nhanh, cần biết nó đã được xác minh lúc khởi tạo. Dùng cùng seeds nhưng program ID khác sẽ tạo namespace khác. Không dùng giá trị bump do caller tùy chọn như bằng chứng quyền truy cập; nó chỉ là thành phần dẫn xuất địa chỉ."
        },
        {
          "title": "Authority thay đổi có thể đổi danh tính",
          "text": "Nếu authority nằm trong seeds, đổi trường authority mà vẫn giữ địa chỉ cũ có thể khiến các ràng buộc tương lai không còn khớp. Có hai thiết kế: danh tính gắn với người tạo bất biến, authority hoạt động là trường riêng; hoặc migration tạo account mới ở namespace mới. Ghi rõ trường nào bất biến trước khi thêm chức năng chuyển quyền. Không sửa seeds qua phiên bản mà bỏ kế hoạch cho các account đã tồn tại. Đây là quyết định dữ liệu lâu dài, không chỉ lựa chọn tiện viết code."
        },
        {
          "title": "Chuyển quyền nên có bước chấp nhận",
          "text": "Một mô hình hai bước đặt pending_authority do authority hiện tại đề xuất, sau đó người nhận ký để chấp nhận. Nó giúp phát hiện nhập sai địa chỉ và chứng minh người nhận kiểm soát vai trò mới theo hợp đồng. Cần revision để chống cập nhật dựa trên trạng thái cũ, thời hạn nếu nghiệp vụ yêu cầu và cách hủy đề xuất. Không mặc định pubkey khác zero là người nhận có thể sử dụng. Những chi tiết này được kiểm thử bằng state machine trước khi ghép account runtime."
        },
        {
          "title": "Kiểm thử quan hệ thay vì chỉ đường thành công",
          "text": "Bài thực hành mô hình hóa quyền hiện tại và pending bằng số ID, kiểm tra propose chỉ do người hiện tại thực hiện và accept chỉ do người được đề xuất. Thử actor sai, accept khi không có đề xuất và revision tràn; lỗi không thay state. Trong registry SDK thật, kiểm tra thay authority trong seed tạo địa chỉ khác để nhìn thấy hậu quả thiết kế. Cần phân biệt mô hình host kiểm tra logic với chữ ký và writable được runtime xác minh trong SVM."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Phân quyền, seed và thay đổi vai trò",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Authority hiện tại 1 đề xuất 2; chỉ 2 được accept; mỗi bước tăng revision có kiểm tra.",
          "Actor sai hoặc không có pending không đổi state.",
          "In authority=2 revision=2."
        ]
      },
      "starterCode": "fn main() {\n    // Authority hiện tại 1 đề xuất 2; chỉ 2 được accept; mỗi bước tăng revision có kiểm tra.\n    // Actor sai hoặc không có pending không đổi state.\n    // In authority=2 revision=2.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "#[derive(Clone,Debug,PartialEq,Eq)]struct Roles{current:u64,pending:Option<u64>,revision:u64}\nfn propose(s:&mut Roles,actor:u64,next:u64)->Result<(),&'static str>{\n if actor!=s.current||next==0||next==s.current{return Err(\"role\");}\n let revision=s.revision.checked_add(1).ok_or(\"overflow\")?;s.pending=Some(next);s.revision=revision;Ok(())\n}\nfn accept(s:&mut Roles,actor:u64)->Result<(),&'static str>{\n if s.pending!=Some(actor){return Err(\"pending\");}\n let revision=s.revision.checked_add(1).ok_or(\"overflow\")?;s.current=actor;s.pending=None;s.revision=revision;Ok(())\n}\nfn main(){\n let mut s=Roles{current:1,pending:None,revision:0};propose(&mut s,1,2).unwrap();\n let before=s.clone();assert!(accept(&mut s,3).is_err());assert_eq!(s,before);\n accept(&mut s,2).unwrap();assert_eq!((s.current,s.revision),(2,2));\n println!(\"authority=2 revision=2\");\n}",
      "expectedOutput": "authority=2 revision=2",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Authority là seed của PDA. Chỉ đổi trường authority trong account có đủ cho chuyển quyền không?",
        "options": [
          "Chưa; phải thiết kế danh tính bất biến hoặc migration vì seed/address có thể không còn khớp.",
          "Luôn đủ vì pubkey có cùng độ dài.",
          "Chỉ đổi tên trường là được."
        ],
        "correct": 0,
        "explanation": "Quan hệ giữa seed và địa chỉ không tự thay theo nội dung account."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://solana.com/docs/core/pda"
      }
    },
    {
      "id": "blockchain-registry-project",
      "moduleId": "track-blockchain",
      "title": "Dự án: registry có namespace bằng Solana SDK",
      "description": "Dẫn xuất PDA thật và kiểm tra metadata trước cập nhật revision.",
      "duration": 60,
      "objectives": [
        "Mô phỏng update digest chỉ khi actor=authority, expected=revision và writable=true.",
        "Tính revision mới trước khi commit digest; stale hoặc overflow giữ nguyên.",
        "In revision=1 digest=42."
      ],
      "sections": [
        {
          "title": "Registry lưu điều gì và không làm gì",
          "text": "Dự án quản lý metadata tài liệu theo authority và document ID. Mỗi bản ghi có PDA, owner, bump, revision và digest nội dung. SDK Solana thực hiện dẫn xuất địa chỉ thật trên host; chương trình mẫu không kết nối RPC, không tạo ví và không gửi transaction. Mục tiêu là xác định danh tính và quy tắc cập nhật có thể kiểm chứng. Các cờ signer/writable trong fixture là dữ liệu mô phỏng để thử logic, không phải bằng chứng chữ ký đã được runtime xác nhận."
        },
        {
          "title": "Định nghĩa seeds bằng bytes cố định",
          "text": "Dùng prefix registry-v1, authority 32 byte và document ID tám byte little endian. Hàm derive trả Result để xử lý trường hợp không tìm được bump thay vì panic. Document ID bằng không bị từ chối theo hợp đồng nghiệp vụ. Test cùng input cho cùng địa chỉ, địa chỉ off-curve và tái tạo được bằng create_program_address với bump. Đổi program, authority hoặc ID trong các test vector phải đổi địa chỉ. Những test này kiểm chứng SDK, không chứng minh account đã được tạo trên mạng."
        },
        {
          "title": "Cập nhật sau khi kiểm tra đầy đủ",
          "text": "Update nhận metadata account, actor và expected_revision. Kiểm tra owner bằng program, địa chỉ và bump bằng derive, authority lưu trong record bằng actor và quyền giả lập phù hợp. Chỉ sau đó tính revision mới bằng checked_add rồi thay digest. Digest toàn số không bị từ chối trong hợp đồng mẫu để bắt fixture thiếu dữ liệu, nhưng đây không phải chứng minh nội dung hợp pháp. Nếu bất kỳ kiểm tra nào lỗi, record giữ nguyên. Không ghi digest mới rồi mới phát hiện revision tràn."
        },
        {
          "title": "Tách idempotency khỏi optimistic concurrency",
          "text": "Expected revision giúp phát hiện request dựa trên state cũ. Gửi lại cùng update sau khi lần đầu đã thành công sẽ trả stale theo hợp đồng này, không tự được coi là thành công. Client cần đọc trạng thái hoặc request ID nghiệp vụ để xác định kết quả đã áp dụng. Không nhầm việc transaction không thấy phản hồi với việc nó chắc chắn thất bại. Dự án capstone sẽ thêm quy tắc theo dõi quan sát và kế hoạch client offline để học phần đó mà không gửi giao dịch thực."
        },
        {
          "title": "Bằng chứng bàn giao và bước tiếp theo",
          "text": "Nộp Cargo lockfile, test vector PDA, bảng kiểm tra account và các test âm thay từng điều kiện. Thêm bài kiểm tra ID lớn để không có đường số thực trong seed. Người học bổ sung đề xuất chuyển authority theo thiết kế danh tính đã chọn, rồi chứng minh không phá namespace. Các kiểm tra runtime như account owner, signer thật, quyền ghi và rollback phải được đưa vào bộ SVM ở mốc triển khai chương trình. Báo cáo phải ghi rõ phần nào là metadata do fixture cung cấp và phần nào do SDK tính."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Dự án: registry có namespace bằng Solana SDK",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Mô phỏng update digest chỉ khi actor=authority, expected=revision và writable=true.",
          "Tính revision mới trước khi commit digest; stale hoặc overflow giữ nguyên.",
          "In revision=1 digest=42."
        ]
      },
      "starterCode": "fn main() {\n    // Mô phỏng update digest chỉ khi actor=authority, expected=revision và writable=true.\n    // Tính revision mới trước khi commit digest; stale hoặc overflow giữ nguyên.\n    // In revision=1 digest=42.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "#[derive(Clone,Debug,PartialEq,Eq)]struct Record{authority:u64,revision:u64,digest:u64}\nfn update(r:&mut Record,actor:u64,expected:u64,writable:bool,digest:u64)->Result<(),&'static str>{\n if actor!=r.authority||!writable{return Err(\"access\");}\n if expected!=r.revision{return Err(\"stale\");}if digest==0{return Err(\"digest\");}\n let revision=r.revision.checked_add(1).ok_or(\"overflow\")?;r.digest=digest;r.revision=revision;Ok(())\n}\nfn main(){\n let mut r=Record{authority:9,revision:0,digest:1};update(&mut r,9,0,true,42).unwrap();\n let before=r.clone();assert!(update(&mut r,9,0,true,99).is_err());assert_eq!(r,before);\n println!(\"revision=1 digest=42\");\n}",
      "expectedOutput": "revision=1 digest=42",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "derive PDA thành công chứng minh điều gì?",
        "options": [
          "Account đã được tạo trên mạng.",
          "Actor có toàn quyền ghi.",
          "Địa chỉ xác định từ seeds/program; chưa chứng minh account tồn tại hay chữ ký hợp lệ."
        ],
        "correct": 2,
        "explanation": "Dẫn xuất địa chỉ và tạo/ủy quyền account là các bước khác nhau."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://solana.com/docs/core/pda/pda-accounts"
      },
      "localLab": {
        "title": "Registry PDA và revision trên host",
        "instructions": "Tạo registry-identity. solana-pubkey 4.4.0 thực hiện PDA derivation thật, còn owner/signer/writable là metadata fixture để kiểm tra logic. Không có RPC, account mạng hoặc giao dịch.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"registry-identity\"\nversion = \"0.1.0\"\nedition = \"2024\"\npublish = false\n\n[dependencies]\nsolana-pubkey = { version = \"=4.4.0\", features = [\"curve25519\", \"sha2\"] }\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use solana_pubkey::Pubkey;\n#[derive(Clone,Debug,PartialEq,Eq)]\npub struct Record{pub address:Pubkey,pub owner:Pubkey,pub authority:Pubkey,pub document_id:u64,pub bump:u8,pub revision:u64,pub digest:[u8;32]}\n#[derive(Clone,Copy,Debug,PartialEq,Eq)]\npub enum Error{Id,NoBump,Address,Owner,Bump,Authority,Signer,Writable,Stale,Digest,Overflow}\npub fn derive(program:&Pubkey,authority:&Pubkey,id:u64)->Result<(Pubkey,u8),Error>{\n if id==0{return Err(Error::Id);}\n Pubkey::try_find_program_address(&[b\"registry-v1\",authority.as_ref(),&id.to_le_bytes()],program).ok_or(Error::NoBump)\n}\npub fn fixture(program:Pubkey,authority:Pubkey,id:u64)->Result<Record,Error>{\n let(address,bump)=derive(&program,&authority,id)?;\n Ok(Record{address,owner:program,authority,document_id:id,bump,revision:0,digest:[1;32]})\n}\npub fn validate(record:&Record,program:&Pubkey)->Result<(),Error>{\n let(address,bump)=derive(program,&record.authority,record.document_id)?;\n if record.owner!=*program{return Err(Error::Owner);}\n if record.address!=address{return Err(Error::Address);}\n if record.bump!=bump{return Err(Error::Bump);}Ok(())\n}\n/// signer/writable are fixture metadata, not verified signatures.\npub fn update(record:&mut Record,program:&Pubkey,actor:&Pubkey,signer:bool,writable:bool,expected:u64,digest:[u8;32])->Result<(),Error>{\n validate(record,program)?;\n if actor!=&record.authority{return Err(Error::Authority);}\n if !signer{return Err(Error::Signer);}if !writable{return Err(Error::Writable);}\n if expected!=record.revision{return Err(Error::Stale);}if digest==[0;32]{return Err(Error::Digest);}\n let revision=record.revision.checked_add(1).ok_or(Error::Overflow)?;\n record.digest=digest;record.revision=revision;Ok(())\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use registry_identity::{fixture,update};use solana_pubkey::Pubkey;\nfn main(){let p=Pubkey::new_from_array([7;32]);let a=Pubkey::new_from_array([9;32]);let mut r=fixture(p,a,42).unwrap();update(&mut r,&p,&a,true,true,0,[2;32]).unwrap();println!(\"document={} revision={} bump={}\",r.document_id,r.revision,r.bump);assert_eq!(r.revision,1);}\n"
          },
          {
            "path": "tests/registry.rs",
            "content": "use registry_identity::{derive,fixture,update,validate,Error};\nuse solana_pubkey::Pubkey;\nfn keys()->(Pubkey,Pubkey){(Pubkey::new_from_array([7;32]),Pubkey::new_from_array([9;32]))}\n#[test]fn stable_and_reconstructed(){let(p,a)=keys();for id in [1,255,256,u64::MAX]{let(address,bump)=derive(&p,&a,id).unwrap();assert!(!address.is_on_curve());let recreated=Pubkey::create_program_address(&[b\"registry-v1\",a.as_ref(),&id.to_le_bytes(),&[bump]],&p).unwrap();assert_eq!(address,recreated);}}\n#[test]fn namespaces_and_id(){let(p,a)=keys();let x=derive(&p,&a,1).unwrap();assert_ne!(x.0,derive(&p,&a,2).unwrap().0);assert_ne!(x.0,derive(&p,&Pubkey::new_from_array([10;32]),1).unwrap().0);assert_ne!(x.0,derive(&Pubkey::new_from_array([8;32]),&a,1).unwrap().0);assert_eq!(derive(&p,&a,0),Err(Error::Id));}\n#[test]fn metadata_independent_checks(){let(p,a)=keys();let r=fixture(p,a,42).unwrap();let mut x=r.clone();x.owner=a;assert_eq!(validate(&x,&p),Err(Error::Owner));let mut x=r.clone();x.address=a;assert_eq!(validate(&x,&p),Err(Error::Address));let mut x=r;x.bump=x.bump.wrapping_add(1);assert_eq!(validate(&x,&p),Err(Error::Bump));}\n#[test]fn signer_writable_and_role(){let(p,a)=keys();let mut r=fixture(p,a,42).unwrap();let before=r.clone();assert_eq!(update(&mut r,&p,&a,false,true,0,[2;32]),Err(Error::Signer));assert_eq!(update(&mut r,&p,&a,true,false,0,[2;32]),Err(Error::Writable));assert_eq!(update(&mut r,&p,&p,true,true,0,[2;32]),Err(Error::Authority));assert_eq!(r,before);}\n#[test]fn stale_retry_preserves_record(){let(p,a)=keys();let mut r=fixture(p,a,42).unwrap();update(&mut r,&p,&a,true,true,0,[2;32]).unwrap();let before=r.clone();assert_eq!(update(&mut r,&p,&a,true,true,0,[3;32]),Err(Error::Stale));assert_eq!(r,before);}\n#[test]fn digest_and_overflow_atomic(){let(p,a)=keys();let mut r=fixture(p,a,42).unwrap();let before=r.clone();assert_eq!(update(&mut r,&p,&a,true,true,0,[0;32]),Err(Error::Digest));assert_eq!(r,before);r.revision=u64::MAX;let before=r.clone();assert_eq!(update(&mut r,&p,&a,true,true,u64::MAX,[2;32]),Err(Error::Overflow));assert_eq!(r,before);}\n"
          },
          {
            "path": "README.md",
            "content": "# Registry identity\n\nChạy cargo test và cargo run. Seeds: registry-v1, authority bytes, document ID u64 little endian. SDK tính PDA và canonical bump thật. Record là fixture trong bộ nhớ, không tạo account; signer/writable là metadata thử nghiệm, không phải chữ ký đã xác minh. Update kiểm tra danh tính, quyền mô phỏng, revision và digest trước commit. Thêm chuyển quyền hai bước với quyết định rõ về identity bất biến hoặc migration. Ghi ma trận từng ràng buộc và test âm; runtime signer/owner/writable/rollback cần harness SVM riêng.\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run"
        ],
        "checks": [
          "Sáu test chạy PDA thật, metadata, vai trò, stale và overflow.",
          "ID lớn giữ đúng tám byte seed; không có số thực.",
          "Không suy ra account tồn tại hoặc quyền runtime từ metadata fixture."
        ]
      }
    },
    {
      "id": "blockchain-state-machines",
      "moduleId": "track-blockchain",
      "title": "State machine và bất biến nghiệp vụ",
      "description": "Thiết kế chuyển trạng thái có vai trò, revision và tính nguyên tử.",
      "duration": 60,
      "objectives": [
        "Chỉ Author submit Draft và Reviewer approve Submitted; expected_revision phải khớp.",
        "Tính status/revision mới trước commit; thử actor sai và stale.",
        "In status=Approved revision=2."
      ],
      "sections": [
        {
          "title": "Mô hình hóa hành động trước khi viết handler",
          "text": "Một quy trình tài liệu có Draft, Submitted, Approved, Rejected và Cancelled. Author gửi duyệt hoặc hủy, reviewer duyệt hoặc từ chối; trạng thái cuối không được tự quay về Draft. Viết bảng trạng thái nguồn, action, actor, trạng thái đích và lỗi trước. Khi chỉ dùng cờ approved và submitted độc lập, có thể tạo tổ hợp approved nhưng chưa submitted. Enum hoặc mã trạng thái được validate giúp biểu diễn tập hợp lệ và buộc mọi transition phải có lý do."
        },
        {
          "title": "Bất biến bao gồm cả quan hệ vai trò",
          "text": "Author và reviewer không trùng theo quy tắc dự án. Document ID và author tạo danh tính không thay đổi sau init. Revision tăng đúng một cho mỗi transition thành công. Không chỉ kiểm tra trạng thái đầu: reviewer ký đúng nhưng proposal thuộc reviewer khác vẫn không được duyệt. Tách validation account ở ranh giới và validation state trong helper, rồi test cả hai lớp. Helper nhận actor enum đã được handler xác định không thể tự chứng minh chữ ký thật."
        },
        {
          "title": "Optimistic concurrency bảo vệ ý định trên state cũ",
          "text": "Client gửi expected_revision cùng hành động để tránh áp dụng quyết định dựa trên một trạng thái đã thay đổi. Nếu hai yêu cầu cùng đọc revision ba, chỉ một transition được chấp nhận trước khi revision tăng; yêu cầu còn lại cần đọc lại và đánh giá ý định. Không tự retry với revision mới mà không kiểm tra nội dung vì điều đó có thể biến một hành động có điều kiện thành áp dụng mù. Revision cũng cần checked_add để không quay về không khi vượt giới hạn."
        },
        {
          "title": "Tính trước rồi commit một lần",
          "text": "Trong helper Rust, xác định transition hợp lệ và revision mới trước khi ghi các trường. Nếu ghi status rồi mới cộng revision, lỗi tràn có thể để state host nửa mới nửa cũ. Runtime transaction có thể rollback khi instruction lỗi, nhưng unit test helper vẫn nên có hợp đồng nguyên tử riêng để dễ tái sử dụng và hiểu. Nếu nhiều account thay đổi, lập danh sách bất biến giữa chúng và test lỗi ở từng điểm. Đừng coi một hàm trả Result là tự bảo đảm rollback mọi mutation."
        },
        {
          "title": "Kiểm tra bảng chuyển bằng ca âm",
          "text": "Bài thực hành chấp nhận Draft sang Submitted do Author và Submitted sang Approved do Reviewer; các tổ hợp khác trả lỗi. Test approve trước submit, author tự approve, replay revision cũ và tràn revision, luôn so state trước sau. Khi thêm cancel hoặc reopen, cập nhật bảng và cân nhắc ảnh hưởng tới indexer, event và client. Một test đường thành công không đủ cho chương trình công khai nơi caller tự chọn mọi input. Bảng transition chính là tài liệu để reviewer kiểm tra mã mà không phải đoán ý định."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: State machine và bất biến nghiệp vụ",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Chỉ Author submit Draft và Reviewer approve Submitted; expected_revision phải khớp.",
          "Tính status/revision mới trước commit; thử actor sai và stale.",
          "In status=Approved revision=2."
        ]
      },
      "starterCode": "fn main() {\n    // Chỉ Author submit Draft và Reviewer approve Submitted; expected_revision phải khớp.\n    // Tính status/revision mới trước commit; thử actor sai và stale.\n    // In status=Approved revision=2.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "#[derive(Clone,Copy,Debug,PartialEq,Eq)]enum Status{Draft,Submitted,Approved}\n#[derive(Clone,Copy)]enum Actor{Author,Reviewer}\n#[derive(Clone,Copy)]enum Action{Submit,Approve}\n#[derive(Clone,Debug,PartialEq,Eq)]struct State{status:Status,revision:u64}\nfn apply(s:&mut State,actor:Actor,action:Action,expected:u64)->Result<(),&'static str>{\n if s.revision!=expected{return Err(\"stale\");}\n let next=match(s.status,actor,action){(Status::Draft,Actor::Author,Action::Submit)=>Status::Submitted,(Status::Submitted,Actor::Reviewer,Action::Approve)=>Status::Approved,_=>return Err(\"transition\")};\n let revision=s.revision.checked_add(1).ok_or(\"overflow\")?;s.status=next;s.revision=revision;Ok(())\n}\nfn main(){\n let mut s=State{status:Status::Draft,revision:0};let before=s.clone();\n assert!(apply(&mut s,Actor::Reviewer,Action::Approve,0).is_err());assert_eq!(s,before);\n apply(&mut s,Actor::Author,Action::Submit,0).unwrap();apply(&mut s,Actor::Reviewer,Action::Approve,1).unwrap();\n assert_eq!((s.status,s.revision),(Status::Approved,2));println!(\"status=Approved revision=2\");\n}",
      "expectedOutput": "status=Approved revision=2",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Hai reviewer request dựa trên cùng revision. Client có nên tự đổi expected_revision rồi gửi lại quyết định?",
        "options": [
          "Không tự động; phải đọc lại state và kiểm tra ý định còn đúng.",
          "Luôn nên để tránh lỗi stale.",
          "Bỏ revision khỏi chương trình."
        ],
        "correct": 0,
        "explanation": "Revision bảo vệ quyết định dựa trên state đã đọc; retry mù có thể áp dụng hành động vào bối cảnh khác."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://www.anchor-lang.com/docs/basics/program-structure"
      }
    },
    {
      "id": "blockchain-anchor-project",
      "moduleId": "track-blockchain",
      "title": "Dự án: quy trình duyệt tài liệu với Anchor",
      "description": "Xây chương trình thật với account constraint, state machine và host tests.",
      "duration": 60,
      "objectives": [
        "Tính kích thước payload Proposal: hai pubkey 32 byte, hai u64, status u8 và bump u8.",
        "Payload 82 byte; độ dài account = payload + discriminator được truyền vào.",
        "Dùng checked_add; in payload=82 total=90."
      ],
      "sections": [
        {
          "title": "Thiết kế account có kích thước cố định",
          "text": "Proposal lưu author, reviewer, document ID, revision, status và bump. Hai pubkey chiếm hai trường cố định; các số và mã trạng thái có kích thước xác định theo serializer. Dự án dùng InitSpace và độ dài Discriminator do Anchor 1.2.2 cung cấp để tính vùng dữ liệu. Không có nội dung tài liệu hoặc dữ liệu cá nhân trong account mẫu; document ID chỉ là định danh fixture. Cách này giúp tập trung quyền, layout và transition trước khi thiết kế dữ liệu biến đổi hoặc lưu nội dung bên ngoài."
        },
        {
          "title": "Initialize ràng buộc danh tính từ đầu",
          "text": "PDA dùng prefix proposal-v1, author và document ID. Initialize yêu cầu author ký, document ID khác không và reviewer khác author. Constraint init tạo account khi chạy trong runtime; host test chỉ biên dịch đường đó và kiểm tra helper dựng state, không tự thực hiện việc tạo account. Bump canonical từ context được lưu vào Proposal. Nếu thiếu kiểm tra vai trò lúc init, các handler sau có thể tin vào một quan hệ sai đã được ghi vĩnh viễn."
        },
        {
          "title": "Submit và review có Accounts riêng",
          "text": "Submit yêu cầu Proposal mut, quan hệ author, seeds và bump; author là Signer. Review dùng quan hệ reviewer và Signer tương ứng, vẫn kiểm tra PDA theo author bất biến lưu trong Proposal. Tách hai Accounts struct giúp quyền yêu cầu rõ và account metas sinh ra tối thiểu. Handler gọi helper transition đã kiểm thử, không tự lặp logic trong nhiều nơi. Caller không thể tự chọn enum vai trò truyền vào helper qua instruction; vai trò do handler gắn sau account validation."
        },
        {
          "title": "Host tests chứng minh điều gì",
          "text": "Mã Cargo biên dịch macro program, Accounts và account của Anchor thật. Test kiểm tra bảng chuyển, stale revision, overflow, INIT_SPACE, discriminator, roundtrip, instruction bytes và account metas. Những test này phát hiện sai layout hoặc quyền client yêu cầu, nhưng không chạy entrypoint SBF trong SVM. Vì vậy chúng chưa chứng minh runtime thực thi signer, owner, seeds, init hoặc rollback. Báo cáo tách rõ bằng chứng host với các ca runtime cần bổ sung ở capstone, không ghi nhãn đã audit chỉ vì test xanh."
        },
        {
          "title": "Mốc hoàn thiện chương trình",
          "text": "Baseline đã có cancel cho author từ Draft hoặc Submitted và test trạng thái kết thúc. Người học bổ sung event có version, định nghĩa payload cho từng transition và kiểm thử decoder cũ/mới với fixture độc lập. Sau đó dùng harness SVM ở capstone để build binary, thử account sai owner, signer thiếu, PDA sai, revision cũ và transaction có bước cuối lỗi. Kiểm tra account trước sau trong harness, không dùng phản hồi client làm bằng chứng duy nhất. Bài tập sử dụng môi trường cục bộ; mọi lệnh triển khai lên mạng thật nằm ngoài phạm vi lab."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Dự án: quy trình duyệt tài liệu với Anchor",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Tính kích thước payload Proposal: hai pubkey 32 byte, hai u64, status u8 và bump u8.",
          "Payload 82 byte; độ dài account = payload + discriminator được truyền vào.",
          "Dùng checked_add; in payload=82 total=90."
        ]
      },
      "starterCode": "fn main() {\n    // Tính kích thước payload Proposal: hai pubkey 32 byte, hai u64, status u8 và bump u8.\n    // Payload 82 byte; độ dài account = payload + discriminator được truyền vào.\n    // Dùng checked_add; in payload=82 total=90.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn account_size(discriminator:usize)->Option<usize>{\n let payload=32usize.checked_mul(2)?.checked_add(8*2)?.checked_add(2)?;\n discriminator.checked_add(payload)\n}\nfn main(){\n assert_eq!(account_size(8),Some(90));assert_eq!(account_size(0),Some(82));\n assert_eq!(account_size(usize::MAX),None);\n println!(\"payload=82 total=90\");\n}",
      "expectedOutput": "payload=82 total=90",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Test host của helper và serialization đều đạt. Điều nào vẫn chưa được chứng minh?",
        "options": [
          "Layout serializer trong test.",
          "Runtime xác minh signer/seeds/owner và rollback khi chạy SBF.",
          "Kết quả helper trên fixture đã chạy."
        ],
        "correct": 1,
        "explanation": "Host helper không đi qua entrypoint SVM; kiểm tra runtime cần harness thực thi chương trình."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://www.anchor-lang.com/docs/testing/mollusk"
      },
      "localLab": {
        "title": "Anchor review: chương trình và host tests",
        "instructions": "Tạo review-program với các tệp sau. Anchor 1.2.2 biên dịch chương trình thực; các test chạy helper, serializer và code sinh trên host. Không gửi transaction hoặc khởi chạy SVM trong lệnh cargo test.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"review_program\"\nversion = \"0.1.0\"\nedition = \"2021\"\npublish = false\n\n[lib]\ncrate-type = [\"cdylib\", \"lib\"]\nname = \"review_program\"\n\n[features]\ndefault = []\ncpi = [\"no-entrypoint\"]\nno-entrypoint = []\nno-idl = []\nno-log-ix-name = []\nidl-build = [\"anchor-lang/idl-build\"]\nanchor-debug = []\ncustom-heap = []\ncustom-panic = []\n\n[dependencies]\nanchor-lang = \"=1.2.2\"\n\n[lints.rust]\nunexpected_cfgs = { level = \"warn\", check-cfg = ['cfg(target_os, values(\"solana\"))'] }\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use anchor_lang::prelude::*;\nuse anchor_lang::{Discriminator,Space};\n// Fixed public address for offline fixtures only; no deployed program is assumed.\ndeclare_id!(\"swqrv48gsrwpBFbftEwnP2vB4jckpvfGJfXkwaniLCC\");\npub const DRAFT:u8=0;\npub const SUBMITTED:u8=1;\npub const APPROVED:u8=2;\npub const REJECTED:u8=3;\npub const CANCELLED:u8=4;\n#[program]\npub mod review_program{\n use super::*;\n pub fn initialize(ctx:Context<Initialize>,document_id:u64,reviewer:Pubkey)->Result<()>{\n  let proposal=new_proposal(ctx.accounts.author.key(),reviewer,document_id,ctx.bumps.proposal)?;\n  ctx.accounts.proposal.set_inner(proposal);Ok(())\n }\n pub fn submit(ctx:Context<Submit>,expected_revision:u64)->Result<()>{\n  transition(&mut ctx.accounts.proposal,Actor::Author,Action::Submit,expected_revision)\n }\n pub fn review(ctx:Context<Review>,expected_revision:u64,approve:bool)->Result<()>{\n  transition(&mut ctx.accounts.proposal,Actor::Reviewer,if approve{Action::Approve}else{Action::Reject},expected_revision)\n }\n pub fn cancel(ctx:Context<Submit>,expected_revision:u64)->Result<()>{\n  transition(&mut ctx.accounts.proposal,Actor::Author,Action::Cancel,expected_revision)\n }\n}\n#[derive(Accounts)]\n#[instruction(document_id:u64,reviewer:Pubkey)]\npub struct Initialize<'info>{\n #[account(init,payer=author,space=Proposal::DISCRIMINATOR.len()+Proposal::INIT_SPACE,seeds=[b\"proposal-v1\",author.key().as_ref(),&document_id.to_le_bytes()],bump)]\n pub proposal:Account<'info,Proposal>,\n #[account(mut)]pub author:Signer<'info>,\n pub system_program:Program<'info,System>,\n}\n#[derive(Accounts)]\npub struct Submit<'info>{\n #[account(mut,has_one=author,seeds=[b\"proposal-v1\",author.key().as_ref(),&proposal.document_id.to_le_bytes()],bump=proposal.bump)]\n pub proposal:Account<'info,Proposal>,\n pub author:Signer<'info>,\n}\n#[derive(Accounts)]\npub struct Review<'info>{\n #[account(mut,has_one=reviewer,seeds=[b\"proposal-v1\",proposal.author.as_ref(),&proposal.document_id.to_le_bytes()],bump=proposal.bump)]\n pub proposal:Account<'info,Proposal>,\n pub reviewer:Signer<'info>,\n}\n#[account]\n#[derive(InitSpace,Debug,PartialEq,Eq)]\npub struct Proposal{pub author:Pubkey,pub reviewer:Pubkey,pub document_id:u64,pub revision:u64,pub status:u8,pub bump:u8}\n#[derive(Clone,Copy,Debug)]pub enum Actor{Author,Reviewer}\n#[derive(Clone,Copy,Debug)]pub enum Action{Submit,Approve,Reject,Cancel}\npub fn new_proposal(author:Pubkey,reviewer:Pubkey,document_id:u64,bump:u8)->Result<Proposal>{\n require!(author!=reviewer&&document_id>0,ReviewError::Identity);\n Ok(Proposal{author,reviewer,document_id,revision:0,status:DRAFT,bump})\n}\n/// Assumes Accounts validation established the actor role; not a signature verifier.\npub fn transition(p:&mut Proposal,actor:Actor,action:Action,expected:u64)->Result<()>{\n require!(p.author!=p.reviewer&&p.document_id>0,ReviewError::Identity);\n require!(p.revision==expected,ReviewError::Stale);\n let next=match(p.status,actor,action){\n  (DRAFT,Actor::Author,Action::Submit)=>SUBMITTED,\n  (SUBMITTED,Actor::Reviewer,Action::Approve)=>APPROVED,\n  (SUBMITTED,Actor::Reviewer,Action::Reject)=>REJECTED,\n  (DRAFT|SUBMITTED,Actor::Author,Action::Cancel)=>CANCELLED,\n  _=>return err!(ReviewError::Transition),\n };\n let revision=p.revision.checked_add(1).ok_or_else(||error!(ReviewError::Overflow))?;\n p.status=next;p.revision=revision;Ok(())\n}\n#[error_code]\npub enum ReviewError{\n #[msg(\"Invalid document or role identity\")]Identity,\n #[msg(\"Expected revision is stale\")]Stale,\n #[msg(\"Transition is not permitted\")]Transition,\n #[msg(\"Revision overflow\")]Overflow,\n}\n"
          },
          {
            "path": "tests/host.rs",
            "content": "use anchor_lang::prelude::Pubkey;\nuse anchor_lang::{AccountDeserialize,AccountSerialize,Discriminator,InstructionData,Owner,Space,ToAccountMetas};\nuse review_program::{new_proposal,transition,Proposal,Actor,Action,DRAFT,SUBMITTED,APPROVED,REJECTED,CANCELLED,ID};\nfn fixture()->Proposal{new_proposal(Pubkey::new_from_array([9;32]),Pubkey::new_from_array([10;32]),42,254).unwrap()}\n#[test]fn valid_submit_approve(){let mut p=fixture();transition(&mut p,Actor::Author,Action::Submit,0).unwrap();transition(&mut p,Actor::Reviewer,Action::Approve,1).unwrap();assert_eq!((p.status,p.revision),(APPROVED,2));}\n#[test]fn role_and_order_rejected(){let mut p=fixture();let before=p.clone();assert!(transition(&mut p,Actor::Author,Action::Approve,0).is_err());assert_eq!(p,before);assert!(transition(&mut p,Actor::Reviewer,Action::Approve,0).is_err());assert_eq!(p,before);}\n#[test]fn cancel_and_reject_terminal(){let mut p=fixture();transition(&mut p,Actor::Author,Action::Cancel,0).unwrap();assert_eq!(p.status,CANCELLED);assert!(transition(&mut p,Actor::Author,Action::Submit,1).is_err());let mut p=fixture();transition(&mut p,Actor::Author,Action::Submit,0).unwrap();transition(&mut p,Actor::Reviewer,Action::Reject,1).unwrap();assert_eq!(p.status,REJECTED);}\n#[test]fn stale_and_overflow_atomic(){let mut p=fixture();transition(&mut p,Actor::Author,Action::Submit,0).unwrap();let before=p.clone();assert!(transition(&mut p,Actor::Reviewer,Action::Approve,0).is_err());assert_eq!(p,before);p.revision=u64::MAX;let before=p.clone();assert!(transition(&mut p,Actor::Reviewer,Action::Approve,u64::MAX).is_err());assert_eq!(p,before);}\n#[test]fn identity_rejected(){let a=Pubkey::new_from_array([9;32]);assert!(new_proposal(a,a,42,1).is_err());assert!(new_proposal(a,Pubkey::new_from_array([10;32]),0,1).is_err());}\n#[test]fn layout_roundtrip(){let p=fixture();let mut bytes=Vec::new();p.try_serialize(&mut bytes).unwrap();assert_eq!(Proposal::INIT_SPACE,82);assert_eq!(bytes.len(),Proposal::DISCRIMINATOR.len()+82);assert_eq!(Proposal::try_deserialize(&mut bytes.as_slice()).unwrap(),p);assert_eq!(Proposal::owner(),ID);}\n#[test]fn wrong_discriminator_truncated(){let mut bytes=Vec::new();fixture().try_serialize(&mut bytes).unwrap();let mut wrong=bytes.clone();wrong[0]^=255;assert!(Proposal::try_deserialize(&mut wrong.as_slice()).is_err());assert!(Proposal::try_deserialize(&mut &bytes[..bytes.len()-1]).is_err());}\n#[test]fn generated_account_privileges(){let p=Pubkey::new_from_array([3;32]);let a=Pubkey::new_from_array([9;32]);let metas=review_program::accounts::Submit{proposal:p,author:a}.to_account_metas(None);assert_eq!(metas.len(),2);assert!(metas[0].is_writable&&!metas[0].is_signer);assert!(metas[1].is_signer&&!metas[1].is_writable);assert_eq!(metas[0].pubkey,p);assert_eq!(metas[1].pubkey,a);}\n#[test]fn instruction_u64_and_bool(){let ix=review_program::instruction::Review{expected_revision:u64::MAX-1,approve:true};let bytes=ix.data();let n=review_program::instruction::Review::DISCRIMINATOR.len();assert_eq!(&bytes[n..n+8],&(u64::MAX-1).to_le_bytes());assert_eq!(bytes[n+8],1);assert_eq!(bytes.len(),n+9);assert_eq!(DRAFT,0);assert_eq!(SUBMITTED,1);}\n"
          },
          {
            "path": "README.md",
            "content": "# Anchor review\n\nChạy cargo test --all-targets. Proposal payload 82 byte ngoài discriminator: author, reviewer, document_id, revision, status, bump. PDA namespace proposal-v1, author và document ID little endian. Draft → Submitted do Author; Submitted → Approved/Rejected do Reviewer; Author có thể Cancel ở Draft/Submitted. Trạng thái cuối không mở lại. Revision tăng một; lỗi giữ helper state nguyên vẹn.\n\n#[program], #[derive(Accounts)], Account và Signer là Anchor thật. Host tests kiểm tra helper, bytes, layout và metas, không thực thi entrypoint SBF. Signer, owner, PDA, init, writable và rollback cần harness SVM riêng. Program ID là public fixture, không giả định đã deploy. Không có private key, ví, RPC hoặc chuyển tài sản trong lab. Thêm event versioned, SVM negative cases và tài liệu upgrade trước khi đánh giá runtime đã đạt.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets"
        ],
        "checks": [
          "Chín test host cùng test ID do Anchor sinh.",
          "Payload 82 byte và instruction u64 giữ nguyên giá trị lớn.",
          "SVM runtime constraints còn là tiêu chí bắt buộc của capstone."
        ]
      },
      "simulation": {
        "title": "Kiểm tra vai trò trước transition",
        "description": "Mô hình minh họa thứ tự account validation và cập nhật proposal. Nó không thay thế thực thi chữ ký trong SVM.",
        "kind": "sequence",
        "nodes": [
          {
            "id": "account",
            "label": "Account",
            "detail": "Owner, PDA và layout"
          },
          {
            "id": "role",
            "label": "Vai trò",
            "detail": "Reviewer đã được xác minh"
          },
          {
            "id": "rule",
            "label": "Transition",
            "detail": "Status và revision"
          },
          {
            "id": "commit",
            "label": "Commit",
            "detail": "State mới"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Review hợp lệ",
            "steps": [
              {
                "title": "Account đúng",
                "description": "Proposal đúng owner, PDA và tag.",
                "activeNodeIds": [
                  "account"
                ],
                "values": [
                  {
                    "label": "status",
                    "value": "Submitted"
                  },
                  {
                    "label": "revision",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Reviewer khớp",
                "description": "Signer tương ứng reviewer trong state.",
                "activeNodeIds": [
                  "role"
                ],
                "values": [
                  {
                    "label": "actor",
                    "value": "reviewer"
                  },
                  {
                    "label": "allowed",
                    "value": "true"
                  }
                ]
              },
              {
                "title": "Luật hợp lệ",
                "description": "Expected revision 1 và action Approve.",
                "activeNodeIds": [
                  "rule"
                ],
                "values": [
                  {
                    "label": "next",
                    "value": "Approved"
                  },
                  {
                    "label": "nextRevision",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "Commit",
                "description": "Chỉ ghi sau khi tính mọi điều kiện.",
                "activeNodeIds": [
                  "commit"
                ],
                "values": [
                  {
                    "label": "status",
                    "value": "Approved"
                  },
                  {
                    "label": "revision",
                    "value": "2"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "Actor sai",
            "steps": [
              {
                "title": "Account đúng",
                "description": "Bytes và PDA vẫn hợp lệ.",
                "activeNodeIds": [
                  "account"
                ],
                "values": [
                  {
                    "label": "status",
                    "value": "Submitted"
                  },
                  {
                    "label": "revision",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Vai trò sai",
                "description": "Actor ký không phải reviewer được chỉ định.",
                "activeNodeIds": [
                  "role"
                ],
                "values": [
                  {
                    "label": "allowed",
                    "value": "false"
                  }
                ]
              },
              {
                "title": "Dừng trước handler",
                "description": "Không áp dụng transition.",
                "activeNodeIds": [
                  "rule"
                ],
                "values": [
                  {
                    "label": "executed",
                    "value": "false"
                  }
                ]
              },
              {
                "title": "Giữ state",
                "description": "Không đổi status hoặc revision.",
                "activeNodeIds": [
                  "commit"
                ],
                "values": [
                  {
                    "label": "status",
                    "value": "Submitted"
                  },
                  {
                    "label": "revision",
                    "value": "1"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "blockchain-capabilities",
      "moduleId": "track-blockchain",
      "title": "CPI và quyền tối thiểu",
      "description": "Kiểm soát chương trình được gọi và account được chuyển quyền.",
      "duration": 60,
      "objectives": [
        "Kiểm tra quyền requested writable/signer không vượt available cho CPI không thêm PDA signer.",
        "Readonly caller không cấp writable; nonsigner không tự cấp signer.",
        "In privileges bounded."
      ],
      "sections": [
        {
          "title": "CPI mở thêm một ranh giới tin cậy",
          "text": "Khi program gọi program khác, nó giao một tập account và instruction data cho callee. Phải biết program ID được phép gọi, account role và dữ liệu đúng schema. Nếu caller cho người dùng tùy chọn program mà không kiểm tra, họ có thể chuyển luồng sang logic khác với ý định. Program executable và đúng address là điều kiện độc lập với owner của account dữ liệu. Trước khi thêm CPI, viết rõ tác dụng mong đợi và những gì callee có quyền thay đổi."
        },
        {
          "title": "Quyền truyền xuống không tự tăng lên",
          "text": "Account signer và writable được truyền theo ngữ cảnh runtime; callee không được tự nâng quyền vượt những gì caller có, ngoại trừ quyền PDA hợp lệ mà program gọi chứng minh bằng seeds trong cơ chế tương ứng. Khi tạo account metas, chỉ yêu cầu những quyền thực sự cần. Gắn writable cho mọi account làm phạm vi xung đột và tác động rộng hơn, đồng thời che việc handler nào sửa gì. Kiểm tra metas sinh từ Anchor bằng test để phát hiện vô tình đổi quyền client."
        },
        {
          "title": "PDA signer phải gắn với đúng hành động",
          "text": "invoke_signed cho runtime dẫn xuất PDA từ program ID và seeds, không tạo private key. Seeds cần khớp account mong đợi và không được lấy tùy tiện từ input chưa kiểm tra. Một PDA authority có thể được dùng cho nhiều tài nguyên, nên cần ràng buộc tài nguyên được tác động với state của instruction. Việc chứng minh quyền PDA không tự xác nhận mọi action nghiệp vụ đều hợp lệ. Hãy thu hẹp quyền của mỗi PDA theo namespace hoặc vai trò nếu thiết kế cần."
        },
        {
          "title": "Đọc lại dữ liệu sau tác động bên ngoài",
          "text": "CPI có thể thay đổi account mà caller tiếp tục dùng. Nếu caller giữ bản deserialize cũ hoặc giả định state không đổi, logic sau CPI có thể dựa trên dữ liệu lỗi thời. Tìm hiểu cơ chế reload của wrapper đang dùng và thiết kế thứ tự kiểm tra sau CPI. Không giữ borrow dữ liệu gây xung đột trong lúc gọi. Test tác dụng và lỗi của callee, không chỉ test nó trả Ok. Cùng ngân sách compute được chia cho toàn chuỗi nên cost của callee ảnh hưởng caller."
        },
        {
          "title": "Mô hình quyền để viết test âm",
          "text": "Bài thực hành kiểm tra tập quyền được yêu cầu là tập con quyền caller có trong mô hình đơn giản. Quyền signer mới do PDA không được mô phỏng như một boolean tự đặt; bài tập chỉ xét đường không thêm PDA signer. Thử callee yêu cầu writable khi caller chỉ đọc và xác nhận bị từ chối. Dự án capstone bổ sung allowlist program ID, account role khác nhau và fixture alias. SVM test phải chứng minh quyền runtime; kiểm tra mô hình host chỉ giúp diễn đạt ý định trước."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: CPI và quyền tối thiểu",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Kiểm tra quyền requested writable/signer không vượt available cho CPI không thêm PDA signer.",
          "Readonly caller không cấp writable; nonsigner không tự cấp signer.",
          "In privileges bounded."
        ]
      },
      "starterCode": "fn main() {\n    // Kiểm tra quyền requested writable/signer không vượt available cho CPI không thêm PDA signer.\n    // Readonly caller không cấp writable; nonsigner không tự cấp signer.\n    // In privileges bounded.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "#[derive(Clone,Copy)]struct Rights{write:bool,sign:bool}\nfn allowed(have:Rights,want:Rights)->bool{(!want.write||have.write)&&(!want.sign||have.sign)}\nfn main(){\n assert!(allowed(Rights{write:true,sign:true},Rights{write:false,sign:true}));\n assert!(!allowed(Rights{write:false,sign:true},Rights{write:true,sign:true}));\n assert!(!allowed(Rights{write:true,sign:false},Rights{write:true,sign:true}));\n println!(\"privileges bounded\");\n}",
      "expectedOutput": "privileges bounded",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Callee đòi writable cho account caller chỉ đọc. Có được tự nâng quyền không?",
        "options": [
          "Không; runtime giới hạn quyền theo ngữ cảnh.",
          "Có nếu callee phổ biến.",
          "Có nếu dùng cùng số account."
        ],
        "correct": 0,
        "explanation": "CPI không cho phép callee tùy ý tăng writable hoặc signer vượt quyền được cấp hợp lệ."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://solana.com/docs/core/cpi"
      }
    },
    {
      "id": "blockchain-compute-budget",
      "moduleId": "track-blockchain",
      "title": "Ngân sách tính toán và thiết kế account",
      "description": "Chặn công việc không giới hạn và giảm tranh chấp dữ liệu.",
      "duration": 60,
      "objectives": [
        "Tính trang [cursor,end) với total<=10000, limit 1..=128, cursor<=total.",
        "Không tràn cursor+limit; trang cuối nhỏ hơn limit.",
        "In page=990..1000."
      ],
      "sections": [
        {
          "title": "Mọi vòng lặp cần một chặn trên",
          "text": "Instruction chạy trong ngân sách hữu hạn. Một Vec do caller quyết định độ dài có thể làm instruction tiêu thụ quá nhiều compute hoặc thất bại trước khi hoàn tất. Đặt giới hạn số phần tử, độ dài bytes và số account trước xử lý. Nếu cần quét dataset lớn, chia thành các bước có cursor và revision snapshot, mỗi bước có kết quả rõ. Đừng giả định tăng ngân sách là giải pháp cho thuật toán không có giới hạn hoặc dữ liệu tăng vô hạn."
        },
        {
          "title": "Account layout ảnh hưởng chi phí và đồng thời",
          "text": "Một account toàn cục chứa mọi người dùng dễ tạo điểm tranh chấp quyền ghi. Tách account theo người dùng hoặc tài liệu có thể cho phép các giao dịch độc lập hơn, nhưng tăng số account và phức tạp khi cần bất biến chéo. Chọn ranh giới theo nghiệp vụ: state cùng cần cập nhật nguyên tử nên được thiết kế với đường transaction rõ. Không sharding chỉ vì nghe hiện đại; cần đo và giải thích cách kiểm tra tổng hoặc quan hệ sau khi tách."
        },
        {
          "title": "Dẫn xuất và deserialize cũng có chi phí",
          "text": "PDA search có thể thử nhiều bump; lưu bump đã được xác minh và dùng đúng ràng buộc có thể tránh tìm lại không cần thiết. Deserialize dữ liệu lớn, tạo Vec và CPI đều tiêu thụ tài nguyên. Zero-copy có thể phù hợp một số layout nhưng tăng yêu cầu về alignment, định dạng và kiểm tra, không phải tối ưu mặc định cho người mới. Bắt đầu từ account nhỏ, giới hạn rõ và số đo thực thi trong harness trước khi chọn kỹ thuật phức tạp."
        },
        {
          "title": "Đo trong môi trường tương ứng",
          "text": "Microbenchmark helper Rust trên CPU không đo compute unit của SVM. Nạp binary SBF vào harness, dùng feature set và budget đã ghi, chạy các trường hợp nhỏ, lớn nhất và lỗi. Báo cả kích thước account, số phần tử và chuỗi CPI để số đo có thể so sánh. Những giới hạn runtime có thể thay đổi theo phiên bản hoặc feature; không đóng cứng con số học được từ một bài cũ vào yêu cầu sản phẩm mà không xác minh môi trường đích."
        },
        {
          "title": "Bài tập phân trang giữ tính nguyên tử",
          "text": "Viết hàm chọn tối đa limit phần tử từ cursor, với tổng không vượt chặn trên và limit khác không. Tính end bằng phép cộng có kiểm tra hoặc lấy phần còn lại trước để tránh tràn. Cursor vượt total là lỗi; cursor bằng total là trang rỗng hoàn tất. Dự án registry mở rộng dùng revision snapshot để các trang không ghép dữ liệu từ nhiều phiên bản. Test giới hạn trên, trang cuối nhỏ và request không hợp lệ. Chính sách này bảo vệ cả trải nghiệm client và ngân sách instruction."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Ngân sách tính toán và thiết kế account",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Tính trang [cursor,end) với total<=10000, limit 1..=128, cursor<=total.",
          "Không tràn cursor+limit; trang cuối nhỏ hơn limit.",
          "In page=990..1000."
        ]
      },
      "starterCode": "fn main() {\n    // Tính trang [cursor,end) với total<=10000, limit 1..=128, cursor<=total.\n    // Không tràn cursor+limit; trang cuối nhỏ hơn limit.\n    // In page=990..1000.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn page(total:usize,cursor:usize,limit:usize)->Result<(usize,usize),&'static str>{\n if total>10_000||cursor>total||limit==0||limit>128{return Err(\"bounds\");}\n let take=(total-cursor).min(limit);Ok((cursor,cursor+take))\n}\nfn main(){\n assert_eq!(page(1000,990,128),Ok((990,1000)));\n assert_eq!(page(1000,1000,128),Ok((1000,1000)));\n assert!(page(1000,1001,2).is_err());assert!(page(1000,0,0).is_err());\n println!(\"page=990..1000\");\n}",
      "expectedOutput": "page=990..1000",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Helper CPU chạy nhanh có chứng minh instruction không vượt compute budget không?",
        "options": [
          "Có vì cùng ngôn ngữ Rust.",
          "Có nếu dùng release mode.",
          "Không; cần đo binary trong SVM với account và feature set tương ứng."
        ],
        "correct": 2,
        "explanation": "CPU wall time và SVM compute accounting là hai phép đo khác nhau."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://www.anchor-lang.com/docs/testing/mollusk"
      }
    },
    {
      "id": "blockchain-indexing",
      "moduleId": "track-blockchain",
      "title": "Indexer, xác nhận và phục hồi từ snapshot",
      "description": "Đưa trạng thái chuỗi vào ứng dụng mà không nhầm quan sát tạm thời với kết quả cuối.",
      "duration": 60,
      "objectives": [
        "Áp dụng snapshot: revision nhỏ hơn bỏ qua; bằng và digest giống là no-op; bằng khác digest trả conflict.",
        "Revision lớn hơn commit; lỗi giữ nguyên state.",
        "In revision=3 digest=30."
      ],
      "sections": [
        {
          "title": "Phản hồi mạng không phải toàn bộ trạng thái",
          "text": "Client có thể gửi yêu cầu nhưng mất phản hồi; điều đó không chứng minh thao tác chưa được xử lý. Ngược lại, thấy một chữ ký hoặc log chưa nhất thiết đáp ứng mức xác nhận mà sản phẩm yêu cầu. Lưu request ID nghiệp vụ, transaction signature khi có và trạng thái quan sát riêng. Thiết kế giao diện có pending, confirmed theo chính sách và failed có lý do. Không tự gửi lặp thao tác không idempotent chỉ vì timeout phía HTTP."
        },
        {
          "title": "Mức xác nhận là một lựa chọn sản phẩm",
          "text": "Dữ liệu quan sát gần đầu chuỗi có độ trễ thấp hơn nhưng có thể thay đổi theo fork. Một indexer có thể giữ vùng tentative và chỉ công bố vùng finalized theo hợp đồng của ứng dụng. Nếu dùng mức khác, phải có cơ chế rollback hoặc sửa trạng thái khi quan sát bị thay thế. Ghi slot, block hoặc nguồn quan sát cùng dữ liệu để điều tra. Revision nghiệp vụ trong account không thay thế thông tin xác nhận của chuỗi; chúng giải quyết hai loại thứ tự khác nhau."
        },
        {
          "title": "Sự kiện cần khóa khử trùng lặp",
          "text": "Nguồn stream hoặc job retry có thể gửi cùng event nhiều lần. Khóa gồm định danh transaction và vị trí instruction/log theo hợp đồng, không chỉ timestamp. Với snapshot account, revision và digest có thể giúp phát hiện lặp hoặc xung đột: cùng revision cùng nội dung là no-op; cùng revision khác nội dung là lỗi cần điều tra. Không ghi đè âm thầm bằng bản đến sau. Bản revision thấp hơn không được làm state quay lại khi xử lý snapshot đã finalized theo một chuỗi hợp lệ."
        },
        {
          "title": "Reconcile bằng trạng thái nguồn",
          "text": "Indexer có thể mất event, nên cần đường đọc snapshot để đối chiếu và phục hồi. Nếu nhận revision nhảy từ ba lên sáu, biết đã có khoảng trống; chọn đọc lại account hoặc replay nguồn lịch sử theo chính sách. Không tự suy ra những transition bị thiếu từ trạng thái cuối. Lưu checkpoint sau khi dữ liệu đích được commit thành công để crash không bỏ qua bản ghi. Với cơ sở dữ liệu, dedup và cập nhật checkpoint nên trong transaction thích hợp để retry có thể an toàn."
        },
        {
          "title": "Thực hành bằng fixture không cần RPC",
          "text": "Bài tập xử lý các snapshot đã được đánh dấu đủ mức xác nhận bởi tầng nguồn giả lập. Hàm nhận revision và digest, bỏ revision cũ, no-op khi lặp đúng, báo conflict khi cùng revision khác digest và chỉ commit bản mới hợp lệ. Điều kiện nguồn đáng tin được ghi rõ, không để boolean do client tùy đặt trở thành bằng chứng trên production. Dự án capstone dùng fixture này để kiểm tra indexer, rồi yêu cầu bổ sung adapter nguồn và test fork/reconcile trong môi trường kiểm thử riêng."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Indexer, xác nhận và phục hồi từ snapshot",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Áp dụng snapshot: revision nhỏ hơn bỏ qua; bằng và digest giống là no-op; bằng khác digest trả conflict.",
          "Revision lớn hơn commit; lỗi giữ nguyên state.",
          "In revision=3 digest=30."
        ]
      },
      "starterCode": "fn main() {\n    // Áp dụng snapshot: revision nhỏ hơn bỏ qua; bằng và digest giống là no-op; bằng khác digest trả conflict.\n    // Revision lớn hơn commit; lỗi giữ nguyên state.\n    // In revision=3 digest=30.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "#[derive(Clone,Debug,PartialEq,Eq)]struct View{revision:u64,digest:u64}\nfn observe(s:&mut View,r:u64,d:u64)->Result<bool,&'static str>{\n if r<s.revision{return Ok(false);}\n if r==s.revision{return if d==s.digest{Ok(false)}else{Err(\"conflict\")};}\n s.revision=r;s.digest=d;Ok(true)\n}\nfn main(){\n let mut s=View{revision:2,digest:20};assert_eq!(observe(&mut s,1,10),Ok(false));assert_eq!(observe(&mut s,2,20),Ok(false));\n let before=s.clone();assert!(observe(&mut s,2,99).is_err());assert_eq!(s,before);\n observe(&mut s,3,30).unwrap();println!(\"revision=3 digest=30\");\n}",
      "expectedOutput": "revision=3 digest=30",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Indexer nhận cùng revision nhưng digest khác. Nên làm gì?",
        "options": [
          "Chọn bản đến sau luôn đúng.",
          "Báo xung đột và reconcile nguồn, không ghi đè âm thầm.",
          "Cộng hai digest."
        ],
        "correct": 1,
        "explanation": "Cùng revision phải có cùng state theo hợp đồng; khác nội dung là dấu hiệu nguồn/fork/bug cần xử lý."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://solana.com/docs/rpc"
      }
    },
    {
      "id": "blockchain-upgrades",
      "moduleId": "track-blockchain",
      "title": "Nâng cấp chương trình và migration dữ liệu",
      "description": "Liên kết mã, layout, client và quyền quản trị trong một kế hoạch phát hành.",
      "duration": 60,
      "objectives": [
        "Reader v1 chỉ đọc schema1; reader v2 đọc schema1 và schema2; version khác không hỗ trợ.",
        "Kiểm tra reader1/schema2 bị từ chối, reader2/schema1 được chấp nhận.",
        "In compatibility checked."
      ],
      "sections": [
        {
          "title": "Mã mới phải sống cùng dữ liệu đã tồn tại",
          "text": "Nâng cấp chương trình không xóa các account cũ. Binary mới cần biết phiên bản dữ liệu nào còn hỗ trợ và cách xử lý từng phiên bản. Client cũ có thể tiếp tục tạo instruction theo IDL cũ, nên thay thứ tự trường hoặc meaning của mã trạng thái có thể gây lỗi khó thấy. Viết ma trận tương thích gồm binary, account schema, instruction schema và client. Không chỉ thử tạo account mới bằng binary mới rồi kết luận migration an toàn."
        },
        {
          "title": "Migration là một state transition riêng",
          "text": "Một bước chuyển từ v1 sang v2 cần actor được phép, điều kiện trạng thái, revision, dung lượng và giá trị mặc định có căn cứ. Nếu v2 thêm reviewer, không thể tự đặt author làm reviewer khi luật cấm tự duyệt. Có thể yêu cầu người có quyền chỉ định và người nhận chấp thuận. Migration lặp cần no-op hoặc lỗi rõ theo hợp đồng, không tiếp tục tăng revision hoặc cấp thêm quyền. Giữ fixture bytes v1 để test từ dữ liệu thật của schema cũ."
        },
        {
          "title": "Quyền nâng cấp là một phần của mô hình tin cậy",
          "text": "Nếu chương trình có thể được nâng cấp, người kiểm soát quyền đó có thể thay logic trong tương lai theo cơ chế của loader. Người dùng cần biết chính sách quản trị và quy trình thay đổi của sản phẩm. Tách quyền vận hành release khỏi authority nghiệp vụ trong account khi phù hợp. Bài học phân tích quyền bằng fixture và tài liệu, không tạo keypair hay thao tác ví. Quyết định quản trị cần được xem xét riêng với mức độ rủi ro của ứng dụng, không chỉ là biến cấu hình."
        },
        {
          "title": "Artifact phát hành cần được liên kết",
          "text": "Lưu commit nguồn, dependency lockfile, toolchain, build flags, digest binary và IDL đi kèm. IDL từ bản khác có thể tạo bytes hoặc account metas không khớp handler dù program ID giống nhau. Reproducible build là quy trình cần kiểm tra trên môi trường cụ thể, không phải kết quả tự có chỉ vì dùng Cargo.lock. Giữ manifest cho phép reviewer đối chiếu artifact nào đã được test. Digest không chứng minh bản build an toàn; nó chỉ gắn kết bằng chứng với bytes cụ thể."
        },
        {
          "title": "Kế hoạch quay lại có giới hạn",
          "text": "Rollback binary không tự đảo được migration dữ liệu đã thực hiện. Trước phát hành, quyết định giữ đọc schema cũ, migration có thể đảo hay cần forward fix. Chạy thử trên fixture có dữ liệu đang hoạt động và account ở trạng thái cuối. Bài thực hành xây ma trận tương thích đơn giản giữa version reader và schema; kiểm tra future schema bị từ chối. Dự án release yêu cầu báo rõ phần nào có thể rollback và phần nào chỉ có thể khôi phục từ snapshot hoặc sửa theo hướng tiến."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Nâng cấp chương trình và migration dữ liệu",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Reader v1 chỉ đọc schema1; reader v2 đọc schema1 và schema2; version khác không hỗ trợ.",
          "Kiểm tra reader1/schema2 bị từ chối, reader2/schema1 được chấp nhận.",
          "In compatibility checked."
        ]
      },
      "starterCode": "fn main() {\n    // Reader v1 chỉ đọc schema1; reader v2 đọc schema1 và schema2; version khác không hỗ trợ.\n    // Kiểm tra reader1/schema2 bị từ chối, reader2/schema1 được chấp nhận.\n    // In compatibility checked.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn compatible(reader:u32,schema:u32)->bool{\n match reader{1=>schema==1,2=>schema==1||schema==2,_=>false}\n}\nfn main(){\n assert!(compatible(1,1));assert!(!compatible(1,2));\n assert!(compatible(2,1));assert!(compatible(2,2));assert!(!compatible(2,3));\n println!(\"compatibility checked\");\n}",
      "expectedOutput": "compatibility checked",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Đã migration account sang layout mới. Rollback binary cũ có luôn an toàn không?",
        "options": [
          "Có vì program ID giữ nguyên.",
          "Không; binary cũ có thể không đọc được schema mới.",
          "Có nếu Cargo.lock không đổi."
        ],
        "correct": 1,
        "explanation": "Mã và dữ liệu tiến hóa độc lập; kế hoạch rollback phải xét khả năng đọc layout đã migrate."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://www.anchor-lang.com/docs/basics/idl"
      }
    },
    {
      "id": "blockchain-threat-model",
      "moduleId": "track-blockchain",
      "title": "Threat model và kiểm thử đối kháng",
      "description": "Biến giả định tin cậy thành ca kiểm thử và tiêu chí review.",
      "duration": 60,
      "objectives": [
        "Kiểm tra checklist gồm owner,signer,writable,pda,stale,overflow,rollback, không thiếu và không trùng.",
        "Thử tập thiếu rollback; trả false.",
        "In review matrix complete."
      ],
      "sections": [
        {
          "title": "Liệt kê tài sản và quyền trước kịch bản lỗi",
          "text": "Với quy trình tài liệu, tài sản cần bảo vệ là tính đúng của author/reviewer, trạng thái phê duyệt, revision và khả năng truy vết. Caller có thể chọn bytes, thứ tự account và gửi lại instruction; họ không được mặc định kiểm soát chữ ký của người khác. Viết giả định về nguồn RPC, admin và upgrade authority. Một threat model tốt phân biệt điều runtime cung cấp với điều program phải tự kiểm tra, để không lặp kiểm tra vô nghĩa hoặc bỏ qua quyền nghiệp vụ."
        },
        {
          "title": "Mỗi ràng buộc có một test phá vỡ riêng",
          "text": "Từ ca hợp lệ, đổi owner, signer, writable, PDA seed, bump, role hoặc discriminator từng thứ một. Nếu đổi nhiều điều kiện cùng lúc, test thất bại nhưng không biết ràng buộc nào thực sự hoạt động. Kiểm tra state account trước sau khi lỗi, không chỉ xem mã lỗi. Với alias, truyền cùng account cho hai vai trò lẽ ra khác nhau và xác nhận bị chặn theo thiết kế. Một số wrapper có bảo vệ mặc định theo phiên bản, nhưng bất biến nghiệp vụ vẫn cần test rõ."
        },
        {
          "title": "Property test và fuzzing kiểm tra vùng rộng hơn",
          "text": "Property có thể là revision chỉ tăng khi transition thành công, terminal state không đổi bởi action trái phép, hoặc decode không panic với bytes bất kỳ trong giới hạn. Fuzzer sinh input không thay thế fixture có ý nghĩa nhưng tìm được tổ hợp người viết chưa nghĩ tới. Giới hạn thời gian, kích thước và lưu seed/crash case để tái lập. Khi tìm lỗi, thêm regression nhỏ có lời giải thích. Đừng chỉ tăng coverage phần trăm mà không biết bất biến nào đang được bảo vệ."
        },
        {
          "title": "Tách logic host, account validation và SVM",
          "text": "Unit test helper kiểm tra state machine; host serialization kiểm tra layout; SVM test chạy entrypoint và quyền runtime; integration test kiểm tra client/indexer. Không lấy kết quả của tầng dưới để nhận tầng trên đã đạt. Ví dụ helper từ chối actor enum sai không chứng minh account Signer được kiểm tra trong handler. Trên harness SVM, dùng account fixtures với owner và flags thật của môi trường thử, thực thi binary đúng digest đã ghi trong manifest và xác nhận rollback khi instruction lỗi."
        },
        {
          "title": "Review cần bằng chứng và giới hạn",
          "text": "Bài thực hành kiểm tra tập ca âm bắt buộc đã có tên và không trùng, giúp chuẩn bị ma trận review. Trong dự án, mỗi ca phải có expected behavior, file test, kết quả và artifact version, không chỉ một ô đã tích. Nêu phần chưa chạy như SBF, CPI hoặc feature set mới. Một khóa học có thể giúp người học viết và kiểm tra chương trình nhỏ, nhưng sản phẩm quan trọng vẫn cần review độc lập và kiểm thử phù hợp phạm vi. Tự đánh giá không nên đổi thành lời hứa đã audit."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Threat model và kiểm thử đối kháng",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Kiểm tra checklist gồm owner,signer,writable,pda,stale,overflow,rollback, không thiếu và không trùng.",
          "Thử tập thiếu rollback; trả false.",
          "In review matrix complete."
        ]
      },
      "starterCode": "fn main() {\n    // Kiểm tra checklist gồm owner,signer,writable,pda,stale,overflow,rollback, không thiếu và không trùng.\n    // Thử tập thiếu rollback; trả false.\n    // In review matrix complete.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "use std::collections::HashSet;\nfn complete(cases:&[&str])->bool{\n let required=HashSet::from([\"owner\",\"signer\",\"writable\",\"pda\",\"stale\",\"overflow\",\"rollback\"]);\n let actual:HashSet<_>=cases.iter().copied().collect();\n actual.len()==cases.len()&&required.is_subset(&actual)\n}\nfn main(){\n assert!(complete(&[\"owner\",\"signer\",\"writable\",\"pda\",\"stale\",\"overflow\",\"rollback\"]));\n assert!(!complete(&[\"owner\",\"signer\",\"writable\",\"pda\",\"stale\",\"overflow\"]));\n assert!(!complete(&[\"owner\",\"signer\",\"writable\",\"pda\",\"stale\",\"overflow\",\"rollback\",\"owner\"]));\n println!(\"review matrix complete\");\n}",
      "expectedOutput": "review matrix complete",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Test đổi đồng thời owner và signer rồi thấy lỗi. Có chứng minh cả hai kiểm tra hoạt động không?",
        "options": [
          "Có vì instruction thất bại.",
          "Không cần test owner nữa.",
          "Chưa; cần ca âm riêng cho từng ràng buộc."
        ],
        "correct": 2,
        "explanation": "Lỗi sớm ở một ràng buộc có thể che ràng buộc còn lại bị thiếu."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://www.anchor-lang.com/docs/testing"
      }
    },
    {
      "id": "blockchain-release-project",
      "moduleId": "track-blockchain",
      "title": "Capstone: gói phát hành và client kiểm chứng",
      "description": "Ghép Anchor, kế hoạch instruction, indexer và ma trận runtime thành sản phẩm offline.",
      "duration": 60,
      "objectives": [
        "Chỉ áp dụng observation finalized; revision lớn hơn tăng state, tentative không đổi.",
        "Cùng revision khác digest trả conflict, lỗi giữ nguyên.",
        "In finalized revision=2."
      ],
      "sections": [
        {
          "title": "Phạm vi của capstone",
          "text": "Sản phẩm gồm chương trình review, gateway CPI, client builder, decoder snapshot, indexer fixture và manifest liên kết artifact. Host tests kiểm logic và code Anchor sinh; harness LiteSVM trong gói chạy hai binary SBF để kiểm quyền và rollback thực thi. Không có RPC, ví hoặc giao dịch tài sản thật: account, chữ ký và số dư chỉ là fixture VM. Người học làm từng lớp, lưu kết quả tách biệt; biên dịch harness chưa có nghĩa đã chạy SVM. Thư mục svm cung cấp dependency được khóa, test và lệnh build đầy đủ."
        },
        {
          "title": "Client builder không đoán thứ tự account",
          "text": "Dùng accounts và instruction struct do Anchor sinh để tạo payload và metas, sau đó kiểm tra program ID cùng vai trò trước khi xuất plan. Document ID và expected revision giữ u64 từ đầu tới bytes, không qua float. PDA được derive bằng author bất biến và document ID. Plan là dữ liệu để review, không tự ký hoặc gửi. Test xác nhận proposal writable, actor signer và không cấp quyền ghi thừa cho actor trong các action không cần thay dữ liệu của actor."
        },
        {
          "title": "Decoder kiểm tra cả metadata lẫn bytes",
          "text": "Khi nhận snapshot, kiểm tra owner và độ dài; serializer kiểm discriminator rồi giải mã có kiểm soát. Các trường vừa đọc chưa được dùng để quyết định quyền. Tiếp tục kiểm author khác reviewer, document ID, miền status, quan hệ PDA và canonical bump; chỉ chấp nhận snapshot sau toàn bộ bước này. Digest dùng bytes của schema đã biết. Indexer áp dụng quan sát được nguồn xác nhận đủ mức: cùng revision cùng bytes là no-op, khác bytes là conflict; revision cũ không làm view lùi. Fixture finalized không thay bằng chứng xác nhận của nguồn thực."
        },
        {
          "title": "CPI và SVM có mẫu chạy ngay",
          "text": "Gateway derive author PDA theo operator đã ký, giới hạn target bằng Program<ReviewProgram> và gọi submit với signer seeds. Sau CPI nó reload proposal rồi kiểm revision/status; đọc wrapper cũ sẽ thấy dữ liệu trước lời gọi. Harness có 14 test: quyền signer/owner/PDA/bump/writable, reviewer, transition, rollback và compute. Probe bỏ seeds phải báo privilege escalation. Probe lỗi sau CPI phải có log callee success nhưng dữ liệu cuối vẫn là bản cũ. Script build hai ELF, chạy LiteSVM và ghi digest/log; svm/README giải thích mọi bước. Nếu toolchain chưa chạy được, giữ trạng thái runtime chưa nghiệm thu."
        },
        {
          "title": "Bàn giao có thể kiểm tra và tái lập",
          "text": "Nộp mã, manifest, fixture bytes, kết quả host/SVM, sơ đồ quyền và hướng dẫn reconcile indexer. Thử nâng schema trên một bản sao dữ liệu và ghi giới hạn rollback. Client UI nếu thêm phải phản ánh pending và mức xác nhận, không báo thành công từ một phản hồi gửi request. Bộ capstone là nền cho dự án thật có review, không phải chứng nhận không có lỗ hổng. Các phần mạng, SVM feature set, program upgrade và môi trường mục tiêu cần bằng chứng riêng trước khi mở rộng phạm vi."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Capstone: gói phát hành và client kiểm chứng",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Chỉ áp dụng observation finalized; revision lớn hơn tăng state, tentative không đổi.",
          "Cùng revision khác digest trả conflict, lỗi giữ nguyên.",
          "In finalized revision=2."
        ]
      },
      "starterCode": "fn main() {\n    // Chỉ áp dụng observation finalized; revision lớn hơn tăng state, tentative không đổi.\n    // Cùng revision khác digest trả conflict, lỗi giữ nguyên.\n    // In finalized revision=2.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "#[derive(Clone,Debug,PartialEq,Eq)]struct View{revision:u64,digest:u64}\nfn apply(s:&mut View,finalized:bool,r:u64,d:u64)->Result<bool,&'static str>{\n if !finalized||r<s.revision{return Ok(false);}\n if r==s.revision{return if d==s.digest{Ok(false)}else{Err(\"conflict\")};}\n s.revision=r;s.digest=d;Ok(true)\n}\nfn main(){\n let mut s=View{revision:1,digest:10};assert_eq!(apply(&mut s,false,2,20),Ok(false));\n assert_eq!(s.revision,1);apply(&mut s,true,2,20).unwrap();\n let before=s.clone();assert!(apply(&mut s,true,2,99).is_err());assert_eq!(s,before);\n println!(\"finalized revision=2\");\n}",
      "expectedOutput": "finalized revision=2",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Host tests đạt nhưng chưa có binary chạy trong SVM. Mục nào phải còn thiếu trong readiness?",
        "options": [
          "Bằng chứng signer/owner/seeds/rollback và compute thực thi.",
          "Mọi mục đã đủ.",
          "Chỉ màu nút của client."
        ],
        "correct": 0,
        "explanation": "Những điều kiện runtime chỉ được kiểm chứng khi chạy entrypoint trong môi trường SVM tương ứng."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://www.anchor-lang.com/docs/testing/litesvm"
      },
      "localLab": {
        "title": "Anchor, CPI gateway và harness LiteSVM",
        "instructions": "Chạy host workspace trước. Thư mục svm có LiteSVM 0.16.0 và 14 runtime test; gateway thực hiện CPI có signer PDA, target allowlist và reload state. cargo test --manifest-path svm/Cargo.toml --no-run chỉ biên dịch harness. Cài cargo-build-sbf 4.6.0 rồi bash scripts/run-svm.sh để build hai binary và thực thi SVM; hướng dẫn đầy đủ nằm trong svm/README.md. Không có RPC hay giao dịch tài sản thật.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"review-release\"\nversion = \"0.1.0\"\nedition = \"2024\"\npublish = false\n\n[workspace]\nmembers = [\"program\", \"gateway\"]\nexclude = [\"svm\"]\ndefault-members = [\".\", \"program\"]\nresolver = \"2\"\n\n[dependencies]\nanchor-lang = \"=1.2.2\"\nreview_program = { path = \"program\", features = [\"no-entrypoint\"] }\nsha2 = \"0.10\"\n\n[profile.dev]\ndebug = 0\n[profile.test]\ndebug = 0\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use anchor_lang::prelude::Pubkey;\nuse anchor_lang::{AccountDeserialize,Discriminator,InstructionData,Space,ToAccountMetas};\nuse review_program::{Proposal,ID,CANCELLED};\nuse sha2::{Digest,Sha256};\n#[derive(Clone,Debug,PartialEq,Eq)]\npub struct Plan{pub program:Pubkey,pub accounts:Vec<(Pubkey,bool,bool)>,pub data:Vec<u8>}\npub fn address(author:&Pubkey,id:u64)->Result<(Pubkey,u8),String>{\n if id==0{return Err(\"document_id\".into());}\n Pubkey::try_find_program_address(&[b\"proposal-v1\",author.as_ref(),&id.to_le_bytes()],&ID).ok_or_else(||\"pda\".into())\n}\npub fn submit_plan(author:Pubkey,id:u64,expected:u64)->Result<Plan,String>{\n let(proposal,_)=address(&author,id)?;\n if proposal==author{return Err(\"role_alias\".into());}\n let accounts=review_program::accounts::Submit{proposal,author}.to_account_metas(None).into_iter().map(|m|(m.pubkey,m.is_signer,m.is_writable)).collect();\n let data=review_program::instruction::Submit{expected_revision:expected}.data();\n Ok(Plan{program:ID,accounts,data})\n}\npub fn decode(owner:Pubkey,key:Pubkey,bytes:&[u8])->Result<Proposal,String>{\n if owner!=ID{return Err(\"owner\".into());}\n if bytes.len()!=Proposal::DISCRIMINATOR.len()+Proposal::INIT_SPACE{return Err(\"length\".into());}\n let p=Proposal::try_deserialize(&mut &bytes[..]).map_err(|_|\"decode\")?;\n if p.author==p.reviewer||p.document_id==0||p.status>CANCELLED{return Err(\"state\".into());}\n let(expected,bump)=address(&p.author,p.document_id)?;\n if key!=expected||p.bump!=bump{return Err(\"identity\".into());}Ok(p)\n}\npub fn hash(bytes:&[u8])->[u8;32]{Sha256::digest(bytes).into()}\n#[derive(Clone,Debug,PartialEq,Eq)]\npub struct View{pub slot:u64,pub revision:u64,pub status:u8,pub digest:[u8;32]}\npub struct Observation{pub finalized:bool,pub slot:u64,pub owner:Pubkey,pub key:Pubkey,pub data:Vec<u8>}\npub struct Index{pub key:Pubkey,pub current:Option<View>}\nimpl Index{\n pub fn new(key:Pubkey)->Self{Self{key,current:None}}\n fn ingest(&mut self,o:&Observation,reconcile:bool)->Result<bool,String>{\n  if !o.finalized{return Ok(false);}\n  if o.key!=self.key{return Err(\"index_key\".into());}\n  let p=decode(o.owner,o.key,&o.data)?;let digest=hash(&o.data);\n  if let Some(current)=&self.current{\n   if p.revision<current.revision{return Ok(false);}\n   if p.revision==current.revision{return if digest==current.digest{Ok(false)}else{Err(\"revision_conflict\".into())};}\n   if o.slot<current.slot{return Err(\"slot_regression\".into());}\n   if !reconcile&&p.revision!=current.revision.checked_add(1).ok_or(\"revision_overflow\")?{return Err(\"revision_gap\".into());}\n  }\n  self.current=Some(View{slot:o.slot,revision:p.revision,status:p.status,digest});Ok(true)\n }\n pub fn apply(&mut self,o:&Observation)->Result<bool,String>{self.ingest(o,false)}\n /// Caller must obtain a complete finalized account snapshot from its trusted source.\n pub fn reconcile(&mut self,o:&Observation)->Result<bool,String>{self.ingest(o,true)}\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use anchor_lang::prelude::Pubkey;\nuse review_release::{submit_plan,hash};\nfn main(){let p=submit_plan(Pubkey::new_from_array([9;32]),42,0).unwrap();let digest=hash(include_bytes!(\"../program/src/lib.rs\"));let hex:String=digest.iter().map(|b|format!(\"{b:02x}\")).collect();println!(\"program={} accounts={} instruction_bytes={}\",p.program,p.accounts.len(),p.data.len());println!(\"source_sha256={hex}\");println!(\"host package ready; SVM evidence required\");}\n"
          },
          {
            "path": "tests/release.rs",
            "content": "use anchor_lang::prelude::Pubkey;\nuse anchor_lang::{AccountSerialize,Discriminator};\nuse review_program::{new_proposal,transition,Actor,Action,ID,SUBMITTED,APPROVED};\nuse review_release::{address,decode,submit_plan,hash,Index,Observation};\nfn fixture()->(Pubkey,review_program::Proposal){let author=Pubkey::new_from_array([9;32]);let(key,bump)=address(&author,42).unwrap();(key,new_proposal(author,Pubkey::new_from_array([10;32]),42,bump).unwrap())}\nfn observe(key:Pubkey,p:&review_program::Proposal,slot:u64,finalized:bool)->Observation{let mut data=Vec::new();p.try_serialize(&mut data).unwrap();Observation{finalized,slot,owner:ID,key,data}}\n#[test]fn builder_preserves_integer_and_privileges(){let a=Pubkey::new_from_array([9;32]);let p=submit_plan(a,42,u64::MAX-1).unwrap();assert_eq!(p.program,ID);assert_eq!(p.accounts.len(),2);assert_eq!(p.accounts[0],(address(&a,42).unwrap().0,false,true));assert_eq!(p.accounts[1],(a,true,false));let n=review_program::instruction::Submit::DISCRIMINATOR.len();assert_eq!(&p.data[n..],&(u64::MAX-1).to_le_bytes());}\n#[test]fn decoder_checks_metadata_and_bytes(){let(key,p)=fixture();let o=observe(key,&p,1,true);assert_eq!(decode(ID,key,&o.data).unwrap(),p);assert!(decode(Pubkey::new_from_array([1;32]),key,&o.data).is_err());assert!(decode(ID,Pubkey::new_from_array([2;32]),&o.data).is_err());let mut bad=o.data.clone();bad[0]^=255;assert!(decode(ID,key,&bad).is_err());assert!(decode(ID,key,&o.data[..o.data.len()-1]).is_err());}\n#[test]fn tentative_and_duplicate_are_noops(){let(key,p)=fixture();let mut index=Index::new(key);assert!(!index.apply(&observe(key,&p,1,false)).unwrap());assert!(index.current.is_none());assert!(index.apply(&observe(key,&p,1,true)).unwrap());let before=index.current.clone();assert!(!index.apply(&observe(key,&p,2,true)).unwrap());assert_eq!(index.current,before);}\n#[test]fn conflicting_revision_preserves_view(){let(key,mut p)=fixture();let mut index=Index::new(key);index.apply(&observe(key,&p,1,true)).unwrap();let before=index.current.clone();p.reviewer=Pubkey::new_from_array([11;32]);assert!(index.apply(&observe(key,&p,2,true)).is_err());assert_eq!(index.current,before);}\n#[test]fn transitions_advance_in_order(){let(key,mut p)=fixture();let mut index=Index::new(key);index.apply(&observe(key,&p,1,true)).unwrap();transition(&mut p,Actor::Author,Action::Submit,0).unwrap();index.apply(&observe(key,&p,2,true)).unwrap();assert_eq!(index.current.as_ref().unwrap().status,SUBMITTED);transition(&mut p,Actor::Reviewer,Action::Approve,1).unwrap();index.apply(&observe(key,&p,3,true)).unwrap();assert_eq!(index.current.as_ref().unwrap().status,APPROVED);}\n#[test]fn gap_needs_explicit_reconcile(){let(key,mut p)=fixture();let mut index=Index::new(key);index.apply(&observe(key,&p,1,true)).unwrap();transition(&mut p,Actor::Author,Action::Submit,0).unwrap();transition(&mut p,Actor::Reviewer,Action::Approve,1).unwrap();let before=index.current.clone();let o=observe(key,&p,3,true);assert!(index.apply(&o).is_err());assert_eq!(index.current,before);index.reconcile(&o).unwrap();assert_eq!(index.current.as_ref().unwrap().revision,2);}\n#[test]fn old_revision_and_slot_regression(){let(key,mut p)=fixture();let old=observe(key,&p,1,true);let mut index=Index::new(key);index.apply(&old).unwrap();transition(&mut p,Actor::Author,Action::Submit,0).unwrap();index.apply(&observe(key,&p,10,true)).unwrap();assert!(!index.apply(&old).unwrap());transition(&mut p,Actor::Reviewer,Action::Approve,1).unwrap();assert!(index.apply(&observe(key,&p,9,true)).is_err());assert_eq!(index.current.as_ref().unwrap().revision,1);}\n#[test]fn digest_known_vector(){let expected=[0xba,0x78,0x16,0xbf,0x8f,0x01,0xcf,0xea,0x41,0x41,0x40,0xde,0x5d,0xae,0x22,0x23,0xb0,0x03,0x61,0xa3,0x96,0x17,0x7a,0x9c,0xb4,0x10,0xff,0x61,0xf2,0x00,0x15,0xad];assert_eq!(hash(b\"abc\"),expected);}\n"
          },
          {
            "path": "program/Cargo.toml",
            "content": "[package]\nname = \"review_program\"\nversion = \"0.1.0\"\nedition = \"2021\"\npublish = false\n\n[lib]\ncrate-type = [\"cdylib\", \"lib\"]\nname = \"review_program\"\n\n[features]\ndefault = []\ncpi = [\"no-entrypoint\"]\nno-entrypoint = []\nno-idl = []\nno-log-ix-name = []\nidl-build = [\"anchor-lang/idl-build\"]\nanchor-debug = []\ncustom-heap = []\ncustom-panic = []\n\n[dependencies]\nanchor-lang = \"=1.2.2\"\n\n[lints.rust]\nunexpected_cfgs = { level = \"warn\", check-cfg = ['cfg(target_os, values(\"solana\"))'] }\n"
          },
          {
            "path": "program/src/lib.rs",
            "content": "use anchor_lang::prelude::*;\nuse anchor_lang::{Discriminator,Space};\n// Fixed public address for offline fixtures only; no deployed program is assumed.\ndeclare_id!(\"swqrv48gsrwpBFbftEwnP2vB4jckpvfGJfXkwaniLCC\");\npub const DRAFT:u8=0;\npub const SUBMITTED:u8=1;\npub const APPROVED:u8=2;\npub const REJECTED:u8=3;\npub const CANCELLED:u8=4;\n#[program]\npub mod review_program{\n use super::*;\n pub fn initialize(ctx:Context<Initialize>,document_id:u64,reviewer:Pubkey)->Result<()>{\n  let proposal=new_proposal(ctx.accounts.author.key(),reviewer,document_id,ctx.bumps.proposal)?;\n  ctx.accounts.proposal.set_inner(proposal);Ok(())\n }\n pub fn submit(ctx:Context<Submit>,expected_revision:u64)->Result<()>{\n  transition(&mut ctx.accounts.proposal,Actor::Author,Action::Submit,expected_revision)\n }\n pub fn review(ctx:Context<Review>,expected_revision:u64,approve:bool)->Result<()>{\n  transition(&mut ctx.accounts.proposal,Actor::Reviewer,if approve{Action::Approve}else{Action::Reject},expected_revision)\n }\n pub fn cancel(ctx:Context<Submit>,expected_revision:u64)->Result<()>{\n  transition(&mut ctx.accounts.proposal,Actor::Author,Action::Cancel,expected_revision)\n }\n}\n#[derive(Accounts)]\n#[instruction(document_id:u64,reviewer:Pubkey)]\npub struct Initialize<'info>{\n #[account(init,payer=author,space=Proposal::DISCRIMINATOR.len()+Proposal::INIT_SPACE,seeds=[b\"proposal-v1\",author.key().as_ref(),&document_id.to_le_bytes()],bump)]\n pub proposal:Account<'info,Proposal>,\n #[account(mut)]pub author:Signer<'info>,\n pub system_program:Program<'info,System>,\n}\n#[derive(Accounts)]\npub struct Submit<'info>{\n #[account(mut,has_one=author,seeds=[b\"proposal-v1\",author.key().as_ref(),&proposal.document_id.to_le_bytes()],bump=proposal.bump)]\n pub proposal:Account<'info,Proposal>,\n pub author:Signer<'info>,\n}\n#[derive(Accounts)]\npub struct Review<'info>{\n #[account(mut,has_one=reviewer,seeds=[b\"proposal-v1\",proposal.author.as_ref(),&proposal.document_id.to_le_bytes()],bump=proposal.bump)]\n pub proposal:Account<'info,Proposal>,\n pub reviewer:Signer<'info>,\n}\n#[account]\n#[derive(InitSpace,Debug,PartialEq,Eq)]\npub struct Proposal{pub author:Pubkey,pub reviewer:Pubkey,pub document_id:u64,pub revision:u64,pub status:u8,pub bump:u8}\n#[derive(Clone,Copy,Debug)]pub enum Actor{Author,Reviewer}\n#[derive(Clone,Copy,Debug)]pub enum Action{Submit,Approve,Reject,Cancel}\npub fn new_proposal(author:Pubkey,reviewer:Pubkey,document_id:u64,bump:u8)->Result<Proposal>{\n require!(author!=reviewer&&document_id>0,ReviewError::Identity);\n Ok(Proposal{author,reviewer,document_id,revision:0,status:DRAFT,bump})\n}\n/// Assumes Accounts validation established the actor role; not a signature verifier.\npub fn transition(p:&mut Proposal,actor:Actor,action:Action,expected:u64)->Result<()>{\n require!(p.author!=p.reviewer&&p.document_id>0,ReviewError::Identity);\n require!(p.revision==expected,ReviewError::Stale);\n let next=match(p.status,actor,action){\n  (DRAFT,Actor::Author,Action::Submit)=>SUBMITTED,\n  (SUBMITTED,Actor::Reviewer,Action::Approve)=>APPROVED,\n  (SUBMITTED,Actor::Reviewer,Action::Reject)=>REJECTED,\n  (DRAFT|SUBMITTED,Actor::Author,Action::Cancel)=>CANCELLED,\n  _=>return err!(ReviewError::Transition),\n };\n let revision=p.revision.checked_add(1).ok_or_else(||error!(ReviewError::Overflow))?;\n p.status=next;p.revision=revision;Ok(())\n}\n#[error_code]\npub enum ReviewError{\n #[msg(\"Invalid document or role identity\")]Identity,\n #[msg(\"Expected revision is stale\")]Stale,\n #[msg(\"Transition is not permitted\")]Transition,\n #[msg(\"Revision overflow\")]Overflow,\n}\n"
          },
          {
            "path": "program/tests/host.rs",
            "content": "use anchor_lang::prelude::Pubkey;\nuse anchor_lang::{AccountDeserialize,AccountSerialize,Discriminator,InstructionData,Owner,Space,ToAccountMetas};\nuse review_program::{new_proposal,transition,Proposal,Actor,Action,DRAFT,SUBMITTED,APPROVED,REJECTED,CANCELLED,ID};\nfn fixture()->Proposal{new_proposal(Pubkey::new_from_array([9;32]),Pubkey::new_from_array([10;32]),42,254).unwrap()}\n#[test]fn valid_submit_approve(){let mut p=fixture();transition(&mut p,Actor::Author,Action::Submit,0).unwrap();transition(&mut p,Actor::Reviewer,Action::Approve,1).unwrap();assert_eq!((p.status,p.revision),(APPROVED,2));}\n#[test]fn role_and_order_rejected(){let mut p=fixture();let before=p.clone();assert!(transition(&mut p,Actor::Author,Action::Approve,0).is_err());assert_eq!(p,before);assert!(transition(&mut p,Actor::Reviewer,Action::Approve,0).is_err());assert_eq!(p,before);}\n#[test]fn cancel_and_reject_terminal(){let mut p=fixture();transition(&mut p,Actor::Author,Action::Cancel,0).unwrap();assert_eq!(p.status,CANCELLED);assert!(transition(&mut p,Actor::Author,Action::Submit,1).is_err());let mut p=fixture();transition(&mut p,Actor::Author,Action::Submit,0).unwrap();transition(&mut p,Actor::Reviewer,Action::Reject,1).unwrap();assert_eq!(p.status,REJECTED);}\n#[test]fn stale_and_overflow_atomic(){let mut p=fixture();transition(&mut p,Actor::Author,Action::Submit,0).unwrap();let before=p.clone();assert!(transition(&mut p,Actor::Reviewer,Action::Approve,0).is_err());assert_eq!(p,before);p.revision=u64::MAX;let before=p.clone();assert!(transition(&mut p,Actor::Reviewer,Action::Approve,u64::MAX).is_err());assert_eq!(p,before);}\n#[test]fn identity_rejected(){let a=Pubkey::new_from_array([9;32]);assert!(new_proposal(a,a,42,1).is_err());assert!(new_proposal(a,Pubkey::new_from_array([10;32]),0,1).is_err());}\n#[test]fn layout_roundtrip(){let p=fixture();let mut bytes=Vec::new();p.try_serialize(&mut bytes).unwrap();assert_eq!(Proposal::INIT_SPACE,82);assert_eq!(bytes.len(),Proposal::DISCRIMINATOR.len()+82);assert_eq!(Proposal::try_deserialize(&mut bytes.as_slice()).unwrap(),p);assert_eq!(Proposal::owner(),ID);}\n#[test]fn wrong_discriminator_truncated(){let mut bytes=Vec::new();fixture().try_serialize(&mut bytes).unwrap();let mut wrong=bytes.clone();wrong[0]^=255;assert!(Proposal::try_deserialize(&mut wrong.as_slice()).is_err());assert!(Proposal::try_deserialize(&mut &bytes[..bytes.len()-1]).is_err());}\n#[test]fn generated_account_privileges(){let p=Pubkey::new_from_array([3;32]);let a=Pubkey::new_from_array([9;32]);let metas=review_program::accounts::Submit{proposal:p,author:a}.to_account_metas(None);assert_eq!(metas.len(),2);assert!(metas[0].is_writable&&!metas[0].is_signer);assert!(metas[1].is_signer&&!metas[1].is_writable);assert_eq!(metas[0].pubkey,p);assert_eq!(metas[1].pubkey,a);}\n#[test]fn instruction_u64_and_bool(){let ix=review_program::instruction::Review{expected_revision:u64::MAX-1,approve:true};let bytes=ix.data();let n=review_program::instruction::Review::DISCRIMINATOR.len();assert_eq!(&bytes[n..n+8],&(u64::MAX-1).to_le_bytes());assert_eq!(bytes[n+8],1);assert_eq!(bytes.len(),n+9);assert_eq!(DRAFT,0);assert_eq!(SUBMITTED,1);}\n"
          },
          {
            "path": "RUNTIME-TEST-PLAN.md",
            "content": "# Kế hoạch nghiệm thu SVM cho review_program\n\n## Phân biệt các lớp\ncargo test trong gói này chạy host. Kết quả không xác nhận chữ ký giao dịch, account owner/writable enforcement, init/CPI hoặc rollback SVM. Không đánh dấu các mục dưới là đạt trước khi thực thi binary trong harness cục bộ.\n\n## Chuẩn bị artifact\n1. Giữ Cargo.lock, phiên bản Rust/Solana toolchain và Anchor 1.2.2 trong manifest.\n2. Dùng công cụ build SBF đã cài cho môi trường đích: cargo build-sbf --manifest-path program/Cargo.toml --sbf-out-dir target/deploy.\n3. Ghi SHA-256 của target/deploy/review_program.so cùng commit nguồn và IDL tương ứng. Digest source do main in chỉ là một trường bổ sung, không thay digest binary.\n4. Harness đã có tại svm/tests/runtime.rs với LiteSVM 0.16.0; gateway/src/lib.rs có CPI thực. Chạy bash scripts/run-svm.sh để build cả hai ELF và thực thi test; svm/README.md có mọi lệnh, phiên bản và giải thích. Không kết nối mạng.\n5. Dựng account fixtures: author và reviewer là hai địa chỉ khác nhau, proposal PDA từ proposal-v1/author/document ID little endian, System Program cho init. Số dư trong harness chỉ là fixture phục vụ cấp phát account, không phải tài sản thật.\n\n## Chuỗi hợp lệ phải chứng minh\n- Initialize document ID 42 với reviewer khác author; kiểm tra owner program, discriminator, layout 82 byte ngoài tag, bump canonical, status Draft và revision 0.\n- Submit bởi author, expected 0; kiểm tra Submitted/revision 1.\n- Review approve bởi reviewer, expected 1; kiểm tra Approved/revision 2.\n- Cancel từ Draft và Submitted trong fixtures riêng; trạng thái cuối không mở lại.\n\n## Ca âm bắt buộc (thay đúng một điều kiện)\n| Ca | Thay đổi so với fixture hợp lệ | Kết quả bắt buộc |\n| --- | --- | --- |\n| Signer | Author/reviewer không có quyền ký trong ngữ cảnh harness | Instruction lỗi, proposal không đổi |\n| Owner | Bytes Proposal đặt vào account owner khác | Bị từ chối trước transition |\n| PDA | Địa chỉ hoặc document ID không khớp seeds | Bị từ chối |\n| Bump | Bump lưu sai | Bị từ chối |\n| Writable | Proposal chỉ đọc | Bị từ chối khi yêu cầu sửa |\n| Role | Reviewer khác trường reviewer | Bị từ chối |\n| Stale | Expected revision cũ | Bị từ chối, bytes giữ nguyên |\n| Alias | Hai vai trò cần khác nhau dùng cùng địa chỉ | Bị từ chối theo Identity/constraint |\n| Rollback | Trong một transaction, instruction đầu hợp lệ, instruction sau cố tình lỗi | Các account bị đổi phải trở lại snapshot trước transaction |\n| Compute | Dữ liệu/case biên với budget đã ghi | Không vượt ngưỡng nghiệm thu đã chốt; báo CU và feature set |\n\nĐối chiếu account bytes trước/sau, không chỉ kiểm tra mã lỗi. Lưu test source, fixture, kết quả, binary digest và feature set. Số dư và loader setup do harness quản lý không chứng minh hành vi cluster mạng; RPC, finality, fork và adapter indexer cần integration tests riêng.\n\n## Indexer và mạng\nTrong lab, finalized là metadata fixture do test cung cấp. Adapter thực phải lấy mức xác nhận từ nguồn tin cậy và ánh xạ chính sách rõ ràng. Thử stream lặp, out-of-order, gap, fork tentative bị thay và đọc snapshot reconcile. Checkpoint chỉ được commit sau khi view đã được lưu thành công. Không tự gửi transaction lại khi timeout mà bỏ kiểm tra kết quả nghiệp vụ.\n\n## Harness đã cung cấp\n\n14 test SVM kiểm initialize/submit, signer, owner, readonly, PDA, bump, reviewer, approve/reject/terminal/cancel, rollback ở instruction thứ hai, CPI ký PDA, CPI thiếu seeds, CPI target sai, rollback sau CPI và budget quá nhỏ. Một số test kiểm nhiều tình huống trong cùng bảng. Các fixture được dựng bằng code Anchor cùng phiên bản; địa chỉ fee payer tách khỏi actor.\n\nGateway chỉ nhận operator có chữ ký, derive author PDA theo operator, dùng Program<ReviewProgram> cố định và reload sau CPI. Probe sign_pda=false phải bị runtime chặn privilege escalation; fail_after=true kiểm rollback sau khi callee đã success. Test chỉ PASS khi hai file .so tồn tại và được LiteSVM nạp; không có skip giả. Script viết log và manifest digest sau khi mọi test qua. Mạng, consensus và finalized source thật vẫn là integration scope riêng.\n"
          },
          {
            "path": "README.md",
            "content": "# Review release package\n\nChạy cargo test --workspace --all-targets và cargo run -p review-release để kiểm host. Workspace chứa Anchor review_program, gateway CPI và client builder/decoder/indexer. Indexer áp dụng finalized fixture, dedup cùng revision/bytes, chặn conflict, yêu cầu reconcile khi gap và chặn slot regression. Metadata finalized trong fixture không phải bằng chứng mạng.\n\nThư mục svm là harness LiteSVM 0.16.0 có 14 runtime test chạy hai binary SBF. Đọc svm/README.md ngay trong gói để hiểu cấu hình, fixture, chương trình CPI, rollback và compute. cargo test --manifest-path svm/Cargo.toml --no-run chỉ biên dịch; cài cargo-build-sbf 4.6.0 rồi bash scripts/run-svm.sh mới build và chạy SVM. Không có bước RPC, ví hoặc giao dịch tài sản thật; chữ ký/số dư chỉ là fixture VM.\n\nScript giữ log và tạo target/svm-manifest.json với digest binary/source/lockfile khi test qua. Main ở root chỉ in digest source, không thay bằng chứng SBF. Bổ sung IDL cùng version, adapter indexer có checkpoint transaction và migration rehearsal theo rubric. Môi trường chưa chạy SVM phải ghi rõ trạng thái còn thiếu.\n"
          },
          {
            "path": "gateway/Cargo.toml",
            "content": "[package]\nname = \"review-gateway\"\nversion = \"0.1.0\"\nedition = \"2021\"\npublish = false\n\n[lib]\ncrate-type = [\"cdylib\", \"lib\"]\nname = \"review_gateway\"\n\n[features]\ndefault = []\ncpi = [\"no-entrypoint\"]\nno-entrypoint = []\nno-idl = []\nno-log-ix-name = []\nidl-build = [\"anchor-lang/idl-build\", \"review_program/idl-build\"]\nanchor-debug = []\ncustom-heap = []\ncustom-panic = []\n\n[dependencies]\nanchor-lang = \"=1.2.2\"\nreview_program = { path = \"../program\", features = [\"cpi\"] }\n\n[lints.rust]\nunexpected_cfgs = { level = \"warn\", check-cfg = ['cfg(target_os, values(\"solana\"))'] }\n"
          },
          {
            "path": "gateway/src/lib.rs",
            "content": "use anchor_lang::prelude::*;\nuse review_program::{Proposal, SUBMITTED};\n\n// Public fixture address; this package does not deploy or connect to a cluster.\ndeclare_id!(\"ws91DX9HBAAxGW77BZs5FogRDwpRtcUpiLBpKdPTfWu\");\n\n#[program]\npub mod review_gateway {\n    use super::*;\n\n    // sign_pda=false and fail_after=true are deliberate negative-test probes.\n    // The operator must always sign; neither probe bypasses authorization.\n    pub fn submit_via_cpi(\n        ctx: Context<SubmitViaCpi>,\n        expected_revision: u64,\n        sign_pda: bool,\n        fail_after: bool,\n    ) -> Result<()> {\n        let operator = ctx.accounts.operator.key();\n        let bump = [ctx.bumps.author];\n        let seeds: &[&[u8]] = &[b\"review-author\", operator.as_ref(), &bump];\n        let groups = [seeds];\n        let signing = if sign_pda { &groups[..] } else { &[] };\n        let cpi = review_program::cpi::accounts::Submit {\n            proposal: ctx.accounts.proposal.to_account_info(),\n            author: ctx.accounts.author.to_account_info(),\n        };\n        // Anchor 1.2 takes the program Pubkey, not an AccountInfo, here.\n        review_program::cpi::submit(\n            CpiContext::new(ctx.accounts.review_program.key(), cpi).with_signer(signing),\n            expected_revision,\n        )?;\n        // CPI writes the underlying account; the deserialized wrapper must be refreshed.\n        ctx.accounts.proposal.reload()?;\n        let next = expected_revision.checked_add(1).ok_or_else(|| error!(GatewayError::Overflow))?;\n        require_eq!(ctx.accounts.proposal.revision, next, GatewayError::Postcondition);\n        require_eq!(ctx.accounts.proposal.status, SUBMITTED, GatewayError::Postcondition);\n        require!(!fail_after, GatewayError::InjectedFailure);\n        Ok(())\n    }\n}\n\n#[derive(Accounts)]\npub struct SubmitViaCpi<'info> {\n    #[account(\n        mut,\n        has_one = author,\n        seeds = [b\"proposal-v1\", author.key().as_ref(), &proposal.document_id.to_le_bytes()],\n        bump = proposal.bump,\n        seeds::program = review_program.key()\n    )]\n    pub proposal: Account<'info, Proposal>,\n    /// CHECK: identity is derived from this program and the signer below.\n    #[account(seeds = [b\"review-author\", operator.key().as_ref()], bump)]\n    pub author: UncheckedAccount<'info>,\n    pub operator: Signer<'info>,\n    // Typed Program checks both the fixed allowlisted address and executable status.\n    pub review_program: Program<'info, review_program::program::ReviewProgram>,\n}\n\n#[error_code]\npub enum GatewayError {\n    #[msg(\"Unexpected state after CPI\")] Postcondition,\n    #[msg(\"Revision overflow\")] Overflow,\n    #[msg(\"Intentional failure after CPI for rollback test\")] InjectedFailure,\n}\n"
          },
          {
            "path": "svm/Cargo.toml",
            "content": "[package]\nname = \"review-svm-tests\"\nversion = \"0.1.0\"\nedition = \"2024\"\nrust-version = \"1.95\"\npublish = false\n\n# Separate workspace: ordinary host tests do not pretend to execute SBF binaries.\n[workspace]\nresolver = \"2\"\n\n[dependencies]\nanchor-lang = \"=1.2.2\"\nreview-release = { path = \"..\" }\nreview_program = { path = \"../program\", features = [\"no-entrypoint\"] }\nreview-gateway = { path = \"../gateway\", features = [\"no-entrypoint\"] }\nlitesvm = \"=0.16.0\"\nsolana-account = \"=4.3.2\"\nsolana-address = \"=2.6.1\"\nsolana-instruction = \"=3.4.0\"\nsolana-instruction-error = \"=2.4.0\"\nsolana-compute-budget-interface = \"=3.0.0\"\nsolana-keypair = \"=3.1.2\"\nsolana-signer = \"=3.0.1\"\nsolana-transaction = { version = \"=4.1.5\", features = [\"wincode\", \"verify\"] }\nsolana-transaction-error = \"=3.3.1\"\n\n[profile.dev]\ndebug = 0\n[profile.test]\ndebug = 0\n"
          },
          {
            "path": "svm/tests/runtime.rs",
            "content": "use anchor_lang::{prelude::Pubkey, AccountDeserialize, AccountSerialize, InstructionData, ToAccountMetas};\nuse litesvm::{LiteSVM, types::TransactionResult};\nuse solana_account::Account;\nuse solana_address::Address;\nuse solana_instruction::{AccountMeta, Instruction};\nuse solana_instruction_error::InstructionError;\nuse solana_compute_budget_interface::ComputeBudgetInstruction;\nuse solana_keypair::Keypair;\nuse solana_signer::Signer;\nuse solana_transaction::Transaction;\nuse solana_transaction_error::TransactionError;\nuse std::path::PathBuf;\n\nconst DOCUMENT:u64 = 42;\nfn addr(key:Pubkey)->Address { Address::new_from_array(key.to_bytes()) }\nfn key(address:Address)->Pubkey { Pubkey::new_from_array(address.to_bytes()) }\n\nfn instruction(program:Pubkey, accounts:impl ToAccountMetas, data:impl InstructionData)->Instruction {\n    Instruction {\n        program_id:addr(program),\n        accounts:accounts.to_account_metas(None).into_iter().map(|m|AccountMeta {\n            pubkey:addr(m.pubkey),is_signer:m.is_signer,is_writable:m.is_writable\n        }).collect(),\n        data:data.data(),\n    }\n}\nfn send(svm:&mut LiteSVM,payer:&Keypair,signers:&[&Keypair],ixs:&[Instruction])->TransactionResult {\n    let tx=Transaction::new_signed_with_payer(ixs,Some(&payer.pubkey()),signers,svm.latest_blockhash());\n    svm.send_transaction(tx)\n}\nstruct Fixture {\n    svm:LiteSVM,\n    payer:Keypair,\n    operator:Keypair,\n    reviewer_signer:Keypair,\n    author:Pubkey,\n    reviewer:Pubkey,\n    proposal:Pubkey,\n}\nimpl Fixture {\n    fn new(gateway:bool,populate:bool)->Self {\n        let base=std::env::var_os(\"SBF_OUT_DIR\").map(PathBuf::from)\n            .unwrap_or_else(||PathBuf::from(env!(\"CARGO_MANIFEST_DIR\")).join(\"../target/deploy\"));\n        let mut svm=LiteSVM::new();\n        svm.add_program_from_file(addr(review_program::ID),base.join(\"review_program.so\"))\n            .expect(\"Build program binary first: bash scripts/run-svm.sh\");\n        svm.add_program_from_file(addr(review_gateway::ID),base.join(\"review_gateway.so\"))\n            .expect(\"Build gateway binary first: bash scripts/run-svm.sh\");\n        // Deterministic local fixtures only, never written to wallet files or used on a network.\n        let payer=Keypair::new_from_array([101;32]);\n        let operator=Keypair::new_from_array([102;32]);\n        let reviewer_signer=Keypair::new_from_array([103;32]);\n        let reviewer=key(reviewer_signer.pubkey());\n        for address in [payer.pubkey(),operator.pubkey(),reviewer_signer.pubkey()] {\n            svm.set_account(address,Account{lamports:1_000_000_000,owner:Address::default(),..Account::default()}).unwrap();\n        }\n        let operator_key=key(operator.pubkey());\n        let author=if gateway {\n            Pubkey::find_program_address(&[b\"review-author\",operator_key.as_ref()],&review_gateway::ID).0\n        } else {operator_key};\n        if gateway {\n            svm.set_account(addr(author),Account{lamports:1_000_000,owner:Address::default(),..Account::default()}).unwrap();\n        }\n        let (proposal,bump)=review_release::address(&author,DOCUMENT).unwrap();\n        if populate {\n            let value=review_program::new_proposal(author,reviewer,DOCUMENT,bump).unwrap();\n            let mut data=Vec::new();value.try_serialize(&mut data).unwrap();\n            svm.set_account(addr(proposal),Account {\n                lamports:svm.minimum_balance_for_rent_exemption(data.len()),\n                data,owner:addr(review_program::ID),executable:false,rent_epoch:0,\n            }).unwrap();\n        }\n        Self{svm,payer,operator,reviewer_signer,author,reviewer,proposal}\n    }\n    fn bytes(&self)->Vec<u8>{self.svm.get_account(&addr(self.proposal)).unwrap().data}\n    fn proposal_state(&self)->review_program::Proposal {\n        review_program::Proposal::try_deserialize(&mut &self.bytes()[..]).unwrap()\n    }\n    fn submit(&self,expected:u64)->Instruction {\n        instruction(review_program::ID,\n            review_program::accounts::Submit{proposal:self.proposal,author:self.author},\n            review_program::instruction::Submit{expected_revision:expected})\n    }\n    fn cpi(&self,sign_pda:bool,fail_after:bool)->Instruction {\n        instruction(review_gateway::ID,\n            review_gateway::accounts::SubmitViaCpi{\n                proposal:self.proposal,author:self.author,operator:key(self.operator.pubkey()),review_program:review_program::ID,\n            },\n            review_gateway::instruction::SubmitViaCpi{expected_revision:0,sign_pda,fail_after})\n    }\n}\n#[test]\nfn initialize_and_submit_execute_the_sbf_program() {\n    let mut f=Fixture::new(false,false);\n    let initialize=instruction(review_program::ID,\n        review_program::accounts::Initialize{\n            proposal:f.proposal,author:f.author,system_program:Pubkey::default(),\n        },\n        review_program::instruction::Initialize{document_id:DOCUMENT,reviewer:f.reviewer});\n    send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[initialize]).unwrap();\n    assert_eq!(f.proposal_state().status,review_program::DRAFT);\n    let ix=f.submit(0);\n    let meta=send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[ix]).unwrap();\n    assert_eq!(f.proposal_state().revision,1);\n    assert_eq!(f.proposal_state().status,review_program::SUBMITTED);\n    assert!(meta.compute_units_consumed>0);\n    println!(\"direct submit CU={}\",meta.compute_units_consumed);\n}\n#[test]\nfn a_declared_account_without_signer_privilege_is_rejected() {\n    let mut f=Fixture::new(false,true);let before=f.bytes();let mut ix=f.submit(0);\n    ix.accounts.iter_mut().find(|m|m.pubkey==addr(f.author)).unwrap().is_signer=false;\n    let failed=send(&mut f.svm,&f.payer,&[&f.payer],&[ix]).unwrap_err();\n    assert!(matches!(failed.err,TransactionError::InstructionError(0,_)));\n    assert_eq!(f.bytes(),before);\n}\n#[test]\nfn wrong_owner_does_not_mutate_the_proposal() {\n    let mut f=Fixture::new(false,true);\n    let mut account=f.svm.get_account(&addr(f.proposal)).unwrap();\n    account.owner=Address::new_from_array([104;32]);\n    let before=account.data.clone();f.svm.set_account(addr(f.proposal),account).unwrap();\n    let ix=f.submit(0);\n    let failed=send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[ix]).unwrap_err();\n    assert!(matches!(failed.err,TransactionError::InstructionError(0,_)));\n    assert_eq!(f.bytes(),before);\n}\n#[test]\nfn readonly_proposal_cannot_be_changed() {\n    let mut f=Fixture::new(false,true);let before=f.bytes();let mut ix=f.submit(0);\n    ix.accounts.iter_mut().find(|m|m.pubkey==addr(f.proposal)).unwrap().is_writable=false;\n    send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[ix]).unwrap_err();\n    assert_eq!(f.bytes(),before);\n}\n#[test]\nfn failed_second_instruction_rolls_back_the_first_instruction() {\n    let mut f=Fixture::new(false,true);let before=f.bytes();\n    let first=f.submit(0);let second=f.submit(0);\n    let failed=send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[first,second]).unwrap_err();\n    // Index 1 proves the first instruction succeeded before the stale-revision failure.\n    assert!(matches!(failed.err,TransactionError::InstructionError(1,_)));\n    assert_eq!(f.bytes(),before);\n    assert_eq!(f.proposal_state().revision,0);\n}\n#[test]\nfn cpi_uses_pda_signature_and_reloads_state() {\n    let mut f=Fixture::new(true,true);let ix=f.cpi(true,false);\n    let meta=send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[ix]).unwrap();\n    assert!(meta.logs.iter().any(|line|line.contains(&format!(\"Program {} invoke [2]\",review_program::ID))));\n    assert_eq!(f.proposal_state().status,review_program::SUBMITTED);\n    assert_eq!(f.proposal_state().revision,1);\n    assert!(meta.compute_units_consumed>0 && meta.compute_units_consumed<200_000);\n    println!(\"gateway + CPI CU={}\",meta.compute_units_consumed);\n}\n#[test]\nfn cpi_without_signer_seeds_cannot_escalate_privilege() {\n    let mut f=Fixture::new(true,true);let before=f.bytes();let ix=f.cpi(false,false);\n    let failed=send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[ix]).unwrap_err();\n    assert!(matches!(failed.err,TransactionError::InstructionError(0,InstructionError::PrivilegeEscalation)));\n    assert_eq!(f.bytes(),before);\n}\n#[test]\nfn cpi_target_is_allowlisted() {\n    let mut f=Fixture::new(true,true);let before=f.bytes();let mut ix=f.cpi(true,false);\n    ix.accounts.iter_mut().find(|m|m.pubkey==addr(review_program::ID)).unwrap().pubkey=addr(review_gateway::ID);\n    send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[ix]).unwrap_err();\n    assert_eq!(f.bytes(),before);\n}\n#[test]\nfn failure_after_successful_cpi_rolls_back_the_callee_write() {\n    let mut f=Fixture::new(true,true);let before=f.bytes();let ix=f.cpi(true,true);\n    let failed=send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[ix]).unwrap_err();\n    assert!(failed.meta.logs.iter().any(|line|line.contains(&format!(\"Program {} success\",review_program::ID))));\n    assert!(matches!(failed.err,TransactionError::InstructionError(0,InstructionError::Custom(6002))));\n    assert_eq!(f.bytes(),before);\n}\n#[test]\nfn tiny_compute_budget_fails_without_committing_state() {\n    let mut f=Fixture::new(false,true);let before=f.bytes();\n    let limit=ComputeBudgetInstruction::set_compute_unit_limit(1);\n    let ix=f.submit(0);\n    let failed=send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[limit,ix]).unwrap_err();\n    assert!(matches!(failed.err,TransactionError::InstructionError(_,InstructionError::ComputationalBudgetExceeded)));\n    assert_eq!(f.bytes(),before);\n}\n\n#[test]\nfn valid_layout_at_the_wrong_pda_is_rejected() {\n    let mut f=Fixture::new(false,true);\n    let account=f.svm.get_account(&addr(f.proposal)).unwrap();\n    f.proposal=Pubkey::new_from_array([105;32]);\n    let before=account.data.clone();f.svm.set_account(addr(f.proposal),account).unwrap();\n    let ix=f.submit(0);\n    send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[ix]).unwrap_err();\n    assert_eq!(f.bytes(),before);\n}\n\n#[test]\nfn reviewer_role_and_both_review_outcomes_are_enforced() {\n    for approve in [false,true] {\n        let mut f=Fixture::new(false,true);let submit=f.submit(0);\n        send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[submit]).unwrap();\n        let before=f.bytes();\n        let wrong=instruction(review_program::ID,\n            review_program::accounts::Review{proposal:f.proposal,reviewer:f.author},\n            review_program::instruction::Review{expected_revision:1,approve});\n        send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[wrong]).unwrap_err();\n        assert_eq!(f.bytes(),before);\n        let review=instruction(review_program::ID,\n            review_program::accounts::Review{proposal:f.proposal,reviewer:f.reviewer},\n            review_program::instruction::Review{expected_revision:1,approve});\n        send(&mut f.svm,&f.payer,&[&f.payer,&f.reviewer_signer],&[review]).unwrap();\n        assert_eq!(f.proposal_state().revision,2);\n        assert_eq!(f.proposal_state().status,if approve{review_program::APPROVED}else{review_program::REJECTED});\n        let terminal=f.bytes();let submit_again=f.submit(2);\n        send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[submit_again]).unwrap_err();\n        assert_eq!(f.bytes(),terminal);\n    }\n}\n#[test]\nfn cancellation_is_allowed_from_draft_or_submitted() {\n    for submitted in [false,true] {\n        let mut f=Fixture::new(false,true);\n        let expected=if submitted {\n            let ix=f.submit(0);send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[ix]).unwrap();1\n        } else {0};\n        let cancel=instruction(review_program::ID,\n            review_program::accounts::Submit{proposal:f.proposal,author:f.author},\n            review_program::instruction::Cancel{expected_revision:expected});\n        send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[cancel]).unwrap();\n        assert_eq!(f.proposal_state().status,review_program::CANCELLED);\n        assert_eq!(f.proposal_state().revision,expected+1);\n    }\n}\n#[test]\nfn a_modified_stored_bump_is_rejected() {\n    let mut f=Fixture::new(false,true);let mut value=f.proposal_state();\n    value.bump^=1;let mut data=Vec::new();value.try_serialize(&mut data).unwrap();\n    let before=data.clone();let mut account=f.svm.get_account(&addr(f.proposal)).unwrap();\n    account.data=data;f.svm.set_account(addr(f.proposal),account).unwrap();\n    let ix=f.submit(0);\n    send(&mut f.svm,&f.payer,&[&f.payer,&f.operator],&[ix]).unwrap_err();\n    assert_eq!(f.bytes(),before);\n}\n"
          },
          {
            "path": "svm/README.md",
            "content": "# Kiểm thử SVM và CPI ngay trong dự án\n\n## Từ host đến binary chạy trong VM\n\nThư mục program chứa chương trình Anchor quản lý proposal. gateway chứa chương trình Anchor thứ hai gọi submit bằng CPI. svm là workspace kiểm thử riêng dùng LiteSVM 0.16.0, không kết nối RPC hay cluster. Các account, số dư và chữ ký đều là fixture trong bộ nhớ; đây không phải ví hay thao tác với tài sản thật.\n\nBa mức kiểm chứng khác nhau:\n\n1. Chạy cargo test --workspace --all-targets ở thư mục gốc để kiểm helper, decoder, indexer và code Anchor sinh trên host.\n2. Chạy cargo test --manifest-path svm/Cargo.toml --no-run để biên dịch harness. Bước này chưa chạy chương trình trong VM.\n3. Build hai binary SBF rồi chạy harness bằng script dưới đây. Chỉ kết quả ở bước này chứng minh các fixture trên đúng binary đã qua SVM.\n\nMáy cần Rust 1.95 trở lên, Cargo, Bash và Python 3. Tool build SBF sử dụng bộ compiler riêng; lệnh tải/khóa phiên bản:\n\n    cargo install cargo-build-sbf --version 4.6.0 --locked\n    bash scripts/run-svm.sh\n\nScript build program và gateway với --arch v2, platform-tools v1.58 vào target/deploy; đặt SBF_OUT_DIR rồi chạy 14 test. Thiếu binary khiến test thất bại rõ ràng, không tự skip và không biến thành PASS. Nếu hệ điều hành hoặc toolchain chưa hỗ trợ, ghi “chưa chạy SVM” cùng nguyên nhân. Không dùng cargo test host thay thế.\n\n## Account, signer và PDA trong harness\n\nFixture::new tạo fee payer và operator bằng seed công khai cố định dùng riêng cho test. LiteSVM set_account nạp account thử; không có lệnh transfer, RPC, airdrop mạng hay deploy. Proposal lấy discriminator/layout từ Anchor AccountSerialize, owner review_program::ID và địa chỉ PDA từ cùng hàm address của client.\n\nBài initialize chạy thực trong SVM: instruction Anchor sinh tạo proposal PDA, sau đó submit thay trạng thái Draft thành Submitted. Các bài âm đổi đúng một yếu tố: bỏ signer privilege của author, đổi owner, đánh dấu proposal readonly hoặc đặt dữ liệu hợp lệ ở địa chỉ khác PDA. Trạng thái trước/sau phải bằng nhau khi bị từ chối. Fee payer tách khỏi author để chữ ký fee payer không vô tình làm ca thiếu signer thành hợp lệ.\n\n## CPI có kiểm soát\n\nGateway derive author PDA bằng seeds [\"review-author\", operator_pubkey] dưới gateway ID. Operator vẫn phải ký. Proposal chứa author PDA này, có owner cố định của review_program và PDA theo document_id. Program<ReviewProgram> kiểm tra target đúng ID và executable, tránh chuyển quyền cho chương trình do caller tự chọn.\n\nCpiContext nhận target Pubkey theo API Anchor 1.2.2; with_signer cung cấp đúng seeds/bump. Runtime cấp signer privilege cho PDA trong lời gọi con, không biến PDA thành khóa riêng. Sau CPI, gateway gọi reload rồi kiểm status và revision để tránh đọc bản deserialize cũ.\n\nHai tham số probe của lab chỉ phục vụ ca âm. sign_pda=false bỏ signer seeds nên runtime phải báo PrivilegeEscalation; operator vẫn bị kiểm Signer. fail_after=true cố ý trả lỗi sau CPI đã thành công. Đây là phép thử rollback, không phải đường bỏ qua quyền.\n\nFixture CPI nạp một proposal Draft có author là PDA để tập trung vào boundary gọi chéo. Việc tạo proposal bằng initialize thông thường được kiểm riêng; triển khai sản phẩm dùng gateway phải thiết kế thêm luồng tạo/funding PDA phù hợp và kiểm như một nghiệp vụ riêng.\n\n## Rollback và ngân sách\n\nMột transaction chứa hai submit cùng expected_revision=0. Bước đầu thành công; bước thứ hai phải lỗi ở instruction index 1 vì revision đã lên 1. Dữ liệu account sau transaction vẫn là Draft/revision0. Không chỉ kiểm “có lỗi”: index 1 chứng minh bước đầu thật sự đã chạy.\n\nCa gateway fail_after chứng minh lời gọi con có log success nhưng account cuối vẫn không đổi. Các chi phí transaction như fee là semantics riêng; assertion rollback chỉ đối chiếu dữ liệu proposal, không khẳng định mọi account hoặc phí đều quay lại.\n\nTest thành công in compute_units_consumed của submit và CPI; một test đặt compute_unit_limit=1 rồi xác nhận ComputationalBudgetExceeded và không commit state. Trần 200.000 CU trong ca thành công là ngân sách rộng của fixture, không phải benchmark mainnet. Lưu CU với version binary/toolchain, không so các phiên bản khác nhau mà thiếu cấu hình.\n\n## Bằng chứng bàn giao\n\nscripts/run-svm.sh giữ log tại target/svm-test.log và sinh target/svm-manifest.json khi mọi test qua. Manifest chứa SHA-256 của hai binary, lockfile và các source chính, cùng phiên bản Rust/build-sbf. Bàn giao thêm IDL tương ứng và ma trận client/schema trước khi xem xét phát hành chương trình.\n\nGiữ svm/Cargo.lock sau lần resolve thành công. Harness pin các Solana crate theo graph của LiteSVM 0.16.0; không thay riêng một dependency bằng SDK latest khác major. Helpers chuyển địa chỉ qua 32 byte giữa kiểu client và VM để ranh giới phiên bản rõ ràng.\n\nCác test còn kiểm reviewer sai, approve/reject, trạng thái kết thúc, cancel từ Draft/Submitted và bump bị sửa. Bài mở rộng: CPI với proposal của operator khác, dữ liệu gần trần, reload candidate binary và so CU. Mạng thật, consensus, finalized source, cluster upgrades và giao dịch tài chính đều ngoài phạm vi fixture này.\n"
          },
          {
            "path": "scripts/run-svm.sh",
            "content": "#!/usr/bin/env bash\nset -euo pipefail\ncd \"$(dirname \"$0\")/..\"\ntask_sbf_output=\"$PWD/target/deploy\"\nmkdir -p \"$task_sbf_output\"\ncargo build-sbf --manifest-path program/Cargo.toml --arch v2 --tools-version v1.58 --sbf-out-dir \"$task_sbf_output\"\ncargo build-sbf --manifest-path gateway/Cargo.toml --arch v2 --tools-version v1.58 --sbf-out-dir \"$task_sbf_output\"\nexport SBF_OUT_DIR=\"$PWD/target/deploy\"\ncargo test --manifest-path svm/Cargo.toml --all-targets -- --nocapture 2>&1 | tee target/svm-test.log\npython3 scripts/svm-manifest.py\n"
          },
          {
            "path": "scripts/svm-manifest.py",
            "content": "import hashlib\nimport json\nimport pathlib\nimport subprocess\n\nroot = pathlib.Path(__file__).resolve().parent.parent\nfiles = [\n    \"target/deploy/review_program.so\",\n    \"target/deploy/review_gateway.so\",\n    \"Cargo.lock\",\n    \"svm/Cargo.lock\",\n    \"program/src/lib.rs\",\n    \"gateway/src/lib.rs\",\n    \"svm/tests/runtime.rs\",\n    \"target/svm-test.log\",\n]\ndigests = {}\nfor relative in files:\n    path = root / relative\n    if not path.is_file():\n        raise SystemExit(f\"Missing evidence: {relative}\")\n    digests[relative] = hashlib.sha256(path.read_bytes()).hexdigest()\nmanifest = {\n    \"scope\": \"local LiteSVM fixtures; no cluster/RPC deployment\",\n    \"litesvm\": \"0.16.0\",\n    \"architecture\": \"sBPF v2\",\n    \"platform_tools\": \"v1.58\",\n    \"rustc\": subprocess.check_output([\"rustc\", \"--version\"], text=True).strip(),\n    \"cargo_build_sbf\": subprocess.check_output([\"cargo\", \"build-sbf\", \"--version\"], text=True).strip(),\n    \"sha256\": digests,\n}\ndestination = root / \"target/svm-manifest.json\"\ndestination.write_text(json.dumps(manifest, indent=2) + \"\\n\")\nprint(destination)\n"
          }
        ],
        "commands": [
          "cargo test --workspace --all-targets",
          "cargo run -p review-release",
          "cargo test --manifest-path svm/Cargo.toml --no-run",
          "bash scripts/run-svm.sh"
        ],
        "checks": [
          "Tám test client/indexer cộng chín test chương trình và test ID của Anchor.",
          "Payload u64 và account metas do framework sinh, không đoán thứ tự.",
          "Hoàn thiện SVM và manifest binary/IDL theo kế hoạch trước khi đạt tiêu chí runtime.",
          "CPI có seeds đúng mới được quyền signer; target cố định và state reload sau lời gọi.",
          "Harness SVM có 14 test signer/owner/PDA/bump/writable/role/transition/rollback/compute; chỉ đánh dấu runtime đạt sau khi chạy binary.",
          "Script lưu log và SHA-256 binary/source/lockfile trong target/svm-manifest.json khi test qua."
        ]
      },
      "simulation": {
        "title": "Indexer gặp lặp và xung đột revision",
        "description": "Quan sát đã đủ mức xác nhận theo fixture. Cùng revision cùng bytes được bỏ qua, khác bytes cần reconcile.",
        "kind": "pipeline",
        "nodes": [
          {
            "id": "source",
            "label": "Nguồn",
            "detail": "Slot và mức xác nhận"
          },
          {
            "id": "decode",
            "label": "Decode",
            "detail": "Metadata và bytes"
          },
          {
            "id": "compare",
            "label": "So revision",
            "detail": "Dedup hoặc conflict"
          },
          {
            "id": "view",
            "label": "View",
            "detail": "State công bố"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Bản ghi lặp đúng",
            "steps": [
              {
                "title": "Nhận snapshot",
                "description": "Nguồn gửi lại revision 2.",
                "activeNodeIds": [
                  "source"
                ],
                "values": [
                  {
                    "label": "revision",
                    "value": "2"
                  },
                  {
                    "label": "finalized",
                    "value": "true"
                  }
                ]
              },
              {
                "title": "Decode",
                "description": "Owner/PDA/layout hợp lệ.",
                "activeNodeIds": [
                  "decode"
                ],
                "values": [
                  {
                    "label": "digest",
                    "value": "A"
                  }
                ]
              },
              {
                "title": "So sánh",
                "description": "View đang revision 2, digest A.",
                "activeNodeIds": [
                  "compare"
                ],
                "values": [
                  {
                    "label": "action",
                    "value": "no-op"
                  }
                ]
              },
              {
                "title": "Giữ view",
                "description": "Không nhân đôi tác dụng hoặc checkpoint giả.",
                "activeNodeIds": [
                  "view"
                ],
                "values": [
                  {
                    "label": "revision",
                    "value": "2"
                  },
                  {
                    "label": "digest",
                    "value": "A"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "Cùng revision khác bytes",
            "steps": [
              {
                "title": "Nhận snapshot",
                "description": "Revision 2 nhưng nội dung khác.",
                "activeNodeIds": [
                  "source"
                ],
                "values": [
                  {
                    "label": "revision",
                    "value": "2"
                  },
                  {
                    "label": "finalized",
                    "value": "true"
                  }
                ]
              },
              {
                "title": "Decode",
                "description": "Cấu trúc hợp lệ nhưng digest B.",
                "activeNodeIds": [
                  "decode"
                ],
                "values": [
                  {
                    "label": "digest",
                    "value": "B"
                  }
                ]
              },
              {
                "title": "Conflict",
                "description": "Không chọn bản đến sau một cách mù quáng.",
                "activeNodeIds": [
                  "compare"
                ],
                "values": [
                  {
                    "label": "action",
                    "value": "reconcile required"
                  }
                ]
              },
              {
                "title": "Giữ view hợp lệ",
                "description": "View cũ không bị ghi đè.",
                "activeNodeIds": [
                  "view"
                ],
                "values": [
                  {
                    "label": "revision",
                    "value": "2"
                  },
                  {
                    "label": "digest",
                    "value": "A"
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
      "id": "blockchain-project-registry",
      "title": "Registry tài liệu có namespace",
      "description": "Dùng SDK Solana cho PDA và kiểm tra cập nhật metadata có revision trên host.",
      "level": "guided",
      "estimatedHours": 10,
      "labLessonId": "blockchain-registry-project",
      "requirements": [
        "Giữ seeds registry-v1, authority bytes và document ID u64 little endian.",
        "Kiểm tra owner, address, canonical bump, actor, quyền mô phỏng và revision độc lập.",
        "Thêm chuyển authority hai bước với quyết định identity bất biến hoặc migration.",
        "Lỗi không đổi record; retry stale được phân biệt với request chưa thực hiện.",
        "Ghi test vector và bảng bằng chứng SDK/host/runtime."
      ],
      "milestones": [
        {
          "title": "Danh tính",
          "tasks": [
            "Chạy sáu test mẫu.",
            "Thêm vector ID lớn và namespace khác."
          ],
          "acceptance": "PDA off-curve, tái tạo bằng bump và không dùng float."
        },
        {
          "title": "Quyền và cập nhật",
          "tasks": [
            "Thêm ca âm mỗi metadata.",
            "Thiết kế chuyển authority và test actor sai."
          ],
          "acceptance": "Mọi lỗi giữ state; seeds cũ/mới được giải thích."
        },
        {
          "title": "Bàn giao",
          "tasks": [
            "Lưu lockfile và fixture.",
            "Lập ma trận constraint với bằng chứng còn thiếu."
          ],
          "acceptance": "Không nhận signer fixture là chữ ký runtime."
        }
      ],
      "testCases": [
        {
          "name": "Namespace",
          "setup": "Đổi program, authority hoặc ID.",
          "expected": "Địa chỉ thay đổi trên test vectors."
        },
        {
          "name": "Bump sai",
          "setup": "Bump khác canonical.",
          "expected": "Bị từ chối độc lập với owner."
        },
        {
          "name": "Quyền",
          "setup": "Actor khác authority hoặc thiếu signer/writable fixture.",
          "expected": "Lỗi trước cập nhật."
        },
        {
          "name": "Retry",
          "setup": "Lặp expected revision sau thành công.",
          "expected": "Stale, digest giữ nguyên."
        },
        {
          "name": "Overflow",
          "setup": "Revision u64::MAX.",
          "expected": "Không commit digest mới."
        }
      ],
      "rubric": [
        {
          "id": "blockchain-registry-id",
          "title": "Danh tính",
          "critical": true,
          "criteria": [
            "Seeds và bytes rõ ràng.",
            "PDA/owner/bump có test riêng."
          ]
        },
        {
          "id": "blockchain-registry-auth",
          "title": "Phân quyền",
          "critical": true,
          "criteria": [
            "Vai trò và chuyển quyền được kiểm tra.",
            "Phân biệt authority với owner."
          ]
        },
        {
          "id": "blockchain-registry-atomic",
          "title": "Tính nguyên tử helper",
          "critical": true,
          "criteria": [
            "Stale/overflow giữ state.",
            "Retry có hợp đồng rõ."
          ]
        },
        {
          "id": "blockchain-registry-evidence",
          "title": "Phạm vi bằng chứng",
          "critical": false,
          "criteria": [
            "Lockfile và test vector có đủ.",
            "Không suy ra quyền SVM từ metadata host."
          ]
        }
      ],
      "deliverables": [
        "Cargo project SDK và tests.",
        "Thiết kế namespace/chuyển authority.",
        "Bảng constraint và bằng chứng từng lớp."
      ]
    },
    {
      "id": "blockchain-project-review",
      "title": "Quy trình duyệt tài liệu Anchor",
      "description": "Hoàn thiện program có author/reviewer, năm trạng thái và account constraints.",
      "level": "independent",
      "estimatedHours": 18,
      "labLessonId": "blockchain-anchor-project",
      "requirements": [
        "Giữ Anchor 1.2.2, PDA theo author bất biến và document ID.",
        "Initialize chặn tự duyệt; Submit/Review/Cancel đúng vai trò và transition.",
        "Revision tăng một khi thành công, checked arithmetic trước mutation.",
        "Kiểm tra layout 82 byte, discriminator, instruction data và account metas.",
        "Thêm event có version và test tương thích decoder; ghi ma trận SVM cần chạy."
      ],
      "milestones": [
        {
          "title": "Luật và account",
          "tasks": [
            "Chạy chín host test.",
            "Đối chiếu mỗi handler với bảng transition."
          ],
          "acceptance": "Terminal state không mở lại; actor sai và stale bị chặn."
        },
        {
          "title": "Layout và client",
          "tasks": [
            "Thêm fixture bytes độc lập.",
            "Kiểm tra event version và metas tối thiểu."
          ],
          "acceptance": "u64 lớn không làm tròn; schema có giới hạn rõ."
        },
        {
          "title": "Runtime readiness",
          "tasks": [
            "Chuẩn bị build SBF và fixture account.",
            "Đưa ca signer/owner/seeds/writable vào harness."
          ],
          "acceptance": "Báo trạng thái từng ca; không thay host PASS cho SVM chưa chạy."
        }
      ],
      "testCases": [
        {
          "name": "Tự duyệt",
          "setup": "Initialize author bằng reviewer.",
          "expected": "Identity error."
        },
        {
          "name": "Sai thứ tự",
          "setup": "Review trước Submit.",
          "expected": "Transition error; state giữ nguyên."
        },
        {
          "name": "Terminal",
          "setup": "Submit sau Approved/Rejected/Cancelled.",
          "expected": "Bị từ chối."
        },
        {
          "name": "Layout",
          "setup": "Tag sai hoặc bytes cắt ngắn.",
          "expected": "Decoder thất bại."
        },
        {
          "name": "Runtime metadata",
          "setup": "SVM fixture thiếu signer/sai owner hoặc PDA.",
          "expected": "Entrypoint từ chối; account bytes không đổi."
        }
      ],
      "rubric": [
        {
          "id": "blockchain-review-state",
          "title": "State machine",
          "critical": true,
          "criteria": [
            "Đủ transition và ca âm.",
            "Revision/overflow không mutate dở dang."
          ]
        },
        {
          "id": "blockchain-review-layout",
          "title": "Layout và code sinh",
          "critical": true,
          "criteria": [
            "Discriminator/INIT_SPACE/bytes có fixture.",
            "Metas chỉ yêu cầu quyền cần thiết."
          ]
        },
        {
          "id": "blockchain-review-runtime",
          "title": "Ràng buộc runtime",
          "critical": true,
          "criteria": [
            "Chạy ca âm trong SVM trên binary đúng digest.",
            "Owner/signer/PDA được kiểm chứng riêng."
          ]
        },
        {
          "id": "blockchain-review-design",
          "title": "Bàn giao thiết kế",
          "critical": false,
          "criteria": [
            "Vai trò, event và schema version rõ.",
            "Giới hạn host/SVM được ghi trung thực."
          ]
        }
      ],
      "deliverables": [
        "Anchor program và host/SVM test source.",
        "IDL/event schema và fixture bytes.",
        "Bảng transition, account constraints và kết quả runtime."
      ]
    },
    {
      "id": "blockchain-project-release",
      "title": "Gói chương trình và client có kiểm chứng",
      "description": "Ghép program, instruction builder, decoder, indexer và manifest; hoàn tất kiểm thử SVM trước bàn giao.",
      "level": "capstone",
      "estimatedHours": 32,
      "labLessonId": "blockchain-release-project",
      "requirements": [
        "Builder dùng code Anchor sinh, giữ u64 và đúng program/account role.",
        "Decoder kiểm tra owner/address/bump/layout/state trước nhận snapshot.",
        "Indexer phân biệt tentative/finalized, dedup, conflict, gap và reconcile; checkpoint sau commit.",
        "Manifest nối commit, Cargo.lock, toolchain, IDL và SHA-256 binary đã test.",
        "Chạy harness LiteSVM có sẵn trên hai binary SBF; đối chiếu signer, owner, PDA, rollback, CPI và budget.",
        "Diễn tập migration/rollback trên fixture; không gửi giao dịch mạng trong lab.",
        "Gateway CPI ràng buộc operator, signer PDA, target allowlist và postcondition sau reload."
      ],
      "milestones": [
        {
          "title": "Host package",
          "tasks": [
            "Chạy workspace tests.",
            "Bổ sung event/indexer persistence có transaction."
          ],
          "acceptance": "Bytes/metas đúng, conflict không ghi đè, checkpoint không vượt view."
        },
        {
          "title": "Binary và SVM",
          "tasks": [
            "Cài/báo phiên bản build-sbf rồi chạy scripts/run-svm.sh.",
            "Đọc và mở rộng 14 test trong svm/tests/runtime.rs; giữ fixture âm đúng một điều kiện.",
            "Đối chiếu CPI có/thiếu seeds, target sai và rollback sau callee success."
          ],
          "acceptance": "Có log và manifest digest hai binary; quyền, transition, rollback, CPI và CU được kiểm trên SVM. Compile --no-run không được thay kết quả thực thi."
        },
        {
          "title": "Phát hành có phạm vi",
          "tasks": [
            "Ghép manifest IDL/binary/toolchain.",
            "Diễn tập migration và reconcile nguồn."
          ],
          "acceptance": "Reviewer tái lập được; các mục mạng/cluster chưa kiểm thử được nêu rõ."
        }
      ],
      "testCases": [
        {
          "name": "Metas",
          "setup": "Submit plan với revision u64 lớn.",
          "expected": "Proposal writable, author signer readonly; bytes nguyên vẹn."
        },
        {
          "name": "Indexer lặp/xung đột",
          "setup": "Cùng revision cùng bytes rồi khác bytes.",
          "expected": "No-op rồi conflict; view hợp lệ giữ nguyên."
        },
        {
          "name": "Gap",
          "setup": "Revision nhảy từ 0 lên 2.",
          "expected": "Yêu cầu reconcile snapshot, không suy diễn event thiếu."
        },
        {
          "name": "Rollback SVM",
          "setup": "Transaction có bước đầu hợp lệ và bước sau lỗi.",
          "expected": "Account state trở lại snapshot trước transaction."
        },
        {
          "name": "Migration",
          "setup": "Binary/schema/client cũ và mới trên fixture.",
          "expected": "Chỉ tổ hợp hỗ trợ được chấp nhận; rollback được diễn giải theo schema."
        },
        {
          "name": "CPI privilege và postcondition",
          "setup": "Cùng gateway fixture: seeds đúng, bỏ seeds, target sai và lỗi sau callee success.",
          "expected": "Chỉ seeds/target hợp lệ thành công; sau CPI reload thấy state mới, còn lỗi cuối rollback toàn bộ dữ liệu proposal."
        }
      ],
      "rubric": [
        {
          "id": "blockchain-release-client",
          "title": "Client và decoder",
          "critical": true,
          "criteria": [
            "Code sinh đúng quyền/bytes.",
            "Metadata và dữ liệu kiểm tra độc lập."
          ]
        },
        {
          "id": "blockchain-release-index",
          "title": "Indexer phục hồi",
          "critical": true,
          "criteria": [
            "Dedup/conflict/gap có test.",
            "Checkpoint và reconcile giữ tính nhất quán."
          ]
        },
        {
          "id": "blockchain-release-svm",
          "title": "Bằng chứng runtime",
          "critical": true,
          "criteria": [
            "SBF digest gắn test SVM.",
            "Quyền, rollback và compute có kết quả thực.",
            "CPI allowlist/seeds/reload và rollback sau callee success có test trên hai binary."
          ]
        },
        {
          "id": "blockchain-release-manifest",
          "title": "Bàn giao và nâng cấp",
          "critical": true,
          "criteria": [
            "Manifest source/IDL/binary/toolchain đầy đủ.",
            "Migration, giới hạn và runbook được kiểm tra."
          ]
        }
      ],
      "deliverables": [
        "Cargo workspace program/client/indexer và tests.",
        "Binary/IDL manifest cùng kết quả SVM, fixture account.",
        "Ma trận quyền, threat model, migration và runbook reconcile.",
        "Gateway CPI, LiteSVM harness pinned, SBF log và manifest hai binary."
      ]
    }
  ],
  "assessment": {
    "title": "Đánh giá năng lực chương trình blockchain",
    "instructions": "Trả lời tình huống rồi nộp bằng chứng ba dự án. Phân biệt host logic, code sinh và runtime SVM. Thiếu test signer/owner/PDA/rollback vẫn là thiếu tiêu chí bắt buộc dù điểm câu hỏi đạt; không coi tự đánh giá là audit bảo mật.",
    "passPercent": 80,
    "questions": [
      {
        "id": "blockchain-exam-01",
        "question": "Account owner đúng, signer hợp lệ nhưng authority khác. Có được cập nhật?",
        "options": [
          "Có vì có chữ ký.",
          "Không; quan hệ quyền nghiệp vụ vẫn phải đúng.",
          "Có vì cùng discriminator."
        ],
        "correct": 1,
        "explanation": "Owner và chữ ký không thay thế kiểm tra authority lưu trong account.",
        "lessonIds": [
          "blockchain-trust-boundaries"
        ]
      },
      {
        "id": "blockchain-exam-02",
        "question": "Client dùng float để mã hóa revision gần u64::MAX. Rủi ro chính?",
        "options": [
          "Chỉ tốn thêm compute.",
          "Không có vì Rust dùng u64.",
          "Mất chính xác số nguyên và tạo instruction khác ý định."
        ],
        "correct": 2,
        "explanation": "Mất dữ liệu có thể xảy ra trước khi bytes đến Rust; giữ kiểu số nguyên lớn xuyên suốt.",
        "lessonIds": [
          "blockchain-serialization"
        ]
      },
      {
        "id": "blockchain-exam-03",
        "question": "Authority là seed nhưng muốn chuyển quyền. Cần quyết định gì?",
        "options": [
          "Identity bất biến với quyền riêng hoặc migration account mới.",
          "Chỉ sửa trường authority là luôn đủ.",
          "Bỏ kiểm tra seeds."
        ],
        "correct": 0,
        "explanation": "Địa chỉ dẫn xuất không tự thay theo field; thiết kế chuyển quyền phải giữ quan hệ identity.",
        "lessonIds": [
          "blockchain-authority"
        ]
      },
      {
        "id": "blockchain-exam-04",
        "question": "SDK derive PDA thành công. Điều nào chưa được chứng minh?",
        "options": [
          "Địa chỉ được dẫn xuất từ input SDK.",
          "Bump tái tạo đúng theo test.",
          "Account đã tồn tại và actor có quyền runtime."
        ],
        "correct": 2,
        "explanation": "Dẫn xuất địa chỉ là phép tính; tạo và ủy quyền account là bước khác.",
        "lessonIds": [
          "blockchain-registry-project"
        ]
      },
      {
        "id": "blockchain-exam-05",
        "question": "Helper sửa status rồi checked_add revision thất bại. Vấn đề gì?",
        "options": [
          "Result tự rollback mọi field.",
          "State host có thể bị mutate dở dang; tính trước rồi commit.",
          "Không quan trọng vì chỉ test host."
        ],
        "correct": 1,
        "explanation": "Result không tự hoàn tác mutation trong Rust; helper cần hợp đồng nguyên tử riêng.",
        "lessonIds": [
          "blockchain-state-machines"
        ]
      },
      {
        "id": "blockchain-exam-06",
        "question": "Host serialization/metas PASS. Có thể nhận signer/seeds runtime đã được kiểm thử?",
        "options": [
          "Chưa; cần entrypoint SBF chạy trong SVM.",
          "Có vì macro biên dịch.",
          "Có nếu program ID là fixture cố định."
        ],
        "correct": 0,
        "explanation": "Biên dịch và kiểm tra code sinh không thực thi kiểm tra runtime.",
        "lessonIds": [
          "blockchain-anchor-project"
        ]
      },
      {
        "id": "blockchain-exam-07",
        "question": "CPI program ID do caller tùy chọn. Chương trình nên kiểm tra gì?",
        "options": [
          "Chỉ độ dài instruction.",
          "Không cần vì CPI luôn an toàn.",
          "Allowlist/địa chỉ chương trình, executable và account roles theo hợp đồng."
        ],
        "correct": 2,
        "explanation": "CPI mở ranh giới tin cậy; callee phải đúng chương trình và quyền mong đợi.",
        "lessonIds": [
          "blockchain-capabilities"
        ]
      },
      {
        "id": "blockchain-exam-08",
        "question": "Loop nhận Vec không giới hạn. Chọn giải pháp bền vững?",
        "options": [
          "Giới hạn dữ liệu/công việc, phân trang và đo SVM.",
          "Luôn tăng budget.",
          "Chỉ benchmark helper CPU."
        ],
        "correct": 0,
        "explanation": "Ngân sách hữu hạn cần thuật toán có chặn trên; CPU time không phải CU.",
        "lessonIds": [
          "blockchain-compute-budget"
        ]
      },
      {
        "id": "blockchain-exam-09",
        "question": "Snapshot finalized cùng revision khác digest xuất hiện. Indexer nên làm gì?",
        "options": [
          "Luôn ghi bản mới nhất đến.",
          "Báo conflict và reconcile, giữ view trước.",
          "Bỏ revision khỏi schema."
        ],
        "correct": 1,
        "explanation": "Cùng revision khác nội dung vi phạm hợp đồng và cần điều tra nguồn hoặc bug.",
        "lessonIds": [
          "blockchain-indexing"
        ]
      },
      {
        "id": "blockchain-exam-10",
        "question": "Rollback binary sau migration schema có thể thất bại vì sao?",
        "options": [
          "Binary cũ có thể không đọc được dữ liệu mới.",
          "Program ID không bao giờ giữ nguyên.",
          "Cargo.lock luôn tự migrate."
        ],
        "correct": 0,
        "explanation": "Rollback phải xét dữ liệu, không chỉ bytes chương trình.",
        "lessonIds": [
          "blockchain-upgrades"
        ]
      },
      {
        "id": "blockchain-exam-11",
        "question": "Một test làm sai owner và signer cùng lúc rồi bị từ chối. Đủ bằng chứng chưa?",
        "options": [
          "Đủ cho cả hai kiểm tra.",
          "Không cần test âm.",
          "Chưa; cần ca riêng để tránh lỗi sớm che ràng buộc còn thiếu."
        ],
        "correct": 2,
        "explanation": "Mỗi constraint cần test độc lập và so state trước/sau.",
        "lessonIds": [
          "blockchain-threat-model"
        ]
      },
      {
        "id": "blockchain-exam-12",
        "question": "Capstone chưa có SVM rollback result nhưng mọi host test đạt. Readiness thế nào?",
        "options": [
          "Đã đủ cho mọi triển khai.",
          "Còn thiếu tiêu chí runtime bắt buộc.",
          "Chỉ thiếu logo."
        ],
        "correct": 1,
        "explanation": "Phải nối binary digest với kết quả thực thi SVM; host tests không thay thế.",
        "lessonIds": [
          "blockchain-release-project"
        ]
      }
    ],
    "skills": [
      {
        "id": "blockchain-skill-1",
        "title": "Account và ranh giới tin cậy",
        "description": "Kiểm tra owner, signer và authority riêng. Mã hóa u64 không mất chính xác. Phân biệt host với runtime enforcement.",
        "lessonIds": [
          "blockchain-accounts",
          "blockchain-trust-boundaries",
          "blockchain-serialization"
        ],
        "projectIds": [
          "blockchain-project-registry"
        ],
        "required": true
      },
      {
        "id": "blockchain-skill-2",
        "title": "PDA và phân quyền",
        "description": "Derive PDA bằng SDK. Kiểm tra canonical bump và owner. Thiết kế chuyển authority không phá identity.",
        "lessonIds": [
          "blockchain-pda",
          "blockchain-authority",
          "blockchain-registry-project"
        ],
        "projectIds": [
          "blockchain-project-registry"
        ],
        "required": true
      },
      {
        "id": "blockchain-skill-3",
        "title": "Chương trình Anchor và state machine",
        "description": "Viết bảng transition và vai trò. Kiểm thử lỗi không mutate helper. Kiểm tra layout và code sinh Anchor.",
        "lessonIds": [
          "blockchain-anchor-state",
          "blockchain-state-machines",
          "blockchain-anchor-project"
        ],
        "projectIds": [
          "blockchain-project-review"
        ],
        "required": true
      },
      {
        "id": "blockchain-skill-4",
        "title": "CPI và ngân sách thực thi",
        "description": "Allowlist program/account theo vai trò. Kiểm tra privilege và dữ liệu sau CPI. Đo ngân sách trong môi trường SVM.",
        "lessonIds": [
          "blockchain-cpi",
          "blockchain-capabilities",
          "blockchain-compute-budget",
          "blockchain-release-project"
        ],
        "projectIds": [
          "blockchain-project-release"
        ],
        "required": true
      },
      {
        "id": "blockchain-skill-5",
        "title": "Client, indexer và nâng cấp",
        "description": "Dedup, conflict và reconcile. Tách tentative khỏi trạng thái công bố. Lập ma trận binary/schema/client.",
        "lessonIds": [
          "blockchain-transactions",
          "blockchain-indexing",
          "blockchain-upgrades"
        ],
        "projectIds": [
          "blockchain-project-release"
        ],
        "required": true
      },
      {
        "id": "blockchain-skill-6",
        "title": "Review, kiểm thử và bàn giao",
        "description": "Mỗi constraint có ca âm riêng. Liên kết source/IDL/binary và kết quả. Chạy SVM trước khi tự đánh giá runtime đạt.",
        "lessonIds": [
          "blockchain-testing-release",
          "blockchain-threat-model",
          "blockchain-release-project"
        ],
        "projectIds": [
          "blockchain-project-release"
        ],
        "required": true
      }
    ]
  }
};
