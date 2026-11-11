# Desktop — rà soát và mở rộng khóa học

## Nội dung đã bổ sung

Giữ nguyên sáu bài hiện có và thêm 12 bài, chia thành sáu chương: kiến trúc/IPC; lưu trữ và import; tác vụ nền; cửa sổ và quyền; migration và phát hành; chất lượng sản phẩm. Mỗi bài mới có 410–441 từ phần lý thuyết, ví dụ tự kiểm chứng, bài tập Rust chạy trên trình duyệt, gợi ý và câu hỏi. Không yêu cầu người học mở trang khác để hiểu bài.

Ba dự án có mã Cargo đầy đủ, test âm, các mốc nghiệm thu và bốn nhóm rubric: ứng dụng ghi chú Tauri có revision và ghi tệp tạm; engine tìm kiếm tệp có ngân sách; công cụ kiểm toán workspace dùng SHA-256 và manifest. Bài tập cuối cần người học bổ sung UI, hủy tác vụ và đóng gói từ nền tảng được cung cấp; không gọi bộ CLI mẫu là một ứng dụng desktop thương mại hoàn chỉnh.

12 câu đánh giá tình huống phân bố đều sáu chương, sáu kỹ năng có bằng chứng bài học/dự án. Hai mô phỏng tương tác mô tả ghi dữ liệu và kết quả tác vụ đến muộn, mỗi mô phỏng có nhánh thành công/thất bại và bốn bước.

## Khoảng trống được xử lý

Đã bổ sung idempotency sau timeout, saved/draft/revision, import dựa trên snapshot, atomic publication so với durability, bounded traversal, progress coalescing, cancellation hợp tác, multiwindow reconciliation, capability/CSP, migration và rollback dữ liệu, kiểm tra artifact, đo độ trễ IPC/render, manifest không hoàn chỉnh. Câu hỏi và rubric yêu cầu đưa ra bằng chứng vận hành thay vì chỉ đạt điểm trắc nghiệm.

## Nguồn chính thức đã đối chiếu

- https://v2.tauri.app/concept/inter-process-communication/ — command trả kết quả, event chỉ là thông điệp một chiều.
- https://v2.tauri.app/reference/acl/capability/ — quyền gắn với cửa sổ/webview và lệnh.
- https://v2.tauri.app/learn/security/capabilities-for-windows-and-platforms/ — phạm vi cửa sổ và nền tảng.
- https://v2.tauri.app/develop/calling-rust/ — handler, state và dữ liệu qua IPC.
- https://doc.rust-lang.org/std/fs/fn.rename.html — ranh giới filesystem, khác biệt nền tảng.
- https://doc.rust-lang.org/std/fs/struct.File.html — sync_all không đồng nghĩa với mọi bảo đảm của filesystem.

Nguồn ở trường reference là tài liệu biên soạn/đối chiếu, không phải một bước bắt buộc trong luồng học.

## Kiểm chứng

Ngày 2026-11-10 trên máy Mac: 12/12 solutionCode biên dịch bằng rustc 1.99.1, edition 2024; assertion và stdout mong đợi đạt. Kiểm tra cấu trúc đảm bảo 18 ID bài được chia chính xác vào sáu chương, không trùng. TypeScript kiểm tra file expansion bằng strict/noEmit thành công. Kết quả chi tiết ở work/expansion-desktop/validation.json (thư mục work không đưa vào Git).

Cargo localLab được giao cho lượt kiểm thử tập trung của root; báo cáo này không khẳng định đã chạy UI/native packaging. Tauri giữ phiên bản đã có trong dự án (2.12.5, tauri-build 2.7.4), tái sử dụng build.rs tạo icon đã được xác nhận.

## Giới hạn và chuẩn đầu ra

Mutex/revision bảo vệ trong một process; không thay thế khóa giữa nhiều process. Atomic rename không tự tạo bảo đảm sống sót qua mất điện trên mọi filesystem. Scanner là chuỗi quan sát, không phải snapshot nguyên tử của toàn bộ ổ đĩa. Capability và CSP không thay thế kiểm tra dữ liệu trong handler. Cần kiểm thử cửa sổ thật, quyền filesystem, app signing, installer/update và backup/restore trên từng hệ điều hành đích trước khi phát hành. Rubric là tự nghiệm thu năng lực và bằng chứng dự án, không phải chứng nhận đủ cho mọi công việc.

## Ma trận đầu ra → bài học → bằng chứng

| Đầu ra | Bài học | Bằng chứng dự án |
| --- | --- | --- |
| IPC và dữ liệu có revision | desktop-command-contract, desktop-document-model | notes: conflict test, bản nháp giữ khi request trả muộn |
| Lưu và import có điều kiện | desktop-atomic-save, desktop-import-workflow | notes: size/corrupt/escape roundtrip, tệp tạm và revision |
| Công việc nền hữu hạn | desktop-cancel-progress, desktop-search-project | search: entry/byte/result budget và symlink test |
| Đồng bộ cửa sổ/quyền | desktop-multiwindow, desktop-preview | Tauri capability, yêu cầu snapshot/revision và UI preview |
| Dữ liệu và release | desktop-schema-migration, desktop-upgrade-policy | migration/rollback plan, artifact platform/architecture checks |
| Hiệu năng và chẩn đoán | desktop-measurement, desktop-workspace-project | SHA-256 manifest, incomplete scan rejection, báo cáo độ trễ |

Cập nhật kiểm thử 2026-11-11: root xác nhận cả ba Cargo localLab mới (Tauri notes, search và workspace auditor) đã qua lượt kiểm thử tập trung. Điều này không thay thế kiểm thử UI native, ký ứng dụng hoặc installer trên từng nền tảng.

Rà đáp án 2026-11-11: 12 quiz mới và 12 câu đánh giá mỗi nhóm đều có bốn đáp án đúng ở mỗi vị trí 0/1/2; thứ tự đã xáo, không lặp vòng 0-1-2. Đổi options cùng correct, giữ nguyên ý trả lời và giải thích. Strict TypeScript của cả năm expansion tiếp tục PASS sau lượt rà.

Rà UX nội dung chương: thay 12 outcome trùng mô tả hoặc chung chung bằng các kết quả cụ thể về DTO, revision, file tạm, nhập dữ liệu, cancellation, ngân sách tìm kiếm, capability, snapshot, migration, artifact, đo lường và manifest. Mỗi chương giữ hai outcome khác mô tả.
