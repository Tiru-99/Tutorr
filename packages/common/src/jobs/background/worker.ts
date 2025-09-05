import { BaseWorker } from "../../bull/BaseWoker";
import { Job } from "bullmq";
import { Redis } from "ioredis";
import prisma from "@tutorr/db";



export class BackgroundJobWorker extends BaseWorker<any> {
    constructor(redis: Redis) {
        super("bgsq", redis);
    }

    protected async processJob(job: Job): Promise<any> {
        //update all scheduled bookings to complete 
        try {
            await prisma.$transaction(async (tx) => {
                await tx.booking.updateMany({
                    where: {
                        status: "SCHEDULED",
                        endTime: { lt: new Date() },
                    },
                    data: { status: "COMPLETED" },
                });
    
                await tx.transactions.updateMany({
                    where: {
                        type: "PAYOUT",
                        booking: { endTime: { lt: new Date() } },
                    },
                    data: { type: "WITHDRAWAL" },
                });
            });
        } catch (error) {
            console.log("Something went wrong while background job processing" , error);
            throw new Error("Something went wrong while background job processing")
        }
    }
}