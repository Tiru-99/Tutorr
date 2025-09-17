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
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useLogout } from "@/hooks/authHooks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Search, User, Settings, LogOut, Menu , BookOpen } from "lucide-react"

export function StudentNavbar() {
  const [activeSection, setActiveSection] = useState("");

  const router = useRouter();
  const { mutate: logout, isPending, isError } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push("/auth/login");
        toast.success("Logged out successfully , redirecting to login page")
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-foreground">Tutorr</span>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center space-x-4 max-w-md mx-8">
          <Button
            variant={activeSection === "bookings" ? "default" : "ghost"}
            className="flex items-center space-x-2 transition-colors hover:bg-accent hover:text-accent-foreground px-4"
            onClick={() => {
              setActiveSection("bookings")
              router.push("/student/bookings")
            }}
          >
            <Calendar className="h-4 w-4" />
            <span>Bookings</span>
          </Button>

          <Button
            variant={activeSection === "tutors" ? "default" : "ghost"}
            className="flex items-center space-x-2 transition-colors hover:bg-accent hover:text-accent-foreground px-4"
            onClick={() => {
              setActiveSection("tutors")
              router.push("/search")
            }}
          >
            <Search className="h-4 w-4" />
            <span>Find Tutors</span>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Profile Dropdown - visible on all screen sizes */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 px-2 hover:bg-accent hover:text-accent-foreground transition-colors rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/diverse-student-profiles.png" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer"
              onClick={() => router.push("/student/profile")}>
                <User className="h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer"
              onClick={() => router.push("/student/edit")}>
                <Settings className="h-4 w-4" />
                <span>Edit Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center space-x-2 text-destructive cursor-pointer"
                onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-accent hover:text-accent-foreground transition-colors p-2"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => {
                    setActiveSection("bookings")
                    router.push("/student/bookings")
                  }}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Bookings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => {
                    setActiveSection("tutors");
                    router.push("/search")
                  }}
                >
                  <Search className="h-4 w-4" />
                  <span>Find Tutors</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
