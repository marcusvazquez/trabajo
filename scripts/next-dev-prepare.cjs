/**
 * Quita .next/dev/lock si el PID guardado ya no existe (servidor colgado / cierre brusco).
 * Asi `npm run dev` puede arrancar de nuevo sin quedar bloqueado por un lock fantasma.
 */
const fs = require("fs");
const path = require("path");

const lockPath = path.join(__dirname, "..", ".next", "dev", "lock");

function processAlive(pid) {
  if (!pid || Number.isNaN(pid)) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    if (e && (e.code === "EPERM" || e.code === "EACCES")) return true;
    return false;
  }
}

if (!fs.existsSync(lockPath)) {
  process.exit(0);
}

let lock;
try {
  lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
} catch {
  try {
    fs.unlinkSync(lockPath);
  } catch {}
  process.exit(0);
}

const pid = Number(lock.pid);
if (!processAlive(pid)) {
  try {
    fs.unlinkSync(lockPath);
  } catch {}
}

process.exit(0);
