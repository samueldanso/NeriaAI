import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const { query, sessionId } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    // Forward to your FastAPI backend
    const response = await fetch(`${BACKEND_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        session_id: sessionId || `session_${Date.now()}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      response: data.response || data.message,
      sessionId: data.session_id,
      agents: data.agents || [],
      reasoning: data.reasoning || null,
      validation: data.validation || null,
    });
  } catch (error) {
    console.error("Backend communication error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to communicate with backend",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
