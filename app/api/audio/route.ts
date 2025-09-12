import { type NextRequest, NextResponse } from "next/server"

const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:5000"

export async function GET() {
  try {
    const response = await fetch(`${FLASK_API_URL}/api/audio`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Flask API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API Error:", error)

    // Return fallback response
    return NextResponse.json({
      audio_files: [
        {
          language: "english",
          audio_url: "/ElevenLabs_Text_to_Speech_audio_english.mp3",
          text: "Fallback English audio",
          source: "fallback",
        },
        {
          language: "arabic",
          audio_url: "/ElevenLabs_Text_to_Speech_audio_arabic.mp3",
          text: "Fallback Arabic audio",
          source: "fallback",
        },
      ],
      count: 2,
      source: "fallback",
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${FLASK_API_URL}/api/audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      return NextResponse.json({ error: errorData.error || "Failed to upload audio" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
