"use client"
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Time = {
  startTime: string;
  endTime: string;
};

type OverrideTimeProps = {
  times: Time[];
  setTimes: React.Dispatch<React.SetStateAction<Time[]>>;
};

//passing child state to the parent state
export default function OverrideTime({times , setTimes} : OverrideTimeProps) {
  // const [times, setTimes] = useState([{ startTime: "9", endTime: "17" }]);

  const addRow = () => {
    setTimes([...times, { startTime: "", endTime: "" }]);
  };

  const removeRow = (index: number) => {
    setTimes(times.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: "startTime" | "endTime", value: string) => {
    const updated = [...times];

    // Update startTime
    if (field === "startTime") {
      updated[index].startTime = value;

      // Reset endTime if invalid
      if (updated[index].endTime && parseInt(updated[index].endTime) <= parseInt(value)) {
        updated[index].endTime = "";
      }
    }

    // Update endTime only if greater than startTime
    if (field === "endTime") {
      const start = parseInt(updated[index].startTime);
      const end = parseInt(value);

      if (!isNaN(start) && end > start) {
        updated[index].endTime = value;
      } else {
        // invalid → clear endTime
        updated[index].endTime = "";
      }
    }

    setTimes(updated);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  function formatHour(h: number) {
    return `${h.toString().padStart(2, "0")}:00`;
  }

  return (
    <div className="flex flex-col w-full mt-1">
      {times.map((row, index) => (
        <div
          key={index}
          className="flex flex-wrap gap-3 items-center mt-2"
        >
          {/* Start Time */}
          <Select
            value={row.startTime}
            onValueChange={(val) => updateRow(index, "startTime", val)}
          >
            <SelectTrigger className="w-28 sm:w-32">
              <SelectValue placeholder="Start Time" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((h) => (
                <SelectItem key={h} value={h.toString()}>
                  {formatHour(h)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="flex items-center">-</span>

          {/* End Time */}
          <Select
            value={row.endTime}
            onValueChange={(val) => updateRow(index, "endTime", val)}
          >
            <SelectTrigger className="w-28 sm:w-32">
              <SelectValue placeholder="End Time" />
            </SelectTrigger>
            <SelectContent>
              {hours
                .filter((h) => row.startTime === "" || h > parseInt(row.startTime)) // ✅ Only show greater hours
                .map((h) => (
                  <SelectItem key={h} value={h.toString()}>
                    {formatHour(h)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Add / Remove */}
          {index === 0 ? (
            <button
              type="button"
              onClick={addRow}
              className="p-2 rounded-md border hover:bg-gray-100"
            >
              <Plus className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="p-2 rounded-md border hover:bg-red-100"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          )}
        </div>
      ))}

      {/* Debug preview */}
      {/* <pre className="mt-3 text-xs bg-gray-100 p-2 rounded">
        {JSON.stringify(times, null, 2)}
      </pre> */}
    </div>
  );
}
