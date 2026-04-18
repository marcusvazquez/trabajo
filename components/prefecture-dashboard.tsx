"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CheckCircle2, ShieldAlert, UserSquare2 } from "lucide-react";
import { ScannerPanel } from "@/components/scanner-panel";
import { PrefectureLogTable } from "@/components/prefecture-log-table";
import { DesertionAlerts } from "@/components/desertion-alerts";
import { STUDENTS } from "@/lib/mock-data";
import type { AccessRecord, Student, ValidationResult } from "@/lib/types";
import { getCurrentHourLabel, validateExit } from "@/lib/validation";

type DashboardProps = {
  onLogout: () => void;
};

type ScanState = {
  student: Student | null;
  result: ValidationResult | null;
  reason: string;
};

export function PrefectureDashboard({ onLogout }: DashboardProps) {
  const [records, setRecords] = useState<AccessRecord[]>([]);
  const [scanState, setScanState] = useState<ScanState>({
    student: null,
    result: null,
    reason: "",
  });

  const totalDenied = useMemo(
    () => records.filter((record) => record.result === "DENEGADO").length,
    [records]
  );

  const handleScan = async (enrollmentRaw: string) => {
    const enrollment = enrollmentRaw.replace(/\s+/g, "");
    const now = new Date();
    const scannedAt = getCurrentHourLabel(now);
    const student = STUDENTS.find((candidate) => candidate.enrollment === enrollment);

    if (!student) {
      const reason = "Matricula no registrada en el sistema.";
      const deniedRecord: AccessRecord = {
        scannedAt,
        enrollment,
        studentName: "No identificado",
        result: "DENEGADO",
        reason,
      };
      setScanState({ student: null, result: "DENEGADO", reason });
      setRecords((previous) => [deniedRecord, ...previous].slice(0, 30));
      return;
    }

    const { result, reason } = validateExit(student, now);
    const newRecord: AccessRecord = {
      scannedAt,
      enrollment: student.enrollment,
      studentName: student.fullName,
      result,
      reason,
    };

    setScanState({ student, result, reason });
    setRecords((previous) => [newRecord, ...previous].slice(0, 30));

    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student,
        result,
        scannedAt,
        reason,
      }),
    });
  };

  return (
    <section className="space-y-5 text-slate-100">
      <header className="flex flex-wrap items-center justify-between rounded-2xl border border-[#203f87] bg-[#061741]/95 p-5 text-white">
        <div>
          <h2 className="text-2xl font-bold">Panel de Prefectura</h2>
          <p className="text-sm text-slate-200">Control de acceso inteligente en tiempo real.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-lg border border-[#2b4693] bg-[#0b245d] px-3 py-2 text-sm">
            Escaneos: <strong>{records.length}</strong> | Denegados: <strong>{totalDenied}</strong>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-[#d8b24b] px-4 py-2 text-sm font-semibold text-[#d8b24b]"
          >
            Cerrar sesion
          </button>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <ScannerPanel onEnrollmentDetected={handleScan} />

        <section className="rounded-xl border border-[#203f87] bg-[#061741]/95 p-5 shadow-xl">
          <div className="mb-3 flex items-center gap-2 text-[#d8b24b]">
            <UserSquare2 className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Resultado de Validacion</h3>
          </div>

          {!scanState.result ? (
            <p className="text-sm text-slate-300">Esperando escaneo de credencial...</p>
          ) : (
            <div className="space-y-4">
              {scanState.student ? (
                <div className="flex items-center gap-4">
                  <Image
                    src={scanState.student.photoUrl}
                    alt={`Foto de ${scanState.student.fullName}`}
                    width={84}
                    height={84}
                    className="rounded-lg border border-slate-300 object-cover"
                  />
                  <div className="text-sm">
                    <p className="font-bold text-slate-100">{scanState.student.fullName}</p>
                    <p className="text-slate-300">Matricula: {scanState.student.enrollment}</p>
                    <p className="text-slate-300">Grupo: {scanState.student.gradeGroup}</p>
                  </div>
                </div>
              ) : null}

              <div
                className={`rounded-lg p-3 text-sm font-semibold ${
                  scanState.result === "AUTORIZADO"
                    ? "bg-emerald-900/60 text-emerald-200"
                    : "bg-[#5f1f28] text-white"
                }`}
              >
                <p className="flex items-center gap-2">
                  {scanState.result === "AUTORIZADO" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <ShieldAlert className="h-4 w-4" />
                  )}
                  {scanState.result === "AUTORIZADO" ? "ACCESO AUTORIZADO" : "ACCESO DENEGADO"}
                </p>
                <p className="mt-1 font-normal">{scanState.reason}</p>
              </div>
            </div>
          )}
        </section>
      </div>

      <PrefectureLogTable records={records} />
      <DesertionAlerts students={STUDENTS} threshold={6} />
    </section>
  );
}
