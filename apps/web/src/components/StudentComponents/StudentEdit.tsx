'use client'

import { useState, useEffect } from "react";
import { useGetStudentProfile, useUpdateStudentProfile } from "@/hooks/studentProfileHooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChevronLeft, Camera, Loader2, ImageIcon } from "lucide-react";
import StudentEditSkeleton from "@/components/Loaders/StudentEditLoader"
import { toast } from "sonner";
import { studentDataSchema } from "@tutorr/common/schema";
import { z } from "zod";

interface FileType {
  profile_pic: File | null;
  banner_pic: File | null;
}

export default function StudentEdit() {
  const [id, setId] = useState<string>();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [incomingFiles, setIncomingFiles] = useState({
    profile_pic: "",
    banner_pic: "",
  });
  const [files, setFiles] = useState<FileType>({
    profile_pic: null,
    banner_pic: null,
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
      if (!incomingId) return;
      setId(incomingId);
    }
  }, []);

  const { data, isLoading, isError } = useGetStudentProfile(id!);
  const { mutate, isPending } = useUpdateStudentProfile();


  useEffect(() => {
    if (data) {
      setDataToSend({
        name: data.name || "",
        phoneNo: data.phoneNumber || "",
        interests: data.interests || [],
      });
      setIncomingFiles((prev) => ({ ...prev, profile_pic: data.profile_pic }));
      setSelectedInterests(data.interests || []);
    }
  }, [data]);

  const handleInterestClick = (interest: string) => {
    let updated: string[];
    if (selectedInterests.includes(interest)) {
      updated = selectedInterests.filter((i) => i !== interest);
    } else {
      updated = [...selectedInterests, interest];
    }
    setSelectedInterests(updated);
    setDataToSend((prev) => ({ ...prev, interests: updated }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setDataToSend((prev) => ({ ...prev, [id]: value }));
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeInBytes = 2 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        alert("File should be less than 2 MB");
        return;
      }
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        alert("File type should be only jpg, jpeg, or png");
        return;
      }
      setFiles((prev) => ({ ...prev, profile_pic: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const validatedData = studentDataSchema.parse(dataToSend);
      const formData = new FormData();
      formData.append("name", dataToSend.name);
      formData.append("phone_number", dataToSend.phoneNo);
      formData.append("interests", JSON.stringify(dataToSend.interests));
      formData.append("email", data.email);

      if (files.profile_pic) formData.append("profile_pic", files.profile_pic);
      if (files.banner_pic) formData.append("banner_pic", files.banner_pic);

      mutate(formData, {
        onSuccess: () => {
          toast.success("Profile updated successfully ");
        },
        onError: () => {
          toast.error("Failed to update profile. Please try again ");
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
      }
    }
  };

  if (isLoading) {
    return (
      <StudentEditSkeleton />
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 font-medium">Something went wrong...</p>
          <p className="text-gray-500 text-sm mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen b">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className=" shadow:sm px-12 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Create Account</h1>
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

            {/* Left Side - Profile Photo */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative group">
                <Avatar className="w-32 h-32 lg:w-40 lg:h-40 ring-4 ring-white shadow-lg">
                  <AvatarImage
                    src={
                      incomingFiles?.profile_pic
                        ? incomingFiles.profile_pic
                        : files.profile_pic
                          ? URL.createObjectURL(files.profile_pic)
                          : "/images/man.jpg"
                    }
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600">
                    <ImageIcon className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="profilePhoto"
                  className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                >
                  <div className="text-center">
                    <Camera className="w-6 h-6 text-white mx-auto mb-1" />
                    <span className="text-white text-xs font-medium">Change</span>
                  </div>
                </Label>
              </div>

              <Label
                htmlFor="profilePhoto"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full cursor-pointer transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <Camera className="w-4 h-4" />
                Add Profile Photo
              </Label>
              <input
                type="file"
                id="profilePhoto"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                disabled={isPending}
              />
            </div>

            {/* Right Side - Form Fields */}
            <div className="flex-1 space-y-8">

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    value={dataToSend.name}
                    onChange={handleInputChange}
                    disabled={isPending}
                    placeholder="Enter Full Name"
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                  />
                </div>

                {/* Email (if you have it in data) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Email Id
                  </Label>
                  <Input
                    type="email"
                    value={data?.email || ""}
                    disabled
                    placeholder="Enter Email"
                    className="h-11 border-gray-300 bg-gray-50 rounded-lg"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNo" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    type="text"
                    id="phoneNo"
                    value={dataToSend.phoneNo}
                    onChange={handleInputChange}
                    disabled={isPending}
                    placeholder="Enter Phone"
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                  />
                </div>
              </div>

              {/* Interests Section */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">
                  Select Interests
                </Label>
                <div className="flex flex-wrap gap-3">
                  {interests.map((interest, index) => (
                    <Badge
                      key={index}
                      onClick={() => handleInterestClick(interest)}
                      className={cn(
                        "cursor-pointer transition-all duration-200 px-4 py-2 text-sm font-medium capitalize rounded-full border-2",
                        selectedInterests.includes(interest)
                          ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      )}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  );
}