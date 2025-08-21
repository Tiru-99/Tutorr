"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthorized } from "@/hooks/authHooks";
import { TeacherProvider } from "./TeacherContext";

//code to include auth check before rendering every page after /teacher/*
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
    }, []);

    if (isPending) return <div>Checking Permissions...</div>;
    if (!userId) return <div>Loading...</div>;

    // ✅ When everything is fine, render whatever page is inside /teacher/*
    return <>
        <TeacherProvider userId={userId}>
            {children}
        </TeacherProvider>
        </>;
}
