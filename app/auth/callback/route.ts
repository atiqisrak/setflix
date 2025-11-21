import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  // Preserve all query parameters
  const searchParams = url.searchParams.toString();
  const redirectUrl = `/api/auth/callback${searchParams ? `?${searchParams}` : ""}`;
  
  return NextResponse.redirect(new URL(redirectUrl, req.url));
}

export async function POST(req: NextRequest) {
  return GET(req);
}

