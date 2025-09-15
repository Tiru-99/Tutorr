'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignup } from "@/hooks/authHooks";
import Image from "next/image";
import { GoogleSignIn } from "@/components/Common/GoogleSignIn";
import GoogleAuthProvider from "@/components/Common/GoogleAuthProvider";
import { z } from 'zod';
import { signupSchema } from "@tutorr/common/schema";
import { toast } from "sonner";

export default function Signup() {
    const router = useRouter();
    const { mutate, isPending, isSuccess, isError } = useSignup();
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isTutor, setIsTutor] = useState<boolean>(false);
    const [data, setData] = useState({
        email: "",
        password: "",
        name: "",
        type: "STUDENT"
    });

    console.log(data);

    const handleSubmit = () => {
        try {
            const validatedData = signupSchema.parse(data);
            if (confirmPassword !== data.password) {
                setErrorMessage("Passwords do not match!");
                return;
            }
            setErrorMessage("");
            mutate(validatedData, {
                onSuccess: () => {
                    router.push("/auth/login");
                },
                onError: (err: any) => {
                    setErrorMessage(err);
                    const error = err?.response?.data?.message || err?.message || "An error occurred";
                    setErrorMessage(error);
                }
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
                            <p className="font-bold text-3xl text-left">SIGN UP</p>
                            <p className="font-thin text-gray-600 mt-2 pb-2">Enter your credentials to create your account</p>

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

                            {/* Name text box */}
                            <div className="flex flex-col space-y-2 pt-3">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter your name"
                                    onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-80 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Email text box */}
                            <div className="flex flex-col space-y-2 pt-3">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                                <input
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
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-80 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Confirm Password Input */}
                            <div className="flex flex-col space-y-2 pt-3">
                                <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    placeholder="Confirm Password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-80 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Error Message */}
                            {errorMessage && (
                                <div className="text-red-500 text-sm pt-2">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="flex flex-col w-full pt-5 pb-6 border-b border-gray-300">
                                <button
                                    className={`w-full bg-blue-800 text-white p-3 rounded-2xl hover:bg-blue-600 transition ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isPending}
                                    onClick={handleSubmit}
                                >
                                    {isPending ? "Signing Up..." : "Sign Up"}
                                </button>
                                <p className="pl-2 pt-2"> Already Registered ? <span><u><a href="/auth/login" className="text-blue-800 font-semibold"> Log In </a></u></span></p>
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
