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

function qrVariants(qrPayload: string): string[] {
  const normalized = qrPayload.trim();
  if (!normalized) return [];

  const variants = new Set<string>();
  variants.add(normalized);

  const noTrailingSlash = normalized.replace(/\/+$/, "");
  variants.add(noTrailingSlash);

  variants.add(noTrailingSlash.replace(/^http:\/\//i, "https://"));
  variants.add(noTrailingSlash.replace(/^https?:\/\/www\./i, "https://"));
  variants.add(noTrailingSlash.replace(/^https?:\/\//i, "https://www."));

  return [...variants].filter(Boolean);
}

function extractCredentialIdFromQr(qrPayload: string): string | null {
  const match = qrPayload.match(/\/credential\/(\d+)\//i);
  return match?.[1] ?? null;
}

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
    /** Vacío: la salida se gobierna por ventanas de grupo en prefectura (tabla group_exit_windows). */
    allowedExitTimes: [],
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
      const variants = qrVariants(qrPayload);
      for (const variant of variants) {
        const byQr = await supabase
          .from("students")
          .select("id, matricula, nombre, apellidos, grupo, carrera, qr_payload")
          .eq("qr_payload", variant)
          .maybeSingle();
        if (byQr.error) throw new Error(byQr.error.message);
        row = (byQr.data as StudentRow | null) ?? null;
        if (row) break;
      }
    }

    if (!row && qrPayload) {
      const credentialId = extractCredentialIdFromQr(qrPayload);
      if (credentialId) {
        const byCredentialId = await supabase
          .from("students")
          .select("id, matricula, nombre, apellidos, grupo, carrera, qr_payload")
          .ilike("qr_payload", `%/credential/${credentialId}/%`)
          .limit(1)
          .maybeSingle();
        if (byCredentialId.error) throw new Error(byCredentialId.error.message);
        row = (byCredentialId.data as StudentRow | null) ?? null;
      }
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
