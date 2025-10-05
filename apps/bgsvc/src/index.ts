import express from 'express';
import redis from '@tutorr/common';
import { NotificationQueue, NotificationWorker } from '@tutorr/common';
import { createServer } from 'http';
import cors from 'cors';

const app = express();
const server = createServer(app);

app.use(cors({
    origin: "*",
    credentials: false,
}));

// Initialize queues and workers
// const backgroundJobQueue = new BackgroundJobQueue(redis);
// const backgroundJobWorker = new BackgroundJobWorker(redis);
const notificationQueue = new NotificationQueue(redis);

// Don't create notification worker here, create it after server initialization
let notificationWorker: any;

const startWorkers = async () => {
    try {
        console.log("🚀 Starting workers...");

        // Wait for background job worker to be ready
        // await backgroundJobWorker.waitUntilReady();
        console.log("✅ Background job worker is ready");

        // Create and start notification worker
        // Replace 'NotificationWorker' with the actual class name from your common package

        notificationWorker = new NotificationWorker(redis);
        await notificationWorker.waitUntilReady();
        console.log("✅ Notification worker is ready and listening for jobs");

        // Add the recurring background job
        // await backgroundJobQueue.addJob(
        //     "bgsq",
        //     {},
        //     {
        //         jobId: "bgsq", // make sure jobId is consistent
        //         repeat: { every: 12 * 60 * 60 * 1000 },
        //         attempts: 3,
        //         backoff: { type: "exponential", delay: 5000 },
        //     }
        // );
        // console.log("✅ Recurring background job scheduled (every 12 hours)");

        console.log("✅ All workers are running and ready to process jobs");

    } catch (error) {
        console.error("❌ Failed to start workers:", error);
        throw error;
    }
};

app.get("/health", (req, res) => {
    res.json({
        message: "Health Ok!",
        workers: {
            // backgroundJobWorker: !!backgroundJobWorker,
            notificationWorker: !!notificationWorker
        },
        timestamp: new Date().toISOString()
    });
});

// Add endpoint to manually trigger notification (optional)
app.post("/trigger-notification", async (req, res) => {
    try {
        // Example of how to add a notification job
        await notificationQueue.addJob("notification", {
            type: "test",
            message: "Manual notification trigger",
            timestamp: new Date().toISOString()
        });
        res.json({ message: "Notification job added successfully" });
    } catch (error) {
        console.error("❌ Error adding notification job:", error);
        res.status(500).json({ error: "Failed to add notification job" });
    }
});

server.listen(8003, async () => {
    console.log(`🌟 The server is up and running on port 8003`);
    try {
        // Start workers AFTER server is listening
        await startWorkers();
    } catch (error) {
        console.error("❌ Failed to start workers, shutting down server");
        process.exit(1);
    }
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
    console.log(`🛑 Received ${signal}. Shutting down gracefully...`);
    try {
        console.log("🔄 Stopping workers...");

        // Close workers in reverse order
        if (notificationWorker && typeof notificationWorker.close === 'function') {
            await notificationWorker.close();
            console.log("✅ Notification worker closed");
        }

        // if (backgroundJobWorker && typeof backgroundJobWorker.close === 'function') {
        //     await backgroundJobWorker.close();
        //     console.log("✅ Background job worker closed");
        // }

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

export { notificationQueue };