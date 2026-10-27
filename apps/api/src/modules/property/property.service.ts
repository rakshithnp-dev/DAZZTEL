import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class PropertyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.property.findMany({
      where: { status: 'ACTIVE' },
      include: {
        setting: true,
        _count: {
          select: { rooms: true, parkingSpaces: true, gearLockers: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        setting: true,
        rooms: {
          where: { isActive: true },
          include: {
            beds: { where: { isActive: true } },
          },
        },
        parkingSpaces: { where: { isActive: true } },
        gearLockers: { where: { isActive: true } },
        faqCategories: {
          include: {
            articles: { where: { isPublished: true } },
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }
}
