import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DpdpConsentDto {
  @ApiProperty({ example: 'dpdp_v1_terms_and_identity_retention', description: 'Consent policy identifier' })
  @IsString()
  @IsNotEmpty()
  consentType!: string;

  @ApiProperty({ example: true, description: 'Whether consent was granted' })
  @IsBoolean()
  granted!: boolean;

  @ApiProperty({ example: '1.0.0', description: 'Version of privacy notice accepted' })
  @IsString()
  version!: string;
}

export class DpdpDeleteRequestDto {
  @ApiProperty({ example: 'Account closure and statutory right to erasure', description: 'Reason for deletion request' })
  @IsString()
  @IsOptional()
  reason?: string;
}
