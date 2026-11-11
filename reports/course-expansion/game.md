# Mở rộng khóa Game, đồ họa và mô phỏng

Ngày biên soạn: 11/11/2026.

## Cấu trúc và nội dung
Giữ sáu bài cũ, thêm 12 bài mới, chia sáu chương ba bài: ECS và vòng đời; luật và state; thời gian/va chạm/replay; scene/camera; tác nhân/hiệu năng; save/phát hành. Mỗi bài mới có năm mục, 427–459 từ, ví dụ lỗi, bài Rust std-only, assertion, stdout xác định và quiz giải thích. Nội dung cần học được viết trong hệ thống, không thay bằng yêu cầu đọc đường dẫn ngoài.

Ba dự án có mã Cargo hoàn chỉnh và localLab khác nhau. Arena ECS dùng bevy_app/bevy_ecs 0.20.1, sáu test; Scene loader dùng Serde JSON/BFS, sáu test; Rust Arcade dùng cùng core cho headless và Bevy native 0.20.1 qua feature native, bảy test core. Native có mã Camera2d, Sprite, input phím, FixedUpdate, nội suy và title trạng thái thật. Hai mô phỏng tương tác có hai kịch bản, bốn bước mỗi kịch bản. Bộ đánh giá có 12 tình huống, hai câu mỗi chương, kèm bài ôn và sáu năng lực.

## Ma trận năng lực và bằng chứng
| Năng lực | Bài học | Bằng chứng dự án |
| --- | --- | --- |
| Thiết kế entity/component, ID và lifecycle | game-data-model, game-lifecycle | Item một lần, reset entity/resource trong game-project-arena |
| Lịch và state machine | game-state-machines, game-arena-project | Move trước collect, pause/restart, transition tests |
| Thời gian, va chạm và replay | game-timestep, game-collision, game-replay | Tick log, snapshot, biên hình học và replay regression trong capstone |
| Scene và hiển thị | game-render-pipeline, game-scene-project | JSON schema, BFS reachable, reload nguyên tử; native camera/sprite |
| Tìm đường và hiệu năng | game-navigation, game-profiling | Budget node, workload, frame-time report và regression |
| Save và phát hành | game-save-format, game-release-project | Save roundtrip/fault injection, build release, native playtest matrix |

## Dự án và độ sâu
- Arena (10 giờ, có hướng dẫn): game loop nhặt vật phẩm có phase; người học thêm restart, loại item thứ hai, log replay và chống tích lũy entity.
- Level pipeline (14 giờ, tự thực hiện): loader có giới hạn và kiểm tra reachable; bổ sung CLI bounded read, ba level, lỗi theo trường và migration.
- Rust Arcade (30 giờ, capstone): baseline native chơi được; bổ sung level 2D, enemy có ngân sách tìm đường, UI hướng dẫn, save tệp công bố nguyên tử, backup và fault injection.

Mỗi dự án có yêu cầu, ba mốc nghiệm thu, năm tình huống, bốn rubric với tiêu chí bắt buộc và đầu ra nộp. Kết quả tự đánh giá chỉ được hoàn thành sau khi có bằng chứng, không suy ra từ điểm câu hỏi.

## Kiểm chứng và giới hạn
Đã biên dịch và chạy 12/12 lời giải bằng rustc --edition=2024 trên Mac; stdout và assertion đều đạt. Tệp kiểm tra ở work/expansion-game. Root chạy Cargo tập trung cho ba localLab; chưa nhận kết quả nên báo cáo không nhận Cargo PASS thay root.

Headless test không mở cửa sổ hoặc khởi tạo GPU. Native code cần build/playtest riêng trên nền tảng đích: phím, focus, DPI, resize, renderer/driver và frame time. Browser/WASM, WebGPU, nền tảng thứ hai, audio, multiplayer và cloud save chưa được kiểm thử. Fixture nhỏ không chứng minh hiệu năng hàng nghìn actor. Save bản mẫu là schema/memory roundtrip, chưa có atomic file writer; nhiệm vụ đó có test và rubric riêng trong capstone. Bằng chứng native là tiêu chí bắt buộc, không được đánh dấu đạt chỉ vì core CPU tests xanh.

## Nguồn chính thức
- Bevy ECS/quick start: https://bevy.org/learn/quick-start/getting-started/ — App, ECS và môi trường native.
- Bevy schedules: https://docs.rs/bevy_ecs/latest/bevy_ecs/schedule/index.html — thứ tự hệ thống và đồng bộ.
- Bevy Commands: https://docs.rs/bevy_ecs/latest/bevy_ecs/system/struct.Commands.html — thay đổi cấu trúc được xếp lệnh.
- Bevy fixed timestep example: https://bevy.org/examples/movement/physics-in-fixed-timestep/ — input trước fixed, vật lý theo tick, nội suy sau fixed.
- RunFixedMainLoopSystems: https://docs.rs/bevy/latest/bevy/app/enum.RunFixedMainLoopSystems.html — BeforeFixedMainLoop và AfterFixedMainLoop.
- Bevy Sprite: https://bevy.org/examples/2d-rendering/sprite/ và https://docs.rs/bevy_sprite/latest/bevy_sprite/struct.Sprite.html — Camera2d và sprite màu.
- Bevy window settings: https://bevy.org/examples/window/window-settings/ — Window title, resolution và input cạnh.
- Serde attributes: https://serde.rs/attributes.html — typed schema và deny_unknown_fields.
- Rust VecDeque: https://doc.rust-lang.org/std/collections/struct.VecDeque.html — hàng đợi BFS.

## Kết quả kiểm chứng bổ sung từ root
Root xác nhận toàn bộ các host Cargo lab của Game đã PASS. Riêng capstone cũng đã chạy cargo check --features native --bin native với Bevy 0.20.1 và PASS (59,81 giây). Đây là kiểm tra biên dịch native, chưa mở cửa sổ hoặc playtest GPU. Các mục input, DPI, focus, renderer/driver và frame time thực vẫn cần kiểm tra trên máy đích.
