import getRedis from "@tutorr/common";
import { Queue } from "bullmq";

let redis = getRedis(); 

async function cleanSchedulers() {
  console.log("🧹 Cleaning up existing job schedulers...");
  
  const queue = new Queue("bgsq", { connection: redis });
  
  try {
    const existingSchedulers = await queue.getJobSchedulers();
    
    if (existingSchedulers.length === 0) {
      console.log("✅ No existing schedulers found");
    } else {
      console.log(`Found ${existingSchedulers.length} scheduler(s) to remove:`);
      
      for (const scheduler of existingSchedulers) {
        console.log(`  - Removing: ${scheduler.key} (pattern: ${scheduler.pattern})`);
        await queue.removeJobScheduler(scheduler.key);
      }
      
      console.log("✅ All schedulers cleaned up");
    }
  } catch (error) {
    console.error("❌ Error cleaning schedulers:", error);
    process.exit(1);
  } finally {
    await queue.close();
    await redis.quit();
  }
}

cleanSchedulers();