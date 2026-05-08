import { accessResultLabel } from "@/lib/access-result-labels";
import type { NotificationPayload } from "@/lib/types";

export function formatExitAttemptWhatsAppMessage(payload: NotificationPayload): string {
  return [
    "🦁 *Ojo de Lince* — intento de salida",
    `Alumno: *${payload.student.fullName}*`,
    `Matrícula: ${payload.student.enrollment}`,
    `Hora: ${payload.scannedAt}`,
    `Resultado: *${accessResultLabel(payload.result)}*`,
    `Detalle: ${payload.reason}`,
  ].join("\n");
}
