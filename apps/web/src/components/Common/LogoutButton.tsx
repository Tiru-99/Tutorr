"use client"
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/authHooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LogoutButton() {

    const router = useRouter();
    const { mutate: logout, isPending, isError } = useLogout();

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                router.push("/auth/login");
                toast.success("Logged out successfully , redirecting to sign in page")
            },
        });
    };

    return (
        <>
            <div className="border-t border-sidebar-border p-4 bg-sidebar">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors",
                        "px-3",
                    )}
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="flex-1 text-left">{isPending ? "Logging Out..." :"Logout"}</span>
                </Button>
            </div>
        </>
    )
}