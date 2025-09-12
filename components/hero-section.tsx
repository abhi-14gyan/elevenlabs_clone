import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">The most realistic voice AI platform</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
          AI voice models and products powering millions of developers, creators, and enterprises. From low-latency
          conversational agents to the leading AI voice generator for voiceovers and audiobooks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-black text-white hover:bg-gray-800">
            SIGN UP
          </Button>
          <Button size="lg" variant="outline">
            CONTACT SALES
          </Button>
        </div>
      </div>
    </section>
  )
}
