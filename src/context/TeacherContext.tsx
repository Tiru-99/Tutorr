import { createContext, ReactNode } from "react";

interface TeacherContextType {
  sessionSlots: string[];
  availableDays: string[];
  sessionDuration : string;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

interface TeacherProviderProps {
  children: ReactNode;
  sessionSlots: string[];
  availableDays: string[];
  sessionDuration : string; 
}

export function TeacherProvider({ children, sessionSlots, availableDays , sessionDuration }: TeacherProviderProps) {
  const value = { sessionSlots, availableDays , sessionDuration };

  return (
    <TeacherContext.Provider value={value}>
      {children}
    </TeacherContext.Provider>
  );
}

export {TeacherContext}