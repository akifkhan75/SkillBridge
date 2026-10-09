import { Logger } from '@nestjs/common';

export interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channelId?: string;
}

export type PushResult = { ok: true } | { ok: false; error: string; deadToken: boolean };

export interface PushProvider {
  readonly name: string;
  send(messages: PushMessage[]): Promise<PushResult[]>;
}

export const PUSH_PROVIDER = Symbol('PUSH_PROVIDER');

/** Expo's push service (FCM/APNs under the hood). Swappable for a direct FCM/APNs adapter later. */
export class ExpoPushProvider implements PushProvider {
  readonly name = 'expo';
  private readonly logger = new Logger(ExpoPushProvider.name);

  constructor(private readonly url: string, private readonly accessToken?: string) {}

  async send(messages: PushMessage[]): Promise<PushResult[]> {
    const results: PushResult[] = [];
    for (let i = 0; i < messages.length; i += 100) {
      const chunk = messages.slice(i, i + 100);
      try {
        const res = await fetch(this.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', Accept: 'application/json',
            ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}),
          },
          body: JSON.stringify(chunk.map((m) => ({ ...m, sound: 'default', priority: 'high' }))),
          signal: AbortSignal.timeout(10_000),
        });
        const body: any = await res.json().catch(() => ({}));
        const tickets: any[] = Array.isArray(body?.data) ? body.data : [];
        chunk.forEach((_, idx) => {
          const t = tickets[idx];
          if (t?.status === 'ok') results.push({ ok: true });
          else {
            const error = t?.details?.error ?? t?.message ?? `HTTP ${res.status}`;
            results.push({ ok: false, error, deadToken: error === 'DeviceNotRegistered' });
          }
        });
      } catch (e) {
        this.logger.warn(`Push send failed: ${(e as Error).message}`);
        chunk.forEach(() => results.push({ ok: false, error: 'transport', deadToken: false }));
      }
    }
    return results;
  }
}
