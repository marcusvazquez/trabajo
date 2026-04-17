"use client";

import { Camera, CameraOff, ScanLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ScannerPanelProps = {
  onEnrollmentDetected: (enrollment: string) => void;
};

export function ScannerPanel({ onEnrollmentDetected }: ScannerPanelProps) {
  const scannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

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
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("reader-zone");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText: string) => {
          onEnrollmentDetected(decodedText.trim());
          await stopScanner();
        },
        () => {}
      );

      setIsScanning(true);
    } catch {
      setScanError("No fue posible iniciar la camara. Verifica permisos del navegador.");
    }
  };

  useEffect(() => {
    return () => {
      stopScanner().catch(() => undefined);
    };
  }, []);

  return (
    <section className="rounded-xl border border-[#12367f] bg-[#0a2a66] p-5 text-white shadow-xl">
      <header className="mb-4 flex items-center gap-2">
        <ScanLine className="h-5 w-5 text-[#f3c64f]" />
        <h2 className="text-lg font-semibold">Modulo de Escaneo</h2>
      </header>

      <div id="reader-zone" className="min-h-56 rounded-lg bg-slate-900 p-2" />

      {scanError ? <p className="mt-3 text-sm text-red-300">{scanError}</p> : null}

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={startScanner}
          disabled={isScanning}
          className="flex items-center gap-2 rounded-lg bg-[#f3c64f] px-4 py-2 font-semibold text-[#0a2a66] disabled:opacity-60"
        >
          <Camera className="h-4 w-4" />
          Iniciar camara
        </button>
        <button
          type="button"
          onClick={() => stopScanner().catch(() => undefined)}
          disabled={!isScanning}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          <CameraOff className="h-4 w-4" />
          Detener
        </button>
      </div>
    </section>
  );
}
