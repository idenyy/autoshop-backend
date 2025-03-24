import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { OrderStatus } from '@prisma/client'
import { Type } from 'class-transformer'

export class OrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus

  @IsNumber()
  total: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]

  @IsString()
  userId: string

  @IsOptional()
  @IsString()
  paymentIntentId?: string | null

  @IsOptional()
  @IsString()
  paymentStatus?: string | null
}

export class OrderItemDto {
  @IsNumber()
  quantity: number

  @IsNumber()
  price: number

  @IsString()
  productId: string
}
