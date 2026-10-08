import { Logger, OnModuleDestroy } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { createClient } from 'redis';

// Atomic: count the hit, start the window on the first hit, and block once over the limit.
const SCRIPT = `
local hits = redis.call('INCR', KEYS[1])
if hits == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
local ttl = redis.call('PTTL', KEYS[1])
local blocked = redis.call('PTTL', KEYS[2])
if blocked <= 0 and hits > tonumber(ARGV[2]) then
  redis.call('SET', KEYS[2], '1', 'PX', ARGV[3])
  blocked = tonumber(ARGV[3])
end
return { hits, ttl, blocked }`;

/** Rate limits shared by every API instance, so a login brute-force can't spread across servers. */
export class RedisThrottlerStorage implements ThrottlerStorage, OnModuleDestroy {
  private readonly client: ReturnType<typeof createClient>;
  private ready: Promise<unknown>;

  constructor(url: string) {
    this.client = createClient({ url });
    this.client.on('error', (e) => Logger.error(`Redis (rate limits): ${e.message}`, RedisThrottlerStorage.name));
    this.ready = this.client.connect();
  }

  async increment(key: string, ttl: number, limit: number, blockDuration: number, throttlerName: string) {
    await this.ready;
    const k = `throttle:${throttlerName}:${key}`;
    const [hits, ttlMs, blockMs] = (await this.client.eval(SCRIPT, {
      keys: [k, `${k}:blocked`], arguments: [String(ttl), String(limit), String(blockDuration || ttl)],
    })) as number[];
    return {
      totalHits: hits,
      timeToExpire: Math.max(0, Math.ceil(ttlMs / 1000)),
      isBlocked: blockMs > 0,
      timeToBlockExpire: Math.max(0, Math.ceil(blockMs / 1000)),
    };
  }

  async onModuleDestroy() {
    await this.client.quit().catch(() => undefined);
  }
}
