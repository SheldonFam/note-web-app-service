import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const tags = await this.prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { noteTags: true } },
      },
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      noteCount: tag._count.noteTags,
    }));
  }
}
