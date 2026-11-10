# Rà soát UX/UI Learn Rust

Ngày rà soát: 11/11/2026. Phạm vi: shell điều hướng, lộ trình, trang bài học, trình soạn thảo, câu hỏi, ba bài tập tổng hợp và sổ tay. Đây là review mã nguồn và sửa các vấn đề xác định được; kết quả chạy trình duyệt do người tích hợp kiểm tra riêng. Báo cáo không phải chứng nhận tuân thủ WCAG hay kiểm chứng bằng trình đọc màn hình.

## Kết luận

Giao diện hai cột trên desktop phù hợp việc đọc và thử mã. Mục lục phẳng, lọc bài và trạng thái sáng/tối giúp việc học liên tục. Các khoảng trống chính trước lần sửa này nằm ở luồng học bằng bàn phím, truy cập editor trên mobile và cách diễn đạt kết quả chấm bài. Chỉ có trạng thái “hoàn thành” không chứng minh người học đã tự giải hoặc đủ năng lực đi làm.

## Vấn đề và cách sửa

| Mức độ | Quan sát từ mã trước sửa | Thay đổi |
| --- | --- | --- |
| Cao | Chữ tiêu đề chương và tên bài sidebar đều dùng màu phụ; người dùng phản ánh khó đọc. | Giao root sửa token và các selector sidebar, giữ màu phụ cho thông tin thật sự phụ. |
| Cao | Trên màn hình <=900 px, toàn bộ lý thuyết, câu hỏi và footer nằm trước editor; đổi từ đọc sang viết đòi hỏi cuộn dài. | Thêm thanh “Nội dung / Viết mã” chỉ trên mobile/tablet. Hai vùng giữ nguyên instance, chỉ ẩn vùng không chọn, nên bản nháp và phiên chạy không bị reset. Có nút “Viết mã” trong bài tập. |
| Cao | `ViewTabs` là một nhóm toggle button trong `nav`, thiếu `tablist`, `tab`, `tabpanel` và điều hướng phím mũi tên. | Bổ sung các role, `aria-selected`, ID liên kết panel, roving tabindex, phím trái/phải/Home/End. Panel không chọn vẫn tồn tại nhưng `hidden`. Áp dụng cho bài học và sổ tay. |
| Cao | CTA “Làm bài tập” hoặc “Trả lời câu hỏi” ẩn chính nút đang giữ focus. | Sau chuyển bằng CTA, focus chuyển đến panel vừa mở. Chuyển tab bằng mũi tên giữ focus trên tab. |
| Cao | Kết quả “Bài làm chính xác” được tạo từ việc chạy mã người học và so sánh stdout. Các assertion nằm trong mã có thể sửa/xóa. | Đổi thành “Đã vượt qua kiểm tra mẫu”, giải thích phạm vi so sánh đầu ra, nhắc giữ assertion và tự bổ sung trường hợp biên. Không mô tả đây là đánh giá độc lập toàn bộ thuật toán. |
| Vừa | Icon dấu tích xuất hiện cạnh bài tập/câu hỏi chưa đạt; chỉ màu phân biệt trạng thái. | Dùng vòng tròn cho trạng thái chưa đạt và dấu tích khi đạt; có chữ “đã đạt/chưa đạt”. |
| Vừa | `solved` được lưu sau một lần đạt; sửa bản nháp không xóa lịch sử. UI cũ có thể bị hiểu là bản nháp hiện tại đã được chấm. | Diễn đạt “Đã từng vượt qua kiểm tra mẫu. Khi sửa mã, hãy kiểm tra lại.” Trạng thái trong editor tiếp tục bị xóa khi mã đổi, và hiện cảnh báo cần chạy lại. Giữ tiến độ lịch sử. |
| Vừa | Tab dùng để thụt lề trong textarea, cách thoát chỉ nằm trong nhãn cho trình đọc màn hình. | Khi focus editor, hiện hướng dẫn ngắn Tab / Esc rồi Tab / Ctrl hoặc Command + Enter. Giữ shortcut thoát có sẵn. |
| Vừa | Focus editor là đường 1 px pha trong suốt; text layer luôn trong suốt, dễ mất chữ ở forced-colors. | Focus ring 2 px theo màu accent; trong forced-colors ẩn highlight layer và dùng chữ CanvasText thật trong textarea. |
| Vừa | Nút icon editor nhỏ trên mobile, chữ nhập liệu 13 px. | Nút icon 36 px, nút chạy/kiểm tra cao ít nhất 38 px; input editor 16 px ở màn hình nhỏ, đồng bộ highlight và line-number để tránh lệch dòng. Notes mobile dùng 16 px. |
| Vừa | `error` từ phản hồi API chưa được thu hẹp về chuỗi trước khi render. | Chỉ nhận lỗi kiểu string, tránh render một object khi phản hồi không đúng định dạng. |
| Vừa | Tiến độ/ghi chú ở shell có catch localStorage im lặng nhưng sổ tay vẫn khẳng định tự lưu. | Báo root bổ sung trạng thái lỗi lưu và đường xuất dữ liệu. CodeLab đã có cảnh báo riêng. |

## Phạm vi editor đã kiểm tra qua mã

- Mỗi bài và mẫu thực hành dùng storage key riêng; không đổi các key hiện hữu.
- Các yêu cầu chạy có AbortController, timeout, request ID; kết quả cũ không ghi vào một bài mới sau unmount.
- Chỉ ghi nhận đạt nếu mã tại thời điểm phản hồi vẫn bằng mã đã gửi.
- Xác nhận trước khi khôi phục bản nháp; nút tải mã vẫn dùng được để giữ bản sao.
- Khi dùng lời giải, focus trở lại editor; thông báo khuyến khích giải thích và tự viết lại.
- Các vùng code dài cuộn trong vùng của chúng; văn bản yêu cầu và stdout cho phép xuống dòng.

## Kiểm tra bàn giao cần chạy trên trình duyệt

1. Desktop sáng/tối: sidebar, lộ trình, bài học, bài tập, quiz, sổ tay và các trang mới; kiểm tra focus ring và không có chữ sát màu nền.
2. Bàn phím: Tab vào tab đang chọn; trái/phải/Home/End đổi tab; CTA đổi panel giữ focus có ý nghĩa; editor Esc rồi Tab thoát đúng.
3. Mobile 390 px: đổi Nội dung / Viết mã nhiều lần, kiểm tra bản nháp không mất, thanh chuyển vùng không bị topbar che và trang không tràn ngang.
4. Thử code đúng, lỗi compiler và stdout khác mẫu; đổi code sau một lần đạt để xác nhận lịch sử và bản nháp hiện tại được diễn đạt khác nhau.
5. Đổi mẫu trong playground, quay lại và tải lại trang để xác nhận bản nháp được giữ.
6. Sổ tay: tab bằng bàn phím, nhập ghi chú, tải ghi chú, bỏ bookmark.

Kiểm tra tĩnh sau sửa: `tsc --noEmit --incremental false` chạy thành công trên cây nguồn đã có CareerHub. Việc này xác nhận kiểu/JSX, không thay thế các bước thử giao diện phía trên.

## Giới hạn còn lại

- Chấm trên web là tự luyện: không có test suite bí mật độc lập, giám sát người học hay đánh giá code review. Lời giải tham khảo có thể được dùng trực tiếp. Không nên dùng tỷ lệ hoàn thành để tuyên bố đậu phỏng vấn.
- Editor hỗ trợ chương trình một tệp qua Rust Playground, không thay thế quy trình Cargo nhiều tệp, terminal, debugger, database hay vận hành dịch vụ. Các lab dự án cần chạy ngoài editor web.
- Review này chưa có phiên thực nghiệm với người học, thiết bị trợ giúp hay VoiceOver/NVDA. Bài test trình duyệt và phản hồi sử dụng thực tế vẫn cần thiết.

## Tài liệu đối chiếu

- W3C APG — [Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/): vai trò, quan hệ giữa tab/panel và điều hướng bàn phím.
- W3C — [No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html): cách người dùng rời component dùng phím đặc biệt phải rõ ràng.
- W3C — [Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): tham chiếu kích thước và khoảng cách vùng tương tác; không suy ra chứng nhận toàn trang từ một vài kích thước nút.
