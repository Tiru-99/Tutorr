//query page to fetch 

//plan of work 
//STAGE 1 :
//check the input day of the week if it matches then with teachers proceed to next stage 

//STAGE 2
//then check for the date if the teacher availabilty for that date is registered 
//if not registered then that means that teacher is available on that day proceed for stage 3 

//if is registered check for the slots and map over each slots availability and check if the slots are
//available or not ; 

//STAGE 3 :
//check if the time slot matches with the teachers time slot 
import { NextRequest, NextResponse } from "next/server";
import prisma from '@tutorr/db';
export async function POST(req: NextRequest) {
    const { date, topic, time } = await req.json();

    if (!date || !topic || !time) {
        console.log("Incomplete details !", date , topic , time);
        return NextResponse.json({ error: "Incomplete Details" }, { status: 403 });
    }
    
    const receivedDate = new Date(date);
    //pass date as string from the frontend 
    const dayOfWeek = receivedDate.toString().slice(0, 3).toUpperCase();
    const dateOnly = date.split("T")[0];  
    //STAGE 1 
    //include all the teachers with the week 
    // if teacher availability is not registered still I will get all the teachers
    try {
        const teachers = await prisma.teacher.findMany({
            where: {
                available_days: {
                    has: dayOfWeek,
                },
            },
            include: {
                TeacherAvailability: {
                    where: {
                        date: dateOnly,
                    },
                    include: {
                        SlotDetails: true,
                    },
                }
            }
        });

        
    
        if (teachers.length <= 0) {
            console.warn("No Teachers found !");
            return NextResponse.json({ message: "No teacher found" }, { status: 404 });
        }
    
        //STAGE 2 algorithm 
    
        const availableTeachers = [];
    
        for (const teacher of teachers) {
            // Check if the teacher teaches the required topic
            
            if (!teacher.expertise?.includes(topic)) continue;
            
            const availability = teacher.TeacherAvailability[0]; // Only one due to @@unique
            
            let isAvailable = true;
            let matchingSlot = null;
    
            if (availability) {
               
                isAvailable = availability.isAvailable ?? true;
                console.log("Is Available");
                matchingSlot = availability.SlotDetails.find(
                    (slot) => slot.slotTime === time && slot.status === "AVAILABLE"
                );
               
            } else {
               
                // No entry means default available – still need to check default SlotDetails
                const defaultSlots = await prisma.slotDetails.findMany({
                    where: {
                        teacherId: teacher.id,
                        teacherAvailabilityId: null, // template slots
                        slotTime: time,
                        status: "AVAILABLE",
                    },
                });
    
                matchingSlot = defaultSlots[0] ?? null;
            }
    
            if (isAvailable && matchingSlot) {
                
                availableTeachers.push({
                    id: teacher.id,
                    name: teacher.name,
                    profile_pic: teacher.profile_pic,
                    price: teacher.price,
                    start_time : teacher.start_time , 
                    end_time : teacher.end_time , 
                    expertise: teacher.expertise,
                    slot: time,
                });
            }
        }

         
        if (availableTeachers.length === 0) {
            console.log("No teacher available");
            return NextResponse.json({ message: "No teacher available." }, { status: 404 });
        }
    
        return NextResponse.json({ teachers: availableTeachers }, { status: 200 });
    } catch (error) {
        console.log("Something went wrong" , error); 
        NextResponse.json({error : "Internal Server Error"} , {status : 500})
    }


}

