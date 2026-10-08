import { availableDuring, distanceKm, matchScore } from './rules';

const KHI = 'Asia/Karachi';
// Mon-Sat 09:00-18:00
const weekdays = [1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, startMinute: 540, endMinute: 1080 }));

describe('availableDuring', () => {
  // 2026-10-08 is a Thursday. 05:00Z = 10:00 Karachi.
  it('true when the window overlaps working hours in the worker\'s own timezone', () => {
    expect(availableDuring(weekdays, KHI, new Date('2026-10-08T05:00:00Z'), new Date('2026-10-08T07:00:00Z'))).toBe(true);
  });
  it('false at night', () => {
    // 20:00-22:00 Karachi
    expect(availableDuring(weekdays, KHI, new Date('2026-10-08T15:00:00Z'), new Date('2026-10-08T17:00:00Z'))).toBe(false);
  });
  it('false on a day off', () => {
    // Sunday 2026-10-11, 10:00-12:00 Karachi
    expect(availableDuring(weekdays, KHI, new Date('2026-10-11T05:00:00Z'), new Date('2026-10-11T07:00:00Z'))).toBe(false);
  });
  it('a window that starts before opening still counts if it overlaps', () => {
    // 07:00-10:00 Karachi
    expect(availableDuring(weekdays, KHI, new Date('2026-10-08T02:00:00Z'), new Date('2026-10-08T05:00:00Z'))).toBe(true);
  });
  it('timezone matters: the same instant is evening in Karachi but afternoon in Riyadh', () => {
    const from = new Date('2026-10-08T13:30:00Z'); // 18:30 KHI, 16:30 RUH
    const to = new Date('2026-10-08T14:30:00Z');
    expect(availableDuring(weekdays, KHI, from, to)).toBe(false);
    expect(availableDuring(weekdays, 'Asia/Riyadh', from, to)).toBe(true);
  });
  it('no hours set means not available', () => {
    expect(availableDuring([], KHI, new Date(), new Date(Date.now() + 3600_000))).toBe(false);
  });
});

describe('matchScore', () => {
  const base = { distanceKm: 2, radiusKm: 10, rating: 4.5, ratingCount: 20 };
  it('closer is better', () => {
    expect(matchScore({ ...base, distanceKm: 1 })).toBeGreaterThan(matchScore({ ...base, distanceKm: 8 }));
  });
  it('one lucky 5-star review does not beat a long, strong record', () => {
    expect(matchScore({ ...base, rating: 5, ratingCount: 1 })).toBeLessThan(matchScore({ ...base, rating: 4.7, ratingCount: 60 }));
  });
  it('a brand-new worker still gets a fair middle score, not zero', () => {
    const fresh = matchScore({ ...base, rating: 0, ratingCount: 0 });
    expect(fresh).toBeGreaterThan(0.3);
  });
  it('distance outweighs small rating gaps (never ranked on stars alone)', () => {
    expect(matchScore({ ...base, distanceKm: 1, rating: 4.2 })).toBeGreaterThan(matchScore({ ...base, distanceKm: 9, rating: 4.9 }));
  });
});

describe('distanceKm', () => {
  it('Karachi Saddar to Clifton is about 5 km', () => {
    expect(distanceKm(24.8546, 67.0208, 24.8138, 67.0300)).toBeGreaterThan(4);
    expect(distanceKm(24.8546, 67.0208, 24.8138, 67.0300)).toBeLessThan(6);
  });
});
