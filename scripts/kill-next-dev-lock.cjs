/**
 * Fuerza cierre del dev server de Next registrado en .next/dev/lock y borra el lock.
 * Usar cuando ves: "Another next dev server is already running".
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const lockPath = path.join(__dirname, "..", ".next", "dev", "lock");

function killPid(pid) {
  if (!pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(pid), "/F"], { stdio: "ignore", shell: true });
  } else {
    try {
      process.kill(pid, "SIGTERM");
    } catch {}
  }
}

if (fs.existsSync(lockPath)) {
  try {
    const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
    killPid(Number(lock.pid));
  } catch {}
  try {
    fs.unlinkSync(lockPath);
  } catch {}
}

process.exit(0);
