import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { PrismaService } from '../prisma.service'
import { PaymentService } from '../payment/payment.service'

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, PaymentService]
})
export class OrderModule {}
