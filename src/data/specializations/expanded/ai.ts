import type { TrackExpansion } from "../../specialization-types";

export const aiExpansion: TrackExpansion = {
  "chapters": [
    {
      "id": "ai-chapter-math",
      "title": "Tensor và số học",
      "lessonIds": [
        "ai-tensors",
        "ai-linear-algebra",
        "ai-numerics"
      ],
      "description": "Đọc shape, chiều giảm và số thực để có forward đúng.",
      "outcomes": [
        "Tính tay affine và gradient nhỏ.",
        "Phát hiện sai chiều và NaN.",
        "Viết softmax ổn định."
      ]
    },
    {
      "id": "ai-chapter-data",
      "title": "Dữ liệu và đặc trưng",
      "lessonIds": [
        "ai-data-pipeline",
        "ai-feature-contract",
        "ai-data-project"
      ],
      "description": "Xây hợp đồng train/serve và cổng dữ liệu không rò rỉ.",
      "outcomes": [
        "Chia tập theo mục tiêu dự đoán.",
        "Fit chỉ trên train.",
        "Lưu và kiểm tra bộ chuẩn hóa."
      ]
    },
    {
      "id": "ai-chapter-train",
      "title": "Huấn luyện có kiểm chứng",
      "lessonIds": [
        "ai-burn-training",
        "ai-optimization",
        "ai-training-project"
      ],
      "description": "Từ gradient đến vòng huấn luyện Burn và checkpoint.",
      "outcomes": [
        "Đối chiếu autodiff bằng công thức tay.",
        "Kiểm soát learning rate và batch.",
        "Đánh giá validation độc lập."
      ]
    },
    {
      "id": "ai-chapter-inference",
      "title": "Artifact và suy luận",
      "lessonIds": [
        "ai-candle-inference",
        "ai-artifacts",
        "ai-batching"
      ],
      "description": "Nạp mô hình và điều phối request trong ngân sách.",
      "outcomes": [
        "Kiểm tra manifest, shape và digest.",
        "Giữ mapping request với output.",
        "Giới hạn queue và deadline."
      ]
    },
    {
      "id": "ai-chapter-quality",
      "title": "Đánh giá và truy hồi",
      "lessonIds": [
        "ai-evaluation",
        "ai-retrieval",
        "ai-error-analysis"
      ],
      "description": "Đo chất lượng, phân tích lỗi và kiểm tra embedding.",
      "outcomes": [
        "Tính metric với mẫu số rỗng.",
        "Xây exact search làm tham chiếu.",
        "Phân biệt drift với suy giảm chất lượng."
      ]
    },
    {
      "id": "ai-chapter-production",
      "title": "Phục vụ và vận hành",
      "lessonIds": [
        "ai-serving",
        "ai-observability",
        "ai-deployment-project"
      ],
      "description": "Ghép Candle, phiên bản và vận hành thành capstone.",
      "outcomes": [
        "Reload không làm hỏng active model.",
        "Đo latency toàn tuyến.",
        "Bàn giao runbook và bằng chứng tải."
      ]
    }
  ],
  "lessons": [
    {
      "id": "ai-linear-algebra",
      "moduleId": "track-ai",
      "title": "Đại số tuyến tính cho mô hình",
      "description": "Đọc phép nhân ma trận, batch và gradient bằng ý nghĩa của từng chiều.",
      "duration": 60,
      "objectives": [
        "Viết dot(a,b) trả Result<f64,&str>; từ chối độ dài khác nhau và giá trị không hữu hạn.",
        "Vector rỗng cho 0; [2,1] nhân [3,-1] cho 5.",
        "Kiểm tra NaN, độ dài sai; in dot=5."
      ],
      "sections": [
        {
          "title": "Từ một dự đoán đến cả batch",
          "text": "Một mô hình tuyến tính biến vector đặc trưng thành điểm dự đoán bằng tổng các tích rồi cộng bias. Với hai đặc trưng đã chuẩn hóa, x = [2, 1], w = [3, −1], b = 0,5 cho kết quả 5,5. Từng vị trí có ý nghĩa cố định: số giờ và số lượt không được đổi chỗ dù cả hai đều là số thực. Trước khi viết tensor, ghi tên đặc trưng, đơn vị và thứ tự cột. Phép toán đúng shape vẫn có thể sai hoàn toàn về nghiệp vụ nếu hợp đồng này bị thay đổi."
        },
        {
          "title": "Shape là hợp đồng của phép toán",
          "text": "Gom n mẫu thành ma trận X có shape [n, d]. Ma trận trọng số W có shape [d, k] cho k đầu ra; kết quả XW là [n, k]. Chỉ chiều d ở giữa bị cộng dồn. Bias [k] được cộng cho từng hàng theo quy tắc broadcast đã xác định. Chuyển vị W để sửa lỗi shape một cách mò mẫm dễ tạo phép tính khác. Hãy thử một ma trận nhỏ tính tay, chẳng hạn hai mẫu, hai đặc trưng và một đầu ra, rồi so sánh từng phần tử."
        },
        {
          "title": "Batch không làm thay đổi một mẫu độc lập",
          "text": "Khi forward chỉ chứa phép toán độc lập theo hàng, dự đoán một mẫu riêng phải khớp với hàng tương ứng khi đưa vào batch. Tính chất này phát hiện lỗi cộng nhầm chiều hoặc vô tình chuẩn hóa qua toàn batch. Một số lớp có hành vi phụ thuộc chế độ huấn luyện nên không được mặc định tính chất đó cho mọi mạng. Trong bài này chỉ dùng affine thuần để có kết quả tham chiếu rõ ràng. Dữ liệu rỗng cần hợp đồng riêng: trả vector rỗng hoặc lỗi trước khi tạo tensor."
        },
        {
          "title": "Gradient cũng có chiều và đơn vị",
          "text": "Đạo hàm của lỗi theo trọng số phải có cùng shape với trọng số. Với một mẫu và lỗi bình phương e², đạo hàm theo w_j bằng 2e x_j; theo b bằng 2e. Với loss trung bình n mẫu, chia tổng gradient cho n. Quên phép chia khiến learning rate hiệu dụng tăng theo batch size. Một kiểm tra tốt là lặp lại cùng batch hai lần: gradient của loss trung bình phải gần như không đổi, còn gradient của tổng loss sẽ tăng gấp đôi."
        },
        {
          "title": "Thiết kế phép nhân có thể kiểm thử",
          "text": "Bài thực hành dùng Vec để viết dot product trước khi chuyển sang framework. Hàm từ chối vector khác độ dài và giá trị không hữu hạn, kiểm tra cả kết quả sau cộng. Không dùng zip rồi mặc nhiên chấp nhận phần dư vì zip dừng ở vector ngắn hơn. Assertions cần có cặp vector tính tay, vector rỗng theo hợp đồng và độ dài sai. Khi dùng Candle hoặc Burn, giữ các test tham chiếu này cho dữ liệu nhỏ; chúng giúp phát hiện lỗi bố trí tensor mà trình biên dịch không biết."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Đại số tuyến tính cho mô hình",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Viết dot(a,b) trả Result<f64,&str>; từ chối độ dài khác nhau và giá trị không hữu hạn.",
          "Vector rỗng cho 0; [2,1] nhân [3,-1] cho 5.",
          "Kiểm tra NaN, độ dài sai; in dot=5."
        ]
      },
      "starterCode": "fn main() {\n    // Viết dot(a,b) trả Result<f64,&str>; từ chối độ dài khác nhau và giá trị không hữu hạn.\n    // Vector rỗng cho 0; [2,1] nhân [3,-1] cho 5.\n    // Kiểm tra NaN, độ dài sai; in dot=5.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn dot(a: &[f64], b: &[f64]) -> Result<f64, &'static str> {\n    if a.len() != b.len() { return Err(\"shape\"); }\n    let mut total = 0.0;\n    for (&x, &y) in a.iter().zip(b) {\n        if !x.is_finite() || !y.is_finite() { return Err(\"nonfinite\"); }\n        total += x * y;\n        if !total.is_finite() { return Err(\"overflow\"); }\n    }\n    Ok(total)\n}\nfn main() {\n    assert_eq!(dot(&[2.0,1.0], &[3.0,-1.0]), Ok(5.0));\n    assert_eq!(dot(&[], &[]), Ok(0.0));\n    assert!(dot(&[1.0], &[]).is_err());\n    assert!(dot(&[f64::NAN], &[1.0]).is_err());\n    println!(\"dot=5\");\n}",
      "expectedOutput": "dot=5",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "X có shape [8,3], W có [3,2]. Đầu ra affine có shape nào?",
        "options": [
          "[3,3]",
          "[2,8]",
          "[8,2]"
        ],
        "correct": 2,
        "explanation": "Mỗi trong tám mẫu tạo hai đầu ra; chiều ba đặc trưng là chiều được cộng dồn."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://docs.rs/candle-core/0.11.1/candle_core/struct.Tensor.html"
      }
    },
    {
      "id": "ai-numerics",
      "moduleId": "track-ai",
      "title": "Số học ổn định và gradient",
      "description": "Tránh tràn số, mất chính xác và phép kiểm tra gradient sai.",
      "duration": 60,
      "objectives": [
        "Viết softmax ổn định cho slice f64; rỗng hoặc không hữu hạn trả lỗi.",
        "Kiểm tra [1000,1001] có tổng gần 1 và kết quả không đổi khi trừ 1000.",
        "In stable probabilities."
      ],
      "sections": [
        {
          "title": "Số thực máy có giới hạn",
          "text": "Một phép cộng f32 không giữ được mọi chữ số của giá trị thực. Cộng một số rất nhỏ vào số lớn có thể không đổi kết quả; thay đổi thứ tự tổng cũng có thể làm lệch vài bit. Vì thế test số thực cần dung sai có ý nghĩa, không tùy tiện làm tròn để che lỗi. Kiểm tra cả sai số tuyệt đối và tương đối khi dải giá trị rộng. NaN không bằng chính nó, còn vô cực có thể lan truyền qua toàn mô hình nếu chỉ kiểm tra đầu ra cuối cùng."
        },
        {
          "title": "Softmax cần trừ phần tử lớn nhất",
          "text": "Softmax biến các logits thành các trọng số dương có tổng gần một. Tính exp trực tiếp với logits [1000,1001] sẽ tràn ở nhiều kiểu số. Trừ cùng một hằng số khỏi mọi logit không đổi kết quả lý tưởng: lấy m là giá trị lớn nhất, tính exp(z_i−m), rồi chia tổng. Đây là biến đổi đại số, không phải thay đổi mô hình. Hàm phải từ chối danh sách rỗng và logit không hữu hạn. Với nhiều chiều, xác định rõ lớp nằm ở chiều nào."
        },
        {
          "title": "Loss và xác suất không thể thay thế nhau tùy ý",
          "text": "Để tính cross entropy ổn định, thường làm việc với logits và log-sum-exp thay vì lấy log của một xác suất đã làm tròn về không. Không cộng epsilon vào mọi công thức rồi mặc định đã sửa được vấn đề; epsilon đổi đại lượng cần tối ưu và cần lý do. Trong ví dụ hai lớp, hãy kiểm tra logit rất lớn nhưng chênh lệch nhỏ: xác suất vẫn hợp lý. Khi loss tăng đột ngột, kiểm tra dữ liệu, dtype, learning rate và gradient trước khi tăng số epoch."
        },
        {
          "title": "Sai phân hữu hạn là công cụ chẩn đoán",
          "text": "Một gradient vô hướng có thể đối chiếu bằng [f(w+h)−f(w−h)]/(2h). h quá lớn gây sai số xấp xỉ, h quá nhỏ gây triệt tiêu số học. Dùng f64 trên bài toán nhỏ, thử vài giá trị h và báo sai lệch thay vì tuyên bố sai phân luôn là chân lý. Tại điểm không khả vi như góc của ReLU, so sánh này cần diễn giải riêng. Gradient tự động đúng công thức nhưng công thức loss viết sai vẫn cho kết quả huấn luyện sai."
        },
        {
          "title": "Đặt cổng kiểm tra trước bước cập nhật",
          "text": "Kiểm tra loss và gradient hữu hạn trước khi sửa trọng số. Nếu một bước lỗi, dừng và lưu ngữ cảnh chẩn đoán như batch ID, bước huấn luyện, cấu hình; không ghi dữ liệu nhạy cảm nguyên bản. Trong thực hành, viết softmax ổn định với kiểm tra dữ liệu, rồi xác nhận tổng bằng một trong dung sai và tính bất biến khi cộng hằng số. Thêm mẫu cực trị để kiểm tra đúng nhánh bảo vệ. Bài kiểm tra nhỏ này được tái dùng khi ghép lớp phân loại Candle."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Số học ổn định và gradient",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Viết softmax ổn định cho slice f64; rỗng hoặc không hữu hạn trả lỗi.",
          "Kiểm tra [1000,1001] có tổng gần 1 và kết quả không đổi khi trừ 1000.",
          "In stable probabilities."
        ]
      },
      "starterCode": "fn main() {\n    // Viết softmax ổn định cho slice f64; rỗng hoặc không hữu hạn trả lỗi.\n    // Kiểm tra [1000,1001] có tổng gần 1 và kết quả không đổi khi trừ 1000.\n    // In stable probabilities.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn softmax(xs: &[f64]) -> Result<Vec<f64>, &'static str> {\n    if xs.is_empty() || xs.iter().any(|x| !x.is_finite()) { return Err(\"input\"); }\n    let max = xs.iter().copied().fold(f64::NEG_INFINITY, f64::max);\n    let exps: Vec<_> = xs.iter().map(|x| (x-max).exp()).collect();\n    let sum: f64 = exps.iter().sum();\n    Ok(exps.into_iter().map(|x| x/sum).collect())\n}\nfn main() {\n    let a=softmax(&[1000.0,1001.0]).unwrap();\n    let b=softmax(&[0.0,1.0]).unwrap();\n    assert!((a.iter().sum::<f64>()-1.0).abs()<1e-12);\n    assert!(a.iter().zip(b).all(|(x,y)| (x-y).abs()<1e-12));\n    assert!(softmax(&[]).is_err());\n    assert!(softmax(&[f64::INFINITY]).is_err());\n    println!(\"stable probabilities\");\n}",
      "expectedOutput": "stable probabilities",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Vì sao trừ logit lớn nhất trước exp?",
        "options": [
          "Bắt mọi lớp có xác suất bằng nhau.",
          "Giảm nguy cơ tràn mà giữ nguyên phân phối softmax lý tưởng.",
          "Làm mô hình không cần huấn luyện."
        ],
        "correct": 1,
        "explanation": "Nhân cả tử và mẫu với cùng exp(−m) không thay đổi tỷ số; logit lớn nhất sau trừ bằng không."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://docs.rs/candle-core/0.11.1/candle_core/struct.Tensor.html"
      }
    },
    {
      "id": "ai-feature-contract",
      "moduleId": "track-ai",
      "title": "Hợp đồng đặc trưng và chống rò rỉ dữ liệu",
      "description": "Giữ thứ tự, đơn vị, thời điểm và phép chuẩn hóa nhất quán giữa train và serve.",
      "duration": 60,
      "objectives": [
        "Viết validate_splits(train,valid) từ chối ID rỗng, lặp và giao nhau.",
        "Chấp nhận [a,b] và [c]; từ chối [a] và [a].",
        "In split isolated."
      ],
      "sections": [
        {
          "title": "Đặc trưng là một API có phiên bản",
          "text": "Một vector [tuổi, số_lần_mua] không tự mô tả ý nghĩa bằng dtype. Manifest cần tên, thứ tự, đơn vị, khoảng hợp lệ, cách biểu diễn thiếu và phiên bản của phép biến đổi. Nếu dịch vụ đổi số giây thành mili giây nhưng vẫn gửi f32, tensor vẫn chạy nhưng dự đoán có thể hỏng. Kiểm tra schema trước khi tạo tensor giúp lỗi xuất hiện ở ranh giới dễ hiểu. Tách lỗi đầu vào khỏi lỗi engine để người vận hành biết dữ liệu hay mô hình gây thất bại."
        },
        {
          "title": "Thời điểm dữ liệu quyết định tính hợp lệ",
          "text": "Đặc trưng phải có sẵn tại thời điểm ra dự đoán. Dự báo việc hoàn thành đơn hàng không được dùng trạng thái giao thành công được ghi sau đó. Một phép join lấy bản ghi mới nhất của khách hàng cũng có thể đưa thông tin tương lai vào quá khứ. Xác định prediction_time và chỉ nhận đặc trưng có event_time không lớn hơn mốc ấy. Với bài toán theo thời gian, chia tập theo thời gian thường phản ánh triển khai tốt hơn việc xáo trộn mọi hàng ngẫu nhiên."
        },
        {
          "title": "Fit chỉ nhìn tập train",
          "text": "Trung bình, độ lệch chuẩn và từ điển phân loại được học từ train, sau đó đóng băng để transform validation, test và dữ liệu phục vụ. Tính trung bình toàn dataset trước khi chia là rò rỉ dù không dùng nhãn. Nếu một cột không đổi, đặt scale bằng một theo hợp đồng đã ghi, thay vì chia cho không. Những giá trị mới ngoài miền train cần chính sách rõ: lỗi, bucket chưa biết hoặc cảnh báo phân phối. Không được âm thầm fit lại trong request."
        },
        {
          "title": "Chia theo thực thể để kiểm tra điều cần đo",
          "text": "Nếu cùng người dùng xuất hiện ở train và test, điểm cao có thể đến từ việc ghi nhớ người đó. Chia theo user ID khi mục tiêu là phục vụ người mới; chia theo thời gian khi mục tiêu là dự báo tương lai của người đã biết. Hai cách đo trả lời hai câu hỏi khác nhau. Lưu danh sách hoặc fingerprint của split để tái lập. Kiểm tra giao tập bằng ID thay vì chỉ so tỷ lệ phần trăm, vì một lỗi key join có thể nhân bản cả nhóm vào nhiều tập."
        },
        {
          "title": "Dùng golden fixture cho cả hai đường chạy",
          "text": "Lưu một số bản ghi mẫu không nhạy cảm cùng vector kỳ vọng sau transform. Chạy chúng qua thư viện dùng cho huấn luyện và thư viện dùng cho phục vụ; kết quả phải khớp trong dung sai. Test phải bao gồm thiếu dữ liệu, sai đơn vị, cột đảo vị trí và giá trị không hữu hạn. Thực hành bài này kiểm tra disjoint split bằng HashSet và phát hiện ID lặp trong chính một tập. Đây là tiền đề để dự án cổng dữ liệu không huấn luyện trên dữ liệu đã bị rò rỉ."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Hợp đồng đặc trưng và chống rò rỉ dữ liệu",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Viết validate_splits(train,valid) từ chối ID rỗng, lặp và giao nhau.",
          "Chấp nhận [a,b] và [c]; từ chối [a] và [a].",
          "In split isolated."
        ]
      },
      "starterCode": "fn main() {\n    // Viết validate_splits(train,valid) từ chối ID rỗng, lặp và giao nhau.\n    // Chấp nhận [a,b] và [c]; từ chối [a] và [a].\n    // In split isolated.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "use std::collections::HashSet;\nfn validate_splits(train: &[&str], valid: &[&str]) -> Result<(), &'static str> {\n    let mut seen=HashSet::new();\n    for id in train.iter().chain(valid) {\n        if id.is_empty() || !seen.insert(*id) { return Err(\"duplicate_or_empty\"); }\n    }\n    if train.is_empty() || valid.is_empty() { return Err(\"empty_split\"); }\n    Ok(())\n}\nfn main() {\n    assert_eq!(validate_splits(&[\"a\",\"b\"],&[\"c\"]),Ok(()));\n    assert!(validate_splits(&[\"a\"],&[\"a\"]).is_err());\n    assert!(validate_splits(&[\"a\",\"a\"],&[\"b\"]).is_err());\n    assert!(validate_splits(&[],&[\"b\"]).is_err());\n    println!(\"split isolated\");\n}",
      "expectedOutput": "split isolated",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Chuẩn hóa bằng trung bình của cả train và test có vấn đề gì?",
        "options": [
          "Thông tin phân phối test đã đi vào bước fit.",
          "Không có vấn đề nếu chưa đọc nhãn.",
          "Chỉ sai khi dùng GPU."
        ],
        "correct": 0,
        "explanation": "Các tham số tiền xử lý cũng được học từ dữ liệu; tập giữ lại không được ảnh hưởng bước fit."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://burn.dev/books/burn/building-blocks/dataset.html"
      }
    },
    {
      "id": "ai-data-project",
      "moduleId": "track-ai",
      "title": "Dự án: cổng dữ liệu cho mô hình",
      "description": "Xây pipeline kiểm tra, chia tập và chuẩn hóa có artifact tái lập.",
      "duration": 60,
      "objectives": [
        "Tính mean từ train [1,3], transform validation [5] thành [3].",
        "Cột hằng dùng scale 1; từ chối train rỗng và NaN.",
        "In validation=3."
      ],
      "sections": [
        {
          "title": "Bài toán và hợp đồng đầu ra",
          "text": "Nhóm cần huấn luyện mô hình dự báo tải công việc từ hai đặc trưng số và một nhãn số. Đầu vào mỗi hàng có entity ID, thời điểm, vector hai chiều và nhãn. Cổng dữ liệu phải loại lỗi cấu trúc trước khi tính thống kê, tách train theo mốc thời gian và giữ nhóm không giao nhau theo hợp đồng đã chọn. Đầu ra gồm dữ liệu đã biến đổi, tham số chuẩn hóa và báo cáo số hàng. Không gọi một pipeline thành công chỉ vì nó trả được Vec."
        },
        {
          "title": "Tách validate, fit và transform",
          "text": "Thư viện dự án có ba bước rõ ràng. Validate kiểm tra ID, tính hữu hạn và kích thước; fit chỉ nhận train đã hợp lệ; transform nhận bộ tham số bất biến. Hàm fit trả lỗi khi train rỗng, scale không hợp lệ hoặc dữ liệu gây phép tính không hữu hạn. Với cột hằng, dùng scale bằng một và ghi chính sách. Giữ thứ tự hai cột cố định trong struct hoặc manifest, không dựa vào thứ tự lặp của HashMap. Phần main chỉ điều phối và xuất báo cáo."
        },
        {
          "title": "Kiểm tra bằng dữ liệu tính tay",
          "text": "Với train có các giá trị [1,3] của cột đầu, mean bằng hai và độ lệch chuẩn dân số bằng một. Một mẫu validation có giá trị năm phải thành ba nếu dùng đúng tham số train. Nếu kết quả đổi khi thêm một mẫu validation rất lớn, bước fit đã vô tình nhìn tập giữ lại. Viết test tính tay này trước khi thử dataset lớn. Dùng dung sai cho số thực và kiểm tra lại tham số không bị mutate bởi transform hoặc bởi nhiều lần gọi liên tiếp."
        },
        {
          "title": "Chặn lỗi trước khi tạo artifact",
          "text": "Không xuất một manifest nửa vời sau khi gặp NaN ở hàng cuối. Validate toàn bộ batch trong giới hạn đã định, rồi mới fit và ghi kết quả. Dự án mẫu xử lý dữ liệu nhỏ trong bộ nhớ; yêu cầu mở rộng bổ sung parser có giới hạn byte và reject report. Chỉ dùng fixture tổng hợp để dễ công bố và kiểm thử. Khi thêm nguồn thật, ghi rõ chính sách xử lý dữ liệu thiếu và danh sách cột, tránh mặc định số không đại diện cho mọi loại thiếu dữ liệu."
        },
        {
          "title": "Nghiệm thu và bước chuyển sang huấn luyện",
          "text": "Mã Cargo kèm theo có test chống rò rỉ, cột hằng, dữ liệu lỗi và khả năng tái lập. Người học mở rộng manifest gồm schema version, mốc chia và thống kê, rồi kiểm tra load lại cho cùng vector. Báo cáo phải giải thích lựa chọn cách chia tập theo mục tiêu dự đoán; không chỉ nộp accuracy. Đầu ra của dự án là hợp đồng đầu vào cho bài huấn luyện Burn. Việc giữ một thư viện transform dùng chung giúp phần phục vụ sau này tránh sai lệch giữa train và serve."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Dự án: cổng dữ liệu cho mô hình",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Tính mean từ train [1,3], transform validation [5] thành [3].",
          "Cột hằng dùng scale 1; từ chối train rỗng và NaN.",
          "In validation=3."
        ]
      },
      "starterCode": "fn main() {\n    // Tính mean từ train [1,3], transform validation [5] thành [3].\n    // Cột hằng dùng scale 1; từ chối train rỗng và NaN.\n    // In validation=3.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn fit(xs:&[f64])->Result<(f64,f64),&'static str>{\n    if xs.is_empty()||xs.iter().any(|x|!x.is_finite()){return Err(\"input\");}\n    let mean=xs.iter().sum::<f64>()/xs.len() as f64;\n    let variance=xs.iter().map(|x|(x-mean).powi(2)).sum::<f64>()/xs.len() as f64;\n    let scale=if variance==0.0{1.0}else{variance.sqrt()};\n    if !mean.is_finite()||!scale.is_finite(){return Err(\"overflow\");}\n    Ok((mean,scale))\n}\nfn main(){\n    let (m,s)=fit(&[1.0,3.0]).unwrap();\n    assert_eq!((5.0-m)/s,3.0);\n    assert_eq!(fit(&[2.0,2.0]),Ok((2.0,1.0)));\n    assert!(fit(&[]).is_err());assert!(fit(&[f64::NAN]).is_err());\n    println!(\"validation=3\");\n}",
      "expectedOutput": "validation=3",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Thêm một hàng validation làm mean train thay đổi. Kết luận nào đúng?",
        "options": [
          "Mô hình đang tổng quát hóa tốt hơn.",
          "Chỉ là khác biệt giữa f32 và f64.",
          "Pipeline fit đã dùng nhầm dữ liệu giữ lại."
        ],
        "correct": 2,
        "explanation": "Fit phải chỉ phụ thuộc train; thay đổi validation không được sửa tham số chuẩn hóa."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://burn.dev/books/burn/building-blocks/dataset.html"
      },
      "localLab": {
        "title": "Cổng dữ liệu và bộ chuẩn hóa",
        "instructions": "Tạo đủ các tệp sau trong thư mục feature-gate. Mã mẫu chạy hoàn toàn trên CPU với dữ liệu tổng hợp. Chạy test trước, sau đó bổ sung parser, manifest phiên bản và báo cáo theo yêu cầu dự án.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"feature-gate\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::collections::HashSet;\nuse serde::{Deserialize, Serialize};\n\n#[derive(Clone, Debug)]\npub struct Row { pub id: String, pub x: [f64; 2], pub y: f64 }\n#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]\npub struct Normalizer { pub schema: u32, pub mean: [f64; 2], pub scale: [f64; 2] }\n\nfn validate(rows: &[Row], seen: &mut HashSet<String>) -> Result<(), String> {\n    if rows.is_empty() || rows.len() > 100_000 { return Err(\"row_limit\".into()); }\n    for row in rows {\n        if row.id.is_empty() || row.id.len() > 64 || !seen.insert(row.id.clone()) {\n            return Err(\"duplicate_or_invalid_id\".into());\n        }\n        if row.x.iter().chain(std::iter::once(&row.y)).any(|x| !x.is_finite() || x.abs() > 1e6) {\n            return Err(\"value_range\".into());\n        }\n    }\n    Ok(())\n}\npub fn fit(train: &[Row]) -> Result<Normalizer, String> {\n    validate(train, &mut HashSet::new())?;\n    let mut mean = [0.0; 2];\n    for row in train { for j in 0..2 { mean[j] += row.x[j] / train.len() as f64; } }\n    let mut scale = [0.0; 2];\n    for row in train { for j in 0..2 { scale[j] += (row.x[j] - mean[j]).powi(2) / train.len() as f64; } }\n    for s in &mut scale { *s = if *s == 0.0 { 1.0 } else { s.sqrt() }; }\n    Ok(Normalizer { schema: 1, mean, scale })\n}\nimpl Normalizer {\n    pub fn transform(&self, x: [f64; 2]) -> Result<[f64; 2], String> {\n        if self.schema != 1 || self.mean.iter().any(|v| !v.is_finite())\n            || self.scale.iter().any(|v| !v.is_finite() || *v <= 0.0)\n            || x.iter().any(|v| !v.is_finite() || v.abs() > 1e6) {\n            return Err(\"contract\".into());\n        }\n        let result = [(x[0] - self.mean[0]) / self.scale[0], (x[1] - self.mean[1]) / self.scale[1]];\n        if result.iter().any(|v| !v.is_finite()) { return Err(\"nonfinite_output\".into()); }\n        Ok(result)\n    }\n}\npub fn prepare(train: &[Row], valid: &[Row]) -> Result<(Normalizer, Vec<[f64; 2]>), String> {\n    let mut ids = HashSet::new();\n    validate(train, &mut ids)?;\n    validate(valid, &mut ids)?;\n    let normalizer = fit(train)?;\n    let transformed = valid.iter().map(|row| normalizer.transform(row.x)).collect::<Result<Vec<_>, _>>()?;\n    Ok((normalizer, transformed))\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use feature_gate::{Row, prepare};\nfn main() -> Result<(), String> {\n let row=|id:&str,x|Row{id:id.into(),x,y:0.0};\n let train=vec![row(\"a\",[1.0,2.0]),row(\"b\",[3.0,2.0])];\n let valid=vec![row(\"c\",[5.0,2.0])];\n let (normalizer,output)=prepare(&train,&valid)?;\n println!(\"{}\",serde_json::to_string(&normalizer).map_err(|e|e.to_string())?);\n assert_eq!(output,vec![[3.0,0.0]]);\n println!(\"validation=3,0\");\n Ok(())\n}\n"
          },
          {
            "path": "tests/pipeline.rs",
            "content": "use feature_gate::{Row, Normalizer, fit, prepare};\nfn row(id:&str,x:[f64;2])->Row{Row{id:id.into(),x,y:0.0}}\nfn train()->Vec<Row>{vec![row(\"a\",[1.0,2.0]),row(\"b\",[3.0,2.0])]}\n#[test] fn fit_uses_only_train(){let(n,a)=prepare(&train(),&[row(\"c\",[5.0,2.0])]).unwrap();let(m,_)=prepare(&train(),&[row(\"d\",[999.0,8.0])]).unwrap();assert_eq!(n,m);assert_eq!(a,vec![[3.0,0.0]]);}\n#[test] fn group_overlap_and_duplicate_are_rejected(){assert!(prepare(&train(),&[row(\"a\",[4.0,2.0])]).is_err());assert!(fit(&[row(\"a\",[1.0,2.0]),row(\"a\",[3.0,2.0])]).is_err());}\n#[test] fn empty_nonfinite_and_range_are_rejected(){assert!(fit(&[]).is_err());assert!(fit(&[row(\"a\",[f64::NAN,1.0])]).is_err());assert!(fit(&[row(\"a\",[1e9,1.0])]).is_err());}\n#[test] fn constant_column_and_roundtrip(){let n=fit(&train()).unwrap();assert_eq!(n.scale,[1.0,1.0]);let json=serde_json::to_string(&n).unwrap();let loaded:Normalizer=serde_json::from_str(&json).unwrap();assert_eq!(loaded.transform([5.0,2.0]).unwrap(),[3.0,0.0]);}\n#[test] fn malformed_manifest_fails(){let n=Normalizer{schema:2,mean:[0.0;2],scale:[1.0;2]};assert!(n.transform([0.0;2]).is_err());let n=Normalizer{schema:1,mean:[0.0;2],scale:[0.0,1.0]};assert!(n.transform([0.0;2]).is_err());}\n#[test] fn transform_does_not_mutate(){let n=fit(&train()).unwrap();let before=n.clone();for _ in 0..3{n.transform([5.0,2.0]).unwrap();}assert_eq!(n,before);}\n"
          },
          {
            "path": "README.md",
            "content": "# Feature gate\n\nChạy `cargo test` rồi `cargo run`. Hợp đồng schema 1: hai cột theo thứ tự cố định; số thực hữu hạn có trị tuyệt đối không quá 1e6; tối đa 100.000 hàng mỗi tập; ID không giao nhau và không lặp. Fit chỉ dùng train, độ lệch chuẩn dân số, cột hằng có scale 1. Mã mẫu nhận struct trong bộ nhớ. Phần mở rộng phải thêm parser giới hạn byte, manifest mô tả tên cột/mốc chia và test load lại. Không dùng fixture nhỏ để tuyên bố chất lượng dữ liệu thực tế.\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run"
        ],
        "checks": [
          "Sáu test kiểm tra rò rỉ, ID, miền dữ liệu, cột hằng, manifest và tính bất biến.",
          "Validation [5,2] được biến đổi thành [3,0] bằng tham số train.",
          "Bổ sung parser và báo cáo đầu vào mà không thay đổi hợp đồng transform."
        ]
      }
    },
    {
      "id": "ai-optimization",
      "moduleId": "track-ai",
      "title": "Tối ưu, regularization và checkpoint",
      "description": "Phân biệt cập nhật đúng gradient với mô hình có khả năng tổng quát hóa.",
      "duration": 60,
      "objectives": [
        "Viết gradients cho y=w*x+b với MSE trung bình và cặp dữ liệu hữu hạn, không rỗng.",
        "Kiểm tra lặp đôi batch không đổi gradient; một bước learning rate 0.1 giảm loss.",
        "In gradient verified."
      ],
      "sections": [
        {
          "title": "Loss mô tả mục tiêu cần tối ưu",
          "text": "MSE là trung bình bình phương sai số, thích hợp làm bài toán khởi đầu cho nhãn số. Nó phạt sai số lớn mạnh hơn sai số nhỏ, nên outlier có thể chi phối quá trình học. Chọn loss phải gắn với mục tiêu và đơn vị nhãn. Nếu đổi nhãn từ phút sang giây, gradient cũng đổi quy mô; learning rate trước đó có thể không còn phù hợp. Hãy báo cả loss theo miền đã chuẩn hóa và một metric có đơn vị mà người dùng hiểu."
        },
        {
          "title": "Một bước SGD cần thứ tự rõ ràng",
          "text": "Đầu tiên forward bằng tham số hiện tại, tính loss, lấy gradient, kiểm tra hữu hạn rồi cập nhật w mới bằng w cũ trừ learning rate nhân gradient. Tất cả trọng số trong cùng bước phải dùng gradient từ cùng một snapshot. Nếu cập nhật một phần rồi tính tiếp phần còn lại, bạn đã đổi thuật toán. Để debug, bắt đầu bằng một batch nhỏ, không shuffle, không regularization và chỉ vài bước; kiểm tra loss giảm theo phép tính tay trước khi tăng độ phức tạp."
        },
        {
          "title": "Batch size ảnh hưởng cả tính toán và thống kê",
          "text": "Với loss trung bình, gradient là trung bình gradient từng mẫu. Batch nhỏ có thể nhiễu hơn; batch lớn dùng nhiều bộ nhớ hơn và không tự động có tổng quát hóa tốt hơn. Gradient accumulation cần chia tỷ lệ đúng nếu microbatch có kích thước khác nhau. Không lấy trung bình của các loss trung bình mà bỏ qua số mẫu. Khi batch cuối nhỏ hơn, thống kê epoch phải cộng loss nhân số mẫu rồi chia tổng mẫu để không đánh giá sai."
        },
        {
          "title": "Regularization và early stopping giải quyết việc khác nhau",
          "text": "L2 thêm mức phạt theo độ lớn trọng số vào objective; nó không phải phép xóa trọng số sau mỗi epoch. Early stopping chọn checkpoint theo validation với quy tắc được chốt trước. Đừng chọn checkpoint trên test rồi vẫn gọi test là đánh giá độc lập. Lưu best model riêng với last model: bản cuối phục vụ resume, bản tốt nhất phục vụ so sánh. Muốn resume đúng optimizer có trạng thái, phải lưu cả trạng thái optimizer, bước, seed và lịch learning rate."
        },
        {
          "title": "Kiểm chứng gradient trước khi tin đồ thị loss",
          "text": "Loss giảm không chứng minh đạo hàm đã đúng, vì một số lỗi vẫn giảm trên dữ liệu dễ. Dùng công thức giải tích cho mô hình nhỏ và sai phân hữu hạn làm hai phép đối chiếu. Thực hành tính gradient MSE cho một trọng số và bias, kiểm tra khi nhân đôi batch thì gradient trung bình giữ nguyên. Sau đó cập nhật một bước và xác nhận objective giảm. Những test này sẽ được dùng lại với autodiff của Burn để phân biệt lỗi framework integration với lỗi dữ liệu."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Tối ưu, regularization và checkpoint",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Viết gradients cho y=w*x+b với MSE trung bình và cặp dữ liệu hữu hạn, không rỗng.",
          "Kiểm tra lặp đôi batch không đổi gradient; một bước learning rate 0.1 giảm loss.",
          "In gradient verified."
        ]
      },
      "starterCode": "fn main() {\n    // Viết gradients cho y=w*x+b với MSE trung bình và cặp dữ liệu hữu hạn, không rỗng.\n    // Kiểm tra lặp đôi batch không đổi gradient; một bước learning rate 0.1 giảm loss.\n    // In gradient verified.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn grad(xs:&[(f64,f64)],w:f64,b:f64)->(f64,f64){\n    assert!(!xs.is_empty());\n    let n=xs.len() as f64;\n    xs.iter().fold((0.0,0.0),|(dw,db),(x,y)|{\n        let e=w*x+b-y;(dw+2.0*e*x/n,db+2.0*e/n)\n    })\n}\nfn loss(xs:&[(f64,f64)],w:f64,b:f64)->f64{\n    xs.iter().map(|(x,y)|(w*x+b-y).powi(2)).sum::<f64>()/xs.len() as f64\n}\nfn main(){\n    let xs=[(-1.0,-1.0),(1.0,3.0)];let g=grad(&xs,0.0,0.0);\n    let twice=[xs[0],xs[1],xs[0],xs[1]];\n    assert_eq!(g,grad(&twice,0.0,0.0));\n    assert_eq!(g,(-4.0,-2.0));\n    assert!(loss(&xs,-0.1*g.0,-0.1*g.1)<loss(&xs,0.0,0.0));\n    println!(\"gradient verified\");\n}",
      "expectedOutput": "gradient verified",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Batch cuối có 2 mẫu, các batch trước có 32 mẫu. Tính loss epoch thế nào?",
        "options": [
          "Cộng loss trung bình từng batch nhân số mẫu rồi chia tổng số mẫu.",
          "Lấy trung bình các batch không cần trọng số.",
          "Chỉ báo loss batch cuối."
        ],
        "correct": 0,
        "explanation": "Trọng số theo số mẫu giữ ý nghĩa loss trung bình của toàn epoch; mỗi batch không đại diện cùng số quan sát."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://burn.dev/books/burn/custom-training-loop.html"
      }
    },
    {
      "id": "ai-training-project",
      "moduleId": "track-ai",
      "title": "Dự án: huấn luyện hồi quy bằng Burn",
      "description": "Tạo vòng huấn luyện hai đặc trưng, kiểm tra autodiff và đánh giá tập giữ lại.",
      "duration": 60,
      "objectives": [
        "Tính gradient MSE của w1,w2,b trên bốn điểm đối xứng, nhãn 2*x1-x2+1.",
        "Từ tham số 0, gradient phải là [-4,2,-2]; cập nhật 0.1 cho [0.4,-0.2,0.2].",
        "In parameters=0.4,-0.2,0.2."
      ],
      "sections": [
        {
          "title": "Một bài toán nhỏ nhưng đường chạy thật",
          "text": "Dự án học quan hệ y = 2x₁ − x₂ + 1 trên fixture tổng hợp. Hai đặc trưng giúp phát hiện việc đổi cột mà bài một chiều không thấy. Mục tiêu là làm chủ vòng train, kiểm tra gradient và quản lý cấu hình, không tuyên bố mô hình này giải quyết mọi bài toán dự báo. Tập train được thiết kế đối xứng để tính tay dễ; tập validation dùng điểm khác. Mã kèm theo chạy Burn thật trên CPU và không yêu cầu tải mô hình hoặc GPU."
        },
        {
          "title": "Thiết lập Burn theo API đã cố định",
          "text": "Cargo khóa Burn 0.22.1 với std, flex và autodiff. Device::flex().autodiff() tạo thiết bị CPU theo dõi phép toán; tensor một chiều chứa cả batch của từng đặc trưng. Ba tensor tham số là w₁, w₂ và bias, được đánh dấu require_grad. Forward kết hợp hai tích và bias; loss là mean của bình phương sai số. API phiên bản này dùng Tensor theo số chiều, không dùng mẫu generic backend cũ. Khóa phiên bản giúp mã bài học và chữ ký API khớp nhau."
        },
        {
          "title": "Lấy gradient và cập nhật nguyên tử theo bước",
          "text": "Gọi backward từ loss và lấy gradient của từng tensor tham số. Nếu gradient thiếu hoặc không hữu hạn, trả lỗi trước khi sửa bộ tham số. Mã mẫu chuyển ba gradient vô hướng về CPU, kiểm tra rồi tạo snapshot tham số mới; mỗi bước dựng lại graph nên không giữ toàn bộ lịch sử. Đây là vòng học rõ ràng để quan sát, chưa nhằm tối ưu throughput. Người học cần giải thích vì sao clone tensor dùng trong biểu thức không phải tùy tiện sao chép toàn bộ dữ liệu đầu vào."
        },
        {
          "title": "Đánh giá ngoài vòng học",
          "text": "Validation chạy bằng tham số đã chốt, không cập nhật gradient và không fit lại chuẩn hóa. Báo MSE trên train, validation và baseline dự đoán hằng để biết mô hình có cải thiện gì. Test gradient so với công thức tay ở điểm khởi đầu, rồi test hội tụ với dung sai. Không kiểm tra các trọng số bằng bit chính xác giữa mọi CPU; so sánh chất lượng số học và giới hạn sai lệch. Cấu hình steps bằng không hoặc learning rate không hợp lệ phải bị chặn từ đầu."
        },
        {
          "title": "Mở rộng thành quy trình có thể bàn giao",
          "text": "Người học bổ sung minibatch có seed cố định, lưu best checkpoint và manifest chứa schema đặc trưng, cấu hình, phiên bản dependency. Thử một nhãn ngoại lai và giải thích ảnh hưởng lên MSE; thử đổi thứ tự hai cột để chứng minh golden fixture bắt được lỗi. Nộp báo cáo sai số theo từng nhóm đầu vào, không chỉ một con số. CPU fixture chứng minh vòng tính toán; muốn triển khai GPU cần thêm kiểm tra parity, đồng bộ khi đo thời gian, ngân sách bộ nhớ và cấu hình backend trong chính dự án."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Dự án: huấn luyện hồi quy bằng Burn",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Tính gradient MSE của w1,w2,b trên bốn điểm đối xứng, nhãn 2*x1-x2+1.",
          "Từ tham số 0, gradient phải là [-4,2,-2]; cập nhật 0.1 cho [0.4,-0.2,0.2].",
          "In parameters=0.4,-0.2,0.2."
        ]
      },
      "starterCode": "fn main() {\n    // Tính gradient MSE của w1,w2,b trên bốn điểm đối xứng, nhãn 2*x1-x2+1.\n    // Từ tham số 0, gradient phải là [-4,2,-2]; cập nhật 0.1 cho [0.4,-0.2,0.2].\n    // In parameters=0.4,-0.2,0.2.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn main(){\n    let rows=[([-1.0f64,-1.0],0.0),([-1.0,1.0],-2.0),([1.0,-1.0],4.0),([1.0,1.0],2.0)];\n    let mut g=[0.0;3];\n    for (x,y) in rows {let e=-y;g[0]+=2.0*e*x[0]/4.0;g[1]+=2.0*e*x[1]/4.0;g[2]+=2.0*e/4.0;}\n    assert_eq!(g,[-4.0,2.0,-2.0]);\n    let p=g.map(|x|-0.1*x);\n    assert_eq!(p,[0.4,-0.2,0.2]);\n    println!(\"parameters=0.4,-0.2,0.2\");\n}",
      "expectedOutput": "parameters=0.4,-0.2,0.2",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Gradient bias thiếu sau backward. Hành động nào đúng?",
        "options": [
          "Mặc định gradient bằng 0 rồi tiếp tục.",
          "Dừng bước cập nhật và kiểm tra graph cùng require_grad.",
          "Tăng learning rate để bù."
        ],
        "correct": 1,
        "explanation": "Gradient thiếu có thể cho biết tham số không tham gia graph hoặc chưa bật theo dõi; tiếp tục sẽ che lỗi tích hợp."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://burn.dev/books/burn/migrating-to-0.22.html"
      },
      "localLab": {
        "title": "Vòng huấn luyện Burn hai đặc trưng",
        "instructions": "Tạo các tệp trong burn-regression. Rust 1.95 trở lên, Burn 0.22.1, backend Flex CPU và autodiff. Mã mẫu dùng full batch tổng hợp; nhiệm vụ mở rộng là minibatch, checkpoint và báo cáo validation, không cần GPU để bắt đầu.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"burn-regression\"\nversion = \"0.1.0\"\nedition = \"2024\"\nrust-version = \"1.95\"\n\n[dependencies]\nburn = { version = \"=0.22.1\", default-features = false, features = [\"std\", \"flex\", \"autodiff\"] }\n\n[profile.dev]\ndebug = 0\n[profile.test]\ndebug = 0\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use burn::tensor::{Device, Tensor};\n#[derive(Clone, Copy, Debug)]\npub struct Sample { pub x: [f32; 2], pub y: f32 }\npub const TRAIN: [Sample;4] = [\n Sample{x:[-1.0,-1.0],y:0.0},Sample{x:[-1.0,1.0],y:-2.0},\n Sample{x:[1.0,-1.0],y:4.0},Sample{x:[1.0,1.0],y:2.0}\n];\nfn validate(rows:&[Sample],p:[f32;3])->Result<(),String>{\n if rows.is_empty()||rows.len()>4096{return Err(\"batch_limit\".into());}\n if p.iter().any(|x|!x.is_finite())||rows.iter().any(|r|r.x.iter().any(|x|!x.is_finite()||x.abs()>10.0)||!r.y.is_finite()||r.y.abs()>100.0){return Err(\"input_range\".into());}\n Ok(())\n}\npub fn loss_gradient(rows:&[Sample],p:[f32;3])->Result<(f32,[f32;3]),String>{\n validate(rows,p)?;\n let device=Device::flex().autodiff();\n let x1:Vec<_>=rows.iter().map(|r|r.x[0]).collect();\n let x2:Vec<_>=rows.iter().map(|r|r.x[1]).collect();\n let y:Vec<_>=rows.iter().map(|r|r.y).collect();\n let a=Tensor::<1>::from_floats(x1.as_slice(),&device);\n let b=Tensor::<1>::from_floats(x2.as_slice(),&device);\n let target=Tensor::<1>::from_floats(y.as_slice(),&device);\n let w1=Tensor::<1>::from_floats([p[0]],&device).require_grad();\n let w2=Tensor::<1>::from_floats([p[1]],&device).require_grad();\n let bias=Tensor::<1>::from_floats([p[2]],&device).require_grad();\n let residual=a*w1.clone()+b*w2.clone()+bias.clone()-target;\n let loss=residual.powf_scalar(2.0).mean();\n let value=loss.clone().into_scalar::<f32>();\n let gradients=loss.backward();\n let g=[\n  w1.grad(&gradients).ok_or(\"missing_w1\")?.into_scalar::<f32>(),\n  w2.grad(&gradients).ok_or(\"missing_w2\")?.into_scalar::<f32>(),\n  bias.grad(&gradients).ok_or(\"missing_bias\")?.into_scalar::<f32>()\n ];\n if !value.is_finite()||g.iter().any(|x|!x.is_finite()){return Err(\"nonfinite_gradient\".into());}\n Ok((value,g))\n}\npub fn mse(rows:&[Sample],p:[f32;3])->Result<f32,String>{\n validate(rows,p)?;\n let value=rows.iter().map(|r|(r.x[0]*p[0]+r.x[1]*p[1]+p[2]-r.y).powi(2)).sum::<f32>()/rows.len() as f32;\n if !value.is_finite(){return Err(\"nonfinite_loss\".into());}Ok(value)\n}\npub fn train(steps:usize,rate:f32)->Result<[f32;3],String>{\n if steps==0||steps>5000||!rate.is_finite()||rate<=0.0||rate>0.2{return Err(\"configuration\".into());}\n let mut p=[0.0;3];\n for _ in 0..steps{\n  let(_,g)=loss_gradient(&TRAIN,p)?;\n  let next=[p[0]-rate*g[0],p[1]-rate*g[1],p[2]-rate*g[2]];\n  if next.iter().any(|x|!x.is_finite()){return Err(\"update\".into());}\n  p=next;\n }\n Ok(p)\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use burn_regression::{train,mse,Sample,TRAIN};\nfn main()->Result<(),String>{let p=train(120,0.1)?;let valid=[Sample{x:[0.5,-0.5],y:2.5},Sample{x:[-0.5,0.5],y:-0.5}];assert!(mse(&valid,p)?<1e-6);println!(\"w1={:.4} w2={:.4} bias={:.4}\",p[0],p[1],p[2]);println!(\"train_mse={:.6} valid_mse={:.6}\",mse(&TRAIN,p)?,mse(&valid,p)?);Ok(())}\n"
          },
          {
            "path": "tests/training.rs",
            "content": "use burn_regression::{TRAIN,Sample,loss_gradient,mse,train};\nfn close(a:f32,b:f32,t:f32){assert!((a-b).abs()<t,\"{a} != {b}\");}\n#[test]fn autodiff_matches_hand(){let(loss,g)=loss_gradient(&TRAIN,[0.0;3]).unwrap();close(loss,6.0,1e-6);for(a,b)in g.into_iter().zip([-4.0,2.0,-2.0]){close(a,b,1e-6);}}\n#[test]fn finite_difference_each_parameter(){let p=[0.3,-0.2,0.1];let(_,g)=loss_gradient(&TRAIN,p).unwrap();for j in 0..3{let mut a=p;let mut b=p;a[j]+=0.001;b[j]-=0.001;let numerical=(mse(&TRAIN,a).unwrap()-mse(&TRAIN,b).unwrap())/0.002;close(g[j],numerical,0.003);}}\n#[test]fn duplicated_batch_preserves_mean_gradient(){let mut twice=TRAIN.to_vec();twice.extend(TRAIN);let a=loss_gradient(&TRAIN,[0.0;3]).unwrap();let b=loss_gradient(&twice,[0.0;3]).unwrap();for(x,y)in a.1.into_iter().zip(b.1){close(x,y,1e-6);}}\n#[test]fn convergence_and_held_out(){let p=train(120,0.1).unwrap();for(a,b)in p.into_iter().zip([2.0,-1.0,1.0]){close(a,b,1e-4);}let valid=[Sample{x:[0.5,-0.5],y:2.5},Sample{x:[-0.5,0.5],y:-0.5}];assert!(mse(&valid,p).unwrap()<1e-6);}\n#[test]fn invalid_input_and_config(){assert!(loss_gradient(&[],[0.0;3]).is_err());assert!(loss_gradient(&[Sample{x:[f32::NAN,0.0],y:0.0}],[0.0;3]).is_err());assert!(train(0,0.1).is_err());assert!(train(10,0.0).is_err());assert!(train(5001,0.1).is_err());}\n"
          },
          {
            "path": "README.md",
            "content": "# Burn regression\n\n`cargo test` kiểm tra gradient giải tích, sai phân hữu hạn, trung bình batch, hội tụ và lỗi cấu hình. `cargo run --release` học y=2*x1-x2+1 trên bốn điểm; validation dùng hai điểm khác. Đây là bài toán tổng hợp có nghiệm biết trước, không phải bằng chứng tổng quát hóa với dữ liệu thực. MSE tham chiếu tính bằng Rust thuần. Thêm minibatch, manifest và best checkpoint; nếu đổi backend phải kiểm tra parity và đồng bộ thiết bị khi benchmark. Chưa bao gồm GPU, distributed training hoặc optimizer có trạng thái.\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run --release"
        ],
        "checks": [
          "Gradient khởi đầu bằng [-4,2,-2] trong dung sai 1e-6.",
          "Validation MSE dưới 1e-6 sau 120 bước learning rate 0.1.",
          "Minibatch và checkpoint do người học bổ sung phải giữ hợp đồng feature schema."
        ]
      },
      "simulation": {
        "title": "Một bước gradient và cổng hữu hạn",
        "description": "Theo dõi cùng một snapshot tham số qua forward, backward và update. Số liệu là fixture tổng hợp, không phải benchmark.",
        "kind": "pipeline",
        "nodes": [
          {
            "id": "data",
            "label": "Batch",
            "detail": "Hai đặc trưng và nhãn"
          },
          {
            "id": "forward",
            "label": "Forward",
            "detail": "Tính MSE"
          },
          {
            "id": "grad",
            "label": "Gradient",
            "detail": "Ba đạo hàm"
          },
          {
            "id": "update",
            "label": "Update",
            "detail": "Kiểm tra trước khi thay tham số"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Gradient hợp lệ",
            "steps": [
              {
                "title": "Đọc batch",
                "description": "Bốn điểm đối xứng, tham số đều bằng 0.",
                "activeNodeIds": [
                  "data"
                ],
                "values": [
                  {
                    "label": "samples",
                    "value": "4"
                  },
                  {
                    "label": "parameters",
                    "value": "[0,0,0]"
                  }
                ]
              },
              {
                "title": "Tính loss",
                "description": "Forward dùng cùng snapshot tham số.",
                "activeNodeIds": [
                  "forward"
                ],
                "values": [
                  {
                    "label": "MSE",
                    "value": "6"
                  }
                ]
              },
              {
                "title": "Lấy gradient",
                "description": "Autodiff khớp công thức tay.",
                "activeNodeIds": [
                  "grad"
                ],
                "values": [
                  {
                    "label": "gradient",
                    "value": "[-4,2,-2]"
                  }
                ]
              },
              {
                "title": "Cập nhật",
                "description": "Learning rate 0.1 tạo tham số mới.",
                "activeNodeIds": [
                  "update"
                ],
                "values": [
                  {
                    "label": "parameters",
                    "value": "[0.4,-0.2,0.2]"
                  },
                  {
                    "label": "status",
                    "value": "accepted"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "Batch chứa NaN",
            "steps": [
              {
                "title": "Nhận batch",
                "description": "Một đặc trưng là NaN.",
                "activeNodeIds": [
                  "data"
                ],
                "values": [
                  {
                    "label": "samples",
                    "value": "4"
                  },
                  {
                    "label": "invalid",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Validate",
                "description": "Kiểm tra hữu hạn thất bại trước tensor.",
                "activeNodeIds": [
                  "forward"
                ],
                "values": [
                  {
                    "label": "status",
                    "value": "rejected"
                  }
                ]
              },
              {
                "title": "Không backward",
                "description": "Không tạo gradient giả bằng số 0.",
                "activeNodeIds": [
                  "grad"
                ],
                "values": [
                  {
                    "label": "gradient",
                    "value": "none"
                  }
                ]
              },
              {
                "title": "Giữ snapshot",
                "description": "Tham số cũ vẫn nguyên vẹn.",
                "activeNodeIds": [
                  "update"
                ],
                "values": [
                  {
                    "label": "parameters",
                    "value": "[0,0,0]"
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
      "id": "ai-artifacts",
      "moduleId": "track-ai",
      "title": "Artifact, tokenizer và khả năng tương thích",
      "description": "Đóng gói trọng số cùng hợp đồng để nạp đúng mô hình.",
      "duration": 60,
      "objectives": [
        "Viết manifest_valid(version,features,labels); chỉ version 1, hai đặc trưng, hai nhãn khác nhau và không rỗng.",
        "Chặn đảo hợp đồng bằng feature count; chặn nhãn trùng hoặc version khác.",
        "In artifact contract valid."
      ],
      "sections": [
        {
          "title": "Trọng số chỉ là một phần của mô hình",
          "text": "Một tệp tensor không cho biết toàn bộ kiến trúc, thứ tự nhãn hay cách xử lý dữ liệu. Gói phát hành cần manifest gồm model version, tên tensor, shape, dtype, feature schema, preprocessing version và nhãn đầu ra. Với văn bản, tokenizer, vocabulary và special token cũng là một phần của hợp đồng. Hai tokenizer khác nhau có thể sinh token ID hợp lệ nhưng trỏ đến embedding khác. Khi thiếu metadata bắt buộc, dừng nạp thay vì cố đoán từ tên tệp."
        },
        {
          "title": "Kiểm tra bytes trước khi dựng tensor",
          "text": "Áp dụng giới hạn kích thước tệp trước khi đọc toàn bộ. Tính digest của artifact và so với manifest do quy trình phát hành tin cậy cung cấp. Digest chỉ phát hiện thay đổi so với giá trị đã biết; nếu cả tệp và manifest đều bị thay thế bởi nguồn không tin cậy thì nó không tạo ra tính xác thực. Sau đó mới nạp SafeTensors và kiểm tra tên tensor, dtype, shape và giá trị hữu hạn. Định dạng an toàn hơn không thay thế giới hạn tài nguyên hoặc kiểm tra tính đúng đắn."
        },
        {
          "title": "Dùng golden input để kiểm tra ngữ nghĩa",
          "text": "Đầu ra có đúng shape vẫn có thể đảo lớp. Lưu fixture đầu vào nhỏ và xác suất hoặc logits kỳ vọng, kèm dung sai và phiên bản bộ tiền xử lý. Một fixture phải phân biệt được các cột và nhãn: toàn số không thường không phát hiện đảo cột. Với mô hình phân loại hai lớp, dùng ít nhất hai mẫu nghiêng về hai phía. Nạp artifact rồi chạy fixture trước khi đưa vào phục vụ; phiên bản hiện tại tiếp tục hoạt động nếu bản mới không qua kiểm tra."
        },
        {
          "title": "Thiết kế nạp như một giao dịch",
          "text": "Chuẩn bị mô hình mới trong vùng riêng, validate đầy đủ và warmup, rồi mới đổi con trỏ active. Request đang chạy giữ snapshot cũ; request mới lấy snapshot mới. Không sửa tensor của mô hình đang dùng ngay trong vòng nạp. Khi nạp thất bại, trả lỗi vận hành có model ID nhưng không làm dịch vụ mất bản đang hoạt động. Nếu hai bản có schema khác nhau, cần router hoặc chuyển đổi được thiết kế rõ; không tự động thay preprocessing giữa chừng của một request."
        },
        {
          "title": "Bài thực hành kiểm tra manifest tối thiểu",
          "text": "Viết hàm xác nhận schema, số đặc trưng và danh sách nhãn trước khi chấp nhận một artifact. Thử nhãn trùng nhau, shape sai và version không hỗ trợ. Sau đó bổ sung vào dự án phục vụ Candle phần digest và golden fixture. Để mở rộng sang mô hình văn bản, người học phải thêm giới hạn số token, chính sách truncate và test Unicode; việc giới hạn byte không tương đương giới hạn token. Tất cả các quyết định này thuộc gói mô hình, không được để mỗi client đoán riêng."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Artifact, tokenizer và khả năng tương thích",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Viết manifest_valid(version,features,labels); chỉ version 1, hai đặc trưng, hai nhãn khác nhau và không rỗng.",
          "Chặn đảo hợp đồng bằng feature count; chặn nhãn trùng hoặc version khác.",
          "In artifact contract valid."
        ]
      },
      "starterCode": "fn main() {\n    // Viết manifest_valid(version,features,labels); chỉ version 1, hai đặc trưng, hai nhãn khác nhau và không rỗng.\n    // Chặn đảo hợp đồng bằng feature count; chặn nhãn trùng hoặc version khác.\n    // In artifact contract valid.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn valid(version:u32,features:usize,labels:&[&str])->bool{\n    version==1&&features==2&&labels.len()==2&&!labels[0].is_empty()&&!labels[1].is_empty()&&labels[0]!=labels[1]\n}\nfn main(){\n    assert!(valid(1,2,&[\"thap\",\"cao\"]));\n    assert!(!valid(2,2,&[\"thap\",\"cao\"]));\n    assert!(!valid(1,3,&[\"thap\",\"cao\"]));\n    assert!(!valid(1,2,&[\"cao\",\"cao\"]));\n    println!(\"artifact contract valid\");\n}",
      "expectedOutput": "artifact contract valid",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Checksum của weights khớp nhưng hai nhãn bị đảo trong manifest. Có thể phục vụ ngay không?",
        "options": [
          "Không; cần kiểm tra hợp đồng và golden fixture theo ngữ nghĩa nhãn.",
          "Có; checksum chứng minh mô hình đúng.",
          "Có nếu tensor cùng dtype."
        ],
        "correct": 0,
        "explanation": "Checksum bảo vệ tính toàn vẹn bytes so với giá trị tham chiếu; nó không chứng minh mapping nhãn đúng."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://docs.rs/candle-core/0.11.1/candle_core/safetensors/index.html"
      }
    },
    {
      "id": "ai-batching",
      "moduleId": "track-ai",
      "title": "Batching, padding và giới hạn tài nguyên",
      "description": "Tăng throughput trong khi bảo vệ deadline và tính độc lập của request.",
      "duration": 60,
      "objectives": [
        "Lấy tối đa limit job có deadline lớn hơn now, giữ thứ tự và bỏ job hết hạn.",
        "Với [(a,5),(b,8),(c,9)], now=5, limit=1, kết quả là b.",
        "limit 0 trả rỗng; in batch=b."
      ],
      "sections": [
        {
          "title": "Ba loại thời gian cần tách riêng",
          "text": "Latency của request gồm chờ hàng đợi, tiền xử lý, tính toán và hậu xử lý. Batch lớn có thể tăng throughput nhưng làm request đầu chờ lâu hơn. Báo p95 chỉ của forward sẽ bỏ qua phần người dùng thực sự chờ. Đặt deadline từ lúc nhận request, rồi kiểm tra trước khi thực hiện bước tốn tài nguyên. Một giới hạn batch không tự tạo giới hạn queue; nếu queue tăng vô hạn, bộ nhớ và thời gian chờ vẫn tăng dù mỗi lần suy luận nhỏ."
        },
        {
          "title": "Gom batch theo hợp đồng tương thích",
          "text": "Chỉ gom các request có cùng model version, schema và cấu hình cần thiết. Lưu request ID và vị trí hàng để trả đúng kết quả. Với văn bản, padding tạo các vị trí giả; attention mask phải loại chúng khỏi phép tính phù hợp. Độ dài chuỗi ảnh hưởng bộ nhớ và chi phí mạnh nên có thể bucket theo độ dài, nhưng vẫn phải giữ deadline. Ví dụ tabular của khóa không cần padding; điều này được ghi rõ để tránh áp dụng mặc định sang mô hình ngôn ngữ."
        },
        {
          "title": "Admission control xảy ra trước khi cấp phát lớn",
          "text": "Giới hạn byte request, số mẫu, số đặc trưng và số job đang chờ. Nếu đầy queue, trả trạng thái quá tải rõ để client retry có kiểm soát; không giữ kết nối vô hạn. Tách validation giá trị và validation kích thước: NaN có thể lọt qua JSON của một nguồn nội bộ dù JSON chuẩn không biểu diễn nó. Trước forward, kiểm tra lại hạn chót vì request có thể đã hết hạn khi còn ở queue. Hủy chờ không đảm bảo hủy được một kernel đang chạy."
        },
        {
          "title": "Batch không được trộn phiên bản giữa chừng",
          "text": "Một job được gắn model version lúc được nhận hoặc lúc dispatch theo hợp đồng đã công bố. Khi reload, chọn một chính sách và kiểm tra bằng test. Mã dự án dùng version lúc admission và từ chối job cũ chưa chạy sau khi đổi phiên bản, giúp tránh âm thầm đổi ý nghĩa. Hệ thống khác có thể giữ nhiều snapshot cho tới khi job hoàn thành; cách đó cần ngân sách bộ nhớ. Không được đổi một nửa batch sang mô hình mới rồi trả cùng một version."
        },
        {
          "title": "Mô phỏng scheduler trước khi dựng HTTP",
          "text": "Bài thực hành dùng hàng đợi có deadline số nguyên và giới hạn số job. Tại thời điểm tick, bỏ job hết hạn và lấy tối đa batch_size job còn hợp lệ, giữ thứ tự. Dùng đồng hồ giả giúp test không cần sleep. Kiểm tra cả queue rỗng, job hết hạn tại đúng mốc và batch size bằng không. Sau khi logic này ổn định, dự án capstone ghép Candle vào dispatcher. HTTP, hủy request và đo tải là các mốc mở rộng có rubric riêng."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Batching, padding và giới hạn tài nguyên",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Lấy tối đa limit job có deadline lớn hơn now, giữ thứ tự và bỏ job hết hạn.",
          "Với [(a,5),(b,8),(c,9)], now=5, limit=1, kết quả là b.",
          "limit 0 trả rỗng; in batch=b."
        ]
      },
      "starterCode": "fn main() {\n    // Lấy tối đa limit job có deadline lớn hơn now, giữ thứ tự và bỏ job hết hạn.\n    // Với [(a,5),(b,8),(c,9)], now=5, limit=1, kết quả là b.\n    // limit 0 trả rỗng; in batch=b.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn select<'a>(jobs:&[(&'a str,u64)],now:u64,limit:usize)->Vec<&'a str>{\n    jobs.iter().filter(|(_,deadline)|*deadline>now).take(limit).map(|(id,_)|*id).collect()\n}\nfn main(){\n    let jobs=[(\"a\",5),(\"b\",8),(\"c\",9)];\n    assert_eq!(select(&jobs,5,1),vec![\"b\"]);\n    assert!(select(&jobs,5,0).is_empty());\n    assert!(select(&jobs,9,4).is_empty());\n    println!(\"batch=b\");\n}",
      "expectedOutput": "batch=b",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Queue đầy dù mỗi batch chỉ 16 mẫu. Cần làm gì?",
        "options": [
          "Tăng queue vô hạn vì batch nhỏ.",
          "Chỉ giảm số metric đang ghi.",
          "Giới hạn admission và trả quá tải, đo cả thời gian chờ."
        ],
        "correct": 2,
        "explanation": "Giới hạn batch chỉ chặn kích thước một lần forward; admission mới giới hạn lượng công việc chờ trong hệ thống."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://huggingface.github.io/candle/inference/inference.html"
      }
    },
    {
      "id": "ai-retrieval",
      "moduleId": "track-ai",
      "title": "Embedding và truy hồi có đánh giá",
      "description": "Thiết kế một đường truy hồi từ vector đến kết quả có thể kiểm chứng.",
      "duration": 60,
      "objectives": [
        "Viết cosine cho hai slice f64 không rỗng, cùng chiều, hữu hạn và norm khác 0.",
        "[1,0] với [2,0] bằng 1; hai vector vuông góc bằng 0; zero vector bị từ chối.",
        "In cosine=1."
      ],
      "sections": [
        {
          "title": "Embedding biểu diễn quan hệ cần học",
          "text": "Embedding là vector mà khoảng cách được kỳ vọng phản ánh một loại quan hệ trong dữ liệu huấn luyện. Nó không phải bản tóm tắt có thể đọc trực tiếp, cũng không bảo đảm hiểu mọi miền tiếng Việt. Với tìm kiếm tài liệu, query và document phải đi qua mô hình và cách tiền xử lý tương thích. Không trộn vector từ hai phiên bản embedding trong cùng index rồi so cosine. Lưu model ID, chiều vector và chính sách chuẩn hóa cùng snapshot index để có thể kiểm tra khi tải."
        },
        {
          "title": "Cosine cần xử lý vector không hợp lệ",
          "text": "Cosine là tích vô hướng chia cho tích độ dài hai vector. Vector toàn không không có hướng nên không có cosine xác định theo công thức này; chọn lỗi hoặc bỏ qua theo hợp đồng, đừng chia cho không. Từ chối chiều khác nhau và giá trị không hữu hạn. Với vector đã chuẩn hóa về độ dài một, dot product bằng cosine trong sai số số thực. Không nhầm L2 với cosine khi cấu hình index; hai metric có thể cho thứ tự khác nếu vector chưa chuẩn hóa."
        },
        {
          "title": "Bắt đầu bằng exact search làm tham chiếu",
          "text": "Với tập tài liệu nhỏ, tính điểm cho tất cả document rồi sort tạo baseline rõ ràng. Khi điểm bằng nhau, dùng document ID làm tie-break để kết quả tái lập. Chỉ sau đó mới dùng index xấp xỉ để đổi độ chính xác lấy tốc độ. Recall của index cần so với exact search trên cùng metric và dữ liệu. Đo thêm thời gian build, kích thước index, tốc độ cập nhật và hành vi khi xóa tài liệu; throughput query không phải tiêu chí duy nhất."
        },
        {
          "title": "Đánh giá truy hồi khác đánh giá câu trả lời",
          "text": "Recall@k đo phần tài liệu liên quan được tìm trong top k; MRR tập trung thứ hạng của kết quả đúng đầu tiên. Cần bộ câu hỏi có nhãn liên quan để tính chúng, không chọn vài query thuận lợi rồi xem bằng mắt. Nếu kết hợp với hệ thống sinh câu trả lời, lỗi có thể ở chunking, retrieval, reranking hoặc generation. Lưu vết document ID và model version để phân tích tầng nào thất bại. Không coi điểm cosine là xác suất câu trả lời đúng."
        },
        {
          "title": "Xử lý cập nhật bằng snapshot nhất quán",
          "text": "Document, embedding và metadata phải thuộc cùng phiên bản. Khi xóa tài liệu, index không được tiếp tục trả nội dung cũ chỉ vì metadata đã bị xóa ở chỗ khác. Một cách đơn giản là build snapshot mới, kiểm tra rồi đổi con trỏ active giống artifact mô hình. Bài thực hành viết cosine với kiểm tra chiều và vector không; dự án mở rộng dùng Candle nhân ma trận query với corpus nhỏ, đối chiếu exact reference. Chất lượng embedding thực tế cần dataset đánh giá riêng, không suy ra từ phép nhân tensor chạy thành công."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Embedding và truy hồi có đánh giá",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Viết cosine cho hai slice f64 không rỗng, cùng chiều, hữu hạn và norm khác 0.",
          "[1,0] với [2,0] bằng 1; hai vector vuông góc bằng 0; zero vector bị từ chối.",
          "In cosine=1."
        ]
      },
      "starterCode": "fn main() {\n    // Viết cosine cho hai slice f64 không rỗng, cùng chiều, hữu hạn và norm khác 0.\n    // [1,0] với [2,0] bằng 1; hai vector vuông góc bằng 0; zero vector bị từ chối.\n    // In cosine=1.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn cosine(a:&[f64],b:&[f64])->Result<f64,&'static str>{\n    if a.is_empty()||a.len()!=b.len()||a.iter().chain(b).any(|x|!x.is_finite()){return Err(\"input\");}\n    let dot=a.iter().zip(b).map(|(x,y)|x*y).sum::<f64>();\n    let na=a.iter().map(|x|x*x).sum::<f64>().sqrt();\n    let nb=b.iter().map(|x|x*x).sum::<f64>().sqrt();\n    let denom=na*nb;\n    if denom==0.0||!denom.is_finite()||!dot.is_finite(){return Err(\"norm\");}\n    Ok(dot/denom)\n}\nfn main(){\n    assert_eq!(cosine(&[1.0,0.0],&[2.0,0.0]),Ok(1.0));\n    assert_eq!(cosine(&[1.0,0.0],&[0.0,1.0]),Ok(0.0));\n    assert!(cosine(&[0.0],&[1.0]).is_err());\n    assert!(cosine(&[1.0],&[]).is_err());\n    println!(\"cosine=1\");\n}",
      "expectedOutput": "cosine=1",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Đổi model embedding nhưng giữ index cũ cùng số chiều có an toàn không?",
        "options": [
          "Có vì shape khớp.",
          "Không; hệ tọa độ ngữ nghĩa và tiền xử lý có thể đã đổi.",
          "Có nếu dùng cùng kiểu f32."
        ],
        "correct": 1,
        "explanation": "Cùng chiều không chứng minh các vector tương thích; cần build hoặc chuyển đổi index theo hợp đồng model version."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://docs.rs/candle-core/0.11.1/candle_core/struct.Tensor.html"
      }
    },
    {
      "id": "ai-error-analysis",
      "moduleId": "track-ai",
      "title": "Phân tích lỗi, ngưỡng và drift",
      "description": "Đánh giá mô hình theo tình huống sử dụng thay vì chỉ một điểm tổng.",
      "duration": 60,
      "objectives": [
        "Tính precision=tp/(tp+fp), recall=tp/(tp+fn) dạng Option<f64>.",
        "Với tp=3,fp=1,fn=2: precision 0.75, recall 0.6; mẫu số 0 trả None.",
        "In precision=0.75 recall=0.60."
      ],
      "sections": [
        {
          "title": "Một con số tổng che được nhiều lỗi",
          "text": "Accuracy 99% có thể đến từ việc luôn đoán lớp chiếm 99% dữ liệu. Báo confusion matrix, precision và recall theo lớp để thấy mô hình bỏ sót hay báo nhầm. Mỗi metric cần xác định lớp dương và mẫu số; nếu không có dự đoán dương thì precision không xác định theo công thức thông thường. Chọn biểu diễn None hoặc chính sách đã ghi, đừng tự thay bằng một rồi tuyên bố hoàn hảo. Kèm số lượng mẫu để người đọc biết mức độ bằng chứng."
        },
        {
          "title": "Ngưỡng là quyết định của sản phẩm",
          "text": "Điểm mô hình và quyết định cuối là hai bước khác nhau. Đổi ngưỡng thường đổi tradeoff false positive và false negative; chọn ngưỡng trên validation theo mục tiêu đã định, rồi khóa trước khi đánh giá test. Với hàng đợi cần người kiểm tra, có thể ưu tiên recall trong ngân sách xử lý. Không tối ưu chỉ vì một ngưỡng đẹp trên dashboard. Khi phân phối nhãn hoặc chi phí thay đổi, cần đánh giá lại chính sách bằng dữ liệu có nhãn phù hợp."
        },
        {
          "title": "Phân tích theo lát dữ liệu có ý nghĩa",
          "text": "Tách lỗi theo độ dài văn bản, nguồn dữ liệu, khoảng thời gian hoặc nhóm điều kiện vận hành. Một nhóm chỉ có ba mẫu không đủ để kết luận mạnh dù metric rất cao. Đọc mẫu lỗi và phân loại nguyên nhân: nhãn không nhất quán, đặc trưng thiếu, dữ liệu ngoài miền, preprocessing sai hoặc mô hình chưa phù hợp. Giữ tập phân tích để chẩn đoán nhưng tránh liên tục chỉnh mô hình trên test cuối. Tạo tập kiểm định mới khi quy trình đã khai thác test quá nhiều."
        },
        {
          "title": "Drift không đồng nghĩa chất lượng chắc chắn giảm",
          "text": "Drift đặc trưng cho biết phân phối đầu vào thay đổi; nó không trực tiếp đo lỗi dự đoán nếu chưa có nhãn. Một đợt khuyến mãi có thể làm số lượt tăng nhưng mô hình vẫn đúng. Ngược lại, quan hệ giữa đầu vào và nhãn có thể đổi trong khi histogram đặc trưng nhìn tương tự. Theo dõi cả dữ liệu, tỷ lệ lỗi schema, điểm mô hình và metric có nhãn khi nhãn đến muộn. Cảnh báo cần hành động cụ thể như điều tra nguồn hoặc so sánh bản mới."
        },
        {
          "title": "Đặt tiêu chí phát hành trước khi xem kết quả",
          "text": "Ghi baseline, metric chính, nhóm bắt buộc và mức sai lệch cho phép trước khi chạy đánh giá cuối. Với model mới, báo cả chất lượng và latency trên cùng workload; nhanh hơn nhưng bỏ sót nhóm quan trọng có thể không đạt. Bài thực hành tính precision và recall bằng Option cho trường hợp mẫu số bằng không, kiểm tra confusion matrix nhỏ bằng tay. Sau đó dùng các phép tính này trong báo cáo dự án capstone, kèm các mẫu thất bại và bài học cần ôn thay vì chỉ đánh dấu hoàn thành."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Phân tích lỗi, ngưỡng và drift",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Tính precision=tp/(tp+fp), recall=tp/(tp+fn) dạng Option<f64>.",
          "Với tp=3,fp=1,fn=2: precision 0.75, recall 0.6; mẫu số 0 trả None.",
          "In precision=0.75 recall=0.60."
        ]
      },
      "starterCode": "fn main() {\n    // Tính precision=tp/(tp+fp), recall=tp/(tp+fn) dạng Option<f64>.\n    // Với tp=3,fp=1,fn=2: precision 0.75, recall 0.6; mẫu số 0 trả None.\n    // In precision=0.75 recall=0.60.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn ratio(a:u64,b:u64)->Option<f64>{if b==0{None}else{Some(a as f64/b as f64)}}\nfn metrics(tp:u64,fp:u64,miss:u64)->Option<(Option<f64>,Option<f64>)>{\n    Some((ratio(tp,tp.checked_add(fp)?),ratio(tp,tp.checked_add(miss)?)))\n}\nfn main(){\n    assert_eq!(metrics(3,1,2),Some((Some(0.75),Some(0.6))));\n    assert_eq!(metrics(0,0,0),Some((None,None)));\n    assert_eq!(metrics(u64::MAX,1,0),None);\n    println!(\"precision=0.75 recall=0.60\");\n}",
      "expectedOutput": "precision=0.75 recall=0.60",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Histogram đầu vào thay đổi nhưng chưa có nhãn mới. Có thể kết luận gì?",
        "options": [
          "Accuracy chắc chắn giảm đúng cùng tỷ lệ.",
          "Có tín hiệu drift cần điều tra; chưa đủ để khẳng định accuracy giảm.",
          "Mô hình chắc chắn vẫn đúng."
        ],
        "correct": 1,
        "explanation": "Drift đo thay đổi phân phối; chất lượng dự đoán cần nhãn hoặc bằng chứng phù hợp."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://developers.google.com/machine-learning/managing-ml-projects/pipelines"
      }
    },
    {
      "id": "ai-observability",
      "moduleId": "track-ai",
      "title": "Đo hiệu năng và vận hành mô hình",
      "description": "Đặt metric, giới hạn và quy trình xử lý lỗi phù hợp với dịch vụ suy luận.",
      "duration": 60,
      "objectives": [
        "Viết p95 nearest-rank cho slice u64: sort, chọn ceil(0.95*n)-1; rỗng trả None.",
        "Với 1..=20, p95 bằng 19; một mẫu trả chính nó.",
        "In p95=19 n=20."
      ],
      "sections": [
        {
          "title": "Phân rã đường đi của một request",
          "text": "Gắn request ID xuyên suốt validation, queue, preprocessing, inference và response. Đo thời gian từng đoạn cùng latency toàn tuyến để biết điểm nghẽn. Ghi model version, batch size và loại lỗi nhưng tránh lưu nguyên nội dung người dùng làm nhãn metric. Nhãn có số lượng giá trị không giới hạn như request ID không phù hợp với metric tổng hợp; dùng log hoặc trace cho chi tiết. Một dashboard tốt cho biết dịch vụ có trả được kết quả đúng hợp đồng trong thời gian mong đợi hay không."
        },
        {
          "title": "Benchmark cần workload và điều kiện rõ ràng",
          "text": "Tách cold start, warmup và steady state. Giữ nguyên dataset, số luồng, batch, backend và chế độ release khi so hai bản. Với GPU, phép gọi có thể trả trước khi thiết bị hoàn tất nên phải đồng bộ tại điểm đo phù hợp. Báo phân phối latency, throughput và bộ nhớ thay vì chỉ trung bình một lần chạy. CPU fixture trong khóa giúp kiểm tra logic; không dùng nó để suy ra GPU sẽ nhanh bao nhiêu. Lưu script benchmark và cấu hình cùng kết quả để người khác tái lập."
        },
        {
          "title": "SLO gắn với hành vi người dùng",
          "text": "Một mục tiêu ví dụ là phần lớn request hợp lệ hoàn tất dưới ngưỡng đã chọn trong workload định nghĩa. Phân biệt lỗi client, quá tải, model lỗi và timeout; nếu bỏ timeout khỏi thống kê, latency nhìn đẹp nhưng người dùng vẫn thất bại. Ngân sách tài nguyên gồm queue, batch, artifact và số model đồng thời. Khi vượt ngưỡng, giảm admission hoặc rollback theo chính sách. Retry vô hạn từ server có thể khuếch đại tải và làm tình trạng xấu hơn."
        },
        {
          "title": "Reload và rollback phải được diễn tập",
          "text": "Tải bản mới vào vùng riêng, kiểm tra manifest, chạy golden fixture rồi warmup. Chỉ đổi active version khi mọi bước đạt. Theo dõi chất lượng và vận hành sau đổi; có cách quay lại bản trước nếu lỗi. Một request không được dùng preprocessing của bản A và trọng số của bản B. Test reload đồng thời bằng snapshot bất biến hoặc phiên bản hàng đợi đã mô tả ở bài batching. Khả năng nạp thành công một lần không chứng minh rollback hoạt động sau lỗi giữa chừng."
        },
        {
          "title": "Runbook giúp lỗi có người xử lý được",
          "text": "Viết các bước cho artifact sai checksum, queue tăng, lỗi NaN và metric chất lượng giảm. Mỗi bước cần tín hiệu quan sát, cách khoanh vùng và điều kiện phục hồi. Bài thực hành tính percentile theo quy ước nearest-rank trên số liệu hữu hạn đã sắp xếp, đồng thời báo số mẫu; không gọi một mẫu là p99 đáng tin. Sau đó thêm phép đo vào capstone bằng đồng hồ thật nhưng giữ test scheduler bằng đồng hồ giả. Như vậy test vẫn nhanh và benchmark vẫn đo hệ thống thực."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Đo hiệu năng và vận hành mô hình",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Viết p95 nearest-rank cho slice u64: sort, chọn ceil(0.95*n)-1; rỗng trả None.",
          "Với 1..=20, p95 bằng 19; một mẫu trả chính nó.",
          "In p95=19 n=20."
        ]
      },
      "starterCode": "fn main() {\n    // Viết p95 nearest-rank cho slice u64: sort, chọn ceil(0.95*n)-1; rỗng trả None.\n    // Với 1..=20, p95 bằng 19; một mẫu trả chính nó.\n    // In p95=19 n=20.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "fn p95(xs:&[u64])->Option<u64>{\n    if xs.is_empty(){return None;}\n    let mut values=xs.to_vec();values.sort_unstable();\n    let n=values.len();\n    let rank=(n as u128*95).div_ceil(100) as usize;\n    Some(values[rank-1])\n}\nfn main(){\n    let samples:Vec<_>=(1..=20).collect();\n    assert_eq!(p95(&samples),Some(19));\n    assert_eq!(p95(&[7]),Some(7));assert_eq!(p95(&[]),None);\n    println!(\"p95=19 n=20\");\n}",
      "expectedOutput": "p95=19 n=20",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Forward p95 nhỏ nhưng người dùng thường timeout. Nên kiểm tra gì trước?",
        "options": [
          "Chỉ giảm độ chính xác số thực.",
          "Bỏ request timeout khỏi báo cáo.",
          "Queue và latency toàn tuyến, kể cả request timeout."
        ],
        "correct": 2,
        "explanation": "Thời gian chờ và các bước ngoài forward có thể chiếm phần lớn latency; bỏ timeout làm mất tín hiệu lỗi."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://burn.dev/books/burn/"
      }
    },
    {
      "id": "ai-deployment-project",
      "moduleId": "track-ai",
      "title": "Capstone: bộ phục vụ mô hình Candle",
      "description": "Ghép artifact, admission, deadline, phiên bản và kiểm thử thành một hệ thống nhỏ.",
      "duration": 60,
      "objectives": [
        "Admission nhận job nếu ID chưa có, queue dưới capacity, deadline > now và features hữu hạn.",
        "Lỗi admission không thêm phần tử; kiểm tra đầy queue và deadline đúng biên.",
        "In admitted=1."
      ],
      "sections": [
        {
          "title": "Phạm vi của sản phẩm cần bàn giao",
          "text": "Xây một bộ phục vụ phân loại tabular hai đặc trưng, hai lớp, dùng Candle CPU để tính logits và softmax. Sản phẩm có API thư viện nhận job, queue hữu hạn, dispatcher và quy trình reload. Mã mẫu chạy trong tiến trình bằng dữ liệu tổng hợp; người học bổ sung HTTP và quan sát tải ở mốc tiếp theo. Việc tách transport khỏi engine làm test dễ kiểm soát thời gian. Đây là mô hình nhỏ để thực hành vận hành, không phải dịch vụ ngôn ngữ lớn có tokenizer hay attention cache."
        },
        {
          "title": "Artifact có kiểm tra và tự tạo fixture",
          "text": "Dự án tạo weights SafeTensors từ ma trận mẫu, lưu digest SHA-256 rồi nạp bằng Candle. Khi nạp, kiểm tra giới hạn byte, digest, tên tensor, dtype, shape và giá trị hữu hạn. Golden fixture kiểm tra phân biệt hai lớp trước khi chấp nhận model. Không tải weights không xác định từ mạng trong test. Manifest thực tế cần bổ sung nguồn artifact đáng tin cậy, schema và nhãn; digest do client tự gửi không đủ để chứng minh tính xác thực."
        },
        {
          "title": "Queue có giới hạn và deadline rõ ràng",
          "text": "Admission từ chối dữ liệu không hữu hạn, ID trùng đang chờ và queue đầy. Job ghi version lúc nhận; dispatcher chỉ xử lý job còn hạn và đúng version đang active. Trong một lượt, mỗi job tạo batch một mẫu trên Candle; đây là baseline đúng để sau đó thêm microbatch. Test dùng now do caller cung cấp nên không cần sleep. Người học gom job cùng version thành một tensor, giữ mapping hàng với request ID và chứng minh kết quả khớp baseline."
        },
        {
          "title": "Reload không phá mô hình đang dùng",
          "text": "Candidate được tạo và kiểm tra hoàn chỉnh trước khi truyền vào thao tác thay thế. Revision mới phải lớn hơn revision hiện tại. Sau đổi, các job cũ trong queue trả lỗi phiên bản theo chính sách đã công bố, không chạy âm thầm bằng model mới. Nếu candidate tải lỗi, active model vẫn giữ nguyên. Một thiết kế khác giữ snapshot cho job cũ cũng hợp lệ nhưng cần test và ngân sách bộ nhớ khác. Rubric yêu cầu người học giải thích lựa chọn này bằng tình huống cụ thể."
        },
        {
          "title": "Chứng minh sẵn sàng cho dự án lớn hơn",
          "text": "Nộp test artifact hỏng, queue đầy, deadline đúng biên, reload thất bại và parity giữa batch với từng mẫu. Bổ sung endpoint health phân biệt sống tiến trình với sẵn sàng phục vụ, metric thời gian chờ và kịch bản rollback. Chạy benchmark release với workload cố định, ghi CPU, backend và số mẫu; không suy rộng sang GPU khi chưa đo. Chỉ hoàn thành capstone khi các tiêu chí bắt buộc đạt và báo cáo nêu rõ phần chưa kiểm chứng, như mạng, thiết bị khác hoặc dữ liệu ngoài miền huấn luyện. Bổ sung một endpoint truy hồi vector exact: chuẩn hóa theo hợp đồng, tính cosine với corpus fixture, xếp theo điểm rồi ID và trả top-k. Dùng query có nhãn liên quan để tính recall@k bằng số tài liệu liên quan tìm thấy chia tổng tài liệu liên quan. Báo confusion matrix của classifier riêng với metric truy hồi; không xem hai loại chất lượng là cùng một đại lượng."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Thực hành: Capstone: bộ phục vụ mô hình Candle",
        "instructions": "Hoàn thiện chương trình theo các yêu cầu. Dùng assertion để kiểm tra cả dữ liệu hợp lệ và trường hợp biên trước khi in kết quả.",
        "requirements": [
          "Admission nhận job nếu ID chưa có, queue dưới capacity, deadline > now và features hữu hạn.",
          "Lỗi admission không thêm phần tử; kiểm tra đầy queue và deadline đúng biên.",
          "In admitted=1."
        ]
      },
      "starterCode": "fn main() {\n    // Admission nhận job nếu ID chưa có, queue dưới capacity, deadline > now và features hữu hạn.\n    // Lỗi admission không thêm phần tử; kiểm tra đầy queue và deadline đúng biên.\n    // In admitted=1.\n    todo!(\"Hoàn thiện và kiểm tra lời giải\");\n}\n",
      "solutionCode": "use std::collections::VecDeque;\nfn admit(q:&mut VecDeque<(u64,u64)>,id:u64,deadline:u64,now:u64,capacity:usize,x:[f32;2])->Result<(),&'static str>{\n    if deadline<=now||x.iter().any(|v|!v.is_finite()){return Err(\"invalid\");}\n    if q.iter().any(|(old,_)|*old==id){return Err(\"duplicate\");}\n    if q.len()>=capacity{return Err(\"overload\");}\n    q.push_back((id,deadline));Ok(())\n}\nfn main(){\n    let mut q=VecDeque::new();\n    assert_eq!(admit(&mut q,1,10,0,1,[1.0,2.0]),Ok(()));\n    assert!(admit(&mut q,2,10,0,1,[1.0,2.0]).is_err());\n    assert!(admit(&mut q,3,0,0,2,[1.0,2.0]).is_err());\n    assert_eq!(q.len(),1);\n    println!(\"admitted=1\");\n}",
      "expectedOutput": "admitted=1",
      "hints": [
        "Viết rõ đầu vào, đầu ra và bất biến trước khi xử lý dữ liệu.",
        "Thêm assertion cho trường hợp thất bại; kết quả lỗi không được làm thay đổi trạng thái hợp lệ."
      ],
      "quiz": {
        "question": "Nạp candidate bị sai shape. Trạng thái active model nên thế nào?",
        "options": [
          "Giữ nguyên bản đang phục vụ và báo lỗi candidate.",
          "Xóa active rồi thử đoán shape.",
          "Chuyển sang candidate để quan sát lỗi thực tế."
        ],
        "correct": 0,
        "explanation": "Nạp candidate tách biệt giúp lỗi kiểm tra không phá bản hợp lệ đang phục vụ."
      },
      "reference": {
        "label": "Tài liệu biên tập chính thức",
        "url": "https://docs.rs/candle-core/0.11.1/candle_core/safetensors/index.html"
      },
      "localLab": {
        "title": "Candle: artifact và scheduler có giới hạn",
        "instructions": "Tạo các tệp trong model-service. Mã tạo SafeTensors tổng hợp và chạy inference CPU thật; scheduler dùng đồng hồ do caller cung cấp để kiểm thử deadline không cần sleep. Bổ sung HTTP, microbatch, metric và runbook theo yêu cầu capstone.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"model-service\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\ncandle-core = { version = \"=0.11.1\", default-features = false }\nsha2 = \"0.10\"\n\n[profile.dev]\ndebug = 0\n[profile.test]\ndebug = 0\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use candle_core::{safetensors, DType, Device, Error, Result, Tensor};\nuse sha2::{Digest, Sha256};\nuse std::{collections::HashMap, fs::File, io::Read, path::Path};\n\npub const MAX_ARTIFACT_BYTES: usize = 1024 * 1024;\npub const MAX_BATCH: usize = 64;\n\nfn invalid(message: &str) -> Error { Error::Msg(message.to_owned()) }\n\n#[derive(Clone)]\npub struct LinearClassifier {\n    weights: Tensor, // [features=2, classes=2]\n    bias: Tensor,    // [classes=2]\n}\n\nimpl LinearClassifier {\n    pub fn new(weights: Tensor, bias: Tensor) -> Result<Self> {\n        if weights.dims() != [2, 2] || bias.dims() != [2] {\n            return Err(invalid(\"expected weights[2,2] and bias[2]\"));\n        }\n        if weights.dtype() != DType::F32 || bias.dtype() != DType::F32 {\n            return Err(invalid(\"expected f32 weights\"));\n        }\n        let w = weights.flatten_all()?.to_vec1::<f32>()?;\n        let b = bias.to_vec1::<f32>()?;\n        if w.iter().chain(&b).any(|x| !x.is_finite()) {\n            return Err(invalid(\"non-finite weights\"));\n        }\n        Ok(Self { weights, bias })\n    }\n\n    pub fn demo() -> Result<Self> {\n        let device = Device::Cpu;\n        Self::new(\n            Tensor::new(&[[1.0_f32, -1.0], [-1.0, 1.0]], &device)?,\n            Tensor::new(&[0.25_f32, -0.25], &device)?,\n        )\n    }\n\n    /// Input [batch, 2] -> probabilities [batch, 2].\n    pub fn predict(&self, rows: &[[f32; 2]]) -> Result<Vec<[f32; 2]>> {\n        if rows.is_empty() || rows.len() > MAX_BATCH {\n            return Err(invalid(\"batch must contain 1..=64 rows\"));\n        }\n        if rows.iter().flatten().any(|x| !x.is_finite()) {\n            return Err(invalid(\"non-finite feature\"));\n        }\n        let flat: Vec<f32> = rows.iter().flatten().copied().collect();\n        let input = Tensor::from_vec(flat, (rows.len(), 2), &Device::Cpu)?;\n        let logits = input.matmul(&self.weights)?.broadcast_add(&self.bias)?;\n        // Subtract the per-row maximum before exp to avoid overflow.\n        let shifted = logits.broadcast_sub(&logits.max_keepdim(1)?)?;\n        let exp = shifted.exp()?;\n        let probabilities = exp.broadcast_div(&exp.sum_keepdim(1)?)?;\n        let values = probabilities.to_vec2::<f32>()?;\n        if values.iter().flatten().any(|v| !v.is_finite()) {\n            return Err(invalid(\"non-finite prediction\"));\n        }\n        Ok(values.into_iter().map(|row| [row[0], row[1]]).collect())\n    }\n\n    pub fn save(&self, path: &Path) -> Result<()> {\n        let tensors = HashMap::from([\n            (\"linear.weight\".to_owned(), self.weights.clone()),\n            (\"linear.bias\".to_owned(), self.bias.clone()),\n        ]);\n        safetensors::save(&tensors, path)\n    }\n\n    /// The exercise only loads its own generated artifact.\n    /// A bounded read also handles files that grow after opening.\n    pub fn load_verified(path: &Path, expected_sha256: &str) -> Result<Self> {\n        let file = File::open(path)?;\n        let mut bytes = Vec::new();\n        file.take((MAX_ARTIFACT_BYTES + 1) as u64).read_to_end(&mut bytes)?;\n        if bytes.len() > MAX_ARTIFACT_BYTES {\n            return Err(invalid(\"artifact exceeds 1 MiB\"));\n        }\n        let actual = format!(\"{:x}\", Sha256::digest(&bytes));\n        if expected_sha256.len() != 64 || actual != expected_sha256 {\n            return Err(invalid(\"artifact checksum mismatch\"));\n        }\n        let mut tensors = safetensors::load_buffer(&bytes, &Device::Cpu)?;\n        if tensors.len() != 2 { return Err(invalid(\"expected exactly two tensors\")); }\n        let weights = tensors.remove(\"linear.weight\").ok_or_else(|| invalid(\"missing linear.weight\"))?;\n        let bias = tensors.remove(\"linear.bias\").ok_or_else(|| invalid(\"missing linear.bias\"))?;\n        Self::new(weights, bias)\n    }\n}\n\npub mod service;\n"
          },
          {
            "path": "src/service.rs",
            "content": "use crate::LinearClassifier;\nuse std::collections::VecDeque;\n#[derive(Clone,Debug)]\npub struct Job { pub id:u64, pub deadline:u64, pub x:[f32;2], pub version:u64 }\n#[derive(Debug,PartialEq)]\npub enum JobError { Expired, VersionChanged, Engine }\npub struct Reply { pub id:u64, pub version:u64, pub result:Result<[f32;2],JobError> }\npub struct Service { model:LinearClassifier, version:u64, queue:VecDeque<Job>, capacity:usize }\nimpl Service {\n pub fn new(model:LinearClassifier,version:u64,capacity:usize)->Result<Self,&'static str>{\n  if version==0||capacity==0||capacity>1024{return Err(\"configuration\");}\n  let p=model.predict(&[[2.0,1.0],[1.0,2.0]]).map_err(|_|\"golden\")?;\n  if p[0][0]<=0.5||p[1][1]<=0.5{return Err(\"golden\");}\n  Ok(Self{model,version,queue:VecDeque::new(),capacity})\n }\n pub fn version(&self)->u64{self.version}\n pub fn pending(&self)->usize{self.queue.len()}\n pub fn submit(&mut self,id:u64,deadline:u64,now:u64,x:[f32;2])->Result<(),&'static str>{\n  if deadline<=now||x.iter().any(|v|!v.is_finite()||v.abs()>1e6){return Err(\"input\");}\n  if self.queue.iter().any(|j|j.id==id){return Err(\"duplicate\");}\n  if self.queue.len()>=self.capacity{return Err(\"overload\");}\n  self.queue.push_back(Job{id,deadline,x,version:self.version});Ok(())\n }\n pub fn tick(&mut self,now:u64,max_jobs:usize)->Vec<Reply>{\n  let mut replies=Vec::new();\n  for _ in 0..max_jobs.min(self.capacity) {\n   let Some(job)=self.queue.pop_front() else{break};\n   let result=if job.deadline<=now{Err(JobError::Expired)}\n    else if job.version!=self.version{Err(JobError::VersionChanged)}\n    else{self.model.predict(&[job.x]).map(|p|p[0]).map_err(|_|JobError::Engine)};\n   replies.push(Reply{id:job.id,version:job.version,result});\n  }\n  replies\n }\n pub fn reload(&mut self,candidate:LinearClassifier,version:u64)->Result<(),&'static str>{\n  if version<=self.version{return Err(\"stale_version\");}\n  let p=candidate.predict(&[[2.0,1.0],[1.0,2.0]]).map_err(|_|\"golden\")?;\n  if p[0][0]<=0.5||p[1][1]<=0.5{return Err(\"golden\");}\n  self.model=candidate;self.version=version;Ok(())\n }\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use model_service::{LinearClassifier,service::Service};\nuse sha2::{Digest,Sha256};\nuse std::{fs,path::Path};\nfn main()->Result<(),Box<dyn std::error::Error>>{\n fs::create_dir_all(\"artifacts\")?;\n let path=Path::new(\"artifacts/model.safetensors\");\n LinearClassifier::demo()?.save(path)?;\n let digest=format!(\"{:x}\",Sha256::digest(fs::read(path)?));\n let model=LinearClassifier::load_verified(path,&digest)?;\n let mut service=Service::new(model,1,2)?;\n service.submit(1,10,0,[2.0,1.0])?;\n service.submit(2,1,0,[1.0,2.0])?;\n for reply in service.tick(1,2){println!(\"id={} version={} result={:?}\",reply.id,reply.version,reply.result);}\n Ok(())\n}\n"
          },
          {
            "path": "tests/service.rs",
            "content": "use model_service::{LinearClassifier,MAX_ARTIFACT_BYTES,service::{Service,JobError}};\nuse candle_core::{Device,Tensor};\nuse sha2::{Digest,Sha256};\nuse std::{fs,path::PathBuf,sync::atomic::{AtomicU64,Ordering},time::{SystemTime,UNIX_EPOCH}};\nstruct Temp(PathBuf);\nimpl Temp{fn new()->Self{static N:AtomicU64=AtomicU64::new(0);let stamp=SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos();let p=std::env::temp_dir().join(format!(\"model-service-{}-{stamp}-{}\",std::process::id(),N.fetch_add(1,Ordering::Relaxed)));fs::create_dir(&p).unwrap();Self(p)}fn path(&self)->PathBuf{self.0.join(\"model.safetensors\")}}\nimpl Drop for Temp{fn drop(&mut self){let _=fs::remove_dir_all(&self.0);}}\nfn service(cap:usize)->Service{Service::new(LinearClassifier::demo().unwrap(),1,cap).unwrap()}\n#[test]fn artifact_checksum_and_roundtrip(){let d=Temp::new();let m=LinearClassifier::demo().unwrap();m.save(&d.path()).unwrap();let digest=format!(\"{:x}\",Sha256::digest(fs::read(d.path()).unwrap()));let restored=LinearClassifier::load_verified(&d.path(),&digest).unwrap();assert_eq!(m.predict(&[[2.0,1.0]]).unwrap(),restored.predict(&[[2.0,1.0]]).unwrap());assert!(LinearClassifier::load_verified(&d.path(),&\"0\".repeat(64)).is_err());}\n#[test]fn malformed_and_oversized_artifacts(){let d=Temp::new();fs::write(d.path(),b\"bad\").unwrap();let digest=format!(\"{:x}\",Sha256::digest(b\"bad\"));assert!(LinearClassifier::load_verified(&d.path(),&digest).is_err());fs::write(d.path(),vec![0;MAX_ARTIFACT_BYTES+1]).unwrap();assert!(LinearClassifier::load_verified(&d.path(),&\"0\".repeat(64)).is_err());}\n#[test]fn admission_is_bounded_and_atomic(){let mut s=service(1);s.submit(1,10,0,[2.0,1.0]).unwrap();assert!(s.submit(2,10,0,[2.0,1.0]).is_err());assert!(s.submit(1,10,0,[2.0,1.0]).is_err());assert_eq!(s.pending(),1);}\n#[test]fn deadline_boundary_is_expired(){let mut s=service(2);s.submit(1,5,0,[2.0,1.0]).unwrap();let r=s.tick(5,1);assert_eq!(r[0].result,Err(JobError::Expired));assert_eq!(s.pending(),0);}\n#[test]fn successful_prediction_and_batch_parity(){let m=LinearClassifier::demo().unwrap();let input=[[2.0,1.0],[1.0,2.0]];let all=m.predict(&input).unwrap();for(i,row)in input.iter().enumerate(){let one=m.predict(&[*row]).unwrap();for(a,b)in all[i].iter().zip(one[0]){assert!((a-b).abs()<1e-6);}}let mut s=service(1);s.submit(1,5,0,input[0]).unwrap();assert!(s.tick(0,1)[0].result.as_ref().unwrap()[0]>0.5);}\n#[test]fn reload_rejects_old_jobs(){let mut s=service(2);s.submit(1,10,0,[2.0,1.0]).unwrap();s.reload(LinearClassifier::demo().unwrap(),2).unwrap();assert_eq!(s.tick(0,1)[0].result,Err(JobError::VersionChanged));assert_eq!(s.version(),2);}\n#[test]fn failed_candidate_keeps_active(){let mut s=service(1);let device=Device::Cpu;let bad=LinearClassifier::new(Tensor::new(&[[-1.0f32,1.0],[1.0,-1.0]],&device).unwrap(),Tensor::new(&[0.0f32,0.0],&device).unwrap()).unwrap();assert!(s.reload(bad,2).is_err());assert_eq!(s.version(),1);s.submit(1,10,0,[2.0,1.0]).unwrap();assert!(s.tick(0,1)[0].result.as_ref().unwrap()[0]>0.5);}\n#[test]fn invalid_config_and_input(){assert!(Service::new(LinearClassifier::demo().unwrap(),0,1).is_err());let mut s=service(1);assert!(s.submit(1,0,0,[1.0,2.0]).is_err());assert!(s.submit(1,10,0,[f32::NAN,2.0]).is_err());assert!(s.tick(0,0).is_empty());}\n"
          },
          {
            "path": "README.md",
            "content": "# Model service core\n\nChạy `cargo test` và `cargo run --release`. Fixture SafeTensors được tạo tại artifacts/ trong thư mục lab. Dịch vụ dùng Candle CPU, hai đặc trưng, hai nhãn, queue tối đa 1024 job. Contract: deadline <= now là hết hạn; job gắn version lúc admission; reload thành công làm job cũ trả VersionChanged. Mỗi job hiện chạy một mẫu, để có baseline kiểm chứng microbatch.\n\nChecksum phải lấy từ manifest do quy trình phát hành tin cậy cung cấp. Ví dụ tự tạo checksum chỉ để kiểm thử roundtrip. Candidate được nạp và kiểm tra trước khi thay active. Chưa có HTTP, xác thực, cancellation kernel, GPU hoặc tải production. Các phần mở rộng phải giữ deadline toàn tuyến, giới hạn byte và metric queue. Test không đọc artifact bên ngoài, không cần mạng. Không dùng test CPU để tuyên bố parity GPU.\n"
          }
        ],
        "commands": [
          "cargo test",
          "cargo run --release"
        ],
        "checks": [
          "Tám test kiểm tra artifact, admission, deadline, parity, reload và dữ liệu lỗi.",
          "Candidate lỗi giữ nguyên model version đang hoạt động.",
          "Hoàn thiện HTTP, microbatch và metric kèm test trước khi tự đánh giá capstone."
        ]
      },
      "simulation": {
        "title": "Deadline và đổi phiên bản mô hình",
        "description": "Scheduler dùng thời gian giả. Job gắn model version lúc admission; deadline bằng now được coi là hết hạn.",
        "kind": "timeline",
        "nodes": [
          {
            "id": "queue",
            "label": "Queue",
            "detail": "Job và deadline"
          },
          {
            "id": "model",
            "label": "Model",
            "detail": "Active version"
          },
          {
            "id": "dispatch",
            "label": "Dispatch",
            "detail": "Kiểm tra trước forward"
          },
          {
            "id": "reply",
            "label": "Response",
            "detail": "ID, version và kết quả"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Phục vụ trong hạn",
            "steps": [
              {
                "title": "Admission",
                "description": "Job 7 nhận version 1.",
                "activeNodeIds": [
                  "queue"
                ],
                "values": [
                  {
                    "label": "job",
                    "value": "7"
                  },
                  {
                    "label": "deadline",
                    "value": "10"
                  },
                  {
                    "label": "now",
                    "value": "0"
                  }
                ]
              },
              {
                "title": "Giữ model",
                "description": "Active vẫn là version 1.",
                "activeNodeIds": [
                  "model"
                ],
                "values": [
                  {
                    "label": "version",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Dispatch",
                "description": "Now 2 nhỏ hơn deadline 10.",
                "activeNodeIds": [
                  "dispatch"
                ],
                "values": [
                  {
                    "label": "now",
                    "value": "2"
                  },
                  {
                    "label": "result",
                    "value": "forward"
                  }
                ]
              },
              {
                "title": "Trả kết quả",
                "description": "Phản hồi giữ ID và version của job.",
                "activeNodeIds": [
                  "reply"
                ],
                "values": [
                  {
                    "label": "job",
                    "value": "7"
                  },
                  {
                    "label": "version",
                    "value": "1"
                  },
                  {
                    "label": "status",
                    "value": "ok"
                  }
                ]
              }
            ]
          },
          {
            "id": "failure",
            "label": "Reload khi job đang chờ",
            "steps": [
              {
                "title": "Admission",
                "description": "Job 7 gắn version 1.",
                "activeNodeIds": [
                  "queue"
                ],
                "values": [
                  {
                    "label": "job",
                    "value": "7"
                  },
                  {
                    "label": "version",
                    "value": "1"
                  }
                ]
              },
              {
                "title": "Reload",
                "description": "Candidate version 2 đã vượt kiểm tra.",
                "activeNodeIds": [
                  "model"
                ],
                "values": [
                  {
                    "label": "active",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "Phát hiện lệch version",
                "description": "Job vẫn còn hạn nhưng hợp đồng đã đổi.",
                "activeNodeIds": [
                  "dispatch"
                ],
                "values": [
                  {
                    "label": "jobVersion",
                    "value": "1"
                  },
                  {
                    "label": "active",
                    "value": "2"
                  }
                ]
              },
              {
                "title": "Trả lỗi rõ",
                "description": "Không chạy âm thầm bằng model mới.",
                "activeNodeIds": [
                  "reply"
                ],
                "values": [
                  {
                    "label": "job",
                    "value": "7"
                  },
                  {
                    "label": "status",
                    "value": "VersionChanged"
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  ],
  "projects": [
    {
      "id": "ai-project-features",
      "title": "Cổng dữ liệu có hợp đồng",
      "description": "Tạo thư viện dùng chung cho train và serve; chứng minh dữ liệu giữ lại không ảnh hưởng bước fit.",
      "level": "guided",
      "estimatedHours": 8,
      "labLessonId": "ai-data-project",
      "requirements": [
        "Hoàn thiện parser giới hạn 2 MiB, tối đa 100.000 hàng, hai cột có tên và đơn vị xác định.",
        "Kiểm tra ID không lặp và không giao giữa train với validation theo hợp đồng.",
        "Fit train, transform bằng tham số bất biến; cột hằng dùng scale 1.",
        "Lưu manifest gồm schema, tên cột, mốc chia và mean/scale; load lại có kiểm tra.",
        "Xuất báo cáo số hàng hợp lệ/lỗi và golden fixture."
      ],
      "milestones": [
        {
          "title": "Hợp đồng dữ liệu",
          "tasks": [
            "Viết fixture hợp lệ, ID trùng và NaN.",
            "Chọn chia theo thực thể hoặc thời gian, giải thích mục tiêu."
          ],
          "acceptance": "Lỗi đầu vào có test; không tạo artifact khi validate thất bại."
        },
        {
          "title": "Fit và transform",
          "tasks": [
            "Chạy sáu test mẫu.",
            "Thêm test validation cực trị không đổi mean train."
          ],
          "acceptance": "Fixture tính tay cho [3,0]; tham số không đổi sau transform."
        },
        {
          "title": "Artifact và bàn giao",
          "tasks": [
            "Bổ sung parser và manifest.",
            "Test roundtrip cùng tên và thứ tự cột."
          ],
          "acceptance": "Một lệnh dựng artifact và một lệnh kiểm tra tái lập được trên fixture sạch."
        }
      ],
      "testCases": [
        {
          "name": "Rò rỉ",
          "setup": "Thêm validation có đặc trưng rất lớn.",
          "expected": "Mean và scale train không đổi."
        },
        {
          "name": "ID trùng",
          "setup": "Một ID có ở cả hai tập.",
          "expected": "Pipeline trả lỗi trước fit."
        },
        {
          "name": "Cột hằng",
          "setup": "Train cột thứ hai đều bằng 2.",
          "expected": "Scale 1, giá trị 2 thành 0."
        },
        {
          "name": "Manifest sai",
          "setup": "Schema 2 hoặc scale 0.",
          "expected": "Load hoặc transform bị từ chối."
        },
        {
          "name": "Ngân sách parser",
          "setup": "Tệp vượt 2 MiB hoặc số hàng tối đa.",
          "expected": "Dừng với lỗi giới hạn, không xuất artifact mới."
        }
      ],
      "rubric": [
        {
          "id": "ai-features-contract",
          "title": "Hợp đồng dữ liệu",
          "critical": true,
          "criteria": [
            "Tên/thứ tự/đơn vị rõ ràng.",
            "Dữ liệu sai bị từ chối có test."
          ]
        },
        {
          "id": "ai-features-isolation",
          "title": "Không rò rỉ",
          "critical": true,
          "criteria": [
            "Fit chỉ phụ thuộc train.",
            "Giao tập được kiểm tra bằng ID."
          ]
        },
        {
          "id": "ai-features-roundtrip",
          "title": "Tái lập",
          "critical": true,
          "criteria": [
            "Artifact roundtrip giữ vector.",
            "Golden fixture phát hiện đổi cột."
          ]
        },
        {
          "id": "ai-features-report",
          "title": "Bàn giao",
          "critical": false,
          "criteria": [
            "Báo cáo số lượng và lý do lỗi.",
            "Giải thích chiến lược chia theo mục tiêu."
          ]
        }
      ],
      "deliverables": [
        "Cargo project có parser và test.",
        "Manifest và fixture tổng hợp.",
        "Báo cáo cách chia tập, cột hằng và dữ liệu lỗi."
      ]
    },
    {
      "id": "ai-project-training",
      "title": "Thí nghiệm huấn luyện Burn có checkpoint",
      "description": "Mở rộng hồi quy hai đặc trưng thành thí nghiệm có minibatch, đánh giá và artifact.",
      "level": "independent",
      "estimatedHours": 16,
      "labLessonId": "ai-training-project",
      "requirements": [
        "Giữ Burn 0.22.1 Flex CPU và kiểm tra gradient ba tham số.",
        "Thêm minibatch với thứ tự tái lập; loss epoch có trọng số số mẫu.",
        "Lưu best checkpoint theo validation và last checkpoint để tiếp tục vòng SGD.",
        "Gắn feature schema, seed, cấu hình, dependency version và số bước vào manifest.",
        "So với baseline hằng; báo ảnh hưởng của đổi cột và nhãn ngoại lai."
      ],
      "milestones": [
        {
          "title": "Vòng học đúng",
          "tasks": [
            "Chạy test công thức tay và sai phân.",
            "Thử learning rate sai và dữ liệu không hữu hạn."
          ],
          "acceptance": "Không cập nhật tham số khi loss hoặc gradient lỗi."
        },
        {
          "title": "Minibatch và checkpoint",
          "tasks": [
            "Thêm batch cuối nhỏ hơn.",
            "Lưu/load tham số và bước; kiểm tra resume SGD."
          ],
          "acceptance": "Chạy liên tục và resume có kết quả tương đương trong dung sai ghi rõ."
        },
        {
          "title": "Báo cáo chất lượng",
          "tasks": [
            "So baseline và tập giữ lại.",
            "Phân tích lỗi đổi cột, outlier và backend."
          ],
          "acceptance": "Báo cáo có cấu hình tái lập và không dùng test để chọn checkpoint."
        }
      ],
      "testCases": [
        {
          "name": "Gradient",
          "setup": "Bốn mẫu đối xứng, tham số 0.",
          "expected": "Gradient [-4,2,-2], loss 6."
        },
        {
          "name": "Batch cuối",
          "setup": "Số mẫu không chia hết batch size.",
          "expected": "Loss epoch cân theo số mẫu."
        },
        {
          "name": "Resume",
          "setup": "Dừng giữa các bước SGD rồi load.",
          "expected": "Kết quả gần chạy liên tục theo dung sai."
        },
        {
          "name": "Dữ liệu lỗi",
          "setup": "NaN hoặc feature ngoài miền.",
          "expected": "Trả lỗi trước cập nhật."
        },
        {
          "name": "Đổi feature order",
          "setup": "Đảo hai cột tại inference.",
          "expected": "Golden fixture hoặc hợp đồng schema phát hiện sai."
        }
      ],
      "rubric": [
        {
          "id": "ai-training-gradient",
          "title": "Đúng số học",
          "critical": true,
          "criteria": [
            "Autodiff khớp công thức và sai phân.",
            "Mỗi bước cập nhật dùng cùng snapshot gradient."
          ]
        },
        {
          "id": "ai-training-data",
          "title": "Đánh giá độc lập",
          "critical": true,
          "criteria": [
            "Không fit trên validation/test.",
            "Checkpoint chọn bằng validation theo quy tắc ghi trước."
          ]
        },
        {
          "id": "ai-training-resume",
          "title": "Tái lập thí nghiệm",
          "critical": true,
          "criteria": [
            "Manifest đủ cấu hình.",
            "Resume SGD có test."
          ]
        },
        {
          "id": "ai-training-analysis",
          "title": "Phân tích chất lượng",
          "critical": false,
          "criteria": [
            "Có baseline và lỗi theo nhóm.",
            "Phân biệt bằng chứng CPU với GPU chưa đo."
          ]
        }
      ],
      "deliverables": [
        "Mã train/eval và checkpoint.",
        "Log cấu hình, loss theo số mẫu, metric validation.",
        "Báo cáo baseline, outlier, đổi cột và giới hạn."
      ]
    },
    {
      "id": "ai-project-serving",
      "title": "Dịch vụ mô hình có phiên bản",
      "description": "Hoàn thiện core Candle thành dịch vụ có HTTP, microbatch, reload và runbook.",
      "level": "capstone",
      "estimatedHours": 28,
      "labLessonId": "ai-deployment-project",
      "requirements": [
        "Giữ kiểm tra SafeTensors, digest từ manifest tin cậy, schema và golden fixture.",
        "Bổ sung HTTP với giới hạn body, queue hữu hạn và deadline từ admission.",
        "Gom microbatch cùng version, giữ request ID và output mapping.",
        "Candidate load lỗi không thay active; có rollback và chính sách job cũ.",
        "Metric queue, latency toàn tuyến, lỗi theo loại; benchmark release với workload cố định.",
        "Viết model card nêu dữ liệu tổng hợp, giới hạn miền, metric và phần chưa kiểm chứng.",
        "Bổ sung truy hồi exact top-k trên corpus vector fixture: kiểm tra zero vector, model version, tie-break theo ID và recall@k với nhãn liên quan."
      ],
      "milestones": [
        {
          "title": "Core có kiểm tra",
          "tasks": [
            "Chạy tám test Candle và scheduler.",
            "Thêm artifact sai dtype/shape và golden sai."
          ],
          "acceptance": "Lỗi candidate giữ nguyên active; queue không vượt giới hạn."
        },
        {
          "title": "Transport và microbatch",
          "tasks": [
            "Thêm endpoint predict/ready/health.",
            "Giới hạn byte và gom cùng version.",
            "Thêm truy hồi vector exact và báo cáo confusion matrix cho classifier, recall@k cho corpus có nhãn."
          ],
          "acceptance": "Batch khớp từng mẫu; overload/timeout có phản hồi rõ."
        },
        {
          "title": "Vận hành",
          "tasks": [
            "Thử reload khi có job chờ.",
            "Đo p50/p95, throughput, memory và diễn tập rollback."
          ],
          "acceptance": "Có báo cáo tải và runbook tái lập; không bỏ request lỗi khỏi metric."
        }
      ],
      "testCases": [
        {
          "name": "Artifact hỏng",
          "setup": "Digest hoặc shape không khớp.",
          "expected": "Candidate bị từ chối, bản cũ vẫn phục vụ."
        },
        {
          "name": "Overload",
          "setup": "Gửi vượt queue capacity.",
          "expected": "Không cấp phát queue vô hạn; trả quá tải."
        },
        {
          "name": "Deadline",
          "setup": "Job đến đúng deadline tại dispatch.",
          "expected": "Trả Expired, không chạy forward."
        },
        {
          "name": "Reload",
          "setup": "Job v1 đang chờ khi active thành v2.",
          "expected": "VersionChanged theo hợp đồng, không trộn phiên bản."
        },
        {
          "name": "Microbatch",
          "setup": "Hai request hai lớp và một request hết hạn.",
          "expected": "Mapping đúng; request hết hạn không kéo theo dữ liệu của request khác."
        },
        {
          "name": "Truy hồi có tham chiếu",
          "setup": "Corpus nhỏ có nhãn liên quan, hai vector bằng điểm và một zero vector.",
          "expected": "Top-k ổn định theo ID, từ chối vector không hợp lệ, recall@k tính đúng bằng tay."
        }
      ],
      "rubric": [
        {
          "id": "ai-serving-integrity",
          "title": "Artifact và version",
          "critical": true,
          "criteria": [
            "Nguồn digest có hợp đồng tin cậy.",
            "Reload/rollback có test; giữ active khi lỗi."
          ]
        },
        {
          "id": "ai-serving-bounds",
          "title": "Giới hạn và deadline",
          "critical": true,
          "criteria": [
            "Body, queue, batch có giới hạn.",
            "Deadline toàn tuyến và overload được kiểm chứng."
          ]
        },
        {
          "id": "ai-serving-correct",
          "title": "Đúng kết quả",
          "critical": true,
          "criteria": [
            "Golden và parity batch đạt.",
            "Request ID/version không bị trộn.",
            "Metric classifier và truy hồi được đối chiếu bằng fixture có nhãn."
          ]
        },
        {
          "id": "ai-serving-ops",
          "title": "Vận hành và phạm vi",
          "critical": false,
          "criteria": [
            "Benchmark có workload và môi trường.",
            "Runbook, model card và phần GPU chưa đo được ghi rõ."
          ]
        }
      ],
      "deliverables": [
        "Cargo workspace dịch vụ và integration tests.",
        "Artifact tổng hợp, manifest và model card.",
        "Script tải, số đo toàn tuyến và runbook rollback.",
        "Corpus/query fixture có nhãn và báo cáo exact top-k, recall@k."
      ]
    }
  ],
  "assessment": {
    "title": "Đánh giá năng lực AI với Rust",
    "instructions": "Làm các tình huống trước khi xem đáp án, sau đó đối chiếu test và artifact của ba dự án với rubric. Điểm câu hỏi không thay thế bằng chứng triển khai, không chứng nhận sẵn sàng mọi vị trí AI.",
    "passPercent": 80,
    "questions": [
      {
        "id": "ai-exam-01",
        "question": "X [8,3] và W [3,2] cho shape nào?",
        "options": [
          "[3,3]",
          "[8,2]",
          "[2,8]"
        ],
        "correct": 1,
        "explanation": "Chiều đặc trưng được cộng dồn; mỗi mẫu còn hai đầu ra.",
        "lessonIds": [
          "ai-linear-algebra"
        ]
      },
      {
        "id": "ai-exam-02",
        "question": "Softmax của [1000,1001] bị NaN. Sửa thế nào?",
        "options": [
          "Đổi mọi NaN thành 0.5.",
          "Bỏ lớp có logit lớn nhất.",
          "Trừ max trước exp và kiểm tra đầu vào hữu hạn."
        ],
        "correct": 2,
        "explanation": "Trừ cùng max giữ tỷ lệ lý tưởng và tránh exp tràn.",
        "lessonIds": [
          "ai-numerics"
        ]
      },
      {
        "id": "ai-exam-03",
        "question": "Cùng user ID có ở train và validation khi đánh giá người dùng mới. Điều gì cần sửa?",
        "options": [
          "Chia theo nhóm ID và kiểm tra giao tập.",
          "Chỉ shuffle mạnh hơn.",
          "Tăng batch size."
        ],
        "correct": 0,
        "explanation": "Đánh giá người dùng mới cần tránh cùng thực thể xuất hiện ở cả hai tập.",
        "lessonIds": [
          "ai-feature-contract"
        ]
      },
      {
        "id": "ai-exam-04",
        "question": "Mean train thay đổi khi thêm validation. Nguyên nhân hợp lý nhất?",
        "options": [
          "Autodiff chưa bật.",
          "Queue quá nhỏ.",
          "Fit dùng nhầm tập giữ lại."
        ],
        "correct": 2,
        "explanation": "Preprocessing cũng là bước học; fit không được phụ thuộc validation.",
        "lessonIds": [
          "ai-data-project"
        ]
      },
      {
        "id": "ai-exam-05",
        "question": "Gradient khi nhân đôi cùng batch tăng gấp đôi dù yêu cầu mean loss. Kiểm tra gì?",
        "options": [
          "Shape weights phải nhân đôi.",
          "Phép chia số mẫu trong objective.",
          "Chỉ cần giảm learning rate tùy ý."
        ],
        "correct": 1,
        "explanation": "Gradient của mean loss phải giữ nguyên khi lặp toàn bộ batch; lỗi giảm learning rate chỉ che công thức.",
        "lessonIds": [
          "ai-optimization"
        ]
      },
      {
        "id": "ai-exam-06",
        "question": "Loss giảm nhưng gradient bias bị thiếu. Có đạt bài train không?",
        "options": [
          "Chưa; cần kiểm tra graph và gradient trước cập nhật.",
          "Đạt vì loss là bằng chứng duy nhất.",
          "Đạt nếu chạy đủ epoch."
        ],
        "correct": 0,
        "explanation": "Một số tham số khác vẫn làm loss giảm; thiếu gradient có thể là lỗi tích hợp.",
        "lessonIds": [
          "ai-training-project"
        ]
      },
      {
        "id": "ai-exam-07",
        "question": "Artifact đúng checksum nhưng nhãn đầu ra bị đổi. Cần thêm kiểm tra nào?",
        "options": [
          "Chỉ kích thước tệp.",
          "Chỉ tên thư mục.",
          "Manifest ngữ nghĩa và golden input phân biệt hai lớp."
        ],
        "correct": 2,
        "explanation": "Tính toàn vẹn bytes không chứng minh mapping nhãn hay preprocessing.",
        "lessonIds": [
          "ai-artifacts"
        ]
      },
      {
        "id": "ai-exam-08",
        "question": "Batch cố định nhỏ nhưng queue tăng không ngừng. Biện pháp đúng?",
        "options": [
          "Admission có giới hạn và quá tải rõ ràng.",
          "Tăng timeout vô hạn.",
          "Bỏ kiểm tra input."
        ],
        "correct": 0,
        "explanation": "Giới hạn batch không giới hạn số request đang chờ.",
        "lessonIds": [
          "ai-batching"
        ]
      },
      {
        "id": "ai-exam-09",
        "question": "Index embedding có cùng chiều nhưng được tạo từ model cũ. Có nên dùng với query model mới?",
        "options": [
          "Có vì cùng f32.",
          "Chỉ khi có kiểm chứng tương thích; mặc định rebuild snapshot.",
          "Có vì cosine luôn so được."
        ],
        "correct": 1,
        "explanation": "Không gian embedding có thể thay đổi dù shape giống nhau.",
        "lessonIds": [
          "ai-retrieval"
        ]
      },
      {
        "id": "ai-exam-10",
        "question": "Accuracy cao trên tập mất cân bằng nhưng recall lớp hiếm thấp. Cần báo gì?",
        "options": [
          "Confusion matrix, metric theo lớp và số mẫu.",
          "Chỉ accuracy đã làm tròn.",
          "Chỉ loss train."
        ],
        "correct": 0,
        "explanation": "Metric tổng có thể che lỗi ở lớp quan trọng; cần phân tích theo mục tiêu.",
        "lessonIds": [
          "ai-error-analysis"
        ]
      },
      {
        "id": "ai-exam-11",
        "question": "Forward nhanh nhưng timeout nhiều. Bằng chứng còn thiếu?",
        "options": [
          "Một lần chạy tensor nhỏ.",
          "Số dòng code.",
          "Thời gian queue và latency toàn tuyến gồm lỗi."
        ],
        "correct": 2,
        "explanation": "Người dùng chịu toàn bộ thời gian xử lý, không chỉ forward.",
        "lessonIds": [
          "ai-observability"
        ]
      },
      {
        "id": "ai-exam-12",
        "question": "Reload candidate thất bại trong kiểm tra golden. Chính sách đúng?",
        "options": [
          "Xóa active để tránh hai model.",
          "Giữ active cũ và báo lỗi candidate.",
          "Phục vụ candidate thử trên request thật."
        ],
        "correct": 1,
        "explanation": "Nạp tách biệt và đổi con trỏ sau kiểm tra bảo vệ dịch vụ hiện hành.",
        "lessonIds": [
          "ai-deployment-project"
        ]
      }
    ],
    "skills": [
      {
        "id": "ai-skill-1",
        "title": "Tensor và số học",
        "description": "Tính tay affine và gradient nhỏ. Phát hiện sai chiều và NaN. Viết softmax ổn định.",
        "lessonIds": [
          "ai-tensors",
          "ai-linear-algebra",
          "ai-numerics",
          "ai-training-project",
          "ai-deployment-project"
        ],
        "projectIds": [
          "ai-project-training",
          "ai-project-serving"
        ],
        "required": true
      },
      {
        "id": "ai-skill-2",
        "title": "Dữ liệu và đặc trưng",
        "description": "Chia tập theo mục tiêu dự đoán. Fit chỉ trên train. Lưu và kiểm tra bộ chuẩn hóa.",
        "lessonIds": [
          "ai-data-pipeline",
          "ai-feature-contract",
          "ai-data-project"
        ],
        "projectIds": [
          "ai-project-features"
        ],
        "required": true
      },
      {
        "id": "ai-skill-3",
        "title": "Huấn luyện có kiểm chứng",
        "description": "Đối chiếu autodiff bằng công thức tay. Kiểm soát learning rate và batch. Đánh giá validation độc lập.",
        "lessonIds": [
          "ai-burn-training",
          "ai-optimization",
          "ai-training-project"
        ],
        "projectIds": [
          "ai-project-training"
        ],
        "required": true
      },
      {
        "id": "ai-skill-4",
        "title": "Artifact và suy luận",
        "description": "Kiểm tra manifest, shape và digest. Giữ mapping request với output. Giới hạn queue và deadline.",
        "lessonIds": [
          "ai-candle-inference",
          "ai-artifacts",
          "ai-batching"
        ],
        "projectIds": [
          "ai-project-serving"
        ],
        "required": true
      },
      {
        "id": "ai-skill-5",
        "title": "Đánh giá và truy hồi",
        "description": "Tính metric với mẫu số rỗng. Xây exact search làm tham chiếu. Phân biệt drift với suy giảm chất lượng.",
        "lessonIds": [
          "ai-evaluation",
          "ai-retrieval",
          "ai-error-analysis"
        ],
        "projectIds": [
          "ai-project-serving"
        ],
        "required": true
      },
      {
        "id": "ai-skill-6",
        "title": "Phục vụ và vận hành",
        "description": "Reload không làm hỏng active model. Đo latency toàn tuyến. Bàn giao runbook và bằng chứng tải.",
        "lessonIds": [
          "ai-serving",
          "ai-observability",
          "ai-deployment-project"
        ],
        "projectIds": [
          "ai-project-serving"
        ],
        "required": true
      }
    ]
  }
};
