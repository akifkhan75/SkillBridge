import { Controller, Get, Inject, NotFoundException, Param, Put, Query, Req, Res, ForbiddenException, PayloadTooLargeException, BadRequestException } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { LocalStorageDriver, SAFE_KEY } from './local.driver';
import { STORAGE_DRIVER, StorageDriver } from './storage.types';

/**
 * Serves and receives files for the LOCAL driver only (development and tests).
 * With the S3 driver these routes 404 and clients talk to the bucket directly.
 * Authorisation is a signed, expiring URL; there is no session on these routes.
 */
@ApiExcludeController()
@Public()
@Controller('files')
export class FilesController {
  constructor(@Inject(STORAGE_DRIVER) private readonly driver: StorageDriver) {}

  private local(): LocalStorageDriver {
    if (!(this.driver instanceof LocalStorageDriver)) throw new NotFoundException();
    return this.driver;
  }

  @Put('upload')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  async upload(
    @Query('key') key: string,
    @Query('exp') exp: string,
    @Query('size') size: string,
    @Query('sig') sig: string,
    @Req() req: Request,
  ) {
    const local = this.local();
    if (!local.verify('put', key, Number(exp), sig, size)) throw new ForbiddenException('Upload link is invalid or expired');
    const max = Number(size);
    if (!Number.isInteger(max) || max < 1) throw new BadRequestException('Invalid size');
    try {
      await local.write(key, req as unknown as AsyncIterable<Buffer>, max);
    } catch (e) {
      if (e instanceof RangeError) throw new PayloadTooLargeException('File is larger than declared');
      throw e;
    }
    return { ok: true };
  }

  @Get('public/*')
  async getPublic(@Param('0') key: string, @Res() res: Response) {
    // Only public-read purposes are served here; verification documents never are.
    // Only public-read purposes are served here; identity documents and job media never are.
    if (!SAFE_KEY.test(key) || !/^(avatar|portfolio)\//.test(key)) throw new NotFoundException();
    const local = this.local();
    if (!(await local.stat(key))) throw new NotFoundException();
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.type(key.split('.').pop() === 'png' ? 'image/png' : key.endsWith('.webp') ? 'image/webp' : 'image/jpeg');
    local.stream(key).pipe(res);
  }

  @Get('private')
  async getPrivate(@Query('key') key: string, @Query('exp') exp: string, @Query('sig') sig: string, @Res() res: Response) {
    const local = this.local();
    if (!local.verify('get', key, Number(exp), sig)) throw new ForbiddenException('Link is invalid or expired');
    if (!(await local.stat(key))) throw new NotFoundException();
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.type(key.endsWith('.png') ? 'image/png' : key.endsWith('.webp') ? 'image/webp' : key.endsWith('.m4a') ? 'audio/mp4' : 'image/jpeg');
    local.stream(key).pipe(res);
  }
}
