import { NextResponse } from "next/server";
import type { GroupExitWindow } from "@/lib/types";
import { getSupabaseServerClient } from "@/lib/supabase";

type GroupExitWindowRow = {
  id: string;
  group_code: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  enabled: boolean;
};

function rowToWindow(row: GroupExitWindowRow): GroupExitWindow {
  return {
    id: row.id,
    groupCode: row.group_code,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time.slice(0, 5),
    endTime: row.end_time.slice(0, 5),
    enabled: row.enabled,
  };
}

function windowToUpsertRow(window: GroupExitWindow) {
  return {
    id: window.id,
    group_code: window.groupCode,
    day_of_week: window.dayOfWeek,
    start_time: `${window.startTime}:00`,
    end_time: `${window.endTime}:00`,
    enabled: window.enabled,
  };
}

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("group_exit_windows")
      .select("id, group_code, day_of_week, start_time, end_time, enabled")
      .order("group_code", { ascending: true });

    if (error) throw new Error(error.message);

    const rows = (data ?? []) as GroupExitWindowRow[];
    return NextResponse.json({ ok: true, windows: rows.map(rowToWindow) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as { windows?: GroupExitWindow[] };
    const windows = Array.isArray(payload.windows) ? payload.windows : [];
    if (windows.length === 0) {
      return NextResponse.json({ error: "Sin ventanas para actualizar." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const rows = windows.map(windowToUpsertRow);
    const { error } = await supabase.from("group_exit_windows").upsert(rows, { onConflict: "id" });
    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
