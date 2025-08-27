"use client"

import { useState, useEffect, useMemo } from "react";
import { useRazorpay } from "react-razorpay";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog";
import { convertUtcToReadableTime } from "../../utils/utilityFunctions";
import { verifyAndCheckout } from "../../lib/Razorpay/verifyAndCheckout";
import { useBookTeacherSlot } from "@/hooks/bookingHooks";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { isBefore } from "date-fns";
import { useGetSlotsByDate } from "@/hooks/overrideHooks";
import { DateTime } from "luxon";
import { toast } from "sonner";
import { io } from 'socket.io-client';


type SlotType = {
    slot: { startTime: string; endTime: string } | null;
    index: number | null;
};


interface OrderType {
    key: string;
    id: string;
    amount: number;
    currency: string;
}


export default function BookDialog({ id, price }: { id: string, price: number }) {
    //states 
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [jobId, setJobId] = useState();
    const [order, setOrder] = useState<OrderType>();
    const { mutate, isPending, isError: bookingError } = useBookTeacherSlot();
    const [selectedSlot, setSelectedSlot] = useState<SlotType>({
        slot: null,
        index: null
    });
      const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [errMessage, setErrMessage] = useState<string>();
    const [sessionId, setSessionId] = useState<string>();
    const { Razorpay } = useRazorpay();


    useEffect(() => {
        if (order) {
            const studentName = localStorage.getItem("name");
            const studentEmail = localStorage.getItem("email");


            if (!studentName || !studentEmail) return;

            const initiatePayment = async () => {
                const id = await verifyAndCheckout(order, studentEmail, studentName, Razorpay);
                setSessionId(id);
            };

            initiatePayment();
        }
    }, [order]);


    //use memo hook to initialise the socket only once
    const socket = useMemo(() => {
        const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`)

        newSocket.on("connect", () => {
            console.log("Connected to the socket server")
        })

        newSocket.on("disconnect", () => {
            console.log(" Disconnected from socket server");
        });

        newSocket.on("hello", (data: any) => {
            console.log("Message received ", data.message);
        })

        return newSocket
    }, [])

    useEffect(() => {
        if (!jobId || !socket) return;

        const eventName = `bookingUpdate/${jobId}`;
        console.log(`🎯 Setting up listener for: ${eventName}`);

        const handleBookingUpdate = (data: any) => {
            console.log(`📨 Received ${eventName}:`, data);
            toast(data.message);

            if (data && data.order) {
                console.log("✅ Order data received:", data);
                setOrder(data.order);
            }
        };

        socket.on(eventName, handleBookingUpdate);

        // Cleanup function
        return () => {
            // console.log(` Cleaning up listener for: ${eventName}`);
            socket.off(eventName, handleBookingUpdate);
        };
    }, [jobId, socket]);

    //useEffect for listening booking creation events 
    useEffect(() => {
        if (!order) return;
        const id = order.id
        const eventName = `bookingUpdate/${order.id}`;

        const handleBookingUpdate = (data: any) => {
            console.log(`Got the event for ${eventName}`, data);
            toast(data.message)
        }

        socket.on(eventName, handleBookingUpdate);

        return () => {
            console.log("Cleaning up for event" + eventName);
            socket.off(eventName, handleBookingUpdate);
        }

    }, [order, socket])


    //getting slots per day feat : 
    if (!date) {
        return null;
    }
    const convertedDate = new Date(date);
    //fetch user's timezone 
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const weekDay = convertedDate
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase(); // gives "MON", "TUE", etc.
    //converting date into start and end ranges 
    const { start: dateStart, end: dateEnd } = getDateRange(date);

    const paramsToSend = {
        dateStart,
        dateEnd,
        timezone,
        teacherId: id,
        weekDay
    }

    const { data, isLoading, isError } = useGetSlotsByDate(paramsToSend);
    const newDate = new Date(date);
    console.log("The data coming from the backend is ", data);

    newDate.setUTCHours(0, 0, 0, 0);

    const handleBook = () => {
        alert("Are you sure you want to book this slot ? ");

        const studentId = localStorage.getItem("studentId");
        if (!id || !studentId || !selectedSlot.slot || !price) {
            return null;
        }
        console.log("The studentId to send in the backend is bruh ", studentId);

        const dataToSend = {
            studentId,
            teacherId: id,
            startTime: selectedSlot.slot?.startTime,
            endTime: selectedSlot.slot?.endTime,
            price,
            date: newDate.toISOString()
        }


        let detailsJobId;
        mutate(dataToSend, {
            onSuccess: (details) => {
                console.log("the job id is ", details);
                detailsJobId = details.jobId;
                setJobId(details.jobId);
            },
            onError: (err: any) => {
                console.log("Something went wrong while verifying payments", err);
                setErrMessage(err);
            }
        })

    }

    return (
        <>
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);

                    if (!open) {
                        // dialog closed → reset selectedSlot
                        setSelectedSlot({ slot: null, index: null });
                    }
                }}
            >
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
                                    Loading please wait bero
                                </div>
                            )}
                            <div className="flex flex-row flex-wrap max-w-full gap-2 mt-2">
                                {!isLoading && data?.slots?.length === 0 && (
                                    <div>
                                        <h2 className="text-sm text-gray-500 italic">
                                            {data?.message || "Teacher is not available on this day"}
                                        </h2>
                                    </div>
                                )}

                                {!isLoading && data?.slots?.length > 0 &&
                                    data.slots.map((slot: { startTime: string; endTime: string }, index: number) => {
                                        const localStart = DateTime.fromISO(slot.startTime, { zone: "utc" })
                                            .toLocal()
                                            .toFormat("hh:mm a");
                                        const localEnd = DateTime.fromISO(slot.endTime, { zone: "utc" })
                                            .toLocal()
                                            .toFormat("hh:mm a");

                                        return (
                                            <div
                                                key={slot.startTime}
                                                className={`inline-flex items-center rounded-md border cursor-pointer px-2.5 py-0.5 text-sm font-medium text-gray-800 shadow-sm transition-colors ${selectedSlot.index === index
                                                    ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-500"
                                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border hover:border-gray-500"
                                                    }`}
                                                onClick={() => {
                                                    if (selectedSlot.index === index) {
                                                        setSelectedSlot({ slot: null, index: null }); // unselect
                                                    } else {
                                                        setSelectedSlot({ slot, index });
                                                    }
                                                }}
                                            >
                                                {localStart} - {localEnd}
                                            </div>
                                        );
                                    })}
                            </div>


                            <Button className="absolute bottom-2 left-0 w-full cursor-pointer" onClick={handleBook}> Book Now </Button>

                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

function getDateRange(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");

    const start = `${year}-${month}-${day}T00:00:00`;
    const end = `${year}-${month}-${day}T23:59:00`;

    return { start, end };
}
