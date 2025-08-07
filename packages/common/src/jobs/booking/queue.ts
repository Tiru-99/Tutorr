import { BaseQueue } from "../../bull/BaseQueue";
import { Redis } from 'ioredis';

export class BookingQueue extends BaseQueue<any> {
    constructor( redis : Redis ){
        super('booking' , redis)
    }
}