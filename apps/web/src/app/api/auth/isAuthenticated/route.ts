import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // if you are verifying jwt manually
import { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET! 

export async function GET(req: NextRequest) {
  try {

    const token = req.cookies.get("jwtToken")?.value;
    // <-- get the cookie named 'token' 
    

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Optionally verify the token if you want extra security
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
    
      return NextResponse.json({ authenticated: true, user: decoded }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ authenticated: false, message: "Invalid token" }, { status: 401 });
    }

  } catch (error) {
    console.error("Error checking auth:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

interface MyJwtPayload extends JwtPayload {
  id: string;
  type: 'student' | 'teacher';
}

//handler to check if user is "AUTHORISED"
export async function POST(req : NextRequest) {
  try {
    const {userType} = await req.json(); 
    const token = req.cookies.get("jwtToken")?.value;
  
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET!) as MyJwtPayload;
      if(decoded.type !== userType){
        return NextResponse.json({ authenticated : false } , {status : 401})
      }
      return NextResponse.json({ authenticated: true, user: decoded.id }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ authenticated: false, message: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
      console.log("Something went wrong while authorization check" , error);
      return NextResponse.json({ error : error} , { status : 404 });
  }
}