import { checkPassword } from './password';

describe('checkPassword', () => {
  it('accepts a reasonable password', () => expect(checkPassword('blue-Tiger-42')).toEqual([]));
  it('rejects short, common, repeated, and phone-number passwords', () => {
    expect(checkPassword('abc')).toContain('TOO_SHORT');
    expect(checkPassword('Password123')).toContain('COMMON');
    expect(checkPassword('aaaaaaaaaa')).toContain('ALL_SAME');
    expect(checkPassword('03001234567', '+923001234567')).toContain('IS_PHONE');
  });
  it('rejects passwords over bcrypt\'s 72-byte limit', () => {
    expect(checkPassword('x'.repeat(40) + 'é'.repeat(30))).toContain('TOO_LONG');
  });
});
