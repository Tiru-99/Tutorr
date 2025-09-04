"use client"
import StudentEdit from "@/components/StudentComponents/StudentEdit";
import { useAuthorized } from "@/hooks/authHooks";
import { useEffect , useState } from "react";
import { useRouter } from "next/navigation";

export default function Page (){
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
    
        if (!userId || isPending) {
            return <div>Loading...</div>; // You can replace with a spinner component
        }

    return (
        <>
            <StudentEdit/>
        </>
    )
}