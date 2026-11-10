#!/usr/bin/env node
import { access, cp, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import nextEnv from "@next/env";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
nextEnv.loadEnvConfig(root, false);
const args = process.argv.slice(2);
let port = process.env.PORT || "3000";
if (args.length) {
  if (args.length !== 2 || !["--port", "-p"].includes(args[0])) {
    console.error("Cách dùng: npm run start:local -- --port 3000");
    process.exit(1);
  }
  port = args[1];
}
if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
  console.error("Cổng phải nằm trong khoảng 1–65535.");
  process.exit(1);
}

const standalone = join(root, ".next/standalone");
const server = join(standalone, "server.js");
try {
  await access(server);
  await mkdir(join(standalone, ".next"), { recursive: true });
  await cp(join(root, ".next/static"), join(standalone, ".next/static"), { recursive: true, force: true });
  await cp(join(root, "public"), join(standalone, "public"), { recursive: true, force: true });
} catch {
  console.error("Chưa có bản build hoàn chỉnh. Chạy npm run build:local trước.");
  process.exit(1);
}

const child = spawn(process.execPath, [server], {
  cwd: standalone,
  env: { ...process.env, NODE_ENV: "production", HOSTNAME: "127.0.0.1", PORT: port },
  stdio: "inherit",
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("error", () => { console.error("Không khởi động được máy chủ local."); process.exitCode = 1; });
child.on("exit", code => { process.exitCode = code ?? 0; });
