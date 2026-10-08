import type { JobPhase } from '../components/ds/StatusTimeline';

export type JobStatusName = 'CREATED' | 'MATCHES_FOUND' | 'AWAITING_WORKER' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type Viewer = 'customer' | 'worker';

/** One plain sentence per state and viewer (doc 22 §7.3). Raw enum names never reach the screen. */
export function statusSentence(status: string, viewer: Viewer, other?: string | null): string {
  const name = other ?? (viewer === 'customer' ? 'Your professional' : 'The customer');
  switch (status as JobStatusName) {
    case 'CREATED': return viewer === 'customer' ? 'Sending your request…' : 'New request';
    case 'MATCHES_FOUND': return viewer === 'customer' ? 'Your request is open to professionals near you' : 'Open request';
    case 'AWAITING_WORKER': return viewer === 'customer' ? `Waiting for ${name} to confirm` : 'A customer chose you. Please accept or decline.';
    case 'ACCEPTED': return viewer === 'customer' ? `${name} accepted your job` : 'Booked. Get ready to go.';
    case 'IN_PROGRESS': return viewer === 'customer' ? `${name} is working on it` : 'Work in progress';
    case 'COMPLETED': return 'Done';
    case 'CANCELLED': return 'Cancelled';
    default: return 'Updating…';
  }
}

export function statusIcon(status: string): 'time-outline' | 'checkmark-circle' | 'close-circle' | 'construct' | 'hourglass-outline' | 'calendar-outline' {
  switch (status as JobStatusName) {
    case 'COMPLETED': return 'checkmark-circle';
    case 'CANCELLED': return 'close-circle';
    case 'IN_PROGRESS': return 'construct';
    case 'ACCEPTED': return 'calendar-outline';
    case 'AWAITING_WORKER': return 'hourglass-outline';
    default: return 'time-outline';
  }
}

/** Maps the server status onto the timeline steps that exist today. */
export function toPhase(status: string): JobPhase {
  switch (status as JobStatusName) {
    case 'ACCEPTED': return 'BOOKED';
    case 'IN_PROGRESS': return 'WORKING';
    case 'COMPLETED': return 'DONE';
    default: return 'REQUESTED';
  }
}

export const isActive = (s: string) => s === 'ACCEPTED' || s === 'IN_PROGRESS';
export const isFinished = (s: string) => s === 'COMPLETED' || s === 'CANCELLED';

/** One line per timeline event, written for the person reading it. */
export function eventSentence(type: string, viewer: Viewer, payload?: Record<string, unknown> | null): string {
  switch (type) {
    case 'REQUEST_SENT': return viewer === 'customer' ? 'You sent your request' : 'Request sent';
    case 'DETAILS_EDITED': return viewer === 'customer' ? 'You changed the details' : 'Details changed';
    case 'WORKER_REQUESTED': return viewer === 'customer' ? 'You chose a professional' : 'The customer chose you';
    case 'WORKER_ACCEPTED': return viewer === 'customer' ? 'The professional accepted' : 'You accepted';
    case 'WORKER_DECLINED': return viewer === 'customer' ? 'The professional could not take it' : 'You declined';
    case 'WORK_STARTED': return 'Work started';
    case 'WORK_COMPLETED': return 'Work finished';
    case 'CANCELLED': {
      const by = payload?.by;
      return by === 'customer' ? (viewer === 'customer' ? 'You cancelled' : 'The customer cancelled') : by === 'worker' ? 'The professional cancelled' : 'Cancelled';
    }
    default: return 'Updated';
  }
}

export const CANCEL_REASON_LABEL: Record<string, string> = {
  NO_LONGER_NEEDED: "I don't need it any more",
  FOUND_SOMEONE_ELSE: 'I found someone else',
  TOO_SLOW: 'It is taking too long',
  WRONG_DETAILS: 'I entered the wrong details',
  OTHER: 'Other reason',
};

/** "Today, 2–9 PM" / "Tue 14 Oct, 5–9 PM" in the device's language and timezone. */
export function formatWindow(fromIso: string | null, toIso: string | null, when: string | null, locale = 'en'): string {
  if (when === 'NOW') return 'As soon as possible';
  if (!fromIso || !toIso) return '';
  const from = new Date(fromIso);
  const to = new Date(toIso);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86_400_000);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const day = sameDay(from, today) ? 'Today' : sameDay(from, tomorrow) ? 'Tomorrow'
    : new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(from);
  const time = (d: Date) => new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: d.getMinutes() ? '2-digit' : undefined }).format(d);
  return `${day}, ${time(from)} – ${time(to)}`;
}
