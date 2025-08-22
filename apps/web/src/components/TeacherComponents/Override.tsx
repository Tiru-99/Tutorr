"use client"
import DateOverrideModal from "./DateOverrideModal"
import { Button } from "../ui/button"
import { Trash, Calendar, Clock } from "lucide-react"
import { useTimezone } from "@/context/TimezoneContext"
import { useDeleteOverride } from "@/hooks/overrideHooks"

export default function Override({ overrides, refetch }: { overrides: any[]; refetch: () => void }) {
    console.log("the coming overrides is", overrides)
    const { timezone } = useTimezone()
    console.log("The timezone is", timezone)

    return (
        <>
            <div className="space-y-6 mt-6">
                <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Special Date Overrides
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Set specific dates when your availability differs from your regular schedule.
                    </p>
                </div>

                {overrides && overrides.length > 0 && (
                    <div className="space-y-3">
                        {overrides.map((override: any, index: number) => (
                            <OverrideCard
                                key={index}
                                date={override.date}
                                startTime={override.startTime}
                                endTime={override.endTime}
                                id={override.id}
                                onDeleteSuccess={refetch}
                            />
                        ))}
                    </div>
                )}

                <div className="pt-2">
                    <DateOverrideModal
                        onSaveSuccess={refetch}
                        disabledDates={overrides
                            .map(o =>
                                DateTime.fromISO(o.startTime, { zone: "utc" })
                                    .setZone(timezone)
                                    .toISODate()
                            )
                            .filter((d): d is string => d !== null) // type guard: removes null
                        }
                    />

                </div>
            </div>
        </>
    )
}

type OverrideCardProps = {
    date: string
    startTime: string
    endTime: string,
    id: string,
    onDeleteSuccess: () => void
}

function OverrideCard({ date, startTime, endTime, id, onDeleteSuccess }: OverrideCardProps) {
    const { timezone } = useTimezone();
    const result = formatSchedule(startTime, endTime, timezone);
    const { mutate: deleteOverride, isPending } = useDeleteOverride();

    const handleDeleteOverride = () => {
        deleteOverride({ availabilityId: id }, {
            onSuccess: () => {
                onDeleteSuccess()
            },
            onError: (err) => {
                console.error("Failed to save override:", err);
            }
        });
    };
    return (
        <div className="group flex justify-between items-center bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-medium text-gray-900">{result.date}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{result.startTime}</span>
                        <span className="text-gray-400">-</span>
                        <span className="font-medium">{result.endTime}</span>
                    </div>
                </div>
            </div>

            <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 border-gray-200 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group-hover:opacity-100 opacity-70 bg-transparent"
                onClick={handleDeleteOverride}
            >
                <Trash className="h-4 w-4" />
            </Button>
        </div>
    )
}

import { DateTime } from "luxon"

function formatSchedule(startUTC: string, endUTC: string, timezone: string) {
    // Convert start and end times with timezone
    const start = DateTime.fromISO(startUTC, { zone: "utc" }).setZone(timezone);
    const end = DateTime.fromISO(endUTC, { zone: "utc" }).setZone(timezone);

    // Use start time's local date for display
    const date = start.toFormat("ccc dd LLL"); // Example: Wed 25 Aug

    return {
        date,
        startTime: start.toFormat("HH:mm"), // 24h format e.g. 09:00
        endTime: end.toFormat("HH:mm"),     // 24h format e.g. 17:00
    };
}
