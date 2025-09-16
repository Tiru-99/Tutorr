"use client"
import { createContext, useContext, useState, ReactNode } from "react";
import { Dispatch , SetStateAction } from "react";

type TimezoneContextType = {
  timezone: string;
  setTimezone: (tz: string) => void;
  selectedDays: string[];
  setSelectedDays: Dispatch<SetStateAction<string[]>>;
};

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined);

export const TimezoneProvider = ({ children }: { children: ReactNode }) => {
  const [timezone, setTimezone] = useState(""); // default
  const [selectedDays, setSelectedDays] = useState<string[]>([]); // default empty

  return (
    <TimezoneContext.Provider value={{ timezone, setTimezone, selectedDays, setSelectedDays }}>
      {children}
    </TimezoneContext.Provider>
  );
};

export const useScheduleContext = () => {
  const context = useContext(TimezoneContext);
  if (!context) throw new Error("useTimezone must be used within TimezoneProvider");
  return context;
};
