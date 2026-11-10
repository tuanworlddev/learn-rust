# Learn Rust — nội dung, Supabase, VPS và SEO

Ngày nghiệm thu local: 2026-11-10 UTC.

## Kết quả

| Phần việc | Kết quả |
| --- | --- |
| Nội dung giao diện | Điều hướng Phỏng vấn; bỏ provider/footer, các đoạn hướng dẫn thừa được yêu cầu và thông báo lặp. Giữ lý thuyết, yêu cầu bài, lỗi thực tế và kết quả kiểm tra mẫu. |
| SEO | 80 bài có URL và HTML riêng; 88 route hợp lệ có title duy nhất; 86 URL sitemap khi public indexing được bật. Có canonical, robots, Open Graph/Twitter, JSON-LD, ảnh chia sẻ PNG. |
| Tiến độ | Mở trực tiếp bài vẫn nhớ Học tiếp; lỗi đọc tiến độ không tự ghi đè dữ liệu gốc. Giữ storage key cũ. |
| Supabase | Runtime config tùy chọn; Email Auth/PKCE; lưu và khôi phục có xác nhận; chống ghi đè đồng thời; SQL migration/RLS và tài liệu cấu hình. |
| VPS | Docker standalone Node 24, user node, healthcheck, Compose mạng nội bộ, Caddy HTTPS và tài liệu cập nhật/rollback. |

## Kiểm tra đã chạy

- Production build/TypeScript trên Mac: đạt.
- Production build trong Docker: đạt; chạy container healthy bằng user `node`.
- HTTP SEO local/standalone: **88/88 trang**, noindex khi chưa có cấu hình tên miền.
- HTTP SEO container với origin fixture và indexing=true: **88/88 trang**, **86 URL sitemap**.
- Supabase helper validation: **6/6 test đạt**.
- PostgreSQL 17 cô lập: **41/41 assertion** về RLS, constraints, timestamp và optimistic concurrency đạt.
- Compose config và Caddy validate: đạt.
- ESLint các file mới về SEO, Supabase, route và script cấu hình: đạt. Đây không phải tuyên bố toàn bộ repo không còn lint; review copy ghi lại quy tắc set-state-in-effect ở các component localStorage có sẵn.
- Chrome desktop sáng/tối; mobile 390 px; menu, lọc câu hỏi, tìm kiếm/Escape, Học tiếp và focus main: hoạt động, không tràn ngang hoặc lỗi console quan sát được.
- Ví dụ Rust mặc định chạy thật qua UI và trả đúng hai dòng kết quả.

Chi tiết: [copy-review.md](copy-review.md), [seo-review.md](seo-review.md), [deployment-review.md](deployment-review.md), [seo-local-validation.json](seo-local-validation.json), [seo-container-validation.json](seo-container-validation.json).

## Phần người vận hành cần cấu hình

1. Điền domain/URL HTTPS thật vào bản sao `deploy/env.example`, giữ noindex khi nghiệm thu.
2. Nếu dùng tài khoản, tạo project Supabase, áp dụng migration và cấu hình Email Auth/SMTP/redirect cùng Project URL và publishable key theo [hướng dẫn](../docs/supabase.md).
3. Triển khai theo [hướng dẫn VPS](../docs/deploy-vps.md), kiểm tra DNS/HTTPS/domain và bật indexing khi công khai.

Chưa triển khai VPS hoặc tạo/cấu hình Supabase thật. Chưa kiểm tra gửi email, đăng nhập hai tài khoản qua Supabase API thật hay Search Console. Bản lưu tài khoản chứa tiến độ và ghi chú chính; bản nháp mã và bằng chứng phỏng vấn vẫn ở trình duyệt, không có tự động hợp nhất nhiều thiết bị. Bộ kiểm tra Postgres xác minh chính sách database với auth stubs trong container tạm, không xác minh Supabase Auth/JWT/email.
