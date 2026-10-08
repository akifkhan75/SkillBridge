export type UploadPurposeName = 'AVATAR' | 'VERIFICATION' | 'PORTFOLIO' | 'JOB_PHOTO' | 'JOB_AUDIO' | 'CHAT_PHOTO';

export interface UploadPolicy {
  /** Public-read content (avatars, portfolio) vs private (identity documents, signed URLs only). */
  visibility: 'public' | 'private';
  maxBytes: number;
  mimes: readonly string[];
}

export const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'] as const;
/** expo-audio records AAC in an MPEG-4 container on both platforms. */
export const AUDIO_MIMES = ['audio/mp4', 'audio/m4a'] as const;

export const UPLOAD_POLICIES: Record<UploadPurposeName, UploadPolicy> = {
  AVATAR: { visibility: 'public', maxBytes: 3 * 1024 * 1024, mimes: IMAGE_MIMES },
  PORTFOLIO: { visibility: 'public', maxBytes: 8 * 1024 * 1024, mimes: IMAGE_MIMES },
  VERIFICATION: { visibility: 'private', maxBytes: 10 * 1024 * 1024, mimes: IMAGE_MIMES },
  // Job photos and voice notes are private: only the customer and workers allowed to see the job get signed links.
  JOB_PHOTO: { visibility: 'private', maxBytes: 8 * 1024 * 1024, mimes: IMAGE_MIMES },
  JOB_AUDIO: { visibility: 'private', maxBytes: 5 * 1024 * 1024, mimes: AUDIO_MIMES },
  CHAT_PHOTO: { visibility: 'private', maxBytes: 8 * 1024 * 1024, mimes: IMAGE_MIMES },
};

export interface UploadTarget {
  url: string;
  method: 'PUT';
  headers: Record<string, string>;
}

/** Everything the app needs from object storage. Local disk in dev/tests, S3-compatible in production. */
export interface StorageDriver {
  /** Where the client should PUT the bytes. `upload` carries the declared size/mime/visibility. */
  createUploadTarget(args: { key: string; mime: string; size: number; visibility: 'public' | 'private' }): Promise<UploadTarget>;
  /** Size of the stored object, or null if nothing was uploaded. */
  stat(key: string): Promise<{ size: number } | null>;
  /** First `bytes` bytes of the object (for magic-number sniffing). */
  readHead(key: string, bytes: number): Promise<Buffer>;
  /** Whole object, for server-side processing (AI analysis / transcription). */
  read(key: string): Promise<Buffer>;
  /** Stable URL for public-read objects. */
  publicUrl(key: string): string;
  /** Short-lived URL for private objects. */
  signedGetUrl(key: string, ttlSeconds: number): Promise<string>;
  remove(key: string): Promise<void>;
}

export const STORAGE_DRIVER = Symbol('STORAGE_DRIVER');

const MAGIC: { mime: string; test: (b: Buffer) => boolean }[] = [
  { mime: 'image/jpeg', test: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: 'image/png', test: (b) => b.length > 8 && b.readUInt32BE(0) === 0x89504e47 && b.readUInt32BE(4) === 0x0d0a1a0a },
  { mime: 'image/webp', test: (b) => b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP' },
];

/** The real type of the bytes, regardless of what the client claimed. */
export function sniffImageMime(head: Buffer): string | null {
  return MAGIC.find((m) => m.test(head))?.mime ?? null;
}

/** MPEG-4 audio (m4a/AAC): an "ftyp" box at offset 4 with an audio-capable brand. */
export function sniffAudioMime(head: Buffer): string | null {
  if (head.length < 12 || head.toString('ascii', 4, 8) !== 'ftyp') return null;
  const brand = head.toString('ascii', 8, 12);
  return ['M4A ', 'mp42', 'isom', 'mp41', 'M4B ', 'iso2', 'dash', '3gp4', '3gp5'].includes(brand) ? 'audio/mp4' : null;
}

/** Normalises equivalent spellings so "what was claimed" and "what we found" compare equal. */
export const canonicalMime = (m: string) => (m === 'audio/m4a' ? 'audio/mp4' : m);

export function sniffMime(head: Buffer): string | null {
  return sniffImageMime(head) ?? sniffAudioMime(head);
}

export const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'audio/mp4': 'm4a', 'audio/m4a': 'm4a',
};
