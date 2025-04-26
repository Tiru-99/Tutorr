'use client'

import { useState ,  useEffect } from "react";
import { useRouter } from "next/navigation"; // <- added this
import { useLogin , useIsAuthenticated } from "@/hooks/authHooks";
import Image from "next/image";

export default function Login() {
    const router = useRouter();
    const { mutate, isPending, isSuccess, isError } = useLogin();
    const { data : isAuthenticated , isLoading} = useIsAuthenticated();
    const [errorMessage, setErrorMessage] = useState<string>(""); 
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
          router.push('/');
        }
      }, [isLoading, isAuthenticated, router]);

    console.log(data);

    const handleSubmit = () => {
        
        setErrorMessage(""); // clear error if any
        mutate(data, {
            onSuccess: () => {
                router.push("/"); // <- redirect after success
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
                            <p className="font-semibold text-3xl text-left">Log In </p>
                            <p className="font-thin text-gray pb-2">Enter your credentials to access your account</p>


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
