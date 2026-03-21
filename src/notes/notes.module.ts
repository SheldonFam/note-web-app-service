import { Module } from '@nestjs/common';
import { NotesService } from './notes.service.js';
import { NotesController } from './notes.controller.js';

@Module({
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
