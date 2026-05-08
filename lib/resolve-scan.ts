import type { Student } from "@/lib/types";
import { matchTemporaryCredentialExit } from "@/lib/temporary-credential-exits";
import { parseEnrollmentFromQr } from "@/lib/parse-qr-enrollment";

export type ResolvedScan = {
  enrollment: string;
  /** Indica registro en la base temporal de salidas (solo válido si coincide el alumno identificado). */
  alreadyExited: boolean;
};

/**
 * Resuelve el texto del QR: URLs oficiales de credencial → matrícula (vía base temporal)
 * u otro formato vía parseEnrollmentFromQr.
 */
export function resolveScanFromQr(raw: string): ResolvedScan {
  const temp = matchTemporaryCredentialExit(raw);
  if (temp) {
    return { enrollment: temp.enrollment, alreadyExited: temp.alreadyExited };
  }
  return {
    enrollment: parseEnrollmentFromQr(raw),
    alreadyExited: false,
  };
}

/**
 * La tabla temporal puede coincidir por URL/path compartido entre credenciales; solo aplicamos
 * YA_SALIO si la matrícula que devolvió Supabase es la misma que la enlazada en ese registro.
 */
export function resolveAlreadyExitedForStudent(
  rawScan: string,
  student: Student,
  preliminaryAlreadyExited: boolean
): boolean {
  if (!preliminaryAlreadyExited) return false;
  const temp = matchTemporaryCredentialExit(rawScan.trim());
  if (!temp) return false;
  return student.enrollment.trim() === temp.enrollment.trim();
}
