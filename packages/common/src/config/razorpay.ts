import Razorpay from "razorpay"
import dotenv from 'dotenv'

dotenv.config({ path: '../../.env' })
//Razorpay config
export const razorpay = new Razorpay({
    key_id : process.env.RAZORPAY_KEY!,
    key_secret : process.env.RAZORPAY_SECRET_KEY!
})


