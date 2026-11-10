# Quản lý và xuất bản nội dung trên Supabase

`COURSE_CONTENT_SOURCE=supabase` làm website đọc khóa học từ bản đang xuất bản trên Supabase. Danh mục, nội dung bài, bài tập, câu hỏi, chuyên sâu, dự án cuối lộ trình và thông tin hình minh họa nằm trong cùng một bản nội dung. Server chỉ chuyển danh mục và bài đang đọc xuống trình duyệt; việc cập nhật nội dung không yêu cầu sửa giao diện hay build lại website.

## Mô hình dữ liệu

| Bảng | Dữ liệu | Quyền người học |
| --- | --- | --- |
| `course_releases` | Snapshot bất biến của toàn bộ catalog; schema version, mã băm, nhãn và thời điểm tạo | Chỉ đọc đúng bản được con trỏ xuất bản chọn |
| `course_publication` | Một hàng gồm release hiện hành, revision tăng dần và thời điểm cập nhật | Chỉ đọc |
| `course_publication_events` | Lịch sử lần xuất bản/rollback và release trước đó | Không đọc/ghi |

Snapshot JSONB giữ liên kết chương, bài và hướng chuyên sâu nhất quán. Khi publish, một transaction khóa hàng con trỏ, kiểm tra revision đã xem, đổi release và ghi sự kiện. Người học không gặp trạng thái nửa danh mục mới/nửa bài cũ trong một lần tải. API đọc dùng phép JOIN trong một câu truy vấn; metadata, nội dung và JSON-LD dùng chung một lần đọc trong mỗi request.

Một release chưa được chọn là bản nháp riêng tư. Khi chuyển sang release khác, bản cũ cũng không còn đọc được bằng public key; operator vẫn giữ nó để rollback. Hai release giống nhau về nội dung dùng chung ID bất kể nhãn hoặc thời điểm export. Nội dung release không thể UPDATE/DELETE qua luồng chuẩn; thay đổi tạo release mới. Lịch sử xuất bản cũng chỉ được thêm mới.

Website hiện phục vụ **nội dung công khai**. Người dùng đăng nhập cũng không có quyền sửa nội dung. Đây là quy trình quản trị và phát hành khóa học, chưa phải hệ thống thu phí/entitlement cho bài trả tiền. Không lưu một bài cần trả phí vào release công khai rồi chỉ ẩn nút trên giao diện; việc mở bài trả tiền cần bổ sung quyền truy cập ở server/database trước.

## 1. Áp dụng migration

Trong Supabase SQL Editor hoặc quy trình migration của project, áp dụng:

```text
supabase/migrations/20261110000000_learning_progress.sql
supabase/migrations/20261111000000_course_content.sql
```

Migration nội dung tạo bảng, constraints, RLS và hai RPC. `stage_course_release` thêm bản nháp; `publish_course_release` đổi con trỏ. Cả hai chỉ cấp EXECUTE cho `service_role`, dùng `SECURITY INVOKER` và `search_path` rỗng. Quyền mặc định của `PUBLIC`, `anon` và `authenticated` được thu hồi rõ ràng. Bản thân public key chỉ có SELECT qua RLS.

## 2. Chuẩn bị bản nội dung để xem xét

Tại checkout đầy đủ đã cài dependency phát triển:

```bash
npm run content:export
node scripts/import-course-content.mjs --file outputs/course-content.json
```

Export đọc dữ liệu TypeScript đã biên tập trong `src/data`, gộp các lộ trình, kiểm tra hợp đồng dữ liệu và tạo `outputs/course-content.json`. File chứa `schemaVersion: 1`, thông tin nguồn và `catalog`. Folder `outputs` không được commit. Có thể chỉ định nơi xuất bằng `--out /duong-dan/course-content.json`.

Lệnh import mặc định là **dry-run**: kiểm tra toàn bộ file, in số chương/bài/hướng và SHA-256, không cần khóa, không gọi mạng và không ghi Supabase. Import kiểm tra ID trùng, tham chiếu thiếu, quiz không hợp lệ, kích thước, URL tài liệu/hình và đường dẫn file bài thực hành. Database kiểm tra thêm cấu trúc và liên kết chính trước khi nhận bản nháp. Bản canonical giới hạn 16 MiB; wrapper JSON đẹp tối đa 32 MiB.

Có thể biên tập một bản JSON export bằng công cụ quản trị của riêng bạn rồi dry-run lại. Đừng chỉnh trực tiếp release đang phát hành trong Table Editor. Khi bổ sung trường nội dung mới, cập nhật TypeScript contract, validator và schema version có migration tương ứng trước.

SHA-256 mà CLI in được tính từ JSON canonical để so sánh bản export. `course_releases.content_hash` do PostgreSQL tính từ biểu diễn JSONB nên có thể khác SHA của file; nó phục vụ idempotency phía database.

## 3. Cấu hình khóa nhập nội dung

Tạo file **`.env.content-admin`** chỉ trên máy quản trị tin cậy, không commit và không dùng làm env của website:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_CONTENT_ADMIN_KEY=sb_secret_replace_with_your_import_key
```

```bash
chmod 600 .env.content-admin
```

Ưu tiên secret key riêng cho công việc quản trị; legacy JWT có role `service_role` cũng được hỗ trợ. CLI từ chối publishable/anon key ở biến quản trị. Khóa này có đặc quyền ở project Supabase, vì vậy chỉ nạp vào tiến trình nhập, không gửi đến trình duyệt, không đặt `NEXT_PUBLIC_`, không đưa vào build args hoặc Docker Compose. Không dán khóa vào chat hoặc command line history. Có thể thu hồi/luân chuyển khóa nhập sau đợt phát hành theo cách quản trị của bạn.

## 4. Lưu nháp, xem lại và xuất bản

Lưu bản nháp lên Supabase:

```bash
node --env-file=.env.content-admin scripts/import-course-content.mjs \
  --file outputs/course-content.json \
  --label "Rust curriculum 2026-11" \
  --apply
```

Kết quả có `releaseId` và `published: false`. Kiểm tra nhãn, số lượng, nội dung mẫu và hình ảnh bằng quyền quản trị. Website đang chạy không thay đổi.

Xuất bản chính release đã xem:

```bash
node --env-file=.env.content-admin scripts/import-course-content.mjs \
  --release RELEASE_UUID \
  --publish --apply
```

Cũng có thể nhập và xuất bản một file đã xem xét bằng `--file outputs/course-content.json --publish --apply`. Hai bước stage/publish là hai request: nếu publish bị từ chối, bản hiện hành vẫn nguyên vẹn và bản mới ở trạng thái nháp. CLI không tự thử lại thao tác ghi khi revision thay đổi.

Operator muốn khóa vào một revision đã nghiệm thu có thể thêm `--expected-revision 3`. Nếu người khác xuất bản trong khi thao tác đang chạy, PostgreSQL từ chối bằng mã `40001`; CLI yêu cầu xem lại. Revision tăng cả khi rollback, vì vậy không mất phát hiện xung đột khi con trỏ đi từ A sang B rồi quay lại A.

## 5. Cho website đọc nội dung Supabase

Trong `.env.local` hoặc `deploy/.env` của website, chỉ dùng public key:

```dotenv
COURSE_CONTENT_SOURCE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_replace_with_your_public_key
```

Khởi động lại server/container rồi kiểm tra:

```bash
node --env-file=.env.local scripts/check-course-content.mjs
npm run check:seo
```

Trên VPS, chạy check tương ứng từ checkout có cấu hình hoặc dùng lệnh trong container nếu image đã đóng gói script kiểm tra. `/api/health` chỉ kiểm tra tiến trình web; nó không thay thế kiểm tra nội dung Supabase.

Server giữ một snapshot đã kiểm tra tối đa 30 giây trong mỗi tiến trình và gộp các lần tải đồng thời. Sau khi cache hết hạn, request kế tiếp sẽ đọc bản publish/rollback mới; đây là TTL của cache, không phải cam kết mọi tab tự cập nhật trong 30 giây. Tab đang mở cần tải lại hoặc điều hướng để nhận nội dung mới. Có thể khởi động lại tiến trình để xóa cache ngay. Khi cache hết hạn, server đọc lại bằng public key; nếu đọc lỗi thì không phục vụ bản đã hết hạn. Lệnh GET có timeout 10 giây và giới hạn kích thước phản hồi; khóa quản trị không có trong loader. Nếu chọn `supabase` nhưng thiếu cấu hình, chưa xuất bản, dữ liệu hỏng hoặc dịch vụ không phản hồi, loader báo lỗi và **không âm thầm quay lại nội dung đi kèm source**. Điều này ngăn website hiển thị nhầm khóa học cũ trong production. Chế độ `bundled` là lựa chọn rõ ràng dành cho local hoặc sự cố có chủ động đổi cấu hình và khởi động lại.

## 6. Hình minh họa và file bài thực hành

Mỗi lesson có thể có `illustration: { src, alt, caption }`. `src` có thể là đường dẫn asset trong website hoặc HTTPS URL. Ảnh tại `public/` vẫn được đóng gói với release code; snapshot lưu tham chiếu, alt và chú thích. Khi dùng Supabase Storage, upload ảnh vào bucket phù hợp, lấy URL HTTPS ổn định rồi cập nhật bản nội dung. Không ghi đè asset đã được release cũ sử dụng: dùng tên/version mới để rollback phục hồi được cả nội dung lẫn hình.

`localLab` lưu các file mẫu, lệnh chạy và tiêu chí kiểm tra. Nút **Tải dự án** tải ZIP của bài đang xuất bản, gồm đủ cấu trúc thư mục và hướng dẫn. Endpoint chỉ đóng gói các tệp thuộc catalog đã kiểm tra; không thực thi mã và không nhận đường dẫn hệ thống từ người dùng. Bản mẫu thuộc nội dung dạy học, không tự chạy trên server. Validator chỉ cho đường dẫn file tương đối, không cho `..`, đường dẫn tuyệt đối hoặc URL `javascript:`. Chạy mã Rust trong browser vẫn dùng runner hiện có; lưu nội dung trên Supabase không biến database thành dịch vụ thực thi mã.

## 7. Rollback và kiểm chứng

Tìm release trước trong `course_publication_events` bằng quyền quản trị rồi gọi cùng lệnh `--release RELEASE_UUID --publish --apply`. Rollback tạo revision và sự kiện mới, không xóa lịch sử. Có thể xuất metadata chỉ đọc trong SQL Editor:

```sql
select id, label, content_hash, created_at
from public.course_releases
order by created_at desc;

select revision, previous_release_id, release_id, published_at
from public.course_publication_events
order by revision desc;

select release_id, revision, updated_at
from public.course_publication
where id = 1;
```

Chạy kiểm thử trước khi phát hành code hoặc thay migration:

```bash
node --test lib/content/content.test.mjs
bash scripts/test-course-content-rls.sh
```

Node tests kiểm tra validator, đọc nội dung published, giới hạn dữ liệu, phân biệt loại khóa, dry-run không gọi mạng, thứ tự stage/publish và dừng khi có xung đột. SQL test tạo PostgreSQL 17 riêng trong Docker, không mở cổng, không mount thư mục máy, không kết nối project thật; kiểm tra quyền anon/authenticated/operator, nháp, immutability, idempotency, publication và rollback. Role `service_role` trong test cố ý không có BYPASSRLS để kiểm tra policy cấp quyền rõ ràng.

Sau khi có project thật cần kiểm tra thêm: public key chỉ trả active release, publish/rollback qua Data API hoạt động, metadata bài lấy đúng bản đã đổi và ảnh Storage tải được trên tên miền chính. Bộ test local không xác nhận gateway, khóa thật, billing, email hay backup của Supabase. Chưa có job đồng bộ tự động hoặc UI biên tập nội dung; quy trình hiện tại là export → validate → stage → publish có kiểm soát.

## Nguồn thiết kế

- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) — kết hợp grants và RLS; secret key thuộc role quản trị, không đưa vào frontend.
- [Supabase: Database functions](https://supabase.com/docs/guides/database/functions) — ưu tiên security invoker; quản lý EXECUTE và search path rõ ràng.
- [Supabase: API keys](https://supabase.com/docs/guides/api/api-keys) — tách public key phục vụ website và secret key cho tác vụ quản trị.
