/**
 * Clave estable para rachas y avisos: matrícula si existe; si no, el contenido del QR escaneado.
 */
export function credentialKeyFromScan(enrollment: string, credentialLabel: string): string {
  const e = enrollment.trim().replace(/\s/g, "");
  if (e.length > 0) return e;
  const lab = credentialLabel.trim();
  if (lab.length > 0) return `qr:${lab}`;
  return "sin_identificacion";
}
