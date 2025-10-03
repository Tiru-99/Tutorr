import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";

export async function POST(req: NextRequest) {
    const { bookingId, rating, comment } = await req.json();

    if (!bookingId || !rating || !comment) {
        return NextResponse.json(
            { error: "Incomplete data sent from the frontend" },
            { status: 400 }
        );
    }

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return NextResponse.json({ error: "No booking found" }, { status: 404 });
        }

        // Ensure booking is completed
        if (booking.status !== "COMPLETED") {
            return NextResponse.json(
                { error: "Review can only be added after session is completed" },
                { status: 400 }
            );
        }

        const studentId = req.headers.get("x-student-id");
        const teacherId = booking.teacherId;

        if (booking.studentId !== studentId) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 403 }
            );
        }

        // Use upsert to handle create/update in one go
        await prisma.teacherReview.upsert({
            where: { bookingId }, // unique bookingId field
            update: { rating, comment },
            create: {
                bookingId,
                studentId,
                teacherId,
                rating,
                comment,
            },
        });

        // calculate new average rating
        const agg = await prisma.teacherReview.aggregate({
            where: { teacherId },
            _avg: { rating: true },
        });

        const avgRating = agg._avg.rating ?? 0;

       // update avg rating
        await prisma.teacher.update({
            where: { id: teacherId },
            data: { average_rating : avgRating },
        });

        return NextResponse.json(
            { message: "Successfully added a review" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error while adding review:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    try {
        if (!bookingId) {
            return NextResponse.json({
                error: "Incomplete data sent"
            }, { status: 400 })
        }

        const review = await prisma.teacherReview.findFirst({
            where: {
                bookingId
            }
        });

        if (!review) {
            return NextResponse.json({
                message: "No review found",
                review: null
            }, { status: 200 })
        }

        return NextResponse.json({
            message: "Successfully fetched review",
            review: review ?? null
        });
    } catch (error) {
        console.log("Something went wrong while fetching the review", error);
        return NextResponse.json({
            error
        }, { status: 500 })
    }

}
