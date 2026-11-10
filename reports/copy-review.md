# Rà soát nội dung giao diện Learn Rust

Ngày: 2026-11-10 UTC

## Phạm vi

Đã đọc các trang học, thực hành, dự án, sổ tay và phỏng vấn qua `learning-views.tsx`, `code-lab.tsx`, `career-hub.tsx`; rà dữ liệu hiển thị từ `career.ts`. Đã đọc thêm `learning-app.tsx`, `learning-shared.tsx`, `learning-dashboard.tsx`, `app/page.tsx`, `app/layout.tsx` và thông báo lỗi của API để bàn giao các phần do agent tích hợp phụ trách.

## Thay đổi

| Khu vực | Kết quả |
| --- | --- |
| Trình soạn thảo | Xóa toàn bộ “Biên dịch qua Rust Playground. Không nhập dữ liệu bí mật.” và CSS/ARIA chỉ phục vụ ghi chú này. |
| Thực hành | Xóa “Mỗi ví dụ có bản nháp riêng. Dùng dữ liệu mẫu trong mã; chưa hỗ trợ stdin tương tác.” |
| Bài học | Bỏ lời nhắc lặp về cách nút kiểm tra hoạt động và điều kiện hoàn thành; trạng thái bài tập, câu hỏi và nút hoàn thành vẫn rõ. |
| Kết quả thực hành | Giữ “Đã vượt qua kiểm tra mẫu.”; bỏ đoạn giải thích lặp bên dưới. Giữ cảnh báo mã thay đổi, lỗi biên dịch và đầu ra mong đợi khi sai. |
| Bản nháp | Bỏ nhãn lưu tự động thường trực và mô tả nơi lưu. Chỉ hiện lỗi không lưu được bản nháp khi có lỗi. |
| Lời giải | Rút gọn phản hồi thành “Đã chèn lời giải.”; giữ mã, gợi ý và hành vi chèn. |
| Sổ tay | Bỏ lời nhắc lưu trong trình duyệt/tải bản sao dưới ô ghi chú. Nút tải ghi chú và trạng thái rỗng vẫn còn. |
| Dự án | Bỏ mô tả về cấu trúc editor một tệp. Liên kết sang “Phỏng vấn” dùng route `phong-van`. Giữ yêu cầu, assertion, đầu ra và nội dung kỹ thuật. |
| Phỏng vấn | Đổi H1 thành “Phỏng vấn Rust”, mở danh sách câu hỏi trước. Bỏ lời dẫn lặp, ghi chú bảo đảm tuyển dụng và ghi chú không cấp chứng chỉ. |
| Tự chấm | Đưa thang 0–3 vào phần mở rộng “Tự chấm câu trả lời”; giữ các tiêu chí học tập, hỗ trợ bàn phím và reduced motion. |
| Lộ trình nghề nghiệp | Dùng tiêu đề ngắn “Lộ trình Rust backend”; liên kết ôn tập thành `/bai-hoc/{id}`. |
| Bằng chứng | Rút gọn nhãn, thông báo xác nhận và tải xuống. Giữ yêu cầu tối thiểu 40 ký tự, lỗi đọc/lưu, thao tác tải bản sao và trạng thái tự đánh giá. |
| Nội dung dự án thực tế | Bỏ câu giới thiệu về lab/một tệp và ghi chú “lab chưa hoàn chỉnh” bị lặp. Giữ yêu cầu bổ sung phân quyền, kiểm thử, shutdown, backup, TLS và cấu hình. |

Không thay nội dung lý thuyết Rust, code mẫu, đáp án chuyên môn, yêu cầu bài tập hay tiêu chí kỹ thuật. Kiểm tra đầu ra mẫu vẫn chỉ được gọi là kiểm tra mẫu; dữ liệu xuất đánh giá vẫn mô tả đúng đây là tự đánh giá của người học.

## Các phần đã tích hợp vào bản production

- Nhãn điều hướng “Đi làm” và route cũ trong `learning-shared.tsx`/`learning-app.tsx`: chuyển sang “Phỏng vấn” và `/phong-van`.
- Bỏ mô tả nơi lưu tiến độ trong Cài đặt; giữ câu xác nhận xóa dữ liệu vì người học cần biết phạm vi thao tác.
- Bỏ dòng “Tìm theo tên bài hoặc khái niệm” trong footer tìm kiếm vì đã được diễn đạt ở placeholder/nhãn.
- Đã bỏ hai toast vượt qua kiểm tra mẫu bị lặp; giữ trạng thái kết quả tại chỗ trong CodeLab.
- Đã đổi thông báo lỗi API sang “Trình biên dịch”; liên kết chạy dự phòng chỉ xuất hiện khi dịch vụ lỗi.

## Kiểm tra

- `tsc --noEmit --incremental false`: đạt.
- Tìm lại các câu bị yêu cầu xóa trong ba component và `career.ts`: không còn.
- ESLint trên bốn tệp TypeScript: còn ba lỗi `react-hooks/set-state-in-effect` ở cơ chế hydration/lưu localStorage đã có trước chỉnh sửa (hai ở CareerHub, một ở CodeLab); chưa thay cơ chế lưu trong lượt làm sạch copy này.
- Kiểm tra lại ESLint với riêng quy tắc trên tắt: đạt; không có lỗi thuộc các quy tắc khác.
- Giữ các nhãn ARIA, tab/tabpanel, focus bàn phím, thông báo lỗi thực tế và phím tắt editor chỉ hiện khi focus.
- Đã kiểm tra Chrome sáng/tối và mobile 390 px sau khi tích hợp route; không tràn ngang. Cài đặt chỉ còn thao tác cần thiết khi chưa cấu hình tài khoản. Nút Chạy mã trả đúng kết quả mẫu; tìm kiếm, lọc câu hỏi và menu mobile hoạt động. HTTP scan 88 trang không còn các đoạn được yêu cầu xóa.
