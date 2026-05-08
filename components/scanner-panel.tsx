"use client";

import { Camera, CameraOff, ScanLine } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { scannerSkin } from "@/lib/app-visual-theme";
import type { AppVisualTheme } from "@/lib/app-visual-theme";

type ScannerPanelProps = {
  onEnrollmentDetected: (enrollment: string) => void;
  visualTheme?: AppVisualTheme;
};

export function ScannerPanel({ onEnrollmentDetected, visualTheme = "classic" }: ScannerPanelProps) {
  const scannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const skin = scannerSkin(visualTheme);
  const reactId = useId().replace(/:/g, "");
  const readerId = `reader-zone-${reactId}`;

  const stopScanner = async () => {
    if (!scannerRef.current) return;
    await scannerRef.current.stop();
    scannerRef.current.clear();
    scannerRef.current = null;
    setIsScanning(false);
  };

  const startScanner = async () => {
    try {
      setScanError(null);
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
      const scanner = new Html5Qrcode(readerId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        useBarCodeDetectorIfSupported: false,
        verbose: false,
      });
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 12,
          aspectRatio: 1,
          disableFlip: false,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const m = Math.min(viewfinderWidth, viewfinderHeight);
            const side = Math.max(160, Math.floor(Math.min(280, m * 0.72)));
            return { width: side, height: side };
          },
          videoConstraints: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        async (decodedText: string) => {
          onEnrollmentDetected(decodedText.trim());
          await stopScanner();
        },
        () => {}
      );

      setIsScanning(true);
    } catch {
      const insecure =
        typeof window !== "undefined" && window.isSecureContext === false;
      setScanError(
        insecure
          ? "Sin HTTPS el movil suele bloquear la camara. En la PC corre npm run dev:share, copia el enlace https://....trycloudflare.com y abrelo aqui."
          : "No fue posible iniciar la camara. Verifica permisos del navegador."
      );
    }
  };

  useEffect(() => {
    return () => {
      stopScanner().catch(() => undefined);
    };
  }, []);

  return (
    <section className={`${skin.section} anim-fade-in`}>
      <header className="mb-4 flex items-center gap-2">
        <ScanLine className={`h-5 w-5 ${skin.icon}`} />
        <h2 className="text-lg font-semibold">Modulo de Escaneo</h2>
      </header>

      <div
        className="relative isolate mx-auto overflow-hidden rounded-lg bg-slate-950 ring-1 ring-white/10 [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
        style={{
          width: "min(100%, 320px)",
          aspectRatio: "1",
          minHeight: "260px",
        }}
      >
        <div id={readerId} className="relative h-full w-full min-h-[260px]" />
        {isScanning ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 h-px rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            style={{
              animation: "scanLineSweep 1.8s linear infinite",
              top: 0,
            }}
          />
        ) : null}
      </div>

      <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-slate-400">
        Apunta al QR de la credencial (texto = matricula). Buena luz, QR centrado en el recuadro y
        telefono estable ayudan a la lectura.
      </p>

      {scanError ? <p className="mt-3 text-sm text-red-300">{scanError}</p> : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={startScanner}
          disabled={isScanning}
          className={`anim-press anim-lift flex items-center gap-2 ${skin.primaryBtn}`}
        >
          <Camera className="h-4 w-4" />
          Iniciar camara
        </button>
        <button
          type="button"
          onClick={() => stopScanner().catch(() => undefined)}
          disabled={!isScanning}
          className={`anim-press flex items-center gap-2 ${skin.secondaryBtn}`}
        >
          <CameraOff className="h-4 w-4" />
          Detener
        </button>
      </div>
    </section>
  );
}
