import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET(req: NextRequest) {
    const url = new URL(req.url); 
    const id = url.searchParams.get("id"); 
    console.log("The id in the backend is" , id)
    if (!id) {
        return NextResponse.json({
            message: "No id found"
        }, { status: 400 })
    }

    try {
        const student = await prisma.student.findFirst({
            where: {
                user: {
                    id: id
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                } 
            }
        });

        const modifiedStudent = {
            ...student , email : student?.user.email
        }

        if(!student){
            console.log("Student account for this id does not exits");
            return NextResponse.json({
                message : "Student account for this id does not exists"
            } , {status  : 403});
        }


        return NextResponse.json({
            message: "Student profile fetched successfully",
            student: modifiedStudent, 
        }, { status: 200 })
    } catch (error) {
        console.log("Something went wrong while fetching student details");
        return NextResponse.json({
            message: "Something went wrong while fetching student",
            error: error
        }, { status: 500 })
    }
}