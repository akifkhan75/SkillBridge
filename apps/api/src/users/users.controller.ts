import { Body, Controller, Get, NotFoundException, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'List all users (admin only)' })
  findAll() {
    return this.usersService.findAll();
  }

  // "me" must be declared before ":id".
  @Get('me')
  @ApiOperation({ summary: 'Own profile' })
  me(@CurrentUser('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update own name, language or photo' })
  updateMe(@CurrentUser('id') id: string, @Body() dto: UpdateMeDto) {
    return this.usersService.updateMe(id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user. Users can only read themselves; admins can read anyone.' })
  findOne(@Param('id') id: string, @CurrentUser('id') currentUserId: string, @CurrentUser('type') currentUserType: string) {
    if (id !== currentUserId && currentUserType !== 'admin') throw new NotFoundException('User not found');
    return this.usersService.findById(id);
  }
}
