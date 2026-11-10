# Nghiệm thu Learn Rust — trải nghiệm học và giáo trình chuyên sâu

Ngày kiểm tra: 2026-11-10. Checkout: `learn-rust` trên Mac của chủ dự án. Nội dung được đọc từ Supabase thật; không có khóa quản trị trong website hoặc báo cáo.

## Kết quả bàn giao

- 80 bài nền tảng và 78 bài chuyên sâu, tổng cộng **158 bài / 33 chương / 13 hướng**.
- Mỗi hướng có 6 bài, bài tập Rust, câu hỏi, nguồn chính thức, ít nhất 2 lab Cargo và dự án cuối lộ trình. Tổng cộng **29 lab Cargo**, 13 capstone.
- Một agent biên soạn riêng cho từng lĩnh vực; review trải nghiệm học và review nội dung/quyền phát hành được tách riêng. Agent chính thực hiện các thao tác browser được reviewer yêu cầu; không xem đọc source là bằng chứng đã thao tác UI.
- 4 ảnh WebP minh họa Backend, Embedded, Desktop và Game; 4 loại mô phỏng tương tác cho Ownership, Borrowing, Result và Future.

## Nghiệm thu dưới góc nhìn người học

| Tình huống | Kết quả và bằng chứng |
| --- | --- |
| Nút Viết mã trên desktop | 0 nút Viết mã nhìn thấy khi editor đã hiện sẵn. |
| Footer chuyển Bài tập/Câu hỏi | Đổi tab có cuộn ngắn; trở lại Lý thuyết phục hồi vị trí đọc, đã quan sát scrollTop 637. Editor không bị thay thế. |
| Học và hoàn thành thật | Nhập lời giải `backend-runtime`, chạy kiểm tra Rust, chọn đáp án đúng, hoàn thành rồi reload; tiến độ giữ nguyên. |
| LFR-1: Học tiếp | Sau khi bài Tokio đã hoàn thành, về trang chủ rồi Học tiếp đến `/bai-hoc/backend-http`; kiểm tra lại sau bản build cuối. |
| Bài cuối chuyên sâu | Từ `backend-production`, nút Lộ trình đến `/chuyen-sau/backend`. |
| LFR-2: Đã học xong hướng | Source đã đổi CTA thành Ôn lại khi cả 6 bài hoàn thành; không tạo tiến độ giả trong storage người dùng để kiểm tra nhãn. |
| LFR-3: Lời giải | Browser thấy panel mở cao 353.59 px, transition grid 260 ms / opacity 180 ms; đóng về 0 px, aria-hidden=true và inert. Diagnostics dùng cùng disclosure; focus Dùng lời giải có preventScroll. |
| Accordion phỏng vấn | Mở/đóng bằng bàn phím; transition 260 ms / 180 ms và đóng về 0 px. Có reduced motion. |
| Mobile | Viewport 390×844, document clientWidth=scrollWidth=390. Chuyển Nội dung/Viết mã giữ bản nháp và vị trí đọc ở vòng kiểm tra trước. Đã trả viewport về mặc định. |
| Tìm chuyên sâu | Đủ 13 liên kết hướng; nhập `nhung` trả đúng Nhúng và IoT. |
| Hình minh họa | Ảnh Backend tải đúng 1752×897, alt/chú thích có trong trang. Giao diện sáng và tối được kiểm tra. |
| Console | Không có lỗi console trong luồng học kiểm tra. |

Ảnh browser cuối: [desktop](screenshots/learner-desktop.jpg), [mobile](screenshots/learner-mobile.jpg). Các thao tác học dùng origin QA `127.0.0.1:3000` để giữ riêng bản nháp/tiến độ của origin `localhost:3000`.

## ZIP thực hành

Nút Tải dự án trỏ đến endpoint HTTP theo bài học. Reviewer tải đủ **29/29 ZIP**, đối chiếu **91 authored files** byte-for-byte với catalog, kiểm tra cấu trúc, UTF-8, README, headers và hai ca 404. Báo cáo: [lab-download-review.json](lab-download-review.json).

LFR-4 đã xử lý: `LEARN_RUST.md` có câu hướng dẫn giải nén và mở terminal trong thư mục chứa Cargo.toml. Browser automation không trả được đường dẫn tệp tải xuống trong phép thử download, nên không coi đó là một phép thử download hoàn tất qua giao diện hệ điều hành. Kết luận về archive delivery dựa trên kiểm tra HTTP/ZIP thật; không truy cập lịch sử tải xuống của người dùng.

## Kiểm thử mã và nội dung

| Phép kiểm tra | Kết quả |
| --- | --- |
| Rust solutions | **158/158** biên dịch Rust 2024, chạy assertion và khớp stdout. |
| Cargo labs | **29/29**, tổng **88 host tests**, `cargo test --all-targets`. |
| Source fidelity | Mã băm từng solution và nội dung từng lab khớp bản đã chạy thử. |
| TypeScript | PASS. |
| ESLint 49 file source thay đổi | 0 lỗi, 0 warning; ngoại lệ effect hẹp có lý do trong [lint-review.md](lint-review.md). |
| Content contracts / loader | **16/16**. |
| Progress rollback / raw backup | **4/4**. Giữ ID hợp lệ tạm ẩn; không ghi đè snapshot không đọc được. |
| Native production build | PASS. |
| Docker Node 24 standalone build | PASS. |

Xem [course-validation.json](course-validation.json). Host tests không chứng minh thực thi trên phần cứng embedded, mobile device, browser Wasm, GPU, native window, SVM hoặc quy trình ký/phát hành. Các bước đó được chỉ dẫn trong lab tương ứng và cần môi trường đích.

## Supabase đã xuất bản

- Project: `gsytmwgwitbtqesvjzhm`.
- Release: `50242413-ad42-4336-95ce-6898213bd57a`, revision **1**.
- Catalog SHA-256: `e5c6046dde4197f145360345e42a7cbe3916ab51626324644050b0b6075b2ad2`.
- Đọc lại bằng publishable key: 158 bài, 13 hướng, 29 lab; khớp catalog đã kiểm thử.
- Public chỉ nhìn thấy 1 release đang xuất bản; lịch sử phát hành trả 401. Các phần import trung gian vẫn là bản nháp riêng tư.
- Immutable release, publication revision và history hỗ trợ stage/publish/rollback; cache TTL 30 giây theo tiến trình, không phải cam kết tab mở tự cập nhật.

Báo cáo: [supabase-publication.json](supabase-publication.json). Hướng dẫn: [quản lý nội dung](../docs/course-content.md).

Cấu hình Supabase hiện được truyền vào tiến trình local. Mac AI Coding Tools từ chối ghi `.env.local` vì đây là đường dẫn bị hạn chế; không dùng cách ghi khác để vượt giới hạn. Chủ dự án cần tạo env theo mẫu trước lần khởi động lại. Khóa quản trị không cần thiết cho runtime website.

## SEO và VPS

- Native local: **180 trang**, 158 bài, 13 hướng, 3 dự án; SSR, tiêu đề, H1, description, robots, redirect 308, trang 404 và ảnh chia sẻ 1200×630 đều đạt. Local giữ noindex.
- Docker production configuration: **180 trang**, **178 URL sitemap**, canonical, Open Graph, JSON-LD và bộ kiểm tra HTTP đều đạt.
- Origin `https://learn-rust-review.vn` chỉ là giá trị kiểm tra metadata trong container localhost, không phải tên miền đã triển khai hoặc đã xác minh quyền sở hữu.
- `check-config --production` và `check-course-content` chạy trong container: PASS, nguồn Supabase thật.
- Có Docker/Caddy/Compose và hướng dẫn cấu hình, healthcheck, publish nội dung và rollback. **Chưa deploy VPS** vì chưa có máy chủ/tên miền được chỉ định.

Xem [seo-http-local.json](seo-http-local.json), [seo-http-docker.json](seo-http-docker.json) và [deploy-vps.md](../docs/deploy-vps.md).

## Phạm vi thương mại

Luồng quản trị nội dung và phát hành đã hoạt động trên Supabase. Nội dung hiện công khai. Thanh toán, entitlement bài trả phí, CMS biên tập bằng UI và job đồng bộ tự động chưa được triển khai trong thay đổi này; không diễn giải RLS bản nháp là paywall.
