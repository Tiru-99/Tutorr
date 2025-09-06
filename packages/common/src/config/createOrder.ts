
import { razorpay } from "./razorpay";


export const createOrder = (options : any ) => {
    return new Promise((resolve , reject) => {
        razorpay.orders.create(options , (err , order) => {
            if(err){
                console.log("Error in creating order part", process.env.RAZORPAY_KEY , process.env.RAZORPAY_SECRET_KEY)
                reject(err)
            } else {
                console.log("Order created successfully" , order)
                resolve(order) 
            }
            
        })
    })
}