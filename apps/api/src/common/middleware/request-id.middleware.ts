import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

const SAFE_ID = /^[A-Za-z0-9._-]{8,64}$/;

/** Gives every request a correlation ID (honouring a sane inbound one) and echoes it back. */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const inbound = req.header('x-request-id');
  const id = inbound && SAFE_ID.test(inbound) ? inbound : `req_${randomUUID()}`;
  (req as any).requestId = id;
  res.setHeader('x-request-id', id);
  next();
}
