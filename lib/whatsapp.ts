export type WhatsAppDelivery = {
  outcome: "sent" | "skipped" | "error";
  detalleEs: string;
  apiErrorSnippet?: string;
};

function getCallMeBotConfig() {
  const phone = process.env.WHATSAPP_PHONE?.trim();
  const apikey = process.env.WHATSAPP_APIKEY?.trim();
  return { phone, apikey };
}

export async function sendWhatsAppNotification(text: string): Promise<WhatsAppDelivery> {
  const { phone, apikey } = getCallMeBotConfig();

  if (!phone) {
    return {
      outcome: "skipped",
      detalleEs: "WhatsApp no configurado: falta WHATSAPP_PHONE en variables de entorno.",
    };
  }

  if (!apikey) {
    return {
      outcome: "skipped",
      detalleEs: "WhatsApp no configurado: falta WHATSAPP_APIKEY en variables de entorno.",
    };
  }

  try {
    const url = new URL("https://api.callmebot.com/whatsapp.php");
    url.searchParams.set("phone", phone);
    url.searchParams.set("text", text.slice(0, 2000));
    url.searchParams.set("apikey", apikey);

    const response = await fetch(url.toString(), { method: "GET" });
    const body = await response.text();

    if (!response.ok) {
      return {
        outcome: "error",
        detalleEs: `CallMeBot devolvio ${response.status}.`,
        apiErrorSnippet: body.slice(0, 420),
      };
    }

    return {
      outcome: "sent",
      detalleEs: `Mensaje enviado por CallMeBot a ${phone}.`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      outcome: "error",
      detalleEs: `No se pudo conectar con CallMeBot: ${message}`,
    };
  }
}
