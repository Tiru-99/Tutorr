"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, Camera, Upload } from "lucide-react";
import { useGetTeacherDetails, useSaveTeacherDetails } from "@/hooks/teacherProfileHooks";
import { DateTime } from 'luxon';


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
  session_duration: string,
  start_time: string,
  end_time: string,
  available_days: string[],
  price: number,
  timezone: string,
}

export default function CreateAccountForm({ userId }: { userId: string }) {
  const { data: teacher, isError, isLoading } = useGetTeacherDetails(userId);
  const { mutate, isPending, isError: saveError } = useSaveTeacherDetails();
  const [incomingFiles, setIncomingFiles] = useState<FileLinks>({
    profile_pic: "",
    banner_pic: "",
    license: ""
  })
  const timezones = Intl.supportedValuesOf("timeZone");
  const [dataToSend, setDataToSend] = useState<TeacherData>({
    name: teacher?.name || "",
    email: teacher?.user.email || "",
    phone_number: teacher?.phone_number || "",
    company_name: teacher?.company_name || "",
    highest_education: teacher?.highest_education || "",
    years_of_exp: teacher?.years_of_exp || "",
    about: teacher?.about || "",
    expertise: teacher?.expertise || "",
    session_duration: teacher?.session_duration || "",
    start_time: teacher?.start_time || "",
    end_time: teacher?.end_time || "",
    available_days: teacher?.available_days || "",
    price: teacher?.price || null,
    timezone: teacher?.timezone || null
  })
  const [files, setFiles] = useState<ImageType>({
    profile_pic: null,
    banner_pic: null,
    license: null
  })
  const [selectedExpertise, setSelectedExpertise] = useState(["English", "Maths", "History"])
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [sessionTime, setSessionTime] = useState("1 Hour")
  const [startTime, setStartTime] = useState({ hour: "06", minute: "00" })
  const [endTime, setEndTime] = useState({ hour: "12", minute: "00" })

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
        session_duration: teacher?.session_duration || "",
        start_time: teacher?.start_time || "",
        end_time: teacher?.end_time || "",
        available_days: teacher?.available_days || "",
        price: teacher?.price || null,
        timezone: teacher?.timezone || null
      });
      if (teacher?.start_time) {
        const dt = DateTime.fromISO(teacher.start_time, { zone: "utc" }).toLocal();
        setStartTime({
          hour: dt.hour.toString().padStart(2, '0'),
          minute: dt.minute.toString().padStart(2, '0')
        });
      }

      if (teacher?.end_time) {
        const dt = DateTime.fromISO(teacher.end_time, { zone: "utc" }).toLocal();
        setEndTime({
          hour: dt.hour.toString().padStart(2, '0'),
          minute: dt.minute.toString().padStart(2, '0')
        });
      }

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
      setSelectedDays(teacher?.available_days);
      if (teacher?.startTime) {
        setStartTime({
          hour: teacher.startTime.slice(0, 2),
          minute: teacher.startTime.slice(2, 4),
        });
      }
      if (teacher?.endTime) {
        setStartTime({
          hour: teacher.endTime.slice(0, 2),
          minute: teacher.endTime.slice(2, 4)
        })
      }
    }
  }, [teacher])
  //refs 
  const fileRef = useRef<HTMLInputElement | null>(null);

  const expertiseOptions = ["English", "Maths", "History", "I.T", "Development", "Geography"];
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT"]

  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(expertise) ? prev.filter((item) => item !== expertise) : [...prev, expertise],
    )
  }

  const toggleDays = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]);
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

  const validateTime = ({ hour, minute }: { hour: number; minute: number }) => {
    if (hour < 0 || hour > 24) {
      return "Please enter a correct hour value (0–24)";
    }
    if (minute < 0 || minute >= 60) {
      return "Please enter a correct minute value (0–59)";
    }
    if (hour == 23 && minute === 60) {
      return "Mai Pagal dikhta hu kya bsdk!"
    }
    if (hour == 24) {
      return "Pagal lavde !"
    }
    return null; // valid
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const startHour = parseInt(startTime.hour, 10);
    const startMinute = parseInt(startTime.minute, 10);

    const errorMessage = validateTime({ hour: startHour, minute: startMinute });

    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    const endHour = parseInt(endTime.hour, 10);
    const endMinute = parseInt(endTime.minute, 10);

    const errorMessage2 = validateTime({ hour: endHour, minute: endMinute });

    if (errorMessage2) {
      alert(errorMessage2);
      return;
    }

    if (startHour > endHour) {
      alert("Invalid starting and ending  times");
      return;
    }

    if (selectedDays.length === 0) {
      alert("Please choose Avaiable days");
      return;
    }

    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localStartTime = DateTime.fromObject(
      { hour: startHour, minute: startMinute },
      { zone: zone }
    );

    const finalStartTime = localStartTime.toUTC().toISO();

    const localEndTime = DateTime.fromObject(
      { hour: endHour, minute: endMinute },
      { zone: zone }
    )

    const finalEndTime = localEndTime.toUTC().toISO();

    if (!finalStartTime || !finalEndTime) {
      return null;
    }

    const finalDataToSend: TeacherData =
    {
      ...dataToSend,
      start_time: finalStartTime,
      end_time: finalEndTime,
      available_days: selectedDays,
      expertise: selectedExpertise,
      session_duration: sessionTime
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

    mutate(formData);
    // ✅ continue with submission logic here
  };



  console.log("The data is", dataToSend)
  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name your price</label>
                  <input
                    type="number"
                    placeholder="Enter price in USD"
                    value={dataToSend.price}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs"
                    onChange={(e) => setDataToSend((prev) => ({ ...prev, price: Number(e.target.value) }))}
                  />
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

                {/* Select Timezone  */}
                <div>
                  <label htmlFor="timezone">Select Timezone: </label>
                  <select
                    id="timezone"
                    value={dataToSend.timezone}
                    onChange={(e) => setDataToSend((prev) => ({...prev , timezone : e.target.value}))}
                  >
                    <option value="">-- Select a Timezone --</option>
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>

                  {dataToSend.timezone && <p>Selected: {dataToSend.timezone}</p>}
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Availability</label>

                  {/* Session Time */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">Session Time:</span>
                      <select
                        value={sessionTime}
                        onChange={(e) => setSessionTime(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>1 Hour</option>
                        <option>2 Hours</option>
                        <option>3 Hours</option>
                      </select>
                    </div>
                  </div>

                  {/* Timings */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Timings (24 Hour Clock Format)</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={startTime.hour}
                          onChange={(e) => setStartTime({ ...startTime, hour: e.target.value })}
                          className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-500">:</span>
                        <input
                          type="text"
                          value={startTime.minute}
                          onChange={(e) => setStartTime({ ...startTime, minute: e.target.value })}
                          className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-500 mx-2">TO</span>
                        <input
                          type="text"
                          value={endTime.hour}
                          onChange={(e) => setEndTime({ ...endTime, hour: e.target.value })}
                          className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-500">:</span>
                        <input
                          type="text"
                          value={endTime.minute}
                          onChange={(e) => setEndTime({ ...endTime, minute: e.target.value })}
                          className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Availability</label>
                    <div className="flex flex-wrap gap-2">
                      {days.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDays(day)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedDays.includes(day)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
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
