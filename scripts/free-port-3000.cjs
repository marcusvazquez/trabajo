/**
 * Libera el puerto 3000 (Windows: mata LISTENING) y borra .next/dev/lock.
 * Asi `npm run dev:share` puede arrancar aunque quede un next dev colgado.
 */
const fs = require("fs");
const path = require("path");
const { execSync, spawnSync } = require("child_process");

const port = 3000;
const lockPath = path.join(__dirname, "..", ".next", "dev", "lock");

function killWindowsListeners() {
  if (process.platform !== "win32") return;
  try {
    const out = execSync("netstat -ano", { encoding: "utf8", maxBuffer: 1024 * 1024 });
    const pids = new Set();
    for (const line of out.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed.includes("LISTENING")) continue;
      if (!trimmed.includes(`:${port}`) && !trimmed.includes(`]:${port}`)) continue;
      const parts = trimmed.split(/\s+/);
      const last = parts[parts.length - 1];
      if (/^\d+$/.test(last)) pids.add(last);
    }
    for (const pid of pids) {
      spawnSync("taskkill", ["/PID", pid, "/F"], { stdio: "ignore", shell: true });
    }
  } catch {
    /* netstat puede fallar en entornos restringidos */
  }
}

function killUnixListeners() {
  if (process.platform === "win32") return;
  try {
    execSync(`fuser -k ${port}/tcp`, { stdio: "ignore" });
  } catch {
    /* sin fuser o sin proceso */
  }
}

killWindowsListeners();
killUnixListeners();

try {
  fs.unlinkSync(lockPath);
} catch {}

process.exit(0);
