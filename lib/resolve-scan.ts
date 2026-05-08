import { matchTemporaryCredentialExit } from "@/lib/temporary-credential-exits";
import { parseEnrollmentFromQr } from "@/lib/parse-qr-enrollment";

export type ResolvedScan = {
  enrollment: string;
  /** Indica registro en la base temporal de salidas. */
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
