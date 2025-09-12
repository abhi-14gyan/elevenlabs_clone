"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { apiClient, type AudioResponse, type HealthResponse } from "@/lib/api"
import { Loader2, Upload, RefreshCw, CheckCircle, XCircle } from "lucide-react"

export function AdminPanel() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [audioFiles, setAudioFiles] = useState<AudioResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    language: "english" as "english" | "arabic",
    audio_url: "",
    text: "",
  })

  const checkHealth = async () => {
    try {
      const healthData = await apiClient.checkHealth()
      setHealth(healthData)
    } catch (error) {
      console.error("Health check failed:", error)
    }
  }

  const loadAudioFiles = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.getAllAudio()
      setAudioFiles(data.audio_files)
    } catch (error) {
      console.error("Failed to load audio files:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadForm.audio_url || !uploadForm.language) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setIsLoading(true)
      await apiClient.uploadAudio(uploadForm)

      // Reset form
      setUploadForm({
        language: "english",
        audio_url: "",
        text: "",
      })

      // Reload audio files
      await loadAudioFiles()

      alert("Audio uploaded successfully!")
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
    loadAudioFiles()
  }, [])

  return (
    <div className="space-y-6">
      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            System Health
            <Button variant="outline" size="sm" onClick={checkHealth}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {health ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                {health.status === "healthy" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">Overall Status:</span>
                <Badge variant={health.status === "healthy" ? "default" : "destructive"}>{health.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Next.js API:</span>
                  <Badge variant="default" className="ml-2">
                    Connected
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Flask Backend:</span>
                  <Badge
                    variant={health.flask_api && health.flask_api.status === "healthy" ? "default" : "destructive"}
                    className="ml-2"
                  >
                    {health.flask_api ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
              </div>

              {health.error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">Error: {health.error}</div>}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Checking system health...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Audio */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Audio File</CardTitle>
          <CardDescription>Add new audio files to the database for different languages</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={uploadForm.language}
                onValueChange={(value: "english" | "arabic") => setUploadForm((prev) => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="audio_url">Audio URL *</Label>
              <Input
                id="audio_url"
                type="url"
                placeholder="https://example.com/audio.mp3"
                value={uploadForm.audio_url}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, audio_url: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="text">Text Content</Label>
              <Textarea
                id="text"
                placeholder="The text that this audio represents..."
                value={uploadForm.text}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, text: e.target.value }))}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Upload Audio
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Audio Files List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Audio Files
            <Button variant="outline" size="sm" onClick={loadAudioFiles} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading audio files...</span>
            </div>
          ) : audioFiles.length > 0 ? (
            <div className="space-y-3">
              {audioFiles.map((audio, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge>{audio.language}</Badge>
                      <Badge variant="outline">{audio.source}</Badge>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>
                      <strong>URL:</strong>{" "}
                      <a
                        href={audio.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {audio.audioUrl}
                      </a>
                    </div>
                    {audio.text && (
                      <div>
                        <strong>Text:</strong> {audio.text}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No audio files found. Upload some audio files to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
