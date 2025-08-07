import { bookingWorker } from "../config/worker";

(async () => {
    try {
        console.log("🚀 Starting worker...");
        
        // Wait for worker to be ready instead of calling runWorker()
        await bookingWorker.waitUntilReady();
        console.log("✅ Worker is running and ready to process jobs.");

        // Graceful shutdown handling
        const gracefulShutdown = async (signal :any) => {
            console.log(`🛑 Received ${signal}. Closing worker gracefully...`);
            try {
                await bookingWorker.close();
                process.exit(0);
            } catch (err) {
                console.error("❌ Error closing worker:", err);
                process.exit(1);
            }
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

    } catch (error) {
        console.error("❌ Failed to start worker:", error);
        process.exit(1);
    }
})();