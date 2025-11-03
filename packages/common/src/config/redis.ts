import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

let redisInstance: Redis | null = null;

function getRedis(): Redis {
  if (!redisInstance) {
    const mode = process.env.NODE_ENV;
    
    if (mode === "production") {
      redisInstance = new Redis(process.env.REDIS_URL!, {
        maxRetriesPerRequest: null,
        tls: {},
      });
    } else {
      redisInstance = new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        maxRetriesPerRequest: null
      });
    }
  }
  
  return redisInstance;
}

export default getRedis;