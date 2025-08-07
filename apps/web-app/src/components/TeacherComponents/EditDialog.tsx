"use client"
import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { useContext, useState, useEffect } from "react";
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
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useGetTeacherAvailability } from "@/hooks/teacherProfileHooks";
import { useUpdateTeacherAvailability } from "@/hooks/teacherProfileHooks";
import { Loader } from "lucide-react";
import { convertSessionSlotsToUTC } from "../../utils/utilityFunctions";


export default function EditDialog() {
    //contexts
    const context = useContext(TeacherContext);

    //states
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isYes, setIsYes] = useState<boolean>(true);
    const [sessionSlots, setSessionSlots] = useState<string[]>([]);
    const [deletedSessionSlots, setDeletedSessionSlots] = useState<string[]>([]);

    //colaescing variables
    const userId = context?.id ?? '';
    const dateToSend = date?.toISOString().split("T")[0] ?? '';
    const dayOfWeek = date?.toString().slice(0, 3).toUpperCase();
    console.log("the date to send is", dateToSend);
    //api
    const { data: availability, isLoading, isError, refetch } = useGetTeacherAvailability(userId, dateToSend);
    const { mutate, isPending, isError: submitError } = useUpdateTeacherAvailability();

    console.log("The data is ", availability);
    //useEffect
    useEffect(() => {
        if (availability?.data?.SlotDetails && availability?.data?.isAvailable != null) {
            const slots = availability.data.SlotDetails
                .map((slot: { slotTime: string | null }) => {
                    if (!slot.slotTime) return null;

                    const dt = DateTime.fromISO(slot.slotTime, { zone: 'utc' }).toLocal();
                    return dt.toFormat("h:mm a");
                })
                .filter((slotTime: string | null): slotTime is string => slotTime !== null); // ✅ Explicit typing

            setIsYes(availability.data.isAvailable);
            setSessionSlots(slots);
        }
    }, [availability]);






    useEffect(() => {
        if (!context || !date) return;

        // Only set sessionSlots from context if API data is NOT available
        if (!availability?.data?.SlotDetails && context.sessionSlots) {
            setSessionSlots(context.sessionSlots);
        }

        // Only set isYes from context if API data is NOT available
        if (!availability?.data?.isAvailable && availability?.data?.isAvailable !== false) {
            // Explanation:
            // availability?.data?.isAvailable could be false, so explicitly check if it is undefined or null
            const filteredDate = date.toString().slice(0, 3).toUpperCase();
            const isAvailable = context.availableDays?.includes(filteredDate) ?? false;
            setIsYes(isAvailable);
        }
    }, [context, date, availability]);


    //utitility functions 
    const toggle = () => {
        setIsYes((prev) => !prev);
    };

    const filterTimeSlots = (index: number) => {
        const deletedArr = sessionSlots.filter((_, id) => id === index);
        setDeletedSessionSlots(deletedArr);
        const newArr = sessionSlots.filter((_, id) => id !== index);
        setSessionSlots(newArr);
    };

    //submit logic 
    const handleSave = async () => {

        if (!userId || !date || !deletedSessionSlots || !sessionSlots || !dayOfWeek || isYes === undefined) {
            return null;
        }

        const sessionSlotsUTC = convertSessionSlotsToUTC(sessionSlots, dateToSend);
        const deletedSessionSlotsUTC = convertSessionSlotsToUTC(deletedSessionSlots, dateToSend);

        const dataToSend = {
            userId,
            date: dateToSend,
            deletedSessionSlots: deletedSessionSlotsUTC,
            sessionSlots: sessionSlotsUTC,
            dayOfWeek,
            isAvailable: isYes
        };
        console.log("the data to send is ", dataToSend);

        mutate(dataToSend);

    }



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
                            <div className="flex flex-col flex-wrap items-center lg:items-start gap-2 @md:flex-row">
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
                            {isLoading ? (
                                // Render loader if isLoading is true
                                <div className="flex justify-center items-center h-40">
                                    <Loader />
                                </div>
                            ) : (
                                // Else render the rest of your component
                                <>
                                    <h2 className="text-lg mx-auto font-medium text-gray-600">Availability Status</h2>
                                    <div className="flex gap-2 mt-2">
                                        <Switch checked={isYes} onCheckedChange={toggle} />
                                        <Label>{isYes ? "Yes" : "No"}</Label>
                                    </div>

                                    {/* Disable below if isYes is false */}
                                    <div className={`relative mt-2 ${!isYes || isPending ? 'pointer-events-none opacity-50' : ''}`}>
                                        <h2 className="text-lg mx-auto font-medium text-gray-600 mt-2">Available Timings</h2>
                                        {/* Booking Slots render section */}
                                        <div className="flex flex-row flex-wrap max-w-full gap-1 mt-2">
                                            {sessionSlots.map((slot, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-1 px-2 py-1 items-center border hover:bg-black/5 border-gray-300 rounded-xl text-gray-700"
                                                >
                                                    <div className="text-[12px]">{slot}</div>
                                                    <span
                                                        className="text-[10px] font-extralight text-gray-400 hover:text-red-500 cursor-pointer"
                                                        onClick={() => filterTimeSlots(index)}
                                                    >
                                                        X
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <h2 className="text-lg font-medium text-gray-600 mt-5">Available Days</h2>
                                        {/* Day Section */}
                                        <div className="flex flex-row flex-wrap max-w-full gap-1 mt-2">
                                            {context?.availableDays.map((day, index) => (
                                                <div
                                                    key={index}
                                                    className="border border-gray-300 text-sm px-2 py-1 hover:bg-blue-500/10 font-medium cursor-pointer text-blue-500 rounded-sm"
                                                >
                                                    {day}
                                                </div>
                                            ))}
                                        </div>


                                    </div>
                                    {/* Save Button */}
                                    <Button
                                        className={`${isPending ? "bg-gray-400 text-white" : ""} mt-4 w-full cursor-pointer`}
                                        onClick={handleSave}
                                        disabled={isPending}
                                    >
                                        {isPending ? "Saving" : "Save"}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}