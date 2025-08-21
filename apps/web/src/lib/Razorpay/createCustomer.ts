import axios from 'axios';

export const createRazorpayCustomer = async (data: {
  name: string;
  email: string;
  notes?: Record<string , any>
}) => {
  try {
    const response = await axios.post(
      'https://api.razorpay.com/v1/customers',
      {
        name: data.name,
        email: data.email,
        notes: data.notes || {},
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY!,
          password: process.env.RAZORPAY_SECRET_KEY!,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (err) {
    console.group('Customer creation failed:', err);
    throw new Error('Unable to create customer');
  }
};
