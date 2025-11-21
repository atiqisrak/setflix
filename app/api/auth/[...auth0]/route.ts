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
  const url = new URL(req.url);
  const pathname = url.pathname;

  const auth0 = await getAuth0Client();
  // Access the internal authClient to use its handler
  const authClient = auth0.authClient;
  
  // Handle login route
  if (pathname.includes("/login")) {
    return authClient.handleLogin(req);
  }

  // Handle logout route
  if (pathname.includes("/logout")) {
    return authClient.handleLogout(req);
  }

  // Handle callback route
  if (pathname.includes("/callback")) {
    return authClient.handleCallback(req);
  }

  // Handle profile route
  if (pathname.includes("/profile") || pathname.includes("/me")) {
    return authClient.handleProfile(req);
  }

  // Handle access token route
  if (pathname.includes("/access-token")) {
    return authClient.handleAccessToken(req);
  }

  // Use the main handler for any other routes
  return authClient.handler(req);
}

export async function POST(req: NextRequest) {
  return await GET(req);
}

