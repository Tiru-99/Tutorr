import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";

// Function to get PayPal access token
async function getPayPalAccessToken(): Promise<string> {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
      `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Failed to get PayPal access token:", error);
    throw new Error("PayPal authentication failed");
  }
}

// Function to get current USD to INR exchange rate 
async function getExchangeRate(): Promise<number> {
  try {
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/USD`
    );
    return response.data.rates.INR || 83;
  } catch (error) {
    console.error("Exchange rate API failed, using fallback rate:", error);
    return 83;
  }
}

export async function POST(req: NextRequest) {
  const { paypalEmail} = await req.json();
  const teacherId = req.headers.get("x-teacher-id");

  console.log("The paypalEmail is " , paypalEmail);

  if (!teacherId) {
    return NextResponse.json({ error: "Unauthorized Request" }, { status: 403 });
  }

  if (!paypalEmail ) {
    console.log("email section me atak raha");
    return NextResponse.json({ 
      error: "PayPal email and account holder name are required" 
    }, { status: 400 });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(paypalEmail)) {
    console.log("Regex me atak raha")
    return NextResponse.json({ 
      error: "Invalid PayPal email address" 
    }, { status: 400 });
  }

  const withdrawableAmount = await prisma.wallet.findFirst({
    where: { teacherId },
    select: { amount: true, id: true },
  });

  if (!withdrawableAmount?.amount || withdrawableAmount.amount.toNumber() <= 0) {
    return NextResponse.json({ error: "No balance available" }, { status: 400 });
  }

  try {
    const usdAmount = withdrawableAmount.amount.toNumber();
    
    // PayPal minimum payout is $1.00
    if (usdAmount < 1) {
      return NextResponse.json({ 
        error: `Minimum payout amount is $1.00. Current balance: $${usdAmount}` 
      }, { status: 400 });
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Get exchange rate for display purposes
    const exchangeRate = await getExchangeRate();
    const inrAmount = Math.round(usdAmount * exchangeRate);

    console.log(`Sending $${usdAmount} (≈₹${inrAmount/100}) to PayPal email: ${paypalEmail}`);

    // Create PayPal payout
    const payoutData = {
      sender_batch_header: {
        sender_batch_id: `teacher_${teacherId}_${Date.now()}`, // Unique batch ID
        email_subject: "You have a payout!",
        email_message: "You have received a payout from Tutorr! Thanks for using our service!"
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: usdAmount.toFixed(2),
            currency: "USD"
          },
          receiver:"payouts-simulator-receiver@paypal.com",
          note: "Tutorr teaching earnings payout",
          sender_item_id: `payout_${teacherId}_${Date.now()}` // Unique item ID
        }
      ]
    };

    const payoutResponse = await axios.post(
      `${process.env.PAYPAL_BASE_URL}/v1/payments/payouts`,
      payoutData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    // Update wallet after successful payout
    await prisma.wallet.update({
      where: { id: withdrawableAmount.id },
      data: { amount: 0 },
    });

    // Record the transaction for audit
    await prisma.transactions.create({
      data: {
        teacherId,
        type: "WITHDRAWAL",
        amount: usdAmount,
        walletId: withdrawableAmount.id,
      },
    });

    return NextResponse.json({ 
      success: true, 
      payout: {
        batch_id: payoutResponse.data.batch_header.batch_id,
        status: payoutResponse.data.batch_header.batch_status,
        payout_item_id: payoutResponse.data.items[0].payout_item_id
      },
      conversion: {
        usdAmount,
        inrEquivalent: inrAmount / 100,
        exchangeRate
      }
    });

  } catch (error: any) {
    console.error("PayPal payout error:", error.response?.data || error.message);
    
    // Handle specific PayPal errors
    if (error.response?.data?.details) {
      const paypalError = error.response.data.details[0];
      return NextResponse.json({ 
        error: `PayPal Error: ${paypalError.description || paypalError.issue}`,
        code: paypalError.code 
      }, { status: 400 });
    }
    
    if (error.response?.data?.error_description) {
      return NextResponse.json({ 
        error: `PayPal Auth Error: ${error.response.data.error_description}` 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: "Failed to process PayPal payout" 
    }, { status: 500 });
  }
}