import { useMutation, useQuery } from "@tanstack/react-query";
import axios from 'axios';

interface QueryBody {
    date: Date | null,
    time: string[] | null,
    topic: string[] | null,
    price: number[] | null,
    name: string | null
}
const homePageQuery = async (data: QueryBody) => {
    const response = await axios.post('/api/search', data);
    console.log("The response is ", response.data);
    return response.data;
}


const getAllTeachers = async () => {
    const response = await axios.get('/api/teacher');
    return response.data;
}

const getTeacherById = async (id: string) => {
    const response = await axios.get(`/api/bookings/profile?id=${id}`);
    return response.data.teacher;
}


export const useGetAllTeachers = () => {
    return useQuery({
        queryKey: ['all-teachers'],
        queryFn: getAllTeachers,
        staleTime: 1000 * 60 * 5, // optional: cache data for 5 minutes
    })
}

export const useGetTeacherById = (id: string) => {
    return useQuery({
        queryKey: ["teacher-by-id", id],
        queryFn: () => getTeacherById(id),
        enabled: !!id, // ensures the query only runs when id is truthy
    });
};

export const useGetTeachersByQuery = () => {
    return useMutation({
        mutationFn: homePageQuery
    })
}
