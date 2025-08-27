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
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const { Razorpay } = useRazorpay();

    // Payment initiation effect
    useEffect(() => {
        if (order) {
            const studentName = localStorage.getItem("name");
            const studentEmail = localStorage.getItem("email");

            if (!studentName || !studentEmail) {
                toast.error("Student information not found. Please login again.");
                return;
            }

            const initiatePayment = async () => {
                try {
                    setIsPaymentLoading(true);
                    toast.loading("Initializing payment...", { id: "payment-init" });
                    
                    const id = await verifyAndCheckout(order, studentEmail, studentName, Razorpay);
                    setSessionId(id);
                    
                    toast.dismiss("payment-init");
                    toast.success("Payment gateway opened successfully!");
                    toast.loading("Processing your booking...", { id: "booking-process" });
                    
                } catch (error) {
                    toast.dismiss("payment-init");
                    toast.error("Failed to initialize payment. Please try again.");
                    console.error("Payment initialization error:", error);
                } finally {
                    setIsPaymentLoading(false);
                }
            };

            initiatePayment();
        }
    }, [order, Razorpay]);

    // Socket initialization
    const socket = useMemo(() => {
        const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`)

        newSocket.on("connect", () => {
            console.log("Connected to the socket server")
            toast.success("Connected to booking service", { duration: 2000 });
        })

        newSocket.on("disconnect", () => {
            console.log("Disconnected from socket server");
            toast.error("Disconnected from booking service", { duration: 2000 });
        });

        newSocket.on("hello", (data: any) => {
            console.log("Message received ", data.message);
        })

        return newSocket
    }, [])

    // COMBINED socket effect - handles both jobId and order events
    useEffect(() => {
        if (!socket) return;

        const eventHandlers: any = [];

        // Handle jobId events (booking attempt)
        if (jobId) {
            const jobEventName = `bookingUpdate/${jobId}`;
            console.log(`🎯 Setting up listener for: ${jobEventName}`);

            const handleJobUpdate = (data: any) => {
                console.log(`📨 Received ${jobEventName}:`, data);
                
                if (data.message) {
                    if (data.error) {
                        toast.error(data.message);
                    } else {
                        toast.info(data.message);
                    }
                }

                if (data && data.order) {
                    console.log("✅ Order data received:", data);
                    setOrder(data.order);
                    toast.success("Booking slot reserved! Proceeding to payment...");
                }
            };

            socket.on(jobEventName, handleJobUpdate);
            eventHandlers.push({ eventName: jobEventName, handler: handleJobUpdate });
        }

        // Handle order events (booking creation)
        if (order) {
            const orderEventName = `bookingUpdate/${order.id}`;
            console.log(`🎯 Setting up listener for: ${orderEventName}`);

            const handleOrderUpdate = (data: any) => {
                console.log(`📨 Received ${orderEventName}:`, data);
                
                // Dismiss booking process loader when we get any order update
                toast.dismiss("booking-process");
                
                if (data.message && !data.error) {
                    toast.success("🎉 Booking completed successfully! Details sent to your email.", { duration: 8000 });
                }
                
                if (data.error || (data.message && data.error)) {
                    toast.error(data.message || "Something went wrong with your booking");
                }

                if (data.bookingId) {
                    toast.success(`📋 Booking ID: ${data.bookingId}`, { duration: 5000 });
                }
            };

            socket.on(orderEventName, handleOrderUpdate);
            eventHandlers.push({ eventName: orderEventName, handler: handleOrderUpdate });
        }

        // Cleanup function
        return () => {
            eventHandlers.forEach(({ eventName, handler }: any) => {
                console.log(`🧹 Cleaning up listener for: ${eventName}`);
                socket.off(eventName, handler);
            });
        };
    }, [jobId, order, socket]);

    // Getting slots per day
    if (!date) {
        return null;
    }
    const convertedDate = new Date(date);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const weekDay = convertedDate
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();

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
        if (!selectedSlot.slot) {
            toast.error("Please select a time slot first!");
            return;
        }

        const studentId = localStorage.getItem("studentId");
        if (!id || !studentId || !selectedSlot.slot || !price) {
            toast.error("Missing required information. Please try again.");
            return;
        }

        toast.loading("Processing your booking request...", { id: "booking-request" });

        console.log("The studentId to send in the backend is bruh ", studentId);

        const dataToSend = {
            studentId,
            teacherId: id,
            startTime: selectedSlot.slot?.startTime,
            endTime: selectedSlot.slot?.endTime,
            price,
            date: newDate.toISOString()
        }

        mutate(dataToSend, {
            onSuccess: (details) => {
                console.log("the job id is ", details);
                setJobId(details.jobId);
                toast.dismiss("booking-request");
                toast.success("Booking request submitted successfully!");
            },
            onError: (err: any) => {
                console.log("Something went wrong while verifying payments", err);
                setErrMessage(err);
                toast.dismiss("booking-request");
                toast.error("Failed to submit booking request. Please try again.");
            }
        })
    }

    // Handle date change
    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);
        setSelectedSlot({ slot: null, index: null });
        if (newDate) {
            toast.info(`Loading slots for ${newDate.toLocaleDateString()}`);
        }
    };

    return (
        <>
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);

                    if (!open) {
                        // dialog closed → reset selectedSlot
                        setSelectedSlot({ slot: null, index: null });
                        setIsPaymentLoading(false);
                        toast.dismiss(); // Dismiss any active toasts when closing
                    } else {
                        toast.success("Welcome! Select a date and time slot to book.");
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
                                    onSelect={handleDateChange}
                                    className="rounded-md border shadow-sm"
                                    disabled={(date) => isBefore(date, new Date())}
                                />
                            </div>
                        </div>

                        <div className="w-1/2 relative">
                            <h1 className="text-gray-700 font-semibold text-xl">Available Slots</h1>
                            
                            {isLoading && (
                                <div className="flex flex-col justify-center items-center min-h-[100px] gap-3">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    <p className="text-gray-600 text-sm">Loading available slots...</p>
                                </div>
                            )}

                            {isError && (
                                <div className="flex justify-center items-center min-h-[100px]">
                                    <div className="text-red-500 text-center">
                                        <p className="font-medium">Failed to load slots</p>
                                        <p className="text-sm">Please refresh and try again</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-row flex-wrap max-w-full gap-2 mt-2">
                                {!isLoading && !isError && data?.slots?.length === 0 && (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 text-4xl mb-2">📅</div>
                                        <h2 className="text-sm text-gray-500 italic">
                                            {data?.message || "Teacher is not available on this day"}
                                        </h2>
                                        <p className="text-xs text-gray-400 mt-1">Try selecting another date</p>
                                    </div>
                                )}

                                {!isLoading && !isError && data?.slots?.length > 0 &&
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
                                                        setSelectedSlot({ slot: null, index: null });
                                                        toast.info("Slot deselected");
                                                    } else {
                                                        setSelectedSlot({ slot, index });
                                                        toast.success(`Selected slot: ${localStart} - ${localEnd}`);
                                                    }
                                                }}
                                            >
                                                {localStart} - {localEnd}
                                            </div>
                                        );
                                    })}
                            </div>

                            <Button 
                                className="absolute bottom-2 left-0 w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                                onClick={handleBook}
                                disabled={isPending || isPaymentLoading || !selectedSlot.slot}
                            > 
                                {isPending || isPaymentLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        {isPending ? "Processing..." : "Loading Payment..."}
                                    </div>
                                ) : (
                                    "Book Now"
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

function getDateRange(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const start = `${year}-${month}-${day}T00:00:00`;
    const end = `${year}-${month}-${day}T23:59:00`;

    return { start, end };
}