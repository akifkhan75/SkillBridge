import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('addresses')
@Controller('addresses')
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new address' })
  create(@CurrentUser('id') userId: string, @Body() data: CreateAddressDto) {
    return this.addressesService.create(userId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all addresses for user' })
  findAll(@CurrentUser('id') userId: string) {
    return this.addressesService.findAll(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update address' })
  update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() data: UpdateAddressDto) {
    return this.addressesService.update(id, userId, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.addressesService.remove(id, userId);
  }
}
