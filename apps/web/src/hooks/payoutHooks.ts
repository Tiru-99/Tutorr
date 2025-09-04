import { useMutation ,  useQuery , useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface RazorpayPayoutTypes {
    accountNumber : string ; 
    ifscNumber : string ; 
    accountHolderName : string
}

const razopayPayout = async(data : RazorpayPayoutTypes) => {
    const response = await axios.post('/api/payouts/razorpay' , data , {
        withCredentials : true
    });
    return response.data; 
}

const paypalPayout = async( paypalEmail : string) => {
    const response = await axios.post('/api/payouts/paypal' , {
        paypalEmail
    } , {
        withCredentials : true
    });

    return response.data ; 
} 

export const useRazorpayPayout = () => {
    return useMutation({
        mutationFn : razopayPayout
    })
}

export const usePaypalPayout = () => {
    return useMutation({
        mutationFn : paypalPayout
    })
}