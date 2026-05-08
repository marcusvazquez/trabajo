import type { GroupExitWindow } from "@/lib/types";
import type { DemoGroupCode } from "@/lib/student-group";

/** Ventanas de prueba: lunes vespertino 4DPGM; miércoles 4CPGM (editables en el panel). */
export const INITIAL_GROUP_EXIT_WINDOWS: GroupExitWindow[] = [
  {
    id: "ge-4dpgm",
    groupCode: "4DPGM",
    dayOfWeek: 1,
    startTime: "16:00",
    endTime: "19:30",
    enabled: true,
  },
  {
    id: "ge-4cpgm",
    groupCode: "4CPGM",
    dayOfWeek: 3,
    startTime: "16:00",
    endTime: "19:30",
    enabled: true,
  },
];

export function minutesFromClock(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Comprueba si `now` cae en alguna ventana habilitada para ese código de grupo. */
export function isWithinGroupExitWindow(
  groupCode: DemoGroupCode,
  windows: GroupExitWindow[],
  now: Date
): boolean {
  const dow = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();

  return windows.some((w) => {
    if (!w.enabled || w.groupCode !== groupCode) return false;
    if (w.dayOfWeek !== dow) return false;
    const start = minutesFromClock(w.startTime);
    const end = minutesFromClock(w.endTime);
    return mins >= start && mins <= end;
  });
}
