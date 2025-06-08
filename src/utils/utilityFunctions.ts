export const generateSlots = (
    start_time: string,
    end_time: string,
    session_duration: string
  ): string[] => {
    const start = parseInt(start_time.slice(0, 2), 10);
    const end = parseInt(end_time.slice(0, 2), 10);
    const dur = parseInt(session_duration, 10); // extracts "1" from "1 hours"
    const slots: string[] = [];
  
    for (let i = start; i + dur <= end; i += dur) {
      const hour24 = i;
      const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
      const suffix = hour24 < 12 ? "AM" : "PM";
      slots.push(`${hour12}:00 ${suffix}`);
    }
  
    return slots;
  };
  