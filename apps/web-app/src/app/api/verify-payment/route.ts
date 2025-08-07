
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto'
import { BookingQueue } from "@tutorr/common";
import redis from "@tutorr/common";
import prisma from "@tutorr/db";

//verify-payment handler 
export async function POST(req: NextRequest) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = await req.json();
    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    const key_secret = process.env.RAZORPAY_SECRET_KEY!;

    const generated_signature = crypto
        .createHmac('sha256', key_secret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

    if (generated_signature === razorpay_signature) {

        //get booking context 
        const bookingContext = await redis.get(`booking:${razorpay_order_id}`);
        if (!bookingContext) {
            console.log("Booking context not found");
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        const { studentId, teacherId, slotId, fencingToken } = JSON.parse(bookingContext);
        if (!studentId || !teacherId || !slotId || !fencingToken) {
            console.log("Incomplete details found !!!");
            return NextResponse.json({ error: "Please send all the inputs" }, { status: 500 });
        }
        let session;
        console.log("The details are ", studentId, teacherId, slotId, fencingToken);

        try {
            //to check if slot Id is template slot id or slot details slot id
            const templateSlot = await prisma.templateSlots.findFirst({
                where: {
                    id: slotId
                }
            });

            if (templateSlot) {
                console.log("Coming here part 1");
                session = await prisma.session.create({
                    data: {
                        teacherId,
                        studentId,
                        templateSlotId: slotId,
                        booking_status: "PENDING_SUCCESS"
                    }
                })
            } else {
                console.log("Coming here part 2");
                session = await prisma.session.create({
                    data: {
                        teacherId,
                        studentId,
                        slotId,
                        booking_status: "PENDING_SUCCESS"
                    }
                })
            }
        } catch (error) {
            console.log("Something went wrong while creating session :", error);
            return NextResponse.json({
                message: "Something went wrong while creating session"
            }, { status: 500 });
        }
        // try {
        //     session = await prisma.session.create({
        //         data : {
        //             teacherId , 
        //             studentId , 
        //             slotId , 
        //             booking_status : "PENDING_SUCCESS"
        //         }
        //     })
        //     console.log("Payment status updated" , session);
        // } catch (error) {
        //     console.log("Failed to update the db status after payment verification " , error);
        //     return NextResponse.json({error : "Something went wrong while inserting session "} , {status : 500}); 
        // }
        //add the booking creating job here 
        const bookingQueue = new BookingQueue(redis);
        console.log("The fencing token in the verify is" , fencingToken);
        await bookingQueue.addJob('booking', {
            studentId,
            teacherId,
            slotId,
            fencingToken,
            amount,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            jobType: "create-booking"

        });

        if (!session) {
            console.log("Session not created");
            return;
        }

        return NextResponse.json({ status: "Success", message: "Payment Verfied Successfully", sessionId: session.id }, { status: 200 });
    } else {
        return NextResponse.json({ status: "Failed", message: "Payment failed" }, { status: 400 });
    }

} 