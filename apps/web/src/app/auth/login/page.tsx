'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // <- added this
import { useLogin, useIsAuthenticated } from "@/hooks/authHooks";
import GoogleAuthProvider from "@/components/Common/GoogleAuthProvider";
import { GoogleSignIn } from "@/components/Common/GoogleSignIn";
import Image from "next/image";
import { loginSchema } from "@tutorr/common/schema"
import {z} from 'zod';
import { toast } from "sonner";

export default function Login() {
    const router = useRouter();
    const { mutate, isPending, isSuccess, isError } = useLogin();
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
            router.push('/');
        }
    }, [isLoading, isAuthenticated, router]);

    console.log(data);

    const handleSubmit = () => {
        try {
            const validatedData = loginSchema.parse(data);
            setErrorMessage(""); // clear previous errors

            mutate(validatedData, {
                onSuccess: () => router.push("/"),
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
                    const field = issue.path.join('.');
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
            <div className="hidden md:flex h-full">
                <div className="w-1/2 flex flex-col">
                    <div className="pt-10 pl-10">
                        <Image
                            src="/images/tutr.png"
                            alt="sample Image"
                            height={100}
                            width={100}
                        />
                    </div>

                    {/* Auth Forms */}
                    <div className="flex justify-center items-center h-full">
                        <div>
                            <p className="font-bold text-3xl text-left">LOG IN </p>
                            <p className="font-extralight text-gray-500 pb-2 pt-1">Enter your credentials to access your account</p>
                            {/* Toggle Bar */}
                            <div className="h-10 w-60 rounded-full bg-gray-100 p-1 shadow-inner mt-3">
                                <div className="flex w-full h-full relative">
                                    {/* Active Option Background */}
                                    <div
                                        className={`absolute w-1/2 h-full bg-black rounded-full transition-all duration-300 ${isTutor ? 'left-0' : 'left-1/2'}`}
                                    ></div>

                                    {/* Options */}
                                    <div className="flex w-full justify-between items-center z-10 relative">
                                        <div
                                            className={`w-1/2 text-center font-medium cursor-pointer ${isTutor ? 'text-white' : 'text-black'}`}
                                            onClick={() => {
                                                setIsTutor(true);
                                                setData(prev => ({
                                                    ...prev,
                                                    type: "TEACHER"
                                                }));
                                            }}
                                        >
                                            Tutor
                                        </div>
                                        <div
                                            className={`w-1/2 text-center font-medium cursor-pointer ${!isTutor ? 'text-white' : 'text-black'}`}
                                            onClick={() => {
                                                setIsTutor(false);
                                                setData(prev => ({
                                                    ...prev,
                                                    type: "STUDENT"
                                                }));
                                            }}
                                        >
                                            Learner
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Email text box */}
                            <div className="flex flex-col space-y-2 pt-3">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    required
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-80 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="flex flex-col space-y-2 pt-3">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                                <input
                                    required
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-80 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>




                            {/* Error Message */}
                            {errorMessage && (
                                <div className="text-red-500 text-sm pt-2">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="flex flex-col w-80 pt-6 pb-6 border-b border-gray-300">
                                <button
                                    className={`w-full bg-blue-800 text-white p-3 rounded-2xl hover:bg-blue-600 transition ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isPending}
                                    onClick={handleSubmit}
                                >
                                    {isPending ? "Logging In..." : "Log In"}
                                </button>
                                <p className="pl-2 pt-2"> First time here ? <span><u><a href="/auth/signup" className="text-blue-800 font-semibold"> Sign Up </a></u></span></p>
                            </div>

                            <div className=" mt-6">
                                <GoogleAuthProvider>
                                    <GoogleSignIn role={data.type}></GoogleSignIn>
                                </GoogleAuthProvider>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="w-1/2 relative h-full rounded-full">
                    {/* Add content or background here */}
                    <Image
                        src="/images/engineer.jpg"
                        alt="Sample Image"
                        layout="fill"
                        objectFit="cover">
                    </Image>
                </div>
            </div>
        </div>
    );
}
