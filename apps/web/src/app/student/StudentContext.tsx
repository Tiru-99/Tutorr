// app/teacher/TeacherContext.tsx
"use client";
import { createContext, useContext } from "react";

type StudentContextType = {
  userId: string;
};

const StudentContext = createContext<StudentContextType | null>(null);

export const useStudent = () => {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useTeacher must be used inside TeacherProvider");
  return ctx;
};

export function StudentProvider({ userId, children }: { userId: string; children: React.ReactNode }) {
  return (
    <StudentContext.Provider value={{ userId }}>
      {children}
    </StudentContext.Provider>
  );
}
