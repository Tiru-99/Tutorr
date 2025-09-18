"use client"
import { createContext, ReactNode } from "react";

interface TeacherContextType {
  sessionSlots: string[];
  availableDays: string[];
  sessionDuration : string;
  id : string ; 
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

interface TeacherProviderProps {
  children: ReactNode;
  sessionSlots: string[];
  availableDays: string[];
  sessionDuration : string; 
  id : string; 
}

export function TeacherProvider({ children, sessionSlots, availableDays , sessionDuration , id }: TeacherProviderProps) {
  const value = { sessionSlots, availableDays , sessionDuration , id };

  return (
    <TeacherContext.Provider value={value}>
      {children}
    </TeacherContext.Provider>
  );
}

export {TeacherContext}