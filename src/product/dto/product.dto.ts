import { ArrayMinSize, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  @ArrayMinSize(1)
  @IsNotEmpty()
  @IsString({ each: true })
  images: string[]

  @IsString()
  @IsNotEmpty()
  categoryId: string

  @IsString()
  @IsNotEmpty()
  supplierId: string
}

export class UpdateProductDto extends PartialType(ProductDto) {}
