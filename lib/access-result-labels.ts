import type { ValidationResult } from "@/lib/types";

/** Texto visible en bitácora y panel (el valor interno del enum no cambia). */
export function accessResultLabel(result: ValidationResult): string {
  switch (result) {
    case "AUTORIZADO":
      return "Salida autorizada";
    case "YA_SALIO":
      return "ya puede salir";
    case "DENEGADO":
      return "salida denegada";
    default:
      return result;
  }
}
