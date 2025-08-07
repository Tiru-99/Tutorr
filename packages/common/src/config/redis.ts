import { Redis } from 'ioredis';
import dotenv from 'dotenv'

dotenv.config({ path: '../../.env' })
const redis = new Redis({
    host : process.env.REDIS_HOST,
    port : Number(process.env.REDIS_PORT),
    maxRetriesPerRequest : null
});

export default redis ; 