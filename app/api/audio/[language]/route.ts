import { type NextRequest, NextResponse } from "next/server"

const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:5000"

export async function GET(request: NextRequest, { params }: { params: { language: string } }) {
  try {
    const { language } = params

    // Validate language parameter
    if (!language || !["english", "arabic"].includes(language)) {
      return NextResponse.json({ error: "Invalid language. Supported languages: english, arabic" }, { status: 400 })
    }

    // Make request to Flask API
    const response = await fetch(`${FLASK_API_URL}/api/audio/${language}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Disable caching
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      return NextResponse.json({ error: errorData.error || "Failed to fetch audio" }, { status: response.status })
    }

    const data = await response.json()

    const jsonResponse = NextResponse.json(data)
    // Add cache control headers to prevent caching
    jsonResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    jsonResponse.headers.set('Pragma', 'no-cache')
    return jsonResponse
  } catch (error) {
    console.error("API Error:", error)

    // Return fallback response if Flask API is not available
    const fallbackAudioUrls = {
      english: "/ElevenLabs_Text_to_Speech_audio_english.mp3",
      arabic: "/ElevenLabs_Text_to_Speech_audio_arabic.mp3",
    }

    return NextResponse.json({
      language: params.language,
      audioUrl: fallbackAudioUrls[params.language as keyof typeof fallbackAudioUrls],
      text: "Fallback audio - Flask API not available",
      source: "fallback",
    })
  }
}
