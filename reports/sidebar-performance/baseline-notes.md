# Baseline điều hướng và payload

Ngày đo: 11/11/2026. Runtime production trên loopback `http://127.0.0.1:3000`, đọc nội dung Supabase. Build đang chạy: `T2Y3CjQ9W2N5DahE14q0z`; checkout base `594a75907e0829a14a02fdd19c029bce22b2226d`.

## Phương pháp

[check-navigation-performance.mjs](../../scripts/check-navigation-performance.mjs) kiểm 6 đường dẫn, mỗi đường dẫn gồm HTML tải trực tiếp và RSC khi điều hướng từ `/bai-hoc/backend-http`. Mỗi ca có 3 lượt warm-up và 8 mẫu đo tuần tự. Báo cáo đầy đủ: [baseline.json](baseline.json).

RSC dùng router tree thực do server trả về, khôi phục token `$undefined`, rồi gọi serializer và hàm tạo `_rsc` query của đúng bản Next đang cài. Request có `rsc`, `next-router-state-tree` và `next-url`; đây không phải payload toàn bộ cây khi chỉ gửi `RSC: 1`.

TTFB đo đến khi nhận header; tổng thời gian đo đến khi nhận đủ body. Đo trên loopback, không giới hạn CPU/mạng, dùng `Accept-Encoding: identity`. Gzip level 6 và Brotli quality 4 là kích thước nén tính offline trên body đại diện, không phải byte truyền thực tế của trình duyệt. Server có thương lượng gzip thành công. p95 là nearest-rank trên 8 mẫu, không phải SLO sản phẩm.

## Payload điều hướng trước sửa

| Trang đích | RSC thô | Gzip ước lượng | TTFB median | TTFB p95 |
| --- | ---: | ---: | ---: | ---: |
| Khóa nền tảng | 231.288 B | 57.349 B | 2,20 ms | 3,07 ms |
| Bài ownership | 228.890 B | 58.137 B | 2,04 ms | 2,91 ms |
| Khóa Backend | 252.403 B | 64.436 B | 1,98 ms | 2,29 ms |
| Ranh giới nghiệp vụ | 257.603 B | 66.257 B | 2,20 ms | 3,42 ms |
| Outbox | 259.385 B | 66.679 B | 2,25 ms | 3,34 ms |
| Capstone Backend | 337.406 B | 90.504 B | 2,23 ms | 3,58 ms |

Cả 6 response RSC đều chứa bản tóm tắt `hello-rust`, `wasm-bindings` và `game-ecs`. Đối chiếu `LearningPage` trước sửa cho thấy mỗi route gửi lại 314 lesson summaries, specialization summaries, lesson hiện tại và full track hiện tại qua `CourseProvider`.

HTML trực tiếp nằm trong khoảng 300.675–514.123 B, median TTFB 6,20–8,79 ms ở snapshot đã ấm. Lượt đo không chứng minh request đầu sau TTL Supabase cũng nhanh như vậy.

## JavaScript và CSS tải ban đầu

Mỗi trang được đo tham chiếu cùng 11 file JavaScript và 3 CSS:

- JavaScript: 1.017.706 B thô; 300.837 B gzip ước lượng.
- CSS: 182.736 B thô; 31.185 B gzip ước lượng.
- Asset có `Cache-Control: public, max-age=31536000, immutable`. Đây là phạm vi tải/parse ban đầu; không được diễn giải rằng trình duyệt tải lại 1 MB JavaScript ở mọi lần nhấn bài.

Chunk 247.077 B thô / 64.202 B gzip chứa Supabase. `AccountSettings` được import tĩnh vào shell nhưng chỉ mount khi mở cài đặt; tải component này theo nhu cầu là cơ hội giảm bundle khởi động. Chunk ứng dụng 184.993 B chứa cả giao diện phỏng vấn, trình soạn thảo và danh mục khóa, nên tách phần nội dung theo trang cũng có thể giảm lượng mã ban đầu.

## Kết luận trong phạm vi đo

1. Server đã ấm không có dấu hiệu là nút thắt CPU rõ ràng trong phép đo này. Response điều hướng vẫn mang lại toàn bộ chỉ mục khóa học và full track không cần thiết cho bài đang mở.
2. Đưa shell/sidebar và navigation context vào layout dùng chung sẽ giữ vòng đời giao diện, trạng thái chương mở và vị trí cuộn. Leaf chỉ cần dữ liệu bài/trang hiện tại. RSC phải được đo lại với router tree mới để chứng minh shared layout không được truyền lại.
3. Chỉ số HTTP không xác nhận sidebar giữ nguyên DOM, animation mượt, focus, click-to-paint, INP hay LCP. Những điểm đó cần bằng chứng Browser riêng của root.
4. Catalog Supabase được giữ tối đa 30 giây trong bộ nhớ, rồi tải và validate lại. Baseline HTTP này không bảo đảm cache lạnh; phép đo loader tách riêng dưới đây lượng hóa chi phí tải snapshot. Tối ưu lớp này phải giữ quy tắc fail-closed của nội dung.

Lệnh đo sau khi thay build:

```sh
node scripts/check-navigation-performance.mjs --base http://127.0.0.1:3000 --label after --warmup 3 --samples 8 --output reports/sidebar-performance/after.json
```

## Loader Supabase khi chưa có cache

Báo cáo [supabase-cold-baseline.json](supabase-cold-baseline.json) gọi trực tiếp `fetchPublishedCatalog` hiện tại 3 lần, trong một Node process tách biệt, bỏ qua wrapper cache. Không restart server, không sửa loader hoặc dữ liệu Supabase. Cấu hình publishable được đọc vào biến từ endpoint loopback; không lưu hoặc in khóa.

| Lượt | Request | JSON sau giải nén | TTFB | Đọc hết response | Fetch + parse + validate |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 1 | 2.945.450 B | 1.393,64 ms | 1.904,08 ms | 1.932,94 ms |
| 2 | 1 | 2.945.450 B | 557,89 ms | 1.103,49 ms | 1.118,79 ms |
| 3 | 1 | 2.945.450 B | 455,40 ms | 799,02 ms | 825,55 ms |

Cả 3 lượt HTTP 200, validate 314 bài và 13 hướng, cùng SHA catalog. Response dùng gzip, nhưng byte đo qua Fetch là byte đã giải nén; đây không phải kích thước truyền trên mạng. Lượt đầu có thể bao gồm thiết lập kết nối DNS/TLS, các lượt sau có thể dùng lại kết nối. Median tổng là 1.118,79 ms; 3 mẫu không đủ đại diện cho độ trễ production hoặc SLO.

Chi phí tải lại toàn bộ catalog đáng được tối ưu khi cache hết hạn. Con số này là chi phí loader không có cache, không phải thời gian của mọi lần người học nhấn sidebar. Tách kiểm tra revision thành response nhỏ có thể tránh tải lại gần 3 MB JSON và validate khi nội dung không đổi. Độ trễ request metadata còn phải đo; không thể dự báo toàn bộ khoản tiết kiệm chỉ từ số byte. JSON parse/validate sau khi đọc xong chỉ chiếm khoảng 15–29 ms trong 3 lượt, còn phần lớn thời gian nằm ở mạng/response.

Nếu triển khai kiểm tra revision, cần giữ snapshot xuất bản nguyên vẹn: chỉ tái sử dụng catalog khi revision khớp; khi thay đổi, tải joined publication và dùng revision đi cùng chính catalog nhận được. Không ghép revision từ lần kiểm tra trước với catalog tải sau, vì publication có thể đổi giữa hai request. Khi kiểm tra lỗi, vẫn giữ hành vi fail-closed đã có cho nội dung hết hạn.
