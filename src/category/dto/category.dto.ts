import { IsString } from 'class-validator'

export class CategoryDto {
  @IsString()
  title: string

  @IsString()
  description: string
}
