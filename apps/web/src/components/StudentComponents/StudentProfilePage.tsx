"use client" // now this is a client component

import { Mail, Phone } from "lucide-react"
import { useGetStudentProfile } from "@/hooks/studentProfileHooks"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { User } from "lucide-react"

export default function StudentProfilePage({ id }: { id: string }) {
  console.log("The incoming id is", id)
  const { data: student, isLoading, isError } = useGetStudentProfile(id)
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading Student Profile...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-destructive">Failed to load student profile. Please try again later.</div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No student data found.</div>
      </div>
    )
  }

  console.log("The student is ", student)

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Banner Image */}
          <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-t-lg">
            <img
              src={student?.banner_pic || "/images/banner.jpg"}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile section */}
          <div className="bg-card px-4 sm:px-6 md:px-8 pb-6 rounded-b-lg shadow-lg">
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8 -mt-16 md:-mt-12">
              {/* Profile Image */}
              <div className="flex justify-center md:justify-start">
                {student?.profile_pic ? (
                  <img
                    src={student.profile_pic}
                    alt="Profile"
                    className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-4 border-background object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-4 border-background bg-gray-50 flex items-center justify-center shadow-lg">
                    <User className="text-gray-300 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex flex-col items-center md:items-start mt-2 md:mt-20 md:pb-3 flex-1">
                <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-foreground">
                  {student?.name || "No Name"}
                </h1>


                {/* Interests/Tags */}
                <div className="flex flex-row flex-wrap justify-center md:justify-start gap-2 mt-3">
                  {student?.interests?.length > 0 ? (
                    student.interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">No current interests</Badge>
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 sm:gap-8 mt-4 w-full">
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-muted-foreground" />
                    <p className="text-primary text-sm sm:text-base truncate">
                      {student?.user?.email || "No Email added"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-muted-foreground" />
                    <p className="text-primary text-sm sm:text-base">{student?.phoneNumber || "No Phone added"}</p>
                  </div>
                </div>
              </div>

              {/* Edit Details Link */}
              <div className="flex justify-center md:justify-end md:pb-3">
                <button className="text-primary hover:text-primary/80 hover:cursor-pointer underline text-sm sm:text-base transition-colors"
                  onClick={() => router.push("/student/edit")}>
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
