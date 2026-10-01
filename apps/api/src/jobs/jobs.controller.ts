import { Controller, Get, Post, Patch, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('jobs')
@Controller('job-requests')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job request' })
  create(
    @CurrentUser('id') userId: string,
    @CurrentUser('name') userName: string,
    @Body() dto: CreateJobDto,
  ) {
    return this.jobsService.create(userId, userName, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all job requests (filtered by user role)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'jobType', required: false })
  findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('type') userType: string,
    @Query('status') status?: string,
    @Query('jobType') jobType?: string,
  ) {
    return this.jobsService.findAll(userId, userType, { status, jobType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job request by ID' })
  findOne(@Param('id') id: string) {
    return this.jobsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update job request (partial)' })
  update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update job request (full)' })
  replace(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto);
  }
}
