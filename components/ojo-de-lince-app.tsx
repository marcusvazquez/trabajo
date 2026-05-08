"use client";

import { useState } from "react";
import { appPageBackground } from "@/lib/app-visual-theme";
import type { AppVisualTheme } from "@/lib/app-visual-theme";
import { LoginScreen } from "@/components/login-screen";
import { PrefectureDashboard } from "@/components/prefecture-dashboard";

export function OjoDeLinceApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visualTheme, setVisualTheme] = useState<AppVisualTheme>("classic");

  return (
    <div
      className={`anim-theme-shift min-h-[100dvh] w-full ${appPageBackground(visualTheme)}`}
    >
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        {isAuthenticated ? (
          <PrefectureDashboard
            visualTheme={visualTheme}
            onVisualThemeChange={setVisualTheme}
            onLogout={() => setIsAuthenticated(false)}
          />
        ) : (
          <LoginScreen
            visualTheme={visualTheme}
            onVisualThemeChange={setVisualTheme}
            onLogin={() => setIsAuthenticated(true)}
          />
        )}
      </main>
    </div>
  );
}
