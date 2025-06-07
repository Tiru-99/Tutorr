import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

//route to save specific changes to the availability w.r.t each day
export async function POST(req: NextRequest) {
    const { userId, date, deletedSessionSlots, sessionSlots, dayOfWeek, isAvailable } = await req.json();

    if (!userId || !date || isAvailable == undefined) {
        console.log("Incomplete details");
        return NextResponse.json({ error: "Incomplete details sent !" }, { status: 403 });
    }

    console.log("the is available receiving is" , isAvailable); 

    try {
        const existingTeacher = await prisma.teacher.findFirst({
            where: {
                user: {
                    id: userId
                }
            }
        });

        if (!existingTeacher) {
            console.log("Teacher does not exists!");
            return NextResponse.json({ error: "Teacher does not exists" }, { status: 405 });
        }

        const teacherId = existingTeacher.id;

        //if exists update , if doesn't exist , create --- as simple as that!!
        const availability = await prisma.teacherAvailability.upsert({
            where: {
                teacherId_date: {
                    teacherId,
                    date: date,
                },
            },
            update: {
                isAvailable,
                dayOfWeek,
            },
            create: {
                teacherId,
                date: date,
                isAvailable,
                dayOfWeek,
            }
        });

        console.log("The availability is", availability);
        //if is Avaialbility is false , no need of saving rest of the deails
        if (isAvailable === false) {
            console.log("Is Available false", isAvailable);
            return NextResponse.json({ message: "Successfully saved the changes" }, { status: 200 });
        }

        const teacherAvailabilityId = availability.id;

        if (!sessionSlots || !deletedSessionSlots) {
            console.log("Session slots of deleted ones not found");
            return NextResponse.json({ error: "Missing session slots" }, { status: 403 });
        }

        //update the teacherAvailability id in the slotDetails 
        const message = await prisma.slotDetails.updateMany({
            where: {
                teacherId: existingTeacher.id
            },
            data: {
                teacherAvailabilityId
            }
        })
        console.log("the message is ", message);
        //check if any deleted slots are already booked 
        //to get all the slots which are booked and are in deletedSessionSlots
        const bookedSlots = await prisma.slotDetails.findMany({
            where: {
                teacherAvailabilityId,
                slotTime: {
                    in: deletedSessionSlots,
                },
                sessionId: {
                    // Only consider slots that are actually booked
                    not: null,
                },
            },
        });

        if (bookedSlots.length > 0) {
            return NextResponse.json({
                error: "Some slots are already booked and cannot be deleted.",
                bookedSlots,
            }, { status: 409 });
        }

        //delete slots || update slots
        console.log("The deletedSession slots : ", deletedSessionSlots);
        console.log("the teacher avail id is", teacherAvailabilityId);

        const debug = await prisma.slotDetails.findMany({
            where: {
                teacherAvailabilityId
            },
        });
        console.log("Matching slots before filter:", debug);

        const deleted = await prisma.slotDetails.updateMany({
            where: {
                teacherAvailabilityId,
                slotTime: {
                    in: deletedSessionSlots
                },
                sessionId: undefined, // no session assigned
            },
            data: {
                status: "UNAVAILABLE", //set to unavailable
            }
        });

        console.log("the deleted slots are ", deleted)


        return NextResponse.json({ message: "Data saved successfully !" }, { status: 200 })
    } catch (error) {
        console.log("Something went wrong while updating availability", error);
        return NextResponse.json({ error: "Something went wrong while updating availabilty" }, { status: 500 });
    }

}


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const date = searchParams.get("date");
    const userId = searchParams.get("userId");

    if (!date || !userId) {
        console.log("incomplete data received", date, userId);
        return NextResponse.json({ error: "Incomplete data received" }, { status: 409 });
    }
    try {

        const availability = await prisma.teacherAvailability.findFirst({
            where: {
                teacher: {
                    user: {
                        id: userId,
                    },
                },
                date: date,
            },
            include: {
                SlotDetails: {
                    where: {
                        status: "AVAILABLE",
                    },
                    select :{
                        slotTime : true
                    }
                },
            },
        });


        if (!availability) {
            console.log("Null availability!");
            return NextResponse.json({}, { status: 200 });
        }

        return NextResponse.json({ data: availability }, { status: 200 });
    } catch (error) {
        console.log("Something went wrong while fetching availabilty", error);
        return NextResponse.json({ message: "Something went wrong while fetching availability" }, { status: 500 });
    }


}