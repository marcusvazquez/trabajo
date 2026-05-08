"use client";

import { BellRing, X } from "lucide-react";
import { prefectureExitAlertPanelSkin } from "@/lib/app-visual-theme";
import type { AppVisualTheme } from "@/lib/app-visual-theme";
import { EXIT_DENIAL_ALERT_THRESHOLD } from "@/lib/repeated-exit-denials";
import type { PrefectureExitDenialAlert } from "@/lib/types";

type PrefectureRepeatedExitAlertPanelProps = {
  alerts: PrefectureExitDenialAlert[];
  visualTheme: AppVisualTheme;
  onDismiss: (id: string, enrollment: string) => void;
};

export function PrefectureRepeatedExitAlertPanel({
  alerts,
  visualTheme,
  onDismiss,
}: PrefectureRepeatedExitAlertPanelProps) {
  const skin = prefectureExitAlertPanelSkin(visualTheme);

  return (
    <section
      className={`${skin.section} anim-slide-up ${alerts.length > 0 ? "anim-pulse-alert" : ""}`}
    >
      <div className="mb-4 flex flex-wrap items-start gap-3">
        <BellRing className={`h-7 w-7 shrink-0 ${skin.pulse}`} />
        <div className="min-w-0 flex-1">
          <h3 className={`text-lg font-semibold ${skin.heading}`}>
            Avisos a prefectura · intentos repetidos de salida
          </h3>
          <p className={`text-sm ${skin.sub}`}>
            Tras {EXIT_DENIAL_ALERT_THRESHOLD} denegaciones consecutivas del mismo alumno (misma
            matrícula) se genera un aviso y se registra en el servidor. El aviso puede enviarse por
            WhatsApp al celular de prefectura.
          </p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <p className={`text-sm ${skin.sub}`}>No hay avisos pendientes.</p>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert) => (
            <li key={alert.id} className={`${skin.card} anim-slide-up`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-white">{alert.studentName}</p>
                  <p className={`text-xs ${skin.meta}`}>
                    <span className="font-medium text-slate-400">Matrícula o identificador · </span>
                    <span className="break-all" title={alert.enrollment}>
                      {alert.enrollment.startsWith("qr:")
                        ? alert.enrollment.slice(4) || "(lectura QR)"
                        : alert.enrollment}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    <strong>{alert.denialStreakTotal}</strong> intentos denegados seguidos · desde{" "}
                    <span className="tabular-nums">{alert.firstReachedAt}</span> (último:{" "}
                    <span className="tabular-nums">{alert.lastAttemptAt}</span>)
                  </p>
                  <p className={`mt-1 truncate text-xs ${skin.meta}`} title={alert.credentialLabel}>
                    Lectura: {alert.credentialLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDismiss(alert.id, alert.enrollment)}
                  className={`inline-flex shrink-0 items-center gap-1 ${skin.btn}`}
                >
                  <X className="h-3.5 w-3.5" />
                  Atendido
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
