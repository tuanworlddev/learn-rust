import { foundationLessons } from "./curriculum-foundations";
import { systemLessons } from "./curriculum-systems";
import { practiceLessons } from "./curriculum-practice";

export type CourseModule = {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  level: string;
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  duration: number;
  objectives: string[];
  sections: { title: string; text: string; code?: string }[];
  tip: string;
  exercise: { title: string; instructions: string; requirements: string[] };
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
  hints: string[];
  quiz: { question: string; options: string[]; correct: number; explanation: string };
  reference: { label: string; url: string };
  localLab?: {
    title: string;
    instructions: string;
    files: { path: string; content: string }[];
    commands: string[];
    checks: string[];
  };
  illustration?: { src: string; alt: string; caption: string };
  simulation?: import("./specialization-types").LessonSimulation;
};

export const modules: CourseModule[] = [
  {
    "id": "setup",
    "title": "Bắt đầu & Công cụ",
    "description": "Làm quen Rust, cài công cụ, sử dụng Cargo và đọc lỗi.",
    "color": "orange",
    "icon": "book",
    "level": "Nhập môn"
  },
  {
    "id": "basics",
    "title": "Biến & Kiểu dữ liệu",
    "description": "Giá trị, kiểu cơ bản, hằng số và chuyển đổi kiểu.",
    "color": "orange",
    "icon": "book",
    "level": "Nhập môn"
  },
  {
    "id": "flow",
    "title": "Hàm & Luồng điều khiển",
    "description": "Hàm, biểu thức, phạm vi, điều kiện và vòng lặp.",
    "color": "orange",
    "icon": "book",
    "level": "Nhập môn"
  },
  {
    "id": "ownership",
    "title": "Ownership & Borrowing",
    "description": "Sở hữu, mượn dữ liệu, slice và lifetime.",
    "color": "orange",
    "icon": "book",
    "level": "Cơ bản"
  },
  {
    "id": "types",
    "title": "Struct & Enum",
    "description": "Mô hình dữ liệu, method và pattern matching.",
    "color": "orange",
    "icon": "book",
    "level": "Cơ bản"
  },
  {
    "id": "collections",
    "title": "Collections & Chuỗi",
    "description": "Vec, String, Unicode, HashMap và HashSet.",
    "color": "orange",
    "icon": "book",
    "level": "Cơ bản"
  },
  {
    "id": "errors",
    "title": "Option & Result",
    "description": "Giá trị vắng mặt, lan truyền lỗi và lỗi tùy chỉnh.",
    "color": "orange",
    "icon": "book",
    "level": "Cơ bản"
  },
  {
    "id": "modules",
    "title": "Tổ chức dự án",
    "description": "Module, phạm vi truy cập, dependency và workspace.",
    "color": "orange",
    "icon": "book",
    "level": "Cơ bản"
  },
  {
    "id": "generics",
    "title": "Generic & Trait",
    "description": "Tái sử dụng mã, ràng buộc và associated type.",
    "color": "orange",
    "icon": "book",
    "level": "Trung cấp"
  },
  {
    "id": "iteration",
    "title": "Closure & Iterator",
    "description": "Closure, xử lý chuỗi phần tử và iterator tự định nghĩa.",
    "color": "orange",
    "icon": "book",
    "level": "Trung cấp"
  },
  {
    "id": "smart",
    "title": "Smart pointers",
    "description": "Box, Rc, RefCell và Weak.",
    "color": "orange",
    "icon": "book",
    "level": "Trung cấp"
  },
  {
    "id": "lifetimes",
    "title": "Lifetime nâng cao",
    "description": "Tham chiếu trong struct, static, Cow và Drop.",
    "color": "orange",
    "icon": "book",
    "level": "Trung cấp"
  },
  {
    "id": "testing",
    "title": "Kiểm thử & Chất lượng",
    "description": "Unit test, integration test, doctest, fmt và Clippy.",
    "color": "orange",
    "icon": "book",
    "level": "Trung cấp"
  },
  {
    "id": "io",
    "title": "I/O & Dòng lệnh",
    "description": "Tệp, bộ đệm, tham số CLI và báo lỗi.",
    "color": "orange",
    "icon": "book",
    "level": "Ứng dụng"
  },
  {
    "id": "concurrency",
    "title": "Concurrency",
    "description": "Thread, channel, Arc, Mutex, Send và Sync.",
    "color": "orange",
    "icon": "book",
    "level": "Nâng cao"
  },
  {
    "id": "async",
    "title": "Async & Future",
    "description": "Async/await, polling, Pin và cách executor hoạt động.",
    "color": "orange",
    "icon": "book",
    "level": "Nâng cao"
  },
  {
    "id": "macros",
    "title": "Macro & Thuộc tính",
    "description": "macro_rules!, lặp token, derive và biên dịch có điều kiện.",
    "color": "orange",
    "icon": "book",
    "level": "Nâng cao"
  },
  {
    "id": "advanced",
    "title": "Rust nâng cao",
    "description": "Trait object, pattern nâng cao, unsafe và bố trí FFI.",
    "color": "orange",
    "icon": "book",
    "level": "Nâng cao"
  },
  {
    "id": "design",
    "title": "Thiết kế & Hiệu năng",
    "description": "Newtype, typestate, cấp phát và đo hiệu năng.",
    "color": "orange",
    "icon": "book",
    "level": "Nâng cao"
  },
  {
    "id": "practice",
    "title": "Dự án tổng hợp",
    "description": "Xử lý dữ liệu, tìm kiếm văn bản, parser và công việc song song.",
    "color": "orange",
    "icon": "book",
    "level": "Ứng dụng"
  }
];

const coreLessons: Lesson[] = [
  {
    id: "hello-rust", moduleId: "basics", title: "Xin chào, Rust!",
    description: "Viết và chạy chương trình Rust đầu tiên của bạn.", duration: 10,
    objectives: ["Nhận biết điểm bắt đầu của chương trình", "In nội dung bằng println!", "Đọc kết quả và thông báo của trình biên dịch"],
    sections: [
      { title: "Một chương trình nhỏ, một khởi đầu mới", text: "Rust là ngôn ngữ biên dịch: mã nguồn được kiểm tra rồi chuyển thành chương trình có thể chạy. Trong một chương trình thực thi đơn giản, Rust bắt đầu từ hàm main. Cặp ngoặc nhọn bao quanh những lệnh thuộc về hàm đó.", code: "fn main() {\n    // Chương trình bắt đầu tại đây.\n}" },
      { title: "Gửi lời chào bằng println!", text: "println! in văn bản ra đầu ra chuẩn rồi xuống dòng. Dấu chấm than cho biết đây là một macro, còn văn bản nằm trong dấu ngoặc kép là chuỗi. Đặt dấu chấm phẩy cuối lời gọi khi dùng nó như một câu lệnh.", code: "fn main() {\n    println!(\"Mình đang học Rust.\");\n}" },
      { title: "Đọc, sửa, chạy lại", text: "Nhấn Chạy mã để biên dịch và thực thi nội dung trong trình soạn thảo. Nếu gặp lỗi, hãy đọc số dòng và phần giải thích đầu tiên trước khi sửa. Chạy mã hiển thị kết quả; Kiểm tra bài đối chiếu với yêu cầu của bài tập. Bạn không cần cài Rust để bắt đầu trên trang này." },
    ],
    tip: "Chú thích bắt đầu bằng // giúp bạn ghi chú; Rust sẽ không thực thi phần chú thích.",
    exercise: { title: "Lời chào đầu tiên", instructions: "Hoàn thiện hàm main để in chính xác một dòng: Xin chào, Rust!", requirements: ["Sử dụng println! trong hàm main", "Giữ nguyên dấu tiếng Việt và dấu chấm than", "Không in thêm dòng khác"] },
    starterCode: "fn main() {\n    // In lời chào: Xin chào, Rust!\n}",
    solutionCode: "fn main() {\n    println!(\"Xin chào, Rust!\");\n}",
    expectedOutput: "Xin chào, Rust!\n",
    hints: ["Đặt lời chào trong dấu ngoặc kép.", "Cú pháp cần dùng là println!(\"nội dung\");"],
    quiz: { question: "Chương trình thực thi Rust đơn giản bắt đầu ở đâu?", options: ["Hàm main", "Dòng chú thích đầu tiên", "Hàm start", "Lời gọi println! đầu tiên"], correct: 0, explanation: "main là điểm vào của chương trình thực thi Rust thông thường." },
    reference: { label: "The Rust Book · Hello, World!", url: "https://doc.rust-lang.org/book/ch01-02-hello-world.html" },
  },
  {
    "id": "variables",
    "moduleId": "basics",
    "title": "Biến & Kiểu dữ liệu",
    "description": "Lưu dữ liệu, phân biệt tính bất biến và thay đổi có chủ đích.",
    "duration": 15,
    "objectives": [
      "Khai báo biến với let và kiểu số",
      "Phân biệt mut với shadowing",
      "Dùng giá trị biến trong chuỗi định dạng"
    ],
    "sections": [
      {
        "title": "Một tên gọi cho một giá trị",
        "text": "let tạo một biến. Rust thường suy luận kiểu từ giá trị hoặc cách sử dụng, nhưng bạn cũng có thể ghi rõ kiểu sau dấu hai chấm. i32 là số nguyên có dấu 32 bit; u32 là số nguyên không dấu; f64 là số thực; bool chỉ có true hoặc false.",
        "code": "let price: u32 = 120_000;\nlet available: bool = true;\nlet rating: f64 = 4.8;"
      },
      {
        "title": "Bất biến là mặc định",
        "text": "Biến khai báo bằng let không thể bị gán lại theo mặc định. Thêm mut khi giá trị cần thay đổi theo thời gian. Shadowing dùng một let mới với cùng tên: nó tạo biến mới và thậm chí có thể thay đổi kiểu dữ liệu, khác với việc gán lại một biến mut.",
        "code": "let mut stock = 10;\nstock -= 1;\n\nlet spaces = \"   \";\nlet spaces = spaces.len(); // Binding mới có kiểu usize.\nassert_eq!(spaces, 3);"
      },
      {
        "title": "Tính toán và hiển thị",
        "text": "Các toán tử +, -, *, / và % hoạt động trên những kiểu số phù hợp. Dấu gạch dưới trong 120_000 chỉ giúp đọc dễ hơn, không thay đổi giá trị. Bạn có thể chèn tên biến vào cặp ngoặc nhọn trong println! để trình bày kết quả.",
        "code": "let total = 120_000 * 3;\nprintln!(\"Tổng: {total}\");"
      }
    ],
    "tip": "Chỉ thêm mut khi thật sự cần thay đổi biến. Trình biên dịch sẽ nhắc nếu mut đang dư thừa.",
    "exercise": {
      "title": "Tính tiền giỏ hàng",
      "instructions": "Một sản phẩm giá 120.000 VND, khách mua 3 sản phẩm. Tính total từ unit_price và quantity, giữ các kiểm tra trong main.",
      "requirements": [
        "Tính bằng phép nhân hai biến đã cho",
        "Để các assert_eq! chạy thành công",
        "In: Tổng tiền: 360000 VND"
      ]
    },
    "starterCode": "fn main() {\n    let unit_price: u32 = 120_000;\n    let quantity: u32 = 3;\n    let total: u32 = todo!(\"Tính tổng tiền\");\n\n    assert_eq!(total, 360_000);\n    println!(\"Tổng tiền: {total} VND\");\n}",
    "solutionCode": "fn main() {\n    let unit_price: u32 = 120_000;\n    let quantity: u32 = 3;\n    let total = unit_price * quantity;\n\n    assert_eq!(total, 360_000);\n    println!(\"Tổng tiền: {total} VND\");\n}",
    "expectedOutput": "Tổng tiền: 360000 VND\n",
    "hints": [
      "Dùng toán tử * để nhân hai giá trị.",
      "Thay todo!(...) bằng unit_price * quantity."
    ],
    "quiz": {
      "question": "Khai báo nào cho phép gán lại giá trị cho count?",
      "options": [
        "let count = 0;",
        "const count: i32 = 0;",
        "let mut count = 0;",
        "let count: i32 = 0;"
      ],
      "correct": 2,
      "explanation": "mut cho phép thay đổi giá trị của biến đã khai báo. Ghi kiểu i32 không tự làm biến có thể thay đổi."
    },
    "reference": {
      "label": "The Rust Book · Variables and Mutability",
      "url": "https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html"
    }
  },
  {
    "id": "functions",
    "moduleId": "basics",
    "title": "Hàm & Biểu thức",
    "description": "Chia nhỏ bài toán thành những hàm dễ đọc và tái sử dụng.",
    "duration": 15,
    "objectives": [
      "Viết hàm có tham số và kiểu trả về",
      "Phân biệt câu lệnh và biểu thức",
      "Kiểm tra hàm bằng assert_eq!"
    ],
    "sections": [
      {
        "title": "Gói một công việc trong một hàm",
        "text": "Dùng fn để khai báo hàm và snake_case để đặt tên theo quy ước Rust. Mỗi tham số cần có kiểu rõ ràng. Ký hiệu mũi tên chỉ kiểu của giá trị hàm trả về, giúp người đọc biết hợp đồng của hàm mà chưa cần xem phần thân.",
        "code": "fn double(value: i32) -> i32 {\n    value * 2\n}"
      },
      {
        "title": "Dòng cuối có thể là kết quả",
        "text": "Trong Rust, nhiều cấu trúc là biểu thức và tạo ra một giá trị. Biểu thức cuối của thân hàm, nếu không có dấu chấm phẩy, trở thành giá trị trả về. Thêm dấu chấm phẩy sẽ biến nó thành câu lệnh; khi đó hàm không trả giá trị số như chữ ký đã hứa.",
        "code": "fn add(a: i32, b: i32) -> i32 {\n    a + b\n}\n\n// return a + b; cũng hợp lệ."
      },
      {
        "title": "Kiểm tra bằng nhiều đầu vào",
        "text": "assert_eq! so sánh hai giá trị và dừng chương trình nếu chúng khác nhau. Đây là cách gọn để kiểm tra lời giải trong bài học. Hãy thử cả giá trị thông thường và trường hợp biên như một chiều bằng 0 để tránh hàm chỉ đúng cho một ví dụ."
      }
    ],
    "tip": "Dùng return khi cần thoát sớm; ở cuối hàm, biểu thức không có dấu chấm phẩy thường dễ đọc hơn.",
    "exercise": {
      "title": "Diện tích hình chữ nhật",
      "instructions": "Viết hàm area nhận chiều rộng và chiều cao, trả về diện tích. Hoàn thiện phần todo!, giữ nguyên main để kiểm tra. Dữ liệu của bài này được giới hạn để các phép tính số nguyên không tràn; khi nhận dữ liệu tùy ý, cần thiết kế kiểm tra giới hạn hoặc dùng checked_*.",
      "requirements": [
        "Trả về width nhân height",
        "Xử lý được một chiều bằng 0",
        "In: Diện tích: 24"
      ]
    },
    "starterCode": "fn area(width: u32, height: u32) -> u32 {\n    todo!(\"Trả về diện tích\")\n}\n\nfn main() {\n    assert_eq!(area(4, 6), 24);\n    assert_eq!(area(0, 8), 0);\n    assert_eq!(area(3, 3), 9);\n    println!(\"Diện tích: {}\", area(4, 6));\n}",
    "solutionCode": "fn area(width: u32, height: u32) -> u32 {\n    width * height\n}\n\nfn main() {\n    assert_eq!(area(4, 6), 24);\n    assert_eq!(area(0, 8), 0);\n    assert_eq!(area(3, 3), 9);\n    println!(\"Diện tích: {}\", area(4, 6));\n}",
    "expectedOutput": "Diện tích: 24\n",
    "hints": [
      "Một biểu thức cuối hàm không cần return.",
      "Viết width * height và không thêm dấu chấm phẩy."
    ],
    "quiz": {
      "question": "Vì sao biểu thức cuối hàm trả về số thường không có dấu chấm phẩy?",
      "options": [
        "Để chương trình chạy nhanh hơn",
        "Để giá trị biểu thức trở thành giá trị trả về",
        "Vì Rust không có dấu chấm phẩy",
        "Để biến trở thành mut"
      ],
      "correct": 1,
      "explanation": "Dấu chấm phẩy biến biểu thức thành câu lệnh. Biểu thức cuối không có dấu chấm phẩy cung cấp kết quả cho hàm."
    },
    "reference": {
      "label": "The Rust Book · Functions",
      "url": "https://doc.rust-lang.org/book/ch03-03-how-functions-work.html"
    }
  },
  {
    "id": "control-flow",
    "moduleId": "basics",
    "title": "Điều kiện & Vòng lặp",
    "description": "Ra quyết định bằng if và xử lý dãy dữ liệu bằng for.",
    "duration": 20,
    "objectives": [
      "Dùng điều kiện bool với if",
      "Lặp qua một khoảng bao gồm cận cuối",
      "Kết hợp vòng lặp và biến tích lũy"
    ],
    "sections": [
      {
        "title": "Chọn một nhánh bằng if",
        "text": "if yêu cầu điều kiện có kiểu bool; Rust không tự coi số 0 là false. if cũng là biểu thức nên bạn có thể gán kết quả của nó vào biến. Các nhánh trả giá trị cần có kiểu tương thích.",
        "code": "let score = 8;\nlet result = if score >= 5 { \"Đạt\" } else { \"Thử lại\" };"
      },
      {
        "title": "Lặp với một khoảng rõ ràng",
        "text": "Vòng for đi qua từng phần tử của một giá trị có thể lặp. Khoảng 1..5 bao gồm 1, 2, 3, 4; khoảng 1..=5 có thêm 5. Chọn đúng loại khoảng giúp tránh lỗi thiếu hoặc thừa một phần tử.",
        "code": "for number in 1..=3 {\n    println!(\"{number}\");\n}"
      },
      {
        "title": "Kết hợp lọc và tích lũy",
        "text": "Toán tử % trả về phần dư, nên number % 2 == 0 nhận biết số chẵn. Một biến mut bên ngoài vòng lặp có thể lưu tổng qua nhiều lượt. Rust cũng có while cho điều kiện lặp và loop cho vòng lặp cần break để kết thúc."
      }
    ],
    "tip": "Trước khi chạy, hãy tự tính kết quả với một đầu vào nhỏ. Cách này giúp phát hiện lỗi khoảng lặp rất nhanh.",
    "exercise": {
      "title": "Cộng các số chẵn",
      "instructions": "Hoàn thiện sum_even để cộng tất cả số chẵn từ 1 đến limit, có tính limit nếu limit chẵn. Dữ liệu của bài này được giới hạn để các phép tính số nguyên không tràn; khi nhận dữ liệu tùy ý, cần thiết kế kiểm tra giới hạn hoặc dùng checked_*.",
      "requirements": [
        "Dùng for và if",
        "limit bằng 0 trả về 0",
        "Với limit bằng 10, kết quả là 30"
      ]
    },
    "starterCode": "fn sum_even(limit: u32) -> u32 {\n    todo!(\"Cộng các số chẵn từ 1 đến limit\")\n}\n\nfn main() {\n    assert_eq!(sum_even(0), 0);\n    assert_eq!(sum_even(5), 6);\n    assert_eq!(sum_even(10), 30);\n    println!(\"Tổng số chẵn: {}\", sum_even(10));\n}",
    "solutionCode": "fn sum_even(limit: u32) -> u32 {\n    let mut total = 0;\n    for number in 1..=limit {\n        if number % 2 == 0 {\n            total += number;\n        }\n    }\n    total\n}\n\nfn main() {\n    assert_eq!(sum_even(0), 0);\n    assert_eq!(sum_even(5), 6);\n    assert_eq!(sum_even(10), 30);\n    println!(\"Tổng số chẵn: {}\", sum_even(10));\n}",
    "expectedOutput": "Tổng số chẵn: 30\n",
    "hints": [
      "Tạo let mut total = 0 trước vòng lặp.",
      "Lặp 1..=limit, cộng number vào total khi number % 2 == 0."
    ],
    "quiz": {
      "question": "Khoảng 1..=4 gồm những giá trị nào?",
      "options": [
        "1, 2, 3",
        "0, 1, 2, 3",
        "1, 2, 3, 4",
        "Chỉ 1 và 4"
      ],
      "correct": 2,
      "explanation": "..= bao gồm cận cuối, nên 1..=4 có cả số 4."
    },
    "reference": {
      "label": "The Rust Book · Control Flow",
      "url": "https://doc.rust-lang.org/book/ch03-05-control-flow.html"
    }
  },
  {
    "id": "ownership",
    "moduleId": "ownership",
    "title": "Ownership: Ai sở hữu dữ liệu?",
    "description": "Hiểu move, Copy và khi nào cần tạo bản sao độc lập.",
    "duration": 25,
    "objectives": [
      "Giải thích việc chuyển quyền sở hữu",
      "Phân biệt move, Copy và clone",
      "Sửa lỗi dùng một giá trị đã bị move"
    ],
    "sections": [
      {
        "title": "Dữ liệu có một chủ sở hữu",
        "text": "Mỗi giá trị có một owner tại một thời điểm. Khi owner ra khỏi phạm vi và giá trị chưa được chuyển đi, Rust dọn dẹp giá trị đó. Trình biên dịch kiểm tra các quy tắc sở hữu để ngăn những cách truy cập bộ nhớ không hợp lệ trong safe Rust.",
        "code": "{\n    let name = String::from(\"Rust\");\n    println!(\"{name}\");\n} // name hết phạm vi; String được dọn dẹp."
      },
      {
        "title": "Gán String có thể chuyển quyền sở hữu",
        "text": "String sở hữu một vùng dữ liệu có thể tăng kích thước. Gán một String sang biến khác mặc định chuyển quyền sở hữu, không tạo bản sao sâu. Sau move, biến cũ không còn được dùng. Những kiểu như i32 triển khai Copy nên phép gán giữ cả hai biến dùng được.",
        "code": "let first = String::from(\"Rust\");\nlet second = first;\n// println!(\"{first}\"); // Lỗi: first đã bị move.\nprintln!(\"{second}\");"
      },
      {
        "title": "Sao chép khi thật sự cần",
        "text": "clone tạo một giá trị mới theo implementation của kiểu. Với String, nội dung được sao chép để hai chuỗi có thể thay đổi độc lập; với Rc hoặc Arc sẽ học sau, clone thường chỉ tạo thêm handle cùng trỏ tới dữ liệu. Vì vậy clone không đồng nghĩa với sao chép sâu. Nếu chỉ cần đọc, borrowing thường phù hợp hơn việc tạo một giá trị sở hữu mới."
      },
      {
        "title": "Move khác địa chỉ bộ nhớ",
        "text": "Ownership nói ai chịu trách nhiệm cho giá trị; stack và heap nói về cách lưu dữ liệu. Move String chuyển quyền sở hữu bộ đệm, không mặc nhiên sao chép toàn bộ byte trên heap. Tham chiếu chỉ mượn dữ liệu còn hợp lệ. Safe Rust ngăn nhiều lỗi truy cập bộ nhớ, nhưng không hứa không có rò rỉ, deadlock hoặc lỗi nghiệp vụ. Khi review, hãy giải thích vì sao dữ liệu cần được mượn, move hay clone thay vì chỉ thử đến khi compiler chấp nhận."
      }
    ],
    "tip": "Hãy đọc một phép gán String như việc trao quyền quản lý dữ liệu, không mặc định là sao chép nội dung.",
    "exercise": {
      "title": "Giữ lại cả hai lời chào",
      "instructions": "Chương trình đang dùng name sau khi đã chuyển nó sang copy. Sửa đúng một dòng để cả hai biến sở hữu chuỗi độc lập.",
      "requirements": [
        "Sử dụng clone để tạo copy",
        "Giữ cả name và copy trong println!",
        "In: Rust | Rust"
      ]
    },
    "starterCode": "fn main() {\n    let name = String::from(\"Rust\");\n    let copy = name;\n\n    assert_eq!(name, copy);\n    println!(\"{name} | {copy}\");\n}",
    "solutionCode": "fn main() {\n    let name = String::from(\"Rust\");\n    let copy = name.clone();\n\n    assert_eq!(name, copy);\n    println!(\"{name} | {copy}\");\n}",
    "expectedOutput": "Rust | Rust\n",
    "hints": [
      "Phép gán hiện tại move giá trị String.",
      "Thay let copy = name; bằng let copy = name.clone();"
    ],
    "quiz": {
      "question": "Sau let b = a; với a là String và không gọi clone, điều gì xảy ra?",
      "options": [
        "Nội dung luôn được sao chép sâu",
        "a và b cùng là owner độc lập",
        "Quyền sở hữu được chuyển sang b",
        "String tự trở thành kiểu Copy"
      ],
      "correct": 2,
      "explanation": "String không triển khai Copy. Phép gán chuyển quyền sở hữu sang b và a không còn được dùng."
    },
    "reference": {
      "label": "The Rust Book · What Is Ownership?",
      "url": "https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html"
    }
  },
  {
    "id": "borrowing",
    "moduleId": "ownership",
    "title": "Borrowing & Tham chiếu",
    "description": "Cho hàm mượn dữ liệu mà không chuyển quyền sở hữu.",
    "duration": 25,
    "objectives": [
      "Dùng &T để mượn chỉ đọc",
      "Dùng &mut T để mượn có thể sửa",
      "Hiểu giới hạn tham chiếu cùng tồn tại"
    ],
    "sections": [
      {
        "title": "Đọc dữ liệu qua tham chiếu",
        "text": "Tham chiếu cho phép một hàm sử dụng dữ liệu do nơi khác sở hữu. Dùng & để tạo tham chiếu dùng chung; việc truyền tham chiếu này không move giá trị gốc. Sau lời gọi hàm, owner vẫn quản lý và có thể tiếp tục dùng dữ liệu.",
        "code": "fn byte_length(text: &str) -> usize {\n    text.len()\n}\n\nlet text = String::from(\"Rust\");\nlet length = byte_length(&text);"
      },
      {
        "title": "Mượn để chỉnh sửa",
        "text": "Một tham chiếu &mut T cho phép sửa dữ liệu được mượn. Với biến sở hữu String trong ví dụ, let mut cho phép tạo &mut String. Bản thân binding giữ một &mut T không nhất thiết phải có mut để sửa T: quyền sửa nằm trong kiểu tham chiếu. Thay đổi qua tham chiếu vẫn nằm trong dữ liệu do bên gọi sở hữu.",
        "code": "fn add_mark(text: &mut String) {\n    text.push('!');\n}\n\nlet mut text = String::from(\"Rust\");\nadd_mark(&mut text);"
      },
      {
        "title": "Chia sẻ hoặc độc quyền sửa",
        "text": "Đối với cách mượn thông thường, trong các khoảng sử dụng chồng nhau, bạn được có nhiều tham chiếu dùng chung hoặc một tham chiếu có thể sửa. Không được đồng thời dùng cả hai để truy cập cùng dữ liệu. Rust xét thời điểm tham chiếu thực sự được sử dụng, không chỉ dấu ngoặc phạm vi."
      },
      {
        "title": "Nhìn vào lần sử dụng cuối",
        "text": "Trong ví dụ, lần mượn đọc không còn được dùng trước khi mượn sửa bắt đầu. Nếu thêm println!(\"{reading}\") sau push, hai lượt sử dụng sẽ chồng nhau và compiler từ chối. Khi gặp lỗi borrow, thu ngắn phần việc dùng tham chiếu hoặc tách dữ liệu phù hợp; thêm clone hay unsafe không phải câu trả lời mặc định.",
        "code": "let mut text = String::from(\"Rust\");\nlet reading = &text;\nprintln!(\"{reading}\"); // Lần dùng reading cuối cùng.\nlet writing = &mut text;\nwriting.push('!');\nassert_eq!(text, \"Rust!\");"
      }
    ],
    "tip": "Nếu hàm chỉ đọc chuỗi, ưu tiên &str. Nếu hàm cần nối thêm vào String của bên gọi, dùng &mut String.",
    "exercise": {
      "title": "Thêm lời chào bằng tham chiếu",
      "instructions": "Viết append_rust để nối chuỗi ', Rust!' vào String được mượn. Không trả về String mới và không dùng clone.",
      "requirements": [
        "Nhận &mut String",
        "Nối bằng push_str",
        "Biến message ở main phải được cập nhật"
      ]
    },
    "starterCode": "fn append_rust(text: &mut String) {\n    todo!(\"Nối thêm vào chuỗi được mượn\");\n}\n\nfn main() {\n    let mut message = String::from(\"Xin chào\");\n    append_rust(&mut message);\n    assert_eq!(message, \"Xin chào, Rust!\");\n    println!(\"{message}\");\n}",
    "solutionCode": "fn append_rust(text: &mut String) {\n    text.push_str(\", Rust!\");\n}\n\nfn main() {\n    let mut message = String::from(\"Xin chào\");\n    append_rust(&mut message);\n    assert_eq!(message, \"Xin chào, Rust!\");\n    println!(\"{message}\");\n}",
    "expectedOutput": "Xin chào, Rust!\n",
    "hints": [
      "Bạn có thể gọi phương thức của String trực tiếp qua text.",
      "Phần thân hàm chỉ cần text.push_str(\", Rust!\");"
    ],
    "quiz": {
      "question": "Kiểu tham số nào cho phép nối thêm vào String của bên gọi?",
      "options": [
        "&str",
        "&String",
        "&mut String",
        "usize"
      ],
      "correct": 2,
      "explanation": "&mut String cho phép mượn độc quyền để sửa String đang thuộc bên gọi."
    },
    "reference": {
      "label": "The Rust Book · References and Borrowing",
      "url": "https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html"
    }
  },
  {
    "id": "slices",
    "moduleId": "ownership",
    "title": "Slice: Mượn một phần dữ liệu",
    "description": "Làm việc với một đoạn của mảng hoặc chuỗi mà không sao chép.",
    "duration": 20,
    "objectives": [
      "Tạo slice với chỉ số đầu và cuối",
      "Viết hàm nhận &[i32]",
      "Nhận biết ranh giới UTF-8 của string slice"
    ],
    "sections": [
      {
        "title": "Một cửa sổ nhìn vào dữ liệu",
        "text": "Slice [T] mô tả một dãy phần tử liên tiếp với độ dài được biết lúc chạy. Trong API, ta thường dùng tham chiếu &[T], gồm thông tin vị trí dữ liệu và độ dài; nó không sao chép hay sở hữu các phần tử. Một hàm nhận &[i32] dùng được với mảng, Vec hoặc một đoạn của chúng.",
        "code": "let values = [2, 4, 6, 8, 10];\nlet middle: &[i32] = &values[1..4];\n// middle chứa 4, 6, 8."
      },
      {
        "title": "Cận cuối không được lấy",
        "text": "Cú pháp start..end lấy từ start đến trước end. Chỉ số phải hợp lệ; truy cập sai có thể panic. Có thể bỏ cận đầu hoặc cuối, như &values[..2] hay &values[2..]. Khi chỉ số đến từ dữ liệu không tin cậy, phương thức get cho phép xử lý trường hợp ngoài phạm vi."
      },
      {
        "title": "String slice cần hiểu UTF-8",
        "text": "&str là một string slice chứa UTF-8 hợp lệ. Chỉ số cắt chuỗi là vị trí byte, không phải số thứ tự ký tự tiếng Việt. Cắt giữa các byte của một ký tự sẽ panic; với văn bản Unicode, nên dùng các phương thức như chars, split_whitespace hoặc get với ranh giới đã được kiểm tra."
      }
    ],
    "tip": "Khi hàm chỉ cần đọc một dãy, nhận slice giúp hàm dùng được cho nhiều nguồn dữ liệu hơn.",
    "exercise": {
      "title": "Tổng của một lát cắt",
      "instructions": "Hoàn thiện sum_slice để cộng các phần tử được mượn. Với phần giữa [4, 6, 8], kết quả là 18. Dữ liệu của bài này được giới hạn để các phép tính số nguyên không tràn; khi nhận dữ liệu tùy ý, cần thiết kế kiểm tra giới hạn hoặc dùng checked_*.",
      "requirements": [
        "Nhận &[i32], không nhận quyền sở hữu mảng",
        "Slice rỗng có tổng 0",
        "Không sửa dữ liệu gốc"
      ]
    },
    "starterCode": "fn sum_slice(values: &[i32]) -> i32 {\n    todo!(\"Cộng các phần tử trong slice\")\n}\n\nfn main() {\n    let values = [2, 4, 6, 8, 10];\n    assert_eq!(sum_slice(&[]), 0);\n    assert_eq!(sum_slice(&values[1..4]), 18);\n    assert_eq!(values[0], 2);\n    println!(\"Tổng lát cắt: {}\", sum_slice(&values[1..4]));\n}",
    "solutionCode": "fn sum_slice(values: &[i32]) -> i32 {\n    let mut total = 0;\n    for value in values {\n        total += value;\n    }\n    total\n}\n\nfn main() {\n    let values = [2, 4, 6, 8, 10];\n    assert_eq!(sum_slice(&[]), 0);\n    assert_eq!(sum_slice(&values[1..4]), 18);\n    assert_eq!(values[0], 2);\n    println!(\"Tổng lát cắt: {}\", sum_slice(&values[1..4]));\n}",
    "expectedOutput": "Tổng lát cắt: 18\n",
    "hints": [
      "Dùng một biến mut để cộng dồn như bài vòng lặp.",
      "for value in values { total += value; }"
    ],
    "quiz": {
      "question": "Với [10, 20, 30, 40], slice [1..3] chứa gì?",
      "options": [
        "10, 20, 30",
        "20, 30",
        "20, 30, 40",
        "10, 20"
      ],
      "correct": 1,
      "explanation": "Bắt đầu ở chỉ số 1 và dừng trước chỉ số 3, nên lấy 20 và 30."
    },
    "reference": {
      "label": "The Rust Book · The Slice Type",
      "url": "https://doc.rust-lang.org/book/ch04-03-slices.html"
    }
  },
  {
    "id": "lifetimes",
    "moduleId": "ownership",
    "title": "Lifetime: Tham chiếu sống bao lâu?",
    "description": "Mô tả mối quan hệ giữa tham chiếu đầu vào và đầu ra.",
    "duration": 25,
    "objectives": [
      "Hiểu mục đích của lifetime",
      "Đọc ký hiệu 'a trong chữ ký hàm",
      "Trả về một tham chiếu hợp lệ từ đầu vào"
    ],
    "sections": [
      {
        "title": "Tham chiếu không được sống lâu hơn dữ liệu",
        "text": "Rust cần bảo đảm dữ liệu vẫn tồn tại khi bạn dùng một tham chiếu đến nó. Lifetime mô tả khoảng mà tham chiếu hợp lệ. Nó không kéo dài tuổi thọ dữ liệu và không cấp phát thêm bộ nhớ; đây là thông tin giúp trình biên dịch kiểm tra quan hệ mượn."
      },
      {
        "title": "Khi có hai đầu vào tham chiếu",
        "text": "Nếu hàm nhận hai &str và trả về một trong hai, trình biên dịch cần biết đầu ra phụ thuộc vào đầu vào nào. Gắn cùng 'a cho hai đầu vào và đầu ra diễn tả rằng kết quả chỉ được dùng trong khoảng cả hai đầu vào còn cho phép mượn. Dữ liệu gốc vẫn có thể tồn tại lâu hơn khoảng mượn chung này.",
        "code": "fn choose_left<'a>(left: &'a str, _right: &'a str) -> &'a str {\n    left\n}"
      },
      {
        "title": "Chỉ ghi khi cần làm rõ quan hệ",
        "text": "Nhiều chữ ký hàm không cần viết lifetime vì Rust có các quy tắc suy luận. Một hàm nhận một &str và trả lại một phần của nó thường không cần 'a tường minh. Đừng thêm 'static để dập tắt lỗi: hãy tìm xem dữ liệu được sở hữu ở đâu và có thực sự sống đủ lâu không."
      },
      {
        "title": "Chữ ký hàm là hợp đồng với nơi gọi",
        "text": "Các lifetime đầu vào bị lược bỏ được xét riêng. Nếu chỉ có một lifetime đầu vào, Rust có thể dùng nó cho kết quả; với method có &self hoặc &mut self, kết quả bị lược bỏ thường gắn với lượt mượn self. Hai đầu vào khác nhau không tự cho một quan hệ duy nhất. Nếu hàm tạo String mới bên trong và cần trả dữ liệu đó, hãy trả String sở hữu, không trả &str tới biến sắp bị drop.",
        "code": "fn trimmed(text: &str) -> &str { text.trim() }\nfn title(name: &str) -> String { format!(\"Xin chào, {name}\") }"
      }
    ],
    "tip": "Đọc &'a str là: một chuỗi được mượn và hợp lệ trong khoảng 'a; đó không phải tên một vùng nhớ.",
    "exercise": {
      "title": "Chọn chuỗi dài hơn",
      "instructions": "Viết longer trả lại chuỗi có nhiều byte hơn. Nếu bằng nhau, trả về left. Các dữ liệu thử ở đây dùng ASCII để số byte bằng số ký tự.",
      "requirements": [
        "Giữ lifetime 'a trong chữ ký",
        "Trả về tham chiếu, không tạo String",
        "Nếu độ dài bằng nhau, ưu tiên left"
      ]
    },
    "starterCode": "fn longer<'a>(left: &'a str, right: &'a str) -> &'a str {\n    todo!(\"Trả về chuỗi dài hơn theo số byte\")\n}\n\nfn main() {\n    assert_eq!(longer(\"abc\", \"xyz\"), \"abc\");\n    assert_eq!(longer(\"\", \"Rust\"), \"Rust\");\n    println!(\"{}\", longer(\"Rust\", \"Ownership\"));\n}",
    "solutionCode": "fn longer<'a>(left: &'a str, right: &'a str) -> &'a str {\n    if left.len() >= right.len() { left } else { right }\n}\n\nfn main() {\n    assert_eq!(longer(\"abc\", \"xyz\"), \"abc\");\n    assert_eq!(longer(\"\", \"Rust\"), \"Rust\");\n    println!(\"{}\", longer(\"Rust\", \"Ownership\"));\n}",
    "expectedOutput": "Ownership\n",
    "hints": [
      "Dùng len() để so số byte trong mỗi &str.",
      "if left.len() >= right.len() { left } else { right }"
    ],
    "quiz": {
      "question": "Khai báo lifetime có làm dữ liệu sống lâu hơn không?",
      "options": [
        "Có, nó giữ dữ liệu trong bộ nhớ",
        "Không, nó mô tả quan hệ hợp lệ giữa các tham chiếu",
        "Có, nếu tên là 'a",
        "Chỉ với String"
      ],
      "correct": 1,
      "explanation": "Lifetime annotation không thay đổi thời gian sống thực tế. Nó giúp trình biên dịch kiểm tra quan hệ giữa các tham chiếu."
    },
    "reference": {
      "label": "The Rust Book · Validating References with Lifetimes",
      "url": "https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html"
    }
  },
  {
    id: "structs", moduleId: "types", title: "Struct: Gom dữ liệu có ý nghĩa",
    description: "Tạo kiểu dữ liệu riêng với các trường được đặt tên rõ ràng.", duration: 20,
    objectives: ["Định nghĩa một struct", "Khởi tạo và truy cập trường", "Dùng String khi struct cần sở hữu nội dung"],
    sections: [
      { title: "Đặt tên cho một nhóm dữ liệu", text: "Một struct gom các giá trị liên quan thành một kiểu. Mỗi trường có tên và kiểu riêng, nên bạn không phải nhớ vị trí như trong một tuple dài. Khi khởi tạo, cần cung cấp những trường mà struct yêu cầu.", code: "struct Product {\n    name: String,\n    price: u32,\n}" },
      { title: "Tạo một giá trị cụ thể", text: "Dùng tên kiểu và cặp ngoặc nhọn để tạo giá trị struct. Thứ tự trường lúc khởi tạo không nhất thiết trùng thứ tự khai báo. Cú pháp dấu chấm truy cập một trường; nếu muốn gán lại trường, toàn bộ biến struct cần được khai báo mut.", code: "let product = Product {\n    name: String::from(\"Sách Rust\"),\n    price: 180_000,\n};\nprintln!(\"{}\", product.name);" },
      { title: "Sở hữu dữ liệu trong struct", text: "Một trường String sở hữu nội dung của nó và được dọn dẹp cùng struct. Trường &str sẽ mượn nội dung từ nơi khác và thường đòi hỏi mô tả lifetime. Khi mới thiết kế kiểu dữ liệu độc lập, String là lựa chọn rõ ràng cho những nội dung mà đối tượng cần giữ lại." },
    ],
    tip: "Tên trường là một phần của cách giải thích bài toán. price và quantity dễ đọc hơn các phần tử .0 và .1.",
    exercise: { title: "Mô hình một sản phẩm", instructions: "Khởi tạo sản phẩm có tên Sách Rust và giá 180000. Giữ struct và các kiểm tra đã cho.", requirements: ["Trường name là String", "Trường price bằng 180000", "In: Sách Rust: 180000 VND"] },
    starterCode: "struct Product {\n    name: String,\n    price: u32,\n}\n\nfn main() {\n    let product: Product = todo!(\"Tạo một sản phẩm\");\n    assert_eq!(product.name, \"Sách Rust\");\n    assert_eq!(product.price, 180_000);\n    println!(\"{}: {} VND\", product.name, product.price);\n}",
    solutionCode: "struct Product {\n    name: String,\n    price: u32,\n}\n\nfn main() {\n    let product = Product {\n        name: String::from(\"Sách Rust\"),\n        price: 180_000,\n    };\n    assert_eq!(product.name, \"Sách Rust\");\n    assert_eq!(product.price, 180_000);\n    println!(\"{}: {} VND\", product.name, product.price);\n}",
    expectedOutput: "Sách Rust: 180000 VND\n",
    hints: ["Cú pháp khởi tạo là Product { name: ..., price: ... }.", "Chuyển chuỗi literal thành String bằng String::from(\"Sách Rust\")."],
    quiz: { question: "Để một Product tự sở hữu tên của nó, trường name nên dùng kiểu nào trong bài này?", options: ["&mut u32", "String", "bool", "usize"], correct: 1, explanation: "String sở hữu vùng dữ liệu văn bản, phù hợp khi Product cần giữ nội dung độc lập." },
    reference: { label: "The Rust Book · Defining and Instantiating Structs", url: "https://doc.rust-lang.org/book/ch05-01-defining-structs.html" },
  },
  {
    "id": "methods",
    "moduleId": "types",
    "title": "Method & Khối impl",
    "description": "Gắn hành vi với kiểu dữ liệu thay vì rải các hàm khắp nơi.",
    "duration": 20,
    "objectives": [
      "Khai báo phương thức trong impl",
      "Chọn &self khi chỉ đọc",
      "Gọi phương thức bằng cú pháp dấu chấm"
    ],
    "sections": [
      {
        "title": "Hành vi đi cùng dữ liệu",
        "text": "Khối impl chứa các hàm gắn với một kiểu. Phương thức có tham số self, &self hoặc &mut self ở vị trí đầu tiên. Cách viết này giúp một thao tác như tính diện tích xuất hiện ngay bên cạnh kiểu hình chữ nhật mà nó sử dụng.",
        "code": "struct Rectangle { width: u32, height: u32 }\n\nimpl Rectangle {\n    fn area(&self) -> u32 {\n        self.width * self.height\n    }\n}"
      },
      {
        "title": "Chọn cách dùng self",
        "text": "&self mượn chỉ đọc, &mut self mượn để sửa, còn self nhận quyền sở hữu của đối tượng. Một phương thức chỉ tính diện tích không cần sửa hay lấy mất hình chữ nhật, nên &self thể hiện đúng nhu cầu. Bạn vẫn có thể gọi phương thức nhiều lần trên cùng giá trị."
      },
      {
        "title": "Hàm liên kết không cần self",
        "text": "Trong impl còn có thể có hàm không nhận self. Những hàm này thường dùng để tạo đối tượng và được gọi bằng tên kiểu cùng dấu ::, chẳng hạn Rectangle::new. new là quy ước đặt tên phổ biến, không phải từ khóa đặc biệt của Rust.",
        "code": "impl Rectangle {\n    fn new(width: u32, height: u32) -> Self {\n        Self { width, height }\n    }\n}"
      }
    ],
    "tip": "Hãy bắt đầu bằng &self và chỉ chuyển sang &mut self hoặc self khi hành vi thực sự cần điều đó.",
    "exercise": {
      "title": "Diện tích và chu vi",
      "instructions": "Hoàn thiện hai phương thức của Rectangle. Cả hai chỉ đọc dữ liệu, nên đều nhận &self. Dữ liệu của bài này được giới hạn để các phép tính số nguyên không tràn; khi nhận dữ liệu tùy ý, cần thiết kế kiểm tra giới hạn hoặc dùng checked_*.",
      "requirements": [
        "area trả width * height",
        "perimeter trả 2 * (width + height)",
        "Hình 4 × 6 có diện tích 24 và chu vi 20"
      ]
    },
    "starterCode": "struct Rectangle { width: u32, height: u32 }\n\nimpl Rectangle {\n    fn area(&self) -> u32 { todo!(\"Diện tích\") }\n    fn perimeter(&self) -> u32 { todo!(\"Chu vi\") }\n}\n\nfn main() {\n    let shape = Rectangle { width: 4, height: 6 };\n    assert_eq!(shape.area(), 24);\n    assert_eq!(shape.perimeter(), 20);\n    println!(\"Diện tích: {}, chu vi: {}\", shape.area(), shape.perimeter());\n}",
    "solutionCode": "struct Rectangle { width: u32, height: u32 }\n\nimpl Rectangle {\n    fn area(&self) -> u32 { self.width * self.height }\n    fn perimeter(&self) -> u32 { 2 * (self.width + self.height) }\n}\n\nfn main() {\n    let shape = Rectangle { width: 4, height: 6 };\n    assert_eq!(shape.area(), 24);\n    assert_eq!(shape.perimeter(), 20);\n    println!(\"Diện tích: {}, chu vi: {}\", shape.area(), shape.perimeter());\n}",
    "expectedOutput": "Diện tích: 24, chu vi: 20\n",
    "hints": [
      "Các trường được truy cập qua self.width và self.height.",
      "Hai phương thức đều trả một biểu thức số không có dấu chấm phẩy cuối."
    ],
    "quiz": {
      "question": "Một phương thức chỉ đọc đối tượng nên thường nhận tham số nào?",
      "options": [
        "self",
        "&mut self",
        "&self",
        "Không thể đọc trong phương thức"
      ],
      "correct": 2,
      "explanation": "&self mượn đối tượng để đọc, không lấy quyền sở hữu và không cho phép sửa dữ liệu thông thường."
    },
    "reference": {
      "label": "The Rust Book · Method Syntax",
      "url": "https://doc.rust-lang.org/book/ch05-03-method-syntax.html"
    }
  },
  {
    id: "enums", moduleId: "types", title: "Enum & Option",
    description: "Biểu diễn các trạng thái và sự thiếu vắng dữ liệu bằng kiểu.", duration: 25,
    objectives: ["Nhận biết biến thể enum", "Dùng Option<T> cho giá trị có thể vắng mặt", "Xử lý Some và None bằng match"],
    sections: [
      { title: "Một giá trị, một trong các trạng thái", text: "enum định nghĩa một kiểu có nhiều biến thể. Mỗi giá trị chỉ thuộc một biến thể tại một thời điểm, và mỗi biến thể có thể chứa dữ liệu riêng. Điều này phù hợp với các trạng thái đơn hàng, kết quả đọc dữ liệu hoặc một thông điệp có nhiều dạng.", code: "enum OrderStatus {\n    Pending,\n    Shipping(String),\n    Delivered,\n}" },
      { title: "Có hoặc không có một giá trị", text: "Option<T> là enum có sẵn với hai biến thể: Some(T) và None. T là kiểu dữ liệu bên trong. Khi một phép tìm kiếm có thể không tìm thấy gì, Option diễn tả điều đó trực tiếp trong chữ ký hàm, buộc nơi dùng phải cân nhắc trường hợp vắng mặt.", code: "let found: Option<i32> = Some(42);\nlet missing: Option<i32> = None;" },
      { title: "Xử lý đủ bằng match", text: "match chọn nhánh dựa trên cấu trúc giá trị. Nhánh Some(value) lấy dữ liệu bên trong vào tên value; nhánh None xử lý trường hợp không có gì. Với dữ liệu từ người dùng hoặc tìm kiếm, xử lý None rõ ràng thường phù hợp hơn gọi unwrap và để chương trình panic." },
    ],
    tip: "None không phải một số đặc biệt như -1. Nó là trạng thái được mô tả bằng kiểu, không thể nhầm với dữ liệu hợp lệ.",
    exercise: { title: "Phần tử đầu tiên, nếu có", instructions: "Viết first_value trả Some phần tử đầu tiên của slice, hoặc None nếu slice rỗng. main sẽ chuyển kết quả thành lời nhắn.", requirements: ["Trả Option<i32>", "Slice rỗng phải trả None", "In: Giá trị đầu tiên: 7"] },
    starterCode: "fn first_value(values: &[i32]) -> Option<i32> {\n    todo!(\"Lấy phần tử đầu hoặc None\")\n}\n\nfn main() {\n    assert_eq!(first_value(&[]), None);\n    assert_eq!(first_value(&[7, 8]), Some(7));\n    match first_value(&[7, 8]) {\n        Some(value) => println!(\"Giá trị đầu tiên: {value}\"),\n        None => println!(\"Danh sách rỗng\"),\n    }\n}",
    solutionCode: "fn first_value(values: &[i32]) -> Option<i32> {\n    if values.is_empty() { None } else { Some(values[0]) }\n}\n\nfn main() {\n    assert_eq!(first_value(&[]), None);\n    assert_eq!(first_value(&[7, 8]), Some(7));\n    match first_value(&[7, 8]) {\n        Some(value) => println!(\"Giá trị đầu tiên: {value}\"),\n        None => println!(\"Danh sách rỗng\"),\n    }\n}",
    expectedOutput: "Giá trị đầu tiên: 7\n",
    hints: ["Kiểm tra values.is_empty() trước khi lấy values[0].", "Một lời giải ngắn khác là values.first().copied()."],
    quiz: { question: "Option<T> có những biến thể nào?", options: ["True và False", "Ok và Err", "Some(T) và None", "Start và Stop"], correct: 2, explanation: "Some chứa một giá trị kiểu T; None diễn tả không có giá trị." },
    reference: { label: "The Rust Book · Defining an Enum", url: "https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html" },
  },
  {
    id: "pattern-matching", moduleId: "types", title: "Pattern Matching",
    description: "Tách dữ liệu và xử lý mọi trường hợp bằng match.", duration: 20,
    objectives: ["Viết match bao phủ mọi khả năng", "Dùng pattern khoảng và wildcard", "Hiểu thứ tự kiểm tra các nhánh"],
    sections: [
      { title: "Pattern mô tả hình dạng cần khớp", text: "Một pattern có thể là giá trị cụ thể, biến thể enum, tuple hoặc khoảng. Rust thử các nhánh match theo thứ tự và chọn nhánh khớp đầu tiên. Khi nhánh khớp, nó có thể đồng thời tách dữ liệu thành các biến để sử dụng.", code: "let point = (3, 0);\nmatch point {\n    (x, 0) => println!(\"Trên trục x: {x}\"),\n    (0, y) => println!(\"Trên trục y: {y}\"),\n    _ => println!(\"Ở vị trí khác\"),\n}" },
      { title: "Không bỏ sót trường hợp", text: "match phải bao phủ đầy đủ những giá trị có thể xuất hiện. Pattern _ nhận mọi trường hợp còn lại mà không giữ giá trị. Đây là lợi ích rõ ràng khi thêm một biến thể enum: các match chưa xử lý nó có thể được trình biên dịch chỉ ra ngay." },
      { title: "Chọn if let khi chỉ quan tâm một trường hợp", text: "Nếu bạn chỉ muốn xử lý Some và bỏ qua None, if let có thể gọn hơn match. Tuy vậy, match thường dễ đọc hơn khi từng trạng thái có hành vi quan trọng. Cả hai đều dùng pattern; hãy chọn cách diễn đạt làm rõ ý định của đoạn mã.", code: "let score = Some(9);\nif let Some(value) = score {\n    println!(\"Điểm: {value}\");\n}" },
    ],
    tip: "Đặt các pattern cụ thể trước pattern rộng. Nếu _ đứng đầu, những nhánh phía sau sẽ không bao giờ được chọn.",
    exercise: { title: "Xếp loại điểm", instructions: "Hoàn thiện classify: 0–4 là Chưa đạt, 5–7 là Đạt, 8–10 là Tốt. Mọi giá trị khác là Không hợp lệ.", requirements: ["Dùng match với các khoảng bao gồm cận cuối", "Có nhánh _ cho đầu vào ngoài 0–10", "In kết quả cho điểm 9"] },
    starterCode: "fn classify(score: i32) -> &'static str {\n    todo!(\"Xếp loại theo khoảng điểm\")\n}\n\nfn main() {\n    assert_eq!(classify(4), \"Chưa đạt\");\n    assert_eq!(classify(5), \"Đạt\");\n    assert_eq!(classify(10), \"Tốt\");\n    assert_eq!(classify(-1), \"Không hợp lệ\");\n    assert_eq!(classify(11), \"Không hợp lệ\");\n    println!(\"Xếp loại: {}\", classify(9));\n}",
    solutionCode: "fn classify(score: i32) -> &'static str {\n    match score {\n        0..=4 => \"Chưa đạt\",\n        5..=7 => \"Đạt\",\n        8..=10 => \"Tốt\",\n        _ => \"Không hợp lệ\",\n    }\n}\n\nfn main() {\n    assert_eq!(classify(4), \"Chưa đạt\");\n    assert_eq!(classify(5), \"Đạt\");\n    assert_eq!(classify(10), \"Tốt\");\n    assert_eq!(classify(-1), \"Không hợp lệ\");\n    assert_eq!(classify(11), \"Không hợp lệ\");\n    println!(\"Xếp loại: {}\", classify(9));\n}",
    expectedOutput: "Xếp loại: Tốt\n",
    hints: ["Khoảng pattern 0..=4 khớp cả 0 và 4.", "Dùng _ => \"Không hợp lệ\" làm nhánh cuối."],
    quiz: { question: "Pattern _ ở cuối match dùng để làm gì?", options: ["Lặp lại nhánh trước", "Nhận các trường hợp còn lại", "Dừng trình biên dịch", "Chỉ khớp số 0"], correct: 1, explanation: "_ là wildcard, khớp các giá trị còn lại mà không gắn chúng với một biến." },
    reference: { label: "The Rust Book · The match Control Flow Construct", url: "https://doc.rust-lang.org/book/ch06-02-match.html" },
  },
  {
    id: "vectors", moduleId: "data", title: "Vec: Danh sách có thể mở rộng",
    description: "Thêm, đọc và biến đổi một dãy phần tử cùng kiểu.", duration: 20,
    objectives: ["Tạo Vec bằng vec!", "Thêm phần tử với push", "Truy cập an toàn qua get"],
    sections: [
      { title: "Khi chưa biết trước số phần tử", text: "Vec<T> là một tập hợp liên tiếp có thể thay đổi số phần tử. Các phần tử cùng một kiểu T. Dùng vec! để tạo danh sách từ các giá trị sẵn có, hoặc Vec::new để bắt đầu rỗng rồi push thêm dữ liệu.", code: "let mut scores = vec![6, 8, 9];\nscores.push(10);" },
      { title: "Chọn cách truy cập phù hợp", text: "Cú pháp scores[0] ngắn nhưng sẽ panic nếu chỉ số ngoài phạm vi. scores.get(0) trả Option<&T>, giúp xử lý tình huống không có phần tử. Khi chỉ số đến từ người dùng, việc xử lý Option thường làm hành vi rõ ràng hơn.", code: "match scores.get(10) {\n    Some(score) => println!(\"{score}\"),\n    None => println!(\"Không có điểm này\"),\n}" },
      { title: "Mượn để duyệt, sở hữu để giữ lại", text: "for value in &values mượn từng phần tử nên Vec còn dùng được sau vòng lặp. Khi bạn tạo một Vec kết quả, có thể push những giá trị đáp ứng điều kiện vào nó. Đừng giữ một tham chiếu đến phần tử rồi thêm phần tử mới nếu việc đó làm xung đột quy tắc mượn." },
    ],
    tip: "Kiểu của Vec rỗng có thể cần ghi rõ, ví dụ let mut scores: Vec<i32> = Vec::new();",
    exercise: { title: "Lọc điểm đạt", instructions: "Viết passing_scores nhận một slice điểm và trả Vec chứa những điểm từ 5 trở lên, giữ đúng thứ tự ban đầu.", requirements: ["Không thay đổi đầu vào", "Đầu vào rỗng trả Vec rỗng", "Với [3, 7, 4, 9, 5], trả [7, 9, 5]"] },
    starterCode: "fn passing_scores(scores: &[i32]) -> Vec<i32> {\n    todo!(\"Tạo danh sách điểm từ 5 trở lên\")\n}\n\nfn main() {\n    assert_eq!(passing_scores(&[]), Vec::<i32>::new());\n    let result = passing_scores(&[3, 7, 4, 9, 5]);\n    assert_eq!(result, vec![7, 9, 5]);\n    println!(\"Điểm đạt: {result:?}\");\n}",
    solutionCode: "fn passing_scores(scores: &[i32]) -> Vec<i32> {\n    let mut result = Vec::new();\n    for &score in scores {\n        if score >= 5 { result.push(score); }\n    }\n    result\n}\n\nfn main() {\n    assert_eq!(passing_scores(&[]), Vec::<i32>::new());\n    let result = passing_scores(&[3, 7, 4, 9, 5]);\n    assert_eq!(result, vec![7, 9, 5]);\n    println!(\"Điểm đạt: {result:?}\");\n}",
    expectedOutput: "Điểm đạt: [7, 9, 5]\n",
    hints: ["Tạo một Vec rỗng rồi push điểm đáp ứng điều kiện.", "for &score in scores lấy ra bản sao i32 từ tham chiếu."],
    quiz: { question: "Cách nào trả về Option thay vì panic khi chỉ số không tồn tại?", options: ["values[index]", "values.get(index)", "values.push(index)", "values.len()"], correct: 1, explanation: "get trả Some tham chiếu đến phần tử hoặc None nếu chỉ số ngoài phạm vi." },
    reference: { label: "The Rust Book · Storing Lists with Vectors", url: "https://doc.rust-lang.org/book/ch08-01-vectors.html" },
  },
  {
    id: "strings", moduleId: "data", title: "Chuỗi & Unicode tiếng Việt",
    description: "Xử lý văn bản mà không nhầm byte với ký tự.", duration: 25,
    objectives: ["Phân biệt String và &str", "Hiểu len đếm byte", "Duyệt Unicode scalar bằng chars"],
    sections: [
      { title: "String sở hữu, &str mượn", text: "String quản lý một vùng văn bản UTF-8 có thể mở rộng. &str là một tham chiếu đến văn bản UTF-8 và thường dùng cho tham số chỉ đọc. Bạn có thể nối nội dung vào String bằng push_str, hoặc thêm một char bằng push.", code: "let mut title = String::from(\"Học\");\ntitle.push_str(\" Rust\");\ntitle.push('!');" },
      { title: "Một chữ không luôn là một byte", text: "len của chuỗi trả số byte. Văn bản tiếng Việt thường có ký tự cần nhiều byte nên không thể lấy ký tự bằng text[0]. chars duyệt các Unicode scalar value; số lượng này vẫn có thể khác số ký tự mà mắt người nhận ra nếu văn bản dùng dấu kết hợp.", code: "let text = \"Việt\";\nprintln!(\"{} byte\", text.len());\nprintln!(\"{} scalar\", text.chars().count());" },
      { title: "Làm việc theo ý nghĩa văn bản", text: "split_whitespace tách các phần dựa trên khoảng trắng Unicode, tránh tự dò từng byte. trim bỏ khoảng trắng ở hai đầu. Khi cần đếm ký tự hiển thị hoặc cắt đúng một cụm chữ có dấu kết hợp, bạn cần khái niệm grapheme cluster và một thư viện phù hợp; chars không hứa làm việc đó." },
    ],
    tip: "Với tiếng Việt, đừng đặt tên char_count cho text.len(). Hãy ghi rõ bạn đang đếm byte, scalar hay grapheme.",
    exercise: { title: "Đếm từ trong một câu", instructions: "Viết word_count đếm các từ ngăn cách bởi khoảng trắng. Nhiều dấu cách hoặc xuống dòng không được tạo từ rỗng.", requirements: ["Dùng split_whitespace", "Chuỗi rỗng có 0 từ", "Câu Học Rust mỗi ngày có 4 từ"] },
    starterCode: "fn word_count(text: &str) -> usize {\n    todo!(\"Đếm phần tách bởi khoảng trắng\")\n}\n\nfn main() {\n    assert_eq!(word_count(\"\"), 0);\n    assert_eq!(word_count(\"  Rust   rất\\nhay  \"), 3);\n    assert_eq!(word_count(\"Học Rust mỗi ngày\"), 4);\n    println!(\"Số từ: {}\", word_count(\"Học Rust mỗi ngày\"));\n}",
    solutionCode: "fn word_count(text: &str) -> usize {\n    text.split_whitespace().count()\n}\n\nfn main() {\n    assert_eq!(word_count(\"\"), 0);\n    assert_eq!(word_count(\"  Rust   rất\\nhay  \"), 3);\n    assert_eq!(word_count(\"Học Rust mỗi ngày\"), 4);\n    println!(\"Số từ: {}\", word_count(\"Học Rust mỗi ngày\"));\n}",
    expectedOutput: "Số từ: 4\n",
    hints: ["split_whitespace tạo một iterator qua các từ.", "Gọi .count() trên iterator để đếm số phần tử."],
    quiz: { question: "Phương thức len() trên String trả về điều gì?", options: ["Số từ", "Số byte", "Số grapheme luôn chính xác", "Số dòng"], correct: 1, explanation: "String lưu UTF-8, và len trả số byte, không phải số chữ người đọc nhìn thấy." },
    reference: { label: "The Rust Book · Storing UTF-8 Encoded Text", url: "https://doc.rust-lang.org/book/ch08-02-strings.html" },
  },
  {
    id: "hashmaps", moduleId: "data", title: "HashMap: Dữ liệu theo khóa",
    description: "Tra cứu và cộng dồn dữ liệu qua cặp khóa–giá trị.", duration: 25,
    objectives: ["Tạo HashMap từ thư viện chuẩn", "Dùng entry và or_insert", "Không phụ thuộc thứ tự duyệt HashMap"],
    sections: [
      { title: "Tìm theo tên thay vì vị trí", text: "HashMap<K, V> lưu dữ liệu theo cặp khóa–giá trị. Các khóa dùng cùng kiểu K và các giá trị dùng cùng kiểu V. Import HashMap từ std::collections, rồi dùng insert để thêm hoặc thay thế giá trị của một khóa.", code: "use std::collections::HashMap;\n\nlet mut scores = HashMap::new();\nscores.insert(String::from(\"An\"), 9);" },
      { title: "Cộng dồn bằng entry", text: "entry đại diện cho vị trí của một khóa dù khóa đó đã có hay chưa. or_insert thêm giá trị mặc định khi cần, rồi trả tham chiếu có thể sửa đến giá trị trong map. Toán tử * giúp sửa giá trị phía sau tham chiếu khi cộng số lần xuất hiện.", code: "let count = counts.entry(word).or_insert(0);\n*count += 1;" },
      { title: "Thứ tự không phải một phần hợp đồng", text: "HashMap không bảo đảm thứ tự duyệt cố định. Nếu cần hiển thị kết quả theo tên, hãy lấy dữ liệu ra rồi sắp xếp hoặc chọn BTreeMap. Để kiểm tra một khóa cụ thể, get trả Option<&V>; copied có thể chuyển tham chiếu số nguyên thành giá trị số." },
    ],
    tip: "Đừng so sánh nguyên dòng debug của một HashMap để kiểm thử: thứ tự khóa có thể khác giữa các lần chạy.",
    exercise: { title: "Đếm tần suất từ", instructions: "Viết count_words trả về số lần xuất hiện của mỗi từ. Phân biệt chữ hoa và chữ thường trong bài này.", requirements: ["Trả HashMap<String, usize>", "Dùng split_whitespace và entry", "Từ rust xuất hiện 3 lần trong câu mẫu"] },
    starterCode: "use std::collections::HashMap;\n\nfn count_words(text: &str) -> HashMap<String, usize> {\n    todo!(\"Đếm số lần xuất hiện mỗi từ\")\n}\n\nfn main() {\n    let counts = count_words(\"rust vui rust an toàn rust\");\n    assert_eq!(counts.get(\"rust\"), Some(&3));\n    assert_eq!(counts.get(\"vui\"), Some(&1));\n    assert!(count_words(\"\").is_empty());\n    println!(\"rust: {} lần\", counts.get(\"rust\").copied().unwrap_or(0));\n}",
    solutionCode: "use std::collections::HashMap;\n\nfn count_words(text: &str) -> HashMap<String, usize> {\n    let mut counts = HashMap::new();\n    for word in text.split_whitespace() {\n        *counts.entry(word.to_string()).or_insert(0) += 1;\n    }\n    counts\n}\n\nfn main() {\n    let counts = count_words(\"rust vui rust an toàn rust\");\n    assert_eq!(counts.get(\"rust\"), Some(&3));\n    assert_eq!(counts.get(\"vui\"), Some(&1));\n    assert!(count_words(\"\").is_empty());\n    println!(\"rust: {} lần\", counts.get(\"rust\").copied().unwrap_or(0));\n}",
    expectedOutput: "rust: 3 lần\n",
    hints: ["Map cần sở hữu khóa String: word.to_string().", "*counts.entry(word.to_string()).or_insert(0) += 1;"],
    quiz: { question: "HashMap có bảo đảm thứ tự duyệt khóa giống thứ tự thêm không?", options: ["Có, luôn luôn", "Chỉ với khóa String", "Không", "Chỉ khi có dưới 10 khóa"], correct: 2, explanation: "Không nên phụ thuộc thứ tự duyệt của HashMap. Hãy sắp xếp khi đầu ra cần thứ tự xác định." },
    reference: { label: "The Rust Book · Storing Keys with Associated Values", url: "https://doc.rust-lang.org/book/ch08-03-hash-maps.html" },
  },
  {
    "id": "result",
    "moduleId": "data",
    "title": "Result & Xử lý lỗi",
    "description": "Biến lỗi dự kiến thành một phần rõ ràng của chương trình.",
    "duration": 25,
    "objectives": [
      "Trả Ok và Err",
      "Phân biệt lỗi có thể phục hồi với panic",
      "Đọc vai trò của toán tử ?"
    ],
    "sections": [
      {
        "title": "Lỗi cũng là dữ liệu",
        "text": "Result<T, E> diễn tả thành công bằng Ok(T) hoặc thất bại bằng Err(E). Ví dụ, chuyển một chuỗi thành số có thể thất bại vì nội dung không hợp lệ. Trả Result cho bên gọi quyền quyết định: thử lại, hiển thị lời nhắn hay chuyển lỗi lên tầng trên.",
        "code": "let parsed: Result<u32, _> = \"42\".parse();\nmatch parsed {\n    Ok(value) => println!(\"{value}\"),\n    Err(error) => println!(\"Không đọc được số: {error}\"),\n}"
      },
      {
        "title": "Đừng panic vì một đầu vào dự kiến sai",
        "text": "panic báo một tình huống mà luồng thực thi không phục hồi tại chỗ; tùy cấu hình, Rust có thể unwind hoặc abort tiến trình. unwrap trên Err sẽ panic. Đầu vào sai, lỗi tệp hay lỗi mạng dự kiến nên được biểu diễn bằng Result để nơi gọi quyết định. Một phép chia nguyên có thể lỗi không chỉ vì mẫu 0: i32::MIN / -1 cũng vượt miền i32; checked_div giúp phát hiện cả hai."
      },
      {
        "title": "Chuyển lỗi lên bằng dấu hỏi",
        "text": "Trong hàm trả Result, toán tử ? lấy giá trị từ Ok hoặc trả sớm khi gặp Err, cùng cơ chế chuyển kiểu lỗi phù hợp. Nó làm ngắn những chuỗi thao tác có thể lỗi, nhưng không tự sửa lỗi. Chữ ký của hàm vẫn cần nói rõ kết quả và kiểu lỗi mà nó trả.",
        "code": "fn read_number(text: &str) -> Result<u32, std::num::ParseIntError> {\n    let value = text.parse::<u32>()?;\n    Ok(value)\n}"
      }
    ],
    "tip": "Một thông báo lỗi tốt nói rõ điều kiện bị vi phạm, giúp bên gọi biết nên thay đổi dữ liệu nào.",
    "exercise": {
      "title": "Chia an toàn",
      "instructions": "Viết safe_divide cho mọi giá trị i32: mẫu 0 trả Err(\"Không thể chia cho 0\"); i32::MIN chia -1 trả Err(\"Phép chia vượt giới hạn\"); các trường hợp khác trả thương nguyên trong Ok.",
      "requirements": [
        "Không panic với mẫu 0 hoặc i32::MIN / -1",
        "Dùng checked_div sau khi kiểm tra mẫu 0",
        "Giữ các assertion kiểm tra số âm, số 0 và ranh giới"
      ]
    },
    "starterCode": "fn safe_divide(a: i32, b: i32) -> Result<i32, &'static str> {\n    todo!(\"Kiểm tra mẫu 0 và phép chia vượt giới hạn\")\n}\n\nfn main() {\n    assert_eq!(safe_divide(20, 4), Ok(5));\n    assert_eq!(safe_divide(7, 2), Ok(3));\n    assert_eq!(safe_divide(-7, 2), Ok(-3));\n    assert_eq!(safe_divide(0, 4), Ok(0));\n    assert_eq!(safe_divide(1, 0), Err(\"Không thể chia cho 0\"));\n    assert_eq!(safe_divide(i32::MIN, -1), Err(\"Phép chia vượt giới hạn\"));\n    assert_eq!(safe_divide(i32::MIN, 1), Ok(i32::MIN));\n    match safe_divide(20, 4) {\n        Ok(value) => println!(\"Kết quả: {value}\"),\n        Err(error) => println!(\"Lỗi: {error}\"),\n    }\n}",
    "solutionCode": "fn safe_divide(a: i32, b: i32) -> Result<i32, &'static str> {\n    if b == 0 {\n        return Err(\"Không thể chia cho 0\");\n    }\n    a.checked_div(b).ok_or(\"Phép chia vượt giới hạn\")\n}\n\nfn main() {\n    assert_eq!(safe_divide(20, 4), Ok(5));\n    assert_eq!(safe_divide(7, 2), Ok(3));\n    assert_eq!(safe_divide(-7, 2), Ok(-3));\n    assert_eq!(safe_divide(0, 4), Ok(0));\n    assert_eq!(safe_divide(1, 0), Err(\"Không thể chia cho 0\"));\n    assert_eq!(safe_divide(i32::MIN, -1), Err(\"Phép chia vượt giới hạn\"));\n    assert_eq!(safe_divide(i32::MIN, 1), Ok(i32::MIN));\n    match safe_divide(20, 4) {\n        Ok(value) => println!(\"Kết quả: {value}\"),\n        Err(error) => println!(\"Lỗi: {error}\"),\n    }\n}",
    "expectedOutput": "Kết quả: 5\n",
    "hints": [
      "Kiểm tra b == 0 trước để giữ thông báo lỗi riêng cho mẫu bằng 0.",
      "checked_div trả Option: Some(thương) hoặc None nếu tràn/chia cho 0. Dùng ok_or để đổi None còn lại thành lỗi tràn."
    ],
    "quiz": {
      "question": "Toán tử ? trong một hàm trả Result làm gì khi gặp Err?",
      "options": [
        "Bỏ qua lỗi",
        "Tự thử lại thao tác",
        "Trả lỗi sớm về bên gọi",
        "Luôn panic"
      ],
      "correct": 2,
      "explanation": "? truyền lỗi về bên gọi thay vì tiếp tục các lệnh còn lại trong hàm."
    },
    "reference": {
      "label": "The Rust Book · Recoverable Errors with Result",
      "url": "https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html"
    }
  },
  {
    "id": "generics",
    "moduleId": "flexible",
    "title": "Generic: Một ý tưởng, nhiều kiểu",
    "description": "Viết hàm dùng lại được mà vẫn giữ kiểm tra kiểu tĩnh.",
    "duration": 25,
    "objectives": [
      "Khai báo tham số kiểu T",
      "Dùng trait bound cho thao tác cần thiết",
      "Gọi cùng một hàm với nhiều kiểu"
    ],
    "sections": [
      {
        "title": "Tách thuật toán khỏi kiểu cụ thể",
        "text": "Generic dùng một tham số kiểu thay cho kiểu cố định. Một hàm không cần biết trước nó sẽ nhận i32 hay f64 nếu các thao tác trong hàm có thể mô tả bằng những ràng buộc thích hợp. Trình biên dịch vẫn kiểm tra kiểu, không biến dữ liệu thành một giá trị không xác định.",
        "code": "fn identity<T>(value: T) -> T {\n    value\n}"
      },
      {
        "title": "Chỉ yêu cầu đúng năng lực cần dùng",
        "text": "Một T bất kỳ không mặc nhiên so sánh được bằng >. Bound PartialOrd cho biết T có phép so sánh thứ tự từng phần. Tham số kiểu có thể cần thêm bound khi thuật toán thực sự dùng năng lực đó, nhưng đừng thêm Copy hay Clone nếu không cần.",
        "code": "fn greater<T: PartialOrd>(left: T, right: T) -> bool {\n    left > right\n}"
      },
      {
        "title": "Chú ý ý nghĩa của phép so sánh",
        "text": "PartialOrd được dùng cho cả kiểu số thực, nhưng các giá trị đặc biệt như NaN có thể không so sánh theo thứ tự thông thường. Generic tái sử dụng mã, không làm mất những đặc tính của kiểu cụ thể. Với bài này, ta dùng số nguyên và ký tự có thứ tự rõ ràng."
      },
      {
        "title": "impl Trait vẫn có một kiểu cụ thể",
        "text": "Tham số impl Trait là cách viết gọn cho ràng buộc generic trong trường hợp phù hợp. Ở vị trí trả về, impl Trait che tên của một kiểu cụ thể mà hàm lựa chọn; các đường return phải thống nhất kiểu đó. Nó không có nghĩa tùy mỗi lần gọi mà trả bất kỳ kiểu triển khai trait nào. Nếu muốn giữ nhiều kiểu runtime khác nhau, hãy cân nhắc enum hoặc dyn ở chương Rust nâng cao.",
        "code": "fn answer() -> impl std::fmt::Display {\n    42\n}\n// Mọi đường trả về ở đây có cùng kiểu cụ thể i32."
      }
    ],
    "tip": "Đọc T: PartialOrd là: kiểu T phải cung cấp khả năng so sánh mà hàm này cần.",
    "exercise": {
      "title": "Chọn giá trị lớn hơn",
      "instructions": "Viết max_value trả về giá trị lớn hơn trong hai đầu vào; nếu bằng nhau trả về left. Hàm nhận quyền sở hữu nên không cần Copy.",
      "requirements": [
        "Giữ generic T: PartialOrd",
        "Dùng cùng hàm cho i32 và char",
        "In: Lớn hơn: 12"
      ]
    },
    "starterCode": "fn max_value<T: PartialOrd>(left: T, right: T) -> T {\n    todo!(\"Trả về một trong hai đầu vào\")\n}\n\nfn main() {\n    assert_eq!(max_value(3, 12), 12);\n    assert_eq!(max_value(7, 7), 7);\n    assert_eq!(max_value('a', 'z'), 'z');\n    println!(\"Lớn hơn: {}\", max_value(3, 12));\n}",
    "solutionCode": "fn max_value<T: PartialOrd>(left: T, right: T) -> T {\n    if left >= right { left } else { right }\n}\n\nfn main() {\n    assert_eq!(max_value(3, 12), 12);\n    assert_eq!(max_value(7, 7), 7);\n    assert_eq!(max_value('a', 'z'), 'z');\n    println!(\"Lớn hơn: {}\", max_value(3, 12));\n}",
    "expectedOutput": "Lớn hơn: 12\n",
    "hints": [
      "Hàm có thể dùng >= nhờ bound PartialOrd.",
      "if left >= right { left } else { right }"
    ],
    "quiz": {
      "question": "Vì sao hàm dùng toán tử > trên T cần một bound phù hợp?",
      "options": [
        "Để T luôn là i32",
        "Để trình biên dịch biết T hỗ trợ phép so sánh",
        "Để bật cấp phát heap",
        "Để tự động clone giá trị"
      ],
      "correct": 1,
      "explanation": "Một kiểu T bất kỳ chưa chắc hỗ trợ so sánh. PartialOrd thể hiện năng lực mà thuật toán yêu cầu."
    },
    "reference": {
      "label": "The Rust Book · Generic Data Types",
      "url": "https://doc.rust-lang.org/book/ch10-01-syntax.html"
    }
  },
  {
    "id": "traits",
    "moduleId": "flexible",
    "title": "Trait: Chung hành vi, khác dữ liệu",
    "description": "Định nghĩa một hợp đồng hành vi cho nhiều kiểu khác nhau.",
    "duration": 25,
    "objectives": [
      "Khai báo trait với phương thức",
      "Triển khai trait cho struct",
      "Dùng impl Trait trong tham số"
    ],
    "sections": [
      {
        "title": "Một tên cho một năng lực",
        "text": "Trait định nghĩa những hành vi mà kiểu triển khai nó cần cung cấp. Thay vì quan tâm một đối tượng có đúng một cấu trúc cụ thể, hàm có thể yêu cầu nó biết tóm tắt, hiển thị hoặc tính toán. Trait là nền tảng cho nhiều ràng buộc generic trong thư viện chuẩn.",
        "code": "trait Summary {\n    fn summarize(&self) -> String;\n}"
      },
      {
        "title": "Mỗi kiểu tự quyết định cách thực hiện",
        "text": "Khối impl TraitName for TypeName cung cấp các phương thức mà trait yêu cầu. Một Article có thể tóm tắt bằng tiêu đề, trong khi một Podcast dùng tên tập và thời lượng. Hai kiểu không cần có cùng trường dữ liệu.",
        "code": "struct Article { title: String }\n\nimpl Summary for Article {\n    fn summarize(&self) -> String {\n        format!(\"Bài viết: {}\", self.title)\n    }\n}"
      },
      {
        "title": "Tiêu thụ năng lực thay vì kiểu cụ thể",
        "text": "Tham số &impl Summary nhận một tham chiếu đến kiểu triển khai Summary. Cách này giúp viết hàm sử dụng chung hành vi và vẫn cho trình biên dịch kiểm tra kiểu. Nó khác với trait object dyn dùng cho phân phối động; chưa cần trait object để giải bài hiện tại."
      },
      {
        "title": "Coherence và orphan rule",
        "text": "Với trường hợp thông thường không có tham số trait phức tạp, implementation cần trait hoặc kiểu do crate hiện tại định nghĩa. Bạn không thể tự impl Display cho Vec<T> khi cả hai đều từ std. Newtype tạo một kiểu cục bộ để diễn tả hợp đồng riêng. Quy tắc coherence còn cấm các implementation chồng lấn: blanket impl rộng có thể làm mất chỗ triển khai khác về sau. Tách năng lực trait nhỏ và chỉ public phần người dùng cần."
      }
    ],
    "tip": "Trait nên diễn tả một năng lực rõ ràng. Một hợp đồng nhỏ thường dễ triển khai và tái sử dụng hơn một hợp đồng chứa mọi việc.",
    "exercise": {
      "title": "Tóm tắt một khóa học",
      "instructions": "Triển khai Summary cho Course. Nội dung tóm tắt có dạng tên khóa: số bài bài học.",
      "requirements": [
        "Hoàn thiện summarize trong impl",
        "Dùng format! để tạo String",
        "In: Learn Rust: 80 bài học"
      ]
    },
    "starterCode": "trait Summary {\n    fn summarize(&self) -> String;\n}\n\nstruct Course { name: String, lessons: usize }\n\nimpl Summary for Course {\n    fn summarize(&self) -> String {\n        todo!(\"Tạo lời tóm tắt\")\n    }\n}\n\nfn show(item: &impl Summary) {\n    println!(\"{}\", item.summarize());\n}\n\nfn main() {\n    let course = Course { name: String::from(\"Learn Rust\"), lessons: 80 };\n    assert_eq!(course.summarize(), \"Learn Rust: 80 bài học\");\n    show(&course);\n}",
    "solutionCode": "trait Summary {\n    fn summarize(&self) -> String;\n}\n\nstruct Course { name: String, lessons: usize }\n\nimpl Summary for Course {\n    fn summarize(&self) -> String {\n        format!(\"{}: {} bài học\", self.name, self.lessons)\n    }\n}\n\nfn show(item: &impl Summary) {\n    println!(\"{}\", item.summarize());\n}\n\nfn main() {\n    let course = Course { name: String::from(\"Learn Rust\"), lessons: 80 };\n    assert_eq!(course.summarize(), \"Learn Rust: 80 bài học\");\n    show(&course);\n}",
    "expectedOutput": "Learn Rust: 80 bài học\n",
    "hints": [
      "format! tạo String thay vì in ra màn hình như println!.",
      "format!(\"{}: {} bài học\", self.name, self.lessons)"
    ],
    "quiz": {
      "question": "impl Summary for Course có ý nghĩa gì?",
      "options": [
        "Đổi tên Course thành Summary",
        "Cung cấp hành vi của trait Summary cho Course",
        "Tạo bản sao Course",
        "Làm mọi trường của Course thành public"
      ],
      "correct": 1,
      "explanation": "Khối impl này định nghĩa cách Course thực hiện những phương thức của Summary."
    },
    "reference": {
      "label": "The Rust Book · Defining Shared Behavior with Traits",
      "url": "https://doc.rust-lang.org/book/ch10-02-traits.html"
    }
  },
  {
    "id": "closures",
    "moduleId": "flexible",
    "title": "Closure: Hàm mang theo ngữ cảnh",
    "description": "Viết một thao tác nhỏ và dùng dữ liệu từ phạm vi bao quanh.",
    "duration": 20,
    "objectives": [
      "Viết closure với cú pháp |tham số|",
      "Capture biến từ môi trường",
      "Nhận biết vai trò của move"
    ],
    "sections": [
      {
        "title": "Một hàm không cần tên riêng",
        "text": "Closure là giá trị có thể được lưu vào biến hoặc truyền cho hàm khác. Tham số nằm giữa hai dấu |; phần thân có thể là một biểu thức ngắn hoặc một khối lệnh. Rust thường suy luận kiểu từ cách closure được sử dụng.",
        "code": "let square = |value: i32| value * value;\nassert_eq!(square(4), 16);"
      },
      {
        "title": "Dùng dữ liệu từ bên ngoài",
        "text": "Khác với một hàm fn thông thường, closure có thể capture biến trong phạm vi nơi nó được tạo. Cách capture tùy vào nhu cầu: mượn chỉ đọc, mượn có thể sửa hoặc nhận quyền sở hữu. Những quy tắc ownership và borrowing vẫn áp dụng như bình thường.",
        "code": "let bonus = 2;\nlet add_bonus = |score: i32| score + bonus;\nassert_eq!(add_bonus(7), 9);"
      },
      {
        "title": "move nói rõ việc lấy dữ liệu vào closure",
        "text": "move yêu cầu closure lấy các giá trị capture vào nó theo quy tắc move hoặc Copy của kiểu. Điều này thường hữu ích khi gửi công việc sang một thread. Các trait Fn, FnMut và FnOnce mô tả cách một closure có thể được gọi; không phải cứ có move thì chỉ gọi được một lần."
      },
      {
        "title": "Fn, FnMut và FnOnce nhìn từ phần thân",
        "text": "FnOnce cho phép gọi bằng cách tiêu thụ closure; mọi closure có trait này. FnMut cho phép gọi qua &mut self, còn Fn qua &self; các trait bổ sung khi cách dùng giá trị capture cho phép. Closure move vẫn có thể là Fn nếu chỉ đọc dữ liệu đã lấy vào. Chỉ khi phần thân chuyển giá trị không Copy ra khỏi closure thì nó thường chỉ còn FnOnce. Đừng suy ra trait gọi từ riêng từ khóa move.",
        "code": "let name = String::from(\"Rust\");\nlet length = move || name.len(); // Fn: chỉ đọc name.\nassert_eq!(length(), 4);\nassert_eq!(length(), 4);\n\nlet owned = String::from(\"Rust\");\nlet take = move || owned; // Chuyển String ra: FnOnce.\nassert_eq!(take(), \"Rust\");\n// Gọi take() lần nữa không biên dịch."
      }
    ],
    "tip": "Nếu closure chỉ làm một thao tác nhỏ ngay tại nơi sử dụng, viết nó gần dữ liệu sẽ giúp luồng xử lý dễ theo dõi.",
    "exercise": {
      "title": "Cộng điểm thưởng",
      "instructions": "Tạo closure apply_bonus capture bonus và cộng điểm thưởng cho một score. Không viết hàm fn riêng cho thao tác này.",
      "requirements": [
        "Dùng closure có tham số score: i32",
        "Capture bonus từ phạm vi main",
        "In: Điểm sau thưởng: 9"
      ]
    },
    "starterCode": "fn main() {\n    let bonus = 2;\n    let apply_bonus = |score: i32| -> i32 {\n        todo!(\"Cộng bonus vào score\")\n    };\n\n    assert_eq!(apply_bonus(0), 2);\n    assert_eq!(apply_bonus(7), 9);\n    println!(\"Điểm sau thưởng: {}\", apply_bonus(7));\n}",
    "solutionCode": "fn main() {\n    let bonus = 2;\n    let apply_bonus = |score: i32| score + bonus;\n\n    assert_eq!(apply_bonus(0), 2);\n    assert_eq!(apply_bonus(7), 9);\n    println!(\"Điểm sau thưởng: {}\", apply_bonus(7));\n}",
    "expectedOutput": "Điểm sau thưởng: 9\n",
    "hints": [
      "Closure có thể dùng bonus dù bonus không nằm trong danh sách tham số.",
      "Phần thân có thể chỉ là score + bonus."
    ],
    "quiz": {
      "question": "Điểm khác biệt hữu ích của closure so với hàm fn thông thường là gì?",
      "options": [
        "Closure không được kiểm tra kiểu",
        "Closure luôn chạy song song",
        "Closure có thể capture dữ liệu từ môi trường",
        "Closure không cần biên dịch"
      ],
      "correct": 2,
      "explanation": "Closure có thể sử dụng biến trong phạm vi nơi nó được tạo, với các quy tắc sở hữu và mượn phù hợp."
    },
    "reference": {
      "label": "The Rust Book · Closures",
      "url": "https://doc.rust-lang.org/book/ch13-01-closures.html"
    }
  },
  {
    "id": "iterators",
    "moduleId": "flexible",
    "title": "Iterator: Lọc, biến đổi, thu kết quả",
    "description": "Diễn tả một luồng xử lý dữ liệu ngắn gọn và rõ ý định.",
    "duration": 25,
    "objectives": [
      "Kết hợp filter và map",
      "Thu kết quả bằng collect",
      "Phân biệt iter và into_iter"
    ],
    "sections": [
      {
        "title": "Từng phần tử qua một chuỗi bước",
        "text": "Iterator cung cấp các giá trị từng bước. Những phương thức như filter chọn phần tử phù hợp, còn map biến mỗi phần tử thành một giá trị mới. Bạn có thể nối các bước để diễn tả việc cần làm mà không tự quản lý biến chỉ số.",
        "code": "let values = [1, 2, 3, 4];\nlet doubled: Vec<i32> = values.iter().map(|value| value * 2).collect();"
      },
      {
        "title": "Một chuỗi lười cần được tiêu thụ",
        "text": "Nhiều iterator adapter là lazy: chỉ tạo mô tả công việc mà chưa xử lý hết dữ liệu ngay. collect, sum, count hoặc vòng for sẽ tiêu thụ iterator. collect thường cần ngữ cảnh kiểu để biết bạn muốn kết quả là Vec, String hay một tập hợp khác."
      },
      {
        "title": "Mượn hay lấy quyền sở hữu",
        "text": "iter trên một Vec tạo iterator qua tham chiếu; iter_mut tạo tham chiếu có thể sửa; into_iter thường nhận quyền sở hữu container và đưa ra các giá trị được sở hữu. Chọn cách phù hợp để không vô tình làm dữ liệu gốc không còn dùng được."
      },
      {
        "title": "Đọc đúng kiểu Item của từng bước",
        "text": "Với values.iter(), Item là &i32. filter mượn mỗi Item để quyết định giữ hay bỏ, nên closure thấy &&i32; map nhận Item, nên thấy &i32. Hai dấu * trong filter không phải cú pháp tùy hứng. Hãy đọc chữ ký phương thức trong rustdoc khi compiler báo lệch tham chiếu. Viết vòng for dễ hiểu vẫn tốt hơn một chuỗi adapter mà bạn không giải thích được."
      }
    ],
    "tip": "Khi chuỗi iterator quá dài hoặc khó đọc, tách thành một biến có tên hoặc dùng vòng for. Ngắn hơn không luôn rõ hơn.",
    "exercise": {
      "title": "Bình phương các số chẵn",
      "instructions": "Viết even_squares: lấy số chẵn từ slice, bình phương chúng và trả Vec theo thứ tự ban đầu. Dữ liệu của bài này được giới hạn để các phép tính số nguyên không tràn; khi nhận dữ liệu tùy ý, cần thiết kế kiểm tra giới hạn hoặc dùng checked_*.",
      "requirements": [
        "Dùng filter, map và collect",
        "Không làm thay đổi slice đầu vào",
        "[1, 2, 3, 4, 5, 6] tạo [4, 16, 36]"
      ]
    },
    "starterCode": "fn even_squares(values: &[i32]) -> Vec<i32> {\n    todo!(\"Lọc số chẵn, bình phương và thu thành Vec\")\n}\n\nfn main() {\n    assert_eq!(even_squares(&[]), Vec::<i32>::new());\n    assert_eq!(even_squares(&[-2, 3]), vec![4]);\n    let result = even_squares(&[1, 2, 3, 4, 5, 6]);\n    assert_eq!(result, vec![4, 16, 36]);\n    println!(\"Kết quả: {result:?}\");\n}",
    "solutionCode": "fn even_squares(values: &[i32]) -> Vec<i32> {\n    values.iter()\n        .filter(|value| **value % 2 == 0)\n        .map(|value| value * value)\n        .collect()\n}\n\nfn main() {\n    assert_eq!(even_squares(&[]), Vec::<i32>::new());\n    assert_eq!(even_squares(&[-2, 3]), vec![4]);\n    let result = even_squares(&[1, 2, 3, 4, 5, 6]);\n    assert_eq!(result, vec![4, 16, 36]);\n    println!(\"Kết quả: {result:?}\");\n}",
    "expectedOutput": "Kết quả: [4, 16, 36]\n",
    "hints": [
      "iter tạo phần tử &i32; filter nhận thêm một lớp tham chiếu đến phần tử.",
      "filter(|value| **value % 2 == 0).map(|value| value * value).collect()"
    ],
    "quiz": {
      "question": "Thao tác nào thu các giá trị iterator thành một Vec?",
      "options": [
        "filter",
        "map",
        "collect",
        "iter"
      ],
      "correct": 2,
      "explanation": "collect tiêu thụ iterator và tạo tập hợp đích dựa trên kiểu được khai báo hoặc suy luận."
    },
    "reference": {
      "label": "The Rust Book · Processing a Series with Iterators",
      "url": "https://doc.rust-lang.org/book/ch13-02-iterators.html"
    }
  },
  {
    "id": "testing",
    "moduleId": "practice",
    "title": "Kiểm thử: Đúng cả trường hợp biên",
    "description": "Biến kỳ vọng thành những kiểm tra có thể chạy lại.",
    "duration": 25,
    "objectives": [
      "Thiết kế đầu vào tiêu biểu và biên",
      "Dùng assert và assert_eq",
      "Biết cách chuyển kiểm tra sang cargo test"
    ],
    "sections": [
      {
        "title": "Kiểm tra hành vi, không chỉ một ví dụ",
        "text": "Một hàm chạy đúng với đầu vào đẹp chưa đủ chứng minh nó xử lý đúng cả các ranh giới. Hãy chọn ca thử từ yêu cầu: phần tử rỗng, số 0, cận dưới, cận trên và dữ liệu sai. Mỗi kiểm tra nên nói rõ một hành vi mà bạn muốn giữ khi sửa mã."
      },
      {
        "title": "Viết các khẳng định có thể thực thi",
        "text": "assert kiểm tra một điều kiện bool. assert_eq so sánh kết quả thực tế với kết quả mong đợi và thường cho thông báo rõ hơn khi sai. Trong bài tập trên web, các assert nằm ở main để chúng được chạy cùng chương trình một tệp.",
        "code": "assert!(5 > 3);\nassert_eq!(2 + 2, 4);\nassert_eq!(Vec::<i32>::new().len(), 0);"
      },
      {
        "title": "Từ bài tập sang dự án Cargo",
        "text": "Trong dự án thật, đặt hàm kiểm thử dưới thuộc tính #[test], thường trong module #[cfg(test)], rồi chạy cargo test. Lệnh cargo run không tự chạy các hàm #[test]. Vì trang này dùng chế độ chạy chương trình, bài thực hành giữ các assert ở main để bạn thấy lỗi ngay.",
        "code": "#[cfg(test)]\nmod tests {\n    #[test]\n    fn addition_works() {\n        assert_eq!(2 + 2, 4);\n    }\n}"
      },
      {
        "title": "Từ kiểm tra ví dụ đến tìm hồi quy",
        "text": "Một bộ test cần ca thành công, ca lỗi và ranh giới của hợp đồng. Sau khi sửa bug, thêm ca từng làm hỏng chương trình để bắt hồi quy. Ví dụ phép chia phải xét mẫu 0 và i32::MIN / -1; tổng tiền phải xét tràn kiểu số. Test xanh chỉ chứng minh những tình huống đã kiểm tra. Với parser, hãy mô tả thêm tính chất như dữ liệu không hợp lệ luôn trả Err và lỗi giữ đúng số dòng, rồi kiểm tra nhiều đầu vào thay vì chỉ in một đáp án."
      }
    ],
    "tip": "Một bài test có ích nên thất bại nếu hành vi thật bị sai; tránh chỉ kiểm tra lại hằng số mà không gọi hàm cần kiểm tra.",
    "exercise": {
      "title": "Sửa lỗi ở ranh giới",
      "instructions": "Hàm is_passing hiện bỏ sót điểm 5. Sửa hàm để điểm từ 5 đến 10 là đạt, các điểm khác không đạt.",
      "requirements": [
        "Chấp nhận cả 5 và 10",
        "Từ chối -1, 4 và 11",
        "Giữ nguyên các assert trong main"
      ]
    },
    "starterCode": "fn is_passing(score: i32) -> bool {\n    score > 5 && score <= 10\n}\n\nfn main() {\n    assert!(!is_passing(-1));\n    assert!(!is_passing(4));\n    assert!(is_passing(5));\n    assert!(is_passing(10));\n    assert!(!is_passing(11));\n    println!(\"5 kiểm tra đều đạt\");\n}",
    "solutionCode": "fn is_passing(score: i32) -> bool {\n    score >= 5 && score <= 10\n}\n\nfn main() {\n    assert!(!is_passing(-1));\n    assert!(!is_passing(4));\n    assert!(is_passing(5));\n    assert!(is_passing(10));\n    assert!(!is_passing(11));\n    println!(\"5 kiểm tra đều đạt\");\n}",
    "expectedOutput": "5 kiểm tra đều đạt\n",
    "hints": [
      "Xem kỹ dấu so sánh ở cận dưới.",
      "score >= 5 && score <= 10; hoặc (5..=10).contains(&score)."
    ],
    "quiz": {
      "question": "Trong dự án Cargo, lệnh nào chạy các hàm được gắn #[test]?",
      "options": [
        "cargo run",
        "cargo build",
        "cargo test",
        "cargo new"
      ],
      "correct": 2,
      "explanation": "cargo test biên dịch và chạy test harness. cargo run chỉ chạy chương trình thực thi."
    },
    "reference": {
      "label": "The Rust Book · How to Write Tests",
      "url": "https://doc.rust-lang.org/book/ch11-01-writing-tests.html"
    }
  },
  {
    "id": "modules",
    "moduleId": "practice",
    "title": "Module & Tổ chức dự án",
    "description": "Chia mã thành những phần có ranh giới và giao diện rõ ràng.",
    "duration": 20,
    "objectives": [
      "Khai báo module bằng mod",
      "Mở phần giao diện bằng pub",
      "Đưa tên vào phạm vi với use"
    ],
    "sections": [
      {
        "title": "Tổ chức theo trách nhiệm",
        "text": "Module gom những mục liên quan và tạo một không gian tên riêng. Dùng mod để khai báo module; trong bài chạy một tệp, ta đặt thân module trực tiếp giữa ngoặc nhọn. Khi dự án lớn, module có thể được tách sang tệp riêng mà giữ cách tổ chức logic.",
        "code": "mod pricing {\n    pub fn subtotal(price: u32, quantity: u32) -> u32 {\n        price * quantity\n    }\n}"
      },
      {
        "title": "Giữ phần triển khai ở bên trong",
        "text": "Phần lớn mục trong module là private theo mặc định; pub mở giao diện mà bên ngoài cần dùng. Với struct public, từng trường vẫn cần pub riêng để truy cập trực tiếp. Biến thể của enum public và các mục của trait public tuân theo visibility của enum/trait, không có cùng quy tắc trường private như struct. Ranh giới này giúp thay triển khai mà giữ ổn định cách gọi."
      },
      {
        "title": "Đường dẫn và use",
        "text": "Một đường dẫn như pricing::subtotal chỉ rõ hàm thuộc module nào. use đưa một tên vào phạm vi hiện tại để gọi gọn hơn. Trong dự án Cargo, src/main.rs thường là điểm vào chương trình, còn src/lib.rs thường chứa giao diện thư viện có thể tái sử dụng và kiểm thử.",
        "code": "use pricing::subtotal;\n\nfn main() {\n    println!(\"{}\", subtotal(100, 3));\n}"
      }
    ],
    "tip": "Chỉ mở pub cho giao diện cần dùng bên ngoài. Không cần biến mọi hàm phụ thành public.",
    "exercise": {
      "title": "Module tính tiền",
      "instructions": "Hoàn thiện hàm subtotal bên trong module pricing, rồi dùng từ main. Tất cả mã nằm trong một tệp để chạy được trên web. Dữ liệu của bài này được giới hạn để các phép tính số nguyên không tràn; khi nhận dữ liệu tùy ý, cần thiết kế kiểm tra giới hạn hoặc dùng checked_*.",
      "requirements": [
        "Hàm subtotal phải public",
        "Trả price * quantity",
        "In: Thành tiền: 300000 VND"
      ]
    },
    "starterCode": "mod pricing {\n    pub fn subtotal(price: u32, quantity: u32) -> u32 {\n        todo!(\"Tính thành tiền\")\n    }\n}\n\nuse pricing::subtotal;\n\nfn main() {\n    assert_eq!(subtotal(100_000, 3), 300_000);\n    assert_eq!(subtotal(100_000, 0), 0);\n    println!(\"Thành tiền: {} VND\", subtotal(100_000, 3));\n}",
    "solutionCode": "mod pricing {\n    pub fn subtotal(price: u32, quantity: u32) -> u32 {\n        price * quantity\n    }\n}\n\nuse pricing::subtotal;\n\nfn main() {\n    assert_eq!(subtotal(100_000, 3), 300_000);\n    assert_eq!(subtotal(100_000, 0), 0);\n    println!(\"Thành tiền: {} VND\", subtotal(100_000, 3));\n}",
    "expectedOutput": "Thành tiền: 300000 VND\n",
    "hints": [
      "Giữ pub để main dùng được hàm trong module.",
      "Phần thân subtotal trả về price * quantity."
    ],
    "quiz": {
      "question": "Từ khóa pub dùng để làm gì trong một module?",
      "options": [
        "Chạy hàm song song",
        "Cho phép truy cập mục từ bên ngoài theo ranh giới visibility",
        "Biến dữ liệu thành hằng số",
        "Tự động tạo test"
      ],
      "correct": 1,
      "explanation": "pub điều khiển khả năng truy cập. Mục private mặc định được giữ trong ranh giới module phù hợp."
    },
    "reference": {
      "label": "The Rust Book · Defining Modules",
      "url": "https://doc.rust-lang.org/book/ch07-02-defining-modules-to-control-scope-and-privacy.html"
    }
  },
  {
    id: "threads", moduleId: "practice", title: "Thread & Chuyển dữ liệu an toàn",
    description: "Gửi một công việc sang luồng khác và chờ kết quả có kiểm soát.", duration: 30,
    objectives: ["Tạo thread bằng std::thread::spawn", "Chuyển quyền sở hữu với move", "Đợi và lấy kết quả qua join"],
    sections: [
      { title: "Thêm một luồng thực thi", text: "std::thread::spawn chạy một closure trên một thread mới và trả JoinHandle. Thứ tự chạy giữa các thread không cố định. Để đầu ra dễ kiểm tra, ta để thread tính toán và chỉ in kết quả sau khi main đã nhận được giá trị.", code: "let handle = std::thread::spawn(|| 2 + 3);\nlet value = handle.join().expect(\"Thread bị panic\");\nassert_eq!(value, 5);" },
      { title: "move làm rõ ai giữ dữ liệu", text: "Thread mới có thể chạy lâu hơn phạm vi đang tạo nó, nên không thể tùy ý mượn một biến cục bộ ngắn hạn. move đưa dữ liệu capture vào closure. Khi một Vec được chuyển vào thread, main không còn được dùng Vec đó, nhưng có thể nhận lại một kết quả do thread trả về." },
      { title: "Chờ kết thúc và hiểu giới hạn", text: "join chờ thread hoàn tất và trả Result vì thread có thể panic. Trong bài này expect phù hợp để báo một lỗi không dự kiến trong phép tính đơn giản. Nhiều thread không luôn nhanh hơn do chi phí tạo luồng; xử lý async là mô hình khác và không tự xuất hiện khi dùng spawn này." },
    ],
    tip: "Tránh cho nhiều thread cùng in các dòng dùng để chấm bài. Hãy gom kết quả và in theo thứ tự xác định ở main.",
    exercise: { title: "Tính tổng trên thread", instructions: "Chuyển Vec numbers vào closure của thread, tính tổng rồi trả về. main chờ join và hiển thị kết quả.", requirements: ["Sử dụng thread::spawn(move || ...)", "Tính tổng các phần tử, không ghi cứng 15", "In: Tổng từ thread: 15"] },
    starterCode: "use std::thread;\n\nfn main() {\n    let numbers = vec![1, 2, 3, 4, 5];\n    let handle = thread::spawn(move || -> i32 {\n        todo!(\"Tính tổng numbers\")\n    });\n\n    let total = handle.join().expect(\"Thread không được panic\");\n    assert_eq!(total, 15);\n    println!(\"Tổng từ thread: {total}\");\n}",
    solutionCode: "use std::thread;\n\nfn main() {\n    let numbers = vec![1, 2, 3, 4, 5];\n    let handle = thread::spawn(move || -> i32 {\n        numbers.into_iter().sum()\n    });\n\n    let total = handle.join().expect(\"Thread không được panic\");\n    assert_eq!(total, 15);\n    println!(\"Tổng từ thread: {total}\");\n}",
    expectedOutput: "Tổng từ thread: 15\n",
    hints: ["Closure sở hữu numbers nên có thể tiêu thụ nó bằng into_iter.", "numbers.into_iter().sum() trả tổng, với kiểu i32 đã ghi trên closure."],
    quiz: { question: "JoinHandle::join() làm gì?", options: ["Hủy thread ngay lập tức", "Chờ thread kết thúc và lấy kết quả hoặc lỗi panic", "Chạy thread lần thứ hai", "Biến thread thành async task"], correct: 1, explanation: "join đồng bộ với việc kết thúc thread và trả kết quả thực thi dưới dạng Result." },
    reference: { label: "The Rust Book · Using Threads to Run Code Simultaneously", url: "https://doc.rust-lang.org/book/ch16-01-threads.html" },
  },
  {
    "id": "mini-project",
    "moduleId": "practice",
    "title": "Dự án nhỏ: Sổ chi tiêu",
    "description": "Kết nối struct, slice, iterator và kiểm thử thành một chương trình hữu ích.",
    "duration": 35,
    "objectives": [
      "Tách mô hình dữ liệu khỏi phép tính",
      "Tổng hợp dữ liệu với iterator",
      "Kiểm thử chương trình bằng dữ liệu rỗng và nhiều bản ghi"
    ],
    "sections": [
      {
        "title": "Bắt đầu từ dữ liệu và hành vi",
        "text": "Sổ chi tiêu cần lưu tên khoản chi và số tiền. Một struct Expense biểu diễn một bản ghi; Vec<Expense> lưu nhiều bản ghi. Hàm total_expenses chỉ cần đọc một slice, nên không phải biết dữ liệu được tạo từ giao diện, tệp hay cơ sở dữ liệu."
      },
      {
        "title": "Giữ phần tính toán độc lập",
        "text": "Tách tính tổng khỏi println! giúp kiểm thử và tái sử dụng. Tiền được lưu bằng u64 theo đơn vị VND nguyên để tránh sai số dấu phẩy động. checked_add phát hiện tổng vượt giới hạn; Result đưa lỗi đến nơi quyết định cách báo cho người dùng. Không dùng saturating_add để âm thầm làm sai tổng tiền và không coi bản build release là cách xử lý lỗi.",
        "code": "struct Expense {\n    label: String,\n    amount: u64,\n}\n\nfn total_expenses(items: &[Expense]) -> u64 {\n    items.iter().map(|item| item.amount).sum()\n}"
      },
      {
        "title": "Một vòng làm việc hoàn chỉnh",
        "text": "Đọc yêu cầu, viết phần thiếu, chạy mã và giữ các kiểm tra hành vi. Sau khi hoàn thành, bạn có thể mở rộng dự án bằng bộ lọc danh mục, phân tích chuỗi nhập vào bằng Result, hoặc lưu tệp khi chuyển sang một dự án Cargo trên máy. Phiên bản trên web này dùng dữ liệu trong bộ nhớ và không ghi tệp của bạn."
      }
    ],
    "tip": "Viết hàm tính toán thuần trước, rồi nối với giao diện hoặc nhập xuất. Đây là cách giữ logic dễ hiểu khi dự án lớn lên.",
    "exercise": {
      "title": "Báo cáo chi tiêu trong ngày",
      "instructions": "Hoàn thiện total_expenses và count_over. Tổng trả Ok(u64) hoặc Err(\"Tổng chi vượt giới hạn\") nếu cộng bị tràn. count_over đếm khoản lớn hơn ngưỡng, không tính khoản bằng ngưỡng.",
      "requirements": [
        "Dùng checked_add để tổng không âm thầm bị tràn",
        "Danh sách rỗng trả Ok(0)",
        "count_over chỉ tính amount > threshold",
        "Giữ assertion kiểm tra u64::MAX và một khoản vượt tổng"
      ]
    },
    "starterCode": "struct Expense {\n    label: String,\n    amount: u64,\n}\n\nfn total_expenses(items: &[Expense]) -> Result<u64, &'static str> {\n    todo!(\"Cộng có kiểm tra và trả Result\")\n}\n\nfn count_over(items: &[Expense], threshold: u64) -> usize {\n    todo!(\"Đếm khoản lớn hơn ngưỡng\")\n}\n\nfn main() {\n    let expenses = vec![\n        Expense { label: String::from(\"Cà phê\"), amount: 35_000 },\n        Expense { label: String::from(\"Ăn trưa\"), amount: 65_000 },\n        Expense { label: String::from(\"Sách\"), amount: 100_000 },\n    ];\n    assert_eq!(total_expenses(&[]), Ok(0));\n    assert_eq!(total_expenses(&expenses), Ok(200_000));\n    let large = [\n        Expense { label: String::from(\"Giới hạn\"), amount: u64::MAX },\n        Expense { label: String::from(\"Thêm\"), amount: 1 },\n    ];\n    assert_eq!(total_expenses(&large[..1]), Ok(u64::MAX));\n    assert_eq!(total_expenses(&large), Err(\"Tổng chi vượt giới hạn\"));\n    assert_eq!(count_over(&expenses, 50_000), 2);\n    assert_eq!(count_over(&expenses, 100_000), 0);\n    println!(\"Khoản đầu: {}\", expenses[0].label);\n    println!(\"Tổng chi: {} VND\", total_expenses(&expenses).expect(\"Dữ liệu mẫu có tổng hợp lệ\"));\n    println!(\"Trên 50000 VND: {} khoản\", count_over(&expenses, 50_000));\n}",
    "solutionCode": "struct Expense {\n    label: String,\n    amount: u64,\n}\n\nfn total_expenses(items: &[Expense]) -> Result<u64, &'static str> {\n    items.iter().try_fold(0u64, |total, item| {\n        total.checked_add(item.amount).ok_or(\"Tổng chi vượt giới hạn\")\n    })\n}\n\nfn count_over(items: &[Expense], threshold: u64) -> usize {\n    items.iter().filter(|item| item.amount > threshold).count()\n}\n\nfn main() {\n    let expenses = vec![\n        Expense { label: String::from(\"Cà phê\"), amount: 35_000 },\n        Expense { label: String::from(\"Ăn trưa\"), amount: 65_000 },\n        Expense { label: String::from(\"Sách\"), amount: 100_000 },\n    ];\n    assert_eq!(total_expenses(&[]), Ok(0));\n    assert_eq!(total_expenses(&expenses), Ok(200_000));\n    let large = [\n        Expense { label: String::from(\"Giới hạn\"), amount: u64::MAX },\n        Expense { label: String::from(\"Thêm\"), amount: 1 },\n    ];\n    assert_eq!(total_expenses(&large[..1]), Ok(u64::MAX));\n    assert_eq!(total_expenses(&large), Err(\"Tổng chi vượt giới hạn\"));\n    assert_eq!(count_over(&expenses, 50_000), 2);\n    assert_eq!(count_over(&expenses, 100_000), 0);\n    println!(\"Khoản đầu: {}\", expenses[0].label);\n    println!(\"Tổng chi: {} VND\", total_expenses(&expenses).expect(\"Dữ liệu mẫu có tổng hợp lệ\"));\n    println!(\"Trên 50000 VND: {} khoản\", count_over(&expenses, 50_000));\n}",
    "expectedOutput": "Khoản đầu: Cà phê\nTổng chi: 200000 VND\nTrên 50000 VND: 2 khoản\n",
    "hints": [
      "Dùng try_fold với tổng ban đầu 0u64; mỗi lượt trả Result.",
      "checked_add(...).ok_or(\"Tổng chi vượt giới hạn\") dừng khi cộng tràn. Với count_over, filter theo amount > threshold rồi count."
    ],
    "quiz": {
      "question": "Vì sao total_expenses nhận &[Expense] thay vì lấy cả Vec<Expense>?",
      "options": [
        "Để tự sửa các khoản chi",
        "Để đọc dữ liệu linh hoạt mà không lấy quyền sở hữu",
        "Để chạy song song tự động",
        "Vì Vec không thể chứa struct"
      ],
      "correct": 1,
      "explanation": "Slice cho phép đọc dữ liệu từ nhiều nguồn, giữ owner ở bên gọi và tránh chuyển quyền sở hữu không cần thiết."
    },
    "reference": {
      "label": "The Rust Book · An I/O Project",
      "url": "https://doc.rust-lang.org/book/ch12-00-an-io-project.html"
    }
  },
];

// Stable lesson IDs preserve existing progress and editor drafts after reorganizing chapters.
const chapterLessonIds: Record<string, string[]> = {
  "setup": [
    "hello-rust",
    "installation",
    "cargo-basics",
    "compiler-errors"
  ],
  "basics": [
    "variables",
    "scalar-types",
    "constants-shadowing",
    "conversions"
  ],
  "flow": [
    "functions",
    "expressions-scope",
    "control-flow",
    "loops"
  ],
  "ownership": [
    "ownership",
    "borrowing",
    "slices",
    "lifetimes"
  ],
  "types": [
    "structs",
    "methods",
    "enums",
    "pattern-matching"
  ],
  "collections": [
    "vectors",
    "strings",
    "hashmaps",
    "hashsets"
  ],
  "errors": [
    "option",
    "result",
    "question-mark",
    "custom-errors"
  ],
  "modules": [
    "modules",
    "visibility",
    "crates-dependencies",
    "workspaces"
  ],
  "generics": [
    "generics",
    "traits",
    "trait-bounds",
    "associated-types"
  ],
  "iteration": [
    "closures",
    "iterators",
    "iterator-ownership",
    "custom-iterator"
  ],
  "smart": [
    "box",
    "rc",
    "refcell",
    "weak"
  ],
  "lifetimes": [
    "lifetime-struct",
    "static-lifetime",
    "cow",
    "drop"
  ],
  "testing": [
    "testing",
    "integration-tests",
    "doc-tests",
    "clippy-format"
  ],
  "io": [
    "io-files",
    "buffered-io",
    "cli-args",
    "cli-errors"
  ],
  "concurrency": [
    "threads",
    "channels",
    "mutex-arc",
    "send-sync"
  ],
  "async": [
    "async-await",
    "futures-poll",
    "pin-unpin",
    "async-runtime"
  ],
  "macros": [
    "macro-rules",
    "macro-repetition",
    "derive-traits",
    "cfg-attributes"
  ],
  "advanced": [
    "trait-objects",
    "advanced-patterns",
    "unsafe-basics",
    "ffi-layout"
  ],
  "design": [
    "newtype",
    "typestate",
    "allocation",
    "benchmarking"
  ],
  "practice": [
    "mini-project",
    "cli-search",
    "parser-project",
    "concurrent-project"
  ]
};
const lessonById = new Map([...coreLessons, ...foundationLessons, ...systemLessons, ...practiceLessons].map(lesson => [lesson.id, lesson]));
export const lessons: Lesson[] = modules.flatMap(module => chapterLessonIds[module.id].map(id => {
  const lesson = lessonById.get(id);
  if (!lesson) throw new Error(`Missing lesson: ${id}`);
  return { ...lesson, moduleId: module.id };
}));
