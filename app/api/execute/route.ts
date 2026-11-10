const PLAYGROUND_URL = "https://play.rust-lang.org/execute";
const MAX_CODE_BYTES = 40_960;
const MAX_REQUEST_BYTES = 60_000;

function reply(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  const failure = (error: string, status: number) => reply({
    success: false, stdout: "", stderr: "", elapsedMs: Date.now() - startedAt, error,
  }, status);

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_REQUEST_BYTES) {
    return failure("Mã quá dài. Vui lòng giới hạn bài thực hành trong 40 KB.", 413);
  }

  let body: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return failure("Vui lòng gửi mã Rust cần chạy.", 400);
    const decoder = new TextDecoder();
    let raw = "";
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_REQUEST_BYTES) {
        await reader.cancel();
        return failure("Mã quá dài. Vui lòng giới hạn bài thực hành trong 40 KB.", 413);
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
    body = JSON.parse(raw);
  } catch {
    return failure("Dữ liệu không hợp lệ. Vui lòng thử chạy lại.", 400);
  }

  const code = body && typeof body === "object" && "code" in body
    ? (body as { code: unknown }).code : undefined;
  if (typeof code !== "string" || !code.trim()) {
    return failure("Hãy viết một đoạn mã Rust trước khi chạy.", 400);
  }
  if (new TextEncoder().encode(code).byteLength > MAX_CODE_BYTES) {
    return failure("Mã quá dài. Vui lòng giới hạn bài thực hành trong 40 KB.", 413);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const upstream = await fetch(PLAYGROUND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        channel: "stable", mode: "debug", edition: "2024", crateType: "bin",
        tests: false, code, backtrace: false,
      }),
      signal: controller.signal,
    });
    if (!upstream.ok) {
      return failure(upstream.status === 429
        ? "Rust Playground đang nhận nhiều yêu cầu. Hãy đợi một chút rồi thử lại."
        : "Chưa kết nối được với Rust Playground. Hãy thử lại hoặc mở mã trong Playground.", 502);
    }
    const result = await upstream.json() as {
      success?: unknown; stdout?: unknown; stderr?: unknown; error?: unknown;
    };
    if (typeof result.success !== "boolean") {
      return failure("Dịch vụ biên dịch trả về dữ liệu chưa hợp lệ. Vui lòng thử lại.", 502);
    }
    return reply({
      success: result.success,
      stdout: typeof result.stdout === "string" ? result.stdout : "",
      stderr: typeof result.stderr === "string" ? result.stderr : "",
      elapsedMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error("[rust-playground] execution unavailable:", error instanceof Error ? error.message : "Unknown upstream error");
    return failure(controller.signal.aborted
      ? "Quá thời gian chờ 25 giây. Hãy kiểm tra vòng lặp hoặc thử chạy lại."
      : "Không thể kết nối dịch vụ biên dịch. Mã của bạn vẫn được giữ trong trình soạn thảo.", 503);
  } finally {
    clearTimeout(timer);
  }
}
