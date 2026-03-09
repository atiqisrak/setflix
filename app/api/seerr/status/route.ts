import { NextResponse } from "next/server";

const SEERR_URL = process.env.SEERR_URL || "http://localhost:5055";

export async function GET() {
  try {
    const res = await fetch(`${SEERR_URL}/api/v1/status`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const ok = res.ok;
    const data = ok ? await res.json().catch(() => ({})) : null;
    return NextResponse.json({
      connected: ok,
      url: SEERR_URL,
      ...(data && typeof data === "object" ? data : {}),
    });
  } catch {
    return NextResponse.json({
      connected: false,
      url: SEERR_URL,
      error: "Seerr unreachable",
    });
  }
}
