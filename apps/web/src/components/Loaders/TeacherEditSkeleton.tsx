'use client'

import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherEditSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center animate-pulse">
      <div className="w-full bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-40 h-6 rounded-md" />
          </div>
          <Skeleton className="w-24 h-10 rounded-lg" />
        </div>

        {/* Main Form */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <Skeleton className="w-32 h-32 lg:w-40 lg:h-40 rounded-full mb-3" />
              <Skeleton className="w-36 h-10 rounded-full" />
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-6">
              {/* First row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="w-full h-10 rounded-md" />
                <Skeleton className="w-full h-10 rounded-md" />
                <Skeleton className="w-full h-10 rounded-md" />
              </div>

              {/* Second row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="w-full h-10 rounded-md" />
                <Skeleton className="w-full h-10 rounded-md" />
                <Skeleton className="w-full h-10 rounded-md" />
              </div>

              {/* About textarea */}
              <Skeleton className="w-full h-24 rounded-md" />

              {/* Price input */}
              <Skeleton className="w-40 h-10 rounded-md" />

              {/* File Upload */}
              <Skeleton className="w-full h-20 rounded-lg" />

              {/* Expertise buttons */}
              <div className="flex flex-wrap gap-2">
                {Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton key={idx} className="w-24 h-10 rounded-full" />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
