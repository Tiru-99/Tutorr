import { createContext, ReactNode } from "react";

interface TeacherContextType {
  sessionSlots: string[];
  availableDays: string[];
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

interface TeacherProviderProps {
  children: ReactNode;
  sessionSlots: string[];
  availableDays: string[];
}

export function TeacherProvider({ children, sessionSlots, availableDays }: TeacherProviderProps) {
  const value = { sessionSlots, availableDays };

  return (
    <TeacherContext.Provider value={value}>
      {children}
    </TeacherContext.Provider>
  );
}

export {TeacherContext}