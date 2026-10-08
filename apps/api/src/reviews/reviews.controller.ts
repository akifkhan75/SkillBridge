import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('reviews')
@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Review the other party of a completed job' })
  create(@CurrentUser() user: { id: string; type: string }, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user, dto);
  }

  @Get('user/:targetId')
  @ApiOperation({ summary: 'Reviews received by a user/worker' })
  findByTarget(@Param('targetId') targetId: string) {
    return this.reviewsService.findByTarget(targetId);
  }
}
