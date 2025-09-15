"use client"
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation"; // Next.js 13+
import axios from "axios";
export const GoogleSignIn = ({ role }: { role: string }) => {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSuccess = async (credentialResponse: any) => {
        try {
            const { credential } = credentialResponse;

            const response = await axios.post("/api/auth/google", {
                idToken: credential,
                role
            });

            const { userId, type, name, email, studentId, teacherId } = response.data;

            localStorage.setItem("userId", userId);
            localStorage.setItem("type", type);
            localStorage.setItem("name", name);
            localStorage.setItem("email", email);
            localStorage.setItem("studentId", studentId);
            localStorage.setItem("teacherId", teacherId);

            // Use router instead of window.location.href
            router.push(`/`);
            console.log("The credential is ", credential);
        } catch (error: any) {
            setError(error.response.data.message);
            console.error(error);
        }
    }

    const handleError = () => {
        setError("Google sign in error");
    }

    return (
        <div className="w-80 mt-3 flex flex-col items-center space-y-2">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap={false}
                size="large"
                text="continue_with"
                logo_alignment="left"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

    )
}