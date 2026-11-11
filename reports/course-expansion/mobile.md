# Mobile và thư viện dùng chung — khóa chuyên sâu

Giữ sáu bài cũ, thêm 12 bài mới (400–418 từ lý thuyết/bài), chia sáu chương/18 bài. Có 12 bài tập std-only với assert/stdout cố định, 12 câu đánh giá tình huống, sáu kỹ năng có bằng chứng, ba dự án và hai mô phỏng hai nhánh/bốn bước.

## Ma trận đầu ra → bài học → bằng chứng

| Đầu ra | Bài học | Bằng chứng dự án |
| --- | --- | --- |
| Miền dữ liệu có đơn vị/ID | mobile-domain-values, mobile-boundary-design | ExpenseBook: số nguyên, input limit, snapshot invariant |
| Bridge và owner | mobile-object-lifetime, mobile-expense-project | UniFFI Object/Record/Error, mutex, concurrent writer test |
| Artifact đúng target | mobile-artifact-matrix, mobile-contract-tests | Manifest target/ABI, lệnh sinh Swift/Kotlin, fixture native cần chạy |
| Lifecycle và background | mobile-cancellation-protocol, mobile-background-sync | Generation/terminal gate, checkpoint/outbox, native expiration test |
| Offline và conflict | mobile-outbox-project, mobile-conflict-resolution | File persistence, lost ACK/restart, operation ID không tái sử dụng |
| Sản phẩm nhiều thiết bị | mobile-observability, mobile-catalog-project | Conflict/tombstone/retry/stale page, đo FFI/native và bộ artifact |

Ba localLab độc lập: mobile_expense xuất object qua UniFFI 0.32.2; mobile_outbox dùng serde/JSON với snapshot nguyên tử theo phạm vi một owner và fake server; mobile_catalog xuất engine qua UniFFI có revision, idempotency và phân trang. Mỗi dự án có bốn rubric (hai critical), ba mốc, bốn test case và bốn deliverable. Lệnh sinh binding dùng host macOS đang làm việc; README giải thích .so/.dll và target native khác.

## Khoảng trống được xử lý

Thêm scalar/grapheme, đơn vị tiền/thời gian, batch và snapshot nhất quán, owner native, callback reentrancy/deadlock, device/simulator/ABI, contract fixture, cancellation so với generation, process death, scheduling nền tảng, outbox atomicity, ACK mất, idempotency gắn payload, tombstone, conflict có lựa chọn, phân trang theo revision, p95 và dữ liệu log có giới hạn. Nội dung/README tự chứa các hợp đồng, phép thử và các bước tích hợp; reference không là bước bắt buộc để học tiếp.

## Nguồn chính thức đã đối chiếu

- https://mozilla.github.io/uniffi-rs/latest/types/interfaces.html — Arc/object, constructor, Send/Sync và ownership.
- https://mozilla.github.io/uniffi-rs/latest/types/records.html — kiểu record và việc truyền giá trị.
- https://mozilla.github.io/uniffi-rs/latest/proc_macro/errors.html — enum lỗi và Result qua binding.
- https://mozilla.github.io/uniffi-rs/latest/kotlin/lifetimes.html — close/use, object lồng và cleanup.
- https://mozilla.github.io/uniffi-rs/latest/futures.html — cancellation cần hợp đồng riêng của thư viện.
- https://mozilla.github.io/uniffi-rs/latest/tutorial/foreign_language_bindings.html — sinh source không thay việc build/package native.
- https://mozilla.github.io/uniffi-rs/latest/internals/lifting_and_lowering.html — chuyển đổi dữ liệu qua FFI.
- https://doc.rust-lang.org/rustc/platform-support/apple-ios.html — phân biệt iOS device/simulator và SDK.
- https://developer.android.com/develop/background-work/background-tasks/persistent — WorkManager và công việc bền qua restart.
- https://developer.apple.com/documentation/backgroundtasks.md — framework scheduling background, đăng ký handler và thời hạn.
- https://doc.rust-lang.org/std/fs/fn.rename.html — giới hạn filesystem/nền tảng của công bố file.

## Kiểm chứng

2026-11-11: 12/12 solutionCode đạt rustc 1.99.1 edition 2024, assert/stdout đúng. Chapter partition kiểm tra đủ 18 ID, không trùng. Strict TypeScript/noEmit đạt. Kết quả ở work/expansion-mobile/validation.json. Cargo và sinh binding được root kiểm tra tập trung; báo cáo không khẳng định trước kết quả đó.

## Giới hạn nền tảng và chuẩn nghiệm thu

ExpenseBook và Catalog giữ RAM. Outbox có persistence nhưng một owner/process; không tự có khóa nhiều process, database transaction hoặc đầy đủ power-loss durability trên mọi filesystem. Fake server giữ idempotency trong RAM để minh họa; server thật phải lưu cùng nghiệp vụ. Catalog là engine có thẩm quyền trong host test, chưa tự là server mạng hay ứng dụng iOS/Android hoàn chỉnh.

Chưa chạy Xcode simulator, thiết bị iOS/Android, packaging NDK/XCFramework, lifecycle OS thực hoặc phép đo native heap. Các bước đó được ghi rõ trong lab/rubric và là bằng chứng cần hoàn thiện khi đưa sản phẩm lên nền tảng. Không gọi source binding đã sinh là ứng dụng native đã kiểm chứng. Chuẩn đầu ra là tự nghiệm thu năng lực qua project và bằng chứng, không bảo đảm việc làm hay đủ cho mọi sản phẩm mobile.

Cập nhật kiểm thử tập trung: root xác nhận cả năm Cargo localLab của mobile (cũ và mới) đã PASS. Phạm vi này vẫn là host Cargo; các bước simulator/device/packaging vẫn cần bằng chứng native riêng như ghi ở trên.

Rà đáp án 2026-11-11: 12 quiz mới và 12 câu đánh giá mỗi nhóm đều có bốn đáp án đúng ở mỗi vị trí 0/1/2; thứ tự đã xáo, không lặp vòng 0-1-2. Đổi options cùng correct, giữ nguyên ý trả lời và giải thích. Strict TypeScript của cả năm expansion tiếp tục PASS sau lượt rà.

## Bổ sung consumer Swift/Kotlin thực thi

ExpenseBook và Catalog mỗi lab có 13 file, trong đó thêm tám file consumer/cấu hình: Swift main, Kotlin Smoke, settings/build Gradle, host-env, script smoke Swift/Kotlin và consumers/NATIVE.md. Các script dùng đúng Cargo project làm cwd, tôn trọng CARGO_TARGET_DIR, build library, sinh lại binding, compile và chạy qua FFI. Swift khai báo modulemap/header, library và rpath; Kotlin khai báo generated source set, JVM target 17 và JNA JAR 5.19.1. Kotlin plugin 2.4.21 hỗ trợ Gradle 9.6.1 đang có trên host. Không yêu cầu cài toolchain Java khác.

Fixture ExpenseBook bao gồm constructor, Unicode, add/snapshot, Conflict giữ state nguyên và remove. Fixture Catalog thêm page, retry không tăng revision và StaleSnapshot. Cả hai ngôn ngữ bắt enum/class lỗi thật; Kotlin đóng handle bằng use. Hai localLab đã có lệnh chạy và rubric yêu cầu log bridge thực thi. Hướng dẫn native tự chứa lệnh build static library device/simulator, ghép XCFramework với module.modulemap, build/copy Android ABI bằng NDK linker và dependency Android JNA 5.19.1@aar. Host consumer chưa thay bằng chứng XCTest/instrumented test trên simulator/device.

Nguồn chính thức bổ sung:

- https://mozilla.github.io/uniffi-rs/latest/kotlin/gradle.html — JNA tối thiểu 5.12.0, Android dùng AAR, unsigned types và coroutine khi có async API.
- https://mozilla.github.io/uniffi-rs/latest/swift/module.html — compile/link Swift, modulemap và quy ước XCFramework.
- https://kotlinlang.org/docs/gradle-configure-project.html — KGP 2.4.21, dải Gradle được hỗ trợ và JVM target nhất quán.
- https://github.com/java-native-access/jna/blob/master/README.md — runtime JNA và bản phát hành được khóa.

2026-11-11: root đã compile và thực thi thành công cả bốn consumer ExpenseBook Swift/Kotlin và Catalog Swift/Kotlin trên macOS với Swift 6.4.2, Gradle 9.6.1 và Homebrew JDK 26.0.1. Log reports/course-expansion/mobile-consumers.json, process 343472ff-9508-4fdd-a19b-07731d3133ac exit 0. Constructor, mutation, snapshot/page, Conflict giữ nguyên state, remove, retry và StaleSnapshot đều PASS theo fixture tương ứng. MB-01 được xử lý bằng consumer chạy thật, Gradle/JNA và hướng dẫn native đi kèm. Phạm vi là macOS/JVM; chưa kiểm thử simulator/device iOS/Android. Sinh binding cả hai thư viện và cả năm Cargo localLab cũng đã PASS. Sau kiểm thử, thêm --no-format đã xác minh có trong help của UniFFI 0.32.2 để generator không cần ktlint/Swift formatter ngoài; thay đổi này chỉ bỏ định dạng source, không đổi hợp đồng hoặc logic consumer.
