import type { SpecializationBundle } from "../specialization-types";

export const backendBundle: SpecializationBundle = {
  track: {
    id: "backend",
    title: "Backend và dịch vụ mạng",
    shortTitle: "Backend",
    description: "Thiết kế API, dữ liệu, phân quyền và giao tiếp giữa các dịch vụ với Tokio, Axum, SQLx và tonic.",
    outcome: "Xây API có giao dịch dữ liệu, cách ly người dùng, giới hạn tải, kiểm thử và quy trình vận hành có thể giải thích trong phỏng vấn.",
    prerequisites: ["Ownership, borrowing và lifetime", "Result, trait và generic", "Arc, Mutex, Send và Sync", "Async/await, Future và kiểm thử Rust", "HTTP và SQL cơ bản"],
    technologies: ["Tokio", "Axum", "SQLx", "tonic", "WebSocket", "PostgreSQL"],
    color: "blue",
    lessonIds: ["backend-runtime", "backend-http", "backend-transactions", "backend-authorization", "backend-streaming", "backend-production"],
    capstone: {
      title: "Dịch vụ quản lý công việc cho nhiều nhóm",
      description: "Xây một API có tài khoản, workspace, công việc, lịch sử thay đổi và thông báo. Mỗi quyết định thiết kế phải đi kèm kiểm thử hoặc số đo chứng minh hành vi.",
      milestones: [
        { title: "Hợp đồng và mô hình nghiệp vụ", tasks: ["Viết hợp đồng HTTP cho tạo, xem, sửa và phân trang công việc; mô tả lỗi và tính lặp lại an toàn của từng thao tác.", "Tách DTO HTTP khỏi kiểu nghiệp vụ; ghi bất biến: tiêu đề hợp lệ, owner thuộc workspace, phiên bản tăng khi cập nhật."], acceptance: "Có ví dụ request/response và kiểm thử đơn vị cho đầu vào rỗng, quá dài, trạng thái chuyển không hợp lệ." },
        { title: "Dữ liệu và cạnh tranh", tasks: ["Dùng PostgreSQL với migration có khóa ngoại, chỉ mục theo workspace và ràng buộc duy nhất.", "Tạo công việc và sự kiện outbox trong cùng transaction; dùng version trong điều kiện UPDATE để phát hiện chỉnh sửa đồng thời."], acceptance: "Hai yêu cầu sửa cùng version chỉ một yêu cầu thành công; lỗi giữa transaction không để lại sự kiện hoặc bản ghi dở dang." },
        { title: "Danh tính và quyền truy cập", tasks: ["Tích hợp nhà cung cấp danh tính hoặc thư viện xác minh token đã được duy trì; kiểm tra issuer, audience và hạn dùng.", "Áp dụng chính sách owner/member/admin trong cùng workspace ở mọi truy vấn và thao tác."], acceptance: "Ma trận kiểm thử có người lạ, thành viên khác workspace, owner, admin cùng workspace và token không hợp lệ; không lộ dữ liệu xuyên nhóm." },
        { title: "Thông báo và giao tiếp dịch vụ", tasks: ["Thêm WebSocket với hàng đợi giới hạn, event ID và cơ chế đồng bộ lại khi mất kết nối.", "Định nghĩa một RPC đọc trạng thái công việc bằng protobuf; đặt deadline và ánh xạ lỗi nhất quán."], acceptance: "Máy khách chậm không khiến bộ nhớ tăng vô hạn; kết nối lại nhận snapshot mới hoặc phát lại từ cursor; deadline hết không làm công việc nền chạy vô hạn." },
        { title: "Kiểm thử và vận hành", tasks: ["Chạy integration test với cơ sở dữ liệu tách biệt, kiểm thử HTTP và giả lập lỗi phụ thuộc.", "Đo latency p50/p95, tỷ lệ lỗi, độ dài hàng đợi và thời gian chờ pool; ghi cấu hình tải dùng để đo.", "Tạo image không chạy quyền root, readiness/liveness, graceful shutdown và hướng dẫn migration/rollback."], acceptance: "Một người khác clone dự án, chạy test và khởi động được theo README; khi dừng tiến trình các yêu cầu đang xử lý được hoàn tất hoặc báo lỗi trong thời hạn đã công bố." },
      ],
      deliverables: ["Mã nguồn Cargo workspace và Cargo.lock", "Migration, dữ liệu mẫu và hợp đồng API", "Bộ kiểm thử phân quyền, giao dịch, cạnh tranh và HTTP", "Báo cáo tải có cấu hình máy, lệnh chạy và số đo", "README triển khai, chẩn đoán lỗi và rollback"],
      reviewQuestions: ["Tại sao timeout ở HTTP không bảo đảm câu lệnh SQL chưa commit?", "Bạn đặt kiểm tra workspace ở đâu để endpoint mới không vô tình bỏ qua?", "Giới hạn concurrency, rate limit và giới hạn hàng đợi khác nhau thế nào?", "Khi WebSocket mất một sự kiện, client phục hồi trạng thái bằng cách nào?", "Nếu thêm một trường protobuf, bạn bảo vệ client cũ ra sao?"],
    },
    resources: [
      { label: "Tokio: tutorial", url: "https://tokio.rs/tokio/tutorial" },
      { label: "Axum: routing và extractors", url: "https://docs.rs/axum/0.8.9/axum/" },
      { label: "SQLx: transaction", url: "https://docs.rs/sqlx/0.8.6/sqlx/struct.Transaction.html" },
      { label: "tonic: gRPC cho Rust", url: "https://docs.rs/tonic/0.14.9/tonic/" },
      { label: "OWASP: authorization", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" },
      { label: "Tokio: graceful shutdown", url: "https://tokio.rs/tokio/topics/shutdown" },
    ],
  },
  lessons: [
    {
      id: "backend-runtime", illustration: { src: "/images/lessons/backend-service.webp", alt: "Minh họa máy khách gửi yêu cầu đến dịch vụ và kho dữ liệu", caption: "Một yêu cầu đi qua nhiều thành phần: mỗi bước cần có giới hạn tài nguyên và thời gian." }, moduleId: "track-backend", title: "Tokio: vòng đời yêu cầu và giới hạn tải", duration: 45,
      description: "Hiểu tác vụ bất đồng bộ, điểm chờ, hủy tác vụ và backpressure trước khi viết HTTP server.",
      objectives: ["Phân biệt concurrency với xử lý CPU song song", "Giải thích Send và 'static khi spawn task", "Thiết kế hàng đợi có giới hạn và chính sách khi quá tải", "Nhận ra thao tác không an toàn khi bị hủy giữa chừng"],
      sections: [
        { title: "Một yêu cầu sống qua nhiều lần chờ", text: "Một yêu cầu thường đi qua đọc socket, xác thực, lấy kết nối cơ sở dữ liệu, truy vấn rồi ghi phản hồi. Phần lớn thời gian có thể là chờ I/O. Future lưu trạng thái để runtime tiếp tục công việc khi tài nguyên sẵn sàng; async không biến một phép tính nặng thành phép tính nhanh hơn. Khi một lần poll chiếm CPU quá lâu, những tác vụ khác trên worker đó cũng chậm theo.\n\nHãy phân loại đoạn mã trước khi tối ưu: gọi HTTP và socket dùng API bất đồng bộ; tác vụ blocking ngắn có thể dùng spawn_blocking; tính toán CPU cần giới hạn song song phù hợp. spawn_blocking đã bắt đầu không thể bị abort như một future thông thường. Bọc một hàm đồng bộ bằng async fn vẫn giữ nguyên tính blocking của hàm ấy." },
        { title: "Task phải sở hữu dữ liệu cần giữ", text: "Một task được spawn có thể sống lâu hơn hàm tạo nó. Ràng buộc 'static không có nghĩa dữ liệu phải tồn tại vĩnh viễn: future không được giữ tham chiếu mượn từ stack ngắn hơn vòng đời task. async move chuyển quyền sở hữu vào task; Arc cho phép nhiều task chia sẻ dữ liệu mà không nhân bản toàn bộ dữ liệu bên trong.\n\nTokio có thể chuyển task giữa worker thread nên giá trị còn được giữ qua điểm await phải đáp ứng Send khi dùng tokio::spawn. Đọc lỗi bằng cách xác định chính xác biến nào còn sống qua await. Rút ngắn phạm vi lock thường rõ ràng hơn đổi mọi thứ sang async Mutex. Giữ lock trong lúc gọi dịch vụ mạng khiến các yêu cầu độc lập phải xếp hàng sau một phụ thuộc chậm.", code: "// Ví dụ cho một dự án Cargo đã có Tokio.\nlet user_id = String::from(\"user-42\");\nlet handle = tokio::spawn(async move {\n    tokio::task::yield_now().await;\n    user_id.len()\n});\nlet length = handle.await?;" },
        { title: "Giới hạn công việc đang chờ", text: "Tăng số task không tăng năng lực vô hạn. Mỗi yêu cầu đang chờ vẫn giữ bộ nhớ, kết nối hoặc dữ liệu phản hồi. Chọn giới hạn cho số tác vụ đang chạy và số mục được phép đợi; hai giới hạn phục vụ hai mục đích khác nhau. Bounded channel tạo backpressure: bên gửi phải chờ chỗ trống hoặc nhận lỗi khi dùng try_send.\n\nTrong API tương tác, có thể từ chối sớm khi hàng đợi đầy và trả lỗi tạm thời theo hợp đồng. Trong worker, có thể đợi nhưng phải tôn trọng deadline. Đừng xử lý quá tải bằng cách thêm một hàng đợi không giới hạn khác. Bài tập mô hình hóa quyết định nhận việc: nhận tối đa capacity mục, giữ thứ tự và không làm mất mục cũ." },
        { title: "Hủy future không hoàn tác thế giới bên ngoài", text: "select! bỏ các nhánh chưa thắng khi kết thúc. Future bị drop ngừng tiến triển, nhưng một email đã gửi hoặc transaction đã commit vẫn tồn tại. Bởi vậy timeout không đồng nghĩa thao tác chưa xảy ra. Tách phần chuẩn bị không có tác dụng phụ khỏi bước commit; dùng idempotency key cho yêu cầu có thể được gửi lại.\n\nKhi review một điểm await, hỏi: nếu future bị hủy tại đây, tài nguyên nào được giải phóng, dữ liệu nào đã đổi, client có thể thử lại không? Kiểm thử shutdown và timeout cần quan sát cả kết quả trả về lẫn trạng thái dữ liệu sau đó. Đây là bước nối async Rust với tính đúng đắn của một dịch vụ thực tế." },
      ],
      tip: "Vẽ vòng đời một yêu cầu, đánh dấu từng await và giới hạn tài nguyên trước khi thêm tokio::spawn.",
      exercise: { title: "Hàng đợi nhận việc có giới hạn", instructions: "Hoàn thiện enqueue để trả lại công việc khi hàng đợi đầy. Dùng hàm thuần để kiểm tra chính sách nhận việc trước khi ghép vào channel bất đồng bộ.", requirements: ["Không thêm mục nếu độ dài đã bằng hoặc vượt capacity.", "Khi từ chối, trả Err(job) và giữ nguyên hàng đợi.", "Khi nhận, thêm ở cuối và trả Ok(()); capacity bằng 0 luôn từ chối."] },
      starterCode: `use std::collections::VecDeque;
fn enqueue(queue: &mut VecDeque<u32>, capacity: usize, job: u32) -> Result<(), u32> {
    // Kiểm tra giới hạn trước khi thay đổi queue.
    todo!()
}
fn main() {
    let mut queue = VecDeque::new();
    assert_eq!(enqueue(&mut queue, 2, 10), Ok(()));
    assert_eq!(enqueue(&mut queue, 2, 20), Ok(()));
    assert_eq!(enqueue(&mut queue, 2, 30), Err(30));
    assert_eq!(queue.into_iter().collect::<Vec<_>>(), vec![10, 20]);
    assert_eq!(enqueue(&mut VecDeque::new(), 0, 99), Err(99));
    println!("Đã nhận 2, từ chối 1");
}`,
      solutionCode: `use std::collections::VecDeque;
fn enqueue(queue: &mut VecDeque<u32>, capacity: usize, job: u32) -> Result<(), u32> {
    if queue.len() >= capacity { return Err(job); }
    queue.push_back(job);
    Ok(())
}
fn main() {
    let mut queue = VecDeque::new();
    assert_eq!(enqueue(&mut queue, 2, 10), Ok(()));
    assert_eq!(enqueue(&mut queue, 2, 20), Ok(()));
    assert_eq!(enqueue(&mut queue, 2, 30), Err(30));
    assert_eq!(queue.into_iter().collect::<Vec<_>>(), vec![10, 20]);
    assert_eq!(enqueue(&mut VecDeque::new(), 0, 99), Err(99));
    println!("Đã nhận 2, từ chối 1");
}`,
      expectedOutput: "Đã nhận 2, từ chối 1", hints: ["Dùng >= thay vì == để xử lý cả trạng thái đã vượt giới hạn.", "Chỉ gọi push_back sau nhánh từ chối."],
      quiz: { question: "HTTP request hết timeout sau khi transaction đã commit. Kết luận nào đúng?", options: ["Rust tự rollback transaction khi future bị drop.", "Client không nhận phản hồi nhưng thay đổi có thể đã tồn tại; thử lại cần chính sách idempotency.", "Mọi task con tự động bị dừng và xóa dữ liệu.", "Thêm async move khiến transaction không commit được."], correct: 1, explanation: "Hủy future dừng tiến trình async, không hoàn tác tác dụng phụ đã hoàn thành bên ngoài. Phải thiết kế cách kiểm tra hoặc thử lại mà không tạo tác dụng phụ trùng." },
      reference: { label: "Tokio: cancellation trong select!", url: "https://tokio.rs/tokio/tutorial/select" },
    },
    {
      id: "backend-http", moduleId: "track-backend", title: "Axum: hợp đồng HTTP và lớp nghiệp vụ", duration: 55,
      description: "Tách request, validation và xử lý nghiệp vụ; viết endpoint Axum với phản hồi có thể kiểm thử.",
      objectives: ["Dùng Router, Path, State và Json đúng vị trí", "Tách lỗi đầu vào khỏi lỗi hệ thống", "Thiết kế DTO không lộ trường nội bộ", "Kiểm thử endpoint mà không phụ thuộc cổng mạng"],
      sections: [
        { title: "Bắt đầu bằng hợp đồng", text: "Trước handler, viết request hợp lệ, response thành công và những trường hợp thất bại. Ví dụ POST /tasks nhận title; thành công trả 201 và biểu diễn công việc. Tiêu đề trắng hoặc vượt giới hạn trả 422 theo hợp đồng của ứng dụng. JSON sai cú pháp là một lỗi khác: extractor có thể từ chối trước khi handler chạy.\n\nMột status code chỉ hữu ích khi client hiểu hành vi đi kèm. Hãy giữ error code ổn định cho máy, còn thông điệp có thể dịch cho người. Không trả nguyên lỗi SQL hoặc stack trace. Với thao tác cập nhật, xác định dùng PUT thay thế tài nguyên hay PATCH sửa một phần; đừng ngầm hiểu trường bị thiếu giống trường có giá trị null." },
        { title: "Extractor mô tả đầu vào của handler", text: "Axum dùng extractor để chuyển từng phần request thành kiểu Rust. Path lấy tham số đường dẫn, Query đọc query string, State lấy trạng thái ứng dụng và Json đọc body. Body chỉ được tiêu thụ một lần; extractor cần body đặt cuối danh sách tham số. Router của Axum 0.8 dùng tham số như /tasks/{id}.\n\nState thường chứa pool hoặc client có thể clone rẻ. Handler nên chuyển DTO sang lệnh nghiệp vụ, gọi hàm xử lý và ánh xạ kết quả thành response. DTO nhận từ client không nên chứa owner_id nếu danh tính đã được xác minh ở middleware: owner phải đến từ principal đáng tin cậy. Tách các kiểu giúp một trường nội bộ mới không vô tình xuất hiện trong JSON.", code: "// Chữ ký minh họa; AppState và CreateTask do ứng dụng định nghĩa.\nasync fn create_task(\n    State(state): State<AppState>,\n    Json(input): Json<CreateTask>,\n) -> Result<(StatusCode, Json<TaskView>), ApiError> {\n    let command = input.validate()?;\n    let task = state.service.create(command).await?;\n    Ok((StatusCode::CREATED, Json(TaskView::from(task))))\n}" },
        { title: "Validation phải có ngữ nghĩa rõ ràng", text: "Độ dài String là byte UTF-8, không phải số ký tự hiển thị. Trong bài này giới hạn là 80 Unicode scalar values sau trim, nên dùng chars().count(). Đây vẫn không phải số grapheme người dùng nhìn thấy; yêu cầu sản phẩm cần chọn đơn vị và mô tả nhất quán. Body limit giới hạn byte để bảo vệ tài nguyên là một kiểm tra riêng.\n\nValidation chỉ làm sạch những gì hợp đồng cho phép. Không lowercase mọi dữ liệu chỉ vì cần tìm kiếm không phân biệt hoa thường. Giữ bản gốc để hiển thị, tạo khóa chuẩn hóa riêng khi cần so sánh. Với số tiền, thời gian và ID, chọn kiểu biểu diễn tránh mất chính xác trước khi ghi dữ liệu." },
        { title: "Kiểm thử từ hàm thuần đến HTTP", text: "Hàm chuẩn hóa title có thể kiểm thử nhanh bằng assert và không cần Tokio. Sau đó kiểm thử Router với Request và ServiceExt::oneshot để xác nhận status, header và body. Thêm trường hợp sai Content-Type, JSON hỏng, body lớn, phương thức không hỗ trợ và route không tồn tại.\n\nLab Cargo cung cấp endpoint kiểm tra tiêu đề; nó không lưu công việc. Khi mở rộng thành API tạo dữ liệu, thêm tầng lưu trữ và kiểm thử tác dụng phụ. Đừng để việc curl nhận 200 là tiêu chí duy nhất: một handler luôn trả thành công vẫn có thể bỏ qua toàn bộ bất biến nghiệp vụ." },
      ],
      tip: "Đưa validation vào hàm thuần để cùng một quy tắc được dùng bởi HTTP, worker và kiểm thử.",
      exercise: { title: "Chuẩn hóa tiêu đề trước khi tạo công việc", instructions: "Trả tiêu đề đã trim nếu có từ 1 đến 80 Unicode scalar values. Trả mã lỗi ổn định cho hai trường hợp không hợp lệ.", requirements: ["Chuỗi chỉ chứa khoảng trắng trả Err(\"empty\").", "Chuỗi sau trim có hơn 80 chars trả Err(\"too_long\").", "Giữ nguyên chữ hoa, dấu tiếng Việt và khoảng trắng bên trong."] },
      starterCode: `fn title(input: &str) -> Result<String, &'static str> {
    todo!()
}
fn main() {
    assert_eq!(title("  Học Rust  "), Ok("Học Rust".into()));
    assert_eq!(title(" \t "), Err("empty"));
    assert!(title(&"á".repeat(80)).is_ok());
    assert_eq!(title(&"á".repeat(81)), Err("too_long"));
    println!("Tiêu đề: {}", title(" Học Rust ").unwrap());
}`,
      solutionCode: `fn title(input: &str) -> Result<String, &'static str> {
    let value = input.trim();
    if value.is_empty() { return Err("empty"); }
    if value.chars().count() > 80 { return Err("too_long"); }
    Ok(value.to_owned())
}
fn main() {
    assert_eq!(title("  Học Rust  "), Ok("Học Rust".into()));
    assert_eq!(title(" \t "), Err("empty"));
    assert!(title(&"á".repeat(80)).is_ok());
    assert_eq!(title(&"á".repeat(81)), Err("too_long"));
    println!("Tiêu đề: {}", title(" Học Rust ").unwrap());
}`,
      expectedOutput: "Tiêu đề: Học Rust", hints: ["input.trim() trả về &str; chỉ tạo String khi đầu vào hợp lệ.", "String::len đếm byte; bài này yêu cầu chars().count()."],
      quiz: { question: "Vì sao Json thường phải là tham số extractor cuối của handler Axum?", options: ["Vì Json luôn chạy trên thread riêng.", "Vì Json cần body và body chỉ được tiêu thụ một lần.", "Vì Rust bắt buộc kiểu generic đứng cuối.", "Vì State không thể clone."], correct: 1, explanation: "Extractor đọc body như Json triển khai FromRequest và phải ở cuối; các extractor đọc phần đầu request có thể đứng trước." },
      reference: { label: "Axum: extractors và body limit", url: "https://docs.rs/axum/0.8.9/axum/extract/index.html" },
      localLab: {
        title: "Endpoint kiểm tra tiêu đề bằng Axum",
        instructions: "Tạo thư mục mới với các tệp bên dưới. Endpoint /titles/validate chỉ kiểm tra đầu vào; dùng terminal thứ hai để gửi request khi server đang chạy.",
        files: [
          { path: "Cargo.toml", content: `[package]
name = "title-api"
version = "0.1.0"
edition = "2024"
[dependencies]
axum = "=0.8.9"
tokio = { version = "1", features = ["macros", "rt-multi-thread", "net", "signal"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
[dev-dependencies]
tower = { version = "0.5", features = ["util"] }
` },
          { path: "src/main.rs", content: `use axum::{extract::DefaultBodyLimit, http::StatusCode, routing::post, Json, Router};
use serde::{Deserialize, Serialize};
#[derive(Deserialize)]
struct Input { title: String }
#[derive(Serialize)]
struct Output { title: String }
fn validate(input: &str) -> Result<String, &'static str> {
    let title = input.trim();
    if title.is_empty() { return Err("empty"); }
    if title.chars().count() > 80 { return Err("too_long"); }
    Ok(title.to_owned())
}
async fn check_title(Json(input): Json<Input>) -> Result<Json<Output>, (StatusCode, Json<serde_json::Value>)> {
    validate(&input.title).map(|title| Json(Output { title }))
        .map_err(|code| (StatusCode::UNPROCESSABLE_ENTITY, Json(serde_json::json!({"code": code}))))
}
fn app() -> Router {
    Router::new().route("/titles/validate", post(check_title))
        .layer(DefaultBodyLimit::max(4096))
}
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3001").await?;
    axum::serve(listener, app()).with_graceful_shutdown(async {
        let _ = tokio::signal::ctrl_c().await;
    }).await?;
    Ok(())
}
#[cfg(test)]
mod tests {
    use super::*;
    use axum::{body::Body, http::Request};
    use tower::ServiceExt;
    #[tokio::test]
    async fn validates_over_http() {
        for (body, status) in [(r#"{"title":" Rust "}"#, 200), (r#"{"title":" "}"#, 422)] {
            let request = Request::post("/titles/validate").header("content-type", "application/json")
                .body(Body::from(body)).unwrap();
            assert_eq!(app().oneshot(request).await.unwrap().status().as_u16(), status);
        }
    }
}
` },
        ],
        commands: ["cargo test", "cargo run", "curl -i http://127.0.0.1:3001/titles/validate -H 'Content-Type: application/json' -d '{\"title\":\" Học Rust \"}'"],
        checks: ["Request hợp lệ nhận 200 và title đã trim; title trắng nhận 422.", "Bổ sung kiểm thử body JSON hỏng, tiêu đề dài và body trên 4096 byte.", "Nhấn Ctrl+C và xác nhận server dừng có kiểm soát."],
      },
    },
    {
      id: "backend-transactions", moduleId: "track-backend", title: "SQLx: giao dịch và cập nhật đồng thời", duration: 60,
      description: "Giữ bất biến dữ liệu khi nhiều yêu cầu cùng ghi; dùng transaction, bind và điều kiện UPDATE.",
      objectives: ["Dùng pool và transaction đúng vòng đời", "Tránh read-then-write thiếu điều kiện cạnh tranh", "Thiết kế idempotency và optimistic concurrency", "Kiểm thử rollback và dữ liệu không đổi khi thất bại"],
      sections: [
        { title: "Pool là tài nguyên hữu hạn", text: "Một pool tái sử dụng kết nối; nó không làm cơ sở dữ liệu xử lý vô hạn truy vấn. Mỗi transaction giữ một kết nối cho tới commit hoặc rollback. Nếu handler giữ transaction trong khi gọi HTTP bên ngoài, thời gian chờ mạng cũng chiếm chỗ trong pool. Bắt đầu transaction gần các câu SQL cần nhất quán và kết thúc sớm.\n\nChọn giới hạn pool dựa trên ngân sách kết nối toàn hệ thống: số replica nhân max_connections của từng replica phải nằm trong khả năng database. Đo thời gian chờ lấy kết nối riêng với thời gian truy vấn. Khi queue đầy, tăng pool có thể đẩy nghẽn sang database thay vì giải quyết nguyên nhân." },
        { title: "Ràng buộc nằm sát dữ liệu", text: "Giả sử tồn kho là 5 và hai yêu cầu cùng đọc 5 rồi cùng trừ 4. Kiểm tra trong Rust trước UPDATE không tự bảo vệ khỏi cạnh tranh. Dùng một câu UPDATE có điều kiện stock >= quantity và kiểm tra rows_affected; cơ sở dữ liệu quyết định trên trạng thái đang được cập nhật. Thêm CHECK(stock >= 0) như ràng buộc cuối cùng.\n\nDữ liệu đầu vào đi qua bind, không nối chuỗi thành SQL. Với dữ liệu có version, điều kiện WHERE id = ? AND version = ? phát hiện người dùng đang sửa bản cũ. Không hàng nào được cập nhật có thể là xung đột, không tồn tại hoặc không đủ quyền; cách phân biệt phải phù hợp chính sách không lộ dữ liệu.", code: "let changed = sqlx::query(\n    \"UPDATE inventory SET stock = stock - ? WHERE id = ? AND stock >= ?\"\n)\n.bind(quantity).bind(item_id).bind(quantity)\n.execute(&mut *tx).await?.rows_affected();\nif changed == 0 {\n    tx.rollback().await?;\n    return Ok(false);\n}\n// Thêm bản ghi đặt hàng trong cùng transaction.\ntx.commit().await?;" },
        { title: "Transaction và yêu cầu được gửi lại", text: "Transaction gom các thay đổi cần cùng thành công: giảm tồn kho và tạo đơn hàng phải cùng được lưu. Trong SQLx, commit tiêu thụ transaction; nếu transaction kết thúc mà chưa commit, quá trình rollback được khởi động khi drop. Với đường lỗi dự kiến, rollback tường minh giúp mã dễ đọc và quan sát.\n\nTimeout ở phía client tạo tình huống không chắc chắn: server có thể đã commit. Thiết kế bảng idempotency với khóa duy nhất gồm tenant và request key; lưu kết quả cùng transaction với thay đổi nghiệp vụ. Nếu cùng key đi kèm payload khác, trả xung đột. Đừng chỉ nhớ key trong HashSet của tiến trình vì restart hoặc replica khác sẽ mất thông tin." },
        { title: "Kiểm thử điều không được xảy ra", text: "Kiểm thử thành công chưa đủ. Tạo lỗi sau thao tác đầu, xác nhận thao tác đầu cũng bị hoàn tác. Gửi hai yêu cầu cùng version hoặc tranh lượng tồn kho cuối; kiểm tra tổng dữ liệu sau khi cả hai kết thúc. Dùng database tách biệt, migration giống production và không dùng cùng dữ liệu cho test đang chạy song song.\n\nLab SQLite bên dưới minh họa nguyên tử và UPDATE có điều kiện bằng một kết nối trong bộ nhớ. PostgreSQL có mô hình khóa, isolation và cú pháp tham số riêng; trước triển khai, chạy lại các tình huống cạnh tranh trên đúng hệ quản trị. Bài tập trình duyệt dùng số dư trong bộ nhớ để luyện bất biến: lỗi ở bất kỳ bước kiểm tra nào phải để cả hai số dư nguyên vẹn." },
      ],
      tip: "Kiểm thử trạng thái sau thất bại quan trọng ngang kiểm thử giá trị trả về.",
      exercise: { title: "Chuyển số dư không để lại trạng thái dở dang", instructions: "Hoàn thiện transfer: kiểm tra đủ tiền và kiểm tra tràn số phía nhận trước khi ghi lại cả hai số dư.", requirements: ["Không đủ tiền trả Err(\"insufficient\").", "Phía nhận bị tràn u64 trả Err(\"overflow\").", "Mọi lỗi đều giữ nguyên source và destination; thành công bảo toàn tổng."] },
      starterCode: `fn transfer(source: &mut u64, destination: &mut u64, amount: u64) -> Result<(), &'static str> {
    todo!()
}
fn main() {
    let (mut a, mut b) = (100, 20);
    assert_eq!(transfer(&mut a, &mut b, 30), Ok(()));
    assert_eq!((a, b), (70, 50));
    assert_eq!(transfer(&mut a, &mut b, 80), Err("insufficient"));
    assert_eq!((a, b), (70, 50));
    let (mut c, mut d) = (10, u64::MAX);
    assert_eq!(transfer(&mut c, &mut d, 1), Err("overflow"));
    assert_eq!((c, d), (10, u64::MAX));
    println!("Số dư: {a}, {b}");
}`,
      solutionCode: `fn transfer(source: &mut u64, destination: &mut u64, amount: u64) -> Result<(), &'static str> {
    let new_source = source.checked_sub(amount).ok_or("insufficient")?;
    let new_destination = destination.checked_add(amount).ok_or("overflow")?;
    *source = new_source;
    *destination = new_destination;
    Ok(())
}
fn main() {
    let (mut a, mut b) = (100, 20);
    assert_eq!(transfer(&mut a, &mut b, 30), Ok(()));
    assert_eq!((a, b), (70, 50));
    assert_eq!(transfer(&mut a, &mut b, 80), Err("insufficient"));
    assert_eq!((a, b), (70, 50));
    let (mut c, mut d) = (10, u64::MAX);
    assert_eq!(transfer(&mut c, &mut d, 1), Err("overflow"));
    assert_eq!((c, d), (10, u64::MAX));
    println!("Số dư: {a}, {b}");
}`,
      expectedOutput: "Số dư: 70, 50", hints: ["Tính hai giá trị mới vào biến tạm.", "Chỉ ghi qua &mut sau khi cả checked_sub và checked_add đã thành công."],
      quiz: { question: "Hai request cùng đọc stock rồi cùng UPDATE theo giá trị đã đọc. Điều gì giúp tránh bán vượt tồn kho?", options: ["Clone pool trước mỗi request.", "Chỉ kiểm tra stock trong Rust trước khi UPDATE.", "Dùng UPDATE có điều kiện stock >= quantity và kiểm tra số hàng đã đổi, kèm ràng buộc dữ liệu.", "Bọc response bằng Json."], correct: 2, explanation: "Điều kiện và thay đổi cần được đánh giá cùng một thao tác trên database. Một lần đọc riêng trong ứng dụng có thể đã cũ khi UPDATE chạy." },
      reference: { label: "SQLx 0.8.6: Transaction", url: "https://docs.rs/sqlx/0.8.6/sqlx/struct.Transaction.html" },
      localLab: {
        title: "Đặt hàng nguyên tử với SQLx và SQLite",
        instructions: "Tạo dự án với hai tệp sau. Lab cố định SQLx 0.8.6 và dùng SQLite trong bộ nhớ, một kết nối; chưa mô phỏng tải cạnh tranh của PostgreSQL.",
        files: [
          { path: "Cargo.toml", content: `[package]
name = "stock-transaction"
version = "0.1.0"
edition = "2024"
[dependencies]
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }
sqlx = { version = "=0.8.6", default-features = false, features = ["runtime-tokio", "sqlite"] }
` },
          { path: "src/main.rs", content: `use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
async fn reserve(pool: &SqlitePool, quantity: i64, reject_after_update: bool) -> Result<bool, sqlx::Error> {
    if quantity <= 0 { return Ok(false); }
    let mut tx = pool.begin().await?;
    let affected = sqlx::query("UPDATE inventory SET stock = stock - ? WHERE id = 1 AND stock >= ?")
        .bind(quantity).bind(quantity).execute(&mut *tx).await?.rows_affected();
    if affected == 0 || reject_after_update {
        tx.rollback().await?;
        return Ok(false);
    }
    sqlx::query("INSERT INTO orders (quantity) VALUES (?)").bind(quantity).execute(&mut *tx).await?;
    tx.commit().await?;
    Ok(true)
}
#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    let pool = SqlitePoolOptions::new().max_connections(1).connect("sqlite::memory:").await?;
    sqlx::query("CREATE TABLE inventory (id INTEGER PRIMARY KEY, stock INTEGER NOT NULL CHECK(stock >= 0))").execute(&pool).await?;
    sqlx::query("CREATE TABLE orders (id INTEGER PRIMARY KEY, quantity INTEGER NOT NULL CHECK(quantity > 0))").execute(&pool).await?;
    sqlx::query("INSERT INTO inventory VALUES (1, 5)").execute(&pool).await?;
    assert!(!reserve(&pool, 3, true).await?);
    let stock: i64 = sqlx::query_scalar("SELECT stock FROM inventory WHERE id = 1").fetch_one(&pool).await?;
    assert_eq!(stock, 5);
    assert!(reserve(&pool, 4, false).await?);
    assert!(!reserve(&pool, 2, false).await?);
    let stock: i64 = sqlx::query_scalar("SELECT stock FROM inventory WHERE id = 1").fetch_one(&pool).await?;
    let orders: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM orders").fetch_one(&pool).await?;
    assert_eq!((stock, orders), (1, 1));
    println!("stock={stock}, orders={orders}");
    Ok(())
}
` },
        ],
        commands: ["cargo run", "cargo clippy -- -D warnings"],
        checks: ["Khi reject_after_update=true, stock vẫn là 5 và không có order.", "Sau đặt 4 và thử đặt thêm 2, kết quả là stock=1, orders=1.", "Chuyển sang PostgreSQL: đổi driver, tham số $1/$2 và thiết kế integration test cạnh tranh trên database thật."],
      },
    },
    {
      id: "backend-authorization", moduleId: "track-backend", title: "Danh tính, phân quyền và cách ly workspace", duration: 50,
      description: "Xây chính sách truy cập có thể kiểm thử; không nhầm đăng nhập thành quyền thao tác mọi dữ liệu.",
      objectives: ["Tách authentication khỏi authorization", "Đưa tenant vào điều kiện truy vấn", "Thiết kế principal đáng tin cậy và mặc định từ chối", "Kiểm thử ma trận vai trò, chủ sở hữu và workspace"],
      sections: [
        { title: "Danh tính không quyết định toàn bộ quyền", text: "Authentication trả lời người gọi là ai; authorization trả lời người đó được làm gì với tài nguyên cụ thể. Một token hợp lệ của thành viên nhóm A không cho phép sửa công việc nhóm B. Policy nên nhận principal, hành động và thuộc tính tài nguyên; không chỉ kiểm tra một cờ is_logged_in.\n\nMặc định từ chối những trường hợp chưa được cho phép. Viết chính sách bằng một hàm nhỏ rồi lập bảng ví dụ trước khi ghép vào middleware. Trong bài tập, admin chỉ quản lý tài nguyên cùng workspace; quy tắc này cố ý không có super-admin xuyên workspace. Nếu sản phẩm cần quyền hỗ trợ toàn hệ thống, thiết kế một quyền riêng với luồng cấp và audit rõ ràng." },
        { title: "Principal phải đến từ nguồn đã xác minh", text: "Đừng lấy user_id hoặc role từ JSON gửi lên rồi xem như danh tính. Với JWT, dùng thư viện và cấu hình xác minh chữ ký, thuật toán cho phép, issuer, audience và thời hạn phù hợp nhà cung cấp. Decode payload chỉ đọc được dữ liệu; nó không chứng minh dữ liệu đáng tin.\n\nGiữ bước xác minh token ở biên HTTP, sau đó truyền một kiểu Principal nội bộ vào nghiệp vụ. Không tự viết mã mật mã hoặc lưu mật khẩu dạng rõ. Với cookie đăng nhập, cần chọn SameSite, Secure, HttpOnly và biện pháp CSRF theo luồng ứng dụng; CORS không thay thế kiểm tra quyền trên server. Với bearer token, tránh ghi Authorization vào log." },
        { title: "Cách ly ngay trong truy vấn", text: "Truy vấn UPDATE tasks SET ... WHERE id = ? AND workspace_id = ? giảm nguy cơ sửa nhầm dữ liệu nhóm khác. Workspace dùng trong điều kiện phải là workspace đã kiểm tra quyền, không chỉ chuỗi client truyền. Nếu kiểm tra owner ở một truy vấn và cập nhật ở truy vấn sau, hãy cân nhắc quyền hoặc chủ sở hữu có thể thay đổi giữa hai bước.\n\nĐưa điều kiện quyền vào thao tác ghi hoặc dùng transaction thích hợp. Nếu dùng Row Level Security, xem nó là một lớp chính sách cần kiểm thử riêng; kết nối có quyền bypass có thể vô hiệu hóa giả định đó. Chọn phản hồi 403 hay 404 theo hợp đồng và yêu cầu không tiết lộ sự tồn tại của tài nguyên." },
        { title: "Kiểm thử âm là trọng tâm", text: "Một test owner sửa được chỉ chứng minh đường thành công. Cần test không đăng nhập, người khác cùng nhóm, admin khác nhóm, ID đoán được, tài nguyên bị chuyển nhóm và token hết hạn. Các trường hợp này nên được đặt tên theo chính sách để người review thấy ngay phạm vi bảo vệ.\n\nGhi audit các quyết định nhạy cảm bằng ID nội bộ và hành động, không ghi token hoặc toàn bộ dữ liệu cá nhân. Unit test chính sách phải đi cùng HTTP/integration test xác nhận endpoint thực sự gọi chính sách. Nếu test hàm policy đạt mà một route quên sử dụng nó, hệ thống vẫn hở quyền. Bài tập xây phần quy tắc thuần để dễ bao phủ mọi nhánh." },
      ],
      tip: "Kiểm thử một admin ở workspace khác: đây là trường hợp dễ bị bỏ sót khi điều kiện chỉ là owner || admin.",
      exercise: { title: "Ai được sửa công việc?", instructions: "Cho phép sửa khi có principal, cùng workspace và người gọi là owner hoặc admin của workspace đó.", requirements: ["Không đăng nhập luôn bị từ chối.", "Admin khác workspace vẫn bị từ chối.", "Thành viên cùng workspace chỉ được sửa công việc mình sở hữu."] },
      starterCode: `struct Principal { user: u64, workspace: u64, admin: bool }
struct Task { owner: u64, workspace: u64 }
fn can_edit(principal: Option<&Principal>, task: &Task) -> bool {
    todo!()
}
fn main() {
    let task = Task { owner: 1, workspace: 10 };
    let owner = Principal { user: 1, workspace: 10, admin: false };
    let peer = Principal { user: 2, workspace: 10, admin: false };
    let admin = Principal { user: 2, workspace: 10, admin: true };
    let outsider = Principal { user: 1, workspace: 99, admin: true };
    assert!(!can_edit(None, &task));
    assert!(can_edit(Some(&owner), &task));
    assert!(!can_edit(Some(&peer), &task));
    assert!(can_edit(Some(&admin), &task));
    assert!(!can_edit(Some(&outsider), &task));
    println!("5 chính sách truy cập đã đạt");
}`,
      solutionCode: `struct Principal { user: u64, workspace: u64, admin: bool }
struct Task { owner: u64, workspace: u64 }
fn can_edit(principal: Option<&Principal>, task: &Task) -> bool {
    let Some(principal) = principal else { return false; };
    principal.workspace == task.workspace && (principal.user == task.owner || principal.admin)
}
fn main() {
    let task = Task { owner: 1, workspace: 10 };
    let owner = Principal { user: 1, workspace: 10, admin: false };
    let peer = Principal { user: 2, workspace: 10, admin: false };
    let admin = Principal { user: 2, workspace: 10, admin: true };
    let outsider = Principal { user: 1, workspace: 99, admin: true };
    assert!(!can_edit(None, &task));
    assert!(can_edit(Some(&owner), &task));
    assert!(!can_edit(Some(&peer), &task));
    assert!(can_edit(Some(&admin), &task));
    assert!(!can_edit(Some(&outsider), &task));
    println!("5 chính sách truy cập đã đạt");
}`,
      expectedOutput: "5 chính sách truy cập đã đạt", hints: ["Dùng let Some(...) = ... else để xử lý thiếu danh tính.", "Điều kiện cùng workspace phải bao quanh cả trường hợp owner và admin."],
      quiz: { question: "Client gửi owner_id của người khác nhưng JWT hợp lệ của chính client. API nên chọn owner từ đâu?", options: ["Luôn tin owner_id trong JSON vì request có JWT.", "Từ danh tính đã xác minh và chính sách nghiệp vụ; bỏ qua hoặc từ chối trường không được phép.", "Từ header X-User-Id bất kỳ.", "Chỉ cần ẩn trường owner_id trên giao diện."], correct: 1, explanation: "Dữ liệu do client khai báo không trở thành đáng tin chỉ vì client đã đăng nhập. Server phải quyết định owner theo principal và quyền của hành động." },
      reference: { label: "OWASP: kiểm tra quyền trên mỗi request", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" },
    },
    {
      id: "backend-streaming", moduleId: "track-backend", title: "WebSocket, gRPC và hợp đồng sự kiện", duration: 55,
      description: "Chọn giao thức theo bài toán, giới hạn luồng dữ liệu và khôi phục trạng thái khi kết nối bị gián đoạn.",
      objectives: ["Phân biệt HTTP request/response, WebSocket và RPC", "Thiết kế event ID, cursor và quy tắc nhận lặp", "Đặt deadline cho cuộc gọi tonic", "Xử lý client chậm và lỗi kết nối có giới hạn"],
      sections: [
        { title: "Giao thức phục vụ hợp đồng", text: "HTTP phù hợp với thao tác yêu cầu–phản hồi và tài nguyên có thể đọc độc lập. WebSocket giữ kết nối hai chiều cho cập nhật liên tục hoặc tương tác thời gian thực. gRPC cung cấp service/method và message có kiểu từ hợp đồng protobuf; tonic là lựa chọn Rust cho gRPC trên HTTP/2. Không cần thay mọi endpoint bằng cùng một giao thức.\n\nVí dụ ứng dụng công việc có thể dùng HTTP để tạo task, WebSocket để báo task thay đổi và gRPC giữa hai dịch vụ nội bộ. Dù truyền qua đâu, kiểm tra quyền và bất biến nghiệp vụ vẫn phải nhất quán. Tránh sao chép logic vào ba handler độc lập; cùng gọi một tầng ứng dụng với principal rõ ràng." },
        { title: "Một kết nối không phải một lịch sử bền vững", text: "WebSocket truyền message trong kết nối đang tồn tại; nó không tự lưu sự kiện để client đọc lại sau khi mất mạng. Nếu giao diện cần trạng thái chính xác, mỗi sự kiện nên có ID hoặc sequence và phiên bản tài nguyên. Khi reconnect, client lấy snapshot mới hoặc yêu cầu phát lại từ cursor trong phạm vi hệ thống còn lưu.\n\nBài tập dùng sequence tăng liên tiếp trong một luồng duy nhất. Sự kiện đã nhận thì bỏ qua; thiếu một sequence phải yêu cầu đồng bộ lại, không áp dụng các sự kiện sau như thể lịch sử đầy đủ. Đây là quy ước của bài tập, không phải cam kết tự động của WebSocket. Với nhiều partition hoặc publisher, cần mô hình thứ tự cụ thể hơn." },
        { title: "Client chậm phải có chính sách", text: "Mỗi kết nối cần giới hạn kích thước message và hàng đợi gửi. Nếu người nhận chậm, chọn đợi có deadline, gộp trạng thái mới nhất hoặc ngắt kết nối để client đồng bộ lại. Không được bỏ sự kiện nghiệp vụ một cách âm thầm nếu client dựa vào từng sự kiện để tính trạng thái.\n\nTrong Axum, WebSocketUpgrade chuyển request hợp lệ sang callback quản lý socket; bật feature ws. Cần kiểm tra danh tính và quyền trước khi upgrade, đồng thời kiểm tra quyền cho từng loại message có thể thay đổi dữ liệu. Theo dõi cả task đọc lẫn task ghi, hủy phần còn lại khi một phía kết thúc để không giữ kết nối hoặc channel mồ côi." },
        { title: "Deadline và thay đổi hợp đồng RPC", text: "Mỗi cuộc gọi RPC phải có ngân sách thời gian. Trong tonic, Request::set_timeout gửi thời lượng cho phép; một yêu cầu gọi tiếp dịch vụ khác nên dùng phần thời gian còn lại thay vì khởi động lại toàn bộ timeout. Client ngừng chờ không tự bảo đảm mọi tác vụ nền của server đã dừng; ứng dụng phải truyền tín hiệu hủy tới công việc đã tạo.\n\nVới protobuf, giữ số field ổn định, không tái sử dụng số đã xóa và kiểm tra khả năng đọc dữ liệu cũ khi đổi schema. Mã lỗi gRPC phải diễn đạt loại lỗi, chẳng hạn thiếu quyền khác với lỗi tạm thời. Retry chỉ phù hợp nếu thao tác lặp lại an toàn; đặt giới hạn số lần và tổng thời gian.", code: "// Ví dụ tonic trong dự án Cargo; GetTaskRequest là kiểu sinh từ protobuf.\nlet mut request = tonic::Request::new(GetTaskRequest { id: 42 });\nrequest.set_timeout(std::time::Duration::from_millis(800));\nlet reply = client.get_task(request).await?;\nlet task = reply.into_inner();" },
      ],
      tip: "Thiết kế reconnect và client chậm trước khi xây luồng cập nhật thời gian thực.",
      exercise: { title: "Nhận sự kiện đúng thứ tự", instructions: "Hoàn thiện apply: bỏ sự kiện lặp, nhận sequence tiếp theo và báo gap khi thiếu lịch sử. Không đổi cursor khi có gap.", requirements: ["sequence <= cursor trả Ok(false).", "sequence == cursor + 1 cập nhật cursor và trả Ok(true).", "sequence lớn hơn bước tiếp theo trả Err(\"gap\"); xử lý cả cursor=u64::MAX."] },
      starterCode: `fn apply(cursor: &mut u64, sequence: u64) -> Result<bool, &'static str> {
    todo!()
}
fn main() {
    let mut cursor = 10;
    assert_eq!(apply(&mut cursor, 10), Ok(false));
    assert_eq!(apply(&mut cursor, 11), Ok(true));
    assert_eq!(apply(&mut cursor, 13), Err("gap"));
    assert_eq!(cursor, 11);
    assert_eq!(apply(&mut cursor, 12), Ok(true));
    assert_eq!(apply(&mut u64::MAX, u64::MAX), Ok(false));
    println!("Cursor: {cursor}");
}`,
      solutionCode: `fn apply(cursor: &mut u64, sequence: u64) -> Result<bool, &'static str> {
    if sequence <= *cursor { return Ok(false); }
    if cursor.checked_add(1) != Some(sequence) { return Err("gap"); }
    *cursor = sequence;
    Ok(true)
}
fn main() {
    let mut cursor = 10;
    assert_eq!(apply(&mut cursor, 10), Ok(false));
    assert_eq!(apply(&mut cursor, 11), Ok(true));
    assert_eq!(apply(&mut cursor, 13), Err("gap"));
    assert_eq!(cursor, 11);
    assert_eq!(apply(&mut cursor, 12), Ok(true));
    assert_eq!(apply(&mut u64::MAX, u64::MAX), Ok(false));
    println!("Cursor: {cursor}");
}`,
      expectedOutput: "Cursor: 12", hints: ["Xử lý sự kiện cũ trước khi cộng cursor.", "Dùng checked_add để tránh tràn số ở giới hạn u64."],
      quiz: { question: "WebSocket reconnect sau khi mất vài sự kiện. Điều gì cần được ứng dụng thiết kế?", options: ["Không cần làm gì vì giao thức tự phát lại toàn bộ lịch sử.", "Tự tăng cursor lên ID mới nhất mà không đọc dữ liệu.", "Lấy snapshot hoặc phát lại từ cursor đã xác nhận, đồng thời xử lý sự kiện lặp.", "Bỏ kiểm tra quyền sau lần đăng nhập đầu tiên."], correct: 2, explanation: "Khôi phục lịch sử là hợp đồng của ứng dụng. Kết nối WebSocket mới không tự chứa các message đã mất của kết nối cũ." },
      reference: { label: "tonic: request và timeout", url: "https://docs.rs/tonic/0.14.9/tonic/struct.Request.html" },
    },
    {
      id: "backend-production", moduleId: "track-backend", title: "Quan sát, kiểm thử tải và triển khai dịch vụ", duration: 60,
      description: "Đưa một API từ chạy được sang vận hành có bằng chứng: đo lỗi, giới hạn retry và dừng có kiểm soát.",
      objectives: ["Đọc latency và lỗi theo từng chặng request", "Thiết kế retry có ngân sách và điều kiện idempotency", "Phân biệt readiness với liveness", "Viết kế hoạch shutdown, migration và rollback"],
      sections: [
        { title: "Một request cần dấu vết có ích", text: "Log rời rạc khó trả lời request nào chậm và chậm ở đâu. Tạo span cho request, gắn request ID, route dạng mẫu, status và thời gian xử lý; tạo span con cho truy vấn hoặc gọi dịch vụ. tower-http TraceLayer giúp thêm tracing quanh HTTP service, nhưng ứng dụng vẫn phải chọn trường phù hợp và tránh ghi bí mật.\n\nTheo dõi tỷ lệ lỗi, throughput và phân bố latency; một giá trị trung bình có thể che các request rất chậm. Đo thêm thời gian đợi pool và queue để phân biệt nghẽn database với nghẽn worker. Không dùng user ID hoặc URL chứa ID làm label metric tùy ý vì số tổ hợp có thể tăng rất lớn. Giữ dữ liệu chi tiết đó trong trace có chính sách lưu trữ phù hợp." },
        { title: "Retry tiêu thụ chính tài nguyên đang thiếu", text: "Khi phụ thuộc lỗi, gửi lại ngay ở mọi tầng có thể nhân tải. Retry cần loại lỗi được phép thử, giới hạn số lần, khoảng chờ tăng dần, jitter và tổng deadline. Chỉ retry thao tác có hợp đồng lặp lại an toàn hoặc đã có idempotency key. Lỗi validation và thiếu quyền thường không tốt lên khi lặp lại nguyên request.\n\nBài tập dùng backoff xác định để dễ kiểm thử; hệ thống thực bổ sung jitter và tính cả thời gian từng attempt vào ngân sách chung. Quyết định đợi phải được tính trước khi ngủ và kiểm tra lại deadline khi thức. Một timeout response không đủ chứng minh thao tác trước đó chưa tạo tác dụng phụ." },
        { title: "Readiness và dừng có kiểm soát", text: "Liveness cho biết tiến trình còn hoạt động; readiness cho biết nó có thể nhận công việc mới theo chính sách triển khai. Kiểm tra sâu mọi phụ thuộc ở mỗi probe có thể làm hệ thống tệ hơn khi phụ thuộc chậm. Chọn tín hiệu nhỏ, có timeout và giải thích điều kiện chuyển trạng thái.\n\nGraceful shutdown gồm nhận tín hiệu dừng, thông báo cho thành phần liên quan rồi chờ chúng kết thúc. Ngừng nhận việc mới, cho request đang xử lý một khoảng thời gian, kết thúc worker và đóng pool. Công việc dài cần có checkpoint hoặc khả năng thử lại. Phải có thời hạn cuối; tiến trình không nên chờ vô hạn một kết nối WebSocket hoặc tác vụ blocking không bao giờ trả về." },
        { title: "Bản phát hành phải có đường kiểm chứng", text: "Đưa Cargo.lock vào repository của ứng dụng để build có dependency nhất quán. CI chạy fmt, Clippy, test đơn vị, test HTTP và test database trên môi trường tách biệt. Image chạy quyền tối thiểu; cấu hình và secret đến từ môi trường triển khai, không được nhúng vào image hay log.\n\nMigration phải tương thích với giai đoạn có cả binary cũ và mới. Khi đổi schema lớn, có thể thêm trường mới, triển khai mã hỗ trợ cả hai, chuyển dữ liệu rồi mới bỏ trường cũ. Báo cáo tải cần ghi máy, database, số client, dữ liệu mẫu và thời lượng; không công bố một con số requests/second thiếu ngữ cảnh. Hoàn tất dự án khi người khác tái hiện được test, chạy được release và biết xử lý một lỗi giả lập." },
      ],
      tip: "Một quyết định vận hành tốt đi kèm số đo hoặc tình huống kiểm thử có thể tái hiện.",
      exercise: { title: "Quyết định retry trong ngân sách", instructions: "next_delay trả khoảng chờ cho lần thử lại thứ attempt (0, 1, 2). Chỉ retry thao tác idempotent; khoảng chờ phải nhỏ hơn thời gian còn lại.", requirements: ["attempt từ 3 trở lên hoặc idempotent=false trả None.", "Các khoảng chờ lần lượt là 100, 200 và 400 ms.", "Nếu delay >= remaining_ms, trả None để còn thời gian thực hiện request."] },
      starterCode: `fn next_delay(attempt: u32, remaining_ms: u64, idempotent: bool) -> Option<u64> {
    todo!()
}
fn main() {
    assert_eq!(next_delay(0, 1000, true), Some(100));
    assert_eq!(next_delay(1, 1000, true), Some(200));
    assert_eq!(next_delay(2, 1000, true), Some(400));
    assert_eq!(next_delay(3, 1000, true), None);
    assert_eq!(next_delay(0, 100, true), None);
    assert_eq!(next_delay(0, 1000, false), None);
    assert_eq!(next_delay(u32::MAX, u64::MAX, true), None);
    println!("Retry: 100, 200, 400 ms");
}`,
      solutionCode: `fn next_delay(attempt: u32, remaining_ms: u64, idempotent: bool) -> Option<u64> {
    if !idempotent || attempt >= 3 { return None; }
    let delay = 100_u64 << attempt;
    (delay < remaining_ms).then_some(delay)
}
fn main() {
    assert_eq!(next_delay(0, 1000, true), Some(100));
    assert_eq!(next_delay(1, 1000, true), Some(200));
    assert_eq!(next_delay(2, 1000, true), Some(400));
    assert_eq!(next_delay(3, 1000, true), None);
    assert_eq!(next_delay(0, 100, true), None);
    assert_eq!(next_delay(0, 1000, false), None);
    assert_eq!(next_delay(u32::MAX, u64::MAX, true), None);
    println!("Retry: 100, 200, 400 ms");
}`,
      expectedOutput: "Retry: 100, 200, 400 ms", hints: ["Kiểm tra attempt trước phép dịch bit.", "then_some chuyển một điều kiện thành Option; nhánh if thông thường cũng đúng."],
      quiz: { question: "Sau khi nhận tín hiệu dừng, thứ tự nào hợp lý cho dịch vụ có HTTP và worker?", options: ["Xóa database rồi đợi request kết thúc.", "Tiếp tục nhận request mới cho đến khi không còn lỗi.", "Ngừng nhận việc mới, báo các thành phần dừng, chờ công việc đang chạy trong thời hạn rồi giải phóng tài nguyên.", "Gọi abort là chắc chắn mọi tác vụ blocking đã dừng."], correct: 2, explanation: "Shutdown cần phối hợp và có thời hạn. Một số tác vụ, đặc biệt spawn_blocking đã chạy, không thể dừng đơn giản bằng abort." },
      reference: { label: "Tokio: graceful shutdown", url: "https://tokio.rs/tokio/topics/shutdown" },
    },
  ],
};
