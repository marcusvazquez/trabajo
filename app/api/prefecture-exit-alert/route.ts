import { NextResponse } from "next/server";
import { sendExitAttemptWhatsApp } from "@/lib/send-prefecture-whatsapp";

export type PrefectureExitAlertBody = {
  enrollment: string;
  studentName: string;
  consecutiveDenials: number;
  scannedAt: string;
  credentialLabel: string;
};

/**
 * Registro de aviso a prefectura (repetición de intentos de salida).
 * WhatsApp mismo destino que intentos de salida (526632322712 por defecto); ver `lib/send-prefecture-whatsapp.ts`.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<PrefectureExitAlertBody>;
    const enrollment = typeof body.enrollment === "string" ? body.enrollment.trim() : "";
    if (
      enrollment.length === 0 ||
      typeof body.consecutiveDenials !== "number" ||
      typeof body.scannedAt !== "string" ||
      !body.scannedAt.trim()
    ) {
      return NextResponse.json({ error: "Payload invalido." }, { status: 400 });
    }

    const studentName = typeof body.studentName === "string" ? body.studentName.trim() : "";
    const credentialLabel =
      typeof body.credentialLabel === "string" ? body.credentialLabel.trim() : "";

    const line = `[PREFECTURA] Repeticion salida denegada | id=${enrollment} | intentos=${body.consecutiveDenials} | hora=${body.scannedAt} | alumno=${studentName}`;
    console.info(line);

    const whatsappBody = [
      "🚨 *Ojo de Lince — prefectura*",
      `Intentos denegados seguidos: *${body.consecutiveDenials}*`,
      `Hora último intento: ${body.scannedAt}`,
      studentName ? `Nombre: ${studentName}` : null,
      `Identificador / matrícula: ${enrollment}`,
      credentialLabel ? `Último QR leído: ${credentialLabel.slice(0, 500)}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const wa = await sendExitAttemptWhatsApp(whatsappBody);

    return NextResponse.json({
      ok: true,
      whatsapp: wa.outcome,
      whatsappDetalle: wa.detalleEs,
      whatsappApiError: wa.apiErrorSnippet,
    });
  } catch {
    return NextResponse.json({ error: "Error al procesar aviso." }, { status: 500 });
  }
}
