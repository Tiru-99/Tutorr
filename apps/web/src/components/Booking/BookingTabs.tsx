"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Types aligned with your Prisma model. Dates arrive as ISO strings from backend.
export type Booking = {
  id: string
  teacherId: string
  studentId: string
  startTime: string | null
  endTime: string | null
  meeting_url?: string | null
  payment_id?: string | null
  order_id?: string | null
  amount?: string | number | null
  cancellationBy?: string | null
  cancelledAt?: string | null
  cancellationReason?: string | null
  status: string
  // You can extend with nested student/teacher objects if you need to show names
  // student?: { name?: string | null } | null
  // teacher?: { name?: string | null } | null
}

// Variables to help you integrate your APIs (you can ignore if not needed)
export const API_PATHS = {
  list: "/api/teacher/bookings", // GET (expects header "x-teacher-id")
  cancel: (id: string) => `/api/teacher/bookings/${id}/cancel`, // POST or PATCH with { reason }
}
export const REQUIRED_HEADERS = {
  teacherIdHeader: "x-teacher-id",
}

// Props only accept data + callbacks; no fetching inside
export interface BookingTabsProps {
  bookings: Booking[]
  onCancel?: (bookingId: string, reason: string) => Promise<void> | void
  onJoin?: (booking: Booking) => void
  now?: Date // for testing; defaults to new Date()
  className?: string
}

export function BookingTabs(props: BookingTabsProps) {
  const { bookings, onCancel, onJoin, now, className } = props

  const nowMs = (now ?? new Date()).getTime()

  // Helper to parse ISO safely. If missing endTime, treat as upcoming.
  const isCompleted = (b: Booking) => {
    if (!b?.endTime) return false
    const endMs = Date.parse(b.endTime)
    if (Number.isNaN(endMs)) return false
    return endMs < nowMs
  }

  const upcoming = React.useMemo(
    () =>
      bookings
        .filter((b) => !isCompleted(b))
        .sort(
          (a, b) => (toMs(a.startTime) ?? Number.POSITIVE_INFINITY) - (toMs(b.startTime) ?? Number.POSITIVE_INFINITY),
        ),
    [bookings, nowMs],
  )

  const completed = React.useMemo(
    () =>
      bookings
        .filter((b) => isCompleted(b))
        .sort((a, b) => (toMs(b.endTime) ?? Number.NEGATIVE_INFINITY) - (toMs(a.endTime) ?? Number.NEGATIVE_INFINITY)),
    [bookings, nowMs],
  )

  const [cancelOpen, setCancelOpen] = React.useState(false)
  const [reason, setReason] = React.useState("")
  const [pending, setPending] = React.useState(false)
  const [selected, setSelected] = React.useState<Booking | null>(null)

  function openCancelDialog(b: Booking) {
    setSelected(b)
    setReason("")
    setCancelOpen(true)
  }

  async function handleConfirmCancel() {
    if (!selected) return
    setPending(true)
    try {
      await onCancel?.(selected.id, reason.trim())
      // Parent should refresh data after this if needed
      setCancelOpen(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <Tabs defaultValue="upcoming" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          {/* Optional: total counts */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Upcoming:</span>
            <Badge variant="secondary">{upcoming.length}</Badge>
            <span className="ml-3">Completed:</span>
            <Badge variant="outline">{completed.length}</Badge>
          </div>
        </div>

        <TabsContent value="upcoming" className="mt-4">
          <div className="flex flex-col gap-3">
            {upcoming.length === 0 ? (
              <EmptyState label="No upcoming meetings" />
            ) : (
              upcoming.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  variant="upcoming"
                  onJoin={onJoin}
                  onCancelClick={() => openCancelDialog(b)}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="flex flex-col gap-3">
            {completed.length === 0 ? (
              <EmptyState label="No completed meetings" />
            ) : (
              completed.map((b) => <BookingRow key={b.id} booking={b} variant="completed" />)
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Cancel Dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel meeting?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please provide a brief reason for cancellation.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <div className="text-sm text-muted-foreground">
              Booking ID: <span className="font-medium text-foreground">{selected?.id}</span>
            </div>
            <Textarea
              placeholder="Type the cancellation reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-24"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCancelOpen(false)} disabled={pending}>
              Keep meeting
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={pending || reason.trim().length === 0}
            >
              {pending ? "Cancelling..." : "Cancel meeting"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BookingRow({
  booking,
  variant,
  onJoin,
  onCancelClick,
}: {
  booking: Booking
  variant: "upcoming" | "completed"
  onJoin?: (booking: Booking) => void
  onCancelClick?: () => void
}) {
  const start = toDate(booking.startTime)
  const end = toDate(booking.endTime)

  const displayDate = formatDate(start ?? end ?? new Date())
  const displayTime = [formatTime(start), "—", formatTime(end)].filter(Boolean).join(" ")

  const actionsAllowed = variant === "upcoming"

  return (
    <div
      className={cn(
        "w-full rounded-md border bg-card",
        // Reduce vertical padding only; keep horizontal comfortable
        "px-4 py-2",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Date + Title */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {/* Subtle status dot instead of heavy icons */}
            <span
              aria-hidden="true"
              className={cn(
                "inline-block size-2 rounded-full",
                variant === "upcoming" ? "bg-emerald-500" : "bg-muted-foreground/50",
              )}
            />
            <p className="truncate text-sm font-medium text-foreground">{displayDate}</p>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{displayTime}</p>
        </div>

        {/* Middle: status chip */}
        <div className="hidden shrink-0 sm:flex">
          <Badge variant={variant === "upcoming" ? "secondary" : "outline"}>
            {variant === "upcoming" ? "Upcoming" : "Completed"}
          </Badge>
        </div>

        {/* Right: Actions (only on Upcoming) */}
        <div className="flex items-center gap-2">
          {actionsAllowed ? (
            <>
              <Button
                size="sm"
                onClick={() => {
                  if (booking.meeting_url) {
                    if (typeof window !== "undefined") window.open(booking.meeting_url, "_blank", "noopener,noreferrer")
                  } else {
                    onJoin?.(booking)
                  }
                }}
              >
                Join now
              </Button>
              <Button size="sm" variant="destructive" onClick={onCancelClick}>
                Cancel meeting
              </Button>
            </>
          ) : (
            <Badge variant="outline" className="sm:hidden">
              Completed
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center rounded-md border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
      {label}
    </div>
  )
}

// Helpers
function toDate(iso: string | null | undefined): Date | null {
  if (!iso) return null
  const t = Date.parse(iso)
  return Number.isNaN(t) ? null : new Date(t)
}
function toMs(iso: string | null | undefined): number | null {
  const d = toDate(iso)
  return d ? d.getTime() : null
}
function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}
function formatTime(date: Date | null) {
  if (!date) return ""
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

/**
 * Example usage (parent fetches with your headers, then passes data in):
 *
 * const res = await fetch(API_PATHS.list, { headers: { [REQUIRED_HEADERS.teacherIdHeader]: teacherId } })
 * const { bookings } = await res.json()
 *
 * <BookingTabs
 *   bookings={bookings}
 *   onCancel={async (id, reason) => {
 *     await fetch(API_PATHS.cancel(id), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason }) })
 *     // then revalidate/refetch
 *   }}
 *   onJoin={(b) => console.log("Custom join", b)}
 * />
 */
