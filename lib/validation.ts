import type { GroupExitWindow, Student, ValidationResult } from "@/lib/types";
import {
  getTijuanaClockContext,
  minutesFromClock,
  TIJUANA_TIME_ZONE,
} from "@/lib/group-exit-windows";
import { isDemoGroupCode, studentMatchesGroupCode } from "@/lib/student-group";

const EXIT_TOLERANCE_MINUTES = 20;

function toMinutes(timeText: string): number {
  const [hours, minutes] = timeText.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getCurrentHourLabel(date: Date): string {
  return date.toLocaleTimeString("es-MX", {
    timeZone: TIJUANA_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const WEEKDAY_LABELS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

/** Grupos que solo pueden salir por ventana configurada en el panel (no por allowedExitTimes ficticio). */
const EXIT_PANEL_ONLY_GROUP_CODES = ["4DPGM", "4CPGM"] as const;

export function validateExit(
  student: Student,
  now: Date,
  groupWindows: GroupExitWindow[] = []
): {
  result: ValidationResult;
  reason: string;
} {
  const { minutes: currentMinutes, dayOfWeek: currentDow } = getTijuanaClockContext(now);

  const allGroupCodes = Array.from(
    new Set(
      groupWindows
        .filter((w) => w.enabled)
        .map((w) => w.groupCode.trim().toUpperCase())
    )
  );

  for (const code of allGroupCodes) {
    if (!studentBelongsToGroup(student, code)) continue;
    const activeWindow = groupWindows.find((w) => {
      if (!w.enabled || w.groupCode.trim().toUpperCase() !== code) return false;
      if (w.dayOfWeek !== currentDow) return false;
      const start = minutesFromClock(w.startTime);
      const end = minutesFromClock(w.endTime);
      if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
      return currentMinutes >= start && currentMinutes <= end;
    });
    if (activeWindow) {
      return {
        result: "AUTORIZADO",
        reason: `Salida autorizada: ventana de grupo ${code} activa (${activeWindow.startTime}–${activeWindow.endTime}).`,
      };
    }
  }

  const exitOnlyViaConfiguredWindows = EXIT_PANEL_ONLY_GROUP_CODES.some((code) =>
    studentBelongsToGroup(student, code)
  );

  const isAllowedNow =
    !exitOnlyViaConfiguredWindows &&
    student.allowedExitTimes.some((exitTime) => {
      const exitMinutes = toMinutes(exitTime);
      return Math.abs(exitMinutes - currentMinutes) <= EXIT_TOLERANCE_MINUTES;
    });

  if (isAllowedNow) {
    return {
      result: "AUTORIZADO",
      reason: "Salida dentro del horario individual permitido.",
    };
  }

  for (const code of allGroupCodes) {
    if (!studentBelongsToGroup(student, code)) continue;

    const windowToday = groupWindows.find(
      (w) =>
        w.enabled &&
        w.groupCode.trim().toUpperCase() === code &&
        w.dayOfWeek === currentDow
    );
    if (windowToday) {
      return {
        result: "DENEGADO",
        reason: `Fuera de horario para ${code} (hora Tijuana, GMT-7). Ventana hoy: ${windowToday.startTime}–${windowToday.endTime}.`,
      };
    }

    const anyWindow = groupWindows.find(
      (w) => w.enabled && w.groupCode.trim().toUpperCase() === code
    );
    if (anyWindow) {
      return {
        result: "DENEGADO",
        reason: `Hoy (${WEEKDAY_LABELS[currentDow]}) no está autorizado para el grupo ${code}.`,
      };
    }
  }

  return {
    result: "DENEGADO",
    reason: "No existe permiso de salida para este horario.",
  };
}

/**
 * El alumno pertenece al código de ventana del panel.
 * Para 4DPGM/4CPGM usa la misma regla que la credencial (ej. grupo "DPGM" o "4TO | DPGM").
 * Otros códigos: subcadena sobre texto de grupo combinado.
 */
function studentBelongsToGroup(student: Student, groupCode: string): boolean {
  const code = groupCode.trim().toUpperCase();
  if (isDemoGroupCode(code)) {
    return studentMatchesGroupCode(student, code);
  }
  const combined = `${student.semesterGroup ?? ""} ${student.gradeGroup ?? ""}`.toUpperCase();
  return combined.replace(/\s+/g, "").includes(code.replace(/\s+/g, ""));
}
