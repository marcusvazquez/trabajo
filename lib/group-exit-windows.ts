import type { GroupExitWindow } from "@/lib/types";
import type { DemoGroupCode } from "@/lib/student-group";

/** Ventanas iniciales; ids deben coincidir con `supabase_group_exit_windows.sql` para que el upsert funcione. */
export const INITIAL_GROUP_EXIT_WINDOWS: GroupExitWindow[] = [
  {
    id: "11111111-1111-1111-1111-1111111111aa",
    groupCode: "4DPGM",
    dayOfWeek: 1,
    startTime: "16:00",
    endTime: "19:30",
    enabled: true,
  },
  {
    id: "22222222-2222-2222-2222-2222222222bb",
    groupCode: "4CPGM",
    dayOfWeek: 3,
    startTime: "16:00",
    endTime: "19:30",
    enabled: true,
  },
];

export function minutesFromClock(hhmm: string): number {
  const parts = hhmm.trim().split(":");
  const h = Number(parts[0]);
  const m = Number(parts[1] ?? 0);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN;
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
    if (!w.enabled || w.groupCode.trim().toUpperCase() !== groupCode) return false;
    if (w.dayOfWeek !== dow) return false;
    const start = minutesFromClock(w.startTime);
    const end = minutesFromClock(w.endTime);
    if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
    return mins >= start && mins <= end;
  });
}
