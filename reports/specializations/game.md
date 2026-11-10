# Hướng chuyên sâu Game, đồ họa và mô phỏng

Ngày rà soát nguồn: 2026-11-11 (Asia/Ho_Chi_Minh).

## Nội dung đã bàn giao

- File nội dung: `src/data/specializations/game.ts`.
- Export: `gameBundle`; track ID: `game`; module ID: `track-game`.
- 6 bài theo thứ tự từ mô hình dữ liệu đến phát hành; mỗi bài có 4 mục lý thuyết, mục tiêu, bài tập trình duyệt, starter, lời giải, output, gợi ý, quiz và tham khảo chính thức.
- 24 mục lý thuyết, tổng 2.982 từ theo cách đếm khoảng trắng; không tính mã nguồn, mô tả, quiz hoặc bài tập.
- 6 bài tập dùng standard library, có assertion trường hợp biên và stdout cố định.
- 2 lab Cargo đầy đủ, mỗi lab có Cargo.toml, src/lib.rs, src/main.rs, lệnh và tiêu chí kiểm tra.
- Capstone 5 mốc có acceptance, 5 nhóm deliverable và 6 câu hỏi review.
- Minh họa bài ECS dùng `/images/lessons/game-simulation.webp`, asset do agent tích hợp cung cấp; hình minh họa khái niệm robot/lưới không phải sơ đồ API chính xác.

| Bài | Từ lý thuyết | Điểm thực hành |
| --- | ---: | --- |
| game-ecs | 499 | Bộ lọc component, chuyển động, bão hòa và biên |
| game-scheduling | 492 | Máy trạng thái, lệnh hợp lệ, trừ máu có kiểm soát |
| game-timestep | 498 | Accumulator, giới hạn tick, thời gian bỏ và lỗi tràn |
| game-assets-coordinates | 500 | Viewport offset, camera trực giao, biên, NaN và vô cực |
| game-input-performance | 486 | Cạnh nhấn, hàng đợi giới hạn, focus và tiêu thụ một lần |
| game-testing-release | 507 | Snapshot chuẩn hóa, thứ tự ID, dữ liệu không hợp lệ |

## Phiên bản và quyết định kỹ thuật

Nguồn chính thức tại thời điểm rà soát hiển thị **Bevy 0.20.1**. Trang release tổng hợp nhấn mạnh bản 0.20.0; docs hiện hành và Cargo.toml tại tag `v0.20.1` được kiểm tra thêm để chọn patch cụ thể.

Lab ECS pin hai dependency:

```toml
bevy_app = { version = "=0.20.1", default-features = false, features = ["std"] }
bevy_ecs = { version = "=0.20.1", default-features = false, features = ["std"] }
```

Các feature được đối chiếu trực tiếp với manifest chính thức tại tag v0.20.1. Lab không kéo renderer hoặc cửa sổ; App::new, Update, Query, With/Without và chain thể hiện ECS thật. Ba test kiểm tra thứ tự integrate/constrain, entity bị loại khỏi query và gỡ marker Frozen.

Lab `game_sim_core` chỉ dùng standard library. Bảy test kiểm tra replay, đầu vào sai không làm đổi trạng thái, biên tọa độ/vận tốc, tràn tick, đồng hồ quá tải, lỗi không làm mất accumulator và tính độc lập với cách chia frame khi không bỏ thời gian. Đơn vị vật lý của lab là khoảng cách/tick, không phải mét/giây. Đây là mô hình nhỏ có chủ đích; không tuyên bố một engine vật lý bên ngoài tự động xác định.

Nội dung API hiện hành:

- MessageReader, MessageWriter::write và App::add_message cho thông điệp có bộ đệm.
- Event/observer là cơ chế trigger riêng; không dùng EventReader cũ để mô tả buffered messages.
- NextState xếp yêu cầu chuyển trạng thái, không thay State tức thì trong system hiện tại.
- Camera2d, Mesh2d và MeshMaterial2d<ColorMaterial> trong ví dụ đồ họa.
- Migration 0.20 có thay đổi hệ Sprite; nội dung không chép SpriteBundle hoặc Camera2dBundle cũ.
- FixedUpdate có thể chạy không lần nào hoặc nhiều lần trong một frame; input tức thời cần bộ đệm và chính sách tiêu thụ.
- Nội suy chỉ thay lớp hiển thị, không được đưa Transform nội suy ngược vào collision.
- Cargo.lock và --locked khóa dependency đã giải, không được quảng bá thành bảo đảm binary giống từng byte.

## Kiểm tra đã thực hiện bởi agent tác giả

Trên repository Mac `/Users/rupphi/AIWorkspaces/mcp-lab/learn-rust`:

1. Transpile bằng TypeScript thành công.
2. `validateCatalog` thành công với một module, sáu lesson và một specialization; thứ tự lessonIds khớp hoàn toàn.
3. TypeScript semantic diagnostics cho riêng `specializations/game.ts`: không có lỗi.
4. `npx eslint src/data/specializations/game.ts`: exit 0.
5. Sáu starter đều giữ chỗ todo! đúng yêu cầu; lời giải không chứa todo!.
6. Đếm theory prose: 486–507 từ/bài, bốn section/bài; các trường schema không thừa.

Phạm vi chưa được tác giả này thực thi: rustc của sáu browser solution, Cargo test/run/clippy của hai lab, và ứng dụng cửa sổ. Agent tích hợp chịu trách nhiệm chạy kiểm chứng Rust và ghi kết quả chung. Các lệnh và assertion trong bài là tiêu chí thực hành, không phải tuyên bố chúng đã chạy thành công.

Không có bằng chứng kiểm tra GPU, driver, audio, DPI hoặc đóng gói game thật trong báo cáo này. Đoạn ví dụ cửa sổ cần Bevy đầy đủ, các phụ thuộc hệ điều hành và thiết bị đồ họa phù hợp. Headless test không chứng minh chất lượng render hoặc cảm giác điều khiển.

## Nguồn chính thức đã đọc

### Phiên bản, API và feature

- [Bevy news](https://bevy.org/news/) — thông tin chu kỳ release.
- [Migration 0.19 → 0.20](https://bevy.org/learn/migration-guides/0-19-to-0-20/) — thay đổi API, bao gồm Sprite.
- [bevy_app Cargo.toml tại v0.20.1](https://github.com/bevyengine/bevy/blob/v0.20.1/crates/bevy_app/Cargo.toml) — đối chiếu qua nội dung raw cùng tag.
- [bevy_ecs Cargo.toml tại v0.20.1](https://github.com/bevyengine/bevy/blob/v0.20.1/crates/bevy_ecs/Cargo.toml) — đối chiếu feature std và default-features.
- [App](https://docs.rs/bevy_app/0.20.0/bevy_app/struct.App.html) — new, add_systems, update; API được đối chiếu với các nguồn hiện hành.
- [IntoScheduleConfigs](https://docs.rs/bevy/latest/bevy/ecs/schedule/trait.IntoScheduleConfigs.html) — chain và quan hệ thứ tự.
- [NextState](https://docs.rs/bevy/latest/bevy/state/state/enum.NextState.html) — xếp yêu cầu transition.

### ECS, messages và tài nguyên

- [ECS quick start](https://bevy.org/learn/quick-start/getting-started/ecs/).
- [Resources quick start](https://bevy.org/learn/quick-start/getting-started/resources/).
- [MessageWriter](https://docs.rs/bevy_ecs/latest/bevy_ecs/message/struct.MessageWriter.html).
- [MessageReader](https://docs.rs/bevy/latest/bevy/ecs/message/struct.MessageReader.html).
- [Observer module](https://docs.rs/bevy/latest/bevy/ecs/observer/index.html).
- [AssetServer](https://docs.rs/bevy/latest/bevy/asset/struct.AssetServer.html).

### Thời gian, điều khiển và đồ họa

- [Physics in fixed timestep](https://bevy.org/examples/movement/physics-in-fixed-timestep/).
- [Time<Fixed>](https://docs.rs/bevy/latest/bevy/time/struct.Fixed.html).
- [2D shapes](https://bevy.org/examples/2d-rendering/2d-shapes/).
- [2D viewport to world](https://bevy.org/examples/2d-rendering/2d-viewport-to-world/).
- [ButtonInput](https://docs.rs/bevy/latest/bevy/input/struct.ButtonInput.html).
- [FrameTimeDiagnosticsPlugin](https://docs.rs/bevy/latest/bevy/diagnostic/struct.FrameTimeDiagnosticsPlugin.html).
- [Bevy setup](https://bevy.org/learn/quick-start/getting-started/setup/) — toolchain và phụ thuộc hệ điều hành.

### Build

- [Cargo build](https://doc.rust-lang.org/cargo/commands/cargo-build.html).
- [Cargo.toml và Cargo.lock](https://doc.rust-lang.org/cargo/guide/cargo-toml-vs-cargo-lock.html).

Các URL latest được đọc khi hiển thị 0.20.1; liên kết tham khảo trong lesson dùng phiên bản pin khi có URL API tương ứng. Nội dung diễn giải và bài tập được viết riêng cho Learn Rust, không chép dài từ tài liệu nguồn.
