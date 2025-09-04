import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";


export async function POST(req: NextRequest) {
  const { paypalEmail } = await req.json();
  console.log("The received paypal email is ,", paypalEmail);
  const teacherId = req.headers.get("x-teacher-id");

  if (!teacherId) {
    return NextResponse.json({ error: "Unauthorized Request" }, { status: 403 });
  }

  if (!paypalEmail) {
    return NextResponse.json({ error: "PayPal email is required" }, { status: 400 });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(paypalEmail)) {
    return NextResponse.json({ error: "Invalid PayPal email address" }, { status: 400 });
  }

  const wallet = await prisma.wallet.findFirst({
    where: { teacherId },
    select: { amount: true, id: true },
  });

  if (!wallet?.amount || wallet.amount.toNumber() <= 0) {
    return NextResponse.json({ error: "No balance available" }, { status: 400 });
  }

  const usdAmount = wallet.amount.toNumber();

  if (usdAmount < 1) {
    return NextResponse.json({ 
      error: `Minimum payout amount is $1.00. Current balance: $${usdAmount}` 
    }, { status: 400 });
  }

  try {
  
    const simulatedResponse = {
      batch_id: `SIM_BATCH_${Date.now()}`,
      status: "SUCCESS",
      payout_item_id: `SIM_ITEM_${teacherId}_${Date.now()}`,
    };

  
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { amount: 0 },
    });


    await prisma.transactions.create({
      data: {
        teacherId,
        type: "COMPLETED",
        amount: usdAmount,
        walletId: wallet.id,
      },
    });

    return NextResponse.json({
      message : "Successfully withdrawed money , you can check your paypal !",
      payout: simulatedResponse,
      conversion: {
        usdAmount,
        inrEquivalent: usdAmount * 83, 
        exchangeRate: 83,
      },
    });
  } catch (error: any) {
    console.error("Simulator error:", error);
    return NextResponse.json({ error: "Simulator failed" }, { status: 500 });
  }
}
