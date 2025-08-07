import { NextRequest, NextResponse } from 'next/server';
import prisma from '@tutorr/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const date = searchParams.get("date");
    const teacherId = searchParams.get("teacherId");

    if (!date || !teacherId) {
        console.log("Incomplete details received");
        return NextResponse.json({ error: "Incomplete data received" }, { status: 409 });
    }

    // to eliminate the time part
    const dateOnly = date.split("T")[0];
    const newDate = new Date(date);
    const newDateString = newDate.toString();
    const dayOfWeek = newDateString.slice(0, 3).toUpperCase();

    console.log("The day of week is", dayOfWeek);
    console.log("The incoming date is", date);

    try {
        const availability = await prisma.teacherAvailability.findFirst({
            where: {
                teacher: {
                    id: teacherId
                },
                date: dateOnly,
                isAvailable: true
            },
            include: {
                SlotDetails: {
                    where: {
                        status: "AVAILABLE",
                    },
                    select: {
                        id: true,
                        slotTime: true
                    }
                },
            },
        });

        console.log("The availability is", availability);

        if (!availability) {
            console.log("Null availability!");

            const teacherWithSlots = await prisma.teacher.findUnique({
                where: { id: teacherId },
                select: {
                    available_days: true,
                    TemplateSlots: {
                        where: {
                            session: null  // only get slots where no session exists
                        },
                        select: {
                            id: true,
                            slotTime: true
                        }
                    }
                }
            });


            if (!teacherWithSlots) {
                console.log("Teacher not found");
                return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
            }

            if (!teacherWithSlots.available_days.includes(dayOfWeek)) {
                console.log("Teacher is not available on this day");
                return NextResponse.json({ slots: [] }, { status: 200 });
            }

            console.log("The default slots are", teacherWithSlots.TemplateSlots);
            return NextResponse.json({
                slots: teacherWithSlots.TemplateSlots,
                teacherWithSlots
            }, { status: 200 });
        }

        return NextResponse.json({
            slots: availability.SlotDetails,
            finalDetails: availability.SlotDetails
        }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong while fetching availability", error);
        return NextResponse.json({ message: "Something went wrong while fetching availability" }, { status: 500 });
    }
}
