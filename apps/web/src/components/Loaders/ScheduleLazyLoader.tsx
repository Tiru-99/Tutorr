"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function ScheduleLazyLoader() {
  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* Page Title */}
      <Skeleton className="h-8 w-64" />

      {/* Schedule Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Divider */}
      <Skeleton className="h-[1px] w-full" />

      {/* Override Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
