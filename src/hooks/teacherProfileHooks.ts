import { useMutation, useQuery } from "@tanstack/react-query";
import axios from 'axios';

const getTeacherProfile = async({queryKey} : {queryKey : [string , string]}) => {
    const[_ , id] = queryKey ; 
    const response = await axios.get(`/api/profile/teacher?id=${id}`);
    console.log("Teacher Response" , response);
    return response.data
}

export const useGetTeacherDetails = (id : string) => {
    return useQuery({
        queryKey : ["teacherProfile" , id] , 
        queryFn : getTeacherProfile ,
        enabled : !!id // only run when id is available
    });
}