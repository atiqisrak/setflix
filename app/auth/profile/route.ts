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
  const authClient = (auth0 as any).authClient;
  return authClient.handleProfile(req);
}

export async function POST(req: NextRequest) {
  return GET(req);
}

