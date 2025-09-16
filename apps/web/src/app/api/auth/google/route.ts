import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

export async function POST(req: NextRequest) {
  console.log("the code is coming into the backend part")
  try {
    const { idToken, role } = await req.json();
    if (!idToken || !role) {
      throw new Error("Incomplete details sent!");
    }
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: "Invalid Google token payload" },
        { status: 400 }
      );
    }
    console.log("the payload is " , payload ,payload.sub); 
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
      include: { student: true, teacher: true },
    });

    if(user){
      if(role !== user.type){
        return NextResponse.json({
          error : "User is already registered as " + user.type.toLowerCase(),
          message : "User is already registered as " + user.type.toLowerCase()
        } , { status : 400})
      }
    }

    if (!user) {
      if (role === "STUDENT") {
        user = await prisma.user.create({
          data: {
            email: payload.email,
            password: "",
            type: role,
            googleId: payload.sub,
            student: {
              create: {
                name: payload.name ?? "Unnamed",
              },
            },
          },
          include: { student: true, teacher: true },
        });
      } else if (role === "TEACHER") {
        user = await prisma.user.create({
          data: {
            email: payload.email,
            password: "",
            type: role,
            googleId: payload.sub,
            teacher: {
              create: {
                name: payload.name ?? "Unnamed",
              },
            },
          },
          include: { student: true, teacher: true },
        });
      }
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { email: payload.email },
        data: { googleId: payload.sub },
        include: { student: true, teacher: true },
      });
    }

    if (!user) {
      throw new Error("User not created!");
    }

    // Sign JWT
    const token = jwt.sign(
      {
        id: user.id,
        type: user.type,
        studentId: user.student?.id ?? null,
        teacherId: user.teacher?.id ?? null,
      },
      process.env.JWT_SECRET!, // Make sure this is set in env
    );

    const response = NextResponse.json({
      message: "User logged in successfully",
      userId: user.id,
      type: user.type,
      name: user.student?.name ?? user.teacher?.name ?? payload.name,
      email: user.email,
      token,
      studentId: user.student?.id ?? null,
      teacherId: user.teacher?.id ?? null,
    });
    //setting cookies
    response.cookies.set(
      'jwtToken',
      token,
      {
        httpOnly: true,
        secure: true
      }
    );
    return response; 
  } catch (error: any) {
    console.error("Auth Error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
