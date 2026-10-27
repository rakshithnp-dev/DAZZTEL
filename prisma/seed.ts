import { PrismaClient, RoleName, PropertyStatus, RoomType, BedSegment } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Helper to hash password deterministically for development
function hashPassword(password: string): string {
  // Simple sha256 wrapper for seeding, production auth uses argon2
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Seeding HOTELYO Database...');

  // 1. Roles
  const roles: RoleName[] = [
    RoleName.GUEST,
    RoleName.GROUP_ORGANIZER,
    RoleName.FRONT_DESK,
    RoleName.HOUSEKEEPING,
    RoleName.MAINTENANCE,
    RoleName.PROPERTY_MANAGER,
    RoleName.VENDOR,
    RoleName.PLATFORM_ADMIN,
  ];

  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: `System role for ${name}`,
      },
    });
  }
  console.log('Roles seeded.');

  // 2. Global Platform Admin
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.PLATFORM_ADMIN } });
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hotelyo.in' },
    update: {},
    create: {
      email: 'admin@hotelyo.in',
      phone: '+919876543210',
      fullName: 'Super Admin',
      credentials: {
        create: {
          passwordHash: hashPassword('Admin@123'),
        },
      },
      roleAssignments: {
        create: {
          roleId: adminRole.id,
        },
      },
    },
  });
  console.log('Admin seeded:', adminUser.email);

  // 3. Property: HOTELYO Nomad Hostel - Anjuna, Goa
  const property = await prisma.property.upsert({
    where: { code: 'GOA-ANJ-01' },
    update: {},
    create: {
      code: 'GOA-ANJ-01',
      name: 'HOTELYO Nomad & Moto Hostel, Anjuna',
      description: 'The premier hostel for digital nomads and touring motorcyclists in North Goa. 50% beds motorcycle-ready with secure parking and gear lockers.',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      addressLine1: 'House No. 402/B, Dmello Vaddo',
      city: 'Anjuna',
      state: 'Goa',
      postalCode: '403509',
      country: 'IN',
      latitude: 15.5816,
      longitude: 73.7431,
      gstin: '30AAAAA0000A1Z5',
      phone: '+918322273000',
      email: 'anjuna@hotelyo.in',
      status: PropertyStatus.ACTIVE,
      setting: {
        create: {
          motorcycleBedPercent: 50,
          motorcycleReleaseHoursBefore: 24,
          standardCheckInTime: '13:00',
          standardCheckOutTime: '11:00',
          holdTimeoutMinutes: 10,
          sosEscalationMinutes: 2,
          gstNumber: '30AAAAA0000A1Z5',
          cgstPercent: 6.0,
          sgstPercent: 6.0,
          igstPercent: 12.0,
          allowFolioPost: true,
        },
      },
    },
  });
  console.log('Property seeded:', property.name);

  // 4. Staff & Property Manager
  const managerRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.PROPERTY_MANAGER } });
  const frontDeskRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.FRONT_DESK } });
  const housekeepingRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.HOUSEKEEPING } });

  const manager = await prisma.user.upsert({
    where: { email: 'manager.goa@hotelyo.in' },
    update: {},
    create: {
      email: 'manager.goa@hotelyo.in',
      phone: '+919876543211',
      fullName: 'Vikram Sethi',
      credentials: {
        create: { passwordHash: hashPassword('Manager@123') },
      },
      staffProfile: {
        create: {
          employeeCode: 'EMP-GOA-001',
          department: 'Management',
          isOnDuty: true,
        },
      },
      memberships: {
        create: {
          propertyId: property.id,
          title: 'General Manager',
        },
      },
      roleAssignments: {
        create: {
          roleId: managerRole.id,
          propertyId: property.id,
        },
      },
    },
  });

  const frontDesk = await prisma.user.upsert({
    where: { email: 'frontdesk.goa@hotelyo.in' },
    update: {},
    create: {
      email: 'frontdesk.goa@hotelyo.in',
      phone: '+919876543212',
      fullName: 'Pooja Sharma',
      credentials: {
        create: { passwordHash: hashPassword('Desk@123') },
      },
      staffProfile: {
        create: {
          employeeCode: 'EMP-GOA-002',
          department: 'Front Desk',
          isOnDuty: true,
        },
      },
      memberships: {
        create: {
          propertyId: property.id,
          title: 'Senior Front Desk Associate',
        },
      },
      roleAssignments: {
        create: {
          roleId: frontDeskRole.id,
          propertyId: property.id,
        },
      },
    },
  });
  console.log('Staff seeded.');

  // 5. Rooms and Beds (with exactly 50% motorcycle reserved beds)
  // Room 1: 6-Bed Mixed Dorm
  const dorm1 = await prisma.room.upsert({
    where: {
      propertyId_roomNumber: {
        propertyId: property.id,
        roomNumber: 'DORM-101',
      },
    },
    update: {},
    create: {
      propertyId: property.id,
      roomNumber: 'DORM-101',
      roomType: RoomType.DORM_MIXED,
      totalBeds: 6,
      floor: 1,
      basePricePaise: 79900, // ₹799/night
    },
  });

  for (let i = 1; i <= 6; i++) {
    // Beds 1-3 Standard, 4-6 Motorcycle Reserved (50%)
    const segment = i <= 3 ? BedSegment.STANDARD : BedSegment.MOTORCYCLE_RESERVED;
    await prisma.bed.upsert({
      where: {
        roomId_bedNumber: {
          roomId: dorm1.id,
          bedNumber: `B${i}`,
        },
      },
      update: {},
      create: {
        roomId: dorm1.id,
        bedNumber: `B${i}`,
        segment,
      },
    });
  }

  // Room 2: 4-Bed Female Dorm
  const dorm2 = await prisma.room.upsert({
    where: {
      propertyId_roomNumber: {
        propertyId: property.id,
        roomNumber: 'DORM-102',
      },
    },
    update: {},
    create: {
      propertyId: property.id,
      roomNumber: 'DORM-102',
      roomType: RoomType.DORM_FEMALE,
      totalBeds: 4,
      floor: 1,
      basePricePaise: 89900, // ₹899/night
    },
  });

  for (let i = 1; i <= 4; i++) {
    const segment = i <= 2 ? BedSegment.STANDARD : BedSegment.MOTORCYCLE_RESERVED;
    await prisma.bed.upsert({
      where: {
        roomId_bedNumber: {
          roomId: dorm2.id,
          bedNumber: `F${i}`,
        },
      },
      update: {},
      create: {
        roomId: dorm2.id,
        bedNumber: `F${i}`,
        segment,
      },
    });
  }

  // Room 3: Deluxe Private Room
  const pvtRoom = await prisma.room.upsert({
    where: {
      propertyId_roomNumber: {
        propertyId: property.id,
        roomNumber: 'PVT-201',
      },
    },
    update: {},
    create: {
      propertyId: property.id,
      roomNumber: 'PVT-201',
      roomType: RoomType.PRIVATE_ROOM,
      totalBeds: 1,
      floor: 2,
      basePricePaise: 249900, // ₹2,499/night
    },
  });

  await prisma.bed.upsert({
    where: {
      roomId_bedNumber: {
        roomId: pvtRoom.id,
        bedNumber: 'KING-1',
      },
    },
    update: {},
    create: {
      roomId: pvtRoom.id,
      bedNumber: 'KING-1',
      segment: BedSegment.STANDARD,
    },
  });
  console.log('Rooms & Beds seeded.');

  // 6. Bike Parking Spaces
  for (let i = 1; i <= 6; i++) {
    await prisma.parkingSpace.upsert({
      where: {
        propertyId_spaceNumber: {
          propertyId: property.id,
          spaceNumber: `MOTO-P${i}`,
        },
      },
      update: {},
      create: {
        propertyId: property.id,
        spaceNumber: `MOTO-P${i}`,
        dailyRatePaise: 10000, // ₹100/day
      },
    });
  }

  // 7. Gear Lockers
  for (let i = 1; i <= 8; i++) {
    await prisma.gearLocker.upsert({
      where: {
        propertyId_lockerNumber: {
          propertyId: property.id,
          lockerNumber: `LOCKER-L${i}`,
        },
      },
      update: {},
      create: {
        propertyId: property.id,
        lockerNumber: `LOCKER-L${i}`,
        dailyRatePaise: 5000, // ₹50/day
      },
    });
  }
  console.log('Motorcycle Parking & Gear Lockers seeded.');

  // 8. Test Motorcyclist Guest
  const guestRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.GUEST } });
  const motoGuest = await prisma.user.upsert({
    where: { email: 'rider.arjun@gmail.com' },
    update: {},
    create: {
      email: 'rider.arjun@gmail.com',
      phone: '+919988776655',
      fullName: 'Arjun Nambiar',
      credentials: {
        create: { passwordHash: hashPassword('Guest@123') },
      },
      guestProfile: {
        create: {
          nationality: 'IN',
          emergencyName: 'Ramesh Nambiar',
          emergencyPhone: '+919988776600',
          motorcyclist: true,
          bikeModel: 'Royal Enfield Himalayan 450',
          bikeRegNumber: 'GA-03-AB-4021',
        },
      },
      roleAssignments: {
        create: {
          roleId: guestRole.id,
        },
      },
      loyaltyAccount: {
        create: {
          pointsBalance: 150,
        },
      },
    },
  });
  console.log('Sample Guest seeded:', motoGuest.email);

  // 9. Vendor & Marketplace Menu
  const vendorRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.VENDOR } });
  const foodVendorUser = await prisma.user.upsert({
    where: { email: 'cafe.anjuna@hotelyo.in' },
    update: {},
    create: {
      email: 'cafe.anjuna@hotelyo.in',
      phone: '+919822114455',
      fullName: 'Anjuna Bay Cafe',
      credentials: {
        create: { passwordHash: hashPassword('Vendor@123') },
      },
      roleAssignments: {
        create: {
          roleId: vendorRole.id,
          propertyId: property.id,
        },
      },
    },
  });

  const vendorProfile = await prisma.vendorProfile.upsert({
    where: { userId: foodVendorUser.id },
    update: {},
    create: {
      userId: foodVendorUser.id,
      propertyId: property.id,
      businessName: 'The Rider Pitstop Cafe',
      serviceCategory: 'FOOD',
      contactPhone: '+919822114455',
    },
  });

  const menuItems = [
    { name: 'Masala Chai & Bun Maska', category: 'Breakfast', pricePaise: 8000, isVegetarian: true },
    { name: 'Goan Pao Bhaji', category: 'Breakfast', pricePaise: 12000, isVegetarian: true },
    { name: 'Classic Omelette with Toast', category: 'Breakfast', pricePaise: 14000, isVegetarian: false },
    { name: 'Paneer Tikka Roll', category: 'Snacks', pricePaise: 16000, isVegetarian: true },
    { name: 'Cold Brew Coffee', category: 'Beverages', pricePaise: 12000, isVegetarian: true },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: {
        propertyId: property.id,
        vendorId: vendorProfile.id,
        ...item,
      },
    });
  }
  console.log('Marketplace vendor & menu seeded.');

  // 10. Sample Coupon (Option B)
  await prisma.coupon.upsert({
    where: { code: 'MOTOEXPLORE10' },
    update: {},
    create: {
      code: 'MOTOEXPLORE10',
      description: '10% discount for touring motorcyclists and early nomads',
      isPercent: true,
      discountValue: 10,
      minSpendPaise: 100000, // ₹1,000 minimum spend
      maxDiscountPaise: 50000, // ₹500 maximum discount
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-12-31'),
      isActive: true,
    },
  });
  console.log('Coupons seeded.');

  // 11. FAQ Articles
  const faqCategory = await prisma.fAQCategory.create({
    data: {
      propertyId: property.id,
      name: 'Motorcyclist & Parking Queries',
      displayOrder: 1,
      articles: {
        create: [
          {
            question: 'Is bike parking secure at the hostel?',
            answer: 'Yes! We offer dedicated, gated, CCTV-monitored motorcycle parking spaces and heavy-duty ground anchors.',
          },
          {
            question: 'What size are the riding gear lockers?',
            answer: 'Each gear locker comfortably fits full-face helmets, armored jackets, riding boots, and saddlebags.',
          },
          {
            question: 'How does the arrival OTP work?',
            answer: 'On your check-in date, a secure 6-digit OTP is sent to your registered phone/email. Simply show it to the front-desk or enter it on the kiosk to get your room code.',
          },
        ],
      },
    },
  });
  console.log('FAQs seeded.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
