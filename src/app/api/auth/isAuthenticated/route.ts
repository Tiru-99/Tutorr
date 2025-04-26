import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // if you are verifying jwt manually

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET // keep secret in .env

export async function GET(req: NextRequest) {
  try {
    console.log("The code is reaching in the backend part of is authenticated");
    const token = req.cookies.get("jwtToken")?.value; // <-- get the cookie named 'token'
    console.log("The token is " , token);

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Optionally verify the token if you want extra security
    try {
      const decoded = jwt.verify(token, JWT_SECRET!);
      return NextResponse.json({ authenticated: true, user: decoded }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ authenticated: false, message: "Invalid token" }, { status: 401 });
    }

  } catch (error) {
    console.error("Error checking auth:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}