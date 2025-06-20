"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Star, Quote } from "lucide-react"
import EditDialog from "./EditDialog"

const reviews = [
  {
    name: "Allison Adam",
    rating: 4.0,
    text: "Lorem ipsum dolor sit amet consectetur. Sed non sit sed nunc nam nunc tellus. Sed non sit sed nunc nam nunc tellus. Lorem ipsum dolor sit amet consectetur. Sed non sit sed nunc nam nunc t",
  },
  {
    name: "John Smith",
    rating: 5.0,
    text: "Excellent service and very professional. The experience exceeded my expectations and I would definitely recommend to others.",
  },
  {
    name: "Sarah Johnson",
    rating: 4.5,
    text: "Great quality and attention to detail. The team was responsive and delivered exactly what was promised. Very satisfied with the results.",
  },
]

export default function TabletLicenseComponent({price} : {price : string}) {
  return (
    <Card className="max-w-5xl mx-auto bg-white border-2 border-gray-200 shadow-lg">
      <CardContent className="p-6">
        {/* Header with Edit Button and Ratings */}
        <div className="flex justify-between items-center mb-6">
          <EditDialog/>

          <Card className="border border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                <span className="font-semibold">4.9 Stars</span>
                <span className="text-gray-500 text-sm">Ratings</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Reviews (Takes 2/3 width) */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200 h-full">
              <CardContent className="p-6 relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-600 font-medium text-lg">Reviews</h3>
                  {/* Sticky Quote Icon */}
                  <Quote className="w-10 h-10 text-blue-400 opacity-60" />
                </div>

                <Carousel className="w-full">
                  <CarouselContent>
                    {reviews.map((review, index) => (
                      <CarouselItem key={index}>
                        <div className="pr-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-gray-900 text-lg">{review.name}</h4>
                            <div className="flex items-center gap-1">
                              <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                              <span className="font-medium">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed text-base">{review.text}</p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center mt-6 gap-2">
                    <CarouselPrevious className="relative translate-y-0 w-10 h-10" />
                    <CarouselNext className="relative translate-y-0 w-10 h-10" />
                  </div>
                </Carousel>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Price and Actions (Takes 1/3 width) */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-200 h-full">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                {/* Price Section */}
                <div className="mb-6">
                  <h3 className="text-gray-600 font-medium mb-4 text-lg">Price</h3>
                  <div className="text-3xl font-bold mb-6">
                    <div className="text-green-600">{price} $</div>
                    <div className="text-gray-500 font-normal text-lg">/ Session</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 rounded-full py-3"
                  >
                    View License
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-500 text-red-500 hover:bg-red-50 rounded-full py-3"
                  >
                    Delete License
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
