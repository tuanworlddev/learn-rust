import type { TrackExpansion } from "../../specialization-types";

export const gameExpansion: TrackExpansion = {
  "chapters": [
    {
      "id": "game-chapter-ecs",
      "title": "Dữ liệu và vòng đời ECS",
      "lessonIds": [
        "game-ecs",
        "game-data-model",
        "game-lifecycle"
      ],
      "description": "Thiết kế entity, component và quyền sở hữu trạng thái.",
      "outcomes": [
        "Tách danh tính bền vững khỏi Entity runtime.",
        "Kiểm tra dữ liệu trước spawn.",
        "Xử lý nhận/xóa đúng một lần."
      ]
    },
    {
      "id": "game-chapter-rules",
      "title": "Luật, trạng thái và lịch hệ thống",
      "lessonIds": [
        "game-scheduling",
        "game-state-machines",
        "game-arena-project"
      ],
      "description": "Xây game loop có thứ tự và pause/restart rõ ràng.",
      "outcomes": [
        "Viết bảng chuyển trạng thái.",
        "Phân biệt input cạnh và giữ.",
        "Kiểm chứng move → collect → finish."
      ]
    },
    {
      "id": "game-chapter-simulation",
      "title": "Thời gian, va chạm và replay",
      "lessonIds": [
        "game-timestep",
        "game-collision",
        "game-replay"
      ],
      "description": "Giữ mô phỏng ổn định và phát lại có điều kiện rõ.",
      "outcomes": [
        "Xử lý timestep và ngân sách.",
        "Định nghĩa biên va chạm.",
        "Ghi input theo tick và kiểm soát RNG."
      ]
    },
    {
      "id": "game-chapter-scene",
      "title": "Scene, camera và hiển thị",
      "lessonIds": [
        "game-assets-coordinates",
        "game-render-pipeline",
        "game-scene-project"
      ],
      "description": "Tạo level hợp lệ rồi dựng lớp hiển thị độc lập.",
      "outcomes": [
        "Chuyển tọa độ và nội suy.",
        "Kiểm tra schema và reachable.",
        "Load candidate trước khi thay scene."
      ]
    },
    {
      "id": "game-chapter-behavior",
      "title": "Tác nhân và hiệu năng",
      "lessonIds": [
        "game-input-performance",
        "game-navigation",
        "game-profiling"
      ],
      "description": "Tạo hành vi và đo chi phí theo workload.",
      "outcomes": [
        "Tìm đường có giới hạn.",
        "Đo frame time và spike.",
        "Giữ replay khi tối ưu."
      ]
    },
    {
      "id": "game-chapter-release",
      "title": "Lưu tiến độ và phát hành",
      "lessonIds": [
        "game-testing-release",
        "game-save-format",
        "game-release-project"
      ],
      "description": "Tích hợp Bevy native và bàn giao game có kiểm thử.",
      "outcomes": [
        "Validate save theo phiên bản.",
        "Chạy cùng core trong headless/native.",
        "Playtest và ghi phạm vi nền tảng."
      ]
    }
  ],
  "lessons": [
    {
      "id": "game-data-model",
      "moduleId": "track-game",
      "title": "Thiết kế dữ liệu gameplay",
      "description": "Tách danh tính, trạng thái và hành vi để ECS dễ mở rộng và kiểm thử.",
      "duration": 60,
      "objectives": [
        "Kiểm tra actor có ID khác 0, không trùng, health 1..=100, x trong -100..=100.",
        "Từ chối toàn batch nếu có một actor sai; không tạo world từng phần.",
        "In actors valid."
      ],
      "sections": [
        {
          "title": "Bắt đầu từ bất biến của trò chơi",
          "text": "Trước khi tạo component, viết các quy tắc cần luôn đúng: nhân vật còn sống có health trong khoảng cho phép, một vật phẩm được nhặt tối đa một lần, score không giảm nếu luật không yêu cầu. Component lưu dữ liệu cần cho các hệ thống; system thực hiện chuyển trạng thái theo quy tắc. Không cố chuyển mọi class của thiết kế hướng đối tượng thành một component khổng lồ. Một Player chứa cả texture, âm thanh, mạng và mọi biến gameplay khiến các truy vấn khó tách và khó chạy độc lập."
        },
        {
          "title": "Danh tính runtime khác danh tính lưu trữ",
          "text": "Entity của ECS là tay cầm đến một thực thể trong world hiện tại. Sau despawn, ID runtime không nên được dùng như định danh bền vững trong save hoặc replay. Tạo GameId riêng khi cần tham chiếu ổn định, kiểm tra không trùng và có chính sách cấp ID. Khi tải save, dựng bảng GameId sang Entity rồi mới liên kết các quan hệ. Không ghi trực tiếp địa chỉ bộ nhớ hoặc thứ tự vị trí trong Vec và kỳ vọng nó tồn tại qua lần chạy khác."
        },
        {
          "title": "Component nhỏ theo nhu cầu truy cập",
          "text": "Position, Velocity và Health có thể tách vì các hệ thống cần tổ hợp khác nhau. Marker như Player hoặc Collectible biểu diễn tập truy vấn; resource chứa trạng thái cấp world như luật, tick hoặc score chung. Đừng tách một giá trị thành hàng chục component chỉ vì nhỏ hơn nghe có vẻ nhanh hơn. Lựa chọn dựa vào phép truy vấn, số lượng entity và tần suất thay đổi. Đo trường hợp thật trước khi tối ưu layout; sự rõ ràng của bất biến vẫn cần giữ."
        },
        {
          "title": "Tách dữ liệu mô phỏng khỏi trình bày",
          "text": "Vị trí vật lý quyết định va chạm; Transform hiển thị có thể là vị trí nội suy giữa hai tick. Animation không được tự thay đổi health nếu gameplay chưa nhận sự kiện hợp lệ. Một hiệu ứng nổ có thể tồn tại thêm sau khi entity chiến đấu bị xóa, nên đời sống hiển thị không cần trùng hoàn toàn với đời sống mô phỏng. Tách hai lớp cho phép chạy test không cửa sổ và phát lại cùng input mà không phụ thuộc frame rate hoặc tài nguyên đồ họa."
        },
        {
          "title": "Kiểm tra schema trước khi đưa vào world",
          "text": "Dữ liệu level cũng là đầu vào: ID trùng, tọa độ ngoài biên và health âm phải bị từ chối trước spawn. Dựng world một phần rồi mới gặp lỗi khiến việc rollback khó hơn. Bài thực hành kiểm tra các bản ghi actor bằng ID riêng, health và vị trí giới hạn. Dùng HashSet phát hiện ID trùng nhưng không dựa vào thứ tự lặp của nó để xác định lượt xử lý gameplay. Khi cần kết quả ổn định, sắp xếp theo GameId hoặc dùng cấu trúc có thứ tự."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Thiết kế dữ liệu gameplay",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Kiểm tra actor có ID khác 0, không trùng, health 1..=100, x trong -100..=100.",
          "Từ chối toàn batch nếu có một actor sai; không tạo world từng phần.",
          "In actors valid."
        ]
      },
      "starterCode": "fn main() {\n    // Kiểm tra actor có ID khác 0, không trùng, health 1..=100, x trong -100..=100.\n    // Từ chối toàn batch nếu có một actor sai; không tạo world từng phần.\n    // In actors valid.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "use std::collections::HashSet;\nfn valid(rows:&[(u64,i32,i32)])->bool{\n let mut ids=HashSet::new();\n rows.iter().all(|&(id,hp,x)|id!=0&&ids.insert(id)&&(1..=100).contains(&hp)&&(-100..=100).contains(&x))\n}\nfn main(){\n assert!(valid(&[(1,100,0),(2,50,10)]));\n assert!(!valid(&[(1,100,0),(1,50,10)]));\n assert!(!valid(&[(1,0,0)]));assert!(!valid(&[(1,10,101)]));\n println!(\"actors valid\");\n}",
      "expectedOutput": "actors valid",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Nên lưu gì để nối quan hệ giữa các entity sau khi tải save?",
        "options": [
          "Địa chỉ bộ nhớ cũ.",
          "Thứ tự HashMap trong lần chạy trước.",
          "GameId ổn định và bảng ánh xạ sang Entity mới."
        ],
        "correct": 2,
        "explanation": "Entity runtime phụ thuộc world; ID riêng có kiểm tra giúp dựng lại quan hệ sau tải."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://bevy.org/learn/quick-start/getting-started/ecs/"
      }
    },
    {
      "id": "game-lifecycle",
      "moduleId": "track-game",
      "title": "Spawn, despawn và quyền sở hữu tài nguyên",
      "description": "Quản lý thay đổi cấu trúc ECS mà không để trạng thái treo hoặc nhân đôi hiệu ứng.",
      "duration": 60,
      "objectives": [
        "Viết claim với HashSet ID, trả false nếu đã nhận; điểm mới dùng checked_add.",
        "Nếu tràn, giữ nguyên score và tập ID.",
        "In score=10 claims=1."
      ],
      "sections": [
        {
          "title": "Một entity có vòng đời rõ ràng",
          "text": "Đặt các giai đoạn như đang hoạt động, chờ xóa và đã xóa thay vì để nhiều system tự suy đoán từ health. Khi health về không, hệ thống luật phát sinh yêu cầu chết; hệ thống khác ghi điểm hoặc hiệu ứng theo một lần chuyển trạng thái. Nếu mỗi frame thấy health bằng không đều cộng điểm, người chơi nhận điểm vô hạn. Bất biến cần kiểm tra là một sự kiện nghiệp vụ chỉ được áp dụng một lần cho cùng actor và cùng lần sống."
        },
        {
          "title": "Lệnh thay đổi cấu trúc có thể bị trì hoãn",
          "text": "Trong Bevy, Commands cho phép hệ thống xếp lệnh spawn hoặc despawn mà không trực tiếp giữ quyền sửa toàn world. Thời điểm lệnh được áp dụng phụ thuộc lịch và điểm đồng bộ. Một system chạy ngay sau không nên mặc định thấy entity mới nếu chưa có quan hệ lịch phù hợp. Với logic cần cùng tick, thiết kế các pha và kiểm tra việc nhìn thấy dữ liệu bằng test. Đừng sửa lỗi bằng cách gọi cập nhật toàn app thêm lần nữa vì nó cũng chạy lại gameplay."
        },
        {
          "title": "Tham chiếu đến entity có thể hết hiệu lực",
          "text": "Một target từng tồn tại có thể bị despawn trước khi projectile xử lý. Dùng truy vấn có khả năng trả không tìm thấy và chính sách rõ: hủy projectile, bỏ target hoặc chọn lại. Không unwrap chỉ vì target hợp lệ khi được tạo. Khi có quan hệ cha con, xác định việc xóa cha có xóa con trong API và cấu hình đang dùng; không giả định mọi engine xử lý giống nhau. Các tài nguyên dùng chung nên có handle và quy tắc sống riêng."
        },
        {
          "title": "Dọn trạng thái theo scene và theo phiên chơi",
          "text": "Khi chuyển màn, đánh dấu entity thuộc scene để dọn đúng nhóm. Resource bền qua nhiều màn như cài đặt âm thanh khác resource một lượt chơi như score. Reset quá rộng làm mất tùy chọn người dùng; reset quá hẹp để lại enemy hoặc timer từ màn cũ. Test chuyển menu sang chơi, chơi sang thua và chơi lại nhiều lần; số entity và timer phải trở về mức dự kiến. Đây cũng là cách phát hiện rò rỉ logic dù bộ nhớ Rust không có lỗi sở hữu."
        },
        {
          "title": "Thiết kế xử lý idempotent",
          "text": "Bài thực hành dùng tập ID vật phẩm đã nhận để cộng điểm đúng một lần. Tính score mới bằng checked_add trước khi ghi ID vào tập, để lỗi tràn không tiêu thụ vật phẩm. Thử cùng ID hai lần, ID mới khi score ở giới hạn và xác nhận trạng thái không đổi khi lỗi. Trong ECS, ý tưởng này trở thành marker hoặc tập trạng thái cùng một pha commit. Nó giúp xử lý message lặp hoặc hai hệ thống cùng phát hiện va chạm mà không nhân đôi phần thưởng."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Spawn, despawn và quyền sở hữu tài nguyên",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Viết claim với HashSet ID, trả false nếu đã nhận; điểm mới dùng checked_add.",
          "Nếu tràn, giữ nguyên score và tập ID.",
          "In score=10 claims=1."
        ]
      },
      "starterCode": "fn main() {\n    // Viết claim với HashSet ID, trả false nếu đã nhận; điểm mới dùng checked_add.\n    // Nếu tràn, giữ nguyên score và tập ID.\n    // In score=10 claims=1.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "use std::collections::HashSet;\nfn claim(seen:&mut HashSet<u64>,score:&mut u64,id:u64,value:u64)->Result<bool,&'static str>{\n if seen.contains(&id){return Ok(false);}\n let next=score.checked_add(value).ok_or(\"overflow\")?;\n seen.insert(id);*score=next;Ok(true)\n}\nfn main(){\n let mut seen=HashSet::new();let mut score=0;\n assert_eq!(claim(&mut seen,&mut score,1,10),Ok(true));\n assert_eq!(claim(&mut seen,&mut score,1,10),Ok(false));\n assert_eq!(score,10);\n let mut high=u64::MAX;assert!(claim(&mut seen,&mut high,2,1).is_err());\n assert!(!seen.contains(&2));assert_eq!(high,u64::MAX);\n println!(\"score=10 claims=1\");\n}",
      "expectedOutput": "score=10 claims=1",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Hai system phát hiện cùng vật phẩm trong một tick. Cần bảo vệ gì?",
        "options": [
          "Cộng điểm cả hai lần rồi trừ sau.",
          "Chuyển trạng thái nhận vật phẩm chỉ được commit một lần.",
          "Giảm tốc độ frame để tránh trùng."
        ],
        "correct": 1,
        "explanation": "Bất biến idempotent ngăn nhân đôi phần thưởng dù nhiều đường phát hiện cùng sự kiện."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://docs.rs/bevy_ecs/latest/bevy_ecs/system/struct.Commands.html"
      }
    },
    {
      "id": "game-state-machines",
      "moduleId": "track-game",
      "title": "State machine và luồng gameplay",
      "description": "Tổ chức menu, chơi, tạm dừng và kết thúc bằng chuyển trạng thái kiểm soát được.",
      "duration": 60,
      "objectives": [
        "Viết transition cho Menu/Playing/Paused/Finished với Start/Pause/Resume/Finish.",
        "Action không hợp lệ trả lỗi; kiểm tra chuỗi chơi đầy đủ và Resume sau Finished.",
        "In state=Finished."
      ],
      "sections": [
        {
          "title": "Trạng thái làm rõ các hành vi được phép",
          "text": "Một trò chơi có thể ở Menu, Playing, Paused hoặc Finished. Khi Paused, UI vẫn nhận input nhưng mô phỏng không tiến tick; khi Finished, input di chuyển không làm nhân vật chạy thêm. Viết bảng chuyển trạng thái với sự kiện được phép trước khi viết nhiều if rải rác. Nếu mỗi system tự dùng cờ booleans riêng như started, paused, dead, chúng có thể tạo tổ hợp vô nghĩa. Enum biểu diễn tập trạng thái hợp lệ và buộc match xử lý rõ các nhánh."
        },
        {
          "title": "Chuyển trạng thái khác với cập nhật trạng thái",
          "text": "Nhấn Start trong Menu có thể tạo yêu cầu sang Playing; việc tạo entity và reset timer nằm ở bước vào trạng thái. Đừng thực hiện reset mỗi frame khi đang Playing. Tương tự, cleanup diễn ra một lần khi rời scene. Trong Bevy có thể dùng state plugin và lịch vào/ra; ví dụ lõi của khóa dùng enum và hàm transition thuần để kiểm tra quy tắc trước. Khi ghép plugin, giữ nguyên bảng chuyển và test hành vi quan sát được."
        },
        {
          "title": "Input cạnh và input mức không giống nhau",
          "text": "Một phím đang giữ biểu diễn mức; vừa nhấn biểu diễn cạnh. Toggle pause bằng pressed sẽ đảo trạng thái ở mọi frame trong thời gian giữ phím. Ghi nhận cạnh một lần rồi chuyển thành command theo tick hoặc sự kiện UI. Nếu mô phỏng có nhiều tick trong một frame, command one-shot chỉ được tiêu thụ một lần. Input di chuyển có thể giữ cho nhiều tick, nhưng nhảy, bắn và mở menu cần chính sách cụ thể để không nhân đôi."
        },
        {
          "title": "Tạm dừng cần định nghĩa các đồng hồ",
          "text": "Thời gian UI, âm thanh và gameplay có thể đi theo đồng hồ khác nhau. Khi pause, timer hồi chiêu có dừng hay tiếp tục? Khi cửa sổ mất focus, có tự pause không? Ghi các quyết định đó trong yêu cầu rồi test bằng đồng hồ giả. Không dùng wall clock trực tiếp trong lõi mô phỏng nếu cần replay xác định. Trạng thái mạng nhiều người còn có quy tắc riêng: pause màn hình của một client không nhất thiết dừng server."
        },
        {
          "title": "Kiểm thử bảng chuyển và tính bất biến",
          "text": "Bài thực hành viết transition từ trạng thái và action sang Result<State>. Start chỉ có tác dụng ở Menu, Pause chỉ từ Playing, Resume chỉ từ Paused, Finish chỉ từ Playing. Các action không hợp lệ trả lỗi và không thay trạng thái hiện tại. Test một lượt menu, chơi, pause, resume, kết thúc, rồi thử resume sau kết thúc. Khi thêm Restart, phải quyết định reset những tài nguyên nào; đây là yêu cầu của dự án arena thay vì một nút chỉ đổi chữ trên màn hình."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: State machine và luồng gameplay",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Viết transition cho Menu/Playing/Paused/Finished với Start/Pause/Resume/Finish.",
          "Action không hợp lệ trả lỗi; kiểm tra chuỗi chơi đầy đủ và Resume sau Finished.",
          "In state=Finished."
        ]
      },
      "starterCode": "fn main() {\n    // Viết transition cho Menu/Playing/Paused/Finished với Start/Pause/Resume/Finish.\n    // Action không hợp lệ trả lỗi; kiểm tra chuỗi chơi đầy đủ và Resume sau Finished.\n    // In state=Finished.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "#[derive(Clone,Copy,Debug,PartialEq,Eq)]enum State{Menu,Playing,Paused,Finished}\nenum Action{Start,Pause,Resume,Finish}\nfn transition(s:State,a:Action)->Result<State,&'static str>{\n match(s,a){(State::Menu,Action::Start)=>Ok(State::Playing),(State::Playing,Action::Pause)=>Ok(State::Paused),(State::Paused,Action::Resume)=>Ok(State::Playing),(State::Playing,Action::Finish)=>Ok(State::Finished),_=>Err(\"invalid_transition\")}\n}\nfn main(){\n let mut s=State::Menu;\n for a in [Action::Start,Action::Pause,Action::Resume,Action::Finish]{s=transition(s,a).unwrap();}\n assert_eq!(s,State::Finished);assert!(transition(s,Action::Resume).is_err());\n println!(\"state=Finished\");\n}",
      "expectedOutput": "state=Finished",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Giữ phím Escape làm pause bật tắt liên tục. Lỗi nằm ở đâu?",
        "options": [
          "Dùng input mức cho thao tác cần cạnh vừa nhấn.",
          "Timestep cố định luôn sai.",
          "Cần tăng số enemy."
        ],
        "correct": 0,
        "explanation": "Toggle cần một command cho mỗi lần nhấn, không thực hiện lại ở từng frame khi phím còn giữ."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://bevy.org/examples/state/states/"
      }
    },
    {
      "id": "game-arena-project",
      "moduleId": "track-game",
      "title": "Dự án: arena nhặt vật phẩm bằng Bevy ECS",
      "description": "Xây gameplay headless có thứ tự hệ thống, trạng thái và luật nhận điểm.",
      "duration": 60,
      "objectives": [
        "Mô phỏng nhân vật x=0, item ở x=1 trị giá 10; mỗi input +1 đi một ô.",
        "Nhận item tối đa một lần; pause giữ nguyên cả tick và x.",
        "In x=1 score=10 tick=1."
      ],
      "sections": [
        {
          "title": "Sản phẩm nhỏ có luật đầy đủ",
          "text": "Arena một chiều có nhân vật bắt đầu ở vị trí không, ba vật phẩm ở các vị trí xác định và biên từ âm mười đến mười. Input mỗi tick là trái, đứng hoặc phải. Khi nhân vật đi tới vật phẩm chưa nhận, score tăng và vật phẩm được đánh dấu đã nhận. Pause không tiến tick hoặc di chuyển. Khi đạt mục tiêu, trạng thái Finished chặn điều khiển tiếp. Đây là game loop hoàn chỉnh để kiểm tra ECS, chưa có cửa sổ hay âm thanh."
        },
        {
          "title": "Chia component và resource theo luật",
          "text": "Player và Item là marker; Position lưu tọa độ số nguyên; Worth lưu số điểm; Claimed đánh dấu vật phẩm đã nhận. Resource Control giữ trục input, Session giữ tick, score và phase. Hệ thống di chuyển chỉ xử lý Player và hệ thống nhận vật phẩm truy vấn Item. Kiểm tra dữ liệu level trước spawn: ID không trùng, vị trí trong biên, điểm không quá giới hạn. Không đưa score vào từng sprite vì điểm là trạng thái của phiên chơi."
        },
        {
          "title": "Thứ tự là một phần của tính đúng",
          "text": "Lịch headless chạy một lần cập nhật ứng với một tick mô phỏng do test điều khiển. Chuỗi hệ thống di chuyển rồi nhận vật phẩm rồi kiểm tra kết thúc cần quan hệ thứ tự rõ ràng. Nếu kiểm tra vật phẩm trước di chuyển, người chơi phải chờ thêm một tick để nhận. Nếu hai item cùng vị trí, tổng điểm phải được tính đúng một lần cho từng item. Mã mẫu dùng cờ trong component để commit ngay tại pha nhận, tránh phụ thuộc thời điểm Commands được áp dụng."
        },
        {
          "title": "Lỗi input không làm tiến một phần tick",
          "text": "Trục ngoài khoảng âm một đến một bị từ chối ở hàm cung cấp input. Khi session không Playing, tick giữ nguyên. Phép tăng tick và điểm dùng số có kiểm tra hoặc miền giới hạn đã chứng minh. Test phải xác nhận lỗi không làm nhân vật di chuyển rồi mới báo lỗi. Lõi có thể trả báo cáo trạng thái cho UI mà không biết renderer; điều này giúp cùng một bộ luật được kiểm thử trong CI và được dùng từ ứng dụng Bevy có cửa sổ."
        },
        {
          "title": "Nghiệm thu và mở rộng có chủ đích",
          "text": "Chạy các test thứ tự nhận điểm, pause, hoàn tất, input sai và không nhận trùng. Người học bổ sung restart, thêm một loại vật phẩm có luật riêng và replay theo GameId ổn định. Sau đó tạo lớp hiển thị từ snapshot, không lấy Transform làm nguồn chân lý của gameplay. Bài scene và capstone sẽ dạy camera, asset và tích hợp cửa sổ. Báo cáo dự án cần chỉ ra những gì test headless chứng minh và những gì phải kiểm tra trực tiếp như focus, bàn phím, tỷ lệ màn hình và GPU."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Dự án: arena nhặt vật phẩm bằng Bevy ECS",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Mô phỏng nhân vật x=0, item ở x=1 trị giá 10; mỗi input +1 đi một ô.",
          "Nhận item tối đa một lần; pause giữ nguyên cả tick và x.",
          "In x=1 score=10 tick=1."
        ]
      },
      "starterCode": "fn main() {\n    // Mô phỏng nhân vật x=0, item ở x=1 trị giá 10; mỗi input +1 đi một ô.\n    // Nhận item tối đa một lần; pause giữ nguyên cả tick và x.\n    // In x=1 score=10 tick=1.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "#[derive(Debug,PartialEq,Eq)]struct Game{x:i32,score:u32,tick:u64,claimed:bool,paused:bool}\nfn step(g:&mut Game,axis:i8)->Result<(),&'static str>{\n if !(-1..=1).contains(&axis){return Err(\"axis\");}\n if g.paused{return Ok(());}\n let tick=g.tick.checked_add(1).ok_or(\"tick\")?;\n let x=(g.x+i32::from(axis)).clamp(-10,10);\n if x==1&&!g.claimed{g.score=g.score.checked_add(10).ok_or(\"score\")?;g.claimed=true;}\n g.x=x;g.tick=tick;Ok(())\n}\nfn main(){\n let mut g=Game{x:0,score:0,tick:0,claimed:false,paused:false};step(&mut g,1).unwrap();\n g.paused=true;step(&mut g,1).unwrap();\n assert_eq!((g.x,g.score,g.tick),(1,10,1));assert!(step(&mut g,2).is_err());\n println!(\"x=1 score=10 tick=1\");\n}",
      "expectedOutput": "x=1 score=10 tick=1",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Item được nhận chậm một tick sau khi đi tới vị trí. Cần kiểm tra gì?",
        "options": [
          "Màu của sprite.",
          "Kích thước texture.",
          "Thứ tự move rồi collect trong lịch."
        ],
        "correct": 2,
        "explanation": "Collect trước move quan sát vị trí cũ; thứ tự hệ thống là phần của luật gameplay."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://docs.rs/bevy_ecs/latest/bevy_ecs/schedule/index.html"
      },
      "localLab": {
        "title": "Arena ECS không cửa sổ",
        "instructions": "Tạo arena-ecs với các tệp bên dưới. Bevy 0.20.1 chỉ bật std cho App và ECS. Mỗi app.update trong test là một tick điều khiển, chưa phải clock thời gian thực. Lịch move → collect → finish dùng chain rõ ràng.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"arena-ecs\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\nbevy_app = { version = \"=0.20.1\", default-features = false, features = [\"std\"] }\nbevy_ecs = { version = \"=0.20.1\", default-features = false, features = [\"std\"] }\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use bevy_app::{App,Update};\nuse bevy_ecs::prelude::*;\n#[derive(Component,Debug)]pub struct Position(pub i32);\n#[derive(Component)]pub struct Player;\n#[derive(Component)]pub struct Item{pub id:u32,pub value:u32,pub claimed:bool}\n#[derive(Clone,Copy,Debug,PartialEq,Eq)]pub enum Phase{Playing,Paused,Finished,Fault}\n#[derive(Resource)]pub struct Session{pub tick:u64,pub score:u32,pub phase:Phase}\n#[derive(Resource,Default)]struct Control(i8);\n#[derive(Resource)]struct PlayerEntity(Entity);\n#[derive(Debug,PartialEq,Eq)]pub struct Snapshot{pub x:i32,pub tick:u64,pub score:u32,pub phase:Phase}\nfn advance(mut session:ResMut<Session>,control:Res<Control>,mut players:Query<&mut Position,With<Player>>){\n if session.phase!=Phase::Playing{return;}\n let Some(tick)=session.tick.checked_add(1)else{session.phase=Phase::Fault;return;};\n for mut position in &mut players{position.0=(position.0+i32::from(control.0)).clamp(-10,10);}\n session.tick=tick;\n}\nfn collect(mut session:ResMut<Session>,players:Query<&Position,With<Player>>,mut items:Query<(&Position,&mut Item),Without<Player>>){\n if session.phase!=Phase::Playing{return;}\n let Some(player)=players.iter().next()else{return;};\n for(position,mut item)in &mut items{\n  if position.0==player.0&&!item.claimed{\n   // The fixture contains exactly three items of value 10.\n   session.score+=item.value;item.claimed=true;\n  }\n }\n}\nfn finish(mut session:ResMut<Session>){if session.score==30&&session.phase==Phase::Playing{session.phase=Phase::Finished;}}\npub fn build()->App{\n let mut app=App::new();\n app.insert_resource(Control::default()).insert_resource(Session{tick:0,score:0,phase:Phase::Playing});\n let entity=app.world_mut().spawn((Player,Position(0))).id();\n app.insert_resource(PlayerEntity(entity));\n for id in 1..=3{app.world_mut().spawn((Position(id as i32),Item{id,value:10,claimed:false}));}\n app.add_systems(Update,(advance,collect,finish).chain());app\n}\npub fn step(app:&mut App,axis:i8)->Result<(),&'static str>{\n if !(-1..=1).contains(&axis){return Err(\"axis\");}\n app.world_mut().resource_mut::<Control>().0=axis;app.update();Ok(())\n}\npub fn pause(app:&mut App,paused:bool){\n let mut session=app.world_mut().resource_mut::<Session>();\n match(session.phase,paused){(Phase::Playing,true)=>session.phase=Phase::Paused,(Phase::Paused,false)=>session.phase=Phase::Playing,_=>{}}\n}\npub fn snapshot(app:&App)->Snapshot{\n let world=app.world();let s=world.resource::<Session>();let entity=world.resource::<PlayerEntity>().0;\n Snapshot{x:world.get::<Position>(entity).expect(\"fixture player\").0,tick:s.tick,score:s.score,phase:s.phase}\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use arena_ecs::{build,step,snapshot,Phase};\nfn main(){let mut app=build();for axis in [1,1,1]{step(&mut app,axis).unwrap();}let s=snapshot(&app);assert_eq!(s.phase,Phase::Finished);println!(\"x={} score={} tick={}\",s.x,s.score,s.tick);}\n"
          },
          {
            "path": "tests/gameplay.rs",
            "content": "use arena_ecs::{build,step,pause,snapshot,Phase,Session};\n#[test]fn movement_precedes_collect(){let mut app=build();step(&mut app,1).unwrap();let s=snapshot(&app);assert_eq!((s.x,s.score,s.tick),(1,10,1));}\n#[test]fn item_only_once(){let mut app=build();for a in [1,-1,1]{step(&mut app,a).unwrap();}assert_eq!(snapshot(&app).score,10);}\n#[test]fn pause_preserves_state(){let mut app=build();pause(&mut app,true);let before=snapshot(&app);step(&mut app,1).unwrap();assert_eq!(snapshot(&app),before);pause(&mut app,false);step(&mut app,1).unwrap();assert_eq!(snapshot(&app).score,10);}\n#[test]fn complete_stops_ticks(){let mut app=build();for _ in 0..3{step(&mut app,1).unwrap();}let before=snapshot(&app);assert_eq!(before.phase,Phase::Finished);step(&mut app,1).unwrap();assert_eq!(snapshot(&app),before);}\n#[test]fn invalid_input_atomic(){let mut app=build();let before=snapshot(&app);assert!(step(&mut app,2).is_err());assert_eq!(snapshot(&app),before);}\n#[test]fn overflow_stops_before_move(){let mut app=build();app.world_mut().resource_mut::<Session>().tick=u64::MAX;step(&mut app,1).unwrap();let s=snapshot(&app);assert_eq!(s.x,0);assert_eq!(s.phase,Phase::Fault);}\n"
          },
          {
            "path": "README.md",
            "content": "# Arena ECS\n\nChạy cargo test và cargo run. Fixture có đúng ba item trị giá 10 ở x=1,2,3, player x=0, biên [-10,10]. Mỗi update là một tick do caller quyết định. Phase gồm Playing, Paused, Finished, Fault. Lỗi axis không sửa trạng thái; tràn tick chuyển Fault trước di chuyển. Mở rộng level phải validate tổng điểm, số item và vị trí trước spawn; không tiếp tục dựa vào chặn trên của fixture. Thêm restart, replay theo GameId và hai loại item kèm regression. Mã này không khởi tạo renderer hoặc GPU.\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run"
        ],
        "checks": [
          "Sáu test kiểm tra thứ tự, nhận một lần, pause, hoàn tất, input sai và tràn tick.",
          "Chương trình in x=3 score=30 tick=3.",
          "Thêm restart và replay trước khi đánh giá dự án hoàn chỉnh."
        ]
      },
      "simulation": {
        "title": "Thứ tự trong một tick",
        "description": "Cùng input nhưng lịch khác làm thời điểm nhận điểm khác. Mô phỏng dùng arena một chiều với item ở x=1.",
        "kind": "sequence",
        "nodes": [
          {
            "id": "input",
            "label": "Input",
            "detail": "Trục theo tick"
          },
          {
            "id": "move",
            "label": "Move",
            "detail": "Vị trí mô phỏng"
          },
          {
            "id": "collect",
            "label": "Collect",
            "detail": "Nhận item một lần"
          },
          {
            "id": "commit",
            "label": "Snapshot",
            "detail": "Score và tick"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Move trước collect",
            "steps": [
              {
                "title": "Input",
                "description": "Player ở x=0, trục +1.",
                "activeNodeIds": [
                  "input"
                ],
                "values": [
                  {
                    "label": "x",
                    "value": "0"
                  },
                  {
                    "label": "axis",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Move",
                "description": "Vị trí thành x=1.",
                "activeNodeIds": [
                  "move"
                ],
                "values": [
                  {
                    "label": "x",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Collect",
                "description": "Item ở x=1 chưa nhận.",
                "activeNodeIds": [
                  "collect"
                ],
                "values": [
                  {
                    "label": "claimed",
                    "value": "true"
                  },
                  {
                    "label": "score",
                    "value": "10"
                  }
                ]
              },
              {
                "title": "Commit",
                "description": "Snapshot cuối tick đúng luật.",
                "activeNodeIds": [
                  "commit"
                ],
                "values": [
                  {
                    "label": "tick",
                    "value": "1"
                  },
                  {
                    "label": "x",
                    "value": "1"
                  },
                  {
                    "label": "score",
                    "value": "10"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "Collect trước move",
            "steps": [
              {
                "title": "Input",
                "description": "Cùng input +1 tại x=0.",
                "activeNodeIds": [
                  "input"
                ],
                "values": [
                  {
                    "label": "x",
                    "value": "0"
                  },
                  {
                    "label": "axis",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Collect sớm",
                "description": "Vị trí cũ không trùng item.",
                "activeNodeIds": [
                  "collect"
                ],
                "values": [
                  {
                    "label": "claimed",
                    "value": "false"
                  },
                  {
                    "label": "score",
                    "value": "0"
                  }
                ]
              },
              {
                "title": "Move sau",
                "description": "Player tới x=1 nhưng collect đã chạy.",
                "activeNodeIds": [
                  "move"
                ],
                "values": [
                  {
                    "label": "x",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Phát hiện lệch",
                "description": "Test cùng tick thất bại.",
                "activeNodeIds": [
                  "commit"
                ],
                "values": [
                  {
                    "label": "tick",
                    "value": "1"
                  },
                  {
                    "label": "score",
                    "value": "0"
                  },
                  {
                    "label": "expected",
                    "value": "10"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "game-collision",
      "moduleId": "track-game",
      "title": "Va chạm, broad phase và phản ứng",
      "description": "Xác định rõ hình học, biên và thứ tự giải quyết tiếp xúc.",
      "duration": 60,
      "objectives": [
        "Viết overlap cho AABB i32 nửa mở; hộp rỗng hoặc min >= max bị từ chối.",
        "Hai hộp chỉ chạm cạnh không overlap; hộp nằm trong hộp thì có.",
        "In overlap rules verified."
      ],
      "sections": [
        {
          "title": "Va chạm bắt đầu từ hợp đồng hình học",
          "text": "AABB là hộp song song với trục, thường lưu min và max mỗi chiều. Cần quyết định hai cạnh vừa chạm có được coi là va chạm hay không. Nếu dùng vùng nửa mở, cạnh max không thuộc vùng; nếu dùng biên kín, tiếp xúc có thể tạo cặp va chạm. Không trộn hai quy ước giữa phát hiện và phản ứng vì nhân vật có thể rung hoặc xuyên nền. Kiểm tra min không lớn hơn max và tọa độ hữu hạn trước khi dùng dữ liệu level."
        },
        {
          "title": "Broad phase giảm số cặp cần kiểm tra",
          "text": "So mọi cặp có chi phí tăng gần bình phương số vật thể. Broad phase dùng lưới, cây hoặc vùng quét để loại các cặp chắc chắn xa nhau; narrow phase kiểm tra hình học chính xác hơn trên cặp còn lại. Broad phase không được bỏ sót va chạm thật. Với lưới, vật thể lớn có thể nằm trong nhiều ô, nên cùng cặp xuất hiện nhiều lần. Chuẩn hóa thứ tự ID và khử trùng lặp cặp trước khi áp dụng damage hoặc tính điểm."
        },
        {
          "title": "Timestep nhỏ không loại bỏ mọi hiện tượng xuyên",
          "text": "Một vật thể nhanh có thể đi từ trước bức tường sang sau bức tường trong một tick mà không giao nhau ở hai đầu. Giảm tick duration giúp nhưng không bảo đảm. Có thể dùng swept test hoặc continuous collision detection tùy loại hình học và yêu cầu. Với game lưới đơn giản, giới hạn vận tốc một ô mỗi tick là một hợp đồng dễ chứng minh. Đừng thay đổi vận tốc tối đa mà bỏ qua các giả định của bài kiểm tra va chạm."
        },
        {
          "title": "Phản ứng phải có thứ tự và giới hạn",
          "text": "Phát hiện va chạm không tự xác định nên đẩy vật nào đi đâu. Với nhiều tiếp xúc, thứ tự giải có thể ảnh hưởng kết quả. Chọn chính sách ổn định theo ID hoặc dùng solver phù hợp, giới hạn số vòng lặp và đo sai số còn lại. Không dùng loop cho tới khi hết chồng lấn mà không có giới hạn vì cảnh khó có thể treo frame. Gameplay trigger như nhặt item có thể chỉ cần ghi sự kiện; nó không nhất thiết cần phản ứng vật lý."
        },
        {
          "title": "Test các biên dễ bị bỏ qua",
          "text": "Bài thực hành kiểm tra AABB hai chiều theo biên nửa mở: hai hộp chỉ chạm cạnh không chồng lấn. Test hộp chứa hộp, hộp xa nhau, kích thước bằng không và khoảng tọa độ sai. Sau đó mở rộng kiểm tra tính đối xứng overlap(a,b) bằng overlap(b,a). Khi dùng physics engine thật, giữ các test gameplay cho trigger, tốc độ tối đa và điều kiện kết thúc; API vật lý chạy không có lỗi không chứng minh luật game đã đúng. Báo cáo cả quy ước và giới hạn hình học."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Va chạm, broad phase và phản ứng",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Viết overlap cho AABB i32 nửa mở; hộp rỗng hoặc min >= max bị từ chối.",
          "Hai hộp chỉ chạm cạnh không overlap; hộp nằm trong hộp thì có.",
          "In overlap rules verified."
        ]
      },
      "starterCode": "fn main() {\n    // Viết overlap cho AABB i32 nửa mở; hộp rỗng hoặc min >= max bị từ chối.\n    // Hai hộp chỉ chạm cạnh không overlap; hộp nằm trong hộp thì có.\n    // In overlap rules verified.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "#[derive(Clone,Copy)]struct Box2{min:[i32;2],max:[i32;2]}\nfn overlap(a:Box2,b:Box2)->Result<bool,&'static str>{\n for k in 0..2{if a.min[k]>=a.max[k]||b.min[k]>=b.max[k]{return Err(\"empty_box\");}}\n Ok((0..2).all(|k|a.min[k]<b.max[k]&&b.min[k]<a.max[k]))\n}\nfn main(){\n let a=Box2{min:[0,0],max:[2,2]};let edge=Box2{min:[2,0],max:[3,2]};let inside=Box2{min:[1,1],max:[2,2]};\n assert_eq!(overlap(a,edge),Ok(false));assert_eq!(overlap(a,inside),Ok(true));\n assert_eq!(overlap(a,inside),overlap(inside,a));\n assert!(overlap(a,Box2{min:[0,0],max:[0,2]}).is_err());\n println!(\"overlap rules verified\");\n}",
      "expectedOutput": "overlap rules verified",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Vật nhanh xuyên tường dù dùng fixed timestep. Kết luận nào đúng?",
        "options": [
          "Fixed timestep không tự bảo đảm continuous collision; cần swept test hoặc giới hạn tốc độ phù hợp.",
          "Fixed timestep luôn ngăn xuyên tường.",
          "Chỉ cần tăng độ phân giải màn hình."
        ],
        "correct": 0,
        "explanation": "Kiểm tra giao nhau tại hai đầu tick có thể bỏ qua đường đi ở giữa."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://bevy.org/examples/movement/physics-in-fixed-timestep/"
      }
    },
    {
      "id": "game-replay",
      "moduleId": "track-game",
      "title": "Replay, randomness và tính xác định",
      "description": "Ghi input theo tick và xác định điều kiện để phát lại có cùng kết quả.",
      "duration": 60,
      "objectives": [
        "Viết bộ sinh LCG u32 dùng wrapping_mul/add; cùng seed và số bước phải cho cùng chuỗi.",
        "Tách RNG hiển thị khỏi RNG gameplay; kiểm tra một bước seed 1 bằng 1015568748.",
        "In rng repeatable."
      ],
      "sections": [
        {
          "title": "Replay cần một hợp đồng phiên bản",
          "text": "Một chuỗi phím không đủ nếu luật, level hoặc timestep đã đổi. Header replay cần phiên bản luật, level ID hoặc digest, seed và số tick. Input phải gắn với tick, không gắn riêng với frame hiển thị. Nếu một frame chạy ba tick, bạn cần biết command nhảy dùng ở tick nào và trục di chuyển được giữ ra sao. Khi tải replay không tương thích, báo rõ lý do thay vì chạy rồi cho kết quả gần giống nhưng sai ở cuối."
        },
        {
          "title": "Nguồn ngẫu nhiên phải được điều khiển",
          "text": "Dùng bộ sinh có seed và thuật toán xác định cho gameplay; lưu seed hoặc trạng thái nếu cần resume. Thứ tự gọi RNG cũng là một phần của kết quả: thêm một hiệu ứng hình ảnh gọi chung RNG có thể đổi vị trí enemy. Tách luồng random gameplay khỏi random trình bày hoặc cấp nguồn theo hệ thống rõ ràng. Bài học dùng bộ sinh nhỏ để minh họa, không dùng cho mật mã. Trong sản phẩm, ghi cả tên và phiên bản thuật toán cùng replay."
        },
        {
          "title": "Thứ tự lặp có thể phá tính xác định",
          "text": "HashMap không cam kết thứ tự lặp ổn định giữa các lần chạy. Query ECS có thể thay đổi thứ tự khi entity hoặc archetype đổi. Nếu luật cộng số thực, chọn mục tiêu đầu tiên hoặc tiêu thụ RNG theo thứ tự lặp, kết quả có thể lệch. Sắp xếp theo GameId trước thao tác nhạy thứ tự hoặc thiết kế phép toán giao hoán khi có thể. Fixed timestep chỉ giải quyết thời gian bước; nó không tự làm số thực, lịch song song và random giống nhau trên mọi nền tảng."
        },
        {
          "title": "Snapshot giúp khoanh vùng sai lệch",
          "text": "Tính digest chuẩn hóa từ state quan trọng theo thứ tự ID đã xác định. Khi replay khác, tìm tick đầu tiên có snapshot lệch rồi so input và trạng thái trước tick đó. Đừng hash toàn vùng nhớ struct vì padding và layout không phải định dạng lưu trữ ổn định. Serialize từng trường theo phiên bản và endianness rõ ràng. Snapshot dùng để phát hiện sai lệch, không phải bằng chứng bảo mật nếu hash không có tính mật mã hoặc nguồn tham chiếu không đáng tin."
        },
        {
          "title": "Test lịch frame khác nhau",
          "text": "Chạy cùng input tick với frame đều và frame không đều; nếu không có drop tick theo chính sách, state cuối phải giống nhau. Kiểm tra lỗi input giữ nguyên state và replay quá dài bị chặn trước cấp phát lớn. Bài thực hành dùng RNG seed cố định để tạo chuỗi nhỏ, xác nhận cùng seed cho cùng chuỗi và seed khác tạo fixture đã kiểm tra. Khi ghép capstone, giữ log command và snapshot cuối để một lỗi người chơi báo có thể tái hiện mà không cần video đoán lại từng phím."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Replay, randomness và tính xác định",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Viết bộ sinh LCG u32 dùng wrapping_mul/add; cùng seed và số bước phải cho cùng chuỗi.",
          "Tách RNG hiển thị khỏi RNG gameplay; kiểm tra một bước seed 1 bằng 1015568748.",
          "In rng repeatable."
        ]
      },
      "starterCode": "fn main() {\n    // Viết bộ sinh LCG u32 dùng wrapping_mul/add; cùng seed và số bước phải cho cùng chuỗi.\n    // Tách RNG hiển thị khỏi RNG gameplay; kiểm tra một bước seed 1 bằng 1015568748.\n    // In rng repeatable.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn next(state:&mut u32)->u32{*state=state.wrapping_mul(1664525).wrapping_add(1013904223);*state}\nfn sequence(seed:u32,n:usize)->Vec<u32>{let mut s=seed;(0..n).map(|_|next(&mut s)).collect()}\nfn main(){\n assert_eq!(sequence(1,1),vec![1015568748]);\n assert_eq!(sequence(42,5),sequence(42,5));assert_ne!(sequence(42,5),sequence(43,5));\n let before=sequence(9,3);let _visual=sequence(99,20);assert_eq!(before,sequence(9,3));\n println!(\"rng repeatable\");\n}",
      "expectedOutput": "rng repeatable",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Thêm hiệu ứng bụi làm enemy spawn khác dù cùng seed. Nguyên nhân có thể là gì?",
        "options": [
          "Seed không có tác dụng với Rust.",
          "Hiệu ứng và gameplay tiêu thụ chung luồng RNG.",
          "Độ sáng màn hình thay đổi gameplay."
        ],
        "correct": 1,
        "explanation": "Thêm lần gọi RNG thay đổi chuỗi số tiếp theo; tách nguồn hoặc quản lý thứ tự gọi theo hợp đồng."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://docs.rs/bevy_ecs/latest/bevy_ecs/schedule/index.html"
      }
    },
    {
      "id": "game-render-pipeline",
      "moduleId": "track-game",
      "title": "Camera, nội suy và pipeline hiển thị",
      "description": "Biến snapshot mô phỏng thành hình ảnh mượt mà mà không sửa luật game.",
      "duration": 60,
      "objectives": [
        "Với viewport 800x600, world 20x15, chuyển tâm [400,300] thành [0,0].",
        "Góc trên trái thành [-10,7.5]; y màn hình hướng xuống.",
        "Từ chối viewport 0 hoặc NaN; in camera center=0,0."
      ],
      "sections": [
        {
          "title": "Ba không gian cần phân biệt",
          "text": "Vị trí gameplay có thể dùng đơn vị mét hoặc ô; world space của renderer dùng hệ tọa độ đã chọn; screen space dùng pixel hoặc tọa độ logic cửa sổ. Camera ánh xạ world sang vùng nhìn, còn viewport xác định phần màn hình được vẽ. Một click chuột phải chuyển ngược qua camera trước khi so với vị trí vật thể. Nhân tọa độ chuột với một hằng số tùy ý thường hỏng khi resize hoặc thay tỷ lệ DPI. Ghi rõ gốc tọa độ và chiều tăng của trục y."
        },
        {
          "title": "Nội suy chỉ tác động lớp trình bày",
          "text": "Lưu vị trí vật lý trước và sau tick. Với alpha là phần accumulator còn lại chia step, vị trí render bằng previous nhân một trừ alpha cộng current nhân alpha. Alpha nằm trong khoảng từ không đến một theo clock đã thiết kế. Không ghi kết quả nội suy trở lại Position vật lý vì nó làm replay phụ thuộc frame rate. Khi teleport hoặc tải scene, đặt previous bằng current để tránh nhân vật bay từ vị trí cũ qua cả màn hình."
        },
        {
          "title": "Asset tải bất đồng bộ có trạng thái",
          "text": "Handle không đảm bảo dữ liệu đã sẵn sàng. Scene có thể ở Loading, Ready hoặc Failed; chỉ bắt đầu gameplay khi các asset bắt buộc đã tải và kiểm tra được. Texture lỗi cần placeholder hoặc màn lỗi có đường quay lại, không panic vô điều kiện. Phân biệt asset bắt buộc cho luật với asset trang trí có thể tải sau. Với capstone, dùng sprite màu tạo tại runtime để giảm phụ thuộc tệp; bước thêm texture vẫn phải có state loading và test đường dẫn sai."
        },
        {
          "title": "Draw call và chất lượng hình ảnh là tradeoff",
          "text": "Nhiều sprite không nhất thiết có cùng chi phí nếu material, texture hoặc thứ tự trong suốt làm tách batch. Atlas gom hình có thể giảm đổi tài nguyên nhưng cần quản lý UV, padding và animation frame đúng. Không bật mọi hiệu ứng trước khi đo GPU và CPU riêng. Một frame chậm có thể do upload asset, shader compile hoặc system gameplay, nên chỉ nhìn FPS trung bình không đủ. Giữ một scene chuẩn để so chi phí sau mỗi thay đổi về render."
        },
        {
          "title": "Kiểm tra toán học trước kiểm tra bằng mắt",
          "text": "Bài thực hành chuyển tọa độ từ viewport sang world với camera trực giao đơn giản và kiểm tra tâm cửa sổ ánh xạ về tâm world. Từ chối kích thước viewport bằng không và giá trị không hữu hạn. Sau đó kiểm tra native bằng nhiều kích thước cửa sổ, DPI và focus. Test CPU xác nhận công thức, không chứng minh shader, driver hoặc đường input thực hoạt động. Bài capstone cung cấp lớp cửa sổ Bevy để thực hiện các kiểm tra đó trong chính dự án thay vì chỉ xem hình minh họa."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Camera, nội suy và pipeline hiển thị",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Với viewport 800x600, world 20x15, chuyển tâm [400,300] thành [0,0].",
          "Góc trên trái thành [-10,7.5]; y màn hình hướng xuống.",
          "Từ chối viewport 0 hoặc NaN; in camera center=0,0."
        ]
      },
      "starterCode": "fn main() {\n    // Với viewport 800x600, world 20x15, chuyển tâm [400,300] thành [0,0].\n    // Góc trên trái thành [-10,7.5]; y màn hình hướng xuống.\n    // Từ chối viewport 0 hoặc NaN; in camera center=0,0.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn screen_to_world(p:[f64;2],size:[f64;2],world:[f64;2])->Option<[f64;2]>{\n if p.iter().chain(size.iter()).chain(world.iter()).any(|x|!x.is_finite())||size.iter().chain(world.iter()).any(|x|*x<=0.0){return None;}\n Some([(p[0]/size[0]-0.5)*world[0],(0.5-p[1]/size[1])*world[1]])\n}\nfn main(){\n assert_eq!(screen_to_world([400.0,300.0],[800.0,600.0],[20.0,15.0]),Some([0.0,0.0]));\n assert_eq!(screen_to_world([0.0,0.0],[800.0,600.0],[20.0,15.0]),Some([-10.0,7.5]));\n assert!(screen_to_world([0.0,0.0],[0.0,600.0],[20.0,15.0]).is_none());\n println!(\"camera center=0,0\");\n}",
      "expectedOutput": "camera center=0,0",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Có nên ghi vị trí render nội suy trở lại state vật lý không?",
        "options": [
          "Không; giữ state vật lý theo tick và chỉ nội suy Transform hiển thị.",
          "Có để physics mượt hơn ở mọi máy.",
          "Có nếu FPS lớn hơn 60."
        ],
        "correct": 0,
        "explanation": "Ghi ngược làm state phụ thuộc alpha của frame, phá điều kiện replay theo tick."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://bevy.org/examples/movement/physics-in-fixed-timestep/"
      }
    },
    {
      "id": "game-scene-project",
      "moduleId": "track-game",
      "title": "Dự án: level có schema và tải nguyên tử",
      "description": "Tạo định dạng màn chơi, kiểm tra dữ liệu và dựng snapshot trước khi thay scene.",
      "duration": 60,
      "objectives": [
        "Kiểm tra level nhỏ: width/height 1..=32, spawn và item trong biên, không trùng tường.",
        "Từ chối spawn bị chặn và item ID trùng.",
        "In level contract valid."
      ],
      "sections": [
        {
          "title": "Level là dữ liệu cần được kiểm tra",
          "text": "Màn chơi chứa kích thước lưới, điểm xuất phát, các chướng ngại và vật phẩm có ID. Designer cần thông báo lỗi chỉ rõ trường hoặc ID sai, không một panic khó hiểu. Dự án dùng JSON với schema version để người học chỉnh sửa trực tiếp. Parser giới hạn kích thước tệp, số đối tượng và tọa độ. Không mặc định JSON hợp lệ đồng nghĩa level chơi được: spawn có thể nằm trong tường hoặc vật phẩm có thể không có đường tới."
        },
        {
          "title": "Tách parse, validate và build",
          "text": "Parse chỉ đọc cấu trúc; validate kiểm tra version, miền giá trị, ID trùng và quan hệ; build tạo bản đồ dùng cho runtime. Chỉ sau khi toàn bộ candidate hợp lệ mới thay active scene. Nếu load lại lỗi, màn đang chơi vẫn hoạt động. Dùng typed struct và deny_unknown_fields khi hợp đồng muốn bắt lỗi gõ nhầm thay vì bỏ qua. Khi thêm trường mới, xác định default và migration rõ, không âm thầm coi trường thiếu là số không trong mọi trường hợp."
        },
        {
          "title": "Kiểm tra tính chơi được bằng tìm đường",
          "text": "Với lưới bốn hướng, BFS từ spawn cho biết những ô có thể tới mà không đi xuyên tường. Mọi vật phẩm bắt buộc phải thuộc tập reachable. Giới hạn kích thước lưới giúp bộ nhớ hàng đợi có chặn trên rõ ràng. Thứ tự láng giềng cố định giúp đường tham chiếu ổn định khi cần. Một level vẫn có thể khó hoặc nhàm chán dù reachable; bài kiểm tra này chỉ chứng minh điều kiện cấu trúc, không thay thế playtest về trải nghiệm."
        },
        {
          "title": "Dữ liệu trình bày không làm đổi luật",
          "text": "Một tile có màu hay texture khác không được thay đổi khả năng đi qua trừ khi schema luật quy định như vậy. Tách loại terrain với asset path. Với asset path, từ chối đường dẫn tuyệt đối và các thành phần vượt thư mục nếu cho phép nội dung do người dùng cung cấp. Mã mẫu tập trung level hình học và sprite màu nên không đọc asset tùy ý. Người học thêm atlas ở mốc sau, kèm loading state và fallback để lỗi hình không làm mất save."
        },
        {
          "title": "Bàn giao editor tối thiểu và fixture lỗi",
          "text": "Dự án gồm JSON mẫu, loader và tests. Người học bổ sung một công cụ kiểm tra level từ dòng lệnh, báo danh sách lỗi hữu ích và xuất bản đã chuẩn hóa. Thêm ít nhất ba màn: hướng dẫn, thử thách và tình huống biên; thử load lỗi khi đang có active scene. Nộp cả fixture không thể tới, ID trùng, version lạ và tệp quá lớn. Capstone dùng chính loader này hoặc hợp đồng tương đương để tránh hardcode mọi nội dung game trong system."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Dự án: level có schema và tải nguyên tử",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Kiểm tra level nhỏ: width/height 1..=32, spawn và item trong biên, không trùng tường.",
          "Từ chối spawn bị chặn và item ID trùng.",
          "In level contract valid."
        ]
      },
      "starterCode": "fn main() {\n    // Kiểm tra level nhỏ: width/height 1..=32, spawn và item trong biên, không trùng tường.\n    // Từ chối spawn bị chặn và item ID trùng.\n    // In level contract valid.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "use std::collections::HashSet;\nfn valid(w:i32,h:i32,spawn:(i32,i32),walls:&[(i32,i32)],items:&[(u64,(i32,i32))])->bool{\n if !(1..=32).contains(&w)||!(1..=32).contains(&h){return false;}\n let inside=|(x,y):(i32,i32)|x>=0&&y>=0&&x<w&&y<h;\n let blocked:HashSet<_>=walls.iter().copied().collect();\n if !inside(spawn)||blocked.contains(&spawn)||walls.iter().any(|p|!inside(*p)){return false;}\n let mut ids=HashSet::new();\n items.iter().all(|(id,p)|*id!=0&&ids.insert(*id)&&inside(*p)&&!blocked.contains(p))\n}\nfn main(){\n assert!(valid(3,3,(0,0),&[(1,1)],&[(1,(2,2))]));\n assert!(!valid(3,3,(1,1),&[(1,1)],&[]));\n assert!(!valid(3,3,(0,0),&[],&[(1,(1,0)),(1,(2,0))]));\n println!(\"level contract valid\");\n}",
      "expectedOutput": "level contract valid",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "JSON parse thành công nhưng vật phẩm nằm sau vùng tường kín. Còn thiếu gì?",
        "options": [
          "Chỉ format lại JSON.",
          "Tăng kích thước texture.",
          "Validate khả năng đi tới và luật level."
        ],
        "correct": 2,
        "explanation": "Parser chỉ chứng minh cấu trúc; gameplay cần điều kiện reachable và quan hệ hợp lệ."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://serde.rs/attributes.html"
      },
      "localLab": {
        "title": "Loader level và kiểm tra reachable",
        "instructions": "Tạo scene-loader. Dữ liệu JSON không chứa asset path hoặc mã thực thi; loader kiểm tra schema, giới hạn và đường đi trước khi thay LevelStore. Mở rộng CLI và thông báo lỗi theo yêu cầu dự án.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"scene-loader\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use serde::{Deserialize,Serialize};\nuse std::collections::{HashSet,VecDeque};\npub const MAX_BYTES:usize=65_536;\n#[derive(Clone,Debug,PartialEq,Eq,Serialize,Deserialize)]\n#[serde(deny_unknown_fields)]\npub struct Item{pub id:u64,pub at:[u8;2]}\n#[derive(Clone,Debug,PartialEq,Eq,Serialize,Deserialize)]\n#[serde(deny_unknown_fields)]\npub struct Level{pub version:u32,pub width:u8,pub height:u8,pub spawn:[u8;2],pub walls:Vec<[u8;2]>,pub items:Vec<Item>}\nimpl Level{\n pub fn validate(&self)->Result<(),String>{\n  if self.version!=1||!(1..=32).contains(&self.width)||!(1..=32).contains(&self.height){return Err(\"schema_or_size\".into());}\n  if self.walls.len()>1024||self.items.len()>128{return Err(\"object_limit\".into());}\n  let inside=|p:[u8;2]|p[0]<self.width&&p[1]<self.height;\n  let mut walls=HashSet::new();\n  for &p in &self.walls{if !inside(p)||!walls.insert(p){return Err(\"wall\".into());}}\n  if !inside(self.spawn)||walls.contains(&self.spawn){return Err(\"spawn\".into());}\n  let mut ids=HashSet::new();let mut positions=HashSet::new();\n  for item in &self.items{\n   if item.id==0||!ids.insert(item.id)||!inside(item.at)||walls.contains(&item.at)||!positions.insert(item.at){return Err(\"item\".into());}\n  }\n  let mut seen=HashSet::from([self.spawn]);let mut queue=VecDeque::from([self.spawn]);\n  while let Some([x,y])=queue.pop_front(){\n   for [nx,ny] in [[i16::from(x)+1,i16::from(y)],[i16::from(x)-1,i16::from(y)],[i16::from(x),i16::from(y)+1],[i16::from(x),i16::from(y)-1]]{\n    if nx<0||ny<0||nx>=i16::from(self.width)||ny>=i16::from(self.height){continue;}\n    let p=[nx as u8,ny as u8];\n    if !walls.contains(&p)&&seen.insert(p){queue.push_back(p);}\n   }\n  }\n  if self.items.iter().any(|item|!seen.contains(&item.at)){return Err(\"unreachable_item\".into());}\n  Ok(())\n }\n}\npub fn parse(bytes:&[u8])->Result<Level,String>{\n if bytes.len()>MAX_BYTES{return Err(\"byte_limit\".into());}\n let level:Level=serde_json::from_slice(bytes).map_err(|e|format!(\"json: {e}\"))?;\n level.validate()?;Ok(level)\n}\n#[derive(Default)]pub struct LevelStore{pub current:Option<Level>,pub revision:u64}\nimpl LevelStore{\n pub fn reload(&mut self,bytes:&[u8])->Result<(),String>{\n  let candidate=parse(bytes)?;\n  let revision=self.revision.checked_add(1).ok_or(\"revision_overflow\")?;\n  self.current=Some(candidate);self.revision=revision;Ok(())\n }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use scene_loader::LevelStore;\nfn main()->Result<(),String>{let mut store=LevelStore::default();store.reload(include_bytes!(\"../fixtures/level.json\"))?;let l=store.current.as_ref().unwrap();println!(\"level={}x{} items={} revision={}\",l.width,l.height,l.items.len(),store.revision);Ok(())}\n"
          },
          {
            "path": "fixtures/level.json",
            "content": "{\"version\":1,\"width\":4,\"height\":3,\"spawn\":[0,0],\"walls\":[[1,1]],\"items\":[{\"id\":1,\"at\":[3,2]},{\"id\":2,\"at\":[2,0]}]}\n"
          },
          {
            "path": "tests/levels.rs",
            "content": "use scene_loader::{parse,LevelStore,MAX_BYTES};\nconst GOOD:&[u8]=include_bytes!(\"../fixtures/level.json\");\n#[test]fn valid_roundtrip(){let l=parse(GOOD).unwrap();let json=serde_json::to_vec(&l).unwrap();assert_eq!(parse(&json).unwrap(),l);}\n#[test]fn duplicate_ids_and_positions(){let mut l=parse(GOOD).unwrap();l.items[1].id=l.items[0].id;assert!(l.validate().is_err());let mut l=parse(GOOD).unwrap();l.items[1].at=l.items[0].at;assert!(l.validate().is_err());}\n#[test]fn unreachable_item(){let mut l=parse(GOOD).unwrap();l.walls=vec![[1,0],[1,1],[1,2]];assert!(l.validate().is_err());}\n#[test]fn schema_and_bounds(){let mut l=parse(GOOD).unwrap();l.version=2;assert!(l.validate().is_err());l.version=1;l.spawn=[99,0];assert!(l.validate().is_err());assert!(parse(br#\"{\"version\":1,\"unknown\":true}\"#).is_err());}\n#[test]fn failed_reload_preserves_active(){let mut store=LevelStore::default();store.reload(GOOD).unwrap();let before=store.current.clone();assert!(store.reload(b\"{\").is_err());assert_eq!(store.current,before);assert_eq!(store.revision,1);}\n#[test]fn byte_and_revision_limit(){assert!(parse(&vec![0;MAX_BYTES+1]).is_err());let mut store=LevelStore{current:None,revision:u64::MAX};assert!(store.reload(GOOD).is_err());assert!(store.current.is_none());}\n"
          },
          {
            "path": "README.md",
            "content": "# Scene loader\n\nChạy cargo test và cargo run. Schema 1: grid 1..32 mỗi chiều, tối đa 1024 tường, 128 item, 64 KiB JSON. Spawn và item phải ở ô trống; item ID và vị trí không trùng; tất cả item reachable qua bốn hướng. Parse/validate/build hoàn tất trước khi thay active và tăng revision. Thêm CLI đọc file bằng bounded read, ba level, báo lỗi có đường dẫn trường và công cụ xuất JSON chuẩn hóa. Chưa bao gồm renderer, asset tải bất đồng bộ hoặc playtest độ khó.\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run"
        ],
        "checks": [
          "Sáu test kiểm tra roundtrip, trùng ID, reachable, schema, reload và giới hạn.",
          "Tệp mẫu có 2 item reachable, revision 1.",
          "CLI mở rộng phải chặn byte trước khi đọc toàn bộ tệp."
        ]
      },
      "simulation": {
        "title": "Tải level theo candidate",
        "description": "Parser và BFS chạy trước khi thay active scene. Lỗi giữ nguyên revision đang chơi.",
        "kind": "pipeline",
        "nodes": [
          {
            "id": "parse",
            "label": "Parse",
            "detail": "Schema và byte budget"
          },
          {
            "id": "validate",
            "label": "Validate",
            "detail": "ID và tọa độ"
          },
          {
            "id": "path",
            "label": "BFS",
            "detail": "Item reachable"
          },
          {
            "id": "active",
            "label": "Active",
            "detail": "Commit snapshot"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Level hợp lệ",
            "steps": [
              {
                "title": "Đọc JSON",
                "description": "Candidate schema 1 trong giới hạn.",
                "activeNodeIds": [
                  "parse"
                ],
                "values": [
                  {
                    "label": "version",
                    "value": "1"
                  },
                  {
                    "label": "bytes",
                    "value": "200"
                  }
                ]
              },
              {
                "title": "Kiểm tra",
                "description": "ID và vị trí hợp lệ.",
                "activeNodeIds": [
                  "validate"
                ],
                "values": [
                  {
                    "label": "items",
                    "value": "2"
                  },
                  {
                    "label": "duplicates",
                    "value": "0"
                  }
                ]
              },
              {
                "title": "Tìm vùng tới được",
                "description": "BFS tới cả hai item.",
                "activeNodeIds": [
                  "path"
                ],
                "values": [
                  {
                    "label": "reachable",
                    "value": "2"
                  },
                  {
                    "label": "required",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "Đổi active",
                "description": "Commit level và tăng revision.",
                "activeNodeIds": [
                  "active"
                ],
                "values": [
                  {
                    "label": "revision",
                    "value": "4 → 5"
                  },
                  {
                    "label": "status",
                    "value": "ready"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "Item bị cô lập",
            "steps": [
              {
                "title": "Đọc JSON",
                "description": "Cấu trúc JSON vẫn hợp lệ.",
                "activeNodeIds": [
                  "parse"
                ],
                "values": [
                  {
                    "label": "version",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Kiểm tra cấu trúc",
                "description": "Tọa độ trong biên nhưng chưa chứng minh đường đi.",
                "activeNodeIds": [
                  "validate"
                ],
                "values": [
                  {
                    "label": "items",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "BFS thất bại",
                "description": "Một item sau tường kín.",
                "activeNodeIds": [
                  "path"
                ],
                "values": [
                  {
                    "label": "reachable",
                    "value": "1"
                  },
                  {
                    "label": "required",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "Giữ scene cũ",
                "description": "Không commit candidate lỗi.",
                "activeNodeIds": [
                  "active"
                ],
                "values": [
                  {
                    "label": "revision",
                    "value": "4"
                  },
                  {
                    "label": "status",
                    "value": "unchanged"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "game-navigation",
      "moduleId": "track-game",
      "title": "Tìm đường và hành vi tác nhân",
      "description": "Xây hành vi có trạng thái và giới hạn công việc mỗi tick.",
      "duration": 60,
      "objectives": [
        "Viết BFS bốn hướng trong lưới 3x3, từ (0,0) tới (2,2); tường (1,1).",
        "Khoảng cách bằng 4; nếu start bị chặn trả None.",
        "In shortest=4."
      ],
      "sections": [
        {
          "title": "Tìm đường giải một câu hỏi cụ thể",
          "text": "BFS tìm đường ít cạnh nhất trên đồ thị có chi phí mỗi cạnh như nhau. Với lưới bốn hướng, mỗi bước một ô, BFS là baseline dễ kiểm tra. Khi terrain có chi phí khác nhau, cần thuật toán phù hợp như Dijkstra hoặc A* với heuristic đúng điều kiện. Không dùng Manhattan distance như một kết luận cho mọi bản đồ: đường chéo, teleport và chi phí đặc biệt có thể làm giả định sai. Trước khi chọn thuật toán, ghi graph, hướng di chuyển và cách tính chi phí."
        },
        {
          "title": "Hàng đợi và visited phải có giới hạn",
          "text": "Đánh dấu visited khi đưa một ô vào queue để tránh cùng ô bị xếp nhiều lần. Với lưới hữu hạn, số ô cho chặn trên bộ nhớ và công việc. Kiểm tra kích thước bằng phép nhân có kiểm tra trước khi cấp phát. Nếu bản đồ lớn, chia tìm đường thành nhiều tick hoặc dùng ngân sách node; trả trạng thái chưa hoàn thành khác với không có đường. Một vòng tìm đường chạy tới xong trong Update có thể gây giật dù trung bình frame vẫn nhanh."
        },
        {
          "title": "Path không thay thế state machine của enemy",
          "text": "Enemy có thể Idle, Patrol, Chase, Attack và Return. Mỗi trạng thái xác định lúc nào tìm đường lại, mục tiêu nào hợp lệ và điều kiện chuyển. Nếu mỗi tick đều BFS dù target không đổi, CPU bị lãng phí. Cache đường theo version bản đồ và mục tiêu, nhưng invalid khi cửa đóng hoặc tường thay đổi. Khi target despawn, xử lý rõ thay vì unwrap. Hành vi nên dùng tick hoặc clock gameplay để pause và replay đúng."
        },
        {
          "title": "Tránh đồng bộ tất cả tác nhân cùng một tick",
          "text": "Hàng trăm enemy cùng quyết định tìm đường tại một mốc có thể gây spike. Phân bổ ngân sách hoặc chia lịch theo ID giúp trải công việc, nhưng cần bảo đảm tác nhân không bị bỏ đói mãi. Ghi thời gian chờ tìm đường và tuổi của path, không chỉ tổng số query. Một đường hơi cũ có thể chấp nhận được với game chậm; game cạnh tranh có yêu cầu khác. Sự đánh đổi phải xuất hiện trong thiết kế và bài test tình huống."
        },
        {
          "title": "Dùng bản đồ nhỏ để chứng minh đúng",
          "text": "Bài thực hành BFS trên lưới ba nhân ba với một tường giữa. Tính khoảng cách ngắn nhất từ góc đầu tới góc đối diện bằng bốn; test spawn bị chặn và đích bị bao kín. Giữ thứ tự láng giềng cố định để kết quả đường cụ thể tái lập. Trong dự án level, dùng reachable để kiểm tra vật phẩm; trong capstone, thêm enemy truy đuổi và ngân sách tìm đường. Việc BFS đúng không tự chứng minh enemy vui để chơi, nên cần playtest và quan sát hành vi thực."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Tìm đường và hành vi tác nhân",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Viết BFS bốn hướng trong lưới 3x3, từ (0,0) tới (2,2); tường (1,1).",
          "Khoảng cách bằng 4; nếu start bị chặn trả None.",
          "In shortest=4."
        ]
      },
      "starterCode": "fn main() {\n    // Viết BFS bốn hướng trong lưới 3x3, từ (0,0) tới (2,2); tường (1,1).\n    // Khoảng cách bằng 4; nếu start bị chặn trả None.\n    // In shortest=4.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "use std::collections::{HashSet,VecDeque};\nfn shortest(w:i32,h:i32,start:(i32,i32),goal:(i32,i32),walls:&HashSet<(i32,i32)>)->Option<u32>{\n if w<=0||h<=0||w>32||h>32{return None;}\n let inside=|(x,y):(i32,i32)|x>=0&&y>=0&&x<w&&y<h;\n if !inside(start)||!inside(goal)||walls.contains(&start)||walls.contains(&goal){return None;}\n let mut seen=HashSet::from([start]);let mut q=VecDeque::from([(start,0)]);\n while let Some(((x,y),d))=q.pop_front(){\n  if (x,y)==goal{return Some(d);}\n  for p in [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]{\n   if inside(p)&&!walls.contains(&p)&&seen.insert(p){q.push_back((p,d+1));}\n  }\n }None\n}\nfn main(){\n let walls=HashSet::from([(1,1)]);assert_eq!(shortest(3,3,(0,0),(2,2),&walls),Some(4));\n assert_eq!(shortest(3,3,(1,1),(2,2),&walls),None);\n println!(\"shortest=4\");\n}",
      "expectedOutput": "shortest=4",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Một enemy chưa tìm xong đường vì hết ngân sách tick. Có nên báo không có đường?",
        "options": [
          "Có vì kết quả đều chưa có đường.",
          "Không; phân biệt Pending với NoPath.",
          "Chỉ tăng FPS là đủ."
        ],
        "correct": 1,
        "explanation": "Hết ngân sách là chưa hoàn tất tìm kiếm, khác với đã chứng minh không có đường."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://doc.rust-lang.org/std/collections/struct.VecDeque.html"
      }
    },
    {
      "id": "game-profiling",
      "moduleId": "track-game",
      "title": "Đo frame time và tối ưu ECS",
      "description": "Tìm đúng điểm nghẽn bằng số đo trước khi thay kiến trúc.",
      "duration": 60,
      "objectives": [
        "Với frame [8,10,30,12] ms và budget 16, đếm một frame chậm, max 30, tổng 60.",
        "Rỗng có max None; tổng dùng checked_add.",
        "In slow=1 max=30 total=60."
      ],
      "sections": [
        {
          "title": "FPS trung bình không mô tả độ mượt",
          "text": "Một giây có phần lớn frame nhanh nhưng một frame rất chậm vẫn tạo giật dễ thấy. Báo frame time theo phân vị và số spike, tách warmup khỏi steady state. Ghi workload như số actor, kích thước level, camera và hiệu ứng để so hai bản công bằng. Không đo bản debug rồi suy ra bản release cũng chậm tương tự. Với game, thời gian CPU chuẩn bị frame và GPU hoàn tất frame có thể khác nhau; cần biết công cụ đang đo đoạn nào."
        },
        {
          "title": "Đặt giả thuyết tối ưu có thể bác bỏ",
          "text": "Ví dụ nghi ngờ query quét quá nhiều entity không liên quan: thêm marker lọc và đo lại cùng scene. Nghi ngờ cấp phát mỗi tick: tái sử dụng buffer và kiểm tra peak capacity cùng thời gian. Không sửa cùng lúc năm hệ thống rồi không biết thay đổi nào tạo lợi ích. Một tối ưu đạt khi kết quả gameplay giữ nguyên và số đo cải thiện vượt nhiễu trong điều kiện đã ghi. Nếu code phức tạp hơn mà lợi ích không rõ, giữ phương án dễ hiểu."
        },
        {
          "title": "Song song cần phụ thuộc dữ liệu đúng",
          "text": "ECS có thể chạy các system không xung đột song song, nhưng thứ tự logic vẫn phải khai báo. Hai system cùng ghi resource toàn cục sẽ hạn chế song song dù chúng xử lý các nhóm actor khác nhau. Có thể tách thu thập kết quả cục bộ rồi tổng hợp ở một pha, nhưng phải giữ bất biến và thứ tự nếu luật nhạy cảm. Không bỏ chain chỉ để tăng tốc khi collect cần thấy vị trí sau move. Test đúng phải tồn tại trước khi thử thay lịch."
        },
        {
          "title": "Giới hạn công việc thường đáng giá hơn tối ưu nhỏ",
          "text": "Số projectile, hiệu ứng, job tìm đường và sự kiện xử lý mỗi tick cần ngân sách. Khi đạt giới hạn, có chính sách như tái sử dụng pool, bỏ hiệu ứng trang trí hoặc trả lỗi level. Pooling không tự động nhanh hơn allocator trong mọi tình huống, và reset thiếu trường có thể để lại trạng thái từ đối tượng cũ. Kiểm tra lifecycle sau tái sử dụng. Một hệ thống không có chặn trên có thể giật ở tình huống hiếm dù microbenchmark rất đẹp."
        },
        {
          "title": "Giữ bằng chứng trước và sau",
          "text": "Bài thực hành tính số frame vượt ngân sách và thời gian lớn nhất trên fixture nhỏ, dùng phép cộng có kiểm tra cho tổng. Sau đó benchmark headless core và native scene riêng, ghi công cụ, cấu hình và số lần chạy. Thêm replay regression để bảo đảm tối ưu không đổi score hoặc tick. Nếu thay số thực bằng fixed point, cần thiết kế lại miền và kiểm tra tràn; đây là thay đổi ngữ nghĩa, không chỉ một mẹo tốc độ. Báo giới hạn còn lại như driver và phần cứng chưa đo."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Đo frame time và tối ưu ECS",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Với frame [8,10,30,12] ms và budget 16, đếm một frame chậm, max 30, tổng 60.",
          "Rỗng có max None; tổng dùng checked_add.",
          "In slow=1 max=30 total=60."
        ]
      },
      "starterCode": "fn main() {\n    // Với frame [8,10,30,12] ms và budget 16, đếm một frame chậm, max 30, tổng 60.\n    // Rỗng có max None; tổng dùng checked_add.\n    // In slow=1 max=30 total=60.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn stats(xs:&[u64],budget:u64)->Option<(usize,Option<u64>,u64)>{\n let total=xs.iter().try_fold(0u64,|a,x|a.checked_add(*x))?;\n Some((xs.iter().filter(|x|**x>budget).count(),xs.iter().copied().max(),total))\n}\nfn main(){\n assert_eq!(stats(&[8,10,30,12],16),Some((1,Some(30),60)));\n assert_eq!(stats(&[],16),Some((0,None,0)));\n assert_eq!(stats(&[u64::MAX,1],16),None);\n println!(\"slow=1 max=30 total=60\");\n}",
      "expectedOutput": "slow=1 max=30 total=60",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Bỏ quan hệ move trước collect làm benchmark nhanh hơn nhưng score đổi. Kết luận?",
        "options": [
          "Chấp nhận vì FPS cao hơn.",
          "Tối ưu chưa đạt vì đổi ngữ nghĩa gameplay.",
          "Sửa expected score cho khớp mà không xem luật."
        ],
        "correct": 1,
        "explanation": "Hiệu năng chỉ có ý nghĩa khi hành vi vẫn đáp ứng hợp đồng; benchmark phải đi cùng regression."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://bevy.org/learn/quick-start/getting-started/setup/"
      }
    },
    {
      "id": "game-save-format",
      "moduleId": "track-game",
      "title": "Save game, migration và phục hồi",
      "description": "Lưu trạng thái có phiên bản và bảo vệ bản hợp lệ khi tải hoặc ghi lỗi.",
      "duration": 60,
      "objectives": [
        "Snapshot có version 1, x trong -10..=10, ID nhận thuộc {1,2,3} không lặp, score=10*số ID.",
        "Từ chối score giả hoặc future version.",
        "In save validated."
      ],
      "sections": [
        {
          "title": "Save chứa trạng thái cần tiếp tục chơi",
          "text": "Không cần lưu mọi thứ trong ECS. Lưu version luật, level ID, GameId, trạng thái nhiệm vụ, inventory và những giá trị ảnh hưởng lượt chơi. Texture handle, Entity runtime, cache tìm đường và Transform nội suy có thể dựng lại. Ghi rõ trường nào là nguồn chân lý để tránh hai bản sao score hoặc vị trí mâu thuẫn. Nếu lưu RNG cho tiếp tục replay, cần cả thuật toán và trạng thái, không chỉ seed ban đầu khi đã tiêu thụ nhiều số."
        },
        {
          "title": "Schema version giúp tiến hóa có kiểm soát",
          "text": "Một bản save v1 có thể chỉ có score và x; v2 thêm danh sách vật phẩm đã nhận. Migration phải có quy tắc cụ thể cho trường mới, không tự đoán từ score nếu nhiều cách nhặt tạo cùng điểm. Có thể từ chối phiên bản quá cũ hoặc cung cấp migration có kiểm tra. Giữ fixture của từng phiên bản còn hỗ trợ và test tải bằng mã mới. Unknown future version nên báo không tương thích, không âm thầm bỏ trường rồi ghi đè tệp gốc."
        },
        {
          "title": "Validate trước khi thay world đang chạy",
          "text": "Parser giới hạn byte và số entity. Kiểm tra ID, miền tọa độ, health, trạng thái và quan hệ tham chiếu trước build. Dựng candidate world hoặc snapshot riêng, rồi commit một lần khi mọi bước thành công. Nếu save hỏng, người chơi vẫn có thể quay về menu hoặc tiếp tục phiên hiện tại. Không để một nửa inventory mới ghép với vị trí cũ. Dữ liệu do chính game từng ghi vẫn có thể bị cắt khi mất điện hoặc bị người dùng chỉnh."
        },
        {
          "title": "Ghi tệp cần chiến lược công bố",
          "text": "Một cách trên filesystem phù hợp là ghi tệp tạm cùng thư mục, flush/sync theo yêu cầu, rồi rename thay tệp active; giữ backup nếu chính sách yêu cầu. Rename nguyên tử về khả năng quan sát không tự chứng minh mọi dữ liệu đã bền qua mất điện trên mọi hệ điều hành. Không xóa save cũ trước khi bản mới hoàn tất. Với cloud save, còn có xung đột nhiều thiết bị và revision; bài này không xem việc ghi cục bộ là đã giải quyết đồng bộ phân tán."
        },
        {
          "title": "Test lỗi và khả năng quay lại",
          "text": "Bài thực hành kiểm tra snapshot version, vị trí và danh sách ID nhận vật phẩm trước khi nhận vào session. Test version lạ, ID lặp và score không khớp tổng giá trị đã nhận theo luật fixture. Capstone bổ sung JSON load/save và test roundtrip cùng replay. Người học cần mô phỏng tệp cắt ngắn, tệp quá lớn và lỗi ghi, rồi chứng minh active state không bị thay. Runbook phải chỉ rõ cách khôi phục backup và tránh ghi đè dữ liệu duy nhất khi gặp lỗi."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Save game, migration và phục hồi",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Snapshot có version 1, x trong -10..=10, ID nhận thuộc {1,2,3} không lặp, score=10*số ID.",
          "Từ chối score giả hoặc future version.",
          "In save validated."
        ]
      },
      "starterCode": "fn main() {\n    // Snapshot có version 1, x trong -10..=10, ID nhận thuộc {1,2,3} không lặp, score=10*số ID.\n    // Từ chối score giả hoặc future version.\n    // In save validated.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "use std::collections::HashSet;\nfn valid(version:u32,x:i32,ids:&[u8],score:u32)->bool{\n let mut seen=HashSet::new();\n version==1&&(-10..=10).contains(&x)&&ids.iter().all(|id|(1..=3).contains(id)&&seen.insert(*id))&&score==ids.len() as u32*10\n}\nfn main(){\n assert!(valid(1,2,&[1,2],20));assert!(!valid(1,2,&[1,1],20));\n assert!(!valid(1,2,&[1],99));assert!(!valid(2,2,&[1],10));\n println!(\"save validated\");\n}",
      "expectedOutput": "save validated",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Tải save lỗi ở vật phẩm cuối. Trạng thái phiên đang chạy nên thế nào?",
        "options": [
          "Giữ các vật phẩm đã tải trước lỗi.",
          "Xóa phiên hiện tại ngay khi mở tệp.",
          "Giữ nguyên; validate candidate hoàn chỉnh rồi mới commit."
        ],
        "correct": 2,
        "explanation": "Tách candidate và commit tránh ghép trạng thái nửa cũ nửa mới."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://serde.rs/attributes.html"
      }
    },
    {
      "id": "game-release-project",
      "moduleId": "track-game",
      "title": "Capstone: game 2D có replay và lưu tiến độ",
      "description": "Tích hợp core xác định, Bevy native, bàn phím, camera và quy trình phát hành.",
      "duration": 60,
      "objectives": [
        "Viết replay các trục 1..=1 trên state x, tick và score; item tại 1,2,3 mỗi item 10.",
        "Chuỗi [1,1,1] kết thúc score 30 và không tiến sau Finished.",
        "In finished score=30 tick=3."
      ],
      "sections": [
        {
          "title": "Chốt một lát cắt sản phẩm chơi được",
          "text": "Capstone là game nhặt ba vật phẩm trong arena: di chuyển trái phải, pause, restart, hoàn tất khi nhận đủ, lưu và tải tiến độ. Core dùng tọa độ nguyên theo tick; lớp Bevy hiển thị nhân vật và vật phẩm bằng sprite màu để không phụ thuộc tải asset ngoài. Mã mẫu cung cấp cả chế độ headless và cửa sổ native qua feature riêng. Người học bổ sung level hai chiều, enemy, âm thanh và màn hướng dẫn theo các mốc, thay vì mở rộng ngẫu nhiên trước khi loop cơ bản ổn."
        },
        {
          "title": "Một nguồn luật cho cả test và cửa sổ",
          "text": "Resource Game giữ state, Control giữ input; system tick gọi cùng hàm step đã kiểm tra. Headless App chạy một update tương ứng một tick do test điều khiển. Native App đưa tick vào FixedUpdate, thu input trước vòng fixed và cập nhật Transform trong pha hiển thị. Phím mũi tên là input giữ; Space và R là cạnh vừa nhấn để pause hoặc restart một lần. Không để renderer tự cộng score hoặc xóa vật phẩm theo vị trí nội suy."
        },
        {
          "title": "Kết nối hiển thị bằng snapshot",
          "text": "Một camera 2D quan sát world. Mỗi ô gameplay đổi thành khoảng cách pixel cố định cho fixture; sprite người chơi có màu riêng, vật phẩm được ẩn sau khi nhận. Window title hiển thị score và trạng thái để bản mẫu vẫn chơi được khi chưa có UI text. Resize không thay vị trí gameplay. Để chuyển sang level hai chiều, cần camera mapping theo bài trước và test chuột nếu có. Tích hợp native là mã thật nhưng cần chạy trên máy có window và GPU phù hợp."
        },
        {
          "title": "Replay và save kiểm tra đường bàn giao",
          "text": "Core cung cấp snapshot serde có version và kiểm tra score với danh sách item. Load candidate hợp lệ mới thay state; lỗi giữ nguyên phiên. Replay dùng input tick đã lưu, không dựa vào tốc độ render. Test chuỗi đi tới ba item phải kết thúc với score đúng; pause không tăng tick; restart xóa tiến độ của lượt hiện tại theo yêu cầu rõ. Người học thêm công bố save bằng tệp tạm và fault injection để chứng minh lỗi ghi không mất bản cũ."
        },
        {
          "title": "Nghiệm thu theo hai lớp bằng chứng",
          "text": "Test headless chứng minh luật, giới hạn và serialization. Native playtest kiểm tra cửa sổ, focus, bàn phím, DPI, sprite, pause/restart và thời gian frame. Ghi riêng kết quả hai lớp, không gọi Cargo test là đã kiểm thử GPU. Nộp build release, hướng dẫn điều khiển, replay lỗi có thể tái hiện, báo cáo hiệu năng và danh sách giới hạn còn lại. Phần web build hoặc nền tảng thứ hai cần test riêng về renderer, input và persistence; không suy ra từ một lần chạy macOS."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Capstone: game 2D có replay và lưu tiến độ",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Viết replay các trục 1..=1 trên state x, tick và score; item tại 1,2,3 mỗi item 10.",
          "Chuỗi [1,1,1] kết thúc score 30 và không tiến sau Finished.",
          "In finished score=30 tick=3."
        ]
      },
      "starterCode": "fn main() {\n    // Viết replay các trục 1..=1 trên state x, tick và score; item tại 1,2,3 mỗi item 10.\n    // Chuỗi [1,1,1] kết thúc score 30 và không tiến sau Finished.\n    // In finished score=30 tick=3.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn replay(inputs:&[i8])->Result<(i32,u64,u32),&'static str>{\n let(mut x,mut tick,mut score)=(0i32,0u64,0u32);let mut claimed=[false;3];\n for &axis in inputs{\n  if !(-1..=1).contains(&axis){return Err(\"axis\");}\n  if score==30{continue;}\n  tick=tick.checked_add(1).ok_or(\"tick\")?;x=(x+i32::from(axis)).clamp(-10,10);\n  for(i,done)in claimed.iter_mut().enumerate(){if x==i as i32+1&&!*done{*done=true;score+=10;}}\n }Ok((x,tick,score))\n}\nfn main(){\n assert_eq!(replay(&[1,1,1,1]),Ok((3,3,30)));\n assert!(replay(&[2]).is_err());\n println!(\"finished score=30 tick=3\");\n}",
      "expectedOutput": "finished score=30 tick=3",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Headless tests đều đạt. Có đủ để kết luận bản native hoạt động trên mọi máy không?",
        "options": [
          "Chưa; cần kiểm tra cửa sổ, input, DPI, GPU và nền tảng đích.",
          "Đủ vì Rust không có garbage collector.",
          "Đủ nếu sprite chỉ một màu."
        ],
        "correct": 0,
        "explanation": "Test luật CPU không chạy renderer hoặc đường input hệ điều hành; hai lớp có bằng chứng khác nhau."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://bevy.org/learn/quick-start/getting-started/"
      },
      "localLab": {
        "title": "Rust Arcade: headless và cửa sổ Bevy",
        "instructions": "Tạo rust-arcade. Mặc định chỉ biên dịch core App/ECS và test CPU. Feature native bật Bevy đầy đủ để mở cửa sổ, camera 2D, sprite, bàn phím và FixedUpdate. Chạy native trên máy có môi trường đồ họa; kiểm tra GPU riêng với test core.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"rust-arcade\"\nversion = \"0.1.0\"\nedition = \"2024\"\ndefault-run = \"rust-arcade\"\n\n[features]\ndefault = []\nnative = [\"dep:bevy\"]\n\n[dependencies]\nbevy_app = { version = \"=0.20.1\", default-features = false, features = [\"std\"] }\nbevy_ecs = { version = \"=0.20.1\", default-features = false, features = [\"std\"] }\nbevy = { version = \"=0.20.1\", optional = true }\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\n\n[[bin]]\nname = \"native\"\npath = \"src/bin/native.rs\"\nrequired-features = [\"native\"]\n\n[profile.dev]\ndebug = 0\n[profile.test]\ndebug = 0\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use bevy_app::{App,Update};\nuse bevy_ecs::prelude::*;\nuse serde::{Deserialize,Serialize};\npub const MAX_SAVE_BYTES:usize=4096;\npub const MAX_REPLAY_TICKS:usize=10_000;\n#[derive(Clone,Debug,PartialEq,Eq,Serialize,Deserialize)]\n#[serde(deny_unknown_fields)]\npub struct Snapshot{pub version:u32,pub x:i32,pub tick:u64,pub score:u32,pub claimed:[bool;3],pub paused:bool}\nimpl Default for Snapshot{fn default()->Self{Self{version:1,x:0,tick:0,score:0,claimed:[false;3],paused:false}}}\nimpl Snapshot{\n pub fn validate(&self)->Result<(),String>{\n  if self.version!=1||!(-10..=10).contains(&self.x)||self.score!=self.claimed.iter().filter(|v|**v).count() as u32*10{return Err(\"save_contract\".into());}Ok(())\n }\n pub fn step(&mut self,axis:i8)->Result<(),String>{\n  self.validate()?;\n  if !(-1..=1).contains(&axis){return Err(\"axis\".into());}\n  if self.paused||self.score==30{return Ok(());}\n  let tick=self.tick.checked_add(1).ok_or(\"tick_overflow\")?;\n  let x=(self.x+i32::from(axis)).clamp(-10,10);\n  let mut claimed=self.claimed;\n  for(i,done)in claimed.iter_mut().enumerate(){if x==i as i32+1{*done=true;}}\n  let score=claimed.iter().filter(|v|**v).count() as u32*10;\n  self.x=x;self.tick=tick;self.claimed=claimed;self.score=score;Ok(())\n }\n}\n#[derive(Resource,Default)]pub struct Control{pub axis:i8}\n#[derive(Resource,Default)]pub struct Game{pub state:Snapshot,pub previous_x:i32,pub error:Option<String>,pub recorded:Vec<i8>}\nimpl Game{\n pub fn apply(&mut self,axis:i8)->Result<(),String>{\n  if self.recorded.len()>=MAX_REPLAY_TICKS&&!self.state.paused&&self.state.score!=30{return Err(\"replay_limit\".into());}\n  let mut next=self.state.clone();next.step(axis)?;\n  if next.tick!=self.state.tick{self.previous_x=self.state.x;self.recorded.push(axis);}\n  self.state=next;Ok(())\n }\n pub fn restart(&mut self){*self=Self::default();}\n pub fn save_json(&self)->Result<Vec<u8>,String>{self.state.validate()?;serde_json::to_vec(&self.state).map_err(|e|e.to_string())}\n pub fn load_json(&mut self,bytes:&[u8])->Result<(),String>{\n  if bytes.len()>MAX_SAVE_BYTES{return Err(\"save_size\".into());}\n  let candidate:Snapshot=serde_json::from_slice(bytes).map_err(|e|e.to_string())?;candidate.validate()?;\n  self.previous_x=candidate.x;self.state=candidate;self.error=None;self.recorded.clear();Ok(())\n }\n}\npub fn game_tick(mut game:ResMut<Game>,control:Res<Control>){\n if game.error.is_some(){return;}\n if let Err(error)=game.apply(control.axis){game.error=Some(error);}\n}\npub fn headless()->App{\n let mut app=App::new();app.init_resource::<Game>().init_resource::<Control>().add_systems(Update,game_tick);app\n}\npub fn replay(inputs:&[i8])->Result<Snapshot,String>{\n if inputs.len()>MAX_REPLAY_TICKS{return Err(\"replay_limit\".into());}\n let mut s=Snapshot::default();for &a in inputs{s.step(a)?;}Ok(s)\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use rust_arcade::{headless,Control,Game,replay};\nfn main(){let mut app=headless();for axis in [1,1,1]{app.world_mut().resource_mut::<Control>().axis=axis;app.update();}let game=app.world().resource::<Game>();assert_eq!(game.state,replay(&[1,1,1]).unwrap());println!(\"finished score={} tick={}\",game.state.score,game.state.tick);}\n"
          },
          {
            "path": "src/bin/native.rs",
            "content": "use bevy::prelude::*;\nuse rust_arcade::{Control,Game,game_tick};\n#[derive(Component)]struct PlayerVisual;\n#[derive(Component)]struct ItemVisual(usize);\nfn main(){\n App::new()\n  .add_plugins(DefaultPlugins.set(WindowPlugin{primary_window:Some(Window{title:\"Learn Rust Arcade\".into(),resolution:(800,450).into(),..default()}),..default()}))\n  .init_resource::<Game>().init_resource::<Control>()\n  .insert_resource(Time::<Fixed>::from_seconds(0.25))\n  .add_systems(Startup,setup)\n  .add_systems(RunFixedMainLoop,read_input.in_set(RunFixedMainLoopSystems::BeforeFixedMainLoop))\n  .add_systems(FixedUpdate,game_tick)\n  .add_systems(Update,render)\n  .run();\n}\nfn setup(mut commands:Commands){\n commands.spawn(Camera2d);\n commands.spawn((PlayerVisual,Sprite::from_color(Color::srgb(0.2,0.5,0.9),Vec2::splat(30.0)),Transform::from_xyz(0.0,0.0,1.0)));\n for i in 0..3{\n  commands.spawn((ItemVisual(i),Sprite::from_color(Color::srgb(0.95,0.65,0.15),Vec2::splat(20.0)),Transform::from_xyz((i+1) as f32*32.0,0.0,0.0)));\n }\n commands.spawn((Sprite::from_color(Color::srgb(0.2,0.25,0.3),Vec2::new(680.0,4.0)),Transform::from_xyz(0.0,-24.0,0.0)));\n}\nfn read_input(keys:Res<ButtonInput<KeyCode>>,mut control:ResMut<Control>,mut game:ResMut<Game>){\n if keys.just_pressed(KeyCode::KeyR){game.restart();}\n if keys.just_pressed(KeyCode::Space)&&game.state.score<30{\n  game.state.paused=!game.state.paused;game.previous_x=game.state.x;\n }\n control.axis=i8::from(keys.pressed(KeyCode::ArrowRight))-i8::from(keys.pressed(KeyCode::ArrowLeft));\n}\nfn render(game:Res<Game>,fixed:Res<Time<Fixed>>,mut players:Query<&mut Transform,With<PlayerVisual>>,mut items:Query<(&ItemVisual,&mut Visibility)>,mut windows:Query<&mut Window>){\n let alpha=if game.state.paused||game.state.score==30{1.0}else{fixed.overstep_fraction().clamp(0.0,1.0)};\n let x=game.previous_x as f32*(1.0-alpha)+game.state.x as f32*alpha;\n for mut transform in &mut players{transform.translation.x=x*32.0;}\n for(item,mut visibility)in &mut items{*visibility=if game.state.claimed[item.0]{Visibility::Hidden}else{Visibility::Visible};}\n let phase=if game.error.is_some(){\"Error\"}else if game.state.score==30{\"Finished\"}else if game.state.paused{\"Paused\"}else{\"Playing\"};\n for mut window in &mut windows{window.title=format!(\"Learn Rust | {phase} | Score {} | Arrows: move, Space: pause, R: restart\",game.state.score);}\n}\n"
          },
          {
            "path": "tests/core.rs",
            "content": "use rust_arcade::{Game,Snapshot,headless,Control,replay,MAX_REPLAY_TICKS,MAX_SAVE_BYTES};\n#[test]fn complete_and_stop(){assert_eq!(replay(&[1,1,1,1]).unwrap().tick,3);assert_eq!(replay(&[1,1,1]).unwrap().score,30);}\n#[test]fn pause_and_restart(){let mut game=Game::default();game.apply(1).unwrap();game.state.paused=true;let before=game.state.clone();game.apply(1).unwrap();assert_eq!(game.state,before);game.restart();assert_eq!(game.state,Snapshot::default());assert!(game.recorded.is_empty());}\n#[test]fn invalid_step_atomic(){let mut game=Game::default();let before=game.state.clone();assert!(game.apply(2).is_err());assert_eq!(game.state,before);assert!(game.recorded.is_empty());}\n#[test]fn save_roundtrip_and_failed_load(){let mut game=Game::default();game.apply(1).unwrap();let bytes=game.save_json().unwrap();let mut other=Game::default();other.load_json(&bytes).unwrap();assert_eq!(game.state,other.state);let before=other.state.clone();assert!(other.load_json(b\"{\").is_err());assert_eq!(other.state,before);assert!(other.load_json(&vec![0;MAX_SAVE_BYTES+1]).is_err());}\n#[test]fn schema_score_and_tick_validation(){let mut s=Snapshot::default();s.score=30;assert!(s.validate().is_err());s.score=0;s.version=2;assert!(s.validate().is_err());s.version=1;s.tick=u64::MAX;let before=s.clone();assert!(s.step(1).is_err());assert_eq!(s,before);}\n#[test]fn headless_matches_reference_replay(){let inputs=[-1,1,1,1,1];let mut app=headless();for a in inputs{app.world_mut().resource_mut::<Control>().axis=a;app.update();}assert_eq!(app.world().resource::<Game>().state,replay(&inputs).unwrap());}\n#[test]fn replay_budget(){assert!(replay(&vec![0;MAX_REPLAY_TICKS+1]).is_err());let mut g=Game::default();g.recorded=vec![0;MAX_REPLAY_TICKS];assert!(g.apply(0).is_err());assert_eq!(g.state.tick,0);}\n"
          },
          {
            "path": "README.md",
            "content": "# Rust Arcade\n\n## Chạy core\n\ncargo test\ncargo run\n\nCore có tick do caller cấp, vị trí nguyên [-10,10], ba vật phẩm ở x=1,2,3. Đi hết cho score 30, Finished dừng tick. Snapshot version 1 chứa score được kiểm tra bằng claimed; nó không phải cơ chế chống gian lận. Replay từ trạng thái đầu bị giới hạn 10.000 tick. Sau load, recorded bắt đầu từ checkpoint mới; muốn phát lại đoạn đó phải lưu snapshot bắt đầu cùng log.\n\n## Chạy cửa sổ\n\ncargo run --release --features native --bin native\n\nMũi tên trái/phải di chuyển; Space pause/resume; R bắt đầu lượt mới. Time<Fixed> 0.25 giây, input thu trước vòng fixed, Transform nội suy sau mô phỏng. Sprite màu và Camera2d không cần tệp asset. Trên macOS cần toolchain native/Xcode CLT; Linux cần môi trường window, driver và dependency hệ điều hành cho các tính năng Bevy mặc định. Test CPU không khởi tạo GPU. Build native có thêm nhiều dependency và cần kiểm tra riêng.\n\n## Nhiệm vụ capstone\n\nThêm level 2D đã validate, một enemy có ngân sách tìm đường, màn hướng dẫn, save ra tệp bằng temp+rename và fault injection. Thêm UI hiển thị lỗi; không giữ bước tick trong trạng thái lỗi. Kiểm tra focus, resize, DPI, input cạnh/giữ, pause và restart trên máy đích. Ghi benchmark frame time cùng cấu hình. Web/WASM, thiết bị thứ hai, audio và cloud save chưa có trong baseline.\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run",
          "cargo run --release --features native --bin native"
        ],
        "checks": [
          "Bảy test CPU kiểm tra replay, pause, save, schema và budget.",
          "Headless in finished score=30 tick=3.",
          "Native cần kiểm tra trực tiếp camera/sprite, phím, resize và DPI; không coi core tests là GPU tests."
        ]
      }
    }
  ],
  "projects": [
    {
      "id": "game-project-arena",
      "title": "Arena ECS có luật và replay",
      "description": "Hoàn thiện game loop nhặt vật phẩm, pause, restart và snapshot bằng Bevy ECS.",
      "level": "guided",
      "estimatedHours": 10,
      "labLessonId": "game-arena-project",
      "requirements": [
        "Giữ thứ tự move → collect → finish và nhận item đúng một lần.",
        "Thêm restart reset đúng resource và entity của phiên.",
        "Thêm loại item thứ hai có luật giá trị rõ; validate tổng điểm trước spawn.",
        "Ghi input theo tick cùng GameId, phát lại và so snapshot.",
        "Không phụ thuộc renderer trong test luật."
      ],
      "milestones": [
        {
          "title": "Luật hoạt động",
          "tasks": [
            "Chạy sáu test mẫu.",
            "Viết bảng phase và input hợp lệ."
          ],
          "acceptance": "Move và collect cùng tick; pause/finished không tiến tick."
        },
        {
          "title": "Lifecycle và restart",
          "tasks": [
            "Thêm loại item và reset.",
            "Kiểm tra nhiều lần chơi lại không tăng số entity."
          ],
          "acceptance": "Score và tập claimed trở về mặc định đúng một lần."
        },
        {
          "title": "Replay",
          "tasks": [
            "Thêm header version và log tick.",
            "So snapshot cùng chuỗi input."
          ],
          "acceptance": "Replay tái lập, lỗi input không mutate state."
        }
      ],
      "testCases": [
        {
          "name": "Thứ tự",
          "setup": "Player x=0, item x=1, axis=1.",
          "expected": "Score tăng trong cùng tick."
        },
        {
          "name": "Nhận lặp",
          "setup": "Đi qua item đã nhận lần thứ hai.",
          "expected": "Không cộng thêm."
        },
        {
          "name": "Pause",
          "setup": "Giữ axis khi Paused.",
          "expected": "Vị trí và tick giữ nguyên."
        },
        {
          "name": "Restart",
          "setup": "Hoàn tất rồi restart ba lần.",
          "expected": "Không rò entity hoặc score."
        },
        {
          "name": "Dữ liệu sai",
          "setup": "Axis=2 hoặc tổng giá trị level vượt miền.",
          "expected": "Bị từ chối trước thay trạng thái."
        }
      ],
      "rubric": [
        {
          "id": "game-arena-rules",
          "title": "Luật đúng",
          "critical": true,
          "criteria": [
            "Nhận một lần và đúng thứ tự.",
            "Phase có test đủ chuyển chính."
          ]
        },
        {
          "id": "game-arena-lifecycle",
          "title": "Vòng đời",
          "critical": true,
          "criteria": [
            "Restart dọn đúng nhóm.",
            "Không tích lũy entity/timer qua lượt."
          ]
        },
        {
          "id": "game-arena-replay",
          "title": "Replay",
          "critical": true,
          "criteria": [
            "ID và version rõ.",
            "Snapshot khớp cùng input tick."
          ]
        },
        {
          "id": "game-arena-design",
          "title": "Thiết kế dữ liệu",
          "critical": false,
          "criteria": [
            "Component/resource có trách nhiệm rõ.",
            "Giải thích giới hạn fixture và renderer chưa chạy."
          ]
        }
      ],
      "deliverables": [
        "Cargo project ECS và regression tests.",
        "Replay fixture cùng snapshot.",
        "Bảng phase, ID và quy tắc reset."
      ]
    },
    {
      "id": "game-project-levels",
      "title": "Pipeline level có kiểm tra",
      "description": "Xây công cụ level JSON, kiểm tra chơi được và reload không phá scene hiện tại.",
      "level": "independent",
      "estimatedHours": 14,
      "labLessonId": "game-scene-project",
      "requirements": [
        "CLI đọc JSON tối đa 64 KiB bằng bounded read.",
        "Schema version, kích thước, ID, vị trí, spawn và reachable đều được kiểm tra.",
        "Load candidate hoàn chỉnh trước khi đổi active revision.",
        "Tạo ba level: hướng dẫn, thử thách và biên; fixture lỗi riêng.",
        "Thêm metadata hiển thị tách khỏi terrain và hướng dẫn migration schema."
      ],
      "milestones": [
        {
          "title": "Loader an toàn theo hợp đồng",
          "tasks": [
            "Chạy sáu test mẫu.",
            "Bổ sung CLI và lỗi có đường dẫn trường."
          ],
          "acceptance": "Tệp quá lớn không được đọc không giới hạn."
        },
        {
          "title": "Nội dung có thể chơi",
          "tasks": [
            "Tạo ba level.",
            "BFS kiểm tra mọi item bắt buộc."
          ],
          "acceptance": "Tất cả level đạt validate; fixture không reachable thất bại đúng."
        },
        {
          "title": "Reload và tiến hóa",
          "tasks": [
            "Thêm version migration có fixture.",
            "Kiểm tra lỗi reload khi active đang có dữ liệu."
          ],
          "acceptance": "Active và revision không đổi khi candidate lỗi."
        }
      ],
      "testCases": [
        {
          "name": "ID trùng",
          "setup": "Hai item cùng ID.",
          "expected": "Lỗi trước build."
        },
        {
          "name": "Kẹt vật phẩm",
          "setup": "Tường kín ngăn đường tới item.",
          "expected": "unreachable_item."
        },
        {
          "name": "Version lạ",
          "setup": "JSON version chưa hỗ trợ.",
          "expected": "Từ chối, không đoán schema."
        },
        {
          "name": "Reload lỗi",
          "setup": "Active hợp lệ rồi tải JSON cắt ngắn.",
          "expected": "Active cũ và revision giữ nguyên."
        },
        {
          "name": "Byte budget",
          "setup": "Tệp vượt 64 KiB.",
          "expected": "Dừng bounded read và báo giới hạn."
        }
      ],
      "rubric": [
        {
          "id": "game-level-schema",
          "title": "Schema và giới hạn",
          "critical": true,
          "criteria": [
            "Kiểm tra phiên bản, ID và miền.",
            "Bounded read có test."
          ]
        },
        {
          "id": "game-level-reach",
          "title": "Tính chơi được",
          "critical": true,
          "criteria": [
            "BFS đúng bốn hướng.",
            "Item bắt buộc reachable; công việc có chặn trên."
          ]
        },
        {
          "id": "game-level-commit",
          "title": "Reload nguyên tử",
          "critical": true,
          "criteria": [
            "Không thay active một phần.",
            "Migration có fixture từng phiên bản."
          ]
        },
        {
          "id": "game-level-content",
          "title": "Nội dung và công cụ",
          "critical": false,
          "criteria": [
            "Ba level có mục tiêu học khác nhau.",
            "Thông báo lỗi hữu ích cho designer."
          ]
        }
      ],
      "deliverables": [
        "CLI validate/normalize level và thư viện loader.",
        "Ba level cùng fixture lỗi.",
        "Tài liệu schema, migration và reload."
      ]
    },
    {
      "id": "game-project-release",
      "title": "Game 2D có lưu tiến độ và phát hành",
      "description": "Hoàn thiện Rust Arcade thành lát cắt game có native UI, level, enemy, save và bằng chứng vận hành.",
      "level": "capstone",
      "estimatedHours": 30,
      "labLessonId": "game-release-project",
      "requirements": [
        "Dùng cùng core cho headless và Bevy native 0.20.1.",
        "Thêm level hai chiều từ loader, một enemy có ngân sách tìm đường.",
        "Giữ input cạnh/giữ, pause/restart và nội suy tách state vật lý.",
        "Hoàn thiện save tệp có version, temp/rename, backup và lỗi không mất active.",
        "Thêm màn hướng dẫn và UI trạng thái; playtest focus, resize, DPI.",
        "Benchmark release với workload định nghĩa, ghi CPU/GPU và giới hạn nền tảng."
      ],
      "milestones": [
        {
          "title": "Tích hợp cửa sổ",
          "tasks": [
            "Chạy core tests.",
            "Build native và kiểm tra camera, sprite, điều khiển."
          ],
          "acceptance": "Hành vi core khớp replay; cửa sổ có trạng thái và điều khiển rõ."
        },
        {
          "title": "Nội dung và lưu tiến độ",
          "tasks": [
            "Thêm level 2D, enemy và budget.",
            "Thêm save/restore và fault injection."
          ],
          "acceptance": "Save lỗi không phá phiên hoặc bản lưu trước."
        },
        {
          "title": "Phát hành",
          "tasks": [
            "Tạo build release, hướng dẫn, playtest matrix.",
            "Đo frame time và thử rollback save."
          ],
          "acceptance": "Bàn giao có replay tái hiện lỗi, kết quả test và phần chưa kiểm chứng."
        }
      ],
      "testCases": [
        {
          "name": "Replay",
          "setup": "Cùng log tick ở headless và native core.",
          "expected": "Score, vị trí, item khớp."
        },
        {
          "name": "Input cạnh",
          "setup": "Giữ Space qua nhiều frame và nhiều tick.",
          "expected": "Pause chỉ đổi một lần mỗi lần nhấn."
        },
        {
          "name": "Save hỏng",
          "setup": "JSON cắt ngắn hoặc version lạ.",
          "expected": "Active state giữ nguyên."
        },
        {
          "name": "Tìm đường quá tải",
          "setup": "Nhiều enemy xin path cùng lúc.",
          "expected": "Giữ budget, không treo frame, không bỏ đói vô hạn."
        },
        {
          "name": "Native thiết bị",
          "setup": "Resize, đổi DPI, mất focus và trở lại.",
          "expected": "Luật không đổi; input/camera hiển thị đúng theo chính sách."
        }
      ],
      "rubric": [
        {
          "id": "game-release-core",
          "title": "Core xác định",
          "critical": true,
          "criteria": [
            "Replay và budget có test.",
            "Renderer không sửa luật."
          ]
        },
        {
          "id": "game-release-save",
          "title": "Persistence",
          "critical": true,
          "criteria": [
            "Validate trước commit.",
            "Lỗi ghi/tải không mất bản hợp lệ."
          ]
        },
        {
          "id": "game-release-native",
          "title": "Tích hợp native",
          "critical": true,
          "criteria": [
            "Đã chạy playtest cửa sổ và input trên nền tảng nộp.",
            "Ghi rõ kết quả GPU/driver thực, không suy ra từ CPU test."
          ]
        },
        {
          "id": "game-release-delivery",
          "title": "Bàn giao",
          "critical": false,
          "criteria": [
            "Build release và hướng dẫn điều khiển.",
            "Báo cáo frame time, workload và giới hạn."
          ]
        }
      ],
      "deliverables": [
        "Cargo project core/native và build nền tảng đã kiểm thử.",
        "Level, replay, save fixture và test lỗi.",
        "Hướng dẫn chơi, báo cáo hiệu năng và playtest matrix."
      ]
    }
  ],
  "assessment": {
    "title": "Đánh giá năng lực Game và mô phỏng",
    "instructions": "Làm 12 tình huống rồi đối chiếu test, replay và playtest của ba dự án. Core headless và native có tiêu chí riêng; không đánh dấu kiểm chứng GPU khi chỉ chạy test CPU.",
    "passPercent": 80,
    "questions": [
      {
        "id": "game-exam-01",
        "question": "Entity runtime đã despawn xuất hiện trong save. Nên thiết kế lại thế nào?",
        "options": [
          "Lưu địa chỉ bộ nhớ.",
          "Lưu GameId và dựng bảng ánh xạ khi load.",
          "Dựa vào thứ tự Vec cũ."
        ],
        "correct": 1,
        "explanation": "Entity runtime thuộc world; ID bền vững cần quy tắc và kiểm tra riêng.",
        "lessonIds": [
          "game-data-model"
        ]
      },
      {
        "id": "game-exam-02",
        "question": "Hai system cùng nhận một item. Bất biến nào cần giữ?",
        "options": [
          "Mỗi system cộng một lần đều đúng.",
          "Frame rate thấp sẽ tự sửa.",
          "Một item chỉ commit phần thưởng một lần."
        ],
        "correct": 2,
        "explanation": "Idempotency thuộc luật, không phụ thuộc số lần phát hiện.",
        "lessonIds": [
          "game-lifecycle"
        ]
      },
      {
        "id": "game-exam-03",
        "question": "Giữ phím pause làm phase đảo liên tục. Cách sửa?",
        "options": [
          "Dùng cạnh vừa nhấn và tiêu thụ command một lần.",
          "Gọi toggle ở mọi fixed tick.",
          "Tăng tốc độ game."
        ],
        "correct": 0,
        "explanation": "Input mức thích hợp cho di chuyển giữ; thao tác toggle cần cạnh.",
        "lessonIds": [
          "game-state-machines"
        ]
      },
      {
        "id": "game-exam-04",
        "question": "Collect chạy trước move và nhận item muộn. Cần thay gì?",
        "options": [
          "Màu item.",
          "Version save.",
          "Khai báo thứ tự move → collect → finish."
        ],
        "correct": 2,
        "explanation": "System đọc dữ liệu cũ khi thứ tự không phù hợp luật.",
        "lessonIds": [
          "game-arena-project"
        ]
      },
      {
        "id": "game-exam-05",
        "question": "Projectile nhanh không overlap tường ở hai đầu tick. Có thể vẫn va chạm không?",
        "options": [
          "Không vì fixed timestep luôn đủ.",
          "Có; đường đi giữa tick có thể cắt tường.",
          "Chỉ khi texture lớn."
        ],
        "correct": 1,
        "explanation": "Cần swept/continuous test hoặc giới hạn vận tốc theo hợp đồng.",
        "lessonIds": [
          "game-collision"
        ]
      },
      {
        "id": "game-exam-06",
        "question": "Thêm random hiệu ứng làm replay gameplay đổi. Kiểm tra gì?",
        "options": [
          "Nguồn RNG và thứ tự tiêu thụ giữa trình bày/gameplay.",
          "Font chữ.",
          "Dung lượng file ảnh."
        ],
        "correct": 0,
        "explanation": "Cùng seed không đủ nếu chuỗi lần gọi khác.",
        "lessonIds": [
          "game-replay"
        ]
      },
      {
        "id": "game-exam-07",
        "question": "Nội suy Transform rồi ghi ngược vào Position gây vấn đề gì?",
        "options": [
          "Chỉ đổi hình, không thể ảnh hưởng luật.",
          "Giảm số tick cần thiết chính xác.",
          "State vật lý phụ thuộc lịch render."
        ],
        "correct": 2,
        "explanation": "Alpha render khác giữa frame; state mô phỏng cần tách riêng.",
        "lessonIds": [
          "game-render-pipeline"
        ]
      },
      {
        "id": "game-exam-08",
        "question": "Level parse được nhưng item không reachable. Có thể bắt đầu chơi không?",
        "options": [
          "Chưa; validate gameplay phải phát hiện điều kiện đó.",
          "Có vì JSON hợp lệ.",
          "Có nếu item có texture."
        ],
        "correct": 0,
        "explanation": "Parse kiểm tra cấu trúc, không chứng minh level đáp ứng luật.",
        "lessonIds": [
          "game-scene-project"
        ]
      },
      {
        "id": "game-exam-09",
        "question": "BFS hết ngân sách trước khi duyệt xong. Kết quả đúng là gì?",
        "options": [
          "NoPath ngay.",
          "Pending, tiếp tục theo lịch.",
          "Teleport tới mục tiêu."
        ],
        "correct": 1,
        "explanation": "Chưa hoàn tất tìm kiếm không đồng nghĩa không tồn tại đường.",
        "lessonIds": [
          "game-navigation"
        ]
      },
      {
        "id": "game-exam-10",
        "question": "Tối ưu nhanh hơn nhưng replay score khác. Nên kết luận?",
        "options": [
          "Chưa đạt vì thay hành vi cần bảo toàn.",
          "Đạt vì FPS là tiêu chí duy nhất.",
          "Sửa snapshot mà không phân tích."
        ],
        "correct": 0,
        "explanation": "Regression giữ hợp đồng là điều kiện trước khi nhận cải thiện hiệu năng.",
        "lessonIds": [
          "game-profiling"
        ]
      },
      {
        "id": "game-exam-11",
        "question": "Save lỗi ở trường cuối sau khi đã đọc inventory. Nên commit thế nào?",
        "options": [
          "Giữ một nửa dữ liệu mới.",
          "Xóa save trước khi parse.",
          "Validate candidate đầy đủ rồi thay active một lần."
        ],
        "correct": 2,
        "explanation": "Commit tách biệt tránh trạng thái ghép và mất bản hợp lệ.",
        "lessonIds": [
          "game-save-format"
        ]
      },
      {
        "id": "game-exam-12",
        "question": "Core CPU tests đạt nhưng chưa mở cửa sổ native. Tiêu chí nào còn thiếu?",
        "options": [
          "Không còn thiếu.",
          "Playtest input, camera, DPI và GPU nền tảng đích.",
          "Chỉ đổi tên package."
        ],
        "correct": 1,
        "explanation": "Renderer và input hệ điều hành không được chạy trong headless test.",
        "lessonIds": [
          "game-release-project"
        ]
      }
    ],
    "skills": [
      {
        "id": "game-skill-1",
        "title": "Dữ liệu và vòng đời ECS",
        "description": "Tách danh tính bền vững khỏi Entity runtime. Kiểm tra dữ liệu trước spawn. Xử lý nhận/xóa đúng một lần.",
        "lessonIds": [
          "game-ecs",
          "game-data-model",
          "game-lifecycle"
        ],
        "projectIds": [
          "game-project-arena"
        ],
        "required": true
      },
      {
        "id": "game-skill-2",
        "title": "Luật, trạng thái và lịch hệ thống",
        "description": "Viết bảng chuyển trạng thái. Phân biệt input cạnh và giữ. Kiểm chứng move → collect → finish.",
        "lessonIds": [
          "game-scheduling",
          "game-state-machines",
          "game-arena-project"
        ],
        "projectIds": [
          "game-project-arena"
        ],
        "required": true
      },
      {
        "id": "game-skill-3",
        "title": "Thời gian, va chạm và replay",
        "description": "Xử lý timestep và ngân sách. Định nghĩa biên va chạm. Ghi input theo tick và kiểm soát RNG.",
        "lessonIds": [
          "game-timestep",
          "game-collision",
          "game-replay"
        ],
        "projectIds": [
          "game-project-release"
        ],
        "required": true
      },
      {
        "id": "game-skill-4",
        "title": "Scene, camera và hiển thị",
        "description": "Chuyển tọa độ và nội suy. Kiểm tra schema và reachable. Load candidate trước khi thay scene.",
        "lessonIds": [
          "game-assets-coordinates",
          "game-render-pipeline",
          "game-scene-project"
        ],
        "projectIds": [
          "game-project-levels"
        ],
        "required": true
      },
      {
        "id": "game-skill-5",
        "title": "Tác nhân và hiệu năng",
        "description": "Tìm đường có giới hạn. Đo frame time và spike. Giữ replay khi tối ưu.",
        "lessonIds": [
          "game-input-performance",
          "game-navigation",
          "game-profiling"
        ],
        "projectIds": [
          "game-project-release"
        ],
        "required": true
      },
      {
        "id": "game-skill-6",
        "title": "Lưu tiến độ và phát hành",
        "description": "Validate save theo phiên bản. Chạy cùng core trong headless/native. Playtest và ghi phạm vi nền tảng.",
        "lessonIds": [
          "game-testing-release",
          "game-save-format",
          "game-release-project"
        ],
        "projectIds": [
          "game-project-release"
        ],
        "required": true
      }
    ]
  }
};
