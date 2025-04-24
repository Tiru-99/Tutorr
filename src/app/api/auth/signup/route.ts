import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest, res: NextResponse) {
    const { email, password, name, phoneNumber, type } = await req.json();
    //check if the user exists in db or not 

    if(!email || !password || !name || !phoneNumber || !type){
        console.log("Incomplete incoming user details");
        return NextResponse.json({
            message : "Incomplete details while signing up !"
        });
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    });
    console.log("The existing user is " , existingUser);

    if (existingUser) {
        return NextResponse.json(
            { message: "User Already Exists" },
            { status: 400 }
        );
    }

    //hash the password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //store the user 
    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phoneNumber,
                type
            }
        });

        console.log("Successfully Signed up");
        return NextResponse.json(
            { 
                message: "Successfully Signed up" ,
                user : user
            },
            { status: 200 } 
        );

    } catch (error) {
        console.error("Something went wrong while signing up ", error);
        return NextResponse.json(
            {
                message: "Something went wrong while signing up",
                error: error
            },
            {
                status: 500
            }
        );
    }


}

