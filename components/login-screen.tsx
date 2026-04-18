"use client";

import { Lock, ShieldCheck } from "lucide-react";

type LoginScreenProps = {
  onLogin: () => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <section className="mx-auto mt-8 w-full max-w-xl rounded-3xl border border-[#203f87] bg-[#061741]/95 p-8 text-white shadow-[0_0_40px_rgba(2,12,54,0.7)] backdrop-blur">
      <div className="mb-8 text-center">
        <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-[#d8b24b]" />
        <h1 className="text-5xl font-semibold tracking-[0.35em] text-[#d8b24b]">LINCE</h1>
        <p className="mt-2 text-xs tracking-[0.25em] text-slate-300">SISTEMA DE CONTROL DE ACCESO · CECYTE</p>
      </div>

      <div className="space-y-4">
        <h2 className="py-2 text-center text-2xl tracking-[0.15em] text-[#d8b24b]">INICIAR SESION</h2>
        <label className="block text-xs font-medium tracking-[0.2em] text-slate-300">CORREO INSTITUCIONAL</label>
        <input
          type="text"
          defaultValue="prefectura@cecyte.edu.mx"
          className="w-full rounded-xl border border-[#2b4693] bg-[#041239] px-4 py-3 text-white outline-none ring-[#d8b24b] placeholder:text-slate-500 focus:ring-2"
        />
        <label className="block text-xs font-medium tracking-[0.2em] text-slate-300">CONTRASENA</label>
        <input
          type="password"
          defaultValue="******"
          className="w-full rounded-xl border border-[#2b4693] bg-[#041239] px-4 py-3 text-white outline-none ring-[#d8b24b] focus:ring-2"
        />
        <button
          type="button"
          onClick={onLogin}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#d8b24b] px-4 py-3 text-lg font-semibold tracking-[0.2em] text-[#0a1a49] transition hover:bg-[#f0ca61]"
        >
          <Lock className="h-5 w-5" />
          ENTRAR
        </button>
      </div>

      <p className="mt-8 text-center text-xs text-slate-300">
        cuidarte a ti es darle calma al hogar
      </p>
    </section>
  );
}
