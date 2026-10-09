import { BadRequestException, ForbiddenException } from '@nestjs/common';

export type JobStatus =
  | 'CREATED'
  | 'MATCHES_FOUND'
  | 'AWAITING_WORKER'
  | 'ACCEPTED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'AWAITING_CONFIRMATION'
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
    // Customer accepts a worker's offer: the worker already committed by offering, so it is booked.
    { to: 'ACCEPTED', actors: ['customer'] },
    { to: 'CANCELLED', actors: ['customer', 'admin'] },
  ],
  AWAITING_WORKER: [
    { to: 'ACCEPTED', actors: ['worker'] },
    { to: 'MATCHES_FOUND', actors: ['worker', 'customer', 'system'] },
    { to: 'CANCELLED', actors: ['customer', 'admin'] },
  ],
  ACCEPTED: [
    { to: 'EN_ROUTE', actors: ['worker'] },
    { to: 'ARRIVED', actors: ['worker'] }, // allowed to skip en-route if they forgot
    { to: 'IN_PROGRESS', actors: ['worker'] }, // allowed to skip en-route/arrived if they forgot
    { to: 'CANCELLED', actors: ['customer', 'worker', 'admin'] },
  ],
  EN_ROUTE: [
    { to: 'ARRIVED', actors: ['worker'] },
    { to: 'IN_PROGRESS', actors: ['worker'] },
    { to: 'CANCELLED', actors: ['customer', 'worker', 'admin'] },
  ],
  ARRIVED: [
    { to: 'IN_PROGRESS', actors: ['worker'] },
    { to: 'CANCELLED', actors: ['customer', 'worker', 'admin'] },
  ],
  IN_PROGRESS: [
    { to: 'AWAITING_CONFIRMATION', actors: ['worker'] },
    { to: 'CANCELLED', actors: ['admin'] },
  ],
  AWAITING_CONFIRMATION: [
    { to: 'COMPLETED', actors: ['customer', 'admin', 'worker'] }, // worker might auto-confirm if customer doesn't
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
