'use client'

import { useState, useEffect } from "react";
import { useGetStudentProfile } from "@/hooks/studentProfileHooks";
import { useUpdateStudentProfile } from "@/hooks/studentProfileHooks";

interface FileType {
    profile_pic : File  | null ;
    banner_pic : File | null ;
}

export default function StudentEdit() {
    const [id, setId] = useState<string>();
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [incomingFiles , setIncomingFiles] = useState({
        profile_pic :"",
        banner_pic : ""
    })
    const [files , setFiles] = useState<FileType>({
        profile_pic : null , 
        banner_pic : null 
    });
    const [dataToSend, setDataToSend] = useState({
        name: "",
        phoneNo: "",
        interests: [] as string[],
    });
    

    const interests = ["science", "maths", "geography", "physics"];

    useEffect(() => {
        if (typeof window !== "undefined") {
            const incomingId = localStorage.getItem("userId");
            if (!incomingId) {
                console.log("No id in localstorage found in student edit profile");
                return;
            }
            setId(incomingId);
        }
    }, []);

    const { data, isLoading, isError } = useGetStudentProfile(id!);
    const { mutate , isPending , isError: updateError } = useUpdateStudentProfile(); 
    console.log("The data to send is " , dataToSend);
    useEffect(() => {
        if (data) {
            console.log("The incoming data is" , data);
            setDataToSend({
                name: data.name || "",
                phoneNo: data.phoneNumber || "",
                interests: data.interests || [],
            });
            setIncomingFiles((prev) => ({...prev , profile_pic : data.profile_pic}));
            setSelectedInterests(data.interests || []);
        }
    }, [data]);

    const handleInterestClick = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            const updated = selectedInterests.filter((item) => item !== interest);
            setSelectedInterests(updated);
            setDataToSend(prev => ({ ...prev, interests: updated }));
        } else {
            const updated = [...selectedInterests, interest];
            setSelectedInterests(updated);
            setDataToSend(prev => ({ ...prev, interests: updated }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setDataToSend((prev) => ({ ...prev, [id]: value }));
    };

    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            //code to check if the file size is less than 2 MB 
            const maxSizeInBytes = 2 * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                alert("File should be less than 2 MB");
                return;
            }
            if (
                file.type !== "image/jpeg" &&
                file.type !== "image/png" &&
                file.type !== "image/jpg"
            ) {
                alert("File type should be only jpg, jpeg, or png");
                return;
            }
            setFiles((prev) => ({...prev , profile_pic : file})); 
            const reader = new FileReader();
            reader.onloadend = () => {
                setDataToSend((prev) => ({ ...prev, profile_pic: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
      
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(); 

        formData.append("name", dataToSend.name);
        formData.append("phone_number", dataToSend.phoneNo);
        const interestToSend = JSON.stringify(dataToSend.interests);
        formData.append("interests", interestToSend);
        formData.append("email" , data.email);
        if(files.profile_pic){
            formData.append("profile_pic" , files.profile_pic)
        }

        if(files.banner_pic){
            formData.append("banner_pic" , files.banner_pic );
        }

        mutate(formData);
    };

    // 🌟 Full page loader while loading profile
    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
    );

    if (isError) return <div>Something went wrong...</div>;

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <div className="flex justify-end p-8">
                        <button
                            type="submit"
                            className="bg-blue-400 rounded-2xl text-white px-6 py-2 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isPending}
                        >
                            {isPending ? "Saving..." : "Save"}
                        </button>
                    </div>

                    <div className="flex md:flex-row flex-col justify-center md:gap-12 gap-2">
                        <div className="flex flex-col items-center">
                            <div className="h-40 w-40 bg-gray-200 rounded-full cursor-pointer overflow-hidden">
                                <img
                                    // if the incoming profile file is there display it if not display the state file , 
                                    // if state file is not also present then show the default image
                                    src={
                                        incomingFiles?.profile_pic 
                                        ? incomingFiles.profile_pic 
                                        : (files.profile_pic 
                                            ? URL.createObjectURL(files.profile_pic) 
                                            : "/images/man.jpg")
                                    }
                                    
                                    alt="Profile"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="flex flex-col items-center mt-2">
                                <label
                                    htmlFor="profilePhoto"
                                    className={`cursor-pointer px-4 py-2 ${isPending ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded-md hover:bg-blue-600 transition`}
                                >
                                    Add Profile Photo
                                </label>
                                <input
                                    type="file"
                                    id="profilePhoto"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleProfilePhotoChange}
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-col md:flex-row md:gap-6 items-center">
                                {/* Name text box */}
                                <div className="flex flex-col">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={dataToSend.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                        disabled={isPending}
                                        className="w-80 p-3 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
                                    />
                                </div>

                                {/* Phone Number box */}
                                <div className="flex flex-col">
                                    <label htmlFor="phoneNo" className="text-sm md:mt-0 mt-2 font-medium text-gray-700">Phone No.</label>
                                    <input
                                        type="text"
                                        id="phoneNo"
                                        value={dataToSend.phoneNo}
                                        onChange={handleInputChange}
                                        placeholder="Enter your Phone Number"
                                        disabled={isPending}
                                        className="w-80 p-3 rounded-lg border mt-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-center md:text-start">Select Interests</h3>
                                <div className="flex flex-wrap flex-row md:justify-start mt-2 md:mt-1 justify-center gap-2">
                                    {interests.map((interest, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleInterestClick(interest)}
                                            className={`border cursor-pointer rounded-full px-4 py-1 ${selectedInterests.includes(interest)
                                                ? "bg-blue-400 text-white border-blue-400"
                                                : "border-gray-400"
                                                } ${isPending ? "pointer-events-none opacity-50" : ""}`}
                                        >
                                            {interest}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
