"use client"

import { useState, useEffect } from "react"
import SmartTimePicker from "./SmartTimePicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Globe, Calendar, Settings, Timer } from "lucide-react"
import { useScheduleContext } from "@/context/ScheduleContext"
import { Button } from "../ui/button"
import { useInsertSchedule } from "@/hooks/overrideHooks"
import { toast } from "sonner"

const timezones = [
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Toronto",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
]

type ScheduleType = {
  timezone: string
  duration: number,
  days: string[]
}

type TemplateType = {
  startTime: string
  endTime: string
}

interface ScheduleSectionProps {
  schedule: ScheduleType
  templates: TemplateType[]
}

export default function ScheduleSection({ schedule, templates }: ScheduleSectionProps) {
  // context api reference
  const { timezone, setTimezone, selectedDays, setSelectedDays } = useScheduleContext()

  const durationMap = {
    "1 Hour": 1,
    "2 Hour": 2,
    "3 Hour": 3,
  }

  const [duration, setDuration] = useState<number | null>(1)
  const { mutate, isPending, isError } = useInsertSchedule()
  const [time, setTime] = useState({
    startTime: "",
    endTime: "",
  });
  console.log("The schedule is ", schedule);

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT"]

  useEffect(() => {
    // Always set default values first
    const defaultDuration = 1;
    const defaultSelectedDays:string[] = [];

    if (!schedule) {
      // Set default values when schedule is not available
      setDuration(defaultDuration);
      setSelectedDays(defaultSelectedDays);
      // You can set a default timezone if needed
      // setTimezone("UTC") // or your preferred default timezone
      return;
    }

    // Set timezone, duration, and days from schedule
    if (schedule.timezone) setTimezone(schedule.timezone);
    if (schedule.duration !== undefined) setDuration(schedule.duration);
    if (schedule.days) setSelectedDays(schedule.days);

    // Handle time setting based on templates availability
    if (templates && templates.length > 0) {
      const { startTime, endTime } = templates[0];
      const timezone = schedule.timezone;

      if (startTime && endTime && timezone) {
        const converted = convertToTimezoneHours(startTime, endTime, timezone);
        console.log("Converted", converted);
        setTime({
          startTime: converted.start,
          endTime: converted.end,
        });
      } 
    } 
  }, [schedule, templates])
  // for passing changes from child to parent from smarttimepicker
  const handleTimeChange = (start: string, end: string) => {
    setTime({ startTime: start, endTime: end })
  }

  const toggleDays = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    // converting it to HH:mm format
    if(time.startTime == "" || time.endTime == ""){
      toast.error("Please fill the start time and end time");
      return ; 
    }

    if(timezone == ""){
      toast.error("Please enter the timezone");
      return; 
    }

    const padTime = (time: string) => {
      return time.length === 1 ? `0${time}` : time
    }

    const startTimeToSend = `${padTime(time.startTime)}:00`
    const endTimeToSend = `${padTime(time.endTime)}:00`
    const dataToSend = {
      timezone,
      startTime: startTimeToSend,
      endTime: endTimeToSend,
      duration,
      days: selectedDays
    }
    console.log("data to send is ", dataToSend)

    mutate(dataToSend, {
      onSuccess: () => {
        toast.success("Schedule saved successfully", {
          description: "Your schedule was saved successfully.",
        })
      },
      onError: (err) => {
        toast.error("Failed To Save Schedule !", {
          description: err.message || "Something went wrong. Please try again.",
        })
      },
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Schedule Configuration</h1>
            <p className="text-muted-foreground">Configure your working hours and manage schedule overrides</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Schedule Configuration Card */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Tutor Availability Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Session Hours Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Session Hours</h3>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <SmartTimePicker
                    startTime={time.startTime}
                    endTime={time.endTime}
                    onTimeChange={handleTimeChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Session Duration Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Session Duration
                  </h3>
                </div>
                <Select
                  value={duration !== null ? duration.toString() : ""}
                  onValueChange={(val) => setDuration(Number(val))}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(durationMap).map(([key, value]) => (
                      <SelectItem key={key} value={value.toString()}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Availability Days Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Available Days</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {days.map((day) => (
                    <Badge
                      key={day}
                      variant={selectedDays.includes(day) ? "default" : "outline"}
                      className="cursor-pointer px-4 py-2 text-sm font-medium transition-all hover:scale-105"
                      onClick={() => toggleDays(day)}
                    >
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timezone and Actions Card */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-primary" />
                Timezone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timezone"/>
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Save Button Card */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <Button className="w-full" disabled={isPending} onClick={handleSave} size="lg">
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving Schedule...
                  </span>
                ) : (
                  "Save Schedule"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// util function
import { DateTime } from "luxon"

function convertToTimezoneHours(startTime: string, endTime: string, timezone: string): { start: string; end: string } {
  // parse the UTC ISO string
  const start = DateTime.fromISO(startTime, { zone: "utc" }).setZone(timezone)
  const end = DateTime.fromISO(endTime, { zone: "utc" }).setZone(timezone)

  // return the hour in 24-hour format as string
  return {
    start: start.hour.toString(),
    end: end.hour.toString(),
  }
}
