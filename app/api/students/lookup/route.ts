import { NextResponse } from "next/server";
import type { Student } from "@/lib/types";
import { getSupabaseServerClient } from "@/lib/supabase";

type StudentRow = {
  id: string;
  matricula: string;
  nombre: string;
  apellidos: string;
  grupo: string;
  carrera: string;
  qr_payload: string;
};

type LookupPayload = {
  enrollment?: string;
  qrPayload?: string;
};

function mapStudentRowToStudent(row: StudentRow): Student {
  const fullName = `${row.nombre} ${row.apellidos}`.trim();
  return {
    id: row.id,
    enrollment: row.matricula,
    fullName,
    gradeGroup: row.grupo,
    career: row.carrera,
    semesterGroup: row.grupo,
    credentialQrPayload: row.qr_payload,
    photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0A2A66&color=fff&size=256`,
    guardianEmail: "",
    allowedExitTimes: ["14:00"],
    absences: 0,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LookupPayload;
    const enrollment = body.enrollment?.trim() ?? "";
    const qrPayload = body.qrPayload?.trim() ?? "";

    if (!enrollment && !qrPayload) {
      return NextResponse.json({ error: "Payload invalido." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    let row: StudentRow | null = null;

    if (qrPayload) {
      const byQr = await supabase
        .from("students")
        .select("id, matricula, nombre, apellidos, grupo, carrera, qr_payload")
        .eq("qr_payload", qrPayload)
        .maybeSingle();
      if (byQr.error) throw new Error(byQr.error.message);
      row = (byQr.data as StudentRow | null) ?? null;
    }

    if (!row && enrollment) {
      const byEnrollment = await supabase
        .from("students")
        .select("id, matricula, nombre, apellidos, grupo, carrera, qr_payload")
        .eq("matricula", enrollment)
        .maybeSingle();
      if (byEnrollment.error) throw new Error(byEnrollment.error.message);
      row = (byEnrollment.data as StudentRow | null) ?? null;
    }

    return NextResponse.json({ ok: true, student: row ? mapStudentRowToStudent(row) : null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
