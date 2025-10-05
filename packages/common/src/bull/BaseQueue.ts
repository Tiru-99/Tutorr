import { Queue, JobsOptions, QueueOptions, Job } from 'bullmq';
import { Redis } from 'ioredis';

/**
 * BaseQueue<T>
 * 
 * A reusable abstract base class for setting up BullMQ queues.
 * Designed to be extended by specific queues like NotificationQueue, PaymentQueue, etc.
 * 
 * - T is the generic to give the payload for the queue
 * - abstract is used here to extend the class for further queues like notification queue 
 *   where params can be slightly different
 */


export abstract class BaseQueue<T = any> {
    protected queue: Queue; // Remove the generic here
    protected queueName: string;

    constructor(queueName: string, connection: Redis, options?: QueueOptions) {
        this.queueName = queueName;
        this.queue = new Queue(queueName, { // Remove generic here too
            connection,
            ...options
        });

        this.setupEvents();
    }

    private setupEvents() {
        this.queue.on('error', (err) => {
            console.error(`Queue ${this.queueName} error:`, err);
        });

        this.queue.on('waiting', (job) => {
            console.log(`Job ${job.id} waiting in ${this.queueName}`);
        });
    }

    async addJob(jobName: string, data: T, options?: JobsOptions) {
        console.log("Adding job")
        return await this.queue.add(jobName, data, options);
    }

    async addCron(jobName: string, options?: JobsOptions) {
        const schedulerId = 'cron-job'; //fixed id because of only one cron job
        const pattern = '0 0 */12 * * *'; // every 12 hours

        console.log("Executing cron job");

        const jobAdded =  await this.queue.upsertJobScheduler(
            schedulerId,
            { pattern },
            {
                name: jobName,
                data : {},
                opts: options,
            }
        );

        console.log("job added" , jobAdded);
        return jobAdded; 
    }


    async getQueueName() {
        return this.queueName;
    }

    getQueue() {
        return this.queue;
    }
}