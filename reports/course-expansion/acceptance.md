# Nghiệm thu mở rộng Learn Rust

Ngày cập nhật: 11/11/2026. Phạm vi: nội dung khóa học, thực hành, mô phỏng, review người học và các kết quả chạy có bằng chứng trong kho mã.

**Trạng thái nghiệm thu:** nội dung, kiểm thử, build web trên máy/Docker, runtime đọc Supabase, publication v2, SEO HTTP và 68 gói lab đều **PASS trong phạm vi ghi nhận**. Release đang xuất bản là `0a1d25ab-89c2-407e-88ba-1ef04eee78cb`, revision **2**, schema **2**. Chưa xác nhận responsive mobile hoặc triển khai VPS; phạm vi Git được ghi riêng bên dưới.

## 1. Phạm vi bàn giao

| Hạng mục | Số lượng và cách tính | Bằng chứng |
| --- | --- | --- |
| Bài học | **314** = 80 nền tảng + 234 chuyên sâu | [content-depth.json](content-depth.json) |
| Chương và khóa | **98 chương** = 20 nền tảng + 78 chuyên sâu; **13 khóa chuyên sâu**, mỗi khóa 6 chương × 18 bài | [content-depth.json](content-depth.json) |
| Dự án | **39 dự án chuyên sâu** + **3 dự án nền tảng** | [content-depth.json](content-depth.json), [projects.ts](../../src/data/projects.ts) |
| Cargo localLab | **68** bài có dự án tải về | [content-depth.json](content-depth.json) |
| Đánh giá cuối khóa | **156 câu tình huống**, 12 câu/khóa; năng lực gắn bài học và bằng chứng dự án | [content-depth.json](content-depth.json) |
| Mô phỏng | **26 mô phỏng chuyên sâu** + **4 mô hình tương tác cũ**: ownership, borrowing, Result, Future | [content-depth.json](content-depth.json), [lesson-visual.tsx](../../components/lesson-visual.tsx) |
| Ảnh bài học | **7 ảnh WebP**; minh họa khái niệm, tách khỏi mô phỏng trạng thái chính xác | [content-depth.json](content-depth.json), [illustrations.md](illustrations.md) |

Kiến thức nền tảng và chuyên sâu cùng thuộc mục Bài học. Nội dung chính, mã mẫu, hướng dẫn Cargo, tình huống lỗi, dự án và tiêu chí nghiệm thu nằm trong hệ thống; bibliography phục vụ biên soạn, không thay phần dạy bằng yêu cầu đọc liên kết ngoài.

**Catalog cuối:** SHA-256 `7159c3cba97d65732116d0ddaf92656b0cad5e5c20ea60fe697e9eadc2b2bc65`; depth gate lúc `2026-11-11T01:13:45.263Z`. [solution-fidelity.json](solution-fidelity.json) xác nhận 314 mã lời giải trong catalog này khớp bản đã compile/chạy. Mã gate: [check-course-depth.mjs](../../scripts/check-course-depth.mjs).

## 2. Bằng chứng đã chạy

| Nhóm kiểm tra | Kết quả được xác nhận | Phạm vi và bằng chứng |
| --- | --- | --- |
| Cấu trúc nội dung | **PASS**: 314 bài, 98 chương, 39 dự án chuyên sâu, 68 lab, 156 câu, 26 mô phỏng | [content-depth.json](content-depth.json). Kiểm cấu trúc/độ phủ nguồn, không chứng nhận năng lực học viên. |
| Lời giải Rust | **314/314 PASS**, 0 lỗi; compile, chạy và so stdout | [rust-solutions.json](rust-solutions.json), rustc 1.99.1, edition 2024. [solution-fidelity.json](solution-fidelity.json) nối kết quả chạy với hash catalog cuối. Đây là lời giải mẫu. |
| Static checks | **PASS**: TypeScript, 26 content/assessment tests, 4 progress tests; lỗi ESLint duy nhất đã sửa | [static-checks.json](static-checks.json). Đổi binding cục bộ trong test rồi chạy lại đúng 5 assessment tests và lint file đó, đều PASS; không cộng 5 lượt chạy lại thành 5 test mới hoặc nói đã chạy lại toàn bộ lint. |
| Cargo host cuối | **68/68 PASS**, `cargo test --workspace --all-targets`, lúc `2026-11-11T01:16:12.066Z` | [all-labs.json](all-labs.json). Bao gồm workspace member; không suy ra các test ignored hay target ngoài host đều đã chạy. Các báo cáo nhóm cũ giữ để truy lịch sử. |
| Regression Mobile/Data | **10/10 lab PASS** sau cập nhật | [mobile-data-regression.json](mobile-data-regression.json), gồm bản sửa Data A→B→A và join/window. |
| Backend adapters | Host workspace PASS; **3/3 PostgreSQL integration tests PASS**, 0 ignored | [backend-adapters-labs.json](backend-adapters-labs.json), [backend-postgres.json](backend-postgres.json), [backend.md](backend.md). PostgreSQL 17 Docker cô lập; test commit-order cursor, nhiều connection/conflict/rollback/quyền, gRPC → outbox → WebSocket qua restart transport. |
| Consumer Mobile | **4/4 PASS**: ExpenseBook và Catalog, mỗi lab chạy Swift/macOS + Kotlin/JVM thật qua UniFFI | [mobile-consumers.json](mobile-consumers.json), [mobile.md](mobile.md). Constructor, mutation, snapshot/page, typed error, retry/stale state; chưa kiểm iOS/Android device hoặc simulator. |
| Target WebAssembly | **6/6 tác vụ PASS** trên 3 dự án: wasm32, JavaScript binding dưới Node và tạo web bundle | [wasm-targets.json](wasm-targets.json). Node/bundle không thay thao tác UI/Worker trong trình duyệt. |
| Blockchain SVM | **2 artifact SBF build thành công; 14/14 runtime tests PASS**, 0 ignored | [blockchain-svm.json](blockchain-svm.json). LiteSVM 0.16.0, sBPF v2/platform-tools v1.58; có CPI/PDA signer, callee allowlist, quyền/owner/PDA sai, rollback và compute budget. Local in-process, không RPC/cluster/ví thật. |
| Game native | **PASS** `cargo check --features native --bin native`, Bevy 0.20.1 | [game-native.json](game-native.json). Type check đường render/window native; chưa chạy GPU playtest hay kiểm gói phát hành. |
| UX desktop | **UI-01 đến UI-08 có bằng chứng root thao tác Browser** | [learner-audit.md](learner-audit.md). Chuyển tab/cuộn, focus, ghi chú rỗng, accordion, mô phỏng, rubric/download link, theme và search. UI-04 xác nhận state/bàn phím/computed transition, chưa đo frame giữa animation. |

Tám kịch bản UX là kết quả desktop. Lượt đổi mobile viewport chưa làm kích thước trang đổi thật, nên **chưa xác nhận responsive mobile**. UI-06 kiểm link tải và điều hướng; không nhận là đã tải qua hộp thoại hệ điều hành. Phép kiểm HTTP riêng đã xác nhận đủ 68 ZIP và byte của từng file khớp nguồn, theo [lab-archives.json](lab-archives.json).

## 3. Phát hiện review đã xử lý

| Phát hiện | Bản sửa và bằng chứng | Trạng thái |
| --- | --- | --- |
| **DATA-01 — A → B → A lỗi** | Tách metadata nội dung bất biến khỏi revision commit. Regression xác nhận revision 1/2/3, chỉ hai release, byte snapshot cũ giữ nguyên, stale writer bị từ chối và retry không tăng revision. [data.md](data.md), [mobile-data-regression.json](mobile-data-regression.json). | **ĐÃ ĐÓNG; regression host PASS.** |
| **DATA-02 — join/window thiếu bằng chứng** | SQL join trùng/thiếu dimension, cửa sổ biên 999/1000, sự kiện đến muộn, BTreeMap tham chiếu, hợp đồng thời gian sai; nối milestone/test/rubric critical. [data.md](data.md), [all-labs.json](all-labs.json). | **ĐÃ ĐÓNG; host PASS.** Finite replay, chưa chứng minh stream checkpoint/exactly-once. |
| **AI-01 — skill trỏ sai dự án** | Tensor/gradient/số học nối sang training và serving; feature gate giữ schema/split. Gradient có bằng chứng Burn; shape/số hữu hạn có Candle; softmax có bài/assertion riêng. [ai.md](ai.md). | **ĐÃ ĐÓNG mapping.** Không coi feature gate là bằng chứng autodiff. |
| **MB-01 — thiếu consumer** | Swift/Kotlin consumer, Gradle/JNA, script build/run, modulemap/rpath và hướng dẫn NDK/ABI/XCFramework tự chứa. [mobile.md](mobile.md), [mobile-consumers.json](mobile-consumers.json). | **ĐÃ ĐÓNG trong phạm vi macOS/JVM**, bốn consumer PASS. |
| **BK-01/BK-02 — thiếu adapter/identity mẫu** | Thêm tonic/protobuf, WebSocket có cursor/reconnect, PostgreSQL Store và JWT RS256 verifier với fixture/negative tests; quyền workspace lấy từ membership. [learner-audit.md](learner-audit.md), [backend-postgres.json](backend-postgres.json). | **ĐÃ ĐÓNG bằng mẫu và test trong hệ thống**, gồm ba integration tests DB/network thật. TLS/failover/SLO/key rotation sản phẩm vẫn cần nghiệm thu riêng. |
| **BC-01 — thiếu harness runtime/CPI** | Cung cấp program/gateway, harness LiteSVM có version, fixture và script; build hai SBF rồi thực thi 14 test quyền/CPI/rollback/compute. [blockchain-svm.json](blockchain-svm.json), [blockchain.md](blockchain.md). | **ĐÃ ĐÓNG trong local SVM.** Không nhận đã deploy cluster hoặc kiểm consensus/finality công khai. |
| **UI-02 — mất focus sau nộp/làm lại** | Focus kết quả bằng preventScroll; làm lại về câu đầu không bị topbar che; radio dùng được bằng bàn phím. [learner-audit.md](learner-audit.md). | **ĐÃ SỬA; Browser root PASS.** |
| **UI-03 — khối ghi chú rỗng** | Chỉ render tip có nội dung; DOM ai-numerics không còn khối rỗng. [learner-audit.md](learner-audit.md). | **ĐÃ SỬA; Browser root PASS.** |
| **Desktop — outcome chương lặp** | Sáu chương có hai kết quả cụ thể: DTO/revision, lưu/import, cancellation/budget, capability/snapshot, migration/artifact, đo lường/manifest. [desktop.md](desktop.md). | **ĐÃ SỬA nội dung.** |

[readiness-audit.md](readiness-audit.md) giữ thời điểm phát hiện; các dòng OPEN ở báo cáo lịch sử không thay kết quả sửa có bằng chứng mới trong bảng này. [learner-audit.md](learner-audit.md) có các cập nhật review và Browser do root cung cấp.

## 4. Phát hành nội dung, build và runtime đã nghiệm thu

| Hạng mục | Kết quả cuối | Bằng chứng và phạm vi |
| --- | --- | --- |
| **Build production web trên máy** | **PASS**, `npm run build:local`, exit 0; Node 26.13.0, Next 16.3.4 | [build-runtime.json](build-runtime.json). Runtime `http://127.0.0.1:3000` đọc Supabase; health và trang chủ trả 200. |
| **Docker build/runtime** | **PASS**, Docker build exit 0; container healthy, Node 24.22.2, runtime đọc Supabase | [build-runtime.json](build-runtime.json). Image `sha256:bd319f05a560113736d08687b0f95f6231e9c0d04c559d8acaf79fae9263d658`, kiểm qua `http://127.0.0.1:3002`; không phải VPS. |
| **Supabase publication v2** | **PASS**, release `0a1d25ab-89c2-407e-88ba-1ef04eee78cb`, revision **2**, schema **2**; canonical SHA khớp chính xác catalog cuối | [supabase-publication.json](supabase-publication.json). Publish atomic compare-and-swap revision 1 → 2; 314 bài, 13 khóa chuyên sâu, 68 lab. Public chỉ thấy **1 release hiện hành**; đọc lịch sử trả **401**. |
| **SEO HTTP local** | **PASS**, **388 trang**, 314 bài, 13 khóa, 13 trang đánh giá, 42 dự án; **0 URL sitemap**, noindex | [seo-local.json](seo-local.json). Kiểm `127.0.0.1:3000`, canonical local được cấu hình rõ, ảnh OG PNG 1200 × 630. Noindex là chính sách đúng của lần chạy local. |
| **SEO HTTP Docker fixture** | **PASS**, **388 trang**, **373 URL sitemap** khi bật index cho phép thử | [seo-docker.json](seo-docker.json). HTTP vẫn chạy loopback `127.0.0.1:3002`; `https://learn-rust-review.vn` chỉ là origin metadata fixture, không phải xác nhận deploy, DNS hay HTTPS trên domain đó. Các trang riêng/đánh giá giữ chính sách noindex tương ứng. |
| **ZIP dự án qua HTTP** | **68/68 PASS**; đường dẫn và byte của từng file khớp nguồn catalog cuối | [lab-archives.json](lab-archives.json). Có số file, dung lượng và SHA-256 từng archive; nội dung lấy từ release đang phục vụ. |
| **Browser trên bản production** | **PASS** ở viewport đo thực **1494 × 731**: catalog, điều hướng khóa/bài, light/dark, mô phỏng, không có nút Viết mã thừa khi editor đã mở | [browser-production.json](browser-production.json). Root thao tác trên runtime đọc release Supabase nêu trên; không tràn ngang ở viewport đã kiểm, không có warn/error trong khoảng quan sát được ghi trong report. |
| **Phiên bản Git** | Phiên bản bàn giao là **commit chứa báo cáo này**; đích **`origin/main`** | Kết quả push thuộc xác nhận Git riêng trong tổng kết phát hành, không được suy ra từ các kiểm thử runtime hoặc gán một commit hash tự tham chiếu trong báo cáo. |

Ảnh chụp Browser production: [Danh mục sáng](screenshots/lessons-light.jpg), [Khóa Backend tối](screenshots/backend-dark.jpg). Báo cáo build ghi rõ các chỉnh sau build chỉ gồm tài liệu, xử lý nhãn SQL staging riêng tư và định dạng trắng; không có thay đổi hành vi runtime hay giáo trình sau đó.

Báo cáo SEO cuối cho catalog 314 bài là [seo-local.json](seo-local.json) và [seo-docker.json](seo-docker.json). Những báo cáo cũ kiểm 80/158 bài được giữ làm lịch sử, không dùng thay kết quả này. Cấu hình indexable của Docker fixture không chứng minh website đã được công cụ tìm kiếm thu thập hoặc lập chỉ mục.

**Giới hạn triển khai:** chưa deploy VPS, chưa nghiệm thu DNS/HTTPS trên tên miền sản phẩm. Mobile viewport chưa đổi kích thước thật trong lượt thử trước nên chưa xác nhận layout responsive; accordion đã kiểm trạng thái/bàn phím/computed transition nhưng chưa đo chuỗi frame trung gian. Các giới hạn này không được chuyển thành PASS từ kết quả desktop.

## 5. Cách hiểu nghiệm thu học tập và giới hạn

- Câu hỏi đánh giá kiến thức, hoàn thành bài và nghiệm thu dự án là các điều kiện riêng. Rubric là **tự nghiệm thu của người học**, không phải hệ thống tự chấm source dự án, code review của chuyên gia hay chứng nhận tuyển dụng. Tải dự án, đạt 100% trắc nghiệm hoặc chạy lời giải mẫu không tự chứng minh đã hoàn thiện sản phẩm.
- Bằng chứng cuối khóa cần mã của người học, ca lỗi/regression, kết quả chạy, artifact và giải thích quyết định. Persistence, transport, UI hoặc vận hành được giao trong capstone vẫn phải thực hiện; không tính mẫu core thành toàn bộ sản phẩm thương mại.
- Mỗi môi trường có bằng chứng riêng: host Cargo, Swift/macOS/Kotlin/JVM, wasm32/Node, PostgreSQL/network local và LiteSVM. Chưa suy ra iOS/Android device, firmware/bo mạch, kernel/driver, desktop packaging/signing, GPU gameplay hay distributed workload đều đạt. Native game mới type check.
- Ảnh và mô phỏng giúp hiểu bài; không thay phép đo phần cứng, tải thực hay kiểm thử recovery. Các báo cáo lĩnh vực giữ ma trận năng lực → bài học → bằng chứng và giới hạn; kết quả không bảo đảm mọi học viên sẵn sàng cho mọi dự án hoặc phỏng vấn.

**Mốc nội dung được nghiệm thu:** release Supabase `0a1d25ab-89c2-407e-88ba-1ef04eee78cb`, revision 2/schema 2, canonical SHA-256 `7159c3cba97d65732116d0ddaf92656b0cad5e5c20ea60fe697e9eadc2b2bc65`. Phạm vi đã chạy và các giới hạn còn lại được giữ theo từng bằng chứng ở trên.
