# Review cuối trải nghiệm người học

Đợt cập nhật: tháng 11/2026. Người rà soát: agent riêng đóng vai người học, phối hợp với agent chính thực hiện thao tác trình duyệt.

## Phạm vi và cách kiểm tra

Góc nhìn sử dụng: một người đã biết một phần Rust chọn hướng Backend, học một bài, làm bài tập và câu hỏi, rời trang rồi quay lại để học tiếp. Sau đó người học chuyển sang dự án Cargo và muốn nhận đủ tệp để chạy trên máy.

Agent này đọc source hiện hành trên Mac, rà luồng trạng thái và text hiển thị. Agent chính trực tiếp thao tác trình duyệt trên origin kiểm thử `127.0.0.1:3000` và cung cấp kết quả. Không xem việc đọc code là bằng chứng đã thao tác UI, không truy cập hồ sơ, mật khẩu hoặc lịch sử tải xuống của người dùng.

Các vùng đã đọc:

- `components/learning-app.tsx`: điều hướng, Học tiếp, tiến độ, tìm kiếm, sidebar và Cài đặt.
- `components/learning-views.tsx`, `learning-motion.ts`: tab, hai pane, footer, bài cuối, sổ tay, dự án và Cargo lab.
- `components/specialization-views.tsx`: danh mục hướng, CTA, bài học, dự án cuối lộ trình.
- `components/code-lab.tsx/.css`: bản nháp, chạy/kiểm tra, gợi ý, lời giải và thông tin biên dịch.
- `components/animated-disclosure.tsx/.css`: animation, inert, aria và reduced motion.
- `components/account-settings.tsx`, `lib/supabase/snapshot.mjs`: wording và phạm vi đồng bộ tiến độ.
- `app/api/lessons/[id]/lab/route.ts`: ZIP của lab được xuất bản.

## Phát hiện cần sửa

### LFR-1 — P2: Học tiếp rời khỏi hướng đang học

**Tái hiện qua trình duyệt bởi agent chính.** QA origin đã hoàn thành `backend-runtime`. Trở lại bài đã hoàn thành, mở trang chủ rồi nhấn **Học tiếp** dẫn đến `/bai-hoc/hello-rust`.

Nguyên nhân ở logic `resume` trong `learning-app.tsx`: chỉ giữ `lastLesson` nếu bài đó chưa hoàn thành; khi đã hoàn thành thì chọn bài chưa xong đầu tiên trong toàn catalog. Người chủ động chọn Backend bị mất mạch học dù `backend-http` là bước tiếp theo.

**Đề nghị:** ưu tiên bài chưa hoàn thành tiếp theo trong cùng hướng với bài gần nhất; nếu cần quay lại một bài còn thiếu, vẫn tìm trong hướng đó trước. Trường hợp học nền tảng giữ thứ tự khóa cơ bản. Agent chính đã nhận lỗi và đang sửa, cần kiểm tra lại đích sau build.

### LFR-2 — P2: CTA khi học xong một hướng vẫn ghi Học tiếp

**Xác nhận từ source**, chưa tạo tiến độ giả trong browser.

`SpecializationView` fallback về `ordered[0]` khi sáu bài đều hoàn thành, trong khi label vẫn dùng `done ? "Học tiếp" : "Bắt đầu học"`. Người đã hoàn thành nhìn thấy Học tiếp nhưng được đưa lại bài đầu.

**Đề nghị:** ghi **Ôn lại** khi tất cả bài hoàn thành, hoặc dẫn đến dự án cuối lộ trình. Không thêm một banner giải thích dài. Agent chính chọn hướng đổi nhãn **Ôn lại** và đang sửa.

### LFR-3 — P2: Một số phần mở rộng của editor còn nhảy chiều cao

**Xác nhận từ source**, chưa ghi nhận animation qua browser ở vòng review này.

- **Thông tin biên dịch** còn dùng `<details>` gốc, không có animation chiều cao.
- **Xem/Ẩn lời giải** dùng mount/unmount có điều kiện. Animation hiện chỉ là opacity/translate khi xuất hiện; đóng panel mất chiều cao ngay.
- **Dùng lời giải** gọi `textarea.focus()` không có `preventScroll`, có thể kéo vị trí đọc ngay lập tức.

**Đề nghị:** dùng disclosure chung cho diagnostics; giữ panel lời giải trong DOM và chuyển grid 0fr/1fr, aria-hidden/inert đồng bộ; focus editor bằng `preventScroll`. Giữ reduced motion và không tăng số nút trên giao diện.

### LFR-4 — Cải thiện nhỏ: hướng dẫn sau khi tải ZIP

Các lab hiện có đủ `Cargo.toml`, source, test và lệnh thực hành; không thấy lệnh `cargo new` có nguy cơ ghi đè dự án đã giải nén. Tuy nhiên phần mô tả vẫn hướng dẫn tạo tệp thủ công.

**Đề nghị:** đầu `LEARN_RUST.md` trong ZIP có một câu: “Giải nén và mở terminal trong thư mục có Cargo.toml trước khi chạy các lệnh dưới đây.” Điều này giúp người mới biết thư mục chạy lệnh, không cần thêm ghi chú kỹ thuật trên giao diện.

## Những phần đã có bằng chứng đạt

Các kết quả sau do agent chính thực hiện và cung cấp, không phải thao tác trực tiếp của reviewer này:

- Desktop không còn nút **Viết mã** thừa dưới đề khi editor đã hiện.
- Chuyển từ footer sang Bài tập/Câu hỏi có cuộn ngắn; quay lại Lý thuyết phục hồi vị trí đọc đã kiểm tra ở scrollTop 637.
- Accordion phỏng vấn có transition 260 ms/180 ms và thu về chiều cao 0.
- Viewport mobile 390 px không tràn ngang; chuyển Nội dung/Viết mã giữ bản nháp và vị trí.
- Một lượt học `backend-runtime` được thực hiện bằng mã Rust thật, kiểm tra stdout/assertion, chọn câu trả lời, hoàn thành và reload; trạng thái hoàn thành được giữ.
- Console lỗi của lượt học này trống.

Source hiện hành cho thấy:

- Bài trước/sau được giới hạn vào khóa cơ bản hoặc hướng hiện tại; `onBack` của bài chuyên sâu trỏ đến `/chuyen-sau/<id>`.
- Trạng thái Bài tập/Câu hỏi ở footer là nút có accessible name rõ, có thể trở lại phần còn thiếu; bỏ câu lặp “chưa đạt” vẫn giữ thông tin bằng icon và tên hỗ trợ đọc màn hình.
- Tab có phím mũi tên, Home/End; modal có focus trap; code editor có lối thoát bằng Esc rồi Tab.
- Bản nháp theo từng bài được giữ; thay mã ban đầu cần thao tác xác nhận trong editor.
- ZIP có cấu trúc thư mục theo lesson ID, nội dung UTF-8, header attachment/no-store/noindex, ID giới hạn ký tự và chỉ lấy lab của catalog đã xuất bản.
- Đồng bộ tiến độ dùng snapshot riêng của người học; giới hạn 1.000 ID đủ cho catalog hiện tại. Bản nháp editor vẫn ở thiết bị theo thiết kế đã ghi trong tài liệu.

## Rà text

Tìm toàn bộ `components`, `app`, `src/data` không còn:

- “Biên dịch qua”
- “Không nhập dữ liệu bí mật”
- “Mỗi ví dụ có bản nháp riêng”
- “chưa hỗ trợ stdin”
- “đi làm”
- thương hiệu “RustViet” hoặc “Rustviet” trên UI

Những chuỗi `rustviet-*` còn lại chỉ là khóa lưu trữ cũ, giữ tương thích dữ liệu người học. Không nên đổi các khóa này chỉ để làm sạch nhãn.

Các hướng dẫn về Cargo, target, firmware, browser, native window, thiết bị và giới hạn của bài tập có liên quan trực tiếp đến việc học Rust; nên giữ chúng ở đúng bài thay vì xóa đồng loạt. Liên kết Rust Playground khi dịch vụ chạy mã lỗi cũng là đường phục hồi hữu ích, khác với ghi chú nền tảng luôn hiện.

## Ba ca nghiệm thu cuối đề nghị

1. Sau khi sửa LFR-1: `backend-runtime` hoàn thành → trang chủ → **Học tiếp** phải đến `backend-http`.
2. Mở bài cuối `backend-production` → **Lộ trình** ở cuối bài → `/chuyen-sau/backend`.
3. Từ bài có lab, tải ZIP qua URL HTTP mới; kiểm tra đủ source/tests/hướng dẫn, đường dẫn tương đối và nội dung UTF-8; trang học không mất tiến độ. Kiểm tra HTTP/archive do agent chính thực hiện sau build.

Nhãn **Ôn lại** có thể kiểm tra bằng logic thuần với trạng thái cả sáu bài hoàn thành, không cần sửa localStorage của trình duyệt người dùng.

## Giới hạn của kết luận

Không phát hiện P1 trong phạm vi source được xem. Đây không phải audit bảo mật toàn hệ thống, nghiệm thu native/GPU/thiết bị, hay chứng nhận năng lực nghề nghiệp.

Nội dung Supabase hiện là khóa học công khai với bản nháp/quyền xuất bản tách riêng. Chưa có entitlement hoặc thanh toán cho bài trả tiền; không được diễn giải việc chuyển nội dung lên Supabase là đã triển khai paywall thương mại.

Các mục LFR-1 đến LFR-4 được ghi ở thời điểm phát hiện. Agent chính đang xử lý; trạng thái sau sửa và bằng chứng build/browser/ZIP cần cập nhật trong báo cáo nghiệm thu tổng hợp trước khi bàn giao.


## Trạng thái sau nghiệm thu

Agent chính đã xử lý LFR-1–LFR-4 và kiểm tra lại sau build cuối. Học tiếp đến đúng backend-http; bài cuối quay về /chuyen-sau/backend; panel lời giải đóng về 0 px; 29 ZIP qua kiểm tra HTTP và đối chiếu nội dung. Chi tiết bằng chứng, phạm vi và giới hạn ở [release-acceptance.md](release-acceptance.md).
