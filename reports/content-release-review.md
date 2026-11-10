# Review phát hành nội dung Supabase

Reviewed: 2026-11-10T22:46:29.971Z

## Kết luận

Không tìm thấy blocker về quyền đọc/ghi hoặc tính nhất quán của luồng stage → publish trong phạm vi đã đọc. Catalog hiện tại qua validator trên Mac với **33 module, 158 bài học, 13 hướng chuyên sâu và 29 lab Cargo**. Đây là giáo trình công khai; hệ thống thanh toán và quyền truy cập bài trả phí không thuộc bản thay đổi này.

Hai lỗi P2 đã được phát hiện và sửa trong đợt review:

| Vấn đề | Bằng chứng | Xử lý |
| --- | --- | --- |
| Rollback nội dung làm mất tiến độ của bài tạm ẩn | `readProgress` lọc ID theo catalog hiện tại; effect lưu tự ghi snapshot đã lọc xuống localStorage. Chạy chính hàm từ source với tiến độ `backend-runtime` và catalog chỉ có `hello-rust` cho kết quả completed/solved/bookmarks/quizzes rỗng, lastLesson=null. | Parser nay giữ ID hợp lệ độc lập catalog, kể cả project cũ; giao diện tiếp tục chỉ tính bài đang hiển thị. Có 4 regression test chạy parser và load/save effects thật. |
| Endpoint ZIP từ chối ID chứa underscore dù catalog cho phép | Regex endpoint ban đầu chỉ nhận chữ/số/dấu gạch ngang; validator và snapshot cho phép cả underscore. | Root đã đổi regex endpoint thành `^[a-z0-9][a-z0-9_-]{0,99}$`, thống nhất contract. Đã xác nhận source mới; HTTP ZIP được root nghiệm thu riêng. |

## Phần đã đọc và đánh giá

### Quyền và xuất bản

Nguồn: [migration nội dung](../supabase/migrations/20261111000000_course_content.sql), [RLS test](../supabase/tests/course_content_rls.sql), [import CLI](../scripts/lib/course-import.mjs).

- Bảng release, con trỏ xuất bản và lịch sử đều bật RLS. `anon`/`authenticated` chỉ có SELECT trên release và con trỏ; không có grant trên lịch sử.
- Policy của release chỉ cho đọc ID đang được con trỏ chọn. Bản nháp và release cũ không được trả qua public SELECT sau khi đổi con trỏ.
- Hai RPC dùng security invoker và search_path rỗng. Quyền EXECUTE mặc định của PUBLIC/anon/authenticated được thu hồi; chỉ role quản trị nhận quyền cần thiết.
- Publication lấy row lock trên singleton, kiểm tra revision đã xem, cập nhật pointer và thêm event trong cùng transaction. Rollback cũng tăng revision, tránh tình huống A → B → A làm mất phát hiện xung đột.
- Stage theo hash là idempotent. Release và event có trigger cấm UPDATE/DELETE trong luồng chuẩn. Người có đặc quyền quản trị database vẫn là chủ thể tin cậy; các policy này không được mô tả như biện pháp chống một database owner độc hại.
- CLI validate trước khi ghi, mặc định dry-run, tách khóa nhập khỏi public key và không tự retry thao tác ghi khi gặp revision conflict.
- Database validator kiểm tra cấu trúc/liên kết chính; JavaScript validator còn kiểm tra chặt hơn về unknown fields và một số giới hạn. Luồng xuất bản cần tiếp tục dùng bản đã qua JavaScript validator như root đang làm, không coi chỉnh JSON tùy ý trong SQL Editor là thay thế cho bước này.

Review này đọc SQL và các ca test; không tự kết nối hoặc thao tác project Supabase thật. Root đã báo bộ RLS cô lập đạt 40 assertion trước review; đó là bằng chứng của lượt kiểm tra tổng hợp, không phải một lượt chạy lại của agent này.

### Loader và ranh giới server/client

Nguồn: [source loader](../lib/content/source.mjs), [server catalog](../lib/course-content.ts), [LearningPage](../components/learning-page.tsx), [CourseProvider](../components/course-context.tsx).

- Loader dùng public key; không nhận import/admin key. Modern publishable key được gửi qua apikey; legacy JWT có Bearer tương ứng.
- Một SELECT với JOIN lấy con trỏ và catalog trong cùng snapshot database, tránh trộn manifest từ release này với dữ liệu release khác.
- Response được giới hạn byte, có timeout, không đi theo redirect. Catalog phải qua validator trước khi dùng.
- Chọn nguồn Supabase mà gặp lỗi sẽ báo lỗi; không tự đổi sang bản bundled.
- Cache trong mỗi tiến trình dùng đồng hồ monotonic, chỉ lưu một catalog đã kiểm tra, gộp các lần tải đồng thời và không trả catalog đã hết hạn khi lần refresh thất bại.
- TTL cache là 30 giây sau lần tải thành công. Đây không phải cam kết thời gian cập nhật tuyệt đối cho một tab đã mở: còn có thời gian request và hành động tải lại/điều hướng của người học.
- React cache dùng chung dữ liệu giữa metadata, nội dung và JSON-LD trong một request. Provider chuyển danh mục tóm tắt, thông tin hướng chuyên sâu và toàn bộ bài đang đọc; không chuyển toàn bộ 158 lời giải/lab trong mọi trang.
- JSX hiển thị nội dung text; JSON-LD escape dấu nhỏ hơn. Không thấy đường biến nội dung lesson thành HTML thực thi tùy ý.

### ID, tiến độ và rollback

Nguồn: [parser và effect lưu](../components/learning-app.tsx), [cloud snapshot contract](../lib/supabase/snapshot.mjs).

Parser sau sửa nhận các ID đúng định dạng mà không yêu cầu chúng đang có trong catalog. Các câu trả lời hợp lệ nằm trong khoảng 0..20 theo cloud snapshot contract. completed, solved, bookmarks và finishedProjects được khử trùng lặp; giá trị sai định dạng được bỏ.

Mỗi danh sách ID và map quiz tối đa 1.000 mục. Vượt giới hạn gây lỗi thay vì cắt dữ liệu. Luồng load hiện có giữ raw JSON để xuất bản sao và bật progressLoadError, khiến effect lưu không ghi đè dữ liệu gốc. onRestore chỉ xóa trạng thái lỗi sau khi parse thành công.

Số bài hoàn thành ở sidebar vẫn tính bằng giao của danh mục đang hiển thị với tiến độ; việc giữ các ID tạm ẩn không cộng chúng vào tỷ lệ của lộ trình hiện tại.

### SEO, ZIP và Docker

Nguồn: [SEO](../lib/seo.ts), [sitemap](../app/sitemap.ts), [ZIP endpoint](../app/api/lessons/[id]/lab/route.ts), [Dockerfile](../Dockerfile), [Compose](../compose.yml).

- Metadata, route hợp lệ và sitemap dùng catalog cùng nguồn. Chuyên sâu có breadcrumb và Course/LearningResource liên kết đúng track.
- Không có lời tuyên bố mọi bài là miễn phí trong structured data; noindex và domain sản xuất tiếp tục do cấu hình điều khiển.
- ZIP chỉ lấy file thuộc lab đã qua validator; filename/đường dẫn không nhận đường dẫn filesystem tùy ý. File được đóng gói, không được thực thi. Archive có thư mục gốc theo ID, hướng dẫn và header attachment/noindex/no-store.
- Docker runtime nhận COURSE_CONTENT_SOURCE và public config lúc chạy. Import admin key không nằm trong Compose. Standalone, public asset, static asset và script kiểm tra content được đóng gói.
- Docker build context đã loại `work`, `outputs`, `reports`, env/key và node_modules. Các Cargo target được tạo trong quá trình nghiệm thu không lọt vào build context.
- Healthcheck chỉ xác nhận web process; script check-course-content dùng để kiểm tra catalog Supabase riêng. Không diễn giải health=200 thành bằng chứng database hoặc runner Rust hoạt động.

## Kiểm tra thực sự chạy trong agent này

```bash
npx tsc --noEmit
node --test scripts/test-progress-catalog.mjs
```

TypeScript đạt, không diagnostic. **4/4 regression tests đạt**:

1. Full catalog → foundation-only → full catalog giữ nguyên tiến độ bài và project tạm ẩn.
2. Loại ID/answer sai nhưng giữ mục hợp lệ không hiện trong catalog.
3. Giới hạn 1.000 được chấp nhận; 1.001 IDs hoặc quiz entries gây lỗi, không truncate.
4. Chạy load/save effects được lấy từ TypeScript AST của source thật: dữ liệu quá lớn kích hoạt nhánh bảo toàn raw JSON và không có lần ghi localStorage.

Một probe read-only khác gọi `validateCatalog(readCourseSource())` xác nhận 33/158/13/29 nêu trên. Không tạo tài khoản, không đọc khóa, không đổi cấu hình, không chạy browser, không seed hoặc publish database trong agent này.

## Hash kiểm chứng source sau sửa

```text
4d1390ecd97ac2b076ab3a217245bd5115f8eaf1396e7154a09c3802513b0eb6  components/learning-app.tsx
c2b8e4a8ac2a2216c5ba59c00395aae9920ec70182636efb0e2cb83c76e77ad6  scripts/test-progress-catalog.mjs
4c769ac40820f33007595f8cf0edd243b6bc564e9eefb6ef15738826081dd9dc  lib/content/source.mjs
5817b00c9e33f83a3cb06c10d8b2b04cb29913e8432422d02d48e5b78be33a3b  supabase/migrations/20261111000000_course_content.sql
```

Hash phản ánh thời điểm review; root có thể tiếp tục thay đổi những phần khác trước khi chốt commit. Nghiệm thu kết nối Supabase thật, ZIP HTTP, production build, SEO toàn bộ route và push GitHub do root thực hiện.
