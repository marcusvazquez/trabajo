import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  /**
   * Sin esto, al abrir el dev server por IP de LAN (ej. http://192.168.x.x:3000 desde el movil),
   * Next 16 bloquea HMR /_next/* y la app puede quedar "congelada" o sin hidratar bien.
   * Patrones tipo "192.168.*.*" cubren la mayoria de redes domesticas en desarrollo.
   */
  allowedDevOrigins: [
    "192.168.*.*",
    "10.*.*.*",
    "172.*.*.*",
    "localhost",
    "127.0.0.1",
    "*.trycloudflare.com",
    "*.loca.lt",
    "*.ngrok-free.app",
    "*.ngrok.io",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
};

export default nextConfig;
