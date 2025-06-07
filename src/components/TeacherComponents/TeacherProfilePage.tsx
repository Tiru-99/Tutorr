"use client"

import { Mail, Phone } from "lucide-react";
import { useGetTeacherDetails } from "@/hooks/teacherProfileHooks";
import LicenseComponent from "./LicenseAndReviews";
import TabletLicenseComponent from "./TabletLicenseView";
import { useState } from "react";
import { TeacherProvider } from "@/context/TeacherContext";
import { useEffect } from "react";


export default function TeacherProfilePage({ id }: { id: string }) {
    const { data: teacher, isLoading, isError } = useGetTeacherDetails(id);
    const [sessionSlots, setSessionSlots] = useState<string[]>([]);
    console.log("The data isss", teacher);

    //function to generate time slots
    useEffect(() => {
        if (teacher?.start_time && teacher?.end_time && teacher?.session_duration) {
            const start = parseInt(teacher.start_time.slice(0, 2), 10);
            const end = parseInt(teacher.end_time.slice(0, 2), 10);
            const dur = parseInt(teacher.session_duration, 10);
            const slots: string[] = [];

            for (let i = start; i + dur <= end; i++) {
                const hour24 = i;
                const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
                const suffix = hour24 < 12 ? "AM" : "PM";
                const formatted = `${hour12}:00 ${suffix}`;
                slots.push(formatted);
            }

            setSessionSlots(slots);
        }
    }, [teacher]);



    if (isLoading) {
        return <div>Loading teacher Profile...</div>;
    }

    if (isError) {
        return <div>Failed to load teacher profile. Please try again later. {isError}</div>;
    }
    console.log("The teacher data is", teacher.name)
    if (!teacher) {
        return <div>No teacher data found.</div>;
    }

    return (
        <>
            {/* for the context api */}
            <TeacherProvider sessionSlots={sessionSlots} availableDays={teacher?.available_days || []} sessionDuration={teacher?.session_duration} id={id}>
                <div className="flex flex-col lg:flex-row gap-6 lg:max-w-full lg:justify-center lg:px-28">
                    <div className="lg:w-3/4 w-full">
                        <div className="border border-gray-300 ">
                            <div className="relative">
                                {/* Banner Image */}
                                <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
                                    <img
                                        src={teacher.banner_pic || "/images/banner.jpg"}
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
                                                src={teacher.profile_pic || "/images/man.jpg"}
                                                alt="Profile"
                                                className="w-32 h-32 sm:w-40 sm:h-40 md:w-60 md:h-60 rounded-full border-4 border-white object-cover shadow-md"
                                            />
                                        </div>

                                        {/* Profile Details */}
                                        <div className="flex flex-col items-center md:items-start mt-2 md:mt-0 md:pb-3">
                                            <h2 className="font-bold text-xl sm:text-2xl">{teacher.name || "No name"}</h2>

                                            {/* Interests/Tags */}
                                            <div className="flex flex-row flex-wrap justify-center md:justify-start gap-1 mt-2">
                                                {teacher.expertise?.length > 0 ? (
                                                    teacher.expertise.map((interest: string, index: number) => (
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
                                            <div className="flex flex-col sm:flex-row justify-center md:justify-between gap-3 sm:gap-6 md:gap-32 mt-3 sm:mt-4 w-full">
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <Mail size={16} className="text-gray-600" />
                                                    <p className="text-blue-600 text-sm sm:text-base truncate">{teacher.company_name || "Urbantap"}</p>
                                                </div>

                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <Phone size={16} className="text-gray-600" />
                                                    <p className="text-blue-600 text-sm sm:text-base">{teacher.years_of_exp || "10 Years of Exp"}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 self-start">
                                                <div className="flex items-start gap-1 sm:gap-2">
                                                    <Phone size={16} className="text-gray-600" />
                                                    <p className="text-blue-600 text-sm sm:text-base">
                                                        {teacher.highest_education || "B.Tech Civil Engineering"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About Me Section */}
                            <div className="md:px-16 pl-4 mt-4">
                                <h2 className="font-semibold text-lg">About Me</h2>
                                <p className="text-sm text-gray-500 whitespace-normal break-words">
                                    {teacher.about}
                                </p>
                            </div>
                            {/* Session Timings */}
                            <div className="md:px-16 px-2 pl-4 mt-4  md:mt-10">
                                <div className="border border-gray-300 p-4 rounded-lg shadow-sm">
                                    <h2 className="text-lg font-semibold ">General Session Timings</h2>
                                    <div className="flex flex-row flex-wrap text-sm mt-2 text-gray-800">
                                        {sessionSlots && sessionSlots.map((slot, index) => (
                                            <div key={index} className="cursor-pointer border border-gray-400 px-2 py-1 rounded-md m-1 hover:bg-gray-50  transition ease-in-out">
                                                {slot}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Edit Details Link */}
                            <div className="flex justify-end pr-4 sm:pr-6 md:pr-8 pb-3 mt-3 sm:pb-4 md:mt-6">
                                <u>
                                    <p className="cursor-pointer text-blue-400 text-sm sm:text-base">Edit Details</p>
                                </u>
                            </div>

                        </div>
                    </div>

                    {/* Show LicenseComponent on all except md (tablet) */}
                    <div className="block md:hidden lg:block">
                        <LicenseComponent price = {teacher.price}/>
                    </div>

                    {/* Show TabletLicenseComponent only on md (tablet) screens */}
                    <div className="hidden md:block lg:hidden">
                        <TabletLicenseComponent price = {teacher.price} />
                    </div>
                </div>
            </TeacherProvider>

        </>
    )
}