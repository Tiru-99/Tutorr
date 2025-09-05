import express from 'express';
import redis from '@tutorr/common';
import { BackgroundJobQueue } from '@tutorr/common';
import { BackgroundJobWorker } from '@tutorr/common';

const app = express();

const queue = new BackgroundJobQueue(redis);
const worker = new BackgroundJobWorker(redis);


//bull cron repeats every 12 hours
(async () => {
    await queue.addJob(
        "bgsq",
        {},
        {
            repeat: { every: 12 * 60 * 60 * 1000 },
            attempts: 3,   
            backoff: { type: 'exponential', delay: 5000 }
        }
    )
})();


app.get("/health", (req, res) => {
    res.json({
        message: "Health Ok!"
    });
});

app.listen(8003, () => {
    console.log(`The server is up and running on port 8003`)
});