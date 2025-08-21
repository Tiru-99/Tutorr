import { NextRequest, NextResponse } from "next/server";
import prisma from '@tutorr/db';
//get teacher profile by id 

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    console.log("the incoming id is " , id); 
    if (!id) {
        console.log("No param id received in the backend");
        return NextResponse.json({ error: "No params received" }, { status: 403 })
    }
    //find teacher by teacher id 
    try {
        const teacher = await prisma.teacher.findFirst({
            where: {
                id: id
            }
        });
        console.log("The teacher foudn is" , teacher); 
        if (!teacher) {
            console.log("No teacher found with this id");
            return NextResponse.json({ error: "No teacher found" }, { status: 404 });
        }

        return NextResponse.json({ teacher }, { status: 200 });
    } catch (error) {
        console.log("Something went wrong" , error); 
        return NextResponse.json({error : "Internal Server Error"} , {status : 500}); 
    }
}