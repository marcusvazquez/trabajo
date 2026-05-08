export type WhatsAppDelivery = {
  outcome: "sent" | "skipped" | "error";
  detalleEs: string;
  apiErrorSnippet?: string;
};

const MIN_INTERVAL_MS = 2500;
const RECENT_DEDUPE_WINDOW_MS = 8000;

let sendChain: Promise<unknown> = Promise.resolve();
let lastSendAt = 0;
const recentMessages = new Map<string, number>();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCallMeBotConfig() {
  const phone = process.env.WHATSAPP_PHONE?.trim();
  const apikey = process.env.WHATSAPP_APIKEY?.trim();
  return { phone, apikey };
}

async function dispatchToCallMeBot(
  text: string,
  phone: string,
  apikey: string
): Promise<WhatsAppDelivery> {
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

  const dedupeKey = text.trim();
  const now = Date.now();
  for (const [key, timestamp] of recentMessages) {
    if (now - timestamp > RECENT_DEDUPE_WINDOW_MS) {
      recentMessages.delete(key);
    }
  }
  const lastIdentical = recentMessages.get(dedupeKey);
  if (lastIdentical && now - lastIdentical < RECENT_DEDUPE_WINDOW_MS) {
    return {
      outcome: "skipped",
      detalleEs: "Mensaje duplicado reciente, omitido para evitar spam.",
    };
  }
  recentMessages.set(dedupeKey, now);

  const turn = sendChain.then(async () => {
    const elapsed = Date.now() - lastSendAt;
    if (elapsed < MIN_INTERVAL_MS) {
      await sleep(MIN_INTERVAL_MS - elapsed);
    }
    const result = await dispatchToCallMeBot(text, phone, apikey);
    lastSendAt = Date.now();
    return result;
  });

  sendChain = turn.catch(() => undefined);
  return turn;
}
