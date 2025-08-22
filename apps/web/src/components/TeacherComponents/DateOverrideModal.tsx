import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog"
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar"
import { Button } from "../ui/button"
import { useState } from "react";
import { isBefore } from "date-fns";
import SmartTimePicker from "./SmartTimePicker";
import { Plus } from "lucide-react";
import OverrideTime from "./OverrideTime";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useInsertOverride } from "@/hooks/overrideHooks";
import { useTimezone } from "@/context/TimezoneContext";
import { Trash } from "lucide-react";

export default function DateOverrideModal({ onSaveSuccess, disabledDates }: { onSaveSuccess: () => void, disabledDates: string[] }) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [availabilityForDay, setAvailabilityForDay] = useState(false);
    const [times, setTimes] = useState([{ startTime: "9", endTime: "17" }]);
    const { mutate, isPending, isError } = useInsertOverride();

    const { timezone } = useTimezone();

    if (date) {
        console.log("The date is ", date.toISOString());
    }

    //disabled dates
    const disabled = disabledDates.map(dateUTC =>
        DateTime.fromISO(dateUTC, { zone: "utc" }).toISODate() // normalize to YYYY-MM-DD
    );


    const handleSubmit = () => {
        if (!date) return;

        // Get the local date components (year, month, day)
        // Then create UTC date with those components at midnight
        const utcDate = new Date(Date.UTC(
            date.getFullYear(),      // Use local year
            date.getMonth(),         // Use local month
            date.getDate(),          // Use local day
            0, 0, 0, 0              // Set to midnight UTC
        ));

        const timeToSend = convertTimesToUTC(utcDate.toISOString(), times, timezone)
        console.log("The times to send is ", timeToSend);
        const dataToSend = {
            date: utcDate.toISOString(),  // Will be YYYY-MM-DDTHH:00:00.000Z
            times: timeToSend,
            availability: !availabilityForDay,
            timezone
        };

        console.log("The data to send is ", dataToSend);

        mutate(dataToSend, {
            onSuccess: () => {
                onSaveSuccess();   // ✅ Refetch only after success
            },
            onError: (err) => {
                console.error("Failed to save override:", err);
            }
        });
    };
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        Add an Override
                    </Button>
                </DialogTrigger>

                {/* ✅ Fix overflow by applying width constraints here */}
                <DialogContent className="md:max-w-3xl ">
                    <DialogTitle>Select the date to override</DialogTitle>

                    <div className="flex flex-col md:flex-row justify-center gap-5">
                        <div className="flex flex-col flex-wrap items-center lg:items-start gap-2 @md:flex-row">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border shadow-sm"
                                disabled={(d) => {
                                    const dISO = DateTime.fromJSDate(d).toISODate(); // convert Calendar date to YYYY-MM-DD
                                    return (
                                        DateTime.fromJSDate(d).startOf("day") < DateTime.now().startOf("day") || // past dates
                                        disabled.includes(dISO) // check disabled list
                                    );
                                }}
                            />
                        </div>
                        <div className="md:w-1/2 flex flex-col md:min-h-full">
                            {date ? (
                                <div className="flex flex-col flex-1">
                                    <h2>Select a date from the calendar</h2>
                                    <div>
                                        <OverrideTime times={times} setTimes={setTimes}></OverrideTime>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-4">
                                        <Switch checked={availabilityForDay} onCheckedChange={setAvailabilityForDay} />
                                        <Label htmlFor="availability">Mark unavailable for the day</Label>
                                    </div>

                                    {/* You can put any extra components here */}

                                    <div className="md:mt-auto flex justify-end mt-4">
                                        <Button onClick={handleSubmit}>Save Override</Button>
                                    </div>

                                </div>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Please select a date from the calendar
                                </p>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

//override component box code here 


import { DateTime } from "luxon";

type TimeRange = {
    startTime: string; // e.g. "9"
    endTime: string;   // e.g. "17"
};

export function convertTimesToUTC(
    dateISO: string,       // e.g. "2025-08-23T00:00:00Z"
    times: TimeRange[],    // array of { startTime, endTime }
    timezone: string       // e.g. "America/Toronto"
) {
    return times.map(({ startTime, endTime }) => {
        const start = DateTime.fromISO(dateISO, { zone: timezone })
            .set({ hour: parseInt(startTime, 10), minute: 0, second: 0 })
            .toUTC();

        const end = DateTime.fromISO(dateISO, { zone: timezone })
            .set({ hour: parseInt(endTime, 10), minute: 0, second: 0 })
            .toUTC();

        return {
            startUTC: start.toISO(), // UTC DateTime string
            endUTC: end.toISO()
        };
    });
}
