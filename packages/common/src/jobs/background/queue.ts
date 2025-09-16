import { BaseQueue } from "../../bull/BaseQueue";
import { Redis } from "ioredis";
import { JobsOptions } from "bullmq";

export class BackgroundJobQueue extends BaseQueue<any> {
    constructor(redis: Redis) {
        super("bgsq", redis);
    }

}
