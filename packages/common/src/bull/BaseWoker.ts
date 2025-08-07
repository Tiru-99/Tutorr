import { Worker, Job, WorkerOptions } from 'bullmq';
import Redis from 'ioredis';

/**
 * BaseWorker<T>
 * 
 * A reusable abstract base class for setting up BullMQ workers.
 * Designed to be extended by specific workers like NotificationWorker, PaymentWorker, etc.
 * 
 * - T is the generic type representing the job payload.
 * - Abstract class is used to enforce implementation of the `processJob` method in child classes.
 * - Automatically sets up common event listeners for job lifecycle events like completed, failed, stalled, etc.
 * 
 * Usage:
 * Extend this class and implement the `processJob` method to define job processing logic.
 */

export abstract class BaseWorker<T = any> {
    protected worker: Worker<T>;
    protected workerName: string

    constructor(
        queueName: string,
        connection: Redis,
        options?: WorkerOptions
    ) {
        this.workerName = queueName;
        this.worker = new Worker<T>(queueName,
            //In JavaScript, when you pass a method (like this.processJob) as a
            //  callback, you lose the context (this), unless you bind it.
            this.processJob.bind(this),
            {
                connection,
                ...options
            }
        );

        this.setupEventListeners(); 
    }


    // Abstract method that child classes must implement
    protected abstract processJob(job: Job<T>): Promise<any>;

    //setup event listeners for the workers 
    protected setupEventListeners() {
    
        this.worker.on('completed', (job) => {
            console.log(`Job ${job.id} completed successfully`);
        });

        this.worker.on('failed', (job, err) => {
            console.error(`Job ${job?.id} failed:`, err.message);
        });

        this.worker.on('error', (err) => {
            console.error('Worker error:', err);
        });

        this.worker.on('stalled', (jobId) => {
            console.warn(`Job ${jobId} stalled`);
        });
    }

    async close() {
        return this.worker.close(); 
    }

    async getWorker() {
        return this.worker; 
    }

    async waitUntilReady() {
        return new Promise((resolve, reject) => {
            if (this.worker.isRunning()) {
                resolve(true);
            } else {
                this.worker.once('ready', () => resolve(true));
                this.worker.once('error', reject);
            }
        });
    }
}
