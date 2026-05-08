"use client";

import type { FormEvent } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AppThemePicker } from "@/components/app-theme-picker";
import { loginSkin } from "@/lib/app-visual-theme";
import type { AppVisualTheme } from "@/lib/app-visual-theme";

const INSTITUTIONAL_SUFFIX = "@cecytebc.edu.mx";
const VALID_EMAIL_REGEX = /^[^\s@]+@cecytebc\.edu\.mx$/i;
const MIN_PASSWORD_LENGTH = 4;
/** RFC práctico / límites del campo */
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 30;

type LoginScreenProps = {
  onLogin: () => void;
  visualTheme: AppVisualTheme;
  onVisualThemeChange: (theme: AppVisualTheme) => void;
};

export function LoginScreen({ onLogin, visualTheme, onVisualThemeChange }: LoginScreenProps) {
  const [email, setEmail] = useState(`prefectura${INSTITUTIONAL_SUFFIX}`);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const skin = loginSkin(visualTheme);

  const handleEnter = async (event?: FormEvent) => {
    event?.preventDefault();
    const trimmedEmail = email.trim();
    if (!VALID_EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage(
        `Usa un correo institucional válido (ej. usuario${INSTITUTIONAL_SUFFIX}).`
      );
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(
        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
      );
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
      if (response.ok) {
        onLogin();
      } else {
        const payload = await response.json().catch(() => ({}));
        setErrorMessage(
          (payload as { message?: string }).message ??
            "Credenciales incorrectas. Intenta de nuevo."
        );
      }
    } catch {
      setErrorMessage("Error de conexión. Verifica tu red e intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className={`anim-scale-in relative mx-auto mt-8 w-full max-w-6xl rounded-3xl p-8 text-white backdrop-blur ${skin.section}`}
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

      <form className="anim-slide-up anim-delay-200 w-full space-y-4" onSubmit={handleEnter}>
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
          maxLength={MAX_EMAIL_LENGTH}
          onChange={(e) => {
            setEmail(e.target.value.slice(0, MAX_EMAIL_LENGTH));
          }}
          placeholder={`usuario${INSTITUTIONAL_SUFFIX}`}
          className={`w-full rounded-xl border border-[#2b4693] bg-[#041239] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:ring-2 ${skin.ring}`}
        />

        <label className="block text-xs font-medium tracking-[0.2em] text-slate-300">CONTRASEÑA</label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          maxLength={MAX_PASSWORD_LENGTH}
          minLength={MIN_PASSWORD_LENGTH}
          onChange={(e) => {
            setPassword(e.target.value.slice(0, MAX_PASSWORD_LENGTH));
          }}
          placeholder="De 4 a 30 caracteres"
          className={`w-full rounded-xl border border-[#2b4693] bg-[#041239] px-4 py-3 text-white outline-none focus:ring-2 ${skin.ring}`}
        />

        {errorMessage ? (
          <p className="anim-fade-in rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className={`anim-press anim-lift mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-lg font-semibold tracking-[0.2em] transition ${skin.submit} ${
            isLoading ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          <Lock className="h-5 w-5" />
          {isLoading ? "VERIFICANDO..." : "ENTRAR"}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-slate-300">
        cuidarte a ti es darle calma al hogar
      </p>
    </section>
  );
}
