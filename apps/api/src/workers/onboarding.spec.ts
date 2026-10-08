import { computeOnboarding, latestCases } from './onboarding';

const base = {
  skillCount: 2, serviceLat: 24.86, serviceLng: 67.0, serviceRadius: 10, hoursDays: 5,
  pricingModel: 'CALLOUT_PLUS_QUOTE', minimumCallOutFee: 100000, hourlyRate: null,
  cases: [{ type: 'ID', status: 'SUBMITTED' }, { type: 'SELFIE', status: 'SUBMITTED' }],
};

describe('computeOnboarding', () => {
  it('is complete when every step is done', () => {
    const r = computeOnboarding(base);
    expect(r).toMatchObject({ complete: true, percent: 100, missing: [] });
  });

  it.each([
    ['skills', { skillCount: 0 }],
    ['area', { serviceLat: null }],
    ['hours', { hoursDays: 0 }],
    ['pricing', { pricingModel: null }],
    ['documents', { cases: [{ type: 'ID', status: 'SUBMITTED' }] }],
  ])('reports %s as missing', (step, patch) => {
    const r = computeOnboarding({ ...base, ...patch } as any);
    expect(r.complete).toBe(false);
    expect(r.missing).toEqual([step]);
    expect(r.percent).toBe(80);
  });

  it('pricing: hourly needs an hourly rate, call-out models need a fee, quote-only needs nothing', () => {
    expect(computeOnboarding({ ...base, pricingModel: 'HOURLY', hourlyRate: null }).steps.pricing).toBe(false);
    expect(computeOnboarding({ ...base, pricingModel: 'HOURLY', hourlyRate: 80000 }).steps.pricing).toBe(true);
    expect(computeOnboarding({ ...base, pricingModel: 'FIXED', minimumCallOutFee: 0 }).steps.pricing).toBe(false);
    expect(computeOnboarding({ ...base, pricingModel: 'QUOTE', minimumCallOutFee: null }).steps.pricing).toBe(true);
  });

  it('a rejected or needs-info document must be redone', () => {
    for (const status of ['REJECTED', 'NEEDS_INFO']) {
      const r = computeOnboarding({ ...base, cases: [{ type: 'ID', status }, { type: 'SELFIE', status: 'APPROVED' }] });
      expect(r.steps.documents).toBe(false);
    }
  });

  it('only the latest case per type counts', () => {
    const newestFirst = [
      { type: 'ID', status: 'SUBMITTED' },
      { type: 'ID', status: 'REJECTED' },
      { type: 'SELFIE', status: 'APPROVED' },
    ];
    expect(latestCases(newestFirst)).toEqual([{ type: 'ID', status: 'SUBMITTED' }, { type: 'SELFIE', status: 'APPROVED' }]);
    expect(computeOnboarding({ ...base, cases: latestCases(newestFirst) }).steps.documents).toBe(true);
  });
});
