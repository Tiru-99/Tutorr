import { BaseWorker } from "../../bull/BaseWoker";
import prisma from "@tutorr/db";
import { NotificationData, NotificationType, sendEmail } from "@tutorr/emails";
import { Job } from "bullmq";
import { Redis } from "ioredis"
import { NotificationJobType } from "./types";



export class NotificationWorker extends BaseWorker<any> {
    constructor(redis: Redis) {
        super("notification", redis)
    }

    protected async processJob(job: Job<NotificationJobType>): Promise<any> {
        const { jobType } = job.data;

        switch (jobType) {
            case "instant":
            case "one-hour-before":
            case "on-time":
                return await this.sendBookingNotification(job.data)

            case "cancel-booking":
                return await this.handleCancelBooking(job.data)
        }
    }

    private async sendBookingNotification(jobData: any) {
        const { bookingId, jobType } = jobData;
        //send notification to teacher and student about booking confirmed
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
            },
            include: {
                teacher: {
                    select: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                        name: true
                    },
                },
                student: {
                    select: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                        name: true
                    },
                },
            },
        });


        if (!booking || !booking.teacher || !booking.student) {
            throw new Error("Booking , teacher or student not found")
        }

        const notificationData: NotificationData = {
            to: [booking.teacher.user.email, booking.student.user.email],
            studentName: booking.student.name!,
            teacherName: booking.teacher.name!,
            meetingTime: booking.startTime!,
            meetingLink: booking.meeting_url!,
            bookingId: booking.id,
            studentEmail: booking.student.user.email,  // ✅ added
            teacherEmail: booking.teacher.user.email,  // ✅ added
        }

        return await sendEmail(jobType as NotificationType, notificationData);

    }

    private async handleCancelBooking(jobData: any) {
        const { bookingId } = jobData;
        //send cancellation notification 
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
            },
            include: {
                teacher: {
                    select: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                        name: true
                    },
                },
                student: {
                    select: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                        name: true
                    },
                },
            },
        });


        if (!booking || !booking.student || !booking.teacher) {
            throw new Error("No booking , student or teacher found");
        }

        const notificationData: NotificationData = {
            to: [booking.teacher.user.email, booking.student.user.email],
            studentName: booking.student.name!,
            teacherName: booking.teacher.name!,
            meetingTime: booking.startTime!,
            meetingLink: booking.meeting_url!,
            bookingId: booking.id,
            cancelledBy: booking.cancellationBy ?? "SYSTEM",
            studentEmail: booking.student.user.email,  // ✅ added
            teacherEmail: booking.teacher.user.email,  // ✅ added
        }

        return await sendEmail("cancel-booking", notificationData);

    }

}