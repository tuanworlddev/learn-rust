# Learn Rust

Website học Rust bằng tiếng Việt, kết hợp mục lục từ nền tảng đến nâng cao và thực hành ngay trong trình duyệt.

## Chạy trên máy local

Yêu cầu: Node.js 22.13 trở lên và npm. Rust cần cho việc kiểm tra toàn bộ lời giải, không cần để khởi động website.

```bash
npm ci
npm run dev:local
```

Mở http://localhost:3000. Server chỉ lắng nghe trên địa chỉ loopback của máy.

```bash
npm run build:local
npm run start:local
```

`dev:local`, `build:local` và `start:local` sử dụng Next.js trực tiếp. Các script `dev`, `build`, `start` có sẵn được giữ cho môi trường Sites cũ; không dùng để khởi chạy local theo hướng dẫn này.

## Lộ trình

20 chương, 80 bài học. Trang mục lục hiển thị toàn bộ các bài và cho phép lọc theo tên hoặc khái niệm.

1. Bắt đầu & Công cụ
2. Biến & Kiểu dữ liệu
3. Hàm & Luồng điều khiển
4. Ownership & Borrowing
5. Struct & Enum
6. Collections & Chuỗi
7. Option & Result
8. Tổ chức dự án
9. Generic & Trait
10. Closure & Iterator
11. Smart pointers
12. Lifetime nâng cao
13. Kiểm thử & Chất lượng
14. I/O & Dòng lệnh
15. Concurrency
16. Async & Future
17. Macro & Thuộc tính
18. Rust nâng cao
19. Thiết kế & Hiệu năng
20. Dự án tổng hợp

Mỗi bài có ba phần lý thuyết, ví dụ, mục tiêu, bài tập với mã khởi đầu, lời giải, gợi ý, kết quả mong đợi, câu hỏi và liên kết tài liệu Rust chính thức. Ba dự án thực hành riêng vẫn có trong mục Dự án.

Các bài Cargo/rustup/workspace/Clippy/doctest trình bày quy trình thực tế trên máy. Bài tập của chúng trên web được giới hạn và ghi rõ phạm vi một tệp. Ví dụ I/O và CLI dùng dữ liệu mẫu; phần async giải thích Future/Waker/Pin/executor bằng thư viện chuẩn, không giả định có Tokio hay hệ thống I/O bất đồng bộ trên web.

## Thực hành và chấm bài

Frontend gửi mã đến `/api/execute`. API chuyển yêu cầu đến `https://play.rust-lang.org/execute` với Rust stable, edition 2024, debug, chương trình bin. Vì vậy website chạy local nhưng nút Chạy mã/Kiểm tra vẫn cần Internet để dùng Rust Playground.

- Giới hạn mã 40.960 byte; giới hạn request 60.000 byte.
- Chờ tối đa 25 giây; lỗi trình biên dịch được trả về terminal.
- Kiểm tra bài: biên dịch và chạy thật, sau đó so sánh stdout (chuẩn hóa newline và khoảng trắng hai đầu).
- Các assertion trong mã mẫu kiểm tra thêm đầu vào. Người học cần giữ chúng; đối chiếu stdout không phải bộ chấm chống gian lận hoặc kiểm chứng đầy đủ mọi trường hợp.
- Một bài được đánh dấu hoàn thành sau khi bài thực hành đạt và câu hỏi đúng.
- Không thực thi mã người học tùy ý trên máy host của website.

## Giao diện

React 19, TypeScript, Next.js 16 và Tailwind CSS 4 qua PostCSS. Không dùng Tailwind CDN. Giao diện dùng utility classes và `@apply`, cùng CSS token cho light/dark.

- Nhãn sản phẩm: Learn Rust.
- Font hệ thống hỗ trợ tiếng Việt, không giãn ký tự. Nội dung bài 15px, code 13px.
- Sidebar chương/bài; trang mục lục đầy đủ; hai cột bài học/editor trên desktop.
- Mobile chuyển thành một cột và mục lục dạng drawer.
- Chuyển trang/tab nhẹ 160–180ms, mở chương 220ms, nút 150ms; tôn trọng `prefers-reduced-motion`.
- Nút sáng/tối lưu tùy chọn. Lần đầu theo giao diện hệ thống.
- Search, drawer và settings hỗ trợ bàn phím, Escape và focus trap.

## Dữ liệu người học

Tiến độ, câu trả lời, bài lưu, ghi chú và bản nháp lưu trong localStorage trên từng trình duyệt và từng origin. `localhost:3000`, `127.0.0.1:3000` và website đã xuất bản có vùng dữ liệu riêng. Chưa có tài khoản/đồng bộ nhiều thiết bị.

Các storage key `rustviet-learning-v1`, `rustviet-code-*` và `rustviet-playground-*` được giữ để không làm mất dữ liệu đã có ở cùng origin khi đổi thương hiệu. Theme dùng `learn-rust-theme`.

## Kiểm tra nội dung Rust

```bash
node scripts/validate-curriculum.mjs
```

Script biên dịch riêng từng lời giải bằng `rustc --edition=2024`, chạy các assertion và so sánh stdout. Kiểm tra 80 bài + 3 dự án. Kết quả được ghi vào `reports/curriculum-validation.json`. Các tệp chạy thử nằm trong thư mục tạm và được dọn sau khi kiểm tra.

```bash
npx tsc --noEmit
```

## Các file chính

- `components/learning-app.tsx`: điều hướng, theme, progress, tìm kiếm.
- `components/learning-dashboard.tsx`: mục lục đầy đủ.
- `components/learning-views.tsx`: bài học, dự án, sổ tay và playground.
- `components/code-lab.tsx`: editor, thực thi, kiểm tra, gợi ý.
- `src/data/curriculum.ts`: chương, thứ tự bài và 24 bài gốc.
- `src/data/curriculum-foundations.ts`: 20 bài nền tảng bổ sung.
- `src/data/curriculum-systems.ts`: 18 bài bộ nhớ/concurrency/async/nâng cao.
- `src/data/curriculum-practice.ts`: 18 bài công cụ/I/O/macro/thiết kế/dự án.
- `src/data/projects.ts`: 3 dự án riêng.
- `app/api/execute/route.ts`: proxy Rust Playground.

Nội dung lý thuyết được viết bằng tiếng Việt, có nguồn chính thức theo từng bài. Bố cục mục lục lấy cảm hứng từ LearnCpp và màn hình thực hành tham khảo Angular tutorial; không sao chép nội dung khóa học C++ hoặc Angular.
