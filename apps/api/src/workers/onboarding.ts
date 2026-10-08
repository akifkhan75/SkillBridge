// Pure rules for "is this worker's profile complete enough to be reviewed?".
// Kept free of I/O so it is trivial to test and to reuse on the client's progress meter.

export interface OnboardingInput {
  skillCount: number;
  serviceLat: number | null;
  serviceLng: number | null;
  serviceRadius: number;
  hoursDays: number;
  pricingModel: string | null;
  minimumCallOutFee: number | null;
  hourlyRate: number | null;
  /** latest case per type */
  cases: { type: string; status: string }[];
}

export type OnboardingStep = 'skills' | 'area' | 'hours' | 'pricing' | 'documents';

export interface OnboardingState {
  steps: Record<OnboardingStep, boolean>;
  missing: OnboardingStep[];
  complete: boolean;
  percent: number;
}

const REQUIRED_DOCS = ['ID', 'SELFIE'] as const;

export function computeOnboarding(i: OnboardingInput): OnboardingState {
  const pricingOk =
    !!i.pricingModel &&
    (i.pricingModel === 'QUOTE' ||
      (i.pricingModel === 'HOURLY' ? (i.hourlyRate ?? 0) > 0 : (i.minimumCallOutFee ?? 0) > 0));

  const docsOk = REQUIRED_DOCS.every((t) => {
    const c = i.cases.find((x) => x.type === t);
    // submitted or approved counts; rejected / needs-info must be redone
    return !!c && (c.status === 'SUBMITTED' || c.status === 'APPROVED');
  });

  const steps: Record<OnboardingStep, boolean> = {
    skills: i.skillCount > 0,
    area: i.serviceLat != null && i.serviceLng != null && i.serviceRadius > 0,
    hours: i.hoursDays > 0,
    pricing: pricingOk,
    documents: docsOk,
  };
  const missing = (Object.keys(steps) as OnboardingStep[]).filter((s) => !steps[s]);
  return {
    steps,
    missing,
    complete: missing.length === 0,
    percent: Math.round(((5 - missing.length) / 5) * 100),
  };
}

/** Latest case per type (cases arrive newest-first). */
export function latestCases<T extends { type: string }>(cases: T[]): T[] {
  const seen = new Set<string>();
  return cases.filter((c) => (seen.has(c.type) ? false : (seen.add(c.type), true)));
}
