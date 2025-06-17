import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const date = searchParams.get("date");
    const teacherId = searchParams.get("teacherId");

    if (!date || !teacherId) {
        console.log("Incomplete details received");
        return NextResponse.json({ error: "Incomplete data received" }, { status: 409 });
    }

    const newDate = new Date(date);
    const newDateString = newDate.toString();
    const dayOfWeek = newDateString.slice(0, 3).toUpperCase();



    try {

        const availability = await prisma.teacherAvailability.findFirst({
            where: {
                teacher: {
                    id: teacherId
                },
                date: date,
                isAvailable: true
            },
            include: {
                SlotDetails: {
                    where: {
                        status: "AVAILABLE",
                    },
                    select: {
                        slotTime: true
                    }
                },
            },
        });


        if (!availability) {
            console.log("Null availability!");
            //querying teacher to get the default slots 
            const teacherWithSlots = await prisma.teacher.findUnique({
                where: { id: teacherId },
                select: {
                    available_days: true,
                    TemplateSlots: {
                        select: {
                            slotTime: true
                        }
                    }
                }
            });

            if (!teacherWithSlots) {
                console.log("Teacher not found");
                return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
            }
            //checking if the current dayOfweek includes in availalbeDays 
            if (!teacherWithSlots.available_days.includes(dayOfWeek)) {
                console.log("Teacher is not available on this day");
                return NextResponse.json({ slots: [] }, { status: 200 });
            }

            console.log("The default slots are", teacherWithSlots.TemplateSlots);

            const slots = teacherWithSlots.TemplateSlots.map(slot => slot.slotTime);
            return NextResponse.json({ slots }, { status: 200 });
        }

        return NextResponse.json({ data: availability }, { status: 200 });
    } catch (error) {
        console.log("Something went wrong while fetching availabilty", error);
        return NextResponse.json({ message: "Something went wrong while fetching availability" }, { status: 500 });
    }
}