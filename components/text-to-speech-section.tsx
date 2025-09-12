"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Download, Pause, Loader2 } from "lucide-react"

const tabs = [
  { id: "text-to-speech", label: "TEXT TO SPEECH", icon: "🎤" },
  { id: "agents", label: "AGENTS", icon: "🤖" },
  { id: "music", label: "MUSIC", icon: "🎵" },
  { id: "speech-to-text", label: "SPEECH TO TEXT", icon: "📝" },
  { id: "dubbing", label: "DUBBING", icon: "🎬" },
  { id: "voice-cloning", label: "VOICE CLONING", icon: "👥" },
  { id: "elevenreader", label: "ELEVENREADER", icon: "📖" },
]

const voiceOptions = [
  { id: "samara", name: "Samara", description: "Narrate a story", color: "bg-teal-500" },
  { id: "two-speakers", name: "2 speakers", description: "Create a dialogue", color: "bg-pink-500" },
  { id: "announcer", name: "Announcer", description: "Voiceover a game", color: "bg-teal-500" },
  { id: "sergeant", name: "Sergeant", description: "Play a drill sergeant", color: "bg-purple-500" },
  { id: "spuds", name: "Spuds", description: "Recount an old story", color: "bg-teal-500" },
  { id: "jessica", name: "Jessica", description: "Provide customer support", color: "bg-pink-500" },
]

export function TextToSpeechSection() {
  const [activeTab, setActiveTab] = useState("text-to-speech")
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [text, setText] = useState("")

  // Fetch text based on selected language
  useEffect(() => {
    const fetchLanguageText = async () => {
      try {
        const response = await fetch(`/api/audio/${selectedLanguage}`)
        if (response.ok) {
          const data = await response.json()
          if (data.text) {
            setText(data.text)
          }
        } else {
          // Fallback text if API is not available
          const fallbackTexts = {
            english: `In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. [sarcastically] Not the "burn it all down" kind... [giggles] but he was gentle, wise, with eyes like old stars. [whispers] Even the birds fell silent when he passed.`,
            arabic: `في أرض إلدوريا القديمة، حيث تتلألأ السماء والغابات، همست الأسرار للريح، عاش تنين يُدعى زيفيروس.`
          }
          setText(fallbackTexts[selectedLanguage as keyof typeof fallbackTexts])
        }
      } catch (error) {
        console.error("Failed to fetch language text:", error)
        // Fallback text if fetch fails
        const fallbackTexts = {
          english: `In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. [sarcastically] Not the "burn it all down" kind... [giggles] but he was gentle, wise, with eyes like old stars. [whispers] Even the birds fell silent when he passed.`,
          arabic: `في أرض إلدوريا القديمة، حيث تتلألأ السماء والغابات، همست الأسرار للريح، عاش تنين يُدعى زيفيروس.`
        }
        setText(fallbackTexts[selectedLanguage as keyof typeof fallbackTexts])
      }
    }

    fetchLanguageText()
  }, [selectedLanguage])

  const handlePlayAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/audio/${selectedLanguage}`)

      if (response.ok) {
        const data = await response.json()

        if (data.audioUrl) {
          if (audioRef.current) {
            audioRef.current.pause()
          }

          const audio = new Audio(data.audioUrl)
          audioRef.current = audio

          audio.addEventListener("loadstart", () => setIsLoading(true))
          audio.addEventListener("canplay", () => setIsLoading(false))
          audio.addEventListener("play", () => setIsPlaying(true))
          audio.addEventListener("pause", () => setIsPlaying(false))
          audio.addEventListener("ended", () => {
            setIsPlaying(false)
            setIsLoading(false)
          })
          audio.addEventListener("error", () => {
            setIsPlaying(false)
            setIsLoading(false)
            console.error("Audio playback error")
          })

          await audio.play()
        }
      } else {
        const audioUrls = {
          english: "/ElevenLabs_Text_to_Speech_audio_english.mp3",
          arabic: "/ElevenLabs_Text_to_Speech_audio_arabic.mp3",
        }

        const audioUrl = audioUrls[selectedLanguage as keyof typeof audioUrls]

        if (audioRef.current) {
          audioRef.current.pause()
        }

        const audio = new Audio(audioUrl)
        audioRef.current = audio

        audio.addEventListener("loadstart", () => setIsLoading(true))
        audio.addEventListener("canplay", () => setIsLoading(false))
        audio.addEventListener("play", () => setIsPlaying(true))
        audio.addEventListener("pause", () => setIsPlaying(false))
        audio.addEventListener("ended", () => {
          setIsPlaying(false)
          setIsLoading(false)
        })
        audio.addEventListener("error", () => {
          setIsPlaying(false)
          setIsLoading(false)
          alert(`Audio for ${selectedLanguage} is not available yet. Please connect the Flask API.`)
        })

        await audio.play()
      }
    } catch (error) {
      console.error("Audio playback failed:", error)
      setIsLoading(false)
      setIsPlaying(false)
      alert(`Audio playback failed. Please ensure the Flask API is running and audio files are available.`)
    }
  }

  const handleDownloadAudio = async () => {
    try {
      const response = await fetch(`/api/audio/${selectedLanguage}`)

      if (response.ok) {
        const data = await response.json()

        if (data.audioUrl) {
          const link = document.createElement("a")
          link.href = data.audioUrl
          link.download = `audio-${selectedLanguage}-${Date.now()}.mp3`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        alert("Download not available. Please ensure the Flask API is running.")
      }
    } catch (error) {
      console.error("Download failed:", error)
      alert("Download failed. Please try again.")
    }
  }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-medium ${
                activeTab === tab.id
                  ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "text-to-speech" && (
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[120px] text-base leading-relaxed"
                  placeholder="Enter your text here..."
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {voiceOptions.map((voice) => (
                  <Button
                    key={voice.id}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 h-auto p-3 justify-start bg-transparent"
                  >
                    <div className={`w-3 h-3 rounded-full ${voice.color}`} />
                    <div className="text-left">
                      <div className="font-medium text-xs">{voice.name}</div>
                      <div className="text-xs text-muted-foreground">{voice.description}</div>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-32">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{selectedLanguage === "english" ? "🇺🇸" : "🇸🇦"}</span>
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">
                        <div className="flex items-center space-x-2">
                          <span>🇺🇸</span>
                          <span>ENGLISH</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="arabic">
                        <div className="flex items-center space-x-2">
                          <span>🇸🇦</span>
                          <span>ARABIC</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handlePlayAudio}
                    size="lg"
                    disabled={isLoading}
                    className="bg-black text-white hover:bg-gray-800 rounded-full px-6"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-4 w-4 mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {isLoading ? "LOADING" : isPlaying ? "PAUSE" : "PLAY"}
                  </Button>
                  <Button
                    onClick={handleDownloadAudio}
                    variant="outline"
                    size="lg"
                    className="rounded-full bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab !== "text-to-speech" && (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
              <p>This tab content will be implemented in the future.</p>
            </div>
          </Card>
        )}

        <div className="mt-12 text-center">
          <div className="text-sm text-muted-foreground mb-4">Powered by Eleven v3 (alpha)</div>
          <div className="mb-6">
            <div className="text-lg font-medium mb-2">EXPERIENCE THE FULL AUDIO AI PLATFORM</div>
          </div>
          <Button size="lg" className="bg-black text-white hover:bg-gray-800">
            SIGN UP
          </Button>
        </div>
      </div>
    </section>
  )
}
