import { DateTime } from "luxon";

export const generateTimeOnlyUTCSlots = (
  start_time: string | null,        // e.g., "2025-06-27T05:30:00.000Z"
  end_time: string | null,          // e.g., "2025-06-27T10:30:00.000Z"
  session_duration: string | null   // e.g., "1 Hour"
): string[] => {
  if (!start_time || !end_time || !session_duration) return [];

  console.log("The input is ", start_time, end_time, session_duration);

  // Extract numeric hours from session_duration string like "1 Hour"
  const hours = parseInt(session_duration, 10);
  if (isNaN(hours)) return [];

  const durationInMinutes = hours * 60;

  let start = DateTime.fromISO(start_time, { zone: "utc" });
  const end = DateTime.fromISO(end_time, { zone: "utc" });


  const slots: string[] = [];

  while (start <= end.minus({ minutes: durationInMinutes })) {
    slots.push(start.toUTC().toISO()!); // Store full UTC ISO string
    start = start.plus({ minutes: durationInMinutes });
  }

  console.log("The slots in the function are ", slots);
  return slots;
};
/**
 * Convert session slot times like "9:00 AM" into full UTC ISO strings for a specific date.
 * 
 * @param sessionSlots - Array of time strings like "9:00 AM"
 * @param dateISO - Date string in "yyyy-MM-dd" format, e.g., "2025-06-25"
 * @returns Array of valid UTC ISO strings
 */

export const convertSessionSlotsToUTC = (sessionSlots: string[], dateISO: string): string[] => {
  if (!sessionSlots || !dateISO) return [];

  return sessionSlots
    .map(slot => {
      const localDateTime = DateTime.fromFormat(
        `${dateISO} ${slot}`,
        "yyyy-MM-dd h:mm a",
        { zone: "local" }
      );

      return localDateTime.isValid ? localDateTime.toUTC().toISO() : null;
    })
    .filter((slot): slot is string => slot !== null); // ✅ removes null and narrows type
};


/**
 * Compare two ISO UTC strings by time only (ignoring date).
 * Example: "2025-06-20T09:00:00Z" and "2025-06-25T09:00:00Z" will be equal.
 */
export const isSameTime = (iso1: string, iso2: string): boolean => {
  const time1 = DateTime.fromISO(iso1, { zone: "utc" }).toFormat("HH:mm");
  const time2 = DateTime.fromISO(iso2, { zone: "utc" }).toFormat("HH:mm");
  return time1 === time2;
};


export const convertUtcToReadableTime = (utcStrings: string[]) => {
  return utcStrings.map(utc =>
    DateTime.fromISO(utc, { zone: "utc" }) // parse as UTC
      .toLocal() // convert to user's local time zone
      .toFormat("h:mm a") // e.g., "9:00 AM"
  );
};

// Convert a single UTC time to readable local format
export const formatTime = (utcTime: string) => {
  return DateTime.fromISO(utcTime, { zone: 'utc' }).toLocal().toFormat('h:mm a');
};
