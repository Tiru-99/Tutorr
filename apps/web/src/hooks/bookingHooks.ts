import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface BookingType {
    studentId: string,
    teacherId: string,
    startTime: string,
    endTime: string,
    price: number,
    date: string
}


const getTeacherAvailability = async ({ queryKey }: { queryKey: [string, { teacherId: string; date: string }] }) => {
    const [_ , { teacherId, date }] = queryKey;
    console.log(_); 
    const response = await axios.get(`/api/bookings/availability?teacherId=${teacherId}&date=${date}`);
    return response.data.slots;
};

const bookSlot = async (dataToSend: BookingType) => {
    const response = await axios.post(`/api/bookings/core`, dataToSend);
    return response.data;
}

//polling hook 
const fetchBookingStatus = async (id: string) => {
    const response = await axios.get(`/api/polling?id=${id}`);
    return response.data;
}

const getBookingForTeachers = async () => {
    const response = await axios.get('/api/teacher/booking', {
        withCredentials: true
    });

    return response.data;
}

const getBookingForStudents = async () => {
    const response = await axios.get('/api/student/booking', {
        withCredentials: true
    });

    return response.data;
}

const cancelBookingForStudent = async ({
    bookingId,
    reason,
}: {
    bookingId: string;
    reason: string | null;
}) => {
    const response = await axios.post(
        "/api/student/cancel",
        { bookingId, reason },
        { withCredentials: true }
    );

    return response.data;
};

const cancelBookingForTeacher = async ({
    bookingId ,
    reason 
} : {
    bookingId : string ; 
    reason : string | null 
}) => {
    const response = await axios.post(
        "/api/teacher/cancel",
        { bookingId , reason },
        { withCredentials : true}
    );
    
    return response.data ; 
}


export const useGetTeacherAvailabilityForBooking = (teacherId: string, date: string) => {
    return useQuery({
        queryKey: ["teacherAvailability", { teacherId, date }],
        queryFn: getTeacherAvailability,
        enabled: !!teacherId && !!date,
    });
}

export const useBookTeacherSlot = () => {
    return useMutation({
        mutationFn: bookSlot
    })
}

export const useBookingPolling = (id: string) => {
    return useQuery({
        queryKey: ["bookingStatus", id],
        queryFn: () => fetchBookingStatus(id!),
        enabled: !!id,
        refetchInterval: 2000, // poll every 2 seconds
        refetchIntervalInBackground: true,
        retry: false,
    });
};

export const useGetBookingsForTeacher = () => {
    return useQuery({
        queryKey: ["teacherbooking"],
        queryFn: getBookingForTeachers
    })
}

export const useGetBookingsForStudents = () => {
    return useQuery({
        queryKey: ["studentbooking"],
        queryFn: getBookingForStudents
    })
}

export const useCancelBookingForStudent = () => {
    return useMutation({
        mutationFn: cancelBookingForStudent
    })
}

export const useCancelBookingForTeacher = () => {
    return useMutation({
        mutationFn : cancelBookingForTeacher
    })
}
