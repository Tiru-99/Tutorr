// app/teacher/TeacherContext.tsx
"use client";
import { createContext, useContext } from "react";

type TeacherContextType = {
  userId: string;
};

const TeacherContext = createContext<TeacherContextType | null>(null);

export const useTeacher = () => {
  const ctx = useContext(TeacherContext);
  if (!ctx) throw new Error("useTeacher must be used inside TeacherProvider");
  return ctx;
};

export function TeacherProvider({ userId, children }: { userId: string; children: React.ReactNode }) {
  return (
    <TeacherContext.Provider value={{ userId }}>
      {children}
    </TeacherContext.Provider>
  );
}
