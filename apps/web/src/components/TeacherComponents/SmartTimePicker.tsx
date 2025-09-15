"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SmartTimePickerProps {
  startTime: string
  endTime: string
  onTimeChange: (startTime: string, endTime: string) => void
  className?: string
}

export default function SmartTimePicker({
  startTime,
  endTime,
  onTimeChange,
  className = "",
}: SmartTimePickerProps) {
  // Time options: 0 - 23 (24h format)
  const timeOptions = Array.from({ length: 24 }, (_, i) => i.toString())

  const getAvailableEndTimes = (start: string) => {
    const startInt = parseInt(start, 10)
    return timeOptions.filter((t) => parseInt(t, 10) > startInt)
  }

  const handleStartTimeChange = (newStart: string) => {
    let newEnd = endTime
    const availableEndTimes = getAvailableEndTimes(newStart)

    if (!availableEndTimes.includes(endTime)) {
      newEnd = availableEndTimes[0] || newStart
    }

    onTimeChange(newStart, newEnd)
  }

  const handleEndTimeChange = (newEnd: string) => {
    onTimeChange(startTime, newEnd)
  }

  return (
    <div className={`flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white ${className}`}>
      {/* Start time */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 font-medium">From:</span>
        <Select value={startTime} onValueChange={handleStartTimeChange}>
          <SelectTrigger className="w-24 bg-white border-gray-300 text-gray-900">
            <SelectValue placeholder = "Start"/>
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {timeOptions.map((t) => (
              <SelectItem key={t} value={t} className="text-gray-900 hover:bg-gray-50">
                {t}:00
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="text-gray-400 font-medium">-</span>

      {/* End time */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 font-medium">To:</span>
        <Select value={endTime} onValueChange={handleEndTimeChange}>
          <SelectTrigger className="w-24 bg-white border-gray-300 text-gray-900">
            <SelectValue placeholder ="End"/>
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {getAvailableEndTimes(startTime).map((t) => (
              <SelectItem key={t} value={t} className="text-gray-900 hover:bg-gray-50">
                {t}:00
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
