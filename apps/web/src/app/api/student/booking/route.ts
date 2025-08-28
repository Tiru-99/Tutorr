import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";


export async function GET(req: NextRequest, res: NextResponse) {
    const studentId = req.headers.get("x-student-id");

    if (!studentId) {
        console.log("no authenticated student Id  !");
        return NextResponse.json({
            error: "No authenticated student Id"
        }, { status: 403 })
    }

    try {
        const bookings = await prisma.booking.findMany({
            where: {
                studentId
            }
        });

        return NextResponse.json({
            message: "Bookings fetched successfully",
            bookings
        }, { status: 200 })
    } catch (err) {
        return NextResponse.json({
            error: "Something went wrong while getting bookings"
        }, { status: 500 })
    }
}