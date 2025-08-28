import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";
import { DateTime } from "luxon";

export async function POST(req: NextRequest) {
    const { timezone, duration, startTime, endTime , days } = await req.json();
    const teacherId = req.headers.get("x-teacher-id");

    if (!teacherId) {
        console.log("Failed authentication");
        return NextResponse.json({
            error: "Failed Authentication"
        }, { status: 400 })
    }

    if (!timezone || !duration || !startTime || !endTime || !days) {
        console.log("Incomplete schedule details");
        return NextResponse.json({
            error: "Incomplete details sent !"
        }, { status: 403 });
    }

    console.log("The startTimes and endTimes are", startTime, endTime);

    //conver starttime and endTime to unix based utc date
    const referenceDate = "1970-01-01";
    const dtStart = DateTime.fromFormat(`${referenceDate} ${startTime}`, "yyyy-MM-dd HH:mm", { zone: timezone });
    const startTimeUTC = dtStart.toUTC().toISO();

    const dtEnd = DateTime.fromFormat(`${referenceDate} ${endTime}`, "yyyy-MM-dd HH:mm", { zone: timezone });
    const endTimeUTC = dtEnd.toUTC().toISO();

    console.log("The utc times are ", startTimeUTC, endTimeUTC)

    if (!startTimeUTC || !endTimeUTC) {
        console.log("Something went wrong while time conversion to utc");
        return NextResponse.json({
            error: "Something went wrong cant convert the time !"
        }, { status: 500 })
    }
    //create schedule 
    try {
        const schedule = await prisma.schedule.upsert({
            where: { teacherId },
            create: {
                teacherId,
                timezone,
                duration,
                days , 
                availability: {
                    create: [
                        {
                            teacherId,
                            startTime: startTimeUTC,
                            endTime: endTimeUTC,
                        },
                    ],
                },
            },
            update: {
                timezone,
                duration,
                days ,
                availability: {
                    updateMany: {
                        where: { date: null },
                        data: {
                            startTime: startTimeUTC,
                            endTime: endTimeUTC,
                        },
                    },
                },
            },
            include: { availability: true },
        });


        console.log("Schedule created : ", schedule);
    } catch (error) {
        console.log("something went wrong while creating schedule", error);
        return NextResponse.json({
            error: "Something went wrong while creating schedule"
        }, { status: 500 })
    }

    return NextResponse.json({
        message: "Successfully created a teacher schedule"
    }, { status: 200 });

}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const teacherId = searchParams.get("teacherId");

  if (!teacherId) {
    return NextResponse.json({ error: "Teacher id not sent" }, { status: 400 });
  }

  try {
    // fetch schedule with all availability
    const schedule = await prisma.schedule.findFirst({
      where: { teacherId },
      include: { availability: true },
    });

    if (!schedule) {
      return NextResponse.json({ message: "No schedule found" }, { status: 200 });
    }

    console.log("The found schedule is " , schedule);

    // split into overrides and templates
    const overrides = schedule.availability.filter(a => a.date !== null);
    const templates = schedule.availability.filter(a => a.date === null);

    return NextResponse.json({
      message: "Schedule fetched successfully!",
      schedule,
      overrides,
      templates,
    }, { status: 200 });

  } catch (error) {
    console.log("Something went wrong while getting the schedule", error);
    return NextResponse.json({
      error: "Something went wrong while getting the schedule"
    }, { status: 500 });
  }
}
