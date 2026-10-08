import { ExecutionContext, ForbiddenException, HttpException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { CreateReviewDto } from '../reviews/dto/review.dto';
import { CreateQuoteDto } from '../quotes/dto/quote.dto';

class Sample {
  @Roles('admin') adminOnly() {}
  open() {}
}

const ctx = (handler: Function, user: any) =>
  ({
    getHandler: () => handler,
    getClass: () => Sample,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  }) as unknown as ExecutionContext;

describe('RolesGuard', () => {
  const guard = new RolesGuard(new Reflector());
  it('blocks a non-admin from an admin route', () => {
    expect(() => guard.canActivate(ctx(Sample.prototype.adminOnly, { type: 'customer' }))).toThrow(ForbiddenException);
  });
  it('allows an admin', () => {
    expect(guard.canActivate(ctx(Sample.prototype.adminOnly, { type: 'admin' }))).toBe(true);
  });
  it('does not restrict routes with no @Roles', () => {
    expect(guard.canActivate(ctx(Sample.prototype.open, { type: 'customer' }))).toBe(true);
  });
});

describe('AllExceptionsFilter', () => {
  const run = (exception: unknown) => {
    const json = jest.fn();
    const res = { status: jest.fn().mockReturnValue({ json }) };
    const host = {
      switchToHttp: () => ({ getResponse: () => res, getRequest: () => ({ requestId: 'req_1', method: 'GET', originalUrl: '/x' }) }),
    };
    new AllExceptionsFilter().catch(exception, host as any);
    return { status: res.status.mock.calls[0][0], body: json.mock.calls[0][0] };
  };

  it('uses one envelope with a request id', () => {
    const { status, body } = run(new HttpException('Nope', 403));
    expect(status).toBe(403);
    expect(body).toEqual({ success: false, error: { code: 'FORBIDDEN', message: 'Nope', details: undefined, requestId: 'req_1' } });
  });

  it('turns validation arrays into VALIDATION_FAILED with details', () => {
    const { body } = run(new BadRequestException(['rating must not be greater than 5']));
    expect(body.error.code).toBe('VALIDATION_FAILED');
    expect(body.error.details).toEqual(['rating must not be greater than 5']);
  });

  it('never leaks internals on unexpected errors', () => {
    const { status, body } = run(new Error('connect ECONNREFUSED 10.0.0.5:5432 password=hunter2'));
    expect(status).toBe(500);
    expect(JSON.stringify(body)).not.toMatch(/ECONNREFUSED|hunter2|10\.0\.0\.5/);
  });
});

describe('DTO validation', () => {
  it('rejects ratings outside 1..5', async () => {
    for (const rating of [0, 6, 99999, 4.5]) {
      const errs = await validate(plainToInstance(CreateReviewDto, { jobRequestId: 'j', rating }));
      expect(errs.length).toBeGreaterThan(0);
    }
    expect(await validate(plainToInstance(CreateReviewDto, { jobRequestId: 'j', rating: 5 }))).toHaveLength(0);
  });

  it('rejects float / negative / huge money amounts', async () => {
    for (const totalAmount of [12.5, -1, 0, 1e12]) {
      const errs = await validate(plainToInstance(CreateQuoteDto, { jobRequestId: 'j', totalAmount }));
      expect(errs.length).toBeGreaterThan(0);
    }
  });
});
