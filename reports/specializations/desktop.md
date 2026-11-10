# Desktop specialization review

Reviewed: 2026-11-11 (Vietnam). Author: dedicated desktop/Tauri research agent.

## Deliverable

`src/data/specializations/desktop.ts` exports `desktopBundle`: six fully written Vietnamese lessons, six browser exercises, two Cargo labs, one capstone with five measurable milestones, and primary references.

| Lesson | Teaching text | Browser exercise |
| --- | ---: | --- |
| Tauri: ranh giới giữa giao diện và Rust | 518 words | Unicode-aware title contract |
| Trạng thái, tác vụ nền và kết quả đến muộn | 568 words | Optimistic revision check without partial mutation |
| Tệp, hộp thoại và phạm vi truy cập | 549 words | Narrow ASCII export-name policy |
| Capability, CSP và nội dung không đáng tin | 554 words | Explicit allow/deny teaching model |
| Đóng gói, ký ứng dụng và cập nhật | 558 words | Update offer for target, channel and state |
| Kiểm thử, hiệu năng và trải nghiệm desktop | 573 words | Bounded list virtualization window |

The word counts cover section prose only. Each lesson also has objectives, relevant snippets, exercise requirements, deterministic assertions, hints, a quiz and an explanation.

## Technical decisions

- The native title lab pins `tauri = 2.12.5` and `tauri-build = 2.7.4`, the versions observed in official crate documentation during review. It uses local HTML/JavaScript assets and a Rust command, without a frontend package manager.
- The title command is included in `AppManifest::commands`; a named permission grants it only to the `main` window. The lab includes a CSP and grants no filesystem, shell or remote-origin permissions.
- The second lab uses only the Rust standard library. A bounded worker channel carries generation IDs; an outdated result is discarded. Closing input drains already accepted work. The lab does not claim to cancel work already executing.
- Browser exercises teach the domain decisions, not native window creation, operating-system isolation, file access or software updates.
- The filename exercise is deliberately a narrow ID-to-leaf-name policy. The lesson explicitly distinguishes it from a portable filename validator, symlink defense and filesystem sandbox.
- The version exercise compares three numeric components for stable releases. It does not claim to implement full SemVer parsing or artifact signature verification.
- Updater signatures are distinguished from operating-system code signing and macOS notarization.
- The current official WebDriver documentation supports macOS with the embedded WebdriverIO Tauri service. Direct `tauri-driver` still has a different platform matrix. The lesson avoids the stale blanket claim that Tauri UI testing cannot run on macOS.

## Verification actually performed

Initial source validation:

- TypeScript transpilation of the owned file: **0 syntax diagnostics**.
- Strict TypeScript diagnostics attributed to the owned file: **0**.
- Shared course catalog validator: **PASS**, six lessons and two local labs.
- All JSON files embedded in local labs parsed successfully.
- Manual review covered Unicode length, empty inputs, stale revision, revision overflow with no mutation, rejected filename characters, deny precedence, unknown windows/actions, target/channel mismatches, dirty-document gating, empty list and arithmetic overflow.

Recovery validation on the actual Mac:

- Reconstructed the complete authored material from the agent history after the cloud environment was lost. Section prose and counts are retained; the TypeScript object now uses JSON-style formatting.
- Wrote only `src/data/specializations/desktop.ts` and this report, with `overwrite:false`; no existing repository files were replaced.
- Repeated TypeScript syntax, strict owned-file diagnostics, catalog validation and embedded JSON parsing: **PASS**.
- Compiled all **6 browser solutions** with `rustc --edition=2024`; all assertions passed and stdout matched each lesson's `expectedOutput`.
- Compiled the dependency-free worker lab with `rustc --edition=2024 --test`; **2 tests passed**.
- Temporary test sources and binaries were removed after the run.

Desktop source SHA-256 at recovery: `bbde05c144110dfbfedf7d2b4b612b077234f388bc4fda7b246f2416da81b341` (60,444 UTF-8 bytes).

The native Tauri title lab has not been compiled or opened as a window in this agent's validation. It additionally requires Tauri prerequisites for the host OS and a real window check for IPC/CSP/capability behavior. OS signing, packaging and updater installation have not been exercised. No artifact has been signed or published by this agent.

## Primary sources

The content is original teaching material based on the API facts below; design exercises and acceptance criteria are author-created.

- [Tauri architecture](https://v2.tauri.app/concept/architecture/): frontend/native separation.
- [Calling Rust](https://v2.tauri.app/develop/calling-rust/): command argument/return serialization and Result behavior.
- [State management](https://v2.tauri.app/develop/state-management/): registered state and interior mutability.
- [Capabilities](https://v2.tauri.app/security/capabilities/): window applicability, combined capability exposure, custom command defaults and remote access.
- [AppManifest API, tauri-build 2.7.4](https://docs.rs/tauri-build/2.7.4/tauri_build/struct.AppManifest.html): command manifest and permission generation.
- [Tauri 2.12.5](https://docs.rs/tauri/2.12.5/tauri/): pinned native framework version.
- [Configuration](https://v2.tauri.app/reference/config/): local frontend distribution, withGlobalTauri and security configuration.
- [File System](https://v2.tauri.app/plugin/file-system/): plugin scope and separate Rust file APIs.
- [Dialog](https://v2.tauri.app/plugin/dialog/): native file selection and cancellation.
- [Content Security Policy](https://v2.tauri.app/security/csp/): configured CSP and build-time hashes/nonces.
- [Distribute](https://v2.tauri.app/distribute/): platform packaging and distribution.
- [macOS signing](https://v2.tauri.app/distribute/sign/macos/): platform signing/notarization workflow.
- [Updater](https://v2.tauri.app/plugin/updater/): mandatory update signatures and production transport.
- [Mock Tauri APIs](https://v2.tauri.app/develop/tests/mocking/): renderer tests with mocked native calls.
- [WebDriver](https://v2.tauri.app/develop/tests/webdriver/): embedded service and direct-driver platform distinctions.
- [Prerequisites](https://v2.tauri.app/start/prerequisites/): host compiler/WebView requirements.
