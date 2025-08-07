import { Redis } from 'ioredis';

//redis lua script to 
// set the lockKey for the slot as locked 
// return fencingkey after locking 
// and expire the lock key after ttl 
const script = `
    local lockKey = KEYS[1]
    local fencingKey = KEYS[2]
    local ttl = tonumber(ARGV[1])

    local token = redis.call('INCR', fencingKey)
    local ok = redis.call('SETNX', lockKey, token)

    if ok == 1 then
        redis.call('PEXPIRE', lockKey, ttl)
        return token
    else
        return 0
    end
` ;

export async function acquireLockWithFencing(
    redis: Redis,
    lockKey: string,
    ttl: number // in milliseconds
): Promise<number> {
    const fencingKey = 'fencing:counter';

    const result = await redis.eval(script, 2, lockKey, fencingKey, ttl);
    return Number(result); // will be 0 if lock not acquired
}