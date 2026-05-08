"use client";

import type { CSSProperties } from "react";
import { useEffect } from "react";
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

  const pulseGlowVar: CSSProperties = {
    "--pulse-glow-color":
      visualTheme === "security"
        ? "rgba(56, 189, 248, 0.2)"
        : visualTheme === "lince"
          ? "rgba(245, 200, 58, 0.18)"
          : "rgba(244, 63, 94, 0.15)",
  };

  useEffect(() => {
    if (alerts.length === 0) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [alerts.length]);

  if (alerts.length === 0) return null;

  return (
    <div
      className="anim-fade-in fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prefecture-exit-alerts-title"
      aria-describedby="prefecture-exit-alerts-desc"
    >
      <div
        className={`anim-scale-in anim-pulse-alert flex max-h-[min(85vh,560px)] w-full max-w-lg flex-col overflow-hidden rounded-xl shadow-2xl ${skin.section}`}
        style={pulseGlowVar}
      >
        <div className="flex shrink-0 flex-wrap items-start gap-3 border-b border-white/10 bg-black/15 px-5 py-4">
          <BellRing className={`h-7 w-7 shrink-0 ${skin.pulse}`} />
          <div className="min-w-0 flex-1">
            <h3 id="prefecture-exit-alerts-title" className={`text-lg font-semibold ${skin.heading}`}>
              Avisos a prefectura · intentos repetidos de salida
            </h3>
            <p id="prefecture-exit-alerts-desc" className={`mt-1 text-sm ${skin.sub}`}>
              Tras {EXIT_DENIAL_ALERT_THRESHOLD} denegaciones consecutivas del mismo alumno (misma
              matrícula) se genera un aviso y se registra en el servidor. El aviso puede enviarse por
              WhatsApp al celular de prefectura.
            </p>
          </div>
        </div>

        <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
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
                  className={`anim-press inline-flex shrink-0 items-center gap-1 ${skin.btn}`}
                >
                  <X className="h-3.5 w-3.5" />
                  Atendido
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
