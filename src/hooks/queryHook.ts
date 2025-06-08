import { useMutation, useQuery } from "@tanstack/react-query";
import axios from 'axios';

interface QueryBody {
    date : Date , 
    time : string , 
    topic : string
}

const homePageQuery = async (data: QueryBody) => {
    const response = await axios.post('/api/home', data);
    return response.data;
}

export const useGetTeachersByQuery = () => {
    return useMutation({
        mutationFn: homePageQuery
    })
}
