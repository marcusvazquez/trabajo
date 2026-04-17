import { NextResponse } from "next/server";
import { sendGuardianNotification } from "@/lib/mailer";
import type { NotificationPayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as NotificationPayload;

    if (!payload?.student?.guardianEmail || !payload.student.enrollment || !payload.result) {
      return NextResponse.json({ error: "Payload invalido." }, { status: 400 });
    }

    await sendGuardianNotification(payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
