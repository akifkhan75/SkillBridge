import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PropertiesService } from './properties.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('properties')
@Controller('properties')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new property for user' })
  createProperty(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.propertiesService.createProperty(userId, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties for the current user' })
  getProperties(@CurrentUser('id') userId: string) {
    return this.propertiesService.getUserProperties(userId);
  }

  @Post(':id/assets')
  @ApiOperation({ summary: 'Add an asset (e.g. HVAC) to a property' })
  addAsset(@Param('id') propertyId: string, @Body() body: any) {
    return this.propertiesService.addAsset(propertyId, body);
  }

  @Post('assets/:assetId/warranties')
  @ApiOperation({ summary: 'Add a warranty to an asset' })
  addWarranty(@Param('assetId') assetId: string, @Body() body: any) {
    return this.propertiesService.addWarranty(assetId, body);
  }
}
