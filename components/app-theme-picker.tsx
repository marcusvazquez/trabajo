"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { AppVisualTheme } from "@/lib/app-visual-theme";

const OPTIONS: { id: AppVisualTheme; label: string; hint: string }[] = [
  { id: "classic", label: "Clásico", hint: "Azul CECYTE · dorado" },
  { id: "security", label: "Seguridad", hint: "Modo azul / operativo" },
  { id: "lince", label: "Lince", hint: "Guinda · oro" },
];

type AppThemePickerProps = {
  value: AppVisualTheme;
  onChange: (theme: AppVisualTheme) => void;
  /** Panel desplegable (fondo del menu) */
  menuShellClassName?: string;
  /** Boton minimalista (borde / texto) */
  triggerClassName?: string;
  /** Alineacion del menu respecto al boton */
  menuAlign?: "left" | "right";
};

export function AppThemePicker({
  value,
  onChange,
  menuShellClassName,
  triggerClassName,
  menuAlign = "right",
}: AppThemePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onOutside, true);
    return () => document.removeEventListener("pointerdown", onOutside, true);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-haspopup="listbox"
        title={`Tema: ${OPTIONS.find((o) => o.id === value)?.label ?? ""}`}
        onClick={() => setOpen((v) => !v)}
        className={`min-h-11 justify-center sm:min-h-0 ${
          triggerClassName ??
          "flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-200 transition hover:bg-white/10"
        }`}
      >
        <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Neon
      </button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Aspecto visual"
          className={`absolute top-[calc(100%+0.35rem)] z-50 min-w-[11.5rem] rounded-2xl border p-1 shadow-lg ${
            menuAlign === "right" ? "right-0" : "left-0"
          } ${menuShellClassName ?? "border-white/15 bg-[#0a1020]/98 backdrop-blur-sm"}`}
        >
          {OPTIONS.map((opt) => {
            const active = value === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={active}
                title={opt.hint}
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                className={`flex w-full flex-col rounded-xl px-3 py-2 text-left transition ${
                  active
                    ? "bg-white/15 font-semibold text-white"
                    : "text-slate-300 hover:bg-white/8 hover:text-white"
                }`}
              >
                <span className="text-[0.65rem] uppercase tracking-[0.18em]">{opt.label}</span>
                <span className="mt-0.5 text-[0.55rem] font-normal normal-case tracking-normal text-slate-500">
                  {opt.hint}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
