import { desertionSkin } from "@/lib/app-visual-theme";
import type { AppVisualTheme } from "@/lib/app-visual-theme";
import type { Student } from "@/lib/types";
import { TriangleAlert } from "lucide-react";

type DesertionAlertsProps = {
  students: Student[];
  threshold: number;
  visualTheme?: AppVisualTheme;
};

export function DesertionAlerts({
  students,
  threshold,
  visualTheme = "classic",
}: DesertionAlertsProps) {
  const atRiskStudents = students.filter((student) => student.absences >= threshold);
  const skin = desertionSkin(visualTheme);

  return (
    <section className={skin.section}>
      <div className="mb-3 flex items-center gap-2">
        <TriangleAlert className={`h-5 w-5 ${skin.icon}`} />
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
            <li key={student.id} className="rounded-lg bg-black/20 px-3 py-2">
              <strong>{student.fullName}</strong> - {student.gradeGroup} - {student.absences}{" "}
              inasistencias
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
