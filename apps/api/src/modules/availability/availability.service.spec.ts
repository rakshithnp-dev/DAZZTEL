import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityService } from './availability.service';
import { PrismaService } from '../../common/prisma.service';

describe('AvailabilityService (Vertical Slice 1)', () => {
  let service: AvailabilityService;
  let prisma: PrismaService;
  let propertyId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvailabilityService, PrismaService],
    }).compile();

    service = module.get<AvailabilityService>(AvailabilityService);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.$connect();

    const property = await prisma.property.findFirstOrThrow({
      where: { code: 'GOA-ANJ-01' },
    });
    propertyId = property.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return all available beds including motorcycle segment when motorcycleStay is true', async () => {
    const result = await service.search({
      propertyId,
      checkInDate: '2026-12-01',
      checkOutDate: '2026-12-03',
      guestCount: 1,
      motorcycleStay: true,
    });

    expect(result).toBeDefined();
    expect(result.totalNights).toBe(2);
    expect(result.availableBedsCount).toBeGreaterThan(0);
    expect(result.motorcycleBedsAvailable).toBeGreaterThan(0);
    expect(result.parkingSpacesAvailable).toBe(6);
    expect(result.gearLockersAvailable).toBe(8);
  });

  it('should exclude motorcycle reserved beds when motorcycleStay is false', async () => {
    const resultWithMoto = await service.search({
      propertyId,
      checkInDate: '2026-12-01',
      checkOutDate: '2026-12-03',
      guestCount: 1,
      motorcycleStay: true,
    });

    const resultWithoutMoto = await service.search({
      propertyId,
      checkInDate: '2026-12-01',
      checkOutDate: '2026-12-03',
      guestCount: 1,
      motorcycleStay: false,
    });

    // Without moto stay, motorcycle-reserved beds are held back
    expect(resultWithoutMoto.availableBedsCount).toBeLessThan(
      resultWithMoto.availableBedsCount,
    );
    expect(resultWithoutMoto.motorcycleBedsAvailable).toBe(0);
  });
});
