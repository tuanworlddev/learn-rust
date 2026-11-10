# Rà soát hướng Mobile và thư viện dùng chung

Ngày đối chiếu tài liệu: 2026-11-11 (Asia/Ho_Chi_Minh).

## Nội dung đã hoàn thành

Bundle `mobileBundle` trong `src/data/specializations/mobile.ts`, track `mobile`, module `track-mobile`.

| Bài | Nội dung chính | Bài tập trên web |
| --- | --- | --- |
| mobile-core-boundary | Lõi nghiệp vụ, adapter, hợp đồng dữ liệu | Cộng số tiền có kiểm tra âm và tràn số |
| mobile-uniffi-contract | Record, object, error và proc-macro | Kiểm tra tiêu đề theo Unicode scalar value |
| mobile-targets-bindings | iOS device/simulator, Android ABI, artifact | Chọn target theo môi trường và kiến trúc |
| mobile-lifecycle-async | Object lifetime, callback, hủy và kết quả về muộn | Máy trạng thái bỏ sự kiện cũ, kết thúc đúng một lần |
| mobile-storage-adapters | Persistence version, migration, adapter nền tảng | Parser v1/v2 có giới hạn độ dài và kiểm tra UTF-8 |
| mobile-release-performance | API/ABI/storage compatibility, build và hiệu năng | Phân trang snapshot có giới hạn và giữ thứ tự |

Mỗi bài có bốn mục lý thuyết, 493–538 từ tiếng Việt, ví dụ, yêu cầu bài tập, starter/solution, assertion, output, gợi ý, quiz và reference. Có capstone năm mốc với tiêu chí nghiệm thu, sản phẩm bàn giao và câu hỏi bảo vệ thiết kế.

## Lab Cargo

1. **mobile_domain_core**: thư viện thuần Rust, ba test về ID trùng, overflow và giá trị rỗng/zero. Không cần SDK mobile.
2. **mobile_bridge**: UniFFI cố định `=0.32.2`, `cdylib/staticlib/rlib`, proc-macro scaffolding, record và enum lỗi, hai unit test; binary sinh binding dùng cùng dependency với library. Lệnh sinh Swift và Kotlin đọc cdylib macOS của host. Không coi bước này là build ứng dụng iOS/Android.

Cả hai lab có Cargo.toml, source đầy đủ, lệnh chạy và tiêu chí kiểm tra. Lab UniFFI không thêm UDL/build.rs vì dùng proc-macro. Feature `bindgen` chỉ bật `uniffi/cli` khi chạy generator; binary có `required-features`.

## Quyết định kỹ thuật đã kiểm tra

- UniFFI hiện hành được docs.rs xác nhận là **0.32.2**; không dùng phiên bản phỏng đoán.
- Record/value và object/reference có vòng đời khác nhau; không hứa mọi dữ liệu qua FFI đều zero-copy.
- Lỗi đầu vào dự kiến trả enum error qua Result; không dùng panic làm giao thức lỗi.
- Tài liệu Kotlin hiện hành dùng AutoCloseable/`close()`. Không dạy rằng GC của Kotlin tự bảo đảm thu hồi ngay tài nguyên Rust.
- Hủy được diễn đạt thành hợp đồng thư viện: không giả định Swift Task/coroutine hủy mọi hoạt động Rust hoặc rollback tác dụng phụ đã hoàn tất.
- Tài liệu callback interface đánh dấu kiểu cũ là soft-deprecated và ưu tiên foreign traits. Nội dung không tạo ví dụ mới dựa trên cơ chế callback interface cũ; mô tả callback theo hợp đồng và vòng đời.
- `aarch64-apple-ios` khác `aarch64-apple-ios-sim`; `rustup target add` không thay thế Xcode SDK hoặc Android NDK.
- Không dùng wire format nội bộ UniFFI làm persistence format của sản phẩm.
- Android Keystore bảo vệ khóa mật mã, không bị mô tả sai là kho String/token tùy ý tương đương Apple Keychain.
- Pagination exercise dùng snapshot bất biến; bài học nêu giới hạn offset khi dữ liệu thay đổi.

## Kiểm chứng

Thực hiện trực tiếp trên Mac sau khi môi trường cloud mất kết nối:

- Validator `validateCatalog`: PASS với sáu bài, một track và hai lab.
- TypeScript transpilation: 0 lỗi cú pháp.
- TypeScript kiểm tra tệp mobile với cấu hình dự án: 0 lỗi.
- ESLint riêng tệp mobile: PASS.
- Đã kiểm tra thủ công expected output, nhánh lỗi, tràn số, Unicode, sự kiện về muộn, dữ liệu thiếu/thừa và pagination.

**Chưa ghi nhận runtime Rust hoặc generator pass trong báo cáo này.** Root thực hiện compile/run sáu lời giải và Cargo lab trong đợt kiểm thử chung. Chưa chạy smoke test Swift/Kotlin trên thiết bị hoặc simulator; các bước đó nằm trong tiêu chí capstone, không được tuyên bố đã hoàn tất.

## Tài liệu chính thức đã đối chiếu

- [UniFFI user guide](https://mozilla.github.io/uniffi-rs/latest/) — mục tiêu dùng chung thành phần Rust.
- [UniFFI 0.32.2](https://docs.rs/uniffi/0.32.2/uniffi/) — phiên bản thư viện.
- [Proc-macro và scaffolding](https://mozilla.github.io/uniffi-rs/latest/proc_macro/index.html) — setup_scaffolding và export.
- [Record derive](https://mozilla.github.io/uniffi-rs/latest/proc_macro/records.html) — kiểu dữ liệu công khai.
- [Throwing errors](https://mozilla.github.io/uniffi-rs/latest/types/errors.html) — ánh xạ Result/error.
- [Foreign-language bindings](https://mozilla.github.io/uniffi-rs/latest/tutorial/foreign_language_bindings.html) — binary generator và library mode.
- [Generating bindings](https://mozilla.github.io/uniffi-rs/latest/bindings.html) — cấu hình và metadata.
- [Interfaces, objects and traits](https://mozilla.github.io/uniffi-rs/latest/types/interfaces.html) — tham chiếu, object và concurrent access.
- [Kotlin lifetimes](https://mozilla.github.io/uniffi-rs/latest/kotlin/lifetimes.html) — close/AutoCloseable.
- [Async/Future support](https://mozilla.github.io/uniffi-rs/latest/futures.html) — async bridge và giới hạn hủy.
- [Callback interfaces](https://mozilla.github.io/uniffi-rs/latest/types/callback_interfaces.html) — trạng thái cơ chế cũ.
- [Lifting, lowering and serialization](https://mozilla.github.io/uniffi-rs/latest/internals/lifting_and_lowering.html) — chi phí và định dạng FFI.
- [Rust iOS targets](https://doc.rust-lang.org/rustc/platform-support/apple-ios.html) — target, SDK và simulator/device.
- [Rust Android targets](https://doc.rust-lang.org/rustc/platform-support/android.html) — target và NDK.
- [UniFFI với Gradle](https://mozilla.github.io/uniffi-rs/latest/kotlin/gradle.html) — tích hợp Android.
- [UniFFI với Xcode](https://mozilla.github.io/uniffi-rs/latest/swift/xcode.html) — thư viện và binding. Hướng dẫn này còn minh họa UDL; lab mới dùng proc-macro theo hướng dẫn tương ứng.
- [Android Keystore](https://developer.android.com/privacy-and-security/keystore) — bảo vệ khóa và giới hạn sử dụng.
- [Apple Keychain services](https://developer.apple.com/documentation/security/keychain-services) — lưu dữ liệu bí mật nhỏ; đã đọc bản Markdown chính thức.
- [Cargo SemVer compatibility](https://doc.rust-lang.org/cargo/reference/semver.html) — phạm vi tương thích Rust.

Không có đoạn tài liệu được sao chép dài. Mô hình ghi chú, bài tập, máy trạng thái, parser và capstone được soạn riêng cho khóa học.
