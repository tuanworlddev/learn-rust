# Cấu hình Supabase cho Learn Rust

Supabase là tính năng tùy chọn. Khi chưa có cấu hình, trang học vẫn hoạt động với tiến độ trên trình duyệt và phần tài khoản không xuất hiện. Khi cấu hình xong, người học mở **Cài đặt → Tài khoản** để đăng ký, đăng nhập và lưu hoặc khôi phục tiến độ.

## 1. Tạo project và bảng dữ liệu

Tạo một project Supabase. Trong **SQL Editor**, chạy toàn bộ file:

```text
supabase/migrations/20261110000000_learning_progress.sql
```

Migration chạy trong một transaction và chỉ cần áp dụng một lần cho mỗi project. Nếu quản lý migration bằng Supabase CLI, đưa file này vào cùng lịch sử migration của project rồi áp dụng bằng quy trình CLI hiện có.

Bảng `public.learning_progress` giữ một bản lưu cho mỗi tài khoản, gồm `user_id`, `snapshot`, `version` và `updated_at`. `user_id` liên kết với `auth.users`; xóa tài khoản trong Supabase sẽ xóa bản lưu tương ứng. Trigger đặt thời gian cập nhật trên database bằng `clock_timestamp()`; mỗi UPDATE tăng `updated_at` ít nhất 1 microsecond để điều kiện chống ghi đè vẫn hiệu lực khi nhiều UPDATE nằm trong cùng transaction. Dữ liệu phải đúng cấu trúc phiên bản 1 và không vượt 256 KiB tại database; client giới hạn 240 KiB để chừa phần định dạng JSONB.

Migration bật Row Level Security, thu hồi quyền của `anon` và `PUBLIC`, rồi cấp `SELECT`, `INSERT`, `UPDATE` cho `authenticated`. Mỗi policy kiểm tra `auth.uid() = user_id`. Không có quyền xóa bản lưu từ trình duyệt. Không dùng service role cho các thao tác của người học.

## 2. Bật Email Auth và cấu hình redirect

Trong dashboard Supabase:

1. Mở **Authentication → Providers**, bật **Email** và cho phép đăng ký nếu muốn người học tự tạo tài khoản.
2. Giữ **Confirm email** bật cho production. Giao diện yêu cầu mật khẩu đăng ký ít nhất 8 ký tự; đặt chính sách mật khẩu tương ứng hoặc mạnh hơn trong Supabase.
3. Mở **Authentication → URL Configuration**, đặt **Site URL** thành tên miền chính, ví dụ `https://learn-rust.example.com`.
4. Thêm các **Redirect URLs** chính xác mà bạn dùng:

   ```text
   https://learn-rust.example.com/auth/callback
   http://localhost:3000/auth/callback
   http://127.0.0.1:3000/auth/callback
   ```

5. Cấu hình SMTP của bạn trong phần Email của Authentication và gửi thử email bằng một tài khoản kiểm thử trước khi mở đăng ký công khai. Kiểm tra hạn mức gửi email, tên miền gửi và thư mục spam của nhà cung cấp.

Ứng dụng dùng PKCE. Email xác nhận cần được mở trong cùng trình duyệt đã đăng ký để tự hoàn tất đăng nhập. Nếu mở ở trình duyệt khác, quay lại trang học và đăng nhập bằng email/mật khẩu sau khi xác nhận. Giữ link xác nhận chuẩn `{{ .ConfirmationURL }}` trong email template để Supabase xử lý xác nhận và chuyển tiếp về `/auth/callback`.

Callback chỉ đổi mã xác nhận lấy phiên trong trình duyệt, không có service key hay phiên SSR. Trang callback có `noindex` và `no-referrer`; mã dùng một lần được gỡ khỏi URL sau khi trang mở. Các trang bài học công khai không phụ thuộc tài khoản. Không dùng wildcard rộng cho redirect production.

## 3. Điền biến môi trường

Lấy **Project URL** và **Publishable key** từ Connect hoặc Settings → API Keys của project. Điền vào `.env.local` khi chạy local, hoặc file môi trường của dịch vụ trên VPS:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_replace_with_your_key
```

Nếu project đang dùng khóa cũ, có thể thay dòng publishable key bằng:

```dotenv
SUPABASE_ANON_KEY=your_legacy_anon_jwt
```

Ưu tiên publishable key. Nếu cả hai biến khóa cùng có giá trị, `SUPABASE_PUBLISHABLE_KEY` được dùng. Để tắt tài khoản, để trống cả URL và các khóa. Cấu hình thiếu một nửa hoặc sai định dạng bị coi là không hợp lệ.

Các biến này được đọc khi server chạy. Không cần tiền tố `NEXT_PUBLIC_`, không cần đưa khóa vào lệnh build, và không cần build lại Docker image khi đổi project. Sau khi sửa file môi trường, khởi động lại server/container để tải giá trị mới.

Endpoint `GET /api/public-config` trả URL và **public key** cho trình duyệt với `Cache-Control: private, no-store`. Đây là thiết kế có chủ đích: public key không phải bí mật; quyền dữ liệu được bảo vệ bằng phiên đăng nhập, quyền bảng và RLS. Endpoint không trả lý do lỗi cấu hình hay nội dung các biến môi trường khác.

**Không điền `sb_secret_...` hoặc JWT `service_role` vào các biến trên.** Bộ kiểm tra từ chối hai loại khóa này. Không commit `.env.local` hay file môi trường production. Ứng dụng không cần `SUPABASE_SECRET_KEY`, database password hoặc service-role key. HTTPS bắt buộc cho Supabase từ xa; HTTP chỉ được chấp nhận với `localhost`, `127.0.0.1` và `[::1]` để phát triển local.

Nếu dùng Supabase self-hosted, URL phải truy cập được từ trình duyệt người học. Hostname nội bộ của Docker sẽ không thay thế được URL công khai. Trình duyệt gọi Auth và Data API trực tiếp.

## 4. Kiểm tra trước khi mở cho người học

Với Node.js 22.13 trở lên, tại thư mục project:

```bash
node --test lib/supabase/validation.test.mjs
node --env-file=.env.local scripts/check-supabase.mjs
```

Nếu môi trường đã được truyền vào tiến trình/container:

```bash
node scripts/check-supabase.mjs
```

Script chỉ gửi GET tới Auth settings và Data API, không đăng ký người dùng, không gửi email, không ghi dữ liệu và không in khóa. Kết quả kiểm tra xác nhận public key/URL truy cập được Auth, Email Auth đã bật và yêu cầu chưa đăng nhập bị chặn ở bảng tiến độ. Script không thay thế kiểm thử phân quyền giữa hai tài khoản.

Trên một project kiểm thử đã áp dụng migration, thực hiện tiếp:

| Thao tác | Kết quả cần thấy |
| --- | --- |
| Chưa cấu hình Supabase | Trang học hoạt động; phần tài khoản không hiện |
| Đăng ký tài khoản A, mở email xác nhận | Quay lại trang học; Cài đặt hiển thị email của A |
| A học một bài rồi bấm Lưu tiến độ | Có một hàng với `user_id` của A |
| A bấm Lưu tiến độ khi tài khoản đã có bản lưu | Xem số bài của hai bản; chỉ thay thế sau khi xác nhận |
| Hai thiết bị cùng mở bước thay bản lưu, thiết bị thứ nhất xác nhận trước | Thiết bị thứ hai nhận thông báo bản lưu đã thay đổi, không ghi đè bản mới |
| A đăng nhập ở trình duyệt khác, bấm Khôi phục | Xem được ngày và số bài của bản lưu; tiến độ hiện tại chưa đổi |
| A bấm Hủy trong bước khôi phục | Tiến độ hiện tại được giữ |
| A xác nhận Khôi phục tiến độ | Tiến độ và ghi chú được thay bằng bản đã xem |
| Đăng nhập tài khoản B | B không thấy bản lưu của A |
| Gọi Data API bằng phiên B và cố ghi `user_id` của A | INSERT bị RLS từ chối; UPDATE không thể sửa hàng A |
| Gửi version khác 1 hoặc JSON sai cấu trúc | CHECK constraint từ chối |
| Đăng xuất | Phiên trên trình duyệt hiện tại kết thúc; dữ liệu học local vẫn còn |

Có thể kiểm tra trạng thái migration trong SQL Editor bằng truy vấn chỉ đọc:

```sql
select relrowsecurity
from pg_catalog.pg_class
where oid = 'public.learning_progress'::regclass;

select policyname, roles, cmd, qual, with_check
from pg_catalog.pg_policies
where schemaname = 'public' and tablename = 'learning_progress';

select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'learning_progress'
  and grantee in ('anon', 'authenticated', 'PUBLIC');
```

`relrowsecurity` phải là `true`; phải có ba policy dành cho `authenticated`, mỗi policy đều giới hạn `user_id` theo `auth.uid()`. `anon` và `PUBLIC` không có quyền bảng; `authenticated` chỉ có SELECT, INSERT, UPDATE. Quyền của chủ database và role quản trị là ngoài phạm vi client.

Để kiểm tra RLS bằng API, dùng SDK với **public key + phiên đăng nhập thật** của A/B. Không dùng SQL Editor mặc định hoặc service-role key để kết luận RLS đã đúng, vì tài khoản quản trị có thể bỏ qua RLS. Kiểm thử A/B cần thực hiện trên Supabase của bạn; bộ test local chỉ kiểm tra cấu hình và hợp đồng dữ liệu.

## Phạm vi bản lưu

Bản lưu chỉ gồm các trường của `Progress`: bài hoàn thành, bài tập đã qua kiểm tra, bài đánh dấu, câu trả lời trắc nghiệm, bài học gần nhất, mục tiêu hằng ngày, thời gian học, ghi chú và dự án hoàn thành.

Bản nháp mã trong editor và minh chứng phỏng vấn đang lưu riêng trên trình duyệt, không được tải lên Supabase. Đăng nhập không tự đồng bộ, gộp hay ghi đè tiến độ. **Lưu tiến độ** đọc bản hiện có trước: nếu đã có dữ liệu, người học xem số bài của hai bản và xác nhận thay thế. Lệnh UPDATE chỉ thành công nếu `updated_at` vẫn khớp bản đã xem; nếu thiết bị khác lưu trước, ứng dụng dừng và yêu cầu xem lại. Khi chưa có hàng, INSERT thông thường cũng dừng nếu một thiết bị khác vừa tạo bản lưu, không dùng upsert ghi đè. **Khôi phục** tải bản xem trước; chỉ khi người học xác nhận mới thay tiến độ/ghi chú trên trình duyệt. Nút **Tải tiến độ** hiện có có thể tạo bản sao local trước khi thay đổi.

Mỗi tài khoản có một bản lưu hiện tại; chưa có lịch sử phiên bản hay tự động gộp tiến độ giữa nhiều thiết bị. Khi có xung đột, người học chủ động xem lại và chọn bản muốn giữ. Xóa tiến độ local không xóa bản lưu Supabase.

## Tài liệu chính thức

- [API keys và các loại khóa](https://supabase.com/docs/guides/api/api-keys)
- [Email/password Auth](https://supabase.com/docs/guides/auth/passwords)
- [PKCE flow](https://supabase.com/docs/guides/auth/sessions/pkce-flow)
- [Email templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [JavaScript update](https://supabase.com/docs/reference/javascript/update)
