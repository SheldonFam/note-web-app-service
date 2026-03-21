import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.tagsService.findAll(userId);
  }
}
