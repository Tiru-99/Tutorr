"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const BookingSkeleton = () => {
  const skeletons = Array.from({ length: 5 }) // same as pageSize

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      {/* Heading skeleton */}
      <div className="w-full max-w-4xl flex flex-col items-start gap-2 md:pt-8">
        <Skeleton className="h-10 w-72 rounded" /> {/* main heading */}
        <Skeleton className="h-4 w-96 rounded" />  {/* subtext */}
      </div>

      {/* Bookings list skeleton */}
      <div className="flex flex-col gap-4 w-full max-w-4xl mt-4">
        {skeletons.map((_, index) => (
          <Card key={index} className="rounded-xl shadow-sm border">
            <CardContent className="flex justify-between items-center py-4">
              {/* Left side: date & time */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-4 w-48 rounded" />
              </div>

              {/* Right side: buttons */}
              <div className="flex gap-3">
                <Skeleton className="h-10 w-24 rounded" />
                <Skeleton className="h-10 w-32 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
