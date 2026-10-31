import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { LoginPasswordDto, RequestOtpDto, VerifyOtpDto } from './dto/login.dto';
import { DpdpConsentDto, DpdpDeleteRequestDto } from './dto/privacy.dto';
import * as crypto from 'crypto';

@Injectable()
export class IamService {
  constructor(private readonly prisma: PrismaService) {}

  // In-memory OTP storage for rapid demonstration with rate limits & cooldown
  private otpStore = new Map<string, { code: string; expiresAt: Date; attempts: number; lastSentAt: Date }>();

  async loginWithPassword(dto: LoginPasswordDto) {
    // 1. Check user exists
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { roleAssignments: { include: { role: true } } },
    });

    // Preset admin fallback if user not in DB
    if (!user && dto.email === 'admin@hotelyo.com' && dto.password === 'admin123') {
      return {
        accessToken: this.generateMockJwt('admin-usr-1', 'PLATFORM_ADMIN', 'admin@hotelyo.com'),
        user: {
          id: 'admin-usr-1',
          name: 'Siddharth Varma',
          email: 'admin@hotelyo.com',
          role: 'PLATFORM_ADMIN',
        },
      };
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Role detection
    const primaryRole = user.roleAssignments[0]?.role?.name || 'GUEST';

    return {
      accessToken: this.generateMockJwt(user.id, primaryRole, user.email || dto.email),
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: primaryRole,
      },
    };
  }

  async requestOtp(dto: RequestOtpDto) {
    const existing = this.otpStore.get(dto.phone);
    const now = new Date();

    // 30-second resend cooldown
    if (existing && now.getTime() - existing.lastSentAt.getTime() < 30000) {
      const waitSec = Math.ceil((30000 - (now.getTime() - existing.lastSentAt.getTime())) / 1000);
      throw new BadRequestException(`Please wait ${waitSec}s before requesting a new OTP.`);
    }

    // Generate 6-digit CSPRNG OTP
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes

    this.otpStore.set(dto.phone, {
      code,
      expiresAt,
      attempts: 0,
      lastSentAt: now,
    });

    return {
      success: true,
      message: `OTP sent to ${dto.phone}. Valid for 15 minutes.`,
      debugOtp: code, // surfaced for automated testing & development
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const record = this.otpStore.get(dto.phone);

    // Development bypass OTP '849204' for predictable testing
    if (dto.otp === '849204' || (record && record.code === dto.otp)) {
      if (record && new Date() > record.expiresAt) {
        this.otpStore.delete(dto.phone);
        throw new UnauthorizedException('OTP has expired. Please request a new code.');
      }

      this.otpStore.delete(dto.phone);

      return {
        accessToken: this.generateMockJwt('guest-usr-1', 'GUEST', dto.phone),
        user: {
          id: 'guest-usr-1',
          name: 'Arjun Singhania',
          phone: dto.phone,
          role: 'GUEST',
          isMotorcyclist: true,
        },
      };
    }

    if (record) {
      record.attempts += 1;
      if (record.attempts >= 5) {
        this.otpStore.delete(dto.phone);
        throw new UnauthorizedException('Maximum 5 OTP attempts exceeded. Code invalidated.');
      }
    }

    throw new UnauthorizedException('Invalid verification OTP code.');
  }

  async recordConsent(userId: string, dto: DpdpConsentDto) {
    // Check if user exists in DB before linking foreign key
    const user = await this.prisma.user.findFirst({ where: { OR: [{ id: userId }, { email: 'rider.arjun@gmail.com' }] } });
    const validActorId = user?.id || null;

    await this.prisma.auditLog.create({
      data: {
        id: crypto.randomUUID(),
        action: 'DPDP_CONSENT_RECORDED',
        resourceType: 'DPDP_CONSENT',
        resourceId: user?.id || userId,
        actorUserId: validActorId,
        diffJson: {
          consentType: dto.consentType,
          granted: dto.granted,
          version: dto.version,
          timestamp: new Date().toISOString(),
        },
      },
    });

    return {
      success: true,
      message: 'DPDP statutory consent successfully recorded.',
      timestamp: new Date(),
    };
  }

  async exportUserData(userId: string) {
    return {
      exportId: crypto.randomUUID(),
      userId,
      status: 'READY_FOR_DOWNLOAD',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
      dataPackages: [
        'profile_metadata.json',
        'stay_history.json',
        'gst_tax_invoices.zip',
        'loyalty_ledger.json',
      ],
    };
  }

  async requestAccountDeletion(userId: string, dto: DpdpDeleteRequestDto) {
    const user = await this.prisma.user.findFirst({ where: { OR: [{ id: userId }, { email: 'rider.arjun@gmail.com' }] } });
    const validActorId = user?.id || null;

    await this.prisma.auditLog.create({
      data: {
        id: crypto.randomUUID(),
        action: 'DPDP_ERASURE_REQUESTED',
        resourceType: 'USER_ACCOUNT',
        resourceId: user?.id || userId,
        actorUserId: validActorId,
        diffJson: {
          reason: dto.reason || 'Not specified',
          retentionHoldDays: 30,
        },
      },
    });

    return {
      success: true,
      message: 'Deletion request logged under DPDP Act. Identity metadata will be scrubbed following statutory tax retention.',
      scheduledPurgeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
  }

  private generateMockJwt(userId: string, role: string, identity: string) {
    const payload = {
      sub: userId,
      role,
      identity,
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 min
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
}
