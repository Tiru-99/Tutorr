"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Star, Quote, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation";
import { useGetTeacherReviews } from "@/hooks/reviewHook";

interface ReviewType {
  student: {
    name: string;
  };
  rating: number;
  comment: string;
}

export default function LicenseComponent({ price, id }: { price: number; id: string }) {
  const router = useRouter();
  const { data, isLoading, isError } = useGetTeacherReviews(id);

  const reviews : ReviewType[] =
    data?.response?.topReviews?.map((review: ReviewType) => ({
      name: review.student.name,
      rating: review.rating,
      text: review.comment,
    })) ?? [];

  return (
    <Card className="max-w-sm mx-auto bg-white border-2 border-gray-200">
      <CardContent className="p-6">
        <span>
          <Button
            className="hover:cursor-pointer"
            onClick={() => router.push("/teacher/schedule")}
          >
            Edit Availability
          </Button>
        </span>

        <h3 className="font-medium text-gray-600 mt-6">Ratings</h3>
        <div className="flex gap-2 mt-2">
          <Star className="fill-yellow-300 text-yellow-300 pb-[2px]" />
          <p>{data?.response?.averageRating ?? 0}</p>
        </div>

        <div className="w-full bg-white border-[1.5px] rounded-md border-blue-400 shadow-none mt-4">
          <div className="relative p-2">
            <div className="px-2">
              <h3 className="text-gray-500 font-medium mt-2">Reviews</h3>

              {isLoading ? (
                <div className="flex justify-center items-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : isError ? (
                <p className="text-red-500 text-sm text-center py-4">
                  Failed to load reviews.
                </p>
              ) : reviews.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">
                  No reviews yet
                </p>
              ) : (
                <Carousel className="w-full">
                  <CarouselContent className="pb-8">
                    {reviews.map((review : any, index: number) => (
                      <CarouselItem key={index}>
                        <Card className="border-0 shadow-none">
                          <CardContent className="p-0">
                            <div className="pr-10">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {review.name}
                              </h4>
                              <div className="flex items-center gap-1 mb-3">
                                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                                <span className="text-sm font-medium">
                                  {review.rating}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {review.text}
                              </p>
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
              )}
            </div>

            <Quote className="absolute top-3 right-3 text-blue-400 h-9 w-9 opacity-60" />
          </div>
        </div>

        <div className="w-full border border-gray-300 rounded-md mt-5 shadow-sm">
          <div className="py-3 px-3">
            <h3 className="text-gray-600 text-md font-medium">Price</h3>
            <h1 className="font-bold text-green-600 text-2xl mt-2">
              {price} $ /{" "}
              <span className="text-2xl text-gray-500 font-medium">Session</span>
            </h1>
          </div>
        </div>

        <Button className="w-full text-blue-500 border border-blue-500 bg-white hover:bg-blue-50 mt-7 rounded-full">
          View License
        </Button>
        <Button className="w-full text-red-500 border border-red-500 bg-white hover:bg-red-50 mt-3 rounded-full">
          Delete License
        </Button>
      </CardContent>
    </Card>
  );
}
