/** Extract matricula from QR payload (plain text, JSON, or digit-rich strings). */
export function parseEnrollmentFromQr(raw: string): string {
  const trimmed = raw.trim();
  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    const fromJson = parsed.enrollment ?? parsed.matricula;
    if (typeof fromJson === "string") {
      return fromJson.replace(/\s+/g, "");
    }
  } catch {
    /* plain text */
  }
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 14) {
    return digits;
  }
  return trimmed.replace(/\s+/g, "");
}
