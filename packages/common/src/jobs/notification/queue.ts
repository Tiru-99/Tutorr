import { BaseQueue } from "../../bull/BaseQueue";
import { Redis } from 'ioredis';
import { NotificationJobType  , CancelBookingNotificationType} from "./types";

export class NotificationQueue extends BaseQueue<any> {
    constructor(redis: Redis) {
        super("notification", redis)
    }

    async addBookingNotification(jobData : NotificationJobType ) {
        const { bookingId , startTime , jobType } = jobData;

        if(!startTime){
            throw new Error("No Start Time received" + bookingId);
        }

        const now = new Date();

        //Instant Notification 
        await this.queue.add(`notification-${bookingId}-instant`, {
            jobType: "instant",
            bookingId
        });

        // One hour before reminder 
        const oneHourBefore = new Date(startTime);
        oneHourBefore.setHours(oneHourBefore.getHours() - 1);

        if (oneHourBefore > now) {
            await this.queue.add(`notification-${bookingId}-1hr`, {
                jobType: "one-hour-before",
                bookingId
            }, {
                delay: oneHourBefore.getTime() - now.getTime(),
            });
        }

        // on time notification 
        const meetingTime = new Date(startTime);
        if (meetingTime > now) {
            await this.queue.add(`notification-${bookingId}-on-time`, {
                jobType: "on-time",
                bookingId
            }, {
                delay: meetingTime.getTime() - now.getTime(),
            });
        }

        return { success: true }
    }

    async cancelBookingNotification(jobData: CancelBookingNotificationType) {
        const { bookingId} = jobData;

        // Job IDs to remove
        const jobIds = [
            `notification-${bookingId}-1hr`,
            `notification-${bookingId}-on-time`,
        ];

        try {
            for (const jobId of jobIds) {
                const job = await this.queue.getJob(jobId);
                if (job) {
                    const state = await job.getState();
                    if (state === "waiting" || state === "delayed") {
                        await job.remove();
                        console.log(`Removed job: ${jobId}`);
                    } else {
                        console.log(`Job ${jobId} already processed (${state})`);
                    }
                } else {
                    console.log(`Job ${jobId} not found`);
                }
            }

            //cancel booking event
            await this.queue.add(`cancel-booking`, {
                jobType: "cancel-booking",
                bookingId,
            });

            return { success: true };
        } catch (error) {
            console.error(`Error cancelling jobs for booking ${bookingId}:`, error);
            return { success: false, error };
        }
    }

}