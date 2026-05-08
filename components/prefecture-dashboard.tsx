"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ShieldAlert, UserSquare2 } from "lucide-react";
import { AppThemePicker } from "@/components/app-theme-picker";
import { ScannerPanel } from "@/components/scanner-panel";
import { PrefectureLogTable } from "@/components/prefecture-log-table";
import { GroupExitAuthorizationPanel } from "@/components/group-exit-authorization-panel";
import { PrefectureRepeatedExitAlertPanel } from "@/components/prefecture-repeated-exit-alert-panel";
import { accessResultLabel } from "@/lib/access-result-labels";
import {
  EXIT_DENIAL_ALERT_THRESHOLD,
  nextDenialStreak,
  upsertExitDenialAlert,
} from "@/lib/repeated-exit-denials";
import { STUDENTS } from "@/lib/mock-data";
import { credentialKeyFromScan } from "@/lib/credential-key";
import { resolveAlreadyExitedForStudent, resolveScanFromQr } from "@/lib/resolve-scan";
import { INITIAL_GROUP_EXIT_WINDOWS } from "@/lib/group-exit-windows";
import { accessValidationBannerClasses, dashboardSkin } from "@/lib/app-visual-theme";
import type { AppVisualTheme } from "@/lib/app-visual-theme";
import type {
  AccessRecord,
  GroupExitWindow,
  PrefectureExitDenialAlert,
  Student,
  ValidationResult,
} from "@/lib/types";
import { getCurrentHourLabel, validateExit } from "@/lib/validation";

type DashboardProps = {
  onLogout: () => void;
  visualTheme: AppVisualTheme;
  onVisualThemeChange: (theme: AppVisualTheme) => void;
};

type RecentScan = {
  id: string;
  student: Student | null;
  result: ValidationResult;
  reason: string;
  scannedAt: string;
  enrollmentLabel: string;
  groupLabel: string;
};

const MAX_RECENT_SCANS = 3;

const HISTORY_STORAGE_KEY = "ojo-de-lince-prefecture-history-v1";

function createRecordId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `scan-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function withRecordId(record: Omit<AccessRecord, "id">): AccessRecord {
  return { id: createRecordId(), ...record };
}

async function findStudentByScan(enrollment: string, credentialLabel: string): Promise<Student | null> {
  try {
    const response = await fetch("/api/students/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enrollment,
        qrPayload: credentialLabel,
      }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { student?: Student | null };
    if (payload.student) return payload.student;
  } catch {
    // Si Supabase no está disponible, la app usa fallback local.
  }
  return STUDENTS.find((candidate) => candidate.enrollment === enrollment) ?? null;
}

function unknownScanStudentPlaceholder(credentialKey: string): Student {
  return {
    id: "scan-unknown",
    enrollment: credentialKey,
    fullName: "No identificado",
    gradeGroup: "—",
    photoUrl: "https://ui-avatars.com/api/?name=No+ID&background=0A2A66&color=fff&size=256",
    guardianEmail: "",
    allowedExitTimes: [],
    absences: 0,
  };
}

export function PrefectureDashboard({
  onLogout,
  visualTheme,
  onVisualThemeChange,
}: DashboardProps) {
  const skin = dashboardSkin(visualTheme);
  const [denialStreaks, setDeniedStreaks] = useState<Record<string, number>>({});
  const [prefectureAlerts, setPrefectureAlerts] = useState<PrefectureExitDenialAlert[]>([]);
  const [groupWindows, setGroupWindows] = useState<GroupExitWindow[]>(INITIAL_GROUP_EXIT_WINDOWS);
  const [records, setRecords] = useState<AccessRecord[]>([]);
  const [historyRecords, setHistoryRecords] = useState<AccessRecord[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as AccessRecord[];
      if (!Array.isArray(parsed)) return [];
      return parsed.map((record) => ({
        ...record,
        id: typeof record.id === "string" && record.id.trim() ? record.id : createRecordId(),
      }));
    } catch {
      return [];
    }
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyClosing, setHistoryClosing] = useState(false);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const skipNextWindowsSyncRef = useRef(true);
  /** Evita que un GET tardío de Supabase pise cambios ya hechos en el panel */
  const userAdjustedGroupWindowsRef = useRef(false);
  const windowsSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGroupWindowsChange = useCallback((next: GroupExitWindow[]) => {
    userAdjustedGroupWindowsRef.current = true;
    setGroupWindows(next);
  }, []);

  const pushRecentScan = useCallback((scan: Omit<RecentScan, "id">) => {
    setRecentScans((previous) => [
      { id: createRecordId(), ...scan },
      ...previous,
    ].slice(0, MAX_RECENT_SCANS));
  }, []);

  const closeHistory = useCallback(() => {
    setHistoryClosing(true);
    setTimeout(() => {
      setHistoryOpen(false);
      setHistoryClosing(false);
    }, 180);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyRecords.slice(0, 1000)));
    } catch {
      // Silenciar errores de quota/navegador.
    }
  }, [historyRecords]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/group-exit-windows", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { windows?: GroupExitWindow[] };
        if (
          !cancelled &&
          !userAdjustedGroupWindowsRef.current &&
          Array.isArray(payload.windows) &&
          payload.windows.length > 0
        ) {
          skipNextWindowsSyncRef.current = true;
          setGroupWindows(payload.windows);
        }
      } catch {
        // Si falla, se queda con INITIAL_GROUP_EXIT_WINDOWS.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (skipNextWindowsSyncRef.current) {
      skipNextWindowsSyncRef.current = false;
      return;
    }
    if (windowsSaveTimeoutRef.current) {
      clearTimeout(windowsSaveTimeoutRef.current);
    }
    windowsSaveTimeoutRef.current = setTimeout(() => {
      void fetch("/api/group-exit-windows", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ windows: groupWindows }),
      }).catch(() => undefined);
    }, 700);

    return () => {
      if (windowsSaveTimeoutRef.current) {
        clearTimeout(windowsSaveTimeoutRef.current);
      }
    };
  }, [groupWindows]);

  const totalDenied = useMemo(
    () => records.filter((record) => record.result === "DENEGADO").length,
    [records]
  );

  const activeDenialStreaks = useMemo(
    () => Object.values(denialStreaks).filter((n) => n > 0).length,
    [denialStreaks]
  );

  const appendRecord = useCallback((record: AccessRecord) => {
    setRecords((previous) => [record, ...previous].slice(0, 30));
    setHistoryRecords((previous) => [record, ...previous].slice(0, 1000));
  }, []);

  const applyDenialTracking = useCallback(
    (
      result: ValidationResult,
      trackingKey: string,
      studentNameLog: string,
      scannedAtLabel: string,
      credentialLabelShort: string,
      enablePrefectureAlert: boolean
    ) => {
      setDeniedStreaks((prev) => {
        if (result === "DENEGADO") {
          const next = nextDenialStreak(prev, trackingKey, result);
          const newStreak = next[trackingKey] ?? 0;
          queueMicrotask(() => {
            if (enablePrefectureAlert) {
              setPrefectureAlerts((ap) =>
                newStreak >= EXIT_DENIAL_ALERT_THRESHOLD
                  ? upsertExitDenialAlert(
                      ap,
                      trackingKey,
                      studentNameLog,
                      newStreak,
                      scannedAtLabel,
                      credentialLabelShort
                    )
                  : ap.filter((a) => a.enrollment !== trackingKey)
              );
            } else {
              setPrefectureAlerts((ap) => ap.filter((a) => a.enrollment !== trackingKey));
            }
            if (enablePrefectureAlert && newStreak === EXIT_DENIAL_ALERT_THRESHOLD) {
              void fetch("/api/prefecture-exit-alert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  enrollment: trackingKey,
                  studentName: studentNameLog,
                  consecutiveDenials: newStreak,
                  scannedAt: scannedAtLabel,
                  credentialLabel: credentialLabelShort,
                }),
              }).catch(() => {});
            }
          });
          return next;
        }
        const next = nextDenialStreak(prev, trackingKey, result);
        queueMicrotask(() => {
          setPrefectureAlerts((ap) => ap.filter((a) => a.enrollment !== trackingKey));
        });
        return next;
      });
    },
    []
  );

  const handleScan = useCallback(
    async (enrollmentRaw: string) => {
      const { enrollment, alreadyExited: preliminaryAlreadyExited } = resolveScanFromQr(enrollmentRaw);
      const rawScanValue = enrollmentRaw.trim();
      const credentialLabel = rawScanValue.slice(0, 160);
      const credentialKey = credentialKeyFromScan(enrollment, credentialLabel);
      const now = new Date();
      const scannedAt = getCurrentHourLabel(now);
      const student = await findStudentByScan(enrollment, rawScanValue);

      if (!student) {
        const reason = "Matricula no registrada en el sistema.";
        const deniedRecord: AccessRecord = {
          id: createRecordId(),
          scannedAt,
          enrollment: credentialKey,
          group: "—",
          studentName: "No identificado",
          result: "DENEGADO",
          reason,
        };
        appendRecord(deniedRecord);
        pushRecentScan({
          student: null,
          result: "DENEGADO",
          reason,
          scannedAt,
          enrollmentLabel: credentialKey,
          groupLabel: "—",
        });
        applyDenialTracking(
          "DENEGADO",
          credentialKey,
          "No identificado",
          scannedAt,
          credentialLabel,
          false
        );
        void fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student: unknownScanStudentPlaceholder(credentialKey),
            result: "DENEGADO" as const,
            scannedAt,
            reason,
          }),
        }).catch(() => {});
        return;
      }

      const alreadyExited = resolveAlreadyExitedForStudent(
        rawScanValue,
        student,
        preliminaryAlreadyExited
      );

      if (alreadyExited) {
        const reason =
          "Registro temporal: el alumno ya tiene salida registrada (credencial vinculada en base de datos).";
        const newRecord: AccessRecord = {
          id: createRecordId(),
          scannedAt,
          enrollment: student.enrollment,
          group: student.gradeGroup || "—",
          studentName: student.fullName,
          result: "YA_SALIO",
          reason,
        };
        appendRecord(newRecord);
        pushRecentScan({
          student,
          result: "YA_SALIO",
          reason,
          scannedAt,
          enrollmentLabel: student.enrollment,
          groupLabel: student.gradeGroup || "—",
        });
        // YA_SALIO no resetea la racha de denegaciones: omitimos applyDenialTracking aquí.

        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student,
            result: "YA_SALIO",
            scannedAt,
            reason,
          }),
        });
        return;
      }

      const { result, reason } = validateExit(student, now, groupWindows);
      const newRecord = withRecordId({
        scannedAt,
        enrollment: student.enrollment,
        group: student.gradeGroup || "—",
        studentName: student.fullName,
        result,
        reason,
      });

      appendRecord(newRecord);
      pushRecentScan({
        student,
        result,
        reason,
        scannedAt,
        enrollmentLabel: student.enrollment,
        groupLabel: student.gradeGroup || "—",
      });
      applyDenialTracking(
        result,
        student.enrollment,
        student.fullName,
        scannedAt,
        credentialLabel,
        true
      );

      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student,
          result,
          scannedAt,
          reason,
        }),
      });
    },
    [appendRecord, applyDenialTracking, groupWindows, pushRecentScan]
  );

  return (
    <section className={`anim-fade-in space-y-5 ${skin.sectionMuted}`}>
      <header className={`anim-slide-up flex flex-wrap items-center justify-between gap-4 ${skin.header}`}>
        <div>
          <h2 className="text-2xl font-bold">Panel de Prefectura</h2>
          <p className="text-sm opacity-90">Control de acceso inteligente en tiempo real.</p>
        </div>
        <div className="flex flex-wrap items-end justify-end gap-4">
          <AppThemePicker
            value={visualTheme}
            onChange={onVisualThemeChange}
            menuShellClassName={skin.themeMenuShell}
            triggerClassName={skin.themeNeonTrigger}
            menuAlign="right"
          />
          <div className="flex flex-wrap items-center gap-3">
            <div className={skin.statBox}>
              Escaneos: <strong>{records.length}</strong> | Denegados:{" "}
              <strong>{totalDenied}</strong> | Rachas activas: <strong>{activeDenialStreaks}</strong>
            </div>
            <button type="button" onClick={onLogout} className={skin.logout}>
              Cerrar sesion
            </button>
          </div>
        </div>
      </header>

      <div className="anim-slide-up anim-delay-100 grid gap-5 lg:grid-cols-2">
        <ScannerPanel onEnrollmentDetected={handleScan} visualTheme={visualTheme} />

        <section className={skin.card}>
          <div className={`mb-3 flex items-center gap-2 ${skin.cardAccent}`}>
            <UserSquare2 className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Resultado de Validacion</h3>
          </div>

          {recentScans.length === 0 ? (
            <p className="text-sm opacity-80">Esperando escaneo de credencial...</p>
          ) : (
            <ul className="space-y-3">
              {recentScans.map((scan, index) => (
                <li
                  key={scan.id}
                  className={`rounded-lg border border-white/5 bg-white/[0.03] p-3 transition-all duration-300 ${
                    index === 0 ? "opacity-100" : "opacity-80"
                  }`}
                  style={{ animation: index === 0 ? "fadeSlideIn 220ms ease-out" : undefined }}
                >
                  <div className="flex items-center gap-3">
                    {scan.student ? (
                      <Image
                        src={scan.student.photoUrl}
                        alt={`Foto de ${scan.student.fullName}`}
                        width={56}
                        height={56}
                        className="rounded-md border border-slate-300/60 object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-slate-500/40 bg-slate-700/40 text-xs text-slate-200">
                        N/I
                      </div>
                    )}
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="truncate font-semibold">
                        {scan.student?.fullName ?? "No identificado"}
                      </p>
                      <p className="truncate opacity-80">
                        Matricula: <span className="break-all">{scan.enrollmentLabel}</span>
                      </p>
                      <p className="opacity-80">
                        Grupo: {scan.groupLabel} · {scan.scannedAt}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`anim-badge-pop mt-2 rounded-md p-2 text-xs font-semibold ${accessValidationBannerClasses(visualTheme, scan.result)}`}
                  >
                    <p className="flex items-center gap-2">
                      {scan.result === "DENEGADO" ? (
                        <ShieldAlert className="h-3.5 w-3.5" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                      {accessResultLabel(scan.result)}
                    </p>
                    <p className="mt-0.5 font-normal">{scan.reason}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <PrefectureRepeatedExitAlertPanel
        alerts={prefectureAlerts}
        visualTheme={visualTheme}
        onDismiss={(id, enrollmentKey) => {
          setPrefectureAlerts((p) => p.filter((a) => a.id !== id));
          setDeniedStreaks((s) => {
            const n = { ...s };
            delete n[enrollmentKey];
            return n;
          });
        }}
      />

      <GroupExitAuthorizationPanel
        windows={groupWindows}
        onChange={handleGroupWindowsChange}
        visualTheme={visualTheme}
      />

      <PrefectureLogTable
        records={records}
        visualTheme={visualTheme}
        historyCount={historyRecords.length}
        onOpenHistory={() => setHistoryOpen(true)}
      />
      {historyOpen ? (
        <section
          className={`anim-fade-in fixed inset-0 z-50 bg-slate-950/70 p-4 backdrop-blur-sm ${
            historyClosing ? "opacity-0 transition-opacity duration-[180ms]" : ""
          }`}
        >
          <div
            className={`anim-scale-in mx-auto max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-xl border border-slate-600/50 bg-slate-900 shadow-2xl ${
              historyClosing ? "scale-95 opacity-0 transition-all duration-[180ms]" : ""
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-100">
                Historial de salidas ({historyRecords.length})
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (
                      historyRecords.length > 0 &&
                      typeof window !== "undefined" &&
                      window.confirm(
                        "¿Borrar todo el historial? Esta acción no se puede deshacer."
                      )
                    ) {
                      setHistoryRecords([]);
                      try {
                        localStorage.removeItem(HISTORY_STORAGE_KEY);
                      } catch {
                        // ignorar
                      }
                    }
                  }}
                  disabled={historyRecords.length === 0}
                  className="anim-press rounded-md border border-rose-400/60 px-2 py-1 text-xs font-semibold text-rose-100 hover:bg-rose-500/15 disabled:opacity-40"
                >
                  Borrar historial
                </button>
                <button
                  type="button"
                  onClick={closeHistory}
                  className="anim-press rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:border-slate-400"
                >
                  Cerrar
                </button>
              </div>
            </div>
            <div className="max-h-[80vh] overflow-auto p-4">
              <PrefectureLogTable records={historyRecords} visualTheme={visualTheme} />
            </div>
          </div>
        </section>
      ) : null}
    </section>
  );
}
