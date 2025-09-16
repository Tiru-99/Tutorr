import { NextResponse , NextRequest } from "next/server";
import prisma from "@tutorr/db";
//route to get all the teachers
export async function GET(req: NextRequest) {

    try {
        const teachers = await prisma.teacher.findMany();

        if (teachers.length <= 0) {
            console.log("No teacher available");
            return NextResponse.json({ message: "No teachers found" }, { status: 400 });
        }

        return NextResponse.json({ teachers }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}