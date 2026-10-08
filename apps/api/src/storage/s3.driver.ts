import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageDriver, UploadTarget } from './storage.types';

export interface S3Options {
  bucket: string;
  region: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  /** Public base URL (CDN or bucket website) used for public-read objects. */
  publicBaseUrl: string;
  forcePathStyle?: boolean;
}

/** S3 / R2 / MinIO. The browser/app PUTs straight to the bucket; the API never proxies bytes. */
export class S3StorageDriver implements StorageDriver {
  private readonly client: S3Client;

  constructor(private readonly opts: S3Options) {
    this.client = new S3Client({
      region: opts.region,
      endpoint: opts.endpoint,
      forcePathStyle: opts.forcePathStyle ?? !!opts.endpoint,
      credentials: opts.accessKeyId && opts.secretAccessKey
        ? { accessKeyId: opts.accessKeyId, secretAccessKey: opts.secretAccessKey }
        : undefined,
    });
  }

  async createUploadTarget({ key, mime, size, visibility }: { key: string; mime: string; size: number; visibility: 'public' | 'private' }): Promise<UploadTarget> {
    const command = new PutObjectCommand({
      Bucket: this.opts.bucket,
      Key: key,
      ContentType: mime,
      ContentLength: size,
      // Public-read objects live under a prefix the bucket policy makes readable; private ones never are.
      CacheControl: visibility === 'public' ? 'public, max-age=31536000, immutable' : 'private, no-store',
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: 600 });
    return {
      url,
      method: 'PUT',
      headers: {
        'Content-Type': mime,
        'Cache-Control': visibility === 'public' ? 'public, max-age=31536000, immutable' : 'private, no-store',
      },
    };
  }

  async stat(key: string) {
    try {
      const head = await this.client.send(new HeadObjectCommand({ Bucket: this.opts.bucket, Key: key }));
      return { size: head.ContentLength ?? 0 };
    } catch {
      return null;
    }
  }

  async readHead(key: string, bytes: number): Promise<Buffer> {
    const res = await this.client.send(
      new GetObjectCommand({ Bucket: this.opts.bucket, Key: key, Range: `bytes=0-${bytes - 1}` }),
    );
    return Buffer.from(await res.Body!.transformToByteArray());
  }

  async read(key: string): Promise<Buffer> {
    const res = await this.client.send(new GetObjectCommand({ Bucket: this.opts.bucket, Key: key }));
    return Buffer.from(await res.Body!.transformToByteArray());
  }

  publicUrl(key: string): string {
    return `${this.opts.publicBaseUrl.replace(/\/+$/, '')}/${key}`;
  }

  signedGetUrl(key: string, ttlSeconds: number): Promise<string> {
    return getSignedUrl(this.client, new GetObjectCommand({ Bucket: this.opts.bucket, Key: key }), { expiresIn: ttlSeconds });
  }

  async remove(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.opts.bucket, Key: key }));
  }
}
