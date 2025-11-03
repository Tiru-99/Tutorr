import express, { Request, Response } from "express";
import { BackgroundJobWorker, BackgroundJobQueue } from "@tutorr/common";
import getRedis from "@tutorr/common";

// bull-board imports
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";

const app = express();
let redis = getRedis(); 
// Initialize worker
new BackgroundJobWorker(redis);

// Initialize the queue (same queue as in scheduler.ts)
const backgroundJobQueue = new BackgroundJobQueue(redis);

// Setup Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(backgroundJobQueue.getQueue())],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

// Health route
app.get("/health", (req: Request, res: Response) => {
  res.json({ message: "Ok ! Server is doing good" });
});

async function startServer() {
  // Schedule cron job
  const existingSchedulers = await backgroundJobQueue.getQueue().getJobSchedulers();

  for (const scheduler of existingSchedulers) {
    console.log(`Removing existing scheduler: ${scheduler.key}`);
    await backgroundJobQueue.getQueue().removeJobScheduler(scheduler.key);
  }

  await backgroundJobQueue.addCron(
    "cron",
    {
      attempts: 5,
      backoff: 3000,
      removeOnFail: 100,
    }
  );

  // start server
  app.listen(8003, () => {
    console.log(`🚀 Server running on port 8003`);
    console.log(`📊 Bull Board available at http://localhost:8003/admin/queues`);
  });
}


startServer();
