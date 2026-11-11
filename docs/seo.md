# Cấu hình SEO

Website dùng URL thật cho từng bài, metadata theo trang, sitemap và ảnh chia sẻ PNG. Chưa có tên miền sản xuất được chọn trong repository. Thực hiện triển khai theo [hướng dẫn VPS](./deploy-vps.md), sau đó kiểm tra các bước dưới đây trên tên miền của bạn.

## 1. Cấu hình lúc nghiệm thu

Điền `deploy/.env` từ mẫu `deploy/env.example`:

| Biến | Giá trị cần điền |
| --- | --- |
| `DOMAIN` | Hostname công khai do bạn sở hữu, không có giao thức hoặc đường dẫn. |
| `SITE_URL` | URL gốc HTTPS của đúng `DOMAIN`, không có query/hash hoặc cổng riêng. |
| `SITE_INDEXABLE` | `false` trong thời gian nghiệm thu. |

Chạy từ thư mục repository:

```bash
node --env-file=deploy/.env scripts/check-config.mjs --production
docker compose --env-file deploy/.env config --quiet
```

Nếu VPS chỉ có Docker, có thể chạy bước kiểm tra trong image đã build:

```bash
docker compose --env-file deploy/.env run --rm --no-deps app node scripts/check-config.mjs --production
```

Khi còn `false`, các trang có noindex, sitemap rỗng và robots chưa công bố sitemap. Robots vẫn cho phép đọc HTML để crawler thấy noindex, theo [hướng dẫn của Google](https://developers.google.com/search/docs/crawling-indexing/block-indexing). Nếu thiếu `SITE_URL`, ứng dụng không tự tạo canonical bằng localhost hay một tên miền giả.

## 2. Bật trên tên miền chính thức

Sau khi DNS, HTTPS và nội dung trên domain chính đã được nghiệm thu, sửa `SITE_INDEXABLE=true` trong `deploy/.env`, rồi tạo lại container app:

```bash
docker compose --env-file deploy/.env up -d --no-build --force-recreate app
```

Biến được đọc lúc chạy; không cần build lại image chỉ để đổi cờ SEO. Hostname nội bộ, IP, domain ví dụ hoặc URL không đạt định dạng công khai sẽ không được phép bật lập chỉ mục.

Với catalog mở rộng đầy đủ, sitemap có **373 URL**: danh mục Bài học, Kiến thức nền tảng, 13 khóa chuyên sâu, 314 bài, một trang danh sách Dự án, 42 trang dự án và Phỏng vấn. `/thuc-hanh`, `/so-tay` và 13 trang đánh giá năng lực vẫn noindex và không nằm trong sitemap; file ZIP có `X-Robots-Tag: noindex`. Tổng cộng có **388 trang HTML chuẩn**. `/chuyen-sau` chuyển 308 về `/`; `/chuyen-sau/<id>` chuyển 308 về `/khoa-hoc/<id>`. Các URL bài học cũ được giữ nguyên. Số URL được tính từ catalog đang xuất bản, không gắn cứng vào dữ liệu đi kèm code.

## 3. Kiểm tra HTTP và metadata

Thay URL ví dụ bên dưới bằng đúng `SITE_URL` của bạn. `learn-rust.example.com` chỉ là placeholder, không phải tên miền triển khai.

```bash
LEARN_RUST_URL="https://learn-rust.example.com"
curl -fsS "$LEARN_RUST_URL/robots.txt"
curl -fsS "$LEARN_RUST_URL/sitemap.xml"
curl -fsS "$LEARN_RUST_URL/bai-hoc/ownership" -o /tmp/learn-rust-lesson.html
rg -o '<title>[^<]+|<link[^>]*rel="canonical"[^>]*>|<meta[^>]*name="robots"[^>]*>' /tmp/learn-rust-lesson.html
curl -fsS "$LEARN_RUST_URL/opengraph-image" -o /tmp/learn-rust-og.png
file /tmp/learn-rust-og.png
curl -sSI "$LEARN_RUST_URL/di-lam"
curl -sS -o /dev/null -w '%{http_code}\n' "$LEARN_RUST_URL/bai-hoc/khong-ton-tai"
```

Sau khi bật index, bài `ownership` cần có title đúng bài, `index, follow` và canonical trỏ về cùng URL HTTPS. Ảnh chia sẻ cần là PNG 1200 × 630. `/di-lam` cần redirect 308 sang `/phong-van`; bài không tồn tại cần trả 404. Các lệnh chỉ tải phản hồi, không gửi website tới công cụ tìm kiếm.

Script kiểm toàn bộ catalog lấy URL bài/khóa/dự án từ HTML đang phục vụ. Với local chưa cấu hình `SITE_URL` và chưa bật index:

```bash
npm run check:seo -- --base http://127.0.0.1:3000 --output reports/seo-local-current.json
```

Đối với tên miền đang nghiệm thu với `SITE_INDEXABLE=false`, dùng URL đã đặt trong `LEARN_RUST_URL` ở trên:

```bash
npm run check:seo -- --base "$LEARN_RUST_URL" --canonical "$LEARN_RUST_URL" --output reports/seo-domain-current.json
```

Sau khi thực sự bật `SITE_INDEXABLE=true`, thêm `--indexable` vào lệnh tên miền. Script không tự đọc `SITE_URL`/`SITE_INDEXABLE` để suy ra tham số; `--base` là nơi gửi HTTP, `--canonical` là origin kỳ vọng trong metadata, còn `--indexable` là chính sách kỳ vọng. Nếu local dùng cổng khác, đổi `--base`; không bật index để làm phép thử local đạt. Báo cáo mới phải khớp catalog đang phục vụ, không dùng kết quả 80/158 bài cũ để xác nhận bản 314 bài.


## 4. Gửi sitemap trong Search Console

1. Mở [Google Search Console](https://search.google.com/search-console/), thêm property cho domain chính và xác minh quyền sở hữu. Domain property dùng xác minh DNS; làm theo [hướng dẫn xác minh chính thức](https://support.google.com/webmasters/answer/9008080).
2. Khi `SITE_INDEXABLE=true` và sitemap truy cập công khai được, mở **Sitemaps**, nhập URL `https://<domain-cua-ban>/sitemap.xml` rồi gửi. Theo dõi trạng thái và lỗi trong [báo cáo Sitemaps](https://support.google.com/webmasters/answer/7451001).
3. Dùng **URL Inspection** cho trang chủ và một URL bài học. Kiểm tra Google có lấy được trang, thấy đúng canonical và không còn noindex trên trang công khai. [Hướng dẫn URL Inspection](https://support.google.com/webmasters/answer/9012289/).

Không cần tạo sitemap thủ công khi thêm bài vào dữ liệu khóa học: ứng dụng sinh danh sách từ catalog đang dùng và projects. Khi chọn Supabase, title, canonical, JSON-LD và sitemap đều theo bản nội dung đã xuất bản. Khi thay đổi route, giữ redirect cho URL cũ và kiểm tra lại bản phát hành.

Gửi sitemap không bảo đảm Google sẽ thu thập hoặc lập chỉ mục mọi URL; cấu hình này cũng không cam kết thứ hạng. [Google giải thích vai trò của sitemap tại đây](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

Kết quả kiểm tra nguồn trước đây ở [báo cáo SEO](../reports/seo-review.md); trạng thái đợt mở rộng và bằng chứng SEO cuối được tổng hợp trong [báo cáo nghiệm thu](../reports/course-expansion/acceptance.md).
