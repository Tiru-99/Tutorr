"use client"
import { createContext, useContext, useState, ReactNode } from "react";

type TimezoneContextType = {
  timezone: string;
  setTimezone: (tz: string) => void;
};

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined);

export const TimezoneProvider = ({ children }: { children: ReactNode }) => {
  const [timezone, setTimezone] = useState("UTC"); // default

  return (
    <TimezoneContext.Provider value={{ timezone, setTimezone }}>
      {children}
    </TimezoneContext.Provider>
  );
};

export const useTimezone = () => {
  const context = useContext(TimezoneContext);
  if (!context) throw new Error("useTimezone must be used within TimezoneProvider");
  return context;
};
