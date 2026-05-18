import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    theme: "entertainment",
    heroTitle: "Stream Your Favorite Content",
    heroSubtitle: "Live TV and on-demand entertainment",
  });
}
