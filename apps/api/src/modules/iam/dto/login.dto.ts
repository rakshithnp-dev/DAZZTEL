import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class LoginPasswordDto {
  @ApiProperty({ example: 'admin@hotelyo.com', description: 'User email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'admin123', description: 'User master password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RequestOtpDto {
  @ApiProperty({ example: '+919823048291', description: 'Indian phone number with country code' })
  @IsString()
  @Matches(/^\+?[1-9]\d{9,14}$/, { message: 'Invalid phone number format' })
  phone!: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+919823048291', description: 'Indian phone number' })
  @IsString()
  phone!: string;

  @ApiProperty({ example: '849204', description: '6-digit CSPRNG OTP' })
  @IsString()
  @Length(6, 6)
  otp!: string;
}
