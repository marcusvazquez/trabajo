"use client";

import { Lock, ShieldCheck } from "lucide-react";

type LoginScreenProps = {
  onLogin: () => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <section className="mx-auto mt-10 w-full max-w-md rounded-2xl border border-[#12367f] bg-[#0a2a66] p-8 text-white shadow-2xl">
      <div className="mb-8 text-center">
        <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-[#f3c64f]" />
        <h1 className="text-3xl font-bold">Ojo de Lince</h1>
        <p className="mt-2 text-sm text-slate-200">
          Sistema de control de acceso - CECYTE BC Villa del Sol
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium">Usuario Prefectura</label>
        <input
          type="text"
          defaultValue="prefectura.cecyte"
          className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 outline-none ring-[#f3c64f] focus:ring-2"
        />
        <label className="block text-sm font-medium">Contrasena</label>
        <input
          type="password"
          defaultValue="******"
          className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 outline-none ring-[#f3c64f] focus:ring-2"
        />
        <button
          type="button"
          onClick={onLogin}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#f3c64f] px-4 py-3 font-bold text-[#0a2a66] transition hover:bg-[#ffd972]"
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
