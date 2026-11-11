# Mở rộng khóa Blockchain với Rust

Ngày biên soạn: 11/11/2026.

## Cấu trúc và phạm vi
Giữ sáu bài cũ, thêm 12 bài mới, mỗi bài năm mục, 437–462 từ, ví dụ lỗi, bài Rust std-only có assertion và stdout xác định. Sáu chương lần lượt dạy account/trust/layout; PDA/authority; Anchor/state machine; CPI/compute; client/indexer/upgrade; threat model/release. Nội dung cần học được trình bày trong hệ thống, không giao phần kiến thức cốt lõi cho đường dẫn ngoài.

Có ba dự án độc lập: registry-identity dùng solana-pubkey 4.4.0 để derive PDA thật; review_program dùng Anchor 1.2.2 và account constraints thật; review-release là workspace chứa program, instruction builder từ code sinh Anchor, decoder metadata+bytes, SHA-256, indexer, gateway CPI và harness LiteSVM. Các chữ ký và số dư của harness là fixture công khai trong bộ nhớ; không có ví, RPC, giao dịch mạng hoặc chuyển tài sản thật trong lab. Program ID là public fixture, không phải tuyên bố chương trình đã deploy.

Mỗi dự án có ba mốc, năm đến sáu tình huống, bốn rubric (gồm tiêu chí bắt buộc) và bằng chứng nộp. Bộ đánh giá có 12 tình huống, hai câu mỗi chương, giải thích và bài ôn. Sáu năng lực gắn bài/dự án; hai mô phỏng có hai kịch bản, bốn bước mỗi kịch bản.

## Ma trận năng lực và bằng chứng
| Năng lực | Bài học | Bằng chứng |
| --- | --- | --- |
| Phân biệt owner, signer, authority và bytes | blockchain-trust-boundaries, blockchain-serialization | Ca âm độc lập, fixture layout/u64 của registry và Anchor |
| Namespace PDA và chuyển quyền | blockchain-authority, blockchain-registry-project | SDK derive/reconstruct/off-curve, canonical bump và thiết kế chuyển quyền |
| State machine và Anchor | blockchain-state-machines, blockchain-anchor-project | Transition table, stale/overflow, INIT_SPACE 82 byte, generated metas/bytes |
| CPI và ngân sách | blockchain-capabilities, blockchain-compute-budget | Gateway CPI có PDA seeds/allowlist/reload, 14 test LiteSVM và log CU/digest; cần chạy SBF thực trước tự nghiệm thu |
| Client/indexer/upgrade | blockchain-indexing, blockchain-upgrades | Dedup, conflict, gap/reconcile, slot regression và compatibility fixtures |
| Review và phát hành | blockchain-threat-model, blockchain-release-project | Manifest source/IDL/binary/toolchain, từng test âm, rollback và compute trên SVM |

## Bằng chứng hiện có
Đã biên dịch và chạy 12/12 lời giải std-only bằng rustc --edition=2024 trên Mac; stdout và assertion đều khớp, tệp nằm trong work/expansion-blockchain. Cả 5 Cargo host lab của khóa đã PASS sau re-extract canonical; các bộ test chính:
- Registry: sáu test tích hợp.
- Anchor review: chín host test cộng test program ID do Anchor sinh.
- Release workspace: tám test client/indexer, cùng chín test program và test ID.

Host workspace và harness compile đã PASS; hai binary SBF đã build và 14/14 test LiteSVM PASS, không có test ignored. RUNTIME-TEST-PLAN.md liên kết harness có sẵn trong svm/tests/runtime.rs và gateway CPI; svm/README.md cung cấp đủ hướng dẫn, dependency và script. Có mã test không đồng nghĩa đã thực thi binary SBF.

## Ranh giới readiness
Host tests không thực thi entrypoint SBF, không chứng minh runtime signer/owner/writable/seeds/init/CPI/rollback hoặc compute units. Capstone hiện có kết quả 14 test SVM trên đúng hai binary digest; học viên vẫn phải chạy lại và lưu bằng chứng cho bản sửa của mình. Browser/client mạng, RPC/finality thực, fork, cluster feature set và upgrade triển khai chưa được kiểm thử. finalized trong indexer là metadata fixture từ nguồn giả lập, không phải tín hiệu do client tùy đặt có thể tin trên production.

Hoàn thành câu hỏi hoặc host labs không đồng nghĩa audit bảo mật hay đủ cho mọi sản phẩm. Trước khi bàn giao dự án thực tế cần SVM, adapter nguồn, persistence/checkpoint, migration rehearsal và review độc lập theo phạm vi. Bài học nêu cụ thể việc phải làm, không che khoảng trống bằng nhãn hoàn thành.

## Nguồn chính thức đã đối chiếu
- Solana account structure: https://solana.com/docs/core/accounts/account-structure — address, owner, data và quyền runtime.
- Solana PDA: https://solana.com/docs/core/pda — dẫn xuất địa chỉ, off-curve và program signer.
- PDA accounts: https://solana.com/docs/core/pda/pda-accounts — dẫn xuất khác tạo account.
- CPI: https://solana.com/docs/core/cpi — quyền caller/callee, invoke_signed và compute dùng chung.
- Anchor account constraints: https://www.anchor-lang.com/docs/references/account-constraints — Signer, owner, has_one, seeds/bump và writable.
- Anchor program structure: https://www.anchor-lang.com/docs/basics/program-structure — account validation và handlers.
- Anchor IDL: https://www.anchor-lang.com/docs/basics/idl — giao diện client/program.
- Anchor testing: https://www.anchor-lang.com/docs/testing — phân loại công cụ kiểm thử.
- Mollusk: https://www.anchor-lang.com/docs/testing/mollusk — thực thi ELF trong SVM và account fixtures.
- LiteSVM: https://www.anchor-lang.com/docs/testing/litesvm — harness runtime cục bộ.
- Solana RPC: https://solana.com/docs/rpc — adapter quan sát và mức xác nhận.

Nguồn hiện tại có cả hướng dẫn Anchor v2; mã bài học cố định 1.2.2 và không trộn API v2 vào localLab.

## Sửa sau rà soát chéo: harness SVM và CPI nội bộ

Capstone bổ sung gateway Anchor 1.2.2 gọi review_program qua CPI: operator signer, author PDA theo operator, allowlist Program, signer seeds, reload và postcondition. svm/ có LiteSVM 0.16.0 với Solana dependencies pin theo Cargo.toml crate gốc, 14 test runtime và README tự đủ. Script build hai SBF bằng cargo-build-sbf 4.6.0/platform-tools v1.58/arch v2, lưu log và manifest SHA-256 sau PASS. Tests bao gồm initialize/transition, signer/owner/PDA/bump/writable/reviewer, transaction rollback, CPI privilege escalation, target sai, rollback sau callee success và compute budget. Đây là code/harness thực, đã build hai binary và chạy đủ 14 test SVM; bằng chứng chi tiết trong blockchain-svm.json.

Nguồn API bổ sung: https://docs.rs/litesvm/0.16.0/litesvm/ ; crate gốc https://crates.io/api/v1/crates/litesvm/0.16.0/download ; Anchor 1.2.2 src/context.rs xác nhận CpiContext nhận program Pubkey; https://crates.io/crates/cargo-build-sbf/4.6.0 cho công cụ SBF. Các URL phục vụ biên soạn, không thay hướng dẫn trong bài.

Host workspace mới gồm gateway đã PASS theo root. SVM resolver yêu cầu solana-account >=4.3.1,<4.4.0 qua solana-program-runtime; đã chỉnh pin trực tiếp thành 4.3.2. Biên tập sửa nhiệm vụ cancel đã có trong baseline thành event-version/decoder compatibility; sửa thứ tự decode đúng owner/length/discriminator → decode có kiểm soát → quan hệ authority/PDA/bump → chấp nhận dữ liệu. SVM runtime đã PASS sau đó, xem mục kiểm chứng dưới.


## Kiểm chứng SBF/LiteSVM cuối cùng

- Host Rust: rustc 1.99.1 (58cf8f9c3 2026-10-13); công cụ cargo-build-sbf 4.6.0; platform-tools v1.58, compiler SBF Rust 1.95; kiến trúc sBPF v2.
- Anchor 1.2.2; LiteSVM 0.16.0; solana-account 4.3.2; solana-instruction 3.4.0; solana-transaction 4.1.5; solana-program-runtime thực resolve 4.2.2. JSON kèm đầy đủ graph quan trọng ở host harness và program.
- Build review_program thành công (19.81 giây), review_gateway thành công (0.75 giây). Harness biên dịch thành công bằng --no-run rồi thực thi riêng.
- **14/14 runtime tests PASS; 0 failed, 0 ignored; 0.08 giây.** Bao gồm initialize/submit, signer, owner, writable, PDA/bump, reviewer, approve/reject/terminal/cancel, rollback instruction thứ hai, CPI có/thiếu signer seeds, target allowlist, rollback sau callee success và ngân sách quá nhỏ.
- CU của fixture: submit 3541; gateway + CPI 12369. Đây là số đo của fixture đã khóa, không là cam kết mainnet hay throughput sản phẩm.
- Process thực thi: 975cc5b2-c2e8-493b-a0f0-c1a8196e1b25, exit 0. Scripts lưu log và manifest SHA-256 của binary/source/lockfile trong work/course-labs/blockchain-release-project/target. Báo cáo machine-readable: reports/course-expansion/blockchain-svm.json.

- review_program.so: SHA-256 ee1782c9f8479ab2292485b8716aad99bad6c681a7bb35b042e6776f1bba1640, 145424 byte.
- review_gateway.so: SHA-256 d7583429d8b9e7d80724d9f7a014de9ea7536a03acce802b88adaa0e0f32eb53, 117784 byte.

Không kiểm RPC/consensus/finality ngoài mạng, cluster upgrade hoặc giao dịch tài sản thật. Việc chạy đủ fixture không phải audit toàn bộ smart contract; giới hạn này vẫn nằm trong rubric và report.
