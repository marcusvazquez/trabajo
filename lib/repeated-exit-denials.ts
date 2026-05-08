import type { PrefectureExitDenialAlert } from "@/lib/types";

export const EXIT_DENIAL_ALERT_THRESHOLD = 3;

/** Racha consecutiva de salidas DENEGADO por la misma credencial (clave = matrícula resuelta). */
export function nextDenialStreak(
  streaks: Record<string, number>,
  credentialKey: string,
  result: "AUTORIZADO" | "DENEGADO" | "YA_SALIO"
): Record<string, number> {
  const next = { ...streaks };
  if (result === "DENEGADO") {
    next[credentialKey] = (next[credentialKey] ?? 0) + 1;
  } else {
    delete next[credentialKey];
  }
  return next;
}

export function upsertExitDenialAlert(
  alerts: PrefectureExitDenialAlert[],
  enrollment: string,
  studentName: string,
  streak: number,
  scannedAt: string,
  credentialLabel: string
): PrefectureExitDenialAlert[] {
  const existing = alerts.find((a) => a.enrollment === enrollment);
  if (existing) {
    return alerts.map((a) =>
      a.enrollment === enrollment
        ? {
            ...a,
            denialStreakTotal: streak,
            lastAttemptAt: scannedAt,
          }
        : a
    );
  }
  return [
    {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `alert-${Date.now()}`,
      enrollment,
      studentName,
      denialStreakTotal: streak,
      firstReachedAt: scannedAt,
      lastAttemptAt: scannedAt,
      credentialLabel,
    },
    ...alerts,
  ];
}
