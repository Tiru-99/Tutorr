import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";
import { DateTime } from "luxon";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);

  const dateStart = searchParams.get("dateStart");
  const dateEnd = searchParams.get("dateEnd");
  const timezone = searchParams.get("timezone");
  const teacherId = searchParams.get("teacherId");

  if (!dateStart || !dateEnd || !timezone || !teacherId) {
    console.log("Incomplete data received");
    return NextResponse.json({
      error: "Incomplete data received"
    }, { status: 500 });
  }

  // Convert user date range to UTC
  const utcStartDate = DateTime.fromISO(dateStart, { zone: timezone })
    .startOf("day")
    .toUTC()
    .toJSDate();

  const utcEndDate = DateTime.fromISO(dateEnd, { zone: timezone })
    .endOf("day")
    .toUTC()
    .toJSDate();



  // Get schedule with session duration
  const schedule = await prisma.schedule.findFirst({
    where: {
      teacherId
    }
  });

  if (!schedule || !schedule.duration) {
    return NextResponse.json({
      error: "Schedule or session duration not found"
    }, { status: 404 });
  }

  const sessionDurationMs = schedule.duration * 60 * 60 * 1000; // Convert hours to milliseconds

  // Find overrides
  const overrides = await prisma.availability.findMany({
    where: {
      teacherId,
      startTime: { gte: utcStartDate },
      endTime: { lte: utcEndDate },
    },
  });

  let slots = [];

  if (overrides && overrides.length > 0) {

    return NextResponse.json({
      message: "All well test message"
    }, { status: 200 })
    // Generate slots from overrides

  } else {
    // Fallback to template availability
    const availability = await prisma.availability.findFirst({
      where: {
        teacherId,
        date: {
          equals: null
        }
      }
    });

    let finalSlots: { start: string; end: string }[] = [];

    // create slots first
    const generatedSlots = createSlots(
      availability?.startTime!,
      availability?.endTime!,
      schedule.duration
    );

    // iterate slots
    for (const slot of generatedSlots) {
      const startTimeOnly = slot.start.toString().split("T")[1].slice(0, 5); // HH:mm
      const endTimeOnly = slot.end.toString().split("T")[1].slice(0, 5);

      const startTimeforUtcStart = utcStartDate.toISOString().split("T")[1].slice(0, 5);
      const endTimeforUtcEnd = utcEndDate.toISOString().split("T")[1].slice(0, 5);

      if (startTimeOnly > startTimeforUtcStart) {
        // replace the date with utcStartDate's date
        const datePart = utcStartDate.toISOString().split("T")[0]; // YYYY-MM-DD
        slot.start = `${datePart}T${startTimeOnly}:00.000Z`;
      } else if (startTimeOnly < endTimeforUtcEnd) {
        // replace the date with utcEndDate's date
        const datePart = utcEndDate.toISOString().split("T")[0]; // YYYY-MM-DD
        slot.start = `${datePart}T${startTimeOnly}:00.000Z`;
      }

      // update end date to match adjusted start's date
      const datePartForEnd = slot.start.split("T")[0];
      slot.end = `${datePartForEnd}T${endTimeOnly}:00.000Z`;

      // ✅ push the adjusted slot into finalSlots
      finalSlots.push({
        start: slot.start,
        end: slot.end,
      });
    }

    console.log("Final Slots:", finalSlots);

    // if yes attach it the startUtc Date , and continue with the loop
    // in the else block check if the slots start time is less than the endUTCDate's time 
    // if yes attach it the startUtc Date , and continue with the loop 

    return NextResponse.json({
      message: "Slots generated",
      slots: finalSlots
    })

  }
}

function createSlots(
  startTime: Date,
  endTime: Date,
  sessionDuration: number
): { start: string; end: string }[] {
  const slots: { start: string; end: string }[] = [];

  let start = new Date(startTime);
  const end = new Date(endTime);

  while (start < end) {
    const slotEnd = new Date(start.getTime() + sessionDuration * 60 * 60 * 1000);

    // Ensure slot end doesn’t go past the end time
    if (slotEnd > end) break;

    slots.push({
      start: start.toISOString(),
      end: slotEnd.toISOString(),
    });

    // Move start forward
    start = slotEnd;
  }

  return slots;
}



interface DateTimeResult {
  startTime: string | Date;
  endTime: string | Date;
}

export function combineDateTime(
  startDate: string,
  startTime: string,
  endTime: string
): DateTimeResult {
  // Parse the start date to get the date portion
  const baseDate = DateTime.fromISO(startDate);

  // Parse the time inputs to extract time portions
  const startTimeObj = DateTime.fromISO(startTime);
  const endTimeObj = DateTime.fromISO(endTime);

  // Combine base date with start time
  const newStartTime = baseDate
    .set({
      hour: startTimeObj.hour,
      minute: startTimeObj.minute,
      second: startTimeObj.second,
      millisecond: startTimeObj.millisecond
    })
    .toISO();

  // Combine base date with end time
  const newEndTime = baseDate
    .set({
      hour: endTimeObj.hour,
      minute: endTimeObj.minute,
      second: endTimeObj.second,
      millisecond: endTimeObj.millisecond
    })
    .toISO();

  return {
    startTime: newStartTime!,
    endTime: newEndTime!
  };
}

