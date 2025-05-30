import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { uploadFileToCloudinary } from "@/utils/uploadFileToCloudinary";
import { UploadStream } from "cloudinary";

export async function POST(req: NextRequest) {
    const formData = await req.formData();

    //extract fields with file data 
    const files = {
        profile_pic: formData.get("profile_pic") as File | null,
        banner_pic: formData.get("banner_pic") as File | null,
        license: formData.get("license") as File | null,
    };

    console.log("the input files are" , files); 

    //extract fields with text data
    const fields = {
        name: formData.get("name") as string,
        phone_number: formData.get("phone_number") as string,
        company_name: formData.get("company_name") as string,
        highest_education: formData.get("highest_education") as string,
        years_of_exp: formData.get("years_of_exp") as string,
        about: formData.get("about") as string,
        session_duration: formData.get("session_duration") as string,
        start_time: formData.get("start_time") as string,
        end_time: formData.get("end_time") as string,
        price : formData.get("price") as string
    };

    const email = formData.get("email") as string ; 

    let parsedExpertise = [];
    let parsedAvailableDays = [];

    try {
        //parsing the incoming string data into array of strings 
        parsedExpertise = JSON.parse(formData.get("expertise") as string );
        parsedAvailableDays = JSON.parse(formData.get("available_days") as string);
    } catch (err) {
        return NextResponse.json({ message: "Invalid JSON in expertise or available_days" }, { status: 400 });
    }

    const existingUser = await prisma.teacher.findFirst({
        where: { user: { email: email } },
    });

    if (!existingUser) {
        return NextResponse.json({ message: "No existing user with this email found" }, { status: 404 });
    }

    const dataToUpdate: any = {
        ...fields,
    };

    if (parsedExpertise && parsedExpertise.length > 0) {
        dataToUpdate.expertise = parsedExpertise;
    }

    if(parsedAvailableDays && parsedAvailableDays.length > 0){
        dataToUpdate.available_days = parsedAvailableDays
    }


    // Upload files and update URLs parallely
    const folderMap: Record<string, string> = {
        profile_pic: "tutor_teacher_profile_pic",
        banner_pic: "tutor_teacher_banner_pic",
        license: "tutor_teacher_license",
    };

    console.log("The folder map is" , folderMap); 
    
    const uploadPromises = Object.entries(files).map(async ([key, file]) => {
        if (!file) return null;
        const fileUrl: any = await uploadFileToCloudinary(file, folderMap[key], existingUser.id);
        return { key, url: fileUrl.secure_url };
    });
    
    try {
        //upload all the incoming image in one go
        const uploadResults = await Promise.all(uploadPromises);
        console.log("The upload results are" , uploadResults);

        if(uploadResults){
            console.log("Coming into the upload result")
            uploadResults.map((result) => {
                if(result && result.url && result.key){
                    console.log("Coming into the part 1");
                    //append the updated key and url to dataToUpdate
                    dataToUpdate[result.key] = result.url
                }
            });
        }
    } catch (err) {
        console.error('Upload error:', err);
        return NextResponse.json({ error: 'Something went wrong while uploading files' }, { status: 500 });
    }
    
    console.log("The data to update is " , dataToUpdate)

    try {
        const updatedTeacher = await prisma.teacher.update({
            where: { id: existingUser.id },
            data: dataToUpdate,
        });

        return NextResponse.json({
            message: "Teacher profile updated successfully",
            data: updatedTeacher,
        });
    } catch (error) {
        console.error("Error updating teacher:", error);
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }
}
