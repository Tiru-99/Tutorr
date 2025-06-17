"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Filter, CalendarIcon} from "lucide-react"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useGetTeachersByQuery, useGetAllTeachers } from "@/hooks/queryHook"
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Teacher } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"; 

export default function Component() {
  const [date, setDate] = useState<Date>();
  const subjects = ["History", "Development", "Maths", "Geography", "IT"];
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [teacherData, setTeacherData] = useState<Teacher[]>([]);

  //router 
  const router = useRouter(); 

  //api hook 
  const { mutate, isPending, isError, isSuccess } = useGetTeachersByQuery();
  const { data, isLoading, isError: fetchError } = useGetAllTeachers();
  console.log("The get teacher data is ", data);
  //useEffect to fetch all the teachers 
  useEffect(() => {
    if (data) {
      setTeacherData(data.teachers);
    }
  }, [data]);

  const handleCheckboxChange = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((item) => item !== subject)
        : [...prev, subject]
    );
  };

  const handleApplyFilters = () => {
    let timeToSend
    if (selectedTime === "morning") {
      timeToSend = ["8:00 AM ", "9:00 AM", "10:00 AM", "11:00 AM"];
    } else if (selectedTime === "afternoon") {
      timeToSend = ["12:00 PM ", "1:00 PM", "2:00 PM", "3:00 PM"];
    } else if (selectedTime === "evening") {
      timeToSend = ["4:00 PM ", "5:00 PM", "6:00 PM ", "8:00 PM "];
    } else {
      timeToSend = ["4:00 PM ", "5:00 PM", "6:00 PM ", "8:00 PM "];
      timeToSend = [
        "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
        "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
        "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
      ];
    }


    const dataToSend = {
      date: date || null,
      topic: selectedSubjects || null,
      time: timeToSend || null,
      price: priceRange || null,
      name: searchQuery || null
    }

    mutate(dataToSend, {
      onSuccess: (data) => {
        setTeacherData(data.teachers);
      }
      //TODO : add an onerror here 
    });
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Listings for "Software Development"</h1>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">


            {/* Mobile Filter Button */}
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="p-6">
                  <SheetTitle className="flex items-center gap-2 mb-6">
                    <Filter className="w-4 h-4" />
                    <span className="font-semibold text-gray-900">Filters</span>
                  </SheetTitle>
                  {/* Filter content will be moved here */}
                  <div className="space-y-6">
                    {/* Mobile Search Bar */}
                    <div className="relative w-full sm:max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Search tutors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    {/* Price Range */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Price Range ($)</h3>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={500}
                        min={0}
                        step={10}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>$ {priceRange[0]}</span>
                        <span>$ {priceRange[1]}</span>
                      </div>
                    </div>

                    {/* Experience Level to implement this later  */}
                    {/* <div>
                      <h3 className="font-medium text-gray-900 mb-3">Experience</h3>
                      <div className="space-y-2">
                        {["0-2 years", "3-5 years", "6-10 years", "10+ years"].map((exp) => (
                          <div key={exp} className="flex items-center space-x-2">
                            <Checkbox id={`mobile-${exp}`} />
                            <label htmlFor={`mobile-${exp}`} className="text-sm text-gray-700">
                              {exp}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div> */}

                    {/* Rating To do : Implement rating based filter  */}
                    {/* <div>
                      <h3 className="font-medium text-gray-900 mb-3">Rating</h3>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <Checkbox id={`mobile-rating-${rating}`} />
                            <label
                              htmlFor={`mobile-rating-${rating}`}
                              className="flex items-center text-sm text-gray-700"
                            >
                              <span className="mr-1">{rating}</span>
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1">& up</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div> */}

                    {/* Subjects */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Subjects</h3>
                      <div className="space-y-2">
                        {subjects.map((subject) => (
                          <div key={subject} className="flex items-center space-x-2">
                            <Checkbox id={`mobile-${subject}`} onCheckedChange={() => handleCheckboxChange(subject)} checked={selectedSubjects.includes(subject)} />
                            <label htmlFor={`mobile-${subject}`} className="text-sm text-gray-700">
                              {subject}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
                      <Select onValueChange={(value) => setSelectedTime(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full" onClick={handleApplyFilters}>Apply Filters</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-4 h-4" />
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                </div>

                <div className="space-y-6">
                  {/* Search Bar  */}
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search By Name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Price Range ($)</h3>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      min={0}
                      step={10}
                      className="mb-2 cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>$ {priceRange[0]}</span>
                      <span>$ {priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Experience Level */}
                  {/* <div>
                    <h3 className="font-medium text-gray-900 mb-3">Experience</h3>
                    <div className="space-y-2">
                      {["0-2 years", "3-5 years", "6-10 years", "10+ years"].map((exp) => (
                        <div key={exp} className="flex items-center space-x-2">
                          <Checkbox id={exp} />
                          <label htmlFor={exp} className="text-sm text-gray-700">
                            {exp}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div> */}

                  {/* Rating  : To do : Implement this rating based feature */}
                  {/* <div>
                    <h3 className="font-medium text-gray-900 mb-3">Rating</h3>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox id={`rating-${rating}`} />
                          <label htmlFor={`rating-${rating}`} className="flex items-center text-sm text-gray-700">
                            <span className="mr-1">{rating}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1">& up</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div> */}


                  {/* Subjects */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Subjects</h3>
                    <div className="space-y-2">
                      {subjects.map((subject) => (
                        <div key={subject} className="flex items-center space-x-2">
                          <Checkbox id={subject} onCheckedChange={() => handleCheckboxChange(subject)} checked={selectedSubjects.includes(subject)} />
                          <label htmlFor={subject} className="text-sm text-gray-700">
                            {subject}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
                    <Select onValueChange={(value) => setSelectedTime(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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

                  <Button className="cursor-pointer w-full" onClick={handleApplyFilters}> Apply Filters </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tutor Grid */}
          <div className="flex-1 w-full">
            {/* Loader */}
            {!isPending && !isLoading && teacherData.length == 0 &&
              <div className="flex items-center justify-center h-full w-full text-3xl font-bold text-gray-700">
                No Teachers Available
              </div>
            }

            {//Loader 
              (isPending || isLoading) && (
                <div className="flex items-center justify-center h-full w-full text-3xl font-bold text-gray-700">
                  <Loader2 className="animate-spin"></Loader2>
                </div>
              )
            }

            {/* Conditional Teacher Rendering */}
            {teacherData && !isLoading && !isPending && <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6">
              {teacherData.map((tutor) => (
                <Card key={tutor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative w-full">
                    {/* Banner Image */}
                    <Image
                      src={tutor.banner_pic || "/images/banner.jpg"}
                      alt="Banner"
                      width={600}
                      height={200}
                      className="w-full h-40 sm:h-48 object-cover rounded-t-xl -mt-6"
                    />

                    {/* Profile Image - Perfect Circle, Overlapping Banner */}
                    <div className="absolute left-4 -bottom-12 w-24 h-24">
                      <Image
                        src={tutor.profile_pic || "/placeholder-profile.jpg"}
                        alt={tutor.name || "Profile picture"}
                        fill
                        className="rounded-full object-cover border-4 border-white shadow-md"
                      />
                    </div>
                  </div>

                  <CardContent className="sm:p-4 mt-6">
                    <div className="space-y-2 sm:space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                        <p className="text-sm text-gray-600">{tutor.years_of_exp} years</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{tutor.average_rating || "4.5"}</span>
                        <span className="text-sm text-gray-500">(127)</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {tutor.expertise.slice(0 , 3).map((subject) => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {tutor.expertise.length > 3 && <Badge variant="secondary" className="text-xs">
                          +{tutor.expertise.length - 3 }
                        </Badge>}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">{tutor.about}</p>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            $ {tutor.price}
                          </span>
                          <span className="text-sm text-gray-500">/session</span>
                        </div>
                      </div>

                      <Button
                       className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                       onClick={() => router.push(`/booking/teacher/${tutor.id}`)}>Book Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>}
          </div>
        </div>
      </div>
    </div>
  )
}
