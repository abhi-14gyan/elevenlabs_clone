import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { TextToSpeechSection } from "@/components/text-to-speech-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TextToSpeechSection />
      </main>
    </div>
  )
}
