export type CareerSource = { label: string; url: string };
export type CareerStage = {
  id: string; title: string; scope: string; outcome: string;
  tasks: string[]; gate: string; lesson: string; sources: CareerSource[];
};
export type InterviewQuestion = {
  id: string; category: string; question: string; answer: string[];
  followUp: string; pitfall: string; source: CareerSource;
};
export type CareerProject = {
  id: string; title: string; description: string; prerequisites: string;
  files: string[]; milestones: { title: string; tasks: string[] }[];
  acceptance: string[]; tests: string[]; review: string[];
  sources: CareerSource[]; starter?: string;
};
export type ReadinessGate = {
  id: string; title: string; criteria: string[]; example: string;
};

export const careerStages: CareerStage[] = [
  {
    id: "language", title: "1. Hiểu và dùng được ngôn ngữ", scope: "20 chương nền tảng trên web",
    outcome: "Viết một lời giải mới và giải thích được tại sao kiểu dữ liệu, quyền sở hữu và cách xử lý lỗi đó phù hợp.",
    tasks: [
      "Học lần lượt chương 1–10, rồi 11–20. Với mỗi bài, tự viết lời giải trước khi xem gợi ý; thêm ít nhất một ca biên khác ví dụ có sẵn.",
      "Luyện đọc lỗi move, borrow và lifetime: tạo một ví dụ lỗi nhỏ, nêu ai sở hữu dữ liệu, rồi sửa bằng thiết kế phù hợp trước khi cân nhắc clone hoặc Arc.",
      "Ôn lại Result, trait, iterator, Send/Sync và async bằng cách giải thích thành lời. Chỉ đọc định nghĩa chưa chứng minh được bạn áp dụng được chúng.",
    ],
    gate: "Tự viết CLI tìm kiếm trong chuỗi, xử lý Unicode và đầu vào sai; bảo vệ được lựa chọn &str/String, Result và cấu trúc kiểm thử.",
    lesson: "ownership",
    sources: [{ label: "The Rust Book", url: "https://doc.rust-lang.org/book/" }, { label: "Rust By Example", url: "https://doc.rust-lang.org/rust-by-example/" }],
  },
  {
    id: "engineering", title: "2. Làm việc trong một dự án Cargo", scope: "Thực hành trên máy cá nhân",
    outcome: "Tự tổ chức nhiều tệp, dùng thư viện ngoài, kiểm thử và sửa lỗi trong một repository có thể chạy lại được.",
    tasks: [
      "Chuyển phần tính toán vào src/lib.rs, để src/main.rs chỉ xử lý tham số, I/O và mã thoát. Tách module theo trách nhiệm; giới hạn bề mặt pub.",
      "Viết unit test, integration test và doc-test. Chạy cargo fmt --check, cargo clippy --all-targets -- -D warnings, cargo test --locked trong CI từ bản clone sạch.",
      "Học Serde cho dữ liệu ở ranh giới, Tokio cho I/O đồng thời, Axum cho HTTP và SQLx cho lưu trữ. Đọc tài liệu đúng phiên bản trong Cargo.lock khi API khác ví dụ.",
      "Luyện Git bằng thay đổi nhỏ, review diff, viết mô tả lỗi và bước tái hiện. Ghi lại một quyết định kỹ thuật cùng phương án đã cân nhắc.",
    ],
    gate: "Người khác clone repository, làm theo README và chạy được ứng dụng cùng bộ test mà không cần sửa đường dẫn hay dùng dữ liệu riêng của bạn.",
    lesson: "workspaces",
    sources: [{ label: "Cargo Book", url: "https://doc.rust-lang.org/cargo/" }, { label: "Tokio tutorial", url: "https://tokio.rs/tokio/tutorial" }, { label: "Serde", url: "https://serde.rs/" }],
  },
  {
    id: "delivery", title: "3. Hoàn thành dự án và bảo vệ thiết kế", scope: "Portfolio và phỏng vấn thử",
    outcome: "Đưa ra được bằng chứng về hành vi đúng, cách xử lý lỗi và giới hạn của một dịch vụ hoặc thư viện do chính bạn viết.",
    tasks: [
      "Làm CLI trước, sau đó API có cơ sở dữ liệu. Dự án thư viện giúp luyện thiết kế API công khai; chọn thêm một nhánh chuyên sâu phù hợp vị trí ứng tuyển.",
      "Chủ động tạo sự cố: dữ liệu sai, DB không mở được, timeout, yêu cầu trùng và quá nhiều tác vụ. Quan sát lỗi, kiểm tra dữ liệu sau sự cố và ghi cách khắc phục.",
      "Đo hiệu năng với dữ liệu và cấu hình công khai; báo thời gian chờ, thông lượng và tỷ lệ lỗi. Không suy từ một lần chạy hay từ mã Rust sang kết luận hệ thống luôn nhanh.",
      "Phỏng vấn thử: giải thích ownership và một lỗi async, viết một bài nhỏ có test, rồi trình bày dự án theo yêu cầu → thiết kế → đánh đổi → kết quả.",
    ],
    gate: "Có repository, lệnh tái hiện, bộ test, một thay đổi qua review và buổi trình bày mà bạn trả lời được các câu hỏi tiếp theo mà không đọc lời giải.",
    lesson: "benchmarking",
    sources: [{ label: "Thiết kế API Rust", url: "https://rust-lang.github.io/api-guidelines/" }, { label: "Graceful shutdown", url: "https://tokio.rs/tokio/topics/shutdown" }],
  },
];

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: "api-ownership", category: "Ownership & kiểu dữ liệu",
    question: "Một hàm xử lý tên nên nhận &str hay String? Khi nào clone là hợp lý?",
    answer: ["Nhận &str khi chỉ cần đọc trong thời gian gọi; nhận String khi cần giữ quyền sở hữu sau lời gọi hoặc tiêu thụ dữ liệu. &str cũng nhận được dữ liệu mượn từ String và chuỗi literal.", "clone của String sao chép nội dung và có thể cấp phát; chi phí phụ thuộc dữ liệu, chuỗi rỗng không nhất thiết cần cấp phát. Nó hợp lý khi hai thành phần thực sự cần dữ liệu độc lập, nhưng không phải cách mặc định để tắt lỗi borrow.", "Nếu muốn trả một phần đầu vào thì slice kèm lifetime có thể phù hợp. Nếu kết quả được tạo mới hoặc phải tồn tại độc lập, trả String thường rõ ràng hơn."],
    followUp: "Thiết kế hàm trim_name và một hàng đợi lưu tên sau khi hàm gọi kết thúc. Chữ ký của hai API khác nhau thế nào?",
    pitfall: "Đổi mọi tham số thành String hoặc thêm clone vào mọi nơi mà không xác định thời gian sống và quyền sở hữu.",
    source: { label: "Rust Book: slice", url: "https://doc.rust-lang.org/book/ch04-03-slices.html" },
  },
  {
    id: "move-copy-clone", category: "Ownership & kiểu dữ liệu",
    question: "Move, Copy và Clone khác nhau thế nào? Move có luôn sao chép vùng heap không?",
    answer: ["Move chuyển giá trị và quyền sử dụng; binding cũ của kiểu không Copy thường không còn dùng được. Đây là ngữ nghĩa của ngôn ngữ, không phải cam kết rằng máy luôn thực hiện một lệnh sao chép cụ thể.", "Copy cho phép sao chép ngầm theo bit và giữ binding cũ hợp lệ; các trường cũng phải Copy và kiểu không được có Drop. Clone là thao tác tường minh, có thể cấp phát hoặc thực hiện logic riêng.", "Move một String không cần nhân đôi vùng ký tự trên heap. Clone String thường nhân đôi nội dung; clone Arc chủ yếu tăng bộ đếm tham chiếu, không sao chép đối tượng bên trong."],
    followUp: "Vì sao một struct chứa String không thể derive Copy, còn struct chứa u32 thường có thể?",
    pitfall: "Cho rằng Clone luôn rẻ, hoặc move luôn cấp phát bộ nhớ mới.",
    source: { label: "Thư viện chuẩn: Copy", url: "https://doc.rust-lang.org/std/marker/trait.Copy.html" },
  },
  {
    id: "borrow-design", category: "Ownership & kiểu dữ liệu",
    question: "Đang giữ tham chiếu vào Vec mà lại push thì lỗi borrow. Bạn sửa bằng cách nào?",
    answer: ["push có thể cấp phát lại, khiến tham chiếu vào phần tử không còn trỏ đúng nơi. Rust từ chối việc giữ borrow còn sử dụng trong lúc thực hiện thay đổi xung đột.", "Có thể dùng xong tham chiếu trước khi push; giữ chỉ số rồi lấy lại tham chiếu sau thay đổi; hoặc lấy một giá trị sở hữu nếu bài toán thực sự cần bản sao. Phải kiểm tra chỉ số nếu thao tác có thể xóa hoặc sắp xếp lại dữ liệu.", "Đặt đoạn mã tối thiểu tái hiện lỗi và giải thích lần sử dụng cuối của borrow. Không dùng unsafe chỉ để bỏ qua ràng buộc mà chưa chứng minh tính hợp lệ."],
    followUp: "Nếu thay Vec bằng HashMap và dùng entry API, bạn có thể giảm số lần tra cứu và rút ngắn borrow thế nào?",
    pitfall: "Nghĩ rằng đã reserve đủ capacity thì mọi borrow xung đột đều được phép.",
    source: { label: "Rust Book: Vec", url: "https://doc.rust-lang.org/book/ch08-01-vectors.html" },
  },
  {
    id: "lifetime-contract", category: "Ownership & kiểu dữ liệu",
    question: "Lifetime annotation có kéo dài tuổi thọ của biến không? T: 'static có nghĩa là rò rỉ bộ nhớ không?",
    answer: ["Lifetime annotation mô tả quan hệ hợp lệ giữa các tham chiếu; nó không khiến dữ liệu cục bộ sống lâu hơn. Trả tham chiếu đến String được tạo trong hàm vẫn sai.", "T: 'static nói rằng kiểu không chứa tham chiếu vay mượn ngắn hơn 'static; một String sở hữu dữ liệu có thể thỏa mãn và vẫn được drop bình thường.", "&'static str là một trường hợp khác: chính tham chiếu đó có thể hợp lệ trong toàn bộ chương trình. Tránh gán 'static tùy tiện khi API chỉ cần lifetime theo đầu vào."],
    followUp: "Hàm chọn một trong hai &str cần mô tả quan hệ lifetime nào? Khi đổi kết quả sang String, đánh đổi là gì?",
    pitfall: "Thêm 'static vào chữ ký để sửa lỗi mượn dữ liệu cục bộ hoặc cho rằng mọi giá trị 'static không bao giờ bị giải phóng.",
    source: { label: "Rust Book: lifetime", url: "https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html" },
  },
  {
    id: "unicode", category: "Ownership & kiểu dữ liệu",
    question: "len(), chars().count() và số ký tự người dùng nhìn thấy có luôn bằng nhau không?",
    answer: ["String lưu UTF-8; len() đếm byte. chars() duyệt Unicode scalar value, không trực tiếp đếm cụm ký tự hiển thị.", "Một chữ có dấu có thể dùng scalar dựng sẵn hoặc chữ cái cộng dấu kết hợp; emoji cũng có thể gồm nhiều scalar. Cắt chuỗi theo byte phải nằm ở ranh giới UTF-8.", "Chọn đơn vị theo yêu cầu: giới hạn kích thước request bằng byte, xử lý scalar bằng chars(), hoặc dùng phân đoạn grapheme nếu cần thao tác ký tự theo cách người dùng cảm nhận."],
    followUp: "Thiết kế ca thử cho tên tiếng Việt, emoji, chuỗi rỗng và hai biểu diễn Unicode nhìn giống nhau.",
    pitfall: "Dùng s[0..n] cho mọi chuỗi người dùng hoặc gọi chars().count() là số grapheme.",
    source: { label: "Thư viện chuẩn: str", url: "https://doc.rust-lang.org/std/primitive.str.html" },
  },
  {
    id: "state-model", category: "Thiết kế API & lỗi",
    question: "Vì sao enum hoặc newtype có thể tốt hơn nhiều bool và String?",
    answer: ["Enum biểu diễn các trạng thái hợp lệ cùng dữ liệu tương ứng, giảm tổ hợp vô nghĩa như vừa chưa gửi vừa đã nhận. match giúp thấy những trường hợp cần xử lý.", "Newtype phân biệt ý nghĩa của các giá trị cùng biểu diễn, như UserId và OrderId. Constructor có kiểm tra giúp dữ liệu không hợp lệ bị chặn ở ranh giới.", "Typestate có thể đưa quy tắc chuyển trạng thái vào kiểu, nhưng làm API generic phức tạp hơn. Với trạng thái từ DB hoặc mạng, enum và kiểm tra runtime thường vẫn cần thiết."],
    followUp: "Mô hình hóa đơn hàng Draft, Submitted, Cancelled; ai được phép thay đổi trạng thái và dữ liệu nào bắt buộc?",
    pitfall: "Dùng kiểu quá phức tạp chỉ để né mọi kiểm tra runtime, hoặc mở pub cho các trường phá vỡ invariant.",
    source: { label: "Rust Book: enum", url: "https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html" },
  },
  {
    id: "generic-dyn", category: "Thiết kế API & lỗi",
    question: "Chọn generic, impl Trait hay dyn Trait theo tiêu chí nào?",
    answer: ["Generic thường cho phép dispatch tĩnh và tối ưu hóa theo kiểu cụ thể, nhưng có thể tăng mã máy và thời gian biên dịch. impl Trait ở vị trí trả về che tên của một kiểu cụ thể, không tự cho phép trả nhiều kiểu khác nhau.", "dyn Trait dùng dispatch động qua trait object và phù hợp khi cần tập hợp giá trị có kiểu khác nhau hoặc ranh giới mở rộng runtime. Dùng &dyn Trait không tự cấp phát; Box<dyn Trait> mới là một cách sở hữu thường gặp.", "Không phải trait nào cũng dyn-compatible. Cần kiểm tra chữ ký method, associated items và yêu cầu Self trước khi chọn thiết kế."],
    followUp: "Một danh sách các bộ xuất báo cáo khác kiểu nên dùng enum hay trait object? Nêu một ưu và nhược điểm của mỗi cách.",
    pitfall: "Nói dyn luôn chậm đáng kể mà chưa đo hoặc nói mọi impl Trait đều tương đương trait object.",
    source: { label: "Rust Book: trait object", url: "https://doc.rust-lang.org/book/ch18-02-trait-objects.html" },
  },
  {
    id: "result-design", category: "Thiết kế API & lỗi",
    question: "Một thư viện nên trả lỗi gì? Toán tử ? làm gì và không làm gì?",
    answer: ["Nếu bên gọi cần phân nhánh, cung cấp lỗi có cấu trúc như enum và giữ nguồn lỗi I/O hoặc parse. Chuỗi thông báo dành cho người đọc không thay thế hợp đồng lỗi ổn định.", "Với Result, ? lấy giá trị Ok hoặc trả sớm lỗi phù hợp với kiểu trả về; quá trình có thể dùng chuyển đổi lỗi. Nó không tự ghi log, retry hay biến lỗi thành phản hồi HTTP.", "Đặt ngữ cảnh tại ranh giới ứng dụng. Tránh trả chi tiết nội bộ nhạy cảm cho client và tránh log cùng một lỗi lặp lại ở mọi tầng."],
    followUp: "Phân biệt lỗi dữ liệu người dùng, lỗi không tìm thấy và lỗi DB. Lỗi nào được retry, lỗi nào nên sửa đầu vào?",
    pitfall: "unwrap dữ liệu bên ngoài vì happy path chạy đúng hoặc biến mọi lỗi thành một String khiến bên gọi phải so khớp thông báo.",
    source: { label: "Rust Book: Result và ?", url: "https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html" },
  },
  {
    id: "iterator-errors", category: "Thiết kế API & lỗi",
    question: "Một iterator tạo Result. collect::<Result<Vec<_>, _>>() và filter_map(Result::ok) khác nhau thế nào?",
    answer: ["collect vào Result<Vec<_>, E> kết thúc ở lỗi đầu tiên và trả Err; những giá trị thành công trước đó không trở thành một kết quả Vec được trả cho bên gọi.", "filter_map(Result::ok) bỏ mọi lỗi. Cách này chỉ đúng khi đặc tả cho phép bỏ bản ghi lỗi và vẫn có cơ chế quan sát những bản ghi bị bỏ nếu cần.", "Muốn thu tất cả lỗi kèm số dòng thì cần tự tích lũy hoặc thiết kế kết quả chứa cả dữ liệu và diagnostics. Sự ngắn gọn của iterator không quyết định được chính sách lỗi."],
    followUp: "Một tệp nhập 10.000 dòng có 3 dòng sai. Bạn chọn all-or-nothing hay nhập một phần, và làm sao báo cáo chính xác?",
    pitfall: "Dùng filter_map để làm bài test qua mà âm thầm mất dữ liệu lỗi.",
    source: { label: "Thư viện chuẩn: Result", url: "https://doc.rust-lang.org/std/result/" },
  },
  {
    id: "public-api", category: "Thiết kế API & lỗi",
    question: "Bạn tổ chức crate và thay đổi API công khai mà không làm người dùng bất ngờ thế nào?",
    answer: ["Tách core logic khỏi executable, dùng module để giới hạn chi tiết và chỉ pub phần bên ngoài cần. Viết doc-test mô tả hành vi thực tế của API.", "Đổi chữ ký, bỏ item công khai hoặc thay đổi hành vi có thể phá tương thích. Thêm variant vào enum public cũng có thể ảnh hưởng match exhaustive; cân nhắc non_exhaustive từ khi thiết kế nếu phù hợp.", "Xem yêu cầu phiên bản, feature và MSRV như một phần hợp đồng. Thử build/test cấu hình được hỗ trợ, ghi thay đổi và kiểm tra hướng dẫn của Cargo thay vì suy từ tên phiên bản."],
    followUp: "Bạn muốn đổi kiểu lỗi trả về của hàm public. Có thể chuyển tiếp dần bằng một API mới không?",
    pitfall: "Cho rằng thêm bất kỳ item nào cũng là thay đổi không phá vỡ hoặc công khai toàn bộ module cho tiện dùng.",
    source: { label: "Cargo: SemVer compatibility", url: "https://doc.rust-lang.org/cargo/reference/semver.html" },
  },
  {
    id: "smart-pointers", category: "Bộ nhớ & đồng thời",
    question: "Box, Rc, Arc và RefCell giải quyết các vấn đề khác nhau ra sao?",
    answer: ["Box thường giữ một giá trị trên heap với một chủ sở hữu; Rc cho nhiều chủ sở hữu trong một thread; Arc dùng bộ đếm nguyên tử để hỗ trợ chia sẻ ownership giữa các thread khi kiểu bên trong đáp ứng điều kiện.", "RefCell cho interior mutability với kiểm tra borrow tại runtime và có thể panic khi vi phạm. Nó không biến dữ liệu thành thread-safe.", "Arc không tự cung cấp mutable access. Nếu cần sửa dữ liệu dùng chung, chọn Mutex, RwLock, atomics hoặc thiết kế message passing tùy invariant và tranh chấp."],
    followUp: "Vì sao Arc<RefCell<T>> không phải cách chung để chia sẻ dữ liệu mutable giữa nhiều thread?",
    pitfall: "Đánh đồng đếm tham chiếu với cơ chế đồng bộ hoặc cho rằng Rc và Arc tự xử lý chu trình tham chiếu.",
    source: { label: "Thư viện chuẩn: Arc", url: "https://doc.rust-lang.org/std/sync/struct.Arc.html" },
  },
  {
    id: "send-sync", category: "Bộ nhớ & đồng thời",
    question: "Send và Sync bảo đảm điều gì? Vì sao không nên tự unsafe impl cho đến khi hết lỗi?",
    answer: ["Send nói rằng chuyển ownership của một giá trị sang thread khác là an toàn. Sync nói rằng chia sẻ tham chiếu &T giữa các thread là an toàn; tương đương &T là Send.", "Các auto trait này thường được suy ra từ thành phần của kiểu. Đếm tham chiếu không nguyên tử hoặc nội bộ mutable không đồng bộ là những lý do phổ biến khiến kiểu không đáp ứng.", "unsafe impl là lời cam kết mà compiler dựa vào. Cần chứng minh invariant về aliasing, đồng bộ và vòng đời; test chạy được vài lần không phải bằng chứng soundness."],
    followUp: "Một kiểu chứa raw pointer có thể an toàn trong thiết kế của bạn, nhưng cần chứng minh những điều kiện gì trước khi chia sẻ nó?",
    pitfall: "Cho rằng Send nghĩa là có thể truy cập đồng thời tùy ý, hoặc sửa lỗi bằng unsafe impl mà không chứng minh invariant.",
    source: { label: "Rustonomicon: Send và Sync", url: "https://doc.rust-lang.org/nomicon/send-and-sync.html" },
  },
  {
    id: "deadlock", category: "Bộ nhớ & đồng thời",
    question: "Safe Rust ngăn data race. Vì sao ứng dụng vẫn có thể deadlock hoặc sai số dư?",
    answer: ["An toàn bộ nhớ không thay thế tính đúng của nghiệp vụ. Hai thread có thể giữ hai khóa theo thứ tự ngược nhau và chờ mãi, dù từng truy cập đều được bảo vệ.", "Một chuỗi đọc rồi kiểm tra rồi ghi có thể có race logic nếu invariant không được bảo vệ xuyên suốt. Có thể cần một critical section, một transaction hoặc phép toán atomic phù hợp.", "Giảm số khóa, cố định thứ tự lấy khóa, tránh gọi việc không kiểm soát khi đang giữ khóa, và viết ca thử thao tác đồng thời. Timeout giúp phát hiện treo nhưng không tự sửa invariant."],
    followUp: "Hai yêu cầu cùng trừ tiền sau khi đọc số dư. Khóa hay transaction cần bao trùm phần nào?",
    pitfall: "Kết luận chương trình đúng về đồng thời chỉ vì compiler không báo lỗi.",
    source: { label: "Rust Book: shared-state concurrency", url: "https://doc.rust-lang.org/book/ch16-03-shared-state.html" },
  },
  {
    id: "async-mutex", category: "Bộ nhớ & đồng thời",
    question: "Trong Tokio, khi nào dùng std::sync::Mutex và khi nào dùng tokio::sync::Mutex?",
    answer: ["Mutex đồng bộ có thể phù hợp cho critical section rất ngắn, ít tranh chấp và không có await bên trong. Việc khóa lâu vẫn chặn thread của runtime.", "Mutex async cho phép chờ khóa mà nhường runtime và guard có thể tồn tại qua await. Tuy vậy giữ khóa trong lúc I/O chậm làm các task khác phải chờ, nên trước hết hãy xem có thể thu hẹp phạm vi hoặc dùng task sở hữu tài nguyên không.", "Không chỉ thay loại Mutex để chữa kiến trúc giữ khóa quá lâu. Với socket hoặc tài nguyên I/O có trạng thái, actor và channel có thể làm ownership rõ hơn."],
    followUp: "Bạn cần đọc cấu hình dùng chung rồi gọi HTTP. Có thể sao chép phần dữ liệu nhỏ và nhả khóa trước lời gọi không?",
    pitfall: "Giữ std::sync::MutexGuard qua await hoặc coi Mutex async là cách làm mọi thao tác nhanh hơn.",
    source: { label: "Tokio: shared state", url: "https://tokio.rs/tokio/tutorial/shared-state" },
  },
  {
    id: "pin-contract", category: "Bộ nhớ & đồng thời",
    question: "Pin giải quyết điều gì? Pin<Box<T>> có cấm di chuyển chính biến chứa Box không?",
    answer: ["Pin là một phần hợp đồng giữ vị trí của giá trị được trỏ tới khi giá trị đó không Unpin; điều này hữu ích cho dữ liệu tự tham chiếu, gồm một số future.", "Di chuyển handle Pin<Box<T>> không nhất thiết di chuyển T trên heap. Điều cần bảo vệ là giá trị pointee, không phải địa chỉ của mọi binding bên ngoài.", "Với T: Unpin, các hạn chế liên quan đến việc di chuyển pointee qua API pin có thể được nới. Dùng safe pinning API; thao tác projection unsafe phải giữ hợp đồng pin xuyên suốt Drop và truy cập trường."],
    followUp: "Vì sao Pin không đồng nghĩa với bất biến, và vì sao nó không tự cấp phát bộ nhớ?",
    pitfall: "Gọi Pin là một cách khóa bộ nhớ bất biến hoặc dùng unsafe get_unchecked_mut rồi di chuyển trường được pin.",
    source: { label: "Thư viện chuẩn: pin", url: "https://doc.rust-lang.org/std/pin/" },
  },
  {
    id: "spawn-bounds", category: "Async & dịch vụ",
    question: "tokio::spawn yêu cầu Send + 'static vì sao? async move có làm mọi future thành Send không?",
    answer: ["Future phải thỏa Send ngay khi đưa vào spawn và khi được runtime chuyển giữa các worker. Vì vậy capture ban đầu và dữ liệu giữ qua await đều cần phù hợp; một Rc được async move capture từ bên ngoài vẫn có thể khiến future không Send.", "Task có thể sống lâu hơn scope tạo ra nó, nên không thể giữ tham chiếu vay mượn ngắn hạn từ scope đó. async move chuyển các capture vào future và thường giúp giải quyết ownership.", "async move không biến Rc thành Send. Rc tạo bên trong future, trong một scope kết thúc trước await, có thể không nằm trong state cần chuyển giữa các worker; trường hợp này khác Rc capture từ bên ngoài. Có thể đổi thiết kế chia sẻ hoặc dùng task local khi phù hợp."],
    followUp: "Tại sao một Rc được tạo rồi drop hoàn toàn trước await có thể khác một Rc được dùng sau await?",
    pitfall: "Dùng clone nhưng vẫn clone một tham chiếu ngắn hạn, hoặc nhầm 'static với bắt buộc giữ task chạy mãi.",
    source: { label: "Tokio: spawning", url: "https://tokio.rs/tokio/tutorial/spawning" },
  },
  {
    id: "blocking-runtime", category: "Async & dịch vụ",
    question: "Đặt xử lý CPU nặng hoặc std::thread::sleep trong async fn có vấn đề gì?",
    answer: ["async fn không tự chuyển công việc sang thread khác. Một đoạn CPU dài hoặc thao tác blocking có thể chiếm worker và làm các future khác không được poll kịp.", "Dùng timer/I/O async phù hợp. Với tác vụ blocking cần thiết có thể dùng spawn_blocking, nhưng phải giới hạn lượng công việc vì pool blocking và tài nguyên máy không vô hạn.", "Tác vụ CPU dài có thể phù hợp với pool chuyên dụng. spawn_blocking đã bắt đầu thường không thể bị abort như một async task, nên cần kế hoạch dừng hoặc chia nhỏ công việc."],
    followUp: "API nhận 1.000 yêu cầu nén tệp cùng lúc: bạn giới hạn số job và phản hồi quá tải thế nào?",
    pitfall: "Cho rằng chỉ thêm async hoặc spawn_blocking là đủ để có khả năng mở rộng không giới hạn.",
    source: { label: "Tokio: spawn_blocking", url: "https://docs.rs/tokio/latest/tokio/task/fn.spawn_blocking.html" },
  },
  {
    id: "cancellation", category: "Async & dịch vụ",
    question: "Một nhánh tokio::select! thua cuộc thì chuyện gì xảy ra? Khi nào hủy có thể làm mất tiến độ?",
    answer: ["Khi một nhánh hoàn tất, select không tiếp tục poll các nhánh khác trong lần gọi đó. Future do macro sở hữu bị drop; nếu nhánh chỉ mượn &mut future thì future gốc vẫn tồn tại. Drop hoặc ngừng chờ JoinHandle cũng không tự hủy task đã spawn.", "Tính an toàn khi hủy phụ thuộc từng operation. Một thao tác đã đọc hoặc ghi một phần có thể mất thông tin tiến độ nếu được tạo lại từ đầu, nên cần đọc mục cancellation safety của API.", "Thiết kế state sống ngoài future tạm thời, dùng operation có contract phù hợp hoặc ghi nhận tiến độ. Hiệu ứng đã xảy ra không tự được hoàn tác; timeout DB hay dịch vụ từ xa có thể chưa đủ để biết thao tác đã thành công chưa."],
    followUp: "Timeout xảy ra khi gửi thanh toán nhưng chưa nhận phản hồi. Vì sao retry ngay có thể tạo hai lần thanh toán?",
    pitfall: "Cho rằng drop future luôn hủy mọi side effect hoặc tự rollback mọi tài nguyên bên ngoài.",
    source: { label: "Tokio: select và cancellation safety", url: "https://docs.rs/tokio/latest/tokio/macro.select.html" },
  },
  {
    id: "backpressure", category: "Async & dịch vụ",
    question: "Tại sao chọn bounded channel? Khi hàng đợi đầy, ứng dụng nên làm gì?",
    answer: ["Hàng đợi có giới hạn buộc hệ thống đưa ra chính sách khi bên nhận chậm, thay vì tiếp tục tăng bộ nhớ. Bên gửi có thể chờ, từ chối hoặc bỏ dữ liệu theo yêu cầu nghiệp vụ.", "Chọn dung lượng dựa trên tải, kích thước thông điệp và thời gian chấp nhận chờ. Theo dõi độ dài hàng đợi, thời gian chờ và số yêu cầu bị từ chối.", "Channel có giới hạn số phần tử không tự giới hạn tổng byte nếu mỗi phần tử có kích thước không giới hạn. Giới hạn payload và số task đồng thời vẫn cần thiết."],
    followUp: "Thông báo chat, mẫu cảm biến và lệnh chuyển tiền có thể dùng cùng chính sách bỏ dữ liệu không?",
    pitfall: "Dùng unbounded queue để tránh lỗi đầy hàng đợi rồi coi hệ thống đã xử lý được quá tải.",
    source: { label: "Tokio: channels", url: "https://tokio.rs/tokio/tutorial/channels" },
  },
  {
    id: "shutdown", category: "Async & dịch vụ",
    question: "Thiết kế shutdown cho một HTTP server có background task thế nào?",
    answer: ["Cần phát hiện tín hiệu dừng, thông báo cho thành phần liên quan và đợi công việc kết thúc. Ngừng nhận việc mới trước khi đợi hàng đợi hoặc request đang chạy.", "Đặt deadline cho quá trình dừng và quyết định rõ tác vụ nào phải hoàn tất, tác vụ nào có thể hủy hoặc lưu để làm lại. Chỉ giữ JoinHandle mà không đợi task không chứng minh đã dừng sạch.", "Đóng hoặc drain tài nguyên theo thứ tự phù hợp, kiểm tra trạng thái dữ liệu, và có test hoặc kịch bản dừng khi đang có tải."],
    followUp: "Nếu một background task không nhận tín hiệu dừng hoặc đang blocking vô hạn thì kế hoạch timeout của bạn là gì?",
    pitfall: "Gọi exit ngay khi nhận tín hiệu và cho rằng Drop sẽ hoàn thành mọi thao tác async cần thiết.",
    source: { label: "Tokio: graceful shutdown", url: "https://tokio.rs/tokio/topics/shutdown" },
  },
  {
    id: "test-levels", category: "Kiểm thử & chất lượng",
    question: "Unit test, integration test và doc-test nên kiểm tra phần nào?",
    answer: ["Unit test kiểm tra logic nhỏ và các invariant gần nơi triển khai. Integration test dùng API công khai như một bên tiêu thụ để kiểm tra các phần hoạt động cùng nhau.", "Doc-test giữ ví dụ trong tài liệu đồng bộ với API và có thể mô tả trường hợp không được biên dịch khi dùng compile_fail đúng chỗ.", "Chọn test theo rủi ro hành vi: biên số, dữ liệu hỏng, lỗi I/O và cạnh tranh tài nguyên. Số test hoặc coverage cao không tự chứng minh yêu cầu quan trọng đã được kiểm tra."],
    followUp: "Bài trên web chạy assert trong main. Khi chuyển sang Cargo, bạn phải làm gì để cargo test thực sự chạy chúng?",
    pitfall: "Chỉ chạy cargo run rồi báo toàn bộ #[test] đã đạt hoặc sửa expected output để che lỗi.",
    source: { label: "Rust Book: tổ chức kiểm thử", url: "https://doc.rust-lang.org/book/ch11-03-test-organization.html" },
  },
  {
    id: "test-isolation", category: "Kiểm thử & chất lượng",
    question: "Test dùng tệp và DB bị lỗi khi chạy song song. Bạn điều tra thế nào?",
    answer: ["Tìm tài nguyên dùng chung: tên tệp cố định, cùng DB, biến môi trường hoặc cổng hardcode. Một test không nên giả định test khác đã chạy trước.", "Dùng thư mục/DB riêng cho mỗi ca, dữ liệu khởi tạo rõ ràng và cleanup theo lifetime. Với DB in-memory, phải hiểu thời gian sống kết nối và cách pool chia sẻ DB.", "Tái hiện với số thread khác nhau giúp khoanh vùng, nhưng ép tất cả test chạy tuần tự chỉ là lựa chọn có chủ ý khi thực sự có ràng buộc chung, không thay cho sửa thiết kế test."],
    followUp: "Bạn kiểm tra lỗi quyền truy cập hoặc DB không khả dụng thế nào mà không thay đổi tệp và dịch vụ của người dùng?",
    pitfall: "Ghi đè một tệp tên cố định ngoài thư mục test hoặc phụ thuộc thời gian sleep để chờ trạng thái.",
    source: { label: "Rust Book: chạy kiểm thử", url: "https://doc.rust-lang.org/book/ch11-02-running-tests.html" },
  },
  {
    id: "properties", category: "Kiểm thử & chất lượng",
    question: "Một parser đã qua 5 ví dụ. Bạn sẽ tìm thêm lỗi bằng cách nào?",
    answer: ["Chia đầu vào thành lớp: rỗng, thiếu trường, sai kiểu, giá trị biên, dữ liệu rất dài, Unicode và khóa trùng. Kiểm tra lỗi có vị trí hoặc ngữ cảnh đủ để sửa.", "Nêu property phù hợp, chẳng hạn parse(format(x)) bảo toàn dữ liệu hợp lệ, hoặc đầu vào bất kỳ không làm parser panic. Property phải khớp đặc tả; chuẩn hóa có thể khiến round-trip chuỗi gốc không đúng.", "Có thể dùng property-based testing hoặc fuzzing sau khi có oracle và giới hạn tài nguyên. Lưu đầu vào gây lỗi thành regression test nhỏ."],
    followUp: "Nếu serializer chuẩn hóa khoảng trắng và thứ tự khóa, bạn so sánh cấu trúc hay so sánh chuỗi trong round-trip test?",
    pitfall: "Kết luận parser xử lý đầu vào không tin cậy chỉ vì vài ví dụ hợp lệ đã chạy đúng.",
    source: { label: "Rust Fuzz Book", url: "https://rust-fuzz.github.io/book/" },
  },
  {
    id: "measure-first", category: "Kiểm thử & chất lượng",
    question: "Bạn đánh giá một thay đổi giảm clone có cải thiện hiệu năng thật không?",
    answer: ["Giữ cùng hành vi, dữ liệu và điều kiện đo; chạy bản tối ưu phù hợp, tách chi phí khởi động nếu không thuộc câu hỏi, và lặp lại để thấy biến thiên.", "Đo thứ liên quan đến người dùng: độ trễ, throughput, tỷ lệ lỗi, bộ nhớ hoặc số cấp phát. Giảm một clone ngoài đường nóng có thể không ảnh hưởng kết quả.", "Kiểm tra compiler không loại bỏ công việc đo; black_box có thể giúp ở mức tốt nhất nhưng không thay phương pháp benchmark. Ghi cả phiên bản, cấu hình và giới hạn kết luận."],
    followUp: "Nếu trung bình nhanh hơn nhưng p99 tăng mạnh, bạn có giữ thay đổi cho API tương tác không? Vì sao?",
    pitfall: "So một lần debug với một lần release rồi quy toàn bộ chênh lệch cho thuật toán.",
    source: { label: "Thư viện chuẩn: black_box", url: "https://doc.rust-lang.org/std/hint/fn.black_box.html" },
  },
  {
    id: "unsafe-review", category: "Kiểm thử & chất lượng",
    question: "Bạn review một khối unsafe dựa trên điều gì? Test chạy qua có đủ không?",
    answer: ["Xác định điều kiện an toàn mà operation yêu cầu: con trỏ hợp lệ, alignment, initialized value, aliasing và thời gian sống. Viết lý do cụ thể tại nơi dùng unsafe.", "Ranh giới safe wrapper phải ngăn mọi caller safe phá invariant. unsafe không tắt mọi kiểm tra khác của Rust và không biến hành vi không xác định thành một lỗi có thể bắt bằng Result.", "Dùng test và công cụ như Miri cho những lớp lỗi chúng hỗ trợ, nhưng vẫn cần lập luận. Tránh unsafe nếu một safe API đạt yêu cầu và không có bằng chứng chi phí đáng kể."],
    followUp: "Nếu FFI trả một con trỏ, ai giải phóng nó, dùng allocator nào, và wrapper bảo đảm độ dài hợp lệ bằng cách nào?",
    pitfall: "Viết chú thích 'an toàn vì đã test' hoặc cho rằng không crash đồng nghĩa không có undefined behavior.",
    source: { label: "Rustonomicon: soundness", url: "https://doc.rust-lang.org/nomicon/working-with-unsafe.html" },
  },
  {
    id: "http-boundary", category: "Backend & dự án",
    question: "Từ JSON request đến logic nghiệp vụ, bạn đặt kiểm tra và kiểu dữ liệu ở đâu?",
    answer: ["Deserialize thành DTO không bảo đảm mọi quy tắc nghiệp vụ: chuỗi có thể rỗng, số vượt giới hạn hoặc ID không thuộc người gọi. Chuyển DTO thành kiểu domain qua bước kiểm tra rõ ràng.", "Phân biệt lỗi cú pháp, dữ liệu không hợp lệ, không tìm thấy, xung đột và lỗi nội bộ; quy định HTTP status cùng định dạng lỗi nhất quán theo hợp đồng API.", "Giới hạn body và kích thước trường, xác thực/phân quyền ở ranh giới thích hợp. Trong Axum, tách State dùng chung khỏi dữ liệu từng request; tránh đưa toàn bộ chi tiết hạ tầng vào mọi hàm domain."],
    followUp: "Client gửi trường JSON lạ hoặc thiếu Content-Type. Bạn muốn từ chối hay chấp nhận, và test ghi nhận chính sách đó ra sao?",
    pitfall: "Cho rằng deserialize thành công đồng nghĩa dữ liệu đáng tin hoặc mọi lỗi đều trả 200 với một chuỗi thông báo.",
    source: { label: "Axum: extractors", url: "https://docs.rs/axum/latest/axum/extract/index.html" },
  },
  {
    id: "sql-parameters", category: "Backend & dự án",
    question: "SQLx bind ngăn lỗi gì? Có thể bind tên bảng hoặc hướng sắp xếp không?",
    answer: ["Bind truyền giá trị tách khỏi cú pháp câu SQL, tránh ghép dữ liệu người dùng thành câu lệnh. Dùng đúng placeholder của backend và xử lý lỗi query.", "Tên bảng, cột và từ khóa như ASC/DESC thuộc cấu trúc SQL; không thay bằng bind giá trị. Khi cần thay đổi cấu trúc, ánh xạ lựa chọn sang một tập SQL cố định được cho phép.", "query! có thể kiểm tra theo schema tại build với cấu hình phù hợp; query động không tự có cùng bảo đảm đó. Kiểu đúng cũng không thay thế kiểm tra quyền truy cập dữ liệu."],
    followUp: "Thiết kế endpoint có sort=created_at và sort=title mà không ghép tùy ý chuỗi người dùng vào SQL.",
    pitfall: "Escape thủ công thay parameterization hoặc quảng cáo mọi query SQLx đều được kiểm tra schema lúc biên dịch.",
    source: { label: "SQLx: query và tham số", url: "https://docs.rs/sqlx/latest/sqlx/fn.query.html" },
  },
  {
    id: "transactions", category: "Backend & dự án",
    question: "Hai thao tác DB phải thành công cùng nhau. Transaction đã đủ để chống mọi race chưa?",
    answer: ["Gom thao tác vào transaction và chỉ commit khi invariant còn đúng; nếu lỗi thì rollback. Với SQLx, một transaction chưa kết thúc sẽ được rollback khi bị drop theo contract của thư viện.", "Kết quả đồng thời còn phụ thuộc isolation, cách lấy khóa và ràng buộc của DB. Đọc rồi ghi trong transaction không tự giải quyết mọi lost update hay write skew.", "Ưu tiên ràng buộc UNIQUE/CHECK/FK và câu UPDATE có điều kiện khi phù hợp; xử lý xung đột dự kiến. Với retry, cân nhắc idempotency và tránh lặp side effect bên ngoài DB."],
    followUp: "Hai client cùng đặt một chỗ còn trống. Câu SQL và constraint nào quyết định chỉ một yêu cầu thành công?",
    pitfall: "Giữ transaction mở khi chờ HTTP bên ngoài hoặc kết luận có transaction thì không thể trùng dữ liệu.",
    source: { label: "SQLx: Transaction", url: "https://docs.rs/sqlx/latest/sqlx/struct.Transaction.html" },
  },
  {
    id: "service-security", category: "Backend & dự án",
    question: "Một API chạy được trên localhost còn thiếu gì trước khi cho người khác sử dụng?",
    answer: ["Xác định ai được làm gì và kiểm tra quyền trên từng tài nguyên; có đăng nhập chưa đồng nghĩa người đó được xem mọi bản ghi. Dùng thư viện và giao thức đã được xem xét thay vì tự nghĩ cơ chế mật mã.", "Cấu hình secret bên ngoài source, giới hạn request/tải, timeout, chính sách CORS phù hợp, TLS tại lớp triển khai và thông báo lỗi không lộ nội bộ. Các mục này cần cấu hình và kiểm thử theo môi trường cụ thể.", "Có health/readiness, log có cấu trúc không chứa token hay dữ liệu nhạy cảm, migration/backup/restore, shutdown và cách rollback."],
    followUp: "Một user đổi ID trong URL để đọc task của người khác. Kiểm tra phân quyền nằm ở đâu và bạn viết integration test thế nào?",
    pitfall: "Đồng nhất an toàn bộ nhớ của Rust với bảo mật ứng dụng hoặc coi chạy được container là đã vận hành an toàn.",
    source: { label: "Axum: middleware", url: "https://docs.rs/axum/latest/axum/middleware/index.html" },
  },
  {
    id: "project-defense", category: "Backend & dự án",
    question: "Khi trình bày dự án, bạn chứng minh đóng góp và quyết định kỹ thuật như thế nào?",
    answer: ["Bắt đầu từ yêu cầu và ràng buộc, chọn một luồng đi từ đầu vào tới lưu trữ/đầu ra, rồi chỉ ra nơi kiểm tra dữ liệu, quyền sở hữu, lỗi và khả năng phục hồi.", "Đưa bằng chứng chạy lại được: commit, README, test cho một lỗi từng gặp, dữ liệu benchmark và cách tái hiện. Giải thích phương án đã loại cùng lý do phù hợp bối cảnh.", "Nêu phần tự làm, phần dùng thư viện hoặc mã khởi đầu và phần chưa giải quyết. Nếu cần thay đổi yêu cầu, hãy mô tả cách mở rộng và những test cần giữ."],
    followUp: "Nếu lưu lượng tăng gấp 10 hoặc phải đổi SQLite sang PostgreSQL, phần nào chắc chắn cần xem lại và phần nào có thể giữ?",
    pitfall: "Chỉ đọc danh sách công nghệ, không giải thích được lỗi, dữ liệu và đánh đổi của chính dự án.",
    source: { label: "Rust API Guidelines", url: "https://rust-lang.github.io/api-guidelines/" },
  },
];

export const careerProjects: CareerProject[] = [
  {
    id: "cli", title: "CLI xử lý tệp và lập báo cáo",
    description: "Nâng bài tìm kiếm văn bản thành chương trình nhận tham số thật, đọc tệp lớn theo luồng và xuất báo cáo có thể dùng trong shell.",
    prerequisites: "Chương 1–10, 13–14 và 19; dùng Cargo, Result, iterator và BufRead.",
    files: ["src/main.rs — tham số và mã thoát", "src/lib.rs — API công khai", "src/config.rs — kiểm tra cấu hình", "src/search.rs — xử lý dữ liệu", "tests/cli.rs — kiểm thử tiến trình", "tests/fixtures/ — dữ liệu nhỏ có chủ đích"],
    milestones: [
      { title: "Hành vi và lỗi", tasks: ["Định nghĩa --help, chế độ phân biệt hoa/thường, đầu ra JSON hoặc text; quy định stderr và exit code.", "Đọc từ tệp hoặc stdin, xử lý tệp không tồn tại, UTF-8 lỗi và dòng vượt giới hạn đã công bố. Không nạp cả tệp nếu mục tiêu là streaming."] },
      { title: "Tách logic và kiểm thử", tasks: ["Cho phần xử lý nhận impl BufRead và impl Write để dùng dữ liệu trong bộ nhớ khi test.", "Viết integration test chạy binary thật, so stdout, stderr và exit status; mỗi test sở hữu tệp tạm riêng."] },
      { title: "Bàn giao", tasks: ["README có ví dụ pipe, định dạng đầu ra và giới hạn Unicode; CI chạy format, Clippy và test từ clone sạch.", "Đo release trên dữ liệu được tạo lại được; ghi cấu hình, kích thước đầu vào và bộ nhớ sử dụng. Giải thích một tối ưu có số liệu."] },
    ],
    acceptance: ["Lệnh --help và ba ví dụ README chạy đúng; kết quả không lẫn log vào stdout.", "Dữ liệu sai trả lỗi có ngữ cảnh, không panic; không làm thay đổi tệp đầu vào.", "Đầu ra xác định với cùng đầu vào; tên tệp có khoảng trắng và chữ tiếng Việt hoạt động.", "Một người khác clone và chạy test mà không cần dữ liệu hay đường dẫn trên máy tác giả."],
    tests: ["Tệp rỗng, không có kết quả, dòng cuối thiếu newline, nhiều dòng trùng.", "Unicode ghép dấu, emoji, CRLF, dữ liệu không hợp lệ theo chính sách đã ghi.", "Không tìm thấy tệp, lỗi ghi đầu ra và tệp đủ lớn để phát hiện việc nạp toàn bộ không cần thiết."],
    review: ["Chính sách bỏ qua hay dừng ở dòng lỗi đã được quyết định chưa?", "Clone và cấp phát có mục đích rõ không?", "Test có kiểm tra hợp đồng CLI thay vì chỉ gọi helper?", "Có giới hạn tài nguyên và cleanup cho tài nguyên test không?"],
    sources: [{ label: "Rust Book: dự án CLI", url: "https://doc.rust-lang.org/book/ch12-00-an-io-project.html" }, { label: "BufRead", url: "https://doc.rust-lang.org/std/io/trait.BufRead.html" }],
  },
  {
    id: "api", title: "Task API với Axum, Tokio và SQLx",
    description: "Xây dịch vụ quản lý công việc có HTTP, lưu trữ dữ liệu, migration và kiểm thử qua router.",
    prerequisites: "Chương 7–9, 13, 15–16 và kiến thức cơ bản HTTP/SQL.",
    starter: "https://github.com/tuanworlddev/learn-rust/tree/main/labs/task-api",
    files: ["Cargo.toml / Cargo.lock — phụ thuộc có phiên bản", "src/main.rs — cấu hình, listener và shutdown", "src/lib.rs — app/router có thể kiểm thử", "src/tasks.rs — DTO, validation và handler", "src/database.rs / src/error.rs — DB và lỗi", "migrations/ — schema có phiên bản", "tests/ — hành vi API và dữ liệu"],
    milestones: [
      { title: "Chạy và hiểu lab", tasks: ["Làm theo labs/task-api/README.md; tạo, đọc, cập nhật, xóa task và kiểm tra dữ liệu còn sau khi khởi động lại.", "Đọc luồng request qua DTO, validation, query có bind và response; giải thích đâu là lỗi client, đâu là lỗi hạ tầng."] },
      { title: "Tự mở rộng nghiệp vụ", tasks: ["Thêm deadline và bộ lọc cho danh sách; giữ phân trang có giới hạn và thứ tự ổn định đã có trong lab. Tạo migration mới thay vì sửa tay DB.", "Đọc transaction ghi task cùng event có sẵn, rồi bổ sung optimistic concurrency hoặc idempotency key. Tạo lỗi/xung đột để kiểm tra rollback và không thực hiện trùng side effect."] },
      { title: "Thực hành trước khi triển khai", tasks: ["Bổ sung xác thực/phân quyền theo tài nguyên và test user A không đọc/sửa task của user B.", "Kiểm tra quá tải, timeout, log không lộ bí mật, shutdown và backup/restore. Thử deploy ở môi trường học tập sau khi hiểu cấu hình bind, TLS và secret."] },
    ],
    acceptance: ["CRUD trả status và JSON theo hợp đồng được ghi; dữ liệu tồn tại sau restart.", "Request rỗng, quá dài hoặc sai kiểu bị từ chối; SQL dùng bind cho giá trị đầu vào.", "Test dùng DB riêng, có ca rollback và hai thao tác cạnh tranh; không phụ thuộc DB cá nhân.", "Có migration, README, kiểm tra CI và cách vận hành/rollback được thử ở môi trường học tập.", "Nếu bật nhiều người dùng, kiểm tra quyền của từng tài nguyên; ghi rõ những phần chưa triển khai."],
    tests: ["CRUD, không tìm thấy, JSON hỏng, Unicode, giới hạn title/body và phân trang.", "Chuỗi chứa dấu nháy và SQL như dữ liệu; lỗi DB trả phản hồi ổn định không lộ câu SQL hoặc đường dẫn.", "Restart giữ dữ liệu; transaction rollback; xung đột cập nhật và retry theo chính sách đã nêu.", "Phân quyền chéo người dùng, dừng khi có request đang chạy và kiểm tra tính toàn vẹn sau phục hồi."],
    review: ["HTTP handler có tách khỏi domain logic đủ để test không?", "Pool được chia sẻ đúng cách, transaction và khóa có bị giữ qua I/O ngoài DB không?", "Các quy tắc uniqueness và toàn vẹn nằm ở cả vị trí cần thiết trong DB không?", "Timeout và retry có thể lặp side effect không?", "Tác giả có phân biệt bản lab local với dịch vụ đủ điều kiện công khai không?"],
    sources: [{ label: "Axum", url: "https://docs.rs/axum/latest/axum/" }, { label: "SQLx", url: "https://docs.rs/sqlx/latest/sqlx/" }, { label: "Tokio", url: "https://tokio.rs/tokio/tutorial" }],
  },
  {
    id: "library", title: "Thư viện domain và ứng dụng tích hợp",
    description: "Tạo workspace có một thư viện phân tích dữ liệu đơn hàng và một CLI sử dụng thư viện. Luyện API công khai, lỗi có kiểu, tài liệu và thay đổi tương thích.",
    prerequisites: "Chương 7–10, 12–13 và 17–19; biết trait, generic, ownership, doc-test và workspace.",
    files: ["Cargo.toml — workspace", "crates/order-core/src/lib.rs — API", "crates/order-core/src/model.rs — newtype và invariant", "crates/order-core/src/error.rs — lỗi có kiểu", "crates/order-core/tests/ — contract tests", "crates/order-cli/src/main.rs — consumer", "examples/ — ví dụ sử dụng"],
    milestones: [
      { title: "API và invariant", tasks: ["Đặc tả số tiền nguyên theo đơn vị tiền tệ đã chọn, không âm và cộng/trừ có kiểm tra; không giả định mọi tiền tệ đều có cùng số chữ số thập phân.", "Thiết kế parse/validate/aggregate độc lập I/O; constructor bảo vệ invariant, accessor chỉ mở dữ liệu cần thiết."] },
      { title: "Người dùng thư viện", tasks: ["CLI chỉ sử dụng API public, chuyển lỗi thành thông báo và mã thoát; không truy cập chi tiết nội bộ.", "Thêm doc-test cho API chính và ví dụ lỗi; thử dữ liệu biên, overflow, ID trùng và serialization round-trip theo chính sách chuẩn hóa."] },
      { title: "Phát hành thử và tương thích", tasks: ["Định nghĩa phiên bản hỗ trợ, feature và MSRV nếu có cam kết; kiểm tra mỗi cấu hình thực sự hỗ trợ.", "Mô phỏng thay đổi yêu cầu, ghi hướng chuyển đổi và changelog; review một breaking change trước khi công bố bản mới."] },
    ],
    acceptance: ["Consumer trong crate khác dùng được API mà không cần field nội bộ.", "Lỗi giữ cấu trúc đủ để bên gọi phân nhánh; dữ liệu bên ngoài không dẫn tới panic thông thường.", "cargo test --workspace và doc-test đạt; tài liệu giải thích ownership, sai số/overflow và giới hạn đầu vào.", "Bản thay đổi API có giải thích ảnh hưởng đến caller và hướng nâng cấp."],
    tests: ["Đơn hàng rỗng, số lượng 0, giá trị biên và phép cộng overflow.", "Dữ liệu sai kiểu, ID trùng, thứ tự khác nhau và Unicode trong tên.", "Round-trip dữ liệu hợp lệ, compile-fail ví dụ invariant phù hợp và consumer độc lập."],
    review: ["Public API có quá lớn hoặc vô tình lộ kiểu hạ tầng không?", "Trait/generic có giải quyết nhu cầu thực tế hay chỉ làm API khó dùng?", "Lỗi và panic policy được tài liệu hóa chưa?", "Chính sách tương thích có xét enum, feature và hành vi quan sát được không?"],
    sources: [{ label: "Cargo: workspace", url: "https://doc.rust-lang.org/cargo/reference/workspaces.html" }, { label: "API Guidelines", url: "https://rust-lang.github.io/api-guidelines/" }, { label: "Rustdoc: doc-test", url: "https://doc.rust-lang.org/rustdoc/write-documentation/documentation-tests.html" }],
  },
];

export const readinessGates: ReadinessGate[] = [
  { id: "core", title: "Giải thích ownership và thiết kế kiểu", criteria: ["Tự sửa và giải thích một lỗi move, một lỗi borrow và một lỗi lifetime bằng ví dụ nhỏ.", "Bảo vệ lựa chọn tham số mượn/sở hữu và enum/newtype trong mã của mình; không chỉ đọc lại định nghĩa."], example: "Commit sửa borrow trong CLI, đoạn test tái hiện, và giải thích tại sao dùng &str thay vì clone String." },
  { id: "errors", title: "Xử lý dữ liệu sai và lỗi có chủ đích", criteria: ["Có lỗi có kiểu và chính sách Result/panic rõ ràng tại ranh giới I/O, parse và nghiệp vụ.", "Có test đầu vào rỗng, Unicode, quá giới hạn, overflow và lỗi hạ tầng phù hợp dự án."], example: "Link test dữ liệu CSV hỏng; kết quả trả số dòng và mã lỗi, chương trình không panic." },
  { id: "cargo", title: "Bàn giao được dự án Cargo", criteria: ["Dự án nhiều tệp có README đủ để chạy từ clone sạch, Cargo.lock phù hợp và cấu hình không chứa secret.", "Format, Clippy, unit test, integration test và doc-test được chạy qua CI; có giải thích cho cấu hình không áp dụng."], example: "Link workflow CI và commit; lệnh tái hiện từ clone sạch cùng kết quả test." },
  { id: "async", title: "Giải thích và kiểm tra đồng thời", criteria: ["Biết dữ liệu nào được giữ qua await, vì sao task cần Send/'static, và không giữ blocking lock tùy tiện qua await.", "Có ca kiểm tra timeout, hủy, hàng đợi đầy hoặc quá nhiều task; giải thích tác động lên dữ liệu và side effect."], example: "Kịch bản bounded queue 100 phần tử; log cho thấy backpressure và test dừng task không mất công việc đã cam kết." },
  { id: "backend", title: "Hoàn thành một luồng HTTP và DB", criteria: ["Có validation, query bind, migration, status/error contract và lưu dữ liệu sau restart.", "Có test giao dịch, bản ghi không tồn tại, yêu cầu cạnh tranh và phân quyền nếu dự án có nhiều người dùng."], example: "Link API test CRUD/rollback; cách khởi động lại và truy vấn dữ liệu; test user A không sửa task user B." },
  { id: "operations", title: "Biết giới hạn và cách vận hành", criteria: ["Đã thử lỗi DB hoặc I/O, shutdown trong lúc có tải và một quy trình phục hồi/rollback phù hợp.", "Biết chỗ lưu secret, dữ liệu nào không được log, giới hạn request/tài nguyên và những bảo vệ còn thiếu trước khi công khai."], example: "Báo cáo diễn tập DB không khả dụng: lệnh tái hiện, log đã loại dữ liệu nhạy cảm và kết quả phục hồi." },
  { id: "portfolio", title: "Có sản phẩm và review để đối chiếu", criteria: ["Có ít nhất một repository hoàn chỉnh, mô tả đóng góp cá nhân, issue/commit rõ ràng và hướng chạy lại.", "Có một thay đổi được review, phản hồi đã xử lý và một quyết định kỹ thuật nêu phương án khác cùng đánh đổi."], example: "Link PR, phản hồi reviewer, commit sửa và ghi chú quyết định SQLite hay PostgreSQL theo tải thực tế của bài." },
  { id: "interview", title: "Vượt qua một buổi phỏng vấn thử", criteria: ["Tự trả lời câu hỏi mở trước khi xem gợi ý, giải được bài mới có test và phản hồi câu hỏi tiếp theo.", "Nhờ người khác hoặc người hướng dẫn chấm buổi thử; ghi những lỗ hổng còn lại và kế hoạch sửa, không chỉ tự đánh dấu đã đọc."], example: "Ngày phỏng vấn thử, đề mới, repository lời giải và phản hồi cụ thể về ownership, async và thiết kế." },
];
