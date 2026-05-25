import type { NextConfig } from "next";

const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : ["192.168.1.3"];

const nextConfig: NextConfig = {
  // LAN access: http://<your-ip>:3000 — set ALLOWED_DEV_ORIGINS in .env.local
  ...(allowedDevOrigins.length > 0 ? { allowedDevOrigins } : {}),
};

export default nextConfig;
