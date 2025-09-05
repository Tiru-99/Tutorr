import { BaseQueue  } from "../../bull/BaseQueue";
import { Redis } from "ioredis";


export class BackgroundJobQueue extends BaseQueue<any>{
    constructor(redis : Redis ) {
        //bgsq -> background service queue
        super('bgsq' , redis )
    }
}