import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ReviewData {
    bookingId: string
    rating: number
    comment: string
}
const addReview = async (data: ReviewData) => {
    const response = await axios.post('/api/reviews', data, {
        withCredentials: true
    });

    return response.data;
}

const fetchReview = async (params: { bookingId: string }) => {
    const response = await axios.get('/api/reviews',
        {
            params,
            withCredentials: true
        });
    return response.data;
}

const getTeacherReviews = async(params : { teacherId : string}) => {
    const response = await axios.get('/api/profile/teacher/reviews', {
        params , 
        withCredentials : true
    });
    return response.data; 
}

export const useAddReview = () => {
    return useMutation({
        mutationFn: addReview
    })
}

export const useFetchReview = (bookingId: string) => {
    return useQuery({
        queryKey: ["reviews", bookingId],
        queryFn: () => fetchReview({ bookingId }),
        enabled : !!bookingId
    })
}

export const useGetTeacherReviews = (teacherId : string) => {
    return useQuery({
        queryKey : ["reviews" , teacherId],
        queryFn : () => getTeacherReviews({teacherId}),
        enabled : !!teacherId
    })
}