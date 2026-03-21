import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdatePreferencesDto } from './dto/update-preferences.dto.js';

@Injectable()
export class PreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  async get(userId: string) {
    const pref = await this.prisma.userPreference.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    return {
      colorTheme: pref.colorTheme,
      fontTheme: pref.fontTheme,
    };
  }

  async update(userId: string, dto: UpdatePreferencesDto) {
    const data: Record<string, string> = {};
    if (dto.colorTheme !== undefined) data.colorTheme = dto.colorTheme;
    if (dto.fontTheme !== undefined) data.fontTheme = dto.fontTheme;

    const pref = await this.prisma.userPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });

    return {
      colorTheme: pref.colorTheme,
      fontTheme: pref.fontTheme,
    };
  }
}
