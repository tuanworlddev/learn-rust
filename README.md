# Learn Rust

Website học Rust bằng tiếng Việt, kết hợp mục lục từ nền tảng đến nâng cao và thực hành ngay trong trình duyệt.

## Chạy trên máy local

Yêu cầu: Node.js 22.13 trở lên và npm. Rust cần cho việc kiểm tra toàn bộ lời giải, không cần để khởi động website.

```bash
npm ci
npm run dev:local
```

Mở http://localhost:3000. Server chỉ lắng nghe trên địa chỉ loopback của máy.

```bash
npm run build:local
npm run start:local
```

`dev`/`build` chạy Next.js; `start` và `start:local` khởi chạy bản standalone sau khi chép tài nguyên cần thiết và đọc môi trường của project. Dev/start local chỉ mở loopback; bản Docker lắng nghe trong mạng nội bộ của Compose, phía sau Caddy.

## Cấu hình Supabase và triển khai VPS

- [Cấu hình Supabase](docs/supabase.md): biến môi trường, migration SQL, RLS, Auth và kiểm tra kết nối.
- [Xuất bản giáo trình](docs/course-content.md): lưu nháp, xuất bản, rollback và tải lab từ nội dung Supabase.
- [Triển khai VPS](docs/deploy-vps.md): Docker Compose, Caddy HTTPS, health check, cập nhật và rollback.
- [Cấu hình SEO](docs/seo.md): tên miền, canonical, sitemap, trạng thái lập chỉ mục và nghiệm thu.

Mẫu VPS nằm ở `deploy/env.example`. Sao chép thành `deploy/.env`, điền `DOMAIN` và `SITE_URL`; giữ `SITE_INDEXABLE=false` khi nghiệm thu. Supabase là tùy chọn: nếu chưa có Project URL và publishable key, website vẫn học và lưu tiến độ cục bộ bình thường. Không đưa service_role/secret key vào frontend.

```bash
node --env-file-if-exists=deploy/.env scripts/check-config.mjs --production
docker compose --env-file deploy/.env build
docker compose --env-file deploy/.env up -d
```

Các đường dẫn bài học là `/bai-hoc/<id>`, dự án là `/du-an/<id>`, phỏng vấn là `/phong-van`. Link cũ dạng `/#bai-hoc/...` và `/#di-lam` vẫn được chuyển sang URL mới. Mỗi bài có nội dung HTML từ máy chủ, metadata riêng và canonical theo `SITE_URL`. Mặc định không cho lập chỉ mục cho tới khi cấu hình tên miền HTTPS chính thức và bật `SITE_INDEXABLE=true`.

## Lộ trình

**314 bài học trong 98 chương**: mục **Bài học** gồm **Kiến thức nền tảng** (80 bài, 20 chương) và 13 khóa chuyên sâu (mỗi khóa 18 bài, 6 chương). Các khóa có mục lục, tìm kiếm và tiến độ riêng; ID của 158 bài đã có được giữ nguyên.

1. Bắt đầu & Công cụ
2. Biến & Kiểu dữ liệu
3. Hàm & Luồng điều khiển
4. Ownership & Borrowing
5. Struct & Enum
6. Collections & Chuỗi
7. Option & Result
8. Tổ chức dự án
9. Generic & Trait
10. Closure & Iterator
11. Smart pointers
12. Lifetime nâng cao
13. Kiểm thử & Chất lượng
14. I/O & Dòng lệnh
15. Concurrency
16. Async & Future
17. Macro & Thuộc tính
18. Rust nâng cao
19. Thiết kế & Hiệu năng
20. Dự án tổng hợp

Mỗi bài có lý thuyết tự đủ, ví dụ, mục tiêu, bài tập với mã khởi đầu, lời giải, gợi ý, kết quả mong đợi và câu hỏi. Giao diện học không đưa người học sang tài liệu bên ngoài. Nguồn chính thức được lưu trong dữ liệu biên tập và báo cáo để kiểm chứng. Mục **Dự án** tập hợp 3 dự án nền tảng và **39 dự án chuyên sâu**, có bộ lọc theo khóa.

Các bài Cargo/rustup/workspace/Clippy/doctest trình bày quy trình thực tế trên máy. Bài tập của chúng trên web được giới hạn và ghi rõ phạm vi một tệp. Ví dụ I/O và CLI dùng dữ liệu mẫu; phần async giải thích Future/Waker/Pin/executor bằng thư viện chuẩn, không giả định có Tokio hay hệ thống I/O bất đồng bộ trên web.

## Các khóa chuyên sâu trong Bài học

Trang `/` là danh mục Bài học. Nền tảng nằm tại `/khoa-hoc/nen-tang`, từng khóa chuyên sâu tại `/khoa-hoc/<id>`. Mỗi khóa có **6 chương, 18 bài, 3 dự án theo mức có hướng dẫn → tự triển khai → cuối khóa**, 12 câu hỏi tình huống và ít nhất 6 năng lực thực hành. `/chuyen-sau` và `/chuyen-sau/<id>` chuyển hướng 308 sang URL mới.

| Hướng | Công nghệ và nội dung chính |
| --- | --- |
| Backend và dịch vụ mạng | Tokio, Axum, SQLx, giao dịch, gRPC/WebSocket, vận hành |
| Lập trình hệ thống | Process, file descriptor, bộ nhớ, đồng thời, no_std, Rust for Linux |
| Nhúng và IoT | embedded-hal, esp-hal, Embassy, cảm biến, firmware |
| Desktop | Tauri, IPC, capability, tác vụ nền, đóng gói |
| Mobile và thư viện dùng chung | UniFFI, Swift/Kotlin, vòng đời, adapter, phát hành |
| CLI và tự động hóa | clap, luồng dữ liệu, pipe, filesystem, phân phối |
| WebAssembly | wasm-bindgen, JavaScript, bộ nhớ, worker, profiling |
| Compiler và công cụ phát triển | Lexer, AST, parser, type checker, IR, LSP |
| Bảo mật và phân tích nhị phân | object, parser giới hạn, cargo-fuzz, debugger, triage |
| Game, đồ họa và mô phỏng | Bevy, ECS, scheduling, fixed timestep, replay |
| Dữ liệu và engine phân tích | Polars, Arrow, DataFusion, SQL, pipeline |
| AI và Machine Learning | Burn, Candle, tensor, huấn luyện, đánh giá, serving |
| Blockchain | Solana, Anchor, account, PDA, CPI, kiểm thử trạng thái |

Các bài tập trên web luyện từng quyết định và thuật toán bằng thư viện chuẩn. **68 lab Cargo** dùng cấu trúc dự án và dependency thật; nút **Tải dự án** giữ đầy đủ đường dẫn tệp và hướng dẫn. Kiểm thử host không thay thế nghiệm thu trên thiết bị, GPU, WebView, trình duyệt Wasm hoặc runtime blockchain; từng bài nêu rõ phần cần chạy trên môi trường đích.

**7 hình minh họa gốc** gắn với backend, nhúng, desktop, mô phỏng, dữ liệu, AI và compiler. **26 mô phỏng chuyên sâu** có nút chạy/dừng, tiến/lùi từng bước và đổi tình huống; người học theo dõi giá trị và trạng thái thực tế trong từng kịch bản. Ownership, borrowing, Result và vòng đời Future vẫn có 4 mô hình tương tác nền tảng. Mô phỏng không tự chạy khi tải trang và dừng khi rời vùng xem.

Trang `/khoa-hoc/<id>/danh-gia` đối chiếu bài học, bài kiểm tra và bằng chứng dự án. Đáp án sai dẫn tới bài ôn nội bộ. Mỗi dự án có yêu cầu, mốc triển khai, ca lỗi, rubric và sản phẩm bàn giao; bỏ một tiêu chí sẽ mở lại trạng thái cần nghiệm thu. Hoàn thành rubric là **tự đánh giá**, không phải chấm mã từ xa hay chứng nhận nghề nghiệp. Đáp án và rubric có dấu phiên bản nội dung để kết quả cũ không được tính nhầm khi tiêu chí đổi.

## Thực hành và chấm bài

Frontend gửi mã đến `/api/execute`. API chuyển yêu cầu đến `https://play.rust-lang.org/execute` với Rust stable, edition 2024, debug, chương trình bin. Vì vậy website chạy local nhưng nút Chạy mã/Kiểm tra vẫn cần Internet để dùng Rust Playground.

- Giới hạn mã 40.960 byte; giới hạn request 60.000 byte.
- Chờ tối đa 25 giây; lỗi trình biên dịch được trả về terminal.
- Kiểm tra bài: biên dịch và chạy thật, sau đó so sánh stdout (chuẩn hóa newline và khoảng trắng hai đầu).
- Các assertion trong mã mẫu kiểm tra thêm đầu vào. Người học cần giữ chúng; đối chiếu stdout không phải bộ chấm chống gian lận hoặc kiểm chứng đầy đủ mọi trường hợp.
- Một bài được đánh dấu hoàn thành sau khi bài thực hành đạt và câu hỏi đúng.
- Không thực thi mã người học tùy ý trên máy host của website.

## Giao diện

React 19, TypeScript, Next.js 16 và Tailwind CSS 4 qua PostCSS. Không dùng Tailwind CDN. Giao diện dùng utility classes và `@apply`, cùng CSS token cho light/dark.

- Nhãn sản phẩm: Learn Rust.
- Font hệ thống hỗ trợ tiếng Việt, không giãn ký tự. Nội dung bài 15px, code 13px.
- Sidebar chương/bài; trang mục lục đầy đủ; hai cột bài học/editor trên desktop.
- Mobile dùng nút Nội dung / Viết mã để chuyển nhanh giữa bài học và editor, giữ nguyên bản nháp; mục lục mở dạng drawer.
- Chuyển trang/tab nhẹ, giữ vị trí đọc theo tab; cuộn ngắn có thể ngắt bằng thao tác người dùng. Accordion mở và đóng trong 260ms, nút phản hồi 150–180ms; tôn trọng `prefers-reduced-motion`.
- Nút sáng/tối lưu tùy chọn. Lần đầu theo giao diện hệ thống.
- Search, drawer và settings hỗ trợ bàn phím, Escape và focus trap. Tab bài học/sổ tay dùng phím mũi tên, Home, End; điều hướng cập nhật tiêu đề và focus nội dung.
- Sidebar sáng dùng chữ gần đen; sidebar tối dùng chữ sáng. Lỗi lưu tiến độ được thông báo kèm nút xuất bản sao.

## Từ nền tảng đến phỏng vấn và dự án

Mục **Phỏng vấn** (`/phong-van`) bổ sung lộ trình thực hành theo giai đoạn, câu hỏi phỏng vấn mở, đặc tả dự án và tiêu chí tự đánh giá có bằng chứng. Phần này giúp chuẩn bị phỏng vấn và dự án ở mức đầu vào/junior. Các lĩnh vực khác có khóa riêng trong mục Bài học, với các mốc dự án và đánh giá năng lực tương ứng.

80 bài nền tảng giúp học ngôn ngữ và thử từng khái niệm; 234 bài chuyên sâu tiếp nối theo lĩnh vực. Tỷ lệ hoàn thành, đáp án mẫu và kết quả so sánh stdout không chứng minh khả năng làm việc độc lập. Hãy tự triển khai bài mới, viết test, xử lý lỗi, review thiết kế và trình bày lựa chọn của mình trước khi đánh dấu một tiêu chí đã đạt.

Lab [Task API](labs/task-api/README.md) dùng Cargo nhiều tệp, Axum, Tokio và SQLx/SQLite. Chạy trên máy local theo README của lab, không dán cả dự án vào editor một tệp. Mã cơ sở phục vụ học tập; các yêu cầu auth, phân quyền và vận hành production nằm trong phần nâng cấp và cần được thực hiện trước khi triển khai cho người dùng thật.

Các báo cáo review nằm trong thư mục [reports](reports): UX/UI, kiến thức Rust và mức độ chuẩn bị dự án. Báo cáo nêu rõ phần đã sửa, cách kiểm tra và giới hạn; không phải chứng nhận tuyển dụng.


Để kiểm tra binary qua HTTP thật, chạy `cargo build --locked --manifest-path labs/task-api/Cargo.toml`, sau đó `python3 scripts/smoke-task-api.py` từ thư mục gốc. Script dùng database tạm và cổng loopback tự cấp, thử CRUD, dừng sạch và dữ liệu sau restart; không chạm server hay database đang có của bạn.

## Dữ liệu người học

Tiến độ, câu trả lời, bài lưu, ghi chú và bản nháp lưu trong localStorage trên từng trình duyệt và từng origin. `localhost:3000`, `127.0.0.1:3000` và website đã xuất bản có vùng dữ liệu riêng. Khi cấu hình Supabase, mục Cài đặt cho phép đăng ký/đăng nhập, lưu tiến độ vào tài khoản và xem trước để khôi phục trên thiết bị khác. Thao tác lưu/khôi phục là chủ động; không tự hợp nhất dữ liệu giữa các thiết bị. Bản nháp mã và bằng chứng tự đánh giá trong mục Phỏng vấn vẫn ở từng trình duyệt.

Các storage key `rustviet-learning-v1`, `rustviet-code-*` và `rustviet-playground-*` được giữ để không làm mất dữ liệu đã có ở cùng origin khi đổi thương hiệu. Theme dùng `learn-rust-theme`.

## Kiểm tra nội dung Rust

```bash
node scripts/validate-curriculum.mjs
```

Script trên kiểm tra 80 bài nền tảng + 3 dự án. Để kiểm tra toàn bộ 314 bài, cấu trúc khóa học và các lab chuyên sâu:

```bash
node scripts/check-course-depth.mjs
node scripts/validate-course-rust.mjs --all
node scripts/validate-course-labs.mjs
node --test lib/course-assessment.test.mjs
node --test lib/content/content.test.mjs
```

`validate-course-rust.mjs` biên dịch/chạy lời giải và so stdout; `validate-course-labs.mjs` trích dự án rồi chạy `cargo test --workspace --all-targets`. Bộ kiểm cấu trúc và Node tests không chạy Rust. Báo cáo mặc định của từng lệnh:

| Lệnh | Báo cáo |
| --- | --- |
| `validate-curriculum.mjs` | `reports/curriculum-validation.json` |
| `check-course-depth.mjs` | `reports/course-expansion/content-depth.json` |
| `validate-course-rust.mjs` | `reports/specialization-validation.json` |
| `validate-course-labs.mjs` | `reports/local-lab-validation.json` |

Ba script depth/Rust/lab hỗ trợ `--output <file>` để lưu một lượt kiểm riêng. Lọc lời giải bằng `--track data,ai` (số ít), lọc Cargo lab bằng `--tracks data,ai` (số nhiều). Lab có timeout mặc định 900 giây mỗi dự án, chỉnh bằng `--timeout-seconds <số>`. Hai script kiểm lời giải dùng thư mục tạm rồi dọn; Cargo lab, dependency cache và `validation.log` giữ tại `work/course-labs/` để điều tra/chạy lại. Host tests không tự chạy các test `ignored`, consumer Swift/Kotlin, target Wasm hoặc SVM; các bước đó dùng hướng dẫn của lab.

Bằng chứng đợt mở rộng và giới hạn từng môi trường: [nghiệm thu khóa học](reports/course-expansion/acceptance.md).

```bash
npx tsc --noEmit
```

## Các file chính

- `components/learning-app.tsx`: điều hướng, theme, progress, tìm kiếm.
- `components/learning-dashboard.tsx`: mục lục đầy đủ.
- `components/learning-views.tsx`: bài học, dự án, sổ tay và playground.
- `components/code-lab.tsx`: editor, thực thi, kiểm tra, gợi ý.
- `src/data/curriculum.ts`: chương, thứ tự bài và 24 bài gốc.
- `src/data/curriculum-foundations.ts`: 20 bài nền tảng bổ sung.
- `src/data/curriculum-systems.ts`: 18 bài bộ nhớ/concurrency/async/nâng cao.
- `src/data/curriculum-practice.ts`: 18 bài công cụ/I/O/macro/thiết kế/dự án.
- `src/data/projects.ts`: 3 dự án riêng.
- `src/data/specializations/`: 13 khóa chuyên sâu; `expanded/` chứa chương, 156 bài mới, dự án, mô phỏng và đánh giá.
- `components/course-assessment.tsx`, `course-project.tsx`: đánh giá tình huống và nghiệm thu dự án.
- `components/lesson-simulation.tsx`: mô phỏng theo bước trong bài học.
- `lib/course-content.ts`: đọc catalog từ bản Supabase đang xuất bản hoặc chế độ bundled đã chọn.
- `app/api/lessons/[id]/lab/route.ts`: tải dự án Cargo từ nội dung đã kiểm tra.
- `app/api/execute/route.ts`: proxy Rust Playground.

Nội dung lý thuyết được viết bằng tiếng Việt, có nguồn chính thức theo từng bài trong dữ liệu biên tập và báo cáo; không hiển thị liên kết đọc thêm bên ngoài trong luồng học. Bố cục mục lục lấy cảm hứng từ LearnCpp và màn hình thực hành tham khảo Angular tutorial; không sao chép nội dung khóa học C++ hoặc Angular.
