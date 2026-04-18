"use client";

import { useState } from "react";
import { LoginScreen } from "@/components/login-screen";
import { PrefectureDashboard } from "@/components/prefecture-dashboard";

export function OjoDeLinceApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#020a2b]/85">
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        {isAuthenticated ? (
          <PrefectureDashboard onLogout={() => setIsAuthenticated(false)} />
        ) : (
          <LoginScreen onLogin={() => setIsAuthenticated(true)} />
        )}
      </main>
    </div>
  );
}
