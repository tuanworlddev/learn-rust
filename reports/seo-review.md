# Rà soát SEO, đường dẫn và dữ liệu học tập

Ngày rà soát: 2026-11-10 UTC.

## Trạng thái

Đã kiểm tra mã nguồn, chạy các hàm nhận diện trang/metadata và render phía server các component đại diện. Những lỗi ghi nhận dưới đây đã được sửa và đọc lại trong nguồn. Kiểm tra bản dựng Next.js đầy đủ, HTTP và tương tác trên Mac đang chờ agent tích hợp bổ sung kết quả vào cuối báo cáo.

Chưa có tên miền sản xuất, VPS hoặc Search Console property thật được cung cấp. Các hostname dùng trong kiểm tra hàm chỉ là dữ liệu thử, không phải tên miền được chọn cho website.

## 1. Phạm vi URL

Nguồn: `lib/routes.ts`, `lib/seo.ts`, `app/page.tsx`, `app/[...path]/page.tsx`.

| Nhóm | Đường dẫn | Số trang | Được đưa vào sitemap khi bật lập chỉ mục |
| --- | --- | ---: | --- |
| Mục lục | `/` | 1 | Có |
| Bài học | `/bai-hoc/{id}` | 80 | Có |
| Danh sách dự án | `/du-an` | 1 | Có |
| Dự án thực hành | `/du-an/{id}` | 3 | Có |
| Phỏng vấn | `/phong-van` | 1 | Có |
| Trình thực hành | `/thuc-hanh` | 1 | Không; `noindex, follow` |
| Sổ tay cá nhân | `/so-tay` | 1 | Không; `noindex, follow` |
| **Tổng** | | **88 trang HTML chuẩn** | **86 URL có thể lập chỉ mục** |

`indexableRoutes()` đã chạy và trả **86 URL, không trùng lặp**. Đây là số liệu từ mã nguồn, chưa phải khẳng định Google đã lập chỉ mục. Kế hoạch HTTP kiểm tra 88 trang HTML chuẩn; các redirect, URL sai, API, robots, sitemap và ảnh OG được kiểm tra riêng.

Đã gọi `pageMetadata()` cho cả **88 route hợp lệ và nhận 88 title khác nhau**. Không có title trùng giữa trang chủ, bài học, ba dự án và các trang công cụ. Title trang chủ là “Học Rust bằng tiếng Việt · Learn Rust”; title ba dự án lần lượt là “Sổ tay chi tiêu · Learn Rust”, “Khám phá một đoạn văn · Learn Rust” và “Một ngày có kế hoạch · Learn Rust”.

Đường dẫn cũ `/di-lam` được chuyển vĩnh viễn sang `/phong-van`; `/lo-trinh` và `/tong-quan` về `/`. Shell tiếp tục nhận các hash cũ như `/#bai-hoc/ownership`, `/#di-lam`, `/#thuc-hanh` và thay bằng URL chuẩn qua router. Hash không thuộc danh sách route được giữ làm anchor thông thường.

## 2. SSR và liên kết có thể được thu thập

`LearningPage` truyền `initialRoute` từ server vào `LearningApp`. Nội dung trang không bị chặn sau cờ `ready`, nên URL bài học có thể trả nội dung tương ứng trong HTML ban đầu.

Kiểm tra đã thực hiện:

- Render server component bài `ownership`: H1 đúng “Ownership: Ai sở hữu dữ liệu?”, có đoạn lý thuyết đầu tiên và trình soạn thảo trong HTML.
- Render mục lục: có **80 thẻ liên kết `href="/bai-hoc/..."`**.
- Render trang phỏng vấn: H1 “Phỏng vấn Rust”, có **30 câu hỏi** trong HTML.
- Những đoạn “Biên dịch qua…” và “Mỗi ví dụ có bản nháp riêng…” không còn trong HTML bài học được kiểm tra.
- Đã đọc việc chuyển header, sidebar, mục lục và liên kết dự án sang `next/link`; chúng tạo URL thật. CareerHub có liên kết `<a>` đến các bài nền tảng.

Các thao tác nội bộ như chọn tab, chạy mã và mở câu hỏi vẫn là button. Nút trước/sau bài học vẫn dùng router; từng bài đã có liên kết riêng trong mục lục/sidebar nên không phụ thuộc những button này để được tìm thấy.

Render trên đây dùng React server renderer cho component, không thay thế kiểm tra HTTP/hydration của toàn ứng dụng. Tại thời điểm rà soát, môi trường cloud chưa cài SDK Supabase mới; bản dựng đầy đủ trên Mac do agent tích hợp kiểm tra.

## 3. Metadata, sitemap và dữ liệu có cấu trúc

Nguồn: `lib/seo.ts`, `lib/site-config.ts`, `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `components/learning-page.tsx`, `next.config.ts`.

| Kiểm tra hàm đã chạy | Kết quả |
| --- | --- |
| Không có `SITE_URL` | Không sinh canonical giả; trang ở trạng thái noindex. |
| HTTPS hostname hợp lệ, `SITE_INDEXABLE=false` | Bài học noindex; canonical dùng đúng origin cấu hình. |
| HTTPS hostname hợp lệ, `SITE_INDEXABLE=true` | Bài học được phép index; Sổ tay vẫn noindex. |
| Localhost hoặc hostname dành làm ví dụ | Không cho phép bật lập chỉ mục. |
| Các route kế thừa từ Object như `constructor`, `toString`, `__proto__` | `getPageInfo()` trả null sau sửa. |

Kiểm tra nguồn xác nhận:

- Tiêu đề và mô tả lấy theo từng bài/dự án. Canonical bỏ query/hash, dùng URL chuẩn từ `routeHref()`.
- Cấu hình được đọc lúc chạy. `SITE_INDEXABLE` chỉ có hiệu lực với HTTPS, hostname công khai hợp lệ, cổng HTTPS mặc định; IP, tên miền nội bộ và tên miền ví dụ bị loại.
- Sitemap rỗng khi chưa đủ cấu hình hoặc còn noindex; khi bật, chỉ chứa 86 URL công khai chuẩn.
- Robots cho phép đọc HTML, chặn `/api/`; chỉ công bố sitemap khi site được phép index. Không chặn toàn bộ HTML ở preview, để crawler còn đọc được thẻ noindex. Đây là cách phù hợp với [hướng dẫn noindex của Google](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
- `htmlLimitedBots: /.*/` yêu cầu metadata ở head trước khi gửi nội dung cho mọi user agent; [Next.js ghi rõ lựa chọn này tắt metadata streaming](https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots).
- JSON-LD gồm Course trên mục lục, BreadcrumbList và LearningResource ở trang thích hợp. Nội dung JSON được escape ký tự `<` trước khi đặt vào script. Không có rating, chứng chỉ hoặc thông tin đánh giá được bịa thêm.
- 404 dùng `notFound()`, không biến đường dẫn không tồn tại thành trang khóa học. HTTP status và robots của 404 còn nằm trong lượt kiểm tra thực tế.

## 4. Ảnh chia sẻ

Nguồn: `app/opengraph-image/route.tsx`.

- Endpoint `/opengraph-image` dùng `ImageResponse` của Next.js; định dạng phản hồi là PNG, kích thước khai báo **1200 × 630**.
- Dùng font `public/fonts/OpenSans-Semibold.ttf`; đã xác nhận tệp có trong nguồn.
- Open Graph và Twitter metadata trỏ đến ảnh bằng origin cấu hình, không hardcode tên miền sản xuất.
- Nội dung ảnh dùng tên Learn Rust và tiếng Việt.

**Chờ kiểm tra thực tế:** HTTP 200, `Content-Type: image/png`, chữ tiếng Việt không mất dấu/cắt dòng và ảnh đi kèm bản standalone/Docker. Chưa ghi nhận việc chia sẻ thử trên mạng xã hội.

## 5. Lỗi phát hiện và sửa trong review

| Vấn đề | Sửa trong nguồn | Xác minh hiện tại |
| --- | --- | --- |
| `staticPages[route]` nhận thuộc tính kế thừa, có thể trả tiêu đề `undefined` và soft 404 | Kiểm tra own property trước khi đọc route | Đã chạy lại hàm: `constructor`, `toString`, `__proto__` đều bị từ chối; HTTP 404 đã kiểm tra. |
| Focus chỉ đổi khi ref `previousRoute` đã tồn tại, trong khi page có thể remount khi chuyển route | Focus main theo `ready` và `route` | Đã đọc fix; focus main đã xác minh trong Chrome. |
| Bài đang học chỉ được nhớ khi click link | Ghi `lastLesson` sau khi route bài học đã hydrate | Đã đọc fix; direct URL, hash cũ và Học tiếp đã kiểm tra; chưa có bộ test mở nhiều tab. |
| Đọc/parse localStorage thất bại nhưng vẫn autosave trạng thái trắng | `progressLoadError` chặn autosave; giữ chuỗi gốc để tải bản sao; reset/restore rõ ràng mới mở lại lưu | Đã đọc điều kiện và luồng export/reset/restore; kiểm tra giả lập JSON hỏng/read error đang chờ. |

Các thay đổi tiến độ không đổi storage key cũ, do đó không chủ động xóa tiến độ hoặc bản nháp hiện có. Dữ liệu bản nháp nằm ở CodeLab; dữ liệu đánh giá nằm ở CareerHub. Review này không xác nhận đồng bộ nhiều tab theo thời gian thực.

## 6. Kết quả kiểm tra thực tế trên Mac và Docker

Kiểm tra ngày 2026-11-10 UTC bằng bản production, không dùng dev server:

- Next.js production build và TypeScript: đạt trên Mac; Docker Node 24 build cũng đạt.
- `scripts/check-seo.mjs`: **88/88 trang** đạt trên local ở trạng thái chưa có SITE_URL/noindex.
- Cùng script chạy với container ở `127.0.0.1:3035`, `SITE_INDEXABLE=true` và origin giả lập chỉ dành cho kiểm thử: **88/88 trang**, **86 URL sitemap** đạt.
- Đủ 80 href bài học và 3 href dự án trong HTML ban đầu; từng bài có H1 riêng và phần lý thuyết thực sự trong phản hồi máy chủ.
- Title/description/robots trong head; canonical và Open Graph URL đúng origin/path; JSON-LD parse được. Root URL có hoặc không dấu `/` cuối được chuẩn hóa bằng URL trước khi so sánh.
- `/di-lam` và `/lo-trinh` trả 308 đúng đích; bài không tồn tại và `/constructor`, `/toString`, `/__proto__` trả HTTP 404/noindex.
- Social image trả PNG 1200 × 630; font Open Sans Semibold được đóng gói kèm license, không tải font từ Internet lúc chạy.
- Mở link cũ `/#bai-hoc/cli-search` trong Chrome chuyển đúng sang đường dẫn mới. Mở trực tiếp bài, về mục lục và bấm Học tiếp quay lại đúng `/bai-hoc/cli-search`; focus nằm ở main.
- Chrome: giao diện sáng/tối, lọc nhóm phỏng vấn (Async còn 5 câu), tìm kiếm và Escape, Cài đặt không có tài khoản khi Supabase tắt, menu mobile đóng sau điều hướng. Viewport 390 px không tràn ngang.
- Chạy ví dụ Rust mặc định qua nút Chạy mã trên mobile thành công; hai đoạn ghi chú bị yêu cầu xóa không còn. Không ghi nhận lỗi console trình duyệt trong lượt kiểm tra.

Kết quả có thể chạy lại nằm tại [seo-local-validation.json](seo-local-validation.json) và [seo-container-validation.json](seo-container-validation.json). Origin `learn-rust.deployment-check.dev` trong báo cáo container là fixture metadata, **không phải tên miền triển khai** và không được truy cập qua Internet trong kiểm tra.

## 7. Phạm vi chưa nghiệm thu

- Lỗi JSON/localStorage đã được review guard chặn ghi đè và giữ chuỗi gốc; chưa giả lập corruption trong trình duyệt của người dùng để tránh sửa dữ liệu đang có.
- Auth/SMTP, phiên đăng nhập thực và RLS qua API của project Supabase thật cần kiểm tra sau khi người vận hành cấu hình project.
- Chưa triển khai lên VPS, trỏ DNS, cấp HTTPS, xác minh Search Console hoặc gửi sitemap. Sau khi có domain thật, kiểm tra canonical/sitemap trên domain rồi bật SITE_INDEXABLE=true.
- Chưa đo Core Web Vitals từ người dùng thực; kết quả HTTP này không phải điểm Lighthouse hoặc cam kết thứ hạng tìm kiếm.

## Tài liệu đối chiếu

- [Next.js: Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js: Link](https://nextjs.org/docs/app/api-reference/components/link)
- [Next.js: Trạng thái UI khi điều hướng](https://nextjs.org/docs/app/guides/preserving-ui-state)
- [Google: noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google: tạo và gửi sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Search Console: báo cáo Sitemap](https://support.google.com/webmasters/answer/7451001)

Cấu hình kỹ thuật và sitemap giúp công cụ tìm kiếm tìm, đọc và hiểu các trang; không bảo đảm việc lập chỉ mục hay thứ hạng. Hướng dẫn vận hành nằm ở [docs/seo.md](../docs/seo.md).
