# Kiểm tra publication và cache nội dung

## Thay đổi

`lib/content/source.mjs` giữ nguyên API `fetchPublishedCatalog(env, fetcher)`. Reader mặc định tải một joined snapshot gồm revision, release ID và catalog trong lần đầu. Sau 30 giây, reader chỉ đọc `revision,release_id`. Hai trường cùng giữ nguyên thì dùng lại catalog đã validate và gia hạn TTL; bất kỳ trường nào đổi thì đọc joined snapshot mới.

Revision và release ID được lưu cùng catalog từ chính joined response, không lấy từ request metadata trước đó. Vì vậy, một lần publish xảy ra giữa hai request không thể ghép catalog mới với revision cũ. Rollback sang release trước được nhận diện như mọi thay đổi publication.

Các reader đồng thời chia sẻ cùng một in-flight promise ở cả lần tải đầu và lần revalidation. Chỉ cập nhật TTL sau một lần kiểm tra thành công. Lỗi kết nối, HTTP, metadata thiếu/không hợp lệ, catalog thiếu/không hợp lệ đều reject; không trả content hết TTL khi kiểm tra thất bại. Lần gọi sau có thể kiểm tra lại và phục hồi.

Custom `load` injection tiếp tục hoạt động theo hợp đồng TTL cũ, không bắt caller cung cấp metadata. `env` và `fetcher` tùy chọn hỗ trợ kiểm thử mặc định mà không thay global process/fetch. `lib/course-content.ts` giữ React request cache và chỉ validate bundled catalog một lần mỗi server process, khi thực sự dùng nguồn bundled.

## Kết quả đo Supabase thực

Nguồn chi tiết: [supabase-cold-baseline.json](supabase-cold-baseline.json) và [supabase-revalidation-after.json](supabase-revalidation-after.json).

| Trường hợp | Số mẫu | Request mỗi lần | Byte JSON sau giải nén mỗi lần | Median tổng |
| --- | ---: | ---: | ---: | ---: |
| Loader cũ gọi không qua cache | 3 | 1 full catalog | 2.945.450 B | 1.118,79 ms |
| Reader mới sau TTL, publication giữ nguyên | 3 | 1 metadata | 68 B | 364,62 ms |

Lần tải đầu bằng reader mới vẫn tải và validate toàn bộ catalog: 2.945.450 B trong 1.807,04 ms. Ba lần revalidation lần lượt 373,03 / 364,62 / 139,44 ms; cả ba giữ nguyên object catalog. Catalog vẫn có 314 bài và 13 hướng, cùng SHA như baseline.

Trong các mẫu này, median revalidation giảm khoảng 67,4% và số byte JSON phải đọc giảm hơn 99,99%. Đây là các phép đo HTTPS tại máy local với cỡ mẫu nhỏ, không phải bảo đảm production hoặc thời gian nhấn sidebar. Byte được đếm qua Fetch sau giải nén; full response dùng gzip và metadata dùng Brotli. Không diễn giải các con số byte này là wire bytes.

Mỗi phép đo chạy trong Node process riêng. Benchmark mới tiêm đồng hồ monotonic và tăng 30 giây giữa các lượt để kích hoạt đúng nhánh hết TTL mà không cần ngủ; request HTTPS và mã loader là thật. Server đang chạy, DB và publication không bị thay đổi. Các key chỉ nằm trong biến bộ nhớ, không có trong stdout hoặc báo cáo.

Nếu publication đổi, reader cần một metadata request rồi một joined snapshot request; đây là chi phí thêm ở lần cập nhật nội dung so với chỉ full-fetch mỗi 30 giây. Lần khởi động process cũng vẫn cần tải full catalog. Đo browser và payload điều hướng sau khi build nằm ngoài phép đo này.

## Kiểm chứng

- `node --test lib/content/content.test.mjs`: 41/41 passed.
- Các test bao gồm unchanged, đổi revision, đổi release, revision giảm, rollback giữa schema 1/2, coalesce lúc tải đầu và hết TTL, không phục vụ stale khi metadata/full fetch lỗi, phục hồi sau lỗi, và race publication giữa metadata/full snapshot.
- Các test custom load cũ giữ nguyên và passed.
- ESLint cho source, declaration, course-content, content test và benchmark: passed.
- `git diff --check` trong các file sở hữu: passed.

Lệnh đo lại loader:

```sh
node scripts/check-content-revalidation.mjs --base http://127.0.0.1:3000 --output reports/sidebar-performance/supabase-revalidation-after.json
```

Lệnh đo lại HTML/RSC sau khi production build mới sẵn sàng:

```sh
node scripts/check-navigation-performance.mjs --base http://127.0.0.1:3000 --label after --warmup 3 --samples 8 --output reports/sidebar-performance/after.json
```
