import { NextResponse } from "next/server"

const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:5000"

export async function GET() {
  try {
    // Check Flask API health
    const response = await fetch(`${FLASK_API_URL}/api/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Flask API health check failed: ${response.status}`)
    }

    const flaskHealth = await response.json()

    return NextResponse.json({
      status: "healthy",
      nextjs: "connected",
      flask_api: flaskHealth,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check error:", error)

    return NextResponse.json(
      {
        status: "degraded",
        nextjs: "connected",
        flask_api: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
