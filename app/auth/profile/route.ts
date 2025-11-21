export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const dynamicParams = true;

import { NextRequest } from "next/server";

// Lazy initialization to avoid build-time issues
let auth0Instance: any = null;

async function getAuth0Client() {
  if (!auth0Instance) {
    // Dynamic import to prevent build-time execution
    const { Auth0Client } = await import("@auth0/nextjs-auth0/server");
    auth0Instance = new Auth0Client({
      routes: {
        callback: "/api/auth/callback",
        login: "/api/auth/login",
        logout: "/api/auth/logout",
      },
    });
  }
  return auth0Instance;
}

export async function GET(req: NextRequest) {
  const auth0 = await getAuth0Client();
  const authClient = auth0.authClient;
  return authClient.handleProfile(req);
}

export async function POST(req: NextRequest) {
  return await GET(req);
}

