import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-xl font-bold">IIElevenLabs</div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-1 text-sm font-medium cursor-pointer hover:text-primary">
            <span>Creative Platform</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <div className="flex items-center space-x-1 text-sm font-medium cursor-pointer hover:text-primary">
            <span>Agents Platform</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <div className="flex items-center space-x-1 text-sm font-medium cursor-pointer hover:text-primary">
            <span>Developers</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <div className="flex items-center space-x-1 text-sm font-medium cursor-pointer hover:text-primary">
            <span>Resources</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <Link href="/enterprise" className="text-sm font-medium hover:text-primary">
            Enterprise
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary">
            Pricing
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
          <Button size="sm" className="bg-black text-white hover:bg-gray-800">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  )
}
