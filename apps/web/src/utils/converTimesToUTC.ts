import { DateTime } from "luxon";

export function convertTimesToUTC(timeStrings: { startTime: string, endTime: string }[], timezone: string) {
  return timeStrings.map(({ startTime, endTime }) => {
    // Parse startTime
    const start = DateTime.fromFormat(startTime, "HH:mm", { zone: timezone })
      .set({ year: 1970, month: 1, day: 1 })
      .toUTC();

    // Parse endTime
    const end = DateTime.fromFormat(endTime, "HH:mm", { zone: timezone })
      .set({ year: 1970, month: 1, day: 1 })
      .toUTC();

    return {
      startTimeUTC: start.toISO({ suppressMilliseconds: true }),
      endTimeUTC: end.toISO({ suppressMilliseconds: true }),
    };
  });
}

