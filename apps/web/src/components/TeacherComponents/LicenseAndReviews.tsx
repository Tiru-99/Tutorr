"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Star, Quote, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGetTeacherReviews } from "@/hooks/reviewHook"


interface ReviewType {
  student: {
    name: string
  }
  rating: number
  comment: string
}

export default function LicenseComponent({ price, id, license }: { price: number; id: string; license: string }) {
  const router = useRouter()
  const { data, isLoading, isError } = useGetTeacherReviews(id)

  const reviews: ReviewType[] =
    data?.response?.topReviews?.map((review: ReviewType) => ({
      name: review.student.name,
      rating: review.rating,
      text: review.comment,
    })) ?? []

  const handleViewLicense = () => {
    if (!license) {
      alert("License not available")
      return
    }
    window.open(license, "_blank")
  }


  return (
    <Card className="max-w-md mx-auto bg-white border border-gray-200 shadow-md rounded-xl overflow-hidden">
      <CardContent className="px-6 space-y-0">
        {/* Availability */}
        <div className="flex max-w-full">
          <Button
            className="bg-blue-700 hover:bg-blue-800 hover:cursor-pointer text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm transition"
            onClick={() => router.push("/teacher/schedule")}
          >
            Edit Availability
          </Button>
        </div>

        {/* Ratings */}
        <div className="mt-4">
          <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Ratings</h3>
          <div className="flex items-center gap-2 mt-2">
            <Star className="fill-yellow-400 text-yellow-400 w-5 h-5" />
            <p className="text-lg font-bold text-gray-900">{data?.response?.averageRating ?? 0}</p>
          </div>
        </div>

        {/* Reviews */}
        <div className="border border-gray-300 rounded-xl bg-gray-50 mt-3">
          <div className="relative p-5">
            <div className="space-y-5">
              <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wide">Reviews</h3>

              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : isError ? (
                <p className="text-red-600 text-sm text-center py-6">Failed to load reviews.</p>
              ) : reviews.length === 0 ? (
                <p className="text-gray-500 text-sm py-6 text-center">No reviews yet</p>
              ) : (
                <Carousel className="w-full">
                  <CarouselContent className="pb-12">
                    {reviews.map((review: any, index: number) => (
                      <CarouselItem key={index}>
                        <Card className="border-0 shadow-sm">
                          <CardContent className="px-4">
                            <div className="space-y-3 pr-10">
                              <h4 className="font-semibold text-gray-900 text-base">{review.name}</h4>
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium text-gray-700">{review.rating}</span>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="absolute flex bottom-6 left-1/2 -translate-x-1/2 gap-3">
                    <CarouselPrevious className="w-9 h-9 p-0 bg-white border border-gray-300 shadow-sm hover:bg-gray-100" />
                    <CarouselNext className="w-9 h-9 p-0 bg-white border border-gray-300 shadow-sm hover:bg-gray-100" />
                  </div>
                </Carousel>
              )}
            </div>

            <Quote className="absolute top-4 right-4 text-blue-300 h-7 w-7" />
          </div>
        </div>

        {/* Price */}
        <div className="border border-gray-300 rounded-xl mt-4">
          <div className="py-5 px-5 space-y-2">
            <h3 className="text-gray-900 text-sm font-semibold uppercase tracking-wide">Price</h3>
            <div className="flex items-baseline gap-1">
              <h1 className="font-extrabold text-green-600 text-3xl">${price}</h1>
              <span className="text-base text-gray-500">/ Session</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-3 pt-2">
          <Button className="w-full bg-blue-600 text-white border border-gray-300 hover:bg-gray-100 font-semibold py-2.5 rounded-lg shadow-sm transition"
            onClick={handleViewLicense}>
            View License
          </Button>
          <Button className="w-full bg-white text-red-600 border border-red-300 hover:bg-red-50 font-semibold py-2.5 rounded-lg shadow-sm transition"
          onClick={() => router.push("/teacher/edit")}>
            Delete License
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
