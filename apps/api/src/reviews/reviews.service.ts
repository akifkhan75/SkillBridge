import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(reviewerId: string, data: any) {
    const existingReview = await this.prisma.review.findFirst({
      where: {
        reviewerId,
        targetId: data.targetId,
      }
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this user');
    }

    const review = await this.prisma.review.create({
      data: {
        reviewerId,
        targetId: data.targetId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    const worker = await this.prisma.worker.findUnique({ where: { id: data.targetId } });
    if (worker) {
      const allReviews = await this.prisma.review.findMany({ where: { targetId: data.targetId } });
      const avg = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
      await this.prisma.worker.update({
        where: { id: data.targetId },
        data: { rating: avg },
      });
    }

    return review;
  }

  async findByTarget(targetId: string) {
    return this.prisma.review.findMany({
      where: { targetId },
      include: {
        reviewer: { select: { id: true, name: true, profileImageUrl: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
