"use client"

export default function ProfileLazyLoader() {
  return (
    <div className="animate-pulse p-4 space-y-6">
      {/* Banner */}
      <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 bg-gray-200 rounded-lg"></div>

      {/* Profile Section */}
      <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-12 px-4 sm:px-6 md:px-8">
        {/* Profile Image */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-60 md:h-60 bg-gray-200 rounded-full border-4 border-white shadow-md"></div>

        {/* Text placeholders */}
        <div className="flex-1 space-y-4 mt-4 md:mt-12">
          <div className="h-6 w-40 bg-gray-200 rounded"></div>
          <div className="flex flex-wrap gap-2">
            <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-5 w-48 bg-gray-200 rounded"></div>
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* About Section */}
      <div className="px-4 sm:px-6 md:px-16">
        <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Session Timings */}
      <div className="px-4 sm:px-6 md:px-16 mt-4">
        <div className="border border-gray-300 rounded-lg p-4 space-y-3">
          <div className="h-5 w-40 bg-gray-200 rounded"></div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-6 w-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
