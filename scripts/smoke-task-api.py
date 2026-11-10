"""Exercise the compiled lab over real loopback HTTP, using an isolated database.

Run from the repository root after `cargo build --manifest-path labs/task-api/Cargo.toml`.
Only the two child processes created here are stopped. No existing server is touched.
"""

import json
import os
import re
import signal
import subprocess
import tempfile
import time
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
BINARY = ROOT / "labs/task-api/target/debug/learn-rust-task-api"
checks = []


def request(base, method, path, expected, payload=None):
    data = None if payload is None else json.dumps(payload).encode()
    req = Request(base + path, data=data, method=method)
    if data is not None:
        req.add_header("Content-Type", "application/json")
    try:
        response = urlopen(req, timeout=12)
    except HTTPError as error:
        response = error
    with response:
        status, body = response.status, response.read()
    assert status == expected, (method, path, status, body.decode())
    checks.append({"method": method, "path": path, "status": status})
    return json.loads(body) if body else None


def start_server(directory, run):
    log_path = directory / f"server-{run}.log"
    stream = log_path.open("w")
    env = dict(os.environ, TASK_API_PORT="0", TASK_API_DB=str(directory / "test.db"), RUST_LOG="info")
    process = subprocess.Popen([str(BINARY)], cwd=ROOT, env=env, stdout=stream, stderr=subprocess.STDOUT)
    try:
        for _ in range(100):
            if process.poll() is not None:
                raise RuntimeError(log_path.read_text())
            log = re.sub(r"\x1b\[[0-9;]*m", "", log_path.read_text())
            match = re.search(r"127\.0\.0\.1:(\d+)", log)
            if match:
                return process, stream, f"http://127.0.0.1:{match.group(1)}", log_path
            time.sleep(0.05)
        raise TimeoutError("Lab did not bind its loopback port")
    except BaseException:
        stop_server(process, stream)
        raise


def stop_server(process, stream):
    if process.poll() is None:
        process.send_signal(signal.SIGTERM)
        try:
            process.wait(timeout=12)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=3)
            raise
    stream.close()
    assert process.returncode == 0, process.returncode


if __name__ == "__main__":
    if not BINARY.is_file():
        raise SystemExit("Build the lab first: cargo build --locked --manifest-path labs/task-api/Cargo.toml")
    with tempfile.TemporaryDirectory(prefix="learn-rust-http-") as tmp:
        directory = Path(tmp)
        process, stream, base, log = start_server(directory, 1)
        try:
            request(base, "GET", "/health", 200)
            task = request(base, "POST", "/tasks", 201, {"title": "  Học Rust qua HTTP thật  "})
            assert task["title"] == "Học Rust qua HTTP thật"
            task_id = task["id"]
            page = request(base, "GET", "/tasks?limit=1&after=0", 200)
            assert page["items"][0]["id"] == task_id
            updated = request(base, "PATCH", f"/tasks/{task_id}", 200, {"done": True})
            assert updated["done"] is True
            request(base, "POST", "/tasks", 400, {"title": "  "})
        finally:
            stop_server(process, stream)
        assert "shutdown complete" in log.read_text()
        checks.append({"check": "SIGTERM exits cleanly and closes pool", "passed": True})

        process, stream, base, log = start_server(directory, 2)
        try:
            restored = request(base, "GET", f"/tasks/{task_id}", 200)
            assert restored["done"] is True and restored["title"] == task["title"]
            checks.append({"check": "Persisted data survives process restart", "passed": True})
            request(base, "DELETE", f"/tasks/{task_id}", 204)
            request(base, "GET", f"/tasks/{task_id}", 404)
        finally:
            stop_server(process, stream)
        assert "shutdown complete" in log.read_text()

    report = {"allPassed": True, "method": "Real loopback HTTP; isolated temporary SQLite file; two owned server processes; SIGTERM and restart.", "checks": checks}
    output = ROOT / "reports/task-api-http-validation.json"
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(report, ensure_ascii=False))
