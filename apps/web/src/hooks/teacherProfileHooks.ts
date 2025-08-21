import { useMutation, useQuery } from "@tanstack/react-query";
import axios from 'axios';

interface DataToSend {
    userId : string ;
    date : string ; 
    deletedSessionSlots : string[];
    sessionSlots : string[]; 
    dayOfWeek : string ; 
    isAvailable : boolean; 
}

interface ScheduleData {
    timezone : string; 
    teacherId : string ; 
    duration : number ; 
    startTime : string ; 
    endTime : string ; 
}

const getTeacherProfile = async({queryKey} : {queryKey : [string , string]}) => {
    const[_ , id] = queryKey ; 
    const response = await axios.get(`/api/profile/teacher?id=${id}`);
    console.log("Teacher Response" , response);
    return response.data
}

const saveAndUpdateTeacherProfile = async(formData : FormData) => {
    const response = await axios.post('/api/teacher' , formData , {
        withCredentials : true
    });

    return response.data; 
}

const getTeacherAvailability = async ({ queryKey }: { queryKey: [string, { userId: string; date: string }] }) => {
    const [ _ , { userId, date }] = queryKey;
    const response = await axios.get(`/api/teacher/availability?userId=${userId}&date=${date}`);
    return response.data;
};

const updateTeacherAvailability = async(dataToSend : DataToSend) => {
    const response = await axios.post('/api/teacher/availability' , dataToSend , {
        withCredentials : true
    });

    return response.data; 
}

const createSchedule = async(data : ScheduleData) => {
    const response = await axios.post(`/api/teacher/availabililty` , data , {
        withCredentials : true 
    });
}

export const useGetTeacherDetails = (id : string) => {
    return useQuery({
        queryKey : ["teacherProfile" , id] , 
        queryFn : getTeacherProfile ,
        enabled : !!id // only run when id is available
    });
}

export const useGetTeacherAvailability = (userId : string , date : string) => {
    return useQuery({
        queryKey : ["teacherAvailability" , {userId , date}], 
        queryFn : getTeacherAvailability , 
        enabled : !!userId && !!date ,
        //no caching
        staleTime : 0 , 
    })
}

export const useUpdateTeacherAvailability = () => {
    return useMutation({
        mutationFn : updateTeacherAvailability
    })
}

export const useSaveTeacherDetails = () => {
    return useMutation({
        mutationFn : saveAndUpdateTeacherProfile
    })
}

export const useCreateSchedule = () => {
    return useMutation({
        mutationFn : createSchedule
    })
}