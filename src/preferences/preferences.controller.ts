import { Controller, Get, Patch, Body } from '@nestjs/common';
import { PreferencesService } from './preferences.service.js';
import { UpdatePreferencesDto } from './dto/update-preferences.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  get(@CurrentUser('id') userId: string) {
    return this.preferencesService.get(userId);
  }

  @Patch()
  update(@CurrentUser('id') userId: string, @Body() dto: UpdatePreferencesDto) {
    return this.preferencesService.update(userId, dto);
  }
}
