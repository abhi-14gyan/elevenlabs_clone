// API utility functions for frontend components

export interface AudioResponse {
  language: string
  audioUrl: string
  text: string
  source: "database" | "sample_data" | "fallback"
}

export interface HealthResponse {
  status: "healthy" | "degraded"
  nextjs: string
  flask_api: any
  timestamp: string
  error?: string
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl
  }

  async getAudio(language: "english" | "arabic"): Promise<AudioResponse> {
    const response = await fetch(`${this.baseUrl}/api/audio/${language}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.status}`)
    }

    return response.json()
  }

  async getAllAudio(): Promise<{ audio_files: AudioResponse[]; count: number; source: string }> {
    const response = await fetch(`${this.baseUrl}/api/audio`)

    if (!response.ok) {
      throw new Error(`Failed to fetch audio list: ${response.status}`)
    }

    return response.json()
  }

  async uploadAudio(data: {
    language: "english" | "arabic"
    audio_url: string
    text?: string
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to upload audio: ${response.status}`)
    }

    return response.json()
  }

  async checkHealth(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}/api/health`)
    return response.json() // Return even if not ok to get error details
  }
}

// Default API client instance
export const apiClient = new ApiClient()
