import { createHmac, timingSafeEqual } from 'crypto';
import { createReadStream, promises as fs } from 'fs';
import * as path from 'path';
import { StorageDriver, UploadTarget } from './storage.types';

/** Keys we generate look like  avatar/<ownerId>/<uuid>.jpg  — anything else never touches the disk. */
export const SAFE_KEY = /^[a-z_]+\/[A-Za-z0-9_-]{1,64}\/[A-Za-z0-9-]{8,64}\.(jpg|png|webp|m4a)$/;

export class LocalStorageDriver implements StorageDriver {
  constructor(
    private readonly rootDir: string,
    private readonly publicApiUrl: string,
    private readonly secret: string,
  ) {}

  private sign(kind: string, key: string, exp: number, extra = ''): string {
    return createHmac('sha256', this.secret).update(`${kind}|${key}|${exp}|${extra}`).digest('hex');
  }

  verify(kind: 'put' | 'get', key: string, exp: number, sig: string, extra = ''): boolean {
    if (!SAFE_KEY.test(key) || !Number.isFinite(exp) || exp < Date.now() / 1000) return false;
    const expected = this.sign(kind, key, exp, extra);
    return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  }

  pathFor(key: string): string {
    if (!SAFE_KEY.test(key)) throw new Error('Invalid storage key');
    return path.join(this.rootDir, key);
  }

  async createUploadTarget({ key, mime, size }: { key: string; mime: string; size: number }): Promise<UploadTarget> {
    const exp = Math.floor(Date.now() / 1000) + 600;
    const sig = this.sign('put', key, exp, String(size));
    const url = `${this.publicApiUrl}/files/upload?key=${encodeURIComponent(key)}&exp=${exp}&size=${size}&sig=${sig}`;
    return { url, method: 'PUT', headers: { 'Content-Type': mime } };
  }

  async write(key: string, chunks: AsyncIterable<Buffer>, maxBytes: number): Promise<number> {
    const file = this.pathFor(key);
    await fs.mkdir(path.dirname(file), { recursive: true });
    const handle = await fs.open(file, 'w');
    let total = 0;
    try {
      for await (const chunk of chunks) {
        total += chunk.length;
        if (total > maxBytes) throw new RangeError('too large');
        await handle.write(chunk);
      }
    } catch (e) {
      await handle.close();
      await fs.rm(file, { force: true });
      throw e;
    }
    await handle.close();
    return total;
  }

  async stat(key: string) {
    try {
      const s = await fs.stat(this.pathFor(key));
      return { size: s.size };
    } catch {
      return null;
    }
  }

  async readHead(key: string, bytes: number): Promise<Buffer> {
    const handle = await fs.open(this.pathFor(key), 'r');
    try {
      const buf = Buffer.alloc(bytes);
      const { bytesRead } = await handle.read(buf, 0, bytes, 0);
      return buf.subarray(0, bytesRead);
    } finally {
      await handle.close();
    }
  }

  async read(key: string): Promise<Buffer> {
    return fs.readFile(this.pathFor(key));
  }

  publicUrl(key: string): string {
    return `${this.publicApiUrl}/files/public/${key}`;
  }

  async signedGetUrl(key: string, ttlSeconds: number): Promise<string> {
    const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
    return `${this.publicApiUrl}/files/private?key=${encodeURIComponent(key)}&exp=${exp}&sig=${this.sign('get', key, exp)}`;
  }

  stream(key: string) {
    return createReadStream(this.pathFor(key));
  }

  async remove(key: string): Promise<void> {
    await fs.rm(this.pathFor(key), { force: true });
  }
}
