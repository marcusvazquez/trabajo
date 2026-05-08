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

/** Grupos que solo pueden salir según reglas del panel (no por allowedExitTimes salvo excepciones). */
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

  /**
   * DESDE–HASTA = tiempo en que deben permanecer en plantel (clases).
   * Dentro del intervalo → salida denegada.
   * Antes de DESDE o después de HASTA → salida autorizada (p. ej. al terminar la jornada).
   */
  for (const code of allGroupCodes) {
    if (!studentBelongsToGroup(student, code)) continue;

    const windowToday = groupWindows.find(
      (w) =>
        w.enabled &&
        w.groupCode.trim().toUpperCase() === code &&
        w.dayOfWeek === currentDow
    );

    if (!windowToday) continue;

    const start = minutesFromClock(windowToday.startTime);
    const end = minutesFromClock(windowToday.endTime);
    if (!Number.isFinite(start) || !Number.isFinite(end)) continue;

    const insideMandatoryPresence = currentMinutes >= start && currentMinutes <= end;

    if (insideMandatoryPresence) {
      return {
        result: "DENEGADO",
        reason: `Salida no autorizada: permanencia obligatoria en plantel entre ${windowToday.startTime} y ${windowToday.endTime} (hora Tijuana, GMT-7). Grupo ${code}.`,
      };
    }

    if (currentMinutes < start) {
      return {
        result: "DENEGADO",
        reason: `Salida no autorizada: aún no inicia el horario de permanencia (${windowToday.startTime}–${windowToday.endTime}, hora Tijuana). Grupo ${code}.`,
      };
    }

    return {
      result: "AUTORIZADO",
      reason: `Salida autorizada: horario de permanencia finalizado (${windowToday.startTime}–${windowToday.endTime}). Grupo ${code}.`,
    };
  }

  for (const code of allGroupCodes) {
    if (!studentBelongsToGroup(student, code)) continue;

    const anyWindow = groupWindows.find(
      (w) => w.enabled && w.groupCode.trim().toUpperCase() === code
    );
    if (anyWindow) {
      return {
        result: "DENEGADO",
        reason: `Hoy (${WEEKDAY_LABELS[currentDow]}) no hay horario de permanencia configurado para el grupo ${code}. Elige el día correcto en el panel.`,
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

  return {
    result: "DENEGADO",
    reason: "No existe permiso de salida para este horario.",
  };
}

function studentBelongsToGroup(student: Student, groupCode: string): boolean {
  const code = groupCode.trim().toUpperCase();
  if (isDemoGroupCode(code)) {
    return studentMatchesGroupCode(student, code);
  }
  const combined = `${student.semesterGroup ?? ""} ${student.gradeGroup ?? ""}`.toUpperCase();
  return combined.replace(/\s+/g, "").includes(code.replace(/\s+/g, ""));
}
