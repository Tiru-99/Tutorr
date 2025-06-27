"use client"
import { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog";
import { convertUtcToReadableTime } from "@/utils/utilityFunctions";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { isBefore } from "date-fns";
import { useGetTeacherAvailabilityForBooking } from "@/hooks/bookingHooks";
import { Loader } from "lucide-react";

interface SlotType {
    slot: string;
    index: number | null;
}

export default function BookDialog({ id }: { id: string }) {
    //states 
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedSlot, setSelectedSlot] = useState<SlotType>({
        slot: "",
        index: null
    });

    if (!date || !id) {
        return null;
    }
    //converting date to isoString 
    const stringDate = date.toISOString();

    const { data, isLoading, isError } = useGetTeacherAvailabilityForBooking(id, stringDate);
    console.log("the data is ", data);
    const stringData = data ? convertUtcToReadableTime(data) : [];
    console.log("The data is ", data);

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-blue-700 text-white scale-110 cursor-pointer">Book Now</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Teacher Availability</DialogTitle>
                    <div className="flex gap-10 max-w-4xl justify-center ">
                        <div className="w-1/2">
                            <div className="flex flex-col flex-wrap items-center lg:items-start gap-2 @md:flex-row">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md border shadow-sm"
                                    disabled={(date) => isBefore(date, new Date())}
                                />
                            </div>
                        </div>

                        <div className="w-1/2 relative">
                            <h1 className="text-gray-700 font-semibold text-xl">Available Slots</h1>
                            {isLoading && (
                                <div className="flex justify-center items-center min-h-[100px]">
                                    <Loader className="animate-spin h-5 w-5"></Loader>
                                </div>
                            )}
                            <div className="flex flex-row flex-wrap max-w-full gap-2 mt-2">
                                {!isLoading && data?.length === 0 && (
                                    <div>
                                        <h2 className="text-sm text-gray-500 italic">Teacher is not available on this day</h2>
                                    </div>
                                )}

                                {!isLoading && data?.length > 0 &&
                                    stringData && stringData.map((slot: string, index: number) => (
                                        <div
                                            key={index}
                                            className={`inline-flex items-center rounded-md border  cursor-pointer px-2.5 py-0.5 text-sm font-medium text-gray-800 shadow-sm 4 ${selectedSlot.index === index ? "bg-blue-500 border-blue-500 text-white  hover:bg-blue-500" : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border hover:border-gray-500"} transition-colors `}
                                            onClick={() => setSelectedSlot({ slot, index })}
                                        >
                                            {slot}
                                        </div>
                                    ))}
                            </div>

                            <Button className="absolute bottom-2 left-0 w-full cursor-pointer"> Book Now </Button>

                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}