import axios from 'axios';
import { RazorpayOrderOptions } from 'react-razorpay';

interface OrderType {
    key: string;
    id: string;
    amount: number;
    currency: string;
}

type CurrencyCode = "USD";

export const verifyAndCheckout = (
    order: OrderType,
    email: string,
    name: string,
    Razorpay: any
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const options: RazorpayOrderOptions = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
            amount: order.amount,
            currency: order.currency as CurrencyCode,
            name: "Tutor",
            description: "Booking a slot",
            order_id: order.id,
            prefill: {
                name,
                email
            },
            handler: async function (response: any) {
                try {
                    const result = await axios.post('/api/verify-payment', {
                        ...response,
                        amount: order.amount
                    });
                    resolve(result.data.sessionId); // ✅ Resolve the session ID
                } catch (error) {
                    console.error("Error verifying payment:", error);
                    reject(error); 
                }
            },
            theme: {
                color: "#3399cc"
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    });
};
