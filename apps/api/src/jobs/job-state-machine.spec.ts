import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { assertTransition, JOB_TRANSITIONS, JobStatus } from './job-state-machine';

describe('job state machine', () => {
  it('allows the happy path in order', () => {
    assertTransition('MATCHES_FOUND', 'AWAITING_WORKER', 'customer');
    assertTransition('AWAITING_WORKER', 'ACCEPTED', 'worker');
    assertTransition('ACCEPTED', 'IN_PROGRESS', 'worker');
    assertTransition('IN_PROGRESS', 'COMPLETED', 'worker');
  });

  it('rejects skipping steps (cannot jump straight to COMPLETED)', () => {
    expect(() => assertTransition('MATCHES_FOUND', 'COMPLETED', 'worker')).toThrow(BadRequestException);
    expect(() => assertTransition('ACCEPTED', 'COMPLETED', 'worker')).toThrow(BadRequestException);
  });

  it('rejects the wrong actor', () => {
    expect(() => assertTransition('ACCEPTED', 'IN_PROGRESS', 'customer')).toThrow(ForbiddenException);
    expect(() => assertTransition('IN_PROGRESS', 'COMPLETED', 'customer')).toThrow(ForbiddenException);
    expect(() => assertTransition('AWAITING_WORKER', 'ACCEPTED', 'customer')).toThrow(ForbiddenException);
  });

  it('treats COMPLETED and CANCELLED as terminal', () => {
    for (const from of ['COMPLETED', 'CANCELLED'] as JobStatus[]) {
      expect(JOB_TRANSITIONS[from]).toHaveLength(0);
      expect(() => assertTransition(from, 'IN_PROGRESS', 'admin')).toThrow(BadRequestException);
    }
  });

  it('does not let a customer cancel once work has started', () => {
    expect(() => assertTransition('IN_PROGRESS', 'CANCELLED', 'customer')).toThrow(ForbiddenException);
  });
});
