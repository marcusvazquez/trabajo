import { accessLogResultBadgeClasses, logTableSkin } from "@/lib/app-visual-theme";
import type { AppVisualTheme } from "@/lib/app-visual-theme";
import { accessResultLabel } from "@/lib/access-result-labels";
import type { AccessRecord } from "@/lib/types";

type PrefectureLogTableProps = {
  records: AccessRecord[];
  visualTheme?: AppVisualTheme;
  historyCount?: number;
  onOpenHistory?: () => void;
};

export function PrefectureLogTable({
  records,
  visualTheme = "classic",
  historyCount = 0,
  onOpenHistory,
}: PrefectureLogTableProps) {
  const skin = logTableSkin(visualTheme);

  return (
    <section className={skin.section}>
      <h3 className={`mb-4 text-lg font-semibold ${skin.heading}`}>Bitacora de Prefectura</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] border-collapse text-sm">
          <thead>
            <tr className={skin.thead}>
              <th className="px-3 py-2">Hora</th>
              <th className="px-3 py-2">Matricula</th>
              <th className="px-3 py-2">Grupo</th>
              <th className="px-3 py-2">Alumno</th>
              <th className="px-3 py-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                  Aun no hay escaneos registrados.
                </td>
              </tr>
            ) : (
              records.map((record, rowIndex) => (
                <tr
                  key={record.id}
                  className={`${skin.rowBorder} ${rowIndex === 0 ? "anim-slide-up" : ""}`}
                >
                  <td className="px-3 py-2">{record.scannedAt}</td>
                  <td className="px-3 py-2">{record.enrollment}</td>
                  <td className="px-3 py-2">{record.group || "—"}</td>
                  <td className="px-3 py-2">{record.studentName}</td>
                  <td className="px-3 py-2">
                    <span className={accessLogResultBadgeClasses(visualTheme, record.result)}>
                      {accessResultLabel(record.result)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {onOpenHistory ? (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onOpenHistory}
            className="anim-press anim-lift rounded-md border border-slate-500/40 px-3 py-1.5 text-xs text-slate-200 hover:border-slate-300/60 hover:text-white"
          >
            Historial ({historyCount})
          </button>
        </div>
      ) : null}
    </section>
  );
}
