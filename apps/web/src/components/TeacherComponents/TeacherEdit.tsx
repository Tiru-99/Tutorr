"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, Camera, Upload } from "lucide-react";
import { useGetTeacherDetails, useSaveTeacherDetails } from "@/hooks/teacherProfileHooks";
import TeacherEditSkeleton from "../Loaders/TeacherEditSkeleton";
import { toast } from "sonner";
import { teacherDataSchema } from "@tutorr/common/schema";
import { z } from 'zod';


interface ImageType {
  profile_pic: File | null,
  banner_pic: File | null,
  license: File | null
}

interface FileLinks {
  profile_pic: string,
  banner_pic: string,
  license: string
}
interface TeacherData {
  name: string,
  email: string,
  phone_number: string,
  company_name: string,
  highest_education: string,
  years_of_exp: string,
  about: string,
  expertise: string[],
  price: number,
}

export default function CreateAccountForm({ userId }: { userId: string }) {
  const { data: teacher, isError, isLoading } = useGetTeacherDetails(userId);
  const { mutate, isPending, isError: saveError } = useSaveTeacherDetails();
  const [incomingFiles, setIncomingFiles] = useState<FileLinks>({
    profile_pic: "",
    banner_pic: "",
    license: ""
  })

  const [dataToSend, setDataToSend] = useState<TeacherData>({
    name: teacher?.name || "",
    email: teacher?.user.email || "",
    phone_number: teacher?.phone_number || "",
    company_name: teacher?.company_name || "",
    highest_education: teacher?.highest_education || "",
    years_of_exp: teacher?.years_of_exp || "",
    about: teacher?.about || "",
    expertise: teacher?.expertise || "",
    price: teacher?.price || 0
  })
  const [files, setFiles] = useState<ImageType>({
    profile_pic: null,
    banner_pic: null,
    license: null
  })
  const [selectedExpertise, setSelectedExpertise] = useState(["English", "Maths", "History"])
  //useEffect 
  useEffect(() => {
    if (teacher) {
      setDataToSend({
        name: teacher?.name || "",
        email: teacher?.user.email || "",
        phone_number: teacher?.phone_number || "",
        company_name: teacher?.company_name || "",
        highest_education: teacher?.highest_education || "",
        years_of_exp: teacher?.years_of_exp || "",
        about: teacher?.about || "",
        expertise: teacher?.expertise || "",
        price: teacher?.price || null,
      });

      if (teacher?.license) {
        setIncomingFiles((prev) => ({ ...prev, license: teacher.license }));
      }
      if (teacher?.profile_pic) {
        setIncomingFiles((prev) => ({ ...prev, profile_pic: teacher.profile_pic }));
      }
      if (teacher?.banner_pic) {
        setIncomingFiles((prev) => ({
          ...prev,
          banner_pic: teacher.banner
        }))
      }

      setSelectedExpertise(teacher?.expertise);
    }
  }, [teacher])
  //refs 
  const fileRef = useRef<HTMLInputElement | null>(null);

  const expertiseOptions = ["English", "Maths", "History", "I.T", "Development", "Geography"];

  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(expertise) ? prev.filter((item) => item !== expertise) : [...prev, expertise],
    )
  }


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
      setFiles((prev) => ({ ...prev, profile_pic: file }));
    }

  };

  const handleFileClick = () => {
    if (!fileRef.current) {
      return;
    }
    fileRef.current?.click()
  }

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

      if (file.size > maxSizeInBytes) {
        alert("File should be less than 2 MB");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

      if (!allowedTypes.includes(file.type)) {
        alert("File type should be only jpg, jpeg, png, or pdf");
        return;
      }

      setFiles((prev) => ({ ...prev, license: file }));
    }
  };
  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const validatedData = teacherDataSchema.parse(dataToSend);

      const finalDataToSend: TeacherData =
      {
        ...dataToSend,
        expertise: selectedExpertise,
      }

      console.log("final data to send is", finalDataToSend);

      const formData = new FormData();
      //do formAppend logically instead of writing each line manually
      Object.keys(finalDataToSend).forEach((key) => {
        const value = finalDataToSend[key as keyof TeacherData];
        //form append for arrays
        if (Array.isArray(value) || typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      //to append files 
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      // To check the formData content:
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      mutate(formData, {
        onSuccess: () => {
          toast.success("Changes saved sucessfully !")
        },
        onError: () => {
          toast.error("Something went wrong while saving")
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
      }
    }

  };

  if (isLoading) {
    return <TeacherEditSkeleton />
  }
  if (isError) {
    return <div>Something went wrong while loading</div>
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-gray-50 p-4 flex justify-center">
        <div className="w-full  bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Create Account</h1>
            </div>
            <button type="submit" className={`${isPending ? "bg-gray-500 " : "bg-blue-600"} text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors`}>
              {isPending ? "Saving" : "Save"}
            </button>
          </div>

          <div className="p-4 md:p-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Profile Photo Section */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-3 overflow-hidden">
                  {(files?.profile_pic || incomingFiles.profile_pic) ? (
                    <img
                      src={files.profile_pic ? URL.createObjectURL(files?.profile_pic) : incomingFiles.profile_pic}
                      alt="Profile Picture"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-600" />
                  )}
                </div>


                <input
                  type="file"
                  id="profilePicInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePhotoChange}
                />

                <label
                  htmlFor="profilePicInput"
                  className="text-sm text-blue-600 hover:text-white hover:bg-blue-600 border
                          border-blue-600 px-4 py-2 rounded-full 
                          transition-colors duration-200">
                  Add Profile Photo

                </label>


              </div>


              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                {/* First Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={dataToSend.name}
                      onChange={(e) => setDataToSend((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Id</label>
                    <input
                      type="email"
                      placeholder="Enter email Id"
                      value={dataToSend.email}
                      disabled
                      className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-500 hover:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter phone"
                      value={dataToSend.phone_number}
                      onChange={(e) => setDataToSend((prev) => ({ ...prev, phone_number: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name of Employer</label>
                    <input
                      type="text"
                      placeholder="Enter Name of Employer"
                      value={dataToSend.company_name}
                      onChange={(e) => setDataToSend((prev) => ({ ...prev, company_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter Highest Education</label>
                    <input
                      type="text"
                      placeholder="Enter"
                      value={dataToSend.highest_education}
                      onChange={(e) => setDataToSend((prev) => ({ ...prev, highest_education: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter Years of Experience</label>
                    <input
                      type="text"
                      placeholder="Enter Experience"
                      value={dataToSend.years_of_exp}
                      onChange={(e) => setDataToSend((prev) => ({ ...prev, years_of_exp: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* About Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                  <textarea
                    placeholder="Enter About"
                    rows={3}
                    value={dataToSend.about}
                    onChange={(e) => setDataToSend((prev) => ({ ...prev, about: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="w-full max-w-xs">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name your price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="Enter price in USD"
                      value={dataToSend.price}
                      onChange={(e) => setDataToSend((prev) => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                </div>


                {/* Upload License */}
                <div>
                  <input
                    type="file"
                    id="uploadLicense"
                    ref={fileRef}
                    accept="image/* , application/pdf"
                    className="hidden"
                    onChange={handleLicenseChange}
                  />
                  <label htmlFor="uploadLicense" className="block text-sm font-medium text-gray-700 mb-2">Upload License</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                    onClick={handleFileClick}>
                    {files.license ? (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Selected File:</p>
                        <p className="text-sm text-gray-500">{files.license.name}</p>

                        <button
                          className="bg-red-500 text-white mt-2 hover:border hover:border-red-500 hover:text-red-500 hover:bg-white transition ease-in py-1 px-2 rounded-xl text-xs"
                          onClick={() => setFiles((prev) => ({ ...prev, license: null }))}> Remove
                        </button>

                      </div>
                    ) : (
                      <>
                        {incomingFiles.license ? (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Uploaded License:</p>
                            <p className="text-sm text-gray-500">{incomingFiles.license.slice(0, 20)}..</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              Upload License (Format: PDF, PNG, JPG)
                            </p>
                          </>
                        )}
                      </>

                    )}
                  </div>
                </div>

                {/* Select Expertise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Expertise</label>
                  <div className="flex flex-wrap gap-2">
                    {expertiseOptions.map((expertise) => (
                      <button
                        type="button"
                        key={expertise}
                        onClick={() => toggleExpertise(expertise)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedExpertise.includes(expertise)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        {expertise}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
