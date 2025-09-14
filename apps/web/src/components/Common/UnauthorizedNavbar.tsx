"use client"

import { GraduationCap, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter(); 

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left side: Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            <GraduationCap className="h-6 w-6 text-secondary stroke-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground">Tutorr</span>
          </div>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Home
          </a>
        </div>

        {/* Right side: Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="ghost" className="text-sm font-medium hover:bg-muted hover:cursor-pointer"
          onClick={()=> router.push("/auth/login")}>
            Log In
          </Button>
          <Button className="text-sm font-medium bg-blue-700 text-white hover:bg-blue-600 hover:cursor-pointer rounded-lg px-6"
          onClick={() => router.push("/auth/signup")}>
            Sign Up
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={toggleMenu} className="p-2">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="px-6 py-4 space-y-4">
            <div className="flex flex-col space-y-3">
              <a
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
              >
                Home
              </a>
            </div>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button variant="ghost" className="justify-start text-sm font-medium"
              onClick={() => router.push("/auth/login")}>
                Log In
              </Button>
              <Button className="justify-start text-sm font-medium bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              onClick={() => router.push("/auth/signup")}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
