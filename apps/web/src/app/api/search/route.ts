

// export async function POST(req: NextRequest) {
//     const { date, time, topic, price, name } = await req.json();
//     console.log("The data is " , date , topic , time , price , name); 
//     if (!date && !time && !topic && !price && !name) {
//         console.log("No filteres received");
//         return NextResponse.json({ error: "No filtered received" }, { status: 403 });
//     }
//     //bad code below : -> 😮‍💨

//     //first find tutorss for date and time 
//     // 1) find by week and check if tutor is available for that week 
//     // 2) check for the availability  , if the current date is present in the availability table , 
//     // check its availability and return the data 
//     //3) check if the slot time is available 

//     // if (date) {
//     //     const formattedDate = new Date(date); //Wed , 20th June 2025 
//     //     const dayOfWeek = formattedDate.toString().slice(0, 3).toUpperCase();
//     //     const dateOnly = date.split("T")[0];


//     //     //find all the teachers 
//     //     const teachers = await prisma.teacher.findMany({
//     //         where: {
//     //             available_days: {
//     //                 has: dayOfWeek,
//     //             },
//     //         },
//     //         include: {
//     //             TeacherAvailability: {
//     //                 where: {
//     //                     date: dateOnly,
//     //                 },
//     //                 include: {
//     //                     SlotDetails: true,
//     //                 },
//     //             }
//     //         }
//     //     });

//     //     console.log("the teachers are : ", teachers);

//         //*********** hardcoded logic below because we are filtering on application side  *********//
//         // const availableTeachers = [];

//         // function hasValidSlot(slots : CommonSlot[], time : string[]) {
//         //     return slots.some(slot => time.includes(slot.slotTime!) && slot.status === "AVAILABLE");
//         // }

//         // for (const teacher of teachers) {
//         //     const validTopic = teacher.expertise.some(exp => topic.includes(exp));
//         //     if (!validTopic) continue;

//         //     const availability = teacher.TeacherAvailability[0];

//         //     if (!availability) {
//         //         const templateSlots = await prisma.templateSlots.findMany({
//         //             where: { teacherId: teacher.id },
//         //         });

//         //         if (templateSlots.length === 0 || !hasValidSlot(templateSlots, time)) {
//         //             continue;
//         //         }

//         //         availableTeachers.push(teacher);
//         //         continue;
//         //     }

//         //     const teacherAvailabilitySlots = availability.SlotDetails;
//         //     if (!teacherAvailabilitySlots || !hasValidSlot(teacherAvailabilitySlots, time)) {
//         //         continue;
//         //     }

//         //     availableTeachers.push(teacher);
//         // }


//         //********* good and efficient logic due in database level filtering ***********//

//     // }

//     //good code below -> 🗿🗿🗿

//     //applying filter at database level 
//     let dayOfWeek ; 
//     let formattedDate ; 
//     let dateOnly ; 
//     //building our own custom filter 
//     let where : Prisma.TeacherWhereInput = {} ; 

//     //Only filter if the date is provided 

//     if(date){
//         formattedDate = new Date(date); //Wed , 20th June 2025 
//         dayOfWeek = formattedDate.toString().slice(0, 3).toUpperCase();
//         dateOnly = date.split("T")[0];

//         where.available_days = {
//             has : dayOfWeek 
//         }
//     }
//     //If name is available filter 

//     if(name){
//         where.name ={
//             contains : name , 
//             mode : "insensitive"
//         }
//     }
//     //If price is available filter 

//     if(price){
//         where.price = {
//             gte:price[0] , 
//             lte:price[1]
//         }
//     }

//     //if topic is available filter

//     if(topic && topic.length > 0){
//         where.expertise = {
//             hasSome : topic
//         }
//     }

//     //if time is available filter 

//     if(time){
//         where.OR = [
//             //Regualar Availability Slots 
//             {
//                 TeacherAvailability :  {
//                     some : {
//                         ...(date && {date : dateOnly}),
//                         SlotDetails :{
//                             some : {
//                                 slotTime : {in : time},
//                                 status : "AVAILABLE"
//                             }
//                         }
//                     }
//                 }
//             } ,

//             //template slots FallBack
//             {
//                 TemplateSlots : {
//                     some :{
//                         slotTime : { in : time}, 
//                         status : "AVAILABLE"
//                     }
//                 }
//             }
//         ];
//     }

//     console.log("The where query is " ,where); 

//     try {
//         const availableTeachers = await prisma.teacher.findMany({ 
//             where,
//             include: {
//               TeacherAvailability: {
//                 ...(date && {
//                   where: {
//                     date: dateOnly,
//                   }
//                 }),
//                 include: {
//                   SlotDetails: true,
//                 },
//               }
//             }
//           });

//           console.log("Available Teachers : " , availableTeachers);
//           return NextResponse.json({message :"Teachers fetched successfully" , teachers : availableTeachers} , {status : 200});
//     } catch (error) {
//         console.log("Something went wrong while getting search results " , error); 
//         return NextResponse.json({error : "Error while getting results"} , {status : 500}); 
//     }


// }

import { NextRequest, NextResponse } from "next/server";
import prisma from "@tutorr/db";
import { Prisma } from "@tutorr/db"


export async function POST(req: NextRequest) {
    const { startTime, endTime, topic, date, price, name } = await req.json();

    if (!startTime || !endTime || !topic || !date || !price || !name) {
        //user has passed no filters then return him all teachers 
        try {
            const teachers = await prisma.teacher.findMany();
            return NextResponse.json({
                teachers,
                message: "Returned available teachers"
            });
        } catch (error) {
            console.log("Something went wrong while fetching all teachers" , error); 
            return NextResponse.json({
                error ,
                message : "Something went wrong while fetching teachers"
            } , { status : 500 })
        }
    }

    //extract day of the week from the date and then convert the date in the proper utc format
    // build a query 
    // query requirements : 
    // search by name , price , topic , date , startTime and endTime 
    // fist find the teacher by the day of the week and check if there is any override with status available and if the status is available 
    const where: Prisma.TeacherWhereInput = {};

    if (date) {
        const formatted = new Date(date); // e.g., "Wed, 20 Aug 2025"
        const isoDate = formatted.toISOString().split("T")[0] + "T00:00:00.000Z";
        const weekDay = formatted.toString().slice(0, 3).toUpperCase();

        where.OR = [
            // Case 1: Teacher has availability for that specific date
            {
                Availability: {
                    some: {
                        date: new Date(isoDate),
                        status: "AVAILABLE",
                        ...(startTime &&
                            endTime && {
                            startTime: { lte: endTime },
                            endTime: { gte: startTime },
                        }),
                    },
                },
            },

            // Case 2: Teacher has recurring schedule if no override exists
            {
                AND: [
                    {
                        Availability: {
                            none: {
                                date: isoDate, // no overrides
                            },
                        },
                    },
                    {
                        Schedule: {
                            some: {
                                days: { has: weekDay },
                                availability: {
                                    some: {
                                        status: "AVAILABLE",
                                        ...(startTime && endTime ? {
                                            startTime: { lte: endTime },
                                            endTime: { gte: startTime },
                                        } : {}),
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        ];
    }

    // name filter
    if (name) {
        where.name = {
            contains: name,
            mode: "insensitive",
        };
    }

    // price filter
    if (price) {
        where.price = {
            gte: price[0],
            lte: price[1],
        };
    }

    // topic filter
    if (topic && topic.length > 0) {
        where.expertise = {
            hasSome: topic,
        };
    }


    try {
        // finally write the query 
        const availableTeachers = await prisma.teacher.findMany({
            where,
            include: {
                Availability: true,
                Schedule: true,
            }
        });

        return NextResponse.json({
            teachers: availableTeachers,
            message: "Returned available teachers"
        });

    } catch (error) {
        console.log("Something went wrong while searching teachers", error);
        return NextResponse.json({
            error
        }, { status: 500 })
    }




}