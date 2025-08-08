// To do : 
// 1) Aquire lock using lua Script and send a fencing token 
// 2) Push the job to the queue 
// 3) Process the payment 
// 4) Send the notification 

import { NextRequest, NextResponse } from "next/server";
import  redis  from '@tutorr/common'
import { BookingQueue } from '@tutorr/common'


export async function POST(req: NextRequest) {
    //create a lock using the redis lua script 
    const { studentId, teacherId, slotId, price , date } = await req.json();
    console.log("Code is coming in the backend ");
    if (!studentId || !teacherId || !slotId || !price || !date) {
        console.log("Incomplete details in the booking section");
        return NextResponse.json({ message: "Incomplete details" }, { status: 403 });
    }


    //add the locking mechanism to the queue itself 
    const request_id = `req_${Date.now()}`;

    try {
        //create a job 
        const bookingQueue = new BookingQueue(redis);
        const job = await bookingQueue.addJob('booking', {
            studentId,
            teacherId,
            slotId,
            request_id,
            price,
            date,
            jobType: "attempt-booking"
        })

        return NextResponse.json(
            {
                message: "Booking request received. Processing...",
                request_id, 
                jobId : job.id
            },
            { status: 202 } 
        );

    } catch (error) {
        console.log("Something went wrong while booking the slot", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}