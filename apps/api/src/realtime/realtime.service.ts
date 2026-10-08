import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ChatGateway } from '../chat/gateways/chat.gateway';

/** Event names the app listens for. Payloads never contain an exact address or phone number. */
export type RealtimeEvent =
  | 'notification.created'
  | 'job.updated'
  | 'offers.updated'
  | 'feed.updated';

export interface Envelope<T = unknown> {
  id: string;
  type: RealtimeEvent;
  occurredAt: string;
  data: T;
}

/**
 * Sends events to the users' private rooms (user:{id}). With REDIS_URL set, the socket.io Redis
 * adapter fans this out across every API instance.
 */
@Injectable()
export class RealtimeService {
  constructor(private readonly gateway: ChatGateway) {}

  emitToUsers<T>(userIds: string[], type: RealtimeEvent, data: T): Envelope<T> {
    const envelope: Envelope<T> = { id: randomUUID(), type, occurredAt: new Date().toISOString(), data };
    const unique = [...new Set(userIds.filter(Boolean))];
    if (unique.length && this.gateway.server) this.gateway.server.to(unique.map((u) => `user:${u}`)).emit(type, envelope);
    return envelope;
  }
}
