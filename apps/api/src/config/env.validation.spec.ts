import { validateEnv } from './env.validation';

const base = {
  DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
  JWT_SECRET: 'a'.repeat(40),
};

describe('validateEnv', () => {
  it('accepts a valid development config and applies defaults', () => {
    const env = validateEnv(base);
    expect(env.PORT).toBe(3002);
    expect(env.NODE_ENV).toBe('development');
  });

  it('defaults to a 15 minute access token, 30 day refresh, Pakistan only', () => {
    const env = validateEnv(base);
    expect(env.JWT_EXPIRES_IN).toBe('15m');
    expect(env.REFRESH_TOKEN_DAYS).toBe(30);
    expect(env.ENABLED_COUNTRIES).toEqual(['PK']);
  });

  it('parses and validates ENABLED_COUNTRIES', () => {
    expect(validateEnv({ ...base, ENABLED_COUNTRIES: 'pk, ae' }).ENABLED_COUNTRIES).toEqual(['PK', 'AE']);
    expect(() => validateEnv({ ...base, ENABLED_COUNTRIES: 'PK,XX' })).toThrow(/XX/);
  });

  it('rejects a short JWT secret', () => {
    expect(() => validateEnv({ ...base, JWT_SECRET: 'short' })).toThrow(/JWT_SECRET/);
  });

  it('rejects a missing database url', () => {
    expect(() => validateEnv({ JWT_SECRET: base.JWT_SECRET })).toThrow(/DATABASE_URL/);
  });

  it('rejects the placeholder secret in production', () => {
    expect(() =>
      validateEnv({
        ...base,
        NODE_ENV: 'production',
        JWT_SECRET: 'super-secret-jwt-key-change-in-production',
        FRONTEND_URL: 'https://x.example',
      }),
    ).toThrow(/placeholder/);
  });

  it('requires FRONTEND_URL in production', () => {
    expect(() => validateEnv({ ...base, NODE_ENV: 'production' })).toThrow(/FRONTEND_URL/);
  });
});
