import { INestApplication, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import type { ServerOptions } from 'socket.io';

/**
 * Socket.io over Redis pub/sub: an event emitted on one API instance reaches sockets connected
 * to any other. Without it, a customer connected to server A would never hear about an offer
 * made through server B.
 */
export class RedisIoAdapter extends IoAdapter {
  private adapter?: ReturnType<typeof createAdapter>;
  private clients: { quit(): Promise<unknown> }[] = [];

  async connect(url: string) {
    const pub = createClient({ url });
    const sub = pub.duplicate();
    for (const c of [pub, sub]) c.on('error', (e) => Logger.error(`Redis (realtime): ${e.message}`, 'RedisIoAdapter'));
    await Promise.all([pub.connect(), sub.connect()]);
    this.clients = [pub, sub];
    this.adapter = createAdapter(pub, sub);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    if (this.adapter) server.adapter(this.adapter);
    return server;
  }

  async close() {
    await Promise.allSettled(this.clients.map((c) => c.quit()));
  }
}

/** Call before app.listen(). Uses Redis only when REDIS_URL is set (single instance otherwise). */
export async function configureRealtime(app: INestApplication, redisUrl = process.env.REDIS_URL) {
  if (!redisUrl) return undefined;
  const adapter = new RedisIoAdapter(app);
  await adapter.connect(redisUrl);
  app.useWebSocketAdapter(adapter);
  Logger.log('Realtime fan-out via Redis', 'Bootstrap');
  return adapter;
}
