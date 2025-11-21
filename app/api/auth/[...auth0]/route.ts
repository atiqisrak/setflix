import { NextRequest } from "next/server";
import { Auth0Client } from "@auth0/nextjs-auth0/server";

const auth0 = new Auth0Client({
  routes: {
    callback: "/api/auth/callback",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
  },
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Access the internal authClient to use its handler
  const authClient = (auth0 as any).authClient;
  
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
  return GET(req);
}

