import express from 'express';
import { setupSocketIO } from './socket';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { BookingWorker } from '@tutorr/common'; 
import redis from '@tutorr/common';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config({
    path: "./.env"
});

const app = express();
const server = createServer(app);

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: false,
}));

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL!,
        methods: ["GET", "POST"],
        credentials: false
    },
});

setupSocketIO(io);

// Don't import bookingWorker, create it here
let bookingWorker: BookingWorker;

const startWorker = async () => {
    try {
        console.log("🚀 Starting worker...");
        console.log("🔍 IO instance exists:", !!io);
        console.log("🔍 IO emit function exists:", typeof io.emit);
        
        // Create worker AFTER io is fully initialized
        bookingWorker = new BookingWorker(redis, io);
        await bookingWorker.waitUntilReady();
        console.log("✅ Worker is running and ready to process jobs.");
        
    } catch (error) {
        console.error("❌ Failed to start worker:", error);
    }
};

export { io };

app.get('/', (req, res) => {
    res.send("health ok !");
});

server.listen(8001, async () => {
    console.log(`The app is listening on PORT 8001`);
    // Start worker AFTER server is listening and io is ready
    await startWorker();
});

// Graceful shutdown
const gracefulShutdown = async (signal: any) => {
    console.log(`🛑 Received ${signal}. Shutting down gracefully...`);
    try {
        if (bookingWorker) {
            console.log("closing booking worker")
            await bookingWorker.close();
            console.log("booking worker closed")
        }
        server.close(() => {
            console.log("closing server");
            process.exit(0);
        
        });
    } catch (err) {
        console.error("❌ Error during shutdown:", err);
        process.exit(1);
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));