import { Controller, Get, Post, Body, Patch, Param, UseGuards, ForbiddenException, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ServiceCatalogService } from './service-catalog.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('service-catalog')
@Controller('service-catalog')
export class ServiceCatalogController {
  constructor(private readonly catalogService: ServiceCatalogService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get all service categories and their services' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  getAllCategories(@Query('includeInactive') includeInactive?: string) {
    return this.catalogService.getAllCategories(includeInactive === 'true');
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  getCategoryById(@Param('id') id: string) {
    return this.catalogService.getCategoryById(id);
  }

  @Post('categories')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new service category (Admin)' })
  createCategory(
    @CurrentUser('type') type: string,
    @Body() body: { name: string; description?: string; iconName?: string }
  ) {
    if (type !== 'admin') throw new ForbiddenException('Admin access required');
    return this.catalogService.createCategory(body);
  }

  @Patch('categories/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a service category (Admin)' })
  updateCategory(
    @CurrentUser('type') type: string,
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; iconName?: string; isActive?: boolean }
  ) {
    if (type !== 'admin') throw new ForbiddenException('Admin access required');
    return this.catalogService.updateCategory(id, body);
  }

  @Post('categories/:id/services')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new service to a category (Admin)' })
  addService(
    @CurrentUser('type') type: string,
    @Param('id') categoryId: string,
    @Body() body: { name: string; description?: string; basePrice?: number }
  ) {
    if (type !== 'admin') throw new ForbiddenException('Admin access required');
    return this.catalogService.addServiceToCategory(categoryId, body);
  }

  @Patch('services/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a specific service (Admin)' })
  updateService(
    @CurrentUser('type') type: string,
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; basePrice?: number; isActive?: boolean }
  ) {
    if (type !== 'admin') throw new ForbiddenException('Admin access required');
    return this.catalogService.updateService(id, body);
  }
}
