import type { Lesson } from "./curriculum";

export const systemLessons: Lesson[] = [
  {
    "id": "box",
    "moduleId": "smart",
    "title": "Box: Sở hữu dữ liệu trên heap",
    "description": "Biểu diễn cấu trúc đệ quy bằng một lớp gián tiếp có kích thước xác định.",
    "duration": 25,
    "objectives": [
      "Giải thích vai trò của Box<T>",
      "Tạo kiểu dữ liệu đệ quy có kích thước hữu hạn",
      "Duyệt dữ liệu qua tham chiếu mà không chuyển quyền sở hữu"
    ],
    "sections": [
      {
        "title": "Một chủ sở hữu, một vùng cấp phát",
        "text": "Box<T> sở hữu một giá trị trên heap. Khi Box bị hủy, giá trị bên trong cũng được dọn dẹp. Di chuyển Box chuyển quyền sở hữu; nó không tự sao chép sâu dữ liệu. Toán tử * và deref coercion giúp truy cập giá trị được trỏ tới.",
        "code": "let value = Box::new(42);\nassert_eq!(*value, 42);"
      },
      {
        "title": "Ngắt vòng lặp kích thước",
        "text": "Một enum chứa trực tiếp một giá trị cùng kiểu sẽ cần kích thước vô hạn. Thay trường đệ quy bằng Box tạo một lớp gián tiếp: kích thước của con trỏ đã xác định, còn phần tiếp theo nằm ở vùng cấp phát riêng.",
        "code": "enum Chain {\n    Link(i32, Box<Chain>),\n    End,\n}"
      },
      {
        "title": "Mượn để duyệt",
        "text": "Hàm nhận &Chain có thể dùng match để đọc từng nút. Với một nút Link, hãy cộng giá trị hiện tại và gọi lại hàm cho phần còn lại. Đệ quy phù hợp với ví dụ ngắn; danh sách rất sâu nên được duyệt lặp để tránh dùng quá nhiều stack."
      }
    ],
    "tip": "Box không làm mọi chương trình nhanh hơn. Chọn nó khi mô hình sở hữu hoặc kích thước kiểu cần một lớp gián tiếp.",
    "exercise": {
      "title": "Cộng một chuỗi nút",
      "instructions": "Hoàn thiện sum để tính tổng các nút Link; End có tổng bằng 0. Không lấy quyền sở hữu của chuỗi.",
      "requirements": [
        "Nhận &Chain",
        "Dùng match cho cả Link và End",
        "Giữ các assertion kiểm tra chuỗi rỗng và nhiều nút"
      ]
    },
    "starterCode": "enum Chain {\n    Link(i32, Box<Chain>),\n    End,\n}\n\nfn sum(chain: &Chain) -> i32 {\n    todo!(\"Cộng giá trị từng nút bằng match\")\n}\n\nfn main() {\n    let chain = Chain::Link(3, Box::new(Chain::Link(7, Box::new(Chain::End))));\n    assert_eq!(sum(&Chain::End), 0);\n    assert_eq!(sum(&chain), 10);\n    assert_eq!(sum(&chain), 10);\n    println!(\"Tổng danh sách: {}\", sum(&chain));\n}",
    "solutionCode": "enum Chain {\n    Link(i32, Box<Chain>),\n    End,\n}\n\nfn sum(chain: &Chain) -> i32 {\n    match chain {\n        Chain::End => 0,\n        Chain::Link(value, next) => value + sum(next),\n    }\n}\n\nfn main() {\n    let chain = Chain::Link(3, Box::new(Chain::Link(7, Box::new(Chain::End))));\n    assert_eq!(sum(&Chain::End), 0);\n    assert_eq!(sum(&chain), 10);\n    assert_eq!(sum(&chain), 10);\n    println!(\"Tổng danh sách: {}\", sum(&chain));\n}",
    "expectedOutput": "Tổng danh sách: 10\n",
    "hints": [
      "End trả 0; Link có một giá trị và phần còn lại.",
      "Trong nhánh Link(value, next), cộng value với sum(next)."
    ],
    "quiz": {
      "question": "Vì sao trường đệ quy thường được đặt trong Box?",
      "options": [
        "Để mọi truy cập trở thành bất đồng bộ",
        "Để tạo lớp gián tiếp có kích thước xác định",
        "Để tự sao chép toàn bộ cây",
        "Để bỏ quy tắc sở hữu"
      ],
      "correct": 1,
      "explanation": "Box cho phép kiểu bên ngoài có kích thước hữu hạn dù cấu trúc dữ liệu có thể tiếp tục ở heap."
    },
    "reference": {
      "label": "The Rust Book · Box<T>",
      "url": "https://doc.rust-lang.org/book/ch15-01-box.html"
    }
  },
  {
    "id": "rc",
    "moduleId": "smart",
    "title": "Rc: Nhiều nơi cùng sở hữu",
    "description": "Chia sẻ một vùng dữ liệu trong cùng một luồng và theo dõi số chủ sở hữu.",
    "duration": 25,
    "objectives": [
      "Tạo và clone một Rc<T>",
      "Phân biệt clone con trỏ với clone dữ liệu",
      "Quan sát strong_count thay đổi khi drop"
    ],
    "sections": [
      {
        "title": "Chia sẻ quyền sở hữu có chủ đích",
        "text": "Rc<T> dùng bộ đếm để cho nhiều giá trị Rc cùng giữ một T. Dữ liệu được hủy khi số tham chiếu mạnh về 0. Rc phù hợp với cấu trúc dùng chung trong một luồng, chẳng hạn nhiều nút cùng trỏ đến một cấu hình."
      },
      {
        "title": "Clone một handle",
        "text": "Rc::clone(&value) tăng bộ đếm mạnh và trả một handle cùng vùng dữ liệu. Nó không gọi clone trên T. Rc::ptr_eq kiểm tra hai handle có cùng trỏ đến một vùng cấp phát; phép so sánh giá trị chỉ kiểm tra nội dung.",
        "code": "use std::rc::Rc;\nlet a = Rc::new(String::from(\"Rust\"));\nlet b = Rc::clone(&a);\nassert!(Rc::ptr_eq(&a, &b));"
      },
      {
        "title": "Giới hạn của Rc",
        "text": "Rc không đồng bộ bộ đếm giữa các luồng và không triển khai Send hoặc Sync. Nó cũng không tự cho quyền sửa dữ liệu dùng chung. Hãy chọn mô hình khác khi cần sửa hoặc chuyển dữ liệu giữa luồng, thay vì thêm clone cho đến khi hết lỗi."
      }
    ],
    "tip": "Viết Rc::clone(&handle) giúp người đọc thấy ngay bạn đang nhân bản handle, không sao chép sâu dữ liệu.",
    "exercise": {
      "title": "Chia sẻ danh sách nhãn",
      "instructions": "Hoàn thiện share để trả hai Rc cùng sở hữu danh sách đã nhận. Không tạo Vec mới.",
      "requirements": [
        "Hai kết quả cùng vùng cấp phát với original",
        "Sau share có ba chủ sở hữu mạnh",
        "Sau drop một kết quả còn hai chủ sở hữu"
      ]
    },
    "starterCode": "use std::rc::Rc;\n\nfn share(labels: Rc<Vec<String>>) -> (Rc<Vec<String>>, Rc<Vec<String>>) {\n    todo!(\"Trả hai handle dùng chung dữ liệu\")\n}\n\nfn main() {\n    let original = Rc::new(vec![String::from(\"Rust\"), String::from(\"Việt\")]);\n    let (first, second) = share(Rc::clone(&original));\n    assert!(Rc::ptr_eq(&original, &first));\n    assert!(Rc::ptr_eq(&first, &second));\n    assert_eq!(Rc::strong_count(&original), 3);\n    drop(first);\n    assert_eq!(Rc::strong_count(&original), 2);\n    assert_eq!(second[0], \"Rust\");\n    println!(\"Số chủ sở hữu: {}\", Rc::strong_count(&original));\n}",
    "solutionCode": "use std::rc::Rc;\n\nfn share(labels: Rc<Vec<String>>) -> (Rc<Vec<String>>, Rc<Vec<String>>) {\n    (Rc::clone(&labels), labels)\n}\n\nfn main() {\n    let original = Rc::new(vec![String::from(\"Rust\"), String::from(\"Việt\")]);\n    let (first, second) = share(Rc::clone(&original));\n    assert!(Rc::ptr_eq(&original, &first));\n    assert!(Rc::ptr_eq(&first, &second));\n    assert_eq!(Rc::strong_count(&original), 3);\n    drop(first);\n    assert_eq!(Rc::strong_count(&original), 2);\n    assert_eq!(second[0], \"Rust\");\n    println!(\"Số chủ sở hữu: {}\", Rc::strong_count(&original));\n}",
    "expectedOutput": "Số chủ sở hữu: 2\n",
    "hints": [
      "Giữ một handle đã nhận làm phần tử thứ hai.",
      "Tạo phần tử thứ nhất bằng Rc::clone(&labels)."
    ],
    "quiz": {
      "question": "Rc::clone(&data) làm gì?",
      "options": [
        "Luôn sao chép sâu data",
        "Tăng số handle sở hữu cùng vùng dữ liệu",
        "Biến dữ liệu thành mut",
        "Cho phép dùng Rc giữa mọi luồng"
      ],
      "correct": 1,
      "explanation": "Rc::clone tăng bộ đếm mạnh; nó không nhân bản T."
    },
    "reference": {
      "label": "The Rust Book · Rc<T>",
      "url": "https://doc.rust-lang.org/book/ch15-04-rc.html"
    }
  },
  {
    "id": "refcell",
    "moduleId": "smart",
    "title": "RefCell: Kiểm tra việc mượn khi chạy",
    "description": "Thay đổi nội dung qua &self nhưng vẫn giữ quy tắc mượn rõ ràng.",
    "duration": 30,
    "objectives": [
      "Dùng borrow và borrow_mut",
      "Giải thích interior mutability",
      "Xử lý xung đột bằng try_borrow_mut"
    ],
    "sections": [
      {
        "title": "Nội dung có thể thay đổi qua &self",
        "text": "RefCell<T> giữ quy tắc nhiều lượt mượn đọc hoặc một lượt mượn sửa, nhưng kiểm tra khi chạy. Cách này hữu ích khi API cần &self còn trạng thái bên trong vẫn phải cập nhật. RefCell không khiến mọi cách truy cập đều hợp lệ."
      },
      {
        "title": "Guard giữ lượt mượn",
        "text": "borrow trả Ref<T>; borrow_mut trả RefMut<T>. Lượt mượn còn hoạt động trong thời gian guard tồn tại. Nếu đang giữ guard đọc mà gọi borrow_mut, chương trình panic. Dùng phạm vi nhỏ hoặc drop guard khi đã xong.",
        "code": "use std::cell::RefCell;\nlet values = RefCell::new(vec![1]);\n{\n    let mut guard = values.borrow_mut();\n    guard.push(2);\n}\nassert_eq!(values.borrow().len(), 2);"
      },
      {
        "title": "Thử mượn khi xung đột có thể xảy ra",
        "text": "try_borrow và try_borrow_mut trả Result thay vì panic khi quy tắc mượn chưa cho phép. Chúng không bỏ qua quy tắc. RefCell không phải cơ chế đồng bộ để nhiều luồng cùng truy cập; trong trường hợp đó hãy học Mutex."
      }
    ],
    "tip": "Đừng giữ RefMut lâu hơn cần thiết. Guard nhỏ giúp tránh cả panic lẫn thiết kế khó hiểu.",
    "exercise": {
      "title": "Bảng điểm cập nhật qua &self",
      "instructions": "Hoàn thiện add và total của ScoreBoard. Trường points đã dùng RefCell nên add không cần &mut self.",
      "requirements": [
        "add mượn sửa và thêm điểm",
        "total chỉ mượn đọc",
        "Kiểm tra try_borrow_mut khi guard đọc còn sống"
      ]
    },
    "starterCode": "use std::cell::RefCell;\n\nstruct ScoreBoard { points: RefCell<Vec<u32>> }\n\nimpl ScoreBoard {\n    fn add(&self, point: u32) {\n        todo!(\"Mượn sửa danh sách và thêm point\");\n    }\n    fn total(&self) -> u32 {\n        todo!(\"Mượn đọc và tính tổng\")\n    }\n}\n\nfn main() {\n    let board = ScoreBoard { points: RefCell::new(Vec::new()) };\n    assert_eq!(board.total(), 0);\n    board.add(3);\n    board.add(7);\n    let reading = board.points.borrow();\n    assert!(board.points.try_borrow_mut().is_err());\n    drop(reading);\n    assert!(board.points.try_borrow_mut().is_ok());\n    assert_eq!(board.total(), 10);\n    println!(\"Tổng điểm: {}\", board.total());\n}",
    "solutionCode": "use std::cell::RefCell;\n\nstruct ScoreBoard { points: RefCell<Vec<u32>> }\n\nimpl ScoreBoard {\n    fn add(&self, point: u32) {\n        self.points.borrow_mut().push(point);\n    }\n    fn total(&self) -> u32 {\n        self.points.borrow().iter().sum()\n    }\n}\n\nfn main() {\n    let board = ScoreBoard { points: RefCell::new(Vec::new()) };\n    assert_eq!(board.total(), 0);\n    board.add(3);\n    board.add(7);\n    let reading = board.points.borrow();\n    assert!(board.points.try_borrow_mut().is_err());\n    drop(reading);\n    assert!(board.points.try_borrow_mut().is_ok());\n    assert_eq!(board.total(), 10);\n    println!(\"Tổng điểm: {}\", board.total());\n}",
    "expectedOutput": "Tổng điểm: 10\n",
    "hints": [
      "add có thể dùng self.points.borrow_mut().push(point).",
      "Guard đọc hết hiệu lực sau drop(reading), lúc đó có thể mượn sửa."
    ],
    "quiz": {
      "question": "try_borrow_mut trả lỗi khi nào?",
      "options": [
        "Khi một guard đọc hoặc sửa xung đột vẫn còn sống",
        "Chỉ khi Vec rỗng",
        "Luôn luôn với &self",
        "Chỉ khi chương trình có nhiều luồng"
      ],
      "correct": 0,
      "explanation": "RefCell kiểm tra trạng thái mượn. try_borrow_mut báo lỗi khi chưa thể cấp một lượt mượn sửa độc quyền."
    },
    "reference": {
      "label": "The Rust Book · RefCell<T>",
      "url": "https://doc.rust-lang.org/book/ch15-05-interior-mutability.html"
    }
  },
  {
    "id": "weak",
    "moduleId": "smart",
    "title": "Weak: Tham chiếu không giữ dữ liệu sống",
    "description": "Tránh vòng sở hữu và xử lý việc đối tượng được tham chiếu đã bị hủy.",
    "duration": 30,
    "objectives": [
      "Tạo Weak bằng Rc::downgrade",
      "Dùng upgrade để lấy Option<Rc<T>>",
      "Phân biệt quan hệ sở hữu với liên kết ngược"
    ],
    "sections": [
      {
        "title": "Vòng sở hữu không tự biến mất",
        "text": "Nếu A giữ Rc đến B và B giữ Rc đến A, cả hai bộ đếm mạnh có thể không về 0. Rust ngăn nhiều lỗi bộ nhớ nhưng không cấm mọi rò rỉ. Vì vậy, hãy xác định cạnh nào thật sự sở hữu dữ liệu, cạnh nào chỉ tham chiếu."
      },
      {
        "title": "Weak quan sát mà không giữ T sống",
        "text": "Rc::downgrade tạo Weak<T> và không tăng strong_count. Một Weak có thể còn tồn tại sau khi T đã bị hủy. upgrade trả Some(Rc<T>) khi dữ liệu còn sống, hoặc None khi không còn chủ sở hữu mạnh.",
        "code": "use std::rc::Rc;\nlet owner = Rc::new(42);\nlet observer = Rc::downgrade(&owner);\ndrop(owner);\nassert!(observer.upgrade().is_none());"
      },
      {
        "title": "Liên kết con đến cha",
        "text": "Trong cây, cha thường sở hữu các nút con còn liên kết ngược từ con đến cha dùng Weak. Khi đọc cha, cần xử lý None. Weak không bảo đảm nút cha luôn còn sống; chính Option buộc API thể hiện khả năng này."
      }
    ],
    "tip": "Vẽ các mũi tên sở hữu trước khi chọn Rc hay Weak. Không phải mọi liên kết đều nên kéo dài tuổi thọ dữ liệu.",
    "exercise": {
      "title": "Tìm tên nút cha",
      "instructions": "Hoàn thiện parent_name để trả tên cha khi upgrade thành công. Sau khi drop nút cha, hàm phải trả None.",
      "requirements": [
        "Không unwrap kết quả upgrade",
        "Không giữ Rc cha lâu hơn lời gọi",
        "Kết quả thay đổi đúng khi owner cha bị drop"
      ]
    },
    "starterCode": "use std::rc::{Rc, Weak};\n\nstruct Node {\n    name: String,\n    parent: Weak<Node>,\n}\n\nfn parent_name(node: &Node) -> Option<String> {\n    todo!(\"Upgrade rồi lấy tên nếu cha vẫn sống\")\n}\n\nfn main() {\n    let root = Rc::new(Node { name: String::from(\"Gốc\"), parent: Weak::new() });\n    let child = Node { name: String::from(\"Con\"), parent: Rc::downgrade(&root) };\n    assert_eq!(Rc::strong_count(&root), 1);\n    assert_eq!(parent_name(&child), Some(String::from(\"Gốc\")));\n    drop(root);\n    assert_eq!(parent_name(&child), None);\n    println!(\"Nút cha còn tồn tại: {}\", parent_name(&child).is_some());\n}",
    "solutionCode": "use std::rc::{Rc, Weak};\n\nstruct Node {\n    name: String,\n    parent: Weak<Node>,\n}\n\nfn parent_name(node: &Node) -> Option<String> {\n    node.parent.upgrade().map(|parent| parent.name.clone())\n}\n\nfn main() {\n    let root = Rc::new(Node { name: String::from(\"Gốc\"), parent: Weak::new() });\n    let child = Node { name: String::from(\"Con\"), parent: Rc::downgrade(&root) };\n    assert_eq!(Rc::strong_count(&root), 1);\n    assert_eq!(parent_name(&child), Some(String::from(\"Gốc\")));\n    drop(root);\n    assert_eq!(parent_name(&child), None);\n    println!(\"Nút cha còn tồn tại: {}\", parent_name(&child).is_some());\n}",
    "expectedOutput": "Nút cha còn tồn tại: false\n",
    "hints": [
      "upgrade trả Option nên bạn có thể dùng map.",
      "Trong map, clone tên String để kết quả không mượn một Rc tạm thời."
    ],
    "quiz": {
      "question": "Weak::upgrade trả gì sau khi mọi Rc mạnh đã bị drop?",
      "options": [
        "Một Rc rỗng",
        "None",
        "Một bản sao mới của dữ liệu",
        "Luôn panic"
      ],
      "correct": 1,
      "explanation": "Weak không giữ T sống. Khi không còn chủ sở hữu mạnh, upgrade trả None."
    },
    "reference": {
      "label": "The Rust Book · Reference Cycles",
      "url": "https://doc.rust-lang.org/book/ch15-06-reference-cycles.html"
    }
  },
  {
    "id": "lifetime-struct",
    "moduleId": "lifetimes",
    "title": "Lifetime trong struct chứa tham chiếu",
    "description": "Thiết kế một góc nhìn dữ liệu không sở hữu và trả tham chiếu đúng tuổi thọ.",
    "duration": 30,
    "objectives": [
      "Khai báo struct có tham chiếu với lifetime",
      "Liên hệ tuổi thọ struct với dữ liệu gốc",
      "Trả &str mượn từ dữ liệu thay vì clone String"
    ],
    "sections": [
      {
        "title": "Một struct có thể chỉ mượn dữ liệu",
        "text": "Excerpt<'a> chứa &'a str không sở hữu chuỗi. Tham số 'a nói rằng các lần dùng tham chiếu này phải nằm trong thời gian dữ liệu gốc còn hợp lệ. Nó không cấp phát, không gia hạn tuổi thọ và không biến dữ liệu thành static.",
        "code": "struct Excerpt<'a> {\n    text: &'a str,\n}"
      },
      {
        "title": "Phân biệt hai lần mượn",
        "text": "Trong method &self, lượt mượn struct có thể ngắn hơn tuổi thọ chuỗi mà trường text trỏ tới. Viết kết quả &'a str khi trả một phần của text cho biết kết quả gắn với dữ liệu gốc, không cần giữ chính Excerpt sống sau lời gọi."
      },
      {
        "title": "Để owner sống đủ lâu",
        "text": "Hãy tạo String trước, rồi tạo góc nhìn mượn từ nó. Bạn có thể hủy góc nhìn sau khi lấy một slice hợp lệ, nhưng không được hủy String khi slice còn được dùng. Tham chiếu đến chuỗi tạm trong constructor vẫn không trở nên hợp lệ nhờ ghi lifetime."
      }
    ],
    "tip": "Lifetime biểu đạt quan hệ giữa các tham chiếu. Nếu dữ liệu phải sống độc lập với owner hiện tại, cân nhắc sở hữu String.",
    "exercise": {
      "title": "Lấy từ đầu mà không clone",
      "instructions": "Hoàn thiện first_word. Kết quả phải mượn từ text và còn dùng được sau khi Excerpt bị drop, khi source vẫn sống.",
      "requirements": [
        "Trả &'a str",
        "Dùng split_whitespace để xử lý khoảng trắng",
        "Chuỗi rỗng trả chuỗi rỗng"
      ]
    },
    "starterCode": "struct Excerpt<'a> { text: &'a str }\n\nimpl<'a> Excerpt<'a> {\n    fn first_word(&self) -> &'a str {\n        todo!(\"Trả từ đầu mượn từ self.text\")\n    }\n}\n\nfn main() {\n    let source = String::from(\"  Rust học mỗi ngày\");\n    let view = Excerpt { text: &source };\n    let word = view.first_word();\n    drop(view);\n    assert_eq!(word, \"Rust\");\n    assert_eq!(Excerpt { text: \"\" }.first_word(), \"\");\n    assert_eq!(Excerpt { text: \"  An  \" }.first_word(), \"An\");\n    println!(\"Từ đầu: {word}\");\n}",
    "solutionCode": "struct Excerpt<'a> { text: &'a str }\n\nimpl<'a> Excerpt<'a> {\n    fn first_word(&self) -> &'a str {\n        self.text.split_whitespace().next().unwrap_or(\"\")\n    }\n}\n\nfn main() {\n    let source = String::from(\"  Rust học mỗi ngày\");\n    let view = Excerpt { text: &source };\n    let word = view.first_word();\n    drop(view);\n    assert_eq!(word, \"Rust\");\n    assert_eq!(Excerpt { text: \"\" }.first_word(), \"\");\n    assert_eq!(Excerpt { text: \"  An  \" }.first_word(), \"An\");\n    println!(\"Từ đầu: {word}\");\n}",
    "expectedOutput": "Từ đầu: Rust\n",
    "hints": [
      "split_whitespace().next() trả Option<&str> mượn từ chuỗi ban đầu.",
      "unwrap_or(\"\") cho trường hợp không có từ; string literal phù hợp với lifetime ngắn hơn."
    ],
    "quiz": {
      "question": "Lifetime 'a trong Excerpt<'a> làm gì?",
      "options": [
        "Kéo dài mọi String tới cuối chương trình",
        "Mô tả thời gian tham chiếu tới dữ liệu gốc phải hợp lệ",
        "Tự clone dữ liệu",
        "Buộc Excerpt nằm trên heap"
      ],
      "correct": 1,
      "explanation": "Chú thích lifetime mô tả quan hệ mượn, không thay đổi lúc dữ liệu được tạo hay hủy."
    },
    "reference": {
      "label": "The Rust Book · Lifetime Annotations in Struct Definitions",
      "url": "https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html"
    }
  },
  {
    "id": "static-lifetime",
    "moduleId": "lifetimes",
    "title": "Hiểu đúng lifetime 'static",
    "description": "Phân biệt tham chiếu static với một kiểu sở hữu dữ liệu đáp ứng bound static.",
    "duration": 30,
    "objectives": [
      "Phân biệt &'static str và T: 'static",
      "Đưa dữ liệu sở hữu vào closure bằng move",
      "Tránh dùng static để che lỗi lifetime"
    ],
    "sections": [
      {
        "title": "Tham chiếu đến dữ liệu tồn tại lâu",
        "text": "&'static str là tham chiếu hợp lệ cho phần đời còn lại của chương trình. String literal thường có kiểu này. Không thể trả tham chiếu đến một String cục bộ rồi gắn nhãn static, vì String vẫn bị hủy theo quy tắc sở hữu.",
        "code": "const APP_NAME: &'static str = \"Learn Rust\";"
      },
      {
        "title": "Bound static không có nghĩa sống mãi",
        "text": "T: 'static nghĩa là T không chứa các tham chiếu có lifetime ngắn hơn static. String sở hữu nội dung nên có thể đáp ứng bound này, dù giá trị String vẫn bị drop bình thường. Đừng nhầm tuổi thọ được phép giữ một giá trị với thời điểm thật sự giữ nó."
      },
      {
        "title": "Closure tự sở hữu thứ nó cần",
        "text": "move chuyển các giá trị được capture vào closure. Một closure chỉ chứa String sở hữu có thể đáp ứng static và tiếp tục dùng dữ liệu sau khi phạm vi tạo nó kết thúc. Không cần rò rỉ bộ nhớ bằng Box::leak để giải bài toán này."
      }
    ],
    "tip": "Khi gặp yêu cầu static, hãy kiểm tra dữ liệu đang được mượn hay được sở hữu trước khi sửa chữ ký.",
    "exercise": {
      "title": "Lời chào dùng lại được",
      "instructions": "Trả một closure sở hữu name, tạo lời chào mỗi khi gọi. Closure phải dùng được sau khi biến name đã rời phạm vi ban đầu.",
      "requirements": [
        "Dùng move để capture String",
        "Closure trả String mới khi gọi",
        "Không dùng Box::leak hoặc static mut"
      ]
    },
    "starterCode": "const APP_NAME: &str = \"Learn Rust\";\n\nfn make_greeting(name: String) -> impl Fn() -> String + 'static {\n    move || todo!(\"Tạo lời chào từ name đã sở hữu\")\n}\n\nfn main() {\n    let greeting = {\n        let name = String::from(\"An\");\n        make_greeting(name)\n    };\n    assert_eq!(greeting(), \"Chào, An!\");\n    assert_eq!(greeting(), \"Chào, An!\");\n    assert_eq!(make_greeting(String::from(\"Bình\"))(), \"Chào, Bình!\");\n    println!(\"{} — {APP_NAME}\", greeting());\n}",
    "solutionCode": "const APP_NAME: &str = \"Learn Rust\";\n\nfn make_greeting(name: String) -> impl Fn() -> String + 'static {\n    move || format!(\"Chào, {name}!\")\n}\n\nfn main() {\n    let greeting = {\n        let name = String::from(\"An\");\n        make_greeting(name)\n    };\n    assert_eq!(greeting(), \"Chào, An!\");\n    assert_eq!(greeting(), \"Chào, An!\");\n    assert_eq!(make_greeting(String::from(\"Bình\"))(), \"Chào, Bình!\");\n    println!(\"{} — {APP_NAME}\", greeting());\n}",
    "expectedOutput": "Chào, An! — Learn Rust\n",
    "hints": [
      "Closure cần tự sở hữu name để không mượn biến cục bộ.",
      "Dùng move || format!(\"Chào, {name}!\")."
    ],
    "quiz": {
      "question": "Một String đáp ứng T: 'static có bắt buộc sống đến khi chương trình kết thúc không?",
      "options": [
        "Có, không thể drop",
        "Không, nó vẫn có thể được drop bình thường",
        "Chỉ khi chuỗi không rỗng",
        "Chỉ khi dùng thread"
      ],
      "correct": 1,
      "explanation": "Bound static nói về tham chiếu nằm trong kiểu, không ngăn giá trị sở hữu bị drop."
    },
    "reference": {
      "label": "Rust By Example · Static lifetime",
      "url": "https://doc.rust-lang.org/rust-by-example/scope/lifetime/static_lifetime.html"
    }
  },
  {
    "id": "cow",
    "moduleId": "lifetimes",
    "title": "Cow: Chỉ sở hữu khi cần thay đổi",
    "description": "Trả dữ liệu mượn ở đường đi thông thường và tạo String khi cần xử lý.",
    "duration": 30,
    "objectives": [
      "Phân biệt Cow::Borrowed và Cow::Owned",
      "Trả Cow<str> từ một hàm xử lý chuỗi",
      "Nhận biết khi dữ liệu cần được sao chép"
    ],
    "sections": [
      {
        "title": "Một kết quả có hai cách lưu",
        "text": "Cow là viết tắt của clone-on-write. Cow<str> có thể giữ một &str được mượn hoặc một String được sở hữu. Nó hữu ích khi nhiều đầu vào không cần sửa: hàm vẫn trả một kiểu thống nhất mà không buộc mọi trường hợp cấp phát."
      },
      {
        "title": "Chọn nhánh theo công việc thật sự cần làm",
        "text": "Nếu đầu vào đã đúng định dạng, trả Borrowed(input). Khi phải tạo nội dung mới, trả Owned(String). Lifetime của Cow vẫn gắn với dữ liệu mượn; việc bọc trong Cow không làm một tham chiếu ngắn sống lâu hơn.",
        "code": "use std::borrow::Cow;\nlet borrowed: Cow<str> = Cow::Borrowed(\"rust\");\nlet owned: Cow<str> = Cow::Owned(String::from(\"learn-rust\"));"
      },
      {
        "title": "Chuyển sang sở hữu có chủ đích",
        "text": "to_mut trả quyền sửa kiểu sở hữu và chỉ clone khi Cow còn đang mượn. into_owned trả kiểu sở hữu; nó chuyển giá trị sẵn có hoặc clone phần mượn. Khi chỉ đọc, dùng as_ref hoặc deref để không ép cấp phát."
      }
    ],
    "tip": "Cow phù hợp khi đường đi không cần sửa diễn ra thường xuyên. Đừng thêm nó nếu API chỉ cần nhận &str.",
    "exercise": {
      "title": "Thay dấu cách trong đường dẫn",
      "instructions": "Viết slug_spaces: thay mọi dấu cách ASCII bằng dấu gạch ngang; nếu không có dấu cách, giữ dạng Borrowed.",
      "requirements": [
        "Không cấp phát ở nhánh không có dấu cách",
        "Nhánh thay đổi trả Cow::Owned",
        "Chuỗi rỗng giữ dạng Borrowed"
      ]
    },
    "starterCode": "use std::borrow::Cow;\n\nfn slug_spaces(text: &str) -> Cow<'_, str> {\n    todo!(\"Chọn Borrowed hoặc Owned theo nội dung đầu vào\")\n}\n\nfn main() {\n    let unchanged = slug_spaces(\"rust\");\n    assert!(matches!(&unchanged, Cow::Borrowed(_)));\n    let changed = slug_spaces(\"hoc rust\");\n    assert!(matches!(&changed, Cow::Owned(_)));\n    assert_eq!(changed.as_ref(), \"hoc-rust\");\n    assert!(matches!(slug_spaces(\"\"), Cow::Borrowed(_)));\n    assert_eq!(slug_spaces(\"a  b\").as_ref(), \"a--b\");\n    println!(\"Đường dẫn: {changed}\");\n}",
    "solutionCode": "use std::borrow::Cow;\n\nfn slug_spaces(text: &str) -> Cow<'_, str> {\n    if text.contains(' ') {\n        Cow::Owned(text.replace(' ', \"-\"))\n    } else {\n        Cow::Borrowed(text)\n    }\n}\n\nfn main() {\n    let unchanged = slug_spaces(\"rust\");\n    assert!(matches!(&unchanged, Cow::Borrowed(_)));\n    let changed = slug_spaces(\"hoc rust\");\n    assert!(matches!(&changed, Cow::Owned(_)));\n    assert_eq!(changed.as_ref(), \"hoc-rust\");\n    assert!(matches!(slug_spaces(\"\"), Cow::Borrowed(_)));\n    assert_eq!(slug_spaces(\"a  b\").as_ref(), \"a--b\");\n    println!(\"Đường dẫn: {changed}\");\n}",
    "expectedOutput": "Đường dẫn: hoc-rust\n",
    "hints": [
      "contains(' ') cho biết có cần tạo chuỗi mới không.",
      "Trả Cow::Borrowed(text) khi không thay đổi; dùng replace và Cow::Owned ở nhánh còn lại."
    ],
    "quiz": {
      "question": "Điều gì xảy ra khi gọi to_mut trên Cow::Borrowed?",
      "options": [
        "Dữ liệu gốc luôn bị sửa trực tiếp",
        "Cow tạo bản sở hữu rồi cho phép sửa nó",
        "Lifetime tự thành static",
        "Hàm luôn panic"
      ],
      "correct": 1,
      "explanation": "to_mut bảo đảm có dữ liệu sở hữu để sửa, nên phải clone nếu trước đó Cow chỉ mượn."
    },
    "reference": {
      "label": "Rust std · Cow",
      "url": "https://doc.rust-lang.org/std/borrow/enum.Cow.html"
    }
  },
  {
    "id": "drop",
    "moduleId": "lifetimes",
    "title": "Drop: Dọn tài nguyên theo phạm vi",
    "description": "Quan sát destructor và chủ động kết thúc quyền sở hữu khi đã dùng xong.",
    "duration": 30,
    "objectives": [
      "Triển khai Drop cho một kiểu",
      "Dùng std::mem::drop để dọn sớm",
      "Hiểu thời điểm guard giải phóng tài nguyên"
    ],
    "sections": [
      {
        "title": "Dọn dẹp gắn với quyền sở hữu",
        "text": "Drop cho phép bổ sung công việc khi một giá trị được hủy bình thường. Rust dùng cơ chế này để dọn bộ nhớ và giải phóng nhiều loại tài nguyên. Một guard khóa cũng dựa vào phạm vi sở hữu để mở khóa khi không còn được giữ."
      },
      {
        "title": "Chủ động dọn sớm",
        "text": "Không gọi trực tiếp method Drop::drop. Hàm std::mem::drop nhận quyền sở hữu, rồi hủy giá trị đó. Với kiểu không triển khai Copy như String, giá trị bị move vào drop nên biến cũ không dùng lại được. Với kiểu Copy như i32, drop nhận một bản sao và biến gốc vẫn dùng được. Cách này giúp kết thúc một guard trước phần còn lại của cùng khối.",
        "code": "let data = String::from(\"Tạm thời\");\ndrop(data);\n// Không thể dùng data sau đây."
      },
      {
        "title": "Destructor nên nhỏ và dễ dự đoán",
        "text": "Đừng đặt trong destructor một hành động cần người dùng xử lý lỗi bằng Result. Nó cũng không phải bảo đảm rằng mọi đường kết thúc tiến trình đều chạy dọn dẹp: abort hoặc cố ý quên giá trị có thể bỏ qua destructor. Hãy dùng API đóng tài nguyên rõ ràng khi cần báo lỗi."
      }
    ],
    "tip": "Một khối lệnh ngắn thường diễn tả tuổi thọ tài nguyên rõ hơn nhiều lệnh drop rải rác.",
    "exercise": {
      "title": "Ghi lại thứ tự dọn dẹp",
      "instructions": "Hoàn thiện Drop cho Guard để đưa name vào events. Giữ nguyên main và kiểm tra cả drop chủ động lẫn kết thúc phạm vi.",
      "requirements": [
        "Không in trực tiếp trong destructor",
        "Mượn sửa events trong một biểu thức ngắn",
        "Log cuối cùng phải là trong, ngoài"
      ]
    },
    "starterCode": "use std::cell::RefCell;\nuse std::rc::Rc;\n\nstruct Guard {\n    name: &'static str,\n    events: Rc<RefCell<Vec<&'static str>>>,\n}\n\nimpl Drop for Guard {\n    fn drop(&mut self) {\n        todo!(\"Ghi name vào events khi guard được hủy\");\n    }\n}\n\nfn main() {\n    let events = Rc::new(RefCell::new(Vec::new()));\n    {\n        let outer = Guard { name: \"ngoài\", events: Rc::clone(&events) };\n        let inner = Guard { name: \"trong\", events: Rc::clone(&events) };\n        drop(inner);\n        assert_eq!(*events.borrow(), vec![\"trong\"]);\n        let _still_alive = &outer;\n    }\n    assert_eq!(*events.borrow(), vec![\"trong\", \"ngoài\"]);\n    println!(\"Dọn dẹp: {}\", events.borrow().join(\", \"));\n}",
    "solutionCode": "use std::cell::RefCell;\nuse std::rc::Rc;\n\nstruct Guard {\n    name: &'static str,\n    events: Rc<RefCell<Vec<&'static str>>>,\n}\n\nimpl Drop for Guard {\n    fn drop(&mut self) {\n        self.events.borrow_mut().push(self.name);\n    }\n}\n\nfn main() {\n    let events = Rc::new(RefCell::new(Vec::new()));\n    {\n        let outer = Guard { name: \"ngoài\", events: Rc::clone(&events) };\n        let inner = Guard { name: \"trong\", events: Rc::clone(&events) };\n        drop(inner);\n        assert_eq!(*events.borrow(), vec![\"trong\"]);\n        let _still_alive = &outer;\n    }\n    assert_eq!(*events.borrow(), vec![\"trong\", \"ngoài\"]);\n    println!(\"Dọn dẹp: {}\", events.borrow().join(\", \"));\n}",
    "expectedOutput": "Dọn dẹp: trong, ngoài\n",
    "hints": [
      "Trong Drop, self vẫn cho bạn đọc các trường của giá trị đang dọn.",
      "Dùng self.events.borrow_mut().push(self.name)."
    ],
    "quiz": {
      "question": "Cách đúng để hủy một giá trị sớm là gì?",
      "options": [
        "Gọi value.drop() trực tiếp",
        "Gọi std::mem::drop(value)",
        "Gán lifetime static",
        "Gọi clone rồi bỏ bản clone"
      ],
      "correct": 1,
      "explanation": "std::mem::drop nhận quyền sở hữu và hủy giá trị; Rust không cho gọi destructor trực tiếp theo cách value.drop()."
    },
    "reference": {
      "label": "The Rust Book · Drop",
      "url": "https://doc.rust-lang.org/book/ch15-03-drop.html"
    }
  },
  {
    "id": "channels",
    "moduleId": "concurrency",
    "title": "Channel: Trao đổi dữ liệu giữa luồng",
    "description": "Gom kết quả từ nhiều worker mà không cùng sửa một bộ nhớ chung.",
    "duration": 35,
    "objectives": [
      "Tạo kênh mpsc và clone Sender",
      "Hiểu khi vòng nhận kết thúc",
      "Tạo đầu ra xác định dù thứ tự worker khác nhau"
    ],
    "sections": [
      {
        "title": "Tách bên gửi và bên nhận",
        "text": "std::sync::mpsc cung cấp kênh nhiều bên gửi, một bên nhận. channel trả Sender và Receiver. Gửi một giá trị sở hữu chuyển nó sang kênh; mỗi worker có thể giữ một Sender được clone. Không cần cho mọi worker cùng khóa một Vec kết quả."
      },
      {
        "title": "Đóng đúng bên gửi",
        "text": "Receiver::iter chờ thêm dữ liệu khi vẫn còn Sender. Nó chỉ kết thúc sau khi toàn bộ Sender đã bị drop và các tin đang đợi đã được nhận. Quên drop Sender gốc là một nguyên nhân phổ biến khiến vòng nhận không kết thúc.",
        "code": "let (tx, rx) = std::sync::mpsc::channel::<i32>();\nlet worker_tx = tx.clone();\ndrop(tx);\n// worker_tx cũng phải được drop để rx.iter() kết thúc."
      },
      {
        "title": "Đừng dựa vào thứ tự nhiều worker",
        "text": "Lịch chạy giữa các luồng có thể đổi. Nếu cần kết quả có thứ tự, hãy gửi kèm chỉ số rồi sắp xếp; nếu chỉ cần tổng, phép cộng cho đầu ra xác định. recv và vòng iter ở đây có thể chặn luồng, không phải API async/await."
      }
    ],
    "tip": "Khi một vòng nhận treo, kiểm tra còn Sender nào sống trước khi thêm sleep hoặc timeout.",
    "exercise": {
      "title": "Gom kết quả các công việc",
      "instructions": "Mỗi worker nhận một số và gửi lại gấp đôi số đó. Hoàn thiện sum_jobs để gom tổng, đóng Sender gốc và join mọi worker.",
      "requirements": [
        "Mỗi job chạy trong một thread",
        "Nhận cho đến khi mọi sender đóng",
        "Danh sách rỗng trả 0 và không treo"
      ]
    },
    "starterCode": "use std::sync::mpsc;\nuse std::thread;\n\nfn sum_jobs(jobs: &[i32]) -> i32 {\n    let (tx, rx) = mpsc::channel();\n    let mut handles = Vec::new();\n    for &job in jobs {\n        let sender = tx.clone();\n        handles.push(thread::spawn(move || {\n            sender.send(job * 2).expect(\"Bên nhận còn sống\");\n        }));\n    }\n    // Đóng sender gốc trước khi nhận đến hết kênh.\n    let total: i32 = todo!(\"Drop tx rồi cộng các giá trị từ rx\");\n    for handle in handles {\n        handle.join().expect(\"Worker không panic\");\n    }\n    total\n}\n\nfn main() {\n    assert_eq!(sum_jobs(&[]), 0);\n    assert_eq!(sum_jobs(&[-1, 4]), 6);\n    let total = sum_jobs(&[1, 2, 3]);\n    assert_eq!(total, 12);\n    println!(\"Tổng nhận: {total}\");\n}",
    "solutionCode": "use std::sync::mpsc;\nuse std::thread;\n\nfn sum_jobs(jobs: &[i32]) -> i32 {\n    let (tx, rx) = mpsc::channel();\n    let mut handles = Vec::new();\n    for &job in jobs {\n        let sender = tx.clone();\n        handles.push(thread::spawn(move || {\n            sender.send(job * 2).expect(\"Bên nhận còn sống\");\n        }));\n    }\n    drop(tx);\n    let total: i32 = rx.iter().sum();\n    for handle in handles {\n        handle.join().expect(\"Worker không panic\");\n    }\n    total\n}\n\nfn main() {\n    assert_eq!(sum_jobs(&[]), 0);\n    assert_eq!(sum_jobs(&[-1, 4]), 6);\n    let total = sum_jobs(&[1, 2, 3]);\n    assert_eq!(total, 12);\n    println!(\"Tổng nhận: {total}\");\n}",
    "expectedOutput": "Tổng nhận: 12\n",
    "hints": [
      "Sender clone trong worker tự bị drop khi worker kết thúc, nhưng tx gốc vẫn ở hàm.",
      "Viết drop(tx); rồi let total: i32 = rx.iter().sum();."
    ],
    "quiz": {
      "question": "Vì sao rx.iter() vẫn đợi khi các worker đã gửi xong?",
      "options": [
        "Vì chưa in kết quả",
        "Có thể vẫn còn một Sender sống",
        "Vì chỉ nhận được một tin",
        "Vì phải dùng Rc"
      ],
      "correct": 1,
      "explanation": "Receiver chờ khi còn bên gửi. Vòng lặp kết thúc khi toàn bộ Sender đóng và kênh không còn tin."
    },
    "reference": {
      "label": "The Rust Book · Message Passing",
      "url": "https://doc.rust-lang.org/book/ch16-02-message-passing.html"
    }
  },
  {
    "id": "mutex-arc",
    "moduleId": "concurrency",
    "title": "Arc và Mutex: Cùng sở hữu, sửa có khóa",
    "description": "Tách bài toán chia sẻ quyền sở hữu khỏi việc bảo vệ dữ liệu được cập nhật.",
    "duration": 35,
    "objectives": [
      "Chia sẻ trạng thái qua Arc",
      "Sửa dữ liệu khi giữ MutexGuard",
      "Join worker trước khi đọc kết quả cuối"
    ],
    "sections": [
      {
        "title": "Arc giải quyết quyền sở hữu",
        "text": "Arc<T> dùng bộ đếm nguyên tử để nhiều luồng có thể cùng sở hữu dữ liệu khi các ràng buộc của T phù hợp. Arc không tự làm mọi T an toàn để sửa đồng thời. Bạn vẫn cần một cơ chế bảo vệ dữ liệu có thể thay đổi."
      },
      {
        "title": "Mutex bảo vệ vùng truy cập",
        "text": "Mutex<T>::lock trả guard khi lấy được khóa. Guard cho phép truy cập T và mở khóa khi bị drop. Hãy giữ khóa trong thời gian ngắn. Nếu một luồng panic khi giữ khóa, trạng thái poisoning được báo qua Result để bên gọi quyết định xử lý.",
        "code": "use std::sync::{Arc, Mutex};\nlet count = Arc::new(Mutex::new(0));\n{\n    let mut guard = count.lock().expect(\"Khóa hợp lệ\");\n    *guard += 1;\n}"
      },
      {
        "title": "Thiết kế để tránh deadlock",
        "text": "Không giữ khóa rồi chờ một worker cũng cần khóa đó. Khi có nhiều khóa, thứ tự lấy khóa cần nhất quán. Arc bảo vệ bộ đếm và Mutex bảo vệ truy cập dữ liệu; cả hai không tự chứng minh chương trình không thể deadlock."
      }
    ],
    "tip": "Đọc kết quả sau khi join tất cả worker. Đọc quá sớm có thể thấy một giá trị hợp lệ nhưng chưa hoàn tất.",
    "exercise": {
      "title": "Bộ đếm nhiều worker",
      "instructions": "Hoàn thiện concurrent_count. Mỗi worker tăng bộ đếm increments lần; cuối hàm trả kết quả sau khi join.",
      "requirements": [
        "Dùng Arc<Mutex<usize>>",
        "Mỗi lần tăng diễn ra khi giữ guard",
        "Xử lý workers hoặc increments bằng 0"
      ]
    },
    "starterCode": "use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn concurrent_count(workers: usize, increments: usize) -> usize {\n    let counter = Arc::new(Mutex::new(0usize));\n    let mut handles = Vec::new();\n    for _ in 0..workers {\n        let shared = Arc::clone(&counter);\n        handles.push(thread::spawn(move || {\n            for _ in 0..increments {\n                todo!(\"Lấy khóa rồi tăng bộ đếm\");\n            }\n        }));\n    }\n    for handle in handles {\n        handle.join().expect(\"Worker không panic\");\n    }\n    let result = *counter.lock().expect(\"Khóa không bị poison\");\n    result\n}\n\nfn main() {\n    assert_eq!(concurrent_count(0, 4), 0);\n    assert_eq!(concurrent_count(2, 0), 0);\n    let count = concurrent_count(3, 40);\n    assert_eq!(count, 120);\n    println!(\"Bộ đếm: {count}\");\n}",
    "solutionCode": "use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn concurrent_count(workers: usize, increments: usize) -> usize {\n    let counter = Arc::new(Mutex::new(0usize));\n    let mut handles = Vec::new();\n    for _ in 0..workers {\n        let shared = Arc::clone(&counter);\n        handles.push(thread::spawn(move || {\n            for _ in 0..increments {\n                *shared.lock().expect(\"Khóa không bị poison\") += 1;\n            }\n        }));\n    }\n    for handle in handles {\n        handle.join().expect(\"Worker không panic\");\n    }\n    let result = *counter.lock().expect(\"Khóa không bị poison\");\n    result\n}\n\nfn main() {\n    assert_eq!(concurrent_count(0, 4), 0);\n    assert_eq!(concurrent_count(2, 0), 0);\n    let count = concurrent_count(3, 40);\n    assert_eq!(count, 120);\n    println!(\"Bộ đếm: {count}\");\n}",
    "expectedOutput": "Bộ đếm: 120\n",
    "hints": [
      "lock trả Result<MutexGuard<_>>. Sau expect, *guard truy cập số đang được bảo vệ.",
      "Giữ guard trong đúng một lượt tăng để khóa được thả trước lượt tiếp theo."
    ],
    "quiz": {
      "question": "Arc<Mutex<T>> phân chia trách nhiệm ra sao?",
      "options": [
        "Arc khóa T; Mutex đếm chủ sở hữu",
        "Arc chia sẻ sở hữu; Mutex bảo vệ truy cập T",
        "Cả hai chỉ sao chép dữ liệu",
        "Arc tự loại mọi deadlock"
      ],
      "correct": 1,
      "explanation": "Arc quản lý sở hữu dùng chung; Mutex cho một bên truy cập dữ liệu qua guard tại một thời điểm."
    },
    "reference": {
      "label": "The Rust Book · Shared-State Concurrency",
      "url": "https://doc.rust-lang.org/book/ch16-03-shared-state.html"
    }
  },
  {
    "id": "send-sync",
    "moduleId": "concurrency",
    "title": "Send và Sync: Hợp đồng giữa các luồng",
    "description": "Đọc ràng buộc kiểu khi chuyển dữ liệu hoặc chia sẻ tham chiếu qua thread.",
    "duration": 35,
    "objectives": [
      "Phân biệt Send và Sync",
      "Giải thích vì sao Rc không phù hợp giữa các luồng",
      "Chuyển String sở hữu vào worker bằng move"
    ],
    "sections": [
      {
        "title": "Send cho chuyển, Sync cho chia sẻ",
        "text": "Send cho biết một giá trị có thể được chuyển an toàn sang luồng khác. Sync cho biết &T có thể được gửi an toàn giữa luồng; chính xác hơn, T: Sync tương đương &T: Send. Đây là hai câu hỏi khác nhau về cách dùng một kiểu."
      },
      {
        "title": "Các trường quyết định tính chất của kiểu",
        "text": "Send và Sync thường được suy ra tự động từ các thành phần. String đáp ứng cả hai; Rc không đáp ứng cả hai. RefCell không Sync, dù có thể Send khi T là Send. Bọc một kiểu không phù hợp trong Arc không tự sửa các ràng buộc này.",
        "code": "fn require_send_sync<T: Send + Sync>() {}\nrequire_send_sync::<String>();\nrequire_send_sync::<std::sync::Arc<std::sync::Mutex<u32>>>();"
      },
      {
        "title": "Ưu tiên thiết kế sở hữu trước unsafe",
        "text": "Nếu worker cần một String, chuyển String vào closure move thường rõ ràng hơn cố chia sẻ một tham chiếu ngắn. Không tự thêm unsafe impl Send hoặc Sync để làm compiler im lặng: triển khai sai có thể phá vỡ bảo đảm bộ nhớ của mã dùng kiểu đó."
      }
    ],
    "tip": "Một lỗi Send/Sync thường chỉ ra rằng mô hình chia sẻ dữ liệu cần thay đổi, không phải thiếu một từ khóa.",
    "exercise": {
      "title": "Đếm ký tự trên các worker",
      "instructions": "Hoàn thiện spawn_lengths để chuyển từng String vào worker, đếm Unicode scalar bằng chars().count(), rồi join theo thứ tự đầu vào.",
      "requirements": [
        "Không mượn String cục bộ vào thread",
        "Đầu ra giữ thứ tự của labels",
        "Danh sách rỗng trả Vec rỗng"
      ]
    },
    "starterCode": "use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn require_send_sync<T: Send + Sync>() {}\n\nfn spawn_lengths(labels: Vec<String>) -> Vec<usize> {\n    let handles: Vec<_> = labels.into_iter().map(|label| {\n        thread::spawn(move || todo!(\"Đếm ký tự trong label đã được chuyển vào\"))\n    }).collect();\n    handles.into_iter().map(|handle| handle.join().expect(\"Worker không panic\")).collect()\n}\n\nfn main() {\n    require_send_sync::<String>();\n    require_send_sync::<Arc<Mutex<Vec<usize>>>>();\n    assert_eq!(spawn_lengths(Vec::new()), Vec::<usize>::new());\n    let lengths = spawn_lengths(vec![\"Rust\".into(), \"Việt\".into(), \"An\".into()]);\n    assert_eq!(lengths, vec![4, 4, 2]);\n    println!(\"Số ký tự: {lengths:?}\");\n}",
    "solutionCode": "use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn require_send_sync<T: Send + Sync>() {}\n\nfn spawn_lengths(labels: Vec<String>) -> Vec<usize> {\n    let handles: Vec<_> = labels.into_iter().map(|label| {\n        thread::spawn(move || label.chars().count())\n    }).collect();\n    handles.into_iter().map(|handle| handle.join().expect(\"Worker không panic\")).collect()\n}\n\nfn main() {\n    require_send_sync::<String>();\n    require_send_sync::<Arc<Mutex<Vec<usize>>>>();\n    assert_eq!(spawn_lengths(Vec::new()), Vec::<usize>::new());\n    let lengths = spawn_lengths(vec![\"Rust\".into(), \"Việt\".into(), \"An\".into()]);\n    assert_eq!(lengths, vec![4, 4, 2]);\n    println!(\"Số ký tự: {lengths:?}\");\n}",
    "expectedOutput": "Số ký tự: [4, 4, 2]\n",
    "hints": [
      "Dùng move để closure sở hữu label.",
      "chars().count() đếm Unicode scalar; len() của String đếm byte UTF-8."
    ],
    "quiz": {
      "question": "T: Sync tương đương với điều kiện nào?",
      "options": [
        "T: Copy",
        "&T: Send",
        "T luôn có Mutex",
        "&mut T luôn là static"
      ],
      "correct": 1,
      "explanation": "Sync mô tả khả năng chia sẻ tham chiếu &T giữa các luồng một cách an toàn."
    },
    "reference": {
      "label": "The Rustonomicon · Send and Sync",
      "url": "https://doc.rust-lang.org/nomicon/send-and-sync.html"
    }
  },
  {
    "id": "async-await",
    "moduleId": "async",
    "title": "Async và await: Mô tả công việc chưa xong",
    "description": "Tạo Future bằng async và ghép các bước bằng await trong một ví dụ std-only.",
    "duration": 35,
    "objectives": [
      "Hiểu async fn tạo Future",
      "Dùng await bên trong ngữ cảnh async",
      "Phân biệt Future với executor thực thi nó"
    ],
    "sections": [
      {
        "title": "Gọi hàm chưa có nghĩa đã chạy thân hàm",
        "text": "async fn tạo một Future. Công việc trong thân hàm tiến triển khi Future được poll. Việc tạo nhiều Future không tự tạo nhiều thread. Cú pháp async giúp lưu trạng thái cần thiết giữa những điểm có thể phải chờ."
      },
      {
        "title": "Await nối các bước phụ thuộc",
        "text": "future.await lấy kết quả khi Future sẵn sàng; nếu chưa, Future bao ngoài có thể nhường lại quyền điều khiển. await chỉ dùng trong ngữ cảnh async. Nó không tự biến một thao tác chặn như thread::sleep thành thao tác không chặn.",
        "code": "async fn doubled() -> u32 {\n    let value = std::future::ready(21).await;\n    value * 2\n}"
      },
      {
        "title": "Bài thực hành chỉ dùng Future sẵn sàng",
        "text": "std cung cấp Future nhưng không tích hợp một runtime đa dụng để chạy mọi IO async. Bài này dùng future::ready nên hoàn tất trong một lần poll; Waker::noop chỉ đủ cho tình huống đã biết đó. Helper poll_ready không phải executor cho Future có Pending."
      }
    ],
    "tip": "Không poll lại một Future sau khi đã nhận Ready. Tạo Future mới cho mỗi lần kiểm tra.",
    "exercise": {
      "title": "Tính tổng sau một bước async",
      "instructions": "Hoàn thiện total_with_fee: await phí 5.000 từ future::ready rồi cộng với price nhân quantity.",
      "requirements": [
        "Giữ async fn và sử dụng await",
        "Không thêm crate hoặc runtime bên ngoài",
        "Mỗi lần kiểm tra tạo một Future mới"
      ]
    },
    "starterCode": "use std::future::{Future, ready};\nuse std::pin::pin;\nuse std::task::{Context, Poll, Waker};\n\nasync fn total_with_fee(price: u32, quantity: u32) -> u32 {\n    todo!(\"Await phí rồi cộng vào tổng tiền\")\n}\n\nfn poll_ready<F: Future>(future: F) -> F::Output {\n    let mut future = pin!(future);\n    let mut context = Context::from_waker(Waker::noop());\n    match future.as_mut().poll(&mut context) {\n        Poll::Ready(value) => value,\n        Poll::Pending => panic!(\"Helper này chỉ dùng cho Future sẵn sàng ngay\"),\n    }\n}\n\nfn main() {\n    assert_eq!(poll_ready(total_with_fee(0, 0)), 5_000);\n    assert_eq!(poll_ready(total_with_fee(10_000, 2)), 25_000);\n    let total = poll_ready(total_with_fee(120_000, 3));\n    assert_eq!(total, 365_000);\n    println!(\"Tổng: {total} VND\");\n}",
    "solutionCode": "use std::future::{Future, ready};\nuse std::pin::pin;\nuse std::task::{Context, Poll, Waker};\n\nasync fn total_with_fee(price: u32, quantity: u32) -> u32 {\n    let fee = ready(5_000u32).await;\n    price * quantity + fee\n}\n\nfn poll_ready<F: Future>(future: F) -> F::Output {\n    let mut future = pin!(future);\n    let mut context = Context::from_waker(Waker::noop());\n    match future.as_mut().poll(&mut context) {\n        Poll::Ready(value) => value,\n        Poll::Pending => panic!(\"Helper này chỉ dùng cho Future sẵn sàng ngay\"),\n    }\n}\n\nfn main() {\n    assert_eq!(poll_ready(total_with_fee(0, 0)), 5_000);\n    assert_eq!(poll_ready(total_with_fee(10_000, 2)), 25_000);\n    let total = poll_ready(total_with_fee(120_000, 3));\n    assert_eq!(total, 365_000);\n    println!(\"Tổng: {total} VND\");\n}",
    "expectedOutput": "Tổng: 365000 VND\n",
    "hints": [
      "ready(5_000u32) tạo Future có kết quả sẵn sàng.",
      "Dùng let fee = ready(5_000u32).await; rồi trả price * quantity + fee."
    ],
    "quiz": {
      "question": "Điều gì làm thân một Future tạo bởi async fn tiến triển?",
      "options": [
        "Chỉ cần khai báo async",
        "Future được poll bởi bên thực thi",
        "Luôn tự tạo một thread mới",
        "Gọi clone trên Future"
      ],
      "correct": 1,
      "explanation": "Future cần được poll. Executor đảm nhận việc đó trong ứng dụng async thông thường."
    },
    "reference": {
      "label": "Rust std · Future",
      "url": "https://doc.rust-lang.org/std/future/trait.Future.html"
    }
  },
  {
    "id": "futures-poll",
    "moduleId": "async",
    "title": "Future, Poll và Waker",
    "description": "Tự viết một Future nhường một lượt rồi báo sẵn sàng bằng hợp đồng wake.",
    "duration": 40,
    "objectives": [
      "Triển khai Future::poll",
      "Phân biệt Pending với Ready",
      "Thông báo cần poll lại qua Waker"
    ],
    "sections": [
      {
        "title": "Poll là một lần thử tiến triển",
        "text": "Future::poll nhận Pin<&mut Self> và Context, rồi trả Pending hoặc Ready(output). Pending không phải lỗi; nó cho biết chưa có kết quả. poll nên trả nhanh để không giữ luồng thực thi quá lâu. Không gọi lại poll sau khi Future đã hoàn tất."
      },
      {
        "title": "Waker nối Future với bộ lập lịch",
        "text": "Context cung cấp Waker của task hiện tại. Khi trả Pending, Future phải sắp xếp việc đánh thức task khi có thể tiến triển. wake không trực tiếp chạy Future; nó thông báo cho executor. Nhiều thông báo có thể được gom thành một lượt poll.",
        "code": "fn poll(self: std::pin::Pin<&mut Self>, cx: &mut std::task::Context<'_>)\n    -> std::task::Poll<Self::Output> {\n    // Khi có thể tiến triển: cx.waker().wake_by_ref();\n    todo!()\n}"
      },
      {
        "title": "Thử hợp đồng bằng một Future nhỏ",
        "text": "YieldOnce trong bài này lưu một cờ. Lần đầu, nó đổi cờ, yêu cầu wake rồi trả Pending; lần sau trả kết quả. WakeCounter đo lời gọi wake bằng API Wake an toàn, nên không cần tự xây RawWaker bằng unsafe."
      }
    ],
    "tip": "Waker::noop phù hợp với Future biết chắc sẵn sàng ngay; nó không phải bộ lập lịch cho một tác vụ thật đang chờ.",
    "exercise": {
      "title": "Nhường đúng một lượt",
      "instructions": "Hoàn thiện poll của YieldOnce. Hãy đổi pending thành false và gọi wake_by_ref trước khi trả Pending lần đầu.",
      "requirements": [
        "Lần poll đầu trả Pending và tăng bộ đếm wake",
        "Lần poll thứ hai trả Ready(\"Sẵn sàng\")",
        "Không poll lại sau Ready"
      ]
    },
    "starterCode": "use std::future::Future;\nuse std::pin::Pin;\nuse std::sync::{Arc, atomic::{AtomicUsize, Ordering}};\nuse std::task::{Context, Poll, Wake, Waker};\n\nstruct WakeCounter(AtomicUsize);\nimpl Wake for WakeCounter {\n    fn wake(self: Arc<Self>) {\n        self.0.fetch_add(1, Ordering::Relaxed);\n    }\n}\n\nstruct YieldOnce { pending: bool }\nimpl Future for YieldOnce {\n    type Output = &'static str;\n    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {\n        todo!(\"Lần đầu đánh thức và nhường; lần sau trả kết quả\")\n    }\n}\n\nfn main() {\n    let counter = Arc::new(WakeCounter(AtomicUsize::new(0)));\n    let waker = Waker::from(Arc::clone(&counter));\n    let mut context = Context::from_waker(&waker);\n    let mut future = Box::pin(YieldOnce { pending: true });\n    assert!(future.as_mut().poll(&mut context).is_pending());\n    assert_eq!(counter.0.load(Ordering::Relaxed), 1);\n    let value = match future.as_mut().poll(&mut context) {\n        Poll::Ready(value) => value,\n        Poll::Pending => panic!(\"Lượt hai phải sẵn sàng\"),\n    };\n    assert_eq!(value, \"Sẵn sàng\");\n    println!(\"Future: {value}\");\n}",
    "solutionCode": "use std::future::Future;\nuse std::pin::Pin;\nuse std::sync::{Arc, atomic::{AtomicUsize, Ordering}};\nuse std::task::{Context, Poll, Wake, Waker};\n\nstruct WakeCounter(AtomicUsize);\nimpl Wake for WakeCounter {\n    fn wake(self: Arc<Self>) {\n        self.0.fetch_add(1, Ordering::Relaxed);\n    }\n}\n\nstruct YieldOnce { pending: bool }\nimpl Future for YieldOnce {\n    type Output = &'static str;\n    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {\n        let state = self.get_mut();\n        if state.pending {\n            state.pending = false;\n            cx.waker().wake_by_ref();\n            Poll::Pending\n        } else {\n            Poll::Ready(\"Sẵn sàng\")\n        }\n    }\n}\n\nfn main() {\n    let counter = Arc::new(WakeCounter(AtomicUsize::new(0)));\n    let waker = Waker::from(Arc::clone(&counter));\n    let mut context = Context::from_waker(&waker);\n    let mut future = Box::pin(YieldOnce { pending: true });\n    assert!(future.as_mut().poll(&mut context).is_pending());\n    assert_eq!(counter.0.load(Ordering::Relaxed), 1);\n    let value = match future.as_mut().poll(&mut context) {\n        Poll::Ready(value) => value,\n        Poll::Pending => panic!(\"Lượt hai phải sẵn sàng\"),\n    };\n    assert_eq!(value, \"Sẵn sàng\");\n    println!(\"Future: {value}\");\n}",
    "expectedOutput": "Future: Sẵn sàng\n",
    "hints": [
      "YieldOnce chỉ chứa bool nên là Unpin; self.get_mut() cho phép sửa cờ.",
      "Đổi cờ trước wake_by_ref để lần poll tiếp theo thấy trạng thái mới."
    ],
    "quiz": {
      "question": "Gọi wake_by_ref có nghĩa là gì?",
      "options": [
        "Chạy ngay toàn bộ Future trên luồng hiện tại",
        "Thông báo executor rằng task cần được poll lại",
        "Biến Pending thành một lỗi",
        "Tự tạo thread mới"
      ],
      "correct": 1,
      "explanation": "Waker thông báo cho bên lập lịch; executor quyết định lúc poll lại task."
    },
    "reference": {
      "label": "Rust std · Waker",
      "url": "https://doc.rust-lang.org/std/task/struct.Waker.html"
    }
  },
  {
    "id": "pin-unpin",
    "moduleId": "async",
    "title": "Pin và Unpin: Giữ vị trí dữ liệu",
    "description": "Đọc chữ ký poll và thao tác với giá trị được ghim mà không dùng unsafe.",
    "duration": 40,
    "objectives": [
      "Phân biệt con trỏ với dữ liệu nó trỏ tới",
      "Hiểu vì sao Unpin cho phép get_mut",
      "Ghim một Future bằng macro pin!"
    ],
    "sections": [
      {
        "title": "Pin bảo vệ điều gì",
        "text": "Pin<P> đặt hợp đồng lên giá trị mà P trỏ tới: với kiểu cần ghim, không được di chuyển giá trị khỏi vị trí trước khi hủy đúng cách. Bản thân handle con trỏ vẫn có thể được di chuyển. Pin không phải khóa và không có nghĩa mọi trường đều bất biến."
      },
      {
        "title": "Unpin cho các kiểu không cần hợp đồng đó",
        "text": "Nhiều kiểu thông thường như i32 là Unpin. Với chúng, Pin<&mut T>::get_mut là thao tác an toàn vì di chuyển T không phá một bất biến ghim. Không suy ra mọi Future đều Unpin: state machine async có thể cần giữ vị trí ổn định.",
        "code": "use std::pin::Pin;\nlet mut value = 5;\nlet pinned = Pin::new(&mut value);\n*pinned.get_mut() += 2;"
      },
      {
        "title": "Ghim Future rồi mượn lại",
        "text": "pin!(future) ghim cục bộ; Box::pin(future) ghim dữ liệu trong Box. Khi cần gọi poll nhiều lượt trước khi hoàn tất, as_mut tạo một lượt mượn Pin ngắn hơn. Không lấy dữ liệu ra chỉ để gọi poll, vì thao tác đó có thể vi phạm hợp đồng ghim."
      }
    ],
    "tip": "Nếu chỉ sử dụng Future qua API an toàn, ưu tiên pin! hoặc Box::pin; không cần tự viết Pin::new_unchecked.",
    "exercise": {
      "title": "Sửa một giá trị Unpin rồi poll Future",
      "instructions": "Hoàn thiện add_pinned để cộng delta vào i32 qua Pin<&mut i32>. Phần main dùng giá trị đó trong Future được ghim bằng pin!.",
      "requirements": [
        "Dùng get_mut với kiểu i32 là Unpin",
        "Không thêm unsafe",
        "Giữ kiểm tra giá trị âm và kết quả Future"
      ]
    },
    "starterCode": "use std::future::Future;\nuse std::pin::{Pin, pin};\nuse std::task::{Context, Poll, Waker};\n\nfn add_pinned(value: Pin<&mut i32>, delta: i32) {\n    todo!(\"Lấy &mut i32 hợp lệ rồi cộng delta\");\n}\n\nfn main() {\n    let mut count = 5;\n    add_pinned(Pin::new(&mut count), 7);\n    assert_eq!(count, 12);\n    let mut negative = -2;\n    add_pinned(Pin::new(&mut negative), 3);\n    assert_eq!(negative, 1);\n    let mut future = pin!(async { count * 2 });\n    let mut context = Context::from_waker(Waker::noop());\n    let result = match future.as_mut().poll(&mut context) {\n        Poll::Ready(value) => value,\n        Poll::Pending => panic!(\"Future mẫu không có điểm chờ\"),\n    };\n    assert_eq!(result, 24);\n    println!(\"Kết quả Future: {result}\");\n}",
    "solutionCode": "use std::future::Future;\nuse std::pin::{Pin, pin};\nuse std::task::{Context, Poll, Waker};\n\nfn add_pinned(value: Pin<&mut i32>, delta: i32) {\n    *value.get_mut() += delta;\n}\n\nfn main() {\n    let mut count = 5;\n    add_pinned(Pin::new(&mut count), 7);\n    assert_eq!(count, 12);\n    let mut negative = -2;\n    add_pinned(Pin::new(&mut negative), 3);\n    assert_eq!(negative, 1);\n    let mut future = pin!(async { count * 2 });\n    let mut context = Context::from_waker(Waker::noop());\n    let result = match future.as_mut().poll(&mut context) {\n        Poll::Ready(value) => value,\n        Poll::Pending => panic!(\"Future mẫu không có điểm chờ\"),\n    };\n    assert_eq!(result, 24);\n    println!(\"Kết quả Future: {result}\");\n}",
    "expectedOutput": "Kết quả Future: 24\n",
    "hints": [
      "i32 không có dữ liệu tự tham chiếu và triển khai Unpin.",
      "value.get_mut() trả &mut i32; dùng * để sửa số bên trong."
    ],
    "quiz": {
      "question": "Pin có tự biến một giá trị thành bất biến không?",
      "options": [
        "Có, mọi trường đều bị khóa",
        "Không; hợp đồng chủ yếu liên quan đến việc di chuyển dữ liệu được ghim",
        "Chỉ với String",
        "Có, và thay thế Mutex"
      ],
      "correct": 1,
      "explanation": "Pin không phải khóa đồng thời hay lệnh cấm mọi chỉnh sửa. Khả năng sửa phụ thuộc API và ràng buộc của kiểu."
    },
    "reference": {
      "label": "Rust std · Pin",
      "url": "https://doc.rust-lang.org/std/pin/index.html"
    }
  },
  {
    "id": "async-runtime",
    "moduleId": "async",
    "title": "Executor: Ai thực sự chạy Future?",
    "description": "Xây bộ thực thi một task có tín hiệu đánh thức bằng thư viện chuẩn.",
    "duration": 45,
    "objectives": [
      "Phân biệt executor với Future",
      "Dùng Wake để báo một task cần chạy lại",
      "Giải thích vì sao ví dụ không phải runtime IO đầy đủ"
    ],
    "sections": [
      {
        "title": "Cú pháp async cần bên thực thi",
        "text": "Future mô tả một công việc; executor quyết định poll nó khi nào. Một runtime thực tế có thể cung cấp thêm bộ lập lịch, timer và cơ chế theo dõi IO. Thư viện chuẩn không tự đưa các dịch vụ đó vào mỗi async fn."
      },
      {
        "title": "Đợi tín hiệu thay vì quay vòng liên tục",
        "text": "Executor mẫu dùng một cờ trong Mutex và Condvar. Wake đặt cờ rồi báo điều kiện. Vòng thực thi chờ khi cờ chưa bật, xóa cờ trước lượt poll, rồi trả kết quả hoặc chờ lượt đánh thức tiếp. Kiểm tra cờ trong vòng while xử lý được đánh thức giả."
      },
      {
        "title": "Giới hạn được nêu rõ",
        "text": "Bài này chạy một Future trên luồng gọi block_on và chỉ minh họa wake/poll. Nó không có hàng đợi nhiều task, timer, driver mạng hay Tokio. Không đưa một Future cần dịch vụ runtime khác vào helper này và mong nó tự hoạt động."
      }
    ],
    "tip": "Đừng giữ guard của cờ trong khi gọi poll: Future có thể gọi wake ngay trong poll và cần lấy cùng khóa.",
    "exercise": {
      "title": "Hoàn thiện bộ thực thi một task",
      "instructions": "Điền hai phần còn thiếu: Wake phải bật cờ và thông báo; vòng block_on phải trả khi Ready và tiếp tục khi Pending.",
      "requirements": [
        "Không busy-loop và không thêm sleep",
        "Nhả guard trước khi gọi poll",
        "Chạy được Future đã sẵn sàng lẫn Future nhường một lượt"
      ]
    },
    "starterCode": "use std::future::{Future, ready};\nuse std::pin::Pin;\nuse std::sync::{Arc, Condvar, Mutex};\nuse std::task::{Context, Poll, Wake, Waker};\n\nstruct WakeSignal {\n    ready: Mutex<bool>,\n    changed: Condvar,\n}\nimpl Wake for WakeSignal {\n    fn wake(self: Arc<Self>) {\n        todo!(\"Bật cờ ready và notify_one\");\n    }\n}\n\nfn block_on<F: Future>(future: F) -> F::Output {\n    let signal = Arc::new(WakeSignal { ready: Mutex::new(true), changed: Condvar::new() });\n    let waker = Waker::from(Arc::clone(&signal));\n    let mut context = Context::from_waker(&waker);\n    let mut future = Box::pin(future);\n    loop {\n        let mut signaled = signal.ready.lock().expect(\"Khóa hợp lệ\");\n        while !*signaled {\n            signaled = signal.changed.wait(signaled).expect(\"Khóa hợp lệ\");\n        }\n        *signaled = false;\n        drop(signaled);\n        todo!(\"Poll Future: trả giá trị khi Ready, tiếp tục vòng lặp khi Pending\");\n    }\n}\n\nstruct YieldOnce(bool);\nimpl Future for YieldOnce {\n    type Output = ();\n    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<()> {\n        if self.0 {\n            Poll::Ready(())\n        } else {\n            self.0 = true;\n            cx.waker().wake_by_ref();\n            Poll::Pending\n        }\n    }\n}\n\nfn main() {\n    assert_eq!(block_on(ready(5)), 5);\n    let value = block_on(async {\n        YieldOnce(false).await;\n        ready(42).await\n    });\n    assert_eq!(value, 42);\n    println!(\"Executor trả về: {value}\");\n}",
    "solutionCode": "use std::future::{Future, ready};\nuse std::pin::Pin;\nuse std::sync::{Arc, Condvar, Mutex};\nuse std::task::{Context, Poll, Wake, Waker};\n\nstruct WakeSignal {\n    ready: Mutex<bool>,\n    changed: Condvar,\n}\nimpl Wake for WakeSignal {\n    fn wake(self: Arc<Self>) {\n        *self.ready.lock().expect(\"Khóa hợp lệ\") = true;\n        self.changed.notify_one();\n    }\n}\n\nfn block_on<F: Future>(future: F) -> F::Output {\n    let signal = Arc::new(WakeSignal { ready: Mutex::new(true), changed: Condvar::new() });\n    let waker = Waker::from(Arc::clone(&signal));\n    let mut context = Context::from_waker(&waker);\n    let mut future = Box::pin(future);\n    loop {\n        let mut signaled = signal.ready.lock().expect(\"Khóa hợp lệ\");\n        while !*signaled {\n            signaled = signal.changed.wait(signaled).expect(\"Khóa hợp lệ\");\n        }\n        *signaled = false;\n        drop(signaled);\n        match future.as_mut().poll(&mut context) {\n            Poll::Ready(value) => return value,\n            Poll::Pending => {}\n        }\n    }\n}\n\nstruct YieldOnce(bool);\nimpl Future for YieldOnce {\n    type Output = ();\n    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<()> {\n        if self.0 {\n            Poll::Ready(())\n        } else {\n            self.0 = true;\n            cx.waker().wake_by_ref();\n            Poll::Pending\n        }\n    }\n}\n\nfn main() {\n    assert_eq!(block_on(ready(5)), 5);\n    let value = block_on(async {\n        YieldOnce(false).await;\n        ready(42).await\n    });\n    assert_eq!(value, 42);\n    println!(\"Executor trả về: {value}\");\n}",
    "expectedOutput": "Executor trả về: 42\n",
    "hints": [
      "Wake cần đặt *self.ready.lock().expect(...) = true rồi gọi changed.notify_one().",
      "Sau drop(signaled), match future.as_mut().poll(&mut context); Ready trả về, Pending để vòng lặp tiếp tục."
    ],
    "quiz": {
      "question": "Vì sao phải nhả khóa ready trước khi poll?",
      "options": [
        "Để Future được clone",
        "Vì Future có thể gọi wake, và wake cần lấy cùng khóa",
        "Vì Mutex chỉ dùng được một lần",
        "Vì poll tự hủy mọi khóa"
      ],
      "correct": 1,
      "explanation": "Giữ khóa rồi poll một Future gọi wake đồng bộ có thể khiến chính luồng đó chờ khóa mình đang giữ."
    },
    "reference": {
      "label": "Rust std · Wake",
      "url": "https://doc.rust-lang.org/std/task/trait.Wake.html"
    }
  },
  {
    "id": "trait-objects",
    "moduleId": "advanced",
    "title": "Trait object: Nhiều kiểu, một giao diện",
    "description": "Lưu các kiểu khác nhau cùng triển khai một hành vi trong một danh sách.",
    "duration": 35,
    "objectives": [
      "Dùng Box<dyn Trait>",
      "So sánh generic với dynamic dispatch",
      "Thiết kế method có thể gọi qua trait object"
    ],
    "sections": [
      {
        "title": "Khi kiểu cụ thể không cần lộ ra",
        "text": "Vec<T> có một kiểu phần tử. Với Vec<Box<dyn Summary>>, mọi phần tử có cùng kiểu handle nhưng dữ liệu bên trong có thể thuộc những kiểu khác nhau triển khai Summary. Chỉ những thao tác trong giao diện trait được dùng qua handle đó."
      },
      {
        "title": "Lựa chọn cách phân phối lời gọi",
        "text": "Generic thường giữ thông tin kiểu cụ thể để compiler chuyên biệt hóa mã. Trait object dùng dynamic dispatch để chọn implementation khi chạy. Hãy chọn theo nhu cầu mở rộng và dữ liệu, không theo một giả định rằng một cách luôn nhanh hơn trong mọi chương trình."
      },
      {
        "title": "Trait cần tương thích với dyn",
        "text": "Không phải mọi trait đều dùng làm trait object được. Một method có tham số kiểu generic hoặc trả Self có thể cần giới hạn Self: Sized và không được gọi qua dyn. Trong ví dụ, summary(&self) -> String giữ hợp đồng rõ và có thể được gọi qua trait object.",
        "code": "trait Summary {\n    fn summary(&self) -> String;\n}\n// Có thể dùng Box<dyn Summary> cho giao diện này."
      }
    ],
    "tip": "Nếu tập hợp biến thể đã cố định và bạn cần xử lý từng biến thể, enum cũng là một lựa chọn rõ ràng.",
    "exercise": {
      "title": "Gom nội dung từ nhiều kiểu",
      "instructions": "Hoàn thiện summaries để gọi summary trên từng phần tử Box<dyn Summary>, giữ nguyên thứ tự.",
      "requirements": [
        "Không phân nhánh theo kiểu cụ thể",
        "Kết quả là Vec<String>",
        "Chạy với danh sách hỗn hợp User và LessonCard"
      ]
    },
    "starterCode": "trait Summary {\n    fn summary(&self) -> String;\n}\nstruct User { name: String }\nstruct LessonCard { title: String }\nimpl Summary for User {\n    fn summary(&self) -> String { format!(\"Người học: {}\", self.name) }\n}\nimpl Summary for LessonCard {\n    fn summary(&self) -> String { format!(\"Bài học: {}\", self.title) }\n}\n\nfn summaries(items: &[Box<dyn Summary>]) -> Vec<String> {\n    todo!(\"Gọi hành vi Summary trên từng phần tử\")\n}\n\nfn main() {\n    assert!(summaries(&[]).is_empty());\n    let items: Vec<Box<dyn Summary>> = vec![\n        Box::new(User { name: String::from(\"An\") }),\n        Box::new(LessonCard { title: String::from(\"Ownership\") }),\n    ];\n    let result = summaries(&items);\n    assert_eq!(result, vec![\"Người học: An\", \"Bài học: Ownership\"]);\n    println!(\"{}\", result.join(\" | \"));\n}",
    "solutionCode": "trait Summary {\n    fn summary(&self) -> String;\n}\nstruct User { name: String }\nstruct LessonCard { title: String }\nimpl Summary for User {\n    fn summary(&self) -> String { format!(\"Người học: {}\", self.name) }\n}\nimpl Summary for LessonCard {\n    fn summary(&self) -> String { format!(\"Bài học: {}\", self.title) }\n}\n\nfn summaries(items: &[Box<dyn Summary>]) -> Vec<String> {\n    items.iter().map(|item| item.summary()).collect()\n}\n\nfn main() {\n    assert!(summaries(&[]).is_empty());\n    let items: Vec<Box<dyn Summary>> = vec![\n        Box::new(User { name: String::from(\"An\") }),\n        Box::new(LessonCard { title: String::from(\"Ownership\") }),\n    ];\n    let result = summaries(&items);\n    assert_eq!(result, vec![\"Người học: An\", \"Bài học: Ownership\"]);\n    println!(\"{}\", result.join(\" | \"));\n}",
    "expectedOutput": "Người học: An | Bài học: Ownership\n",
    "hints": [
      "Mỗi item đều cho phép gọi summary(), dù kiểu bên trong khác nhau.",
      "Dùng iter().map(|item| item.summary()).collect()."
    ],
    "quiz": {
      "question": "Box<dyn Summary> cho phép làm gì?",
      "options": [
        "Truy cập mọi trường của kiểu bên trong",
        "Gọi các method phù hợp trong giao diện Summary",
        "Tự động clone mọi đối tượng",
        "Bỏ kiểm tra lifetime"
      ],
      "correct": 1,
      "explanation": "Trait object che kiểu cụ thể và cung cấp giao diện hành vi do trait định nghĩa."
    },
    "reference": {
      "label": "The Rust Book · Trait Objects",
      "url": "https://doc.rust-lang.org/book/ch18-02-trait-objects.html"
    }
  },
  {
    "id": "unsafe-basics",
    "moduleId": "advanced",
    "title": "Unsafe: Hợp đồng nhỏ, chứng minh rõ",
    "description": "Đọc một raw pointer trong một wrapper an toàn với điều kiện hợp lệ được ghi cụ thể.",
    "duration": 40,
    "objectives": [
      "Phân biệt tạo raw pointer với dereference",
      "Ghi rõ điều kiện an toàn của một unsafe block",
      "Ưu tiên API an toàn khi đã có"
    ],
    "sections": [
      {
        "title": "Unsafe không tắt toàn bộ Rust",
        "text": "Một unsafe block cho phép một số thao tác compiler không tự chứng minh được, như dereference raw pointer. Kiểm tra kiểu và nhiều quy tắc sở hữu vẫn áp dụng. Từ unsafe không làm pointer rỗng, dangling hoặc sai alignment trở nên hợp lệ."
      },
      {
        "title": "Chứng minh trước khi đọc",
        "text": "Slice cung cấp pointer đến dữ liệu và độ dài. Trước khi đọc phần tử đầu qua raw pointer, cần chắc slice không rỗng, dữ liệu còn sống, đã khởi tạo và pointer có alignment phù hợp. Bài này lấy pointer trực tiếp từ slice đang được mượn, nên phạm vi chứng minh nhỏ."
      },
      {
        "title": "Đóng hợp đồng sau API an toàn",
        "text": "Wrapper có thể là hàm an toàn nếu nó tự kiểm tra đủ điều kiện trước unsafe. Trong mã sản phẩm, values.first().copied().unwrap_or(0) đã giải quyết ví dụ này mà không cần unsafe. Bài học nhằm đọc và chứng minh một đoạn unsafe, không khuyến khích thay mọi truy cập an toàn bằng pointer."
      }
    ],
    "tip": "Chú thích SAFETY cần giải thích vì sao thao tác hợp lệ ở đây, không chỉ nói rằng nó là an toàn.",
    "exercise": {
      "title": "Đọc đầu slice có kiểm tra",
      "instructions": "Hoàn thiện first_or_zero. Với slice rỗng trả 0; với slice không rỗng, đọc phần tử đầu qua pointer được tạo từ chính slice.",
      "requirements": [
        "Nhánh rỗng kết thúc trước dereference",
        "Giữ unsafe block nhỏ và ghi SAFETY",
        "Không tạo pointer từ địa chỉ số nguyên"
      ]
    },
    "starterCode": "fn first_or_zero(values: &[u32]) -> u32 {\n    todo!(\"Kiểm tra rỗng trước khi đọc pointer của slice\")\n}\n\nfn main() {\n    assert_eq!(first_or_zero(&[]), 0);\n    assert_eq!(first_or_zero(&[0]), 0);\n    assert_eq!(first_or_zero(&[9, 7]), 9);\n    for values in [vec![], vec![3], vec![8, 2, 4]] {\n        assert_eq!(first_or_zero(&values), values.first().copied().unwrap_or(0));\n    }\n    println!(\"Phần tử đầu: {}\", first_or_zero(&[9, 7]));\n}",
    "solutionCode": "fn first_or_zero(values: &[u32]) -> u32 {\n    if values.is_empty() {\n        return 0;\n    }\n    let pointer = values.as_ptr();\n    // SAFETY: slice không rỗng; phần tử đầu đã khởi tạo, đúng alignment\n    // và dữ liệu còn sống trong suốt lượt mượn values.\n    unsafe { *pointer }\n}\n\nfn main() {\n    assert_eq!(first_or_zero(&[]), 0);\n    assert_eq!(first_or_zero(&[0]), 0);\n    assert_eq!(first_or_zero(&[9, 7]), 9);\n    for values in [vec![], vec![3], vec![8, 2, 4]] {\n        assert_eq!(first_or_zero(&values), values.first().copied().unwrap_or(0));\n    }\n    println!(\"Phần tử đầu: {}\", first_or_zero(&[9, 7]));\n}",
    "expectedOutput": "Phần tử đầu: 9\n",
    "hints": [
      "Trả 0 ngay khi values.is_empty(); tuyệt đối không dereference pointer của slice rỗng.",
      "Sau kiểm tra, values.as_ptr() trỏ tới phần tử đầu hợp lệ; ghi lý do ở chú thích SAFETY."
    ],
    "quiz": {
      "question": "Một unsafe block có cho phép dereference một pointer không hợp lệ không?",
      "options": [
        "Có, compiler không còn quan tâm",
        "Không; người viết vẫn phải bảo đảm mọi điều kiện hợp lệ",
        "Chỉ trong debug",
        "Có nếu pointer là const"
      ],
      "correct": 1,
      "explanation": "Unsafe chuyển trách nhiệm chứng minh một số điều kiện sang người viết, không cho phép hành vi không xác định."
    },
    "reference": {
      "label": "The Rust Book · Unsafe Rust",
      "url": "https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html"
    }
  },
  {
    "id": "ffi-layout",
    "moduleId": "advanced",
    "title": "FFI và repr(C): Hiểu bố cục dữ liệu",
    "description": "Tách bố cục tương thích C khỏi định dạng byte dùng để lưu hoặc truyền dữ liệu.",
    "duration": 40,
    "objectives": [
      "Đọc size, alignment và offset của struct",
      "Hiểu vai trò và giới hạn của repr(C)",
      "Mã hóa số nguyên bằng thứ tự byte rõ ràng"
    ],
    "sections": [
      {
        "title": "Bố cục mặc định không phải hợp đồng C",
        "text": "Rust có thể sắp xếp các trường của struct theo quy tắc biểu diễn mặc định. repr(C) yêu cầu bố cục theo quy tắc C trên target đang dùng: thứ tự trường được giữ và có thể có padding để đáp ứng alignment. Kích thước cụ thể vẫn liên quan nền tảng.",
        "code": "#[repr(C)]\nstruct Header {\n    kind: u8,\n    flags: u8,\n    length: u16,\n}"
      },
      {
        "title": "Layout và ranh giới hàm là hai phần riêng",
        "text": "repr(C) chỉ giải quyết phần biểu diễn dữ liệu. Một ranh giới FFI còn cần ABI lời gọi đúng và thỏa thuận về quyền sở hữu, tính hợp lệ, tuổi thọ của dữ liệu. Không đưa String hay Vec qua C rồi giả định chúng có layout như struct C tương ứng."
      },
      {
        "title": "Wire format cần byte order rõ ràng",
        "text": "Không dump nguyên vùng nhớ của struct để tạo gói tin: padding và endianness không phải hợp đồng truyền dữ liệu. Hãy mã hóa từng trường, chẳng hạn length.to_le_bytes(). Bài này chỉ đo layout và mã hóa an toàn; không liên kết hoặc gọi thư viện C bên ngoài."
      }
    ],
    "tip": "Tương thích bố cục C trên một target không đồng nghĩa có cùng định dạng file trên mọi máy.",
    "exercise": {
      "title": "Mã hóa header bốn byte",
      "instructions": "Hoàn thiện encode_header để trả kind, flags và hai byte little-endian của length. Giữ kiểm tra layout riêng khỏi kiểm tra dữ liệu mã hóa.",
      "requirements": [
        "Dùng to_le_bytes cho length",
        "Không transmute hoặc đọc vùng padding",
        "length 513 phải thành hai byte 1 và 2"
      ]
    },
    "starterCode": "use std::mem::{align_of, offset_of, size_of};\n\n#[repr(C)]\nstruct Header { kind: u8, flags: u8, length: u16 }\n\nfn encode_header(header: &Header) -> [u8; 4] {\n    todo!(\"Mã hóa từng trường với little-endian rõ ràng\")\n}\n\nfn main() {\n    assert_eq!(offset_of!(Header, kind), 0);\n    assert_eq!(offset_of!(Header, flags), 1);\n    assert_eq!(offset_of!(Header, length) % align_of::<u16>(), 0);\n    assert!(size_of::<Header>() >= 4);\n    assert!(align_of::<Header>() >= align_of::<u16>());\n    assert_eq!(encode_header(&Header { kind: 0, flags: 0, length: 0 }), [0, 0, 0, 0]);\n    assert_eq!(encode_header(&Header { kind: 1, flags: 0, length: 65535 }), [1, 0, 255, 255]);\n    let bytes = encode_header(&Header { kind: 1, flags: 2, length: 513 });\n    assert_eq!(bytes, [1, 2, 1, 2]);\n    println!(\"Gói tin: {bytes:?}\");\n}",
    "solutionCode": "use std::mem::{align_of, offset_of, size_of};\n\n#[repr(C)]\nstruct Header { kind: u8, flags: u8, length: u16 }\n\nfn encode_header(header: &Header) -> [u8; 4] {\n    let length = header.length.to_le_bytes();\n    [header.kind, header.flags, length[0], length[1]]\n}\n\nfn main() {\n    assert_eq!(offset_of!(Header, kind), 0);\n    assert_eq!(offset_of!(Header, flags), 1);\n    assert_eq!(offset_of!(Header, length) % align_of::<u16>(), 0);\n    assert!(size_of::<Header>() >= 4);\n    assert!(align_of::<Header>() >= align_of::<u16>());\n    assert_eq!(encode_header(&Header { kind: 0, flags: 0, length: 0 }), [0, 0, 0, 0]);\n    assert_eq!(encode_header(&Header { kind: 1, flags: 0, length: 65535 }), [1, 0, 255, 255]);\n    let bytes = encode_header(&Header { kind: 1, flags: 2, length: 513 });\n    assert_eq!(bytes, [1, 2, 1, 2]);\n    println!(\"Gói tin: {bytes:?}\");\n}",
    "expectedOutput": "Gói tin: [1, 2, 1, 2]\n",
    "hints": [
      "to_le_bytes của u16 trả [u8; 2].",
      "Ghép header.kind, header.flags, length[0] và length[1]; không đọc bộ nhớ struct dưới dạng byte."
    ],
    "quiz": {
      "question": "repr(C) có tự định nghĩa một định dạng byte truyền mạng độc lập nền tảng không?",
      "options": [
        "Có, luôn là little-endian",
        "Không; cần định nghĩa byte order và mã hóa từng trường",
        "Có, mọi struct luôn không có padding",
        "Chỉ cần thêm Copy"
      ],
      "correct": 1,
      "explanation": "repr(C) mô tả bố cục theo C trên target; định dạng truyền dữ liệu cần hợp đồng byte riêng."
    },
    "reference": {
      "label": "The Rust Reference · Type Layout",
      "url": "https://doc.rust-lang.org/reference/type-layout.html"
    }
  }
];
