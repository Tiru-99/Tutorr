import { useMutation ,  useQuery } from "@tanstack/react-query";
import axios from "axios";

const getTeacherAvailability = async ({ queryKey }: { queryKey: [string, { teacherId: string; date: string }] }) => {
    const [ _ , { teacherId, date }] = queryKey;
    const response = await axios.get(`/api/bookings/availability?teacherId=${teacherId}&date=${date}`);
    return response.data.slots;
};

export const useGetTeacherAvailabilityForBooking = (teacherId : string , date : string) => {
    return useQuery({
        queryKey : ["teacherAvailability" , {teacherId , date}], 
        queryFn : getTeacherAvailability , 
        enabled : !!teacherId && !!date ,
    });
}