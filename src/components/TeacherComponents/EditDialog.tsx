"use client"
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { TeacherContext } from "@/context/TeacherContext";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { isBefore } from "date-fns";

export default function EditDialog() {
    //contexts
    const context = useContext(TeacherContext);

    //states
    const [date, setDate] = useState<Date | undefined>(new Date())

    console.log("The data is", context);
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-3 ">
                        Edit Price and Availability
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-screen">
                    <DialogTitle>Edit Teacher Availability</DialogTitle>

                    <div className="max-w-4xl flex md:flex-row flex-col items-center gap-10">
                        {/* Calendar Section  */}
                        <div className="md:w-1/2">
                            <div className="flex flex-col flex-wrap items-start gap-2 @md:flex-row">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md border shadow-sm"
                                    disabled={(date) => isBefore(date, new Date())}
                                />
                            </div>

                            <div className="flex gap-4 justify-center items-center mt-2 whitespace-nowrap">
                                <p className="text-md text-gray-700">Session Duration : </p>
                                <Input
                                    value={context?.sessionDuration}
                                    disabled
                                    className="border border-gray-400 hover:!cursor-not-allowed disabled:bg-gray-100"
                                />

                            </div>

                        </div>

                        <div className="md:w-1/2">
                            <h2 className="text-lg mx-auto font-medium text-gray-600">Available Timings</h2>
                            {/* Availble Slots */}
                            <div className="flex flex-row flex-wrap max-w-full gap-1 mt-2">
                                {context?.sessionSlots.map((slot, index) => (
                                    <div key={index}
                                        className="border text-[12px] cursor-pointer hover:bg-black/5 border-gray-300 text-gray-700 px-2 py-1 rounded-xl">
                                        {slot}
                                    </div>
                                ))}
                            </div>

                            {/* Available Days */}
                            <h2 className="text-lg font-medium text-gray-600 mt-5">Availble Days</h2>
                            <div className="flex flex-row flex-wrap max-w-full gap-1 mt-2">
                                {context?.availableDays.map((day, index) => (
                                    <div key={index}
                                        className="border border-gray-300 text-sm px-2 py-1 hover:bg-blue-500/10 font-medium cursor-pointer text-blue-500 rounded-sm">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <Button className="mt-4 w-full"> Save </Button>
                        </div>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}