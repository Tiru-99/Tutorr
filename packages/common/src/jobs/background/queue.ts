import { BaseQueue } from "../../bull/BaseQueue";
import { Redis } from "ioredis";


export class BackgroundJobQueue extends BaseQueue<any> {
    constructor(redis: Redis) {
        super("bgsq", redis);
    }

}
