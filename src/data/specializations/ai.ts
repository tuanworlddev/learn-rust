import type { SpecializationBundle } from "../specialization-types";

export const aiBundle: SpecializationBundle = {
  "track": {
    "id": "ai",
    "title": "AI và Machine Learning",
    "shortTitle": "AI & ML",
    "description": "Xây pipeline dữ liệu, huấn luyện mô hình nhỏ và triển khai suy luận bằng Burn, Candle cùng các phép đo chất lượng rõ ràng.",
    "outcome": "Tạo dịch vụ suy luận CPU có hợp đồng tensor, tiền xử lý nhất quán, mô hình được kiểm chứng, giới hạn tải và quy trình phát hành có thể tái lập.",
    "prerequisites": [
      "Ownership, Result, trait và generic",
      "Iterator, slice, số thực và kiểm thử Rust",
      "Vector, ma trận, đạo hàm và xác suất cơ bản",
      "HTTP, async và giới hạn tài nguyên",
      "Biết đọc số đo thay vì chỉ quan sát một dự đoán đúng"
    ],
    "technologies": [
      "Burn 0.22",
      "Candle",
      "Tensor",
      "Autodiff",
      "SafeTensors",
      "CPU inference"
    ],
    "color": "purple",
    "lessonIds": [
      "ai-tensors",
      "ai-data-pipeline",
      "ai-burn-training",
      "ai-candle-inference",
      "ai-evaluation",
      "ai-serving"
    ],
    "capstone": {
      "title": "Dịch vụ phân loại cửa sổ cảm biến mẫu",
      "description": "Tạo dữ liệu tổng hợp gồm các cửa sổ số đo từ nhiều thiết bị giả lập, huấn luyện bộ phân loại nhỏ bằng Burn rồi phục vụ dự đoán bằng Candle. Mục tiêu là chứng minh toàn bộ quy trình dữ liệu, mô hình và vận hành; kết quả trên dữ liệu tổng hợp không chứng minh độ chính xác trên thiết bị thật.",
      "milestones": [
        {
          "title": "Hợp đồng và dữ liệu",
          "tasks": [
            "Định nghĩa schema phiên bản, đơn vị đo, hai đặc trưng và cách sinh nhãn; lưu ID thiết bị và thời điểm riêng khỏi đầu vào mô hình.",
            "Chia tập theo thiết bị hoặc thời gian trước khi fit phép chuẩn hóa; ghi seed, cấu hình và mã băm dữ liệu."
          ],
          "acceptance": "Kiểm thử xác nhận không trùng nhóm giữa train/validation/test; NaN, sai đơn vị và thiếu đặc trưng đều bị từ chối."
        },
        {
          "title": "Baseline và huấn luyện",
          "tasks": [
            "Viết baseline dự đoán lớp phổ biến và một mô hình tuyến tính nhỏ với Burn; lưu cấu hình, learning rate, seed và phiên bản dependency.",
            "Theo dõi loss, gradient không hữu hạn và tiêu chí dừng; chọn siêu tham số bằng validation."
          ],
          "acceptance": "Trên bộ dữ liệu tổng hợp cố định, mô hình vượt baseline theo metric đã chọn trước; một batch nhỏ có thể được overfit để kiểm tra pipeline."
        },
        {
          "title": "Đánh giá độc lập",
          "tasks": [
            "Báo cáo confusion matrix, precision, recall và số mẫu của từng lớp; chọn ngưỡng trên validation rồi khóa lại.",
            "Đánh giá tập test một lần sau khi khóa pipeline; thêm ca biên và nhóm thiết bị có nhiễu khác nhau."
          ],
          "acceptance": "Báo cáo nêu cả lỗi false positive/false negative, trường hợp metric không xác định và giới hạn của dữ liệu tổng hợp; không sửa mô hình theo test rồi giữ nguyên tên test."
        },
        {
          "title": "Artifact và Candle",
          "tasks": [
            "Xuất tensor trọng số với tên, shape và dtype đã công bố; lưu cấu hình chuẩn hóa cùng version mô hình, nhãn và quy tắc hậu xử lý.",
            "Ánh xạ trọng số sang Candle theo đúng chiều ma trận; dùng fixture vàng để so sánh Burn/Candle trước và sau lưu–nạp."
          ],
          "acceptance": "Dự đoán trên ít nhất 20 fixture khớp trong sai số đã định; artifact thiếu tensor, sai shape, sai version hoặc chứa giá trị không hữu hạn không được kích hoạt."
        },
        {
          "title": "Dịch vụ và phát hành",
          "tasks": [
            "Tạo endpoint nhận batch có giới hạn kích thước, hàng đợi hữu hạn, deadline và model version trong phản hồi; tách suy luận CPU khỏi executor I/O.",
            "Đo release build sau warm-up với batch 1 và batch lớn; ghi p50/p95, throughput, bộ nhớ và tỷ lệ từ chối.",
            "Khởi động mô hình ứng viên, chạy kiểm tra trước khi đổi con trỏ phục vụ; giữ bản trước để rollback."
          ],
          "acceptance": "Một người khác clone, chạy test, tạo artifact và khởi động theo README; tải vượt giới hạn trả lỗi rõ, đổi mô hình lỗi giữ bản đang chạy, rollback tái hiện fixture cũ."
        }
      ],
      "deliverables": [
        "Cargo workspace, Cargo.lock và lệnh tái lập thí nghiệm",
        "Bộ sinh dữ liệu, manifest phân chia tập và phép chuẩn hóa",
        "Mô hình Burn, baseline và báo cáo đánh giá theo lớp",
        "Artifact SafeTensors kèm manifest và fixture đối chiếu Candle",
        "API suy luận, kiểm thử đầu vào/quá tải và báo cáo đo hiệu năng",
        "README về phiên bản mô hình, kích hoạt, rollback và giới hạn áp dụng"
      ],
      "reviewQuestions": [
        "Vì sao fit scaler trên toàn bộ dữ liệu vẫn gây rò rỉ dù không dùng nhãn?",
        "Tensor có rank đúng nhưng shape sai có thể làm gì khi broadcasting?",
        "Trong Burn 0.22, bật autodiff và giữ gradient khác nhau ở đâu?",
        "Vì sao loss giảm không đủ để kết luận mô hình tốt hơn baseline?",
        "Bạn chứng minh trọng số chuyển từ Burn sang Candle giữ nguyên ý nghĩa thế nào?",
        "Nếu tăng batch size giúp throughput nhưng p95 xấu đi, bạn chọn giới hạn theo tiêu chí nào?",
        "Artifact hợp lệ về định dạng có bảo đảm mô hình đáng tin cậy hoặc phù hợp giấy phép không?"
      ]
    },
    "resources": [
      {
        "label": "Burn 0.22.1: API và backend",
        "url": "https://docs.rs/burn/0.22.1/burn/"
      },
      {
        "label": "Burn Book: tensor và autodiff",
        "url": "https://burn.dev/books/burn/building-blocks/autodiff.html"
      },
      {
        "label": "Burn Book: module và chế độ huấn luyện",
        "url": "https://burn.dev/books/burn/building-blocks/module.html"
      },
      {
        "label": "Burn Book: lưu và nạp mô hình",
        "url": "https://burn.dev/books/burn/saving-and-loading.html"
      },
      {
        "label": "Candle 0.11.1: tensor",
        "url": "https://docs.rs/candle-core/0.11.1/candle_core/"
      },
      {
        "label": "Candle: mã nguồn và ví dụ chính thức",
        "url": "https://github.com/huggingface/candle"
      },
      {
        "label": "scikit-learn: tránh rò rỉ dữ liệu",
        "url": "https://scikit-learn.org/stable/common_pitfalls.html"
      },
      {
        "label": "Hugging Face: SafeTensors",
        "url": "https://huggingface.co/docs/safetensors/index"
      },
      {
        "label": "scikit-learn: chọn ngưỡng phân loại",
        "url": "https://scikit-learn.org/stable/modules/classification_threshold.html"
      }
    ]
  },
  "lessons": [
    {
      "id": "ai-tensors",
      "moduleId": "track-ai",
      "title": "Tensor: shape, dtype và thiết bị",
      "description": "Đọc hợp đồng dữ liệu, tính chi phí bộ nhớ và phát hiện sai chiều trước khi gọi thư viện học máy.",
      "duration": 45,
      "objectives": [
        "Phân biệt rank, shape, dtype và device",
        "Tính đúng phép nhân ma trận và broadcasting",
        "Kiểm tra đầu vào không hữu hạn, kích thước và tràn số",
        "Chọn backend CPU rõ ràng cho bài thử nghiệm"
      ],
      "sections": [
        {
          "title": "Mỗi trục phải có ý nghĩa",
          "text": "Tensor chứa dữ liệu cùng mô tả hình dạng. Vector có rank 1, ma trận có rank 2; shape [32, 8] có thể là 32 mẫu, mỗi mẫu tám đặc trưng. Hai ma trận cùng số phần tử chưa chắc cùng ý nghĩa. Đổi [32, 8] thành [8, 32] bằng reshape không tự biến hàng thành cột như transpose.\n\nHãy viết tên trục ngay ở biên hàm: X là [batch, features], W là [features, outputs], kết quả XW là [batch, outputs]. Burn 0.22 dùng Tensor<D> để biểu diễn rank trong kiểu; độ dài từng trục vẫn cần kiểm tra lúc chạy. Trong Candle, tensor mang shape và dtype lúc chạy. Đừng chờ một lỗi sâu trong mô hình mới tìm ra cột đặc trưng bị đảo."
        },
        {
          "title": "Broadcasting có thể che giấu lỗi",
          "text": "Phép cộng bias cho từng mẫu thường mở rộng [outputs] hoặc [1, outputs] sang cả batch. Việc mở rộng hợp lệ về số học chưa chứng minh đúng nghiệp vụ: một nhãn [batch, 1] cộng với dự đoán [batch] có thể tạo ma trận sai ý định trong API hỗ trợ broadcasting.\n\nVẽ kích thước trước và sau từng phép toán. Phép nhân ma trận không phải nhân từng phần tử: trục trong phải bằng nhau và mỗi phần tử đầu ra là tổng các tích. Bài tập dùng dữ liệu row-major để nhìn thấy phép tính thật. Thư viện tensor tối ưu bước này, nhưng người viết vẫn chịu trách nhiệm về thứ tự đặc trưng, chiều trọng số và trục giảm tổng.",
          "code": "// Hai mẫu, hai đặc trưng; một đầu ra cho mỗi mẫu.\n// X: [2, 2], W: [2, 1], Y: [2, 1]\n// [[1, 2], [3, 4]] × [[2], [1]] = [[4], [10]]"
        },
        {
          "title": "Dtype và bộ nhớ là một phần hợp đồng",
          "text": "Một triệu phần tử f32 cần khoảng bốn triệu byte cho dữ liệu thô; gradient, tensor trung gian và bộ cấp phát làm tổng bộ nhớ lớn hơn. Tính số phần tử bằng checked_mul trước khi cấp phát, giới hạn batch và kiểm tra buffer khớp shape. Không nhân các kích thước không đáng tin rồi mới so với giới hạn.\n\nSố thực có làm tròn, NaN và vô cực. Đầu vào hữu hạn cũng có thể sinh kết quả vô cực sau phép nhân. Chọn dung sai khi so sánh kết quả và kiểm tra giá trị bất thường tại các biên quan trọng. Chuyển f32 sang kiểu ít bit hơn là quyết định cần đo lại chất lượng, không chỉ là thay tên kiểu."
        },
        {
          "title": "Chọn backend trước khi đo",
          "text": "Device cho biết nơi tensor được xử lý. Chuyển dữ liệu CPU sang GPU có chi phí; một batch nhỏ có thể tốn thời gian truyền nhiều hơn tính toán. Không suy ra hiệu năng chỉ từ việc đã bật GPU. Ghi rõ backend, dtype, shape và thiết bị trong kết quả đo.\n\nLab của hướng này chọn Device::flex() trong Burn 0.22 và Device::Cpu trong Candle để chạy bằng dữ liệu nhỏ trên CPU. Burn không cung cấp execution backend mặc định nếu chưa bật feature phù hợp. Khi đọc ví dụ cũ có Tensor<B, D>, hãy kiểm tra phiên bản trước khi ghép mã. Chương trình biên dịch thành công vẫn cần fixture kiểm chứng ý nghĩa của các tensor.",
          "code": "// Burn0.22.1, features = [\"std\", \"flex\"]\nuse burn::tensor::{Device, Tensor};\nlet device = Device::flex();\nlet x = Tensor::<2>::from_floats([[1.0, 2.0], [3.0, 4.0]], &device);\nassert_eq!(x.dims(), [2, 2]);"
        }
      ],
      "tip": "Viết tên và đơn vị của từng đặc trưng cùng shape; tensor đúng kích thước vẫn có thể chứa dữ liệu sai nghĩa.",
      "exercise": {
        "title": "Nhân ma trận có kiểm tra hợp đồng",
        "instructions": "Hoàn thiện matmul cho hai ma trận row-major. Giới hạn cả kích thước và số phép nhân trước khi cấp phát; trả lỗi thay vì chấp nhận shape không hợp lệ.",
        "requirements": [
          "Các chiều phải lớn hơn 0, trục trong bằng nhau và độ dài buffer khớp shape.",
          "Dùng checked_mul; mỗi buffer, kết quả và tổng số phép nhân không vượt 1.000.000.",
          "Từ chối NaN, vô cực ở đầu vào hoặc đầu ra.",
          "Trả các phần tử đầu ra theo row-major."
        ]
      },
      "starterCode": "fn matmul(a: &[f32], ash: (usize, usize), b: &[f32], bsh: (usize, usize)) -> Result<Vec<f32>, &'static str> {\n    // Kiểm tra shape, ngân sách, số thực rồi mới tính.\n    todo!()\n}\nfn main() {\n    let out = matmul(&[1.0, 2.0, 3.0, 4.0], (2, 2), &[2.0, 0.0, 1.0, 3.0], (2, 2)).unwrap();\n    assert_eq!(out, vec![4.0, 6.0, 10.0, 12.0]);\n    assert!(matmul(&[1.0], (1, 2), &[1.0], (2, 1)).is_err());\n    assert!(matmul(&[1.0], (1, 1), &[1.0, 2.0], (2, 1)).is_err());\n    assert!(matmul(&[], (0, 1), &[1.0], (1, 1)).is_err());\n    assert!(matmul(&[f32::NAN], (1, 1), &[1.0], (1, 1)).is_err());\n    assert!(matmul(&[], (usize::MAX, 2), &[], (2, 1)).is_err());\n    assert!(matmul(&[f32::MAX], (1, 1), &[2.0], (1, 1)).is_err());\n    println!(\"2x2: {:.0} {:.0} | {:.0} {:.0}\", out[0], out[1], out[2], out[3]);\n}",
      "solutionCode": "fn matmul(a: &[f32], ash: (usize, usize), b: &[f32], bsh: (usize, usize)) -> Result<Vec<f32>, &'static str> {\n    let (rows, inner) = ash;\n    let (other_inner, cols) = bsh;\n    if rows == 0 || inner == 0 || cols == 0 || inner != other_inner {\n        return Err(\"shape\");\n    }\n    let a_len = rows.checked_mul(inner).ok_or(\"overflow\")?;\n    let b_len = inner.checked_mul(cols).ok_or(\"overflow\")?;\n    let out_len = rows.checked_mul(cols).ok_or(\"overflow\")?;\n    let work = out_len.checked_mul(inner).ok_or(\"overflow\")?;\n    if [a_len, b_len, out_len, work].into_iter().any(|n| n > 1_000_000) {\n        return Err(\"budget\");\n    }\n    if a.len() != a_len || b.len() != b_len { return Err(\"buffer\"); }\n    if a.iter().chain(b).any(|x| !x.is_finite()) { return Err(\"non-finite\"); }\n    let mut out = vec![0.0; out_len];\n    for row in 0..rows {\n        for col in 0..cols {\n            let mut sum = 0.0_f32;\n            for k in 0..inner { sum += a[row * inner + k] * b[k * cols + col]; }\n            if !sum.is_finite() { return Err(\"non-finite result\"); }\n            out[row * cols + col] = sum;\n        }\n    }\n    Ok(out)\n}\nfn main() {\n    let out = matmul(&[1.0, 2.0, 3.0, 4.0], (2, 2), &[2.0, 0.0, 1.0, 3.0], (2, 2)).unwrap();\n    assert_eq!(out, vec![4.0, 6.0, 10.0, 12.0]);\n    assert!(matmul(&[1.0], (1, 2), &[1.0], (2, 1)).is_err());\n    assert!(matmul(&[1.0], (1, 1), &[1.0, 2.0], (2, 1)).is_err());\n    assert!(matmul(&[], (0, 1), &[1.0], (1, 1)).is_err());\n    assert!(matmul(&[f32::NAN], (1, 1), &[1.0], (1, 1)).is_err());\n    assert!(matmul(&[], (usize::MAX, 2), &[], (2, 1)).is_err());\n    assert!(matmul(&[f32::MAX], (1, 1), &[2.0], (1, 1)).is_err());\n    println!(\"2x2: {:.0} {:.0} | {:.0} {:.0}\", out[0], out[1], out[2], out[3]);\n}",
      "expectedOutput": "2x2: 4 6 | 10 12",
      "hints": [
        "Đặt tên rows, inner, cols; kiểm tra inner bằng số hàng của ma trận phải.",
        "Chỉ số row-major là row * số_cột + col.",
        "Chi phí phép nhân là rows * inner * cols, không chỉ số phần tử đầu ra."
      ],
      "quiz": {
        "question": "Tensor<2> trong Burn 0.22 bảo đảm điều gì?",
        "options": [
          "Mọi tensor đều có đúng hai phần tử.",
          "Rank bằng 2; độ dài từng trục và ý nghĩa đặc trưng vẫn cần kiểm tra.",
          "Dtype luôn là f64 và dữ liệu luôn ở CPU.",
          "Mọi phép nhân hai tensor này đều có shape hợp lệ."
        ],
        "correct": 1,
        "explanation": "Số2 là số trục. Shape [32,8] và [4,2] đều có rank 2 nhưng không thể thay thế cho nhau ở mọi phép toán."
      },
      "reference": {
        "label": "Burn Book: hợp đồng shape của module",
        "url": "https://burn.dev/books/burn/building-blocks/module.html"
      }
    },
    {
      "id": "ai-data-pipeline",
      "moduleId": "track-ai",
      "title": "Pipeline dữ liệu và tránh rò rỉ",
      "description": "Chia tập, fit phép chuẩn hóa và giữ cùng hợp đồng đặc trưng từ huấn luyện đến suy luận.",
      "duration": 50,
      "objectives": [
        "Chia train, validation và test theo mục tiêu sử dụng",
        "Fit preprocessing chỉ bằng dữ liệu huấn luyện",
        "Xử lý cột hằng, dữ liệu thiếu và số thực bất thường",
        "Lưu schema và phép biến đổi cùng mô hình"
      ],
      "sections": [
        {
          "title": "Chia tập trước khi học từ dữ liệu",
          "text": "Train dùng để cập nhật tham số; validation hỗ trợ chọn cấu hình và ngưỡng; test ước lượng kết quả sau khi các lựa chọn đã được khóa. Nếu quan sát lỗi trên test rồi chỉnh mô hình nhiều lần, tập ấy đang trở thành validation. Một con số đẹp trên đó không còn là đánh giá độc lập.\n\nCách chia phải giống tình huống triển khai. Nhiều cửa sổ từ cùng một thiết bị thường liên quan nhau; chia ngẫu nhiên từng dòng có thể đưa những mẫu gần giống vào cả hai tập. Với dự báo tương lai, xem xét chia theo thời gian. Ghi ID nhóm, khoảng thời gian và quy tắc phân chia để kiểm tra không giao nhau."
        },
        {
          "title": "Fit và transform là hai thao tác khác nhau",
          "text": "Chuẩn hóa có thể biến x thành (x−mean)/scale. Mean và scale phải được tính từ train rồi giữ nguyên khi biến đổi validation, test và request mới. Tính lại mean trên batch người dùng sẽ làm một mẫu có kết quả khác chỉ vì đi cùng các mẫu khác.\n\nKhông chỉ nhãn mới gây rò rỉ. Điền giá trị thiếu, chọn đặc trưng hoặc xây từ điển bằng toàn bộ dữ liệu cũng có thể đưa thông tin đánh giá vào quá trình học. Hãy tách API fit nhận train khỏi transform chỉ đọc cấu hình đã lưu. Bài tập dùng phương sai tổng thể với mẫu số n; cột hằng chọn scale 1 để tránh chia 0 và giữ phép biến đổi xác định."
        },
        {
          "title": "Schema quan trọng hơn thứ tự trong Vec",
          "text": "Một Vec<f32> không nói được cột đầu là nhiệt độ Celsius hay độ rung. Lưu tên cột, thứ tự, đơn vị, kiểu và chính sách giá trị thiếu trong manifest. Mã ở bước nạp dữ liệu và endpoint suy luận phải cùng tạo ra một schema. Nếu thay đổi cách mã hóa danh mục, hãy phát hành phiên bản mới thay vì ghép với trọng số cũ.\n\nChọn rõ cách xử lý dữ liệu ngoài miền: từ chối, điền giá trị theo quy tắc đã fit, hoặc thêm chỉ báo thiếu. Không đổi NaN thành 0 một cách ngầm định. Giá trị0 có thể mang ý nghĩa thật, còn dữ liệu thiếu là một trạng thái khác cần được giải thích khi review."
        },
        {
          "title": "Tái lập cả pipeline",
          "text": "Một seed không mô tả hết thí nghiệm. Cần giữ phiên bản dữ liệu, mã tiền xử lý, cách chia tập, cấu hình mô hình, dependency và backend. Thứ tự batch, nguồn ngẫu nhiên và phép tính song song có thể ảnh hưởng kết quả. So sánh bằng dung sai và metric phù hợp thay vì hứa mọi máy cho từng bit giống nhau.\n\nViết fixture nhỏ đi xuyên suốt pipeline: một bản ghi nguồn phải tạo đúng vector trước khi gọi model. Thêm ca Unicode nếu có văn bản, cột hằng, số cực lớn và giá trị thiếu. Khi thay parser hoặc refactor schema, kiểm thử này phát hiện thay đổi ý nghĩa sớm hơn việc đợi loss huấn luyện tăng.",
          "code": "// Scaler là artifact đã fit từ train, không fit lại trong predict.\nlet train_scaler = Scaler::fit(&[1.0, 3.0])?;\nlet feature = train_scaler.transform(9.0)?;\n// mean=2, scale=1 nên feature=7, không phải0."
        }
      ],
      "tip": "Lưu phép tiền xử lý cùng phiên bản mô hình; chỉ lưu trọng số chưa đủ để tái hiện một dự đoán.",
      "exercise": {
        "title": "Scaler chỉ học từ train",
        "instructions": "Viết Scaler::fit bằng cập nhật Welford và transform dùng cấu hình bất biến. Test9 chỉ được transform bằng scaler học từ [1,3].",
        "requirements": [
          "Từ chối tập train rỗng và giá trị không hữu hạn.",
          "Cập nhật mean và m2 từng phần tử; variance=m2/n, scale=sqrt(variance).",
          "Nếu cột hằng, đặt scale=1; phát hiện tràn thành số không hữu hạn.",
          "transform không đổi mean/scale và từ chối đầu vào hoặc kết quả không hữu hạn."
        ]
      },
      "starterCode": "#[derive(Debug)]\nstruct Scaler { mean: f64, scale: f64 }\nimpl Scaler {\n    fn fit(train: &[f64]) -> Result<Self, &'static str> { todo!() }\n    fn transform(&self, value: f64) -> Result<f64, &'static str> { todo!() }\n}\nfn main() {\n    let scaler = Scaler::fit(&[1.0, 3.0]).unwrap();\n    assert!((scaler.mean - 2.0).abs() < 1e-12);\n    assert!((scaler.scale - 1.0).abs() < 1e-12);\n    assert!((scaler.transform(9.0).unwrap() - 7.0).abs() < 1e-12);\n    let constant = Scaler::fit(&[5.0, 5.0]).unwrap();\n    assert_eq!(constant.scale, 1.0);\n    assert_eq!(constant.transform(5.0), Ok(0.0));\n    assert!(Scaler::fit(&[]).is_err());\n    assert!(Scaler::fit(&[f64::NAN]).is_err());\n    assert!(Scaler::fit(&[f64::MAX, -f64::MAX]).is_err());\n    assert!(scaler.transform(f64::INFINITY).is_err());\n    println!(\"mean={:.1}, scale={:.1}; 9 -> {:.1}\", scaler.mean, scaler.scale, scaler.transform(9.0).unwrap());\n}",
      "solutionCode": "#[derive(Debug)]\nstruct Scaler { mean: f64, scale: f64 }\nimpl Scaler {\n    fn fit(train: &[f64]) -> Result<Self, &'static str> {\n        if train.is_empty() { return Err(\"empty\"); }\n        let (mut mean, mut m2) = (0.0_f64, 0.0_f64);\n        for (index, &value) in train.iter().enumerate() {\n            if !value.is_finite() { return Err(\"non-finite\"); }\n            let delta = value - mean;\n            mean += delta / (index + 1) as f64;\n            m2 += delta * (value - mean);\n            if !mean.is_finite() || !m2.is_finite() { return Err(\"overflow\"); }\n        }\n        let variance = (m2 / train.len() as f64).max(0.0);\n        let scale = if variance == 0.0 { 1.0 } else { variance.sqrt() };\n        Ok(Self { mean, scale })\n    }\n    fn transform(&self, value: f64) -> Result<f64, &'static str> {\n        if !value.is_finite() { return Err(\"non-finite\"); }\n        let result = (value - self.mean) / self.scale;\n        if !result.is_finite() { return Err(\"overflow\"); }\n        Ok(result)\n    }\n}\nfn main() {\n    let scaler = Scaler::fit(&[1.0, 3.0]).unwrap();\n    assert!((scaler.mean - 2.0).abs() < 1e-12);\n    assert!((scaler.scale - 1.0).abs() < 1e-12);\n    assert!((scaler.transform(9.0).unwrap() - 7.0).abs() < 1e-12);\n    let constant = Scaler::fit(&[5.0, 5.0]).unwrap();\n    assert_eq!(constant.scale, 1.0);\n    assert_eq!(constant.transform(5.0), Ok(0.0));\n    assert!(Scaler::fit(&[]).is_err());\n    assert!(Scaler::fit(&[f64::NAN]).is_err());\n    assert!(Scaler::fit(&[f64::MAX, -f64::MAX]).is_err());\n    assert!(scaler.transform(f64::INFINITY).is_err());\n    println!(\"mean={:.1}, scale={:.1}; 9 -> {:.1}\", scaler.mean, scaler.scale, scaler.transform(9.0).unwrap());\n}",
      "expectedOutput": "mean=2.0, scale=1.0; 9 -> 7.0",
      "hints": [
        "Welford dùng delta trước khi cập nhật mean, rồi dùng value−mean mới để cập nhật m2.",
        "Mẫu số trong bài là n, không phải n−1.",
        "Phương thức transform nhận &self nên không cần tái huấn luyện scaler."
      ],
      "quiz": {
        "question": "Bạn đã chia train/test nhưng tính mean chuẩn hóa từ cả hai. Vấn đề là gì?",
        "options": [
          "Không có vấn đề vì mean không dùng nhãn.",
          "Thông tin từ test đã ảnh hưởng phép biến đổi; phải fit trên train và dùng lại cho test.",
          "Chỉ cần đổi f32 thành f64.",
          "Chỉ cần tăng số epoch."
        ],
        "correct": 1,
        "explanation": "Thống kê của tập đánh giá đã đi vào pipeline được học. Giữ phép biến đổi đã fit từ train cũng bảo đảm serving dùng cùng không gian đặc trưng."
      },
      "reference": {
        "label": "scikit-learn: preprocessing và data leakage",
        "url": "https://scikit-learn.org/stable/common_pitfalls.html"
      }
    },
    {
      "id": "ai-burn-training",
      "moduleId": "track-ai",
      "title": "Huấn luyện với Burn và autodiff",
      "description": "Hiểu loss, gradient và vòng cập nhật qua một mô hình nhỏ có kết quả kiểm chứng bằng tay.",
      "duration": 65,
      "objectives": [
        "Tính gradient của hồi quy tuyến tính với MSE",
        "Dùng Burn 0.22 với Flex và autodiff",
        "Phân biệt tạo đồ thị, giữ gradient và cập nhật tham số",
        "Tách chế độ huấn luyện, validation và inference"
      ],
      "sections": [
        {
          "title": "Bắt đầu bằng bài toán tính được bằng tay",
          "text": "Mô hình ŷ=wx+b có hai tham số. Với n mẫu, MSE là trung bình bình phương sai số. Gradient theo w bằng trung bình của 2x(ŷ−y); gradient theo b bằng trung bình của 2(ŷ−y). Cập nhật tham số theo hướng âm gradient với learning rate đã chọn.\n\nVí dụ x=[1,2], y=[3,5], w=b=0 cho loss 17, gradient w là −13 và gradient b là −8. Một bước learning rate 0,1 cho w=1,3 và b=0,8. Tính ví dụ nhỏ này trước giúp phát hiện giảm tổng sai trục, quên chia số mẫu hoặc cập nhật nhầm dấu. Autodiff tính đạo hàm của chương trình đã viết; nó không sửa công thức loss sai."
        },
        {
          "title": "Bật autodiff và chọn tham số cần gradient",
          "text": "Trong Burn 0.22, tạo Device::flex().autodiff() trước khi khởi tạo tensor huấn luyện. Gọi require_grad trên các tensor lá cần giữ gradient, chẳng hạn trọng số và bias. Đầu vào vẫn có thể là hằng số trong đồ thị; không cần giữ gradient của mọi mẫu chỉ để cập nhật mô hình.\n\nbackward trả về container gradient. Lấy gradient tương ứng với tham số bằng grad hoặc grad_remove rồi thực hiện bước tối ưu. Ba khái niệm khác nhau: tensor có context autodiff, có tham gia đồ thị và có giữ gradient. Một tensor rank đúng vẫn có thể không đáp ứng điều kiện gọi require_grad. Lab dùng API0.22, không trộn kiểu Tensor<B,D> từ hướng dẫn cũ.",
          "code": "use burn::tensor::{Device, Tensor};\nlet device = Device::flex().autodiff();\nlet w = Tensor::<1>::from_floats([2.0], &device).require_grad();\nlet loss = w.clone().powf_scalar(2.0).sum();\nlet gradients = loss.backward();\nlet dw = w.grad(&gradients).unwrap().into_scalar::<f32>();\nassert!((dw - 4.0).abs() < 1e-6);"
        },
        {
          "title": "Mỗi bước có một vòng đời đồ thị",
          "text": "Backward tiêu thụ các bước đã ghi; clone handle không tạo một đồ thị độc lập để backward lại. Tính forward mới cho bước tiếp theo. Nếu giữ tensor loss của mọi batch trong một Vec, bạn có thể giữ tài nguyên không cần thiết; lưu số đo đã tách khỏi đồ thị khi chỉ cần báo cáo.\n\nLab khởi tạo graph mới cho mỗi bước và đọc hai gradient về CPU để nhìn rõ phép cập nhật. Đây là cách giảng thuật toán nhỏ, không phải thiết kế tối ưu cho huấn luyện lớn. Với mô hình nhiều tham số, dùng module và optimizer thay vì liên tục chuyển từng gradient về host. Khi dùng detach hoặc without_autodiff, phải hiểu kết nối gradient nào đang bị cắt."
        },
        {
          "title": "Loss giảm chưa chứng minh tổng quát hóa",
          "text": "Một mô hình có thể học thuộc train. Đọc loss trên validation, so với baseline và kiểm tra các nhóm dữ liệu; chọn tiêu chí dừng trước khi nhìn test. Khi loss hoặc gradient không hữu hạn, ghi cấu hình và batch gây lỗi rồi dừng; tiếp tục cập nhật bằng NaN chỉ che nguyên nhân.\n\nChế độ mô hình cũng ảnh hưởng kết quả. Module::valid tạo bản dùng cho đánh giá, tắt autodiff và cờ huấn luyện liên quan; giữ mô hình huấn luyện để tiếp tục học. Dropout và các lớp có trạng thái không thể được xử lý chỉ bằng việc bỏ backward. Kiểm thử một batch nhỏ, gradient bằng sai phân hữu hạn và fixture suy luận giúp tách lỗi thuật toán khỏi lỗi dữ liệu."
        }
      ],
      "tip": "Kiểm tra gradient trên vài số tính được bằng tay trước khi tăng dữ liệu hoặc độ sâu mô hình.",
      "exercise": {
        "title": "Một bước SGD có kiểm tra số học",
        "instructions": "Viết sgd_step trả về loss trước cập nhật cùng w,b mới. Cập nhật đồng thời từ gradient của cùng một bộ tham số ban đầu.",
        "requirements": [
          "x,y phải không rỗng và cùng độ dài; tất cả giá trị phải hữu hạn.",
          "learning rate phải hữu hạn và lớn hơn 0.",
          "Loss và hai gradient dùng trung bình trên toàn bộ batch.",
          "Trả lỗi nếu phép tính hoặc tham số mới trở thành số không hữu hạn."
        ]
      },
      "starterCode": "fn sgd_step(x: &[f64], y: &[f64], w: f64, b: f64, lr: f64) -> Result<(f64, f64, f64), &'static str> {\n    todo!()\n}\nfn main() {\n    let (loss, w, b) = sgd_step(&[1.0, 2.0], &[3.0, 5.0], 0.0, 0.0, 0.1).unwrap();\n    assert!((loss - 17.0).abs() < 1e-12);\n    assert!((w - 1.3).abs() < 1e-12);\n    assert!((b - 0.8).abs() < 1e-12);\n    let (zero, w2, b2) = sgd_step(&[1.0, 2.0], &[3.0, 5.0], 2.0, 1.0, 0.1).unwrap();\n    assert_eq!((zero, w2, b2), (0.0, 2.0, 1.0));\n    assert!(sgd_step(&[], &[], 0.0, 0.0, 0.1).is_err());\n    assert!(sgd_step(&[1.0], &[], 0.0, 0.0, 0.1).is_err());\n    assert!(sgd_step(&[f64::NAN], &[1.0], 0.0, 0.0, 0.1).is_err());\n    assert!(sgd_step(&[1.0], &[1.0], 0.0, 0.0, 0.0).is_err());\n    assert!(sgd_step(&[f64::MAX], &[0.0], 2.0, 0.0, 0.1).is_err());\n    println!(\"loss={loss:.1}; w={w:.1}, b={b:.1}\");\n}",
      "solutionCode": "fn sgd_step(x: &[f64], y: &[f64], w: f64, b: f64, lr: f64) -> Result<(f64, f64, f64), &'static str> {\n    if x.is_empty() || x.len() != y.len() { return Err(\"shape\"); }\n    if ![w, b, lr].iter().all(|v| v.is_finite()) || lr <= 0.0\n        || x.iter().chain(y).any(|v| !v.is_finite()) { return Err(\"input\"); }\n    let (mut loss, mut dw, mut db) = (0.0, 0.0, 0.0);\n    for (&xi, &yi) in x.iter().zip(y) {\n        let error = w * xi + b - yi;\n        loss += error * error;\n        dw += 2.0 * xi * error;\n        db += 2.0 * error;\n    }\n    let count = x.len() as f64;\n    loss /= count;\n    dw /= count;\n    db /= count;\n    let next_w = w - lr * dw;\n    let next_b = b - lr * db;\n    if ![loss, dw, db, next_w, next_b].iter().all(|v| v.is_finite()) {\n        return Err(\"overflow\");\n    }\n    Ok((loss, next_w, next_b))\n}\nfn main() {\n    let (loss, w, b) = sgd_step(&[1.0, 2.0], &[3.0, 5.0], 0.0, 0.0, 0.1).unwrap();\n    assert!((loss - 17.0).abs() < 1e-12);\n    assert!((w - 1.3).abs() < 1e-12);\n    assert!((b - 0.8).abs() < 1e-12);\n    let (zero, w2, b2) = sgd_step(&[1.0, 2.0], &[3.0, 5.0], 2.0, 1.0, 0.1).unwrap();\n    assert_eq!((zero, w2, b2), (0.0, 2.0, 1.0));\n    assert!(sgd_step(&[], &[], 0.0, 0.0, 0.1).is_err());\n    assert!(sgd_step(&[1.0], &[], 0.0, 0.0, 0.1).is_err());\n    assert!(sgd_step(&[f64::NAN], &[1.0], 0.0, 0.0, 0.1).is_err());\n    assert!(sgd_step(&[1.0], &[1.0], 0.0, 0.0, 0.0).is_err());\n    assert!(sgd_step(&[f64::MAX], &[0.0], 2.0, 0.0, 0.1).is_err());\n    println!(\"loss={loss:.1}; w={w:.1}, b={b:.1}\");\n}",
      "expectedOutput": "loss=17.0; w=1.3, b=0.8",
      "hints": [
        "Đặt error=w*x+b−y, cộng loss,error*x và error trên cả batch.",
        "Chia cả loss,dw,db cho cùng số mẫu.",
        "Không cập nhật w trong vòng lặp duyệt mẫu vì bài yêu cầu một bước full-batch."
      ],
      "quiz": {
        "question": "Bạn clone tensor loss rồi gọi backward hai lần trên cùng forward trong Burn 0.22. Điều nào đúng?",
        "options": [
          "Clone luôn tạo tape độc lập.",
          "Backward lần đầu tiêu thụ các bước; cần forward mới hoặc gộp các loss trước backward.",
          "Chỉ cần tăng learning rate.",
          "Không có tham số nào được giữ gradient."
        ],
        "correct": 1,
        "explanation": "Handle clone dùng chung các bước đã ghi. Việc tạo graph mới cho mỗi lần backward là một phần vòng đời huấn luyện."
      },
      "reference": {
        "label": "Burn Book: autodiff và vòng đời graph",
        "url": "https://burn.dev/books/burn/building-blocks/autodiff.html"
      },
      "localLab": {
        "title": "Burn: gradient thật và hồi quy trên CPU",
        "instructions": "Tạo dự án với các tệp dưới đây. Cần Rust 1.95 trở lên. Burn 0.22.1 dùng Flex thuần Rust, không cần GPU hay tải dữ liệu. Lab dùng full-batch SGD trên y=2x+1; hai giá trị−3 và 3 chỉ dùng để kiểm tra sau huấn luyện.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"burn-line-lab\"\nversion = \"0.1.0\"\nedition = \"2024\"\nrust-version = \"1.95\"\n\n[dependencies]\nburn = { version = \"=0.22.1\", default-features = false, features = [\"std\", \"flex\", \"autodiff\"] }\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use burn::tensor::{Device, Tensor};\n\n#[derive(Debug, Clone, Copy)]\npub struct Fit {\n    pub weight: f32,\n    pub bias: f32,\n    pub initial_loss: f32,\n    pub final_loss: f32,\n}\n\nfn validate(x: &[f32], y: &[f32], weight: f32, bias: f32) -> Result<(), String> {\n    if x.is_empty() || x.len() != y.len() || x.len() > 4096 {\n        return Err(\"shape: expected 1..=4096 paired samples\".into());\n    }\n    if x.iter().chain(y).any(|v| !v.is_finite()) || !weight.is_finite() || !bias.is_finite() {\n        return Err(\"non-finite input\".into());\n    }\n    Ok(())\n}\n\n/// Returns mean squared error, d(loss)/d(weight), d(loss)/d(bias).\n/// A fresh graph is constructed for every call.\npub fn loss_and_gradient(x: &[f32], y: &[f32], weight: f32, bias: f32) -> Result<(f32, f32, f32), String> {\n    validate(x, y, weight, bias)?;\n    let device = Device::flex().autodiff();\n    let input = Tensor::<1>::from_floats(x, &device);\n    let target = Tensor::<1>::from_floats(y, &device);\n    let w = Tensor::<1>::from_floats([weight], &device).require_grad();\n    let b = Tensor::<1>::from_floats([bias], &device).require_grad();\n    let residual = input * w.clone() + b.clone() - target;\n    let loss = residual.powf_scalar(2.0).mean();\n    let value = loss.clone().into_scalar::<f32>();\n    let gradients = loss.backward();\n    let dw = w.grad(&gradients).ok_or(\"missing weight gradient\")?.into_scalar::<f32>();\n    let db = b.grad(&gradients).ok_or(\"missing bias gradient\")?.into_scalar::<f32>();\n    if ![value, dw, db].iter().all(|v| v.is_finite()) {\n        return Err(\"non-finite loss or gradient\".into());\n    }\n    Ok((value, dw, db))\n}\n\n/// Inference/evaluation has no autodiff context.\npub fn mse(x: &[f32], y: &[f32], weight: f32, bias: f32) -> Result<f32, String> {\n    validate(x, y, weight, bias)?;\n    let device = Device::flex();\n    let input = Tensor::<1>::from_floats(x, &device);\n    let target = Tensor::<1>::from_floats(y, &device);\n    let residual = input * weight + bias - target;\n    let value = residual.powf_scalar(2.0).mean().into_scalar::<f32>();\n    if !value.is_finite() { return Err(\"non-finite loss\".into()); }\n    Ok(value)\n}\n\n/// Tiny fixed full-batch experiment: y = 2*x + 1.\npub fn train_line(steps: usize, learning_rate: f32) -> Result<Fit, String> {\n    if steps == 0 || steps > 5000 || !learning_rate.is_finite()\n        || learning_rate <= 0.0 || learning_rate > 0.2 {\n        return Err(\"invalid training configuration\".into());\n    }\n    let x = [-2.0, -1.0, 0.0, 1.0, 2.0];\n    let y = [-3.0, -1.0, 1.0, 3.0, 5.0];\n    let (mut weight, mut bias) = (0.0_f32, 0.0_f32);\n    let initial_loss = mse(&x, &y, weight, bias)?;\n    for _ in 0..steps {\n        let (_, dw, db) = loss_and_gradient(&x, &y, weight, bias)?;\n        weight -= learning_rate * dw;\n        bias -= learning_rate * db;\n        if !weight.is_finite() || !bias.is_finite() {\n            return Err(\"non-finite parameter\".into());\n        }\n    }\n    let final_loss = mse(&x, &y, weight, bias)?;\n    Ok(Fit { weight, bias, initial_loss, final_loss })\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use burn_line_lab::train_line;\nfn main() -> Result<(), String> {\n    let fit = train_line(150, 0.05)?;\n    println!(\"w={:.4}, b={:.4}\", fit.weight, fit.bias);\n    println!(\"loss {:.6} -> {:.6}\", fit.initial_loss, fit.final_loss);\n    Ok(())\n}\n"
          },
          {
            "path": "tests/training.rs",
            "content": "use burn_line_lab::{loss_and_gradient, mse, train_line};\n\nfn close(actual: f32, expected: f32, tolerance: f32) {\n    assert!((actual - expected).abs() <= tolerance, \"{actual} != {expected}\");\n}\n\n#[test]\nfn gradients_match_hand_calculation() {\n    let (loss, dw, db) = loss_and_gradient(&[1.0, 2.0], &[3.0, 5.0], 0.0, 0.0).unwrap();\n    close(loss, 17.0, 1e-5);\n    close(dw, -13.0, 1e-5);\n    close(db, -8.0, 1e-5);\n}\n\n#[test]\nfn gradient_matches_finite_difference() {\n    let x = [-1.0, 0.0, 2.0];\n    let y = [-1.0, 1.0, 5.0];\n    let (_, dw, _) = loss_and_gradient(&x, &y, 0.7, 0.2).unwrap();\n    let epsilon = 0.001;\n    let numerical = (mse(&x, &y, 0.7 + epsilon, 0.2).unwrap()\n        - mse(&x, &y, 0.7 - epsilon, 0.2).unwrap()) / (2.0 * epsilon);\n    close(dw, numerical, 0.003);\n}\n\n#[test]\nfn fixed_dataset_converges_and_generalizes_to_held_out_values() {\n    let fit = train_line(150, 0.05).unwrap();\n    close(fit.weight, 2.0, 1e-4);\n    close(fit.bias, 1.0, 1e-4);\n    assert!(fit.final_loss < fit.initial_loss);\n    assert!(mse(&[-3.0, 3.0], &[-5.0, 7.0], fit.weight, fit.bias).unwrap() < 1e-7);\n}\n\n#[test]\nfn invalid_data_is_rejected() {\n    assert!(loss_and_gradient(&[], &[], 0.0, 0.0).is_err());\n    assert!(loss_and_gradient(&[1.0], &[1.0, 2.0], 0.0, 0.0).is_err());\n    assert!(loss_and_gradient(&[f32::NAN], &[1.0], 0.0, 0.0).is_err());\n    assert!(mse(&[f32::MAX], &[0.0], 2.0, 0.0).is_err());\n}\n\n#[test]\nfn invalid_configuration_is_rejected() {\n    assert!(train_line(0, 0.05).is_err());\n    assert!(train_line(10, f32::NAN).is_err());\n    assert!(train_line(10, -0.1).is_err());\n    assert!(train_line(5001, 0.05).is_err());\n}\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run --release",
          "cargo tree -e features"
        ],
        "checks": [
          "Gradient trên [1, 2] khớp phép tính tay và sai phân hữu hạn trong dung sai.",
          "Sau 150 bước, w gần 2 và b gần 1; sai số trên hai điểm giữ lại nhỏ hơn 1e−7.",
          "Dữ liệu rỗng, lệch shape, NaN và cấu hình không hợp lệ trả lỗi.",
          "Đọc cây feature để xác nhận không bật CUDA, Metal hay WGPU; lưu Cargo.lock sau khi resolve."
        ]
      }
    },
    {
      "id": "ai-candle-inference",
      "moduleId": "track-ai",
      "title": "Suy luận và artifact với Candle",
      "description": "Chạy mô hình CPU có kiểm tra shape, softmax ổn định và phép lưu–nạp trọng số được đối chiếu bằng test.",
      "duration": 65,
      "objectives": [
        "Tách suy luận khỏi cập nhật trọng số",
        "Dùng Candle để nhân tensor và tính softmax theo từng mẫu",
        "Lưu–nạp SafeTensors với tên, dtype và shape rõ ràng",
        "Kiểm chứng artifact bằng fixture và giới hạn đầu vào"
      ],
      "sections": [
        {
          "title": "Suy luận là thực thi một hợp đồng đã khóa",
          "text": "Inference nhận dữ liệu đã tiền xử lý và dùng tham số cố định để tạo đầu ra. Không cần optimizer hoặc backward. Trước khi phục vụ, phải biết phiên bản đặc trưng, chiều ma trận, nhãn đầu ra và phép hậu xử lý. Tên tệp model.safetensors tự nó không mang đủ các quyết định ấy.\n\nLab dùng bộ phân loại tuyến tính hai đặc trưng, hai lớp. Trọng số mẫu được đặt trực tiếp để đối chiếu phép tính, không được gọi là mô hình đã huấn luyện trên dữ liệu thật. Candle thực hiện XW+b bằng tensor CPU. Kiểm thử so sánh kết quả với công thức độc lập, thay vì chỉ xác nhận hàm không trả lỗi."
        },
        {
          "title": "Logit và xác suất cần được phân biệt",
          "text": "Logit là điểm số trước chuẩn hóa. Softmax lấy exp từng điểm rồi chia tổng, nhưng exp(1000) có thể tràn số. Trừ điểm lớn nhất trong từng hàng trước khi lấy exp giữ nguyên tỷ lệ và tránh tràn ở trường hợp phổ biến. Trục softmax phải là trục lớp, không phải trục batch.\n\nMột phần tử softmax lớn không chứng minh mô hình được hiệu chuẩn hoặc đầu vào thuộc phân phối đã học. Nếu dữ liệu ngoài miền, mô hình vẫn có thể tạo điểm rất tự tin. Bài tập kiểm tra tổng xác suất, tính bất biến khi cộng cùng hằng số và đầu vào không hữu hạn. Serving cần chính sách xử lý lỗi rõ trước khi trả kết quả.",
          "code": "// Candle: mỗi hàng là một mẫu, mỗi cột là một lớp.\nlet logits = input.matmul(&weights)?.broadcast_add(&bias)?;\nlet shifted = logits.broadcast_sub(&logits.max_keepdim(1)?)?;\nlet exp = shifted.exp()?;\nlet probabilities = exp.broadcast_div(&exp.sum_keepdim(1)?)?;"
        },
        {
          "title": "Artifact phải chứa đúng bộ tensor",
          "text": "SafeTensors lưu tensor cùng thông tin shape và dtype; kiến trúc, tiền xử lý và ý nghĩa nhãn vẫn cần hợp đồng riêng. Khi nạp, kiểm tra đủ tên tensor, đúng shape, đúng dtype và không có trọng số NaN. Chuyển framework còn cần đối chiếu chiều trọng số: hai lớp Linear có thể tổ chức ma trận khác nhau.\n\nLab lưu đúng linear.weight và linear.bias, đọc tệp có giới hạn rồi kiểm tra cấu trúc. Nó chỉ nạp artifact do chính bài thực hành tạo. Định dạng không thực thi pickle không thay thế việc xác minh nguồn, giấy phép hoặc chất lượng mô hình. Với sản phẩm, ghim phiên bản artifact và kiểm tra hash từ nguồn phát hành đáng tin cậy."
        },
        {
          "title": "Kiểm chứng trước khi đưa vào phục vụ",
          "text": "Giữ một bộ fixture gồm đầu vào gốc, vector sau tiền xử lý và đầu ra mong đợi. Chạy lại trước và sau serialization, khi nâng thư viện, đổi backend hoặc hạ độ chính xác. Chọn dung sai theo mục tiêu; kiểm tra cả thứ tự lớp và tổng xác suất, không chỉ xem vài chữ số in ra.\n\nNạp mô hình một lần khi khởi động rồi tái sử dụng. Áp giới hạn batch trước khi tạo tensor để tránh một request chiếm hết bộ nhớ. Nếu mô hình ứng viên không qua kiểm tra, giữ bản hiện tại. Tách thời gian nạp artifact, tiền xử lý, tính toán và truyền đầu ra để biết phần nào cần tối ưu."
        }
      ],
      "tip": "So sánh dự đoán trước và sau lưu–nạp trên cùng fixture; tệp đọc được chưa chứng minh trọng số được gắn đúng lớp.",
      "exercise": {
        "title": "Softmax ổn định cho một mẫu",
        "instructions": "Hoàn thiện softmax để xử lý logits lớn mà không tính exp trực tiếp trên giá trị lớn nhất.",
        "requirements": [
          "Từ chối danh sách rỗng, NaN và vô cực.",
          "Trừ max khỏi từng logit trước exp, sau đó chia tổng.",
          "Giữ thứ tự các lớp và trả Vec<f64>.",
          "Kết quả không thay đổi khi cộng cùng một hằng số hữu hạn vào các logits trong miền biểu diễn phù hợp."
        ]
      },
      "starterCode": "fn softmax(logits: &[f64]) -> Result<Vec<f64>, &'static str> {\n    todo!()\n}\nfn main() {\n    let p = softmax(&[1000.0, 1001.0]).unwrap();\n    assert!((p.iter().sum::<f64>() - 1.0).abs() < 1e-12);\n    assert!(p[1] > p[0]);\n    let shifted = softmax(&[0.0, 1.0]).unwrap();\n    assert!((p[0] - shifted[0]).abs() < 1e-12);\n    assert_eq!(softmax(&[7.0]).unwrap(), vec![1.0]);\n    assert_eq!(softmax(&[-1000.0, 1000.0]).unwrap(), vec![0.0, 1.0]);\n    assert!(softmax(&[]).is_err());\n    assert!(softmax(&[f64::NAN]).is_err());\n    assert!(softmax(&[f64::INFINITY, 0.0]).is_err());\n    println!(\"p0={:.6}, p1={:.6}\", p[0], p[1]);\n}",
      "solutionCode": "fn softmax(logits: &[f64]) -> Result<Vec<f64>, &'static str> {\n    if logits.is_empty() || logits.iter().any(|x| !x.is_finite()) {\n        return Err(\"invalid logits\");\n    }\n    let max = logits.iter().copied().fold(f64::NEG_INFINITY, f64::max);\n    let mut values: Vec<f64> = logits.iter().map(|x| (x - max).exp()).collect();\n    let sum: f64 = values.iter().sum();\n    if !sum.is_finite() || sum <= 0.0 { return Err(\"invalid sum\"); }\n    for value in &mut values { *value /= sum; }\n    Ok(values)\n}\nfn main() {\n    let p = softmax(&[1000.0, 1001.0]).unwrap();\n    assert!((p.iter().sum::<f64>() - 1.0).abs() < 1e-12);\n    assert!(p[1] > p[0]);\n    let shifted = softmax(&[0.0, 1.0]).unwrap();\n    assert!((p[0] - shifted[0]).abs() < 1e-12);\n    assert_eq!(softmax(&[7.0]).unwrap(), vec![1.0]);\n    assert_eq!(softmax(&[-1000.0, 1000.0]).unwrap(), vec![0.0, 1.0]);\n    assert!(softmax(&[]).is_err());\n    assert!(softmax(&[f64::NAN]).is_err());\n    assert!(softmax(&[f64::INFINITY, 0.0]).is_err());\n    println!(\"p0={:.6}, p1={:.6}\", p[0], p[1]);\n}",
      "expectedOutput": "p0=0.268941, p1=0.731059",
      "hints": [
        "Giá trị exp lớn nhất sau khi trừ max sẽ bằng 1.",
        "Underflow của exp ở logit rất nhỏ có thể cho0; điều này khác với overflow thành vô cực.",
        "Trừ cùng max cho mọi lớp trong một mẫu, không dùng max của toàn bộ batch."
      ],
      "quiz": {
        "question": "SafeTensors chứa đúng shape và đọc được. Bạn còn phải kiểm tra gì trước khi dùng ở serving?",
        "options": [
          "Không cần kiểm tra thêm vì định dạng đã chứng minh độ chính xác.",
          "Tên và chiều tensor, schema tiền xử lý, nhãn, nguồn artifact và fixture đầu ra.",
          "Chỉ kích thước tệp nhỏ hơn phiên bản cũ.",
          "Chỉ số lượng request từng phút."
        ],
        "correct": 1,
        "explanation": "Artifact có cấu trúc hợp lệ chưa bảo đảm đúng kiến trúc, đúng phiên bản đặc trưng hoặc giữ nguyên dự đoán. Cần kiểm chứng cả hợp đồng mô hình."
      },
      "reference": {
        "label": "Candle: SafeTensors",
        "url": "https://docs.rs/candle-core/latest/candle_core/safetensors/index.html"
      },
      "localLab": {
        "title": "Candle: bộ phân loại CPU và SafeTensors",
        "instructions": "Tạo dự án với các tệp bên dưới. Lab chỉ dùng Candle core trên CPU và trọng số mẫu tự tạo, không tải model ngoài. Lệnh chạy tạo artifacts/model.safetensors rồi nạp lại; định nghĩa hai đặc trưng và hai lớp được cố định trong mã để dễ đối chiếu.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"candle-inference-lab\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\ncandle-core = { version = \"=0.11.1\", default-features = false }\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use candle_core::{safetensors, DType, Device, Error, Result, Tensor};\nuse std::{collections::HashMap, fs::File, io::Read, path::Path};\n\npub const MAX_ARTIFACT_BYTES: usize = 1024 * 1024;\npub const MAX_BATCH: usize = 64;\n\nfn invalid(message: &str) -> Error { Error::Msg(message.to_owned()) }\n\n#[derive(Clone)]\npub struct LinearClassifier {\n    weights: Tensor, // [features=2, classes=2]\n    bias: Tensor,    // [classes=2]\n}\n\nimpl LinearClassifier {\n    pub fn new(weights: Tensor, bias: Tensor) -> Result<Self> {\n        if weights.dims() != [2, 2] || bias.dims() != [2] {\n            return Err(invalid(\"expected weights[2,2] and bias[2]\"));\n        }\n        if weights.dtype() != DType::F32 || bias.dtype() != DType::F32 {\n            return Err(invalid(\"expected f32 weights\"));\n        }\n        let w = weights.flatten_all()?.to_vec1::<f32>()?;\n        let b = bias.to_vec1::<f32>()?;\n        if w.iter().chain(&b).any(|x| !x.is_finite()) {\n            return Err(invalid(\"non-finite weights\"));\n        }\n        Ok(Self { weights, bias })\n    }\n\n    pub fn demo() -> Result<Self> {\n        let device = Device::Cpu;\n        Self::new(\n            Tensor::new(&[[1.0_f32, -1.0], [-1.0, 1.0]], &device)?,\n            Tensor::new(&[0.25_f32, -0.25], &device)?,\n        )\n    }\n\n    /// Input [batch, 2] -> probabilities [batch, 2].\n    pub fn predict(&self, rows: &[[f32; 2]]) -> Result<Vec<[f32; 2]>> {\n        if rows.is_empty() || rows.len() > MAX_BATCH {\n            return Err(invalid(\"batch must contain 1..=64 rows\"));\n        }\n        if rows.iter().flatten().any(|x| !x.is_finite()) {\n            return Err(invalid(\"non-finite feature\"));\n        }\n        let flat: Vec<f32> = rows.iter().flatten().copied().collect();\n        let input = Tensor::from_vec(flat, (rows.len(), 2), &Device::Cpu)?;\n        let logits = input.matmul(&self.weights)?.broadcast_add(&self.bias)?;\n        // Subtract the per-row maximum before exp to avoid overflow.\n        let shifted = logits.broadcast_sub(&logits.max_keepdim(1)?)?;\n        let exp = shifted.exp()?;\n        let probabilities = exp.broadcast_div(&exp.sum_keepdim(1)?)?;\n        let values = probabilities.to_vec2::<f32>()?;\n        if values.iter().flatten().any(|v| !v.is_finite()) {\n            return Err(invalid(\"non-finite prediction\"));\n        }\n        Ok(values.into_iter().map(|row| [row[0], row[1]]).collect())\n    }\n\n    pub fn save(&self, path: &Path) -> Result<()> {\n        let tensors = HashMap::from([\n            (\"linear.weight\".to_owned(), self.weights.clone()),\n            (\"linear.bias\".to_owned(), self.bias.clone()),\n        ]);\n        safetensors::save(&tensors, path)\n    }\n\n    /// The exercise only loads its own generated artifact.\n    /// A bounded read also handles files that grow after opening.\n    pub fn load(path: &Path) -> Result<Self> {\n        let file = File::open(path)?;\n        let mut bytes = Vec::new();\n        file.take((MAX_ARTIFACT_BYTES + 1) as u64).read_to_end(&mut bytes)?;\n        if bytes.len() > MAX_ARTIFACT_BYTES {\n            return Err(invalid(\"artifact exceeds 1 MiB\"));\n        }\n        let mut tensors = safetensors::load_buffer(&bytes, &Device::Cpu)?;\n        if tensors.len() != 2 { return Err(invalid(\"expected exactly two tensors\")); }\n        let weights = tensors.remove(\"linear.weight\").ok_or_else(|| invalid(\"missing linear.weight\"))?;\n        let bias = tensors.remove(\"linear.bias\").ok_or_else(|| invalid(\"missing linear.bias\"))?;\n        Self::new(weights, bias)\n    }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use candle_core::Result;\nuse candle_inference_lab::LinearClassifier;\nuse std::{fs, path::Path};\nfn main() -> Result<()> {\n    fs::create_dir_all(\"artifacts\")?;\n    let path = Path::new(\"artifacts/model.safetensors\");\n    LinearClassifier::demo()?.save(path)?;\n    let model = LinearClassifier::load(path)?;\n    for (index, row) in model.predict(&[[2.0, 1.0], [1.0, 2.0]])?.iter().enumerate() {\n        println!(\"sample{index}: {:.6} {:.6}\", row[0], row[1]);\n    }\n    Ok(())\n}\n"
          },
          {
            "path": "tests/inference.rs",
            "content": "use candle_core::{safetensors, Device, Tensor};\nuse candle_inference_lab::{LinearClassifier, MAX_ARTIFACT_BYTES, MAX_BATCH};\nuse std::{collections::HashMap, fs, path::PathBuf, sync::atomic::{AtomicU64, Ordering}, time::{SystemTime, UNIX_EPOCH}};\n\nstruct TempDirectory(PathBuf);\nimpl TempDirectory {\n    fn new() -> Self {\n        static SEQUENCE: AtomicU64 = AtomicU64::new(0);\n        let stamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos();\n        let path = std::env::temp_dir().join(format!(\"candle-lab-{}-{stamp}-{}\", std::process::id(), SEQUENCE.fetch_add(1, Ordering::Relaxed)));\n        fs::create_dir(&path).unwrap();\n        Self(path)\n    }\n    fn model(&self) -> PathBuf { self.0.join(\"model.safetensors\") }\n}\nimpl Drop for TempDirectory {\n    fn drop(&mut self) { let _ = fs::remove_dir_all(&self.0); }\n}\n\n#[test]\nfn probabilities_match_reference_calculation() {\n    let out = LinearClassifier::demo().unwrap().predict(&[[2.0, 1.0], [1.0, 2.0]]).unwrap();\n    let expected = [1.0_f32 / (1.0 + (-2.5_f32).exp()), 1.0 / (1.0 + 1.5_f32.exp())];\n    for (row, expected_first) in out.iter().zip(expected) {\n        assert!((row[0] - expected_first).abs() < 1e-6);\n        assert!((row[0] + row[1] - 1.0).abs() < 1e-6);\n    }\n}\n\n#[test]\nfn safetensors_roundtrip_preserves_predictions() {\n    let dir = TempDirectory::new();\n    let original = LinearClassifier::demo().unwrap();\n    original.save(&dir.model()).unwrap();\n    let restored = LinearClassifier::load(&dir.model()).unwrap();\n    let input = [[-2.0, 3.0], [0.0, 0.0], [5.0, 1.0]];\n    let expected = original.predict(&input).unwrap();\n    let actual = restored.predict(&input).unwrap();\n    for (a, b) in actual.iter().flatten().zip(expected.iter().flatten()) {\n        assert!((a - b).abs() < 1e-6);\n    }\n}\n\n#[test]\nfn shape_dtype_and_nonfinite_weights_are_rejected() {\n    let device = Device::Cpu;\n    let bias = Tensor::new(&[0.0_f32, 0.0], &device).unwrap();\n    let wrong_shape = Tensor::new(&[[1.0_f32, 2.0]], &device).unwrap();\n    assert!(LinearClassifier::new(wrong_shape, bias.clone()).is_err());\n    let wrong_dtype = Tensor::new(&[[1_u32, 2], [3, 4]], &device).unwrap();\n    assert!(LinearClassifier::new(wrong_dtype, bias.clone()).is_err());\n    let nonfinite = Tensor::new(&[[f32::NAN, 0.0], [0.0, 0.0]], &device).unwrap();\n    assert!(LinearClassifier::new(nonfinite, bias).is_err());\n}\n\n#[test]\nfn invalid_batches_are_rejected() {\n    let model = LinearClassifier::demo().unwrap();\n    assert!(model.predict(&[]).is_err());\n    assert!(model.predict(&vec![[0.0, 0.0]; MAX_BATCH + 1]).is_err());\n    assert!(model.predict(&[[f32::INFINITY, 0.0]]).is_err());\n    assert!(model.predict(&[[f32::MAX, -f32::MAX]]).is_err());\n}\n\n#[test]\nfn malformed_and_incomplete_artifacts_are_rejected() {\n    let dir = TempDirectory::new();\n    fs::write(dir.model(), b\"invalid safetensors\").unwrap();\n    assert!(LinearClassifier::load(&dir.model()).is_err());\n    let only_weight = HashMap::from([(\"linear.weight\", Tensor::new(&[[1.0_f32, 0.0], [0.0, 1.0]], &Device::Cpu).unwrap())]);\n    safetensors::save(&only_weight, dir.model()).unwrap();\n    assert!(LinearClassifier::load(&dir.model()).is_err());\n}\n\n#[test]\nfn oversized_artifact_is_rejected_before_parsing() {\n    let dir = TempDirectory::new();\n    fs::write(dir.model(), vec![0_u8; MAX_ARTIFACT_BYTES + 1]).unwrap();\n    assert!(LinearClassifier::load(&dir.model()).is_err());\n}\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run --release",
          "cargo tree -e features"
        ],
        "checks": [
          "Dự đoán khớp công thức tham chiếu và tổng hai xác suất gần 1 trong dung sai1e−6.",
          "Lưu–nạp SafeTensors giữ nguyên dự đoán trên ba fixture.",
          "Sai shape, sai dtype, trọng số NaN, batch rỗng/quá 64 hoặc đầu vào không hữu hạn bị từ chối.",
          "Artifact hỏng, thiếu tensor hoặc lớn hơn1 MiB không được nạp; test tạo thư mục tạm riêng và tự dọn."
        ]
      }
    },
    {
      "id": "ai-evaluation",
      "moduleId": "track-ai",
      "title": "Đánh giá mô hình và chọn ngưỡng",
      "description": "Đọc confusion matrix, chọn metric theo mục tiêu và tránh kết luận từ một điểm số đẹp.",
      "duration": 50,
      "objectives": [
        "Tính precision và recall từ các nhóm dự đoán",
        "Xử lý metric có mẫu số bằng 0 bằng kiểu Option",
        "Chọn ngưỡng trên validation rồi giữ nguyên khi đánh giá test",
        "So sánh baseline và báo cáo kết quả theo nhóm dữ liệu"
      ],
      "sections": [
        {
          "title": "Từ dự đoán đến bảng đếm",
          "text": "Với phân loại nhị phân, true positive là mẫu dương được dự đoán dương; false positive là mẫu âm bị dự đoán dương. False negative bỏ sót mẫu dương, còn true negative nhận đúng mẫu âm. Luôn ghi lớp nào được xem là dương để tránh đổi ý nghĩa metric khi đảo nhãn.\n\nPrecision=TP/(TP+FP) trả lời bao nhiêu dự đoán dương là đúng. Recall=TP/(TP+FN) trả lời đã tìm được bao nhiêu mẫu dương thật. Khi mẫu số bằng 0, kết quả không xác định theo định nghĩa này. API bài tập trả Option thay vì lặng lẽ in 100% hoặc0%; báo cáo cần nêu quy ước nếu sản phẩm chọn một giá trị thay thế."
        },
        {
          "title": "Ngưỡng là quyết định của hệ thống",
          "text": "Một score và một quyết định không giống nhau. Dùng score≥threshold tạo nhãn dương trong bài tập; quy tắc bằng ngưỡng được viết rõ để test không phụ thuộc cách suy đoán. Tăng ngưỡng thường giảm số cảnh báo nhưng có thể tăng bỏ sót. Hãy liên hệ lựa chọn với chi phí của từng loại lỗi.\n\nChọn ngưỡng trên validation, hoặc quy trình cross-validation phù hợp, rồi khóa trước khi đọc test. Không tìm ngưỡng cho điểm test cao nhất và gọi đó là hiệu năng độc lập. Nếu yêu cầu có recall tối thiểu, hãy xét số mẫu, độ bất định và khả năng duy trì yêu cầu khi phân phối thay đổi; một bảng nhỏ chưa đủ chứng minh cam kết dài hạn."
        },
        {
          "title": "Baseline và mất cân bằng lớp",
          "text": "Giả sử 990 trong 1.000 mẫu là âm. Mô hình luôn trả âm đạt 99% accuracy nhưng không tìm thấy mẫu dương nào. So sánh baseline này với mô hình học được, báo cáo số mẫu mỗi lớp và các loại lỗi. Một metric tổng hợp có thể che nhóm hoạt động kém, đặc biệt khi kích thước các nhóm chênh lệch.\n\nVới hồi quy, đọc cả đơn vị của MAE hoặc RMSE; sai số 2 chỉ có nghĩa khi biết đó là hai giây hay hai kilômét. Giữ baseline đơn giản để phát hiện pipeline phức tạp không tạo giá trị. Đừng thay metric sau khi thấy kết quả chỉ nhằm làm phiên bản mới trông tốt hơn."
        },
        {
          "title": "Đánh giá cả phần mềm lẫn mô hình",
          "text": "Test phần mềm bảo vệ hợp đồng: shape, nhãn, trường hợp rỗng, metric và artifact. Đánh giá mô hình đo hành vi trên dữ liệu chưa dùng để lựa chọn. Hai việc hỗ trợ nhau nhưng không thay thế nhau. Mọi assertion đều qua không chứng minh mô hình tổng quát hóa; metric tốt không chứng minh endpoint chịu được đầu vào lỗi.\n\nLưu dự đoán cùng ID mẫu và phiên bản mô hình để phân tích sai sót có thể tái hiện. Kiểm tra nhóm thiết bị, thời gian hoặc miền giá trị; xem mẫu lỗi thay vì chỉ đọc trung bình. Nếu nhãn đến muộn, tách metric chất lượng có nhãn khỏi chỉ số vận hành tức thời như latency, số request bị từ chối và dữ liệu thiếu.",
          "code": "// Các score này dùng quy tắc score >= 0.5.\n// Nhãn:  T F T T F F\n// Score: .9 .8 .7 .4 .2 .1\n// TP=2, FP=1, FN=1, TN=2\n// precision=2/3, recall=2/3"
        }
      ],
      "tip": "Mỗi bảng metric nên ghi số mẫu, lớp dương, ngưỡng và phiên bản tập đánh giá.",
      "exercise": {
        "title": "Confusion matrix không che trường hợp chưa xác định",
        "instructions": "Viết evaluate và hai method metric. Dùng score≥threshold làm quy tắc phân loại và Option<f64> khi không có mẫu số.",
        "requirements": [
          "labels,scores phải không rỗng, cùng độ dài.",
          "Score và threshold phải hữu hạn trong [0, 1].",
          "Đếm đúng TP,FP,FN,TN; score bằng ngưỡng được xem là dương.",
          "precision/recall trả None nếu mẫu số tương ứng bằng 0."
        ]
      },
      "starterCode": "#[derive(Debug, Default)]\nstruct Confusion { tp: usize, fp: usize, fn_: usize, tn: usize }\nimpl Confusion {\n    fn precision(&self) -> Option<f64> { todo!() }\n    fn recall(&self) -> Option<f64> { todo!() }\n}\nfn evaluate(labels: &[bool], scores: &[f64], threshold: f64) -> Result<Confusion, &'static str> {\n    todo!()\n}\nfn main() {\n    let labels = [true, false, true, true, false, false];\n    let scores = [0.9, 0.8, 0.7, 0.4, 0.2, 0.1];\n    let c = evaluate(&labels, &scores, 0.5).unwrap();\n    assert_eq!((c.tp, c.fp, c.fn_, c.tn), (2, 1, 1, 2));\n    assert!((c.precision().unwrap() - 2.0 / 3.0).abs() < 1e-12);\n    assert!((c.recall().unwrap() - 2.0 / 3.0).abs() < 1e-12);\n    let undefined = evaluate(&[false, false], &[0.1, 0.2], 0.5).unwrap();\n    assert_eq!(undefined.precision(), None);\n    assert_eq!(undefined.recall(), None);\n    assert_eq!(evaluate(&[true], &[0.5], 0.5).unwrap().tp, 1);\n    assert!(evaluate(&[], &[], 0.5).is_err());\n    assert!(evaluate(&[true], &[], 0.5).is_err());\n    assert!(evaluate(&[true], &[f64::NAN], 0.5).is_err());\n    assert!(evaluate(&[true], &[1.1], 0.5).is_err());\n    assert!(evaluate(&[true], &[0.5], -0.1).is_err());\n    println!(\"TP={} FP={} FN={}; precision={:.3} recall={:.3}\", c.tp, c.fp, c.fn_, c.precision().unwrap(), c.recall().unwrap());\n}",
      "solutionCode": "#[derive(Debug, Default)]\nstruct Confusion { tp: usize, fp: usize, fn_: usize, tn: usize }\nimpl Confusion {\n    fn precision(&self) -> Option<f64> {\n        let total = self.tp + self.fp;\n        (total != 0).then(|| self.tp as f64 / total as f64)\n    }\n    fn recall(&self) -> Option<f64> {\n        let total = self.tp + self.fn_;\n        (total != 0).then(|| self.tp as f64 / total as f64)\n    }\n}\nfn evaluate(labels: &[bool], scores: &[f64], threshold: f64) -> Result<Confusion, &'static str> {\n    if labels.is_empty() || labels.len() != scores.len() { return Err(\"shape\"); }\n    if !threshold.is_finite() || !(0.0..=1.0).contains(&threshold)\n        || scores.iter().any(|s| !s.is_finite() || !(0.0..=1.0).contains(s)) {\n        return Err(\"score\");\n    }\n    let mut c = Confusion::default();\n    for (&actual, &score) in labels.iter().zip(scores) {\n        match (actual, score >= threshold) {\n            (true, true) => c.tp += 1,\n            (false, true) => c.fp += 1,\n            (true, false) => c.fn_ += 1,\n            (false, false) => c.tn += 1,\n        }\n    }\n    Ok(c)\n}\nfn main() {\n    let labels = [true, false, true, true, false, false];\n    let scores = [0.9, 0.8, 0.7, 0.4, 0.2, 0.1];\n    let c = evaluate(&labels, &scores, 0.5).unwrap();\n    assert_eq!((c.tp, c.fp, c.fn_, c.tn), (2, 1, 1, 2));\n    assert!((c.precision().unwrap() - 2.0 / 3.0).abs() < 1e-12);\n    assert!((c.recall().unwrap() - 2.0 / 3.0).abs() < 1e-12);\n    let undefined = evaluate(&[false, false], &[0.1, 0.2], 0.5).unwrap();\n    assert_eq!(undefined.precision(), None);\n    assert_eq!(undefined.recall(), None);\n    assert_eq!(evaluate(&[true], &[0.5], 0.5).unwrap().tp, 1);\n    assert!(evaluate(&[], &[], 0.5).is_err());\n    assert!(evaluate(&[true], &[], 0.5).is_err());\n    assert!(evaluate(&[true], &[f64::NAN], 0.5).is_err());\n    assert!(evaluate(&[true], &[1.1], 0.5).is_err());\n    assert!(evaluate(&[true], &[0.5], -0.1).is_err());\n    println!(\"TP={} FP={} FN={}; precision={:.3} recall={:.3}\", c.tp, c.fp, c.fn_, c.precision().unwrap(), c.recall().unwrap());\n}",
      "expectedOutput": "TP=2 FP=1 FN=1; precision=0.667 recall=0.667",
      "hints": [
        "Đặt actual và predicted thành một cặp bool rồi match bốn trường hợp.",
        "Precision có mẫu số là tất cả dự đoán dương; recall có mẫu số là tất cả mẫu dương thật.",
        "Kiểm tra NaN trước khi dùng so sánh số thực."
      ],
      "quiz": {
        "question": "Mô hình luôn dự đoán âm đạt 99% accuracy trên tập có 99% mẫu âm. Kết luận nào hợp lý?",
        "options": [
          "Mô hình đã sẵn sàng triển khai vì accuracy vượt 95%.",
          "Cần so với baseline, đọc recall của lớp dương và chi phí lỗi trước khi kết luận.",
          "Tăng ngưỡng lên 1 sẽ tự sửa mất cân bằng.",
          "Không cần tập validation nữa."
        ],
        "correct": 1,
        "explanation": "Accuracy bị chi phối bởi lớp phổ biến. Mô hình này có recall lớp dương bằng 0 nếu tập có mẫu dương, nên phải đánh giá theo mục tiêu thực tế."
      },
      "reference": {
        "label": "scikit-learn: metric và scoring",
        "url": "https://scikit-learn.org/stable/modules/model_evaluation.html"
      }
    },
    {
      "id": "ai-serving",
      "moduleId": "track-ai",
      "title": "Phục vụ mô hình, đo tải và phát hành",
      "description": "Đưa suy luận vào một dịch vụ có giới hạn batch, số đo đúng và cơ chế đổi phiên bản có thể quay lại.",
      "duration": 60,
      "objectives": [
        "Giới hạn đầu vào, batch và số tác vụ suy luận đồng thời",
        "Tính chi phí padding khi ghép chuỗi có độ dài khác nhau",
        "Đo latency, throughput và chất lượng sau thay đổi độ chính xác",
        "Thiết kế kích hoạt mô hình mới và rollback"
      ],
      "sections": [
        {
          "title": "Giới hạn công việc trước khi cấp phát tensor",
          "text": "Endpoint phải kiểm tra phiên bản schema, độ dài, số đặc trưng và giá trị không hữu hạn trước khi tạo batch. Giới hạn request body không thay thế giới hạn tensor sau giải mã. Một đầu vào ngắn có thể yêu cầu shape rất lớn nếu API cho client tự gửi kích thước.\n\nSuy luận CPU đồng bộ không nên chiếm worker I/O của runtime. Dùng nhóm worker hoặc spawn_blocking có giới hạn concurrency, thêm hàng đợi hữu hạn và chính sách quá tải. Timeout của HTTP không tự dừng một phép tính blocking đã chạy. Hãy giới hạn công việc mỗi tác vụ và quyết định rõ cách xử lý kết quả khi client đã rời đi; tránh tạo công việc vô hạn phía sau một timeout."
        },
        {
          "title": "Batching có chi phí chờ và padding",
          "text": "Gộp nhiều mẫu có thể tận dụng thiết bị tốt hơn, nhưng mẫu đầu tiên phải đợi các mẫu đến sau. Đặt cả số mục tối đa và thời gian chờ tối đa. Với chuỗi dài khác nhau, padding làm chi phí dữ liệu phụ thuộc độ dài lớn nhất nhân số mẫu, không chỉ tổng độ dài gốc.\n\nBài tập giữ thứ tự và chia batch theo ngân sách padded tokens. Đây là một giới hạn cho tensor đầu vào; nó chưa mô tả toàn bộ bộ nhớ của mọi mô hình. Attention, tensor trung gian và cache có thể cần ngân sách riêng. Với dữ liệu bảng có chiều cố định, quy tắc đơn giản hơn nhưng vẫn phải giới hạn batch và tổng số request đang chờ."
        },
        {
          "title": "Đo phép tính đã hoàn thành",
          "text": "Benchmark release build, warm-up trước khi lấy mẫu và ghi riêng thời gian nạp model. Nếu backend thực thi bất đồng bộ, phép đo cần chờ kết quả thực sự hoàn thành; chỉ đo thời gian enqueue sẽ cho số quá đẹp. Đo cả batch 1 lẫn batch lớn, công bố p50, p95, throughput, cấu hình máy và bộ nhớ.\n\nGiảm precision hoặc lượng tử hóa có thể thay đổi kích thước artifact, độ trễ và chất lượng theo backend. So sánh lại cùng bộ fixture và tập đánh giá trước khi chọn. Đừng mặc định ít bit luôn nhanh hơn: phép chuyển đổi, kernel được hỗ trợ và kích thước workload đều ảnh hưởng. Chọn thay đổi dựa trên mục tiêu sản phẩm đã công bố."
        },
        {
          "title": "Một phiên bản mô hình là một gói nhất quán",
          "text": "Manifest cần ghép trọng số, kiến trúc, preprocessing, nhãn, dtype và phiên bản schema. Nạp bản ứng viên vào vùng riêng, kiểm tra fixture và chỉ kích hoạt khi mọi bước thành công. Request đang chạy giữ handle của phiên bản nó đã nhận; request mới dùng bản mới sau khi đổi con trỏ. Nếu nạp lỗi, bản đang phục vụ vẫn hoạt động.\n\nGiữ artifact cũ cùng cấu hình để rollback có ý nghĩa. Phản hồi hoặc log kỹ thuật cần model version nhằm truy dấu hồi quy; theo dõi tỷ lệ lỗi, thời gian chờ và chất lượng khi có nhãn. Khi thiếu nhãn thật, chỉ số phân phối thay đổi là tín hiệu cần điều tra, không tự chứng minh mô hình đã sai hay đúng.",
          "code": "// Ngân sách padding16, tối đa3 mục:\n// lengths = [3, 8, 2, 5]\n// [3,8] cần8*2=16; thêm2 sẽ cần8*3=24.\n// Kết quả: indices [0,1] và [2,3]."
        }
      ],
      "tip": "Giữ model version trong kết quả kiểm thử và số đo; rollback cần khôi phục cả preprocessing, không chỉ tệp trọng số.",
      "exercise": {
        "title": "Chia batch theo ngân sách padding",
        "instructions": "Viết plan_batches trả danh sách chỉ số của từng batch, giữ thứ tự ban đầu. Một batch chỉ hợp lệ khi max_length×số_mục không vượt max_padded_tokens.",
        "requirements": [
          "max_items và max_padded_tokens phải lớn hơn 0.",
          "Mỗi độ dài phải lớn hơn 0 và không vượt ngân sách của một batch.",
          "Thêm mục vào batch hiện tại nếu cả hai giới hạn còn đủ; nếu không, bắt đầu batch mới.",
          "Dùng checked_mul để phát hiện tràn số; danh sách rỗng trả danh sách batch rỗng.",
          "Mỗi chỉ số đầu vào xuất hiện đúng một lần và giữ thứ tự."
        ]
      },
      "starterCode": "fn plan_batches(lengths: &[usize], max_items: usize, max_padded_tokens: usize) -> Result<Vec<Vec<usize>>, &'static str> {\n    todo!()\n}\nfn main() {\n    let batches = plan_batches(&[3, 8, 2, 5], 3, 16).unwrap();\n    assert_eq!(batches, vec![vec![0, 1], vec![2, 3]]);\n    assert_eq!(plan_batches(&[3, 8], 1, 16).unwrap(), vec![vec![0], vec![1]]);\n    assert_eq!(plan_batches(&[], 3, 16).unwrap(), Vec::<Vec<usize>>::new());\n    assert!(plan_batches(&[0], 3, 16).is_err());\n    assert!(plan_batches(&[17], 3, 16).is_err());\n    assert!(plan_batches(&[1], 0, 16).is_err());\n    assert!(plan_batches(&[1], 3, 0).is_err());\n    assert!(plan_batches(&[usize::MAX, 1], 2, usize::MAX).is_err());\n    for batch in &batches {\n        let lengths = [3, 8, 2, 5];\n        let max_len = batch.iter().map(|&i| lengths[i]).max().unwrap();\n        assert!(max_len * batch.len() <= 16);\n        assert!(batch.len() <= 3);\n    }\n    assert_eq!(batches.iter().flatten().copied().collect::<Vec<_>>(), vec![0, 1, 2, 3]);\n    println!(\"Batch0: {:?}; Batch1: {:?}\", batches[0], batches[1]);\n}",
      "solutionCode": "fn plan_batches(lengths: &[usize], max_items: usize, max_padded_tokens: usize) -> Result<Vec<Vec<usize>>, &'static str> {\n    if max_items == 0 || max_padded_tokens == 0 { return Err(\"limits\"); }\n    if lengths.iter().any(|&n| n == 0 || n > max_padded_tokens) { return Err(\"length\"); }\n    let mut batches = Vec::new();\n    let mut current = Vec::new();\n    let mut longest = 0_usize;\n    for (index, &length) in lengths.iter().enumerate() {\n        let next_count = current.len().checked_add(1).ok_or(\"overflow\")?;\n        let next_longest = longest.max(length);\n        let padded = next_longest.checked_mul(next_count).ok_or(\"overflow\")?;\n        if !current.is_empty() && (next_count > max_items || padded > max_padded_tokens) {\n            batches.push(std::mem::take(&mut current));\n            longest = 0;\n        }\n        longest = longest.max(length);\n        current.push(index);\n    }\n    if !current.is_empty() { batches.push(current); }\n    Ok(batches)\n}\nfn main() {\n    let batches = plan_batches(&[3, 8, 2, 5], 3, 16).unwrap();\n    assert_eq!(batches, vec![vec![0, 1], vec![2, 3]]);\n    assert_eq!(plan_batches(&[3, 8], 1, 16).unwrap(), vec![vec![0], vec![1]]);\n    assert_eq!(plan_batches(&[], 3, 16).unwrap(), Vec::<Vec<usize>>::new());\n    assert!(plan_batches(&[0], 3, 16).is_err());\n    assert!(plan_batches(&[17], 3, 16).is_err());\n    assert!(plan_batches(&[1], 0, 16).is_err());\n    assert!(plan_batches(&[1], 3, 0).is_err());\n    assert!(plan_batches(&[usize::MAX, 1], 2, usize::MAX).is_err());\n    for batch in &batches {\n        let lengths = [3, 8, 2, 5];\n        let max_len = batch.iter().map(|&i| lengths[i]).max().unwrap();\n        assert!(max_len * batch.len() <= 16);\n        assert!(batch.len() <= 3);\n    }\n    assert_eq!(batches.iter().flatten().copied().collect::<Vec<_>>(), vec![0, 1, 2, 3]);\n    println!(\"Batch0: {:?}; Batch1: {:?}\", batches[0], batches[1]);\n}",
      "expectedOutput": "Batch0: [0, 1]; Batch1: [2, 3]",
      "hints": [
        "Theo dõi longest của batch hiện tại và tính chi phí nếu thêm mục tiếp theo.",
        "Dùng std::mem::take để chuyển batch đã đầy vào kết quả mà vẫn tái sử dụng biến.",
        "Không dùng sum(lengths) làm chi phí padding: [3,8] cần16 vị trí, không phải11."
      ],
      "quiz": {
        "question": "Một request HTTP hết hạn trong khi spawn_blocking đang suy luận. Điều nào đúng?",
        "options": [
          "Runtime luôn dừng ngay mọi phép tính và giải phóng model.",
          "Tác vụ blocking đã bắt đầu có thể tiếp tục; cần giới hạn concurrency, batch và chính sách deadline riêng.",
          "Mô hình tự rollback trọng số.",
          "Chỉ cần bỏ handle là GPU/CPU chắc chắn ngừng tính."
        ],
        "correct": 1,
        "explanation": "Hết thời gian chờ không đồng nghĩa tác vụ đồng bộ được hủy. Kiểm soát tải và giới hạn công việc cần được thiết kế trước khi chạy suy luận."
      },
      "reference": {
        "label": "Tokio: spawn_blocking và tác vụ CPU",
        "url": "https://docs.rs/tokio/latest/tokio/task/fn.spawn_blocking.html"
      }
    }
  ]
};
