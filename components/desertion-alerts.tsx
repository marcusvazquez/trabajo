import type { Student } from "@/lib/types";
import { TriangleAlert } from "lucide-react";

type DesertionAlertsProps = {
  students: Student[];
  threshold: number;
};

export function DesertionAlerts({ students, threshold }: DesertionAlertsProps) {
  const atRiskStudents = students.filter((student) => student.absences >= threshold);

  return (
    <section className="rounded-xl border border-[#5f1f28] bg-[#5f1f28] p-5 text-white shadow-xl">
      <div className="mb-3 flex items-center gap-2">
        <TriangleAlert className="h-5 w-5 text-[#f3c64f]" />
        <h3 className="text-lg font-semibold">Alertas de Desercion</h3>
      </div>
      <p className="mb-4 text-sm text-rose-100">
        Alumnos con {threshold} o mas inasistencias para intervencion temprana.
      </p>

      {atRiskStudents.length === 0 ? (
        <p className="text-sm text-rose-100">Sin alumnos en riesgo por ahora.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {atRiskStudents.map((student) => (
            <li key={student.id} className="rounded-lg bg-[#7a2a35] px-3 py-2">
              <strong>{student.fullName}</strong> - {student.gradeGroup} - {student.absences} inasistencias
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
