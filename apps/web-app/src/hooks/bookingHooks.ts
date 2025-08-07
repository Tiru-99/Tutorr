import { useMutation ,  useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface BookingType {
    studentId : string ,
    teacherId : string , 
    slotId : string , 
    price : number 
}


const getTeacherAvailability = async ({ queryKey }: { queryKey: [string, { teacherId: string; date: string }] }) => {
    const [ _ , { teacherId, date }] = queryKey;
    const response = await axios.get(`/api/bookings/availability?teacherId=${teacherId}&date=${date}`);
    return response.data.slots;
};

const bookSlot = async(dataToSend : BookingType) => {
    const response = await axios.post(`/api/bookings/core` , dataToSend);
    return response.data ;
}

//polling hook 
const fetchBookingStatus  = async(id : string) => {
    const response = await axios.get(`/api/polling?id=${id}`);
    return response.data ; 
}


export const useGetTeacherAvailabilityForBooking = (teacherId : string , date : string) => {
    return useQuery({
        queryKey : ["teacherAvailability" , {teacherId , date}], 
        queryFn : getTeacherAvailability , 
        enabled : !!teacherId && !!date ,
    });
}

export const useBookTeacherSlot = () => {
    return useMutation({
        mutationFn : bookSlot
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
