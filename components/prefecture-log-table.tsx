import type { AccessRecord } from "@/lib/types";

type PrefectureLogTableProps = {
  records: AccessRecord[];
};

export function PrefectureLogTable({ records }: PrefectureLogTableProps) {
  return (
    <section className="rounded-xl border border-[#12367f] bg-white p-5 shadow-xl">
      <h3 className="mb-4 text-lg font-semibold text-[#0a2a66]">Bitacora de Prefectura</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-left text-slate-700">
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
                <tr key={`${record.enrollment}-${record.scannedAt}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{record.scannedAt}</td>
                  <td className="px-3 py-2">{record.enrollment}</td>
                  <td className="px-3 py-2">{record.studentName}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        record.result === "AUTORIZADO"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-[#5f1f28] text-white"
                      }`}
                    >
                      {record.result}
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
