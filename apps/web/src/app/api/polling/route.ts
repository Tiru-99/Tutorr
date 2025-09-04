
import { NextRequest, NextResponse } from "next/server";
import prisma from '@tutorr/db';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
        console.log("No incoming id found");
        return NextResponse.json({
            message: " No incoming id found"
        }, { status: 400 });
    }

    try {
        //polling for 30 seconds
        const timeout = 30 * 1000 ; 
        const interval = 2 * 1000 ; 
        const maxAttempts = timeout / interval 
        let attempts = 0 ; 
       
        while( attempts < maxAttempts ){
    
            const session = await prisma.session.findFirst({
                where : {
                    id : id 
                }
            }) ; 
    
            if(session?.booking_status === "SUCCESS"){
                return NextResponse.json({message : " Booking Confirmed " , session : session })
            }
    
            //wait for 2 seconds before reunning 
            await new Promise( resolve => setTimeout(resolve , interval)); 
            attempts++ ; 
        }
    
        //return Timout error 
        return NextResponse.json({ message : "Timeout Error reached , contact support"} , { status : 202})
    } catch (error) {
        console.log("something went wrong while booking" , error); 
        return NextResponse.json({ message : "Something went wrong"} , {status : 500});
    }

}