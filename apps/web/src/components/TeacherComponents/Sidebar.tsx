"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { Calendar, User, Settings, ChevronDown, BookOpen, BarChart3, LogOut, Menu, X, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import LogoutButton from "../Common/LogoutButton"

export function TeacherSidebar() {
  const [activeSection, setActiveSection] = useState("profile")
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const router = useRouter();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-background/95 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col shadow-lg",
          "w-64",
          // Mobile slide in/out
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border bg-sidebar">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-sidebar-primary">
              <BookOpen className="h-5 w-5 text-sidebar-primary" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">Tutorr</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
          {/* Profile Section */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={activeSection === "profile" ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                  "px-3",
                  activeSection === "profile" && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
                onClick={() => setActiveSection("profile")}
              >
                <Avatar className="h-6 w-6 mr-2 flex-shrink-0">
                  <AvatarImage src="/teacher-profile.png" />
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 text-left">Profile</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-48">
              <DropdownMenuItem className="cursor-pointer"
                onClick={() => {
                  router.push("/teacher/profile")
                }}>
                <User className="h-4 w-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer"
                onClick={() => {
                  router.push("/teacher/edit")
                }}>
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bookings Section */}
          <Button
            variant={activeSection === "bookings" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
              "px-3",
              activeSection === "bookings" && "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
            onClick={() => {
              setActiveSection("bookings");
              router.push("/teacher/bookings")
            }}
          >
            <Calendar className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="flex-1 text-left">Bookings</span>
          </Button>


          {/* Settings Section */}
          <Button
            variant={activeSection === "settings" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
              "px-3",
              activeSection === "settings" && "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
            onClick={() => {
              setActiveSection("settings");
              router.push("/teacher/wallet")
            }}
          >
            <Wallet className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="flex-1 text-left">Wallet</span>
          </Button>

          {/* Spacer */}
          <div className="flex-1" />
        </nav>

        {/* Footer */}
        <LogoutButton/>
      </aside>

      {/* Main Content Spacer */}
      <div className="transition-all duration-300 lg:block hidden ml-64" />
    </>
  )
}
