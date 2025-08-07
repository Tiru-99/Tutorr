
import { razorpay } from "./razorpay";


export const createOrder = (options : any ) => {
    return new Promise((resolve , reject) => {
        razorpay.orders.create(options , (err , order) => {
            if(err){
                reject(err)
            } else {
                console.log("Order created successfully" , order)
                resolve(order) 
            }
            
        })
    })
}