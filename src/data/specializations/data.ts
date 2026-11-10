import type { SpecializationBundle } from "../specialization-types";

export const dataBundle: SpecializationBundle = {
  "track": {
    "id": "data",
    "title": "Dữ liệu và engine phân tích",
    "shortTitle": "Dữ liệu",
    "description": "Xử lý bảng dữ liệu bằng Polars, xây truy vấn SQL với DataFusion và thiết kế pipeline có thể kiểm thử, đo đạc, chạy lại.",
    "outcome": "Xây pipeline phân tích có hợp đồng dữ liệu, truy vấn tối ưu, giới hạn tài nguyên và kết quả được đối chiếu bằng kiểm thử.",
    "prerequisites": [
      "Ownership, iterator, Result và trait",
      "Collections, kiểm thử và tổ chức Cargo project",
      "Async/await và giới hạn công việc đồng thời",
      "SQL cơ bản: SELECT, GROUP BY và JOIN"
    ],
    "technologies": [
      "Polars",
      "Apache DataFusion",
      "Apache Arrow",
      "SQL",
      "Parquet"
    ],
    "color": "green",
    "lessonIds": [
      "data-columnar",
      "data-polars",
      "data-joins",
      "data-datafusion",
      "data-streaming",
      "data-production"
    ],
    "capstone": {
      "title": "Pipeline phân tích đơn hàng có phiên bản",
      "description": "Nhận dữ liệu đơn hàng theo ngày, chuẩn hóa schema, tổng hợp bằng Polars và cung cấp truy vấn qua DataFusion. Mỗi bản công bố gắn với tập đầu vào xác định, có thể kiểm tra và chạy lại.",
      "milestones": [
        {
          "title": "Hợp đồng và bộ dữ liệu chuẩn",
          "tasks": [
            "Định nghĩa schema cho order_id, customer_id, event_time, region và amount_minor; nêu đơn vị tiền, múi giờ, giá trị thiếu và quy tắc loại bỏ.",
            "Tạo fixture có khóa trùng, null, số âm, khách hàng không tồn tại và một partition rỗng; ghi kết quả mong đợi bằng tay."
          ],
          "acceptance": "Mỗi dòng được chấp nhận hoặc bị từ chối kèm lý do; tổng số dòng đầu vào bằng số dòng hợp lệ cộng số dòng bị loại."
        },
        {
          "title": "Biến đổi bằng Polars",
          "tasks": [
            "Dùng lazy expressions để lọc, chọn cột, join bảng khách hàng và tổng hợp theo ngày/khu vực.",
            "Kiểm tra tính duy nhất của khóa khách hàng trước join; đọc plan và chỉ rõ phép lọc/chọn cột nào được đẩy xuống nguồn."
          ],
          "acceptance": "Kết quả khớp fixture, không tăng doanh thu do khóa khách hàng trùng; hai cách chia partition cho cùng tập dữ liệu cho cùng kết quả sau khi sắp xếp."
        },
        {
          "title": "Truy vấn bằng DataFusion",
          "tasks": [
            "Đăng ký dataset chỉ đọc, đưa SQL mẫu vào lớp truy vấn và kiểm tra schema của kết quả.",
            "Thêm EXPLAIN cho truy vấn tổng hợp; đặt giới hạn đồng thời, kết quả và thời gian phù hợp môi trường chạy."
          ],
          "acceptance": "SQL và Polars khớp trên các ca null, join thiếu khóa và tập rỗng; truy vấn sai cột trả lỗi có thể xử lý mà không làm dừng dịch vụ."
        },
        {
          "title": "Tài nguyên và hiệu năng",
          "tasks": [
            "So sánh scan Parquet có projection/predicate với đọc toàn bộ; ghi cấu hình máy, phiên bản, số dòng, độ rộng hàng và cache.",
            "Đo thời gian, peak RSS, bytes đọc và kích thước đầu ra; thử dữ liệu lệch khóa và một truy vấn có nhiều nhóm."
          ],
          "acceptance": "Báo cáo có lệnh tái hiện, nhiều lần đo, kết quả đúng trước/sau tối ưu; giải thích được giới hạn bộ nhớ của sort, join và group-by."
        },
        {
          "title": "Công bố và phục hồi",
          "tasks": [
            "Viết dữ liệu vào thư mục phiên bản mới, kiểm tra schema/count/checksum rồi cập nhật manifest bằng cơ chế commit nguyên tử của nơi lưu trữ.",
            "Chạy lại cùng batch không nhân đôi dữ liệu; mô phỏng lỗi trước và sau bước commit; giữ manifest trước để rollback."
          ],
          "acceptance": "Người đọc chỉ thấy phiên bản hoàn chỉnh; hai người ghi cạnh tranh phát hiện xung đột; chạy lại sau lỗi không làm tăng tổng đơn hàng."
        }
      ],
      "deliverables": [
        "Cargo workspace, Cargo.lock và README chạy từ máy mới",
        "Schema dữ liệu, fixture và bảng quy tắc null/khóa/thời gian",
        "Pipeline Polars, truy vấn DataFusion và bộ kiểm thử đối chiếu",
        "Query plan, báo cáo hiệu năng và kịch bản dữ liệu lệch",
        "Manifest phiên bản, quy trình retry/rollback và kiểm thử lỗi"
      ],
      "reviewQuestions": [
        "Vì sao null, NaN và 0 không thể thay thế cho nhau một cách mặc định?",
        "Khi nào left join làm tăng số dòng, và tại sao COUNT(*) khác COUNT(cột)?",
        "Projection pushdown giảm dữ liệu được đọc hay chỉ giảm kích thước kết quả? Bạn chứng minh bằng gì?",
        "Tại sao trả kết quả theo batch chưa bảo đảm toàn bộ truy vấn có bộ nhớ cố định?",
        "Bạn phân biệt batch dữ liệu, partition thực thi và partition trên đĩa thế nào?",
        "Một bản tối ưu nhanh hơn nhưng đổi thứ tự cộng số thực có còn đáp ứng hợp đồng không?",
        "Nếu tiến trình chết sau khi ghi tệp nhưng trước khi đổi manifest, lần chạy tiếp theo xử lý ra sao?"
      ]
    },
    "resources": [
      {
        "label": "Polars: Rust API 0.55.2",
        "url": "https://docs.rs/polars/0.55.2/polars/"
      },
      {
        "label": "Polars: lazy optimizations",
        "url": "https://docs.pola.rs/user-guide/lazy/optimizations/"
      },
      {
        "label": "Apache Arrow: columnar format",
        "url": "https://arrow.apache.org/docs/format/Columnar.html"
      },
      {
        "label": "DataFusion: Rust API 55.2.0",
        "url": "https://docs.rs/datafusion/55.2.0/datafusion/"
      },
      {
        "label": "DataFusion: đọc query plan",
        "url": "https://datafusion.apache.org/user-guide/explain-usage.html"
      },
      {
        "label": "DataFusion: cấu hình thực thi",
        "url": "https://datafusion.apache.org/user-guide/configs.html"
      },
      {
        "label": "Polars: Parquet",
        "url": "https://docs.pola.rs/user-guide/io/parquet/"
      },
      {
        "label": "Iceberg: snapshot và commit nguyên tử",
        "url": "https://iceberg.apache.org/docs/latest/reliability/"
      },
      {
        "label": "Cargo: dependency và lockfile",
        "url": "https://doc.rust-lang.org/cargo/guide/cargo-toml-vs-cargo-lock.html"
      },
      {
        "label": "DataFusion: bảo vệ ứng dụng truy vấn",
        "url": "https://datafusion.apache.org/library-user-guide/securing-datafusion.html"
      }
    ]
  },
  "lessons": [
    {
      "id": "data-columnar",
      "moduleId": "track-data",
      "title": "Dữ liệu cột, schema và giá trị thiếu",
      "description": "Từ Vec<Row> đến Arrow: hiểu layout, kiểu dữ liệu và null trước khi dùng query engine.",
      "duration": 45,
      "objectives": [
        "Phân biệt layout theo hàng và theo cột",
        "Đặt hợp đồng schema, đơn vị và null rõ ràng",
        "Hiểu validity bitmap và RecordBatch",
        "Viết phép tổng hợp không biến giá trị thiếu thành dữ liệu thật"
      ],
      "sections": [
        {
          "title": "Bắt đầu từ câu hỏi phân tích",
          "text": "Một cửa hàng có hàng triệu đơn, nhưng báo cáo chỉ cần khu vực và số tiền. Với Vec<Order>, mỗi phần tử đặt nhiều trường của một đơn cạnh nhau. Layout theo cột gom các giá trị cùng trường để phép quét chỉ đọc những cột cần thiết. Điều này phù hợp phép lọc và tổng hợp trên nhiều hàng; cập nhật riêng từng bản ghi có thể cần đánh đổi khác.\n\nHãy viết câu hỏi trước: tổng doanh thu đã thanh toán theo khu vực trong một ngày. Câu hỏi quyết định cột, điều kiện lọc, đơn vị và độ chính xác. Không nên chọn engine chỉ từ một biểu đồ tốc độ; cùng dữ liệu nhưng truy vấn khác có thể tạo chi phí khác nhau."
        },
        {
          "title": "Schema là hợp đồng nghiệp vụ",
          "text": "Schema không chỉ liệt kê tên cột. amount_minor: Int64 cần ghi rõ đơn vị nhỏ nhất của loại tiền; event_time cần đơn vị thời gian và quy ước múi giờ. customer_id là định danh, nên không cộng hay lấy trung bình dù nó được lưu bằng số. Chọn kiểu sau khi xác định phạm vi dữ liệu, thay vì suy đoán từ vài dòng đầu tệp CSV.\n\nTrong Rust, kiểm tra đầu vào ở ranh giới rồi chuyển sang kiểu đã xác thực. Dòng sai schema phải có chính sách: dừng cả batch hoặc đưa vào tập lỗi kèm nguyên nhân. Ép chuỗi sai thành null rồi tiếp tục âm thầm có thể làm báo cáo trông hợp lệ nhưng thiếu doanh thu."
        },
        {
          "title": "Null có metadata riêng",
          "text": "Arrow mô tả mảng bằng buffer dữ liệu cùng thông tin hợp lệ; với kiểu có null, validity bitmap cho biết ô nào có giá trị. Byte tại vị trí null không phải giá trị nghiệp vụ để đem tính toán. RecordBatch nhóm các mảng có cùng số hàng dưới một schema; một dataset có thể gồm nhiều batch và chunk.\n\nNull biểu diễn dữ liệu thiếu theo hợp đồng. Số 0 là giá trị đã biết, còn NaN thuộc miền số thực và không tự trở thành null. Khi tính trung bình, thay null bằng 0 làm thay đổi cả tử lẫn mẫu. Bài tập dùng mask bool cho dễ đọc; nó minh họa quy tắc hợp lệ, không phải cách cài đặt bitmap nhị phân của Arrow.",
          "code": "// Ba ô logic: 120, null, 0.\nlet values = [120_i64, 999, 0];\nlet valid = [true, false, true];\n// 999 chỉ là nội dung buffer ở ô không hợp lệ."
        },
        {
          "title": "Chốt quy tắc trước khi tổng hợp",
          "text": "Hàm tổng cần phân biệt không có số hợp lệ với tổng bằng 0. Ở bài này, kết quả Some(0) nghĩa là đã thấy giá trị hợp lệ, còn None nghĩa là tất cả ô đều thiếu hoặc tập rỗng. Đây là hợp đồng riêng của hàm; khi dùng engine, phải kiểm tra hành vi aggregate tương ứng thay vì mặc định mọi API giống nhau.\n\nTổng của nhiều i64 cũng có thể tràn dù mỗi phần tử hợp lệ. Dùng checked_add để báo lỗi xác định. Kiểm thử thêm mask sai độ dài, dữ liệu toàn null, số âm và biên i64. Những ca nhỏ này xác nhận ý nghĩa dữ liệu trước khi đặt phép tính vào pipeline lớn."
        }
      ],
      "tip": "Giữ riêng số hàng, số giá trị hợp lệ và tổng; chúng trả lời ba câu hỏi khác nhau.",
      "exercise": {
        "title": "Tổng cột có validity mask",
        "instructions": "Hoàn thiện nullable_sum. Bỏ qua ô có valid=false, phân biệt tập không có giá trị với tổng 0, và phát hiện tràn số.",
        "requirements": [
          "Hai slice phải cùng độ dài; sai độ dài trả Err(\"length\").",
          "Không có ô hợp lệ trả Ok(None); có ô hợp lệ trả Ok(Some(tổng)).",
          "Cộng bằng checked_add; tràn trả Err(\"overflow\")."
        ]
      },
      "starterCode": "fn nullable_sum(values: &[i64], valid: &[bool]) -> Result<Option<i64>, &'static str> {\n    todo!()\n}\nfn main() {\n    assert_eq!(nullable_sum(&[120, 999, 0], &[true, false, true]), Ok(Some(120)));\n    assert_eq!(nullable_sum(&[9], &[false]), Ok(None));\n    assert_eq!(nullable_sum(&[], &[]), Ok(None));\n    assert_eq!(nullable_sum(&[5, -5], &[true, true]), Ok(Some(0)));\n    assert_eq!(nullable_sum(&[1], &[]), Err(\"length\"));\n    assert_eq!(nullable_sum(&[i64::MAX, 1], &[true, true]), Err(\"overflow\"));\n    println!(\"Tổng hợp lệ: 120; ô thiếu không được cộng\");\n}",
      "solutionCode": "fn nullable_sum(values: &[i64], valid: &[bool]) -> Result<Option<i64>, &'static str> {\n    if values.len() != valid.len() { return Err(\"length\"); }\n    let mut total = 0_i64;\n    let mut seen = false;\n    for (&value, &is_valid) in values.iter().zip(valid) {\n        if is_valid {\n            total = total.checked_add(value).ok_or(\"overflow\")?;\n            seen = true;\n        }\n    }\n    Ok(seen.then_some(total))\n}\nfn main() {\n    assert_eq!(nullable_sum(&[120, 999, 0], &[true, false, true]), Ok(Some(120)));\n    assert_eq!(nullable_sum(&[9], &[false]), Ok(None));\n    assert_eq!(nullable_sum(&[], &[]), Ok(None));\n    assert_eq!(nullable_sum(&[5, -5], &[true, true]), Ok(Some(0)));\n    assert_eq!(nullable_sum(&[1], &[]), Err(\"length\"));\n    assert_eq!(nullable_sum(&[i64::MAX, 1], &[true, true]), Err(\"overflow\"));\n    println!(\"Tổng hợp lệ: 120; ô thiếu không được cộng\");\n}",
      "expectedOutput": "Tổng hợp lệ: 120; ô thiếu không được cộng",
      "hints": [
        "Kiểm tra độ dài trước khi zip để tránh bỏ mất phần đuôi.",
        "Một biến seen cho biết đã gặp ít nhất một ô hợp lệ.",
        "Chỉ gọi checked_add trong nhánh valid=true."
      ],
      "quiz": {
        "question": "Cột [100, null, 0] có ba hàng. Trung bình của các giá trị đã biết là bao nhiêu?",
        "options": [
          "100 / 3, vì null là 0",
          "50, vì có hai giá trị đã biết",
          "Không thể có số 0 trong cột nullable",
          "100, vì 0 cũng phải bỏ qua"
        ],
        "correct": 1,
        "explanation": "Có hai giá trị hợp lệ là 100 và 0. Null không tham gia mẫu số khi hợp đồng là trung bình các giá trị đã biết; 0 vẫn là một quan sát."
      },
      "reference": {
        "label": "Arrow: layout và validity bitmap",
        "url": "https://arrow.apache.org/docs/format/Columnar.html"
      }
    },
    {
      "id": "data-polars",
      "moduleId": "track-data",
      "title": "Polars: expressions và kế hoạch lazy",
      "description": "Biến câu hỏi phân tích thành chuỗi biểu thức, đọc query plan và kiểm tra kết quả bằng fixture.",
      "duration": 55,
      "objectives": [
        "Phân biệt DataFrame eager với LazyFrame",
        "Dùng filter, select và group_by bằng expressions",
        "Đọc predicate/projection pushdown trong plan",
        "Giữ kết quả xác định bằng schema và thứ tự rõ ràng"
      ],
      "sections": [
        {
          "title": "Biểu thức mô tả công việc",
          "text": "Trong Polars, col(\"amount\") không đọc ngay từng giá trị để chạy một vòng lặp Rust. Nó tạo biểu thức mô tả cột; phép so sánh, tổng hợp và alias nối thành cây biểu thức. Ngữ cảnh select, with_columns hoặc group_by quyết định biểu thức được áp dụng ra sao. Một biểu thức sum có thể tạo một giá trị cho cả bảng hoặc một giá trị cho mỗi nhóm.\n\nHãy đặt tên các bước theo nghiệp vụ: đơn hợp lệ, doanh thu theo khu vực, báo cáo xuất bản. Ưu tiên expressions có sẵn khi chúng diễn tả được yêu cầu. Một hàm tự viết áp dụng từng dòng có thể che mất thông tin mà bộ tối ưu cần để sắp xếp công việc."
        },
        {
          "title": "Eager và lazy khác thời điểm thực thi",
          "text": "DataFrame eager chứa kết quả hiện tại; thao tác eager thường tạo kết quả ngay. LazyFrame giữ kế hoạch cho tới điểm thực thi như collect. Chuyển một bảng đã đọc vào bộ nhớ bằng lazy() không hoàn tác chi phí đọc tệp trước đó. Nếu muốn tối ưu ngay ở nguồn, hãy dùng API scan thích hợp với định dạng và feature của phiên bản đang dùng.\n\nLab dùng bảng nhỏ trong bộ nhớ để tập trung vào tính đúng đắn. Hàm report nhận DataFrame, lọc amount theo ngưỡng, nhóm theo region rồi trả tổng. Dữ liệu lớn hơn sẽ thay nguồn vào bằng scan Parquet; phần biểu thức nghiệp vụ có thể được giữ gần như nguyên vẹn.",
          "code": "use polars::prelude::*;\nfn report(df: DataFrame, minimum: i64) -> PolarsResult<DataFrame> {\n    df.lazy()\n        .filter(col(\"amount\").gt_eq(lit(minimum)))\n        .group_by([col(\"region\")])\n        .agg([col(\"amount\").sum().alias(\"total\")])\n        .sort_by_exprs([col(\"region\")], Default::default())\n        .collect()\n}"
        },
        {
          "title": "Đọc plan để chứng minh tối ưu",
          "text": "Projection pushdown cố đưa việc chỉ chọn cột cần thiết về gần nguồn; predicate pushdown cố đưa điều kiện lọc xuống sớm khi bảo toàn ý nghĩa. Chúng có thể giảm dữ liệu phải đọc hoặc mang qua các bước sau, nhưng mức tiết kiệm phụ thuộc nguồn và phép toán. Một phép đổi tên, join hoặc hàm tùy chỉnh có thể ảnh hưởng chỗ đặt bộ lọc.\n\nDùng explain hoặc describe_optimized_plan để quan sát, rồi đối chiếu số đo khi chạy. Đừng viết kiểm thử bắt nguyên văn toàn bộ plan: tên node và cách in có thể thay đổi giữa phiên bản. Kiểm thử kết quả bảo vệ hợp đồng; kiểm tra plan có mục tiêu giúp giải thích thay đổi hiệu năng."
        },
        {
          "title": "Thứ tự và lỗi cũng thuộc đầu ra",
          "text": "Group-by không tự hứa thứ tự các nhóm như dữ liệu ban đầu. Nếu báo cáo, snapshot test hoặc người dùng cần thứ tự ổn định, thêm sort với tiêu chí đủ rõ. Một limit không kèm thứ tự không có nghĩa là lấy những dòng mới nhất. Hãy xét cả null và khóa trùng khi chọn tiêu chí sắp xếp.\n\nLab ghim Polars 0.55.2 và chỉ bật lazy, không kéo thêm định dạng tệp chưa dùng. Sau lần giải dependency đầu tiên, lưu Cargo.lock. Kiểm thử bảng rỗng, ngưỡng loại hết dữ liệu, cột sai tên và null. Không đo thời gian build lần đầu rồi gọi đó là thời gian truy vấn; hai chi phí phục vụ hai câu hỏi khác nhau."
        }
      ],
      "tip": "Tối ưu sau khi có fixture đúng; một truy vấn nhanh nhưng sai null hoặc nhóm vẫn là truy vấn sai.",
      "exercise": {
        "title": "Tổng hợp có lọc và thứ tự ổn định",
        "instructions": "Viết hàm totals bằng thư viện chuẩn để làm kết quả đối chiếu cho truy vấn Polars: bỏ amount thiếu hoặc nhỏ hơn minimum, cộng theo region, trả nhóm theo thứ tự tên.",
        "requirements": [
          "Dùng amount: Option<i64>; None không tham gia nhóm.",
          "Trả Vec<(String, i64)> sắp tăng dần theo region.",
          "Phát hiện tràn khi cộng; không tạo nhóm cho dòng bị lọc."
        ]
      },
      "starterCode": "use std::collections::BTreeMap;\nfn totals(rows: &[(&str, Option<i64>)], minimum: i64) -> Result<Vec<(String, i64)>, &'static str> {\n    todo!()\n}\nfn main() {\n    let rows = [(\"nam\", Some(40)), (\"bac\", Some(120)), (\"bac\", Some(80)), (\"nam\", None)];\n    assert_eq!(totals(&rows, 50), Ok(vec![(\"bac\".into(), 200)]));\n    assert_eq!(totals(&rows, 0), Ok(vec![(\"bac\".into(), 200), (\"nam\".into(), 40)]));\n    assert_eq!(totals(&[], 0), Ok(vec![]));\n    assert_eq!(totals(&[(\"x\", None)], 0), Ok(vec![]));\n    assert_eq!(totals(&[(\"x\", Some(i64::MAX)), (\"x\", Some(1))], 0), Err(\"overflow\"));\n    println!(\"bac: 200\");\n}",
      "solutionCode": "use std::collections::BTreeMap;\nfn totals(rows: &[(&str, Option<i64>)], minimum: i64) -> Result<Vec<(String, i64)>, &'static str> {\n    let mut groups = BTreeMap::<String, i64>::new();\n    for &(region, amount) in rows {\n        if let Some(value) = amount.filter(|v| *v >= minimum) {\n            let current = groups.entry(region.to_owned()).or_insert(0);\n            *current = current.checked_add(value).ok_or(\"overflow\")?;\n        }\n    }\n    Ok(groups.into_iter().collect())\n}\nfn main() {\n    let rows = [(\"nam\", Some(40)), (\"bac\", Some(120)), (\"bac\", Some(80)), (\"nam\", None)];\n    assert_eq!(totals(&rows, 50), Ok(vec![(\"bac\".into(), 200)]));\n    assert_eq!(totals(&rows, 0), Ok(vec![(\"bac\".into(), 200), (\"nam\".into(), 40)]));\n    assert_eq!(totals(&[], 0), Ok(vec![]));\n    assert_eq!(totals(&[(\"x\", None)], 0), Ok(vec![]));\n    assert_eq!(totals(&[(\"x\", Some(i64::MAX)), (\"x\", Some(1))], 0), Err(\"overflow\"));\n    println!(\"bac: 200\");\n}",
      "expectedOutput": "bac: 200",
      "hints": [
        "BTreeMap giữ nhóm theo thứ tự khóa.",
        "Lọc Option trước khi tạo entry để không sinh nhóm tổng 0 ngoài ý muốn.",
        "Kết quả đối chiếu dùng checked_add; lab engine dùng dữ liệu nằm trong miền số đã xác định."
      ],
      "quiz": {
        "question": "Bạn đọc toàn bộ CSV thành DataFrame, sau đó gọi lazy().select(...). Điều nào đúng?",
        "options": [
          "Engine có thể hoàn tác I/O đã xảy ra",
          "Lazy tự bảo đảm chỉ đọc các cột được chọn từ đầu",
          "Chi phí đọc ban đầu đã xảy ra; muốn tối ưu ở nguồn cần scan phù hợp",
          "LazyFrame luôn nhanh hơn trên mọi bảng"
        ],
        "correct": 2,
        "explanation": "Lazy tối ưu kế hoạch từ điểm nguồn hiện có. Nếu nguồn đã là DataFrame trong bộ nhớ, việc đọc CSV trước đó đã hoàn tất; scan cho phép planner thấy cả bước đọc."
      },
      "reference": {
        "label": "Polars: lazy optimizations",
        "url": "https://docs.pola.rs/user-guide/lazy/optimizations/"
      },
      "localLab": {
        "title": "Báo cáo doanh thu với Polars",
        "instructions": "Tạo Cargo project theo các tệp dưới đây. Dữ liệu đã ở trong bộ nhớ để kiểm tra expressions và null; lab chưa đo lợi ích I/O của scan. Chạy test trước, sau đó chạy chương trình. Lưu Cargo.lock được Cargo tạo để tái hiện các dependency. Lần biên dịch đầu của Polars có thể mất vài phút.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"polars-report\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\npolars = { version = \"=0.55.2\", default-features = false, features = [\"lazy\"] }\n\n[profile.dev]\ndebug = 0\n\n[profile.test]\ndebug = 0\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use polars::prelude::*;\n\npub fn report(input: DataFrame, minimum: i64) -> PolarsResult<DataFrame> {\n    input.lazy()\n        .filter(col(\"amount\").gt_eq(lit(minimum)))\n        .group_by([col(\"region\")])\n        .agg([col(\"amount\").sum().alias(\"total\")])\n        .sort_by_exprs([col(\"region\")], Default::default())\n        .collect()\n}\n\npub fn sample() -> PolarsResult<DataFrame> {\n    df![\n        \"region\" => [\"nam\", \"bac\", \"bac\", \"nam\"],\n        \"amount\" => [Some(40_i64), Some(120), Some(80), None]\n    ]\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use polars::prelude::*;\nuse polars_report::{report, sample};\n\nfn main() -> PolarsResult<()> {\n    let result = report(sample()?, 0)?;\n    let regions = result.column(\"region\")?.str()?;\n    let totals = result.column(\"total\")?.i64()?;\n    for index in 0..result.height() {\n        let region = regions.get(index).unwrap_or(\"(thiếu vùng)\");\n        match totals.get(index) {\n            Some(total) => println!(\"{region}: {total}\"),\n            None => println!(\"{region}: null\"),\n        }\n    }\n    Ok(())\n}\n"
          },
          {
            "path": "tests/report.rs",
            "content": "use polars::prelude::*;\nuse polars_report::{report, sample};\n\n#[test]\nfn groups_are_sorted_and_null_is_filtered() -> PolarsResult<()> {\n    let result = report(sample()?, 0)?;\n    let regions = result.column(\"region\")?.str()?;\n    assert_eq!((0..result.height()).map(|i| regions.get(i)).collect::<Vec<_>>(), vec![Some(\"bac\"), Some(\"nam\")]);\n    assert_eq!(result.column(\"total\")?.i64()?.into_no_null_iter().collect::<Vec<_>>(), vec![200, 40]);\n    Ok(())\n}\n\n#[test]\nfn threshold_changes_membership() -> PolarsResult<()> {\n    let result = report(sample()?, 50)?;\n    assert_eq!(result.height(), 1);\n    assert_eq!(result.column(\"region\")?.str()?.get(0), Some(\"bac\"));\n    assert_eq!(result.column(\"total\")?.i64()?.get(0), Some(200));\n    assert_eq!(report(sample()?, 1000)?.height(), 0);\n    Ok(())\n}\n\n#[test]\nfn typed_empty_input_keeps_valid_schema() -> PolarsResult<()> {\n    let input = df![\n        \"region\" => Vec::<String>::new(),\n        \"amount\" => Vec::<Option<i64>>::new()\n    ]?;\n    let result = report(input, 0)?;\n    assert_eq!(result.height(), 0);\n    assert!(result.column(\"total\")?.i64().is_ok());\n    Ok(())\n}\n\n#[test]\nfn missing_column_is_an_error() -> PolarsResult<()> {\n    let bad = df![\"region\" => [\"bac\"]]?; \n    assert!(report(bad, 0).is_err());\n    Ok(())\n}\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run"
        ],
        "checks": [
          "Bốn kiểm thử qua: null, ngưỡng, bảng rỗng có schema và cột bị thiếu.",
          "Chương trình in bac: 200 rồi nam: 40, không phụ thuộc thứ tự group-by.",
          "Thử bỏ bước sort và giải thích vì sao không nên dựa vào thứ tự nhóm mặc định.",
          "Đổi nguồn sang scan Parquet là bài mở rộng; đo bytes đọc để chứng minh pushdown."
        ]
      }
    },
    {
      "id": "data-joins",
      "moduleId": "track-data",
      "title": "Join, khóa trùng và ngữ nghĩa SQL",
      "description": "Kiểm soát số dòng, null và điều kiện lọc để phép ghép không âm thầm làm sai báo cáo.",
      "duration": 50,
      "objectives": [
        "Dự đoán cardinality của inner và left join",
        "Phân biệt khóa duy nhất với chỉ mục tra cứu",
        "Giải thích null và vị trí điều kiện ON/WHERE",
        "Kiểm thử join theo từng trường hợp nhỏ"
      ],
      "sections": [
        {
          "title": "Một khóa có thể khớp nhiều dòng",
          "text": "Bảng đơn hàng có một dòng customer_id=7; bảng khách hàng lại có hai dòng cùng id=7. Equi-join thông thường tạo hai cặp khớp. Nếu cộng tiền sau join, đơn hàng đó có thể bị tính hai lần. HashMap<Key, Row> dùng insert chỉ giữ một dòng cuối cũng không tương đương phép join nhiều-nhiều, vì nó âm thầm xóa một khả năng khớp.\n\nTrước khi join, viết quan hệ mong muốn: một-một, nhiều-một hay nhiều-nhiều. Nếu bảng khách hàng phải có khóa duy nhất, kiểm tra điều đó trước. Nếu nhiều phiên bản khách hàng là dữ liệu hợp lệ, bổ sung thời gian hiệu lực hoặc quy tắc chọn phiên bản; đừng chữa số dòng tăng bằng distinct không có căn cứ."
        },
        {
          "title": "Loại join quyết định dòng được giữ",
          "text": "Inner join giữ các cặp khớp. Left join còn giữ dòng bên trái không khớp, với phần bên phải bị thiếu. Semi join trả dòng bên trái có ít nhất một khớp mà không nhân bản theo số khớp; anti join tìm dòng chưa có đối tác. Chọn loại join từ câu hỏi nghiệp vụ, chẳng hạn tìm đơn chưa gắn khách hàng phù hợp với anti join.\n\nBài tập trả chỉ số dòng, không sao chép toàn bộ payload. Mỗi dòng trái sinh một cặp cho mỗi dòng phải khớp; nếu không khớp, nó sinh đúng một cặp có None. Thứ tự bài tập được quy định rõ để dễ kiểm thử; không suy ra engine tự có cùng cam kết thứ tự."
        },
        {
          "title": "Null và vị trí lọc thay đổi ý nghĩa",
          "text": "Với SQL equality thông thường, null không bằng một null khác; kết quả so sánh thuộc logic ba giá trị. Điều kiện WHERE chỉ giữ dòng khi biểu thức là true. Polars có tùy chọn join riêng cho cách xử lý null, nên phải đọc cấu hình và kiểm thử theo phiên bản thay vì giả định.\n\nSau left join, WHERE customers.active = true loại cả dòng không khớp vì active bị null. Đặt điều kiện active trong ON có thể vẫn giữ những đơn không tìm được khách hàng đang hoạt động. Hai truy vấn có cùng chữ nhưng khác vị trí điều kiện trả lời hai câu hỏi khác nhau. Viết fixture có khách hàng hoạt động, ngừng hoạt động và không tồn tại.",
          "code": "-- Chỉ giữ đơn gắn khách hàng đang hoạt động:\nSELECT o.id FROM orders o\nLEFT JOIN customers c ON o.customer_id = c.id\nWHERE c.active = true;\n\n-- Giữ mọi đơn; phần khách hàng chỉ ghép nếu đang hoạt động:\nSELECT o.id, c.id FROM orders o\nLEFT JOIN customers c ON o.customer_id = c.id AND c.active = true;"
        },
        {
          "title": "Kiểm soát dữ liệu lệch và kích thước đầu ra",
          "text": "Khóa phổ biến xuất hiện rất nhiều ở hai phía có thể tạo đầu ra lớn theo tích số lần xuất hiện. Khi đó tăng RAM hoặc số worker chưa giải quyết đúng nguyên nhân. Theo dõi số khóa khác nhau, nhóm lớn nhất, số dòng trước/sau join và tỷ lệ không khớp. Dữ liệu lệch còn khiến một partition làm việc lâu hơn phần còn lại.\n\nKiểm thử join cần ca khóa trùng ở cả hai bảng, khóa thiếu, null và bảng rỗng. Với tiền, đối chiếu tổng trước/sau theo hợp đồng. Chỉ dùng COUNT(*) hay COUNT(cột) sau khi biết mình muốn đếm dòng kết quả hay giá trị không null. Một phép join đúng cú pháp vẫn có thể sai mô hình nghiệp vụ."
        }
      ],
      "tip": "Nếu một join nhiều-một làm tăng số dòng trái, hãy kiểm tra khóa bên phải trước khi thêm distinct.",
      "exercise": {
        "title": "Left join trả chỉ số dòng",
        "instructions": "Viết left_join cho các khóa Option<u32>. Khóa None không khớp với bất kỳ khóa nào, kể cả None. Giữ mọi kết hợp của khóa trùng và thứ tự chỉ số.",
        "requirements": [
          "Duyệt dòng trái theo thứ tự; các dòng phải khớp cũng theo thứ tự đầu vào.",
          "Một dòng không khớp trả đúng một cặp (left_index, None).",
          "Không làm mất dòng phải trùng khóa; đầu vào trái rỗng cho đầu ra rỗng."
        ]
      },
      "starterCode": "use std::collections::HashMap;\nfn left_join(left: &[Option<u32>], right: &[Option<u32>]) -> Vec<(usize, Option<usize>)> {\n    todo!()\n}\nfn main() {\n    let joined = left_join(&[Some(7), Some(9), None], &[Some(7), None, Some(7)]);\n    assert_eq!(joined, vec![(0, Some(0)), (0, Some(2)), (1, None), (2, None)]);\n    assert_eq!(left_join(&[None], &[None]), vec![(0, None)]);\n    assert_eq!(left_join(&[Some(1)], &[]), vec![(0, None)]);\n    assert_eq!(left_join(&[], &[Some(1)]), vec![]);\n    assert_eq!(left_join(&[Some(2), Some(2)], &[Some(2)]), vec![(0, Some(0)), (1, Some(0))]);\n    println!(\"3 dòng trái tạo 4 dòng kết quả\");\n}",
      "solutionCode": "use std::collections::HashMap;\nfn left_join(left: &[Option<u32>], right: &[Option<u32>]) -> Vec<(usize, Option<usize>)> {\n    let mut index = HashMap::<u32, Vec<usize>>::new();\n    for (j, key) in right.iter().enumerate() {\n        if let Some(key) = key {\n            index.entry(*key).or_default().push(j);\n        }\n    }\n    let mut result = Vec::new();\n    for (i, key) in left.iter().enumerate() {\n        match key.and_then(|key| index.get(&key)) {\n            Some(matches) => result.extend(matches.iter().map(|&j| (i, Some(j)))),\n            None => result.push((i, None)),\n        }\n    }\n    result\n}\nfn main() {\n    let joined = left_join(&[Some(7), Some(9), None], &[Some(7), None, Some(7)]);\n    assert_eq!(joined, vec![(0, Some(0)), (0, Some(2)), (1, None), (2, None)]);\n    assert_eq!(left_join(&[None], &[None]), vec![(0, None)]);\n    assert_eq!(left_join(&[Some(1)], &[]), vec![(0, None)]);\n    assert_eq!(left_join(&[], &[Some(1)]), vec![]);\n    assert_eq!(left_join(&[Some(2), Some(2)], &[Some(2)]), vec![(0, Some(0)), (1, Some(0))]);\n    println!(\"3 dòng trái tạo 4 dòng kết quả\");\n}",
      "expectedOutput": "3 dòng trái tạo 4 dòng kết quả",
      "hints": [
        "Chỉ mục cần HashMap<u32, Vec<usize>>, không phải một chỉ số duy nhất.",
        "Không đưa khóa None vào chỉ mục.",
        "Không duyệt HashMap để xuất kết quả; duyệt left rồi Vec chỉ số để giữ thứ tự."
      ],
      "quiz": {
        "question": "Một dòng đơn hàng có customer_id=7 ghép với ba dòng khách hàng có id=7 bằng inner join. Có bao nhiêu dòng kết quả cho đơn đó?",
        "options": [
          "Một, vì customer_id là số",
          "Ba, vì có ba cặp khớp",
          "Không, vì khóa trùng luôn gây lỗi SQL",
          "Tùy ý, vì hash join chọn ngẫu nhiên một dòng"
        ],
        "correct": 1,
        "explanation": "Equi-join giữ các cặp khớp trừ khi có thêm ràng buộc/quy tắc khác. Nếu hợp đồng yêu cầu nhiều-một, cần xác thực tính duy nhất của khóa bên phải."
      },
      "reference": {
        "label": "Polars: các loại join",
        "url": "https://docs.pola.rs/user-guide/transformations/joins/"
      }
    },
    {
      "id": "data-datafusion",
      "moduleId": "track-data",
      "title": "DataFusion: từ SQL đến RecordBatch",
      "description": "Nhúng query engine vào Rust, đăng ký nguồn Arrow và hiểu tổng hợp qua nhiều partition.",
      "duration": 65,
      "objectives": [
        "Dùng SessionContext và MemTable với schema rõ ràng",
        "Phân biệt logical plan, physical plan và kết quả",
        "Tổng hợp theo trạng thái có thể gộp qua partition",
        "Kiểm tra SUM, COUNT và tập dữ liệu rỗng"
      ],
      "sections": [
        {
          "title": "Engine nằm trong ứng dụng Rust",
          "text": "DataFusion là thư viện query engine có SQL và DataFrame API. SessionContext quản lý môi trường lập kế hoạch như bảng đã đăng ký và hàm được cung cấp. Lab tạo RecordBatch bằng Arrow rồi đăng ký MemTable, vì vậy không cần dịch vụ cơ sở dữ liệu riêng. Dữ liệu vẫn thuộc tiến trình và có chi phí bộ nhớ thật.\n\nĐừng suy ra một engine nhúng tự cung cấp giao dịch nghiệp vụ, quản lý người dùng hay cách ly tenant như hệ thống hoàn chỉnh. Ứng dụng quyết định nguồn nào được đăng ký và ai được truy vấn. Lab dùng SQL cố định; nếu mở SQL cho người khác, phải thiết kế quyền, nguồn dữ liệu và giới hạn tài nguyên riêng."
        },
        {
          "title": "Ba lớp cần đọc được",
          "text": "Logical plan mô tả ý nghĩa: quét bảng, lọc, nhóm và chọn cột. Physical plan bổ sung cách thực hiện như loại join, repartition và sort. Kết quả là các RecordBatch được tạo khi thực thi. Một truy vấn lập kế hoạch thành công vẫn có thể lỗi khi đọc dữ liệu hoặc cạn tài nguyên trong lúc chạy.\n\nDùng EXPLAIN để đọc kế hoạch mà chưa thực thi truy vấn dữ liệu. EXPLAIN ANALYZE thực thi rồi thu thông tin đo, nên có chi phí thực và cần dùng trên truy vấn phù hợp. Trong lab, kiểm tra lỗi cột không tồn tại và kiểm tra kết quả bằng giá trị có kiểu; không phụ thuộc bảng ASCII dùng để hiển thị.",
          "code": "// Sau khi đã đăng ký bảng orders trong SessionContext:\nlet query = ctx.sql(\n    \"SELECT region, SUM(amount) AS total, COUNT(amount) AS known \\\n     FROM orders GROUP BY region ORDER BY region\"\n).await?;\nlet batches = query.collect().await?;"
        },
        {
          "title": "Aggregate phải gộp được trạng thái",
          "text": "Engine có thể chia dữ liệu thành nhiều partition để xử lý song song. Tổng và số lượng có thể tính cục bộ rồi cộng lại. Trung bình không thể lấy trung bình đơn giản của các trung bình cục bộ nếu số quan sát khác nhau: nhóm một giá trị và nhóm một nghìn giá trị phải có trọng số khác nhau.\n\nLưu trạng thái sum và count rồi chia một lần ở cuối. Với null, đếm riêng số hàng và số giá trị đã biết: COUNT(*) và COUNT(amount) có ý nghĩa khác nhau. Bài tập dùng i128 cho tổng các i64 để có thêm miền biểu diễn, nhưng vẫn kiểm tra tràn khi gộp; kiểu rộng hơn không có nghĩa là vô hạn."
        },
        {
          "title": "Partition không phải cam kết thứ tự",
          "text": "Một partition thực thi là phần công việc engine xử lý; nó không nhất thiết tương ứng một thư mục ngày trên đĩa hay một RecordBatch. MemTable nhận danh sách partition, mỗi partition gồm các batch cùng schema. Tập rỗng vẫn cần schema và ít nhất một partition rỗng. Đừng dùng việc có dữ liệu để đoán schema mỗi lần chạy.\n\nLab ghim DataFusion 55.2.0, dùng Arrow được crate này re-export để tránh ghép hai phiên bản kiểu Arrow không tương thích. Kết quả được ORDER BY region và đối chiếu giữa một partition với hai partition. Test thêm nhóm chỉ có null và bảng rỗng để khóa hành vi trước khi đổi kế hoạch thực thi."
        }
      ],
      "tip": "AVG cần sum và count, không chỉ một số trung bình của mỗi partition.",
      "exercise": {
        "title": "Gộp trạng thái aggregate",
        "instructions": "Hoàn thiện partial và merge. Trạng thái ghi tổng, số giá trị hợp lệ và số hàng; gộp các partition phải cho cùng kết quả với đọc toàn bộ.",
        "requirements": [
          "None tăng rows nhưng không tăng known và không đổi sum.",
          "Gộp ba trường bằng checked_add, lỗi tràn trả Err(\"overflow\").",
          "Tập rỗng có trạng thái mặc định; không chia khi known=0."
        ]
      },
      "starterCode": "#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]\nstruct Stats { sum: i128, known: u64, rows: u64 }\nfn merge(a: Stats, b: Stats) -> Result<Stats, &'static str> { todo!() }\nfn partial(values: &[Option<i64>]) -> Result<Stats, &'static str> { todo!() }\nfn main() {\n    let a = partial(&[Some(10), None]).unwrap();\n    let b = partial(&[Some(20), Some(30), Some(40)]).unwrap();\n    let combined = merge(a, b).unwrap();\n    assert_eq!(combined, Stats { sum: 100, known: 4, rows: 5 });\n    assert_eq!(combined, partial(&[Some(10), None, Some(20), Some(30), Some(40)]).unwrap());\n    assert_eq!(merge(combined, Stats::default()), Ok(combined));\n    assert_eq!(partial(&[None, None]), Ok(Stats { sum: 0, known: 0, rows: 2 }));\n    assert_eq!(merge(Stats { sum: i128::MAX, known: 1, rows: 1 }, b), Err(\"overflow\"));\n    assert_eq!(merge(Stats { sum: 0, known: 0, rows: u64::MAX }, a), Err(\"overflow\"));\n    println!(\"Tổng: {}; hợp lệ: {}; số hàng: {}\", combined.sum, combined.known, combined.rows);\n}",
      "solutionCode": "#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]\nstruct Stats { sum: i128, known: u64, rows: u64 }\nfn merge(a: Stats, b: Stats) -> Result<Stats, &'static str> {\n    Ok(Stats {\n        sum: a.sum.checked_add(b.sum).ok_or(\"overflow\")?,\n        known: a.known.checked_add(b.known).ok_or(\"overflow\")?,\n        rows: a.rows.checked_add(b.rows).ok_or(\"overflow\")?,\n    })\n}\nfn partial(values: &[Option<i64>]) -> Result<Stats, &'static str> {\n    values.iter().try_fold(Stats::default(), |state, value| {\n        merge(state, Stats {\n            sum: value.map(i128::from).unwrap_or(0),\n            known: u64::from(value.is_some()),\n            rows: 1,\n        })\n    })\n}\nfn main() {\n    let a = partial(&[Some(10), None]).unwrap();\n    let b = partial(&[Some(20), Some(30), Some(40)]).unwrap();\n    let combined = merge(a, b).unwrap();\n    assert_eq!(combined, Stats { sum: 100, known: 4, rows: 5 });\n    assert_eq!(combined, partial(&[Some(10), None, Some(20), Some(30), Some(40)]).unwrap());\n    assert_eq!(merge(combined, Stats::default()), Ok(combined));\n    assert_eq!(partial(&[None, None]), Ok(Stats { sum: 0, known: 0, rows: 2 }));\n    assert_eq!(merge(Stats { sum: i128::MAX, known: 1, rows: 1 }, b), Err(\"overflow\"));\n    assert_eq!(merge(Stats { sum: 0, known: 0, rows: u64::MAX }, a), Err(\"overflow\"));\n    println!(\"Tổng: {}; hợp lệ: {}; số hàng: {}\", combined.sum, combined.known, combined.rows);\n}",
      "expectedOutput": "Tổng: 100; hợp lệ: 4; số hàng: 5",
      "hints": [
        "Mỗi phần tử có thể chuyển thành một Stats nhỏ rồi merge.",
        "Option<i64> ánh xạ sang i128 trước khi cộng.",
        "Trạng thái mặc định đóng vai trò phần tử đơn vị của phép gộp trong miền không tràn."
      ],
      "quiz": {
        "question": "Partition A có trung bình 10 từ một giá trị, B có trung bình 30 từ ba giá trị. Trung bình toàn bộ là gì?",
        "options": [
          "20, lấy (10 + 30) / 2",
          "25, lấy (10 × 1 + 30 × 3) / 4",
          "30, chọn partition lớn hơn",
          "Không thể gộp bất kỳ aggregate nào"
        ],
        "correct": 1,
        "explanation": "Phải giữ số lượng để tính trọng số. Trạng thái sum/count cho A là 10/1, B là 90/3; tổng là 100/4 = 25."
      },
      "reference": {
        "label": "DataFusion: kiến trúc và thực thi",
        "url": "https://docs.rs/datafusion/55.2.0/datafusion/"
      },
      "localLab": {
        "title": "Truy vấn SQL trên Arrow với DataFusion",
        "instructions": "Dùng Rust từ 1.94 trở lên cho DataFusion 55.2.0. Tạo các tệp sau trong Cargo project mới; dependency tắt mặc định và chỉ bật SQL cần cho lab. Dữ liệu Arrow được tạo trong bộ nhớ, không cần cài database. Lần build đầu có nhiều dependency; lưu Cargo.lock sau khi chạy thành công.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname = \"datafusion-report\"\nversion = \"0.1.0\"\nedition = \"2024\"\nrust-version = \"1.94\"\n\n[dependencies]\ndatafusion = { version = \"=55.2.0\", default-features = false, features = [\"sql\"] }\ntokio = { version = \"=1.54.1\", features = [\"macros\", \"rt-multi-thread\"] }\n\n[profile.dev]\ndebug = 0\n\n[profile.test]\ndebug = 0\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::sync::Arc;\nuse datafusion::arrow::array::{Int64Array, StringArray};\nuse datafusion::arrow::datatypes::{DataType, Field, Schema, SchemaRef};\nuse datafusion::arrow::record_batch::RecordBatch;\nuse datafusion::datasource::MemTable;\nuse datafusion::error::Result;\nuse datafusion::prelude::SessionContext;\n\npub const QUERY: &str = \"SELECT region, SUM(amount) AS total, COUNT(amount) AS known FROM orders GROUP BY region ORDER BY region\";\n\npub fn schema() -> SchemaRef {\n    Arc::new(Schema::new(vec![\n        Field::new(\"region\", DataType::Utf8, false),\n        Field::new(\"amount\", DataType::Int64, true),\n    ]))\n}\n\npub fn batch(regions: Vec<&str>, amounts: Vec<Option<i64>>) -> Result<RecordBatch> {\n    Ok(RecordBatch::try_new(schema(), vec![\n        Arc::new(StringArray::from(regions)),\n        Arc::new(Int64Array::from(amounts)),\n    ])?)\n}\n\npub fn context(partitions: Vec<Vec<RecordBatch>>) -> Result<SessionContext> {\n    let table = MemTable::try_new(schema(), partitions)?;\n    let ctx = SessionContext::new();\n    ctx.register_table(\"orders\", Arc::new(table))?;\n    Ok(ctx)\n}\n\npub async fn report(ctx: &SessionContext) -> Result<Vec<RecordBatch>> {\n    ctx.sql(QUERY).await?.collect().await\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use datafusion::error::Result;\nuse datafusion_report::{batch, context, QUERY};\n\n#[tokio::main]\nasync fn main() -> Result<()> {\n    let ctx = context(vec![\n        vec![batch(vec![\"bac\", \"nam\"], vec![Some(120), None])?],\n        vec![batch(vec![\"bac\", \"nam\"], vec![Some(80), Some(40)])?],\n    ])?;\n    ctx.sql(QUERY).await?.show().await?;\n    Ok(())\n}\n"
          },
          {
            "path": "tests/query.rs",
            "content": "use datafusion::arrow::array::{Array, Int64Array, StringArray};\nuse datafusion::arrow::record_batch::RecordBatch;\nuse datafusion::error::Result;\nuse datafusion_report::{batch, context, report, QUERY};\n\nfn rows(batches: &[RecordBatch]) -> Vec<(String, Option<i64>, i64)> {\n    let mut out = Vec::new();\n    for batch in batches {\n        let region = batch.column(0).as_any().downcast_ref::<StringArray>().expect(\"region Utf8\");\n        let total = batch.column(1).as_any().downcast_ref::<Int64Array>().expect(\"total Int64\");\n        let known = batch.column(2).as_any().downcast_ref::<Int64Array>().expect(\"count Int64\");\n        for i in 0..batch.num_rows() {\n            out.push((region.value(i).to_owned(), (!total.is_null(i)).then(|| total.value(i)), known.value(i)));\n        }\n    }\n    out\n}\n\n#[tokio::test]\nasync fn aggregate_is_independent_of_input_partitioning() -> Result<()> {\n    let one = context(vec![vec![batch(vec![\"bac\", \"nam\", \"bac\", \"nam\"], vec![Some(120), None, Some(80), Some(40)])?]])?;\n    let two = context(vec![\n        vec![batch(vec![\"bac\", \"nam\"], vec![Some(120), None])?],\n        vec![batch(vec![\"bac\", \"nam\"], vec![Some(80), Some(40)])?],\n    ])?;\n    let expected = vec![(\"bac\".to_owned(), Some(200), 2), (\"nam\".to_owned(), Some(40), 1)];\n    assert_eq!(rows(&report(&one).await?), expected);\n    assert_eq!(rows(&report(&two).await?), expected);\n    Ok(())\n}\n\n#[tokio::test]\nasync fn all_null_group_has_null_sum_and_zero_count() -> Result<()> {\n    let ctx = context(vec![vec![batch(vec![\"bac\", \"bac\"], vec![None, None])?]])?;\n    assert_eq!(rows(&report(&ctx).await?), vec![(\"bac\".to_owned(), None, 0)]);\n    Ok(())\n}\n\n#[tokio::test]\nasync fn empty_table_has_no_groups() -> Result<()> {\n    let ctx = context(vec![vec![]])?;\n    assert!(rows(&report(&ctx).await?).is_empty());\n    Ok(())\n}\n\n#[tokio::test]\nasync fn explain_and_unknown_column_have_expected_behavior() -> Result<()> {\n    let ctx = context(vec![vec![batch(vec![\"bac\"], vec![Some(1)])?]])?;\n    let plan = ctx.sql(&format!(\"EXPLAIN {QUERY}\")).await?.collect().await?;\n    assert!(plan.iter().map(RecordBatch::num_rows).sum::<usize>() > 0);\n    assert!(ctx.sql(\"SELECT missing_column FROM orders\").await.is_err());\n    Ok(())\n}\n\n#[test]\nfn mismatched_array_lengths_are_rejected() {\n    assert!(batch(vec![\"bac\", \"nam\"], vec![Some(1)]).is_err());\n}\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run"
        ],
        "checks": [
          "Năm test qua, gồm chia partition khác nhau, nhóm toàn null, bảng rỗng, lỗi cột và độ dài mảng sai.",
          "Chương trình hiển thị bac có total=200/known=2, nam có total=40/known=1.",
          "Schema Arrow được lấy từ datafusion::arrow để dùng cùng hệ phiên bản.",
          "Mở rộng với execute_stream khi kết quả lớn; không giữ mọi batch trong Vec nếu không cần."
        ]
      }
    },
    {
      "id": "data-streaming",
      "moduleId": "track-data",
      "title": "Streaming, Parquet và giới hạn bộ nhớ",
      "description": "Thiết kế luồng theo batch, phân biệt bộ đệm đầu ra với trạng thái operator và đo giới hạn tài nguyên.",
      "duration": 55,
      "objectives": [
        "Phân biệt collect toàn bộ với tiêu thụ stream",
        "Nhận diện sort, hash join và aggregate giữ trạng thái",
        "Chọn batch theo byte thay vì chỉ số hàng",
        "Giải thích pruning, spill và backpressure"
      ],
      "sections": [
        {
          "title": "Stream đầu ra chưa đủ để giới hạn RAM",
          "text": "DataFusion collect gom các RecordBatch đầu ra vào bộ nhớ; execute_stream cho phép tiêu thụ dần. Việc không giữ tất cả kết quả giảm một nguồn dùng RAM, nhưng bên trong truy vấn còn trạng thái khác. Hash join cần lưu phía xây bảng băm; group-by giữ trạng thái theo số nhóm; sort có thể phải đợi nhiều dữ liệu trước khi phát kết quả.\n\nVì vậy hãy lập danh sách bộ nhớ: nguồn đã nạp, batch đang xử lý, hàng đợi, trạng thái operator và kết quả người gọi giữ lại. Đổi collect thành stream rồi vẫn push mọi batch vào một Vec không giải quyết vấn đề. Khi hủy truy vấn, vòng đời task, stream và nơi ghi đầu ra cũng cần được dừng đồng bộ."
        },
        {
          "title": "Batch cần ngân sách theo kích thước",
          "text": "Một nghìn hàng chỉ có số nguyên khác rất xa một nghìn hàng chứa chuỗi dài hoặc danh sách lồng nhau. Giới hạn số hàng giúp điều phối, nhưng giới hạn byte mới gần với mục tiêu tài nguyên. Dùng số đo hoặc ước lượng phù hợp layout, đồng thời hiểu buffer có thể được chia sẻ; cộng kích thước nhiều view có thể đếm lại cùng dữ liệu.\n\nBài tập chia dãy kích thước thành những khoảng liên tiếp không vượt budget. Một hàng lớn hơn budget phải báo lỗi hoặc đi vào chính sách xử lý riêng, không cứ thử lại mãi. Hàm trả khoảng chỉ số để không sao chép payload; chi phí thực của mảng, offset, allocator vẫn cần đo ở pipeline đầy đủ."
        },
        {
          "title": "Parquet giảm công việc khi truy vấn phù hợp",
          "text": "Parquet lưu dữ liệu theo cột, có row group và metadata giúp engine bỏ qua phần không cần đọc khi điều kiện cho phép. Chỉ cần region và amount thì projection có thể tránh đọc cột ghi chú lớn. Điều kiện theo ngày cũng có thể tận dụng cách chia thư mục hoặc thống kê, nhưng khả năng bỏ qua phụ thuộc dữ liệu, định dạng và planner.\n\nNhiều tệp rất nhỏ tăng chi phí metadata và mở tệp; một tệp quá lớn có thể giảm linh hoạt phân chia công việc. Chọn kích thước theo workload rồi đo. Scan tạo cơ hội tối ưu tại nguồn; đọc hết tệp rồi mới lọc vẫn phải trả chi phí đọc ban đầu.",
          "code": "// Thiết kế luồng ở mức ứng dụng:\n// đọc batch -> xác thực -> biến đổi -> ghi batch\n// Giới hạn số batch đang đợi giữa các bước.\n// Khi nơi ghi chậm, ngừng đọc thêm thay vì tăng hàng đợi vô hạn."
        },
        {
          "title": "Giới hạn song song, spill và quan sát",
          "text": "Tăng partition thường tăng số công việc đồng thời và cả phần bộ nhớ riêng cho mỗi công việc. Memory pool và spill của engine giúp điều phối operator được hỗ trợ, nhưng không thay thế giới hạn toàn tiến trình. Spill còn tiêu tốn đĩa và I/O; cấu hình không có đường spill phù hợp có thể khiến truy vấn báo thiếu tài nguyên.\n\nHãy thử một trường hợp nhiều khóa khác nhau, một khóa rất lệch và một downstream ghi chậm. Ghi peak RSS, số batch chờ, dung lượng spill và thời gian chờ I/O. Đặt giới hạn concurrency ở ứng dụng, kiểm tra timeout và dọn tệp chưa commit khi hủy. Báo cáo cần nêu trường hợp nào đã được đo, không khẳng định mọi dữ liệu đều vừa RAM."
        }
      ],
      "tip": "Giới hạn hàng đợi theo byte khi độ rộng hàng thay đổi; theo dõi cả trạng thái bên trong operator.",
      "exercise": {
        "title": "Chia batch theo ngân sách byte",
        "instructions": "Hoàn thiện batch_ranges, trả các khoảng [start, end) phủ đúng dãy đầu vào, giữ thứ tự và tổng kích thước mỗi khoảng không vượt budget.",
        "requirements": [
          "budget phải lớn hơn 0; nếu không trả Err(\"budget\").",
          "Một phần tử lớn hơn budget trả Err(\"oversized\"); kích thước 0 vẫn là một hàng.",
          "Không cộng usize có thể tràn; đầu vào rỗng trả Vec rỗng.",
          "Mỗi batch không rỗng và lấy nhiều hàng liên tiếp nhất có thể theo budget."
        ]
      },
      "starterCode": "fn batch_ranges(sizes: &[usize], budget: usize) -> Result<Vec<(usize, usize)>, &'static str> {\n    todo!()\n}\nfn main() {\n    assert_eq!(batch_ranges(&[3, 4, 2, 8, 0], 8), Ok(vec![(0, 2), (2, 3), (3, 5)]));\n    assert_eq!(batch_ranges(&[], 8), Ok(vec![]));\n    assert_eq!(batch_ranges(&[0, 0, 0], 1), Ok(vec![(0, 3)]));\n    assert_eq!(batch_ranges(&[9], 8), Err(\"oversized\"));\n    assert_eq!(batch_ranges(&[1], 0), Err(\"budget\"));\n    assert_eq!(batch_ranges(&[usize::MAX - 1, 2], usize::MAX), Ok(vec![(0, 1), (1, 2)]));\n    println!(\"5 hàng được chia thành 3 batch\");\n}",
      "solutionCode": "fn batch_ranges(sizes: &[usize], budget: usize) -> Result<Vec<(usize, usize)>, &'static str> {\n    if budget == 0 { return Err(\"budget\"); }\n    if sizes.iter().any(|&size| size > budget) { return Err(\"oversized\"); }\n    let mut result = Vec::new();\n    let (mut start, mut used) = (0, 0);\n    for (i, &size) in sizes.iter().enumerate() {\n        if size > budget - used {\n            result.push((start, i));\n            start = i;\n            used = 0;\n        }\n        used += size; // Điều kiện trên bảo đảm used + size <= budget.\n    }\n    if start < sizes.len() { result.push((start, sizes.len())); }\n    Ok(result)\n}\nfn main() {\n    assert_eq!(batch_ranges(&[3, 4, 2, 8, 0], 8), Ok(vec![(0, 2), (2, 3), (3, 5)]));\n    assert_eq!(batch_ranges(&[], 8), Ok(vec![]));\n    assert_eq!(batch_ranges(&[0, 0, 0], 1), Ok(vec![(0, 3)]));\n    assert_eq!(batch_ranges(&[9], 8), Err(\"oversized\"));\n    assert_eq!(batch_ranges(&[1], 0), Err(\"budget\"));\n    assert_eq!(batch_ranges(&[usize::MAX - 1, 2], usize::MAX), Ok(vec![(0, 1), (1, 2)]));\n    println!(\"5 hàng được chia thành 3 batch\");\n}",
      "expectedOutput": "5 hàng được chia thành 3 batch",
      "hints": [
        "So sánh size với budget - used để tránh phép cộng có thể tràn.",
        "Chỉ bắt đầu batch mới khi hàng tiếp theo không còn vừa.",
        "Kết thúc vòng lặp nhớ thêm phần đuôi; input rỗng không sinh batch."
      ],
      "quiz": {
        "question": "Một truy vấn trả kết quả bằng stream nhưng group-by trên hàng triệu khóa khác nhau. Điều nào đúng?",
        "options": [
          "RAM chắc chắn cố định vì đầu ra là stream",
          "Trạng thái nhóm vẫn có thể lớn; cần đo và cấu hình giới hạn phù hợp",
          "Mỗi khóa luôn chỉ tốn một byte",
          "Thêm mọi batch vào Vec sẽ giảm RAM"
        ],
        "correct": 1,
        "explanation": "Stream tránh giữ toàn bộ đầu ra một lúc, nhưng không xóa trạng thái operator. Số nhóm, kiểu dữ liệu, thuật toán và spill quyết định chi phí còn lại."
      },
      "reference": {
        "label": "DataFusion: cấu hình và truy vấn giới hạn bộ nhớ",
        "url": "https://datafusion.apache.org/user-guide/configs.html"
      }
    },
    {
      "id": "data-production",
      "moduleId": "track-data",
      "title": "Kiểm thử, benchmark và công bố dataset",
      "description": "Đưa pipeline tới trạng thái có thể tái hiện, chạy lại sau lỗi và giải thích kết quả trong buổi review.",
      "duration": 60,
      "objectives": [
        "Viết test hợp đồng và đối chiếu hai cách tính",
        "Đo hiệu năng trên dữ liệu có kích thước, phân bố và cache rõ ràng",
        "Thiết kế batch idempotent và manifest có phiên bản",
        "Phân biệt kiểm thử lõi thuần với commit bền vững"
      ],
      "sections": [
        {
          "title": "Đúng trước, nhanh sau",
          "text": "Bộ fixture cần nhỏ để tính tay nhưng đủ các ca: null, khóa trùng, bảng rỗng, số âm, ngày biên và nhóm rất lệch. Đối chiếu Polars với hàm Rust đơn giản hoặc một truy vấn DataFusion có cùng hợp đồng. Hai engine cùng sai do cùng một giả định nghiệp vụ vẫn có thể trả kết quả giống nhau, nên cần cả đáp án được xác định độc lập.\n\nKiểm thử tính chất giúp mở rộng phạm vi: chia batch rồi gộp phải tương đương xử lý một lượt trong miền số đã chọn; chạy lại cùng đầu vào không nhân đôi doanh thu. Với số thực, thứ tự cộng có thể đổi sai số làm tròn. Hãy định nghĩa sai số chấp nhận hoặc dùng đơn vị tiền nguyên thích hợp."
        },
        {
          "title": "Benchmark phải có câu hỏi cụ thể",
          "text": "Muốn giảm thời gian đọc, hãy đo I/O; muốn giảm CPU, tách thời gian biến đổi khỏi bước tải dữ liệu. Chạy build release, ghi phiên bản Rust, dependency và cấu hình máy. Đo nhiều lần với dữ liệu có kích thước và phân bố đã lưu, nêu rõ cache nóng hay lạnh, đồng thời kiểm tra đầu ra trước khi so tốc độ.\n\nBáo cáo thời gian trung vị, độ phân tán, peak RSS và throughput phù hợp. Truy vấn nhanh vì trả thiếu một cột không phải tối ưu tương đương. Flamegraph giúp tìm nơi tiêu CPU, nhưng không tự chứng minh nguyên nhân chờ đĩa. Khi so hai bản, giữ nguyên câu hỏi, dữ liệu và các giới hạn tài nguyên."
        },
        {
          "title": "Tách tạo dữ liệu khỏi công bố",
          "text": "Ghi trực tiếp vào nơi người đọc đang quét có thể để lộ tập nửa cũ nửa mới. Một thiết kế dễ kiểm tra hơn là ghi tệp bất biến vào phiên bản mới, xác thực schema/count/checksum, rồi đổi manifest trỏ tới phiên bản hoàn chỉnh. Bước đổi tham chiếu cần primitive nguyên tử phù hợp nơi lưu trữ và kiểm tra phiên bản đã đọc để phát hiện người ghi cạnh tranh.\n\nKhông giả định rename thư mục trên object storage có tính chất như filesystem cục bộ. Metadata transaction hoặc conditional write có thể là phần của cơ chế commit. Giữ lịch sử manifest để rollback, và chỉ dọn tệp mồ côi sau khi biết không còn phiên bản nào tham chiếu chúng."
        },
        {
          "title": "Retry phải nhận ra dữ liệu đã xử lý",
          "text": "Một batch có định danh ổn định và dấu nhận diện nội dung. Nếu lần chạy sau gặp cùng tên và cùng nội dung, nó trả trạng thái đã có thay vì cộng thêm. Cùng tên nhưng nội dung khác là xung đột cần giải quyết, không được ghi đè im lặng. Thay đổi schema cũng cần phiên bản và quy tắc tương thích, thay vì dựa vào tên tệp.\n\nBài tập cài chính sách này trên manifest trong bộ nhớ, kiểm tra mọi lỗi trước khi thay đổi trạng thái. Nó chưa cung cấp lưu trữ bền vững hoặc khóa giữa tiến trình. Capstone bổ sung commit thật và mô phỏng crash trước/sau commit; README phải chỉ ra bước nào có thể chạy lại an toàn."
        }
      ],
      "tip": "Một báo cáo đáng tin cần biết dữ liệu nào, mã phiên bản nào và cấu hình nào đã tạo ra nó.",
      "exercise": {
        "title": "Ghi nhận partition không cộng trùng",
        "instructions": "Hoàn thiện Manifest::record. Cùng tên và cùng metadata là lần thử lại; khác metadata là xung đột. Khi lỗi, manifest phải giữ nguyên.",
        "requirements": [
          "Tên rỗng hoặc toàn khoảng trắng trả Err(\"name\").",
          "Partition đã có và bằng nhau trả Ok(false); khác checksum hoặc rows trả Err(\"conflict\").",
          "Partition mới cộng rows bằng checked_add, tràn trả Err(\"overflow\") và không chèn.",
          "Chèn mới thành công trả Ok(true); checksum là metadata giả lập, hàm không tự băm dữ liệu."
        ]
      },
      "starterCode": "use std::collections::BTreeMap;\n#[derive(Debug, Clone, PartialEq, Eq)]\nstruct Partition { checksum: String, rows: u64 }\n#[derive(Debug, Clone, Default, PartialEq, Eq)]\nstruct Manifest { parts: BTreeMap<String, Partition>, total_rows: u64 }\nimpl Manifest {\n    fn record(&mut self, name: &str, part: Partition) -> Result<bool, &'static str> {\n        todo!()\n    }\n}\nfn part(checksum: &str, rows: u64) -> Partition { Partition { checksum: checksum.into(), rows } }\nfn main() {\n    let mut manifest = Manifest::default();\n    assert_eq!(manifest.record(\"day-01\", part(\"hash-a\", 3)), Ok(true));\n    assert_eq!(manifest.record(\"day-01\", part(\"hash-a\", 3)), Ok(false));\n    let saved = manifest.clone();\n    assert_eq!(manifest.record(\"day-01\", part(\"hash-b\", 3)), Err(\"conflict\"));\n    assert_eq!(manifest.record(\"day-01\", part(\"hash-a\", 4)), Err(\"conflict\"));\n    assert_eq!(manifest.record(\" \", part(\"hash-c\", 1)), Err(\"name\"));\n    assert_eq!(manifest, saved);\n    assert_eq!(manifest.record(\"day-02\", part(\"hash-c\", 2)), Ok(true));\n    let mut full = Manifest::default();\n    full.record(\"full\", part(\"x\", u64::MAX)).unwrap();\n    let snapshot = full.clone();\n    assert_eq!(full.record(\"extra\", part(\"y\", 1)), Err(\"overflow\"));\n    assert_eq!(full, snapshot);\n    println!(\"{} partition; {} hàng; retry không cộng trùng\", manifest.parts.len(), manifest.total_rows);\n}",
      "solutionCode": "use std::collections::BTreeMap;\n#[derive(Debug, Clone, PartialEq, Eq)]\nstruct Partition { checksum: String, rows: u64 }\n#[derive(Debug, Clone, Default, PartialEq, Eq)]\nstruct Manifest { parts: BTreeMap<String, Partition>, total_rows: u64 }\nimpl Manifest {\n    fn record(&mut self, name: &str, part: Partition) -> Result<bool, &'static str> {\n        if name.trim().is_empty() { return Err(\"name\"); }\n        if let Some(existing) = self.parts.get(name) {\n            return if existing == &part { Ok(false) } else { Err(\"conflict\") };\n        }\n        let next_rows = self.total_rows.checked_add(part.rows).ok_or(\"overflow\")?;\n        self.parts.insert(name.to_owned(), part);\n        self.total_rows = next_rows;\n        Ok(true)\n    }\n}\nfn part(checksum: &str, rows: u64) -> Partition { Partition { checksum: checksum.into(), rows } }\nfn main() {\n    let mut manifest = Manifest::default();\n    assert_eq!(manifest.record(\"day-01\", part(\"hash-a\", 3)), Ok(true));\n    assert_eq!(manifest.record(\"day-01\", part(\"hash-a\", 3)), Ok(false));\n    let saved = manifest.clone();\n    assert_eq!(manifest.record(\"day-01\", part(\"hash-b\", 3)), Err(\"conflict\"));\n    assert_eq!(manifest.record(\"day-01\", part(\"hash-a\", 4)), Err(\"conflict\"));\n    assert_eq!(manifest.record(\" \", part(\"hash-c\", 1)), Err(\"name\"));\n    assert_eq!(manifest, saved);\n    assert_eq!(manifest.record(\"day-02\", part(\"hash-c\", 2)), Ok(true));\n    let mut full = Manifest::default();\n    full.record(\"full\", part(\"x\", u64::MAX)).unwrap();\n    let snapshot = full.clone();\n    assert_eq!(full.record(\"extra\", part(\"y\", 1)), Err(\"overflow\"));\n    assert_eq!(full, snapshot);\n    println!(\"{} partition; {} hàng; retry không cộng trùng\", manifest.parts.len(), manifest.total_rows);\n}",
      "expectedOutput": "2 partition; 5 hàng; retry không cộng trùng",
      "hints": [
        "Kiểm tra mục cũ trước khi tính tổng mới.",
        "Tính next_rows thành công rồi mới insert và cập nhật total_rows.",
        "So sánh cả checksum lẫn rows để nhận ra metadata mâu thuẫn."
      ],
      "quiz": {
        "question": "Tiến trình đã ghi đủ tệp mới nhưng chết trước khi đổi manifest đang công bố. Thiết kế nên làm gì khi khởi động lại?",
        "options": [
          "Tự cộng tất cả tệp nhìn thấy vào báo cáo",
          "Xóa mọi phiên bản cũ ngay",
          "Kiểm tra trạng thái commit, xác thực tệp mới rồi retry có điều kiện hoặc dọn bản chưa công bố",
          "Bỏ qua manifest vì tên tệp đã đủ"
        ],
        "correct": 2,
        "explanation": "Sự tồn tại của tệp không đồng nghĩa đã công bố. Manifest xác định snapshot người đọc thấy; retry phải kiểm tra phiên bản và định danh batch để tránh ghi đè hoặc cộng trùng."
      },
      "reference": {
        "label": "DataFusion: profiling cookbook",
        "url": "https://datafusion.apache.org/library-user-guide/profiling.html"
      }
    }
  ]
};
