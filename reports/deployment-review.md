# Rà soát cấu hình triển khai VPS

Ngày rà soát: 2026-11-10.

## Phạm vi

Chuẩn bị một Next.js standalone container đặt sau Caddy, cấu hình runtime cho SEO/Supabase và tài liệu vận hành. Không truy cập VPS, thay DNS, cấp chứng chỉ thật, tạo project Supabase hoặc thực hiện migration bên ngoài trong lượt chuẩn bị này.

## Quyết định cấu hình

| Hạng mục | Cách xử lý |
| --- | --- |
| Build | Multi-stage Docker, Node 24 Bookworm slim, `npm ci` với lockfile từ registry npm chính thức, `npm run build:local`. |
| Runtime | Standalone `server.js`, user `node`, `0.0.0.0:3000`, static assets/font chép riêng. |
| Mạng | App chỉ expose 3000 trong Docker. Caddy công bố TCP 80/443 và UDP 443. |
| HTTPS | Caddy theo `DOMAIN`, giữ `/data` và `/config` trong named volume. Không cung cấp tên miền giả làm giá trị mặc định. |
| Cấu hình | `deploy/env.example` để điền; `.env*` bị Git/Docker bỏ qua; không có credential build args. |
| Kiểm tra trước khởi động | Checker không dùng mạng, không in giá trị khóa; kiểm tra domain/URL/SEO và helper Supabase dùng chung. |
| SEO | `SITE_URL` HTTPS phải trùng DOMAIN; `SITE_INDEXABLE=false` mặc định lúc nghiệm thu. |
| Healthcheck | `/api/health` chỉ trả trạng thái app; không kiểm tra tài khoản, database hoặc compiler. |
| Cập nhật | Tag image theo commit, giữ image cũ, hướng dẫn rollback và phân biệt rollback schema. |
| Mã Rust | API phụ thuộc Rust Playground; luồng dữ liệu, giới hạn và vận hành nằm trong docs thay vì nhãn cố định trong bài học. |

## Kiểm tra thực hiện

- `node --check scripts/check-config.mjs`: cú pháp hợp lệ trên Node 24.22.1.
- 21/21 tình huống cấu hình qua: local không có env; production thiếu env; Supabase tắt; bật/tắt SEO; cờ boolean sai; HTTP/URL có đường dẫn hoặc tài khoản; domain lệch, giả, IP hoặc kèm cổng; Supabase thiếu cặp, publishable/anon key, secret/service_role key và fallback không an toàn; Supabase HTTP loopback local/production; tùy chọn CLI sai.
- Các tình huống dùng khóa giả lập tại chỗ; stdout/stderr không chứa giá trị khóa hay thông tin xác thực được đưa vào. Không gọi mạng hoặc xác nhận khóa thật trong kiểm tra này.
- YAML Compose parse được; kiểm tra app không có host port, chỉ expose 3000, Caddy công bố đúng 80/443, đợi `service_healthy`, có hai named volume, mặc định noindex và không có build args chứa cấu hình Supabase.
- Gọi trực tiếp handler `GET /api/health`: trả đúng 200, JSON `{"status":"ok"}`, `Cache-Control: no-store` và `X-Robots-Tag: noindex`. Đây là kiểm tra hợp đồng handler, chưa phải kiểm tra HTTP qua container.

Môi trường biên tập không có Docker/Caddy executable nên chưa xác nhận build image, khởi động Compose hoặc cấp TLS thật tại đây. Các bước xác thực container/HTTPS phải chạy trên máy có Docker và domain đã cấu hình; không suy diễn kết quả YAML thành kết quả triển khai.

Đã bổ sung `scripts/test-supabase-rls.sh` và `supabase/tests/learning_progress_rls.sql` để chạy 41 assertion trên PostgreSQL 17 dùng riêng cho kiểm thử. Script tạo container không có mạng, host port hoặc volume bền, dùng tmpfs và dọn container khi kết thúc. Nó áp dụng migration thật sau các stub `auth.users`/`auth.uid()` để kiểm tra RLS, ràng buộc snapshot, timestamp và cập nhật có điều kiện; không kiểm chứng Auth/JWT, email hay API gateway Supabase thật. Cú pháp Bash và lượt chạy Docker 41/41 đã đạt ở phần nghiệm thu tích hợp bên dưới.

## Nghiệm thu trên Mac sau tích hợp

- Docker daemon 29.4.3; image `learn-rust:review-20261110` build thành công từ Dockerfile cuối, có Next standalone, static assets, font và hai script kiểm tra vận hành.
- Container chạy user `node`, healthcheck đạt `healthy`, `/api/health` trả 200/no-store. Cổng thử nghiệm chỉ bind `127.0.0.1:3035`.
- Chạy HTTP SEO trên container: 88 trang đạt, 80 bài và 3 dự án truy cập trực tiếp, 86 URL sitemap khi bật indexing bằng domain fixture; 404/308, metadata, JSON-LD và ảnh PNG đúng.
- `docker compose config --quiet`: đạt. Caddy official image chạy `caddy validate` với cấu hình và network none: **Valid configuration**; không cấp chứng chỉ hoặc liên hệ ACME thật.
- `node --test lib/supabase/validation.test.mjs`: **6/6 đạt**.
- `bash scripts/test-supabase-rls.sh`: **41/41 assertion đạt** trên `postgres:17-bookworm`, gồm phân quyền A/B, anonymous, bounds, timestamp đơn điệu và CAS. Container test đã được dọn.
- Checker Supabase trong app container hoạt động và xác nhận integration tắt khi không có env; không thực hiện request trong trạng thái này.
- Local production chạy bằng `scripts/start-local.mjs`: chép static/public vào standalone, đọc env project qua @next/env và chỉ bind loopback. Đã kiểm tra 88 trang trên launcher này.

Các kiểm tra dùng fixture tại chỗ. Chưa có DNS/domain, chứng chỉ hoặc project Supabase thật của người dùng.

## Điều kiện còn cần trước khi công khai

- Tên miền thật, DNS và VPS có Docker/Compose; kiểm tra cổng 80/443 từ bên ngoài.
- Build image và smoke test trên kiến trúc VPS; app healthy, static assets/URL bài học/chạy Rust hoạt động.
- Nếu bật tài khoản: cấu hình Supabase thật, chạy migration, cấu hình Auth và xác minh RLS bằng các tài khoản kiểm thử.
- Nghiệm thu URL canonical/robots/sitemap trên domain rồi đặt `SITE_INDEXABLE=true`.
- Lưu tag image, cấu hình triển khai và backup dữ liệu; đo tải trước khi kết luận khả năng phục vụ nhiều người dùng.

## Tài liệu gốc đã đối chiếu

- [Next.js self-hosting: reverse proxy và biến môi trường runtime](https://nextjs.org/docs/app/guides/self-hosting).
- [Next.js output standalone: server.js, public/static, PORT/HOSTNAME](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).
- [Docker Compose: nội suy, biến bắt buộc và --env-file](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/).
- [Docker Compose: thứ tự khởi chạy và service_healthy](https://docs.docker.com/compose/how-tos/startup-order/).
- [Node Docker official image](https://hub.docker.com/_/node).
- [Caddy automatic HTTPS](https://caddyserver.com/docs/automatic-https).
- [Caddy reverse_proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy).
- [Caddy Docker official image: persistence và mount](https://hub.docker.com/_/caddy).
