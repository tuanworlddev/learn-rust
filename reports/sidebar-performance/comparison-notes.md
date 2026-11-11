# So sánh hiệu năng điều hướng trước và sau sửa

Báo cáo máy đọc: [comparison.json](comparison.json). Dữ liệu gốc: [baseline.json](baseline.json) và [after.json](after.json).

Baseline dùng build T2Y3CjQ9W2N5DahE14q0z; bản cuối sau sửa dùng build iOQPdKY4IKUDQq02ucgt8. Cả hai báo cùng checkout base vì thay đổi chưa commit lúc đo. Build ID được đọc từ Flight response của server đang phục vụ request. Lượt đo cuối đã bao gồm bản sửa focus và cuộn sidebar theo khóa.

## Kết quả chính

Sáu soft navigation đã đo không gửi lại chỉ mục 314 bài trong shared layout. RSC giảm 72,7–95,93% byte thô tùy trang. JavaScript tham chiếu khi tải trang đầu giảm 31,84–37,66% byte thô. Ba trang HTML đầu tăng nhẹ dưới 1%; median HTTP ở khóa Backend tăng trong lượt đo cuối, nên không kết luận mọi response hoặc mọi trang đều nhanh hơn.

## Payload khi chuyển trang

| Trang đích | RSC trước | RSC sau | Giảm thô | Gzip ước lượng trước → sau |
| --- | ---: | ---: | ---: | ---: |
| Khóa nền tảng | 231.288 B | 11.605 B | 94,98% | 57.349 → 2.298 B |
| Ownership | 228.890 B | 9.317 B | 95,93% | 58.137 → 3.295 B |
| Khóa Backend | 252.403 B | 35.514 B | 85,93% | 64.436 → 10.656 B |
| Ranh giới nghiệp vụ | 257.603 B | 12.323 B | 95,22% | 66.257 → 4.125 B |
| Outbox | 259.385 B | 14.101 B | 94,56% | 66.679 → 4.428 B |
| Capstone Backend | 337.406 B | 92.125 B | 72,7% | 90.504 → 28.206 B |

RSC dùng source route /bai-hoc/backend-http, router tree thực của từng build, serializer và cache-busting helper từ bản Next đang cài. Tree sau sửa chứa (learn); request có rsc, next-router-state-tree, next-url và query _rsc phù hợp. Đây là payload soft navigation khi shared layout đã tồn tại.

Baseline có cả ba marker "id":"hello-rust", "id":"wasm-bindings", "id":"game-ecs" trong mỗi RSC; bản cuối không còn marker nào ở cả sáu route. Source cho thấy layout giữ CourseProvider và LearningApp, leaf chỉ gửi navigationVersion cùng dữ liệu trang; bài thông thường không gửi full currentTrack. Marker chỉ là ba điểm kiểm chứng, không phải quét đủ 314 ID; kết luận dựa trên cả source boundary, tree và payload.

Lần vào trang trực tiếp vẫn cần chỉ mục. router.refresh() khi navigationVersion đổi có thể tải lại layout để đồng bộ publication; đó là hành vi cập nhật có chủ đích và nằm ngoài ca soft navigation với publication không đổi.

## Thời gian HTTP đã ấm

| Trang đích | RSC TTFB median trước → sau | RSC TTFB p95 trước → sau | Nhận đủ body median trước → sau |
| --- | ---: | ---: | ---: |
| Khóa nền tảng | 2,2 → 1,05 ms | 3,07 → 1,15 ms | 2,38 → 1,11 ms |
| Ownership | 2,04 → 0,84 ms | 2,91 → 0,94 ms | 2,18 → 0,92 ms |
| Khóa Backend | 1,98 → 2,66 ms | 2,29 → 13,72 ms | 2,08 → 2,88 ms |
| Ranh giới nghiệp vụ | 2,2 → 0,6 ms | 3,42 → 0,77 ms | 2,3 → 0,64 ms |
| Outbox | 2,25 → 0,72 ms | 3,34 → 1,47 ms | 2,35 → 0,76 ms |
| Capstone Backend | 2,23 → 0,76 ms | 3,58 → 0,9 ms | 2,41 → 0,82 ms |

Khóa Backend có TTFB median 1,98 → 2,66 ms trong lần đo cuối, dù payload giảm. Các giá trị local nhỏ biến động theo lịch CPU và request; không dùng chúng để khẳng định mọi route đều nhanh hơn. Mỗi ca có 3 warm-up và 8 mẫu tuần tự trên loopback, không giới hạn CPU/mạng. TTFB tính đến header, tổng đến khi nhận đủ body. p95 nearest-rank với tám mẫu không phải SLO. Không đo INP, LCP, click-to-paint hoặc React commits.

## HTML tải trực tiếp

| Trang | HTML trước | HTML sau | Thay đổi thô | Gzip ước lượng trước → sau |
| --- | ---: | ---: | ---: | ---: |
| Khóa nền tảng | 353.533 B | 355.815 B | +0,65% | 68.847 → 69.649 B |
| Ownership | 300.675 B | 303.426 B | +0,91% | 68.838 → 69.525 B |
| Khóa Backend | 312.522 B | 315.186 B | +0,85% | 70.982 → 71.693 B |
| Ranh giới nghiệp vụ | 320.199 B | 295.752 B | -7,63% | 75.514 → 68.714 B |
| Outbox | 325.513 B | 301.072 B | -7,51% | 76.354 → 69.475 B |
| Capstone Backend | 514.123 B | 386.418 B | -24,84% | 126.197 → 94.309 B |

Khóa nền tảng, ownership và khóa Backend tăng khoảng 0,65–0,91% HTML thô. Bài domain/outbox giảm khoảng 7,5%; capstone giảm 24,84%. Lần vào đầu vẫn phải dựng shell, dữ liệu chỉ mục và các module cho trang.

## JavaScript và CSS ban đầu

| Trang | JS trước | JS sau | Giảm JS thô | Gzip JS trước → sau | CSS thô sau |
| --- | ---: | ---: | ---: | ---: | ---: |
| Khóa nền tảng | 1.017.706 B | 634.450 B | 37,66% | 300.837 → 199.338 B | 120.357 B |
| Ownership | 1.017.706 B | 693.696 B | 31,84% | 300.837 → 216.956 B | 154.182 B |
| Khóa Backend | 1.017.706 B | 641.380 B | 36,98% | 300.837 → 200.942 B | 137.909 B |
| Ranh giới nghiệp vụ | 1.017.706 B | 693.696 B | 31,84% | 300.837 → 216.956 B | 154.182 B |
| Outbox | 1.017.706 B | 693.696 B | 31,84% | 300.837 → 216.956 B | 154.182 B |
| Capstone Backend | 1.017.706 B | 693.696 B | 31,84% | 300.837 → 216.956 B | 154.182 B |

Mỗi trang trước sửa tham chiếu 14 JS/CSS asset tổng cộng; sau sửa là 14–17 do tách chunk. Byte giảm dù một số route tham chiếu nhiều file hơn. Asset dùng cache immutable một năm. Đây là tổng file tham chiếu từ HTML, không phải lượng JS tải lại mỗi click, cũng không phải thời gian parse/evaluate đo trong trình duyệt.

Gzip level 6 và Brotli quality 4 được tính offline trên bytes response; không phải wire bytes. Server vẫn thương lượng gzip thành công.

## Cache nội dung Supabase

Phép đo riêng: [revalidation-notes.md](revalidation-notes.md). Sau TTL và publication không đổi, response từ Supabase giảm từ 2.945.450 B JSON sau giải nén xuống 68 B. Median ba mẫu từ 1.118,79 ms xuống 364,62 ms. Reader giữ snapshot đã validate, chỉ kiểm revision/release; cold start vẫn cần full catalog. Loader không đổi trong hai sửa UI cuối nên không đo lại nhánh này. Các số không lấy từ loạt warm navigation trên.

## Phạm vi và kiểm tra riêng

Báo cáo xác nhận response/payload và data boundary trên sáu route đại diện. DOM sidebar, chương mở, focus, cuộn, theme, dữ liệu học và animation cần kết quả Browser độc lập. Không suy ra các hành vi đó chỉ từ TTFB hoặc payload; không dùng số local để cam kết tốc độ VPS/thiết bị di động.

Benchmark HTTP cuối kết thúc 12:08:42 11/11/26 (giờ Việt Nam, UTC+7). Việc tổng hợp sau đó chỉ đọc file/source và ghi hai báo cáo so sánh; không tạo thêm HTTP request.
