import { accessLogResultBadgeClasses, logTableSkin } from "@/lib/app-visual-theme";
import type { AppVisualTheme } from "@/lib/app-visual-theme";
import { accessResultLabel } from "@/lib/access-result-labels";
import type { AccessRecord } from "@/lib/types";

type PrefectureLogTableProps = {
  records: AccessRecord[];
  visualTheme?: AppVisualTheme;
};

export function PrefectureLogTable({ records, visualTheme = "classic" }: PrefectureLogTableProps) {
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
              <th className="px-3 py-2">Alumno</th>
              <th className="px-3 py-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
                  Aun no hay escaneos registrados.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={`${record.enrollment}-${record.scannedAt}`} className={skin.rowBorder}>
                  <td className="px-3 py-2">{record.scannedAt}</td>
                  <td className="px-3 py-2">{record.enrollment}</td>
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
    </section>
  );
}
