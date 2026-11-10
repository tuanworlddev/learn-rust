# Triển khai Learn Rust lên VPS

Bộ cấu hình này chạy Next.js bằng Docker, đặt Caddy phía trước để cấp HTTPS và chuyển tiếp yêu cầu. Supabase là dịch vụ bên ngoài, được bật bằng biến môi trường lúc chạy. Web vẫn hoạt động khi chưa cấu hình Supabase.

Chưa có tên miền, VPS hay thông tin Supabase thật trong repository. Hoàn thành các bước dưới đây trên máy chủ của bạn; việc có sẵn cấu hình không có nghĩa ứng dụng đã được triển khai.

## 1. Chuẩn bị máy chủ

- Linux có Docker Engine và Docker Compose v2. Dùng [hướng dẫn cài Docker chính thức](https://docs.docker.com/engine/install/) theo bản phân phối của VPS.
- Tên miền chính thức với bản ghi A trỏ tới IPv4 của VPS. Nếu có bản ghi AAAA, IPv6 cũng phải trỏ đúng và truy cập được.
- Cổng TCP 80, TCP 443 và cổng SSH quản trị phải được nhà cung cấp/VPS cho phép. UDP 443 phục vụ HTTP/3, không bắt buộc để HTTPS qua TCP hoạt động. Kiểm tra các dịch vụ đang chiếm 80/443 trước khi khởi chạy.
- Máy chủ cần kết nối ra ngoài qua HTTPS tới Docker Hub, npm khi build, Rust Playground khi chạy mã và Supabase khi sử dụng đồng bộ. Caddy cần kết nối tới máy chủ cấp chứng chỉ.

Điểm bắt đầu để tự đánh giá là 2 vCPU, 2–4 GB RAM và dung lượng đủ giữ ít nhất hai image phát hành. Đây là ước lượng vận hành, chưa phải kết quả đo tải. Build Next.js có thể cần RAM cao hơn lúc phục vụ. Đo bằng `docker stats`, quan sát thời gian đáp ứng rồi điều chỉnh theo lượng người học.

Caddy công bố 80/443; cổng 3000 của Next.js chỉ nằm trong mạng Docker. Không cần mở 3000 ra Internet. Cấu hình không thay đổi firewall hoặc DNS của VPS. [Next.js khuyến nghị reverse proxy khi tự vận hành](https://nextjs.org/docs/app/guides/self-hosting); [Caddy mô tả yêu cầu DNS, cổng và lưu trữ cho HTTPS](https://caddyserver.com/docs/automatic-https).

## 2. Lấy mã và điền cấu hình

Chạy các lệnh từ thư mục gốc repository:

```bash
git clone https://github.com/tuanworlddev/learn-rust.git
cd learn-rust
cp deploy/env.example deploy/.env
chmod 600 deploy/.env
```

Sửa `deploy/.env` bằng trình soạn thảo trên VPS:

| Biến | Nội dung |
| --- | --- |
| `DOMAIN` | Tên miền thật, chỉ hostname; không có `https://`, cổng hoặc đường dẫn. |
| `SITE_URL` | URL gốc HTTPS dùng chính `DOMAIN`, không có đường dẫn. Đây là URL canonical cho SEO. |
| `SITE_INDEXABLE` | Giữ `false` lúc nghiệm thu; đặt `true` sau khi tên miền công khai chính thức đã sẵn sàng. |
| `APP_VERSION` | Tag image riêng cho lần phát hành, ví dụ mã commit; tránh dùng lại cùng tag cho nhiều bản. |
| `SUPABASE_URL` | Project URL; để trống nếu chưa dùng tài khoản. |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key cùng project; để trống nếu chưa dùng tài khoản. |
| `SUPABASE_ANON_KEY` | Chỉ cần cho legacy anon key nếu không dùng publishable key. |

Đặt `APP_VERSION` theo `git rev-parse --short HEAD` giúp đối chiếu image với mã nguồn. Giữ lại tag đang chạy trước khi đổi sang bản mới. Không sử dụng secret key hoặc service role key cho ứng dụng web. Làm theo [thiết lập Supabase](./supabase.md) để tạo schema, chính sách RLS và cấu hình Auth trước khi bật đồng bộ.

`deploy/.env` đã nằm trong quy tắc bỏ qua `.env*` của Git và bị loại khỏi Docker build context. `deploy/env.example` là mẫu được theo dõi trong Git. Biến trong shell có thể ghi đè biến cùng tên từ `--env-file`; nếu kết quả không đúng dự kiến, kiểm tra các biến đã export ở terminal. [Tài liệu Compose về `--env-file` và thứ tự nội suy](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/) giải thích chi tiết.

## 3. Kiểm tra và build

Nếu máy đang có Node.js 22.13 trở lên, kiểm tra định dạng cấu hình trước:

```bash
node --env-file=deploy/.env scripts/check-config.mjs --production
```

Không cần cài Node trên VPS khi dùng Docker. Container cũng chạy cùng bước kiểm tra này trước khi khởi động web. Bộ kiểm tra không in khóa và không gửi dữ liệu ra mạng; nó kiểm tra tên miền, URL, cờ SEO và cặp cấu hình Supabase. Kiểm tra qua được không chứng minh DNS, RLS hoặc thông tin đăng nhập đã đúng.

```bash
docker compose version
docker compose --env-file deploy/.env config --quiet
docker compose --env-file deploy/.env build --pull app
docker compose --env-file deploy/.env run --rm --no-deps app node scripts/check-config.mjs --production
docker compose --env-file deploy/.env run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
```

`config --quiet` kiểm tra Compose mà không in toàn bộ biến môi trường. Compose dừng ngay nếu thiếu `DOMAIN` hoặc `SITE_URL`. Nếu trường không đúng định dạng, kiểm tra trong image sẽ trả lỗi có hướng dẫn sửa.

Image dùng [Node 24 Bookworm slim chính thức](https://hub.docker.com/_/node), cài đúng lockfile bằng `npm ci` từ registry npm chính thức và chạy `npm run build:local`. Bản chạy chỉ mang output standalone, static assets, font và script kiểm tra; không chứa Rust lab, Docker daemon, compiler Rust hoặc file môi trường. App chạy bằng user `node`, không dùng root. [Next.js standalone](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) yêu cầu chép riêng `public` và `.next/static`; Dockerfile đã xử lý hai thư mục này.

Supabase và `SITE_URL` được đọc khi chạy; không truyền chúng thành Docker build args hoặc `NEXT_PUBLIC_*`. Đổi cấu hình không cần build lại image, nhưng cần tạo lại container `app`.

## 4. Khởi chạy và nghiệm thu

```bash
docker compose --env-file deploy/.env up -d --no-build
docker compose --env-file deploy/.env ps
docker compose --env-file deploy/.env logs --tail=100 app caddy
```

Caddy chỉ bắt đầu sau khi app báo healthy. [Điều kiện `service_healthy` của Compose](https://docs.docker.com/compose/how-tos/startup-order/) điều phối lúc khởi chạy; trạng thái unhealthy sau đó không tự tạo cơ chế tự khôi phục ứng dụng. Chính sách restart chỉ xử lý tiến trình bị dừng. Khi kiểm tra DNS/HTTPS chưa thành công, xem log Caddy trước khi thử cấp chứng chỉ nhiều lần.

Kiểm tra web từ máy bên ngoài VPS bằng tên miền thật:

- `/api/health` trả HTTP 200 với `{"status":"ok"}`. Endpoint này chỉ xác nhận web đang phản hồi, không gọi Supabase hoặc Rust Playground.
- Trang chủ và một URL bài học mở trực tiếp được, font/CSS/JavaScript tải thành công, sáng/tối hoạt động.
- Chạy một đoạn Rust đơn giản, sửa thành chương trình lỗi và kiểm tra phản hồi phù hợp.
- Nếu bật Supabase: đăng nhập, đồng bộ tiến độ và tải lại trên trình duyệt khác; hoàn tất kiểm tra RLS theo tài liệu Supabase.
- `/robots.txt`, `/sitemap.xml` và canonical trong HTML dùng đúng tên miền. Khi còn `SITE_INDEXABLE=false`, kiểm tra trạng thái chặn lập chỉ mục theo thiết kế.

Sau nghiệm thu, sửa `SITE_INDEXABLE=true`, rồi áp dụng lại app:

```bash
docker compose --env-file deploy/.env up -d --no-build --force-recreate app
```

Kiểm tra lại robots, sitemap và canonical trên HTTPS. Cờ noindex là hướng dẫn cho công cụ tìm kiếm, không phải đăng nhập hoặc kiểm soát truy cập. Với môi trường thử nghiệm cần riêng tư, dùng lớp kiểm soát truy cập của hạ tầng.

## 5. Cập nhật và quay lại bản trước

Ghi lại tag của image đang chạy bằng lệnh chỉ xem image:

```bash
docker compose --env-file deploy/.env images
git pull --ff-only
git rev-parse --short HEAD
```

Sửa `APP_VERSION` trong `deploy/.env` thành mã của commit mới, giữ lại tag cũ. Sau đó:

```bash
docker compose --env-file deploy/.env build --pull app
docker compose --env-file deploy/.env run --rm --no-deps app node scripts/check-config.mjs --production
docker compose --env-file deploy/.env up -d --no-build
docker compose --env-file deploy/.env ps
```

Nếu sửa `deploy/Caddyfile`, xác thực rồi tạo lại Caddy để bảo đảm bản mount đã nhận file mới:

```bash
docker compose --env-file deploy/.env run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker compose --env-file deploy/.env up -d --no-build --force-recreate caddy
```

Để quay lại, sửa `APP_VERSION` về tag đã hoạt động rồi chạy:

```bash
docker compose --env-file deploy/.env up -d --no-build app
docker compose --env-file deploy/.env ps
```

Image cũ phải còn trên VPS hoặc có trong registry riêng. Không xóa các image phát hành còn trong thời gian cần rollback. Rollback image không hoàn tác thay đổi dữ liệu hoặc schema Supabase; chỉ triển khai migration tương thích hoặc có phương án khôi phục riêng. Cấu hình hiện tại dùng một app container nên có thể gián đoạn ngắn khi thay phiên bản; chưa có chuyển phiên bản không gián đoạn.

Các tag nền `node:24-bookworm-slim` và `caddy:2-alpine` nhận cập nhật trong nhánh tương ứng. Với quy trình cần tái tạo image tuyệt đối, lưu image đã kiểm thử theo tag phát hành và pin digest của image nền/Caddy khi chốt bản. Kiểm tra image mới trước khi cập nhật production.

## 6. Dữ liệu và sao lưu

Hai named volume `learn-rust_caddy_data` và `learn-rust_caddy_config` giữ dữ liệu HTTPS/cấu hình của Caddy qua các lần tạo lại container. Sao lưu chúng bằng cơ chế backup volume của hạ tầng; `/data` chứa cả khóa chứng chỉ nên giới hạn người truy cập và mã hóa bản sao lưu. Không dùng `docker compose down --volumes` trong quy trình cập nhật bình thường. [Image Caddy chính thức](https://hub.docker.com/_/caddy) giải thích yêu cầu lưu bền `/data` và cách giữ các volume.

Tiến độ chưa đồng bộ nằm trên trình duyệt người học. Khi bật Supabase, dữ liệu tài khoản và đồng bộ ở project Supabase, không ở hai volume Caddy. Cấu hình backup database, retention và thử khôi phục trong Supabase riêng; lưu bản migration cùng mã nguồn. Giữ bản sao bảo mật của `deploy/.env`, tên miền/DNS và tag image phát hành để có thể khôi phục một VPS mới.

## 7. Dịch vụ thực thi Rust và dữ liệu

[Route thực thi hiện tại](../app/api/execute/route.ts) nhận mã từ trình duyệt, kiểm tra kích thước, rồi gửi đến `https://play.rust-lang.org/execute`. Compiler không chạy trên VPS này. Route chọn stable, edition 2024, binary crate, debug; giới hạn mã 40.960 byte, request 60.000 byte và thời gian chờ upstream 25 giây. Không có stdin tương tác trong luồng API hiện tại.

Mã được chuyển tới dịch vụ bên ngoài nên thông tin về bên xử lý này thuộc tài liệu vận hành/chính sách quyền riêng tư của website. Chủ website cần công bố luồng xử lý dữ liệu phù hợp với cách vận hành thực tế; không cam kết lưu trữ, xóa dữ liệu hoặc SLA thay cho Rust Playground. Route không chủ động ghi nội dung mã vào log; khi bổ sung monitoring, tránh ghi request body hoặc token. Repository [Rust Playground chính thức](https://github.com/rust-lang/rust-playground) là điểm tham chiếu cho dịch vụ và khả năng tự vận hành.

Giới hạn kích thước và timeout chưa phải rate limiting toàn hệ thống. Trước khi phục vụ lưu lượng lớn, đo tải và cấu hình rate limit tại CDN/reverse proxy hoặc bổ sung bộ thực thi được cô lập phù hợp. Cấu hình Caddy hiện tại không cài plugin rate limit. Tình trạng Playground không làm `/api/health` thất bại; theo dõi riêng tỷ lệ lỗi của `/api/execute` để phân biệt web sống và chức năng chạy mã hoạt động.

## 8. Chẩn đoán nhanh

| Hiện tượng | Kiểm tra |
| --- | --- |
| Compose báo thiếu `DOMAIN`/`SITE_URL` | Đang đứng ở thư mục gốc; dùng đúng `--env-file deploy/.env`; đã điền cả hai trường. |
| App thoát ngay khi khởi chạy | Xem `logs app`, chạy lại `scripts/check-config.mjs --production`; sửa định dạng cấu hình. |
| Caddy chưa có HTTPS | DNS A/AAAA, firewall/port mapping 80/443, dịch vụ khác chiếm cổng, log Caddy và quyền ghi volume. |
| HTTP 502 | `docker compose ... ps` và log app; healthcheck trong app có trả 200 không. |
| Không hiện tài khoản/đồng bộ | Kiểm tra cặp env Supabase, tạo lại app container, chạy script kiểm tra Supabase và kiểm tra RLS. |
| Chạy Rust lỗi nhưng trang vẫn mở | Kết nối HTTPS ra Rust Playground, timeout hoặc dịch vụ upstream; không dùng healthcheck để kết luận compiler hoạt động. |
| Canonical/sitemap sai domain | `SITE_URL`, biến shell ghi đè, app container cũ chưa được tạo lại. |

Chỉ chia sẻ phần log cần thiết khi xử lý lỗi; `docker inspect`, `docker compose config` không có `--quiet` hoặc việc in toàn bộ môi trường có thể chứa cấu hình triển khai.
