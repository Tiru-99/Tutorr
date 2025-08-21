import { useMutation ,  useQuery } from "@tanstack/react-query";
import axios from "axios";


//add proper types here 

export const insertOverride = async(data : any) => {
    const response = await axios.post("/api/teacher/availability" , data , {
        withCredentials : true
    });
    return response.data; 
} 

export const getScheduleAndOverrides = async (params: { teacherId: string }) => {
    const response = await axios.get("/api/teacher/schedule", {
        params,  
        withCredentials: true
    });

    return response.data;
};

export const insertSchedule = async(data : any) => {
    const response = await axios.post("/api/teacher/schedule" , data , {
        withCredentials : true
    });

    return response.data; 
}


export const useInsertOverride = () => {
    return useMutation({
        mutationFn : insertOverride
    })
};

export const useGetScheduleAndOverrides = (teacherId: string) => {
    return useQuery({
        queryKey: ["overrides", teacherId], 
        queryFn: () => getScheduleAndOverrides({ teacherId }),
        enabled: !!teacherId , 
    });
};

export const useInsertSchedule = () => {
    return useMutation({
        mutationFn : insertSchedule
    })
}