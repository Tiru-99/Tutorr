import { NextResponse } from "next/server";
import prisma from "@tutorr/db";
//route to get all the teachers
export async function GET() {

    try {
        const teachers = await prisma.teacher.findMany({
            where: {
                license: {
                    not: null
                },
                name: {
                    not: null
                },
                years_of_exp: {
                    not: null
                },
                expertise: {
                    isEmpty : false // checks that array is not empty
                }
            }
        });


        if (teachers.length <= 0) {
            console.log("No teacher available");
            return NextResponse.json({ message: "No teachers found" }, { status: 400 });
        }

        return NextResponse.json({ teachers }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong");
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}