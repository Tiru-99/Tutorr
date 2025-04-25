import { NextRequest , NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { uploadFileToCloudinary } from "@/utils/uploadFileToCloudinary";


export async function POST(req : NextRequest , res : NextResponse) {
    //file , name , phone number , email  
    const formData = await req.formData();

    const profile_pic = formData.get("profile_pic") as File | null;
    const banner_pic = formData.get("banner_pic") as File | null;

    const name = formData.get("name") as string;
    const phone_number = formData.get("phone_number") as string;
    const email = formData.get("email") as string;

   try {
     const existingUser = await prisma.student.findFirst({
         where :{
             user: {
                 email : email
             }
         }
     });

     console.log("The existing user is ", existingUser)
 
     if(!existingUser){
         console.log("No exising user with the email found");
         return NextResponse.json({
             message : "No existing user with email found"
         });
     }
 
     const dataToupdate : any = {}

     const fileToUpload = profile_pic || banner_pic ; 
     const folderName = profile_pic ? "tutor_student_profile_pic" : "tutor_student_banner_pic";

     if(fileToUpload){
        const fileUrl : any = await uploadFileToCloudinary(fileToUpload , folderName , existingUser.id);
        console.log("The file url is " , fileUrl);
        if(fileToUpload === profile_pic){
            dataToupdate.profile_pic = fileUrl.secure_url
        } else{
            dataToupdate.banner_pic = fileUrl.secure_url
        }
     }

     if(name) dataToupdate.name = name ; 
     if(phone_number) dataToupdate.phone_number = phone_number; 
 
 
     const student = await prisma.student.update({
         where :{
             id : existingUser.id
         } , 
         data : dataToupdate
     });

     console.log("Successfully updated the student data !",student.id , student.userId);
     return NextResponse.json({
        message:"Student data updated"
     })
   } catch (error) {
        console.log("Something went wrong while updating the students" , error);
        return NextResponse.json({
            message : "Something went wrong while updating the student data",
            error : error
        });
   }
    
}