import { BookOpen } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const router = useRouter(); 
  return (
    <nav className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 md:h-7 md:w-7 text-green-600" />
            <span className="text-xl md:text-3xl font-bold text-gray-900">Tutorr</span>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-6">
            <button className="text-gray-700 hover:text-gray-900 cursor-pointer text-shadow-xs font-medium"
            onClick={()=> router.push("/auth/login")}>Log in</button>
            <Button className="bg-green-700 hover:bg-green-800 text-shadow-xs text-white cursor-pointer px-4 py-2 rounded-md font-medium shadow-lg"
            onClick={() => router.push("/auth/signup")}>
              Become a tutor
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
