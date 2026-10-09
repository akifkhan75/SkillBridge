import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { StorageService } from './storage.service';

/**
 * `User.profileImageUrl` stores a storage key (not a URL, so changing the CDN/host never breaks
 * old rows). This turns it into a real URL in every response, wherever a user is embedded.
 */
@Injectable()
export class AvatarUrlInterceptor implements NestInterceptor {
  constructor(private readonly storage: StorageService) {}

  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => this.walk(data)));
  }

  private walk(value: unknown): unknown {
    if (Array.isArray(value)) return value.map((v) => this.walk(v));
    if (value && typeof value === 'object' && !(value instanceof Date)) {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        out[k] =
          k === 'profileImageUrl' && typeof v === 'string' && !/^https?:\/\//.test(v)
            ? this.storage.publicUrl(v)
            : this.walk(v);
      }
      return out;
    }
    return value;
  }
}
