import { useMutation, useQuery } from "@tanstack/react-query";
import axios from 'axios';

// Define the function to fetch student profile based on ID
const getStudentProfile = async ({ queryKey }: { queryKey: [string, string] }) => {
    const [_, id] = queryKey;  // Destructure the queryKey to get id
    const response = await axios.get(`/api/profile/student?id=${id}`);
    return response.data.student;
}

const updateStudentProfile = async(formData : FormData) => {
    const response = await axios.post('/api/student' , formData);
    return response.data; 
}

export const useGetStudentProfile = (id: string) => {
    return useQuery({
        queryKey: ['studentProfile', id],  // Query key is now dynamic with the id
        queryFn: getStudentProfile,  // Fetch function
        enabled: !!id, 
         // Only run query if id is available
    });
}

export const useUpdateStudentProfile = () => {
    return useMutation({
        mutationFn : updateStudentProfile
    });
}