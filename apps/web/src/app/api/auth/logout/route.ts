import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  //clear the cookie
  response.cookies.set("jwtToken", "", {
    httpOnly: true,
    secure: true,
    maxAge: 0, 
  });

  return response;
}
