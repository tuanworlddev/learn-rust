# Rà soát kiến thức Rust và mức độ sẵn sàng ứng dụng

Ngày rà soát: 11/11/2026. Nguồn đầu vào: 20 chương, 80 bài học và 3 dự án một tệp của Learn Rust, trên nền bản Git `bc0cdd2`.

## Kết luận

Khóa học có phạm vi ngôn ngữ khá rộng, từ cú pháp đến ownership, lifetime, concurrency, async và unsafe. Tuy nhiên, **80 bài ngắn không tương đương một chứng nhận đủ năng lực đi làm**. Bài điền mã, output đúng và câu hỏi nhận biết cần được nối với lập trình độc lập, giải thích quyết định thiết kế và một dự án Cargo nhiều tệp có I/O, kiểm thử và cách vận hành.

Đợt rà soát này đọc phần lý thuyết, yêu cầu bài tập, lời giải và quiz của cả 80 bài; kiểm tra thêm 3 dự án. Đã đối chiếu những quy tắc dễ hiểu sai với Rust Book, Rust Reference, rustdoc và tài liệu Tokio chính thức. Không phát hiện lỗi rõ ràng trong hợp đồng Pin/Waker/Send/Sync đang có; các ví dụ đã nói đúng rằng executor một Future và mô phỏng Cargo trên web chưa phải dự án runtime thật. Các phần dưới sửa những chỗ diễn đạt chưa chính xác, nâng bài kiểm tra biên và thêm chiều sâu sử dụng.

## Những thay đổi đã thực hiện

| Phạm vi | Phát hiện | Sửa đổi |
| --- | --- | --- |
| Ownership | “Clone tạo bản sao độc lập” dễ làm người học suy diễn sang `Rc`/`Arc`. | Phân biệt clone giá trị mới với sao chép sâu; giải thích move, borrowing và cách lưu stack/heap là các vấn đề khác nhau. |
| Borrowing | Diễn đạt binding luôn cần `mut` quá rộng; chưa có ví dụ lần dùng cuối. | Giới hạn phát biểu cho biến sở hữu; thêm ví dụ lượt mượn đọc kết thúc trước lượt mượn sửa. |
| Slice và kiểu cơ bản | Đánh đồng slice với tham chiếu; thiếu phần mảng trước các bài dùng array. | Phân biệt `[T]` và `&[T]`; bổ sung tuple, array `[T; N]`, `checked_*`, `saturating_*`, `wrapping_*`. |
| Lifetime | Người học có thể thuộc ký hiệu nhưng chưa đọc được hợp đồng trả về. | Bổ sung quy tắc elision phổ biến và khi cần trả `String` sở hữu. |
| Result | `safe_divide` chỉ an toàn cho dữ liệu nhỏ, chưa xét `i32::MIN / -1`. | Chuyển sang `checked_div`; phân biệt lỗi mẫu 0 và tràn; thêm ca số âm, 0 và biên i32. |
| Trait/generic/closure | Thiếu orphan rule, ý nghĩa `impl Trait` trả về và phân biệt nhóm `Fn`. | Bổ sung coherence, kiểu trả về cụ thể, `Fn`/`FnMut`/`FnOnce`, ví dụ `move` vẫn có thể gọi nhiều lần. |
| Iterator | `filter` với `&&T` có thể khiến người học chép `**` mà không hiểu. | Giải thích `Item`, cách filter mượn item và map nhận item. |
| Smart pointer/concurrency | Dễ suy ra duyệt lặp giải quyết mọi rủi ro stack; poisoning luôn xảy ra; channel luôn có đủ bộ nhớ. | Nêu cả Drop đệ quy, giới hạn poisoning, bounded channel/backpressure, giữ khóa ngắn, `Arc` không sửa trait bounds của `T`. |
| Async | Có cơ chế cơ bản nhưng thiếu quan hệ với hủy công việc và dự án runtime. | Bổ sung tuần tự/concurrent, tác dụng phụ khi Future bị drop, `JoinHandle` detach, giới hạn executor mẫu và những việc cần làm với runtime thật. |
| Trait object/unsafe/FFI | Chưa phân biệt dyn với heap, hoặc test chạy qua với chứng minh soundness. | Bổ sung `&dyn`/`Box<dyn>`, lifetime và auto traits; nghĩa vụ safe wrapper; ABI, ownership và unwind ở FFI. |
| Kiểm thử/I/O/hiệu năng | Thiếu nối từ ví dụ nhỏ sang dữ liệu ngoài hệ thống. | Thêm regression/boundary testing, giới hạn đọc bộ nhớ, lỗi flush, mức bền vững, cách ghi lại bằng chứng benchmark. |
| Bài `traits` | Vẫn dùng tên “Rust Việt” và con số 24. | Đồng bộ ví dụ thành Learn Rust/80 ở starter, solution, yêu cầu và output. |
| Bài `mini-project` | Tổng tiền u64 dùng `sum()` không kiểm tra tràn. | Trả `Result`, dùng `checked_add`, kiểm tra tổng đúng tại `u64::MAX` và vượt giới hạn. |
| Dự án `expense-tracker` | Tổng toàn bộ và tổng danh mục có thể tràn; vượt ngân sách và lỗi tính tổng chưa tách biệt. | API trả `Result`; `remaining_budget` trả `Result<Option<u64>, _>`; thêm ca rỗng, biên và lỗi tràn. |
| Dự án `task-manager` | `next_id += 1` có thể panic/wrap; chưa kiểm tra trạng thái khi hết ID. | `checked_add`, trả lỗi riêng, giữ nguyên danh sách và ID khi thất bại; thêm assertions. |
| Dự án `text-analyzer` | Nhãn “ký tự Unicode” có thể bị hiểu là grapheme; chưa nêu đủ giới hạn chuẩn hóa. | Đổi output thành “Unicode scalar”; ghi rõ không chuẩn hóa NFC/NFD hoặc phân đoạn từ tiếng Việt tổng quát. |

Tổng thay đổi: **32 bài được cập nhật, thêm 21 mục giải thích, chỉnh cả 3 dự án**. Giữ nguyên thứ tự chương, 80 lesson ID, 3 project ID và cấu trúc dữ liệu xuất ra. Một số bài nhập môn vẫn dùng số nhỏ; yêu cầu đã ghi rõ miền giả định, không mô tả chúng là API sản phẩm dùng cho mọi input.

## Phạm vi bao phủ đã đọc

Mỗi hàng dưới gồm cả bốn bài của chương, không phải lấy mẫu một bài đại diện.

| Chương | Lesson ID đã rà soát | Đánh giá phạm vi |
| --- | --- | --- |
| 1. Bắt đầu & Công cụ | `hello-rust`, `installation`, `cargo-basics`, `compiler-errors` | Hướng dẫn và giới hạn môi trường web rõ; cài toolchain/Cargo vẫn phải làm trên máy. |
| 2. Biến & Kiểu dữ liệu | `variables`, `scalar-types`, `constants-shadowing`, `conversions` | Đã thêm mảng và hợp đồng tràn; tránh đưa unwrap chưa giải thích vào ví dụ shadowing. |
| 3. Hàm & Luồng điều khiển | `functions`, `expressions-scope`, `control-flow`, `loops` | Đúng với miền bài tập; cần tự viết thêm hàm từ đặc tả ngoài khuôn mẫu. |
| 4. Ownership & Borrowing | `ownership`, `borrowing`, `slices`, `lifetimes` | Đã sửa diễn đạt và tăng phần đọc chữ ký/lần sử dụng cuối. |
| 5. Struct & Enum | `structs`, `methods`, `enums`, `pattern-matching` | Bao phủ khái niệm chính; yêu cầu phương thức/đơn vị dữ liệu cần được luyện trong dự án. |
| 6. Collections & Chuỗi | `vectors`, `strings`, `hashmaps`, `hashsets` | Phân biệt byte/scalar/grapheme và thứ tự HashMap/HashSet đúng. |
| 7. Option & Result | `option`, `result`, `question-mark`, `custom-errors` | Đã nâng `safe_divide` và thảo luận hợp đồng lỗi ở ranh giới. |
| 8. Tổ chức dự án | `modules`, `visibility`, `crates-dependencies`, `workspaces` | Mô phỏng một tệp được gắn nhãn rõ; chưa thay cho trải nghiệm workspace thật. |
| 9. Generic & Trait | `generics`, `traits`, `trait-bounds`, `associated-types` | Đã thêm coherence và `impl Trait`; associated type và bound hiện đúng. |
| 10. Closure & Iterator | `closures`, `iterators`, `iterator-ownership`, `custom-iterator` | Đã thêm nhóm Fn và Item; bài custom iterator có xét None nhiều lần. |
| 11. Smart pointers | `box`, `rc`, `refcell`, `weak` | Phân biệt sở hữu, interior mutability và Weak đúng; đã làm rõ stack khi Drop. |
| 12. Lifetime nâng cao | `lifetime-struct`, `static-lifetime`, `cow`, `drop` | Không nhầm `'static` với sống mãi; `drop` kiểu Copy đã giải thích rõ. |
| 13. Kiểm thử & Chất lượng | `testing`, `integration-tests`, `doc-tests`, `clippy-format` | Assertion trong main không bị mô tả thành Cargo harness; đã thêm regression và giới hạn bằng chứng. |
| 14. I/O & Dòng lệnh | `io-files`, `buffered-io`, `cli-args`, `cli-errors` | Tách dữ liệu vào khỏi môi trường tốt; đã thêm giới hạn tài nguyên và lỗi ghi. |
| 15. Concurrency | `threads`, `channels`, `mutex-arc`, `send-sync` | Đã bổ sung backpressure, poisoning và trait bounds; bài mẫu vẫn chỉ có ít worker. |
| 16. Async & Future | `async-await`, `futures-poll`, `pin-unpin`, `async-runtime` | Poll/wake/pin đúng trong giới hạn mô tả; thực hành runtime, timeout và shutdown cần lab riêng. |
| 17. Macro & Thuộc tính | `macro-rules`, `macro-repetition`, `derive-traits`, `cfg-attributes` | Có kiểm tra tác dụng phụ, dấu phẩy cuối và khác biệt cfg/cfg!; không dạy proc macro chuyên sâu. |
| 18. Rust nâng cao | `trait-objects`, `advanced-patterns`, `unsafe-basics`, `ffi-layout` | Đã thêm các ranh giới an toàn; chưa là khóa viết thư viện unsafe hoặc binding FFI hoàn chỉnh. |
| 19. Thiết kế & Hiệu năng | `newtype`, `typestate`, `allocation`, `benchmarking` | Typestate nêu đúng self bị tiêu thụ khi Err; benchmark không dùng độ trễ web làm bằng chứng tốc độ. |
| 20. Dự án tổng hợp | `mini-project`, `cli-search`, `parser-project`, `concurrent-project` | Lõi logic có tests biên; sổ chi tiêu đã kiểm tra tràn; ứng dụng nhiều tệp và vận hành là bước tiếp. |

## Bằng chứng đánh giá năng lực cần có

Các tiêu chí này là đề xuất sư phạm từ mục tiêu dự án, không phải thống kê tuyển dụng hay cam kết đỗ phỏng vấn:

1. **Giải thích được bằng mã:** sửa lỗi borrow, giải thích vì sao một biến không còn dùng được, khi chọn `String`/`&str`, `Rc`/`Arc`, enum/generic/dyn. Không chỉ chọn đúng một câu trắc nghiệm.
2. **Viết độc lập:** từ một đặc tả mới, tự tạo package, tách module, định nghĩa lỗi và viết ca kiểm tra trước khi xem lời giải.
3. **Hoàn thành một ứng dụng có dữ liệu bền:** CLI đọc/ghi tệp hoặc dịch vụ HTTP có database, schema migration, validation và lỗi có cấu trúc. Ba dự án web một tệp hiện hữu không cung cấp bằng chứng này.
4. **Xử lý thất bại:** kiểm tra input sai, timeout, hủy, tranh chấp, I/O lỗi, khởi động lại và đóng ứng dụng. Giải thích dữ liệu nào có thể mất hoặc cần giao dịch.
5. **Làm việc trong repo:** đọc README, build từ checkout sạch, viết test hồi quy, dùng fmt/Clippy/test trong CI, tạo một thay đổi nhỏ và giải thích trade-off khi review.
6. **Phỏng vấn thực hành:** trình bày 5–10 phút về thiết kế dự án, giải một bài code chưa thấy, sửa một bug bằng diagnostic và giải thích điều mình chưa biết cùng cách tra tài liệu.

Khóa ngôn ngữ chung cần tách nhánh mục tiêu sau đó. Backend đòi hỏi HTTP/database/observability; embedded cần `no_std`, phần cứng, hạn chế tài nguyên; FFI/mobile cần ABI, quyền sở hữu qua biên và công cụ build. Không nên dùng cùng một nhãn “đủ mọi dự án thực tế” cho cả ba nhánh.

## Giới hạn chấm bài và tính tương thích

Bộ chấm chỉ so stdout không thể phân biệt một thuật toán đúng với chương trình xóa tests rồi in hằng số. Phát hiện này đã chuyển cho agent UX và root để xử lý ở runner; chỉ thêm nhiều assertion vào starter chưa tự khắc phục lỗ hổng. Ngay cả khi chạy test tin cậy, một bộ test hữu hạn cũng không phải chứng minh kỹ năng độc lập.

Các draft cũ được giữ theo ID để không mất công của người học. Bài `result`, `mini-project` và dự án `expense-tracker` có hợp đồng/starter mới; `traits` và `text-analyzer` đổi output. Trạng thái đã giải trước phiên bản bộ test mới không nên được dùng như bằng chứng đã qua bộ test cập nhật. Người học cần có thao tác lấy lại starter rõ ràng mà không bị tự ghi đè draft.

## Kiểm tra kỹ thuật

Trong lượt review dữ liệu này, kiểm tra kiểu riêng cho cả năm file TypeScript có **0 lỗi**; đã transpile và nạp toàn bộ exports, xác nhận **20 chương / 80 bài / 3 dự án**, thứ tự và IDs không đổi. Môi trường review không có `rustc`; agent chính đã đồng bộ bản sửa lên Mac và xác nhận **83/83 lời giải biên dịch, chạy assertion và khớp output**. Báo cáo thực thi cùng source hash nằm ở `reports/curriculum-validation.json`. Kết quả này xác nhận các chương trình mẫu trên dữ liệu đã kiểm tra, không chứng minh mọi input hoặc năng lực của một người học.

## Tài liệu chính thức dùng đối chiếu

- Clone và việc chia sẻ dữ liệu sau clone: <https://doc.rust-lang.org/std/clone/trait.Clone.html>
- Scalar/compound types và overflow: <https://doc.rust-lang.org/book/ch03-02-data-types.html>
- Borrowing: <https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html>
- Lifetime elision và lifetime của trait object: <https://doc.rust-lang.org/reference/lifetime-elision.html>
- `checked_div`: <https://doc.rust-lang.org/std/primitive.i32.html#method.checked_div>
- `checked_add`: <https://doc.rust-lang.org/std/primitive.u64.html#method.checked_add>
- Trait/coherence/orphan rule: <https://doc.rust-lang.org/book/ch10-02-traits.html>
- Nhóm trait của closure: <https://doc.rust-lang.org/book/ch13-01-closures.html>
- Trait object: <https://doc.rust-lang.org/reference/types/trait-object.html>
- Pin/Unpin: <https://doc.rust-lang.org/std/pin/>
- Arc và Send/Sync: <https://doc.rust-lang.org/std/sync/struct.Arc.html>
- Mutex poisoning: <https://doc.rust-lang.org/std/sync/struct.Mutex.html>
- Bounded channel: <https://doc.rust-lang.org/std/sync/mpsc/fn.sync_channel.html>
- Tokio shared state: <https://tokio.rs/tokio/tutorial/shared-state>
- Tokio channels/backpressure: <https://tokio.rs/tokio/tutorial/channels>
- Tokio spawning và bound của task: <https://tokio.rs/tokio/tutorial/spawning>
- Tokio select/cancellation: <https://tokio.rs/tokio/tutorial/select>
- Drop JoinHandle không tự hủy task: <https://docs.rs/tokio/latest/tokio/task/struct.JoinHandle.html>
- FFI và unwind: <https://doc.rust-lang.org/nomicon/ffi.html>
- Khả năng và giới hạn Miri: <https://github.com/rust-lang/miri>
