import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { JwtPayload } from "jsonwebtoken";


interface MyJwtPayload extends JwtPayload {
    id: string;
    type: 'STUDENT' | 'TEACHER';
}

//logic to only allow student users to proceed for booking a teacher , 
// teachers are not allowed to book teachers

export async function GET(req: NextRequest) {
    const token = req.cookies.get("jwtToken")?.value;

    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as MyJwtPayload;
        console.log("the decoded user type is " , decoded.type); 
        if (decoded.type === "TEACHER") {
            console.log("Teacher not allowed");
            return NextResponse.json(
                { message: "Use a student account to access this page" , authorized : false , authenticated : true},
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: "All good", authenticated: true, authorized: true },
            { status: 200 }
        );

    } catch (err) {
        console.error("Invalid or expired token", err);
        return NextResponse.json(
            { message: "Invalid or expired token", authenticated: false },
            { status: 401 }
        );
    }
}