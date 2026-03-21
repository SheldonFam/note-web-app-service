import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        isEmailVerified: true,
      },
    });
  }

  async create(email: string, passwordHash: string) {
    return this.prisma.user.create({
      data: { email, passwordHash },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async updatePassword(userId: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  async updateLastLogin(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }
}
