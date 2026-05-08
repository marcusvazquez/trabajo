/**
 * Base temporal: enlaza credenciales oficiales (URL del QR CECYTE) con matrícula
 * y estado de salida. Sustituir o sincronizar con BD real cuando exista.
 */
export type TemporaryCredentialExit = {
  /** URL exacta del QR (como la devuelve el lector). */
  credentialUrls: string[];
  /** Segmentos de ruta `plantelId/expediente` tras `/credential/`. */
  credentialPathIds: string[];
  enrollment: string;
  /** Si es true, el panel trata el escaneo como “ya registró salida”. */
  alreadyExited: boolean;
};

export const TEMPORARY_CREDENTIAL_EXITS: TemporaryCredentialExit[] = [
  {
    credentialUrls: [
      "https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/265147/05669",
    ],
    credentialPathIds: ["265147/05669"],
    enrollment: "244020800510167",
    alreadyExited: true,
  },
];

export function matchTemporaryCredentialExit(raw: string): TemporaryCredentialExit | null {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();

  const pathMatch = trimmed.match(/\/credential\/(\d+)\/(\d+)(?:\?|#|$|\/|\s)/i);
  const pathId = pathMatch ? `${pathMatch[1]}/${pathMatch[2]}` : null;

  for (const record of TEMPORARY_CREDENTIAL_EXITS) {
    for (const url of record.credentialUrls) {
      if (lower === url.toLowerCase()) return record;
    }
    if (pathId && record.credentialPathIds.includes(pathId)) return record;
  }

  const compact = trimmed.replace(/\s+/g, "");
  for (const record of TEMPORARY_CREDENTIAL_EXITS) {
    if (record.enrollment === compact) return record;
  }

  return null;
}
