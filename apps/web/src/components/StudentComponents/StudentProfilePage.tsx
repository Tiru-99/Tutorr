"use client"; // now this is a client component

import { Mail, Phone } from "lucide-react";
import { useGetStudentProfile } from "@/hooks/studentProfileHooks";

export default function StudentProfilePage({ id }: { id: string }) {
    console.log("The incoming id is", id);
    const { data: student, isLoading, isError } = useGetStudentProfile(id); 

    if (isLoading) {
        return <div>Loading Student Profile...</div>;
    }

    if (isError) {
        return <div>Failed to load student profile. Please try again later.</div>;
    }

    if (!student) {
        return <div>No student data found.</div>;
    }

    console.log("The student is " , student);
    console.log("Studnet name is " , student.user.name);

    return (
        <div className="border border-gray-300 max-w-4xl mx-auto">
            <div className="relative">
                {/* Banner Image */}
                <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
                    <img
                        src={student?.banner_pic || "/images/banner.jpg"}
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Profile section */}
                <div className="px-4 sm:px-6 md:px-8 pb-4">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8 -mt-16 md:-mt-12">
                        {/* Profile Image */}
                        <div className="flex justify-center md:justify-start">
                            <img
                                src={student?.profile_pic || "/images/man.jpg"}
                                alt="Profile"
                                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-4 border-white object-cover shadow-md"
                            />
                        </div>

                        {/* Profile Details */}
                        <div className="flex flex-col items-center md:items-start mt-2 md:mt-0 md:pb-3">
                            <h2 className="font-bold text-xl sm:text-2xl">{student?.user?.name || "No Name"}</h2>

                            {/* Interests/Tags */}
                            <div className="flex flex-row flex-wrap justify-center md:justify-start gap-1 mt-2">
                                {student?.interests?.length > 0 ? (
                                    student.interests.map((interest: string, index: number) => (
                                        <div
                                            key={index}
                                            className="border border-gray-300 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm text-gray-700 rounded-full"
                                        >
                                            {interest}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500 text-sm">No current interests</div>
                                )}
                            </div>

                            {/* Contact Info */}
                            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 sm:gap-6 mt-3 sm:mt-4 w-full">
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <Mail size={16} className="text-gray-600" />
                                    <p className="text-blue-600 text-sm sm:text-base truncate">
                                        {student?.user?.email || "No Email added"}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 sm:gap-2">
                                    <Phone size={16} className="text-gray-600" />
                                    <p className="text-blue-600 text-sm sm:text-base">
                                        {student?.phoneNumber || "No Phone added"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Details Link */}
            <div className="flex justify-end pr-4 sm:pr-6 md:pr-8 pb-3 sm:pb-4 -mt-2 md:mt-0">
                <u>
                    <p className="cursor-pointer text-blue-400 text-sm sm:text-base">Edit Details</p>
                </u>
            </div>
        </div>
    );
}
