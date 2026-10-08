import { statusSentence, toPhase, isActive, isFinished } from '../utils/jobStatus';

describe('job status vocabulary', () => {
  it('never shows a raw enum name', () => {
    for (const s of ['CREATED', 'MATCHES_FOUND', 'AWAITING_WORKER', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']) {
      for (const v of ['customer', 'worker'] as const) {
        expect(statusSentence(s, v)).not.toMatch(/[A-Z]+_[A-Z]+/);
      }
    }
  });
  it('is addressed to the viewer and uses the other person\'s name when known', () => {
    expect(statusSentence('AWAITING_WORKER', 'customer', 'Ahmed')).toBe('Waiting for Ahmed to confirm');
    expect(statusSentence('AWAITING_WORKER', 'worker')).toMatch(/accept or decline/);
    expect(statusSentence('IN_PROGRESS', 'customer', 'Ahmed')).toBe('Ahmed is working on it');
  });
  it('maps to timeline phases', () => {
    expect(toPhase('ACCEPTED')).toBe('BOOKED');
    expect(toPhase('IN_PROGRESS')).toBe('WORKING');
    expect(toPhase('COMPLETED')).toBe('DONE');
    expect(toPhase('MATCHES_FOUND')).toBe('REQUESTED');
  });
  it('groups', () => {
    expect(isActive('ACCEPTED') && isActive('IN_PROGRESS') && !isActive('COMPLETED')).toBe(true);
    expect(isFinished('CANCELLED') && isFinished('COMPLETED') && !isFinished('ACCEPTED')).toBe(true);
  });
});

import { eventSentence, formatWindow, CANCEL_REASON_LABEL } from '../utils/jobStatus';

describe('timeline wording', () => {
  it('speaks to the viewer', () => {
    expect(eventSentence('REQUEST_SENT', 'customer')).toBe('You sent your request');
    expect(eventSentence('WORKER_REQUESTED', 'worker')).toBe('The customer chose you');
    expect(eventSentence('CANCELLED', 'worker', { by: 'customer' })).toBe('The customer cancelled');
    expect(eventSentence('CANCELLED', 'customer', { by: 'customer' })).toBe('You cancelled');
    expect(eventSentence('SOMETHING_NEW', 'customer')).toBe('Updated');
  });
  it('has a label for every cancel reason the API accepts', () => {
    expect(Object.keys(CANCEL_REASON_LABEL).sort()).toEqual(['FOUND_SOMEONE_ELSE', 'NO_LONGER_NEEDED', 'OTHER', 'TOO_SLOW', 'WRONG_DETAILS']);
  });
});

describe('formatWindow', () => {
  it('says "as soon as possible" for Now', () => {
    expect(formatWindow(null, null, 'NOW')).toBe('As soon as possible');
  });
  it('names today and tomorrow', () => {
    const start = new Date(); start.setHours(14, 0, 0, 0);
    const end = new Date(); end.setHours(21, 0, 0, 0);
    expect(formatWindow(start.toISOString(), end.toISOString(), 'TODAY')).toMatch(/^Today, 2/);
    const t1 = new Date(start.getTime() + 86_400_000);
    const t2 = new Date(end.getTime() + 86_400_000);
    expect(formatWindow(t1.toISOString(), t2.toISOString(), 'TOMORROW')).toMatch(/^Tomorrow, /);
  });
  it('is empty rather than wrong when there is no window', () => {
    expect(formatWindow(null, null, 'SCHEDULED')).toBe('');
  });
});
