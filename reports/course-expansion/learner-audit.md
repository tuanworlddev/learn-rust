# Rà soát độc lập từ góc nhìn người học

Ngày rà soát: 2026-11-11

Người rà soát: agent `expand_game_data_ai_chain`

Môi trường sản phẩm được root thao tác: `http://127.0.0.1:3001`

## Phạm vi và nguồn bằng chứng

Đây là đợt rà soát độc lập các khóa Backend, Desktop, Mobile và Systems; agent này không viết bốn khóa đó. Tôi đọc cấu trúc 18 bài của mỗi khóa, toàn bộ mô tả dự án/rubric, danh sách tệp của các Cargo lab, các điều kiện đầu vào/đầu ra và đọc sâu những bài đại diện cho ranh giới khó: idempotency, dịch vụ nhiều workspace, lưu tệp nguyên tử, workspace audit, đồng bộ nền mobile, catalog dùng chung, I/O một phần và daemon IPC.

Tôi cũng đọc mã giao diện trong `components/learning-views.tsx`, `learning-app.tsx`, `animated-disclosure.tsx`, `lesson-simulation.tsx`, `course-project.tsx` và `course-assessment.tsx` để lập kịch bản thao tác. Tool Browser của agent con trả lỗi yêu cầu originating browser context. Tôi không dùng trình duyệt khác hoặc đường vòng. Các thao tác Browser ghi PASS bên dưới do root thực hiện trên trình duyệt kết nối; số đo DOM/focus được root gửi lại. Tôi không tự nhận đã click hoặc đã quan sát màn hình trực tiếp.

Báo cáo này không xác nhận mobile viewport, native mobile, cửa sổ desktop, GPU, kernel hay SVM. Kiểm thử Cargo do root tổng hợp riêng; việc đọc nguồn ở đây không thay kết quả chạy thử.

## Kết quả UI đã được kiểm chứng

| Mã | Kịch bản | Bằng chứng và kết luận |
| --- | --- | --- |
| UI-01 | Cuộn cuối lý thuyết `backend-idempotency`, chuyển bài tập, câu hỏi rồi trở lại lý thuyết | **PASS — Browser do root thực thi.** Cột đọc cao 671 px, scrollHeight 2292 px; vị trí cuối là 1621. Click “Làm bài tập” tập trung ARTICLE role=tabpanel, cột đọc ở 157.5; “Trả lời câu hỏi” tập trung tabpanel, cột đọc ở 0. Quay tab Lý thuyết khôi phục đúng 1621. documentScroll luôn bằng 0. Không xuất hiện hiện tượng trang ngoài bị kéo lên. |
| UI-02 | Nộp đủ 12 câu, làm lại và trả lời bằng bàn phím | **PASS sau sửa — Browser do root thực thi.** Ban đầu nộp bài làm focus rơi về BODY vì nút chuyển disabled. Root sửa focus khung kết quả bằng preventScroll. Kết quả mới: 12/12 = 100%, focus DIV `.course-assessment-result` role=status, resultY 323.82 trong viewport. Làm lại xóa về 0/12, nút nộp disabled, focus FIELDSET `.course-exam-question`; sau cuộn questionY 164.13, thấp hơn đáy topbar 60 nên không bị che. Tab tới radio; ArrowRight chọn một đáp án với checkedCount 1. Điểm kiến thức cao vẫn không tự hoàn thành 18 bài hoặc 3 dự án. |
| UI-03 | Đọc bài không có mẹo bổ sung, ví dụ `ai-numerics` | **PASS sau sửa — Browser do root thực thi.** Source ban đầu render `.lv-note` và icon vô điều kiện dù `lesson.tip` rỗng, tạo khối thừa. Root đã thêm điều kiện `lesson.tip.trim()`. DOM bài `ai-numerics` xác nhận số `.lv-note` là 0. |

### Bổ sung bằng chứng Browser

- **UI-04: PASS bàn phím và trạng thái, chưa đo khung hình giữa animation.** Root dùng bàn phím mở điều kiện đầu vào/chương 6 Desktop: chiều cao mở 178.92/267.49 px, đóng về 0; computed transition là 260 ms/180 ms, panel đóng có inert=true và Tab không vào nội dung đóng. Đây là bằng chứng có transition cấu hình và state/focus đúng; không khẳng định đã đo từng frame chuyển động.
- **UI-08: PASS focus trap và Escape; điều hướng kết quả đang chờ.** Ctrl/Meta+K mở tìm kiếm; “deadline” trả 8 kết quả. Shift+Tab từ input tới kết quả cuối, Tab quay input, Escape trả đúng trigger. Root còn kiểm click kết quả trước khi chốt toàn ca.

### Cập nhật bằng chứng Browser hoàn tất

- **UI-07: PASS — root thực thi.** Đổi sáng sang tối khi cột đọc ở 450 giữ đúng 450. Chữ sidebar sáng rgb(23,25,29), tối rgb(240,241,244); reload giữ dark. Đây là kiểm chứng desktop, không suy ra mobile viewport.
- **UI-08: PASS — root thực thi.** Ngoài focus trap/Escape đã kiểm, click kết quả Deadline tới `/bai-hoc/backend-retries-deadlines`, dialogCount=0, focus MAIN có aria-label đúng bài và documentTop=0.

### Hai kịch bản cuối đã được kiểm chứng

- **UI-05: PASS — root thực thi Browser.** Ở backend-outbox, chọn Crash → Chạy → Tạm dừng ở bước 1/5, bước tiếp tới 2/5; đổi Xử lý bình thường về 1/4. Chạy rồi chuyển sang Bài tập, quay lại Lý thuyết vẫn 1/4 với nút Chạy, chứng minh mô phỏng dừng khi bị ẩn. documentScroll luôn 0. Một lượt riêng chờ timer thực đưa mô phỏng tới bước 2/4 rồi tạm dừng; tự chuyển bước đã được quan sát.
- **UI-06: PASS — root thực thi Browser.** Desktop Workspace Audit ban đầu có bốn checkbox chưa chọn và nút hoàn thành disabled. Space chọn một; chọn đủ bốn bật nút; hoàn thành cho aria-pressed=true và “Đã tự nghiệm thu”. Space bỏ một trả về ba tiêu chí, pressed=false và disabled=true. Link tải đúng `/api/lessons/desktop-workspace-project/lab`; “Mở bài hướng dẫn” tới đúng `/bai-hoc/desktop-workspace-project`. Root xác nhận không có nút Viết mã hiển thị trên desktop khi pane đã mở. Đây là kiểm link/luồng UI; kiểm ZIP qua HTTP được root thực hiện riêng, không nhận đã tải qua hộp thoại hệ điều hành.

Cả tám kịch bản đã có bằng chứng Browser trong phạm vi desktop. Riêng độ mượt accordion mới xác nhận state/bàn phím và computed transition, chưa đo chuỗi frame trung gian. Không tuyên bố đã kiểm viewport mobile hoặc thiết bị native.

### Nhận xét từ mã nguồn giao diện

Các nhận xét dưới đây là **source review**, không được đánh dấu như đã click thành công:

- Tab bài học dùng `role=tablist`, roving tabindex và các phím Arrow/Home/End. Cột đọc có lưu vị trí theo tab; hành vi chính đã được UI-01 kiểm chứng.
- Accordion dùng grid từ 0fr đến 1fr trong 260 ms, có `inert`/`aria-hidden` khi đóng và tôn trọng reduced motion. UI-04 đã xác nhận trạng thái/focus và computed timing; chưa đo các frame chuyển động.
- Mô phỏng dừng khi đổi kịch bản, ra khỏi vùng nhìn hoặc trang bị ẩn; không có lệnh tự cuộn trong component.
- Rubric dự án là tự nghiệm thu, không tự gán thành tích chỉ vì tải ZIP. Điểm kiến thức, hoàn thành bài và nghiệm thu dự án là các điều kiện riêng.
- Không thấy bibliography URL được xuất thành nút “xem thêm” trong LessonView. Phần học chính hiện nằm trong hệ thống.
- CSS ẩn `.button.lv-mobile-editor-action` trên desktop và chỉ hiện ở media query max-width 900 px, khi pane đọc/viết mã luân phiên. Không xem việc có chuỗi “Viết mã” trong source là bằng chứng nút thừa đang hiện trên desktop; kiểm computed style vẫn thuộc QA trình duyệt.

## Đánh giá nội dung độc lập

### Backend

**Điểm đạt.** Sáu chương đi từ ranh giới nghiệp vụ và cấu hình, qua hợp đồng HTTP, dữ liệu/cạnh tranh, quyền, sự kiện/khôi phục tới vận hành. Các bài mới đã giải thích idempotency bằng scope, fingerprint và kết quả đã commit; không đánh đồng timeout với chưa ghi dữ liệu. Capstone Team Tasks có cách ly workspace trong truy vấn, optimistic version và outbox cùng transaction. Ba dự án có negative test, failure injection, lỗi cạnh tranh và bằng chứng bàn giao rõ.

Rubric yêu cầu thay demo token trước khi công khai, test quyền từng route/query, consumer chống lặp, queue/retry có giới hạn, tải và diễn tập migration/restore/shutdown. Các điều kiện này đo được. Bản mẫu SQLite pool một kết nối được trình bày đúng phạm vi; nó không được xem là bằng chứng tải đa kết nối PostgreSQL.

**Phát hiện BK-01 — ĐÃ ĐÓNG bằng adapter nội bộ và kiểm thử.** Bản đầu quảng bá tonic/WebSocket/PostgreSQL nhưng lab mới chủ yếu Axum/SQLite. Source hiện tại của capstone có 32 tệp, thêm Cargo member adapters với tonic 0.14.6, proto/build.rs/client generated; Axum WebSocket và stream.html; SQLx PostgreSQL/schema/Compose; Store dùng chung và các test giao thức.

README trong gói giải thích status/deadline/message bounds của gRPC, WebSocket auth frame đầu, token expiry, batch/send deadline, applied cursor và reconnect. PostgreSQL khóa thứ tự ghi theo workspace trước khi cấp event ID, tránh bỏ sót cursor khi transaction lấy ID nhỏ commit muộn; có test nhiều connection, rollback task/outbox và thu hồi quyền. Milestones, requirements và rubric đã yêu cầu đúng các bằng chứng này, không chỉ thêm tên công nghệ.

Root cung cấp kết quả host workspace PASS và **3/3 PostgreSQL integration test thật PASS**: commit-order cursor; multi-connection conflict/rollback/permission; gRPC → PostgreSQL outbox → WebSocket qua restart transport. Process bằng chứng: `ad1091b6-0a80-4012-a9a3-0fb3c0b49041`. Reviewer đã đọc lại danh sách tệp, dependency, proto, hướng dẫn, checks và rubric mới. Khoảng trống thiếu mẫu tự học được đóng. TLS proxy, PostgreSQL failover, tải/SLO, durable consumer và retention/resync vẫn là tiêu chí triển khai tiếp theo đã ghi rõ.

**Phát hiện BK-02 — ĐÃ ĐÓNG bằng JWT verifier có fixture và policy.** Adapter mới dùng jsonwebtoken 9.3.1, chỉ RS256, cấu hình public key/kid/issuer/audience, kiểm signature/exp/nbf/sub trước tạo principal. Test âm gồm thuật toán/kid/signature/claims sai. Quyền workspace tiếp tục lấy từ membership trong database ở cả HTTP, gRPC và WebSocket.

Cặp RSA fixture công khai mô phỏng identity provider ở listener loopback; server chỉ nhận public key. README giải thích cách nối provider thật và ranh giới key rotation/JWKS cache. Đây là ví dụ xác minh cụ thể trong hệ thống, thay cho hướng dẫn chung “dùng thư viện phù hợp”. Kết quả host/loopback PASS do root cung cấp; không coi fixture là cấu hình xác thực sản phẩm.

### Desktop

**Điểm đạt.** Có Tauri 2 thật trong lab ghi chú, bao gồm build/config/capability/permission, frontend và Rust backend. Từ bài command contract đến bản nháp, revision, stale response, lưu tạm rồi rename, tác vụ hủy được, nhiều cửa sổ, migration và phát hành có mối liên hệ rõ.

Capstone Workspace Audit dùng scanner thực, SHA-256, manifest có schema và engine diff xác định. Bài giải thích đúng rằng snapshot filesystem không phải transaction toàn cục; scan lỗi một phần không được biến thành kết luận tệp bị xóa. Rubric yêu cầu kiểm với tệp thật, giới hạn byte/entry/depth, cancellation, bàn phím, phục hồi và artifact chạy được.

**Giới hạn nghiệm thu cần giữ.** Lab nền của capstone là CLI; người học phải tích hợp Tauri theo các bài trước và chứng minh native UX. Native window, WebView, capability, gói cài đặt và signing không được suy ra từ cargo test. Mutex chỉ bảo vệ một tiến trình; TOCTOU/path và writer ngoài ứng dụng được giải thích. Không phát hiện lỗi kiến thức nghiêm trọng trong các bài đã đọc sâu. Chưa phải kiểm toán bảo mật toàn bộ source.

### Mobile

**Điểm đạt.** Khóa tách core/domain khỏi OS/UI; dùng UniFFI Object, lỗi có kiểu, contract test, artifact matrix, ownership callback/lifecycle, cooperative cancellation và background sync. Bài phân biệt UI bị hủy với giao dịch đã commit, thời gian nền không được OS bảo đảm và việc pending phải sống qua process death.

Dự án expense có Rust/UniFFI thật; outbox dùng trạng thái bền và fake server để kiểm ACK mất/replay; catalog có revision/tombstone/idempotency/stale page. Rubric không coi host tests là native smoke test và ghi rõ persistence/server/transport/UI vẫn là phần người học phải hoàn thiện.

**Phát hiện MB-01 — ĐÃ ĐÓNG bằng consumer nội bộ và smoke test host.** Ở bản đầu được rà soát, các lab chưa có consumer Swift/Kotlin hoặc Gradle; README chưa chỉ ra runtime binding cụ thể. Tác giả đã bổ sung cho cả expense và catalog: consumers/swift/main.swift, Kotlin Smoke.kt, settings/build.gradle.kts, scripts smoke và consumers/NATIVE.md. Source review mới xác nhận JNA 5.19.1, Kotlin JVM 2.4.21 và JVM target 17 được nêu cụ thể. Root xác nhận cả bốn consumer (hai Swift, hai Kotlin) compile/run PASS. Phần thiếu mẫu nối Rust → native consumer đã được đóng.

Tài liệu chính thức UniFFI xác nhận Kotlin dựa vào JNA, yêu cầu từ 5.12.0; Android dùng dependency AAR. Khuyến nghị ban đầu là chèn cấu hình cụ thể và consumer tối thiểu ngay trong lab: tạo object, mutation hợp lệ, typed error, snapshot, giải phóng owner; kèm build/copy artifact đúng tên và test fixture chung. Nếu chỉ kiểm được host Swift/JVM thì phải ghi rõ, không gọi đó là kiểm thử iOS/Android. Các consumer mới đáp ứng bước nối Rust → Swift/JVM. Kết quả host này không phải bằng chứng iOS simulator, iPhone hoặc Android emulator/device; consumers/NATIVE.md giữ ma trận target/ABI và bước tích hợp tương ứng.

### Systems

**Điểm đạt.** Nội dung đi từ tài nguyên, Drop/owner, tiến trình, partial I/O, layout/alignment, journal, đồng thời, publication, IPC đến ranh giới kernel. Bài partial I/O phân biệt EOF sạch với frame bị cắt, Interrupted, write_all và deadline tổng; không coi write_all là transaction.

Supervisor dùng Command args riêng, drain cả hai pipe dù đã đủ prefix, kill/wait direct child và nói rõ không phải process sandbox. Journal phân biệt torn tail với record đầy đủ nhưng corrupt, có checked bounds/endian/checksum và poisoned instance sau write lỗi. Daemon dùng Unix socket thật, frame/resource bounds, CAS và lock không giữ qua socket I/O.

**Giới hạn nghiệm thu cần giữ.** Baseline daemon một client còn cần bounded worker pool, drain/shutdown và ghép journal theo milestone. Windows adapter/kernel driver là phạm vi khác; no_std core không chứng minh đã chạy kernel. Các giới hạn đó được nói ngay trong bài/rubric. Không phát hiện lỗi kiến thức nghiêm trọng trong mẫu đã đọc sâu; chưa kiểm chứng hệ điều hành ngoài môi trường root chạy.

## Ma trận năng lực → bài học → bằng chứng cần nộp

| Khóa / năng lực | Bài học liên quan | Bằng chứng dự án |
| --- | --- | --- |
| Backend: giữ invariant khi request lặp/cạnh tranh | `backend-idempotency`, `backend-order-project` | Test replay/cùng key khác payload/stock cạnh tranh; so dữ liệu ba bảng sau failure injection trong `backend-project-orders`. |
| Backend: cách ly workspace và vận hành có giới hạn | `backend-authorization`, `backend-outbox`, `backend-service-project` | Ma trận quyền mọi endpoint, crash/consumer dedup, backlog/p95, migration/restore/shutdown của `backend-project-team-service`. Adapter gRPC/WS/PostgreSQL đã có mã và test thật; BK-01 đã đóng. |
| Desktop: lưu dữ liệu và xử lý conflict | `desktop-atomic-save`, `desktop-command-contract` | Mở lại snapshot, revision cũ, lỗi ghi, bản nháp được giữ và native UX trong `desktop-project-notes`. |
| Desktop: báo cáo thay đổi đúng dưới giới hạn I/O | `desktop-search-project`, `desktop-workspace-project` | Fixture added/changed/removed, scan bị giới hạn không tạo báo cáo sai, cancellation, manifest/schema và gói chạy thử của `desktop-project-workspace`. |
| Mobile: hợp đồng FFI có vòng đời rõ | `mobile-uniffi-contract`, `mobile-object-lifetime`, `mobile-expense-project` | Cùng fixture Rust/Swift/Kotlin, typed error và target/binary/binding manifest trong `mobile-project-expenses`; consumer mẫu đã bổ sung, bốn smoke test host PASS; native device còn phải nghiệm thu riêng. |
| Mobile: đồng bộ bền và không mất bản nháp | `mobile-background-sync`, `mobile-outbox-project`, `mobile-catalog-project` | Mất ACK/restart/process death, conflict/tombstone/stale page, pending bền và native lifecycle trong dự án outbox/catalog. |
| Systems: quản lý tài nguyên và kết thúc tác vụ | `systems-partial-io`, `systems-supervisor-project` | Timeout/exit/spawn được phân biệt, stdout+stderr đầy vẫn drain, mọi direct child được reap trong `systems-project-supervisor`. |
| Systems: protocol/persistence đúng khi lỗi | `systems-file-journal-project`, `systems-ipc-framing`, `systems-daemon-project` | Torn/corrupt fixtures, partial frame/deadline, CAS, shutdown/recovery và đo tài nguyên trong `systems-project-daemon`. |

## Cách hiểu kết quả đầu ra

Hoàn thành các câu trắc nghiệm chứng minh khả năng chọn cách xử lý trong những tình huống đã hỏi. Người học còn phải tự triển khai phần mở rộng, chạy phép thử lỗi, giải thích tradeoff và nộp artifact/bằng chứng trước khi tự nghiệm thu dự án. Cấu trúc mới tạo được lộ trình tới một dự án có phạm vi cụ thể; nó không tự chứng nhận sẵn sàng với mọi dự án thương mại hay bảo đảm phỏng vấn.

Để phát hành nội dung theo yêu cầu “không phải đi đọc bên ngoài”, BK-01/BK-02 đã có adapter và test trong hệ thống; MB-01 đã có consumer và bốn smoke test host PASS. Giữ rõ những phần triển khai môi trường đích còn phải nghiệm thu theo rubric. Nguồn chính thức ở phần cuối phục vụ biên soạn và kiểm chứng; không thay nội dung bài học và không cần đưa thành liên kết “xem thêm” trên giao diện.

## Nguồn kiểm chứng biên soạn

- Mã nguồn hiện tại: `src/data/specializations/{backend,desktop,mobile,systems}.ts` và `src/data/specializations/expanded/{backend,desktop,mobile,systems}.ts`; các file component được nêu ở đầu báo cáo.
- UniFFI, “Integrating with Gradle”: https://mozilla.github.io/uniffi-rs/latest/kotlin/gradle.html — JNA và Android dependency AAR.
- UniFFI changelog: https://github.com/mozilla/uniffi-rs/blob/main/CHANGELOG.md — phiên bản 0.32.2 và tương thích binding.
- tonic crate documentation: https://docs.rs/tonic/latest/tonic/ — protobuf code generation, transport, giới hạn message và cấu hình client/server.
