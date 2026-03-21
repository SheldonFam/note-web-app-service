import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { UpdateNoteDto } from './dto/update-note.dto.js';
import { QueryNotesDto } from './dto/query-notes.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateNoteDto) {
    return this.notesService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string, @Query() query: QueryNotesDto) {
    return this.notesService.findAll(userId, query);
  }

  @Get(':id')
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) noteId: string,
  ) {
    return this.notesService.findOne(userId, noteId);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) noteId: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(userId, noteId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) noteId: string,
  ) {
    return this.notesService.remove(userId, noteId);
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  archive(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) noteId: string,
  ) {
    return this.notesService.archive(userId, noteId);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  restore(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) noteId: string,
  ) {
    return this.notesService.restore(userId, noteId);
  }
}
