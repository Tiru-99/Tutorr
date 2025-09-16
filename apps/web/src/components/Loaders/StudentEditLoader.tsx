"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function StudentEditSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="shadow-sm px-12 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" /> {/* back button */}
            <Skeleton className="h-6 w-40" /> {/* heading */}
          </div>
          <Skeleton className="h-9 w-20 rounded-full" /> {/* Save button */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left Side - Profile Photo */}
          <div className="flex flex-col items-center lg:items-start">
            <Skeleton className="w-32 h-32 lg:w-40 lg:h-40 rounded-full" /> {/* Avatar */}
            <Skeleton className="mt-4 h-9 w-40 rounded-full" /> {/* Add photo button */}
          </div>

          {/* Right Side - Form Fields */}
          <div className="flex-1 space-y-8">
            
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" /> {/* label */}
                <Skeleton className="h-11 w-full rounded-lg" /> {/* input */}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            </div>

            {/* Interests Section */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" /> {/* label */}
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
