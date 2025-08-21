import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezonePlugin from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

interface Override {
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  timezone: string;  // e.g. "Asia/Kolkata"
}

interface GenerateSlotsParams {
  date: string;       // "YYYY-MM-DD"
  startTime: string;  // "HH:mm"
  endTime: string;    // "HH:mm"
  duration: number;   // in minutes
  timezone: string;   // e.g. "Asia/Kolkata"
  overrides?: Override[];
}

/**
 * Generates time slots for a given date and time range.
 * Overrides act as "blackout" periods that exclude slots from the base schedule.
 * 
 * @param params - Configuration for slot generation
 * @returns Array of slot start times in UTC format
 */
export function generateSlots({
  date,
  startTime,
  endTime,
  duration,
  timezone,
  overrides = []
}: GenerateSlotsParams): string[] {
  // Generate base time slots
  const baseSlots = generateBaseSlots(date, startTime, endTime, duration, timezone);
  
  // If no overrides, return base slots
  if (overrides.length === 0) {
    return baseSlots;
  }
  
  // Apply overrides to modify the schedule
  return applyOverrides(baseSlots, date, duration, overrides);
}

/**
 * Generates base time slots without any overrides
 */
function generateBaseSlots(
  date: string,
  startTime: string,
  endTime: string,
  duration: number,
  timezone: string
): string[] {
  const slots: string[] = [];
  
  const startDateTime = dayjs.tz(`${date} ${startTime}`, timezone);
  const endDateTime = dayjs.tz(`${date} ${endTime}`, timezone);
  
  let currentSlot = startDateTime.clone();
  
  while (currentSlot.isBefore(endDateTime)) {
    slots.push(currentSlot.utc().format());
    currentSlot = currentSlot.add(duration, "minute");
  }
  
  return slots;
}

/**
 * Applies overrides to the base slots by excluding override periods.
 * Overrides act as "blackout" periods that remove slots from the base schedule.
 */
function applyOverrides(
  baseSlots: string[],
  date: string,
  duration: number,
  overrides: Override[]
): string[] {
  let finalSlots = [...baseSlots];
  
  for (const override of overrides) {
    // Convert override period to UTC for comparison
    const overrideStart = dayjs.tz(`${date} ${override.startTime}`, override.timezone).utc();
    const overrideEnd = dayjs.tz(`${date} ${override.endTime}`, override.timezone).utc();
    
    // Remove base slots that fall within the override period
    finalSlots = finalSlots.filter(slotUTC => {
      const slotTime = dayjs.utc(slotUTC);
      return !isSlotInPeriod(slotTime, overrideStart, overrideEnd);
    });
  }
  
  return finalSlots.sort();
}

/**
 * Checks if a slot falls within a given time period
 */
function isSlotInPeriod(
  slotTime: dayjs.Dayjs,
  periodStart: dayjs.Dayjs,
  periodEnd: dayjs.Dayjs
): boolean {
  return (slotTime.isAfter(periodStart) || slotTime.isSame(periodStart)) && slotTime.isBefore(periodEnd);
}

// Example usage:
/*
const slots = generateSlots({
  date: "2024-03-15",
  startTime: "09:00",
  endTime: "13:00", 
  duration: 30,
  timezone: "America/New_York",
  overrides: [
    {
      startTime: "10:00",
      endTime: "11:00",
      timezone: "America/New_York" // This period will be excluded
    }
  ]
});
// Result: slots from 09:00-09:30, 09:30-10:00, 11:00-11:30, 11:30-12:00, 12:00-12:30, 12:30-13:00
// The 10:00-11:00 period is excluded due to override
*/