import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('jwtToken')?.value;
  
  console.log("Middleware running, token present:", !!token);
  
  if (!token) {
    return new NextResponse(
      JSON.stringify({ message: "Incoming Token not found" }),
      { status: 401 }
    );
  }

  try {
    // Use jose library for Edge Runtime compatibility
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    
    const { payload } = await jwtVerify(token, secret);
    console.log("Token verified successfully", payload);

    // Pass the user ID through headers - we'll fetch user data in the route handler
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.id as string);
    if(payload.teacherId) requestHeaders.set("x-teacher-id" , payload.teacherId as string)
    if(payload.studentId) requestHeaders.set("x-student-id" , payload.studentId as string)
    
    console.log("Headers set, proceeding to route handler");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    console.error("Middleware JWT verification error:", error);
    return new NextResponse(
      JSON.stringify({ 
        message: "Invalid token", 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/api/((?!auth/).+)",
  ],
};