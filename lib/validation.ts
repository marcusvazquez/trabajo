import type { GroupExitWindow, Student, ValidationResult } from "@/lib/types";
import { isWithinGroupExitWindow } from "@/lib/group-exit-windows";
import { studentMatchesGroupCode } from "@/lib/student-group";

const EXIT_TOLERANCE_MINUTES = 20;

function toMinutes(timeText: string): number {
  const [hours, minutes] = timeText.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getCurrentHourLabel(date: Date): string {
  return date.toLocaleTimeString("es-MX", {
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

function normalizedGroupCodesMatch(windowCode: string, code: "4DPGM" | "4CPGM"): boolean {
  return windowCode.trim().toUpperCase() === code;
}

export function validateExit(
  student: Student,
  now: Date,
  groupWindows: GroupExitWindow[] = []
): {
  result: ValidationResult;
  reason: string;
} {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentDow = now.getDay();

  const demoCodes = ["4DPGM", "4CPGM"] as const;

  for (const code of demoCodes) {
    if (!studentMatchesGroupCode(student, code)) continue;
    if (isWithinGroupExitWindow(code, groupWindows, now)) {
      return {
        result: "AUTORIZADO",
        reason: `Salida autorizada: ventana de grupo ${code} activa.`,
      };
    }
  }

  const isAllowedNow = student.allowedExitTimes.some((exitTime) => {
    const exitMinutes = toMinutes(exitTime);
    return Math.abs(exitMinutes - currentMinutes) <= EXIT_TOLERANCE_MINUTES;
  });

  if (isAllowedNow) {
    return {
      result: "AUTORIZADO",
      reason: "Salida dentro del horario individual permitido.",
    };
  }

  for (const code of demoCodes) {
    if (!studentMatchesGroupCode(student, code)) continue;

    const matchingWindow = groupWindows.find(
      (w) =>
        w.enabled &&
        normalizedGroupCodesMatch(w.groupCode, code) &&
        w.dayOfWeek === currentDow
    );
    if (matchingWindow) {
      return {
        result: "DENEGADO",
        reason: `Fuera de horario para ${code}. Ventana hoy: ${matchingWindow.startTime}-${matchingWindow.endTime}.`,
      };
    }

    const otherWindow = groupWindows.find(
      (w) => w.enabled && normalizedGroupCodesMatch(w.groupCode, code)
    );
    if (otherWindow) {
      return {
        result: "DENEGADO",
        reason: `Hoy (${WEEKDAY_LABELS[currentDow]}) no esta autorizado para ${code}.`,
      };
    }
  }

  return {
    result: "DENEGADO",
    reason: "No existe permiso de salida para este horario.",
  };
}
