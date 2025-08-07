"use client"

import { useState, useEffect, useMemo } from "react";
import { useRazorpay } from "react-razorpay";
import axios from 'axios';
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
import { useGetTeacherAvailabilityForBooking } from "@/hooks/bookingHooks";
import { Loader } from "lucide-react";
import { formatTime } from "../../utils/utilityFunctions";
import { io } from 'socket.io-client';
import { toast } from "sonner";


type SlotType = {
    slot: {
        id: string;
        slotTime: string;
    } | null;
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

    console.log("the job id is ", jobId);
    //use memo hook to initialise the socket only once
    const socket = useMemo(() => {
        const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`)

        newSocket.on("connect", () => {
            console.log("Connected to the socket server")
        })

        newSocket.on("disconnect", () => {
            console.log("❌ Disconnected from socket server");
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
            console.log(` Cleaning up listener for: ${eventName}`);
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

    console.log("The selected slot is ", selectedSlot.slot?.id);

    if (!date || !id) {
        return null;
    }
    //converting date to isoString 
    const stringDate = date.toISOString();

    const { data, isLoading, isError } = useGetTeacherAvailabilityForBooking(id, stringDate);
    console.log("the data is ", data);

    const handleBook = () => {
        alert("Are you sure you want to book this slot ? ");
        console.log("Log 1 ");
        const studentId = localStorage.getItem("studentId");
        const slotId = selectedSlot.slot?.id
        if (!id || !studentId || !slotId || !price) {
            return null;
        }
        console.log("Log 2");
        const dataToSend = {
            studentId,
            teacherId: id,
            slotId,
            price
        }

        console.log("Log 3");
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

        //poll the backend if the payment is done or not 
        console.log("The session id is", sessionId);



    }

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
                                    Loading please wait bero
                                </div>
                            )}
                            <div className="flex flex-row flex-wrap max-w-full gap-2 mt-2">
                                {!isLoading && data?.length === 0 && (
                                    <div>
                                        <h2 className="text-sm text-gray-500 italic">Teacher is not available on this day</h2>
                                    </div>
                                )}

                                {!isLoading && data?.length > 0 &&
                                    data.map((slot: { id: string; slotTime: string }, index: number) => (
                                        <div
                                            key={slot.id}
                                            className={`inline-flex items-center rounded-md border cursor-pointer px-2.5 py-0.5 text-sm font-medium text-gray-800 shadow-sm transition-colors ${selectedSlot.index === index
                                                ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-500"
                                                : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border hover:border-gray-500"
                                                }`}
                                            onClick={() => setSelectedSlot({ slot, index })}
                                        >
                                            {formatTime(slot.slotTime)}
                                        </div>
                                    ))
                                }

                            </div>

                            <Button className="absolute bottom-2 left-0 w-full cursor-pointer" onClick={handleBook}> Book Now </Button>

                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}