import type { GroupExitWindow } from "@/lib/types";
import type { DemoGroupCode } from "@/lib/student-group";

export const TIJUANA_TIME_ZONE = "America/Tijuana";

/** Ventanas iniciales; ids deben coincidir con `supabase_group_exit_windows.sql` para que el upsert funcione. */
export const INITIAL_GROUP_EXIT_WINDOWS: GroupExitWindow[] = [
  {
    id: "11111111-1111-1111-1111-1111111111aa",
    groupCode: "4DPGM",
    dayOfWeek: 5,
    startTime: "13:30",
    endTime: "19:40",
    enabled: true,
  },
  {
    id: "22222222-2222-2222-2222-2222222222bb",
    groupCode: "4CPGM",
    dayOfWeek: 5,
    startTime: "13:30",
    endTime: "19:40",
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

const WEEKDAY_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function getTijuanaClockContext(now: Date): { dayOfWeek: number; minutes: number } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIJUANA_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const weekdayShort = parts.find((part) => part.type === "weekday")?.value ?? "Sun";
  const hourText = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minuteText = parts.find((part) => part.type === "minute")?.value ?? "00";

  const dayOfWeek = WEEKDAY_TO_INDEX[weekdayShort] ?? 0;
  const minutes = Number(hourText) * 60 + Number(minuteText);

  return { dayOfWeek, minutes };
}

/** Comprueba si `now` cae en alguna ventana habilitada para ese código de grupo. */
export function isWithinGroupExitWindow(
  groupCode: DemoGroupCode,
  windows: GroupExitWindow[],
  now: Date
): boolean {
  const { dayOfWeek: dow, minutes: mins } = getTijuanaClockContext(now);

  return windows.some((w) => {
    if (!w.enabled || w.groupCode.trim().toUpperCase() !== groupCode) return false;
    if (w.dayOfWeek !== dow) return false;
    const start = minutesFromClock(w.startTime);
    const end = minutesFromClock(w.endTime);
    if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
    return mins >= start && mins <= end;
  });
}
