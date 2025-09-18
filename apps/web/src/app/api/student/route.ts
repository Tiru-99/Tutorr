import { NextRequest, NextResponse } from "next/server";
import prisma from '@tutorr/db';
import { uploadFileToCloudinary } from "@/utils/uploadFileToCloudinary";


export async function POST(req: NextRequest) {
    //file , name , phone number , email  
    // use form data in frontend to upload images
    const formData = await req.formData();

    const profile_pic = formData.get("profile_pic") as File | null;
    const banner_pic = formData.get("banner_pic") as File | null;

    const name = formData.get("name") as string;
    const phoneNumber = formData.get("phone_number") as string;
    const email = formData.get("email") as string;
    const interests = formData.get("interests") as any ; 
    const parsedInterests = JSON.parse(interests);

    try {
        const existingUser = await prisma.student.findFirst({
            where: {
                user: {
                    email: email
                }
            }
        });

        console.log("The existing user is ", existingUser)

        if (!existingUser) {
            console.log("No exising user with the email found");
            return NextResponse.json({
                message: "No existing user with email found"
            });
        }

        const dataToupdate: any = {}

        const fileToUpload = profile_pic || banner_pic;
        const folderName = profile_pic ? "tutor_student_profile_pic" : "tutor_student_banner_pic";

        if (fileToUpload) {
           try {
             
             const fileUrl: any = await uploadFileToCloudinary(fileToUpload, folderName, existingUser.id);
            
             if (fileToUpload === profile_pic) {
                 dataToupdate.profile_pic = fileUrl.secure_url
             } else {
                 dataToupdate.banner_pic = fileUrl.secure_url
             }
           } catch (error) {
                console.log("Student file upload Error : " , error);
                return NextResponse.json({
                    message: "Something went wrong while updating the student file",
                    error: error
                });
           }
        }

        if (name) dataToupdate.name = name;
        if (phoneNumber) dataToupdate.phoneNumber = phoneNumber;
        if(interests) dataToupdate.interests = parsedInterests;


        const student = await prisma.student.update({
            where: {
                id: existingUser.id
            },
            data: dataToupdate
        });

        console.log("Successfully updated the student data !", student);
        return NextResponse.json({
            message: "Student data updated", 
            data : student
        })
    } catch (error) {
        console.log("Something went wrong while updating the students", error);
        return NextResponse.json({
            message: "Something went wrong while updating the student data",
            error: error
        });
    }

}