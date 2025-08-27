import { useMutation ,  useQuery , useQueryClient } from "@tanstack/react-query";
import axios from "axios";


//TODO : add proper types here

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

export const deleteOverride = async( params : {availabilityId : string}) => {
    const response = await axios.delete("/api/teacher/availability" , 
    {
        params,
        withCredentials : true
    });
    return response.data ; 
}

export const getSlotsByDate = async( params : { dateStart : string, dateEnd : string , timezone : string , teacherId : string , weekDay : string}) => {
    const response = await axios.get("/api/bookings/availability" , 
        {
            params , 
            withCredentials : true
        }
    ) ; 
    return response.data ; 
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

export const useDeleteOverride = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { availabilityId: string }) => deleteOverride(params),
    onSuccess: () => {
      // invalidate cached queries so UI updates
      queryClient.invalidateQueries({ queryKey: ["overrides"] });
    },
  });
};

export function useGetSlotsByDate(params: { 
  dateStart: string; 
  dateEnd: string; 
  timezone: string; 
  teacherId: string; 
  weekDay : string;
}) {
  return useQuery({
    queryKey: ["slotsByDate", params], 
    queryFn: () => getSlotsByDate(params),
    enabled: Boolean(params.dateStart && params.dateEnd && params.teacherId), // only fetch if valid
    staleTime: 1000 * 60 * 5, //cache for 5 mins
  });
}