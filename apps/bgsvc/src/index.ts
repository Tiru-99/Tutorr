import express from 'express';
import redis, { BackgroundJobWorker } from '@tutorr/common';
import { NotificationQueue, NotificationWorker, BackgroundJobQueue } from '@tutorr/common';
import { createServer } from 'http';
import cors from 'cors';

// Bull-board imports
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";

const app = express();
const server = createServer(app);

app.use(cors({
    origin: "*",
    credentials: false,
}));

// initialize queues
const notificationQueue = new NotificationQueue(redis);
const backgroundJobQueue = new BackgroundJobQueue(redis);

// worker instances
let notificationWorker: any;
let backgroundWorker: any;

// setup Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
    queues: [
        new BullMQAdapter(backgroundJobQueue.getQueue()),
        new BullMQAdapter(notificationQueue.getQueue())
    ],
    serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

// clean existing schedulers and setup cron
const setupSchedulers = async () => {
    try {
        console.log("🧹 Cleaning existing schedulers...");
        const existingSchedulers = await backgroundJobQueue.getQueue().getJobSchedulers();

        if (existingSchedulers.length > 0) {
            console.log(`Found ${existingSchedulers.length} existing scheduler(s):`);
            for (const scheduler of existingSchedulers) {
                console.log(`  - Removing: ${scheduler.key} (pattern: ${scheduler.pattern})`);
                await backgroundJobQueue.getQueue().removeJobScheduler(scheduler.key);
            }
        } else {
            console.log("✅ No existing schedulers to clean");
        }

        console.log("⏰ Setting up cron job...");
        await backgroundJobQueue.addCron("cron", {
            attempts: 3,
            backoff: 3000,
            removeOnFail: 100,
        });
        console.log("✅ Cron job scheduled successfully");

    } catch (error) {
        console.error("❌ Failed to setup schedulers:", error);
        throw error;
    }
};

// start all workers
const startWorkers = async () => {
    try {
        console.log("🚀 Starting workers...");

        // Start notification worker
        notificationWorker = new NotificationWorker(redis);
        await notificationWorker.waitUntilReady();
        console.log("✅ Notification worker is ready and listening for jobs");

        // Start background job worker
        backgroundWorker = new BackgroundJobWorker(redis);
        await backgroundWorker.waitUntilReady();
        console.log("✅ Background job worker is ready and listening for jobs");

        console.log("✅ All workers are running and ready to process jobs");

    } catch (error) {
        console.error("❌ Failed to start workers:", error);
        throw error;
    }
};

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        message: "Health Ok!",
        workers: {
            backgroundJobWorker: !!backgroundWorker,
            notificationWorker: !!notificationWorker
        },
        queues: {
            backgroundJobQueue: backgroundJobQueue.getQueueName(),
            notificationQueue: notificationQueue.getQueueName()
        },
        timestamp: new Date().toISOString()
    });
});

// Start the server
server.listen(8003, async () => {
    console.log(`🌟 Server is up and running on port 8003`);
    console.log(`📊 Bull Board available at http://localhost:8003/admin/queues`);
    
    try {
        await setupSchedulers();
        await startWorkers();
        
        console.log("🎉 Application started successfully!");
    } catch (error) {
        console.error("❌ Failed to start application, shutting down server");
        process.exit(1);
    }
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
    console.log(`🛑 Received ${signal}. Shutting down gracefully...`);
    try {
        console.log("🔄 Stopping workers...");

        // Close workers
        if (backgroundWorker && typeof backgroundWorker.close === 'function') {
            await backgroundWorker.close();
            console.log("✅ Background job worker closed");
        }

        if (notificationWorker && typeof notificationWorker.close === 'function') {
            await notificationWorker.close();
            console.log("✅ Notification worker closed");
        }

        // Close queues
        console.log("🔄 Closing queues...");
        await backgroundJobQueue.getQueue().close();
        await notificationQueue.getQueue().close();
        console.log("✅ Queues closed");

        // Close Redis connection
        console.log("🔄 Closing Redis connection...");
        await redis.quit();
        console.log("✅ Redis connection closed");

        // Close server
        console.log("🔄 Closing server...");
        server.close(() => {
            console.log("✅ Server closed successfully");
            process.exit(0);
        });

        // Force exit after 30 seconds if graceful shutdown fails
        setTimeout(() => {
            console.error("❌ Forceful shutdown after timeout");
            process.exit(1);
        }, 30000);

    } catch (err) {
        console.error("❌ Error during shutdown:", err);
        process.exit(1);
    }
};

// Handle different shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});

export { notificationQueue, backgroundJobQueue };