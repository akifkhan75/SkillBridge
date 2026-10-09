import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ALL_COUNTRY_CODES, COUNTRIES, type CountryListItem } from '@fixli/shared';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('config')
@Controller('config')
export class AppConfigController {
  constructor(private readonly config: ConfigService) {}

  /** Country reference data + which countries may sign up right now. Public: needed before login. */
  @Public()
  @Get('countries')
  @ApiOperation({ summary: 'Countries and whether signup is open in each' })
  countries(): CountryListItem[] {
    const enabled = this.config.get<string[]>('ENABLED_COUNTRIES') ?? ['PK'];
    return ALL_COUNTRY_CODES.map((code) => ({ ...COUNTRIES[code], enabled: enabled.includes(code) }));
  }
}
