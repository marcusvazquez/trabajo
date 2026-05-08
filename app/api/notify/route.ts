import { NextResponse } from "next/server";
import { hasMailerConfig, sendGuardianNotification } from "@/lib/mailer";
import type { NotificationPayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as NotificationPayload;

    if (!payload?.student || !payload.student.enrollment || !payload.result || !payload.scannedAt) {
      return NextResponse.json({ error: "Payload invalido." }, { status: 400 });
    }

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
      whatsapp: "skipped",
      whatsappDetalle:
        "WhatsApp solo se dispara cuando el mismo alumno acumula 3 intentos denegados.",
      email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
