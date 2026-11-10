import { readSupabaseConfig } from "../lib/supabase/config.mjs";

async function check() {
  const config = readSupabaseConfig();
  if (!config.enabled) {
    if (config.reason === "missing") {
      console.log("Supabase chưa cấu hình; tính năng tài khoản đang tắt.");
      return;
    }
    throw new Error("Cấu hình Supabase chưa hợp lệ. Kiểm tra SUPABASE_URL và publishable key (hoặc anon key).");
  }
  const headers = { apikey: config.publishableKey };
  // The legacy JWT can also be used as Authorization; publishable keys are not JWTs.
  if (!config.publishableKey.startsWith("sb_publishable_")) headers.Authorization = `Bearer ${config.publishableKey}`;
  let auth;
  try {
    auth = await fetch(`${config.url}/auth/v1/settings`, {
      headers, signal: AbortSignal.timeout(10000), redirect: "error",
    });
  } catch {
    throw new Error("Không kết nối được Supabase Auth. Kiểm tra URL, mạng và trạng thái project.");
  }
  if (!auth.ok) throw new Error(`Supabase Auth trả HTTP ${auth.status}. Kiểm tra URL và public key.`);
  const settings = await auth.json();
  if (!settings || typeof settings !== "object" || !settings.external || typeof settings.external !== "object") {
    throw new Error("Auth endpoint không trả cấu hình Supabase hợp lệ.");
  }
  console.log("OK: URL và public key kết nối được Supabase Auth.");
  if (settings.external.email !== true) throw new Error("Email Auth đang tắt. Bật Email trong Authentication > Providers.");
  console.log("OK: Email Auth đã bật.");

  let progress;
  try {
    progress = await fetch(`${config.url}/rest/v1/learning_progress?select=user_id&limit=0`, {
      headers, signal: AbortSignal.timeout(10000), redirect: "error",
    });
  } catch {
    throw new Error("Không kết nối được Data API. Kiểm tra trạng thái project và Data API.");
  }
  const body = await progress.json().catch(() => null);
  if ((progress.status === 401 || progress.status === 403) && body?.code === "42501") {
    console.log("OK: Data API từ chối truy cập bảng tiến độ khi chưa đăng nhập.");
    console.log("Cần kiểm thử tiếp với hai tài khoản để xác nhận RLS; xem docs/supabase.md.");
    return;
  }
  if (progress.status === 404 || body?.code === "PGRST205") {
    throw new Error("Chưa tìm thấy bảng learning_progress. Chạy migration trong supabase/migrations/.");
  }
  if (progress.ok) {
    throw new Error("Quyền bảng chưa khớp migration: yêu cầu ẩn danh đọc được endpoint. Kiểm tra lại GRANT/REVOKE và RLS.");
  }
  throw new Error(`Data API trả HTTP ${progress.status}. Kiểm tra migration và quyền bảng.`);
}

try {
  await check();
} catch (error) {
  // All emitted errors are authored above; never emit a remote response or a key.
  const message = error instanceof Error && !["SyntaxError", "TypeError"].includes(error.name)
    ? error.message : "Chưa kiểm tra được Supabase. Xem lại cấu hình và kết nối.";
  console.error(message);
  process.exitCode = 1;
}
