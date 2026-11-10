"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/client";
import styles from "./account-settings.module.css";

async function completeConfirmation() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const hasError = url.searchParams.has("error");
  // Remove the one-time code before navigating or loading any other page.
  window.history.replaceState(window.history.state, "", "/auth/callback");
  const client = await getBrowserSupabase();
  if (!client) return "disabled";
  if (hasError || !code || code.length > 2048) return "error";
  const { error } = await client.auth.exchangeCodeForSession(code);
  return error ? "error" : "success";
}

export default function AuthCallback() {
  const router = useRouter();
  const task = useRef<ReturnType<typeof completeConfirmation> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    task.current ??= completeConfirmation();
    void task.current.then(result => {
      if (cancelled) return;
      if (result === "error") setFailed(true);
      else router.replace("/");
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [router]);

  return <main className={styles.callback}>
    <section className={styles.callbackCard}>
      <h1>{failed ? "Xác nhận tài khoản" : "Đang xác nhận…"}</h1>
      <p role={failed ? "alert" : "status"}>{failed
        ? "Chưa hoàn tất đăng nhập. Hãy mở liên kết trong trình duyệt đã đăng ký, hoặc đăng nhập lại."
        : "Vui lòng chờ trong giây lát."}</p>
      {failed && <Link className="button button-primary" href="/">Về bài học</Link>}
    </section>
  </main>;
}
