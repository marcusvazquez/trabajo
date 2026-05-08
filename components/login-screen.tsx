"use client";

import { Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AppThemePicker } from "@/components/app-theme-picker";
import { loginSkin } from "@/lib/app-visual-theme";
import type { AppVisualTheme } from "@/lib/app-visual-theme";

const INSTITUTIONAL_SUFFIX = "@cecytebc.edu.mx";

type LoginScreenProps = {
  onLogin: () => void;
  visualTheme: AppVisualTheme;
  onVisualThemeChange: (theme: AppVisualTheme) => void;
};

export function LoginScreen({ onLogin, visualTheme, onVisualThemeChange }: LoginScreenProps) {
  const [email, setEmail] = useState(`prefectura${INSTITUTIONAL_SUFFIX}`);
  const skin = loginSkin(visualTheme);

  const handleEnter = (event?: React.FormEvent) => {
    event?.preventDefault();
    onLogin();
  };

  return (
    <section
      className={`anim-scale-in relative mx-auto mt-8 w-full max-w-xl rounded-3xl p-8 text-white backdrop-blur ${skin.section}`}
    >
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <AppThemePicker
          value={visualTheme}
          onChange={onVisualThemeChange}
          menuShellClassName={skin.themeMenuShell}
          triggerClassName={skin.themeNeonTrigger}
          menuAlign="right"
        />
      </div>

      <div className="anim-fade-in anim-delay-100 mb-8 text-center">
        <ShieldCheck className={`mx-auto mb-3 h-10 w-10 ${skin.title}`} />
        <h1 className={`text-5xl font-semibold tracking-[0.35em] ${skin.title}`}>LINCE</h1>
        <p className="mt-2 text-xs tracking-[0.25em] text-slate-300">
          SISTEMA DE CONTROL DE ACCESO · CECYTE
        </p>
      </div>

      <form className="anim-slide-up anim-delay-200 space-y-4" onSubmit={handleEnter}>
        <h2 className={`py-2 text-center text-2xl tracking-[0.15em] ${skin.title}`}>
          INICIAR SESION
        </h2>
        <label className="block text-xs font-medium tracking-[0.2em] text-slate-300">
          CORREO INSTITUCIONAL
        </label>
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder={`usuario${INSTITUTIONAL_SUFFIX}`}
          className={`w-full rounded-xl border border-[#2b4693] bg-[#041239] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:ring-2 ${skin.ring}`}
        />

        <label className="block text-xs font-medium tracking-[0.2em] text-slate-300">CONTRASENA</label>
        <input
          type="password"
          autoComplete="current-password"
          defaultValue="******"
          className={`w-full rounded-xl border border-[#2b4693] bg-[#041239] px-4 py-3 text-white outline-none focus:ring-2 ${skin.ring}`}
        />
        <button
          type="submit"
          className={`anim-press anim-lift mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-lg font-semibold tracking-[0.2em] transition ${skin.submit}`}
        >
          <Lock className="h-5 w-5" />
          ENTRAR
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-slate-300">
        cuidarte a ti es darle calma al hogar
      </p>
    </section>
  );
}
