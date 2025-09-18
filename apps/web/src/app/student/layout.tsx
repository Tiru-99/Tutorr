"use client"
import { useAuthorized } from "@/hooks/authHooks";
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { StudentProvider } from "./StudentContext";
import { StudentNavbar } from "@/components/StudentComponents/Navbar";
interface PageProps {
    children: ReactNode;
}

export default function Page({ children }: PageProps) {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const { mutate, isPending } = useAuthorized();

    useEffect(() => {
        const checkAuthAndLoad = async () => {
            mutate("STUDENT", {
                onSuccess: (isAuthenticated) => {
                    if (!isAuthenticated) {
                        router.push("/auth/login");
                        return;
                    }

                    const id = localStorage.getItem('userId');
                    if (!id) {
                        router.push("/auth/login");
                        return;
                    }

                    setUserId(id);
                },
                onError: (error) => {
                    console.error("Auth check error", error);
                    router.push("/auth/login");
                }
            });
        };

        checkAuthAndLoad();
    } , []);

    if (!userId || isPending) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-700 text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <StudentProvider userId={userId}>
            <div className="flex flex-col min-h-screen">
                {/* Navbar at the top */}
                <header>
                    <StudentNavbar />
                </header>

                {/* Main content */}
                <main className="flex-1 p-6 bg-gray-50">
                    {children}
                </main>
            </div>
        </StudentProvider>
    );
}
