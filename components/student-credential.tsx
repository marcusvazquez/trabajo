"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Student } from "@/lib/types";

type StudentCredentialProps = {
  student: Student;
  /** Dark neon frame; QR stays on white for lectores */
  neon?: boolean;
};

export function StudentCredential({ student, neon = false }: StudentCredentialProps) {
  const [qrSrc, setQrSrc] = useState<string | null>(null);

  const qrPayload = student.credentialQrPayload ?? student.enrollment;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(qrPayload, {
        errorCorrectionLevel: "H",
        margin: 4,
        width: 280,
        color: { dark: "#000000", light: "#ffffff" },
      });
      if (!cancelled) setQrSrc(url);
    })();
    return () => {
      cancelled = true;
    };
  }, [qrPayload]);

  const career = student.career ?? "—";
  const semester = student.semesterGroup ?? student.gradeGroup;
  const shift = student.shift ?? "—";
  const validUntil = student.credentialValidUntil ?? "—";

  const shell = neon
    ? "border border-cyan-400/60 bg-[#050510] text-slate-100 shadow-[0_0_32px_rgba(34,211,238,0.25)]"
    : "border border-slate-200 bg-white text-slate-900 shadow-lg";

  const labelCls = neon ? "text-slate-400" : "text-slate-500";
  const valueCls = neon ? "text-white" : "text-slate-900";
  const footerLbl = neon ? "text-slate-400" : "text-slate-500";
  const footerVal = neon ? "text-slate-300" : "text-slate-600";

  return (
    <article
      className={`relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl ${shell}`}
    >
      {!neon ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='%2394a3b8' fill-opacity='0.35'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.08),_transparent_60%)]" />
      )}

      <div className="relative space-y-5 p-6">
        <dl className="space-y-3 text-left text-sm">
          <div>
            <dt className={`text-[0.65rem] font-medium uppercase tracking-[0.2em] ${labelCls}`}>
              Carrera
            </dt>
            <dd className={`mt-0.5 text-base font-semibold tracking-wide ${valueCls}`}>{career}</dd>
          </div>
          <div>
            <dt className={`text-[0.65rem] font-medium uppercase tracking-[0.2em] ${labelCls}`}>
              Semestre y grupo
            </dt>
            <dd className={`mt-0.5 text-base font-semibold ${valueCls}`}>{semester}</dd>
          </div>
          <div>
            <dt className={`text-[0.65rem] font-medium uppercase tracking-[0.2em] ${labelCls}`}>
              Turno
            </dt>
            <dd className={`mt-0.5 text-base font-semibold ${valueCls}`}>{shift}</dd>
          </div>
        </dl>

        <div className="flex flex-col items-center">
          <div
            className={
              neon
                ? "rounded-xl bg-white p-3 shadow-inner ring-2 ring-cyan-400/30"
                : "rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200"
            }
          >
            {qrSrc ? (
              <Image
                src={qrSrc}
                alt={`Codigo QR de matricula ${student.enrollment}`}
                width={280}
                height={280}
                unoptimized
                className="h-auto w-[220px] max-w-full md:w-[260px]"
              />
            ) : (
              <div className="flex h-[220px] w-[220px] items-center justify-center bg-slate-100 text-xs text-slate-500 md:h-[260px] md:w-[260px]">
                Generando QR…
              </div>
            )}
          </div>
          <p className={`mt-2 text-center text-[0.65rem] uppercase tracking-[0.15em] ${labelCls}`}>
            Contenido: matricula &middot; ECC alto
          </p>
        </div>

        <div className="space-y-1 text-center">
          <p className={`text-[0.65rem] font-semibold uppercase tracking-[0.25em] ${footerLbl}`}>
            Valida hasta
          </p>
          <p className={`text-sm font-medium ${footerVal}`}>{validUntil}</p>
        </div>
      </div>
    </article>
  );
}
