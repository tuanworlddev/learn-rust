import type { TrackExpansion } from "../../specialization-types";

export const dataExpansion: TrackExpansion = {
  "chapters": [
    {
      "id": "data-chapter-contracts",
      "title": "Hợp đồng và chất lượng dữ liệu",
      "description": "Đọc dữ liệu có kiểu, phân loại lỗi và đối soát số lượng.",
      "lessonIds": [
        "data-columnar",
        "data-ingestion",
        "data-quality-project"
      ],
      "outcomes": [
        "Định nghĩa schema và đơn vị.",
        "Tách lỗi cấu trúc khỏi reject theo dòng.",
        "Chứng minh số lượng và tổng tiền."
      ]
    },
    {
      "id": "data-chapter-transforms",
      "title": "Biến đổi cột và tiến hóa schema",
      "description": "Viết expressions và bảo vệ tương thích qua các phiên bản.",
      "lessonIds": [
        "data-polars",
        "data-expressions",
        "data-schema-evolution"
      ],
      "outcomes": [
        "Đọc kế hoạch lazy.",
        "Giữ đúng null và kiểu đầu ra.",
        "Kiểm thử ma trận reader/writer."
      ]
    },
    {
      "id": "data-chapter-semantics",
      "title": "Join, thời gian và cửa sổ",
      "description": "Làm đúng ngữ nghĩa trước khi song song hóa.",
      "lessonIds": [
        "data-joins",
        "data-event-time",
        "data-window-aggregates"
      ],
      "outcomes": [
        "Kiểm soát cardinality của join.",
        "Xử lý thời gian và sự kiện đến muộn.",
        "Gộp aggregate có trọng số."
      ]
    },
    {
      "id": "data-chapter-engine",
      "title": "Xây engine truy vấn nhúng",
      "description": "Đưa Arrow và DataFusion vào ứng dụng Rust có kiểm thử.",
      "lessonIds": [
        "data-datafusion",
        "data-query-plans",
        "data-query-project"
      ],
      "outcomes": [
        "Phân biệt logical và physical plan.",
        "Đối chiếu kết quả giữa partition.",
        "Trả lỗi truy vấn có kiểm soát."
      ]
    },
    {
      "id": "data-chapter-scale",
      "title": "Dữ liệu lớn và xử lý tăng dần",
      "description": "Thiết kế partition, ngân sách và checkpoint.",
      "lessonIds": [
        "data-streaming",
        "data-partition-design",
        "data-incremental"
      ],
      "outcomes": [
        "Đo skew và giới hạn bộ nhớ.",
        "Chọn bố cục Parquet theo workload.",
        "Retry CDC mà không nhân đôi trạng thái."
      ]
    },
    {
      "id": "data-chapter-delivery",
      "title": "Công bố và vận hành dataset",
      "description": "Bàn giao pipeline có version, test, benchmark và recovery.",
      "lessonIds": [
        "data-production",
        "data-reproducibility",
        "data-release-project"
      ],
      "outcomes": [
        "Tái lập từ manifest.",
        "Phát hiện writer cạnh tranh.",
        "Giữ reader trên snapshot hoàn chỉnh."
      ]
    }
  ],
  "lessons": [
    {
      "id": "data-ingestion",
      "moduleId": "track-data",
      "title": "Nạp dữ liệu: định dạng, schema và dòng lỗi",
      "description": "Xây ranh giới nhận dữ liệu có quy tắc chuẩn hóa, ngân sách và chẩn đoán rõ.",
      "duration": 55,
      "objectives": [
        "Phân biệt lỗi định dạng với lỗi vượt miền.",
        "Không dùng số thực để đọc tiền.",
        "Kiểm thử Unicode, dấu cộng, số âm và giá trị lớn."
      ],
      "sections": [
        {
          "title": "Định dạng tệp không phải schema nghiệp vụ",
          "text": "Một tệp CSV có thể đọc được vẫn chứa dữ liệu không phù hợp: amount là chuỗi, ID có khoảng trắng, tên cột bị đổi và giá trị thiếu dùng nhiều ký hiệu khác nhau. Đầu vào của pipeline cần một hợp đồng gồm tên cột, kiểu, đơn vị, trường bắt buộc và chính sách dòng sai. Ví dụ amount_minor lưu số nguyên đơn vị nhỏ nhất; chuỗi 12.50 không được tự làm tròn thành 12. Viết bảng ánh xạ từ trường nguồn sang kiểu Rust trước khi xử lý hàng triệu dòng giúp lỗi xuất hiện gần nơi sinh dữ liệu."
        },
        {
          "title": "Tách lỗi cú pháp khỏi lỗi giá trị",
          "text": "Parser CSV xử lý dấu phẩy bên trong ngoặc kép, xuống dòng trong trường và quy tắc escape. Không dùng split(',') để thay thế parser nếu hợp đồng cho phép các tính năng này. Sau parser, lớp validation mới kiểm tra ID rỗng, số âm hoặc mã vùng không được hỗ trợ. Một tệp có cấu trúc hỏng có thể cần dừng cả batch; một dòng có số tiền sai có thể chuyển sang bảng reject. Hai quyết định khác nhau phải có mã lỗi khác nhau để người vận hành biết cần sửa tệp hay sửa bản ghi."
        },
        {
          "title": "Đọc theo luồng và đặt ngân sách",
          "text": "Reader cung cấp từng record nhưng bộ nhớ vẫn có thể tăng nếu bạn giữ toàn bộ record hoặc tập ID không giới hạn. Hãy đặt giới hạn kích thước tệp, độ dài trường, số dòng và số khóa cần nhớ. Bản lab dùng tệp nhỏ để quan sát rõ lỗi; khi tăng dữ liệu, chọn batching và kho dedup bền vững. Không diễn giải việc dùng iterator là đã có bộ nhớ hằng số. Một CSV chỉ gồm một trường khổng lồ cũng có thể gây cấp phát lớn trước khi thuật toán tổng hợp bắt đầu."
        },
        {
          "title": "Chuẩn hóa có chủ đích",
          "text": "Trim đầu cuối có thể phù hợp với mã vùng nhưng làm đổi nội dung nhận xét. Lowercase tên hiển thị chỉ để thuận tiện so sánh sẽ đánh mất dữ liệu gốc. Giữ trường gốc khi cần truy vết và sinh trường đã chuẩn hóa riêng. Với số nguyên, thống nhất có chấp nhận dấu cộng và khoảng trắng hay không. Bài tập chấp nhận chữ số ASCII sau trim, từ chối dấu, dấu thập phân và số vượt i64. Ràng buộc này đơn giản nhưng đủ rõ để kiểm tra bằng bảng ca đầu vào."
        },
        {
          "title": "Gắn chẩn đoán với nguồn",
          "text": "Mỗi reject cần batch ID, số record, trường lỗi và mã nguyên nhân; hạn chế ghi nguyên record khi có thông tin riêng tư. Đừng chỉ log parse failed rồi bỏ dòng. Tổng input phải bằng accepted cộng rejected nếu batch hoàn tất; khi dừng do lỗi cấu trúc, đánh dấu batch thất bại để không xuất báo cáo nửa chừng. Tạo fixture nhỏ gồm header sai, tiền quá lớn, chuỗi Unicode và trường được quote. Khi người khác chạy lại fixture, họ phải nhận cùng cách phân loại chứ không phụ thuộc thứ tự thread."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Đọc số tiền nguyên theo hợp đồng",
        "instructions": "Triển khai amount_minor. Chấp nhận chữ số ASCII sau trim, trả format cho ký hiệu khác và overflow nếu vượt i64.",
        "requirements": [
          "Phân biệt lỗi định dạng với lỗi vượt miền.",
          "Không dùng số thực để đọc tiền.",
          "Kiểm thử Unicode, dấu cộng, số âm và giá trị lớn."
        ]
      },
      "starterCode": "// Đọc số tiền nguyên theo hợp đồng\n// Phân biệt lỗi định dạng với lỗi vượt miền.\n// Không dùng số thực để đọc tiền.\n// Kiểm thử Unicode, dấu cộng, số âm và giá trị lớn.\nfn main() {\n    // Triển khai hàm theo đề và thêm assertion cho các ca biên.\n    todo!();\n}\n",
      "solutionCode": "fn amount_minor(input: &str) -> Result<i64, &'static str> {\n    let value = input.trim();\n    if value.is_empty() || !value.bytes().all(|c| c.is_ascii_digit()) { return Err(\"format\"); }\n    value.parse::<i64>().map_err(|_| \"overflow\")\n}\nfn main() {\n    assert_eq!(amount_minor(\" 1200 \"), Ok(1200));\n    for bad in [\"\", \"-1\", \"+1\", \"1.5\", \"١٢\"] { assert_eq!(amount_minor(bad), Err(\"format\")); }\n    assert_eq!(amount_minor(\"9223372036854775808\"), Err(\"overflow\"));\n    println!(\"1200 minor\");\n}",
      "expectedOutput": "1200 minor",
      "hints": [
        "Bắt đầu từ bất biến và ca đầu vào không hợp lệ.",
        "Giữ một trường hợp biên trong assertion trước khi hoàn thiện lời giải."
      ],
      "quiz": {
        "question": "CSV đọc được nhưng một dòng có amount_minor = 12.50. Cách xử lý phù hợp hợp đồng số nguyên là gì?",
        "options": [
          "Tự bỏ phần .50.",
          "Đổi toàn cột sang float mà không đổi schema.",
          "Từ chối dòng bằng mã lỗi giá trị và giữ nguồn để sửa."
        ],
        "correct": 2,
        "explanation": "Parser tệp và hợp đồng nghiệp vụ là hai lớp. Tự làm tròn làm đổi dữ liệu mà người cung cấp không biết."
      },
      "reference": {
        "label": "csv: Reader và record",
        "url": "https://docs.rs/csv/1.4.0/csv/"
      }
    },
    {
      "id": "data-quality-project",
      "moduleId": "track-data",
      "title": "Dự án: cổng kiểm tra chất lượng đơn hàng",
      "description": "Tạo công cụ Cargo đọc CSV, phân loại reject và đối soát tổng hợp lệ.",
      "duration": 55,
      "objectives": [
        "Giữ dòng hợp lệ đầu tiên theo ID.",
        "Dòng lỗi không chiếm ID của dòng đúng về sau.",
        "Tổng tiền phải dùng checked_add."
      ],
      "sections": [
        {
          "title": "Đầu ra có thể nghiệm thu",
          "text": "Khách hàng nội bộ cần biết dữ liệu hôm nay có đủ tin cậy để đưa vào báo cáo. Công cụ nhận CSV với order_id, region và amount_minor, trả số dòng hợp lệ, số dòng bị loại, tổng tiền và danh sách nguyên nhân. Một dự án chất lượng dữ liệu bắt đầu bằng dữ liệu mẫu cùng kết quả tính tay. Trong fixture, một ID trùng và một số âm phải bị loại; dòng khác hợp lệ không biến mất vì có lỗi ở hàng xóm. Toàn bộ quyết định này được coi là hợp đồng đầu ra."
        },
        {
          "title": "Định nghĩa khóa trước dedup",
          "text": "Nếu hai dòng có cùng order_id, không mặc định giữ dòng cuối: kết quả khi đó phụ thuộc thứ tự tệp. Lab chọn giữ bản hợp lệ đầu tiên và reject các lần lặp tiếp theo; yêu cầu khác cần version hoặc event_time. Chỉ đưa ID vào tập đã nhận sau khi mọi kiểm tra giá trị thành công. Nếu một dòng sai tiền xuất hiện trước dòng đúng cùng ID, dòng đúng vẫn phải được chấp nhận. Với số tiền tổng, checked_add tránh wrap trong release build và cho phép báo lỗi có nghĩa."
        },
        {
          "title": "Phân lớp để kiểm thử",
          "text": "Tách thư viện audit khỏi main. Thư viện nhận một Read, parse và trả cấu trúc kết quả; main mở tệp và in báo cáo. Test truyền byte slice để không phụ thuộc thư mục hiện hành. Kiểm thử CLI bổ sung xác nhận mã thoát và thông báo lỗi khi đường dẫn không tồn tại. Một test chỉ gọi main rồi tìm chữ OK không đủ chứng minh bản ghi bị phân loại đúng. Các assertion nên so cả ID, số đếm và tổng tiền; thư viện không tự in để giữ đầu ra ổn định."
        },
        {
          "title": "Mở rộng thành quy trình vận hành",
          "text": "Giới hạn bản mẫu ở tập dữ liệu vừa bộ nhớ vì HashSet giữ các ID hợp lệ. Khi vận hành thật, chia batch theo nguồn xác định, chuyển reject sang kho riêng và gắn phiên bản schema. Nếu phải kiểm tra trùng giữa nhiều ngày, tập ID trong một lần chạy không đủ; cần chỉ mục bền vững hoặc khóa duy nhất tại kho đích. Công cụ là cổng kiểm tra chất lượng, không tự cam kết dữ liệu vào database. Mô tả ranh giới này để nhóm dùng kết quả không suy diễn sai."
        },
        {
          "title": "Thay đổi có minh chứng",
          "text": "Sau khi chạy bản mẫu, thêm quy tắc region chỉ thuộc danh sách cho phép và một ngưỡng tỷ lệ reject. Viết test cho ngưỡng đúng biên trước khi sửa thuật toán. Một batch vượt ngưỡng phải có trạng thái rejected, không chỉ thêm dòng log. Đối chiếu input = accepted + rejected trong mọi batch hoàn tất. Nộp fixture, báo cáo kết quả trước sau, test thất bại đã được sửa và README dùng từ máy mới. Đây là minh chứng bạn biến một hợp đồng dữ liệu thành phần mềm có thể review."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Đếm dòng hợp lệ và giữ ID đầu tiên",
        "instructions": "Đọc các cặp (id, amount), từ chối ID rỗng, tiền âm và ID đã nhận. Chỉ thêm ID sau khi kiểm tra hợp lệ.",
        "requirements": [
          "Giữ dòng hợp lệ đầu tiên theo ID.",
          "Dòng lỗi không chiếm ID của dòng đúng về sau.",
          "Tổng tiền phải dùng checked_add."
        ]
      },
      "starterCode": "// Đếm dòng hợp lệ và giữ ID đầu tiên\n// Giữ dòng hợp lệ đầu tiên theo ID.\n// Dòng lỗi không chiếm ID của dòng đúng về sau.\n// Tổng tiền phải dùng checked_add.\nfn main() {\n    // Triển khai hàm theo đề và thêm assertion cho các ca biên.\n    todo!();\n}\n",
      "solutionCode": "use std::collections::HashSet;\nfn audit(rows: &[(&str, i64)]) -> Result<(usize, usize, i64), &'static str> {\n    let mut seen = HashSet::new(); let (mut accepted, mut rejected, mut total) = (0, 0, 0_i64);\n    for &(id, amount) in rows {\n        if id.trim().is_empty() || amount < 0 || seen.contains(id) { rejected += 1; continue; }\n        total = total.checked_add(amount).ok_or(\"overflow\")?;\n        seen.insert(id); accepted += 1;\n    }\n    Ok((accepted, rejected, total))\n}\nfn main() {\n    assert_eq!(audit(&[(\"a\",-1),(\"a\",120),(\"a\",30),(\"b\",80)]), Ok((2,2,200)));\n    assert_eq!(audit(&[(\"a\",i64::MAX),(\"b\",1)]), Err(\"overflow\"));\n    println!(\"2 accepted, 2 rejected, total=200\");\n}",
      "expectedOutput": "2 accepted, 2 rejected, total=200",
      "hints": [
        "Bắt đầu từ bất biến và ca đầu vào không hợp lệ.",
        "Giữ một trường hợp biên trong assertion trước khi hoàn thiện lời giải."
      ],
      "quiz": {
        "question": "Dòng đầu có ID A nhưng tiền âm; dòng sau ID A có tiền hợp lệ. Với quy tắc giữ bản hợp lệ đầu tiên, cần làm gì?",
        "options": [
          "Reject cả hai vì ID đã xuất hiện.",
          "Nhận dòng sau; dòng sai chưa được đưa vào tập ID đã nhận.",
          "Nhận cả hai để không mất dữ liệu."
        ],
        "correct": 1,
        "explanation": "Tập dedup theo hợp đồng này lưu ID đã chấp nhận, không phải mọi chuỗi ID từng đọc."
      },
      "reference": {
        "label": "csv: parsing có vị trí lỗi",
        "url": "https://docs.rs/csv/1.4.0/csv/"
      },
      "localLab": {
        "title": "Cổng chất lượng CSV đơn hàng",
        "instructions": "Giải nén, mở terminal tại Cargo.toml và chạy test trước. Reader giới hạn 16 MiB/100.000 record; dữ liệu mẫu chỉ gồm vùng bac/nam. Thư viện phân biệt lỗi cấu trúc toàn batch và reject theo dòng. Mở rộng quy tắc bằng test trước khi dùng dataset khác.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname=\"quality-gate\"\nversion=\"0.1.0\"\nedition=\"2024\"\n[dependencies]\ncsv=\"=1.4.0\"\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::{collections::{BTreeMap, HashSet}, io::Read};\n\npub const MAX_BYTES: u64 = 16 * 1024 * 1024;\npub const MAX_ROWS: usize = 100_000;\n#[derive(Debug, Clone)] pub struct Row { pub order_id: String, pub region: String, pub amount_minor: i64 }\n#[derive(Debug, PartialEq, Eq)] pub struct Reject { pub record: usize, pub reason: &'static str }\n#[derive(Debug)] pub struct Audit { pub rows: Vec<Row>, pub rejects: Vec<Reject>, pub total: i64, pub regions: BTreeMap<String, i64> }\n\npub fn audit(reader: impl Read) -> Result<Audit, String> {\n    let mut bytes = Vec::new();\n    reader.take(MAX_BYTES + 1).read_to_end(&mut bytes).map_err(|e| e.to_string())?;\n    if bytes.len() as u64 > MAX_BYTES { return Err(\"file_too_large\".into()); }\n    let mut csv = csv::Reader::from_reader(bytes.as_slice());\n    if !csv.headers().map_err(|e| e.to_string())?.iter().eq([\"order_id\", \"region\", \"amount_minor\"]) {\n        return Err(\"schema\".into());\n    }\n    let mut out = Audit { rows: vec![], rejects: vec![], total: 0, regions: BTreeMap::new() };\n    let mut seen = HashSet::new();\n    for (index, record) in csv.records().enumerate() {\n        if index >= MAX_ROWS { return Err(\"too_many_rows\".into()); }\n        let record = record.map_err(|e| format!(\"csv_structure: {e}\"))?;\n        let id = record[0].trim();\n        let region = record[1].trim();\n        let raw_amount = record[2].trim();\n        let amount = (!raw_amount.is_empty() && raw_amount.bytes().all(|b| b.is_ascii_digit()))\n            .then(|| raw_amount.parse::<i64>().ok()).flatten();\n        let reason = if id.is_empty() || id.len() > 64 { Some(\"id\") }\n            else if ![\"bac\", \"nam\"].contains(&region) { Some(\"region\") }\n            else if amount.is_none() { Some(\"amount\") }\n            else if seen.contains(id) { Some(\"duplicate\") } else { None };\n        if let Some(reason) = reason { out.rejects.push(Reject { record: index + 2, reason }); continue; }\n        let amount = amount.expect(\"checked above\");\n        let total = out.total.checked_add(amount).ok_or(\"total_overflow\")?;\n        let regional = out.regions.get(region).copied().unwrap_or(0).checked_add(amount).ok_or(\"region_overflow\")?;\n        seen.insert(id.to_owned());\n        out.total = total;\n        out.regions.insert(region.to_owned(), regional);\n        out.rows.push(Row { order_id: id.to_owned(), region: region.to_owned(), amount_minor: amount });\n    }\n    Ok(out)\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use std::{fs::File, process};\nfn main() {\n    let Some(path)=std::env::args().nth(1) else {eprintln!(\"usage: quality-gate <orders.csv>\");process::exit(2)};\n    let result=File::open(path).map_err(|e|e.to_string()).and_then(quality_gate::audit);\n    match result {\n        Ok(a)=>{println!(\"accepted={} rejected={} total={}\",a.rows.len(),a.rejects.len(),a.total);for r in a.rejects{println!(\"record={} reason={}\",r.record,r.reason);}},\n        Err(e)=>{eprintln!(\"{e}\");process::exit(1);}\n    }\n}\n"
          },
          {
            "path": "tests/quality.rs",
            "content": "use quality_gate::audit;\n#[test] fn audit_counts_and_dedup_are_explicit() {\n    let result=audit(include_bytes!(\"../fixtures/orders.csv\").as_slice()).unwrap();\n    assert_eq!(result.rows.len(),2); assert_eq!(result.rejects.len(),3);\n    assert_eq!(result.total,200);\n    assert_eq!(result.rejects.iter().map(|r|r.reason).collect::<Vec<_>>(),vec![\"duplicate\",\"amount\",\"region\"]);\n}\n#[test] fn invalid_first_row_does_not_consume_id() {\n    let result=audit(b\"order_id,region,amount_minor\\na,bac,-1\\na,bac,7\\n\".as_slice()).unwrap();\n    assert_eq!(result.rows.len(),1);assert_eq!(result.total,7);\n}\n#[test] fn csv_quoting_is_not_split_by_comma() {\n    let result=audit(b\"order_id,region,amount_minor\\n\\\"a,1\\\",bac,8\\n\".as_slice()).unwrap();\n    assert_eq!(result.rows[0].order_id,\"a,1\");\n}\n#[test] fn wrong_schema_and_structure_fail_whole_batch() {\n    assert!(audit(b\"id,region,amount_minor\\na,bac,1\\n\".as_slice()).is_err());\n    assert!(audit(b\"order_id,region,amount_minor\\na,bac,1,extra\\n\".as_slice()).is_err());\n}\n#[test] fn overflow_fails_without_partial_success() {\n    assert!(audit(b\"order_id,region,amount_minor\\na,bac,9223372036854775807\\nb,bac,1\\n\".as_slice()).is_err());\n}\n#[test] fn empty_dataset_has_zero_rows_and_total() {\n    let result=audit(b\"order_id,region,amount_minor\\n\".as_slice()).unwrap();\n    assert_eq!(result.rows.len(),0);assert_eq!(result.total,0);\n}\n"
          },
          {
            "path": "fixtures/orders.csv",
            "content": "order_id,region,amount_minor\na,bac,120\nb,nam,80\na,bac,30\nc,bac,-5\nd,tay,10\n"
          },
          {
            "path": "README.md",
            "content": "# Cổng chất lượng đơn hàng\n\nChạy cargo test --all-targets, sau đó cargo run -- fixtures/orders.csv.\n\nKết quả fixture: accepted=2 rejected=3 total=200. ID trùng bị loại sau dòng hợp lệ đầu tiên. Số âm/ngoài miền/sai vùng được reject; lỗi schema/cấu trúc/overflow làm cả batch thất bại. Chỉ ID được chấp nhận mới chiếm chỗ trong tập dedup.\n\nPhần thực hành: thêm giới hạn tỷ lệ reject, xuất bảng reject bằng csv::Writer, thêm mã vùng và fixture ngưỡng biên. Cập nhật hợp đồng cùng test. Đây là kiểm tra trong một batch; dedup qua nhiều ngày cần kho bền vững. Không ghi đè dữ liệu nguồn.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run -- fixtures/orders.csv"
        ],
        "checks": [
          "Fixture trả accepted=2 rejected=3 total=200.",
          "Quote chứa dấu phẩy được đọc đúng; header/cấu trúc sai làm batch thất bại.",
          "Dòng lỗi không chiếm ID và overflow không được báo thành công."
        ]
      }
    },
    {
      "id": "data-expressions",
      "moduleId": "track-data",
      "title": "Biểu thức cột, null và biến đổi có điều kiện",
      "description": "Viết phép biến đổi giữ đúng ngữ nghĩa khi dữ liệu thiếu và tránh vòng lặp theo từng hàng.",
      "duration": 55,
      "objectives": [
        "Phân biệt None với Some(0).",
        "Loại số âm trước tổng hợp.",
        "Xác nhận số giá trị thực sự đã biết."
      ],
      "sections": [
        {
          "title": "Biểu thức là mô tả một phép tính",
          "text": "Trong Polars, col chọn một cột và các phép toán tạo expression. LazyFrame lưu kế hoạch để engine biết dữ liệu nào cần đọc và phép tính nào có thể kết hợp. Hãy mô tả phép chuẩn hóa bằng expressions khi có thể: engine có cơ hội tối ưu mà một callback tùy ý không cung cấp. Điều đó không có nghĩa callback luôn sai; thuật toán đặc thù có thể cần nó. Trước khi chọn, hãy chỉ ra kiểu đầu vào, đầu ra và khả năng giữ ngữ nghĩa của từng cách triển khai."
        },
        {
          "title": "Null không phải false hoặc số không",
          "text": "Một phép so sánh với giá trị thiếu thường tạo kết quả thiếu. Khi lọc, cần xác định dòng có điều kiện thiếu được giữ hay loại. Nếu thay tất cả null bằng zero, bạn đã đưa ra một giả định nghiệp vụ: chưa biết doanh thu đồng nghĩa không có doanh thu. Bài tập dùng Option<i64> để thấy rõ hai nhánh. Chỉ Some với số không âm được nhận; None giữ nguyên trạng thái thiếu cho tới khi một chính sách cụ thể quyết định. Kiểm thử phải có cả Some(0) và None."
        },
        {
          "title": "Nhánh điều kiện vẫn cần hợp lệ",
          "text": "Khi viết when-then-otherwise, đừng dựa vào trực giác if của ngôn ngữ để cho rằng nhánh không chọn có thể chứa phép tính không hợp lệ. Expression được engine lập kế hoạch và có thể đánh giá theo cách khác mã Rust tuần tự. Cách chắc chắn là chuẩn hóa mẫu số hoặc miền giá trị trước phép chia, rồi biểu diễn kết quả thiếu rõ ràng. Kiểm tra đầu ra ở các ca mẫu số zero, null và giá trị âm, thay vì chỉ chạy trên tập dữ liệu sạch có sẵn."
        },
        {
          "title": "Tên và kiểu cột là API",
          "text": "Đặt alias cho giá trị tính ra để người đọc phân biệt amount_raw, amount_valid và net_amount. Kiểu của expression cần được kiểm tra: tổng i64 khác trung bình float, kiểu nhỏ có thể mở rộng hoặc overflow theo phép toán. Không chọn cột bằng vị trí nếu schema có thể thêm trường. Một hàm biến đổi nên trả Result khi cột bắt buộc vắng mặt hoặc kiểu sai. Việc giữ schema nhất quán giúp pipeline ghép nhiều bước mà lỗi không dồn đến lúc xuất báo cáo cuối cùng."
        },
        {
          "title": "Chứng minh phép tối ưu không đổi kết quả",
          "text": "Viết cách tính tham chiếu nhỏ bằng iterator Rust và so với kết quả engine trên fixture có null. Với số nguyên, so chính xác; với số thực, định nghĩa sai số và xử lý NaN riêng. Thay callback bằng expression rồi kiểm tra lại schema, số dòng và thứ tự có cam kết. Đo thời gian trên dữ liệu đại diện sau khi tính đúng. Nếu đổi thứ tự filter và tính tỷ lệ, tập dòng có thể khác; đừng gọi đó là tối ưu chỉ vì tốc độ tăng và một tổng số tình cờ giống nhau."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Giữ ngữ nghĩa thiếu dữ liệu",
        "instructions": "Viết normalize trả Some(value) chỉ khi đầu vào có giá trị và không âm. Tính (known_count,total) từ các giá trị đã chuẩn hóa.",
        "requirements": [
          "Phân biệt None với Some(0).",
          "Loại số âm trước tổng hợp.",
          "Xác nhận số giá trị thực sự đã biết."
        ]
      },
      "starterCode": "// Giữ ngữ nghĩa thiếu dữ liệu\n// Phân biệt None với Some(0).\n// Loại số âm trước tổng hợp.\n// Xác nhận số giá trị thực sự đã biết.\nfn main() {\n    // Triển khai hàm theo đề và thêm assertion cho các ca biên.\n    todo!();\n}\n",
      "solutionCode": "fn normalize(v: Option<i64>) -> Option<i64> { v.filter(|n| *n >= 0) }\nfn main() {\n    let values = [Some(10), None, Some(0), Some(-2), Some(5)];\n    let valid: Vec<i64> = values.into_iter().filter_map(normalize).collect();\n    assert_eq!(valid, vec![10,0,5]);\n    assert_eq!(normalize(None), None);\n    println!(\"known={}, total={}\", valid.len(), valid.iter().sum::<i64>());\n}",
      "expectedOutput": "known=3, total=15",
      "hints": [
        "Bắt đầu từ bất biến và ca đầu vào không hợp lệ.",
        "Giữ một trường hợp biên trong assertion trước khi hoàn thiện lời giải."
      ],
      "quiz": {
        "question": "Thay null bằng 0 trước khi tính trung bình gây thay đổi gì?",
        "options": [
          "Có thể tăng mẫu số và đổi ý nghĩa từ giá trị đã biết sang tất cả bản ghi.",
          "Chỉ đổi cách lưu, không đổi kết quả.",
          "Luôn làm trung bình chính xác hơn."
        ],
        "correct": 0,
        "explanation": "Điền zero là chính sách dữ liệu. Trung bình có null bị bỏ qua khác trung bình sau khi coi null là zero."
      },
      "reference": {
        "label": "Polars: expressions",
        "url": "https://docs.pola.rs/user-guide/expressions/"
      }
    },
    {
      "id": "data-schema-evolution",
      "moduleId": "track-data",
      "title": "Tiến hóa schema và tương thích dữ liệu",
      "description": "Thiết kế thay đổi kiểu, trường và đơn vị để reader cũ không âm thầm đọc sai.",
      "duration": 55,
      "objectives": [
        "So theo tên, không theo vị trí.",
        "Từ chối đổi kiểu hoặc xóa trường.",
        "Từ chối cột mới bắt buộc."
      ],
      "sections": [
        {
          "title": "Tên giống nhau chưa đủ tương thích",
          "text": "Cột amount vẫn tên cũ nhưng chuyển từ đồng sang xu là thay đổi hợp đồng nghiêm trọng. Schema cần ghi cả đơn vị, ý nghĩa null, timezone và version. Thay đổi vật lý như i32 sang i64 thường khác thay đổi ngữ nghĩa như mã trạng thái chuyển ý nghĩa. Người đọc chỉ nhìn kiểu primitive sẽ không phát hiện trường hợp thứ hai. Vì vậy một migration cần mô tả ai ghi, ai đọc, thời điểm chuyển và cách nhận biết phiên bản để quyết định có thể chạy song song hay không."
        },
        {
          "title": "Thêm trường với giá trị mặc định",
          "text": "Thêm cột nullable có thể giúp reader mới đọc tệp cũ, nhưng chỉ an toàn khi thiếu có ý nghĩa. Một cột tax_rate thiếu không được tự suy thành zero nếu quy tắc thuế yêu cầu biết nguồn. Đưa giá trị mặc định vào tầng chuẩn hóa version, không rải fill_null khắp các truy vấn. Reader cũ cũng cần chính sách bỏ qua cột chưa biết hay từ chối schema mới. Hai hướng tương thích phải được kiểm tra riêng; đọc được dữ liệu mới không có nghĩa mọi writer cũ vẫn ghi đúng."
        },
        {
          "title": "Đổi tên và đổi kiểu theo từng bước",
          "text": "Với đổi tên customer thành customer_id, có thể thêm cột mới, ghi cả hai, chuyển reader rồi bỏ cột cũ trong release khác. Khi cast chuỗi sang số, đếm các giá trị không chuyển được trước khi chọn chính sách null. Một cast im lặng gây mất bản ghi có thể khiến báo cáo trông hợp lệ nhưng thiếu doanh thu. Fixture migration cần chứa số vượt miền, chuỗi rỗng, null và định dạng cũ. Giữ bộ chuyển đổi nhỏ theo version giúp kiểm thử từng bước thay vì một hàm đoán mọi định dạng."
        },
        {
          "title": "Ràng buộc thứ tự và định danh",
          "text": "Đừng gắn nghĩa của cột vào vị trí trong Vec khi định dạng lưu tên trường. Với Arrow, RecordBatch phải có array phù hợp schema, còn ứng dụng cần kiểm tra metadata nghiệp vụ. Nếu viết bảng có field ID ổn định, đổi tên không được tạo nhầm một trường mới. Khi bản mẫu chưa dùng table format hỗ trợ tiến hóa schema, chọn manifest chứa version và từ chối phiên bản chưa hỗ trợ. Ranh giới rõ này tốt hơn việc cố đọc mọi đầu vào bằng heuristic khó giải thích."
        },
        {
          "title": "Ma trận nghiệm thu migration",
          "text": "Tạo ma trận writer cũ/mới × reader cũ/mới với các trường hợp được hỗ trợ. Lưu tệp mẫu của mỗi version trong repo test để việc đổi dependency không tự làm mất tương thích. Bài tập thu nhỏ ma trận thành kiểm tra danh sách field: mọi field cũ phải còn đúng tên và kiểu, trường thêm phải nullable. Đây là chính sách bảo thủ của bài, không phải quy tắc chung cho mọi định dạng. Khi thay chính sách, cập nhật test và version cùng lúc để người dùng dữ liệu biết điều gì thay đổi."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Kiểm tra tương thích thêm cột",
        "instructions": "Kiểm tra schema mới giữ nguyên mọi (name,type) cũ và chỉ thêm cột nullable. Được đổi thứ tự cột.",
        "requirements": [
          "So theo tên, không theo vị trí.",
          "Từ chối đổi kiểu hoặc xóa trường.",
          "Từ chối cột mới bắt buộc."
        ]
      },
      "starterCode": "// Kiểm tra tương thích thêm cột\n// So theo tên, không theo vị trí.\n// Từ chối đổi kiểu hoặc xóa trường.\n// Từ chối cột mới bắt buộc.\nfn main() {\n    // Triển khai hàm theo đề và thêm assertion cho các ca biên.\n    todo!();\n}\n",
      "solutionCode": "type Field<'a> = (&'a str, &'a str, bool);\nfn compatible(old: &[Field<'_>], new: &[Field<'_>]) -> bool {\n    let unique = |fields: &[Field<'_>]| { let mut s=std::collections::HashSet::new(); fields.iter().all(|f| s.insert(f.0)) };\n    unique(old) && unique(new)\n        && old.iter().all(|o| new.iter().any(|n| n.0==o.0 && n.1==o.1 && n.2==o.2))\n        && new.iter().all(|n| old.iter().any(|o| o.0==n.0) || n.2)\n}\nfn main() {\n    let old=[(\"id\",\"u64\",false)];\n    assert!(compatible(&old,&[(\"note\",\"str\",true),(\"id\",\"u64\",false)]));\n    assert!(!compatible(&old,&[(\"id\",\"str\",false)]));\n    assert!(!compatible(&old,&[(\"id\",\"u64\",false),(\"tax\",\"i64\",false)]));\n    println!(\"schema compatible\");\n}",
      "expectedOutput": "schema compatible",
      "hints": [
        "Bắt đầu từ bất biến và ca đầu vào không hợp lệ.",
        "Giữ một trường hợp biên trong assertion trước khi hoàn thiện lời giải."
      ],
      "quiz": {
        "question": "Một trường amount đổi đơn vị từ đồng sang xu nhưng vẫn i64. Có thể coi schema không đổi không?",
        "options": [
          "Có, kiểu vật lý giống nhau.",
          "Có nếu giá trị mới nhỏ hơn.",
          "Không, hợp đồng ngữ nghĩa đã đổi và cần version/chuyển đổi rõ."
        ],
        "correct": 2,
        "explanation": "Kiểu vật lý không thể hiện đầy đủ đơn vị và ý nghĩa dữ liệu."
      },
      "reference": {
        "label": "Arrow: kiểu dữ liệu và metadata",
        "url": "https://arrow.apache.org/docs/format/Columnar.html"
      }
    },
    {
      "id": "data-event-time",
      "moduleId": "track-data",
      "title": "Thời gian sự kiện, múi giờ và dữ liệu đến muộn",
      "description": "Chọn cửa sổ đúng theo thời điểm nghiệp vụ và quản lý bản ghi đến sau hạn.",
      "duration": 55,
      "objectives": [
        "Dùng phép chia lấy sàn.",
        "Đúng tại 0, biên dương và thời điểm trước epoch.",
        "Không thay event time bằng thời gian nhận."
      ],
      "sections": [
        {
          "title": "Hai đồng hồ trả lời hai câu hỏi",
          "text": "Event time là thời điểm nghiệp vụ xảy ra; processing time là lúc pipeline nhìn thấy sự kiện. Một đơn hàng tạo lúc 23:59 nhưng được nhận lúc 00:03 có thể thuộc báo cáo ngày trước. Nếu dùng thời gian máy chạy để phân nhóm, kết quả phụ thuộc lịch retry. Hợp đồng phải chọn loại thời gian và timezone dùng để xác định ngày. Lưu một instant chuẩn cùng timezone nghiệp vụ khi cần, thay vì một chuỗi giờ địa phương không xác định được vị trí trên trục thời gian."
        },
        {
          "title": "Đơn vị timestamp phải được khóa",
          "text": "Số nguyên 1700000000 có thể là giây, mili giây hoặc một mã nghiệp vụ. Khi đọc timestamp, kiểm tra đơn vị và miền giá trị trước khi cast. Với cửa sổ cố định, dùng chia lấy sàn để các thời điểm âm vẫn nằm đúng phía trước epoch; phép chia số nguyên Rust hướng về zero nên cần div_euclid khi cửa sổ được định nghĩa theo toán học. Cửa sổ ngày theo timezone có chuyển giờ không luôn dài 86400 giây, vì vậy không áp dụng công thức UTC cố định cho mọi lịch địa phương."
        },
        {
          "title": "Watermark là chính sách chấp nhận trễ",
          "text": "Watermark mô tả mức tiến triển mà hệ thống dùng để quyết định một cửa sổ có thể đóng, không phải lời khẳng định mọi sự kiện trước đó đã tới. Một nguồn bị chậm hoặc ngừng gửi cần chính sách idle để không giữ mọi cửa sổ mãi mãi. Trong bài, max_event_time trừ allowed_lateness tạo ngưỡng đơn giản cho một nguồn. Sự kiện đến sau khi cửa sổ bị đóng được chuyển sang luồng hiệu chỉnh hoặc bị reject có lý do; không lặng lẽ thêm vào báo cáo đã công bố như thể chưa từng phát hành."
        },
        {
          "title": "Đến muộn khác lặp lại",
          "text": "Một sự kiện cũ nhưng chưa từng nhận cần được xử lý khác sự kiện đã xử lý và đang retry. Dedup dựa vào event ID và version; watermark dựa vào thời gian. Nếu chỉ bỏ mọi event_time nhỏ hơn max trước đó, pipeline sẽ mất sự kiện hợp lệ đến lệch thứ tự. Khi hai bản cùng ID và version có payload khác nhau, đó là xung đột nguồn cần điều tra. Gộp hai tình huống thành duplicate làm số đếm reject có vẻ ổn nhưng che mất lỗi tính nhất quán."
        },
        {
          "title": "Kiểm thử bằng đường thời gian",
          "text": "Viết fixture theo thứ tự nhận, ghi cạnh mỗi sự kiện thời điểm nghiệp vụ và kết quả cửa sổ mong đợi. Bao gồm đúng biên cửa sổ, đúng ngưỡng trễ, một nguồn đứng yên và retry sau restart. Mô phỏng trong bài cho thấy cùng một sự kiện có thể được chấp nhận hoặc cần hiệu chỉnh tùy lúc watermark tiến lên. Khi nộp bài, giải thích cửa sổ là nửa kín [start,end), quy tắc sự kiện đúng biên và cách sửa báo cáo cũ. Những lựa chọn đó phải xuất hiện trong test."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Gán cửa sổ thời gian cố định",
        "instructions": "Viết window_start(t,width) với width dương, trả đầu cửa sổ [start,start+width). Hỗ trợ timestamp âm; từ chối width không dương.",
        "requirements": [
          "Dùng phép chia lấy sàn.",
          "Đúng tại 0, biên dương và thời điểm trước epoch.",
          "Không thay event time bằng thời gian nhận."
        ]
      },
      "starterCode": "// Gán cửa sổ thời gian cố định\n// Dùng phép chia lấy sàn.\n// Đúng tại 0, biên dương và thời điểm trước epoch.\n// Không thay event time bằng thời gian nhận.\nfn main() {\n    // Triển khai hàm theo đề và thêm assertion cho các ca biên.\n    todo!();\n}\n",
      "solutionCode": "fn window_start(t: i64, width: i64) -> Result<i64, &'static str> {\n    if width <= 0 { return Err(\"width\"); }\n    t.div_euclid(width).checked_mul(width).ok_or(\"overflow\")\n}\nfn main() {\n    assert_eq!(window_start(60,60),Ok(60));\n    assert_eq!(window_start(59,60),Ok(0));\n    assert_eq!(window_start(-1,60),Ok(-60));\n    assert_eq!(window_start(2,0),Err(\"width\"));\n    println!(\"[-60, 0), [0, 60), [60, 120)\");\n}",
      "expectedOutput": "[-60, 0), [0, 60), [60, 120)",
      "hints": [
        "Bắt đầu từ bất biến và ca đầu vào không hợp lệ.",
        "Giữ một trường hợp biên trong assertion trước khi hoàn thiện lời giải."
      ],
      "quiz": {
        "question": "Đơn tạo lúc 23:59 nhưng nhận lúc 00:03. Báo cáo theo event time phải dựa vào đâu?",
        "options": [
          "Thời điểm nghiệp vụ và timezone đã định, cùng chính sách dữ liệu trễ.",
          "Thời điểm nhận vì dễ đo.",
          "Ngày máy chạy lại pipeline."
        ],
        "correct": 0,
        "explanation": "Event time giữ ý nghĩa nghiệp vụ qua lịch nhận/retry; dữ liệu đến muộn cần chính sách cập nhật minh bạch."
      },
      "reference": {
        "label": "Polars: cửa sổ theo thời gian",
        "url": "https://docs.pola.rs/user-guide/transformations/time-series/rolling/"
      }
    },
    {
      "id": "data-window-aggregates",
      "moduleId": "track-data",
      "title": "Tổng hợp cửa sổ, trọng số và số đo đúng",
      "description": "Tính rolling, trung bình và thống kê mà không sai do chia batch hoặc dữ liệu thiếu.",
      "duration": 55,
      "objectives": [
        "Gộp tổng và số mẫu trước khi chia.",
        "Xử lý tập rỗng.",
        "Phát hiện overflow."
      ],
      "sections": [
        {
          "title": "Một nhóm cần trạng thái đủ để gộp",
          "text": "Muốn tính trung bình của nhiều partition, cần giữ sum và count; trung bình của các trung bình chỉ đúng khi trọng số phù hợp. Ví dụ partition thứ nhất có một giá trị 100, partition thứ hai có chín giá trị zero: trung bình chung là 10, không phải 50. State gộp được cho phép engine xử lý song song và giảm dữ liệu trước khi trao đổi giữa worker. Hãy viết phép merge và chứng minh chia lại input không đổi kết quả trong miền số đã chọn."
        },
        {
          "title": "Cửa sổ cần quy tắc thành viên",
          "text": "Rolling theo số hàng khác rolling theo thời gian. Ba bản ghi mới nhất có thể trải qua một phút hoặc một tuần; cửa sổ một giờ có số lượng bản ghi thay đổi. Chốt hướng cửa sổ, việc bao gồm hàng hiện tại, min_periods và cách xử lý timestamp trùng. Bài tập lấy tối đa ba hàng kết thúc tại hàng hiện tại, chỉ tính giá trị Some và trả None nếu không có giá trị đã biết. Thứ tự phải được xác định trước, nếu không kết quả rolling không có ý nghĩa ổn định."
        },
        {
          "title": "Null và zero làm đổi mẫu số",
          "text": "Một hàng thiếu số đo không nên tự tăng count của giá trị đã biết. Khi COUNT(*) và COUNT(amount) được dùng lẫn nhau, một biểu đồ trung bình có thể bị kéo thấp dù dữ liệu gốc không đổi. Ghi đồng thời tổng hàng, số giá trị biết và tỷ lệ thiếu giúp người đọc hiểu chất lượng thống kê. Với weighted mean, kiểm tra tổng trọng số bằng zero và trọng số âm theo hợp đồng. Đừng chia bằng giá trị mặc định rồi hiển thị một số có vẻ chính xác nhưng không có định nghĩa."
        },
        {
          "title": "Số học quyết định khả năng tái lập",
          "text": "Cộng số nguyên có thể overflow; cộng số thực không kết hợp chính xác do làm tròn. Khi engine thay cách chia partition, sai khác nhỏ có thể xuất hiện dù kế hoạch tương đương về đại số. Chọn kiểu decimal hoặc số nguyên đơn vị nhỏ cho số tiền, xác định tolerance cho đo lường. Không so số thực bằng chuỗi in ra hoặc tự làm tròn trước mọi bước. Một tổng tham chiếu trên fixture có độ lớn chênh lệch giúp phát hiện mất chính xác và đánh giá liệu sai số có chấp nhận được không."
        },
        {
          "title": "Kiểm thử thuộc tính gộp",
          "text": "Ngoài fixture cố định, tách một danh sách ở nhiều vị trí rồi merge state và so với tính trực tiếp. Kiểm tra tập rỗng, toàn null, cửa sổ lớn hơn input và width bằng zero. Với median hoặc distinct count, không giả vờ sum/count đủ; thuật toán cần trạng thái khác hoặc xấp xỉ có sai số công bố. Khi trình bày kết quả dự án, chỉ rõ metric nào chính xác, metric nào xấp xỉ và bất biến nào được bảo vệ khi đổi kích thước batch. Đây là kỹ năng đọc và thiết kế aggregate thực tế."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Gộp trung bình theo số mẫu",
        "instructions": "Mỗi partition trả (sum,count). Viết merge dùng checked_add; mean trả None nếu count=0. Chứng minh [100] và chín số 0 có mean 10.",
        "requirements": [
          "Gộp tổng và số mẫu trước khi chia.",
          "Xử lý tập rỗng.",
          "Phát hiện overflow."
        ]
      },
      "starterCode": "// Gộp trung bình theo số mẫu\n// Gộp tổng và số mẫu trước khi chia.\n// Xử lý tập rỗng.\n// Phát hiện overflow.\nfn main() {\n    // Triển khai hàm theo đề và thêm assertion cho các ca biên.\n    todo!();\n}\n",
      "solutionCode": "fn merge(a:(i64,u64),b:(i64,u64))->Option<(i64,u64)> {Some((a.0.checked_add(b.0)?,a.1.checked_add(b.1)?))}\nfn mean(s:(i64,u64))->Option<f64> { if s.1==0 {None} else {Some(s.0 as f64/s.1 as f64)} }\nfn main() {\n    assert_eq!(mean(merge((100,1),(0,9)).unwrap()),Some(10.0));\n    assert_eq!(mean((0,0)),None);\n    assert_eq!(merge((i64::MAX,1),(1,1)),None);\n    println!(\"weighted mean=10\");\n}",
      "expectedOutput": "weighted mean=10",
      "hints": [
        "Bắt đầu từ bất biến và ca đầu vào không hợp lệ.",
        "Giữ một trường hợp biên trong assertion trước khi hoàn thiện lời giải."
      ],
      "quiz": {
        "question": "Hai partition có mean 100/0 và số mẫu 1/9. Mean toàn bộ là bao nhiêu?",
        "options": [
          "50 vì có hai partition.",
          "10 vì cần trọng số theo số mẫu.",
          "100 vì partition đầu xuất hiện trước."
        ],
        "correct": 1,
        "explanation": "Gộp sum=100 và count=10 rồi chia; không lấy trung bình hai mean không cùng trọng số."
      },
      "reference": {
        "label": "DataFusion: aggregate execution",
        "url": "https://datafusion.apache.org/library-user-guide/query-optimizer.html"
      }
    },
    {
      "id": "data-query-plans",
      "moduleId": "track-data",
      "title": "Đọc kế hoạch truy vấn và chứng minh tối ưu",
      "description": "Nhận diện scan, filter, projection, join và aggregate bằng dữ liệu vào/ra của từng bước.",
      "duration": 55,
      "objectives": [
        "Trả đúng hai kết quả khác nhau.",
        "Không sort ngầm.",
        "Giải thích điều kiện đổi thứ tự an toàn."
      ],
      "sections": [
        {
          "title": "Câu SQL không phải lịch thực thi",
          "text": "Một câu SELECT mô tả kết quả mong muốn, còn engine tạo logical plan rồi physical plan. Logical plan diễn tả scan, filter, projection và aggregate; physical plan bổ sung thuật toán, partition và trao đổi dữ liệu. Khi truy vấn chậm, xác định toán tử tiêu tốn thời gian hoặc bộ nhớ trước khi thay cấu hình. Việc câu SQL ngắn không chứng minh nó rẻ. Một JOIN không có điều kiện đủ chặt có thể tạo đầu ra lớn hơn nhiều lần cả hai bảng và làm mọi bước phía sau tốn kém."
        },
        {
          "title": "Đọc từ nguồn đến đầu ra",
          "text": "Bắt đầu ở scan: những cột nào được đọc, bao nhiêu file hoặc partition bị bỏ qua, filter nằm ở đâu? Tiếp theo xem join build bên nào, aggregate có partial/final hay không, sort có cần gom dữ liệu vào một luồng. Projection pushdown giúp giảm cột ở nguồn nếu provider hỗ trợ; đặt select ở cuối ứng dụng chưa chứng minh đã giảm bytes đọc. Lưu EXPLAIN cạnh truy vấn và ghi một giả thuyết có thể kiểm tra, như đọc hai cột thay vì hai mươi cột của dataset rộng."
        },
        {
          "title": "ANALYZE chạy công việc thật",
          "text": "EXPLAIN mô tả plan, còn EXPLAIN ANALYZE thực thi và thu số đo; không chạy tùy tiện trên workload lớn đang phục vụ người dùng. Số dòng ước tính khác số dòng thực giúp phát hiện statistics cũ hoặc dữ liệu lệch. Cộng thời gian từng toán tử không luôn bằng wall time vì các phần có thể chạy song song. Ghi rõ metric đo CPU, thời gian chờ, số dòng hay bytes. Khi query trả ít kết quả nhưng scan đọc toàn bộ, bottleneck vẫn có thể nằm ở nguồn."
        },
        {
          "title": "Đổi thứ tự có thể đổi ý nghĩa",
          "text": "Filter trước LIMIT khác filter sau LIMIT; filter trên bảng phải của left join trong WHERE có thể loại các dòng không khớp. Chỉ đẩy điều kiện qua một phép toán khi hiểu tương đương ngữ nghĩa. Bài tập dùng ba điểm số để cho thấy lấy hai dòng đầu rồi lọc khác lọc trước rồi lấy hai dòng. Optimizer hợp lệ phải bảo toàn hợp đồng SQL, nhưng một thay đổi do người viết pipeline thực hiện cần test riêng. Đừng sửa thứ tự chỉ để plan nhìn gọn hơn."
        },
        {
          "title": "Benchmark có đối chứng",
          "text": "Giữ nguyên dataset, query, dependency và cấu hình máy khi so hai phương án. Đo nhiều lần, phân biệt cold/warm cache và xác nhận kết quả sau sort chuẩn hóa. Với tập nhỏ, thêm partition có thể tốn hơn lợi ích song song; với tập lớn, memory limit và spill làm chi phí I/O tăng. Mỗi báo cáo tối ưu cần câu hỏi, plan trước sau, số đo và kiểm tra tính đúng. Nếu không ghi cấu hình, người khác không thể biết cải thiện đến từ code hay bộ nhớ cache đã được làm nóng."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Phân biệt LIMIT và filter",
        "instructions": "Tính kết quả filter score>=5 rồi lấy 2 mục, so với lấy2mục rồi filter. Giữ thứ tự đầu vào.",
        "requirements": [
          "Trả đúng hai kết quả khác nhau.",
          "Không sort ngầm.",
          "Giải thích điều kiện đổi thứ tự an toàn."
        ]
      },
      "starterCode": "// Phân biệt LIMIT và filter\n// Trả đúng hai kết quả khác nhau.\n// Không sort ngầm.\n// Giải thích điều kiện đổi thứ tự an toàn.\nfn main() {\n    // Triển khai hàm theo đề và thêm assertion cho các ca biên.\n    todo!();\n}\n",
      "solutionCode": "fn main() {\n    let scores=[1,7,8,3];\n    let filter_first:Vec<_>=scores.iter().copied().filter(|v|*v>=5).take(2).collect();\n    let limit_first:Vec<_>=scores.iter().copied().take(2).filter(|v|*v>=5).collect();\n    assert_eq!(filter_first,vec![7,8]); assert_eq!(limit_first,vec![7]);\n    println!(\"filter first: 7,8; limit first: 7\");\n}",
      "expectedOutput": "filter first: 7,8; limit first: 7",
      "hints": [
        "Bắt đầu từ bất biến và ca đầu vào không hợp lệ.",
        "Giữ một trường hợp biên trong assertion trước khi hoàn thiện lời giải."
      ],
      "quiz": {
        "question": "Một query dùng EXPLAIN ANALYZE trên dataset lớn. Có thực sự chạy query không?",
        "options": [
          "Có; cần ngân sách và môi trường đo phù hợp.",
          "Không, chỉ phân tích cú pháp.",
          "Chỉ chạy phần SELECT đầu tiên."
        ],
        "correct": 0,
        "explanation": "ANALYZE thu metric thực thi. Phải tính cả chi phí và tác động của workload dùng để đo."
      },
      "reference": {
        "label": "DataFusion: EXPLAIN",
        "url": "https://datafusion.apache.org/user-guide/sql/explain.html"
      },
      "simulation": {
        "title": "Một truy vấn đi qua các toán tử",
        "description": "Mô hình minh họa trên 1.000 hàng; số liệu dùng để theo dõi luồng dữ liệu, không phải benchmark.",
        "kind": "pipeline",
        "nodes": [
          {
            "id": "scan",
            "label": "Nguồn",
            "detail": "1.000 hàng, 10 cột"
          },
          {
            "id": "filter",
            "label": "Bộ lọc",
            "detail": "Giữ 100 hàng đúng điều kiện"
          },
          {
            "id": "project",
            "label": "Chọn cột",
            "detail": "Chỉ giữ 2 cột cần tính"
          },
          {
            "id": "aggregate",
            "label": "Tổng hợp",
            "detail": "Tạo báo cáo theo 4 nhóm"
          }
        ],
        "scenarios": [
          {
            "id": "early",
            "label": "Lọc và chọn cột sớm",
            "steps": [
              {
                "title": "Đọc hợp đồng",
                "description": "Plan yêu cầu hai cột từ nguồn hỗ trợ projection.",
                "activeNodeIds": [
                  "scan"
                ],
                "values": [
                  {
                    "label": "Cột cần đọc",
                    "value": "2/10"
                  }
                ]
              },
              {
                "title": "Lọc",
                "description": "Bộ lọc giữ các hàng thuộc ngày được chọn.",
                "activeNodeIds": [
                  "filter"
                ],
                "values": [
                  {
                    "label": "Hàng sau lọc",
                    "value": "100"
                  }
                ]
              },
              {
                "title": "Truyền dữ liệu hẹp",
                "description": "Các bước sau chỉ nhận hai cột.",
                "activeNodeIds": [
                  "project"
                ],
                "values": [
                  {
                    "label": "Ô dữ liệu tiếp tục",
                    "value": "200"
                  }
                ]
              },
              {
                "title": "Tổng hợp",
                "description": "Gộp thành bốn vùng theo cùng ngữ nghĩa.",
                "activeNodeIds": [
                  "aggregate"
                ],
                "values": [
                  {
                    "label": "Nhóm",
                    "value": "4"
                  }
                ]
              }
            ]
          },
          {
            "id": "late",
            "label": "Đọc rộng rồi thu hẹp",
            "steps": [
              {
                "title": "Đọc toàn bộ",
                "description": "Nguồn chưa nhận projection.",
                "activeNodeIds": [
                  "scan"
                ],
                "values": [
                  {
                    "label": "Cột đọc",
                    "value": "10/10"
                  }
                ]
              },
              {
                "title": "Truyền bản ghi rộng",
                "description": "Dữ liệu rộng chiếm thêm tài nguyên trước khi thu hẹp.",
                "activeNodeIds": [
                  "project"
                ],
                "values": [
                  {
                    "label": "Ô ban đầu",
                    "value": "10.000"
                  }
                ]
              },
              {
                "title": "Lọc muộn",
                "description": "Vẫn còn 100 hàng, nhưng công việc trước đó nhiều hơn.",
                "activeNodeIds": [
                  "filter"
                ],
                "values": [
                  {
                    "label": "Hàng sau lọc",
                    "value": "100"
                  }
                ]
              },
              {
                "title": "So kết quả",
                "description": "Kết quả có thể bằng nhau; dùng plan và số đo để đánh giá chi phí.",
                "activeNodeIds": [
                  "aggregate"
                ],
                "values": [
                  {
                    "label": "Nhóm",
                    "value": "4"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "id": "data-query-project",
      "moduleId": "track-data",
      "title": "Dự án: engine báo cáo phân vùng bằng DataFusion",
      "description": "Đăng ký Arrow batches, chạy SQL cố định, đối chiếu kết quả và đọc query plan.",
      "duration": 55,
      "objectives": [
        "Giữ số dòng và số giá trị biết riêng.",
        "Tổng nhóm toàn null có thể nhận biết bằng known=0.",
        "Kết quả không phụ thuộc cách chia partition."
      ],
      "sections": [
        {
          "title": "Một engine có ranh giới rõ",
          "text": "Dự án nhận các partition đơn hàng trong bộ nhớ, dùng Arrow RecordBatch làm ranh giới dữ liệu và DataFusion chạy truy vấn doanh thu theo khu vực. Đây là thư viện truy vấn nhúng, không phải dịch vụ cho phép người dùng gửi SQL bất kỳ. Đầu vào, các truy vấn được hỗ trợ và giới hạn kết quả được khai báo rõ. Bắt đầu từ dữ liệu nhỏ có thể tính tay; một vùng có toàn null, một vùng có số tiền zero và nhiều partition giúp phơi bày lỗi aggregate trước khi thêm nguồn tệp."
        },
        {
          "title": "Schema được kiểm tra tại cửa vào",
          "text": "Mỗi batch có hai array cùng độ dài và schema thống nhất. RecordBatch::try_new phát hiện độ dài sai, còn lớp ứng dụng cần kiểm tra đơn vị tiền, vùng rỗng và nguồn dữ liệu. Đăng ký MemTable với partition rõ ràng để thấy engine gộp kết quả qua các worker. Đừng coi partition là cam kết output order. Truy vấn báo cáo có ORDER BY để test và người dùng nhận thứ tự xác định, trong khi các API streaming có thể chỉ cam kết tập kết quả nếu điều đó được ghi rõ."
        },
        {
          "title": "Truy vấn mang theo chính sách null",
          "text": "Báo cáo trả SUM(amount), COUNT(amount) và COUNT(*) để phân biệt số đã biết với tổng dòng. Một nhóm toàn null có sum null và known count zero; biểu diễn này khác nhóm tổng zero do các giá trị thực bằng zero. Kiểm thử cần đọc đúng dtype của Arrow array rồi kiểm tra validity. Gọi value(i) mà không kiểm tra null sẽ bỏ qua metadata quan trọng. Việc format thành bảng để nhìn bằng mắt hữu ích khi học, nhưng assertion phải kiểm tra giá trị có kiểu thay vì chuỗi trang trí."
        },
        {
          "title": "Đối chiếu giữa các cách chia dữ liệu",
          "text": "Tạo cùng tập đơn hàng dưới một partition và nhiều partition rồi so kết quả. Lab có negative fixture dimension chứa hai khóa bac: SQL vẫn chạy nhưng tổng 200 thành 400. register_dimension từ chối khóa trùng; joined_report cũng báo lỗi khi fact không có dimension, tránh âm thầm mất hàng. Một fixture khác xếp sự kiện theo thứ tự arrival, giữ watermark trước mỗi lần đến và chạy cửa sổ event-time bằng SQL thật. Cửa sổ 1.000 ms là khoảng [start, start+1000), nên 999 và 1000 thuộc hai cửa sổ khác nhau. Với watermark 1000, event500 bị cách ly còn event1000 được nhận. Test so aggregate có sum/count với BTreeMap độc lập để kiểm cả ngữ nghĩa và tổng."
        },
        {
          "title": "Nâng cấp thành ứng dụng phân tích",
          "text": "README ghi đủ chính sách watermark: max event-time đã thấy trừ độ trễ cho phép, kiểm tra trước khi cập nhật max. Dữ liệu đến muộn được đếm riêng; đây là replay fixture hữu hạn, chưa phải stream processor có checkpoint. Người học mở rộng reader CSV, scan Parquet với projection rồi API chỉ nhận bộ lọc được cho phép. Đặt deadline, concurrency limit và giới hạn hàng trước khi mở API. Nộp negative fixtures join, biên cửa sổ, late-event, kế hoạch truy vấn và benchmark cùng version dataset. Thời gian debug test không phải số đo hiệu năng object storage hoặc spill."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Trạng thái aggregate gộp được",
        "instructions": "Viết add(state,Option<i64>) và merge cho trạng thái (sum,known,rows). None tăng rows nhưng không tăng known.",
        "requirements": [
          "Giữ số dòng và số giá trị biết riêng.",
          "Tổng nhóm toàn null có thể nhận biết bằng known=0.",
          "Kết quả không phụ thuộc cách chia partition."
        ]
      },
      "starterCode": "// Trạng thái aggregate gộp được\n// Giữ số dòng và số giá trị biết riêng.\n// Tổng nhóm toàn null có thể nhận biết bằng known=0.\n// Kết quả không phụ thuộc cách chia partition.\nfn main() {\n    // Triển khai hàm theo đề và thêm assertion cho các ca biên.\n    todo!();\n}\n",
      "solutionCode": "#[derive(Debug,Default,PartialEq,Eq)] struct Stats {sum:i64,known:usize,rows:usize}\nfn add(s:&mut Stats,v:Option<i64>){s.rows+=1;if let Some(n)=v{s.sum+=n;s.known+=1;}}\nfn merge(a:Stats,b:Stats)->Stats{Stats{sum:a.sum+b.sum,known:a.known+b.known,rows:a.rows+b.rows}}\nfn main(){\n let mut a=Stats::default(); add(&mut a,Some(100));add(&mut a,None);\n let mut b=Stats::default(); add(&mut b,Some(20));\n let s=merge(a,b);assert_eq!(s,Stats{sum:120,known:2,rows:3});\n println!(\"sum=120 known=2 rows=3\");\n}",
      "expectedOutput": "sum=120 known=2 rows=3",
      "hints": [
        "Bắt đầu từ bất biến và ca đầu vào không hợp lệ.",
        "Giữ một trường hợp biên trong assertion trước khi hoàn thiện lời giải."
      ],
      "quiz": {
        "question": "Nhóm có ba hàng amount=null nên báo cáo thế nào?",
        "options": [
          "SUM=0, COUNT(amount)=3.",
          "Không có nhóm nào.",
          "SUM=null, COUNT(amount)=0, COUNT(*)=3."
        ],
        "correct": 2,
        "explanation": "Nhóm tồn tại nhưng không có giá trị tiền đã biết; giữ null giúp tránh biến thiếu dữ liệu thành doanh thu zero."
      },
      "reference": {
        "label": "DataFusion: Arrow và SessionContext",
        "url": "https://docs.rs/datafusion/55.2.0/datafusion/"
      },
      "localLab": {
        "title": "Engine báo cáo theo partition với DataFusion",
        "instructions": "Dự án đăng ký Arrow batches bằng MemTable, chạy SQL cố định và đối chiếu partition, join, event-time window. Fixture âm chứng minh khóa dimension trùng nhân doanh thu và sự kiện quá watermark phải cách ly. Chạy trên CPU; chưa mở SQL tùy ý ra mạng. Sau khi hiểu engine, thêm reader CSV/Parquet theo các mốc.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname=\"analytical-engine\"\nversion=\"0.1.0\"\nedition=\"2024\"\nrust-version=\"1.94\"\n[dependencies]\ndatafusion={version=\"=55.2.0\",default-features=false,features=[\"sql\"]}\ntokio={version=\"=1.54.1\",features=[\"macros\",\"rt-multi-thread\"]}\n[profile.dev]\ndebug=0\n[profile.test]\ndebug=0\n"
          },
          {
            "path": "src/lib.rs",
            "content": "use std::sync::Arc;\nuse datafusion::arrow::{array::{Int64Array, StringArray}, datatypes::{DataType, Field, Schema, SchemaRef}, record_batch::RecordBatch};\nuse datafusion::{datasource::MemTable, error::Result, prelude::SessionContext};\npub const QUERY:&str=\"SELECT region, SUM(amount) AS total, COUNT(amount) AS known, COUNT(*) AS rows FROM orders GROUP BY region ORDER BY region\";\npub fn schema()->SchemaRef {Arc::new(Schema::new(vec![Field::new(\"region\",DataType::Utf8,false),Field::new(\"amount\",DataType::Int64,true)]))}\npub fn batch(regions:Vec<&str>,amounts:Vec<Option<i64>>)->Result<RecordBatch>{Ok(RecordBatch::try_new(schema(),vec![Arc::new(StringArray::from(regions)),Arc::new(Int64Array::from(amounts))])?)}\npub fn context(partitions:Vec<Vec<RecordBatch>>)->Result<SessionContext>{\n let table=MemTable::try_new(schema(),partitions)?;let ctx=SessionContext::new();ctx.register_table(\"orders\",Arc::new(table))?;Ok(ctx)\n}\npub async fn report(ctx:&SessionContext)->Result<Vec<RecordBatch>>{ctx.sql(QUERY).await?.collect().await}\n\n\nfn failure(message:&str)->datafusion::error::DataFusionError {\n datafusion::error::DataFusionError::Execution(message.to_owned())\n}\npub fn register_dimension(ctx:&SessionContext,keys:Vec<&str>,names:Vec<&str>)->Result<()>{\n let mut seen=std::collections::HashSet::new();\n if keys.iter().any(|key|key.is_empty()||!seen.insert(*key)){\n  return Err(failure(\"duplicate_or_empty_dimension_key\"));\n }\n let schema=Arc::new(Schema::new(vec![Field::new(\"region\",DataType::Utf8,false),Field::new(\"name\",DataType::Utf8,false)]));\n let batch=RecordBatch::try_new(schema.clone(),vec![Arc::new(StringArray::from(keys)),Arc::new(StringArray::from(names))])?;\n ctx.register_table(\"regions\",Arc::new(MemTable::try_new(schema,vec![vec![batch]])?))?;\n Ok(())\n}\npub async fn joined_report(ctx:&SessionContext)->Result<Vec<RecordBatch>>{\n // A missing dimension is an error, rather than silently dropping fact rows.\n let missing=ctx.sql(\"SELECT COUNT(*) AS n FROM orders o LEFT JOIN regions d ON o.region=d.region WHERE d.region IS NULL\").await?.collect().await?;\n let count=missing[0].column(0).as_any().downcast_ref::<Int64Array>().ok_or_else(||failure(\"count_type\"))?;\n if count.value(0)!=0{return Err(failure(\"missing_dimension_key\"));}\n ctx.sql(\"SELECT d.name AS region, SUM(o.amount) AS total, COUNT(o.amount) AS known, COUNT(*) AS rows FROM orders o JOIN regions d ON o.region=d.region GROUP BY d.name ORDER BY d.name\").await?.collect().await\n}\npub fn register_events(ctx:&SessionContext,events:&[(i64,i64)],allowed_lateness_ms:i64)->Result<()>{\n if allowed_lateness_ms<0 || events.iter().any(|(time,amount)|*time<0||*amount<0){return Err(failure(\"event_contract\"));}\n let mut max_seen=0_i64;\n let mut times=vec![];let mut amounts=vec![];let mut watermarks=vec![];\n for &(time,amount) in events{\n  // Arrival order is the input order. Capture the watermark BEFORE this arrival.\n  let watermark=max_seen.saturating_sub(allowed_lateness_ms);\n  times.push(time);amounts.push(amount);watermarks.push(watermark);\n  max_seen=max_seen.max(time);\n }\n let schema=Arc::new(Schema::new(vec![\n  Field::new(\"event_ms\",DataType::Int64,false),\n  Field::new(\"amount\",DataType::Int64,false),\n  Field::new(\"watermark_before_ms\",DataType::Int64,false)\n ]));\n let batch=RecordBatch::try_new(schema.clone(),vec![\n  Arc::new(Int64Array::from(times)),Arc::new(Int64Array::from(amounts)),Arc::new(Int64Array::from(watermarks))\n ])?;\n ctx.register_table(\"events\",Arc::new(MemTable::try_new(schema,vec![vec![batch]])?))?;\n Ok(())\n}\npub const WINDOW_QUERY:&str=\"SELECT event_ms - (event_ms % 1000) AS window_start_ms, SUM(amount) AS total, COUNT(*) AS rows FROM events WHERE event_ms >= watermark_before_ms GROUP BY event_ms - (event_ms % 1000) ORDER BY window_start_ms\";\npub async fn window_report(ctx:&SessionContext)->Result<Vec<RecordBatch>>{\n ctx.sql(WINDOW_QUERY).await?.collect().await\n}\npub async fn late_event_count(ctx:&SessionContext)->Result<i64>{\n let batches=ctx.sql(\"SELECT COUNT(*) AS n FROM events WHERE event_ms < watermark_before_ms\").await?.collect().await?;\n let count=batches[0].column(0).as_any().downcast_ref::<Int64Array>().ok_or_else(||failure(\"count_type\"))?;\n Ok(count.value(0))\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use analytical_engine::{batch,context,QUERY};\n#[tokio::main] async fn main()->datafusion::error::Result<()>{\n let ctx=context(vec![vec![batch(vec![\"bac\",\"nam\"],vec![Some(120),Some(0)])?],vec![batch(vec![\"bac\",\"tay\"],vec![Some(80),None])?]])?;\n ctx.sql(QUERY).await?.show().await?;\n ctx.sql(&format!(\"EXPLAIN {QUERY}\")).await?.show().await?;Ok(())\n}\n"
          },
          {
            "path": "tests/engine.rs",
            "content": "use analytical_engine::{batch,context,report,QUERY};\nuse datafusion::{arrow::{array::{Array,Int64Array,StringArray},record_batch::RecordBatch},error::Result};\nfn rows(batches:&[RecordBatch])->Vec<(String,Option<i64>,i64,i64)>{\n let mut out=vec![];for b in batches{\n let region=b.column(0).as_any().downcast_ref::<StringArray>().unwrap();\n let total=b.column(1).as_any().downcast_ref::<Int64Array>().unwrap();\n let known=b.column(2).as_any().downcast_ref::<Int64Array>().unwrap();\n let all=b.column(3).as_any().downcast_ref::<Int64Array>().unwrap();\n for i in 0..b.num_rows(){out.push((region.value(i).into(),(!total.is_null(i)).then(||total.value(i)),known.value(i),all.value(i)));}}\n out\n}\n#[tokio::test] async fn partition_layout_preserves_report()->Result<()>{\n let one=context(vec![vec![batch(vec![\"bac\",\"bac\",\"nam\",\"tay\"],vec![Some(120),Some(80),Some(0),None])?]])?;\n let two=context(vec![vec![batch(vec![\"bac\",\"nam\"],vec![Some(120),Some(0)])?],vec![batch(vec![\"bac\",\"tay\"],vec![Some(80),None])?]])?;\n let expected=vec![(\"bac\".into(),Some(200),2,2),(\"nam\".into(),Some(0),1,1),(\"tay\".into(),None,0,1)];\n assert_eq!(rows(&report(&one).await?),expected);assert_eq!(rows(&report(&two).await?),expected);Ok(())\n}\n#[tokio::test] async fn empty_input_is_empty()->Result<()>{let ctx=context(vec![vec![]])?;assert!(rows(&report(&ctx).await?).is_empty());Ok(())}\n#[tokio::test] async fn plans_and_errors_are_observable()->Result<()>{\n let ctx=context(vec![vec![batch(vec![\"bac\"],vec![Some(1)])?]])?;\n assert!(ctx.sql(\"SELECT missing FROM orders\").await.is_err());\n let plan=ctx.sql(&format!(\"EXPLAIN {QUERY}\")).await?.collect().await?;\n assert!(plan.iter().map(RecordBatch::num_rows).sum::<usize>()>0);Ok(())\n}\n#[test] fn length_mismatch_rejected(){assert!(batch(vec![\"bac\",\"nam\"],vec![Some(1)]).is_err());}\n\n\n#[tokio::test] async fn duplicate_dimension_keys_are_rejected_before_join()->Result<()>{\n use analytical_engine::{register_dimension,joined_report};\n let ctx=context(vec![vec![batch(vec![\"bac\",\"bac\"],vec![Some(120),Some(80)])?]])?;\n assert!(register_dimension(&ctx,vec![\"bac\",\"bac\"],vec![\"North\",\"North duplicate\"]).is_err());\n // The raw SQL fixture demonstrates WHY validation matters: two dimension rows double SUM.\n let bad=ctx.sql(\"SELECT SUM(o.amount) AS total FROM orders o JOIN (VALUES ('bac'),('bac')) AS d(region) ON o.region=d.region\").await?.collect().await?;\n let total=bad[0].column(0).as_any().downcast_ref::<Int64Array>().unwrap();\n assert_eq!(total.value(0),400);\n register_dimension(&ctx,vec![\"bac\"],vec![\"North\"])?;\n assert_eq!(rows(&joined_report(&ctx).await?),vec![(\"North\".into(),Some(200),2,2)]);\n Ok(())\n}\n#[tokio::test] async fn missing_dimension_does_not_silently_drop_facts()->Result<()>{\n use analytical_engine::{register_dimension,joined_report};\n let ctx=context(vec![vec![batch(vec![\"bac\",\"nam\"],vec![Some(120),Some(80)])?]])?;\n register_dimension(&ctx,vec![\"bac\"],vec![\"North\"])?;\n assert!(joined_report(&ctx).await.unwrap_err().to_string().contains(\"missing_dimension_key\"));Ok(())\n}\nfn window_rows(batches:&[RecordBatch])->Vec<(i64,i64,i64)>{\n let mut out=vec![];\n for batch in batches{\n  let start=batch.column(0).as_any().downcast_ref::<Int64Array>().unwrap();\n  let total=batch.column(1).as_any().downcast_ref::<Int64Array>().unwrap();\n  let count=batch.column(2).as_any().downcast_ref::<Int64Array>().unwrap();\n  for i in 0..batch.num_rows(){out.push((start.value(i),total.value(i),count.value(i)));}\n }out\n}\n#[tokio::test] async fn event_time_windows_preserve_boundaries_and_quarantine_late_data()->Result<()>{\n use analytical_engine::{register_events,window_report,late_event_count};\n let ctx=datafusion::prelude::SessionContext::new();\n // Arrival order differs from event time. After 2000, watermark=1000:\n // event500 is late; event1000 is exactly on the acceptance boundary.\n let events=[(0,5),(999,7),(1000,11),(2000,13),(500,100),(1000,17),(1999,19)];\n register_events(&ctx,&events,1000)?;\n assert_eq!(late_event_count(&ctx).await?,1);\n assert_eq!(window_rows(&window_report(&ctx).await?),vec![(0,12,2),(1000,47,3),(2000,13,1)]);\n // Independent reference implementation follows the published arrival-order policy.\n let mut expected=std::collections::BTreeMap::<i64,(i64,i64)>::new();\n let mut max_seen=0_i64;let mut late=0;\n for (time,amount) in events{\n  if time<max_seen.saturating_sub(1000){late+=1;}else{\n   let aggregate=expected.entry(time-time%1000).or_default();aggregate.0+=amount;aggregate.1+=1;\n  }\n  max_seen=max_seen.max(time);\n }\n assert_eq!(late,1);\n assert_eq!(window_rows(&window_report(&ctx).await?),expected.into_iter().map(|(start,(total,count))|(start,total,count)).collect::<Vec<_>>());\n Ok(())\n}\n#[test] fn event_contract_rejects_negative_time_and_lateness(){\n use analytical_engine::register_events;\n let ctx=datafusion::prelude::SessionContext::new();\n assert!(register_events(&ctx,&[(1,5)],-1).is_err());\n assert!(register_events(&ctx,&[(-1,5)],1000).is_err());\n}\n"
          },
          {
            "path": "README.md",
            "content": "# Engine báo cáo\n\ncargo test --all-targets\ncargo run\n\nĐầu ra bac=(200,2,2), nam=(0,1,1), tay=(null,0,1). Ba cột số lần lượt là tổng, số giá trị biết và số hàng. Test kiểm tra cả null bitmap và kiểu Arrow.\n\nMở rộng: nhận CSV có schema tường minh, thêm scan Parquet và đối chiếu cùng fixture. Ghi EXPLAIN trước/sau projection. Nếu mở thành API, chỉ cho truy vấn đã định nghĩa, giới hạn kết quả/thời gian/đồng thời. Bản mẫu kiểm tra engine trong bộ nhớ, chưa đo I/O hoặc spill. Không dùng thời gian chạy test làm benchmark.\n\n## Join có kiểm soát cardinality\n\nregister_dimension từ chối khóa rỗng/trùng trước khi đăng ký bảng. joined_report kiểm missing dimension bằng LEFT JOIN rồi mới tổng hợp; không âm thầm bỏ fact. Test SQL cố ý join dimension có hai khóa bac chứng minh SUM bị nhân từ 200 lên 400. Đường API hợp lệ giữ 200 và hai dòng.\n\n## Event time và dữ liệu đến muộn\n\nFixture events lưu thời gian sự kiện theo millisecond, số tiền nguyên và watermark trước từng lần đến. Thứ tự vector là thứ tự arrival. Watermark = max(event time đã thấy) − allowed_lateness_ms; sự kiện có time nhỏ hơn watermark đi vào số đếm late, bằng watermark vẫn được nhận. Cửa sổ tumbling 1.000 ms là [start, start+1000). Ví dụ 999 ở cửa sổ 0, 1000 ở cửa sổ 1000; sau khi đã thấy 2000 với lateness1000, event500 bị loại còn event1000 được nhận. Query chạy trên DataFusion thật, kết quả đối chiếu BTreeMap độc lập: (start,total,count) là (0,12,2), (1000,47,3), (2000,13,1), late=1.\n\nĐây là replay fixture hữu hạn, chưa phải stream processor có checkpoint. Trước khi nhận stream lâu dài phải giữ watermark/checkpoint bền và chính sách sửa cửa sổ đã đóng; không suy ra xử lý chính xác một lần từ filter SQL. Nghiệm thu bằng test duplicate/missing dimension, boundary999/1000, out-of-order và late-event; ghi rõ chính sách thời gian trong báo cáo.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run"
        ],
        "checks": [
          "Một và hai partition cho cùng kết quả sau ORDER BY.",
          "Phân biệt nhóm tổng zero với nhóm toàn null.",
          "EXPLAIN trả plan, cột không tồn tại trả lỗi và độ dài array sai bị từ chối.",
          "Join raw với khóa dimension trùng làm SUM 200→400; API hợp lệ từ chối trùng/thiếu khóa và giữ đúng cardinality.",
          "Cửa sổ [start,start+1000) giữ ranh giới 999/1000; late=1 được cách ly, kết quả DataFusion khớp BTreeMap theo arrival-order."
        ]
      }
    },
    {
      "id": "data-partition-design",
      "moduleId": "track-data",
      "title": "Thiết kế partition, dữ liệu lệch và Parquet",
      "description": "Chọn cách chia dữ liệu theo truy vấn, ngân sách tệp và phân bố khóa.",
      "duration": 55,
      "objectives": [
        "Cùng khóa và cấu hình cho cùng bucket.",
        "Từ chối buckets=0.",
        "Không dùng seed ngẫu nhiên của HashMap."
      ],
      "sections": [
        {
          "title": "Partition lưu trữ và partition thực thi",
          "text": "Thư mục theo ngày là partition của dataset trên đĩa; luồng xử lý độc lập trong physical plan là partition thực thi. Hai khái niệm có thể liên quan nhưng không đồng nhất. Một tệp lớn có thể được chia thành nhiều nhóm công việc, còn nhiều tệp nhỏ có thể gộp lại để giảm overhead. Đặt tên riêng cho từng loại trong báo cáo hiệu năng. Khi ai đó nói tăng partition sẽ nhanh hơn, hãy hỏi họ định đổi bố cục dữ liệu hay số công việc engine chạy đồng thời."
        },
        {
          "title": "Chọn khóa từ truy vấn cần phục vụ",
          "text": "Nếu phần lớn truy vấn lọc theo ngày, partition theo ngày có thể giúp bỏ qua dữ liệu ngoài khoảng thời gian. Nếu partition theo customer_id có hàng triệu giá trị, số thư mục và tệp nhỏ có thể khiến metadata trở thành bottleneck. Quyết định cần dựa vào phân bố khóa, kích thước mỗi batch và bộ lọc thường dùng. Một khóa có cardinality cao không tự nhiên là lựa chọn tốt. Ghi giả thuyết, tạo dataset với phân bố đại diện rồi đo số file mở, bytes đọc và độ trễ."
        },
        {
          "title": "Skew phá vỡ cân bằng",
          "text": "Một khách hàng chiếm phần lớn đơn hàng khiến hash partition có một worker giữ nhiều dữ liệu hơn các worker khác. Tăng số bucket không luôn giải quyết được một khóa nóng vì tất cả bản ghi của khóa đó vẫn cùng nhóm. Có thể tổng hợp cục bộ trước shuffle, chia khóa nóng với bước gộp cuối hoặc thay chiến lược join. Mỗi cách phải bảo toàn ngữ nghĩa. Trước tối ưu, đo hàng và bytes của từng partition; tổng dữ liệu nhỏ vẫn có thể tạo một nhóm quá lớn làm hết bộ nhớ."
        },
        {
          "title": "Row group và statistics",
          "text": "Parquet lưu metadata theo nhóm hàng giúp engine quyết định có thể bỏ qua phần nào. Khi dữ liệu được sắp phù hợp bộ lọc, min/max có thể thu hẹp lượng đọc; dữ liệu trộn hoàn toàn khiến min/max của mọi nhóm gần giống nhau. Nhóm quá nhỏ làm tăng metadata, quá lớn có thể giảm hiệu quả bỏ qua. Không có một kích thước tốt cho mọi workload. Việc streaming output không loại bỏ chi phí sort hoặc join; xem cả bước tạo Parquet và bước đọc trong ngân sách chung."
        },
        {
          "title": "Bài tập và cách nghiệm thu",
          "text": "Bài tập dùng hàm băm ổn định để gán khóa vào bucket và từ chối số bucket bằng zero. Hàm minh họa không dùng cho bảo mật; mục tiêu là kết quả không phụ thuộc tiến trình hay HashMap seed. Trong dự án, bổ sung histogram kích thước partition, ca khóa nóng và thử hai bố cục tệp. Chứng minh cùng dữ liệu logic cho cùng tổng sau chuẩn hóa thứ tự. Bản bố cục mới cần version trong manifest để reader không đọc lẫn tệp của hai chiến lược và nhân đôi dữ liệu."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Gán bucket có thể tái lập",
        "instructions": "Viết FNV-1a 64-bit để băm byte UTF-8 rồi modulo số bucket. Bài tập chỉ dùng để phân phối ổn định, không dùng cho mật mã.",
        "requirements": [
          "Cùng khóa và cấu hình cho cùng bucket.",
          "Từ chối buckets=0.",
          "Không dùng seed ngẫu nhiên của HashMap."
        ]
      },
      "starterCode": "// Gán bucket có thể tái lập\n// Cùng khóa và cấu hình cho cùng bucket.\n// Từ chối buckets=0.\n// Không dùng seed ngẫu nhiên của HashMap.\nfn main() {\n    // Triển khai hàm theo đề và thêm assertion cho các ca biên.\n    todo!();\n}\n",
      "solutionCode": "fn bucket(key:&str,buckets:u64)->Option<u64>{\n if buckets==0{return None;}\n let mut hash=0xcbf29ce484222325u64;\n for b in key.bytes(){hash^=b as u64;hash=hash.wrapping_mul(0x100000001b3);}\n Some(hash%buckets)\n}\nfn main(){assert_eq!(bucket(\"ha-noi\",0),None);assert_eq!(bucket(\"ha-noi\",16),bucket(\"ha-noi\",16));assert!(bucket(\"Đà Nẵng\",16).unwrap()<16);println!(\"stable bucket in 0..16\");}",
      "expectedOutput": "stable bucket in 0..16",
      "hints": [
        "Bắt đầu từ bất biến và ca đầu vào không hợp lệ.",
        "Giữ một trường hợp biên trong assertion trước khi hoàn thiện lời giải."
      ],
      "quiz": {
        "question": "Một khóa chiếm 90% dữ liệu. Tăng số hash bucket có chắc loại bỏ skew không?",
        "options": [
          "Có, mọi bucket luôn cân bằng.",
          "Không, một khóa vẫn thường vào cùng bucket; cần đo và chọn chiến lược gộp phù hợp.",
          "Có nếu đổi tên khóa."
        ],
        "correct": 1,
        "explanation": "Hash phân phối khóa, không chia các bản ghi cùng một khóa thành nhiều nhóm độc lập theo mặc định."
      },
      "reference": {
        "label": "Polars: Parquet",
        "url": "https://docs.pola.rs/user-guide/io/parquet/"
      }
    },
    {
      "id": "data-incremental",
      "moduleId": "track-data",
      "title": "Pipeline tăng dần, CDC và tính lặp lại an toàn",
      "description": "Áp dụng insert/update/delete theo version để retry không làm sai dataset.",
      "duration": 55,
      "objectives": [
        "Retry cùng dữ liệu là no-op.",
        "Sự kiện cũ không ghi đè trạng thái mới.",
        "Xung đột không thay đổi state."
      ],
      "sections": [
        {
          "title": "Snapshot và changelog khác đầu vào",
          "text": "Snapshot mô tả trạng thái tại một thời điểm; changelog mô tả các thay đổi cần áp dụng. Nếu coi một update là một đơn hàng mới rồi cộng tiền, báo cáo sẽ đếm cả giá trị cũ và mới. Hợp đồng CDC cần khóa, loại thao tác, version hoặc vị trí nguồn và quy tắc delete. Một event_time đẹp không luôn đủ sắp thứ tự thay đổi; hai cập nhật có thể chung timestamp. Chọn định danh tiến triển do nguồn bảo đảm và lưu nó cùng checkpoint của pipeline."
        },
        {
          "title": "Idempotency cần nhận ra cùng thay đổi",
          "text": "Retry không được làm tăng số dòng hoặc tổng tiền lần nữa. Bài tập giữ bản mới nhất theo khóa: version lớn hơn thay thế, version nhỏ hơn bị bỏ qua, cùng version cùng payload là no-op. Cùng version nhưng payload khác phải trả lỗi xung đột. Nếu chỉ kiểm tra event ID đã thấy, hệ thống có thể bỏ qua một thay đổi thực có ID được tái sử dụng sai. Việc giữ payload hoặc digest cùng version giúp phát hiện lỗi nguồn thay vì che giấu bằng nhãn duplicate."
        },
        {
          "title": "Delete cần tombstone hoặc giới hạn lịch sử",
          "text": "Xóa khóa khỏi map rồi quên version khiến một update cũ đến muộn có thể làm bản ghi sống lại. Tombstone giữ version xóa để biết các thay đổi cũ không còn hợp lệ. Có thể dọn tombstone khi nguồn và retention cho phép chứng minh không còn event cũ cần xử lý; không đặt TTL tùy ý chỉ để giảm RAM. Với batch snapshot, chính sách thay toàn bộ partition lại khác CDC theo từng khóa. Ghi rõ mô hình nào đang dùng trước khi xây lịch retry và rollback."
        },
        {
          "title": "Checkpoint phải gắn với commit",
          "text": "Nếu ghi checkpoint trước khi công bố kết quả rồi tiến trình chết, lần sau bỏ qua dữ liệu chưa được lưu. Nếu công bố trước checkpoint, retry có thể gặp dữ liệu đã có; khi đó cần idempotency hoặc commit chung. Một manifest phiên bản có thể giữ cả source offset và release ID, nhưng không tự tạo transaction xuyên mọi hệ thống. Khi nguồn và đích không chung transaction, thiết kế recovery cho từng khoảng lỗi. Đừng dùng cụm exactly-once mà không nêu phạm vi quan sát và điều kiện của nó."
        },
        {
          "title": "Kiểm thử bằng thứ tự bất lợi",
          "text": "Tạo chuỗi insert v1, update v3, retry v3, update v2, delete v4, retry v2. Chạy toàn chuỗi, chạy lại một đoạn và mô phỏng restart từ checkpoint; trạng thái cuối phải giống nhau theo hợp đồng. Với aggregate tăng dần, cập nhật cần trừ đóng góp cũ rồi thêm đóng góp mới trong cùng commit. Giữ test cho delete của khóa chưa tồn tại, tràn số và xung đột cùng version. Khi nộp dự án, chỉ rõ dữ liệu nào được giữ để chứng minh retry an toàn, không chỉ ghi rằng đã dùng HashSet."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Áp dụng thay đổi theo version",
        "instructions": "Giữ State(version,value). Version mới thay thế; cũ bỏ qua; version bằng nhau khác value trả conflict mà không đổi state.",
        "requirements": [
          "Retry cùng dữ liệu là no-op.",
          "Sự kiện cũ không ghi đè trạng thái mới.",
          "Xung đột không thay đổi state."
        ]
      },
      "starterCode": "// Áp dụng thay đổi theo version\n// Retry cùng dữ liệu là no-op.\n// Sự kiện cũ không ghi đè trạng thái mới.\n// Xung đột không thay đổi state.\nfn main() {\n    // Triển khai hàm theo đề và thêm assertion cho các ca biên.\n    todo!();\n}\n",
      "solutionCode": "#[derive(Debug,Clone,PartialEq,Eq)] struct State{version:u64,value:Option<i64>}\nfn apply(s:&mut State,v:u64,value:Option<i64>)->Result<bool,&'static str>{\n if v<s.version{return Ok(false);} if v==s.version{return if value==s.value{Ok(false)}else{Err(\"conflict\")};}\n *s=State{version:v,value};Ok(true)\n}\nfn main(){let mut s=State{version:1,value:Some(10)};assert_eq!(apply(&mut s,3,Some(30)),Ok(true));assert_eq!(apply(&mut s,3,Some(30)),Ok(false));assert_eq!(apply(&mut s,3,Some(99)),Err(\"conflict\"));assert_eq!(apply(&mut s,4,None),Ok(true));assert_eq!(apply(&mut s,2,Some(20)),Ok(false));assert_eq!(s.value,None);println!(\"version=4 tombstone\");}",
      "expectedOutput": "version=4 tombstone",
      "hints": [
        "Bắt đầu từ bất biến và ca đầu vào không hợp lệ.",
        "Giữ một trường hợp biên trong assertion trước khi hoàn thiện lời giải."
      ],
      "quiz": {
        "question": "Vì sao xóa bản ghi rồi quên version có thể gây lỗi CDC?",
        "options": [
          "Vì mọi delete bắt buộc có dữ liệu mới.",
          "Một update cũ có thể làm bản ghi sống lại.",
          "Vì version chỉ dùng để sắp xếp UI."
        ],
        "correct": 1,
        "explanation": "Tombstone lưu dấu vết xóa để từ chối thay đổi cũ đến muộn."
      },
      "reference": {
        "label": "Iceberg: snapshot và commit",
        "url": "https://iceberg.apache.org/docs/latest/reliability/"
      }
    },
    {
      "id": "data-reproducibility",
      "moduleId": "track-data",
      "title": "Tái lập phân tích và kiểm thử đối chiếu",
      "description": "Gắn dataset, cấu hình, code và phép đo thành một thí nghiệm có thể review.",
      "duration": 55,
      "objectives": [
        "Dùng độ dài byte UTF-8.",
        "Không ghép trần các chuỗi.",
        "Cùng danh sách cho cùng encoding."
      ],
      "sections": [
        {
          "title": "Một con số cần truy được nguồn",
          "text": "Báo cáo doanh thu chỉ có ý nghĩa khi biết nó được tính từ dữ liệu nào, phiên bản quy tắc nào và tại thời điểm nào. Lưu manifest gồm danh sách input, digest, schema version, query version và cấu hình quan trọng. Nhãn today hoặc latest không đủ để tái lập. Khi có lỗi, người review phải lấy đúng tập đầu vào và chạy lại mà không phụ thuộc tệp đã bị ghi đè. Chính vì vậy snapshot bất biến và tên phiên bản rõ là một phần của tính đúng, không chỉ tiện ích vận hành."
        },
        {
          "title": "Kết quả tham chiếu phải độc lập",
          "text": "Một test gọi cùng hàm hai lần rồi so nhau chỉ chứng minh tính lặp lại của hàm, không chứng minh công thức đúng. Với fixture nhỏ, tính kết quả bằng tay hoặc implementation đơn giản khác engine. Lưu số đơn, số reject, số null và tổng theo từng nhóm, không chỉ tổng cuối. Hai lỗi có thể triệt tiêu nhau ở tổng toàn bảng. Đổi thứ tự input và cách chia partition là phép thử bổ sung hữu ích, nhưng không thay thế fixture có đáp án biết trước."
        },
        {
          "title": "So sánh theo hợp đồng",
          "text": "Nếu output không hứa thứ tự, sort theo khóa ổn định trước khi so; nếu có tie, thêm khóa phụ để không phụ thuộc scheduler. Số thực cần tolerance tuyệt đối hoặc tương đối phù hợp miền; NaN và infinity cần chính sách riêng. Với số tiền nguyên, không đưa tolerance vào để che sai lệch. So cả schema và null bitmap vì một cột toàn zero không tương đương cột toàn null. Kiểm thử snapshot dạng văn bản chỉ nên dùng cho đầu ra đã chuẩn hóa, tránh phụ thuộc định dạng bảng của dependency."
        },
        {
          "title": "Đo đúng thứ đang tối ưu",
          "text": "Tách thời gian chuẩn bị dữ liệu, compile, warm-up và chạy query. Ghi release/debug, số thread, RAM, CPU, input bytes, số dòng và kích thước output. Chạy nhiều lần để thấy biến động; không chỉ chọn lần nhanh nhất. Một cải thiện latency có thể tăng peak memory hoặc làm dữ liệu lệch tệ hơn. Báo cáo cả workload bình thường và ca căng. Nếu tối ưu chỉ có lợi khi cache nóng, trình bày điều kiện đó để nhóm vận hành không kỳ vọng vào một tốc độ không tái hiện được."
        },
        {
          "title": "Đánh giá khả năng vào dự án",
          "text": "Người học cần bảo vệ một thay đổi bằng bằng chứng: fixture thất bại trước sửa, test đạt sau sửa, plan và số đo không đổi ngữ nghĩa. Khi review, đặt câu hỏi vì sao một phép gộp đúng với mọi cách chia batch, xử lý null ở đâu và dữ liệu mới được công bố lúc nào. Bài tập ghép các trường manifest bằng length prefix để tránh nhập nhằng chuỗi; đây là encoding minh họa, không phải digest mật mã. Lab công bố dùng SHA-256 cho định danh dữ liệu và giữ manifest để kiểm chứng."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Encoding manifest không nhập nhằng",
        "instructions": "Ghép các trường UTF-8 bằng độ dài byte rồi dấu ':' và dữ liệu. ['ab','c'] phải khác ['a','bc'].",
        "requirements": [
          "Dùng độ dài byte UTF-8.",
          "Không ghép trần các chuỗi.",
          "Cùng danh sách cho cùng encoding."
        ]
      },
      "starterCode": "// Encoding manifest không nhập nhằng\n// Dùng độ dài byte UTF-8.\n// Không ghép trần các chuỗi.\n// Cùng danh sách cho cùng encoding.\nfn main() {\n    // Triển khai hàm theo đề và thêm assertion cho các ca biên.\n    todo!();\n}\n",
      "solutionCode": "fn encode(fields:&[&str])->String{fields.iter().map(|s|format!(\"{}:{s}\",s.len())).collect()}\nfn main(){assert_ne!(encode(&[\"ab\",\"c\"]),encode(&[\"a\",\"bc\"]));assert_eq!(encode(&[\"á\",\"x\"]),\"2:á1:x\");assert_eq!(encode(&[]),\"\");println!(\"2:á1:x\");}",
      "expectedOutput": "2:á1:x",
      "hints": [
        "Bắt đầu từ bất biến và ca đầu vào không hợp lệ.",
        "Giữ một trường hợp biên trong assertion trước khi hoàn thiện lời giải."
      ],
      "quiz": {
        "question": "Test tính expected bằng đúng cùng hàm đang kiểm thử chứng minh được điều gì?",
        "options": [
          "Luôn chứng minh công thức đúng.",
          "Thay được mọi fixture thủ công.",
          "Rất ít về tính đúng nghiệp vụ; cần đáp án hoặc cách tính độc lập."
        ],
        "correct": 2,
        "explanation": "Hai phía cùng sai vẫn bằng nhau. Đáp án biết trước và implementation tham chiếu đơn giản giúp phát hiện lỗi chung."
      },
      "reference": {
        "label": "DataFusion: profiling",
        "url": "https://datafusion.apache.org/library-user-guide/profiling.html"
      }
    },
    {
      "id": "data-release-project",
      "moduleId": "track-data",
      "title": "Dự án: công bố báo cáo có phiên bản và phục hồi",
      "description": "Kết hợp kiểm tra dữ liệu, tổng hợp Polars, manifest và phát hiện writer cạnh tranh.",
      "duration": 55,
      "objectives": [
        "Kiểm tra revision trước khi đổi state.",
        "Payload lỗi không làm mất bản cũ.",
        "Không wrap revision."
      ],
      "sections": [
        {
          "title": "Người đọc chỉ thấy một bản hoàn chỉnh",
          "text": "Dự án nhận CSV đơn hàng, kiểm tra hợp đồng, tổng hợp doanh thu bằng Polars rồi ghi báo cáo vào thư mục release mới. Manifest chỉ trỏ đến release sau khi các tệp và metadata đã hoàn tất. Reader đọc manifest một lần và dùng release đó cho toàn bộ request; không đọc lại latest giữa các tệp. Nếu tiến trình chết trước bước đổi manifest, bản đang phục vụ vẫn hợp lệ. Dữ liệu staging còn lại là tài nguyên cần dọn theo chính sách, không phải lý do công bố một phiên bản thiếu tệp."
        },
        {
          "title": "Revision bảo vệ ý định của writer",
          "text": "Writer đọc revision hiện tại rồi gửi expected_revision khi publish. Nếu một writer khác đã công bố, thao tác phải báo conflict để người gọi xem lại đầu vào và kế hoạch. Chỉ dùng tên tệp latest rồi ghi đè sẽ làm người chạy sau xóa ý định của người trước. Lab dùng khóa tệp create_new để tuần tự hóa các writer hợp tác trên filesystem local, rồi so revision dưới khóa. Đây không phải giao thức khóa phân tán; triển khai object storage cần conditional write hoặc catalog có transaction phù hợp."
        },
        {
          "title": "Digest và tính bất biến",
          "text": "SHA-256 cùng phiên bản thuật toán xác định nội dung release; metadata bất biến của release ghi algorithm, digest và số hàng, không chứa revision công bố. Revision chỉ thuộc manifest đang trỏ tới release. Vì vậy A → B → A tạo ba lần công bố nhưng chỉ hai release nội dung: lần quay lại A tăng revision mà không sửa metadata cũ. Retry A khi A đã hiện hành giữ revision; expected_revision cũ vẫn bị từ chối. Nếu đổi logic tổng hợp phải bump algorithm trong digest. Digest kiểm tra nội dung, không chứng minh dữ liệu đúng nghiệp vụ."
        },
        {
          "title": "Kiểm thử các khoảng lỗi",
          "text": "Test trước commit, sau ghi report nhưng trước đổi manifest, retry cùng input và chuỗi A → B → A. Ca quay lại A phải thấy revision mới, report cũ đúng tổng và metadata bất biến không thay byte nào. Một batch có dòng sai phải trả lỗi trước khi manifest tiến lên. Writer với expected_revision cũ phải thất bại, kể cả output hợp lệ. Sau lỗi, reader vẫn mở được release trước. Khi đổi filesystem, xác minh semantics rename và độ bền sau mất điện; atomic visibility và durability là hai tính chất riêng."
        },
        {
          "title": "Sản phẩm để bàn giao",
          "text": "Bản mẫu chạy trên máy với dữ liệu fixture và có test tự động cho commit, conflict, retry và đầu vào sai. Người học mở rộng thành incremental pipeline, thêm source offset và kiểm thử restart. Nộp manifest, query plan, báo cáo chất lượng, lệnh tái lập và hướng dẫn rollback về một release bất biến. Chỉ đánh dấu hoàn thành khi một người khác chạy được và giải thích được vì sao không đọc bản nửa chừng. Các bài trong chương cung cấp toàn bộ khái niệm cần để làm dự án; tài liệu ngoài chỉ thuộc hồ sơ biên soạn."
        }
      ],
      "tip": "",
      "exercise": {
        "title": "Commit có revision và không đổi trạng thái khi lỗi",
        "instructions": "Viết publish(state,expected,payload_valid). Chỉ tăng revision khi expected khớp và payload hợp lệ; dùng checked_add.",
        "requirements": [
          "Kiểm tra revision trước khi đổi state.",
          "Payload lỗi không làm mất bản cũ.",
          "Không wrap revision."
        ]
      },
      "starterCode": "// Commit có revision và không đổi trạng thái khi lỗi\n// Kiểm tra revision trước khi đổi state.\n// Payload lỗi không làm mất bản cũ.\n// Không wrap revision.\nfn main() {\n    // Triển khai hàm theo đề và thêm assertion cho các ca biên.\n    todo!();\n}\n",
      "solutionCode": "#[derive(Debug,Clone,PartialEq,Eq)]struct Publication{revision:u64,release:String}\nfn publish(p:&mut Publication,expected:u64,release:&str,valid:bool)->Result<(),&'static str>{\n if p.revision!=expected{return Err(\"conflict\");}if !valid{return Err(\"invalid\");}\n let next=p.revision.checked_add(1).ok_or(\"overflow\")?;\n *p=Publication{revision:next,release:release.to_owned()};Ok(())\n}\nfn main(){let mut p=Publication{revision:3,release:\"a\".into()};let old=p.clone();assert_eq!(publish(&mut p,2,\"b\",true),Err(\"conflict\"));assert_eq!(publish(&mut p,3,\"b\",false),Err(\"invalid\"));assert_eq!(p,old);publish(&mut p,3,\"b\",true).unwrap();assert_eq!(p.revision,4);println!(\"revision=4 release=b\");}",
      "expectedOutput": "revision=4 release=b",
      "hints": [
        "Bắt đầu từ bất biến và ca đầu vào không hợp lệ.",
        "Giữ một trường hợp biên trong assertion trước khi hoàn thiện lời giải."
      ],
      "quiz": {
        "question": "Ghi xong report mới nhưng chưa đổi manifest thì tiến trình chết. Reader nên thấy gì?",
        "options": [
          "Release cũ hoàn chỉnh.",
          "Tự đoán report mới nhất theo mtime.",
          "Ghép tệp từ cả release cũ và mới."
        ],
        "correct": 0,
        "explanation": "Manifest là điểm công bố. Reader chỉ dùng release được manifest chọn; staging chưa commit không được coi là dữ liệu đang phục vụ."
      },
      "reference": {
        "label": "Iceberg: atomic metadata commit",
        "url": "https://iceberg.apache.org/docs/latest/reliability/"
      },
      "localLab": {
        "title": "Pipeline Polars công bố dataset có revision",
        "instructions": "Bản mẫu dùng CSV, Polars và filesystem local trên macOS/Linux. Chạy test rồi publish vào thư mục demo-output mới. Khóa writer chỉ phối hợp các tiến trình dùng cùng giao thức; khi chuyển sang object storage phải thay bằng conditional commit của kho đích. File nguồn được giữ nguyên.",
        "files": [
          {
            "path": "Cargo.toml",
            "content": "[package]\nname=\"dataset-release\"\nversion=\"0.1.0\"\nedition=\"2024\"\n[dependencies]\ncsv=\"=1.4.0\"\npolars={version=\"=0.55.2\",default-features=false,features=[\"lazy\"]}\nserde={version=\"1\",features=[\"derive\"]}\nserde_json=\"1\"\nsha2=\"0.10\"\n[profile.dev]\ndebug=0\n[profile.test]\ndebug=0\n"
          },
          {
            "path": "src/lib.rs",
            "content": "pub mod quality;\nuse std::{fs::{self,File,OpenOptions},io::Write,path::{Path,PathBuf}};\nuse polars::prelude::*;\nuse serde::{Serialize,Deserialize};\nuse sha2::{Digest,Sha256};\n#[derive(Debug,Clone,Serialize,Deserialize,PartialEq,Eq)]\npub struct Manifest{pub revision:u64,pub release:String,pub rows:usize,pub source_sha256:String}\n// Content metadata is immutable; publication revision belongs only to the root pointer.\n#[derive(Debug,Clone,Serialize,Deserialize,PartialEq,Eq)]\npub struct ReleaseMetadata{pub algorithm:String,pub release:String,pub rows:usize,pub source_sha256:String}\nconst ALGORITHM:&str=\"orders-v1\";\nstruct Lock(PathBuf);\nimpl Drop for Lock{fn drop(&mut self){let _=fs::remove_file(&self.0);}}\nfn error(e:impl std::fmt::Display)->String{e.to_string()}\nfn write_once(path:&Path,bytes:&[u8])->Result<(),String>{\n match OpenOptions::new().write(true).create_new(true).open(path){\n  Ok(mut f)=>{f.write_all(bytes).map_err(error)?;f.sync_all().map_err(error)},\n  Err(e) if e.kind()==std::io::ErrorKind::AlreadyExists=>{\n   if fs::read(path).map_err(error)?==bytes{Ok(())}else{Err(\"immutable_release_conflict\".into())}\n  },Err(e)=>Err(error(e))\n }\n}\npub fn read_manifest(root:&Path)->Result<Option<Manifest>,String>{\n let bytes=match fs::read(root.join(\"manifest.json\")){Ok(b)=>b,Err(e) if e.kind()==std::io::ErrorKind::NotFound=>return Ok(None),Err(e)=>return Err(error(e))};\n let m:Manifest=serde_json::from_slice(&bytes).map_err(error)?;\n if m.revision==0 || m.release.len()!=64 || !m.release.bytes().all(|c|c.is_ascii_hexdigit()){return Err(\"invalid_manifest\".into());}Ok(Some(m))\n}\npub fn publish(root:&Path,input:&[u8],expected:u64)->Result<Manifest,String>{\n fs::create_dir_all(root).map_err(error)?;\n let lock_path=root.join(\".publish.lock\");\n OpenOptions::new().write(true).create_new(true).open(&lock_path).map_err(|_|\"writer_lock\".to_string())?;\n let _lock=Lock(lock_path);\n let current=read_manifest(root)?;\n let revision=current.as_ref().map_or(0,|m|m.revision);\n if revision!=expected{return Err(\"revision_conflict\".into());}\n let source_sha256=format!(\"{:x}\",Sha256::digest(input));\n let mut digest=Sha256::new();digest.update(ALGORITHM.as_bytes());digest.update(b\":\");digest.update(input);\n let release=format!(\"{:x}\",digest.finalize());\n if let Some(m)=current.as_ref(){if m.release==release{return Ok(m.clone());}}\n let audit=quality::audit(input)?;\n if !audit.rejects.is_empty(){return Err(\"quality_rejected\".into());}\n let frame=df![\n  \"region\"=>audit.rows.iter().map(|r|r.region.clone()).collect::<Vec<_>>(),\n  \"amount\"=>audit.rows.iter().map(|r|r.amount_minor).collect::<Vec<_>>()\n ].map_err(error)?;\n let grouped=frame.lazy().group_by([col(\"region\")]).agg([col(\"amount\").sum().alias(\"total\")]).sort_by_exprs([col(\"region\")],Default::default()).collect().map_err(error)?;\n let regions=grouped.column(\"region\").map_err(error)?.str().map_err(error)?;\n let totals=grouped.column(\"total\").map_err(error)?.i64().map_err(error)?;\n let mut report=String::from(\"region,total_minor\\n\");\n for i in 0..grouped.height(){report.push_str(&format!(\"{},{}\\n\",regions.get(i).ok_or(\"region_null\")?,totals.get(i).ok_or(\"sum_null\")?));}\n let next=Manifest{revision:revision.checked_add(1).ok_or(\"revision_overflow\")?,release,rows:audit.rows.len(),source_sha256};\n let release_dir=root.join(\"releases\").join(&next.release);fs::create_dir_all(&release_dir).map_err(error)?;\n write_once(&release_dir.join(\"report.csv\"),report.as_bytes())?;\n let metadata=ReleaseMetadata{algorithm:ALGORITHM.into(),release:next.release.clone(),rows:next.rows,source_sha256:next.source_sha256.clone()};\n let content_bytes=serde_json::to_vec_pretty(&metadata).map_err(error)?;\n write_once(&release_dir.join(\"metadata.json\"),&content_bytes)?;\n // Selecting old content is a new commit, but never changes immutable content metadata.\n let bytes=serde_json::to_vec_pretty(&next).map_err(error)?;\n let staged=root.join(format!(\".manifest-{}-{}.tmp\",next.revision,next.release));\n write_once(&staged,&bytes)?;\n fs::rename(&staged,root.join(\"manifest.json\")).map_err(error)?;\n #[cfg(unix)] File::open(root).and_then(|f|f.sync_all()).map_err(error)?;\n Ok(next)\n}\npub fn current_report(root:&Path)->Result<String,String>{\n let manifest=read_manifest(root)?.ok_or(\"not_published\")?;\n fs::read_to_string(root.join(\"releases\").join(manifest.release).join(\"report.csv\")).map_err(error)\n}\n"
          },
          {
            "path": "src/quality.rs",
            "content": "use std::{collections::{BTreeMap, HashSet}, io::Read};\n\npub const MAX_BYTES: u64 = 16 * 1024 * 1024;\npub const MAX_ROWS: usize = 100_000;\n#[derive(Debug, Clone)] pub struct Row { pub order_id: String, pub region: String, pub amount_minor: i64 }\n#[derive(Debug, PartialEq, Eq)] pub struct Reject { pub record: usize, pub reason: &'static str }\n#[derive(Debug)] pub struct Audit { pub rows: Vec<Row>, pub rejects: Vec<Reject>, pub total: i64, pub regions: BTreeMap<String, i64> }\n\npub fn audit(reader: impl Read) -> Result<Audit, String> {\n    let mut bytes = Vec::new();\n    reader.take(MAX_BYTES + 1).read_to_end(&mut bytes).map_err(|e| e.to_string())?;\n    if bytes.len() as u64 > MAX_BYTES { return Err(\"file_too_large\".into()); }\n    let mut csv = csv::Reader::from_reader(bytes.as_slice());\n    if !csv.headers().map_err(|e| e.to_string())?.iter().eq([\"order_id\", \"region\", \"amount_minor\"]) {\n        return Err(\"schema\".into());\n    }\n    let mut out = Audit { rows: vec![], rejects: vec![], total: 0, regions: BTreeMap::new() };\n    let mut seen = HashSet::new();\n    for (index, record) in csv.records().enumerate() {\n        if index >= MAX_ROWS { return Err(\"too_many_rows\".into()); }\n        let record = record.map_err(|e| format!(\"csv_structure: {e}\"))?;\n        let id = record[0].trim();\n        let region = record[1].trim();\n        let raw_amount = record[2].trim();\n        let amount = (!raw_amount.is_empty() && raw_amount.bytes().all(|b| b.is_ascii_digit()))\n            .then(|| raw_amount.parse::<i64>().ok()).flatten();\n        let reason = if id.is_empty() || id.len() > 64 { Some(\"id\") }\n            else if ![\"bac\", \"nam\"].contains(&region) { Some(\"region\") }\n            else if amount.is_none() { Some(\"amount\") }\n            else if seen.contains(id) { Some(\"duplicate\") } else { None };\n        if let Some(reason) = reason { out.rejects.push(Reject { record: index + 2, reason }); continue; }\n        let amount = amount.expect(\"checked above\");\n        let total = out.total.checked_add(amount).ok_or(\"total_overflow\")?;\n        let regional = out.regions.get(region).copied().unwrap_or(0).checked_add(amount).ok_or(\"region_overflow\")?;\n        seen.insert(id.to_owned());\n        out.total = total;\n        out.regions.insert(region.to_owned(), regional);\n        out.rows.push(Row { order_id: id.to_owned(), region: region.to_owned(), amount_minor: amount });\n    }\n    Ok(out)\n}\n"
          },
          {
            "path": "src/main.rs",
            "content": "use std::{fs,io::Read,path::Path,process};\nfn run()->Result<(),String>{\n let args:Vec<_>=std::env::args().collect();if args.len()!=4{return Err(\"usage: dataset-release <input.csv> <output-dir> <expected-revision>\".into());}\n let mut bytes=vec![];fs::File::open(&args[1]).map_err(|e|e.to_string())?.take(dataset_release::quality::MAX_BYTES+1).read_to_end(&mut bytes).map_err(|e|e.to_string())?;\n let expected=args[3].parse::<u64>().map_err(|_|\"revision\")?;\n let m=dataset_release::publish(Path::new(&args[2]),&bytes,expected)?;\n println!(\"revision={} rows={} release={}\",m.revision,m.rows,m.release);Ok(())\n}\nfn main(){if let Err(e)=run(){eprintln!(\"{e}\");process::exit(1);}}\n"
          },
          {
            "path": "tests/publication.rs",
            "content": "use dataset_release::{publish,read_manifest,current_report};\nuse std::{fs,path::PathBuf,sync::atomic::{AtomicUsize,Ordering}};\nstatic SEQ:AtomicUsize=AtomicUsize::new(0);\nstruct Temp(PathBuf);impl Temp{fn new()->Self{let p=std::env::temp_dir().join(format!(\"learn-rust-data-release-{}-{}\",std::process::id(),SEQ.fetch_add(1,Ordering::Relaxed)));fs::create_dir(&p).unwrap();Self(p)}}\nimpl Drop for Temp{fn drop(&mut self){let _=fs::remove_dir_all(&self.0);}}\nconst GOOD:&[u8]=b\"order_id,region,amount_minor\\na,bac,120\\nb,nam,80\\nc,bac,30\\n\";\n#[test]fn publishes_real_polars_report_and_retries_without_increment(){\n let t=Temp::new();let a=publish(&t.0,GOOD,0).unwrap();assert_eq!(a.revision,1);assert_eq!(a.rows,3);\n assert_eq!(current_report(&t.0).unwrap(),\"region,total_minor\\nbac,150\\nnam,80\\n\");\n assert_eq!(publish(&t.0,GOOD,1).unwrap(),a);\n}\n#[test]fn conflict_and_quality_error_preserve_previous_release(){\n let t=Temp::new();let first=publish(&t.0,GOOD,0).unwrap();\n assert_eq!(publish(&t.0,GOOD,0).unwrap_err(),\"revision_conflict\");\n assert_eq!(publish(&t.0,b\"order_id,region,amount_minor\\nx,bac,-1\\n\",1).unwrap_err(),\"quality_rejected\");\n assert_eq!(read_manifest(&t.0).unwrap().unwrap(),first);\n assert!(current_report(&t.0).unwrap().contains(\"bac,150\"));\n}\n#[test]fn changed_input_advances_and_old_report_remains(){\n let t=Temp::new();let first=publish(&t.0,GOOD,0).unwrap();\n let next=publish(&t.0,b\"order_id,region,amount_minor\\nn,nam,9\\n\",1).unwrap();\n assert_eq!(next.revision,2);assert_ne!(first.release,next.release);\n assert!(t.0.join(\"releases\").join(first.release).join(\"report.csv\").exists());\n assert_eq!(current_report(&t.0).unwrap(),\"region,total_minor\\nnam,9\\n\");\n}\n#[test]fn active_writer_lock_is_not_bypassed(){\n let t=Temp::new();fs::write(t.0.join(\".publish.lock\"),b\"test fixture\").unwrap();\n assert_eq!(publish(&t.0,GOOD,0).unwrap_err(),\"writer_lock\");\n assert!(read_manifest(&t.0).unwrap().is_none());\n}\n\n#[test]fn returning_to_old_content_creates_a_new_revision_without_mutating_the_release(){\n let t=Temp::new();\n let a1=publish(&t.0,GOOD,0).unwrap();\n let a_dir=t.0.join(\"releases\").join(&a1.release);\n let original_metadata=fs::read(a_dir.join(\"metadata.json\")).unwrap();\n let original_report=fs::read(a_dir.join(\"report.csv\")).unwrap();\n let metadata:dataset_release::ReleaseMetadata=serde_json::from_slice(&original_metadata).unwrap();\n assert_eq!(metadata.release,a1.release);assert_eq!(metadata.algorithm,\"orders-v1\");\n let as_json:serde_json::Value=serde_json::from_slice(&original_metadata).unwrap();\n assert!(as_json.get(\"revision\").is_none());\n let b=publish(&t.0,b\"order_id,region,amount_minor\\nn,nam,9\\n\",1).unwrap();\n assert_eq!(b.revision,2);assert_ne!(b.release,a1.release);\n let a3=publish(&t.0,GOOD,2).unwrap();\n assert_eq!(a3.revision,3);assert_eq!(a3.release,a1.release);\n assert_eq!(read_manifest(&t.0).unwrap(),Some(a3.clone()));\n assert_eq!(fs::read(a_dir.join(\"metadata.json\")).unwrap(),original_metadata);\n assert_eq!(fs::read(a_dir.join(\"report.csv\")).unwrap(),original_report);\n assert_eq!(fs::read_dir(t.0.join(\"releases\")).unwrap().count(),2);\n assert_eq!(current_report(&t.0).unwrap(),\"region,total_minor\\nbac,150\\nnam,80\\n\");\n assert_eq!(publish(&t.0,GOOD,2).unwrap_err(),\"revision_conflict\");\n assert_eq!(publish(&t.0,GOOD,3).unwrap(),a3);\n}\n"
          },
          {
            "path": "fixtures/orders.csv",
            "content": "order_id,region,amount_minor\na,bac,120\nb,nam,80\nc,bac,30\n"
          },
          {
            "path": "README.md",
            "content": "# Dataset release\n\ncargo test --all-targets\ncargo run -- fixtures/orders.csv demo-output 0\ncargo run -- fixtures/orders.csv demo-output 1\n\nLần đầu revision=1; retry cùng input với expected=1 giữ revision=1. Thay input B rồi publish expected=1 tạo revision=2; đưa lại input A và publish expected=2 tạo revision=3, tái sử dụng release A bất biến. Dùng thư mục output riêng cho bài thực hành. report.csv được tổng hợp bằng Polars; manifest là điểm công bố.\n\nThiết kế: schema/orders-v1 tham gia SHA-256. Mỗi release có report.csv và metadata.json bất biến; metadata chứa algorithm, digest và rows, không chứa revision. Revision chỉ thuộc manifest.json ở thư mục gốc, vì cùng nội dung có thể được chọn lại ở nhiều lần commit. Regression test A → B → A xác nhận ba revision chỉ dùng hai thư mục release và không đổi metadata/report A. Writer tạo khóa bằng create_new, kiểm tra revision dưới khóa, ghi/sync dữ liệu rồi rename manifest trên cùng filesystem. Reader chụp một manifest. Ví dụ này nhắm macOS/Linux; cần kiểm chứng semantics filesystem và durability môi trường đích. Không dùng khóa local như khóa phân tán.\n\nNếu tiến trình bị kill để lại .publish.lock, người vận hành xác minh không còn writer rồi xử lý khóa theo runbook; chương trình không tự xóa khóa lạ. Nếu chết trước commit, reader vẫn thấy bản trước. Các release chưa trỏ tới có thể được kiểm tra/dọn theo retention, không ghi đè release đã công bố.\n\nBài mở rộng: thêm source offset, kiểm thử failpoint trước rename, reader chạy song song với writer, đối chiếu Polars/DataFusion, benchmark với dữ liệu lệch. Thay đổi thuật toán phải tăng tên version orders-v1 trong digest. Không tuyên bố đây là triển khai Iceberg hoặc transaction xuyên nguồn/đích.\n"
          }
        ],
        "commands": [
          "cargo test --all-targets",
          "cargo run -- fixtures/orders.csv demo-output 0",
          "cargo run -- fixtures/orders.csv demo-output 1"
        ],
        "checks": [
          "Báo cáo thật qua Polars có bac=150, nam=80.",
          "Retry cùng input không tăng revision; stale writer và input sai giữ nguyên bản cũ.",
          "Release trước còn đọc được sau khi publish bản mới; writer đang giữ khóa không bị vượt qua.",
          "A → B → A tạo revision 1, 2, 3, chỉ có hai release; metadata/report A không đổi và retry ở revision 3 vẫn giữ nguyên."
        ]
      },
      "simulation": {
        "title": "Công bố một snapshot",
        "description": "Theo dõi revision và điểm mà reader được phép nhìn thấy báo cáo mới.",
        "kind": "sequence",
        "nodes": [
          {
            "id": "writer",
            "label": "Writer",
            "detail": "Giữ expected revision"
          },
          {
            "id": "staging",
            "label": "Release mới",
            "detail": "Report và metadata bất biến"
          },
          {
            "id": "pointer",
            "label": "Manifest",
            "detail": "Điểm công bố"
          },
          {
            "id": "reader",
            "label": "Reader",
            "detail": "Đọc một snapshot"
          }
        ],
        "scenarios": [
          {
            "id": "success",
            "label": "Publish thành công",
            "steps": [
              {
                "title": "Đọc revision",
                "description": "Writer bắt đầu từ revision 7.",
                "activeNodeIds": [
                  "writer"
                ],
                "values": [
                  {
                    "label": "Expected",
                    "value": "7"
                  }
                ]
              },
              {
                "title": "Ghi release",
                "description": "Dữ liệu được ghi và kiểm tra; reader vẫn dùng bản cũ.",
                "activeNodeIds": [
                  "staging",
                  "reader"
                ],
                "values": [
                  {
                    "label": "Reader",
                    "value": "release A"
                  }
                ]
              },
              {
                "title": "Commit",
                "description": "Revision vẫn là 7 dưới khóa nên manifest được chuyển sang B.",
                "activeNodeIds": [
                  "pointer"
                ],
                "values": [
                  {
                    "label": "Revision",
                    "value": "8"
                  }
                ]
              },
              {
                "title": "Request mới",
                "description": "Reader mới lấy manifest B; request cũ có thể tiếp tục dùng A.",
                "activeNodeIds": [
                  "reader"
                ],
                "values": [
                  {
                    "label": "Snapshot mới",
                    "value": "release B"
                  }
                ]
              }
            ]
          },
          {
            "id": "conflict",
            "label": "Writer khác đã publish",
            "steps": [
              {
                "title": "Cùng bắt đầu",
                "description": "Hai writer cùng xem revision 7.",
                "activeNodeIds": [
                  "writer"
                ],
                "values": [
                  {
                    "label": "Expected",
                    "value": "7"
                  }
                ]
              },
              {
                "title": "Writer A thắng",
                "description": "A công bố revision 8 trước B.",
                "activeNodeIds": [
                  "pointer"
                ],
                "values": [
                  {
                    "label": "Current",
                    "value": "8"
                  }
                ]
              },
              {
                "title": "B bị từ chối",
                "description": "Expected revision 7 không còn khớp; B không đổi manifest.",
                "activeNodeIds": [
                  "writer"
                ],
                "values": [
                  {
                    "label": "Kết quả",
                    "value": "revision_conflict"
                  }
                ]
              },
              {
                "title": "Reader nhất quán",
                "description": "Reader dùng bản do A đã công bố; B cần xem lại ý định.",
                "activeNodeIds": [
                  "reader"
                ],
                "values": [
                  {
                    "label": "Revision giữ nguyên",
                    "value": "8"
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
      "id": "data-project-quality",
      "title": "Cổng chất lượng đơn hàng",
      "description": "Công cụ CLI tiếp nhận CSV, kiểm tra hợp đồng và cung cấp reject đủ thông tin để sửa nguồn.",
      "level": "guided",
      "estimatedHours": 8,
      "labLessonId": "data-quality-project",
      "requirements": [
        "Hợp đồng ba cột có đơn vị và giới hạn rõ.",
        "Phân biệt lỗi toàn tệp và reject dòng.",
        "Dedup theo bản hợp lệ đầu tiên.",
        "Tổng tiền kiểm tra overflow.",
        "Thêm chính sách tỷ lệ reject bằng test."
      ],
      "milestones": [
        {
          "title": "Định nghĩa fixture",
          "tasks": [
            "Viết schema và quy tắc ID/region/amount.",
            "Tính tay kết quả cho ít nhất 10 dòng gồm các ca lỗi."
          ],
          "acceptance": "Có bảng input, decision và reason cho từng record."
        },
        {
          "title": "Triển khai thư viện và CLI",
          "tasks": [
            "Chạy thư viện nhận Read với tệp và byte slice.",
            "Giữ stdout báo cáo, stderr lỗi và mã thoát rõ."
          ],
          "acceptance": "Một người khác chạy command fixture nhận cùng số đếm."
        },
        {
          "title": "Mở rộng có kiểm thử",
          "tasks": [
            "Thêm reject CSV và ngưỡng chấp nhận batch.",
            "Đặt kiểm thử cho đúng biên ngưỡng và format quote."
          ],
          "acceptance": "Không mất record; input=accepted+rejected ở batch hoàn tất."
        }
      ],
      "testCases": [
        {
          "name": "ID trùng",
          "setup": "Hai dòng hợp lệ cùng ID.",
          "expected": "Chỉ dòng đầu được nhận."
        },
        {
          "name": "Dòng sai rồi đúng",
          "setup": "ID A tiền âm, sau đó A tiền hợp lệ.",
          "expected": "Dòng đúng được nhận."
        },
        {
          "name": "CSV quoting",
          "setup": "ID chứa dấu phẩy được quote.",
          "expected": "Parser giữ một trường ID."
        },
        {
          "name": "Overflow",
          "setup": "i64::MAX rồi thêm 1.",
          "expected": "Batch lỗi; không báo tổng wrap."
        },
        {
          "name": "Ngưỡng reject",
          "setup": "Tỷ lệ đúng ngưỡng và vượt một record.",
          "expected": "Quyết định đúng hợp đồng."
        }
      ],
      "rubric": [
        {
          "id": "quality-contract",
          "title": "Hợp đồng dữ liệu",
          "criteria": [
            "Đơn vị/null/khóa/giới hạn được ghi rõ.",
            "Fixture bao phủ từng quy tắc."
          ],
          "critical": true
        },
        {
          "id": "quality-counts",
          "title": "Tính đúng của báo cáo",
          "criteria": [
            "Số lượng và tổng được đối chiếu bằng tay.",
            "Không chiếm ID từ dòng lỗi."
          ],
          "critical": true
        },
        {
          "id": "quality-tests",
          "title": "Kiểm thử độc lập",
          "criteria": [
            "Có test lỗi cấu trúc, quote và overflow.",
            "Expected không tính lại bằng hàm đang test."
          ],
          "critical": true
        },
        {
          "id": "quality-operations",
          "title": "Khả năng bàn giao",
          "criteria": [
            "CLI có mã thoát và README.",
            "Reject giữ số record/mã nguyên nhân."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Cargo source và tests.",
        "CSV fixture cùng bảng expected.",
        "Báo cáo accepted/rejected và reject CSV.",
        "README và ghi chú giới hạn dedup trong một batch."
      ]
    },
    {
      "id": "data-project-engine",
      "title": "Engine báo cáo phân vùng",
      "description": "Nhúng DataFusion để xử lý Arrow batches và triển khai nguồn CSV/Parquet có hợp đồng.",
      "level": "independent",
      "estimatedHours": 14,
      "labLessonId": "data-query-project",
      "requirements": [
        "Đăng ký Arrow schema tường minh.",
        "Báo cáo giữ sum/known/rows khác nhau.",
        "Đối chiếu một và nhiều partition.",
        "Thêm reader tệp và query cố định.",
        "Ghi EXPLAIN và benchmark có cấu hình.",
        "Kiểm uniqueness/missing dimension trước tổng hợp; chứng minh raw join trùng khóa làm sai cardinality.",
        "Cửa sổ event-time có chính sách arrival/watermark và fixture late/boundary, đối chiếu tham chiếu độc lập."
      ],
      "milestones": [
        {
          "title": "Engine trên fixture",
          "tasks": [
            "Chạy MemTable và query SQL mẫu.",
            "Đọc null bitmap và dtype đầu ra."
          ],
          "acceptance": "Nhóm zero/toàn-null/tập rỗng có kết quả đúng."
        },
        {
          "title": "Join và thời gian có hợp đồng",
          "tasks": [
            "Chạy test raw join trùng dimension rồi kiểm đường API từ chối.",
            "Đối chiếu cửa sổ 1.000 ms với BTreeMap theo arrival order; cách ly late-event và giữ trường hợp bằng watermark."
          ],
          "acceptance": "SUM không bị nhân đôi hoặc mất fact; fixture 999/1000 và event500 đến sau watermark cho kết quả xác định, số late tách riêng."
        },
        {
          "title": "Nguồn tệp",
          "tasks": [
            "Thêm reader CSV có schema hoặc Parquet đã chuẩn hóa.",
            "Giữ validation ở ranh giới nguồn."
          ],
          "acceptance": "Kết quả từ tệp khớp fixture Arrow."
        },
        {
          "title": "Plan và tài nguyên",
          "tasks": [
            "Lưu plan trước/sau projection.",
            "Đo nhiều lần với số partition khác nhau."
          ],
          "acceptance": "Kết quả không đổi, báo cáo ghi input và peak memory."
        },
        {
          "title": "API có ranh giới",
          "tasks": [
            "Thiết kế interface truy vấn chỉ nhận bộ lọc được hỗ trợ.",
            "Thêm giới hạn hàng trả về và lỗi sai cột."
          ],
          "acceptance": "Input sai trả Result; không mở truy vấn tùy ý không kiểm soát."
        }
      ],
      "testCases": [
        {
          "name": "Phân vùng",
          "setup": "Chia cùng dữ liệu thành 1/2/4 partition.",
          "expected": "Kết quả sắp xếp giống nhau."
        },
        {
          "name": "Toàn null",
          "setup": "Một vùng có ba amount null.",
          "expected": "sum null, known0, rows3."
        },
        {
          "name": "Sai schema",
          "setup": "Array lệch độ dài hoặc thiếu cột.",
          "expected": "Bị từ chối ở ranh giới."
        },
        {
          "name": "Kế hoạch",
          "setup": "EXPLAIN query có filter.",
          "expected": "Giải thích đúng vị trí filter/scan."
        },
        {
          "name": "Skew",
          "setup": "Một khóa chiếm 90% input.",
          "expected": "Báo cáo tài nguyên theo workload lệch."
        },
        {
          "name": "Khóa dimension trùng hoặc thiếu",
          "setup": "Dimension có hai khóa bac, rồi bảng thiếu nam.",
          "expected": "Raw SQL phơi bày SUM 400 thay vì 200; API từ chối trước khi công bố báo cáo sai."
        },
        {
          "name": "Cửa sổ và late-event",
          "setup": "Arrival có time0/999/1000/2000 rồi500/1000/1999, allowed lateness1000 ms.",
          "expected": "late=1; cửa sổ0 total12/count2,1000 total47/count3,2000 total13/count1; khớp BTreeMap."
        }
      ],
      "rubric": [
        {
          "id": "engine-semantics",
          "title": "Ngữ nghĩa truy vấn",
          "criteria": [
            "Null, cardinality và thứ tự được kiểm tra.",
            "Không đổi filter/LIMIT tùy ý.",
            "Có test join trùng/thiếu dimension, biên cửa sổ và late-event trên DataFusion thật."
          ],
          "critical": true
        },
        {
          "id": "engine-reference",
          "title": "Đối chiếu độc lập",
          "criteria": [
            "Có expected tính tay hoặc BTreeMap tham chiếu.",
            "Kết quả không phụ thuộc partition.",
            "BTreeMap tham chiếu cùng chính sách arrival/watermark; sum/count giữ trọng số khi gộp."
          ],
          "critical": true
        },
        {
          "id": "engine-boundary",
          "title": "Ranh giới engine",
          "criteria": [
            "Schema/limit/error được xử lý.",
            "Nêu rõ nguồn được phép đăng ký."
          ],
          "critical": true
        },
        {
          "id": "engine-evidence",
          "title": "Hiệu năng có bằng chứng",
          "criteria": [
            "Lưu plan, lệnh chạy và cấu hình.",
            "Không lấy thời gian debug test làm benchmark."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Thư viện DataFusion và reader.",
        "Test Arrow/CSV/Parquet theo phạm vi triển khai.",
        "Query plan kèm giải thích.",
        "Báo cáo benchmark và README.",
        "Fixture và báo cáo cardinality join, watermark, late-event và ranh giới cửa sổ."
      ]
    },
    {
      "id": "data-project-release",
      "title": "Pipeline dataset có phiên bản",
      "description": "Công bố báo cáo Polars qua manifest bất biến, kiểm soát writer và diễn tập phục hồi.",
      "level": "capstone",
      "estimatedHours": 24,
      "labLessonId": "data-release-project",
      "requirements": [
        "Kiểm tra input trước khi publish.",
        "Tổng hợp bằng Polars và đối chiếu DataFusion.",
        "Manifest ghi revision/schema/source digest.",
        "Retry không nhân đôi; stale revision bị từ chối.",
        "Reader không đọc release chưa commit.",
        "Bổ sung failpoint và runbook."
      ],
      "milestones": [
        {
          "title": "Pipeline đúng",
          "tasks": [
            "Chạy cổng chất lượng và tổng hợp Polars.",
            "Đối chiếu trên fixture có lỗi, rỗng và dữ liệu lệch."
          ],
          "acceptance": "Bad input không tạo bản xuất bản mới."
        },
        {
          "title": "Snapshot bất biến",
          "tasks": [
            "Ghi report/metadata trong release riêng.",
            "Đổi manifest sau khi tệp hoàn chỉnh."
          ],
          "acceptance": "Reader chụp manifest một lần và chỉ đọc release đó."
        },
        {
          "title": "Cạnh tranh và recovery",
          "tasks": [
            "Giữ khóa writer local và kiểm tra revision.",
            "Thêm failpoint trước commit và retry."
          ],
          "acceptance": "Writer cũ báo conflict; reader vẫn đọc được bản trước khi lỗi."
        },
        {
          "title": "Bàn giao vận hành",
          "tasks": [
            "Viết quy trình rollback/khóa sót/retention.",
            "Ghi benchmark và điều kiện filesystem đích."
          ],
          "acceptance": "Người khác chạy từ checkout sạch và tái hiện kịch bản lỗi."
        }
      ],
      "testCases": [
        {
          "name": "Retry",
          "setup": "Publish cùng input với revision hiện tại.",
          "expected": "Không tăng revision."
        },
        {
          "name": "Stale writer",
          "setup": "Expected revision thấp hơn hiện tại.",
          "expected": "Conflict và giữ manifest cũ."
        },
        {
          "name": "Quality failure",
          "setup": "Input có tiền âm/ID trùng.",
          "expected": "Không publish."
        },
        {
          "name": "Crash trước commit",
          "setup": "Dừng tại failpoint sau ghi report.",
          "expected": "Reader vẫn thấy release trước."
        },
        {
          "name": "Đổi thuật toán",
          "setup": "Bump query/schema version với cùng input.",
          "expected": "Release ID phản ánh phiên bản thuật toán mới."
        }
      ],
      "rubric": [
        {
          "id": "release-correctness",
          "title": "Kết quả phân tích",
          "criteria": [
            "Polars và reference/DataFusion khớp fixture.",
            "Số tiền không overflow."
          ],
          "critical": true
        },
        {
          "id": "release-atomicity",
          "title": "Tính nhất quán công bố",
          "criteria": [
            "Manifest là điểm commit.",
            "Không đọc tệp staging hoặc ghép phiên bản."
          ],
          "critical": true
        },
        {
          "id": "release-recovery",
          "title": "Phục hồi và idempotency",
          "criteria": [
            "Có kiểm thử stale revision/retry/failpoint.",
            "Không tự xóa khóa đang dùng."
          ],
          "critical": true
        },
        {
          "id": "release-observability",
          "title": "Quan sát và bàn giao",
          "criteria": [
            "Runbook rõ giới hạn khóa local.",
            "Có manifest, plan và benchmark tái lập."
          ],
          "critical": false
        }
      ],
      "deliverables": [
        "Workspace và Cargo.lock.",
        "Fixture, test tích hợp và failpoint.",
        "Các manifest/report mẫu bất biến.",
        "Runbook publish/retry/rollback/retention.",
        "Báo cáo hiệu năng và đánh giá giới hạn."
      ]
    }
  ],
  "assessment": {
    "title": "Đánh giá năng lực xây pipeline dữ liệu",
    "instructions": "Trả lời tình huống, chạy ba dự án và tự nghiệm thu từng tiêu chí bằng fixture, test, plan hoặc báo cáo. Điểm trắc nghiệm không thay thế bằng chứng dự án.",
    "passPercent": 80,
    "questions": [
      {
        "id": "data-exam-01",
        "question": "Một CSV có header đúng nhưng một record thiếu cột cuối. Chọn cách phân loại trước khi công bố batch.",
        "options": [
          "Tự coi số tiền thiếu là zero.",
          "Xử lý lỗi cấu trúc theo hợp đồng toàn batch, không xuất báo cáo nửa chừng.",
          "Bỏ record mà không tăng reject."
        ],
        "correct": 1,
        "explanation": "Lỗi cấu trúc khác lỗi giá trị và cần trạng thái batch rõ; không mất record âm thầm.",
        "lessonIds": [
          "data-ingestion",
          "data-quality-project"
        ]
      },
      {
        "id": "data-exam-02",
        "question": "Cùng ID xuất hiện: record đầu có tiền âm, record sau hợp lệ. Với hợp đồng nhận bản hợp lệ đầu tiên, HashSet nên cập nhật lúc nào?",
        "options": [
          "Ngay khi đọc ID.",
          "Sau khi kết thúc cả tháng.",
          "Sau khi mọi validation của record thành công."
        ],
        "correct": 2,
        "explanation": "Dedup dựa trên bản đã nhận; cập nhật trước validation làm mất record đúng.",
        "lessonIds": [
          "data-quality-project"
        ]
      },
      {
        "id": "data-exam-03",
        "question": "Reader mới thêm cột bắt buộc tax_rate nhưng tệp cũ không có. Chọn kế hoạch phù hợp.",
        "options": [
          "Version schema và định nghĩa chuyển đổi có ngữ nghĩa, hoặc từ chối phiên bản chưa hỗ trợ.",
          "Fill0 mà không thông báo.",
          "Dựa vào vị trí cột cuối."
        ],
        "correct": 0,
        "explanation": "Trường bắt buộc thiếu là thay đổi hợp đồng; giá trị mặc định cần căn cứ nghiệp vụ.",
        "lessonIds": [
          "data-schema-evolution"
        ]
      },
      {
        "id": "data-exam-04",
        "question": "Báo cáo AVG(amount) giảm sau khi fill_null(0). Kết luận nào đúng?",
        "options": [
          "Chắc chắn engine sai.",
          "Đây chỉ là tối ưu bộ nhớ.",
          "Chính sách đã đổi mẫu số; cần so lại ý nghĩa dữ liệu thiếu."
        ],
        "correct": 2,
        "explanation": "Điền zero là thay đổi ngữ nghĩa, không phải tối ưu thuần kỹ thuật.",
        "lessonIds": [
          "data-expressions",
          "data-columnar"
        ]
      },
      {
        "id": "data-exam-05",
        "question": "Left join đơn hàng với bảng khách hàng tăng gấp đôi doanh thu. Kiểm tra nào cần ưu tiên?",
        "options": [
          "Tăng thread.",
          "Kiểm tra tính duy nhất khóa khách hàng và cardinality join.",
          "Ép tổng về i32."
        ],
        "correct": 1,
        "explanation": "Dimension trùng khóa tạo nhiều match, làm nhân bản đóng góp.",
        "lessonIds": [
          "data-joins"
        ]
      },
      {
        "id": "data-exam-06",
        "question": "Hai partition lần lượt có (sum,count)=(100,1),(0,9). Hệ thống gộp mean thành50. Sửa thế nào?",
        "options": [
          "Gộp sum/count rồi chia thành10.",
          "Sort hai mean rồi chọn nhỏ.",
          "Giữ50 vì có hai worker."
        ],
        "correct": 0,
        "explanation": "Mean phải có trọng số số mẫu; số partition không phải mẫu số nghiệp vụ.",
        "lessonIds": [
          "data-window-aggregates"
        ]
      },
      {
        "id": "data-exam-07",
        "question": "Query trả10hàng nhưng scan đọc toàn bộ dataset rộng. Muốn chứng minh projection pushdown, cần bằng chứng nào?",
        "options": [
          "Ảnh chụp kết quả10hàng.",
          "Tên biến lazy trong code.",
          "Plan ở nguồn và số đo cột/bytes đọc trước sau."
        ],
        "correct": 2,
        "explanation": "Kích thước output không phản ánh lượng nguồn đã đọc.",
        "lessonIds": [
          "data-query-plans",
          "data-polars"
        ]
      },
      {
        "id": "data-exam-08",
        "question": "DataFusion trả Arrow array có null. Vì sao đọc value(i) ở mọi slot không đủ?",
        "options": [
          "Vì cần kiểm tra validity để giữ ngữ nghĩa null.",
          "Vì Arrow không có kiểu.",
          "Vì mọi null luôn là0."
        ],
        "correct": 0,
        "explanation": "Buffer vật lý không thay cho validity bitmap; giá trị slot null không là giá trị nghiệp vụ.",
        "lessonIds": [
          "data-query-project",
          "data-columnar"
        ]
      },
      {
        "id": "data-exam-09",
        "question": "Sau delete v8, update v6 đến muộn. Trạng thái đúng là gì?",
        "options": [
          "Khôi phục theo v6.",
          "Giữ tombstone v8 và bỏ qua v6.",
          "Tăng tổng vì thêm sự kiện."
        ],
        "correct": 1,
        "explanation": "Giữ version xóa ngăn dữ liệu cũ làm bản ghi sống lại.",
        "lessonIds": [
          "data-incremental"
        ]
      },
      {
        "id": "data-exam-10",
        "question": "Hash partition mất cân bằng vì một customer có90%hàng. Bước tiếp theo phù hợp nhất?",
        "options": [
          "Đo partition và xem pre-aggregation/chiến lược khóa nóng có bước gộp đúng.",
          "Tăng bucket rồi cam kết đã hết skew.",
          "Đổi tên customer."
        ],
        "correct": 0,
        "explanation": "Một khóa vẫn đi chung bucket; cần giải pháp dựa trên phân bố và ngữ nghĩa.",
        "lessonIds": [
          "data-partition-design",
          "data-streaming"
        ]
      },
      {
        "id": "data-exam-11",
        "question": "Writer A/B cùng đọc revision7. A publish8 trước. B nên làm gì?",
        "options": [
          "Ghi đè manifest vì dữ liệu cũng hợp lệ.",
          "Tự sửa expected thành8 rồi bỏ qua review.",
          "Nhận conflict, đọc lại trạng thái và đánh giá lại ý định trước retry."
        ],
        "correct": 2,
        "explanation": "Revision bảo vệ thao tác dựa trên trạng thái đã xem; retry mù có thể mất thay đổi.",
        "lessonIds": [
          "data-release-project"
        ]
      },
      {
        "id": "data-exam-12",
        "question": "Benchmark mới nhanh gấp đôi nhưng đổi SUM(null) thành0. Có được nhận là tối ưu tương đương không?",
        "options": [
          "Có nếu nhanh hơn.",
          "Không; cần giữ hợp đồng hoặc phát hành thay đổi ngữ nghĩa có version.",
          "Có nếu ít người dùng null."
        ],
        "correct": 1,
        "explanation": "Tính đúng là điều kiện của tối ưu. Thay đổi ý nghĩa cần được công bố và kiểm thử riêng.",
        "lessonIds": [
          "data-reproducibility",
          "data-production"
        ]
      }
    ],
    "skills": [
      {
        "id": "data-skill-1",
        "title": "Hợp đồng và chất lượng dữ liệu",
        "description": "Định nghĩa schema và đơn vị. Tách lỗi cấu trúc khỏi reject theo dòng. Chứng minh số lượng và tổng tiền.",
        "lessonIds": [
          "data-columnar",
          "data-ingestion",
          "data-quality-project"
        ],
        "projectIds": [
          "data-project-quality"
        ],
        "required": true
      },
      {
        "id": "data-skill-2",
        "title": "Biến đổi cột và tiến hóa schema",
        "description": "Đọc kế hoạch lazy. Giữ đúng null và kiểu đầu ra. Kiểm thử ma trận reader/writer.",
        "lessonIds": [
          "data-polars",
          "data-expressions",
          "data-schema-evolution"
        ],
        "projectIds": [
          "data-project-quality"
        ],
        "required": true
      },
      {
        "id": "data-skill-3",
        "title": "Join, thời gian và cửa sổ",
        "description": "Kiểm soát cardinality của join. Xử lý thời gian và sự kiện đến muộn. Gộp aggregate có trọng số.",
        "lessonIds": [
          "data-joins",
          "data-event-time",
          "data-window-aggregates",
          "data-query-project"
        ],
        "projectIds": [
          "data-project-engine"
        ],
        "required": true
      },
      {
        "id": "data-skill-4",
        "title": "Xây engine truy vấn nhúng",
        "description": "Phân biệt logical và physical plan. Đối chiếu kết quả giữa partition. Trả lỗi truy vấn có kiểm soát.",
        "lessonIds": [
          "data-datafusion",
          "data-query-plans",
          "data-query-project"
        ],
        "projectIds": [
          "data-project-engine"
        ],
        "required": true
      },
      {
        "id": "data-skill-5",
        "title": "Dữ liệu lớn và xử lý tăng dần",
        "description": "Đo skew và giới hạn bộ nhớ. Chọn bố cục Parquet theo workload. Retry CDC mà không nhân đôi trạng thái.",
        "lessonIds": [
          "data-streaming",
          "data-partition-design",
          "data-incremental"
        ],
        "projectIds": [
          "data-project-release"
        ],
        "required": true
      },
      {
        "id": "data-skill-6",
        "title": "Công bố và vận hành dataset",
        "description": "Tái lập từ manifest. Phát hiện writer cạnh tranh. Giữ reader trên snapshot hoàn chỉnh.",
        "lessonIds": [
          "data-production",
          "data-reproducibility",
          "data-release-project"
        ],
        "projectIds": [
          "data-project-release"
        ],
        "required": true
      }
    ]
  }
};
