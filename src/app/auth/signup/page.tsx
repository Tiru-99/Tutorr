'use client'

import { useState } from "react";
import { useRouter } from "next/navigation"; // <- added this
import { useSignup } from "@/hooks/authHooks";
import Image from "next/image";

export default function Signup() {
    const router = useRouter(); // <- initialize router
    const { mutate, isPending, isSuccess, isError } = useSignup();
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>(""); // <- added for error
    const [isTutor, setIsTutor] = useState<boolean>(false);
    const [data, setData] = useState({
        email: "",
        password: "",
        name: "",
        type: "STUDENT"
    });

    console.log(data);

    const handleSubmit = () => {
        if (confirmPassword !== data.password) {
            setErrorMessage("Passwords do not match!");
            return;
        }
        setErrorMessage(""); // clear error if any
        mutate(data, {
            onSuccess: () => {
                router.push("/auth/login"); // <- redirect after success
            },
            onError: (err : any) => {
                setErrorMessage(err); // optional extra error handling
                const error = err?.response?.data?.message || err?.message || "An error occurred";
                setErrorMessage(error); // Display the error message from backend or generic message
            }
        });
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
                            <p className="font-semibold text-3xl text-left">Sign Up</p>
                            <p className="font-thin text-gray pb-2">Enter your credentials to create your account</p>

                            {/* Toggle Bar */}
                            <div className="h-10 w-60 rounded-full bg-gray-100 p-1 shadow-inner">
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

                            <div className="flex w-full pt-4">
                                <button
                                    className={`w-full bg-blue-800 text-white p-3 rounded-2xl hover:bg-blue-600 transition ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isPending}
                                    onClick={handleSubmit}
                                >
                                    {isPending ? "Signing Up..." : "Sign Up"}
                                </button>
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
