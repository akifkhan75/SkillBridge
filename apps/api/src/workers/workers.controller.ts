import { Controller, Get, Param, Patch, Put, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { WorkersService } from './workers.service';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('workers')
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active workers' })
  @ApiQuery({ name: 'skill', required: false })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  findAll(
    @Query('skill') skill?: string,
    @Query('minRating') minRating?: number,
  ) {
    return this.workersService.findAll({ skill, minRating });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get worker by ID' })
  findOne(@Param('id') id: string) {
    return this.workersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update worker profile' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('type') userType: string,
    @Body() dto: UpdateWorkerDto,
  ) {
    return this.workersService.update(id, userId, userType, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update worker profile (full)' })
  replace(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('type') userType: string,
    @Body() dto: UpdateWorkerDto,
  ) {
    return this.workersService.update(id, userId, userType, dto);
  }
}
