import type { SpecializationBundle } from "../specialization-types";

export const gameBundle: SpecializationBundle = {
  "track": {
    "id": "game",
    "title": "Game, đồ họa và mô phỏng",
    "shortTitle": "Game và mô phỏng",
    "description": "Xây gameplay bằng Bevy ECS, mô phỏng theo tick, điều khiển, tài nguyên đồ họa và quy trình phát hành.",
    "outcome": "Tạo một game 2D hoặc mô phỏng có lõi kiểm thử được, replay, đo hiệu năng và bản phát hành để trình bày trong phỏng vấn.",
    "prerequisites": [
      "Ownership, borrowing, trait và generic",
      "Enum, pattern matching và Result",
      "Collection, iterator và kiểm thử Rust",
      "Vector, tọa độ và vận tốc cơ bản"
    ],
    "technologies": [
      "Bevy 0.20.1",
      "ECS",
      "Fixed timestep",
      "Camera2d",
      "Cargo",
      "Replay"
    ],
    "color": "purple",
    "lessonIds": [
      "game-ecs",
      "game-scheduling",
      "game-timestep",
      "game-assets-coordinates",
      "game-input-performance",
      "game-testing-release"
    ],
    "capstone": {
      "title": "Đấu trường 2D có replay",
      "description": "Xây một game né vật cản hoặc mô phỏng robot trên mặt phẳng. Lõi luật chơi chạy được không cần cửa sổ; Bevy phụ trách nhập liệu, hiển thị, âm thanh và trạng thái màn hình.",
      "milestones": [
        {
          "title": "Lõi luật chơi và dữ liệu",
          "tasks": [
            "Viết tài liệu đơn vị: tick, khoảng cách, vận tốc, kích thước va chạm; đặt giới hạn hợp lệ cho đầu vào.",
            "Tách component vị trí, vận tốc, sức khỏe và định danh ổn định; mô tả điều kiện thắng, thua, bắt đầu lại."
          ],
          "acceptance": "Có ít nhất 8 kiểm thử cho biên bản đồ, va chạm, hết máu, đầu vào rỗng và bắt đầu lại; không cần GPU để chạy."
        },
        {
          "title": "Lịch chạy và replay",
          "tasks": [
            "Chia hệ thống lấy ý định, mô phỏng, xử lý kết quả và hiển thị; khai báo các quan hệ thứ tự cần thiết.",
            "Ghi input theo tick, seed nếu dùng ngẫu nhiên, phiên bản định dạng replay; so sánh snapshot bằng định danh ổn định."
          ],
          "acceptance": "Cùng replay 1.000 tick cho cùng trạng thái cuối trong hai lần chạy; thay lịch khung hình không đổi kết quả khi không áp dụng chính sách bỏ thời gian."
        },
        {
          "title": "Một vòng chơi hoàn chỉnh",
          "tasks": [
            "Thêm Loading, Menu, Playing, Paused và GameOver; không cho điều khiển gameplay đi xuyên menu.",
            "Hiển thị đối tượng bằng mesh hoặc asset có giấy phép; hỗ trợ thay kích thước cửa sổ và camera theo dõi.",
            "Cho phép đổi phím, tắt rung màn hình, chỉnh âm lượng; làm rõ trạng thái focus của bàn phím."
          ],
          "acceptance": "Người khác khởi động, chơi, tạm dừng, thua và chơi lại mà không cần hướng dẫn miệng; thiếu asset dẫn đến màn hình lỗi có cách quay lại."
        },
        {
          "title": "Ổn định chuyển động và tải",
          "tasks": [
            "Dùng fixed timestep và nội suy lớp hiển thị; giữ vị trí mô phỏng độc lập với Transform dùng để vẽ.",
            "Chọn tải chuẩn gồm số đối tượng, thời lượng và hành động; ghi frame time p50/p95/p99, thời gian mô phỏng và bộ nhớ.",
            "Tối ưu một điểm nóng đã đo, rồi chạy lại cùng kịch bản và đối chiếu replay."
          ],
          "acceptance": "Báo cáo có cấu hình máy, chế độ release, VSync, độ phân giải và số đo trước/sau; chuyển động không đổi tốc độ khi thử các mức FPS khác nhau."
        },
        {
          "title": "Kiểm thử và phát hành",
          "tasks": [
            "Chạy unit test, headless integration test, fmt và clippy trong CI; khóa dependency bằng Cargo.lock.",
            "Đóng gói bản release cho một hệ điều hành đã kiểm tra, kèm asset, giấy phép, điều khiển và hướng dẫn xử lý lỗi.",
            "Quay video một vòng chơi và trình bày hai quyết định kiến trúc cùng đánh đổi."
          ],
          "acceptance": "Một người khác giải nén bản phát hành và chơi được trên máy mục tiêu; README ghi rõ nền tảng đã kiểm tra, lỗi đã biết và cách chạy test."
        }
      ],
      "deliverables": [
        "Cargo workspace tách simulation_core và ứng dụng Bevy",
        "Cargo.lock, CI và bộ kiểm thử có trường hợp biên",
        "Replay mẫu cùng snapshot kỳ vọng",
        "Bản release và danh mục giấy phép asset",
        "Video vòng chơi, báo cáo hiệu năng và tài liệu quyết định kiến trúc"
      ],
      "reviewQuestions": [
        "ECS giúp bạn chia dữ liệu như thế nào, và tại sao không đặt mọi thứ trong một component Player?",
        "Vì sao hai system cùng sửa dữ liệu vẫn cần khai báo thứ tự nghiệp vụ?",
        "Fixed timestep còn thiếu điều kiện gì để replay xác định?",
        "Bạn xử lý một lần nhấn phím khi khung hình không có tick mô phỏng ra sao?",
        "Vì sao Transform nội suy không nên trở thành nguồn dữ liệu va chạm?",
        "Kết quả headless test chứng minh được điều gì và bỏ sót điều gì ở bản phát hành?"
      ]
    },
    "resources": [
      {
        "label": "Bevy: ECS",
        "url": "https://bevy.org/learn/quick-start/getting-started/ecs/"
      },
      {
        "label": "Bevy: migration 0.19 → 0.20",
        "url": "https://bevy.org/learn/migration-guides/0-19-to-0-20/"
      },
      {
        "label": "Bevy: fixed timestep và nội suy",
        "url": "https://bevy.org/examples/movement/physics-in-fixed-timestep/"
      },
      {
        "label": "Bevy: 2D viewport và world",
        "url": "https://bevy.org/examples/2d-rendering/2d-viewport-to-world/"
      },
      {
        "label": "Bevy 0.20.1: MessageReader",
        "url": "https://docs.rs/bevy/0.20.1/bevy/ecs/message/struct.MessageReader.html"
      },
      {
        "label": "Cargo: manifest và lockfile",
        "url": "https://doc.rust-lang.org/cargo/guide/cargo-toml-vs-cargo-lock.html"
      }
    ]
  },
  "lessons": [
    {
      "id": "game-ecs",
      "moduleId": "track-game",
      "title": "ECS: dữ liệu, truy vấn và vòng cập nhật",
      "duration": 55,
      "description": "Mô hình hóa đối tượng bằng component và kiểm tra một hệ thống chuyển động bằng Bevy headless.",
      "objectives": [
        "Phân biệt entity, component, system và resource",
        "Đọc Query theo dữ liệu và bộ lọc",
        "Khai báo thứ tự cập nhật khi luật chơi phụ thuộc nhau",
        "Kiểm thử ECS bằng App::update mà không cần cửa sổ"
      ],
      "sections": [
        {
          "title": "Một đối tượng là tổ hợp dữ liệu",
          "text": "Trong game né vật cản, người chơi, đạn và chướng ngại đều có vị trí; chỉ một số có vận tốc hoặc sức khỏe. ECS biểu diễn mỗi đối tượng bằng entity mang các component phù hợp. Entity là định danh trong World, không phải con trỏ tới một lớp chứa mọi hành vi. Component giữ dữ liệu; system chọn dữ liệu cần xử lý.\n\nTách Position khỏi Velocity giúp cùng hệ thống chuyển động phục vụ đạn lẫn người chơi. Đừng chia nhỏ đến mức mọi con số trở thành một component độc lập: nhóm các trường luôn được đọc và đổi cùng nhau. Với file lưu hoặc replay, tạo định danh nghiệp vụ ổn định; không dùng Entity của một World làm định danh lâu dài."
        },
        {
          "title": "Query diễn tả hợp đồng truy cập",
          "text": "Query<(&mut Position, &Velocity), Without<Frozen>> đọc vận tốc, sửa vị trí và bỏ qua đối tượng bị đóng băng. Một entity thiếu Velocity tự động không khớp. With và Without lọc theo sự hiện diện của component; chúng không kiểm tra giá trị bên trong. Điều kiện như sức khỏe lớn hơn không thuộc cùng cơ chế lọc ấy.\n\nKiểu tham số còn cho lịch chạy biết system đọc hoặc ghi dữ liệu nào. Hai system cùng sửa Position không thể tự do chạy đồng thời, nhưng tránh xung đột bộ nhớ không xác định thứ tự luật chơi. Giữ query hẹp giúp đọc mã rõ hơn. Đừng lấy toàn bộ World chỉ để sửa một trường mà query đã diễn tả được.",
          "code": "use bevy_ecs::prelude::*;\n\n#[derive(Component)]\nstruct Position(i32);\n#[derive(Component)]\nstruct Velocity(i32);\n#[derive(Component)]\nstruct Frozen;\n\nfn move_bodies(mut query: Query<(&mut Position, &Velocity), Without<Frozen>>) {\n    for (mut position, velocity) in &mut query {\n        position.0 = position.0.saturating_add(velocity.0);\n    }\n}"
        },
        {
          "title": "Lịch chạy và thay đổi cấu trúc",
          "text": "Schedule quyết định khi nào và theo quan hệ nào các system chạy. Trong lab, integrate phải chạy trước constrain: cộng vận tốc rồi giới hạn biên. Nếu đảo thứ tự, đối tượng có thể kết thúc bên ngoài bản đồ. Dùng chain cho chuỗi phụ thuộc ngắn; hệ thống lớn nên đặt tên nhóm bằng SystemSet và khai báo quan hệ giữa nhóm.\n\nCommands thường xếp thay đổi cấu trúc để áp dụng ở điểm đồng bộ, nên spawn không có nghĩa mọi query đang chạy lập tức thấy entity mới. Khi producer tạo entity cho consumer, khai báo thứ tự và hiểu điểm áp dụng lệnh. Không giả định thứ tự duyệt query là thứ tự spawn hay khóa nghiệp vụ."
        },
        {
          "title": "Từ phép tính thuần đến hệ thống thật",
          "text": "Bài tập dùng slice để tập trung vào quy tắc lọc, bão hòa số nguyên và giới hạn vị trí. Lab chuyển đúng ý tưởng sang Bevy 0.20.1, chỉ bật các crate ứng dụng và ECS cần thiết. App::update chạy lịch một lần; test tự tạo World, gọi cập nhật và đọc kết quả, không phụ thuộc màn hình hoặc tốc độ máy.\n\nBộ test cần cả entity đang di chuyển, bị đóng băng và thiếu vận tốc. Thêm trường hợp sát biên để phát hiện đảo lịch. Thử gỡ Frozen rồi cập nhật: đây là kiểm tra vòng đời component. Khi tích hợp game thật, bổ sung đơn vị thời gian và fixed timestep thay vì coi mỗi khung hình là một bước bằng nhau."
        }
      ],
      "tip": "Vẽ bảng entity × component trước khi viết system: mỗi query phải chọn đúng nhóm dữ liệu trong bảng.",
      "exercise": {
        "title": "Chọn đúng đối tượng để di chuyển",
        "instructions": "Hoàn thiện step: chỉ cập nhật đối tượng có cả vị trí và vận tốc, đồng thời không bị đóng băng. Đây là quy tắc dữ liệu sẽ được chuyển thành Query trong lab.",
        "requirements": [
          "Cộng bằng saturating_add rồi giới hạn vị trí trong [-10, 10].",
          "Không thay đổi đối tượng bị đóng băng hoặc thiếu component.",
          "Trả số đối tượng đã được xử lý, kể cả khi giới hạn biên giữ nguyên vị trí.",
          "Slice rỗng trả 0; phép cộng vượt miền i32 không panic."
        ]
      },
      "starterCode": "#[derive(Debug, PartialEq)]\nstruct Body { position: Option<i32>, velocity: Option<i32>, frozen: bool }\n\nfn step(bodies: &mut [Body]) -> usize {\n    todo!(\"Lọc theo component rồi cập nhật vị trí\")\n}\n\nfn main() {\n    let mut bodies = [\n        Body { position: Some(2), velocity: Some(3), frozen: false },\n        Body { position: Some(9), velocity: Some(4), frozen: false },\n        Body { position: Some(4), velocity: Some(7), frozen: true },\n        Body { position: Some(-2), velocity: None, frozen: false },\n        Body { position: None, velocity: Some(3), frozen: false },\n    ];\n    assert_eq!(step(&mut bodies), 2);\n    assert_eq!(bodies[0].position, Some(5));\n    assert_eq!(bodies[1].position, Some(10));\n    assert_eq!(bodies[2].position, Some(4));\n    assert_eq!(bodies[3].position, Some(-2));\n    assert_eq!(bodies[4].position, None);\n    assert_eq!(step(&mut []), 0);\n    let mut edge = [Body { position: Some(i32::MIN), velocity: Some(-1), frozen: false }];\n    assert_eq!(step(&mut edge), 1);\n    assert_eq!(edge[0].position, Some(-10));\n    println!(\"2 đối tượng di chuyển; bộ lọc hợp lệ\");\n}",
      "solutionCode": "#[derive(Debug, PartialEq)]\nstruct Body { position: Option<i32>, velocity: Option<i32>, frozen: bool }\n\nfn step(bodies: &mut [Body]) -> usize {\n    let mut changed = 0;\n    for body in bodies {\n        if body.frozen { continue; }\n        if let (Some(position), Some(velocity)) = (&mut body.position, body.velocity) {\n            *position = position.saturating_add(velocity).clamp(-10, 10);\n            changed += 1;\n        }\n    }\n    changed\n}\n\nfn main() {\n    let mut bodies = [\n        Body { position: Some(2), velocity: Some(3), frozen: false },\n        Body { position: Some(9), velocity: Some(4), frozen: false },\n        Body { position: Some(4), velocity: Some(7), frozen: true },\n        Body { position: Some(-2), velocity: None, frozen: false },\n        Body { position: None, velocity: Some(3), frozen: false },\n    ];\n    assert_eq!(step(&mut bodies), 2);\n    assert_eq!(bodies[0].position, Some(5));\n    assert_eq!(bodies[1].position, Some(10));\n    assert_eq!(bodies[2].position, Some(4));\n    assert_eq!(bodies[3].position, Some(-2));\n    assert_eq!(bodies[4].position, None);\n    assert_eq!(step(&mut []), 0);\n    let mut edge = [Body { position: Some(i32::MIN), velocity: Some(-1), frozen: false }];\n    assert_eq!(step(&mut edge), 1);\n    assert_eq!(edge[0].position, Some(-10));\n    println!(\"2 đối tượng di chuyển; bộ lọc hợp lệ\");\n}",
      "expectedOutput": "2 đối tượng di chuyển; bộ lọc hợp lệ",
      "hints": [
        "Bỏ qua Frozen trước khi mượn position để sửa.",
        "Ghép Option của vị trí và vận tốc bằng if let.",
        "Đếm sau khi khớp cả hai component; không đếm theo việc tọa độ có đổi hay không."
      ],
      "quiz": {
        "question": "Hai system đều sửa Position. Điều gì bảo đảm luật 'di chuyển rồi chặn biên'?",
        "options": [
          "Thứ tự khai báo tên hàm trong file",
          "Chỉ cần cả hai dùng &mut Position",
          "Khai báo quan hệ thứ tự, chẳng hạn (integrate, constrain).chain()",
          "Duyệt entity theo thứ tự spawn"
        ],
        "correct": 2,
        "explanation": "Quyền truy cập loại trừ giúp tránh xung đột dữ liệu. Quan hệ thứ tự mới diễn tả rằng kiểm tra biên phải thấy vị trí sau chuyển động."
      },
      "reference": {
        "label": "Bevy: ECS và query",
        "url": "https://bevy.org/learn/quick-start/getting-started/ecs/"
      },
      "localLab": {
        "title": "ECS không cần cửa sổ",
        "instructions": "Tạo thư mục game_ecs_lab, đặt các file theo đường dẫn bên dưới và chạy lệnh tại thư mục đó. Lab dùng Bevy 0.20.1 với default-features tắt, chỉ bật std; không cần renderer, audio hoặc GPU. Sau lần tạo lockfile đầu tiên, lưu Cargo.lock cùng mã nguồn.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"game_ecs_lab\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\nbevy_app = { version = \"=0.20.1\", default-features = false, features = [\"std\"] }\nbevy_ecs = { version = \"=0.20.1\", default-features = false, features = [\"std\"] }\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use bevy_app::{App, Update};\nuse bevy_ecs::prelude::*;\n\n#[derive(Component, Debug, PartialEq, Eq)]\npub struct Position(pub i32);\n#[derive(Component)]\npub struct Velocity(pub i32);\n#[derive(Component)]\npub struct Frozen;\n\nfn integrate(mut bodies: Query<(&mut Position, &Velocity), Without<Frozen>>) {\n    for (mut position, velocity) in &mut bodies {\n        position.0 = position.0.saturating_add(velocity.0);\n    }\n}\n\nfn constrain(mut bodies: Query<&mut Position, (With<Velocity>, Without<Frozen>)>) {\n    for mut position in &mut bodies {\n        position.0 = position.0.clamp(-10, 10);\n    }\n}\n\npub fn build_app() -> App {\n    let mut app = App::new();\n    app.add_systems(Update, (integrate, constrain).chain());\n    app\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn movement_precedes_boundary_check() {\n        let mut app = build_app();\n        let entity = app.world_mut().spawn((Position(9), Velocity(4))).id();\n        app.update();\n        assert_eq!(app.world().get::<Position>(entity), Some(&Position(10)));\n        app.update();\n        assert_eq!(app.world().get::<Position>(entity), Some(&Position(10)));\n    }\n\n    #[test]\n    fn query_skips_frozen_and_missing_velocity() {\n        let mut app = build_app();\n        let frozen = app.world_mut().spawn((Position(4), Velocity(3), Frozen)).id();\n        let still = app.world_mut().spawn(Position(-2)).id();\n        app.update();\n        assert_eq!(app.world().get::<Position>(frozen), Some(&Position(4)));\n        assert_eq!(app.world().get::<Position>(still), Some(&Position(-2)));\n    }\n\n    #[test]\n    fn removed_marker_reenables_motion() {\n        let mut app = build_app();\n        let entity = app.world_mut().spawn((Position(1), Velocity(2), Frozen)).id();\n        app.update();\n        app.world_mut().entity_mut(entity).remove::<Frozen>();\n        app.update();\n        assert_eq!(app.world().get::<Position>(entity), Some(&Position(3)));\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use game_ecs_lab::{build_app, Position, Velocity};\n\nfn main() {\n    let mut app = build_app();\n    let entity = app.world_mut().spawn((Position(1), Velocity(3))).id();\n    for _ in 0..3 { app.update(); }\n    let position = app.world().get::<Position>(entity).unwrap();\n    assert_eq!(position.0, 10);\n    println!(\"x={}\", position.0);\n}\n"
          }
        ],
        "commands": [
          "cargo generate-lockfile",
          "cargo test --locked",
          "cargo run --locked",
          "cargo clippy --locked --all-targets -- -D warnings"
        ],
        "checks": [
          "Ba test kiểm tra thứ tự, bộ lọc và gỡ component đều thành công.",
          "Chương trình in x=10.",
          "Đổi chain thành thứ tự ngược làm test sát biên thất bại.",
          "Không mở cửa sổ và không khởi tạo render pipeline."
        ]
      },
      "illustration": {
        "src": "/images/lessons/game-simulation.webp",
        "alt": "Robot di chuyển trên lưới có vật cản và đường quỹ đạo, minh họa dữ liệu vị trí và hệ thống mô phỏng.",
        "caption": "Mỗi robot mang dữ liệu riêng; các hệ thống cập nhật chuyển động và tương tác theo từng tick."
      }
    },
    {
      "id": "game-scheduling",
      "moduleId": "track-game",
      "title": "Lịch hệ thống, trạng thái và thông điệp",
      "duration": 55,
      "description": "Điều phối vòng đời trò chơi và phân biệt thông điệp có bộ đệm với sự kiện kích hoạt observer.",
      "objectives": [
        "Khai báo thứ tự bằng SystemSet hoặc chain",
        "Thiết kế trạng thái Menu, Playing, Paused và GameOver",
        "Dùng MessageReader, MessageWriter và add_message theo API hiện hành",
        "Nhận ra lỗi do lệnh hoãn, thông điệp hết hạn và input đi xuyên menu"
      ],
      "sections": [
        {
          "title": "Thứ tự phải thể hiện luật chơi",
          "text": "Một tick có thể gồm đọc ý định, di chuyển, tìm va chạm, trừ máu và quyết định kết thúc. Nếu trừ máu chạy trước phát hiện va chạm, màn hình có thể chậm một tick; nếu kết thúc chạy trước trừ máu, người chơi còn hành động sau khi đã chết. Xung đột mượn dữ liệu không tự chọn thứ tự đúng cho bạn.\n\nDùng SystemSet để đặt tên các pha và liên kết những pha có phụ thuộc. Chỉ nối các system thực sự cần nhau, vì nối tất cả làm mất cơ hội chạy song song. Quan hệ before hoặc after áp dụng trong cùng schedule; đặt system trong Update và FixedUpdate rồi thêm after không tạo ra một lịch chung mới."
        },
        {
          "title": "Trạng thái giới hạn hành động hợp lệ",
          "text": "Enum trạng thái biến vòng đời màn hình thành dữ liệu kiểm tra được. Playing cho phép mô phỏng; Paused giữ thế giới và chặn gameplay; GameOver cho phép xem kết quả hoặc bắt đầu lại. Bevy dùng States, State và NextState; gọi NextState::set xếp yêu cầu chuyển trạng thái, không đổi State ngay giữa hàm hiện tại.\n\nDùng OnEnter để khởi tạo và OnExit để dọn dữ liệu phù hợp. Đánh dấu entity thuộc vòng chơi để khi reset không xóa nhầm camera hay thiết lập chung. Nếu nhiều system cùng yêu cầu trạng thái khác nhau trong một lần cập nhật, hãy tập trung quyết định vào một nơi hoặc công bố thứ tự ưu tiên rõ ràng."
        },
        {
          "title": "Message và Event có cách giao nhận khác nhau",
          "text": "Trong Bevy 0.20.1, Message là dữ liệu có bộ đệm để system chủ động đọc bằng MessageReader; MessageWriter::write gửi và App::add_message đăng ký loại. Mỗi reader theo dõi phần mình đã đọc, nên âm thanh và điểm số có thể cùng nhận một thông điệp. Không lưu chúng như hàng đợi bền vững: thông điệp bị dọn theo chu kỳ cập nhật bộ đệm.\n\nEvent phục vụ observer phản ứng khi được trigger. Với Commands, việc trigger cũng chờ lệnh được áp dụng. Chọn Message cho xử lý theo pha; chọn observer cho phản ứng phù hợp với thời điểm kích hoạt. Reader bị tắt khi pause có thể bỏ lỡ thông điệp; dữ liệu cần giữ lâu phải vào cấu trúc sở hữu riêng.",
          "code": "use bevy::prelude::*;\n\n#[derive(Message)]\nstruct Hit(u16);\n#[derive(Resource)]\nstruct Health(u16);\n\nfn apply_hits(mut hits: MessageReader<Hit>, mut health: ResMut<Health>) {\n    for hit in hits.read() {\n        health.0 = health.0.saturating_sub(hit.0);\n    }\n}\n\nfn configure(app: &mut App) {\n    app.add_message::<Hit>()\n        .insert_resource(Health(100))\n        .add_systems(Update, apply_hits);\n}\n\nfn emit_hit(mut writer: MessageWriter<Hit>) {\n    writer.write(Hit(20));\n}\n// Đăng ký emit_hit trước apply_hits khi cần đọc trong cùng lượt Update."
        },
        {
          "title": "Kiểm tra chuyển trạng thái như một giao thức",
          "text": "Viết bảng trạng thái hiện tại, lệnh, điều kiện và trạng thái tiếp theo trước khi gắn nút. Một lệnh Resume ở Menu nên bị từ chối, không âm thầm tạo vòng chơi. Hit khi pause không được làm giảm máu. Đặt chính sách rõ cho nhiều va chạm cùng tick: cộng dồn, giới hạn một lần, hoặc dùng thời gian miễn nhiễm.\n\nBài tập dùng hàm thuần để kiểm tra bảng chuyển và phép trừ bão hòa. Khi ghép vào Bevy, test thêm thời điểm NextState có hiệu lực, dọn entity sau reset và thứ tự writer/reader. Với input từ giao diện, tiêu thụ hành động mở menu để cùng lần nhấn ấy không tiếp tục gây một hành động gameplay."
        }
      ],
      "tip": "Ghi rõ một thông điệp được phép mất hay phải lưu lại; đừng để thời gian giữ mặc định quyết định luật chơi.",
      "exercise": {
        "title": "Máy trạng thái của vòng chơi",
        "instructions": "Hoàn thiện apply theo bảng lệnh trong enum. Trả true chỉ khi lệnh được chấp nhận; lệnh không hợp lệ phải giữ nguyên toàn bộ Game.",
        "requirements": [
          "Menu chỉ nhận Start; Start đặt máu 100 và chuyển Playing.",
          "Playing nhận Pause hoặc Hit(damage > 0); máu giảm bão hòa và bằng 0 chuyển GameOver.",
          "Paused chỉ nhận Resume; GameOver chỉ nhận Reset về Menu với máu 100.",
          "Không trừ máu khi pause, không tràn số khi damage lớn, không chấp nhận Hit(0)."
        ]
      },
      "starterCode": "#[derive(Debug, PartialEq, Eq, Clone, Copy)]\nenum Phase { Menu, Playing, Paused, GameOver }\n#[derive(Clone, Copy)]\nenum Command { Start, Pause, Resume, Hit(u16), Reset }\n#[derive(Debug, PartialEq, Eq)]\nstruct Game { phase: Phase, health: u16 }\n\nfn apply(game: &mut Game, command: Command) -> bool {\n    todo!(\"Khớp cặp trạng thái và lệnh\")\n}\n\nfn main() {\n    let mut game = Game { phase: Phase::Menu, health: 100 };\n    assert!(!apply(&mut game, Command::Hit(30)));\n    assert!(apply(&mut game, Command::Start));\n    assert!(!apply(&mut game, Command::Start));\n    assert!(!apply(&mut game, Command::Hit(0)));\n    assert!(apply(&mut game, Command::Pause));\n    assert!(!apply(&mut game, Command::Hit(30)));\n    assert_eq!(game.health, 100);\n    assert!(apply(&mut game, Command::Resume));\n    assert!(apply(&mut game, Command::Hit(30)));\n    assert_eq!(game.health, 70);\n    assert!(apply(&mut game, Command::Hit(u16::MAX)));\n    assert_eq!(game.phase, Phase::GameOver);\n    assert_eq!(game.health, 0);\n    assert!(!apply(&mut game, Command::Resume));\n    assert!(apply(&mut game, Command::Reset));\n    assert_eq!(game, Game { phase: Phase::Menu, health: 100 });\n    println!(\"Menu → Playing → Paused → Playing → GameOver → Menu\");\n}",
      "solutionCode": "#[derive(Debug, PartialEq, Eq, Clone, Copy)]\nenum Phase { Menu, Playing, Paused, GameOver }\n#[derive(Clone, Copy)]\nenum Command { Start, Pause, Resume, Hit(u16), Reset }\n#[derive(Debug, PartialEq, Eq)]\nstruct Game { phase: Phase, health: u16 }\n\nfn apply(game: &mut Game, command: Command) -> bool {\n    match (game.phase, command) {\n        (Phase::Menu, Command::Start) => {\n            game.health = 100;\n            game.phase = Phase::Playing;\n        }\n        (Phase::Playing, Command::Pause) => game.phase = Phase::Paused,\n        (Phase::Paused, Command::Resume) => game.phase = Phase::Playing,\n        (Phase::Playing, Command::Hit(damage)) if damage > 0 => {\n            game.health = game.health.saturating_sub(damage);\n            if game.health == 0 { game.phase = Phase::GameOver; }\n        }\n        (Phase::GameOver, Command::Reset) => {\n            game.health = 100;\n            game.phase = Phase::Menu;\n        }\n        _ => return false,\n    }\n    true\n}\n\nfn main() {\n    let mut game = Game { phase: Phase::Menu, health: 100 };\n    assert!(!apply(&mut game, Command::Hit(30)));\n    assert!(apply(&mut game, Command::Start));\n    assert!(!apply(&mut game, Command::Start));\n    assert!(!apply(&mut game, Command::Hit(0)));\n    assert!(apply(&mut game, Command::Pause));\n    assert!(!apply(&mut game, Command::Hit(30)));\n    assert_eq!(game.health, 100);\n    assert!(apply(&mut game, Command::Resume));\n    assert!(apply(&mut game, Command::Hit(30)));\n    assert_eq!(game.health, 70);\n    assert!(apply(&mut game, Command::Hit(u16::MAX)));\n    assert_eq!(game.phase, Phase::GameOver);\n    assert_eq!(game.health, 0);\n    assert!(!apply(&mut game, Command::Resume));\n    assert!(apply(&mut game, Command::Reset));\n    assert_eq!(game, Game { phase: Phase::Menu, health: 100 });\n    println!(\"Menu → Playing → Paused → Playing → GameOver → Menu\");\n}",
      "expectedOutput": "Menu → Playing → Paused → Playing → GameOver → Menu",
      "hints": [
        "Match trên (game.phase, command) để nhìn thấy đầy đủ bảng chuyển.",
        "Dùng guard damage > 0 cho Hit.",
        "Dùng saturating_sub và chỉ đổi phase sau khi đã tính máu mới."
      ],
      "quiz": {
        "question": "Một MessageReader bị tắt trong thời gian pause dài. Có thể mặc định dùng nó làm hộp thư giữ mọi lệnh đến khi resume không?",
        "options": [
          "Có, Message giữ dữ liệu đến khi mọi reader đọc xong",
          "Không; cần hàng đợi riêng hoặc chính sách bỏ lệnh vì bộ đệm được dọn theo chu kỳ",
          "Có, chỉ cần đổi Message thành EventReader",
          "Có, vì mỗi reader có cursor riêng nên dữ liệu không thể mất"
        ],
        "correct": 1,
        "explanation": "Cursor tránh đọc lại dữ liệu còn được giữ; nó không kéo dài vòng đời bộ đệm. Lệnh cần giao nhận bền vững phải có cơ chế lưu và giới hạn riêng."
      },
      "reference": {
        "label": "Bevy 0.20.1: MessageReader",
        "url": "https://docs.rs/bevy/0.20.1/bevy/ecs/message/struct.MessageReader.html"
      }
    },
    {
      "id": "game-timestep",
      "moduleId": "track-game",
      "title": "Fixed timestep, replay và nội suy",
      "duration": 65,
      "description": "Tách đồng hồ hiển thị khỏi mô phỏng, xử lý khung hình chậm và kiểm tra tính xác định.",
      "objectives": [
        "Phân biệt thời gian frame với tick mô phỏng",
        "Thiết kế accumulator có chính sách quá tải rõ ràng",
        "Nội suy hiển thị mà không sửa trạng thái vật lý",
        "Kiểm tra replay bằng input gắn với tick"
      ],
      "sections": [
        {
          "title": "Tốc độ khung hình không phải tốc độ thế giới",
          "text": "Cộng vận tốc trực tiếp mỗi frame khiến máy có FPS cao di chuyển nhanh hơn. Nhân vận tốc với delta time sửa đơn vị, nhưng bước thời gian quá lớn vẫn làm va chạm và tích phân thiếu ổn định. Fixed timestep chia thời gian thành các bước đều: một frame có thể chạy không bước nào hoặc nhiều bước mô phỏng.\n\nBevy cung cấp FixedUpdate và Time<Fixed>. Chọn tần số theo yêu cầu gameplay, chi phí và phương pháp vật lý; không mặc định rằng tăng tick luôn tốt. Ghi rõ vận tốc là đơn vị mỗi giây hay mỗi tick. Lõi lab dùng đơn vị mỗi tick để mọi phép tính số nguyên đều có hợp đồng đơn giản."
        },
        {
          "title": "Accumulator cần một chính sách khi quá tải",
          "text": "Giữ phần thời gian chưa đủ một bước trong accumulator. Khi có frame mới, cộng thời gian, lấy số bước nguyên và giữ phần dư. Nếu mô phỏng mất nhiều thời gian hơn ngân sách thực tế, cố đuổi mọi bước có thể gây vòng lặp càng chậm càng phải làm nhiều việc.\n\nBài tập giới hạn số tick mỗi frame rồi bỏ các bước dư, đồng thời báo dropped_ms. Đây là lựa chọn giảm tốc thời gian mô phỏng khi quá tải, không phải bảo đảm đồng bộ mạng. Một lựa chọn khác là giữ nợ để bắt kịp sau; cần giới hạn và số đo riêng. Quyết định này thuộc sản phẩm, không được giấu sau một phép clamp."
        },
        {
          "title": "Nội suy chỉ phục vụ hình ảnh",
          "text": "Lưu vị trí trước và sau tick. Khi vẽ, dùng phần dư chia độ dài tick làm alpha rồi trộn hai vị trí. Hiển thị mượt hơn nhưng thường chậm hơn trạng thái mới nhất một khoảng; đây là đánh đổi có chủ ý. Khi teleport hoặc reset, đặt cả hai mốc về cùng vị trí để tránh vệt di chuyển sai.\n\nGiữ vị trí mô phỏng tách khỏi Transform nội suy. Nếu collision đọc Transform đã làm mượt, kết quả lại phụ thuộc FPS. Camera theo nhân vật nên dùng vị trí hiển thị phù hợp. Trong Bevy, chọn hệ thống lấy input trước vòng fixed và hệ thống nội suy sau vòng fixed, thay vì mặc định mọi việc vào Update.",
          "code": "// Mô hình nội suy độc lập với renderer.\nfn rendered_x(previous: f32, current: f32, remainder: f32, step: f32) -> f32 {\n    assert!(step > 0.0 && remainder >= 0.0 && remainder < step);\n    let alpha = remainder / step;\n    previous + (current - previous) * alpha\n}\n\n// Trong ứng dụng Bevy đã thêm TimePlugin:\n// app.insert_resource(Time::<Fixed>::from_hz(50.0));\n// app.add_systems(FixedUpdate, simulate);"
        },
        {
          "title": "Fixed timestep chưa đủ để replay xác định",
          "text": "Replay cần cùng trạng thái đầu, cùng input theo tick, cùng phiên bản luật và thứ tự xử lý ổn định. Seed chỉ đủ khi thuật toán ngẫu nhiên và số lần lấy mẫu cũng giống nhau. Thứ tự HashMap, query không cam kết, phép cộng số thực hoặc công việc song song có thể làm hai lần chạy lệch nhau.\n\nLab dùng số nguyên, giới hạn vận tốc và lỗi có kiểm soát để kiểm tra lõi nhỏ. Test thay cách chia frame nhưng giữ input từng tick; kết quả phải giống khi không bỏ thời gian. Khi bổ sung vật lý bên ngoài hoặc mạng rollback, cần kiểm chứng riêng phạm vi nền tảng và sai số; không suy ra tính xác định từ việc nhìn hình ảnh giống nhau."
        }
      ],
      "tip": "Ghi input theo tick mô phỏng; FPS chỉ là lịch hiển thị, không phải khóa của replay.",
      "exercise": {
        "title": "Tính số tick và thời gian bị bỏ",
        "instructions": "Hoàn thiện advance cho chính sách bỏ các bước vượt limit. Kết quả là (số tick chạy, phần dư, thời gian bị bỏ). Hàm không thay đổi trạng thái bên ngoài.",
        "requirements": [
          "Trả None khi step bằng 0, accumulator không nhỏ hơn step hoặc phép cộng thời gian tràn.",
          "Chạy tối đa limit tick; giữ total % step.",
          "Báo chính xác thời gian của các bước nguyên vượt giới hạn.",
          "limit bằng 0 hợp lệ trong bài tập: bỏ toàn bộ bước nguyên và giữ phần dư."
        ]
      },
      "starterCode": "fn advance(accumulator: u64, frame: u64, step: u64, limit: u32) -> Option<(u32, u64, u64)> {\n    todo!(\"Kiểm tra cấu hình và chia thời gian thành tick\")\n}\n\nfn main() {\n    assert_eq!(advance(0, 10, 20, 3), Some((0, 10, 0)));\n    assert_eq!(advance(5, 95, 20, 3), Some((3, 0, 40)));\n    assert_eq!(advance(19, 2, 20, 3), Some((1, 1, 0)));\n    assert_eq!(advance(3, 40, 20, 0), Some((0, 3, 40)));\n    assert_eq!(advance(0, 0, 20, 3), Some((0, 0, 0)));\n    assert_eq!(advance(20, 1, 20, 3), None);\n    assert_eq!(advance(0, 10, 0, 3), None);\n    assert_eq!(advance(1, u64::MAX, 20, 3), None);\n    println!(\"3 tick; dư 0 ms; bỏ 40 ms\");\n}",
      "solutionCode": "fn advance(accumulator: u64, frame: u64, step: u64, limit: u32) -> Option<(u32, u64, u64)> {\n    if step == 0 || accumulator >= step { return None; }\n    let total = accumulator.checked_add(frame)?;\n    let available = total / step;\n    let executed = available.min(u64::from(limit));\n    let remainder = total % step;\n    let dropped = (available - executed) * step;\n    Some((executed as u32, remainder, dropped))\n}\n\nfn main() {\n    assert_eq!(advance(0, 10, 20, 3), Some((0, 10, 0)));\n    assert_eq!(advance(5, 95, 20, 3), Some((3, 0, 40)));\n    assert_eq!(advance(19, 2, 20, 3), Some((1, 1, 0)));\n    assert_eq!(advance(3, 40, 20, 0), Some((0, 3, 40)));\n    assert_eq!(advance(0, 0, 20, 3), Some((0, 0, 0)));\n    assert_eq!(advance(20, 1, 20, 3), None);\n    assert_eq!(advance(0, 10, 0, 3), None);\n    assert_eq!(advance(1, u64::MAX, 20, 3), None);\n    println!(\"3 tick; dư 0 ms; bỏ 40 ms\");\n}",
      "expectedOutput": "3 tick; dư 0 ms; bỏ 40 ms",
      "hints": [
        "Dùng checked_add trước khi chia.",
        "available = total / step; executed là giá trị nhỏ hơn giữa available và limit.",
        "Phần bị bỏ chỉ gồm bước nguyên, không gồm remainder."
      ],
      "quiz": {
        "question": "Vì sao không dùng Transform đã nội suy làm đầu vào collision?",
        "options": [
          "Transform chỉ dùng được với game 3D",
          "Vì nội suy thuộc lịch render và có thể khiến luật va chạm phụ thuộc FPS",
          "Vì FixedUpdate luôn chạy đúng một lần mỗi frame",
          "Vì nội suy tự thay đổi vận tốc về 0"
        ],
        "correct": 1,
        "explanation": "Trạng thái mô phỏng cần theo tick cố định. Transform làm mượt nằm giữa hai snapshot để vẽ; đưa nó ngược vào vật lý làm hai đồng hồ phụ thuộc lẫn nhau."
      },
      "reference": {
        "label": "Bevy: chạy vật lý bằng fixed timestep",
        "url": "https://bevy.org/examples/movement/physics-in-fixed-timestep/"
      },
      "localLab": {
        "title": "Lõi mô phỏng số nguyên có replay",
        "instructions": "Tạo thư mục game_sim_core và các file dưới đây. Lab chỉ dùng standard library, không cần Bevy hoặc GPU. Clock giữ bước 20 ms, có giới hạn công việc và báo thời gian bỏ; State dùng khoảng cách và vận tốc theo tick. Input của replay phải được gắn với tick trước khi đưa vào lõi.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"game_sim_core\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\n"
          },
          {
            "path": "src/lib.rs",
            "content": "#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]\npub struct State {\n    pub tick: u64,\n    pub x: i64,\n    pub velocity: i64,\n}\n\nimpl State {\n    pub fn step(&mut self, axis: i8) -> Result<(), &'static str> {\n        if !(-1..=1).contains(&axis) { return Err(\"axis ngoài [-1, 1]\"); }\n        let tick = self.tick.checked_add(1).ok_or(\"tick tràn\")?;\n        let velocity = self.velocity.saturating_add(i64::from(axis)).clamp(-8, 8);\n        let proposed = self.x.saturating_add(velocity);\n        self.x = proposed.clamp(-100, 100);\n        self.velocity = if self.x != proposed { 0 } else { velocity };\n        self.tick = tick;\n        Ok(())\n    }\n}\n\npub fn replay(inputs: &[i8]) -> Result<State, &'static str> {\n    let mut state = State::default();\n    for &axis in inputs { state.step(axis)?; }\n    Ok(state)\n}\n\n#[derive(Debug, PartialEq, Eq)]\npub struct Frame {\n    pub steps: u32,\n    pub remainder_ms: u64,\n    pub dropped_ms: u64,\n}\n\npub struct Clock {\n    accumulator_ms: u64,\n    step_ms: u64,\n    limit: u32,\n}\n\nimpl Clock {\n    pub fn new(step_ms: u64, limit: u32) -> Result<Self, &'static str> {\n        if step_ms == 0 || limit == 0 { return Err(\"cấu hình clock không hợp lệ\"); }\n        Ok(Self { accumulator_ms: 0, step_ms, limit })\n    }\n\n    pub fn advance(&mut self, frame_ms: u64) -> Result<Frame, &'static str> {\n        let total = self.accumulator_ms.checked_add(frame_ms).ok_or(\"thời gian tràn\")?;\n        let available = total / self.step_ms;\n        let steps = available.min(u64::from(self.limit));\n        let remainder_ms = total % self.step_ms;\n        let dropped_ms = (available - steps) * self.step_ms;\n        self.accumulator_ms = remainder_ms;\n        Ok(Frame { steps: steps as u32, remainder_ms, dropped_ms })\n    }\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn repeated_replay_matches() {\n        let inputs = [-1, 0, 1, 1, 0, -1];\n        assert_eq!(replay(&inputs), replay(&inputs));\n        assert_eq!(replay(&inputs).unwrap().tick, 6);\n    }\n\n    #[test]\n    fn invalid_input_keeps_state() {\n        let mut state = State::default();\n        let before = state;\n        assert!(state.step(2).is_err());\n        assert_eq!(state, before);\n    }\n\n    #[test]\n    fn boundaries_and_velocity_are_bounded() {\n        let state = replay(&[1; 1_000]).unwrap();\n        assert!((-100..=100).contains(&state.x));\n        assert!((-8..=8).contains(&state.velocity));\n        assert_eq!(state.tick, 1_000);\n    }\n\n    #[test]\n    fn tick_overflow_is_atomic() {\n        let mut state = State { tick: u64::MAX, ..State::default() };\n        let before = state;\n        assert!(state.step(1).is_err());\n        assert_eq!(state, before);\n    }\n\n    #[test]\n    fn clock_reports_discarded_time() {\n        let mut clock = Clock::new(20, 3).unwrap();\n        assert_eq!(clock.advance(5).unwrap(), Frame { steps: 0, remainder_ms: 5, dropped_ms: 0 });\n        assert_eq!(clock.advance(95).unwrap(), Frame { steps: 3, remainder_ms: 0, dropped_ms: 40 });\n        assert!(Clock::new(0, 3).is_err());\n        assert!(Clock::new(20, 0).is_err());\n    }\n\n    #[test]\n    fn clock_error_preserves_remainder() {\n        let mut clock = Clock::new(20, 3).unwrap();\n        clock.advance(1).unwrap();\n        assert!(clock.advance(u64::MAX).is_err());\n        assert_eq!(clock.advance(19).unwrap().steps, 1);\n    }\n\n    fn run_frames(frames: &[u64], inputs: &[i8]) -> State {\n        let mut clock = Clock::new(20, 4).unwrap();\n        let mut state = State::default();\n        let mut next = 0;\n        for &frame_ms in frames {\n            let frame = clock.advance(frame_ms).unwrap();\n            assert_eq!(frame.dropped_ms, 0);\n            for _ in 0..frame.steps {\n                state.step(inputs[next]).unwrap();\n                next += 1;\n            }\n        }\n        assert_eq!(next, inputs.len());\n        state\n    }\n\n    #[test]\n    fn render_chunking_does_not_change_simulation() {\n        let inputs: Vec<i8> = (0..100).map(|i| (i % 3) as i8 - 1).collect();\n        let steady = run_frames(&[20; 100], &inputs);\n        let irregular = run_frames(&[5, 15].repeat(100), &inputs);\n        assert_eq!(steady, irregular);\n        assert_eq!(steady, replay(&inputs).unwrap());\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use game_sim_core::replay;\n\nfn main() {\n    let state = replay(&[1, 1, 0, -1]).unwrap();\n    assert_eq!((state.tick, state.x, state.velocity), (4, 6, 1));\n    println!(\"tick={} x={} v={}\", state.tick, state.x, state.velocity);\n}\n"
          }
        ],
        "commands": [
          "cargo generate-lockfile",
          "cargo test --locked",
          "cargo run --locked",
          "cargo test --locked --release",
          "cargo clippy --locked --all-targets -- -D warnings"
        ],
        "checks": [
          "Bảy test bao phủ replay, input sai, biên không gian, tràn tick, giới hạn clock, lỗi giữ nguyên accumulator và thay lịch frame.",
          "Chương trình in tick=4 x=6 v=1.",
          "Lịch 100 frame × 20 ms và lịch [5,15] ms lặp 100 lần cho cùng snapshot.",
          "Thay quy tắc vận tốc phải cập nhật phiên bản replay và snapshot kỳ vọng, không sửa test chỉ để che sai lệch."
        ]
      }
    },
    {
      "id": "game-assets-coordinates",
      "moduleId": "track-game",
      "title": "Tài nguyên, camera và tọa độ 2D",
      "duration": 60,
      "description": "Quản lý tải tài nguyên và hiểu phép biến đổi từ con trỏ trên màn hình sang thế giới của game.",
      "objectives": [
        "Phân biệt asset handle và dữ liệu đã tải",
        "Tạo camera và mesh bằng API Bevy hiện hành",
        "Đổi tọa độ viewport sang world với đơn vị nhất quán",
        "Thiết kế trạng thái tải, lỗi tài nguyên và đóng gói asset"
      ],
      "sections": [
        {
          "title": "Handle không có nghĩa tài nguyên đã sẵn sàng",
          "text": "AssetServer::load trả về handle để hệ thống bắt đầu tải; có handle chưa chứng minh ảnh đã giải mã hoặc các phụ thuộc đã hoàn tất. Tạo trạng thái Loading với danh sách tài nguyên cần thiết, kiểm tra trạng thái tải và xử lý lỗi trước khi mở vòng chơi. Đừng dùng một khoảng đợi cố định vì tốc độ đĩa và mạng khác nhau.\n\nGiữ strong handle trong dữ liệu thuộc vòng đời phù hợp. Clone handle chia sẻ quyền tham chiếu tới asset, không nhân bản toàn bộ ảnh. Khi đổi màn, quyết định tài nguyên nào dùng lại và tài nguyên nào được giải phóng. Asset lớn cần ngân sách bộ nhớ; lỗi thiếu file phải dẫn đến phản hồi có thể hiểu được."
        },
        {
          "title": "Hình vẽ là một lớp của mô hình",
          "text": "Một vật thể nhìn thấy cần dữ liệu hình học, vật liệu, phép biến đổi và camera phù hợp. Ví dụ dùng Camera2d, Mesh2d và MeshMaterial2d<ColorMaterial> trong Bevy 0.20.1 để tạo một hình chữ nhật. Các component cần thiết được engine bổ sung theo cơ chế required components; không cần chép lại Camera2dBundle từ hướng dẫn cũ.\n\nCollider, hình vẽ và vị trí mô phỏng phục vụ ba mục đích khác nhau. Hình vẽ có thể phóng to, rung hoặc nội suy mà không làm hitbox thay đổi. Giữ kích thước va chạm trong dữ liệu luật chơi. Khi hình không xuất hiện, kiểm tra camera, tọa độ, lớp hiển thị, asset và thứ tự sâu trước khi sửa logic chuyển động.",
          "code": "// Dự án cửa sổ riêng: bevy = \"=0.20.1\" trong Cargo.toml.\nuse bevy::prelude::*;\n\nfn setup(\n    mut commands: Commands,\n    mut meshes: ResMut<Assets<Mesh>>,\n    mut materials: ResMut<Assets<ColorMaterial>>,\n) {\n    commands.spawn(Camera2d);\n    commands.spawn((\n        Mesh2d(meshes.add(Rectangle::new(48.0, 32.0))),\n        MeshMaterial2d(materials.add(Color::srgb(0.85, 0.32, 0.16))),\n        Transform::from_xyz(0.0, 0.0, 0.0),\n    ));\n}\n\nfn main() {\n    App::new()\n        .add_plugins(DefaultPlugins)\n        .add_systems(Startup, setup)\n        .run();\n}"
        },
        {
          "title": "Đổi hệ tọa độ trước khi xử lý con trỏ",
          "text": "Con trỏ cửa sổ thường có gốc ở góc trái trên, còn thế giới 2D dùng trục Y hướng lên theo camera thông thường. Viewport có thể chiếm một vùng nhỏ, camera có thể dịch hoặc zoom, và kích thước logic khác số pixel vật lý trên màn hình mật độ cao. Trừ trực tiếp nửa chiều rộng cửa sổ chỉ đúng trong một cấu hình hạn chế.\n\nTrong Bevy, dùng Camera::viewport_to_world_2d với GlobalTransform của camera và tọa độ đầu vào đúng đơn vị. Xử lý Result lỗi hoặc khi con trỏ ngoài vùng tương tác. Nếu camera vừa đổi transform, thực hiện phép đổi sau cập nhật transform phù hợp. Bài tập cố ý giới hạn ở camera trực giao không xoay."
        },
        {
          "title": "Tài nguyên cũng cần quy trình phát hành",
          "text": "Cây thư mục asset là một phần của bản phát hành. Tên file phân biệt hoa thường trên một số nền tảng; đường dẫn tuyệt đối từ máy người viết sẽ hỏng khi giải nén ở nơi khác. Chọn thư mục làm việc hoặc cơ chế xác định vị trí tài nguyên rõ ràng, rồi thử trên bản đóng gói sạch.\n\nGhi nguồn và giấy phép cho hình ảnh, font và âm thanh. Khi đo dung lượng, tính cả dữ liệu đã giải nén và tài nguyên trên GPU. Ví dụ cửa sổ cần driver cùng thư viện hệ điều hành theo hướng dẫn Bevy; headless test không xác nhận hình ảnh hiển thị đúng. Kiểm tra thêm resize, DPI, thiếu file và chuyển màn liên tục."
        }
      ],
      "tip": "Dùng API chuyển tọa độ của camera trong game thật; công thức thủ công chỉ an toàn khi các giả định về viewport và phép chiếu được giữ nguyên.",
      "exercise": {
        "title": "Từ vị trí con trỏ đến tọa độ thế giới",
        "instructions": "Hoàn thiện screen_to_world cho camera trực giao không xoay. origin là góc trái trên viewport; size và cursor dùng cùng đơn vị pixel logic; center là tâm camera.",
        "requirements": [
          "Trừ origin trước khi kiểm tra viewport.",
          "Biên trái/trên được nhận; biên phải/dưới bị loại: 0 ≤ local < size.",
          "World X tăng sang phải, world Y tăng lên; units_per_pixel phải dương.",
          "Trả None cho NaN, vô cực, kích thước không dương, điểm ngoài vùng hoặc kết quả không hữu hạn."
        ]
      },
      "starterCode": "fn screen_to_world(\n    cursor: (f64, f64), origin: (f64, f64), size: (f64, f64),\n    center: (f64, f64), units_per_pixel: f64,\n) -> Option<(f64, f64)> {\n    todo!(\"Kiểm tra viewport rồi đổi hệ tọa độ\")\n}\n\nfn main() {\n    let origin = (100.0, 50.0);\n    let size = (800.0, 600.0);\n    let center = (10.0, 20.0);\n    assert_eq!(screen_to_world((500.0, 350.0), origin, size, center, 0.5), Some(center));\n    assert_eq!(screen_to_world((100.0, 50.0), origin, size, center, 0.5), Some((-190.0, 170.0)));\n    assert_eq!(screen_to_world((900.0, 350.0), origin, size, center, 0.5), None);\n    assert_eq!(screen_to_world((99.0, 50.0), origin, size, center, 0.5), None);\n    assert_eq!(screen_to_world((100.0, 650.0), origin, size, center, 0.5), None);\n    assert_eq!(screen_to_world((500.0, 350.0), origin, (0.0, 600.0), center, 0.5), None);\n    assert_eq!(screen_to_world((f64::NAN, 1.0), origin, size, center, 0.5), None);\n    assert_eq!(screen_to_world((500.0, 350.0), origin, size, center, -1.0), None);\n    assert_eq!(screen_to_world((500.0, 350.0), origin, size, center, f64::INFINITY), None);\n    println!(\"Tâm camera: (10, 20); góc trái trên: (-190, 170)\");\n}",
      "solutionCode": "fn screen_to_world(\n    cursor: (f64, f64), origin: (f64, f64), size: (f64, f64),\n    center: (f64, f64), units_per_pixel: f64,\n) -> Option<(f64, f64)> {\n    let values = [cursor.0, cursor.1, origin.0, origin.1, size.0, size.1,\n                  center.0, center.1, units_per_pixel];\n    if values.iter().any(|value| !value.is_finite()) ||\n       size.0 <= 0.0 || size.1 <= 0.0 || units_per_pixel <= 0.0 {\n        return None;\n    }\n    let local = (cursor.0 - origin.0, cursor.1 - origin.1);\n    if local.0 < 0.0 || local.1 < 0.0 || local.0 >= size.0 || local.1 >= size.1 {\n        return None;\n    }\n    let world = (\n        center.0 + (local.0 - size.0 / 2.0) * units_per_pixel,\n        center.1 + (size.1 / 2.0 - local.1) * units_per_pixel,\n    );\n    (world.0.is_finite() && world.1.is_finite()).then_some(world)\n}\n\nfn main() {\n    let origin = (100.0, 50.0);\n    let size = (800.0, 600.0);\n    let center = (10.0, 20.0);\n    assert_eq!(screen_to_world((500.0, 350.0), origin, size, center, 0.5), Some(center));\n    assert_eq!(screen_to_world((100.0, 50.0), origin, size, center, 0.5), Some((-190.0, 170.0)));\n    assert_eq!(screen_to_world((900.0, 350.0), origin, size, center, 0.5), None);\n    assert_eq!(screen_to_world((99.0, 50.0), origin, size, center, 0.5), None);\n    assert_eq!(screen_to_world((100.0, 650.0), origin, size, center, 0.5), None);\n    assert_eq!(screen_to_world((500.0, 350.0), origin, (0.0, 600.0), center, 0.5), None);\n    assert_eq!(screen_to_world((f64::NAN, 1.0), origin, size, center, 0.5), None);\n    assert_eq!(screen_to_world((500.0, 350.0), origin, size, center, -1.0), None);\n    assert_eq!(screen_to_world((500.0, 350.0), origin, size, center, f64::INFINITY), None);\n    println!(\"Tâm camera: (10, 20); góc trái trên: (-190, 170)\");\n}",
      "expectedOutput": "Tâm camera: (10, 20); góc trái trên: (-190, 170)",
      "hints": [
        "Sau khi trừ origin, tâm viewport là (width/2, height/2).",
        "Đảo chiều Y bằng height/2 - local_y.",
        "Kiểm tra is_finite cho cả đầu vào và kết quả để xử lý tràn số thực."
      ],
      "quiz": {
        "question": "AssetServer::load đã trả handle cho ảnh nhân vật. Khi nào nên chuyển từ Loading sang Playing?",
        "options": [
          "Ngay khi handle được tạo",
          "Sau đúng 500 ms trên mọi máy",
          "Khi nhóm tài nguyên bắt buộc và các phụ thuộc đã sẵn sàng, hoặc đi vào nhánh lỗi rõ ràng",
          "Chỉ cần Camera2d tồn tại"
        ],
        "correct": 2,
        "explanation": "Handle là tham chiếu tới yêu cầu hoặc tài nguyên, không phải bằng chứng mọi dữ liệu cần dùng đã tải xong. Chuyển màn cần dựa vào trạng thái tải và chính sách lỗi."
      },
      "reference": {
        "label": "Bevy: chuyển viewport sang world",
        "url": "https://bevy.org/examples/2d-rendering/2d-viewport-to-world/"
      }
    },
    {
      "id": "game-input-performance",
      "moduleId": "track-game",
      "title": "Điều khiển, resource và hiệu năng gameplay",
      "duration": 60,
      "description": "Xây lớp hành động dễ dùng, không mất input giữa các tick và tối ưu bằng số đo.",
      "objectives": [
        "Tách phím vật lý khỏi hành động gameplay",
        "Giữ input tức thời qua frame không có fixed tick",
        "Chọn resource và component theo phạm vi sở hữu",
        "Đọc frame time và xác định điểm nóng trước khi tối ưu"
      ],
      "sections": [
        {
          "title": "Đọc ý định của người chơi",
          "text": "ButtonInput phân biệt pressed, just_pressed và just_released. Giữ phím di chuyển là trạng thái liên tục; nhảy, xác nhận hoặc mở menu thường là cạnh chuyển từ nhả sang nhấn. Dùng pressed để bật tắt pause sẽ đổi trạng thái nhiều lần khi người chơi giữ nút. Gắn tên hành động như Jump thay vì rải KeyCode khắp các system.\n\nLớp ánh xạ hành động giúp đổi phím, ghép gamepad và viết replay. Thêm dead zone cho cần analog theo yêu cầu thiết bị; chuẩn hóa vector di chuyển khi không muốn đi chéo nhanh hơn. Với bàn phím, cân nhắc phím vật lý hay ký tự tùy hành động và bố cục ngôn ngữ."
        },
        {
          "title": "Nối input với fixed timestep",
          "text": "Một khung hình có thể không chạy tick, vì vậy đọc just_pressed chỉ trong FixedUpdate có thể bỏ mất thao tác. Ngược lại, nhiều tick trong cùng frame có thể xử lý cùng cạnh nhiều lần nếu không có chính sách tiêu thụ. Thu nhận input trước vòng fixed, lưu ý định và lấy ra theo tick.\n\nDữ liệu liên tục thường giữ giá trị mới nhất; hành động rời rạc có thể dùng cờ hoặc hàng đợi giới hạn. Bài tập giữ tối đa ba lần nhấn, mỗi tick lấy một lần. Khi mất focus, bỏ lệnh chờ và đợi người chơi nhả phím trước khi nhận lại để tránh hành động bất ngờ lúc quay về cửa sổ."
        },
        {
          "title": "Resource có phạm vi sở hữu rõ ràng",
          "text": "Resource phù hợp cho cấu hình chung, trạng thái phiên, ánh xạ input hoặc bảng tra tài nguyên. Component phù hợp cho dữ liệu gắn với từng đối tượng. Một InputActions chung có thể đủ cho game một người; nhiều người chơi hoặc nhiều cửa sổ cần khóa theo người hay đặt component trên entity tương ứng.\n\nKhông biến một resource khổng lồ thành nơi chứa mọi dữ liệu: nhiều ResMut tới cùng loại làm các system tranh quyền ghi và khó xác định trách nhiệm. Tách cấu hình ít đổi khỏi trạng thái đổi từng tick. Khi reset vòng chơi, giữ lại thiết lập âm lượng và phím, nhưng xóa lệnh chờ, điểm số và trạng thái tạm thời đúng phạm vi.",
          "code": "use bevy::prelude::*;\n\n#[derive(Resource, Default)]\nstruct Actions { jump_pending: bool }\n\nfn collect_jump(keys: Res<ButtonInput<KeyCode>>, mut actions: ResMut<Actions>) {\n    actions.jump_pending |= keys.just_pressed(KeyCode::Space);\n}\n\nfn take_jump(mut actions: ResMut<Actions>) {\n    let requested = std::mem::take(&mut actions.jump_pending);\n    if requested {\n        // Kiểm tra điều kiện nhảy của nhân vật tại tick này.\n    }\n}\n// Đặt collect_jump trước vòng fixed, take_jump trong FixedUpdate.\n// Cờ gộp nhiều lần nhấn; dùng hàng đợi nếu mỗi lần đều cần được giữ."
        },
        {
          "title": "Đo đúng trước khi đổi cấu trúc",
          "text": "FPS trung bình có thể che các khung hình giật dài. Ghi thời gian frame và phân vị, thời gian mô phỏng, số entity, số lần cấp phát và tải GPU theo kịch bản lặp lại được. FrameTimeDiagnosticsPlugin cung cấp số liệu frame; đo từng system hoặc dùng profiler để tìm phần thực sự chiếm thời gian. Không kết luận GPU chậm chỉ từ thời gian CPU.\n\nChạy bản release, ghi độ phân giải, VSync và cấu hình máy. Đổi một yếu tố rồi đo lại cùng replay. Tối ưu có thể là giảm cấp phát, bỏ công việc không cần thiết hoặc cải thiện truy vấn; pooling và song song hóa chỉ hữu ích khi số đo chứng minh chi phí và độ phức tạp đáng đổi."
        }
      ],
      "tip": "Một cải tiến hiệu năng cần cả số đo tốt hơn và replay vẫn đúng; chỉ tăng FPS chưa đủ.",
      "exercise": {
        "title": "Giữ cạnh nhấn qua các tick",
        "instructions": "Hoàn thiện sample và consume của InputBuffer. sample chạy mỗi lần đọc thiết bị; consume chạy mỗi tick. Giữ phím liên tục chỉ tạo một lệnh.",
        "requirements": [
          "Tăng pending khi down đổi từ false sang true, giới hạn tối đa 3.",
          "consume trả true và giảm đúng một lệnh; hàng đợi rỗng trả false.",
          "Mất focus xóa pending và chặn input cho đến khi có mẫu focused=true, down=false.",
          "Nhấn lại sau khi đã nhả phải được nhận; nhiều lần consume không được dùng lại một lệnh."
        ]
      },
      "starterCode": "#[derive(Default)]\nstruct InputBuffer { was_down: bool, pending: u8, blocked: bool }\n\nimpl InputBuffer {\n    fn sample(&mut self, down: bool, focused: bool) {\n        todo!(\"Theo dõi cạnh và trạng thái focus\")\n    }\n\n    fn consume(&mut self) -> bool {\n        todo!(\"Lấy tối đa một lệnh\")\n    }\n}\n\nfn main() {\n    let mut input = InputBuffer::default();\n    input.sample(true, true);\n    input.sample(true, true);\n    input.sample(true, true);\n    assert_eq!(input.pending, 1);\n    assert!(input.consume());\n    assert!(!input.consume());\n    input.sample(false, true);\n    input.sample(true, true);\n    input.sample(false, true);\n    input.sample(true, true);\n    assert_eq!(input.pending, 2);\n    assert!(input.consume());\n    assert!(input.consume());\n    assert!(!input.consume());\n    for _ in 0..10 {\n        input.sample(false, true);\n        input.sample(true, true);\n    }\n    assert_eq!(input.pending, 3);\n    input.sample(true, false);\n    assert_eq!(input.pending, 0);\n    input.sample(true, true);\n    assert!(!input.consume());\n    input.sample(false, true);\n    input.sample(true, true);\n    assert!(input.consume());\n    assert!(!input.consume());\n    println!(\"Nhấn 1 lần, xử lý 1 lần; hàng đợi tối đa 3\");\n}",
      "solutionCode": "#[derive(Default)]\nstruct InputBuffer { was_down: bool, pending: u8, blocked: bool }\n\nimpl InputBuffer {\n    fn sample(&mut self, down: bool, focused: bool) {\n        if !focused {\n            self.pending = 0;\n            self.was_down = down;\n            self.blocked = true;\n            return;\n        }\n        if self.blocked {\n            self.was_down = down;\n            if !down { self.blocked = false; }\n            return;\n        }\n        if down && !self.was_down {\n            self.pending = self.pending.saturating_add(1).min(3);\n        }\n        self.was_down = down;\n    }\n\n    fn consume(&mut self) -> bool {\n        if self.pending == 0 { return false; }\n        self.pending -= 1;\n        true\n    }\n}\n\nfn main() {\n    let mut input = InputBuffer::default();\n    input.sample(true, true);\n    input.sample(true, true);\n    input.sample(true, true);\n    assert_eq!(input.pending, 1);\n    assert!(input.consume());\n    assert!(!input.consume());\n    input.sample(false, true);\n    input.sample(true, true);\n    input.sample(false, true);\n    input.sample(true, true);\n    assert_eq!(input.pending, 2);\n    assert!(input.consume());\n    assert!(input.consume());\n    assert!(!input.consume());\n    for _ in 0..10 {\n        input.sample(false, true);\n        input.sample(true, true);\n    }\n    assert_eq!(input.pending, 3);\n    input.sample(true, false);\n    assert_eq!(input.pending, 0);\n    input.sample(true, true);\n    assert!(!input.consume());\n    input.sample(false, true);\n    input.sample(true, true);\n    assert!(input.consume());\n    assert!(!input.consume());\n    println!(\"Nhấn 1 lần, xử lý 1 lần; hàng đợi tối đa 3\");\n}",
      "expectedOutput": "Nhấn 1 lần, xử lý 1 lần; hàng đợi tối đa 3",
      "hints": [
        "Xử lý mất focus và blocked trước khi phát hiện cạnh.",
        "Cạnh nhấn là down && !was_down; cập nhật was_down ở mỗi mẫu hợp lệ.",
        "Không xóa pending ở đầu mỗi frame, vì frame đó có thể không chạy tick."
      ],
      "quiz": {
        "question": "Game chạy hai FixedUpdate trong một frame, người chơi vừa nhấn Jump. Cách nào tránh nhảy hai lần ngoài ý muốn?",
        "options": [
          "Đọc just_pressed và thực hiện Jump trong cả hai tick",
          "Thu cạnh nhấn trước vòng fixed, lưu lệnh và tiêu thụ đúng một lần theo chính sách",
          "Chỉ đọc input ở khung hình có FPS cao",
          "Nhân số lần nhấn với delta time"
        ],
        "correct": 1,
        "explanation": "Input tức thời cần cầu nối giữa lịch thiết bị và lịch mô phỏng. Lệnh đã tiêu thụ không được dùng lại ở tick kế tiếp; những lệnh chưa dùng cần giữ qua frame không có tick."
      },
      "reference": {
        "label": "Bevy 0.20.1: ButtonInput",
        "url": "https://docs.rs/bevy/0.20.1/bevy/input/struct.ButtonInput.html"
      }
    },
    {
      "id": "game-testing-release",
      "moduleId": "track-game",
      "title": "Kiểm thử headless và phát hành game",
      "duration": 60,
      "description": "Xây bằng chứng cho tính đúng đắn của gameplay và kiểm tra bản đóng gói trên nền tảng mục tiêu.",
      "objectives": [
        "Phân chia unit test, ECS integration test và kiểm tra hình ảnh",
        "So sánh snapshot ổn định cho replay",
        "Khóa dependency và xây pipeline Cargo có thể lặp lại",
        "Đóng gói asset, giấy phép và ghi phạm vi nền tảng đã kiểm tra"
      ],
      "sections": [
        {
          "title": "Kiểm thử theo ranh giới trách nhiệm",
          "text": "Unit test kiểm tra luật thuần: máu không âm, cooldown đúng tick, nhân vật không vượt biên. Integration test tạo App tối thiểu, đăng ký system, thêm component rồi gọi App::update hoặc chạy schedule cần kiểm tra. Nhờ không mở cửa sổ, test nhanh và phù hợp CI. Dữ liệu đầu vào phải kiểm soát được, không đợi đồng hồ thật bằng sleep.\n\nHeadless không đồng nghĩa tự động thay đổi thời gian theo ý test. Nếu luật dùng Time, hãy cấp thời gian hoặc điều khiển tick rõ ràng. Kiểm tra entity bị xóa, message được tiêu thụ và transition ở đúng giai đoạn. Một ảnh đẹp không chứng minh các bất biến này; ngược lại test luật không kiểm tra shader, DPI hoặc cảm giác điều khiển."
        },
        {
          "title": "Snapshot cần thứ tự và định dạng ổn định",
          "text": "Để tìm lỗi replay, ghi snapshot của dữ liệu quyết định luật tại các tick mốc. Dùng ID nghiệp vụ rồi sắp xếp trước khi xuất; không dựa vào thứ tự query hoặc HashMap. Giữ trường có ý nghĩa như vị trí, máu, seed và trạng thái, bỏ dữ liệu hiển thị tạm thời như alpha nội suy.\n\nSnapshot nên có phiên bản định dạng. Khi so sánh khác nhau, chỉ ra entity và trường đầu tiên lệch thay vì chỉ báo một hash khác. Hash giúp tìm nhanh nhưng không thay thế dữ liệu chẩn đoán và có khả năng va chạm. Test bài tập chọn văn bản chuẩn hóa để nhìn rõ thay đổi, đồng thời từ chối ID trùng và dữ liệu sai."
        },
        {
          "title": "Build có thể kiểm tra và lặp lại",
          "text": "CI chạy fmt, clippy, unit test và integration test trước khi xây bản release. Lưu Cargo.lock của ứng dụng để khóa chính xác dependency đã giải; dùng --locked cho bước kiểm tra. Pin toolchain và ghi target, feature cùng lệnh build. Lockfile không tự bảo đảm hai binary giống từng byte trên hai hệ điều hành hoặc môi trường linker khác nhau.\n\nBevy thay đổi API giữa các phiên bản; đọc migration guide trước khi nâng cấp, rồi chạy lại test và smoke test. Tách feature headless khỏi renderer khi cần chạy CI nhẹ. Cross compile vẫn có thể cần linker, SDK và thư viện hệ thống của nền tảng đích; build thành công không thay thế chạy thử trên nền tảng đó.",
          "code": "# Chạy tại thư mục Cargo của dự án đã có Cargo.lock.\ncargo fmt --check\ncargo clippy --locked --all-targets -- -D warnings\ncargo test --locked\ncargo test --locked --release\ncargo build --locked --release\n\n# Ghi môi trường vào báo cáo phát hành.\nrustc -Vv\ncargo -V"
        },
        {
          "title": "Bản phát hành phải sử dụng được",
          "text": "Đóng gói binary cùng tài nguyên cần thiết, giấy phép, hướng dẫn điều khiển và thông tin phiên bản. Chạy từ thư mục sạch để phát hiện đường dẫn chỉ đúng trong workspace. Thử khởi động, resize, mất focus, pause, chơi lại, thiếu asset và đóng ứng dụng. Kiểm tra cả bàn phím lẫn cách đổi phím đã công bố.\n\nBáo cáo nên tách nền tảng đã build, đã chạy headless và đã kiểm tra cửa sổ. Ghi cấu hình GPU, driver hoặc giới hạn đã biết khi liên quan. Portfolio thuyết phục có replay tái hiện lỗi, test hồi quy và số đo trước/sau tối ưu. Người review cần thấy cách bạn tìm nguyên nhân và kiểm chứng sửa lỗi, không chỉ danh sách công nghệ sử dụng."
        }
      ],
      "tip": "Khi sửa lỗi gameplay, lưu input tái hiện và thêm một kiểm thử khiến bản cũ thất bại trước khi xác nhận bản mới.",
      "exercise": {
        "title": "Chuẩn hóa snapshot replay",
        "instructions": "Hoàn thiện canonical_snapshot. Mỗi tuple là (ID ổn định, tọa độ X, máu). Kết quả phải giống nhau dù thứ tự entity đầu vào khác nhau.",
        "requirements": [
          "Máu phải nằm trong [0,100]; trả Err(\"máu không hợp lệ\") trước khi xét ID.",
          "Sắp xếp tăng dần theo ID; từ chối ID trùng bằng Err(\"ID trùng\").",
          "Dòng đầu là v1; mỗi entity có dòng id,x,health và kết thúc bằng newline.",
          "Danh sách rỗng cho đúng chuỗi \"v1\\n\"; không thay đổi slice đầu vào."
        ]
      },
      "starterCode": "use std::fmt::Write;\n\nfn canonical_snapshot(entities: &[(u32, i32, i32)]) -> Result<String, &'static str> {\n    todo!(\"Kiểm tra, sắp xếp bản sao rồi xuất snapshot\")\n}\n\nfn main() {\n    let first = [(9, -2, 80), (2, 10, 100)];\n    let second = [(2, 10, 100), (9, -2, 80)];\n    let expected = \"v1\\n2,10,100\\n9,-2,80\\n\";\n    assert_eq!(canonical_snapshot(&first).unwrap(), expected);\n    assert_eq!(canonical_snapshot(&first), canonical_snapshot(&second));\n    assert_eq!(canonical_snapshot(&[]).unwrap(), \"v1\\n\");\n    assert_eq!(canonical_snapshot(&[(1, 0, 0)]).unwrap(), \"v1\\n1,0,0\\n\");\n    assert_eq!(canonical_snapshot(&[(1, 0, 50), (1, 3, 20)]), Err(\"ID trùng\"));\n    assert_eq!(canonical_snapshot(&[(1, 0, -1)]), Err(\"máu không hợp lệ\"));\n    assert_eq!(canonical_snapshot(&[(1, 0, 101)]), Err(\"máu không hợp lệ\"));\n    println!(\"Snapshot ổn định; phát hiện ID trùng và máu sai\");\n}",
      "solutionCode": "use std::fmt::Write;\n\nfn canonical_snapshot(entities: &[(u32, i32, i32)]) -> Result<String, &'static str> {\n    if entities.iter().any(|entity| !(0..=100).contains(&entity.2)) {\n        return Err(\"máu không hợp lệ\");\n    }\n    let mut sorted = entities.to_vec();\n    sorted.sort_by_key(|entity| entity.0);\n    if sorted.windows(2).any(|pair| pair[0].0 == pair[1].0) {\n        return Err(\"ID trùng\");\n    }\n    let mut output = String::from(\"v1\\n\");\n    for (id, x, health) in sorted {\n        writeln!(&mut output, \"{id},{x},{health}\").unwrap();\n    }\n    Ok(output)\n}\n\nfn main() {\n    let first = [(9, -2, 80), (2, 10, 100)];\n    let second = [(2, 10, 100), (9, -2, 80)];\n    let expected = \"v1\\n2,10,100\\n9,-2,80\\n\";\n    assert_eq!(canonical_snapshot(&first).unwrap(), expected);\n    assert_eq!(canonical_snapshot(&first), canonical_snapshot(&second));\n    assert_eq!(canonical_snapshot(&[]).unwrap(), \"v1\\n\");\n    assert_eq!(canonical_snapshot(&[(1, 0, 0)]).unwrap(), \"v1\\n1,0,0\\n\");\n    assert_eq!(canonical_snapshot(&[(1, 0, 50), (1, 3, 20)]), Err(\"ID trùng\"));\n    assert_eq!(canonical_snapshot(&[(1, 0, -1)]), Err(\"máu không hợp lệ\"));\n    assert_eq!(canonical_snapshot(&[(1, 0, 101)]), Err(\"máu không hợp lệ\"));\n    println!(\"Snapshot ổn định; phát hiện ID trùng và máu sai\");\n}",
      "expectedOutput": "Snapshot ổn định; phát hiện ID trùng và máu sai",
      "hints": [
        "Kiểm tra máu trước, sau đó sao chép slice bằng to_vec.",
        "sort_by_key theo ID rồi dùng windows(2) để phát hiện ID trùng.",
        "writeln! vào String giúp bảo đảm mỗi hàng có newline; import std::fmt::Write."
      ],
      "quiz": {
        "question": "Bộ test headless và cargo build --release đều thành công. Kết luận nào có cơ sở?",
        "options": [
          "Game chắc chắn hiển thị và chạy mượt trên mọi GPU",
          "Các kiểm tra luật đã chạy đạt và target đã build được; cần kiểm tra riêng bản đóng gói cùng cửa sổ trên máy mục tiêu",
          "Asset có thể bỏ khỏi bản phát hành",
          "Cargo.lock bảo đảm mọi binary đều giống từng byte"
        ],
        "correct": 1,
        "explanation": "Headless kiểm tra phần được chạy không có renderer; build xác nhận biên dịch và liên kết cho cấu hình đó. Tài nguyên, driver, cửa sổ và trải nghiệm người chơi vẫn cần được kiểm tra đúng phạm vi."
      },
      "reference": {
        "label": "Cargo: Cargo.toml và Cargo.lock",
        "url": "https://doc.rust-lang.org/cargo/guide/cargo-toml-vs-cargo-lock.html"
      }
    }
  ]
};
