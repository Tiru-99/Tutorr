"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthorized } from "@/hooks/authHooks";
import { TeacherProvider } from "./TeacherContext";
import { TeacherSidebar } from "@/components/TeacherComponents/Sidebar";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { mutate, isPending } = useAuthorized();
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    mutate("TEACHER", {
      onSuccess: (isAuthenticated) => {
        if (!isAuthenticated) {
          router.push("/auth/login");
          return;
        }

        const id = localStorage.getItem("userId");
        if (!id) {
          router.push("/auth/login");
          return;
        }

        setUserId(id);
      },
      onError: () => {
        router.push("/auth/login");
      },
    });
  },[]);

  // Centered spinner loader
  if (isPending || !userId)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-700 text-lg">Loading...</p>
      </div>
    );

  return (
    <TeacherProvider userId={userId}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="lg:w-64 bg-gray-900 text-white lg:p-4">
          <TeacherSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </TeacherProvider>
  );
}
