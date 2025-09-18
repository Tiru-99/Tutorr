import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";


//route to update overrides 
export async function POST(req: NextRequest) {
    //first things first I need to convert the incoming startTimes and endTimes 
    //utc 
    const { times, date, availability, timezone } = await req.json();

    const teacherId = req.headers.get("x-teacher-id");


    console.log("times is", times, availability);

    if (!teacherId) {
        console.log("Jyada hushar mat ban mc");
        return NextResponse.json({
            error: "Only valid teachers can perform this action"
        }, { status: 403 })
    }

    if (!times || !date || availability === null || !timezone) {
        console.log("Incomplete data from the frontend");
        return NextResponse.json({
            error: "Incomplete data sent!!"
        });
    }

    try {

        //find the schedule for the teacher bruh 
        const schedule = await prisma.schedule.findFirst({
            where: {
                teacherId
            }
        });

        if (!schedule) {
            console.log("No schedule for the teacher found!");
            return NextResponse.json({
                error: "Please make a schedule before inserting overrides"
            }, { status: 403 });
        }

        const scheduleId = schedule.id;
        // Prepare data for bulk insert
        const availabilityData = times.map((t: any) => ({
            teacherId,
            date,
            startTime: t.startUTC,
            endTime: t.endUTC,
            availability,
            scheduleId
        }));

        // Insert multiple rows
        const data = await prisma.availability.createMany({
            data: availabilityData
        });

        console.log("Availability successfull!!", data);
        return NextResponse.json({
            message: "Successfully Created Override!"
        }, { status: 200 })
    } catch (error) {
        console.log("Something went wrong while creating overrides", error);
        return NextResponse.json({
            error
        }, { status: 500 })
    }
}


//route to update the timings 
export async function PUT(req: NextRequest) {
    const { availabilityId, startTime, endTime } = await req.json();

    if (!availabilityId || !startTime || !endTime) {
        console.log("Availability id not found");
        return NextResponse.json({
            error: "AvailabilityID not found"
        }, { status: 400 })
    }

    //middleware spoofing chances
    // const teacherId = req.headers.get("x-teacher-id");// get headers from middleware 
    // if(!teacherId){
    //     console.log("Could not get teacherId from the middleware");
    //     return; 
    // }

    //get authenticated user from  middleware 
    const user = (req as any).user;

    if (!user?.teacher?.id) {
        return NextResponse.json({ error: "Only teachers can update availability" }, { status: 403 });
    }

    const teacherId = user.teacher.id;

    try {
        const exists = await prisma.availability.findFirst({
            where: {
                id: availabilityId,
                teacherId
            }
        });

        if (!exists) {
            console.log("Override does not exists");
            return NextResponse.json({
                error: "Override does not exist",
            }, { status: 400 })
        }


        const updated = await prisma.availability.update({
            where: {
                id: availabilityId
            },
            data: {
                startTime,
                endTime
            }
        });
        return NextResponse.json({
            message: "Data uploaded successfully !",
            updated
        });

    } catch (error) {
        console.log("Something went wrong while updating", error);
        return NextResponse.json({
            error
        }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const availabilityId = searchParams.get("availabilityId");

    const teacherId = req.headers.get("x-teacher-id");

    if (!availabilityId) {
        console.log("No availalbility id found!");
        return NextResponse.json({
            erorr: "No availability id found"
        }, { status: 500 });
    }

    if (!teacherId) {
        return NextResponse.json({
            error: "Only valid teacher is able to perform this action"
        }, { status: 403 });
    }

    try {
        const existingOverride = await prisma.availability.findFirst({
            where: {
                id: availabilityId,
                teacherId
            }
        });


        if (!existingOverride) {
            console.log("Override does not exist");
            return NextResponse.json({
                message: "Override does not exist!"
            });
        }

        await prisma.availability.delete({
            where: {
                id: availabilityId,
                teacherId
            }
        });

        return NextResponse.json({
            message: "Override Deleted Successfully",
        }, { status: 200 });
    } catch (error) {
        console.log("Something went wrong while deleting the override ");
        return NextResponse.json({
            message: "Something went wrong while deleting availability",
            error
        }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
        return NextResponse.json({
            error: "Teacher id or date not received"
        }, { status: 403 })
    }

    try {
        const overrides = await prisma.availability.findMany({
            where: {
                teacherId,
                date: {
                    not: null,
                },
                status : "AVAILABLE"
            },
        });

        return NextResponse.json({
            message: "Overrides sent successfully",
            overrides
        }, { status: 200 });
    } catch (error) {
        console.log("Something went wrong while getting overrides", error);
        return NextResponse.json({
            error: error
        }, { status: 500 })
    }

}