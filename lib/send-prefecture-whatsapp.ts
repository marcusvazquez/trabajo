/**
 * WhatsApp Cloud API (Meta / Facebook Graph).
 *
 * No basta con poner tu número: hace falta una app en developers.facebook.com,
 * número de WhatsApp Business vinculado y variables de entorno (ver más abajo).
 *
 * IMPORTANTE — ventana de 24 h y plantillas:
 * Si tu celular (+52…) nunca ha escrito primero al número de la empresa, Meta suele
 * RECHAZAR mensajes tipo "text" libres. En ese caso debes usar un mensaje plantilla
 * (template) aprobado o abrir conversación iniciando desde el alumno/número de prueba.
 * Si la API devuelve error, revisa el cuerpo en la terminal del servidor o en
 * whatsappDetalle de la respuesta JSON.
 *
 * Variables (.env.local en desarrollo):
 * - WHATSAPP_CLOUD_ACCESS_TOKEN
 * - WHATSAPP_CLOUD_PHONE_NUMBER_ID
 * - Opcional: WHATSAPP_EXIT_NOTIFY_TO (solo dígitos, ej. 526632322712). Si omites,
 *   se usa el número por defecto del proyecto (+52 663 232 2712).
 */

export const DEFAULT_EXIT_NOTIFY_WHATSAPP_MSISDN = "526632322712";

export type WhatsAppExitDelivery = {
  outcome: "sent" | "skipped" | "error";
  /** Explicación breve para el panel o logs (español). */
  detalleEs: string;
  /** Solo si Meta respondió error (primeros caracteres del body). */
  apiErrorSnippet?: string;
};

/** Resuelve número destino solo dígitos (E.164 sin +). */
export function resolveExitWhatsAppDestination(): string {
  const raw =
    process.env.WHATSAPP_EXIT_NOTIFY_TO?.trim() ||
    process.env.WHATSAPP_PREFECTURA_TO?.trim() ||
    DEFAULT_EXIT_NOTIFY_WHATSAPP_MSISDN;
  return raw.replace(/\D/g, "");
}

/**
 * Envía texto por WhatsApp Cloud API al número configurado para salidas.
 * Sin TOKEN o PHONE_NUMBER_ID → `skipped` (no lanza error: muchos entornos aún no tienen Meta).
 */
export async function sendExitAttemptWhatsApp(message: string): Promise<WhatsAppExitDelivery> {
  const token = process.env.WHATSAPP_CLOUD_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID?.trim();

  if (!token) {
    const detalleEs =
      "WhatsApp no configurado: agrega WHATSAPP_CLOUD_ACCESS_TOKEN en .env.local (Meta for Developers → tu app WhatsApp → token).";
    console.info("[WhatsApp salida] skipped:", detalleEs);
    return {
      outcome: "skipped",
      detalleEs,
    };
  }
  if (!phoneNumberId) {
    const detalleEs =
      "WhatsApp no configurado: agrega WHATSAPP_CLOUD_PHONE_NUMBER_ID (ID del número de WhatsApp Business que envía, en el panel de la app).";
    console.info("[WhatsApp salida] skipped:", detalleEs);
    return {
      outcome: "skipped",
      detalleEs,
    };
  }

  const to = resolveExitWhatsAppDestination();
  if (to.length < 10) {
    return {
      outcome: "error",
      detalleEs: "Número destino inválido. Revisa WHATSAPP_EXIT_NOTIFY_TO (ej. 526632322712).",
    };
  }

  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message.slice(0, 4096) },
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.warn("[WhatsApp salida] Graph API:", res.status, detail);
      const hint =
        res.status === 400 || detail.toLowerCase().includes("template")
          ? "Meta rechazó el mensaje; si el destinatario no te ha escrito antes, necesitas una plantilla aprobada o que escriban primero a tu número de negocio."
          : "Meta devolvió error. Copia este log y revisa el panel de WhatsApp Cloud / permisos del token.";
      return {
        outcome: "error",
        detalleEs: hint,
        apiErrorSnippet: detail.slice(0, 420),
      };
    }
    return {
      outcome: "sent",
      detalleEs: `Mensaje enviado a WhatsApp (${to}).`,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn("[WhatsApp salida] fetch:", e);
    return {
      outcome: "error",
      detalleEs: `No se pudo conectar con graph.facebook.com: ${msg}`,
    };
  }
}

/** @deprecated Usar sendExitAttemptWhatsApp — este alias devolvía estado simple. */
export const sendPrefectureWhatsAppIfConfigured = async (
  message: string
): Promise<"skipped" | "sent" | "error"> => {
  const r = await sendExitAttemptWhatsApp(message);
  return r.outcome;
};
