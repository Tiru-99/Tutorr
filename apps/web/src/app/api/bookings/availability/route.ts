import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";
import { DateTime } from "luxon";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);

  const dateStart = searchParams.get("dateStart");
  const dateEnd = searchParams.get("dateEnd");
  const timezone = searchParams.get("timezone");
  const teacherId = searchParams.get("teacherId");
  const weekDay = searchParams.get("weekDay");

  if (!dateStart || !dateEnd || !timezone || !teacherId || !weekDay) {
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


  try {
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

    const days = schedule.days;
    if (!days.includes(weekDay)) {
      return NextResponse.json({
        message: "Teacher is not available for this day",
        slots: []
      }, { status: 200 })
    }

    const sessionDurationMs = schedule.duration * 60 * 60 * 1000; // Convert hours to milliseconds

    // Find overrides
    const overrides = await prisma.availability.findMany({
      where: {
        teacherId,
        startTime: { gte: utcStartDate },
        endTime: { lte: utcEndDate },
        status: "AVAILABLE"
      },
    });

    let slots = [];

    if (overrides && overrides.length > 0) {
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

      return NextResponse.json({
        message: "All well test message",
        slots
      }, { status: 200 })
      // Generate slots from overrides

    } else {
      // Fallback to template availability
      const availability = await prisma.availability.findFirst({
        where: {
          teacherId,
          date: {
            equals: null
          },
          status: 'AVAILABLE'
        }
      });

      // ADD THIS: Get booked overrides to exclude from template slots
      const bookedOverrides = await prisma.availability.findMany({
        where: {
          teacherId,
          startTime: { gte: utcStartDate },
          endTime: { lte: utcEndDate },
          status: "BOOKED"
        },
      });

      let finalSlots: { startTime: string; endTime: string }[] = [];

      // create slots first
      const generatedSlots = createSlots(
        availability?.startTime!,
        availability?.endTime!,
        schedule.duration
      );

      // iterate slots
      for (const slot of generatedSlots) {
        const startTimeOnly = slot.start.toString().split("T")[1].slice(0, 5);
        const endTimeOnly = slot.end.toString().split("T")[1].slice(0, 5);

        const startTimeforUtcStart = utcStartDate.toISOString().split("T")[1].slice(0, 5);
        const endTimeforUtcEnd = utcEndDate.toISOString().split("T")[1].slice(0, 5);

        if (startTimeOnly > startTimeforUtcStart) {
          const datePart = utcStartDate.toISOString().split("T")[0];
          slot.start = `${datePart}T${startTimeOnly}:00.000Z`;
        } else if (startTimeOnly < endTimeforUtcEnd) {
          const datePart = utcEndDate.toISOString().split("T")[0];
          slot.start = `${datePart}T${startTimeOnly}:00.000Z`;
        }

        const datePartForEnd = slot.start.split("T")[0];
        slot.end = `${datePartForEnd}T${endTimeOnly}:00.000Z`;

        // ADD THIS: Check if slot conflicts with any booked override
        const isBooked = bookedOverrides.some(bookedSlot => {
          const slotStart = new Date(slot.start);
          const slotEnd = new Date(slot.end);
          const bookedStart = new Date(bookedSlot.startTime);
          const bookedEnd = new Date(bookedSlot.endTime);

          // Check for overlap
          return slotStart < bookedEnd && slotEnd > bookedStart;
        });

        // Only add slot if it's not booked
        if (!isBooked) {
          finalSlots.push({
            startTime: slot.start,
            endTime: slot.end,
          });
        }
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
  } catch (error) {
    console.log("Something went wrong in the availability route", error);
    return NextResponse.json({
      message: "Something went wrong in the availability route",
      error
    }, { status: 500 })
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