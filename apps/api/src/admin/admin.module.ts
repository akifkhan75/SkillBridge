import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminVerificationService } from './admin-verification.service';

@Module({ controllers: [AdminController], providers: [AdminVerificationService] })
export class AdminModule {}
