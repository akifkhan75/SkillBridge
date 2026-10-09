import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

export interface AuditEntry {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
  ip?: string;
  userAgent?: string;
  requestId?: string;
}

const REDACT = /password|token|secret|otp|code/i;

function scrub(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined || value === null) return undefined;
  return JSON.parse(
    JSON.stringify(value, (k, v) => (k && REDACT.test(k) ? '[redacted]' : v)),
  ) as Prisma.InputJsonValue;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Never throws: an audit write failing must not break the business action, but it is logged. */
  async record(entry: AuditEntry): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: entry.actorId ?? null,
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId ?? null,
          before: scrub(entry.before),
          after: scrub(entry.after),
          ip: entry.ip,
          userAgent: entry.userAgent,
          requestId: entry.requestId,
        },
      });
    } catch (err) {
      this.logger.error(`Failed to write audit log for ${entry.action}`, err as Error);
    }
  }
}
