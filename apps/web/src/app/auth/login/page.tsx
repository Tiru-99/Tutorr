'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // <- added this
import { useLogin, useIsAuthenticated } from "@/hooks/authHooks";
import GoogleAuthProvider from "@/components/Common/GoogleAuthProvider";
import { GoogleSignIn } from "@/components/Common/GoogleSignIn";
import Image from "next/image";
import { loginSchema } from "@tutorr/common/schema"
import { z } from 'zod';
import { toast } from "sonner";
import { BookOpen } from "lucide-react";

export default function Login() {
    const router = useRouter();
    const { mutate, isPending } = useLogin();
    const { data: isAuthenticated, isLoading } = useIsAuthenticated();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isTutor, setIsTutor] = useState<boolean>(false);
    const [data, setData] = useState({
        email: "",
        password: "",
        type: "STUDENT"
    });


    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            const type = localStorage.getItem("type");
            if (type && window.location.pathname !== `/${type.toLowerCase()}/profile`) {
                router.push(`/${type.toLowerCase()}/profile`);
            }
        }
    }, [isLoading, isAuthenticated, router]);


    console.log(data);

    const handleSubmit = () => {
        try {
            const validatedData = loginSchema.parse(data);
            setErrorMessage(""); // clear previous errors

            mutate(validatedData, {
                onSuccess: () => router.push(`/${data.type.toLowerCase()}/profile`),
                onError: (err: any) => {
                    // Better error extraction with fallback chain
                    const error = err?.response?.data?.message ||
                        err?.response?.data?.error ||
                        err?.message ||
                        "Login failed. Please try again.";
                    setErrorMessage(error);
                },
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = (error as z.ZodError).issues.map(issue => {
                    return `${issue.message}`;
                });
                toast.error(fieldErrors.join(' , '));
            } else {

                console.error('Unexpected error during form submission:', error);
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="h-screen overflow-hidden">
            <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex items-center space-x-2 flex-shrink-0 p-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <BookOpen className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-lg sm:text-3xl font-bold text-neutral-900">Tutorr</span>
                    </div>

                    {/* Auth Forms */}
                    <div className="flex justify-center items-center flex-1 px-4 md:px-0 mt-24 md:mt-0">
                        <div className="w-full max-w-sm">
                            <p className="font-bold text-2xl md:text-3xl text-left">LOG IN</p>
                            <p className="font-extralight text-gray-500 pb-2 pt-1 text-sm md:text-base">
                                Enter your credentials to access your account
                            </p>

                            {/* Toggle Bar */}
                            <div className="h-10 w-full md:w-60 rounded-full bg-gray-100 p-1 shadow-inner mt-3">
                                <div className="flex w-full h-full relative">
                                    <div
                                        className={`absolute w-1/2 h-full bg-black rounded-full transition-all duration-300 ${isTutor ? "left-0" : "left-1/2"
                                            }`}
                                    ></div>
                                    <div className="flex w-full justify-between items-center z-10 relative text-sm md:text-base">
                                        <div
                                            className={`w-1/2 text-center font-medium cursor-pointer ${isTutor ? "text-white" : "text-black"
                                                }`}
                                            onClick={() => {
                                                setIsTutor(true);
                                                setData((prev) => ({
                                                    ...prev,
                                                    type: "TEACHER",
                                                }));
                                                toast.success("Teacher Selected")
                                            }}
                                        >
                                            Tutor
                                        </div>
                                        <div
                                            className={`w-1/2 text-center font-medium cursor-pointer ${!isTutor ? "text-white" : "text-black"
                                                }`}
                                            onClick={() => {
                                                setIsTutor(false);
                                                setData((prev) => ({
                                                    ...prev,
                                                    type: "STUDENT",
                                                }));
                                                toast.success("Student Selected")
                                            }}
                                        >
                                            Student
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex flex-col space-y-2 pt-3">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    required
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    onChange={(e) =>
                                        setData((prev) => ({ ...prev, email: e.target.value }))
                                    }
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Password */}
                            <div className="flex flex-col space-y-2 pt-3">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    required
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    onChange={(e) =>
                                        setData((prev) => ({ ...prev, password: e.target.value }))
                                    }
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Error */}
                            {errorMessage && (
                                <div className="text-red-500 text-sm pt-2">{errorMessage}</div>
                            )}

                            {/* Button */}
                            <div className="flex flex-col w-full pt-6 pb-6 border-b border-gray-300">
                                <button
                                    className={`w-full bg-blue-800 text-white p-3 rounded-2xl hover:bg-blue-600 transition ${isPending ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    disabled={isPending}
                                    onClick={handleSubmit}
                                >
                                    {isPending ? "Logging In..." : "Log In"}
                                </button>
                                <p className="pl-2 pt-2 text-sm md:text-base">
                                    First time here ?{" "}
                                    <span>
                                        <u>
                                            <a
                                                href="/auth/signup"
                                                className="text-blue-800 font-semibold"
                                            >
                                                Sign Up
                                            </a>
                                        </u>
                                    </span>
                                </p>
                            </div>

                            <div className="flex justify-center mt-6">
                                <GoogleAuthProvider>
                                    <GoogleSignIn role={data.type}></GoogleSignIn>
                                </GoogleAuthProvider>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block w-1/2 relative h-full rounded-full">
                    <Image
                        src="/images/tutorr.png"
                        alt="Sample Image"
                        fill
                        className="object-cover rounded-l-3xl"
                    />
                </div>
            </div>
        </div>

    );
}
