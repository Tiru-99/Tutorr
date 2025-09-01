import { BaseWorker } from "../../bull/BaseWoker";
import { Job } from "bullmq";
import Redis from 'ioredis';
import { BookingCreationData, BookingJobData } from "./types";
import { acquireLockWithFencing } from "../../config/aquireLock";
import redis from "../../config/redis";
import { createOrder } from "../../config/createOrder";
import prisma from '@tutorr/db';
import { createMeeting } from "../../config/createMeeting";
import { Server as SocketIoServer } from 'socket.io';


export class BookingWorker extends BaseWorker<any> {
    private io: SocketIoServer;
    constructor(redis: Redis, io: SocketIoServer) {
        super('booking', redis);
        this.io = io;
    }


    protected async processJob(job: Job<BookingJobData>): Promise<any> {
        const { jobType } = job.data;
        const jobId = job.id;

        try {
            //route jobTypes to processes 
            switch (jobType) {
                case "attempt-booking":
                    return await this.handleBookingAttempt(job.data, jobId!);
                case "create-booking":
                    return await this.handleBookingCreation(job.data as BookingCreationData);
                case "cancel-booking":
                    return await this.handleBookingCancellation(job.data);
            }
        } catch (error) {
            console.log("Something went wrong while queue routing", error);
            throw error;
        }
    }

    private async handleBookingAttempt(jobData: BookingJobData, jobId: string) {
        const { studentId, teacherId, startTime, endTime, request_id, price, date, jobType } = jobData;
        console.log("In the booking attempt section ");
        console.log("the socket is ", this.io);
        //create a lock key 
        try {
            const lockKey = `lock:tutor:${teacherId}:${startTime}`;
            const ttl = 300000 // 5 minutes 

            let fencingToken: number;

            fencingToken = await acquireLockWithFencing(redis, lockKey, ttl);

            if (!fencingToken) {
                //notify user 
                console.log("Please try again later");
                this.io.emit(`bookingUpdate/${jobId}`, {
                    message: "Slot under booking , try again later"
                })
                return;
            }

            const options = {
                amount: price * 100, //convert to paise 
                currency: 'USD',
                receipt: `receipt_${request_id}`,
            }

            const order: any = await createOrder(options);

            console.log("the order is ", order);

            //store booking context
            await redis.setex(`booking:${order.id}`, 30000, JSON.stringify({
                studentId, teacherId, startTime, endTime, fencingToken, request_id, date
            }));

            const orderToSend = {
                key: order.key,
                id: order.id,
                amount: order.amount,
                currency: order.currency
            }

            //emit this to the frontned 
            this.io.emit(`bookingUpdate/${jobId}`, {
                order: orderToSend,
                success: "true",
                error: null
            })
        } catch (error) {
            console.log("Something went wrong while attempting booking", error, this.io);
            this.io.emit(`bookingUpdate/${jobId}`, {
                message: "Something went wrong while booking attempt",
                error: error
            })
        }

    }

    private async handleBookingCreation(jobData: BookingCreationData) {
        const { studentId, teacherId, fencingToken, startTime, endTime, paymentId, orderId, amount, date, sessionId } = jobData;
        const lockKey = `lock:tutor:${teacherId}:${startTime}`

        const eventName = `bookingUpdate/${orderId}`;

        //validate the fencing token 
        try {
            const currentToken = await redis.get(lockKey);
            console.log("The current token is", currentToken);
            if (!currentToken || parseInt(currentToken) !== fencingToken) {
                this.io.emit(`bookingUpdate/${orderId}`, {
                    message: null,
                    error: "Invalid or expired fencing token"
                })
                throw new Error("Invalid or expired fencing token");

            }
            //check if the slot id is template slot of availability slotid

            //book the meeting and the save the details in db
            const bookingData = {
                studentId,
                teacherId,
                startTime,
                endTime,
                paymentId,
                sessionId,
                orderId,
                date , 
                amount 
            }
            const booking = await this.createBooking(bookingData);

            if (!booking) {
                this.io.emit(eventName, {
                    message: null,
                    error: "Something went wrong while creating booking"
                })
                throw new Error("Something went wrong while creating booking");
            }

            //check if the wallet exists 
            let wallet = await prisma.wallet.findFirst({
                where: {
                    teacherId
                }
            });

            if (!wallet) {
                try {
                    wallet = await prisma.wallet.create({
                        data: {
                            teacherId,
                            amount: "0.00", // String as per schema
                            currency: 'USD'
                        }
                    });
                } catch (error) {
                    this.io.emit(eventName, {
                        message: null,
                        error: "Wallet Creation failed"
                    });
                    console.log("Wallet Creation failed", error);
                    return; // exit if wallet creation fails 
                }
            }

            await prisma.transactions.create({
                data: {
                    studentId,
                    teacherId,
                    type: "PAYOUT",
                    walletId: wallet.id,
                    bookingId: booking.id,
                    amount: parseFloat(amount) / 100

                }
            })

            //update the wallet's total balance based on the "WITHDRAWAL" in the cron job


            //send notification 
            //notification queue here 

            //release lock 
            await redis.del(lockKey);

            this.io.emit(eventName, {
                message: "The booking is created successfully",
                bookingId: booking.id,
            });
            return { success: true, bookingId: booking.id };
        } catch (error) {
            console.log("The booking creating failed : ", error);

            //release lock if anything failed 
            await redis.del(lockKey);

            this.io.emit(eventName, {
                message: null,
                error: "There was some problem while creating booking , please contact support !"
            });

            throw new Error(`Booking failed: ${error || "Unknown error"}`);
        }

    }

    private async createBooking(bookingData: any) {
        const { studentId, teacherId, startTime, endTime, paymentId, orderId, date, sessionId , amount } = bookingData;
        //create a meeting url here and save it to the db
        try {
            const meetingLink = createMeeting();

            //find booking 

            const booking = await prisma.booking.update({
                where: {
                    id: sessionId,
                },
                data: {
                    status: 'SCHEDULED',
                    meeting_url: meetingLink,
                    order_id: orderId,
                    payment_id: paymentId,
                    startTime,
                    endTime ,
                    amount : parseFloat(amount)/100
                }
            });

            console.log("The date in the worker is ", date);
            //create a teacher Availability as well for that day 
            const schedule = await prisma.schedule.findFirst({
                where: {
                    teacherId
                },
                include: {
                    availability: true
                }
            });

            console.log("The found schedule is ", schedule);

            const availability = schedule?.availability;

            await prisma.availability.create({
                data: {
                    teacherId,
                    scheduleId: schedule?.id,
                    date,
                    startTime,
                    endTime,
                    status: "BOOKED"
                }
            })


            return booking;
        } catch (error) {
            console.log("Something went wrong while creating booking ", error);
        }
    }

    private async handleBookingCancellation(bookingCancellationData: any) {
        //todo
    }

}