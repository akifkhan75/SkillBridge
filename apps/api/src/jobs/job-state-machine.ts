import { BadRequestException, ForbiddenException } from '@nestjs/common';

export type JobStatus =
  | 'CREATED'
  | 'MATCHES_FOUND'
  | 'AWAITING_WORKER'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type JobActor = 'customer' | 'worker' | 'admin' | 'system';

interface Rule {
  to: JobStatus;
  actors: JobActor[];
}

/**
 * The only place that defines which job status may follow which, and who may cause it.
 * Rejecting everything not listed here is what stops a client from jumping a job to COMPLETED.
 */
export const JOB_TRANSITIONS: Record<JobStatus, Rule[]> = {
  CREATED: [
    { to: 'MATCHES_FOUND', actors: ['system'] },
    { to: 'CANCELLED', actors: ['customer', 'admin'] },
  ],
  MATCHES_FOUND: [
    { to: 'AWAITING_WORKER', actors: ['customer'] },
    { to: 'CANCELLED', actors: ['customer', 'admin'] },
  ],
  AWAITING_WORKER: [
    { to: 'ACCEPTED', actors: ['worker'] },
    { to: 'MATCHES_FOUND', actors: ['worker', 'customer', 'system'] },
    { to: 'CANCELLED', actors: ['customer', 'admin'] },
  ],
  ACCEPTED: [
    { to: 'IN_PROGRESS', actors: ['worker'] },
    { to: 'CANCELLED', actors: ['customer', 'worker', 'admin'] },
  ],
  IN_PROGRESS: [
    { to: 'COMPLETED', actors: ['worker'] },
    { to: 'CANCELLED', actors: ['admin'] },
  ],
  COMPLETED: [],
  CANCELLED: [],
};

export function assertTransition(from: JobStatus, to: JobStatus, actor: JobActor): void {
  const rule = JOB_TRANSITIONS[from]?.find((r) => r.to === to);
  if (!rule) {
    throw new BadRequestException({
      code: 'ILLEGAL_JOB_TRANSITION',
      message: `A job that is ${from.toLowerCase().replace(/_/g, ' ')} cannot become ${to
        .toLowerCase()
        .replace(/_/g, ' ')}.`,
    });
  }
  if (!rule.actors.includes(actor)) {
    throw new ForbiddenException('You are not allowed to make this change to the job');
  }
}
