"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Search, Star, Filter } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
//things to send to backend
//money range , 
//subjects 
//Availability - Morning , Afternoon , Evening 
export default function Component() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Mock tutor data
  const tutors = [
    {
      id: 1,
      name: "Alison Jones",
      experience: "15 Years of Experience",
      rating: 4.9,
      reviews: 127,
      price: 240,
      currency: "AED",
      image: "/placeholder.svg?height=200&width=200",
      subjects: ["Java", "JavaScript", "C++"],
      description: "Learn about object-oriented programming. Get help on your assignments and projects.",
    },
    {
      id: 2,
      name: "Alison Jones",
      experience: "15 Years of Experience",
      rating: 4.9,
      reviews: 127,
      price: 240,
      currency: "AED",
      image: "/placeholder.svg?height=200&width=200",
      subjects: ["Java", "JavaScript", "C++"],
      description: "Learn about object-oriented programming. Get help on your assignments and projects.",
    },
    {
      id: 3,
      name: "Alison Jones",
      experience: "15 Years of Experience",
      rating: 4.9,
      reviews: 127,
      price: 240,
      currency: "AED",
      image: "/placeholder.svg?height=200&width=200",
      subjects: ["Java", "JavaScript", "C++"],
      description: "Learn about object-oriented programming. Get help on your assignments and projects.",
    },
    {
      id: 4,
      name: "Alison Jones",
      experience: "15 Years of Experience",
      rating: 4.9,
      reviews: 127,
      price: 240,
      currency: "AED",
      image: "/placeholder.svg?height=200&width=200",
      subjects: ["Java", "JavaScript", "C++"],
      description: "Learn about object-oriented programming. Get help on your assignments and projects.",
    },
    {
      id: 5,
      name: "Alison Jones",
      experience: "15 Years of Experience",
      rating: 4.9,
      reviews: 127,
      price: 240,
      currency: "AED",
      image: "/placeholder.svg?height=200&width=200",
      subjects: ["Java", "JavaScript", "C++"],
      description: "Learn about object-oriented programming. Get help on your assignments and projects.",
    },
    {
      id: 6,
      name: "Alison Jones",
      experience: "15 Years of Experience",
      rating: 4.9,
      reviews: 127,
      price: 240,
      currency: "AED",
      image: "/placeholder.svg?height=200&width=200",
      subjects: ["Java", "JavaScript", "C++"],
      description: "Learn about object-oriented programming. Get help on your assignments and projects.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Listings for "Software Development"</h1>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
                        {["Java", "JavaScript", "Python", "C++", "React", "Node.js"].map((subject) => (
                          <div key={subject} className="flex items-center space-x-2">
                            <Checkbox id={`mobile-${subject}`} />
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
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                      {["Java", "JavaScript", "Python", "C++", "React", "Node.js"].map((subject) => (
                        <div key={subject} className="flex items-center space-x-2">
                          <Checkbox id={subject} />
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
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tutor Grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6">
              {tutors.map((tutor) => (
                <Card key={tutor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={tutor.image || "/placeholder.svg"}
                      alt={tutor.name}
                      width={300}
                      height={200}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>

                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-2 sm:space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                        <p className="text-sm text-gray-600">{tutor.experience}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{tutor.rating}</span>
                        <span className="text-sm text-gray-500">({tutor.reviews})</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {tutor.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">{tutor.description}</p>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            {tutor.currency} {tutor.price}
                          </span>
                          <span className="text-sm text-gray-500">/session</span>
                        </div>
                      </div>

                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
