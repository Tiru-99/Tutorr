"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Star, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useAddReview, useFetchReview } from "@/hooks/reviewHook";
import { toast } from "sonner";

interface ReviewDialogProps {
  bookingId: string;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({ bookingId }) => {

  //hooks 
  const { data, isLoading, isError, refetch } = useFetchReview(bookingId);
  const { mutate, isPending } = useAddReview();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  console.log("The incoming data is" , data); 
  // update once data comes from API
  useEffect(() => {
    if (data) {
      setRating(data.review.rating ?? 0);
      setReview(data.review.comment ?? "");
    } else {
      setRating(0);
      setReview("");
    }
  }, [data]);


  const handleSubmit = () => {
    const dataToSend = { bookingId, rating, comment: review };

    mutate(dataToSend, {
      onSuccess: () => {
        toast.success("Review submitted successfully!", { position: "bottom-center" });
        setOpen(false);
        setRating(0);
        setReview("");
      },
      onError: () => {
        toast.error("Failed to submit review. Please try again.", { position: "bottom-center" });
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (val) refetch(); // refetch review each time dialog opens
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">Add a Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          {/* Loader for fetching existing review */}
          {isLoading && (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="flex flex-col items-center gap-2 text-red-500 py-6">
              <span className="text-sm">Error fetching review</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                className="flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </Button>
            </div>
          )}

          {/* Show rating + textarea only if data is ready */}
          {!isLoading && !isError && (
            <>
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-8 h-8 cursor-pointer transition-colors",
                      (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
                    )}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">{rating} / 5</span>
              </div>

              {/* Review Textarea */}
              <Textarea
                placeholder="Write your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
              />

              {/* Submit Button */}
              <Button
                variant="default"
                onClick={handleSubmit}
                className="self-end flex items-center gap-2"
                disabled={isPending}
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
