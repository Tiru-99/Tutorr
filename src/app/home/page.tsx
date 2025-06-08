"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, BookOpen, Users, Clock, Star } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useGetTeachersByQuery } from "@/hooks/queryHook";


export default function Component() {
  const [date, setDate] = useState<Date>();
  const [selectedTopic, setSelectedTopic] = useState<string>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>();
  //api hook 
  const { mutate, isPending, isError } = useGetTeachersByQuery();
  // Generate time options from 12:00 AM to 11:59 PM
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 60) {
        const time12 = new Date();
        time12.setHours(hour, minute, 0, 0);

        const timeString = time12.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        times.push({
          value: timeString, // e.g., "8:00 AM"
          label: timeString, // same for display
        });
      }
    }
    return times;
  };


  const timeOptions = generateTimeOptions();
  console.log("The date is ", typeof (date));
  //on click functions 
  const handleSearch = () => {
    //check 
    if (!date || !selectedTimeSlot || !selectedTopic) {
      alert("Please fill all the fields ");
      return;
    }

    const dataToSend = {
      date,
      time: selectedTimeSlot,
      topic: selectedTopic
    }

    console.log("the data to send is", dataToSend);

    mutate(dataToSend);
  }

  useEffect(() => {
    if (isError) {
      alert("Something went wrong!");
    }
  }, [isError]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4 mr-2" />
                  #1 Tutoring Platform
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Master Any Subject with{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    TuTr
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with expert tutors and unlock your potential. Personalized learning that fits your schedule.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 max-w-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Find Your Perfect Tutor</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <Select onValueChange={(value) => setSelectedTopic(value)}>
                      <SelectTrigger className="w-full h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Pick a Topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Maths">Maths</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="IT">I.T</SelectItem>
                        <SelectItem value="Development">Development</SelectItem>
                        <SelectItem value="Geography">Geography</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 justify-start text-left font-normal border-gray-200 focus:border-purple-500",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "MMM dd") : <span>Select Date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => isBefore(date, new Date())}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <Select onValueChange={(value) => setSelectedTimeSlot(value)}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="Select Time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {timeOptions.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleSearch}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                    See Listings
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-2xl opacity-20" />
              <Image
                src="/images/home1.jpg"
                alt="Tutor helping child with studies"
                width={700} // was 600
                height={600} // was 500
                className="relative rounded-2xl object-cover shadow-2xl"
              />

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TuTr?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of personalized learning with our innovative platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Tutors</h3>
              <p className="text-gray-600">Learn from certified professionals with years of teaching experience</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Schedule</h3>
              <p className="text-gray-600">Book sessions that fit your lifestyle and learning preferences</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Learning</h3>
              <p className="text-gray-600">Customized lessons tailored to your unique learning style and goals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-2xl opacity-20" />
              <Image
                src="/images/home2.jpg"
                alt="Tutor working with student"
                width={600}
                height={500}
                className="relative rounded-2xl object-cover shadow-2xl"
              />
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Learn When{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    You Want
                  </span>
                  , Earn What{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    You Need
                  </span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Take control of your learning journey with our flexible platform. Whether you're a student seeking
                  knowledge or a tutor sharing expertise, TuTr adapts to your schedule and goals.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Choose Your Schedule</h4>
                    <p className="text-gray-600">Book sessions that work with your busy lifestyle</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Connect with Experts</h4>
                    <p className="text-gray-600">Access qualified tutors in your subject area</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Achieve Your Goals</h4>
                    <p className="text-gray-600">Track progress and celebrate your success</p>
                  </div>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                Discover More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Third Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  The Future is Here
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Home Learning is the{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Future
                  </span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Embrace personalized education that adapts to every child's unique needs. Our platform makes
                  homeschooling accessible, effective, and engaging for families worldwide.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100">
                <h4 className="font-semibold text-gray-900 mb-3">Perfect for Special Needs</h4>
                <p className="text-gray-600">
                  Customize curriculum and teaching methods to accommodate unique learning styles, ensuring every child
                  receives the support they need to thrive academically.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                  Get Started Today
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Explore Solutions
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-2xl opacity-20" />
              <Image
                src="/images/home3.jpg"
                alt="Child studying at home"
                width={600}
                height={500}
                className="relative rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
