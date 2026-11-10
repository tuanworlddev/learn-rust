# Review hướng Blockchain: Solana và Anchor

Ngày đối chiếu nguồn: **2026-11-10 UTC**.

## Phạm vi và tích hợp

- File dữ liệu: `src/data/specializations/blockchain.ts`.
- Export: `blockchainBundle`; track ID: `blockchain`; module ID: `track-blockchain`.
- Sáu bài theo thứ tự, mỗi bài bốn phần giảng, bài tập Rust standard library, starter/solution, assertion, stdout xác định, hints, quiz có giải thích và tài liệu chính thức.
- Hai lab Cargo hoàn chỉnh với manifest, source, host tests và lệnh chạy.
- Capstone năm mốc với tiêu chí nghiệm thu đo được; chưa phát hành chương trình lên blockchain.

| Bài | Phần giảng | Số từ phần giảng* | Trọng tâm |
| --- | ---: | ---: | --- |
| blockchain-accounts | 4 | 507 | Account, instruction, owner, authority, signer, writable |
| blockchain-pda | 4 | 488 | Domain của seed, UTF-8, canonical bump, PDA khác owner |
| blockchain-anchor-state | 4 | 479 | Accounts validation, serialized space, revision, checked arithmetic |
| blockchain-cpi | 4 | 494 | Program đích, giới hạn quyền, PDA signer, reload sau CPI |
| blockchain-transactions | 4 | 510 | IDL, u64 phía client, confirmation, expiration, idempotency |
| blockchain-testing-release | 4 | 511 | Test theo lớp, ma trận test âm, migration, verifiable release |

*Đếm các phần `sections[].text` theo khoảng trắng; không cộng code, bài tập hoặc lab. Tổng 2.989 từ phần giảng.

## Quyết định phiên bản

Dùng **Anchor 1.2.2 stable**, không dùng Anchor v2 release candidate. Tài liệu 1.2.2 nêu Solana CLI 4.1.2 và platform-tools v1.57 là bộ khuyến nghị cho luồng build; các con số đó không đồng nghĩa hai lab host đã build SBF. Lab PDA ghim **solana-pubkey =4.4.0** và bật `curve25519`, `sha2`.

Không dùng ngầm phiên bản SDK mới nhất trong Cargo.toml. Sau lần resolve đầu tiên, người học giữ Cargo.lock để khóa dependency bắc cầu. TypeScript client chỉ được giảng về hợp đồng/kiểu dữ liệu, không đưa ví dụ package cũ có tên hoặc API không còn khớp Anchor hiện hành.

## Nội dung thực hành

### Browser

Sáu bài tập đều là chương trình std-only có phép xử lý thật và assertion biên:

1. Kiểm tra quyền với thứ tự lỗi xác định.
2. Giữ nguyên seed UTF-8, giới hạn 32 byte, không lowercase/trim làm đổi danh tính.
3. Tiêu thụ quota bằng revision; lỗi số học không thay đổi state.
4. Kiểm tra tập quyền CPI con, tách PDA signer khỏi writable.
5. Máy quyết định chờ/đối chiếu/dựng lại khi RPC chưa cho kết quả rõ ràng.
6. Chuyển payload v1 sang v2, kiểm tra độ dài và chạy migration lặp an toàn.

Các bài tập không giả lập mật mã bằng hàm băm tự viết, không dùng số nguyên nhỏ thay cho public key mà che giấu giới hạn mô hình. Bài quyền và CPI nói rõ input mô hình đại diện cho metadata đã được runtime/lớp tin cậy kiểm chứng.

### Lab PDA registry

Bốn tệp: `Cargo.toml`, `src/lib.rs`, `src/main.rs`, `tests/address.rs`.

- Dùng SDK thật để dẫn xuất PDA, thử canonical bump và tái tạo địa chỉ.
- Kiểm tra off-curve, domain theo authority/id/program, mã hóa u64 little-endian.
- Từ chối metadata sai address, owner và bump bằng lỗi riêng.
- Bốn integration tests; không gọi RPC và không tạo account mạng.

### Lab Anchor quota

Bốn tệp: `Cargo.toml`, `src/lib.rs`, `tests/host.rs`, `README.md`.

- Chương trình có `#[program]`, initialize/consume, `#[derive(Accounts)]`, `Account<Quota>`, `Signer`, `has_one`, `seeds`, `bump` và `init`.
- Payload Quota có Pubkey, remaining u64, revision u64 và bump u8: 49 byte ngoài discriminator.
- Dùng `Quota::DISCRIMINATOR.len() + Quota::INIT_SPACE`, không dùng `size_of` để tính serialized layout.
- Helper tính các giá trị mới trước khi ghi; overflow revision không trừ remaining dở dang.
- Bảy host integration tests cho state, serialization, discriminator, account metas và instruction bytes. Macro cũng sinh test program ID.
- Program ID cố định là fixture host, không phải lời khẳng định có một chương trình đã được deploy ở địa chỉ đó.

Host test không gọi entrypoint trong SVM. README và bài giảng nêu rõ các ràng buộc `has_one`, `seeds`, signer, CPI và rollback transaction còn phải được thực thi trong LiteSVM/local validator ở capstone. Không mô tả việc biên dịch macro như bằng chứng runtime phân quyền đã đúng.

## Các điểm được review kỹ

- Owner của account khác authority nghiệp vụ; một signer bất kỳ không có quyền trên account của người khác.
- PDA derivation không tạo account, không cấp lamports, không tự gán owner. PDA signer không phải secret key.
- Seed có hợp đồng byte, thứ tự và domain; tránh framing mơ hồ, phân biệt byte UTF-8 với số ký tự.
- `Account<T>`, `has_one`, `Signer`, `seeds` bảo vệ các điều kiện khác nhau.
- Quyền ký PDA qua `invoke_signed` không tự cấp writable hoặc bỏ qua validation của callee.
- Cờ executable không thay cho xác minh program ID được phép.
- Cần xem xét reload account sau CPI, phạm vi borrow và hai vai trò không được trỏ cùng account.
- Recent blockhash dùng `lastValidBlockHeight`; không thay block height bằng slot hoặc một timeout giây cố định.
- Transaction signature không phải receipt nghiệp vụ; transaction mới vẫn cần request ID/revision để chống thực hiện lặp.
- Migration không xảy ra tự động sau khi nâng cấp code; byte cũ phải được kiểm tra và chuyển theo chính sách rõ ràng.
- Sản phẩm cuối yêu cầu dữ liệu kiểm chứng, test âm và hồ sơ phát hành; không hứa người học đạt năng lực sản xuất chỉ vì đọc hết sáu bài.

## Nguồn chính thức đã đối chiếu

| Nguồn | Điều đã đối chiếu |
| --- | --- |
| https://solana.com/docs/core/accounts | Cấu trúc account, owner và quyền sửa dữ liệu |
| https://solana.com/docs/core/pda | Dẫn xuất địa chỉ, off-curve, seed, bump và quyền ký qua runtime |
| https://docs.rs/crate/solana-pubkey/4.4.0/features | Phiên bản SDK và feature curve25519/sha2 |
| https://docs.rs/solana-pubkey/latest/solana_pubkey/ | Kiểu Pubkey và chức năng của crate |
| https://www.anchor-lang.com/docs/updates/release-notes/1-2-2 | Stable release 1.2.2 và bộ toolchain được khuyến nghị |
| https://www.anchor-lang.com/docs/basics/program-structure | Vai trò của program, Context, Accounts và account macro |
| https://www.anchor-lang.com/docs/references/account-constraints | has_one, seeds/bump, signer, mut, init, executable và dup |
| https://docs.rs/anchor-lang/latest/anchor_lang/accounts/account/struct.Account.html | Kiểm tra owner của Account<T> |
| https://docs.rs/anchor-lang/latest/anchor_lang/prelude/attr.account.html | Discriminator mặc định và khả năng tùy chỉnh |
| https://www.anchor-lang.com/docs/references/space | Serialized space và InitSpace |
| https://solana.com/docs/core/cpi | invoke/invoke_signed, truyền quyền và compute budget |
| https://solana.com/docs/core/transactions | Atomicity và trạng thái giao dịch |
| https://solana.com/developers/cookbook/transactions/confirmation | Vòng đời recent blockhash, confirmation, expiration |
| https://www.anchor-lang.com/docs/testing/litesvm | Môi trường SVM trong tiến trình để kiểm thử chương trình |
| https://www.anchor-lang.com/docs/references/verifiable-builds | Quy trình build có thể đối chiếu với binary/IDL |
| https://www.anchor-lang.com/docs/references/anchor-toml | Ranh giới cấu hình workspace, cluster và toolchain |

Các trang `latest` trong bảng phản ánh trạng thái đọc ngày 2026-11-10; dependency trong lab được pin chính xác. Không dựa vào nội dung quảng cáo đầu tư hoặc tài liệu bên thứ ba để quyết định API.

## Kiểm tra tác giả đã thực hiện trên Mac

- TypeScript transpilation: đạt.
- TypeScript strict semantic diagnostics cho file: **0 lỗi**.
- `validateCatalog` với module chuyên sâu độc lập: đạt.
- Liên kết track/module/lesson, sáu lesson ID, localLab paths và cấu trúc quiz: đạt.
- ESLint file: exit 0.
- Mỗi bài có bốn phần và nằm trong khoảng 400–550 từ phần giảng.

**Chưa chạy trong agent biên soạn:** rustc cho sáu solution, Cargo cho hai lab, SBF build, LiteSVM, local validator, RPC, deploy hoặc verify chương trình đã phát hành. Agent tổng hợp phụ trách vòng rustc/Cargo; chỉ kết quả thực chạy của vòng đó mới được ghi nhận là đã qua. Không chạm index, config, git hoặc file ngoài hai file của hướng này.
