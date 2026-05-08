import type { ValidationResult } from "@/lib/types";

export type AppVisualTheme = "classic" | "security" | "lince";

export function appPageBackground(theme: AppVisualTheme): string {
  switch (theme) {
    case "classic":
      return "bg-[#020a2b]/85";
    case "security":
      return "bg-[#020617] bg-gradient-to-b from-slate-950 via-[#041c2e] to-[#020617]";
    case "lince":
      return "bg-[#160208] bg-gradient-to-b from-[#200a10] via-[#18060c] to-[#0c0204]";
    default:
      return "bg-[#020a2b]/85";
  }
}

export type LoginThemeSkin = {
  section: string;
  title: string;
  ring: string;
  submit: string;
  /** Panel del menu de tema (desplegable) */
  themeMenuShell: string;
  /** Boton minimal Neon */
  themeNeonTrigger: string;
};

export function loginSkin(theme: AppVisualTheme): LoginThemeSkin {
  switch (theme) {
    case "security":
      return {
        section:
          "border border-sky-500/45 bg-[#041824]/95 shadow-[0_0_40px_rgba(14,165,233,0.22)]",
        title: "text-sky-300",
        ring: "ring-sky-400",
        submit: "bg-sky-400 text-slate-950 hover:bg-sky-300",
        themeMenuShell: "border-sky-500/35 bg-sky-950/95 backdrop-blur-sm",
        themeNeonTrigger:
          "flex items-center gap-1.5 rounded-full border border-sky-400/55 bg-sky-950/50 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-sky-100 shadow-[0_0_14px_rgba(56,189,248,0.2)] transition hover:bg-sky-900/60",
      };
    case "lince":
      return {
        section:
          "border border-[#9a2340]/60 bg-[#1c080d]/95 shadow-[0_0_40px_rgba(245,200,58,0.132)]",
        title: "text-[#f2c12e]",
        ring: "ring-[#f5c83a]/95",
        submit: "bg-[#f2c12e] text-[#140208] hover:bg-[#fad54a]",
        themeMenuShell: "border-[#7a1f36]/70 bg-[#1a060c]/98 backdrop-blur-sm shadow-[0_0_24px_rgba(245,200,58,0.11)]",
        themeNeonTrigger:
          "flex items-center gap-1.5 rounded-full border border-[#f5c83a]/55 bg-[#2a0d14]/90 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#fde68a] shadow-[0_0_16px_rgba(245,200,58,0.22)] transition hover:bg-[#3a1220]/90",
      };
    default:
      return {
        section: "border border-[#203f87] bg-[#061741]/95 shadow-[0_0_40px_rgba(2,12,54,0.7)]",
        title: "text-[#d8b24b]",
        ring: "ring-[#d8b24b]",
        submit: "bg-[#d8b24b] text-[#0a1a49] hover:bg-[#f0ca61]",
        themeMenuShell: "border-white/18 bg-[#050a18]/98 backdrop-blur-sm",
        themeNeonTrigger:
          "flex items-center gap-1.5 rounded-full border border-white/22 bg-white/6 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-200 transition hover:bg-white/12",
      };
  }
}

export type DashboardSkin = {
  sectionMuted: string;
  header: string;
  statBox: string;
  card: string;
  cardAccent: string;
  logout: string;
  themeMenuShell: string;
  themeNeonTrigger: string;
};

export function dashboardSkin(theme: AppVisualTheme): DashboardSkin {
  switch (theme) {
    case "security":
      return {
        sectionMuted: "text-slate-200",
        header:
          "relative z-30 overflow-visible rounded-2xl border border-sky-500/35 bg-[#041c2e]/95 p-5 text-slate-50 shadow-[0_0_28px_rgba(14,165,233,0.14)]",
        statBox: "rounded-lg border border-sky-500/30 bg-sky-950/45 px-3 py-2 text-sm text-sky-100",
        card: "rounded-xl border border-sky-500/28 bg-[#041828]/95 p-5 shadow-xl shadow-sky-950/30",
        cardAccent: "text-sky-300",
        logout: "rounded-lg border border-sky-400/70 px-4 py-2 text-sm font-semibold text-sky-200 hover:bg-sky-500/10",
        themeMenuShell: "border-sky-500/30 bg-sky-950/95 backdrop-blur-sm",
        themeNeonTrigger:
          "flex items-center gap-1.5 rounded-full border border-sky-400/55 bg-sky-950/45 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-sky-100 shadow-[0_0_12px_rgba(56,189,248,0.18)] transition hover:bg-sky-900/55",
      };
    case "lince":
      return {
        sectionMuted: "text-amber-50/95",
        header:
          "relative z-30 overflow-visible rounded-2xl border border-[#8b2844]/62 bg-[#1f0a0e]/95 p-5 text-amber-50 shadow-[0_0_36px_rgba(245,200,58,0.11)]",
        statBox:
          "rounded-lg border border-[#7a1f36]/72 bg-[#16060a]/92 px-3 py-2 text-sm text-amber-100",
        card: "rounded-xl border border-[#6b1c2e]/62 bg-[#18060c]/95 p-5 shadow-xl shadow-black/40",
        cardAccent: "text-[#f2c12e]",
        logout:
          "rounded-lg border border-[#f5c83a]/82 px-4 py-2 text-sm font-semibold text-[#fff3c4] hover:bg-[#f5c83a]/14",
        themeMenuShell: "border-[#7a1f36]/72 bg-[#140208]/98 backdrop-blur-sm shadow-[0_0_22px_rgba(245,200,58,0.11)]",
        themeNeonTrigger:
          "flex items-center gap-1.5 rounded-full border border-[#f5c83a]/58 bg-[#2a0d14]/88 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#fde68a] shadow-[0_0_14px_rgba(245,200,58,0.2)] transition hover:bg-[#3a1220]/88",
      };
    default:
      return {
        sectionMuted: "text-slate-100",
        header:
          "relative z-30 overflow-visible rounded-2xl border border-[#203f87] bg-[#061741]/95 p-5 text-white",
        statBox: "rounded-lg border border-[#2b4693] bg-[#0b245d] px-3 py-2 text-sm",
        card: "rounded-xl border border-[#203f87] bg-[#061741]/95 p-5 shadow-xl",
        cardAccent: "text-[#d8b24b]",
        logout: "rounded-lg border border-[#d8b24b] px-4 py-2 text-sm font-semibold text-[#d8b24b]",
        themeMenuShell: "border-[#2b4693]/75 bg-[#050c1c]/98 backdrop-blur-sm",
        themeNeonTrigger:
          "flex items-center gap-1.5 rounded-full border border-white/22 bg-white/6 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-200 transition hover:bg-white/12",
      };
  }
}

export type ScannerSkin = {
  section: string;
  icon: string;
  primaryBtn: string;
  secondaryBtn: string;
};

export function scannerSkin(theme: AppVisualTheme): ScannerSkin {
  switch (theme) {
    case "security":
      return {
        section: "rounded-xl border border-sky-500/35 bg-[#052838]/95 p-5 text-slate-50 shadow-xl",
        icon: "text-sky-300",
        primaryBtn: "rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950 hover:bg-sky-300 disabled:opacity-60",
        secondaryBtn:
          "rounded-lg border border-sky-400/50 px-4 py-2 font-semibold text-sky-100 hover:bg-sky-500/10 disabled:opacity-50",
      };
    case "lince":
      return {
        section:
          "rounded-xl border border-[#7a1f36]/62 bg-[#1c080c]/95 p-5 text-amber-50 shadow-xl shadow-[0_0_20px_rgba(245,200,58,0.09)]",
        icon: "text-[#f2c12e]",
        primaryBtn:
          "rounded-lg bg-[#f2c12e] px-4 py-2 font-semibold text-[#140208] hover:bg-[#fad54a] disabled:opacity-60",
        secondaryBtn:
          "rounded-lg border border-[#f5c83a]/52 px-4 py-2 font-semibold text-[#fff7d6] hover:bg-[#f5c83a]/12 disabled:opacity-50",
      };
    default:
      return {
        section: "rounded-xl border border-[#12367f] bg-[#0a2a66] p-5 text-white shadow-xl",
        icon: "text-[#f3c64f]",
        primaryBtn: "rounded-lg bg-[#f3c64f] px-4 py-2 font-semibold text-[#0a2a66] disabled:opacity-60",
        secondaryBtn: "rounded-lg border border-slate-300 px-4 py-2 font-semibold text-white disabled:opacity-50",
      };
  }
}

export type LogTableSkin = {
  section: string;
  heading: string;
  thead: string;
  rowBorder: string;
};

export function logTableSkin(theme: AppVisualTheme): LogTableSkin {
  switch (theme) {
    case "security":
      return {
        section: "rounded-xl border border-sky-500/28 bg-[#041828]/95 p-5 shadow-xl",
        heading: "text-sky-300",
        thead: "bg-sky-950/55 text-left text-sky-100",
        rowBorder: "border-t border-sky-800/50 text-slate-100",
      };
    case "lince":
      return {
        section: "rounded-xl border border-[#6b1c2e]/62 bg-[#16060a]/95 p-5 shadow-xl",
        heading: "text-[#f2c12e]",
        thead: "bg-[#240c12]/92 text-left text-amber-100",
        rowBorder: "border-t border-[#4a1520]/85 text-amber-50/95",
      };
    default:
      return {
        section: "rounded-xl border border-[#203f87] bg-[#061741]/95 p-5 shadow-xl",
        heading: "text-[#d8b24b]",
        thead: "bg-[#0b245d] text-left text-slate-200",
        rowBorder: "border-t border-[#1d3578] text-slate-200",
      };
  }
}

/** Estados en la bitácora: verde (autorizado / ya puede salir), rojo (denegado). */
export function accessLogResultBadgeClasses(theme: AppVisualTheme, result: ValidationResult): string {
  const base = "inline-block rounded-full px-2 py-1 text-xs font-semibold";
  switch (result) {
    case "AUTORIZADO":
      switch (theme) {
        case "security":
          return `${base} border border-emerald-400/45 bg-emerald-500/18 text-emerald-100`;
        case "lince":
          return `${base} border border-emerald-500/45 bg-emerald-900/40 text-emerald-100`;
        default:
          return `${base} bg-emerald-100 text-emerald-900`;
      }
    case "YA_SALIO":
      switch (theme) {
        case "security":
          return `${base} border border-emerald-300/50 bg-emerald-400/22 text-emerald-50`;
        case "lince":
          return `${base} border border-emerald-400/50 bg-emerald-800/45 text-emerald-50`;
        default:
          return `${base} bg-emerald-200 text-emerald-900`;
      }
    case "DENEGADO":
      switch (theme) {
        case "security":
          return `${base} border border-rose-400/45 bg-rose-600/25 text-rose-50`;
        case "lince":
          return `${base} border border-rose-500/50 bg-[#5c1020]/85 text-rose-50`;
        default:
          return `${base} bg-rose-700 text-white`;
      }
    default:
      return `${base} bg-slate-600 text-white`;
  }
}

/** Bloque principal de resultado (escaneo) — alineado con la bitácora por tema. */
export function accessValidationBannerClasses(theme: AppVisualTheme, result: ValidationResult): string {
  switch (result) {
    case "AUTORIZADO":
      switch (theme) {
        case "security":
          return "bg-emerald-950/55 text-emerald-100 ring-1 ring-emerald-400/35";
        case "lince":
          return "bg-emerald-950/50 text-emerald-100 ring-1 ring-emerald-500/25";
        default:
          return "bg-emerald-900/60 text-emerald-200";
      }
    case "YA_SALIO":
      switch (theme) {
        case "security":
          return "bg-emerald-950/50 text-emerald-50 ring-1 ring-emerald-300/40";
        case "lince":
          return "bg-emerald-900/45 text-emerald-50 ring-1 ring-emerald-400/35";
        default:
          return "bg-emerald-800/55 text-emerald-50";
      }
    case "DENEGADO":
      switch (theme) {
        case "security":
          return "bg-rose-950/55 text-rose-50 ring-1 ring-rose-500/35";
        case "lince":
          return "bg-[#4a0a14]/90 text-rose-50 ring-1 ring-rose-600/30";
        default:
          return "bg-[#5f1f28] text-white";
      }
    default:
      return "bg-slate-800 text-white";
  }
}

export type GroupAuthPanelSkin = {
  section: string;
  heading: string;
  sub: string;
  label: string;
  input: string;
  select: string;
  toggle: string;
  chip: string;
};

export function groupAuthPanelSkin(theme: AppVisualTheme): GroupAuthPanelSkin {
  switch (theme) {
    case "security":
      return {
        section: "rounded-xl border border-sky-500/28 bg-[#042030]/95 p-5 text-slate-100 shadow-xl",
        heading: "text-sky-300",
        sub: "text-slate-400",
        label: "text-xs font-medium tracking-[0.15em] text-sky-200/85",
        input:
          "w-full rounded-lg border border-sky-500/35 bg-sky-950/40 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-sky-400/50",
        select:
          "w-full rounded-lg border border-sky-500/35 bg-sky-950/40 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-sky-400/50",
        toggle: "accent-sky-400",
        chip: "rounded-md border border-sky-500/30 bg-sky-950/50 px-2 py-1 text-[0.7rem] font-medium text-sky-200",
      };
    case "lince":
      return {
        section:
          "rounded-xl border border-[#6b1c2e]/62 bg-[#14060a]/95 p-5 text-amber-50 shadow-xl",
        heading: "text-[#f2c12e]",
        sub: "text-amber-200/70",
        label: "text-xs font-medium tracking-[0.15em] text-amber-200/90",
        input:
          "w-full rounded-lg border border-[#7a1f36]/55 bg-[#1c080c]/95 px-3 py-2 text-sm text-amber-50 outline-none focus:ring-2 focus:ring-[#f5c83a]/40",
        select:
          "w-full rounded-lg border border-[#7a1f36]/55 bg-[#1c080c]/95 px-3 py-2 text-sm text-amber-50 outline-none focus:ring-2 focus:ring-[#f5c83a]/40",
        toggle: "accent-[#f2c12e]",
        chip: "rounded-md border border-[#7a1f36]/60 bg-[#200a10]/90 px-2 py-1 text-[0.7rem] font-medium text-amber-100",
      };
    default:
      return {
        section: "rounded-xl border border-[#203f87] bg-[#061741]/95 p-5 text-slate-200 shadow-xl",
        heading: "text-[#d8b24b]",
        sub: "text-slate-400",
        label: "text-xs font-medium tracking-[0.15em] text-slate-400",
        input:
          "w-full rounded-lg border border-[#2b4693] bg-[#0b245d] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#d8b24b]/50",
        select:
          "w-full rounded-lg border border-[#2b4693] bg-[#0b245d] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#d8b24b]/50",
        toggle: "accent-[#d8b24b]",
        chip: "rounded-md border border-[#2b4693] bg-[#0b245d] px-2 py-1 text-[0.7rem] font-medium text-[#d8b24b]",
      };
  }
}

export type PrefectureExitAlertPanelSkin = {
  section: string;
  heading: string;
  sub: string;
  card: string;
  pulse: string;
  btn: string;
  meta: string;
};

export function prefectureExitAlertPanelSkin(theme: AppVisualTheme): PrefectureExitAlertPanelSkin {
  switch (theme) {
    case "security":
      return {
        section: "rounded-xl border border-rose-400/35 bg-[#380610]/92 p-5 text-slate-50 shadow-xl",
        heading: "text-rose-200",
        sub: "text-slate-400",
        card: "rounded-lg border border-rose-400/35 bg-black/35 p-4",
        pulse: "text-rose-300",
        btn: "rounded-lg border border-rose-300/60 px-3 py-1.5 text-xs font-semibold text-rose-50 hover:bg-rose-500/20",
        meta: "text-slate-500",
      };
    case "lince":
      return {
        section:
          "rounded-xl border border-[#b91c43]/46 bg-[#220810]/94 p-5 text-amber-50 shadow-[0_0_24px_rgba(217,119,87,0.12)]",
        heading: "text-[#fca5a5]",
        sub: "text-amber-200/70",
        card: "rounded-lg border border-[#8b2844]/55 bg-black/38 p-4",
        pulse: "text-[#fca5a5]",
        btn: "rounded-lg border border-[#f5c83a]/50 px-3 py-1.5 text-xs font-semibold text-amber-50 hover:bg-[#f5c83a]/12",
        meta: "text-amber-200/65",
      };
    default:
      return {
        section: "rounded-xl border border-rose-900/58 bg-[#4a0814]/93 p-5 text-white shadow-xl",
        heading: "text-rose-200",
        sub: "text-slate-400",
        card: "rounded-lg border border-rose-800/53 bg-black/39 p-4",
        pulse: "text-rose-300",
        btn: "rounded-lg border border-rose-200/72 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500/35",
        meta: "text-slate-500",
      };
  }
}

export type DesertionSkin = {
  section: string;
  icon: string;
};

export function desertionSkin(theme: AppVisualTheme): DesertionSkin {
  switch (theme) {
    case "security":
      return {
        section: "rounded-xl border border-rose-500/40 bg-[#3f0a12]/95 p-5 text-white shadow-xl",
        icon: "text-sky-300",
      };
    case "lince":
      return {
        section: "rounded-xl border border-[#8b2844] bg-[#2e0c12]/95 p-5 text-white shadow-[0_0_18px_rgba(245,200,58,0.09)]",
        icon: "text-[#f2c12e]",
      };
    default:
      return {
        section: "rounded-xl border border-[#5f1f28] bg-[#5f1f28] p-5 text-white shadow-xl",
        icon: "text-[#f3c64f]",
      };
  }
}
