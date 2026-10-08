import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { StorageService } from './storage.service';
import { UploadsController } from './uploads.controller';
import { FilesController } from './files.controller';
import { AvatarUrlInterceptor } from './avatar-url.interceptor';
import { LocalStorageDriver } from './local.driver';
import { S3StorageDriver } from './s3.driver';
import { STORAGE_DRIVER, StorageDriver } from './storage.types';

@Global()
@Module({
  controllers: [UploadsController, FilesController],
  providers: [
    {
      provide: STORAGE_DRIVER,
      inject: [ConfigService],
      useFactory: (config: ConfigService): StorageDriver => {
        const get = <T = string>(k: string) => config.get<T>(k);
        if (get('STORAGE_DRIVER') === 's3') {
          return new S3StorageDriver({
            bucket: get('S3_BUCKET')!,
            region: get('S3_REGION') ?? 'auto',
            endpoint: get('S3_ENDPOINT'),
            accessKeyId: get('S3_ACCESS_KEY_ID'),
            secretAccessKey: get('S3_SECRET_ACCESS_KEY'),
            publicBaseUrl: get('STORAGE_PUBLIC_BASE_URL')!,
          });
        }
        return new LocalStorageDriver(
          path.resolve(get('STORAGE_LOCAL_DIR') ?? 'storage'),
          get('PUBLIC_API_URL')!,
          get('STORAGE_SIGNING_SECRET') ?? get('JWT_SECRET')!,
        );
      },
    },
    StorageService,
    { provide: APP_INTERCEPTOR, useClass: AvatarUrlInterceptor },
  ],
  exports: [StorageService],
})
export class StorageModule {}
