import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SupplierDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  address?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  phone?: string
}
