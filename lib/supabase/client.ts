"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;
let pending: Promise<SupabaseClient | null> | null = null;

export async function getBrowserSupabase(): Promise<SupabaseClient | null> {
  if (client) return client;
  if (pending) return pending;
  pending = (async () => {
    const response = await fetch("/api/public-config", {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    const config: unknown = await response.json();
    if (!config || typeof config !== "object" || !("enabled" in config) || config.enabled !== true) return null;
    if (!("url" in config) || typeof config.url !== "string" || !("publishableKey" in config) || typeof config.publishableKey !== "string") return null;
    const url = new URL(config.url);
    if (url.origin !== config.url || url.username || url.password || url.search || url.hash) return null;
    if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))) return null;
    client = createClient(config.url, config.publishableKey, {
      auth: {
        flowType: "pkce",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
    return client;
  })();
  try {
    return await pending;
  } finally {
    pending = null;
  }
}

export function accountError(error: unknown, fallback: string): string {
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  switch (code) {
    case "invalid_credentials": return "Email hoặc mật khẩu chưa đúng.";
    case "email_not_confirmed": return "Hãy xác nhận email trước khi đăng nhập.";
    case "weak_password": return "Mật khẩu chưa đủ mạnh. Hãy chọn mật khẩu dài hơn.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit": return "Bạn đã thử nhiều lần. Vui lòng đợi rồi thử lại.";
    case "signup_disabled": return "Đăng ký đang tạm đóng. Bạn vẫn có thể đăng nhập.";
    case "user_already_exists": return "Hãy đăng nhập bằng email này.";
    default: return fallback;
  }
}
