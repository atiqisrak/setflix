import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET() {
  try {
    // Use public homepage endpoint (no auth required)
    const response = await fetch(`${API_BASE_URL}/homepage`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch homepage settings" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching homepage settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch homepage settings" },
      { status: 500 }
    );
  }
}

