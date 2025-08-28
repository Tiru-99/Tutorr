import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";


export async function GET(req: NextRequest, res: NextResponse) {
    const teacherId = req.headers.get("x-teacher-id");

    if (teacherId === null) {
        return NextResponse.json({
            error: "No authenticated teacherId found ! "
        }, { status: 403 })
    }

    try {
        //get all the teacher bookings 
        const bookings = await prisma.booking.findMany({
            where: {
                teacherId
            }
        })

        return NextResponse.json({
            message: "Bookings fetched successfully",
            bookings
        }, { status: 200 })
    } catch (error) {
        console.log("Something went wrong while getting bookings");
        return NextResponse.json({
            message: "Something went wrong while fetching bookings"
        }, { status: 500 })
    }

}