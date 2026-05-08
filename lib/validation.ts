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

export function validateExit(
  student: Student,
  now: Date,
  groupWindows: GroupExitWindow[] = []
): {
  result: ValidationResult;
  reason: string;
} {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

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
      reason: "Salida dentro del horario permitido.",
    };
  }

  return {
    result: "DENEGADO",
    reason: "No existe permiso de salida para este horario.",
  };
}
