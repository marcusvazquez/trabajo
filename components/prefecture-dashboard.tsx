"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { CheckCircle2, ShieldAlert, UserSquare2 } from "lucide-react";
import { AppThemePicker } from "@/components/app-theme-picker";
import { ScannerPanel } from "@/components/scanner-panel";
import { PrefectureLogTable } from "@/components/prefecture-log-table";
import { DesertionAlerts } from "@/components/desertion-alerts";
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
import { resolveScanFromQr } from "@/lib/resolve-scan";
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

type ScanState = {
  student: Student | null;
  result: ValidationResult | null;
  reason: string;
};

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
  const [scanState, setScanState] = useState<ScanState>({
    student: null,
    result: null,
    reason: "",
  });

  const totalDenied = useMemo(
    () => records.filter((record) => record.result === "DENEGADO").length,
    [records]
  );

  const activeDenialStreaks = useMemo(
    () => Object.values(denialStreaks).filter((n) => n > 0).length,
    [denialStreaks]
  );

  const applyDenialTracking = useCallback(
    (
      result: ValidationResult,
      enrollmentLog: string,
      studentNameLog: string,
      scannedAtLabel: string,
      credentialLabelShort: string
    ) => {
      setDeniedStreaks((prev) => {
        if (result === "DENEGADO") {
          const next = nextDenialStreak(prev, enrollmentLog, result);
          const newStreak = next[enrollmentLog] ?? 0;
          queueMicrotask(() => {
            setPrefectureAlerts((ap) =>
              newStreak >= EXIT_DENIAL_ALERT_THRESHOLD
                ? upsertExitDenialAlert(
                    ap,
                    enrollmentLog,
                    studentNameLog,
                    newStreak,
                    scannedAtLabel,
                    credentialLabelShort
                  )
                : ap.filter((a) => a.enrollment !== enrollmentLog)
            );
            if (newStreak === EXIT_DENIAL_ALERT_THRESHOLD) {
              void fetch("/api/prefecture-exit-alert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  enrollment: enrollmentLog,
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
        const next = nextDenialStreak(prev, enrollmentLog, result);
        queueMicrotask(() => {
          setPrefectureAlerts((ap) => ap.filter((a) => a.enrollment !== enrollmentLog));
        });
        return next;
      });
    },
    []
  );

  const handleScan = async (enrollmentRaw: string) => {
    const { enrollment, alreadyExited } = resolveScanFromQr(enrollmentRaw);
    const rawScanValue = enrollmentRaw.trim();
    const credentialLabel = rawScanValue.slice(0, 160);
    const credentialKey = credentialKeyFromScan(enrollment, credentialLabel);
    const now = new Date();
    const scannedAt = getCurrentHourLabel(now);
    const student = await findStudentByScan(enrollment, rawScanValue);

    if (!student) {
      const reason = "Matricula no registrada en el sistema.";
      const deniedRecord: AccessRecord = {
        scannedAt,
        enrollment: credentialKey,
        studentName: "No identificado",
        result: "DENEGADO",
        reason,
      };
      setScanState({ student: null, result: "DENEGADO", reason });
      setRecords((previous) => [deniedRecord, ...previous].slice(0, 30));
      applyDenialTracking("DENEGADO", credentialKey, "No identificado", scannedAt, credentialLabel);
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

    if (alreadyExited) {
      const reason =
        "Registro temporal: el alumno ya tiene salida registrada (credencial vinculada en base de datos).";
      const newRecord: AccessRecord = {
        scannedAt,
        enrollment: student.enrollment,
        studentName: student.fullName,
        result: "YA_SALIO",
        reason,
      };
      setScanState({ student, result: "YA_SALIO", reason });
      setRecords((previous) => [newRecord, ...previous].slice(0, 30));
      applyDenialTracking("YA_SALIO", credentialKey, student.fullName, scannedAt, credentialLabel);
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
    const newRecord: AccessRecord = {
      scannedAt,
      enrollment: student.enrollment,
      studentName: student.fullName,
      result,
      reason,
    };

    setScanState({ student, result, reason });
    setRecords((previous) => [newRecord, ...previous].slice(0, 30));
    applyDenialTracking(result, credentialKey, student.fullName, scannedAt, credentialLabel);

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
  };

  return (
    <section className={`space-y-5 ${skin.sectionMuted}`}>
      <header className={`flex flex-wrap items-center justify-between gap-4 ${skin.header}`}>
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

      <div className="grid gap-5 lg:grid-cols-2">
        <ScannerPanel onEnrollmentDetected={handleScan} visualTheme={visualTheme} />

        <section className={skin.card}>
          <div className={`mb-3 flex items-center gap-2 ${skin.cardAccent}`}>
            <UserSquare2 className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Resultado de Validacion</h3>
          </div>

          {!scanState.result ? (
            <p className="text-sm opacity-80">Esperando escaneo de credencial...</p>
          ) : (
            <div className="space-y-4">
              {scanState.student ? (
                <div className="flex items-center gap-4">
                  <Image
                    src={scanState.student.photoUrl}
                    alt={`Foto de ${scanState.student.fullName}`}
                    width={84}
                    height={84}
                    className="rounded-lg border border-slate-300 object-cover"
                  />
                  <div className="text-sm">
                    <p className="font-bold">{scanState.student.fullName}</p>
                    <p className="opacity-80">Matricula: {scanState.student.enrollment}</p>
                    <p className="opacity-80">Grupo: {scanState.student.gradeGroup}</p>
                  </div>
                </div>
              ) : null}

              <div
                className={`rounded-lg p-3 text-sm font-semibold ${accessValidationBannerClasses(visualTheme, scanState.result)}`}
              >
                <p className="flex items-center gap-2">
                  {scanState.result === "DENEGADO" ? (
                    <ShieldAlert className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {accessResultLabel(scanState.result)}
                </p>
                <p className="mt-1 font-normal">{scanState.reason}</p>
              </div>
            </div>
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
        onChange={setGroupWindows}
        visualTheme={visualTheme}
      />

      <PrefectureLogTable records={records} visualTheme={visualTheme} />
      <DesertionAlerts students={STUDENTS} threshold={6} visualTheme={visualTheme} />
    </section>
  );
}
