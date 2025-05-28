import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/utils/prisma";
import jwt from 'jsonwebtoken';


export async function POST(req: NextRequest, res: NextResponse) {

    const { email, password, type } = await req.json();

    if (!email || !password) {
        console.warn("Incomplete Details in the login route");
        return NextResponse.json({
            message: "Incomplete Details"
        });
    }

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (!existingUser) {
            console.log("User with this email is not registered !");
            return NextResponse.json({
                message: "User not registered",
            }, {
                status: 400
            });
        }

        if (existingUser.type !== type) {
            console.log(`User type mismatch. Expected ${type}, got ${existingUser.type}`);
            return NextResponse.json({
                message: `User is not registered as a ${type}`,
            }, {
                status: 401
            });
        }

        const comparePassword = await bcrypt.compare(password, existingUser.password);

        if (!comparePassword) {
            return NextResponse.json({
                message: "Invalid Email or Password"
            }, {
                status: 400
            });
        }

        const token = jwt.sign({ id: existingUser.id , type : existingUser.type}, process.env.NEXT_PUBLIC_JWT_SECRET!);

        console.log("User logged in successfully", existingUser);
        const response = NextResponse.json({
            message: "User logged in Successfully",
            userId : existingUser.id,
            type : existingUser.type , 
            token: token
        });

        response.cookies.set(
            'jwtToken',
            token,
            {
                httpOnly: true,
                secure: true
            }
        );

        return response;

    } catch (error) {
        console.log("Something went wrong while loggin in ", error);
        NextResponse.json({
            message: "Something went wrong while loggin in",
            error: error
        }, {
            status: 500
        });
    }


}