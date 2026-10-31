import { Controller, Post, Body, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IamService } from './iam.service';
import { LoginPasswordDto, RequestOtpDto, VerifyOtpDto } from './dto/login.dto';
import { DpdpConsentDto, DpdpDeleteRequestDto } from './dto/privacy.dto';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor';

@ApiTags('IAM & Authentication')
@Controller('auth')
@UseInterceptors(AuditLogInterceptor)
export class AuthController {
  constructor(private readonly iamService: IamService) {}

  @Post('login-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with email and password (Staff / Admin)' })
  @ApiResponse({ status: 200, description: 'Authentication successful with JWT' })
  async loginPassword(@Body() dto: LoginPasswordDto) {
    return this.iamService.loginWithPassword(dto);
  }

  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request phone OTP for guest mobile login' })
  @ApiResponse({ status: 200, description: 'CSPRNG OTP dispatched' })
  async requestOtp(@Body() dto: RequestOtpDto) {
    return this.iamService.requestOtp(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify phone OTP and create session' })
  @ApiResponse({ status: 200, description: 'Session initialized' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.iamService.verifyOtp(dto);
  }
}

@ApiTags('DPDP Privacy Compliance')
@Controller('privacy')
@UseInterceptors(AuditLogInterceptor)
export class PrivacyController {
  constructor(private readonly iamService: IamService) {}

  @Post('consent')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record explicit India DPDP Act consent' })
  async recordConsent(@Body() dto: DpdpConsentDto) {
    return this.iamService.recordConsent('guest-usr-1', dto);
  }

  @Post('export')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Statutory personal data export archive' })
  async exportData() {
    return this.iamService.exportUserData('guest-usr-1');
  }

  @Post('delete-request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Statutory right-to-erasure deletion request' })
  async deleteAccount(@Body() dto: DpdpDeleteRequestDto) {
    return this.iamService.requestAccountDeletion('guest-usr-1', dto);
  }
}
