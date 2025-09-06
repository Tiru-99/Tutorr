import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
        return NextResponse.json({
            error: "No teacher Id in params found"
        }, { status: 400 })
    }
    try {

        const teacher = await prisma.teacher.findFirst({
            where : {
                id : teacherId
            }
        })

        if(!teacher){
            return NextResponse.json({
                error : "Teacher with this id does not exist"
            } , { status : 400 }); 
        }

        const topReviews = await prisma.teacherReview.findMany({
            where: {
                teacherId: teacherId,
            },
            take: 5,
            include: {
                student: {
                    select: { id: true, name: true }
                }
            }
        });

        // Get average rating for that teacher
        const avgResult = await prisma.teacherReview.aggregate({
            where: {
                teacherId: teacherId,
            },
            _avg: {
                rating: true,
            },
            _count: {
                id: true,
            },
        });

        const response = {
            topReviews,
            averageRating: avgResult._avg.rating ?? 0,
            totalReviews: avgResult._count.id,
        };

        return NextResponse.json({
            response , 
            message :"Successfully fetched the teacher reviews"
        } , { status : 200 })
    } catch (error) {
        console.log("Something went wrong while fetching reviews" , error); 
        return NextResponse.json({
            error 
        } , { status : 500 })
    }
}