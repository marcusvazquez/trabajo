import type { Student, ValidationResult } from "@/lib/types";

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

export function validateExit(student: Student, now: Date): {
  result: ValidationResult;
  reason: string;
} {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

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
