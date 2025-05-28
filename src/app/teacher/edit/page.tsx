"use client"
import { useEffect, useState } from "react"
import TeacherEdit from "@/components/TeacherComponents/TeacherEdit";
import { useAuthorized } from "@/hooks/authHooks";
import { useRouter } from "next/navigation";


export default function Home(){
    const router = useRouter(); 
    const {mutate , isPending , isError , isSuccess} = useAuthorized();
    const [userId , setUserId] = useState<string>(); 

    useEffect(() => {
        const checkAuthAndLoad = async () => {
            mutate("TEACHER", {
                onSuccess: (isAuthenticated) => {
                    if (!isAuthenticated) {
                        router.push("/auth/login");
                        return;
                    }

                    const id = localStorage.getItem('userId');
                    if (!id) {
                        router.push("/auth/login"); // fallback if id is missing
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
    }, []);

    if(isPending){
        return <div>Checking Permissions...</div>
    }

    if (!userId) {
        return <div>Loading...</div>; // Or show a spinner
    }

    return (
        <>
            <TeacherEdit/>
        </>
    )
}