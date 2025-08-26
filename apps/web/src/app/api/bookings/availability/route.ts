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
    // Generate slots from overrides
    for (const override of overrides) {
      const overrideSlots = generateSlots(
        override.startTime,
        override.endTime,
        sessionDurationMs,
        utcStartDate,
        utcEndDate
      );
      slots.push(...overrideSlots);
    }
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

    if (availability && availability.startTime && availability.endTime) {
      const slot = combineDateTime(
        dateStart,
        availability.startTime.toISOString(),
        availability.endTime.toISOString()
      );
      
      const slotStart = new Date(slot.startTime);
      const slotEnd = new Date(slot.endTime);
      
      // Generate slots from template availability
      const templateSlots = generateSlots(
        slotStart,
        slotEnd,
        sessionDurationMs,
        utcStartDate,
        utcEndDate
      );
      slots.push(...templateSlots);
    }
  }

  return NextResponse.json({
    slots: slots
  }, { status: 200 });
}

function generateSlots(
  availabilityStart: Date,
  availabilityEnd: Date,
  sessionDurationMs: number,
  userDateStart: Date,
  userDateEnd: Date
) {
  const slots = [];
  let currentSlotStart = new Date(availabilityStart.getTime());
  
  while (currentSlotStart < availabilityEnd) {
    const currentSlotEnd = new Date(currentSlotStart.getTime() + sessionDurationMs);
    
    // Don't include slot if it starts at or after user's date range end
    if (currentSlotStart >= userDateEnd) {
      break;
    }
    
    // Truncate slot end if it exceeds availability end
    const actualSlotEnd = currentSlotEnd > availabilityEnd ? availabilityEnd : currentSlotEnd;
    
    // Only include slots that have some overlap with user's date range
    if (currentSlotStart < userDateEnd && actualSlotEnd > userDateStart) {
      slots.push({
        startTime: currentSlotStart,
        endTime: actualSlotEnd
      });
    }
    
    // Move to next slot
    currentSlotStart = new Date(currentSlotEnd.getTime());
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