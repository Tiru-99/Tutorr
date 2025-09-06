"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useGetBookingsForStudents, useCancelBookingForStudent } from "@/hooks/bookingHooks"
import { format } from "date-fns"
import { useState, useMemo } from "react"
import { toast } from "sonner"
import { ReviewDialog } from "@/components/StudentComponents/ReviewDialog"

type Booking = {
  id: string
  startTime: string
  endTime: string
  status: string
  meeting_url: string
}

export default function Home() {
  const { data, isLoading, isError, refetch } = useGetBookingsForStudents()
  const { mutate, isPending } = useCancelBookingForStudent()

  // Pagination states
  const [upcomingPage, setUpcomingPage] = useState(1)
  const [completedPage, setCompletedPage] = useState(1)
  const pageSize = 5

  // Cancel dialog state
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [reason, setReason] = useState("")

  const { scheduled, completed } = useMemo(() => {
    if (!data?.bookings) return { scheduled: [], completed: [] }
    return categorizeBookings(data.bookings)
  }, [data?.bookings])

  const paginatedScheduled = useMemo(() => {
    return scheduled.slice((upcomingPage - 1) * pageSize, upcomingPage * pageSize)
  }, [scheduled, upcomingPage, pageSize])

  const paginatedCompleted = useMemo(() => {
    return completed.slice((completedPage - 1) * pageSize, completedPage * pageSize)
  }, [completed, completedPage, pageSize])

  const upcomingTotalPages = Math.ceil(scheduled.length / pageSize)
  const completedTotalPages = Math.ceil(completed.length / pageSize)

  const handleCancel = () => {
    if (!selectedBooking) return
    mutate(
      { bookingId: selectedBooking, reason },
      {
        onSuccess: () => {
          toast.success("Booking cancelled successfully", { position: "bottom-center" })
          setReason("")
          setSelectedBooking(null)
          setOpenDialog(false)
          refetch()
        },
        onError: () => {
          toast.error("Failed to cancel booking", { position: "bottom-center" })
        },
      }
    )
  }

  if (isLoading) return <p>Loading bookings...</p>
  if (isError) return <p>Failed to load bookings</p>
  if (!data?.bookings) return <p>No bookings found</p>

  return (
    <div className="mx-auto max-w-4xl pt-10 px-4">
      <h1 className="text-3xl font-semibold">Your bookings</h1>
      <p className="font-thin text-gray-600 pt-3">
        Bookings are split into Upcoming and Completed based on the meeting end time.
      </p>

      <div className="flex flex-col gap-6 mt-6">
        <Tabs defaultValue="Upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="Upcoming">Upcoming ({scheduled.length})</TabsTrigger>
            <TabsTrigger value="Completed">Completed ({completed.length})</TabsTrigger>
          </TabsList>

          {/* UPCOMING BOOKINGS */}
          <TabsContent value="Upcoming" className="mt-4 space-y-4">
            {paginatedScheduled.length === 0 ? (
              <Card className="rounded-xl shadow-sm border">
                <CardContent className="py-8 text-center text-gray-500">No upcoming bookings</CardContent>
              </Card>
            ) : (
              paginatedScheduled.map((booking) => (
                <Card key={booking.id} className="rounded-xl shadow-sm border">
                  <CardContent className="flex justify-between items-center py-4">
                    <div>
                      <p className="font-semibold">{format(new Date(booking.startTime), "MMM dd, yyyy")}</p>
                      <p className="text-gray-600 text-sm">
                        {format(new Date(booking.startTime), "hh:mm a")} —{" "}
                        {format(new Date(booking.endTime), "hh:mm a")}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="default" onClick={() => window.open(booking.meeting_url, "_blank")}>
                        Join now
                      </Button>
                      <Button
                        variant="outline"
                        disabled={isPending && selectedBooking === booking.id}
                        onClick={() => {
                          setSelectedBooking(booking.id)
                          setOpenDialog(true)
                        }}
                      >
                        {isPending && selectedBooking === booking.id ? "Cancelling..." : "Cancel meeting"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {/* Pagination Controls */}
            {scheduled.length > pageSize && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  disabled={upcomingPage === 1}
                  onClick={() => setUpcomingPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {upcomingPage} of {upcomingTotalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={upcomingPage >= upcomingTotalPages}
                  onClick={() => setUpcomingPage((prev) => Math.min(upcomingTotalPages, prev + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          {/* COMPLETED BOOKINGS */}
          <TabsContent value="Completed" className="mt-4 space-y-4">
            {paginatedCompleted.length === 0 ? (
              <Card className="rounded-xl shadow-sm border">
                <CardContent className="py-8 text-center text-gray-500">No completed bookings</CardContent>
              </Card>
            ) : (
              paginatedCompleted.map((booking) => (
                <Card key={booking.id} className="rounded-xl shadow-sm border">
                  <CardContent className="flex justify-between items-center py-4">
                    <div>
                      <p className="font-semibold">{format(new Date(booking.startTime), "MMM dd, yyyy")}</p>
                      <p className="text-gray-600 text-sm">
                        {format(new Date(booking.startTime), "hh:mm a")} —{" "}
                        {format(new Date(booking.endTime), "hh:mm a")}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-sm flex items-center gap-2 text-green-600">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Completed
                      </p>

                      {/* Review Dialog Button */}
                      <ReviewDialog
                        bookingId={booking.id}
                      />
                    </div>

                  </CardContent>
                </Card>
              ))
            )}

            {/* Pagination Controls */}
            {completed.length > pageSize && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  disabled={completedPage === 1}
                  onClick={() => setCompletedPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {completedPage} of {completedTotalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={completedPage >= completedTotalPages}
                  onClick={() => setCompletedPage((prev) => Math.min(completedTotalPages, prev + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mb-2">
            Are you sure you want to cancel this booking?
          </p>
          <p className="text-sm text-red-600 mb-4">
            ⚠️ Note: If a student cancels, a 5% platform fee will be charged.
          </p>
          <Textarea
            placeholder="Enter cancellation reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpenDialog(false)} disabled={isPending}>
              Close
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={isPending}>
              {isPending ? "Cancelling..." : "Confirm Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const categorizeBookings = (bookings: Booking[]) => {
  const scheduled: Booking[] = []
  const completed: Booking[] = []

  bookings.forEach((booking) => {
    if (booking.status === "SCHEDULED") scheduled.push(booking)
    if (booking.status === "COMPLETED") completed.push(booking)
  })

  return { scheduled, completed }
}
