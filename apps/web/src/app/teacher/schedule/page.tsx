"use client";
import { useState, useEffect } from "react";
import ScheduleSection from "@/components/TeacherComponents/ScheduleSection";
import Override from "@/components/TeacherComponents/Override";
import { TimezoneProvider } from "@/context/ScheduleContext";
import { useGetScheduleAndOverrides } from "@/hooks/overrideHooks";

export default function Home() {
    const [teacherId, setTeacherId] = useState("");

    useEffect(() => {
        const id = localStorage.getItem("teacherId");
        if (!id) return;
        setTeacherId(id);
    }, []);

    const { data, isLoading, isError , refetch } = useGetScheduleAndOverrides(teacherId);

    console.log("The schedule data coming from the backend is ", data);

    return (
        <>
            {/* to use timezone in the override component  */}
            <TimezoneProvider>
                <div className="min-h-screen flex flex-col items-center p-10">
                    <div className="w-full max-w-4xl">
                        <h2 className="font-bold text-3xl mb-6">
                            Schedule Management
                        </h2>
                        {isLoading && <p>Loading schedule...</p>}
                        {isError && <p>Error loading schedule.</p>}

                        {data && (
                            <ScheduleSection
                                schedule={data.schedule}
                                templates={data.templates}
                            />
                        )}
                    </div>

                    <div className="border-t w-full max-w-4xl mt-10"></div>

                    {/* Override section */}
                    <div className="w-full max-w-4xl">
                        {isLoading && <p>Loading Override</p>}
                        { data && (
                            <Override
                                overrides = {data.overrides}
                                refetch = {refetch}
                            />
                        )}
                    </div>

                </div>
            </TimezoneProvider>
        </>
    )
}
