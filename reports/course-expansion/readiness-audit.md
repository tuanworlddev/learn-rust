# Rà soát độc lập năng lực cuối khóa

Ngày: 2026-11-11. Phạm vi: các khóa Data, AI, Blockchain và Embedded; đọc mã nguồn bài học, localLab, yêu cầu dự án, ma trận kỹ năng, rubric và báo cáo mở rộng. Đây là review mã nguồn độc lập, có đối chiếu báo cáo runtime và SHA-256 artifact Blockchain. Reviewer không tự chạy lại Cargo/SVM trong lượt audit; kết quả thực thi được lấy từ báo cáo tích hợp đã kiểm tra, không thay thế nghiệm thu môi trường sản phẩm.

## Kết luận trong phạm vi đã đọc

Các khóa có dự án thực chất: mã đọc/kiểm tra dữ liệu, truy vấn bằng framework, huấn luyện có autodiff, nạp artifact và suy luận, PDA/Anchor, driver embedded-hal, giao thức và phục hồi cấu hình. Không phát hiện dự án chỉ in chuỗi cố định rồi gọi đó là sản phẩm. Bài tập trình duyệt kiểm tra lõi bằng fixture; localLab đưa thư viện/thành phần thật vào quy trình. Những bài bắt học viên bổ sung adapter, checkpoint hoặc vận hành được ghi là phần phải hoàn thiện, không nên tính là bằng chứng đã có sẵn.

Nội dung hiện đủ để đánh giá các năng lực cốt lõi có giới hạn nêu trong bảng dưới đây. Không thể suy ra mọi học viên đã sẵn sàng làm mọi dự án của lĩnh vực chỉ từ số bài, trắc nghiệm hoặc cargo test host. Bằng chứng cuối khóa phải là repository của học viên, ca lỗi, kết quả chạy và giải thích quyết định; bước chưa chạy cần giữ trạng thái chưa nghiệm thu. Không tìm thấy lời hứa bảo đảm việc làm trong các báo cáo đã đọc.

## Phát hiện và trạng thái sau chỉnh sửa

Cập nhật cuối: reviewer đã đọc lại source Data/AI. DATA-01 và AI-01 đã đóng ở mức source; root xác nhận regression Data đã PASS. DATA-02 đã có test framework, milestone và rubric critical phù hợp. BC-01 đã đóng sau khi đọc gateway/harness/hướng dẫn nội bộ, đối chiếu 14/14 LiteSVM tests PASS và kiểm tra hash source/binary khớp manifest. Hai P3 biên tập Blockchain cũng đã sửa và được đọc lại. Không còn P1/P2 mở trong phạm vi các phát hiện của audit này; các giới hạn môi trường đích ở bảng dưới vẫn còn hiệu lực.

### P2 — DATA-01 — Đã sửa và kiểm tra lại source: content identity chứa commit revision

Nguồn: src/data/specializations/expanded/data.ts; bài data-release-project; localLab src/lib.rs, hàm publish/write_once.

Release directory dùng hash của phiên bản thuật toán và input. Manifest nằm trong release lại chứa revision của lần công bố. Chuỗi publish A(expected=0), B(expected=1), A(expected=2) quay lại cùng đường dẫn release A nhưng tạo manifest revision=3 khác manifest revision=1. write_once trả immutable_release_conflict. Đây là lỗi công bố lại dữ liệu/rollback hợp lệ, không phải giới hạn của khóa writer local.

Cách đóng: tách metadata nội dung bất biến khỏi metadata commit, hoặc tái dùng release A với manifest commit mới ở vị trí riêng. Thêm regression A→B→A, reader thấy A/revision mới, không sửa snapshot bất biến; giữ test retry A→A và stale writer. Đã đóng: source hiện tách ReleaseMetadata (algorithm/release/rows/source_sha256) khỏi root Manifest có revision; test returning_to_old_content_creates_a_new_revision_without_mutating_the_release kiểm tra A→B→A, metadata bất biến, revision3 và stale expected. Reviewer đã đọc lại mã; root xác nhận regression chạy PASS.

### P2 — AI-01 — Đã sửa và kiểm tra lại source: bằng chứng dự án không khớp kỹ năng tensor/gradient

Nguồn: expanded/ai.ts, assessment.skills ai-skill-1.

Kỹ năng yêu cầu affine, gradient, NaN và softmax nhưng projectIds chỉ trỏ ai-project-features. Feature gate kiểm tra dữ liệu và chuẩn hóa, không chứng minh autodiff hoặc softmax. Bằng chứng hiện có nằm ở ai-project-training (Burn, gradient tay/sai phân, MSE) và ai-project-serving (Candle, softmax ổn định).

Cách đóng: liên kết đúng hai dự án, dùng rubric kiểm tra gradient và xác suất hữu hạn/tổng xấp xỉ 1; giữ feature project cho năng lực schema/split. Đã đóng: skill-1 hiện liên kết ai-project-training và ai-project-serving; lessonIds bổ sung ai-training-project và ai-deployment-project. Reviewer đã đọc lại ma trận mới.

### P2 — DATA-02 — Đã bổ sung bằng chứng trong source: ma trận join/event-time/window thiếu bằng chứng dự án bắt buộc

Nguồn: expanded/data.ts, data-skill-3 và data-project-engine.

Kỹ năng nêu join cardinality, event-time/late-event và window aggregate. Baseline engine chỉ có region/amount, SUM/COUNT và nhiều partition. Milestones bắt reader, plan, tài nguyên và API có giới hạn; testCases chưa bắt join nhiều khớp, dữ liệu đến trễ hoặc biên cửa sổ. Rubric có chữ cardinality nhưng không có fixture buộc thể hiện các năng lực thời gian.

Cách đóng: bổ sung một milestone với schema sự kiện/thời gian, quy tắc join và late-event, expected tính tay, hai ca lỗi join nhân bản và window boundary; nối vào rubric critical. Có thể dùng bài/lab khác nếu chỉ rõ bằng chứng tương đương. Đã bổ sung trong source: milestone Join và thời gian có hợp đồng; test duplicate_dimension_keys_are_rejected_before_join, missing_dimension_does_not_silently_drop_facts, event_time_windows_preserve_boundaries_and_quarantine_late_data; fixture999/1000 và late-event500. Rubric engine-semantics critical yêu cầu các test này và engine-reference yêu cầu BTreeMap theo cùng arrival/watermark. Reviewer đã đọc test names, milestone và rubric; kết quả chạy framework do root lưu riêng.

### P2 — BC-01 — Đã đóng bằng source, fixture và bằng chứng SVM: runtime/CPI cần scaffold nội bộ

Nguồn: blockchain-cpi, blockchain-testing-release trong specialization gốc; expanded/blockchain.ts, blockchain-project-release và localLab RUNTIME-TEST-PLAN.md.

Ở bản được rà soát đầu tiên, lý thuyết signer/writable, PDA, invoke_signed, allowlist callee, reload sau CPI và các lớp kiểm thử rõ ràng, nhưng lab được cung cấp mới có host state machine/Anchor serialization/metadata/indexer. Release plan yêu cầu chọn LiteSVM hoặc Mollusk phù hợp, tạo account fixture, nạp SBF, chạy CPI/rollback/compute; chưa có dependency được chốt hoặc một runtime harness tối thiểu thực thi instruction để người học mở rộng. Dự án Anchor chỉ có initialize/submit/review/cancel, chưa có CPI nghiệp vụ tới một callee cần allowlist. Vì vậy yêu cầu skill-4 và rubric runtime chưa được nối đầy đủ bằng một ví dụ chạy được trong hệ thống.

Đã đóng sau đọc lại bản cuối:

- localLab có gateway/src/lib.rs, svm/Cargo.toml, svm/tests/runtime.rs, svm/README.md, scripts/run-svm.sh và scripts/svm-manifest.py. Dependency được pin, các bước cài tool/build/chạy/giải thích fixture đều trong hệ thống.
- Gateway yêu cầu operator ký, derive author PDA, ràng buộc proposal, dùng Program<ReviewProgram> để allowlist callee; CPI có signer seeds, reload và kiểm postcondition. Probe thiếu seeds giữ kiểm tra operator, chỉ dùng để chứng minh runtime chặn privilege escalation.
- Harness nạp hai ELF bằng add_program_from_file; thiếu binary làm test thất bại, không skip. Fee payer tách khỏi author. Fixture kiểm signer/owner/PDA/bump/readonly, reviewer, approve/reject/cancel/terminal, transaction rollback, CPI target/signature/reload, lỗi sau callee success và compute budget.
- Các test lỗi so sánh bytes trước/sau. Test hai instruction kiểm lỗi ở index 1 để chứng minh instruction đầu đã chạy; test lỗi sau CPI kiểm log callee success và lỗi probe đúng mã. Vì vậy đây là bằng chứng runtime, không chỉ helper trả Err.
- reports/course-expansion/blockchain-svm.json ghi build hai SBF thành công và 14 passed / 0 failed / 0 ignored, runtime 0,08 giây, process 975cc5b2-c2e8-493b-a0f0-c1a8196e1b25, exitCode 0. Phiên bản: Anchor 1.2.2, LiteSVM 0.16.0, cargo-build-sbf 4.6.0, platform-tools v1.58, sBPF v2; host rustc 1.99.1.
- Reviewer tự tính lại SHA-256 cho program/src/lib.rs, gateway/src/lib.rs và svm/tests/runtime.rs trong nội dung bài: cả ba khớp manifest. Hai artifact trên đĩa cũng khớp: review_program.so = ee1782c9f8479ab2292485b8716aad99bad6c681a7bb35b042e6776f1bba1640; review_gateway.so = d7583429d8b9e7d80724d9f7a014de9ea7536a03acce802b88adaa0e0f32eb53.

Phạm vi được chứng minh là fixture LiteSVM cục bộ trên hai binary đã ghi hash. CU 3.541 cho submit và 12.369 cho gateway+CPI thuộc đúng fixture/config này, không phải tuyên bố chi phí mainnet hay throughput sản phẩm. Luồng initialize/funding proposal dùng author PDA của gateway vẫn được ghi là mở rộng nghiệp vụ; không đánh đồng snapshot fixture với luồng khởi tạo sản phẩm hoàn chỉnh.

### P3 — Biên tập Blockchain — Đã sửa

- blockchain-anchor-project hiện nói baseline đã có cancel và chuyển yêu cầu mở rộng sang event có version/decoder tương thích; reviewer đã đọc lại Mốc hoàn thiện chương trình.
- blockchain-release-project hiện mô tả đúng thứ tự owner/length/discriminator → decode có kiểm soát → quan hệ author/reviewer/document ID/status/PDA/bump → chấp nhận snapshot. Trường vừa giải mã chưa được dùng để quyết định quyền; reviewer đã đọc lại phần Decoder kiểm tra cả metadata lẫn bytes.

## Ma trận năng lực và phạm vi bằng chứng

| Khóa | Năng lực → bài | Bằng chứng dự án/rubric | Chưa được bằng chứng hiện có bảo đảm |
|---|---|---|---|
| Data | Ingestion/chất lượng → data-ingestion, data-quality-project; null/plan/partition → data-expressions, data-query-plans, data-query-project; công bố → data-reproducibility, data-release-project | CSV quoting/dedup/overflow, Arrow/DataFusion với null và multi-partition, Polars tổng hợp, manifest/local writer lock, stale revision/retry. Rubric correctness/reference/atomicity/recovery khá cụ thể. | DATA-01 đã sửa; join/time/window đã có test/milestone/rubric bổ sung.  Cần failpoint thật, reader tệp, benchmark có plan/cấu hình; object store/distributed concurrency, spill/skew lớn, storage durability và CDC production chưa nghiệm thu. |
| AI | Hợp đồng/fit-transform → ai-feature-contract, ai-data-project; gradient/tối ưu → ai-linear-algebra, ai-optimization, ai-training-project; artifact/admission → ai-artifacts, ai-batching, ai-deployment-project | Dữ liệu hữu hạn, split theo ID, train-only normalization; Burn Flex CPU autodiff và sai phân; Candle CPU, SafeTensors, SHA256, softmax, queue/deadline/version. Rubric phân biệt quality với reproducibility. | AI-01 mapping đã sửa; parser/manifest, minibatch và resume/checkpoint là phần học viên phải hoàn thiện; HTTP/microbatch/metrics/retrieval adapter chưa là baseline. Không chứng minh chất lượng tập dữ liệu thật, GPU parity/performance, load/SLO hay vận hành model drift. |
| Blockchain | Account/PDA → blockchain-trust-boundaries, blockchain-authority, blockchain-registry-project; trạng thái/quyền → blockchain-state-machines, blockchain-anchor-project; index/release → blockchain-indexing, blockchain-release-project | solana-pubkey PDA thật, Anchor state/serialization/metas và indexer fixture; hai SBF đã build, 14/14 LiteSVM tests thực thi account constraints, quyền, CPI/PDA signer/reload, rollback và compute. Source/binary hash khớp manifest; rubric gắn fixture cụ thể. | BC-01 đã đóng trong phạm vi VM cục bộ. Cần thêm luồng initialize/funding qua gateway, migration/upgrade rehearsal, RPC finality/reconnect, persistence/checkpoint indexer, IDL tương ứng và nghiệm thu cluster đích. Không suy ra đã audit smart contract hoặc an toàn tài sản thật. |
| Embedded | Bus/driver → embedded-board-contract, embedded-driver-project; giao nhận → embedded-telemetry-project; health/journal → embedded-config-journal, embedded-station-project | no_std + embedded-hal 1.0, fake kiểm tra address/register/order, signed endian/NotReady/bus error; CRC vector, ACK cũ, queue trần/sequence hết; hysteresis/stale health và mọi prefix ghi dở của journal byte model. | Không phải driver datasheet của cảm biến thương mại. Chunk parser/timeout/session qua reset và transport là phần mở rộng. Journal RAM không mô phỏng erase/write granularity, wear/cache/power-loss vật lý. Cần target build, HAL/board pin map, timing/ISR/DMA, RAM/stack, watchdog/reset, flash và điện năng thực đo. |

## Nhận xét hướng dẫn và tiêu chí

1. Các hợp đồng đơn vị, schema, quyền, version, overflow và trạng thái lỗi được viết trong bài. Việc sử dụng nguồn chính thức ở bibliography không buộc người học ra ngoài để đọc kiến thức cốt lõi.
2. Dự án đều có ít nhất bốn nhóm rubric và nhiều ca lỗi có expected rõ. Học viên không nên chỉ tích ô hoàn thành: cần đưa đường dẫn test, fixture, output và giải thích vào bằng chứng tự review.
3. Một số baseline cố ý để việc mở rộng cho học viên, phù hợp dự án độc lập/capstone. Khi một năng lực là điều kiện critical, đề bài vẫn phải có hợp đồng và điểm bắt đầu đủ rõ; BC-01 hiện đã có scaffold, hướng dẫn và runtime fixture đáp ứng mức này.
4. Embedded phân biệt host/target/hardware rõ và cho ghi chưa chạy. AI cũng phân biệt CPU với GPU; Blockchain phân biệt host với SVM. Đây là giới hạn nghiệm thu hợp lý, không nên thay bằng tuyên bố sẵn sàng sản xuất.
5. DATA-01/AI-01/DATA-02 đã được đọc lại ở mức source; BC-01 được kiểm tra source cùng báo cáo SVM và hash artifact. Mọi bước ngoài phạm vi bằng chứng đã ghi vẫn giữ trạng thái chưa nghiệm thu; audit không xác nhận năng lực hoặc môi trường chưa được quan sát.

## Nguồn kiểm tra

Nguồn trực tiếp: src/data/specializations/{data,ai,blockchain,embedded}.ts; src/data/specializations/expanded/{data,ai,blockchain,embedded}.ts; reports/course-expansion/{data,ai,blockchain,embedded}.md. Các nhận định về mã dựa trên localLab được nhúng trong các bài đã chỉ tên ở trên. Bằng chứng Blockchain bổ sung từ reports/course-expansion/blockchain-svm.json và hai artifact work/course-labs/blockchain-release-project/target/deploy/{review_program,review_gateway}.so; reviewer đã đối chiếu hash. Không suy diễn kết quả chạy chỉ từ việc mã có test.

Các framework/crate được kiểm tra trong source: DataFusion 55.2.0, Polars 0.55.2, Burn 0.22.1 Flex CPU, Candle 0.11.1 CPU, solana-pubkey 4.4.0, Anchor 1.2.2 và embedded-hal 1.0.0. Phiên bản/target thực thi cuối cùng cần đối chiếu báo cáo tích hợp của root và Cargo.lock được tạo cho từng lab.
