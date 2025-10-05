import redis from '@tutorr/common';
import { Queue } from 'bullmq';

// Warning: This script should only be run in dev environment, NOT in production!

async function cleanNotifications() {
    console.log("🧹 Cleaning up existing notifications...");
    const notificationQueue = new Queue("notification", { connection: redis });

    try {

        const allJobs = await notificationQueue.getJobs(['wait', 'active', 'delayed', 'completed', 'failed']);
        
        console.log(`📊 Found ${allJobs.length} job(s)`);

        if (allJobs.length > 0) {
            console.log("🗑️  Removing jobs...");

            for (const job of allJobs) {
                console.log(`  - Removing job ${job.id}`);
                await job.remove();
            }

            console.log(`✅ Removed ${allJobs.length} job(s) successfully!`);
        } else {
            console.log("✅ No jobs found to remove");
        }

    } catch (error) {
        console.error("❌ Something went wrong while removing notifications:", error);
        process.exit(1);
    } finally {
        await notificationQueue.close();
        await redis.quit();
    }
}

cleanNotifications();