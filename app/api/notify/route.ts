import { NextResponse } from "next/server";
import { formatExitAttemptWhatsAppMessage } from "@/lib/format-exit-whatsapp-message";
import { hasMailerConfig, sendGuardianNotification } from "@/lib/mailer";
import type { NotificationPayload } from "@/lib/types";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as NotificationPayload;

    if (!payload?.student || !payload.student.enrollment || !payload.result || !payload.scannedAt) {
      return NextResponse.json({ error: "Payload invalido." }, { status: 400 });
    }

    const whatsappBody = formatExitAttemptWhatsAppMessage(payload);
    const wa = await sendWhatsAppNotification(whatsappBody);

    let email: "skipped" | "sent" | "error" = "skipped";
    if (hasMailerConfig() && payload.student.guardianEmail) {
      try {
        await sendGuardianNotification(payload);
        email = "sent";
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Correo no enviado";
        console.warn("[notify/email]", msg);
        email = "error";
      }
    }

    return NextResponse.json({
      ok: true,
      whatsapp: wa.outcome,
      whatsappDetalle: wa.detalleEs,
      whatsappApiError: wa.apiErrorSnippet,
      email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
