import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from '@tutorr/db';

// Defining the id as string in JwtPayload, as there's no `id` type in JwtPayload type
interface CustomJwt extends JwtPayload {
  id: string;
}

export async function middleware(req: NextRequest) {
  
  const token = req.headers.get("Authorization")?.split(" ")[1] || req.cookies.get('jwtToken')?.value //extractting the cookie value from the user

  if (!token) {
    return new NextResponse(
      JSON.stringify({ message: "Incoming Token not found" }),
      { status: 401 }
    );
  }

  try {
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwt;

    // Fetch the user from the database using the decoded token's user ID
    const existingUser = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    // If user doesn't exist, send an error
    if (!existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    // Attach the user to the request context for later use in the handler
    (req as any).user = existingUser;

    // Proceed to the next middleware or handler
    return NextResponse.next();
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid token", error: error}),
      { status: 400 }
    );
  }
}

