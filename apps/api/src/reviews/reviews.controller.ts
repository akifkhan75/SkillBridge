import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReviewsService } from './reviews.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new review' })
  create(@CurrentUser('id') userId: string, @Body() data: any) {
    return this.reviewsService.create(userId, data);
  }

  @Get('user/:targetId')
  @ApiOperation({ summary: 'Get all reviews for a user/worker' })
  findByTarget(@Param('targetId') targetId: string) {
    return this.reviewsService.findByTarget(targetId);
  }
}
