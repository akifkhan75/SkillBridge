import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AddressesService } from './addresses.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('addresses')
@Controller('addresses')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new address' })
  create(@CurrentUser('id') userId: string, @Body() data: any) {
    return this.addressesService.create(userId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all addresses for user' })
  findAll(@CurrentUser('id') userId: string) {
    return this.addressesService.findAll(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update address' })
  update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() data: any) {
    return this.addressesService.update(id, userId, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.addressesService.remove(id, userId);
  }
}
