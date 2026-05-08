"use client";

import { CalendarClock, Users } from "lucide-react";
import { groupAuthPanelSkin } from "@/lib/app-visual-theme";
import type { AppVisualTheme } from "@/lib/app-visual-theme";
import type { GroupExitWindow } from "@/lib/types";

const WEEKDAYS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
] as const;

type GroupExitAuthorizationPanelProps = {
  windows: GroupExitWindow[];
  onChange: (next: GroupExitWindow[]) => void;
  visualTheme: AppVisualTheme;
};

export function GroupExitAuthorizationPanel({
  windows,
  onChange,
  visualTheme,
}: GroupExitAuthorizationPanelProps) {
  const skin = groupAuthPanelSkin(visualTheme);

  const patch = (id: string, partial: Partial<GroupExitWindow>) => {
    onChange(windows.map((w) => (w.id === id ? { ...w, ...partial } : w)));
  };

  return (
    <section className={skin.section}>
      <div className="mb-4 flex flex-wrap items-start gap-3">
        <div className={`rounded-lg border border-current/20 p-2 ${skin.heading}`}>
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${skin.heading}`}>Autorización por grupo</h3>
          <p className={`text-sm ${skin.sub}`}>
            Define el día y el intervalo horario en que la salida queda autorizada para 4DPGM y 4CPGM
            (además de los horarios individuales del alumno).
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {windows.map((w) => (
          <div
            key={w.id}
            className="space-y-3 rounded-lg border border-white/10 bg-black/10 p-4 backdrop-blur-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={skin.chip}>{w.groupCode}</span>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={w.enabled}
                  onChange={(e) => patch(w.id, { enabled: e.target.checked })}
                  className={skin.toggle}
                />
                <span className={skin.sub}>Activa</span>
              </label>
            </div>

            <div>
              <span className={skin.label}>DÍA DE LA SEMANA</span>
              <select
                value={w.dayOfWeek}
                onChange={(e) => patch(w.id, { dayOfWeek: Number(e.target.value) })}
                disabled={!w.enabled}
                className={`mt-1 ${skin.select} disabled:opacity-50`}
              >
                {WEEKDAYS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className={skin.label}>DESDE</span>
                <input
                  type="time"
                  value={w.startTime}
                  onChange={(e) => patch(w.id, { startTime: e.target.value })}
                  disabled={!w.enabled}
                  className={`mt-1 ${skin.input} disabled:opacity-50`}
                />
              </div>
              <div>
                <span className={skin.label}>HASTA</span>
                <input
                  type="time"
                  value={w.endTime}
                  onChange={(e) => patch(w.id, { endTime: e.target.value })}
                  disabled={!w.enabled}
                  className={`mt-1 ${skin.input} disabled:opacity-50`}
                />
              </div>
            </div>

            <p className={`flex items-center gap-1.5 text-xs ${skin.sub}`}>
              <CalendarClock className="h-3.5 w-3.5 shrink-0" />
              Solo aplica a alumnos cuya credencial indique ese grupo (ej. 4TO | DPGM).
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
