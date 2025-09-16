import { Loader2 } from "lucide-react"

export function Loader() {
  return (
    <div className="flex justify-center items-center py-6">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      <span className="ml-2 text-sm text-gray-600">Loading...</span>
    </div>
  )
}