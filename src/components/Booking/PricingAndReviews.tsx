"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Star, Quote } from "lucide-react"
import BookDialog from "./BookDialog"




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

export default function PricingAndReview({ price, license , id  }: { price: number, license: string , id : string}) {

    const handleViewLicense = () => {
        if (!license) {
            alert("License not available");
            return;
        }
        window.open(license, "_blank");
    };
    return (
        <div className="flex flex-col gap-8">
            <Card className="max-w-sm mx-auto bg-white border-2 border-gray-200">
                <CardContent className="">
                    <h2 className="text-gray-500 text-2xl font-semibold">Ratings</h2>
                    <div className="flex items-center gap-6 mt-2">
                        <span className="inline-flex rounded-xs bg-yellow-600/20 p-1">
                            <Star className="h-5 w-5 fill-yellow-500 stroke-none" />
                        </span>

                        <h3 className="font-semibold text-gray-700 text-lg">4.9 Stars</h3>
                    </div>

                    <h2 className="text-gray-500 text-2xl font-semibold mt-4">Reviews</h2>
                    <div className="relative mt-4">
                        <Carousel className="w-full border rounded-md px-3 border-blue-300">
                            <CarouselContent className="pb-8">
                                {reviews.map((review, index) => (
                                    <CarouselItem key={index}>
                                        <Card className="border-0 shadow-none">
                                            <CardContent className="p-0">
                                                <div className="pr-10">
                                                    <h4 className="font-semibold text-gray-900 mb-1">{review.name}</h4>
                                                    <div className="flex items-center gap-1 mb-3">
                                                        <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                                                        <span className="text-sm font-medium">{review.rating}</span>
                                                    </div>
                                                    <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <div className="absolute flex bottom-7 left-1/2 -translate-x-1/2 gap-1">
                                <CarouselPrevious className="w-8 h-8 p-0 ml-3" />
                                <CarouselNext className="w-8 h-8 p-0 mr-3" />
                            </div>

                        </Carousel>

                        <span className="absolute -top-3 right-0 bg-blue-400 w-12 h-12 rounded-full flex items-center justify-center">
                            <Quote className="text-white stroke-[1.5] h-7 w-7 " />
                        </span>

                    </div>

                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <h2 className="text-gray-500 font-semibold text-2xl">Booking</h2>
                    <h2 className="text-green-700 text-3xl font-semibold mt-2">{price} $ <span className="text-2xl text-gray-600 font-normal ">/Session</span> </h2>
                    <div className="flex mt-6 gap-6">
                        <Button className="bg-white border text-blue-500 border-blue-700 hover:bg-blue-50 scale-110 cursor-pointer"
                            onClick={handleViewLicense}> View License</Button>
                        <BookDialog id = {id}/>
                    </div>
                </CardContent>
            </Card>
        </div>

    )
}
