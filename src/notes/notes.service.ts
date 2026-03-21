import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { UpdateNoteDto } from './dto/update-note.dto.js';
import { QueryNotesDto } from './dto/query-notes.dto.js';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateNoteDto) {
    const tagConnections = dto.tags?.length
      ? await this.resolveTagConnections(userId, dto.tags)
      : [];

    const note = await this.prisma.note.create({
      data: {
        userId,
        title: dto.title,
        content: dto.content ?? '',
        noteTags: {
          create: tagConnections.map((tagId) => ({ tagId })),
        },
      },
      include: {
        noteTags: { include: { tag: true } },
      },
    });

    return this.formatNote(note);
  }

  async findAll(userId: string, query: QueryNotesDto) {
    const where: Prisma.NoteWhereInput = { userId };

    if (query.archived !== undefined) {
      where.isArchived = query.archived;
    }

    if (query.tag) {
      where.noteTags = {
        some: {
          tag: {
            normalizedName: query.tag.trim().toLowerCase(),
            userId,
          },
        },
      };
    }

    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { content: { contains: query.q, mode: 'insensitive' } },
        {
          noteTags: {
            some: {
              tag: {
                name: { contains: query.q, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    const [sortField, sortDir] = (query.sort ?? 'updatedAt:desc').split(':');
    const allowedSortFields = ['createdAt', 'updatedAt', 'title'];
    const orderBy: Prisma.NoteOrderByWithRelationInput = {
      [allowedSortFields.includes(sortField) ? sortField : 'updatedAt']:
        sortDir === 'asc' ? 'asc' : 'desc',
    };

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.note.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          noteTags: { include: { tag: true } },
        },
      }),
      this.prisma.note.count({ where }),
    ]);

    return {
      data: data.map((note) => this.formatNote(note)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, noteId: string) {
    const note = await this.prisma.note.findFirst({
      where: { id: noteId, userId },
      include: { noteTags: { include: { tag: true } } },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return this.formatNote(note);
  }

  async update(userId: string, noteId: string, dto: UpdateNoteDto) {
    await this.findOne(userId, noteId);

    const updated = await this.prisma.$transaction(async (tx) => {
      const data: Prisma.NoteUpdateInput = {};
      if (dto.title !== undefined) data.title = dto.title;
      if (dto.content !== undefined) data.content = dto.content;

      if (dto.tags !== undefined) {
        await tx.noteTag.deleteMany({ where: { noteId } });
        const tagConnections = await this.resolveTagConnections(
          userId,
          dto.tags,
        );
        data.noteTags = {
          create: tagConnections.map((tagId) => ({ tagId })),
        };
      }

      return tx.note.update({
        where: { id: noteId },
        data,
        include: { noteTags: { include: { tag: true } } },
      });
    });

    return this.formatNote(updated);
  }

  async remove(userId: string, noteId: string) {
    await this.findOne(userId, noteId);
    await this.prisma.note.delete({ where: { id: noteId } });
    return { message: 'Note deleted' };
  }

  async archive(userId: string, noteId: string) {
    await this.findOne(userId, noteId);
    const note = await this.prisma.note.update({
      where: { id: noteId },
      data: { isArchived: true },
      include: { noteTags: { include: { tag: true } } },
    });
    return this.formatNote(note);
  }

  async restore(userId: string, noteId: string) {
    await this.findOne(userId, noteId);
    const note = await this.prisma.note.update({
      where: { id: noteId },
      data: { isArchived: false },
      include: { noteTags: { include: { tag: true } } },
    });
    return this.formatNote(note);
  }

  private async resolveTagConnections(
    userId: string,
    tagNames: string[],
  ): Promise<string[]> {
    const tagIds: string[] = [];

    for (const rawName of tagNames) {
      const name = rawName.trim();
      if (!name) continue;

      const normalizedName = name.toLowerCase();

      const tag = await this.prisma.tag.upsert({
        where: {
          userId_normalizedName: { userId, normalizedName },
        },
        update: {},
        create: { userId, name, normalizedName },
      });

      tagIds.push(tag.id);
    }

    return tagIds;
  }

  private formatNote(note: {
    id: string;
    userId: string;
    title: string;
    content: string;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
    noteTags: { tag: { id: string; name: string } }[];
  }) {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      isArchived: note.isArchived,
      tags: note.noteTags.map((nt) => ({
        id: nt.tag.id,
        name: nt.tag.name,
      })),
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  }
}
