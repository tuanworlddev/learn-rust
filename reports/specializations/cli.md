# CLI và công cụ tự động hóa — hồ sơ nội dung

## Phạm vi bàn giao

- Export: `cliBundle`, track `cli`, module `track-cli`.
- Sáu bài học theo thứ tự, mỗi bài có bốn phần lý thuyết, ví dụ Rust, bài tập chạy trên web bằng thư viện chuẩn, lời giải, đầu ra xác định, assertions cho trường hợp biên, gợi ý và câu hỏi có giải thích.
- Ba lab Cargo có đầy đủ manifest, mã nguồn, lệnh và tiêu chí kiểm tra.
- Đồ án Logscan gồm năm mốc, sản phẩm bàn giao và câu hỏi bảo vệ thiết kế.
- Chỉ sửa `src/data/specializations/cli.ts` và báo cáo này. Không sửa registry, kiểu dữ liệu, UI hay cấu hình chung.

| Bài | Nội dung chính | Số từ phần văn bản | Thực hành web |
| --- | --- | ---: | --- |
| cli-arguments | clap Parser/Subcommand, kiểu đối số, xung đột, PathBuf, kiểm thử parser | 462 | Xác nhận số worker và chế độ xuất |
| cli-streaming | BufRead/Write, Unicode, CRLF, lỗi giữa luồng, phân biệt nguồn lỗi | 461 | Lọc dòng giữ số dòng gốc |
| cli-filesystem | Đường dẫn, create_new, staging/rename, flush/sync, cleanup có phạm vi | 466 | Xác nhận tên báo cáo theo chính sách sản phẩm |
| cli-pipes | stdout/stderr, mã thoát, BrokenPipe, signals và dừng có trật tự | 469 | Ánh xạ kết quả sang mã thoát và nhu cầu báo lỗi |
| cli-parallelism | Đo hiệu năng, bounded queue, worker, thứ tự kết quả, cancellation | 468 | Ghép kết quả hữu hạn theo chỉ số, phát hiện thiếu/trùng/sai phạm vi |
| cli-shipping | Integration tests, TSV có phiên bản, lockfile, target, completion và phát hành | 456 | Xuất TSV có escape và golden assertions |

Số từ đếm riêng `sections[].text` theo khoảng trắng; không cộng mã nguồn, tiêu đề, bài tập hoặc lab. Thời lượng trên giao diện là ước lượng cho bài học; đồ án và lab có thể cần thêm thời gian.

## Lab Cargo và các kiểm tra được cung cấp

### Parser clap thực

Package `cli-contract`, Rust edition 2024, dependency cố định `clap = "=4.6.7"` với feature `derive`.

Bốn test kiểm tra cấu hình CommandFactory, đối số có kiểu và đường dẫn Unicode có khoảng trắng, cờ xung đột/khoảng worker và help với mã thoát 0. Ví dụ chạy chỉ parse đối số; đường dẫn được truyền vào không bị mở hay ghi. Parser và quy tắc nghiệp vụ được trình bày thành hai tầng để người học hiểu phạm vi trách nhiệm của clap.

### Streaming và tiến trình thật

Package `linepick`, edition 2024, chỉ dùng thư viện chuẩn. Hàm lõi generic trên BufRead/Write; kiểu lỗi phân biệt input, output và pattern rỗng. Binary đọc stdin, giữ stdout cho kết quả và stderr cho lỗi, có chính sách mã thoát được công bố.

Ba unit test kiểm tra Unicode/vị trí dòng, UTF-8 không hợp lệ và đích ghi trả BrokenPipe. Hai integration test gọi binary do Cargo build qua `CARGO_BIN_EXE_linepick`, cấp dữ liệu stdin rồi đóng đầu ghi, kiểm tra stdout/stderr/status và trường hợp thiếu đối số. Lệnh pipe minh họa dành cho shell Unix; ghi chú lab nêu cách cấp dữ liệu tương ứng trên PowerShell.

Chỉ lỗi `Output(BrokenPipe)` được xử lý như việc consumer kết thúc sớm. Lỗi đọc không bị nuốt vì có cùng mã lỗi I/O.

### Tệp đầu ra trong thư mục riêng

Package `cli-file-output`, edition 2024, chỉ dùng thư viện chuẩn. Mỗi test tự tạo một thư mục temp bằng create_dir và chỉ cleanup thư mục mà chính nó tạo thành công. Hai test xác nhận không thay nội dung tệp có sẵn khi create_new thất bại và việc ghi/sync tệp staged trước rename trong thư mục do test sở hữu.

Lab không dùng tên tệp của người học, không cleanup thư mục temp chung và không chạm dữ liệu bên ngoài fixture.

## Quyết định kỹ thuật và giới hạn

- Bài tập trên web dùng dữ liệu mẫu xác định và thư viện chuẩn. Lab Cargo mới là nơi dùng parser clap thật, pipe, filesystem và executable; không ngụ ý bài tập thuần Rust đã kiểm chứng tích hợp hệ điều hành.
- BufRead::lines tránh giữ toàn bộ tệp nhưng vẫn có thể cấp phát một dòng rất dài. Bài giảng yêu cầu giới hạn kích thước bản ghi khi đầu vào cần giới hạn bộ nhớ; không mô tả streaming là một trần RAM tự động.
- Bỏ các Err bằng filter_map(Result::ok) làm mất thông tin kết quả dở dang. Nội dung giải thích rằng dữ liệu đã xuất ra pipe không thể rollback.
- create_new xử lý việc tạo mới không ghi đè; write thất bại vẫn có thể để lại tệp mới dở dang. Staging + rename, không ghi đè và bền vững khi mất điện là những bảo đảm khác nhau. Lab rename trong thư mục riêng không chứng minh cơ chế xuất bản an toàn trước mọi tiến trình cạnh tranh hoặc mất điện.
- Hàm xác nhận tên báo cáo dùng chính sách hẹp: ASCII, chiều dài giới hạn, loại tên thiết bị phổ biến và ký tự phân cách. Đây không phải bộ xác nhận mọi đường dẫn Windows, cơ chế sandbox hoặc giải pháp chống symlink/TOCTOU.
- Mã thoát 0/1/2 là hợp đồng của ví dụ, không phải quy tắc bắt buộc cho mọi CLI. Chính sách BrokenPipe được gắn với lỗi đầu ra của công cụ lọc thuần túy.
- Bài học signals trình bày khác biệt nền tảng, chuyển tín hiệu thành cờ/channel và hạn chế của hủy hợp tác; không tuyên bố một atomic flag tự đánh thức thread bị chặn.
- Giới hạn số worker không giới hạn queue, kích thước job hoặc bộ đệm sắp thứ tự. Bài tập ghép kết quả dùng một lô hữu hạn; đồ án yêu cầu thêm cửa sổ đang xử lý và số đo bộ nhớ.
- Completion được hướng dẫn sinh từ cùng định nghĩa clap và tham chiếu clap_complete. Không thêm dependency này vào lab parser chỉ để trình diễn help.
- Không thực hiện đăng package, cài completion vào shell cá nhân hoặc phát hành artifact trong tác vụ biên soạn.
- Sáu bài tạo nền tảng cho dự án chuyên sâu và phỏng vấn; đồ án, phản biện và kiểm thử trên nhiều nền tảng vẫn là phần cần thực hiện để đánh giá năng lực thực tế.

## Đồ án và tiêu chí nghiệm thu

Logscan có năm mốc: hợp đồng lệnh/định dạng; lõi streaming và lỗi; tệp và xuất bản; song song và hủy; binary và phát hành. Mỗi mốc có việc cần làm và acceptance riêng. Sản phẩm gồm repo Cargo/lockfile, parser/unit/integration/golden tests, báo cáo hiệu năng với đầu vào/target/worker/RAM, README, completion, changelog và artifact theo nền tảng với checksum.

Các câu hỏi bảo vệ tập trung vào kết quả dở dang, khác biệt create_new/rename/flush/sync_all, tăng bộ nhớ do worker chậm, phạm vi xử lý BrokenPipe và tương thích schema.

## Nguồn chính thức và phiên bản

Tra cứu ngày 2026-11-10 UTC. Docs clap ghi phiên bản 4.6.7; clap_complete ghi 4.6.11; các trang std được đọc hiển thị 1.99.1. Lab dùng Rust edition 2024. Các liên kết `latest`/stable có thể đổi; dependency clap và liên kết tham khảo clap trong bài đã cố định phiên bản.

| Nguồn | Căn cứ sử dụng |
| --- | --- |
| https://rust-lang.org/what/cli/ | Vai trò Rust trong công cụ dòng lệnh và ecosystem |
| https://docs.rs/clap/4.6.7/clap/ | Phiên bản và API clap |
| https://docs.rs/clap/4.6.7/clap/_derive/_tutorial/index.html | Parser, Subcommand, typed values và derive attributes |
| https://doc.rust-lang.org/std/io/trait.BufRead.html | Hợp đồng lines, UTF-8 và kết thúc dòng |
| https://doc.rust-lang.org/std/io/trait.Write.html | write_all/flush và việc truyền lỗi ghi |
| https://doc.rust-lang.org/std/io/struct.BufWriter.html | Flush tường minh để quan sát lỗi |
| https://doc.rust-lang.org/std/fs/struct.OpenOptions.html | create_new và việc tạo tệp độc quyền |
| https://doc.rust-lang.org/std/fs/fn.rename.html | Hành vi rename, ghi đè đích và khác biệt nền tảng |
| https://doc.rust-lang.org/std/path/struct.Path.html | Path/OsStr và đường dẫn không nhất thiết UTF-8 |
| https://doc.rust-lang.org/std/process/struct.Command.html | Truyền đối số riêng, pipe tiến trình và lưu ý shell |
| https://rust-cli.github.io/book/tutorial/output.html | stdout/stderr và output có thể lỗi |
| https://rust-cli.github.io/book/in-depth/exit-code.html | Mã thoát và việc báo kết quả cho shell |
| https://rust-cli.github.io/book/in-depth/signals.html | Signals và việc tổ chức dừng |
| https://doc.rust-lang.org/std/process/struct.ExitCode.html | Trả trạng thái kết thúc từ main |
| https://doc.rust-lang.org/std/io/enum.ErrorKind.html | Phân loại lỗi I/O, gồm BrokenPipe |
| https://doc.rust-lang.org/std/sync/mpsc/fn.sync_channel.html | Channel hữu hạn và blocking |
| https://doc.rust-lang.org/std/thread/fn.scope.html | Scoped threads và join khi kết thúc scope |
| https://doc.rust-lang.org/cargo/reference/cargo-targets.html | Integration tests và CARGO_BIN_EXE |
| https://doc.rust-lang.org/cargo/commands/cargo-install.html | cargo install và --locked |
| https://doc.rust-lang.org/cargo/reference/publishing.html | Kiểm tra package và quy trình chuẩn bị phát hành |
| https://docs.rs/clap_complete/4.6.11/clap_complete/aot/fn.generate.html | Sinh completion theo shell từ Command |

## Kiểm tra bàn giao

Đã chạy trực tiếp trên repo Mac:

- TypeScript transpile: 0 diagnostics.
- TypeScript strict cho file cli.ts: 0 diagnostics thuộc file.
- `validateCatalog` với track CLI và module tương ứng: thành công.
- Xác nhận 6 bài, đúng 6 ID trong thứ tự track và 3 localLab.
- Số từ phần văn bản các bài: 462, 461, 466, 469, 468, 456.

SHA-256 của `src/data/specializations/cli.ts` tại bàn giao:
`74fb5f4b8e8bfd1f8fd83b0626ebd33327ba651c893feb1a7057e2a4680c4cf2` (62.037 byte).

Chạy sáu lời giải Rust và cargo test ba lab được chuyển cho tác vụ tích hợp của agent chính; báo cáo này không khẳng định chúng đã chạy thành công trước khi có kết quả thực thi đó.
