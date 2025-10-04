import { Redis } from 'ioredis';
import dotenv from 'dotenv'

dotenv.config({ path: '../../.env' })
const mode = process.env.NODE_ENV

let redis : Redis
if (mode === "production") {
    //for prod
    redis = new Redis(process.env.REDIS_URL!, {
        maxRetriesPerRequest: null,
        tls: {},
    });
} else {
    // for dev
    redis = new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        maxRetriesPerRequest: null
    });
}




export default redis; 