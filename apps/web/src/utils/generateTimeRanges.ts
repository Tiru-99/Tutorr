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

interface GenerateTimeRangesParams {
  date: string;       // "YYYY-MM-DD"
  startTime: string;  // "HH:mm"
  endTime: string;    // "HH:mm"
  duration: number;   // in minutes
  timezone: string;   // e.g. "Asia/Kolkata"
  overrides?: Override[];
}

/**
 * Generates time ranges for a given date and time range.
 * Overrides act as "blackout" periods that exclude ranges from the base schedule.
 * 
 * @param params - Configuration for time range generation
 * @returns Array of time ranges in "HH:mm - HH:mm" format in the specified timezone
 */
export function generateTimeRanges({
  date,
  startTime,
  endTime,
  duration,
  timezone,
  overrides = []
}: GenerateTimeRangesParams): string[] {
  // Generate base time ranges
  const baseRanges = generateBaseTimeRanges(date, startTime, endTime, duration, timezone);
  
  // If no overrides, return base ranges
  if (overrides.length === 0) {
    return baseRanges;
  }
  
  // Apply overrides to modify the schedule
  return applyOverridesToRanges(baseRanges, date, duration, timezone, overrides);
}

/**
 * Generates base time ranges without any overrides
 */
function generateBaseTimeRanges(
  date: string,
  startTime: string,
  endTime: string,
  duration: number,
  timezone: string
): string[] {
  const ranges: string[] = [];
  
  const startDateTime = dayjs.tz(`${date} ${startTime}`, timezone);
  const endDateTime = dayjs.tz(`${date} ${endTime}`, timezone);
  
  let currentSlot = startDateTime.clone();
  
  while (currentSlot.isBefore(endDateTime)) {
    const nextSlot = currentSlot.add(duration, "minute");
    
    // Don't create a range if it would exceed the end time
    if (nextSlot.isAfter(endDateTime)) {
      break;
    }
    
    const rangeStart = currentSlot.format("HH:mm");
    const rangeEnd = nextSlot.format("HH:mm");
    ranges.push(`${rangeStart} - ${rangeEnd}`);
    
    currentSlot = nextSlot;
  }
  
  return ranges;
}

/**
 * Applies overrides to the base ranges by excluding override periods.
 * Overrides act as "blackout" periods that remove ranges from the base schedule.
 */
function applyOverridesToRanges(
  baseRanges: string[],
  date: string,
  duration: number,
  timezone: string,
  overrides: Override[]
): string[] {
  let finalRanges = [...baseRanges];
  
  for (const override of overrides) {
    // Convert override period to the base timezone for comparison
    const overrideStart = dayjs.tz(`${date} ${override.startTime}`, override.timezone)
      .tz(timezone);
    const overrideEnd = dayjs.tz(`${date} ${override.endTime}`, override.timezone)
      .tz(timezone);
    
    // Remove base ranges that fall within or overlap the override period
    finalRanges = finalRanges.filter(range => {
      const [startStr, endStr] = range.split(' - ');
      const rangeStart = dayjs.tz(`${date} ${startStr}`, timezone);
      const rangeEnd = dayjs.tz(`${date} ${endStr}`, timezone);
      
      return !isRangeOverlapping(rangeStart, rangeEnd, overrideStart, overrideEnd);
    });
  }
  
  return finalRanges;
}

/**
 * Checks if a time range overlaps with an override period
 */
function isRangeOverlapping(
  rangeStart: dayjs.Dayjs,
  rangeEnd: dayjs.Dayjs,
  overrideStart: dayjs.Dayjs,
  overrideEnd: dayjs.Dayjs
): boolean {
  // Range overlaps if:
  // 1. Range starts within override period
  // 2. Range ends within override period  
  // 3. Range completely contains override period
  // 4. Override completely contains range
  
  return !(rangeEnd.isBefore(overrideStart) || rangeEnd.isSame(overrideStart) || 
           rangeStart.isAfter(overrideEnd) || rangeStart.isSame(overrideEnd));
}

// Example usage:
/*
const timeRanges = generateTimeRanges({
  date: "2024-03-15",
  startTime: "09:00",
  endTime: "13:00", 
  duration: 60, // 1 hour slots
  timezone: "Asia/Kolkata",
  overrides: [
    {
      startTime: "10:00",
      endTime: "11:00",
      timezone: "Asia/Kolkata" // This period will be excluded
    }
  ]
});
// Result: ["09:00 - 10:00", "11:00 - 12:00", "12:00 - 13:00"]
// The 10:00 - 11:00 range is excluded due to override
*/