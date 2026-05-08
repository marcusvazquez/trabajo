import type { Student } from "@/lib/types";

const GROUP_CODES = ["4DPGM", "4CPGM"] as const;
export type DemoGroupCode = (typeof GROUP_CODES)[number];

export function isDemoGroupCode(value: string): value is DemoGroupCode {
  return GROUP_CODES.includes(value as DemoGroupCode);
}

/** Indica si el alumno pertenece al grupo de credencial (ej. 4TO | DPGM → 4DPGM). */
export function studentMatchesGroupCode(student: Student, groupCode: DemoGroupCode): boolean {
  const combined = `${student.semesterGroup ?? ""} ${student.gradeGroup ?? ""}`.toUpperCase();
  if (groupCode === "4DPGM") {
    return combined.includes("DPGM") && !combined.replace(/\s/g, "").includes("CPGM");
  }
  if (groupCode === "4CPGM") {
    return combined.includes("CPGM");
  }
  return false;
}
