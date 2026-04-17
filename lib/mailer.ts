import nodemailer from "nodemailer";
import type { NotificationPayload } from "@/lib/types";

const smtpHost = process.env.SMTP_HOST ?? "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

export function hasMailerConfig(): boolean {
  return Boolean(emailUser && emailPass);
}

export async function sendGuardianNotification(
  payload: NotificationPayload
): Promise<void> {
  if (!hasMailerConfig()) {
    throw new Error("Faltan EMAIL_USER o EMAIL_PASS en variables de entorno.");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const subjectPrefix =
    payload.result === "AUTORIZADO" ? "Salida registrada" : "Intento no autorizado";

  await transporter.sendMail({
    from: `"Ojo de Lince - CECYTE BC" <${emailUser}>`,
    to: payload.student.guardianEmail,
    subject: `${subjectPrefix} | ${payload.student.fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Ojo de Lince - Notificacion de acceso</h2>
        <p><strong>Alumno:</strong> ${payload.student.fullName}</p>
        <p><strong>Matricula:</strong> ${payload.student.enrollment}</p>
        <p><strong>Hora de escaneo:</strong> ${payload.scannedAt}</p>
        <p><strong>Resultado:</strong> ${payload.result}</p>
        <p><strong>Detalle:</strong> ${payload.reason}</p>
        <p style="margin-top: 24px;">cuidarte a ti es darle calma al hogar</p>
      </div>
    `,
  });
}
