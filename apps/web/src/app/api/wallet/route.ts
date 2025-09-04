import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";


export async function GET(req: NextRequest) {
    //get the pending payments and 
    const teacherId = req.headers.get("x-teacher-id");

    if (!teacherId) {
        return NextResponse.json({
            error: "Unauthorized Access!"
        }, { status: 403 });
    }

    try {
        //to get the sum of pending amount which is yet to be released
        const pendingAmount = await prisma.transactions.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                teacherId,
                type: "PAYOUT",
                releasedAt: null,
            },
        })

        const withdrawableAmount = await prisma.wallet.findFirst({
            where: {
                teacherId,
            },
            select: {
                amount: true,
            },
        });

        const amount = withdrawableAmount?.amount;

        //get all transactions 
        const transactions = await prisma.transactions.findMany({
            where: {
                teacherId
            },
            include: {
                student: {
                    select: {
                        name: true
                    }
                } , 
                booking : {
                    select : {
                        cancellationReason : true
                    }
                }
            }
        });


        return NextResponse.json({
            message: "Wallet details fetched successfully",
            pendingAmount,
            amount,
            transactions
        })
    } catch (error) {
        console.log("Something went wrong while fetching wallets", error);
        return NextResponse.json({
            error: error
        }, { status: 500 })
    }


}