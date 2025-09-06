import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";
import axios from 'axios'


const secretKey = process.env.RAZORPAYX_SECRET!;
const clientId = process.env.RAZORPAYX_KEY_ID!;
const razorpayAccountNumber = process.env.RAZORPAYX_ACCOUNT_NUMBER!;

const credentials = `${clientId}:${secretKey}`
const base64Credentials = btoa(credentials);

const config = {
  headers: {
    'Authorization': `Basic ${base64Credentials}`,
    'Content-Type': 'application/json'
  }
}


export async function POST(req: NextRequest) {
  const { accountHolderName, ifscNumber, accountNumber } = await req.json();

  const teacherId = req.headers.get("x-teacher-id");

  if (!accountHolderName || !ifscNumber || !accountNumber) {
    console.log("Incomplete details sent! ");
    return NextResponse.json({
      error: "Invalid details from the frontend sent!"
    }, { status: 403 });
  }

  if (!teacherId) {
    return NextResponse.json({
      message: "Unauthorized request"
    }, { status: 400 })
  }


  try {

    //find teacher details 
    const teacherDetails = await prisma.teacher.findFirst({
      where: {
        id: teacherId
      },
      select: {
        phone_number: true,
        user: {
          select: {
            email: true
          }
        },
        Wallet: {
          select: {
            id: true,
            amount: true
          }
        }
      }
    });

    const amount = teacherDetails?.Wallet?.amount;
    const walletId = teacherDetails?.Wallet?.id;

    if (!teacherDetails || !walletId) {
      throw new Error("Teacher details not found !")
    }

    // Check if amount is valid
    const numAmount = amount?.toNumber();
    if (!numAmount || numAmount <= 0) {
      return NextResponse.json({
        error: "No balance available"
      }, { status: 400 });
    }


    const email = teacherDetails.user.email;
    const phoneNo = teacherDetails.phone_number;

    if (!email || !phoneNo) {
      throw new Error("Either email or phone number not found");
    }

    const contact = await createContact(accountHolderName, email, phoneNo)

    if (!contact) {
      throw new Error("Something went wrong while creating contact");
    }

    const contactId = contact.id;

    const fundAccount = await createFundAccount(contactId, accountHolderName, ifscNumber, accountNumber);
    
    if (!fundAccount) {
      throw new Error("Something went wrong while creating fund account");
    }
    
    const fundAccountId = fundAccount.id;

    const payout = await createPayout(fundAccountId, numAmount, teacherId, walletId)

    return NextResponse.json({
      message: "Payout done successfully",
      payout
    });
  } catch (error) {
    console.log("Something went wrong while creating the payout", error);
    return NextResponse.json({
      message: "Something went wrong while creating payout",
      error
    }, { status: 500 })
  }

}


async function createContact(name: string, email: string, contact: string) {
  if (!name || !email || !contact) {
    return;
  }

  const dataToSend = {
    name,
    email,
    contact,
    type: "employee",
    reference_id: `${name}:${email}`,
    notes: {
      random_key_1: "Tutorr Withdrawal"
    }
  }

  console.log("The data to send is " , dataToSend)


  try {
    const response = await axios.post("https://api.razorpay.com/v1/contacts", dataToSend, config)
    return response.data;
  } catch (error: any) {
    console.log("Something went wrong while creating customer", error.response?.data);
    throw error;
  }
}

async function createFundAccount(contactId: string, accountHolderName: string, ifscNumber: string, accountNumber: string) {
  if (!contactId || !accountHolderName || !ifscNumber || !accountNumber) {
    return
  }

  const dataToSend = {
    contact_id: contactId,
    account_type: "bank_account",
    bank_account: {
      name: accountHolderName,
      ifsc: ifscNumber,
      account_number: accountNumber
    }
  }
  try {

    const response = await axios.post("https://api.razorpay.com/v1/fund_accounts", dataToSend, config);
    return response.data;
  } catch (error: any) {
    console.log("Something went wrong while creating fund account", error.message)
    throw error;
  }
}

async function createPayout(fundAccountId: string, amount: number, teacherId: string, walletId: string) {
  if (!fundAccountId || !amount) {
    return
  }

  const inrAmount = amount * 86 * 100

  const dataToSend = {
    account_number: razorpayAccountNumber,
    fund_account_id: fundAccountId,
    amount: inrAmount,
    currency: "INR",
    mode: "IMPS",
    purpose: "payout",
    queue_if_low_balance: true,
    reference_id: `teacher-payout`,
  }

  // Fixed idempotency key generation
  const idempotencyKey = `${Date.now()}_${teacherId}`

  const payoutConfig = {
    headers: {
      'Authorization': `Basic ${base64Credentials}`,
      'Content-Type': 'application/json',
      'X-Payout-Idempotency': idempotencyKey.slice(0,30)
    }
  }

  try {
    // Create payout first
    const response = await axios.post("https://api.razorpay.com/v1/payouts", dataToSend, payoutConfig)
    
    // If payout successful, update wallet
    await prisma.wallet.update({
      where: {
        id: walletId
      }, 
      data: {
        amount: 0 
      }
    }); 

    // Record transaction for audit
    await prisma.transactions.create({
      data: {
        teacherId,
        type: "COMPLETED",
        amount: amount,
        walletId: walletId,
      },
    });

    console.log("Wallet updated and transaction recorded successfully");
    
    return response.data;
  } catch (error: any) {
    console.log("Something went wrong while payout", error.response.data)
    throw error;
  }
}