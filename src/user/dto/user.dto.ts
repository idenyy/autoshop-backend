import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @MinLength(8)
  @IsString()
  password: string;
}
