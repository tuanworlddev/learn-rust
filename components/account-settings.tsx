"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CloudDownload, CloudUpload, LogOut } from "lucide-react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { accountError, getBrowserSupabase } from "@/lib/supabase/client";
import { parseCloudSnapshot, parseProgressSnapshot, SNAPSHOT_VERSION, type CloudSnapshot, type ProgressSnapshot } from "@/lib/supabase/snapshot.mjs";
import styles from "./account-settings.module.css";

type Props = { getSnapshot: () => unknown; onRestore: (snapshot: unknown) => void };
type Notice = { text: string; error?: boolean };

export default function AccountSettings({ getSnapshot, onRestore }: Props) {
  const id = useId();
  const alive = useRef(true);
  const userId = useRef<string | null>(null);
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [preview, setPreview] = useState<CloudSnapshot | null>(null);
  const [pendingSave, setPendingSave] = useState<{ snapshot: ProgressSnapshot; previous: CloudSnapshot } | null>(null);

  useEffect(() => {
    alive.current = true;
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    void (async () => {
      try {
        const configured = await getBrowserSupabase();
        if (!configured || cancelled) return;
        const { data: listener } = configured.auth.onAuthStateChange((_event, next) => {
          if (cancelled) return;
          if (userId.current !== (next?.user.id ?? null)) {
            setPreview(null);
            setPendingSave(null);
            setNotice(null);
          }
          userId.current = next?.user.id ?? null;
          setSession(next);
        });
        unsubscribe = () => listener.subscription.unsubscribe();
        const { data, error } = await configured.auth.getSession();
        if (cancelled) return;
        setClient(configured);
        if (!error) {
          userId.current = data.session?.user.id ?? null;
          setSession(data.session);
        }
      } catch {
        // Account features are optional; local learning remains available.
      }
    })();
    return () => {
      cancelled = true;
      alive.current = false;
      unsubscribe?.();
    };
  }, []);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || busy) return;
    setBusy(true);
    setNotice(null);
    try {
      const credentials = { email: email.trim(), password };
      const { data, error } = mode === "signin"
        ? await client.auth.signInWithPassword(credentials)
        : await client.auth.signUp({ ...credentials, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
      if (!alive.current) return;
      if (error) {
        setNotice({ text: accountError(error, mode === "signin" ? "Chưa thể đăng nhập. Vui lòng thử lại." : "Chưa thể đăng ký. Vui lòng thử lại."), error: true });
      } else {
        setPassword("");
        setNotice({ text: data.session ? "Đã đăng nhập." : "Kiểm tra email để xác nhận tài khoản." });
      }
    } catch {
      if (alive.current) setNotice({ text: "Không thể kết nối. Vui lòng thử lại.", error: true });
    } finally {
      if (alive.current) setBusy(false);
    }
  }

  async function signOut() {
    if (!client || busy) return;
    setBusy(true);
    setNotice(null);
    try {
      const { error } = await client.auth.signOut({ scope: "local" });
      if (!alive.current) return;
      if (error) setNotice({ text: "Chưa thể đăng xuất. Vui lòng thử lại.", error: true });
      else {
        setSession(null);
        setPreview(null);
        setPendingSave(null);
        setPassword("");
      }
    } catch {
      if (alive.current) setNotice({ text: "Chưa thể đăng xuất. Vui lòng thử lại.", error: true });
    } finally {
      if (alive.current) setBusy(false);
    }
  }

  async function writeSnapshot(snapshot: ProgressSnapshot, owner: string, expectedUpdatedAt: string | null) {
    if (!client) return;
    const values = { snapshot, version: SNAPSHOT_VERSION };
    const query = expectedUpdatedAt === null
      ? client.from("learning_progress").insert({ user_id: owner, ...values }).select("updated_at").abortSignal(AbortSignal.timeout(15000)).single()
      : client.from("learning_progress").update(values).eq("user_id", owner).eq("updated_at", expectedUpdatedAt).select("updated_at").abortSignal(AbortSignal.timeout(15000)).maybeSingle();
    const { data, error } = await query;
    if (!alive.current || userId.current !== owner) return;
    if (error?.code === "23505" || (!error && !data)) {
      setNotice({ text: "Bản lưu đã thay đổi trên thiết bị khác. Hãy bấm Lưu tiến độ để xem lại.", error: true });
    } else if (error) {
      setNotice({ text: "Chưa lưu được tiến độ. Vui lòng thử lại.", error: true });
    } else {
      setNotice({ text: "Đã lưu tiến độ vào tài khoản." });
    }
  }

  async function saveProgress() {
    if (!client || !session || busy) return;
    const snapshot = parseProgressSnapshot(getSnapshot());
    if (!snapshot) {
      setNotice({ text: "Tiến độ quá lớn hoặc chưa hợp lệ để lưu. Hãy tải bản sao trước.", error: true });
      return;
    }
    const owner = session.user.id;
    setBusy(true);
    setNotice(null);
    setPreview(null);
    setPendingSave(null);
    try {
      const { data, error } = await client.from("learning_progress")
        .select("snapshot,version,updated_at").eq("user_id", owner)
        .abortSignal(AbortSignal.timeout(15000)).maybeSingle();
      if (!alive.current || userId.current !== owner) return;
      if (error) setNotice({ text: "Chưa đọc được bản lưu. Vui lòng thử lại.", error: true });
      else if (data) {
        const previous = parseCloudSnapshot(data);
        if (previous) setPendingSave({ snapshot, previous });
        else setNotice({ text: "Bản lưu chưa hợp lệ. Chưa thay đổi dữ liệu tài khoản.", error: true });
      } else await writeSnapshot(snapshot, owner, null);
    } catch {
      if (alive.current && userId.current === owner) setNotice({ text: "Chưa lưu được tiến độ. Vui lòng thử lại.", error: true });
    } finally {
      if (alive.current) setBusy(false);
    }
  }

  async function confirmSave() {
    if (!session || !pendingSave || busy || userId.current !== session.user.id) return;
    const owner = session.user.id;
    setBusy(true);
    setNotice(null);
    try {
      await writeSnapshot(pendingSave.snapshot, owner, pendingSave.previous.updatedAt);
    } catch {
      if (alive.current && userId.current === owner) setNotice({ text: "Chưa lưu được tiến độ. Vui lòng thử lại.", error: true });
    } finally {
      if (alive.current) { setBusy(false); setPendingSave(null); }
    }
  }

  async function loadPreview() {
    if (!client || !session || busy) return;
    const owner = session.user.id;
    setBusy(true);
    setNotice(null);
    setPreview(null);
    setPendingSave(null);
    try {
      const { data, error } = await client.from("learning_progress")
        .select("snapshot,version,updated_at").eq("user_id", owner)
        .abortSignal(AbortSignal.timeout(15000)).maybeSingle();
      if (!alive.current || userId.current !== owner) return;
      if (error) setNotice({ text: "Chưa tải được tiến độ. Vui lòng thử lại.", error: true });
      else if (!data) setNotice({ text: "Tài khoản chưa có tiến độ đã lưu." });
      else {
        const saved = parseCloudSnapshot(data);
        if (saved) setPreview(saved);
        else setNotice({ text: "Bản lưu chưa hợp lệ. Tiến độ hiện tại vẫn được giữ.", error: true });
      }
    } catch {
      if (alive.current && userId.current === owner) setNotice({ text: "Chưa tải được tiến độ. Vui lòng thử lại.", error: true });
    } finally {
      if (alive.current) setBusy(false);
    }
  }

  function restoreProgress() {
    if (!preview || !session || busy || userId.current !== session.user.id) return;
    try {
      onRestore(preview.snapshot);
      setPreview(null);
      setNotice({ text: "Đã khôi phục tiến độ." });
    } catch {
      setNotice({ text: "Chưa khôi phục được tiến độ. Vui lòng thử lại.", error: true });
    }
  }

  if (!client) return null;

  return <section className={styles.account} aria-labelledby={`${id}-title`} aria-busy={busy}>
    <div className={styles.heading}>
      <h3 id={`${id}-title`}>Tài khoản</h3>
      {session && <button type="button" className={styles.signOut} onClick={signOut} disabled={busy}><LogOut size={14} aria-hidden="true" />Đăng xuất</button>}
    </div>
    {session ? <>
      <p className={styles.email}>{session.user.email}</p>
      <div className={styles.actions}>
        <button type="button" className="button button-secondary" onClick={saveProgress} disabled={busy}><CloudUpload size={16} aria-hidden="true" />Lưu tiến độ</button>
        <button type="button" className="button button-secondary" onClick={loadPreview} disabled={busy}><CloudDownload size={16} aria-hidden="true" />Khôi phục</button>
      </div>
      {pendingSave && <div className={styles.preview}>
        <h4>Thay bản lưu trên tài khoản?</h4>
        <p>Bản lưu ngày {new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(pendingSave.previous.updatedAt))}: {pendingSave.previous.snapshot.completed.length} bài học, {pendingSave.previous.snapshot.notes.length} ký tự ghi chú.</p>
        <p>Thiết bị này: {pendingSave.snapshot.completed.length} bài học, {pendingSave.snapshot.notes.length} ký tự ghi chú.</p>
        <p>Tiến độ và ghi chú trên tài khoản sẽ được thay thế.</p>
        <div className={styles.actions}>
          <button type="button" className="button button-secondary" onClick={() => setPendingSave(null)} disabled={busy}>Hủy</button>
          <button type="button" className="button button-primary" onClick={confirmSave} disabled={busy}>{busy ? "Đang lưu…" : "Lưu thay thế"}</button>
        </div>
      </div>}
      {preview && <div className={styles.preview}>
        <h4>Bản lưu ngày {new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(preview.updatedAt))}</h4>
        <p>{preview.snapshot.completed.length} bài học · {preview.snapshot.solved.length} bài tập · {preview.snapshot.finishedProjects.length} dự án</p>
        <p>Thay tiến độ và ghi chú hiện tại bằng bản lưu này?</p>
        <div className={styles.actions}>
          <button type="button" className="button button-secondary" onClick={() => setPreview(null)}>Hủy</button>
          <button type="button" className="button button-primary" onClick={restoreProgress}>Khôi phục tiến độ</button>
        </div>
      </div>}
    </> : <form onSubmit={authenticate} className={styles.form}>
      <label htmlFor={`${id}-email`}>Email</label>
      <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} disabled={busy} />
      <label htmlFor={`${id}-password`}>Mật khẩu</label>
      <input id={`${id}-password`} name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required minLength={mode === "signup" ? 8 : 1} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} disabled={busy} />
      <div className={styles.actions}>
        <button className="button button-primary" type="submit" disabled={busy}>{busy ? "Đang xử lý…" : mode === "signin" ? "Đăng nhập" : "Đăng ký"}</button>
        <button className={styles.switchMode} type="button" disabled={busy} onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setNotice(null); setPassword(""); }}>{mode === "signin" ? "Tạo tài khoản" : "Đã có tài khoản"}</button>
      </div>
    </form>}
    {notice && <p className={`${styles.notice} ${notice.error ? styles.error : ""}`} role={notice.error ? "alert" : "status"}>{notice.text}</p>}
  </section>;
}
